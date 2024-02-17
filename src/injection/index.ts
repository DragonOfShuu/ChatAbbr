/* global chrome */
import './funnyStyles.sass'

console.log("Script was injected.")

const isTextareaOrInput = (element: Element | null): null|Element => {
    if (!element) {
        return null;
    }

    const tagName = element.tagName.toUpperCase();
  
    if (tagName === "TEXTAREA" || tagName === "INPUT") { // Including IFRAME could include future issues. Maybe going inside the IFrame?
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
        // console.log("Discovered through iFrame: ", lastActiveElement?.tagName, lastActiveElement)
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

function insertTextAtCursor(element: HTMLInputElement, text: string) {
    // element.focus();
    // const startPos = element.selectionStart;
    // const endPos = element.selectionEnd;

    // if (!(startPos&&endPos)) {
    //     console.log("start and end was null")
    //     return
    // }

    // element.value =
    //   element.value.substring(0, startPos) +
    //   text +
    //   element.value.substring(endPos, element.value.length);
    // element.selectionStart = element.selectionEnd = startPos + text.length;
    let sel = window.getSelection();
    if (!sel) {
        console.log("Selection was null...")
        return
    }
    console.log(sel.focusNode)
    if (sel.getRangeAt && sel.rangeCount) {
        let range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        var el = document.createElement("div");
        el.innerHTML = text;
        var frag = document.createDocumentFragment(), node, lastNode;
        while ( (node = el.firstChild) ) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        
        // Preserve the selection
        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

const keyUp = (e: KeyboardEvent) => {
    console.log(`Key up detected. Key: ${e.key}`)
    const target = e.target as HTMLInputElement|HTMLTextAreaElement|HTMLDivElement;

    if (e.key === "f") {
        console.log('Dispatching backspace event...')
        // target.dispatchEvent( new KeyboardEvent('keydown', { key: 'Backspace' }) )
        // @ts-ignore
        // target.value += "a"
        // target.innerHTML += "a"
        insertTextAtCursor(target, 'a')
    }
    
    // @ts-ignore
    // let text: string|undefined = target.value;

    // If the text is undefined (target.value not existing), then it is a content editable div
    // if(text === undefined) {
    //     text = target.innerText;
    // }

    // if (text.toLowerCase().includes("gay")) {
    //     target.classList.add('rainbow');
    // } else if (target.classList.contains('rainbow')) {
    //     target.classList.remove('rainbow')
    // }
}

const listenToTyping = (element: HTMLInputElement, previousElement: HTMLInputElement) => {
    previousElement && previousElement.removeEventListener("keyup", keyUp)
    element.addEventListener("keyup", keyUp);
};

listenActiveElement(listenToTyping);

export {}
