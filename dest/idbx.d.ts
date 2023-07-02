export declare function asyncRequest<T>(req: IDBRequest<T>): Promise<T>;
export declare function cursorHandler(store: IDBObjectStore, onResult: (cursor: IDBCursorWithValue) => boolean | void, onEnd?: () => void): void;
export declare function add<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
/**
 * @deprecated Use `add` instead. `addBulk` will be removed in 2.0.0.
 */
export declare function addBulk<T>(store: IDBObjectStore, items?: T[]): Promise<IDBValidKey[]>;
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
interface IDBXDeleteKeys {
    keys: IDBValidKey[];
}
interface IDBXDeleteKey {
    key: IDBValidKey | IDBKeyRange;
}
interface IDBXDeleteCommandBase {
    storeName: string;
    method: "del";
}
type IDBXDeleteCommand = IDBXDeleteCommandBase & (IDBXDeleteKeys | IDBXDeleteKey);
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
type IDBXCommand<T> = IDBXAddCommand<T> | IDBXPutCommand<T> | IDBXDeleteCommand | IDBXClearCommand | IDBXGetCommand | IDBXGetAllCommand | IDBXGetAllKeysCommand | IDBXGetKeyCommand | IDBXCountCommand;
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
type IDBXBatchResultItem<T = any, K extends keyof IDBXBatchResult<T> = keyof IDBXBatchResult<T>> = [
    K,
    IDBXBatchResult<T>[K]
];
export declare function batch<T>(db: IDBDatabase, commands: IDBXCommand<T>[], mode: IDBTransactionMode): {
    abort: () => void;
    completed: Promise<IDBXBatchResultItem<T>[]>;
};
export {};
export declare function clear(store: IDBObjectStore): Promise<undefined>;
export declare function count(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange): Promise<number>;
export declare function del(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<undefined> | Promise<undefined[]>;
/**
 * @deprecated Use `del` instead. `delBulk` will be removed in 2.0.0.
 */
export declare function delBulk(store: IDBObjectStore, keys: Array<IDBValidKey | IDBKeyRange>): Promise<(undefined[] | undefined)[]>;
export declare function get<T>(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<T | undefined>;
export declare function getAll<T>(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>;
export declare function getAllKeys(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
export declare function getKey(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined>;
export declare function getStore(db: IDBDatabase, storeName: string, mode?: IDBTransactionMode): IDBObjectStore;
export declare function iterate<T>(store: IDBObjectStore): AsyncIterable<T>;
interface IDBXOpenResult {
    upgrade: (callback: (event: IDBVersionChangeEvent) => void) => void;
    blocked: (callback: (event: Event) => void) => void;
    ready: Promise<IDBDatabase>;
}
/**
 * @deprecated Use `openDB` instead. `open` will be removed in 2.0.0.
 */
export declare function open(name: string, version?: number): IDBXOpenResult;
export {};
interface IDBXOpenOptions {
    version?: number;
    upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void;
    blocked?: (event: Event) => void;
}
export declare function openDB(name: string, options?: IDBXOpenOptions): Promise<IDBDatabase>;
export {};
export declare function put<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
/**
 * @deprecated Use `put` instead. `putBulk` will be removed in 2.0.0.
 */
export declare function putBulk<T>(store: IDBObjectStore, items?: T[]): Promise<IDBValidKey[]>;
