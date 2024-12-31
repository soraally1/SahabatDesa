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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/* eslint-disable react/no-unknown-property */

// Constants for model paths
const MODEL_PATHS = {
  BOAT: './models/Boat.glb',
  MARKETPLACE: './models/Marketplace.glb',
  DESA: './models/Desa1.glb',
  DESA2: './models/Desa2.glb'
};

// Create a model context to share loaded models
const ModelContext = React.createContext({
  models: {},
  isLoading: true,
  error: null
});

// Update constants for boat and effects
const MAX_BOAT_SPEED = 25;
const ACCELERATION = 0.55;
const BOOST_MULTIPLIER = 1.5;
const WATER_RESISTANCE = 0.988;
const TURN_SPEED = 0.016;
const TILT_FACTOR = 0.035;
const WAVE_INTENSITY = 2.8;
const SMOOTHING_FACTOR = 0.12;
const WAKE_SCALE = 4.0;
const FORWARD_TILT = 0.15;
const BACKWARD_TILT = 0.1;
const MIN_SPEED_FOR_EFFECTS = 0.1;
const MAX_WAKE_PARTICLES = 50;
const MAX_BUBBLES = 30;
const BUBBLE_LIFETIME = 2.0;
const MAX_SPEED = 25;

// Preload boat model
useGLTF.preload(MODEL_PATHS.BOAT);

const Boat = React.forwardRef((props, ref) => {
  const { scene } = useGLTF(MODEL_PATHS.BOAT);
  const velocityRef = useRef(new THREE.Vector3());
  const angularVelocityRef = useRef(0);
  const boatRef = useRef();
  const smoothedPositionRef = useRef(new THREE.Vector3());
  const previousTiltRef = useRef({ x: 0, z: 0 });
  const wakeRef = useRef();
  const wakeParticles = useRef([]);
  const bubbleParticles = useRef([]);
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
  });

  // Optimize keyboard handlers using debounce
  const handleKeyDown = useCallback((e) => {
    // Prevent default only for game controls
    if (['w', 's', 'a', 'd', 'shift'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      
      setKeys(prev => {
        switch (e.key.toLowerCase()) {
          case 'w': return { ...prev, backward: true };
          case 's': return { ...prev, forward: true };
          case 'a': return { ...prev, left: true };
          case 'd': return { ...prev, right: true };
          case 'shift': return { ...prev, boost: true };
          default: return prev;
        }
      });
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    if (['w', 's', 'a', 'd', 'shift'].includes(e.key.toLowerCase())) {
      setKeys(prev => {
        switch (e.key.toLowerCase()) {
          case 'w': return { ...prev, backward: false };
          case 's': return { ...prev, forward: false };
          case 'a': return { ...prev, left: false };
          case 'd': return { ...prev, right: false };
          case 'shift': return { ...prev, boost: false };
          default: return prev;
        }
      });
    }
  }, []);

  // Optimize event listener attachment
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

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

  useEffect(() => {
    // Initialize wake particles with reduced count
    for (let i = 0; i < MAX_WAKE_PARTICLES; i++) {
      wakeParticles.current.push({
        position: new THREE.Vector3(),
        scale: 1,
        opacity: 1,
        age: 0
      });
    }

    // Initialize bubble particles with reduced count
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubbleParticles.current.push({
        position: new THREE.Vector3(),
        scale: 0.1 + Math.random() * 0.2,
        speed: 0.2 + Math.random() * 0.2,
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          Math.random() * 0.3,
          (Math.random() - 0.5) * 1.5
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

    // Only update physics when moving
    if (keys.forward || keys.backward || keys.left || keys.right || currentSpeed > 0.01) {
      // Movement logic
      if (keys.forward || keys.backward) {
        const direction = keys.forward ? -1 : 1;
        const accelerationMultiplier = 1 - (speedFactor * 0.6);
        const acceleration = ACCELERATION * direction * speedMultiplier * accelerationMultiplier;
        const maxSpeedForDirection = keys.forward ? MAX_SPEED : (MAX_SPEED * 0.4);

        if (currentSpeed < maxSpeedForDirection * speedMultiplier) {
          velocityRef.current.add(new THREE.Vector3(
            Math.sin(boatRef.current.rotation.y) * acceleration,
            0,
            Math.cos(boatRef.current.rotation.y) * acceleration
          ));
        }
      }

      // Turning logic
      if (keys.left || keys.right) {
        const turnDirection = keys.left ? 1 : -1;
        const turnSpeedCurve = (speedFactor * 0.6 + 0.4);
        angularVelocityRef.current += TURN_SPEED * turnDirection * turnSpeedCurve;
        angularVelocityRef.current *= 0.9;
      } else {
        angularVelocityRef.current *= 0.85;
      }

      // Apply physics
      const speedResistance = 1 - (currentSpeed / MAX_SPEED) * 0.1;
      velocityRef.current.multiplyScalar(WATER_RESISTANCE * speedResistance);
      boatRef.current.rotation.y += angularVelocityRef.current;

      // Position updates
      if (currentSpeed > 0.01) {
        const predictedPosition = smoothedPositionRef.current.clone()
          .add(velocityRef.current);
        boatRef.current.position.lerp(predictedPosition, SMOOTHING_FACTOR);
        smoothedPositionRef.current.copy(boatRef.current.position);
      }

      // Wave effect - only when moving
      if (currentSpeed > MIN_SPEED_FOR_EFFECTS) {
        const posX = boatRef.current.position.x;
        const posZ = boatRef.current.position.z;
        const speedInfluence = Math.max(0, 1 - (currentSpeed / MAX_SPEED) * 0.5);
        const waveX = Math.sin(time * 0.4 + posX * 0.08) * WAVE_INTENSITY * speedInfluence;
        const waveZ = Math.cos(time * 0.3 + posZ * 0.08) * WAVE_INTENSITY * speedInfluence;
        const waveY = Math.sin(time * 0.6) * 0.08 * speedInfluence;

        const targetHeight = -40 + (waveX * 0.4 + waveZ * 0.4 + waveY) * (1 - (currentSpeed / MAX_SPEED) * 0.3);
        boatRef.current.position.y = THREE.MathUtils.lerp(
          boatRef.current.position.y,
          targetHeight,
          0.08
        );

        // Tilt updates - only when moving
        const speedTilt = currentSpeed / MAX_SPEED * 0.1;
        const forwardFactor = keys.forward ? FORWARD_TILT : (keys.backward ? -BACKWARD_TILT : 0);
        
        const targetTiltX = (velocityRef.current.z * TILT_FACTOR) + 
                         (Math.cos(time * 0.3 + posZ * 0.08) * 0.02) +
                         (speedTilt * forwardFactor);

        const targetTiltZ = (-velocityRef.current.x * TILT_FACTOR) - 
                         (angularVelocityRef.current * 1.2) + 
                         (Math.sin(time * 0.4 + posX * 0.08) * 0.02);

        previousTiltRef.current.x = THREE.MathUtils.lerp(
          previousTiltRef.current.x,
          targetTiltX,
          0.03
        );
        
        previousTiltRef.current.z = THREE.MathUtils.lerp(
          previousTiltRef.current.z,
          targetTiltZ,
          0.03
        );

        boatRef.current.rotation.x = THREE.MathUtils.clamp(
          previousTiltRef.current.x,
          -Math.PI / 8,
          Math.PI / 12
        );
        
        boatRef.current.rotation.z = THREE.MathUtils.clamp(
          previousTiltRef.current.z,
          -Math.PI / 6,
          Math.PI / 6
        );

        // Wake effects - only when moving fast enough
        if (currentSpeed > MIN_SPEED_FOR_EFFECTS * 2) {
          const particle = wakeParticles.current[0];
          const wakeScale = (currentSpeed / MAX_SPEED) * WAKE_SCALE;
          
          particle.position.copy(boatRef.current.position);
          particle.position.y = 0;
          particle.scale = wakeScale;
          particle.opacity = Math.min(currentSpeed / (MAX_SPEED * 0.3), 1);
          particle.age = 0;
          
          wakeParticles.current.push(wakeParticles.current.shift());

          // Update existing wake particles
          for (let i = 1; i < MAX_WAKE_PARTICLES; i++) {
            const p = wakeParticles.current[i];
            p.age += deltaTime * 0.7;
            p.opacity = Math.max(0, 1 - p.age * 0.4) * 0.6;
            p.scale += deltaTime * (1 + currentSpeed * 0.3);
          }

          // Update bubbles - only when moving fast
          if (currentSpeed > MAX_SPEED * 0.3) {
            for (let i = 0; i < MAX_BUBBLES; i++) {
              const bubble = bubbleParticles.current[i];
              if (bubble.age >= BUBBLE_LIFETIME) {
                bubble.position.copy(boatRef.current.position).add(bubble.offset);
                bubble.position.y -= 1;
                bubble.age = 0;
              } else {
                bubble.position.y += bubble.speed;
                bubble.age += deltaTime;
              }
            }
          }
        }
      }

      // World boundary check
      const distanceFromCenter = new THREE.Vector2(
        boatRef.current.position.x,
        boatRef.current.position.z
      ).length();

      if (distanceFromCenter > WORLD_SIZE * 0.45) {
        const toCenter = new THREE.Vector3(
          -boatRef.current.position.x,
          0,
          -boatRef.current.position.z
        ).normalize();
        
        const boundaryForce = Math.pow((distanceFromCenter - WORLD_SIZE * 0.4) / (WORLD_SIZE * 0.05), 2);
        velocityRef.current.add(toCenter.multiplyScalar(boundaryForce * 0.5));
      }
    }

    // Store current speed for camera access
    boatRef.current.userData.speed = currentSpeed;
  });

  return (
    <group>
      <group ref={boatRef} position={props.position || [0, -30, 0]}>
        <mesh />
      </group>
      
      {/* Only render wake particles when moving */}
      {velocityRef.current?.length() > MIN_SPEED_FOR_EFFECTS && (
        <group ref={wakeRef}>
          {wakeParticles.current.map((particle, i) => (
            particle.opacity > 0.1 && (
              <mesh
                key={i}
                position={particle.position}
                scale={particle.scale}
              >
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={particle.opacity * 0.3}
                  depthWrite={false}
                />
              </mesh>
            )
          ))}
        </group>
      )}
      
      {/* Only render bubbles when moving fast */}
      {velocityRef.current?.length() > MAX_SPEED * 0.3 && (
        <group>
          {bubbleParticles.current.map((bubble, i) => (
            bubble.age < BUBBLE_LIFETIME && (
              <mesh
                key={`bubble-${i}`}
                position={bubble.position}
                scale={bubble.scale}
              >
                <sphereGeometry args={[1, 8, 8]} />
                <BubbleMaterial />
              </mesh>
            )
          ))}
        </group>
      )}
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
  const [models, setModels] = useState({ marketplace: null, desa: null, desa2: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const loader = new GLTFLoader();
        const [marketplaceResult, desaResult, desa2Result] = await Promise.all([
          loader.loadAsync(MODEL_PATHS.MARKETPLACE),
          loader.loadAsync(MODEL_PATHS.DESA),
          loader.loadAsync(MODEL_PATHS.DESA2)
        ]);

        if (!marketplaceResult.scene || !desaResult.scene || !desa2Result.scene) {
          throw new Error('Failed to load one or more models');
        }

        [marketplaceResult.scene, desaResult.scene, desa2Result.scene].forEach(scene => {
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
          desa: { scene: desaResult.scene },
          desa2: { scene: desa2Result.scene }
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
        position: [100, -35, 100],
        rotation: [0, -Math.PI / 4, 0],
        scale: [50, 50, 50],
        type: 'marketplace',
        name: 'Main Marketplace'
      },
      {
        position: [-250, -35, 250],
        rotation: [0, Math.PI / 4, 0],
        scale: [35, 35, 35],
        type: 'desa',
        name: 'Village Center'
      },
      {
        position: [-400, -35, 250],
        rotation: [0, Math.PI / 6, 0],
        scale: [40, 40, 40],
        type: 'desa2',
        name: 'Coastal Village'
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
const WORLD_SIZE = 3000;  // Reduced world size
const RENDER_DISTANCE = 2000; // Reduced view distance
const LOD_DISTANCES = {
  HIGH: 500,
  MEDIUM: 1000,
  LOW: 1500
};


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
    let isSubscribed = true;

    loader.load(skyTexture, (loadedTexture) => {
      if (isSubscribed) {
        setTexture(loadedTexture);
      }
    });

    return () => {
      isSubscribed = false;
      if (texture) {
        texture.dispose();
      }
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
  desa2: {
    id: 'Desa Pesisir',
    description: 'Perkampungan nelayan tradisional dengan pemandangan pantai yang indah'
  },
  visitButton: 'Kunjungi Pulau',
  dockPrompt: 'Tekan E untuk berlabuh',
  type: {
    marketplace: 'Pasar',
    desa: 'Desa',
    desa2: 'Desa'
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
  const [clickedIsland, setClickedIsland] = useState(null);
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
      },
      {
        position: [-400, -2, 250],
        rotation: [0, Math.PI / 6, 0],
        scale: [40, 40, 40],
        type: 'desa2',
        name: 'Coastal Village',
        description: 'Traditional fishing village with beautiful coastal views',
        route: '/coastal-village'
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
    const nearestIsland = islandInteractions.nearestIsland;

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
        // Fix: Use nearestIsland instead of island
        const islandName = nearestIsland.name.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `/island/${nearestIsland.type}/${islandName}`;
      }
    });
  }, [islandInteractions]);

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

  const handleIslandClick = useCallback((island) => {
    setClickedIsland(prevIsland => 
      prevIsland?.id === island.id ? null : island
    );
  }, []);

  return (
    <div className="w-full h-screen">
      <AppErrorBoundary>
        <Canvas 
          shadows="basic" 
          camera={cameraSettings}
          dpr={Math.min(2, window.devicePixelRatio)} // Limit DPR for performance
          performance={{ min: 0.5 }}
          gl={{
            powerPreference: "high-performance",
            antialias: false, // Disable antialias for better performance
            stencil: false,
            depth: true,
            alpha: false
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#87CEEB');
            gl.preserveDrawingBuffer = true;
            gl.physicallyCorrectLights = true;
            
            // Optimize renderer
            gl.setPixelRatio(Math.min(2, window.devicePixelRatio));
            gl.setSize(window.innerWidth, window.innerHeight);
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.outputEncoding = THREE.sRGBEncoding;
          }}
        >
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#87CEEB', RENDER_DISTANCE * 0.3, RENDER_DISTANCE * 0.8]} />
          
          <Suspense fallback={null}>
            <ModelProvider>
              {assetsLoaded && (
                <group>
                  <SkyBox />
                  <MemoizedBuildings islands={islands} />
                  <MemoizedBoat ref={boatRef} position={[0, -30, 0]} />
                  <FollowCamera target={boatRef} />
                  <MemoizedSea />
                  {/* Only render clouds and birds when close enough */}
                  {cameraPosition.y < LOD_DISTANCES.MEDIUM && <MemoizedClouds />}
                  {cameraPosition.y < LOD_DISTANCES.HIGH && <MemoizedBirds />}
                  <Stars 
                    radius={WORLD_SIZE / 2} 
                    depth={50} 
                    count={1000} // Reduced star count
                    factor={4} 
                    saturation={0} 
                    fade 
                    speed={0.5} 
                  />
                  <Environment preset="sunset" />
                  <OptimizedLighting />

                  {/* Only render UI elements when close enough */}
                  {islands.map((island, index) => {
                    const distance = new THREE.Vector3(...island.position)
                      .distanceTo(new THREE.Vector3(cameraPosition.x, island.position[1], cameraPosition.z));
                    
                    if (distance > LOD_DISTANCES.MEDIUM) return null;
                    
                    return (
                      <group key={index} position={island.position}>
                        <Html
                          position={[0, 40, 0]}
                          center
                          occlude
                          transform
                          sprite
                        >
                          <IslandUI 
                            island={island}
                            clickedIsland={clickedIsland}
                            handleIslandClick={handleIslandClick}
                            cameraPosition={cameraPosition}
                            isHighlighted={island.isHighlighted}
                          />
                        </Html>
                      </group>
                    );
                  })}

                  {/* Only render docking points when close enough */}
                  {islands.map((island, index) => {
                    const distance = new THREE.Vector3(island.dockingPoint.x, 0, island.dockingPoint.z)
                      .distanceTo(new THREE.Vector3(cameraPosition.x, 0, cameraPosition.z));
                    
                    if (distance > LOD_DISTANCES.HIGH) return null;
                    
                    return (
                      <group key={`dock-${index}`}>
                        <DockingPoint
                          position={[island.dockingPoint.x, 0, island.dockingPoint.z]}
                          isActive={island === islandInteractions.nearestIsland && islandInteractions.canDock}
                        />
                      </group>
                    );
                  })}
                </group>
              )}
            </ModelProvider>
          </Suspense>
        </Canvas>
      </AppErrorBoundary>

      {/* UI outside Canvas */}
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

// Separate IslandUI component
const IslandUI = ({ island, clickedIsland, handleIslandClick, cameraPosition, isHighlighted }) => {
  const distanceToCamera = new THREE.Vector3(...island.position)
    .distanceTo(new THREE.Vector3(cameraPosition.x, island.position[1], cameraPosition.z));
  
  // Reduce initial scale for better performance
  const uiScale = getScaleBasedOnDistance(distanceToCamera) * 2.5;

  // Skip rendering if too far away - increased threshold for performance
  if (distanceToCamera > 600) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isHighlighted || clickedIsland?.id === island.id ? 1 : 0.9,
        scale: clickedIsland?.id === island.id ? uiScale * 1.2 : uiScale
      }}
      whileHover={{ 
        scale: uiScale * 1.15,
        transition: { duration: 0.3 }
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`
        relative px-32 py-16 rounded-[48px]
        backdrop-blur-lg cursor-pointer
        border-[6px] border-white/30
        shadow-2xl
        transition-all duration-200
        group min-w-[800px]
        ${clickedIsland?.id === island.id 
          ? 'bg-white/40 text-black border-white/50' 
          : isHighlighted
            ? 'bg-white/30 text-black hover:bg-white/35 hover:border-white/50'
            : 'bg-black/40 text-white hover:bg-black/50 hover:border-white/40'
        }
        hover:backdrop-blur-xl
        transform-gpu
      `}
      style={{
        willChange: 'transform',
        transformOrigin: 'center center',
        transform: `perspective(1000px) rotateX(${isHighlighted ? -2 : 0}deg)`,
        transformStyle: 'preserve-3d'
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleIslandClick(island);
      }}
    >
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 blur-[64px] transition-opacity duration-300" />

      {/* Island UI content */}
      <div className="flex flex-col items-center gap-10 relative">
        <motion.h3 
          className="text-8xl font-bold tracking-wider drop-shadow-2xl font-display
                     group-hover:text-transparent group-hover:bg-clip-text 
                     group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-cyan-200 group-hover:to-blue-200
                     transition-colors duration-200"
          animate={{ 
            scale: isHighlighted ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {island.name}
        </motion.h3>

        <motion.span 
          className="text-3xl font-medium tracking-wider uppercase px-12 py-6 rounded-full
                     bg-white/20 backdrop-blur-lg
                     group-hover:bg-white/30 transition-colors duration-200
                     border-4 border-white/20 group-hover:border-white/40
                     shadow-2xl"
          animate={{ 
            scale: isHighlighted ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {translations.type[island.type]}
        </motion.span>

        {/* Island description and actions */}
        {clickedIsland?.id === island.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <motion.p 
              className="text-3xl text-center mt-8 max-w-[1000px] mx-auto
                         leading-relaxed font-light tracking-wide
                         group-hover:text-white transition-colors duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {island.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-16 flex flex-col items-center gap-6"
            >
              <button 
                className="px-20 py-8 bg-white/30 hover:bg-white/40 rounded-3xl
                           transition-all duration-200
                           text-3xl font-bold tracking-wider
                           hover:scale-105 active:scale-95
                           shadow-2xl
                           border-4 border-white/20 hover:border-white/40
                           backdrop-blur-lg
                           relative overflow-hidden
                           group/btn
                           min-w-[400px]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/island/${island.type}/${island.name.toLowerCase().replace(/\s+/g, '-')}`;
                }}
              >
                <span className="relative group-hover/btn:tracking-wider transition-all duration-200
                               drop-shadow-lg">
                  {translations.visitButton}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

IslandUI.propTypes = {
  island: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(PropTypes.number).isRequired
  }).isRequired,
  clickedIsland: PropTypes.object,
  handleIslandClick: PropTypes.func.isRequired,
  cameraPosition: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool.isRequired
};

// Optimize lighting for better performance
const OptimizedLighting = React.memo(() => {
  const shadowMapSize = 1024; // Reduced shadow map size
  
  return (
    <>
      <ambientLight intensity={0.5} />
      
      {/* Main directional light with optimized shadows */}
      <directionalLight 
        position={[100, 100, 50]} 
        intensity={1.5}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-far={RENDER_DISTANCE * 0.5}
        shadow-camera-near={1}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        shadow-bias={-0.001}
      />
      
      {/* Removed secondary directional light for performance */}
      <hemisphereLight 
        skyColor="#b1e1ff" 
        groundColor="#000000" 
        intensity={0.6}
      />
    </>
  );
});

OptimizedLighting.displayName = 'OptimizedLighting';

export default SeaIsland;
