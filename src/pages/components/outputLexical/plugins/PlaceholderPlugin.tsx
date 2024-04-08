import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import PlaceholderNode, { $createPlaceholderNode } from "../nodes/PlaceholderNode";
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

    const createHashtagNode = useCallback((textNode: TextNode): PlaceholderNode => {
        return $createPlaceholderNode(textNode.getTextContent());
    }, []);

    const getPlaceholderMatch = useCallback((text: string) => {
        const matchArr = new RegExp("%[\\w]{1,20}%", 'i').exec(text);

        if (matchArr === null) {
        return null;
        }

        // const hashtagLength = matchArr[3].length + 1;
        // const startOffset = matchArr.index + matchArr[1].length;
        // const endOffset = startOffset + hashtagLength;
        const placeholderLength = matchArr[0].length;
        const startOffset = matchArr.index+1;
        const endOffset = matchArr.index + placeholderLength-1;
        return {
            end: endOffset,
            start: startOffset,
        };
    }, []);

    useLexicalTextEntity<PlaceholderNode>(
        getPlaceholderMatch,
        PlaceholderNode,
        createHashtagNode,
    );

    return null;
}