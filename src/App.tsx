import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import './App.css';
import Intro from './components/Intro/Intro';
import Toast, { type ToastType } from './components/common/Toast';
import { loadCharacter } from './utils/saveUtils';
import type { SaveData } from './utils/saveUtils';
import { generateEpithet } from './utils/epithetUtils';
import { CUTSCENE_DATA } from './data/cutscenes/cutsceneData';
import { useImagePreloader } from './hooks/useImagePreloader';
import { useAudioStore } from './hooks/useAudioStore';
import BGMButton from './components/common/BGMButton';

// Lazy-loaded 컴포넌트 (코드 분할)
const WorldSetup = lazy(() => import('./components/WorldSetup/WorldSetup'));
const StoryScreen = lazy(() => import('./components/Story/StoryScreen'));
const VioletDeckCYOA = lazy(() => import('./components/VioletDeckCYOA/VioletDeckCYOA'));
const CharacterSheet = lazy(() => import('./components/CharacterSheet/CharacterSheet'));
const RewardSelect = lazy(() => import('./components/RewardSelect/RewardSelect'));
const NarratorSelect = lazy(() => import('./components/NarratorSelect/NarratorSelect'));

// 로딩 화면
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--bg-primary, #0a0a1a)',
    color: 'var(--text-secondary, #888)',
    fontSize: '1.1rem',
    gap: '0.5rem',
  }}>
    <span style={{
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: 'var(--accent-color, #ebc050)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    불러오는 중...
  </div>
);
type GamePhase = 'INTRO' | 'PROLOGUE_STORY' | 'NARRATOR_SELECT' | 'INTRO_STORY' | 'WORLD_SETUP' | 'CYOA_STORY' | 'CYOA_BUILD' | 'REWARD_STORY' | 'REWARD_SELECT' | 'CHARACTER_SHEET' | 'LOCATION_CUTSCENE';

const createDevCharacterData = () => ({
  name: '개발자',
  epithet: '화면을 넘나드는 자',
  choices: [],
  points: 0,
  stats: { POW: 0, SEN: 0, INT: 0, CON: 0, WIL: 0, CHA: 0, LUK: 0, Gold: 0 },
  tags: [],
  items: [],
  skillSet: [],
  equipped: {
    mainHand: null,
    offHand: null,
    armor: null,
    head: null,
    waist: null,
    feet: null,
    back: null,
    accessories: []
  },
  worldSetup: {
    name: '개발자',
    points: 0,
    choices: [],
    tags: []
  }
});

function App() {
  const [phase, setPhase] = useState<GamePhase>('INTRO');
  const preloadState = useImagePreloader(phase);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [characterData, setCharacterData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldSetupResults, setWorldSetupResults] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rewardSelectResults, setRewardSelectResults] = useState<any>(null);
  // 스토리 대화 선택지에서 수집된 태그
  const [dialogueTags, setDialogueTags] = useState<string[]>([]);
  const [selectedNarrator, setSelectedNarrator] = useState<string>('angel');

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: ToastType } | null>(null);

  const showNotification = useCallback((message: string, type: ToastType = 'info') => {
    setNotification({ message, type });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Scroll to top when phase changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase]);

  // Handle BGM changes based on phase
  const playBGM = useAudioStore(state => state.playBGM);
  useEffect(() => {
    // INTRO phase music is now triggered by the "Accept" button in Intro.tsx
    if (phase === 'INTRO') return;

    if (phase === 'PROLOGUE_STORY' || phase === 'NARRATOR_SELECT' || phase === 'INTRO_STORY' || phase === 'WORLD_SETUP' || phase === 'CYOA_STORY' || phase === 'REWARD_STORY' || phase === 'REWARD_SELECT') {
      playBGM('intro');
    } else if (phase === 'CYOA_BUILD') {
      playBGM('cyoa');
    } else if (phase === 'CHARACTER_SHEET' || phase === 'LOCATION_CUTSCENE') {
      playBGM('sheet');
    }
  }, [phase, playBGM]);

  const handleStartGame = () => {
    setPhase('PROLOGUE_STORY');
  };

  const handlePrologueComplete = () => {
    setPhase('NARRATOR_SELECT');
  };

  const handleNarratorSelectComplete = (narratorId: string) => {
    setSelectedNarrator(narratorId);
    setPhase('INTRO_STORY');
  };

  const handleIntroStoryComplete = (result?: { value?: string; tags?: string[] }) => {
    if (result?.tags && result.tags.length > 0) {
      setDialogueTags(prev => [...prev, ...result.tags!]);
    }
    // "decline"을 선택한 경우 타이틀 화면으로 복귀
    if (result?.value === 'decline') {
      setPhase('INTRO');
      return;
    }
    setPhase('WORLD_SETUP');
  };

  const handleCYOAStoryComplete = (result?: { value?: string; tags?: string[] }) => {
    if (result?.tags && result.tags.length > 0) {
      setDialogueTags(prev => [...prev, ...result.tags!]);
    }
    setPhase('CYOA_BUILD');
  };


  const handleWorldSetupComplete = (data: { name: string; points: number; choices: string[]; tags: string[]; rawSelections: Record<string, string>; lastStep: number }) => {
    setWorldSetupResults(data);
    setPhase('CYOA_STORY');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCYOAComplete = (data: { choices: string[]; points: number; stats: any; tags: string[]; items: string[]; skillSet: string[]; equipped: { mainHand: string | null; offHand: string | null; armor: string | null; head: string | null; waist: string | null; feet: string | null; back: string | null; accessories: string[] } }) => {
    // Generate dynamic epithet based on world setup choices
    const epithet = generateEpithet(worldSetupResults?.choices || []);

    // Combine world setup data with character data, ensuring name is preserved
    const finalCharacter = {
      ...data,
      name: worldSetupResults?.name || '쵸붕이',
      epithet: epithet,
      worldSetup: worldSetupResults
    };
    setCharacterData(finalCharacter);
    setPhase('REWARD_STORY');
  };

  const handleRewardStoryComplete = (result?: { value?: string; tags?: string[] }) => {
    if (result?.tags && result.tags.length > 0) {
      setDialogueTags(prev => [...prev, ...result.tags!]);
    }
    setPhase('REWARD_SELECT');
  };

  const handleRewardSelectComplete = (data: { name: string; points: number; choices: string[]; tags: string[]; rawSelections: Record<string, string>; lastStep: number }) => {
    setRewardSelectResults(data);
    setCharacterData({
      ...characterData,
      rewardSelect: data,
    });
    setPhase('LOCATION_CUTSCENE');
  };

  const handleBackToRewardSelect = () => {
    setPhase('REWARD_SELECT');
  };

  const handleBackToWorldSetup = () => {
    setPhase('WORLD_SETUP');
  };

  const handleConfirmBuild = () => {
    setPhase('INTRO');
  };

  const handleLocationCutsceneComplete = () => {
    setPhase('CHARACTER_SHEET');
  };

  const handleLoadCharacter = () => {
    const saveData = loadCharacter();
    if (saveData) {
      setCharacterData({ ...saveData.characterData, name: saveData.characterName });
      setWorldSetupResults(saveData.characterData.worldSetup || null);
      setPhase('CHARACTER_SHEET');
    }
  };

  const handleImportCharacter = (saveData: SaveData) => {
    setCharacterData({ ...saveData.characterData, name: saveData.characterName });
    setWorldSetupResults(saveData.characterData.worldSetup || null);
    setPhase('CHARACTER_SHEET');
  };

  const handleDevNavigate = (targetPhase: string) => {
    const validPhases: GamePhase[] = [
      'INTRO',
      'PROLOGUE_STORY',
      'NARRATOR_SELECT',
      'INTRO_STORY',
      'WORLD_SETUP',
      'CYOA_STORY',
      'CYOA_BUILD',
      'REWARD_STORY',
      'REWARD_SELECT',
      'CHARACTER_SHEET',
      'LOCATION_CUTSCENE'
    ];
    if (!validPhases.includes(targetPhase as GamePhase)) return;

    const devCharacter = createDevCharacterData();

    setWorldSetupResults(devCharacter.worldSetup);
    if (targetPhase === 'REWARD_STORY' || targetPhase === 'REWARD_SELECT' || targetPhase === 'CHARACTER_SHEET' || targetPhase === 'LOCATION_CUTSCENE') {
      setCharacterData(devCharacter);
    }
    setPhase(targetPhase as GamePhase);
  };


  return (
    <div className="app-container">
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      {/* Global Audio Button — opens BGM modal (Default to top-left corner) */}
      {phase !== 'INTRO' && (
        <BGMButton 
          className={phase === 'CHARACTER_SHEET' ? 'capture-ignore' : ''}
          style={{
            position: 'fixed',
            left: '0.3rem',
            top: '0.55rem',
            zIndex: 5000
          }} 
        />
      )}

      {preloadState.isRunning && preloadState.total > 0 && (
        <div
          aria-live="polite"
          style={{
            position: 'fixed',
            left: '1rem',
            top: '1rem',
            zIndex: 3000,
            padding: '0.55rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid rgba(235, 192, 80, 0.35)',
            background: 'rgba(12, 12, 18, 0.72)',
            color: 'var(--text-secondary, #d8d8d8)',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            fontSize: '0.82rem',
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          이미지 준비 중 {Math.min(100, Math.round(((preloadState.loaded + preloadState.failed) / preloadState.total) * 100))}%
        </div>
      )}

      {phase === 'INTRO' && (
        <Intro
          onStart={handleStartGame}
          onLoad={handleLoadCharacter}
          onImport={handleImportCharacter}
          onDevNavigate={handleDevNavigate}
        />
      )}

      <Suspense fallback={<LoadingFallback />}>
        {phase === 'PROLOGUE_STORY' && (
          <StoryScreen 
            onComplete={handlePrologueComplete} 
            {...CUTSCENE_DATA.PROLOGUE_STORY}
          />
        )}

        {phase === 'NARRATOR_SELECT' && (
          <NarratorSelect
            onComplete={handleNarratorSelectComplete}
            onBack={() => setPhase('INTRO')}
            initialNarrator={selectedNarrator}
          />
        )}

        {phase === 'INTRO_STORY' && (
          <StoryScreen 
            onComplete={handleIntroStoryComplete} 
            {...CUTSCENE_DATA.INTRO_STORY}
          />
        )}

        {phase === 'WORLD_SETUP' && (
          <WorldSetup
            onComplete={handleWorldSetupComplete}
            initialData={worldSetupResults ? {
              name: worldSetupResults.name,
              selections: worldSetupResults.rawSelections,
              startStep: worldSetupResults.lastStep ?? 0
            } : undefined}
          />
        )}

        {phase === 'CYOA_STORY' && (
          <StoryScreen 
            onComplete={handleCYOAStoryComplete} 
            {...CUTSCENE_DATA.CYOA_STORY}
          />
        )}

        {phase === 'CYOA_BUILD' && (
          <VioletDeckCYOA
            onComplete={handleCYOAComplete}
            onBack={handleBackToWorldSetup}
            worldSetupBonus={worldSetupResults?.points || 0}
            worldSetupTags={[
              ...(worldSetupResults?.tags || []),
              ...dialogueTags
            ]}
            worldSetupChoices={worldSetupResults?.choices || []}
            characterName={worldSetupResults?.name || ''}
            initialData={characterData ? {
              choices: characterData.choices,
              equipped: characterData.equipped
            } : undefined}
            showNotification={showNotification}
          />
        )}

        {phase === 'REWARD_STORY' && (
          <StoryScreen 
            onComplete={handleRewardStoryComplete} 
            {...CUTSCENE_DATA.REWARD_STORY}
          />
        )}

        {phase === 'REWARD_SELECT' && characterData && (
          <RewardSelect
            onComplete={handleRewardSelectComplete}
            initialData={rewardSelectResults ? {
              name: rewardSelectResults.name,
              selections: rewardSelectResults.rawSelections,
              startStep: rewardSelectResults.lastStep ?? 0
            } : {
              name: characterData.name || worldSetupResults?.name || '쵸붕이',
              selections: { scenario: 'scenario_nothing' },
              startStep: 0
            }}
          />
        )}

        {phase === 'CHARACTER_SHEET' && characterData && (
          <CharacterSheet
            characterData={characterData}
            onBack={handleBackToRewardSelect}
            onConfirmBuild={handleConfirmBuild}
            showNotification={showNotification}
          />
        )}

        {phase === 'LOCATION_CUTSCENE' && (
          <StoryScreen
            onComplete={handleLocationCutsceneComplete}
            {...CUTSCENE_DATA.LOCATION_CUTSCENE}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
