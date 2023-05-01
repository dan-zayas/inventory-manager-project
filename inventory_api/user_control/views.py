# Importing necessary modules and classes
from rest_framework.viewsets import ModelViewSet  # This module helps us create views for models
from .serializers import (
    CreateUserSerializer, CustomUser, LoginSerializer, UpdatePasswordSerializer,
    CustomUserSerializer, UserActivities, UserActivitiesSerializer
)  # These are modules that help us serialize and deserialize data for our models
from rest_framework.response import Response  # This module helps us construct API responses
from rest_framework import status  # This module provides HTTP status codes
from django.contrib.auth import authenticate  # This module helps us authenticate users
from datetime import datetime  # This module helps us work with dates and times
from inventory_api.utils import CustomPagination, get_access_token, get_query  # These are utility functions from another module
from inventory_api.custom_methods import IsAuthenticatedCustom  # This is a custom permission class


# This function adds a user activity record
def add_user_activity(user, action):
    UserActivities.objects.create(
        user_id=user.id,
        email=user.email,
        fullname=user.fullname,
        action=action
    )


# This class defines a view to create a new user
class CreateUserView(ModelViewSet):
    http_method_names = ["post"]  # Only allow POST requests to this view
    queryset = CustomUser.objects.all()  # Retrieve all CustomUser objects from the database
    serializer_class = CreateUserSerializer  # Use the CreateUserSerializer to serialize and validate the request data
    permission_classes = (IsAuthenticatedCustom, )  # Require the user to be authenticated to access this view

    def create(self, request):
        valid_request = self.serializer_class(data=request.data)  # Create an instance of the CreateUserSerializer with the request data
        valid_request.is_valid(raise_exception=True)  # Validate the request data, raising an exception if it is invalid

        CustomUser.objects.create(**valid_request.validated_data)  # Create a new CustomUser object with the validated data

        add_user_activity(request.user, "added new user")  # Record the user activity of adding a new user

        return Response(
            {"success": "User created successfully"},  # Return a success message
            status=status.HTTP_201_CREATED  # Set the HTTP status code to 201 (Created)
        )


# This class defines a view to handle user login
class LoginView(ModelViewSet):
    http_method_names = ["post"]  # Only allow POST requests to this view
    queryset = CustomUser.objects.all()  # Retrieve all CustomUser objects from the database
    serializer_class = LoginSerializer  # Use the LoginSerializer to serialize and validate the request data

    def create(self, request):
        valid_request = self.serializer_class(data=request.data)  # Create an instance of the LoginSerializer with the request data
        valid_request.is_valid(raise_exception=True)  # Validate the request data, raising an exception if it is invalid

        new_user = valid_request.validated_data["is_new_user"]  # Check if the user is a new user

        if new_user:
            user = CustomUser.objects.filter(
                email=valid_request.validated_data["email"]
            )  # Retrieve the CustomUser object with the specified email

            if user:
                user = user[0]
                if not user.password:  # Check if the user does not have a password set
                    return Response({"user_id": user.id})  # Return the user's ID as a response
                else:
                    raise Exception("User has password already")  # Raise an exception if the user already has a password
            else:
                raise Exception("User with email not found")  # Raise an exception if no user with the specified email is found

        user = authenticate(
            username=valid_request.validated_data["email"],
            password=valid_request.validated_data.get("password", None)
        )  # Authenticate the user using the provided email and password

        if not user:
            return Response(
                {"error": "Invalid email or password"},  # Return an error message
                status=status.HTTP_400_BAD_REQUEST  # Set the HTTP status code to 400 (Bad Request)
            )

        access = get_access_token({"user_id": user.id}, 1)  # Generate an access token for the user

        user.last_login = datetime.now()  # Update the last login time for the user
        user.save()

        add_user_activity(user, "logged in")  # Record the user activity of logging in

        return Response({"access": access})  # Return the access token as a response


# This class defines a view to update user passwords
class UpdatePasswordView(ModelViewSet):
    serializer_class = UpdatePasswordSerializer  # Use the UpdatePasswordSerializer to serialize and validate the request data
    http_method_names = ["post"]  # Only allow POST requests to this view
    queryset = CustomUser.objects.all()  # Retrieve all CustomUser objects from the database

    def create(self, request):
        valid_request = self.serializer_class(data=request.data)  # Create an instance of the UpdatePasswordSerializer with the request data
        valid_request.is_valid(raise_exception=True)  # Validate the request data, raising an exception if it is invalid

        user = CustomUser.objects.filter(
            id=valid_request.validated_data["user_id"])  # Retrieve the CustomUser object with the specified user ID

        if not user:
            raise Exception("User with id not found")  # Raise an exception if no user with the specified ID is found

        user = user[0]

        user.set_password(valid_request.validated_data["password"])  # Set the new password for the user
        user.save()  # Save the updated user object

        add_user_activity(user, "updated password")  # Record the user activity of updating the password

        return Response({"success": "User password updated"})  # Return a success message



# This class defines a view to get the user's own information
class MeView(ModelViewSet):
    serializer_class = CustomUserSerializer  # Use the CustomUserSerializer to serialize the user's own information
    http_method_names = ["get"]  # Only allow GET requests to this view
    queryset = CustomUser.objects.all()  # Retrieve all CustomUser objects from the database
    permission_classes = (IsAuthenticatedCustom, )  # Require the user to be authenticated to access this view

    def list(self, request):
        data = self.serializer_class(request.user).data  # Serialize the user's own information
        return Response(data)  # Return the serialized data as a response


# This class defines a view to get user activity records
class UserActivitiesView(ModelViewSet):
    serializer_class = UserActivitiesSerializer  # Use the UserActivitiesSerializer to serialize the user activity records
    http_method_names = ["get"]  # Only allow GET requests to this view
    queryset = UserActivities.objects.all()  # Retrieve all UserActivities objects from the database
    permission_classes = (IsAuthenticatedCustom, )  # Require the user to be authenticated to access this view
    pagination_class = CustomPagination  # Use the CustomPagination class for pagination

    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset  # Return the queryset as is if the request method is not GET

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the query parameters
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the query parameters

        results = self.queryset.filter(**data)  # Filter the queryset based on the remaining query parameters

        if keyword:
            search_fields = (
                "fullname", "email", "action"
            )  # Define the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Generate a query using the keyword and search fields
            results = results.filter(query)  # Filter the queryset based on the generated query

        return results  # Return the filtered queryset


# This class defines a view to get the list of users
class UsersView(ModelViewSet):
    serializer_class = CustomUserSerializer  # Use the CustomUserSerializer to serialize the list of users
    http_method_names = ["get"]  # Only allow GET requests to this view
    queryset = CustomUser.objects.all()  # Retrieve all CustomUser objects from the database
    permission_classes = (IsAuthenticatedCustom, )  # Require the user to be authenticated to access this view
    pagination_class = CustomPagination  # Use the CustomPagination class for pagination
    
    def get_queryset(self):
        if self.request.method.lower() != "get":
            return self.queryset  # Return the queryset as is if the request method is not GET

        data = self.request.query_params.dict()  # Get the query parameters from the request
        data.pop("page", None)  # Remove the "page" parameter from the query parameters
        keyword = data.pop("keyword", None)  # Remove the "keyword" parameter from the query parameters

        results = self.queryset.filter(**data, is_superuser=False)  # Filter the queryset based on the remaining query parameters and exclude superusers

        if keyword:
            search_fields = (
                "fullname", "email", "role"
            )  # Define the fields to search for the keyword
            query = get_query(keyword, search_fields)  # Generate a query using the keyword and search fields
            results = results.filter(query)  # Filter the queryset based on the generated query
        
        return results  # Return the filtered queryset

