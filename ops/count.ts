import { asyncRequest } from "../core/asyncRequest.ts";

export function count(
  store: IDBObjectStore | IDBIndex,
  query?: IDBValidKey | IDBKeyRange,
) {
  return asyncRequest(store.count(query));
}
