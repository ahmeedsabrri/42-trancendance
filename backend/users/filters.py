import django_filters as filters
from django.contrib.auth import get_user_model

User = get_user_model()

"""

This file contains the filters for the users app.

"""


class UserFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    first_name = filters.CharFilter(lookup_expr='icontains')
    last_name = filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']

