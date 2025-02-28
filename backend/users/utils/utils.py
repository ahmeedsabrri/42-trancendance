# your_app/utils.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from users.serializers import NotificationSerializer

def send_notification(recipient_id, notification_data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'user_{recipient_id}',
        {
            'type': 'send_notification',
            'notification': NotificationSerializer(notification_data).data,
        }
    )

def is_blocked(user, blocked_user):
    try:
        return Connection.objects.filter(Q(sender=sender, receiver=receiver, status="blocked") | Q(sender=receiver, receiver=sender, status="blocked")).exists()
    except Connection.DoesNotExist:
        return False