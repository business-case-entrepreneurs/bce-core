export function debounce<T extends (...args: any) => any>(func: T, wait = 200) {
  let timeout: number | undefined = undefined;

  return function(this: any) {
    const context = this;
    const args = arguments as any;

    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(context, args), wait);
  } as (...args: Parameters<T>) => void;
}
