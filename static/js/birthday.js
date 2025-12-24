lucide.createIcons();

// states
let numPeople = 23;
let birthdays = [];
let stats = {
    matchCount: 0,
    noMatchCount: 0,
    totalSimulations: 0
};

let probabilityChart;

// Audio Manager 
const AudioManager = {
    sounds: {},
    muted: false,
    
    init() {
        this.muted = localStorage.getItem('soundMuted') === 'true';
        this.updateMuteButton();
        
        // Preloaded sounds 
        this.sounds = {
            click: new Audio('/static/assets/birthday/softclick.mp3'),
            match: new Audio('/static/assets/birthday/match.mp3'),
            nomatch: new Audio('/static/assets/birthday/nomatch.mp3')
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
            if (action && window[action]) {
                window[action]();
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

//first visit check
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('birthdayParadoxVisited');
    if (!hasVisited) {
        document.getElementById('tutorialModal').classList.remove('hidden');
        localStorage.setItem('birthdayParadoxVisited', 'true');
    }
}


function loadStats() {
    const saved = localStorage.getItem('birthdayParadoxStats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}


function saveStats() {
    localStorage.setItem('birthdayParadoxStats', JSON.stringify(stats));
}


function calculateTheoreticalProbability(n) {
    if (n > 365) return 100;
    if (n < 2) return 0;
    
    let probability = 1;
    for (let i = 0; i < n; i++) {
        probability *= (365 - i) / 365;
    }
    return (1 - probability) * 100;
}

//random bdays
function generateBirthdays(n) {
    const bdays = [];
    for (let i = 0; i < n; i++) {
        bdays.push(Math.floor(Math.random() * 365));
    }
    return bdays;
}

//check matching bdays
function findMatches(bdays) {
    const matches = [];
    const seen = {};
    
    bdays.forEach((day, index) => {
        if (seen[day] !== undefined) {
            matches.push(day);
        }
        seen[day] = index;
    });
    
    return [...new Set(matches)];
}


function dayToDate(dayNum) {
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + dayNum);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

//render grid
function renderPeopleGrid() {
    const grid = document.getElementById('peopleGrid');
    const matches = findMatches(birthdays);
    
    grid.innerHTML = '';
    
    for (let i = 0; i < numPeople; i++) {
        const person = document.createElement('div');
        const birthday = birthdays[i];
        const hasMatch = matches.includes(birthday);
        
        person.className = `flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
            hasMatch 
                ? 'bg-[#16a34a]/20 border-[#16a34a] shadow-lg shadow-[#16a34a]/20' 
                : 'bg-[#0a0a0a] border-gray-800'
        }`;
        
        person.innerHTML = `
            <i data-lucide="user" class="w-6 h-6 ${hasMatch ? 'text-[#16a34a]' : 'text-gray-400'} mb-2"></i>
            <span class="text-xs font-semibold ${hasMatch ? 'text-[#16a34a]' : 'text-gray-500'}">${dayToDate(birthday)}</span>
        `;
        
        grid.appendChild(person);
    }
    
    lucide.createIcons();
}


function generateAndDisplay() {
    AudioManager.play('click');
    
    birthdays = generateBirthdays(numPeople);
    const matches = findMatches(birthdays);
    const hasMatch = matches.length > 0;
    

    stats.totalSimulations++;
    if (hasMatch) {
        stats.matchCount++;
        AudioManager.play('match');
    } else {
        stats.noMatchCount++;
        AudioManager.play('nomatch');
    }
    
    saveStats();
    updateStatsDisplay();
    renderPeopleGrid();
    const statusEl = document.getElementById('statusMessage').querySelector('p');
    if (hasMatch) {
        statusEl.textContent = `Match found! ${matches.length} birthday${matches.length > 1 ? 's' : ''} shared by multiple people!`;
        statusEl.className = 'text-lg text-[#16a34a] font-semibold';
    } else {
        statusEl.textContent = 'No matches found. All birthdays are unique!';
        statusEl.className = 'text-lg text-gray-400';
    }
}


function runSimulations(count) {
    AudioManager.play('click');
    
    let matches = 0;
    for (let i = 0; i < count; i++) {
        const bdays = generateBirthdays(numPeople);
        const foundMatches = findMatches(bdays);
        if (foundMatches.length > 0) matches++;
    }
    
    stats.totalSimulations += count;
    stats.matchCount += matches;
    stats.noMatchCount += (count - matches);
    
    saveStats();
    updateStatsDisplay();
    
    const actualProb = (matches / count * 100).toFixed(1);
    const theoreticalProb = calculateTheoreticalProbability(numPeople).toFixed(1);
    
    showModal(
        'Simulation Complete!',
        `Ran ${count} simulations with ${numPeople} people.\n\nMatches found: ${matches}/${count}\nActual: ${actualProb}%\nTheoretical: ${theoreticalProb}%`,
        'success',
        [
            { text: 'Awesome!', action: null, class: 'bg-[#d6a3ff] hover:bg-[#c48aff] text-[#141414]' }
        ]
    );
}

function updateStatsDisplay() {
    document.getElementById('totalSimulations').textContent = stats.totalSimulations;
    document.getElementById('matchCount').textContent = stats.matchCount;
    document.getElementById('noMatchCount').textContent = stats.noMatchCount;
    
    const matchRate = stats.totalSimulations > 0 
        ? (stats.matchCount / stats.totalSimulations * 100).toFixed(1)
        : 0;
    
    document.getElementById('matchRate').textContent = matchRate + '%';
    document.getElementById('actualProb').textContent = matchRate + '%';
}

function updatePeopleCount() {
    numPeople = parseInt(document.getElementById('peopleSlider').value);
    document.getElementById('peopleCount').textContent = numPeople;
    
    const theoretical = calculateTheoreticalProbability(numPeople).toFixed(1);
    document.getElementById('theoreticalProb').textContent = theoretical + '%';
    document.getElementById('peopleGrid').innerHTML = '';
    document.getElementById('statusMessage').querySelector('p').textContent = 'Click "Generate Birthdays" to start!';
    document.getElementById('statusMessage').querySelector('p').className = 'text-lg text-gray-300';
    
    birthdays = [];
}

//initialize prob chart
function initChart() {
    const ctx = document.getElementById('probabilityChart').getContext('2d');
    const labels = [];
    const data = [];
    for (let i = 2; i <= 100; i += 2) {
        labels.push(i);
        data.push(calculateTheoreticalProbability(i));
    }
    
    probabilityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probability of Match (%)',
                data: data,
                borderColor: '#d6a3ff',
                backgroundColor: 'rgba(214, 163, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#d6a3ff',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
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
                        color: '#9CA3AF',
                        maxTicksLimit: 10
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
                            return context.parsed.y.toFixed(1) + '% chance';
                        },
                        title: function(context) {
                            return context[0].label + ' people';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

//event listeneres
document.addEventListener('DOMContentLoaded', () => {
    //init everything
    AudioManager.init();
    loadStats();
    initChart();
    updatePeopleCount();
    checkFirstVisit();
    
    
    document.getElementById('muteBtn')?.addEventListener('click', () => {
        AudioManager.toggleMute();
    });
    
    
    document.getElementById('showTutorial').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.remove('hidden');
    });
    
    document.getElementById('closeTutorial').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.add('hidden');
    });
    
    document.getElementById('startExploring').addEventListener('click', () => {
        AudioManager.play('click');
        document.getElementById('tutorialModal').classList.add('hidden');
    });
    
    document.getElementById('tutorialModal').addEventListener('click', (e) => {
        if (e.target.id === 'tutorialModal') {
            document.getElementById('tutorialModal').classList.add('hidden');
        }
    });
    document.getElementById('peopleSlider').addEventListener('input', updatePeopleCount);
    document.getElementById('generateBtn').addEventListener('click', generateAndDisplay);
    document.getElementById('simulate1000').addEventListener('click', () => runSimulations(1000));
});


