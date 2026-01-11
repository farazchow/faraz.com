import { useEffect, useRef, useState } from 'react';
import '../style.css';

function SocialLinks() {
    const [audio, setAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null!);

    useEffect(() => {
        if (audioRef.current) {
            if (audio) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [audio]);

    return (
        <div className='social-container'>
            <div >
                <a href='https://www.linkedin.com/in/farazchow/' target='_blank'>
                    <img src={"/images/InBug-White.png"} style={{width: "100%"}}/>
                </a>
            </div>
            <div>
                <a href='https://github.com/farazchow' target='_blank'>
                    <img src={"/images/github-mark-white.png"} style={{width: "100%"}}/>
                </a>
            </div>
            <div className="audio-button" onClick={() => setAudio(!audio)}>
                <img src={`/images/${audio ? "audio.png" : "no-audio.png"}`} style={{width: "100%"}} />
                <audio ref={audioRef} loop>
                    <source src="/variousAssets/piano-loop.wav"></source>
                </audio>
            </div>
        </div>
    );
}

export default SocialLinks;
