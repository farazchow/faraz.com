/* eslint-disable @typescript-eslint/no-unused-vars */
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, useProgress, Html } from '@react-three/drei';
import * as THREE from "three";
import { Suspense, useMemo} from 'react';

import './App.css';
import Babyduck from './meshes/Babyduck';

import BayerDitherShader from './shaders/BayerDitherShader';
import ToonShader from './shaders/ToonShader';
import NoShader from './shaders/NoShader';
import ColorOverrideShader from './shaders/ColorOverrideShader';
import TestPlane from './meshes/TestPlane';
import DebugShader from './shaders/DebugShader';

function Loader() {
  const {progress} = useProgress();
  return <Html center>{progress} % loaded</Html>
}

function App() {
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

  const debugShader = useMemo(() => {
    const shader = new DebugShader(new THREE.Color("white"), 1);
    return shader;
  }, []);

  return (
    <>
      <Canvas 
        // eslint-disable-next-line react-hooks/purity
        key={Math.random()} 
        camera={{position: [5, 5, 5]}} 
        style={{background: "Black"}}
      >
        <Suspense fallback={<Loader />}>
          {/* Lights */}
          <ambientLight intensity={.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[0, 2, 2]} decay={1} intensity={10} />

          {/* Highlightable Objects */}
          {/* <Babyduck shader={ditherShader} position={new THREE.Vector3(0, 0, 0)}  />
          <Babyduck shader={noShader} position={new THREE.Vector3(5, 0, 0)} />
          <Babyduck shader={toonShader} position={new THREE.Vector3(10, 0, 0)} flatShading={true} />
          <Babyduck shader={colorOverrideShader} position={new THREE.Vector3(-5, 0, 0)} wireframe={true}/> */}
          <TestPlane shader={debugShader}/>

          {/* Helpers */}
          <Stats />
          <OrbitControls enablePan={true} enableDamping={false} />
          {/* <axesHelper args={[100]}/> */}
          {/* <gridHelper args={[20, 20, 0xffffff]}/> */}
        </Suspense>
      </Canvas>
    </>
  );
}

export default App
