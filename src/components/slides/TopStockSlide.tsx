import type { Stock } from '../../data/mockData';
import './Slides.css';

interface TopStockSlideProps {
    stock: Stock;
}

export function TopStockSlide({ stock }: TopStockSlideProps) {
    return (
        <div className="slide">
            <h2 className="slide-title animate-up">Your Top Mover</h2>

            <div className="animate-up" style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: stock.logo,
                margin: '2rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                animationDelay: '0.2s',
                boxShadow: `0 0 30px ${stock.logo}80`
            }}>
                {stock.symbol[0]}
            </div>

            <div className="big-stat animate-up" style={{ animationDelay: '0.3s', fontSize: '3rem' }}>
                {stock.symbol}
            </div>

            <div className="slide-subtitle animate-up" style={{ color: 'var(--rh-green)', animationDelay: '0.4s' }}>
                +{stock.gain}% Gain
            </div>

            <p className="stat-label animate-up" style={{ animationDelay: '0.5s' }}>
                {stock.name} was you best friend this year.
            </p>
        </div>
    );
}
