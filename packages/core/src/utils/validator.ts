import { isEmail } from './is-email';

type Metadata = { el: any; tag: string; [custom: string]: any };

type Translator = (ctx: TranslatorContext) => Promise<string>;

interface TranslatorContext {
  readonly args: string[];
  readonly message: string;
  readonly meta: Metadata;
  readonly rule: string;
  readonly value: any;
}

type ValidatorResult = boolean | { valid: boolean; message: string };

type ValidatorFunc = (
  value: any,
  args: string[],
  meta: Metadata
) => Promise<ValidatorResult>;

export type ValidatorError = {
  rule: string;
  message: string;
  meta: Metadata;
};

class Validator {
  public readonly rules = new Map<string, ValidatorFunc>();
  public translator?: Translator;

  public async validate(
    validation: string,
    el: any,
    meta: Omit<Metadata, 'el'> = {}
  ) {
    const { value } = el;
    const metadata: Metadata = { ...meta, el, tag: el.tagName.toLowerCase() };

    const rules = validation
      .replace(/\s/g, '')
      .split('|')
      .map(r => {
        const [rule, ...argPart] = r.split(':');
        const arg = argPart.join(':');
        const args = arg ? arg.split(',') : [];
        return { rule, args };
      });

    const errors: ValidatorError[] = [];
    for (const { rule, args } of rules) {
      const error = await this.validateRule(rule, args, value, metadata);
      if (error) errors.push(error);
    }

    return errors;
  }

  public async validateRule(
    rule: string,
    args: string[] = [],
    value: any,
    meta: Metadata
  ) {
    const validator = this.rules.get(rule);
    if (!validator)
      throw new Error(`[${meta.tag}] Unknown validation rule: ${rule}`);

    const result = await validator(value, args, meta);
    const valid = typeof result === 'boolean' ? result : result.valid;
    const message = typeof result === 'boolean' ? '' : result.message;

    if (valid) return null;

    const ctx: TranslatorContext = { args, message, meta, rule, value };
    return {
      rule,
      message: this.translator ? await this.translator(ctx) : message,
      meta
    };
  }
}

export const validator = new Validator();

validator.rules.set('alpha', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('alpha', meta);
    throw new Error(message);
  }

  const valid = /^[A-Z]*$/i.test(value);
  const message = 'This field should only contain alphabetic characters [A-Z].';
  return { valid, message };
});

validator.rules.set('alpha-dash', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('alpha-dash', meta);
    throw new Error(message);
  }

  const valid = /^[0-9A-Z_-]*$/i.test(value);
  const message =
    'This field should only contain alphanumeric characters or dashes [0-9A-Z_-].';
  return { valid, message };
});

validator.rules.set('alpha-num', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('alpha-num', meta);
    throw new Error(message);
  }

  const valid = /^[0-9A-Z]*$/i.test(value);
  const message =
    'This field should only contain alphanumeric characters [0-9A-Z].';
  return { valid, message };
});

validator.rules.set('alpha-spaces', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('alpha-spaces', meta);
    throw new Error(message);
  }

  const valid = /^[A-Z\s]*$/i.test(value);
  const message =
    'This field should only contain alphabetic characters or whitespace [A-Zs].';
  return { valid, message };
});

validator.rules.set('between', async (value, args, meta) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    const message = getUnsupportedMessage('between', meta);
    throw new Error(message);
  }

  const numbers = args.map(str => Number(str)).filter(v => !isNaN(v));
  if (numbers.length !== 2) {
    const err = `[${meta.tag}] The 'between' validation rule requires two numeric argument (e.g. between:5,10).`;
    throw new Error(err);
  }

  const [min, max] = numbers;
  const valid = min <= Number(value) && max >= Number(value);
  const message = `This field should contain a value between ${min} and ${max}.`;
  return { valid, message };
});

validator.rules.set('digits', async (value, args, meta) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    const message = getUnsupportedMessage('between', meta);
    throw new Error(message);
  }

  const length = Number(args[0]);
  if (isNaN(length)) {
    const err = `[${meta.tag}] The 'digits' validation rule requires a numeric argument (e.g. digits:5).`;
    throw new Error(err);
  }

  const str = '' + value;
  const valid = /^[0-9]*$/.test(str) && str.length === length;
  const message = `This field requires ${length} digits.`;
  return { valid, message };
});

validator.rules.set('email', async (value, args, meta) => {
  if (typeof value !== 'undefined' && typeof value !== 'string') {
    const message = getUnsupportedMessage('email', meta);
    throw new Error(message);
  }

  const valid = !value || isEmail(value);
  const message = 'This is not a valid email.';
  return { valid, message };
});

validator.rules.set('in', async (value, args) => {
  const valid = Array.isArray(value)
    ? value.every(v => args.indexOf(v) >= 0)
    : args.indexOf('' + value) >= 0;
  const message = 'This value is not allowed.';
  return { valid, message };
});

validator.rules.set('is', async (value, args) => {
  const check = args.length > 1 ? args : args[0];

  const valid = Array.isArray(check)
    ? (Array.isArray(value) && !value.length) ||
      JSON.stringify(check) === JSON.stringify(value)
    : check == undefined || check === '' + value;

  const message = `The value should be: "${check}".`;
  return { valid, message };
});

validator.rules.set('max', async (value, args, meta) => {
  if (typeof value === 'boolean') {
    const message = getUnsupportedMessage('max', meta);
    throw new Error(message);
  }

  const { el } = meta;
  const size = getSize(el);
  const max = getRangeArg(args[0], el);

  if (Array.isArray(value)) {
    const message = `This field may not exceed ${max} options.`;
    return { valid: size <= max, message };
  }

  if ('type' in el && el.type === 'date') {
    const maxDate = new Date(max).toISOString().slice(0, 10);
    const message = `This field max not not exceed ${maxDate}.`;
    return { valid: !value || size <= max, message };
  }

  if (('type' in el && el.type === 'number') || typeof value === 'number') {
    const message = `This field may not exceed ${max}.`;
    return { valid: value == undefined || size <= max, message };
  }

  const message = `This field may not exceed ${max} characters.`;
  return { valid: !value || size <= max, message };
});

validator.rules.set('min', async (value, args, meta) => {
  if (typeof value === 'boolean') {
    const message = getUnsupportedMessage('max', meta);
    throw new Error(message);
  }

  const { el } = meta;
  const size = getSize(el);
  const min = getRangeArg(args[0], el);

  if (Array.isArray(value)) {
    const message = `This requires at least ${min} options.`;
    return { valid: size === 0 || size >= min, message };
  }

  if ('type' in el && el.type === 'date') {
    const minDate = new Date(min).toISOString().slice(0, 10);
    const message = `This field must be after ${minDate}.`;
    return { valid: !value || size >= min, message };
  }

  if (('type' in el && el.type === 'number') || typeof value === 'number') {
    const message = `This field should be ${min} or higher.`;
    return { valid: value == undefined || size >= min, message };
  }

  const message = `This field requires at least ${min} characters.`;
  return { valid: !value || size >= min, message };
});

validator.rules.set('numeric', async (value, args, meta) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    const message = getUnsupportedMessage('numeric', meta);
    throw new Error(message);
  }

  const str = '' + value;
  const valid = /^[0-9]+$/.test(str);
  const message = 'This field should only contain numeric characters [0-9].';
  return { valid, message };
});

validator.rules.set('phone', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('phone', meta);
    throw new Error(message);
  }

  const regex = /^([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)$/;
  const valid = regex.test(value);
  const message = 'This field should contain a phone number';
  return { valid, message };
});

validator.rules.set('postal-code', async (value, args, meta) => {
  if (typeof value !== 'string') {
    const message = getUnsupportedMessage('postal-code', meta);
    throw new Error(message);
  }

  const valid = /^[1-9][0-9]{3}(?!SA|SD|SS)[A-Z]{2}$/.test(value);
  const message = 'This field should contain a Dutch postal code';
  return { valid, message };
});

validator.rules.set('required', async value => {
  const valid = Array.isArray(value) ? !!value.length : value === 0 || !!value;
  const message = 'This field is required.';
  return { valid, message };
});

const getUnsupportedMessage = (rule: string, meta: Metadata) => {
  return `[${meta.el}] Unsupported validation rule: ${rule}`;
};

const getSize = (el: any): number => {
  if (Array.isArray(el.value)) return el.value.length;
  if ('type' in el && el.type === 'date')
    return new Date(el.value || 0).getTime();
  if (('type' in el && el.type === 'number') || typeof el.value === 'number')
    return Number(el.value);

  return ('' + el.value).length;
};

const getRangeArg = (arg: string | undefined, el: any): number => {
  if ('type' in el && el.type === 'date') return new Date(arg || 0).getTime();
  return arg == undefined ? 0 : Number(arg);
};
