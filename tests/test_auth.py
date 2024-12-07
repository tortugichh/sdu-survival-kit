import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.mark.django_db
def test_register_user():
    client = APIClient()
    response = client.post('/api/register/', {
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': '987654321Qq!',
        'password2': '987654321Qq!'
    })
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_login_user():
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()
    response = client.post('/api/token/', {
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data