from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string

from .models import Thread, Post, Profile, Pin
from .serializers import ThreadSerializer, PostSerializer, MyTokenObtainPairSerializer, RegisterSerializer, \
    PinSerializer, ProfileSerializer, BookmarkSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

import environ
import os


User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class ThreadListView(generics.ListAPIView):
    queryset = Thread.objects.all().order_by('-updated')
    serializer_class = ThreadSerializer
    pagination_class = PageNumberPagination


class ThreadDetailView(generics.RetrieveAPIView):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer
    lookup_field = 'pk'


class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve the posts for the given thread_id
        thread_id = self.kwargs.get("thread_id")
        return Post.objects.filter(thread_id=thread_id).order_by('created')

    def perform_create(self, serializer):
        # Save the new post and set its creator and thread
        thread = Thread.objects.get(pk=self.kwargs.get("thread_id"))
        serializer.save(creator=self.request.user, thread=thread)


class CreateThreadView(generics.CreateAPIView):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class CreatePostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        thread = get_object_or_404(Thread, pk=self.request.data.get('thread'))
        serializer.save(creator=self.request.user, thread=thread)
        thread.reply_count += 1
        thread.save()


class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        thread_id = request.data.get('thread')
        thread = get_object_or_404(Thread, pk=thread_id)
        pin, created = Pin.objects.get_or_create(user=user, thread=thread)

        if not created:
            pin.delete()
            return Response({'message': 'Bookmark removed.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Bookmark added.'}, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        profile = get_object_or_404(Profile, user__id=user_id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, user_id):
        profile = get_object_or_404(Profile, user__id=user_id)
        data = request.data
        profile.bio = data.get('bio', profile.bio)
        profile.avatar = data.get('avatar', profile.avatar)
        profile.save()
        return Response({'message': 'Profile updated successfully.'})


class ThreadVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, thread_id, action):
        thread = get_object_or_404(Thread, pk=thread_id)
        user = request.user

        # Логика для управления голосами
        if action == 'upvote':
            if thread.downvotes.filter(pk=user.pk).exists():
                # Если пользователь уже голосовал против, удаляем этот голос
                thread.downvotes.remove(user)
            if thread.upvotes.filter(pk=user.pk).exists():
                # Если пользователь уже голосовал за, удаляем этот голос
                thread.upvotes.remove(user)
            else:
                # Добавляем голос "за"
                thread.upvotes.add(user)

        elif action == 'downvote':
            if thread.upvotes.filter(pk=user.pk).exists():
                # Если пользователь уже голосовал за, удаляем этот голос
                thread.upvotes.remove(user)
            if thread.downvotes.filter(pk=user.pk).exists():
                # Если пользователь уже голосовал против, удаляем этот голос
                thread.downvotes.remove(user)
            else:
                # Добавляем голос "против"
                thread.downvotes.add(user)

        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        thread.save()
        return Response({'vote_score': thread.vote_score()}, status=status.HTTP_200_OK)

class TopThreadsView(generics.ListAPIView):
    queryset = Thread.objects.order_by('-reply_count')[:5]
    serializer_class = ThreadSerializer
    permission_classes = [AllowAny]

class ThreadsByTopicView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        topic_id = self.kwargs.get("topic_id")
        return Thread.objects.filter(topic=topic_id).order_by('-updated')

class CheckBookmarkedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, thread_id, user_id):
        pin_exists = Pin.objects.filter(user__id=user_id, thread__id=thread_id).exists()
        return Response({"pinned": "true" if pin_exists else "false"})

class BookmarkedThreadsView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        pins = Pin.objects.filter(user__id=user_id).order_by('-id')
        thread_ids = [pin.thread.id for pin in pins]
        return Thread.objects.filter(pk__in=thread_ids)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

class PasswordResetAPIView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get('email')
        user = get_object_or_404(User, email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"
        message = render_to_string('email/password_reset_email.html', {
            'user': user,
            'reset_link': reset_link,
        })

        send_mail(
            'Password Reset Request',
            message,
            env('EMAIL_HOST_USER'),
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)


class PasswordResetConfirmAPIView(APIView):
    permission_classes = []

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)
