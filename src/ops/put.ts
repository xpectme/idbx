import { asyncRequest } from "../core/asyncRequest.ts";

export function put<T>(store: IDBObjectStore, item: T, key?: IDBValidKey) {
  return asyncRequest(store.put(item, key));
}
