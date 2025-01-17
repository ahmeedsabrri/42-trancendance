# your_app/utils.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification(recipient_id, notification_data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'user_{recipient_id}',
        {
            'type': 'send_notification',
            'notification': notification_data,
        }
    )