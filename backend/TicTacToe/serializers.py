from rest_framework import serializers
from game.models import MatchHistory

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = '__all__'
    