lucide.createIcons();

//states
let patients = [];
let patientIdCounter = 0;
let autoRunInterval = null;
let musicPlaying = false;
let simulationSpeed = 5;
let isAutoRunning = false;
let stats = {
    hospitalA: {
        drugA: { success: 0, total: 0 },
        drugB: { success: 0, total: 0 }
    },
    hospitalB: {
        drugA: { success: 0, total: 0 },
        drugB: { success: 0, total: 0 }
    }
};

const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSfx');
const popSfx = document.getElementById('popSfx');
const successSfx = document.getElementById('successSfx');
const failSfx = document.getElementById('failSfx');
const hospitalDingSfx = document.getElementById('hospitalDingSfx');
const musicToggle = document.getElementById('musicToggle');
const wrapperSound = document.getElementById('wrapperSound');
const wrapperMute = document.getElementById('wrapperMute');
const assignBtn = document.getElementById('assignBtn');
const autoBtn = document.getElementById('autoBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const statsBtn = document.getElementById('statsBtn');
const dialogueText = document.getElementById('dialogueText');
const assignmentModal = document.getElementById('assignmentModal');
const statsModal = document.getElementById('statsModal');
const resetModal = document.getElementById('resetModal');
const infoModal = document.getElementById('infoModal');
const patientQueue = document.getElementById('patientQueue');
const patientsA = document.getElementById('patientsA');
const patientsB = document.getElementById('patientsB');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

//speed control
speedSlider.addEventListener('input', (e) => {
    simulationSpeed = parseInt(e.target.value);
    speedValue.textContent = `Speed: ${simulationSpeed}x`;

    if (isAutoRunning) {
        stopAutoRun();
        startAutoRun();
    }
});

let currentPatient = null;
let selectedHospital = null;
let selectedDrug = null;

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

//generate
function generatePatient() {
    const severity = Math.random() < 0.7 ? 'severe' : 'mild';
    
    return {
        id: patientIdCounter++,
        severity: severity,
        hospital: null,
        drug: null,
        outcome: null
    };
}


function calculateSuccess(severity, drug, hospital) {
    
    if (severity === 'mild') {
        if (drug === 'A') return Math.random() < 0.93;
        else return Math.random() < 0.87;
    } else {
        if (drug === 'A') return Math.random() < 0.73;
        else return Math.random() < 0.69;
    }
}

//queue
function showPatientInQueue(patient) {
    const patientEl = document.createElement('div');
    patientEl.className = 'queued-patient';
    patientEl.dataset.patientId = patient.id;
    
    const img = document.createElement('img');
    img.src = '/static/assets/simpson/patient-waiting.png';
    img.alt = 'Waiting Patient';
    
    const badge = document.createElement('div');
    badge.className = 'severity-badge';
    const badgeImg = document.createElement('img');
    badgeImg.src = patient.severity === 'mild' 
        ? '/static/assets/simpson/mild-case-badge.png'
        : '/static/assets/simpson/severe-case-badge.png';
    badge.appendChild(badgeImg);
    
    patientEl.appendChild(img);
    patientEl.appendChild(badge);
    patientQueue.appendChild(patientEl);
    
    playSound(popSfx);
}



function openAssignmentModal(patient) {
    currentPatient = patient;
    selectedHospital = null;
    selectedDrug = null;
    document.querySelectorAll('.hospital-choice').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('.drug-choice').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.getElementById('confirmBtn').disabled = true;
    assignmentModal.classList.add('visible');
    playSound(clickSfx);
}


function closeAssignmentModal() {
    assignmentModal.classList.remove('visible');
    currentPatient = null;
    selectedHospital = null;
    selectedDrug = null;
}




document.querySelectorAll('.hospital-choice').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(clickSfx);
        document.querySelectorAll('.hospital-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedHospital = btn.dataset.hospital;
        checkConfirmEnabled();
    });
});



document.querySelectorAll('.drug-choice').forEach(btn => {
    btn.addEventListener('click', () => {
        playSound(clickSfx);
        document.querySelectorAll('.drug-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDrug = btn.dataset.drug;
        checkConfirmEnabled();
    });
});

function checkConfirmEnabled() {
    document.getElementById('confirmBtn').disabled = !(selectedHospital && selectedDrug);
}




document.getElementById('confirmBtn').addEventListener('click', () => {
    playSound(clickSfx);
    assignmentModal.classList.remove('visible');
    
    const queueEl = document.querySelector(`[data-patient-id="${currentPatient.id}"]`);
    if (queueEl) queueEl.remove();
    
    currentPatient.hospital = selectedHospital;
    currentPatient.drug = selectedDrug;
    currentPatient.outcome = calculateSuccess(currentPatient.severity, selectedDrug, selectedHospital);
    const hospital = selectedHospital === 'A' ? 'hospitalA' : 'hospitalB';
    const drug = selectedDrug === 'A' ? 'drugA' : 'drugB';
    
    stats[hospital][drug].total++;
    if (currentPatient.outcome) {
        stats[hospital][drug].success++;
    }
    addPatientToHospital(currentPatient);
    
    playSound(hospitalDingSfx);
    updateStatsDisplay();
    updateDialogue();
    
    currentPatient = null;
    selectedHospital = null;
    selectedDrug = null;
});

//add patient
function addPatientToHospital(patient) {
    const container = patient.hospital === 'A' ? patientsA : patientsB;
    
    const patientEl = document.createElement('div');
    patientEl.className = 'patient-in-hospital';
    
    const img = document.createElement('img');
    img.src = '/static/assets/simpson/patient-treated.png';
    img.alt = 'Treated Patient';
    
    const drugBadge = document.createElement('div');
    drugBadge.className = 'patient-badge';
    const drugImg = document.createElement('img');
    drugImg.src = patient.drug === 'A' 
        ? '/static/assets/simpson/pill-a-red.png'
        : '/static/assets/simpson/pill-b-blue.png';
    drugBadge.appendChild(drugImg);

    const resultIcon = document.createElement('div');
    resultIcon.className = 'result-icon';
    const resultImg = document.createElement('img');
    resultImg.src = patient.outcome 
        ? '/static/assets/simpson/success-checkmark.png'
        : '/static/assets/simpson/failure-x.png';
    resultIcon.appendChild(resultImg);
    
    patientEl.appendChild(img);
    patientEl.appendChild(drugBadge);
    patientEl.appendChild(resultIcon);
    
    container.appendChild(patientEl);
    
    //no sound effect whe nauto
    if (!isAutoRunning) {
        setTimeout(() => {
            playSound(patient.outcome ? successSfx : failSfx);
        }, 300);
    }
    
    patients.push(patient);
}

//update stats
function updateStatsDisplay() {

    updateStatRow('hospA-drugA', stats.hospitalA.drugA);
    updateStatRow('hospA-drugB', stats.hospitalA.drugB);
    
    updateStatRow('hospB-drugA', stats.hospitalB.drugA);
    updateStatRow('hospB-drugB', stats.hospitalB.drugB);
    const combinedA = {
        success: stats.hospitalA.drugA.success + stats.hospitalB.drugA.success,
        total: stats.hospitalA.drugA.total + stats.hospitalB.drugA.total
    };
    const combinedB = {
        success: stats.hospitalA.drugB.success + stats.hospitalB.drugB.success,
        total: stats.hospitalA.drugB.total + stats.hospitalB.drugB.total
    };
    
    updateStatRow('combined-drugA', combinedA);
    updateStatRow('combined-drugB', combinedB);
}

function updateStatRow(id, data) {
    const el = document.getElementById(id);
    const percentage = data.total > 0 ? ((data.success / data.total) * 100).toFixed(1) : 0;
    el.textContent = `${data.success}/${data.total} (${percentage}%)`;
}



function updateDialogue() {
    const totalPatients = patients.length;
    
    if (totalPatients === 0) {
        dialogueText.textContent = "Welcome to the hospital treatment study! Assign patients to hospitals and choose treatments. Watch carefully: Drug A works better in BOTH hospitals, but which drug looks better overall? That's the paradox!";
    } else if (totalPatients < 10) {
        dialogueText.textContent = `${totalPatients} patient${totalPatients > 1 ? 's' : ''} treated so far. Keep going to see the pattern emerge!`;
    } else if (totalPatients < 30) {
        dialogueText.textContent = `${totalPatients} patients treated. Check the stats - Drug A is better in BOTH hospitals individually. But what about the combined stats?`;
    } else {
        dialogueText.textContent = `${totalPatients} patients treated! Press 'S' to see the full paradox revealed. Drug A is better in both hospitals, but the combined stats might surprise you!`;
    }
}

assignBtn.addEventListener('click', () => {
    playSound(clickSfx);
    const patient = generatePatient();
    showPatientInQueue(patient);
    setTimeout(() => openAssignmentModal(patient), 500);
});

autoBtn.addEventListener('click', () => {
    playSound(clickSfx);
    startAutoRun();
});

function startAutoRun() {
    isAutoRunning = true;
    autoBtn.classList.add('hidden');
    stopBtn.classList.add('active');
    assignBtn.disabled = true;
    
    dialogueText.textContent = "AUTO MODE! Patients are being assigned automatically based on severity. Watch the paradox unfold!";
    
    const intervalTime = Math.max(50, 400 / simulationSpeed);
    
    autoRunInterval = setInterval(() => {
        if (patients.length >= 100) {
            stopAutoRun();
            dialogueText.textContent = "100 patients reached! Press 'S' to see the full statistical breakdown of Simpson's Paradox!";
            setTimeout(() => showStatsModal(), 500);
            return;
        }
        const patient = generatePatient();
        patient.hospital = patient.severity === 'mild' ? 'A' : 'B';
        
        if (patient.hospital === 'A') {
            patient.drug = Math.random() < 0.6 ? 'B' : 'A';
        } else {
            patient.drug = Math.random() < 0.6 ? 'A' : 'B';
        }
        
        patient.outcome = calculateSuccess(patient.severity, patient.drug, patient.hospital);
        const hospital = patient.hospital === 'A' ? 'hospitalA' : 'hospitalB';
        const drug = patient.drug === 'A' ? 'drugA' : 'drugB';
        
        stats[hospital][drug].total++;
        if (patient.outcome) {
            stats[hospital][drug].success++;
        }
        
        addPatientToHospital(patient);
        updateStatsDisplay();
        
    }, intervalTime);
}

function stopAutoRun() {
    isAutoRunning = false;
    if (autoRunInterval) {
        clearInterval(autoRunInterval);
        autoRunInterval = null;
    }
    autoBtn.classList.remove('hidden');
    stopBtn.classList.remove('active');
    assignBtn.disabled = false;
    updateDialogue();
}

stopBtn.addEventListener('click', () => {
    playSound(clickSfx);
    stopAutoRun();
});

statsBtn.addEventListener('click', () => {
    playSound(clickSfx);
    showStatsModal();
});

function showStatsModal() {
    updateStatsModalContent();
    statsModal.classList.add('visible');
}

function updateStatsModalContent() {

    const hospA_drugA_pct = stats.hospitalA.drugA.total > 0 
        ? (stats.hospitalA.drugA.success / stats.hospitalA.drugA.total * 100) 
        : 0;
    const hospA_drugB_pct = stats.hospitalA.drugB.total > 0 
        ? (stats.hospitalA.drugB.success / stats.hospitalA.drugB.total * 100) 
        : 0;
    const hospB_drugA_pct = stats.hospitalB.drugA.total > 0 
        ? (stats.hospitalB.drugA.success / stats.hospitalB.drugA.total * 100) 
        : 0;
    const hospB_drugB_pct = stats.hospitalB.drugB.total > 0 
        ? (stats.hospitalB.drugB.success / stats.hospitalB.drugB.total * 100) 
        : 0;
    
    const combinedA = {
        success: stats.hospitalA.drugA.success + stats.hospitalB.drugA.success,
        total: stats.hospitalA.drugA.total + stats.hospitalB.drugA.total
    };
    const combinedB = {
        success: stats.hospitalA.drugB.success + stats.hospitalB.drugB.success,
        total: stats.hospitalA.drugB.total + stats.hospitalB.drugB.total
    };
    
    const combined_drugA_pct = combinedA.total > 0 ? (combinedA.success / combinedA.total * 100) : 0;
    const combined_drugB_pct = combinedB.total > 0 ? (combinedB.success / combinedB.total * 100) : 0;
    document.getElementById('chartA-drugA').style.width = hospA_drugA_pct + '%';
    document.getElementById('chartA-drugA-val').textContent = hospA_drugA_pct.toFixed(1) + '%';
    document.getElementById('chartA-drugB').style.width = hospA_drugB_pct + '%';
    document.getElementById('chartA-drugB-val').textContent = hospA_drugB_pct.toFixed(1) + '%';
    document.getElementById('chartB-drugA').style.width = hospB_drugA_pct + '%';
    document.getElementById('chartB-drugA-val').textContent = hospB_drugA_pct.toFixed(1) + '%';
    document.getElementById('chartB-drugB').style.width = hospB_drugB_pct + '%';
    document.getElementById('chartB-drugB-val').textContent = hospB_drugB_pct.toFixed(1) + '%';
    document.getElementById('chartCombined-drugA').style.width = combined_drugA_pct + '%';
    document.getElementById('chartCombined-drugA-val').textContent = combined_drugA_pct.toFixed(1) + '%';
    document.getElementById('chartCombined-drugB').style.width = combined_drugB_pct + '%';
    document.getElementById('chartCombined-drugB-val').textContent = combined_drugB_pct.toFixed(1) + '%';
    

    const modalResult = document.getElementById('modalResult');
    
    if (patients.length === 0) {
        modalResult.textContent = "No patients treated yet! Start assigning patients to see Simpson's Paradox in action.";
    } else {
        let resultText = `Treated ${patients.length} patients. `;
        
        const drugABetterInA = hospA_drugA_pct > hospA_drugB_pct;
        const drugABetterInB = hospB_drugA_pct > hospB_drugB_pct;
        const drugBBetterOverall = combined_drugB_pct > combined_drugA_pct;
        
        if (drugABetterInA && drugABetterInB && drugBBetterOverall && patients.length >= 20) {
            resultText += `THE PARADOX! Drug A is better in BOTH hospitals (${hospA_drugA_pct.toFixed(1)}% vs ${hospA_drugB_pct.toFixed(1)}% in Hospital A, ${hospB_drugA_pct.toFixed(1)}% vs ${hospB_drugB_pct.toFixed(1)}% in Hospital B), but Drug B looks better overall (${combined_drugB_pct.toFixed(1)}% vs ${combined_drugA_pct.toFixed(1)}%)! This is Simpson's Paradox!`;
        } else if (drugABetterInA && drugABetterInB) {
            resultText += `Drug A is better in both hospitals individually. Keep going to see if the combined stats show the paradox!`;
        } else {
            resultText += `Keep assigning more patients to see the pattern emerge clearly.`;
        }
        
        modalResult.textContent = resultText;
    }
}


document.getElementById('modalContinue').addEventListener('click', () => {
    playSound(clickSfx);
    statsModal.classList.remove('visible');
});

document.getElementById('modalReset').addEventListener('click', () => {
    playSound(clickSfx);
    statsModal.classList.remove('visible');
    resetModal.classList.add('visible');
});

resetBtn.addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.add('visible');
});

document.getElementById('infoBtn').addEventListener('click', () => {
    playSound(clickSfx);
    infoModal.classList.add('visible');
});

document.getElementById('infoClose').addEventListener('click', () => {
    playSound(clickSfx);
    infoModal.classList.remove('visible');
});

document.getElementById('resetConfirm').addEventListener('click', () => {
    playSound(clickSfx);
    resetGame();
    resetModal.classList.remove('visible');
});

document.getElementById('resetCancel').addEventListener('click', () => {
    playSound(clickSfx);
    resetModal.classList.remove('visible');
});

function resetGame() {
    stopAutoRun();
    
    patients = [];
    patientIdCounter = 0;
    
    stats = {
        hospitalA: {
            drugA: { success: 0, total: 0 },
            drugB: { success: 0, total: 0 }
        },
        hospitalB: {
            drugA: { success: 0, total: 0 },
            drugB: { success: 0, total: 0 }
        }
    };
    
    patientsA.innerHTML = '';
    patientsB.innerHTML = '';
    patientQueue.innerHTML = '';
    
    updateStatsDisplay();
    updateDialogue();
    statsModal.classList.remove('visible');
    assignmentModal.classList.remove('visible');
}

//keybd shortcut
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && !autoRunInterval && !assignmentModal.classList.contains('visible')) {
        e.preventDefault();
        assignBtn.click();
    }
    if (e.key === 's' || e.key === 'S') {
        showStatsModal();
    }
    if (e.key === 'r' || e.key === 'R') {
        resetModal.classList.add('visible');
    }
    if (e.key === 'Escape') {
        if (assignmentModal.classList.contains('visible')) {
            playSound(clickSfx);
            closeAssignmentModal();
        }
        statsModal.classList.remove('visible');
        resetModal.classList.remove('visible');
        infoModal.classList.remove('visible');
    }
});


// MUST ASSIGN HOSPITAL AND CURE no stacking of people
// assignmentModal.addEventListener('click', (e) => {
//     if (e.target === assignmentModal) {
//         playSound(clickSfx);
//         closeAssignmentModal();
//     }
// });

[statsModal, resetModal, infoModal].forEach(modal => {
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
    updateStatsDisplay();
    updateDialogue();
}); 



