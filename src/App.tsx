/* eslint-disable @typescript-eslint/no-unused-vars */
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, useProgress, Html } from '@react-three/drei';
import * as THREE from "three";
import { Suspense, useMemo, useRef, type JSX } from 'react';

import './App.css';
import Babyduck from './meshes/Babyduck';
import TestTorus from './meshes/TestTorus';

import BayerDitherShader from './shaders/BayerDitherShader';
import ToonShader from './shaders/ToonShader';
import NoShader from './shaders/NoShader';

function Loader() {
  const {progress} = useProgress();
  return <Html center>{progress} % loaded</Html>
}

function App() {
  const shader1 = useMemo(() => {
    // return new BayerDitherShader(.3, true, new THREE.Color(0xddd2ae));
    // return new ToonShader();
    return new NoShader();
  }, []);

  const shader2 = useMemo(() => {
    return new BayerDitherShader(.3, true, new THREE.Color(0xddd2ae));
    // return new ToonShader();
    // return new NoShader();
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
          {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
          <pointLight position={[0, 2, 2]} decay={1} intensity={10} />

          {/* Highlightable Objects */}
          {/* <TestTorus shader={shader2}/> */}
          <Babyduck shader={shader1} position={new THREE.Vector3(0, 0, 0)}  />
          <Babyduck shader={shader1} position={new THREE.Vector3(5, 0, 0)} flatShading={true} />
          {/* <TestPlane shader={new TestShader(new THREE.Color("blue"))} wireframe={false}/> */}

          {/* Helpers */}
          <Stats />
          <OrbitControls enablePan={false} enableDamping={false} />
          {/* <axesHelper args={[100]}/> */}
          <gridHelper args={[20, 20, 0xffffff]}/>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App
