from django.contrib import admin

# Register your models here.
from .models import User, Connection, Notification

admin.site.register(User)
admin.site.register(Connection)
admin.site.register(Notification)

