const volumeSlider = document.getElementById('masterVolume');
const volumeValue = document.getElementById('volumeValue');
const sliderFill = document.getElementById('sliderFill');
const presetButtons = document.querySelectorAll('.preset-btn');
const resetBtn = document.getElementById('resetBtn');
const clickSfx = document.getElementById('clickSfx');
const DEFAULT_VOLUME = 50;

function loadVolume() {
    const savedVolume = localStorage.getItem('contraryMasterVolume');
    if (savedVolume !== null) {
        const volume = parseInt(savedVolume);
        setVolume(volume);
    } else {
        setVolume(DEFAULT_VOLUME);
    }
}

//save to localstorage
function saveVolume(volume) {
    localStorage.setItem('contraryMasterVolume', volume.toString());
}

function setVolume(volume) {
    volumeSlider.value = volume;
    volumeValue.textContent = volume + '%';
    updateSliderFill(volume);
    saveVolume(volume);
}

function updateSliderFill(volume) {
    const percentage = volume;
    const sliderWidth = volumeSlider.offsetWidth;
    const fillWidth = (sliderWidth - 6) * (percentage / 100);
    sliderFill.style.width = fillWidth + 'px';
}

function playClickSound() {
    clickSfx.currentTime = 0;
    clickSfx.volume = 0.4;
    clickSfx.play().catch(err => console.log("Sound play delayed"));
}

volumeSlider.addEventListener('input', (e) => {
    const volume = parseInt(e.target.value);
    volumeValue.textContent = volume + '%';
    updateSliderFill(volume);
});



volumeSlider.addEventListener('change', (e) => {
    const volume = parseInt(e.target.value);
    saveVolume(volume);
    playClickSound();
});


//presets
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const volume = parseInt(btn.dataset.volume);
        setVolume(volume);
        playClickSound();
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    });
});

resetBtn.addEventListener('click', () => {
    playClickSound();
    setVolume(DEFAULT_VOLUME);
    
    resetBtn.style.transform = 'rotate(-1deg) scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = 'rotate(-1deg)';
    }, 200);
});


document.addEventListener('mousedown', (e) => {
    const isButton = e.target.closest('button, a');
    if (isButton && e.button === 0 && !e.target.closest('#masterVolume')) {
        playClickSound();
    }
});

window.addEventListener('resize', () => {
    updateSliderFill(parseInt(volumeSlider.value));
});


//init
window.addEventListener('DOMContentLoaded', () => {
    loadVolume();
    lucide.createIcons();
});

