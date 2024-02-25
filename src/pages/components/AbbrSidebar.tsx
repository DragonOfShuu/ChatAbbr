import { useEffect, useState } from "react"
// import { getAbbrList } from "../../database/abbrAPI"
import LoadingComp from "./Loading";

type SideBarProps = {
    className: string,
}

const AbbrSidebar = (props: SideBarProps) => {
    return (
        <div className={`${props.className??''} min-h-screen bg-fuchsia-200 fixed flex flex-col p-2`}>
            <h1 className="text-6xl">
                ChatAbbr
            </h1>
            <div className={`h-8`} />
            <div className={`flex flex-col grow items-stretch`}>
                <SideBarContent />
            </div>
            <div>
                <a href="https://dragonofshuu.dev/" target="_blank" rel="noopener noreferrer">
                    {`Made with <3 by Logan Cederlof`}
                </a>
            </div>
        </div>
    )
}


type ContentProps = {

}

const SideBarContent = (props: ContentProps) => {
    const [isLoaded, setLoaded] = useState(false)

    // useEffect(()=>{props.dataStateModel.initalize().then( ()=>setTimeout(()=>setLoaded(true), 2000000) )}, [])

    // Could I use suspense to avoid any kind of waterfalls? 
    // Maybe. Is it worth it? Definitely not.
    useEffect(()=> {
        setTimeout(()=>setLoaded(true), 2000)
    }, [])
    
    if (!isLoaded) {
        console.log("Is going to loading component")
        return <LoadingComp className={`grow flex justify-center items-center`} />
    }

    return (
        // props.dataStateModel.viewAbbrList.length===0?
        true?
        <div className={`opacity-35 grow flex justify-center items-center`}>
            <h2>No Templates</h2>
        </div>:
        <>
        
        </>
    )
}


export default AbbrSidebar