from rest_framework_simplejwt.views import TokenObtainSlidingView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import SlidingToken
from .serializers import RegisterSerializer, \
    OuathCallBackSerializer,TwoFatorAuthcSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.exceptions import ValidationError
from .utils.utils import send_email_verified
User = get_user_model()

class VerifyEmailView(APIView):
    permission_classes = []
    def post(self, request):
        print(request.data)
        uid = request.data.get('uid')
        token = request.data.get('token')
        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid);
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                send_email_verified(user)
                return Response({"message": "Your email has been verified successfully!"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response({"error": "Invalid verification link."},status=status.HTTP_400_BAD_REQUEST,)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
class TestAuthView(APIView):

    def get(self, request):
        return Response({"message": "success"})


class LoginView(TokenObtainSlidingView):
    permissions_classes = []
    def post(self, request):
        response = super().post(request)
        
        if response.status_code == 200:
            response.set_cookie(
                key="jwt_token",
                value=response.data.pop('token'),
                httponly=True,
            )
            response.data = {"message": "You logged in successfully"}
        return response


class LogOutView(APIView):
    def get(self, request):
        token = SlidingToken(request.COOKIES["jwt_token"])
        token.blacklist()
        res = Response({"message": "you signed out"})
        res.delete_cookie("jwt_token")
        return res


class RegisterView(APIView):
    permission_classes = []
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"message": "Email verification link sent"}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_message = ""
            if "username" in e.detail:
                error_message = e.detail["username"][0]
            elif "email" in e.detail:
                error_message = e.detail["email"][0]
            else:
                error_message = "An error occurred during registration."
            return Response({"message": error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OauthCallBackView(APIView):
    permission_classes = []
    serializer_class = OuathCallBackSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create a sliding token for the user
        token = SlidingToken.for_user(user)
        
        # Set the token in an HTTP-only cookie
        res = Response({"message": "You logged in successfully"})
        res.set_cookie(
            key="jwt_token",
            value=str(token),
            httponly=True,
            secure=True,  # Ensure this is True in production (requires HTTPS)
            samesite="Lax",  # Prevent CSRF attacks
        )
        return res


class TwoFaBaseView(generics.GenericAPIView):
    serializer_class = TwoFatorAuthcSerializer
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        self.context["request"] = request
        serializer = self.serializer_class(
            data=request.data,
            context=self.context,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class Enable2FAView(TwoFaBaseView):
    context = {"action": "enable"}

class Disable2FAView(TwoFaBaseView):
    context = {"action": "disable"}
