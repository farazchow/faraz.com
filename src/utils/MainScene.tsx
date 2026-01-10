// Three
import * as THREE from "three";
import { OrbitControls, Stats } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Meshes
import Babyduck from "../meshes/Babyduck";
import TestPlane from "../meshes/TestPlane";
import Snow from "../meshes/Snow";
import MainDuck from "../meshes/MainDuck";

// Shaders 
import BayerDitherShader from "../shaders/BayerDitherShader";
import ColorOverrideShader from "../shaders/ColorOverrideShader";
import NoShader from "../shaders/NoShader";
import OceanShader from "../shaders/OceanShader";
import ToonShader from "../shaders/ToonShader";

export default function MainScene() {  
  const spotlightRef = useRef<THREE.SpotLight>(null!);

  // SHADERS
  const noShader = useMemo(() => {
      const shader = new NoShader();
      shader.cacheKey = () => {return "duck1"};
      return shader;
    }, []);
  
    const ditherShader = useMemo(() => {
      const shader = new BayerDitherShader(.3, false, new THREE.Color("#fffbef"));
      return shader;
    }, []);
  
    const toonShader = useMemo(() => {
      const shader = new ToonShader();
      return shader;
    }, []);
  
    const colorOverrideShader = useMemo(() => {
      const shader = new ColorOverrideShader(new THREE.Color("#00ff00"));
      return shader;
    }, []);
  
    const oceanShader = useMemo(() => {
      const shader = new OceanShader(new THREE.Color("#005b76"), new THREE.Color("#030958"));
      return shader;
    }, []);

    const mainDitherShader = useMemo(() => {
      const shader = new BayerDitherShader(.15, false, new THREE.Color("#e8d4bc"));
      return shader;
    }, []);

    // Set Spotlight
    useEffect(() => {
      if (spotlightRef.current) {
        spotlightRef.current.target.position.set(2.2, 0, 0);
        spotlightRef.current.target.updateMatrixWorld();
      }
    }, [spotlightRef]);

    return (
      <>
        {/* Lights */}
        <ambientLight intensity={.75} />
        <spotLight 
          ref={spotlightRef} 
          position={[8, 4, 0]} 
          angle={.32} 
          decay={0} 
          color={new THREE.Color("#ff4190")}
          intensity={5} 
        />
        <pointLight position={[0, 2, 5]} decay={1} intensity={5} />
        <Snow count={2000}/>

        {/* Highlightable Objects */}
        <MainDuck shader={mainDitherShader} position={new THREE.Vector3(3, -.3, 0)} objID={1}/>
        <Babyduck shader={ditherShader} position={new THREE.Vector3(.1, .05, -1)} objID={2}/>
        <Babyduck shader={noShader} position={new THREE.Vector3(0, .05, 1)} objID={3}/>
        <Babyduck shader={toonShader} position={new THREE.Vector3(-2, .05, -.5)} flatShading={true} objID={4}/>
        <Babyduck shader={colorOverrideShader} position={new THREE.Vector3(-2.75, .05, .5)} wireframe={true} objID={5}/>
        <TestPlane shader={oceanShader} position={new THREE.Vector3(0, 0, -40)} wireframe={false} />

        {/* Helpers */}
        <Stats />
        {/* <axesHelper args={[100]}/> */}
        {/* <gridHelper args={[20, 20, 0xffffff]}/> */}
        {/* <OrbitControls /> */}
      </>
    );
}