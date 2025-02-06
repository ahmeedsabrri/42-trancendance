import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from .models import MatchHistory, PlayerStats
from game.gameEngine import LocalGameEngine, OnlineGameEngine

class LocalGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            await self.accept()

            # self.invite = self.scope["url"]["kwargs"][""]

            print("SERVER CONNECTED SUCCESSFULLY...")
            self.user = self.scope["user"]

            self.game_engine = LocalGameEngine()

            initial_state = {"PLAYERS": self.game_engine.PLAYERS, "BALL": self.game_engine.BALL}
            await self.send(text_data=json.dumps({"game": initial_state}))

            self.task = asyncio.create_task(self.game_loop())

        except Exception as e:
            print("Error connecting to server: <error> ", e)

    async def disconnect(self, close_code):
        try:
            if hasattr(self, 'task') and not self.task.done():
                self.task.cancel()
                try:
                    await self.task
                except asyncio.CancelledError:
                    print("Task cancelled successfully.")
        except Exception as e:
            print("Error disconnecting from server:", e)

    async def receive(self, text_data):

        self.action = json.loads(text_data).get("Action")
        try:
            if self.action == "MovePaddles":
                key_event = json.loads(text_data)
                key = key_event["key"]
                is_pressed = key_event["isPressed"]

                if key in self.game_engine.key_states:
                    self.game_engine.key_states[key] = is_pressed

            if self.action == "RESET":
                await self.send(text_data=json.dumps(
                    {
                        "game": 
                        {
                            "PLAYERS": self.game_engine.PLAYERS,
                            "BALL": self.game_engine.BALL,
                        }
                    }))

            if self.action == "PLAY":
                    self.game_engine.running = True
            elif self.action == "PAUSE":
                self.game_engine.running = False
        except Exception as e:
            print("Error processing input:", e)

    async def game_loop(self):
        try:
            while True:
                if not self.game_engine.running:
                    await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
                    continue

                self.game_engine.update_paddles()

                self.game_engine.update_ball()

                await self.send_game_state()

                await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
        except asyncio.CancelledError:
            print("Background task was cancelled.")
            raise
    
    async def send_game_state(self):
            await self.send(text_data=json.dumps({
                "game": {
                    "PLAYERS": self.game_engine.PLAYERS,
                    "BALL": self.game_engine.BALL,
                    "WINNER": self.game_engine.winner
                }}))


class OnlineGameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        try:
            await self.accept()
            self.user = self.scope["user"]
            self.invite_id = self.scope["url_route"]["kwargs"].get("invite_id", None)

            # if (self.invite_id):
                # self.invite_id = int(self.invite_id)
            print(self.invite_id)

            self.game_engine = OnlineGameEngine()

            self.group_id = self.game_engine.join_group_or_add_one(self.user, self.channel_name, self.invite_id)

            self.room_group_name = f'online_game_{self.group_id}'

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.send_initial_game_state()

            print("SERVER CONNECTED SUCCESSFULLY...")

            if (OnlineGameEngine.groups[self.group_id]["game_leader"] == self.channel_name):
                self.task = asyncio.create_task(self.game_loop())
        except Exception as e:
            print("Error connecting to server: <error> ", e)

    async def disconnect(self, close_code):
        try:
            group = OnlineGameEngine.groups[self.group_id]

            if (group["status"] == "waiting"):
                group["status"] = "Finished"

            elif (group["status"] == "ready"):
                if (group["game_leader"] == self.channel_name):
                    loser_score = group["PLAYERS"]["PLAYER1"]["SCORE"]
                    winner_score = group["PLAYERS"]["PLAYER2"]["SCORE"]

                    await save_match_history(group["user2"], self.user, winner_score, loser_score, "PingPong", "Abandoned")
                    
                    self.winner =  group["PLAYERS"]["PLAYER2"]
                    self.client_name = group["PLAYERS"]["PLAYER2"]["channel_name"]
                else:
                    loser_score = group["PLAYERS"]["PLAYER2"]["SCORE"]
                    winner_score = group["PLAYERS"]["PLAYER1"]["SCORE"]

                    await save_match_history(self.user, group["user2"], winner_score, loser_score, "PingPong", "Abandoned")
                    self.winner =  group["PLAYERS"]["PLAYER1"]
                    self.client_name = group["PLAYERS"]["PLAYER1"]["channel_name"]

                await self.channel_layer.send(self.client_name,
                    {
                        "type": "send.message",
                            "game": {
                                "WINNER": self.winner,
                            }
                    }
                )
                group["status"] = "Abandoned"

            elif (group["game_leader"] == self.channel_name and group["status"] == "Completed"):
                group = OnlineGameEngine.groups[self.group_id]

                await save_match_history(group["game_winner"], group["game_loser"], self.game_engine.winnerScore, self.game_engine.loserScore, "PingPong", "Finished")

                group["status"] = "Finished"

            elif (group["status"] == "Abandoned"):
                print("then here")
                group["status"] = "Finished"
    
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            print(f"user disconnected: {self.user.username}")

        except Exception as e:
            print("Error disconnecting from server: <error> ", e)

    async def receive(self, text_data):
        self.action = json.loads(text_data).get("Action")
        try:
            if self.action == "MovePaddles":
                key_event = json.loads(text_data)
                key = key_event["key"]
                is_pressed = key_event["isPressed"]

                OnlineGameEngine.groups[self.group_id]["channel_name"] = self.channel_name
        
                if key in OnlineGameEngine.groups[self.group_id]["key_states"]:
                    OnlineGameEngine.groups[self.group_id]["key_states"][key] = is_pressed

            if self.action == "StartGame" and OnlineGameEngine.groups[self.group_id]["game_leader"] == self.channel_name:
                OnlineGameEngine.groups[self.group_id]["running"] = True

            # if self.action == "PLAY":
            #     self.game_engine.running = True
            # elif self.action == "PAUSE":
            #     self.game_engine.running = False
        except Exception as e:
            print("Error processing input:", e)

    async def game_loop(self):
        while True:
            if OnlineGameEngine.groups[self.group_id]["status"] == "Finished":
                print("Game finished, stopping the game loop.")
                del OnlineGameEngine.groups[self.group_id]
                OnlineGameEngine.next_group_id -= 1
                print(OnlineGameEngine.groups)
                break 
            if not OnlineGameEngine.groups[self.group_id]["running"]:
                await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
                continue
            self.game_engine.update_paddles(self.group_id)

            self.game_engine.update_ball(self.group_id)

            await self.send_game_state(self.group_id)

            await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
    
    async def send_initial_game_state(self):
        print("send initial game state")
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send.initialMessage",
            }
        )

    async def send_game_state(self, group_id):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send.message",
                "game": {
                    "PLAYERS": OnlineGameEngine.groups[group_id]["PLAYERS"],
                    "BALL": self.game_engine.BALL,
                    "WINNER": self.game_engine.winner,
                }
            }
        )

    async def send_message(self, event):
        game = event["game"]
        await self.send(text_data=json.dumps({"game": game}))

    async def send_initialMessage(self, event):
        await self.send(text_data=json.dumps(
            {
                "gameStatus": OnlineGameEngine.groups[self.group_id]["status"],
                "PLAYERS": OnlineGameEngine.groups[self.group_id]["PLAYERS"],
            }
        ))
    async def close_task(self):
        if (OnlineGameEngine.groups[self.group_id]["game_leader"] == self.channel_name):
            if hasattr(self, 'task') and not self.task.done():
                self.task.cancel()
                try:
                    await self.task
                except asyncio.CancelledError:
                    print("Task cancelled successfully.")
                print("game abondoned")

@database_sync_to_async
def save_match_history(winner, loser, winner_score, loser_score, game_type, status='completed'):
    match_history = MatchHistory.objects.create(
        winner=winner,
        loser=loser,
        score=f"{winner_score}-{loser_score}",
        game_type=game_type,
        status=status
    )

    winner_stats, created = PlayerStats.objects.get_or_create(
        user=winner, 
        game_type=game_type,
        defaults={
            'total_matches': 1,
            'wins': 1,
            'win_rate': 100.00
        }
    )

    if not created:
        winner_stats.total_matches += 1
        winner_stats.wins += 1
        winner_stats.win_rate = (winner_stats.wins / winner_stats.total_matches) * 100
        winner_stats.save()

    loser_stats, created = PlayerStats.objects.get_or_create(
        user=loser, 
        game_type=game_type,
        defaults={
            'total_matches': 1,
            'losses': 1,
            'win_rate': 0.00
        }
    )

    if not created:
        loser_stats.total_matches += 1
        loser_stats.losses += 1
        loser_stats.win_rate = (loser_stats.wins / loser_stats.total_matches) * 100
        loser_stats.save()