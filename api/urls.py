from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    MyTokenObtainPairView,
    RegisterView,
    ThreadListView,
    ThreadDetailView,
    PostListView,
    CreateThreadView,
    CreatePostView,
    BookmarkView,
    ProfileView,
    ThreadVoteView,
    PasswordResetAPIView,
    PasswordResetConfirmAPIView,
    TopThreadsView,
    ThreadsByTopicView,
    CheckBookmarkedView,
    BookmarkedThreadsView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/', RegisterView.as_view(), name='auth_register'),
    path('password_reset/', PasswordResetAPIView.as_view(), name='password_reset'),
    path('password_reset_confirm/', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
    path('profile/<int:user_id>/', ProfileView.as_view(), name='profile'),

    path('threads/', ThreadListView.as_view(), name='threads'),
    path('threads/<int:pk>/', ThreadDetailView.as_view(), name='thread_detail'),
    path('threads/<int:thread_id>/posts/', PostListView.as_view(), name='posts'),
    path('threads/create/', CreateThreadView.as_view(), name='create_thread'),
    path('threads/topic/<int:topic_id>/', ThreadsByTopicView.as_view(), name='get_threads_topic'),
    path('topThreads/', TopThreadsView.as_view(), name='top_threads'),
    path('threads/<int:thread_id>/<str:action>/', ThreadVoteView.as_view(), name='thread_vote'),

    path('posts/create/', CreatePostView.as_view(), name='create_post'),
    path('pin/', BookmarkView.as_view(), name='bookmark'),
    path('pin/<int:thread_id>&&<int:user_id>/', CheckBookmarkedView.as_view(), name='check_bookmarked'),
    path('bookmark/<int:user_id>/', BookmarkedThreadsView.as_view(), name='get_bookmarked_threads'),

]
