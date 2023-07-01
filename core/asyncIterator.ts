import { cursorHandler } from "./cursorHandler.ts";

export function asyncIterator<T>(store: IDBObjectStore): AsyncIterable<T> {
  let _promise: Promise<T>;
  let _resolve: (value: T) => void;
  let _reject: (reason?: unknown) => void;

  let next: (() => Promise<T>) | void = () => {
    _promise = new Promise<T>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    return _promise;
  };

  cursorHandler(store, (cursor) => {
    const value = cursor.value as T;
    _resolve(value);
    if (next) {
      _promise.then(next);
    }
    cursor.continue();
  }, () => (next = undefined));
  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        if (next) {
          try {
            const result = await next();
            yield result;
          } catch (error) {
            throw error;
          }
        } else {
          break;
        }
      }
    },
  };
}
