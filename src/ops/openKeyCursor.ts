import { asyncIterator } from "../core/asyncIterator.ts";

export function openKeyCursor(
  store: IDBObjectStore,
  query?: IDBValidKey | IDBKeyRange,
  direction?: IDBCursorDirection,
) {
  return asyncIterator(
    store.openKeyCursor(query, direction),
    (value, next) => {
      if (value) {
        next({ value, done: false });
        value.continue();
      } else {
        next({ value: null, done: true });
      }
    },
  );
}
