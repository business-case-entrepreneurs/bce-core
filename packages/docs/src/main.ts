import { defineCustomElements } from '@bcase/core/loader';
import Vue from 'vue';

import Core from './utils/core';
import { router } from './utils/router';
import App from './App.vue';

(async function main() {
  Vue.config.productionTip = false;
  Vue.config.ignoredElements = [/^bce-/];

  await defineCustomElements(window);

  Vue.use(Core);

  new Vue({
    router,
    render: h => h(App)
  }).$mount('bce-root');
})();
