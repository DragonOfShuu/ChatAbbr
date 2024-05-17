import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.sass';
import '../global.sass'
import { ErrorBoundary } from 'react-error-boundary';
import SettingsDataContext from './SettingsDataContext';
import GlobalMessageProvider from '@/components/GlobalUserMessage';
import HotkeyDataContext from './HotkeyDataContext';
import Root from './Root';
import { AppErrorScreen } from '../components/AppErrorScreen';

const root = document.createElement('div')
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);

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
