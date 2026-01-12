// Team Battle Game Mode
// Davy Back Fight & Classic Pirate modes

const ROLE_MODIFIERS = {
    DAVY_BACK: {
        captain: { multiplier: 2.0, name: "Captain", description: "Leader of the crew" },
        viceCaptain: { multiplier: 1.5, name: "Vice-Captain", description: "Second in command" },
        tank: { multiplier: 1.3, name: "Tank", description: "Defensive powerhouse" },
        healer: { multiplier: 1.2, name: "Healer", description: "Keeps the crew alive" },
        support1: { multiplier: 1.1, name: "Support", description: "Team supporter" },
        support2: { multiplier: 1.1, name: "Support", description: "Team supporter" }
    },
    CLASSIC_PIRATE: {
        captain: { multiplier: 2.0, name: "Captain", description: "Leader of the crew" },
        viceCaptain: { multiplier: 1.5, name: "Vice-Captain", description: "Second in command" },
        tank: { multiplier: 1.3, name: "Tank", description: "Defensive powerhouse" },
        healer: { multiplier: 1.2, name: "Healer", description: "Keeps the crew alive" },
        support: { multiplier: 1.1, name: "Support", description: "Team supporter" },
        traitor: { multiplier: -0.5, name: "Traitor", description: "⚠️ Sabotages your team!" }
    }
};

class TeamBattleGame {
    constructor() {
        this.mode = null; // 'DAVY_BACK' or 'CLASSIC_PIRATE'
        this.wager = 1; // Number of cards to bet
        this.player1 = null;
        this.player2 = null;
        this.currentTurn = 1; // Which player's turn to assign
        this.assignmentPhase = 0; // 0-5 for 6 assignments
        this.isBotGame = false;
        this.botDifficulty = null;
    }

startGame(player1Data, player2Data, mode, wager, isBotGame = false, botDifficulty = null) {
    this.mode = mode;
    this.wager = wager;
    this.isBotGame = isBotGame;
    this.botDifficulty = botDifficulty;
    this.currentTurn = 1;
    this.assignmentPhase = 0;
    this.revealedCard = null;  // NEW - Currently revealed card

    this.player1 = {
        user: player1Data.user,
        deck: player1Data.deck,
        assignments: {},
        unassignedCards: [...player1Data.deck],
        revealedCard: null,  // NEW
        score: 0
    };

    this.player2 = {
        user: player2Data.user,
        deck: player2Data.deck,
        assignments: {},
        unassignedCards: [...player2Data.deck],
        revealedCard: null,  // NEW
        score: 0
    };

    return this;
}

    getRoles() {
        return Object.keys(ROLE_MODIFIERS[this.mode]);
    }

    getAvailableRoles(playerNum) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        const allRoles = this.getRoles();
        return allRoles.filter(role => !player.assignments[role]);
    }

    assignCard(playerNum, role) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        
        // Must have revealed card
        if (!player.revealedCard) {
            throw new Error('No card revealed. Draw a card first.');
        }
        
        const card = player.revealedCard;
        
        // Validation
        if (player.assignments[role]) {
            throw new Error('Role already assigned');
        }

        // Assign
        player.assignments[role] = card;
        player.unassignedCards = player.unassignedCards.filter(c => c.id !== card.id);
        player.revealedCard = null;  // Clear revealed card

        // Switch turns
        this.currentTurn = this.currentTurn === 1 ? 2 : 1;
        
        // Check if both players assigned
        const p1Assigned = Object.keys(this.player1.assignments).length;
        const p2Assigned = Object.keys(this.player2.assignments).length;
        
        if (p1Assigned === p2Assigned) {
            this.assignmentPhase++;
        }

        return {
            nextTurn: this.currentTurn,
            phase: this.assignmentPhase,
            complete: this.assignmentPhase >= 6
        };
    }

    calculateTeamScore(playerNum) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        let totalScore = 0;

        for (const role in player.assignments) {
            const card = player.assignments[role];
            const modifier = ROLE_MODIFIERS[this.mode][role].multiplier;
            const roleScore = Math.round(card.power * modifier);
            totalScore += roleScore;
        }

        player.score = totalScore;
        return totalScore;
    }

    determineWinner() {
        const score1 = this.calculateTeamScore(1);
        const score2 = this.calculateTeamScore(2);

        let winner, loser;
        if (score1 > score2) {
            winner = this.player1;
            loser = this.player2;
        } else if (score2 > score1) {
            winner = this.player2;
            loser = this.player1;
        } else {
            return { tie: true, score1, score2 };
        }

        // Award cards
        const cardsWon = this.selectCardsToWin(loser, this.wager);

        return {
            winner: winner.user,
            loser: loser.user,
            winnerScore: winner.score,
            loserScore: loser.score,
            cardsWon,
            wager: this.wager
        };
    }

    selectCardsToWin(loser, count) {
        // Get unowned cards from loser's deck
        const availableCards = loser.deck.filter(card => 
            !gameState.currentUser.collection.has(card.id)
        );
        
        // Take up to 'count' cards
        return availableCards.slice(0, count);
    }

    // Bot AI for team battle
    botAssignCard() {
        if (!this.isBotGame || this.currentTurn !== 2) return null;

        const availableRoles = this.getAvailableRoles(2);
        const availableCards = this.player2.unassignedCards;

        if (availableRoles.length === 0 || availableCards.length === 0) {
            return null;
        }

        // Bot strategy based on difficulty
        let selectedRole, selectedCard;

        switch (this.botDifficulty) {
            case 'EASY':
                // Random assignment
                selectedRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
                selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)];
                break;

            case 'NORMAL':
                // Assign highest card to best available role
                availableCards.sort((a, b) => b.power - a.power);
                selectedCard = availableCards[0];
                
                // Get best role by multiplier
                availableRoles.sort((a, b) => 
                    ROLE_MODIFIERS[this.mode][b].multiplier - ROLE_MODIFIERS[this.mode][a].multiplier
                );
                selectedRole = availableRoles[0];
                break;

            case 'HARD':
            case 'EXPERT':
            case 'LEGENDARY':
                // Optimal assignment: sort cards and roles, match them
                const sortedCards = [...availableCards].sort((a, b) => b.power - a.power);
                const sortedRoles = [...availableRoles].sort((a, b) => 
                    ROLE_MODIFIERS[this.mode][b].multiplier - ROLE_MODIFIERS[this.mode][a].multiplier
                );
                
                selectedCard = sortedCards[0];
                selectedRole = sortedRoles[0];
                break;

            default:
                selectedRole = availableRoles[0];
                selectedCard = availableCards[0];
        }

        return this.assignCard(2, selectedCard, selectedRole);
    }

    drawCard(playerNum) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        
        if (player.unassignedCards.length === 0) {
            throw new Error('No cards left to draw');
        }
        
        // Draw random card from unassigned
        const randomIndex = Math.floor(Math.random() * player.unassignedCards.length);
        const card = player.unassignedCards[randomIndex];
        player.revealedCard = card;
        
        return card;
    }

    clearRevealedCard(playerNum) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        player.revealedCard = null;
    }

    botDrawAndAssign() {
        if (!this.isBotGame || this.currentTurn !== 2) return null;

        // Draw card
        const card = this.drawCard(2);
        
        const availableRoles = this.getAvailableRoles(2);

        if (availableRoles.length === 0) {
            return null;
        }

        // Bot strategy based on difficulty
        let selectedRole;

        switch (this.botDifficulty) {
            case 'EASY':
                // Random role
                selectedRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
                break;

            case 'NORMAL':
                // Get best role by multiplier
                availableRoles.sort((a, b) => 
                    ROLE_MODIFIERS[this.mode][b].multiplier - ROLE_MODIFIERS[this.mode][a].multiplier
                );
                selectedRole = availableRoles[0];
                break;

            case 'HARD':
            case 'EXPERT':
            case 'LEGENDARY':
                // Optimal: match high power to high multiplier
                const sortedRoles = [...availableRoles].sort((a, b) => 
                    ROLE_MODIFIERS[this.mode][b].multiplier - ROLE_MODIFIERS[this.mode][a].multiplier
                );
                
                // Check card power and assign to appropriate role
                const cardPowerRank = card.power >= 80 ? 0 : card.power >= 60 ? 1 : 2;
                selectedRole = sortedRoles[Math.min(cardPowerRank, sortedRoles.length - 1)];
                break;

            default:
                selectedRole = availableRoles[0];
        }

        return this.assignCard(2, selectedRole);
    }
}

// Team Battle Manager for GameState integration
class TeamBattleManager {
    constructor() {
        this.currentGame = null;
    }

    canStartTeamBattle(user) {
        // Need at least 6 cards
        return user.collection.size >= 6;
    }

    createTeamDeck(user, size = 6) {
        const userCards = Array.from(user.collection).map(id => 
            CARD_DATABASE.find(card => card.id === id)
        );

        if (userCards.length < size) {
            throw new Error(`Need at least ${size} cards to play team battle`);
        }

        // Randomly select cards from collection
        const shuffled = userCards.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, size);
    }

    createBotTeamDeck(difficulty, size = 6) {
        const botConfig = BOT_DIFFICULTIES[difficulty];
        const availableCards = CardRaritySystem.getAvailablePool().filter(card =>
            botConfig.rarities.includes(card.rarity)
        );

        if (availableCards.length < size) {
            throw new Error(`Not enough cards for ${difficulty} bot`);
        }

        const shuffled = availableCards.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, size);
    }

    startBotTeamBattle(user, mode, wager, difficulty) {
        const playerDeck = this.createTeamDeck(user);
        const botDeck = this.createBotTeamDeck(difficulty);
        const botUser = BotManager.createBot(difficulty);

        this.currentGame = new TeamBattleGame();
        this.currentGame.startGame(
            { user, deck: playerDeck },
            { user: botUser, deck: botDeck },
            mode,
            wager,
            true,
            difficulty
        );

        return this.currentGame;
    }

    endTeamBattle(result) {
        if (result.tie) {
            return { tie: true, ...result };
        }

        // Update user stats
        if (result.winner.username === gameState.currentUser.username) {
            gameState.currentUser.wins++;
            
            // Add won cards
            result.cardsWon.forEach(card => {
                gameState.currentUser.collection.add(card.id);
            });
        } else {
            gameState.currentUser.losses++;
        }

        gameState.saveUser(gameState.currentUser);

        return {
            winner: result.winner,
            loser: result.loser,
            winnerScore: result.winnerScore,
            loserScore: result.loserScore,
            cardsWon: result.cardsWon,
            wager: result.wager
        };
    }
}

// Global instance
const teamBattleManager = new TeamBattleManager();
