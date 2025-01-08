from django.urls import path

from . import views


urlpatterns = [
    path('auth/test/', views.TestAuthView.as_view(), name='test_auth'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogOutView.as_view(), name='logout'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/42/callback/', views.OauthCallBackView.as_view(), name='oauth2_callback'),
    path('auth/2fa/enable/', views.Enable2FAView.as_view(), name='2fa_enable'),
    path('auth/2fa/disable/', views.Disable2FAView.as_view(), name='2fa_disable'),
    # path('auth/user/me/update/username', views.UpdateUsernameView.as_view(), name='user_update'),
    # logout/
    # register/
    # oauth/callback/
    # 2fa/enable/
    # 2fa/disable/
    

    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    # path('register/', AddUserView.as_view(), name='register'),
    # # path('callback/', views.42CallbackView.as_view(), name='oauth2_callback'),
    # # path('callback/', views.42CallbackView.as_view(), name='oauth2_callback'),
    # path('user/', views.user_info, name='user_info'),
    # path('logout/', views.LogoutView.as_view(), name='logout'),
]