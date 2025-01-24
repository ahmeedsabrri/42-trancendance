# TicTacToe/management/commands/create_users.py

from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create some default users'

    def handle(self, *args, **kwargs):
        # Create users

