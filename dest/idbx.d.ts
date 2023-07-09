export declare function asyncRequest<T>(req: IDBRequest<T>): Promise<T>;
export declare function cursorHandler(request: IDBRequest<IDBCursorWithValue | null> | IDBRequest<IDBCursor | null>, iterator: (cursor: IDBCursorWithValue) => boolean | void | Promise<boolean | void>, onEnd?: () => void, onError?: (reason?: unknown) => void): Promise<void>;
export declare function add<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
export declare function clear(store: IDBObjectStore): Promise<undefined>;
export declare function count(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange): Promise<number>;
export declare function del(store: IDBObjectStore, query: IDBValidKey | IDBKeyRange): Promise<undefined> | Promise<undefined[]>;
export declare function get<T>(store: IDBObjectStore | IDBIndex, query: IDBValidKey | IDBKeyRange): Promise<T | undefined>;
export declare function getAll<T>(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>;
export declare function getAllKeys(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>;
export declare function getIndex(db: IDBDatabase, storeName: string, indexName: string): IDBIndex;
export declare function getKey(store: IDBObjectStore | IDBIndex, query: IDBValidKey | IDBKeyRange): Promise<IDBValidKey | undefined>;
export declare function getStore(db: IDBDatabase, storeName: string, mode?: IDBTransactionMode): IDBObjectStore;
export declare function iterate<T>(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): AsyncIterable<T>;
export declare function iterateKeys(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange | null, direction?: IDBCursorDirection): AsyncIterable<IDBValidKey>;
interface IDBXOpenOptions {
    version?: number;
    upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void;
    blocked?: (event: Event) => void;
}
export declare function openDB(name: string, options?: IDBXOpenOptions): Promise<IDBDatabase>;
export {};
export declare function put<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>;
