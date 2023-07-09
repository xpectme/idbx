import { cursorHandler } from "../core/cursorHandler.ts";

export function iterateKeys(
  store: IDBObjectStore | IDBIndex,
  query?: IDBValidKey | IDBKeyRange | null,
  direction?: IDBCursorDirection,
): AsyncIterable<IDBValidKey> {
  let _promise: Promise<IDBValidKey>;
  let _resolve: (value: IDBValidKey) => void;
  let _reject: (reason?: unknown) => void;

  let next: (() => Promise<IDBValidKey>) | void = () => {
    _promise = new Promise<IDBValidKey>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    return _promise;
  };

  const iterator = (cursor: IDBCursorWithValue) => {
    const value = cursor.key;
    _resolve(value);
    if (next) {
      _promise.then(next);
    }
    cursor.continue();
  };

  const request = store.openKeyCursor(query, direction);
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
