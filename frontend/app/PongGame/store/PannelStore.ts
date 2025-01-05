import { create } from 'zustand'
import { IMAGES } from "@/public/index"

interface GameContent {
  title: string
  description: string
  image: string
  gameLink: string
}

interface GameState {
  currentGame: 'pingpong' | 'tictactoe'
  label: 'PLAY' | 'PAUSE'
  currentState: 'PAUSE' | 'PLAY' | 'RESTART'
  selectedMode: 'local' | 'online' | null
  isFirstDotLarge: boolean
  isReversed: boolean
  showContent: boolean
  gameContent: {
    pingpong: GameContent
    tictactoe: GameContent
  }
  switchGame: () => void
  setGameMode: (mode: 'local' | 'online') => void
  toggleDots: () => void
  toggleReverse: () => void
  setShowContent: (show: boolean) => void
  getGamePath: () => string
  handleGameSwitch: () => void
  handleCurrentState: () => void,
}

export const useGameStore = create<GameState>((set, get) => ({
  currentGame: 'pingpong',
  label: 'PLAY',
  currentState: 'PAUSE',
  selectedMode: null,
  isFirstDotLarge: true,
  isReversed: false,
  showContent: true,
  gameContent: {
    pingpong: {
      title: "PING PONG",
      description: "Table tennis, also known as ping-pong and whiff-whaff, is a sport in which two or four players hit a lightweight ball, also known as the ping-pong ball, back and forth across a table using small rackets. The game takes place on a hard table divided by a net.",
      image: IMAGES.pongTable,
      gameLink: '/PongGame/GameMode'
    },
    tictactoe: {
      title: "TIC TAC TOE",
      description: "The game is played on a grid that's 3 squares by 3 squares. You are X, your friend (or the computer in this case) is O. Players take turns putting their marks in empty squares. The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.",
      image: IMAGES.TicTacToe,
      gameLink: '/PongGame/GameMode'
    }
  },
  switchGame: () => set((state) => ({
    currentGame: state.currentGame === 'pingpong' ? 'tictactoe' : 'pingpong',
  })),
  setGameMode: (mode) => set({ selectedMode: mode }),
  toggleDots: () => set((state) => ({ isFirstDotLarge: !state.isFirstDotLarge })),
  toggleReverse: () => set((state) => ({ isReversed: !state.isReversed })),
  setShowContent: (show) => set({ showContent: show }),
  getGamePath: () => {
    const state = get();
    const gamePath = state.currentGame === 'pingpong' ? '/PongGame/PingPong' : '/PongGame/TicTacToe';
    return `${gamePath}/${state.selectedMode}`;
  },
  handleGameSwitch: () => {
    const { setShowContent, toggleReverse, toggleDots, switchGame } = get();
    setShowContent(false);
    setTimeout(() => {
      toggleReverse();
      toggleDots();
      switchGame();
      setTimeout(() => {
        setShowContent(true);
      }, 450);
    });
  },
  handleCurrentState: () => set((state) => (
    {
      currentState: state.currentState === "PLAY" ? "PAUSE" : "PLAY",
      label: state.label === "PAUSE" ? "PLAY" : "PAUSE",
    }
  )),
}))
