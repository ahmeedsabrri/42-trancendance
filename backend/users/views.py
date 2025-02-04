from .filters import UserFilter
from .models import Connection, Notification
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SearchUserSerializer, UpdateUsernameSerializer, UserInfoSerializer, PasswordUpdateSerializer,ProfileSerializer,NotificationSerializer,FriendsSerializer,UserProfileSerializer
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


class PasswordUpdateView(generics.UpdateAPIView):
    serializer_class = PasswordUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'message': 'Password successfully updated.',
            'status': 'success',
            'user_id': instance.id,
            'username': instance.username
        }, status=status.HTTP_200_OK)


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
    

class SendGameInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serialiser_class = NotificationSerializer
    def get(self, request, username):
        try:
            sender = request.user
            receiver = User.objects.get(username=username)
            if sender == receiver:
                return Response(
                    {
                        "error": "Invalid receiver",
                        "message": "You can't send game invite to yourself."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
             # Create a notification using the `create_notification` method
            notification = Notification.create_notification(
                sender=sender,
                recipient=receiver,
                notification_type='game_invite',
                message=f'{sender.username} sent you a pingpong game invite.',
            )
            
            # Send the notification via WebSocket
            notification_data  = self.serialiser_class(notification).data
            send_notification(receiver.id, notification_data)
            return Response(
                {
                    "message": "Game invite sent successfully."
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

class SendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serialiser_class = NotificationSerializer
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
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                if connection.status == "accepted":
                    return Response(
                    {
                        "error": "Invalid request",
                        "message": "You are already friends."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                    )
                elif connection.status == "pending":
                    return Response(
                    {
                        "error": "Invalid request",
                        "message": "Friend request already sent."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                    )
                if connection.status == "rejected":
                    connection.status = "pending"
                    connection.save()
            else:
                Connection.objects.create(sender=sender, receiver=receiver)
             # Create a notification using the `create_notification` method
            notification = Notification.create_notification(
                    sender=sender,
                    recipient=receiver,
                    notification_type='friend_request',
                    message=f'{sender.username} sent you a friend request.',
                )
            # Send the notification via WebSocket
            notification_data  = self.serialiser_class(notification).data
            send_notification(receiver.id, notification_data)
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
    serialiser_class = NotificationSerializer
    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            if Connection.objects.filter(Q(sender=sender, receiver=receiver, status="pending") | Q(sender=receiver, receiver=sender, status="pending")).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                connection.accept(sender)
            elif Connection.objects.filter(Q(sender=sender, receiver=receiver, status="rejected") | Q(sender=receiver, receiver=sender, status="rejected")).exists():
                return Response(
                    {
                        "error": "Invalid request",
                        "message": "Friend request already declined."
                    },
                    status=status.HTTP_400_BAD_REQUEST)
            elif Connection.objects.filter(Q(sender=sender, receiver=receiver, status="accepted") | Q(sender=receiver, receiver=sender, status="accepted")).exists():
                return Response(
                    {
                        "error": "Invalid request",
                        "message": "You are already friends."
                    },
                    status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(
                    {
                        "error": "Invalid request",
                        "message": "No friend request found."
                    },
                    status=status.HTTP_404_NOT_FOUND)
            notification = Notification.create_notification(
                sender=receiver,
                recipient=sender,
                notification_type='friend_accept',
                message=f'{receiver.username} accepted your friend request.',
            )
            notification_data  = self.serialiser_class(notification).data
            notification_data['sender'] = ProfileSerializer(receiver).data
            send_notification(sender.id, notification_data)
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

class AcceptInviteRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serialiser_class = NotificationSerializer
    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                connection.accept(sender)
            
            notification = Notification.create_notification(
                sender=receiver,
                recipient=sender,
                notification_type='invite_accept',
                message=f'{receiver.username} accepted your game invite.'
            )
            notification_data  = self.serialiser_class(notification).data
            notification_data['sender'] = ProfileSerializer(receiver).data
            send_notification(sender.id, notification_data)
            return Response(
                {
                    "message": "Game invite accepted successfully."
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
                    "message": "No game invite found."
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

class DeclineInviteRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serialiser_class = NotificationSerializer

    def get(self, request, username):
        try:
            sender = User.objects.get(username=username)
            receiver = request.user
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                connection.decline()
            notification = Notification.create_notification(
                sender=receiver,
                recipient=sender,
                notification_type='game_decline',
                message=f'{receiver.username} declined your game invite.'
            )
            notification_data  = self.serialiser_class(notification).data
            notification_data['sender'] = ProfileSerializer(receiver).data
            send_notification(sender.id, notification_data)
            return Response(
                {
                    "message": "Game invite declined successfully."
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
                    "message": "No game invite found."
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
            if Connection.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)).exists():
                connection = Connection.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                if connection.status == "rejected":
                    return Response(
                        {
                            "error": "Invalid request",
                            "message": "Friend request already declined."
                        },
                        status=status.HTTP_400_BAD_REQUEST)
                if connection.status == "blocked":
                    return Response(
                        {
                            "error": "Invalid request",
                            "message": "Friend already blocked or request declined."
                        },
                        status=status.HTTP_400_BAD_REQUEST)
                if connection.status == "accepted":
                    return Response(
                    {
                        "message": "You are already friends."
                    },
                    status=status.HTTP_400_BAD_REQUEST)
                connection.decline()  
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
        notifications = Notification.objects.filter(recipient=user).select_related('sender').order_by('-created_at')
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
        user = self.request.user
        # Get all users blocked by the current user
        
        # Get all users who have blocked the current user
        blocked_by_users = Connection.objects.filter(
            receiver=user, status='blocked'
        ).values_list('sender', flat=True)
        
        # Combine both sets of blocked users
        all_blocked_users = set(blocked_by_users)
        
        # Exclude blocked users from the queryset
        queryset = User.objects.exclude(id__in=all_blocked_users)
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
    

class DeleteNotificationView(APIView):
    permissions_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        notification = get_object_or_404(Notification, id=pk)
        notification.delete()
        return Response(
            {
                "message": "Notification deleted successfully."
            },
            status=status.HTTP_200_OK
        )
        


class UpdateUserView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UpdateUsernameSerializer
    
    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
        
        


# views.py
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.conf import settings
from PIL import Image as PilImage
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import requests

class ImageUploadView(UpdateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('avatar')
        user = self.get_object() 

        if not uploaded_file:
            return Response({'error': 'No file uploaded'}, status=400)
        print(f"Uploaded file: {uploaded_file.name}, Size: {uploaded_file.size} bytes")
        try:
            resized_file = self.resize_image(uploaded_file, 128, 128)
            print("Image resized successfully")
            image_url = self.upload_to_imgbb(resized_file)
            user.avatar = image_url
            user.save()
            return Response({'message': 'Upload happened successfully'}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'error': str(e)}, status=500)

    def resize_image(self, file, width, height):
        """Resize the uploaded image to the specified dimensions."""
        try:
            img = PilImage.open(file)

            if img.mode in ('RGBA', 'LA'):
                background = PilImage.new('RGB', img.size, (255, 255, 255))  # White background
                background.paste(img, mask=img.split()[-1])  # Paste the image with transparency
                img = background
            img.thumbnail((width, height), PilImage.Resampling.LANCZOS)  # Use LANCZOS instead of ANTIALIAS
            output = BytesIO()
            img.save(output, format='JPEG', quality=90)
            output.seek(0)
            resized_file = InMemoryUploadedFile(
                output,
                'ImageField',
                file.name,
                'image/jpeg',
                output.getbuffer().nbytes,
                None
            )

            return resized_file

        except Exception as e:
            print(f"Error resizing image: {e}")
            raise

    def upload_to_imgbb(self, file):
        """Upload the file to ImgBB and return the image URL."""
        try:
            file_data = file.read()
            import base64
            encoded_file = base64.b64encode(file_data).decode('utf-8')
            response = requests.post(
                'https://api.imgbb.com/1/upload',
                data={
                    'key': settings.IMGBB_API_KEY,
                    'image': encoded_file,
                }
            )
            response.raise_for_status() 
            imgbb_data = response.json()
            return imgbb_data['data']['url']

        except Exception as e:
            print(f"Error uploading to ImgBB: {e}")
            raise


