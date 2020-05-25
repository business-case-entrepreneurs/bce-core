export function throttle<T extends (...args: any[]) => any>(f: T, wait = 200) {
  let throttled = false;

  return function (this: any) {
    if (throttled) return;
    const context = this;
    const args = arguments as any;

    f.apply(context, args);
    throttled = true;
    setTimeout(() => (throttled = false), wait);
  } as (...args: Parameters<T>) => void;
}
