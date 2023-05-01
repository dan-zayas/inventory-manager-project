from django.contrib import admin
from .models import Inventory, InventoryGroup, Client, Invoice, InvoiceItem


admin.site.register((Inventory, InventoryGroup, Client, Invoice, InvoiceItem))