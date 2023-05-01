from pathlib import Path  # This module provides classes for working with file paths
from decouple import config  # This module allows loading environment variables from a file

# Build the base directory path for the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key used for cryptographic signing
SECRET_KEY = config("SECRET_KEY")  # Retrieve the secret key from the environment

# Debug mode configuration
DEBUG = config('DEBUG')  # Retrieve the debug mode flag from the environment

# List of allowed host names for the application
ALLOWED_HOSTS = ['*']  # Allow requests from all hosts

# Custom user model for authentication
AUTH_USER_MODEL = "user_control.CustomUser"

# List of installed applications
INSTALLED_APPS = [
    'django.contrib.admin',  # Admin interface
    'django.contrib.auth',  # Authentication framework
    'django.contrib.contenttypes',  # Content type framework
    'django.contrib.sessions',  # Session framework
    'django.contrib.messages',  # Message framework
    'django.contrib.staticfiles',  # Static file management
    'rest_framework',  # RESTful API framework
    'user_control',  # Custom user control app
    'app_control',  # App control app
    'corsheaders',  # CORS (Cross-Origin Resource Sharing) support
]

# Middleware classes for request/response processing
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Security enhancements
    'django.contrib.sessions.middleware.SessionMiddleware',  # Session management
    'django.middleware.common.CommonMiddleware',  # Common HTTP middleware
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF protection
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # User authentication
    'django.contrib.messages.middleware.MessageMiddleware',  # Message framework
    'django.middleware.clickjacking.XFrameOptionsMiddleware',  # Clickjacking protection
    'corsheaders.middleware.CorsMiddleware',  # CORS (Cross-Origin Resource Sharing) middleware
]

# CORS (Cross-Origin Resource Sharing) settings
CORS_ORIGIN_ALLOW_ALL = True  # Allow requests from all origins
CORS_ALLOW_CREDENTIALS = True  # Allow sending credentials (cookies, authorization headers) with CORS requests

# Root URL configuration
ROOT_URLCONF = 'inventory_api.urls'  # Specify the URL configuration module

# Template configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application configuration
WSGI_APPLICATION = 'inventory_api.wsgi.application'  # Specify the WSGI application module

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',  # PostgreSQL database engine
        'NAME': config('DB_NAME'),  # Database name
        'USER': config('DB_USER'),  # Database user
        'PASSWORD': config('DB_PASSWORD'),  # Database password
        'HOST': config('DB_HOST'),  # Database host
        'PORT': config('DB_PORT'),  # Database port
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Password validation settings
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization settings
LANGUAGE_CODE = 'en-us'  # Set the language code to English (United States)
TIME_ZONE = 'UTC'  # Set the time zone to Coordinated Universal Time (UTC)
USE_I18N = True  # Enable internationalization
USE_TZ = True  # Use time zone support

# Static files configuration
STATIC_URL = 'static/'  # Specify the URL path for serving static files

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'  # Use big auto-incrementing primary key fields by default
