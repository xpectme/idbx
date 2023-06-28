import { asyncRequest } from "../core/asyncRequest.ts";

export function getAllKeys(
  store: IDBObjectStore,
  query?: IDBValidKey | IDBKeyRange,
  count?: number,
) {
  // indexeddb get operation
  return asyncRequest<IDBValidKey[]>(store.getAllKeys(query, count));
}
