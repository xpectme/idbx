import { put } from "./put.ts";

/**
 * @deprecated Use `put` instead. `putBulk` will be removed in 2.0.0.
 */
export function putBulk<T>(
  store: IDBObjectStore,
  items: T[] = [],
) {
  return Promise.all(items.map((item) => put(store, item)));
}
