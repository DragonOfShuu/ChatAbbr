import { SettingsType } from "@/database/settingsAPI";
import { SettingsSectionModel } from "../SettingTypes";
import { SettingsActionType } from "@/pages/SettingsDataContext";
import SpecialButton from "@/components/SpecialButton";
import { useRef } from "react";
import { useHotkeyContext, useHotkeyDispatchContext } from "@/pages/HotkeyDataContext";
import { AbbrType, abbrVersion } from "@/database/abbrAPI";
import { generateUUID } from "@/database/utilities";

const abbrsKey = "abbrs";

type Props = {
    settings: SettingsType,
    settingsDispatch: React.Dispatch<SettingsActionType>,
}

const ImportExportUI = (props: Props) => {
    return (
        <div className={`w-full h-full`}>
            <h1>{`Hotkey Import/Export`}</h1>

            <ExportHotkeys />

            <ImportHotkeys />
        </div>
    )
}

const ExportHotkeys = (props: {}) => {
    const hotkeyData = useHotkeyContext();

    const linkRef = useRef<HTMLAnchorElement>(null)

    const exportHotkeys = () => {
        if (!linkRef.current) return;
        // const hotkeys = {hotkeys: (await getAbbrList())};
        const hotkeys = {"version": abbrVersion, [abbrsKey]: Object.values(hotkeyData.hotkeyList)}

        const blob = new Blob([JSON.stringify(hotkeys)], { type: "application/json" });
        const blobURL = URL.createObjectURL(blob);

        linkRef.current.href = blobURL;
        linkRef.current.download = "hotkeys.json";
        linkRef.current.click();
    }

    return (
        <>
            <a target="_blank" href="about:blank" rel="noreferrer" className="collapse hidden" ref={linkRef}>{`bruh`}</a>
            <SpecialButton onClick={exportHotkeys}>
                Export My Hotkeys
            </SpecialButton>
        </>
    )
}

const ImportHotkeys = (props: {}) => {
    const hotkeyData = useHotkeyContext();
    const hotkeyDispatch = useHotkeyDispatchContext();

    const filepickRef = useRef<HTMLInputElement>(null);

    const importHotkeysClick = async () => {
        if (!filepickRef.current) return;
        
        filepickRef.current.click();
    }

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

    const fileChanged = async (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File changed")
        if (!filepickRef.current || !filepickRef.current.files) return;
        console.log("Okay to continue")
        
        const pendingFiles = Array.from(filepickRef.current.files)
        const files: string[] = []
        for (let i = 0; i<pendingFiles.length; i++) 
            files[i] = await pendingFiles[i].text()
        console.log("Files text: ", files)

        let newHotkeyList: AbbrType[];
        try {
            newHotkeyList = convertFiles(files);
            console.log("New hotkey list: ", newHotkeyList)
        } catch (e) {
            console.log(e)
            return
        }

        const indexedHotkeys = newHotkeyList.reduce<{[id: string]: AbbrType}>((builder, h, index)=> {
            const uuid = generateUUID()+index // Attempt to make unique id
            builder[uuid] = {...h, id: uuid}
            return builder 
        }, {})

        console.log(`Indexed hotkeys:`, indexedHotkeys)
        console.log(`Current hotkeydata list:`, hotkeyData.hotkeyList)

        hotkeyDispatch({type: 'setHotkeys', hotkeys: {...indexedHotkeys, ...hotkeyData.hotkeyList}})
        changeEvent.target.value = ''; // Reset file list so changeevent works again
        // Safari
        changeEvent.target.type = '';
        changeEvent.target.type = 'file';
    }
    
    return (
        <>
            <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>)=> fileChanged(e)} className="collapse hidden" ref={filepickRef} />
            <SpecialButton onClick={importHotkeysClick}>
                Import My Hotkeys
            </SpecialButton>
        </>
    )
}

const ImportExportPage: SettingsSectionModel = {
    name: "Import/Export Hotkeys",
    sectionContent: (settings, settingsDispatch)=> (
        <ImportExportUI settings={settings} settingsDispatch={settingsDispatch} />
    )
}

export default ImportExportPage;
