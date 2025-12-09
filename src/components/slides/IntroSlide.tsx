import './Slides.css';

export function IntroSlide() {
    return (
        <div className="slide">
            <h1 className="slide-title animate-up" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                Your 2025 <br />
                <span style={{ color: 'var(--rh-green)', WebkitTextFillColor: 'var(--rh-green)' }}>Wrapped</span>
            </h1>
            <p className="slide-subtitle animate-up" style={{ animationDelay: '0.2s' }}>
                It's been a wild ride. <br /> Let's see how you did.
            </p>
            <div className="animate-up" style={{ animationDelay: '0.4s', fontSize: '4rem' }}>
                🚀
            </div>
        </div>
    );
}
