import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Thread, Pin

User = get_user_model()

@pytest.mark.django_db
def test_add_bookmark():
    user = User.objects.create_user(username='testuser', password='password123')
    thread = Thread.objects.create(subject='Test Thread', content='Thread content', creator=user, topic='1')
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.post('/api/pin/', {'thread': thread.id})
    assert response.status_code == status.HTTP_201_CREATED
    assert Pin.objects.count() == 1

@pytest.mark.django_db
def test_remove_bookmark():
    user = User.objects.create_user(username='testuser', password='password123')
    thread = Thread.objects.create(subject='Test Thread', content='Thread content', creator=user, topic='1')
    Pin.objects.create(user=user, thread=thread)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.post('/api/pin/', {'thread': thread.id})
    assert response.status_code == status.HTTP_200_OK
    assert Pin.objects.count() == 0
