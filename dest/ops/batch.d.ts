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
export declare function batch<T>(db: IDBDatabase, commands: IDBXCommand<T>[], mode: IDBTransactionMode): {
    abort: () => void;
    completed: Promise<unknown>;
};
export {};
