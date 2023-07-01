export function getStore(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode = "readonly",
) {
  const transaction = db.transaction([storeName], mode);
  const store = transaction.objectStore(storeName);
  return store;
}
