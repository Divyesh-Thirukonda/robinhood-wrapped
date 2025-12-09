import './Slides.css';

interface ArchetypeSlideProps {
    archetype: string;
}

export function ArchetypeSlide({ archetype }: ArchetypeSlideProps) {
    return (
        <div className="slide">
            <h2 className="slide-title animate-up">Your Trading Style</h2>

            <div className="animate-up" style={{ fontSize: '6rem', margin: '2rem 0', animationDelay: '0.2s' }}>
                💎🙌
            </div>

            <div className="big-stat animate-up" style={{ animationDelay: '0.4s', fontSize: '2.5rem' }}>
                {archetype}
            </div>

            <p className="stat-label animate-up" style={{ animationDelay: '0.5s', maxWidth: '80%' }}>
                You held through the dips and rode the rips. True conviction.
            </p>
        </div>
    );
}
