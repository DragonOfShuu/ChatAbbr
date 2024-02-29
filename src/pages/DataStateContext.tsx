import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"
import { AbbrType } from "../database/abbrAPI";
import { generateUUID } from "../database/utilities";
import { ListIntersection } from "@/utilities";

export type hotkeyData = {
    currentHotkeyEdit?: AbbrType
    hotkeyList: AbbrType[]
    hasEdits: { [id: string]: AbbrType }
    dataHasBeenSet: boolean
}

export type HotkeyAction = 
    | { type: 'create' }
    | { type: 'remove', ids: string[] }
    | { type: 'change', replacement: AbbrType }
    | { type: 'setHotkeys', hotkeys: AbbrType[] }
    | { type: 'changeEdits', hotkey: AbbrType }
    | { type: 'discardEdits', ids: string[] }
    | { type: 'changeSelection', id: string }
    | { type: 'updateCurrentEdit', hotkey: Partial<AbbrType> }
    | { type: 'setCurrentEdit', hotkey: AbbrType }

const hotkeyContext = createContext<hotkeyData|null>(null);
const hotkeyDispatchContext = createContext<Dispatch<HotkeyAction>|null>(null);

export default function HotkeyDataContext({ children }: {children: ReactNode}) {
    const [hotkeys, hotkeyDispatch] = useReducer(hotkeyReducer, {hotkeyList: [], hasEdits: {}, dataHasBeenSet: false})

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
    return useContext(hotkeyDispatchContext) as Dispatch<HotkeyAction|HotkeyAction[]>;
}

function hotkeyReducer(state: hotkeyData, action: HotkeyAction|HotkeyAction[]): hotkeyData {
    const newState = {...state}
    const actions = Array.isArray(action)?action:[action]
    let changes = false;
    actions.forEach((x)=> {
        let value = hotkeyApi(newState, x);

        if (value===false) return;
        changes = true;
    })
    // If there are no changes, let's *not* update the entire UI
    return changes?newState:state;
}

function hotkeyApi(newState: hotkeyData, action: HotkeyAction): hotkeyData|false {
    switch (action.type) {
        case 'create': // Create new hotkey and add it to the currentEdit
            let newHotkey: AbbrType = {
                id: generateUUID(),
                hotkeys: ["-hw"],
                name: "New Hotkey",
                output: "Hello World! (Thankfully not homework)",
                options: {}
            }
            newState.currentHotkeyEdit = newHotkey
            return newState;
        
        case 'change': // Change a hotkey by giving a replacement. Will also allow you to add a hotkey that doesn't exist
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
        
        case 'updateCurrentEdit': // Update the currentEdit with partial data
            if (newState.currentHotkeyEdit===undefined) return false
            newState.currentHotkeyEdit = {
                ...newState.currentHotkeyEdit,
                ...action.hotkey
            };
            return newState;
        
        case 'setCurrentEdit': // Set the currentEdit with full data
            newState.currentHotkeyEdit = {...action.hotkey};
            return newState;
        
        case 'remove': // Remove templates
            if ( ListIntersection(action.ids, Object.keys(newState.hasEdits)) ) return false
            newState.hotkeyList = newState.hotkeyList.filter((x)=> !action.ids.includes(x.id));
            if (newState.currentHotkeyEdit && action.ids.includes(newState.currentHotkeyEdit.id))
                newState.currentHotkeyEdit = undefined
            return newState;
        
        case "setHotkeys": // Set entire hotkey list
            newState.hotkeyList = action.hotkeys;
            return newState
        
        case "changeEdits": // Set whether the currentEdit has edits
            newState.hasEdits[action.hotkey.id] = action.hotkey
            return newState;

        case "discardEdits":
            action.ids.forEach((id)=> 
                delete newState.hasEdits[id]
            )
            return newState
        
        case "changeSelection": // Change currentHotkeyEdit by id
            newState.currentHotkeyEdit = newState.hotkeyList.find((h)=> h.id===action.id)
            return newState
    }
}



// I feel, alive, tonighttt, heyeyy heeeyy eey ey!