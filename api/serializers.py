from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Thread, Post, Profile, User, Pin

# Customized Token Obtain Pair Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # encrypt username for custom claim
        token['username'] = user.username
        return token


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        profile = user.profile
        profile.save()
        return user


# Thread Serializer
class ThreadSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.username')
    creator_id = serializers.IntegerField(source='creator.id', read_only=True)
    created = serializers.DateTimeField(format="%d-%m-%Y", read_only=True)
    upvotes = serializers.IntegerField(source='upvotes.count', read_only=True)
    downvotes = serializers.IntegerField(source='downvotes.count', read_only=True)
    vote_score = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = ("id", "creator", "created", "subject", "content", "topic", "updated", "reply_count", "creator_id", "upvotes", "downvotes", "vote_score")

    def get_vote_score(self, obj):
        return obj.vote_score()


# Post Serializer
class PostSerializer(serializers.ModelSerializer):
    creator_id = serializers.IntegerField(source='creator.id', read_only=True)
    creator = serializers.CharField(source='creator.username', read_only=True)
    created = serializers.DateTimeField(format="%d-%m-%Y", read_only=True)
    updated = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", read_only=True)

    class Meta:
        model = Post
        fields = ("id", "creator", "created", "content", "updated", "thread", "creator_id")

# Bookmark Serializer
class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = '__all__'


# Pin Serializer
class PinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pin
        fields = '__all__'


# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'bio', 'avatar', 'status']
