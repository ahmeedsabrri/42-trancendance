from rest_framework import serializers
from django.contrib.auth import get_user_model
from requests_oauthlib import OAuth2Session
from django.conf import settings
import random
import pyotp
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
        }

    def create(self, validated_data):
        otp_base32 = pyotp.random_base32()
        user = User.objects.create_user(**validated_data)
        return user


class OuathCallBackSerializer(serializers.Serializer):
    code = serializers.CharField(write_only=True)

    def validate(self, attrs):
        oauth = OAuth2Session(
            client_id=settings.OAUTH_CLIENT_ID,
            redirect_uri=settings.OAUTH_REDIRECT_URI,
        )
        _ = oauth.fetch_token(
            token_url="https://api.intra.42.fr/oauth/token",
            code=attrs["code"],
            client_secret=settings.OAUTH_CLIENT_SECRET,
        )

        user_info = oauth.get("https://api.intra.42.fr/v2/me")
        user_info.raise_for_status()
        user_info_json = user_info.json()

        return {
            "username": user_info_json["login"],
            "email": user_info_json["email"],
            "first_name": user_info_json["first_name"],
            "last_name": user_info_json["last_name"],
            "avatar": user_info_json["image"]["link"],
        }

    def unique_unique_username(self, username):
        while User.objects.filter(username=username).exists():
            username = f"{username}_{random.randint(1000, 9999)}"
        return username

    def create(self, validated_data):
        username = self.unique_unique_username(validated_data["username"])
        validated_data["username"] = username
        email = validated_data.pop("email")
        user, _ = User.objects.get_or_create(email=email, defaults={**validated_data})
        return user


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["otp_uri"] = instance.get_otp_uri()
        return data


class TwoFatorAuthcSerializer(serializers.Serializer):
    otp_code = serializers.CharField(
        max_length=6, min_length=6, required=True, write_only=True,
        error_messages={
            'required': 'OTP code is required.',
            'max_length': 'OTP code must be exactly 6 characters.',
            'min_length': 'OTP code must be exactly 6 characters.'
        }
    )

    def validate(self, attrs):
        self.user = self.context["request"].user
        if not self.user.verify_otp(attrs["otp_code"]):
            raise serializers.ValidationError({"otp_code": "Invalid OTP code!"})

        if self.context["action"] == "enable":
            self.user.enable_2fa()
        else:
            self.user.disable_2fa()
        return {
            "message": f"successfully {self.context['action']}d two factor authentication"
        }


from rest_framework_simplejwt.serializers import TokenObtainSlidingSerializer


class MyTokenObtainSerializer(TokenObtainSlidingSerializer):
    otp_code = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        otp_code = attrs.get("otp_code", None)
        data = super().validate(attrs)
        if self.user.twofa_enabled:
            if not otp_code:
                raise serializers.ValidationError(
                    {"otp_code": "this field is required"}
                )
            elif not self.user.verify_otp(otp_code):
                raise serializers.ValidationError({"otp_code": "OTPCode is not valid"})
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