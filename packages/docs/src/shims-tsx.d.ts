import { JSX as CoreJSX } from '@bcase/core';
import Vue, { VNode } from 'vue';

import { CoreMixin } from './utils/core';

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}

    interface IntrinsicElements extends CoreJSX.IntrinsicElements {
      [elem: string]: any;
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $bce: CoreMixin['$bce'];
  }
}
