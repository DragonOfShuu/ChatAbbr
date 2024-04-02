/**
 * We will be utilizing lexical. Look into the "serialization"
 * and "deserialization." Just like magical, we can use
 * percent signs to determine a placeholder: %pl.manager%
 * 
 * Editor: https://lexical.dev/docs/intro
 */

// import {$getRoot, $getSelection} from 'lexical';
// import {useEffect} from 'react';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './plugins/ToolbarPlugin';

const theme = {
    // Theme styling goes here
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error);
}

type Props = {
    className?: string
}

function OutputEditor(props: Props) {
    const initialConfig = {
        namespace: 'OutputEditor',
        theme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`${props.className}`}>
                <div className={`size-full flex flex-col items-stretch`}>
                    <ToolbarPlugin />
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={'grow rounded-lg border-2 border-fuchsia-400 focus:outline-fuchsia-500 outline-2 p-2'} />}
                        // placeholder={<div>Enter some text...</div>}
                        placeholder={<></>}
                        ErrorBoundary={LexicalErrorBoundary} />

                    <HistoryPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}

export default OutputEditor