export type FormInput =
  | HTMLBceColorElement
  | HTMLBceInputElement
  | HTMLBceSelectElement
  | HTMLBceSliderElement
  | HTMLBceSwitchElement;

export const FORM_INPUTS: ReadonlyArray<string> = [
  'bce-color',
  'bce-input',
  'bce-select',
  'bce-slider',
  'bce-switch'
];
