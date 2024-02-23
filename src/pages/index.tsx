import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.sass';
import '../global.sass'
import Root from './Root';

const root = document.createElement('div')
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);

rootDiv.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
