import { asyncIterator } from "../core/asyncIterator.ts";

export function openCursorIterator(
  store: IDBObjectStore,
  query?: IDBValidKey | IDBKeyRange,
  direction?: IDBCursorDirection,
) {
  return asyncIterator(store.openCursor(query, direction));
}
