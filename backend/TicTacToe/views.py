from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import MatchHistorySerializer
from game.models import MatchHistory

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPlayerMatches(request):
    try:
        wins = request.user.match_history_wins.all()
        losses = request.user.match_history_losses.all()
        matches = wins.union(losses)
        ordered_matches = matches.order_by('played_at')
        ordered_matches_serialized = MatchHistorySerializer(ordered_matches, many=True, context={'request': request})

        return Response({'matches': ordered_matches_serialized.data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"Error raised while serializing data in getPlayerMatches: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )