import { dialogFunc } from './Dialog'
import InputDialog, { InputDialogType } from './InputDialog'

type Props = 
    {yesFunc: dialogFunc, noFunc: dialogFunc} 
    // Using InputDialogType for readability and 
    // reusability even though DialogProps works too
    & Omit<InputDialogType, 'buttons'>

const BooleanDialog = ({yesFunc, noFunc, ...props}: Props) => {
    return (
        <InputDialog {...props} buttons={[{text: "YES", func: yesFunc}, {text: "NO", func: noFunc}]}>

        </InputDialog>
    )
}

export default BooleanDialog
