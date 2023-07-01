import { asyncRequest } from "../core/asyncRequest.ts";

export function del(
  store: IDBObjectStore,
  query: IDBValidKey | IDBKeyRange,
) {
  if (Array.isArray(query)) {
    return Promise.all(query.map((q) => asyncRequest(store.delete(q))));
  }
  return asyncRequest(store.delete(query));
}
