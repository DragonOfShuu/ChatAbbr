import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import PlaceholderNode, { $createPlaceholderNode } from "../../nodes/PlaceholderNode";
import { useCallback, useEffect } from "react";
import { TextNode } from "lexical";
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity'

export default function PlaceholderPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([PlaceholderNode])) {
            throw new Error('PlaceholderNode: PlaceholderNode not registered on editor');
        }
    }, [editor]);

    const createPlaceholderNode = useCallback((textNode: TextNode): PlaceholderNode => {
        const textContent = textNode.getTextContent();
        console.log("New text content: ", textContent)
        const node = $createPlaceholderNode(textContent);
        console.log("Node created: ", node)
        return node;
    }, []);

    const getPlaceholderMatch = useCallback((text: string) => {
        const matchArr = new RegExp(/(%[\w]{1,20}%)/, 'i').exec(text);

        if (matchArr === null) {
            return null;
        }

        const placeholderLength = matchArr[1].length;
        const startOffset = matchArr.index;
        const endOffset = startOffset + placeholderLength;
        console.log(
            {
                end: endOffset, 
                start: startOffset, 
                length: placeholderLength, 
                matched: matchArr[0], 
                pulled: text.slice(startOffset, endOffset),
                text: text,
            }
        )
        return {
            end: endOffset,
            start: startOffset,
        };
    }, []);

    useLexicalTextEntity<PlaceholderNode>(
        getPlaceholderMatch,
        PlaceholderNode,
        createPlaceholderNode,
    );


    return null;
}