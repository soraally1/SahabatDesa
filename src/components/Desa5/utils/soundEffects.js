// Sound effects
export const soundEffects = {
  hover: {
    play: () => console.log('Playing hover sound'),
    onloaderror: () => console.log('Sound file not found: hover.mp3')
  },
  click: {
    play: () => console.log('Playing click sound'),
    onloaderror: () => console.log('Sound file not found: click.mp3')
  }
};

export const playSoundEffect = (effect) => {
  try {
    soundEffects[effect]?.play();
  } catch {
    console.log(`Error playing sound effect: ${effect}`);
  }
}; 