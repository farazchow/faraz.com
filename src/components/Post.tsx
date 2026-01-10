import { forwardRef, useContext } from 'react';
import '../style.css';
import { NavContext } from './NavContext';

const Post = forwardRef<HTMLDivElement>((props, ref) => {
    const { navState, setNavState } = useContext(NavContext);

    const handleClose = () => {
        setNavState({objID: 0});
    }

    return (
        <div className='post' id={navState.objID === 0 ? "hidden" : ""} ref={ref}>
            <div className='closeButton' onClick={handleClose}>
                {navState.objID === 0 ? ">" : "<"}
            </div>
            <div className='postContent'>
                Post: {navState.objID} 
            </div>
        </div>
    );
});

export default Post;