// points-system.js - Comprehensive point earning and card shop system

const POINTS_SYSTEM = {
    // Base points for game outcomes
    BASE_POINTS: {
        DUEL_WIN: 10,
        DUEL_LOSS: 2,
        DRAFT_WAR_WIN: 25,
        DRAFT_WAR_LOSS: 5,
        TIE: 5
    },
    
    // Performance grade multipliers (based on score differential)
    PERFORMANCE_GRADES: {
        SSS: { multiplier: 3.0, threshold: 0.8 },    // Won 80%+ of rounds
        SS: { multiplier: 2.5, threshold: 0.7 },     // Won 70%+ of rounds
        S: { multiplier: 2.0, threshold: 0.6 },      // Won 60%+ of rounds
        A: { multiplier: 1.5, threshold: 0.5 },      // Won 50%+ of rounds
        B: { multiplier: 1.2, threshold: 0.4 },      // Won 40%+ of rounds
        C: { multiplier: 1.0, threshold: 0.3 },      // Won 30%+ of rounds
        D: { multiplier: 0.8, threshold: 0.2 },      // Won 20%+ of rounds
        F: { multiplier: 0.5, threshold: 0 }         // Won less than 20% of rounds
    },
    
    // Card shop prices (in points)
    CARD_PRICES: {
        SSS: 1000,   // 100 duel wins (10 pts each)
        SS: 600,     // 60 duel wins
        S: 350,      // 35 duel wins
        A: 180,      // 18 duel wins
        B: 80,       // 8 duel wins
        C: 40,       // 4 duel wins
        D: 20,       // 2 duel wins
        F: 10        // 1 duel win
    },
    
    // Bonus multipliers for streaks
    STREAK_BONUS: {
        3: 1.1,   // 10% bonus at 3 win streak
        5: 1.25,  // 25% bonus at 5 win streak
        10: 1.5,  // 50% bonus at 10 win streak
        20: 2.0   // 100% bonus at 20 win streak
    },
    
    // Random variance to add excitement (±10%)
    VARIANCE: 0.1
};

class PointsManager {
    constructor() {
        this.userPoints = this.loadPoints();
        this.userStreaks = this.loadStreaks();
    }
    
    // Calculate points earned from a duel
    calculateDuelPoints(result) {
        const { winner, loser, player1Score, player2Score, maxRounds, isPlayerWinner } = result;
        
        if (!isPlayerWinner && !result.isPlayerLoser) {
            // Tie
            return {
                points: POINTS_SYSTEM.BASE_POINTS.TIE,
                grade: 'C',
                breakdown: {
                    base: POINTS_SYSTEM.BASE_POINTS.TIE,
                    performance: 1.0,
                    streak: 1.0,
                    variance: 1.0,
                    total: POINTS_SYSTEM.BASE_POINTS.TIE
                }
            };
        }
        
        const isWin = isPlayerWinner;
        const playerScore = isWin ? player1Score : player2Score;
        const basePoints = isWin ? POINTS_SYSTEM.BASE_POINTS.DUEL_WIN : POINTS_SYSTEM.BASE_POINTS.DUEL_LOSS;
        
        // Calculate performance grade based on win rate
        const winRate = playerScore / maxRounds;
        const grade = this.getPerformanceGrade(winRate);
        const gradeMultiplier = POINTS_SYSTEM.PERFORMANCE_GRADES[grade].multiplier;
        
        // Get streak bonus
        const streak = this.userStreaks[winner.username] || 0;
        const streakMultiplier = this.getStreakMultiplier(streak);
        
        // Add random variance
        const variance = 1 + (Math.random() * POINTS_SYSTEM.VARIANCE * 2 - POINTS_SYSTEM.VARIANCE);
        
        // Calculate total points
        const totalPoints = Math.round(basePoints * gradeMultiplier * streakMultiplier * variance);
        
        return {
            points: totalPoints,
            grade: grade,
            breakdown: {
                base: basePoints,
                performance: gradeMultiplier,
                streak: streakMultiplier,
                variance: variance,
                total: totalPoints
            }
        };
    }
    
    // Calculate points earned from draft war
    calculateDraftWarPoints(result) {
        const { winner, loser, winnerScore, loserScore, isPlayerWinner } = result;
        
        if (result.tie) {
            return {
                points: POINTS_SYSTEM.BASE_POINTS.TIE * 2, // Double for draft war
                grade: 'C',
                breakdown: {
                    base: POINTS_SYSTEM.BASE_POINTS.TIE * 2,
                    performance: 1.0,
                    streak: 1.0,
                    variance: 1.0,
                    total: POINTS_SYSTEM.BASE_POINTS.TIE * 2
                }
            };
        }
        
        const isWin = isPlayerWinner;
        const playerScore = isWin ? winnerScore : loserScore;
        const opponentScore = isWin ? loserScore : winnerScore;
        const totalScore = playerScore + opponentScore;
        
        const basePoints = isWin ? POINTS_SYSTEM.BASE_POINTS.DRAFT_WAR_WIN : POINTS_SYSTEM.BASE_POINTS.DRAFT_WAR_LOSS;
        
        // Calculate performance grade based on score differential
        const scoreDifferential = totalScore > 0 ? playerScore / totalScore : 0.5;
        const grade = this.getPerformanceGrade(scoreDifferential);
        const gradeMultiplier = POINTS_SYSTEM.PERFORMANCE_GRADES[grade].multiplier;
        
        // Get streak bonus
        const streak = this.userStreaks[winner.username] || 0;
        const streakMultiplier = this.getStreakMultiplier(streak);
        
        // Add random variance
        const variance = 1 + (Math.random() * POINTS_SYSTEM.VARIANCE * 2 - POINTS_SYSTEM.VARIANCE);
        
        // Calculate total points
        const totalPoints = Math.round(basePoints * gradeMultiplier * streakMultiplier * variance);
        
        return {
            points: totalPoints,
            grade: grade,
            breakdown: {
                base: basePoints,
                performance: gradeMultiplier,
                streak: streakMultiplier,
                variance: variance,
                total: totalPoints
            }
        };
    }
    
    // Determine performance grade based on score ratio
    getPerformanceGrade(ratio) {
        const grades = POINTS_SYSTEM.PERFORMANCE_GRADES;
        
        if (ratio >= grades.SSS.threshold) return 'SSS';
        if (ratio >= grades.SS.threshold) return 'SS';
        if (ratio >= grades.S.threshold) return 'S';
        if (ratio >= grades.A.threshold) return 'A';
        if (ratio >= grades.B.threshold) return 'B';
        if (ratio >= grades.C.threshold) return 'C';
        if (ratio >= grades.D.threshold) return 'D';
        return 'F';
    }
    
    // Get streak multiplier
    getStreakMultiplier(streak) {
        if (streak >= 20) return POINTS_SYSTEM.STREAK_BONUS[20];
        if (streak >= 10) return POINTS_SYSTEM.STREAK_BONUS[10];
        if (streak >= 5) return POINTS_SYSTEM.STREAK_BONUS[5];
        if (streak >= 3) return POINTS_SYSTEM.STREAK_BONUS[3];
        return 1.0;
    }
    
    // Award points to user
    awardPoints(username, points) {
        if (!this.userPoints[username]) {
            this.userPoints[username] = 0;
        }
        this.userPoints[username] += points;
        this.savePoints();
        return this.userPoints[username];
    }
    
    // Get user points
    getPoints(username) {
        return this.userPoints[username] || 0;
    }
    
    // Update win streak
    updateStreak(username, isWin) {
        if (!this.userStreaks[username]) {
            this.userStreaks[username] = 0;
        }
        
        if (isWin) {
            this.userStreaks[username]++;
        } else {
            this.userStreaks[username] = 0;
        }
        
        this.saveStreaks();
        return this.userStreaks[username];
    }
    
    // Get user streak
    getStreak(username) {
        return this.userStreaks[username] || 0;
    }
    
    // Purchase card with points
    purchaseCard(username, rarity, userCollection, userUnlockedArcs = null) {
        const price = POINTS_SYSTEM.CARD_PRICES[rarity];
        const userPoints = this.getPoints(username);
        
        if (userPoints < price) {
            return {
                success: false,
                message: `Not enough points! Need ${price}, have ${userPoints}`
            };
        }
        
        // Deduct points
        this.userPoints[username] -= price;
        this.savePoints();
        
        // Get random card of that rarity EXCLUDING cards user already owns
        // AND only from unlocked arcs
        const availableCards = CARD_DATABASE.filter(card => {
            if (card.rarity !== rarity || !card.available) return false;
            if (ARC_AVAILABILITY[card.arc] !== true) return false;
            if (userCollection.has(card.id)) return false;
            // If unlocked arcs provided, check if card's arc is unlocked
            if (userUnlockedArcs && !userUnlockedArcs.has(card.arc)) return false;
            return true;
        });
        
        if (availableCards.length === 0) {
            // Refund if no cards available
            this.userPoints[username] += price;
            this.savePoints();
            return {
                success: false,
                message: `No new ${rarity} rarity cards available from your unlocked arcs!`
            };
        }
        
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        
        return {
            success: true,
            card: randomCard,
            pointsRemaining: this.userPoints[username]
        };
    }
    
    // Get all cards available for purchase
    getShopInventory() {
        const inventory = {};
        
        for (const rarity in POINTS_SYSTEM.CARD_PRICES) {
            const availableCards = CARD_DATABASE.filter(card => 
                card.rarity === rarity && 
                ARC_AVAILABILITY[card.arc] === true && 
                card.available
            );
            
            inventory[rarity] = {
                price: POINTS_SYSTEM.CARD_PRICES[rarity],
                available: availableCards.length,
                color: RARITY_TIERS[rarity].color,
                label: RARITY_TIERS[rarity].label
            };
        }
        
        return inventory;
    }

    // Spend points for arc unlocks or other purchases
    spendPoints(username, amount) {
        const userPoints = this.getPoints(username);
        
        if (userPoints < amount) {
            return null;
        }
        
        this.userPoints[username] -= amount;
        this.savePoints();
        
        return this.userPoints[username];
    }
    
    // Save points to localStorage
    savePoints() {
        localStorage.setItem('userPoints', JSON.stringify(this.userPoints));
    }
    
    // Load points from localStorage
    loadPoints() {
        const saved = localStorage.getItem('userPoints');
        return saved ? JSON.parse(saved) : {};
    }
    
    // Save streaks to localStorage
    saveStreaks() {
        localStorage.setItem('userStreaks', JSON.stringify(this.userStreaks));
    }
    
    // Load streaks from localStorage
    loadStreaks() {
        const saved = localStorage.getItem('userStreaks');
        return saved ? JSON.parse(saved) : {};
    }
}

// Initialize global points manager
const pointsManager = new PointsManager();
