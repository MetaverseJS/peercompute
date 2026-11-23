import{c as C,H as b,r as x,a as A,C as D,M as H}from"./carnageWindow-Ta-Zfo9P.js";const l=Uint32Array.from([1732584193,
4023233417,2562383102,271733878,3285377520]),r=new Uint32Array(80);class u extends b{A=l[0]|0;B=l[1]|0;C=l[2]|0;D=l[3]|0;E=l[4]|
0;constructor(){super(64,20,8,!1)}get(){const{A:h,B:c,C:i,D:t,E:e}=this;return[h,c,i,t,e]}set(h,c,i,t,e){this.A=h|0,this.
B=c|0,this.C=i|0,this.D=t|0,this.E=e|0}process(h,c){for(let s=0;s<16;s++,c+=4)r[s]=h.getUint32(c,!1);for(let s=16;s<80;s++)
r[s]=x(r[s-3]^r[s-8]^r[s-14]^r[s-16],1);let{A:i,B:t,C:e,D:a,E:o}=this;for(let s=0;s<80;s++){let n,f;s<20?(n=D(t,e,a),f=1518500249):
s<40?(n=t^e^a,f=1859775393):s<60?(n=H(t,e,a),f=2400959708):(n=t^e^a,f=3395469782);const d=x(i,5)+n+o+f+r[s]|0;o=a,a=e,e=
x(t,30),t=i,i=d}i=i+this.A|0,t=t+this.B|0,e=e+this.C|0,a=a+this.D|0,o=o+this.E|0,this.set(i,t,e,a,o)}roundClean(){A(r)}destroy(){
this.set(0,0,0,0,0),A(this.buffer)}}const p=C(()=>new u);export{p as s};
