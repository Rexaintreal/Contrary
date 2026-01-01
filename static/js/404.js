const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');

const funFacts = [
    "The number 404 can be expressed as the sum of 13 consecutive primes: 11 + 13 + 17 + 19 + 23 + 29 + 31 + 37 + 41 + 43 + 47 + 53 + 59",
    "404 is a self-descriptive number in base 5: it has 4 zeroes, 0 ones, and 4 fives when written in base 5!",
    "The HTTP 404 error was named after room 404 at CERN where the World Wide Web was invented... just kidding, that's a myth!",
    "404 divided by its reverse (404) equals 1. How mathematically balanced!",
    "In Roman numerals, 404 is CDIV. Coincidentally, 'CD' looks like a sad face: C[",
    "404 seconds equals exactly 6 minutes and 44 seconds. The more you know!",
    "The number 404 appears in the Fibonacci sequence... nowhere! It's truly lost.",
];

function getMusicVolume() {
    const saved = localStorage.getItem('contraryMusicVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}

function getSFXVolume() {
    const saved = localStorage.getItem('contrarySFXVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}

let musicPlaying = false;

bgMusic.volume = 0.25 * getMusicVolume();
clickSfx.volume = 0.5 * getSFXVolume();

function updateMusicIcon(isPlaying) {
    if (isPlaying) {
        wrapperSound.style.display = 'flex';
        wrapperMute.style.display = 'none';
        musicToggle.classList.add('playing');
    } else {
        wrapperSound.style.display = 'none';
        wrapperMute.style.display = 'flex';
        musicToggle.classList.remove('playing');
    }
}

function tryPlayMusic() {
    bgMusic.volume = 0.25 * getMusicVolume();
    bgMusic.play().then(() => {
        musicPlaying = true;
        updateMusicIcon(true);
    }).catch(() => {
        musicPlaying = false;
        updateMusicIcon(false);
    });
}

tryPlayMusic();

musicToggle.addEventListener('click', () => {
    playSound(clickSfx);
    
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        updateMusicIcon(false);
    } else {
        bgMusic.play();
        bgMusic.volume = 0.25 * getMusicVolume();
        musicPlaying = true;
        updateMusicIcon(true);
    }
});

function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.5 * getSFXVolume();
        sound.play().catch(e => console.log('Sound play prevented'));
    }
}

document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('click', () => playSound(clickSfx));
});

function showRandomFact() {
    const factText = document.getElementById('factText');
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    factText.textContent = randomFact;
}

showRandomFact();

setInterval(showRandomFact, 8000);

const errorCode = document.querySelector('.error-code');
let rotation = -2;
let direction = 1;

setInterval(() => {
    rotation += direction * 0.5;
    if (rotation > 2 || rotation < -2) {
        direction *= -1;
    }
    errorCode.style.transform = `rotate(${rotation}deg)`;
}, 100);

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('contrarySystemCursor') === 'true') {
        document.body.classList.add('system-cursor');
    }
});