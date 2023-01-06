import { put } from "./put.ts";

export function putBulk<T>(
  store: IDBObjectStore,
  items: T[] = [],
  key?: IDBValidKey,
) {
  return Promise.all(items.map((item) => put(store, item, key)));
}
