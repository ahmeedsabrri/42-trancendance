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
    path('auth/verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
]