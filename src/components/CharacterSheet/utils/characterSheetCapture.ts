import { toPng } from 'html-to-image';

const waitForImages = async (target: HTMLElement) => {
    const imageNodes = Array.from(target.querySelectorAll('img'));
    await Promise.all(imageNodes.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    }));
};

const getSafeFileName = (characterName: string) => (
    (characterName || 'character-sheet')
        .replace(/[\\/:*?"<>|]/g, '_')
        .trim() || 'character-sheet'
);

export const captureCharacterSheet = async (
    target: HTMLElement,
    characterName: string,
) => {
    await waitForImages(target);

    const rect = target.getBoundingClientRect();
    const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        width: Math.ceil(rect.width),
        height: Math.ceil(target.scrollHeight),
        backgroundColor: '#101018',
        style: {
            margin: '0',
            transform: 'none',
        },
        filter: (node) => {
            if (!(node instanceof HTMLElement)) return true;
            return !node.closest('.capture-ignore');
        },
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${getSafeFileName(characterName)}-character-sheet.png`;
    link.click();
};
