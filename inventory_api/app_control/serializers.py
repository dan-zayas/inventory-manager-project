from django.db import models  # Import the models module from Django
from .models import Inventory, InventoryGroup, Client, Invoice, InvoiceItem  # Import the models related to inventory, groups, clients, invoices, and invoice items
from user_control.serializers import CustomUserSerializer  # Import the CustomUserSerializer from the user_control app
from rest_framework import serializers  # Import the serializers module from the Django REST Framework

# This serializer is used to convert InventoryGroup model instances into JSON representations
class InventoryGroupSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)  # Serializer field to represent the created_by relationship as a nested serializer
    created_by_id = serializers.CharField(write_only=True, required=False)  # Serializer field to handle the created_by_id attribute
    belongs_to = serializers.SerializerMethodField(read_only=True)  # Serializer method field to handle the belongs_to relationship as a nested serializer
    belongs_to_id = serializers.CharField(write_only=True, required=False)  # Serializer field to handle the belongs_to_id attribute
    total_items = serializers.CharField(read_only=True, required=False)  # Serializer field to represent the total number of items in the group

    class Meta:
        model = InventoryGroup  # Specify the model to be serialized
        fields = "__all__"  # Include all fields of the model in the serializer

    def get_belongs_to(self, obj):
        if obj.belongs_to is not None:  # Check if the group has a parent group
            return InventoryGroupSerializer(obj.belongs_to).data  # Serialize the parent group using the same serializer
        return None  # Return None if the group does not have a parent group


# This serializer is used to convert Inventory model instances into JSON representations
class InventorySerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)  # Serializer field to represent the created_by relationship as a nested serializer
    created_by_id = serializers.CharField(write_only=True, required=False)  # Serializer field to handle the created_by_id attribute
    group = InventoryGroupSerializer(read_only=True)  # Serializer field to represent the group relationship as a nested serializer
    group_id = serializers.CharField(write_only=True)  # Serializer field to handle the group_id attribute

    class Meta:
        model = Inventory  # Specify the model to be serialized
        fields = "__all__"  # Include all fields of the model in the serializer


# This serializer is used to convert Inventory model instances into JSON representations
class InventoryWithSumSerializer(InventorySerializer):
    sum_of_item = serializers.IntegerField()  # Serializer field to represent the sum of items attribute


# This serializer is used to convert Client model instances into JSON representations
class ClientSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)  # Serializer field to represent the created_by relationship as a nested serializer
    created_by_id = serializers.CharField(write_only=True, required=False)  # Serializer field to handle the created_by_id attribute
    amount_total = serializers.CharField(read_only=True, required=False)  # Serializer field to represent the amount_total attribute
    count_total = serializers.CharField(read_only=True, required=False)  # Serializer field to represent the count_total attribute

    class Meta:
        model = Client  # Specify the model to be serialized
        fields = "__all__"  # Include all fields of the model in the serializer


# This serializer extends the ClientSerializer and includes the amount_total field as a Float serializer field
class ClientWithAmountSerializer(ClientSerializer):
    amount_total = serializers.FloatField()  # Serializer field to represent the amount_total attribute as a Float
    month = serializers.CharField(required=False)  # Serializer field to handle the month attribute


# This serializer is used to convert InvoiceItem model instances into JSON representations
class InvoiceItemSerializer(serializers.ModelSerializer):
    invoice = serializers.CharField(read_only=True)  # Serializer field to represent the invoice relationship as a read-only CharField
    invoice_id = serializers.CharField(write_only=True)  # Serializer field to handle the invoice_id attribute
    item = InventorySerializer(read_only=True)  # Serializer field to represent the item relationship as a nested serializer
    item_id = serializers.CharField(write_only=True)  # Serializer field to handle the item_id attribute

    class Meta:
        model = InvoiceItem  # Specify the model to be serialized
        fields = "__all__"  # Include all fields of the model in the serializer


# This serializer is used to validate and deserialize InvoiceItem data
class InvoiceItemDataSerializer(serializers.Serializer):
    item_id = serializers.CharField()  # Serializer field to handle the item_id attribute
    quantity = serializers.IntegerField()  # Serializer field to handle the quantity attribute


# This serializer is used to convert Invoice model instances into JSON representations
class InvoiceSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)  # Serializer field to represent the created_by relationship as a nested serializer
    created_by_id = serializers.CharField(write_only=True, required=False)  # Serializer field to handle the created_by_id attribute
    client = ClientSerializer(read_only=True)  # Serializer field to represent the client relationship as a nested serializer
    client_id = serializers.CharField(write_only=True)  # Serializer field to handle the client_id attribute
    invoice_items = InvoiceItemSerializer(read_only=True, many=True)  # Serializer field to represent the invoice_items relationship as a nested serializer
    invoice_item_data = InvoiceItemDataSerializer(write_only=True, many=True)  # Serializer field to handle the invoice_item_data attribute

    class Meta:
        model = Invoice  # Specify the model to be serialized
        fields = "__all__"  # Include all fields of the model in the serializer

    def create(self, validated_data):
        invoice_item_data = validated_data.pop("invoice_item_data")  # Retrieve the invoice_item_data from the validated data

        if not invoice_item_data:
            raise Exception("You need to provide at least one invoice item")  # Raise an exception if no invoice_item_data is provided

        invoice = super().create(validated_data)  # Call the create method of the parent class to create the invoice instance

        invoice_item_serializer = InvoiceItemSerializer(data=[
            {"invoice_id": invoice.id, **item} for item in invoice_item_data
        ], many=True)  # Create a serializer instance to validate and create the invoice items

        if invoice_item_serializer.is_valid():
            invoice_item_serializer.save()  # Save the invoice items if the serializer is valid
        else:
            invoice.delete()  # Delete the invoice if the serializer is not valid
            raise Exception(invoice_item_serializer.errors)  # Raise an exception with the serializer errors

        return invoice  # Return the created invoice instance
