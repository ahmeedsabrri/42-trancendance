from rest_framework import serializers
from .models import User, Match, MatchHistory, PlayerStats, GameSession


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}  # Hide password when serializing


class MatchSerializer(serializers.ModelSerializer):
    player1 = UserSerializer(read_only=True)
    player2 = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = [
            'id', 'player1', 'player2', 'start_time', 'end_time', 'status', 
            'winner', 'score_player1', 'score_player2'
        ]


class MatchHistorySerializer(serializers.ModelSerializer):
    match = MatchSerializer(read_only=True)
    winner = UserSerializer(read_only=True)
    loser = UserSerializer(read_only=True)

    class Meta:
        model = MatchHistory
        fields = ['id', 'match', 'winner', 'loser', 'score', 'played_at']


class PlayerStatsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PlayerStats
        fields = ['id', 'user', 'total_matches', 'wins', 'losses', 'win_rate']


class GameSessionSerializer(serializers.ModelSerializer):
    match = MatchSerializer(read_only=True)

    class Meta:
        model = GameSession
        fields = ['id', 'match', 'player1_connection_info', 'player2_connection_info', 'connection_status']
