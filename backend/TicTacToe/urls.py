
from django.urls import path
from django import urls
from . import views

urlpatterns = [
    path('match_history/<int:pk>/', views.getPlayerMatches)
]