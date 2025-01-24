# your_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from collections import defaultdict

User = get_user_model()

online_users = defaultdict(int)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global online_users
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.group_name = f'user_{self.scope["user"].id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            self.user = self.scope['user']
            online_users[self.user.id] += 1
             # Mark the user as online
            self.user = self.scope['user']
            await self.update_user_status(self.user.id, True)
            await self.accept()
            
    async def disconnect(self, close_code):
        global online_users
        # Remove the user from the group
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            # Mark the user as offline
            online_users[self.user.id] -= 1
            if online_users[self.user.id] == 0:
                await self.update_user_status(self.user.id, False)


    async def receive(self, text_data):
        # Handle incoming WebSocket messages (optional)
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')

        if action == 'mark_as_read':
            notification_id = text_data_json.get('notification_id')
            await self.mark_notification_as_read(notification_id)
    
    async def send_notification(self, event):
        # Send the notification to the WebSocket
        notification = event['notification']
        await self.send(text_data=json.dumps({
            'type': 'send_notification',
            'notification': notification,
        }))

    @sync_to_async
    def mark_notification_as_read(self, notification_id):
        # Mark a notification as read
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.read_notification()
        except Notification.DoesNotExist:
            pass
    @sync_to_async
    def update_user_status(self, user_id, is_online):
        User.objects.filter(id=user_id).update(is_online=is_online)