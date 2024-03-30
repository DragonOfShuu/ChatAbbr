import { createContext, useContext, useEffect, useState } from "react"
import LoadingComp from "@/components/Loading";
import { AbbrType, getAbbrList } from "@/database/abbrAPI";
import { useHotkeyContext, useHotkeyDispatchContext } from "../HotkeyDataContext";

import TrashIcon from "@/icons/TrashIcon.svg"
import PlusIcon from "@/icons/plusIcon.svg"
import HamburgerIcon from '@/icons/Hamburger.svg'
import FloppyDisk from "@/icons/FloppyDisk.svg";
import GearIcon from '@/icons/gear.svg';
import sortDown from "@/icons/sortDown.svg"
import sortUp from '@/icons/sortUp.svg'
import { DialogInfoType } from "@/components/Dialog";
import BooleanDialog from "@/components/BooleanDialog";
import SpecialButton from "../../components/SpecialButton";

import styles from './AbbrSidebar.module.sass'
import SvgButton from "@/components/SvgButton";
import SettingsDialog from "./settings/SettingsDialog";
import CheckBox from "@/components/CheckBox";

// @ts-ignore
const selectedContext = createContext<{selected: string[], setSelected: (ids: string[])=>any}>(null) 

// I have now discovered you cannot put a dialog
// inside of a css container query without the 
// browser crashing.

const AbbrSidebar = (props: { className: string, expanded: boolean, setExpanded: (x: boolean)=>any}) => {
    const [selected, setSelected] = useState<string[]>([])
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    return (
        <selectedContext.Provider value={{selected: selected, setSelected: setSelected}}>
            <SettingsDialog openState={{open: settingsOpen, setOpen: setSettingsOpen}} />
            <div className={`${props.className??''} bg-fuchsia-200 flex flex-col rounded-tr-2xl`}>
                <div className={`p-2 flex flex-col w-full`}>
                    <div className={`w-full flex flex-row`}>
                        {
                            props.expanded?
                            <h1 className={`text-6xl ${props.expanded?'w-auto text-left':'w-full text-center'}`}>
                                Paradigm
                            </h1>
                            :
                            <SvgButton image={HamburgerIcon} onClick={()=>props.setExpanded(true)} className={`w-full h-10`} />
                        }
                        <div className={`grow`} />
                        {
                            props.expanded?
                            <>
                                <div className={`grow`} />
                                <div className={`self-stretch flex flex-col justify-between`}>
                                    <SvgButton image={PlusIcon} className={`rotate-45`} onClick={()=> props.setExpanded(false)} scale={30} />
                                    <SvgButton image={GearIcon} onClick={()=> setSettingsOpen(true)} scale={30} />
                                </div>
                            </>
                            :
                            <></>
                        }
                    </div>
                    <SidebarToolbar className={`${props.expanded?'block':'hidden'}`} />
                </div>

                <SideBarContent className={`grow w-full`} />
                
                <div className={`p-2 w-full ${props.expanded?'visible':'collapse'}`}>
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
    // Could I use lazy loading? Probably. Should I do it?
    // No, just out of spite because I don't know why
    // React implemented it that way.
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
        className={` w-full max-w-full @container/sidebarelem`}
        key={actualHotkey.id}
        onClick={onClick}>
            <div className={`${styles.sidebarElement} ${isCurrentEdit?styles.sidebarElementSelected:''} @xs/sidebarelem:min-h-20 @xs/sidebarelem:max-h-20 min-h-40 max-h-40`}>
                <div className={`hidden @xs/sidebarelem:flex flex-col justify-center w-1/12 items-center py-3`}>
                    <SvgButton image={sortUp} onClick={()=> moveElement(true)} svgClassName={`w-full h-auto`} strokeWidth={1} />
                    <CheckBox 
                        onChange={(x)=> checkmarkClicked(x.target.checked, actualHotkey.id)}
                        checked={selected.includes(actualHotkey.id)} />
                    <SvgButton image={sortDown} onClick={()=> moveElement(false)} svgClassName={`w-full h-auto`} strokeWidth={1} />
                </div>

                <div className={`flex flex-row @xs/sidebarelem:py-5 py-1 h-full grow max-w-full items-center justify-center @xs/sidebarelem:justify-normal`}>
                    <div className={`grow @xs/sidebarelem:grow-0`} />
                    <p className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[250px] min-w-0 @xs/sidebarelem:block hidden">
                        {hotkeyText}
                    </p>
                    <p className={`overflow-ellipsis overflow-hidden h-full whitespace-nowrap @xs/sidebarelem:hidden block sidewaysText text-base text-center`}>
                        {actualHotkey.hotkeys[0]??'-'}
                    </p>
                    <div className={`grow`} />
                    {
                        needSaveIcon?
                            <SvgButton 
                                image={FloppyDisk} 
                                onClick={()=> hotkeyDispatch({type: 'saveEdits', id: actualHotkey.id})}
                                className={`@xs/sidebarelem:block hidden`}
                                strokeClasses={`h-full w-auto stroke-fuchsia-500 hover:stroke-fuchsia-400`} /> 
                            : <></> 
                    }
                </div>
            </div>
        </div>
    )
}

export default AbbrSidebar
