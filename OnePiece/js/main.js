// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const loginScreen = document.getElementById('login-screen');
    const lobbyScreen = document.getElementById('lobby-screen');
    const collectionScreen = document.getElementById('collection-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameoverScreen = document.getElementById('gameover-screen');

    // Login screen elements
    const guestBtn = document.getElementById('guest-btn');
    const claimProfileBtn = document.getElementById('claim-profile-btn');
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
    const collectionGrid = document.getElementById('collection-grid');
    
    // Game screen elements
    const player1NameSpan = document.getElementById('player1-name');
    const player2NameSpan = document.getElementById('player2-name');
    const player1CardsSpan = document.getElementById('player1-cards');
    const player2CardsSpan = document.getElementById('player2-cards');
    const player1ScoreSpan = document.getElementById('player1-score');
    const player2ScoreSpan = document.getElementById('player2-score');
    const roundNumberSpan = document.getElementById('round-number');
    const player1CardSlot = document.getElementById('player1-card-slot');
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
    
    // Store it to use after login
    let pendingLobbyCode = lobbyCodeFromUrl;
    let currentFormMode = null;
    let hasPlayedThisRound = false;

    // Initialize music
    musicManager.initialize();

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

    // Music control handlers
    document.getElementById('volume-full').addEventListener('click', () => {
        musicManager.setVolume(1.0);
        document.querySelectorAll('.volume-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('volume-full').classList.add('active');
    });

    document.getElementById('volume-half').addEventListener('click', () => {
        musicManager.setVolume(0.2);
        document.querySelectorAll('.volume-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('volume-half').classList.add('active');
    });

    document.getElementById('volume-mute').addEventListener('click', () => {
        musicManager.setVolume(0);
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
        const saved = localStorage.getItem('arcAvailability');
        if (saved) {
            const savedState = JSON.parse(saved);
            // Update saga controls based on saved state
            for (const saga in SAGA_CONTROLS) {
                const allEnabled = SAGA_CONTROLS[saga].arcs.every(arc => savedState[arc]);
                const allDisabled = SAGA_CONTROLS[saga].arcs.every(arc => !savedState[arc]);
                if (allEnabled || allDisabled) SAGA_CONTROLS[saga].enabled = allEnabled;
            }
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

    claimProfileBtn.addEventListener('click', () => {
        currentFormMode = 'claim';
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

        if (currentFormMode === 'claim') {
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
    copyLinkBtn.addEventListener('click', () => {
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

    // Add this new event listener
    const ownedOnlyFilter = document.getElementById('owned-only-filter');
    ownedOnlyFilter.addEventListener('change', () => {
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

            player1CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
            player2CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
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
        player1CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
        player2CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
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
        const img1HTML = img1.startsWith('http') ? `<img src="${img1}" alt="${result.card1.name}">` : img1;
        const img2HTML = img2.startsWith('http') ? `<img src="${img2}" alt="${result.card2.name}">` : img2;
        
        player1CardSlot.innerHTML = `
            <div class="card ${p1Class} ${result.winner === 1 ? 'winner' : ''}">
                <div class="card-header">
                    <div class="card-name">${result.card1.name}</div>
                    <div class="card-arc">${result.card1.arc}</div>
                </div>
                <div class="card-image">${img1HTML}</div>
                <div class="card-power">${result.card1.power}</div>
            </div>
        `;
        
        player2CardSlot.innerHTML = `
            <div class="card ${p2Class} ${result.winner === 2 ? 'winner' : ''}">
                <div class="card-header">
                    <div class="card-name">${result.card2.name}</div>
                    <div class="card-arc">${result.card2.arc}</div>
                </div>
                <div class="card-image">${img2HTML}</div>
                <div class="card-power">${result.card2.power}</div>
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
        const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
        
        const cardHTML = `
            <div class="card ${isMyCard ? 'my-card' : 'opponent-card'}">
                <div class="card-header">
                    <div class="card-name">${card.name}</div>
                    <div class="card-arc">${card.arc}</div>
                </div>
                <div class="card-image">${imgHTML}</div>
                <div class="card-power">${card.power}</div>
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
        playerNameSpan.textContent = user.username;
        winsSpan.textContent = user.wins;
        lossesSpan.textContent = user.losses;
        
        const totalEnabled = getTotalEnabledCards();
        cardsCollectedSpan.textContent = `${user.collection.size}/${totalEnabled}`;
    
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
        
        showScreen(lobbyScreen);
    }

    function showCollection() {
        // Populate saga filter
        sagaFilter.innerHTML = '<option value="all">All Sagas</option>';
        for (const saga in DEV_CONFIG.SAGA_DEFINITIONS) {
            const option = document.createElement('option');
            option.value = saga;
            option.textContent = saga.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            sagaFilter.appendChild(option);
        }
        
        // Populate arc filter
        arcFilter.innerHTML = '<option value="all">All Arcs</option>';
        ARCS.forEach(arc => {
            const option = document.createElement('option');
            option.value = arc;
            option.textContent = arc;
            arcFilter.appendChild(option);
        });
        
        renderCollection();
        showScreen(collectionScreen);
    }

    function renderCollection() {
        const selectedSaga = sagaFilter.value;
        const selectedArc = arcFilter.value;
        const ownedOnly = ownedOnlyFilter.checked;
        const userCollection = gameState.currentUser.collection;
        
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
        
        // Filter out cards from disabled arcs
        cards = cards.filter(card => ARC_AVAILABILITY[card.arc] === true && card.available);
        
        // Filter for owned only if checkbox is checked
        if (ownedOnly) {
            cards = cards.filter(card => userCollection.has(card.id));
        }
        
        collectionGrid.innerHTML = '';
        
        if (cards.length === 0) {
            collectionGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">No cards to display</p>';
            return;
        }
        
        cards.forEach(card => {
            const owned = userCollection.has(card.id);
            
            const cardDiv = document.createElement('div');
            cardDiv.style = `border: 1px solid;padding: 3px;margin: 3px;`;
            cardDiv.className = `collection-card ${owned ? '' : 'locked'}`;
            cardDiv.setAttribute('data-rarity', card.rarity);
            
            if (!owned) {
                cardDiv.style = `border: 1px solid;
                                padding: 3px;margin: 3px;
                                background: rgba(128, 128, 128, 0.6);
                                filter: grayscale(100%);`;
            }
            
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;

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
            
            collectionGrid.appendChild(cardDiv);
        });
    }

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
        player1CardsSpan.textContent = 5;
        player2CardsSpan.textContent = 5;
        player1ScoreSpan.textContent = 0;
        player2ScoreSpan.textContent = 0;
        roundNumberSpan.textContent = 1;
        
        player1CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
        player2CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
        waitingMessage.classList.add('hidden');
        playCardBtn.disabled = false;
        
        showScreen(gameScreen);
    }

    function endGameSession(gameOver) {
        // Stop battle music
        musicManager.stop();

        const result = gameState.endGame(gameOver);
        
        if (result.tie) {
            gameoverResult.textContent = "🤝 It's a Tie! 🤝";
            gameoverStats.innerHTML = `
                <p>Both players scored equally!</p>
                <p>Final Score: ${gameState.currentGame.player1.score} - ${gameState.currentGame.player2.score}</p>
            `;
        } else if (result.conceded) {
            gameoverResult.textContent = result.winner.username === gameState.currentUser.username ? 
                '🎉 Victory by Concession! 🎉' : '💔 You Conceded 💔';
            gameoverStats.innerHTML = `
                <p>${result.winner.username} wins!</p>
                <p>Total Wins: ${result.winner.wins} | Total Losses: ${result.winner.losses}</p>
            `;
        } else {
            gameoverResult.textContent = result.winner.username === gameState.currentUser.username ? 
                '🎉 Victory! 🎉' : '💔 Defeat 💔';
            
            gameoverStats.innerHTML = `
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
                const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
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

    // Apply developer configuration
    if (typeof applyDebugSettings === 'function') {
        applyDebugSettings();
    }
    if (typeof applySagaConfig === 'function') {
        applySagaConfig();
    }

    // Scroll to top functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Team Battle Mode handlers
    const playTeamBattleBtn = document.getElementById('play-team-battle-btn');
    const teamBattleSelectScreen = document.getElementById('team-battle-select-screen');
    const teamBattleWagerScreen = document.getElementById('team-battle-wager-screen');
    const teamBattleGameScreen = document.getElementById('team-battle-game-screen');
    const teamBattleResultsScreen = document.getElementById('team-battle-results-screen');

    let selectedTeamBattleMode = null;
    let selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1;  // Use config default
    let selectedTBDifficulty = null;
    let selectedCardForAssignment = null;

    playTeamBattleBtn?.addEventListener('click', () => {
        if (!teamBattleManager.canStartTeamBattle(gameState.currentUser)) {
            alert('⚠️ You need at least 6 cards to play Team Battle!\n\nPlay some regular games to build your collection first.');
            return;
        }
        showScreen(teamBattleSelectScreen);
    });

    document.getElementById('back-from-team-select-btn')?.addEventListener('click', () => {
        selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1; // Reset to default
        showLobby();
    });

    document.querySelectorAll('.select-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTeamBattleMode = btn.dataset.mode;
            selectedWager = DEV_CONFIG.GAME.TEAM_BATTLE_DEFAULT_WAGER || 1; // Reset to default
            showScreen(teamBattleWagerScreen);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Set default wager button as active
            document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('active'));
            const defaultWagerBtn = document.querySelector(`.wager-btn[data-wager="${selectedWager}"]`);
            if (defaultWagerBtn) defaultWagerBtn.classList.add('active');
        });
    });

    document.getElementById('back-from-wager-btn')?.addEventListener('click', () => {
        showScreen(teamBattleSelectScreen);
    });

    document.querySelectorAll('.wager-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedWager = parseInt(btn.dataset.wager);
            document.querySelectorAll('.wager-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.querySelectorAll('#team-battle-difficulty .btn-difficulty').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTBDifficulty = btn.dataset.difficulty;
            startTeamBattle();
        });
    });

    function startTeamBattle() {
        if (!selectedTeamBattleMode || !selectedTBDifficulty) return;
        
        try {
            const game = teamBattleManager.startBotTeamBattle(
                gameState.currentUser,
                selectedTeamBattleMode,
                selectedWager,
                selectedTBDifficulty
            );
            
            renderTeamBattleGame(game);
            showScreen(teamBattleGameScreen);
            
            // Play Team Battle music
            musicManager.play('team-battle');
        } catch (err) {
            alert(err.message);
        }
    }

    function renderTeamBattleGame(game) {
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
        
        roles.forEach(role => {
            const roleInfo = ROLE_MODIFIERS[game.mode][role];
            
            // Player 1 slot
            const p1Card = game.player1.assignments[role];
            const p1Slot = createRoleSlot(role, roleInfo, p1Card, true);
            p1Slots.appendChild(p1Slot);
            
            // Player 2 slot
            const p2Card = game.player2.assignments[role];
            const p2Slot = createRoleSlot(role, roleInfo, p2Card, !blindMode);
            p2Slots.appendChild(p2Slot);
        });
    }

    function createRoleSlot(role, roleInfo, card, showCard) {
        const slot = document.createElement('div');
        slot.className = 'role-slot';
        slot.setAttribute('data-role', role);
        
        if (card && showCard) {
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
            
            slot.innerHTML = `
                <div class="role-header">
                    <span class="role-name">${roleInfo.name}</span>
                    <span class="role-multiplier">×${roleInfo.multiplier}</span>
                </div>
                <div class="assigned-card">
                    <div class="card-image-small">${imgHTML}</div>
                    <div class="card-details">
                        <div class="card-name">${card.name}</div>
                        <div class="card-power">⚔️ ${card.power}</div>
                    </div>
                </div>
            `;
        } else if (card && !showCard) {
            slot.innerHTML = `
                <div class="role-header">
                    <span class="role-name">${roleInfo.name}</span>
                    <span class="role-multiplier">×${roleInfo.multiplier}</span>
                </div>
                <div class="assigned-card hidden-card">
                    <div class="card-back-small">?</div>
                    <div class="card-details">
                        <div class="card-name">Hidden</div>
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
                        renderTeamBattleGame(game);
                        
                        if (result.complete) {
                            finishTeamBattle(game);
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
                            <img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back">
                        </div>
                    </div>
                    <button id="tb-draw-card-btn" class="btn btn-primary btn-large">Draw Card</button>
                </div>
            `;
            
            document.getElementById('tb-draw-card-btn').addEventListener('click', () => {
                const card = game.drawCard(1);
                renderTeamBattleGame(game);
            });
            
            controlsDiv.classList.add('hidden');
        } else {
            // Show revealed card (like regular game card display)
            const card = game.player1.revealedCard;
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
            
            container.innerHTML = `
                <div class="tb-card-draw-area">
                    <div class="card-slot">
                        <div class="card revealed-card">
                            <div class="card-header">
                                <div class="card-name">${card.name}</div>
                                <div class="card-arc">${card.arc}</div>
                            </div>
                            <div class="card-image">${imgHTML}</div>
                            <div class="card-power">${card.power}</div>
                        </div>
                    </div>
                </div>
            `;
            
            showRoleSelectionSimple(game, card);
        }
    }

    function createRevealedCardHTML(card) {
        const img = CHARACTER_IMAGES[card.name] || '❓';
        const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
        
        return `
            <div class="hand-card revealed">
                <div class="card-image">${imgHTML}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-power">⚔️ ${card.power}</div>
                <div class="card-rarity" style="background: ${RARITY_TIERS[card.rarity].color}">${card.rarity}</div>
            </div>
        `;
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

    function assignCardToRoleSimple(game, role) {
        try {
            const result = game.assignCard(1, role);
            
            renderTeamBattleGame(game);
            
            if (result.complete) {
                finishTeamBattle(game);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function finishTeamBattle(game) {
        setTimeout(() => {
            const result = game.determineWinner();
            const finalResult = teamBattleManager.endTeamBattle(result);
            showTeamBattleResults(game, finalResult);
        }, 1000);
    }

    function showTeamBattleResults(game, result) {
        const titleEl = document.getElementById('tb-result-title');
        const statsEl = document.getElementById('tb-result-stats');
        
        // Stop Team Battle music
        musicManager.stop();
        
        if (result.tie) {
            titleEl.textContent = "🤝 It's a Tie! 🤝";
            statsEl.innerHTML = `
                <p>Both teams scored equally!</p>
                <p>Final Score: ${result.score1} - ${result.score2}</p>
            `;
        } else {
            const isWinner = result.winner.username === gameState.currentUser.username;
            titleEl.textContent = isWinner ? '🎉 Victory! 🎉' : '💔 Defeat 💔';
            
            statsEl.innerHTML = `
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
        
        showScreen(teamBattleResultsScreen);
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
            const roleScore = Math.round(card.power * roleInfo.multiplier);
            
            const roleDiv = document.createElement('div');
            roleDiv.className = 'final-role-item';
            roleDiv.innerHTML = `
                <span class="role-label">${roleInfo.name}:</span>
                <span class="card-name">${card.name}</span>
                <span class="role-calculation">(${card.power} × ${roleInfo.multiplier} = ${roleScore})</span>
            `;
            rolesContainer.appendChild(roleDiv);
        }
    }

    function createCollectionCard(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'collection-card';
        cardDiv.setAttribute('data-rarity', card.rarity);
        
        const img = CHARACTER_IMAGES[card.name] || '❓';
        const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;
        
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
            const game = teamBattleManager.currentGame;
            const result = teamBattleManager.endTeamBattle({
                winner: game.player2.user,
                loser: game.player1.user,
                winnerScore: 0,
                loserScore: 0,
                cardsWon: [],
                wager: 0
            });
            showTeamBattleResults(game, result);
        }
    });
});
