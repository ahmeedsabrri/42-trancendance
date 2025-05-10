from django.db import models
from django.conf import settings
from users.models import User

User = settings.AUTH_USER_MODEL
class MatchHistory(models.Model):
    MATCH_STATUS_CHOICES = [
        ('waiting', 'Waiting for Player'),
        ('in_progress', 'In Progress'), 
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned')
    ]

    GAME_TYPE_CHOICES = [
        ('pingpong', 'Ping Pong'),
        ('tictactoe', 'Tic Tac Toe')
    ]

    winner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='match_history_wins'
    )
    loser = models.ForeignKey(
        User,
        on_delete=models.CASCADE, 
        related_name='match_history_losses'
    )
    score = models.CharField(max_length=20)
    played_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=MATCH_STATUS_CHOICES,
        default='waiting'
    )
    game_type = models.CharField(
        max_length=20,
        choices=GAME_TYPE_CHOICES
    )

    def __str__(self):
        return f"Match: {self.winner.username} vs {self.loser.username}"

class PlayerStats(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='stats'
    )
    total_matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    win_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    game_type = models.CharField(
        max_length=20,
        choices=MatchHistory.GAME_TYPE_CHOICES
    )

    def __str__(self):
        return f"Stats for {self.user.username}"

# matches for the specific USER, HIS SCORE, 