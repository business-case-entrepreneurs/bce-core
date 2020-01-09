import { JSX as JSXCore } from '@bcase/core';

declare module 'preact/src/jsx' {
  namespace JSXInternal {
    type Attributes = Omit<HTMLAttributes, 'value'>;

    interface IntrinsicElements {
      'bce-button': JSXCore.BceButton & Attributes;
      'bce-card': JSXCore.BceCard & Attributes;
      'bce-chip': JSXCore.BceChip & Attributes;
      'bce-code': JSXCore.BceCode & Omit<Attributes, 'content'>;
      'bce-code-editor': JSXCore.BceCodeEditor & Attributes;
      'bce-dialog': JSXCore.BceDialog & Attributes;
      'bce-dropdown': JSXCore.BceDropdown & Attributes;
      'bce-dropdown-menu': JSXCore.BceDropdownMenu & Attributes;
      'bce-fab': JSXCore.BceFab & Attributes;
      'bce-form': JSXCore.BceForm & Attributes;
      'bce-header': JSXCore.BceHeader & Attributes;
      'bce-icon': JSXCore.BceIcon & Attributes;
      'bce-input': JSXCore.BceInput & Attributes;
      'bce-input-old': JSXCore.BceInputOld & Attributes;
      'bce-label': JSXCore.BceLabel & Attributes;
      'bce-logo': JSXCore.BceLogo & Attributes;
      'bce-menu': JSXCore.BceMenu & Attributes;
      'bce-menu-button': JSXCore.BceMenuButton & Attributes;
      'bce-message': JSXCore.BceMessage & Attributes;
      'bce-option': JSXCore.BceOption & Attributes;
      'bce-option-old': JSXCore.BceOptionOld & Attributes;
      'bce-ripple': JSXCore.BceRipple & Attributes;
      'bce-root': JSXCore.BceRoot & Attributes;
      'bce-select': JSXCore.BceSelect & Attributes;
      'bce-slider': JSXCore.BceSlider & Attributes;
      'bce-status-bar': JSXCore.BceStatusBar & Attributes;
      'bce-switch': JSXCore.BceSwitch & Attributes;
      'bce-tooltip': JSXCore.BceTooltip & Attributes;
    }
  }
}
