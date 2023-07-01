import { asyncRequest } from "../core/asyncRequest.ts";

export function add<T>(
  store: IDBObjectStore,
  item: T | T[],
  key?: IDBValidKey,
): Promise<IDBValidKey> {
  if (Array.isArray(item)) {
    return Promise.all(item.map((i) => asyncRequest(store.add(i, key))));
  }
  return asyncRequest(store.add(item, key));
}
