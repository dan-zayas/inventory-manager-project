# Import necessary modules
from django.apps import AppConfig  # This module provides a configuration class for Django apps


class UserControlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'  # Specify the default auto-generated field type for models
    name = 'user_control'  # Specify the name of the app

# This class represents the configuration for the "user_control" app