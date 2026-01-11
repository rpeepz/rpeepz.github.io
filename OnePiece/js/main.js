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
                    const hostDeck = gameState.createDeck(gameState.currentUser, 5);
                    const guestDeck = gameState.createDeck(gameState.opponentData, 5);
                    
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

    // Game screen handlers
    playCardBtn.addEventListener('click', () => {
        if (hasPlayedThisRound) return;
        
        hasPlayedThisRound = true;
        playCardBtn.disabled = true;
        waitingMessage.classList.remove('hidden');
        
        const result = gameState.playCard();
        displayCard(result.card, result.isPlayer1);
        
        // Check if opponent already played
        if (gameState.checkBothPlayed()) {
            waitingMessage.classList.add('hidden');
            showBothCards();
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
        const gameOver = gameState.checkGameOver();
        if (gameOver) {
            endGameSession(gameOver);
        } else {
            // Reset for next round
            hasPlayedThisRound = false;
            playCardBtn.disabled = false;
            player1CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
            player2CardSlot.innerHTML = '<div class="card-back"><img src="https://toppng.com/uploads/thumbnail/jolly-roger-anime-one-manga-anime-straw-hats-straw-hat-pirates-jolly-roger-11562951369qechcoicmy.png" alt="Card Back"></div>';
        }
    });

    returnLobbyBtn.addEventListener('click', () => {
        gameState.cleanup();
        showLobby();
    });

    function showBothCards() {
        const img1 = CHARACTER_IMAGES[gameState.currentGame.player1Card.name] || '❓';
        const img2 = CHARACTER_IMAGES[gameState.currentGame.player2Card.name] || '❓';
        
        const result = gameState.resolveRound();
        
        const p1Class = gameState.isHost ? 'my-card' : 'opponent-card';
        const p2Class = !gameState.isHost ? 'my-card' : 'opponent-card';
        
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
        const isMyCard = (isPlayer1 && gameState.isHost) || (!isPlayer1 && !gameState.isHost);
        
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
        cardsCollectedSpan.textContent = user.collection.size;
        
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
        const selectedArc = arcFilter.value;
        const userCollection = gameState.currentUser.collection;
        
        let cards = CARD_DATABASE;
        if (selectedArc !== 'all') {
            cards = cards.filter(card => card.arc === selectedArc);
        }
        
        collectionGrid.innerHTML = '';
        
        cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.style = `border: 1px solid;padding: 3px;margin: 3px;`;
            cardDiv.className = 'collection-card';
            if (!userCollection.has(card.id)) {
                cardDiv.classList.add('locked');
                cardDiv.style = `border: 1px solid;
                                padding: 3px;margin: 3px;
                                background: rgba(128, 128, 128, 0.6);
                                filter: grayscale(100%);`;
            }
            
            const img = CHARACTER_IMAGES[card.name] || '❓';
            const imgHTML = img.startsWith('http') ? `<img src="${img}" alt="${card.name}">` : img;

            cardDiv.innerHTML = `
                <div class="card-header">
                    <div class="card-name">${card.name}</div>
                    <div class="card-arc">${card.arc}</div>
                </div>
                <div class="card-image">${imgHTML}</div>
                <div class="card-power">${userCollection.has(card.id) ? card.power : '?'}</div>
            `;
            
            collectionGrid.appendChild(cardDiv);
        });
    }

    function startGameSession() {
        hasPlayedThisRound = false;
        
        // Start battle music
        musicManager.play();
        
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
                cardDiv.className = 'collection-card';
                cardDiv.innerHTML = `
                    <div class="card-header">
                        <div class="card-name">${card.name}</div>
                        <div class="card-arc">${card.arc}</div>
                    </div>
                    <div class="card-image">${imgHTML}</div>
                    <div class="card-power">${card.power}</div>
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
});
