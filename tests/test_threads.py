import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Thread

User = get_user_model()

@pytest.mark.django_db
def test_create_thread():
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.post('/api/threads/create/', {
        'subject': 'Test Thread',
        'content': 'This is a test thread',
        'topic': '1'
    })
    assert response.status_code == status.HTTP_201_CREATED
    assert Thread.objects.count() == 1
    assert Thread.objects.first().subject == 'Test Thread'

@pytest.mark.django_db
def test_list_threads():
    user = User.objects.create_user(username='testuser', password='password123')
    Thread.objects.create(subject='Thread 1', content='Content 1', creator=user, topic='1')
    Thread.objects.create(subject='Thread 2', content='Content 2', creator=user, topic='2')
    client = APIClient()
    response = client.get('/api/threads/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['results']) == 2