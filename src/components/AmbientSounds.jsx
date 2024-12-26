import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import PropTypes from 'prop-types';

const AmbientSounds = ({ cameraPosition, boatPosition }) => {
  const soundsRef = useRef({});

  useEffect(() => {
    // Create ambient sound instances
    soundsRef.current = {
      waves: new Howl({
        src: ['/Sounds/sea.mp3'],
        loop: true,
        volume: 0.3,
        html5: true
      }),
      seagulls: new Howl({
        src: ['/Sounds/seagull.mp3'],
        loop: true,
        volume: 0.2,
        html5: true
      }),
      wind: new Howl({
        src: ['/Sounds/wind.mp3'],
        loop: true,
        volume: 0.15,
        html5: true
      })
    };

    // Start playing ambient sounds
    Object.values(soundsRef.current).forEach(sound => {
      sound.play();
    });

    // Cleanup function
    return () => {
      Object.values(soundsRef.current).forEach(sound => {
        sound.stop();
        sound.unload();
      });
    };
  }, []);

  // Update volumes when camera or boat position changes
  useEffect(() => {
    if (!soundsRef.current || !cameraPosition || !boatPosition) return;

    // Calculate distances and adjust volumes accordingly
    const distance = Math.sqrt(
      Math.pow(cameraPosition.x - boatPosition.x, 2) +
      Math.pow(cameraPosition.z - boatPosition.z, 2)
    );

    // Adjust volumes based on distance
    soundsRef.current.waves.volume(Math.min(0.3, 1 / (distance * 0.01)));
    soundsRef.current.seagulls.volume(Math.min(0.2, 1 / (distance * 0.02)));
    soundsRef.current.wind.volume(Math.min(0.15, 1 / (distance * 0.015)));
  }, [cameraPosition, boatPosition]);

  return null; // This is a non-visual component
};

AmbientSounds.propTypes = {
  cameraPosition: PropTypes.shape({
    x: PropTypes.number,
    z: PropTypes.number
  }),
  boatPosition: PropTypes.shape({
    x: PropTypes.number,
    z: PropTypes.number
  })
};

export default AmbientSounds; 