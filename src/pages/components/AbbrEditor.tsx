// import React from 'react'
import { HotkeyAction, useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext"
import PencilIcon from '@/icons/Pencil.svg'
import noPencilIcon from '@/icons/NoPencil.svg'
import PlusIcon from '@/icons/plusIcon.svg'
import { createContext, useContext } from "react"
import styles from './AbbrEditor.module.sass'

type Props = {
    className: string
}

const setDataWithEdits = createContext<((action: HotkeyAction) => void)|null>(null)

const useDataWithEdits = () => {
    return useContext(setDataWithEdits) as (action: HotkeyAction) => void;
}

const AbbrEditor = (props: Props) => {
    const hotkeyData = useHotkeyContext()
    const hotkeyDataDispatch = useHotkeyDispatchContext()

    const setWithEdits = (action: HotkeyAction) => {
        hotkeyDataDispatch([action])
    }

    if (hotkeyData.currentHotkeyEdit===undefined) 
        return (
            <div className={`${props.className} w-full h-full flex justify-center items-center`}>
                <h1 className={`text-8xl opacity-10 select-none font-serif`}>
                    EDITOR
                </h1>
            </div> 
        )
    
    const hasPendingEdits = hotkeyData.hasEdits[hotkeyData.currentHotkeyEdit.id]!==undefined;
    
    return (
        <setDataWithEdits.Provider value={setWithEdits}>
            <div className={`${props.className} w-full h-full`}>
                <div className="flex flex-col gap-5 w-full h-full p-5">
                    <input 
                        type={`text`} 
                        className={`w-full h-12 text-5xl border-fuchsia-500 rounded-lg text-fuchsia-700 border-b-2 bg-transparent hover:bg-`}
                        placeholder="Name" 
                        onChange={(e)=> setWithEdits({type: 'updateCurrentEdit', hotkey: {name: e.currentTarget.value}})}
                        value={hotkeyData.currentHotkeyEdit.name} /> 
                    <div className={`grow px-16 py-5 flex flex-row justify-evenly`}>
                        <div className={`w-1/3`}>
                            {/* Box for all hotkeys */}
                            <HotkeyEditor />
                        </div>
                        <div className={`w-1/2`}>
                            <textarea 
                                value={hotkeyData.currentHotkeyEdit.output} 
                                onChange={(e)=> setWithEdits({type: 'updateCurrentEdit', hotkey: {output: e.currentTarget.value}})} 
                                className="w-full h-full text-xl"
                                placeholder="Output Text"/>
                        </div>
                    </div>
                    <div className={`flex flex-row-reverse gap-2 px-16 py-8`}>
                        <button 
                            className={`py-4 w-20`} 
                            disabled={!hasPendingEdits} 
                            onClick={()=> hotkeyDataDispatch({ type: 'saveEdits', id: hotkeyData.currentHotkeyEdit?.id??'' })}>

                            Save
                        </button>
                        <button 
                            className={`py-4 w-20`}
                            disabled={!hasPendingEdits} 
                            onClick={
                                ()=> hotkeyDataDispatch([ { type: 'discardEdits', ids: [hotkeyData.currentHotkeyEdit?.id??''] }, { type: 'setCurrentEdit', hotkey: hotkeyData.hotkeyList[hotkeyData.currentHotkeyEdit?.id??'']??undefined } ])
                            }>
                            Cancel
                        </button>
                        {/* cancel and save buttons */}
                        {/* Cancel: Cancels edits by getting previous id information
                        and placing it in the textboxes. If the previous id information
                        doesn't exist, it will just remove the "currentEdits" entirely */}
                    </div>
                </div>
            </div>
        </setDataWithEdits.Provider>
    )
}

const HotkeyEditor = (props: {className?: string}) => {
    const hotkeyData = useHotkeyContext();
    const hotkeyDispatch = useHotkeyDispatchContext();
    const setDataWithEdits = useDataWithEdits();
    
    if (hotkeyData.currentHotkeyEdit===undefined) return <>No Data</>
    // Use onblur to set changes when navigating away from pencil element
    return (
        <div className={`flex flex-col items-stretch ${props.className??''}`}>
            {/** toolbar */}
            <div className={`flex flex-row`}>

            </div>
            {/** Actual Hotkeys */}
            <div className={`flex flex-col items-stretch grow`}>
                {
                    hotkeyData.currentHotkeyEdit?.hotkeys.map((h, index)=>{
                        return (
                            <div 
                                key={h} 
                                className={`px-4 py-8 text-xl flex flex-row items-center ${styles.hotkeyContainer} ${index%2?styles.hotkeyContainer1:styles.hotkeyContainer2}`}>

                                {h}
                                <div className="grow" />
                                {/** Pencil and x to delete */}
                                {/* <img src={PencilIcon} alt={`Edit Hotkey`} /> * Pencil changes to 'noPencil' when editing */}
                                <PencilIcon stroke="#000000" width={50} height={50} />
                                {/* <img src={PlusIcon} alt={`Remove Hotkey`} className={`rotate-45`} /> * Changes to checkmark when editing */}
                                <PlusIcon stroke="#000000" className={`rotate-45`} width={50} height={50} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AbbrEditor
