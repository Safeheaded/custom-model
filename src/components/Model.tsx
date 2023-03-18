import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, shaderMaterial } from "@react-three/drei";
import { ThreeElements, useFrame, ReactThreeFiber } from "@react-three/fiber";
import { ShaderMaterial } from "three";

const vertexShader = `
uniform float u_time;

varying vec4 vPos;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(sqrt(pow(modelPosition.y, 2.0) + pow(modelPosition.x, 2.0)) / 0.06 - u_time * 4.0) * 0.04;
  vPos = modelPosition;
  
  // Uncomment the code and hit the refresh button below for a more complex effect 🪄
  // modelPosition.y += sin(modelPosition.z * 6.0 + u_time * 2.0) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`;

const fragmentShader = `
uniform float u_time;
varying vec4 vPos;

void main() {
  gl_FragColor = vec4(vPos.z*10.0, 0.0, 1.0, 1.0);
}`;

export function Model() {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF("/portal.glb");
  const { actions } = useAnimations(animations, group);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
        type: "f",
      },
    }),
    []
  );
  useFrame((state) => {
    const { clock } = state;
    if (material.current) {
      material.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });
  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <mesh
          name="Plane"
          castShadow
          receiveShadow
          geometry={nodes.Plane.geometry}
          material={materials.Rock}
        />
        <mesh
          name="Plane001"
          castShadow
          receiveShadow
          geometry={nodes.Plane001.geometry}
          material={materials["Dark Rock"]}
        />
        <mesh
          name="Plane002"
          castShadow
          receiveShadow
          geometry={nodes.Plane002.geometry}
          material={materials.Rock}
          scale={[2, 1, 1]}
        />
        <mesh
          name="Plane003"
          castShadow
          receiveShadow
          geometry={nodes.Plane003.geometry}
          position={[0, 1.52, -0.28]}
          scale={[1.05, 0.99, 1]}
        >
          <shaderMaterial
            key={material?.current?.uniforms.u_time.value}
            ref={material}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/portal.glb");
