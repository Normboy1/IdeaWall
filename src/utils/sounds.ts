// Sound effects for the Idea Wall app

// Audio files will be loaded when needed
let throwSound: HTMLAudioElement | null = null;
let trashSound: HTMLAudioElement | null = null;
let successSound: HTMLAudioElement | null = null;

// Preload sounds
const preloadSounds = () => {
  // Using free sound effects from a CDN
  throwSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-throwing-a-paper-2211.mp3');
  trashSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-trash-can-falling-905.mp3');
  successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
  
  // Set volume
  [throwSound, trashSound, successSound].forEach(sound => {
    if (sound) sound.volume = 0.5;
  });
};

// Play sound effects
export const playThrowSound = () => {
  if (!throwSound) preloadSounds();
  throwSound?.play().catch(e => console.log('Audio play failed:', e));
};

export const playTrashSound = () => {
  if (!trashSound) preloadSounds();
  trashSound?.play().catch(e => console.log('Audio play failed:', e));
};

export const playSuccessSound = () => {
  if (!successSound) preloadSounds();
  successSound?.play().catch(e => console.log('Audio play failed:', e));
};
