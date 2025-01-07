import math

class GameEngine:
    def __init__(self) -> None:
        
        self.GAME_INFO = {
            "CANVAS": {"WIDTH": 1000, "HEIGHT": 600},
            "PLAYER_HEIGHT": 100,
            "PLAYER_WIDTH": 10,
            "PLAYER_SPEED": 5,
            "FRAME_RATE": 1 / 60,
        }

        self.PLAYERS = {
            "PLAYER1": {
                "NAME": "player1",
                "X": 0,
                "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                "W": self.GAME_INFO["PLAYER_WIDTH"],
                "H": self.GAME_INFO["PLAYER_HEIGHT"],
                "SCORE": 0,
            },
            "PLAYER2": {
                "NAME": "player2",
                "X": self.GAME_INFO["CANVAS"]["WIDTH"] - self.GAME_INFO["PLAYER_WIDTH"],
                "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                "W": self.GAME_INFO["PLAYER_WIDTH"],
                "H": self.GAME_INFO["PLAYER_HEIGHT"],
                "SCORE": 0,
            },
        }

        self.BALL = {
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "RADIUS": 10,
            "VELOCITY_X": 5,
            "VELOCITY_Y": 5,
            "SPEED": 10,
            "MAX_SPEED": 25,
            "SPEED_INCREMENT": 0.4,
        }

        self.running = False
        self.winner = ""
        self.key_states = { "ArrowUp": False, "ArrowDown": False, "w": False, "s": False }
    
    def __str__(self) -> str:
        return f'init game engine'

    def update_paddles(self):
        if self.key_states["w"] and self.PLAYERS["PLAYER1"]["Y"] > 0:
            self.PLAYERS["PLAYER1"]["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
        if self.key_states["s"] and self.PLAYERS["PLAYER1"]["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            self.PLAYERS["PLAYER1"]["Y"] += self.GAME_INFO["PLAYER_SPEED"]
        if self.key_states["ArrowUp"] and self.PLAYERS["PLAYER2"]["Y"] > 0:
            self.PLAYERS["PLAYER2"]["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
        if self.key_states["ArrowDown"] and self.PLAYERS["PLAYER2"]["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            self.PLAYERS["PLAYER2"]["Y"] += self.GAME_INFO["PLAYER_SPEED"]

    def update_ball(self):
        self.BALL["X"] += self.BALL["VELOCITY_X"]
        self.BALL["Y"] += self.BALL["VELOCITY_Y"]

        if self.BALL["Y"] - self.BALL["RADIUS"] <= 0 or self.BALL["Y"] + self.BALL["RADIUS"] >= self.GAME_INFO["CANVAS"]["HEIGHT"]:
            self.BALL["VELOCITY_Y"] *= -1

        for player_key in ["PLAYER1", "PLAYER2"]:
            collision_details = self.get_collision_details(self.BALL, self.PLAYERS[player_key])
            if collision_details["will_collide"]:
                self.handle_ball_paddle_collision(player_key, collision_details)

        if self.BALL["X"] - self.BALL["RADIUS"] < 0:
            self.PLAYERS["PLAYER2"]["SCORE"] =  self.PLAYERS["PLAYER2"]["SCORE"] + 1
            self.reset_ball()
        elif self.BALL["X"] + self.BALL["RADIUS"] > self.GAME_INFO["CANVAS"]["WIDTH"]:
            self.PLAYERS["PLAYER1"]["SCORE"] = self.PLAYERS["PLAYER1"]["SCORE"] + 1
            self.reset_ball()

        if (self.PLAYERS["PLAYER1"]["SCORE"] == 3):
            self.winner = "PLAYER1"
        elif (self.PLAYERS["PLAYER2"]["SCORE"] == 3):
            self.winner = "PLAYER2"
    
    def handle_ball_paddle_collision(self, player_key, collision_details):
        player = self.PLAYERS[player_key]
        self.BALL["X"] = (
            player["X"] + player["W"] + self.BALL["RADIUS"]
            if player_key == "PLAYER1"
            else player["X"] - self.BALL["RADIUS"]
        )
        angle_rad = collision_details["collision_point"] * (math.pi / 4)
        direction = 1 if player_key == "PLAYER1" else -1

        self.BALL["VELOCITY_X"] = direction * self.BALL["SPEED"] * math.cos(angle_rad)
        self.BALL["VELOCITY_Y"] = self.BALL["SPEED"] * math.sin(angle_rad)
        self.BALL["SPEED"] = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])

    def reset_ball(self):
        self.BALL.update({
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "VELOCITY_X": 5 if self.BALL["VELOCITY_X"] < 0 else -5,
            "VELOCITY_Y": 5 if self.BALL["VELOCITY_Y"] < 0 else -5,
            "SPEED": 5,
        })
    def get_collision_details(self, ball, player):
        ball_center = ball["Y"]
        player_center = player["Y"] + player["H"] / 2

        will_collide = (
            player["X"] <= ball["X"] <= player["X"] + player["W"]
            and player["Y"] <= ball_center <= player["Y"] + player["H"]
        )
        collision_point = (ball_center - player_center) / (player["H"] / 2)
        return { "will_collide": will_collide, "collision_point": collision_point }
    def reset_game(self):
        self.PLAYERS["PLAYER1"]["Y"] = self.PLAYERS["PLAYER2"]["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
        self.PLAYERS["PLAYER1"]["SCORE"] = self.PLAYERS["PLAYER2"]["SCORE"] = 0
        self.winner = ""
        self.reset_ball()
    
    