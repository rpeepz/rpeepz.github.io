// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const loginScreen = document.getElementById('login-screen');
    const lobbyScreen = document.getElementById('lobby-screen');
    const collectionScreen = document.getElementById('collection-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const draftWarSelectScreen = document.getElementById('draft-war-select-screen');
    const draftWarWagerScreen = document.getElementById('draft-war-wager-screen');
    const draftWarGameScreen = document.getElementById('draft-war-game-screen');
    const draftWarResultsScreen = document.getElementById('draft-war-results-screen');
    const shopScreen = document.getElementById('shop-screen');

    // Login screen elements
    const guestBtn = document.getElementById('guest-btn');
    const createProfileBtn = document.getElementById('create-profile-btn');
    const loginBtn = document.getElementById('login-btn');
    const profileForm = document.getElementById('profile-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const submitProfileBtn = document.getElementById('submit-profile-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Lobby screen elements
    const playerNameSpan = document.getElementById('player-name');
    const winsSpan = document.getElementById('wins');
    const lossesSpan = document.getElementById('losses');
    const cardsCollectedSpan = document.getElementById('cards-collected');
    const logoutBtn = document.getElementById('logout-btn');
    const hostGameBtn = document.getElementById('host-game-btn');
    const lobbyCodeDisplay = document.getElementById('lobby-code-display');
    const lobbyCodeSpan = document.getElementById('lobby-code');
    const connectionStatus = document.getElementById('connection-status');
    const joinCodeInput = document.getElementById('join-code-input');
    const joinGameBtn = document.getElementById('join-game-btn');
    const joinStatus = document.getElementById('join-status');
    const viewCollectionBtn = document.getElementById('view-collection-btn');

    // Collection screen elements
    const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
    const sagaFilter = document.getElementById('saga-filter');
    const arcFilter = document.getElementById('arc-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const collectionGrid = document.getElementById('collection-grid');
    
    // Game screen elements
    const player1NameSpan = document.getElementById('player1-name');
    const player2NameSpan = document.getElementById('player2-name');
    const player1CardsSpan = document.getElementById('player1-cards');
    const player2CardsSpan = document.getElementById('player2-cards');
    const player1ScoreSpan = document.getElementById('player1-score');
    const player2ScoreSpan = document.getElementById('player2-score');
    const roundNumberSpan = document.getElementById('round-number');
    const maxRoundsSpan = document.getElementById('max-rounds');const player1CardSlot = document.getElementById('player1-card-slot');
    const player2CardSlot = document.getElementById('player2-card-slot');
    const playCardBtn = document.getElementById('play-card-btn');
    const concedeBtn = document.getElementById('concede-btn');
    const waitingMessage = document.getElementById('waiting-message');
    const resultDisplay = document.getElementById('result-display');
    const resultText = document.getElementById('result-text');
    const continueBtn = document.getElementById('continue-btn');

    // Add admin button to lobby screen (add this in HTML near view-collection-btn)
    const viewAdminBtn = document.getElementById('view-admin-btn');
    const adminScreen = document.getElementById('admin-screen');
    const backToLobbyAdminBtn = document.getElementById('back-to-lobby-admin-btn');
    
    viewAdminBtn?.addEventListener('click', () => {
        showAdmin();
    });

    backToLobbyAdminBtn?.addEventListener('click', () => {
        showLobby();
    });

    // Game over screen elements
    const gameoverResult = document.getElementById('gameover-result');
    const gameoverStats = document.getElementById('gameover-stats');
    const cardsWonDisplay = document.getElementById('cards-won-display');
    const cardsWonGrid = document.getElementById('cards-won-grid');
    const returnLobbyBtn = document.getElementById('return-lobby-btn');

    // Check for lobby code in URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const lobbyCodeFromUrl = urlParams.get('lobby') || urlParams.get('code') || urlParams.get('join');
    const tbLobbyCodeFromUrl = urlParams.get('tblobby') || urlParams.get('teamlobby');

    // Store it to use after login
    let pendingLobbyCode = lobbyCodeFromUrl;
    let pendingTBLobbyCode = tbLobbyCodeFromUrl;
    let currentFormMode = null;
    let hasPlayedThisRound = false;

    // Initialize music only if enabled
    if (DEV_CONFIG.FEATURES.MUSIC_PLAYER) {
        musicManager.initialize();
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        themeText.textContent = isDark ? 'Light' : 'Dark';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Music control handlers - only add if music player is enabled
    if (DEV_CONFIG.FEATURES.MUSIC_PLAYER) {
        document.getElementById('volume-full')?.addEventListener('click', () => {
            musicManager.unmute();
            musicManager.setVolume(1.0);
            document.querySelectorAll('.volume-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('volume-full').classList.add('active');
        });

        document.getElementById('volume-half')?.addEventListener('click', () => {
            musicManager.unmute();
            musicManager.setVolume(0.2);
            document.querySelectorAll('.volume-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('volume-half').classList.add('active');
        });

        document.getElementById('volume-mute')?.addEventListener('click', () => {
            musicManager.mute();
            document.querySelectorAll('.volume-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('volume-mute').classList.add('active');
        });

        // Music control close button
        document.getElementById('music-control-close')?.addEventListener('click', () => {
            const musicControl = document.getElementById('music-control');
            musicControl.style.display = 'none';
            localStorage.setItem('musicControlDismissed', 'true');
            
            // Show the "Show Music Player" button
            const showMusicBtn = document.getElementById('show-music-btn');
            if (showMusicBtn) showMusicBtn.classList.remove('hidden');
        });

        // Show music control button
        document.getElementById('show-music-btn')?.addEventListener('click', () => {
            const musicControl = document.getElementById('music-control');
            musicControl.style.display = '';
            localStorage.setItem('musicControlDismissed', 'false');
            
            // Hide the button again
            document.getElementById('show-music-btn').classList.add('hidden');
        });

        // Check if music control was previously dismissed
        if (localStorage.getItem('musicControlDismissed') === 'true') {
            const musicControl = document.getElementById('music-control');
            if (musicControl) musicControl.style.display = 'none';
            
            // Show the "Show Music Player" button
            const showMusicBtn = document.getElementById('show-music-btn');
            if (showMusicBtn) showMusicBtn.classList.remove('hidden');
        }
    }

    // Helper to calculate total enabled cards based on dev config
    function getTotalEnabledCards() {
        return CARD_DATABASE.filter(card => 
            ARC_AVAILABILITY[card.arc] === true && card.available
        ).length;
    }

    // Admin panel functions
    function showAdmin() {
        showScreen(adminScreen);
        renderAdminPanel();
    }

    function renderAdminPanel() {
        // Render arc toggles
        const arcToggles = document.getElementById('arc-toggles');
        arcToggles.innerHTML = '';
        
        ARCS.forEach(arc => {
            const toggle = document.createElement('div');
            toggle.className = 'arc-toggle';
            toggle.innerHTML = `
                <label for="arc-${arc}">${arc}</label>
                <input type="checkbox" id="arc-${arc}" ${ARC_AVAILABILITY[arc] ? 'checked' : ''}>
            `;
            
            const checkbox = toggle.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                ARC_AVAILABILITY[arc] = e.target.checked;
                updatePoolStats();
                saveArcAvailability();
            });
            
            arcToggles.appendChild(toggle);
        });
        
        // Render rarity stats
        renderRarityStats();
        
        // Update pool stats
        updatePoolStats();
        
        // Test deck button
        document.getElementById('test-deck-btn').addEventListener('click', generateTestDeck);
    
        // Setup points granter
        setupPointsGranter();
        
        // Setup win simulator
        initWinSimulator();
    }

    // Points Granter functionality (dev feature)
    let pointsMultiplier = 1;

    function setupPointsGranter() {
        if (!DEV_CONFIG.DEBUG.POINTS_GRANTER) return;
        
        // Show the points granter section
        const granterSection = document.getElementById('points-granter-section');
        if (granterSection) {
            granterSection.style.display = 'block';
        }
        
        const minusBtn = document.getElementById('points-minus-btn');
        const plusBtn = document.getElementById('points-plus-btn');
        const grantBtn = document.getElementById('grant-points-btn');
        const multiplierSpan = document.getElementById('points-multiplier');
        const grantValueSpan = document.getElementById('points-grant-value');
        const balanceSpan = document.getElementById('current-points-balance');
        
        // Update display
        function updatePointsGranterDisplay() {
            multiplierSpan.textContent = pointsMultiplier;
            grantValueSpan.textContent = pointsMultiplier * 10;
            if (gameState.currentUser) {
                const currentPoints = pointsManager.getPoints(gameState.currentUser.username);
                balanceSpan.textContent = currentPoints;
            }
        }
        
        // Minus button
        minusBtn?.addEventListener('click', () => {
            if (pointsMultiplier > 0) {
                pointsMultiplier--;
                updatePointsGranterDisplay();
            }
        });
        
        // Plus button
        plusBtn?.addEventListener('click', () => {
            pointsMultiplier++;
            updatePointsGranterDisplay();
        });
        
        // Grant points button
        grantBtn?.addEventListener('click', () => {
            if (!gameState.currentUser) {
                alert('No user logged in!');
                return;
            }
            
            const pointsToGrant = pointsMultiplier * 10;
            const username = gameState.currentUser.username;
            const newTotal = pointsManager.awardPoints(username, pointsToGrant);
            
            alert(`✅ Granted ${pointsToGrant} points!\n\nNew balance: ${newTotal} pts`);
            updatePointsGranterDisplay();
            
            // Update lobby stats if visible
            const userPointsSpan = document.getElementById('user-points');
            if (userPointsSpan) {
                userPointsSpan.textContent = newTotal;
            }
        });
        
        // Initial display update
        updatePointsGranterDisplay();
    }

    // Win Simulator functionality
    function initWinSimulator() {
        const simulateWinBtn = document.getElementById('simulate-win-btn');
        const simulate5WinsBtn = document.getElementById('simulate-5-wins-btn');
        const simulate10WinsBtn = document.getElementById('simulate-10-wins-btn');
        const winsCountSpan = document.getElementById('current-wins-count');
        
        function updateWinsDisplay() {
            if (gameState.currentUser) {
                winsCountSpan.textContent = gameState.currentUser.wins;
            }
        }
        
        function simulateWins(amount) {
            if (!gameState.currentUser) {
                alert('No user logged in!');
                return;
            }
            
            // Add wins
            gameState.currentUser.wins += amount;
            
            // Check for arc progression
            const newlyUnlocked = gameState.checkArcProgression(gameState.currentUser);
            
            // Save user
            gameState.saveUser(gameState.currentUser);
            
            // Show notification
            let message = `✅ Added ${amount} win${amount > 1 ? 's' : ''}!\n\nTotal Wins: ${gameState.currentUser.wins}`;
            
            if (newlyUnlocked && newlyUnlocked.length > 0) {
                message += `\n\n🎊 NEW ARC${newlyUnlocked.length > 1 ? 'S' : ''} UNLOCKED! 🎊\n`;
                newlyUnlocked.forEach(arc => {
                    message += `\n🏝️ ${arc}`;
                });
                message += `\n\nNew cards are now available!`;
            }
            
            alert(message);
            updateWinsDisplay();
            
            // Update lobby stats if visible
            const winsSpan = document.getElementById('wins');
            if (winsSpan) {
                winsSpan.textContent = gameState.currentUser.wins;
            }
            
            const arcsUnlockedSpan = document.getElementById('arcs-unlocked');
            if (arcsUnlockedSpan) {
                arcsUnlockedSpan.textContent = gameState.currentUser.unlockedArcs.size;
            }
        }
        
        simulateWinBtn?.addEventListener('click', () => simulateWins(1));
        simulate5WinsBtn?.addEventListener('click', () => simulateWins(5));
        simulate10WinsBtn?.addEventListener('click', () => simulateWins(10));
        
        // Initial display update
        updateWinsDisplay();
    }

    function renderRarityStats() {
        const rarityStats = document.getElementById('rarity-stats');
        rarityStats.innerHTML = '';
        
        Object.entries(RARITY_TIERS).forEach(([rarity, info]) => {
            const cards = CardRaritySystem.getCardsByRarity(rarity);
            const chance = CardRaritySystem.getDropChance(rarity);
            
            const stat = document.createElement('div');
            stat.className = 'rarity-stat';
            stat.style.borderLeftColor = info.color;
            stat.innerHTML = `
                <div class="rarity-label" style="color: ${info.color}">${info.label}</div>
                <div class="rarity-count">${cards.length} cards</div>
                <div class="rarity-chance">${chance}% drop rate</div>
            `;
            
            rarityStats.appendChild(stat);
        });
    }

    function updatePoolStats() {
        const availablePool = CardRaritySystem.getAvailablePool();
        const activeArcs = ARCS.filter(arc => ARC_AVAILABILITY[arc]).length;
        
        document.getElementById('total-cards').textContent = CARD_DATABASE.length;
        document.getElementById('available-cards').textContent = availablePool.length;
        document.getElementById('active-arcs').textContent = activeArcs;
    }

    function generateTestDeck() {
        const deck = CardRaritySystem.generateStarterDeck();
        const display = document.getElementById('test-deck-display');
        display.innerHTML = '';
        
        deck.forEach(card => {
            const rarityInfo = CardRaritySystem.getRarityInfo(card.rarity);
            const cardEl = document.createElement('div');
            cardEl.className = 'test-card';
            
            // Get character image
            const img = CHARACTER_IMAGES[card.name] || '';
            const imgHTML = img ? `<img src="${img}" alt="${card.name}" style="width: 100%; height: 150px; object-fit: fill; border-radius: 8px; margin-bottom: 8px;">` : '';
            
            cardEl.innerHTML = `
                ${imgHTML}
                <div class="card-name">${card.name}</div>
                <div class="card-power">⚔️ ${card.power}</div>
                <div class="card-rarity" style="background-color: ${rarityInfo.color}">${card.rarity}</div>
            `;
            display.appendChild(cardEl);
        });
    }

    function saveArcAvailability() {
        localStorage.setItem('arcAvailability', JSON.stringify(ARC_AVAILABILITY));
    }

    function loadArcAvailability() {
        // if (DEV_CONFIG.DEBUG.UNLIMITED_CARDS) {
        //     // Skip localStorage, use dev-config only
        //     return;
        // }

        const saved = localStorage.getItem('arcAvailability');
        if (saved) {
            const savedState = JSON.parse(saved);
            Object.assign(ARC_AVAILABILITY, savedState);
        }
    }

    // Load arc availability on startup
    loadArcAvailability();

    // Setup P2P message handlers
    gameState.p2p.onMessage = (data) => {
        console.log('Message received:', data);
        
        switch(data.type) {
            case 'join':
                // Guest has joined
                gameState.opponentData = {
                    username: data.username,
                    collection: new Set(data.collection)
                };
                connectionStatus.textContent = `${data.username} joined! Starting game...`;
                connectionStatus.className = 'connection-status connected';
                
                // Host creates decks and starts game
                setTimeout(() => {
                    const hostDeck = gameState.createDeck(gameState.currentUser, DEV_CONFIG.GAME.DECK_SIZE || 5);
                    const guestDeck = gameState.createDeck(gameState.opponentData, DEV_CONFIG.GAME.DECK_SIZE || 5);
                    // Send game start to guest
                    gameState.p2p.send({
                        type: 'gameStart',
                        hostDeck: hostDeck,
                        guestDeck: guestDeck,
                        hostUsername: gameState.currentUser.username
                    });
                    
                    gameState.startGame(hostDeck, guestDeck);
                    startGameSession();
                }, 1000);
                break;
                
            case 'gameStart':
                // Guest receives game start
                gameState.opponentData = {
                    username: data.hostUsername,
                    collection: new Set()
                };
                gameState.startGame(data.hostDeck, data.guestDeck);
                startGameSession();
                break;
                
            case 'cardPlayed':
                // Opponent played a card
                if (data.isPlayer1) {
                    gameState.currentGame.player1Card = data.card;
                    gameState.currentGame.player1Played = true;
                } else {
                    gameState.currentGame.player2Card = data.card;
                    gameState.currentGame.player2Played = true;
                }
                
                // Check if both played
                if (gameState.checkBothPlayed()) {
                    waitingMessage.classList.add('hidden');
                    showBothCards();
                }
                break;
                
            case 'concede':
                // Opponent conceded
                const result = { winner: gameState.isHost ? 1 : 2, loser: gameState.isHost ? 2 : 1, conceded: true };
                endGameSession(result);
                break;

            case 'tbJoin':
                // Guest joining draft war
                gameState.opponentData = {
                    username: data.username,
                    collection: new Set(data.collection)
                };
                connectionStatus.textContent = `${data.username} joined Draft War! Starting...`;
                connectionStatus.className = 'connection-status connected';
                
                setTimeout(() => {
                    const hostDeck = draftWarManager.createTeamDeck(gameState.currentUser);
                    const guestDeck = draftWarManager.createTeamDeck(gameState.opponentData);
                    
                    gameState.p2p.send({
                        type: 'tbGameStart',
                        hostDeck: hostDeck,
                        guestDeck: guestDeck,
                        hostUsername: gameState.currentUser.username,
                        mode: gameState.waitingForDraftWar.mode,
                        wager: gameState.waitingForDraftWar.wager
                    });
                    
                    selectedDraftWarMode = gameState.waitingForDraftWar.mode;
                    selectedWager = gameState.waitingForDraftWar.wager;
                    startP2PDraftWar(hostDeck, guestDeck, gameState.currentUser.username);
                }, 1000);
                break;

            case 'tbGameStart':
                // Guest receives draft war start
                gameState.opponentData = {
                    username: data.hostUsername,
                    collection: new Set()
                };
                selectedDraftWarMode = data.mode;
                selectedWager = data.wager;
                startP2PDraftWar(data.hostDeck, data.guestDeck, data.hostUsername);
                break;

            case 'tbCardDrawn':
                // Opponent drew a card - opponent is always player2 from our perspective
                const opponentPlayer = draftWarManager.currentGame.player2;
                opponentPlayer.revealedCard = data.card;
                renderDraftWarGame(draftWarManager.currentGame);
                break;

            case 'tbCardAssigned':
                // Opponent assigned a card
                const game = draftWarManager.currentGame;
                // Opponent is always player2 from our perspective (whether we're host or guest)
                const player = game.player2;
                
                player.assignments[data.role] = CARD_DATABASE.find(c => c.id === data.cardId);
                player.revealedCard = null;
                game.currentTurn = 1;
                game.assignmentPhase = data.gameState.assignmentPhase;
                
                renderDraftWarGame(game);
                
                if (game.assignmentPhase >= 6) {
                    finishDraftWar(game);
                }
                break;

            case 'tbConcede':
                // Opponent conceded draft war
                const tbResult = {
                    winner: gameState.currentUser,
                    loser: gameState.opponentData,
                    winnerScore: 0,
                    loserScore: 0,
                    cardsWon: [],
                    wager: 0,
                    conceded: true  // Add this flag
                };
                showDraftWarResults(draftWarManager.currentGame, tbResult);
                break;

        }
    };

    gameState.p2p.onConnectionClosed = () => {
        alert('Connection to opponent lost!');
        showLobby();
    };

    // Login screen handlers
    guestBtn.addEventListener('click', () => {
        const guestName = `Guest${Math.floor(Math.random() * 10000)}`;
        gameState.currentUser = gameState.createUser(guestName, null, true);
        showLobby();
    });

    createProfileBtn.addEventListener('click', () => {
        currentFormMode = 'create';
        profileForm.classList.remove('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        passwordInput.placeholder = 'Enter password';
    });

    loginBtn.addEventListener('click', () => {
        currentFormMode = 'login';
        profileForm.classList.remove('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        passwordInput.placeholder = 'Enter password';
    });

    cancelBtn.addEventListener('click', () => {
        profileForm.classList.add('hidden');
        currentFormMode = null;
    });

    submitProfileBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username) {
            alert('Please enter a username');
            return;
        }

        if (currentFormMode === 'create') {
            if (!password) {
                alert('Please enter a password');
                return;
            }
            const users = JSON.parse(localStorage.getItem('onePieceUsers') || '{}');
            if (users[username]) {
                alert('Username already exists. Please choose another or login.');
                return;
            }
            gameState.currentUser = gameState.createUser(username, password, false);
            showLobby();
        } else if (currentFormMode === 'login') {
            const user = gameState.loadUser(username, password);
            if (user) {
                gameState.currentUser = user;
                showLobby();
            } else {
                alert('Invalid username or password');
            }
        }
    });

    // Lobby screen handlers
    logoutBtn.addEventListener('click', () => {
        gameState.cleanup();
        gameState.currentUser = null;
        showScreen(loginScreen);
    });

    const clearDataBtn = document.getElementById('clear-data-btn');
    clearDataBtn.addEventListener('click', () => {
        if (confirm('⚠️ WARNING: This will delete ALL saved profiles, collections, and game data. This cannot be undone!\n\nAre you sure you want to continue?')) {
            if (confirm('Final confirmation: Delete everything?')) {
                // Clear all localStorage
                localStorage.clear();
                
                // Clear any session storage
                sessionStorage.clear();
                
                // Cleanup current game state
                gameState.cleanup();
                gameState.currentUser = null;
                
                alert('✅ All data has been cleared. Refreshing page...');
                
                // Reload page to reset everything
                window.location.reload();
            }
        }
    });

    // Sop screen handlers
    const viewShopBtn = document.createElement('button');
    viewShopBtn.id = 'view-shop-btn';
    viewShopBtn.className = 'btn btn-secondary';
    viewShopBtn.textContent = '⭐ Card Shop';
    document.getElementById('view-collection-btn').parentElement.insertBefore(viewShopBtn, document.getElementById('view-collection-btn').nextSibling);

    viewShopBtn.addEventListener('click', () => {
        showShop();
    });

    document.getElementById('back-to-lobby-shop-btn')?.addEventListener('click', () => {
        showLobby();
    });

    function showShop() {
        const username = gameState.currentUser.username;
        const points = pointsManager.getPoints(username);
        const streak = pointsManager.getStreak(username);
        
        document.getElementById('shop-user-points').textContent = points;
        document.getElementById('shop-user-streak').textContent = streak + ' 🔥';
        
        renderShopInventory();
        renderArcShop();
        renderArcPacks();
        showScreen(shopScreen);
    }

    function renderShopInventory() {
        const inventory = pointsManager.getShopInventory();
        const inventoryDiv = document.getElementById('shop-inventory');
        const userPoints = pointsManager.getPoints(gameState.currentUser.username);
        
        inventoryDiv.innerHTML = '';
        
        Object.entries(inventory).reverse().forEach(([rarity, info]) => {
            const canAfford = userPoints >= info.price;
            
            const card = document.createElement('div');
            card.className = `shop-card ${!canAfford ? 'locked' : ''}`;
            card.innerHTML = `
                <div class="shop-card-header">
                    <span class="rarity-badge" style="color: ${info.color}">${rarity}</span>
                    <span class="shop-card-label">${info.label}</span>
                </div>
                <div class="shop-card-price">💰 ${info.price} pts</div>
                <div class="shop-card-stock">${info.available} available</div>
                <button class="btn btn-primary shop-buy-btn" data-rarity="${rarity}" ${!canAfford || info.available === 0 ? 'disabled' : ''}>
                    ${info.available === 0 ? 'Out of Stock' : canAfford ? 'Purchase' : 'Not Enough Points'}
                </button>
            `;
            
            const buyBtn = card.querySelector('.shop-buy-btn');
            buyBtn.addEventListener('click', () => {
                purchaseCard(rarity);
            });
            
            inventoryDiv.appendChild(card);
        });
    }

    function purchaseCard(rarity) {
        const username = gameState.currentUser.username;
        const unlockedArcs = gameState.currentUser.unlockedArcs || new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        const result = pointsManager.purchaseCard(username, rarity, gameState.currentUser.collection, unlockedArcs);
        
        if (result.success) {
            // Add card to user's collection
            gameState.currentUser.collection.add(result.card.id);
            autoUpdatePool(gameState.currentUser);
            gameState.saveUser(gameState.currentUser);
            
            alert(`🎉 You purchased ${result.card.name} (${rarity})!\n\nPoints remaining: ${result.pointsRemaining}`);
            
            // Refresh shop
            showShop();
        } else {
            alert(result.message);
        }
    }

    // Arc unlock pricing (expensive progression system)
    const ARC_UNLOCK_PRICES = {
        'Baratie': 1500,
        'Arlong Park': 3000,
        'Loguetown': 5000,
        'Whiskey Peak': 8000,
        'Little Garden': 12000,
        'Drum Island': 18000,
        'Alabasta': 25000,
        'Jaya': 35000,
        'Skypiea': 50000,
        'Long Ring Long Land': 70000,
        'Water 7': 95000,
        'Enies Lobby': 125000,
        'Thriller Bark': 160000,
        'Sabaody Archipelago': 200000,
        'Amazon Lily': 250000,
        'Impel Down': 320000,
        'Marineford': 500000
    };

    // Arc pack prices (buy random card from specific arc)
    const ARC_PACK_PRICES = {
        'Romance Dawn': 150,
        'Orange Town': 150,
        'Syrup Village': 150,
        'Baratie': 250,
        'Arlong Park': 400,
        'Loguetown': 600,
        'Whiskey Peak': 800,
        'Little Garden': 1200,
        'Drum Island': 1800,
        'Alabasta': 2500,
        'Jaya': 3500,
        'Skypiea': 5000,
        'Long Ring Long Land': 7000,
        'Water 7': 10000,
        'Enies Lobby': 14000,
        'Thriller Bark': 18000,
        'Sabaody Archipelago': 25000,
        'Amazon Lily': 32000,
        'Impel Down': 42000,
        'Marineford': 60000
    };

    function renderArcShop() {
        const arcShopGrid = document.getElementById('arc-shop-grid');
        const userPoints = pointsManager.getPoints(gameState.currentUser.username);
        const unlockedArcs = gameState.currentUser.unlockedArcs || new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        
        arcShopGrid.innerHTML = '';
        
        Object.entries(ARC_UNLOCK_PRICES).forEach(([arc, price]) => {
            // Only show arcs that are enabled in dev-config
            if (ARC_AVAILABILITY[arc] !== true) return;
            
            const isUnlocked = unlockedArcs.has(arc);
            const canAfford = userPoints >= price;
            const arcImage = ARC_IMAGES[arc] || 'img/placeholder-arc.jpg';
            
            const arcCard = document.createElement('div');
            arcCard.className = `arc-shop-card ${isUnlocked ? 'unlocked' : ''} ${!canAfford && !isUnlocked ? 'locked' : ''}`;
            arcCard.innerHTML = `
                <div class="arc-card-image">
                    <img src="${arcImage}" alt="${arc}" onerror="this.src='img/placeholder-arc.jpg'">
                </div>
                <div class="arc-card-content">
                    <h4 class="arc-card-title">${arc}</h4>
                    <div class="arc-card-price">💰 ${price.toLocaleString()} pts</div>
                    ${isUnlocked ? 
                        '<div class="arc-card-status unlocked">✓ UNLOCKED</div>' :
                        `<button class="btn btn-primary arc-unlock-btn" data-arc="${arc}" ${!canAfford ? 'disabled' : ''}>
                            ${canAfford ? 'Unlock Arc' : 'Not Enough Points'}
                        </button>`
                    }
                </div>
            `;
            
            if (!isUnlocked) {
                const unlockBtn = arcCard.querySelector('.arc-unlock-btn');
                unlockBtn?.addEventListener('click', () => {
                    unlockArc(arc, price);
                });
            }
            
            arcShopGrid.appendChild(arcCard);
        });
    }

    function renderArcPacks() {
        const arcPacksGrid = document.getElementById('arc-packs-grid');
        const userPoints = pointsManager.getPoints(gameState.currentUser.username);
        const unlockedArcs = gameState.currentUser.unlockedArcs || new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        
        arcPacksGrid.innerHTML = '';
        
        Object.entries(ARC_PACK_PRICES).forEach(([arc, price]) => {
            // Only show packs for unlocked arcs AND arcs enabled in dev-config
            if (!unlockedArcs.has(arc) || ARC_AVAILABILITY[arc] !== true) return;
            
            const canAfford = userPoints >= price;
            const arcCards = CARD_DATABASE.filter(card => card.arc === arc && card.available);
            const ownedCards = arcCards.filter(card => gameState.currentUser.collection.has(card.id)).length;
            const arcImage = ARC_IMAGES[arc] || 'img/placeholder-arc.jpg';
            
            const packCard = document.createElement('div');
            packCard.className = `arc-pack-card ${!canAfford ? 'locked' : ''}`;
            packCard.innerHTML = `
                <div class="arc-pack-image">
                    <img src="${arcImage}" alt="${arc}" onerror="this.src='img/placeholder-arc.jpg'">
                </div>
                <div class="arc-pack-content">
                    <div class="arc-pack-header">
                        <h4>${arc} Pack</h4>
                        <span class="arc-pack-collection">${ownedCards}/${arcCards.length} owned</span>
                    </div>
                    <div class="arc-pack-price">💰 ${price.toLocaleString()} pts</div>
                    <div class="arc-pack-info">Random card from ${arc}</div>
                    <button class="btn btn-primary arc-pack-buy-btn" data-arc="${arc}" ${!canAfford || ownedCards === arcCards.length ? 'disabled' : ''}>
                        ${ownedCards === arcCards.length ? 'Complete ✓' : canAfford ? 'Buy Pack' : 'Not Enough Points'}
                    </button>
                </div>
            `;
            
            const buyBtn = packCard.querySelector('.arc-pack-buy-btn');
            buyBtn?.addEventListener('click', () => {
                purchaseArcPack(arc, price);
            });
            
            arcPacksGrid.appendChild(packCard);
        });
    }

    function unlockArc(arc, price) {
        const username = gameState.currentUser.username;
        const userPoints = pointsManager.getPoints(username);
        
        if (userPoints < price) {
            alert('Not enough points!');
            return;
        }
        
        if (gameState.currentUser.unlockedArcs.has(arc)) {
            alert('Arc already unlocked!');
            return;
        }
        
        // Deduct points
        const remaining = pointsManager.spendPoints(username, price);
        
        // Unlock arc
        gameState.currentUser.unlockedArcs.add(arc);
        gameState.saveUser(gameState.currentUser);
        
        alert(`🎊 ${arc} Unlocked! 🎊\n\nNew cards are now available in this arc!\n\nPoints remaining: ${remaining}`);
        
        // Refresh shop
        showShop();
    }

    function purchaseArcPack(arc, price) {
        const username = gameState.currentUser.username;
        const userPoints = pointsManager.getPoints(username);
        
        if (userPoints < price) {
            alert('Not enough points!');
            return;
        }
        
        // Get available cards from this arc that user doesn't own
        const arcCards = CARD_DATABASE.filter(card => 
            card.arc === arc && 
            card.available && 
            !gameState.currentUser.collection.has(card.id)
        );
        
        if (arcCards.length === 0) {
            alert('You already own all cards from this arc!');
            return;
        }
        
        // Pick random card
        const randomCard = arcCards[Math.floor(Math.random() * arcCards.length)];
        
        // Deduct points
        const remaining = pointsManager.spendPoints(username, price);
        
        // Add card to collection
        gameState.currentUser.collection.add(randomCard.id);
        autoUpdatePool(gameState.currentUser);
        gameState.saveUser(gameState.currentUser);
        
        alert(`🎉 You got ${randomCard.name} (${randomCard.rarity}) from ${arc}!\n\nPoints remaining: ${remaining}`);
        
        // Refresh shop
        showShop();
    }

    document.getElementById('claim-profile-link').addEventListener('click', (e) => {
        e.preventDefault();
        const username = prompt('Enter username:');
        if (!username) return;
        const password = prompt('Enter password:');
        if (!password) return;
        
        const users = JSON.parse(localStorage.getItem('onePieceUsers') || '{}');
        if (users[username]) { alert('Username exists!'); return; }
    
        gameState.currentUser.username = username;
        gameState.currentUser.password = password;
        gameState.currentUser.isGuest = false;
        gameState.saveUser(gameState.currentUser);
        alert('Profile claimed!');
        showLobby();
    })

    hostGameBtn.addEventListener('click', async () => {
        hostGameBtn.disabled = true;
        lobbyCodeDisplay.classList.remove('hidden');
        connectionStatus.textContent = 'Initializing connection...';
        connectionStatus.className = 'connection-status loading';
        
        try {
            const code = await gameState.createLobby(gameState.currentUser);
            lobbyCodeSpan.textContent = code;
            connectionStatus.textContent = 'Waiting for opponent to join...';
            connectionStatus.className = 'connection-status';
        } catch (err) {
            connectionStatus.textContent = 'Error creating lobby: ' + err.message;
            connectionStatus.className = 'connection-status error';
            hostGameBtn.disabled = false;
        }
    });

    joinGameBtn.addEventListener('click', async () => {
        const code = joinCodeInput.value.trim();
        if (!code) {
            alert('Please enter a lobby code');
            return;
        }

        joinGameBtn.disabled = true;
        joinStatus.classList.remove('hidden');
        joinStatus.textContent = 'Connecting...';
        joinStatus.className = 'connection-status loading';

        try {
            await gameState.joinLobby(code, gameState.currentUser);
            joinStatus.textContent = 'Connected! Waiting for host...';
            joinStatus.className = 'connection-status connected';
        } catch (err) {
            joinStatus.textContent = 'Failed to connect: ' + err.message;
            joinStatus.className = 'connection-status error';
            joinGameBtn.disabled = false;
        }
    });

    const copyLinkBtn = document.getElementById('copy-link-btn');
    copyLinkBtn?.addEventListener('click', () => {
        const lobbyCode = lobbyCodeSpan.textContent;
        const currentUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${currentUrl}?lobby=${lobbyCode}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            copyLinkBtn.textContent = '✅ Link Copied!';
            setTimeout(() => {
                copyLinkBtn.textContent = '📋 Copy Join Link';
            }, 2000);
        }).catch(() => {
            // Fallback if clipboard API doesn't work
            prompt('Copy this link to share:', shareUrl);
        });
    });

    // Regular battle close lobby button
    const closeLobbyBtn = document.getElementById('close-lobby-btn');
    closeLobbyBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to close this lobby?')) {
            gameState.p2p.disconnect();
            lobbyCodeDisplay.classList.add('hidden');
            hostGameBtn.disabled = false;
            connectionStatus.textContent = '';
        }
    });

    viewCollectionBtn.addEventListener('click', () => {
        showCollection();
    });

    backToLobbyBtn.addEventListener('click', () => {
        showLobby();
    });

    arcFilter.addEventListener('change', () => {
        renderCollection();
    });

    sagaFilter.addEventListener('change', () => {
        renderCollection();
    });

    rarityFilter.addEventListener('change', () => {
        renderCollection();
    });

    const ownedOnlyFilter = document.getElementById('owned-only-filter');
    ownedOnlyFilter.addEventListener('change', () => {
        renderCollection();
    });

    const sortByPowerFilter = document.getElementById('sort-by-power-filter');
    sortByPowerFilter.addEventListener('change', () => {
        renderCollection();
    });

    const poolFirstSort = document.getElementById('pool-first-sort');
    poolFirstSort.addEventListener('change', () => {
        renderCollection();
    });

    // Pool selection mode toggle
    const poolSelectionMode = document.getElementById('pool-selection-mode');
    const poolCountSpan = document.getElementById('pool-count');
    const poolMaxSpan = document.getElementById('pool-max');
    
    poolSelectionMode.addEventListener('change', () => {
        const isActive = poolSelectionMode.checked;
        if (isActive) {
            collectionGrid.parentElement.classList.add('pool-selection-active');
        } else {
            collectionGrid.parentElement.classList.remove('pool-selection-active');
        }
        renderCollection();
    });

    // Game screen handlers
    playCardBtn.addEventListener('click', () => {
        if (hasPlayedThisRound) return;
        
        console.log('🎮 Player playing card. Deck remaining:', gameState.currentGame.player1.deck.length);
        
        const result = gameState.playCard();
        displayCard(result.card, result.isPlayer1);
        
        hasPlayedThisRound = true;
        playCardBtn.disabled = true;
        
        // If bot game, bot plays immediately
        if (gameState.currentGame.isBotGame) {
            console.log('🤖 Bot preparing to play. Bot deck remaining:', gameState.currentGame.player2.deck.length);
            
            waitingMessage.classList.remove('hidden');
            waitingMessage.textContent = 'Bot is thinking...';
            
            setTimeout(() => {
                console.log('🤖 Bot playing card now...');
                const botCard = gameState.playBotCard();
                console.log('🤖 Bot played:', botCard);
                
                waitingMessage.classList.add('hidden');
                
                if (botCard) {
                    displayCard(botCard, false); // false = player2 (bot)
                    
                    // Check and resolve immediately
                    setTimeout(() => {
                        if (gameState.checkBothPlayed()) {
                            console.log('✅ Both cards played, showing results');
                            showBothCards();
                        } else {
                            console.error('❌ Both cards NOT played!', {
                                player1Played: gameState.currentGame.player1Played,
                                player2Played: gameState.currentGame.player2Played
                            });
                        }
                    }, 500);
                } else {
                    console.error('❌ Bot returned null/undefined! Bot deck length:', gameState.currentGame.player2.deck.length);
                }
            }, 800); // Small delay for bot to "think"
        } else {
            // P2P game logic (existing)
            waitingMessage.classList.remove('hidden');
            waitingMessage.textContent = 'Waiting for opponent...';
            
            if (gameState.checkBothPlayed()) {
                showBothCards();
            }
        }
    });

    // Make player1 card clickable to play it
    player1CardSlot.addEventListener('click', () => {
        // Only allow clicking if it's the player's turn and they haven't played yet
        if (hasPlayedThisRound) return;
        if (!gameState.currentGame) return;
        
        // Check if it's a card-back (face-down card)
        const cardBack = player1CardSlot.querySelector('.card-back');
        if (!cardBack) return; // Already revealed/played
        
        // Trigger the same action as clicking the play card button
        playCardBtn.click();
    });

    concedeBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to concede? This will count as a loss.')) {
            const result = gameState.concede();
            endGameSession(result);
        }
    });

    continueBtn.addEventListener('click', () => {
        resultDisplay.classList.add('hidden');

        gameState.currentGame.round++;

        const gameOver = gameState.checkGameOver();
        if (gameOver) {
            endGameSession(gameOver);
        } else {
            // Reset for next round
            hasPlayedThisRound = false;
            playCardBtn.disabled = false;

            roundNumberSpan.textContent = gameState.currentGame.round;

            player1CardSlot.innerHTML = '<div class="card-back" style="cursor: pointer;"><img src="img/back.png" alt="Card Back"></div>';
            player2CardSlot.innerHTML = '<div class="card-back"><img src="img/back.png" alt="Card Back"></div>';
        }
    });

    returnLobbyBtn.addEventListener('click', () => {
        gameState.cleanup();
        showLobby();
    });

    // Bot mode handlers
    const playBotBtn = document.getElementById('play-bot-btn');
    const difficultySelector = document.getElementById('difficulty-selector');
    const difficultyButtons = document.querySelectorAll('.btn-difficulty');
    const cancelBotBtn = document.getElementById('cancel-bot-btn');

    playBotBtn.addEventListener('click', () => {
        playBotBtn.classList.add('hidden');
        difficultySelector.classList.remove('hidden');
    });

    cancelBotBtn.addEventListener('click', () => {
        difficultySelector.classList.add('hidden');
        playBotBtn.classList.remove('hidden');
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            startBotGame(difficulty);
        });
    });

    function startBotGame(difficulty) {
        // Hide difficulty selector
        difficultySelector.classList.add('hidden');
        playBotBtn.classList.remove('hidden');

        // Check if bot difficulty has enough cards
        const allowedRarities = BOT_DIFFICULTIES[difficulty].rarities;
        const availableCards = CardRaritySystem.getAvailablePool().filter(card => 
            allowedRarities.includes(card.rarity)
        );
        
        if (availableCards.length < DEV_CONFIG.GAME.DECK_SIZE) {
            alert(`⚠️ ${BOT_DIFFICULTIES[difficulty].name} difficulty is not ready!\n\nThis difficulty needs at least ${DEV_CONFIG.GAME.DECK_SIZE} cards from rarities: ${allowedRarities.join(', ')}\n\nCurrently available: ${availableCards.length} cards\n\nPlease enable more arcs in the Admin Panel or choose a different difficulty.`);
            return;
        }

        // Create player deck
        const playerDeck = gameState.createDeck(gameState.currentUser, DEV_CONFIG.GAME.DECK_SIZE || 5);

        // Start bot game (no P2P needed)
        const game = gameState.startBotGame(playerDeck, difficulty);

        // Verify bot deck was created successfully
        if (!game.player2.deck || game.player2.deck.length < DEV_CONFIG.GAME.DECK_SIZE) {
            alert(`⚠️ Failed to create bot deck for ${BOT_DIFFICULTIES[difficulty].name} difficulty.\n\nPlease enable more arcs in the Admin Panel.`);
            return;
        }
        
        // Update UI
        player1NameSpan.textContent = game.player1.user.username;
        player2NameSpan.textContent = game.player2.user.username;
        player1CardsSpan.textContent = game.player1.deck.length;
        player2CardsSpan.textContent = game.player2.deck.length;
        player1ScoreSpan.textContent = game.player1.score;
        player2ScoreSpan.textContent = game.player2.score;
        roundNumberSpan.textContent = game.round;
        maxRoundsSpan.textContent = game.maxRounds;
        
        // Mark players
        document.getElementById('player1-info').classList.add('my-player');
        document.getElementById('player2-info').classList.remove('my-player');
        
        // Show game screen
        showScreen(gameScreen);
        musicManager.play('battle');
        
        // Reset game state
        hasPlayedThisRound = false;
        playCardBtn.disabled = false;
        waitingMessage.classList.add('hidden');
        resultDisplay.classList.add('hidden');
        player1CardSlot.innerHTML = '<div class="card-back"><img src="img/back.png" alt="Card Back"></div>';
        player2CardSlot.innerHTML = '<div class="card-back"><img src="img/back.png" alt="Card Back"></div>';
    }
    
    function showBothCards() {
        const img1 = CHARACTER_IMAGES[gameState.currentGame.player1Card.name] || '❓';
        const img2 = CHARACTER_IMAGES[gameState.currentGame.player2Card.name] || '❓';
        
        const result = gameState.resolveRound();
        
        // For bot games, player1 = human, player2 = bot
        // For P2P games, use isHost
        let p1Class, p2Class;
        if (gameState.currentGame.isBotGame) {
            p1Class = 'my-card';
            p2Class = 'opponent-card';
        } else {
            p1Class = gameState.isHost ? 'my-card' : 'opponent-card';
            p2Class = !gameState.isHost ? 'my-card' : 'opponent-card';
        }
        
        // Check if it's a URL or emoji
        const img1HTML = img1 !== '❓' ? `<img src="${img1}" alt="${result.card1.name}">` : img1;
        const img2HTML = img2 !== '❓' ? `<img src="${img2}" alt="${result.card2.name}">` : img2;

        player1CardSlot.innerHTML = `
            <div class="card ${p1Class} ${result.winner === 1 ? 'winner' : ''}">
                <div class="card-header">
                    <div class="card-name">${result.card1.name}</div>
                    <div class="card-arc">${result.card1.arc}</div>
            </div>
            <div class="card-image">${img1HTML}</div>
            <div class="card-power">
                <span class="rarity-badge" style="color: ${RARITY_TIERS[result.card1.rarity].color}">${result.card1.rarity}</span>
                ${result.card1.power}
            </div>
        `;

        player2CardSlot.innerHTML = `
            <div class="card ${p2Class} ${result.winner === 2 ? 'winner' : ''}">
                <div class="card-header">
                    <div class="card-name">${result.card2.name}</div>
                    <div class="card-arc">${result.card2.arc}</div>
            </div>
            <div class="card-image">${img2HTML}</div>
            <div class="card-power">
                <span class="rarity-badge" style="color: ${RARITY_TIERS[result.card2.rarity].color}">${result.card2.rarity}</span>
                ${result.card2.power}
            </div>
        `;
        
        // Update scores and cards remaining
        player1ScoreSpan.textContent = result.player1Score;
        player2ScoreSpan.textContent = result.player2Score;
        player1CardsSpan.textContent = gameState.currentGame.player1.deck.length;
        player2CardsSpan.textContent = gameState.currentGame.player2.deck.length;
        roundNumberSpan.textContent = gameState.currentGame.round;
        
        // Show result
        setTimeout(() => {
            if (result.winner === 1) {
                resultText.textContent = `${gameState.currentGame.player1.user.username} wins with ${result.card1.name} (${result.card1.power})!`;
            } else if (result.winner === 2) {
                resultText.textContent = `${gameState.currentGame.player2.user.username} wins with ${result.card2.name} (${result.card2.power})!`;
            } else {
                resultText.textContent = `It's a tie! Both played ${result.card1.power} power cards!`;
            }
            resultDisplay.classList.remove('hidden');
        }, 1500);
    }

    function displayCard(card, isPlayer1) {
        const img = CHARACTER_IMAGES[card.name] || '❓';
        
        // For bot games, player is always player1 (my card), bot is always player2 (opponent)
        // For P2P games, use isHost to determine
        let isMyCard;
        if (gameState.currentGame.isBotGame) {
            isMyCard = isPlayer1; // Player1 = human player, Player2 = bot
        } else {
            isMyCard = (isPlayer1 && gameState.isHost) || (!isPlayer1 && !gameState.isHost);
        }
        
        // Check if it's a URL or emoji
        const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
    
        const cardHTML = `
            <div class="card ${isMyCard ? 'my-card' : 'opponent-card'}">
                <div class="card-header">
                    <div class="card-name">${card.name}</div>
                    <div class="card-arc">${card.arc}</div>
            </div>
            <div class="card-image">${imgHTML}</div>
            <div class="card-power">
                <span class="rarity-badge" style="color: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</span>
                ${card.power}
            </div>
        `;
        
        if (isPlayer1) {
            player1CardSlot.innerHTML = cardHTML;
        } else {
            player2CardSlot.innerHTML = cardHTML;
        }
    }

    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function showLobby() {
        const user = gameState.currentUser;
        
        // Auto-update pool with best cards
        autoUpdatePool(user);
        gameState.saveUser(user);
        
        playerNameSpan.textContent = user.username;
        winsSpan.textContent = user.wins;
        lossesSpan.textContent = user.losses;
        
        const totalEnabled = getTotalEnabledCards();
        cardsCollectedSpan.textContent = `${user.collection.size}/${totalEnabled}`;
        
        // Add points and streak display
        const points = pointsManager.getPoints(user.username);
        const streak = pointsManager.getStreak(user.username);
        document.getElementById('user-points').textContent = points;
        document.getElementById('user-streak').textContent = streak;
        
        // Display unlocked arcs count
        const unlockedArcs = user.unlockedArcs || new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        document.getElementById('arcs-unlocked').textContent = unlockedArcs.size;
        
        // Update pool status display
        const userPool = user.pool || new Set();
        const poolStatusLobby = document.getElementById('pool-status-lobby');
        const hasEnoughCards = user.collection.size >= POOL_MAX_SIZE;
        
        if (hasEnoughCards) {
            poolStatusLobby.classList.remove('hidden');
            document.getElementById('lobby-pool-count').textContent = userPool.size;
        } else {
            poolStatusLobby.classList.add('hidden');
        }
        
        lobbyCodeDisplay.classList.add('hidden');
        joinStatus.classList.add('hidden');
        hostGameBtn.disabled = false;
        joinGameBtn.disabled = false;
        joinCodeInput.value = '';
        
        const claimLink = document.getElementById('claim-profile-link');
        if (gameState.currentUser.isGuest) {
            claimLink.classList.remove('hidden');
        } else {
            claimLink.classList.add('hidden');
        } 
        
        // Check if there's a pending lobby code from URL
        handlePendingLobbyCode();
        handlePendingTBLobbyCode();
        
        showScreen(lobbyScreen);
    }

    function showCollection() {
        // Ensure pool is initialized and updated
        if (!gameState.currentUser.pool) {
            gameState.currentUser.pool = new Set();
        }
        autoUpdatePool(gameState.currentUser);
        gameState.saveUser(gameState.currentUser);
        
        // Show/hide pool features based on collection size
        const hasEnoughCards = gameState.currentUser.collection.size >= POOL_MAX_SIZE;
        const poolModeToggle = document.getElementById('pool-mode-toggle');
        const poolStatusDisplay = document.getElementById('pool-status-display');
        const poolFirstSortContainer = document.getElementById('pool-first-sort-container');
        
        if (hasEnoughCards) {
            poolModeToggle.classList.remove('hidden');
            poolStatusDisplay.classList.remove('hidden');
            poolFirstSortContainer.classList.remove('hidden');
        } else {
            poolModeToggle.classList.add('hidden');
            poolStatusDisplay.classList.add('hidden');
            poolFirstSortContainer.classList.add('hidden');
            // Ensure pool mode is off if not enough cards
            poolSelectionMode.checked = false;
            collectionGrid.parentElement.classList.remove('pool-selection-active');
        }
        
        // Populate saga filter
        sagaFilter.innerHTML = '<option value="all">All Sagas</option>';
        for (const saga in DEV_CONFIG.SAGA_DEFINITIONS) {
            const option = document.createElement('option');
            option.value = saga;
            option.textContent = saga.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            sagaFilter.appendChild(option);
        }
        
        // Populate arc filter - only show unlocked arcs
        const unlockedArcs = gameState.currentUser.unlockedArcs || new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        arcFilter.innerHTML = '<option value="all">All Arcs</option>';
        ARCS.forEach(arc => {
            if (unlockedArcs.has(arc)) {
                const option = document.createElement('option');
                option.value = arc;
                option.textContent = arc;
                arcFilter.appendChild(option);
            }
        });
        
        renderCollection();
        showScreen(collectionScreen);
    }

    function renderCollection() {
        const selectedSaga = sagaFilter.value;
        const selectedArc = arcFilter.value;
        const selectedRarity = rarityFilter.value;
        const ownedOnly = ownedOnlyFilter.checked;
        const sortByPower = sortByPowerFilter.checked;
        const poolFirstSort = document.getElementById('pool-first-sort').checked;
        const poolMode = poolSelectionMode.checked;
        const userCollection = gameState.currentUser.collection;
        const userPool = gameState.currentUser.pool || new Set();
        
        // Update pool count display
        poolCountSpan.textContent = userPool.size;
        poolMaxSpan.textContent = POOL_MAX_SIZE;
        
        let cards = CARD_DATABASE;
        
        // Filter by saga if selected
        if (selectedSaga !== 'all') {
            const sagaArcs = DEV_CONFIG.SAGA_DEFINITIONS[selectedSaga];
            cards = cards.filter(card => sagaArcs.includes(card.arc));
        }
        
        // Filter by arc if selected
        if (selectedArc !== 'all') {
            cards = cards.filter(card => card.arc === selectedArc);
        }
        
        // Filter by rarity if selected
        if (selectedRarity !== 'all') {
            cards = cards.filter(card => card.rarity === selectedRarity);
        }

        // Ensure unlockedArcs exists
        if (!gameState.currentUser.unlockedArcs) {
            gameState.currentUser.unlockedArcs = new Set(['Romance Dawn', 'Orange Town', 'Syrup Village']);
        }

        // Filter out cards from disabled arcs and locked arcs
        cards = cards.filter(card => 
            ARC_AVAILABILITY[card.arc] === true && 
            card.available && 
            gameState.currentUser.unlockedArcs.has(card.arc)
        );
        
        // Filter for owned only if checkbox is checked
        if (ownedOnly) {
            cards = cards.filter(card => userCollection.has(card.id));
        }
        
        // Sort by power if checkbox is checked
        if (sortByPower) {
            cards = cards.sort((a, b) => b.power - a.power);
        }
        
        // Sort by pool first, then alphabetically
        if (poolFirstSort) {
            cards = cards.sort((a, b) => {
                const aInPool = userPool.has(a.id);
                const bInPool = userPool.has(b.id);
                
                // Pool cards come first
                if (aInPool && !bInPool) return -1;
                if (!aInPool && bInPool) return 1;
                
                // Within same group (both in pool or both not), sort alphabetically
                return a.name.localeCompare(b.name);
            });
        }
        
        collectionGrid.innerHTML = '';
        
        if (cards.length === 0) {
            collectionGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No cards to display</p>';
            return;
        }
        
        cards.forEach(card => {
            const owned = userCollection.has(card.id);
            const inPool = userPool.has(card.id);
            
            const cardDiv = document.createElement('div');
            cardDiv.style = `border: 1px solid;padding: 3px;margin: 3px;`;
            cardDiv.className = `collection-card ${owned ? '' : 'locked'} ${inPool ? 'in-pool' : ''}`;
            cardDiv.setAttribute('data-rarity', card.rarity);
            cardDiv.setAttribute('data-card-id', card.id);
            
            if (!owned) {
                cardDiv.style = `border: 1px solid;
                                padding: 3px;margin: 3px;
                                background: rgba(128, 128, 128, 0.6);
                                filter: grayscale(100%);`;
            }
            
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
            
            const rarityInfo = CardRaritySystem.getRarityInfo(card.rarity);

            cardDiv.innerHTML = `
                <div class="card-header">
                    <div class="card-name">${card.name}</div>
                    <div class="card-arc">${card.arc}</div>
                </div>
                ${DEV_CONFIG.DEBUG.SHOW_CARD_IDS ? `<div style="position:absolute;top:20px;left:2px;background:rgba(0,0,0,0.3);color:white;padding:2px 5px;font-size:10px;border-radius:3px;">ID: ${card.id}</div>` : ''}
                <div class="card-image">
                    ${imgHTML}
                </div>
                <div class="card-power">
                    <span class="rarity-badge" style="color: ${rarityInfo.color}">${card.rarity}</span>
                    ${card.power}
                </div>
            `;
            
            // Add click handler
            cardDiv.addEventListener('click', () => {
                if (poolMode && owned) {
                    // Pool selection mode - toggle card in/out of pool
                    toggleCardInPool(card.id);
                } else {
                    // Normal mode - show card detail modal
                    showCardDetailModal(card);
                }
            });
            
            collectionGrid.appendChild(cardDiv);
        });
    }

    // Pool management functions
    function toggleCardInPool(cardId) {
        const userPool = gameState.currentUser.pool || new Set();
        
        if (userPool.has(cardId)) {
            // Remove from pool
            userPool.delete(cardId);
        } else {
            // Add to pool if under limit
            if (userPool.size >= POOL_MAX_SIZE) {
                alert(`Pool is full! Maximum ${POOL_MAX_SIZE} cards allowed.`);
                return;
            }
            userPool.add(cardId);
        }
        
        // Save to localStorage
        gameState.currentUser.pool = userPool;
        gameState.saveUser(gameState.currentUser);
        
        // Re-render collection
        renderCollection();
    }

    // Auto-populate pool with best cards (highest rarity -> power -> name)
    function autoUpdatePool(user) {
        if (!user.pool) {
            user.pool = new Set();
        }

        // Get all owned cards as full card objects
        const ownedCards = Array.from(user.collection)
            .map(id => CARD_DATABASE.find(card => card.id === id))
            .filter(card => card); // Remove any undefined

        // Define rarity order
        const rarityOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'F'];

        // Sort by: rarity (highest first), then power (highest first), then name (alphabetical)
        ownedCards.sort((a, b) => {
            const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
            if (rarityDiff !== 0) return rarityDiff;
            
            const powerDiff = b.power - a.power;
            if (powerDiff !== 0) return powerDiff;
            
            return a.name.localeCompare(b.name);
        });

        // Take top POOL_MAX_SIZE cards
        const topCards = ownedCards.slice(0, POOL_MAX_SIZE);
        user.pool = new Set(topCards.map(card => card.id));
    }

    // Card Detail Modal Functions
    function showCardDetailModal(card) {
        const modal = document.getElementById('card-detail-modal');
        const modalCardDisplay = document.getElementById('modal-card-display');
        
        const owned = gameState.currentUser.collection.has(card.id);
        const img = CHARACTER_IMAGES[card.name] || '❓';
        const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : `<div style="font-size: 80px;">${img}</div>`;
        const rarityInfo = CardRaritySystem.getRarityInfo(card.rarity);
        const typeInfo = CHARACTER_TYPES[card.type] || { name: 'Unknown', icon: '❓', color: '#888888' };
        
        modalCardDisplay.innerHTML = `
            <div class="modal-card ${owned ? '' : 'locked'}" data-rarity="${card.rarity}">
                <div class="modal-card-header">
                    <div class="modal-card-name">${card.name}</div>
                    <div class="modal-card-arc">${card.arc}</div>
                </div>
                
                <div class="modal-card-image ${owned ? '' : 'locked'}">
                    ${imgHTML}
                    ${!owned ? '<div style="position:absolute;font-size:80px;color:white;text-shadow:2px 2px 8px black;">🔒</div>' : ''}
                </div>
                
                <div class="modal-card-stats">
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Power</div>
                        <div class="modal-stat-value">⚔️ ${card.power}</div>
                    </div>
                    <div class="modal-stat-item">
                        <div class="modal-stat-label">Rarity</div>
                        <div class="modal-stat-value">
                            <span class="modal-rarity-badge" style="color: ${rarityInfo.color}">${card.rarity}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-stat-item" style="margin-bottom: 15px;">
                    <div class="modal-stat-label">Type</div>
                    <div class="modal-type-badge" style="color: ${typeInfo.color}">
                        <span style="font-size: 20px;">${typeInfo.icon}</span>
                        <span>${typeInfo.name}</span>
                    </div>
                </div>
                
                ${card.flavorText ? `
                    <div class="modal-card-flavor">
                        <div class="modal-flavor-label">Character Info</div>
                        <div class="modal-flavor-text">${card.flavorText}</div>
                    </div>
                ` : ''}
                
                ${DEV_CONFIG.DEBUG.SHOW_CARD_IDS ? `
                    <div class="modal-card-id">Card ID: ${card.id}</div>
                ` : ''}
                
                <div class="modal-card-id" style="opacity: 0.8; margin-top: 15px;">
                    ${owned ? '✅ Owned' : '🔒 Locked'}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
    
    function closeCardDetailModal() {
        const modal = document.getElementById('card-detail-modal');
        modal.classList.remove('active');
    }
    
    // Close modal button handler
    document.getElementById('close-modal-btn')?.addEventListener('click', closeCardDetailModal);
    
    // Close modal when clicking outside
    document.getElementById('card-detail-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'card-detail-modal') {
            closeCardDetailModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCardDetailModal();
        }
    });

    function startGameSession() {
        hasPlayedThisRound = false;
        
        // Start battle music
        musicManager.play('battle');
        
        // Mark which player is "you"
        if (gameState.isHost) {
            document.getElementById('player1-info').classList.add('my-player');
            document.getElementById('player2-info').classList.add('opponent-player');
        } else {
            document.getElementById('player1-info').classList.add('opponent-player');
            document.getElementById('player2-info').classList.add('my-player');
        }
        
        player1NameSpan.textContent = gameState.currentGame.player1.user.username;
        player2NameSpan.textContent = gameState.currentGame.player2.user.username;
        player1CardsSpan.textContent = gameState.currentGame.player1.deck.length;
        player2CardsSpan.textContent = gameState.currentGame.player2.deck.length;
        player1ScoreSpan.textContent = 0;
        player2ScoreSpan.textContent = 0;
        roundNumberSpan.textContent = 1;
        maxRoundsSpan.textContent = DEV_CONFIG.GAME.MAX_ROUNDS;
        
        player1CardSlot.innerHTML = '<div class="card-back" style="cursor: pointer;"><img src="img/back.png" alt="Card Back"></div>';
        player2CardSlot.innerHTML = '<div class="card-back"><img src="img/back.png" alt="Card Back"></div>';
        waitingMessage.classList.add('hidden');
        playCardBtn.disabled = false;
        
        showScreen(gameScreen);
    }

    function endGameSession(gameOver) {
        // Stop battle music
        musicManager.stop();

        const result = gameState.endGame(gameOver);
        
        // Clear previous game stats
        gameoverStats.innerHTML = '';
        
        // Use newly unlocked arcs from result
        let arcUnlockNotification = '';
        if (result.newlyUnlockedArcs && result.newlyUnlockedArcs.length > 0) {
            arcUnlockNotification = `
                <div class="arc-unlock-notification">
                    <h3>🎊 New Arc${result.newlyUnlockedArcs.length > 1 ? 's' : ''} Unlocked! 🎊</h3>
                    ${result.newlyUnlockedArcs.map(arc => `<p>🏝️ ${arc}</p>`).join('')}
                    <p>New cards are now available!</p>
                </div>
            `;
        }
        
        // Calculate and award points
        const isPlayerWinner = result.winner && result.winner.username === gameState.currentUser.username;
        const isPlayerLoser = result.loser && result.loser.username === gameState.currentUser.username;
        
        if (!result.conceded) {
            const pointsResult = pointsManager.calculateDuelPoints({
                ...result,
                player1Score: gameState.currentGame.player1.score,
                player2Score: gameState.currentGame.player2.score,
                maxRounds: gameState.currentGame.maxRounds,
                isPlayerWinner,
                isPlayerLoser
            });
            
            const totalPoints = pointsManager.awardPoints(gameState.currentUser.username, pointsResult.points);
            const newStreak = pointsManager.updateStreak(gameState.currentUser.username, isPlayerWinner);
            
            // Add points notification to game over screen
            const pointsNotification = `
                <div class="points-earned">
                    <h3>⭐ Points Earned: ${pointsResult.points} ⭐</h3>
                    <p>Performance Grade: ${pointsResult.grade}</p>
                    <p>Win Streak: ${newStreak} 🔥</p>
                    <p>Total Points: ${totalPoints}</p>
                </div>
            `;
            
            gameoverStats.innerHTML += pointsNotification;
        }
        
        // Add arc unlock notification if any
        if (arcUnlockNotification) {
            gameoverStats.innerHTML += arcUnlockNotification;
        }
        
        if (result.tie) {
            gameoverResult.textContent = "🤝 It's a Tie! 🤝";
            gameoverStats.innerHTML += `
                <p>Both players scored equally!</p>
                <p>Final Score: ${gameState.currentGame.player1.score} - ${gameState.currentGame.player2.score}</p>
            `;
        } else if (result.conceded) {
            gameoverResult.textContent = result.winner.username === gameState.currentUser.username ? 
                '🎉 Victory by Concession! 🎉' : '💔 You Conceded 💔';
            gameoverStats.innerHTML += `
                <p>${result.winner.username} wins!</p>
                <p>Total Wins: ${result.winner.wins} | Total Losses: ${result.winner.losses}</p>
            `;
        } else {
            gameoverResult.textContent = result.winner.username === gameState.currentUser.username ? 
                '🎉 Victory! 🎉' : '💔 Defeat 💔';
            
            gameoverStats.innerHTML += `
                <p>${result.winner.username} wins!</p>
                <p>Final Score: ${gameState.currentGame.player1.score} - ${gameState.currentGame.player2.score}</p>
                <p>Total Wins: ${result.winner.wins} | Total Losses: ${result.winner.losses}</p>
            `;
        }
        
        if (result.cardsWon && result.cardsWon.length > 0 && result.winner && result.winner.username === gameState.currentUser.username) {
            cardsWonDisplay.classList.remove('hidden');
            cardsWonGrid.innerHTML = '';
            result.cardsWon.forEach(card => {
                const img = CHARACTER_IMAGES[card.name] || '❓';
                const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
                const cardDiv = document.createElement('div');
                cardDiv.setAttribute('data-rarity', card.rarity);
                cardDiv.className = 'collection-card';
                cardDiv.innerHTML = `
                    <div class="card-header">
                        <div class="card-name">${card.name}</div>
                        <div class="card-arc">${card.arc}</div>
                    </div>
                    ${DEV_CONFIG.DEBUG.SHOW_CARD_IDS ? `<div style="position:absolute;top:2px;left:2px;background:rgba(0,0,0,0.7);color:white;padding:2px 5px;font-size:10px;border-radius:3px;">ID: ${card.id}</div>` : ''}
                    <div class="card-image">
                        ${imgHTML}
                    </div>
                    <div class="card-power">
                        <span class="rarity-badge" style="color: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</span>
                        ${card.power}
                    </div>
                `;
                cardsWonGrid.appendChild(cardDiv);
            });
        } else {
            cardsWonDisplay.classList.add('hidden');
        }
        
        showScreen(gameoverScreen);
    }

    // Function to handle lobby code from URL
    function handlePendingLobbyCode() {
        if (pendingLobbyCode && joinCodeInput) {
            joinCodeInput.value = pendingLobbyCode;
            joinCodeInput.focus();
            // Highlight the input to show user
            joinCodeInput.style.backgroundColor = 'rgba(255, 206, 0, 0.2)';
            setTimeout(() => {
                joinCodeInput.style.backgroundColor = '';
            }, 2000);
            pendingLobbyCode = null; // Clear it after use
        }
    }

    function handlePendingTBLobbyCode() {
        if (pendingTBLobbyCode) {
            // Just navigate to the wager screen after login
            // The variables will be set there
            setTimeout(() => {
                // Set defaults
                selectedDraftWarMode = 'CLASSIC_PIRATE';
                draftWarOpponentMode = 'p2p';
                selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1;
                
                // Navigate to wager screen
                showScreen(draftWarWagerScreen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Show P2P options, hide bot difficulty
                const difficultyDiv = document.getElementById('draft-war-difficulty');
                const p2pDiv = document.getElementById('draft-war-p2p-options');
                if (difficultyDiv) difficultyDiv.classList.add('hidden');
                if (p2pDiv) p2pDiv.classList.remove('hidden');
                
                // Set default wager button as active
                document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('active'));
                const defaultWagerBtn = document.querySelector(`.wager-btn[data-wager="${selectedWager}"]`);
                if (defaultWagerBtn) defaultWagerBtn.classList.add('active');
                
                // Fill in the join code
                const tbJoinInput = document.getElementById('tb-join-code-input');
                if (tbJoinInput) {
                    tbJoinInput.value = pendingTBLobbyCode;
                    tbJoinInput.focus();
                    tbJoinInput.style.backgroundColor = 'rgba(255, 206, 0, 0.2)';
                    setTimeout(() => {
                        tbJoinInput.style.backgroundColor = '';
                    }, 2000);
                }
                
                pendingTBLobbyCode = null;
            }, 100); // Small delay to ensure everything is loaded
        }
    }

    // Apply developer configuration
    if (typeof applyDebugSettings === 'function') {
        applyDebugSettings();
    }

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Draft War Mode handlers - P2P ENABLED
    const playDraftWarBtn = document.getElementById('play-draft-war-btn');
    
    let selectedDraftWarMode = null;
    let selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1;  // Use config default
    let selectedTBDifficulty = null;
    let draftWarOpponentMode = null; // 'bot' or 'p2p'

    playDraftWarBtn?.addEventListener('click', () => {
        if (!draftWarManager.canStartDraftWar(gameState.currentUser)) {
            alert('⚠️ You need at least 6 cards to play Draft War!\n\nPlay some regular games to build your collection first.');
            return;
        }
        showScreen(draftWarSelectScreen);
    });

    document.getElementById('back-from-team-select-btn')?.addEventListener('click', () => {
        selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1; // Reset to default
        showLobby();
    });

    // Mode selection with Bot/P2P choice
    document.querySelectorAll('.select-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedDraftWarMode = btn.dataset.mode;
            selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1;
            
            // Ask: Bot or P2P?
            const choice = confirm('Play vs Bot (OK) or vs Player online (Cancel)?');
            draftWarOpponentMode = choice ? 'bot' : 'p2p';
            
            showScreen(draftWarWagerScreen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Show/hide difficulty selector based on mode
            const difficultyDiv = document.getElementById('draft-war-difficulty');
            const p2pDiv = document.getElementById('draft-war-p2p-options');
            
            if (draftWarOpponentMode === 'bot') {
                difficultyDiv.classList.remove('hidden');
                p2pDiv.classList.add('hidden');
            } else {
                difficultyDiv.classList.add('hidden');
                p2pDiv.classList.remove('hidden');
            }
            
            // Set default wager button as active
            document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('active'));
            const defaultWagerBtn = document.querySelector(`.wager-btn[data-wager="${selectedWager}"]`);
            if (defaultWagerBtn) defaultWagerBtn.classList.add('active');
        });
    });

    document.getElementById('back-from-wager-btn')?.addEventListener('click', () => {
        showScreen(draftWarSelectScreen);
    });

    document.querySelectorAll('.wager-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedWager = parseInt(btn.dataset.wager);
            document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Bot difficulty selection
    document.querySelectorAll('#draft-war-difficulty .btn-difficulty').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTBDifficulty = btn.dataset.difficulty;
            startDraftWar();
        });
    });

    // P2P Draft War handlers
    document.getElementById('tb-host-game-btn')?.addEventListener('click', async () => {
        const hostBtn = document.getElementById('tb-host-game-btn');
        const lobbyDisplay = document.getElementById('tb-lobby-code-display');
        const lobbyCodeSpan = document.getElementById('tb-lobby-code');
        const connectionStatus = document.getElementById('tb-connection-status');
        
        hostBtn.disabled = true;
        lobbyDisplay.classList.remove('hidden');
        connectionStatus.textContent = 'Initializing connection...';
        connectionStatus.className = 'connection-status loading';
        
        try {
            const code = await gameState.createLobby(gameState.currentUser);
            lobbyCodeSpan.textContent = code;
            connectionStatus.textContent = 'Waiting for opponent to join...';
            connectionStatus.className = 'connection-status';
            
            // Mark as waiting for draft war
            gameState.waitingForDraftWar = {
                mode: selectedDraftWarMode,
                wager: selectedWager
            };
        } catch (err) {
            connectionStatus.textContent = 'Error: ' + err.message;
            connectionStatus.className = 'connection-status error';
            hostBtn.disabled = false;
        }
    });

    document.getElementById('tb-join-game-btn')?.addEventListener('click', async () => {
        const code = document.getElementById('tb-join-code-input').value.trim();
        if (!code) {
            alert('Please enter a lobby code');
            return;
        }
        
        const joinBtn = document.getElementById('tb-join-game-btn');
        const joinStatus = document.getElementById('tb-join-status');
        
        joinBtn.disabled = true;
        joinStatus.classList.remove('hidden');
        joinStatus.textContent = 'Connecting...';
        joinStatus.className = 'connection-status loading';
        
        try {
            // Mark that we're joining for draft war
            gameState.joiningForDraftWar = true;
            
            await gameState.joinLobby(code, gameState.currentUser);
            joinStatus.textContent = 'Connected! Starting Draft War...';
            joinStatus.className = 'connection-status connected';
        } catch (err) {
            joinStatus.textContent = 'Failed: ' + err.message;
            joinStatus.className = 'connection-status error';
            joinBtn.disabled = false;
            gameState.joiningForDraftWar = false;
        }
    });

    const tbCopyLinkBtn = document.getElementById('tb-copy-link-btn');
    tbCopyLinkBtn?.addEventListener('click', () => {
        const lobbyCode = document.getElementById('tb-lobby-code').textContent;
        const currentUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${currentUrl}?tblobby=${lobbyCode}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            tbCopyLinkBtn.textContent = '✅ Link Copied!';
            setTimeout(() => {
                tbCopyLinkBtn.textContent = '📋 Copy Join Link';
            }, 2000);
        }).catch(() => {
            // Fallback if clipboard API doesn't work
            prompt('Copy this link to share:', shareUrl);
        });
    });

    // Draft War close lobby button
    const tbCloseLobbyBtn = document.getElementById('tb-close-lobby-btn');
    tbCloseLobbyBtn?.addEventListener('click', () => {
        if (confirm('Are you sure you want to close this lobby?')) {
            gameState.p2p.disconnect();
            const lobbyDisplay = document.getElementById('tb-lobby-code-display');
            const hostBtn = document.getElementById('tb-host-game-btn');
            const connectionStatus = document.getElementById('tb-connection-status');
            
            lobbyDisplay.classList.add('hidden');
            hostBtn.disabled = false;
            connectionStatus.textContent = '';
            
            // Clear the waiting flag
            gameState.waitingForDraftWar = null;
        }
    });

    function startDraftWar() {
        if (!selectedDraftWarMode) return;
        
        if (draftWarOpponentMode === 'bot') {
            if (!selectedTBDifficulty) return;
            startBotDraftWar();
        }
        // P2P draft war starts via P2P message handler
    }

    function startBotDraftWar() {
        try {
            const game = draftWarManager.startBotDraftWar(
                gameState.currentUser,
                selectedDraftWarMode,
                selectedWager,
                selectedTBDifficulty
            );
            
            renderDraftWarGame(game);
            showScreen(draftWarGameScreen);
            musicManager.play('draft-war');
        } catch (err) {
            alert(err.message);
        }
    }

    function startP2PDraftWar(hostDeck, guestDeck, hostUsername) {
        const isHost = gameState.isHost;
        const hostUser = isHost ? gameState.currentUser : { username: hostUsername, collection: new Set() };
        const guestUser = isHost ? gameState.opponentData : gameState.currentUser;
        
        const game = draftWarManager.startP2PDraftWar(
            hostUser,
            guestUser,
            hostDeck,
            guestDeck,
            selectedDraftWarMode,
            selectedWager,
            isHost
        );
        
        renderDraftWarGame(game);
        showScreen(draftWarGameScreen);
        musicManager.play('draft-war');
    }

    // Keep existing renderDraftWarGame and other functions...
    // But update assignCardToRoleSimple to send P2P message:

    function assignCardToRoleSimple(game, role) {
        try {
            const result = game.assignCard(1, role);
            
            // Send P2P message if not bot game
            if (!game.isBotGame) {
                gameState.p2p.send({
                    type: 'tbCardAssigned',
                    role: role,
                    cardId: game.player1.assignments[role].id,
                    gameState: game.serializeState()
                });
            }
            
            renderDraftWarGame(game);
            
            if (result.complete) {
                finishDraftWar(game);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function renderDraftWarGame(game) {
        const blindMode = DEV_CONFIG.GAME.TEAM_BATTLE_BLIND_ASSIGNMENT;
        
        document.getElementById('tb-player1-name').textContent = game.player1.user.username;
        document.getElementById('tb-player2-name').textContent = game.player2.user.username;
        document.getElementById('tb-phase').textContent = game.assignmentPhase + 1;
        
        // Update wager display
        document.getElementById('tb-player1-wager').textContent = game.wager;
        document.getElementById('tb-player2-wager').textContent = game.wager;
        
        updateTurnIndicator(game);
        renderTeamRoleSlots(game, blindMode);
        renderCardDrawArea(game);
    }

    function updateTurnIndicator(game) {
        const indicator = document.getElementById('tb-turn-indicator');
        if (game.currentTurn === 1) {
            indicator.textContent = '👉 Your Turn';
            indicator.style.color = 'var(--success)';
        } else {
            indicator.textContent = 'Opponent\'s Turn';
            indicator.style.color = 'var(--text-secondary)';
        }
    }

    function renderTeamRoleSlots(game, blindMode) {
        const p1Slots = document.getElementById('tb-player1-slots');
        const p2Slots = document.getElementById('tb-player2-slots');
        
        p1Slots.innerHTML = '';
        p2Slots.innerHTML = '';
        
        const roles = game.getRoles();

        // Determine which player data goes to which side
        // Host always on left (player1 slots), guest always on right (player2 slots)
        const isHost = gameState.isHost;
        const leftPlayer = isHost ? game.player1 : game.player2;
        const rightPlayer = isHost ? game.player2 : game.player1;
        
        // Update labels based on who's viewing
        const p1Column = document.getElementById('tb-player1-column');
        const p2Column = document.getElementById('tb-player2-column');
        
        if (isHost) {
            // Host view: left is "Your Team", right is "Opponent Team"
            p1Column.querySelector('h4').textContent = 'Your Team';
            p2Column.querySelector('h4').textContent = 'Opponent Team';
        } else {
            // Guest view: left is "Opponent Team" (host), right is "Your Team" (guest)
            p1Column.querySelector('h4').textContent = 'Opponent Team';
            p2Column.querySelector('h4').textContent = 'Your Team';
        }

        roles.forEach(role => {
            const roleInfo = ROLE_MODIFIERS[game.mode][role];
            
            // Left side - show if it's our team OR if blind mode is off
            const leftCard = leftPlayer.assignments[role];
            const showLeftCard = (isHost) || !blindMode;  // Host's cards on left - show if we're host OR blind off
            const leftSlot = createRoleSlot(role, roleInfo, leftCard, showLeftCard);
            p1Slots.appendChild(leftSlot);

            // Right side - show if it's our team OR if blind mode is off
            const rightCard = rightPlayer.assignments[role];
            const showRightCard = (!isHost) || !blindMode;  // Guest's cards on right - show if we're guest OR blind off
            const rightSlot = createRoleSlot(role, roleInfo, rightCard, showRightCard);
            p2Slots.appendChild(rightSlot);
        });
    }

    function createRoleSlot(role, roleInfo, card, showCard) {
        const slot = document.createElement('div');
        slot.className = 'role-slot';
        slot.setAttribute('data-role', role);
        
        if (card && showCard) {
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
            
            slot.innerHTML = `
                <div class="role-header">
                    <span class="role-name">${roleInfo.name}</span>
                    <span class="role-multiplier">×${roleInfo.multiplier}</span>
                </div>
                <div class="assigned-card">
                    <div class="card-image-small">${imgHTML}</div>
                    <div class="card-details">
                        <div class="card-name">${card.name}</div>
                        <span class="rarity-badge" style="color: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</span> 
                        <div class="card-power">⚔️ ${card.power}</div>
                    </div>
                </div>
            `;
        } else if (card && !showCard) {
            // Blind mode - show only "?" without name or power
            slot.innerHTML = `
                <div class="role-header">
                    <span class="role-name">${roleInfo.name}</span>
                    <span class="role-multiplier">×${roleInfo.multiplier}</span>
                </div>
                <div class="assigned-card hidden-card">
                    <div class="card-image-small" style="font-size: 48px; text-align: center; line-height: 80px;">❓</div>
                    <div class="card-details">
                        <div class="card-name" style="color: var(--text-secondary);">?</div>
                        <div class="card-power" style="color: var(--text-secondary);">⚔️ ?</div>
                    </div>
                </div>
            `;
        } else {
            slot.innerHTML = `
                <div class="role-header">
                    <span class="role-name">${roleInfo.name}</span>
                    <span class="role-multiplier">×${roleInfo.multiplier}</span>
                </div>
                <div class="empty-slot">
                    <span>Empty</span>
                </div>
            `;
        }
        
        return slot;
    }

    function renderCardDrawArea(game) {
        const container = document.getElementById('tb-card-selection');
        const controlsDiv = document.getElementById('tb-assignment-controls');
        
        // Bot's turn
        if (game.currentTurn !== 1) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Opponent is thinking...</p>';
            controlsDiv.classList.add('hidden');
            
            if (game.isBotGame && game.assignmentPhase < 6) {
                setTimeout(() => {
                    const result = game.botDrawAndAssign();
                    if (result) {
                        renderDraftWarGame(game);
                        
                        if (result.complete) {
                            finishDraftWar(game);
                        }
                    }
                }, 1500);
            }
            return;
        }
        
        // Player's turn
        if (game.assignmentPhase >= 6) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">All cards assigned!</p>';
            controlsDiv.classList.add('hidden');
            return;
        }
        
        // Show draw button or revealed card
        if (!game.player1.revealedCard) {
            // Show card back with draw button (like regular game)
            container.innerHTML = `
                <div class="tb-card-draw-area">
                    <div class="card-slot">
                        <div class="card-back">
                            <img src="img/back.png" alt="Card Back">
                        </div>
                    </div>
                    <button id="tb-draw-card-btn" class="btn btn-primary btn-large">Draw Card</button>
                </div>
            `;
            
            document.getElementById('tb-draw-card-btn').addEventListener('click', () => {
                const card = game.drawCard(1);
                
                // Send P2P message if not bot game
                if (!game.isBotGame) {
                    gameState.p2p.send({
                        type: 'tbCardDrawn',
                        card: card
                    });
                }
                
                renderDraftWarGame(game);
            });
            
            controlsDiv.classList.add('hidden');
        } else {
            // Show revealed card (like regular game card display)
            const card = game.player1.revealedCard;
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
            
            container.innerHTML = `
                <div class="tb-card-draw-area">
                    <div class="card-slot">
                        <div class="card revealed-card">
                            <div class="card-header">
                                <div class="card-name">${card.name}</div>
                                <div class="card-arc">${card.arc}</div>
                            </div>
                            <div class="card-image">${imgHTML}</div>
                            <div class="card-power">
                            <span class="rarity-badge" style="color: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</span>
                                ${card.power}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            showRoleSelectionSimple(game, card);
        }
    }

    function showRoleSelectionSimple(game, card) {
        const controlsDiv = document.getElementById('tb-assignment-controls');
        const roleButtonsDiv = document.getElementById('tb-role-buttons');
        const cardNameSpan = document.getElementById('tb-selected-card-name');
        
        cardNameSpan.textContent = card.name;
        roleButtonsDiv.innerHTML = '';
        
        const availableRoles = game.getAvailableRoles(1);
        
        availableRoles.forEach(role => {
            const roleInfo = ROLE_MODIFIERS[game.mode][role];
            
            const btn = document.createElement('button');
            btn.className = 'btn role-assign-btn-simple';
            btn.innerHTML = `
                <span class="role-name-large">${roleInfo.name}</span>
                <span class="role-desc">${roleInfo.description}</span>
            `;
            
            btn.addEventListener('click', () => {
                assignCardToRoleSimple(game, role);
            });
            
            roleButtonsDiv.appendChild(btn);
        });
        
        controlsDiv.classList.remove('hidden');
    }

    function finishDraftWar(game) {
        setTimeout(() => {
            const result = game.determineWinner();
            const finalResult = draftWarManager.endDraftWar(result);
            showDraftWarResults(game, finalResult);
        }, 1000);
    }

    function showDraftWarResults(game, result) {
        const titleEl = document.getElementById('tb-result-title');
        const statsEl = document.getElementById('tb-result-stats');
        
        // Stop Draft War music
        musicManager.stop();
        
        // Clear previous stats
        statsEl.innerHTML = '';
        
        // Calculate and award points
        const isPlayerWinner = result.winner && result.winner.username === gameState.currentUser.username;
        
        if (!result.conceded) {
            const pointsResult = pointsManager.calculateDraftWarPoints({
                ...result,
                score1: game.player1.score,
                score2: game.player2.score,
                isPlayerWinner
            });
            
            const totalPoints = pointsManager.awardPoints(gameState.currentUser.username, pointsResult.points);
            const newStreak = pointsManager.updateStreak(gameState.currentUser.username, isPlayerWinner);
            
            // Add points notification
            const pointsNotification = `
                <div class="points-earned">
                    <h3>⭐ Points Earned: ${pointsResult.points} ⭐</h3>
                    <p>Performance Grade: ${pointsResult.grade}</p>
                    <p>Win Streak: ${newStreak} 🔥</p>
                    <p>Total Points: ${totalPoints}</p>
                </div>
            `;
            
            statsEl.innerHTML += pointsNotification;
        }
        
        // Add arc unlock notification if any
        if (result.newlyUnlockedArcs && result.newlyUnlockedArcs.length > 0) {
            const arcUnlockNotification = `
                <div class="arc-unlock-notification">
                    <h3>🎊 New Arc${result.newlyUnlockedArcs.length > 1 ? 's' : ''} Unlocked! 🎊</h3>
                    ${result.newlyUnlockedArcs.map(arc => `<p>🏝️ ${arc}</p>`).join('')}
                    <p>New cards are now available!</p>
                </div>
            `;
            statsEl.innerHTML += arcUnlockNotification;
        }
        
        if (result.tie) {
            titleEl.textContent = "🤝 It's a Tie! 🤝";
            statsEl.innerHTML += `
                <p>Both teams scored equally!</p>
                <p>Final Score: ${result.score1} - ${result.score2}</p>
            `;
        } else if (result.conceded) {
            // Show concede message
            const isWinner = result.winner.username === gameState.currentUser.username;
            if (isWinner) {
                titleEl.textContent = '🎉 Victory! 🎉';
                statsEl.innerHTML += `
                    <p>${result.loser.username} conceded!</p>
                    <p>You win by forfeit!</p>
                `;
            } else {
                titleEl.textContent = '💔 You Conceded 💔';
                statsEl.innerHTML += `
                    <p>You forfeited the match.</p>
                `;
            }
        } else {
            const isWinner = result.winner.username === gameState.currentUser.username;
            titleEl.textContent = isWinner ? '🎉 Victory! 🎉' : '💔 Defeat 💔';
            
            statsEl.innerHTML += `
                <p>${result.winner.username} wins!</p>
                <p>Final Score: ${result.winnerScore} - ${result.loserScore}</p>
                <p>Cards Wagered: ${result.wager}</p>
            `;
        }
        
        // Show final teams
        renderFinalTeam(game, 1, 'tb-final-p1-name', 'tb-final-p1-roles', 'tb-final-p1-score');
        renderFinalTeam(game, 2, 'tb-final-p2-name', 'tb-final-p2-roles', 'tb-final-p2-score');
        
        // Show cards won
        if (result.cardsWon && result.cardsWon.length > 0 && result.winner.username === gameState.currentUser.username) {
            const cardsWonDisplay = document.getElementById('tb-cards-won-display');
            const cardsWonGrid = document.getElementById('tb-cards-won-grid');
            
            cardsWonDisplay.classList.remove('hidden');
            cardsWonGrid.innerHTML = '';
            
            result.cardsWon.forEach(card => {
                const cardDiv = createCollectionCard(card);
                cardsWonGrid.appendChild(cardDiv);
            });
        } else {
            document.getElementById('tb-cards-won-display').classList.add('hidden');
        }
        
        showScreen(draftWarResultsScreen);
    }

    function renderFinalTeam(game, playerNum, nameId, rolesId, scoreId) {
        const player = playerNum === 1 ? game.player1 : game.player2;
        
        document.getElementById(nameId).textContent = player.user.username;
        document.getElementById(scoreId).textContent = player.score;
        
        const rolesContainer = document.getElementById(rolesId);
        rolesContainer.innerHTML = '';
        
        for (const role in player.assignments) {
            const card = player.assignments[role];
            const roleInfo = ROLE_MODIFIERS[game.mode][role];
            let roleScore = game.calculateRoleScore(card, role);
            
            const roleDiv = document.createElement('div');
            roleDiv.className = 'final-role-item';
            
            let calculationHTML = `(${card.power} × ${roleInfo.multiplier}`;
            let bonusHTML = '';
            
            // Show type bonus and synergy if enabled
            if (DEV_CONFIG.GAME.TEAM_BATTLE_TYPE_BONUS && card.type) {
                const bonusInfo = game.getTypeBonusInfo(card, role);
                if (bonusInfo) {
                    calculationHTML += ` × ${bonusInfo.baseBonus}`;
                    bonusHTML = `<span class="type-bonus" style="color: ${bonusInfo.color}">${bonusInfo.icon} ${bonusInfo.type}</span>`;
                    
                    if (bonusInfo.hasSynergy) {
                        calculationHTML += ` × ${bonusInfo.synergyBonus}`;
                        bonusHTML += `<span class="synergy-bonus">✨ Synergy!</span>`;
                    }
                }
            }
            
            calculationHTML += ` = ${roleScore})`;
            
            roleDiv.innerHTML = `
                <span class="role-label">${roleInfo.name}:</span>
                <span class="card-name">${card.name}</span>
                ${bonusHTML}
                <span class="role-calculation">${calculationHTML}</span>
            `;
            rolesContainer.appendChild(roleDiv);
        }
    }

    function createCollectionCard(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'collection-card';
        cardDiv.setAttribute('data-rarity', card.rarity);
        
        const img = CHARACTER_IMAGES[card.name] || '❓';
        const imgHTML = img !== '❓' ? `<img src="${img}" alt="${card.name}">` : img;
        
        cardDiv.innerHTML = `
            <div class="card-header">
                <div class="card-name">${card.name}</div>
                <div class="card-arc">${card.arc}</div>
            </div>
            <div class="card-image">${imgHTML}</div>
            <div class="card-power">
                <span class="rarity-badge" style="color: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</span>
                ${card.power}
            </div>
        `;
        
        return cardDiv;
    }

    document.getElementById('tb-return-lobby-btn')?.addEventListener('click', () => {
        showLobby();
    });

    document.getElementById('tb-concede-btn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to concede?')) {
            const game = draftWarManager.currentGame;
            
            // Send P2P message if not bot game
            if (!game.isBotGame) {
                gameState.p2p.send({
                    type: 'tbConcede'
                });
            }
            
            const result = draftWarManager.endDraftWar({
                winner: game.player2.user,
                loser: game.player1.user,
                winnerScore: 0,
                loserScore: 0,
                cardsWon: [],
                wager: 0,
                conceded: true  // Add this flag
            });
            showDraftWarResults(game, result);
        }
    });
});
