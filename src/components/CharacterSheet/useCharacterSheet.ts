import { useMemo, useRef, useState } from 'react';
import { getTagDescription, getTagInfo, categoryInfo } from '../../data/tags';
import { initialCYOAData } from '../../data/cyoa';
import type { Choice } from '../../types/cyoa';
import type { ToastType } from '../common/Toast';
import { saveCharacter, exportCharacter } from '../../utils/saveUtils';
import { useAudioStore } from '../../hooks/useAudioStore';
import { captureCharacterSheet } from './utils/characterSheetCapture';

export interface CharacterSheetProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    characterData: any;
    onBack: () => void;
    onConfirmBuild: () => void;
    showNotification: (message: string, type?: ToastType) => void;
}

export interface ClassEntry {
    id: string;
    name: string;
    description: string;
}

export interface SkillEntry {
    skillId: string;
    skill: Choice;
    bonus: { atk?: number; def?: number };
}

export interface SelectedChoiceCard {
    id: string;
    name: string;
    description: string;
    icon?: string;
    image?: string;
    selectedImage?: string;
    useFrame?: boolean;
}

export interface SelectedChoiceGroup {
    sectionTitle: string;
    choices: SelectedChoiceCard[];
}

export const useCharacterSheet = ({ characterData, onBack, onConfirmBuild, showNotification }: CharacterSheetProps) => {
    const characterName = characterData.name || '쵸붕이';
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breakdownStat, setBreakdownStat] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(characterData.profileImage || null);
    const playSfx = useAudioStore(state => state.playSfx);
    const sheetCaptureRef = useRef<HTMLDivElement>(null);

    const handleProfileImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) return;

            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                const maxW = 1024;
                const maxH = 1024;
                let w = img.width;
                let h = img.height;
                if (w > h) {
                    if (w > maxW) {
                        h = Math.round((h * maxW) / w);
                        w = maxW;
                    }
                } else {
                    if (h > maxH) {
                        w = Math.round((w * maxH) / h);
                        h = maxH;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, w, h);
                    const resizedUrl = canvas.toDataURL('image/jpeg', 0.85);
                    setProfileImage(resizedUrl);
                    characterData.profileImage = resizedUrl;
                } else {
                    setProfileImage(dataUrl);
                    characterData.profileImage = dataUrl;
                }
            };
        };
        reader.readAsDataURL(file);
    };

    const stats = characterData.stats;
    const inventory = characterData.items || [];
    const tags = characterData.tags || [];
    const choiceIds: string[] = useMemo(() => characterData.choices || [], [characterData.choices]);

    const selectedClassEntries = useMemo<ClassEntry[]>(() => {
        return [];
    }, []);

    const finalStats = useMemo(() => {
        const computedStats: Record<string, number> = { POW: 10, SEN: 10, INT: 10, CON: 10, WIL: 10, CHA: 10, LUK: 10 };
        Object.entries(stats).forEach(([k, v]) => { computedStats[k] = (computedStats[k] || 10) + (v as number || 0); });
        return computedStats;
    }, [stats]);

    const derivedSkillSet = useMemo(() => {
        return [] as string[];
    }, []);

    const skillEntries = useMemo<SkillEntry[]>(() => {
        return [];
    }, []);

    const selectedChoicesGrouped = useMemo<SelectedChoiceGroup[]>(() => {
        const groups: SelectedChoiceGroup[] = [];

        const worldTags = characterData.worldSetup?.tags || characterData.worldSetupTags || [];
        if (worldTags.length > 0) {
            const worldChoices = worldTags.map((tag: string) => ({
                id: `world-${tag}`,
                name: tag,
                description: getTagDescription(tag),
                icon: 'Globe'
            }));
            groups.push({
                sectionTitle: '세계 설정',
                choices: worldChoices
            });
        }

        for (const section of initialCYOAData.sections) {
            const picked = section.choices.filter(c => choiceIds.includes(c.id));
            if (picked.length > 0) {
                if (section.id === 'alignment') {
                    const resultChoices = picked.filter(c => c.group === 'alignment_result');
                    const axisChoices = picked.filter(c => c.group !== 'alignment_result');

                    const mapChoice = (c: Choice) => {
                        const firstTag = c.tags && c.tags.length > 0
                            ? (typeof c.tags[0] === 'string' ? c.tags[0] : c.tags[0].name)
                            : null;
                        const tagInfo = firstTag ? getTagInfo(firstTag) : null;
                        const catIcon = tagInfo ? categoryInfo[tagInfo.category]?.defaultIcon : null;

                        return {
                            id: c.id,
                            name: c.name,
                            description: c.description,
                            icon: catIcon || 'Circle',
                            image: c.image,
                            selectedImage: c.selectedImage,
                            useFrame: c.useFrame
                        };
                    };

                    if (axisChoices.length > 0) {
                        groups.push({
                            sectionTitle: '성향',
                            choices: axisChoices.map(mapChoice)
                        });
                    }
                    if (resultChoices.length > 0) {
                        groups.push({
                            sectionTitle: '최종 성향',
                            choices: resultChoices.map(mapChoice)
                        });
                    }
                } else {
                    groups.push({
                        sectionTitle: section.title,
                        choices: picked.map(c => {
                            const firstTag = c.tags && c.tags.length > 0
                                ? (typeof c.tags[0] === 'string' ? c.tags[0] : c.tags[0].name)
                                : null;
                            const tagInfo = firstTag ? getTagInfo(firstTag) : null;
                            const catIcon = tagInfo ? categoryInfo[tagInfo.category]?.defaultIcon : null;

                            return {
                                id: c.id,
                                name: c.name,
                                description: c.description,
                                icon: catIcon || 'Circle',
                                image: c.image,
                                selectedImage: c.selectedImage,
                                useFrame: c.useFrame
                            };
                        })
                    });
                }
            }
        }
        return groups;
    }, [choiceIds, characterData.worldSetupTags, characterData.worldSetup?.tags]);

    const handleBack = () => {
        playSfx('uiBack');
        onBack();
    };

    const handleConfirmBuild = () => {
        playSfx('confirm');
        onConfirmBuild();
    };

    const handleSave = () => {
        playSfx('confirm');
        saveCharacter(characterName, characterData);
        showNotification('캐릭터가 저장되었습니다!', 'success');
    };

    const handleExport = () => {
        playSfx('uiClick');
        exportCharacter(characterName, characterData);
        showNotification('캐릭터 파일이 다운로드되었습니다.', 'success');
    };

    const handleCaptureSheet = async () => {
        const target = sheetCaptureRef.current;
        if (!target || isCapturing) return;

        playSfx('uiClick');
        setIsCapturing(true);
        try {
            await captureCharacterSheet(target, characterName);
            showNotification('캐릭터 시트 이미지가 저장되었습니다!', 'success');
        } catch (error) {
            console.error('Failed to capture character sheet:', error);
            showNotification('이미지 저장에 실패했습니다.', 'warning');
        } finally {
            setIsCapturing(false);
        }
    };

    const maxHP = 100 + ((stats['CON'] || 0) * 10);
    const maxMP = 100 + ((stats['WIL'] || 0) * 10);
    const gold = (stats['Gold'] || 0) + 100;

    return {
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
    };
};

export type CharacterSheetViewModel = ReturnType<typeof useCharacterSheet>;
