import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useUserStore } from '../store/userStore';

interface Momo3DProps {
  speaking: boolean;
}

const MomoModel: React.FC<{ speaking: boolean }> = ({ speaking }) => {
  const { favoriteColor } = useUserStore();
  const colorValue = favoriteColor.replace('#', '0x');
  
  const group = useRef<THREE.Group>(null);
  const earGroup = useRef<THREE.Group>(null);
  
  // Simple animation for the character
  useFrame((state) => {
    if (group.current) {
      // Gentle bobbing motion
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
      
      // Gentle swaying
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05;
    }
    
    if (earGroup.current) {
      // Ear wiggle animation when speaking
      if (speaking) {
        earGroup.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 10) * 0.2;
      } else {
        earGroup.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      }
    }
  });
  
  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.2, 0.8, 0.5]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 0.8, 0.5]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[-0.2, 0.8, 0.57]}>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.2, 0.8, 0.57]}>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 0.5, 0.5]} scale={[speaking ? 0.3 : 0.2, speaking ? 0.2 : 0.05, 0.1]}>
        <boxGeometry />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Ears */}
      <group ref={earGroup}>
        <mesh position={[-0.4, 1.2, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={colorValue} />
        </mesh>
        <mesh position={[0.4, 1.2, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={colorValue} />
        </mesh>
      </group>
      
      {/* Arms */}
      <mesh position={[-0.9, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
      <mesh position={[0.9, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.3, -1.2, 0]} rotation={[0, 0, -Math.PI / 16]}>
        <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
      <mesh position={[0.3, -1.2, 0]} rotation={[0, 0, Math.PI / 16]}>
        <capsuleGeometry args={[0.15, 0.6, 8, 8]} />
        <meshStandardMaterial color={colorValue} />
      </mesh>
    </group>
  );
};

const Momo3D: React.FC<Momo3DProps> = ({ speaking }) => {
  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <MomoModel speaking={speaking} />
      </Canvas>
    </div>
  );
};

export default Momo3D;