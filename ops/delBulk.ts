import { del } from "./del.ts";

/**
 * @deprecated Use `del` instead. `delBulk` will be removed in 2.0.0.
 */
export function delBulk(
  store: IDBObjectStore,
  keys: Array<IDBValidKey | IDBKeyRange>,
) {
  return Promise.all(keys.map((key) => del(store, key)));
}
