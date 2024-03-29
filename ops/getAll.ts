import { asyncRequest } from "../core/asyncRequest.ts";

export function getAll<T>(
  store: IDBObjectStore | IDBIndex,
  query?: IDBValidKey | IDBKeyRange,
  count?: number,
) {
  // indexeddb get operation
  return asyncRequest<T[]>(store.getAll(query, count));
}
