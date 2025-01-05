from channels.generic.websocket import AsyncWebsocketConsumer


class   ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.send({
            "type": "websocket.accept",
        })
        await self.accept()
    