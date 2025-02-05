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
                "FULL_NAME": "player1",
                "X": 0,
                "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                "W": self.GAME_INFO["PLAYER_WIDTH"],
                "H": self.GAME_INFO["PLAYER_HEIGHT"],
                "SCORE": 0,
            },
            "PLAYER2": {
                "USERNAME": "player2",
                "FULL_NAME": "player2",
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
        self.key_states = {"ArrowUp": False, "ArrowDown": False, "w": False, "s": False}
    
    def __str__(self) -> str:
        return 'init game engine'

    def update_paddles(self):
        # Player 1 movement (W and S keys)
        if self.key_states["w"] and self.PLAYERS["PLAYER1"]["Y"] > 0:
            self.PLAYERS["PLAYER1"]["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
        if self.key_states["s"] and self.PLAYERS["PLAYER1"]["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            self.PLAYERS["PLAYER1"]["Y"] += self.GAME_INFO["PLAYER_SPEED"]

        # Player 2 movement (Arrow keys)
        if self.key_states["ArrowUp"] and self.PLAYERS["PLAYER2"]["Y"] > 0:
            self.PLAYERS["PLAYER2"]["Y"] -= self.GAME_INFO["PLAYER_SPEED"]
        if self.key_states["ArrowDown"] and self.PLAYERS["PLAYER2"]["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
            self.PLAYERS["PLAYER2"]["Y"] += self.GAME_INFO["PLAYER_SPEED"]

    def get_collision_details(self, ball, player):
        # Calculate the ball's next position
        next_ball_x = ball["X"] + ball["VELOCITY_X"]
        next_ball_y = ball["Y"] + ball["VELOCITY_Y"]
        
        # Calculate the closest point on the paddle to the ball's center
        closest_x = max(player["X"], min(next_ball_x, player["X"] + player["W"]))
        closest_y = max(player["Y"], min(next_ball_y, player["Y"] + player["H"]))
        
        # Calculate the distance between the closest point and the ball's center
        distance_x = next_ball_x - closest_x
        distance_y = next_ball_y - closest_y
        distance = math.sqrt(distance_x * distance_x + distance_y * distance_y)
        
        # Check if the ball will collide with the paddle
        will_collide = distance <= ball["RADIUS"]
        
        # Calculate the relative collision point (-1 to 1)
        player_center = player["Y"] + player["H"] / 2
        collision_point = (next_ball_y - player_center) / (player["H"] / 2)
        collision_point = max(-1, min(1, collision_point))  # Clamp between -1 and 1
        
        return {
            "will_collide": will_collide,
            "collision_point": collision_point,
            "next_ball_x": next_ball_x,
            "next_ball_y": next_ball_y
        }

    def handle_ball_paddle_collision(self, player_key, collision_details):
        player = self.PLAYERS[player_key]
        
        # Set the ball's position to the correct side of the paddle
        if player_key == "PLAYER1":
            self.BALL["X"] = player["X"] + player["W"] + self.BALL["RADIUS"]
        else:
            self.BALL["X"] = player["X"] - self.BALL["RADIUS"]
        
        # Use the collision point to determine the reflection angle
        # Map the collision point from [-1, 1] to [-π/3, π/3] for more realistic angles
        angle_rad = collision_details["collision_point"] * (math.pi / 3)
        direction = 1 if player_key == "PLAYER1" else -1
        
        # Calculate new velocities
        speed = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])
        self.BALL["SPEED"] = speed
        
        # Calculate normalized velocity components
        vx = math.cos(angle_rad)
        vy = math.sin(angle_rad)
        magnitude = math.sqrt(vx * vx + vy * vy)
        
        # Apply the new velocities
        self.BALL["VELOCITY_X"] = direction * speed * (vx / magnitude)
        self.BALL["VELOCITY_Y"] = speed * (vy / magnitude)

    def update_ball(self):
        # Store current position for collision check
        prev_x = self.BALL["X"]
        prev_y = self.BALL["Y"]
        
        # Update ball position
        self.BALL["X"] += self.BALL["VELOCITY_X"]
        self.BALL["Y"] += self.BALL["VELOCITY_Y"]
        
        # Handle wall collisions with proper bouncing
        if self.BALL["Y"] - self.BALL["RADIUS"] <= 0:
            self.BALL["Y"] = self.BALL["RADIUS"]
            self.BALL["VELOCITY_Y"] *= -1
        elif self.BALL["Y"] + self.BALL["RADIUS"] >= self.GAME_INFO["CANVAS"]["HEIGHT"]:
            self.BALL["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] - self.BALL["RADIUS"]
            self.BALL["VELOCITY_Y"] *= -1
        
        # Check paddle collisions
        for player_key in ["PLAYER1", "PLAYER2"]:
            collision_details = self.get_collision_details(self.BALL, self.PLAYERS[player_key])
            if collision_details["will_collide"]:
                self.handle_ball_paddle_collision(player_key, collision_details)
                break  # Only collide with one paddle per frame
        
        # Score handling
        if self.BALL["X"] - self.BALL["RADIUS"] < 0:
            self.PLAYERS["PLAYER2"]["SCORE"] += 1
            self.reset_positions()
            self.reset_ball()
        elif self.BALL["X"] + self.BALL["RADIUS"] > self.GAME_INFO["CANVAS"]["WIDTH"]:
            self.PLAYERS["PLAYER1"]["SCORE"] += 1
            self.reset_positions()
            self.reset_ball()
        
        # Winner check
        if self.PLAYERS["PLAYER1"]["SCORE"] == 3:
            self.winner = self.PLAYERS["PLAYER1"]
        elif self.PLAYERS["PLAYER2"]["SCORE"] == 3:
            self.winner = self.PLAYERS["PLAYER2"]

    def reset_ball(self):
        self.BALL.update({
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "VELOCITY_X": 5 if self.BALL["VELOCITY_X"] < 0 else -5,
            "VELOCITY_Y": 5 if self.BALL["VELOCITY_Y"] < 0 else -5,
            "SPEED": 8,
        })

    def reset_positions(self):
        # Reset paddle positions to center
        self.PLAYERS["PLAYER1"]["Y"] = self.PLAYERS["PLAYER2"]["Y"] = (
            self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
        )

    def reset_game(self):
        self.reset_positions()
        self.PLAYERS["PLAYER1"]["SCORE"] = self.PLAYERS["PLAYER2"]["SCORE"] = 0
        self.winner = ""
        self.reset_ball()

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
        self.winnerScore = None
        self.loserScore = None
        self.key_states = {"ArrowUp": False, "ArrowDown": False, "w": False, "s": False}
    
    def __str__(self) -> str:
        return 'init game engine'

    def update_paddles(self, group_id):
        channel_name = OnlineGameEngine.groups[group_id]["channel_name"]
        player1 = OnlineGameEngine.groups[group_id]["PLAYERS"]["PLAYER1"]
        player2 = OnlineGameEngine.groups[group_id]["PLAYERS"]["PLAYER2"]
        key_states = OnlineGameEngine.groups[group_id]["key_states"]

        # Player 1 movement
        if player1["channel_name"] == channel_name:
            if key_states["ArrowUp"] and player1["Y"] > 0:
                player1["Y"] = max(0, player1["Y"] - self.GAME_INFO["PLAYER_SPEED"])
            if key_states["ArrowDown"] and player1["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
                player1["Y"] = min(
                    self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"],
                    player1["Y"] + self.GAME_INFO["PLAYER_SPEED"]
                )

        # Player 2 movement
        if player2 and player2["channel_name"] == channel_name:
            if key_states["ArrowUp"] and player2["Y"] > 0:
                player2["Y"] = max(0, player2["Y"] - self.GAME_INFO["PLAYER_SPEED"])
            if key_states["ArrowDown"] and player2["Y"] < self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"]:
                player2["Y"] = min(
                    self.GAME_INFO["CANVAS"]["HEIGHT"] - self.GAME_INFO["PLAYER_HEIGHT"],
                    player2["Y"] + self.GAME_INFO["PLAYER_SPEED"]
                )

    def get_collision_details(self, ball, player):
        # Calculate the ball's next position
        next_ball_x = ball["X"] + ball["VELOCITY_X"]
        next_ball_y = ball["Y"] + ball["VELOCITY_Y"]
        
        # Calculate the closest point on the paddle to the ball's center
        closest_x = max(player["X"], min(next_ball_x, player["X"] + player["W"]))
        closest_y = max(player["Y"], min(next_ball_y, player["Y"] + player["H"]))
        
        # Calculate the distance between the closest point and the ball's center
        distance_x = next_ball_x - closest_x
        distance_y = next_ball_y - closest_y
        distance = math.sqrt(distance_x * distance_x + distance_y * distance_y)
        
        # Check if the ball will collide with the paddle
        will_collide = distance <= ball["RADIUS"]
        
        # Calculate the relative collision point (-1 to 1)
        player_center = player["Y"] + player["H"] / 2
        collision_point = (next_ball_y - player_center) / (player["H"] / 2)
        collision_point = max(-1, min(1, collision_point))  # Clamp between -1 and 1
        
        return {
            "will_collide": will_collide,
            "collision_point": collision_point,
            "next_ball_x": next_ball_x,
            "next_ball_y": next_ball_y
        }

    def handle_ball_paddle_collision(self, player_key, collision_details, group_id):
        player = OnlineGameEngine.groups[group_id]["PLAYERS"][player_key]
        
        # Set the ball's position to the correct side of the paddle
        if player_key == "PLAYER1":
            self.BALL["X"] = player["X"] + player["W"] + self.BALL["RADIUS"]
        else:
            self.BALL["X"] = player["X"] - self.BALL["RADIUS"]
        
        # Use the collision point to determine the reflection angle
        # Map the collision point from [-1, 1] to [-π/3, π/3] for more realistic angles
        angle_rad = collision_details["collision_point"] * (math.pi / 3)
        direction = 1 if player_key == "PLAYER1" else -1
        
        # Calculate new velocities
        speed = min(self.BALL["SPEED"] + self.BALL["SPEED_INCREMENT"], self.BALL["MAX_SPEED"])
        self.BALL["SPEED"] = speed
        
        # Calculate normalized velocity components
        vx = math.cos(angle_rad)
        vy = math.sin(angle_rad)
        magnitude = math.sqrt(vx * vx + vy * vy)
        
        # Apply the new velocities
        self.BALL["VELOCITY_X"] = direction * speed * (vx / magnitude)
        self.BALL["VELOCITY_Y"] = speed * (vy / magnitude)

    def update_ball(self, group_id):
        PLAYERS = OnlineGameEngine.groups[group_id]["PLAYERS"]
        
        # Update ball position
        self.BALL["X"] += self.BALL["VELOCITY_X"]
        self.BALL["Y"] += self.BALL["VELOCITY_Y"]
        
        # Handle wall collisions with proper bouncing
        if self.BALL["Y"] - self.BALL["RADIUS"] <= 0:
            self.BALL["Y"] = self.BALL["RADIUS"]
            self.BALL["VELOCITY_Y"] *= -1
        elif self.BALL["Y"] + self.BALL["RADIUS"] >= self.GAME_INFO["CANVAS"]["HEIGHT"]:
            self.BALL["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] - self.BALL["RADIUS"]
            self.BALL["VELOCITY_Y"] *= -1
        
        # Check paddle collisions
        for player_key in ["PLAYER1", "PLAYER2"]:
            if PLAYERS[player_key]:  # Check if player exists
                collision_details = self.get_collision_details(self.BALL, PLAYERS[player_key])
                if collision_details["will_collide"]:
                    self.handle_ball_paddle_collision(player_key, collision_details, group_id)
                    break  # Only collide with one paddle per frame

        # Score handling
        if self.BALL["X"] - self.BALL["RADIUS"] < 0:
            PLAYERS["PLAYER2"]["SCORE"] += 1
            self.reset_ball()
        elif self.BALL["X"] + self.BALL["RADIUS"] > self.GAME_INFO["CANVAS"]["WIDTH"]:
            PLAYERS["PLAYER1"]["SCORE"] += 1
            self.reset_ball()

        # Winner check and game status update
        if PLAYERS["PLAYER1"]["SCORE"] == 3:
            PLAYERS["PLAYER1"]["reason"] = "GAME FINISHED"
            self.winner = PLAYERS["PLAYER1"]
            self.winnerScore =  PLAYERS["PLAYER1"]["SCORE"]
            self.loserScore = PLAYERS["PLAYER2"]["SCORE"]
            OnlineGameEngine.groups[group_id]["game_winner"] = OnlineGameEngine.groups[group_id]["user1"]
            OnlineGameEngine.groups[group_id]["game_loser"] = OnlineGameEngine.groups[group_id]["user2"]
            OnlineGameEngine.groups[group_id]["status"] = "Completed"
            
        elif PLAYERS["PLAYER2"]["SCORE"] == 3:
            PLAYERS["PLAYER2"]["reason"] = "GAME FINISHED"
            self.winner = PLAYERS["PLAYER2"]
            self.winnerScore =  PLAYERS["PLAYER2"]["SCORE"]
            self.loserScore = PLAYERS["PLAYER1"]["SCORE"]
            OnlineGameEngine.groups[group_id]["game_winner"] = OnlineGameEngine.groups[group_id]["user2"]
            OnlineGameEngine.groups[group_id]["game_loser"] = OnlineGameEngine.groups[group_id]["user1"]
            OnlineGameEngine.groups[group_id]["status"] = "Completed"

    def reset_ball(self):
        self.BALL.update({
            "X": self.GAME_INFO["CANVAS"]["WIDTH"] / 2,
            "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2,
            "VELOCITY_X": 5 if self.BALL["VELOCITY_X"] < 0 else -5,
            "VELOCITY_Y": 5 if self.BALL["VELOCITY_Y"] < 0 else -5,
            "SPEED": 8,
        })

    def reset_game(self, group_id):
        PLAYERS = OnlineGameEngine.groups[group_id]["PLAYERS"]
        # Reset paddle positions
        if PLAYERS["PLAYER1"]:
            PLAYERS["PLAYER1"]["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
            PLAYERS["PLAYER1"]["SCORE"] = 0
        if PLAYERS["PLAYER2"]:
            PLAYERS["PLAYER2"]["Y"] = self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2
            PLAYERS["PLAYER2"]["SCORE"] = 0
        
        self.winner = ""
        self.reset_ball()
        OnlineGameEngine.groups[group_id]["status"] = "ready"

    def join_group_or_add_one(self, user, channel_name, invited_id):
        # Look for an available group
        for group_id, group_info in OnlineGameEngine.groups.items():
            if group_info["status"] == "waiting":
                if group_info["PLAYERS"]["PLAYER1"]["user_id"] == user.id:
                    break
                if (group_info["invited_id"] and group_info["invited_id"] != invited_id):
                    print(f'users the same = {group_info["invited_id"]} {invited_id}')
                    break
                # Join existing group as player 2
                group_info["PLAYERS"]["PLAYER2"] = {
                    "channel_name": channel_name,
                    "user_id": user.id,
                    "USERNAME": user.username,
                    "FULL_NAME": f'{user.first_name} {user.last_name}',
                    "X": self.GAME_INFO["CANVAS"]["WIDTH"] - self.GAME_INFO["PLAYER_WIDTH"],
                    "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                    "W": self.GAME_INFO["PLAYER_WIDTH"],
                    "H": self.GAME_INFO["PLAYER_HEIGHT"],
                    "SCORE": 0,
                    "avatar": f'{user.avatar}',
                    "reason": "OPPONENT DISCONNECTED",
                }
                group_info["status"] = "ready"
                group_info["user2"] = user
                return group_id

        # Create new group if none available
        group_id = OnlineGameEngine.next_group_id
        OnlineGameEngine.next_group_id += 1

        OnlineGameEngine.groups[group_id] = {
            "status": "waiting",
            "PLAYERS": {
                "PLAYER1": {
                    "channel_name": channel_name,
                    "user_id": user.id,
                    "USERNAME": user.username,
                    "FULL_NAME": f'{user.first_name} {user.last_name}',
                    "X": 0,
                    "Y": self.GAME_INFO["CANVAS"]["HEIGHT"] / 2 - self.GAME_INFO["PLAYER_HEIGHT"] / 2,
                    "W": self.GAME_INFO["PLAYER_WIDTH"],
                    "H": self.GAME_INFO["PLAYER_HEIGHT"],
                    "SCORE": 0,
                    "avatar": f'{user.avatar}',
                    "reason": "OPPONENT DISCONNECTED",
                },
                "PLAYER2": None,
            },
            "channel_name": None,
            "game_leader": channel_name,
            "key_states": {"ArrowUp": False, "ArrowDown": False, "w": False, "s": False},
            "running": False,
            "user1": user,
            "user2": None,
            "invited_id": invited_id,
            "game_winner": None,
            "game_loser": None,
        }
        return group_id
