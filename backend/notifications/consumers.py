from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationsConsumer(AsyncWebsocketConsumer):
    
    
    # async def connect(self):
        
    #     """
    #         task : handel notifications connections
    #         notification type : 
    #             - friend request 
    #             - message notif
    #             - games request 
    #             - tournement notif
    #     """
    #     self.user = self.scope["user"]
    #     self.group_name = f"notifications_{self.user.id}"
    #     await self.channel_layer.group_add(
    #         self.group_name,
    #         self.channel_name
    #     )
    #     await self.accept()    
    pass