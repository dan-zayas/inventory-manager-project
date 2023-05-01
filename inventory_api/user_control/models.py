from django.db import models  # This module provides classes for creating database models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)  # These are Django's built-in models and managers for authentication and authorization


Roles = (("admin", "admin"), ("creator", "creator"), ("sale", "sale"))  # Define the choices for the "role" field


# Custom manager for the CustomUser model
class CustomUserManager(BaseUserManager):
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)  # Set the "is_staff" field to True by default
        extra_fields.setdefault('is_superuser', True)  # Set the "is_superuser" field to True by default
        extra_fields.setdefault('is_active', True)  # Set the "is_active" field to True by default

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")  # Raise an exception if "is_staff" is not True
        
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")  # Raise an exception if "is_superuser" is not True

        if not email:
            raise ValueError("Email field is required")  # Raise an exception if email is not provided

        user = self.model(email=email, **extra_fields)  # Create a new CustomUser object with the provided email and extra fields
        user.set_password(password)  # Set the password for the user
        user.save()  # Save the user object to the database
        return user  # Return the created user object
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    fullname = models.CharField(max_length=250)  # Field for full name (maximum length of 250 characters)
    email = models.EmailField(unique=True)  # Field for email (validated as an email format, unique)
    role = models.CharField(max_length=8, choices=Roles)  # Field for role (maximum length of 8 characters, with choices from Roles)
    created_at = models.DateTimeField(auto_now_add=True)  # Field for creation timestamp (automatically set on creation)
    updated_at = models.DateTimeField(auto_now=True)  # Field for update timestamp (automatically updated on every save)
    is_staff = models.BooleanField(default=False)  # Field for staff status (default is False)
    is_superuser = models.BooleanField(default=False)  # Field for superuser status (default is False)
    is_active = models.BooleanField(default=True)  # Field for active status (default is True)
    last_login = models.DateTimeField(null=True)  # Field for last login timestamp (nullable)

    USERNAME_FIELD = "email"  # Set the "email" field as the username field for authentication
    objects = CustomUserManager()  # Use the CustomUserManager for managing CustomUser objects

    def __str__(self):
        return self.email  # Return the email as the string representation of the user object
    
    class Meta:
        ordering = ("created_at", )  # Specify the default ordering of user objects


class UserActivities(models.Model):
    user = models.ForeignKey(
        CustomUser, related_name="user_activities", null=True, on_delete=models.SET_NULL
    )  # Field for the user associated with the activity (nullable, related to CustomUser model)
    email = models.EmailField()  # Field for email (validated as an email format)
    fullname = models.CharField(max_length=255)  # Field for full name (maximum length of 255 characters)
    action = models.TextField()  # Field for action (unlimited length text)
    created_at = models.DateTimeField(auto_now_add=True)  # Field for creation timestamp (automatically set on creation)

    class Meta:
        ordering = ("-created_at", )  # Specify the default ordering of activity objects

    def __str__(self):
        return f"{self.fullname} {self.action} on {self.created_at.strftime('%Y-%m-%d &H:%M')}"  # Return a formatted string representation of the activity object