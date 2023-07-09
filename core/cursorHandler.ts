import { ON_ERROR, ON_SUCCESS } from "./eventTypes.ts";
export function cursorHandler(
  request: IDBRequest<IDBCursorWithValue | null> | IDBRequest<IDBCursor | null>,
  iterator: (
    cursor: IDBCursorWithValue,
  ) => boolean | void | Promise<boolean | void>,
  onEnd?: () => void,
  onError?: (reason?: unknown) => void,
): Promise<void> {
  let ended = false;

  let _resolve: () => void | Promise<void>;
  let _reject: (reason?: unknown) => void | Promise<void>;

  const _promise = new Promise<void>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  if (onEnd) {
    _promise.then(onEnd).catch(onError);
  }

  // deno-lint-ignore no-explicit-any
  request[ON_SUCCESS] = async (event: any) => {
    const cursor = event.target?.result as IDBCursorWithValue;
    if (cursor && !ended) {
      ended = await iterator?.(cursor) ?? false;
      if (ended === true) {
        _resolve();
      }
    } else if (!ended) {
      ended = true;
      _resolve();
    }
  };

  request[ON_ERROR] = () => {
    _reject(request.error);
  };

  return _promise;
}
