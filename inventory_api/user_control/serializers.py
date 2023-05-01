# Import necessary modules and classes
from rest_framework import serializers  # This module provides serializers for converting complex data types to and from Python objects
from .models import CustomUser, Roles, UserActivities  # These are the models used in the serializers


# Serializer for creating a new user
class CreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField()  # Field for email (validated as an email format)
    fullname = serializers.CharField()  # Field for fullname (validated as a string)
    role = serializers.ChoiceField(Roles)  # Field for role (validated as one of the Roles choices)


# Serializer for user login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()  # Field for email (validated as an email format)
    password = serializers.CharField(required=False)  # Field for password (optional)
    is_new_user = serializers.BooleanField(default=False, required=False)  # Field for indicating if the user is new (optional)


# Serializer for updating user password
class UpdatePasswordSerializer(serializers.Serializer):
    user_id = serializers.CharField()  # Field for user_id (validated as a string)
    password = serializers.CharField()  # Field for password (validated as a string)


# Serializer for CustomUser model
class CustomUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser  # Specify the model to serialize
        exclude = ("password", )  # Exclude the password field from serialization


# Serializer for UserActivities model
class UserActivitiesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = UserActivities  # Specify the model to serialize
        fields = ("__all__")  # Include all fields in serialization
