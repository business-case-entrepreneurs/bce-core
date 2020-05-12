import { FunctionalComponent, h } from '@stencil/core';

import { FormInput } from '../../models/form-input';
import { debounce } from '../../utils/debounce';
import { validator, ValidatorError } from '../../utils/validator';

interface Props {
  el: FormInput;
  disabled?: boolean;
  hasFocus?: boolean;
  hover?: boolean;
  info?: string;
  label?: string;
  name?: string;
  tooltip?: string;
  validation?: string;
}

interface InputCreator extends FunctionalComponent {
  getProps: () => Props;
  handleInput: () => void;
  reset: () => void;
  validate: (silent?: boolean) => Promise<ValidatorError[]>;
}

export const getInputCreator = <T extends any>(
  component: T,
  onerror?: (error: string) => any
): InputCreator => {
  let error = '';

  const fc: FunctionalComponent = (_, children) => {
    const props = getProps();

    return [
      props.label != undefined && (
        <bce-label
          disabled={props.disabled}
          hasFocus={props.hasFocus}
          tooltip={props.tooltip}
          data-hover={props.hover}
        >
          {props.label}
        </bce-label>
      ),
      children,
      (error || props.info) && <small>{error || props.info}</small>
    ];
  };

  const getProps: InputCreator['getProps'] = () => ({
    el: component.el,
    disabled: component.disabled,
    hasFocus: component.hasFocus,
    hover: component.hover,
    label: component.label,
    tooltip: component.tooltip,
    validation: component.validation,
    info: component.info
  });

  const handleInput = () => {
    if (error) validate();
    else _debounceValidate();
  };

  const reset = () => {
    error = '';
    if (onerror) onerror(error);
  };

  const validate = async (silent = false) => {
    const props = getProps();
    if (!props.validation) return [];

    const label = props.label || '';
    const name = props.name || '';
    const meta = { label, name };

    const errors = await validator.validate(props.validation, props.el, meta);
    if (!silent && onerror) {
      error = errors.length ? errors[0].message : '';
      onerror(error);
    }

    return errors;
  };

  const _debounceValidate = debounce(validate, 1000);
  return Object.assign(fc, { getProps, handleInput, reset, validate });
};
