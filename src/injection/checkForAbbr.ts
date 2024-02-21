import { getAbbrList } from "../database/abbrAPI";

export const findAbbr = async (currentText: string) => {
    const abbrList = await getAbbrList();

    let hotkeyUsed: string|undefined;
    const abbr = abbrList.find((abbr)=> (
        abbr.hotkeys.some((hotkey) => {
            if (!currentText.endsWith(hotkey)) 
                return false;
            
            hotkeyUsed = hotkey;
            return true;
        })
    ))

    return abbr&&hotkeyUsed?{abbr: abbr, hotkey: hotkeyUsed}:undefined;
}
 
export default findAbbr;