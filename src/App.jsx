import React, { useState } from 'react';
import { Award, Stamp, IdCard, Shirt, Settings, Play, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';
import soccerSvg from './assets/soccer.svg';
import LoadingScreen from './components/LoadingScreen';

const itemTypes = [
  { id: 'badge', label: 'Badge', icon: Award },
  { id: 'stamp', label: 'Stamp', icon: Stamp },
  { id: 'player_card', label: 'Card', icon: IdCard },
  { id: 'memorabilia', label: 'Gear', icon: Shirt }
];

const qualifiedTeams = [
  // AFC (8)
  { name: 'Australia', code: 'au' }, { name: 'Iran', code: 'ir' }, { name: 'Japan', code: 'jp' }, { name: 'Jordan', code: 'jo' },
  { name: 'Qatar', code: 'qa' }, { name: 'Saudi Arabia', code: 'sa' }, { name: 'South Korea', code: 'kr' }, { name: 'Uzbekistan', code: 'uz' },
  // CAF (10)
  { name: 'Algeria', code: 'dz' }, { name: 'Cape Verde', code: 'cv' }, { name: 'Egypt', code: 'eg' }, { name: 'Ghana', code: 'gh' },
  { name: 'Ivory Coast', code: 'ci' }, { name: 'Morocco', code: 'ma' }, { name: 'Senegal', code: 'sn' }, { name: 'South Africa', code: 'za' },
  { name: 'Tunisia', code: 'tn' }, { name: 'Nigeria', code: 'ng' },
  // CONCACAF (6)
  { name: 'Canada', code: 'ca' }, { name: 'Curaçao', code: 'cw' }, { name: 'Haiti', code: 'ht' }, { name: 'Mexico', code: 'mx' },
  { name: 'Panama', code: 'pa' }, { name: 'United States', code: 'us' },
  // CONMEBOL (7)
  { name: 'Argentina', code: 'ar' }, { name: 'Brazil', code: 'br' }, { name: 'Colombia', code: 'co' }, { name: 'Ecuador', code: 'ec' },
  { name: 'Paraguay', code: 'py' }, { name: 'Uruguay', code: 'uy' }, { name: 'Chile', code: 'cl' },
  // OFC (1)
  { name: 'New Zealand', code: 'nz' },
  // UEFA (16)
  { name: 'Austria', code: 'at' }, { name: 'Belgium', code: 'be' }, { name: 'Croatia', code: 'hr' }, { name: 'England', code: 'gb-eng' },
  { name: 'France', code: 'fr' }, { name: 'Germany', code: 'de' }, { name: 'Netherlands', code: 'nl' }, { name: 'Norway', code: 'no' },
  { name: 'Portugal', code: 'pt' }, { name: 'Scotland', code: 'gb-sct' }, { name: 'Spain', code: 'es' }, { name: 'Switzerland', code: 'ch' },
  { name: 'Poland', code: 'pl' }, { name: 'Italy', code: 'it' }, { name: 'Denmark', code: 'dk' }, { name: 'Turkey', code: 'tr' }
];

function App() {
  const [formData, setFormData] = useState({
    itemType: 'badge',
    country: '',
    name: '',
    jerseyNumber: '',
    favoritePlayer: '',
    quotes: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSelect = (id) => {
    setFormData((prev) => ({ ...prev, itemType: id }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt_data: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.status === 'success') {
        setResult({
          status: 'success',
          image: data.image,
          prompt_data: formData,
          message: data.message
        });
      } else {
        throw new Error(data.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setResult({
        status: 'error',
        prompt_data: formData,
        message: 'Forging sequence failed: ' + error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="main-layout"
            style={{ zIndex: 10, marginTop: '2rem' }}
          >
            {/* Column 1: Header & App Info */}
            <section className="glass-panel" style={{ height: 'fit-content' }}>
              <header className="header">
                <h1>FIFA Memorabilia<br />& Studio</h1>
              </header>

              <div style={{ padding: '0' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '12px', fontWeight: 500 }}>
                  Welcome to the definitive generative studio designed to materialize your digital football legacy.
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Select a format, configure your specifications, and press execute to run the AI engine. Your bespoke stamp, badge, card, or gear will be instantly manufactured using ultra-premium geometric and typographical styling matching this exact architectural forge aesthetic.
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '3rem', display: 'flex', justifyContent: 'flex-start', paddingLeft: '0.5rem', opacity: 0.8 }}>
                <img src={soccerSvg} alt="Football Field Schematic" style={{ width: '100%', maxWidth: '300px', filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))' }} />
              </div>
            </section>

            {/* Column 2: Configuration Panel */}
            <section className="glass-panel">
              <form onSubmit={handleGenerate} className="form-group" style={{ gap: '2rem' }}>
                <div className="form-group">
                  <div className="selection-grid">
                    {itemTypes.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className={`selection-card ${formData.itemType === item.id ? 'active' : ''}`}
                          onClick={() => handleItemSelect(item.id)}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                          <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nation</label>
                  <div className="nation-grid">
                    {qualifiedTeams.map((team) => (
                      <button
                        key={team.code}
                        type="button"
                        className={`nation-btn ${formData.country === team.name ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, country: team.name }))}
                        title={team.name}
                      >
                        <img
                          src={`https://flagcdn.com/w80/${team.code}.png`}
                          alt={team.name}
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="name">Moniker</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Provide your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="jerseyNumber">Jersey Number</label>
                    <input
                      type="number"
                      id="jerseyNumber"
                      name="jerseyNumber"
                      className="form-input"
                      placeholder="10"
                      value={formData.jerseyNumber}
                      onChange={handleInputChange}
                      min="0"
                      max="99"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="favoritePlayer">Legend</label>
                    <input
                      type="text"
                      id="favoritePlayer"
                      name="favoritePlayer"
                      className="form-input"
                      placeholder="Zidane"
                      value={formData.favoritePlayer}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="quotes">Inscription</label>
                  <input
                    type="text"
                    id="quotes"
                    name="quotes"
                    className="form-input"
                    placeholder="Your legacy here..."
                    value={formData.quotes}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={isGenerating}>
                  <Play size={16} fill="currentColor" style={{ marginRight: '8px' }} />
                  {isGenerating ? 'Processing' : 'Execute'}
                </button>
              </form>
            </section>

            {/* Right Panel: Result Preview */}
            <section className="glass-panel result-panel" style={{ border: 'none' }}>
              {isGenerating && (
                <div className="loader-container">
                  <div className="spinner"></div>
                  <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Generating</h3>
                </div>
              )}

              {!isGenerating && !result && (
                <div className="result-placeholder">
                  <ImageIcon strokeWidth={1} size={48} />
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Awaiting Input</h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>Provide specifications to proceed.</p>
                  </div>
                </div>
              )}

              {!isGenerating && result && (
                <div className="result-display">
                  {result.image ? (
                    <div style={{ padding: '0 2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={result.image} alt="Generated Memorabilia" style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <>
                      <Award size={64} style={{ color: 'var(--accent-white)', marginBottom: '1.5rem' }} strokeWidth={1} />
                      <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>{result.status === 'error' ? 'Failure' : 'Generated'}</h3>
                      <p style={{ color: result.status === 'error' ? 'red' : 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', marginBottom: '2rem' }}>{result.message}</p>
                    </>
                  )}
                </div>
              )}
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
