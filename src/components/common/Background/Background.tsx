import React from 'react';
import './Background.css';
import StarField from './StarField';

interface BackgroundProps {
    backgroundImage?: string | null;
    showStars?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ backgroundImage, showStars }) => {
    // 배경 이미지가 없으면 기본값으로 별을 켜고, 명시적으로 제어되면 그 값을 따름
    // 하지만 모험 파트에서 이미지가 있으면 별을 끄고 싶어함.
    // showStars가 undefined면: image 있으면 false, 없으면 true
    const shouldShowStars = showStars !== undefined ? showStars : !backgroundImage;

    return (
        <div className="background-fixed-container">
            <div className="background-gradient" />
            
            {shouldShowStars && <StarField />}

            {backgroundImage && (
                <div 
                    className="background-image-layer"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}
            
            <div className="background-vignette" />
        </div>
    );
};

export default Background;
