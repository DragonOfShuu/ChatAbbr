import { getKey, setKey } from "./databaseAPI"

export const abbrKey = "abbreviations";

export type Options = {

}

export type AbbrType = {
    id: string,
    name: string,
    hotkeys: string[],
    output: string,
    options: Options
}

export const setAbbrList = async (value: AbbrType[]) => {
    await setKey(abbrKey, value)
}

const initAbbr = async () => {
    await setAbbrList([])
}

export const getAbbrList = async (): Promise<AbbrType[]> => {
    try {
        const value = (await getKey(abbrKey)) as AbbrType[]
        // THIS LINE IS ONLY HERE FOR DEBUGGING
        value.push({id: "urmom", hotkeys: ["-thx"], name: "Thank you!", options: {}, output: "Thank you for using this extension!"})
        return value
    } catch (e) { 
        initAbbr();
        return []; 
    }
}

export const getAbbr = async (text: string): Promise<AbbrType|undefined> => {
    const abbrList = await getAbbrList();
    return abbrList.find((abbr) => {
        return abbr.hotkeys.some((hotkey)=>(
            text.endsWith(hotkey)
        ))
    })
};

export const appendAbbr = async (abbr: AbbrType) => {
    const abbrList = await getAbbrList();
    abbrList.push(abbr)
    await setAbbrList(abbrList)
}

export const removeAtIndexAbbr = async (index: number) => {
    const abbrList = await getAbbrList();
    abbrList.splice(index, 1);
    await setAbbrList(abbrList);
}
