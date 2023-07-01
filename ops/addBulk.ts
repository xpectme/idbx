import { add } from "./add.ts";

/**
 * @deprecated Use `add` instead. `addBulk` will be removed in 2.0.0.
 */
export function addBulk<T>(
  store: IDBObjectStore,
  items: T[] = [],
) {
  return Promise.all(items.map((item) => add(store, item)));
}
