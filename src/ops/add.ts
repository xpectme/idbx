import { asyncRequest } from "../core/asyncRequest.ts";

export function add<T>(store: IDBObjectStore, item: T, key?: IDBValidKey) {
  return asyncRequest(store.add(item, key));
}
