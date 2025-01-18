from .filters import UserFilter
from .models import Connection, Notification
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SearchUserSerializer, UserInfoSerializer, PasswordUpdateSerializer,ProfileSerializer,NotificationSerializer,FriendsSerializer,UserProfileSerializer
from rest_framework import status,  permissions
from rest_framework.generics import GenericAPIView
from rest_framework import generics
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .utils.utils import send_notification 

User = get_user_model()

# Create your views here.

class MarkNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        notification = get_object_or_404(Notification, id=pk)
        notification.read = True
        notification.save()
        return Response(
            {
                "message": "Notification marked as read."
            },
            status=status.HTTP_200_OK
        )


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
    
    def get(self, request, username):
        user = get_object_or_404(User, username=username)

        connection = Connection.objects.filter(
            Q(sender=request.user, receiver=user) | Q(sender=user, receiver=request.user)
        ).first()

        connection_type = "not_connected"
        if connection:
            connection_type = connection.status

        serializer = UserProfileSerializer(user, context={'request': request})
        user_data = serializer.data
        user_data["connection_type"] = connection_type
        user_data["sender"] = connection.sender.username if connection else None

        return Response(user_data)




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
            receiver = User.objects.get(username=username)
            if sender == receiver:
                return Response(
                    {
                        "error": "Invalid receiver",
                        "message": "You can't send friend request to yourself."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Connection.objects.filter(sender=sender, receiver=receiver).exists():
                return Response(
                    {
                        "error": "Invalid receiver",
                        "message": "Friend request already sent."
                    },status=status.HTTP_400_BAD_REQUEST)
            Connection.objects.create(sender=sender, receiver=receiver)
             # Create a notification using the `create_notification` method
            notification = Notification.create_notification(
                sender=sender,
                recipient=receiver,
                notification_type='friend_request',
                message=f'{sender.username} sent you a friend request.',
            )

            # Send the notification via WebSocket
            send_notification(receiver.id, {
                'id': notification.id,
                'sender': sender.username,
                'recipient': receiver.username,
                'notification_type': notification.notification_type,
                'message': notification.message,
                'read': notification.read,
                'created_at': notification.created_at.isoformat(),
            })  
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
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                connection.accept()
            else:
                Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).accept()
            notification = Notification.create_notification(
                sender=receiver,
                recipient=sender,
                notification_type='friend_accept',
                message=f'{receiver.username} accepted your friend request.',
            )
            send_notification(sender.id, {
                'id': notification.id,
                'sender': receiver.username,
                'recipient': sender.username,
                'notification_type': notification.notification_type,
                'message': notification.message,
                'read': notification.read,
                'created_at': notification.created_at.isoformat(),
            })
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
            
            if Connection.objects.get(sender=sender, receiver=receiver).status == "blocked" or Connection.objects.get(sender=sender, receiver=receiver).status == "rejected":
                return Response(
                    {
                        "error": "Invalid request",
                        "message": "Friend already blocked or request declined."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                Connection.objects.get(sender=sender, receiver=receiver).decline()
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
            receiver = User.objects.get(username=username)
            sender = request.user
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
    
    def get(self, request):
        notifications = self.get_queryset()
        serializer = self.serializer_class(notifications, many=True)
        return Response(serializer.data)
    def get_queryset(self):
        user = self.request.user
        notifications = Notification.objects.filter(recipient=user).select_related('sender')
        return notifications
    
    
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
    
    
class ListConnectionsUsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    
    def get(self, request):
        connections = self.get_queryset()
        serializer = self.serializer_class(connections, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        connections = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related('sender', 'receiver')
        
        connection_users = []
        for connection in connections:
            if connection.sender != user:
                connection_users.append(connection.sender)
            else:
                connection_users.append(connection.receiver)
        return connection_users
    

# list of friends by username
class FriendsListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FriendsSerializer

    def get_queryset(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        friends = Connection.objects.filter(
            Q(sender=user, status="accepted") | 
            Q(receiver=user, status="accepted")
        ).select_related('sender', 'receiver')
        
        friend_users = []
        for connection in friends:
            if connection.sender != user:
                friend_users.append(connection.sender)
            else:
                friend_users.append(connection.receiver)
        return friend_users


class UnFriendView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, username):
        try:
            friend = User.objects.get(username=username)
            print(friend)
            user = request.user
            connection = Connection.objects.get(
                Q(sender=user, receiver=friend) | Q(sender=friend, receiver=user)
            )
            connection.delete()
            return Response(
                {
                    "message": "Friend removed successfully."
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid friend",
                    "message": f"No user found with username: {username}"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Connection.DoesNotExist:
            return Response(
                {
                    "error": "Invalid request",
                    "message": "No friend found."
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
            
class UnBlockUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, username):
        try:
            blocked_user = User.objects.get(username=username)
            user = request.user
            connection = Connection.objects.get(
                Q(sender=user, receiver=blocked_user) | Q(sender=blocked_user, receiver=user)
            )
            connection.delete()
            return Response(
                {
                    "message": f"{blocked_user} unblocked successfully."
                },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {
                    "error": "Invalid user",
                    "message": f"No user found with username: {username}"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Connection.DoesNotExist:
            return Response(
                {
                    "error": "Invalid request",
                    "message": "No user found."
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
            

class UserSearchView(generics.ListAPIView):
    serializer_class = SearchUserSerializer
    filterset_class = UserFilter
    
    def get_queryset(self):
        queryset = User.objects.all()
        filtered_queryset = self.filterset_class(self.request.GET, queryset=queryset).qs
        return filtered_queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset:
            return Response(
                {
                    "message": "No users found with the given search parameters."
                },
                status=status.HTTP_200_OK
            )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)