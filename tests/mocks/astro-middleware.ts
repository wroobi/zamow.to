export const defineMiddleware = <Args extends unknown[]>(handler: (...args: Args) => unknown) => handler;
