import type { TradingYear } from '../../data/mockData';
import './Slides.css';

interface SummarySlideProps {
    data: TradingYear;
}

export function SummarySlide({ data }: SummarySlideProps) {
    return (
        <div className="slide" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>
            <h2 className="slide-title animate-up">2025 Summary</h2>

            <div className="summary-card animate-up" style={{
                background: 'var(--rh-dark-gray)',
                padding: '2rem',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '350px',
                animationDelay: '0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                marginTop: '1rem'
            }}>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>Net P&L</span>
                    <span style={{ color: 'var(--rh-green)', fontWeight: 'bold' }}>+${data.netPnL.toLocaleString()}</span>
                </div>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>Top Stock</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{data.topStock.symbol}</span>
                </div>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>Total Trades</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{data.totalTrades}</span>
                </div>
                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#aaa' }}>Archetype</span>
                    <span style={{ color: '#ffcc00', fontWeight: 'bold' }}>{data.archetype}</span>
                </div>
            </div>

            <button className="animate-up" style={{
                marginTop: '3rem',
                padding: '1rem 3rem',
                borderRadius: '30px',
                background: 'white',
                color: 'black',
                fontWeight: 'bold',
                border: 'none',
                fontSize: '1.2rem',
                animationDelay: '0.4s',
                cursor: 'pointer'
            }}>
                Share
            </button>
        </div>
    );
}
