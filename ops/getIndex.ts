import { getStore } from "./getStore.ts";

export function getIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
) {
  return getStore(db, storeName, "readonly").index(indexName);
}
