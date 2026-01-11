import '../style.css';
import { useContext } from 'react';
import { NavContext } from './NavContext';

function Navbar() {
    const { navState, setNavState } = useContext(NavContext);
    const objID = navState.objID;
    function navClick(objID: number) {
        setNavState({objID});
    }

    return (
        <nav className='navbar' id={objID === 0 ? "down" : "up"}>
            <div className='aboutMe' onClick={() => navClick(1)}>
                About Me
            </div>
            <div className='name' id={objID === 0 ? "active": ""} onClick={() => navClick(0)}>
                Faraz Chowdhury
            </div>
            <div className='articles' onClick={() => navClick(1)}>
                Articles
            </div>
        </nav>
    );
}

export default Navbar
