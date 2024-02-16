/* global chrome */
import './funnyStyles.sass'

console.log("Script was injected.")

const isTextareaOrInput = (element: Element | null) => {
    if (!element) {
        return false;
    }

    const tagName = element.tagName.toUpperCase();
  
    if (tagName === "TEXTAREA" || tagName === "INPUT") {
        return true;
    }

    const isContentEditable = element.getAttribute('contenteditable');
  
    if(isContentEditable) {
        return true;
    }
  
    return false;
};

const listenActiveElement = (callback: any) => {
    // Initial check
    let lastActiveElement = document.activeElement;
    // Check if element is textarea or input
    if (isTextareaOrInput(lastActiveElement)) {
        callback(lastActiveElement);
    }
  
    // Handle if focus changes
    const detectFocus = () => {
        if (lastActiveElement !== document.activeElement) {
            lastActiveElement = document.activeElement;
            if (isTextareaOrInput(lastActiveElement)) {
                callback(lastActiveElement);
            }
        }
    };
  
    window.addEventListener("focus", detectFocus, true);
};

const listenToTyping = (element: HTMLInputElement) => {
    element.addEventListener("keyup", (e) => {
        const target = e.target as HTMLInputElement|HTMLTextAreaElement|HTMLDivElement;
        
        // @ts-ignore
        let text: string|undefined = target.value;
  
        // If the text is undefined (target.value not existing), then it is a content editable div
        if(text === undefined) {
            text = target.innerText;
        }

        if (text.toLowerCase().includes("gay")) {
            target.classList.add('rainbow');
        } else if (target.classList.contains('rainbow')) {
            target.classList.remove('rainbow')
        }
        
    });
};

listenActiveElement(listenToTyping);

export {}
