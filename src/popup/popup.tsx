import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './popup.css';
import { Header } from './components/header';

const App: React.FC = () => {
    return (
        <div>
            <Header AppName="My App" />
            <div className="popup">
                <h1>Hello World</h1>
            </div>
        </div>
    );
}

const root = document.createElement('div');
document.body.appendChild(root);    
const rootContainer = createRoot(root);
rootContainer.render(<App />);
