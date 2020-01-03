export type ValidatorError = { rule: string; message: string };

type Rule = { rule: string; arg?: string };
type Validation = { valid: boolean; message: string };

type ValidatorFunc = (
  value: any,
  arg: string | undefined,
  el: any
) => Promise<Validation>;

interface TranslatorContext {
  readonly arg?: string;
  readonly default: string;
  readonly el: any;
  readonly meta?: any;
  readonly value: any;
}

type Translator = (rule: string, ctx: TranslatorContext) => Promise<string>;

class Validator {
  public readonly rules = new Map<string, ValidatorFunc>();
  public translator?: Translator;

  public validate(rule: string, value: any, el: any, meta?: any) {
    const rules = rule.split('|').map(r => {
      const [rule, arg] = r.split(':');
      return { rule, arg } as Rule;
    });

    return this.exec(value, rules, el, meta);
  }

  private async exec(value: any, rules: Rule[], el: any, meta?: any) {
    let errors: ValidatorError[] = [];

    for (const { rule, arg } of rules) {
      const error = await this.rule(value, rule, el, arg, meta);
      if (error) errors.push(error);
    }

    return errors;
  }

  private async rule(
    value: any,
    rule: string,
    el: any,
    arg?: string,
    meta?: any
  ) {
    const validator = this.rules.get(rule);
    if (!validator) throw new Error('Unknown validation rule: ' + rule);

    const validation = await validator(value, arg, el);
    if (validation.valid) return null;

    const message = this.translator
      ? await this.translator(rule, {
          arg,
          default: validation.message,
          el,
          meta,
          value
        })
      : validation.message;

    return { rule, message };
  }
}

export const validator = new Validator();

validator.rules.set('alpha', async value => {
  const valid = /^[A-Z]*$/i.test(value);
  const message = 'This field should only contain alphabetic characters [A-Z].';
  return { valid, message };
});

validator.rules.set('alpha-dash', async value => {
  const valid = /^[0-9A-Z_-]*$/i.test(value);
  const message =
    'This field should only contain alphanumeric characters or dashes [0-9A-Z_-].';
  return { valid, message };
});

validator.rules.set('alpha-num', async value => {
  const valid = /^[0-9A-Z]*$/i.test(value);
  const message =
    'This field should only contain alphanumeric characters [0-9A-Z].';
  return { valid, message };
});

validator.rules.set('alpha-spaces', async value => {
  const valid = /^[A-Z\s]*$/i.test(value);
  const message =
    'This field should only contain alphabetic characters or whitespace [A-Zs].';
  return { valid, message };
});

validator.rules.set('between', async (value, arg) => {
  const [min, max] = arg ? arg.split(',') : [0, 1];
  const valid = Number(min) <= Number(value) && Number(max) >= Number(value);
  const message = `This field should contain a value between ${min} and ${max}.`;
  return { valid, message };
});

validator.rules.set('digits', async (value, arg) => {
  const length = arg && Number(arg);
  const str = '' + value;

  const valid = /^[0-9]*$/.test(str) && (length ? str.length === length : true);
  const message = length
    ? `This field requires ${length} digits.`
    : 'This field should only contain numbers.';

  return { valid, message };
});

validator.rules.set('email', async value => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(value);
  const message = 'This is not a valid email.';
  return { valid, message };
});

validator.rules.set('in', async (value, arg) => {
  const options = arg ? arg.split(',') : [];
  const valid = options.indexOf('' + value) >= 0;
  const message = 'This value is not allowed.';
  return { valid, message };
});

validator.rules.set('is', async (value, arg) => {
  const valid = arg === value;
  const message = `The value should be: ${arg}.`;
  return { valid, message };
});

validator.rules.set('max', async (value, arg, el) => {
  const size = getSize(value, el);
  const max = getRangeArg(arg, el);

  switch (el.type) {
    case 'checkbox': {
      const message = `This field may not exceed ${max} options.`;
      return { valid: size <= max, message };
    }
    case 'date': {
      const maxDate = new Date(max).toISOString().slice(0, 10);
      const message = `This field max not not exceed ${maxDate}.`;
      return { valid: !value || size <= max, message };
    }
    case 'number': {
      const message = `This field may not exceed ${max}.`;
      return { valid: value == undefined || size <= max, message };
    }
    default: {
      const message = `This field may not exceed ${max} characters.`;
      return { valid: !value || size <= max, message };
    }
  }
});

validator.rules.set('min', async (value, arg, el) => {
  const size = getSize(value, el);
  const min = getRangeArg(arg, el);

  switch (el.type) {
    case 'checkbox': {
      const message = `This requires at least ${min} options.`;
      return { valid: size === 0 || size >= min, message };
    }
    case 'date': {
      const minDate = new Date(min).toISOString().slice(0, 10);
      const message = `This field must be after ${minDate}.`;
      return { valid: !value || size >= min, message };
    }
    case 'number': {
      const message = `This field should be ${min} or higher.`;
      return { valid: value == undefined || size >= min, message };
    }
    default: {
      const message = `This field requires at least ${min} characters.`;
      return { valid: !value || size >= min, message };
    }
  }
});

validator.rules.set('numeric', async value => {
  const str = '' + value;
  const valid = /^[0-9]+$/.test(str);
  const message = 'This field should only contain numeric characters [0-9].';
  return { valid, message };
});

validator.rules.set('required', async value => {
  const valid = Array.isArray(value) ? !!value.length : value === 0 || !!value;
  const message = 'This field is required.';
  return { valid, message };
});

const getSize = (value: any, el: any): number => {
  switch (el.type) {
    case 'checkbox':
      return value.length;
    case 'date':
      return new Date(value).getTime();
    case 'number':
      return value;
    default:
      return ('' + value).length;
  }
};

const getRangeArg = (arg: string | undefined, el: any): number => {
  switch (el.type) {
    case 'date':
      return new Date(arg!).getTime();
    default:
      return Number(arg);
  }
};
