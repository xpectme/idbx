export function finishTX(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.addEventListener("complete", () => resolve());
    tx.addEventListener("error", () => reject(tx.error));

    // if the transaction is aborted, resolve the promise
    tx.addEventListener("abort", () => {
      resolve();
    });
  });
}
