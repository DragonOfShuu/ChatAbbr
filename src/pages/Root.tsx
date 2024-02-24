// import React from 'react'
import styles from './Root.module.sass'
import { useEffect, useRef, useState } from 'react';
import AbbrSidebar from './components/AbbrSidebar';
import DataStateModel from './DataStateModel';

type Props = {

}

const Root = (props: Props) => {
    const [saidBack, setSaidBack] = useState<boolean>(false)
    const dataStateModel = useRef<DataStateModel>(new DataStateModel())

    useEffect(()=> {

    }, [])

    return (
        <div>
            <AbbrSidebar className='w-80' dataStateModel={dataStateModel.current} />

            <div className='ml-80 flex flex-col gap-3 p-8'>
                <h1>
                    Hello World!
                </h1>

                <button onClick={()=>setSaidBack(!saidBack)}>
                    {saidBack ? `Good :)` : `SAY IT BACK >:((`}
                </button>

                {
                    saidBack ? <p>Hello!</p> : <></>
                }
            </div>
        </div>
    )
}

export default Root;
