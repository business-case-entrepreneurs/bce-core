export type FormInput =
  | HTMLBceInputElement
  | HTMLBceSelectElement
  | HTMLBceSwitchElement;

export const FORM_INPUTS: ReadonlyArray<string> = [
  'bce-input',
  'bce-select',
  'bce-switch'
];
