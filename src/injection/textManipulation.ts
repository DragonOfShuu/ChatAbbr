
function replicateKeyPresses(element: HTMLElement, text: string, deleteCount?: number) {
    const keyPress = (key: string, charCode?: number) => ["keydown", "keyup"].forEach((eventType) => {
        element.dispatchEvent( new KeyboardEvent(eventType, {
            bubbles: true,
            cancelable: true,
            charCode: charCode || key.charCodeAt(0),
            // keyCode: keyCode || key.code,
            key: key,
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            repeat: false,
            location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
        }) )
    })

    if (deleteCount) 
        for (let i = 0; i<deleteCount; i++) keyPress('Backspace', 8)

    for (let i = 0; i<text.length; i++)
        keyPress( text[i] )
}

function insertTextAtContentDiv(element: HTMLDivElement, text: string, deleteCount?: number) {
    let sel = window.getSelection();
    if (!sel) {
        console.log("Selection was null...")
        return
    }
    console.log(sel.focusNode);

    if (sel.rangeCount===0) {
        replicateKeyPresses(element, text, deleteCount);
        return;
    } 

    let range = sel.getRangeAt(0);
    if (deleteCount&&sel.focusNode&&sel.focusNode.textContent)
        range.setStart(sel.focusNode, sel.focusNode.textContent?.length-deleteCount)
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
    replicateKeyPresses(element, text, deleteCount)

    if (!lastNode) return
    
    // Preserve the selection
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function insertTextInInput(element: HTMLInputElement|HTMLTextAreaElement, text: string, deleteCount?: number) {
    element.focus();
    const startPos = element.selectionStart;
    const endPos = element.selectionEnd;

    if (!(startPos&&endPos)) {
        console.log("start and end was null")
        return
    }

    element.value =
      element.value.substring(0, startPos-(deleteCount??0)) +
      text +
      element.value.substring(endPos, element.value.length);
    element.selectionStart = element.selectionEnd = startPos + text.length;

    replicateKeyPresses(element, text, deleteCount)
}

function insertText(element: HTMLInputElement|HTMLTextAreaElement|HTMLDivElement, text: string, deleteCount?: number) {
    console.log("Inserting text into: ", element)
    console.log("the element is typeof: ", typeof element)
    if (element.tagName === "DIV") insertTextAtContentDiv(element as HTMLDivElement, text, deleteCount)
    else insertTextInInput(element as HTMLInputElement|HTMLTextAreaElement, text, deleteCount)
}

export default insertText;
export {insertTextAtContentDiv, insertTextInInput, replicateKeyPresses}
