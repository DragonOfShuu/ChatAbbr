import { $getRoot, $insertNodes, EditorState } from "lexical"
import OnChangePlugin from "./OnChange"
import { useHotkeyContext, useHotkeyDispatchContext } from "@/pages/HotkeyDataContext"

import {$generateHtmlFromNodes} from '@lexical/html'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {$generateNodesFromDOM} from '@lexical/html'
import { useEffect } from "react"

type Props = {

}

const UpdateHotkeyPlugin = (props: Props) => {
    const hotkeyData = useHotkeyContext();
    const hotkeyDataDispatch =  useHotkeyDispatchContext();

    const [lexicalEditor] = useLexicalComposerContext();

    useEffect(()=> {
        lexicalEditor.update(()=> {
            const hotkeyOutput = hotkeyData.currentHotkeyEdit?.output;
            if (hotkeyOutput===undefined) return;
    
            const parser = new DOMParser();
            const dom = parser.parseFromString(hotkeyOutput, 'text/html')
    
            const nodes = $generateNodesFromDOM(lexicalEditor, dom)
    
            $getRoot().select();
    
            $insertNodes(nodes)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkeyData.currentHotkeyEdit])

    const OnChangeUpdate = (editorState: EditorState) => {
        const htmlChan = $generateHtmlFromNodes(lexicalEditor, null);

        hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {output: htmlChan}})
    }

    return (
        <OnChangePlugin onChange={OnChangeUpdate} /> 
    )
}

export default UpdateHotkeyPlugin;
