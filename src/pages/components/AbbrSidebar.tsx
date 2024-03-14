import { createContext, useContext, useEffect, useState } from "react"
import LoadingComp from "@/components/Loading";
import { AbbrType, getAbbrList } from "@/database/abbrAPI";
// import { getAbbrList } from "@/";
import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext";

// import minusIcon from "icons/minus.svg"
import TrashIcon from "@/icons/TrashIcon.svg"
import PlusIcon from "@/icons/plusIcon.svg"
// import saveIcon from "@/icons/FloppyDisk.svg"
import FloppyDisk from "@/icons/FloppyDisk.svg";
import GearIcon from '@/icons/gear.svg';
import sortDown from "@/icons/sortDown.svg"
import sortUp from '@/icons/sortUp.svg'
import { DialogInfoType } from "@/components/Dialog";
import BooleanDialog from "@/components/BooleanDialog";
import SpecialButton from "../../components/SpecialButton";

import styles from './AbbrSidebar.module.sass'
import SvgButton from "@/components/SvgButton";
import SettingsDialog from "./SettingsDialog";

// @ts-ignore
const selectedContext = createContext<{selected: string[], setSelected: (ids: string[])=>any}>(null) 

const AbbrSidebar = (props: { className: string }) => {
    const [selected, setSelected] = useState<string[]>([])
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    return (
        <selectedContext.Provider value={{selected: selected, setSelected: setSelected}}>
            <SettingsDialog openState={{open: settingsOpen, setOpen: setSettingsOpen}} />
            <div className={`${props.className??''} min-h-screen h-screen w-full bg-fuchsia-200 fixed flex flex-col rounded-tr-2xl`}>
                <div className={`p-2 flex flex-col grow w-full`}>
                    <div className={`w-full flex flex-row`}>
                        <h1 className="text-6xl">
                            Paradigm
                        </h1>
                        <div className={`grow`} />
                        <SvgButton image={GearIcon} onClick={()=> setSettingsOpen(true)} className={`self-start`} scale={30} />
                    </div>
                    <SidebarToolbar className={`grow`} />
                </div>

                <SideBarContent className={`h-3/4 w-full`} />
                
                <div className={`p-2 w-full`}>
                    <a href="https://dragonofshuu.dev/" target="_blank" rel="noopener noreferrer">
                        {`Made with <3 by Logan Cederlof`}
                    </a>
                </div>
            </div>
        </selectedContext.Provider>
    )
}

const SideBarContent = (props: {className?: string}) => {
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
        <div className={`flex flex-col grow items-stretch ${props.className??''} ${styles.contentNoScroll}`}>
            {
                hotkeyListDisplay.length===0
                ? // No templates
                <div className={`opacity-35 grow flex justify-center items-center`}>
                    <h2>No Templates</h2>
                </div>
                : // There are templates
                hotkeyListDisplay.map((hotkey)=> {

                    return (
                        <SidebarElement 
                            key={hotkey.id} 
                            hotkey={hotkey} 
                            onClick={()=> abbrClicked(hotkey.id)}
                            selected={selected}
                            setSelected={setSelected} />
                    )
                })
            }
        </div>
    )
}

const SidebarToolbar = (props: {className?: string}) => {
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
        <div className={`pt-8 pb-2 flex flex-row items-end gap-2 ${props.className??''}`}>
            <BooleanDialog 
                dialogInfo={{info: dialogInfo, setInfo: setDialogInfo}} 
                noFunc={()=>true} yesFunc={removeTemplates}>

                {`Are you sure you want to delete ${selected.length} template(s)?`}
            </BooleanDialog>
            <SpecialButton alt="Add Template" Image={PlusIcon} onClick={addTemplate} />
            <SpecialButton alt="Remove Templates" Image={TrashIcon} onClick={removeTemplateDialog} disabled={selected.length===0} />
        </div>
    )
}

const SidebarElement = ({hotkey, onClick, selected, setSelected}: {hotkey: AbbrType, onClick: ()=>any, selected: string[], setSelected: (value: string[])=>any}) => {
    const hotkeyContext = useHotkeyContext();
    const hotkeyDispatch = useHotkeyDispatchContext();

    const checkmarkClicked = (isChecked: boolean, id: string) => {
        if (isChecked) setSelected([...selected, id])
        else setSelected([...selected.filter((inId)=> inId!==id)])
    }

    // If the id is the same as the currently being edited, use the current edited information instead
    let needSaveIcon = true;
    let actualHotkey = hotkeyContext.hasEdits[hotkey.id]
    if (actualHotkey===undefined) {
        actualHotkey = hotkey
        needSaveIcon = false;
    }

    // This element is being edited
    const isCurrentEdit = hotkey.id === hotkeyContext.currentHotkeyEdit?.id

    let hotkeyText = `${actualHotkey.name} (${actualHotkey.hotkeys.join(', ')})`

    const moveElement = (moveUp: boolean) => {
        const oldHotkeyList = Object.values(hotkeyContext.hotkeyList);
        const oldIndex = oldHotkeyList.findIndex((oldHotkey) => hotkey.id===oldHotkey.id);
        const newIndex = oldIndex + (moveUp?-1:1)

        const newHotkeyList = [...oldHotkeyList]
        newHotkeyList.splice(oldIndex, 1)
        newHotkeyList.splice(newIndex, 0, hotkey)

        hotkeyDispatch({ type: 'setHotkeys', hotkeys: newHotkeyList })
    }

    return (
        <div 
        className={`${styles.sidebarElement} ${isCurrentEdit?styles.sidebarElementSelected:''}`}
        key={actualHotkey.id}
        onClick={onClick}>
            <div className={`flex flex-col justify-center w-1/12 items-center py-3`}>
                <SvgButton image={sortUp} onClick={()=> moveElement(true)} svgClassName={`w-full h-auto`} strokeWidth={1} />
                <input 
                    type="checkbox" 
                    onChange={(x)=> checkmarkClicked(x.target.checked, actualHotkey.id)} 
                    checked={selected.includes(actualHotkey.id)} />
                <SvgButton image={sortDown} onClick={()=> moveElement(false)} svgClassName={`w-full h-auto`} strokeWidth={1} />
            </div>

            {/* ClassName alternatively contains w-full instead of grow */}
            <div className={`flex flex-row py-5 h-full grow max-w-full items-center`}>
                <p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[250px] min-w-0">
                    {hotkeyText}
                </p>
                <div className={`grow`} />
                { 
                    needSaveIcon?
                        <SvgButton 
                            image={FloppyDisk} 
                            onClick={()=> hotkeyDispatch({type: 'saveEdits', id: actualHotkey.id})}
                            strokeClasses={`h-full w-auto stroke-fuchsia-500 hover:stroke-fuchsia-400`} /> 
                        : <></> 
                }
            </div>
        </div>
    )
}

export default AbbrSidebar
