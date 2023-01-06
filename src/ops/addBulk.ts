import { add } from "./add.ts";

export function addBulk<T>(
  store: IDBObjectStore,
  items: T[] = [],
  key?: IDBValidKey,
) {
  return Promise.all(items.map((item) => add(store, item, key)));
}
