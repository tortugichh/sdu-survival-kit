import pytest
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Thread, Post

User = get_user_model()

@pytest.mark.django_db
def test_create_post():
    user = User.objects.create_user(username='testuser', password='password123')
    thread = Thread.objects.create(subject='Test Thread', content='Thread content', creator=user, topic='1')
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.post(f'/api/threads/{thread.id}/posts/', {
        'content': 'This is a test post',
        'thread': thread.id
    })
    assert response.status_code == status.HTTP_201_CREATED
    assert Post.objects.count() == 1
    assert Post.objects.first().content == 'This is a test post'

@pytest.mark.django_db
def test_list_posts():
    user = User.objects.create_user(username='testuser', password='password123')
    thread = Thread.objects.create(subject='Test Thread', content='Thread content', creator=user, topic='1')
    Post.objects.create(content='Post 1', thread=thread, creator=user)
    Post.objects.create(content='Post 2', thread=thread, creator=user)
    client = APIClient()
    client.force_authenticate(user=user)
    response = client.get(f'/api/threads/{thread.id}/posts/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['results']) == 2
