// Draft War Game Mode
// Davy Back Fight & Classic Pirate modes

const ROLE_MODIFIERS = {
    CLASSIC_PIRATE: {
        captain: { multiplier: 2.0, name: "Captain", description: "Leader of the crew" },
        viceCaptain: { multiplier: 1.5, name: "Vice-Captain", description: "Second in command" },
        tank: { multiplier: 1.3, name: "Tank", description: "Defensive powerhouse" },
        healer: { multiplier: 1.2, name: "Healer", description: "Keeps the crew alive" },
        support1: { multiplier: 1.1, name: "Support", description: "Team supporter" },
        support2: { multiplier: 1.1, name: "Support", description: "Team supporter" }
    },
    DAVY_BACK: {
        captain: { multiplier: 2.0, name: "Captain", description: "Leader of the crew" },
        viceCaptain: { multiplier: 1.5, name: "Vice-Captain", description: "Second in command" },
        tank: { multiplier: 1.3, name: "Tank", description: "Defensive powerhouse" },
        healer: { multiplier: 1.2, name: "Healer", description: "Keeps the crew alive" },
        support: { multiplier: 1.1, name: "Support", description: "Team supporter" },
        traitor: { multiplier: -0.5, name: "Traitor", description: "⚠️ Sabotages your team!" }
    }
};

class DraftWarGame {
    constructor() {
        this.mode = null; // 'DAVY_BACK' or 'CLASSIC_PIRATE'
        this.wager = 1; // Number of cards to bet
        this.player1 = null;
        this.player2 = null;
        this.currentTurn = 1; // Which player's turn to assign
        this.assignmentPhase = 0; // 0-5 for 6 assignments
        this.isBotGame = false;
        this.botDifficulty = null;
        this.player1Skips = 0;  // Track skips used
        this.player2Skips = 0;
        this.maxSkips = 1;  // Max skips allowed per player
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

    this.player1Skips = 0;
    this.player2Skips = 0;

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

    // Calculate score for a single card in a role (with type bonuses)
    calculateRoleScore(card, role) {
        const modifier = ROLE_MODIFIERS[this.mode][role].multiplier;
        let finalModifier = modifier;
        
        // Apply type bonus if enabled
        if (typeof DEV_CONFIG !== 'undefined' && DEV_CONFIG.GAME.TEAM_BATTLE_TYPE_BONUS && card.type) {
            const typeInfo = CHARACTER_TYPES[card.type];
            if (typeInfo) {
                finalModifier *= typeInfo.bonus;
                
                // Check for synergy
                if (ROLE_TYPE_SYNERGY[role] && ROLE_TYPE_SYNERGY[role].includes(card.type)) {
                    finalModifier *= SYNERGY_BONUS;
                }
            }
        }
        
        return Math.round(card.power * finalModifier);
    }
    
    // Get type bonus info for display (returns object with bonus details)
    getTypeBonusInfo(card, role) {
        if (!card.type) return null;
        
        const typeInfo = CHARACTER_TYPES[card.type];
        if (!typeInfo) return null;
        
        const hasSynergy = ROLE_TYPE_SYNERGY[role] && ROLE_TYPE_SYNERGY[role].includes(card.type);
        const totalBonus = typeInfo.bonus * (hasSynergy ? SYNERGY_BONUS : 1.0);
        
        return {
            type: typeInfo.name,
            icon: typeInfo.icon,
            color: typeInfo.color,
            baseBonus: typeInfo.bonus,
            hasSynergy: hasSynergy,
            totalBonus: totalBonus,
            synergyBonus: SYNERGY_BONUS
        };
    }

    calculateTeamScore(playerNum) {
        const player = playerNum === 1 ? this.player1 : this.player2;
        let totalScore = 0;
        
        if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
            console.log(`\n=== Calculating Score for Player ${playerNum} ===`);
        }
        
        for (const role in player.assignments) {
            const card = player.assignments[role];
            if (!card) continue;
            
            const roleInfo = ROLE_MODIFIERS[this.mode][role];
            let roleModifier = roleInfo.multiplier;
            let finalModifier = roleModifier;
            let typeBonus = 1;
            let synergyBonus = 1;
            
            if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
                console.log(`\n🎴 ${card.name} in ${roleInfo.name}:`);
                console.log(`  Base Power: ${card.power}`);
                console.log(`  Role Multiplier: ${roleModifier}x`);
            }
            
            // Apply type bonus if enabled
            if (DEV_CONFIG.GAME.TEAM_BATTLE_TYPE_BONUS && card.type) {
                typeBonus = CHARACTER_TYPES[card.type]?.bonus || 1;

                if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
                    console.log(`  Card Type: ${card.type}`);
                    console.log(`  Type Bonus: ${typeBonus}x`);
                }
                
                finalModifier *= typeBonus;
                
                // Check for synergy bonus
                if (ROLE_TYPE_SYNERGY[role]?.includes(card.type)) {
                    synergyBonus = SYNERGY_BONUS;
                    finalModifier *= synergyBonus;
                    if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
                        console.log(`  ⚡ SYNERGY BONUS: ${synergyBonus}x (${card.type} matches ${role}!)`);
                    }
                }
            } else {

                if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
                    console.log(`  Type Bonus: DISABLED or no type on card`);
                }
            }
            
            const roleScore = Math.floor(card.power * finalModifier);
            if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
                console.log(`  Final Multiplier: ${finalModifier}x`);
                console.log(`  Final Score: ${roleScore}`);
            }
            
            totalScore += roleScore;
        }
        if (DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
            console.log(`\n📊 Player ${playerNum} Total Score: ${totalScore}\n`);
        }
        
        return totalScore;
    }

    determineWinner() {
        const score1 = this.calculateTeamScore(1);
        const score2 = this.calculateTeamScore(2);

        this.player1.score = score1;
        this.player2.score = score2;

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
            winnerScore: score1,
            loserScore: score2,
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

    // Bot AI for draft war
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

    canSkip(playerNum) {
        const skipsUsed = playerNum === 1 ? this.player1Skips : this.player2Skips;
        return this.mode === 'CLASSIC_PIRATE' && skipsUsed < this.maxSkips;
    }

    skipTurn(playerNum) {
        if (!this.canSkip(playerNum)) {
            throw new Error('Cannot skip - no skips remaining or not available in this mode');
        }
        
        const player = playerNum === 1 ? this.player1 : this.player2;
        
        // Clear revealed card (put it back)
        if (player.revealedCard) {
            player.revealedCard = null;
        }
        
        // Increment skip counter
        if (playerNum === 1) {
            this.player1Skips++;
        } else {
            this.player2Skips++;
        }
        
        // Switch turns
        this.currentTurn = this.currentTurn === 1 ? 2 : 1;
        
        // Check if both players have same number of assignments
        const p1Assigned = Object.keys(this.player1.assignments).length;
        const p2Assigned = Object.keys(this.player2.assignments).length;
        
        // If assignments are unequal, we're in catch-up phase
        if (p1Assigned !== p2Assigned) {
            // Don't increment phase, let the other player catch up
            return {
                nextTurn: this.currentTurn,
                phase: this.assignmentPhase,
                complete: this.assignmentPhase >= 6,
                skipped: true
            };
        } else {
            // Both have same assignments, phase complete
            this.assignmentPhase++;
            return {
                nextTurn: this.currentTurn,
                phase: this.assignmentPhase,
                complete: this.assignmentPhase >= 6,
                skipped: true
            };
        }
    }

    serializeState() {
        return {
            mode: this.mode,
            wager: this.wager,
            currentTurn: this.currentTurn,
            assignmentPhase: this.assignmentPhase,
            player1: {
                username: this.player1.user.username,
                assignments: this.player1.assignments,
                revealedCard: this.player1.revealedCard,
                score: this.player1.score
            },
            player2: {
                username: this.player2.user.username,
                assignments: this.player2.assignments,
                revealedCard: this.player2.revealedCard,
                score: this.player2.score
            }
        };
    }
}

// Draft War Manager for GameState integration
class DraftWarManager {
    constructor() {
        this.currentGame = null;
    }

    canStartDraftWar(user) {
        // Need at least 6 cards
        return user.collection.size >= 6;
    }

    createTeamDeck(user, size = 6) {
        const userCards = Array.from(user.collection).map(id => 
            CARD_DATABASE.find(card => card.id === id)
        );

        if (userCards.length < size) {
            throw new Error(`Need at least ${size} cards to play draft war`);
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

    startBotDraftWar(user, mode, wager, difficulty) {
        const playerDeck = this.createTeamDeck(user);
        const botDeck = this.createBotTeamDeck(difficulty);
        const botUser = BotManager.createBot(difficulty);

        this.currentGame = new DraftWarGame();
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

    startP2PDraftWar(hostUser, guestUser, hostDeck, guestDeck, mode, wager, isHost) {
        this.currentGame = new DraftWarGame();
        this.currentGame.startGame(
            { user: isHost ? hostUser : guestUser, deck: isHost ? hostDeck : guestDeck },
            { user: isHost ? guestUser : hostUser, deck: isHost ? guestDeck : hostDeck },
            mode,
            wager,
            false, // Not bot game
            null
        );
        
        if (!isHost) {
            this.currentGame.currentTurn = 2;
        }
        return this.currentGame;
    }

    endDraftWar(result) {
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
const draftWarManager = new DraftWarManager();
