import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
// import styles from './AbbrEditor.module.sass';

import PencilIcon from '@/icons/Pencil.svg';
import NoPencilIcon from '@/icons/NoPencil.svg';
import PlusIcon from '@/icons/plusIcon.svg';
import CheckIcon from '@/icons/Check.svg';

import { textAllowed } from "@/globalCharacterRules";
import SpecialButton from "@/components/SpecialButton";
import SvgButton from "@/components/SvgButton";
import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext";

const canInstallHotkey = (text: string): boolean => {
    if (!text) return false
    if (text.length<2) return false
    return true;
}

export const HotkeyEditor = (props: { className?: string; }) => {
    const hotkeyData = useHotkeyContext();

    return (
        hotkeyData.currentHotkeyEdit === undefined ? <>No Data Due To Error</> :
            <div 
                className={`flex flex-col items-stretch rounded-md border-2 border-fuchsia-400 bg-fuchsia-400 bg-opacity-10 ${props.className ?? ''}`}>
                
                {/** toolbar */}
                <HotkeyToolbar className={`py-2`} />
                {/** Actual Hotkeys */}
                <div className={`flex flex-col items-stretch grow overflow-y-auto`}>
                    {hotkeyData.currentHotkeyEdit?.hotkeys.map((h, _, hotkeyArray) => {
                        return (
                            <HotkeyElement text={h} hotkeyArray={hotkeyArray} key={h} />
                        );
                    })}
                </div>
            </div>
    );
};

const HotkeyToolbar = (props: {className?: string}) => {
    const hotkeyDispatch = useHotkeyDispatchContext();
    const hotkeyData = useHotkeyContext();

    const toolBarInput = useRef<HotkeyInputRef>(null)

    const installHotkey = () => {
        const text = toolBarInput.current?.value??'';
        if   ( !hotkeyData.currentHotkeyEdit 
            || hotkeyData.currentHotkeyEdit?.hotkeys.includes(text)
            || !canInstallHotkey(text)) return 
        
        hotkeyDispatch({ 
            type: 'updateCurrentEdit', 
            hotkey: { hotkeys: [text, ...hotkeyData.currentHotkeyEdit.hotkeys] } 
        })

        toolBarInput.current?.setValue('')
        toolBarInput.current?.focus()
    }

    return (
        <div className={`flex flex-row gap-2 justify-evenly px-2 py-1 ${props.className}`}>
            <HotkeyInput installHotkey={installHotkey} ref={toolBarInput} />
            <SpecialButton Image={PlusIcon} alt={`Add New Hotkey`} onClick={installHotkey} />
        </div>
    )
}

const HotkeyElement = (props: { text: string, hotkeyArray: string[] }) => {
    const hotkeyData = useHotkeyContext();
    const dispatch = useHotkeyDispatchContext();

    const [isEditing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<HotkeyInputRef>(null)

    const svgButtonClassname = "lg:h-3/4 h-1/2 w-auto"

    const deleteThis = () => {
        dispatch({
            type: 'updateCurrentEdit',
            hotkey: { hotkeys: props.hotkeyArray.filter((h) => h !== props.text) }
        });
    };

    const cancelEdits = () => {
        if (!isEditing) return;
        console.log("Cancelling hotkey edits...");
        setEditing(false);
    };


    const installEdits = () => {
        // If there is no change, stop editing
        if (inputRef.current===null) return
        
        if (inputRef.current.value === props.text) {
            setEditing(false);
            return;
        }
        
        if (!canInstallHotkey(inputRef.current.value)) return
        
        console.log("Installing hotkey edits...");
        dispatch({
            type: 'updateCurrentEdit',
            hotkey: {
                hotkeys: props.hotkeyArray
                    .filter((h) => h !== inputRef.current?.value)
                    .map(
                        (h) => h === props.text ? inputRef.current?.value??'' : h
                    )
            }
        });

        setEditing(false);
    };

    if (hotkeyData.currentHotkeyEdit === undefined) return <>No Data</>;

    return (
        <div
            key={props.text}
            className={`px-4 py-2 h-16 text-xl flex flex-row items-center odd:bg-rose-500/30 even:bg-rose-300/30 odd:hover:bg-rose-500/20 even:hover:bg-rose-300/20`}
        >

            {
                isEditing ?
                <>
                    {/* <input
                        onChange={inputChanged}
                        value={hotkeyText}
                        className={`h-full grow px-2 py-1 rounded-md`}
                        onKeyDown={(e)=> { if (e.key==="Enter") installEdits() }} /> */}
                    <HotkeyInput installHotkey={installEdits} text={props.text} ref={inputRef} />

                    <div className={`w-2`} />

                    <SvgButton image={NoPencilIcon} onClick={cancelEdits} className={`${svgButtonClassname}`} />
                    <SvgButton image={CheckIcon} onClick={installEdits} className={`${svgButtonClassname}`} />
                </>
                :
                <>
                    {props.text}
                    <div className="grow" />
                    {/** Pencil and x to delete */}
                    <SvgButton image={PencilIcon} onClick={() => setEditing(true)} className={`${svgButtonClassname}`} /> 
                    <SvgButton image={PlusIcon} onClick={deleteThis} className={`rotate-45 ${svgButtonClassname}`} />
                </>
            }
        </div>
    );
};

type HotkeyInputRef = {
    focus: ()=>any
    setValue: (x: string)=>any
    value: string
}
const HotkeyInput = forwardRef(
        (
            {installHotkey, text, ...props}: {
                text?: string,
                installHotkey: ()=> any,
            }, 

            ref: React.ForwardedRef<HotkeyInputRef>
        ) => {

    const [showError, setShowError] = useState<boolean>(false)
    const [errorTimer, setErrorTimer] = useState<NodeJS.Timeout|undefined>(undefined)

    const [hotkeyText, setHotkeyText] = useState(text??'');

    const inputRef = useRef<HTMLInputElement>(null);
    
    useImperativeHandle(ref, ()=> {
        return {
            focus: ()=> inputRef.current?.focus(),
            setValue: (text: string) => textAllowed(text)?setHotkeyText(text):null,
            value: hotkeyText
        }
    }, [hotkeyText])

    useEffect(()=> {
        setHotkeyText(text??'')
    }, [text]);

    useEffect(()=> {
        if (errorTimer===undefined) return;
        clearTimeout(errorTimer);
        setErrorTimer(undefined)

        setShowError(false) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkeyText])

    const exclaimWrongChar = () => {
        setShowError(true);
        clearTimeout(errorTimer)

        setErrorTimer(setTimeout(()=> {
            setErrorTimer(undefined)
            setShowError(false)
        }, 5000))
    }

    const setAndCheckHotText = (newText: string) => {
        if (textAllowed(newText)) {
            setHotkeyText(newText)
        } else 
            exclaimWrongChar()
    }

    return (
        <div className={`relative inline-block grow min-w-2`}>
            <input
                {...props}
                onChange={(e)=> setAndCheckHotText(e.target.value)}
                value={hotkeyText}
                className={`rounded-md px-3 py-2 text-lg w-full ${showError?'rounded-b-none':''}`}
                placeholder={`New Hotkey...`}
                ref={inputRef}
                onKeyDown={(e) => { if (e.key==="Enter") installHotkey() }}
            />
            <div 
                className={`absolute ${showError?'scale-y-100':'scale-y-0'} rounded-b-md transition-transform origin-top p-2 bg-rose-300 border-rose-400 w-full border-2 z-10 text-sm`}>
                Hotkeys cannot include certain characters, and spaces must be at the end
            </div>
        </div>
    )
})