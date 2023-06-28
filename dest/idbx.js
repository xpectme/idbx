function y(e,t){let r=indexedDB.open(e,t);return{upgrade:n=>{r.onupgradeneeded=n},blocked:n=>{r.onblocked=n},ready:new Promise((n,d)=>{r.onsuccess=()=>n(r.result),r.onerror=()=>d(r.error)})}}function o(e){return new Promise((t,r)=>{e.addEventListener("success",n=>{let d=n.target;t(d.result)}),e.addEventListener("error",n=>{let d=n.target;r(new Error(`IndexedDB error: ${d.error?.message}`))})})}function B(e,t,r){return o(e.add(t,r))}function b(e,t=[]){return Promise.all(t.map(r=>B(e,r)))}function i(e,t,r){return o(e.put(t,r))}function h(e,t=[]){return Promise.all(t.map(r=>i(e,r)))}function D(e,t){return o(e.delete(t))}function S(e,t){return Promise.all(t.map(r=>D(e,r)))}function N(e,t){return o(e.get(t))}function G(e,t,r){return o(e.getAll(t,r))}function L(e,t,r){return o(e.getAllKeys(t,r))}function z(e,t){return o(e.getKey(t))}function J(e){return o(e.clear())}function W(e,t){return o(e.count(t))}function I(e,t){let{method:r,data:n,key:d}=t;if(Array.isArray(n))for(let c of n)e[r](c,d);else e[r](n,d)}function Z(e,t,r){let n=new Set(t.map(a=>a.storeName)),d=Array.from(n),c=e.transaction(d,r),u=[];for(let a of t){let m=c.objectStore(a.storeName);switch(a.method){case"add":{I(m,a);break}case"put":{I(m,a);break}case"delete":case"del":{let{key:s}=a;if(Array.isArray(s))for(let l of s)u.push(["del",m.delete(l)]);else u.push(["del",m.delete(s)]);break}case"clear":{u.push(["clear",m.clear()]);break}case"get":{let{query:s}=a;u.push(["get",m.get(s)]);break}case"getAll":{let{query:s,count:l}=a;u.push(["getAll",m.getAll(s,l)]);break}case"getAllKeys":{let{query:s,count:l}=a;u.push(["getAllKeys",m.getAllKeys(s,l)]);break}case"getKey":{let{query:s}=a;u.push(["getKey",m.getKey(s)]);break}case"count":{let{query:s}=a;u.push(["count",m.count(s)]);break}}}return c.commit(),{abort:()=>c.abort(),completed:new Promise((a,m)=>{c.oncomplete=()=>a(u),c.onerror=()=>m(c.error)})}}export{B as add,b as addBulk,Z as batch,J as clear,W as count,D as del,S as delBulk,N as get,G as getAll,L as getAllKeys,z as getKey,y as open,i as put,h as putBulk};
//# sourceMappingURL=idbx.js.map