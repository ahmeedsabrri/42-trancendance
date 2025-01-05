from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationsConsumer(AsyncWebsocketConsumer):
    """
        task : handel notifications connections
        notification type : 
            - friend request 
            - message notif
            - games request 
            - tournement notif
    """
    ...