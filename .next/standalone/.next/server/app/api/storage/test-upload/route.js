(()=>{var e={};e.id=346,e.ids=[346],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},55511:e=>{"use strict";e.exports=require("crypto")},14985:e=>{"use strict";e.exports=require("dns")},94735:e=>{"use strict";e.exports=require("events")},29021:e=>{"use strict";e.exports=require("fs")},81630:e=>{"use strict";e.exports=require("http")},73496:e=>{"use strict";e.exports=require("http2")},91645:e=>{"use strict";e.exports=require("net")},21820:e=>{"use strict";e.exports=require("os")},33873:e=>{"use strict";e.exports=require("path")},19771:e=>{"use strict";e.exports=require("process")},27910:e=>{"use strict";e.exports=require("stream")},41204:e=>{"use strict";e.exports=require("string_decoder")},34631:e=>{"use strict";e.exports=require("tls")},79551:e=>{"use strict";e.exports=require("url")},28354:e=>{"use strict";e.exports=require("util")},74075:e=>{"use strict";e.exports=require("zlib")},34589:e=>{"use strict";e.exports=require("node:assert")},16698:e=>{"use strict";e.exports=require("node:async_hooks")},4573:e=>{"use strict";e.exports=require("node:buffer")},37540:e=>{"use strict";e.exports=require("node:console")},77598:e=>{"use strict";e.exports=require("node:crypto")},53053:e=>{"use strict";e.exports=require("node:diagnostics_channel")},78474:e=>{"use strict";e.exports=require("node:events")},37067:e=>{"use strict";e.exports=require("node:http")},32467:e=>{"use strict";e.exports=require("node:http2")},77030:e=>{"use strict";e.exports=require("node:net")},643:e=>{"use strict";e.exports=require("node:perf_hooks")},41792:e=>{"use strict";e.exports=require("node:querystring")},57075:e=>{"use strict";e.exports=require("node:stream")},41692:e=>{"use strict";e.exports=require("node:tls")},73136:e=>{"use strict";e.exports=require("node:url")},57975:e=>{"use strict";e.exports=require("node:util")},73429:e=>{"use strict";e.exports=require("node:util/types")},75919:e=>{"use strict";e.exports=require("node:worker_threads")},38522:e=>{"use strict";e.exports=require("node:zlib")},42856:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>g,routeModule:()=>x,serverHooks:()=>h,workAsyncStorage:()=>f,workUnitAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{POST:()=>l});var o=r(42706),n=r(28203),i=r(45994),a=r(39187),u=r(2057),p=r(58131);class c extends Error{constructor(e,t){super(e),this.code=t,this.name="StorageError"}}async function d(e){try{let t=Date.now(),r=(0,u.KR)(p.storage,`test/cors-test-${t}.txt`);return await (0,u.D)(r,e),!0}catch(e){if(console.error("Storage upload test failed:",e),"storage/unauthorized"===e.code)throw new c("Unauthorized. Please check Firebase configuration.","unauthorized");if("storage/unknown"===e.code)throw new c("Unknown error occurred. Please try again.","unknown");throw new c(e.message||"Failed to upload test file",e.code)}}async function l(e){try{let t=(await e.formData()).get("file");if(!t)return a.NextResponse.json({error:"No file provided"},{status:400});let r=await d(t);return a.NextResponse.json({success:r})}catch(e){if(console.error("Test upload failed:",e),e instanceof c)return a.NextResponse.json({error:e.message,code:e.code},{status:500});return a.NextResponse.json({error:"Test upload failed"},{status:500})}}let x=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/storage/test-upload/route",pathname:"/api/storage/test-upload",filename:"route",bundlePath:"app/api/storage/test-upload/route"},resolvedPagePath:"/Users/bay/Desktop/project/KR1/app/api/storage/test-upload/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:f,workUnitAsyncStorage:m,serverHooks:h}=x;function g(){return(0,i.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:m})}},87065:(e,t,r)=>{Promise.resolve().then(r.bind(r,58131))},57689:(e,t,r)=>{Promise.resolve().then(r.bind(r,14487))},84683:(e,t,r)=>{"use strict";r.d(t,{C:()=>o});let s={apiKey:"AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",authDomain:"kingdomrunnersdv1.firebaseapp.com",projectId:"kingdomrunnersdv1",storageBucket:"kingdomrunnersdv1.firebasestorage.app",messagingSenderId:"626559745548",appId:"1:626559745548:web:3e2f5d7498f7e3beb1f829",measurementId:"G-0G8N8DZWHW"},o={apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY||s.apiKey,authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||s.authDomain,projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID||s.projectId,storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET||s.storageBucket,messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID||s.messagingSenderId,appId:process.env.NEXT_PUBLIC_FIREBASE_APP_ID||s.appId,measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID||s.measurementId}},14487:(e,t,r)=>{"use strict";r.d(t,{db:()=>c,j:()=>p,storage:()=>d,y:()=>u});var s=r(46722),o=r(17656),n=r(85370),i=r(42390),a=r(84683);let u=0===(0,s.Dk)().length?(0,s.Wp)(a.C):(0,s.Dk)()[0],p=(0,n.xI)(u),c=(0,o.aU)(u),d=(0,i.c7)(u)},58131:(e,t,r)=>{"use strict";r.d(t,{storage:()=>o});var s=r(46760);(0,s.registerClientReference)(function(){throw Error("Attempted to call app() from the server but app is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/bay/Desktop/project/KR1/lib/firebase/init.ts","app"),(0,s.registerClientReference)(function(){throw Error("Attempted to call db() from the server but db is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/bay/Desktop/project/KR1/lib/firebase/init.ts","db"),(0,s.registerClientReference)(function(){throw Error("Attempted to call auth() from the server but auth is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/bay/Desktop/project/KR1/lib/firebase/init.ts","auth");let o=(0,s.registerClientReference)(function(){throw Error("Attempted to call storage() from the server but storage is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/bay/Desktop/project/KR1/lib/firebase/init.ts","storage")}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[994,638,452,57],()=>r(42856));module.exports=s})();