interface IDBXOpenResult {
  upgrade: (callback: (event: IDBVersionChangeEvent) => void) => void;
  blocked: (callback: (event: Event) => void) => void;
  ready: Promise<IDBDatabase>;
}

/**
 * @deprecated Use `openDB` instead. `open` will be removed in 2.0.0.
 */
export function open(name: string, version?: number): IDBXOpenResult {
  const request = indexedDB.open(name, version);

  return {
    upgrade: (callback: (event: IDBVersionChangeEvent) => void) => {
      request.onupgradeneeded = callback;
    },
    blocked: (callback: (event: Event) => void) => {
      request.onblocked = callback;
    },
    ready: new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }),
  };
}
