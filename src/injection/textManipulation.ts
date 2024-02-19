function insertTextAtContentDiv(element: HTMLDivElement, text: string, deleteCount?: number|null) {
    let sel = window.getSelection();
    if (!sel) {
        console.log("Selection was null...")
        return
    }
    console.log(sel.focusNode)

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
    
    if (!lastNode) return
    
    // Preserve the selection
    range = range.cloneRange();
    range.setStartAfter(lastNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

function insertTextInInput(element: HTMLInputElement|HTMLTextAreaElement, text: string, deleteCount?: number|null) {
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
}

function insertText(element: HTMLInputElement|HTMLTextAreaElement|HTMLDivElement, text: string, deleteCount?: number|null) {
    if (element instanceof HTMLDivElement) insertTextAtContentDiv(element, text, deleteCount)
    else insertTextInInput(element, text, deleteCount)
}

export default insertText;
export {insertTextAtContentDiv, insertTextInInput}
