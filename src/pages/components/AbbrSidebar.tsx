import { createContext, useContext, useEffect, useState } from "react"
import LoadingComp from "./Loading";
import { getAbbrList } from "@/database/abbrAPI";
// import { getAbbrList } from "@/";
import { useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext";

// import minusIcon from "icons/minus.svg"
import trashIcon from "@/icons/TrashIcon.svg"
import plusIcon from "@/icons/plusIcon.svg"

// @ts-ignore
const selectedContext = createContext<{selected: string[], setSelected: (ids: string[])=>any}>(null) 

const AbbrSidebar = (props: { className: string }) => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <selectedContext.Provider value={{selected: selected, setSelected: setSelected}}>
            <div className={`${props.className??''} min-h-screen bg-fuchsia-200 fixed flex flex-col p-2`}>
                <h1 className="text-6xl">
                    ChatAbbr
                </h1>
                <div className={`h-8 flex flex-row items-end`}>
                    <SidebarToolbar />
                </div>
                
                <SideBarContent />
                
                <div>
                    <a href="https://dragonofshuu.dev/" target="_blank" rel="noopener noreferrer">
                        {`Made with <3 by Logan Cederlof`}
                    </a>
                </div>
            </div>
        </selectedContext.Provider>
    )
}

const SideBarContent = (props: {}) => {
    const hotkeyContext = useHotkeyContext();
    const hotkeyDispatchContext = useHotkeyDispatchContext();
    const {selected, setSelected} = useContext(selectedContext)
    const [isLoaded, setLoaded] = useState(false)

    useEffect(()=> {
        getAbbrList().then((value): void =>{
            hotkeyDispatchContext({ type: 'setHotkeys', hotkeys: value })
            setLoaded(true);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkmarkClicked = (isChecked: boolean, id: string) => {
        if (isChecked) setSelected([...selected, id])
        else setSelected([...selected.filter((inId)=> inId!==id)])
    }
    
    // Could I use suspense to avoid any kind of waterfalls? 
    // Maybe. Is it worth it? Definitely not.
    if (!isLoaded) 
        return <LoadingComp className={`grow flex justify-center items-center`} />
    
    return (
        // props.dataStateModel.viewAbbrList.length===0?
        <div className={`flex flex-col grow items-stretch`}>
            {
                hotkeyContext.hotkeyList.length===0
                ? // No templates
                <div className={`opacity-35 grow flex justify-center items-center`}>
                    <h2>No Templates</h2>
                </div>
                : // There are templates
                hotkeyContext.hotkeyList.map((hotkey)=> {
                    // If the id is the same as the currently being edited, use the current edited information instead
                    const actualHotkey = hotkey.id===hotkeyContext.currentHotkeyEdit?.id 
                        ? hotkeyContext.currentHotkeyEdit : hotkey;

                    let hotkeyText = `${actualHotkey.name} (${actualHotkey.hotkeys.join(', ')})`
                    if (hotkeyText.length > 20)
                        hotkeyText = hotkeyText.substring(0, 17)+'...'

                    return (
                        <div 
                        className="bg-white bg-opacity-0 hover:bg-opacity-20 active:bg-black active:bg-opacity-10 text-lg font-bold flex flex-row gap-5 h-20 items-center"
                        key={actualHotkey.id}>
                            <input 
                                type="checkbox" 
                                onChange={(x)=> checkmarkClicked(x.target.checked, actualHotkey.id)} 
                                checked={selected.includes(actualHotkey.id)} />
                            {hotkeyText}
                        </div>
                    )
                })
            }
        </div>
    )
}

const ToolbarButton = (props: {onClick: ()=>any, image: any, alt: string}) => {
    return (
        <button className={`p-1`} >
            <img src={props.image} alt={props.alt} className="w-4 h-4" onClick={props.onClick} />
        </button>
    )
}

const SidebarToolbar = () => {
    // const hotkeyContext = useHotkeyContext();
    const hotkeyDispatchContext = useHotkeyDispatchContext();
    const {selected, setSelected} = useContext(selectedContext)
 
    const addTemplate = () => {
        hotkeyDispatchContext({ type: "create" })
    }

    const removeTemplates = () => {
        console.log("These ids will be removed: ", selected)
        // TODO: ADD DIALOG BEFORE DELETION
        hotkeyDispatchContext({ type: 'remove', ids: selected })
        setSelected([])
    }

    return (
        <div className={`h-8 flex flex-row items-end`}>
            <ToolbarButton alt="Add Template" image={plusIcon} onClick={addTemplate} />
            <ToolbarButton alt="Remove Templates" image={trashIcon} onClick={removeTemplates} />
        </div>
    )
}


export default AbbrSidebar
