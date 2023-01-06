import { asyncRequest } from "../core/asyncRequest.ts";

export function getAllKeys(store: IDBObjectStore, query: IDBValidKey) {
  // indexeddb get operation
  return asyncRequest<IDBValidKey[]>(store.getAllKeys(query));
}
