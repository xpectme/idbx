export function asyncRequest<T>(
  req: IDBRequest<T>,
) {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = (ev) => {
      const target = ev.target as IDBRequest;
      resolve(target.result);
    };
    req.onerror = (ev) => {
      const target = ev.target as IDBRequest;
      reject(new Error(`IndexedDB error: ${target.error?.message}`));
    };
  });
}
