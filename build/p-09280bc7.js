var t,e,n=function(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)},s=function(t,e,n){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,n),n};class i{constructor(n,s,i){t.set(this,void 0),e.set(this,void 0),this.id=n,this.name=s,this.type=i.type,this.blob=i}async hash(i="SHA-256",r="hex"){if(!n(this,t)||n(this,e)!==i){const n=await new Response(this.blob).arrayBuffer(),r=await crypto.subtle.digest(i,n);s(this,e,i),s(this,t,Array.from(new Uint8Array(r)))}switch(r){default:case"array":return n(this,t);case"hex":return n(this,t).map((t=>t.toString(16).padStart(2,"0"))).join("")}}}t=new WeakMap,e=new WeakMap;const r=(t,e)=>(t%e+e)%e,a=(t,e)=>{const n=document.createElement("bce-ripple"),s=t.getBoundingClientRect();n.x=e.clientX-s.left,n.y=e.clientY-s.top,t.appendChild(n),setTimeout((()=>n.parentElement.removeChild(n)),500)};function o(t,e=200,n={}){const s=Object.assign({ensureLast:!1},n);let i=!1,r=null,a=[];return function(){r=this,a=arguments,i||(t.apply(r,a),i=!0,setTimeout((()=>{i=!1,s.ensureLast&&t.apply(r,a)}),e))}}export{i as B,r as m,a as r,o as t}