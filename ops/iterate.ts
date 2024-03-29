import { cursorHandler } from "../core/cursorHandler.ts";

export function iterate<T>(
  store: IDBObjectStore | IDBIndex,
  query?: IDBValidKey | IDBKeyRange | null,
  direction?: IDBCursorDirection,
): AsyncIterable<T> {
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

  const iterator = (cursor: IDBCursorWithValue) => {
    const value = cursor.value as T;
    _resolve(value);
    if (next) {
      _promise.then(next);
    }
    cursor.continue();
  };

  const request = store.openCursor(query, direction);
  cursorHandler(request, iterator)
    .then(() => (next = undefined))
    .catch((reason) => _reject(reason));

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          if (next) {
            const result = await next();
            yield result;
          } else {
            break;
          }
        }
      } catch (error) {
        throw error;
      }
    },
  };
}
