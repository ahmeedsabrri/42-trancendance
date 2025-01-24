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
            print(self.user)

            self.game_engine = OnlineGameEngine()

            self.group_id = self.game_engine.join_group_or_add_one(self.user, self.channel_name)
            self.room_group_name = f'online_game_{self.group_id}'

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            if (OnlineGameEngine.groups[self.group_id]["status"] == "waiting"):
                await self.send(text_data=json.dumps({ "gameStatus": OnlineGameEngine.groups[self.group_id]["status"] }))

            if (OnlineGameEngine.groups[self.group_id]["status"] == "ready"):
                await self.send_initial_game_state(self.group_id)

            print("SERVER CONNECTED SUCCESSFULLY...")

            if (OnlineGameEngine.groups[self.group_id]["game_leader"] == self.channel_name):
                self.task = asyncio.create_task(self.game_loop())

        except Exception as e:
            print("Error connecting to server: <error> ", e)

    async def disconnect(self):
        try:
            if (OnlineGameEngine.groups[self.group_id]["game_leader"] == self.channel_name):
                if hasattr(self, 'task') and not self.task.done():
                    self.task.cancel()
                    try:
                        await self.task
                    except asyncio.CancelledError:
                        print("Task cancelled successfully.")
                
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            print(f"user disconnected: {self.channel_name}")

        except Exception as e:
            print("Error connecting to server: <error> ", e)

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

    # @database_sync_to_async
    # def find_match_or_create_it(self):
    #     wait_for_match = Match.objects.filter(
    #         status = 'waiting',
    #         player2=None
    #     ).first()
    #     if wait_for_match:
    #         wait_for_match.player2 = self.user
    #         wait_for_match.status = 'ready'
    #         wait_for_match.save()
    #         print("Match found")
    #         return wait_for_match
    #     match = Match.objects.create(
    #         player1=self.user,
    #         status = 'waiting'
    #     )
    #     return match