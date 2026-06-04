import type React from 'react';
import StatBreakdownModal from '../common/StatBreakdownModal';
import type { CYOABuilderViewModel } from './useCYOABuilder';

interface CYOAModalsProps {
    builder: CYOABuilderViewModel;
}

const CYOAModals: React.FC<CYOAModalsProps> = ({ builder }) => {
    const {
        breakdownStat,
        setBreakdownStat,
        selectedChoices,
        statAdjustments,
        currentStats,
        finalStats,
    } = builder;

    return (
        <>
            {breakdownStat && (
                <StatBreakdownModal
                    variant="builder"
                    statKey={breakdownStat}
                    stats={currentStats}
                    finalStats={finalStats}
                    equipped={{
                        mainHand: null,
                        offHand: null,
                        armor: null,
                        head: null,
                        waist: null,
                        feet: null,
                        back: null,
                        accessories: []
                    }}
                    choiceIds={Array.from(selectedChoices)}
                    statAdjustments={statAdjustments}
                    onClose={() => setBreakdownStat(null)}
                />
            )}
        </>
    );
};

export default CYOAModals;
