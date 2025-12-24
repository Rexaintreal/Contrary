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
    
    contentImg.src = "/static/assets/goat.png";
    contentImg.alt = 'Goat';
    contentText.textContent = 'GOAT';
    contentText.classList.add('text-gray-400');
    


    document.getElementById('actionButtons').classList.remove('hidden');
    document.getElementById('gameStatus').querySelector('p').textContent = 'Door ' + (revealedDoor + 1) + ' revealed a goat! Will you STAY or SWITCH?';
    document.getElementById('gameStatus').querySelector('p').className = 'text-lg text-white font-semibold';
}


function handleStay() {
    stats.stayTotal++;
    const won = chosenDoor === carDoor;
    if (won) stats.stayWins++;
    
    endGame(won, false);
}


function handleSwitch() {
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
                contentImg.src = "/static/assets/car.png";
                contentImg.alt = 'Car';
                contentText.textContent = 'CAR';
                contentText.classList.add('text-[#16a34a]');
                door.classList.add('bg-[#16a34a]');
                door.classList.remove('bg-[#8b5a2b]');
            } else {
                //DA GOAT?? 🐐🐐🐐🐐🐐 Messi or Ronaldo? (I dont follow football sorry)
                contentImg.src = "/static/assets/goat.png";
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
        saveStats();
        updateStatsDisplay();
        updateChart();
    }, 800);
}



function updateStatsDisplay() {
    const totalGames = stats.stayTotal + stats.switchTotal;
    document.getElementById('gamesPlayed').textContent = totalGames;
    
    document.getElementById('stayWins').textContent = stats.stayWins;
    document.getElementById('stayTotal').textContent = stats.stayTotal;
    document.getElementById('stayPercent').textContent = stats.stayTotal > 0 
        ? `${((stats.stayWins / stats.stayTotal) * 100).toFixed(1)}%`
        : '0%';
    
    document.getElementById('switchWins').textContent = stats.switchWins;
    document.getElementById('switchTotal').textContent = stats.switchTotal;
    document.getElementById('switchPercent').textContent = stats.switchTotal > 0 
        ? `${((stats.switchWins / stats.switchTotal) * 100).toFixed(1)}%`
        : '0%';
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
function runSimulation(count) {
    for (let i = 0; i < count; i++) {
        const car = Math.floor(Math.random() * 3);
        const choice = Math.floor(Math.random() * 3);
        stats.stayTotal++;
        if (choice === car) stats.stayWins++;
        stats.switchTotal++;
        if (choice !== car) stats.switchWins++;
    }
    
    saveStats();
    updateStatsDisplay();
    updateChart();
    const status = document.getElementById('gameStatus').querySelector('p');
    status.textContent = 'Completed 100 simulations! Check the updated statistics.';
    status.className = 'text-lg text-[#d6a3ff] font-semibold';
}

//clear stats
function clearStats() {
    if (confirm('Are you sure you want to clear all statistics?')) {
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
        status.textContent = 'Statistics cleared. Start a new game!'; // add modal instead of alerts later
        status.className = 'text-lg text-gray-300';
    }
}

//event listener
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    initChart();
    updateChart();
    initGame();
    checkFirstVisit();
    
    //tutorial
    document.getElementById('showTutorial').addEventListener('click', () => {
        document.getElementById('tutorialModal').classList.remove('hidden');
    });
    
    
    document.getElementById('closeTutorial').addEventListener('click', () => {
        document.getElementById('tutorialModal').classList.add('hidden');
    });


    document.getElementById('startPlaying').addEventListener('click', () => {
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
    document.getElementById('resetBtn').addEventListener('click', initGame);
    document.getElementById('simulate100').addEventListener('click', () => runSimulation(100));
    document.getElementById('clearStats').addEventListener('click', clearStats);
});

