import { forwardRef, useContext } from 'react';
import '../style.css';
import { NavContext } from './NavContext';
import AboutMe from './posts/AboutMe';
import DraftDiff from './posts/DraftDiff';
import PersonalWebsite from './posts/PersonalWebsite';
import Urop from './posts/Urop';
import TetrisRL from './posts/TetrisRL';

const Post = forwardRef<HTMLDivElement>((props, ref) => {
    const { navState, setNavState } = useContext(NavContext);

    const handleClose = () => {
        setNavState({objID: 0});
    }

    return (
        <div className='post-container' id={navState.objID === 0 ? "hidden" : ""} ref={ref}>
            <div 
                className='close-button' 
                onClick={handleClose}
                style={{fontSize: "35px"}}
            >
                {navState.objID === 0 ? ">" : "<"}
            </div>
            {navState.objID === 1 && <AboutMe />}
            {navState.objID === 2 && <DraftDiff />}
            {navState.objID === 3 && <Urop />}
            {navState.objID === 4 && <TetrisRL />}
            {navState.objID === 5 && <PersonalWebsite />}
        </div>
    );
});

export default Post;