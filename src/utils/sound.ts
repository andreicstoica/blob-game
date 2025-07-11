const audioCache: { [key: string]: HTMLAudioElement } = {};
let backgroundMusic: HTMLAudioElement | null = null;

export const SOUNDS = {
    blobClick: "/assets/sounds/click-2.wav",
    uiClick: "/assets/sounds/click-1.wav",
    evolve: "/assets/sounds/evolve.wav",
    gameStart: "/assets/sounds/game-start.mp3",
    cashRegister: "/assets/sounds/cash-register.mp3",
};

export const BACKGROUND_MUSIC = {
    theme: "/assets/sounds/theme2.mp3", // Changed to theme2
};

export const initSounds = () => {
    // Initialize sound effects
    for (const key in SOUNDS) {
        if (Object.prototype.hasOwnProperty.call(SOUNDS, key)) {
            const soundFile = SOUNDS[key as keyof typeof SOUNDS];
            const audio = new Audio(soundFile);
            audio.load();
            audioCache[key] = audio;
        }
    }

    // Initialize background music
    backgroundMusic = new Audio(BACKGROUND_MUSIC.theme);
    backgroundMusic.loop = true; // Enable looping
    backgroundMusic.volume = 0.3; // Set a reasonable volume (30%)
    backgroundMusic.load();
};

export const playSound = (soundKey: keyof typeof SOUNDS, volume = 0.5) => {
    const audio = audioCache[soundKey];
    if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(error => console.error(`Error playing sound: ${soundKey}`, error));
    } else {
        console.error(`Sound not initialized: ${soundKey}`);
    }
};

// Background music controls
export const playBackgroundMusic = (volume = 0.3) => {
    if (backgroundMusic) {
        backgroundMusic.volume = volume;
        backgroundMusic.play().catch(error => console.error('Error playing background music:', error));
    } else {
        console.error('Background music not initialized');
    }
};

export const pauseBackgroundMusic = () => {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
};

export const stopBackgroundMusic = () => {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
};

export const setBackgroundMusicVolume = (volume: number) => {
    if (backgroundMusic) {
        backgroundMusic.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    }
};

export const isBackgroundMusicPlaying = (): boolean => {
    return backgroundMusic ? !backgroundMusic.paused : false;
}; 