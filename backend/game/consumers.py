import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from game.gameEngine import GameEngine

class LocalGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        print("SERVER CONNECTED SUCCESSFULLY...")
        
        self.game_engine = GameEngine()

        self.game_engine.reset_game()

        initial_state = {"PLAYERS": self.game_engine.PLAYERS, "BALL": self.game_engine.BALL}
        await self.send(text_data=json.dumps({"gameState": initial_state}))

        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        self.game_engine.running = False
        self.game_engine.reset_game()
        self.close()
        print(f"WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):

        self.action = json.loads(text_data).get("Action")
        try:
            if self.action == "MovePaddles":
                key_event = json.loads(text_data)
                key = key_event["key"]
                is_pressed = key_event["isPressed"]

                if key in self.game_engine.key_states:
                    self.game_engine.key_states[key] = is_pressed
            if self.action == "PLAY":
                    self.game_engine.running = True
            elif self.action == "PAUSE":
                self.game_engine.running = False
            # elif self.action == "RESET_GAME":
        except Exception as e:
            print("Error processing input:", e)

    async def game_loop(self):
        while True:
            if not self.game_engine.running:
                await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
                continue

            self.game_engine.update_paddles()

            self.game_engine.update_ball()

            await self.send_game_state()

            await asyncio.sleep(self.game_engine.GAME_INFO["FRAME_RATE"])
    
    async def send_game_state(self):
            await self.send(text_data=json.dumps({"gameState": {"PLAYERS": self.game_engine.PLAYERS, "BALL": self.game_engine.BALL, "WINNER": self.game_engine.winner}}))

class RemoteGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        print("SERVER CONNECTED SUCCESSFULLY...")
