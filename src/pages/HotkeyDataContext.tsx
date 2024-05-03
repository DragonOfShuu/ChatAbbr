import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react"
import { AbbrType, setAbbrList } from "../database/abbrAPI";
import { generateUUID } from "../database/utilities";

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
    | { type: 'setHotkeys', hotkeys: AbbrType[]|{ [id: string]: AbbrType } }
    | { type: 'changeEdits', hotkey: AbbrType }
    | { type: 'discardEdits', ids: string[] }
    | { type: 'changeSelection', id: string }
    | { type: 'updateCurrentEdit', hotkey: Partial<AbbrType> }
    | { type: 'setCurrentEdit', hotkey: AbbrType|undefined }
    | { type: 'saveEdits', id: string|string[] }

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

function saveToBrowser(oldState: hotkeyData, newState: hotkeyData) {
    if (Object.is(oldState.hotkeyList, newState.hotkeyList)) 
        return 

    setAbbrList(Object.values(newState.hotkeyList))
}

function hotkeyReducer(state: hotkeyData, action: HotkeyAction|HotkeyAction[]): hotkeyData {
    let newState = {...state}
    const actions = Array.isArray(action)?[...action]:[action]
    let changes = false;

    // console.log('newState Before: ', JSON.parse(JSON.stringify(newState)))
    actions.forEach((x)=> {
        let value = hotkeyApi(newState, x);

        if (value===false) return;
        changes = true;
        newState = value;
    })
    // console.log("newState: ", JSON.parse(JSON.stringify(newState)))

    // Save Templates
    saveToBrowser(state, newState)

    // If there are no changes, let's *not* update the entire UI
    return changes?newState:state;
}
 
function hotkeyApi(newState: hotkeyData, action: HotkeyAction): hotkeyData|false {
    switch (action.type) {
        case 'create': // Create new hotkey and add it to the currentEdit
            const id = generateUUID()
            let newHotkey: AbbrType = {
                id: id,
                hotkeys: ["-nt"],
                name: "New Template",
                output: '',
                options: {}
            }
            newState.currentHotkeyEdit = newHotkey;
            newState.hasEdits = {[id]: newHotkey, ...newState.hasEdits};
            return newState;
            
        
        case 'change': // Change a hotkey by giving a replacement. Will also allow you to add a hotkey that doesn't exist
            newState.hotkeyList = changeOrUnshift({...newState.hotkeyList}, action.replacement.id, {...action.replacement})
            return newState

        
        case 'updateCurrentEdit': // Update the currentEdit with partial data. Also automatically saves into edits
            if (newState.currentHotkeyEdit===undefined) return false
            newState.currentHotkeyEdit = {
                ...newState.currentHotkeyEdit,
                ...action.hotkey
            };
            newState.hasEdits[newState.currentHotkeyEdit.id] = newState.currentHotkeyEdit
            return newState;

        
        case 'setCurrentEdit': // Set the currentEdit with full data
            newState.currentHotkeyEdit = action.hotkey?{...action.hotkey}:undefined;
            return newState;

        
        case 'remove': // Remove templates
            console.log("Removing templates...")
            const editIds = Object.keys(newState.hasEdits);
            // For safety reasons, let's not remove templates
            // unless changes have been discarded
            const removeables = action.ids.filter((id)=> !editIds.includes(id));

            removeables.forEach((id)=> delete newState.hotkeyList[id])
            newState.hotkeyList = {...newState.hotkeyList} // Create new object to trigger react

            if (newState.currentHotkeyEdit && removeables.includes(newState.currentHotkeyEdit?.id))
                newState.currentHotkeyEdit = undefined
            return newState;

        
        case "setHotkeys": // Set entire hotkey list
            if (!Array.isArray(action.hotkeys)) 
                newState.hotkeyList = {...action.hotkeys}
            else {
                const hotkeyObject: {[id: string]: AbbrType} = {}
                action.hotkeys.forEach((h)=> hotkeyObject[h.id] = {...h})
                newState.hotkeyList = hotkeyObject
            }
            
            return newState

        
        case "changeEdits": // Set whether the currentEdit has edits
            newState.hasEdits = {...{...newState.hasEdits}, [action.hotkey.id]: {...action.hotkey}}
            return newState;


        case "discardEdits":
            const hasEdits1 = {...newState.hasEdits}
            action.ids.forEach((id)=> 
                delete hasEdits1[id]
            );
            newState.hasEdits = hasEdits1
            return newState;

        
        case "saveEdits":
            // IT'S HOW WE ARE CLEARING THE EDITS
            // const edits: string[] = newState.hasEdits[action.id]
            const hasEdits = {...newState.hasEdits}
            const editIds1: string[] = Array.isArray(action.id)?[...action.id]:[action.id]
            const edits: AbbrType[] = []
            editIds1.forEach((e)=> {
                let currentEdit = hasEdits[e]
                if (currentEdit) edits.push({...currentEdit})
            })
            if (!edits) return false;

            edits.forEach((e)=> {
                newState.hotkeyList = changeOrUnshift(newState.hotkeyList, e.id, e)
                delete hasEdits[e.id]
            })
            newState.hasEdits = hasEdits // Trigger react
            newState.hotkeyList = {...newState.hotkeyList} // Because development mode is bugged
            
            // console.log(newState)
            return newState;

        
        case "changeSelection": // Change currentHotkeyEdit by id
            newState.currentHotkeyEdit = {...newState.hotkeyList[action.id]}
            return newState
    }
}

function changeOrUnshift(object: any, id: string, data: any) {
    if (object[id]) {
        object[id] = {...data}
        return {...object}
    }

    return { [id]: {...data}, ...object }
}


// I feel, alive, tonighttt, heyeyy heeeyy eey ey!