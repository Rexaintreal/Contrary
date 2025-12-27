const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');

let musicPlaying = false;

function getMasterVolume() {
    const savedVolume = localStorage.getItem('contraryMasterVolume');
    return savedVolume !== null ? parseInt(savedVolume) / 100 : 0.5;
}

function playClickSound() {
    clickSfx.currentTime = 0; 
    clickSfx.volume = 0.4 * getMasterVolume();
    clickSfx.play().catch(err => console.log("Sound play delayed until user interaction"));
}

window.addEventListener('mousedown', (e) => {
    if (e.button === 0 || e.button === 2) {
        playClickSound();
    }
});

function updateMusicIcon(isPlaying) {
    if (isPlaying) {
        wrapperSound.style.display = 'block';
        wrapperMute.style.display = 'none';
        
        musicToggle.style.animation = 'musicBounce 2s ease-in-out infinite';
        musicToggle.style.opacity = '1';
    } else {
        wrapperSound.style.display = 'none';
        wrapperMute.style.display = 'block';
        
        musicToggle.style.animation = 'none';
        musicToggle.style.opacity = '0.7';
    }
}

function tryPlayMusic() {
    bgMusic.volume = 0.3 * getMasterVolume();
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            musicPlaying = true;
            updateMusicIcon(true);
        })
        .catch(error => {
            console.log("Autoplay prevented. Waiting for user interaction.");
            musicPlaying = false;
            updateMusicIcon(false); 
            
            document.addEventListener('click', () => {
                if (!musicPlaying) {
                    bgMusic.play();
                    musicPlaying = true;
                    updateMusicIcon(true);
                }
            }, { once: true });
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    tryPlayMusic();
});

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); 

    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        updateMusicIcon(false);
    } else {
        bgMusic.play();
        bgMusic.volume = 0.3 * getMasterVolume();
        musicPlaying = true;
        updateMusicIcon(true);
    }
});

startBtn.addEventListener('click', () => {
    startBtn.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        window.location.href = '/paradoxes';
    }, 200);
});