function o(r){return new Promise((e,t)=>{r.onsuccess=a=>{let n=a.target;e(n.result)},r.onerror=a=>{let n=a.target;t(new Error(`IndexedDB error: ${n.error?.message}`))}})}function u(r,e,t){let a=r.openCursor(),n=!1;a.onsuccess=s=>{let i=s.target?.result;i&&!n?(n=e?.(i)??!1,n&&t?.()):n||(n=!0,t?.())},a.onerror=()=>{throw a.error}}function f(r,e,t){return Array.isArray(e)?Promise.all(e.map(a=>o(r.add(a,t)))):o(r.add(e,t))}function D(r){return o(r.clear())}function y(r,e){return o(r.count(e))}function b(r,e){return Array.isArray(e)?Promise.all(e.map(t=>o(r.delete(t)))):o(r.delete(e))}function R(r,e){return o(r.get(e))}function S(r,e,t){return o(r.getAll(e,t))}function q(r,e,t){return o(r.getAllKeys(e,t))}function P(r,e){return o(r.getKey(e))}function k(r,e,t="readonly"){return r.transaction([e],t).objectStore(e)}function _(r){let e,t,a,n=()=>(e=new Promise((s,i)=>{t=s,a=i}),e);return u(r,s=>{let i=s.value;t(i),n&&e.then(n),s.continue()},()=>n=void 0),{async*[Symbol.asyncIterator](){for(;n;)try{yield await n()}catch(s){throw s}}}}function X(r,e={}){let t=indexedDB.open(r,e.version);return t.onupgradeneeded=a=>{if(e.upgrade){let n=a.target.result;e.upgrade(n,a)}},e.blocked&&(t.onblocked=e.blocked),new Promise((a,n)=>{t.onsuccess=()=>a(t.result),t.onerror=()=>n(t.error)})}function $(r,e,t){return Array.isArray(e)?Promise.all(e.map(a=>o(r.put(a,t)))):o(r.put(e,t))}export{f as add,o as asyncRequest,D as clear,y as count,u as cursorHandler,b as del,R as get,S as getAll,q as getAllKeys,P as getKey,k as getStore,_ as iterate,X as openDB,$ as put};
//# sourceMappingURL=idbx.js.map
