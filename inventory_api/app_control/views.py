from django.db.models import Count, Sum, F
from django.db.models.functions import Coalesce, TruncMonth
import codecs
import csv
from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from inventory_api.custom_methods import IsAuthenticatedCustom
from inventory_api.utils import CustomPagination, get_query
from .serializers import (
    Client, ClientSerializer, ClientWithAmountSerializer, Inventory,
    InventorySerializer, InventoryGroup, InventoryGroupSerializer,
    InventoryWithSumSerializer, Invoice, InvoiceItem, InvoiceSerializer,
)
from user_control.models import CustomUser
from user_control.views import add_user_activity


class InventoryView(ModelViewSet):
    queryset = Inventory.objects.select_related("group", "created_by")
    serializer_class = InventorySerializer
    permission_classes = (IsAuthenticatedCustom,)
    pagination_class = CustomPagination

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()
        data.pop("page", None)
        keyword = data.pop("keyword", None)

        results = self.queryset.filter(**data)

        if keyword:
            search_fields = (
                "code", "created_by__fullname", "created_by__email", 
                "group__name", "name"
            )
            query = get_query(keyword, search_fields)
            results = results.filter(query)
        
        return results


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InventoryGroupView(ModelViewSet):
    queryset = InventoryGroup.objects.select_related(
        "belongs_to", "created_by").prefetch_related("inventories")
    serializer_class = InventoryGroupSerializer
    permission_classes = (IsAuthenticatedCustom,)
    pagination_class = CustomPagination

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()
        data.pop("page", None)
        keyword = data.pop("keyword", None)

        results = self.queryset.filter(**data)

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "name"
            )
            query = get_query(keyword, search_fields)
            results = results.filter(query)

        return results.annotate(total_items=Count('inventories'))

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ClientView(ModelViewSet):
    queryset = Client.objects.prefetch_related("created_by").order_by("-created_at")
    serializer_class = ClientSerializer
    permission_classes = (IsAuthenticatedCustom,)
    pagination_class = CustomPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["name", "created_at"]

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()
        data.pop("page", None)
        keyword = data.pop("keyword", None)

        results = self.queryset.filter(**data)

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "name"
            )
            query = get_query(keyword, search_fields)
            results = results.filter(query)

        return results

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InvoiceView(ModelViewSet):
    queryset = Invoice.objects.select_related(
        "created_by", "client").prefetch_related("invoice_items")
    serializer_class = InvoiceSerializer
    permission_classes = (IsAuthenticatedCustom,)
    pagination_class = CustomPagination

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset

        data = self.request.query_params.dict()
        data.pop("page", None)
        keyword = data.pop("keyword", None)

        results = self.queryset.filter(**data)

        if keyword:
            search_fields = (
                "created_by__fullname", "created_by__email", "client__name"
            )
            query = get_query(keyword, search_fields)
            results = results.filter(query)
        
        return results

    def create(self, request, *args, **kwargs):
        request.data.update({"created_by_id":request.user.id})
        return super().create(request, *args, **kwargs)


class SummaryView(ModelViewSet):
    http_method_names = ('get',)
    permission_classes = (IsAuthenticatedCustom,)
    queryset = InventoryView.queryset

    def list(self, request, *args, **kwargs):
        total_inventory = InventoryView.queryset.filter(
            remaining__gt=0
        ).count()
        total_group = InventoryGroupView.queryset.count()
        total_client = ClientView.queryset.count()
        total_users = CustomUser.objects.filter(is_superuser=False).count()

        return Response({
            "total_inventory": total_inventory,
            "total_group": total_group,
            "total_client": total_client,
            "total_users": total_users
        })


class SalePerformanceView(ModelViewSet):
    http_method_names = ('get',)
    permission_classes = (IsAuthenticatedCustom,)
    queryset = InventoryView.queryset

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict() 
        total = query_data.get('total', None)
        query = self.queryset

        if not total:
            start_date = query_data.get("start_date", None)
            end_date = query_data.get("end_date", None)

            if start_date:
                query = query.filter(
                    inventory_invoices__created_at__range=[start_date, end_date]
                )

        items = query.annotate(
            sum_of_item=Coalesce(
                Sum("inventory_invoices__quantity"), 0
            )
        ).order_by('-sum_of_item')[0:10]

        response_data = InventoryWithSumSerializer(items, many=True).data
        return Response(response_data)


class SaleByClientView(ModelViewSet):
    http_method_names = ('get',)
    permission_classes = (IsAuthenticatedCustom,)
    queryset = InventoryView.queryset

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict() 
        total = query_data.get('total', None)
        monthly = query_data.get('monthly', None)
        query = ClientView.queryset

        if not total:
            start_date = query_data.get("start_date", None)
            end_date = query_data.get("end_date", None)

            if start_date:
                query = query.filter(
                    sale_client__created_at__range=[start_date, end_date]
                )

        if monthly:
            clients = query.annotate(month=TruncMonth('created_at')).values(
                'month', 'name').annotate(amount_total=Sum(
                    F("sale_client__invoice_items__quantity") * 
                    F("sale_client__invoice_items__amount")
                )).prefetch_related(None)

        else:
            clients = query.annotate(amount_total=Sum(
                    F("sale_client__invoice_items__quantity") * 
                    F("sale_client__invoice_items__amount")
                )).order_by("-amount_total").prefetch_related(None)

        response_data = ClientWithAmountSerializer(clients, many=True).data
        return Response(response_data)


class PurchaseView(ModelViewSet):
    http_method_names = ('get',)
    permission_classes = (IsAuthenticatedCustom,)
    queryset = InvoiceView.queryset

    def list(self, request, *args, **kwargs):
        query_data = request.query_params.dict() 
        total = query_data.get('total', None)
        query = InvoiceItem.objects.select_related("invoice", "item")

        if not total:
            start_date = query_data.get("start_date", None)
            end_date = query_data.get("end_date", None)

            if start_date:
                query = query.filter(
                    created_at__range=[start_date, end_date]
                )

        query = query.aggregate(
            amount_total=Sum(F('amount') * F('quantity')), total=Sum('quantity')
            )

        return Response({
            "price": "0.00" if not query.get("amount_total") else query.get("amount_total"),
            "count": 0 if not query.get("total") else query.get("total"),
        })


class InventoryCSVLoaderView(ModelViewSet):
    http_method_names = ('post',)
    queryset = InventoryView.queryset
    permission_classes = (IsAuthenticatedCustom,)
    serializer_class = InventorySerializer

    def create(self, request, *args, **kwargs):
        try:
            data = request.FILES['data']
        except Exception as e:
            raise Exception("You need to provide inventory CSV 'data'")

        inventory_items = []

        try:
            csv_reader = csv.reader(codecs.iterdecode(data, 'utf-8'))
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
                )
        except csv.Error as e:
            raise Exception(e)

        if not inventory_items:
            raise Exception("CSV file cannot be empty")

        data_validation = self.serializer_class(data=inventory_items, many=True)
        data_validation.is_valid(raise_exception=True)
        data_validation.save()

        return Response({"success": "Inventory items added successfully"})
