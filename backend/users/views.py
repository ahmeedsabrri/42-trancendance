from .models import Connection, Notification
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserInfoSerializer, PasswordUpdateSerializer,ProfileSerializer,NotificationSerializer,FriendsSerializer
from rest_framework import status,  permissions
from rest_framework.generics import GenericAPIView
from rest_framework import generics
from django.db.models import Q


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

class BlockRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            connection = Connection.objects.get(sender=sender, receiver=receiver)
            if connection.status == "blocked" or connection.status == "rejected":
                return Response(
                    {
                        "error": "Invalid request",
                        "message": "Friend already blocked or request declined."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if connection.status == "accepted":
                connection.block()
            return Response(
                {
                    "message": "Friend blocked successfully."
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
    serializer_class = ProfileSerializer
    
    def get(self, request):
        friends = self.get_queryset()
        serializer = self.serializer_class(friends, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        friends = Connection.objects.filter(
            Q(sender=user, status="accepted") | Q(receiver=user, status="accepted")
        ).select_related('sender', 'receiver')
        
        # Collect the users who are friends (excluding the current user)
        friend_users = []
        for connection in friends:
            if connection.sender != user:
                friend_users.append(connection.sender)
            else:
                friend_users.append(connection.receiver)
        return friend_users
    

class ListUserNotificationView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        user = self.request.user
        sender = User.objects.get(username=self.kwargs['username'])
        response = Connection.objects.filter(sender=sender, receiver=user)
        response |= Notification.objects.filter(recipient=user)
        return response
    
    
class ListBlockedUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def get(self, request):
        blocked_users = self.get_queryset()
        serializer = self.serializer_class(blocked_users, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        blocked_users = Connection.objects.filter(
            Q(sender=user, status="blocked") | Q(receiver=user, status="blocked")
        ).select_related('sender', 'receiver')
        
        # Collect the users who are blocked (excluding the current user)
        blocked_user_list = []
        for connection in blocked_users:
            if connection.sender != user:
                blocked_user_list.append(connection.sender)
            else:
                blocked_user_list.append(connection.receiver)
        return blocked_user_list