import React, { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 1500, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Start fading out slightly before the 'duration' ends
        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false);
        }, duration - 300);

        // Call onClose after the full duration
        const removeTimer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [duration, onClose]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#4caf50';
            case 'warning': return '#ff9800';
            case 'error': return '#ef5350';
            case 'info': default: return '#2196f3';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: getBackgroundColor(),
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: isVisible ? 'slideDown 0.3s ease-out' : 'fadeOut 0.3s ease-out',
            fontWeight: 'bold',
            minWidth: '300px',
            justifyContent: 'center',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease-out'
        }}>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
