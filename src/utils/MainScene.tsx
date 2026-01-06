import * as THREE from "three";
import { Stats } from "@react-three/drei";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";

// Meshes
import Babyduck from "../meshes/Babyduck";
import TestPlane from "../meshes/TestPlane";
import Snow from "../meshes/Snow";

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

      useThree((state) => {
        state.camera.lookAt(new THREE.Vector3(-2, 0, 0));
      });

      return (
        <>
          {/* Lights */}
          <ambientLight intensity={2} />
          <spotLight position={[10, 10, 10]} angle={0.2} decay={0} intensity={Math.PI} />
          <pointLight position={[0, 20, 2]} decay={1} intensity={10} />
          <Snow count={1000}/>

          {/* Highlightable Objects */}
          <Babyduck shader={ditherShader} position={new THREE.Vector3(-4, .1, -4)}  />
          <Babyduck shader={noShader} position={new THREE.Vector3(-2, .1, -2)} />
          <Babyduck shader={toonShader} position={new THREE.Vector3(-4, .1, -2)} flatShading={true} />
          <Babyduck shader={colorOverrideShader} position={new THREE.Vector3(-2, .1, -4)} wireframe={true}/>
          
          <TestPlane shader={oceanShader} position={new THREE.Vector3(0, 0, 0)} wireframe={false} />

          {/* Helpers */}
          <Stats />
          {/* <axesHelper args={[100]}/> */}
          {/* <gridHelper args={[20, 20, 0xffffff]}/> */}
        </>
      );
}