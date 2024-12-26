import { useState, useEffect } from 'react';

export function useKeyboardControls() {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    turnLeft: false,
    turnRight: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement(m => ({ ...m, moveBackward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement(m => ({ ...m, moveForward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement(m => ({ ...m, turnLeft: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement(m => ({ ...m, turnRight: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement(m => ({ ...m, moveBackward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement(m => ({ ...m, moveForward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement(m => ({ ...m, turnLeft: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement(m => ({ ...m, turnRight: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
} 