import './Slides.css';

interface PnLSlideProps {
    amount: number;
    percentage: number;
}

export function PnLSlide({ amount, percentage }: PnLSlideProps) {
    const isPositive = amount >= 0;
    const color = isPositive ? 'var(--rh-green)' : '#ff5a5f';

    return (
        <div className="slide">
            <h2 className="slide-title animate-up">Net P&L</h2>
            <div
                className="big-stat animate-up"
                style={{ color, animationDelay: '0.2s' }}
            >
                {isPositive ? '+' : ''}${Math.abs(amount).toLocaleString()}
            </div>
            <div
                className="slide-subtitle animate-up"
                style={{ color, animationDelay: '0.3s', fontWeight: 'bold' }}
            >
                {isPositive ? '▲' : '▼'} {percentage}% All Time
            </div>
            <p className="stat-label animate-up" style={{ animationDelay: '0.4s' }}>
                {isPositive ? "You crushed the market!" : "Oof. Better luck next year."}
            </p>
        </div>
    );
}
