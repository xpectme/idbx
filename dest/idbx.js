// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
function bulkAdd(store, items = [], key) {
    return Promise.all(items.map((item)=>add(store, item, key)));
}
export { bulkAdd as bulkAdd };
function clear(store) {
    return asyncRequest(store.clear());
}
export { clear as clear };
function count(store, query) {
    return asyncRequest(store.count(query));
}
export { count as count };
function del(store, query) {
    return asyncRequest(store.delete(query));
}
export { del as del };
function delBulk(store, keys) {
    return Promise.all(keys.map((key)=>del(store, key)));
}
export { delBulk as delBulk };
function finishTX(tx) {
    return new Promise((resolve, reject)=>{
        tx.addEventListener("complete", ()=>resolve());
        tx.addEventListener("error", ()=>reject(tx.error));
        tx.addEventListener("abort", ()=>{
            resolve();
        });
    });
}
export { finishTX as finishTX };
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
function asyncIterator(req, onSuccess, onError) {
    let next = null;
    let error = null;
    let promise;
    const nextPromise = ()=>new Promise((resolve, reject)=>{
            next = resolve;
            error = reject;
        });
    promise = nextPromise();
    req.addEventListener("success", (ev)=>{
        const target = ev.target;
        if (onSuccess === undefined) {
            next?.({
                value: target.result,
                done: false
            });
        } else {
            onSuccess(target.result, (result)=>{
                next?.(result);
                promise = nextPromise();
            });
        }
    });
    req.addEventListener("error", (ev)=>{
        const target = ev.target;
        if (onError === undefined) {
            error?.(new Error(`IndexedDB error: ${target.error?.message}`));
        } else {
            onError(target, error);
        }
    });
    return {
        next () {
            return promise;
        },
        return () {
            return Promise.resolve({
                value: undefined,
                done: true
            });
        },
        throw (error) {
            return Promise.reject(error);
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
}
function openCursorIterator(store, query, direction) {
    return asyncIterator(store.openCursor(query, direction));
}
export { openCursorIterator as openCursorIterator };
function openKeyCursor(store, query, direction) {
    return asyncIterator(store.openCursor(query, direction), (value, next)=>{
        if (value) {
            next({
                value,
                done: false
            });
            value.continue();
        } else {
            next({
                value: null,
                done: true
            });
        }
    });
}
export { openKeyCursor as openKeyCursor };
function put(store, item, key) {
    return asyncRequest(store.put(item, key));
}
export { put as put };
function putBulk(store, items = [], key) {
    return Promise.all(items.map((item)=>put(store, item, key)));
}
export { putBulk as putBulk };
