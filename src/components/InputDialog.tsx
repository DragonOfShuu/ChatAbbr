import Dialog, { DialogProps, dialogFunc } from "./Dialog"
import SpecialButton from "./SpecialButton"

export type InputDialogType = {
    buttons: {text: string, func: dialogFunc}[]
} & DialogProps

const InputDialog = ({dialogInfo: {info, setInfo}, ...props}: InputDialogType) => {
    const buttonClicked = (e: React.MouseEvent, func: dialogFunc) => {
        const shouldClose = func?func(e, info.data):true
        if (shouldClose===undefined || shouldClose) {
            console.log("Button clicked, and closing")
            setInfo({...info, open: false})
        }
    }

    return (
        <Dialog dialogInfo={{info: info, setInfo: setInfo}}>
            <div className={`grow p-10 flex flex-col gap-10`}>
                    <div className='grow text-2xl'>
                        {props.children}
                    </div>
                    {
                        props.buttons?
                            <div className={`flex flex-row justify-evenly`}> 
                                {
                                    props.buttons.map((buttonData, index)=>(
                                        <SpecialButton onClick={(e)=> buttonClicked(e, buttonData.func)} key={index} className='py-2 text-lg'>
                                            {buttonData.text}
                                        </SpecialButton>
                                    ))
                                }
                            </div>
                            :
                            <></>
                    }
                </div>
        </Dialog>
    )
}

export default InputDialog;