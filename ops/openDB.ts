interface IDBXOpenOptions {
  version?: number;
  upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void;
  blocked?: (event: Event) => void;
}

export function openDB(name: string, options: IDBXOpenOptions = {}) {
  const request = indexedDB.open(name, options.version);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    if (options.upgrade) {
      // deno-lint-ignore no-explicit-any
      const db = (event.target as any).result;
      options.upgrade(db, event);
    }
  };

  if (options.blocked) {
    request.onblocked = options.blocked;
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
