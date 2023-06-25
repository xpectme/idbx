export declare function open(name: string, version: number): {
    upgrade: (callback: (event: IDBVersionChangeEvent) => void) => void;
    blocked: (callback: (event: Event) => void) => void;
    ready: Promise<IDBDatabase>;
};
