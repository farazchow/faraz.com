import { Canvas } from '@react-three/fiber';
import { useProgress, Html } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';

import './style.css';
import MainScene from './utils/MainScene';
import { defaultState, NavContext, type NavState } from './components/NavContext';
import Navbar from './components/Navbar';
import Post from './components/Post';
import SocialLinks from './components/SocialLinks';

function Loader() {
  const {progress} = useProgress();
  return <Html center>{progress} % loaded</Html>
}

function App() {
  const [navState, setNavState] = useState<NavState>(defaultState);
  const postRef = useRef<HTMLDivElement>(null!);

  return (
      <div className='app'>
        <NavContext.Provider value={{navState, setNavState}}>
          <Canvas
            // eslint-disable-next-line react-hooks/purity
            key={Math.random()} 
            camera={{position: [0, 3, 5], fov: 30, zoom: .5}} 
            style={{background: "Black"}}
          >
            <Suspense fallback={<Loader />}>
              <MainScene />
            </Suspense>
          </Canvas>
          <div className='overlay' >
            <Navbar />
            <SocialLinks />
            <Post ref={postRef} />
          </div>
        </NavContext.Provider>
      </div>
  );
}

export default App