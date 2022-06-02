export default function getFn(fn: any, ...args: Array<any>) {
  return typeof fn === 'function'
    ? fn(...args)
    : fn;
}
