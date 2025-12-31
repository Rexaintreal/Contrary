lucide.createIcons();

//states
let currentRound = 0;
const MAX_ROUNDS = 10;
let playerScore = 0;
let opponentScore = 0;
let playerChoice = null;
let opponentChoice = null;
let opponentStrategy = 'random';
let gameHistory = [];
let outcomeStats = {
    bothCoop: 0,
    bothBetray: 0,
    playerBetray: 0,
    opponentBetray: 0
};

let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const prisonDoorSfx = document.getElementById('prisonDoorSfx');
const winSfx = document.getElementById('winSfx');
const loseSfx = document.getElementById('loseSfx');
const popSfx = document.getElementById('popSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');
const cooperateBtn = document.getElementById('cooperateBtn');
const betrayBtn = document.getElementById('betrayBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const newGameBtn = document.getElementById('newGameBtn');
const dialogueText = document.getElementById('dialogueText');
const playerDisplay = document.getElementById('playerDisplay');
const opponentDisplay = document.getElementById('opponentDisplay');
const playerChoiceEl = document.getElementById('playerChoice');
const opponentChoiceEl = document.getElementById('opponentChoice');
const playerScoreEl = document.getElementById('playerScore');
const opponentScoreEl = document.getElementById('opponentScore');
const playerScoreDisplay = document.getElementById('playerScoreDisplay');
const opponentScoreDisplay = document.getElementById('opponentScoreDisplay');
const roundCountEl = document.getElementById('roundCount');
const opponentStrategyEl = document.getElementById('opponentStrategy');
const decisionArea = document.getElementById('decisionArea');
const statsModal = document.getElementById('statsModal');
const infoModal = document.getElementById('infoModal');
const strategyModal = document.getElementById('strategyModal');
const resetModal = document.getElementById('resetModal');
const statsBtn = document.getElementById('statsBtn');
const infoBtn = document.getElementById('infoBtn');


function getMusicVolume() {
    const saved = localStorage.getItem('contraryMusicVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}

function getSFXVolume() {
    const saved = localStorage.getItem('contrarySFXVolume');
    return saved !== null ? parseInt(saved) / 100 : 0.5;
}
function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.volume = 0.5 * getSFXVolume();
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
    bgMusic.volume = 0.25 * getMusicVolume();
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
        bgMusic.volume = 0.25 * getMusicVolume();
        musicPlaying = true;
        updateMusicIcon(true);
    }
});
function getOpponentChoice() {
    switch(opponentStrategy) {
        case 'random':
            return Math.random() < 0.5 ? 'cooperate' : 'betray';
        
        case 'alwaysCooperate':
            return 'cooperate';
        case 'alwaysBetray':
            return 'betray';
        
        case 'titForTat':
            if (gameHistory.length === 0) return 'cooperate';
            return gameHistory[gameHistory.length - 1].playerChoice;
        
        case 'grudger':
            const hasBetrayed = gameHistory.some(round => round.playerChoice === 'betray');
            return hasBetrayed ? 'betray' : 'cooperate';
        
        default:
            return Math.random() < 0.5 ? 'cooperate' : 'betray';
    }
}
function calculateOutcome(player, opponent) {
    if (player === 'cooperate' && opponent === 'cooperate') {
        return { playerYears: 1, opponentYears: 1, outcome: 'both-cooperate' };
    } else if (player === 'cooperate' && opponent === 'betray') {
        return { playerYears: 10, opponentYears: 0, outcome: 'opponent-betrayed' };
    } else if (player === 'betray' && opponent === 'cooperate') {
        return { playerYears: 0, opponentYears: 10, outcome: 'player-betrayed' };
    } else {
        return { playerYears: 5, opponentYears: 5, outcome: 'both-betray' };
    }
}


function updateDisplay() {
    roundCountEl.textContent = currentRound;
    playerScoreEl.textContent = playerScore;
    opponentScoreEl.textContent = opponentScore;
    playerScoreDisplay.textContent = playerScore + ' years';
    opponentScoreDisplay.textContent = opponentScore + ' years';
}



function handlePlayerChoice(choice) {
    if (playerChoice !== null) return;
    
    playSound(clickSfx);
    playerChoice = choice;
    opponentChoice = getOpponentChoice();
    
    cooperateBtn.disabled = true;
    betrayBtn.disabled = true;
    
    playSound(prisonDoorSfx);
    
    setTimeout(() => revealChoices(), 1000);
}

function revealChoices() {
    playerChoiceEl.textContent = playerChoice === 'cooperate' ? 'SILENT' : 'BETRAY';
    playerChoiceEl.classList.add(playerChoice);
    
    opponentChoiceEl.textContent = opponentChoice === 'cooperate' ? 'SILENT' : 'BETRAY';
    opponentChoiceEl.classList.add(opponentChoice);
    const result = calculateOutcome(playerChoice, opponentChoice);
    playerScore += result.playerYears;
    opponentScore += result.opponentYears;
    
    gameHistory.push({
        round: currentRound,
        playerChoice: playerChoice,
        opponentChoice: opponentChoice,
        playerYears: result.playerYears,
        opponentYears: result.opponentYears
    });
    
    //outcomes
    if (result.outcome === 'both-cooperate') {
        outcomeStats.bothCoop++;
    } else if (result.outcome === 'both-betray') {
        outcomeStats.bothBetray++;
    } else if (result.outcome === 'player-betrayed') {
        outcomeStats.playerBetray++;
    } else if (result.outcome === 'opponent-betrayed') {
        outcomeStats.opponentBetray++;
    }
    setTimeout(() => {
        updatePrisonerImages(result);
        updateDisplay();
        updateDialogue(result);
        
        if (currentRound >= MAX_ROUNDS) {
            newGameBtn.classList.add('active');
            setTimeout(() => showStatsModal(), 1500);
        } else {
            nextRoundBtn.classList.add('active');
        }
    }, 500);
}

function updatePrisonerImages(result) {
    if (result.playerYears === 0) {
        playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-happy.png" alt="You">';
        playSound(winSfx);
    } else if (result.playerYears >= 5) {
        playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-sad.png" alt="You">';
        playSound(loseSfx);
    } else {
        playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="You">';
        playSound(popSfx);
    }
    
    if (result.opponentYears === 0) {
        opponentDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-happy.png" alt="Opponent">';
    } else if (result.opponentYears >= 5) {
        opponentDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-sad.png" alt="Opponent">';
    } else {
        opponentDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
    }
}

//dialogues
function updateDialogue(result) {
    let message = '';
    
    if (result.outcome === 'both-cooperate') {
        message = `You both stayed silent! Each got 1 year. Trust pays off when both cooperate. Round ${currentRound}/${MAX_ROUNDS} complete.`;
    } else if (result.outcome === 'both-betray') {
        message = `You both betrayed! Each got 5 years. Selfish choices lead to mutual suffering. Round ${currentRound}/${MAX_ROUNDS} complete.`;
    } else if (result.outcome === 'player-betrayed') {
        message = `You betrayed while they stayed silent! You go free, they get 10 years. You won this round, but was it worth it? Round ${currentRound}/${MAX_ROUNDS} complete.`;
    } else {
        message = `They betrayed you! You get 10 years while they go free. You trusted, they didn't. Round ${currentRound}/${MAX_ROUNDS} complete.`;
    }
    
    dialogueText.textContent = message;
}



function nextRound() {
    playSound(clickSfx);
    
    currentRound++;
    playerChoice = null;
    opponentChoice = null;
    
    playerChoiceEl.textContent = '?';
    playerChoiceEl.className = 'choice-reveal';
    opponentChoiceEl.textContent = '?';
    opponentChoiceEl.className = 'choice-reveal';
    
    playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="You">';
    opponentDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
    
    cooperateBtn.disabled = false;
    betrayBtn.disabled = false;
    nextRoundBtn.classList.remove('active');
    updateDisplay();
    dialogueText.textContent = `Round ${currentRound}/${MAX_ROUNDS}. Make your choice: Will you stay silent or betray?`;
}

function showStatsModal() {
    const modalResult = document.getElementById('modalResult');
    
    if (playerScore < opponentScore) {
        modalResult.innerHTML = `<strong>You Win!</strong><br>You got ${playerScore} years vs Opponent's ${opponentScore} years. Lower is better! You played smarter than the opponent.`;
    } else if (playerScore > opponentScore) {
        modalResult.innerHTML = `<strong>Opponent Wins!</strong><br>You got ${playerScore} years vs Opponent's ${opponentScore} years. The opponent outplayed you this time.`;
    } else {
        modalResult.innerHTML = `<strong>It's a Tie!</strong><br>Both got ${playerScore} years. You and the opponent were equally matched.`;
    }
    
    updateStatsChart();
    statsModal.classList.add('visible');
}



function updateStatsChart() {
    const maxScore = Math.max(playerScore, opponentScore, 10);
    const playerBar = document.getElementById('chartPlayerBar');
    const opponentBar = document.getElementById('chartOpponentBar');
    const playerValue = document.getElementById('chartPlayerValue');
    const opponentValue = document.getElementById('chartOpponentValue');
    
    playerBar.style.width = ((playerScore / maxScore) * 100) + '%';
    opponentBar.style.width = ((opponentScore / maxScore) * 100) + '%';
    
    playerValue.textContent = playerScore + ' years';
    opponentValue.textContent = opponentScore + ' years';
    
    document.getElementById('bothCoopCount').textContent = outcomeStats.bothCoop;
    document.getElementById('bothBetrayCount').textContent = outcomeStats.bothBetray;
    document.getElementById('playerBetrayCount').textContent = outcomeStats.playerBetray;
    document.getElementById('opponentBetrayCount').textContent = outcomeStats.opponentBetray;
}


function newGame() {
    playSound(clickSfx);
    strategyModal.classList.add('visible');
}

//reset
function resetGame() {
    currentRound = 1;
    playerScore = 0;
    opponentScore = 0;
    playerChoice = null;
    opponentChoice = null;
    gameHistory = [];
    outcomeStats = {
        bothCoop: 0,
        bothBetray: 0,
        playerBetray: 0,
        opponentBetray: 0
    };
    
    playerChoiceEl.textContent = '?';
    playerChoiceEl.className = 'choice-reveal';
    opponentChoiceEl.textContent = '?';
    opponentChoiceEl.className = 'choice-reveal';
    
    playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="You">';
    opponentDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
    
    cooperateBtn.disabled = false;
    betrayBtn.disabled = false;
    nextRoundBtn.classList.remove('active');
    newGameBtn.classList.remove('active');
    
    updateDisplay();
    dialogueText.textContent = `Round 1/${MAX_ROUNDS}. New game started with ${opponentStrategy} opponent strategy. Make your choice!`;
    
    statsModal.classList.remove('visible');
    resetModal.classList.remove('visible');
}



cooperateBtn.addEventListener('click', () => handlePlayerChoice('cooperate'));
betrayBtn.addEventListener('click', () => handlePlayerChoice('betray'));
nextRoundBtn.addEventListener('click', nextRound);
newGameBtn.addEventListener('click', newGame);

statsBtn.addEventListener('click', () => {
    playSound(clickSfx);
    showStatsModal();
});

infoBtn.addEventListener('click', () => {
    playSound(clickSfx);
    infoModal.classList.add('visible');
});


document.getElementById('infoClose').addEventListener('click', () => {
    playSound(clickSfx);
    infoModal.classList.remove('visible');
});

document.getElementById('modalContinue').addEventListener('click', () => {
    playSound(clickSfx);
    statsModal.classList.remove('visible');
});

document.getElementById('modalNewGame').addEventListener('click', () => {
    playSound(clickSfx);
    newGame();
});

document.getElementById('resetConfirm').addEventListener('click', () => {
    playSound(clickSfx);
    resetGame();
});

document.getElementById('resetCancel').addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.remove('visible');
});


document.querySelectorAll('.strategy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(clickSfx);
        opponentStrategy = btn.dataset.strategy;
        
        const strategyNames = {
            'random': 'Random',
            'alwaysCooperate': 'Always Cooperate',
            'alwaysBetray': 'Always Betray',
            'titForTat': 'Tit-for-Tat',
            'grudger': 'Grudger'
        };
        
        opponentStrategyEl.textContent = strategyNames[opponentStrategy];
        strategyModal.classList.remove('visible');
        resetGame();
    });
});

//keyb shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
        if (!cooperateBtn.disabled) {
            handlePlayerChoice('cooperate');
        }
    }
    if (e.key === 'b' || e.key === 'B') {
        if (!betrayBtn.disabled) {
            handlePlayerChoice('betray');
        }
    }
    if (e.key === 's' || e.key === 'S') {
        if (currentRound > 0) {
            showStatsModal();
        }
    }
    if (e.key === 'r' || e.key === 'R') {
        resetModal.classList.add('visible');
    }
    if (e.key === 'Escape') {
        statsModal.classList.remove('visible');
        infoModal.classList.remove('visible');
        strategyModal.classList.remove('visible');
        resetModal.classList.remove('visible');
    }
});


[statsModal, infoModal, resetModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            playSound(clickSfx);
            modal.classList.remove('visible');
        }
    });
});

//init
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('contrarySystemCursor') === 'true') {
        document.body.classList.add('system-cursor');
    }
    tryPlayMusic();
    setTimeout(() => {
        strategyModal.classList.add('visible');
    }, 500);
});

