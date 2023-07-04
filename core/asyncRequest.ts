import { ON_ERROR, ON_SUCCESS } from "./eventTypes.ts";
export function asyncRequest<T>(
  req: IDBRequest<T>,
) {
  return new Promise<T>((resolve, reject) => {
    req[ON_SUCCESS] = (ev) => {
      const target = ev.target as IDBRequest;
      resolve(target.result);
    };
    req[ON_ERROR] = () => {
      reject(req.error);
    };
  });
}
