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
  query?: IDBValidKey | IDBKeyRange;
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

function read<T>(
  emit: IDBRequest<T>,
  method: keyof IDBXBatchResult<T>,
  results: IDBXBatchResultItem[],
) {
  const index = results.length;
  results.push([method, undefined as any]);
  emit.onsuccess = (event) => {
    const value = (event.target as IDBRequest<T>).result;
    console.log(value)
    results[index] = [method, value === undefined ? true : value];
  };
  emit.onerror = () => {
    results[index] = [method, false];
  };
}

interface IDBXBatchResult<T> {
  add: number;
  put: number;
  del: boolean;
  clear: boolean;
  get: T;
  getAll: T[];
  getAllKeys: IDBValidKey[];
  getKey: IDBValidKey;
  count: number;
}

type IDBXBatchResultItem<
  T = any,
  K extends keyof IDBXBatchResult<T> = keyof IDBXBatchResult<T>,
> = [
  K,
  IDBXBatchResult<T>[K],
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
        const { data, key } = command;
        if (Array.isArray(data)) {
          for (const item of data) {
            read(store.add(item, key), "add", results);
          }
        } else {
          read(store.add(data, key), "add", results);
        }
        break;
      }
      case "put": {
        const { data, key } = command;
        if (Array.isArray(data)) {
          for (const item of data) {
            read(store.put(item, key), "put", results);
          }
        } else {
          read(store.put(data, key), "put", results);
        }
        break;
      }
      case "delete":
      case "del": {
        const { key } = command;
        if (Array.isArray(key)) {
          for (const k of key) {
            read(store.delete(k), "del", results);
          }
        } else {
          read(store.delete(key), "del", results);
        }
        break;
      }
      case "clear": {
        read(store.clear(), "clear", results);
        break;
      }
      case "get": {
        const { query } = command;
        read(store.get(query), "get", results);
        break;
      }
      case "getAll": {
        const { query, count } = command;
        read(store.getAll(query, count), "getAll", results);
        break;
      }
      case "getAllKeys": {
        const { query, count } = command;
        read(store.getAllKeys(query, count), "getAllKeys", results);
        break;
      }
      case "getKey": {
        const { query } = command;
        read(store.getKey(query), "getKey", results);
        break;
      }
      case "count": {
        const { query } = command;
        read(store.count(query), "count", results);
        break;
      }
    }
  }
  // tx.commit();
  return {
    abort: () => tx.abort(),
    completed: new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(results);
      tx.onerror = () => reject(tx.error);
    }),
  } as const as {
    abort: () => void;
    completed: Promise<IDBXBatchResultItem<T>[]>;
  };
}
