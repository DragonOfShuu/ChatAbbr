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
    const hotkeyData = useHotkeyContext();
    const hotkeyDispatch = useHotkeyDispatchContext();

    const linkRef = useRef<HTMLAnchorElement>(null)
    const filepickRef = useRef<HTMLInputElement>(null);

    const exportHotkeys = () => {
        if (!linkRef.current) return;
        // const hotkeys = {hotkeys: (await getAbbrList())};
        const hotkeys = {"version": abbrVersion, [abbrsKey]: hotkeyData.hotkeyList}

        const blob = new Blob([JSON.stringify(hotkeys)], { type: "application/json" });
        const blobURL = URL.createObjectURL(blob);

        linkRef.current.href = blobURL;
        linkRef.current.download = "hotkeys.json";
        linkRef.current.click();
    }

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

    const fileChanged = async () => {
        if (!filepickRef.current || !filepickRef.current.files) return;
        
        const pendingFiles = Array.from(filepickRef.current.files)
        const files: string[] = []
        for (let i = 0; i<pendingFiles.length; i++) 
            files[i] = await pendingFiles[i].text()

        let newHotkeyList: AbbrType[];
        try {
            newHotkeyList = convertFiles(files);
        } catch (e) {
            console.log(e)
            return
        }

        const indexedHotkeys = newHotkeyList.reduce<{[id: string]: AbbrType}>((builder, h, index)=> {
            const uuid = generateUUID()+index
            builder[uuid] = {...h, id: uuid}
            return builder // Attempt to make unique id
        }, {})

        hotkeyDispatch({type: 'setHotkeys', hotkeys: {...indexedHotkeys, ...hotkeyData.hotkeyList}})
    }

    return (
        <div className={`w-full h-full`}>
            <h1>{`Hotkey Import/Export`}</h1>

            <a target="_blank" href="about:blank" rel="noreferrer" className="collapse hidden" ref={linkRef}>{`bruh`}</a>
            <SpecialButton onClick={exportHotkeys}>
                Export My Hotkeys
            </SpecialButton>

            <input type="file" onChange={fileChanged} className="collapse hidden" ref={filepickRef} />
            <SpecialButton onClick={importHotkeysClick}>
                Import My Hotkeys
            </SpecialButton>
        </div>
    )
}

const ImportExportPage: SettingsSectionModel = {
    name: "Import/Export Hotkeys",
    sectionContent: (settings, settingsDispatch)=> (
        <ImportExportUI settings={settings} settingsDispatch={settingsDispatch} />
    )
}

export default ImportExportPage;
