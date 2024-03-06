export let allowedLetters = "abcdefghijklmnopqrstuvwxyz"
export let allowedSymbols = "!@#$%^&*-+_=\\/?"
export let allowedChars = allowedLetters + allowedSymbols

export let maxHotkeySize = 15;

export const charAllowed = (char: string): boolean => {
    // char = char.toLowerCase()
    return char.length===1 && allowedChars.includes(char)
}

export const textAllowed = (text: string): boolean => {
    // text = text.toLowerCase();
    for (let i = 0; i<text.length; i++) {
        const char = text[i];
        if (char===" " && i===text.length-1) return true
        if (!charAllowed(char)) 
            return false
    }
    return true;
}
