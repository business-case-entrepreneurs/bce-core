import './style/index.scss';

import { defineCustomElements } from '@bcase/core/loader';

import App from './components/app';

defineCustomElements(window);

if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require('preact/debug');
}

export default App;
