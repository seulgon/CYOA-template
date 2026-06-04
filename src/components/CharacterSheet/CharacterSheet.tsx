import type React from 'react';
import Background from '../common/Background/Background';
import StatBreakdownModal from '../common/StatBreakdownModal';
import CharacterActions from './CharacterActions';
import CharacterChoices from './CharacterChoices';
import CharacterInventory from './CharacterInventory';
import CharacterProfile from './CharacterProfile';
import CharacterStats from './CharacterStats';
import { useCharacterSheet } from './useCharacterSheet';
import type { CharacterSheetProps } from './useCharacterSheet';
import './CharacterSheet.css';

const CharacterSheet: React.FC<CharacterSheetProps> = (props) => {
    const {
        characterData,
        characterName,
        isCollapsed,
        setIsCollapsed,
        breakdownStat,
        setBreakdownStat,
        isCapturing,
        sheetCaptureRef,
        stats,
        inventory,
        tags,
        choiceIds,
        selectedClassEntries,
        finalStats,
        derivedSkillSet,
        skillEntries,
        selectedChoicesGrouped,
        maxHP,
        maxMP,
        gold,
        handleBack,
        handleConfirmBuild,
        handleSave,
        handleExport,
        handleCaptureSheet,
        profileImage,
        handleProfileImageChange
    } = useCharacterSheet(props);

    return (
        <div className="character-sheet-container">
            <Background />
            <div className="character-sheet-capture-surface" ref={sheetCaptureRef}>
                <CharacterProfile
                    characterName={characterName}
                    epithet={characterData.epithet}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    maxHP={maxHP}
                    maxMP={maxMP}
                    gold={gold}
                    setBreakdownStat={setBreakdownStat}
                    profileImage={profileImage}
                    onProfileImageChange={handleProfileImageChange}
                />

                {!isCollapsed && (
                    <div className="animate-fade-in">
                        <CharacterStats
                            stats={stats}
                            maxHP={maxHP}
                            maxMP={maxMP}
                            gold={gold}
                            setBreakdownStat={setBreakdownStat}
                        />
                        <CharacterInventory
                            selectedClassEntries={selectedClassEntries}
                            derivedSkillSet={derivedSkillSet}
                            skillEntries={skillEntries}
                            tags={tags}
                        />
                        <CharacterChoices selectedChoicesGrouped={selectedChoicesGrouped} />
                        <CharacterActions
                            isCapturing={isCapturing}
                            handleBack={handleBack}
                            handleConfirmBuild={handleConfirmBuild}
                            handleSave={handleSave}
                            handleExport={handleExport}
                            handleCaptureSheet={handleCaptureSheet}
                        />
                    </div>
                )}
            </div>

            {breakdownStat && (
                <StatBreakdownModal
                    variant="sheet"
                    statKey={breakdownStat}
                    stats={stats}
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
                    choiceIds={choiceIds}
                    onClose={() => setBreakdownStat(null)}
                />
            )}
        </div>
    );
};

export default CharacterSheet;
