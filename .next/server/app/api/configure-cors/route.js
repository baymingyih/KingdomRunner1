(()=>{var e={};e.id=176,e.ids=[176],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},29021:e=>{"use strict";e.exports=require("fs")},9801:e=>{"use strict";e.exports=import("firebase-admin/app")},24803:e=>{"use strict";e.exports=import("firebase-admin/storage")},17627:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{patchFetch:()=>p,routeModule:()=>u,serverHooks:()=>g,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var o=r(42706),n=r(28203),i=r(45994),a=r(60766),c=e([a]);a=(c.then?(await c)():c)[0];let u=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/configure-cors/route",pathname:"/api/configure-cors",filename:"route",bundlePath:"app/api/configure-cors/route"},resolvedPagePath:"/Users/bay/Desktop/project/KR1/app/api/configure-cors/route.ts",nextConfigOutput:"standalone",userland:a}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:g}=u;function p(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}s()}catch(e){s(e)}})},96487:()=>{},78335:()=>{},60766:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{GET:()=>p});var o=r(9801),n=r(24803),i=r(37955),a=r(29021),c=e([o,n]);[o,n]=c.then?(await c)():c;let u=JSON.parse(a.readFileSync("./firebase-admin.json","utf8")),d=(0,o.initializeApp)({credential:(0,o.cert)(u),storageBucket:process.env.FIREBASE_STORAGE_BUCKET});async function p(){try{let e=(0,n.getStorage)(d).bucket();return await e.setCors([{origin:i[0].TG,method:i[0].EJ,maxAgeSeconds:i[0].V4,responseHeader:i[0].Rd}]),console.log("CORS configuration applied successfully"),new Response(JSON.stringify({message:"CORS configured successfully"}),{status:200,headers:{"Content-Type":"application/json"}})}catch(e){return console.error("Error configuring CORS:",e),new Response(JSON.stringify({error:e.message}),{status:500,headers:{"Content-Type":"application/json"}})}}s()}catch(e){s(e)}})},42706:(e,t,r)=>{"use strict";e.exports=r(44870)},37955:e=>{"use strict";e.exports=JSON.parse('[{"TG":["http://localhost:3000","https://*.webcontainer.io","https://*.stackblitz.io","https://*.local-credentialless.webcontainer-api.io"],"EJ":["GET","POST","PUT","DELETE","HEAD","OPTIONS"],"V4":3600,"Rd":["Content-Type","Authorization","Content-Length","User-Agent","X-Goog-Resumable","Origin","Access-Control-Allow-Origin"]}]')}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[994],()=>r(17627));module.exports=s})();