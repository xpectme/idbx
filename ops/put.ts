import { asyncRequest } from "../core/asyncRequest.ts";

export function put<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey) {
  if (Array.isArray(item)) {
    return Promise.all(item.map((i) => asyncRequest(store.put(i, key))));
  }
  return asyncRequest(store.put(item, key));
}
