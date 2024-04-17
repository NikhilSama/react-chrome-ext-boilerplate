import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './popup.css';

const App: React.FC = () => {
    useEffect(() => {
        // Your code here
    }, []);

    return (
        <div>
            <h1>Popup</h1>
            <p>Popup</p>
        </div>
    );
}

const root = document.createElement('div');
document.body.appendChild(root);    
const rootContainer = createRoot(root);
rootContainer.render(<App />);
