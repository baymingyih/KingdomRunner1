(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[803],{7858:(e,r,t)=>{Promise.resolve().then(t.bind(t,7393))},7393:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>c});var n=t(5155),s=t(2115),a=t(5007),o=t(4085),i=t(2336),l=t(371);let d=[{id:1,author:"John D.",content:"Praying for strength and endurance in my upcoming marathon."},{id:2,author:"Sarah M.",content:"Asking for healing for my injured knee."},{id:3,author:"Michael R.",content:"Grateful for the supportive community of runners. Bless them all!"}];function c(){let[e,r]=(0,s.useState)(d),[t,c]=(0,s.useState)({author:"",content:""});return(0,n.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,n.jsx)("h1",{className:"text-4xl font-bold text-center mb-8",children:"Prayer Wall"}),(0,n.jsxs)(a.Zp,{className:"mb-8",children:[(0,n.jsx)(a.aR,{children:(0,n.jsx)(a.ZB,{children:"Share Your Prayer"})}),(0,n.jsx)(a.Wu,{children:(0,n.jsxs)("form",{onSubmit:n=>{n.preventDefault(),t.author&&t.content&&(r([...e,{id:e.length+1,...t}]),c({author:"",content:""}))},className:"space-y-4",children:[(0,n.jsx)(i.p,{placeholder:"Your Name",value:t.author,onChange:e=>c({...t,author:e.target.value})}),(0,n.jsx)(l.T,{placeholder:"Your Prayer",value:t.content,onChange:e=>c({...t,content:e.target.value})}),(0,n.jsx)(o.$,{type:"submit",children:"Submit Prayer"})]})})]}),(0,n.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:e.map(e=>(0,n.jsxs)(a.Zp,{children:[(0,n.jsx)(a.aR,{children:(0,n.jsx)(a.ZB,{children:e.author})}),(0,n.jsx)(a.Wu,{children:(0,n.jsx)("p",{children:e.content})})]},e.id))})]})}},4085:(e,r,t)=>{"use strict";t.d(r,{$:()=>s});var n=t(5155);t(2115);let s=e=>{let{children:r,...t}=e;return(0,n.jsx)("button",{className:"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",...t,children:r})}},5007:(e,r,t)=>{"use strict";t.d(r,{BT:()=>i,Wu:()=>l,ZB:()=>o,Zp:()=>s,aR:()=>a});var n=t(5155);t(2115);let s=e=>{let{children:r,className:t,...s}=e;return(0,n.jsx)("div",{className:"rounded-md border shadow-sm ".concat(t),...s,children:r})},a=e=>{let{children:r,className:t,...s}=e;return(0,n.jsx)("div",{className:"px-4 py-3 border-b font-semibold ".concat(t),...s,children:r})},o=e=>{let{className:r,...t}=e;return(0,n.jsx)("h3",{className:"text-lg font-semibold ".concat(r),...t})},i=e=>{let{className:r,...t}=e;return(0,n.jsx)("p",{className:"text-sm text-muted-foreground ".concat(r),...t})},l=e=>{let{children:r,className:t,...s}=e;return(0,n.jsx)("div",{className:"p-4 ".concat(t),...s,children:r})}},2336:(e,r,t)=>{"use strict";t.d(r,{p:()=>s});var n=t(5155);let s=t(2115).forwardRef((e,r)=>{let{className:t,type:s,...a}=e;return(0,n.jsx)("input",{type:s,className:"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",ref:r,...a})});s.displayName="Input"},371:(e,r,t)=>{"use strict";t.d(r,{T:()=>s});var n=t(5155);let s=t(2115).forwardRef((e,r)=>{let{className:t,...s}=e;return(0,n.jsx)("textarea",{className:"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",ref:r,...s})});s.displayName="Textarea"}},e=>{var r=r=>e(e.s=r);e.O(0,[441,517,358],()=>r(7858)),_N_E=e.O()}]);