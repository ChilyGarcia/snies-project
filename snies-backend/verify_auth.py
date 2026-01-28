import os
import django

import sys

sys.path.append("config")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import UserModel
from rest_framework.test import APIClient


def test_auth():
              
    if UserModel.objects.filter(email="test@example.com").exists():
        UserModel.objects.get(email="test@example.com").delete()

                 
    user = UserModel.objects.create_user(
        email="test@example.com", password="password123", name="Test User"
    )
    print(f"User created: {user.email}")

               
    client = APIClient()
    response = client.post(
        "/api/auth/login/",
        {"email": "test@example.com", "password": "password123"},
        format="json",
    )

    if response.status_code == 200:
        print("Token obtained successfully!")
        print(response.data)
    else:
        print(f"Failed to obtain token: {response.status_code}")
        print(response.data)


if __name__ == "__main__":
    test_auth()
