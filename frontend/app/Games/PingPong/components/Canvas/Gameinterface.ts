export interface GamePlayer {
    channel_name: string,
    user_id: number,
    FULL_NAME: string | null,
    USERNAME: string | null,
    X: number,
    Y: number,
    W: number,
    H: number,
    SCORE: number,
    avatar?: string | null,
    reason?: string | null,
};

export interface GameBall {
    X: number
    Y: number
    SPEED: number
    VELOCITY_X: number
    VELOCITY_Y: number
    MAX_SPEED?: number
    SPEED_INCREMENT?: number | null
};

export interface GameState {
    game: {
        BALL: GameBall;
        PLAYERS: {
            PLAYER1: GamePlayer;
            PLAYER2: GamePlayer;
        };
        WINNER?: GamePlayer,
    },
    PLAYERS?: {
        PLAYER1: GamePlayer;
        PLAYER2: GamePlayer;
    },
    gameStatus?: string | null,
}