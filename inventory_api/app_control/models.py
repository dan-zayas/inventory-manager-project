from django.db import models # Import the models module from Django
from user_control.models import CustomUser # Import the CustomUser model from the user_control app
from user_control.views import add_user_activity # Import the add_user_activity function from the user_control app


# This class represents the InventoryGroup model
class InventoryGroup(models.Model):
    created_by = models.ForeignKey(
        CustomUser, null=True, related_name="inventory_groups", 
        on_delete=models.SET_NULL
    )  # A foreign key relationship to the CustomUser model representing the user who created the group
    name = models.CharField(max_length=100, unique=True)  # A character field to store the name of the group (maximum length: 100 characters)
    belongs_to = models.ForeignKey(
        'self', null=True, on_delete=models.SET_NULL, related_name="group_relations"
    )  # A recursive foreign key relationship to the same model, allowing a group to belong to another group
    created_at = models.DateTimeField(auto_now_add=True)  # A timestamp field to store the creation date and time of the group
    created_by = models.DateTimeField(auto_now=True)  # A timestamp field to store the last modification date and time of the group

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of the groups based on the creation date in descending order

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.old_name = self.name  # Store the initial name of the group to track changes during updates
    
    def save(self, *args, **kwargs):
        action = f"added new group - '{self.name}'"  # Default action for a new group creation
        if self.pk is not None:
            action = f"updated group from - '{self.old_name}' to '{self.name}'"  # Action for group updates
        super().save(*args, **kwargs)  # Call the save method of the parent class to save the group instance
        add_user_activity(self.created_by, action=action)  # Add a user activity log for the group creation or update

    def delete(self, *args, **kwargs):
        created_by = self.created_by  # Store the user who created the group before deletion
        action = f"deleted group - {self.name}"  # Action for group deletion
        super().delete(*args, **kwargs)  # Call the delete method of the parent class to delete the group instance
        add_user_activity(created_by, action=action)  # Add a user activity log for the group deletion

    def __str__(self):
        return self.name  # Return the name of the group as a string representation


# A model to represent inventory items
class Inventory(models.Model):
    created_by = models.ForeignKey(
        CustomUser, null=True, related_name="inventory_items", 
        on_delete=models.SET_NULL
    )  # A foreign key relationship to the CustomUser model representing the user who created the inventory item
    code = models.CharField(max_length=10, unique=True, null=True)  # A character field to store the code of the inventory item (maximum length: 10 characters)
    photo = models.TextField(blank=True, null=True)  # A text field to store the photo of the inventory item (optional)
    group = models.ForeignKey(InventoryGroup, related_name="inventories", null=True, on_delete=models.SET_NULL)  # A foreign key relationship to the InventoryGroup model representing the group to which the inventory item belongs
    total = models.PositiveIntegerField()  # An integer field to store the total quantity of the inventory item
    remaining = models.PositiveIntegerField(null=True)  # An integer field to store the remaining quantity of the inventory item (optional)
    name = models.CharField(max_length=255)  # A character field to store the name of the inventory item (maximum length: 255 characters)
    price = models.FloatField(default=0)  # A floating-point field to store the price of the inventory item with a default value of 0
    created_at = models.DateTimeField(auto_now_add=True)  # A timestamp field to store the creation date and time of the inventory item
    created_by = models.DateTimeField(auto_now=True)  # A timestamp field to store the last modification date and time of the inventory item

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of the inventory items based on the creation date in descending order

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if the inventory item is new or being updated

        if is_new:
            self.remaining = self.total  # Set the remaining quantity to the total quantity for a new inventory item

        super().save(*args, **kwargs)  # Call the save method of the parent class to save the inventory item instance

        if is_new:
            id_length = len(str(self.id))
            code_length = 6 - id_length
            zeros = "".join("0" for i in range(code_length))
            self.code = f"{zeros}{self.id}"
            self.save()  # Generate a code for the inventory item by combining leading zeros and the item's ID

        action = f"added new inventory item with code - '{self.code}'"  # Default action for a new inventory item creation

        if not is_new:
            action = f"updated inventory item with code - '{self.code}'"  # Action for inventory item updates

        add_user_activity(self.created_by, action=action)  # Add a user activity log for the inventory item creation or update

    def delete(self, *args, **kwargs):
        created_by = self.created_by  # Store the user who created the inventory item before deletion
        action = f"deleted inventory - {self.code}"  # Action for inventory item deletion
        super().delete(*args, **kwargs)  # Call the delete method of the parent class to delete the inventory item instance
        add_user_activity(created_by, action=action)  # Add a user activity log for the inventory item deletion

    def __str__(self):
        return f"{self.name} - {self.code}" # Return the name and code of the inventory item as a string representation


# A model to represent clients
class Client(models.Model):
    created_by = models.ForeignKey(
        CustomUser, null=True, related_name="clients",
        on_delete=models.SET_NULL
    )  # A foreign key relationship to the CustomUser model representing the user who created the client
    name = models.CharField(max_length=50, unique=True)  # A character field to store the name of the client (maximum length: 50 characters)
    created_at = models.DateTimeField(auto_now_add=True)  # A timestamp field to store the creation date and time of the client
    created_by = models.DateTimeField(auto_now=True)  # A timestamp field to store the last modification date and time of the client

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of the clients based on the creation date in descending order

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.old_name = self.name  # Store the original name of the client before any changes

    def save(self, *args, **kwargs):
        action = f"added new client - '{self.name}'"  # Default action for a new client creation

        if self.pk is not None:
            action = f"updated client from - '{self.old_name}' to '{self.name}'"  # Action for client updates

        super().save(*args, **kwargs)  # Call the save method of the parent class to save the client instance
        add_user_activity(self.created_by, action=action)  # Add a user activity log for the client creation or update

    def delete(self, *args, **kwargs):
        created_by = self.created_by  # Store the user who created the client before deletion
        action = f"deleted client - {self.name}"  # Action for client deletion
        super().delete(*args, **kwargs)  # Call the delete method of the parent class to delete the client instance
        add_user_activity(created_by, action=action)  # Add a user activity log for the client deletion

    def __str__(self):
        return self.name  # Return the name of the client as a string representation


# A model to represent invoices
class Invoice(models.Model):
    created_by = models.ForeignKey(
        CustomUser, null=True, related_name="invoices",
        on_delete=models.SET_NULL
    )  # A foreign key relationship to the CustomUser model representing the user who created the invoice
    client = models.ForeignKey(Client, related_name="sale_client", null=True, on_delete=models.SET_NULL)  # A foreign key relationship to the Client model representing the client associated with the invoice
    created_at = models.DateTimeField(auto_now_add=True)  # A timestamp field to store the creation date and time of the invoice

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of the invoices based on the creation date in descending order

    def save(self, *args, **kwargs):
        action = f"added new invoice - '{self.id}'"  # Action for a new invoice creation
        super().save(*args, **kwargs)  # Call the save method of the parent class to save the invoice instance
        add_user_activity(self.created_by, action=action)  # Add a user activity log for the invoice creation

    def delete(self, *args, **kwargs):
        created_by = self.created_by  # Store the user who created the invoice before deletion
        action = f"deleted invoice - '{self.id}'"  # Action for invoice deletion
        super().delete(*args, **kwargs)  # Call the delete method of the parent class to delete the invoice instance
        add_user_activity(created_by, action=action)  # Add a user activity log for the invoice deletion


# A model to represent invoice items
class InvoiceItem(models.Model):
    invoice = models.ForeignKey(
        Invoice, related_name="invoice_items", on_delete=models.CASCADE
    )  # A foreign key relationship to the Invoice model representing the invoice associated with the item
    item = models.ForeignKey(
        Inventory, null=True, related_name="inventory_invoices", on_delete=models.SET_NULL
    )  # A foreign key relationship to the Inventory model representing the inventory item associated with the item
    item_name = models.CharField(max_length=255, null=True)  # A field to store the name of the inventory item
    item_code = models.CharField(max_length=20, null=True)  # A field to store the code of the inventory item
    quantity = models.PositiveIntegerField()  # A field to store the quantity of the item
    amount = models.FloatField(null=True)  # A field to store the total amount of the item (quantity * item price)
    created_at = models.DateTimeField(auto_now_add=True)  # A timestamp field to store the creation date and time of the item

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of the items based on the creation date in descending order

    def save(self, *args, **kwargs):
        if self.item.remaining < self.quantity:
            raise Exception(f"item with code {self.item.code} does not have enough quantity")  # Raise an exception if the item does not have enough quantity

        self.item_name = self.item.name  # Set the item_name field to the name of the inventory item
        self.item_code = self.item.code  # Set the item_code field to the code of the inventory item

        self.amount = self.quantity * self.item.price  # Calculate the total amount of the item
        self.item.remaining = self.item.remaining - self.quantity  # Update the remaining quantity of the inventory item
        self.item.save()  # Save the updated inventory item

        super().save(*args, **kwargs)  # Call the save method of the parent class to save the item instance

    def __str__(self):
        return f"{self.item.code} - {self.quantity}"  # Return a string representation of the item (item code - quantity)
