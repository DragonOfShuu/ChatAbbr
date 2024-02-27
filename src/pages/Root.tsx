// import React from 'react'
// import styles from './Root.module.sass'
import AbbrSidebar from './components/AbbrSidebar';
import HotkeyDataContext from './DataStateContext';
import AbbrEditor from './components/AbbrEditor';

type Props = {

}

const Root = (props: Props) => {
    // const [saidBack, setSaidBack] = useState<boolean>(false)

    // useEffect(()=> {

    // }, [])

    return (
        <div className={`absolute inset-0`} >
            <HotkeyDataContext>
                <AbbrSidebar className='w-96' />

                <AbbrEditor className='pl-96' />

                {/* <div className='ml-96 flex flex-col gap-3 p-8'>
                    <h1>
                        Hello World!
                    </h1>

                    <button onClick={()=>setSaidBack(!saidBack)}>
                        {saidBack ? `Good :)` : `SAY IT BACK >:((`}
                    </button>

                    {
                        saidBack ? <p>Hello!</p> : <></>
                    }
                </div> */}
            </HotkeyDataContext>
        </div>
    )
}

export default Root;
