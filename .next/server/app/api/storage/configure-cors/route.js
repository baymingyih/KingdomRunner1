(()=>{var e={};e.id=10,e.ids=[10],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},30589:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>f,routeModule:()=>c,serverHooks:()=>l,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>p});var n={};r.r(n),r.d(n,{POST:()=>u});var o=r(42706),i=r(28203),s=r(45994),a=r(39187);async function u(){try{return a.NextResponse.json({message:"CORS configuration is now handled in /api/configure-cors"},{status:200})}catch(e){return console.error("Failed to configure CORS:",e),a.NextResponse.json({error:"Failed to configure CORS"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/storage/configure-cors/route",pathname:"/api/storage/configure-cors",filename:"route",bundlePath:"app/api/storage/configure-cors/route"},resolvedPagePath:"/Users/bay/Desktop/project/KR1/app/api/storage/configure-cors/route.ts",nextConfigOutput:"standalone",userland:n}),{workAsyncStorage:d,workUnitAsyncStorage:p,serverHooks:l}=c;function f(){return(0,s.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:p})}},96487:()=>{},78335:()=>{},24982:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{describeHasCheckingStringProperty:function(){return a},describeStringPropertyAccess:function(){return s},isRequestAPICallableInsideAfter:function(){return d},throwWithStaticGenerationBailoutError:function(){return u},throwWithStaticGenerationBailoutErrorWithDynamicError:function(){return c},wellKnownProperties:function(){return p}});let n=r(82312),o=r(3295),i=/^[A-Za-z_$][A-Za-z0-9_$]*$/;function s(e,t){return i.test(t)?`\`${e}.${t}\``:`\`${e}[${JSON.stringify(t)}]\``}function a(e,t){let r=JSON.stringify(t);return`\`Reflect.has(${e}, ${r})\`, \`${r} in ${e}\`, or similar`}function u(e,t){throw new n.StaticGenBailoutError(`Route ${e} couldn't be rendered statically because it used ${t}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`)}function c(e,t){throw new n.StaticGenBailoutError(`Route ${e} with \`dynamic = "error"\` couldn't be rendered statically because it used ${t}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`)}function d(){let e=o.afterTaskAsyncStorage.getStore();return(null==e?void 0:e.rootTaskSpawnPhase)==="action"}let p=new Set(["hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toString","valueOf","toLocaleString","then","catch","finally","status","displayName","toJSON","$$typeof","__esModule"])},20614:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"ReflectAdapter",{enumerable:!0,get:function(){return r}});class r{static get(e,t,r){let n=Reflect.get(e,t,r);return"function"==typeof n?n.bind(e):n}static set(e,t,r,n){return Reflect.set(e,t,r,n)}static has(e,t){return Reflect.has(e,t)}static deleteProperty(e,t){return Reflect.deleteProperty(e,t)}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[994,452],()=>r(30589));module.exports=n})();