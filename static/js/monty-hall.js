lucide.createIcons();

//state
let carDoor;
let chosenDoor;
let revealedDoor;
let gameStage = 'choose';
let stats = {
    stayWins: 0,
    stayTotal: 0,
    switchWins: 0,
    switchTotal: 0
};

let statsChart;
let isSimulating = false;

//audio mngmt
const AudioManager = {
    sounds: {},
    muted: false,
    
    init() {
        this.muted = localStorage.getItem('soundMuted') === 'true';
        this.updateMuteButton();
        
        //pre loading all the sounnds
        this.sounds = {
            doorOpen: new Audio('/static/assets/monty/dooropen.mp3'),
            goat: new Audio('/static/assets/monty/goat.mp3'),
            click: new Audio('/static/assets/monty/click.mp3'),
            success: new Audio('/static/assets/monty/success.mp3')
        };
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
        });
    },
    
    play(soundName) {
        if (this.muted || !this.sounds[soundName]) return;
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.sounds[soundName].volume;
        sound.play().catch(err => console.log('Audio play failed:', err));
    },
    
    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        this.updateMuteButton();
        if (!this.muted) {
            this.play('click');
        }
    },
    
    updateMuteButton() {
        const btn = document.getElementById('muteBtn');
        if (!btn) return;
        
        const iconName = this.muted ? 'volume-x' : 'volume-2';
        btn.innerHTML = `<i data-lucide="${iconName}" class="w-6 h-6"></i>`;
        
        if (this.muted) {
            btn.classList.add('opacity-50');
        } else {
            btn.classList.remove('opacity-50');
        }
        lucide.createIcons();
    }
};

function animateValue(elementId, start, end, duration = 500, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const value = Math.floor(start + range * easeProgress);
        element.textContent = value + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end + suffix;
        }
    }
    requestAnimationFrame(update);
}

function animatePercentage(elementId, start, end, duration = 500) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startVal = parseFloat(start) || 0;
    const endVal = parseFloat(end) || 0;
    const range = endVal - startVal;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const value = startVal + range * easeProgress;
        element.textContent = value.toFixed(1) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = endVal.toFixed(1) + '%';
        }
    }
    requestAnimationFrame(update);
}

//Modal System
function showModal(title, message, type = 'info', buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 modal-overlay';
    
    const iconMap = {
        'success': { icon: 'trophy', color: '#16a34a' },
        'error': { icon: 'x-circle', color: '#dc2626' },
        'info': { icon: 'info', color: '#d6a3ff' },
        'warning': { icon: 'alert-triangle', color: '#f59e0b' }
    };
    
    const { icon, color } = iconMap[type] || iconMap['info'];
    
    modal.innerHTML = `
        <div class="bg-[#1a1a1a] border border-[#d6a3ff] rounded-2xl p-8 max-w-md mx-4 modal-content">
            <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background-color: ${color}20;">
                    <i data-lucide="${icon}" class="w-8 h-8" style="color: ${color};"></i>
                </div>
                <h2 class="text-2xl font-bold text-white mb-3">${title}</h2>
                <p class="text-gray-300 mb-6">${message}</p>
                <div class="flex gap-3 w-full">
                    ${buttons.map(btn => `
                        <button class="modal-btn flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${btn.class || 'bg-[#d6a3ff] hover:bg-[#c48aff] text-[#141414]'}" data-action="${btn.action}">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
    modal.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            AudioManager.play('click');
            const action = e.target.dataset.action;
            if (action) {
                window[action]?.();
            }
            closeModal(modal);
        });
    });
    modal.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(modal);
        }
    });
    
    return modal;
}

function closeModal(modal) {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 200);
}

//first visit ---> help modal
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('montyHallVisited');
    if (!hasVisited) {
        document.getElementById('tutorialModal').classList.remove('hidden');
        localStorage.setItem('montyHallVisited', 'true');
    }
}

function loadStats() {
    const saved = localStorage.getItem('montyHallStats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
        updateChart();
    }
}

//save stats in local storage
function saveStats() {
    localStorage.setItem('montyHallStats', JSON.stringify(stats));
}

//init game
function initGame() {
    carDoor = Math.floor(Math.random() * 3);
    chosenDoor = null;
    revealedDoor = null;
    gameStage = 'choose';
    
    document.querySelectorAll('.door').forEach(door => {
        door.classList.remove('opacity-50', 'cursor-not-allowed', 'border-[#d6a3ff]', 'scale-110', 'bg-[#16a34a]', 'bg-[#dc2626]');
        door.classList.add('cursor-pointer', 'bg-[#8b5a2b]');
        
        const doorIcon = door.querySelector('.door-icon');
        const doorNum = door.querySelector('.door-number');
        const doorContent = door.querySelector('.door-content');
        
        if (doorIcon) doorIcon.classList.remove('hidden');
        if (doorNum) doorNum.classList.remove('hidden');
        if (doorContent) doorContent.classList.add('hidden');
    });
    
    document.querySelectorAll('.door-label').forEach(label => {
        label.classList.remove('text-[#d6a3ff]', 'font-bold');
        label.classList.add('text-gray-500');
    });
    
    document.getElementById('actionButtons').classList.add('hidden');
    document.getElementById('gameStatus').querySelector('p').textContent = 'Choose a door to start!';
    document.getElementById('gameStatus').querySelector('p').className = 'text-lg text-gray-300';
    
    //reinit icons
    lucide.createIcons();
}

function handleDoorClick(doorIndex) {
    if (gameStage !== 'choose') return;
    AudioManager.play('click');
    
    chosenDoor = doorIndex;
    gameStage = 'reveal';
    
    const containers = document.querySelectorAll('.door-container');
    containers.forEach((container, i) => {
        const door = container.querySelector('.door');
        const label = container.querySelector('.door-label');
        if (i === doorIndex) {
            door.classList.add('border-[#d6a3ff]', 'scale-110');
            label.classList.add('text-[#d6a3ff]', 'font-bold');
            label.classList.remove('text-gray-500');
        }
    });
    document.getElementById('gameStatus').querySelector('p').textContent = 'You chose Door ' + (doorIndex + 1) + '. The host is revealing a door...';
    document.getElementById('gameStatus').querySelector('p').className = 'text-lg text-[#d6a3ff]';
    
    setTimeout(revealDoor, 1000);
}

//reveal func
function revealDoor() {
    const availableDoors = [0, 1, 2].filter(d => d !== chosenDoor && d !== carDoor);
    revealedDoor = availableDoors[Math.floor(Math.random() * availableDoors.length)];
    AudioManager.play('doorOpen');
    
    //show da GOAT
    const revealedContainer = document.querySelector(`[data-door="${revealedDoor}"]`);
    const revealedDoorEl = revealedContainer.querySelector('.door');
    const doorIcon = revealedDoorEl.querySelector('.door-icon');
    const doorNum = revealedDoorEl.querySelector('.door-number');
    const doorContent = revealedDoorEl.querySelector('.door-content');
    const contentImg = doorContent.querySelector('.door-content-img');
    const contentText = doorContent.querySelector('.door-content-text');
    
    revealedDoorEl.classList.add('opacity-50', 'cursor-not-allowed');
    revealedDoorEl.classList.remove('cursor-pointer');
    
    doorIcon.classList.add('hidden');
    doorNum.classList.add('hidden');
    doorContent.classList.remove('hidden');
    
    contentImg.src = "/static/assets/monty/goat.png";
    contentImg.alt = 'Goat';
    contentText.textContent = 'GOAT';
    contentText.classList.add('text-gray-400');
    


    document.getElementById('actionButtons').classList.remove('hidden');
    document.getElementById('gameStatus').querySelector('p').textContent = 'Door ' + (revealedDoor + 1) + ' revealed a goat! Will you STAY or SWITCH?';
    document.getElementById('gameStatus').querySelector('p').className = 'text-lg text-white font-semibold';
}


function handleStay() {
    AudioManager.play('click');
    stats.stayTotal++;
    const won = chosenDoor === carDoor;
    if (won) stats.stayWins++;
    
    endGame(won, false);
}


function handleSwitch() {
    AudioManager.play('click');
    stats.switchTotal++;

    const oldContainer = document.querySelector(`[data-door="${chosenDoor}"]`);
    const oldDoor = oldContainer.querySelector('.door');
    const oldLabel = oldContainer.querySelector('.door-label');
    oldDoor.classList.remove('border-[#d6a3ff]', 'scale-110');
    oldLabel.classList.remove('text-[#d6a3ff]', 'font-bold');
    oldLabel.classList.add('text-gray-500');
    const otherDoor = [0, 1, 2].find(d => d !== chosenDoor && d !== revealedDoor);
    chosenDoor = otherDoor;
    const newContainer = document.querySelector(`[data-door="${chosenDoor}"]`);
    const newDoor = newContainer.querySelector('.door');
    const newLabel = newContainer.querySelector('.door-label');
    newDoor.classList.add('border-[#d6a3ff]', 'scale-110');
    newLabel.classList.add('text-[#d6a3ff]', 'font-bold');
    newLabel.classList.remove('text-gray-500');
    const won = chosenDoor === carDoor;
    if (won) stats.switchWins++;
    
    setTimeout(() => endGame(won, true), 500);
}

//Reveal
function endGame(won, switched) {
    gameStage = 'result';
    document.getElementById('actionButtons').classList.add('hidden');
    
    //play audio based on outcome
    if (won) {
        AudioManager.play('success');
    } else {
        AudioManager.play('goat');
    }
    
    document.querySelectorAll('.door-container').forEach((container, i) => {
        const door = container.querySelector('.door');
        const doorIcon = door.querySelector('.door-icon');
        const doorNum = door.querySelector('.door-number');
        const doorContent = door.querySelector('.door-content');
        const contentImg = doorContent.querySelector('.door-content-img');
        const contentText = doorContent.querySelector('.door-content-text');
        
        setTimeout(() => {
            doorIcon.classList.add('hidden');
            doorNum.classList.add('hidden');
            doorContent.classList.remove('hidden');
            
            if (i === carDoor) {
                // Car (the first img i found on google)
                contentImg.src = "/static/assets/monty/car.png";
                contentImg.alt = 'Car';
                contentText.textContent = 'CAR';
                contentText.classList.add('text-[#16a34a]');
                door.classList.add('bg-[#16a34a]');
                door.classList.remove('bg-[#8b5a2b]');
            } else {
                //DA GOAT?? 🐐🐐🐐🐐🐐 Messi or Ronaldo? (I dont follow football sorry)
                contentImg.src = "/static/assets/monty/goat.png";
                contentImg.alt = 'Goat';
                contentText.textContent = 'GOAT';
                contentText.classList.add('text-gray-400');
            }
            
            if (i === chosenDoor) {
                if (won) {
                    door.classList.add('border-[#16a34a]');
                } else {
                    door.classList.add('border-[#dc2626]');
                    door.classList.add('bg-[#dc2626]');
                    door.classList.remove('bg-[#8b5a2b]');
                }
            }
        }, 300);
    });
    setTimeout(() => {
        const statusText = won 
            ? `You won! You ${switched ? 'SWITCHED' : 'STAYED'} and got the car!`
            : `You lost. You ${switched ? 'SWITCHED' : 'STAYED'} and got a goat.`;
        
        document.getElementById('gameStatus').querySelector('p').textContent = statusText;
        document.getElementById('gameStatus').querySelector('p').className = won 
            ? 'text-lg text-[#16a34a] font-bold'
            : 'text-lg text-[#dc2626] font-bold';
        
        //result modal
        showModal(
            won ? 'Congratulations!' : 'Better Luck Next Time',
            won 
                ? `You ${switched ? 'switched' : 'stayed'} and won the car! ${switched ? 'Switching increases your odds to 66.7%!' : 'You got lucky with the 33.3% chance!'}` 
                : `You ${switched ? 'switched' : 'stayed'} and got a goat. ${!switched ? 'Try switching next time for better odds!' : 'Keep playing to see the statistics emerge!'}`,
            won ? 'success' : 'error',
            [
                { text: 'Play Again', action: 'initGame', class: 'bg-[#d6a3ff] hover:bg-[#c48aff] text-[#141414]' }
            ]
        );
        
        saveStats();
        updateStatsDisplay();
        updateChart();
    }, 800);
}



function updateStatsDisplay() {
    const totalGames = stats.stayTotal + stats.switchTotal;
    const oldTotal = parseInt(document.getElementById('gamesPlayed').textContent) || 0;
    animateValue('gamesPlayed', oldTotal, totalGames, 300);
    
    const oldStayWins = parseInt(document.getElementById('stayWins').textContent) || 0;
    const oldStayTotal = parseInt(document.getElementById('stayTotal').textContent) || 0;
    animateValue('stayWins', oldStayWins, stats.stayWins, 300);
    animateValue('stayTotal', oldStayTotal, stats.stayTotal, 300);
    
    const oldStayPercent = parseFloat(document.getElementById('stayPercent').textContent) || 0;
    const newStayPercent = stats.stayTotal > 0 ? (stats.stayWins / stats.stayTotal) * 100 : 0;
    animatePercentage('stayPercent', oldStayPercent, newStayPercent, 300);
    
    const oldSwitchWins = parseInt(document.getElementById('switchWins').textContent) || 0;
    const oldSwitchTotal = parseInt(document.getElementById('switchTotal').textContent) || 0;
    animateValue('switchWins', oldSwitchWins, stats.switchWins, 300);
    animateValue('switchTotal', oldSwitchTotal, stats.switchTotal, 300);
    
    const oldSwitchPercent = parseFloat(document.getElementById('switchPercent').textContent) || 0;
    const newSwitchPercent = stats.switchTotal > 0 ? (stats.switchWins / stats.switchTotal) * 100 : 0;
    animatePercentage('switchPercent', oldSwitchPercent, newSwitchPercent, 300);
}

//init charts.js
function initChart() {
    const ctx = document.getElementById('statsChart').getContext('2d');
    statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Stay Strategy', 'Switch Strategy', 'Theoretical Switch'],
            datasets: [{
                label: 'Win Rate (%)',
                data: [0, 0, 66.7],
                backgroundColor: [
                    '#dc2626',
                    '#16a34a',
                    '#d6a3ff'
                ],
                borderColor: [
                    '#dc2626',
                    '#16a34a',
                    '#d6a3ff'
                ],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9CA3AF'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#fff',
                    bodyColor: '#d6a3ff',
                    borderColor: '#d6a3ff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Win Rate: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!statsChart) return;
    
    const stayRate = stats.stayTotal > 0 ? (stats.stayWins / stats.stayTotal) * 100 : 0;
    const switchRate = stats.switchTotal > 0 ? (stats.switchWins / stats.switchTotal) * 100 : 0;
    
    statsChart.data.datasets[0].data = [
        stayRate,
        switchRate,
        66.7
    ];
    statsChart.update();
}

//auto sim 
async function runSimulation(count) {
    if (isSimulating) return;
    
    AudioManager.play('click');
    isSimulating = true;
    
    const button = document.getElementById('simulate100');
    const originalText = button.innerHTML;
    
    const batchSize = 20;
    const batches = Math.ceil(count / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
        const currentBatchSize = Math.min(batchSize, count - batch * batchSize);
        
        const progress = Math.round(((batch * batchSize) / count) * 100);
        button.innerHTML = `
            <i data-lucide="loader" class="w-5 h-5 animate-spin"></i>
            Simulating... ${progress}%
        `;
        lucide.createIcons();
        
        // Run batch
        for (let i = 0; i < currentBatchSize; i++) {
            const car = Math.floor(Math.random() * 3);
            const choice = Math.floor(Math.random() * 3);
            stats.stayTotal++;
            if (choice === car) stats.stayWins++;
            stats.switchTotal++;
            if (choice !== car) stats.switchWins++;
        }
        
        // Update display progressively
        updateStatsDisplay();
        updateChart();
        
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    saveStats();
    
    button.innerHTML = originalText;
    lucide.createIcons();
    isSimulating = false;
    
    const stayRate = (stats.stayWins / stats.stayTotal * 100).toFixed(1);
    const switchRate = (stats.switchWins / stats.switchTotal * 100).toFixed(1);
    
    showModal(
        'Simulation Complete!',
        `Ran ${count} simulations successfully!\n\nStay Win Rate: ${stayRate}% (Theoretical: 33.3%)\nSwitch Win Rate: ${switchRate}% (Theoretical: 66.7%)\n\nThe more you play, the closer it gets to theory!`,
        'success',
        [
            { text: 'Awesome!', action: null, class: 'bg-[#d6a3ff] hover:bg-[#c48aff] text-[#141414]' }
        ]
    );
}

//clear stats
function clearStats() {
    showModal(
        'Clear Statistics?',
        'Are you sure you want to clear all your game statistics? This action cannot be undone.',
        'warning',
        [
            { 
                text: 'Cancel', 
                action: null, 
                class: 'bg-gray-600 hover:bg-gray-700 text-white' 
            },
            { 
                text: 'Clear All', 
                action: 'confirmClearStats', 
                class: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white' 
            }
        ]
    );
}

function confirmClearStats() {
    stats = {
        stayWins: 0,
        stayTotal: 0,
        switchWins: 0,
        switchTotal: 0
    };
    saveStats();
    updateStatsDisplay();
    updateChart();
    
    const status = document.getElementById('gameStatus').querySelector('p');
    status.textContent = 'Statistics cleared. Start a new game!';
    status.className = 'text-lg text-gray-300';
}

//event listener
document.addEventListener('DOMContentLoaded', () => {
    //init audio manager
    AudioManager.init();
    
    loadStats();
    initChart();
    updateChart();
    initGame();
    checkFirstVisit();
    document.getElementById('muteBtn')?.addEventListener('click', () => {
        AudioManager.toggleMute();
    });
    
    //tutorial
    document.getElementById('showTutorial').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.remove('hidden');
    });
    
    
    document.getElementById('closeTutorial').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.add('hidden');
    });


    document.getElementById('startPlaying').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.add('hidden');
    });


    document.getElementById('tutorialModal').addEventListener('click', (e) => {
        if (e.target.id === 'tutorialModal') {
            document.getElementById('tutorialModal').classList.add('hidden');
        }
    });


    document.querySelectorAll('.door-container').forEach((container, i) => {
        container.addEventListener('click', () => handleDoorClick(i));
    });


    document.getElementById('stayBtn').addEventListener('click', handleStay);
    document.getElementById('switchBtn').addEventListener('click', handleSwitch);
    document.getElementById('resetBtn').addEventListener('click', () => {
        AudioManager.play('click');
        initGame();
    });
    document.getElementById('simulate100').addEventListener('click', () => runSimulation(100));
    document.getElementById('clearStats').addEventListener('click', clearStats);
});

