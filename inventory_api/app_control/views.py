from django.db.models import Count, Sum, F  # This module provides various database models and functions
from django.db.models.functions import Coalesce, TruncMonth  # This module provides database functions for query expressions
import codecs  # This module provides codecs for encoding and decoding data
import csv  # This module provides classes for reading and writing CSV files
from rest_framework import status  # This module provides HTTP status codes
from rest_framework.filters import OrderingFilter  # This module provides filtering functionality for REST framework
from rest_framework.response import Response  # This module provides response objects for REST framework
from rest_framework.viewsets import ModelViewSet  # This module provides base classes for viewsets in REST framework
from inventory_api.custom_methods import IsAuthenticatedCustom  # This module provides custom methods for inventory API
from inventory_api.utils import CustomPagination, get_query  # This module provides utility functions for the inventory API
from .serializers import (
    Client, ClientSerializer, ClientWithAmountSerializer, Inventory,
    InventorySerializer, InventoryGroup, InventoryGroupSerializer,
    InventoryWithSumSerializer, Invoice, InvoiceItem, InvoiceSerializer,
)  # These are the serializers used for serializing and deserializing data
from user_control.models import CustomUser  # This module provides the CustomUser model from the user_control app
from user_control.views import add_user_activity  # This module provides the function to add user activity


# This class defines a view to handle inventory groups
class InventoryView(ModelViewSet):
    queryset = Inventory.objects.select_related("group", "created_by")  # Queryset for retrieving inventory objects with related group and created_by objects
    serializer_class = InventorySerializer  # Serializer class for serializing and deserializing Inventory objects
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    pagination_class = CustomPagination  # Pagination class for paginating the results

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the data dictionary
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the data dictionary

        results = self.queryset.filter(**data)  # Apply filters to the queryset based on the remaining parameters

        if keyword:
            search_fields = (
                "code", "created_by__fullname", "created_by__email",
                "group__name", "name"
            )  # Specify the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Create a query object based on the keyword and search fields
            results = results.filter(query)  # Apply the query object as a filter to the results

        return results  # Return the filtered queryset

    def create(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)  # Create a serializer instance with the request data
            serializer.is_valid(raise_exception=True)  # Validate the serializer data, raising an exception if it is not valid
            serializer.save(created_by=request.user)  # Save the serializer data and set the "created_by" field to the current user
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return the serialized data in the response with a "201 Created" status


# This class defines a view to retrieve, update and delete an inventory object
class InventoryGroupView(ModelViewSet):
    queryset = InventoryGroup.objects.select_related(
        "belongs_to", "created_by").prefetch_related("inventories")  # Queryset for retrieving inventory group objects with related belongs_to and created_by objects and prefetched inventories
    serializer_class = InventoryGroupSerializer  # Serializer class for serializing and deserializing InventoryGroup objects
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    pagination_class = CustomPagination  # Pagination class for paginating the results

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the data dictionary
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the data dictionary

        results = self.queryset.filter(**data)  # Apply filters to the queryset based on the remaining parameters

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "name"
            )  # Specify the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Create a query object based on the keyword and search fields
            results = results.filter(query)  # Apply the query object as a filter to the results

        return results.annotate(total_items=Count('inventories'))  # Annotate the results with the total number of inventories in each group

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)  # Create a serializer instance with the request data
        serializer.is_valid(raise_exception=True)  # Validate the serializer data, raising an exception if it is not valid
        serializer.save(created_by=request.user)  # Save the serializer data and set the "created_by" field to the current user
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return the serialized data in the response with a "201 Created" status


# This view is used to retrieve the total number of inventories in each group
class ClientView(ModelViewSet):
    queryset = Client.objects.prefetch_related("created_by").order_by("-created_at")  # Queryset for retrieving Client objects with prefetched created_by objects, ordered by created_at field in descending order
    serializer_class = ClientSerializer  # Serializer class for serializing and deserializing Client objects
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    pagination_class = CustomPagination  # Pagination class for paginating the results
    filter_backends = [OrderingFilter]  # Filter backends for applying ordering to the results
    ordering_fields = ["name", "created_at"]  # Allowed fields for ordering the results

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the data dictionary
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the data dictionary

        results = self.queryset.filter(**data)  # Apply filters to the queryset based on the remaining parameters

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "name"
            )  # Specify the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Create a query object based on the keyword and search fields
            results = results.filter(query)  # Apply the query object as a filter to the results

        return results

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)  # Create a serializer instance with the request data
        serializer.is_valid(raise_exception=True)  # Validate the serializer data, raising an exception if it is not valid
        serializer.save(created_by=request.user)  # Save the serializer data and set the "created_by" field to the current user
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return the serialized data in the response with a "201 Created" status


# This view is used to retrieve the total number of inventories in each group
class InvoiceView(ModelViewSet):
    queryset = Invoice.objects.select_related(
        "created_by", "client").prefetch_related("invoice_items")  # Queryset for retrieving Invoice objects with related created_by and client objects and prefetched invoice_items
    serializer_class = InvoiceSerializer  # Serializer class for serializing and deserializing Invoice objects
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    pagination_class = CustomPagination  # Pagination class for paginating the results

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the data dictionary
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the data dictionary

        results = self.queryset.filter(**data)  # Apply filters to the queryset based on the remaining parameters

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "client__name"
            )  # Specify the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Create a query object based on the keyword and search fields
            results = results.filter(query)  # Apply the query object as a filter to the results
        
        return results

    def create(self, request, *args, **kwargs):
        request.data.update({"created_by_id":request.user.id})  # Add the "created_by_id" field to the request data with the current user's ID
        return super().create(request, *args, **kwargs)  # Call the create method of the parent class to handle the creation of the Invoice object


# This view provides a summary of various statistics related to the inventory system
class SummaryView(ModelViewSet):
    http_method_names = ('get',)  # Only allow GET requests for this view
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    queryset = InventoryView.queryset  # Queryset for retrieving Inventory objects from the InventoryView

    def list(self, request, *args, **kwargs):
        # Calculate the total number of inventories with remaining quantity greater than 0
        total_inventory = InventoryView.queryset.filter(
            remaining__gt=0
        ).count()

        # Calculate the total number of inventory groups
        total_group = InventoryGroupView.queryset.count()

        # Calculate the total number of clients
        total_client = ClientView.queryset.count()

        # Calculate the total number of non-superuser users
        total_users = CustomUser.objects.filter(is_superuser=False).count()

        # Return the summary statistics as a response
        return Response({
            "total_inventory": total_inventory,
            "total_group": total_group,
            "total_client": total_client,
            "total_users": total_users
        })


# This view provides a summary of the top-selling inventory items based on sales performance
class SalePerformanceView(ModelViewSet):
    http_method_names = ('get',)  # Only allow GET requests for this view
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    queryset = InventoryView.queryset  # Queryset for retrieving Inventory objects from the InventoryView

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict()  # Extract query parameters from the request
        total = query_data.get('total', None)  # Get the 'total' parameter from the query parameters
        query = self.queryset  # Use the base queryset for further filtering

        if not total:
            start_date = query_data.get("start_date", None)  # Get the 'start_date' parameter from the query parameters
            end_date = query_data.get("end_date", None)  # Get the 'end_date' parameter from the query parameters

            if start_date:
                # Filter the queryset to include inventory items sold within the specified date range
                query = query.filter(
                    inventory_invoices__created_at__range=[start_date, end_date]
                )

        items = query.annotate(
            sum_of_item=Coalesce(
                Sum("inventory_invoices__quantity"), 0
            )
        ).order_by('-sum_of_item')[0:10]  # Annotate the queryset with the sum of quantities sold and order by the highest sum

        response_data = InventoryWithSumSerializer(items, many=True).data  # Serialize the queryset to retrieve the necessary data
        return Response(response_data)  # Return the serialized data as a response


# This view provides a summary of sales by client, including the total sales amount
class SaleByClientView(ModelViewSet):
    http_method_names = ('get',)  # Only allow GET requests for this view
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    queryset = InventoryView.queryset  # Queryset for retrieving Inventory objects from the InventoryView

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict()  # Extract query parameters from the request
        total = query_data.get('total', None)  # Get the 'total' parameter from the query parameters
        monthly = query_data.get('monthly', None)  # Get the 'monthly' parameter from the query parameters
        query = ClientView.queryset  # Use the base queryset for further filtering

        if not total:
            start_date = query_data.get("start_date", None)  # Get the 'start_date' parameter from the query parameters
            end_date = query_data.get("end_date", None)  # Get the 'end_date' parameter from the query parameters

            if start_date:
                # Filter the queryset to include clients with sales within the specified date range
                query = query.filter(
                    sale_client__created_at__range=[start_date, end_date]
                )

        if monthly:
            # Aggregate the sales amount by month and client for monthly sales summary
            clients = query.annotate(month=TruncMonth('created_at')).values(
                'month', 'name').annotate(amount_total=Sum(
                    F("sale_client__invoice_items__quantity") * 
                    F("sale_client__invoice_items__amount")
                )).prefetch_related(None)

        else:
            # Aggregate the total sales amount by client for overall sales summary
            clients = query.annotate(amount_total=Sum(
                    F("sale_client__invoice_items__quantity") * 
                    F("sale_client__invoice_items__amount")
                )).order_by("-amount_total").prefetch_related(None)

        response_data = ClientWithAmountSerializer(clients, many=True).data  # Serialize the queryset to retrieve the necessary data
        return Response(response_data)  # Return the serialized data as a response


# This view provides a summary of purchases, including the total purchase amount and quantity
class PurchaseView(ModelViewSet):
    http_method_names = ('get',)  # Only allow GET requests for this view
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    queryset = InvoiceView.queryset  # Queryset for retrieving Invoice objects from the InvoiceView

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict()  # Extract query parameters from the request
        total = query_data.get('total', None)  # Get the 'total' parameter from the query parameters
        query = InvoiceItem.objects.select_related("invoice", "item")  # Queryset for retrieving InvoiceItem objects

        if not total:
            start_date = query_data.get("start_date", None)  # Get the 'start_date' parameter from the query parameters
            end_date = query_data.get("end_date", None)  # Get the 'end_date' parameter from the query parameters

            if start_date:
                # Filter the queryset to include invoice items created within the specified date range
                query = query.filter(
                    created_at__range=[start_date, end_date]
                )

        query = query.aggregate(
            amount_total=Sum(F('amount') * F('quantity')), total=Sum('quantity')
        )  # Aggregate the total purchase amount and quantity

        return Response({
            "price": "0.00" if not query.get("amount_total") else query.get("amount_total"),  # Retrieve the total purchase amount, or return "0.00" if it is None
            "count": 0 if not query.get("total") else query.get("total"),  # Retrieve the total quantity, or return 0 if it is None
        })  # Return the summary data as a response


# This view is used to load inventory items from a CSV file
class InventoryCSVLoaderView(ModelViewSet):
    http_method_names = ('post',)  # Only allow POST requests for this view
    queryset = InventoryView.queryset  # Queryset for retrieving Inventory objects from the InventoryView
    permission_classes = (IsAuthenticatedCustom,)  # Permission classes to control access to the view
    serializer_class = InventorySerializer  # Serializer class for validating and saving inventory items

    def create(self, request, *args, **kwargs):
        try:
            data = request.FILES['data']  # Get the uploaded CSV file from the request
        except Exception as e:
            raise Exception("You need to provide inventory CSV 'data'")  # Raise an exception if the CSV file is not provided

        inventory_items = []  # List to store the extracted inventory items from the CSV file

        try:
            csv_reader = csv.reader(codecs.iterdecode(data, 'utf-8'))  # Read the CSV file as a UTF-8 encoded text
            for row in csv_reader:
                if not row[0]:
                    continue
                inventory_items.append(
                    {
                        "group_id": row[0],
                        "total": row[1],
                        "name": row[2],
                        "price": row[3],
                        "photo": row[4],
                        "created_by_id": request.user.id
                    }
                )  # Extract the inventory item data from each row of the CSV file and add it to the list
        except csv.Error as e:
            raise Exception(e)  # Raise an exception if there is an error reading the CSV file

        if not inventory_items:
            raise Exception("CSV file cannot be empty")  # Raise an exception if the CSV file is empty

        data_validation = self.serializer_class(data=inventory_items, many=True)  # Create a serializer instance to validate the inventory items
        data_validation.is_valid(raise_exception=True)  # Validate the inventory items, raising an exception if they are invalid
        data_validation.save()  # Save the validated inventory items to the database

        return Response({"success": "Inventory items added successfully"})  # Return a success message as a response
