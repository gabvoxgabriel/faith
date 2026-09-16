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

          <div className="book-scale-container">
            <HTMLFlipBook 
              width={420} 
              height={600} 
              size="stretch"
              minWidth={315} 
              maxWidth={550}
              minHeight={450}
              maxHeight={750}
              showCover={true}
              usePortrait={true}
              maxShadowOpacity={0.5}
              className="birthday-book"
              onFlip={handlePageFlip} 
            >
              {/* PAGE 1: COVER */}
              <Page isCover={true}>
                <div className="hardcover front text-cover-layout">
                  <div className="cover-ornament">✧</div>
                  <h1 className="cover-title-main">To The Extraordinary<br/>Wonderful Faith</h1>
                  <p className="cover-subtitle">A Celebration of You</p>
                  <div className="cover-ornament bottom">✧</div>
                </div>
              </Page>

              {/* PAGE 2: MESSAGE 1 */}
              <Page>
                <div className="page-text">
                  <h3>Dear Wonderful Faith,</h3>
                  <p>Today is your birthday, and I want to make sure you know just how much you mean to me. You are so much more than a friend; you are a constant source of strength, my truest confidante, and one of the most genuine people I know.</p>
                  <p>I am incredibly proud of the woman you are. Our bond is built on shared laughter and unwavering support, and I wouldn't trade it for anything.</p>
                  <p>You don't just brighten ordinary days, you bring a vital and undeniable joy to everyone around you. As you celebrate today and step into this new year, I want you to remember how deeply you are loved and cherished.</p>
                </div>
              </Page>

              {/* PAGE 3: PHOTO 1 */}
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo1.jpg" alt="Memory 1" className="inner-image" /></div></div>
              </Page>

              {/* PAGE 4: MESSAGE 2 */}
              <Page>
                <div className="page-text">
                  <h3>Here is the beautiful truth about you:</h3>
                  <p>You pour out kindness so naturally, making it look entirely effortless. When you listen, you do it with your whole soul, making those around you feel truly seen and deeply understood.</p>
                  <p>And your laugh is pure magic, a contagious joy that brings light to everyone lucky enough to hear it. But your rarest, most wonderful gift is the comfort you offer just by being yourself. You have this incredible ability to make every single room you walk into feel safe, warm, and instantly like home.</p>
                </div>
              </Page>

              {/* PAGE 5: PHOTO 2 */}
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo2.jpg" alt="Memory 2" className="inner-image" /></div></div>
              </Page>

              {/* PAGE 6: MESSAGE 3 */}
              <Page>
                <div className="page-text">
                  <h3>For the beautiful year ahead,</h3>
                  <p>My greatest wish is that your world is filled with as much joy as you give to others. May you find countless new reasons to laugh until your cheeks ache with happiness.</p>
                  <p>I hope you discover even more spaces that wrap around you and offer the warm, safe comfort of home. Most of all, I wish you a year of bright, beautiful mornings that fill your soul with so much excitement, you simply can't wait to wake up and begin the day.</p>
                </div>
              </Page>

              {/* PAGE 7: PHOTO 3 */}
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo3.jpg" alt="Memory 3" className="inner-image" /></div></div>
              </Page>

              {/* PAGE 8: MESSAGE 4 (The Finale) */}
              <Page>
                <div className="page-text">
                  <h3>One last thing...</h3>
                  <p>Thank you for being exactly who you are. The world is infinitely brighter, way funnier, and so much more beautiful with you in it. I am so incredibly grateful that God crossed our paths and placed you in my life.</p>
                  <p>You might not be my biological sister, but you are absolutely a sister to me. Walking through life with you, sharing our faith, praying for one another, having those wonderful long talks, and cracking up at the most random things, is one of my greatest blessings.</p>
                  <p style={{ marginTop: '10px', color: '#71364f', fontWeight: '600', fontStyle: 'italic' }}>
                    Have the most amazing birthday, because you deserve every bit of it!<br/><br/>
                    With so much love and blessings,<br/>
                    Gabvox
                  </p>
                </div>
              </Page>

              {/* PAGE 9: PHOTO 4 */}
              <Page>
                <div className="photo-page"><div className="photo-frame"><img src="./assets/images/photo4.jpg" alt="Memory 4" className="inner-image" /></div></div>
              </Page>

              {/* PAGE 10: BACK COVER */}
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