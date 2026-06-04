const SAVE_KEY = 'cyoa_saved_character';

export interface SaveData {
    version: 1;
    savedAt: string;
    characterName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    characterData: any;
}

export function saveCharacter(name: string, characterData: any): void {
    const saveData: SaveData = {
        version: 1,
        savedAt: new Date().toISOString(),
        characterName: name,
        characterData
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
        console.warn("Failed to save character to localStorage:", e);
    }
}

export function loadCharacter(): SaveData | null {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as SaveData;
        if (!data.version || !data.characterData) return null;
        return data;
    } catch {
        return null;
    }
}

export function hasSavedCharacter(): boolean {
    try {
        return localStorage.getItem(SAVE_KEY) !== null;
    } catch {
        return false;
    }
}

export function deleteSavedCharacter(): void {
    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (e) {
        console.warn("Failed to delete character from localStorage:", e);
    }
}

export function exportCharacter(name: string, characterData: any): void {
    const saveData: SaveData = {
        version: 1,
        savedAt: new Date().toISOString(),
        characterName: name,
        characterData
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${name}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function importCharacter(file: File): Promise<SaveData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (!json.version || !json.characterData) {
                    reject(new Error("Invalid character file format"));
                    return;
                }
                resolve(json as SaveData);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}
