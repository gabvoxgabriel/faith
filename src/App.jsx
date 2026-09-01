import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './index.css';

const Page = React.forwardRef((props, ref) => {
  return (
    <div className={`demoPage ${props.isCover ? 'cover-page' : 'inner-page'}`} ref={ref}>
      <div className="page-spine-shadow"></div>
      {props.children}
    </div>
  );
});

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [introStep, setIntroStep] = useState(0); 
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const infiniteGlitterRef = useRef(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch('./assets/audio/bg-music.mp3'); 
        const blob = await response.blob();
        setAudioUrl(URL.createObjectURL(blob));
        setIsLoaded(true);
      } catch (error) {
        console.error("Audio failed to load", error);
        setIsLoaded(true); 
      }
    };
    fetchAudio();
    return () => clearInterval(infiniteGlitterRef.current);
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    const normalizedInput = passwordInput.toLowerCase().replace(/\s/g, '');
    
    if (normalizedInput === 'wonderfulfaith') {
      setIntroStep(1);
      setErrorMsg('');
    } else {
      setErrorMsg('IDENTITY UNRECOGNIZED. PLEASE TRY AGAIN.');
    }
  };

  const handleStartJourney = () => {
    setIntroStep(2);
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(e => console.log("Audio blocked", e));
    }
  };

  const handlePageFlip = (e) => {
    const pageIndex = e.data;
    if (infiniteGlitterRef.current) {
      clearInterval(infiniteGlitterRef.current);
      infiniteGlitterRef.current = null;
    }

    if (pageIndex >= 8) {
      infiniteGlitterRef.current = setInterval(() => {
        confetti({
          particleCount: 20,
          spread: 120,
          origin: { y: -0.1, x: Math.random() },
          colors: ['#ef8b78', '#f5e5d8', '#d7656d', '#ffffff', '#ffd700'],
          gravity: 0.7,
          scalar: 1.2,
          ticks: 300
        });
      }, 300);
    } else {
      confetti({
        particleCount: 180,
        spread: 140,
        origin: { y: 0.5 },
        colors: ['#ef8b78', '#f5e5d8', '#d7656d', '#ffffff', '#ffd700'],
        ticks: 250,
        gravity: 0.8,
        scalar: 1.3
      });
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence>
        {introStep < 2 && (
          <motion.div 
            className="intro-sequence notebook-bg"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {introStep === 0 && (
              <motion.div 
                className="checkpoint-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="marker-font">SECURITY CHECKPOINT</h2>
                <p className="mono-font subtitle">TO PROCEED, VERIFY YOUR IDENTITY.</p>
                <p className="mono-font question">Question: What is your first name?</p>
                
                <form onSubmit={handleVerify} className="input-group">
                  <input 
                    type="text" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter name..."
                    className="mono-font"
                    autoFocus
                  />
                  <button type="submit" className="mono-font btn-verify">Verify</button>
                </form>
                {errorMsg && <p className="mono-font error-msg">{errorMsg}</p>}
              </motion.div>
            )}

            {introStep === 1 && (
              <motion.div 
                className="journey-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <p className="mono-font initializing">INITIALIZING SEQUENCE...</p>
                <h1 className="marker-font huge-text">WONDERFUL FAITH.</h1>
                <p className="italic-sub">You thought I'd just send a basic WhatsApp text?</p>
                
                <button 
                  className={`btn-journey ${isLoaded ? 'ready' : ''}`}
                  onClick={handleStartJourney}
                  disabled={!isLoaded}
                >
                  {!isLoaded ? 'Loading Assets...' : 'Start the Journey →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {introStep === 2 && (
        <motion.div 
          className="book-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="side-message"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.8 }}
          >
            <h2>For Wonderful Faith.</h2>
            <p>Some people make the world brighter just by being in it. <br/><br/>Drag the page corner to begin...</p>
            <div className="swipe-arrow">→</div>
          </motion.div>

          {/* responsive wrapper container */}
          <div className="book-scale-container">
            <HTMLFlipBook 
              width={400} 
              height={550} 
              size="stretch"
              minWidth={280}
              maxWidth={450}
              minHeight={400}
              maxHeight={600}
              showCover={true}
              maxShadowOpacity={0.5}
              className="birthday-book"
              onFlip={handlePageFlip} 
            >
              <Page isCover={true}>
                <div className="hardcover front text-cover-layout">
                  <div className="cover-ornament">✧</div>
                  <h1 className="cover-title-main">To The Extraordinary<br/>Wonderful Faith</h1>
                  <p className="cover-subtitle">A Celebration of You</p>
                  <div className="cover-ornament bottom">✧</div>
                </div>
              </Page>
              <Page>
                <div className="page-text">
                  <h3>Dear Wonderful Faith,</h3>
                  <p>Some people make ordinary days feel like little celebrations. You have always been that kind of person to me: warm, genuine, and wonderfully impossible to forget.</p>
                  <p>Today is a good excuse to remind you how much joy you bring wherever you go.</p>
                </div>
              </Page>
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo1.jpg" alt="Memory 1" className="inner-image" /></div></div>
              </Page>
              <Page>
                <div className="page-text">
                  <h3>Here is the truth:</h3>
                  <p>You make kindness look effortless. You listen with your whole heart, laugh in a way that makes everyone else join in, and somehow make every room feel more like home.</p>
                </div>
              </Page>
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo2.jpg" alt="Memory 2" className="inner-image" /></div></div>
              </Page>
              <Page>
                <div className="page-text">
                  <h3>For the year ahead,</h3>
                  <p>May you find more reasons to laugh until your cheeks hurt, more places that feel like home, and more mornings that make you excited to get up and begin.</p>
                </div>
              </Page>
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo3.jpg" alt="Memory 3" className="inner-image" /></div></div>
              </Page>
              <Page>
                <div className="page-text">
                  <h3>One last thing...</h3>
                  <p>Thank you for being exactly who you are. The world is brighter, funnier, and much more beautiful with you in it.</p>
                </div>
              </Page>
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo4.jpg" alt="Memory 4" className="inner-image" /></div></div>
              </Page>
              <Page isCover={true}>
                <div className="hardcover back text-cover-layout">
                  <div className="cover-ornament">✧</div>
                  <h1 className="cover-title-main">Happy Birthday.</h1>
                  <p className="cover-subtitle">Make it unforgettable.</p>
                  <div className="cover-ornament bottom">✧</div>
                </div>
              </Page>
            </HTMLFlipBook>
          </div>
        </motion.div>
      )}
    </div>
  );
}