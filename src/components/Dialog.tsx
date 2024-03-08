import { ReactNode, useEffect, useRef } from 'react'
import styles from './Dialog.module.sass'
import plusIcon from '@/icons/plusIcon.svg'
import SvgButton from './SvgButton'
import SpecialButton from './SpecialButton'

export type dialogFunc = undefined|((e: React.MouseEvent<Element, MouseEvent>, data?: any) => boolean | void | undefined)
export type DialogInfoType = {open: boolean, data?: any}

export type DialogProps = {
    dialogInfo: {info: DialogInfoType, setInfo: (e: DialogInfoType)=>any},
    className?: string,
    children?: ReactNode
    buttons?: {text: string, func: dialogFunc}[]
}

const Dialog = ({dialogInfo: {info, setInfo}, ...props}: DialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const buttonClicked = (e: React.MouseEvent, func: dialogFunc) => {
        const shouldClose = func?func(e, info.data):true
        if (shouldClose===undefined || shouldClose) {
            console.log("Button clicked, and closing")
            dialogRef.current?.close()
            setInfo({...info, open: false})
        }
    }

    useEffect(()=> {
        if (dialogRef.current===null) return
        if (info.open===dialogRef.current.open) return

        if (info.open) {
            dialogRef.current.showModal()
            console.log("Instructed to show modal.")
        }
        else {
            console.log("Insructed to close")
            dialogRef.current.close()
        }
    }, [info])

    return (
        <dialog ref={dialogRef} className={`${styles.dialog}`}>
            <div className={`flex flex-col gap-2 items-stretch ${props.className??''}`}>
                <div className='h-3 flex flex-row'>
                    <div className={`grow`} />
                    <SvgButton image={plusIcon} onClick={()=>dialogRef.current?.close()} className={`rotate-45`} />
                </div>
                <div className={`grow p-10 flex flex-col gap-10`}>
                    <div className='grow text-2xl'>
                        {props.children}
                    </div>
                    <div className={`flex flex-row justify-evenly`}> {/* TODO: Make buttons go in center and spread out */}
                        {
                            props.buttons?.map((buttonData, index)=>(
                                <SpecialButton onClick={(e)=> buttonClicked(e, buttonData.func)} key={index} className='py-2 text-lg'>
                                    {buttonData.text}
                                </SpecialButton>
                            ))
                        }
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default Dialog