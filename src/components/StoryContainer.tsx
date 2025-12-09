import { useState } from 'react';
import './StoryContainer.css';

interface StoryContainerProps {
    slides: React.ReactNode[];
}

export function StoryContainer({ slides }: StoryContainerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [isPaused, setIsPaused] = useState(false);

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Handle tap regions
    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        const width = window.innerWidth;
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

        if (x < width / 3) {
            prevSlide();
        } else {
            nextSlide();
        }
    };

    // Progress bar auto-advance (optional, maybe just stick to manual for now or long duration)
    // For "Wrapped" feel, usually it auto-advances. Let's add that later or keep it manual for better reviewability first.

    return (
        <div className="story-container" onClick={handleTap}>
            <div className="progress-bars">
                {slides.map((_, index) => (
                    <div key={index} className="progress-bar-bg">
                        <div
                            className={`progress-bar-fill ${index < currentIndex ? 'filled' : ''} ${index === currentIndex ? 'active' : ''}`}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="slide-content">
                {slides[currentIndex]}
            </div>
        </div>
    );
}
