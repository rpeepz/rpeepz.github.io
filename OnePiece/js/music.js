// Music Manager (Simple HTML5 Audio - No Web Audio API)
class MusicManager {
    constructor() {
        this.battleAudio = null;
        this.draftwarAudio = null;
        this.currentVolume = 1.0;
        this.isPlaying = false;
        this.currentTrack = null; // 'battle' or 'draft-war'
        this.enabled = true; // Track if music is enabled
        this.isMuted = false; // Track mute state
    }
    
    initialize() {
        // Check if music player is enabled in config
        if (typeof DEV_CONFIG !== 'undefined' && !DEV_CONFIG.FEATURES.MUSIC_PLAYER) {
            this.enabled = false;
            return; // Don't load audio elements
        }

        this.battleAudio = document.getElementById('battle-music');
        this.draftwarAudio = document.getElementById('draft-war-music');
        
        if (this.battleAudio) {
            this.battleAudio.volume = this.currentVolume;
            this.battleAudio.muted = this.isMuted;
        }
        if (this.draftwarAudio) {
            this.draftwarAudio.volume = this.currentVolume;
            this.draftwarAudio.muted = this.isMuted;
        }
    }
    
    setVolume(volume) {
        if (!this.enabled) return;
        
        this.currentVolume = volume;
        if (this.battleAudio) this.battleAudio.volume = volume;
        if (this.draftwarAudio) this.draftwarAudio.volume = volume;
    }
    
    mute() {
        if (!this.enabled) return;
        
        this.isMuted = true;
        if (this.battleAudio) this.battleAudio.muted = true;
        if (this.draftwarAudio) this.draftwarAudio.muted = true;
    }
    
    unmute() {
        if (!this.enabled) return;
        
        this.isMuted = false;
        if (this.battleAudio) this.battleAudio.muted = false;
        if (this.draftwarAudio) this.draftwarAudio.muted = false;
    }
    
    toggleMute() {
        if (!this.enabled) return;
        
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
        return this.isMuted;
    }
    
    play(trackType = 'battle') {
        if (!this.enabled || this.isMuted) return; // Don't play if disabled or muted
        
        // Stop any currently playing track
        this.stop();
        
        const audio = trackType === 'draft-war' ? this.draftwarAudio : this.battleAudio;
        
        if (audio && !this.isPlaying) {
            audio.muted = this.isMuted; // Ensure muted state is correct
            audio.play().catch(err => console.log('Audio play failed:', err));
            this.isPlaying = true;
            this.currentTrack = trackType;
            const musicControl = document.getElementById('music-control');
            if (musicControl) {
                musicControl.style.display = ''; // Always show when music starts
                musicControl.classList.add('active');
            }
        }
    }
    
    stop() {
        if (!this.enabled) return;
        
        if (this.battleAudio && this.isPlaying && this.currentTrack === 'battle') {
            this.battleAudio.pause();
            this.battleAudio.currentTime = 0;
        }
        if (this.draftwarAudio && this.isPlaying && this.currentTrack === 'draft-war') {
            this.draftwarAudio.pause();
            this.draftwarAudio.currentTime = 0;
        }
        this.isPlaying = false;
        this.currentTrack = null;
        const musicControl = document.getElementById('music-control');
        if (musicControl) musicControl.classList.remove('active');
    }
}

const musicManager = new MusicManager();
