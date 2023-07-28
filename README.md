# IDBX

No-bullshit indexedDB wrapper functions with promises, iterators and shortcuts.
ESM only (Browser, Deno & Node).

## Migration: Breaking Changes to v1

1. I removed the `idbx.open` function in favor of `idbx.openDB`.
2. I removed the `idbx.batch` function, because it has not been well tested and it
does not serve this library because of its complexity.
3. If you want to use `idbx.batch`, I've moved the code to a separate module called
`idbatch`. You can find it here:
  - NodeJS https://www.npmjs.com/package/idbatch
  - Deno https://deno.land/x/idbatch
  - Browser https://esm.sh/idbatch
4. I removed the `idbx.addBulk`, `idbx.putBulk` and `idbx.delBulk` functions in favor
of `idbx.add`, `idbx.put` and `idbx.del`. You can now pass an array of items to
these functions and they will be added as well as a single item.

## Getting started

Deno:
```ts
import * as idbx from "https://deno.land/x/idbx";
```

Node/Deno (same thing):
```ts
import * as idbx from "npm:idbx";
```

Browser:
```ts
import * as idbx from "https://esm.sh/idbx";
```

## Access a database

```ts
const db = await idbx.openDB("testdb");
```

## Create a database

```ts
const db = await idbx.openDB("testdb", {
  upgrade(db, event) {
    const store = db.createObjectStore("store");
    store.createIndex("name_index", "name", { unique: true });
  },
  blocked(event) {
    // on upgrade this event will be fired until all tabs
    // connected to the database are closed or reloaded.
  },
});
```

## Easy access a store

Shorthand code to get a store from a database.

IDBX:
```ts
const store = idbx.getStore(db, "store");
```

It's just a convenience function, Native API is two lines of code ;-)

Native API:
```ts
const tx = db.transaction("store", "readonly");
const store = tx.objectStore("store");
```

## Add an item

```ts
await idbx.add(store, { name: "foo" });
```

## Get an item

```ts
const item = await idbx.get(store, "foo");
```

## Get all items

```ts
const items = await idbx.getAll(store);
```

## Iterate over items

```ts
for await (const item of idbx.iterate(store)) {
  console.log(item);
}
```

## API Reference

### idbx.openDB(name: string, options?: IDBXOptions): Promise<IDBDatabase>

Options:
- `version?: number` - The database version.
- `upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void` - The upgrade callback.
- `blocked?: (event: IDBVersionChangeEvent) => void` - The blocked callback.

Returns a promise that resolves to an IDBDatabase instance.

```ts
const db = await idbx.openDB("testdb", { ... });
```

### idbx.getStore(db: IDBDatabase, name: string, mode?: IDBTransactionMode): IDBObjectStore

Parameters:
- `db: IDBDatabase` - The database connection
- `storeName?: string` - The name of the object store
- `mode?: IDBTransactionMode` - set the read/write mode (default: `readonly`)

Returns an IDBObjectStore instance.

```ts
const store = idbx.getStore(db, "store");
```

### idbx.getIndex(db: IDBDatabase, name: string, indexName: string): IDBIndex

Returns an IDBIndex instance.

```ts
const index = idbx.getIndex(db, "store", "name_index");
```

### idbx.add<T>(store: IDBObjectStore, item: T | T[], key?: IDBValidKey): Promise<IDBValidKey>

Parameters:
- `store: IDBObjectStore` - The store to add the item to.
- `item: T | T[]` - The item to add.
- `key?: IDBValidKey` - The key to add the item with.

Returns a promise that resolves to the key of the added item.

```ts
// add a single item
const key = await idbx.add(store, { name: "foo" });

// or add multiple items at once
const keys = await idbx.add(store, [{ name: "foo" }, { name: "bar" }]);
```

### idbx.put<T>(store: IDBObjectStore, item: T, key?: IDBValidKey): Promise<IDBValidKey>

Parameters:
- `store: IDBObjectStore` - The store to add the item to.
- `item: T | T[]` - The item to add.
- `key?: IDBValidKey` - The key to add the item with.

Returns a promise that resolves to the key of the added item.

```ts
// update a single item
const key = await idbx.put(store, { name: "foo" });

// or update multiple items at once
const keys = await idbx.put(store, [{ name: "foo" }, { name: "bar" }]);
```

### idbx.del(store: IDBObjectStore, key: IDBValidKey): Promise<void>

Parameters:
- `store: IDBObjectStore` - The store to remove the item from.
- `key: IDBValidKey` - The key to remove the item with.

Removes one or more items from the store.

```ts
// remove a single item
await idbx.del(store, "foo");

// or remove multiple items at once
await idbx.del(store, ["foo", "bar"]);
```

### idbx.clear(store: IDBObjectStore): Promise<void>

Parameters:
- `store: IDBObjectStore` - The store to clear.

Returns a promise that resolves to the number of deleted items.

```ts
await idbx.clear(store);
```

### idbx.get<T>(store: IDBObjectStore | IDBIndex, query: IDBValidKey): Promise<T | undefined>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to get the item from.
- `query: IDBValidKey` - The key to get the item with.

Returns a promise that resolves to the item.

```ts
const item = await idbx.get(store, "foo");
```

### idbx.getAll<T>(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<T[]>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to get the item from.
- `query?: IDBValidKey | IDBKeyRange` - The key or key range to get the items with.
- `count?: number` - The maximum number of items to get.

Returns a promise that resolves to an array of items.

```ts
const items = await idbx.getAll(store, IDBKeyRange.bound("foo", "bar"));
```

### idbx.getKey(store: IDBObjectStore | IDBIndex, query: IDBValidKey): Promise<IDBValidKey | undefined>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to get the key from.
- `query: IDBValidKey` - The key to get the key with.

Returns a promise that resolves to the key.

```ts
const key = await idbx.getKey(store, "foo");
```

### idbx.getAllKeys(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange, count?: number): Promise<IDBValidKey[]>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to get the keys from.
- `query?: IDBValidKey | IDBKeyRange` - The key or key range to get the keys with.
- `count?: number` - The maximum number of keys to get.

Returns a promise that resolves to an array of keys.

```ts
const keys = await idbx.getAllKeys(store, IDBKeyRange.bound("foo", "bar"));
```

### idbx.count(store: IDBObjectStore | IDBIndex, query?: IDBValidKey | IDBKeyRange): Promise<number>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to count the items from.
- `query?: IDBValidKey | IDBKeyRange` - The key or key range to count the items with.

Returns a promise that resolves to the number of items.

```ts
const count = await idbx.count(store, IDBKeyRange.bound("foo", "bar"));
```

### idbx.iterate<T>(store, query?, direction?): AsyncIterable<T>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to iterate over.
- `query?: IDBValidKey | IDBKeyRange | null` - The key or key range to iterate over.
- `direction?: IDBCursorDirection` - The direction to iterate in.

Returns an async iterable that yields items.

```ts
for await (const item of idbx.iterate(store)) {
  console.log(item);
}
```

### idbx.iterateKeys(store, query?, direction?): AsyncIterable<IDBValidKey>

Parameters:
- `store: IDBObjectStore | IDBIndex` - The store or index to iterate over.
- `query?: IDBValidKey | IDBKeyRange | null` - The key or key range to iterate over.
- `direction?: IDBCursorDirection` - The direction to iterate in.

Returns an async iterable that yields keys.

```ts
for await (const key of idbx.iterateKeys(store)) {
  console.log(key);
}
```
