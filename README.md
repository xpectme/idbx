# idbx

No-bullshit indexedDB wrapper functions with promises, iterators and shortcuts.

## Getting started

```ts
import * as idbx from "https://deno.land/x/idbx";

const req = idbx.open("testdb", 1);

// upgrade the database
req.upgrade((event) => {
  const db = event.target.result;
  const store = db.createObjectStore("store");
  store.createIndex("name", "name", { unique: true });
});

const db = await req.ready;

// open a transaction
const tx = db.transaction("store", "readwrite");

// get a store
const store = tx.objectStore("store");

// add items
await idbx.add(store, { name: "foo" });
await idbx.add(store, { name: "bar" });

// add multiple items
await idbx.addBulk(store, [{ name: "baz" }, { name: "qux" }]);

const items = await idbx.getAll(store);
console.log(items);
```

## functions

### idbx.open(name: string, version?: number)

Returns a promise that resolves to an IDBDatabase instance.

```ts
const req = await idbx.open("testdb", 1);

// upgrade the database
req.upgrade((event) => {
  const db = event.target.result;
  // ...
});

req.blocked((event) => {
  // ...
});

const db = await req.ready;

// ...
```

### idbx.add(store: IDBObjectStore, item: T, key?: IDBValidKey)

Adds an item to the store. Returns a promise that resolves to the key of the
added item.

```ts
const key = await idbx.add(store, { name: "foo" });
```

### idbx.addBulk(store: IDBObjectStore, items: T[], key?: IDBValidKey)

Adds multiple items to the store. Returns a promise that resolves to the keys of
the added items.

```ts
const keys = await idbx.addBulk(store, [{ name: "foo" }, { name: "bar" }]);
```

### idbx.put(store: IDBObjectStore, item: T, key?: IDBValidKey)

Adds or updates an item in the store. Returns a promise that resolves to the key
of the added or updated item.

```ts
const key = await idbx.put(store, { name: "foo" });
```

### idbx.putBulk(store: IDBObjectStore, items: T[], key?: IDBValidKey)

Adds or updates multiple items in the store. Returns a promise that resolves to
the keys of the added or updated items.

```ts
const keys = await idbx.putBulk(store, [{ name: "foo" }, { name: "bar" }]);
```

### idbx.del(store: IDBObjectStore, key: IDBValidKey)

Deletes an item from the store. Returns a promise that resolves to undefined.

```ts
await idbx.del(store, 1);
```

### idbx.delBulk(store: IDBObjectStore, keys: IDBValidKey[])

Deletes multiple items from the store. Returns a promise that resolves to
undefined.

```ts
await idbx.delBulk(store, [1, 2]);
```

### idbx.get(store: IDBObjectStore, key: IDBValidKey)

Returns a promise that resolves to the item with the given key.

```ts
const item = await idbx.get(store, 1);
```

### idbx.getAll(store: IDBObjectStore, query?: IDBValidKeyRange)

Returns a promise that resolves to all items in the store.

```ts
const items = await idbx.getAll(store);
```

### idbx.getAllKeys(store: IDBObjectStore, query?: IDBValidKeyRange)

Returns a promise that resolves to all keys in the store.

```ts
const keys = await idbx.getAllKeys(store);
```

### idbx.getKey(store: IDBObjectStore, key: IDBValidKey)

Returns a promise that resolves to the key of the item with the given key.

```ts
const key = await idbx.getKey(store, 1);
```

### idbx.clear(store: IDBObjectStore)

Clears the store. Returns a promise that resolves to undefined.

```ts
await idbx.clear(store);
```

### idbx.count(store: IDBObjectStore, key?: IDBValidKey)

Returns a promise that resolves to the number of items in the store.

```ts
const count = await idbx.count(store);
```

### idbx.openCursor(store: IDBObjectStore, query?: IDBValidKeyRange)

Returns a promise that resolves to an IDBCursor instance.

```ts
const cursor = idbx.openCursor(store);

for await (const item of cursor) {
  console.log(item);
}
```

### idbx.openKeyCursor(store: IDBObjectStore, query?: IDBValidKeyRange)

Returns a promise that resolves to an IDBCursor instance.

```ts
const cursor = idbx.openKeyCursor(store);

for await (const key of cursor) {
  console.log(key);
}
```
