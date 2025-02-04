from django import urls
from django.urls import path
from . import views

urlpatterns = [
    path('user/<int:user_id>', views.get_user, name='get_user'),
    path('users', views.get_users, name='get_users'),
    path('new_conversation/<int:user>', views.new_conversation, name='new_conversation'),
    path('conversations', views.get_conversations, name='get_conversations'),
    path('conversation/<int:conversation_id>/messages', views.get_messages, name='get_messages'),
]
