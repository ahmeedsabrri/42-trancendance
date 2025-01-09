from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp
from django.utils.timezone import now
# Create your models here.


class User(AbstractUser):
    avatar = models.URLField(max_length=200, null=True, blank=True)
    coverImage = models.URLField(max_length=200, null=True, blank=True)
    email = models.EmailField(unique=True)
    twofa_enabled = models.BooleanField(default=False)
    otp_base32 = models.CharField(max_length=32, default=pyotp.random_base32)
    friends = models.ManyToManyField(to='User', blank=True)
    blocked = models.ManyToManyField(to='User', blank=True, related_name='blocked_by')
    level = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, default="offline")

    def enable_2fa(self) -> None:
        self.twofa_enabled = True
        self.save()

    def disable_2fa(self) -> None:
        self.twofa_enabled = False
        self.save()

    def get_otp_uri(self) -> str:
        return pyotp.TOTP(self.otp_base32).provisioning_uri(
            name=self.username, issuer_name="ft_transcendance"
        )

    def verify_otp(self, otp_code) -> bool:
        return pyotp.TOTP(self.otp_base32).verify(otp_code)

    def __str__(self) -> str:
        return self.username


class Connection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'pending'),
        ('accepted', 'accepted'),
        ('rejected', 'rejected'),
    )
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connected_user')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friends')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('sender', 'receiver')
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"

    def accept(self):
        self.status = "accepted"
        self.sender.friends.add(self.receiver)
        self.receiver.friends.add(self.sender)
        self.save()

    def decline(self):
        self.status = "rejected"
        self.sender.remove(self.receiver)
        self.receiver.remove(self.sender)
        self.save()
        
class Notification(models.Model):
    TYPE_CHOICES = (
        ('friend_request', 'friend_request'),
        ('friend_accept', 'friend_accept'),
        ('friend_decline', 'friend_decline'),
        ('message', 'message'),
        ('game_invite', 'game_invite'),
        ('game_accept', 'game_accept'),
        ('game_decline', 'game_decline'),
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)
    
    def __str__(self):
        return f"Notification for {self.recipient.username} ({self.notification_type})"

    
    def read_notification(self):
        self.read = True
        self.save()