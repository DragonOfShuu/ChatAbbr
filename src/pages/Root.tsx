// import React from 'react'
import styles from './Root.module.sass'
import { useState } from 'react';
import AbbrSidebar from './components/AbbrSidebar';

type Props = {

}

const Root = (props: Props) => {
    const [saidBack, setSaidBack] = useState<boolean>(false)

    return (
        <div>
            <AbbrSidebar className='w-64' />

            <div className='pl-64 flex flex-col gap-3 p-8'>
                <h1>
                    Hello World!
                </h1>

                <button onClick={()=>setSaidBack(true)}>
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
