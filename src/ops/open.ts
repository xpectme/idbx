export function open(name: string, version: number) {
  const request = indexedDB.open(name, version);

  return {
    upgrade: (callback: (event: IDBVersionChangeEvent) => void) => {
      request.onupgradeneeded = callback;
    },
    blocked: (callback: (event: Event) => void) => {
      request.onblocked = callback;
    },
    ready: new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }),
  };
}
