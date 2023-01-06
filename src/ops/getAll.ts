import { asyncRequest } from "../core/asyncRequest.ts";

export function getAll<T>(
  store: IDBObjectStore,
  query?: IDBValidKey | IDBKeyRange,
) {
  // indexeddb get operation
  return asyncRequest<T[]>(store.getAll(query));
}
