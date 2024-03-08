import { useCallback, useEffect, useRef, useState } from "react";
import styles from './AbbrEditor.module.sass';

import PencilIcon from '@/icons/Pencil.svg';
import NoPencilIcon from '@/icons/NoPencil.svg';
import PlusIcon from '@/icons/plusIcon.svg';
import CheckIcon from '@/icons/Check.svg';

import { textAllowed } from "@/globalCharacterRules";
import SpecialButton from "@/components/SpecialButton";
import SvgButton from "@/components/SvgButton";
import { useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext";

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
                    {hotkeyData.currentHotkeyEdit?.hotkeys.map((h, index, hotkeyArray) => {
                        return (
                            <HotkeyElement text={h} index={index} hotkeyArray={hotkeyArray} key={h} />
                        );
                    })}
                </div>
            </div>
    );
};

const HotkeyToolbar = (props: {className?: string}) => {
    const hotkeyDispatch = useHotkeyDispatchContext();
    const hotkeyData = useHotkeyContext();

    const [hotkeyText, setHotkeyText] = useState<string>('')

    const toolBarInput = useRef<HTMLInputElement>(null)

    const setAndCheckHotText = useCallback((newText: string) => {
        if (textAllowed(newText))
            setHotkeyText(newText)
    }, [])

    const installHotkey = () => {
        if   ( !hotkeyData.currentHotkeyEdit 
            || hotkeyData.currentHotkeyEdit?.hotkeys.includes(hotkeyText)
            || !canInstallHotkey(hotkeyText)) return 
        
        hotkeyDispatch({ 
            type: 'updateCurrentEdit', 
            hotkey: { hotkeys: [hotkeyText, ...hotkeyData.currentHotkeyEdit.hotkeys] } 
        })

        setHotkeyText('')
        toolBarInput.current?.focus()
    }

    return (
        <div className={`flex flex-row gap-2 justify-evenly px-2 py-1 ${props.className}`}>
            <input 
                onChange={(e)=> setAndCheckHotText(e.target.value)}
                value={hotkeyText}
                className={`rounded-md grow px-3 py-2 text-lg`}
                placeholder={`New Hotkey...`}
                ref={toolBarInput}
                onKeyDown={(e) => { if (e.key==="Enter") installHotkey() }}
            />
            <SpecialButton Image={PlusIcon} alt={`Add New Hotkey`} onClick={installHotkey} />
        </div>
    )
}

// const HotkeyElButton = (props: {className?: string, onClick: ()=>void, image: SVGRType}) => {
//     return (
//         <props.image 
//             width={40} 
//             height={40} 
//             strokeWidth={2} 
//             className={`${props.className??''} select-none cursor-pointer stroke-black hover:stroke-gray-800`} 
//             onClick={props.onClick} />
//     )
// }

const HotkeyElement = (props: { text: string; index: number; hotkeyArray: string[]; }) => {
    const hotkeyData = useHotkeyContext();
    const dispatch = useHotkeyDispatchContext();

    const [hotkeyText, setHotkeyText] = useState<string>(props.text);
    const [isEditing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        setHotkeyText(props.text);
        setEditing(false);
    }, [props.text]);

    const deleteThis = () => {
        dispatch({
            type: 'updateCurrentEdit',
            hotkey: { hotkeys: props.hotkeyArray.filter((h) => h !== props.text) }
        });
    };

    const cancelEdits = () => {
        if (!isEditing) return;
        console.log("Cancelling hotkey edits...");
        setHotkeyText(props.text);
        setEditing(false);
    };


    const installEdits = () => {
        // If there is no change, stop editing
        if (hotkeyText === props.text) {
            setEditing(false);
            return;
        }

        if (!canInstallHotkey(hotkeyText)) return

        console.log("Installing hotkey edits...");
        dispatch({
            type: 'updateCurrentEdit',
            hotkey: {
                hotkeys: props.hotkeyArray
                    .filter((h) => h !== hotkeyText)
                    .map(
                        (h) => h === props.text ? hotkeyText : h
                    )
            }
        });

        setEditing(false);
    };

    const inputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        if (textAllowed(newText))
            setHotkeyText(newText);
    };

    if (hotkeyData.currentHotkeyEdit === undefined) return <>No Data</>;

    return (
        <div
            key={props.text}
            className={`px-4 py-2 h-16 text-xl flex flex-row items-center ${styles.hotkeyContainer} ${props.index % 2 ? styles.hotkeyContainer2 : styles.hotkeyContainer1}`}
        >

            {
                isEditing ?
                <>
                    <input
                        onChange={inputChanged}
                        value={hotkeyText}
                        className={`h-full grow px-2 py-1 rounded-md`}
                        onKeyDown={(e)=> { if (e.key==="Enter") installEdits() }} />

                    <div className={`w-2`} />

                    <SvgButton image={NoPencilIcon} onClick={cancelEdits} />
                    <SvgButton image={CheckIcon} onClick={installEdits} />
                </>
                :
                <>
                    {props.text}
                    <div className="grow" />
                    {/** Pencil and x to delete */}
                    <SvgButton image={PencilIcon} onClick={() => setEditing(true)} /> 
                    <SvgButton image={PlusIcon} onClick={deleteThis} className={`rotate-45`} />
                </>
            }
        </div>
    );
};
