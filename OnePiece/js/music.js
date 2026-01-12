// Music Manager (Simple HTML5 Audio - No Web Audio API)
class MusicManager {
    constructor() {
        this.battleAudio = null;
        this.teamBattleAudio = null;
        this.currentVolume = 1.0;
        this.isPlaying = false;
        this.currentTrack = null; // 'battle' or 'team-battle'
    }
    
    initialize() {
        this.battleAudio = document.getElementById('battle-music');
        this.teamBattleAudio = document.getElementById('team-battle-music');
        
        if (this.battleAudio) this.battleAudio.volume = this.currentVolume;
        if (this.teamBattleAudio) this.teamBattleAudio.volume = this.currentVolume;
    }
    
    setVolume(volume) {
        this.currentVolume = volume;
        if (this.battleAudio) this.battleAudio.volume = volume;
        if (this.teamBattleAudio) this.teamBattleAudio.volume = volume;
    }
    
    play(trackType = 'battle') {
        // Stop any currently playing track
        this.stop();
        
        const audio = trackType === 'team-battle' ? this.teamBattleAudio : this.battleAudio;
        
        if (audio && !this.isPlaying) {
            audio.play().catch(err => console.log('Audio play failed:', err));
            this.isPlaying = true;
            this.currentTrack = trackType;
            document.getElementById('music-control').classList.add('active');
        }
    }
    
    stop() {
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
        document.getElementById('music-control').classList.remove('active');
    }
}

const musicManager = new MusicManager();
