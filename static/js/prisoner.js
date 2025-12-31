lucide.createIcons();

//states
let currentRound = 0;
const MAX_ROUNDS = 10;
let playerScore = 0;
let aiScore = 0;
let playerChoice = null;
let aiChoice = null;
let aiStrategy = 'random';
let gameHistory = [];
let outcomeStats = {
    bothCoop: 0,
    bothBetray: 0,
    playerBetray: 0,
    aiBetray: 0
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
const aiDisplay = document.getElementById('aiDisplay');
const playerChoiceEl = document.getElementById('playerChoice');
const aiChoiceEl = document.getElementById('aiChoice');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const playerScoreDisplay = document.getElementById('playerScoreDisplay');
const aiScoreDisplay = document.getElementById('aiScoreDisplay');
const roundCountEl = document.getElementById('roundCount');
const aiStrategyEl = document.getElementById('aiStrategy');
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
function getAIChoice() {
    switch(aiStrategy) {
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
function calculateOutcome(player, ai) {
    if (player === 'cooperate' && ai === 'cooperate') {
        return { playerYears: 1, aiYears: 1, outcome: 'both-cooperate' };
    } else if (player === 'cooperate' && ai === 'betray') {
        return { playerYears: 10, aiYears: 0, outcome: 'ai-betrayed' };
    } else if (player === 'betray' && ai === 'cooperate') {
        return { playerYears: 0, aiYears: 10, outcome: 'player-betrayed' };
    } else {
        return { playerYears: 5, aiYears: 5, outcome: 'both-betray' };
    }
}


function updateDisplay() {
    roundCountEl.textContent = currentRound;
    playerScoreEl.textContent = playerScore;
    aiScoreEl.textContent = aiScore;
    playerScoreDisplay.textContent = playerScore + ' years';
    aiScoreDisplay.textContent = aiScore + ' years';
}



function handlePlayerChoice(choice) {
    if (playerChoice !== null) return;
    
    playSound(clickSfx);
    playerChoice = choice;
    aiChoice = getAIChoice();
    
    cooperateBtn.disabled = true;
    betrayBtn.disabled = true;
    
    playSound(prisonDoorSfx);
    
    setTimeout(() => revealChoices(), 1000);
}

function revealChoices() {
    playerChoiceEl.textContent = playerChoice === 'cooperate' ? 'SILENT' : 'BETRAY';
    playerChoiceEl.classList.add(playerChoice);
    
    aiChoiceEl.textContent = aiChoice === 'cooperate' ? 'SILENT' : 'BETRAY';
    aiChoiceEl.classList.add(aiChoice);
    const result = calculateOutcome(playerChoice, aiChoice);
    playerScore += result.playerYears;
    aiScore += result.aiYears;
    
    gameHistory.push({
        round: currentRound,
        playerChoice: playerChoice,
        aiChoice: aiChoice,
        playerYears: result.playerYears,
        aiYears: result.aiYears
    });
    
    //outcomes
    if (result.outcome === 'both-cooperate') {
        outcomeStats.bothCoop++;
    } else if (result.outcome === 'both-betray') {
        outcomeStats.bothBetray++;
    } else if (result.outcome === 'player-betrayed') {
        outcomeStats.playerBetray++;
    } else if (result.outcome === 'ai-betrayed') {
        outcomeStats.aiBetray++;
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
    
    if (result.aiYears === 0) {
        aiDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-happy.png" alt="Opponent">';
    } else if (result.aiYears >= 5) {
        aiDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-sad.png" alt="Opponent">';
    } else {
        aiDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
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
    aiChoice = null;
    
    playerChoiceEl.textContent = '?';
    playerChoiceEl.className = 'choice-reveal';
    aiChoiceEl.textContent = '?';
    aiChoiceEl.className = 'choice-reveal';
    
    playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="You">';
    aiDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
    
    cooperateBtn.disabled = false;
    betrayBtn.disabled = false;
    nextRoundBtn.classList.remove('active');
    updateDisplay();
    dialogueText.textContent = `Round ${currentRound}/${MAX_ROUNDS}. Make your choice: Will you stay silent or betray?`;
}

function showStatsModal() {
    const modalResult = document.getElementById('modalResult');
    
    if (playerScore < aiScore) {
        modalResult.innerHTML = `<strong>You Win!</strong><br>You got ${playerScore} years vs AI's ${aiScore} years. Lower is better! You played smarter than the AI.`;
    } else if (playerScore > aiScore) {
        modalResult.innerHTML = `<strong>AI Wins!</strong><br>You got ${playerScore} years vs AI's ${aiScore} years. The AI outplayed you this time.`;
    } else {
        modalResult.innerHTML = `<strong>It's a Tie!</strong><br>Both got ${playerScore} years. You and the AI were equally matched.`;
    }
    
    updateStatsChart();
    statsModal.classList.add('visible');
}



function updateStatsChart() {
    const maxScore = Math.max(playerScore, aiScore, 10);
    const playerBar = document.getElementById('chartPlayerBar');
    const aiBar = document.getElementById('chartAiBar');
    const playerValue = document.getElementById('chartPlayerValue');
    const aiValue = document.getElementById('chartAiValue');
    
    playerBar.style.width = ((playerScore / maxScore) * 100) + '%';
    aiBar.style.width = ((aiScore / maxScore) * 100) + '%';
    
    playerValue.textContent = playerScore + ' years';
    aiValue.textContent = aiScore + ' years';
    
    document.getElementById('bothCoopCount').textContent = outcomeStats.bothCoop;
    document.getElementById('bothBetrayCount').textContent = outcomeStats.bothBetray;
    document.getElementById('playerBetrayCount').textContent = outcomeStats.playerBetray;
    document.getElementById('aiBetrayCount').textContent = outcomeStats.aiBetray;
}


function newGame() {
    playSound(clickSfx);
    strategyModal.classList.add('visible');
}

//reset
function resetGame() {
    currentRound = 1;
    playerScore = 0;
    aiScore = 0;
    playerChoice = null;
    aiChoice = null;
    gameHistory = [];
    outcomeStats = {
        bothCoop: 0,
        bothBetray: 0,
        playerBetray: 0,
        aiBetray: 0
    };
    
    playerChoiceEl.textContent = '?';
    playerChoiceEl.className = 'choice-reveal';
    aiChoiceEl.textContent = '?';
    aiChoiceEl.className = 'choice-reveal';
    
    playerDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="You">';
    aiDisplay.innerHTML = '<img src="/static/assets/prisoner/prisoner-thinking.png" alt="Opponent">';
    
    cooperateBtn.disabled = false;
    betrayBtn.disabled = false;
    nextRoundBtn.classList.remove('active');
    newGameBtn.classList.remove('active');
    
    updateDisplay();
    dialogueText.textContent = `Round 1/${MAX_ROUNDS}. New game started with ${aiStrategy} AI strategy. Make your choice!`;
    
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
        aiStrategy = btn.dataset.strategy;
        
        const strategyNames = {
            'random': 'Random',
            'alwaysCooperate': 'Always Cooperate',
            'alwaysBetray': 'Always Betray',
            'titForTat': 'Tit-for-Tat',
            'grudger': 'Grudger'
        };
        
        aiStrategyEl.textContent = strategyNames[aiStrategy];
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

