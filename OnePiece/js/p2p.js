// P2P Connection Manager
class P2PManager {
    constructor() {
        this.peer = null;
        this.connection = null;
        this.isHost = false;
        this.onMessage = null;
        this.onConnectionEstablished = null;
        this.onConnectionClosed = null;
    }

    initialize(userId) {
        return new Promise((resolve, reject) => {
            // Add timeout for initialization
            const timeout = setTimeout(() => {
                if (this.peer) this.peer.destroy();
                reject(new Error('Peer initialization timeout (30s). Please check your connection and try again.'));
            }, 30000);

            this.peer = new Peer(userId, {
                debug: 1, // Enable some logging for troubleshooting
                config: {
                    iceServers: [
                        // Google STUN servers (most reliable)
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun3.l.google.com:19302' },
                        { urls: 'stun:stun4.l.google.com:19302' },
                        
                        // Twilio STUN server
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ],
                    // Improve connection reliability
                    iceTransportPolicy: 'all',
                    iceCandidatePoolSize: 10
                },
                // Serialization for reliable data transfer
                serialization: 'json'
            });

            this.peer.on('open', (id) => {
                clearTimeout(timeout);
                console.log('✅ Peer initialized with ID:', id);
                resolve(id);
            });

            this.peer.on('error', (err) => {
                clearTimeout(timeout);
                console.error('❌ Peer error:', err);
                
                // Provide more helpful error messages
                let errorMsg = 'Connection failed: ';
                if (err.type === 'peer-unavailable') {
                    errorMsg += 'Lobby code not found or expired. Please check the code and try again.';
                } else if (err.type === 'network') {
                    errorMsg += 'Network error. Check your internet connection.';
                } else if (err.type === 'server-error') {
                    errorMsg += 'Server error. Please try again in a moment.';
                } else {
                    errorMsg += err.message || 'Unknown error';
                }
                
                reject(new Error(errorMsg));
            });

            // Listen for incoming connections (when someone joins your lobby)
            this.peer.on('connection', (conn) => {
                console.log('📞 Incoming connection from:', conn.peer);
                this.connection = conn;
                this.setupConnection();
            });

            // Add disconnected handler for debugging
            this.peer.on('disconnected', () => {
                console.warn('⚠️ Peer disconnected from signaling server, attempting reconnect...');
                if (!this.peer.destroyed) {
                    this.peer.reconnect();
                }
            });
        });
    }

    connectToPeer(peerId) {
        return new Promise((resolve, reject) => {
            console.log('🔗 Connecting to peer:', peerId);
            
            // Add timeout for connection attempt
            const timeout = setTimeout(() => {
                if (this.connection) this.connection.close();
                reject(new Error('Connection timeout (30s). Host may not be available or lobby code is invalid.'));
            }, 30000);
            
            this.connection = this.peer.connect(peerId, {
                reliable: true,
                serialization: 'json'
            });

            this.connection.on('open', () => {
                clearTimeout(timeout);
                console.log('✅ Connection opened successfully');
                this.setupConnection();
                resolve();
            });

            this.connection.on('error', (err) => {
                clearTimeout(timeout);
                console.error('❌ Connection error:', err);
                reject(new Error('Failed to connect: ' + (err.message || 'Unknown error')));
            });
        });
    }

    setupConnection() {
        this.connection.on('data', (data) => {
            console.log('Received data:', data);
            if (this.onMessage) {
                this.onMessage(data);
            }
        });

        this.connection.on('close', () => {
            console.log('Connection closed');
            if (this.onConnectionClosed) {
                this.onConnectionClosed();
            }
        });

        if (this.onConnectionEstablished) {
            this.onConnectionEstablished();
        }
    }

    send(data) {
        if (this.connection && this.connection.open) {
            console.log('Sending data:', data);
            this.connection.send(data);
            return true;
        }
        console.error('Cannot send - connection not open');
        return false;
    }

    disconnect() {
        if (this.connection) {
            this.connection.close();
        }
        if (this.peer) {
            this.peer.destroy();
        }
        this.connection = null;
        this.peer = null;
    }
}
