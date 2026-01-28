\
\
\
\
\
\
\
\
\
\
   

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

                                                                
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR.parent))
sys.path.append(str(BASE_DIR.parent / "users"))


                                                              
                                                                       

                                                                  
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-40a%lxkx)yij@$@t^!u3l#^b^2o@=q%8_uwp2xm5rh*u4cd)%d",
)

                                                                 
DEBUG = os.getenv("DEBUG", "True").strip().lower() in {"1", "true", "yes", "y", "on"}

_allowed_hosts = os.getenv("ALLOWED_HOSTS", "*").strip()
ALLOWED_HOSTS = ["*"] if _allowed_hosts == "*" else [h.strip() for h in _allowed_hosts.split(",") if h.strip()]


                        

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "audit",
    "notifications",
    "users",
    "courses",
    "continuing_education",
    "continuing_education_teachers",
    "continuing_education_beneficiaries",
    "wellbeing_activities",
    "wellbeing_beneficiaries",
    "wellbeing_human_resources",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


          
                                                               

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "snies_db"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", "admin"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

_csrf_trusted = os.getenv("CSRF_TRUSTED_ORIGINS", "").strip()
if _csrf_trusted:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_trusted.split(",") if o.strip()]


                     
                                                                              

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


                      
                                                    

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


                                        
                                                           

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

                                
                                                                        

                                
                                                                        

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "EXCEPTION_HANDLER": "common.presentation.exceptions.exception_handler.custom_exception_handler",
}

CORS_ALLOW_ALL_ORIGINS = True

AUTH_USER_MODEL = "users.UserModel"

from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("REFRESH_TOKEN_DAYS", "1"))),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
