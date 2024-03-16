import Dialog, { DialogInfoType } from '@/components/Dialog';
import styles from './SettingsDialog.module.sass'
import { useState } from 'react';

type Props = {
    openState: {open: boolean, setOpen: (newValue: boolean)=>any}
}

const SettingsDialog = (props: Props) => {
    const [dialogInfoData, setDialogInfoData] = useState<DialogInfoType>({ open: false })

    const setDialogInfo = (e: DialogInfoType) => {
        const { open, data } = e;
        setDialogInfoData(data)
        props.openState.setOpen(open)
    }

    return (
        <Dialog 
            dialogInfo={{info: {open: props.openState.open, data: dialogInfoData}, setInfo: setDialogInfo}} 
            dialogClassName={`bg-fuchsia-200`}>
            <div>

            </div>
            <div className={`bg-fuchsia-100`}>

            </div>
        </Dialog>
    )
}

export default SettingsDialog;