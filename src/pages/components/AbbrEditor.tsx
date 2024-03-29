import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext"
import { HotkeyEditor } from "./HotkeyEditor"
import SpecialButton from "@/components/SpecialButton"
import OutputEditor from "./OutputEditor"
import TabbedPager from "@/components/TabbedPager"

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
            <div className="flex flex-col w-full h-full">
                <div className={`w-full h-full bg-fuchsia-200`}>
                    <div className={`flex flex-col gap-5 w-full h-full p-5 bg-fuchsia-100 rounded-bl-2xl`}>
                        <input 
                            type={`text`} 
                            className={`w-full h-12 text-5xl border-fuchsia-500 rounded-lg text-fuchsia-700 border-b-2 bg-transparent`}
                            placeholder="Name" 
                            onChange={(e)=> hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {name: e.currentTarget.value}})}
                            value={hotkeyData.currentHotkeyEdit.name} /> 

                        <div className={`h-[70vh] 2xl:px-16 py-5 md:flex flex-row gap-3 hidden `}>
                            <HotkeyEditor className={`w-1/3 h-full`} />
                            <OutputEditor className={`w-1/2 grow`} />
                        </div>

                        <TabbedPager className={`h-[70vh] pb-3 block md:hidden`}>
                            {{
                                "Hotkeys": <HotkeyEditor className={`w-full h-full`} />,
                                "Result": <OutputEditor className={`w-full h-full`} />,
                            }}
                        </TabbedPager>
                    </div>
                </div>

                <div className={`flex flex-row-reverse items-center grow gap-2 xl:px-20 px-5 py-4 rounded-tr-2xl bg-fuchsia-200`}>
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
                </div>
            </div>
        </div>
    )
}

export default AbbrEditor
