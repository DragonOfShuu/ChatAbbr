import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"
import { AbbrType } from "../database/abbrAPI";
import { generateUUID } from "../database/utilities";
import { ListIntersection } from "@/utilities";

export type hotkeyData = {
    currentHotkeyEdit?: AbbrType
    hotkeyList: { [id: string]: AbbrType }
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
    | { type: 'saveEdits', id: string }

const hotkeyContext = createContext<hotkeyData|null>(null);
const hotkeyDispatchContext = createContext<Dispatch<HotkeyAction>|null>(null);

export default function HotkeyDataContext({ children }: {children: ReactNode}) {
    const [hotkeys, hotkeyDispatch] = useReducer(hotkeyReducer, {hotkeyList: {}, hasEdits: {}, dataHasBeenSet: false})

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
            newState.hotkeyList = changeOrUnshift(newState.hotkeyList, action.replacement.id, action.replacement)
            return newState
        
        case 'updateCurrentEdit': // Update the currentEdit with partial data
            if (newState.currentHotkeyEdit===undefined) return false
            newState.currentHotkeyEdit = {
                ...newState.currentHotkeyEdit,
                ...action.hotkey
            };
            newState.hasEdits[newState.currentHotkeyEdit.id] = newState.currentHotkeyEdit
            return newState;
        
        case 'setCurrentEdit': // Set the currentEdit with full data
            newState.currentHotkeyEdit = {...action.hotkey};
            return newState;
        
        case 'remove': // Remove templates
            if ( ListIntersection(action.ids, Object.keys(newState.hasEdits)) ) return false
            action.ids.forEach((id)=> delete newState.hotkeyList[id])
            if (newState.currentHotkeyEdit && action.ids.includes(newState.currentHotkeyEdit?.id))
                newState.currentHotkeyEdit = undefined
            return newState;
        
        case "setHotkeys": // Set entire hotkey list
            const hotkeyObject: {[id: string]: AbbrType} = {}
            action.hotkeys.forEach((h)=> hotkeyObject[h.id] = h)
            newState.hotkeyList = hotkeyObject
            return newState
        
        case "changeEdits": // Set whether the currentEdit has edits
            newState.hasEdits[action.hotkey.id] = action.hotkey
            return newState;

        case "discardEdits":
            action.ids.forEach((id)=> 
                delete newState.hasEdits[id]
            )
            return newState
        
        case "saveEdits":
            const edits = newState.hasEdits[action.id]
            if (edits===undefined) return false;
            newState.hotkeyList = changeOrUnshift(newState.hotkeyList, edits.id, edits)
            delete newState.hasEdits[action.id]
            return newState;
        
        case "changeSelection": // Change currentHotkeyEdit by id
            newState.currentHotkeyEdit = newState.hotkeyList[action.id]
            return newState
    }
}

function changeOrUnshift(object: any, id: string, data: any) {
    if (object[id]) {
        object[id] = data
        return {...object}
    }

    object = {id: data, ...object}
}


// I feel, alive, tonighttt, heyeyy heeeyy eey ey!