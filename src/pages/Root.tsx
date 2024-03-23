import AbbrSidebar from './components/AbbrSidebar';
import HotkeyDataContext from './HotkeyDataContext';
import AbbrEditor from './components/AbbrEditor';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import SettingsDataContext from './SettingsDataContext';
import GlobalMessageProvider from '@/components/GlobalUserMessage';

type Props = {

}

const Root = (props: Props) => {

    return (
        <div className={`absolute inset-0`} >
            <ErrorBoundary fallbackRender={AppErrorScreen}>
                <SettingsDataContext>
                    <GlobalMessageProvider>
                        <HotkeyDataContext>
                            <AbbrSidebar className='w-96 max-w-96' />

                            <AbbrEditor className='pl-96' />
                        </HotkeyDataContext>
                    </GlobalMessageProvider>
                </SettingsDataContext>
            </ErrorBoundary>
        </div>
    )
}

const AppErrorScreen = (props: FallbackProps) => {   
    const error = props.error as Error
    const errorMessage = `${error.stack}`

    return (
        <div className='w-full h-full flex place-items-center place-content-center bg-rose-950'>
            <div className='p-10 rounded-xl bg-pink-800 flex flex-col text-white gap-4 max-w-full lg:max-w-[50%]'>
                <h1 className='text-3xl'>An Error Has Occurred</h1>
                <p className='text-lg'>{`Please dm on discord @dragonofshuu, or dm me on instagram at logan.of.shuu.`}</p>
                <p className='text-lg'>{`Include all the details of the error. Here is some information about what occurred:`}</p>
                <pre className='bg-fuchsia-950 text-white rounded-md p-3'>
                    {errorMessage}
                </pre>
                <button onClick={props.resetErrorBoundary} className='py-2'>
                    Attempt Reloading
                </button>
            </div>
        </div>
    )
}

export default Root;
