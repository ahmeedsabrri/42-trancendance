from rest_framework import serializers
from game.models import MatchHistory

class MatchHistorySerializer(serializers.ModelSerializer):
    user_score = serializers.SerializerMethodField()

    class Meta:
        model = MatchHistory
        fields = ['user_score', 'game_type', 'status']

    def get_user_score(self, obj):
        user = self.context['request'].user
        winner_score, loser_score = obj.score.split('-')

        if user == obj.winner:
            return winner_score
        elif user == obj.loser:
            return loser_score
    