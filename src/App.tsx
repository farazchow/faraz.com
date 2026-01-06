/* eslint-disable @typescript-eslint/no-unused-vars */
import { Canvas, useThree } from '@react-three/fiber';
import { Stats, OrbitControls, useProgress, Html, Stars } from '@react-three/drei';
import * as THREE from "three";
import { Suspense, useMemo} from 'react';

import './App.css';
import MainScene from './utils/MainScene';

function Loader() {
  const {progress} = useProgress();
  return <Html center>{progress} % loaded</Html>
}

function App() {
  return (
    <>
      <Canvas 
        // eslint-disable-next-line react-hooks/purity
        key={Math.random()} 
        camera={{position: [-4, 4, 2]}} 
        style={{background: "Black"}}
      >
        <Suspense fallback={<Loader />}>
          <MainScene />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App
