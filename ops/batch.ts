// deno-lint-ignore-file no-explicit-any

interface IDBXAddCommand<T> {
  storeName: string;
  method: "add";
  data: T | T[];
  key?: IDBValidKey;
}

interface IDBXPutCommand<T> {
  storeName: string;
  method: "put";
  data: T | T[];
  key?: IDBValidKey;
}

interface IDBXDeleteCommand {
  storeName: string;
  method: "delete" | "del";
  key: IDBValidKey | IDBKeyRange;
}

interface IDBXClearCommand {
  storeName: string;
  method: "clear";
}

interface IDBXGetCommand {
  storeName: string;
  method: "get";
  query: IDBValidKey;
}

interface IDBXGetAllCommand {
  storeName: string;
  method: "getAll";
  query: IDBValidKey | IDBKeyRange;
  count?: number;
}

interface IDBXGetAllKeysCommand {
  storeName: string;
  method: "getAllKeys";
  query: IDBValidKey | IDBKeyRange;
  count?: number;
}

interface IDBXGetKeyCommand {
  storeName: string;
  method: "getKey";
  query: IDBValidKey;
}

interface IDBXCountCommand {
  storeName: string;
  method: "count";
  query: IDBValidKey | IDBKeyRange;
}

type IDBXCommand<T> =
  | IDBXAddCommand<T>
  | IDBXPutCommand<T>
  | IDBXDeleteCommand
  | IDBXClearCommand
  | IDBXGetCommand
  | IDBXGetAllCommand
  | IDBXGetAllKeysCommand
  | IDBXGetKeyCommand
  | IDBXCountCommand;

function write<T>(
  store: IDBObjectStore,
  command: IDBXAddCommand<T> | IDBXPutCommand<T>,
) {
  const { method, data, key } = command;
  if (Array.isArray(data)) {
    for (const item of data) {
      store[method](item, key);
    }
  } else {
    store[method](data, key);
  }
}

interface IDBXBatchResult {
  add: IDBRequest<undefined>;
  put: IDBRequest<undefined>;
  del: IDBRequest<undefined>;
  clear: IDBRequest<undefined>;
  get: IDBRequest<any>;
  getAll: IDBRequest<any[]>;
  getAllKeys: IDBRequest<IDBValidKey[]>;
  getKey: IDBRequest<IDBValidKey>;
  count: IDBRequest<number>;
}

type IDBXBatchResultItem<
  K extends keyof IDBXBatchResult = keyof IDBXBatchResult,
> = [
  K,
  IDBXBatchResult[K],
];

export function batch<T>(
  db: IDBDatabase,
  commands: IDBXCommand<T>[],
  mode: IDBTransactionMode,
) {
  const set = new Set(commands.map((c) => c.storeName));
  const storeNames = Array.from(set);

  const tx = db.transaction(storeNames, mode);
  const results: IDBXBatchResultItem[] = [];
  for (const command of commands) {
    const store = tx.objectStore(command.storeName);
    switch (command.method) {
      case "add": {
        write(store, command as IDBXAddCommand<T>);
        break;
      }
      case "put": {
        write(store, command as IDBXPutCommand<T>);
        break;
      }
      case "delete":
      case "del": {
        const { key } = command;
        if (Array.isArray(key)) {
          for (const k of key) {
            results.push(["del", store.delete(k)]);
          }
        } else {
          results.push(["del", store.delete(key)]);
        }
        break;
      }
      case "clear": {
        results.push(["clear", store.clear()]);
        break;
      }
      case "get": {
        const { query } = command;
        results.push(["get", store.get(query)]);
        break;
      }
      case "getAll": {
        const { query, count } = command;
        results.push(["getAll", store.getAll(query, count)]);
        break;
      }
      case "getAllKeys": {
        const { query, count } = command;
        results.push(["getAllKeys", store.getAllKeys(query, count)]);
        break;
      }
      case "getKey": {
        const { query } = command;
        results.push(["getKey", store.getKey(query)]);
        break;
      }
      case "count": {
        const { query } = command;
        results.push(["count", store.count(query)]);
        break;
      }
    }
  }
  tx.commit();
  return {
    abort: () => tx.abort(),
    completed: new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(results);
      tx.onerror = () => reject(tx.error);
    }),
  } as const as {
    abort: () => void;
    completed: Promise<IDBXBatchResultItem[]>;
  };
}
