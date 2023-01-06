import { del } from "./del.ts";

export function delBulk(
  store: IDBObjectStore,
  keys: Array<IDBValidKey | IDBKeyRange>,
) {
  return Promise.all(keys.map((key) => del(store, key)));
}
