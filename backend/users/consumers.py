# your_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from asgiref.sync import sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Check if the user is authenticated
        if self.scope['user'].is_anonymous:
            await self.close()  # Reject connection for anonymous users
        else:
            # Add the user to a group for notifications
            self.group_name = f'user_{self.scope["user"].id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the group
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

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
            'type': 'notification',
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