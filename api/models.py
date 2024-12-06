from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from typing import Any


class User(AbstractUser):
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        Group,
        related_name='user_groups_api',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='user_permissions_api',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, default='')
    bio = models.TextField(max_length=500, default="Hello world")
    avatar = models.URLField(default=None, blank=True)
    status = models.CharField(max_length=16, blank=True, default='')
    specialty = models.CharField(max_length=128, default='', verbose_name="Specialty")
    course_year = models.PositiveSmallIntegerField(default=1, verbose_name="Course Year")

    def __str__(self) -> str:
        return f'{self.user} profile'


class Thread(models.Model):
    TOPIC_CHOICES = (
        ("1", "Social life"),
        ("2", "Professors"),
        ("3", "Schedule"),
        ("4", "Mental Health"),
        ("5", "Programming"),
        ("6", "Math"),
        ("7", "Languages"),
        ("8", "Other"),
    )
    subject = models.CharField(max_length=128)
    content = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator_threads')
    topic = models.CharField(max_length=32, choices=TOPIC_CHOICES, default="1")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    reply_count = models.IntegerField(default=0)
    upvotes = models.ManyToManyField(User, related_name='upvoted_threads', blank=True)
    downvotes = models.ManyToManyField(User, related_name='downvoted_threads', blank=True)

    def vote_score(self) -> int:
        return self.upvotes.count() - self.downvotes.count()

    def __str__(self) -> str:
        return f'Thread {self.subject} is created by {self.creator.username}.'


class Post(models.Model):
    content = models.TextField()
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='thread_posts')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='creator_posts')

    def __str__(self) -> str:
        return f'Post of {self.thread.subject} is posted by {self.creator.username}.'


class Pin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_pin", verbose_name="Pinned by")
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="thread_pin")

    def __str__(self) -> str:
        return f"{self.user.username} pinned thread id: {self.thread.id}"