import { create } from 'zustand'
import { IMAGES } from "@/public/index"

interface GameContent {
  title: string
  description: string
  image: string
  gameLink: string
  tournament: string
}

interface TicTacOpponent{
  isFound: boolean,
  username: string | null,
  avatar: string | null
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
  is_tournament: boolean
  tournament_players: Array<string | null>
  tournament_match: string | null
  tournament_match_winner:string | null
  TicTacOpponent: TicTacOpponent
  invited_id: number | null
  GameBoardColor: string | null,

  setInvitedId: (id: number | null) => void,
  resetInvitedId: () => void,
  switchGame: () => void
  setGameMode: (mode: 'local' | 'online') => void
  toggleDots: () => void
  toggleReverse: () => void
  setShowContent: (show: boolean) => void
  getGamePath: () => string
  handleGameSwitch: () => void
  handleCurrentState: () => void,
  setTournamentPlayers: (username:string| null, index:number)=> void,
  setIsTournament: (is_tournament:boolean) => void,
  setTournamentMatch: (match:string|null) => void,
  resetTournamentPlayer: () => void,
  setGameBoardColor: (Color: string) => void,
  setTicTacOpponent: (flag:boolean, opponentName: string | null, opponentAvatar: string | null) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  invited_id: null,
  currentGame: 'pingpong',
  label: 'PLAY',
  currentState: 'PAUSE',
  selectedMode: null,
  GameBoardColor: "bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900",
  isFirstDotLarge: true,
  isReversed: false,
  showContent: true,
  is_tournament: false,
  tournament_players: Array(7).fill(null), // tournament players initialised with null
  gameContent: {
    pingpong: {
      title: "PING PONG",
      description: "Table tennis, also known as ping-pong and whiff-whaff, is a sport in which two or four players hit a lightweight ball, also known as the ping-pong ball, back and forth across a table using small rackets. The game takes place on a hard table divided by a net.",
      image: IMAGES.fontBackground,
      gameLink: '/Games/GameMode',
      tournament: '/Games/tournament',
    },
    tictactoe: {
      title: "TIC TAC TOE",
      description: "The game is played on a grid that's 3 squares by 3 squares. You are X, your friend (or the computer in this case) is O. Players take turns putting their marks in empty squares. The first player to get 3 of their marks in a row (up, down, across, or diagonally) is the winner.",
      image: IMAGES.TicTacToe,
      gameLink: '/Games/GameMode',
      tournament: ''
    }
  },
  tournament_match: null,
  tournament_match_winner: null,
  TicTacOpponent: { isFound: false ,username: null, avatar: null },

  switchGame: () => set((state) => ({
    currentGame: state.currentGame === 'pingpong' ? 'tictactoe' : 'pingpong',
  })),
  setGameMode: (mode) => set({ selectedMode: mode }),
  toggleDots: () => set((state) => ({ isFirstDotLarge: !state.isFirstDotLarge })),
  toggleReverse: () => set((state) => ({ isReversed: !state.isReversed })),
  setShowContent: (show) => set({ showContent: show }),
  getGamePath: () => {
    const state = get();
    const gamePath = state.currentGame === 'pingpong' ? '/Games/PingPong' : '/Games/TicTacToe';
    return `${gamePath}/${state.selectedMode}`;
  },
  //set tournament players
  setTournamentPlayers: (username, index) => 
    set((state) => {
      const updatedPlayers = [...state.tournament_players];
      updatedPlayers[index] = username;
      return { tournament_players: updatedPlayers };
    }),
    //here i set this var as true to mark that im in a tournament(to not use 'player1 and player2' and use the values in tournament_players)
    setIsTournament: (flag) => set({is_tournament: flag}),
    setTournamentMatch: (match) => set({tournament_match: match}),
    resetTournamentPlayer: ()=> set({tournament_players: Array(7).fill(null)}),
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
  setGameBoardColor: (color) => {
    set({GameBoardColor: color})
  },
  setTicTacOpponent: (flag:boolean ,opponentUsername: null | string, opponentAvatar: null | string) => set({TicTacOpponent: {
          isFound: flag,
          username: opponentUsername,
          avatar: opponentAvatar
        }
      }
    ),
    setInvitedId: (id) => {
      set({invited_id: id})
    },
    resetInvitedId: () => {
      set({invited_id: null})
    }
    

}))