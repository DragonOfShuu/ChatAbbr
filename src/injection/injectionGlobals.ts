export let allowedChars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*-+_=\\/?"

export const charAllowed = (char: string): boolean => {
    char = char.toLowerCase()
    return char.length===1 && allowedChars.includes(char)
}

export const textAllowed = (text: string): boolean => {
    text = text.toLowerCase();
    for (let i = 0; i<text.length; i++) {
        if (charAllowed(text[i])) return false
    }
    return true;
}