import { AppErrorScreen } from '@/components/AppErrorScreen';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import Root from './Root';

const root = document.createElement('div')
const shadow = root.attachShadow({mode: 'open'});
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(shadow);

rootDiv.render(
    <React.StrictMode>
        <ErrorBoundary fallbackRender={AppErrorScreen}>
            <Root />
        </ErrorBoundary>
    </React.StrictMode>
);
