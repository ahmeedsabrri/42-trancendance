import math

# for the local game
class LocalGameEngine:

    def __init__(self) -> None:

        self.GAME_INFO = {
            "CANVAS": {"WIDTH": 1000, "HEIGHT": 600},
            "PLAYER_HEIGHT": 100,
            "PLAYER_WIDTH": 10,
            "PLAYER_SPEED": 8,
            "FRAME_RATE": 1 / 60,
        }

        self.PLAYERS = {
            "PLAYER1": {
                "USERNAME": "player1",
                "FULL_NAME": "",
                "X": 0,
                "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                "W": self.GAME_INFO["PLAYER_WIDTH"],
                "H": self.GAME_INFO["PLAYER_HEIGHT"],
                "SCORE": 0,
            },
            "PLAYER2": {
                "USERNAME": "player2",
                "FULL_NAME": "",
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
            "SPEED": 8,
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
            self.PLAYERS["PLAYER1"]["Y"] = self.PLAYERS["PLAYER2"]["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
            self.reset_ball()
        elif self.BALL["X"] + self.BALL["RADIUS"] > self.GAME_INFO["CANVAS"]["WIDTH"]:
            self.PLAYERS["PLAYER1"]["SCORE"] = self.PLAYERS["PLAYER1"]["SCORE"] + 1
            self.PLAYERS["PLAYER1"]["Y"] = self.PLAYERS["PLAYER2"]["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
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

        vx = math.cos(angle_rad)
        vy = math.sin(angle_rad)

        magnitude = math.sqrt(vx * vx + vy * vy)

        self.BALL["VELOCITY_X"] = direction * self.BALL["SPEED"] * (vx / magnitude)
        self.BALL["VELOCITY_Y"] = self.BALL["SPEED"] * (vy / magnitude)

        self.BALL["SPEED"] = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])

    def reset_ball(self):
        self.BALL.update({
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "VELOCITY_X": 5 if self.BALL["VELOCITY_X"] < 0 else -5,
            "VELOCITY_Y": 5 if self.BALL["VELOCITY_Y"] < 0 else -5,
            "SPEED": 8,
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
    
    def set_user_info(self, player, scope):
        if player == self.PLAYERS["PLAYER1"]:
            player["NAME"] = scope["user"].username
            player["FULL_NAME"] = scope["user"].first_name + " " + scope["user"].last_name


# for the online game
class OnlineGameEngine:

    groups = {}
    next_group_id = 1

    def __init__(self) -> None:

        self.GAME_INFO = {
            "CANVAS": {"WIDTH": 1000, "HEIGHT": 600},
            "PLAYER_HEIGHT": 100,
            "PLAYER_WIDTH": 10,
            "PLAYER_SPEED": 8,
            "FRAME_RATE": 1 / 60,
        }

        self.BALL = {
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "RADIUS": 10,
            "VELOCITY_X": 5,
            "VELOCITY_Y": 5,
            "SPEED": 8,
            "MAX_SPEED": 25,
            "SPEED_INCREMENT": 0.4,
        }

        self.running = False
        self.winner = ""
        self.key_states = { "ArrowUp": False, "ArrowDown": False, "w": False, "s": False }
    
    def __str__(self) -> str:
        return f'init game engine'

    # for the onlineGame
    def update_paddles(self, group_id):
        channel_name = OnlineGameEngine.groups[group_id]["channel_name"]
        player1 = OnlineGameEngine.groups[group_id]["PLAYERS"]["PLAYER1"]
        player2 = OnlineGameEngine.groups[group_id]["PLAYERS"]["PLAYER2"]
        key_states = OnlineGameEngine.groups[group_id]["key_states"]

        if player1["channel_name"] == channel_name and key_states["ArrowUp"] and player1["Y"] > 0:
            print("move up w")
            player1["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
        if player1["channel_name"] == channel_name and key_states["ArrowDown"] and player1["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            player1["Y"] += self.GAME_INFO["PLAYER_SPEED"]
            print("move down s")
        if player2["channel_name"] == channel_name and key_states["ArrowUp"] and player2["Y"] > 0:
            player2["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
            print("move up arrow up")
        if player2["channel_name"] == channel_name and key_states["ArrowDown"] and player2["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            player2["Y"] += self.GAME_INFO["PLAYER_SPEED"]
            print("move down arrow down")

    def update_ball(self, group_id):
        PLAYERS = OnlineGameEngine.groups[group_id]["PLAYERS"]
        self.BALL["X"] += self.BALL["VELOCITY_X"]
        self.BALL["Y"] += self.BALL["VELOCITY_Y"]

        if self.BALL["Y"] - self.BALL["RADIUS"] <= 0 or self.BALL["Y"] + self.BALL["RADIUS"] >= self.GAME_INFO["CANVAS"]["HEIGHT"]:
            self.BALL["VELOCITY_Y"] *= -1

        for player_key in ["PLAYER1", "PLAYER2"]:
            collision_details = self.get_collision_details(self.BALL, PLAYERS[player_key])
            if collision_details["will_collide"]:
                self.handle_ball_paddle_collision(player_key, collision_details, group_id)

        if self.BALL["X"] - self.BALL["RADIUS"] < 0:
            PLAYERS["PLAYER2"]["SCORE"] =  PLAYERS["PLAYER2"]["SCORE"] + 1
            self.reset_ball()
        elif self.BALL["X"] + self.BALL["RADIUS"] > self.GAME_INFO["CANVAS"]["WIDTH"]:
            PLAYERS["PLAYER1"]["SCORE"] = PLAYERS["PLAYER1"]["SCORE"] + 1
            self.reset_ball()

        if (PLAYERS["PLAYER1"]["SCORE"] == 3):
            self.winner = PLAYERS["PLAYER1"]["FULL_NAME"]
        elif (PLAYERS["PLAYER2"]["SCORE"] == 3):
            self.winner = PLAYERS["PLAYER2"]["FULL_NAME"]
    
    def handle_ball_paddle_collision(self, player_key, collision_details, group_id):

        player = OnlineGameEngine.groups[group_id]["PLAYERS"][player_key]
        self.BALL["X"] = (
            player["X"] + player["W"] + self.BALL["RADIUS"]
            if player_key == "PLAYER1"
            else player["X"] - self.BALL["RADIUS"]
        )
        angle_rad = collision_details["collision_point"] * (math.pi / 4)
        direction = 1 if player_key == "PLAYER1" else -1

        vx = math.cos(angle_rad)
        vy = math.sin(angle_rad)

        magnitude = math.sqrt(vx * vx + vy * vy)

        self.BALL["VELOCITY_X"] = direction * self.BALL["SPEED"] * (vx / magnitude)
        self.BALL["VELOCITY_Y"] = self.BALL["SPEED"] * (vy / magnitude)

        self.BALL["SPEED"] = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])

    def reset_ball(self):
        self.BALL.update({
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "VELOCITY_X": 5 if self.BALL["VELOCITY_X"] < 0 else -5,
            "VELOCITY_Y": 5 if self.BALL["VELOCITY_Y"] < 0 else -5,
            "SPEED": 8,
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
    
    def set_user_info(self, player, scope):
        if player == self.PLAYERS["PLAYER1"]:
            player["USERNAME"] = scope["user"].username
            player["FULL_NAME"] = scope["user"].first_name + " " + scope["user"].last_name

    def join_group_or_add_one(self, user, channel_name):
        for group_id, group_info in OnlineGameEngine.groups.items():
            if group_info["status"] == "waiting":
                group_info["PLAYERS"]["PLAYER2"] = {
                    "channel_name": channel_name,
                    "USERNAME": user.username,
                    "FULL_NAME": f'{user.first_name} {user.last_name}',
                    "X": self.GAME_INFO["CANVAS"]["WIDTH"] - self.GAME_INFO["PLAYER_WIDTH"],
                    "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                    "W": self.GAME_INFO["PLAYER_WIDTH"],
                    "H": self.GAME_INFO["PLAYER_HEIGHT"],
                    "SCORE": 0,
                }
                group_info["player2_Avatar"] = user.avatar
                group_info["status"] = "ready"
                return group_id

        group_id = OnlineGameEngine.next_group_id
        OnlineGameEngine.next_group_id += 1
        OnlineGameEngine.groups[group_id] = {
            "status": "waiting",
            "PLAYERS": {
                "PLAYER1": {
                    "channel_name": channel_name,
                    "USERNAME": user.username,
                    "FULL_NAME": f'{user.first_name} {user.last_name}',
                    "X": 0,
                    "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                    "W": self.GAME_INFO["PLAYER_WIDTH"],
                    "H": self.GAME_INFO["PLAYER_HEIGHT"],
                    "SCORE": 0,
                },
                "PLAYER2": None,
            },
            "channel_name": None,
            "game_leader": channel_name,
            "key_states": { "ArrowUp": False, "ArrowDown": False, "w": False, "s": False },
            "running": False,
            "player2_Avatar": None,
        }
        return group_id

# backend   | last_login = None
# backend   | is_superuser = False
# backend   | username = kzerri
# backend   | first_name = Khalid
# backend   | last_name = Zerri
# backend   | is_staff = False
# backend   | is_active = True
# backend   | date_joined = 2025-01-07 21:04:48.660565+00:00
# backend   | avatar = https://cdn.intra.42.fr/users/59b771739b42a976c2d49874e4db6bf9/kzerri.jpg
# backend   | coverImage = None
# backend   | email = kzerri@student.1337.ma
# backend   | twofa_enabled = False
# backend   | otp_base32 = XU5OJSCBQF4CZSRVQJKIUASLSAQZYFCE
# backend   | level = 0
# backend   | status = offline


    
# def handle_ball_paddle_collision(self, player_key, collision_details):
#     player = self.PLAYERS[player_key]
#     self.BALL["X"] = (
#         player["X"] + player["W"] + self.BALL["RADIUS"]
#         if player_key == "PLAYER1"
#         else player["X"] - self.BALL["RADIUS"]
#     )
#     angle_rad = collision_details["collision_point"] * (math.pi / 4)
#     direction = 1 if player_key == "PLAYER1" else -1

#     self.BALL["VELOCITY_X"] = direction * self.BALL["SPEED"] * math.cos(angle_rad)
#     self.BALL["VELOCITY_Y"] = self.BALL["SPEED"] * math.sin(angle_rad)
#     self.BALL["SPEED"] = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])
