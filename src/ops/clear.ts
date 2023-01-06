import { asyncRequest } from "../core/asyncRequest.ts";

export function clear(store: IDBObjectStore) {
  return asyncRequest(store.clear());
}
