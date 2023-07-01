export function cursorHandler(
  store: IDBObjectStore,
  onResult: (cursor: IDBCursorWithValue) => boolean | void,
  onEnd?: () => void,
): void {
  const request = store.openCursor();
  let ended = false;
  // deno-lint-ignore no-explicit-any
  request.onsuccess = (event: any) => {
    const cursor = event.target?.result;
    if (cursor && !ended) {
      ended = onResult?.(cursor) ?? false;
      if (ended) {
        onEnd?.();
      }
    } else if (!ended) {
      ended = true;
      onEnd?.();
    }
  };

  request.onerror = () => {
    throw request.error;
  };
}
