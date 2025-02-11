from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import SlidingToken
from users.models import User
from rest_framework import authentication, exceptions
from channels.auth import AuthMiddlewareStack
from django.contrib.auth.models import AnonymousUser
from django.http import parse_cookie

class JWTCookieMiddleware:
    
    def __init__(self, get_response) -> None:
        self.get_response = get_response

    def __call__(self, request):
        # process request
        invalid_token = False
        jwt_token = request.COOKIES.get("jwt_token", None)
        if jwt_token is not None:
            try:
                user = self.get_user(request.COOKIES.get("jwt_token"),request=request)
            except Exception:
                request.user = None
                invalid_token = True 
        response = self.get_response(request)
        if invalid_token:
            response.delete_cookie("jwt_token")
        return response

    def get_user(self,token,request):
        t = SlidingToken(token)
        user_id = t["user_id"]
        user = User.objects.get(id=user_id)
        setattr(request, "_auth", [user, token])
        request.user = user
        return user





class WebSocketJWTAuthMiddleware:
    def __init__(self, app):
        self.app = app
    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousUser()
        for k, v in scope.get("headers", []):
            if k == b"cookie":
                cookies = parse_cookie(v.decode())
                scope["user"] = await self.get_user(cookies.get("jwt_token"))
        return await self.app(scope, receive, send)
    @database_sync_to_async
    def get_user(self, token):
        try:
            t = SlidingToken(token)
            user_id = t["user_id"]
            return User.objects.get(id=user_id)
        except:
            return AnonymousUser()


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        if hasattr(request, "_auth"):
            return request._auth
        return (None, None)
