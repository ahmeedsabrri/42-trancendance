from rest_framework.response import Response
from django.http import HttpResponse
from .models import Conversation, Message
from django.contrib.auth import get_user_model
from rest_framework import permissions
from chat.serializers import ConversationsSerializer, MessagesSerializer, UserSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from datetime import datetime
import logging
from django.db.models import Q

User = get_user_model()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chat")


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def new_conversation(request, user):
    try:
        user1 = request.user
        user2 = User.objects.get(id=user)
    except (User.DoesNotExist):
        return Response({"error": "User Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    conversation_order = Conversation.objects.filter(Q(user1=user1 , user2=user2) | Q(user1=user2 , user2=user1))
    if conversation_order.exists():
        conversation = conversation_order.first()
        conversationSer = ConversationsSerializer(conversation, many=False)
        return Response(conversationSer.data)
    else:
        conv = Conversation.objects.create(user1=user1, user2=user2)
        convSer = ConversationsSerializer(conv, many=False)
        return Response(convSer.data, status=status.HTTP_201_CREATED)
    

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        userSer = UserSerializer(user, many=False)
        return Response(userSer.data)
    except(User.DoesNotExist):
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_users(request):
    users = User.objects.exclude(id=request.user.id)
    usersSer = UserSerializer(users, many=True)
    return Response(usersSer.data)

@api_view(['GET'])
def get_conversations(request):
    logger.info("I am in get_conversations")
    try:
        conversations_user1 = request.user.conversations_user1.filter(last_message__isnull=False)
        conversations_user2 = request.user.conversations_user2.filter(last_message__isnull=False)
        conversations = conversations_user1.union(conversations_user2)
        conversationsSer = ConversationsSerializer(conversations, many=True)
    except (User.DoesNotExist):
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(conversationsSer.data)


@api_view(['GET'])
def get_messages(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except (Conversation.DoesNotExist):
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)
    messages = conversation.messages.all()
    messagesSer = MessagesSerializer( messages, many=True )

    return Response(messagesSer.data)