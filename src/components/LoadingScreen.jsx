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
            {/* Standardized wrapper to anchor centering */}
            <div
                className="loading-icon-wrapper"
                style={{
                    flexDirection: 'column',
                    width: '320px',
                    minHeight: '400px',
                    position: 'relative',
                    textAlign: 'center'
                }}
            >
                {/* Image hosting area - fixed height to anchor vertical center */}
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                        {vignetteIndex >= 0 && vignetteIndex < loadingData.length && (
                            <motion.img
                                key={`vignette-${vignetteIndex}`}
                                src={loadingData[vignetteIndex].icon}
                                alt="Loading..."
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="loading-svg"
                                style={{ width: '250px', height: '250px', objectFit: 'contain', position: 'absolute' }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Flags Phase - outside AnimatePresence for speed, but inside the same anchor area */}
                    {flagIndex >= 0 && flagIndex < qualifiedTeams.length && (
                        <img
                            src={`https://flagcdn.com/w320/${qualifiedTeams[flagIndex].code}.png`}
                            alt={qualifiedTeams[flagIndex].name}
                            style={{
                                width: '320px',
                                height: '200px',
                                objectFit: 'contain',
                                borderRadius: '4px'
                            }}
                        />
                    )}
                </div>

                {/* Text Area - below image area */}
                <div style={{ height: '60px', marginTop: '32px' }}>
                    <AnimatePresence mode="wait">
                        {vignetteIndex >= 0 && vignetteIndex < loadingData.length && (
                            <motion.p
                                key={`text-${vignetteIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    color: 'var(--text-primary)',
                                    fontFamily: 'var(--font-newsreader)',
                                    fontSize: '1.5rem',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    margin: 0
                                }}
                            >
                                {loadingData[vignetteIndex].text}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
