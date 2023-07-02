export declare function asyncRequest<T>(req: IDBRequest<T>): Promise<T>;
export declare function cursorHandler(store: IDBObjectStore, onResult: (cursor: IDBCursorWithValue) => boolean | void, onEnd?: () => void): void;
export declare function add<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
export declare function clear(store: IDBObjectStore): Promise<undefined>;
export declare function count(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange): Promise<number>;
export declare function del(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<undefined> | Promise<undefined[]>;
export declare function get<T>(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<T | undefined>;
export declare function getAll<T>(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>;
export declare function getAllKeys(store: IDBObjectStore, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
export declare function getKey(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined>;
export declare function getStore(db: IDBDatabase, storeName: string, mode?: IDBTransactionMode): IDBObjectStore;
export declare function iterate<T>(store: IDBObjectStore): AsyncIterable<T>;
interface IDBXOpenOptions {
    version?: number;
    upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void;
    blocked?: (event: Event) => void;
}
export declare function openDB(name: string, options?: IDBXOpenOptions): Promise<IDBDatabase>;
export {};
export declare function put<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
