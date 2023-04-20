from django.contrib import admin
from .models import Inventory, InventoryGroup, Client

admin.site.register((Inventory, InventoryGroup, Client))