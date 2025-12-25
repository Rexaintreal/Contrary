//icons
lucide.createIcons();


//states
let totalDistance = 100;
let coveredDistance = 0;
let steps = 0;
let isAnimating = false;
let stepHistory = [];
let convergenceChart;
let animationSpeed = 500;

const AudioManager = {
    sounds: {},
    muted: false,
    
    init() {
        this.muted = localStorage.getItem('soundMuted') === 'true';
        this.updateMuteButton();
        this.sounds = {
            step: new Audio('/static/assets/zeno/bellclick.mp3'),
            start: new Audio('/static/assets/zeno/racestartbeep.mp3')
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
            this.play('step');
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

function checkFirstVisit() {
    const hasVisited = localStorage.getItem('zenoVisited');
    if (!hasVisited) {
        document.getElementById('tutorialModal').classList.remove('hidden');
        localStorage.setItem('zenoVisited', 'true');
    }
}

function updateDistance() {
    totalDistance = parseInt(document.getElementById('distanceSlider').value);
    document.getElementById('distanceValue').textContent = totalDistance;
    resetRace();
}


function updateSpeed() {
    const speed = parseInt(document.getElementById('speedSlider').value);
    animationSpeed = speed;
    document.getElementById('speedValue').textContent = speed + 'ms';
}

function resetRace() {
    coveredDistance = 0;
    steps = 0;
    stepHistory = [];
    isAnimating = false;
    
    updateDisplay();
    updateAchillesPosition();
    updateStepHistory();
    updateChart();
    
    const statusEl = document.getElementById('statusMessage').querySelector('p');
    statusEl.textContent = 'Ready to start! Click "Start Race" or "Single Step"';
    statusEl.className = 'text-lg text-gray-300';
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stepBtn').disabled = false;
    
    const startBtn = document.getElementById('startBtn');
    startBtn.innerHTML = `
        <i data-lucide="play" class="w-5 h-5"></i>
        Start Race
    `;
    lucide.createIcons();
}




function updateDisplay() {
    document.getElementById('stepCount').textContent = steps;
    document.getElementById('coveredDistance').textContent = coveredDistance.toFixed(4) + 'm';
    
    const remaining = Math.max(0, totalDistance - coveredDistance);
    document.getElementById('remainingDistance').textContent = remaining.toFixed(4) + 'm';
    
    const progress = Math.min(100, (coveredDistance / totalDistance * 100));
    document.getElementById('progressPercent').textContent = progress.toFixed(2) + '%';
}

function updateAchillesPosition() {
    const achilles = document.getElementById('achilles');
    const track = document.getElementById('raceTrack');
    const trackWidth = track.offsetWidth - 100;
    
    const progress = Math.min(1, coveredDistance / totalDistance);
    const position = progress * trackWidth;
    achilles.style.left = (50 + position) + 'px';
    
    if (progress > 0.1) {
        achilles.classList.add('running');
    } else {
        achilles.classList.remove('running');
    }
}

function takeStep() {
    if (coveredDistance >= totalDistance * 0.99999) {
        return false;
    }
    
    const remaining = totalDistance - coveredDistance;
    const stepDistance = remaining / 2;
    
    coveredDistance += stepDistance;
    steps++;
    
    stepHistory.push({
        step: steps,
        distance: stepDistance,
        total: coveredDistance,
        remaining: totalDistance - coveredDistance,
        percentage: (coveredDistance / totalDistance * 100)
    });
    
    AudioManager.play('step');
    updateDisplay();
    updateAchillesPosition();
    updateStepHistory();
    updateChart();
    
    return true;
}

function updateStepHistory() {
    const container = document.getElementById('stepHistory');
    
    if (stepHistory.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No steps yet. Start the race to see the progression.</p>';
        return;
    }
    
    const recentSteps = stepHistory.slice(-10).reverse();
    
    container.innerHTML = recentSteps.map((step, index) => {
        const isRecent = index === 0;
        return `
        <div class="bg-[#0a0a0a] p-3 rounded-lg border ${isRecent ? 'border-[#d6a3ff]' : 'border-gray-800'} flex justify-between items-center transition-all ${isRecent ? 'scale-105' : ''}">
            <div class="flex items-center gap-3">
                <span class="text-[#d6a3ff] font-bold">Step ${step.step}</span>
                <span class="text-gray-400 text-sm">+${step.distance.toFixed(6)}m</span>
            </div>
            <div class="text-right">
                <div class="text-white font-semibold">${step.total.toFixed(6)}m</div>
                <div class="text-xs text-gray-500">${step.percentage.toFixed(4)}%</div>
            </div>
        </div>
    `}).join('');
    
    if (stepHistory.length > 10) {
        container.innerHTML += `<p class="text-gray-500 text-center text-sm py-2">Showing last 10 of ${stepHistory.length} steps</p>`;
    }
}

function initChart() {
    const ctx = document.getElementById('convergenceChart').getContext('2d');
    convergenceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Distance Covered',
                data: [],
                borderColor: '#d6a3ff',
                backgroundColor: 'rgba(214, 163, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#d6a3ff'
            }, {
                label: 'Target Distance',
                data: [],
                borderColor: '#16a34a',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 300
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(value) {
                            return value.toFixed(2) + 'm';
                        }
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9CA3AF',
                        maxTicksLimit: 15
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#9CA3AF',
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#fff',
                    bodyColor: '#d6a3ff',
                    borderColor: '#d6a3ff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(6) + 'm';
                        }
                    }
                }
            }
        }
    });
}


//update
function updateChart() {
    if (!convergenceChart) return;
    
    const displaySteps = stepHistory.length > 50 ? stepHistory.filter((_, i) => i % 2 === 0) : stepHistory;
    
    convergenceChart.data.labels = displaySteps.map(s => s.step);
    convergenceChart.data.datasets[0].data = displaySteps.map(s => s.total);
    convergenceChart.data.datasets[1].data = displaySteps.map(() => totalDistance);
    
    convergenceChart.update('none');
}



//start
async function startRace() {
    if (isAnimating) {
        isAnimating = false;
        document.getElementById('startBtn').innerHTML = `
            <i data-lucide="play" class="w-5 h-5"></i>
            Start Race
        `;
        lucide.createIcons();
        return;
    }
    
    AudioManager.play('start');
    isAnimating = true;
    
    const startBtn = document.getElementById('startBtn');
    startBtn.innerHTML = `
        <i data-lucide="pause" class="w-5 h-5"></i>
        Pause
    `;
    lucide.createIcons();
    
    document.getElementById('stepBtn').disabled = true;
    
    const statusEl = document.getElementById('statusMessage').querySelector('p');
    statusEl.textContent = 'Achilles is chasing the tortoise...';
    statusEl.className = 'text-lg text-[#d6a3ff]';
    
    let canContinue = true;
    let maxSteps = 30;
    
    while (canContinue && isAnimating && steps < maxSteps) {
        canContinue = takeStep();
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    isAnimating = false;
    startBtn.innerHTML = `
        <i data-lucide="play" class="w-5 h-5"></i>
        Start Race
    `;
    lucide.createIcons();
    
    if (coveredDistance >= totalDistance * 0.99999) {
        statusEl.textContent = 'Race complete! Achilles effectively reached the tortoise after ' + steps + ' steps. Distance covered: ' + coveredDistance.toFixed(6) + 'm';
        statusEl.className = 'text-lg text-[#16a34a] font-semibold';
    } else if (steps >= maxSteps) {
        const remaining = totalDistance - coveredDistance;
        statusEl.textContent = 'Stopped after ' + steps + ' steps. Remaining: ' + remaining.toFixed(6) + 'm (effectively zero)';
        statusEl.className = 'text-lg text-white';
    } else {
        statusEl.textContent = 'Race paused at step ' + steps + '. Click Start to continue.';
        statusEl.className = 'text-lg text-gray-300';
    }
    
    document.getElementById('stepBtn').disabled = false;
}


//single step
function singleStep() {
    if (isAnimating) return;
    
    const canContinue = takeStep();
    
    const statusEl = document.getElementById('statusMessage').querySelector('p');
    if (!canContinue) {
        statusEl.textContent = 'Effectively reached the target! Distance: ' + coveredDistance.toFixed(6) + 'm';
        statusEl.className = 'text-lg text-[#16a34a] font-semibold';
    } else {
        const remaining = totalDistance - coveredDistance;
        statusEl.textContent = `Step ${steps} complete. Distance: ${coveredDistance.toFixed(6)}m. Remaining: ${remaining.toFixed(6)}m`;
        statusEl.className = 'text-lg text-white';
    }
}


//auto complete func
function autoComplete() {
    if (isAnimating) return;
    
    AudioManager.play('start');
    
    const statusEl = document.getElementById('statusMessage').querySelector('p');
    statusEl.textContent = 'Running to completion...';
    statusEl.className = 'text-lg text-[#d6a3ff]';
    
    let maxSteps = 50;
    let canContinue = true;
    
    while (canContinue && steps < maxSteps) {
        canContinue = takeStep();
    }
    
    statusEl.textContent = 'Completed ' + steps + ' steps. Final distance: ' + coveredDistance.toFixed(6) + 'm';
    statusEl.className = 'text-lg text-[#16a34a] font-semibold';
}

document.addEventListener('DOMContentLoaded', () => {
    //init
    AudioManager.init();
    checkFirstVisit();
    initChart();
    resetRace();
    
    document.getElementById('muteBtn')?.addEventListener('click', () => {
        AudioManager.toggleMute();
    });
    
    document.getElementById('showTutorial').addEventListener('click', () => {
        AudioManager.play('step');
        document.getElementById('tutorialModal').classList.remove('hidden');
    });
    
    document.getElementById('closeTutorial').addEventListener('click', () => {
        AudioManager.play('step');
        document.getElementById('tutorialModal').classList.add('hidden');
    });
    

    document.getElementById('startExploring').addEventListener('click', () => {
        AudioManager.play('step');
        document.getElementById('tutorialModal').classList.add('hidden');
    });
    


    document.getElementById('tutorialModal').addEventListener('click', (e) => {
        if (e.target.id === 'tutorialModal') {
            document.getElementById('tutorialModal').classList.add('hidden');
        }
    });
    

    document.getElementById('distanceSlider').addEventListener('input', updateDistance);
    document.getElementById('speedSlider').addEventListener('input', updateSpeed);
    document.getElementById('startBtn').addEventListener('click', startRace);
    document.getElementById('stepBtn').addEventListener('click', singleStep);
    document.getElementById('autoCompleteBtn').addEventListener('click', autoComplete);
    document.getElementById('resetBtn').addEventListener('click', () => {
        AudioManager.play('step');
        resetRace();
    });
});

