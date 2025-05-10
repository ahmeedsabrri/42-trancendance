from rest_framework import serializers
from .models import Conversation, Message


from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_online', 'avatar')

class MessagesSerializer(serializers.ModelSerializer):
    sender = UserSerializer(many=False)
    receiver = UserSerializer(many=False)

    class Meta:
        model = Message
        fields = '__all__'

class ConversationsSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(many=False)
    user2 = UserSerializer(many=False)
    last_message = MessagesSerializer(many=False)

    class Meta:
        model = Conversation
        fields = '__all__'
