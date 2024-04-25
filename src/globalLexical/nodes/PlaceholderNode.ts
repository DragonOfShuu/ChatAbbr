import { $applyNodeReplacement, DOMExportOutput, EditorConfig, LexicalEditor, LexicalNode, SerializedTextNode, TextNode } from "lexical";
import {addClassNamesToElement} from '@lexical/utils';

export default class PlaceholderNode extends TextNode {
    // __name: string;
    
    // constructor(name: string, key?: NodeKey) {
    //     super(name, key);
    //     // // this.setMode("token");
    //     // this.__name = name;
    // }
  
    static getType(): string {
        return 'placeholderParadigm';
    }

    static clone(node: PlaceholderNode): PlaceholderNode {
        return new PlaceholderNode(node.__text, node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
        const textElement = super.createDOM(config);
        addClassNamesToElement(textElement, "border-rose-600 bg-rose-500 hover:bg-rose-400 text-white rounded-full px-2 py-1")
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
        // console.log("Imported JSON")
        const node = $createPlaceholderNode(serializedNode.text);
        node.setDetail(serializedNode.detail)
        node.setFormat(serializedNode.format)
        node.setMode(serializedNode.mode)
        node.setStyle(serializedNode.style)
        return node;
    }

    exportJSON(): SerializedTextNode {
        console.log("Exported JSON")
        return {
            ...super.exportJSON(),
            type: this.getType()
        }
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const domStuff = super.exportDOM(editor);
        return domStuff;
    }

    canInsertTextBefore(): boolean {
        return false;
    }
    
    isTextEntity(): true {
        return true;
    }

    canHaveFormat(): false {
        return false;
    }

    // isToken(): true {
    //     return true
    // }
}

export function $createPlaceholderNode(name: string): PlaceholderNode {
    return $applyNodeReplacement(new PlaceholderNode(name));
}

export function $isPlaceholderNode (
    node: LexicalNode | null | undefined,
): node is PlaceholderNode {
    return node instanceof PlaceholderNode;
}