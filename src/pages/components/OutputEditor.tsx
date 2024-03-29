import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext"

type Props = {
    className?: string
}

const OutputEditor = (props: Props) => {
    const hotkeyData = useHotkeyContext();
    const hotkeyDataDispatch = useHotkeyDispatchContext();

    if (hotkeyData.currentHotkeyEdit===undefined) {
        return <>No Data</>
    }

    return (
        <textarea 
            value={hotkeyData.currentHotkeyEdit.output} 
            onChange={(e)=> hotkeyDataDispatch({type: 'updateCurrentEdit', hotkey: {output: e.currentTarget.value}})} 
            className={`${props.className??''} text-xl`}
            placeholder="Output Text"/>
    )
}

export default OutputEditor