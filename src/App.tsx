import { Canvas } from '@react-three/fiber';
import { useProgress, Html} from '@react-three/drei';
import { Suspense, useState } from 'react';

import './style.css';
import MainScene from './utils/MainScene';
import Overlay from './components/Overlay';
import { defaultState, NavContext, type NavState } from './components/NavContext';


function Loader() {
  const {progress} = useProgress();
  return <Html center>{progress} % loaded</Html>
}

function App() {
  const [navState, setNavState] = useState<NavState>(defaultState);

  return (
      <div className='app'>
        <NavContext.Provider value={{navState, setNavState}}>
          <Canvas
            // eslint-disable-next-line react-hooks/purity
            key={Math.random()} 
            camera={{position: [-4, 3, 2]}} 
            style={{background: "Black"}}
          >
            <Suspense fallback={<Loader />}>
              <MainScene />
            </Suspense>
          </Canvas>    
          <Overlay />    
        </NavContext.Provider>
      </div>
  );
}

export default App
