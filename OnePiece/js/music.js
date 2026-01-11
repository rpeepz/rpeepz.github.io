// Music Manager
class MusicManager {
    constructor() {
        this.audio = null;
        this.currentVolume = 1.0;
        this.isPlaying = false;
    }
    
    initialize() {
        this.audio = document.getElementById('battle-music');
        this.audio.volume = this.currentVolume;
    }
    
    setVolume(volume) {
        this.currentVolume = volume;
        if (this.audio) this.audio.volume = volume;
    }
    
    play() {
        if (this.audio && !this.isPlaying) {
            this.audio.play().catch(err => console.log('Audio play failed:', err));
            this.isPlaying = true;
            document.getElementById('music-control').classList.add('active');
        }
    }
    
    stop() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            document.getElementById('music-control').classList.remove('active');
        }
    }
}

const musicManager = new MusicManager();
