import type React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface StatAdjustmentData {
    value: number;
    pointDelta: number;
    onDecrease: () => void;
    onIncrease: () => void;
}

interface StatAdjusterProps {
    statAdjustment: StatAdjustmentData;
}

const StatAdjuster: React.FC<StatAdjusterProps> = ({ statAdjustment }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '0.8rem',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '4px 8px' }}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    statAdjustment.onDecrease();
                }}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    lineHeight: 1,
                    transition: 'color 0.1s, filter 0.1s',
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
            >
                <Minus size={22} strokeWidth={2.5} />
            </button>
            <span style={{
                width: '3rem',
                textAlign: 'center',
                color: 'var(--text-primary)',
                fontWeight: '700',
                fontSize: '1.2rem',
                fontFamily: 'monospace'
            }}>
                {statAdjustment.value}
            </span>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    statAdjustment.onIncrease();
                }}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    lineHeight: 1,
                    transition: 'color 0.1s, filter 0.1s',
                }}
                onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLButtonElement).style.filter = 'none'; }}
            >
                <Plus size={22} strokeWidth={2.5} />
            </button>
        </div>
    </div>
);

export default StatAdjuster;
