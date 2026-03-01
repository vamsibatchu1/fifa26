import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import SVGs
import soccerIcon from '../assets/loading/noun-soccer-7017110-FFFFFF.svg';
import cleatsIcon from '../assets/loading/noun-soccer-cleats-1501080-FFFFFF.svg';
import stadiumIcon from '../assets/loading/noun-stadium-1501053-FFFFFF.svg';
import cupIcon from '../assets/loading/noun-world-cup-1867221-FFFFFF.svg';

const loadingData = [
    { icon: stadiumIcon, text: "preparing the stage", type: 'vignette' },
    { icon: soccerIcon, text: "setting up the pitch", type: 'vignette' },
    { icon: cleatsIcon, text: "lacing up the cleats", type: 'vignette' },
    { icon: cupIcon, text: "dreaming the world cup", type: 'vignette' }
];

const LoadingScreen = ({ onComplete, qualifiedTeams }) => {
    const [vignetteIndex, setVignetteIndex] = useState(-1);
    const [flagIndex, setFlagIndex] = useState(-1);

    useEffect(() => {
        // Initial delay before vignettes
        const initialDelay = setTimeout(() => {
            setVignetteIndex(0);
        }, 500);
        return () => clearTimeout(initialDelay);
    }, []);

    // Handle Vignette Sequence
    useEffect(() => {
        if (vignetteIndex >= 0 && vignetteIndex < loadingData.length) {
            const vignetteTimeout = setTimeout(() => {
                if (vignetteIndex === loadingData.length - 1) {
                    // Finish vignettes, start flags immediately
                    setVignetteIndex(loadingData.length);
                    setFlagIndex(0);
                } else {
                    setVignetteIndex(prev => prev + 1);
                }
            }, 1000);
            return () => clearTimeout(vignetteTimeout);
        }
    }, [vignetteIndex]);

    // Handle Flag Sequence (Rapid-fire 0.1s each)
    useEffect(() => {
        if (flagIndex >= 0 && flagIndex < qualifiedTeams.length) {
            const flagTimeout = setTimeout(() => {
                if (flagIndex === qualifiedTeams.length - 1) {
                    onComplete();
                } else {
                    setFlagIndex(prev => prev + 1);
                }
            }, 100);
            return () => clearTimeout(flagTimeout);
        }
    }, [flagIndex, onComplete, qualifiedTeams]);

    return (
        <div className="loading-container">
            {/* Phase 1: Vignettes with Smooth Transitons */}
            <AnimatePresence mode="wait">
                {vignetteIndex >= 0 && vignetteIndex < loadingData.length && (
                    <motion.div
                        key={`vignette-${vignetteIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="loading-icon-wrapper"
                        style={{ flexDirection: 'column' }}
                    >
                        <img
                            src={loadingData[vignetteIndex].icon}
                            alt="Loading..."
                            className="loading-svg"
                        />
                        <p style={{
                            marginTop: '32px',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-newsreader)',
                            fontSize: '1.5rem',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            textAlign: 'center'
                        }}>
                            {loadingData[vignetteIndex].text}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phase 2: Rapid-fire Flags (No AnimatePresence for speed) */}
            {flagIndex >= 0 && flagIndex < qualifiedTeams.length && (
                <div
                    className="loading-icon-wrapper"
                    style={{ flexDirection: 'column' }}
                >
                    <img
                        src={`https://flagcdn.com/w320/${qualifiedTeams[flagIndex].code}.png`}
                        alt={qualifiedTeams[flagIndex].name}
                        className="loading-svg"
                        style={{ width: '320px', borderRadius: '4px', transition: 'none' }}
                    />
                </div>
            )}
        </div>
    );
};

export default LoadingScreen;
