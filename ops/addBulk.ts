import { add } from "./add.ts";

export function addBulk<T>(
  store: IDBObjectStore,
  items: T[] = [],
) {
  return Promise.all(items.map((item) => add(store, item)));
}
