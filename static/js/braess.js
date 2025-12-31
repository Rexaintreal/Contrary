lucide.createIcons();

//states
let cars = [];
let carIdCounter = 0;
let shortcutActive = false;
let stats = {
    withoutShortcut: {
        totalTime: 0,
        carCount: 0
    },
    withShortcut: {
        totalTime: 0,
        carCount: 0
    }
};

//audio
let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const carSfx = document.getElementById('carSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');
const carsContainer = document.getElementById('carsContainer');
const shortcutRoad = document.getElementById('shortcutRoad');
const addCarBtn = document.getElementById('addCarBtn');
const shortcutBtn = document.getElementById('shortcutBtn');
const resetBtn = document.getElementById('resetBtn');
const statsBtn = document.getElementById('statsBtn');
const dialogueText = document.getElementById('dialogueText');
const carCount = document.getElementById('carCount');
const avgTime = document.getElementById('avgTime');
const shortcutStatus = document.getElementById('shortcutStatus');
const statsModal = document.getElementById('statsModal');
const resetModal = document.getElementById('resetModal');


const carSprites = [
    '/static/assets/braess/car-blue.png',
    '/static/assets/braess/car-red.png',
    '/static/assets/braess/car-yellow.png'
];


//pos
const positions = {
    start: { x: 60, y: 225 },
    topEntry: { x: 120, y: 60 },
    bottomEntry: { x: 120, y: 390 },
    topMid: { x: 230, y: 60 },
    topIntersection: { x: 400, y: 60 },
    topRight: { x: 570, y: 60 },
    bottomMid: { x: 230, y: 390 },
    bottomIntersection: { x: 400, y: 390 },
    bottomRight: { x: 570, y: 390 },
    topExit: { x: 680, y: 60 },
    bottomExit: { x: 680, y: 390 },
    
    end: { x: 740, y: 225 }
};

//route def
function getRoutes() {
    const carCount = cars.length;
    
    if (!shortcutActive) {
        const congestion = Math.max(0, carCount - 10) * 50;
        return [
            {
                name: 'Top Route',
                path: ['start', 'topEntry', 'topMid', 'topIntersection', 'topRight', 'topExit', 'end'],
                baseTime: 3000,
                congestionTime: congestion
            },
            {
                name: 'Bottom Route',
                path: ['start', 'bottomEntry', 'bottomMid', 'bottomIntersection', 'bottomRight', 'bottomExit', 'end'],
                baseTime: 3000,
                congestionTime: congestion
            }
        ];
    } else {
        const heavyCongestion = Math.max(0, carCount - 5) * 150; 
        return [
            {
                name: 'Top to Bottom Shortcut',
                path: ['start', 'topEntry', 'topMid', 'topIntersection', 'bottomIntersection', 'bottomRight', 'bottomExit', 'end'],
                baseTime: 2500,
                congestionTime: heavyCongestion
            },
            {
                name: 'Bottom to Top Shortcut',
                path: ['start', 'bottomEntry', 'bottomMid', 'bottomIntersection', 'topIntersection', 'topRight', 'topExit', 'end'],
                baseTime: 2500,
                congestionTime: heavyCongestion
            }
        ];
    }
}

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


function updateDisplay() {
    carCount.textContent = cars.length;
    
    const totalCars = stats.withoutShortcut.carCount + stats.withShortcut.carCount;
    const totalTime = stats.withoutShortcut.totalTime + stats.withShortcut.totalTime;
    const average = totalCars > 0 ? (totalTime / totalCars / 1000).toFixed(1) : 0;
    
    avgTime.textContent = average;
    shortcutStatus.textContent = shortcutActive ? 'ON' : 'OFF';
    if (!shortcutActive && cars.length === 0) {
        dialogueText.textContent = "Welcome to the traffic network! Cars travel from START to END. Click 'RUN CARS' to add vehicles. Notice something strange when you add the shortcut...";
    } else if (!shortcutActive && cars.length > 0) {
        dialogueText.textContent = `${cars.length} cars on the road. Traffic flows smoothly with balanced routes. Now try adding the SHORTCUT and watch what happens!`;
    } else if (shortcutActive && cars.length === 0) {
        dialogueText.textContent = "Shortcut road is ACTIVE! Now add some cars and watch them all try to use the 'faster' route. Spoiler: it gets congested!";
    } else {
        dialogueText.textContent = `${cars.length} cars using the shortcut... Travel times are WORSE! This is the Braess Paradox in action. Press 'S' to see detailed stats!`;
    }
}
function addCar() {
    const routes = getRoutes();
    const route = routes[Math.floor(Math.random() * routes.length)];
    const sprite = carSprites[Math.floor(Math.random() * carSprites.length)];
    
    const car = {
        id: carIdCounter++,
        sprite: sprite,
        route: route,
        currentSegment: 0,
        startTime: Date.now()
    };
    
    cars.push(car);
    
    const carEl = document.createElement('div');
    carEl.className = 'car';
    carEl.dataset.carId = car.id;
    const startPos = positions[route.path[0]];
    carEl.style.left = startPos.x + 'px';
    carEl.style.top = startPos.y + 'px';
    
    const img = document.createElement('img');
    img.src = sprite;
    img.alt = 'Car';
    carEl.appendChild(img);
    
    carsContainer.appendChild(carEl);
    
    playSound(carSfx);
    moveCar(car, carEl);
    updateDisplay();
}


function moveCar(car, carEl) {
    const route = car.route;
    const totalTime = route.baseTime + route.congestionTime;
    const segmentTime = totalTime / (route.path.length - 1);
    
    function moveToNextSegment() {
        car.currentSegment++;
        
        if (car.currentSegment >= route.path.length) {
            const travelTime = Date.now() - car.startTime;
            
            if (shortcutActive) {
                stats.withShortcut.totalTime += travelTime;
                stats.withShortcut.carCount++;
            } else {
                stats.withoutShortcut.totalTime += travelTime;
                stats.withoutShortcut.carCount++;
            }
            
            carEl.remove();
            cars = cars.filter(c => c.id !== car.id);
            updateDisplay();
            return;
        }
        
        const currentPos = positions[route.path[car.currentSegment - 1]];
        const targetPos = positions[route.path[car.currentSegment]];
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        carEl.style.transform = `rotate(${angle}deg)`;
        
        carEl.style.left = targetPos.x + 'px';
        carEl.style.top = targetPos.y + 'px';
        carEl.style.transitionDuration = (segmentTime / 1000) + 's';
        
        car.timeoutId = setTimeout(moveToNextSegment, segmentTime);
    }
    
    car.timeoutId = setTimeout(moveToNextSegment, segmentTime);
}

function toggleShortcut() {
    shortcutActive = !shortcutActive;
    if (shortcutActive) {
        shortcutRoad.classList.add('active');
        shortcutBtn.querySelector('img').src = '/static/assets/braess/button-remove-road.png';
        shortcutBtn.setAttribute('data-label', 'Remove Shortcut');
        dialogueText.textContent = "Shortcut ADDED! Now cars will use the 'faster' route. But watch what happens to traffic...";
    } else {
        shortcutRoad.classList.remove('active');
        shortcutBtn.querySelector('img').src = '/static/assets/braess/button-add-road.png';
        shortcutBtn.setAttribute('data-label', 'Add Shortcut');
        dialogueText.textContent = "Shortcut REMOVED! Traffic returns to balanced routes. Notice the improvement?";
    }
    
    playSound(clickSfx);
    updateDisplay();
}

function resetTraffic() {
    resetModal.classList.add('visible');
}


function confirmReset() {
    cars.forEach(car => {
        if (car.timeoutId) clearTimeout(car.timeoutId);

        const carEl = document.querySelector(`[data-car-id="${car.id}"]`);
        if (carEl) carEl.remove();
    });
    
    cars = [];
    carIdCounter = 0;
    stats = {
        withoutShortcut: { totalTime: 0, carCount: 0 },
        withShortcut: { totalTime: 0, carCount: 0 }
    };
    shortcutActive = false;
    shortcutRoad.classList.remove('active');
    shortcutBtn.querySelector('img').src = '/static/assets/braess/button-add-road.png';
    shortcutBtn.setAttribute('data-label', 'Add Shortcut');
    
    updateDisplay();
    resetModal.classList.remove('visible');
    statsModal.classList.remove('visible');
    playSound(clickSfx);
}


function showStats() {
    const modalResult = document.getElementById('modalResult');
    const withoutAvg = stats.withoutShortcut.carCount > 0 
        ? (stats.withoutShortcut.totalTime / stats.withoutShortcut.carCount / 1000).toFixed(1) 
        : 0;
    
    const withAvg = stats.withShortcut.carCount > 0 
        ? (stats.withShortcut.totalTime / stats.withShortcut.carCount / 1000).toFixed(1) 
        : 0;
    
    if (stats.withoutShortcut.carCount > 0 && stats.withShortcut.carCount > 0) {
        const difference = ((withAvg - withoutAvg) / withoutAvg * 100).toFixed(1);
        modalResult.innerHTML = `
            Without shortcut: ${withoutAvg}s average (${stats.withoutShortcut.carCount} cars)<br>
            With shortcut: ${withAvg}s average (${stats.withShortcut.carCount} cars)<br><br>
            <strong>The shortcut made traffic ${difference > 0 ? difference + '% WORSE' : 'better'}!</strong>
        `;
    } else if (stats.withoutShortcut.carCount > 0) {
        modalResult.innerHTML = `Without shortcut: ${withoutAvg}s average (${stats.withoutShortcut.carCount} cars)<br><br>Try adding the shortcut and running more cars to see the paradox!`;
    } else if (stats.withShortcut.carCount > 0) {
        modalResult.innerHTML = `With shortcut: ${withAvg}s average (${stats.withShortcut.carCount} cars)<br><br>Try removing the shortcut to see the difference!`;
    } else {
        modalResult.innerHTML = `No data yet! Run some cars to see the paradox in action.`;
    }
    updateStatsChart();
    statsModal.classList.add('visible');
    playSound(clickSfx);
}


function updateStatsChart() {
    const withoutAvg = stats.withoutShortcut.carCount > 0 
        ? stats.withoutShortcut.totalTime / stats.withoutShortcut.carCount / 1000
        : 0;
    
    const withAvg = stats.withShortcut.carCount > 0 
        ? stats.withShortcut.totalTime / stats.withShortcut.carCount / 1000
        : 0;
    
    const maxTime = Math.max(withoutAvg, withAvg, 1);
    const withoutBar = document.getElementById('withoutBar');
    const withBar = document.getElementById('withBar');
    const withoutTime = document.getElementById('withoutTime');
    const withTime = document.getElementById('withTime');
    
    withoutBar.style.width = ((withoutAvg / maxTime) * 100) + '%';
    withBar.style.width = ((withAvg / maxTime) * 100) + '%';
    
    withoutTime.textContent = withoutAvg.toFixed(1) + ' s';
    withTime.textContent = withAvg.toFixed(1) + ' s';
}


function runBatchOfCars() {
    const batchSize = 20;
    for (let i = 0; i < batchSize; i++) {
        setTimeout(() => {
            addCar();
        }, i * 100);
    }
} 



addCarBtn.addEventListener('click', () => {
    playSound(clickSfx);
    runBatchOfCars();
});



addCarBtn.setAttribute('data-label', 'Run Cars');
shortcutBtn.setAttribute('data-label', 'Add Shortcut');
resetBtn.setAttribute('data-label', 'Reset Network');
statsBtn.setAttribute('data-label', 'Show Stats (S)');


shortcutBtn.addEventListener('click', () => {
    toggleShortcut();
});

resetBtn.addEventListener('click', () => {
    playSound(clickSfx);
    resetTraffic();
});

statsBtn.addEventListener('click', () => {
    showStats();
});

document.getElementById('resetConfirm').addEventListener('click', () => {
    confirmReset();
});

document.getElementById('resetCancel').addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.remove('visible');
});

document.getElementById('modalContinue').addEventListener('click', () => {
    playSound(clickSfx);
    statsModal.classList.remove('visible');
});

document.getElementById('modalReset').addEventListener('click', () => {
    playSound(clickSfx);
    statsModal.classList.remove('visible');
    resetModal.classList.add('visible');
});



//keybd shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        runBatchOfCars();
    }
    if (e.key === 's' || e.key === 'S') {
        showStats();
    }
    if (e.key === 'r' || e.key === 'R') {
        resetModal.classList.add('visible');
    }
    if (e.key === 'Escape') {
        resetModal.classList.remove('visible');
        statsModal.classList.remove('visible');
    }
});



[resetModal, statsModal].forEach(modal => {
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
    updateDisplay();
});

