from django.urls import path

from . import views

urlpatterns = [    
    
    path('users/me/', views.UserView.as_view(), name='user_info'),
    path('user/change-password/',views.PasswordUpdateView.as_view(),name='password_update'),
    path('user/<str:username>/', views.ProfileView.as_view(), name='profile-detail'),
    path('user/me/friends/', views.ListFrinedsView.as_view(), name='friend_list'),
    path('user/me/blocked/', views.ListBlockedUsersView.as_view(), name='blocked_user_list'),
    path('users/request/send/<str:username>/', views.SendRequestView.as_view(), name='send_friend_request'),
    path('users/request/accept/<str:username>/', views.AcceptRequestView.as_view(), name='accept_friend_request'),
    path('users/request/decline/<str:username>/', views.DeclineRequestView.as_view(), name='decline_friend_request'),
    path('users/request/block/<str:username>/', views.BlockRequestView.as_view(), name='block_friend_request'),
    path('users/user/notif/', views.ListUserNotificationView.as_view(), name='list_user_notification'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    # update/avatar/
]