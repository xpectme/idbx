// import indexeddb mock for deno
import "https://deno.land/x/indexeddb@v1.1.0/polyfill_memory.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";

import * as idbx from "./main.ts";

Deno.test("open database", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test");
  });

  const db = await req.ready;

  // check if object store exists
  const storeNames = Array.from(db.objectStoreNames);
  assertEquals(storeNames, ["test"]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("add", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite")
    .objectStore("test");

  const result = await idbx.add(store, { id: 1, name: "test" });
  assertEquals(result, 1);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("put", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");

  const result = await idbx.put(store, { id: 1, name: "test" });
  assertEquals(result, 1);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("del", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite")
    .objectStore("test");
  await idbx.add(store, { id: 1, name: "test" });

  // verify that the record exists
  const store2 = db.transaction("test", "readonly")
    .objectStore("test");
  const result = await idbx.get(store2, 1);
  assertEquals(result, { id: 1, name: "test" });

  const store3 = db.transaction("test", "readwrite")
    .objectStore("test");
  await idbx.del(store3, 1);

  // verify that the record was deleted
  const store4 = db.transaction("test", "readonly")
    .objectStore("test");
  const result2 = await idbx.get(store4, 1);
  assertEquals(result2, undefined);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("clear", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.add(store, { id: 1, name: "test" });

  // verify that the record exists
  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.get(store2, 1);
  assertEquals(result, { id: 1, name: "test" });

  const store3 = db.transaction("test", "readwrite").objectStore("test");
  await idbx.clear(store3);

  // verify that the record was deleted
  const store4 = db.transaction("test", "readonly").objectStore("test");
  const result2 = await idbx.get(store4, 1);
  assertEquals(result2, undefined);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("get", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.add(store, { id: 1, name: "test" });

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.get(store2, 1);
  assertEquals(result, { id: 1, name: "test" });

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("getAll", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");

  await Promise.all([
    idbx.add(store, { id: 1, name: "test" }),
    idbx.add(store, { id: 2, name: "test2" }),
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAll(store2);
  assertEquals(result, [{ id: 1, name: "test" }, { id: 2, name: "test2" }]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("getAllKeys", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await Promise.all([
    idbx.add(store, { id: 1, name: "test" }),
    idbx.add(store, { id: 2, name: "test2" }),
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAllKeys(store2);
  assertEquals(result, [1, 2]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("getKey", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await Promise.all([
    idbx.add(store, { id: 1, name: "test" }),
    idbx.add(store, { id: 2, name: "test2" }),
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getKey(store2, 1);
  assertEquals(result, 1);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("count", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await Promise.all([
    idbx.add(store, { id: 1, name: "test" }),
    idbx.add(store, { id: 2, name: "test2" }),
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.count(store2);
  assertEquals(result, 2);

  db.close();
  indexedDB.deleteDatabase("test");
});
