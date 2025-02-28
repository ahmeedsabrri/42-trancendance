from os import execlp
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from users.models import User
from game.models import MatchHistory, PlayerStats
from channels.db import database_sync_to_async
import logging

logger = logging.getLogger(__name__)

#THE RESPONSIBLE CONSUMER FOR REMOTE GAMES
#---------------------------------------------------------------------------------------#
class RemoteTicTacToeConsumer(AsyncJsonWebsocketConsumer):
    #static variable
    games = 0
    waiting_users = []
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game = None
        self.opponent = None
        self.board = [None] * 9
        self.mark = None
        self.score = 0
        self.game_state = None
        self.is_winner = False
        self.is_game_owner = False
        self.is_turn = False

    #FUNCTION TO CREATE THE GAME
    @database_sync_to_async
    def create_game(self, winner, loser, game_state):
        try:
            MatchHistory.objects.create(
                winner=winner,
                loser=loser,
                status=game_state,
                score=f'{self.score}-{self.opponent.score}',
                game_type='tictactoe')
        except Exception as e:
            logger.error(f"Error raised while creating the game : {e}")
    
    @database_sync_to_async
    def create_player_stat(self):
        try:
            user = User.objects.get(id=self.scope['user'].id)
            Stats, created = PlayerStats.objects.get_or_create(
                user=self.scope['user'],
                game_type='Tic Tac Toe'
            )
            Stats.total_matches+=1
            if self.is_winner:
                Stats.wins += 1
                user.xp += 20
            else:
                Stats.losses += 1
                user.xp += 10
            if user.xp >= 100:
                reminder = user.xp % 100
                user.xp = reminder
                user.level += 1

            Stats.win_rate = (Stats.wins / Stats.total_matches) * 100
            Stats.save()
            user.save()
        except Exception as e:
            logger.error(f"Error raised while creating player stats: {e}")
    #FUCNCTION TO CHECK GAME STATE
    def check_winner(self):
        try:
            winning_combinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ]
            for combo in winning_combinations:
                a, b, c = combo
                if self.board[a] and self.board[a] == self.board[b] == self.board[c]:
                    return self.board[a]
            if None not in self.board:
                return 'draw'
            return None
        except Exception as e:
            logger.error(f"Error raised while checking for winner : {e}")

    #FUNCTION TO SEND A GROUP MESSAGE
    async def send_message_group(self, event):
        try:
            await self.send_json(event['message'])
        except Exception as e:
            logger.error(f"Error raised while sending group message : {e}")

#--------------------------------------------------------------------------------------------#
    #SOCKET MAIN FUNCTIONS (CONNECT, RECEIVE, DISCONNECT)
    async def connect(self):
        try:
            await self.accept()
            RemoteTicTacToeConsumer.waiting_users.append(self)
            if len(RemoteTicTacToeConsumer.waiting_users) >= 2:
                player1 = RemoteTicTacToeConsumer.waiting_users[0]
                player2 = None
                for user in RemoteTicTacToeConsumer.waiting_users:
                    if user.scope['user'].id != player1.scope['user'].id:
                        player2 = user
                        break
                if player2 is None:
                    return
                else:
                    RemoteTicTacToeConsumer.waiting_users.remove(player1)
                    RemoteTicTacToeConsumer.waiting_users.remove(player2)

                    player1.opponent = player2
                    player1.mark = 'X'
                    player1.game_state = 'started'
                    player1.is_game_owner = True
                    player1.is_turn = True

                    player2.opponent = player1
                    player2.mark = 'O'
                    player2.game_state = 'started'
                    

                    await player1.send_json({'action' : 'identify_players',
                                            'username' : player1.scope['user'].username,
                                            'opponent_username' : player2.scope['user'].username,
                                            'user_avatar' : player1.scope['user'].avatar,
                                            'opponent_avatar' : player2.scope['user'].avatar,
                                            'mark' : player1.mark})
                    # return
                    await player2.send_json({'action' : 'identify_players',
                                            'username' : player2.scope['user'].username,
                                            'opponent_username' : player1.scope['user'].username,
                                            'user_avatar' : player2.scope['user'].avatar,
                                            'opponent_avatar' : player1.scope['user'].avatar,
                                            'mark' : player2.mark})
                    RemoteTicTacToeConsumer.games += 1
                    game_group = f"game_{RemoteTicTacToeConsumer.games}"
                    player1.game_group = game_group
                    player2.game_group = game_group

                    await self.channel_layer.group_add(self.game_group, player1.channel_name)
                    await self.channel_layer.group_add(self.game_group, player2.channel_name)

                    await player1.send_json({
                        'action' : 'game_started',
                        'turn': player1.is_turn
                    })

                    await player2.send_json({
                        'action' : 'game_started',
                        'turn': player2.is_turn
                    })
        except Exception as e:
            logger.error(f"Error raised while connecting to the consumer : {e}")



    def checkInfosBeforeSending(self, data):
        if 'position' not in data:
            raise Exception("Missing required field: 'position'")
        if data['position'] < 0 or data['position'] > 9:
            raise Exception(f"The position givn out of bound: 'position = {data['position']}'")


    async def receive(self, text_data):
        try:
            if not self.is_turn:
                return
            move_data = json.loads(text_data)
            #check data here, if its not valid an exception is thrown
            self.checkInfosBeforeSending(move_data)
            # await self.opponent.send_json(move_data)
            position = move_data['position']
            if self.board[position]:
                return
            self.board[position] = self.mark
            self.opponent.board[position] = self.mark
            self.is_turn = False
            self.opponent.is_turn = True
            message  = {
                'action': 'board_update',
                'board': self.board,
                'sender': self.scope['user'].username,
                'my_turn': self.is_turn,
                'opponent_turn': self.opponent.is_turn
            }
            await self.channel_layer.group_send(
                    self.game_group,
                    {
                        'type' : 'send_message_group',
                        'message' : message
                    }
            )
            result = self.check_winner()
            if result == 'X' or result == 'O':
                self.board = [None] * 9
                self.opponent.board = [None] * 9
                self.score += 1
                message = {'action' : 'score_update',
                        'sender' : self.scope['user'].username,
                        'score' : self.score,
                        'opponent_score' : self.opponent.score}
                await self.channel_layer.group_send(
                    self.game_group,
                    {
                        'type' : 'send_message_group',
                        'message' : message
                    }
                )

                if self.score == 4:
                    self.game_state = 'completed'
                    self.opponent.game_state = 'completed'
                    self.is_winner = True
                    message = {
                        'action' : 'player_won',
                        'reason' : 'GAME FINISHED',
                        'sender' : self.scope['user'].username,
                        'avatar' : self.scope['user'].avatar
                    }

                    await self.channel_layer.group_send(
                        self.game_group,
                        {
                            'type' : 'send_message_group',
                            'message' : message
                        }
                    )
            elif result == 'draw':
                self.board = [None] * 9
                self.opponent.board = [None] * 9
                message = {
                    'action' : 'draw',
                }
                await self.channel_layer.group_send(
                    self.game_group,
                    {
                        'type' : 'send_message_group',
                        'message' : message
                    }
                )
        except Exception as e:
            logger.error(f"Error raised while receiving a message : {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            if self in RemoteTicTacToeConsumer.waiting_users:
                RemoteTicTacToeConsumer.waiting_users.remove(self)
            else:
                if self.game_state == 'started':
                    self.game_state = 'abondoned'
                    self.opponent.game_state = 'abondoned'
                    self.opponent.is_winner = True
                    self.opponent.score = 4
                    message = {
                        'action' : 'player_won',
                        'reason'  : 'OPPONENT DISCONNECTED',
                        'sender' : self.opponent.scope['user'].username,
                        'avatar' : self.opponent.scope['user'].avatar,
                    }
                    await self.opponent.send_json(message)
                    self.is_game_owner and await self.create_game(self.opponent.scope['user'], self.scope['user'], self.game_state)
                else:
                    if self.is_winner:
                        self.is_game_owner and await self.create_game(self.scope['user'], self.opponent.scope['user'], self.game_state)
                    else:
                        self.is_game_owner and await self.create_game(self.opponent.scope['user'], self.scope['user'], self.game_state)
                if self.is_game_owner:
                    RemoteTicTacToeConsumer.games -= 1
                await self.create_player_stat()
                await self.channel_layer.group_discard(self.game_group, self.channel_name)
        except Exception as e:
            logger.error(f"Error raised while disconnecting : {e}")
#---------------------------------------------------------------------------------------------#


#THE RESPONSIBLE CONSUMER FOR LOCAL GAMES
class LocalTicTacToeConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize game state
        self.board = [None] * 9
        self.left_score = 0
        self.right_score = 0
        self.mark = 'X'
        self.mark_is_x = True

    def check_winner(self):
        try:
            winning_combinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ]
            for combo in winning_combinations:
                a, b, c = combo
                if self.board[a] and self.board[a] == self.board[b] == self.board[c]:
                    return self.board[a]
            if None not in self.board:
                return 'draw'
            return None
        except Exception as e:
            logger.error(f"Error raised while checking for winner in local game : {e}")
    

    ##SOCKET MAIN FUNCTIONS (CONNECT, RECEIVE, DISCONNECT)
    #CONNECT
    async def connect(self):
        try:
            await self.accept()
            await self.send_json({
                    'action' : 'game_started',
                })
        except Exception as e:
            logger.error(f"Error raised while connecting in local game : {e}")

    def checkInfosBeforeSending(self, data):
        if 'position' not in data:
            raise Exception("Missing required field: 'position'")
        if data['position'] < 0 or data['position'] > 9:
            raise Exception(f"The position givn out of bound: 'position = {data['position']}'")
  
    #RECEIVE
    async def receive(self, text_data):
        try:
            move_data = json.loads(text_data)
            self.checkInfosBeforeSending(move_data)
            position = move_data['position']
            if not self.board[position]:
                if self.mark_is_x:
                    self.board[position] = 'X'
                else:
                    self.board[position] = 'O'
            self.mark_is_x = not self.mark_is_x
            message  = {
                'action': 'board_update',
                'board': self.board,
            }
            await self.send_json(message)

            result = self.check_winner()
            if result == 'X' or result == 'O':
                if result == 'X':
                    self.left_score += 1
                else:
                    self.right_score += 1
                self.board = [None] * 9
                message = {'action' : 'score_update',
                        'left_score' : self.left_score,
                        'right_score' : self.right_score}
                await self.send_json(message)
                if self.left_score == 4:
                    message = {
                        'action' : 'player_won',
                        'winner' : 'left_player',
                    }
                    await self.send_json(message)
                elif self.right_score == 4:
                    message = {
                        'action' : 'player_won',
                        'winner' : 'right_player',
                    }
                    await self.send_json(message)
            elif result == 'draw':
                self.board = [None] * 9
                message = {
                    'action' : 'draw',
                }
                await self.send_json(message)
        except Exception as e:
            logger.error(f"Error raised while receiving in local consumer : {e}")


    #DISCONNECT
    async def disconnect(self, close_code):
        pass

#----------------------------------------------------------------------------------------#