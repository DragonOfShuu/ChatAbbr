import { createContext, useContext, useEffect, useState } from "react"
import LoadingComp from "./Loading";
import { AbbrType, getAbbrList } from "@/database/abbrAPI";
// import { getAbbrList } from "@/";
import { useHotkeyContext, useHotkeyDispatchContext } from "../DataStateContext";

// import minusIcon from "icons/minus.svg"
import TrashIcon from "@/icons/TrashIcon.svg"
import PlusIcon from "@/icons/plusIcon.svg"
// import saveIcon from "@/icons/FloppyDisk.svg"
import FloppyDisk from "@/icons/FloppyDisk.svg";
import { DialogInfoType } from "@/components/Dialog";
import BooleanDialog from "@/components/BooleanDialog";
import { ToolbarButton } from "../../components/ToolbarButton";

// @ts-ignore
const selectedContext = createContext<{selected: string[], setSelected: (ids: string[])=>any}>(null) 

const AbbrSidebar = (props: { className: string }) => {
    const [selected, setSelected] = useState<string[]>([])

    return (
        <selectedContext.Provider value={{selected: selected, setSelected: setSelected}}>
            <div className={`${props.className??''} min-h-screen bg-fuchsia-200 fixed flex flex-col p-2`}>
                <h1 className="text-6xl">
                    Paradigm
                </h1>

                <SidebarToolbar />
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
    // const [discardHotkeyInfo, setHotkeyDiscInfo] = useState<DialogInfoType>({open: false, data: {}})

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

    const switchCurrentEdit = (id: string) => {
        let newData: AbbrType|undefined = hotkeyContext.hasEdits[id]
        if (newData===undefined)
            newData = hotkeyContext.hotkeyList[id]
            if (newData===undefined) return

        hotkeyDispatchContext([{ type: 'setCurrentEdit', hotkey: {...newData} }])
    }

    const abbrClicked = (id: string) => {
        if (id===hotkeyContext.currentHotkeyEdit?.id) return
        switchCurrentEdit(id)
    }
    
    // Could I use suspense to avoid any kind of waterfalls? 
    // Maybe. Is it worth it? Definitely not.
    if (!isLoaded) 
        return <LoadingComp className={`grow flex justify-center items-center`} />

    const hotkeyListDisplay = Object.values(hotkeyContext.hotkeyList)
    
    return (
        <div className={`flex flex-col grow items-stretch`}>
            {
                hotkeyListDisplay.length===0
                ? // No templates
                <div className={`opacity-35 grow flex justify-center items-center`}>
                    <h2>No Templates</h2>
                </div>
                : // There are templates
                hotkeyListDisplay.map((hotkey)=> {
                    // If the id is the same as the currently being edited, use the current edited information instead
                    let needSaveIcon = true;
                    let actualHotkey = hotkeyContext.hasEdits[hotkey.id]
                    if (actualHotkey===undefined) {
                        actualHotkey = hotkey
                        needSaveIcon = false;
                    }

                    let hotkeyText = `${actualHotkey.name} (${actualHotkey.hotkeys.join(', ')})`

                    return (
                        <div 
                        className="bg-white bg-opacity-0 hover:bg-opacity-20 active:bg-black active:bg-opacity-10 text-lg font-bold flex flex-row gap-5 h-20 items-center cursor-pointer w-full max-w-full overflow-hidden"
                        key={actualHotkey.id}
                        onClick={()=> abbrClicked(actualHotkey.id)}>
                            <input 
                                type="checkbox" 
                                onChange={(x)=> checkmarkClicked(x.target.checked, actualHotkey.id)} 
                                checked={selected.includes(actualHotkey.id)} />
                            <div className={`flex flex-row py-5 h-full w-full max-w-full items-center`}>
                                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[250px] min-w-0">
                                    {hotkeyText}
                                </p>
                                <div className={`grow`} />
                                { needSaveIcon?<FloppyDisk className={`h-full w-auto opacity-30 hover:opacity-60`} onClick={()=> hotkeyDispatchContext({type: 'saveEdits', id: actualHotkey.id})} stroke={`#e11d48`} /> : <></> }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

const SidebarToolbar = () => {
    const hotkeyDispatchContext = useHotkeyDispatchContext();
    const {selected, setSelected} = useContext(selectedContext)
    const [dialogInfo, setDialogInfo] = useState<DialogInfoType>({open: false, data: {}})
 
    const addTemplate = () => {
        hotkeyDispatchContext({ type: "create" })
    }

    const removeTemplateDialog = () => {
        console.log("These ids will be removed: ", selected)
        setDialogInfo({...dialogInfo, open: true})
    }

    const removeTemplates = () => {
        hotkeyDispatchContext([{ type: 'discardEdits', ids: selected }, { type: 'remove', ids: selected }])
        setSelected([])
    }

    return (
        <div className={`pt-8 pb-2 flex flex-row items-end gap-2`}>
            <BooleanDialog 
                dialogInfo={{info: dialogInfo, setInfo: setDialogInfo}} 
                noFunc={()=>true} yesFunc={removeTemplates}>

                {`Are you sure you want to delete ${selected.length} template(s)?`}
            </BooleanDialog>
            <ToolbarButton alt="Add Template" Image={PlusIcon} onClick={addTemplate} />
            <ToolbarButton alt="Remove Templates" Image={TrashIcon} onClick={removeTemplateDialog} disabled={selected.length===0} />
        </div>
    )
}


export default AbbrSidebar
