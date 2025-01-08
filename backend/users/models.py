from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
import pyotp


class User(AbstractUser):
    avatar = models.URLField(max_length=200, null=True, blank=True)
    coverImage = models.URLField(max_length=200, null=True, blank=True)
    email = models.EmailField(unique=True)
    twofa_enabled = models.BooleanField(default=False)
    otp_base32 = models.CharField(max_length=32, default=pyotp.random_base32)
    friends = models.ManyToManyField(to='User', blank=True)
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


class connect(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='connected_user')
    recevier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friends')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('sender', 'recevier')
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"
    
    def accept(self):
        print("accept")
        self.status = "accepted"
        self.save()
    
    def decline(self):
        print("decline")
        self.status = "declined"
        self.save() 