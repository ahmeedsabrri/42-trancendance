# Generated by Django 4.2.16 on 2025-02-05 15:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='conversation_id',
        ),
    ]
