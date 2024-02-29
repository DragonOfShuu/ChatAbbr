import React from 'react'
import Dialog, { DialogProps, dialogFunc } from './Dialog'

type Props = {yesFunc: dialogFunc, noFunc: dialogFunc} & Omit<DialogProps, 'buttons'>

const BooleanDialog = ({yesFunc, noFunc, ...props}: Props) => {
    // const dialogInfo: DialogProps = {}

    return (
        <Dialog {...props} buttons={[{text: "YES", func: yesFunc}, {text: "NO", func: noFunc}]}>

        </Dialog>
    )
}

export default BooleanDialog
