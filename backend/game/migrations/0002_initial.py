# Generated by Django 4.2.16 on 2025-02-04 00:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('game', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='playerstats',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchhistory',
            name='loser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='match_history_losses', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='matchhistory',
            name='winner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='match_history_wins', to=settings.AUTH_USER_MODEL),
        ),
    ]
