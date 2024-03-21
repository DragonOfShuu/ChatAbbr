import { AbbrType, abbrVersion } from "@/database/abbrAPI";
import { generateUUID } from "@/database/utilities";

const abbrsKey = "abbrs";

const convertFiles = (fileTexts: string[]) => (
    fileTexts.reduce<AbbrType[]>((builder, curr) => {
        const data = JSON.parse(curr)
        if (!(abbrsKey in data) || !("version" in data)) 
            throw new Error("Data does not contain hotkeys");
        
        if (data["version"] > abbrVersion) 
            throw new Error("Imported hotkeys are a later version than your extension. Consider updating");
        
        // Here all we can do is make a leap of faith
        const hotkeys: AbbrType[] = data[abbrsKey];

        builder.push(...hotkeys);

        return builder
    }, [])
)

export const importTexts = (...files: string[]) => {
    let newHotkeyList: AbbrType[];

    newHotkeyList = convertFiles(files);
    
    const indexedHotkeys = newHotkeyList.reduce<{[id: string]: AbbrType}>((builder, h, index)=> {
        const uuid = generateUUID()+index // Attempt to make unique id
        builder[uuid] = {...h, id: uuid}
        return builder 
    }, {})
    
    return indexedHotkeys;
}

export const importFiles = async (...pendingFiles: File[]) => {
    const files: string[] = []
    for (let i = 0; i<pendingFiles.length; i++) 
        files[i] = await pendingFiles[i].text()

    return importTexts(...files);
}

export const importFileList = async (list: FileList) => {
    const files = Array.from(list)
    return await importFiles(...files);
}

export const exportFiles = (hotkeyList: {[id: string]: AbbrType}) => {
    return JSON.stringify({"version": abbrVersion, [abbrsKey]: Object.values(hotkeyList)})
}