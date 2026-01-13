// Lobby Manager - Handles lobby persistence and discovery
class LobbyManager {
    constructor() {
        this.STORAGE_KEY = 'onePieceLobbies';
        this.MY_LOBBY_KEY = 'onePieceMyLobby';
        this.LOBBY_EXPIRY = 10 * 60 * 1000; // 10 minutes
        this.cleanupInterval = null;
    }

    // Initialize and start cleanup
    initialize() {
        this.startCleanup();
        this.restoreMyLobby();
    }

    // Create a new lobby
    createLobby(lobbyCode, username, gameType = 'duel') {
        const lobbies = this.getAllLobbies();
        const lobby = {
            code: lobbyCode,
            host: username,
            gameType: gameType, // 'duel' or 'draft-war'
            timestamp: Date.now(),
            status: 'open' // 'open' or 'in-game'
        };
        
        lobbies[lobbyCode] = lobby;
        this.saveLobbies(lobbies);
        this.saveMyLobby(lobby);
        
        return lobby;
    }

    // Save my active lobby (for rejoin on refresh)
    saveMyLobby(lobby) {
        try {
            localStorage.setItem(this.MY_LOBBY_KEY, JSON.stringify(lobby));
        } catch (e) {
            console.error('Failed to save my lobby:', e);
        }
    }

    // Get my active lobby
    getMyLobby() {
        try {
            const data = localStorage.getItem(this.MY_LOBBY_KEY);
            if (!data) return null;
            
            const lobby = JSON.parse(data);
            
            // Check if lobby is expired
            if (Date.now() - lobby.timestamp > this.LOBBY_EXPIRY) {
                this.clearMyLobby();
                return null;
            }
            
            return lobby;
        } catch (e) {
            console.error('Failed to get my lobby:', e);
            return null;
        }
    }

    // Clear my lobby
    clearMyLobby() {
        try {
            localStorage.removeItem(this.MY_LOBBY_KEY);
        } catch (e) {
            console.error('Failed to clear my lobby:', e);
        }
    }

    // Restore my lobby on page load
    restoreMyLobby() {
        const myLobby = this.getMyLobby();
        if (myLobby) {
            console.log('Found active lobby to restore:', myLobby);
            return myLobby;
        }
        return null;
    }

    // Update lobby status
    updateLobbyStatus(lobbyCode, status) {
        const lobbies = this.getAllLobbies();
        if (lobbies[lobbyCode]) {
            lobbies[lobbyCode].status = status;
            lobbies[lobbyCode].timestamp = Date.now();
            this.saveLobbies(lobbies);
            
            // Update my lobby if it's mine
            const myLobby = this.getMyLobby();
            if (myLobby && myLobby.code === lobbyCode) {
                myLobby.status = status;
                this.saveMyLobby(myLobby);
            }
        }
    }

    // Close a lobby
    closeLobby(lobbyCode) {
        const lobbies = this.getAllLobbies();
        delete lobbies[lobbyCode];
        this.saveLobbies(lobbies);
        
        // Clear my lobby if it matches
        const myLobby = this.getMyLobby();
        if (myLobby && myLobby.code === lobbyCode) {
            this.clearMyLobby();
        }
    }

    // Get all lobbies
    getAllLobbies() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Failed to get lobbies:', e);
            return {};
        }
    }

    // Get open lobbies only
    getOpenLobbies(gameType = null) {
        const allLobbies = this.getAllLobbies();
        const now = Date.now();
        
        return Object.values(allLobbies).filter(lobby => {
            // Filter by status and expiry
            const isValid = lobby.status === 'open' && 
                           (now - lobby.timestamp) < this.LOBBY_EXPIRY;
            
            // Filter by game type if specified
            if (gameType) {
                return isValid && lobby.gameType === gameType;
            }
            
            return isValid;
        }).sort((a, b) => b.timestamp - a.timestamp); // Newest first
    }

    // Save lobbies to storage
    saveLobbies(lobbies) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lobbies));
        } catch (e) {
            console.error('Failed to save lobbies:', e);
        }
    }

    // Clean up expired lobbies
    cleanup() {
        const lobbies = this.getAllLobbies();
        const now = Date.now();
        let changed = false;
        
        Object.keys(lobbies).forEach(code => {
            if ((now - lobbies[code].timestamp) > this.LOBBY_EXPIRY) {
                delete lobbies[code];
                changed = true;
            }
        });
        
        if (changed) {
            this.saveLobbies(lobbies);
        }
    }

    // Start periodic cleanup
    startCleanup() {
        // Clean up immediately
        this.cleanup();
        
        // Then every minute
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60000);
    }

    // Stop cleanup
    stopCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}

// Global instance
const lobbyManager = new LobbyManager();
