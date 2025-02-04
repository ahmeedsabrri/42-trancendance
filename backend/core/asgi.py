"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from authentication.middleware import WebSocketJWTAuthMiddleware
from channels.security.websocket import AllowedHostsOriginValidator
from game import consumers as PongCosumers
from TicTacToe import consumers as TicTacConsumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

djang_asgi_application = get_asgi_application()

from chat.consumers import ChatConsumer
from users.consumers import NotificationConsumer
from django.urls import re_path

application = ProtocolTypeRouter({
    "http": djang_asgi_application,
    "websocket": AllowedHostsOriginValidator(
        WebSocketJWTAuthMiddleware(
            URLRouter([
                re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
                re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
                re_path(r"ws/game/localGame/$", PongCosumers.LocalGameConsumer.as_asgi()),
                re_path(r"ws/game/onlineGame/(?P<invite_id>\d+)?/?$", PongCosumers.OnlineGameConsumer.as_asgi()),
                re_path(r"ws/TicTac/remote/", TicTacConsumers.RemoteTicTacToeConsumer.as_asgi()),
                re_path(r"ws/TicTac/local/", TicTacConsumers.LocalTicTacToeConsumer.as_asgi()),

            ])
        )
    )
})