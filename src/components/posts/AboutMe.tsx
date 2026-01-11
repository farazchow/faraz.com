import '../../style.css';

function AboutMe() {
    return (
        <div className='post'>
            <div className='post-header'>
                about me
            </div>
            <div className='post-content'>
                <span id="default-text">
                    Hello! My name is Faraz Chowdhury. 
                    I am a recently graduated CS major from MIT, currently living in North East New Jersey.
                    I've been making websites, apps, games, and other programs ever since Middle School.
                    Right now, I'm spending my free time working on a game called RPS Dojo.
                    I'm happiest when I'm making something cool!
                    Feel free to email me at farazchow@gmail.com.
                </span>
                <iframe id="pdf"
                    src="/resume.pdf#view=FitH" 
                    title="Resume PDF"
                />
            </div>
        </div>
    );
}

export default AboutMe;