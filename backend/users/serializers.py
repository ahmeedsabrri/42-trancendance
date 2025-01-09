from .models import Connection, Notification
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["otp_uri"] = instance.get_otp_uri()
        return data

class PasswordUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    class Meta:
        model = User 
        fields = ['current_password', 'new_password', 'confirm_password']
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        try:
            # Use Django's password validation
            validate_password(value, self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username','email','avatar','id','status','level']
        

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    receiver = ProfileSerializer(read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'recevier', 'status', 'created_at']
        
        
class NotificationSerializer(serializers.ModelSerializer):
    recipient = ProfileSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'notification_type', 'read', 'created_at']
        


class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','username','email','avatar','id','status','level']