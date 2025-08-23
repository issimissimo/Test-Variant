/*
* ===== GAMES LIST =====
* This list must be modified to add (or delete) games
*/

export const GAMES_LIST = [
    {
        fileName: "envLight",
        title: "Environment light",
        description: "Inserisci un'immagine HDRI 360 come luce ambientale",
        image: '/images/games/backgrounds/vetro.jpg',
        category: 'light',
        allowed: 1,
        localized: true,
        tags: [],
        requirements: {}
    },
    {
        fileName: "basicRotCube",
        title: 'Cubo che ruota',
        description: 'Da eliminare, solo di test',
        image: '/images/games/backgrounds/vetro.jpg',
        category: 'test',
        allowed: 1,
        localized: false,
        tags: [],
        requirements: {}
    },
    {
        fileName: "baloons",
        title: 'Palloncini fluttuanti',
        description: '',
        image: '/images/games/backgrounds/vetro.jpg',
        category: '',
        allowed: 1,
        localized: true,
        tags: [],
        requirements: {}
    },
];

export default GAMES_LIST