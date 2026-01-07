// Three
import * as THREE from "three";
import { Stats } from "@react-three/drei";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";

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
        const shader = new BayerDitherShader(.3, false, new THREE.Color("#79bd75"));
        return shader;
      }, []);

      useThree((state) => {
        state.camera.lookAt(new THREE.Vector3(-2, 0, 0));
      });

      return (
        <>
          {/* Lights */}
          <ambientLight intensity={.75} />
          <spotLight position={[10, 10, 10]} angle={0.2} decay={0} intensity={Math.PI} />
          <pointLight position={[-5, 20, 5]} decay={1} intensity={10} />
          <Snow count={2000}/>

          {/* Highlightable Objects */}
          <MainDuck shader={mainDitherShader} position={new THREE.Vector3(1, -.3, 1)} objID={1}/>
          <Babyduck shader={ditherShader} position={new THREE.Vector3(-4, .05, -4)} objID={2}/>
          <Babyduck shader={noShader} position={new THREE.Vector3(-2, .05, -2)} objID={3}/>
          <Babyduck shader={toonShader} position={new THREE.Vector3(-4, .05, -2)} flatShading={true} objID={4}/>
          <Babyduck shader={colorOverrideShader} position={new THREE.Vector3(-2, .05, -4)} wireframe={true} objID={5}/>
          
          <TestPlane shader={oceanShader} position={new THREE.Vector3(0, 0, 0)} wireframe={false} />

          {/* Helpers */}
          <Stats />
          {/* <axesHelper args={[100]}/> */}
          {/* <gridHelper args={[20, 20, 0xffffff]}/> */}
          {/* <OrbitControls /> */}
        </>
      );
}