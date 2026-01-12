// Developer Configuration
// Toggle features and debug options here

const DEV_CONFIG = {
    // Feature Toggles
    FEATURES: {
        BOT_MODE: true,
        P2P_MULTIPLAYER: true,
        ADMIN_PANEL: false,
        MUSIC_PLAYER: true,
        THEME_TOGGLE: true,
        SCROLL_TO_TOP: true,
        COLLECTION_VIEWER: true,
        TEAM_BATTLE_MODE: true
    },

    // Debug Options
    DEBUG: {
        CLEAR_DATA_BUTTON: false,
        CONSOLE_LOGGING: false,
        SHOW_CARD_IDS: true,
        SKIP_LOGIN: false,
        UNLIMITED_CARDS: false
    },

    // Arc Availability - Control which arcs are enabled
    ARCS: {
        "Romance Dawn": true,
        "Orange Town": true,
        "Syrup Village": true,
        "Baratie": true,
        "Arlong Park": true,
        "Loguetown": true,
        "Whiskey Peak": true,
        "Little Garden": true,
        "Drum Island": true,
        "Alabasta": true,
        "Jaya": true,
        "Skypiea": true,
        "Long Ring Long Land": true,
        "Water 7": true,
        "Enies Lobby": true,
        "Thriller Bark": true,
        "Sabaody Archipelago": true,
        "Amazon Lily": true,
        "Impel Down": true,
        "Marineford": true
    },

    // Quick Saga Toggles (optional - easier than individual arcs)
    // Set to null to ignore, or true/false to enable/disable all arcs in saga
    SAGA_PRESETS: {
        EAST_BLUE: null,        // null = use individual arc settings above
        BAROQUE_WORKS: null,
        SKY_ISLAND: null,
        WATER_SEVEN: null,
        SUMMIT_WAR: null
    },

    // Saga definitions (for preset toggles)
    SAGA_DEFINITIONS: {
        EAST_BLUE: ["Romance Dawn", "Orange Town", "Syrup Village", "Baratie", "Arlong Park", "Loguetown"],
        BAROQUE_WORKS: ["Whiskey Peak", "Little Garden", "Drum Island", "Alabasta"],
        SKY_ISLAND: ["Jaya", "Skypiea"],
        WATER_SEVEN: ["Long Ring Long Land", "Water 7", "Enies Lobby"],
        SUMMIT_WAR: ["Thriller Bark", "Sabaody Archipelago", "Amazon Lily", "Impel Down", "Marineford"]
    },

    // Game Settings
    GAME: {
        MAX_ROUNDS: 5,
        STARTING_CARDS: 30,
        DECK_SIZE: 5,
        AUTO_SAVE: true,
        TEAM_BATTLE_BLIND_ASSIGNMENT: true,
        TEAM_BATTLE_DEFAULT_WAGER: 1
    },

    // UI Settings
    UI: {
        SHOW_VERSION_NUMBER: true,
        SHOW_STATS_BAR: true,
        ANIMATE_CARDS: true,
        SHOW_RARITY_GLOW: true
    }
};

// Generate ARC_AVAILABILITY from dev config
function generateArcAvailabilityFromConfig() {
    const availability = {};
    
    // First, apply saga presets if set (not null)
    for (const saga in DEV_CONFIG.SAGA_PRESETS) {
        const preset = DEV_CONFIG.SAGA_PRESETS[saga];
        // Only apply preset if it's explicitly true or false (not null)
        if (preset !== null && DEV_CONFIG.SAGA_DEFINITIONS[saga]) {
            DEV_CONFIG.SAGA_DEFINITIONS[saga].forEach(arc => {
                availability[arc] = preset;
            });
        }
    }
    
    // Then, apply individual arc settings (these override presets only if preset was null)
    for (const arc in DEV_CONFIG.ARCS) {
        // If arc doesn't have a value from presets (because preset was null), use individual setting
        if (!(arc in availability)) {
            availability[arc] = DEV_CONFIG.ARCS[arc];
        }
        // If preset was set (true/false), it takes priority over individual arc setting
    }
    
    return availability;
}

// This will be used instead of the hardcoded ARC_AVAILABILITY
const ARC_AVAILABILITY = generateArcAvailabilityFromConfig();

// Apply saga settings to ARC_AVAILABILITY
function applySagaConfig() {
    if (typeof SAGA_CONTROLS !== 'undefined') {
        for (const saga in DEV_CONFIG.SAGAS) {
            if (SAGA_CONTROLS[saga]) {
                SAGA_CONTROLS[saga].enabled = DEV_CONFIG.SAGAS[saga];
            }
        }
        // Regenerate ARC_AVAILABILITY
        if (typeof generateArcAvailability === 'function') {
            Object.assign(ARC_AVAILABILITY, generateArcAvailability());
        }
    }
}

// Apply debug settings
function applyDebugSettings() {
    // Hide/show clear data button
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.style.display = DEV_CONFIG.DEBUG.CLEAR_DATA_BUTTON ? '' : 'none';
    }

    // Hide/show admin panel button
    const adminBtn = document.getElementById('view-admin-btn');
    if (adminBtn) {
        adminBtn.style.display = DEV_CONFIG.FEATURES.ADMIN_PANEL ? '' : 'none';
    }

    // Hide/show music control
    const musicControl = document.getElementById('music-control');
    if (musicControl && !DEV_CONFIG.FEATURES.MUSIC_PLAYER) {
        musicControl.style.display = 'none';
    }

    // Hide/show theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.style.display = DEV_CONFIG.FEATURES.THEME_TOGGLE ? '' : 'none';
    }

    // Hide/show scroll to top button
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (scrollBtn) {
        scrollBtn.style.display = DEV_CONFIG.FEATURES.SCROLL_TO_TOP ? '' : 'none';
    }

    // Hide/show bot mode section
    const botSection = document.querySelector('.section:has(#play-bot-btn)');
    if (botSection && !DEV_CONFIG.FEATURES.BOT_MODE) {
        botSection.style.display = 'none';
    }

    // Hide/show multiplayer sections
    if (!DEV_CONFIG.FEATURES.P2P_MULTIPLAYER) {
        const hostSection = document.querySelector('.section:has(#host-game-btn)');
        const joinSection = document.querySelector('.section:has(#join-game-btn)');
        if (hostSection) hostSection.style.display = 'none';
        if (joinSection) joinSection.style.display = 'none';
    }

    // Hide/show collection viewer
    const collectionBtn = document.getElementById('view-collection-btn');
    if (collectionBtn && !DEV_CONFIG.FEATURES.COLLECTION_VIEWER) {
        collectionBtn.style.display = 'none';
    }

    // Hide/show team battle mode
    const teamBattleBtn = document.getElementById('play-team-battle-btn');
    if (teamBattleBtn && !DEV_CONFIG.FEATURES.TEAM_BATTLE_MODE) {
        teamBattleBtn.style.display = 'none';
    }

    // Hide/show stats bar
    const statsBar = document.querySelector('.stats');
    if (statsBar && !DEV_CONFIG.UI.SHOW_STATS_BAR) {
        statsBar.style.display = 'none';
    }

    // Hide/show version number in footer
    const versionInfo = document.getElementById('version-info');
    if (versionInfo && !DEV_CONFIG.UI.SHOW_VERSION_NUMBER) {
        versionInfo.style.display = 'none';
    }

    // Override console.log if disabled
    if (!DEV_CONFIG.DEBUG.CONSOLE_LOGGING) {
        console.log = function() {};
        console.warn = function() {};
        console.info = function() {};
    }

    // Auto-login for testing
    if (DEV_CONFIG.DEBUG.SKIP_LOGIN) {
        setTimeout(() => {
            const guestBtn = document.getElementById('guest-btn');
            if (guestBtn) guestBtn.click();
        }, 500);
    }
}

// Helper function to check if a feature is enabled
function isFeatureEnabled(feature) {
    const keys = feature.split('.');
    let value = DEV_CONFIG;
    for (const key of keys) {
        value = value[key];
        if (value === undefined) return false;
    }
    return value;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEV_CONFIG;
}
