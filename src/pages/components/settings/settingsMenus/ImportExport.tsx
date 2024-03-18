import { SettingsType } from "@/database/settingsAPI";
import { SettingsSectionModel } from "../SettingTypes";
import { SettingsActionType } from "@/pages/SettingsDataContext";

type Props = {
    settings: SettingsType,
    settingsDispatch: React.Dispatch<SettingsActionType>,
}

const ImportExportUI = (props: Props) => {
    return <div>
        My fav content
    </div>
}

const ImportExportPage: SettingsSectionModel = {
    name: "Import/Export Hotkeys",
    sectionContent: (settings, settingsDispatch)=> (
        <ImportExportUI settings={settings} settingsDispatch={settingsDispatch} />
    )
}

export default ImportExportPage;