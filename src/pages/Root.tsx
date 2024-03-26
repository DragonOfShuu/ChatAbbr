import { useEffect, useState } from 'react';

import AbbrSidebar from './components/AbbrSidebar';
import AbbrEditor from './components/AbbrEditor';

import useWindowDimensions from '@/components/hooks/UseWindowDimensions';

const Root = (props: {}) => {
    // If sidebar is absolute expanded or not
    const [expanded, setExpanded] = useState<boolean>(true);
    // If sidebar is expanded by user
    const [userExpand, setUserExpand] = useState<boolean>(false);
    // If the sidebar hovers over content or if it takes
    // up space in the UI
    const [sidebarTakesSpace, setSidebarTakesSpace] = useState<boolean>(false);
    const {width} = useWindowDimensions();

    useEffect(()=> {
        if (width >= 1024) {
            setExpanded(true)
            setSidebarTakesSpace(true)
            return
        } 
        
        setSidebarTakesSpace(false)
        setExpanded(userExpand)
    }, [width, userExpand])

    return (
        <div className={`absolute inset-0`} >
            {/* <AbbrSidebar className={`${sidebarTakesSpace?'w-96 max-w-96':'w-20 max-w-20'}`} expanded={expanded} /> */}
            <AbbrSidebar className={`${sidebarTakesSpace?'w-96 max-w-96':'w-20 max-w-20'}`} />

            <AbbrEditor className={`${sidebarTakesSpace?'pl-96':'pl-20'}`} />
        </div>
    )
}

export default Root;
