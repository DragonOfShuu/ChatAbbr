import { $getRoot, EditorState } from "lexical"
import OnChangePlugin from "./OnChange"
import { useHotkeyContext, useHotkeyDispatchContext } from "@/pages/HotkeyDataContext"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect, useState } from "react"

type Props = {

}

const UpdateHotkeyPlugin = (props: Props) => {
    const hotkeyData = useHotkeyContext();
    const hotkeyDataDispatch =  useHotkeyDispatchContext();

    const [lexicalEditor] = useLexicalComposerContext();
    const [editorState, setEditorState] = useState<string>();

    const clearEditorAndState = () => {
        lexicalEditor.update(()=> {
            $getRoot().clear();
        }, {discrete: true}) // Discrete to make the update instant
        setEditorState( JSON.stringify(lexicalEditor.getEditorState().toJSON()) );
    }

    useEffect(()=> {
        // Closes any loop
        if (hotkeyData.currentHotkeyEdit?.output === editorState) return
        if (hotkeyData.currentHotkeyEdit?.output===undefined) return
        
        let editorJSON = hotkeyData.currentHotkeyEdit.output;

        try {
            const newEditorState = lexicalEditor.parseEditorState(editorJSON)
            lexicalEditor.setEditorState(newEditorState);
            setEditorState(editorJSON)
        // In case the EditorJSON is corrupted or empty
        } catch (e) {
            clearEditorAndState();
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkeyData.currentHotkeyEdit])
    
    useEffect(()=> {
        if (hotkeyData.currentHotkeyEdit?.output === editorState) return
        if (!editorState) return;

        hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {output: editorState}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState, hotkeyDataDispatch])

    const OnChangeUpdate = (editorState: EditorState) => {
        const editorJSON = editorState.toJSON();
        setEditorState(JSON.stringify(editorJSON))
    }

    return (
        <OnChangePlugin onChange={OnChangeUpdate} /> 
    )
}

export default UpdateHotkeyPlugin;
