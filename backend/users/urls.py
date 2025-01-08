from django.urls import path

from . import views

urlpatterns = [    
    
    path('users/me/', views.UserView.as_view(), name='user_info'),
    path('user/change-password/',views.PasswordUpdateView.as_view(),name='password_update'),
    path('user/<str:username>/', views.ProfileView.as_view(), name='profile-detail'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    # update/avatar/
]