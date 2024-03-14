import { getKey, setKey } from "./databaseAPI"

export const settingsKey = "settings";

export type SettingsType = {

}

export const DefaultSettings: SettingsType = {

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
    await setSettings(value)
    return newData
}
