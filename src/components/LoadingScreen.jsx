import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import SVGs
import soccerIcon from '../assets/loading/noun-soccer-7017110-FFFFFF.svg';
import cleatsIcon from '../assets/loading/noun-soccer-cleats-1501080-FFFFFF.svg';
import stadiumIcon from '../assets/loading/noun-stadium-1501053-FFFFFF.svg';
import cupIcon from '../assets/loading/noun-world-cup-1867221-FFFFFF.svg';

const loadingIcons = [soccerIcon, cleatsIcon, stadiumIcon, cupIcon];

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
        if (index >= 0 && index < loadingIcons.length) {
            // 2s total duration for each icon (fade in -> display -> fade out)
            const nextTimeout = setTimeout(() => {
                if (index === loadingIcons.length - 1) {
                    // Final 0.5s pause after last icon
                    setTimeout(() => {
                        onComplete();
                    }, 500);
                    setIndex(loadingIcons.length); // Out of bounds to clear screen
                } else {
                    setIndex(prev => prev + 1);
                }
            }, 2000);

            return () => clearTimeout(nextTimeout);
        }
    }, [index, onComplete]);

    return (
        <div className="loading-container">
            <AnimatePresence mode="wait">
                {index >= 0 && index < loadingIcons.length && (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="loading-icon-wrapper"
                    >
                        <img
                            src={loadingIcons[index]}
                            alt="Loading..."
                            className="loading-svg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoadingScreen;
