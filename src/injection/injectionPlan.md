Overview
========

The injection will be separated into multiple parts (ofc). First there will be the portion which will use react which will allow the user to insert text into the placeholders. This will be called the "QuickTemplateEditor". The string html will then be passed to the "InjectionStrategyChooser" (I couldn't think of a better name). The output will be JSON detailing how we want to inject the data into the text box. The strategy, along with the html data and text box info will be passed to the "InjectionActionizer," which will perform each task given by the strategy. 


Quick Template Editor 
==========

The quick template editor will allow the user to insert text into their predetermined placeholders. It will be called up by a simple function, where the input will be the lexical editor state. The output will be the new text in html. 

It will create a readonly state of the lexical editor, and each string where the placeholder was will be replaced with a decorator component which will allow the use of a custom react component.

The custom component for each placeholder will be known as a "PlaceholderFiller," and will set an object in a parent context called "PlaceholderListContext". The name of the placeholder will be used as the key, and the value will be the new text. Using this strategy will allow the reuse of the same placeholder name, and to fill other text boxes. 

When the user accepts the placeholder replacements, the placeholders will be replaced with their corresponding output using the context. Then the lexical state will be converted into html, and will be used as the output.

> If there are no placeholders, the placeholder process will be skipped, and the html will be immediately converted.

