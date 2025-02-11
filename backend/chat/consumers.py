import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from .models import Conversation, Message
from users.utils import send_notification
from users.models import Notification, Connection
from django.db.models import Q

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['user'].id
        self.group_name = f'chat_user_{self.user_id}' 

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    @database_sync_to_async
    def get_user(self, user_id):
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

        if not all([sender, receiver, message_text, conversation_id]):
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
            conversation=conversation
        )

        if not created:
            conversation.last_message = new_message
            conversation.save()

        return new_message
    
    @database_sync_to_async
    def check_user_blocked(self, sender, receiver):
        try:
            return Connection.objects.filter(Q(sender=sender, receiver=receiver, status="blocked") | Q(sender=receiver, receiver=sender, status="blocked")).exists()
        except Connection.DoesNotExist:
            return False
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data['type'] != 'chat_message':
                return

            sender = self.scope['user']
            receiver = await self.get_user(data['reciever_id'])

            if not sender or not receiver:
                return

            if await self.check_user_blocked(sender, receiver):
                return
            message_data = {
                'sender': sender,
                'receiver': receiver,
                'message': data['message'],
                'conversation_id': data['conversation_id']
            }
            new_message = await self.create_message(message_data)
            if not new_message:
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
                'time': new_message.time.isoformat(),
            }
            
            for group_name in [
                f'chat_user_{self.user_id}',
                f'chat_user_{data["reciever_id"]}'
            ]:
                await self.channel_layer.group_send(group_name, response_data)
            notification =  await self.create_notif(message_data)
            if not notification:
                return
            await sync_to_async(send_notification)(receiver.id,notification)
        except json.JSONDecodeError:
            pass 
        except Exception as e:
            pass

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
        sender = data.get('sender')
        receiver = data.get('receiver')
        message_text = data.get('message')
        notification = Notification.create_notification(sender,receiver,"message",message_text)
        if not all([sender, receiver, message_text]):
            return None
        return notification