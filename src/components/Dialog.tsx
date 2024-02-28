import { ReactNode, useEffect, useRef } from 'react'
import styles from './Dialog.module.sass'
import plusIcon from '@/icons/plusIcon.svg'

export type DialogInfoType = {open: boolean, data: any}

export type DialogProps = {
    dialogInfo: {info: DialogInfoType, setInfo: (e: DialogInfoType)=>any},
    className?: string,
    children?: ReactNode
    buttons?: {text: string, func: (e: React.MouseEvent, data: any)=>boolean|undefined|void}[]
}

const Dialog = ({dialogInfo: {info, setInfo}, ...props}: DialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const buttonClicked = (e: React.MouseEvent, func: (e: React.MouseEvent, data: any)=>boolean|undefined|void) => {
        const shouldClose = func(e, info.data)
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
            <div className={`flex flex-col gap-2 items-stretch p-10 ${props.className??''}`}>
                <div className='h-3 flex flex-row'>
                    <div className={`grow`} />
                    <TopBarButton src={plusIcon} alt="Exit Dialog" onClick={()=>dialogRef.current?.close()} className={`rotate-45`} />
                </div>
                <div className='grow'>
                    {props.children}
                </div>
                <div className={`flex flex-row justify-evenly`}> {/* TODO: Make buttons go in center and spread out */}
                    {
                        props.buttons?.map((buttonData, index)=>(
                            <button onClick={(e)=> buttonClicked(e, buttonData.func)} key={index} className='py-2'>
                                {buttonData.text}
                            </button>
                        ))
                    }
                </div>
            </div>
        </dialog>
    )
}

export const TopBarButton = (props: {src: any, alt: string, onClick: (e: React.MouseEvent)=>any, className: string}) => {
    return (
        <img 
            src={props.src} 
            alt={props.alt} 
            className={`stroke-black opacity-40 hover:opacity-60 cursor-pointer ${props.className}`} 
            onClick={props.onClick} />
    )
}

export default Dialog