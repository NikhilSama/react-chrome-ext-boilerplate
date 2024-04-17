import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './popup.css';
import { Header } from './components/header';
import { Body } from './components/body';

const App: React.FC = () => {
    return (
        <div>
            <Header AppName="Summarizer" />
            <Body />
        </div>
    );
}

const root = document.createElement('div');
document.body.appendChild(root);    
const rootContainer = createRoot(root);
rootContainer.render(<App />);
