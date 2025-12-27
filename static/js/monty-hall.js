lucide.createIcons();
// game states
let gameStage = 'intro';
let carDoor = -1;
let chosenDoor = -1;
let revealedDoor = -1;

let stats = {
    stayWins: 0,
    stayTotal: 0,
    switchWins: 0,
    switchTotal: 0
};

//sfx and music
let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const doorSfx = document.getElementById('doorSfx');
const clickSfx = document.getElementById('clickSfx');
const winSfx = document.getElementById('winSfx');
const loseSfx = document.getElementById('loseSfx');
const goatSfx = document.getElementById('goatSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');

//msges
const dialogues = {
    intro: "Welcome to the Monty Hall Show! I'm your host. Pick a door... one has a shiny car, two have goats!",
    chosen: (door) => `You chose Door ${door}! Great choice! Now let me reveal what's behind one of the other doors...`,
    revealed: (door) => `Door ${door} has a GOAT! Now here's the big question: Will you STAY with your choice, or SWITCH to the other door?`,
    stayWin: "You stayed with your original choice and WON THE CAR! Lucky pick!",
    stayLose: "You stayed but... it's a goat! Switching would have won you the car!",
    switchWin: "You switched and WON THE CAR! Smart move! Switching doubles your chances!",
    switchLose: "You switched but... it's a goat! Your first pick was actually correct!",
};

//init
function init() {
    loadStats();
    tryPlayMusic();
    resetGame();
}

//reset
function resetGame() {
    gameStage = 'intro';
    carDoor = Math.floor(Math.random() * 3);
    chosenDoor = -1;
    revealedDoor = -1;
    document.querySelectorAll('.door-container').forEach(door => {
        door.classList.remove('open', 'chosen', 'disabled');
        door.querySelector('.door-content').innerHTML = '';
    });
    
    document.getElementById('choiceButtons').classList.remove('visible');
    document.getElementById('playAgainBtn').classList.remove('visible');
    document.getElementById('statsModal').classList.remove('visible');
    
    updateDialogue(dialogues.intro);
    enableDoorClicks();
}

function updateDialogue(text) {
    const dialogueText = document.getElementById('dialogueText');
    dialogueText.style.animation = 'none';
    setTimeout(() => {
        dialogueText.textContent = text;
        dialogueText.style.animation = 'fadeIn 0.4s ease-out';
    }, 10);
}

function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.volume = 0.5;
    sound.play().catch(() => {});
}

//music controls
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
    bgMusic.play().then(() => {
        musicPlaying = true;
        updateMusicIcon(true);
    }).catch(() => {
        musicPlaying = false;
        updateMusicIcon(false);
    });
}

musicToggle.addEventListener('click', () => {
    playSound(clickSfx);
    if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        updateMusicIcon(false);
    } else {
        bgMusic.play();
        musicPlaying = true;
        updateMusicIcon(true);
    }
});

function enableDoorClicks() {
    document.querySelectorAll('.door-container').forEach((door, idx) => {
        door.style.cursor = 'pointer';
        door.onclick = () => handleDoorClick(idx);
    });
}

function disableDoorClicks() {
    document.querySelectorAll('.door-container').forEach(door => {
        door.style.cursor = 'not-allowed';
        door.onclick = null;
    });
}
function handleDoorClick(doorIdx) {
    if (gameStage !== 'intro') return;
    
    playSound(clickSfx);
    chosenDoor = doorIdx;
    gameStage = 'reveal';
    document.querySelector(`[data-door="${doorIdx}"]`).classList.add('chosen');
    
    updateDialogue(dialogues.chosen(doorIdx + 1));
    disableDoorClicks();
    setTimeout(revealGoat, 2000);
}


//reveal DA GOAT 🐐🐐🐐🐐🐐🐐🐐 
function revealGoat() {
    const availableDoors = [0, 1, 2].filter(d => d !== chosenDoor && d !== carDoor);
    revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    
    openDoor(revealedDoor, 'goat');
    playSound(doorSfx);
    setTimeout(() => playSound(goatSfx), 500);
    
    gameStage = 'decide';
    
    setTimeout(() => {
        updateDialogue(dialogues.revealed(revealedDoor + 1));
        document.getElementById('choiceButtons').classList.add('visible');
    }, 1000);
}
function openDoor(doorIdx, content) {
    const doorContainer = document.querySelector(`[data-door="${doorIdx}"]`);
    doorContainer.classList.add('open', 'disabled');
    
    const contentDiv = doorContainer.querySelector('.door-content');
    const img = document.createElement('img');
    
    if (content === 'car') {
        img.src = '/static/assets/monty-hall/car.png';
        img.alt = 'Car';
    } else {
        img.src = '/static/assets/monty-hall/goat.png';
        img.alt = 'Goat';
    }
    
    contentDiv.appendChild(img);
}




document.getElementById('stayBtn').addEventListener('click', () => {
    if (gameStage !== 'decide') return;
    
    playSound(clickSfx);
    document.getElementById('choiceButtons').classList.remove('visible');
    
    stats.stayTotal++;
    const won = chosenDoor === carDoor;
    if (won) stats.stayWins++;
    
    revealAll(won, false);
});



document.getElementById('switchBtn').addEventListener('click', () => {
    if (gameStage !== 'decide') return;
    
    playSound(clickSfx);
    document.getElementById('choiceButtons').classList.remove('visible');
    
    document.querySelector(`[data-door="${chosenDoor}"]`).classList.remove('chosen');
    const otherDoor = [0, 1, 2].find(d => d !== chosenDoor && d !== revealedDoor);
    chosenDoor = otherDoor;
    document.querySelector(`[data-door="${otherDoor}"]`).classList.add('chosen');
    
    stats.switchTotal++;
    const won = chosenDoor === carDoor;
    if (won) stats.switchWins++;
    
    setTimeout(() => revealAll(won, true), 800);
});


//reveal doors
function revealAll(won, switched) {
    gameStage = 'result';
    [0, 1, 2].forEach((idx, i) => {
        if (idx === revealedDoor) return;        
        setTimeout(() => {
            playSound(doorSfx);
            const content = idx === carDoor ? 'car' : 'goat';
            openDoor(idx, content);
        }, i * 400);
    });
    
    //update dialogue
    setTimeout(() => {
        if (won && switched) {
            updateDialogue(dialogues.switchWin);
            playSound(winSfx);
        } else if (won && !switched) {
            updateDialogue(dialogues.stayWin);
            playSound(winSfx);
        } else if (!won && switched) {
            updateDialogue(dialogues.switchLose);
            playSound(loseSfx);
        } else {
            updateDialogue(dialogues.stayLose);
            playSound(loseSfx);
        }
        document.getElementById('playAgainBtn').classList.add('visible');
        
        setTimeout(() => {
            saveStats();
            showStatsModal(won, switched);
        }, 2000);
    }, 1500);
}


function showStatsModal(won, switched) {
    const modal = document.getElementById('statsModal');
    const title = document.getElementById('modalTitle');
    const result = document.getElementById('modalResult');
    
    title.textContent = won ? "YOU WON!" : "YOU LOST";
    
    if (won && switched) {
        result.textContent = "You switched and won the car! Smart choice!";
        result.className = 'modal-result won';
    } else if (won && !switched) {
        result.textContent = "You stayed and won the car! Lucky!";
        result.className = 'modal-result won';
    } else if (!won && switched) {
        result.textContent = "You switched but got a goat!";
        result.className = 'modal-result lost';
    } else {
        result.textContent = "You stayed but got a goat!";
        result.className = 'modal-result lost';
    }
    
    updateStatsDisplay();
    modal.classList.add('visible');
}

//stats
function loadStats() {
    const saved = localStorage.getItem('montyHallStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('montyHallStats', JSON.stringify(stats));
}

function updateStatsDisplay() {
    document.getElementById('stayWins').textContent = stats.stayWins;
    document.getElementById('stayTotal').textContent = stats.stayTotal;
    document.getElementById('switchWins').textContent = stats.switchWins;
    document.getElementById('switchTotal').textContent = stats.switchTotal;
}

function clearStats() {
    if (!confirm('Clear all statistics? This cannot be undone!')) return;
    
    stats = { stayWins: 0, stayTotal: 0, switchWins: 0, switchTotal: 0 };
    saveStats();
    updateStatsDisplay();
}


//simulate
async function simulate() {
    const btn = document.getElementById('modalSimulate');
    const originalText = btn.textContent;
    btn.disabled = true;
    
    for (let i = 0; i < 100; i++) {
        btn.textContent = `Running ${i + 1}/100...`;
        const car = Math.floor(Math.random() * 3);
        const choice = Math.floor(Math.random() * 3);
        stats.stayTotal++;
        if (choice === car) stats.stayWins++;
        stats.switchTotal++;
        if (choice !== car) stats.switchWins++;
        
        if (i % 10 === 0) {
            updateStatsDisplay();
            await new Promise(r => setTimeout(r, 30));
        }
    }
    
    saveStats();
    updateStatsDisplay();
    btn.textContent = originalText;
    btn.disabled = false;
    
    alert('Simulation complete!\n\nStay Strategy: ' + stats.stayWins + '/' + stats.stayTotal + ' wins\nSwitch Strategy: ' + stats.switchWins + '/' + stats.switchTotal + ' wins\n\nSwitching is clearly better!');
}


document.getElementById('playAgainBtn').addEventListener('click', () => {
    playSound(clickSfx);
    resetGame();
});

document.getElementById('modalPlayAgain').addEventListener('click', () => {
    playSound(clickSfx);
    document.getElementById('statsModal').classList.remove('visible');
    resetGame();
});


document.getElementById('modalSimulate').addEventListener('click', () => {
    playSound(clickSfx);
    simulate();
});


document.getElementById('modalClear').addEventListener('click', () => {
    playSound(clickSfx);
    clearStats();
});

document.addEventListener('DOMContentLoaded', init);

