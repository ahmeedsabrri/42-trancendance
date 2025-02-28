from rest_framework import serializers
from game.models import MatchHistory

class MatchHistorySerializer(serializers.ModelSerializer):
    user_score = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    class Meta:
        model = MatchHistory
        fields = ['id', 'user_score', 'game_type', 'status', 'result', 'opponent', 'score', 'played_at']
        

    def get_user_score(self, obj):
        user = self.context['user']
        winner_score, loser_score = obj.score.split('-')

        if user == obj.winner:
            return winner_score
        return loser_score

    def get_result(self, obj):
        user = self.context['user']

        if user == obj.winner:
            return 'W'
        return 'L'

    def get_opponent(self, obj):
        user = self.context['user']

        if user == obj.winner:
            return obj.loser.username
        return obj.winner.username