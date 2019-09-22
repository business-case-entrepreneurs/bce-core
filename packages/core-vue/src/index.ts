export type ConfigFunction = (el: ASTElement, dir: ASTDirective) => string;

export interface Options {
  eventNames?: {
    change?: string | ConfigFunction;
    input?: string | ConfigFunction;
  };
  valueExpression?: string | ConfigFunction;
}

const getOption = (
  el: ASTElement,
  dir: ASTDirective,
  item: string | ConfigFunction
) => {
  return typeof item === 'string' ? item : item(el, dir);
};

const addHandler = (
  events: ASTElementHandlers,
  name: string,
  value: string
) => {
  const handlers = events[name];
  const handler: ASTElementHandler = { value: value.trim(), modifiers: null };

  if (Array.isArray(handlers)) handlers.unshift(handler);
  else if (handlers) events[name] = [handler, handlers];
  else events[name] = handler;
};

export const createModelDirective = (o: Options = {}) => {
  return (el: ASTElement, dir: ASTDirective) => {
    // Parse options
    const option = getOption.bind(undefined, el, dir);
    const baseExpression = option(o.valueExpression || '$event.target.value');
    const change = option((o.eventNames && o.eventNames.change) || 'change');
    const input = option((o.eventNames && o.eventNames.input) || 'input');

    // Parse v-model directive
    const { value, modifiers } = dir;
    const { lazy, number: num, trim } = modifiers
      ? modifiers
      : { lazy: null, number: null, trim: null };

    const event = lazy ? change : input;

    // Construct assignment code
    let expression = baseExpression;
    if (trim) expression = `(${expression} || '').trim()`;
    if (num) expression = `_n(${expression})`;

    // Set the initial value on load and create a watcher to update the element
    // whenever the bound value changes.
    const onLoad = [
      `const target = $event.target;`,
      `target.value = ${value};`,
      `$watch('${value}', value => target.value = value);`
    ].join('\n');

    // Attach event listeners
    el.events = el.events || {};

    addHandler(el.events, 'load', onLoad);
    addHandler(el.events, event, `${value} = ${expression};`);
    if (trim || num) addHandler(el.events, 'blur', '$forceUpdate()');
  };
};
