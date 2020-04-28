import '@bcase/core/dist/bce/bce.css';

import { applyPolyfills, defineCustomElements } from '@bcase/core/loader';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

applyPolyfills().then(() => defineCustomElements(window));

const app = document.getElementById('app');
ReactDOM.render(<App />, app);

serviceWorker.unregister();
