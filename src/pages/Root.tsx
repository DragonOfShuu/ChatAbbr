// import React from 'react'
// import styles from './Root.module.sass'
import { useEffect, useState } from 'react';
import AbbrSidebar from './components/AbbrSidebar';
import HotkeyDataContext from './DataStateContext';

type Props = {

}

const Root = (props: Props) => {
    const [saidBack, setSaidBack] = useState<boolean>(false)

    useEffect(()=> {

    }, [])

    return (
        <HotkeyDataContext>
            <AbbrSidebar className='w-96' />

            <div className='ml-96 flex flex-col gap-3 p-8'>
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
        </HotkeyDataContext>
    )
}

export default Root;
