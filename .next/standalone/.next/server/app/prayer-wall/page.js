(()=>{var e={};e.id=803,e.ids=[803],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},73496:e=>{"use strict";e.exports=require("http2")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},34589:e=>{"use strict";e.exports=require("node:assert")},16698:e=>{"use strict";e.exports=require("node:async_hooks")},4573:e=>{"use strict";e.exports=require("node:buffer")},37540:e=>{"use strict";e.exports=require("node:console")},77598:e=>{"use strict";e.exports=require("node:crypto")},53053:e=>{"use strict";e.exports=require("node:diagnostics_channel")},78474:e=>{"use strict";e.exports=require("node:events")},37067:e=>{"use strict";e.exports=require("node:http")},32467:e=>{"use strict";e.exports=require("node:http2")},77030:e=>{"use strict";e.exports=require("node:net")},643:e=>{"use strict";e.exports=require("node:perf_hooks")},41792:e=>{"use strict";e.exports=require("node:querystring")},57075:e=>{"use strict";e.exports=require("node:stream")},41692:e=>{"use strict";e.exports=require("node:tls")},73136:e=>{"use strict";e.exports=require("node:url")},57975:e=>{"use strict";e.exports=require("node:util")},73429:e=>{"use strict";e.exports=require("node:util/types")},75919:e=>{"use strict";e.exports=require("node:worker_threads")},38522:e=>{"use strict";e.exports=require("node:zlib")},81787:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>n.a,__next_app__:()=>p,pages:()=>l,routeModule:()=>c,tree:()=>d});var s=t(70260),o=t(28203),i=t(25155),n=t.n(i),a=t(67292),u={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(u[e]=()=>a[e]);t.d(r,u);let d=["",{children:["prayer-wall",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,10601)),"/Users/bay/Desktop/project/KR1/app/prayer-wall/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,19611)),"/Users/bay/Desktop/project/KR1/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,41485,23)),"next/dist/client/components/unauthorized-error"]}],l=["/Users/bay/Desktop/project/KR1/app/prayer-wall/page.tsx"],p={require:t,loadChunk:()=>Promise.resolve()},c=new s.AppPageRouteModule({definition:{kind:o.RouteKind.APP_PAGE,page:"/prayer-wall/page",pathname:"/prayer-wall",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},52622:(e,r,t)=>{Promise.resolve().then(t.bind(t,10601))},15670:(e,r,t)=>{Promise.resolve().then(t.bind(t,85213))},85213:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>l});var s=t(45512),o=t(58009),i=t(97643),n=t(87021),a=t(25409),u=t(48859);let d=[{id:1,author:"John D.",content:"Praying for strength and endurance in my upcoming marathon."},{id:2,author:"Sarah M.",content:"Asking for healing for my injured knee."},{id:3,author:"Michael R.",content:"Grateful for the supportive community of runners. Bless them all!"}];function l(){let[e,r]=(0,o.useState)(d),[t,l]=(0,o.useState)({author:"",content:""});return(0,s.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,s.jsx)("h1",{className:"text-4xl font-bold text-center mb-8",children:"Prayer Wall"}),(0,s.jsxs)(i.Zp,{className:"mb-8",children:[(0,s.jsx)(i.aR,{children:(0,s.jsx)(i.ZB,{children:"Share Your Prayer"})}),(0,s.jsx)(i.Wu,{children:(0,s.jsxs)("form",{onSubmit:s=>{s.preventDefault(),t.author&&t.content&&(r([...e,{id:e.length+1,...t}]),l({author:"",content:""}))},className:"space-y-4",children:[(0,s.jsx)(a.p,{placeholder:"Your Name",value:t.author,onChange:e=>l({...t,author:e.target.value})}),(0,s.jsx)(u.T,{placeholder:"Your Prayer",value:t.content,onChange:e=>l({...t,content:e.target.value})}),(0,s.jsx)(n.$,{type:"submit",children:"Submit Prayer"})]})})]}),(0,s.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.map(e=>(0,s.jsxs)(i.Zp,{children:[(0,s.jsx)(i.aR,{children:(0,s.jsx)(i.ZB,{children:e.author})}),(0,s.jsx)(i.Wu,{children:(0,s.jsx)("p",{children:e.content})})]},e.id))})]})}},97643:(e,r,t)=>{"use strict";t.d(r,{BT:()=>a,Wu:()=>u,ZB:()=>n,Zp:()=>o,aR:()=>i});var s=t(45512);t(58009);let o=({children:e,className:r,...t})=>(0,s.jsx)("div",{className:`rounded-md border shadow-sm ${r}`,...t,children:e}),i=({children:e,className:r,...t})=>(0,s.jsx)("div",{className:`px-4 py-3 border-b font-semibold ${r}`,...t,children:e}),n=({className:e,...r})=>(0,s.jsx)("h3",{className:`text-lg font-semibold ${e}`,...r}),a=({className:e,...r})=>(0,s.jsx)("p",{className:`text-sm text-muted-foreground ${e}`,...r}),u=({children:e,className:r,...t})=>(0,s.jsx)("div",{className:`p-4 ${r}`,...t,children:e})},25409:(e,r,t)=>{"use strict";t.d(r,{p:()=>i});var s=t(45512),o=t(58009);let i=t.n(o)().forwardRef(({className:e,type:r,...t},o)=>(0,s.jsx)("input",{type:r,className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",ref:o,...t}));i.displayName="Input"},48859:(e,r,t)=>{"use strict";t.d(r,{T:()=>i});var s=t(45512),o=t(58009);let i=t.n(o)().forwardRef(({className:e,...r},t)=>(0,s.jsx)("textarea",{className:"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",ref:t,...r}));i.displayName="Textarea"},10601:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>s});let s=(0,t(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/bay/Desktop/project/KR1/app/prayer-wall/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/bay/Desktop/project/KR1/app/prayer-wall/page.tsx","default")}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[994,638,218,375],()=>t(81787));module.exports=s})();