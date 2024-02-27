import { ReactNode } from 'react'
import styles from './Dialog.module.sass'
import plusIcon from '@/icons/plusIcon.svg'

type Props = {
    ref: React.RefObject<HTMLDialogElement>
    className?: string,
    children?: ReactNode
    buttons?: {text: string, func: (e: React.MouseEvent)=>boolean|undefined}[]
}

const Dialog = (props: Props) => {

    const buttonClicked = (e: React.MouseEvent, func: (e: React.MouseEvent)=>boolean|undefined) => {
        const shouldClose = func(e)
        if (shouldClose===undefined || shouldClose)
            props.ref.current?.close()
    }

    return (
        <dialog ref={props.ref} className={`${styles.dialog} ${props.className??''} flex flex-col gap-2 items-stretch`}>
            <div className='h-3 flex flex-row'>
                <div className={`grow`} />
                <TopBarButton src={plusIcon} alt="Exit Dialog" onClick={()=>props.ref.current?.close()} className={`rotate-45`} />
            </div>
            <div className='grow'>
                {props.children}
            </div>
            <div className={`flex`}> {/* TODO: Make buttons go in center and spread out */}
                {
                    props.buttons?.map((buttonData)=>(
                        <button onClick={(e)=> buttonClicked(e, buttonData.func)}>
                            {buttonData.text}
                        </button>
                    ))
                }
            </div>
        </dialog>
    )
}

const TopBarButton = (props: {src: any, alt: string, onClick: (e: React.MouseEvent)=>any, className: string}) => {
    return (
        <img 
            src={props.src} 
            alt={props.alt} 
            className={`stroke-black opacity-40 hover:opacity-60 cursor-pointer ${props.className}`} 
            onClick={props.onClick} />
    )
}

export default Dialog