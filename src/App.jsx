import React, { useState } from 'react';
import { Award, Stamp, IdCard, Shirt, Settings, Play, Image as ImageIcon } from 'lucide-react';
import './index.css';

const itemTypes = [
  { id: 'badge', label: 'Badge', icon: Award },
  { id: 'stamp', label: 'Stamp', icon: Stamp },
  { id: 'player_card', label: 'Card', icon: IdCard },
  { id: 'memorabilia', label: 'Gear', icon: Shirt }
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
      <main className="main-layout" style={{ zIndex: 10, marginTop: '2rem' }}>
        {/* Column 1: Header & App Info */}
        <section className="glass-panel" style={{ height: 'fit-content' }}>
          <header className="header">
            <h1>FIFA Memorabilia<br />& Studio</h1>
            <p>Interactive Forge</p>
          </header>

          <div style={{ padding: '0 0.5rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '1.5rem', fontWeight: 500 }}>
              Welcome to the definitive generative studio designed to materialize your digital football legacy.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Select a format, configure your specifications, and press execute to run the AI engine. Your bespoke stamp, badge, card, or gear will be instantly manufactured using ultra-premium geometric and typographical styling matching this exact architectural forge aesthetic.
            </p>
          </div>
        </section>

        {/* Column 2: Configuration Panel */}
        <section className="glass-panel">
          <h2 className="panel-header">
            Specifications
          </h2>

          <form onSubmit={handleGenerate} className="form-group" style={{ gap: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Format Type</label>
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
              <label className="form-label" htmlFor="country">Nation</label>
              <input
                type="text"
                id="country"
                name="country"
                className="form-input"
                placeholder="Ex: France, Argentina..."
                value={formData.country}
                onChange={handleInputChange}
                required
              />
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
                <label className="form-label" htmlFor="jerseyNumber">No.</label>
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
        <section className="glass-panel result-panel">
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
      </main>
    </div>
  );
}

export default App;
