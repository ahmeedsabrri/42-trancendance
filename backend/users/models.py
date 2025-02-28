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
    level = models.PositiveIntegerField(default=1)
    xp = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default="offline")
    is_online = models.BooleanField(default=False)
    
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
        ('blocked', 'blocked'),
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

    
    def send_request(sender, receiver):
        Notification.objects.create(
            recipient=receiver,
            sender=sender,
            notification_type="friend_request",
            message=f"{sender.username} sent you a friend request"
        )
        return Connection.objects.create(sender=sender, receiver=receiver)
    def accept(self,sender):
        self.status = "accepted"
        self.save()
    def decline(self):
        self.status = "rejected"
        self.delete()
    
    def block(self):
        self.status = "blocked"
        self.save()
    
    def get_all_connections(user):
        return Connection.objects.filter(sender=user) | Connection.objects.filter(receiver=user)
        
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
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='s_notifications', null=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='r_notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='')
    message = models.TextField(blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"Notification for {self.recipient.username} ({self.notification_type})"

    
    def read_notification(self):
        self.read = True
        self.save()
    
    @classmethod
    def create_notification(cls, sender, recipient, notification_type, message):
        """
        Create a new notification.
        """
        return cls.objects.create(
            sender=sender,
            recipient=recipient,
            notification_type=notification_type,
            message=message,
        )