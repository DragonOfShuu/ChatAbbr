import { ReactNode, useLayoutEffect, useState } from "react"

type Props = {
    className?: string
    children: { [name: string]: ReactNode }
}

const TabbedPager = (props: Props) => {
    const [page, setPage] = useState<undefined|{index: number, name: string}>(undefined);

    useLayoutEffect(()=> {
        const names = Object.keys(props.children)
        const length = names.length

        if (page===undefined) {
            setPage(length>0?{index: 0, name: names[0]}:undefined)
            return
        }

        if (page.index > length-1) {
            setPage({index: length-1, name: names[length-1]})
        }
    }, [props.children, page])

    const setPageIndex = (index: number) => {
        if (index<0 || index>Object.keys(props.children).length-1) return;

        const name = Object.keys(props.children)[index];

        setPage({index: index, name: name});
    }

    return (
        <div className={`${props.className??''}`}>
            <Tabs className={`w-full h-12`} tabs={Object.keys(props.children)} selected={page?.index} setSelected={setPageIndex} />
            <div className={`h-full max-h-full w-full max-w-full overflow-hidden`}>
                {
                    page===undefined?
                        <div className="w-full h-full flex flex-col place-content-center">
                            <h1 className={`text-fuchsia-300`}>
                                No Data Selected
                            </h1>
                        </div>
                        :
                        props.children[page.name]
                }
            </div>
        </div>
    )
}

const Tabs = (props: {className?: string, tabs: string[], selected: number|undefined, setSelected: (x: number)=>any}) => {
    return (
        <div className={`${props.className??''}`}>
            <div className={`flex flex-row items-stretch gap-2 p-2 w-full h-full overflow-hidden no-scrollbar`}>
                {
                    props.tabs.map((name, index)=> {
                        return (
                            <button 
                                className={`${props.selected===index?'bg-rose-500':'bg-rose-300'} rounded-lg text-white flex flex-row items-center px-4 py-3`} 
                                key={name}
                                onClick={()=>props.setSelected(index)}>

                                    <p className={`text-lg grow`}>
                                        {name}
                                    </p>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TabbedPager;