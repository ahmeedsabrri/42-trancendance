from .models import Connection, Notification
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import Q
User = get_user_model()

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["otp_uri"] = instance.get_otp_uri()
        return data

class UpdateUsernameSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate(self, data):
        user = self.context['request'].user
        username = data.get('username')
        password = data.get('password')

        if not password or password.strip() == "":
            raise serializers.ValidationError({
                'message': 'Password cannot be empty.'
            })
        if not username:
            print('username', username)
            raise serializers.ValidationError({
                'message': 'Username cannot be empty.'
            })
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                'message': 'This username is already taken.'
            })
        password = data.get('password')
        if not user.check_password(password):
            raise serializers.ValidationError({
                'message': 'Password is incorrect.'
            })
        
        return data

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance

    def to_representation(self, instance):
        return { 'message': 'Username updated successfully' } 


    
class PasswordUpdateSerializer(serializers.Serializer):
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

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"error":'Current password is incorrect.'})
        return value

    def validate_new_password(self, value):
        try:
            validate_password(value, self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, data):
        if data['current_password'] == data['new_password']:
            raise serializers.ValidationError({'error': 'New password must be different from the current password.'})
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'avatar', 'id', 'status', 'level','is_online']


class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'id']
class UserProfileSerializer(serializers.ModelSerializer):
    connection_type = serializers.SerializerMethodField()
    sender = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'avatar', 'id', 'status', 'level','connection_type','sender','is_online']

    def get_connection_type(self, obj):
        request_user = self.context['request'].user
        if not Connection.objects.filter(Q(sender=request_user, receiver=obj) | Q(sender=obj, receiver=request_user)).exists():
            return 'not_connected'
        connection = Connection.objects.get(Q(sender=request_user, receiver=obj) | Q(sender=obj, receiver=request_user))
        return connection.status 
    def get_sender(self, obj):
        request_user = self.context['request'].user
        if not Connection.objects.filter(Q(sender=request_user, receiver=obj) | Q(sender=obj, receiver=request_user)).exists():
            return None
        connection = Connection.objects.get(Q(sender=request_user, receiver=obj) | Q(sender=obj, receiver=request_user))
        return SenderSerializer(connection.sender).data
        

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    receiver = ProfileSerializer(read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'recevier', 'status', 'created_at']
        
        
class NotificationSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = ['id','notification_type', 'read', 'created_at', 'message','sender']

class FriendsSerializer(serializers.ModelSerializer):
    connection_status = serializers.ChoiceField(
        choices=[
            ('pending', 'pending'),
            ('accepted', 'accepted'),
            ('rejected', 'rejected'),
            ('blocked', 'blocked'),
        ],
        read_only=True
    )
    class Meta:
        model = User
        fields = ['first_name','last_name','username','email','avatar','id','status','level','connection_status']
        


class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'username', 'avatar', 'id']
