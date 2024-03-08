import { useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext"
import { HotkeyEditor } from "./HotkeyEditor"
import SpecialButton from "@/components/SpecialButton"

type Props = {
    className: string
}

const AbbrEditor = (props: Props) => {
    const hotkeyData = useHotkeyContext()
    const hotkeyDataDispatch = useHotkeyDispatchContext()

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
        <div className={`${props.className} w-full h-full`}>
            <div className="flex flex-col gap-5 w-full h-full">
                <div className={`flex flex-col gap-5 w-full h-full p-5`}>
                    <input 
                        type={`text`} 
                        className={`w-full h-12 text-5xl border-fuchsia-500 rounded-lg text-fuchsia-700 border-b-2 bg-transparent`}
                        placeholder="Name" 
                        onChange={(e)=> hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {name: e.currentTarget.value}})}
                        value={hotkeyData.currentHotkeyEdit.name} /> 

                    <div className={`h-[70vh] px-16 py-5 flex flex-row gap-3`}>
                        <div className={`w-1/3 h-full`}>
                            {/* Box for all hotkeys */}
                            <HotkeyEditor className={`h-full max-h-full`} />
                        </div>
                        <div className={`w-1/2 grow`}>
                            <textarea 
                                value={hotkeyData.currentHotkeyEdit.output} 
                                onChange={(e)=> hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {output: e.currentTarget.value}})} 
                                className="w-full h-full text-xl"
                                placeholder="Output Text"/>
                        </div>
                    </div>
                </div>

                <div className={`flex flex-row-reverse items-center grow gap-2 px-20 py-4 rounded-tl-2xl bg-fuchsia-200`}>
                    <SpecialButton 
                        className={`py-4 w-20`} 
                        disabled={!hasPendingEdits} 
                        onClick={()=> hotkeyDataDispatch({ type: 'saveEdits', id: hotkeyData.currentHotkeyEdit?.id??'' })}>

                        Save
                    </SpecialButton>
                    <SpecialButton
                        className={`py-4 w-20`}
                        disabled={!hasPendingEdits} 
                        onClick={
                            ()=> hotkeyDataDispatch([ { type: 'discardEdits', ids: [hotkeyData.currentHotkeyEdit?.id??''] }, { type: 'setCurrentEdit', hotkey: hotkeyData.hotkeyList[hotkeyData.currentHotkeyEdit?.id??'']??undefined } ])
                        }>
                        Cancel
                    </SpecialButton>
                    {/* cancel and save buttons */}
                    {/* Cancel: Cancels edits by getting previous id information
                    and placing it in the textboxes. If the previous id information
                    doesn't exist, it will just remove the "currentEdits" entirely */}
                </div>
            </div>
        </div>
    )
}

export default AbbrEditor
