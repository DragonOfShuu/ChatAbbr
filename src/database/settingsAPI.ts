import { getKey, setKey } from "./databaseAPI"

export const settingsKey = "settings";

export type SettingsType = {
    theme: 'auto'|'dark'|'light'
}

export const DefaultSettings: SettingsType = {
    theme: 'auto'
}

export const setSettings = async (value: SettingsType) => {
    await setKey(settingsKey, value)
}

const initSettings = async () => {
    await setSettings(DefaultSettings)
}

export const getSettings = async (): Promise<SettingsType> => {
    try {
        const value = (await getKey(settingsKey)) as SettingsType
        return value
    } catch (e) { 
        initSettings();
        return {...DefaultSettings}; 
    }
}

export const updateSettings = async (value: Partial<SettingsType>): Promise<SettingsType> => {
    const newData: SettingsType = {...(await getSettings()), ...value}
    await setSettings(newData)
    return newData
}
