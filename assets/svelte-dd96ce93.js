function j(){}const et=t=>t;function pt(t,e){for(const n in e)t[n]=e[n];return t}function mt(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function nt(t){return t()}function Y(){return Object.create(null)}function C(t){t.forEach(nt)}function G(t){return typeof t=="function"}function Lt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let F;function Rt(t,e){return F||(F=document.createElement("a")),F.href=e,t===F.href}function gt(t){return Object.keys(t).length===0}function yt(t,...e){if(t==null)return j;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Bt(t,e,n){t.$$.on_destroy.push(yt(e,n))}function Ht(t,e,n,s){if(t){const r=st(t,e,n,s);return t[0](r)}}function st(t,e,n,s){return t[1]&&s?pt(n.ctx.slice(),t[1](s(e))):n.ctx}function Gt(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],c=Math.max(e.dirty.length,r.length);for(let i=0;i<c;i+=1)o[i]=e.dirty[i]|r[i];return o}return e.dirty|r}return e.dirty}function It(t,e,n,s,r,o){if(r){const c=st(e,n,s,o);t.p(c,r)}}function Jt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let s=0;s<n;s++)e[s]=-1;return e}return-1}function Kt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function Qt(t,e){const n={};e=new Set(e);for(const s in t)!e.has(s)&&s[0]!=="$"&&(n[s]=t[s]);return n}const rt=typeof window<"u";let ot=rt?()=>window.performance.now():()=>Date.now(),U=rt?t=>requestAnimationFrame(t):j;const N=new Set;function it(t){N.forEach(e=>{e.c(t)||(N.delete(e),e.f())}),N.size!==0&&U(it)}function ct(t){let e;return N.size===0&&U(it),{promise:new Promise(n=>{N.add(e={c:t,f:n})}),abort(){N.delete(e)}}}function bt(t,e){t.appendChild(e)}function ut(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function wt(t){const e=at("style");return $t(ut(t),e),e.sheet}function $t(t,e){return bt(t.head||t,e),e.sheet}function vt(t,e,n){t.insertBefore(e,n||null)}function V(t){t.parentNode&&t.parentNode.removeChild(t)}function Ut(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function at(t){return document.createElement(t)}function kt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function lt(t){return document.createTextNode(t)}function Vt(){return lt(" ")}function Wt(){return lt("")}function Xt(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function Yt(t){return function(e){e.target===this&&t.call(this,e)}}function Zt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function xt(t){return Array.from(t.childNodes)}function te(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ee(t,e){t.value=e??""}function ne(t,e,n,s){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}function se(t,e){for(let n=0;n<t.options.length;n+=1){const s=t.options[n];if(s.__value===e){s.selected=!0;return}}t.selectedIndex=-1}function re(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}function oe(t,e,n){t.classList[n?"add":"remove"](e)}function ft(t,e,{bubbles:n=!1,cancelable:s=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,s,e),r}class ie{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,s=null){this.e||(this.is_svg?this.e=kt(n.nodeName):this.e=at(n.nodeName),this.t=n,this.c(e)),this.i(s)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)vt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(V)}}function ce(t,e){return new t(e)}const B=new Map;let H=0;function Et(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function jt(t,e){const n={stylesheet:wt(e),rules:{}};return B.set(t,n),n}function J(t,e,n,s,r,o,c,i=0){const u=16.666/s;let a=`{
`;for(let g=0;g<=1;g+=u){const y=e+(n-e)*o(g);a+=g*100+`%{${c(y,1-y)}}
`}const _=a+`100% {${c(n,1-n)}}
}`,f=`__svelte_${Et(_)}_${i}`,d=ut(t),{stylesheet:l,rules:h}=B.get(d)||jt(d,t);h[f]||(h[f]=!0,l.insertRule(`@keyframes ${f} ${_}`,l.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?`${m}, `:""}${f} ${s}ms linear ${r}ms 1 both`,H+=1,f}function K(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),r=n.length-s.length;r&&(t.style.animation=s.join(", "),H-=r,H||Ot())}function Ot(){U(()=>{H||(B.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&V(e)}),B.clear())})}let T;function x(t){T=t}function P(){if(!T)throw new Error("Function called outside component initialization");return T}function ue(t){P().$$.on_mount.push(t)}function ae(t){P().$$.on_destroy.push(t)}function le(){const t=P();return(e,n,{cancelable:s=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=ft(e,n,{cancelable:s});return r.slice().forEach(c=>{c.call(t,o)}),!o.defaultPrevented}return!0}}function fe(t,e){return P().$$.context.set(t,e),e}function de(t){return P().$$.context.get(t)}function he(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(s=>s.call(this,e))}const M=[],Z=[],L=[],tt=[],Mt=Promise.resolve();let Q=!1;function Nt(){Q||(Q=!0,Mt.then(W))}function q(t){L.push(t)}const I=new Set;let O=0;function W(){if(O!==0)return;const t=T;do{try{for(;O<M.length;){const e=M[O];O++,x(e),Ct(e.$$)}}catch(e){throw M.length=0,O=0,e}for(x(null),M.length=0,O=0;Z.length;)Z.pop()();for(let e=0;e<L.length;e+=1){const n=L[e];I.has(n)||(I.add(n),n())}L.length=0}while(M.length);for(;tt.length;)tt.pop()();Q=!1,I.clear(),x(t)}function Ct(t){if(t.fragment!==null){t.update(),C(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}let A;function dt(){return A||(A=Promise.resolve(),A.then(()=>{A=null})),A}function D(t,e,n){t.dispatchEvent(ft(`${e?"intro":"outro"}${n}`))}const R=new Set;let E;function Pt(){E={r:0,c:[],p:E}}function St(){E.r||C(E.c),E=E.p}function X(t,e){t&&t.i&&(R.delete(t),t.i(e))}function ht(t,e,n,s){if(t&&t.o){if(R.has(t))return;R.add(t),E.c.push(()=>{R.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}else s&&s()}const _t={duration:0};function _e(t,e,n){const s={direction:"in"};let r=e(t,n,s),o=!1,c,i,u=0;function a(){c&&K(t,c)}function _(){const{delay:d=0,duration:l=300,easing:h=et,tick:m=j,css:g}=r||_t;g&&(c=J(t,0,1,l,d,h,g,u++)),m(0,1);const y=ot()+d,k=y+l;i&&i.abort(),o=!0,q(()=>D(t,!0,"start")),i=ct(b=>{if(o){if(b>=k)return m(1,0),D(t,!0,"end"),a(),o=!1;if(b>=y){const w=h((b-y)/l);m(w,1-w)}}return o})}let f=!1;return{start(){f||(f=!0,K(t),G(r)?(r=r(s),dt().then(_)):_())},invalidate(){f=!1},end(){o&&(a(),o=!1)}}}function pe(t,e,n,s){const r={direction:"both"};let o=e(t,n,r),c=s?0:1,i=null,u=null,a=null;function _(){a&&K(t,a)}function f(l,h){const m=l.b-c;return h*=Math.abs(m),{a:c,b:l.b,d:m,duration:h,start:l.start,end:l.start+h,group:l.group}}function d(l){const{delay:h=0,duration:m=300,easing:g=et,tick:y=j,css:k}=o||_t,b={start:ot()+h,b:l};l||(b.group=E,E.r+=1),i||u?u=b:(k&&(_(),a=J(t,c,l,m,h,g,k)),l&&y(0,1),i=f(b,m),q(()=>D(t,l,"start")),ct(w=>{if(u&&w>u.start&&(i=f(u,m),u=null,D(t,i.b,"start"),k&&(_(),a=J(t,c,i.b,i.duration,0,g,o.css))),i){if(w>=i.end)y(c=i.b,1-c),D(t,i.b,"end"),u||(i.b?_():--i.group.r||C(i.group.c)),i=null;else if(w>=i.start){const S=w-i.start;c=i.a+i.d*g(S/i.duration),y(c,1-c)}}return!!(i||u)}))}return{run(l){G(o)?dt().then(()=>{o=o(r),d(l)}):d(l)},end(){_(),i=u=null}}}function me(t,e){const n=e.token={};function s(r,o,c,i){if(e.token!==n)return;e.resolved=i;let u=e.ctx;c!==void 0&&(u=u.slice(),u[c]=i);const a=r&&(e.current=r)(u);let _=!1;e.block&&(e.blocks?e.blocks.forEach((f,d)=>{d!==o&&f&&(Pt(),ht(f,1,1,()=>{e.blocks[d]===f&&(e.blocks[d]=null)}),St())}):e.block.d(1),a.c(),X(a,1),a.m(e.mount(),e.anchor),_=!0),e.block=a,e.blocks&&(e.blocks[o]=a),_&&W()}if(mt(t)){const r=P();if(t.then(o=>{x(r),s(e.then,1,e.value,o),x(null)},o=>{if(x(r),s(e.catch,2,e.error,o),x(null),!e.hasCatch)throw o}),e.current!==e.pending)return s(e.pending,0),!0}else{if(e.current!==e.then)return s(e.then,1,e.value,t),!0;e.resolved=t}}function ge(t,e,n){const s=e.slice(),{resolved:r}=t;t.current===t.then&&(s[t.value]=r),t.current===t.catch&&(s[t.error]=r),t.block.p(s,n)}function ye(t,e){t.d(1),e.delete(t.key)}function be(t,e){ht(t,1,1,()=>{e.delete(t.key)})}function we(t,e,n,s,r,o,c,i,u,a,_,f){let d=t.length,l=o.length,h=d;const m={};for(;h--;)m[t[h].key]=h;const g=[],y=new Map,k=new Map;for(h=l;h--;){const p=f(r,o,h),$=n(p);let v=c.get($);v?s&&v.p(p,e):(v=a($,p),v.c()),y.set($,g[h]=v),$ in m&&k.set($,Math.abs(h-m[$]))}const b=new Set,w=new Set;function S(p){X(p,1),p.m(i,_),c.set(p.key,p),_=p.first,l--}for(;d&&l;){const p=g[l-1],$=t[d-1],v=p.key,z=$.key;p===$?(_=p.first,d--,l--):y.has(z)?!c.has(v)||b.has(v)?S(p):w.has(z)?d--:k.get(v)>k.get(z)?(w.add(v),S(p)):(b.add(z),d--):(u($,c),d--)}for(;d--;){const p=t[d];y.has(p.key)||u(p,c)}for(;l;)S(g[l-1]);return g}function $e(t,e){const n={},s={},r={$$scope:1};let o=t.length;for(;o--;){const c=t[o],i=e[o];if(i){for(const u in c)u in i||(s[u]=1);for(const u in i)r[u]||(n[u]=i[u],r[u]=1);t[o]=i}else for(const u in c)r[u]=1}for(const c in s)c in n||(n[c]=void 0);return n}function ve(t){return typeof t=="object"&&t!==null?t:{}}function ke(t){t&&t.c()}function At(t,e,n,s){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),s||q(()=>{const c=t.$$.on_mount.map(nt).filter(G);t.$$.on_destroy?t.$$.on_destroy.push(...c):C(c),t.$$.on_mount=[]}),o.forEach(q)}function Dt(t,e){const n=t.$$;n.fragment!==null&&(C(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Tt(t,e){t.$$.dirty[0]===-1&&(M.push(t),Nt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function xe(t,e,n,s,r,o,c,i=[-1]){const u=T;x(t);const a=t.$$={fragment:null,ctx:[],props:o,update:j,not_equal:r,bound:Y(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(u?u.$$.context:[])),callbacks:Y(),dirty:i,skip_bound:!1,root:e.target||u.$$.root};c&&c(a.root);let _=!1;if(a.ctx=n?n(t,e.props||{},(f,d,...l)=>{const h=l.length?l[0]:d;return a.ctx&&r(a.ctx[f],a.ctx[f]=h)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](h),_&&Tt(t,f)),d}):[],a.update(),_=!0,C(a.before_update),a.fragment=s?s(a.ctx):!1,e.target){if(e.hydrate){const f=xt(e.target);a.fragment&&a.fragment.l(f),f.forEach(V)}else a.fragment&&a.fragment.c();e.intro&&X(t.$$.fragment),At(t,e.target,e.anchor,e.customElement),W()}x(u)}class Ee{$destroy(){Dt(this,1),this.$destroy=j}$on(e,n){if(!G(n))return j;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(e){this.$$set&&!gt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}var je=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Oe(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function qt(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function s(){if(this instanceof s){var r=[null];r.push.apply(r,arguments);var o=Function.bind.apply(e,r);return new o}return e.apply(this,arguments)};n.prototype=e.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(t).forEach(function(s){var r=Object.getOwnPropertyDescriptor(t,s);Object.defineProperty(n,s,r.get?r:{enumerable:!0,get:function(){return t[s]}})}),n}const zt={},Ft=Object.freeze(Object.defineProperty({__proto__:null,default:zt},Symbol.toStringTag,{value:"Module"})),Me=qt(Ft);export{ge as $,Pt as A,ht as B,St as C,Bt as D,ue as E,q as F,pe as G,Wt as H,Qt as I,pt as J,Kt as K,Ut as L,ke as M,At as N,$e as O,ve as P,Dt as Q,ce as R,Ee as S,de as T,Ht as U,It as V,Jt as W,Gt as X,ie as Y,fe as Z,me as _,j as a,we as a0,be as a1,he as a2,oe as a3,Yt as a4,ye as a5,se as a6,re as a7,_e as a8,ae as a9,C as b,je as c,Lt as d,G as e,xe as f,Oe as g,at as h,et as i,Vt as j,ne as k,Zt as l,Rt as m,zt as n,vt as o,bt as p,Xt as q,Me as r,yt as s,lt as t,V as u,le as v,Z as w,ee as x,te as y,X as z};
