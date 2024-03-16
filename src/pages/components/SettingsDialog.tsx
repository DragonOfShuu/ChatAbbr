import Dialog, { DialogInfoType } from '@/components/Dialog';
import styles from './SettingsDialog.module.sass'
import { ReactNode, useState } from 'react';
import { SettingsType } from '@/database/settingsAPI';
import { SettingsActionType } from '../SettingsDataContext';

type Props = {
    openState: {open: boolean, setOpen: (newValue: boolean)=>any}
}

type SettingsSectionModel = {
    name: string,
    sectionContent: (settings: SettingsType, settingsDispatch: React.Dispatch<SettingsActionType>)=>ReactNode
}

const SettingsDialog = (props: Props) => {
    const [dialogInfoData, setDialogInfoData] = useState<DialogInfoType>({ open: false })

    const setDialogInfo = (e: DialogInfoType) => {
        console.log("Info was set")
        const { open, data } = e;
        setDialogInfoData(data)
        props.openState.setOpen(open)
    }

    return (
        <Dialog 
            dialogInfo={{info: {open: props.openState.open, data: dialogInfoData}, setInfo: setDialogInfo}} 
            dialogClassName={`bg-fuchsia-200`}>

                <div className={`${styles.settingsDialog}`}>
                    <div>

                    </div>
                    <div className={`bg-fuchsia-100`}>

                    </div>
                </div>
        </Dialog>
    )
}

type SettingsSectionProps = {
    text: string,
    selected: boolean,
    className?: string
}

const SettingsSection = (props: SettingsSectionProps) => {
    const displayText = `${props.selected?'> ':''}${props.text}`

    return (
        <div className={`${props.className??''} px-2 py-4 text-xl w-full h-14`}>
            <p className={``}>{displayText}</p>
        </div>
    );
}

export default SettingsDialog;