// Paradox Data
const paradoxes = [
    {
        id: 'monty-hall',
        title: 'The Monty Hall Problem',
        description: "You're on a game show with three doors. Behind one is a car, behind the others are goats. You pick a door, then the host (who knows what's behind each door) opens another door revealing a goat. Should you switch your choice? The answer defies intuition!",
        funFact: "When this problem was published in 1990, thousands of people (including mathematicians!) wrote angry letters insisting the answer was wrong. But math doesn't lie!",
        wikiLink: 'https://en.wikipedia.org/wiki/Monty_Hall_problem',
        artSrc: '/static/assets/paradoxes/monty-hall-art.png'
    },
    {
        id: 'birthday',
        title: 'The Birthday Paradox',
        description: "In a room of just 23 people, there's a 50% chance that two people share the same birthday! With 70 people, it jumps to 99.9%. This seems impossible, but the math is beautifully simple.",
        funFact: "This paradox was used by cryptographers to crack hash functions! It's not just a party trick—it has serious applications in computer security.",
        wikiLink: 'https://en.wikipedia.org/wiki/Birthday_problem',
        artSrc: '/static/assets/paradoxes/birthday-art.png'
    }
];

let currentIndex = 0;
const paradoxTitle = document.getElementById('paradoxTitle');
const paradoxDescription = document.getElementById('paradoxDescription');
const paradoxFact = document.getElementById('paradoxFact');
const wikiLink = document.getElementById('wikiLink');
const paradoxArt = document.getElementById('paradoxArt');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
const book = document.querySelector('.book');
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const pageFlipSfx = document.getElementById('pageFlipSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');
const homeLink = document.getElementById('homeLink');

let musicPlaying = false;

function playClickSound() {
    clickSfx.currentTime = 0;
    clickSfx.volume = 0.4;
    clickSfx.play().catch(err => console.log("Sound play delayed"));
}

function playPageFlipSound() {
    pageFlipSfx.currentTime = 0;
    pageFlipSfx.volume = 0.5;
    pageFlipSfx.play().catch(err => console.log("Sound play delayed"));
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
        musicToggle.classList.add('playing');
    } else {
        wrapperSound.style.display = 'none';
        wrapperMute.style.display = 'block';
        musicToggle.classList.remove('playing');
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
    loadParadox(currentIndex);
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

function loadParadox(index) {
    const paradox = paradoxes[index];
    
    book.classList.add('flipping');
    
    setTimeout(() => {
        paradoxTitle.textContent = paradox.title;
        paradoxDescription.textContent = paradox.description;
        paradoxFact.textContent = paradox.funFact;
        wikiLink.href = paradox.wikiLink;
        paradoxArt.src = paradox.artSrc;
        playBtn.onclick = () => {
            playBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                window.location.href = `/paradox/${paradox.id}`;
            }, 200);
        };
        
        book.classList.remove('flipping');
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