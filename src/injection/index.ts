import { AbbrType } from '../database/abbrAPI';
import findAbbr from './checkForAbbr';
import styles from './funnyStyles.module.sass'
import { charAllowed, maxHotkeySize } from '../globalCharacterRules';
import insertText from './textManipulation';

console.log("Script was injected.")

let currentlyTyped = ''
const clearCurrentlyTyped = () => currentlyTyped = ''

const isTextareaOrInput = (element: Element | null): null|Element => {
    if (!element) {
        return null;
    }

    const tagName = element.tagName.toUpperCase();
  
    if (tagName === "TEXTAREA" || tagName === "INPUT") {
        return element;
    }

    const isContentEditable = element.getAttribute('contenteditable');
  
    if(isContentEditable) {
        return element;
    }

    if (tagName === "IFRAME") {
        const newEle = element as HTMLIFrameElement
        if (!newEle.contentWindow) {
            console.log('Darn it, contentWindow does not exist')
            return null;
        }
        return isTextareaOrInput(newEle.contentWindow?.document.activeElement)
    }
  
    return null;
};

const listenActiveElement = (callback: any) => {
    let lastActiveElement = document.activeElement;
    let previousActiveElement: Element|null = null;

    // Initial check
    const focusChange = () => {
        previousActiveElement = lastActiveElement;
        lastActiveElement = document.activeElement;
        console.log(lastActiveElement?.tagName, lastActiveElement)

        lastActiveElement = isTextareaOrInput(lastActiveElement)
        // Check if element is textarea or input
        if (lastActiveElement) {
            callback(lastActiveElement, previousActiveElement);
        }
    }

    focusChange()
  
    // Handle if focus changes
    const detectFocus = () => {
        if (lastActiveElement !== document.activeElement) {
            focusChange()
        }
    };
  
    window.addEventListener("focus", detectFocus, true);
};

const editTextbox = (
    target: HTMLInputElement|HTMLTextAreaElement|HTMLDivElement, 
    data: {abbr: AbbrType, hotkey: string}
) => {
    insertText(target, data.abbr.output, data.hotkey.length)
    target.classList.add(styles.rainbow)
}

const normalizeTypedSize = (typed: string, limit: number) => {
    let difference = typed.length-limit;
    return typed.slice(difference>0?difference:0)
}

const keyUp = async (e: KeyboardEvent) => {
    if (!e.isTrusted) return
    console.log(`Key up detected. Key: ${e.key}`)
    const target = e.target as HTMLInputElement|HTMLTextAreaElement|HTMLDivElement;

    if (e.key.toLowerCase()==="shift") return
    if (e.key.toLowerCase()==="backspace") {
        if (currentlyTyped.length!==0) 
            currentlyTyped = currentlyTyped.slice(0, currentlyTyped.length-1);
        return;
    }

    if (!charAllowed(e.key)) {
        currentlyTyped = ''
        return
    }

    currentlyTyped = normalizeTypedSize(currentlyTyped, maxHotkeySize) // Slice start of currentlyTyped to fit size requirements

    currentlyTyped+=e.key;
    console.log('Currently typed: ', currentlyTyped)

    const abbr = await findAbbr(currentlyTyped)
    if (abbr) {
        editTextbox(target, abbr)
        clearCurrentlyTyped()
    }

    if (e.key===" ") clearCurrentlyTyped()
}

const listenToTyping = (element: HTMLInputElement, previousElement: HTMLInputElement) => {
    currentlyTyped = ''
    previousElement && previousElement.removeEventListener("keyup", keyUp)
    previousElement && previousElement.removeEventListener("mousedown", clearCurrentlyTyped)
    element.addEventListener("keyup", keyUp);
    element.addEventListener("mousedown", clearCurrentlyTyped)
};

listenActiveElement(listenToTyping);
