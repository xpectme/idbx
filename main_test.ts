// import indexeddb mock for deno
import "https://deno.land/x/indexeddb@1.3.5/polyfill_memory.ts";
import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";

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

Deno.test("addBulk", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.addBulk(store, [
    { id: 1, name: "test" },
    { id: 2, name: "test2" },
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAll(store2);
  assertEquals(result, [{ id: 1, name: "test" }, { id: 2, name: "test2" }]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("putBulk", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.putBulk(store, [
    { id: 1, name: "test" },
    { id: 2, name: "test2" },
  ]);

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAll(store2);
  assertEquals(result, [{ id: 1, name: "test" }, { id: 2, name: "test2" }]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("delBulk", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id" });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.putBulk(store, [
    { id: 1, name: "test" },
    { id: 2, name: "test2" },
  ]);

  const store2 = db.transaction("test", "readwrite").objectStore("test");
  await idbx.delBulk(store2, [1, 2]);

  const store3 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAll(store3);
  assertEquals(result, []);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("clear", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test");
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.put(store, "test", "test");

  const store2 = db.transaction("test", "readwrite").objectStore("test");
  await idbx.clear(store2);

  const store3 = db.transaction("test", "readonly").objectStore("test");
  const result = await idbx.getAll(store3);
  assertEquals(result, []);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("batch(add,put,del)", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id", autoIncrement: true });
  });

  const db = await req.ready;

  const batch = idbx.batch(db, [
    // create item
    { method: "add", storeName: "test", data: { name: "test" } },

    // update item
    { method: "put", storeName: "test", data: { id: 1, name: "test2" } },

    // delete item
    { method: "del", storeName: "test", key: 1 },
  ], "readwrite");

  const results = await batch.completed;
  assertEquals(results, [
    ["add", 1],
    ["put", 1],
    ["del", true],
  ]);

  db.close();
  indexedDB.deleteDatabase("test");
});

Deno.test("batch(get,getAll)", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id", autoIncrement: true });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.add(store, { name: "test" });

  const batch = idbx.batch(db, [
    // get item
    { method: "get", storeName: "test", query: 1 },

    // get all items
    { method: "getAll", storeName: "test" },
  ], "readonly");

  const results = await batch.completed;
  assertEquals(results, [
    ["get", { id: 1, name: "test" }],
    ["getAll", [{ id: 1, name: "test" }]],
  ]);
});

Deno.test("asyncIterator", async () => {
  const req = idbx.open("test", 1);

  req.upgrade((event) => {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore("test", { keyPath: "id", autoIncrement: true });
  });

  const db = await req.ready;

  const store = db.transaction("test", "readwrite").objectStore("test");
  await idbx.addBulk(store, [{ name: "test" }, { name: "test2" }]);

  const expected = [
    { id: 1, name: "test" },
    { id: 2, name: "test2" },
  ];

  const store2 = db.transaction("test", "readonly").objectStore("test");
  const it = idbx.asyncIterator(store2);

  for await (const item of it) {
    assertEquals(item, expected.shift());
  }

  db.close();
  indexedDB.deleteDatabase("test");
});
