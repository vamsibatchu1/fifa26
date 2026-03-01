import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import SVGs
import soccerIcon from '../assets/loading/noun-soccer-7017110-FFFFFF.svg';
import cleatsIcon from '../assets/loading/noun-soccer-cleats-1501080-FFFFFF.svg';
import stadiumIcon from '../assets/loading/noun-stadium-1501053-FFFFFF.svg';
import cupIcon from '../assets/loading/noun-world-cup-1867221-FFFFFF.svg';

const loadingData = [
    { icon: stadiumIcon, text: "PREPARING THE STAGE" },
    { icon: soccerIcon, text: "SETTING UP THE PITCH" },
    { icon: cleatsIcon, text: "LACING UP THE CLEATS" },
    { icon: cupIcon, text: "DREAMING THE WORLD CUP" }
];

const LoadingScreen = ({ onComplete }) => {
    const [index, setIndex] = useState(-1); // Start with -1 for initial 0.5s delay

    useEffect(() => {
        // Initial 0.5s pause
        const startTimeout = setTimeout(() => {
            setIndex(0);
        }, 500);

        return () => clearTimeout(startTimeout);
    }, []);

    useEffect(() => {
        if (index >= 0 && index < loadingData.length) {
            // 1s duration for each icon
            const nextTimeout = setTimeout(() => {
                if (index === loadingData.length - 1) {
                    // Final 0.5s pause after last icon
                    setTimeout(() => {
                        onComplete();
                    }, 500);
                    setIndex(loadingData.length); // Out of bounds to clear screen
                } else {
                    setIndex(prev => prev + 1);
                }
            }, 1000);

            return () => clearTimeout(nextTimeout);
        }
    }, [index, onComplete]);

    return (
        <div className="loading-container">
            <AnimatePresence mode="wait">
                {index >= 0 && index < loadingData.length && (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="loading-icon-wrapper"
                        style={{ flexDirection: 'column' }}
                    >
                        <img
                            src={loadingData[index].icon}
                            alt="Loading..."
                            className="loading-svg"
                        />
                        <p style={{
                            marginTop: '32px',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1rem',
                            letterSpacing: '0.4em',
                            fontWeight: 600,
                            textAlign: 'center',
                            textTransform: 'uppercase'
                        }}>
                            {loadingData[index].text}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoadingScreen;
