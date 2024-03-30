import { useEffect, useState } from 'react';

import AbbrSidebar from './components/AbbrSidebar';
import AbbrEditor from './components/AbbrEditor';

import useWindowDimensions from '@/components/hooks/UseWindowDimensions';
import { useHotkeyContext } from './HotkeyDataContext';

const Root = () => {
    // If sidebar is absolute expanded or not
    const [expanded, setExpanded] = useState<boolean>(true);
    // If sidebar is expanded by user
    const [userExpand, setUserExpand] = useState<boolean|undefined>(undefined);
    // If the sidebar hovers over content or if it takes
    // up space in the UI
    const [sidebarTakesSpace, setSidebarTakesSpace] = useState<boolean>(false);
    const {width} = useWindowDimensions();

    const hotkeyData = useHotkeyContext();

    useEffect(()=> {
        if (width >= 1024) {
            const userHasExpanded = userExpand??true;
            setExpanded(userHasExpanded)
            setSidebarTakesSpace(userHasExpanded)
            return;
        } 
        
        setSidebarTakesSpace(false)
        setExpanded(userExpand??false)
    }, [width, userExpand])

    useEffect(()=> {
        const onUnload = (e: BeforeUnloadEvent) => {
            if (hotkeyData.hasEdits && Object.keys(hotkeyData.hasEdits).length) {
                console.log(`Hotkey changes: `, hotkeyData.hasEdits)
                let exitConfirmation = `Are you sure you want to leave before saving changes? (changes will be lost)`;

                (e || window.event).returnValue = exitConfirmation; //Gecko + IE
                return exitConfirmation; //Gecko + Webkit, Safari, Chrome etc.
            }
        }

        window.addEventListener('beforeunload', onUnload)
        return ()=> window.removeEventListener('beforeunload', onUnload)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`absolute inset-0`} >
            <AbbrSidebar 
                className={`fixed z-50 w-full h-full ${expanded?'w-96 max-w-96':'w-20 max-w-20'} min-h-screen h-screen pointer-events-auto`} 
                expanded={expanded} 
                setExpanded={setUserExpand} />
            <div 
                className={`fixed z-20 w-full h-full ${(!sidebarTakesSpace && expanded)?'bg-fuchsia-300 bg-opacity-20 backdrop-grayscale-[50%]':'pointer-events-none'}`} 
                onClick={()=>setUserExpand(false)} />

            <AbbrEditor className={`relative z-10 w-full h-full ${sidebarTakesSpace?'pl-96':'pl-20'}`} />
        </div>
    )
}

export default Root;
