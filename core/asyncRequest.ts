export function asyncRequest<T>(
  req: IDBRequest<T>,
) {
  return new Promise<T>((resolve, reject) => {
    req.addEventListener("success", (ev) => {
      const target = ev.target as IDBRequest;
      resolve(target.result);
    });
    req.addEventListener(
      "error",
      (ev) => {
        const target = ev.target as IDBRequest;
        reject(new Error(`IndexedDB error: ${target.error?.message}`));
      },
    );
  });
}
