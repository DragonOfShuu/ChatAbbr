import { DefaultSettings, SettingsType, getSettings } from "@/database/settingsAPI";
import { ReactNode, createContext, useContext, useEffect, useReducer } from "react";

const SettingsContext = createContext<{settings: SettingsType, settingsDispatch: {}}|null>(null)

type Props = {
    children: ReactNode
}

type ActionType =
    | { type: 'setSettings', settings: SettingsType }
    | { type: 'updateSettings', partialSettings: Partial<SettingsType> }

const SettingsDataContext = (props: Props) => {
    const [settings, settingsDispatch] = useReducer(settingsReducer, DefaultSettings)

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
    return useContext(SettingsContext)
}

function settingsReducer(state: SettingsType, action: ActionType) {
    return state;
}

function settingsSwitchSet(oldState: SettingsType, action: ActionType) {
    const newState = {...oldState}
    switch (action.type) {
        case 'setSettings':
            return false;
        
        case 'updateSettings':
            return false;
    
        default:
            throw Error(
`Settings action has not been implemented. Internal client error.
I know you're probably not in a good mood, but I'm listening to some epic music rn`
            );
    }
    
}

export default SettingsDataContext;
