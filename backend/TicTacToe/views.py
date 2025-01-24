from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import User
from rest_framework import serializers


# Create your views here.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']  # specify the fields you want to include in the response

@api_view(['GET'])
def create_user(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)  # serialize the queryset
    return JsonResponse(serializer.data, safe=False)
