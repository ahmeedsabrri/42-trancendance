import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .serializers import MessagesSerializer, ConversationsSerializer
from .models import Conversation, Message
from users.utils import send_notification
from users.models import Notification

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection setup"""
        logger.info("User in Scope: %s", self.scope['user'])
        self.user_id = self.scope['user'].id
        self.group_name = f'chat_user_{self.user_id}' 

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        logger.info(f"WebSocket connected for user {self.user_id}")

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection cleanup"""
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        logger.info(f"WebSocket disconnected for user {self.user_id}")

    @database_sync_to_async
    def get_user(self, user_id):
        """Fetch user by ID with error handling"""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def create_message(self, data):
        sender = data.get('sender')
        receiver = data.get('receiver')
        message_text = data.get('message')
        conversation_id = data.get('conversation_id')
        time = data.get('time')

        if not all([sender, receiver, message_text, conversation_id]):
            logger.error("Missing required message data")
            return None

        conversation, created = Conversation.objects.get_or_create(
            id=conversation_id,
            defaults={
                'user1': sender,
                'user2': receiver,
                'last_message': None
            }
        )

        new_message = Message.objects.create(
            sender=sender,
            message=message_text,
            receiver=receiver,
            conversation=conversation,
            time=time
        )

        if not created:
            conversation.last_message = new_message
            conversation.save()

        return new_message

    async def receive(self, text_data):
        try:
            logger.info(f"Received message: {text_data}")
            data = json.loads(text_data)
            if data['type'] != 'chat_message':
                logger.error("Invalid message type")
                return

            sender = self.scope['user']
            receiver = await self.get_user(data['reciever_id'])

            if not sender or not receiver:
                logger.error(f"sender: {sender}, receiver: {receiver}")
                logger.error("Invalid sender or receiver ID")
                return

            message_data = {
                'sender': sender,
                'receiver': receiver,
                'message': data['message'],
                'conversation_id': data['conversation_id'],
                'time': data['time']
            }

            new_message = await self.create_message(message_data)
            if not new_message:
                logger.error("Failed to create message")
                return

            response_data = {
                'type': 'chat_message',
                'id': new_message.id,
                'sender': {
                    'id': sender.id,
                    'username': sender.username,
                    'email': sender.email,
                    'first_name': sender.first_name,
                    'last_name': sender.last_name,
                    'is_online': sender.is_online,
                    'avatar': sender.avatar
                },
                'message': new_message.message,
                'conversation_id': new_message.conversation.id,
                'time': new_message.time,
            }

            for group_name in [
                f'chat_user_{self.user_id}',
                f'chat_user_{data["reciever_id"]}'
            ]:
                await self.channel_layer.group_send(group_name, response_data)
            notification =  await self.create_notif(message_data)
            if not new_message:
                logger.error("Failed to create notification")
                return
            await sync_to_async(send_notification)(receiver.id,notification)
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'id': event['id'],
            'sender': event['sender'],
            'message': event['message'],
            'conversation_id': event['conversation_id'],
            'time': event['time'],
        }))

    @database_sync_to_async
    def create_notif(self,data):
        """
            notif data 
            sender: Any,
            recipient: Any,
            notification_type: Any,
            message: Any
        """
        sender = data.get('sender')
        receiver = data.get('receiver')
        message_text = data.get('message')
        notification = Notification.create_notification(sender,receiver,"message",message_text)
        if not all([sender, receiver, message_text]):
            logger.error("Missing required message data")
            return None
        return notification