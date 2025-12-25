const startBtn = document.getElementById('startBtn');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const iconSound = document.getElementById('iconSound');
const iconMute = document.getElementById('iconMute');

let musicPlaying = false;

function updateMusicIcon(isPlaying) {
    if (isPlaying) {
        iconSound.style.display = 'block';
        iconMute.style.display = 'none';
        musicToggle.style.animation = 'musicBounce 2s ease-in-out infinite';
        musicToggle.style.opacity = '1';
    } else {
        iconSound.style.display = 'none';
        iconMute.style.display = 'block';
        musicToggle.style.animation = 'none';
        musicToggle.style.opacity = '0.7';
    }
}

function tryPlayMusic() {
    bgMusic.volume = 0.3;
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
        bgMusic.volume = 0.3;
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