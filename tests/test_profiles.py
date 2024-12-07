import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Profile

User = get_user_model()

@pytest.mark.django_db
def test_get_profile():
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get(f'/api/profile/{user.id}/')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == user.username

@pytest.mark.django_db
def test_update_profile():
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.put(f'/api/profile/{user.id}/', {
        'bio': 'Updated bio',
        'avatar': 'http://example.com/avatar.png'
    })
    assert response.status_code == status.HTTP_200_OK
    profile = Profile.objects.get(user=user)
    assert profile.bio == 'Updated bio'