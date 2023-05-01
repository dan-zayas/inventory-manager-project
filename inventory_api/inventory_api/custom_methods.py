# Importing necessary modules
from rest_framework.permissions import BasePermission  # This module helps us define custom permissions
from .utils import decodeJWT  # This module helps us decode JSON Web Tokens (JWTs)
from rest_framework.views import exception_handler  # This module helps us handle exceptions in views
from rest_framework.response import Response  # This module helps us construct API responses


# This class defines a custom permission to check if a user is authenticated
class IsAuthenticatedCustom(BasePermission):
    
    def has_permission(self, request, _):
        try:
            auth_token = request.META.get("HTTP_AUTHORIZATION", None)  # Retrieves the authorization token from the request headers
        except Exception:
            return False
        if not auth_token:
            return False
        
        user = decodeJWT(auth_token)  # Decodes the token to get the associated user
        
        if not user:
            return False
        
        request.user = user  # Sets the authenticated user in the request object
        return True


# This function handles exceptions and returns custom error responses
def custom_exception_handler(exc, context):
    
    response = exception_handler(exc, context)  # Uses the default exception handler to generate a response
    
    if response is not None:
        return response
    
    exc_list = str(exc).split("DETAIL: ")  # Extracts the specific error message from the exception
    
    return Response({"error": exc_list[-1]}, status=403)  # Constructs a custom response with the error message and HTTP status code 403 (Forbidden)
