import { asyncRequest } from "../core/asyncRequest.ts";

export function getKey(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange) {
  // indexeddb get operation
  return asyncRequest<IDBValidKey | undefined>(store.getKey(query));
}
