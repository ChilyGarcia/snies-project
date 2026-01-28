import os
import django
import sys

sys.path.append("config")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import UserModel
from rest_framework.test import APIClient


def test_register_login():
    client = APIClient()
    email = "newuser2@example.com"

              
    if UserModel.objects.filter(email=email).exists():
        UserModel.objects.get(email=email).delete()

                 
    print("Testing Registration...")
    register_data = {"name": "New User 2", "email": email, "password": "securepassword"}

    response = client.post("/api/auth/register/", register_data, format="json")

    if response.status_code == 201:
        print("Registration Successful:", response.data)
    else:
        print(f"Registration status: {response.status_code}")
        print(response.data)

              
    print("\nTesting Login...")
    login_data = {"email": email, "password": "securepassword"}

    response = client.post("/api/auth/login/", login_data, format="json")

    if response.status_code == 200:
        print("Login Successful!")
        print("Tokens Obtained")
    else:
        print(f"Login Failed: {response.status_code}")
        print(response.data)


if __name__ == "__main__":
    test_register_login()
