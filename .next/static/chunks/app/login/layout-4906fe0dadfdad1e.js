(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[915],{150:(e,n,t)=>{Promise.resolve().then(t.bind(t,8889))},8889:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>s});var r=t(5155);t(2115);let s=(0,t(5999).L)(e=>{let{children:n}=e;return(0,r.jsx)("div",{className:"min-h-screen bg-background",children:n})})},3196:(e,n,t)=>{"use strict";t.d(n,{AuthProvider:()=>i,Z:()=>d});var r=t(5155),s=t(2115),u=t(4565),a=t(9891);let o=(0,s.createContext)({user:null,loading:!0});function i(e){let{children:n}=e,[t,i]=(0,s.useState)(null),[d,c]=(0,s.useState)(!0);return(0,s.useEffect)(()=>{var e;let n=(e=e=>{i(e),c(!1)},(0,u.hg)(a.j,e));return()=>n()},[]),(0,r.jsx)(o.Provider,{value:{user:t,loading:d},children:n})}function d(){return(0,s.useContext)(o)}},5999:(e,n,t)=>{"use strict";t.d(n,{L:()=>i,r:()=>o});var r=t(5155),s=t(2115),u=t(6046),a=t(3196);function o(e){return function(n){let{user:t,loading:o}=(0,a.Z)(),i=(0,u.useRouter)();return((0,s.useEffect)(()=>{o||t||i.push("/login")},[t,o,i]),o)?(0,r.jsx)("div",{children:"Loading..."}):t?(0,r.jsx)(e,{...n}):null}}function i(e){return function(n){let{user:t,loading:o}=(0,a.Z)(),i=(0,u.useRouter)();return((0,s.useEffect)(()=>{!o&&t&&i.push("/dashboard")},[t,o,i]),o)?(0,r.jsx)("div",{children:"Loading..."}):t?null:(0,r.jsx)(e,{...n})}}},9911:(e,n,t)=>{"use strict";t.d(n,{C:()=>u});var r=t(2818);let s={apiKey:"AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",authDomain:"kingdomrunnersdv1.firebaseapp.com",projectId:"kingdomrunnersdv1",storageBucket:"kingdomrunnersdv1.firebasestorage.app",messagingSenderId:"626559745548",appId:"1:626559745548:web:3e2f5d7498f7e3beb1f829",measurementId:"G-0G8N8DZWHW"},u={apiKey:r.env.NEXT_PUBLIC_FIREBASE_API_KEY||s.apiKey,authDomain:r.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||s.authDomain,projectId:r.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID||s.projectId,storageBucket:r.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET||s.storageBucket,messagingSenderId:r.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID||s.messagingSenderId,appId:r.env.NEXT_PUBLIC_FIREBASE_APP_ID||s.appId,measurementId:r.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID||s.measurementId}},9891:(e,n,t)=>{"use strict";t.d(n,{db:()=>c,j:()=>d,storage:()=>l,y:()=>i});var r=t(9904),s=t(7058),u=t(4565),a=t(333),o=t(9911);let i=0===(0,r.Dk)().length?(0,r.Wp)(o.C):(0,r.Dk)()[0],d=(0,u.xI)(i),c=(0,s.aU)(i),l=(0,a.c7)(i);(0,u.oM)(d,u.F0).catch(e=>{console.error("Error setting auth persistence:",e)}),(0,s.ol)(c).catch(e=>{"failed-precondition"===e.code?console.warn("Multiple tabs open, persistence enabled in first tab only"):"unimplemented"===e.code&&console.warn("Browser does not support persistence")})},6046:(e,n,t)=>{"use strict";var r=t(6658);t.o(r,"usePathname")&&t.d(n,{usePathname:function(){return r.usePathname}}),t.o(r,"useRouter")&&t.d(n,{useRouter:function(){return r.useRouter}})}},e=>{var n=n=>e(e.s=n);e.O(0,[992,794,575,441,517,358],()=>n(150)),_N_E=e.O()}]);