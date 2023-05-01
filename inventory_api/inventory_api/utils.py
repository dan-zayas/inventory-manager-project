# Importing necessary modules
import jwt  # This module helps us work with JSON Web Tokens
from datetime import datetime, timedelta  # These modules help us work with dates and times
from django.conf import settings  # This module helps us access Django settings
from user_control.models import CustomUser  # This module helps us work with the CustomUser model
from rest_framework.pagination import PageNumberPagination  # This module helps us with pagination
import re  # This module helps us work with regular expressions
from django.db.models import Q  # This module helps us build complex database queries


# This function generates an access token using the payload and the number of days it will be valid for
def get_access_token(payload, days):
    token = jwt.encode(
        {"exp": datetime.now() + timedelta(days=days), **payload},  # Sets the expiration time for the token
        settings.SECRET_KEY,  # Uses the secret key defined in Django settings
        algorithm="HS256"  # Specifies the encryption algorithm to use
    )
    return token


# This function decodes a JSON Web Token (JWT) and returns the associated user if valid
def decodeJWT(bearer):
    if not bearer:
        return None
    
    token = bearer[7:]  # Extracts the token from the "Bearer" header
    
    try:
        decoded = jwt.decode(
            token, key=settings.SECRET_KEY, algorithms="HS256"  # Decodes the token using the secret key and specified algorithm
        )
    except Exception:
        return None
    
    if decoded:
        try:
            return CustomUser.objects.get(id=decoded["user_id"])  # Retrieves the user associated with the decoded token
        except Exception:
            return None


# This class defines a custom pagination style for the API
class CustomPagination(PageNumberPagination):
    page_size = 20  # Specifies the number of items to display per page


# This function normalizes a query string by removing extra spaces and grouping words in double quotes together
def normalize_query(query_string, findterms=re.compile(r'"([^"]+)"|(\S+)').findall, normspace=re.compile(r'\s{2,}').sub):
    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]


# This function builds a database query based on the query string and search fields
def get_query(query_string, search_fields):
    query = None
    terms = normalize_query(query_string)  # Normalizes the query string
    for term in terms:
        or_query = None
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})  # Builds a query to check if the field contains the term
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query
