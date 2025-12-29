let paradoxes = [];
let currentIndex = 0;
const paradoxTitle = document.getElementById('paradoxTitle');
const entryDate = document.getElementById('entryDate');
const paradoxDescription = document.getElementById('paradoxDescription');
const paradoxFact = document.getElementById('paradoxFact');
const wikiLink = document.getElementById('wikiLink');
const videoLink = document.getElementById('videoLink');
const videoTitle = document.getElementById('videoTitle');
const paradoxArt = document.getElementById('paradoxArt');
const polaroidCaption = document.getElementById('polaroidCaption');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
const pageNum = document.getElementById('pageNum');
const journal = document.querySelector('.journal');
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const pageFlipSfx = document.getElementById('pageFlipSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');

let musicPlaying = false;

function getMusicVolume() {
    const saved = localStorage.getItem('contraryMusicVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}

function getSFXVolume() {
    const saved = localStorage.getItem('contrarySFXVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}

async function loadParadoxData() {
    try {
        const response = await fetch('/static/paradoxes.json');
        paradoxes = await response.json();
        loadParadox(currentIndex);
    } catch (error) {
        console.error('Error loading paradox data:', error);
    }
}

function playClickSound() {
    clickSfx.currentTime = 0;
    clickSfx.volume = 0.4 * getSFXVolume();
    clickSfx.play().catch(err => console.log("Sound play delayed"));
}

function playPageFlipSound() {
    pageFlipSfx.currentTime = 0;
    pageFlipSfx.volume = 0.5 * getSFXVolume();
    pageFlipSfx.play().catch(err => console.log("Sound play delayed"));
}

document.addEventListener('mousedown', (e) => {
    const isButton = e.target.closest('button, a, .tab, .dot');
    if (isButton && (e.button === 0)) {
        playClickSound();
    }
});

function updateMusicIcon(isPlaying) {
    if (isPlaying) {
        wrapperSound.style.display = 'block';
        wrapperMute.style.display = 'none';
        musicToggle.classList.add('playing');
    } else {
        wrapperSound.style.display = 'none';
        wrapperMute.style.display = 'block';
        musicToggle.classList.remove('playing');
    }
}

function tryPlayMusic() {
    bgMusic.volume = 0.25 * getMusicVolume();
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
    if (localStorage.getItem('contrarySystemCursor') === 'true') {
        document.body.classList.add('system-cursor');
    }
    tryPlayMusic();
    loadParadoxData();
});

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();

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

function loadParadox(index) {
    if (paradoxes.length === 0) return;    
    const paradox = paradoxes[index];
    
    journal.style.transform = 'rotate(-0.5deg) scale(0.98)';
    journal.style.opacity = '0.7';
    
    setTimeout(() => {
        entryDate.textContent = paradox.date;
        paradoxTitle.textContent = paradox.title;
        paradoxDescription.textContent = paradox.description;
        paradoxFact.textContent = paradox.funFact;
        wikiLink.href = paradox.wikiLink;
        videoLink.href = paradox.videoLink;
        videoTitle.textContent = paradox.videoTitle;
        paradoxArt.src = paradox.artSrc;
        polaroidCaption.textContent = paradox.polaroidCaption;
        pageNum.textContent = `Page ${index + 1}/${paradoxes.length}`;
        playBtn.onclick = () => {
            playBtn.style.transform = 'scale(0.95) rotate(-1deg)';
            setTimeout(() => {
                window.location.href = `/paradox/${paradox.id}`;
            }, 200);
        };
        
        journal.style.transform = 'rotate(-0.5deg) scale(1)';
        journal.style.opacity = '1';
    }, 300);
    
    updateNavigation();
}

function updateNavigation() { 
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === paradoxes.length - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        playPageFlipSound();
        loadParadox(currentIndex);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < paradoxes.length - 1) {
        currentIndex++;
        playPageFlipSound();
        loadParadox(currentIndex);
    }
});


dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (index !== currentIndex) {
            currentIndex = index;
            playPageFlipSound();
            loadParadox(currentIndex);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        playPageFlipSound();
        loadParadox(currentIndex);
    } else if (e.key === 'ArrowRight' && currentIndex < paradoxes.length - 1) {
        currentIndex++;
        playPageFlipSound();
        loadParadox(currentIndex);
    }
});

