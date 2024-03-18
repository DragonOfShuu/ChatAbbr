import { DefaultSettings as defaultSettings, SettingsType, getSettings } from "@/database/settingsAPI";
import { ReactNode, createContext, useContext, useEffect, useReducer } from "react";

export type SettingsContextType = {settings: SettingsType, settingsDispatch: (value: SettingsActionType)=>void}; 
const SettingsContext = createContext<SettingsContextType|null>(null)

type Props = {
    children: ReactNode
}

export type SettingsActionType =
    | { type: 'setSettings', settings: SettingsType }
    | { type: 'updateSettings', partialSettings: Partial<SettingsType> }

const SettingsDataContext = (props: Props) => {
    const [settings, settingsDispatch] = useReducer(settingsReducer, defaultSettings)

    useEffect(()=> {
        getSettings().then((value)=> {
            settingsDispatch({type: 'setSettings', settings: value})
        })
    }, [])

    return (
        <SettingsContext.Provider value={{settings: settings, settingsDispatch: settingsDispatch}}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export const useSettingsContext = () => {
    return useContext(SettingsContext) as SettingsContextType;
}

function settingsReducer(state: SettingsType, action: SettingsActionType): SettingsType {
    const returned = settingsSwitchSet(state, action);
    if (!returned) return state
    return returned;
}

function settingsSwitchSet(oldState: SettingsType, action: SettingsActionType): false|SettingsType {
    const newState = {...oldState}
    switch (action.type) {
        case 'setSettings':
            return {...action.settings};
        

        case 'updateSettings':
            // We don't want to trigger unnecessary updates
            const noChanges = Object.keys(action.partialSettings).every((k) => {
                const key = k as keyof SettingsType;
                const obj: any = defaultSettings[key];
                return Object.is(obj, oldState[key]) || obj===oldState[key]
            })
            if (noChanges) return false;
            return {...newState, ...action.partialSettings}
    

        default:
            throw Error(
`Settings action has not been implemented. Internal client error.
I know you're probably not in a good mood, but I'm listening to some epic music rn`
            );
    }
    
}

export default SettingsDataContext;
