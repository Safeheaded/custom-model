import { Suspense, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import * as THREE from "three";
import "./App.css";
import { Canvas, extend, ThreeElements, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useAnimations } from "@react-three/drei";
import { Model } from "./components/Model";

function Box(props: ThreeElements["mesh"]) {
  const gltf = useLoader(GLTFLoader, "portal.gltf");
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    gltf.scene.rotateY(delta * 0.3);
  });
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

function App() {
  return (
    <Canvas>
      <Suspense>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default App;
