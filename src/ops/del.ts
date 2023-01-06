import { asyncRequest } from "../core/asyncRequest.ts";

export function del(
  store: IDBObjectStore,
  query: IDBValidKey | IDBKeyRange,
) {
  return asyncRequest(store.delete(query));
}
