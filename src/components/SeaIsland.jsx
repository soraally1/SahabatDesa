import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  useGLTF, 
  Environment, 
  Stars,
  Float,
  PerspectiveCamera,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import Sea from './sea';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import skyTexture from '/textures/skyblue.jpg';
import AmbientSounds from './AmbientSounds';
import LoadingScreen from './LoadingScreen';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/* eslint-disable react/no-unknown-property */

// Constants for model paths
const MODEL_PATHS = {
  BOAT: './models/Boat.glb',
  MARKETPLACE: './models/Marketplace.glb',
  DESA: './models/Desa1.glb'
};

// Create a model context to share loaded models
const ModelContext = React.createContext({
  models: {},
  isLoading: true,
  error: null
});

// Add display name and prop types for Boat
const MAX_BOAT_SPEED = 25;  // Slightly reduced for better control

// Preload boat model
useGLTF.preload(MODEL_PATHS.BOAT);

const Boat = React.forwardRef((props, ref) => {
  const { scene } = useGLTF(MODEL_PATHS.BOAT);
  const velocityRef = useRef(new THREE.Vector3());
  const angularVelocityRef = useRef(0);
  const boatRef = useRef();
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
  });

  // Add wake effect
  const wakeRef = useRef();
  const wakeParticles = useRef([]);
  const MAX_WAKE_PARTICLES = 100;

  // Add bubble system constants
  const MAX_BUBBLES = 50;
  const BUBBLE_LIFETIME = 2.0;
  const bubbleParticles = useRef([]);

  // Add waterSplashes state
  const [waterSplashes, setWaterSplashes] = useState([]);

  // Set up initial scene and keyboard controls
  const handleKeyDown = useCallback((e) => {
    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case 'w': setKeys(prev => ({ ...prev, backward: true })); break;
      case 's': setKeys(prev => ({ ...prev, forward: true })); break;
      case 'a': setKeys(prev => ({ ...prev, left: true })); break;
      case 'd': setKeys(prev => ({ ...prev, right: true })); break;
      case 'shift': setKeys(prev => ({ ...prev, boost: true })); break;
      default: break;
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    switch (e.key.toLowerCase()) {
      case 'w': setKeys(prev => ({ ...prev, backward: false })); break;
      case 's': setKeys(prev => ({ ...prev, forward: false })); break;
      case 'a': setKeys(prev => ({ ...prev, left: false })); break;
      case 'd': setKeys(prev => ({ ...prev, right: false })); break;
      case 'shift': setKeys(prev => ({ ...prev, boost: false })); break;
      default: break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Set up scene and ref
  useEffect(() => {
    if (scene && boatRef.current) {
      const clonedScene = scene.clone();
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
            child.material.shadowSide = THREE.FrontSide;
            child.material.aoMapIntensity = 1;
            child.material.roughness = 0.8;
          }
        }
      });
      
      // Clear any existing children
      while (boatRef.current.children.length) {
        boatRef.current.remove(boatRef.current.children[0]);
      }
      
      boatRef.current.add(clonedScene);
      clonedScene.scale.set(20, 20, 20);
      
      // Sync refs
      if (ref) {
        ref.current = boatRef.current;
      }
    }
  }, [scene, ref]);

  // Sync refs
  useEffect(() => {
    if (ref && boatRef.current) {
      ref.current = boatRef.current;
    }
  }, [ref]);

  // Update physics constants for better movement
  const ACCELERATION = 0.35;         // Adjusted for smoother acceleration
  const MAX_SPEED = MAX_BOAT_SPEED;
  const BOOST_MULTIPLIER = 1.5;      // Balanced boost speed
  const WATER_RESISTANCE = 0.988;    // Refined water resistance
  const TURN_SPEED = 0.016;          // Smoother turning
  const TILT_FACTOR = 0.035;         // More natural tilt
  const WAVE_INTENSITY = 2.8;        // Slightly reduced for stability
  const SMOOTHING_FACTOR = 0.12;     // Enhanced smoothing
  const WAKE_SCALE = 4.0;
  const MIN_SPEED_FOR_EFFECTS = 0.05;
  const FORWARD_TILT = 0.15;         // New constant for forward tilt control
  const BACKWARD_TILT = 0.1;         // New constant for backward tilt control

  // Add new refs for enhanced smoothing
  const smoothedPositionRef = useRef(new THREE.Vector3());
  const smoothedRotationRef = useRef(new THREE.Euler());
  const previousTiltRef = useRef({ x: 0, z: 0 });
  
  useEffect(() => {
    // Initialize wake particles
    for (let i = 0; i < MAX_WAKE_PARTICLES; i++) {
      wakeParticles.current.push({
        position: new THREE.Vector3(),
        scale: 1,
        opacity: 1,
        age: 0
      });
    }

    // Initialize bubble particles
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubbleParticles.current.push({
        position: new THREE.Vector3(),
        scale: 0.1 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.3,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 2
        ),
        age: BUBBLE_LIFETIME
      });
    }
  }, []);

  useFrame(({ clock }) => {
    if (!boatRef.current) return;

    const deltaTime = clock.getDelta();
    const time = clock.getElapsedTime();
    const speedMultiplier = keys.boost ? BOOST_MULTIPLIER : 1;
    const currentSpeed = velocityRef.current.length();
    const speedFactor = currentSpeed / MAX_SPEED;

    // Enhanced movement logic with better tilt control
    if (keys.forward || keys.backward) {
      const direction = keys.forward ? -1 : 1;
      const speedFactor = currentSpeed / MAX_SPEED;
      const accelerationMultiplier = 1 - (speedFactor * 0.6); // Increased deceleration at high speeds
      const acceleration = ACCELERATION * direction * speedMultiplier * accelerationMultiplier;
      const maxSpeedForDirection = keys.forward ? MAX_SPEED : (MAX_SPEED * 0.4); // Reduced backward speed

      if (currentSpeed < maxSpeedForDirection * speedMultiplier) {
        const moveVector = new THREE.Vector3(
          Math.sin(boatRef.current.rotation.y) * acceleration,
          0,
          Math.cos(boatRef.current.rotation.y) * acceleration
        );
        velocityRef.current.add(moveVector);
      }
    }

    // Enhanced turning with speed-based handling
    if (keys.left || keys.right) {
      const turnDirection = keys.left ? 1 : -1;
      const speedFactor = Math.min(currentSpeed / MAX_SPEED, 1);
      // Better turn response curve
      const turnSpeedCurve = (speedFactor * 0.6 + 0.4);
      const turnAmount = TURN_SPEED * turnDirection * turnSpeedCurve;
      
      // Add slight sideways drift during sharp turns
      if (speedFactor > 0.3) {
        const driftForce = new THREE.Vector3(
          Math.cos(boatRef.current.rotation.y) * turnDirection * speedFactor * 0.015,
          0,
          -Math.sin(boatRef.current.rotation.y) * turnDirection * speedFactor * 0.015
        );
        velocityRef.current.add(driftForce);
      }

      angularVelocityRef.current += turnAmount;
      angularVelocityRef.current *= 0.9; // Smooth turn dampening
    } else {
      angularVelocityRef.current *= 0.85;
    }

    // Enhanced water physics
    const speedResistance = 1 - (currentSpeed / MAX_SPEED) * 0.1;
    velocityRef.current.multiplyScalar(WATER_RESISTANCE * speedResistance);

    // Smooth rotation handling
    boatRef.current.rotation.y += angularVelocityRef.current;
    
    // Enhanced position smoothing with prediction
    if (!smoothedPositionRef.current.lengthSq()) {
      smoothedPositionRef.current.copy(boatRef.current.position);
    }

    const predictedPosition = smoothedPositionRef.current.clone()
      .add(velocityRef.current)
      .add(velocityRef.current.clone().multiplyScalar(deltaTime));
    
    // Apply smoothed movement
    boatRef.current.position.lerp(predictedPosition, SMOOTHING_FACTOR);
    smoothedPositionRef.current.copy(boatRef.current.position);

    // Enhanced wave effect with speed influence
    const posX = boatRef.current.position.x;
    const posZ = boatRef.current.position.z;
    const speedInfluence = Math.max(0, 1 - (currentSpeed / MAX_SPEED) * 0.5);
    const waveX = Math.sin(time * 0.4 + posX * 0.08) * WAVE_INTENSITY * speedInfluence;
    const waveZ = Math.cos(time * 0.3 + posZ * 0.08) * WAVE_INTENSITY * speedInfluence;
    const waveY = Math.sin(time * 0.6) * 0.08 * speedInfluence;

    // Enhanced height transition with wave compression at speed
    const targetHeight = -0.5 + 
      (waveX * 0.4 + waveZ * 0.4 + waveY) * (1 - (currentSpeed / MAX_SPEED) * 0.3);
    
    boatRef.current.position.y = THREE.MathUtils.lerp(
      boatRef.current.position.y,
      targetHeight,
      0.08
    );

    // Enhanced dynamic tilting with better forward/backward control
    const speedTilt = currentSpeed / MAX_SPEED * 0.1; // Reduced from 0.15
    const forwardFactor = keys.forward ? FORWARD_TILT : (keys.backward ? -BACKWARD_TILT : 0);
    
    const targetTiltX = (velocityRef.current.z * TILT_FACTOR) + 
                       (Math.cos(time * 0.3 + posZ * 0.08) * 0.02) +
                       (speedTilt * forwardFactor);

    // Adjust Z-tilt for more stable turning
    const targetTiltZ = (-velocityRef.current.x * TILT_FACTOR) - 
                       (angularVelocityRef.current * 1.2) + 
                       (Math.sin(time * 0.4 + posX * 0.08) * 0.02);

    // Smoother tilt transitions
    previousTiltRef.current.x = THREE.MathUtils.lerp(
      previousTiltRef.current.x,
      targetTiltX,
      0.03  // Reduced from 0.04 for smoother transition
    );
    
    previousTiltRef.current.z = THREE.MathUtils.lerp(
      previousTiltRef.current.z,
      targetTiltZ,
      0.03  // Reduced from 0.04 for smoother transition
    );

    // Apply rotation with limits to prevent extreme tilting
    boatRef.current.rotation.x = THREE.MathUtils.clamp(
      previousTiltRef.current.x,
      -Math.PI / 8,  // Limit maximum forward tilt
      Math.PI / 12   // Limit maximum backward tilt
    );
    
    boatRef.current.rotation.z = THREE.MathUtils.clamp(
      previousTiltRef.current.z,
      -Math.PI / 6,  // Limit side tilt
      Math.PI / 6
    );

    // Enhanced wake effect
    if (currentSpeed > MIN_SPEED_FOR_EFFECTS) {
      const particle = wakeParticles.current[0];
      const wakeScale = (currentSpeed / MAX_SPEED) * WAKE_SCALE;
      
      particle.position.copy(boatRef.current.position);
      particle.position.y = 0;
      particle.scale = wakeScale + Math.sin(time * 2) * 0.2; // Animated wake
      particle.opacity = Math.min(currentSpeed / (MAX_SPEED * 0.3), 1);
      particle.age = 0;
      
      wakeParticles.current.push(wakeParticles.current.shift());
    }

    // Update existing wake particles with better fade
    wakeParticles.current.forEach(particle => {
      particle.age += deltaTime * 0.7;
      particle.opacity = Math.max(0, 1 - particle.age * 0.4) * 0.6;
      particle.scale += deltaTime * (1.5 + currentSpeed * 0.5);
    });

    // Update bubbles
    bubbleParticles.current.forEach(bubble => {
      if (currentSpeed > 5 && bubble.age >= BUBBLE_LIFETIME) {
        // Reset bubble at boat position with random offset
        bubble.position.copy(boatRef.current.position);
        bubble.position.add(bubble.offset);
        bubble.position.y -= 2; // Start slightly below water level
        bubble.age = 0;
        bubble.scale = 0.1 + Math.random() * 0.3;
      }

      if (bubble.age < BUBBLE_LIFETIME) {
        // Move bubble up and slightly random
        bubble.position.y += bubble.speed;
        bubble.position.x += (Math.random() - 0.5) * 0.1;
        bubble.position.z += (Math.random() - 0.5) * 0.1;
        bubble.age += deltaTime;
      }
    });

    // Store current speed for camera access
    boatRef.current.userData.speed = currentSpeed;

    // Add world boundary check
    const distanceFromCenter = new THREE.Vector2(
      boatRef.current.position.x,
      boatRef.current.position.z
    ).length();

    if (distanceFromCenter > WORLD_SIZE * 0.45) {
      // Add resistance when approaching the boundary
      const toCenter = new THREE.Vector3(
        -boatRef.current.position.x,
        0,
        -boatRef.current.position.z
      ).normalize();
      
      const boundaryForce = Math.pow((distanceFromCenter - WORLD_SIZE * 0.4) / (WORLD_SIZE * 0.05), 2);
      velocityRef.current.add(toCenter.multiplyScalar(boundaryForce * 0.5));
    }

    // Use smoothedRotationRef for rotation smoothing
    const targetRotation = new THREE.Euler(
      previousTiltRef.current.x,
      boatRef.current.rotation.y,
      previousTiltRef.current.z
    );
    
    smoothedRotationRef.current.x = THREE.MathUtils.lerp(
      smoothedRotationRef.current.x,
      targetRotation.x,
      SMOOTHING_FACTOR
    );
    
    smoothedRotationRef.current.y = THREE.MathUtils.lerp(
      smoothedRotationRef.current.y,
      targetRotation.y,
      SMOOTHING_FACTOR
    );
    
    smoothedRotationRef.current.z = THREE.MathUtils.lerp(
      smoothedRotationRef.current.z,
      targetRotation.z,
      SMOOTHING_FACTOR
    );
    
    boatRef.current.rotation.copy(smoothedRotationRef.current);

    // Add water splash effects based on speed and turning
    if (currentSpeed > MAX_SPEED * 0.3 || Math.abs(angularVelocityRef.current) > TURN_SPEED * 2) {
      const splashPositions = [
        new THREE.Vector3(-2, 0, -1),
        new THREE.Vector3(2, 0, -1)
      ];
      
      splashPositions.forEach(offset => {
        const worldPosition = offset.clone()
          .applyQuaternion(boatRef.current.quaternion)
          .add(boatRef.current.position);
          
        const splashScale = (currentSpeed / MAX_SPEED) * 2;
        setWaterSplashes(prev => [...prev, {
          position: worldPosition,
          scale: splashScale,
          id: Math.random()
        }]);
      });
    }

    // Enhanced boat rocking animation
    const rockingAngle = Math.sin(time * 2) * 0.02 * (1 - speedFactor * 0.5);
    const pitchAngle = Math.sin(time * 1.5) * 0.015 * (1 - speedFactor * 0.5);
    
    boatRef.current.rotation.z += (rockingAngle - boatRef.current.rotation.z) * 0.1;
    boatRef.current.rotation.x += (pitchAngle - boatRef.current.rotation.x) * 0.1;
  });

  return (
    <group>
      <group ref={boatRef} position={props.position || [0, -0.5, 0]}>
        <mesh />
      </group>
      
      <group ref={wakeRef}>
        {wakeParticles.current.map((particle, i) => (
          <mesh
            key={i}
            position={particle.position}
            scale={particle.scale}
            visible={particle.opacity > 0}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={particle.opacity * 0.3}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      
      <group>
        {bubbleParticles.current.map((bubble, i) => (
          <mesh
            key={`bubble-${i}`}
            position={bubble.position}
            scale={bubble.scale}
            visible={bubble.age < BUBBLE_LIFETIME}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <BubbleMaterial />
          </mesh>
        ))}
      </group>

      {waterSplashes.map(splash => (
        <WaterSplash 
          key={splash.id}
          position={splash.position}
          scale={splash.scale}
        />
      ))}
    </group>
  );
});

Boat.displayName = 'Boat';
Boat.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  speed: PropTypes.number
};

// Add custom error boundary
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="bg-red-500/80 text-white p-4 rounded-lg">
            <h3>Error Loading Model</h3>
            <p>{this.state.error?.message || 'Failed to load 3D model'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-white text-red-500 px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </Html>
      );
    }

    return this.props.children;
  }
}

ModelErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Add custom app error boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="bg-red-500/80 text-white p-6 rounded-lg text-center">
            <h2 className="text-xl mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-red-500 px-6 py-2 rounded hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// Update model loader to use proper loading method
const useModelLoader = () => {
  const [modelLoadError, setModelLoadError] = useState(null);
  const [models, setModels] = useState({ marketplace: null, desa: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const loader = new GLTFLoader();
        const [marketplaceResult, desaResult] = await Promise.all([
          loader.loadAsync(MODEL_PATHS.MARKETPLACE),
          loader.loadAsync(MODEL_PATHS.DESA)
        ]);

        if (!marketplaceResult.scene || !desaResult.scene) {
          throw new Error('Failed to load one or more models');
        }

        [marketplaceResult.scene, desaResult.scene].forEach(scene => {
          scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.needsUpdate = true;
              }
            }
          });
        });

        setModels({
          marketplace: { scene: marketplaceResult.scene },
          desa: { scene: desaResult.scene }
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        setModelLoadError(error);
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  return { models, isLoading, error: modelLoadError };
};

// Update ModelProvider component
const ModelProvider = ({ children }) => {
  const modelData = useModelLoader();

  if (modelData.error) {
    return (
      <Html center>
        <div className="bg-red-500/80 text-white p-4 rounded-lg">
          <h3>Error Loading Models</h3>
          <p>{modelData.error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-white text-red-500 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </Html>
    );
  }

  return (
    <ModelContext.Provider value={modelData}>
      <ModelErrorBoundary>
        {children}
      </ModelErrorBoundary>
    </ModelContext.Provider>
  );
};

ModelProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Update Buildings component to remove unused parameters
const Buildings = React.memo(() => {
  const { models, isLoading } = React.useContext(ModelContext);
  const [visibleBuildings, setVisibleBuildings] = useState([]);

  useEffect(() => {
    if (isLoading || !models || Object.keys(models).length === 0) {
      console.log('Models still loading or not available');
      return;
    }

    console.log('Available models:', models);

    const positions = [
      {
        position: [100, -2, 100],
        rotation: [0, -Math.PI / 4, 0],
        scale: [50, 50, 50],
        type: 'marketplace',
        name: 'Main Marketplace'
      },
      {
        position: [-250, -2, 250],
        rotation: [0, Math.PI / 4, 0],
        scale: [35, 35, 35],
        type: 'desa',
        name: 'Village Center'
      }
    ];

    setVisibleBuildings(positions);
  }, [models, isLoading]);

  return (
    <group>{
      visibleBuildings.map((building, index) => {
        const model = models[building.type]?.scene;
        if (!model) return null;

        return (
          <primitive
            key={index}
            object={model.clone()}
            position={building.position}
            rotation={building.rotation}
            scale={building.scale}
            castShadow
            receiveShadow
          />
        );
      })
    }</group>
  );
});

Buildings.displayName = 'Buildings';

// Add FollowCamera component if it's missing
const FollowCamera = ({ target }) => {
  const cameraRef = useRef();
  const smoothedPosition = useRef(new THREE.Vector3());
  const smoothedLookAt = useRef(new THREE.Vector3());
  
  useFrame(({ camera }) => {
    if (!target.current) return;

    const targetPosition = target.current.position;
    const targetRotation = target.current.rotation;
    const boatSpeed = target.current.userData.speed || 0;
    
    // Enhanced camera positioning
    const followSettings = {
      minDistance: 200,
      maxDistance: 250,
      minHeight: 80,
      maxHeight: 150,
      smoothingFactor: 0.08
    };

    // Dynamic camera adjustments based on speed
    const speedFactor = boatSpeed / MAX_BOAT_SPEED;
    const dynamicDistance = THREE.MathUtils.lerp(
      followSettings.minDistance,
      followSettings.maxDistance,
      speedFactor
    );
    const dynamicHeight = THREE.MathUtils.lerp(
      followSettings.minHeight,
      followSettings.maxHeight,
      speedFactor
    );

    // Enhanced position interpolation
    const idealPosition = new THREE.Vector3(
      targetPosition.x - Math.sin(targetRotation.y) * dynamicDistance,
      targetPosition.y + dynamicHeight,
      targetPosition.z - Math.cos(targetRotation.y) * dynamicDistance
    );

    // Smoother camera movement
    smoothedPosition.current.lerp(idealPosition, followSettings.smoothingFactor);
    camera.position.copy(smoothedPosition.current);

    // Enhanced look-at with prediction
    const lookAheadDistance = speedFactor * 100;
    const lookAtTarget = new THREE.Vector3(
      targetPosition.x + Math.sin(targetRotation.y) * lookAheadDistance,
      targetPosition.y,
      targetPosition.z + Math.cos(targetRotation.y) * lookAheadDistance
    );
    
    smoothedLookAt.current.lerp(lookAtTarget, followSettings.smoothingFactor);
    camera.lookAt(smoothedLookAt.current);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={60} near={1} far={5000} />;
}

FollowCamera.propTypes = {
  target: PropTypes.shape({
    current: PropTypes.object
  }).isRequired
};

// Enhanced CartoonCloud component with better visuals
const CartoonCloud = ({ position, scale = 1, speed = 0.3 }) => {
  const cloudRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Create multiple cloud shapes for a more natural look
  const createCloudShape = () => {
    const shape = new THREE.Shape();
    
    // Main body
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-5, 0, -5, 4, 0, 4);
    shape.bezierCurveTo(2, 4, 3, 3, 4, 3);
    shape.bezierCurveTo(8, 3, 8, 0, 4, 0);
    
    // Additional bumps for more natural look
    shape.bezierCurveTo(3, 0, 2, 0, 0, 0);
    
    return shape;
  };

  const cloudMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: hovered ? 0.1 : 0.05,
    shininess: 90,
    specular: '#ffffff',
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  }), [hovered]);

  useEffect(() => {
    if (cloudRef.current) {
      // Animate cloud on hover
      gsap.to(cloudRef.current.scale, {
        x: hovered ? scale * 1.1 : scale,
        y: hovered ? scale * 1.1 : scale,
        z: hovered ? scale * 1.1 : scale,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [hovered, scale]);

  return (
    <Float
      speed={speed}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group
        ref={cloudRef}
        position={position}
        scale={scale}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Main cloud body */}
        <mesh geometry={new THREE.ExtrudeGeometry(createCloudShape(), {
          steps: 1,
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 6
        })} material={cloudMaterial} />
        
        {/* Additional smaller clouds for detail */}
        <group position={[3, 1, 0]} scale={0.7}>
          <mesh geometry={new THREE.ExtrudeGeometry(createCloudShape(), {
            steps: 1,
            depth: 1.5,
            bevelEnabled: true,
            bevelThickness: 0.8,
            bevelSize: 0.8,
            bevelSegments: 4
          })} material={cloudMaterial} />
        </group>
        
        <group position={[-3, 0.5, 0]} scale={0.6}>
          <mesh geometry={new THREE.ExtrudeGeometry(createCloudShape(), {
            steps: 1,
            depth: 1.5,
            bevelEnabled: true,
            bevelThickness: 0.8,
            bevelSize: 0.8,
            bevelSegments: 4
          })} material={cloudMaterial} />
        </group>
      </group>
    </Float>
  );
};

CartoonCloud.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
  speed: PropTypes.number
};


// Enhanced Clouds component with better distribution
const Clouds = React.memo(() => {
  const cloudPositions = useMemo(() => {
    const positions = [];
    const radius = WORLD_SIZE / 3;
    const height = 100;
    const count = 12; // Reduced cloud count

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius * (0.8 + Math.random() * 0.4);
      const z = Math.sin(angle) * radius * (0.8 + Math.random() * 0.4);
      const y = height + Math.random() * 100;
      const scale = 4 + Math.random() * 4;
      const speed = 0.2 + Math.random() * 0.3;

      positions.push({ position: [x, y, z], scale, speed });
    }

    return positions;
  }, []);

  return (
    <group>
      {cloudPositions.map((cloud, index) => (
        <CartoonCloud
          key={index}
          position={cloud.position}
          scale={cloud.scale}
          speed={cloud.speed}
        />
      ))}
    </group>
  );
});

Clouds.displayName = 'Clouds';

// Add Birds component
const Bird = ({ position, speed = 1 }) => {
  const birdRef = useRef();
  const startPos = useRef(position);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed;
    const radius = 100;
    
    birdRef.current.position.x = startPos.current[0] + Math.sin(time) * radius;
    birdRef.current.position.z = startPos.current[2] + Math.cos(time) * radius;
    birdRef.current.position.y = startPos.current[1] + Math.sin(time * 2) * 10;
    
    // Rotate bird in direction of movement
    birdRef.current.rotation.y = -time + Math.PI;
  });

  return (
    <group ref={birdRef} position={position} scale={[0.2, 0.2, 0.2]}>
      <mesh>
        <coneGeometry args={[2, 8, 4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0, -2]} rotation={[0, 0, Math.PI * 0.13]}>
        <boxGeometry args={[8, 0.5, 3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

const Birds = React.memo(() => {
  return (
    <group position={[0, 200, 0]}>
      {Array.from({ length: 10 }).map((_, i) => ( // Reduced bird count
        <Bird 
          key={i}
          position={[
            Math.random() * WORLD_SIZE/2 - WORLD_SIZE/4,
            150 + Math.random() * 100,
            Math.random() * WORLD_SIZE/2 - WORLD_SIZE/4
          ]}
          speed={0.3 + Math.random() * 0.2}
        />
      ))}
    </group>
  );
});

Birds.displayName = 'Birds';

// Add a custom bubble shader material for better visual effect
const BubbleMaterial = () => {
  const bubbleShader = {
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = length(vUv - center);
        float alpha = smoothstep(0.5, 0.4, dist);
        float rim = smoothstep(0.5, 0.45, dist) * smoothstep(0.4, 0.45, dist);
        vec3 color = mix(vec3(0.8, 0.8, 1.0), vec3(1.0), rim);
        gl_FragColor = vec4(color, alpha * 0.5);
      }
    `
  };

  return (
    <shaderMaterial
      {...bubbleShader}
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  );
};

// Add these constants at the top level
const WORLD_SIZE = 6000;  // Reduced world size
const RENDER_DISTANCE = 4000; // Reduced view distance


// Add enhanced water splash effect
const WaterSplash = ({ position, scale }) => {
  const splashRef = useRef();
  
  useEffect(() => {
    if (!splashRef.current) return;
    
    const animation = {
      scale: [0, scale, scale * 1.2, 0],
      opacity: [0.8, 0.6, 0.3, 0],
      position: [
        position.x,
        position.y,
        position.z,
        position.x,
        position.y + 2,
        position.z
      ]
    };
    
    // Animate splash
    gsap.to(splashRef.current.scale, {
      x: animation.scale,
      y: animation.scale,
      z: animation.scale,
      duration: 0.8,
      ease: "power2.out"
    });
    
    gsap.to(splashRef.current.material, {
      opacity: animation.opacity,
      duration: 0.8,
      ease: "power2.out"
    });
    
    gsap.to(splashRef.current.position, {
      x: animation.position[3],
      y: animation.position[4],
      z: animation.position[5],
      duration: 0.8,
      ease: "power2.out"
    });
  }, [position, scale]);

  return (
    <mesh ref={splashRef} position={position}>
      <ringGeometry args={[0, 1, 32]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};


// Add PropTypes for WaterSplash
WaterSplash.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired
  }).isRequired,
  scale: PropTypes.number.isRequired
};

// Add PropTypes for Bird
Bird.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  speed: PropTypes.number
};

// Update SkyBox to handle texture loading properly
const SkyBox = () => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(skyTexture, (loadedTexture) => {
      setTexture(loadedTexture);
    });

    return () => {
      if (texture) texture.dispose();
    };
  }, []);

  if (!texture) return null;

  return (
    <mesh>
      <sphereGeometry args={[5000, 60, 40]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  );
};

// Add DockingPoint component
const DockingPoint = ({ position, isActive }) => {
  return (
    <group position={position}>
      {/* Docking platform */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial 
          color={isActive ? "#4CAF50" : "#90A4AE"} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      {/* Indicator pole */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 10]} />
        <meshStandardMaterial color={isActive ? "#4CAF50" : "#90A4AE"} />
      </mesh>
      {/* Light indicator */}
      <pointLight
        position={[0, 10, 0]}
        color={isActive ? "#4CAF50" : "#90A4AE"}
        intensity={1}
        distance={20}
      />
    </group>
  );
};

DockingPoint.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  isActive: PropTypes.bool
};

// Add this distance-based scaling function
const getScaleBasedOnDistance = (distance) => {
  const minScale = 0.6;  // Minimum scale when far away
  const maxScale = 1.2;  // Maximum scale when close
  const minDistance = 50; // Distance for maximum scale
  const maxDistance = 400; // Distance for minimum scale
  
  // Calculate scale based on distance
  return THREE.MathUtils.clamp(
    THREE.MathUtils.lerp(
      maxScale,
      minScale,
      (distance - minDistance) / (maxDistance - minDistance)
    ),
    minScale,
    maxScale
  );
};

// Add translations
const translations = {
  marketplace: {
    id: 'Pasar Utama',
    description: 'Pusat perdagangan ramai tempat para pedagang berkumpul'
  },
  desa: {
    id: 'Pusat Desa',
    description: 'Desa nelayan yang damai dan terkenal dengan hasil lautnya'
  },
  visitButton: 'Kunjungi Pulau',
  dockPrompt: 'Tekan E untuk berlabuh',
  type: {
    marketplace: 'Pasar',
    desa: 'Desa'
  }
};

// Update SeaIsland component
const SeaIsland = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [islands, setIslands] = useState([]);
  const [islandInteractions, setIslandInteractions] = useState({
    hoveredIsland: null,
    nearestIsland: null,
    canDock: false
  });
  const boatRef = useRef();
  const [cameraPosition, setCameraPosition] = useState({ x: 0, z: 0 });

  // Memoize camera settings
  const cameraSettings = useMemo(() => ({
    position: [0, 100, 200],
    fov: 60,
    near: 1,
    far: RENDER_DISTANCE + 1000
  }), []);

  // Track loading progress
  const { progress } = useProgress();
  
  useEffect(() => {
    if (progress === 100) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setAssetsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // Update island generation effect
  useEffect(() => {
    const islandPositions = [
      {
        position: [100, -2, 100],
        rotation: [0, -Math.PI / 4, 0],
        scale: [50, 50, 50],
        type: 'marketplace',
        name: 'Main Marketplace',
        description: 'A bustling marketplace where traders gather',
        route: '/marketplace'
      },
      {
        position: [-250, -2, 250],
        rotation: [0, Math.PI / 4, 0],
        scale: [35, 35, 35],
        type: 'desa',
        name: 'Village Center',
        description: 'A peaceful village known for its fishing',
        route: '/village'
      }
    ];

    // Calculate docking points for each island
    const islandsWithDocking = islandPositions.map(island => {
      // Calculate docking point 60 units away from the island, opposite to its rotation
      const dockingAngle = Math.atan2(island.position[2], island.position[0]) + Math.PI;
      const dockingOffset = 60;
      
      return {
        ...island,
        id: `island-${island.name.toLowerCase().replace(/\s+/g, '-')}`,
        isHighlighted: false,
        dockingPoint: new THREE.Vector3(
          island.position[0] + Math.cos(dockingAngle) * dockingOffset,
          0, // Keep at water level
          island.position[2] + Math.sin(dockingAngle) * dockingOffset
        ),
        dockingRotation: dockingAngle
      };
    });

    setIslands(islandsWithDocking);
  }, []);

  // Update island checking logic with smaller ranges
  useEffect(() => {
    if (!boatRef.current) return;

    const checkNearbyIslands = () => {
      const boatPos = new THREE.Vector3().copy(boatRef.current.position);
      let nearest = null;
      let minDistance = Infinity;
      let hoveredIsland = null;

      islands.forEach(island => {
        const islandPos = new THREE.Vector3(...island.position);
        const distanceToIsland = boatPos.distanceTo(islandPos);
        const dockingPoint = island.dockingPoint;
        const distanceToDock = boatPos.distanceTo(dockingPoint);

        // Update hover detection (2 meters)
        if (distanceToIsland < 0.2) {
          hoveredIsland = island;
        }

        // Update nearest island and docking detection
        if (distanceToDock < minDistance) {
          minDistance = distanceToDock;
          nearest = island;
        }
      });

      setIslandInteractions(prev => ({
        ...prev,
        hoveredIsland,
        nearestIsland: nearest,
        canDock: minDistance < 0.5 // Set to 1.5 meters for docking
      }));

      // Update island highlighting
      setIslands(prevIslands => 
        prevIslands.map(island => ({
          ...island,
          isHighlighted: island.id === hoveredIsland?.id
        }))
      );
    };

    const interval = setInterval(checkNearbyIslands, 100);
    return () => clearInterval(interval);
  }, [islands]);

  // Update docking logic with better animation
  const handleDock = useCallback(() => {
    if (!islandInteractions.canDock || !islandInteractions.nearestIsland || !boatRef.current) return;

    const targetPosition = islandInteractions.nearestIsland.dockingPoint;
    const targetRotation = islandInteractions.nearestIsland.dockingRotation;

    // Stop boat movement
    if (boatRef.current.userData.velocityRef) {
      boatRef.current.userData.velocityRef.set(0, 0, 0);
    }
    if (boatRef.current.userData.angularVelocityRef) {
      boatRef.current.userData.angularVelocityRef = 0;
    }

    // Animate docking
    gsap.to(boatRef.current.position, {
      x: targetPosition.x,
      y: -0.5, // Consistent water level
      z: targetPosition.z,
      duration: 1.5,
      ease: "power2.inOut"
    });

    gsap.to(boatRef.current.rotation, {
      y: targetRotation,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Navigate to island page
        const islandName = island.name.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `/island/${island.type}/${islandName}`;
      }
    });
  }, [islandInteractions]);

  // Add new state for clicked island
  const [clickedIsland, setClickedIsland] = useState(null);

  // Update handleIslandClick
  const handleIslandClick = useCallback((island) => {
    // Toggle clicked state
    setClickedIsland(prev => prev?.id === island.id ? null : island);
  }, []);

  // Update keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'e' && islandInteractions.canDock) {
        handleDock();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [islandInteractions.canDock, handleDock]);

  // Update camera position when it changes
  useEffect(() => {
    if (!boatRef.current) return;

    const updateCameraPosition = () => {
      const camera = boatRef.current?.parent?.parent?.parent?.camera;
      if (camera) {
        setCameraPosition({
          x: camera.position.x,
          z: camera.position.z
        });
      }
    };

    const interval = setInterval(updateCameraPosition, 100);
    return () => clearInterval(interval);
  }, []);

  // Add performance optimizations
  const MemoizedBoat = useMemo(() => React.memo(Boat), []);
  const MemoizedSea = useMemo(() => React.memo(Sea), []);
  const MemoizedBirds = useMemo(() => React.memo(Birds), []);
  const MemoizedClouds = useMemo(() => React.memo(Clouds), []);
  const MemoizedBuildings = useMemo(() => React.memo(Buildings), []);

  // Add WebGL context loss handling
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      // Force a re-render after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  // Add click handler to close expanded UI when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setClickedIsland(null);
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-screen">
      <AppErrorBoundary>
        <Canvas 
          shadows="soft" 
          camera={cameraSettings}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#87CEEB');
            // Enable context preservation
            gl.preserveDrawingBuffer = true;
          }}
        >
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#87CEEB', RENDER_DISTANCE * 0.4, RENDER_DISTANCE]} />
          
          <Suspense fallback={<LoadingScreen />}>
            <ModelProvider>
              {assetsLoaded && (
                <group>
                  <SkyBox />
                  <MemoizedBuildings islands={islands} />
                  <MemoizedBoat ref={boatRef} position={[0, -0.5, 0]} />
                  <FollowCamera target={boatRef} />
                  <MemoizedSea />
                  <MemoizedClouds />
                  <MemoizedBirds />
                  <Stars 
                    radius={WORLD_SIZE / 2} 
                    depth={50} 
                    count={2000}
                    factor={4} 
                    saturation={0} 
                    fade 
                    speed={1} 
                  />
                  <Environment preset="sunset" />
                  <Lighting />

                  {/* Add docking points */}
                  {islands.map((island, index) => (
                    <group key={`dock-${index}`}>
                      <DockingPoint
                        position={[island.dockingPoint.x, 0, island.dockingPoint.z]}
                        isActive={island === islandInteractions.nearestIsland && islandInteractions.canDock}
                      />
                    </group>
                  ))}
                </group>
              )}
            </ModelProvider>
          </Suspense>

          {/* Enhanced island highlight effects */}
          {assetsLoaded && islands.map((island, index) => {
            const distanceToCamera = new THREE.Vector3(...island.position)
              .distanceTo(new THREE.Vector3(cameraPosition.x, island.position[1], cameraPosition.z));
            
            const uiScale = getScaleBasedOnDistance(distanceToCamera);
            const translation = translations[island.type];

            return (
              <group 
                key={index} 
                position={island.position}
                onClick={() => handleIslandClick(island)}
              >
                <Html position={[0, 40, 0]} center>
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: island.isHighlighted || clickedIsland?.id === island.id ? 1 : 0.8,
                      y: clickedIsland?.id === island.id ? 0 : -5,
                      scale: clickedIsland?.id === island.id ? uiScale * 1.1 : uiScale
                    }}
                    whileHover={{ 
                      scale: uiScale * 1.05,
                      y: -8,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    transition={{ duration: 0.2 }}
                    className={`
                      relative px-8 py-5 rounded-xl
                      backdrop-blur-md cursor-pointer
                      border border-white/20
                      shadow-lg shadow-black/20
                      transition-all duration-200
                      group
                      ${clickedIsland?.id === island.id 
                        ? 'bg-white/30 text-white border-white/40' 
                        : island.isHighlighted
                          ? 'bg-white/20 text-white hover:bg-white/25 hover:border-white/30'
                          : 'bg-black/30 text-white/90 hover:bg-black/40 hover:border-white/30'
                      }
                    `}
                    style={{
                      transformOrigin: 'center center',
                      opacity: distanceToCamera > 800 ? 0 : undefined,
                      transform: `perspective(1000px) rotateX(${island.isHighlighted ? -5 : 0}deg)`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIslandClick(island);
                    }}
                  >
                    {/* Glow effect */}
                    {(clickedIsland?.id === island.id || island.isHighlighted) && (
                      <motion.div 
                        className={`
                          absolute inset-0 -z-10 rounded-xl blur-xl
                          ${clickedIsland?.id === island.id 
                            ? 'bg-white/30' 
                            : 'bg-white/20'
                          }
                        `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Hover highlight */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Main content */}
                    <div className="flex flex-col items-center gap-3 relative">
                      <motion.h3 
                        className="text-2xl font-bold tracking-wider text-white
                                   drop-shadow-lg
                                   font-display"
                        animate={{ 
                          scale: island.isHighlighted ? 1.05 : 1,
                          y: island.isHighlighted ? -2 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {translation.id}
                      </motion.h3>

                      <motion.span 
                        className="text-sm font-medium tracking-wider uppercase px-4 py-1.5 rounded-full 
                                   bg-white/10 backdrop-blur-sm
                                   group-hover:bg-white/15 transition-colors duration-200
                                   border border-white/10 group-hover:border-white/20
                                   shadow-sm"
                        animate={{ 
                          scale: island.isHighlighted ? 1.05 : 1
                        }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                      >
                        {translations.type[island.type]}
                      </motion.span>
                      
                      {/* Enhanced description animation */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: clickedIsland?.id === island.id ? 1 : 0,
                          height: clickedIsland?.id === island.id ? 'auto' : 0
                        }}
                        className="overflow-hidden w-full"
                      >
                        <motion.p 
                          className="text-base text-center text-white/90 mt-2 max-w-[240px] mx-auto
                                     leading-relaxed font-light tracking-wide
                                     [text-wrap:balance]"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ 
                            y: clickedIsland?.id === island.id ? 0 : 10,
                            opacity: clickedIsland?.id === island.id ? 1 : 0
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {translation.description}
                        </motion.p>
                        
                        {/* Enhanced button animation */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: clickedIsland?.id === island.id ? 1 : 0,
                            y: clickedIsland?.id === island.id ? 0 : 10
                          }}
                          transition={{ delay: 0.2 }}
                          className="mt-5 flex flex-col items-center gap-2"
                        >
                          <button 
                            className="px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg
                                       transition-all duration-200 
                                       text-base font-semibold tracking-wide
                                       hover:scale-105 active:scale-95
                                       shadow-lg shadow-black/10
                                       border border-white/10 hover:border-white/20
                                       backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/island/${island.type}/${island.name.toLowerCase().replace(/\s+/g, '-')}`;
                            }}
                          >
                            {translations.visitButton}
                          </button>
                        </motion.div>
                      </motion.div>

                      {/* Enhanced docking indicator */}
                      {island === islandInteractions.nearestIsland && islandInteractions.canDock && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex items-center gap-3 text-green-400
                                     bg-green-400/10 px-4 py-2 rounded-full
                                     border border-green-400/20"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-sm font-medium tracking-wider">
                            {translations.dockPrompt}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </Html>
              </group>
            );
          })}
        </Canvas>
      </AppErrorBoundary>

      {/* Enhanced docking UI */}
      {assetsLoaded && boatRef.current && islandInteractions.canDock && (
        <motion.div
          className="fixed bottom-32 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div 
            className="bg-black/50 text-white px-6 py-3 rounded-lg backdrop-blur-sm cursor-pointer
                     hover:bg-black/70 transition-colors duration-200 flex flex-col items-center gap-1"
            onClick={handleDock}
          >
            <span className="font-bold">Press E to dock at {islandInteractions.nearestIsland?.name}</span>
            <span className="text-sm opacity-75 capitalize">{islandInteractions.nearestIsland?.type}</span>
          </div>
        </motion.div>
      )}

      {/* Ambient Sounds */}
      {assetsLoaded && (
        <AmbientSounds 
          cameraPosition={cameraPosition}
          boatPosition={boatRef.current ? {
            x: boatRef.current.position.x,
            z: boatRef.current.position.z
          } : null}
        />
      )}
    </div>
  );
};

// Add enhanced lighting setup
const Lighting = React.memo(() => {
  const shadowMapSize = 2048; // Increased shadow map resolution
  
  return (
    <>
      <ambientLight intensity={0.5} /> {/* Slightly reduced for better shadow contrast */}
      
      {/* Main directional light with enhanced shadows */}
      <directionalLight 
        position={[100, 100, 50]} 
        intensity={1.5}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={RENDER_DISTANCE}
        shadow-camera-near={1}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-bias={-0.001} // Reduces shadow acne
        shadow-normalBias={0.02} // Helps with geometric edges
      />
      
      {/* Secondary directional light for softer shadows */}
      <directionalLight
        position={[-50, 80, -50]}
        intensity={0.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={RENDER_DISTANCE / 2}
        shadow-camera-near={1}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        shadow-bias={-0.001}
      />

      <hemisphereLight 
        skyColor="#b1e1ff" 
        groundColor="#000000" 
        intensity={0.6}
      />
      
      {/* Add strategic point lights for better building illumination */}
      <pointLight
        position={[0, 100, 0]}
        intensity={0.4}
        distance={1000}
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />
    </>
  );
});

Lighting.displayName = 'Lighting';

export default SeaIsland;
