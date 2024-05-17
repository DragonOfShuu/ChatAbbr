import { $getRoot, createEditor } from "lexical"
import PlaceholderNode from "@/globalLexical/nodes/PlaceholderNode";
import { theme } from "@/globalLexical/GlobalLexicalSettings";
import { $generateHtmlFromNodes } from '@lexical/html'

const stringToEditor = (state: string) => {
    const initialConfig = {
        namespace: 'OutputEditor',
        nodes: [PlaceholderNode], // Replace this node with a component node
        theme,
        onError: (e: Error)=> console.log(e),
    };
    const editor = createEditor(initialConfig);
    const newEditorState = editor.parseEditorState(state);
    return {newEditorState, editor}
}

export const lexicalStateToHtml = (state: string) => {
    const {newEditorState, editor} = stringToEditor(state);

    let newHtml: undefined|string = undefined;
    newEditorState.read(()=> {
        newHtml = $generateHtmlFromNodes(editor);
    })
    return newHtml??'';
}

export const lexicalStateToText = (state: string): string => {
    const {newEditorState} = stringToEditor(state);
    let text;
    newEditorState.read(()=> {
        const root = $getRoot()
        text = root.getTextContent()
    })
    // return text;
    return text??'';
}
