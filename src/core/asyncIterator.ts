// deno-lint-ignore-file no-explicit-any

interface IterableSuccessValue<T> {
  value: T;
  done: boolean;
}

interface SuccessHandler<T> {
  (
    result: IterableSuccessValue<T>,
  ): void;
}

interface ErrorHandler {
  (reason?: any): void;
}

export function asyncIterator<T>(
  req: IDBRequest<T>,
  onSuccess?: (value: T, successHandler: SuccessHandler<T>) => void,
  onError?: (target: any, errorHandler: ErrorHandler) => void,
): AsyncGenerator<T> {
  let next: SuccessHandler<T> | null = null;
  let error: ErrorHandler | null = null;
  let promise: Promise<IterableSuccessValue<T>>;

  const nextPromise = () =>
    new Promise<IterableSuccessValue<T>>((resolve, reject) => {
      next = resolve;
      error = reject;
    });

  promise = nextPromise();
  req.addEventListener("success", (ev) => {
    const target = ev.target as IDBRequest;
    if (onSuccess === undefined) {
      next?.({ value: target.result, done: false });
    } else {
      onSuccess(target.result, (result) => {
        next?.(result);
        promise = nextPromise();
      });
    }
  });

  req.addEventListener("error", (ev) => {
    const target = ev.target as IDBRequest;
    if (onError === undefined) {
      error?.(new Error(`IndexedDB error: ${target.error?.message}`));
    } else {
      onError(target, error!);
    }
  });

  return {
    next() {
      return promise;
    },
    return() {
      return Promise.resolve({ value: undefined, done: true });
    },
    throw(error) {
      return Promise.reject(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
