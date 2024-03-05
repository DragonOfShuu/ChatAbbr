import { useCallback, useEffect, useState } from "react";
import styles from './AbbrEditor.module.sass';

import PencilIcon from '@/icons/Pencil.svg';
import NoPencilIcon from '@/icons/NoPencil.svg';
import PlusIcon from '@/icons/plusIcon.svg';
import CheckIcon from '@/icons/Check.svg';

import { textAllowed } from "@/globalCharacterRules";
import { ToolbarButton } from "@/components/ToolbarButton";
import { useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext";

export const HotkeyEditor = (props: { className?: string; }) => {
    const hotkeyData = useHotkeyContext();

    return (
        hotkeyData.currentHotkeyEdit === undefined ? <>No Data Due To Error</> :
            <div 
                className={`flex flex-col items-stretch rounded-md border-2 border-fuchsia-600 bg-fuchsia-700 bg-opacity-20 ${props.className ?? ''}`}>
                
                {/** toolbar */}
                <HotkeyToolbar className={`py-2`} />
                {/** Actual Hotkeys */}
                <div className={`flex flex-col items-stretch grow overflow-y-scroll`}>
                    {hotkeyData.currentHotkeyEdit?.hotkeys.map((h, index, hotkeyArray) => {
                        return (
                            <HotkeyElement text={h} index={index} hotkeyArray={hotkeyArray} />
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

    const setAndCheckHotText = useCallback((newText: string) => {
        if (textAllowed(newText))
            setHotkeyText(newText)
    }, [])

    const installHotkey = () => {
        if (!hotkeyData.currentHotkeyEdit 
            || hotkeyData.currentHotkeyEdit?.hotkeys.includes(hotkeyText)) return 
        
        hotkeyDispatch({ 
            type: 'updateCurrentEdit', 
            hotkey: { hotkeys: [hotkeyText, ...hotkeyData.currentHotkeyEdit.hotkeys] } 
        })
        setHotkeyText('')
    }

    return (
        <div className={`flex flex-row gap-2 justify-evenly ${props.className}`}>
            <input 
                onChange={(e)=> setAndCheckHotText(e.target.value)}
                value={hotkeyText}
                className={`rounded-full`}
                placeholder={`New Hotkey...`}
            />
            <ToolbarButton Image={PlusIcon} alt={`Add New Hotkey`} onClick={installHotkey} />
        </div>
    )
}

const HotkeyElement = (props: { text: string; index: number; hotkeyArray: string[]; }) => {
    const hotkeyData = useHotkeyContext();
    const dispatch = useHotkeyDispatchContext();

    const [hotkeyText, setHotkeyText] = useState<string>(props.text);
    const [isEditing, setEditing] = useState<boolean>(false);

    const iconSettings = { stroke: "#000000", width: 50, height: 50, strokeWidth: 2, className: "cursor-pointer hover:stroke-gray-800" };

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
        // If there is no change, don't do anything
        if (hotkeyText === props.text) return;
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
            className={`px-4 py-4 h-11 text-xl flex flex-row items-center ${styles.hotkeyContainer} ${props.index % 2 ? styles.hotkeyContainer1 : styles.hotkeyContainer2}`}
        >

            {
                isEditing ?
                <>
                    <input
                        onChange={inputChanged}
                        value={hotkeyText} />

                    <div className={`grow`} />

                    <NoPencilIcon {...iconSettings} onClick={cancelEdits} />
                    <CheckIcon {...iconSettings} onClick={installEdits} />
                </>
                :
                <>
                    {props.text}
                    <div className="grow" />
                    {/** Pencil and x to delete */}
                    <PencilIcon {...iconSettings} onClick={() => setEditing(true)} />
                    <div className={`rotate-45`}>
                        <PlusIcon {...iconSettings} onClick={deleteThis} />
                    </div>
                </>
            }
        </div>
    );
};
