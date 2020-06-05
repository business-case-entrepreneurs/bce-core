interface ThrottleOptions {
  ensureLast: boolean;
}

export function throttle<T extends (...args: any[]) => any>(
  f: T,
  wait = 200,
  options: Partial<ThrottleOptions> = {}
) {
  const opts: ThrottleOptions = { ensureLast: false, ...options };

  let throttled = false;
  let context: any = null;
  let args: any = [];

  return function (this: any) {
    context = this;
    args = arguments;
    if (throttled) return;

    f.apply(context, args);
    throttled = true;

    setTimeout(() => {
      throttled = false;
      if (opts.ensureLast) f.apply(context, args);
    }, wait);
  } as (...args: Parameters<T>) => void;
}
