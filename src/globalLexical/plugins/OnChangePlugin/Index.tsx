import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";

type Props = {
    onChange: (editorState: EditorState)=> any
}

const OnChangePlugin = ({ onChange }: Props) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            console.log("New Editor state: ", editorState.toJSON())
            onChange(editorState);
        });
    }, [editor, onChange]);

    return <></>;
}

export default OnChangePlugin;

// "Probably the simplest thing here" (my last words)
