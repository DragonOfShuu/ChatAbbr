import { ReactNode, useEffect, useRef } from 'react'
import styles from './Dialog.module.sass'
import plusIcon from '@/icons/plusIcon.svg'
import SvgButton from './SvgButton'

export type dialogFunc = undefined|((e: React.MouseEvent<Element, MouseEvent>, data?: any) => boolean | void | undefined)
export type DialogInfoType = {open: boolean, data?: any}

export type DialogProps = {
    dialogInfo: {info: DialogInfoType, setInfo: (e: DialogInfoType)=>any},
    className?: string,
    children?: ReactNode
    dialogClassName?: string
}

const Dialog = ({dialogInfo: {info, setInfo}, ...props}: DialogProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const closeClicked = () => {
        setInfo({ open: false, data: info.data })
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
    }, [info.open])

    return (
        <dialog ref={dialogRef} className={`${styles.dialog} ${props.dialogClassName??'p-4'}`}>
            <div className={`flex flex-col items-stretch ${props.className??''}`}>
                <div className='h-10 flex flex-row items-center px-2 py-2'>
                    <div className={`grow`} />
                    <SvgButton image={plusIcon} onClick={closeClicked} className={`rotate-45 h-full w-auto flex flex-row items-center`} svgClassName='h-full w-auto' />
                </div>
                {props.children}
            </div>
        </dialog>
    )
}

export default Dialog