from django.urls import path
from . import views

urlpatterns = [    
    
    path('user/<str:username>/', views.ProfileView.as_view(), name='profile-detail'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/me/', views.UserView.as_view(), name='user_info'),
    path('users/me/change-password/',views.PasswordUpdateView.as_view(),name='password_update'),
    path('users/me/friends/', views.ListFrinedsView.as_view(), name='friend_list'),
    path('users/friends/<str:username>', views.FriendsListView.as_view(), name='friend_user_list'),
    path('users/request/send/<str:username>/', views.SendRequestView.as_view(), name='send_friend_request'),
    path('users/request/accept/<str:username>/', views.AcceptRequestView.as_view(), name='accept_friend_request'),
    path('users/request/cancel/<str:username>/', views.CancelRequestView.as_view(), name='cancel_friend_request'),
    path('users/request/acceptInvite/<str:username>/', views.AcceptInviteRequestView.as_view(), name='accept_friend_request'),
    path('users/request/declineInvite/<str:username>/', views.DeclineInviteRequestView.as_view(), name='accept_friend_request'),
    path('users/request/decline/<str:username>/', views.DeclineRequestView.as_view(), name='decline_friend_request'),
    path('users/request/block/<str:username>/', views.BlockRequestView.as_view(), name='block_friend_request'),
    path('users/request/unfriend/<str:username>/', views.UnFriendView.as_view(), name='unblock_friend_request'),
    path('users/request/unblock/<str:username>/', views.UnBlockUserView.as_view(), name='unblock_friend_request'),
    path('users/request/invite/<str:username>/', views.SendGameInviteView.as_view(), name='invite_user'),
    path('users/me/notif/', views.ListUserNotificationView.as_view(), name='list_user_notification'),
    path('users/notifications/<int:pk>/', views.MarkNotificationView.as_view(), name='notification_detail'),
    path('users/notifications/delete/<int:pk>/', views.DeleteNotificationView.as_view(), name='notification_delete'),
    path('users/search/', views.UserSearchView.as_view(), name='user-search'),
    path('users/me/update/username/', views.UpdateUserView.as_view(), name='update_username'),
    path('users/me/upload-avatar/', views.ImageUploadView.as_view(), name='upload-avatar'),
]