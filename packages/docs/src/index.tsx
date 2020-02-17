import '@bcase/core/dist/bce/bce.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

const parent = document.createElement('div');
ReactDOM.render(<App />, parent, () => {
  document.getElementById('app')?.replaceWith(...Array.from(parent.childNodes));
});

serviceWorker.unregister();
