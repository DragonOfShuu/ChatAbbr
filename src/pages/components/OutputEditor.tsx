import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext"

/**
 * We will be utilizing lexical. Look into the "serialization"
 * and "deserialization." Just like magical, we can use
 * percent signs to determine a placeholder: %pl.manager%
 * 
 * Editor: https://lexical.dev/docs/intro
 */

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