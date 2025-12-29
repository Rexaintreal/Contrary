const musicSlider = document.getElementById('musicVolume');
const musicValue = document.getElementById('musicValue');
const musicFill = document.getElementById('musicFill');
const sfxSlider = document.getElementById('sfxVolume');
const sfxValue = document.getElementById('sfxValue');
const sfxFill = document.getElementById('sfxFill');
const cursorToggle = document.getElementById('systemCursor');
const resetBtn = document.getElementById('resetBtn');
const clickSfx = document.getElementById('clickSfx');
const bgMusic = document.getElementById('bgMusic');
const DEFAULT_VAL = 50;

//init
function init() {
    loadSettings();
    startMusic();
    lucide.createIcons();
}

//load
function loadSettings() {
    const savedMusic = localStorage.getItem('contraryMusicVolume');
    const musicVol = savedMusic !== null ? parseInt(savedMusic) : DEFAULT_VAL;
    updateSliderVisuals(musicSlider, musicValue, musicFill, musicVol);

    const savedSFX = localStorage.getItem('contrarySFXVolume');
    const sfxVol = savedSFX !== null ? parseInt(savedSFX) : DEFAULT_VAL;
    updateSliderVisuals(sfxSlider, sfxValue, sfxFill, sfxVol);

    const useSystemCursor = localStorage.getItem('contrarySystemCursor') === 'true';
    cursorToggle.checked = useSystemCursor;
    applyCursor(useSystemCursor);
}


function startMusic() {
    if (!bgMusic) return;
    
    //init volume
    const savedMusic = localStorage.getItem('contraryMusicVolume');
    const musicVol = savedMusic !== null ? parseInt(savedMusic) : DEFAULT_VAL;
    bgMusic.volume = (musicVol / 100) * 0.25;
    
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay prevented until interaction.");
            document.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play();
                }
            }, { once: true });
        });
    }
}

//volume
function updateSliderVisuals(slider, textDisplay, fillBar, value) {
    slider.value = value;
    textDisplay.textContent = value + '%';
    const percentage = value;
    const sliderWidth = slider.offsetWidth;
    const fillWidth = (sliderWidth - 6) * (percentage / 100);
    fillBar.style.width = fillWidth + 'px';
}

function playPreviewSound() {
    const sfxVol = parseInt(sfxSlider.value) / 100;
    clickSfx.currentTime = 0;
    clickSfx.volume = 0.4 * sfxVol; 
    clickSfx.play().catch(e => {});
}

function setupSliderListeners(slider, textDisplay, fillBar, storageKey, isSfx) {
    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        updateSliderVisuals(slider, textDisplay, fillBar, val);
        
        if (!isSfx && bgMusic) {
            bgMusic.volume = (val / 100) * 0.25;
            if (bgMusic.paused && val > 0) bgMusic.play().catch(()=>{});
        }
    });
    slider.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        localStorage.setItem(storageKey, val);
        if (isSfx) playPreviewSound();
    });
}

setupSliderListeners(musicSlider, musicValue, musicFill, 'contraryMusicVolume', false);
setupSliderListeners(sfxSlider, sfxValue, sfxFill, 'contrarySFXVolume', true);



document.querySelectorAll('.volume-presets').forEach(group => {
    const targetId = group.dataset.target;
    const targetSlider = document.getElementById(targetId);
    const isMusic = targetId === 'musicVolume';
    const textDisplay = isMusic ? musicValue : sfxValue;
    const fillBar = isMusic ? musicFill : sfxFill;
    const storageKey = isMusic ? 'contraryMusicVolume' : 'contrarySFXVolume';

    group.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vol = parseInt(btn.dataset.volume);
            
            updateSliderVisuals(targetSlider, textDisplay, fillBar, vol);
            localStorage.setItem(storageKey, vol);

            if (isMusic && bgMusic) {
                bgMusic.volume = (vol / 100) * 0.25;
                if (bgMusic.paused && vol > 0) bgMusic.play().catch(()=>{});
            }
            if (!isMusic) playPreviewSound();
            
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 200);
        });
    });
});

//cursor
function applyCursor(useSystem) {
    if (useSystem) {
        document.body.classList.add('system-cursor');
    } else {
        document.body.classList.remove('system-cursor');
    }
}

cursorToggle.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    localStorage.setItem('contrarySystemCursor', isChecked);
    applyCursor(isChecked);
    playPreviewSound();
});

//reset
resetBtn.addEventListener('click', () => {
    updateSliderVisuals(musicSlider, musicValue, musicFill, DEFAULT_VAL);
    updateSliderVisuals(sfxSlider, sfxValue, sfxFill, DEFAULT_VAL);
    cursorToggle.checked = false;


    localStorage.setItem('contraryMusicVolume', DEFAULT_VAL);
    localStorage.setItem('contrarySFXVolume', DEFAULT_VAL);
    localStorage.setItem('contrarySystemCursor', 'false');
    

    applyCursor(false);
    if (bgMusic) bgMusic.volume = (DEFAULT_VAL / 100) * 0.25;
    
    playPreviewSound();
    resetBtn.style.transform = 'rotate(-1deg) scale(0.95)';
    setTimeout(() => resetBtn.style.transform = 'rotate(-1deg)', 200);
});

window.addEventListener('resize', () => {
    updateSliderVisuals(musicSlider, musicValue, musicFill, parseInt(musicSlider.value));
    updateSliderVisuals(sfxSlider, sfxValue, sfxFill, parseInt(sfxSlider.value));
});

window.addEventListener('DOMContentLoaded', init);



