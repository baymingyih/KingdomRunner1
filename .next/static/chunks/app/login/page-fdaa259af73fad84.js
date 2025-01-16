(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[520],{4687:(e,t,r)=>{Promise.resolve().then(r.bind(r,6189))},6189:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>j});var s=r(5155),a=r(2115),n=r(9606),i=r(2679),o=r(3415),d=r(4085),l=r(1563),c=r(2336),u=r(5007),m=r(1027),p=r(9602);let f=(0,m.F)("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),v=a.forwardRef((e,t)=>{let{className:r,variant:a,...n}=e;return(0,s.jsx)("div",{ref:t,role:"alert",className:(0,p.cn)(f({variant:a}),r),...n})});v.displayName="Alert",a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("h5",{ref:t,className:(0,p.cn)("mb-1 font-medium leading-none tracking-tight",r),...a})}).displayName="AlertTitle";let g=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)("div",{ref:t,className:(0,p.cn)("text-sm [&_p]:leading-relaxed",r),...a})});g.displayName="AlertDescription";var x=r(9134),h=r(2382),b=r(6046),I=r(8173),E=r.n(I),y=r(4505);let N=o.Ik({email:o.Yj().email("Invalid email address"),password:o.Yj().min(6,"Password must be at least 6 characters")});function j(){let[e,t]=(0,a.useState)(!1),[r,o]=(0,a.useState)(null),{toast:m}=(0,x.dj)(),p=(0,b.useRouter)(),f=(0,n.mN)({resolver:(0,i.u)(N),defaultValues:{email:"",password:""}}),I=async e=>{t(!0),o(null);try{await (0,h.Lx)(e.email,e.password),m({title:"Login Successful",description:"Welcome back to Kingdom Runners!"}),p.push("/dashboard")}catch(t){let e=t instanceof Error?t.message:"Invalid credentials";o(e),m({title:"Login Failed",description:e,variant:"destructive"})}finally{t(!1)}};return(0,s.jsx)("div",{className:"container mx-auto px-4 py-8",children:(0,s.jsxs)(u.Zp,{className:"max-w-md mx-auto",children:[(0,s.jsxs)(u.aR,{children:[(0,s.jsx)(u.ZB,{className:"text-2xl text-center",children:"Welcome Back"}),(0,s.jsx)(u.BT,{className:"text-center",children:"Sign in to your Kingdom Runners account"})]}),(0,s.jsxs)(u.Wu,{children:[r&&(0,s.jsx)(v,{variant:"destructive",className:"mb-6",children:(0,s.jsx)(g,{children:r})}),(0,s.jsxs)("form",{onSubmit:f.handleSubmit(I),className:"space-y-6",children:[(0,s.jsx)(l.z,{name:"email",label:"Email",render:t=>{let{field:r}=t;return(0,s.jsx)(c.p,{...r,type:"email",placeholder:"your@email.com",disabled:e})}}),(0,s.jsx)(l.z,{name:"password",label:"Password",render:t=>{let{field:r}=t;return(0,s.jsx)(c.p,{...r,type:"password",placeholder:"••••••••",disabled:e})}}),(0,s.jsx)(d.$,{type:"submit",className:"w-full",disabled:e,children:e?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y.A,{className:"mr-2 h-4 w-4 animate-spin"}),"Signing in..."]}):"Sign In"})]}),(0,s.jsxs)("div",{className:"mt-6 text-center space-y-2",children:[(0,s.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Don't have an account?"," ",(0,s.jsx)(E(),{href:"/register",className:"text-primary hover:underline",children:"Register here"})]}),(0,s.jsx)(E(),{href:"/forgot-password",className:"text-sm text-primary hover:underline",children:"Forgot your password?"})]})]})]})})}},4085:(e,t,r)=>{"use strict";r.d(t,{$:()=>a});var s=r(5155);r(2115);let a=e=>{let{children:t,...r}=e;return(0,s.jsx)("button",{className:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",...r,children:t})}},5007:(e,t,r)=>{"use strict";r.d(t,{BT:()=>o,Wu:()=>d,ZB:()=>i,Zp:()=>a,aR:()=>n});var s=r(5155);r(2115);let a=e=>{let{children:t,className:r,...a}=e;return(0,s.jsx)("div",{className:"rounded-md border shadow-sm ".concat(r),...a,children:t})},n=e=>{let{children:t,className:r,...a}=e;return(0,s.jsx)("div",{className:"px-4 py-3 border-b font-semibold ".concat(r),...a,children:t})},i=e=>{let{className:t,...r}=e;return(0,s.jsx)("h3",{className:"text-lg font-semibold ".concat(t),...r})},o=e=>{let{className:t,...r}=e;return(0,s.jsx)("p",{className:"text-sm text-muted-foreground ".concat(t),...r})},d=e=>{let{children:t,className:r,...a}=e;return(0,s.jsx)("div",{className:"p-4 ".concat(r),...a,children:t})}},1100:(e,t,r)=>{"use strict";r.d(t,{M:()=>a});var s=r(5155);r(2115);let a=e=>{let{children:t,className:r}=e;return(0,s.jsx)("div",{className:r,children:t})}},1563:(e,t,r)=>{"use strict";r.d(t,{z:()=>d});var s=r(5155);r(2115);var a=r(5785),n=r(1100),i=r(2318),o=r(9606);let d=e=>{let{name:t,label:r,render:d}=e,{control:l}=(0,o.xW)();return(0,s.jsx)(o.xI,{name:t,control:l,render:e=>{var t;let{field:o,fieldState:l}=e;return(0,s.jsxs)("div",{children:[r&&(0,s.jsx)(a.J,{children:r}),(0,s.jsx)(n.M,{children:d({field:o})}),(0,s.jsx)(i.C,{children:null===(t=l.error)||void 0===t?void 0:t.message})]})}})}},2318:(e,t,r)=>{"use strict";r.d(t,{C:()=>n});var s=r(5155);r(2115);var a=r(9606);let n=e=>{var t;let{name:r,children:n,className:i}=e,{formState:{errors:o}}=(0,a.xW)(),d=r&&(null===(t=o[r])||void 0===t?void 0:t.message),l=d?String(d):n;return(0,s.jsx)("p",{className:i,children:l})}},2336:(e,t,r)=>{"use strict";r.d(t,{p:()=>a});var s=r(5155);let a=r(2115).forwardRef((e,t)=>{let{className:r,type:a,...n}=e;return(0,s.jsx)("input",{type:a,className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",ref:t,...n})});a.displayName="Input"},5785:(e,t,r)=>{"use strict";r.d(t,{J:()=>l});var s=r(5155),a=r(2115),n=r(6195),i=r(1027),o=r(9602);let d=(0,i.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=a.forwardRef((e,t)=>{let{className:r,...a}=e;return(0,s.jsx)(n.b,{ref:t,className:(0,o.cn)(d(),r),...a})});l.displayName=n.b.displayName},9134:(e,t,r)=>{"use strict";r.d(t,{dj:()=>m});var s=r(2115);let a=0,n=new Map,i=e=>{if(n.has(e))return;let t=setTimeout(()=>{n.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);n.set(e,t)},o=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:r}=t;return r?i(r):e.toasts.forEach(e=>{i(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},d=[],l={toasts:[]};function c(e){l=o(l,e),d.forEach(e=>{e(l)})}function u(e){let{...t}=e,r=(a=(a+1)%Number.MAX_VALUE).toString(),s=()=>c({type:"DISMISS_TOAST",toastId:r});return c({type:"ADD_TOAST",toast:{...t,id:r,open:!0,onOpenChange:e=>{e||s()}}}),{id:r,dismiss:s,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:r}})}}function m(){let[e,t]=s.useState(l);return s.useEffect(()=>(d.push(t),()=>{let e=d.indexOf(t);e>-1&&d.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},2382:(e,t,r)=>{"use strict";r.d(t,{WI:()=>i,Lx:()=>o,CI:()=>d});var s=r(4565),a=r(9891);r(9911);let n=(0,s.xI)(a.y);async function i(e,t){try{return(await (0,s.eJ)(n,e,t)).user}catch(e){throw console.error("Error creating auth user:",e),Error(e.message||"Failed to create user")}}async function o(e,t){try{return(await (0,s.x9)(n,e,t)).user}catch(e){throw console.error("Error logging in:",e),Error(e.message||"Invalid email or password")}}async function d(){try{await (0,s.CI)(n)}catch(e){throw console.error("Error signing out:",e),Error(e.message||"Failed to sign out")}}},9911:(e,t,r)=>{"use strict";r.d(t,{C:()=>n});var s=r(2818);let a={apiKey:"AIzaSyCopx5Hk7QK3JkyrVU9IWYJuERPn7vH43E",authDomain:"kingdomrunnersdv1.firebaseapp.com",projectId:"kingdomrunnersdv1",storageBucket:"kingdomrunnersdv1.firebasestorage.app",messagingSenderId:"626559745548",appId:"1:626559745548:web:3e2f5d7498f7e3beb1f829",measurementId:"G-0G8N8DZWHW"},n={apiKey:s.env.NEXT_PUBLIC_FIREBASE_API_KEY||a.apiKey,authDomain:s.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||a.authDomain,projectId:s.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID||a.projectId,storageBucket:s.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET||a.storageBucket,messagingSenderId:s.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID||a.messagingSenderId,appId:s.env.NEXT_PUBLIC_FIREBASE_APP_ID||a.appId,measurementId:s.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID||a.measurementId}},9891:(e,t,r)=>{"use strict";r.d(t,{db:()=>c,j:()=>l,storage:()=>u,y:()=>d});var s=r(9904),a=r(7058),n=r(4565),i=r(333),o=r(9911);let d=0===(0,s.Dk)().length?(0,s.Wp)(o.C):(0,s.Dk)()[0],l=(0,n.xI)(d),c=(0,a.aU)(d),u=(0,i.c7)(d);(0,n.oM)(l,n.F0).catch(e=>{console.error("Error setting auth persistence:",e)}),(0,a.ol)(c).catch(e=>{"failed-precondition"===e.code?console.warn("Multiple tabs open, persistence enabled in first tab only"):"unimplemented"===e.code&&console.warn("Browser does not support persistence")})},9602:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n});var s=r(3463),a=r(9795);function n(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return(0,a.QP)((0,s.$)(t))}},4505:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});let s=(0,r(7401).A)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},6046:(e,t,r)=>{"use strict";var s=r(6658);r.o(s,"usePathname")&&r.d(t,{usePathname:function(){return s.usePathname}}),r.o(s,"useRouter")&&r.d(t,{useRouter:function(){return s.useRouter}})}},e=>{var t=t=>e(e.s=t);e.O(0,[992,794,575,525,173,942,441,517,358],()=>t(4687)),_N_E=e.O()}]);