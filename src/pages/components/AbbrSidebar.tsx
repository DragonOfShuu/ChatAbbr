import { useEffect, useState } from "react"
// import { getAbbrList } from "../../database/abbrAPI"
import LoadingComp from "./Loading";
import DataStateModel from "../DataStateModel";

type SideBarProps = {
    className: string,
    dataStateModel: DataStateModel,
}

const AbbrSidebar = (props: SideBarProps) => {
    return (
        <div className={`${props.className??''} min-h-screen bg-fuchsia-200 fixed flex flex-col p-2`}>
            <h1 className="text-6xl">
                ChatAbbr
            </h1>
            <div className={`h-8`} />
            <div className={`flex flex-col grow items-stretch`}>
                <SideBarContent dataStateModel={props.dataStateModel} />
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
    dataStateModel: DataStateModel,
}

const SideBarContent = (props: ContentProps) => {
    const [isLoaded, setLoaded] = useState(false)

    useEffect(()=>{props.dataStateModel.initalize().then(()=>setLoaded(true))}, [])

    // Could I use suspense to avoid any kind of waterfalls? 
    // Maybe. Is it worth it? Definitely not.
    if (!isLoaded) 
        return <LoadingComp />

    return (
        props.dataStateModel.viewAbbrList.length===0?
        <div className={`opacity-35 grow flex justify-center items-center`}>
            <h2>No Templates</h2>
        </div>:
        <>
        
        </>
    )
}


export default AbbrSidebar