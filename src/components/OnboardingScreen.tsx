import { useState } from 'react';
import type { TradingYear } from '../data/mockData';
import { parseCSV } from '../utils/csvParser';
import '../components/slides/Slides.css';

interface OnboardingScreenProps {
    onDataLoaded: (data: TradingYear) => void;
    onDemoMode: () => void;
}

export function OnboardingScreen({ onDataLoaded, onDemoMode }: OnboardingScreenProps) {
    const [file, setFile] = useState<File | null>(null);
    const [currentValue, setCurrentValue] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please upload a CSV file.');
            return;
        }
        if (!currentValue) {
            setError('Please enter your current portfolio value (needed for P&L).');
            return;
        }

        setLoading(true);
        try {
            const data = await parseCSV(file, parseFloat(currentValue));
            onDataLoaded(data);
        } catch (err) {
            console.error(err);
            setError('Failed to parse CSV. Make sure it is a valid Robinhood export.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="slide" style={{ justifyContent: 'flex-start', paddingTop: '4rem', overflowY: 'auto' }}>
            <h1 className="slide-title animate-up">Robinhood Wrapped</h1>

            <div className="animate-up" style={{ animationDelay: '0.1s', marginBottom: '2rem' }}>
                <p style={{ color: '#888', marginBottom: '1rem' }}>
                    See your 2025 trading year in review.
                </p>

                <button
                    onClick={onDemoMode}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--rh-green)',
                        color: 'var(--rh-green)',
                        padding: '0.8rem 2rem',
                        borderRadius: '24px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Try Demo Mode
                </button>
            </div>

            <div className="summary-card animate-up" style={{
                background: 'var(--rh-dark-gray)',
                padding: '1.5rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                animationDelay: '0.2s',
                textAlign: 'left'
            }}>
                <h3 style={{ marginBottom: '1rem' }}>Analyze Real Data</h3>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    1. Current Portfolio Value ($) *
                </label>
                <input
                    type="number"
                    placeholder="e.g. 12500.50"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #444',
                        background: '#222',
                        color: 'white',
                        marginBottom: '1rem',
                        fontSize: '1rem'
                    }}
                />

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    2. Robinhood CSV Export *
                </label>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{
                        width: '100%',
                        marginBottom: '1.5rem',
                        color: '#ccc'
                    }}
                />

                {error && (
                    <div style={{ color: '#ff5a5f', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    style={{
                        width: '100%',
                        background: 'var(--rh-green)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '24px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: loading ? 'wait' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Analyzing...' : 'Generate Wrapped'}
                </button>
            </div>

            <div className="animate-up" style={{ marginTop: '2rem', animationDelay: '0.3s', fontSize: '0.8rem', color: '#666', maxWidth: '300px' }}>
                <p><strong>How to export:</strong></p>
                <div style={{ margin: '0.5rem 0' }}>
                    <a
                        href="https://robinhood.com/account/reports-statements/activity-reports"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--rh-green)', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Go to Robinhood Reports ↗
                    </a>
                </div>
                <p>Documents &gt; Reports &gt; Generate new report</p>
                <p style={{ marginTop: '0.5rem' }}>Your data is processed locally in your browser and is never uploaded to any server.</p>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem', color: '#888' }}>
                        ⏳ Export taking forever? (It can take 2-3 hours)
                    </p>
                    <a
                        href="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#1DB954',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            marginTop: '0.5rem'
                        }}
                    >
                        <span>🎧 Jam to this "Hustle" playlist while you wait</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

