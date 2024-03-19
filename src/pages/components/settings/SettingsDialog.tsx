import Dialog, { DialogInfoType } from '@/components/Dialog';
import styles from './SettingsDialog.module.sass'
import { useState } from 'react';
import SettingsCatalogue from './SettingsCatalogue';
import { useSettingsContext } from '@/pages/SettingsDataContext';

type Props = {
    openState: {open: boolean, setOpen: (newValue: boolean)=>any}
}

const SettingsDialog = (props: Props) => {
    const [dialogInfoData, setDialogInfoData] = useState<DialogInfoType>({ open: false })
    const [selected, setSelected] = useState<number>(0)

    const {settings, settingsDispatch} = useSettingsContext()

    const setDialogInfo = (e: DialogInfoType) => {
        console.log("Info was set")
        const { open, data } = e;
        setDialogInfoData(data)
        props.openState.setOpen(open)
    }

    return (
        <Dialog 
            dialogInfo={{info: {open: props.openState.open, data: dialogInfoData}, setInfo: setDialogInfo}} 
            dialogClassName={`bg-fuchsia-200 ${styles.baseDialog}`}>

                <div className={`${styles.innerDialog}`}>
                    <div>
                        {
                            SettingsCatalogue.map((model, index) => {
                                return <SettingsSection selected={index===selected} text={model.name} onClick={()=> setSelected(index)} key={index} />
                            })
                        }
                    </div>
                    <div className={`bg-fuchsia-100 max-h-full w-full p-4 ${styles.settingsContent}`}>
                        {
                            (SettingsCatalogue[selected].sectionContent)(settings, settingsDispatch)
                        }
                    </div>
                </div>
        </Dialog>
    )
}

type SettingsSectionProps = {
    text: string,
    selected: boolean,
    className?: string,
    onClick: (e: React.MouseEvent) => any
}

const SettingsSection = (props: SettingsSectionProps) => {
    const displayText = `${props.selected?'> ':''}${props.text}`

    return (
        <button className={`${props.className??''} px-2 py-4 text-xl w-full h-14`} onClick={props.onClick}>
            <p className={``}>{displayText}</p>
        </button>
    );
}

export default SettingsDialog;