from .models import Connection, Notification
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserInfoSerializer, PasswordUpdateSerializer,ProfileSerializer,NotificationSerializer,FriendsSerializer
from rest_framework import status,  permissions
from rest_framework.generics import GenericAPIView
from rest_framework import generics
User = get_user_model()
# Create your views here.
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
class UserView(APIView):
    serializer_class = UserInfoSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class(user)
        return Response(serializer.data)


class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    




class SendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, username):
        try:
            sender = request.user
            print("weeeeeeeeee ====>" + username)
            receiver = User.objects.get(username=username)
            if sender == receiver:
                return Response(
                    {
                        "error": "Invalid receiver",
                        "message": "You can't send friend request to yourself."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            Connection.objects.create(sender=sender, receiver=receiver)
            Notification.objects.create(
                recipient=sender,
                notification_type="friend_request"
            )
            return Response(
                {
                    "message": "Friend request sent successfully."
                },
                status=status.HTTP_201_CREATED
            )
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid receiver",
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
class AcceptRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            Connection.objects.get(sender=sender, receiver=receiver).accept()
            Notification.objects.create(
                recipient=sender,
                notification_type="friend_accept"
            )
            return Response(
                {
                    "message": "Friend request accepted successfully."
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid sender",
                    "message": f"No user found with username: {username}"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Connection.DoesNotExist:
            return Response(
                {
                    "error": "Invalid request",
                    "message": "No friend request found."
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

class DeclineRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            Connection.objects.get(sender=sender, receiver=receiver).decline()
            Notification.objects.create(
                recipient=sender,
                notification_type="friend_decline"
            )
            return Response(
                {
                    "message": "Friend request declined successfully."
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid sender",
                    "message": f"No user found with username: {username}"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Connection.DoesNotExist:
            return Response(
                {
                    "error": "Invalid request",
                    "message": "No friend request found."
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


class ListFrinedsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FriendsSerializer
    
    def get(self):
        user = self.request.user
        friends = Connection.objects.filter(sender=user, status="accepted").values_list('receiver', flat=True)
        friends |= Connection.objects.filter(receiver=user, status="accepted").values_list('sender', flat=True)
        return User.objects.filter(id__in=friends)
    
    
    

class ListUserNotificationView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        sender = User.objects.get(username=self.kwargs['username'])
        response = Connection.objects.filter(sender=sender, receiver=user)
        response |= Notification.objects.filter(recipient=user)
        return response