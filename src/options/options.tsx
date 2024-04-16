import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

const test = <p>Options Test</p>;

const root = document.createElement('div');

document.body.appendChild(root);    
const rootContainer = createRoot(root);
rootContainer.render(test);