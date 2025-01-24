from django.urls import path
from . import views

# The next step is to point the root URLconf at the game.urls module

urlpatterns = [
    # path('', views.index, name="index"), 
    # path("<str:room_name>/", views.room, name="room"),
]
