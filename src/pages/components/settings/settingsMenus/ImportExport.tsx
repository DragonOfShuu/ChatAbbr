import { SettingsType } from "@/database/settingsAPI";
import { SettingsSectionModel } from "../SettingTypes";
import { SettingsActionType } from "@/pages/SettingsDataContext";
import SpecialButton from "@/components/SpecialButton";
import { useRef } from "react";
import { useHotkeyContext, useHotkeyDispatchContext } from "@/pages/HotkeyDataContext";
import { exportFiles, importFileList } from "@/utilities/ImportExportHotkeys";
import { AbbrType } from "@/database/abbrAPI";
import { useGlobalMessageContext } from "@/components/GlobalUserMessage";
import { useErrorDisplay } from "@/components/ErrorDisplayDiv";


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

        const blob = new Blob([exportFiles(hotkeyData.hotkeyList)], { type: "application/json" });
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
    const {errorDisplayDispatch} = useErrorDisplay()

    const hotkeyData = useHotkeyContext();
    const hotkeyDispatch = useHotkeyDispatchContext();
    const {globalMessageDispatch} = useGlobalMessageContext();

    const filepickRef = useRef<HTMLInputElement>(null);

    const fileChanged = async (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        if (!filepickRef.current || !filepickRef.current.files) return;

        const files: FileList = filepickRef.current.files;
        const clearList = () => {
            changeEvent.target.value = ''; // Reset file list so changeevent works again
            // Safari
            changeEvent.target.type = '';
            changeEvent.target.type = 'file';
        }
        
        let indexedHotkeys: { [id: string]: AbbrType; };
        try {
            indexedHotkeys = await importFileList(files)
        } catch (e) {
            clearList();
            let message: string;
            if (e instanceof Error) {
                message = e.message;
            } else {
                message = e as string;
            }
            console.log(message)
            globalMessageDispatch({type: 'NewMessage', messages: {text: message, type: "error"}})
            errorDisplayDispatch({type: "newError", error: {message: message, type: 'critical'}})

            return
        }

        clearList()
        hotkeyDispatch({type: 'setHotkeys', hotkeys: {...indexedHotkeys, ...hotkeyData.hotkeyList}})
    }
    
    return (
        <>
            <input 
                type="file" 
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=> fileChanged(e)} 
                className="collapse hidden"
                ref={filepickRef} />
            <SpecialButton onClick={()=> filepickRef.current?.click()}>
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
