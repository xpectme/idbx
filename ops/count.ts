import { asyncRequest } from "../core/asyncRequest.ts";

export function count(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange) {
  return asyncRequest(store.count(query));
}
