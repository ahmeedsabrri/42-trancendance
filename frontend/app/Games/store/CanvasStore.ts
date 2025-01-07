import { create } from 'zustand'

const GAME_CONSTANTS = {
  CANVAS: {
    WIDTH: 1000,
    HEIGHT: 600
  },
  PLAYER: {
    HEIGHT: 100,
    WIDTH: 10,
    INITIAL_SPEED: 8
  },
  BALL: {
    RADIUS: 10,
    INITIAL_SPEED: 12,
    INITIAL_VELOCITY: 5,
    MAX_SPEED: 25,
    SPEED_INCREMENT: 0.4,
  }
}

interface Player {
  x: number
  y: number
  w: number
  h: number
  speed: number
  score: number
}

interface Ball {
  x: number
  y: number
  r: number
  speed: number
  velocityX: number
  velocityY: number
}

interface GameState {
  winner: string,
  player1: Player
  player2: Player
  ball: Ball
  keysPressed: {
    ArrowUp: boolean
    ArrowDown: boolean
    w: boolean
    s: boolean
  }

  updatePaddles: (newPlayer1: any, newPlayer2: any) => void
  updateBall: (ball: any) => void
  setKeyPressed: (key: string, value: boolean) => void
  setWinner: (winner: string) => void,
  // restartGame: () => void;
}

export const useGameStateStore = create<GameState>((set, get) => ({
  winner: '',
  player1: {
    x: 0,
    y: GAME_CONSTANTS.CANVAS.HEIGHT / 2 - GAME_CONSTANTS.PLAYER.HEIGHT / 2,
    w: GAME_CONSTANTS.PLAYER.WIDTH,
    h: GAME_CONSTANTS.PLAYER.HEIGHT,
    speed: GAME_CONSTANTS.PLAYER.INITIAL_SPEED,
    score: 0,
  },

  player2: {
    x: GAME_CONSTANTS.CANVAS.WIDTH - GAME_CONSTANTS.PLAYER.WIDTH,
    y: GAME_CONSTANTS.CANVAS.HEIGHT / 2 - GAME_CONSTANTS.PLAYER.HEIGHT / 2,
    w: GAME_CONSTANTS.PLAYER.WIDTH,
    h: GAME_CONSTANTS.PLAYER.HEIGHT,
    speed: GAME_CONSTANTS.PLAYER.INITIAL_SPEED,
    score: 0,
  },

  ball: {
    x: GAME_CONSTANTS.CANVAS.WIDTH / 2,
    y: GAME_CONSTANTS.CANVAS.HEIGHT / 2,
    r: GAME_CONSTANTS.BALL.RADIUS,
    speed: GAME_CONSTANTS.BALL.INITIAL_SPEED,
    velocityX: GAME_CONSTANTS.BALL.INITIAL_VELOCITY,
    velocityY: GAME_CONSTANTS.BALL.INITIAL_VELOCITY,
  },

  keysPressed: {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  },

  setKeyPressed: (key, value) =>
    set((state) => ({
      keysPressed: { ...state.keysPressed, [key]: value },
    })),

  updatePaddles: (newPlayer1, newPlayer2) =>
    set((state) => {
      return {
                player1: {
                  ...state.player1,
                  x: newPlayer1.X,
                  y: newPlayer1.Y,
                  w: newPlayer1.W,
                  h: newPlayer1.H,
                  score: newPlayer1.SCORE
                },
                player2: {
                  ...state.player2,
                  x: newPlayer2.X,
                  y: newPlayer2.Y,
                  w: newPlayer2.W,
                  h: newPlayer2.H,
                  score: newPlayer2.SCORE,
                }
              }
      },
    ),

  updateBall: (newBallState) =>
    set((state) => {
        return {
          ball: {
            ...state.ball,
            x: newBallState.X,
            y: newBallState.Y,
            speed: newBallState.SPEED,
            velocityX: newBallState.Velocity_X,
            velocityY: newBallState.velocity_Y * (Math.random() > 0.5 ? 1 : -1),
          },
        }
    }),
    setWinner: (winner: string) => set({winner: winner}),
}))