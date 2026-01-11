// Game state management
class GameState {
    constructor() {
        this.currentUser = null;
        this.currentLobby = null;
        this.currentGame = null;
        this.isHost = false;
        this.p2p = new P2PManager();
        this.opponentData = null;
    }

    // User management
    createUser(username, password = null, isGuest = false) {
        const userId = this.generateId();
        const user = {
            id: userId,
            username: username,
            password: password,
            isGuest: isGuest,
            wins: 0,
            losses: 0,
            collection: new Set(),
            createdAt: Date.now()
        };
        
        // Load from localStorage if not guest
        if (!isGuest && password) {
            const saved = this.loadUser(username, password);
            if (saved) {
                return saved;
            }
        }
        
        // Give starting cards (random cards)
        this.giveStartingCards(user);
        
        if (!isGuest) {
            this.saveUser(user);
        }
        
        return user;
    }

    giveStartingCards(user) {
        // Generate 5 random cards using weighted rarity system
        const starterCards = CardRaritySystem.generateStarterDeck();
        starterCards.forEach(card => {
            user.collection.add(card.id);
        });
        
        console.log('🎴 Starter deck generated:', starterCards.map(c => `${c.name} (${c.rarity})`));
    }

    saveUser(user) {
        const users = JSON.parse(localStorage.getItem('onePieceUsers') || '{}');
        users[user.username] = {
            password: user.password,
            wins: user.wins,
            losses: user.losses,
            collection: Array.from(user.collection),
            createdAt: user.createdAt
        };
        localStorage.setItem('onePieceUsers', JSON.stringify(users));
    }

    loadUser(username, password) {
        const users = JSON.parse(localStorage.getItem('onePieceUsers') || '{}');
        if (users[username] && users[username].password === password) {
            return {
                id: this.generateId(),
                username: username,
                password: password,
                isGuest: false,
                wins: users[username].wins || 0,
                losses: users[username].losses || 0,
                collection: new Set(users[username].collection || []),
                createdAt: users[username].createdAt
            };
        }
        return null;
    }

    // P2P Lobby management
    async createLobby(hostUser) {
        this.isHost = true;
        const peerId = await this.p2p.initialize(this.generateLobbyCode(hostUser.username));
        
        this.currentLobby = {
            code: peerId,
            host: hostUser,
            guest: null,
            createdAt: Date.now()
        };
        
        return peerId;
    }

    async joinLobby(code, guestUser) {
        this.isHost = false;
        await this.p2p.initialize(this.generateLobbyCode(guestUser.username));
        await this.p2p.connectToPeer(code);
        
        this.currentLobby = {
            code: code,
            host: null,
            guest: guestUser,
            createdAt: Date.now()
        };
        
        // Send join message with user data
        this.p2p.send({
            type: 'join',
            username: guestUser.username,
            collection: Array.from(guestUser.collection)
        });
        
        return true;
    }

    // Game management with P2P sync
    startGame(hostDeck, guestDeck) {
        const hostUser = this.isHost ? this.currentUser : this.opponentData;
        const guestUser = this.isHost ? this.opponentData : this.currentUser;
        
        this.currentGame = {
            player1: {
                user: hostUser,
                deck: hostDeck,
                score: 0,
                cardsWon: []
            },
            player2: {
                user: guestUser,
                deck: guestDeck,
                score: 0,
                cardsWon: []
            },
            round: 1,
            maxRounds: 5,
            player1Played: false,
            player2Played: false,
            player1Card: null,
            player2Card: null
        };
        
        return this.currentGame;
    }

    // Start game against bot (offline mode)
    startBotGame(playerDeck, botDifficulty) {
        // Set player as host for bot games
        this.isHost = true;

        const botUser = BotManager.createBot(botDifficulty);
        const botDeck = BotManager.generateBotDeck(botDifficulty, 5);
        
        this.currentGame = {
            player1: {
                user: this.currentUser,
                deck: playerDeck,
                score: 0,
                cardsWon: []
            },
            player2: {
                user: botUser,
                deck: botDeck,
                score: 0,
                cardsWon: []
            },
            round: 1,
            maxRounds: 5,
            player1Played: false,
            player2Played: false,
            player1Card: null,
            player2Card: null,
            isBotGame: true,
            botDifficulty: botDifficulty
        };
        
        return this.currentGame;
    }

    // Bot plays automatically
    playBotCard() {
        const game = this.currentGame;
        if (!game.isBotGame) return null;
        
        const card = BotManager.playBotCard(game.player2.deck);
        game.player2Card = card;
        game.player2Played = true;
        
        return card;
    }

    createDeck(user, count) {
        const deck = [];
        const userCards = Array.from(user.collection);
        
        // Fill with random cards if needed
        while (userCards.length < count) {
            const randomCard = CARD_DATABASE[Math.floor(Math.random() * CARD_DATABASE.length)];
            if (!userCards.includes(randomCard.id)) {
                userCards.push(randomCard.id);
            }
        }
        
        // Shuffle and take 'count' cards
        const shuffled = userCards.sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
            const cardData = CARD_DATABASE.find(c => c.id === shuffled[i]);
            if (cardData) {
                deck.push({...cardData});
            }
        }
        
        return deck;
    }

    playCard() {
    const game = this.currentGame;
    const isPlayer1 = this.isHost;
    
    let card;
    if (isPlayer1) {
        card = game.player1.deck.shift();
        game.player1Card = card;
        game.player1Played = true;
    } else {
        card = game.player2.deck.shift();
        game.player2Card = card;
        game.player2Played = true;
    }
    
    // Only send to P2P if not a bot game
    if (!game.isBotGame) {
        this.p2p.send({
            type: 'cardPlayed',
            card: card,
            isPlayer1: isPlayer1
        });
    }
    
    return {
        card: card,
        isPlayer1: isPlayer1
    };
}

    checkBothPlayed() {
        return this.currentGame.player1Played && this.currentGame.player2Played;
    }

    resolveRound() {
        const game = this.currentGame;
        const card1 = game.player1Card;
        const card2 = game.player2Card;
        
        let winner = null;
        if (card1.power > card2.power) {
            winner = 1;
            game.player1.score++;
            if (!game.player1.user.collection.has(card2.id)) {
                game.player1.cardsWon.push(card2);
            }
        } else if (card2.power > card1.power) {
            winner = 2;
            game.player2.score++;
            if (!game.player2.user.collection.has(card1.id)) {
                game.player2.cardsWon.push(card1);
            }
        }
        
        // Reset for next round
        game.player1Played = false;
        game.player2Played = false;
        
        return {
            card1,
            card2,
            winner,
            player1Score: game.player1.score,
            player2Score: game.player2.score
        };
    }

    checkGameOver() {
        const game = this.currentGame;
        if (game.round > game.maxRounds) {
            if (game.player1.score > game.player2.score) {
                return { winner: 1, loser: 2 };
            } else if (game.player2.score > game.player1.score) {
                return { winner: 2, loser: 1 };
            } else {
                return { winner: 0, loser: 0 }; // Tie
            }
        }
        return null;
    }

    concede() {
        const isPlayer1 = this.isHost;
        const result = { winner: isPlayer1 ? 2 : 1, loser: isPlayer1 ? 1 : 2, conceded: true };
        
        // Only notify opponent if not a bot game
        if (!this.currentGame.isBotGame) {
            this.p2p.send({
                type: 'concede'
            });
        }
        
        return result;
    }

    endGame(result) {
        const game = this.currentGame;
        
        // Update stats
        if (result.winner === 1) {
            game.player1.user.wins++;
            game.player2.user.losses++;
            game.player1.cardsWon.forEach(card => {
                game.player1.user.collection.add(card.id);
            });
        } else if (result.winner === 2) {
            game.player2.user.wins++;
            game.player1.user.losses++;
            game.player2.cardsWon.forEach(card => {
                game.player2.user.collection.add(card.id);
            });
        }
        
        // Save current user (can't save opponent)
        if (!this.currentUser.isGuest) {
            this.saveUser(this.currentUser);
        }
        
        return {
            winner: result.winner === 1 ? game.player1.user : (result.winner === 2 ? game.player2.user : null),
            loser: result.winner === 1 ? game.player2.user : (result.winner === 2 ? game.player1.user : null),
            cardsWon: result.winner === 1 ? game.player1.cardsWon : (result.winner === 2 ? game.player2.cardsWon : []),
            conceded: result.conceded || false,
            tie: result.winner === 0
        };
    }

    // Utility functions
    generateId() {
        return 'p' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    generateLobbyCode(username) {
    // Sanitize username (remove spaces, special chars, lowercase)
    const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    // Add timestamp to make it unique
    return cleanUsername + '_' + Date.now().toString(36);
}

    cleanup() {
        this.p2p.disconnect();
        this.currentLobby = null;
        this.currentGame = null;
        this.opponentData = null;
    }
}

// Initialize game state
const gameState = new GameState();
