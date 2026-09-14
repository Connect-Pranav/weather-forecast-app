'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Cloud as DreiCloud, Stars } from '@react-three/drei';
import { useEffect, useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { WeatherCondition } from '@/lib/weather/weather-types';
import { useWeatherStore } from '@/lib/weather/weather-store';

interface WeatherScene3DProps {
  condition: WeatherCondition;
}

function SceneContent({ condition }: WeatherScene3DProps) {
  const sceneRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { reducedMotion } = useWeatherStore();

  // Determine sky and lighting based on weather condition
  const skyConfig = useMemo(() => {
    const configs: Record<WeatherCondition, any> = {
      sunny: {
        turbidity: 3,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        sunPosition: [100, 50, 100],
        lightIntensity: 1.5,
        lightColor: '#ffffff',
        fogColor: 0x87ceeb,
        fogDensity: 0,
      },
      partly_cloudy: {
        turbidity: 5,
        rayleigh: 2.5,
        mieCoefficient: 0.008,
        mieDirectionalG: 0.7,
        sunPosition: [80, 40, 80],
        lightIntensity: 1.2,
        lightColor: '#e8f1f5',
        fogColor: 0xacc5d4,
        fogDensity: 0.0005,
      },
      cloudy: {
        turbidity: 8,
        rayleigh: 3,
        mieCoefficient: 0.012,
        mieDirectionalG: 0.7,
        sunPosition: [50, 20, 50],
        lightIntensity: 0.9,
        lightColor: '#d0d8e0',
        fogColor: 0xb0b8c0,
        fogDensity: 0.001,
      },
      overcast: {
        turbidity: 10,
        rayleigh: 3.5,
        mieCoefficient: 0.015,
        mieDirectionalG: 0.6,
        sunPosition: [30, 10, 30],
        lightIntensity: 0.7,
        lightColor: '#c5cfd9',
        fogColor: 0x9ca3b0,
        fogDensity: 0.0015,
      },
      rain: {
        turbidity: 12,
        rayleigh: 4,
        mieCoefficient: 0.02,
        mieDirectionalG: 0.5,
        sunPosition: [20, 5, 20],
        lightIntensity: 0.5,
        lightColor: '#8899aa',
        fogColor: 0x4a5568,
        fogDensity: 0.002,
      },
      heavy_rain: {
        turbidity: 15,
        rayleigh: 4.5,
        mieCoefficient: 0.025,
        mieDirectionalG: 0.4,
        sunPosition: [10, 2, 10],
        lightIntensity: 0.3,
        lightColor: '#556b7f',
        fogColor: 0x2d3748,
        fogDensity: 0.003,
      },
      thunderstorm: {
        turbidity: 18,
        rayleigh: 5,
        mieCoefficient: 0.03,
        mieDirectionalG: 0.3,
        sunPosition: [5, 1, 5],
        lightIntensity: 0.2,
        lightColor: '#3d4450',
        fogColor: 0x1a202c,
        fogDensity: 0.004,
      },
      fog: {
        turbidity: 20,
        rayleigh: 5.5,
        mieCoefficient: 0.04,
        mieDirectionalG: 0.2,
        sunPosition: [0, 0, 0],
        lightIntensity: 0.4,
        lightColor: '#a0a8b0',
        fogColor: 0x9aa8b8,
        fogDensity: 0.01,
      },
      snow: {
        turbidity: 8,
        rayleigh: 3,
        mieCoefficient: 0.01,
        mieDirectionalG: 0.8,
        sunPosition: [60, 30, 60],
        lightIntensity: 1.1,
        lightColor: '#f0f4f8',
        fogColor: 0xe0e8f0,
        fogDensity: 0.0008,
      },
      clear_night: {
        turbidity: 1,
        rayleigh: 0.5,
        mieCoefficient: 0.001,
        mieDirectionalG: 0.9,
        sunPosition: [0, -100, 0],
        lightIntensity: 0.1,
        lightColor: '#1a2342',
        fogColor: 0x0a1220,
        fogDensity: 0,
      },
      cloudy_night: {
        turbidity: 2,
        rayleigh: 1,
        mieCoefficient: 0.002,
        mieDirectionalG: 0.8,
        sunPosition: [0, -100, 0],
        lightIntensity: 0.15,
        lightColor: '#2a3a52',
        fogColor: 0x1a2a42,
        fogDensity: 0.0005,
      },
      sunset: {
        turbidity: 6,
        rayleigh: 2.5,
        mieCoefficient: 0.01,
        mieDirectionalG: 0.7,
        sunPosition: [100, 15, 100],
        lightIntensity: 1.3,
        lightColor: '#ff9a56',
        fogColor: 0xff8a40,
        fogDensity: 0.0008,
      },
    };

    return configs[condition] || configs.sunny;
  }, [condition]);

  // Create rain/snow particles
  useEffect(() => {
    if (!particlesRef.current) return;
    if (reducedMotion) return;

    const needsParticles = ['rain', 'heavy_rain', 'thunderstorm', 'snow'].includes(condition);
    if (!needsParticles) return;

    const particleCount = condition === 'heavy_rain' || condition === 'thunderstorm' ? 2000 : condition === 'snow' ? 1000 : 1000;

    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = Math.random() * 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    let animationId: number;
    const animate = () => {
      if (!particlesRef.current) return;

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speed = condition === 'snow' ? 0.1 : 0.5;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= speed;

        // Reset particles at bottom
        if (positions[i * 3 + 1] < -50) {
          positions[i * 3 + 1] = 100;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [condition, reducedMotion]);

  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={skyConfig.sunPosition}
        inclination={0.6}
        azimuth={0.25}
        turbidity={skyConfig.turbidity}
        rayleigh={skyConfig.rayleigh}
        mieCoefficient={skyConfig.mieCoefficient}
        mieDirectionalG={skyConfig.mieDirectionalG}
      />

      {/* Fog */}
      <fog attach="fog" args={[skyConfig.fogColor, 50, 500]} />

      {/* Main Light */}
      <directionalLight position={skyConfig.sunPosition} intensity={skyConfig.lightIntensity} color={skyConfig.lightColor} castShadow />

      {/* Ambient Light */}
      <ambientLight intensity={0.6} />

      {/* Stars for night */}
      {(condition === 'clear_night' || condition === 'cloudy_night') && <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />}

      {/* Moon for night */}
      {(condition === 'clear_night' || condition === 'cloudy_night') && (
        <mesh position={[-100, 80, -100]}>
          <sphereGeometry args={[20, 32, 32]} />
          <meshBasicMaterial color="#f5f5dc" />
        </mesh>
      )}

      {/* Cloud Layer */}
      <group ref={sceneRef}>
        {[...Array(5)].map((_, i) => (
          <DreiCloud key={i} position={[i * 30 - 60, 30 + i * 5, -100]} scale={1.5 + i * 0.3} opacity={0.7} speed={0.1} />
        ))}
      </group>

      {/* Rain/Snow Particles */}
      {['rain', 'heavy_rain', 'thunderstorm', 'snow'].includes(condition) && (
        <points ref={particlesRef}>
          <bufferGeometry />
          <pointsMaterial size={condition === 'snow' ? 2 : 1} color={condition === 'snow' ? '#ffffff' : '#87ceeb'} sizeAttenuation transparent opacity={0.6} />
        </points>
      )}

      {/* Ground */}
      <mesh position={[0, -50, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#8b9bb4" roughness={0.8} metalness={0} />
      </mesh>
    </>
  );
}

export default function WeatherScene3D({ condition }: WeatherScene3DProps) {
  return (
    <Canvas
      className="w-full h-96"
      camera={{ position: [0, 30, 100], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <SceneContent condition={condition} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Suspense>
    </Canvas>
  );
}
