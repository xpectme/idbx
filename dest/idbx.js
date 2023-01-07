// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function open(name, version) {
    const request = indexedDB.open(name, version);
    return {
        upgrade: (callback)=>{
            request.onupgradeneeded = callback;
        },
        blocked: (callback)=>{
            request.onblocked = callback;
        },
        ready: new Promise((resolve, reject)=>{
            request.onsuccess = ()=>resolve(request.result);
            request.onerror = ()=>reject(request.error);
        })
    };
}
export { open as open };
function asyncRequest(req) {
    return new Promise((resolve, reject)=>{
        req.addEventListener("success", (ev)=>{
            const target = ev.target;
            resolve(target.result);
        });
        req.addEventListener("error", (ev)=>{
            const target = ev.target;
            reject(new Error(`IndexedDB error: ${target.error?.message}`));
        });
    });
}
function add(store, item, key) {
    return asyncRequest(store.add(item, key));
}
export { add as add };
function addBulk(store, items = [], key) {
    return Promise.all(items.map((item)=>add(store, item, key)));
}
export { addBulk as addBulk };
function put(store, item, key) {
    return asyncRequest(store.put(item, key));
}
export { put as put };
function putBulk(store, items = [], key) {
    return Promise.all(items.map((item)=>put(store, item, key)));
}
export { putBulk as putBulk };
function del(store, query) {
    return asyncRequest(store.delete(query));
}
export { del as del };
function delBulk(store, keys) {
    return Promise.all(keys.map((key)=>del(store, key)));
}
export { delBulk as delBulk };
function get(store, query) {
    return asyncRequest(store.get(query));
}
export { get as get };
function getAll(store, query) {
    return asyncRequest(store.getAll(query));
}
export { getAll as getAll };
function getAllKeys(store, query) {
    return asyncRequest(store.getAllKeys(query));
}
export { getAllKeys as getAllKeys };
function getKey(store, query) {
    return asyncRequest(store.getKey(query));
}
export { getKey as getKey };
function clear(store) {
    return asyncRequest(store.clear());
}
export { clear as clear };
function count(store, query) {
    return asyncRequest(store.count(query));
}
export { count as count };
function write(store, command) {
    const { method , data , key  } = command;
    if (Array.isArray(data)) {
        for (const item of data){
            store[method](item, key);
        }
    } else {
        store[method](data, key);
    }
}
function batch(db, commands, mode) {
    const set = new Set(commands.map((c)=>c.storeName));
    const storeNames = Array.from(set);
    const tx = db.transaction(storeNames, mode);
    const results = [];
    for (const command of commands){
        const store = tx.objectStore(command.storeName);
        switch(command.method){
            case "add":
                {
                    write(store, command);
                    break;
                }
            case "put":
                {
                    write(store, command);
                    break;
                }
            case "delete":
            case "del":
                {
                    const { key  } = command;
                    if (Array.isArray(key)) {
                        for (const k of key){
                            results.push([
                                "delete",
                                store.delete(k)
                            ]);
                        }
                    } else {
                        results.push([
                            "del",
                            store.delete(key)
                        ]);
                    }
                    break;
                }
            case "clear":
                {
                    results.push([
                        "clear",
                        store.clear()
                    ]);
                    break;
                }
            case "get":
                {
                    const { query  } = command;
                    results.push([
                        "get",
                        store.get(query)
                    ]);
                    break;
                }
            case "getAll":
                {
                    const { query: query1 , count  } = command;
                    results.push([
                        "getAll",
                        store.getAll(query1, count)
                    ]);
                    break;
                }
            case "getAllKeys":
                {
                    const { query: query2 , count: count1  } = command;
                    results.push([
                        "getAllKeys",
                        store.getAllKeys(query2, count1)
                    ]);
                    break;
                }
            case "getKey":
                {
                    const { query: query3  } = command;
                    results.push([
                        "getKey",
                        store.getKey(query3)
                    ]);
                    break;
                }
            case "count":
                {
                    const { query: query4  } = command;
                    results.push([
                        "count",
                        store.count(query4)
                    ]);
                    break;
                }
        }
    }
    tx.commit();
    return {
        abort: ()=>tx.abort(),
        completed: new Promise((resolve, reject)=>{
            tx.oncomplete = ()=>resolve(results);
            tx.onerror = ()=>reject(tx.error);
        })
    };
}
export { batch as batch };
