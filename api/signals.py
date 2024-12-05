from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import User, Profile

# Automatically generate profile for each user
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user=instance,
            name=instance.username,
            bio="Hello, World",
            avatar='https://img.icons8.com/stickers/344/administrator-male.png',
            status='Member'
        )


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()