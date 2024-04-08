import { $applyNodeReplacement, EditorConfig, LexicalNode, NodeKey, SerializedTextNode, TextNode } from "lexical";

export default class PlaceholderNode extends TextNode {
    // __name: string;
    
    // constructor(name: string, key?: NodeKey) {
    //     super(name, key);
    //     // this.__name = name;
    // }
  
    static getType(): string {
        return 'placeholder';
    }

    static clone(node: PlaceholderNode): PlaceholderNode {
        return new PlaceholderNode(node.__text);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
        console.log("Attempted to run CreateDom?")
        const textElement = super.createDOM(config);
        textElement.className = "border-2 border-rose-500 rounded-md"
        console.log("Ran createdom")
        return textElement;
    }
  
    // updateDOM(
    //   prevNode: PlaceholderNode,
    //   dom: HTMLElement,
    //   config: EditorConfig,
    // ): boolean {
    //     const isUpdated = super.updateDOM(prevNode, dom, config);
    //     //   if (prevNode.__name !== this.__name) {
    //     //     dom.style.name = this.__name;
    //     //   }
    //     return isUpdated;
    // }

    static importJSON(serializedNode: SerializedTextNode): PlaceholderNode {
        const node = $createPlaceholderNode(serializedNode.text);
        node.setDetail(serializedNode.detail)
        node.setFormat(serializedNode.format)
        node.setMode(serializedNode.mode)
        node.setStyle(serializedNode.style)
        return node;
    }

    exportJSON(): SerializedTextNode {
        return {
            ...super.exportJSON(),
            type: this.getType()
        }
    }

    canInsertTextBefore(): boolean {
        return false;
    }
    
    isTextEntity(): true {
        return true;
    }
}

export const $createPlaceholderNode = (id: string): PlaceholderNode => {
    console.log("Creating placeholder with the following text: ", id)
    return new PlaceholderNode(id);
}

export const $isPlaceholderNode = (
    node: LexicalNode | null | undefined,
): node is PlaceholderNode => {
    return node instanceof PlaceholderNode;
}