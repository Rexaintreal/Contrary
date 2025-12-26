// Paradox Data
const paradoxes = [
    {
        id: 'monty-hall',
        title: 'The Monty Hall Problem',
        date: 'Classic Game Theory',
        description: "You're on a game show. Three doors: one car, two goats. You pick door number 1. The host opens door number 3 and reveals a goat. Now he asks: Switch to door number 2, or stay with number 1? Most people think it doesn't matter. They're wrong. Switching DOUBLES your chances from 33% to 67%!",
        funFact: "When this appeared in Parade Magazine in 1990, over 10,000 readers including 1,000 PhDs wrote in saying the answer was wrong. Even famous mathematicians initially disagreed with the solution!",
        wikiLink: 'https://en.wikipedia.org/wiki/Monty_Hall_problem',
        artSrc: '/static/assets/paradoxes/monty-hall-art.png',
        polaroidCaption: 'Which door will you choose?'
    },
    {
        id: 'birthday',
        title: 'The Birthday Paradox',
        date: 'Probability Theory',
        description: "In a room of just 23 random people, there's a 50% chance that two of them share the same birthday. With 70 people, it jumps to 99.9%! Your brain tricks you because you think about YOUR birthday. But the math asks about ANY two people sharing. That changes everything.",
        funFact: "Cryptographers used this paradox to break hash functions and forge digital signatures. Birthday attacks are a real security threat in computer science. Math is not just puzzles, it's power.",
        wikiLink: 'https://en.wikipedia.org/wiki/Birthday_problem',
        artSrc: '/static/assets/paradoxes/birthday-art.png',
        polaroidCaption: '23 people equals 50% match'
    }
];

let currentIndex = 0;
const paradoxTitle = document.getElementById('paradoxTitle');
const entryDate = document.getElementById('entryDate');
const paradoxDescription = document.getElementById('paradoxDescription');
const paradoxFact = document.getElementById('paradoxFact');
const wikiLink = document.getElementById('wikiLink');
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
    bgMusic.volume = 0.25;
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
        bgMusic.volume = 0.25;
        musicPlaying = true;
        updateMusicIcon(true);
    }
});

function loadParadox(index) {
    const paradox = paradoxes[index];
    
    journal.style.transform = 'rotate(-0.5deg) scale(0.98)';
    journal.style.opacity = '0.7';
    
    setTimeout(() => {
        entryDate.textContent = paradox.date;
        paradoxTitle.textContent = paradox.title;
        paradoxDescription.textContent = paradox.description;
        paradoxFact.textContent = paradox.funFact;
        wikiLink.href = paradox.wikiLink;
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