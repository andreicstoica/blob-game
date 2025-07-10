const audioCache: { [key: string]: HTMLAudioElement } = {};

export const SOUNDS = {
    blobClick: "/assets/sounds/click-2.wav",
    uiClick: "/assets/sounds/click-1.wav",
    evolve: "/assets/sounds/evolve.wav",
    gameStart: "/assets/sounds/game-start.mp3",
};

export const initSounds = () => {
    console.log("Initializing sounds...");
    for (const key in SOUNDS) {
        if (Object.prototype.hasOwnProperty.call(SOUNDS, key)) {
            const soundFile = SOUNDS[key as keyof typeof SOUNDS];
            const audio = new Audio(soundFile);
            audio.load();
            audioCache[key] = audio;
        }
    }
};

export const playSound = (soundKey: keyof typeof SOUNDS, volume = 1.0) => {
    const audio = audioCache[soundKey];
    if (audio) {
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(error => console.error(`Error playing sound: ${soundKey}`, error));
    } else {
        console.error(`Sound not initialized: ${soundKey}`);
    }
}; 