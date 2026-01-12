// Music Manager (Simple HTML5 Audio - No Web Audio API)
class MusicManager {
    constructor() {
        this.battleAudio = null;
        this.teamBattleAudio = null;
        this.currentVolume = 1.0;
        this.isPlaying = false;
        this.currentTrack = null; // 'battle' or 'team-battle'
        this.enabled = true; // Track if music is enabled
    }
    
    initialize() {
        // Check if music player is enabled in config
        if (typeof DEV_CONFIG !== 'undefined' && !DEV_CONFIG.FEATURES.MUSIC_PLAYER) {
            this.enabled = false;
            return; // Don't load audio elements
        }

        this.battleAudio = document.getElementById('battle-music');
        this.teamBattleAudio = document.getElementById('team-battle-music');
        
        if (this.battleAudio) this.battleAudio.volume = this.currentVolume;
        if (this.teamBattleAudio) this.teamBattleAudio.volume = this.currentVolume;
    }
    
    setVolume(volume) {
        if (!this.enabled) return;
        
        this.currentVolume = volume;
        if (this.battleAudio) this.battleAudio.volume = volume;
        if (this.teamBattleAudio) this.teamBattleAudio.volume = volume;
    }
    
    play(trackType = 'battle') {
        if (!this.enabled) return; // Don't play if disabled
        
        // Stop any currently playing track
        this.stop();
        
        const audio = trackType === 'team-battle' ? this.teamBattleAudio : this.battleAudio;
        
        if (audio && !this.isPlaying) {
            audio.play().catch(err => console.log('Audio play failed:', err));
            this.isPlaying = true;
            this.currentTrack = trackType;
            const musicControl = document.getElementById('music-control');
            if (musicControl) musicControl.classList.add('active');
        }
    }
    
    stop() {
        if (!this.enabled) return;
        
        if (this.battleAudio && this.isPlaying && this.currentTrack === 'battle') {
            this.battleAudio.pause();
            this.battleAudio.currentTime = 0;
        }
        if (this.teamBattleAudio && this.isPlaying && this.currentTrack === 'team-battle') {
            this.teamBattleAudio.pause();
            this.teamBattleAudio.currentTime = 0;
        }
        this.isPlaying = false;
        this.currentTrack = null;
        const musicControl = document.getElementById('music-control');
        if (musicControl) musicControl.classList.remove('active');
    }
}

const musicManager = new MusicManager();
