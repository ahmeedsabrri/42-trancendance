import { create } from 'zustand'
import { GamePlayer, GameBall} from '../PingPong/components/Canvas/Gameinterface'

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
  fullname: string | null
  username: string | null
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
  countdown: number;
  invitedCountdown: number;
  game_status: string | null,
  player1info: {
    avatar: string | null,
    fullname: string | null,
  },
  player2info: {
    avatar: string | null,
    fullname: string | null,
  },
  winner: {
    fullname: string | null,
    avatar: string | null,
    reason: string | null,
  },
  player1: Player
  player2: Player
  ball: Ball
  keysPressed: {
    ArrowUp: boolean
    ArrowDown: boolean
    w: boolean
    s: boolean
  },
  updatePaddles: (newPlayer1: GamePlayer, newPlayer2: GamePlayer) => void
  updateBall: (ball: GameBall) => void
  setKeyPressed: (key: string, value: boolean) => void
  setWinner: (winner: GamePlayer | null) => void
  setGameStatus: (game_status: string | null) => void
  setPlayer1info: (player1info: Partial<GamePlayer>) => void
  setPlayer2info: (player2info: Partial<GamePlayer>) => void
  setCountdown: (value: number) => void
  resetCountdown: () => void
  resetPlayersInfo: () => void
  setinvitedCountdown: (value: number) => void
  resetInvitedCountdown: () => void
}

export const useGameStateStore = create<GameState>((set) => ({
  countdown: 3,
  invitedCountdown: 30,
  game_status: "waiting",
  player1info: {
    avatar: null,
    fullname: null,
  },
  player2info: {
    avatar: null,
    fullname: null,
  },
  winner: {
    fullname: null,
    avatar: null,
    reason: null,
  },
  player1: {
    fullname: null,
    username: "Player 1",
    x: 0,
    y: GAME_CONSTANTS.CANVAS.HEIGHT / 2 - GAME_CONSTANTS.PLAYER.HEIGHT / 2,
    w: GAME_CONSTANTS.PLAYER.WIDTH,
    h: GAME_CONSTANTS.PLAYER.HEIGHT,
    speed: GAME_CONSTANTS.PLAYER.INITIAL_SPEED,
    score: 0,
  },
  player2: {
    fullname: null,
    username: "Player 2",
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
    set((state) => ({
      player1: {
        ...state.player1,
        fullname: newPlayer1.FULL_NAME,
        username: newPlayer1.USERNAME,
        x: newPlayer1.X,
        y: newPlayer1.Y,
        w: newPlayer1.W,
        h: newPlayer1.H,
        score: newPlayer1.SCORE
      },
      player2: {
        ...state.player2,
        fullname: newPlayer2.FULL_NAME,
        username: newPlayer2.USERNAME,
        x: newPlayer2.X,
        y: newPlayer2.Y,
        w: newPlayer2.W,
        h: newPlayer2.H,
        score: newPlayer2.SCORE,
      }
    })),
  updateBall: (newBallState) =>
    set((state) => ({
      ball: {
        ...state.ball,
        x: newBallState.X,
        y: newBallState.Y,
        speed: newBallState.SPEED,
        velocityX: newBallState.VELOCITY_X,
        velocityY: newBallState.VELOCITY_Y * (Math.random() > 0.5 ? 1 : -1),
      },
    })),
  setWinner: (winner) => set({
    winner: {
      fullname: winner?.FULL_NAME ?? null,
      avatar: winner?.avatar ?? null,
      reason: winner?.reason ?? null
    }
  }),
  setGameStatus: (game_status) => set({ game_status }),
  setPlayer1info: (player1info) => set((state) => ({
    player1info: {
      ...state.player1info,
      avatar: player1info.avatar ?? null,
      fullname: player1info.FULL_NAME ?? null
    }
  })),
  setPlayer2info: (player2info) => set((state) => ({
    player2info: {
      ...state.player2info,
      avatar: player2info.avatar ?? null,
      fullname: player2info.FULL_NAME ?? null
    }
  })),
  setCountdown: (value) => set({ countdown: value }),
  setinvitedCountdown: (value) => set({ invitedCountdown: value }),
  resetCountdown: () => set({ countdown: 3 }),
  resetInvitedCountdown: () => set({ invitedCountdown: 30 }),
  resetPlayersInfo: () => set({
    player1info: { avatar: null, fullname: null },
    player2info: { avatar: null, fullname: null }
  }),
}))