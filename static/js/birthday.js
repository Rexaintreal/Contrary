lucide.createIcons();

//states
let people = [];
let matches = [];
let totalSimulations = 0;
let totalMatches = 0;
let autoAddInterval = null;
let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const popSfx = document.getElementById('popSfx');
const partyHornSfx = document.getElementById('partyHornSfx');
const confettiSfx = document.getElementById('confettiSfx');
const sweepSfx = document.getElementById('sweepSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');
const peopleArea = document.getElementById('peopleArea');
const inviteBtn = document.getElementById('inviteBtn');
const partyBtn = document.getElementById('partyBtn');
const resetBtn = document.getElementById('resetBtn');
const dialogueText = document.getElementById('dialogueText');
const guestCount = document.getElementById('guestCount');
const probability = document.getElementById('probability');
const matchCount = document.getElementById('matchCount');
const meterFill = document.getElementById('meterFill');
const matchModal = document.getElementById('matchModal');
const matchText = document.getElementById('matchText');
const matchOk = document.getElementById('matchOk');
const resetModal = document.getElementById('resetModal');
const resetConfirm = document.getElementById('resetConfirm');
const resetCancel = document.getElementById('resetCancel');
const simCompleteModal = document.getElementById('simCompleteModal');
const simCompleteText = document.getElementById('simCompleteText');
const simCompleteOk = document.getElementById('simCompleteOk');
const newPartyModal = document.getElementById('newPartyModal');
const newPartyConfirm = document.getElementById('newPartyConfirm');
const newPartyCancel = document.getElementById('newPartyCancel');
const resultsModal = document.getElementById('resultsModal');
const confettiContainer = document.getElementById('confettiContainer');
const statsBtn = document.getElementById('statsBtn');
inviteBtn.setAttribute('data-label', 'Add 1 Guest');
partyBtn.setAttribute('data-label', 'Auto-Add Guests');
resetBtn.setAttribute('data-label', 'Reset Party');
statsBtn.setAttribute('data-label', 'Show Stats (S)');

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//persons
const personSprites = [
    '/static/assets/birthday/person-1.png',
    '/static/assets/birthday/person-2.png',
    '/static/assets/birthday/person-3.png'
];

function getMasterVolume() {
    const savedVolume = localStorage.getItem('contraryMasterVolume');
    return savedVolume !== null ? parseInt(savedVolume) / 100 : 0.5;
}

function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.volume = 0.5 * getMasterVolume();
    sound.play().catch(() => {});
}

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
    bgMusic.volume = 0.25 * getMasterVolume();
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
        bgMusic.volume = 0.25 * getMasterVolume();
        musicPlaying = true;
        updateMusicIcon(true);
    }
});



function calculateProbability(n) {
    if (n === 0) return 0;
    if (n >= 365) return 100;
    let probNoMatch = 1;
    for (let i = 0; i < n; i++) {
        probNoMatch *= (365 - i) / 365;
    }

    const probMatch = (1 - probNoMatch) * 100;
    return Math.min(probMatch, 100);
}




function updateDisplay() {
    const numPeople = people.length;
    const prob = calculateProbability(numPeople);
    
    guestCount.textContent = numPeople;
    probability.textContent = prob.toFixed(1) + '%';
    matchCount.textContent = matches.length;
    meterFill.style.width = Math.min(prob, 100) + '%';
    if (numPeople === 0) {
        dialogueText.textContent = "Welcome to the birthday party! Invite guests and watch for matching birthdays. The paradox? You only need 23 people for a 50% chance of a match!";
    } else if (matches.length > 0) {
        dialogueText.textContent = `${matches.length} match${matches.length > 1 ? 'es' : ''} found with ${numPeople} guests! Keep going or press 'S' to see stats!`;
    } else if (numPeople < 10) {
        dialogueText.textContent = `${numPeople} guest${numPeople > 1 ? 's' : ''} at the party. Still pretty unlikely to find a match. Keep inviting!`;
    } else if (numPeople < 23) {
        dialogueText.textContent = `${numPeople} guests... the probability is ${prob.toFixed(1)}%! Watch it climb to 50% at 23 people!`;
    } else if (numPeople === 23) {
        dialogueText.textContent = "23 GUESTS! This is the magic number - ~50% chance of a match! Press 'S' to see full stats.";
    } else if (numPeople < 50) {
        dialogueText.textContent = `${numPeople} guests and ${prob.toFixed(1)}% chance! A match is getting very likely!`;
    } else if (numPeople >= 50) {
        setTimeout(() => showResultsModal(), 500);
        dialogueText.textContent = `Party's packed with ${numPeople} guests! Stats modal opened automatically.`;
    }
}



function generateBirthday() {
    return Math.floor(Math.random() * 365);
}
function dayToMonthDay(dayOfYear) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = 0;
    let day = dayOfYear + 1;
    
    while (day > daysInMonth[month]) {
        day -= daysInMonth[month];
        month++;
    }
    
    return { month, day };
}

//check same bdays
function findMatches() {
    const newMatches = [];
    
    for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
            if (people[i].birthday === people[j].birthday) {
                newMatches.push([i, j]);
            }
        }
    }
    
    return newMatches;
}



function createConfetti() {
    const colors = ['#FF6B6B', '#FFD93D', '#4ECDC4', '#9370DB', '#FF8E8E', '#FFB6C1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = (Math.random() * 10 + 5) + 'px';
        confetti.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

//renderPeople
function renderPeople() {
    peopleArea.innerHTML = '';
    
    people.forEach((person, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'person-wrapper';
        wrapper.dataset.index = index;
        wrapper.style.left = person.x + 'px';
        wrapper.style.top = person.y + 'px';
        
        const sprite = document.createElement('img');
        sprite.className = 'person-sprite';
        sprite.src = personSprites[person.sprite];
        sprite.alt = 'Guest';
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        const { month, day } = dayToMonthDay(person.birthday);
        balloon.dataset.month = month;
        balloon.textContent = `${monthNames[month]} ${day}`;

        const isInMatch = matches.some(match => match.includes(index));
        if (isInMatch) {
            balloon.classList.add('match');
        }
        
        wrapper.appendChild(balloon);
        wrapper.appendChild(sprite);
        peopleArea.appendChild(wrapper);
    });
}

//add new
function addPerson() {
    if (people.length >= 100) {
        dialogueText.textContent = "The party's full! We can't fit any more guests! Press 'S' to see final stats.";
        stopAutoAdd();
        return;
    }
    const cols = 6;
    const startX = 30;
    const startY = 15;
    const spacingX = 115;
    const spacingY = 125;
    const index = people.length;
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const left = startX + (col * spacingX);
    const top = startY + (row * spacingY);
    
    const person = {
        birthday: generateBirthday(),
        sprite: Math.floor(Math.random() * personSprites.length),
        x: left,  
        y: top 
    };
    
    people.push(person);
    playSound(popSfx);
    const oldMatchCount = matches.length;
    matches = findMatches();
    
    renderPeople();
    updateDisplay();
    if (matches.length > oldMatchCount) {
        setTimeout(() => {
            playSound(partyHornSfx);
            playSound(confettiSfx);
            createConfetti();
            showMatchModal();
        }, 300);
    }
}

function showMatchModal() {
    if (matches.length === 0) return;
    
    const latestMatch = matches[matches.length - 1];
    const person1 = people[latestMatch[0]];
    const person2 = people[latestMatch[1]];
    
    const { month: month1, day: day1 } = dayToMonthDay(person1.birthday);
    
    matchText.innerHTML = `
        <strong>Guest ${latestMatch[0] + 1}</strong> and <strong>Guest ${latestMatch[1] + 1}</strong> 
        both celebrate on <strong>${monthNames[month1]} ${day1}</strong>!
        <br><br>
        ${matches.length === 1 ? 'First match of the party!' : `That's ${matches.length} match${matches.length > 1 ? 'es' : ''} total!`}
    `;
    
    matchModal.classList.add('visible');
}

//auto mode (fix non stop adding even after finding a match)
function startAutoAdd() {
    if (autoAddInterval) {
        stopAutoAdd();
        return;
    }
    partyBtn.disabled = true;
    inviteBtn.disabled = true;
    partyBtn.setAttribute('data-label', 'Stop Auto-Add');
    dialogueText.textContent = "PARTY MODE! Guests are arriving automatically!";
    
    autoAddInterval = setInterval(() => {
        if (people.length >= 100) {
            stopAutoAdd();
            return;
        }
        addPerson();
    }, 600);
    setTimeout(() => {
        partyBtn.disabled = false;
    }, 100);
}

function stopAutoAdd() {
    if (autoAddInterval) {
        clearInterval(autoAddInterval);
        autoAddInterval = null;
    }
    partyBtn.disabled = false;
    inviteBtn.disabled = false;
    partyBtn.setAttribute('data-label', 'Auto-Add Guests');
}
function resetParty() {
    playSound(sweepSfx);
    stopAutoAdd();
    people = [];
    matches = [];
    totalSimulations = 0;
    totalMatches = 0;
    peopleArea.innerHTML = '';
    confettiContainer.innerHTML = '';
    updateDisplay();
    resultsModal.classList.remove('visible');
    matchModal.classList.remove('visible');
    resetModal.classList.remove('visible');
    newPartyModal.classList.remove('visible');
}

//runSims 100 parties with 23 guests each
async function runSimulation() {
    const btn = document.getElementById('modalSimulate');
    const originalText = btn.textContent;
    btn.disabled = true;
    
    for (let i = 0; i < 100; i++) {
        btn.textContent = `Running ${i + 1}/100...`;
        const simPeople = [];
        for (let j = 0; j < 23; j++) {
            simPeople.push({ birthday: generateBirthday() });
        }
        let hasMatch = false;
        for (let a = 0; a < simPeople.length; a++) {
            for (let b = a + 1; b < simPeople.length; b++) {
                if (simPeople[a].birthday === simPeople[b].birthday) {
                    hasMatch = true;
                    break;
                }
            }
            if (hasMatch) break;
        }
        
        totalSimulations++;
        if (hasMatch) totalMatches++;
        
        if (i % 5 === 0) {
            updateStatsDisplay();
            await new Promise(r => setTimeout(r, 30));
        }
    }
    
    updateStatsDisplay();
    btn.textContent = originalText;
    btn.disabled = false;
    
    const matchRate = ((totalMatches / totalSimulations) * 100).toFixed(1);
    simCompleteText.innerHTML = `
        Out of <strong>${totalSimulations}</strong> parties with 23 guests each:<br><br>
        <strong>${totalMatches} had matches (${matchRate}%)</strong><br><br>
        Theory predicts ~50.7%!
    `;
    simCompleteModal.classList.add('visible');
}



function updateStatsDisplay() {
    const matchPercentage = totalSimulations > 0 ? (totalMatches / totalSimulations * 100) : 0;
    const matchBar = document.getElementById('matchBar');
    const matchPercentageEl = document.getElementById('matchPercentage');
    const matchBarCount = document.getElementById('matchBarCount');
    
    matchBar.style.width = matchPercentage + '%';
    matchPercentageEl.textContent = matchPercentage.toFixed(1) + '%';
    matchBarCount.textContent = `${totalMatches}/${totalSimulations}`;
}

function showResultsModal() {
    const modalResult = document.getElementById('modalResult');
    
    if (matches.length > 0) {
        modalResult.textContent = `Found ${matches.length} birthday match${matches.length > 1 ? 'es' : ''} with ${people.length} guests! The paradox works!`;
    } else {
        modalResult.textContent = `No matches yet with ${people.length} guests (${calculateProbability(people.length).toFixed(1)}% probability). Try adding more!`;
    }
    
    updateStatsDisplay();
    resultsModal.classList.add('visible');
}



inviteBtn.addEventListener('click', () => {
    playSound(clickSfx);
    addPerson();
});
partyBtn.addEventListener('click', () => {
    playSound(clickSfx);
    if (autoAddInterval) {
        stopAutoAdd();
    } else {
        startAutoAdd();
    }
});

resetBtn.addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.add('visible');
});

matchOk.addEventListener('click', () => {
    playSound(clickSfx);
    matchModal.classList.remove('visible');
});

resetConfirm.addEventListener('click', () => {
    playSound(clickSfx);
    resetParty();
});

resetCancel.addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.remove('visible');
});

simCompleteOk.addEventListener('click', () => {
    playSound(clickSfx);
    simCompleteModal.classList.remove('visible');
});

newPartyConfirm.addEventListener('click', () => {
    playSound(clickSfx);
    resultsModal.classList.remove('visible');
    resetParty();
});

newPartyCancel.addEventListener('click', () => {
    playSound(clickSfx);
    newPartyModal.classList.remove('visible');
});

statsBtn.addEventListener('click', () => {
    playSound(clickSfx);
    showResultsModal();
});

document.getElementById('modalContinue').addEventListener('click', () => {
    playSound(clickSfx);
    resultsModal.classList.remove('visible');
});
document.getElementById('modalSimulate').addEventListener('click', () => {
    playSound(clickSfx);
    runSimulation();
});
document.getElementById('modalReset').addEventListener('click', () => {
    playSound(clickSfx);
    newPartyModal.classList.add('visible');
});

//keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
        showResultsModal();
    }
    if (e.key === 'r' || e.key === 'R') {
        resetModal.classList.add('visible');
    }
    if (e.key === ' ' && !autoAddInterval) {
        e.preventDefault();
        addPerson();
    }
    if (e.key === 'Escape') {
        matchModal.classList.remove('visible');
        resetModal.classList.remove('visible');
        simCompleteModal.classList.remove('visible');
        newPartyModal.classList.remove('visible');
        resultsModal.classList.remove('visible');
    }
});

[matchModal, resetModal, simCompleteModal, newPartyModal, resultsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            playSound(clickSfx);
            modal.classList.remove('visible');
        }
    });
});


//init
document.addEventListener('DOMContentLoaded', () => {
    tryPlayMusic();
    updateDisplay();
});

