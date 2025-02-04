from django.db import models
from django.utils import timezone

from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Conversation(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_user2')
    last_message = models.OneToOneField('Message', on_delete=models.CASCADE, related_name='last_message', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"conversation({self.user1.username + '_' + self.user2.username})"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE, null=True, blank=True)
    time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender} at {self.time}"