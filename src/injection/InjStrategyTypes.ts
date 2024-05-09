export type InjectionEventDataFormatType = {
    dataTransfer?: [FillFormat, FillFormat]
    clipboardData?: FillFormat[] 
}

export type InjectionEventInitType = 
    | Partial<{
        bubbles: true,
        cancelable: boolean,
        composed: boolean,
        detail: number,
        inputType: "insertReplacementText"|"insertFromPaste"|"deleteContentBackward"
    }>
    | Partial<{
        altKey: boolean,
        bubbles: boolean,
        cancelable: boolean,
        code: string,
        composed: boolean,
        ctrlKey: boolean,
        detail: number,
        key: string,
        keyCode: number,
        location: number,
        metaKey: boolean,
        repeat: boolean,
        shiftKey: boolean
    }>

export type InjectionDispatchEventType = {
    eventDataFormat?: InjectionEventDataFormatType
    eventInit: InjectionEventInitType
} & (
    | {
        event: "InputEvent",
        eventType: "beforeinput"|"input"
    }
    | {
        event: "KeyboardEvent",
        eventType: "keydown"|"keyup"
    }
    | {
        event: "ClipboardEvent"
        eventType: "paste"
    }
    | {
        event: "Event",
        eventType: "change",
    }
)

export type FillFormat = {
    type: 'text/html'|'text/plain'
    // DOMPurify
    options?: {
        allowedAttr: string[],
        allowedTags: string[]
    }
}

export type InjectionAction = 
    | {
        injType: "dispatchEvent",
        event: InjectionDispatchEventType
        forceExec?: boolean
    }
    | {
        injType: "selectRange"
    }
    | {
        injType: "deleteRange"
    }
    | {
        injType: "insertFragAtRange",
        fillFormat: FillFormat
    }
    | {
        injType: "execCommand",
        command: 'insertHTML'|'delete'
        fillFormat?: FillFormat
    }
    | {
        injType: "fillElementValue",
        fillFormat: FillFormat
    }
    | {
        injType: 'setSelectionRange'
    }

export type ActionGroup = {
    injSteps: InjectionAction[],
    delayBtwnChars?: boolean,
    repeatPerChar?: boolean
}

type InjectionStrategy = {
    injStepGroups: ActionGroup[],
    selectors?: string[]
    urlRegexes?: string[]
}

export type InjectionInfo = {
    element: HTMLElement,
    abbrInfo: {
        abbrHotkey: string,
        abbrIndex: number,
    },
    text: string,
    trigClear: true,
    windowSelection: Selection|null,
}

export default InjectionStrategy;