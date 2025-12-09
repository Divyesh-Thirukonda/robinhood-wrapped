import { useState, useEffect } from 'react';
import type { TradingYear } from '../../data/mockData';
import './Slides.css';

interface AIAnalysisSlideProps {
    data: TradingYear;
}

export function AIAnalysisSlide({ data }: AIAnalysisSlideProps) {
    const [stage, setStage] = useState<'analyzing' | 'revealed'>('analyzing');
    const [text, setText] = useState('');

    const isPositive = data.netPnL >= 0;

    // Mock "AI" responses
    const roasts = [
        "I've seen better returns in a savings account. Honestly, just buy an index fund and go outside.",
        "Your portfolio graph looks like a rollercoaster that only goes down. Seek help.",
        "Did you choose these stocks by throwing darts? Because that would have probably worked better.",
        "Delete the app. No, seriously. Delete it now."
    ];

    const glazes = [
        "Okay, I see you! Buffett is shaking in his boots right now.",
        "Diamond hands paid off. You're basically the wolf of Wall Street, minus the fraud.",
        "This portfolio is artwork. Frame it. Hang it in the Louvre.",
        "You beat the S&P 500? Who are you, Nancy Pelosi?"
    ];

    const finalMessage = isPositive
        ? glazes[Math.floor(Math.random() * glazes.length)]
        : roasts[Math.floor(Math.random() * roasts.length)];

    useEffect(() => {
        // Simulate "typing" or analysis delay
        const timer = setTimeout(() => {
            setStage('revealed');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (stage === 'revealed') {
            let i = 0;
            const typeWriter = setInterval(() => {
                setText(finalMessage.slice(0, i));
                i++;
                if (i > finalMessage.length) clearInterval(typeWriter);
            }, 30);
            return () => clearInterval(typeWriter);
        }
    }, [stage, finalMessage]);

    return (
        <div className="slide">
            <h2 className="slide-title animate-up">AI Analysis</h2>

            <div className="animate-up" style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #00C805, #00ff00)',
                borderRadius: '50%',
                margin: '2rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                boxShadow: '0 0 20px rgba(0, 200, 5, 0.6)',
                animation: stage === 'analyzing' ? 'pulse 1.5s infinite' : 'none'
            }}>
                🤖
            </div>

            {stage === 'analyzing' ? (
                <div className="animate-up" style={{ color: '#888', fontStyle: 'italic' }}>
                    Scanning your questionable life choices...
                </div>
            ) : (
                <div className="animate-up" style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.6',
                    maxWidth: '90%',
                    minHeight: '100px',
                    textShadow: '0 0 10px rgba(255,255,255,0.2)'
                }}>
                    "{text}<span className="cursor">|</span>"
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 200, 5, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(0, 200, 5, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 200, 5, 0); }
        }
        .cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}
