import { createDecorator } from 'vue-class-component';

export const NoCache = createDecorator((options: any, key) => {
  options.computed[key].cache = false;
});

export const Bind: MethodDecorator = (target, key, descriptor) => {
  return {
    configurable: true,
    get(this) {
      const bound = (descriptor.value as any).bind(this);

      Object.defineProperty(this, key, {
        value: bound,
        configurable: true,
        writable: true
      });

      return bound;
    }
  };
};
