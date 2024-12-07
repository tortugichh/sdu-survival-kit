from django.contrib import admin
from .models import Profile, Thread, Post, User, Pin

# Customizing User Admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    ordering = ('username',)


# Customizing Profile Admin
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'course_year', 'status')
    search_fields = ('user__username', 'specialty')
    list_filter = ('course_year', 'status')


# Customizing Thread Admin
@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('subject', 'creator', 'topic', 'created', 'updated', 'reply_count')
    search_fields = ('subject', 'creator__username')
    list_filter = ('topic', 'created', 'updated')
    ordering = ('-created',)


# Customizing Post Admin
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('thread', 'creator', 'created', 'updated')
    search_fields = ('thread__subject', 'creator__username', 'content')
    list_filter = ('created', 'updated')
    ordering = ('-created',)


# Customizing Pin Admin
@admin.register(Pin)
class PinAdmin(admin.ModelAdmin):
    list_display = ('user', 'thread')
    search_fields = ('user__username', 'thread__subject')
#