import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"
import { AbbrType } from "../database/abbrAPI";
import { generateUUID } from "../database/utilities";

export type hotkeyData = {
    currentHotkeyEdit?: AbbrType
    hotkeyList: AbbrType[]
    hasEdits: boolean
    dataHasBeenSet: boolean
}

export type HotkeyAction = 
    | { type: 'create' }
    | { type: 'remove', ids: string[] }
    | { type: 'change', replacement: AbbrType }
    | { type: 'setHotkeys', hotkeys: AbbrType[] }
    | { type: 'changeEdits', hasEdits: boolean }
    | { type: 'changeSelection', id: string }
    | { type: 'updateCurrentEdit', hotkey: Partial<AbbrType> }
    | { type: 'setCurrentEdit', hotkey: AbbrType }

const hotkeyContext = createContext<hotkeyData|null>(null);
const hotkeyDispatchContext = createContext<Dispatch<HotkeyAction>|null>(null);

export default function HotkeyDataContext({ children }: {children: ReactNode}) {
    const [hotkeys, hotkeyDispatch] = useReducer(hotkeyReducer, {hotkeyList: [], hasEdits: false, dataHasBeenSet: false})

    return (
        // <context
        <hotkeyContext.Provider value={hotkeys}>
            <hotkeyDispatchContext.Provider value={hotkeyDispatch}>
                {children}
            </hotkeyDispatchContext.Provider>
        </hotkeyContext.Provider>
    )
}

export function useHotkeyContext() {
    return useContext(hotkeyContext) as hotkeyData;
}

export function useHotkeyDispatchContext() {
    return useContext(hotkeyDispatchContext) as Dispatch<HotkeyAction>;
}

function hotkeyReducer(state: hotkeyData, action: HotkeyAction): hotkeyData {
    const newState = {...state}
    switch (action.type) {
        case 'create':
            if (state.hasEdits) return state
            let newHotkey: AbbrType = {
                id: generateUUID(),
                hotkeys: ["-hw"],
                name: "New Hotkey",
                output: "Hello World! (Thankfully not homework)",
                options: {}
            }
            newState.currentHotkeyEdit = newHotkey
            return newState;
        
        case 'change':
            let changeOccurred = false;
            newState.hotkeyList = newState.hotkeyList.map((h)=>{ 
                if (h.id!==action.replacement.id)
                    return h
                changeOccurred = true;
                return action.replacement
            })
            if (changeOccurred) return newState
            newState.hotkeyList.unshift(action.replacement)
            return newState;
        
        case 'updateCurrentEdit': 
            if (newState.currentHotkeyEdit===undefined) return state
            newState.currentHotkeyEdit = {
                ...newState.currentHotkeyEdit,
                ...action.hotkey
            };
            return newState;
        
        case 'setCurrentEdit':
            newState.currentHotkeyEdit = action.hotkey;
            return newState;
        
        case 'remove':
            newState.hotkeyList = newState.hotkeyList.filter((x)=> !action.ids.includes(x.id));
            if (newState.currentHotkeyEdit && action.ids.includes(newState.currentHotkeyEdit.id))
                newState.currentHotkeyEdit = undefined
            return newState;
        
        case "setHotkeys":
            newState.hotkeyList = action.hotkeys;
            return newState
        
        case "changeEdits":
            newState.hasEdits = action.hasEdits
            return newState
        
        case "changeSelection":
            if (state.hasEdits) return state
            newState.currentHotkeyEdit = newState.hotkeyList.find((h)=> h.id===action.id)
            return newState
    }
}

// I feel, alive, tonighttt, heyeyy heeeyy eey ey!