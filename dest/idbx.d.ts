export declare function open(name: string, version?: number): {
    upgrade: (callback: (event: IDBVersionChangeEvent) => void) => void;
    blocked: (callback: (event: Event) => void) => void;
    ready: Promise<IDBDatabase>;
};
export declare function add<T>(store: IDBObjectStore, item: T, key?: IDBValidKey): Promise<IDBValidKey>;
export declare function addBulk<T>(store: IDBObjectStore, items?: T[]): Promise<IDBValidKey[]>;
export declare function put<T>(store: IDBObjectStore, item: T, key?: IDBValidKey): Promise<IDBValidKey>;
export declare function putBulk<T>(store: IDBObjectStore, items?: T[]): Promise<IDBValidKey[]>;
export declare function del(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<undefined>;
export declare function delBulk(store: IDBObjectStore, keys: Array<IDBValidKey | IDBKeyRange>): Promise<undefined[]>;
export declare function get<T>(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<T | undefined>;
export declare function getAll<T>(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>;
export declare function getAllKeys(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
export declare function getKey(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined>;
export declare function clear(store: IDBObjectStore): Promise<undefined>;
export declare function count(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange): Promise<number>;
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
type IDBXCommand<T> = IDBXAddCommand<T> | IDBXPutCommand<T> | IDBXDeleteCommand | IDBXClearCommand | IDBXGetCommand | IDBXGetAllCommand | IDBXGetAllKeysCommand | IDBXGetKeyCommand | IDBXCountCommand;
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
type IDBXBatchResultItem<K extends keyof IDBXBatchResult = keyof IDBXBatchResult> = [
    K,
    IDBXBatchResult[K]
];
export declare function batch<T>(db: IDBDatabase, commands: IDBXCommand<T>[], mode: IDBTransactionMode): {
    abort: () => void;
    completed: Promise<IDBXBatchResultItem[]>;
};
export {};
