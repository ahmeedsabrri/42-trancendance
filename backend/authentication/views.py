from rest_framework_simplejwt.views import TokenObtainSlidingView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import SlidingToken
from .serializers import RegisterSerializer, \
    OuathCallBackSerializer, UserInfoSerializer, TwoFatorAuthcSerializer, PasswordUpdateSerializer,ProfileSerializer
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from .models import User
class TestAuthView(APIView):

    def get(self, request):
        return Response({"message": "success"})


class LoginView(TokenObtainSlidingView):
    def post(self, request):
        response = super().post(request)
        if response.status_code == 200:
            response.set_cookie(
                key="jwt_token",
                value=response.data.pop('token'),
                httponly=True,
            )
            response.data = {"message": "you loged in successfully"}
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
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "user created successfully"})


class OauthCallBackView(APIView):
    permission_classes = []
    serializer_class = OuathCallBackSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = SlidingToken.for_user(user)
        res = Response({"message": "you loged in successfully"})
        res.set_cookie(
            key="jwt_token",
            value=str(token),
            httponly=True,
        )
        return res


class UserView(APIView):
    serializer_class = UserInfoSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class(user)
        return Response(serializer.data)



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
    
    


class PasswordUpdateView(GenericAPIView):
    serializer_class = PasswordUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Password successfully updated.',
                'status': 'success'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def get(self,request,username):
        try:
            user = User.objects.get(username=username)
            serializer = self.serializer_class(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid username",
                    "message": f"No user found with username: {username}"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    "error": "Server error",
                    "message": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )