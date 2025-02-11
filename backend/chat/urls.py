from django import urls
from django.urls import path
from . import views

urlpatterns = [
    path('chat/user/<int:user_id>/', views.get_user, name='get_user'),
    path('chat/new_conversation/<int:user>/', views.new_conversation, name='new_conversation'),
    path('chat/conversations/', views.get_conversations, name='get_conversations'),
    path('chat/conversation/<int:conversation_id>/messages/', views.get_messages, name='get_messages'),
]
