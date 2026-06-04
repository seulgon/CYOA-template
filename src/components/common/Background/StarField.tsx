import React, { useEffect, useState } from 'react';
import './StarField.css';

interface StarFieldProps {
    className?: string;
}

interface Star {
    id: number;
    top: string;
    left: string;
    size: number;
    delay: number;
    duration: number;
}

const StarField: React.FC<StarFieldProps> = ({ className }) => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 2,
        }));
        // eslint-disable-next-line
        setStars(generatedStars);
    }, []);

    return (
        <div className={`star-field ${className || ''}`}>
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default StarField;
