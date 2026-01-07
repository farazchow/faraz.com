import '../style.css';
import React, { useContext } from 'react';
import { NavContext } from './NavContext';

function Navbar() {
    const { navState, setNavState } = useContext(NavContext);

    function navClick(objID: number) {
        setNavState({objID});
    }

    return (
        <nav className='navbar' id={navState.objID === 0 ? "down" : "up"}>
            <div className='aboutMe' onClick={() => navClick(1)}>
                About Me
            </div>
            <div className='name' onClick={() => navClick(0)}>
                Faraz Chowdhury
            </div>
            <div className='articles' onClick={() => navClick(1)}>
                Articles
            </div>
        </nav>
    );
}

export default Navbar
