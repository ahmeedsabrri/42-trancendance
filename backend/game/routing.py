# game/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/game/localGame/$", consumers.LocalGameConsumer.as_asgi()),
    re_path(r"ws/game/onlineGame/$", consumers.OnlineGameConsumer.as_asgi()),
]