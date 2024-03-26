import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.sass';
import '../global.sass'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import SettingsDataContext from './SettingsDataContext';
import GlobalMessageProvider from '@/components/GlobalUserMessage';
import HotkeyDataContext from './HotkeyDataContext';
import Root from './Root';

const root = document.createElement('div')
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);

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

rootDiv.render(
    <React.StrictMode>
        <ErrorBoundary fallbackRender={AppErrorScreen}>
            <SettingsDataContext>
                <GlobalMessageProvider>
                    <HotkeyDataContext>
                        <Root />
                    </HotkeyDataContext>
                </GlobalMessageProvider>
            </SettingsDataContext>
        </ErrorBoundary>
    </React.StrictMode>
);
