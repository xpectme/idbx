import { asyncRequest } from "../core/asyncRequest.ts";

export function get<T>(
  store: IDBObjectStore | IDBIndex,
  query: IDBValidKey | IDBKeyRange,
) {
  // indexeddb get operation
  return asyncRequest<T | undefined>(store.get(query));
}
