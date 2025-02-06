type GameIcons = {
    BackwardButton: string;
    Chat: string;
    Game: string;
    Home: string;
    HomePage: string;
    Ranking: string;
    Settings: string;
    Stats: string;
}

type GameImages = {
    fontBackground: string;
    LocalGame: string;
    OnlineGame: string;
    profile: string;
    pongTable: string;
    standardBackground: string;
    TicTacToe: string;
    X: string;
    O: string;
}

type ImagePaths = GameIcons & GameImages;

export const IMAGES: ImagePaths = {
    // Icons
    BackwardButton: '/game/icons/Backward.svg',
    Chat: '/game/icons/Chat.svg',
    Game: '/game/icons/Game.svg',
    Home: '/game/icons/Home.svg',
    HomePage: '/game/icons/HomePage.svg',
    Ranking: '/game/icons/Ranking.svg',
    Settings: '/game/icons/Settings.svg',
    Stats: '/game/icons/Stats.svg', // Fixed path

    // Game Images
    fontBackground: '/game/images/font_background_picture.png',
    LocalGame: '/game/images/LocalGame.png',
    OnlineGame: '/game/images/OnlineGame.png',
    profile: '/images/avatar.png',
    pongTable: '/game/images/pong_table.png',
    standardBackground: '/game/images/StandardBackground.png',
    TicTacToe: '/game/images/tictactoe.png',
    X: '/game/images/X.png',
    O: '/game/images/O.png',
} as const;

export const getImageUrl = (key: keyof typeof IMAGES): string => {
    return IMAGES[key];
};

export const getGameIcon = (key: keyof GameIcons): string => {
    return IMAGES[key];
};

export const getGameImage = (key: keyof GameImages): string => {
    return IMAGES[key];
};