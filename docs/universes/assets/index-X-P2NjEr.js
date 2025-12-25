var hm=Object.defineProperty;var dm=(n,e,t)=>e in n?hm(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Ee=(n,e,t)=>dm(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))A(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&A(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function A(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const uu="167",mi={ROTATE:0,DOLLY:1,PAN:2},Bi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},pm=0,Yu=1,gm=2,Vd=1,mm=2,tn=3,Hn=0,rA=1,BA=2,on=0,qi=1,cn=2,Ju=3,Zu=4,Bm=5,jn=100,wm=101,vm=102,Cm=103,_m=104,xm=200,Em=201,ym=202,Um=203,Vl=204,kl=205,Sm=206,Mm=207,bm=208,Fm=209,Tm=210,Im=211,Qm=212,Lm=213,Rm=214,Dm=0,Pm=1,Hm=2,Qa=3,Nm=4,Om=5,Gm=6,Vm=7,kd=0,km=1,Km=2,Ln=0,zm=1,Wm=2,Xm=3,Ym=4,Jm=5,Zm=6,qm=7,Kd=300,sr=301,ar=302,Kl=303,zl=304,lo=306,Wl=1e3,ti=1001,Xl=1002,MA=1003,jm=1004,hs=1005,wA=1006,Io=1007,Ai=1008,un=1009,zd=1010,Wd=1011,qr=1012,fu=1013,ui=1014,sn=1015,hr=1016,hu=1017,du=1018,or=1020,Xd=35902,Yd=1021,Jd=1022,HA=1023,Zd=1024,qd=1025,ji=1026,lr=1027,jd=1028,pu=1029,$d=1030,gu=1031,mu=1033,wa=33776,va=33777,Ca=33778,_a=33779,Yl=35840,Jl=35841,Zl=35842,ql=35843,jl=36196,$l=37492,ec=37496,tc=37808,Ac=37809,nc=37810,ic=37811,rc=37812,sc=37813,ac=37814,oc=37815,lc=37816,cc=37817,uc=37818,fc=37819,hc=37820,dc=37821,xa=36492,pc=36494,gc=36495,ep=36283,mc=36284,Bc=36285,wc=36286,$m=3200,e0=3201,tp=0,t0=1,Un="",PA="srgb",Vn="srgb-linear",Bu="display-p3",co="display-p3-linear",La="linear",ct="srgb",Ra="rec709",Da="p3",wi=7680,qu=519,A0=512,n0=513,i0=514,Ap=515,r0=516,s0=517,a0=518,o0=519,ju=35044,$u="300 es",an=2e3,Pa=2001;class di{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const A=this._listeners;A[e]===void 0&&(A[e]=[]),A[e].indexOf(t)===-1&&A[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const A=this._listeners;return A[e]!==void 0&&A[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const A=this._listeners[e.type];if(A!==void 0){e.target=this;const i=A.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ea=Math.PI/180,vc=180/Math.PI;function ns(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,A=Math.random()*4294967295|0;return(Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[A&255]+Xt[A>>8&255]+Xt[A>>16&255]+Xt[A>>24&255]).toLowerCase()}function iA(n,e,t){return Math.max(e,Math.min(t,n))}function l0(n,e){return(n%e+e)%e}function Qo(n,e,t){return(1-t)*n+t*e}function mr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function aA(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const c0={DEG2RAD:Ea};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,A=this.y,i=e.elements;return this.x=i[0]*t+i[3]*A+i[6],this.y=i[1]*t+i[4]*A+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(iA(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y;return t*t+A*A}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const A=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*A-s*i+e.x,this.y=r*i+s*A+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,A,i,r,s,a,o,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,c)}set(e,t,A,i,r,s,a,o,c){const l=this.elements;return l[0]=e,l[1]=i,l[2]=a,l[3]=t,l[4]=r,l[5]=o,l[6]=A,l[7]=s,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],this}extractBasis(e,t,A){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),A.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[3],o=A[6],c=A[1],l=A[4],u=A[7],f=A[2],p=A[5],g=A[8],m=i[0],d=i[3],h=i[6],_=i[1],w=i[4],U=i[7],T=i[2],y=i[5],S=i[8];return r[0]=s*m+a*_+o*T,r[3]=s*d+a*w+o*y,r[6]=s*h+a*U+o*S,r[1]=c*m+l*_+u*T,r[4]=c*d+l*w+u*y,r[7]=c*h+l*U+u*S,r[2]=f*m+p*_+g*T,r[5]=f*d+p*w+g*y,r[8]=f*h+p*U+g*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],c=e[7],l=e[8];return t*s*l-t*a*c-A*r*l+A*a*o+i*r*c-i*s*o}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],c=e[7],l=e[8],u=l*s-a*c,f=a*o-l*r,p=c*r-s*o,g=t*u+A*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/g;return e[0]=u*m,e[1]=(i*c-l*A)*m,e[2]=(a*A-i*s)*m,e[3]=f*m,e[4]=(l*t-i*o)*m,e[5]=(i*r-a*t)*m,e[6]=p*m,e[7]=(A*o-c*t)*m,e[8]=(s*t-A*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,A,i,r,s,a){const o=Math.cos(r),c=Math.sin(r);return this.set(A*o,A*c,-A*(o*s+c*a)+s+e,-i*c,i*o,-i*(-c*s+o*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Lo.makeScale(e,t)),this}rotate(e){return this.premultiply(Lo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Lo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,A,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<9;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<9;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Lo=new Ke;function np(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ha(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function u0(){const n=Ha("canvas");return n.style.display="block",n}const ef={};function kr(n){n in ef||(ef[n]=!0,console.warn(n))}function f0(n,e,t){return new Promise(function(A,i){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:i();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:A()}}setTimeout(r,t)})}const tf=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Af=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Br={[Vn]:{transfer:La,primaries:Ra,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[PA]:{transfer:ct,primaries:Ra,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[co]:{transfer:La,primaries:Da,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Af),fromReference:n=>n.applyMatrix3(tf)},[Bu]:{transfer:ct,primaries:Da,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Af),fromReference:n=>n.applyMatrix3(tf).convertLinearToSRGB()}},h0=new Set([Vn,co]),At={enabled:!0,_workingColorSpace:Vn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!h0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const A=Br[e].toReference,i=Br[t].fromReference;return i(A(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Br[n].primaries},getTransfer:function(n){return n===Un?La:Br[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Br[e].luminanceCoefficients)}};function $i(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ro(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let vi;class d0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{vi===void 0&&(vi=Ha("canvas")),vi.width=e.width,vi.height=e.height;const A=vi.getContext("2d");e instanceof ImageData?A.putImageData(e,0,0):A.drawImage(e,0,0,e.width,e.height),t=vi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ha("canvas");t.width=e.width,t.height=e.height;const A=t.getContext("2d");A.drawImage(e,0,0,e.width,e.height);const i=A.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=$i(r[s]/255)*255;return A.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let A=0;A<t.length;A++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[A]=Math.floor($i(t[A]/255)*255):t[A]=$i(t[A]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let p0=0;class ip{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=ns(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const A={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(Do(i[s].image)):r.push(Do(i[s]))}else r=Do(i);A.url=r}return t||(e.images[this.uuid]=A),A}}function Do(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?d0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let g0=0;class sA extends di{constructor(e=sA.DEFAULT_IMAGE,t=sA.DEFAULT_MAPPING,A=ti,i=ti,r=wA,s=Ai,a=HA,o=un,c=sA.DEFAULT_ANISOTROPY,l=Un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=ns(),this.name="",this.source=new ip(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=A,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=o,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const A={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(A.userData=this.userData),t||(e.textures[this.uuid]=A),A}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wl:e.x=e.x-Math.floor(e.x);break;case ti:e.x=e.x<0?0:1;break;case Xl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wl:e.y=e.y-Math.floor(e.y);break;case ti:e.y=e.y<0?0:1;break;case Xl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}sA.DEFAULT_IMAGE=null;sA.DEFAULT_MAPPING=Kd;sA.DEFAULT_ANISOTROPY=1;class ft{constructor(e=0,t=0,A=0,i=1){ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=A,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,A,i){return this.x=e,this.y=t,this.z=A,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*A+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*A+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*A+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*A+s[11]*i+s[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,A,i,r;const o=e.elements,c=o[0],l=o[4],u=o[8],f=o[1],p=o[5],g=o[9],m=o[2],d=o[6],h=o[10];if(Math.abs(l-f)<.01&&Math.abs(u-m)<.01&&Math.abs(g-d)<.01){if(Math.abs(l+f)<.1&&Math.abs(u+m)<.1&&Math.abs(g+d)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,U=(p+1)/2,T=(h+1)/2,y=(l+f)/4,S=(u+m)/4,L=(g+d)/4;return w>U&&w>T?w<.01?(A=0,i=.707106781,r=.707106781):(A=Math.sqrt(w),i=y/A,r=S/A):U>T?U<.01?(A=.707106781,i=0,r=.707106781):(i=Math.sqrt(U),A=y/i,r=L/i):T<.01?(A=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),A=S/r,i=L/r),this.set(A,i,r,t),this}let _=Math.sqrt((d-g)*(d-g)+(u-m)*(u-m)+(f-l)*(f-l));return Math.abs(_)<.001&&(_=1),this.x=(d-g)/_,this.y=(u-m)/_,this.z=(f-l)/_,this.w=Math.acos((c+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this.w=e.w+(t.w-e.w)*A,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class m0 extends di{constructor(e=1,t=1,A={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);const i={width:e,height:t,depth:1};A=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wA,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},A);const r=new sA(i,A.mapping,A.wrapS,A.wrapT,A.magFilter,A.minFilter,A.format,A.type,A.anisotropy,A.colorSpace);r.flipY=!1,r.generateMipmaps=A.generateMipmaps,r.internalFormat=A.internalFormat,this.textures=[];const s=A.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=A.depthBuffer,this.stencilBuffer=A.stencilBuffer,this.resolveDepthBuffer=A.resolveDepthBuffer,this.resolveStencilBuffer=A.resolveStencilBuffer,this.depthTexture=A.depthTexture,this.samples=A.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,A=1){if(this.width!==e||this.height!==t||this.depth!==A){this.width=e,this.height=t,this.depth=A;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=A;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let A=0,i=e.textures.length;A<i;A++)this.textures[A]=e.textures[A].clone(),this.textures[A].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new ip(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nn extends m0{constructor(e=1,t=1,A={}){super(e,t,A),this.isWebGLRenderTarget=!0}}class rp extends sA{constructor(e=null,t=1,A=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=MA,this.minFilter=MA,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class B0 extends sA{constructor(e=null,t=1,A=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=MA,this.minFilter=MA,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fi{constructor(e=0,t=0,A=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=A,this._w=i}static slerpFlat(e,t,A,i,r,s,a){let o=A[i+0],c=A[i+1],l=A[i+2],u=A[i+3];const f=r[s+0],p=r[s+1],g=r[s+2],m=r[s+3];if(a===0){e[t+0]=o,e[t+1]=c,e[t+2]=l,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=m;return}if(u!==m||o!==f||c!==p||l!==g){let d=1-a;const h=o*f+c*p+l*g+u*m,_=h>=0?1:-1,w=1-h*h;if(w>Number.EPSILON){const T=Math.sqrt(w),y=Math.atan2(T,h*_);d=Math.sin(d*y)/T,a=Math.sin(a*y)/T}const U=a*_;if(o=o*d+f*U,c=c*d+p*U,l=l*d+g*U,u=u*d+m*U,d===1-a){const T=1/Math.sqrt(o*o+c*c+l*l+u*u);o*=T,c*=T,l*=T,u*=T}}e[t]=o,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,A,i,r,s){const a=A[i],o=A[i+1],c=A[i+2],l=A[i+3],u=r[s],f=r[s+1],p=r[s+2],g=r[s+3];return e[t]=a*g+l*u+o*p-c*f,e[t+1]=o*g+l*f+c*u-a*p,e[t+2]=c*g+l*p+a*f-o*u,e[t+3]=l*g-a*u-o*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,A,i){return this._x=e,this._y=t,this._z=A,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const A=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,o=Math.sin,c=a(A/2),l=a(i/2),u=a(r/2),f=o(A/2),p=o(i/2),g=o(r/2);switch(s){case"XYZ":this._x=f*l*u+c*p*g,this._y=c*p*u-f*l*g,this._z=c*l*g+f*p*u,this._w=c*l*u-f*p*g;break;case"YXZ":this._x=f*l*u+c*p*g,this._y=c*p*u-f*l*g,this._z=c*l*g-f*p*u,this._w=c*l*u+f*p*g;break;case"ZXY":this._x=f*l*u-c*p*g,this._y=c*p*u+f*l*g,this._z=c*l*g+f*p*u,this._w=c*l*u-f*p*g;break;case"ZYX":this._x=f*l*u-c*p*g,this._y=c*p*u+f*l*g,this._z=c*l*g-f*p*u,this._w=c*l*u+f*p*g;break;case"YZX":this._x=f*l*u+c*p*g,this._y=c*p*u+f*l*g,this._z=c*l*g-f*p*u,this._w=c*l*u-f*p*g;break;case"XZY":this._x=f*l*u-c*p*g,this._y=c*p*u-f*l*g,this._z=c*l*g+f*p*u,this._w=c*l*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const A=t/2,i=Math.sin(A);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(A),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,A=t[0],i=t[4],r=t[8],s=t[1],a=t[5],o=t[9],c=t[2],l=t[6],u=t[10],f=A+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(l-o)*p,this._y=(r-c)*p,this._z=(s-i)*p}else if(A>a&&A>u){const p=2*Math.sqrt(1+A-a-u);this._w=(l-o)/p,this._x=.25*p,this._y=(i+s)/p,this._z=(r+c)/p}else if(a>u){const p=2*Math.sqrt(1+a-A-u);this._w=(r-c)/p,this._x=(i+s)/p,this._y=.25*p,this._z=(o+l)/p}else{const p=2*Math.sqrt(1+u-A-a);this._w=(s-i)/p,this._x=(r+c)/p,this._y=(o+l)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let A=e.dot(t)+1;return A<Number.EPSILON?(A=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=A):(this._x=0,this._y=-e.z,this._z=e.y,this._w=A)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=A),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(iA(this.dot(e),-1,1)))}rotateTowards(e,t){const A=this.angleTo(e);if(A===0)return this;const i=Math.min(1,t/A);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const A=e._x,i=e._y,r=e._z,s=e._w,a=t._x,o=t._y,c=t._z,l=t._w;return this._x=A*l+s*a+i*c-r*o,this._y=i*l+s*o+r*a-A*c,this._z=r*l+s*c+A*o-i*a,this._w=s*l-A*a-i*o-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const A=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+A*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=A,this._y=i,this._z=r,this;const o=1-a*a;if(o<=Number.EPSILON){const p=1-t;return this._w=p*s+t*this._w,this._x=p*A+t*this._x,this._y=p*i+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(o),l=Math.atan2(c,a),u=Math.sin((1-t)*l)/c,f=Math.sin(t*l)/c;return this._w=s*u+this._w*f,this._x=A*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,A){return this.copy(e).slerp(t,A)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),A=Math.random(),i=Math.sqrt(1-A),r=Math.sqrt(A);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Q{constructor(e=0,t=0,A=0){Q.prototype.isVector3=!0,this.x=e,this.y=t,this.z=A}set(e,t,A){return A===void 0&&(A=this.z),this.x=e,this.y=t,this.z=A,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nf.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*A+r[6]*i,this.y=r[1]*t+r[4]*A+r[7]*i,this.z=r[2]*t+r[5]*A+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*A+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*A+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*A+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*A+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,A=this.y,i=this.z,r=e.x,s=e.y,a=e.z,o=e.w,c=2*(s*i-a*A),l=2*(a*t-r*i),u=2*(r*A-s*t);return this.x=t+o*c+s*u-a*l,this.y=A+o*l+a*c-r*u,this.z=i+o*u+r*l-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*A+r[8]*i,this.y=r[1]*t+r[5]*A+r[9]*i,this.z=r[2]*t+r[6]*A+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const A=e.x,i=e.y,r=e.z,s=t.x,a=t.y,o=t.z;return this.x=i*o-r*a,this.y=r*s-A*o,this.z=A*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const A=e.dot(this)/t;return this.copy(e).multiplyScalar(A)}projectOnPlane(e){return Po.copy(this).projectOnVector(e),this.sub(Po)}reflect(e){return this.sub(Po.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(iA(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y,i=this.z-e.z;return t*t+A*A+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,A){const i=Math.sin(t)*e;return this.x=i*Math.sin(A),this.y=Math.cos(t)*e,this.z=i*Math.cos(A),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,A){return this.x=e*Math.sin(t),this.y=A,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),A=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=A,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,A=Math.sqrt(1-t*t);return this.x=A*Math.cos(e),this.y=t,this.z=A*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Po=new Q,nf=new fi;class is{constructor(e=new Q(1/0,1/0,1/0),t=new Q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t+=3)this.expandByPoint(IA.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,A=e.count;t<A;t++)this.expandByPoint(IA.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const A=IA.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(A),this.max.copy(e).add(A),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const A=e.geometry;if(A!==void 0){const r=A.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,IA):IA.fromBufferAttribute(r,s),IA.applyMatrix4(e.matrixWorld),this.expandByPoint(IA);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ds.copy(e.boundingBox)):(A.boundingBox===null&&A.computeBoundingBox(),ds.copy(A.boundingBox)),ds.applyMatrix4(e.matrixWorld),this.union(ds)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,IA),IA.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,A;return e.normal.x>0?(t=e.normal.x*this.min.x,A=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,A=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,A+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,A+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,A+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,A+=e.normal.z*this.min.z),t<=-e.constant&&A>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wr),ps.subVectors(this.max,wr),Ci.subVectors(e.a,wr),_i.subVectors(e.b,wr),xi.subVectors(e.c,wr),pn.subVectors(_i,Ci),gn.subVectors(xi,_i),Kn.subVectors(Ci,xi);let t=[0,-pn.z,pn.y,0,-gn.z,gn.y,0,-Kn.z,Kn.y,pn.z,0,-pn.x,gn.z,0,-gn.x,Kn.z,0,-Kn.x,-pn.y,pn.x,0,-gn.y,gn.x,0,-Kn.y,Kn.x,0];return!Ho(t,Ci,_i,xi,ps)||(t=[1,0,0,0,1,0,0,0,1],!Ho(t,Ci,_i,xi,ps))?!1:(gs.crossVectors(pn,gn),t=[gs.x,gs.y,gs.z],Ho(t,Ci,_i,xi,ps))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,IA).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(IA).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(YA[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),YA[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),YA[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),YA[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),YA[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),YA[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),YA[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),YA[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(YA),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const YA=[new Q,new Q,new Q,new Q,new Q,new Q,new Q,new Q],IA=new Q,ds=new is,Ci=new Q,_i=new Q,xi=new Q,pn=new Q,gn=new Q,Kn=new Q,wr=new Q,ps=new Q,gs=new Q,zn=new Q;function Ho(n,e,t,A,i){for(let r=0,s=n.length-3;r<=s;r+=3){zn.fromArray(n,r);const a=i.x*Math.abs(zn.x)+i.y*Math.abs(zn.y)+i.z*Math.abs(zn.z),o=e.dot(zn),c=t.dot(zn),l=A.dot(zn);if(Math.max(-Math.max(o,c,l),Math.min(o,c,l))>a)return!1}return!0}const w0=new is,vr=new Q,No=new Q;class rs{constructor(e=new Q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const A=this.center;t!==void 0?A.copy(t):w0.setFromPoints(e).getCenter(A);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,A.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const A=this.center.distanceToSquared(e);return t.copy(e),A>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;vr.subVectors(e,this.center);const t=vr.lengthSq();if(t>this.radius*this.radius){const A=Math.sqrt(t),i=(A-this.radius)*.5;this.center.addScaledVector(vr,i/A),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(No.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(vr.copy(e.center).add(No)),this.expandByPoint(vr.copy(e.center).sub(No))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const JA=new Q,Oo=new Q,ms=new Q,mn=new Q,Go=new Q,Bs=new Q,Vo=new Q;class ss{constructor(e=new Q,t=new Q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,JA)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const A=t.dot(this.direction);return A<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,A)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=JA.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(JA.copy(this.origin).addScaledVector(this.direction,t),JA.distanceToSquared(e))}distanceSqToSegment(e,t,A,i){Oo.copy(e).add(t).multiplyScalar(.5),ms.copy(t).sub(e).normalize(),mn.copy(this.origin).sub(Oo);const r=e.distanceTo(t)*.5,s=-this.direction.dot(ms),a=mn.dot(this.direction),o=-mn.dot(ms),c=mn.lengthSq(),l=Math.abs(1-s*s);let u,f,p,g;if(l>0)if(u=s*o-a,f=s*a-o,g=r*l,u>=0)if(f>=-g)if(f<=g){const m=1/l;u*=m,f*=m,p=u*(u+s*f+2*a)+f*(s*u+f+2*o)+c}else f=r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+c;else f=-r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+c;else f<=-g?(u=Math.max(0,-(-s*r+a)),f=u>0?-r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-o),r),p=f*(f+2*o)+c):(u=Math.max(0,-(s*r+a)),f=u>0?r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+c);else f=s>0?-r:r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+c;return A&&A.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Oo).addScaledVector(ms,f),p}intersectSphere(e,t){JA.subVectors(e.center,this.origin);const A=JA.dot(this.direction),i=JA.dot(JA)-A*A,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=A-s,o=A+s;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const A=-(this.origin.dot(e.normal)+e.constant)/t;return A>=0?A:null}intersectPlane(e,t){const A=this.distanceToPlane(e);return A===null?null:this.at(A,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let A,i,r,s,a,o;const c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(A=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(A=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),l>=0?(r=(e.min.y-f.y)*l,s=(e.max.y-f.y)*l):(r=(e.max.y-f.y)*l,s=(e.min.y-f.y)*l),A>s||r>i||((r>A||isNaN(A))&&(A=r),(s<i||isNaN(i))&&(i=s),u>=0?(a=(e.min.z-f.z)*u,o=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,o=(e.min.z-f.z)*u),A>o||a>i)||((a>A||A!==A)&&(A=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(A>=0?A:i,t)}intersectsBox(e){return this.intersectBox(e,JA)!==null}intersectTriangle(e,t,A,i,r){Go.subVectors(t,e),Bs.subVectors(A,e),Vo.crossVectors(Go,Bs);let s=this.direction.dot(Vo),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;mn.subVectors(this.origin,e);const o=a*this.direction.dot(Bs.crossVectors(mn,Bs));if(o<0)return null;const c=a*this.direction.dot(Go.cross(mn));if(c<0||o+c>s)return null;const l=-a*mn.dot(Vo);return l<0?null:this.at(l/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,A,i,r,s,a,o,c,l,u,f,p,g,m,d){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,c,l,u,f,p,g,m,d)}set(e,t,A,i,r,s,a,o,c,l,u,f,p,g,m,d){const h=this.elements;return h[0]=e,h[4]=t,h[8]=A,h[12]=i,h[1]=r,h[5]=s,h[9]=a,h[13]=o,h[2]=c,h[6]=l,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=m,h[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],t[9]=A[9],t[10]=A[10],t[11]=A[11],t[12]=A[12],t[13]=A[13],t[14]=A[14],t[15]=A[15],this}copyPosition(e){const t=this.elements,A=e.elements;return t[12]=A[12],t[13]=A[13],t[14]=A[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,A){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),A.setFromMatrixColumn(this,2),this}makeBasis(e,t,A){return this.set(e.x,t.x,A.x,0,e.y,t.y,A.y,0,e.z,t.z,A.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,A=e.elements,i=1/Ei.setFromMatrixColumn(e,0).length(),r=1/Ei.setFromMatrixColumn(e,1).length(),s=1/Ei.setFromMatrixColumn(e,2).length();return t[0]=A[0]*i,t[1]=A[1]*i,t[2]=A[2]*i,t[3]=0,t[4]=A[4]*r,t[5]=A[5]*r,t[6]=A[6]*r,t[7]=0,t[8]=A[8]*s,t[9]=A[9]*s,t[10]=A[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,A=e.x,i=e.y,r=e.z,s=Math.cos(A),a=Math.sin(A),o=Math.cos(i),c=Math.sin(i),l=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=s*l,p=s*u,g=a*l,m=a*u;t[0]=o*l,t[4]=-o*u,t[8]=c,t[1]=p+g*c,t[5]=f-m*c,t[9]=-a*o,t[2]=m-f*c,t[6]=g+p*c,t[10]=s*o}else if(e.order==="YXZ"){const f=o*l,p=o*u,g=c*l,m=c*u;t[0]=f+m*a,t[4]=g*a-p,t[8]=s*c,t[1]=s*u,t[5]=s*l,t[9]=-a,t[2]=p*a-g,t[6]=m+f*a,t[10]=s*o}else if(e.order==="ZXY"){const f=o*l,p=o*u,g=c*l,m=c*u;t[0]=f-m*a,t[4]=-s*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=s*l,t[9]=m-f*a,t[2]=-s*c,t[6]=a,t[10]=s*o}else if(e.order==="ZYX"){const f=s*l,p=s*u,g=a*l,m=a*u;t[0]=o*l,t[4]=g*c-p,t[8]=f*c+m,t[1]=o*u,t[5]=m*c+f,t[9]=p*c-g,t[2]=-c,t[6]=a*o,t[10]=s*o}else if(e.order==="YZX"){const f=s*o,p=s*c,g=a*o,m=a*c;t[0]=o*l,t[4]=m-f*u,t[8]=g*u+p,t[1]=u,t[5]=s*l,t[9]=-a*l,t[2]=-c*l,t[6]=p*u+g,t[10]=f-m*u}else if(e.order==="XZY"){const f=s*o,p=s*c,g=a*o,m=a*c;t[0]=o*l,t[4]=-u,t[8]=c*l,t[1]=f*u+m,t[5]=s*l,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*l,t[10]=m*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(v0,e,C0)}lookAt(e,t,A){const i=this.elements;return uA.subVectors(e,t),uA.lengthSq()===0&&(uA.z=1),uA.normalize(),Bn.crossVectors(A,uA),Bn.lengthSq()===0&&(Math.abs(A.z)===1?uA.x+=1e-4:uA.z+=1e-4,uA.normalize(),Bn.crossVectors(A,uA)),Bn.normalize(),ws.crossVectors(uA,Bn),i[0]=Bn.x,i[4]=ws.x,i[8]=uA.x,i[1]=Bn.y,i[5]=ws.y,i[9]=uA.y,i[2]=Bn.z,i[6]=ws.z,i[10]=uA.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[4],o=A[8],c=A[12],l=A[1],u=A[5],f=A[9],p=A[13],g=A[2],m=A[6],d=A[10],h=A[14],_=A[3],w=A[7],U=A[11],T=A[15],y=i[0],S=i[4],L=i[8],x=i[12],C=i[1],I=i[5],W=i[9],H=i[13],z=i[2],Z=i[6],K=i[10],q=i[14],Y=i[3],se=i[7],ae=i[11],pe=i[15];return r[0]=s*y+a*C+o*z+c*Y,r[4]=s*S+a*I+o*Z+c*se,r[8]=s*L+a*W+o*K+c*ae,r[12]=s*x+a*H+o*q+c*pe,r[1]=l*y+u*C+f*z+p*Y,r[5]=l*S+u*I+f*Z+p*se,r[9]=l*L+u*W+f*K+p*ae,r[13]=l*x+u*H+f*q+p*pe,r[2]=g*y+m*C+d*z+h*Y,r[6]=g*S+m*I+d*Z+h*se,r[10]=g*L+m*W+d*K+h*ae,r[14]=g*x+m*H+d*q+h*pe,r[3]=_*y+w*C+U*z+T*Y,r[7]=_*S+w*I+U*Z+T*se,r[11]=_*L+w*W+U*K+T*ae,r[15]=_*x+w*H+U*q+T*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[4],i=e[8],r=e[12],s=e[1],a=e[5],o=e[9],c=e[13],l=e[2],u=e[6],f=e[10],p=e[14],g=e[3],m=e[7],d=e[11],h=e[15];return g*(+r*o*u-i*c*u-r*a*f+A*c*f+i*a*p-A*o*p)+m*(+t*o*p-t*c*f+r*s*f-i*s*p+i*c*l-r*o*l)+d*(+t*c*u-t*a*p-r*s*u+A*s*p+r*a*l-A*c*l)+h*(-i*a*l-t*o*u+t*a*f+i*s*u-A*s*f+A*o*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,A){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=A),this}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],c=e[7],l=e[8],u=e[9],f=e[10],p=e[11],g=e[12],m=e[13],d=e[14],h=e[15],_=u*d*c-m*f*c+m*o*p-a*d*p-u*o*h+a*f*h,w=g*f*c-l*d*c-g*o*p+s*d*p+l*o*h-s*f*h,U=l*m*c-g*u*c+g*a*p-s*m*p-l*a*h+s*u*h,T=g*u*o-l*m*o-g*a*f+s*m*f+l*a*d-s*u*d,y=t*_+A*w+i*U+r*T;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/y;return e[0]=_*S,e[1]=(m*f*r-u*d*r-m*i*p+A*d*p+u*i*h-A*f*h)*S,e[2]=(a*d*r-m*o*r+m*i*c-A*d*c-a*i*h+A*o*h)*S,e[3]=(u*o*r-a*f*r-u*i*c+A*f*c+a*i*p-A*o*p)*S,e[4]=w*S,e[5]=(l*d*r-g*f*r+g*i*p-t*d*p-l*i*h+t*f*h)*S,e[6]=(g*o*r-s*d*r-g*i*c+t*d*c+s*i*h-t*o*h)*S,e[7]=(s*f*r-l*o*r+l*i*c-t*f*c-s*i*p+t*o*p)*S,e[8]=U*S,e[9]=(g*u*r-l*m*r-g*A*p+t*m*p+l*A*h-t*u*h)*S,e[10]=(s*m*r-g*a*r+g*A*c-t*m*c-s*A*h+t*a*h)*S,e[11]=(l*a*r-s*u*r-l*A*c+t*u*c+s*A*p-t*a*p)*S,e[12]=T*S,e[13]=(l*m*i-g*u*i+g*A*f-t*m*f-l*A*d+t*u*d)*S,e[14]=(g*a*i-s*m*i-g*A*o+t*m*o+s*A*d-t*a*d)*S,e[15]=(s*u*i-l*a*i+l*A*o-t*u*o-s*A*f+t*a*f)*S,this}scale(e){const t=this.elements,A=e.x,i=e.y,r=e.z;return t[0]*=A,t[4]*=i,t[8]*=r,t[1]*=A,t[5]*=i,t[9]*=r,t[2]*=A,t[6]*=i,t[10]*=r,t[3]*=A,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],A=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,A,i))}makeTranslation(e,t,A){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,A,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),A=Math.sin(e);return this.set(1,0,0,0,0,t,-A,0,0,A,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,0,A,0,0,1,0,0,-A,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,0,A,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const A=Math.cos(t),i=Math.sin(t),r=1-A,s=e.x,a=e.y,o=e.z,c=r*s,l=r*a;return this.set(c*s+A,c*a-i*o,c*o+i*a,0,c*a+i*o,l*a+A,l*o-i*s,0,c*o-i*a,l*o+i*s,r*o*o+A,0,0,0,0,1),this}makeScale(e,t,A){return this.set(e,0,0,0,0,t,0,0,0,0,A,0,0,0,0,1),this}makeShear(e,t,A,i,r,s){return this.set(1,A,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,A){const i=this.elements,r=t._x,s=t._y,a=t._z,o=t._w,c=r+r,l=s+s,u=a+a,f=r*c,p=r*l,g=r*u,m=s*l,d=s*u,h=a*u,_=o*c,w=o*l,U=o*u,T=A.x,y=A.y,S=A.z;return i[0]=(1-(m+h))*T,i[1]=(p+U)*T,i[2]=(g-w)*T,i[3]=0,i[4]=(p-U)*y,i[5]=(1-(f+h))*y,i[6]=(d+_)*y,i[7]=0,i[8]=(g+w)*S,i[9]=(d-_)*S,i[10]=(1-(f+m))*S,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,A){const i=this.elements;let r=Ei.set(i[0],i[1],i[2]).length();const s=Ei.set(i[4],i[5],i[6]).length(),a=Ei.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],QA.copy(this);const c=1/r,l=1/s,u=1/a;return QA.elements[0]*=c,QA.elements[1]*=c,QA.elements[2]*=c,QA.elements[4]*=l,QA.elements[5]*=l,QA.elements[6]*=l,QA.elements[8]*=u,QA.elements[9]*=u,QA.elements[10]*=u,t.setFromRotationMatrix(QA),A.x=r,A.y=s,A.z=a,this}makePerspective(e,t,A,i,r,s,a=an){const o=this.elements,c=2*r/(t-e),l=2*r/(A-i),u=(t+e)/(t-e),f=(A+i)/(A-i);let p,g;if(a===an)p=-(s+r)/(s-r),g=-2*s*r/(s-r);else if(a===Pa)p=-s/(s-r),g=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return o[0]=c,o[4]=0,o[8]=u,o[12]=0,o[1]=0,o[5]=l,o[9]=f,o[13]=0,o[2]=0,o[6]=0,o[10]=p,o[14]=g,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,A,i,r,s,a=an){const o=this.elements,c=1/(t-e),l=1/(A-i),u=1/(s-r),f=(t+e)*c,p=(A+i)*l;let g,m;if(a===an)g=(s+r)*u,m=-2*u;else if(a===Pa)g=r*u,m=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return o[0]=2*c,o[4]=0,o[8]=0,o[12]=-f,o[1]=0,o[5]=2*l,o[9]=0,o[13]=-p,o[2]=0,o[6]=0,o[10]=m,o[14]=-g,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<16;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<16;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e[t+9]=A[9],e[t+10]=A[10],e[t+11]=A[11],e[t+12]=A[12],e[t+13]=A[13],e[t+14]=A[14],e[t+15]=A[15],e}}const Ei=new Q,QA=new ot,v0=new Q(0,0,0),C0=new Q(1,1,1),Bn=new Q,ws=new Q,uA=new Q,rf=new ot,sf=new fi;class KA{constructor(e=0,t=0,A=0,i=KA.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=A,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,A,i=this._order){return this._x=e,this._y=t,this._z=A,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,A=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],o=i[1],c=i[5],l=i[9],u=i[2],f=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(iA(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,p),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-iA(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(o,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(iA(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(o,r));break;case"ZYX":this._y=Math.asin(-iA(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(o,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(iA(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-iA(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,A===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,A){return rf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rf,t,A)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sf.setFromEuler(this),this.setFromQuaternion(sf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}KA.DEFAULT_ORDER="XYZ";class wu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let _0=0;const af=new Q,yi=new fi,ZA=new ot,vs=new Q,Cr=new Q,x0=new Q,E0=new fi,of=new Q(1,0,0),lf=new Q(0,1,0),cf=new Q(0,0,1),uf={type:"added"},y0={type:"removed"},Ui={type:"childadded",child:null},ko={type:"childremoved",child:null};class $t extends di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_0++}),this.uuid=ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=$t.DEFAULT_UP.clone();const e=new Q,t=new KA,A=new fi,i=new Q(1,1,1);function r(){A.setFromEuler(t,!1)}function s(){t.setFromQuaternion(A,void 0,!1)}t._onChange(r),A._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:A},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ot},normalMatrix:{value:new Ke}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=$t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.multiply(yi),this}rotateOnWorldAxis(e,t){return yi.setFromAxisAngle(e,t),this.quaternion.premultiply(yi),this}rotateX(e){return this.rotateOnAxis(of,e)}rotateY(e){return this.rotateOnAxis(lf,e)}rotateZ(e){return this.rotateOnAxis(cf,e)}translateOnAxis(e,t){return af.copy(e).applyQuaternion(this.quaternion),this.position.add(af.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(of,e)}translateY(e){return this.translateOnAxis(lf,e)}translateZ(e){return this.translateOnAxis(cf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ZA.copy(this.matrixWorld).invert())}lookAt(e,t,A){e.isVector3?vs.copy(e):vs.set(e,t,A);const i=this.parent;this.updateWorldMatrix(!0,!1),Cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ZA.lookAt(Cr,vs,this.up):ZA.lookAt(vs,Cr,this.up),this.quaternion.setFromRotationMatrix(ZA),i&&(ZA.extractRotation(i.matrixWorld),yi.setFromRotationMatrix(ZA),this.quaternion.premultiply(yi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(uf),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let A=0;A<arguments.length;A++)this.remove(arguments[A]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(y0),ko.child=e,this.dispatchEvent(ko),ko.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ZA.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ZA.multiply(e.parent.matrixWorld)),e.applyMatrix4(ZA),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(uf),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let A=0,i=this.children.length;A<i;A++){const s=this.children[A].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,A=[]){this[e]===t&&A.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,A);return A}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,e,x0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Cr,E0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].updateMatrixWorld(e)}updateWorldMatrix(e,t){const A=this.parent;if(e===!0&&A!==null&&A.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",A={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},A.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const o=a.shapes;if(Array.isArray(o))for(let c=0,l=o.length;c<l;c++){const u=o[c];r(e.shapes,u)}else r(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let o=0,c=this.material.length;o<c;o++)a.push(r(e.materials,this.material[o]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const o=this.animations[a];i.animations.push(r(e.animations,o))}}if(t){const a=s(e.geometries),o=s(e.materials),c=s(e.textures),l=s(e.images),u=s(e.shapes),f=s(e.skeletons),p=s(e.animations),g=s(e.nodes);a.length>0&&(A.geometries=a),o.length>0&&(A.materials=o),c.length>0&&(A.textures=c),l.length>0&&(A.images=l),u.length>0&&(A.shapes=u),f.length>0&&(A.skeletons=f),p.length>0&&(A.animations=p),g.length>0&&(A.nodes=g)}return A.object=i,A;function s(a){const o=[];for(const c in a){const l=a[c];delete l.metadata,o.push(l)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let A=0;A<e.children.length;A++){const i=e.children[A];this.add(i.clone())}return this}}$t.DEFAULT_UP=new Q(0,1,0);$t.DEFAULT_MATRIX_AUTO_UPDATE=!0;$t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const LA=new Q,qA=new Q,Ko=new Q,jA=new Q,Si=new Q,Mi=new Q,ff=new Q,zo=new Q,Wo=new Q,Xo=new Q;class VA{constructor(e=new Q,t=new Q,A=new Q){this.a=e,this.b=t,this.c=A}static getNormal(e,t,A,i){i.subVectors(A,t),LA.subVectors(e,t),i.cross(LA);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,A,i,r){LA.subVectors(i,t),qA.subVectors(A,t),Ko.subVectors(e,t);const s=LA.dot(LA),a=LA.dot(qA),o=LA.dot(Ko),c=qA.dot(qA),l=qA.dot(Ko),u=s*c-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(c*o-a*l)*f,g=(s*l-a*o)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,A,i){return this.getBarycoord(e,t,A,i,jA)===null?!1:jA.x>=0&&jA.y>=0&&jA.x+jA.y<=1}static getInterpolation(e,t,A,i,r,s,a,o){return this.getBarycoord(e,t,A,i,jA)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(r,jA.x),o.addScaledVector(s,jA.y),o.addScaledVector(a,jA.z),o)}static isFrontFacing(e,t,A,i){return LA.subVectors(A,t),qA.subVectors(e,t),LA.cross(qA).dot(i)<0}set(e,t,A){return this.a.copy(e),this.b.copy(t),this.c.copy(A),this}setFromPointsAndIndices(e,t,A,i){return this.a.copy(e[t]),this.b.copy(e[A]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,A,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,A),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return LA.subVectors(this.c,this.b),qA.subVectors(this.a,this.b),LA.cross(qA).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return VA.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return VA.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,A,i,r){return VA.getInterpolation(e,this.a,this.b,this.c,t,A,i,r)}containsPoint(e){return VA.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return VA.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const A=this.a,i=this.b,r=this.c;let s,a;Si.subVectors(i,A),Mi.subVectors(r,A),zo.subVectors(e,A);const o=Si.dot(zo),c=Mi.dot(zo);if(o<=0&&c<=0)return t.copy(A);Wo.subVectors(e,i);const l=Si.dot(Wo),u=Mi.dot(Wo);if(l>=0&&u<=l)return t.copy(i);const f=o*u-l*c;if(f<=0&&o>=0&&l<=0)return s=o/(o-l),t.copy(A).addScaledVector(Si,s);Xo.subVectors(e,r);const p=Si.dot(Xo),g=Mi.dot(Xo);if(g>=0&&p<=g)return t.copy(r);const m=p*c-o*g;if(m<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(A).addScaledVector(Mi,a);const d=l*g-p*u;if(d<=0&&u-l>=0&&p-g>=0)return ff.subVectors(r,i),a=(u-l)/(u-l+(p-g)),t.copy(i).addScaledVector(ff,a);const h=1/(d+m+f);return s=m*h,a=f*h,t.copy(A).addScaledVector(Si,s).addScaledVector(Mi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const sp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wn={h:0,s:0,l:0},Cs={h:0,s:0,l:0};function Yo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class We{constructor(e,t,A){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,A)}set(e,t,A){if(t===void 0&&A===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,A);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=PA){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.toWorkingColorSpace(this,t),this}setRGB(e,t,A,i=At.workingColorSpace){return this.r=e,this.g=t,this.b=A,At.toWorkingColorSpace(this,i),this}setHSL(e,t,A,i=At.workingColorSpace){if(e=l0(e,1),t=iA(t,0,1),A=iA(A,0,1),t===0)this.r=this.g=this.b=A;else{const r=A<=.5?A*(1+t):A+t-A*t,s=2*A-r;this.r=Yo(s,r,e+1/3),this.g=Yo(s,r,e),this.b=Yo(s,r,e-1/3)}return At.toWorkingColorSpace(this,i),this}setStyle(e,t=PA){function A(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=PA){const A=sp[e.toLowerCase()];return A!==void 0?this.setHex(A,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}copyLinearToSRGB(e){return this.r=Ro(e.r),this.g=Ro(e.g),this.b=Ro(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=PA){return At.fromWorkingColorSpace(Yt.copy(this),e),Math.round(iA(Yt.r*255,0,255))*65536+Math.round(iA(Yt.g*255,0,255))*256+Math.round(iA(Yt.b*255,0,255))}getHexString(e=PA){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.fromWorkingColorSpace(Yt.copy(this),t);const A=Yt.r,i=Yt.g,r=Yt.b,s=Math.max(A,i,r),a=Math.min(A,i,r);let o,c;const l=(a+s)/2;if(a===s)o=0,c=0;else{const u=s-a;switch(c=l<=.5?u/(s+a):u/(2-s-a),s){case A:o=(i-r)/u+(i<r?6:0);break;case i:o=(r-A)/u+2;break;case r:o=(A-i)/u+4;break}o/=6}return e.h=o,e.s=c,e.l=l,e}getRGB(e,t=At.workingColorSpace){return At.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=PA){At.fromWorkingColorSpace(Yt.copy(this),e);const t=Yt.r,A=Yt.g,i=Yt.b;return e!==PA?`color(${e} ${t.toFixed(3)} ${A.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(A*255)},${Math.round(i*255)})`}offsetHSL(e,t,A){return this.getHSL(wn),this.setHSL(wn.h+e,wn.s+t,wn.l+A)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,A){return this.r=e.r+(t.r-e.r)*A,this.g=e.g+(t.g-e.g)*A,this.b=e.b+(t.b-e.b)*A,this}lerpHSL(e,t){this.getHSL(wn),e.getHSL(Cs);const A=Qo(wn.h,Cs.h,t),i=Qo(wn.s,Cs.s,t),r=Qo(wn.l,Cs.l,t);return this.setHSL(A,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,A=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*A+r[6]*i,this.g=r[1]*t+r[4]*A+r[7]*i,this.b=r[2]*t+r[5]*A+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new We;We.NAMES=sp;let U0=0;class pi extends di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:U0++}),this.uuid=ns(),this.name="",this.type="Material",this.blending=qi,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vl,this.blendDst=kl,this.blendEquation=jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new We(0,0,0),this.blendAlpha=0,this.depthFunc=Qa,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=qu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const A=e[t];if(A===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(A):i&&i.isVector3&&A&&A.isVector3?i.copy(A):this[t]=A}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const A={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};A.uuid=this.uuid,A.type=this.type,this.name!==""&&(A.name=this.name),this.color&&this.color.isColor&&(A.color=this.color.getHex()),this.roughness!==void 0&&(A.roughness=this.roughness),this.metalness!==void 0&&(A.metalness=this.metalness),this.sheen!==void 0&&(A.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(A.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(A.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(A.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(A.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(A.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(A.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(A.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(A.shininess=this.shininess),this.clearcoat!==void 0&&(A.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(A.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(A.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(A.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(A.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,A.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(A.dispersion=this.dispersion),this.iridescence!==void 0&&(A.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(A.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(A.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(A.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(A.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(A.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(A.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(A.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(A.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(A.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(A.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(A.lightMap=this.lightMap.toJSON(e).uuid,A.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(A.aoMap=this.aoMap.toJSON(e).uuid,A.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(A.bumpMap=this.bumpMap.toJSON(e).uuid,A.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(A.normalMap=this.normalMap.toJSON(e).uuid,A.normalMapType=this.normalMapType,A.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(A.displacementMap=this.displacementMap.toJSON(e).uuid,A.displacementScale=this.displacementScale,A.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(A.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(A.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(A.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(A.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(A.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(A.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(A.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(A.combine=this.combine)),this.envMapRotation!==void 0&&(A.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(A.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(A.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(A.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(A.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(A.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(A.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(A.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(A.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(A.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(A.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(A.size=this.size),this.shadowSide!==null&&(A.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(A.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(A.blending=this.blending),this.side!==Hn&&(A.side=this.side),this.vertexColors===!0&&(A.vertexColors=!0),this.opacity<1&&(A.opacity=this.opacity),this.transparent===!0&&(A.transparent=!0),this.blendSrc!==Vl&&(A.blendSrc=this.blendSrc),this.blendDst!==kl&&(A.blendDst=this.blendDst),this.blendEquation!==jn&&(A.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(A.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(A.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(A.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(A.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(A.blendAlpha=this.blendAlpha),this.depthFunc!==Qa&&(A.depthFunc=this.depthFunc),this.depthTest===!1&&(A.depthTest=this.depthTest),this.depthWrite===!1&&(A.depthWrite=this.depthWrite),this.colorWrite===!1&&(A.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(A.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==qu&&(A.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(A.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(A.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(A.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(A.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(A.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(A.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(A.rotation=this.rotation),this.polygonOffset===!0&&(A.polygonOffset=!0),this.polygonOffsetFactor!==0&&(A.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(A.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(A.linewidth=this.linewidth),this.dashSize!==void 0&&(A.dashSize=this.dashSize),this.gapSize!==void 0&&(A.gapSize=this.gapSize),this.scale!==void 0&&(A.scale=this.scale),this.dithering===!0&&(A.dithering=!0),this.alphaTest>0&&(A.alphaTest=this.alphaTest),this.alphaHash===!0&&(A.alphaHash=!0),this.alphaToCoverage===!0&&(A.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(A.premultipliedAlpha=!0),this.forceSinglePass===!0&&(A.forceSinglePass=!0),this.wireframe===!0&&(A.wireframe=!0),this.wireframeLinewidth>1&&(A.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(A.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(A.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(A.flatShading=!0),this.visible===!1&&(A.visible=!1),this.toneMapped===!1&&(A.toneMapped=!1),this.fog===!1&&(A.fog=!1),Object.keys(this.userData).length>0&&(A.userData=this.userData);function i(r){const s=[];for(const a in r){const o=r[a];delete o.metadata,s.push(o)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(A.textures=r),s.length>0&&(A.images=s)}return A}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let A=null;if(t!==null){const i=t.length;A=new Array(i);for(let r=0;r!==i;++r)A[r]=t[r].clone()}return this.clippingPlanes=A,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class er extends pi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new We(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new KA,this.combine=kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const yt=new Q,_s=new Ue;class Ut{constructor(e,t,A=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=A,this.usage=ju,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return kr("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,A){e*=this.itemSize,A*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[A+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,A=this.count;t<A;t++)_s.fromBufferAttribute(this,t),_s.applyMatrix3(e),this.setXY(t,_s.x,_s.y);else if(this.itemSize===3)for(let t=0,A=this.count;t<A;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,A=this.count;t<A;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,A=this.count;t<A;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,A=this.count;t<A;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let A=this.array[e*this.itemSize+t];return this.normalized&&(A=mr(A,this.array)),A}setComponent(e,t,A){return this.normalized&&(A=aA(A,this.array)),this.array[e*this.itemSize+t]=A,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mr(t,this.array)),t}setX(e,t){return this.normalized&&(t=aA(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mr(t,this.array)),t}setY(e,t){return this.normalized&&(t=aA(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=aA(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mr(t,this.array)),t}setW(e,t){return this.normalized&&(t=aA(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,A){return e*=this.itemSize,this.normalized&&(t=aA(t,this.array),A=aA(A,this.array)),this.array[e+0]=t,this.array[e+1]=A,this}setXYZ(e,t,A,i){return e*=this.itemSize,this.normalized&&(t=aA(t,this.array),A=aA(A,this.array),i=aA(i,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this}setXYZW(e,t,A,i,r){return e*=this.itemSize,this.normalized&&(t=aA(t,this.array),A=aA(A,this.array),i=aA(i,this.array),r=aA(r,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ju&&(e.usage=this.usage),e}}class ap extends Ut{constructor(e,t,A){super(new Uint16Array(e),t,A)}}class op extends Ut{constructor(e,t,A){super(new Uint32Array(e),t,A)}}class eA extends Ut{constructor(e,t,A){super(new Float32Array(e),t,A)}}let S0=0;const CA=new ot,Jo=new $t,bi=new Q,fA=new is,_r=new is,Dt=new Q;class Nt extends di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=ns(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(np(e)?op:ap)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,A=0){this.groups.push({start:e,count:t,materialIndex:A})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const A=this.attributes.normal;if(A!==void 0){const r=new Ke().getNormalMatrix(e);A.applyNormalMatrix(r),A.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return CA.makeRotationFromQuaternion(e),this.applyMatrix4(CA),this}rotateX(e){return CA.makeRotationX(e),this.applyMatrix4(CA),this}rotateY(e){return CA.makeRotationY(e),this.applyMatrix4(CA),this}rotateZ(e){return CA.makeRotationZ(e),this.applyMatrix4(CA),this}translate(e,t,A){return CA.makeTranslation(e,t,A),this.applyMatrix4(CA),this}scale(e,t,A){return CA.makeScale(e,t,A),this.applyMatrix4(CA),this}lookAt(e){return Jo.lookAt(e),Jo.updateMatrix(),this.applyMatrix4(Jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=[];for(let A=0,i=e.length;A<i;A++){const r=e[A];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new eA(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Q(-1/0,-1/0,-1/0),new Q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let A=0,i=t.length;A<i;A++){const r=t[A];fA.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,fA.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,fA.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(fA.min),this.boundingBox.expandByPoint(fA.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Q,1/0);return}if(e){const A=this.boundingSphere.center;if(fA.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];_r.setFromBufferAttribute(a),this.morphTargetsRelative?(Dt.addVectors(fA.min,_r.min),fA.expandByPoint(Dt),Dt.addVectors(fA.max,_r.max),fA.expandByPoint(Dt)):(fA.expandByPoint(_r.min),fA.expandByPoint(_r.max))}fA.getCenter(A);let i=0;for(let r=0,s=e.count;r<s;r++)Dt.fromBufferAttribute(e,r),i=Math.max(i,A.distanceToSquared(Dt));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],o=this.morphTargetsRelative;for(let c=0,l=a.count;c<l;c++)Dt.fromBufferAttribute(a,c),o&&(bi.fromBufferAttribute(e,c),Dt.add(bi)),i=Math.max(i,A.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const A=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*A.count),4));const s=this.getAttribute("tangent"),a=[],o=[];for(let L=0;L<A.count;L++)a[L]=new Q,o[L]=new Q;const c=new Q,l=new Q,u=new Q,f=new Ue,p=new Ue,g=new Ue,m=new Q,d=new Q;function h(L,x,C){c.fromBufferAttribute(A,L),l.fromBufferAttribute(A,x),u.fromBufferAttribute(A,C),f.fromBufferAttribute(r,L),p.fromBufferAttribute(r,x),g.fromBufferAttribute(r,C),l.sub(c),u.sub(c),p.sub(f),g.sub(f);const I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(m.copy(l).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(I),d.copy(u).multiplyScalar(p.x).addScaledVector(l,-g.x).multiplyScalar(I),a[L].add(m),a[x].add(m),a[C].add(m),o[L].add(d),o[x].add(d),o[C].add(d))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let L=0,x=_.length;L<x;++L){const C=_[L],I=C.start,W=C.count;for(let H=I,z=I+W;H<z;H+=3)h(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const w=new Q,U=new Q,T=new Q,y=new Q;function S(L){T.fromBufferAttribute(i,L),y.copy(T);const x=a[L];w.copy(x),w.sub(T.multiplyScalar(T.dot(x))).normalize(),U.crossVectors(y,x);const I=U.dot(o[L])<0?-1:1;s.setXYZW(L,w.x,w.y,w.z,I)}for(let L=0,x=_.length;L<x;++L){const C=_[L],I=C.start,W=C.count;for(let H=I,z=I+W;H<z;H+=3)S(e.getX(H+0)),S(e.getX(H+1)),S(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let A=this.getAttribute("normal");if(A===void 0)A=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",A);else for(let f=0,p=A.count;f<p;f++)A.setXYZ(f,0,0,0);const i=new Q,r=new Q,s=new Q,a=new Q,o=new Q,c=new Q,l=new Q,u=new Q;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),m=e.getX(f+1),d=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,d),l.subVectors(s,r),u.subVectors(i,r),l.cross(u),a.fromBufferAttribute(A,g),o.fromBufferAttribute(A,m),c.fromBufferAttribute(A,d),a.add(l),o.add(l),c.add(l),A.setXYZ(g,a.x,a.y,a.z),A.setXYZ(m,o.x,o.y,o.z),A.setXYZ(d,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),l.subVectors(s,r),u.subVectors(i,r),l.cross(u),A.setXYZ(f+0,l.x,l.y,l.z),A.setXYZ(f+1,l.x,l.y,l.z),A.setXYZ(f+2,l.x,l.y,l.z);this.normalizeNormals(),A.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,A=e.count;t<A;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(a,o){const c=a.array,l=a.itemSize,u=a.normalized,f=new c.constructor(o.length*l);let p=0,g=0;for(let m=0,d=o.length;m<d;m++){a.isInterleavedBufferAttribute?p=o[m]*a.data.stride+a.offset:p=o[m]*l;for(let h=0;h<l;h++)f[g++]=c[p++]}return new Ut(f,l,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Nt,A=this.index.array,i=this.attributes;for(const a in i){const o=i[a],c=e(o,A);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const o=[],c=r[a];for(let l=0,u=c.length;l<u;l++){const f=c[l],p=e(f,A);o.push(p)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,o=s.length;a<o;a++){const c=s[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const o=this.parameters;for(const c in o)o[c]!==void 0&&(e[c]=o[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const A=this.attributes;for(const o in A){const c=A[o];e.data.attributes[o]=c.toJSON(e.data)}const i={};let r=!1;for(const o in this.morphAttributes){const c=this.morphAttributes[o],l=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];l.push(p.toJSON(e.data))}l.length>0&&(i[o]=l,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const A=e.index;A!==null&&this.setIndex(A.clone(t));const i=e.attributes;for(const c in i){const l=i[c];this.setAttribute(c,l.clone(t))}const r=e.morphAttributes;for(const c in r){const l=[],u=r[c];for(let f=0,p=u.length;f<p;f++)l.push(u[f].clone(t));this.morphAttributes[c]=l}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,l=s.length;c<l;c++){const u=s[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hf=new ot,Wn=new ss,xs=new rs,df=new Q,Fi=new Q,Ti=new Q,Ii=new Q,Zo=new Q,Es=new Q,ys=new Ue,Us=new Ue,Ss=new Ue,pf=new Q,gf=new Q,mf=new Q,Ms=new Q,bs=new Q;class Ft extends $t{constructor(e=new Nt,t=new er){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const A=this.geometry,i=A.attributes.position,r=A.morphAttributes.position,s=A.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){Es.set(0,0,0);for(let o=0,c=r.length;o<c;o++){const l=a[o],u=r[o];l!==0&&(Zo.fromBufferAttribute(u,e),s?Es.addScaledVector(Zo,l):Es.addScaledVector(Zo.sub(t),l))}t.add(Es)}return t}raycast(e,t){const A=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(A.boundingSphere===null&&A.computeBoundingSphere(),xs.copy(A.boundingSphere),xs.applyMatrix4(r),Wn.copy(e.ray).recast(e.near),!(xs.containsPoint(Wn.origin)===!1&&(Wn.intersectSphere(xs,df)===null||Wn.origin.distanceToSquared(df)>(e.far-e.near)**2))&&(hf.copy(r).invert(),Wn.copy(e.ray).applyMatrix4(hf),!(A.boundingBox!==null&&Wn.intersectsBox(A.boundingBox)===!1)&&this._computeIntersections(e,t,Wn)))}_computeIntersections(e,t,A){let i;const r=this.geometry,s=this.material,a=r.index,o=r.attributes.position,c=r.attributes.uv,l=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],_=Math.max(d.start,p.start),w=Math.min(a.count,Math.min(d.start+d.count,p.start+p.count));for(let U=_,T=w;U<T;U+=3){const y=a.getX(U),S=a.getX(U+1),L=a.getX(U+2);i=Fs(this,h,e,A,c,l,u,y,S,L),i&&(i.faceIndex=Math.floor(U/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(a.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const _=a.getX(d),w=a.getX(d+1),U=a.getX(d+2);i=Fs(this,s,e,A,c,l,u,_,w,U),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],_=Math.max(d.start,p.start),w=Math.min(o.count,Math.min(d.start+d.count,p.start+p.count));for(let U=_,T=w;U<T;U+=3){const y=U,S=U+1,L=U+2;i=Fs(this,h,e,A,c,l,u,y,S,L),i&&(i.faceIndex=Math.floor(U/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(o.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const _=d,w=d+1,U=d+2;i=Fs(this,s,e,A,c,l,u,_,w,U),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}}}function M0(n,e,t,A,i,r,s,a){let o;if(e.side===rA?o=A.intersectTriangle(s,r,i,!0,a):o=A.intersectTriangle(i,r,s,e.side===Hn,a),o===null)return null;bs.copy(a),bs.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(bs);return c<t.near||c>t.far?null:{distance:c,point:bs.clone(),object:n}}function Fs(n,e,t,A,i,r,s,a,o,c){n.getVertexPosition(a,Fi),n.getVertexPosition(o,Ti),n.getVertexPosition(c,Ii);const l=M0(n,e,t,A,Fi,Ti,Ii,Ms);if(l){i&&(ys.fromBufferAttribute(i,a),Us.fromBufferAttribute(i,o),Ss.fromBufferAttribute(i,c),l.uv=VA.getInterpolation(Ms,Fi,Ti,Ii,ys,Us,Ss,new Ue)),r&&(ys.fromBufferAttribute(r,a),Us.fromBufferAttribute(r,o),Ss.fromBufferAttribute(r,c),l.uv1=VA.getInterpolation(Ms,Fi,Ti,Ii,ys,Us,Ss,new Ue)),s&&(pf.fromBufferAttribute(s,a),gf.fromBufferAttribute(s,o),mf.fromBufferAttribute(s,c),l.normal=VA.getInterpolation(Ms,Fi,Ti,Ii,pf,gf,mf,new Q),l.normal.dot(A.direction)>0&&l.normal.multiplyScalar(-1));const u={a,b:o,c,normal:new Q,materialIndex:0};VA.getNormal(Fi,Ti,Ii,u.normal),l.face=u}return l}class as extends Nt{constructor(e=1,t=1,A=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:A,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const o=[],c=[],l=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,A,t,e,s,r,0),g("z","y","x",1,-1,A,t,-e,s,r,1),g("x","z","y",1,1,e,A,t,i,s,2),g("x","z","y",1,-1,e,A,-t,i,s,3),g("x","y","z",1,-1,e,t,A,i,r,4),g("x","y","z",-1,-1,e,t,-A,i,r,5),this.setIndex(o),this.setAttribute("position",new eA(c,3)),this.setAttribute("normal",new eA(l,3)),this.setAttribute("uv",new eA(u,2));function g(m,d,h,_,w,U,T,y,S,L,x){const C=U/S,I=T/L,W=U/2,H=T/2,z=y/2,Z=S+1,K=L+1;let q=0,Y=0;const se=new Q;for(let ae=0;ae<K;ae++){const pe=ae*I-H;for(let Pe=0;Pe<Z;Pe++){const Ge=Pe*C-W;se[m]=Ge*_,se[d]=pe*w,se[h]=z,c.push(se.x,se.y,se.z),se[m]=0,se[d]=0,se[h]=y>0?1:-1,l.push(se.x,se.y,se.z),u.push(Pe/S),u.push(1-ae/L),q+=1}}for(let ae=0;ae<L;ae++)for(let pe=0;pe<S;pe++){const Pe=f+pe+Z*ae,Ge=f+pe+Z*(ae+1),J=f+(pe+1)+Z*(ae+1),$=f+(pe+1)+Z*ae;o.push(Pe,Ge,$),o.push(Ge,J,$),Y+=6}a.addGroup(p,Y,x),p+=Y,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new as(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function cr(n){const e={};for(const t in n){e[t]={};for(const A in n[t]){const i=n[t][A];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][A]=null):e[t][A]=i.clone():Array.isArray(i)?e[t][A]=i.slice():e[t][A]=i}}return e}function tA(n){const e={};for(let t=0;t<n.length;t++){const A=cr(n[t]);for(const i in A)e[i]=A[i]}return e}function b0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function lp(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const cp={clone:cr,merge:tA};var F0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,T0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zt extends pi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=F0,this.fragmentShader=T0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=cr(e.uniforms),this.uniformsGroups=b0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const A={};for(const i in this.extensions)this.extensions[i]===!0&&(A[i]=!0);return Object.keys(A).length>0&&(t.extensions=A),t}}class up extends $t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=an}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vn=new Q,Bf=new Ue,wf=new Ue;class mA extends up{constructor(e=50,t=1,A=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=A,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=vc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ea*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vc*2*Math.atan(Math.tan(Ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,A){vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vn.x,vn.y).multiplyScalar(-e/vn.z),vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),A.set(vn.x,vn.y).multiplyScalar(-e/vn.z)}getViewSize(e,t){return this.getViewBounds(e,Bf,wf),t.subVectors(wf,Bf)}setViewOffset(e,t,A,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ea*.5*this.fov)/this.zoom,A=2*t,i=this.aspect*A,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const o=s.fullWidth,c=s.fullHeight;r+=s.offsetX*i/o,t-=s.offsetY*A/c,i*=s.width/o,A*=s.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-A,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Qi=-90,Li=1;class I0 extends $t{constructor(e,t,A){super(),this.type="CubeCamera",this.renderTarget=A,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new mA(Qi,Li,e,t);i.layers=this.layers,this.add(i);const r=new mA(Qi,Li,e,t);r.layers=this.layers,this.add(r);const s=new mA(Qi,Li,e,t);s.layers=this.layers,this.add(s);const a=new mA(Qi,Li,e,t);a.layers=this.layers,this.add(a);const o=new mA(Qi,Li,e,t);o.layers=this.layers,this.add(o);const c=new mA(Qi,Li,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[A,i,r,s,a,o]=t;for(const c of t)this.remove(c);if(e===an)A.up.set(0,1,0),A.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===Pa)A.up.set(0,-1,0),A.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:A,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,o,c,l]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const m=A.texture.generateMipmaps;A.texture.generateMipmaps=!1,e.setRenderTarget(A,0,i),e.render(t,r),e.setRenderTarget(A,1,i),e.render(t,s),e.setRenderTarget(A,2,i),e.render(t,a),e.setRenderTarget(A,3,i),e.render(t,o),e.setRenderTarget(A,4,i),e.render(t,c),A.texture.generateMipmaps=m,e.setRenderTarget(A,5,i),e.render(t,l),e.setRenderTarget(u,f,p),e.xr.enabled=g,A.texture.needsPMREMUpdate=!0}}class fp extends sA{constructor(e,t,A,i,r,s,a,o,c,l){e=e!==void 0?e:[],t=t!==void 0?t:sr,super(e,t,A,i,r,s,a,o,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Q0 extends Nn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const A={width:e,height:e,depth:1},i=[A,A,A,A,A,A];this.texture=new fp(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:wA}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const A={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new as(5,5,5),r=new zt({name:"CubemapFromEquirect",uniforms:cr(A.uniforms),vertexShader:A.vertexShader,fragmentShader:A.fragmentShader,side:rA,blending:on});r.uniforms.tEquirect.value=t;const s=new Ft(i,r),a=t.minFilter;return t.minFilter===Ai&&(t.minFilter=wA),new I0(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,A,i){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,A,i);e.setRenderTarget(r)}}const qo=new Q,L0=new Q,R0=new Ke;class En{constructor(e=new Q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,A,i){return this.normal.set(e,t,A),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,A){const i=qo.subVectors(A,t).cross(L0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const A=e.delta(qo),i=this.normal.dot(A);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(A,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),A=this.distanceToPoint(e.end);return t<0&&A>0||A<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const A=t||R0.getNormalMatrix(e),i=this.coplanarPoint(qo).applyMatrix4(e),r=this.normal.applyMatrix3(A).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Xn=new rs,Ts=new Q;class vu{constructor(e=new En,t=new En,A=new En,i=new En,r=new En,s=new En){this.planes=[e,t,A,i,r,s]}set(e,t,A,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(A),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let A=0;A<6;A++)t[A].copy(e.planes[A]);return this}setFromProjectionMatrix(e,t=an){const A=this.planes,i=e.elements,r=i[0],s=i[1],a=i[2],o=i[3],c=i[4],l=i[5],u=i[6],f=i[7],p=i[8],g=i[9],m=i[10],d=i[11],h=i[12],_=i[13],w=i[14],U=i[15];if(A[0].setComponents(o-r,f-c,d-p,U-h).normalize(),A[1].setComponents(o+r,f+c,d+p,U+h).normalize(),A[2].setComponents(o+s,f+l,d+g,U+_).normalize(),A[3].setComponents(o-s,f-l,d-g,U-_).normalize(),A[4].setComponents(o-a,f-u,d-m,U-w).normalize(),t===an)A[5].setComponents(o+a,f+u,d+m,U+w).normalize();else if(t===Pa)A[5].setComponents(a,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Xn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Xn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Xn)}intersectsSprite(e){return Xn.center.set(0,0,0),Xn.radius=.7071067811865476,Xn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Xn)}intersectsSphere(e){const t=this.planes,A=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(A)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let A=0;A<6;A++){const i=t[A];if(Ts.x=i.normal.x>0?e.max.x:e.min.x,Ts.y=i.normal.y>0?e.max.y:e.min.y,Ts.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ts)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let A=0;A<6;A++)if(t[A].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function hp(){let n=null,e=!1,t=null,A=null;function i(r,s){t(r,s),A=n.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(A=n.requestAnimationFrame(i),e=!0)},stop:function(){n.cancelAnimationFrame(A),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function D0(n){const e=new WeakMap;function t(a,o){const c=a.array,l=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(o,f),n.bufferData(o,c,l),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function A(a,o,c){const l=o.array,u=o._updateRange,f=o.updateRanges;if(n.bindBuffer(c,a),u.count===-1&&f.length===0&&n.bufferSubData(c,0,l),f.length!==0){for(let p=0,g=f.length;p<g;p++){const m=f[p];n.bufferSubData(c,m.start*l.BYTES_PER_ELEMENT,l,m.start,m.count)}o.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(c,u.offset*l.BYTES_PER_ELEMENT,l,u.offset,u.count),u.count=-1),o.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const o=e.get(a);o&&(n.deleteBuffer(o.buffer),e.delete(a))}function s(a,o){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const l=e.get(a);(!l||l.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,o));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");A(c.buffer,a,o),c.version=a.version}}return{get:i,remove:r,update:s}}class On extends Nt{constructor(e=1,t=1,A=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:A,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(A),o=Math.floor(i),c=a+1,l=o+1,u=e/a,f=t/o,p=[],g=[],m=[],d=[];for(let h=0;h<l;h++){const _=h*f-s;for(let w=0;w<c;w++){const U=w*u-r;g.push(U,-_,0),m.push(0,0,1),d.push(w/a),d.push(1-h/o)}}for(let h=0;h<o;h++)for(let _=0;_<a;_++){const w=_+c*h,U=_+c*(h+1),T=_+1+c*(h+1),y=_+1+c*h;p.push(w,U,y),p.push(U,T,y)}this.setIndex(p),this.setAttribute("position",new eA(g,3)),this.setAttribute("normal",new eA(m,3)),this.setAttribute("uv",new eA(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.width,e.height,e.widthSegments,e.heightSegments)}}var P0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,H0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,N0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,O0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,G0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,V0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,k0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,K0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,z0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,W0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,X0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Y0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,J0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Z0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,q0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,j0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eB=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tB=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,AB=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,nB=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,iB=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,rB=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,sB=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,aB=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,oB=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,lB=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,cB=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uB=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fB=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hB="gl_FragColor = linearToOutputTexel( gl_FragColor );",dB=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,pB=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gB=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mB=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,BB=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wB=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,vB=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,CB=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_B=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xB=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,EB=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yB=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,UB=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,SB=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,MB=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bB=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,FB=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,TB=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,IB=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,QB=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,LB=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,RB=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,DB=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,PB=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,HB=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,NB=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,OB=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,GB=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,VB=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kB=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,KB=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zB=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,WB=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,XB=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,YB=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,JB=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ZB=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qB=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jB=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,$B=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ew=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Aw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,rw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,sw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,aw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ow=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,lw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,cw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,fw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,hw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,pw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Bw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ww=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,_w=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xw=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ew=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Uw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Sw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fw=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tw=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Iw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Lw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Dw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ow=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,kw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ww=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,qw=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jw=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$w=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ev=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Av=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,nv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,iv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,av=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ov=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,uv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ke={alphahash_fragment:P0,alphahash_pars_fragment:H0,alphamap_fragment:N0,alphamap_pars_fragment:O0,alphatest_fragment:G0,alphatest_pars_fragment:V0,aomap_fragment:k0,aomap_pars_fragment:K0,batching_pars_vertex:z0,batching_vertex:W0,begin_vertex:X0,beginnormal_vertex:Y0,bsdfs:J0,iridescence_fragment:Z0,bumpmap_pars_fragment:q0,clipping_planes_fragment:j0,clipping_planes_pars_fragment:$0,clipping_planes_pars_vertex:eB,clipping_planes_vertex:tB,color_fragment:AB,color_pars_fragment:nB,color_pars_vertex:iB,color_vertex:rB,common:sB,cube_uv_reflection_fragment:aB,defaultnormal_vertex:oB,displacementmap_pars_vertex:lB,displacementmap_vertex:cB,emissivemap_fragment:uB,emissivemap_pars_fragment:fB,colorspace_fragment:hB,colorspace_pars_fragment:dB,envmap_fragment:pB,envmap_common_pars_fragment:gB,envmap_pars_fragment:mB,envmap_pars_vertex:BB,envmap_physical_pars_fragment:bB,envmap_vertex:wB,fog_vertex:vB,fog_pars_vertex:CB,fog_fragment:_B,fog_pars_fragment:xB,gradientmap_pars_fragment:EB,lightmap_pars_fragment:yB,lights_lambert_fragment:UB,lights_lambert_pars_fragment:SB,lights_pars_begin:MB,lights_toon_fragment:FB,lights_toon_pars_fragment:TB,lights_phong_fragment:IB,lights_phong_pars_fragment:QB,lights_physical_fragment:LB,lights_physical_pars_fragment:RB,lights_fragment_begin:DB,lights_fragment_maps:PB,lights_fragment_end:HB,logdepthbuf_fragment:NB,logdepthbuf_pars_fragment:OB,logdepthbuf_pars_vertex:GB,logdepthbuf_vertex:VB,map_fragment:kB,map_pars_fragment:KB,map_particle_fragment:zB,map_particle_pars_fragment:WB,metalnessmap_fragment:XB,metalnessmap_pars_fragment:YB,morphinstance_vertex:JB,morphcolor_vertex:ZB,morphnormal_vertex:qB,morphtarget_pars_vertex:jB,morphtarget_vertex:$B,normal_fragment_begin:ew,normal_fragment_maps:tw,normal_pars_fragment:Aw,normal_pars_vertex:nw,normal_vertex:iw,normalmap_pars_fragment:rw,clearcoat_normal_fragment_begin:sw,clearcoat_normal_fragment_maps:aw,clearcoat_pars_fragment:ow,iridescence_pars_fragment:lw,opaque_fragment:cw,packing:uw,premultiplied_alpha_fragment:fw,project_vertex:hw,dithering_fragment:dw,dithering_pars_fragment:pw,roughnessmap_fragment:gw,roughnessmap_pars_fragment:mw,shadowmap_pars_fragment:Bw,shadowmap_pars_vertex:ww,shadowmap_vertex:vw,shadowmask_pars_fragment:Cw,skinbase_vertex:_w,skinning_pars_vertex:xw,skinning_vertex:Ew,skinnormal_vertex:yw,specularmap_fragment:Uw,specularmap_pars_fragment:Sw,tonemapping_fragment:Mw,tonemapping_pars_fragment:bw,transmission_fragment:Fw,transmission_pars_fragment:Tw,uv_pars_fragment:Iw,uv_pars_vertex:Qw,uv_vertex:Lw,worldpos_vertex:Rw,background_vert:Dw,background_frag:Pw,backgroundCube_vert:Hw,backgroundCube_frag:Nw,cube_vert:Ow,cube_frag:Gw,depth_vert:Vw,depth_frag:kw,distanceRGBA_vert:Kw,distanceRGBA_frag:zw,equirect_vert:Ww,equirect_frag:Xw,linedashed_vert:Yw,linedashed_frag:Jw,meshbasic_vert:Zw,meshbasic_frag:qw,meshlambert_vert:jw,meshlambert_frag:$w,meshmatcap_vert:ev,meshmatcap_frag:tv,meshnormal_vert:Av,meshnormal_frag:nv,meshphong_vert:iv,meshphong_frag:rv,meshphysical_vert:sv,meshphysical_frag:av,meshtoon_vert:ov,meshtoon_frag:lv,points_vert:cv,points_frag:uv,shadow_vert:fv,shadow_frag:hv,sprite_vert:dv,sprite_frag:pv},le={common:{diffuse:{value:new We(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new We(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new We(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new We(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},GA={basic:{uniforms:tA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:tA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new We(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:tA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new We(0)},specular:{value:new We(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:tA([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new We(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:tA([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new We(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:tA([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:tA([le.points,le.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:tA([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:tA([le.common,le.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:tA([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:tA([le.sprite,le.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:tA([le.common,le.displacementmap,{referencePosition:{value:new Q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:tA([le.lights,le.fog,{color:{value:new We(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};GA.physical={uniforms:tA([GA.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new We(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new We(0)},specularColor:{value:new We(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const Is={r:0,b:0,g:0},Yn=new KA,gv=new ot;function mv(n,e,t,A,i,r,s){const a=new We(0);let o=r===!0?0:1,c,l,u=null,f=0,p=null;function g(_){let w=_.isScene===!0?_.background:null;return w&&w.isTexture&&(w=(_.backgroundBlurriness>0?t:e).get(w)),w}function m(_){let w=!1;const U=g(_);U===null?h(a,o):U&&U.isColor&&(h(U,1),w=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?A.buffers.color.setClear(0,0,0,1,s):T==="alpha-blend"&&A.buffers.color.setClear(0,0,0,0,s),(n.autoClear||w)&&(A.buffers.depth.setTest(!0),A.buffers.depth.setMask(!0),A.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function d(_,w){const U=g(w);U&&(U.isCubeTexture||U.mapping===lo)?(l===void 0&&(l=new Ft(new as(1,1,1),new zt({name:"BackgroundCubeMaterial",uniforms:cr(GA.backgroundCube.uniforms),vertexShader:GA.backgroundCube.vertexShader,fragmentShader:GA.backgroundCube.fragmentShader,side:rA,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(T,y,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),Yn.copy(w.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,U.isCubeTexture&&U.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),l.material.uniforms.envMap.value=U,l.material.uniforms.flipEnvMap.value=U.isCubeTexture&&U.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(gv.makeRotationFromEuler(Yn)),l.material.toneMapped=At.getTransfer(U.colorSpace)!==ct,(u!==U||f!==U.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=U,f=U.version,p=n.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null)):U&&U.isTexture&&(c===void 0&&(c=new Ft(new On(2,2),new zt({name:"BackgroundMaterial",uniforms:cr(GA.background.uniforms),vertexShader:GA.background.vertexShader,fragmentShader:GA.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=U,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=At.getTransfer(U.colorSpace)!==ct,U.matrixAutoUpdate===!0&&U.updateMatrix(),c.material.uniforms.uvTransform.value.copy(U.matrix),(u!==U||f!==U.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=U,f=U.version,p=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function h(_,w){_.getRGB(Is,lp(n)),A.buffers.color.setClear(Is.r,Is.g,Is.b,w,s)}return{getClearColor:function(){return a},setClearColor:function(_,w=1){a.set(_),o=w,h(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,h(a,o)},render:m,addToRenderList:d}}function Bv(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),A={},i=f(null);let r=i,s=!1;function a(C,I,W,H,z){let Z=!1;const K=u(H,W,I);r!==K&&(r=K,c(r.object)),Z=p(C,H,W,z),Z&&g(C,H,W,z),z!==null&&e.update(z,n.ELEMENT_ARRAY_BUFFER),(Z||s)&&(s=!1,U(C,I,W,H),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function o(){return n.createVertexArray()}function c(C){return n.bindVertexArray(C)}function l(C){return n.deleteVertexArray(C)}function u(C,I,W){const H=W.wireframe===!0;let z=A[C.id];z===void 0&&(z={},A[C.id]=z);let Z=z[I.id];Z===void 0&&(Z={},z[I.id]=Z);let K=Z[H];return K===void 0&&(K=f(o()),Z[H]=K),K}function f(C){const I=[],W=[],H=[];for(let z=0;z<t;z++)I[z]=0,W[z]=0,H[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:W,attributeDivisors:H,object:C,attributes:{},index:null}}function p(C,I,W,H){const z=r.attributes,Z=I.attributes;let K=0;const q=W.getAttributes();for(const Y in q)if(q[Y].location>=0){const ae=z[Y];let pe=Z[Y];if(pe===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(pe=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(pe=C.instanceColor)),ae===void 0||ae.attribute!==pe||pe&&ae.data!==pe.data)return!0;K++}return r.attributesNum!==K||r.index!==H}function g(C,I,W,H){const z={},Z=I.attributes;let K=0;const q=W.getAttributes();for(const Y in q)if(q[Y].location>=0){let ae=Z[Y];ae===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor));const pe={};pe.attribute=ae,ae&&ae.data&&(pe.data=ae.data),z[Y]=pe,K++}r.attributes=z,r.attributesNum=K,r.index=H}function m(){const C=r.newAttributes;for(let I=0,W=C.length;I<W;I++)C[I]=0}function d(C){h(C,0)}function h(C,I){const W=r.newAttributes,H=r.enabledAttributes,z=r.attributeDivisors;W[C]=1,H[C]===0&&(n.enableVertexAttribArray(C),H[C]=1),z[C]!==I&&(n.vertexAttribDivisor(C,I),z[C]=I)}function _(){const C=r.newAttributes,I=r.enabledAttributes;for(let W=0,H=I.length;W<H;W++)I[W]!==C[W]&&(n.disableVertexAttribArray(W),I[W]=0)}function w(C,I,W,H,z,Z,K){K===!0?n.vertexAttribIPointer(C,I,W,z,Z):n.vertexAttribPointer(C,I,W,H,z,Z)}function U(C,I,W,H){m();const z=H.attributes,Z=W.getAttributes(),K=I.defaultAttributeValues;for(const q in Z){const Y=Z[q];if(Y.location>=0){let se=z[q];if(se===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(se=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(se=C.instanceColor)),se!==void 0){const ae=se.normalized,pe=se.itemSize,Pe=e.get(se);if(Pe===void 0)continue;const Ge=Pe.buffer,J=Pe.type,$=Pe.bytesPerElement,fe=J===n.INT||J===n.UNSIGNED_INT||se.gpuType===fu;if(se.isInterleavedBufferAttribute){const ce=se.data,Ne=ce.stride,Ve=se.offset;if(ce.isInstancedInterleavedBuffer){for(let ze=0;ze<Y.locationSize;ze++)h(Y.location+ze,ce.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ze=0;ze<Y.locationSize;ze++)d(Y.location+ze);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ze=0;ze<Y.locationSize;ze++)w(Y.location+ze,pe/Y.locationSize,J,ae,Ne*$,(Ve+pe/Y.locationSize*ze)*$,fe)}else{if(se.isInstancedBufferAttribute){for(let ce=0;ce<Y.locationSize;ce++)h(Y.location+ce,se.meshPerAttribute);C.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let ce=0;ce<Y.locationSize;ce++)d(Y.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ce=0;ce<Y.locationSize;ce++)w(Y.location+ce,pe/Y.locationSize,J,ae,pe*$,pe/Y.locationSize*ce*$,fe)}}else if(K!==void 0){const ae=K[q];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(Y.location,ae);break;case 3:n.vertexAttrib3fv(Y.location,ae);break;case 4:n.vertexAttrib4fv(Y.location,ae);break;default:n.vertexAttrib1fv(Y.location,ae)}}}}_()}function T(){L();for(const C in A){const I=A[C];for(const W in I){const H=I[W];for(const z in H)l(H[z].object),delete H[z];delete I[W]}delete A[C]}}function y(C){if(A[C.id]===void 0)return;const I=A[C.id];for(const W in I){const H=I[W];for(const z in H)l(H[z].object),delete H[z];delete I[W]}delete A[C.id]}function S(C){for(const I in A){const W=A[I];if(W[C.id]===void 0)continue;const H=W[C.id];for(const z in H)l(H[z].object),delete H[z];delete W[C.id]}}function L(){x(),s=!0,r!==i&&(r=i,c(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:L,resetDefaultState:x,dispose:T,releaseStatesOfGeometry:y,releaseStatesOfProgram:S,initAttributes:m,enableAttribute:d,disableUnusedAttributes:_}}function wv(n,e,t){let A;function i(c){A=c}function r(c,l){n.drawArrays(A,c,l),t.update(l,A,1)}function s(c,l,u){u!==0&&(n.drawArraysInstanced(A,c,l,u),t.update(l,A,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(A,c,0,l,0,u);let p=0;for(let g=0;g<u;g++)p+=l[g];t.update(p,A,1)}function o(c,l,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)s(c[g],l[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(A,c,0,l,0,f,0,u);let g=0;for(let m=0;m<u;m++)g+=l[m];for(let m=0;m<f.length;m++)t.update(g,A,f[m])}}this.setMode=i,this.render=r,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=o}function vv(n,e,t,A){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(y){return!(y!==HA&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){const S=y===hr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==un&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==sn&&!S)}function o(y){if(y==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const l=o(c);l!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",l,"instead."),c=l);const u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),h=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),U=p>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:o,textureFormatReadable:s,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:h,maxVaryings:_,maxFragmentUniforms:w,vertexTextures:U,maxSamples:T}}function Cv(n){const e=this;let t=null,A=0,i=!1,r=!1;const s=new En,a=new Ke,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||A!==0||i;return i=f,A=u.length,p},this.beginShadows=function(){r=!0,l(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=l(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,m=u.clipIntersection,d=u.clipShadows,h=n.get(u);if(!i||g===null||g.length===0||r&&!d)r?l(null):c();else{const _=r?0:A,w=_*4;let U=h.clippingState||null;o.value=U,U=l(g,f,w,p);for(let T=0;T!==w;++T)U[T]=t[T];h.clippingState=U,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=_}};function c(){o.value!==t&&(o.value=t,o.needsUpdate=A>0),e.numPlanes=A,e.numIntersection=0}function l(u,f,p,g){const m=u!==null?u.length:0;let d=null;if(m!==0){if(d=o.value,g!==!0||d===null){const h=p+m*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(d===null||d.length<h)&&(d=new Float32Array(h));for(let w=0,U=p;w!==m;++w,U+=4)s.copy(u[w]).applyMatrix4(_,a),s.normal.toArray(d,U),d[U+3]=s.constant}o.value=d,o.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,d}}function _v(n){let e=new WeakMap;function t(s,a){return a===Kl?s.mapping=sr:a===zl&&(s.mapping=ar),s}function A(s){if(s&&s.isTexture){const a=s.mapping;if(a===Kl||a===zl)if(e.has(s)){const o=e.get(s).texture;return t(o,s.mapping)}else{const o=s.image;if(o&&o.height>0){const c=new Q0(o.height);return c.fromEquirectangularTexture(n,s),e.set(s,c),s.addEventListener("dispose",i),t(c.texture,s.mapping)}else return null}}return s}function i(s){const a=s.target;a.removeEventListener("dispose",i);const o=e.get(a);o!==void 0&&(e.delete(a),o.dispose())}function r(){e=new WeakMap}return{get:A,dispose:r}}class dp extends up{constructor(e=-1,t=1,A=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=A,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,A,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),A=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=A-e,s=A+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,a-=l*this.view.offsetY,o=a-l*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Xi=4,vf=[.125,.215,.35,.446,.526,.582],$n=20,jo=new dp,Cf=new We;let $o=null,el=0,tl=0,Al=!1;const qn=(1+Math.sqrt(5))/2,Ri=1/qn,_f=[new Q(-qn,Ri,0),new Q(qn,Ri,0),new Q(-Ri,0,qn),new Q(Ri,0,qn),new Q(0,qn,-Ri),new Q(0,qn,Ri),new Q(-1,1,-1),new Q(1,1,-1),new Q(-1,1,1),new Q(1,1,1)];class xf{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,A=.1,i=100){$o=this._renderer.getRenderTarget(),el=this._renderer.getActiveCubeFace(),tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,A,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($o,el,tl),this._renderer.xr.enabled=Al,e.scissorTest=!1,Qs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===sr||e.mapping===ar?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$o=this._renderer.getRenderTarget(),el=this._renderer.getActiveCubeFace(),tl=this._renderer.getActiveMipmapLevel(),Al=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const A=t||this._allocateTargets();return this._textureToCubeUV(e,A),this._applyPMREM(A),this._cleanup(A),A}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,A={magFilter:wA,minFilter:wA,generateMipmaps:!1,type:hr,format:HA,colorSpace:Vn,depthBuffer:!1},i=Ef(e,t,A);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ef(e,t,A);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xv(r)),this._blurMaterial=Ev(r,e,t)}return i}_compileMaterial(e){const t=new Ft(this._lodPlanes[0],e);this._renderer.compile(t,jo)}_sceneToCubeUV(e,t,A,i){const a=new mA(90,1,t,A),o=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],l=this._renderer,u=l.autoClear,f=l.toneMapping;l.getClearColor(Cf),l.toneMapping=Ln,l.autoClear=!1;const p=new er({name:"PMREM.Background",side:rA,depthWrite:!1,depthTest:!1}),g=new Ft(new as,p);let m=!1;const d=e.background;d?d.isColor&&(p.color.copy(d),e.background=null,m=!0):(p.color.copy(Cf),m=!0);for(let h=0;h<6;h++){const _=h%3;_===0?(a.up.set(0,o[h],0),a.lookAt(c[h],0,0)):_===1?(a.up.set(0,0,o[h]),a.lookAt(0,c[h],0)):(a.up.set(0,o[h],0),a.lookAt(0,0,c[h]));const w=this._cubeSize;Qs(i,_*w,h>2?w:0,w,w),l.setRenderTarget(i),m&&l.render(g,a),l.render(e,a)}g.geometry.dispose(),g.material.dispose(),l.toneMapping=f,l.autoClear=u,e.background=d}_textureToCubeUV(e,t){const A=this._renderer,i=e.mapping===sr||e.mapping===ar;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yf());const r=i?this._cubemapMaterial:this._equirectMaterial,s=new Ft(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const o=this._cubeSize;Qs(t,0,0,3*o,2*o),A.setRenderTarget(t),A.render(s,jo)}_applyPMREM(e){const t=this._renderer,A=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=_f[(i-r-1)%_f.length];this._blur(e,r-1,r,s,a)}t.autoClear=A}_blur(e,t,A,i,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,A,i,"latitudinal",r),this._halfBlur(s,e,A,A,i,"longitudinal",r)}_halfBlur(e,t,A,i,r,s,a){const o=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const l=3,u=new Ft(this._lodPlanes[i],c),f=c.uniforms,p=this._sizeLods[A]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*$n-1),m=r/g,d=isFinite(r)?1+Math.floor(l*m):$n;d>$n&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${$n}`);const h=[];let _=0;for(let S=0;S<$n;++S){const L=S/m,x=Math.exp(-L*L/2);h.push(x),S===0?_+=x:S<d&&(_+=2*x)}for(let S=0;S<h.length;S++)h[S]=h[S]/_;f.envMap.value=e.texture,f.samples.value=d,f.weights.value=h,f.latitudinal.value=s==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-A;const U=this._sizeLods[i],T=3*U*(i>w-Xi?i-w+Xi:0),y=4*(this._cubeSize-U);Qs(t,T,y,3*U,2*U),o.setRenderTarget(t),o.render(u,jo)}}function xv(n){const e=[],t=[],A=[];let i=n;const r=n-Xi+1+vf.length;for(let s=0;s<r;s++){const a=Math.pow(2,i);t.push(a);let o=1/a;s>n-Xi?o=vf[s-n+Xi-1]:s===0&&(o=0),A.push(o);const c=1/(a-2),l=-c,u=1+c,f=[l,l,u,l,u,u,l,l,u,u,l,u],p=6,g=6,m=3,d=2,h=1,_=new Float32Array(m*g*p),w=new Float32Array(d*g*p),U=new Float32Array(h*g*p);for(let y=0;y<p;y++){const S=y%3*2/3-1,L=y>2?0:-1,x=[S,L,0,S+2/3,L,0,S+2/3,L+1,0,S,L,0,S+2/3,L+1,0,S,L+1,0];_.set(x,m*g*y),w.set(f,d*g*y);const C=[y,y,y,y,y,y];U.set(C,h*g*y)}const T=new Nt;T.setAttribute("position",new Ut(_,m)),T.setAttribute("uv",new Ut(w,d)),T.setAttribute("faceIndex",new Ut(U,h)),e.push(T),i>Xi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:A}}function Ef(n,e,t){const A=new Nn(n,e,t);return A.texture.mapping=lo,A.texture.name="PMREM.cubeUv",A.scissorTest=!0,A}function Qs(n,e,t,A,i){n.viewport.set(e,t,A,i),n.scissor.set(e,t,A,i)}function Ev(n,e,t){const A=new Float32Array($n),i=new Q(0,1,0);return new zt({name:"SphericalGaussianBlur",defines:{n:$n,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:A},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Cu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function yf(){return new zt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function Uf(){return new zt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:on,depthTest:!1,depthWrite:!1})}function Cu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yv(n){let e=new WeakMap,t=null;function A(a){if(a&&a.isTexture){const o=a.mapping,c=o===Kl||o===zl,l=o===sr||o===ar;if(c||l){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new xf(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return c&&p&&p.height>0||l&&p&&i(p)?(t===null&&(t=new xf(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let o=0;const c=6;for(let l=0;l<c;l++)a[l]!==void 0&&o++;return o===c}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:A,dispose:s}}function Uv(n){const e={};function t(A){if(e[A]!==void 0)return e[A];let i;switch(A){case"WEBGL_depth_texture":i=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=n.getExtension(A)}return e[A]=i,i}return{has:function(A){return t(A)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(A){const i=t(A);return i===null&&kr("THREE.WebGLRenderer: "+A+" extension not supported."),i}}}function Sv(n,e,t,A){const i={},r=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const m=f.morphAttributes[g];for(let d=0,h=m.length;d<h;d++)e.remove(m[d])}f.removeEventListener("dispose",s),delete i[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),A.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",s),i[f.id]=!0,t.memory.geometries++),f}function o(u){const f=u.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const m=p[g];for(let d=0,h=m.length;d<h;d++)e.update(m[d],n.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,g=u.attributes.position;let m=0;if(p!==null){const _=p.array;m=p.version;for(let w=0,U=_.length;w<U;w+=3){const T=_[w+0],y=_[w+1],S=_[w+2];f.push(T,y,y,S,S,T)}}else if(g!==void 0){const _=g.array;m=g.version;for(let w=0,U=_.length/3-1;w<U;w+=3){const T=w+0,y=w+1,S=w+2;f.push(T,y,y,S,S,T)}}else return;const d=new(np(f)?op:ap)(f,1);d.version=m;const h=r.get(u);h&&e.remove(h),r.set(u,d)}function l(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:o,getWireframeAttribute:l}}function Mv(n,e,t){let A;function i(f){A=f}let r,s;function a(f){r=f.type,s=f.bytesPerElement}function o(f,p){n.drawElements(A,p,r,f*s),t.update(p,A,1)}function c(f,p,g){g!==0&&(n.drawElementsInstanced(A,p,r,f*s,g),t.update(p,A,g))}function l(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(A,p,0,r,f,0,g);let d=0;for(let h=0;h<g;h++)d+=p[h];t.update(d,A,1)}function u(f,p,g,m){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<f.length;h++)c(f[h]/s,p[h],m[h]);else{d.multiDrawElementsInstancedWEBGL(A,p,0,r,f,0,m,0,g);let h=0;for(let _=0;_<g;_++)h+=p[_];for(let _=0;_<m.length;_++)t.update(h,A,m[_])}}this.setMode=i,this.setIndex=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function bv(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function A(r,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:A}}function Fv(n,e,t){const A=new WeakMap,i=new ft;function r(s,a,o){const c=s.morphTargetInfluences,l=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=l!==void 0?l.length:0;let f=A.get(a);if(f===void 0||f.count!==u){let x=function(){S.dispose(),A.delete(a),a.removeEventListener("dispose",x)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let w=0;p===!0&&(w=1),g===!0&&(w=2),m===!0&&(w=3);let U=a.attributes.position.count*w,T=1;U>e.maxTextureSize&&(T=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);const y=new Float32Array(U*T*4*u),S=new rp(y,U,T,u);S.type=sn,S.needsUpdate=!0;const L=w*4;for(let C=0;C<u;C++){const I=d[C],W=h[C],H=_[C],z=U*T*4*C;for(let Z=0;Z<I.count;Z++){const K=Z*L;p===!0&&(i.fromBufferAttribute(I,Z),y[z+K+0]=i.x,y[z+K+1]=i.y,y[z+K+2]=i.z,y[z+K+3]=0),g===!0&&(i.fromBufferAttribute(W,Z),y[z+K+4]=i.x,y[z+K+5]=i.y,y[z+K+6]=i.z,y[z+K+7]=0),m===!0&&(i.fromBufferAttribute(H,Z),y[z+K+8]=i.x,y[z+K+9]=i.y,y[z+K+10]=i.z,y[z+K+11]=H.itemSize===4?i.w:1)}}f={count:u,texture:S,size:new Ue(U,T)},A.set(a,f),a.addEventListener("dispose",x)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const g=a.morphTargetsRelative?1:1-p;o.getUniforms().setValue(n,"morphTargetBaseInfluence",g),o.getUniforms().setValue(n,"morphTargetInfluences",c)}o.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),o.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Tv(n,e,t,A){let i=new WeakMap;function r(o){const c=A.render.frame,l=o.geometry,u=e.get(o,l);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),o.isInstancedMesh&&(o.hasEventListener("dispose",a)===!1&&o.addEventListener("dispose",a),i.get(o)!==c&&(t.update(o.instanceMatrix,n.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,n.ARRAY_BUFFER),i.set(o,c))),o.isSkinnedMesh){const f=o.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function s(){i=new WeakMap}function a(o){const c=o.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:s}}class pp extends sA{constructor(e,t,A,i,r,s,a,o,c,l=ji){if(l!==ji&&l!==lr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");A===void 0&&l===ji&&(A=ui),A===void 0&&l===lr&&(A=or),super(null,i,r,s,a,o,l,A,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:MA,this.minFilter=o!==void 0?o:MA,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const gp=new sA,Sf=new pp(1,1),mp=new rp,Bp=new B0,wp=new fp,Mf=[],bf=[],Ff=new Float32Array(16),Tf=new Float32Array(9),If=new Float32Array(4);function dr(n,e,t){const A=n[0];if(A<=0||A>0)return n;const i=e*t;let r=Mf[i];if(r===void 0&&(r=new Float32Array(i),Mf[i]=r),e!==0){A.toArray(r,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(r,a)}return r}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,A=n.length;t<A;t++)if(n[t]!==e[t])return!1;return!0}function Rt(n,e){for(let t=0,A=e.length;t<A;t++)n[t]=e[t]}function uo(n,e){let t=bf[e];t===void 0&&(t=new Int32Array(e),bf[e]=t);for(let A=0;A!==e;++A)t[A]=n.allocateTextureUnit();return t}function Iv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Qv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Rt(t,e)}}function Lv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Rt(t,e)}}function Rv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Rt(t,e)}}function Dv(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Rt(t,e)}else{if(Lt(t,A))return;If.set(A),n.uniformMatrix2fv(this.addr,!1,If),Rt(t,A)}}function Pv(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Rt(t,e)}else{if(Lt(t,A))return;Tf.set(A),n.uniformMatrix3fv(this.addr,!1,Tf),Rt(t,A)}}function Hv(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Rt(t,e)}else{if(Lt(t,A))return;Ff.set(A),n.uniformMatrix4fv(this.addr,!1,Ff),Rt(t,A)}}function Nv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ov(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Rt(t,e)}}function Gv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Rt(t,e)}}function Vv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Rt(t,e)}}function kv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Kv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Rt(t,e)}}function zv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Rt(t,e)}}function Wv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Rt(t,e)}}function Xv(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i);let r;this.type===n.SAMPLER_2D_SHADOW?(Sf.compareFunction=Ap,r=Sf):r=gp,t.setTexture2D(e||r,i)}function Yv(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture3D(e||Bp,i)}function Jv(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTextureCube(e||wp,i)}function Zv(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture2DArray(e||mp,i)}function qv(n){switch(n){case 5126:return Iv;case 35664:return Qv;case 35665:return Lv;case 35666:return Rv;case 35674:return Dv;case 35675:return Pv;case 35676:return Hv;case 5124:case 35670:return Nv;case 35667:case 35671:return Ov;case 35668:case 35672:return Gv;case 35669:case 35673:return Vv;case 5125:return kv;case 36294:return Kv;case 36295:return zv;case 36296:return Wv;case 35678:case 36198:case 36298:case 36306:case 35682:return Xv;case 35679:case 36299:case 36307:return Yv;case 35680:case 36300:case 36308:case 36293:return Jv;case 36289:case 36303:case 36311:case 36292:return Zv}}function jv(n,e){n.uniform1fv(this.addr,e)}function $v(n,e){const t=dr(e,this.size,2);n.uniform2fv(this.addr,t)}function eC(n,e){const t=dr(e,this.size,3);n.uniform3fv(this.addr,t)}function tC(n,e){const t=dr(e,this.size,4);n.uniform4fv(this.addr,t)}function AC(n,e){const t=dr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function nC(n,e){const t=dr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function iC(n,e){const t=dr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function rC(n,e){n.uniform1iv(this.addr,e)}function sC(n,e){n.uniform2iv(this.addr,e)}function aC(n,e){n.uniform3iv(this.addr,e)}function oC(n,e){n.uniform4iv(this.addr,e)}function lC(n,e){n.uniform1uiv(this.addr,e)}function cC(n,e){n.uniform2uiv(this.addr,e)}function uC(n,e){n.uniform3uiv(this.addr,e)}function fC(n,e){n.uniform4uiv(this.addr,e)}function hC(n,e,t){const A=this.cache,i=e.length,r=uo(t,i);Lt(A,r)||(n.uniform1iv(this.addr,r),Rt(A,r));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||gp,r[s])}function dC(n,e,t){const A=this.cache,i=e.length,r=uo(t,i);Lt(A,r)||(n.uniform1iv(this.addr,r),Rt(A,r));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Bp,r[s])}function pC(n,e,t){const A=this.cache,i=e.length,r=uo(t,i);Lt(A,r)||(n.uniform1iv(this.addr,r),Rt(A,r));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||wp,r[s])}function gC(n,e,t){const A=this.cache,i=e.length,r=uo(t,i);Lt(A,r)||(n.uniform1iv(this.addr,r),Rt(A,r));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||mp,r[s])}function mC(n){switch(n){case 5126:return jv;case 35664:return $v;case 35665:return eC;case 35666:return tC;case 35674:return AC;case 35675:return nC;case 35676:return iC;case 5124:case 35670:return rC;case 35667:case 35671:return sC;case 35668:case 35672:return aC;case 35669:case 35673:return oC;case 5125:return lC;case 36294:return cC;case 36295:return uC;case 36296:return fC;case 35678:case 36198:case 36298:case 36306:case 35682:return hC;case 35679:case 36299:case 36307:return dC;case 35680:case 36300:case 36308:case 36293:return pC;case 36289:case 36303:case 36311:case 36292:return gC}}class BC{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.setValue=qv(t.type)}}class wC{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mC(t.type)}}class vC{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,A){const i=this.seq;for(let r=0,s=i.length;r!==s;++r){const a=i[r];a.setValue(e,t[a.id],A)}}}const nl=/(\w+)(\])?(\[|\.)?/g;function Qf(n,e){n.seq.push(e),n.map[e.id]=e}function CC(n,e,t){const A=n.name,i=A.length;for(nl.lastIndex=0;;){const r=nl.exec(A),s=nl.lastIndex;let a=r[1];const o=r[2]==="]",c=r[3];if(o&&(a=a|0),c===void 0||c==="["&&s+2===i){Qf(t,c===void 0?new BC(a,n,e):new wC(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new vC(a),Qf(t,u)),t=u}}}class ya{constructor(e,t){this.seq=[],this.map={};const A=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<A;++i){const r=e.getActiveUniform(t,i),s=e.getUniformLocation(t,r.name);CC(r,s,this)}}setValue(e,t,A,i){const r=this.map[t];r!==void 0&&r.setValue(e,A,i)}setOptional(e,t,A){const i=t[A];i!==void 0&&this.setValue(e,A,i)}static upload(e,t,A,i){for(let r=0,s=t.length;r!==s;++r){const a=t[r],o=A[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,i)}}static seqWithValue(e,t){const A=[];for(let i=0,r=e.length;i!==r;++i){const s=e[i];s.id in t&&A.push(s)}return A}}function Lf(n,e,t){const A=n.createShader(e);return n.shaderSource(A,t),n.compileShader(A),A}const _C=37297;let xC=0;function EC(n,e){const t=n.split(`
`),A=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=i;s<r;s++){const a=s+1;A.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return A.join(`
`)}function yC(n){const e=At.getPrimaries(At.workingColorSpace),t=At.getPrimaries(n);let A;switch(e===t?A="":e===Da&&t===Ra?A="LinearDisplayP3ToLinearSRGB":e===Ra&&t===Da&&(A="LinearSRGBToLinearDisplayP3"),n){case Vn:case co:return[A,"LinearTransferOETF"];case PA:case Bu:return[A,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[A,"LinearTransferOETF"]}}function Rf(n,e,t){const A=n.getShaderParameter(e,n.COMPILE_STATUS),i=n.getShaderInfoLog(e).trim();if(A&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const s=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+EC(n.getShaderSource(e),s)}else return i}function UC(n,e){const t=yC(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function SC(n,e){let t;switch(e){case zm:t="Linear";break;case Wm:t="Reinhard";break;case Xm:t="OptimizedCineon";break;case Ym:t="ACESFilmic";break;case Zm:t="AgX";break;case qm:t="Neutral";break;case Jm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ls=new Q;function MC(){At.getLuminanceCoefficients(Ls);const n=Ls.x.toFixed(4),e=Ls.y.toFixed(4),t=Ls.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bC(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qr).join(`
`)}function FC(n){const e=[];for(const t in n){const A=n[t];A!==!1&&e.push("#define "+t+" "+A)}return e.join(`
`)}function TC(n,e){const t={},A=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let i=0;i<A;i++){const r=n.getActiveAttrib(e,i),s=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[s]={type:r.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function Qr(n){return n!==""}function Df(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Pf(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const IC=/^[ \t]*#include +<([\w\d./]+)>/gm;function Cc(n){return n.replace(IC,LC)}const QC=new Map;function LC(n,e){let t=ke[e];if(t===void 0){const A=QC.get(e);if(A!==void 0)t=ke[A],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,A);else throw new Error("Can not resolve #include <"+e+">")}return Cc(t)}const RC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hf(n){return n.replace(RC,DC)}function DC(n,e,t,A){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=A.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Nf(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function PC(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Vd?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===mm?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===tn&&(e="SHADOWMAP_TYPE_VSM"),e}function HC(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case sr:case ar:e="ENVMAP_TYPE_CUBE";break;case lo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function NC(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ar:e="ENVMAP_MODE_REFRACTION";break}return e}function OC(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case kd:e="ENVMAP_BLENDING_MULTIPLY";break;case km:e="ENVMAP_BLENDING_MIX";break;case Km:e="ENVMAP_BLENDING_ADD";break}return e}function GC(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,A=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:A,maxMip:t}}function VC(n,e,t,A){const i=n.getContext(),r=t.defines;let s=t.vertexShader,a=t.fragmentShader;const o=PC(t),c=HC(t),l=NC(t),u=OC(t),f=GC(t),p=bC(t),g=FC(r),m=i.createProgram();let d,h,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),d.length>0&&(d+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),h.length>0&&(h+=`
`)):(d=[Nf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qr).join(`
`),h=[Nf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ln?"#define TONE_MAPPING":"",t.toneMapping!==Ln?ke.tonemapping_pars_fragment:"",t.toneMapping!==Ln?SC("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,UC("linearToOutputTexel",t.outputColorSpace),MC(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qr).join(`
`)),s=Cc(s),s=Df(s,t),s=Pf(s,t),a=Cc(a),a=Df(a,t),a=Pf(a,t),s=Hf(s),a=Hf(a),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,d=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,h=["#define varying in",t.glslVersion===$u?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===$u?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const w=_+d+s,U=_+h+a,T=Lf(i,i.VERTEX_SHADER,w),y=Lf(i,i.FRAGMENT_SHADER,U);i.attachShader(m,T),i.attachShader(m,y),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function S(I){if(n.debug.checkShaderErrors){const W=i.getProgramInfoLog(m).trim(),H=i.getShaderInfoLog(T).trim(),z=i.getShaderInfoLog(y).trim();let Z=!0,K=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(i,m,T,y);else{const q=Rf(i,T,"vertex"),Y=Rf(i,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+W+`
`+q+`
`+Y)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(H===""||z==="")&&(K=!1);K&&(I.diagnostics={runnable:Z,programLog:W,vertexShader:{log:H,prefix:d},fragmentShader:{log:z,prefix:h}})}i.deleteShader(T),i.deleteShader(y),L=new ya(i,m),x=TC(i,m)}let L;this.getUniforms=function(){return L===void 0&&S(this),L};let x;this.getAttributes=function(){return x===void 0&&S(this),x};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(m,_C)),C},this.destroy=function(){A.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=xC++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=y,this}let kC=0;class KC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,A=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(A),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const A of t)A.usedTimes--,A.usedTimes===0&&this.shaderCache.delete(A.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let A=t.get(e);return A===void 0&&(A=new Set,t.set(e,A)),A}_getShaderStage(e){const t=this.shaderCache;let A=t.get(e);return A===void 0&&(A=new zC(e),t.set(e,A)),A}}class zC{constructor(e){this.id=kC++,this.code=e,this.usedTimes=0}}function WC(n,e,t,A,i,r,s){const a=new wu,o=new KC,c=new Set,l=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return c.add(x),x===0?"uv":`uv${x}`}function d(x,C,I,W,H){const z=W.fog,Z=H.geometry,K=x.isMeshStandardMaterial?W.environment:null,q=(x.isMeshStandardMaterial?t:e).get(x.envMap||K),Y=q&&q.mapping===lo?q.image.height:null,se=g[x.type];x.precision!==null&&(p=i.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const ae=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,pe=ae!==void 0?ae.length:0;let Pe=0;Z.morphAttributes.position!==void 0&&(Pe=1),Z.morphAttributes.normal!==void 0&&(Pe=2),Z.morphAttributes.color!==void 0&&(Pe=3);let Ge,J,$,fe;if(se){const Je=GA[se];Ge=Je.vertexShader,J=Je.fragmentShader}else Ge=x.vertexShader,J=x.fragmentShader,o.update(x),$=o.getVertexShaderID(x),fe=o.getFragmentShaderID(x);const ce=n.getRenderTarget(),Ne=H.isInstancedMesh===!0,Ve=H.isBatchedMesh===!0,ze=!!x.map,lt=!!x.matcap,F=!!q,pt=!!x.aoMap,Ze=!!x.lightMap,qe=!!x.bumpMap,_e=!!x.normalMap,gt=!!x.displacementMap,Re=!!x.emissiveMap,He=!!x.metalnessMap,b=!!x.roughnessMap,v=x.anisotropy>0,k=x.clearcoat>0,ee=x.dispersion>0,Ae=x.iridescence>0,j=x.sheen>0,Se=x.transmission>0,oe=v&&!!x.anisotropyMap,ge=k&&!!x.clearcoatMap,Oe=k&&!!x.clearcoatNormalMap,ie=k&&!!x.clearcoatRoughnessMap,me=Ae&&!!x.iridescenceMap,Xe=Ae&&!!x.iridescenceThicknessMap,be=j&&!!x.sheenColorMap,Be=j&&!!x.sheenRoughnessMap,Ie=!!x.specularMap,De=!!x.specularColorMap,ht=!!x.specularIntensityMap,B=Se&&!!x.transmissionMap,N=Se&&!!x.thicknessMap,O=!!x.gradientMap,X=!!x.alphaMap,te=x.alphaTest>0,xe=!!x.alphaHash,Qe=!!x.extensions;let wt=Ln;x.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(wt=n.toneMapping);const Tt={shaderID:se,shaderType:x.type,shaderName:x.name,vertexShader:Ge,fragmentShader:J,defines:x.defines,customVertexShaderID:$,customFragmentShaderID:fe,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Ve,batchingColor:Ve&&H._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&H.instanceColor!==null,instancingMorph:Ne&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Vn,alphaToCoverage:!!x.alphaToCoverage,map:ze,matcap:lt,envMap:F,envMapMode:F&&q.mapping,envMapCubeUVHeight:Y,aoMap:pt,lightMap:Ze,bumpMap:qe,normalMap:_e,displacementMap:f&&gt,emissiveMap:Re,normalMapObjectSpace:_e&&x.normalMapType===t0,normalMapTangentSpace:_e&&x.normalMapType===tp,metalnessMap:He,roughnessMap:b,anisotropy:v,anisotropyMap:oe,clearcoat:k,clearcoatMap:ge,clearcoatNormalMap:Oe,clearcoatRoughnessMap:ie,dispersion:ee,iridescence:Ae,iridescenceMap:me,iridescenceThicknessMap:Xe,sheen:j,sheenColorMap:be,sheenRoughnessMap:Be,specularMap:Ie,specularColorMap:De,specularIntensityMap:ht,transmission:Se,transmissionMap:B,thicknessMap:N,gradientMap:O,opaque:x.transparent===!1&&x.blending===qi&&x.alphaToCoverage===!1,alphaMap:X,alphaTest:te,alphaHash:xe,combine:x.combine,mapUv:ze&&m(x.map.channel),aoMapUv:pt&&m(x.aoMap.channel),lightMapUv:Ze&&m(x.lightMap.channel),bumpMapUv:qe&&m(x.bumpMap.channel),normalMapUv:_e&&m(x.normalMap.channel),displacementMapUv:gt&&m(x.displacementMap.channel),emissiveMapUv:Re&&m(x.emissiveMap.channel),metalnessMapUv:He&&m(x.metalnessMap.channel),roughnessMapUv:b&&m(x.roughnessMap.channel),anisotropyMapUv:oe&&m(x.anisotropyMap.channel),clearcoatMapUv:ge&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:Oe&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:Xe&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:be&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Be&&m(x.sheenRoughnessMap.channel),specularMapUv:Ie&&m(x.specularMap.channel),specularColorMapUv:De&&m(x.specularColorMap.channel),specularIntensityMapUv:ht&&m(x.specularIntensityMap.channel),transmissionMapUv:B&&m(x.transmissionMap.channel),thicknessMapUv:N&&m(x.thicknessMap.channel),alphaMapUv:X&&m(x.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(_e||v),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!Z.attributes.uv&&(ze||X),fog:!!z,useFog:x.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:H.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Pe,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:wt,decodeVideoTexture:ze&&x.map.isVideoTexture===!0&&At.getTransfer(x.map.colorSpace)===ct,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===BA,flipSided:x.side===rA,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Qe&&x.extensions.clipCullDistance===!0&&A.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qe&&x.extensions.multiDraw===!0||Ve)&&A.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:A.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Tt.vertexUv1s=c.has(1),Tt.vertexUv2s=c.has(2),Tt.vertexUv3s=c.has(3),c.clear(),Tt}function h(x){const C=[];if(x.shaderID?C.push(x.shaderID):(C.push(x.customVertexShaderID),C.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)C.push(I),C.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(_(C,x),w(C,x),C.push(n.outputColorSpace)),C.push(x.customProgramCacheKey),C.join()}function _(x,C){x.push(C.precision),x.push(C.outputColorSpace),x.push(C.envMapMode),x.push(C.envMapCubeUVHeight),x.push(C.mapUv),x.push(C.alphaMapUv),x.push(C.lightMapUv),x.push(C.aoMapUv),x.push(C.bumpMapUv),x.push(C.normalMapUv),x.push(C.displacementMapUv),x.push(C.emissiveMapUv),x.push(C.metalnessMapUv),x.push(C.roughnessMapUv),x.push(C.anisotropyMapUv),x.push(C.clearcoatMapUv),x.push(C.clearcoatNormalMapUv),x.push(C.clearcoatRoughnessMapUv),x.push(C.iridescenceMapUv),x.push(C.iridescenceThicknessMapUv),x.push(C.sheenColorMapUv),x.push(C.sheenRoughnessMapUv),x.push(C.specularMapUv),x.push(C.specularColorMapUv),x.push(C.specularIntensityMapUv),x.push(C.transmissionMapUv),x.push(C.thicknessMapUv),x.push(C.combine),x.push(C.fogExp2),x.push(C.sizeAttenuation),x.push(C.morphTargetsCount),x.push(C.morphAttributeCount),x.push(C.numDirLights),x.push(C.numPointLights),x.push(C.numSpotLights),x.push(C.numSpotLightMaps),x.push(C.numHemiLights),x.push(C.numRectAreaLights),x.push(C.numDirLightShadows),x.push(C.numPointLightShadows),x.push(C.numSpotLightShadows),x.push(C.numSpotLightShadowsWithMaps),x.push(C.numLightProbes),x.push(C.shadowMapType),x.push(C.toneMapping),x.push(C.numClippingPlanes),x.push(C.numClipIntersection),x.push(C.depthPacking)}function w(x,C){a.disableAll(),C.supportsVertexTextures&&a.enable(0),C.instancing&&a.enable(1),C.instancingColor&&a.enable(2),C.instancingMorph&&a.enable(3),C.matcap&&a.enable(4),C.envMap&&a.enable(5),C.normalMapObjectSpace&&a.enable(6),C.normalMapTangentSpace&&a.enable(7),C.clearcoat&&a.enable(8),C.iridescence&&a.enable(9),C.alphaTest&&a.enable(10),C.vertexColors&&a.enable(11),C.vertexAlphas&&a.enable(12),C.vertexUv1s&&a.enable(13),C.vertexUv2s&&a.enable(14),C.vertexUv3s&&a.enable(15),C.vertexTangents&&a.enable(16),C.anisotropy&&a.enable(17),C.alphaHash&&a.enable(18),C.batching&&a.enable(19),C.dispersion&&a.enable(20),C.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.skinning&&a.enable(4),C.morphTargets&&a.enable(5),C.morphNormals&&a.enable(6),C.morphColors&&a.enable(7),C.premultipliedAlpha&&a.enable(8),C.shadowMapEnabled&&a.enable(9),C.doubleSided&&a.enable(10),C.flipSided&&a.enable(11),C.useDepthPacking&&a.enable(12),C.dithering&&a.enable(13),C.transmission&&a.enable(14),C.sheen&&a.enable(15),C.opaque&&a.enable(16),C.pointsUvs&&a.enable(17),C.decodeVideoTexture&&a.enable(18),C.alphaToCoverage&&a.enable(19),x.push(a.mask)}function U(x){const C=g[x.type];let I;if(C){const W=GA[C];I=cp.clone(W.uniforms)}else I=x.uniforms;return I}function T(x,C){let I;for(let W=0,H=l.length;W<H;W++){const z=l[W];if(z.cacheKey===C){I=z,++I.usedTimes;break}}return I===void 0&&(I=new VC(n,C,x,r),l.push(I)),I}function y(x){if(--x.usedTimes===0){const C=l.indexOf(x);l[C]=l[l.length-1],l.pop(),x.destroy()}}function S(x){o.remove(x)}function L(){o.dispose()}return{getParameters:d,getProgramCacheKey:h,getUniforms:U,acquireProgram:T,releaseProgram:y,releaseShaderCache:S,programs:l,dispose:L}}function XC(){let n=new WeakMap;function e(r){let s=n.get(r);return s===void 0&&(s={},n.set(r,s)),s}function t(r){n.delete(r)}function A(r,s,a){n.get(r)[s]=a}function i(){n=new WeakMap}return{get:e,remove:t,update:A,dispose:i}}function YC(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Of(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Gf(){const n=[];let e=0;const t=[],A=[],i=[];function r(){e=0,t.length=0,A.length=0,i.length=0}function s(u,f,p,g,m,d){let h=n[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:m,group:d},n[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=m,h.group=d),e++,h}function a(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.push(h):p.transparent===!0?i.push(h):t.push(h)}function o(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.unshift(h):p.transparent===!0?i.unshift(h):t.unshift(h)}function c(u,f){t.length>1&&t.sort(u||YC),A.length>1&&A.sort(f||Of),i.length>1&&i.sort(f||Of)}function l(){for(let u=e,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:A,transparent:i,init:r,push:a,unshift:o,finish:l,sort:c}}function JC(){let n=new WeakMap;function e(A,i){const r=n.get(A);let s;return r===void 0?(s=new Gf,n.set(A,[s])):i>=r.length?(s=new Gf,r.push(s)):s=r[i],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function ZC(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Q,color:new We};break;case"SpotLight":t={position:new Q,direction:new Q,color:new We,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Q,color:new We,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Q,skyColor:new We,groundColor:new We};break;case"RectAreaLight":t={color:new We,position:new Q,halfWidth:new Q,halfHeight:new Q};break}return n[e.id]=t,t}}}function qC(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let jC=0;function $C(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function e_(n){const e=new ZC,t=qC(),A={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)A.probe.push(new Q);const i=new Q,r=new ot,s=new ot;function a(c){let l=0,u=0,f=0;for(let x=0;x<9;x++)A.probe[x].set(0,0,0);let p=0,g=0,m=0,d=0,h=0,_=0,w=0,U=0,T=0,y=0,S=0;c.sort($C);for(let x=0,C=c.length;x<C;x++){const I=c[x],W=I.color,H=I.intensity,z=I.distance,Z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)l+=W.r*H,u+=W.g*H,f+=W.b*H;else if(I.isLightProbe){for(let K=0;K<9;K++)A.probe[K].addScaledVector(I.sh.coefficients[K],H);S++}else if(I.isDirectionalLight){const K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const q=I.shadow,Y=t.get(I);Y.shadowIntensity=q.intensity,Y.shadowBias=q.bias,Y.shadowNormalBias=q.normalBias,Y.shadowRadius=q.radius,Y.shadowMapSize=q.mapSize,A.directionalShadow[p]=Y,A.directionalShadowMap[p]=Z,A.directionalShadowMatrix[p]=I.shadow.matrix,_++}A.directional[p]=K,p++}else if(I.isSpotLight){const K=e.get(I);K.position.setFromMatrixPosition(I.matrixWorld),K.color.copy(W).multiplyScalar(H),K.distance=z,K.coneCos=Math.cos(I.angle),K.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),K.decay=I.decay,A.spot[m]=K;const q=I.shadow;if(I.map&&(A.spotLightMap[T]=I.map,T++,q.updateMatrices(I),I.castShadow&&y++),A.spotLightMatrix[m]=q.matrix,I.castShadow){const Y=t.get(I);Y.shadowIntensity=q.intensity,Y.shadowBias=q.bias,Y.shadowNormalBias=q.normalBias,Y.shadowRadius=q.radius,Y.shadowMapSize=q.mapSize,A.spotShadow[m]=Y,A.spotShadowMap[m]=Z,U++}m++}else if(I.isRectAreaLight){const K=e.get(I);K.color.copy(W).multiplyScalar(H),K.halfWidth.set(I.width*.5,0,0),K.halfHeight.set(0,I.height*.5,0),A.rectArea[d]=K,d++}else if(I.isPointLight){const K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),K.distance=I.distance,K.decay=I.decay,I.castShadow){const q=I.shadow,Y=t.get(I);Y.shadowIntensity=q.intensity,Y.shadowBias=q.bias,Y.shadowNormalBias=q.normalBias,Y.shadowRadius=q.radius,Y.shadowMapSize=q.mapSize,Y.shadowCameraNear=q.camera.near,Y.shadowCameraFar=q.camera.far,A.pointShadow[g]=Y,A.pointShadowMap[g]=Z,A.pointShadowMatrix[g]=I.shadow.matrix,w++}A.point[g]=K,g++}else if(I.isHemisphereLight){const K=e.get(I);K.skyColor.copy(I.color).multiplyScalar(H),K.groundColor.copy(I.groundColor).multiplyScalar(H),A.hemi[h]=K,h++}}d>0&&(n.has("OES_texture_float_linear")===!0?(A.rectAreaLTC1=le.LTC_FLOAT_1,A.rectAreaLTC2=le.LTC_FLOAT_2):(A.rectAreaLTC1=le.LTC_HALF_1,A.rectAreaLTC2=le.LTC_HALF_2)),A.ambient[0]=l,A.ambient[1]=u,A.ambient[2]=f;const L=A.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==m||L.rectAreaLength!==d||L.hemiLength!==h||L.numDirectionalShadows!==_||L.numPointShadows!==w||L.numSpotShadows!==U||L.numSpotMaps!==T||L.numLightProbes!==S)&&(A.directional.length=p,A.spot.length=m,A.rectArea.length=d,A.point.length=g,A.hemi.length=h,A.directionalShadow.length=_,A.directionalShadowMap.length=_,A.pointShadow.length=w,A.pointShadowMap.length=w,A.spotShadow.length=U,A.spotShadowMap.length=U,A.directionalShadowMatrix.length=_,A.pointShadowMatrix.length=w,A.spotLightMatrix.length=U+T-y,A.spotLightMap.length=T,A.numSpotLightShadowsWithMaps=y,A.numLightProbes=S,L.directionalLength=p,L.pointLength=g,L.spotLength=m,L.rectAreaLength=d,L.hemiLength=h,L.numDirectionalShadows=_,L.numPointShadows=w,L.numSpotShadows=U,L.numSpotMaps=T,L.numLightProbes=S,A.version=jC++)}function o(c,l){let u=0,f=0,p=0,g=0,m=0;const d=l.matrixWorldInverse;for(let h=0,_=c.length;h<_;h++){const w=c[h];if(w.isDirectionalLight){const U=A.directional[u];U.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),U.direction.sub(i),U.direction.transformDirection(d),u++}else if(w.isSpotLight){const U=A.spot[p];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(d),U.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),U.direction.sub(i),U.direction.transformDirection(d),p++}else if(w.isRectAreaLight){const U=A.rectArea[g];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(d),s.identity(),r.copy(w.matrixWorld),r.premultiply(d),s.extractRotation(r),U.halfWidth.set(w.width*.5,0,0),U.halfHeight.set(0,w.height*.5,0),U.halfWidth.applyMatrix4(s),U.halfHeight.applyMatrix4(s),g++}else if(w.isPointLight){const U=A.point[f];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(d),f++}else if(w.isHemisphereLight){const U=A.hemi[m];U.direction.setFromMatrixPosition(w.matrixWorld),U.direction.transformDirection(d),m++}}}return{setup:a,setupView:o,state:A}}function Vf(n){const e=new e_(n),t=[],A=[];function i(l){c.camera=l,t.length=0,A.length=0}function r(l){t.push(l)}function s(l){A.push(l)}function a(){e.setup(t)}function o(l){e.setupView(t,l)}const c={lightsArray:t,shadowsArray:A,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:o,pushLight:r,pushShadow:s}}function t_(n){let e=new WeakMap;function t(i,r=0){const s=e.get(i);let a;return s===void 0?(a=new Vf(n),e.set(i,[a])):r>=s.length?(a=new Vf(n),s.push(a)):a=s[r],a}function A(){e=new WeakMap}return{get:t,dispose:A}}class A_ extends pi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$m,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class n_ extends pi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const i_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,r_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function s_(n,e,t){let A=new vu;const i=new Ue,r=new Ue,s=new ft,a=new A_({depthPacking:e0}),o=new n_,c={},l=t.maxTextureSize,u={[Hn]:rA,[rA]:Hn,[BA]:BA},f=new zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:i_,fragmentShader:r_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Nt;g.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new Ft(g,f),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vd;let h=this.type;this.render=function(y,S,L){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||y.length===0)return;const x=n.getRenderTarget(),C=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),W=n.state;W.setBlending(on),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const H=h!==tn&&this.type===tn,z=h===tn&&this.type!==tn;for(let Z=0,K=y.length;Z<K;Z++){const q=y[Z],Y=q.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;i.copy(Y.mapSize);const se=Y.getFrameExtents();if(i.multiply(se),r.copy(Y.mapSize),(i.x>l||i.y>l)&&(i.x>l&&(r.x=Math.floor(l/se.x),i.x=r.x*se.x,Y.mapSize.x=r.x),i.y>l&&(r.y=Math.floor(l/se.y),i.y=r.y*se.y,Y.mapSize.y=r.y)),Y.map===null||H===!0||z===!0){const pe=this.type!==tn?{minFilter:MA,magFilter:MA}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Nn(i.x,i.y,pe),Y.map.texture.name=q.name+".shadowMap",Y.camera.updateProjectionMatrix()}n.setRenderTarget(Y.map),n.clear();const ae=Y.getViewportCount();for(let pe=0;pe<ae;pe++){const Pe=Y.getViewport(pe);s.set(r.x*Pe.x,r.y*Pe.y,r.x*Pe.z,r.y*Pe.w),W.viewport(s),Y.updateMatrices(q,pe),A=Y.getFrustum(),U(S,L,Y.camera,q,this.type)}Y.isPointLightShadow!==!0&&this.type===tn&&_(Y,L),Y.needsUpdate=!1}h=this.type,d.needsUpdate=!1,n.setRenderTarget(x,C,I)};function _(y,S){const L=e.update(m);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,p.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Nn(i.x,i.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(S,null,L,f,m,null),p.uniforms.shadow_pass.value=y.mapPass.texture,p.uniforms.resolution.value=y.mapSize,p.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(S,null,L,p,m,null)}function w(y,S,L,x){let C=null;const I=L.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(I!==void 0)C=I;else if(C=L.isPointLight===!0?o:a,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const W=C.uuid,H=S.uuid;let z=c[W];z===void 0&&(z={},c[W]=z);let Z=z[H];Z===void 0&&(Z=C.clone(),z[H]=Z,S.addEventListener("dispose",T)),C=Z}if(C.visible=S.visible,C.wireframe=S.wireframe,x===tn?C.side=S.shadowSide!==null?S.shadowSide:S.side:C.side=S.shadowSide!==null?S.shadowSide:u[S.side],C.alphaMap=S.alphaMap,C.alphaTest=S.alphaTest,C.map=S.map,C.clipShadows=S.clipShadows,C.clippingPlanes=S.clippingPlanes,C.clipIntersection=S.clipIntersection,C.displacementMap=S.displacementMap,C.displacementScale=S.displacementScale,C.displacementBias=S.displacementBias,C.wireframeLinewidth=S.wireframeLinewidth,C.linewidth=S.linewidth,L.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const W=n.properties.get(C);W.light=L}return C}function U(y,S,L,x,C){if(y.visible===!1)return;if(y.layers.test(S.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&C===tn)&&(!y.frustumCulled||A.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,y.matrixWorld);const H=e.update(y),z=y.material;if(Array.isArray(z)){const Z=H.groups;for(let K=0,q=Z.length;K<q;K++){const Y=Z[K],se=z[Y.materialIndex];if(se&&se.visible){const ae=w(y,se,x,C);y.onBeforeShadow(n,y,S,L,H,ae,Y),n.renderBufferDirect(L,null,H,ae,y,Y),y.onAfterShadow(n,y,S,L,H,ae,Y)}}}else if(z.visible){const Z=w(y,z,x,C);y.onBeforeShadow(n,y,S,L,H,Z,null),n.renderBufferDirect(L,null,H,Z,y,null),y.onAfterShadow(n,y,S,L,H,Z,null)}}const W=y.children;for(let H=0,z=W.length;H<z;H++)U(W[H],S,L,x,C)}function T(y){y.target.removeEventListener("dispose",T);for(const L in c){const x=c[L],C=y.target.uuid;C in x&&(x[C].dispose(),delete x[C])}}}function a_(n){function e(){let B=!1;const N=new ft;let O=null;const X=new ft(0,0,0,0);return{setMask:function(te){O!==te&&!B&&(n.colorMask(te,te,te,te),O=te)},setLocked:function(te){B=te},setClear:function(te,xe,Qe,wt,Tt){Tt===!0&&(te*=wt,xe*=wt,Qe*=wt),N.set(te,xe,Qe,wt),X.equals(N)===!1&&(n.clearColor(te,xe,Qe,wt),X.copy(N))},reset:function(){B=!1,O=null,X.set(-1,0,0,0)}}}function t(){let B=!1,N=null,O=null,X=null;return{setTest:function(te){te?fe(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(te){N!==te&&!B&&(n.depthMask(te),N=te)},setFunc:function(te){if(O!==te){switch(te){case Dm:n.depthFunc(n.NEVER);break;case Pm:n.depthFunc(n.ALWAYS);break;case Hm:n.depthFunc(n.LESS);break;case Qa:n.depthFunc(n.LEQUAL);break;case Nm:n.depthFunc(n.EQUAL);break;case Om:n.depthFunc(n.GEQUAL);break;case Gm:n.depthFunc(n.GREATER);break;case Vm:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}O=te}},setLocked:function(te){B=te},setClear:function(te){X!==te&&(n.clearDepth(te),X=te)},reset:function(){B=!1,N=null,O=null,X=null}}}function A(){let B=!1,N=null,O=null,X=null,te=null,xe=null,Qe=null,wt=null,Tt=null;return{setTest:function(Je){B||(Je?fe(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(Je){N!==Je&&!B&&(n.stencilMask(Je),N=Je)},setFunc:function(Je,It,xt){(O!==Je||X!==It||te!==xt)&&(n.stencilFunc(Je,It,xt),O=Je,X=It,te=xt)},setOp:function(Je,It,xt){(xe!==Je||Qe!==It||wt!==xt)&&(n.stencilOp(Je,It,xt),xe=Je,Qe=It,wt=xt)},setLocked:function(Je){B=Je},setClear:function(Je){Tt!==Je&&(n.clearStencil(Je),Tt=Je)},reset:function(){B=!1,N=null,O=null,X=null,te=null,xe=null,Qe=null,wt=null,Tt=null}}}const i=new e,r=new t,s=new A,a=new WeakMap,o=new WeakMap;let c={},l={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,_=null,w=null,U=null,T=null,y=new We(0,0,0),S=0,L=!1,x=null,C=null,I=null,W=null,H=null;const z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,K=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(q)[1]),Z=K>=1):q.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Z=K>=2);let Y=null,se={};const ae=n.getParameter(n.SCISSOR_BOX),pe=n.getParameter(n.VIEWPORT),Pe=new ft().fromArray(ae),Ge=new ft().fromArray(pe);function J(B,N,O,X){const te=new Uint8Array(4),xe=n.createTexture();n.bindTexture(B,xe),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Qe=0;Qe<O;Qe++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(N,0,n.RGBA,1,1,X,0,n.RGBA,n.UNSIGNED_BYTE,te):n.texImage2D(N+Qe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,te);return xe}const $={};$[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),s.setClear(0),fe(n.DEPTH_TEST),r.setFunc(Qa),qe(!1),_e(Yu),fe(n.CULL_FACE),pt(on);function fe(B){c[B]!==!0&&(n.enable(B),c[B]=!0)}function ce(B){c[B]!==!1&&(n.disable(B),c[B]=!1)}function Ne(B,N){return l[B]!==N?(n.bindFramebuffer(B,N),l[B]=N,B===n.DRAW_FRAMEBUFFER&&(l[n.FRAMEBUFFER]=N),B===n.FRAMEBUFFER&&(l[n.DRAW_FRAMEBUFFER]=N),!0):!1}function Ve(B,N){let O=f,X=!1;if(B){O=u.get(N),O===void 0&&(O=[],u.set(N,O));const te=B.textures;if(O.length!==te.length||O[0]!==n.COLOR_ATTACHMENT0){for(let xe=0,Qe=te.length;xe<Qe;xe++)O[xe]=n.COLOR_ATTACHMENT0+xe;O.length=te.length,X=!0}}else O[0]!==n.BACK&&(O[0]=n.BACK,X=!0);X&&n.drawBuffers(O)}function ze(B){return p!==B?(n.useProgram(B),p=B,!0):!1}const lt={[jn]:n.FUNC_ADD,[wm]:n.FUNC_SUBTRACT,[vm]:n.FUNC_REVERSE_SUBTRACT};lt[Cm]=n.MIN,lt[_m]=n.MAX;const F={[xm]:n.ZERO,[Em]:n.ONE,[ym]:n.SRC_COLOR,[Vl]:n.SRC_ALPHA,[Tm]:n.SRC_ALPHA_SATURATE,[bm]:n.DST_COLOR,[Sm]:n.DST_ALPHA,[Um]:n.ONE_MINUS_SRC_COLOR,[kl]:n.ONE_MINUS_SRC_ALPHA,[Fm]:n.ONE_MINUS_DST_COLOR,[Mm]:n.ONE_MINUS_DST_ALPHA,[Im]:n.CONSTANT_COLOR,[Qm]:n.ONE_MINUS_CONSTANT_COLOR,[Lm]:n.CONSTANT_ALPHA,[Rm]:n.ONE_MINUS_CONSTANT_ALPHA};function pt(B,N,O,X,te,xe,Qe,wt,Tt,Je){if(B===on){g===!0&&(ce(n.BLEND),g=!1);return}if(g===!1&&(fe(n.BLEND),g=!0),B!==Bm){if(B!==m||Je!==L){if((d!==jn||w!==jn)&&(n.blendEquation(n.FUNC_ADD),d=jn,w=jn),Je)switch(B){case qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cn:n.blendFunc(n.ONE,n.ONE);break;case Ju:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zu:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case cn:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Ju:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zu:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}h=null,_=null,U=null,T=null,y.set(0,0,0),S=0,m=B,L=Je}return}te=te||N,xe=xe||O,Qe=Qe||X,(N!==d||te!==w)&&(n.blendEquationSeparate(lt[N],lt[te]),d=N,w=te),(O!==h||X!==_||xe!==U||Qe!==T)&&(n.blendFuncSeparate(F[O],F[X],F[xe],F[Qe]),h=O,_=X,U=xe,T=Qe),(wt.equals(y)===!1||Tt!==S)&&(n.blendColor(wt.r,wt.g,wt.b,Tt),y.copy(wt),S=Tt),m=B,L=!1}function Ze(B,N){B.side===BA?ce(n.CULL_FACE):fe(n.CULL_FACE);let O=B.side===rA;N&&(O=!O),qe(O),B.blending===qi&&B.transparent===!1?pt(on):pt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),r.setFunc(B.depthFunc),r.setTest(B.depthTest),r.setMask(B.depthWrite),i.setMask(B.colorWrite);const X=B.stencilWrite;s.setTest(X),X&&(s.setMask(B.stencilWriteMask),s.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),s.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Re(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?fe(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function qe(B){x!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),x=B)}function _e(B){B!==pm?(fe(n.CULL_FACE),B!==C&&(B===Yu?n.cullFace(n.BACK):B===gm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),C=B}function gt(B){B!==I&&(Z&&n.lineWidth(B),I=B)}function Re(B,N,O){B?(fe(n.POLYGON_OFFSET_FILL),(W!==N||H!==O)&&(n.polygonOffset(N,O),W=N,H=O)):ce(n.POLYGON_OFFSET_FILL)}function He(B){B?fe(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function b(B){B===void 0&&(B=n.TEXTURE0+z-1),Y!==B&&(n.activeTexture(B),Y=B)}function v(B,N,O){O===void 0&&(Y===null?O=n.TEXTURE0+z-1:O=Y);let X=se[O];X===void 0&&(X={type:void 0,texture:void 0},se[O]=X),(X.type!==B||X.texture!==N)&&(Y!==O&&(n.activeTexture(O),Y=O),n.bindTexture(B,N||$[B]),X.type=B,X.texture=N)}function k(){const B=se[Y];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ee(){try{n.compressedTexImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ae(){try{n.compressedTexImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function j(){try{n.texSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Se(){try{n.texSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function oe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Oe(){try{n.texStorage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ie(){try{n.texStorage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function me(){try{n.texImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Xe(){try{n.texImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function be(B){Pe.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),Pe.copy(B))}function Be(B){Ge.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),Ge.copy(B))}function Ie(B,N){let O=o.get(N);O===void 0&&(O=new WeakMap,o.set(N,O));let X=O.get(B);X===void 0&&(X=n.getUniformBlockIndex(N,B.name),O.set(B,X))}function De(B,N){const X=o.get(N).get(B);a.get(N)!==X&&(n.uniformBlockBinding(N,X,B.__bindingPointIndex),a.set(N,X))}function ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},Y=null,se={},l={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,_=null,w=null,U=null,T=null,y=new We(0,0,0),S=0,L=!1,x=null,C=null,I=null,W=null,H=null,Pe.set(0,0,n.canvas.width,n.canvas.height),Ge.set(0,0,n.canvas.width,n.canvas.height),i.reset(),r.reset(),s.reset()}return{buffers:{color:i,depth:r,stencil:s},enable:fe,disable:ce,bindFramebuffer:Ne,drawBuffers:Ve,useProgram:ze,setBlending:pt,setMaterial:Ze,setFlipSided:qe,setCullFace:_e,setLineWidth:gt,setPolygonOffset:Re,setScissorTest:He,activeTexture:b,bindTexture:v,unbindTexture:k,compressedTexImage2D:ee,compressedTexImage3D:Ae,texImage2D:me,texImage3D:Xe,updateUBOMapping:Ie,uniformBlockBinding:De,texStorage2D:Oe,texStorage3D:ie,texSubImage2D:j,texSubImage3D:Se,compressedTexSubImage2D:oe,compressedTexSubImage3D:ge,scissor:be,viewport:Be,reset:ht}}function kf(n,e,t,A){const i=o_(A);switch(t){case Yd:return n*e;case Zd:return n*e;case qd:return n*e*2;case jd:return n*e/i.components*i.byteLength;case pu:return n*e/i.components*i.byteLength;case $d:return n*e*2/i.components*i.byteLength;case gu:return n*e*2/i.components*i.byteLength;case Jd:return n*e*3/i.components*i.byteLength;case HA:return n*e*4/i.components*i.byteLength;case mu:return n*e*4/i.components*i.byteLength;case wa:case va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ca:case _a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jl:case ql:return Math.max(n,16)*Math.max(e,8)/4;case Yl:case Zl:return Math.max(n,8)*Math.max(e,8)/2;case jl:case $l:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ec:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case tc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ac:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case nc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ic:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case rc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case sc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ac:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case oc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case lc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case cc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case uc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case fc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case hc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case dc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case xa:case pc:case gc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ep:case mc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Bc:case wc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function o_(n){switch(n){case un:case zd:return{byteLength:1,components:1};case qr:case Wd:case hr:return{byteLength:2,components:1};case hu:case du:return{byteLength:2,components:4};case ui:case fu:case sn:return{byteLength:4,components:1};case Xd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function l_(n,e,t,A,i,r,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,l=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,v){return p?new OffscreenCanvas(b,v):Ha("canvas")}function m(b,v,k){let ee=1;const Ae=He(b);if((Ae.width>k||Ae.height>k)&&(ee=k/Math.max(Ae.width,Ae.height)),ee<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const j=Math.floor(ee*Ae.width),Se=Math.floor(ee*Ae.height);u===void 0&&(u=g(j,Se));const oe=v?g(j,Se):u;return oe.width=j,oe.height=Se,oe.getContext("2d").drawImage(b,0,0,j,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Ae.width+"x"+Ae.height+") to ("+j+"x"+Se+")."),oe}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Ae.width+"x"+Ae.height+")."),b;return b}function d(b){return b.generateMipmaps&&b.minFilter!==MA&&b.minFilter!==wA}function h(b){n.generateMipmap(b)}function _(b,v,k,ee,Ae=!1){if(b!==null){if(n[b]!==void 0)return n[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let j=v;if(v===n.RED&&(k===n.FLOAT&&(j=n.R32F),k===n.HALF_FLOAT&&(j=n.R16F),k===n.UNSIGNED_BYTE&&(j=n.R8)),v===n.RED_INTEGER&&(k===n.UNSIGNED_BYTE&&(j=n.R8UI),k===n.UNSIGNED_SHORT&&(j=n.R16UI),k===n.UNSIGNED_INT&&(j=n.R32UI),k===n.BYTE&&(j=n.R8I),k===n.SHORT&&(j=n.R16I),k===n.INT&&(j=n.R32I)),v===n.RG&&(k===n.FLOAT&&(j=n.RG32F),k===n.HALF_FLOAT&&(j=n.RG16F),k===n.UNSIGNED_BYTE&&(j=n.RG8)),v===n.RG_INTEGER&&(k===n.UNSIGNED_BYTE&&(j=n.RG8UI),k===n.UNSIGNED_SHORT&&(j=n.RG16UI),k===n.UNSIGNED_INT&&(j=n.RG32UI),k===n.BYTE&&(j=n.RG8I),k===n.SHORT&&(j=n.RG16I),k===n.INT&&(j=n.RG32I)),v===n.RGB&&k===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),v===n.RGBA){const Se=Ae?La:At.getTransfer(ee);k===n.FLOAT&&(j=n.RGBA32F),k===n.HALF_FLOAT&&(j=n.RGBA16F),k===n.UNSIGNED_BYTE&&(j=Se===ct?n.SRGB8_ALPHA8:n.RGBA8),k===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),k===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function w(b,v){let k;return b?v===null||v===ui||v===or?k=n.DEPTH24_STENCIL8:v===sn?k=n.DEPTH32F_STENCIL8:v===qr&&(k=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ui||v===or?k=n.DEPTH_COMPONENT24:v===sn?k=n.DEPTH_COMPONENT32F:v===qr&&(k=n.DEPTH_COMPONENT16),k}function U(b,v){return d(b)===!0||b.isFramebufferTexture&&b.minFilter!==MA&&b.minFilter!==wA?Math.log2(Math.max(v.width,v.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?v.mipmaps.length:1}function T(b){const v=b.target;v.removeEventListener("dispose",T),S(v),v.isVideoTexture&&l.delete(v)}function y(b){const v=b.target;v.removeEventListener("dispose",y),x(v)}function S(b){const v=A.get(b);if(v.__webglInit===void 0)return;const k=b.source,ee=f.get(k);if(ee){const Ae=ee[v.__cacheKey];Ae.usedTimes--,Ae.usedTimes===0&&L(b),Object.keys(ee).length===0&&f.delete(k)}A.remove(b)}function L(b){const v=A.get(b);n.deleteTexture(v.__webglTexture);const k=b.source,ee=f.get(k);delete ee[v.__cacheKey],s.memory.textures--}function x(b){const v=A.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(v.__webglFramebuffer[ee]))for(let Ae=0;Ae<v.__webglFramebuffer[ee].length;Ae++)n.deleteFramebuffer(v.__webglFramebuffer[ee][Ae]);else n.deleteFramebuffer(v.__webglFramebuffer[ee]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[ee])}else{if(Array.isArray(v.__webglFramebuffer))for(let ee=0;ee<v.__webglFramebuffer.length;ee++)n.deleteFramebuffer(v.__webglFramebuffer[ee]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let ee=0;ee<v.__webglColorRenderbuffer.length;ee++)v.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[ee]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const k=b.textures;for(let ee=0,Ae=k.length;ee<Ae;ee++){const j=A.get(k[ee]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),s.memory.textures--),A.remove(k[ee])}A.remove(b)}let C=0;function I(){C=0}function W(){const b=C;return b>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+i.maxTextures),C+=1,b}function H(b){const v=[];return v.push(b.wrapS),v.push(b.wrapT),v.push(b.wrapR||0),v.push(b.magFilter),v.push(b.minFilter),v.push(b.anisotropy),v.push(b.internalFormat),v.push(b.format),v.push(b.type),v.push(b.generateMipmaps),v.push(b.premultiplyAlpha),v.push(b.flipY),v.push(b.unpackAlignment),v.push(b.colorSpace),v.join()}function z(b,v){const k=A.get(b);if(b.isVideoTexture&&gt(b),b.isRenderTargetTexture===!1&&b.version>0&&k.__version!==b.version){const ee=b.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ge(k,b,v);return}}t.bindTexture(n.TEXTURE_2D,k.__webglTexture,n.TEXTURE0+v)}function Z(b,v){const k=A.get(b);if(b.version>0&&k.__version!==b.version){Ge(k,b,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,k.__webglTexture,n.TEXTURE0+v)}function K(b,v){const k=A.get(b);if(b.version>0&&k.__version!==b.version){Ge(k,b,v);return}t.bindTexture(n.TEXTURE_3D,k.__webglTexture,n.TEXTURE0+v)}function q(b,v){const k=A.get(b);if(b.version>0&&k.__version!==b.version){J(k,b,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture,n.TEXTURE0+v)}const Y={[Wl]:n.REPEAT,[ti]:n.CLAMP_TO_EDGE,[Xl]:n.MIRRORED_REPEAT},se={[MA]:n.NEAREST,[jm]:n.NEAREST_MIPMAP_NEAREST,[hs]:n.NEAREST_MIPMAP_LINEAR,[wA]:n.LINEAR,[Io]:n.LINEAR_MIPMAP_NEAREST,[Ai]:n.LINEAR_MIPMAP_LINEAR},ae={[A0]:n.NEVER,[o0]:n.ALWAYS,[n0]:n.LESS,[Ap]:n.LEQUAL,[i0]:n.EQUAL,[a0]:n.GEQUAL,[r0]:n.GREATER,[s0]:n.NOTEQUAL};function pe(b,v){if(v.type===sn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===wA||v.magFilter===Io||v.magFilter===hs||v.magFilter===Ai||v.minFilter===wA||v.minFilter===Io||v.minFilter===hs||v.minFilter===Ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(b,n.TEXTURE_WRAP_S,Y[v.wrapS]),n.texParameteri(b,n.TEXTURE_WRAP_T,Y[v.wrapT]),(b===n.TEXTURE_3D||b===n.TEXTURE_2D_ARRAY)&&n.texParameteri(b,n.TEXTURE_WRAP_R,Y[v.wrapR]),n.texParameteri(b,n.TEXTURE_MAG_FILTER,se[v.magFilter]),n.texParameteri(b,n.TEXTURE_MIN_FILTER,se[v.minFilter]),v.compareFunction&&(n.texParameteri(b,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(b,n.TEXTURE_COMPARE_FUNC,ae[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===MA||v.minFilter!==hs&&v.minFilter!==Ai||v.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||A.get(v).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");n.texParameterf(b,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),A.get(v).__currentAnisotropy=v.anisotropy}}}function Pe(b,v){let k=!1;b.__webglInit===void 0&&(b.__webglInit=!0,v.addEventListener("dispose",T));const ee=v.source;let Ae=f.get(ee);Ae===void 0&&(Ae={},f.set(ee,Ae));const j=H(v);if(j!==b.__cacheKey){Ae[j]===void 0&&(Ae[j]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,k=!0),Ae[j].usedTimes++;const Se=Ae[b.__cacheKey];Se!==void 0&&(Ae[b.__cacheKey].usedTimes--,Se.usedTimes===0&&L(v)),b.__cacheKey=j,b.__webglTexture=Ae[j].texture}return k}function Ge(b,v,k){let ee=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(ee=n.TEXTURE_3D);const Ae=Pe(b,v),j=v.source;t.bindTexture(ee,b.__webglTexture,n.TEXTURE0+k);const Se=A.get(j);if(j.version!==Se.__version||Ae===!0){t.activeTexture(n.TEXTURE0+k);const oe=At.getPrimaries(At.workingColorSpace),ge=v.colorSpace===Un?null:At.getPrimaries(v.colorSpace),Oe=v.colorSpace===Un||oe===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);let ie=m(v.image,!1,i.maxTextureSize);ie=Re(v,ie);const me=r.convert(v.format,v.colorSpace),Xe=r.convert(v.type);let be=_(v.internalFormat,me,Xe,v.colorSpace,v.isVideoTexture);pe(ee,v);let Be;const Ie=v.mipmaps,De=v.isVideoTexture!==!0,ht=Se.__version===void 0||Ae===!0,B=j.dataReady,N=U(v,ie);if(v.isDepthTexture)be=w(v.format===lr,v.type),ht&&(De?t.texStorage2D(n.TEXTURE_2D,1,be,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,be,ie.width,ie.height,0,me,Xe,null));else if(v.isDataTexture)if(Ie.length>0){De&&ht&&t.texStorage2D(n.TEXTURE_2D,N,be,Ie[0].width,Ie[0].height);for(let O=0,X=Ie.length;O<X;O++)Be=Ie[O],De?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Xe,Be.data):t.texImage2D(n.TEXTURE_2D,O,be,Be.width,Be.height,0,me,Xe,Be.data);v.generateMipmaps=!1}else De?(ht&&t.texStorage2D(n.TEXTURE_2D,N,be,ie.width,ie.height),B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ie.width,ie.height,me,Xe,ie.data)):t.texImage2D(n.TEXTURE_2D,0,be,ie.width,ie.height,0,me,Xe,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){De&&ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,be,Ie[0].width,Ie[0].height,ie.depth);for(let O=0,X=Ie.length;O<X;O++)if(Be=Ie[O],v.format!==HA)if(me!==null)if(De){if(B)if(v.layerUpdates.size>0){const te=kf(Be.width,Be.height,v.format,v.type);for(const xe of v.layerUpdates){const Qe=Be.data.subarray(xe*te/Be.data.BYTES_PER_ELEMENT,(xe+1)*te/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,xe,Be.width,Be.height,1,me,Qe,0,0)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ie.depth,me,Be.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,O,be,Be.width,Be.height,ie.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else De?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ie.depth,me,Xe,Be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,O,be,Be.width,Be.height,ie.depth,0,me,Xe,Be.data)}else{De&&ht&&t.texStorage2D(n.TEXTURE_2D,N,be,Ie[0].width,Ie[0].height);for(let O=0,X=Ie.length;O<X;O++)Be=Ie[O],v.format!==HA?me!==null?De?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Be.data):t.compressedTexImage2D(n.TEXTURE_2D,O,be,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):De?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Xe,Be.data):t.texImage2D(n.TEXTURE_2D,O,be,Be.width,Be.height,0,me,Xe,Be.data)}else if(v.isDataArrayTexture)if(De){if(ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,be,ie.width,ie.height,ie.depth),B)if(v.layerUpdates.size>0){const O=kf(ie.width,ie.height,v.format,v.type);for(const X of v.layerUpdates){const te=ie.data.subarray(X*O/ie.data.BYTES_PER_ELEMENT,(X+1)*O/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,X,ie.width,ie.height,1,me,Xe,te)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,me,Xe,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,be,ie.width,ie.height,ie.depth,0,me,Xe,ie.data);else if(v.isData3DTexture)De?(ht&&t.texStorage3D(n.TEXTURE_3D,N,be,ie.width,ie.height,ie.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,me,Xe,ie.data)):t.texImage3D(n.TEXTURE_3D,0,be,ie.width,ie.height,ie.depth,0,me,Xe,ie.data);else if(v.isFramebufferTexture){if(ht)if(De)t.texStorage2D(n.TEXTURE_2D,N,be,ie.width,ie.height);else{let O=ie.width,X=ie.height;for(let te=0;te<N;te++)t.texImage2D(n.TEXTURE_2D,te,be,O,X,0,me,Xe,null),O>>=1,X>>=1}}else if(Ie.length>0){if(De&&ht){const O=He(Ie[0]);t.texStorage2D(n.TEXTURE_2D,N,be,O.width,O.height)}for(let O=0,X=Ie.length;O<X;O++)Be=Ie[O],De?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,me,Xe,Be):t.texImage2D(n.TEXTURE_2D,O,be,me,Xe,Be);v.generateMipmaps=!1}else if(De){if(ht){const O=He(ie);t.texStorage2D(n.TEXTURE_2D,N,be,O.width,O.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,Xe,ie)}else t.texImage2D(n.TEXTURE_2D,0,be,me,Xe,ie);d(v)&&h(ee),Se.__version=j.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function J(b,v,k){if(v.image.length!==6)return;const ee=Pe(b,v),Ae=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,b.__webglTexture,n.TEXTURE0+k);const j=A.get(Ae);if(Ae.version!==j.__version||ee===!0){t.activeTexture(n.TEXTURE0+k);const Se=At.getPrimaries(At.workingColorSpace),oe=v.colorSpace===Un?null:At.getPrimaries(v.colorSpace),ge=v.colorSpace===Un||Se===oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Oe=v.isCompressedTexture||v.image[0].isCompressedTexture,ie=v.image[0]&&v.image[0].isDataTexture,me=[];for(let X=0;X<6;X++)!Oe&&!ie?me[X]=m(v.image[X],!0,i.maxCubemapSize):me[X]=ie?v.image[X].image:v.image[X],me[X]=Re(v,me[X]);const Xe=me[0],be=r.convert(v.format,v.colorSpace),Be=r.convert(v.type),Ie=_(v.internalFormat,be,Be,v.colorSpace),De=v.isVideoTexture!==!0,ht=j.__version===void 0||ee===!0,B=Ae.dataReady;let N=U(v,Xe);pe(n.TEXTURE_CUBE_MAP,v);let O;if(Oe){De&&ht&&t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Ie,Xe.width,Xe.height);for(let X=0;X<6;X++){O=me[X].mipmaps;for(let te=0;te<O.length;te++){const xe=O[te];v.format!==HA?be!==null?De?B&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,0,0,xe.width,xe.height,be,xe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,Ie,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):De?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,0,0,xe.width,xe.height,be,Be,xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,Ie,xe.width,xe.height,0,be,Be,xe.data)}}}else{if(O=v.mipmaps,De&&ht){O.length>0&&N++;const X=He(me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Ie,X.width,X.height)}for(let X=0;X<6;X++)if(ie){De?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,me[X].width,me[X].height,be,Be,me[X].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,Ie,me[X].width,me[X].height,0,be,Be,me[X].data);for(let te=0;te<O.length;te++){const Qe=O[te].image[X].image;De?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,0,0,Qe.width,Qe.height,be,Be,Qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,Ie,Qe.width,Qe.height,0,be,Be,Qe.data)}}else{De?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,be,Be,me[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,Ie,be,Be,me[X]);for(let te=0;te<O.length;te++){const xe=O[te];De?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,0,0,be,Be,xe.image[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,Ie,be,Be,xe.image[X])}}}d(v)&&h(n.TEXTURE_CUBE_MAP),j.__version=Ae.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function $(b,v,k,ee,Ae,j){const Se=r.convert(k.format,k.colorSpace),oe=r.convert(k.type),ge=_(k.internalFormat,Se,oe,k.colorSpace);if(!A.get(v).__hasExternalTextures){const ie=Math.max(1,v.width>>j),me=Math.max(1,v.height>>j);Ae===n.TEXTURE_3D||Ae===n.TEXTURE_2D_ARRAY?t.texImage3D(Ae,j,ge,ie,me,v.depth,0,Se,oe,null):t.texImage2D(Ae,j,ge,ie,me,0,Se,oe,null)}t.bindFramebuffer(n.FRAMEBUFFER,b),_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,Ae,A.get(k).__webglTexture,0,qe(v)):(Ae===n.TEXTURE_2D||Ae>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Ae<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,Ae,A.get(k).__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function fe(b,v,k){if(n.bindRenderbuffer(n.RENDERBUFFER,b),v.depthBuffer){const ee=v.depthTexture,Ae=ee&&ee.isDepthTexture?ee.type:null,j=w(v.stencilBuffer,Ae),Se=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=qe(v);_e(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,oe,j,v.width,v.height):k?n.renderbufferStorageMultisample(n.RENDERBUFFER,oe,j,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,j,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Se,n.RENDERBUFFER,b)}else{const ee=v.textures;for(let Ae=0;Ae<ee.length;Ae++){const j=ee[Ae],Se=r.convert(j.format,j.colorSpace),oe=r.convert(j.type),ge=_(j.internalFormat,Se,oe,j.colorSpace),Oe=qe(v);k&&_e(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Oe,ge,v.width,v.height):_e(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Oe,ge,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ge,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ce(b,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,b),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!A.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),z(v.depthTexture,0);const ee=A.get(v.depthTexture).__webglTexture,Ae=qe(v);if(v.depthTexture.format===ji)_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(v.depthTexture.format===lr)_e(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ne(b){const v=A.get(b),k=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");ce(v.__webglFramebuffer,b)}else if(k){v.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[ee]),v.__webglDepthbuffer[ee]=n.createRenderbuffer(),fe(v.__webglDepthbuffer[ee],b,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),fe(v.__webglDepthbuffer,b,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ve(b,v,k){const ee=A.get(b);v!==void 0&&$(ee.__webglFramebuffer,b,b.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),k!==void 0&&Ne(b)}function ze(b){const v=b.texture,k=A.get(b),ee=A.get(v);b.addEventListener("dispose",y);const Ae=b.textures,j=b.isWebGLCubeRenderTarget===!0,Se=Ae.length>1;if(Se||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=v.version,s.memory.textures++),j){k.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[oe]=[];for(let ge=0;ge<v.mipmaps.length;ge++)k.__webglFramebuffer[oe][ge]=n.createFramebuffer()}else k.__webglFramebuffer[oe]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let oe=0;oe<v.mipmaps.length;oe++)k.__webglFramebuffer[oe]=n.createFramebuffer()}else k.__webglFramebuffer=n.createFramebuffer();if(Se)for(let oe=0,ge=Ae.length;oe<ge;oe++){const Oe=A.get(Ae[oe]);Oe.__webglTexture===void 0&&(Oe.__webglTexture=n.createTexture(),s.memory.textures++)}if(b.samples>0&&_e(b)===!1){k.__webglMultisampledFramebuffer=n.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let oe=0;oe<Ae.length;oe++){const ge=Ae[oe];k.__webglColorRenderbuffer[oe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,k.__webglColorRenderbuffer[oe]);const Oe=r.convert(ge.format,ge.colorSpace),ie=r.convert(ge.type),me=_(ge.internalFormat,Oe,ie,ge.colorSpace,b.isXRRenderTarget===!0),Xe=qe(b);n.renderbufferStorageMultisample(n.RENDERBUFFER,Xe,me,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+oe,n.RENDERBUFFER,k.__webglColorRenderbuffer[oe])}n.bindRenderbuffer(n.RENDERBUFFER,null),b.depthBuffer&&(k.__webglDepthRenderbuffer=n.createRenderbuffer(),fe(k.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),pe(n.TEXTURE_CUBE_MAP,v);for(let oe=0;oe<6;oe++)if(v.mipmaps&&v.mipmaps.length>0)for(let ge=0;ge<v.mipmaps.length;ge++)$(k.__webglFramebuffer[oe][ge],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ge);else $(k.__webglFramebuffer[oe],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);d(v)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let oe=0,ge=Ae.length;oe<ge;oe++){const Oe=Ae[oe],ie=A.get(Oe);t.bindTexture(n.TEXTURE_2D,ie.__webglTexture),pe(n.TEXTURE_2D,Oe),$(k.__webglFramebuffer,b,Oe,n.COLOR_ATTACHMENT0+oe,n.TEXTURE_2D,0),d(Oe)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let oe=n.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(oe=b.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,ee.__webglTexture),pe(oe,v),v.mipmaps&&v.mipmaps.length>0)for(let ge=0;ge<v.mipmaps.length;ge++)$(k.__webglFramebuffer[ge],b,v,n.COLOR_ATTACHMENT0,oe,ge);else $(k.__webglFramebuffer,b,v,n.COLOR_ATTACHMENT0,oe,0);d(v)&&h(oe),t.unbindTexture()}b.depthBuffer&&Ne(b)}function lt(b){const v=b.textures;for(let k=0,ee=v.length;k<ee;k++){const Ae=v[k];if(d(Ae)){const j=b.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Se=A.get(Ae).__webglTexture;t.bindTexture(j,Se),h(j),t.unbindTexture()}}}const F=[],pt=[];function Ze(b){if(b.samples>0){if(_e(b)===!1){const v=b.textures,k=b.width,ee=b.height;let Ae=n.COLOR_BUFFER_BIT;const j=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Se=A.get(b),oe=v.length>1;if(oe)for(let ge=0;ge<v.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ge=0;ge<v.length;ge++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(Ae|=n.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(Ae|=n.STENCIL_BUFFER_BIT)),oe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const Oe=A.get(v[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Oe,0)}n.blitFramebuffer(0,0,k,ee,0,0,k,ee,Ae,n.NEAREST),o===!0&&(F.length=0,pt.length=0,F.push(n.COLOR_ATTACHMENT0+ge),b.depthBuffer&&b.resolveDepthBuffer===!1&&(F.push(j),pt.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,pt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,F))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),oe)for(let ge=0;ge<v.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const Oe=A.get(v[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,Oe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&o){const v=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function qe(b){return Math.min(i.maxSamples,b.samples)}function _e(b){const v=A.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function gt(b){const v=s.render.frame;l.get(b)!==v&&(l.set(b,v),b.update())}function Re(b,v){const k=b.colorSpace,ee=b.format,Ae=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||k!==Vn&&k!==Un&&(At.getTransfer(k)===ct?(ee!==HA||Ae!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function He(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=I,this.setTexture2D=z,this.setTexture2DArray=Z,this.setTexture3D=K,this.setTextureCube=q,this.rebindTextures=Ve,this.setupRenderTarget=ze,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=$,this.useMultisampledRTT=_e}function c_(n,e){function t(A,i=Un){let r;const s=At.getTransfer(i);if(A===un)return n.UNSIGNED_BYTE;if(A===hu)return n.UNSIGNED_SHORT_4_4_4_4;if(A===du)return n.UNSIGNED_SHORT_5_5_5_1;if(A===Xd)return n.UNSIGNED_INT_5_9_9_9_REV;if(A===zd)return n.BYTE;if(A===Wd)return n.SHORT;if(A===qr)return n.UNSIGNED_SHORT;if(A===fu)return n.INT;if(A===ui)return n.UNSIGNED_INT;if(A===sn)return n.FLOAT;if(A===hr)return n.HALF_FLOAT;if(A===Yd)return n.ALPHA;if(A===Jd)return n.RGB;if(A===HA)return n.RGBA;if(A===Zd)return n.LUMINANCE;if(A===qd)return n.LUMINANCE_ALPHA;if(A===ji)return n.DEPTH_COMPONENT;if(A===lr)return n.DEPTH_STENCIL;if(A===jd)return n.RED;if(A===pu)return n.RED_INTEGER;if(A===$d)return n.RG;if(A===gu)return n.RG_INTEGER;if(A===mu)return n.RGBA_INTEGER;if(A===wa||A===va||A===Ca||A===_a)if(s===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(A===wa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(A===va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(A===Ca)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(A===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(A===wa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(A===va)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(A===Ca)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(A===_a)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(A===Yl||A===Jl||A===Zl||A===ql)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(A===Yl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(A===Jl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(A===Zl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(A===ql)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(A===jl||A===$l||A===ec)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(A===jl||A===$l)return s===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(A===ec)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(A===tc||A===Ac||A===nc||A===ic||A===rc||A===sc||A===ac||A===oc||A===lc||A===cc||A===uc||A===fc||A===hc||A===dc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(A===tc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(A===Ac)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(A===nc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(A===ic)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(A===rc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(A===sc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(A===ac)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(A===oc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(A===lc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(A===cc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(A===uc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(A===fc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(A===hc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(A===dc)return s===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(A===xa||A===pc||A===gc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(A===xa)return s===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(A===pc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(A===gc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(A===ep||A===mc||A===Bc||A===wc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(A===xa)return r.COMPRESSED_RED_RGTC1_EXT;if(A===mc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(A===Bc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(A===wc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return A===or?n.UNSIGNED_INT_24_8:n[A]!==void 0?n[A]:null}return{convert:t}}class u_ extends mA{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ni extends $t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const f_={type:"move"};class il{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ni,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ni,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ni,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const A of e.hand.values())this._getHandJoint(t,A)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,A){let i=null,r=null,s=null;const a=this._targetRay,o=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const m of e.hand.values()){const d=t.getJointPose(m,A),h=this._getHandJoint(c,m);d!==null&&(h.matrix.fromArray(d.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=d.radius),h.visible=d!==null}const l=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=l.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,A),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,A),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(f_)))}return a!==null&&(a.visible=i!==null),o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const A=new ni;A.matrixAutoUpdate=!1,A.visible=!1,e.joints[t.jointName]=A,e.add(A)}return e.joints[t.jointName]}}const h_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,d_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class p_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,A){if(this.texture===null){const i=new sA,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=A.depthNear||t.depthFar!=A.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,A=new zt({vertexShader:h_,fragmentShader:d_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ft(new On(20,20),A)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class g_ extends di{constructor(e,t){super();const A=this;let i=null,r=1,s=null,a="local-floor",o=1,c=null,l=null,u=null,f=null,p=null,g=null;const m=new p_,d=t.getContextAttributes();let h=null,_=null;const w=[],U=[],T=new Ue;let y=null;const S=new mA;S.layers.enable(1),S.viewport=new ft;const L=new mA;L.layers.enable(2),L.viewport=new ft;const x=[S,L],C=new u_;C.layers.enable(1),C.layers.enable(2);let I=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let $=w[J];return $===void 0&&($=new il,w[J]=$),$.getTargetRaySpace()},this.getControllerGrip=function(J){let $=w[J];return $===void 0&&($=new il,w[J]=$),$.getGripSpace()},this.getHand=function(J){let $=w[J];return $===void 0&&($=new il,w[J]=$),$.getHandSpace()};function H(J){const $=U.indexOf(J.inputSource);if($===-1)return;const fe=w[$];fe!==void 0&&(fe.update(J.inputSource,J.frame,c||s),fe.dispatchEvent({type:J.type,data:J.inputSource}))}function z(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",z),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<w.length;J++){const $=U[J];$!==null&&(U[J]=null,w[J].disconnect($))}I=null,W=null,m.reset(),e.setRenderTarget(h),p=null,f=null,u=null,i=null,_=null,Ge.stop(),A.isPresenting=!1,e.setPixelRatio(y),e.setSize(T.width,T.height,!1),A.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(h=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",z),i.addEventListener("inputsourceschange",Z),d.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(T),i.renderState.layers===void 0){const $={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,t,$),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new Nn(p.framebufferWidth,p.framebufferHeight,{format:HA,type:un,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let $=null,fe=null,ce=null;d.depth&&(ce=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=d.stencil?lr:ji,fe=d.stencil?or:ui);const Ne={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(Ne),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new Nn(f.textureWidth,f.textureHeight,{format:HA,type:un,depthTexture:new pp(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(o),c=null,s=await i.requestReferenceSpace(a),Ge.setContext(i),Ge.start(),A.isPresenting=!0,A.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(J){for(let $=0;$<J.removed.length;$++){const fe=J.removed[$],ce=U.indexOf(fe);ce>=0&&(U[ce]=null,w[ce].disconnect(fe))}for(let $=0;$<J.added.length;$++){const fe=J.added[$];let ce=U.indexOf(fe);if(ce===-1){for(let Ve=0;Ve<w.length;Ve++)if(Ve>=U.length){U.push(fe),ce=Ve;break}else if(U[Ve]===null){U[Ve]=fe,ce=Ve;break}if(ce===-1)break}const Ne=w[ce];Ne&&Ne.connect(fe)}}const K=new Q,q=new Q;function Y(J,$,fe){K.setFromMatrixPosition($.matrixWorld),q.setFromMatrixPosition(fe.matrixWorld);const ce=K.distanceTo(q),Ne=$.projectionMatrix.elements,Ve=fe.projectionMatrix.elements,ze=Ne[14]/(Ne[10]-1),lt=Ne[14]/(Ne[10]+1),F=(Ne[9]+1)/Ne[5],pt=(Ne[9]-1)/Ne[5],Ze=(Ne[8]-1)/Ne[0],qe=(Ve[8]+1)/Ve[0],_e=ze*Ze,gt=ze*qe,Re=ce/(-Ze+qe),He=Re*-Ze;$.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(He),J.translateZ(Re),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();const b=ze+Re,v=lt+Re,k=_e-He,ee=gt+(ce-He),Ae=F*lt/v*b,j=pt*lt/v*b;J.projectionMatrix.makePerspective(k,ee,Ae,j,b,v),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function se(J,$){$===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices($.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;m.texture!==null&&(J.near=m.depthNear,J.far=m.depthFar),C.near=L.near=S.near=J.near,C.far=L.far=S.far=J.far,(I!==C.near||W!==C.far)&&(i.updateRenderState({depthNear:C.near,depthFar:C.far}),I=C.near,W=C.far,S.near=I,S.far=W,L.near=I,L.far=W,S.updateProjectionMatrix(),L.updateProjectionMatrix(),J.updateProjectionMatrix());const $=J.parent,fe=C.cameras;se(C,$);for(let ce=0;ce<fe.length;ce++)se(fe[ce],$);fe.length===2?Y(C,S,L):C.projectionMatrix.copy(S.projectionMatrix),ae(J,C,$)};function ae(J,$,fe){fe===null?J.matrix.copy($.matrixWorld):(J.matrix.copy(fe.matrixWorld),J.matrix.invert(),J.matrix.multiply($.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy($.projectionMatrix),J.projectionMatrixInverse.copy($.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=vc*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(f===null&&p===null))return o},this.setFoveation=function(J){o=J,f!==null&&(f.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(C)};let pe=null;function Pe(J,$){if(l=$.getViewerPose(c||s),g=$,l!==null){const fe=l.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let ce=!1;fe.length!==C.cameras.length&&(C.cameras.length=0,ce=!0);for(let Ve=0;Ve<fe.length;Ve++){const ze=fe[Ve];let lt=null;if(p!==null)lt=p.getViewport(ze);else{const pt=u.getViewSubImage(f,ze);lt=pt.viewport,Ve===0&&(e.setRenderTargetTextures(_,pt.colorTexture,f.ignoreDepthValues?void 0:pt.depthStencilTexture),e.setRenderTarget(_))}let F=x[Ve];F===void 0&&(F=new mA,F.layers.enable(Ve),F.viewport=new ft,x[Ve]=F),F.matrix.fromArray(ze.transform.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale),F.projectionMatrix.fromArray(ze.projectionMatrix),F.projectionMatrixInverse.copy(F.projectionMatrix).invert(),F.viewport.set(lt.x,lt.y,lt.width,lt.height),Ve===0&&(C.matrix.copy(F.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),ce===!0&&C.cameras.push(F)}const Ne=i.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")){const Ve=u.getDepthInformation(fe[0]);Ve&&Ve.isValid&&Ve.texture&&m.init(e,Ve,i.renderState)}}for(let fe=0;fe<w.length;fe++){const ce=U[fe],Ne=w[fe];ce!==null&&Ne!==void 0&&Ne.update(ce,$,c||s)}pe&&pe(J,$),$.detectedPlanes&&A.dispatchEvent({type:"planesdetected",data:$}),g=null}const Ge=new hp;Ge.setAnimationLoop(Pe),this.setAnimationLoop=function(J){pe=J},this.dispose=function(){}}}const Jn=new KA,m_=new ot;function B_(n,e){function t(d,h){d.matrixAutoUpdate===!0&&d.updateMatrix(),h.value.copy(d.matrix)}function A(d,h){h.color.getRGB(d.fogColor.value,lp(n)),h.isFog?(d.fogNear.value=h.near,d.fogFar.value=h.far):h.isFogExp2&&(d.fogDensity.value=h.density)}function i(d,h,_,w,U){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(d,h):h.isMeshToonMaterial?(r(d,h),u(d,h)):h.isMeshPhongMaterial?(r(d,h),l(d,h)):h.isMeshStandardMaterial?(r(d,h),f(d,h),h.isMeshPhysicalMaterial&&p(d,h,U)):h.isMeshMatcapMaterial?(r(d,h),g(d,h)):h.isMeshDepthMaterial?r(d,h):h.isMeshDistanceMaterial?(r(d,h),m(d,h)):h.isMeshNormalMaterial?r(d,h):h.isLineBasicMaterial?(s(d,h),h.isLineDashedMaterial&&a(d,h)):h.isPointsMaterial?o(d,h,_,w):h.isSpriteMaterial?c(d,h):h.isShadowMaterial?(d.color.value.copy(h.color),d.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(d,h){d.opacity.value=h.opacity,h.color&&d.diffuse.value.copy(h.color),h.emissive&&d.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.bumpMap&&(d.bumpMap.value=h.bumpMap,t(h.bumpMap,d.bumpMapTransform),d.bumpScale.value=h.bumpScale,h.side===rA&&(d.bumpScale.value*=-1)),h.normalMap&&(d.normalMap.value=h.normalMap,t(h.normalMap,d.normalMapTransform),d.normalScale.value.copy(h.normalScale),h.side===rA&&d.normalScale.value.negate()),h.displacementMap&&(d.displacementMap.value=h.displacementMap,t(h.displacementMap,d.displacementMapTransform),d.displacementScale.value=h.displacementScale,d.displacementBias.value=h.displacementBias),h.emissiveMap&&(d.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,d.emissiveMapTransform)),h.specularMap&&(d.specularMap.value=h.specularMap,t(h.specularMap,d.specularMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest);const _=e.get(h),w=_.envMap,U=_.envMapRotation;w&&(d.envMap.value=w,Jn.copy(U),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),d.envMapRotation.value.setFromMatrix4(m_.makeRotationFromEuler(Jn)),d.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=h.reflectivity,d.ior.value=h.ior,d.refractionRatio.value=h.refractionRatio),h.lightMap&&(d.lightMap.value=h.lightMap,d.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,d.lightMapTransform)),h.aoMap&&(d.aoMap.value=h.aoMap,d.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,d.aoMapTransform))}function s(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform))}function a(d,h){d.dashSize.value=h.dashSize,d.totalSize.value=h.dashSize+h.gapSize,d.scale.value=h.scale}function o(d,h,_,w){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.size.value=h.size*_,d.scale.value=w*.5,h.map&&(d.map.value=h.map,t(h.map,d.uvTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function c(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.rotation.value=h.rotation,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function l(d,h){d.specular.value.copy(h.specular),d.shininess.value=Math.max(h.shininess,1e-4)}function u(d,h){h.gradientMap&&(d.gradientMap.value=h.gradientMap)}function f(d,h){d.metalness.value=h.metalness,h.metalnessMap&&(d.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,d.metalnessMapTransform)),d.roughness.value=h.roughness,h.roughnessMap&&(d.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,d.roughnessMapTransform)),h.envMap&&(d.envMapIntensity.value=h.envMapIntensity)}function p(d,h,_){d.ior.value=h.ior,h.sheen>0&&(d.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),d.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(d.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,d.sheenColorMapTransform)),h.sheenRoughnessMap&&(d.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,d.sheenRoughnessMapTransform))),h.clearcoat>0&&(d.clearcoat.value=h.clearcoat,d.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(d.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,d.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(d.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===rA&&d.clearcoatNormalScale.value.negate())),h.dispersion>0&&(d.dispersion.value=h.dispersion),h.iridescence>0&&(d.iridescence.value=h.iridescence,d.iridescenceIOR.value=h.iridescenceIOR,d.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(d.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,d.iridescenceMapTransform)),h.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),h.transmission>0&&(d.transmission.value=h.transmission,d.transmissionSamplerMap.value=_.texture,d.transmissionSamplerSize.value.set(_.width,_.height),h.transmissionMap&&(d.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,d.transmissionMapTransform)),d.thickness.value=h.thickness,h.thicknessMap&&(d.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=h.attenuationDistance,d.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(d.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(d.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=h.specularIntensity,d.specularColor.value.copy(h.specularColor),h.specularColorMap&&(d.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,d.specularColorMapTransform)),h.specularIntensityMap&&(d.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,d.specularIntensityMapTransform))}function g(d,h){h.matcap&&(d.matcap.value=h.matcap)}function m(d,h){const _=e.get(h).light;d.referencePosition.value.setFromMatrixPosition(_.matrixWorld),d.nearDistance.value=_.shadow.camera.near,d.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:A,refreshMaterialUniforms:i}}function w_(n,e,t,A){let i={},r={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function o(_,w){const U=w.program;A.uniformBlockBinding(_,U)}function c(_,w){let U=i[_.id];U===void 0&&(g(_),U=l(_),i[_.id]=U,_.addEventListener("dispose",d));const T=w.program;A.updateUBOMapping(_,T);const y=e.render.frame;r[_.id]!==y&&(f(_),r[_.id]=y)}function l(_){const w=u();_.__bindingPointIndex=w;const U=n.createBuffer(),T=_.__size,y=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,U),n.bufferData(n.UNIFORM_BUFFER,T,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,U),U}function u(){for(let _=0;_<a;_++)if(s.indexOf(_)===-1)return s.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const w=i[_.id],U=_.uniforms,T=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let y=0,S=U.length;y<S;y++){const L=Array.isArray(U[y])?U[y]:[U[y]];for(let x=0,C=L.length;x<C;x++){const I=L[x];if(p(I,y,x,T)===!0){const W=I.__offset,H=Array.isArray(I.value)?I.value:[I.value];let z=0;for(let Z=0;Z<H.length;Z++){const K=H[Z],q=m(K);typeof K=="number"||typeof K=="boolean"?(I.__data[0]=K,n.bufferSubData(n.UNIFORM_BUFFER,W+z,I.__data)):K.isMatrix3?(I.__data[0]=K.elements[0],I.__data[1]=K.elements[1],I.__data[2]=K.elements[2],I.__data[3]=0,I.__data[4]=K.elements[3],I.__data[5]=K.elements[4],I.__data[6]=K.elements[5],I.__data[7]=0,I.__data[8]=K.elements[6],I.__data[9]=K.elements[7],I.__data[10]=K.elements[8],I.__data[11]=0):(K.toArray(I.__data,z),z+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,W,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(_,w,U,T){const y=_.value,S=w+"_"+U;if(T[S]===void 0)return typeof y=="number"||typeof y=="boolean"?T[S]=y:T[S]=y.clone(),!0;{const L=T[S];if(typeof y=="number"||typeof y=="boolean"){if(L!==y)return T[S]=y,!0}else if(L.equals(y)===!1)return L.copy(y),!0}return!1}function g(_){const w=_.uniforms;let U=0;const T=16;for(let S=0,L=w.length;S<L;S++){const x=Array.isArray(w[S])?w[S]:[w[S]];for(let C=0,I=x.length;C<I;C++){const W=x[C],H=Array.isArray(W.value)?W.value:[W.value];for(let z=0,Z=H.length;z<Z;z++){const K=H[z],q=m(K),Y=U%T,se=Y%q.boundary,ae=Y+se;U+=se,ae!==0&&T-ae<q.storage&&(U+=T-ae),W.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=U,U+=q.storage}}}const y=U%T;return y>0&&(U+=T-y),_.__size=U,_.__cache={},this}function m(_){const w={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(w.boundary=4,w.storage=4):_.isVector2?(w.boundary=8,w.storage=8):_.isVector3||_.isColor?(w.boundary=16,w.storage=12):_.isVector4?(w.boundary=16,w.storage=16):_.isMatrix3?(w.boundary=48,w.storage=48):_.isMatrix4?(w.boundary=64,w.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),w}function d(_){const w=_.target;w.removeEventListener("dispose",d);const U=s.indexOf(w.__bindingPointIndex);s.splice(U,1),n.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function h(){for(const _ in i)n.deleteBuffer(i[_]);s=[],i={},r={}}return{bind:o,update:c,dispose:h}}class vp{constructor(e={}){const{canvas:t=u0(),context:A=null,depth:i=!0,stencil:r=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:c=!1,powerPreference:l="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(A!==null){if(typeof WebGLRenderingContext<"u"&&A instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=A.getContextAttributes().alpha}else f=s;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,d=null;const h=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=PA,this.toneMapping=Ln,this.toneMappingExposure=1;const w=this;let U=!1,T=0,y=0,S=null,L=-1,x=null;const C=new ft,I=new ft;let W=null;const H=new We(0);let z=0,Z=t.width,K=t.height,q=1,Y=null,se=null;const ae=new ft(0,0,Z,K),pe=new ft(0,0,Z,K);let Pe=!1;const Ge=new vu;let J=!1,$=!1;const fe=new ot,ce=new Q,Ne=new ft,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ze=!1;function lt(){return S===null?q:1}let F=A;function pt(E,D){return t.getContext(E,D)}try{const E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${uu}`),t.addEventListener("webglcontextlost",O,!1),t.addEventListener("webglcontextrestored",X,!1),t.addEventListener("webglcontextcreationerror",te,!1),F===null){const D="webgl2";if(F=pt(D,E),F===null)throw pt(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ze,qe,_e,gt,Re,He,b,v,k,ee,Ae,j,Se,oe,ge,Oe,ie,me,Xe,be,Be,Ie,De,ht;function B(){Ze=new Uv(F),Ze.init(),Ie=new c_(F,Ze),qe=new vv(F,Ze,e,Ie),_e=new a_(F),gt=new bv(F),Re=new XC,He=new l_(F,Ze,_e,Re,qe,Ie,gt),b=new _v(w),v=new yv(w),k=new D0(F),De=new Bv(F,k),ee=new Sv(F,k,gt,De),Ae=new Tv(F,ee,k,gt),Xe=new Fv(F,qe,He),Oe=new Cv(Re),j=new WC(w,b,v,Ze,qe,De,Oe),Se=new B_(w,Re),oe=new JC,ge=new t_(Ze),me=new mv(w,b,v,_e,Ae,f,o),ie=new s_(w,Ae,qe),ht=new w_(F,gt,qe,_e),be=new wv(F,Ze,gt),Be=new Mv(F,Ze,gt),gt.programs=j.programs,w.capabilities=qe,w.extensions=Ze,w.properties=Re,w.renderLists=oe,w.shadowMap=ie,w.state=_e,w.info=gt}B();const N=new g_(w,F);this.xr=N,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=Ze.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ze.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(E){E!==void 0&&(q=E,this.setSize(Z,K,!1))},this.getSize=function(E){return E.set(Z,K)},this.setSize=function(E,D,G=!0){if(N.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,K=D,t.width=Math.floor(E*q),t.height=Math.floor(D*q),G===!0&&(t.style.width=E+"px",t.style.height=D+"px"),this.setViewport(0,0,E,D)},this.getDrawingBufferSize=function(E){return E.set(Z*q,K*q).floor()},this.setDrawingBufferSize=function(E,D,G){Z=E,K=D,q=G,t.width=Math.floor(E*G),t.height=Math.floor(D*G),this.setViewport(0,0,E,D)},this.getCurrentViewport=function(E){return E.copy(C)},this.getViewport=function(E){return E.copy(ae)},this.setViewport=function(E,D,G,V){E.isVector4?ae.set(E.x,E.y,E.z,E.w):ae.set(E,D,G,V),_e.viewport(C.copy(ae).multiplyScalar(q).round())},this.getScissor=function(E){return E.copy(pe)},this.setScissor=function(E,D,G,V){E.isVector4?pe.set(E.x,E.y,E.z,E.w):pe.set(E,D,G,V),_e.scissor(I.copy(pe).multiplyScalar(q).round())},this.getScissorTest=function(){return Pe},this.setScissorTest=function(E){_e.setScissorTest(Pe=E)},this.setOpaqueSort=function(E){Y=E},this.setTransparentSort=function(E){se=E},this.getClearColor=function(E){return E.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor.apply(me,arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha.apply(me,arguments)},this.clear=function(E=!0,D=!0,G=!0){let V=0;if(E){let P=!1;if(S!==null){const re=S.texture.format;P=re===mu||re===gu||re===pu}if(P){const re=S.texture.type,he=re===un||re===ui||re===qr||re===or||re===hu||re===du,we=me.getClearColor(),ve=me.getClearAlpha(),Fe=we.r,Le=we.g,Me=we.b;he?(p[0]=Fe,p[1]=Le,p[2]=Me,p[3]=ve,F.clearBufferuiv(F.COLOR,0,p)):(g[0]=Fe,g[1]=Le,g[2]=Me,g[3]=ve,F.clearBufferiv(F.COLOR,0,g))}else V|=F.COLOR_BUFFER_BIT}D&&(V|=F.DEPTH_BUFFER_BIT),G&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",O,!1),t.removeEventListener("webglcontextrestored",X,!1),t.removeEventListener("webglcontextcreationerror",te,!1),oe.dispose(),ge.dispose(),Re.dispose(),b.dispose(),v.dispose(),Ae.dispose(),De.dispose(),ht.dispose(),j.dispose(),N.dispose(),N.removeEventListener("sessionstart",xt),N.removeEventListener("sessionend",hn),Ot.stop()};function O(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),U=!0}function X(){console.log("THREE.WebGLRenderer: Context Restored."),U=!1;const E=gt.autoReset,D=ie.enabled,G=ie.autoUpdate,V=ie.needsUpdate,P=ie.type;B(),gt.autoReset=E,ie.enabled=D,ie.autoUpdate=G,ie.needsUpdate=V,ie.type=P}function te(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function xe(E){const D=E.target;D.removeEventListener("dispose",xe),Qe(D)}function Qe(E){wt(E),Re.remove(E)}function wt(E){const D=Re.get(E).programs;D!==void 0&&(D.forEach(function(G){j.releaseProgram(G)}),E.isShaderMaterial&&j.releaseShaderCache(E))}this.renderBufferDirect=function(E,D,G,V,P,re){D===null&&(D=Ve);const he=P.isMesh&&P.matrixWorld.determinant()<0,we=lm(E,D,G,V,P);_e.setMaterial(V,he);let ve=G.index,Fe=1;if(V.wireframe===!0){if(ve=ee.getWireframeAttribute(G),ve===void 0)return;Fe=2}const Le=G.drawRange,Me=G.attributes.position;let je=Le.start*Fe,mt=(Le.start+Le.count)*Fe;re!==null&&(je=Math.max(je,re.start*Fe),mt=Math.min(mt,(re.start+re.count)*Fe)),ve!==null?(je=Math.max(je,0),mt=Math.min(mt,ve.count)):Me!=null&&(je=Math.max(je,0),mt=Math.min(mt,Me.count));const Bt=mt-je;if(Bt<0||Bt===1/0)return;De.setup(P,V,we,G,ve);let lA,$e=be;if(ve!==null&&(lA=k.get(ve),$e=Be,$e.setIndex(lA)),P.isMesh)V.wireframe===!0?(_e.setLineWidth(V.wireframeLinewidth*lt()),$e.setMode(F.LINES)):$e.setMode(F.TRIANGLES);else if(P.isLine){let ye=V.linewidth;ye===void 0&&(ye=1),_e.setLineWidth(ye*lt()),P.isLineSegments?$e.setMode(F.LINES):P.isLineLoop?$e.setMode(F.LINE_LOOP):$e.setMode(F.LINE_STRIP)}else P.isPoints?$e.setMode(F.POINTS):P.isSprite&&$e.setMode(F.TRIANGLES);if(P.isBatchedMesh)if(P._multiDrawInstances!==null)$e.renderMultiDrawInstances(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount,P._multiDrawInstances);else if(Ze.get("WEBGL_multi_draw"))$e.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else{const ye=P._multiDrawStarts,Gt=P._multiDrawCounts,et=P._multiDrawCount,TA=ve?k.get(ve).bytesPerElement:1,gi=Re.get(V).currentProgram.getUniforms();for(let cA=0;cA<et;cA++)gi.setValue(F,"_gl_DrawID",cA),$e.render(ye[cA]/TA,Gt[cA])}else if(P.isInstancedMesh)$e.renderInstances(je,Bt,P.count);else if(G.isInstancedBufferGeometry){const ye=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Gt=Math.min(G.instanceCount,ye);$e.renderInstances(je,Bt,Gt)}else $e.render(je,Bt)};function Tt(E,D,G){E.transparent===!0&&E.side===BA&&E.forceSinglePass===!1?(E.side=rA,E.needsUpdate=!0,fs(E,D,G),E.side=Hn,E.needsUpdate=!0,fs(E,D,G),E.side=BA):fs(E,D,G)}this.compile=function(E,D,G=null){G===null&&(G=E),d=ge.get(G),d.init(D),_.push(d),G.traverseVisible(function(P){P.isLight&&P.layers.test(D.layers)&&(d.pushLight(P),P.castShadow&&d.pushShadow(P))}),E!==G&&E.traverseVisible(function(P){P.isLight&&P.layers.test(D.layers)&&(d.pushLight(P),P.castShadow&&d.pushShadow(P))}),d.setupLights();const V=new Set;return E.traverse(function(P){const re=P.material;if(re)if(Array.isArray(re))for(let he=0;he<re.length;he++){const we=re[he];Tt(we,G,P),V.add(we)}else Tt(re,G,P),V.add(re)}),_.pop(),d=null,V},this.compileAsync=function(E,D,G=null){const V=this.compile(E,D,G);return new Promise(P=>{function re(){if(V.forEach(function(he){Re.get(he).currentProgram.isReady()&&V.delete(he)}),V.size===0){P(E);return}setTimeout(re,10)}Ze.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Je=null;function It(E){Je&&Je(E)}function xt(){Ot.stop()}function hn(){Ot.start()}const Ot=new hp;Ot.setAnimationLoop(It),typeof self<"u"&&Ot.setContext(self),this.setAnimationLoop=function(E){Je=E,N.setAnimationLoop(E),E===null?Ot.stop():Ot.start()},N.addEventListener("sessionstart",xt),N.addEventListener("sessionend",hn),this.render=function(E,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(N.cameraAutoUpdate===!0&&N.updateCamera(D),D=N.getCamera()),E.isScene===!0&&E.onBeforeRender(w,E,D,S),d=ge.get(E,_.length),d.init(D),_.push(d),fe.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ge.setFromProjectionMatrix(fe),$=this.localClippingEnabled,J=Oe.init(this.clippingPlanes,$),m=oe.get(E,h.length),m.init(),h.push(m),N.enabled===!0&&N.isPresenting===!0){const re=w.xr.getDepthSensingMesh();re!==null&&XA(re,D,-1/0,w.sortObjects)}XA(E,D,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(Y,se),ze=N.enabled===!1||N.isPresenting===!1||N.hasDepthSensing()===!1,ze&&me.addToRenderList(m,E),this.info.render.frame++,J===!0&&Oe.beginShadows();const G=d.state.shadowsArray;ie.render(G,E,D),J===!0&&Oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,P=m.transmissive;if(d.setupLights(),D.isArrayCamera){const re=D.cameras;if(P.length>0)for(let he=0,we=re.length;he<we;he++){const ve=re[he];gr(V,P,E,ve)}ze&&me.render(E);for(let he=0,we=re.length;he<we;he++){const ve=re[he];kn(m,E,ve,ve.viewport)}}else P.length>0&&gr(V,P,E,D),ze&&me.render(E),kn(m,E,D);S!==null&&(He.updateMultisampleRenderTarget(S),He.updateRenderTargetMipmap(S)),E.isScene===!0&&E.onAfterRender(w,E,D),De.resetDefaultState(),L=-1,x=null,_.pop(),_.length>0?(d=_[_.length-1],J===!0&&Oe.setGlobalState(w.clippingPlanes,d.state.camera)):d=null,h.pop(),h.length>0?m=h[h.length-1]:m=null};function XA(E,D,G,V){if(E.visible===!1)return;if(E.layers.test(D.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(D);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ge.intersectsSprite(E)){V&&Ne.setFromMatrixPosition(E.matrixWorld).applyMatrix4(fe);const he=Ae.update(E),we=E.material;we.visible&&m.push(E,he,we,G,Ne.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ge.intersectsObject(E))){const he=Ae.update(E),we=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ne.copy(E.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Ne.copy(he.boundingSphere.center)),Ne.applyMatrix4(E.matrixWorld).applyMatrix4(fe)),Array.isArray(we)){const ve=he.groups;for(let Fe=0,Le=ve.length;Fe<Le;Fe++){const Me=ve[Fe],je=we[Me.materialIndex];je&&je.visible&&m.push(E,he,je,G,Ne.z,Me)}}else we.visible&&m.push(E,he,we,G,Ne.z,null)}}const re=E.children;for(let he=0,we=re.length;he<we;he++)XA(re[he],D,G,V)}function kn(E,D,G,V){const P=E.opaque,re=E.transmissive,he=E.transparent;d.setupLightsView(G),J===!0&&Oe.setGlobalState(w.clippingPlanes,G),V&&_e.viewport(C.copy(V)),P.length>0&&us(P,D,G),re.length>0&&us(re,D,G),he.length>0&&us(he,D,G),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function gr(E,D,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[V.id]===void 0&&(d.state.transmissionRenderTarget[V.id]=new Nn(1,1,{generateMipmaps:!0,type:Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float")?hr:un,minFilter:Ai,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:At.workingColorSpace}));const re=d.state.transmissionRenderTarget[V.id],he=V.viewport||C;re.setSize(he.z,he.w);const we=w.getRenderTarget();w.setRenderTarget(re),w.getClearColor(H),z=w.getClearAlpha(),z<1&&w.setClearColor(16777215,.5),w.clear(),ze&&me.render(G);const ve=w.toneMapping;w.toneMapping=Ln;const Fe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),d.setupLightsView(V),J===!0&&Oe.setGlobalState(w.clippingPlanes,V),us(E,G,V),He.updateMultisampleRenderTarget(re),He.updateRenderTargetMipmap(re),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let Me=0,je=D.length;Me<je;Me++){const mt=D[Me],Bt=mt.object,lA=mt.geometry,$e=mt.material,ye=mt.group;if($e.side===BA&&Bt.layers.test(V.layers)){const Gt=$e.side;$e.side=rA,$e.needsUpdate=!0,Ku(Bt,G,V,lA,$e,ye),$e.side=Gt,$e.needsUpdate=!0,Le=!0}}Le===!0&&(He.updateMultisampleRenderTarget(re),He.updateRenderTargetMipmap(re))}w.setRenderTarget(we),w.setClearColor(H,z),Fe!==void 0&&(V.viewport=Fe),w.toneMapping=ve}function us(E,D,G){const V=D.isScene===!0?D.overrideMaterial:null;for(let P=0,re=E.length;P<re;P++){const he=E[P],we=he.object,ve=he.geometry,Fe=V===null?he.material:V,Le=he.group;we.layers.test(G.layers)&&Ku(we,D,G,ve,Fe,Le)}}function Ku(E,D,G,V,P,re){E.onBeforeRender(w,D,G,V,P,re),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),P.transparent===!0&&P.side===BA&&P.forceSinglePass===!1?(P.side=rA,P.needsUpdate=!0,w.renderBufferDirect(G,D,V,P,E,re),P.side=Hn,P.needsUpdate=!0,w.renderBufferDirect(G,D,V,P,E,re),P.side=BA):w.renderBufferDirect(G,D,V,P,E,re),E.onAfterRender(w,D,G,V,P,re)}function fs(E,D,G){D.isScene!==!0&&(D=Ve);const V=Re.get(E),P=d.state.lights,re=d.state.shadowsArray,he=P.state.version,we=j.getParameters(E,P.state,re,D,G),ve=j.getProgramCacheKey(we);let Fe=V.programs;V.environment=E.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(E.isMeshStandardMaterial?v:b).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?D.environmentRotation:E.envMapRotation,Fe===void 0&&(E.addEventListener("dispose",xe),Fe=new Map,V.programs=Fe);let Le=Fe.get(ve);if(Le!==void 0){if(V.currentProgram===Le&&V.lightsStateVersion===he)return Wu(E,we),Le}else we.uniforms=j.getUniforms(E),E.onBeforeCompile(we,w),Le=j.acquireProgram(we,ve),Fe.set(ve,Le),V.uniforms=we.uniforms;const Me=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Me.clippingPlanes=Oe.uniform),Wu(E,we),V.needsLights=um(E),V.lightsStateVersion=he,V.needsLights&&(Me.ambientLightColor.value=P.state.ambient,Me.lightProbe.value=P.state.probe,Me.directionalLights.value=P.state.directional,Me.directionalLightShadows.value=P.state.directionalShadow,Me.spotLights.value=P.state.spot,Me.spotLightShadows.value=P.state.spotShadow,Me.rectAreaLights.value=P.state.rectArea,Me.ltc_1.value=P.state.rectAreaLTC1,Me.ltc_2.value=P.state.rectAreaLTC2,Me.pointLights.value=P.state.point,Me.pointLightShadows.value=P.state.pointShadow,Me.hemisphereLights.value=P.state.hemi,Me.directionalShadowMap.value=P.state.directionalShadowMap,Me.directionalShadowMatrix.value=P.state.directionalShadowMatrix,Me.spotShadowMap.value=P.state.spotShadowMap,Me.spotLightMatrix.value=P.state.spotLightMatrix,Me.spotLightMap.value=P.state.spotLightMap,Me.pointShadowMap.value=P.state.pointShadowMap,Me.pointShadowMatrix.value=P.state.pointShadowMatrix),V.currentProgram=Le,V.uniformsList=null,Le}function zu(E){if(E.uniformsList===null){const D=E.currentProgram.getUniforms();E.uniformsList=ya.seqWithValue(D.seq,E.uniforms)}return E.uniformsList}function Wu(E,D){const G=Re.get(E);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function lm(E,D,G,V,P){D.isScene!==!0&&(D=Ve),He.resetTextureUnits();const re=D.fog,he=V.isMeshStandardMaterial?D.environment:null,we=S===null?w.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Vn,ve=(V.isMeshStandardMaterial?v:b).get(V.envMap||he),Fe=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Le=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Me=!!G.morphAttributes.position,je=!!G.morphAttributes.normal,mt=!!G.morphAttributes.color;let Bt=Ln;V.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Bt=w.toneMapping);const lA=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,$e=lA!==void 0?lA.length:0,ye=Re.get(V),Gt=d.state.lights;if(J===!0&&($===!0||E!==x)){const vA=E===x&&V.id===L;Oe.setState(V,E,vA)}let et=!1;V.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Gt.state.version||ye.outputColorSpace!==we||P.isBatchedMesh&&ye.batching===!1||!P.isBatchedMesh&&ye.batching===!0||P.isBatchedMesh&&ye.batchingColor===!0&&P.colorTexture===null||P.isBatchedMesh&&ye.batchingColor===!1&&P.colorTexture!==null||P.isInstancedMesh&&ye.instancing===!1||!P.isInstancedMesh&&ye.instancing===!0||P.isSkinnedMesh&&ye.skinning===!1||!P.isSkinnedMesh&&ye.skinning===!0||P.isInstancedMesh&&ye.instancingColor===!0&&P.instanceColor===null||P.isInstancedMesh&&ye.instancingColor===!1&&P.instanceColor!==null||P.isInstancedMesh&&ye.instancingMorph===!0&&P.morphTexture===null||P.isInstancedMesh&&ye.instancingMorph===!1&&P.morphTexture!==null||ye.envMap!==ve||V.fog===!0&&ye.fog!==re||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Oe.numPlanes||ye.numIntersection!==Oe.numIntersection)||ye.vertexAlphas!==Fe||ye.vertexTangents!==Le||ye.morphTargets!==Me||ye.morphNormals!==je||ye.morphColors!==mt||ye.toneMapping!==Bt||ye.morphTargetsCount!==$e)&&(et=!0):(et=!0,ye.__version=V.version);let TA=ye.currentProgram;et===!0&&(TA=fs(V,D,P));let gi=!1,cA=!1,bo=!1;const Et=TA.getUniforms(),dn=ye.uniforms;if(_e.useProgram(TA.program)&&(gi=!0,cA=!0,bo=!0),V.id!==L&&(L=V.id,cA=!0),gi||x!==E){Et.setValue(F,"projectionMatrix",E.projectionMatrix),Et.setValue(F,"viewMatrix",E.matrixWorldInverse);const vA=Et.map.cameraPosition;vA!==void 0&&vA.setValue(F,ce.setFromMatrixPosition(E.matrixWorld)),qe.logarithmicDepthBuffer&&Et.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Et.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,cA=!0,bo=!0)}if(P.isSkinnedMesh){Et.setOptional(F,P,"bindMatrix"),Et.setOptional(F,P,"bindMatrixInverse");const vA=P.skeleton;vA&&(vA.boneTexture===null&&vA.computeBoneTexture(),Et.setValue(F,"boneTexture",vA.boneTexture,He))}P.isBatchedMesh&&(Et.setOptional(F,P,"batchingTexture"),Et.setValue(F,"batchingTexture",P._matricesTexture,He),Et.setOptional(F,P,"batchingIdTexture"),Et.setValue(F,"batchingIdTexture",P._indirectTexture,He),Et.setOptional(F,P,"batchingColorTexture"),P._colorsTexture!==null&&Et.setValue(F,"batchingColorTexture",P._colorsTexture,He));const Fo=G.morphAttributes;if((Fo.position!==void 0||Fo.normal!==void 0||Fo.color!==void 0)&&Xe.update(P,G,TA),(cA||ye.receiveShadow!==P.receiveShadow)&&(ye.receiveShadow=P.receiveShadow,Et.setValue(F,"receiveShadow",P.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(dn.envMap.value=ve,dn.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(dn.envMapIntensity.value=D.environmentIntensity),cA&&(Et.setValue(F,"toneMappingExposure",w.toneMappingExposure),ye.needsLights&&cm(dn,bo),re&&V.fog===!0&&Se.refreshFogUniforms(dn,re),Se.refreshMaterialUniforms(dn,V,q,K,d.state.transmissionRenderTarget[E.id]),ya.upload(F,zu(ye),dn,He)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(ya.upload(F,zu(ye),dn,He),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Et.setValue(F,"center",P.center),Et.setValue(F,"modelViewMatrix",P.modelViewMatrix),Et.setValue(F,"normalMatrix",P.normalMatrix),Et.setValue(F,"modelMatrix",P.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const vA=V.uniformsGroups;for(let To=0,fm=vA.length;To<fm;To++){const Xu=vA[To];ht.update(Xu,TA),ht.bind(Xu,TA)}}return TA}function cm(E,D){E.ambientLightColor.needsUpdate=D,E.lightProbe.needsUpdate=D,E.directionalLights.needsUpdate=D,E.directionalLightShadows.needsUpdate=D,E.pointLights.needsUpdate=D,E.pointLightShadows.needsUpdate=D,E.spotLights.needsUpdate=D,E.spotLightShadows.needsUpdate=D,E.rectAreaLights.needsUpdate=D,E.hemisphereLights.needsUpdate=D}function um(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(E,D,G){Re.get(E.texture).__webglTexture=D,Re.get(E.depthTexture).__webglTexture=G;const V=Re.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=G===void 0,V.__autoAllocateDepthBuffer||Ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,D){const G=Re.get(E);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(E,D=0,G=0){S=E,T=D,y=G;let V=!0,P=null,re=!1,he=!1;if(E){const ve=Re.get(E);ve.__useDefaultFramebuffer!==void 0?(_e.bindFramebuffer(F.FRAMEBUFFER,null),V=!1):ve.__webglFramebuffer===void 0?He.setupRenderTarget(E):ve.__hasExternalTextures&&He.rebindTextures(E,Re.get(E.texture).__webglTexture,Re.get(E.depthTexture).__webglTexture);const Fe=E.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(he=!0);const Le=Re.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Le[D])?P=Le[D][G]:P=Le[D],re=!0):E.samples>0&&He.useMultisampledRTT(E)===!1?P=Re.get(E).__webglMultisampledFramebuffer:Array.isArray(Le)?P=Le[G]:P=Le,C.copy(E.viewport),I.copy(E.scissor),W=E.scissorTest}else C.copy(ae).multiplyScalar(q).floor(),I.copy(pe).multiplyScalar(q).floor(),W=Pe;if(_e.bindFramebuffer(F.FRAMEBUFFER,P)&&V&&_e.drawBuffers(E,P),_e.viewport(C),_e.scissor(I),_e.setScissorTest(W),re){const ve=Re.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+D,ve.__webglTexture,G)}else if(he){const ve=Re.get(E.texture),Fe=D||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,ve.__webglTexture,G||0,Fe)}L=-1},this.readRenderTargetPixels=function(E,D,G,V,P,re,he){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Re.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(we=we[he]),we){_e.bindFramebuffer(F.FRAMEBUFFER,we);try{const ve=E.texture,Fe=ve.format,Le=ve.type;if(!qe.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=E.width-V&&G>=0&&G<=E.height-P&&F.readPixels(D,G,V,P,Ie.convert(Fe),Ie.convert(Le),re)}finally{const ve=S!==null?Re.get(S).__webglFramebuffer:null;_e.bindFramebuffer(F.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(E,D,G,V,P,re,he){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Re.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(we=we[he]),we){_e.bindFramebuffer(F.FRAMEBUFFER,we);try{const ve=E.texture,Fe=ve.format,Le=ve.type;if(!qe.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=E.width-V&&G>=0&&G<=E.height-P){const Me=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Me),F.bufferData(F.PIXEL_PACK_BUFFER,re.byteLength,F.STREAM_READ),F.readPixels(D,G,V,P,Ie.convert(Fe),Ie.convert(Le),0),F.flush();const je=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);await f0(F,je,4);try{F.bindBuffer(F.PIXEL_PACK_BUFFER,Me),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,re)}finally{F.deleteBuffer(Me),F.deleteSync(je)}return re}}finally{const ve=S!==null?Re.get(S).__webglFramebuffer:null;_e.bindFramebuffer(F.FRAMEBUFFER,ve)}}},this.copyFramebufferToTexture=function(E,D=null,G=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-G),P=Math.floor(E.image.width*V),re=Math.floor(E.image.height*V),he=D!==null?D.x:0,we=D!==null?D.y:0;He.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,G,0,0,he,we,P,re),_e.unbindTexture()},this.copyTextureToTexture=function(E,D,G=null,V=null,P=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],D=arguments[2],P=arguments[3]||0,G=null);let re,he,we,ve,Fe,Le;G!==null?(re=G.max.x-G.min.x,he=G.max.y-G.min.y,we=G.min.x,ve=G.min.y):(re=E.image.width,he=E.image.height,we=0,ve=0),V!==null?(Fe=V.x,Le=V.y):(Fe=0,Le=0);const Me=Ie.convert(D.format),je=Ie.convert(D.type);He.setTexture2D(D,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,D.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,D.unpackAlignment);const mt=F.getParameter(F.UNPACK_ROW_LENGTH),Bt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),lA=F.getParameter(F.UNPACK_SKIP_PIXELS),$e=F.getParameter(F.UNPACK_SKIP_ROWS),ye=F.getParameter(F.UNPACK_SKIP_IMAGES),Gt=E.isCompressedTexture?E.mipmaps[P]:E.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,Gt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Gt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,we),F.pixelStorei(F.UNPACK_SKIP_ROWS,ve),E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,P,Fe,Le,re,he,Me,je,Gt.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,P,Fe,Le,Gt.width,Gt.height,Me,Gt.data):F.texSubImage2D(F.TEXTURE_2D,P,Fe,Le,re,he,Me,je,Gt),F.pixelStorei(F.UNPACK_ROW_LENGTH,mt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Bt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,lA),F.pixelStorei(F.UNPACK_SKIP_ROWS,$e),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ye),P===0&&D.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),_e.unbindTexture()},this.copyTextureToTexture3D=function(E,D,G=null,V=null,P=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,V=arguments[1]||null,E=arguments[2],D=arguments[3],P=arguments[4]||0);let re,he,we,ve,Fe,Le,Me,je,mt;const Bt=E.isCompressedTexture?E.mipmaps[P]:E.image;G!==null?(re=G.max.x-G.min.x,he=G.max.y-G.min.y,we=G.max.z-G.min.z,ve=G.min.x,Fe=G.min.y,Le=G.min.z):(re=Bt.width,he=Bt.height,we=Bt.depth,ve=0,Fe=0,Le=0),V!==null?(Me=V.x,je=V.y,mt=V.z):(Me=0,je=0,mt=0);const lA=Ie.convert(D.format),$e=Ie.convert(D.type);let ye;if(D.isData3DTexture)He.setTexture3D(D,0),ye=F.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)He.setTexture2DArray(D,0),ye=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,D.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,D.unpackAlignment);const Gt=F.getParameter(F.UNPACK_ROW_LENGTH),et=F.getParameter(F.UNPACK_IMAGE_HEIGHT),TA=F.getParameter(F.UNPACK_SKIP_PIXELS),gi=F.getParameter(F.UNPACK_SKIP_ROWS),cA=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Bt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Bt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ve),F.pixelStorei(F.UNPACK_SKIP_ROWS,Fe),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Le),E.isDataTexture||E.isData3DTexture?F.texSubImage3D(ye,P,Me,je,mt,re,he,we,lA,$e,Bt.data):D.isCompressedArrayTexture?F.compressedTexSubImage3D(ye,P,Me,je,mt,re,he,we,lA,Bt.data):F.texSubImage3D(ye,P,Me,je,mt,re,he,we,lA,$e,Bt),F.pixelStorei(F.UNPACK_ROW_LENGTH,Gt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,et),F.pixelStorei(F.UNPACK_SKIP_PIXELS,TA),F.pixelStorei(F.UNPACK_SKIP_ROWS,gi),F.pixelStorei(F.UNPACK_SKIP_IMAGES,cA),P===0&&D.generateMipmaps&&F.generateMipmap(ye),_e.unbindTexture()},this.initRenderTarget=function(E){Re.get(E).__webglFramebuffer===void 0&&He.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?He.setTextureCube(E,0):E.isData3DTexture?He.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?He.setTexture2DArray(E,0):He.setTexture2D(E,0),_e.unbindTexture()},this.resetState=function(){T=0,y=0,S=null,_e.reset(),De.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return an}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Bu?"display-p3":"srgb",t.unpackColorSpace=At.workingColorSpace===co?"display-p3":"srgb"}}class _u{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new We(e),this.density=t}clone(){return new _u(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class v_ extends $t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new KA,this.environmentIntensity=1,this.environmentRotation=new KA,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class xu extends pi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new We(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Na=new Q,Oa=new Q,Kf=new ot,xr=new ss,Rs=new rs,rl=new Q,zf=new Q;class Cp extends $t{constructor(e=new Nt,t=new xu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,A=[0];for(let i=1,r=t.count;i<r;i++)Na.fromBufferAttribute(t,i-1),Oa.fromBufferAttribute(t,i),A[i]=A[i-1],A[i]+=Na.distanceTo(Oa);e.setAttribute("lineDistance",new eA(A,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),Rs.copy(A.boundingSphere),Rs.applyMatrix4(i),Rs.radius+=r,e.ray.intersectsSphere(Rs)===!1)return;Kf.copy(i).invert(),xr.copy(e.ray).applyMatrix4(Kf);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=this.isLineSegments?2:1,l=A.index,f=A.attributes.position;if(l!==null){const p=Math.max(0,s.start),g=Math.min(l.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=c){const h=l.getX(m),_=l.getX(m+1),w=Ds(this,e,xr,o,h,_);w&&t.push(w)}if(this.isLineLoop){const m=l.getX(g-1),d=l.getX(p),h=Ds(this,e,xr,o,m,d);h&&t.push(h)}}else{const p=Math.max(0,s.start),g=Math.min(f.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=c){const h=Ds(this,e,xr,o,m,m+1);h&&t.push(h)}if(this.isLineLoop){const m=Ds(this,e,xr,o,g-1,p);m&&t.push(m)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ds(n,e,t,A,i,r){const s=n.geometry.attributes.position;if(Na.fromBufferAttribute(s,i),Oa.fromBufferAttribute(s,r),t.distanceSqToSegment(Na,Oa,rl,zf)>A)return;rl.applyMatrix4(n.matrixWorld);const o=e.ray.origin.distanceTo(rl);if(!(o<e.near||o>e.far))return{distance:o,point:zf.clone().applyMatrix4(n.matrixWorld),index:i,face:null,faceIndex:null,object:n}}class C_ extends pi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new We(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Wf=new ot,_c=new ss,Ps=new rs,Hs=new Q;class xc extends $t{constructor(e=new Nt,t=new C_){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),Ps.copy(A.boundingSphere),Ps.applyMatrix4(i),Ps.radius+=r,e.ray.intersectsSphere(Ps)===!1)return;Wf.copy(i).invert(),_c.copy(e.ray).applyMatrix4(Wf);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=A.index,u=A.attributes.position;if(c!==null){const f=Math.max(0,s.start),p=Math.min(c.count,s.start+s.count);for(let g=f,m=p;g<m;g++){const d=c.getX(g);Hs.fromBufferAttribute(u,d),Xf(Hs,d,o,i,e,t,this)}}else{const f=Math.max(0,s.start),p=Math.min(u.count,s.start+s.count);for(let g=f,m=p;g<m;g++)Hs.fromBufferAttribute(u,g),Xf(Hs,g,o,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Xf(n,e,t,A,i,r,s){const a=_c.distanceSqToPoint(n);if(a<t){const o=new Q;_c.closestPointToPoint(n,o),o.applyMatrix4(A);const c=i.ray.origin.distanceTo(o);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,object:s})}}class __ extends sA{constructor(e,t,A,i,r,s,a,o,c){super(e,t,A,i,r,s,a,o,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class fo extends Nt{constructor(e=.5,t=1,A=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:A,phiSegments:i,thetaStart:r,thetaLength:s},A=Math.max(3,A),i=Math.max(1,i);const a=[],o=[],c=[],l=[];let u=e;const f=(t-e)/i,p=new Q,g=new Ue;for(let m=0;m<=i;m++){for(let d=0;d<=A;d++){const h=r+d/A*s;p.x=u*Math.cos(h),p.y=u*Math.sin(h),o.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,l.push(g.x,g.y)}u+=f}for(let m=0;m<i;m++){const d=m*(A+1);for(let h=0;h<A;h++){const _=h+d,w=_,U=_+A+1,T=_+A+2,y=_+1;a.push(w,U,y),a.push(U,T,y)}}this.setIndex(a),this.setAttribute("position",new eA(o,3)),this.setAttribute("normal",new eA(c,3)),this.setAttribute("uv",new eA(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Mn extends Nt{constructor(e=1,t=32,A=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:A,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),A=Math.max(2,Math.floor(A));const o=Math.min(s+a,Math.PI);let c=0;const l=[],u=new Q,f=new Q,p=[],g=[],m=[],d=[];for(let h=0;h<=A;h++){const _=[],w=h/A;let U=0;h===0&&s===0?U=.5/t:h===A&&o===Math.PI&&(U=-.5/t);for(let T=0;T<=t;T++){const y=T/t;u.x=-e*Math.cos(i+y*r)*Math.sin(s+w*a),u.y=e*Math.cos(s+w*a),u.z=e*Math.sin(i+y*r)*Math.sin(s+w*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),m.push(f.x,f.y,f.z),d.push(y+U,1-w),_.push(c++)}l.push(_)}for(let h=0;h<A;h++)for(let _=0;_<t;_++){const w=l[h][_+1],U=l[h][_],T=l[h+1][_],y=l[h+1][_+1];(h!==0||s>0)&&p.push(w,U,y),(h!==A-1||o<Math.PI)&&p.push(U,T,y)}this.setIndex(p),this.setAttribute("position",new eA(g,3)),this.setAttribute("normal",new eA(m,3)),this.setAttribute("uv",new eA(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yf extends pi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new We(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new We(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tp,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new KA,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _p extends $t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new We(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const sl=new ot,Jf=new Q,Zf=new Q;class x_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vu,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,A=this.matrix;Jf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jf),Zf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zf),t.updateMatrixWorld(),sl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sl),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(sl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const qf=new ot,Er=new Q,al=new Q;class E_ extends x_{constructor(){super(new mA(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new Q(1,0,0),new Q(-1,0,0),new Q(0,0,1),new Q(0,0,-1),new Q(0,1,0),new Q(0,-1,0)],this._cubeUps=[new Q(0,1,0),new Q(0,1,0),new Q(0,1,0),new Q(0,1,0),new Q(0,0,1),new Q(0,0,-1)]}updateMatrices(e,t=0){const A=this.camera,i=this.matrix,r=e.distance||A.far;r!==A.far&&(A.far=r,A.updateProjectionMatrix()),Er.setFromMatrixPosition(e.matrixWorld),A.position.copy(Er),al.copy(A.position),al.add(this._cubeDirections[t]),A.up.copy(this._cubeUps[t]),A.lookAt(al),A.updateMatrixWorld(),i.makeTranslation(-Er.x,-Er.y,-Er.z),qf.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qf)}}class jf extends _p{constructor(e,t,A=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=A,this.decay=i,this.shadow=new E_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class y_ extends _p{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class xp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=$f(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=$f();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function $f(){return(typeof performance>"u"?Date:performance).now()}const eh=new ot;class Ep{constructor(e,t,A=0,i=1/0){this.ray=new ss(e,t),this.near=A,this.far=i,this.camera=null,this.layers=new wu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return eh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(eh),this}intersectObject(e,t=!0,A=[]){return Ec(e,this,A,t),A.sort(th),A}intersectObjects(e,t=!0,A=[]){for(let i=0,r=e.length;i<r;i++)Ec(e[i],this,A,t);return A.sort(th),A}}function th(n,e){return n.distance-e.distance}function Ec(n,e,t,A){let i=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(i=!1),i===!0&&A===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)Ec(r[s],e,t,!0)}}class Ah{constructor(e=1,t=0,A=0){return this.radius=e,this.phi=t,this.theta=A,this}set(e,t,A){return this.radius=e,this.phi=t,this.theta=A,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,A){return this.radius=Math.sqrt(e*e+t*t+A*A),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,A),this.phi=Math.acos(iA(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:uu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=uu);const nh={type:"change"},ol={type:"start"},ih={type:"end"},Ns=new ss,rh=new En,U_=Math.cos(70*c0.DEG2RAD);class yp extends di{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new Q,this.cursor=new Q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:mi.ROTATE,MIDDLE:mi.DOLLY,RIGHT:mi.PAN},this.touches={ONE:Bi.ROTATE,TWO:Bi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(B){B.addEventListener("keydown",ge),this._domElementKeyEvents=B},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ge),this._domElementKeyEvents=null},this.saveState=function(){A.target0.copy(A.target),A.position0.copy(A.object.position),A.zoom0=A.object.zoom},this.reset=function(){A.target.copy(A.target0),A.object.position.copy(A.position0),A.object.zoom=A.zoom0,A.object.updateProjectionMatrix(),A.dispatchEvent(nh),A.update(),r=i.NONE},this.update=(function(){const B=new Q,N=new fi().setFromUnitVectors(e.up,new Q(0,1,0)),O=N.clone().invert(),X=new Q,te=new fi,xe=new Q,Qe=2*Math.PI;return function(Tt=null){const Je=A.object.position;B.copy(Je).sub(A.target),B.applyQuaternion(N),a.setFromVector3(B),A.autoRotate&&r===i.NONE&&W(C(Tt)),A.enableDamping?(a.theta+=o.theta*A.dampingFactor,a.phi+=o.phi*A.dampingFactor):(a.theta+=o.theta,a.phi+=o.phi);let It=A.minAzimuthAngle,xt=A.maxAzimuthAngle;isFinite(It)&&isFinite(xt)&&(It<-Math.PI?It+=Qe:It>Math.PI&&(It-=Qe),xt<-Math.PI?xt+=Qe:xt>Math.PI&&(xt-=Qe),It<=xt?a.theta=Math.max(It,Math.min(xt,a.theta)):a.theta=a.theta>(It+xt)/2?Math.max(It,a.theta):Math.min(xt,a.theta)),a.phi=Math.max(A.minPolarAngle,Math.min(A.maxPolarAngle,a.phi)),a.makeSafe(),A.enableDamping===!0?A.target.addScaledVector(l,A.dampingFactor):A.target.add(l),A.target.sub(A.cursor),A.target.clampLength(A.minTargetRadius,A.maxTargetRadius),A.target.add(A.cursor);let hn=!1;if(A.zoomToCursor&&y||A.object.isOrthographicCamera)a.radius=ae(a.radius);else{const Ot=a.radius;a.radius=ae(a.radius*c),hn=Ot!=a.radius}if(B.setFromSpherical(a),B.applyQuaternion(O),Je.copy(A.target).add(B),A.object.lookAt(A.target),A.enableDamping===!0?(o.theta*=1-A.dampingFactor,o.phi*=1-A.dampingFactor,l.multiplyScalar(1-A.dampingFactor)):(o.set(0,0,0),l.set(0,0,0)),A.zoomToCursor&&y){let Ot=null;if(A.object.isPerspectiveCamera){const XA=B.length();Ot=ae(XA*c);const kn=XA-Ot;A.object.position.addScaledVector(U,kn),A.object.updateMatrixWorld(),hn=!!kn}else if(A.object.isOrthographicCamera){const XA=new Q(T.x,T.y,0);XA.unproject(A.object);const kn=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/c)),A.object.updateProjectionMatrix(),hn=kn!==A.object.zoom;const gr=new Q(T.x,T.y,0);gr.unproject(A.object),A.object.position.sub(gr).add(XA),A.object.updateMatrixWorld(),Ot=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),A.zoomToCursor=!1;Ot!==null&&(this.screenSpacePanning?A.target.set(0,0,-1).transformDirection(A.object.matrix).multiplyScalar(Ot).add(A.object.position):(Ns.origin.copy(A.object.position),Ns.direction.set(0,0,-1).transformDirection(A.object.matrix),Math.abs(A.object.up.dot(Ns.direction))<U_?e.lookAt(A.target):(rh.setFromNormalAndCoplanarPoint(A.object.up,A.target),Ns.intersectPlane(rh,A.target))))}else if(A.object.isOrthographicCamera){const Ot=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/c)),Ot!==A.object.zoom&&(A.object.updateProjectionMatrix(),hn=!0)}return c=1,y=!1,hn||X.distanceToSquared(A.object.position)>s||8*(1-te.dot(A.object.quaternion))>s||xe.distanceToSquared(A.target)>s?(A.dispatchEvent(nh),X.copy(A.object.position),te.copy(A.object.quaternion),xe.copy(A.target),!0):!1}})(),this.dispose=function(){A.domElement.removeEventListener("contextmenu",me),A.domElement.removeEventListener("pointerdown",He),A.domElement.removeEventListener("pointercancel",v),A.domElement.removeEventListener("wheel",Ae),A.domElement.removeEventListener("pointermove",b),A.domElement.removeEventListener("pointerup",v),A.domElement.getRootNode().removeEventListener("keydown",Se,{capture:!0}),A._domElementKeyEvents!==null&&(A._domElementKeyEvents.removeEventListener("keydown",ge),A._domElementKeyEvents=null)};const A=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const s=1e-6,a=new Ah,o=new Ah;let c=1;const l=new Q,u=new Ue,f=new Ue,p=new Ue,g=new Ue,m=new Ue,d=new Ue,h=new Ue,_=new Ue,w=new Ue,U=new Q,T=new Ue;let y=!1;const S=[],L={};let x=!1;function C(B){return B!==null?2*Math.PI/60*A.autoRotateSpeed*B:2*Math.PI/60/60*A.autoRotateSpeed}function I(B){const N=Math.abs(B*.01);return Math.pow(.95,A.zoomSpeed*N)}function W(B){o.theta-=B}function H(B){o.phi-=B}const z=(function(){const B=new Q;return function(O,X){B.setFromMatrixColumn(X,0),B.multiplyScalar(-O),l.add(B)}})(),Z=(function(){const B=new Q;return function(O,X){A.screenSpacePanning===!0?B.setFromMatrixColumn(X,1):(B.setFromMatrixColumn(X,0),B.crossVectors(A.object.up,B)),B.multiplyScalar(O),l.add(B)}})(),K=(function(){const B=new Q;return function(O,X){const te=A.domElement;if(A.object.isPerspectiveCamera){const xe=A.object.position;B.copy(xe).sub(A.target);let Qe=B.length();Qe*=Math.tan(A.object.fov/2*Math.PI/180),z(2*O*Qe/te.clientHeight,A.object.matrix),Z(2*X*Qe/te.clientHeight,A.object.matrix)}else A.object.isOrthographicCamera?(z(O*(A.object.right-A.object.left)/A.object.zoom/te.clientWidth,A.object.matrix),Z(X*(A.object.top-A.object.bottom)/A.object.zoom/te.clientHeight,A.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),A.enablePan=!1)}})();function q(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?c/=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function Y(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?c*=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function se(B,N){if(!A.zoomToCursor)return;y=!0;const O=A.domElement.getBoundingClientRect(),X=B-O.left,te=N-O.top,xe=O.width,Qe=O.height;T.x=X/xe*2-1,T.y=-(te/Qe)*2+1,U.set(T.x,T.y,1).unproject(A.object).sub(A.object.position).normalize()}function ae(B){return Math.max(A.minDistance,Math.min(A.maxDistance,B))}function pe(B){u.set(B.clientX,B.clientY)}function Pe(B){se(B.clientX,B.clientX),h.set(B.clientX,B.clientY)}function Ge(B){g.set(B.clientX,B.clientY)}function J(B){f.set(B.clientX,B.clientY),p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;W(2*Math.PI*p.x/N.clientHeight),H(2*Math.PI*p.y/N.clientHeight),u.copy(f),A.update()}function $(B){_.set(B.clientX,B.clientY),w.subVectors(_,h),w.y>0?q(I(w.y)):w.y<0&&Y(I(w.y)),h.copy(_),A.update()}function fe(B){m.set(B.clientX,B.clientY),d.subVectors(m,g).multiplyScalar(A.panSpeed),K(d.x,d.y),g.copy(m),A.update()}function ce(B){se(B.clientX,B.clientY),B.deltaY<0?Y(I(B.deltaY)):B.deltaY>0&&q(I(B.deltaY)),A.update()}function Ne(B){let N=!1;switch(B.code){case A.keys.UP:B.ctrlKey||B.metaKey||B.shiftKey?H(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):K(0,A.keyPanSpeed),N=!0;break;case A.keys.BOTTOM:B.ctrlKey||B.metaKey||B.shiftKey?H(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):K(0,-A.keyPanSpeed),N=!0;break;case A.keys.LEFT:B.ctrlKey||B.metaKey||B.shiftKey?W(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):K(A.keyPanSpeed,0),N=!0;break;case A.keys.RIGHT:B.ctrlKey||B.metaKey||B.shiftKey?W(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):K(-A.keyPanSpeed,0),N=!0;break}N&&(B.preventDefault(),A.update())}function Ve(B){if(S.length===1)u.set(B.pageX,B.pageY);else{const N=De(B),O=.5*(B.pageX+N.x),X=.5*(B.pageY+N.y);u.set(O,X)}}function ze(B){if(S.length===1)g.set(B.pageX,B.pageY);else{const N=De(B),O=.5*(B.pageX+N.x),X=.5*(B.pageY+N.y);g.set(O,X)}}function lt(B){const N=De(B),O=B.pageX-N.x,X=B.pageY-N.y,te=Math.sqrt(O*O+X*X);h.set(0,te)}function F(B){A.enableZoom&&lt(B),A.enablePan&&ze(B)}function pt(B){A.enableZoom&&lt(B),A.enableRotate&&Ve(B)}function Ze(B){if(S.length==1)f.set(B.pageX,B.pageY);else{const O=De(B),X=.5*(B.pageX+O.x),te=.5*(B.pageY+O.y);f.set(X,te)}p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;W(2*Math.PI*p.x/N.clientHeight),H(2*Math.PI*p.y/N.clientHeight),u.copy(f)}function qe(B){if(S.length===1)m.set(B.pageX,B.pageY);else{const N=De(B),O=.5*(B.pageX+N.x),X=.5*(B.pageY+N.y);m.set(O,X)}d.subVectors(m,g).multiplyScalar(A.panSpeed),K(d.x,d.y),g.copy(m)}function _e(B){const N=De(B),O=B.pageX-N.x,X=B.pageY-N.y,te=Math.sqrt(O*O+X*X);_.set(0,te),w.set(0,Math.pow(_.y/h.y,A.zoomSpeed)),q(w.y),h.copy(_);const xe=(B.pageX+N.x)*.5,Qe=(B.pageY+N.y)*.5;se(xe,Qe)}function gt(B){A.enableZoom&&_e(B),A.enablePan&&qe(B)}function Re(B){A.enableZoom&&_e(B),A.enableRotate&&Ze(B)}function He(B){A.enabled!==!1&&(S.length===0&&(A.domElement.setPointerCapture(B.pointerId),A.domElement.addEventListener("pointermove",b),A.domElement.addEventListener("pointerup",v)),!Be(B)&&(Xe(B),B.pointerType==="touch"?Oe(B):k(B)))}function b(B){A.enabled!==!1&&(B.pointerType==="touch"?ie(B):ee(B))}function v(B){switch(be(B),S.length){case 0:A.domElement.releasePointerCapture(B.pointerId),A.domElement.removeEventListener("pointermove",b),A.domElement.removeEventListener("pointerup",v),A.dispatchEvent(ih),r=i.NONE;break;case 1:const N=S[0],O=L[N];Oe({pointerId:N,pageX:O.x,pageY:O.y});break}}function k(B){let N;switch(B.button){case 0:N=A.mouseButtons.LEFT;break;case 1:N=A.mouseButtons.MIDDLE;break;case 2:N=A.mouseButtons.RIGHT;break;default:N=-1}switch(N){case mi.DOLLY:if(A.enableZoom===!1)return;Pe(B),r=i.DOLLY;break;case mi.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enablePan===!1)return;Ge(B),r=i.PAN}else{if(A.enableRotate===!1)return;pe(B),r=i.ROTATE}break;case mi.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enableRotate===!1)return;pe(B),r=i.ROTATE}else{if(A.enablePan===!1)return;Ge(B),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(ol)}function ee(B){switch(r){case i.ROTATE:if(A.enableRotate===!1)return;J(B);break;case i.DOLLY:if(A.enableZoom===!1)return;$(B);break;case i.PAN:if(A.enablePan===!1)return;fe(B);break}}function Ae(B){A.enabled===!1||A.enableZoom===!1||r!==i.NONE||(B.preventDefault(),A.dispatchEvent(ol),ce(j(B)),A.dispatchEvent(ih))}function j(B){const N=B.deltaMode,O={clientX:B.clientX,clientY:B.clientY,deltaY:B.deltaY};switch(N){case 1:O.deltaY*=16;break;case 2:O.deltaY*=100;break}return B.ctrlKey&&!x&&(O.deltaY*=10),O}function Se(B){B.key==="Control"&&(x=!0,A.domElement.getRootNode().addEventListener("keyup",oe,{passive:!0,capture:!0}))}function oe(B){B.key==="Control"&&(x=!1,A.domElement.getRootNode().removeEventListener("keyup",oe,{passive:!0,capture:!0}))}function ge(B){A.enabled===!1||A.enablePan===!1||Ne(B)}function Oe(B){switch(Ie(B),S.length){case 1:switch(A.touches.ONE){case Bi.ROTATE:if(A.enableRotate===!1)return;Ve(B),r=i.TOUCH_ROTATE;break;case Bi.PAN:if(A.enablePan===!1)return;ze(B),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(A.touches.TWO){case Bi.DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;F(B),r=i.TOUCH_DOLLY_PAN;break;case Bi.DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;pt(B),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(ol)}function ie(B){switch(Ie(B),r){case i.TOUCH_ROTATE:if(A.enableRotate===!1)return;Ze(B),A.update();break;case i.TOUCH_PAN:if(A.enablePan===!1)return;qe(B),A.update();break;case i.TOUCH_DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;gt(B),A.update();break;case i.TOUCH_DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;Re(B),A.update();break;default:r=i.NONE}}function me(B){A.enabled!==!1&&B.preventDefault()}function Xe(B){S.push(B.pointerId)}function be(B){delete L[B.pointerId];for(let N=0;N<S.length;N++)if(S[N]==B.pointerId){S.splice(N,1);return}}function Be(B){for(let N=0;N<S.length;N++)if(S[N]==B.pointerId)return!0;return!1}function Ie(B){let N=L[B.pointerId];N===void 0&&(N=new Ue,L[B.pointerId]=N),N.set(B.pageX,B.pageY)}function De(B){const N=B.pointerId===S[0]?S[1]:S[0];return L[N]}A.domElement.addEventListener("contextmenu",me),A.domElement.addEventListener("pointerdown",He),A.domElement.addEventListener("pointercancel",v),A.domElement.addEventListener("wheel",Ae,{passive:!1}),A.domElement.getRootNode().addEventListener("keydown",Se,{passive:!0,capture:!0}),this.update()}}const S_={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ho{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const M_=new dp(-1,1,1,-1,0,1);class b_ extends Nt{constructor(){super(),this.setAttribute("position",new eA([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new eA([0,2,0,0,2,0],2))}}const F_=new b_;class T_{constructor(e){this._mesh=new Ft(F_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,M_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class yc extends ho{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof zt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=cp.clone(e.uniforms),this.material=new zt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new T_(this.material)}render(e,t,A){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=A.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class sh extends ho{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,A){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,s,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(A),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class I_ extends ho{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Q_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const A=e.getSize(new Ue);this._width=A.width,this._height=A.height,t=new Nn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hr}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new yc(S_),this.copyPass.material.blending=on,this.clock=new xp}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let A=!1;for(let i=0,r=this.passes.length;i<r;i++){const s=this.passes[i];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,A),s.needsSwap){if(A){const a=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}sh!==void 0&&(s instanceof sh?A=!0:s instanceof I_&&(A=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const A=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(A,i),this.renderTarget2.setSize(A,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(A,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class L_ extends ho{constructor(e,t,A=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=A,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new We}render(e,t,A){const i=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:A),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=i}}/*!
 * html2canvas 1.4.1 <https://html2canvas.hertzen.com>
 * Copyright (c) 2022 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 *//*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var Uc=function(n,e){return Uc=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,A){t.__proto__=A}||function(t,A){for(var i in A)Object.prototype.hasOwnProperty.call(A,i)&&(t[i]=A[i])},Uc(n,e)};function NA(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Uc(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var Sc=function(){return Sc=Object.assign||function(e){for(var t,A=1,i=arguments.length;A<i;A++){t=arguments[A];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Sc.apply(this,arguments)};function AA(n,e,t,A){function i(r){return r instanceof t?r:new t(function(s){s(r)})}return new(t||(t=Promise))(function(r,s){function a(l){try{c(A.next(l))}catch(u){s(u)}}function o(l){try{c(A.throw(l))}catch(u){s(u)}}function c(l){l.done?r(l.value):i(l.value).then(a,o)}c((A=A.apply(n,[])).next())})}function Jt(n,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},A,i,r,s;return s={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(c){return function(l){return o([c,l])}}function o(c){if(A)throw new TypeError("Generator is already executing.");for(;t;)try{if(A=1,i&&(r=c[0]&2?i.return:c[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,c[1])).done)return r;switch(i=0,r&&(c=[c[0]&2,r.value]),c[0]){case 0:case 1:r=c;break;case 4:return t.label++,{value:c[1],done:!1};case 5:t.label++,i=c[1],c=[0];continue;case 7:c=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(c[0]===6||c[0]===2)){t=0;continue}if(c[0]===3&&(!r||c[1]>r[0]&&c[1]<r[3])){t.label=c[1];break}if(c[0]===6&&t.label<r[1]){t.label=r[1],r=c;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(c);break}r[2]&&t.ops.pop(),t.trys.pop();continue}c=e.call(n,t)}catch(l){c=[6,l],i=0}finally{A=r=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function Os(n,e,t){if(arguments.length===2)for(var A=0,i=e.length,r;A<i;A++)(r||!(A in e))&&(r||(r=Array.prototype.slice.call(e,0,A)),r[A]=e[A]);return n.concat(r||e)}var fn=(function(){function n(e,t,A,i){this.left=e,this.top=t,this.width=A,this.height=i}return n.prototype.add=function(e,t,A,i){return new n(this.left+e,this.top+t,this.width+A,this.height+i)},n.fromClientRect=function(e,t){return new n(t.left+e.windowBounds.left,t.top+e.windowBounds.top,t.width,t.height)},n.fromDOMRectList=function(e,t){var A=Array.from(t).find(function(i){return i.width!==0});return A?new n(A.left+e.windowBounds.left,A.top+e.windowBounds.top,A.width,A.height):n.EMPTY},n.EMPTY=new n(0,0,0,0),n})(),po=function(n,e){return fn.fromClientRect(n,e.getBoundingClientRect())},R_=function(n){var e=n.body,t=n.documentElement;if(!e||!t)throw new Error("Unable to get document size");var A=Math.max(Math.max(e.scrollWidth,t.scrollWidth),Math.max(e.offsetWidth,t.offsetWidth),Math.max(e.clientWidth,t.clientWidth)),i=Math.max(Math.max(e.scrollHeight,t.scrollHeight),Math.max(e.offsetHeight,t.offsetHeight),Math.max(e.clientHeight,t.clientHeight));return new fn(0,0,A,i)},go=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},Ct=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},ah="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",D_=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Gs=0;Gs<ah.length;Gs++)D_[ah.charCodeAt(Gs)]=Gs;var oh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Lr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Vs=0;Vs<oh.length;Vs++)Lr[oh.charCodeAt(Vs)]=Vs;var P_=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var c=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),l=Array.isArray(c)?c:new Uint8Array(c);for(A=0;A<t;A+=4)r=Lr[n.charCodeAt(A)],s=Lr[n.charCodeAt(A+1)],a=Lr[n.charCodeAt(A+2)],o=Lr[n.charCodeAt(A+3)],l[i++]=r<<2|s>>4,l[i++]=(s&15)<<4|a>>2,l[i++]=(a&3)<<6|o&63;return c},H_=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},N_=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},si=5,Eu=11,ll=2,O_=Eu-si,Up=65536>>si,G_=1<<si,cl=G_-1,V_=1024>>si,k_=Up+V_,K_=k_,z_=32,W_=K_+z_,X_=65536>>Eu,Y_=1<<O_,J_=Y_-1,lh=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},Z_=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},q_=function(n,e){var t=P_(n),A=Array.isArray(t)?N_(t):new Uint32Array(t),i=Array.isArray(t)?H_(t):new Uint16Array(t),r=24,s=lh(i,r/2,A[4]/2),a=A[5]===2?lh(i,(r+A[4])/2):Z_(A,Math.ceil((r+A[4])/4));return new j_(A[0],A[1],A[2],A[3],s,a)},j_=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>si],t=(t<<ll)+(e&cl),this.data[t];if(e<=65535)return t=this.index[Up+(e-55296>>si)],t=(t<<ll)+(e&cl),this.data[t];if(e<this.highStart)return t=W_-X_+(e>>Eu),t=this.index[t],t+=e>>si&J_,t=this.index[t],t=(t<<ll)+(e&cl),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),ch="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",$_=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var ks=0;ks<ch.length;ks++)$_[ch.charCodeAt(ks)]=ks;var ex="KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==",uh=50,tx=1,Sp=2,Mp=3,Ax=4,nx=5,fh=7,bp=8,hh=9,bn=10,Mc=11,dh=12,bc=13,ix=14,Rr=15,Fc=16,Ks=17,yr=18,rx=19,ph=20,Tc=21,Ur=22,ul=23,Di=24,pA=25,Dr=26,Pr=27,Pi=28,sx=29,ei=30,ax=31,zs=32,Ws=33,Ic=34,Qc=35,Lc=36,jr=37,Rc=38,Ua=39,Sa=40,fl=41,Fp=42,ox=43,lx=[9001,65288],Tp="!",Ye="×",Xs="÷",Dc=q_(ex),$A=[ei,Lc],Pc=[tx,Sp,Mp,nx],Ip=[bn,bp],gh=[Pr,Dr],cx=Pc.concat(Ip),mh=[Rc,Ua,Sa,Ic,Qc],ux=[Rr,bc],fx=function(n,e){e===void 0&&(e="strict");var t=[],A=[],i=[];return n.forEach(function(r,s){var a=Dc.get(r);if(a>uh?(i.push(!0),a-=uh):i.push(!1),["normal","auto","loose"].indexOf(e)!==-1&&[8208,8211,12316,12448].indexOf(r)!==-1)return A.push(s),t.push(Fc);if(a===Ax||a===Mc){if(s===0)return A.push(s),t.push(ei);var o=t[s-1];return cx.indexOf(o)===-1?(A.push(A[s-1]),t.push(o)):(A.push(s),t.push(ei))}if(A.push(s),a===ax)return t.push(e==="strict"?Tc:jr);if(a===Fp||a===sx)return t.push(ei);if(a===ox)return r>=131072&&r<=196605||r>=196608&&r<=262141?t.push(jr):t.push(ei);t.push(a)}),[A,t,i]},hl=function(n,e,t,A){var i=A[t];if(Array.isArray(n)?n.indexOf(i)!==-1:n===i)for(var r=t;r<=A.length;){r++;var s=A[r];if(s===e)return!0;if(s!==bn)break}if(i===bn)for(var r=t;r>0;){r--;var a=A[r];if(Array.isArray(n)?n.indexOf(a)!==-1:n===a)for(var o=t;o<=A.length;){o++;var s=A[o];if(s===e)return!0;if(s!==bn)break}if(a!==bn)break}return!1},Bh=function(n,e){for(var t=n;t>=0;){var A=e[t];if(A===bn)t--;else return A}return 0},hx=function(n,e,t,A,i){if(t[A]===0)return Ye;var r=A-1;if(Array.isArray(i)&&i[r]===!0)return Ye;var s=r-1,a=r+1,o=e[r],c=s>=0?e[s]:0,l=e[a];if(o===Sp&&l===Mp)return Ye;if(Pc.indexOf(o)!==-1)return Tp;if(Pc.indexOf(l)!==-1||Ip.indexOf(l)!==-1)return Ye;if(Bh(r,e)===bp)return Xs;if(Dc.get(n[r])===Mc||(o===zs||o===Ws)&&Dc.get(n[a])===Mc||o===fh||l===fh||o===hh||[bn,bc,Rr].indexOf(o)===-1&&l===hh||[Ks,yr,rx,Di,Pi].indexOf(l)!==-1||Bh(r,e)===Ur||hl(ul,Ur,r,e)||hl([Ks,yr],Tc,r,e)||hl(dh,dh,r,e))return Ye;if(o===bn)return Xs;if(o===ul||l===ul)return Ye;if(l===Fc||o===Fc)return Xs;if([bc,Rr,Tc].indexOf(l)!==-1||o===ix||c===Lc&&ux.indexOf(o)!==-1||o===Pi&&l===Lc||l===ph||$A.indexOf(l)!==-1&&o===pA||$A.indexOf(o)!==-1&&l===pA||o===Pr&&[jr,zs,Ws].indexOf(l)!==-1||[jr,zs,Ws].indexOf(o)!==-1&&l===Dr||$A.indexOf(o)!==-1&&gh.indexOf(l)!==-1||gh.indexOf(o)!==-1&&$A.indexOf(l)!==-1||[Pr,Dr].indexOf(o)!==-1&&(l===pA||[Ur,Rr].indexOf(l)!==-1&&e[a+1]===pA)||[Ur,Rr].indexOf(o)!==-1&&l===pA||o===pA&&[pA,Pi,Di].indexOf(l)!==-1)return Ye;if([pA,Pi,Di,Ks,yr].indexOf(l)!==-1)for(var u=r;u>=0;){var f=e[u];if(f===pA)return Ye;if([Pi,Di].indexOf(f)!==-1)u--;else break}if([Pr,Dr].indexOf(l)!==-1)for(var u=[Ks,yr].indexOf(o)!==-1?s:r;u>=0;){var f=e[u];if(f===pA)return Ye;if([Pi,Di].indexOf(f)!==-1)u--;else break}if(Rc===o&&[Rc,Ua,Ic,Qc].indexOf(l)!==-1||[Ua,Ic].indexOf(o)!==-1&&[Ua,Sa].indexOf(l)!==-1||[Sa,Qc].indexOf(o)!==-1&&l===Sa||mh.indexOf(o)!==-1&&[ph,Dr].indexOf(l)!==-1||mh.indexOf(l)!==-1&&o===Pr||$A.indexOf(o)!==-1&&$A.indexOf(l)!==-1||o===Di&&$A.indexOf(l)!==-1||$A.concat(pA).indexOf(o)!==-1&&l===Ur&&lx.indexOf(n[a])===-1||$A.concat(pA).indexOf(l)!==-1&&o===yr)return Ye;if(o===fl&&l===fl){for(var p=t[r],g=1;p>0&&(p--,e[p]===fl);)g++;if(g%2!==0)return Ye}return o===zs&&l===Ws?Ye:Xs},dx=function(n,e){e||(e={lineBreak:"normal",wordBreak:"normal"});var t=fx(n,e.lineBreak),A=t[0],i=t[1],r=t[2];(e.wordBreak==="break-all"||e.wordBreak==="break-word")&&(i=i.map(function(a){return[pA,ei,Fp].indexOf(a)!==-1?jr:a}));var s=e.wordBreak==="keep-all"?r.map(function(a,o){return a&&n[o]>=19968&&n[o]<=40959}):void 0;return[A,i,s]},px=(function(){function n(e,t,A,i){this.codePoints=e,this.required=t===Tp,this.start=A,this.end=i}return n.prototype.slice=function(){return Ct.apply(void 0,this.codePoints.slice(this.start,this.end))},n})(),gx=function(n,e){var t=go(n),A=dx(t,e),i=A[0],r=A[1],s=A[2],a=t.length,o=0,c=0;return{next:function(){if(c>=a)return{done:!0,value:null};for(var l=Ye;c<a&&(l=hx(t,r,i,++c,s))===Ye;);if(l!==Ye||c===a){var u=new px(t,l,o,c);return o=c,{value:u,done:!1}}return{done:!0,value:null}}}},mx=1,Bx=2,os=4,wh=8,Ga=10,vh=47,Kr=92,wx=9,vx=32,Ys=34,Sr=61,Cx=35,_x=36,xx=37,Js=39,Zs=40,Mr=41,Ex=95,oA=45,yx=33,Ux=60,Sx=62,Mx=64,bx=91,Fx=93,Tx=61,Ix=123,qs=63,Qx=125,Ch=124,Lx=126,Rx=128,_h=65533,dl=42,ii=43,Dx=44,Px=58,Hx=59,$r=46,Nx=0,Ox=8,Gx=11,Vx=14,kx=31,Kx=127,OA=-1,Qp=48,Lp=97,Rp=101,zx=102,Wx=117,Xx=122,Dp=65,Pp=69,Hp=70,Yx=85,Jx=90,qt=function(n){return n>=Qp&&n<=57},Zx=function(n){return n>=55296&&n<=57343},Hi=function(n){return qt(n)||n>=Dp&&n<=Hp||n>=Lp&&n<=zx},qx=function(n){return n>=Lp&&n<=Xx},jx=function(n){return n>=Dp&&n<=Jx},$x=function(n){return qx(n)||jx(n)},eE=function(n){return n>=Rx},js=function(n){return n===Ga||n===wx||n===vx},Va=function(n){return $x(n)||eE(n)||n===Ex},xh=function(n){return Va(n)||qt(n)||n===oA},tE=function(n){return n>=Nx&&n<=Ox||n===Gx||n>=Vx&&n<=kx||n===Kx},yn=function(n,e){return n!==Kr?!1:e!==Ga},$s=function(n,e,t){return n===oA?Va(e)||yn(e,t):Va(n)?!0:!!(n===Kr&&yn(n,e))},pl=function(n,e,t){return n===ii||n===oA?qt(e)?!0:e===$r&&qt(t):qt(n===$r?e:n)},AE=function(n){var e=0,t=1;(n[e]===ii||n[e]===oA)&&(n[e]===oA&&(t=-1),e++);for(var A=[];qt(n[e]);)A.push(n[e++]);var i=A.length?parseInt(Ct.apply(void 0,A),10):0;n[e]===$r&&e++;for(var r=[];qt(n[e]);)r.push(n[e++]);var s=r.length,a=s?parseInt(Ct.apply(void 0,r),10):0;(n[e]===Pp||n[e]===Rp)&&e++;var o=1;(n[e]===ii||n[e]===oA)&&(n[e]===oA&&(o=-1),e++);for(var c=[];qt(n[e]);)c.push(n[e++]);var l=c.length?parseInt(Ct.apply(void 0,c),10):0;return t*(i+a*Math.pow(10,-s))*Math.pow(10,o*l)},nE={type:2},iE={type:3},rE={type:4},sE={type:13},aE={type:8},oE={type:21},lE={type:9},cE={type:10},uE={type:11},fE={type:12},hE={type:14},ea={type:23},dE={type:1},pE={type:25},gE={type:24},mE={type:26},BE={type:27},wE={type:28},vE={type:29},CE={type:31},Hc={type:32},Np=(function(){function n(){this._value=[]}return n.prototype.write=function(e){this._value=this._value.concat(go(e))},n.prototype.read=function(){for(var e=[],t=this.consumeToken();t!==Hc;)e.push(t),t=this.consumeToken();return e},n.prototype.consumeToken=function(){var e=this.consumeCodePoint();switch(e){case Ys:return this.consumeStringToken(Ys);case Cx:var t=this.peekCodePoint(0),A=this.peekCodePoint(1),i=this.peekCodePoint(2);if(xh(t)||yn(A,i)){var r=$s(t,A,i)?Bx:mx,s=this.consumeName();return{type:5,value:s,flags:r}}break;case _x:if(this.peekCodePoint(0)===Sr)return this.consumeCodePoint(),sE;break;case Js:return this.consumeStringToken(Js);case Zs:return nE;case Mr:return iE;case dl:if(this.peekCodePoint(0)===Sr)return this.consumeCodePoint(),hE;break;case ii:if(pl(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case Dx:return rE;case oA:var a=e,o=this.peekCodePoint(0),c=this.peekCodePoint(1);if(pl(a,o,c))return this.reconsumeCodePoint(e),this.consumeNumericToken();if($s(a,o,c))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();if(o===oA&&c===Sx)return this.consumeCodePoint(),this.consumeCodePoint(),gE;break;case $r:if(pl(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case vh:if(this.peekCodePoint(0)===dl)for(this.consumeCodePoint();;){var l=this.consumeCodePoint();if(l===dl&&(l=this.consumeCodePoint(),l===vh))return this.consumeToken();if(l===OA)return this.consumeToken()}break;case Px:return mE;case Hx:return BE;case Ux:if(this.peekCodePoint(0)===yx&&this.peekCodePoint(1)===oA&&this.peekCodePoint(2)===oA)return this.consumeCodePoint(),this.consumeCodePoint(),pE;break;case Mx:var u=this.peekCodePoint(0),f=this.peekCodePoint(1),p=this.peekCodePoint(2);if($s(u,f,p)){var s=this.consumeName();return{type:7,value:s}}break;case bx:return wE;case Kr:if(yn(e,this.peekCodePoint(0)))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();break;case Fx:return vE;case Tx:if(this.peekCodePoint(0)===Sr)return this.consumeCodePoint(),aE;break;case Ix:return uE;case Qx:return fE;case Wx:case Yx:var g=this.peekCodePoint(0),m=this.peekCodePoint(1);return g===ii&&(Hi(m)||m===qs)&&(this.consumeCodePoint(),this.consumeUnicodeRangeToken()),this.reconsumeCodePoint(e),this.consumeIdentLikeToken();case Ch:if(this.peekCodePoint(0)===Sr)return this.consumeCodePoint(),lE;if(this.peekCodePoint(0)===Ch)return this.consumeCodePoint(),oE;break;case Lx:if(this.peekCodePoint(0)===Sr)return this.consumeCodePoint(),cE;break;case OA:return Hc}return js(e)?(this.consumeWhiteSpace(),CE):qt(e)?(this.reconsumeCodePoint(e),this.consumeNumericToken()):Va(e)?(this.reconsumeCodePoint(e),this.consumeIdentLikeToken()):{type:6,value:Ct(e)}},n.prototype.consumeCodePoint=function(){var e=this._value.shift();return typeof e>"u"?-1:e},n.prototype.reconsumeCodePoint=function(e){this._value.unshift(e)},n.prototype.peekCodePoint=function(e){return e>=this._value.length?-1:this._value[e]},n.prototype.consumeUnicodeRangeToken=function(){for(var e=[],t=this.consumeCodePoint();Hi(t)&&e.length<6;)e.push(t),t=this.consumeCodePoint();for(var A=!1;t===qs&&e.length<6;)e.push(t),t=this.consumeCodePoint(),A=!0;if(A){var i=parseInt(Ct.apply(void 0,e.map(function(o){return o===qs?Qp:o})),16),r=parseInt(Ct.apply(void 0,e.map(function(o){return o===qs?Hp:o})),16);return{type:30,start:i,end:r}}var s=parseInt(Ct.apply(void 0,e),16);if(this.peekCodePoint(0)===oA&&Hi(this.peekCodePoint(1))){this.consumeCodePoint(),t=this.consumeCodePoint();for(var a=[];Hi(t)&&a.length<6;)a.push(t),t=this.consumeCodePoint();var r=parseInt(Ct.apply(void 0,a),16);return{type:30,start:s,end:r}}else return{type:30,start:s,end:s}},n.prototype.consumeIdentLikeToken=function(){var e=this.consumeName();return e.toLowerCase()==="url"&&this.peekCodePoint(0)===Zs?(this.consumeCodePoint(),this.consumeUrlToken()):this.peekCodePoint(0)===Zs?(this.consumeCodePoint(),{type:19,value:e}):{type:20,value:e}},n.prototype.consumeUrlToken=function(){var e=[];if(this.consumeWhiteSpace(),this.peekCodePoint(0)===OA)return{type:22,value:""};var t=this.peekCodePoint(0);if(t===Js||t===Ys){var A=this.consumeStringToken(this.consumeCodePoint());return A.type===0&&(this.consumeWhiteSpace(),this.peekCodePoint(0)===OA||this.peekCodePoint(0)===Mr)?(this.consumeCodePoint(),{type:22,value:A.value}):(this.consumeBadUrlRemnants(),ea)}for(;;){var i=this.consumeCodePoint();if(i===OA||i===Mr)return{type:22,value:Ct.apply(void 0,e)};if(js(i))return this.consumeWhiteSpace(),this.peekCodePoint(0)===OA||this.peekCodePoint(0)===Mr?(this.consumeCodePoint(),{type:22,value:Ct.apply(void 0,e)}):(this.consumeBadUrlRemnants(),ea);if(i===Ys||i===Js||i===Zs||tE(i))return this.consumeBadUrlRemnants(),ea;if(i===Kr)if(yn(i,this.peekCodePoint(0)))e.push(this.consumeEscapedCodePoint());else return this.consumeBadUrlRemnants(),ea;else e.push(i)}},n.prototype.consumeWhiteSpace=function(){for(;js(this.peekCodePoint(0));)this.consumeCodePoint()},n.prototype.consumeBadUrlRemnants=function(){for(;;){var e=this.consumeCodePoint();if(e===Mr||e===OA)return;yn(e,this.peekCodePoint(0))&&this.consumeEscapedCodePoint()}},n.prototype.consumeStringSlice=function(e){for(var t=5e4,A="";e>0;){var i=Math.min(t,e);A+=Ct.apply(void 0,this._value.splice(0,i)),e-=i}return this._value.shift(),A},n.prototype.consumeStringToken=function(e){var t="",A=0;do{var i=this._value[A];if(i===OA||i===void 0||i===e)return t+=this.consumeStringSlice(A),{type:0,value:t};if(i===Ga)return this._value.splice(0,A),dE;if(i===Kr){var r=this._value[A+1];r!==OA&&r!==void 0&&(r===Ga?(t+=this.consumeStringSlice(A),A=-1,this._value.shift()):yn(i,r)&&(t+=this.consumeStringSlice(A),t+=Ct(this.consumeEscapedCodePoint()),A=-1))}A++}while(!0)},n.prototype.consumeNumber=function(){var e=[],t=os,A=this.peekCodePoint(0);for((A===ii||A===oA)&&e.push(this.consumeCodePoint());qt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0);var i=this.peekCodePoint(1);if(A===$r&&qt(i))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=wh;qt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0),i=this.peekCodePoint(1);var r=this.peekCodePoint(2);if((A===Pp||A===Rp)&&((i===ii||i===oA)&&qt(r)||qt(i)))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=wh;qt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());return[AE(e),t]},n.prototype.consumeNumericToken=function(){var e=this.consumeNumber(),t=e[0],A=e[1],i=this.peekCodePoint(0),r=this.peekCodePoint(1),s=this.peekCodePoint(2);if($s(i,r,s)){var a=this.consumeName();return{type:15,number:t,flags:A,unit:a}}return i===xx?(this.consumeCodePoint(),{type:16,number:t,flags:A}):{type:17,number:t,flags:A}},n.prototype.consumeEscapedCodePoint=function(){var e=this.consumeCodePoint();if(Hi(e)){for(var t=Ct(e);Hi(this.peekCodePoint(0))&&t.length<6;)t+=Ct(this.consumeCodePoint());js(this.peekCodePoint(0))&&this.consumeCodePoint();var A=parseInt(t,16);return A===0||Zx(A)||A>1114111?_h:A}return e===OA?_h:e},n.prototype.consumeName=function(){for(var e="";;){var t=this.consumeCodePoint();if(xh(t))e+=Ct(t);else if(yn(t,this.peekCodePoint(0)))e+=Ct(this.consumeEscapedCodePoint());else return this.reconsumeCodePoint(t),e}},n})(),Op=(function(){function n(e){this._tokens=e}return n.create=function(e){var t=new Np;return t.write(e),new n(t.read())},n.parseValue=function(e){return n.create(e).parseComponentValue()},n.parseValues=function(e){return n.create(e).parseComponentValues()},n.prototype.parseComponentValue=function(){for(var e=this.consumeToken();e.type===31;)e=this.consumeToken();if(e.type===32)throw new SyntaxError("Error parsing CSS component value, unexpected EOF");this.reconsumeToken(e);var t=this.consumeComponentValue();do e=this.consumeToken();while(e.type===31);if(e.type===32)return t;throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")},n.prototype.parseComponentValues=function(){for(var e=[];;){var t=this.consumeComponentValue();if(t.type===32)return e;e.push(t),e.push()}},n.prototype.consumeComponentValue=function(){var e=this.consumeToken();switch(e.type){case 11:case 28:case 2:return this.consumeSimpleBlock(e.type);case 19:return this.consumeFunction(e)}return e},n.prototype.consumeSimpleBlock=function(e){for(var t={type:e,values:[]},A=this.consumeToken();;){if(A.type===32||xE(A,e))return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue()),A=this.consumeToken()}},n.prototype.consumeFunction=function(e){for(var t={name:e.value,values:[],type:18};;){var A=this.consumeToken();if(A.type===32||A.type===3)return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue())}},n.prototype.consumeToken=function(){var e=this._tokens.shift();return typeof e>"u"?Hc:e},n.prototype.reconsumeToken=function(e){this._tokens.unshift(e)},n})(),ls=function(n){return n.type===15},pr=function(n){return n.type===17},it=function(n){return n.type===20},_E=function(n){return n.type===0},Nc=function(n,e){return it(n)&&n.value===e},Gp=function(n){return n.type!==31},ur=function(n){return n.type!==31&&n.type!==4},zA=function(n){var e=[],t=[];return n.forEach(function(A){if(A.type===4){if(t.length===0)throw new Error("Error parsing function args, zero tokens for arg");e.push(t),t=[];return}A.type!==31&&t.push(A)}),t.length&&e.push(t),e},xE=function(n,e){return e===11&&n.type===12||e===28&&n.type===29?!0:e===2&&n.type===3},Gn=function(n){return n.type===17||n.type===15},Mt=function(n){return n.type===16||Gn(n)},Vp=function(n){return n.length>1?[n[0],n[1]]:[n[0]]},Kt={type:17,number:0,flags:os},yu={type:16,number:50,flags:os},Fn={type:16,number:100,flags:os},Hr=function(n,e,t){var A=n[0],i=n[1];return[st(A,e),st(typeof i<"u"?i:A,t)]},st=function(n,e){if(n.type===16)return n.number/100*e;if(ls(n))switch(n.unit){case"rem":case"em":return 16*n.number;case"px":default:return n.number}return n.number},kp="deg",Kp="grad",zp="rad",Wp="turn",mo={name:"angle",parse:function(n,e){if(e.type===15)switch(e.unit){case kp:return Math.PI*e.number/180;case Kp:return Math.PI/200*e.number;case zp:return e.number;case Wp:return Math.PI*2*e.number}throw new Error("Unsupported angle type")}},Xp=function(n){return n.type===15&&(n.unit===kp||n.unit===Kp||n.unit===zp||n.unit===Wp)},Yp=function(n){var e=n.filter(it).map(function(t){return t.value}).join(" ");switch(e){case"to bottom right":case"to right bottom":case"left top":case"top left":return[Kt,Kt];case"to top":case"bottom":return bA(0);case"to bottom left":case"to left bottom":case"right top":case"top right":return[Kt,Fn];case"to right":case"left":return bA(90);case"to top left":case"to left top":case"right bottom":case"bottom right":return[Fn,Fn];case"to bottom":case"top":return bA(180);case"to top right":case"to right top":case"left bottom":case"bottom left":return[Fn,Kt];case"to left":case"right":return bA(270)}return 0},bA=function(n){return Math.PI*n/180},Rn={name:"color",parse:function(n,e){if(e.type===18){var t=EE[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported color function "'+e.name+'"');return t(n,e.values)}if(e.type===5){if(e.value.length===3){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3);return Tn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),1)}if(e.value.length===4){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3),s=e.value.substring(3,4);return Tn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),parseInt(s+s,16)/255)}if(e.value.length===6){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6);return Tn(parseInt(A,16),parseInt(i,16),parseInt(r,16),1)}if(e.value.length===8){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6),s=e.value.substring(6,8);return Tn(parseInt(A,16),parseInt(i,16),parseInt(r,16),parseInt(s,16)/255)}}if(e.type===20){var a=ln[e.value.toUpperCase()];if(typeof a<"u")return a}return ln.TRANSPARENT}},Dn=function(n){return(255&n)===0},Pt=function(n){var e=255&n,t=255&n>>8,A=255&n>>16,i=255&n>>24;return e<255?"rgba("+i+","+A+","+t+","+e/255+")":"rgb("+i+","+A+","+t+")"},Tn=function(n,e,t,A){return(n<<24|e<<16|t<<8|Math.round(A*255)<<0)>>>0},Eh=function(n,e){if(n.type===17)return n.number;if(n.type===16){var t=e===3?1:255;return e===3?n.number/100*t:Math.round(n.number/100*t)}return 0},yh=function(n,e){var t=e.filter(ur);if(t.length===3){var A=t.map(Eh),i=A[0],r=A[1],s=A[2];return Tn(i,r,s,1)}if(t.length===4){var a=t.map(Eh),i=a[0],r=a[1],s=a[2],o=a[3];return Tn(i,r,s,o)}return 0};function gl(n,e,t){return t<0&&(t+=1),t>=1&&(t-=1),t<1/6?(e-n)*t*6+n:t<1/2?e:t<2/3?(e-n)*6*(2/3-t)+n:n}var Uh=function(n,e){var t=e.filter(ur),A=t[0],i=t[1],r=t[2],s=t[3],a=(A.type===17?bA(A.number):mo.parse(n,A))/(Math.PI*2),o=Mt(i)?i.number/100:0,c=Mt(r)?r.number/100:0,l=typeof s<"u"&&Mt(s)?st(s,1):1;if(o===0)return Tn(c*255,c*255,c*255,1);var u=c<=.5?c*(o+1):c+o-c*o,f=c*2-u,p=gl(f,u,a+1/3),g=gl(f,u,a),m=gl(f,u,a-1/3);return Tn(p*255,g*255,m*255,l)},EE={hsl:Uh,hsla:Uh,rgb:yh,rgba:yh},zr=function(n,e){return Rn.parse(n,Op.create(e).parseComponentValue())},ln={ALICEBLUE:4042850303,ANTIQUEWHITE:4209760255,AQUA:16777215,AQUAMARINE:2147472639,AZURE:4043309055,BEIGE:4126530815,BISQUE:4293182719,BLACK:255,BLANCHEDALMOND:4293643775,BLUE:65535,BLUEVIOLET:2318131967,BROWN:2771004159,BURLYWOOD:3736635391,CADETBLUE:1604231423,CHARTREUSE:2147418367,CHOCOLATE:3530104575,CORAL:4286533887,CORNFLOWERBLUE:1687547391,CORNSILK:4294499583,CRIMSON:3692313855,CYAN:16777215,DARKBLUE:35839,DARKCYAN:9145343,DARKGOLDENROD:3095837695,DARKGRAY:2846468607,DARKGREEN:6553855,DARKGREY:2846468607,DARKKHAKI:3182914559,DARKMAGENTA:2332068863,DARKOLIVEGREEN:1433087999,DARKORANGE:4287365375,DARKORCHID:2570243327,DARKRED:2332033279,DARKSALMON:3918953215,DARKSEAGREEN:2411499519,DARKSLATEBLUE:1211993087,DARKSLATEGRAY:793726975,DARKSLATEGREY:793726975,DARKTURQUOISE:13554175,DARKVIOLET:2483082239,DEEPPINK:4279538687,DEEPSKYBLUE:12582911,DIMGRAY:1768516095,DIMGREY:1768516095,DODGERBLUE:512819199,FIREBRICK:2988581631,FLORALWHITE:4294635775,FORESTGREEN:579543807,FUCHSIA:4278255615,GAINSBORO:3705462015,GHOSTWHITE:4177068031,GOLD:4292280575,GOLDENROD:3668254975,GRAY:2155905279,GREEN:8388863,GREENYELLOW:2919182335,GREY:2155905279,HONEYDEW:4043305215,HOTPINK:4285117695,INDIANRED:3445382399,INDIGO:1258324735,IVORY:4294963455,KHAKI:4041641215,LAVENDER:3873897215,LAVENDERBLUSH:4293981695,LAWNGREEN:2096890111,LEMONCHIFFON:4294626815,LIGHTBLUE:2916673279,LIGHTCORAL:4034953471,LIGHTCYAN:3774873599,LIGHTGOLDENRODYELLOW:4210742015,LIGHTGRAY:3553874943,LIGHTGREEN:2431553791,LIGHTGREY:3553874943,LIGHTPINK:4290167295,LIGHTSALMON:4288707327,LIGHTSEAGREEN:548580095,LIGHTSKYBLUE:2278488831,LIGHTSLATEGRAY:2005441023,LIGHTSLATEGREY:2005441023,LIGHTSTEELBLUE:2965692159,LIGHTYELLOW:4294959359,LIME:16711935,LIMEGREEN:852308735,LINEN:4210091775,MAGENTA:4278255615,MAROON:2147483903,MEDIUMAQUAMARINE:1724754687,MEDIUMBLUE:52735,MEDIUMORCHID:3126187007,MEDIUMPURPLE:2473647103,MEDIUMSEAGREEN:1018393087,MEDIUMSLATEBLUE:2070474495,MEDIUMSPRINGGREEN:16423679,MEDIUMTURQUOISE:1221709055,MEDIUMVIOLETRED:3340076543,MIDNIGHTBLUE:421097727,MINTCREAM:4127193855,MISTYROSE:4293190143,MOCCASIN:4293178879,NAVAJOWHITE:4292783615,NAVY:33023,OLDLACE:4260751103,OLIVE:2155872511,OLIVEDRAB:1804477439,ORANGE:4289003775,ORANGERED:4282712319,ORCHID:3664828159,PALEGOLDENROD:4008225535,PALEGREEN:2566625535,PALETURQUOISE:2951671551,PALEVIOLETRED:3681588223,PAPAYAWHIP:4293907967,PEACHPUFF:4292524543,PERU:3448061951,PINK:4290825215,PLUM:3718307327,POWDERBLUE:2967529215,PURPLE:2147516671,REBECCAPURPLE:1714657791,RED:4278190335,ROSYBROWN:3163525119,ROYALBLUE:1097458175,SADDLEBROWN:2336560127,SALMON:4202722047,SANDYBROWN:4104413439,SEAGREEN:780883967,SEASHELL:4294307583,SIENNA:2689740287,SILVER:3233857791,SKYBLUE:2278484991,SLATEBLUE:1784335871,SLATEGRAY:1887473919,SLATEGREY:1887473919,SNOW:4294638335,SPRINGGREEN:16744447,STEELBLUE:1182971135,TAN:3535047935,TEAL:8421631,THISTLE:3636451583,TOMATO:4284696575,TRANSPARENT:0,TURQUOISE:1088475391,VIOLET:4001558271,WHEAT:4125012991,WHITE:4294967295,WHITESMOKE:4126537215,YELLOW:4294902015,YELLOWGREEN:2597139199},yE={name:"background-clip",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(it(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},UE={name:"background-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Bo=function(n,e){var t=Rn.parse(n,e[0]),A=e[1];return A&&Mt(A)?{color:t,stop:A}:{color:t,stop:null}},Sh=function(n,e){var t=n[0],A=n[n.length-1];t.stop===null&&(t.stop=Kt),A.stop===null&&(A.stop=Fn);for(var i=[],r=0,s=0;s<n.length;s++){var a=n[s].stop;if(a!==null){var o=st(a,e);o>r?i.push(o):i.push(r),r=o}else i.push(null)}for(var c=null,s=0;s<i.length;s++){var l=i[s];if(l===null)c===null&&(c=s);else if(c!==null){for(var u=s-c,f=i[c-1],p=(l-f)/(u+1),g=1;g<=u;g++)i[c+g-1]=p*g;c=null}}return n.map(function(m,d){var h=m.color;return{color:h,stop:Math.max(Math.min(1,i[d]/e),0)}})},SE=function(n,e,t){var A=e/2,i=t/2,r=st(n[0],e)-A,s=i-st(n[1],t);return(Math.atan2(s,r)+Math.PI*2)%(Math.PI*2)},ME=function(n,e,t){var A=typeof n=="number"?n:SE(n,e,t),i=Math.abs(e*Math.sin(A))+Math.abs(t*Math.cos(A)),r=e/2,s=t/2,a=i/2,o=Math.sin(A-Math.PI/2)*a,c=Math.cos(A-Math.PI/2)*a;return[i,r-c,r+c,s-o,s+o]},DA=function(n,e){return Math.sqrt(n*n+e*e)},Mh=function(n,e,t,A,i){var r=[[0,0],[0,e],[n,0],[n,e]];return r.reduce(function(s,a){var o=a[0],c=a[1],l=DA(t-o,A-c);return(i?l<s.optimumDistance:l>s.optimumDistance)?{optimumCorner:a,optimumDistance:l}:s},{optimumDistance:i?1/0:-1/0,optimumCorner:null}).optimumCorner},bE=function(n,e,t,A,i){var r=0,s=0;switch(n.size){case 0:n.shape===0?r=s=Math.min(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.min(Math.abs(e),Math.abs(e-A)),s=Math.min(Math.abs(t),Math.abs(t-i)));break;case 2:if(n.shape===0)r=s=Math.min(DA(e,t),DA(e,t-i),DA(e-A,t),DA(e-A,t-i));else if(n.shape===1){var a=Math.min(Math.abs(t),Math.abs(t-i))/Math.min(Math.abs(e),Math.abs(e-A)),o=Mh(A,i,e,t,!0),c=o[0],l=o[1];r=DA(c-e,(l-t)/a),s=a*r}break;case 1:n.shape===0?r=s=Math.max(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.max(Math.abs(e),Math.abs(e-A)),s=Math.max(Math.abs(t),Math.abs(t-i)));break;case 3:if(n.shape===0)r=s=Math.max(DA(e,t),DA(e,t-i),DA(e-A,t),DA(e-A,t-i));else if(n.shape===1){var a=Math.max(Math.abs(t),Math.abs(t-i))/Math.max(Math.abs(e),Math.abs(e-A)),u=Mh(A,i,e,t,!1),c=u[0],l=u[1];r=DA(c-e,(l-t)/a),s=a*r}break}return Array.isArray(n.size)&&(r=st(n.size[0],A),s=n.size.length===2?st(n.size[1],i):r),[r,s]},FE=function(n,e){var t=bA(180),A=[];return zA(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&s.value==="to"){t=Yp(i);return}else if(Xp(s)){t=mo.parse(n,s);return}}var a=Bo(n,i);A.push(a)}),{angle:t,stops:A,type:1}},ta=function(n,e){var t=bA(180),A=[];return zA(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&["top","left","right","bottom"].indexOf(s.value)!==-1){t=Yp(i);return}else if(Xp(s)){t=(mo.parse(n,s)+bA(270))%bA(360);return}}var a=Bo(n,i);A.push(a)}),{angle:t,stops:A,type:1}},TE=function(n,e){var t=bA(180),A=[],i=1,r=0,s=3,a=[];return zA(e).forEach(function(o,c){var l=o[0];if(c===0){if(it(l)&&l.value==="linear"){i=1;return}else if(it(l)&&l.value==="radial"){i=2;return}}if(l.type===18){if(l.name==="from"){var u=Rn.parse(n,l.values[0]);A.push({stop:Kt,color:u})}else if(l.name==="to"){var u=Rn.parse(n,l.values[0]);A.push({stop:Fn,color:u})}else if(l.name==="color-stop"){var f=l.values.filter(ur);if(f.length===2){var u=Rn.parse(n,f[1]),p=f[0];pr(p)&&A.push({stop:{type:16,number:p.number*100,flags:p.flags},color:u})}}}}),i===1?{angle:(t+bA(180))%bA(360),stops:A,type:i}:{size:s,shape:r,stops:A,position:a,type:i}},Jp="closest-side",Zp="farthest-side",qp="closest-corner",jp="farthest-corner",$p="circle",eg="ellipse",tg="cover",Ag="contain",IE=function(n,e){var t=0,A=3,i=[],r=[];return zA(e).forEach(function(s,a){var o=!0;if(a===0){var c=!1;o=s.reduce(function(u,f){if(c)if(it(f))switch(f.value){case"center":return r.push(yu),u;case"top":case"left":return r.push(Kt),u;case"right":case"bottom":return r.push(Fn),u}else(Mt(f)||Gn(f))&&r.push(f);else if(it(f))switch(f.value){case $p:return t=0,!1;case eg:return t=1,!1;case"at":return c=!0,!1;case Jp:return A=0,!1;case tg:case Zp:return A=1,!1;case Ag:case qp:return A=2,!1;case jp:return A=3,!1}else if(Gn(f)||Mt(f))return Array.isArray(A)||(A=[]),A.push(f),!1;return u},o)}if(o){var l=Bo(n,s);i.push(l)}}),{size:A,shape:t,stops:i,position:r,type:2}},Aa=function(n,e){var t=0,A=3,i=[],r=[];return zA(e).forEach(function(s,a){var o=!0;if(a===0?o=s.reduce(function(l,u){if(it(u))switch(u.value){case"center":return r.push(yu),!1;case"top":case"left":return r.push(Kt),!1;case"right":case"bottom":return r.push(Fn),!1}else if(Mt(u)||Gn(u))return r.push(u),!1;return l},o):a===1&&(o=s.reduce(function(l,u){if(it(u))switch(u.value){case $p:return t=0,!1;case eg:return t=1,!1;case Ag:case Jp:return A=0,!1;case Zp:return A=1,!1;case qp:return A=2,!1;case tg:case jp:return A=3,!1}else if(Gn(u)||Mt(u))return Array.isArray(A)||(A=[]),A.push(u),!1;return l},o)),o){var c=Bo(n,s);i.push(c)}}),{size:A,shape:t,stops:i,position:r,type:2}},QE=function(n){return n.type===1},LE=function(n){return n.type===2},Uu={name:"image",parse:function(n,e){if(e.type===22){var t={url:e.value,type:0};return n.cache.addImage(e.value),t}if(e.type===18){var A=ng[e.name];if(typeof A>"u")throw new Error('Attempting to parse an unsupported image function "'+e.name+'"');return A(n,e.values)}throw new Error("Unsupported image type "+e.type)}};function RE(n){return!(n.type===20&&n.value==="none")&&(n.type!==18||!!ng[n.name])}var ng={"linear-gradient":FE,"-moz-linear-gradient":ta,"-ms-linear-gradient":ta,"-o-linear-gradient":ta,"-webkit-linear-gradient":ta,"radial-gradient":IE,"-moz-radial-gradient":Aa,"-ms-radial-gradient":Aa,"-o-radial-gradient":Aa,"-webkit-radial-gradient":Aa,"-webkit-gradient":TE},DE={name:"background-image",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e.filter(function(A){return ur(A)&&RE(A)}).map(function(A){return Uu.parse(n,A)})}},PE={name:"background-origin",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(it(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},HE={name:"background-position",initialValue:"0% 0%",type:1,prefix:!1,parse:function(n,e){return zA(e).map(function(t){return t.filter(Mt)}).map(Vp)}},NE={name:"background-repeat",initialValue:"repeat",prefix:!1,type:1,parse:function(n,e){return zA(e).map(function(t){return t.filter(it).map(function(A){return A.value}).join(" ")}).map(OE)}},OE=function(n){switch(n){case"no-repeat":return 1;case"repeat-x":case"repeat no-repeat":return 2;case"repeat-y":case"no-repeat repeat":return 3;case"repeat":default:return 0}},tr;(function(n){n.AUTO="auto",n.CONTAIN="contain",n.COVER="cover"})(tr||(tr={}));var GE={name:"background-size",initialValue:"0",prefix:!1,type:1,parse:function(n,e){return zA(e).map(function(t){return t.filter(VE)})}},VE=function(n){return it(n)||Mt(n)},wo=function(n){return{name:"border-"+n+"-color",initialValue:"transparent",prefix:!1,type:3,format:"color"}},kE=wo("top"),KE=wo("right"),zE=wo("bottom"),WE=wo("left"),vo=function(n){return{name:"border-radius-"+n,initialValue:"0 0",prefix:!1,type:1,parse:function(e,t){return Vp(t.filter(Mt))}}},XE=vo("top-left"),YE=vo("top-right"),JE=vo("bottom-right"),ZE=vo("bottom-left"),Co=function(n){return{name:"border-"+n+"-style",initialValue:"solid",prefix:!1,type:2,parse:function(e,t){switch(t){case"none":return 0;case"dashed":return 2;case"dotted":return 3;case"double":return 4}return 1}}},qE=Co("top"),jE=Co("right"),$E=Co("bottom"),ey=Co("left"),_o=function(n){return{name:"border-"+n+"-width",initialValue:"0",type:0,prefix:!1,parse:function(e,t){return ls(t)?t.number:0}}},ty=_o("top"),Ay=_o("right"),ny=_o("bottom"),iy=_o("left"),ry={name:"color",initialValue:"transparent",prefix:!1,type:3,format:"color"},sy={name:"direction",initialValue:"ltr",prefix:!1,type:2,parse:function(n,e){switch(e){case"rtl":return 1;case"ltr":default:return 0}}},ay={name:"display",initialValue:"inline-block",prefix:!1,type:1,parse:function(n,e){return e.filter(it).reduce(function(t,A){return t|oy(A.value)},0)}},oy=function(n){switch(n){case"block":case"-webkit-box":return 2;case"inline":return 4;case"run-in":return 8;case"flow":return 16;case"flow-root":return 32;case"table":return 64;case"flex":case"-webkit-flex":return 128;case"grid":case"-ms-grid":return 256;case"ruby":return 512;case"subgrid":return 1024;case"list-item":return 2048;case"table-row-group":return 4096;case"table-header-group":return 8192;case"table-footer-group":return 16384;case"table-row":return 32768;case"table-cell":return 65536;case"table-column-group":return 131072;case"table-column":return 262144;case"table-caption":return 524288;case"ruby-base":return 1048576;case"ruby-text":return 2097152;case"ruby-base-container":return 4194304;case"ruby-text-container":return 8388608;case"contents":return 16777216;case"inline-block":return 33554432;case"inline-list-item":return 67108864;case"inline-table":return 134217728;case"inline-flex":return 268435456;case"inline-grid":return 536870912}return 0},ly={name:"float",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"left":return 1;case"right":return 2;case"inline-start":return 3;case"inline-end":return 4}return 0}},cy={name:"letter-spacing",initialValue:"0",prefix:!1,type:0,parse:function(n,e){return e.type===20&&e.value==="normal"?0:e.type===17||e.type===15?e.number:0}},ka;(function(n){n.NORMAL="normal",n.STRICT="strict"})(ka||(ka={}));var uy={name:"line-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"strict":return ka.STRICT;case"normal":default:return ka.NORMAL}}},fy={name:"line-height",initialValue:"normal",prefix:!1,type:4},bh=function(n,e){return it(n)&&n.value==="normal"?1.2*e:n.type===17?e*n.number:Mt(n)?st(n,e):e},hy={name:"list-style-image",initialValue:"none",type:0,prefix:!1,parse:function(n,e){return e.type===20&&e.value==="none"?null:Uu.parse(n,e)}},dy={name:"list-style-position",initialValue:"outside",prefix:!1,type:2,parse:function(n,e){switch(e){case"inside":return 0;case"outside":default:return 1}}},Oc={name:"list-style-type",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"disc":return 0;case"circle":return 1;case"square":return 2;case"decimal":return 3;case"cjk-decimal":return 4;case"decimal-leading-zero":return 5;case"lower-roman":return 6;case"upper-roman":return 7;case"lower-greek":return 8;case"lower-alpha":return 9;case"upper-alpha":return 10;case"arabic-indic":return 11;case"armenian":return 12;case"bengali":return 13;case"cambodian":return 14;case"cjk-earthly-branch":return 15;case"cjk-heavenly-stem":return 16;case"cjk-ideographic":return 17;case"devanagari":return 18;case"ethiopic-numeric":return 19;case"georgian":return 20;case"gujarati":return 21;case"gurmukhi":return 22;case"hebrew":return 22;case"hiragana":return 23;case"hiragana-iroha":return 24;case"japanese-formal":return 25;case"japanese-informal":return 26;case"kannada":return 27;case"katakana":return 28;case"katakana-iroha":return 29;case"khmer":return 30;case"korean-hangul-formal":return 31;case"korean-hanja-formal":return 32;case"korean-hanja-informal":return 33;case"lao":return 34;case"lower-armenian":return 35;case"malayalam":return 36;case"mongolian":return 37;case"myanmar":return 38;case"oriya":return 39;case"persian":return 40;case"simp-chinese-formal":return 41;case"simp-chinese-informal":return 42;case"tamil":return 43;case"telugu":return 44;case"thai":return 45;case"tibetan":return 46;case"trad-chinese-formal":return 47;case"trad-chinese-informal":return 48;case"upper-armenian":return 49;case"disclosure-open":return 50;case"disclosure-closed":return 51;case"none":default:return-1}}},xo=function(n){return{name:"margin-"+n,initialValue:"0",prefix:!1,type:4}},py=xo("top"),gy=xo("right"),my=xo("bottom"),By=xo("left"),wy={name:"overflow",initialValue:"visible",prefix:!1,type:1,parse:function(n,e){return e.filter(it).map(function(t){switch(t.value){case"hidden":return 1;case"scroll":return 2;case"clip":return 3;case"auto":return 4;case"visible":default:return 0}})}},vy={name:"overflow-wrap",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-word":return"break-word";case"normal":default:return"normal"}}},Eo=function(n){return{name:"padding-"+n,initialValue:"0",prefix:!1,type:3,format:"length-percentage"}},Cy=Eo("top"),_y=Eo("right"),xy=Eo("bottom"),Ey=Eo("left"),yy={name:"text-align",initialValue:"left",prefix:!1,type:2,parse:function(n,e){switch(e){case"right":return 2;case"center":case"justify":return 1;case"left":default:return 0}}},Uy={name:"position",initialValue:"static",prefix:!1,type:2,parse:function(n,e){switch(e){case"relative":return 1;case"absolute":return 2;case"fixed":return 3;case"sticky":return 4}return 0}},Sy={name:"text-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&Nc(e[0],"none")?[]:zA(e).map(function(t){for(var A={color:ln.TRANSPARENT,offsetX:Kt,offsetY:Kt,blur:Kt},i=0,r=0;r<t.length;r++){var s=t[r];Gn(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:A.blur=s,i++):A.color=Rn.parse(n,s)}return A})}},My={name:"text-transform",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"uppercase":return 2;case"lowercase":return 1;case"capitalize":return 3}return 0}},by={name:"transform",initialValue:"none",prefix:!0,type:0,parse:function(n,e){if(e.type===20&&e.value==="none")return null;if(e.type===18){var t=Iy[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported transform function "'+e.name+'"');return t(e.values)}return null}},Fy=function(n){var e=n.filter(function(t){return t.type===17}).map(function(t){return t.number});return e.length===6?e:null},Ty=function(n){var e=n.filter(function(o){return o.type===17}).map(function(o){return o.number}),t=e[0],A=e[1];e[2],e[3];var i=e[4],r=e[5];e[6],e[7],e[8],e[9],e[10],e[11];var s=e[12],a=e[13];return e[14],e[15],e.length===16?[t,A,i,r,s,a]:null},Iy={matrix:Fy,matrix3d:Ty},Fh={type:16,number:50,flags:os},Qy=[Fh,Fh],Ly={name:"transform-origin",initialValue:"50% 50%",prefix:!0,type:1,parse:function(n,e){var t=e.filter(Mt);return t.length!==2?Qy:[t[0],t[1]]}},Ry={name:"visible",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"hidden":return 1;case"collapse":return 2;case"visible":default:return 0}}},Wr;(function(n){n.NORMAL="normal",n.BREAK_ALL="break-all",n.KEEP_ALL="keep-all"})(Wr||(Wr={}));var Dy={name:"word-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-all":return Wr.BREAK_ALL;case"keep-all":return Wr.KEEP_ALL;case"normal":default:return Wr.NORMAL}}},Py={name:"z-index",initialValue:"auto",prefix:!1,type:0,parse:function(n,e){if(e.type===20)return{auto:!0,order:0};if(pr(e))return{auto:!1,order:e.number};throw new Error("Invalid z-index number parsed")}},ig={name:"time",parse:function(n,e){if(e.type===15)switch(e.unit.toLowerCase()){case"s":return 1e3*e.number;case"ms":return e.number}throw new Error("Unsupported time type")}},Hy={name:"opacity",initialValue:"1",type:0,prefix:!1,parse:function(n,e){return pr(e)?e.number:1}},Ny={name:"text-decoration-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Oy={name:"text-decoration-line",initialValue:"none",prefix:!1,type:1,parse:function(n,e){return e.filter(it).map(function(t){switch(t.value){case"underline":return 1;case"overline":return 2;case"line-through":return 3;case"none":return 4}return 0}).filter(function(t){return t!==0})}},Gy={name:"font-family",initialValue:"",prefix:!1,type:1,parse:function(n,e){var t=[],A=[];return e.forEach(function(i){switch(i.type){case 20:case 0:t.push(i.value);break;case 17:t.push(i.number.toString());break;case 4:A.push(t.join(" ")),t.length=0;break}}),t.length&&A.push(t.join(" ")),A.map(function(i){return i.indexOf(" ")===-1?i:"'"+i+"'"})}},Vy={name:"font-size",initialValue:"0",prefix:!1,type:3,format:"length"},ky={name:"font-weight",initialValue:"normal",type:0,prefix:!1,parse:function(n,e){if(pr(e))return e.number;if(it(e))switch(e.value){case"bold":return 700;case"normal":default:return 400}return 400}},Ky={name:"font-variant",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.filter(it).map(function(t){return t.value})}},zy={name:"font-style",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"oblique":return"oblique";case"italic":return"italic";case"normal":default:return"normal"}}},Qt=function(n,e){return(n&e)!==0},Wy={name:"content",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e}},Xy={name:"counter-increment",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;for(var A=[],i=e.filter(Gp),r=0;r<i.length;r++){var s=i[r],a=i[r+1];if(s.type===20){var o=a&&pr(a)?a.number:1;A.push({counter:s.value,increment:o})}}return A}},Yy={name:"counter-reset",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return[];for(var t=[],A=e.filter(Gp),i=0;i<A.length;i++){var r=A[i],s=A[i+1];if(it(r)&&r.value!=="none"){var a=s&&pr(s)?s.number:0;t.push({counter:r.value,reset:a})}}return t}},Jy={name:"duration",initialValue:"0s",prefix:!1,type:1,parse:function(n,e){return e.filter(ls).map(function(t){return ig.parse(n,t)})}},Zy={name:"quotes",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;var A=[],i=e.filter(_E);if(i.length%2!==0)return null;for(var r=0;r<i.length;r+=2){var s=i[r].value,a=i[r+1].value;A.push({open:s,close:a})}return A}},Th=function(n,e,t){if(!n)return"";var A=n[Math.min(e,n.length-1)];return A?t?A.open:A.close:""},qy={name:"box-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&Nc(e[0],"none")?[]:zA(e).map(function(t){for(var A={color:255,offsetX:Kt,offsetY:Kt,blur:Kt,spread:Kt,inset:!1},i=0,r=0;r<t.length;r++){var s=t[r];Nc(s,"inset")?A.inset=!0:Gn(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:i===2?A.blur=s:A.spread=s,i++):A.color=Rn.parse(n,s)}return A})}},jy={name:"paint-order",initialValue:"normal",prefix:!1,type:1,parse:function(n,e){var t=[0,1,2],A=[];return e.filter(it).forEach(function(i){switch(i.value){case"stroke":A.push(1);break;case"fill":A.push(0);break;case"markers":A.push(2);break}}),t.forEach(function(i){A.indexOf(i)===-1&&A.push(i)}),A}},$y={name:"-webkit-text-stroke-color",initialValue:"currentcolor",prefix:!1,type:3,format:"color"},eU={name:"-webkit-text-stroke-width",initialValue:"0",type:0,prefix:!1,parse:function(n,e){return ls(e)?e.number:0}},tU=(function(){function n(e,t){var A,i;this.animationDuration=de(e,Jy,t.animationDuration),this.backgroundClip=de(e,yE,t.backgroundClip),this.backgroundColor=de(e,UE,t.backgroundColor),this.backgroundImage=de(e,DE,t.backgroundImage),this.backgroundOrigin=de(e,PE,t.backgroundOrigin),this.backgroundPosition=de(e,HE,t.backgroundPosition),this.backgroundRepeat=de(e,NE,t.backgroundRepeat),this.backgroundSize=de(e,GE,t.backgroundSize),this.borderTopColor=de(e,kE,t.borderTopColor),this.borderRightColor=de(e,KE,t.borderRightColor),this.borderBottomColor=de(e,zE,t.borderBottomColor),this.borderLeftColor=de(e,WE,t.borderLeftColor),this.borderTopLeftRadius=de(e,XE,t.borderTopLeftRadius),this.borderTopRightRadius=de(e,YE,t.borderTopRightRadius),this.borderBottomRightRadius=de(e,JE,t.borderBottomRightRadius),this.borderBottomLeftRadius=de(e,ZE,t.borderBottomLeftRadius),this.borderTopStyle=de(e,qE,t.borderTopStyle),this.borderRightStyle=de(e,jE,t.borderRightStyle),this.borderBottomStyle=de(e,$E,t.borderBottomStyle),this.borderLeftStyle=de(e,ey,t.borderLeftStyle),this.borderTopWidth=de(e,ty,t.borderTopWidth),this.borderRightWidth=de(e,Ay,t.borderRightWidth),this.borderBottomWidth=de(e,ny,t.borderBottomWidth),this.borderLeftWidth=de(e,iy,t.borderLeftWidth),this.boxShadow=de(e,qy,t.boxShadow),this.color=de(e,ry,t.color),this.direction=de(e,sy,t.direction),this.display=de(e,ay,t.display),this.float=de(e,ly,t.cssFloat),this.fontFamily=de(e,Gy,t.fontFamily),this.fontSize=de(e,Vy,t.fontSize),this.fontStyle=de(e,zy,t.fontStyle),this.fontVariant=de(e,Ky,t.fontVariant),this.fontWeight=de(e,ky,t.fontWeight),this.letterSpacing=de(e,cy,t.letterSpacing),this.lineBreak=de(e,uy,t.lineBreak),this.lineHeight=de(e,fy,t.lineHeight),this.listStyleImage=de(e,hy,t.listStyleImage),this.listStylePosition=de(e,dy,t.listStylePosition),this.listStyleType=de(e,Oc,t.listStyleType),this.marginTop=de(e,py,t.marginTop),this.marginRight=de(e,gy,t.marginRight),this.marginBottom=de(e,my,t.marginBottom),this.marginLeft=de(e,By,t.marginLeft),this.opacity=de(e,Hy,t.opacity);var r=de(e,wy,t.overflow);this.overflowX=r[0],this.overflowY=r[r.length>1?1:0],this.overflowWrap=de(e,vy,t.overflowWrap),this.paddingTop=de(e,Cy,t.paddingTop),this.paddingRight=de(e,_y,t.paddingRight),this.paddingBottom=de(e,xy,t.paddingBottom),this.paddingLeft=de(e,Ey,t.paddingLeft),this.paintOrder=de(e,jy,t.paintOrder),this.position=de(e,Uy,t.position),this.textAlign=de(e,yy,t.textAlign),this.textDecorationColor=de(e,Ny,(A=t.textDecorationColor)!==null&&A!==void 0?A:t.color),this.textDecorationLine=de(e,Oy,(i=t.textDecorationLine)!==null&&i!==void 0?i:t.textDecoration),this.textShadow=de(e,Sy,t.textShadow),this.textTransform=de(e,My,t.textTransform),this.transform=de(e,by,t.transform),this.transformOrigin=de(e,Ly,t.transformOrigin),this.visibility=de(e,Ry,t.visibility),this.webkitTextStrokeColor=de(e,$y,t.webkitTextStrokeColor),this.webkitTextStrokeWidth=de(e,eU,t.webkitTextStrokeWidth),this.wordBreak=de(e,Dy,t.wordBreak),this.zIndex=de(e,Py,t.zIndex)}return n.prototype.isVisible=function(){return this.display>0&&this.opacity>0&&this.visibility===0},n.prototype.isTransparent=function(){return Dn(this.backgroundColor)},n.prototype.isTransformed=function(){return this.transform!==null},n.prototype.isPositioned=function(){return this.position!==0},n.prototype.isPositionedWithZIndex=function(){return this.isPositioned()&&!this.zIndex.auto},n.prototype.isFloating=function(){return this.float!==0},n.prototype.isInlineLevel=function(){return Qt(this.display,4)||Qt(this.display,33554432)||Qt(this.display,268435456)||Qt(this.display,536870912)||Qt(this.display,67108864)||Qt(this.display,134217728)},n})(),AU=(function(){function n(e,t){this.content=de(e,Wy,t.content),this.quotes=de(e,Zy,t.quotes)}return n})(),Ih=(function(){function n(e,t){this.counterIncrement=de(e,Xy,t.counterIncrement),this.counterReset=de(e,Yy,t.counterReset)}return n})(),de=function(n,e,t){var A=new Np,i=t!==null&&typeof t<"u"?t.toString():e.initialValue;A.write(i);var r=new Op(A.read());switch(e.type){case 2:var s=r.parseComponentValue();return e.parse(n,it(s)?s.value:e.initialValue);case 0:return e.parse(n,r.parseComponentValue());case 1:return e.parse(n,r.parseComponentValues());case 4:return r.parseComponentValue();case 3:switch(e.format){case"angle":return mo.parse(n,r.parseComponentValue());case"color":return Rn.parse(n,r.parseComponentValue());case"image":return Uu.parse(n,r.parseComponentValue());case"length":var a=r.parseComponentValue();return Gn(a)?a:Kt;case"length-percentage":var o=r.parseComponentValue();return Mt(o)?o:Kt;case"time":return ig.parse(n,r.parseComponentValue())}break}},nU="data-html2canvas-debug",iU=function(n){var e=n.getAttribute(nU);switch(e){case"all":return 1;case"clone":return 2;case"parse":return 3;case"render":return 4;default:return 0}},Gc=function(n,e){var t=iU(n);return t===1||e===t},WA=(function(){function n(e,t){if(this.context=e,this.textNodes=[],this.elements=[],this.flags=0,Gc(t,3))debugger;this.styles=new tU(e,window.getComputedStyle(t,null)),Kc(t)&&(this.styles.animationDuration.some(function(A){return A>0})&&(t.style.animationDuration="0s"),this.styles.transform!==null&&(t.style.transform="none")),this.bounds=po(this.context,t),Gc(t,4)&&(this.flags|=16)}return n})(),rU="AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=",Qh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Nr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var na=0;na<Qh.length;na++)Nr[Qh.charCodeAt(na)]=na;var sU=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var c=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),l=Array.isArray(c)?c:new Uint8Array(c);for(A=0;A<t;A+=4)r=Nr[n.charCodeAt(A)],s=Nr[n.charCodeAt(A+1)],a=Nr[n.charCodeAt(A+2)],o=Nr[n.charCodeAt(A+3)],l[i++]=r<<2|s>>4,l[i++]=(s&15)<<4|a>>2,l[i++]=(a&3)<<6|o&63;return c},aU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},oU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},ai=5,Su=11,ml=2,lU=Su-ai,rg=65536>>ai,cU=1<<ai,Bl=cU-1,uU=1024>>ai,fU=rg+uU,hU=fU,dU=32,pU=hU+dU,gU=65536>>Su,mU=1<<lU,BU=mU-1,Lh=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},wU=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},vU=function(n,e){var t=sU(n),A=Array.isArray(t)?oU(t):new Uint32Array(t),i=Array.isArray(t)?aU(t):new Uint16Array(t),r=24,s=Lh(i,r/2,A[4]/2),a=A[5]===2?Lh(i,(r+A[4])/2):wU(A,Math.ceil((r+A[4])/4));return new CU(A[0],A[1],A[2],A[3],s,a)},CU=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>ai],t=(t<<ml)+(e&Bl),this.data[t];if(e<=65535)return t=this.index[rg+(e-55296>>ai)],t=(t<<ml)+(e&Bl),this.data[t];if(e<this.highStart)return t=pU-gU+(e>>Su),t=this.index[t],t+=e>>ai&BU,t=this.index[t],t=(t<<ml)+(e&Bl),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),Rh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_U=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var ia=0;ia<Rh.length;ia++)_U[Rh.charCodeAt(ia)]=ia;var xU=1,wl=2,vl=3,Dh=4,Ph=5,EU=7,Hh=8,Cl=9,_l=10,Nh=11,Oh=12,Gh=13,Vh=14,xl=15,yU=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},UU=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},SU=vU(rU),_A="×",El="÷",MU=function(n){return SU.get(n)},bU=function(n,e,t){var A=t-2,i=e[A],r=e[t-1],s=e[t];if(r===wl&&s===vl)return _A;if(r===wl||r===vl||r===Dh||s===wl||s===vl||s===Dh)return El;if(r===Hh&&[Hh,Cl,Nh,Oh].indexOf(s)!==-1||(r===Nh||r===Cl)&&(s===Cl||s===_l)||(r===Oh||r===_l)&&s===_l||s===Gh||s===Ph||s===EU||r===xU)return _A;if(r===Gh&&s===Vh){for(;i===Ph;)i=e[--A];if(i===Vh)return _A}if(r===xl&&s===xl){for(var a=0;i===xl;)a++,i=e[--A];if(a%2===0)return _A}return El},FU=function(n){var e=yU(n),t=e.length,A=0,i=0,r=e.map(MU);return{next:function(){if(A>=t)return{done:!0,value:null};for(var s=_A;A<t&&(s=bU(e,r,++A))===_A;);if(s!==_A||A===t){var a=UU.apply(null,e.slice(i,A));return i=A,{value:a,done:!1}}return{done:!0,value:null}}}},TU=function(n){for(var e=FU(n),t=[],A;!(A=e.next()).done;)A.value&&t.push(A.value.slice());return t},IU=function(n){var e=123;if(n.createRange){var t=n.createRange();if(t.getBoundingClientRect){var A=n.createElement("boundtest");A.style.height=e+"px",A.style.display="block",n.body.appendChild(A),t.selectNode(A);var i=t.getBoundingClientRect(),r=Math.round(i.height);if(n.body.removeChild(A),r===e)return!0}}return!1},QU=function(n){var e=n.createElement("boundtest");e.style.width="50px",e.style.display="block",e.style.fontSize="12px",e.style.letterSpacing="0px",e.style.wordSpacing="0px",n.body.appendChild(e);var t=n.createRange();e.innerHTML=typeof"".repeat=="function"?"&#128104;".repeat(10):"";var A=e.firstChild,i=go(A.data).map(function(o){return Ct(o)}),r=0,s={},a=i.every(function(o,c){t.setStart(A,r),t.setEnd(A,r+o.length);var l=t.getBoundingClientRect();r+=o.length;var u=l.x>s.x||l.y>s.y;return s=l,c===0?!0:u});return n.body.removeChild(e),a},LU=function(){return typeof new Image().crossOrigin<"u"},RU=function(){return typeof new XMLHttpRequest().responseType=="string"},DU=function(n){var e=new Image,t=n.createElement("canvas"),A=t.getContext("2d");if(!A)return!1;e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{A.drawImage(e,0,0),t.toDataURL()}catch{return!1}return!0},kh=function(n){return n[0]===0&&n[1]===255&&n[2]===0&&n[3]===255},PU=function(n){var e=n.createElement("canvas"),t=100;e.width=t,e.height=t;var A=e.getContext("2d");if(!A)return Promise.reject(!1);A.fillStyle="rgb(0, 255, 0)",A.fillRect(0,0,t,t);var i=new Image,r=e.toDataURL();i.src=r;var s=Vc(t,t,0,0,i);return A.fillStyle="red",A.fillRect(0,0,t,t),Kh(s).then(function(a){A.drawImage(a,0,0);var o=A.getImageData(0,0,t,t).data;A.fillStyle="red",A.fillRect(0,0,t,t);var c=n.createElement("div");return c.style.backgroundImage="url("+r+")",c.style.height=t+"px",kh(o)?Kh(Vc(t,t,0,0,c)):Promise.reject(!1)}).then(function(a){return A.drawImage(a,0,0),kh(A.getImageData(0,0,t,t).data)}).catch(function(){return!1})},Vc=function(n,e,t,A,i){var r="http://www.w3.org/2000/svg",s=document.createElementNS(r,"svg"),a=document.createElementNS(r,"foreignObject");return s.setAttributeNS(null,"width",n.toString()),s.setAttributeNS(null,"height",e.toString()),a.setAttributeNS(null,"width","100%"),a.setAttributeNS(null,"height","100%"),a.setAttributeNS(null,"x",t.toString()),a.setAttributeNS(null,"y",A.toString()),a.setAttributeNS(null,"externalResourcesRequired","true"),s.appendChild(a),a.appendChild(i),s},Kh=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){return e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},kt={get SUPPORT_RANGE_BOUNDS(){var n=IU(document);return Object.defineProperty(kt,"SUPPORT_RANGE_BOUNDS",{value:n}),n},get SUPPORT_WORD_BREAKING(){var n=kt.SUPPORT_RANGE_BOUNDS&&QU(document);return Object.defineProperty(kt,"SUPPORT_WORD_BREAKING",{value:n}),n},get SUPPORT_SVG_DRAWING(){var n=DU(document);return Object.defineProperty(kt,"SUPPORT_SVG_DRAWING",{value:n}),n},get SUPPORT_FOREIGNOBJECT_DRAWING(){var n=typeof Array.from=="function"&&typeof window.fetch=="function"?PU(document):Promise.resolve(!1);return Object.defineProperty(kt,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:n}),n},get SUPPORT_CORS_IMAGES(){var n=LU();return Object.defineProperty(kt,"SUPPORT_CORS_IMAGES",{value:n}),n},get SUPPORT_RESPONSE_TYPE(){var n=RU();return Object.defineProperty(kt,"SUPPORT_RESPONSE_TYPE",{value:n}),n},get SUPPORT_CORS_XHR(){var n="withCredentials"in new XMLHttpRequest;return Object.defineProperty(kt,"SUPPORT_CORS_XHR",{value:n}),n},get SUPPORT_NATIVE_TEXT_SEGMENTATION(){var n=!!(typeof Intl<"u"&&Intl.Segmenter);return Object.defineProperty(kt,"SUPPORT_NATIVE_TEXT_SEGMENTATION",{value:n}),n}},Xr=(function(){function n(e,t){this.text=e,this.bounds=t}return n})(),HU=function(n,e,t,A){var i=GU(e,t),r=[],s=0;return i.forEach(function(a){if(t.textDecorationLine.length||a.trim().length>0)if(kt.SUPPORT_RANGE_BOUNDS){var o=zh(A,s,a.length).getClientRects();if(o.length>1){var c=Mu(a),l=0;c.forEach(function(f){r.push(new Xr(f,fn.fromDOMRectList(n,zh(A,l+s,f.length).getClientRects()))),l+=f.length})}else r.push(new Xr(a,fn.fromDOMRectList(n,o)))}else{var u=A.splitText(a.length);r.push(new Xr(a,NU(n,A))),A=u}else kt.SUPPORT_RANGE_BOUNDS||(A=A.splitText(a.length));s+=a.length}),r},NU=function(n,e){var t=e.ownerDocument;if(t){var A=t.createElement("html2canvaswrapper");A.appendChild(e.cloneNode(!0));var i=e.parentNode;if(i){i.replaceChild(A,e);var r=po(n,A);return A.firstChild&&i.replaceChild(A.firstChild,A),r}}return fn.EMPTY},zh=function(n,e,t){var A=n.ownerDocument;if(!A)throw new Error("Node has no owner document");var i=A.createRange();return i.setStart(n,e),i.setEnd(n,e+t),i},Mu=function(n){if(kt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var e=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(e.segment(n)).map(function(t){return t.segment})}return TU(n)},OU=function(n,e){if(kt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var t=new Intl.Segmenter(void 0,{granularity:"word"});return Array.from(t.segment(n)).map(function(A){return A.segment})}return kU(n,e)},GU=function(n,e){return e.letterSpacing!==0?Mu(n):OU(n,e)},VU=[32,160,4961,65792,65793,4153,4241],kU=function(n,e){for(var t=gx(n,{lineBreak:e.lineBreak,wordBreak:e.overflowWrap==="break-word"?"break-word":e.wordBreak}),A=[],i,r=function(){if(i.value){var s=i.value.slice(),a=go(s),o="";a.forEach(function(c){VU.indexOf(c)===-1?o+=Ct(c):(o.length&&A.push(o),A.push(Ct(c)),o="")}),o.length&&A.push(o)}};!(i=t.next()).done;)r();return A},KU=(function(){function n(e,t,A){this.text=zU(t.data,A.textTransform),this.textBounds=HU(e,this.text,A,t)}return n})(),zU=function(n,e){switch(e){case 1:return n.toLowerCase();case 3:return n.replace(WU,XU);case 2:return n.toUpperCase();default:return n}},WU=/(^|\s|:|-|\(|\))([a-z])/g,XU=function(n,e,t){return n.length>0?e+t.toUpperCase():n},sg=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.src=A.currentSrc||A.src,i.intrinsicWidth=A.naturalWidth,i.intrinsicHeight=A.naturalHeight,i.context.cache.addImage(i.src),i}return e})(WA),ag=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A,i.intrinsicWidth=A.width,i.intrinsicHeight=A.height,i}return e})(WA),og=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=new XMLSerializer,s=po(t,A);return A.setAttribute("width",s.width+"px"),A.setAttribute("height",s.height+"px"),i.svg="data:image/svg+xml,"+encodeURIComponent(r.serializeToString(A)),i.intrinsicWidth=A.width.baseVal.value,i.intrinsicHeight=A.height.baseVal.value,i.context.cache.addImage(i.svg),i}return e})(WA),lg=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(WA),kc=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.start=A.start,i.reversed=typeof A.reversed=="boolean"&&A.reversed===!0,i}return e})(WA),YU=[{type:15,flags:0,unit:"px",number:3}],JU=[{type:16,flags:0,number:50}],ZU=function(n){return n.width>n.height?new fn(n.left+(n.width-n.height)/2,n.top,n.height,n.height):n.width<n.height?new fn(n.left,n.top+(n.height-n.width)/2,n.width,n.width):n},qU=function(n){var e=n.type===jU?new Array(n.value.length+1).join("•"):n.value;return e.length===0?n.placeholder||"":e},Ka="checkbox",za="radio",jU="password",Wh=707406591,bu=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;switch(i.type=A.type.toLowerCase(),i.checked=A.checked,i.value=qU(A),(i.type===Ka||i.type===za)&&(i.styles.backgroundColor=3739148031,i.styles.borderTopColor=i.styles.borderRightColor=i.styles.borderBottomColor=i.styles.borderLeftColor=2779096575,i.styles.borderTopWidth=i.styles.borderRightWidth=i.styles.borderBottomWidth=i.styles.borderLeftWidth=1,i.styles.borderTopStyle=i.styles.borderRightStyle=i.styles.borderBottomStyle=i.styles.borderLeftStyle=1,i.styles.backgroundClip=[0],i.styles.backgroundOrigin=[0],i.bounds=ZU(i.bounds)),i.type){case Ka:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=YU;break;case za:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=JU;break}return i}return e})(WA),cg=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=A.options[A.selectedIndex||0];return i.value=r&&r.text||"",i}return e})(WA),ug=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(WA),fg=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;i.src=A.src,i.width=parseInt(A.width,10)||0,i.height=parseInt(A.height,10)||0,i.backgroundColor=i.styles.backgroundColor;try{if(A.contentWindow&&A.contentWindow.document&&A.contentWindow.document.documentElement){i.tree=dg(t,A.contentWindow.document.documentElement);var r=A.contentWindow.document.documentElement?zr(t,getComputedStyle(A.contentWindow.document.documentElement).backgroundColor):ln.TRANSPARENT,s=A.contentWindow.document.body?zr(t,getComputedStyle(A.contentWindow.document.body).backgroundColor):ln.TRANSPARENT;i.backgroundColor=Dn(r)?Dn(s)?i.styles.backgroundColor:s:r}}catch{}return i}return e})(WA),$U=["OL","UL","MENU"],Ma=function(n,e,t,A){for(var i=e.firstChild,r=void 0;i;i=r)if(r=i.nextSibling,pg(i)&&i.data.trim().length>0)t.textNodes.push(new KU(n,i,t.styles));else if(Yi(i))if(wg(i)&&i.assignedNodes)i.assignedNodes().forEach(function(a){return Ma(n,a,t,A)});else{var s=hg(n,i);s.styles.isVisible()&&(eS(i,s,A)?s.flags|=4:tS(s.styles)&&(s.flags|=2),$U.indexOf(i.tagName)!==-1&&(s.flags|=8),t.elements.push(s),i.slot,i.shadowRoot?Ma(n,i.shadowRoot,s,A):!Wa(i)&&!gg(i)&&!Xa(i)&&Ma(n,i,s,A))}},hg=function(n,e){return zc(e)?new sg(n,e):mg(e)?new ag(n,e):gg(e)?new og(n,e):AS(e)?new lg(n,e):nS(e)?new kc(n,e):iS(e)?new bu(n,e):Xa(e)?new cg(n,e):Wa(e)?new ug(n,e):Bg(e)?new fg(n,e):new WA(n,e)},dg=function(n,e){var t=hg(n,e);return t.flags|=4,Ma(n,e,t,t),t},eS=function(n,e,t){return e.styles.isPositionedWithZIndex()||e.styles.opacity<1||e.styles.isTransformed()||Fu(n)&&t.styles.isTransparent()},tS=function(n){return n.isPositioned()||n.isFloating()},pg=function(n){return n.nodeType===Node.TEXT_NODE},Yi=function(n){return n.nodeType===Node.ELEMENT_NODE},Kc=function(n){return Yi(n)&&typeof n.style<"u"&&!ba(n)},ba=function(n){return typeof n.className=="object"},AS=function(n){return n.tagName==="LI"},nS=function(n){return n.tagName==="OL"},iS=function(n){return n.tagName==="INPUT"},rS=function(n){return n.tagName==="HTML"},gg=function(n){return n.tagName==="svg"},Fu=function(n){return n.tagName==="BODY"},mg=function(n){return n.tagName==="CANVAS"},Xh=function(n){return n.tagName==="VIDEO"},zc=function(n){return n.tagName==="IMG"},Bg=function(n){return n.tagName==="IFRAME"},Yh=function(n){return n.tagName==="STYLE"},sS=function(n){return n.tagName==="SCRIPT"},Wa=function(n){return n.tagName==="TEXTAREA"},Xa=function(n){return n.tagName==="SELECT"},wg=function(n){return n.tagName==="SLOT"},Jh=function(n){return n.tagName.indexOf("-")>0},aS=(function(){function n(){this.counters={}}return n.prototype.getCounterValue=function(e){var t=this.counters[e];return t&&t.length?t[t.length-1]:1},n.prototype.getCounterValues=function(e){var t=this.counters[e];return t||[]},n.prototype.pop=function(e){var t=this;e.forEach(function(A){return t.counters[A].pop()})},n.prototype.parse=function(e){var t=this,A=e.counterIncrement,i=e.counterReset,r=!0;A!==null&&A.forEach(function(a){var o=t.counters[a.counter];o&&a.increment!==0&&(r=!1,o.length||o.push(1),o[Math.max(0,o.length-1)]+=a.increment)});var s=[];return r&&i.forEach(function(a){var o=t.counters[a.counter];s.push(a.counter),o||(o=t.counters[a.counter]=[]),o.push(a.reset)}),s},n})(),Zh={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},qh={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},oS={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},lS={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},Ni=function(n,e,t,A,i,r){return n<e||n>t?es(n,i,r.length>0):A.integers.reduce(function(s,a,o){for(;n>=a;)n-=a,s+=A.values[o];return s},"")+r},vg=function(n,e,t,A){var i="";do t||n--,i=A(n)+i,n/=e;while(n*e>=e);return i},vt=function(n,e,t,A,i){var r=t-e+1;return(n<0?"-":"")+(vg(Math.abs(n),r,A,function(s){return Ct(Math.floor(s%r)+e)})+i)},Zn=function(n,e,t){t===void 0&&(t=". ");var A=e.length;return vg(Math.abs(n),A,!1,function(i){return e[Math.floor(i%A)]})+t},Ki=1,_n=2,xn=4,Or=8,en=function(n,e,t,A,i,r){if(n<-9999||n>9999)return es(n,4,i.length>0);var s=Math.abs(n),a=i;if(s===0)return e[0]+a;for(var o=0;s>0&&o<=4;o++){var c=s%10;c===0&&Qt(r,Ki)&&a!==""?a=e[c]+a:c>1||c===1&&o===0||c===1&&o===1&&Qt(r,_n)||c===1&&o===1&&Qt(r,xn)&&n>100||c===1&&o>1&&Qt(r,Or)?a=e[c]+(o>0?t[o-1]:"")+a:c===1&&o>0&&(a=t[o-1]+a),s=Math.floor(s/10)}return(n<0?A:"")+a},jh="十百千萬",$h="拾佰仟萬",ed="マイナス",yl="마이너스",es=function(n,e,t){var A=t?". ":"",i=t?"、":"",r=t?", ":"",s=t?" ":"";switch(e){case 0:return"•"+s;case 1:return"◦"+s;case 2:return"◾"+s;case 5:var a=vt(n,48,57,!0,A);return a.length<4?"0"+a:a;case 4:return Zn(n,"〇一二三四五六七八九",i);case 6:return Ni(n,1,3999,Zh,3,A).toLowerCase();case 7:return Ni(n,1,3999,Zh,3,A);case 8:return vt(n,945,969,!1,A);case 9:return vt(n,97,122,!1,A);case 10:return vt(n,65,90,!1,A);case 11:return vt(n,1632,1641,!0,A);case 12:case 49:return Ni(n,1,9999,qh,3,A);case 35:return Ni(n,1,9999,qh,3,A).toLowerCase();case 13:return vt(n,2534,2543,!0,A);case 14:case 30:return vt(n,6112,6121,!0,A);case 15:return Zn(n,"子丑寅卯辰巳午未申酉戌亥",i);case 16:return Zn(n,"甲乙丙丁戊己庚辛壬癸",i);case 17:case 48:return en(n,"零一二三四五六七八九",jh,"負",i,_n|xn|Or);case 47:return en(n,"零壹貳參肆伍陸柒捌玖",$h,"負",i,Ki|_n|xn|Or);case 42:return en(n,"零一二三四五六七八九",jh,"负",i,_n|xn|Or);case 41:return en(n,"零壹贰叁肆伍陆柒捌玖",$h,"负",i,Ki|_n|xn|Or);case 26:return en(n,"〇一二三四五六七八九","十百千万",ed,i,0);case 25:return en(n,"零壱弐参四伍六七八九","拾百千万",ed,i,Ki|_n|xn);case 31:return en(n,"영일이삼사오육칠팔구","십백천만",yl,r,Ki|_n|xn);case 33:return en(n,"零一二三四五六七八九","十百千萬",yl,r,0);case 32:return en(n,"零壹貳參四五六七八九","拾百千",yl,r,Ki|_n|xn);case 18:return vt(n,2406,2415,!0,A);case 20:return Ni(n,1,19999,lS,3,A);case 21:return vt(n,2790,2799,!0,A);case 22:return vt(n,2662,2671,!0,A);case 22:return Ni(n,1,10999,oS,3,A);case 23:return Zn(n,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case 24:return Zn(n,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case 27:return vt(n,3302,3311,!0,A);case 28:return Zn(n,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",i);case 29:return Zn(n,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",i);case 34:return vt(n,3792,3801,!0,A);case 37:return vt(n,6160,6169,!0,A);case 38:return vt(n,4160,4169,!0,A);case 39:return vt(n,2918,2927,!0,A);case 40:return vt(n,1776,1785,!0,A);case 43:return vt(n,3046,3055,!0,A);case 44:return vt(n,3174,3183,!0,A);case 45:return vt(n,3664,3673,!0,A);case 46:return vt(n,3872,3881,!0,A);case 3:default:return vt(n,48,57,!0,A)}},Cg="data-html2canvas-ignore",td=(function(){function n(e,t,A){if(this.context=e,this.options=A,this.scrolledElements=[],this.referenceElement=t,this.counters=new aS,this.quoteDepth=0,!t.ownerDocument)throw new Error("Cloned element does not have an owner document");this.documentElement=this.cloneNode(t.ownerDocument.documentElement,!1)}return n.prototype.toIFrame=function(e,t){var A=this,i=cS(e,t);if(!i.contentWindow)return Promise.reject("Unable to find iframe window");var r=e.defaultView.pageXOffset,s=e.defaultView.pageYOffset,a=i.contentWindow,o=a.document,c=hS(i).then(function(){return AA(A,void 0,void 0,function(){var l,u;return Jt(this,function(f){switch(f.label){case 0:return this.scrolledElements.forEach(mS),a&&(a.scrollTo(t.left,t.top),/(iPad|iPhone|iPod)/g.test(navigator.userAgent)&&(a.scrollY!==t.top||a.scrollX!==t.left)&&(this.context.logger.warn("Unable to restore scroll position for cloned document"),this.context.windowBounds=this.context.windowBounds.add(a.scrollX-t.left,a.scrollY-t.top,0,0))),l=this.options.onclone,u=this.clonedReferenceElement,typeof u>"u"?[2,Promise.reject("Error finding the "+this.referenceElement.nodeName+" in the cloned document")]:o.fonts&&o.fonts.ready?[4,o.fonts.ready]:[3,2];case 1:f.sent(),f.label=2;case 2:return/(AppleWebKit)/g.test(navigator.userAgent)?[4,fS(o)]:[3,4];case 3:f.sent(),f.label=4;case 4:return typeof l=="function"?[2,Promise.resolve().then(function(){return l(o,u)}).then(function(){return i})]:[2,i]}})})});return o.open(),o.write(pS(document.doctype)+"<html></html>"),gS(this.referenceElement.ownerDocument,r,s),o.replaceChild(o.adoptNode(this.documentElement),o.documentElement),o.close(),c},n.prototype.createElementClone=function(e){if(Gc(e,2))debugger;if(mg(e))return this.createCanvasClone(e);if(Xh(e))return this.createVideoClone(e);if(Yh(e))return this.createStyleClone(e);var t=e.cloneNode(!1);return zc(t)&&(zc(e)&&e.currentSrc&&e.currentSrc!==e.src&&(t.src=e.currentSrc,t.srcset=""),t.loading==="lazy"&&(t.loading="eager")),Jh(t)?this.createCustomElementClone(t):t},n.prototype.createCustomElementClone=function(e){var t=document.createElement("html2canvascustomelement");return Ul(e.style,t),t},n.prototype.createStyleClone=function(e){try{var t=e.sheet;if(t&&t.cssRules){var A=[].slice.call(t.cssRules,0).reduce(function(r,s){return s&&typeof s.cssText=="string"?r+s.cssText:r},""),i=e.cloneNode(!1);return i.textContent=A,i}}catch(r){if(this.context.logger.error("Unable to access cssRules property",r),r.name!=="SecurityError")throw r}return e.cloneNode(!1)},n.prototype.createCanvasClone=function(e){var t;if(this.options.inlineImages&&e.ownerDocument){var A=e.ownerDocument.createElement("img");try{return A.src=e.toDataURL(),A}catch{this.context.logger.info("Unable to inline canvas contents, canvas is tainted",e)}}var i=e.cloneNode(!1);try{i.width=e.width,i.height=e.height;var r=e.getContext("2d"),s=i.getContext("2d");if(s)if(!this.options.allowTaint&&r)s.putImageData(r.getImageData(0,0,e.width,e.height),0,0);else{var a=(t=e.getContext("webgl2"))!==null&&t!==void 0?t:e.getContext("webgl");if(a){var o=a.getContextAttributes();(o==null?void 0:o.preserveDrawingBuffer)===!1&&this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false",e)}s.drawImage(e,0,0)}return i}catch{this.context.logger.info("Unable to clone canvas as it is tainted",e)}return i},n.prototype.createVideoClone=function(e){var t=e.ownerDocument.createElement("canvas");t.width=e.offsetWidth,t.height=e.offsetHeight;var A=t.getContext("2d");try{return A&&(A.drawImage(e,0,0,t.width,t.height),this.options.allowTaint||A.getImageData(0,0,t.width,t.height)),t}catch{this.context.logger.info("Unable to clone video as it is tainted",e)}var i=e.ownerDocument.createElement("canvas");return i.width=e.offsetWidth,i.height=e.offsetHeight,i},n.prototype.appendChildNode=function(e,t,A){(!Yi(t)||!sS(t)&&!t.hasAttribute(Cg)&&(typeof this.options.ignoreElements!="function"||!this.options.ignoreElements(t)))&&(!this.options.copyStyles||!Yi(t)||!Yh(t))&&e.appendChild(this.cloneNode(t,A))},n.prototype.cloneChildNodes=function(e,t,A){for(var i=this,r=e.shadowRoot?e.shadowRoot.firstChild:e.firstChild;r;r=r.nextSibling)if(Yi(r)&&wg(r)&&typeof r.assignedNodes=="function"){var s=r.assignedNodes();s.length&&s.forEach(function(a){return i.appendChildNode(t,a,A)})}else this.appendChildNode(t,r,A)},n.prototype.cloneNode=function(e,t){if(pg(e))return document.createTextNode(e.data);if(!e.ownerDocument)return e.cloneNode(!1);var A=e.ownerDocument.defaultView;if(A&&Yi(e)&&(Kc(e)||ba(e))){var i=this.createElementClone(e);i.style.transitionProperty="none";var r=A.getComputedStyle(e),s=A.getComputedStyle(e,":before"),a=A.getComputedStyle(e,":after");this.referenceElement===e&&Kc(i)&&(this.clonedReferenceElement=i),Fu(i)&&vS(i);var o=this.counters.parse(new Ih(this.context,r)),c=this.resolvePseudoContent(e,i,s,Yr.BEFORE);Jh(e)&&(t=!0),Xh(e)||this.cloneChildNodes(e,i,t),c&&i.insertBefore(c,i.firstChild);var l=this.resolvePseudoContent(e,i,a,Yr.AFTER);return l&&i.appendChild(l),this.counters.pop(o),(r&&(this.options.copyStyles||ba(e))&&!Bg(e)||t)&&Ul(r,i),(e.scrollTop!==0||e.scrollLeft!==0)&&this.scrolledElements.push([i,e.scrollLeft,e.scrollTop]),(Wa(e)||Xa(e))&&(Wa(i)||Xa(i))&&(i.value=e.value),i}return e.cloneNode(!1)},n.prototype.resolvePseudoContent=function(e,t,A,i){var r=this;if(A){var s=A.content,a=t.ownerDocument;if(!(!a||!s||s==="none"||s==="-moz-alt-content"||A.display==="none")){this.counters.parse(new Ih(this.context,A));var o=new AU(this.context,A),c=a.createElement("html2canvaspseudoelement");Ul(A,c),o.content.forEach(function(u){if(u.type===0)c.appendChild(a.createTextNode(u.value));else if(u.type===22){var f=a.createElement("img");f.src=u.value,f.style.opacity="1",c.appendChild(f)}else if(u.type===18){if(u.name==="attr"){var p=u.values.filter(it);p.length&&c.appendChild(a.createTextNode(e.getAttribute(p[0].value)||""))}else if(u.name==="counter"){var g=u.values.filter(ur),m=g[0],d=g[1];if(m&&it(m)){var h=r.counters.getCounterValue(m.value),_=d&&it(d)?Oc.parse(r.context,d.value):3;c.appendChild(a.createTextNode(es(h,_,!1)))}}else if(u.name==="counters"){var w=u.values.filter(ur),m=w[0],U=w[1],d=w[2];if(m&&it(m)){var T=r.counters.getCounterValues(m.value),y=d&&it(d)?Oc.parse(r.context,d.value):3,S=U&&U.type===0?U.value:"",L=T.map(function(I){return es(I,y,!1)}).join(S);c.appendChild(a.createTextNode(L))}}}else if(u.type===20)switch(u.value){case"open-quote":c.appendChild(a.createTextNode(Th(o.quotes,r.quoteDepth++,!0)));break;case"close-quote":c.appendChild(a.createTextNode(Th(o.quotes,--r.quoteDepth,!1)));break;default:c.appendChild(a.createTextNode(u.value))}}),c.className=Wc+" "+Xc;var l=i===Yr.BEFORE?" "+Wc:" "+Xc;return ba(t)?t.className.baseValue+=l:t.className+=l,c}}},n.destroy=function(e){return e.parentNode?(e.parentNode.removeChild(e),!0):!1},n})(),Yr;(function(n){n[n.BEFORE=0]="BEFORE",n[n.AFTER=1]="AFTER"})(Yr||(Yr={}));var cS=function(n,e){var t=n.createElement("iframe");return t.className="html2canvas-container",t.style.visibility="hidden",t.style.position="fixed",t.style.left="-10000px",t.style.top="0px",t.style.border="0",t.width=e.width.toString(),t.height=e.height.toString(),t.scrolling="no",t.setAttribute(Cg,"true"),n.body.appendChild(t),t},uS=function(n){return new Promise(function(e){if(n.complete){e();return}if(!n.src){e();return}n.onload=e,n.onerror=e})},fS=function(n){return Promise.all([].slice.call(n.images,0).map(uS))},hS=function(n){return new Promise(function(e,t){var A=n.contentWindow;if(!A)return t("No window assigned for iframe");var i=A.document;A.onload=n.onload=function(){A.onload=n.onload=null;var r=setInterval(function(){i.body.childNodes.length>0&&i.readyState==="complete"&&(clearInterval(r),e(n))},50)}})},dS=["all","d","content"],Ul=function(n,e){for(var t=n.length-1;t>=0;t--){var A=n.item(t);dS.indexOf(A)===-1&&e.style.setProperty(A,n.getPropertyValue(A))}return e},pS=function(n){var e="";return n&&(e+="<!DOCTYPE ",n.name&&(e+=n.name),n.internalSubset&&(e+=n.internalSubset),n.publicId&&(e+='"'+n.publicId+'"'),n.systemId&&(e+='"'+n.systemId+'"'),e+=">"),e},gS=function(n,e,t){n&&n.defaultView&&(e!==n.defaultView.pageXOffset||t!==n.defaultView.pageYOffset)&&n.defaultView.scrollTo(e,t)},mS=function(n){var e=n[0],t=n[1],A=n[2];e.scrollLeft=t,e.scrollTop=A},BS=":before",wS=":after",Wc="___html2canvas___pseudoelement_before",Xc="___html2canvas___pseudoelement_after",Ad=`{
    content: "" !important;
    display: none !important;
}`,vS=function(n){CS(n,"."+Wc+BS+Ad+`
         .`+Xc+wS+Ad)},CS=function(n,e){var t=n.ownerDocument;if(t){var A=t.createElement("style");A.textContent=e,n.appendChild(A)}},_g=(function(){function n(){}return n.getOrigin=function(e){var t=n._link;return t?(t.href=e,t.href=t.href,t.protocol+t.hostname+t.port):"about:blank"},n.isSameOrigin=function(e){return n.getOrigin(e)===n._origin},n.setContext=function(e){n._link=e.document.createElement("a"),n._origin=n.getOrigin(e.location.href)},n._origin="about:blank",n})(),_S=(function(){function n(e,t){this.context=e,this._options=t,this._cache={}}return n.prototype.addImage=function(e){var t=Promise.resolve();return this.has(e)||(Ml(e)||US(e))&&(this._cache[e]=this.loadImage(e)).catch(function(){}),t},n.prototype.match=function(e){return this._cache[e]},n.prototype.loadImage=function(e){return AA(this,void 0,void 0,function(){var t,A,i,r,s=this;return Jt(this,function(a){switch(a.label){case 0:return t=_g.isSameOrigin(e),A=!Sl(e)&&this._options.useCORS===!0&&kt.SUPPORT_CORS_IMAGES&&!t,i=!Sl(e)&&!t&&!Ml(e)&&typeof this._options.proxy=="string"&&kt.SUPPORT_CORS_XHR&&!A,!t&&this._options.allowTaint===!1&&!Sl(e)&&!Ml(e)&&!i&&!A?[2]:(r=e,i?[4,this.proxy(r)]:[3,2]);case 1:r=a.sent(),a.label=2;case 2:return this.context.logger.debug("Added image "+e.substring(0,256)),[4,new Promise(function(o,c){var l=new Image;l.onload=function(){return o(l)},l.onerror=c,(SS(r)||A)&&(l.crossOrigin="anonymous"),l.src=r,l.complete===!0&&setTimeout(function(){return o(l)},500),s._options.imageTimeout>0&&setTimeout(function(){return c("Timed out ("+s._options.imageTimeout+"ms) loading image")},s._options.imageTimeout)})];case 3:return[2,a.sent()]}})})},n.prototype.has=function(e){return typeof this._cache[e]<"u"},n.prototype.keys=function(){return Promise.resolve(Object.keys(this._cache))},n.prototype.proxy=function(e){var t=this,A=this._options.proxy;if(!A)throw new Error("No proxy defined");var i=e.substring(0,256);return new Promise(function(r,s){var a=kt.SUPPORT_RESPONSE_TYPE?"blob":"text",o=new XMLHttpRequest;o.onload=function(){if(o.status===200)if(a==="text")r(o.response);else{var u=new FileReader;u.addEventListener("load",function(){return r(u.result)},!1),u.addEventListener("error",function(f){return s(f)},!1),u.readAsDataURL(o.response)}else s("Failed to proxy resource "+i+" with status code "+o.status)},o.onerror=s;var c=A.indexOf("?")>-1?"&":"?";if(o.open("GET",""+A+c+"url="+encodeURIComponent(e)+"&responseType="+a),a!=="text"&&o instanceof XMLHttpRequest&&(o.responseType=a),t._options.imageTimeout){var l=t._options.imageTimeout;o.timeout=l,o.ontimeout=function(){return s("Timed out ("+l+"ms) proxying "+i)}}o.send()})},n})(),xS=/^data:image\/svg\+xml/i,ES=/^data:image\/.*;base64,/i,yS=/^data:image\/.*/i,US=function(n){return kt.SUPPORT_SVG_DRAWING||!MS(n)},Sl=function(n){return yS.test(n)},SS=function(n){return ES.test(n)},Ml=function(n){return n.substr(0,4)==="blob"},MS=function(n){return n.substr(-3).toLowerCase()==="svg"||xS.test(n)},ue=(function(){function n(e,t){this.type=0,this.x=e,this.y=t}return n.prototype.add=function(e,t){return new n(this.x+e,this.y+t)},n})(),Oi=function(n,e,t){return new ue(n.x+(e.x-n.x)*t,n.y+(e.y-n.y)*t)},ra=(function(){function n(e,t,A,i){this.type=1,this.start=e,this.startControl=t,this.endControl=A,this.end=i}return n.prototype.subdivide=function(e,t){var A=Oi(this.start,this.startControl,e),i=Oi(this.startControl,this.endControl,e),r=Oi(this.endControl,this.end,e),s=Oi(A,i,e),a=Oi(i,r,e),o=Oi(s,a,e);return t?new n(this.start,A,s,o):new n(o,a,r,this.end)},n.prototype.add=function(e,t){return new n(this.start.add(e,t),this.startControl.add(e,t),this.endControl.add(e,t),this.end.add(e,t))},n.prototype.reverse=function(){return new n(this.end,this.endControl,this.startControl,this.start)},n})(),xA=function(n){return n.type===1},bS=(function(){function n(e){var t=e.styles,A=e.bounds,i=Hr(t.borderTopLeftRadius,A.width,A.height),r=i[0],s=i[1],a=Hr(t.borderTopRightRadius,A.width,A.height),o=a[0],c=a[1],l=Hr(t.borderBottomRightRadius,A.width,A.height),u=l[0],f=l[1],p=Hr(t.borderBottomLeftRadius,A.width,A.height),g=p[0],m=p[1],d=[];d.push((r+o)/A.width),d.push((g+u)/A.width),d.push((s+m)/A.height),d.push((c+f)/A.height);var h=Math.max.apply(Math,d);h>1&&(r/=h,s/=h,o/=h,c/=h,u/=h,f/=h,g/=h,m/=h);var _=A.width-o,w=A.height-f,U=A.width-u,T=A.height-m,y=t.borderTopWidth,S=t.borderRightWidth,L=t.borderBottomWidth,x=t.borderLeftWidth,C=st(t.paddingTop,e.bounds.width),I=st(t.paddingRight,e.bounds.width),W=st(t.paddingBottom,e.bounds.width),H=st(t.paddingLeft,e.bounds.width);this.topLeftBorderDoubleOuterBox=r>0||s>0?dt(A.left+x/3,A.top+y/3,r-x/3,s-y/3,tt.TOP_LEFT):new ue(A.left+x/3,A.top+y/3),this.topRightBorderDoubleOuterBox=r>0||s>0?dt(A.left+_,A.top+y/3,o-S/3,c-y/3,tt.TOP_RIGHT):new ue(A.left+A.width-S/3,A.top+y/3),this.bottomRightBorderDoubleOuterBox=u>0||f>0?dt(A.left+U,A.top+w,u-S/3,f-L/3,tt.BOTTOM_RIGHT):new ue(A.left+A.width-S/3,A.top+A.height-L/3),this.bottomLeftBorderDoubleOuterBox=g>0||m>0?dt(A.left+x/3,A.top+T,g-x/3,m-L/3,tt.BOTTOM_LEFT):new ue(A.left+x/3,A.top+A.height-L/3),this.topLeftBorderDoubleInnerBox=r>0||s>0?dt(A.left+x*2/3,A.top+y*2/3,r-x*2/3,s-y*2/3,tt.TOP_LEFT):new ue(A.left+x*2/3,A.top+y*2/3),this.topRightBorderDoubleInnerBox=r>0||s>0?dt(A.left+_,A.top+y*2/3,o-S*2/3,c-y*2/3,tt.TOP_RIGHT):new ue(A.left+A.width-S*2/3,A.top+y*2/3),this.bottomRightBorderDoubleInnerBox=u>0||f>0?dt(A.left+U,A.top+w,u-S*2/3,f-L*2/3,tt.BOTTOM_RIGHT):new ue(A.left+A.width-S*2/3,A.top+A.height-L*2/3),this.bottomLeftBorderDoubleInnerBox=g>0||m>0?dt(A.left+x*2/3,A.top+T,g-x*2/3,m-L*2/3,tt.BOTTOM_LEFT):new ue(A.left+x*2/3,A.top+A.height-L*2/3),this.topLeftBorderStroke=r>0||s>0?dt(A.left+x/2,A.top+y/2,r-x/2,s-y/2,tt.TOP_LEFT):new ue(A.left+x/2,A.top+y/2),this.topRightBorderStroke=r>0||s>0?dt(A.left+_,A.top+y/2,o-S/2,c-y/2,tt.TOP_RIGHT):new ue(A.left+A.width-S/2,A.top+y/2),this.bottomRightBorderStroke=u>0||f>0?dt(A.left+U,A.top+w,u-S/2,f-L/2,tt.BOTTOM_RIGHT):new ue(A.left+A.width-S/2,A.top+A.height-L/2),this.bottomLeftBorderStroke=g>0||m>0?dt(A.left+x/2,A.top+T,g-x/2,m-L/2,tt.BOTTOM_LEFT):new ue(A.left+x/2,A.top+A.height-L/2),this.topLeftBorderBox=r>0||s>0?dt(A.left,A.top,r,s,tt.TOP_LEFT):new ue(A.left,A.top),this.topRightBorderBox=o>0||c>0?dt(A.left+_,A.top,o,c,tt.TOP_RIGHT):new ue(A.left+A.width,A.top),this.bottomRightBorderBox=u>0||f>0?dt(A.left+U,A.top+w,u,f,tt.BOTTOM_RIGHT):new ue(A.left+A.width,A.top+A.height),this.bottomLeftBorderBox=g>0||m>0?dt(A.left,A.top+T,g,m,tt.BOTTOM_LEFT):new ue(A.left,A.top+A.height),this.topLeftPaddingBox=r>0||s>0?dt(A.left+x,A.top+y,Math.max(0,r-x),Math.max(0,s-y),tt.TOP_LEFT):new ue(A.left+x,A.top+y),this.topRightPaddingBox=o>0||c>0?dt(A.left+Math.min(_,A.width-S),A.top+y,_>A.width+S?0:Math.max(0,o-S),Math.max(0,c-y),tt.TOP_RIGHT):new ue(A.left+A.width-S,A.top+y),this.bottomRightPaddingBox=u>0||f>0?dt(A.left+Math.min(U,A.width-x),A.top+Math.min(w,A.height-L),Math.max(0,u-S),Math.max(0,f-L),tt.BOTTOM_RIGHT):new ue(A.left+A.width-S,A.top+A.height-L),this.bottomLeftPaddingBox=g>0||m>0?dt(A.left+x,A.top+Math.min(T,A.height-L),Math.max(0,g-x),Math.max(0,m-L),tt.BOTTOM_LEFT):new ue(A.left+x,A.top+A.height-L),this.topLeftContentBox=r>0||s>0?dt(A.left+x+H,A.top+y+C,Math.max(0,r-(x+H)),Math.max(0,s-(y+C)),tt.TOP_LEFT):new ue(A.left+x+H,A.top+y+C),this.topRightContentBox=o>0||c>0?dt(A.left+Math.min(_,A.width+x+H),A.top+y+C,_>A.width+x+H?0:o-x+H,c-(y+C),tt.TOP_RIGHT):new ue(A.left+A.width-(S+I),A.top+y+C),this.bottomRightContentBox=u>0||f>0?dt(A.left+Math.min(U,A.width-(x+H)),A.top+Math.min(w,A.height+y+C),Math.max(0,u-(S+I)),f-(L+W),tt.BOTTOM_RIGHT):new ue(A.left+A.width-(S+I),A.top+A.height-(L+W)),this.bottomLeftContentBox=g>0||m>0?dt(A.left+x+H,A.top+T,Math.max(0,g-(x+H)),m-(L+W),tt.BOTTOM_LEFT):new ue(A.left+x+H,A.top+A.height-(L+W))}return n})(),tt;(function(n){n[n.TOP_LEFT=0]="TOP_LEFT",n[n.TOP_RIGHT=1]="TOP_RIGHT",n[n.BOTTOM_RIGHT=2]="BOTTOM_RIGHT",n[n.BOTTOM_LEFT=3]="BOTTOM_LEFT"})(tt||(tt={}));var dt=function(n,e,t,A,i){var r=4*((Math.sqrt(2)-1)/3),s=t*r,a=A*r,o=n+t,c=e+A;switch(i){case tt.TOP_LEFT:return new ra(new ue(n,c),new ue(n,c-a),new ue(o-s,e),new ue(o,e));case tt.TOP_RIGHT:return new ra(new ue(n,e),new ue(n+s,e),new ue(o,c-a),new ue(o,c));case tt.BOTTOM_RIGHT:return new ra(new ue(o,e),new ue(o,e+a),new ue(n+s,c),new ue(n,c));case tt.BOTTOM_LEFT:default:return new ra(new ue(o,c),new ue(o-s,c),new ue(n,e+a),new ue(n,e))}},Ya=function(n){return[n.topLeftBorderBox,n.topRightBorderBox,n.bottomRightBorderBox,n.bottomLeftBorderBox]},FS=function(n){return[n.topLeftContentBox,n.topRightContentBox,n.bottomRightContentBox,n.bottomLeftContentBox]},Ja=function(n){return[n.topLeftPaddingBox,n.topRightPaddingBox,n.bottomRightPaddingBox,n.bottomLeftPaddingBox]},TS=(function(){function n(e,t,A){this.offsetX=e,this.offsetY=t,this.matrix=A,this.type=0,this.target=6}return n})(),sa=(function(){function n(e,t){this.path=e,this.target=t,this.type=1}return n})(),IS=(function(){function n(e){this.opacity=e,this.type=2,this.target=6}return n})(),QS=function(n){return n.type===0},xg=function(n){return n.type===1},LS=function(n){return n.type===2},nd=function(n,e){return n.length===e.length?n.some(function(t,A){return t===e[A]}):!1},RS=function(n,e,t,A,i){return n.map(function(r,s){switch(s){case 0:return r.add(e,t);case 1:return r.add(e+A,t);case 2:return r.add(e+A,t+i);case 3:return r.add(e,t+i)}return r})},Eg=(function(){function n(e){this.element=e,this.inlineLevel=[],this.nonInlineLevel=[],this.negativeZIndex=[],this.zeroOrAutoZIndexOrTransformedOrOpacity=[],this.positiveZIndex=[],this.nonPositionedFloats=[],this.nonPositionedInlineLevel=[]}return n})(),yg=(function(){function n(e,t){if(this.container=e,this.parent=t,this.effects=[],this.curves=new bS(this.container),this.container.styles.opacity<1&&this.effects.push(new IS(this.container.styles.opacity)),this.container.styles.transform!==null){var A=this.container.bounds.left+this.container.styles.transformOrigin[0].number,i=this.container.bounds.top+this.container.styles.transformOrigin[1].number,r=this.container.styles.transform;this.effects.push(new TS(A,i,r))}if(this.container.styles.overflowX!==0){var s=Ya(this.curves),a=Ja(this.curves);nd(s,a)?this.effects.push(new sa(s,6)):(this.effects.push(new sa(s,2)),this.effects.push(new sa(a,4)))}}return n.prototype.getEffects=function(e){for(var t=[2,3].indexOf(this.container.styles.position)===-1,A=this.parent,i=this.effects.slice(0);A;){var r=A.effects.filter(function(o){return!xg(o)});if(t||A.container.styles.position!==0||!A.parent){if(i.unshift.apply(i,r),t=[2,3].indexOf(A.container.styles.position)===-1,A.container.styles.overflowX!==0){var s=Ya(A.curves),a=Ja(A.curves);nd(s,a)||i.unshift(new sa(a,6))}}else i.unshift.apply(i,r);A=A.parent}return i.filter(function(o){return Qt(o.target,e)})},n})(),Yc=function(n,e,t,A){n.container.elements.forEach(function(i){var r=Qt(i.flags,4),s=Qt(i.flags,2),a=new yg(i,n);Qt(i.styles.display,2048)&&A.push(a);var o=Qt(i.flags,8)?[]:A;if(r||s){var c=r||i.styles.isPositioned()?t:e,l=new Eg(a);if(i.styles.isPositioned()||i.styles.opacity<1||i.styles.isTransformed()){var u=i.styles.zIndex.order;if(u<0){var f=0;c.negativeZIndex.some(function(g,m){return u>g.element.container.styles.zIndex.order?(f=m,!1):f>0}),c.negativeZIndex.splice(f,0,l)}else if(u>0){var p=0;c.positiveZIndex.some(function(g,m){return u>=g.element.container.styles.zIndex.order?(p=m+1,!1):p>0}),c.positiveZIndex.splice(p,0,l)}else c.zeroOrAutoZIndexOrTransformedOrOpacity.push(l)}else i.styles.isFloating()?c.nonPositionedFloats.push(l):c.nonPositionedInlineLevel.push(l);Yc(a,l,r?l:t,o)}else i.styles.isInlineLevel()?e.inlineLevel.push(a):e.nonInlineLevel.push(a),Yc(a,e,t,o);Qt(i.flags,8)&&Ug(i,o)})},Ug=function(n,e){for(var t=n instanceof kc?n.start:1,A=n instanceof kc?n.reversed:!1,i=0;i<e.length;i++){var r=e[i];r.container instanceof lg&&typeof r.container.value=="number"&&r.container.value!==0&&(t=r.container.value),r.listValue=es(t,r.container.styles.listStyleType,!0),t+=A?-1:1}},DS=function(n){var e=new yg(n,null),t=new Eg(e),A=[];return Yc(e,t,t,A),Ug(e.container,A),t},id=function(n,e){switch(e){case 0:return FA(n.topLeftBorderBox,n.topLeftPaddingBox,n.topRightBorderBox,n.topRightPaddingBox);case 1:return FA(n.topRightBorderBox,n.topRightPaddingBox,n.bottomRightBorderBox,n.bottomRightPaddingBox);case 2:return FA(n.bottomRightBorderBox,n.bottomRightPaddingBox,n.bottomLeftBorderBox,n.bottomLeftPaddingBox);case 3:default:return FA(n.bottomLeftBorderBox,n.bottomLeftPaddingBox,n.topLeftBorderBox,n.topLeftPaddingBox)}},PS=function(n,e){switch(e){case 0:return FA(n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox,n.topRightBorderBox,n.topRightBorderDoubleOuterBox);case 1:return FA(n.topRightBorderBox,n.topRightBorderDoubleOuterBox,n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox);case 2:return FA(n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox,n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox);case 3:default:return FA(n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox,n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox)}},HS=function(n,e){switch(e){case 0:return FA(n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox,n.topRightBorderDoubleInnerBox,n.topRightPaddingBox);case 1:return FA(n.topRightBorderDoubleInnerBox,n.topRightPaddingBox,n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox);case 2:return FA(n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox,n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox);case 3:default:return FA(n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox,n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox)}},NS=function(n,e){switch(e){case 0:return aa(n.topLeftBorderStroke,n.topRightBorderStroke);case 1:return aa(n.topRightBorderStroke,n.bottomRightBorderStroke);case 2:return aa(n.bottomRightBorderStroke,n.bottomLeftBorderStroke);case 3:default:return aa(n.bottomLeftBorderStroke,n.topLeftBorderStroke)}},aa=function(n,e){var t=[];return xA(n)?t.push(n.subdivide(.5,!1)):t.push(n),xA(e)?t.push(e.subdivide(.5,!0)):t.push(e),t},FA=function(n,e,t,A){var i=[];return xA(n)?i.push(n.subdivide(.5,!1)):i.push(n),xA(t)?i.push(t.subdivide(.5,!0)):i.push(t),xA(A)?i.push(A.subdivide(.5,!0).reverse()):i.push(A),xA(e)?i.push(e.subdivide(.5,!1).reverse()):i.push(e),i},Sg=function(n){var e=n.bounds,t=n.styles;return e.add(t.borderLeftWidth,t.borderTopWidth,-(t.borderRightWidth+t.borderLeftWidth),-(t.borderTopWidth+t.borderBottomWidth))},Za=function(n){var e=n.styles,t=n.bounds,A=st(e.paddingLeft,t.width),i=st(e.paddingRight,t.width),r=st(e.paddingTop,t.width),s=st(e.paddingBottom,t.width);return t.add(A+e.borderLeftWidth,r+e.borderTopWidth,-(e.borderRightWidth+e.borderLeftWidth+A+i),-(e.borderTopWidth+e.borderBottomWidth+r+s))},OS=function(n,e){return n===0?e.bounds:n===2?Za(e):Sg(e)},GS=function(n,e){return n===0?e.bounds:n===2?Za(e):Sg(e)},bl=function(n,e,t){var A=OS(zi(n.styles.backgroundOrigin,e),n),i=GS(zi(n.styles.backgroundClip,e),n),r=VS(zi(n.styles.backgroundSize,e),t,A),s=r[0],a=r[1],o=Hr(zi(n.styles.backgroundPosition,e),A.width-s,A.height-a),c=kS(zi(n.styles.backgroundRepeat,e),o,r,A,i),l=Math.round(A.left+o[0]),u=Math.round(A.top+o[1]);return[c,l,u,s,a]},Gi=function(n){return it(n)&&n.value===tr.AUTO},oa=function(n){return typeof n=="number"},VS=function(n,e,t){var A=e[0],i=e[1],r=e[2],s=n[0],a=n[1];if(!s)return[0,0];if(Mt(s)&&a&&Mt(a))return[st(s,t.width),st(a,t.height)];var o=oa(r);if(it(s)&&(s.value===tr.CONTAIN||s.value===tr.COVER)){if(oa(r)){var c=t.width/t.height;return c<r!=(s.value===tr.COVER)?[t.width,t.width/r]:[t.height*r,t.height]}return[t.width,t.height]}var l=oa(A),u=oa(i),f=l||u;if(Gi(s)&&(!a||Gi(a))){if(l&&u)return[A,i];if(!o&&!f)return[t.width,t.height];if(f&&o){var p=l?A:i*r,g=u?i:A/r;return[p,g]}var m=l?A:t.width,d=u?i:t.height;return[m,d]}if(o){var h=0,_=0;return Mt(s)?h=st(s,t.width):Mt(a)&&(_=st(a,t.height)),Gi(s)?h=_*r:(!a||Gi(a))&&(_=h/r),[h,_]}var w=null,U=null;if(Mt(s)?w=st(s,t.width):a&&Mt(a)&&(U=st(a,t.height)),w!==null&&(!a||Gi(a))&&(U=l&&u?w/A*i:t.height),U!==null&&Gi(s)&&(w=l&&u?U/i*A:t.width),w!==null&&U!==null)return[w,U];throw new Error("Unable to calculate background-size for element")},zi=function(n,e){var t=n[e];return typeof t>"u"?n[0]:t},kS=function(n,e,t,A,i){var r=e[0],s=e[1],a=t[0],o=t[1];switch(n){case 2:return[new ue(Math.round(A.left),Math.round(A.top+s)),new ue(Math.round(A.left+A.width),Math.round(A.top+s)),new ue(Math.round(A.left+A.width),Math.round(o+A.top+s)),new ue(Math.round(A.left),Math.round(o+A.top+s))];case 3:return[new ue(Math.round(A.left+r),Math.round(A.top)),new ue(Math.round(A.left+r+a),Math.round(A.top)),new ue(Math.round(A.left+r+a),Math.round(A.height+A.top)),new ue(Math.round(A.left+r),Math.round(A.height+A.top))];case 1:return[new ue(Math.round(A.left+r),Math.round(A.top+s)),new ue(Math.round(A.left+r+a),Math.round(A.top+s)),new ue(Math.round(A.left+r+a),Math.round(A.top+s+o)),new ue(Math.round(A.left+r),Math.round(A.top+s+o))];default:return[new ue(Math.round(i.left),Math.round(i.top)),new ue(Math.round(i.left+i.width),Math.round(i.top)),new ue(Math.round(i.left+i.width),Math.round(i.height+i.top)),new ue(Math.round(i.left),Math.round(i.height+i.top))]}},KS="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",rd="Hidden Text",zS=(function(){function n(e){this._data={},this._document=e}return n.prototype.parseMetrics=function(e,t){var A=this._document.createElement("div"),i=this._document.createElement("img"),r=this._document.createElement("span"),s=this._document.body;A.style.visibility="hidden",A.style.fontFamily=e,A.style.fontSize=t,A.style.margin="0",A.style.padding="0",A.style.whiteSpace="nowrap",s.appendChild(A),i.src=KS,i.width=1,i.height=1,i.style.margin="0",i.style.padding="0",i.style.verticalAlign="baseline",r.style.fontFamily=e,r.style.fontSize=t,r.style.margin="0",r.style.padding="0",r.appendChild(this._document.createTextNode(rd)),A.appendChild(r),A.appendChild(i);var a=i.offsetTop-r.offsetTop+2;A.removeChild(r),A.appendChild(this._document.createTextNode(rd)),A.style.lineHeight="normal",i.style.verticalAlign="super";var o=i.offsetTop-A.offsetTop+2;return s.removeChild(A),{baseline:a,middle:o}},n.prototype.getMetrics=function(e,t){var A=e+" "+t;return typeof this._data[A]>"u"&&(this._data[A]=this.parseMetrics(e,t)),this._data[A]},n})(),Mg=(function(){function n(e,t){this.context=e,this.options=t}return n})(),WS=1e4,XS=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i._activeEffects=[],i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),A.canvas||(i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px"),i.fontMetrics=new zS(document),i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.ctx.textBaseline="bottom",i._activeEffects=[],i.context.logger.debug("Canvas renderer initialized ("+A.width+"x"+A.height+") with scale "+A.scale),i}return e.prototype.applyEffects=function(t){for(var A=this;this._activeEffects.length;)this.popEffect();t.forEach(function(i){return A.applyEffect(i)})},e.prototype.applyEffect=function(t){this.ctx.save(),LS(t)&&(this.ctx.globalAlpha=t.opacity),QS(t)&&(this.ctx.translate(t.offsetX,t.offsetY),this.ctx.transform(t.matrix[0],t.matrix[1],t.matrix[2],t.matrix[3],t.matrix[4],t.matrix[5]),this.ctx.translate(-t.offsetX,-t.offsetY)),xg(t)&&(this.path(t.path),this.ctx.clip()),this._activeEffects.push(t)},e.prototype.popEffect=function(){this._activeEffects.pop(),this.ctx.restore()},e.prototype.renderStack=function(t){return AA(this,void 0,void 0,function(){var A;return Jt(this,function(i){switch(i.label){case 0:return A=t.element.container.styles,A.isVisible()?[4,this.renderStackContent(t)]:[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}})})},e.prototype.renderNode=function(t){return AA(this,void 0,void 0,function(){return Jt(this,function(A){switch(A.label){case 0:if(Qt(t.container.flags,16))debugger;return t.container.styles.isVisible()?[4,this.renderNodeBackgroundAndBorders(t)]:[3,3];case 1:return A.sent(),[4,this.renderNodeContent(t)];case 2:A.sent(),A.label=3;case 3:return[2]}})})},e.prototype.renderTextWithLetterSpacing=function(t,A,i){var r=this;if(A===0)this.ctx.fillText(t.text,t.bounds.left,t.bounds.top+i);else{var s=Mu(t.text);s.reduce(function(a,o){return r.ctx.fillText(o,a,t.bounds.top+i),a+r.ctx.measureText(o).width},t.bounds.left)}},e.prototype.createFontStyle=function(t){var A=t.fontVariant.filter(function(s){return s==="normal"||s==="small-caps"}).join(""),i=jS(t.fontFamily).join(", "),r=ls(t.fontSize)?""+t.fontSize.number+t.fontSize.unit:t.fontSize.number+"px";return[[t.fontStyle,A,t.fontWeight,r,i].join(" "),i,r]},e.prototype.renderTextNode=function(t,A){return AA(this,void 0,void 0,function(){var i,r,s,a,o,c,l,u,f=this;return Jt(this,function(p){return i=this.createFontStyle(A),r=i[0],s=i[1],a=i[2],this.ctx.font=r,this.ctx.direction=A.direction===1?"rtl":"ltr",this.ctx.textAlign="left",this.ctx.textBaseline="alphabetic",o=this.fontMetrics.getMetrics(s,a),c=o.baseline,l=o.middle,u=A.paintOrder,t.textBounds.forEach(function(g){u.forEach(function(m){switch(m){case 0:f.ctx.fillStyle=Pt(A.color),f.renderTextWithLetterSpacing(g,A.letterSpacing,c);var d=A.textShadow;d.length&&g.text.trim().length&&(d.slice(0).reverse().forEach(function(h){f.ctx.shadowColor=Pt(h.color),f.ctx.shadowOffsetX=h.offsetX.number*f.options.scale,f.ctx.shadowOffsetY=h.offsetY.number*f.options.scale,f.ctx.shadowBlur=h.blur.number,f.renderTextWithLetterSpacing(g,A.letterSpacing,c)}),f.ctx.shadowColor="",f.ctx.shadowOffsetX=0,f.ctx.shadowOffsetY=0,f.ctx.shadowBlur=0),A.textDecorationLine.length&&(f.ctx.fillStyle=Pt(A.textDecorationColor||A.color),A.textDecorationLine.forEach(function(h){switch(h){case 1:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top+c),g.bounds.width,1);break;case 2:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top),g.bounds.width,1);break;case 3:f.ctx.fillRect(g.bounds.left,Math.ceil(g.bounds.top+l),g.bounds.width,1);break}}));break;case 1:A.webkitTextStrokeWidth&&g.text.trim().length&&(f.ctx.strokeStyle=Pt(A.webkitTextStrokeColor),f.ctx.lineWidth=A.webkitTextStrokeWidth,f.ctx.lineJoin=window.chrome?"miter":"round",f.ctx.strokeText(g.text,g.bounds.left,g.bounds.top+c)),f.ctx.strokeStyle="",f.ctx.lineWidth=0,f.ctx.lineJoin="miter";break}})}),[2]})})},e.prototype.renderReplacedElement=function(t,A,i){if(i&&t.intrinsicWidth>0&&t.intrinsicHeight>0){var r=Za(t),s=Ja(A);this.path(s),this.ctx.save(),this.ctx.clip(),this.ctx.drawImage(i,0,0,t.intrinsicWidth,t.intrinsicHeight,r.left,r.top,r.width,r.height),this.ctx.restore()}},e.prototype.renderNodeContent=function(t){return AA(this,void 0,void 0,function(){var A,i,r,s,a,o,_,_,c,l,u,f,U,p,g,T,m,d,h,_,w,U,T;return Jt(this,function(y){switch(y.label){case 0:this.applyEffects(t.getEffects(4)),A=t.container,i=t.curves,r=A.styles,s=0,a=A.textNodes,y.label=1;case 1:return s<a.length?(o=a[s],[4,this.renderTextNode(o,r)]):[3,4];case 2:y.sent(),y.label=3;case 3:return s++,[3,1];case 4:if(!(A instanceof sg))return[3,8];y.label=5;case 5:return y.trys.push([5,7,,8]),[4,this.context.cache.match(A.src)];case 6:return _=y.sent(),this.renderReplacedElement(A,i,_),[3,8];case 7:return y.sent(),this.context.logger.error("Error loading image "+A.src),[3,8];case 8:if(A instanceof ag&&this.renderReplacedElement(A,i,A.canvas),!(A instanceof og))return[3,12];y.label=9;case 9:return y.trys.push([9,11,,12]),[4,this.context.cache.match(A.svg)];case 10:return _=y.sent(),this.renderReplacedElement(A,i,_),[3,12];case 11:return y.sent(),this.context.logger.error("Error loading svg "+A.svg.substring(0,255)),[3,12];case 12:return A instanceof fg&&A.tree?(c=new e(this.context,{scale:this.options.scale,backgroundColor:A.backgroundColor,x:0,y:0,width:A.width,height:A.height}),[4,c.render(A.tree)]):[3,14];case 13:l=y.sent(),A.width&&A.height&&this.ctx.drawImage(l,0,0,A.width,A.height,A.bounds.left,A.bounds.top,A.bounds.width,A.bounds.height),y.label=14;case 14:if(A instanceof bu&&(u=Math.min(A.bounds.width,A.bounds.height),A.type===Ka?A.checked&&(this.ctx.save(),this.path([new ue(A.bounds.left+u*.39363,A.bounds.top+u*.79),new ue(A.bounds.left+u*.16,A.bounds.top+u*.5549),new ue(A.bounds.left+u*.27347,A.bounds.top+u*.44071),new ue(A.bounds.left+u*.39694,A.bounds.top+u*.5649),new ue(A.bounds.left+u*.72983,A.bounds.top+u*.23),new ue(A.bounds.left+u*.84,A.bounds.top+u*.34085),new ue(A.bounds.left+u*.39363,A.bounds.top+u*.79)]),this.ctx.fillStyle=Pt(Wh),this.ctx.fill(),this.ctx.restore()):A.type===za&&A.checked&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(A.bounds.left+u/2,A.bounds.top+u/2,u/4,0,Math.PI*2,!0),this.ctx.fillStyle=Pt(Wh),this.ctx.fill(),this.ctx.restore())),YS(A)&&A.value.length){switch(f=this.createFontStyle(r),U=f[0],p=f[1],g=this.fontMetrics.getMetrics(U,p).baseline,this.ctx.font=U,this.ctx.fillStyle=Pt(r.color),this.ctx.textBaseline="alphabetic",this.ctx.textAlign=ZS(A.styles.textAlign),T=Za(A),m=0,A.styles.textAlign){case 1:m+=T.width/2;break;case 2:m+=T.width;break}d=T.add(m,0,0,-T.height/2+1),this.ctx.save(),this.path([new ue(T.left,T.top),new ue(T.left+T.width,T.top),new ue(T.left+T.width,T.top+T.height),new ue(T.left,T.top+T.height)]),this.ctx.clip(),this.renderTextWithLetterSpacing(new Xr(A.value,d),r.letterSpacing,g),this.ctx.restore(),this.ctx.textBaseline="alphabetic",this.ctx.textAlign="left"}if(!Qt(A.styles.display,2048))return[3,20];if(A.styles.listStyleImage===null)return[3,19];if(h=A.styles.listStyleImage,h.type!==0)return[3,18];_=void 0,w=h.url,y.label=15;case 15:return y.trys.push([15,17,,18]),[4,this.context.cache.match(w)];case 16:return _=y.sent(),this.ctx.drawImage(_,A.bounds.left-(_.width+10),A.bounds.top),[3,18];case 17:return y.sent(),this.context.logger.error("Error loading list-style-image "+w),[3,18];case 18:return[3,20];case 19:t.listValue&&A.styles.listStyleType!==-1&&(U=this.createFontStyle(r)[0],this.ctx.font=U,this.ctx.fillStyle=Pt(r.color),this.ctx.textBaseline="middle",this.ctx.textAlign="right",T=new fn(A.bounds.left,A.bounds.top+st(A.styles.paddingTop,A.bounds.width),A.bounds.width,bh(r.lineHeight,r.fontSize.number)/2+1),this.renderTextWithLetterSpacing(new Xr(t.listValue,T),r.letterSpacing,bh(r.lineHeight,r.fontSize.number)/2+2),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"),y.label=20;case 20:return[2]}})})},e.prototype.renderStackContent=function(t){return AA(this,void 0,void 0,function(){var A,i,h,r,s,h,a,o,h,c,l,h,u,f,h,p,g,h,m,d,h;return Jt(this,function(_){switch(_.label){case 0:if(Qt(t.element.container.flags,16))debugger;return[4,this.renderNodeBackgroundAndBorders(t.element)];case 1:_.sent(),A=0,i=t.negativeZIndex,_.label=2;case 2:return A<i.length?(h=i[A],[4,this.renderStack(h)]):[3,5];case 3:_.sent(),_.label=4;case 4:return A++,[3,2];case 5:return[4,this.renderNodeContent(t.element)];case 6:_.sent(),r=0,s=t.nonInlineLevel,_.label=7;case 7:return r<s.length?(h=s[r],[4,this.renderNode(h)]):[3,10];case 8:_.sent(),_.label=9;case 9:return r++,[3,7];case 10:a=0,o=t.nonPositionedFloats,_.label=11;case 11:return a<o.length?(h=o[a],[4,this.renderStack(h)]):[3,14];case 12:_.sent(),_.label=13;case 13:return a++,[3,11];case 14:c=0,l=t.nonPositionedInlineLevel,_.label=15;case 15:return c<l.length?(h=l[c],[4,this.renderStack(h)]):[3,18];case 16:_.sent(),_.label=17;case 17:return c++,[3,15];case 18:u=0,f=t.inlineLevel,_.label=19;case 19:return u<f.length?(h=f[u],[4,this.renderNode(h)]):[3,22];case 20:_.sent(),_.label=21;case 21:return u++,[3,19];case 22:p=0,g=t.zeroOrAutoZIndexOrTransformedOrOpacity,_.label=23;case 23:return p<g.length?(h=g[p],[4,this.renderStack(h)]):[3,26];case 24:_.sent(),_.label=25;case 25:return p++,[3,23];case 26:m=0,d=t.positiveZIndex,_.label=27;case 27:return m<d.length?(h=d[m],[4,this.renderStack(h)]):[3,30];case 28:_.sent(),_.label=29;case 29:return m++,[3,27];case 30:return[2]}})})},e.prototype.mask=function(t){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.canvas.width,0),this.ctx.lineTo(this.canvas.width,this.canvas.height),this.ctx.lineTo(0,this.canvas.height),this.ctx.lineTo(0,0),this.formatPath(t.slice(0).reverse()),this.ctx.closePath()},e.prototype.path=function(t){this.ctx.beginPath(),this.formatPath(t),this.ctx.closePath()},e.prototype.formatPath=function(t){var A=this;t.forEach(function(i,r){var s=xA(i)?i.start:i;r===0?A.ctx.moveTo(s.x,s.y):A.ctx.lineTo(s.x,s.y),xA(i)&&A.ctx.bezierCurveTo(i.startControl.x,i.startControl.y,i.endControl.x,i.endControl.y,i.end.x,i.end.y)})},e.prototype.renderRepeat=function(t,A,i,r){this.path(t),this.ctx.fillStyle=A,this.ctx.translate(i,r),this.ctx.fill(),this.ctx.translate(-i,-r)},e.prototype.resizeImage=function(t,A,i){var r;if(t.width===A&&t.height===i)return t;var s=(r=this.canvas.ownerDocument)!==null&&r!==void 0?r:document,a=s.createElement("canvas");a.width=Math.max(1,A),a.height=Math.max(1,i);var o=a.getContext("2d");return o.drawImage(t,0,0,t.width,t.height,0,0,A,i),a},e.prototype.renderBackgroundImage=function(t){return AA(this,void 0,void 0,function(){var A,i,r,s,a,o;return Jt(this,function(c){switch(c.label){case 0:A=t.styles.backgroundImage.length-1,i=function(l){var u,f,p,C,K,q,H,z,L,g,C,K,q,H,z,m,d,h,_,w,U,T,y,S,L,x,C,I,W,H,z,Z,K,q,Y,se,ae,pe,Pe,Ge,J,$;return Jt(this,function(fe){switch(fe.label){case 0:if(l.type!==0)return[3,5];u=void 0,f=l.url,fe.label=1;case 1:return fe.trys.push([1,3,,4]),[4,r.context.cache.match(f)];case 2:return u=fe.sent(),[3,4];case 3:return fe.sent(),r.context.logger.error("Error loading background-image "+f),[3,4];case 4:return u&&(p=bl(t,A,[u.width,u.height,u.width/u.height]),C=p[0],K=p[1],q=p[2],H=p[3],z=p[4],L=r.ctx.createPattern(r.resizeImage(u,H,z),"repeat"),r.renderRepeat(C,L,K,q)),[3,6];case 5:QE(l)?(g=bl(t,A,[null,null,null]),C=g[0],K=g[1],q=g[2],H=g[3],z=g[4],m=ME(l.angle,H,z),d=m[0],h=m[1],_=m[2],w=m[3],U=m[4],T=document.createElement("canvas"),T.width=H,T.height=z,y=T.getContext("2d"),S=y.createLinearGradient(h,w,_,U),Sh(l.stops,d).forEach(function(ce){return S.addColorStop(ce.stop,Pt(ce.color))}),y.fillStyle=S,y.fillRect(0,0,H,z),H>0&&z>0&&(L=r.ctx.createPattern(T,"repeat"),r.renderRepeat(C,L,K,q))):LE(l)&&(x=bl(t,A,[null,null,null]),C=x[0],I=x[1],W=x[2],H=x[3],z=x[4],Z=l.position.length===0?[yu]:l.position,K=st(Z[0],H),q=st(Z[Z.length-1],z),Y=bE(l,K,q,H,z),se=Y[0],ae=Y[1],se>0&&ae>0&&(pe=r.ctx.createRadialGradient(I+K,W+q,0,I+K,W+q,se),Sh(l.stops,se*2).forEach(function(ce){return pe.addColorStop(ce.stop,Pt(ce.color))}),r.path(C),r.ctx.fillStyle=pe,se!==ae?(Pe=t.bounds.left+.5*t.bounds.width,Ge=t.bounds.top+.5*t.bounds.height,J=ae/se,$=1/J,r.ctx.save(),r.ctx.translate(Pe,Ge),r.ctx.transform(1,0,0,J,0,0),r.ctx.translate(-Pe,-Ge),r.ctx.fillRect(I,$*(W-Ge)+Ge,H,z*$),r.ctx.restore()):r.ctx.fill())),fe.label=6;case 6:return A--,[2]}})},r=this,s=0,a=t.styles.backgroundImage.slice(0).reverse(),c.label=1;case 1:return s<a.length?(o=a[s],[5,i(o)]):[3,4];case 2:c.sent(),c.label=3;case 3:return s++,[3,1];case 4:return[2]}})})},e.prototype.renderSolidBorder=function(t,A,i){return AA(this,void 0,void 0,function(){return Jt(this,function(r){return this.path(id(i,A)),this.ctx.fillStyle=Pt(t),this.ctx.fill(),[2]})})},e.prototype.renderDoubleBorder=function(t,A,i,r){return AA(this,void 0,void 0,function(){var s,a;return Jt(this,function(o){switch(o.label){case 0:return A<3?[4,this.renderSolidBorder(t,i,r)]:[3,2];case 1:return o.sent(),[2];case 2:return s=PS(r,i),this.path(s),this.ctx.fillStyle=Pt(t),this.ctx.fill(),a=HS(r,i),this.path(a),this.ctx.fill(),[2]}})})},e.prototype.renderNodeBackgroundAndBorders=function(t){return AA(this,void 0,void 0,function(){var A,i,r,s,a,o,c,l,u=this;return Jt(this,function(f){switch(f.label){case 0:return this.applyEffects(t.getEffects(2)),A=t.container.styles,i=!Dn(A.backgroundColor)||A.backgroundImage.length,r=[{style:A.borderTopStyle,color:A.borderTopColor,width:A.borderTopWidth},{style:A.borderRightStyle,color:A.borderRightColor,width:A.borderRightWidth},{style:A.borderBottomStyle,color:A.borderBottomColor,width:A.borderBottomWidth},{style:A.borderLeftStyle,color:A.borderLeftColor,width:A.borderLeftWidth}],s=JS(zi(A.backgroundClip,0),t.curves),i||A.boxShadow.length?(this.ctx.save(),this.path(s),this.ctx.clip(),Dn(A.backgroundColor)||(this.ctx.fillStyle=Pt(A.backgroundColor),this.ctx.fill()),[4,this.renderBackgroundImage(t.container)]):[3,2];case 1:f.sent(),this.ctx.restore(),A.boxShadow.slice(0).reverse().forEach(function(p){u.ctx.save();var g=Ya(t.curves),m=p.inset?0:WS,d=RS(g,-m+(p.inset?1:-1)*p.spread.number,(p.inset?1:-1)*p.spread.number,p.spread.number*(p.inset?-2:2),p.spread.number*(p.inset?-2:2));p.inset?(u.path(g),u.ctx.clip(),u.mask(d)):(u.mask(g),u.ctx.clip(),u.path(d)),u.ctx.shadowOffsetX=p.offsetX.number+m,u.ctx.shadowOffsetY=p.offsetY.number,u.ctx.shadowColor=Pt(p.color),u.ctx.shadowBlur=p.blur.number,u.ctx.fillStyle=p.inset?Pt(p.color):"rgba(0,0,0,1)",u.ctx.fill(),u.ctx.restore()}),f.label=2;case 2:a=0,o=0,c=r,f.label=3;case 3:return o<c.length?(l=c[o],l.style!==0&&!Dn(l.color)&&l.width>0?l.style!==2?[3,5]:[4,this.renderDashedDottedBorder(l.color,l.width,a,t.curves,2)]:[3,11]):[3,13];case 4:return f.sent(),[3,11];case 5:return l.style!==3?[3,7]:[4,this.renderDashedDottedBorder(l.color,l.width,a,t.curves,3)];case 6:return f.sent(),[3,11];case 7:return l.style!==4?[3,9]:[4,this.renderDoubleBorder(l.color,l.width,a,t.curves)];case 8:return f.sent(),[3,11];case 9:return[4,this.renderSolidBorder(l.color,a,t.curves)];case 10:f.sent(),f.label=11;case 11:a++,f.label=12;case 12:return o++,[3,3];case 13:return[2]}})})},e.prototype.renderDashedDottedBorder=function(t,A,i,r,s){return AA(this,void 0,void 0,function(){var a,o,c,l,u,f,p,g,m,d,h,_,w,U,T,y,T,y;return Jt(this,function(S){return this.ctx.save(),a=NS(r,i),o=id(r,i),s===2&&(this.path(o),this.ctx.clip()),xA(o[0])?(c=o[0].start.x,l=o[0].start.y):(c=o[0].x,l=o[0].y),xA(o[1])?(u=o[1].end.x,f=o[1].end.y):(u=o[1].x,f=o[1].y),i===0||i===2?p=Math.abs(c-u):p=Math.abs(l-f),this.ctx.beginPath(),s===3?this.formatPath(a):this.formatPath(o.slice(0,2)),g=A<3?A*3:A*2,m=A<3?A*2:A,s===3&&(g=A,m=A),d=!0,p<=g*2?d=!1:p<=g*2+m?(h=p/(2*g+m),g*=h,m*=h):(_=Math.floor((p+m)/(g+m)),w=(p-_*g)/(_-1),U=(p-(_+1)*g)/_,m=U<=0||Math.abs(m-w)<Math.abs(m-U)?w:U),d&&(s===3?this.ctx.setLineDash([0,g+m]):this.ctx.setLineDash([g,m])),s===3?(this.ctx.lineCap="round",this.ctx.lineWidth=A):this.ctx.lineWidth=A*2+1.1,this.ctx.strokeStyle=Pt(t),this.ctx.stroke(),this.ctx.setLineDash([]),s===2&&(xA(o[0])&&(T=o[3],y=o[0],this.ctx.beginPath(),this.formatPath([new ue(T.end.x,T.end.y),new ue(y.start.x,y.start.y)]),this.ctx.stroke()),xA(o[1])&&(T=o[1],y=o[2],this.ctx.beginPath(),this.formatPath([new ue(T.end.x,T.end.y),new ue(y.start.x,y.start.y)]),this.ctx.stroke())),this.ctx.restore(),[2]})})},e.prototype.render=function(t){return AA(this,void 0,void 0,function(){var A;return Jt(this,function(i){switch(i.label){case 0:return this.options.backgroundColor&&(this.ctx.fillStyle=Pt(this.options.backgroundColor),this.ctx.fillRect(this.options.x,this.options.y,this.options.width,this.options.height)),A=DS(t),[4,this.renderStack(A)];case 1:return i.sent(),this.applyEffects([]),[2,this.canvas]}})})},e})(Mg),YS=function(n){return n instanceof ug||n instanceof cg?!0:n instanceof bu&&n.type!==za&&n.type!==Ka},JS=function(n,e){switch(n){case 0:return Ya(e);case 2:return FS(e);case 1:default:return Ja(e)}},ZS=function(n){switch(n){case 1:return"center";case 2:return"right";case 0:default:return"left"}},qS=["-apple-system","system-ui"],jS=function(n){return/iPhone OS 15_(0|1)/.test(window.navigator.userAgent)?n.filter(function(e){return qS.indexOf(e)===-1}):n},$S=(function(n){NA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),i.options=A,i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px",i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized ("+A.width+"x"+A.height+" at "+A.x+","+A.y+") with scale "+A.scale),i}return e.prototype.render=function(t){return AA(this,void 0,void 0,function(){var A,i;return Jt(this,function(r){switch(r.label){case 0:return A=Vc(this.options.width*this.options.scale,this.options.height*this.options.scale,this.options.scale,this.options.scale,t),[4,eM(A)];case 1:return i=r.sent(),this.options.backgroundColor&&(this.ctx.fillStyle=Pt(this.options.backgroundColor),this.ctx.fillRect(0,0,this.options.width*this.options.scale,this.options.height*this.options.scale)),this.ctx.drawImage(i,-this.options.x*this.options.scale,-this.options.y*this.options.scale),[2,this.canvas]}})})},e})(Mg),eM=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},tM=(function(){function n(e){var t=e.id,A=e.enabled;this.id=t,this.enabled=A,this.start=Date.now()}return n.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.debug=="function"?console.debug.apply(console,Os([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.getTime=function(){return Date.now()-this.start},n.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&typeof window<"u"&&window.console&&typeof console.info=="function"&&console.info.apply(console,Os([this.id,this.getTime()+"ms"],e))},n.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.warn=="function"?console.warn.apply(console,Os([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.error=="function"?console.error.apply(console,Os([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.instances={},n})(),AM=(function(){function n(e,t){var A;this.windowBounds=t,this.instanceName="#"+n.instanceCount++,this.logger=new tM({id:this.instanceName,enabled:e.logging}),this.cache=(A=e.cache)!==null&&A!==void 0?A:new _S(this,e)}return n.instanceCount=1,n})(),nM=function(n,e){return e===void 0&&(e={}),iM(n,e)};typeof window<"u"&&_g.setContext(window);var iM=function(n,e){return AA(void 0,void 0,void 0,function(){var t,A,i,r,s,a,o,c,l,u,f,p,g,m,d,h,_,w,U,T,S,y,S,L,x,C,I,W,H,z,Z,K,q,Y,se,ae,pe,Pe,Ge,J;return Jt(this,function($){switch($.label){case 0:if(!n||typeof n!="object")return[2,Promise.reject("Invalid element provided as first argument")];if(t=n.ownerDocument,!t)throw new Error("Element is not attached to a Document");if(A=t.defaultView,!A)throw new Error("Document is not attached to a Window");return i={allowTaint:(L=e.allowTaint)!==null&&L!==void 0?L:!1,imageTimeout:(x=e.imageTimeout)!==null&&x!==void 0?x:15e3,proxy:e.proxy,useCORS:(C=e.useCORS)!==null&&C!==void 0?C:!1},r=Sc({logging:(I=e.logging)!==null&&I!==void 0?I:!0,cache:e.cache},i),s={windowWidth:(W=e.windowWidth)!==null&&W!==void 0?W:A.innerWidth,windowHeight:(H=e.windowHeight)!==null&&H!==void 0?H:A.innerHeight,scrollX:(z=e.scrollX)!==null&&z!==void 0?z:A.pageXOffset,scrollY:(Z=e.scrollY)!==null&&Z!==void 0?Z:A.pageYOffset},a=new fn(s.scrollX,s.scrollY,s.windowWidth,s.windowHeight),o=new AM(r,a),c=(K=e.foreignObjectRendering)!==null&&K!==void 0?K:!1,l={allowTaint:(q=e.allowTaint)!==null&&q!==void 0?q:!1,onclone:e.onclone,ignoreElements:e.ignoreElements,inlineImages:c,copyStyles:c},o.logger.debug("Starting document clone with size "+a.width+"x"+a.height+" scrolled to "+-a.left+","+-a.top),u=new td(o,n,l),f=u.clonedReferenceElement,f?[4,u.toIFrame(t,a)]:[2,Promise.reject("Unable to find element in cloned iframe")];case 1:return p=$.sent(),g=Fu(f)||rS(f)?R_(f.ownerDocument):po(o,f),m=g.width,d=g.height,h=g.left,_=g.top,w=rM(o,f,e.backgroundColor),U={canvas:e.canvas,backgroundColor:w,scale:(se=(Y=e.scale)!==null&&Y!==void 0?Y:A.devicePixelRatio)!==null&&se!==void 0?se:1,x:((ae=e.x)!==null&&ae!==void 0?ae:0)+h,y:((pe=e.y)!==null&&pe!==void 0?pe:0)+_,width:(Pe=e.width)!==null&&Pe!==void 0?Pe:Math.ceil(m),height:(Ge=e.height)!==null&&Ge!==void 0?Ge:Math.ceil(d)},c?(o.logger.debug("Document cloned, using foreign object rendering"),S=new $S(o,U),[4,S.render(f)]):[3,3];case 2:return T=$.sent(),[3,5];case 3:return o.logger.debug("Document cloned, element located at "+h+","+_+" with size "+m+"x"+d+" using computed rendering"),o.logger.debug("Starting DOM parsing"),y=dg(o,f),w===y.styles.backgroundColor&&(y.styles.backgroundColor=ln.TRANSPARENT),o.logger.debug("Starting renderer for element at "+U.x+","+U.y+" with size "+U.width+"x"+U.height),S=new XS(o,U),[4,S.render(y)];case 4:T=$.sent(),$.label=5;case 5:return(!((J=e.removeContainer)!==null&&J!==void 0)||J)&&(td.destroy(p)||o.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")),o.logger.debug("Finished rendering"),[2,T]}})})},rM=function(n,e,t){var A=e.ownerDocument,i=A.documentElement?zr(n,getComputedStyle(A.documentElement).backgroundColor):ln.TRANSPARENT,r=A.body?zr(n,getComputedStyle(A.body).backgroundColor):ln.TRANSPARENT,s=typeof t=="string"?zr(n,t):t===null?ln.TRANSPARENT:4294967295;return e===A.documentElement?Dn(i)?Dn(r)?s:r:i:s};function sM(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Tu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return n;if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return new Uint8Array(n.buffer,n.byteOffset,n.byteLength);throw new Error("Unknown type, must be binary type")}function aM(n){return new TextEncoder().encode(n)}function oM(n){return new TextDecoder().decode(n)}function lM(n,e){if(n.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),A=0;A<t.length;A++)t[A]=255;for(var i=0;i<n.length;i++){var r=n.charAt(i),s=r.charCodeAt(0);if(t[s]!==255)throw new TypeError(r+" is ambiguous");t[s]=i}var a=n.length,o=n.charAt(0),c=Math.log(a)/Math.log(256),l=Math.log(256)/Math.log(a);function u(g){if(g instanceof Uint8Array||(ArrayBuffer.isView(g)?g=new Uint8Array(g.buffer,g.byteOffset,g.byteLength):Array.isArray(g)&&(g=Uint8Array.from(g))),!(g instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(g.length===0)return"";for(var m=0,d=0,h=0,_=g.length;h!==_&&g[h]===0;)h++,m++;for(var w=(_-h)*l+1>>>0,U=new Uint8Array(w);h!==_;){for(var T=g[h],y=0,S=w-1;(T!==0||y<d)&&S!==-1;S--,y++)T+=256*U[S]>>>0,U[S]=T%a>>>0,T=T/a>>>0;if(T!==0)throw new Error("Non-zero carry");d=y,h++}for(var L=w-d;L!==w&&U[L]===0;)L++;for(var x=o.repeat(m);L<w;++L)x+=n.charAt(U[L]);return x}function f(g){if(typeof g!="string")throw new TypeError("Expected String");if(g.length===0)return new Uint8Array;var m=0;if(g[m]!==" "){for(var d=0,h=0;g[m]===o;)d++,m++;for(var _=(g.length-m)*c+1>>>0,w=new Uint8Array(_);g[m];){var U=t[g.charCodeAt(m)];if(U===255)return;for(var T=0,y=_-1;(U!==0||T<h)&&y!==-1;y--,T++)U+=a*w[y]>>>0,w[y]=U%256>>>0,U=U/256>>>0;if(U!==0)throw new Error("Non-zero carry");h=T,m++}if(g[m]!==" "){for(var S=_-h;S!==_&&w[S]===0;)S++;for(var L=new Uint8Array(d+(_-S)),x=d;S!==_;)L[x++]=w[S++];return L}}}function p(g){var m=f(g);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:u,decodeUnsafe:f,decode:p}}var cM=lM,uM=cM;class fM{constructor(e,t,A){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=A}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class hM{constructor(e,t,A){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseDecode");Ee(this,"prefixCodePoint");this.name=e,this.prefix=t;const i=t.codePointAt(0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=A}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return bg(this,e)}}class dM{constructor(e){Ee(this,"decoders");this.decoders=e}or(e){return bg(this,e)}decode(e){const t=e[0],A=this.decoders[t];if(A!=null)return A.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function bg(n,e){return new dM({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class pM{constructor(e,t,A,i){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseEncode");Ee(this,"baseDecode");Ee(this,"encoder");Ee(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=A,this.baseDecode=i,this.encoder=new fM(e,t,A),this.decoder=new hM(e,t,i)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function yo({name:n,prefix:e,encode:t,decode:A}){return new pM(n,e,t,A)}function cs({name:n,prefix:e,alphabet:t}){const{encode:A,decode:i}=uM(t,n);return yo({prefix:e,name:n,encode:A,decode:r=>Tu(i(r))})}function gM(n,e,t,A){let i=n.length;for(;n[i-1]==="=";)--i;const r=new Uint8Array(i*t/8|0);let s=0,a=0,o=0;for(let c=0;c<i;++c){const l=e[n[c]];if(l===void 0)throw new SyntaxError(`Non-${A} character`);a=a<<t|l,s+=t,s>=8&&(s-=8,r[o++]=255&a>>s)}if(s>=t||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return r}function mM(n,e,t){const A=e[e.length-1]==="=",i=(1<<t)-1;let r="",s=0,a=0;for(let o=0;o<n.length;++o)for(a=a<<8|n[o],s+=8;s>t;)s-=t,r+=e[i&a>>s];if(s!==0&&(r+=e[i&a<<t-s]),A)for(;(r.length*t&7)!==0;)r+="=";return r}function BM(n){const e={};for(let t=0;t<n.length;++t)e[n[t]]=t;return e}function Wt({name:n,prefix:e,bitsPerChar:t,alphabet:A}){const i=BM(A);return yo({prefix:e,name:n,encode(r){return mM(r,A,t)},decode(r){return gM(r,i,t,n)}})}const nn=cs({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),wM=cs({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),vM=Object.freeze(Object.defineProperty({__proto__:null,base58btc:nn,base58flickr:wM},Symbol.toStringTag,{value:"Module"})),Ar=Wt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),CM=Wt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),_M=Wt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),xM=Wt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),EM=Wt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),yM=Wt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),UM=Wt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),SM=Wt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),MM=Wt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),bM=Object.freeze(Object.defineProperty({__proto__:null,base32:Ar,base32hex:EM,base32hexpad:UM,base32hexpadupper:SM,base32hexupper:yM,base32pad:_M,base32padupper:xM,base32upper:CM,base32z:MM},Symbol.toStringTag,{value:"Module"})),Fa=cs({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),FM=cs({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),TM=Object.freeze(Object.defineProperty({__proto__:null,base36:Fa,base36upper:FM},Symbol.toStringTag,{value:"Module"}));var IM=Fg,sd=128,QM=-128,LM=Math.pow(2,31);function Fg(n,e,t){e=e||[],t=t||0;for(var A=t;n>=LM;)e[t++]=n&255|sd,n/=128;for(;n&QM;)e[t++]=n&255|sd,n>>>=7;return e[t]=n|0,Fg.bytes=t-A+1,e}var RM=Jc,DM=128,ad=127;function Jc(n,A){var t=0,A=A||0,i=0,r=A,s,a=n.length;do{if(r>=a)throw Jc.bytes=0,new RangeError("Could not decode varint");s=n[r++],t+=i<28?(s&ad)<<i:(s&ad)*Math.pow(2,i),i+=7}while(s>=DM);return Jc.bytes=r-A,t}var PM=Math.pow(2,7),HM=Math.pow(2,14),NM=Math.pow(2,21),OM=Math.pow(2,28),GM=Math.pow(2,35),VM=Math.pow(2,42),kM=Math.pow(2,49),KM=Math.pow(2,56),zM=Math.pow(2,63),WM=function(n){return n<PM?1:n<HM?2:n<NM?3:n<OM?4:n<GM?5:n<VM?6:n<kM?7:n<KM?8:n<zM?9:10},XM={encode:IM,decode:RM,encodingLength:WM},qa=XM;function Zc(n,e=0){return[qa.decode(n,e),qa.decode.bytes]}function ja(n,e,t=0){return qa.encode(n,e,t),e}function $a(n){return qa.encodingLength(n)}function YM(n,e){const t=e.byteLength,A=$a(n),i=A+$a(t),r=new Uint8Array(i+t);return ja(n,r,0),ja(t,r,A),r.set(e,i),new Iu(n,t,e,r)}function JM(n){const e=Tu(n),[t,A]=Zc(e),[i,r]=Zc(e.subarray(A)),s=e.subarray(A+r);if(s.byteLength!==i)throw new Error("Incorrect length");return new Iu(t,i,s,e)}function ZM(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&sM(n.bytes,t.bytes)}}class Iu{constructor(e,t,A,i){Ee(this,"code");Ee(this,"size");Ee(this,"digest");Ee(this,"bytes");this.code=e,this.size=t,this.digest=A,this.bytes=i}}function od(n,e){const{bytes:t,version:A}=n;switch(A){case 0:return jM(t,qc(n),e??nn.encoder);default:return $M(t,qc(n),e??Ar.encoder)}}const ld=new WeakMap;function qc(n){const e=ld.get(n);if(e==null){const t=new Map;return ld.set(n,t),t}return e}var Nd;class Vt{constructor(e,t,A,i){Ee(this,"code");Ee(this,"version");Ee(this,"multihash");Ee(this,"bytes");Ee(this,"/");Ee(this,Nd,"CID");this.code=t,this.version=e,this.multihash=A,this.bytes=i,this["/"]=i}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==br)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==eb)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return Vt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,A=YM(e,t);return Vt.createV1(this.code,A)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return Vt.equals(this,e)}static equals(e,t){const A=t;return A!=null&&e.code===A.code&&e.version===A.version&&ZM(e.multihash,A.multihash)}toString(e){return od(this,e)}toJSON(){return{"/":od(this)}}link(){return this}[(Nd=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Vt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:A,code:i,multihash:r,bytes:s}=t;return new Vt(A,i,r,s??cd(A,i,r.bytes))}else if(t[tb]===!0){const{version:A,multihash:i,code:r}=t,s=JM(i);return Vt.create(A,r,s)}else return null}static create(e,t,A){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(A.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==br)throw new Error(`Version 0 CID must use dag-pb (code: ${br}) block encoding`);return new Vt(e,t,A,A.bytes)}case 1:{const i=cd(e,t,A.bytes);return new Vt(e,t,A,i)}default:throw new Error("Invalid version")}}static createV0(e){return Vt.create(0,br,e)}static createV1(e,t){return Vt.create(1,e,t)}static decode(e){const[t,A]=Vt.decodeFirst(e);if(A.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Vt.inspectBytes(e),A=t.size-t.multihashSize,i=Tu(e.subarray(A,A+t.multihashSize));if(i.byteLength!==t.multihashSize)throw new Error("Incorrect length");const r=i.subarray(t.multihashSize-t.digestSize),s=new Iu(t.multihashCode,t.digestSize,r,i);return[t.version===0?Vt.createV0(s):Vt.createV1(t.codec,s),e.subarray(t.size)]}static inspectBytes(e){let t=0;const A=()=>{const[u,f]=Zc(e.subarray(t));return t+=f,u};let i=A(),r=br;if(i===18?(i=0,t=0):r=A(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=t,a=A(),o=A(),c=t+o,l=c-s;return{version:i,codec:r,multihashCode:a,digestSize:o,multihashSize:l,size:c}}static parse(e,t){const[A,i]=qM(e,t),r=Vt.decode(i);if(r.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return qc(r).set(A,e),r}}function qM(n,e){switch(n[0]){case"Q":{const t=e??nn;return[nn.prefix,t.decode(`${nn.prefix}${n}`)]}case nn.prefix:{const t=e??nn;return[nn.prefix,t.decode(n)]}case Ar.prefix:{const t=e??Ar;return[Ar.prefix,t.decode(n)]}case Fa.prefix:{const t=e??Fa;return[Fa.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function jM(n,e,t){const{prefix:A}=t;if(A!==nn.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const i=e.get(A);if(i==null){const r=t.encode(n).slice(1);return e.set(A,r),r}else return i}function $M(n,e,t){const{prefix:A}=t,i=e.get(A);if(i==null){const r=t.encode(n);return e.set(A,r),r}else return i}const br=112,eb=18;function cd(n,e,t){const A=$a(n),i=A+$a(e),r=new Uint8Array(i+t.byteLength);return ja(n,r,0),ja(e,r,A),r.set(t,i),r}const tb=Symbol.for("@ipld/js-cid/CID");function jc(n=0){return new Uint8Array(n)}function ts(n=0){return new Uint8Array(n)}function Tg(n,e){e==null&&(e=n.reduce((i,r)=>i+r.length,0));const t=ts(e);let A=0;for(const i of n)t.set(i,A),A+=i.length;return t}const Ab=cs({prefix:"9",name:"base10",alphabet:"0123456789"}),nb=Object.freeze(Object.defineProperty({__proto__:null,base10:Ab},Symbol.toStringTag,{value:"Module"})),ib=Wt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),rb=Wt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),sb=Object.freeze(Object.defineProperty({__proto__:null,base16:ib,base16upper:rb},Symbol.toStringTag,{value:"Module"})),ab=Wt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),ob=Object.freeze(Object.defineProperty({__proto__:null,base2:ab},Symbol.toStringTag,{value:"Module"})),Ig=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),lb=Ig.reduce((n,e,t)=>(n[t]=e,n),[]),cb=Ig.reduce((n,e,t)=>{const A=e.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${e}`);return n[A]=t,n},[]);function ub(n){return n.reduce((e,t)=>(e+=lb[t],e),"")}function fb(n){const e=[];for(const t of n){const A=t.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${t}`);const i=cb[A];if(i==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(i)}return new Uint8Array(e)}const hb=yo({prefix:"🚀",name:"base256emoji",encode:ub,decode:fb}),db=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:hb},Symbol.toStringTag,{value:"Module"})),pb=Wt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),gb=Wt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Qg=Wt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),mb=Wt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Bb=Object.freeze(Object.defineProperty({__proto__:null,base64:pb,base64pad:gb,base64url:Qg,base64urlpad:mb},Symbol.toStringTag,{value:"Module"})),wb=Wt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),vb=Object.freeze(Object.defineProperty({__proto__:null,base8:wb},Symbol.toStringTag,{value:"Module"})),Cb=yo({prefix:"\0",name:"identity",encode:n=>oM(n),decode:n=>aM(n)}),_b=Object.freeze(Object.defineProperty({__proto__:null,identity:Cb},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const $c={..._b,...ob,...vb,...nb,...sb,...bM,...TM,...vM,...Bb,...db};function Lg(n,e,t,A){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:A}}}const ud=Lg("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Fl=Lg("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=ts(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Rg={utf8:ud,"utf-8":ud,hex:$c.base16,latin1:Fl,ascii:Fl,binary:Fl,...$c};function Qu(n,e="utf8"){const t=Rg[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function eo(n,e="utf8"){const t=Rg[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}const xb=Math.pow(2,7),Eb=Math.pow(2,14),yb=Math.pow(2,21),Dg=Math.pow(2,28),Pg=Math.pow(2,35),Hg=Math.pow(2,42),Ng=Math.pow(2,49),nA=128,Cn=127;function Lu(n){if(n<xb)return 1;if(n<Eb)return 2;if(n<yb)return 3;if(n<Dg)return 4;if(n<Pg)return 5;if(n<Hg)return 6;if(n<Ng)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function Ub(n,e,t=0){switch(Lu(n)){case 8:e[t++]=n&255|nA,n/=128;case 7:e[t++]=n&255|nA,n/=128;case 6:e[t++]=n&255|nA,n/=128;case 5:e[t++]=n&255|nA,n/=128;case 4:e[t++]=n&255|nA,n>>>=7;case 3:e[t++]=n&255|nA,n>>>=7;case 2:e[t++]=n&255|nA,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function Sb(n,e){let t=n[e],A=0;if(A+=t&Cn,t<nA||(t=n[e+1],A+=(t&Cn)<<7,t<nA)||(t=n[e+2],A+=(t&Cn)<<14,t<nA)||(t=n[e+3],A+=(t&Cn)<<21,t<nA)||(t=n[e+4],A+=(t&Cn)*Dg,t<nA)||(t=n[e+5],A+=(t&Cn)*Pg,t<nA)||(t=n[e+6],A+=(t&Cn)*Hg,t<nA)||(t=n[e+7],A+=(t&Cn)*Ng,t<nA))return A;throw new RangeError("Could not decode varint")}const Ru=new Float32Array([-0]),In=new Uint8Array(Ru.buffer);function Mb(n,e,t){Ru[0]=n,e[t]=In[0],e[t+1]=In[1],e[t+2]=In[2],e[t+3]=In[3]}function bb(n,e){return In[0]=n[e],In[1]=n[e+1],In[2]=n[e+2],In[3]=n[e+3],Ru[0]}const Du=new Float64Array([-0]),Zt=new Uint8Array(Du.buffer);function Fb(n,e,t){Du[0]=n,e[t]=Zt[0],e[t+1]=Zt[1],e[t+2]=Zt[2],e[t+3]=Zt[3],e[t+4]=Zt[4],e[t+5]=Zt[5],e[t+6]=Zt[6],e[t+7]=Zt[7]}function Tb(n,e){return Zt[0]=n[e],Zt[1]=n[e+1],Zt[2]=n[e+2],Zt[3]=n[e+3],Zt[4]=n[e+4],Zt[5]=n[e+5],Zt[6]=n[e+6],Zt[7]=n[e+7],Du[0]}const Ib=BigInt(Number.MAX_SAFE_INTEGER),Qb=BigInt(Number.MIN_SAFE_INTEGER);class jt{constructor(e,t){Ee(this,"lo");Ee(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(t+A*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(BigInt(t)+(BigInt(A)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,A=this.hi>>>24;return A===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:A<128?9:10}static fromBigInt(e){if(e===0n)return oi;if(e<Ib&&e>Qb)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let A=e>>32n,i=e-(A<<32n);return t&&(A=~A|0n,i=~i|0n,++i>fd&&(i=0n,++A>fd&&(A=0n))),new jt(Number(i),Number(A))}static fromNumber(e){if(e===0)return oi;const t=e<0;t&&(e=-e);let A=e>>>0,i=(e-A)/4294967296>>>0;return t&&(i=~i>>>0,A=~A>>>0,++A>4294967295&&(A=0,++i>4294967295&&(i=0))),new jt(A,i)}static from(e){return typeof e=="number"?jt.fromNumber(e):typeof e=="bigint"?jt.fromBigInt(e):typeof e=="string"?jt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new jt(e.low>>>0,e.high>>>0):oi}}const oi=new jt(0,0);oi.toBigInt=function(){return 0n};oi.zzEncode=oi.zzDecode=function(){return this};oi.length=function(){return 1};const fd=4294967296n;function Lb(n){let e=0,t=0;for(let A=0;A<n.length;++A)t=n.charCodeAt(A),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(A+1)&64512)===56320?(++A,e+=4):e+=3;return e}function Rb(n,e,t){if(t-e<1)return"";let i;const r=[];let s=0,a;for(;e<t;)a=n[e++],a<128?r[s++]=a:a>191&&a<224?r[s++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,r[s++]=55296+(a>>10),r[s++]=56320+(a&1023)):r[s++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,s>8191&&((i??(i=[])).push(String.fromCharCode.apply(String,r)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,r.slice(0,s))),i.join("")):String.fromCharCode.apply(String,r.slice(0,s))}function Og(n,e,t){const A=t;let i,r;for(let s=0;s<n.length;++s)i=n.charCodeAt(s),i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&((r=n.charCodeAt(s+1))&64512)===56320?(i=65536+((i&1023)<<10)+(r&1023),++s,e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128);return t-A}function RA(n,e){return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function la(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class Db{constructor(e){Ee(this,"buf");Ee(this,"pos");Ee(this,"len");Ee(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,RA(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw RA(this,4);return la(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw RA(this,4);return la(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw RA(this,4);const e=bb(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw RA(this,4);const e=Tb(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,A=this.pos+e;if(A>this.len)throw RA(this,e);return this.pos+=e,t===A?new Uint8Array(0):this.buf.subarray(t,A)}string(){const e=this.bytes();return Rb(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw RA(this,e);this.pos+=e}else do if(this.pos>=this.len)throw RA(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new jt(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw RA(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw RA(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw RA(this,8);const e=la(this.buf,this.pos+=4),t=la(this.buf,this.pos+=4);return new jt(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Sb(this.buf,this.pos);return this.pos+=Lu(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Pb(n){return new Db(n instanceof Uint8Array?n:n.subarray())}function Pu(n,e,t){const A=Pb(n);return e.decode(A,void 0,t)}function Hb(n){let A,i=8192;return function(s){if(s<1||s>4096)return ts(s);i+s>8192&&(A=ts(8192),i=0);const a=A.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class Gr{constructor(e,t,A){Ee(this,"fn");Ee(this,"len");Ee(this,"next");Ee(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=A}}function Tl(){}class Nb{constructor(e){Ee(this,"head");Ee(this,"tail");Ee(this,"len");Ee(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const Ob=Hb();function Gb(n){return globalThis.Buffer!=null?ts(n):Ob(n)}class eu{constructor(){Ee(this,"len");Ee(this,"head");Ee(this,"tail");Ee(this,"states");this.len=0,this.head=new Gr(Tl,0,0),this.tail=this.head,this.states=null}_push(e,t,A){return this.tail=this.tail.next=new Gr(e,t,A),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new kb((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(ca,10,jt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=jt.fromBigInt(e);return this._push(ca,t.length(),t)}uint64Number(e){return this._push(Ub,Lu(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=jt.fromBigInt(e).zzEncode();return this._push(ca,t.length(),t)}sint64Number(e){const t=jt.fromNumber(e).zzEncode();return this._push(ca,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Il,1,e?1:0)}fixed32(e){return this._push(Fr,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=jt.fromBigInt(e);return this._push(Fr,4,t.lo)._push(Fr,4,t.hi)}fixed64Number(e){const t=jt.fromNumber(e);return this._push(Fr,4,t.lo)._push(Fr,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(Mb,4,e)}double(e){return this._push(Fb,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(Il,1,0):this.uint32(t)._push(Kb,t,e)}string(e){const t=Lb(e);return t!==0?this.uint32(t)._push(Og,t,e):this._push(Il,1,0)}fork(){return this.states=new Nb(this),this.head=this.tail=new Gr(Tl,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Gr(Tl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,A=this.len;return this.reset().uint32(A),A!==0&&(this.tail.next=e.next,this.tail=t,this.len+=A),this}finish(){let e=this.head.next;const t=Gb(this.len);let A=0;for(;e!=null;)e.fn(e.val,t,A),A+=e.len,e=e.next;return t}}function Il(n,e,t){e[t]=n&255}function Vb(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class kb extends Gr{constructor(t,A){super(Vb,t,A);Ee(this,"next");this.next=void 0}}function ca(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Fr(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function Kb(n,e,t){e.set(n,t)}globalThis.Buffer!=null&&(eu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(zb,e,n),this},eu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(Wb,e,n),this});function zb(n,e,t){e.set(n,t)}function Wb(n,e,t){n.length<40?Og(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(Qu(n),t)}function Xb(){return new eu}function Hu(n,e){const t=Xb();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}var tu;(function(n){n[n.VARINT=0]="VARINT",n[n.BIT64=1]="BIT64",n[n.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",n[n.START_GROUP=3]="START_GROUP",n[n.END_GROUP=4]="END_GROUP",n[n.BIT32=5]="BIT32"})(tu||(tu={}));function Yb(n,e,t,A){return{name:n,type:e,encode:t,decode:A}}function Nu(n,e){return Yb("message",tu.LENGTH_DELIMITED,n,e)}class Au extends Error{constructor(){super(...arguments);Ee(this,"code","ERR_MAX_LENGTH");Ee(this,"name","MaxLengthError")}}class Jb{constructor(){Ee(this,"index",0);Ee(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,A=e();return A===void 0&&(this.index=t),A}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,A){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return A()})}readNumber(e,t,A,i){return this.readAtomically(()=>{let r=0,s=0;const a=this.peekChar();if(a===void 0)return;const o=a==="0",c=2**(8*i)-1;for(;;){const l=this.readAtomically(()=>{const u=this.readChar();if(u===void 0)return;const f=Number.parseInt(u,e);if(!Number.isNaN(f))return f});if(l===void 0)break;if(r*=e,r+=l,r>c||(s+=1,t!==void 0&&s>t))return}if(s!==0)return!A&&o&&s>1?void 0:r})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const A=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(A===void 0)return;e[t]=A}return e})}readIPv6Addr(){const e=t=>{for(let A=0;A<t.length/2;A++){const i=A*2;if(A<t.length-3){const s=this.readSeparator(":",A,()=>this.readIPv4Addr());if(s!==void 0)return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],[i+4,!0]}const r=this.readSeparator(":",A,()=>this.readNumber(16,4,!0,2));if(r===void 0)return[i,!1];t[i]=r>>8,t[i+1]=r&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[A,i]=e(t);if(A===16)return t;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const r=new Uint8Array(14),s=16-(A+2),[a]=e(r.subarray(0,s));return t.set(r.subarray(0,a),16-a),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const Zb=45,qb=15,to=new Jb;function jb(n){if(!(n.length>qb))return to.new(n).parseWith(()=>to.readIPv4Addr())}function $b(n){if(n.includes("%")&&(n=n.split("%")[0]),!(n.length>Zb))return to.new(n).parseWith(()=>to.readIPv6Addr())}function Gg(n){return!!jb(n)}function eF(n){return!!$b(n)}class hi extends Error{constructor(){super(...arguments);Ee(this,"name","InvalidMultiaddrError")}}Ee(hi,"name","InvalidMultiaddrError");class fr extends Error{constructor(){super(...arguments);Ee(this,"name","ValidationError")}}Ee(fr,"name","ValidationError");class Vg extends Error{constructor(){super(...arguments);Ee(this,"name","UnknownProtocolError")}}Ee(Vg,"name","UnknownProtocolError");const tF=4,AF=6,nF=273,iF=33,rF=41,sF=42,aF=43,oF=53,lF=54,cF=55,uF=56,fF=132,hF=301,dF=302,pF=400,gF=421,mF=444,BF=445,wF=446,vF=447,CF=448,_F=449,xF=454,EF=460,yF=461,UF=465,SF=466,MF=480,bF=481,FF=443,TF=477,IF=478,QF=479,LF=277,RF=275,DF=276,PF=280,HF=281,NF=290,OF=777;function hd(n){return e=>eo(e,n)}function dd(n){return e=>Qu(e,n)}function Vr(n){return new DataView(n.buffer).getUint16(n.byteOffset).toString()}function Ji(n){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof n=="string"?parseInt(n):n),new Uint8Array(e)}function GF(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=Qu(e[0],"base32"),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=Ji(A);return Tg([t,i],t.length+i.length)}function VF(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=Ar.decode(`b${e[0]}`),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=Ji(A);return Tg([t,i],t.length+i.length)}function pd(n){const e=n.subarray(0,n.length-2),t=n.subarray(n.length-2),A=eo(e,"base32"),i=Vr(t);return`${A}:${i}`}const kg=function(n){n=n.toString().trim();const e=new Uint8Array(4);return n.split(/\./g).forEach((t,A)=>{const i=parseInt(t,10);if(isNaN(i)||i<0||i>255)throw new hi("Invalid byte value in IP address");e[A]=i}),e},kF=function(n){let e=0;n=n.toString().trim();const t=n.split(":",8);let A;for(A=0;A<t.length;A++){const r=Gg(t[A]);let s;r&&(s=kg(t[A]),t[A]=eo(s.subarray(0,2),"base16")),s!=null&&++A<8&&t.splice(A,0,eo(s.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(A=0;A<t.length&&t[A]!=="";A++);const r=[A,1];for(A=9-t.length;A>0;A--)r.push("0");t.splice.apply(t,r)}const i=new Uint8Array(e+16);for(A=0;A<t.length;A++){t[A]===""&&(t[A]="0");const r=parseInt(t[A],16);if(isNaN(r)||r<0||r>65535)throw new hi("Invalid byte value in IP address");i[e++]=r>>8&255,i[e++]=r&255}return i},KF=function(n){if(n.byteLength!==4)throw new hi("IPv4 address was incorrect length");const e=[];for(let t=0;t<n.byteLength;t++)e.push(n[t]);return e.join(".")},zF=function(n){if(n.byteLength!==16)throw new hi("IPv6 address was incorrect length");const e=[];for(let A=0;A<n.byteLength;A+=2){const i=n[A],r=n[A+1],s=`${i.toString(16).padStart(2,"0")}${r.toString(16).padStart(2,"0")}`;e.push(s)}const t=e.join(":");try{const A=new URL(`http://[${t}]`);return A.hostname.substring(1,A.hostname.length-1)}catch{throw new hi(`Invalid IPv6 address "${t}"`)}};function WF(n){try{const e=new URL(`http://[${n}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new hi(`Invalid IPv6 address "${n}"`)}}const Ql=Object.values($c).map(n=>n.decoder),XF=(function(){let n=Ql[0].or(Ql[1]);return Ql.slice(2).forEach(e=>n=n.or(e)),n})();function YF(n){return XF.decode(n)}function JF(n){return e=>n.encoder.encode(e)}function ZF(n){if(parseInt(n).toString()!==n)throw new fr("Value must be an integer")}function qF(n){if(n<0)throw new fr("Value must be a positive integer, or zero")}function jF(n){return e=>{if(e>n)throw new fr(`Value must be smaller than or equal to ${n}`)}}function $F(...n){return e=>{for(const t of n)t(e)}}const ua=$F(ZF,qF,jF(65535)),hA=-1;class eT{constructor(){Ee(this,"protocolsByCode",new Map);Ee(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new Vg(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(A=>{this.protocolsByName.set(A,e)})}removeProtocol(e){var A;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(A=t.aliases)==null||A.forEach(i=>{this.protocolsByName.delete(i)}))}}const tT=new eT,AT=[{code:tF,name:"ip4",size:32,valueToBytes:kg,bytesToValue:KF,validate:n=>{if(!Gg(n))throw new fr(`Invalid IPv4 address "${n}"`)}},{code:AF,name:"tcp",size:16,valueToBytes:Ji,bytesToValue:Vr,validate:ua},{code:nF,name:"udp",size:16,valueToBytes:Ji,bytesToValue:Vr,validate:ua},{code:iF,name:"dccp",size:16,valueToBytes:Ji,bytesToValue:Vr,validate:ua},{code:rF,name:"ip6",size:128,valueToBytes:kF,bytesToValue:zF,stringToValue:WF,validate:n=>{if(!eF(n))throw new fr(`Invalid IPv6 address "${n}"`)}},{code:sF,name:"ip6zone",size:hA},{code:aF,name:"ipcidr",size:8,bytesToValue:hd("base10"),valueToBytes:dd("base10")},{code:oF,name:"dns",size:hA},{code:lF,name:"dns4",size:hA},{code:cF,name:"dns6",size:hA},{code:uF,name:"dnsaddr",size:hA},{code:fF,name:"sctp",size:16,valueToBytes:Ji,bytesToValue:Vr,validate:ua},{code:hF,name:"udt"},{code:dF,name:"utp"},{code:pF,name:"unix",size:hA,stringToValue:n=>decodeURIComponent(n),valueToString:n=>encodeURIComponent(n)},{code:gF,name:"p2p",aliases:["ipfs"],size:hA,bytesToValue:hd("base58btc"),valueToBytes:n=>n.startsWith("Q")||n.startsWith("1")?dd("base58btc")(n):Vt.parse(n).multihash.bytes},{code:mF,name:"onion",size:96,bytesToValue:pd,valueToBytes:GF},{code:BF,name:"onion3",size:296,bytesToValue:pd,valueToBytes:VF},{code:wF,name:"garlic64",size:hA},{code:vF,name:"garlic32",size:hA},{code:CF,name:"tls"},{code:_F,name:"sni",size:hA},{code:xF,name:"noise"},{code:EF,name:"quic"},{code:yF,name:"quic-v1"},{code:UF,name:"webtransport"},{code:SF,name:"certhash",size:hA,bytesToValue:JF(Qg),valueToBytes:YF},{code:MF,name:"http"},{code:bF,name:"http-path",size:hA,stringToValue:n=>`/${decodeURIComponent(n)}`,valueToString:n=>encodeURIComponent(n.substring(1))},{code:FF,name:"https"},{code:TF,name:"ws"},{code:IF,name:"wss"},{code:QF,name:"p2p-websocket-star"},{code:LF,name:"p2p-stardust"},{code:RF,name:"p2p-webrtc-star"},{code:DF,name:"p2p-webrtc-direct"},{code:PF,name:"webrtc-direct"},{code:HF,name:"webrtc"},{code:NF,name:"p2p-circuit"},{code:OF,name:"memory",size:hA}];AT.forEach(n=>{tT.addProtocol(n)});var Od,Gd;(Gd=(Od=globalThis.process)==null?void 0:Od.env)!=null&&Gd.DUMP_SESSION_KEYS;var Ao;(function(n){let e;n.codec=()=>(e==null&&(e=Nu((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.webtransportCerthashes!=null)for(const r of t.webtransportCerthashes)A.uint32(10),A.bytes(r);if(t.streamMuxers!=null)for(const r of t.streamMuxers)A.uint32(18),A.string(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a,o;const r={webtransportCerthashes:[],streamMuxers:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const c=t.uint32();switch(c>>>3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&r.webtransportCerthashes.length===i.limits.webtransportCerthashes)throw new Au('Decode error - map field "webtransportCerthashes" had too many elements');r.webtransportCerthashes.push(t.bytes());break}case 2:{if(((o=i.limits)==null?void 0:o.streamMuxers)!=null&&r.streamMuxers.length===i.limits.streamMuxers)throw new Au('Decode error - map field "streamMuxers" had too many elements');r.streamMuxers.push(t.string());break}default:{t.skipType(c&7);break}}}return r})),e),n.encode=t=>Hu(t,n.codec()),n.decode=(t,A)=>Pu(t,n.codec(),A)})(Ao||(Ao={}));var gd;(function(n){let e;n.codec=()=>(e==null&&(e=Nu((t,A,i={})=>{i.lengthDelimited!==!1&&A.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(A.uint32(10),A.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(A.uint32(18),A.bytes(t.identitySig)),t.extensions!=null&&(A.uint32(34),Ao.codec().encode(t.extensions,A)),i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={identityKey:jc(0),identitySig:jc(0)},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.identityKey=t.bytes();break}case 2:{r.identitySig=t.bytes();break}case 4:{r.extensions=Ao.codec().decode(t,t.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>Hu(t,n.codec()),n.decode=(t,A)=>Pu(t,n.codec(),A)})(gd||(gd={}));var md;(function(n){n[n.Data=0]="Data",n[n.WindowUpdate=1]="WindowUpdate",n[n.Ping=2]="Ping",n[n.GoAway=3]="GoAway"})(md||(md={}));var nu;(function(n){n[n.SYN=1]="SYN",n[n.ACK=2]="ACK",n[n.FIN=4]="FIN",n[n.RST=8]="RST"})(nu||(nu={}));Object.values(nu).filter(n=>typeof n!="string");var Bd;(function(n){n[n.NormalTermination=0]="NormalTermination",n[n.ProtocolError=1]="ProtocolError",n[n.InternalError=2]="InternalError"})(Bd||(Bd={}));var wd;(function(n){n[n.Init=0]="Init",n[n.SYNSent=1]="SYNSent",n[n.SYNReceived=2]="SYNReceived",n[n.Established=3]="Established",n[n.Finished=4]="Finished",n[n.Paused=5]="Paused"})(wd||(wd={}));var vd;(function(n){let e;n.codec=()=>(e==null&&(e=Nu((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(A.uint32(10),A.bytes(t.publicKey)),t.addrs!=null)for(const r of t.addrs)A.uint32(18),A.bytes(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={publicKey:jc(0),addrs:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.publicKey=t.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&r.addrs.length===i.limits.addrs)throw new Au('Decode error - map field "addrs" had too many elements');r.addrs.push(t.bytes());break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>Hu(t,n.codec()),n.decode=(t,A)=>Pu(t,n.codec(),A)})(vd||(vd={}));new TextEncoder;new TextDecoder;const nT="modulepreload",iT=function(n,e){return new URL(n,e).href},Cd={},rT=function(e,t,A){let i=Promise.resolve();if(t&&t.length>0){let s=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=s(t.map(l=>{if(l=iT(l,A),l in Cd)return;Cd[l]=!0;const u=l.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!A)for(let m=a.length-1;m>=0;m--){const d=a[m];if(d.href===l&&(!u||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${f}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":nT,u||(g.as="script"),g.crossOrigin="",g.href=l,c&&g.setAttribute("nonce",c),document.head.appendChild(g),u)return new Promise((m,d)=>{g.addEventListener("load",m),g.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};class sT{constructor(e={}){const t=typeof navigator<"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4;this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,maxWorkers:e.maxWorkers||t,...e},this.workers=[],this.taskQueue=[],this.activeTasks=new Map,this.commitDeltaHandler=null,this.capabilities={cpu:!0,webgpu:!1},this.initialized=!1}setCommitDeltaHandler(e){this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.initialized)return;if(this.initialized=!0,!(typeof Worker<"u"&&this.config.enableWorkers)){console.warn("[ComputeManager] Web Workers not available; falling back to inline execution");return}const t=new URL("data:text/javascript;base64,LyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovCgpzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChldmVudCkgPT4gewogIGNvbnN0IG1zZyA9IGV2ZW50LmRhdGE7CiAgaWYgKCFtc2cgfHwgbXNnLnR5cGUgIT09ICdydW4nKSByZXR1cm47CiAgY29uc3QgeyBpZCwgZGF0YSwgZm4sIG1vZHVsZSwgZXhwb3J0TmFtZSB9ID0gbXNnOwogIHRyeSB7CiAgICBsZXQgaGFuZGxlcjsKICAgIGlmIChmbikgewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMKICAgICAgaGFuZGxlciA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICgke2ZufSk7YCkoKTsKICAgIH0gZWxzZSBpZiAobW9kdWxlKSB7CiAgICAgIC8vIFNpbGVuY2Ugd2VicGFjaydzICJkZXBlbmRlbmN5IGlzIGFuIGV4cHJlc3Npb24iIHdhcm5pbmcgYnkgZXhwbGljaXRseSBpZ25vcmluZyBidW5kbGluZyBoZXJlLgogICAgICAvLyBUaGUgd29ya2VyIGV4cGVjdHMgYSByZWFsIFVSTCBzdHJpbmcgcGFzc2VkIGluIGZyb20gdGhlIG1haW4gdGhyZWFkLgogICAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoCiAgICAgICAgLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLwogICAgICAgIG1vZHVsZQogICAgICApOwogICAgICBoYW5kbGVyID0gbW9kW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTsKICAgIH0KICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhbmRsZXIgbm90IGZvdW5kIGZvciB0YXNrJyk7CiAgICB9CiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKGRhdGEpOwogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXN1bHQnLCBpZCwgcmVzdWx0IH0pOwogIH0gY2F0Y2ggKGVycikgewogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIGlkLCBlcnJvcjogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpIH0pOwogIH0KfTsK",import.meta.url),A=Math.max(1,Math.min(this.config.maxWorkers,128));for(let i=0;i<A;i++){const r=new Worker(t,{type:"module"});r.onmessage=s=>this._handleWorkerMessage(r,s.data),r.onerror=s=>console.error("[ComputeManager] Worker error",s),this.workers.push(r)}}async submitTask(e){if(!e)throw new Error("Task is required");if(!e.fn&&!e.module)throw new Error("Task must provide fn or module");const t=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,A=e.id||t,i={id:A,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,exportName:e.exportName||"default"};return this.initialized||await this.initialize(),new Promise((r,s)=>{const a={id:A,payload:i,resolve:r,reject:s};this._dispatchToWorker(a)||(this.taskQueue.push(a),this._scheduleNext())})}async distributeTask(e,t){}async cancelTask(e){}getCapabilities(){return{...this.capabilities,workers:this.workers.length,activeTaskCount:this.activeTasks.size,queuedTaskCount:this.taskQueue.length}}getStats(){return{totalTasksCompleted:0,averageTaskDuration:0,currentLoad:0}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_dispatchToWorker(e){const t=this.workers.find(A=>!Array.from(this.activeTasks.values()).some(i=>i.worker===A));return t?(this.activeTasks.set(e.id,{...e,worker:t}),t.postMessage({type:"run",...e.payload}),!0):!1}async _executeInline(e){try{let t;if(e.payload.fn)t=new Function(`return (${e.payload.fn});`)();else if(e.payload.module){if(typeof e.payload.module!="string")throw new Error("module path must be a string");t=(await rT(()=>import(`${e.payload.module}`),[],import.meta.url))[e.payload.exportName||"default"]}const A=await t(e.payload.data);if(A&&typeof A=="object"&&Object.prototype.hasOwnProperty.call(A,"commitDelta")){this.commitDelta(A.commitDelta);const i=Object.prototype.hasOwnProperty.call(A,"value")?A.value:A.result;e.resolve(i);return}e.resolve(A)}catch(t){e.reject(t)}}_handleWorkerMessage(e,t){const{id:A,type:i,result:r,error:s}=t||{},a=this.activeTasks.get(A);if(a){if(i==="result"){let o=r;r&&typeof r=="object"&&Object.prototype.hasOwnProperty.call(r,"commitDelta")&&(this.commitDelta(r.commitDelta),o=Object.prototype.hasOwnProperty.call(r,"value")?r.value:r.result),a.resolve(o)}else i==="error"&&a.reject(new Error(s||"Worker task failed"));this.activeTasks.delete(A),this._scheduleNext()}}_scheduleNext(){if(this.taskQueue.length===0)return;const e=this.taskQueue.shift();if(this.workers.length===0){this._executeInline(e);return}this._dispatchToWorker(e)||this.taskQueue.unshift(e)}}const _d=[68/255,136/255,255/255],xd=[255/255,170/255,238/255],Ed=[255/255,221/255,170/255],Ll=(n,e,t)=>n+(e-n)*t,Rl=(n,e,t)=>[Ll(n[0],e[0],t),Ll(n[1],e[1],t),Ll(n[2],e[2],t)],aT=n=>{let e=n;return()=>{const t=Math.sin(e++)*1e4;return t-Math.floor(t)}},Jr=(n,e)=>{const t=n()*Math.PI*2,A=Math.acos(2*n()-1),i=Math.sin(A);return{x:e*i*Math.cos(t),y:e*i*Math.sin(t),z:e*Math.cos(A)}};function oT({seed:n=1337,starCount:e=25e4,clusterCount:t=300,scale:A=1e8,filamentScatter:i=.04}={}){const r=aT(n),s=new Float32Array(e*3),a=new Float32Array(e*3),o=new Float32Array(e),c=[];for(let l=0;l<t;l++){const u=Math.pow(r(),.5)*A,f=Jr(r,u);c.push(f)}for(let l=0;l<e;l++){const u=l*3,f=Math.floor(r()*t);let p=f,g=1/0;for(let C=0;C<3;C++){const I=Math.floor(r()*t);if(I===f)continue;const W=c[f].x-c[I].x,H=c[f].y-c[I].y,z=c[f].z-c[I].z,Z=W*W+H*H+z*z;Z<g&&(g=Z,p=I)}let m=r();m=m<.5?2*m*m:-1+(4-2*m)*m;const d=c[f],h=c[p],_=d.x+(h.x-d.x)*m,w=d.y+(h.y-d.y)*m,U=d.z+(h.z-d.z)*m,T=A*i,y=r()*T,S=Jr(r,y);s[u]=_+S.x,s[u+1]=w+S.y,s[u+2]=U+S.z;const L=r();let x;L<.33?x=Rl(_d,xd,r()):L<.66?x=Rl(xd,Ed,r()):x=Rl(Ed,_d,r()),a[u]=x[0],a[u+1]=x[1],a[u+2]=x[2],o[l]=r()*4e4+1e4}return{positions:s,colors:a,sizes:o}}function lT({starCount:n=25e4,radius:e=1e6,type:t=0}={}){const A=Math.random,i=new Float32Array(n*3),r=new Float32Array(n*3),s=new Float32Array(n),a=new Float32Array(n*3),o=[];if(t===2)for(let c=0;c<4;c++)o.push({x:(A()-.5)*e*1.2,y:(A()-.5)*e*.8,z:(A()-.5)*e*1.2});for(let c=0;c<n;c++){const l=c*3;let u=0,f=0,p=0,g=1;if(t===0)if(A()<.2){const d=A()*e*.25,h=Jr(A,d);u=h.x,f=h.y*.8,p=h.z,r[l]=1,r[l+1]=.8,r[l+2]=.4}else{const d=(A()*.1+Math.pow(A(),2)*.9)*e,h=2,w=Math.PI*2/h*(c%h)+7*Math.log(d/e*10+1);u=Math.cos(w)*d+(A()-.5)*e*.1,p=Math.sin(w)*d+(A()-.5)*e*.1,f=(A()-.5)*e*.02*(1+d/e),g=Math.sqrt(1/(d/e+.1)),A()>.3?(r[l]=.6,r[l+1]=.7,r[l+2]=1):(r[l]=1,r[l+1]=1,r[l+2]=1)}else if(t===1){const m=Math.pow(A(),2.5)*e*.6,d=Jr(A,m);u=d.x*.8,f=d.y*.6,p=d.z*.8,g=.1,r[l]=1,r[l+1]=.7,r[l+2]=.3}else{const m=o[c%o.length],d=A()*e*.3,h=Jr(A,d);u=m.x+h.x,f=m.y+h.y,p=m.z+h.z,g=.5,A()>.9?(r[l]=1,r[l+1]=.2,r[l+2]=.1,s[c]=A()*8e3+4e3):(r[l]=.6,r[l+1]=.8,r[l+2]=1)}i[l]=u,i[l+1]=f,i[l+2]=p,s[c]===0&&(s[c]=A()*4e3+1e3),a[l]=Math.sqrt(u*u+p*p),a[l+1]=g,a[l+2]=Math.atan2(p,u)}return{positions:i,colors:r,sizes:s,orbitParams:a}}const bt={UNIVERSE:1e8,GALAXY:1e6,SYSTEM:500,G:50},iu={LOW:{starCount:1e5,clusterCount:200},MED:{starCount:25e4,clusterCount:300},HIGH:{starCount:5e5,clusterCount:400},ULTRA:{starCount:1e6,clusterCount:500}},St={starCount:iu.HIGH.starCount,clusterCount:iu.HIGH.clusterCount,filamentScatter:.04,seed:1337},cT=new URL(""+new URL("universeTasks-ovK0bj-0.js",import.meta.url).href,import.meta.url).href,yd=new sT({maxWorkers:1});let fa=null;function uT(){return fa||(fa=yd.initialize().then(()=>yd).catch(n=>(console.warn("[Universes] ComputeManager unavailable:",n),null)),fa)}async function Kg(n,e){const t=await uT();if(!t)return null;try{return await t.submitTask({module:cT,exportName:n,data:e})}catch(A){return console.warn(`[Universes] Compute task ${n} failed:`,A),null}}const Wi=[{id:"O",prob:1e-4,color:10066431,temp:"30,000+",mass:60,rad:8,lum:"30,000+",lifespan:.01},{id:"B",prob:.0013,color:11184895,temp:"10,000-30,000",mass:10,rad:5,lum:"25-30,000",lifespan:.1},{id:"A",prob:.006,color:16777215,temp:"7,500-10,000",mass:3,rad:2.5,lum:"5-25",lifespan:1},{id:"F",prob:.03,color:16777198,temp:"6,000-7,500",mass:1.5,rad:1.3,lum:"1.5-5",lifespan:4},{id:"G",prob:.076,color:16768256,temp:"5,200-6,000",mass:1,rad:1,lum:"0.6-1.5",lifespan:10},{id:"K",prob:.121,color:16755234,temp:"3,700-5,200",mass:.7,rad:.8,lum:"0.08-0.6",lifespan:30},{id:"M",prob:.7645,color:16724736,temp:"2,400-3,700",mass:.3,rad:.4,lum:"< 0.08",lifespan:1e3},{id:"BH",prob:0,color:0,temp:"UNDEFINED",mass:20,rad:.05,lum:"0",lifespan:9999},{id:"N",prob:0,color:65535,temp:"600,000",mass:2.5,rad:.02,lum:"0.001",lifespan:9999},{id:"WD",prob:0,color:12320767,temp:"100,000",mass:.9,rad:.1,lum:"0.01",lifespan:9999}],ri=`
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
`;let Te,at,ne,Ce,UA,_t,nt,rt,ut,Ht,An,Ta,Ou=new xp,Sn=!1,Dl=new Ue,Qn=!1,gA=null;const EA=new Set;let li=!1,Ia=0,ha=null,da=null,dA=null,M=null;const pa=new Ep,Tr=new ot,Vi=new Q,Ud=new Q,ga=new Q,Zi=new Q,ma=new Q;function Pl(n){const e=Math.abs(n);return e>=1e7?n.toExponential(2):e>=1e4?Math.round(n).toLocaleString():n.toFixed(1)}function no(){var i,r,s;const n=(((i=R.activeGalaxyData)==null?void 0:i.designation)||`SEED-${St.seed}`).split("").reduce((a,o)=>a*31+o.charCodeAt(0)>>>0,0),e=/QUASAR|AGN/i.test(((r=R.activeGalaxyData)==null?void 0:r.type)||""),t=1e6+n%9e6,A=(.02+n%400/1e4).toFixed(3);return{designation:(s=R.activeGalaxyData)!=null&&s.designation?`${R.activeGalaxyData.designation} ${e?"QUASAR":"CORE"}`:e?"QUASAR CORE":"GALACTIC CORE",typeObj:{id:"BH",color:65280},state:"REMNANT",age:R.universeSimTime.toFixed(3),mass:t.toLocaleString(),radius:A,lum:e?"ACTIVE":"0",spectrum:[],composition:e?`AGN: ACTIVE (QUASAR)
ACCRETION: EXTREME
MASS: ${t.toLocaleString()} M☉`:`EVENT HORIZON: STABLE
ACCRETION: ACTIVE
MASS: ${t.toLocaleString()} M☉`}}function zg(){if(R.autopilotPriorityTargets=[],!R.isAutopilot||R.viewLevel!==1||!ut||ut.children.length===0)return;const n=no();ut.children.forEach(e=>{!e||typeof e.getWorldPosition!="function"||R.autopilotPriorityTargets.push({object:e,data:n})})}function Ir(){R.isAutopilot&&(R.isAutopilot=!1,R.autopilotPriorityTargets=[],lu&&(lu.checked=!1))}let Sd,io;const Zr=4,Pn={uBHCount:{value:0},uBHPos:{value:new Array(Zr).fill(new Ue(0,0))},uBHMass:{value:new Array(Zr).fill(0)}};let As=[],kA=[],nr=[],R={universeSimTime:13.8,galaxySimTime:0,isPaused:!1,timeScale:.1,viewLevel:0,isTransitioning:!1,transitionTarget:new Q,transitionData:null,transitionProgress:0,nextLevel:0,worldOffset:new Q(0,0,0),currentGalaxyType:0,pixelationFactor:1,selectedTarget:null,activeGalaxyData:null,activeSystemData:null,isAutopilot:!0,autopilotTimer:0,autopilotNextAction:2,visitedSystemsCount:0,lastGalaxyVisitTime:0,autopilotZooming:!1,autopilotPanelHidden:!1,autopilotPriorityTargets:[],planetTourIndex:0,trackingTarget:null,inspectingTarget:null,inspectingTargetPreviousPos:null,bigBangFlash:0};const Hl=document.getElementById("c-x"),Nl=document.getElementById("c-y"),Ol=document.getElementById("c-z"),Md=document.getElementById("time"),fT=document.getElementById("fps"),hT=document.getElementById("objects"),dT=document.getElementById("seed-disp");let ru=document.getElementById("pause-btn"),rn=document.getElementById("back-btn");const pT=document.getElementById("timestep-slider"),Uo=document.getElementById("alert-box"),Gl=document.getElementById("alert-title"),ir=document.getElementById("alert-msg");document.getElementById("alert-dismiss");document.getElementById("config-btn");const su=document.getElementById("config-modal"),gT=document.getElementById("config-close"),au=document.getElementById("retro-slider"),ou=document.getElementById("retro-val"),mT=document.getElementById("crt-toggle"),lu=document.getElementById("autopilot-toggle"),bd=document.getElementById("crt-overlay");let ro=document.getElementById("status-toggle-btn");document.getElementById("sim-toggle-btn");const so=document.getElementById("stats-panel"),ao=document.getElementById("controls-panel"),BT=document.getElementById("stats-close"),wT=document.getElementById("sim-close"),Wg=document.getElementById("loc-btn"),yA=document.getElementById("target-panel"),vT=document.getElementById("target-close"),CT=document.getElementById("target-title"),_T=document.getElementById("t-name"),Ba=document.getElementById("t-type"),xT=document.getElementById("t-age"),Fd=document.getElementById("t-mass"),Td=document.getElementById("t-rad"),Id=document.getElementById("t-lum"),Qd=document.getElementById("spectrograph"),ET=document.getElementById("t-composition"),yT=document.getElementById("warp-btn"),ki=document.getElementById("mouse-cursor");let Ld=0,Rd=0;$g();function Xg(){const n=document.getElementById("VRButton");n&&n.remove();const e=document.getElementById("vr-button-container"),t=document.createElement("button");if(t.id="VRButton",t.style.width="100%",t.textContent="VR...",t.disabled=!0,(e||document.body).appendChild(t),!(ne!=null&&ne.xr)||!(navigator!=null&&navigator.xr)){t.style.display="none";return}const A={optionalFeatures:["local-floor","bounded-floor"]};let i=null;const r=()=>{t.textContent=i?"EXIT VR":"ENTER VR"},s=()=>{i&&(i.removeEventListener("end",s),i=null,r())};t.onclick=async()=>{if(i){try{await i.end()}catch{}return}try{ne.xr.setReferenceSpaceType("local-floor")}catch{}try{i=await navigator.xr.requestSession("immersive-vr",A),i.addEventListener("end",s),await ne.xr.setSession(i),r()}catch(a){console.warn("WebXR session start failed:",a),i=null,t.textContent="VR FAILED",setTimeout(r,1500)}},navigator.xr.isSessionSupported("immersive-vr").then(a=>{if(!a){t.style.display="none";return}t.disabled=!1,r()}).catch(()=>{t.style.display="none"})}function UT(n){let A=1.6/Math.max(.25,Math.min(4,n||1));return A=Math.max(.45,Math.min(1.55,A)),{width:1.6,height:A}}function Yg(n){if(!(M!=null&&M.mesh)||M.planeAspect&&Math.abs(M.planeAspect-n)<.01)return;M.planeAspect=n;const{width:e,height:t}=UT(n);try{M.mesh.geometry.dispose()}catch{}if(M.mesh.geometry=new On(e,t),M.bgMesh){try{M.bgMesh.geometry.dispose()}catch{}M.bgMesh.geometry=new On(e*1.02,t*1.02)}if(M.border){const i=[new Q(-e/2,-t/2,.002),new Q(e/2,-t/2,.002),new Q(e/2,t/2,.002),new Q(-e/2,t/2,.002),new Q(-e/2,-t/2,.002)];try{M.border.geometry.dispose()}catch{}M.border.geometry=new Nt().setFromPoints(i)}}function oo(n){M!=null&&M.anchor&&(M.visible=n,M.anchor.visible=n,n?(M.needsCapture=!0,M.lastCaptureMs=0,(M.controllers||[]).forEach(e=>{e!=null&&e.line&&(e.line.visible=!0)})):(M.reticle&&(M.reticle.visible=!1),(M.controllers||[]).forEach(e=>{var t,A;e!=null&&e.line&&(e.line.visible=!1),(A=(t=e==null?void 0:e.controller)==null?void 0:t.userData)!=null&&A.vrUi&&(e.controller.userData.vrUi.hoverEl=null,e.controller.userData.vrUi.activeEl=null,e.controller.userData.vrUi.clickTarget=null,e.controller.userData.vrUi.draggingRange=null,e.controller.userData.vrUi.pressed=!1)})))}function Jg(n="VR UI"){if(!(M!=null&&M.canvas))return;const e=M.canvas.getContext("2d");if(!e)return;const t=M.canvas.width||1,A=M.canvas.height||1;e.clearRect(0,0,t,A),e.fillStyle="rgba(0, 15, 0, 0.92)",e.fillRect(0,0,t,A),e.strokeStyle="rgba(0, 255, 0, 0.85)";const i=Math.max(2,Math.floor(Math.min(t,A)/220));e.lineWidth=i,e.strokeRect(i/2,i/2,t-i,A-i),e.fillStyle="rgba(0, 255, 0, 0.95)";const r=Math.max(18,Math.floor(Math.min(t,A)/14)),s=Math.max(12,Math.floor(r*.55));e.font=`${r}px monospace`,e.fillText(n,i*2,i*2+r),e.font=`${s}px monospace`,e.fillText("waiting for capture…",i*2,i*2+r+s+6),e.fillText(new Date().toLocaleTimeString(),i*2,i*2+r+(s+6)*2),M.texture&&(M.texture.needsUpdate=!0)}function ST(n){let e=n;for(let t=0;t<6&&e;t++){if(e instanceof HTMLInputElement){if(e.type==="range")return{kind:"range",el:e};if(e.type==="checkbox"||e.type==="button")return{kind:"click",el:e}}if(e instanceof HTMLButtonElement)return{kind:"click",el:e};if(e instanceof HTMLLabelElement)return{kind:"click",el:e};if(e.classList&&e.classList.contains("panel-close"))return{kind:"click",el:e};e=e.parentElement}return n?{kind:"click",el:n}:null}function Gu(n,e,t=!1){if(!n)return;const A=n.getBoundingClientRect();if(!A||A.width<=0)return;const i=Number(n.min||0),r=Number(n.max||1),s=Number(n.step||0);let a=(e-A.left)/A.width;a=Math.max(0,Math.min(1,a));let o=i+a*(r-i);Number.isFinite(s)&&s>0&&(o=Math.round(o/s)*s);const c=n.value;n.value=String(o),c!==n.value&&n.dispatchEvent(new Event("input",{bubbles:!0})),t&&n.dispatchEvent(new Event("change",{bubbles:!0}))}function So(){if(!(!M||!ne||!at)){M.controllers&&M.controllers.length&&M.controllers.forEach(({controller:n})=>{if(n){try{n.removeEventListener("selectstart",Dd)}catch{}try{n.removeEventListener("selectend",Pd)}catch{}try{at.remove(n)}catch{}}}),M.controllers=[];for(let n=0;n<2;n++){const e=ne.xr.getController(n);e.userData.vrUi={index:n,pointerId:9e3+n,pressed:!1,hoverEl:null,activeEl:null,clickTarget:null,draggingRange:null,clientX:0,clientY:0},e.addEventListener("selectstart",Dd),e.addEventListener("selectend",Pd);const t=new Nt().setFromPoints([new Q(0,0,0),new Q(0,0,-1)]),A=new xu({color:65280,transparent:!0,opacity:.8}),i=new Cp(t,A);i.name="vr-ui-ray",i.visible=!1,i.renderOrder=998,i.scale.z=2,e.add(i),at.add(e),M.controllers.push({controller:e,line:i})}}}function Vu(){var A;const n=document.getElementById("ui-layer");if(!n||!at)return;if(M||(M={}),M.uiLayer=n,!M.captureHost){let i=document.getElementById("vr-ui-capture-host");i||(i=document.createElement("div"),i.id="vr-ui-capture-host",i.setAttribute("aria-hidden","true"),i.style.position="fixed",i.style.left="0",i.style.top="200vh",i.style.width="1px",i.style.height="1px",i.style.overflow="hidden",i.style.pointerEvents="none",i.style.opacity="0",i.style.zIndex="-1",document.body.appendChild(i)),M.captureHost=i,M.captureLayer=null}if(M.maxCaptureDim=2048,M.captureIntervalMs=500,M.captureInFlight=!1,M.needsCapture=!0,typeof M.dirtyCounter!="number"&&(M.dirtyCounter=0),typeof M.forceCapture!="boolean"&&(M.forceCapture=!1),M.lastCaptureMs=0,M.visible=!1,M.canvas||(M.canvas=document.createElement("canvas"),M.canvas.width=512,M.canvas.height=256),!M.texture){M.texture=new __(M.canvas),M.texture.minFilter=wA,M.texture.magFilter=wA,M.texture.generateMipmaps=!1;try{(A=ne==null?void 0:ne.capabilities)!=null&&A.getMaxAnisotropy&&(M.texture.anisotropy=Math.max(1,ne.capabilities.getMaxAnisotropy()))}catch{}M.texture.colorSpace=PA}if(Jg("VR UI"),M.material?M.material.map=M.texture:(M.material=new er({map:M.texture,transparent:!0}),M.material.depthTest=!1,M.material.depthWrite=!1,M.material.side=BA),M.anchor)try{at.remove(M.anchor)}catch{}M.anchor=new ni,M.anchor.visible=!1,M.anchor.name="vr-ui-anchor",at.add(M.anchor),M.planeAspect=null;const e=window.innerWidth/window.innerHeight;M.mesh=new Ft(new On(1,1),M.material),M.mesh.name="vr-ui-plane",M.mesh.frustumCulled=!1,M.mesh.renderOrder=999,M.mesh.rotation.x=-.07,M.anchor.add(M.mesh),M.bgMaterial||(M.bgMaterial=new er({color:6656,transparent:!0,opacity:.25}),M.bgMaterial.depthTest=!1,M.bgMaterial.depthWrite=!1,M.bgMaterial.side=BA),M.bgMesh=new Ft(new On(1,1),M.bgMaterial),M.bgMesh.name="vr-ui-backdrop",M.bgMesh.frustumCulled=!1,M.bgMesh.renderOrder=998,M.bgMesh.position.z=-.003,M.mesh.add(M.bgMesh),M.borderMaterial||(M.borderMaterial=new xu({color:65280,transparent:!0,opacity:.6}),M.borderMaterial.depthTest=!1,M.borderMaterial.depthWrite=!1),M.border=new Cp(new Nt,M.borderMaterial),M.border.name="vr-ui-border",M.border.renderOrder=1e3,M.mesh.add(M.border),Yg(e);const t=new er({color:65280,transparent:!0,opacity:.9});t.depthTest=!1,t.depthWrite=!1,M.reticle=new Ft(new fo(.008,.012,32),t),M.reticle.name="vr-ui-reticle",M.reticle.visible=!1,M.reticle.position.z=.001,M.reticle.renderOrder=1e3,M.mesh.add(M.reticle),M.mutationObserver&&M.mutationObserver.disconnect(),M.mutationObserver=new MutationObserver(()=>{M&&(M.needsCapture=!0,M.dirtyCounter=(M.dirtyCounter||0)+1)}),M.mutationObserver.observe(n,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),So()}async function ku(){var o;if(!(M!=null&&M.uiLayer)||!(M!=null&&M.texture)||!M.visible||M.captureInFlight)return;const n=M.uiLayer.getBoundingClientRect();if(!n||n.width<2||n.height<2)return;M.captureInFlight=!0;const e=M.maxCaptureDim||1024,t=Math.min(2,e/Math.max(n.width,n.height)),A=Math.max(2,Math.round(n.width*t)),i=Math.max(2,Math.round(n.height*t));M.canvas&&(M.canvas.width!==A&&(M.canvas.width=A),M.canvas.height!==i&&(M.canvas.height=i));const r=M.dirtyCounter||0,s=!!M.forceCapture;M.forceCapture=!1;let a=M.uiLayer;try{const c=await nM(a,{backgroundColor:"rgba(0, 15, 0, 0.92)",logging:!1,scale:t,useCORS:!0,removeContainer:!0,width:n.width,height:n.height,x:n.left,y:n.top,windowWidth:document.documentElement.clientWidth,windowHeight:document.documentElement.clientHeight,ignoreElements:l=>{try{const u=l&&l.tagName?l.tagName.toLowerCase():"";if(u==="canvas"||u==="video"||u==="iframe"||l&&(l.id==="mouse-cursor"||l.id==="crt-overlay"||l.id==="canvas-container"))return!0}catch{}return!1},onclone:l=>{try{const u=l.getElementById("canvas-container");u&&(u.style.display="none");const f=l.getElementById("crt-overlay");f&&(f.style.display="none");const p=l.getElementById("mouse-cursor");p&&(p.style.display="none"),l.documentElement.style.background="transparent",l.body.style.background="transparent",l.querySelectorAll("canvas, video, iframe").forEach(g=>{try{g.style.display="none"}catch{}})}catch{}}});if(c&&M.canvas){const l=M.canvas.getContext("2d");l&&(l.clearRect(0,0,M.canvas.width,M.canvas.height),l.drawImage(c,0,0,M.canvas.width,M.canvas.height),l.fillStyle="rgba(0, 255, 0, 1)",l.font="20px monospace",l.fillText(`T: ${Date.now()%1e5}`,10,30))}if(console.log("VR UI capture:",{resultCanvas:c?`${c.width}x${c.height}`:"null",ourCanvas:M.canvas?`${M.canvas.width}x${M.canvas.height}`:"null",rect:`${n.width}x${n.height}`}),M.texture.image=M.canvas,M.texture.needsUpdate=!0,(o=ne==null?void 0:ne.xr)!=null&&o.isPresenting&&ne.properties)try{const l=ne.properties.get(M.texture);if(l&&l.__webglTexture){const u=ne.getContext();u.bindTexture(u.TEXTURE_2D,l.__webglTexture),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,M.canvas),u.bindTexture(u.TEXTURE_2D,null)}}catch(l){console.warn("Direct texture upload failed:",l)}M.sourceRect=n,M.canvasWidth=M.canvas.width,M.canvasHeight=M.canvas.height,Yg(M.canvasWidth/M.canvasHeight)}catch(c){console.warn("VR UI capture failed:",c),Jg("CAPTURE FAILED")}finally{M.captureInFlight=!1;const c=M.dirtyCounter||0;M.needsCapture=c!==r,s&&M.needsCapture&&(M.forceCapture=!0),M.lastCaptureMs=performance.now()}}function Zg(n){var r;if(!(M!=null&&M.visible)||!((r=ne==null?void 0:ne.xr)!=null&&r.isPresenting)||!at||!Te)return;n-(M.lastCaptureMs||0)>=200&&(M.needsCapture=!0);const t=ne.xr.getCamera(Te);Vi.setFromMatrixPosition(t.matrixWorld),Tr.extractRotation(t.matrixWorld),Ud.set(0,0,-1).applyMatrix4(Tr),M.anchor.position.copy(Vi).add(Ud.multiplyScalar(1.15)),M.anchor.quaternion.setFromRotationMatrix(Tr),M.anchor.position.y-=.12;let A=!1;(M.controllers||[]).forEach(({controller:s,line:a})=>{if(!s||!a)return;const o=s.userData.vrUi;if(!o)return;Tr.identity().extractRotation(s.matrixWorld),pa.ray.origin.setFromMatrixPosition(s.matrixWorld),pa.ray.direction.set(0,0,-1).applyMatrix4(Tr).normalize(),pa.far=10;const c=M.mesh?pa.intersectObject(M.mesh,!1):[];if(c.length>0){const l=c[0];A=!0,a.scale.z=Math.max(.15,l.distance);const u=l.uv;if(u&&M.canvasWidth&&M.canvasHeight){const f=M.uiLayer.getBoundingClientRect(),p=u.x*M.canvasWidth,g=(1-u.y)*M.canvasHeight,m=f.left+p/M.canvasWidth*f.width,d=f.top+g/M.canvasHeight*f.height;o.clientX=m,o.clientY=d;let h=document.elementFromPoint(m,d);(!h||!M.uiLayer.contains(h))&&(h=null),o.hoverEl=h,o.pressed&&o.draggingRange&&(Gu(o.draggingRange,m,!1),M.needsCapture=!0)}M.reticle&&(Vi.copy(l.point),M.mesh.worldToLocal(Vi),M.reticle.position.set(Vi.x,Vi.y,.001))}else a.scale.z=2,o.hoverEl=null}),M.reticle&&(M.reticle.visible=A);const i=n-(M.lastCaptureMs||0)>=(M.captureIntervalMs||250);!M.captureInFlight&&(M.forceCapture||M.needsCapture&&i)&&ku()}function Dd(n){var i;if(!(M!=null&&M.visible))return;const e=n.target,t=(i=e==null?void 0:e.userData)==null?void 0:i.vrUi;if(!t)return;t.pressed=!0,t.activeEl=t.hoverEl;const A=ST(t.activeEl);A&&(A.kind==="range"?(t.draggingRange=A.el,Gu(A.el,t.clientX,!1),M&&(M.needsCapture=!0,M.dirtyCounter=(M.dirtyCounter||0)+1)):t.clickTarget=A.el)}function Pd(n){var A;const e=n.target,t=(A=e==null?void 0:e.userData)==null?void 0:A.vrUi;if(t){if(t.draggingRange)Gu(t.draggingRange,t.clientX,!0),t.draggingRange=null,M&&(M.needsCapture=!0,M.forceCapture=!0,M.dirtyCounter=(M.dirtyCounter||0)+1);else if(t.clickTarget){try{t.clickTarget.click()}catch{}t.clickTarget=null,M&&(M.needsCapture=!0,M.forceCapture=!0,M.dirtyCounter=(M.dirtyCounter||0)+1)}t.pressed=!1,t.activeEl=null}}function qg(){UA=new Q_(ne);const n=new L_(at,Te);UA.addPass(n);const e={uniforms:{tDiffuse:{value:null},uBHCount:Pn.uBHCount,uBHPos:Pn.uBHPos,uBHMass:Pn.uBHMass},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform sampler2D tDiffuse;
            uniform int uBHCount;
            uniform vec2 uBHPos[${Zr}];
            uniform float uBHMass[${Zr}];
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float halo = 0.0;
                for(int i = 0; i < ${Zr}; i++) {
                    if (i >= uBHCount) break;
                    vec2 dir = uv - uBHPos[i];
                    float dist = length(dir);
                    float influence = smoothstep(0.35, 0.0, dist);
                    float strength = uBHMass[i] * 0.0035;
                    float distortion = (strength * influence * influence) / (dist + 0.015);
                    distortion = min(distortion, 0.12);
                    if (dist > 0.0) totalOffset -= (dir / dist) * distortion;

                    // Simple "photon ring" glow
                    float ringCenter = 0.04 + uBHMass[i] * 0.004;
                    float ringWidth = 0.008 + uBHMass[i] * 0.0015;
                    float ring = exp(-pow((dist - ringCenter) / ringWidth, 2.0));
                    halo += ring * influence;
                }
                vec2 warped = uv + totalOffset;
                vec3 col;
                col.r = texture2D(tDiffuse, warped + totalOffset * 0.15).r;
                col.g = texture2D(tDiffuse, warped).g;
                col.b = texture2D(tDiffuse, warped - totalOffset * 0.15).b;
                col += halo * vec3(1.0, 0.65, 0.25) * 0.35;
                gl_FragColor = vec4(col, 1.0);
            }
        `};Sd=new yc(e),UA.addPass(Sd);const t={uniforms:{tDiffuse:{value:null},curvature:{value:new Ue(3,3)},uFlash:{value:0}},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform sampler2D tDiffuse;
            uniform float uFlash;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 dc = abs(0.5 - uv) * 2.0;
                uv.x -= 0.5; uv.x *= 1.0 + (dc.y * (0.04)); uv.x += 0.5;
                uv.y -= 0.5; uv.y *= 1.0 + (dc.x * (0.04)); uv.y += 0.5;
                if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0)
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                else {
                    vec4 color = texture2D(tDiffuse, uv);
                    color.rgb += vec3(uFlash); // Add The Flash
                    gl_FragColor = color;
                }
            }
        `};io=new yc(t),UA.addPass(io)}function MT(n="unknown"){var a,o,c,l;const e=document.getElementById("canvas-container");if(!e||!at||!Te)return;const t=Te.position.clone(),A=Te.quaternion.clone(),i=((o=(a=Ce==null?void 0:Ce.target)==null?void 0:a.clone)==null?void 0:o.call(a))||new Q,r=(Ce==null?void 0:Ce.enabled)??!0;EA.clear(),li=!1,Qn=!1,gA=null,Sn=!1;try{(c=Ce==null?void 0:Ce.dispose)==null||c.call(Ce)}catch{}const s=ne==null?void 0:ne.domElement;if(s){try{const u=s.getContext("webgl2")||s.getContext("webgl"),f=u&&u.getExtension("WEBGL_lose_context");f&&f.loseContext()}catch{}try{e.removeChild(s)}catch{}}try{(l=ne==null?void 0:ne.dispose)==null||l.call(ne)}catch{}try{ne=new vp({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),ne.xr.enabled=!0}catch(u){console.error("Graphics rebuild failed:",n,u);return}e.appendChild(ne.domElement),Xg(),jg(),So(),Ce=new yp(Te,ne.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,Ce.enabled=r,Ce.target.copy(i),Te.position.copy(t),Te.quaternion.copy(A),rr(R.viewLevel),Ce.update(),qg(),Mo();try{ne.compile(at,Te)}catch{}ne.setAnimationLoop(om),em()}function jg(){ne.xr.addEventListener("sessionstart",()=>{try{ne.resetState()}catch{}Te&&Ce?(dA={pos:Te.position.clone(),quat:Te.quaternion.clone(),target:Ce.target.clone(),fov:Te.fov,near:Te.near,far:Te.far,zoom:Te.zoom,controlsEnabled:Ce.enabled,controlsAutoRotate:Ce.autoRotate},Ce.enabled=!1,Ce.autoRotate=!1):dA=null;try{!(M!=null&&M.anchor)||!(M!=null&&M.mesh)?Vu():So(),oo(!0),ku(),Zg(performance.now())}catch(n){console.warn("VR UI init failed:",n)}Ou.getDelta()}),ne.xr.addEventListener("sessionend",()=>{var e;try{oo(!1)}catch{}const n=ne;try{ne.setRenderTarget(null),ne.resetState()}catch{}try{(e=UA==null?void 0:UA.reset)==null||e.call(UA)}catch{}dA&&Te&&Ce&&(Te.position.copy(dA.pos),Te.quaternion.copy(dA.quat),Te.fov=dA.fov,Te.near=dA.near,Te.far=dA.far,Te.zoom=dA.zoom,Te.updateProjectionMatrix(),Te.updateMatrixWorld(!0),Ce.target.copy(dA.target),Ce.enabled=dA.controlsEnabled,Ce.autoRotate=dA.controlsAutoRotate,Ce.update()),dA=null,Ia=3;try{ne.clear(!0,!0,!0),ne.render(at,Te)}catch{}setTimeout(()=>{ne===n&&MT("xr sessionend")},50)})}function $g(){EA.clear(),li=!1,Qn=!1,gA=null,Sn=!1,R.pixelationFactor=Math.max(1,Math.floor(window.innerWidth/750)),au&&(au.value=R.pixelationFactor),ou&&(ou.innerText=R.pixelationFactor);const n=document.getElementById("canvas-container");for(;n.firstChild;){if(n.firstChild.tagName==="CANVAS")try{const e=n.firstChild.getContext("webgl2")||n.firstChild.getContext("webgl");e&&e.getExtension("WEBGL_lose_context")&&e.getExtension("WEBGL_lose_context").loseContext()}catch{}n.removeChild(n.firstChild)}ne&&(ne.dispose(),ne=null);try{ne=new vp({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),ne.xr.enabled=!0}catch(e){console.error("Critical: WebGL Renderer could not be initialized.",e);return}n.appendChild(ne.domElement),Xg(),jg(),at=new v_,at.background=new We(0),at.fog=new _u(0,1e-9),Te=new mA(55,window.innerWidth/window.innerHeight,1,1e12),Ce=new yp(Te,ne.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,qg(),Mo(),An=new Ep,Ta=new Ue,rt=new ni,rt.visible=!1,at.add(rt),ut=new ni,at.add(ut),Vu(),pT.value=R.timeScale,cu(St.seed),R.universeSimTime=0,R.bigBangFlash=1,rr(0),so.style.display="none",ao.style.display="none";try{ne.compile(at,Te)}catch{}ne.setAnimationLoop(om),window.removeEventListener("resize",Hd),window.addEventListener("resize",Hd),em()}function em(){ha&&document.removeEventListener("mousemove",ha),ha=i=>{ki&&(ki.style.transform=`translate(${i.clientX}px, ${i.clientY}px)`),!Sn&&Dl.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Sn=!0)},document.addEventListener("mousemove",ha),da&&document.body.removeEventListener("mouseover",da),da=i=>{i.target.matches("button, input, .panel-close, label, a, .clickable")?(ki.classList.add("active"),ki.innerHTML="&#8629;"):(ki.classList.remove("active"),ki.innerHTML="")},document.body.addEventListener("mouseover",da),ne.domElement.addEventListener("pointerdown",i=>{EA.add(i.pointerId),li=li||EA.size>1,Qn=!0,gA=i.pointerId,Sn=EA.size>1,Dl.set(i.clientX,i.clientY),R.inspectingTarget||(R.trackingTarget=null)}),ne.domElement.addEventListener("pointermove",i=>{Qn&&(gA!==null&&i.pointerId!==gA||!Sn&&Dl.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Sn=!0))}),ne.domElement.addEventListener("pointercancel",i=>{EA.delete(i.pointerId),gA===i.pointerId&&(gA=null),EA.size===0?(Qn=!1,gA=null,li=!1):(Qn=!0,gA===null&&(gA=EA.values().next().value))}),ne.domElement.addEventListener("pointerup",RT);const n=(i,r)=>{const s=document.getElementById(i);if(!s)return;const a=s.cloneNode(!0);return s.parentNode.replaceChild(a,s),a.addEventListener("click",r),a};n("reset-btn",()=>void cu(Math.floor(Math.random()*1e4))),n("bang-btn",()=>{$g()}),ru=n("pause-btn",()=>{R.isPaused=!R.isPaused,ru.textContent=R.isPaused?"RESUME SIM":"PAUSE SIM",R.isPaused||Ou.getDelta()}),rn=n("back-btn",()=>{if(R.inspectingTarget){R.inspectingTarget=null,R.inspectingTargetPreviousPos=null,Ce.target.set(0,0,0),rn.textContent="BACK TO GALAXY";return}tm()}),n("alert-dismiss",()=>{Uo.style.display="none",R.isTransitioning&&Am()});const e=[so,ao,su,yA],t=i=>{window.innerWidth<=768&&e.forEach(r=>{r!==i&&(r.style.display="none")})},A=(i,r)=>{const s=document.getElementById(i),a=document.getElementById(r);if(!s||!a)return;const o=s.cloneNode(!0);return s.parentNode.replaceChild(o,s),o.addEventListener("click",()=>{const c=a.style.display!=="flex";c&&t(a),a.style.display=c?"flex":"none"}),o};ro=A("status-toggle-btn","stats-panel")||ro,A("sim-toggle-btn","controls-panel"),A("config-btn","config-modal"),BT.onclick=()=>so.style.display="none",wT.onclick=()=>ao.style.display="none",gT.onclick=()=>su.style.display="none",vT.onclick=()=>{yA.style.display="none",R.selectedTarget=null,R.isAutopilot&&(R.autopilotPanelHidden=!0)},n("loc-btn",()=>{if(R.autopilotPanelHidden=!1,yA.style.display==="flex"){yA.style.display="none";return}t(yA);let i=null;if(R.viewLevel===0)i={designation:`UNIVERSE 0x${St.seed.toString(16).toUpperCase()}`,type:"COSMIC WEB",age:R.universeSimTime.toFixed(2),mass:`${St.starCount.toLocaleString()} OBJECTS`,radius:`${(bt.UNIVERSE/1e6).toFixed(1)} MLY`,lum:"N/A",composition:`SEED: 0x${St.seed.toString(16).toUpperCase()}
OBJECTS: ${St.starCount.toLocaleString()}`};else if(R.viewLevel===1)i=R.activeGalaxyData;else if(R.viewLevel===2)if(R.inspectingTarget&&R.inspectingTarget.userData&&R.inspectingTarget.userData.type){const r=R.inspectingTarget;i={designation:r.userData.designation||"UNKNOWN",type:r.userData.type||"UNKNOWN",age:R.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:r.userData.composition||"ANALYZING..."}}else i=R.activeSystemData;i&&SA(i,!0)}),yT.onclick=()=>{R.selectedTarget&&(yA.style.display="none",R.selectedTarget.level===0?ci(R.selectedTarget.position,1):R.selectedTarget.level===1?ci(R.selectedTarget.position,2):R.selectedTarget.level===2&&(R.inspectingTarget=R.selectedTarget.object,R.trackingTarget=null,R.inspectingTargetPreviousPos=R.inspectingTarget.position.clone(),Ce.target.copy(R.inspectingTarget.position),rn.textContent="LEAVE ORBIT"))},document.querySelectorAll(".q-btn").forEach(i=>{const r=i.cloneNode(!0);i.parentNode.replaceChild(r,i),r.addEventListener("click",s=>{document.querySelectorAll(".q-btn").forEach(o=>o.classList.remove("active")),s.target.classList.add("active");const a=iu[s.target.getAttribute("data-q")];a&&(St.starCount=a.starCount,St.clusterCount=a.clusterCount,R.viewLevel===0?cu(St.seed):R.viewLevel===1&&am(R.currentGalaxyType))})}),au.oninput=i=>{R.pixelationFactor=parseInt(i.target.value),ou.innerText=R.pixelationFactor,Mo()},mT.onchange=i=>i.target.checked?bd.classList.add("crt-effects"):bd.classList.remove("crt-effects"),lu.onchange=i=>{R.isAutopilot=i.target.checked,R.isAutopilot&&(R.autopilotNextAction=0,R.inspectingTarget=null,R.autopilotPanelHidden=!1),R.isAutopilot&&R.viewLevel===1&&R.autopilotPriorityTargets.length===0&&zg()},document.getElementById("timestep-slider").oninput=i=>R.timeScale=parseFloat(i.target.value)}function Mo(){if(!ne||!UA)return;Te&&(Te.aspect=window.innerWidth/window.innerHeight,Te.updateProjectionMatrix());const n=R.pixelationFactor===0?1:R.pixelationFactor*.8+1,e=Math.floor(window.innerWidth/n),t=Math.floor(window.innerHeight/n);ne.setSize(e,t,!1),UA.setSize(e,t),ne.domElement.style.width="100vw",ne.domElement.style.height="100vh",_t&&(_t.material.uniforms.uPixelRatio.value=ne.getPixelRatio(),_t.material.uniforms.uScreenHeight.value=t),nt&&(nt.material.uniforms.uPixelRatio.value=ne.getPixelRatio(),nt.material.uniforms.uScreenHeight.value=t)}function Hd(){Mo()}function rr(n){n===0?(Ce.maxDistance=bt.UNIVERSE*2,Ce.minDistance=1e3,Ce.zoomSpeed=1,rn.disabled=!0,rn.textContent="RETURN TO ORBIT"):n===1?(Ce.maxDistance=bt.GALAXY*3,Ce.minDistance=100,Ce.zoomSpeed=2,rn.disabled=!1,rn.textContent="BACK TO UNIVERSE"):n===2&&(Ce.maxDistance=bt.SYSTEM*4,Ce.minDistance=10,Ce.zoomSpeed=3,rn.disabled=!1,rn.textContent="BACK TO GALAXY"),Te.updateProjectionMatrix()}function bT(){R.galaxySimTime=0,R.isPaused=!1,R.isTransitioning=!1,R.viewLevel=0,R.worldOffset.set(0,0,0),R.selectedTarget=null,R.activeGalaxyData=null,R.activeSystemData=null,R.autopilotPriorityTargets=[],R.lastGalaxyVisitTime=0,R.visitedSystemsCount=0,R.planetTourIndex=0,R.trackingTarget=null,R.inspectingTarget=null,R.inspectingTargetPreviousPos=null,R.bigBangFlash=0,kA=[],nr=[],As=[],Pn.uBHCount.value=0,Wg.style.display="block",_t&&_t.position.set(0,0,0),nt&&(nt.visible=!1),rt&&(rt.visible=!1),ut&&ut.clear(),Ht&&(at.remove(Ht),Ht=null),Te.position.set(0,bt.UNIVERSE*.1,bt.UNIVERSE*.2),Ce.target.set(0,0,0),rr(0),Ce.autoRotate=!0,Ce.enabled=!0,ru.textContent="PAUSE SIM",Uo.style.display="none",yA.style.display="none"}function tm(){R.isTransitioning||(yA.style.display="none",R.viewLevel===2?ci(new Q(0,bt.GALAXY*.5,0),1,!0):R.viewLevel===1&&ci(new Q(0,bt.UNIVERSE*.1,0),0,!0))}function ci(n,e,t=!1){if(!R.isTransitioning)if(R.isTransitioning=!0,R.transitionTarget.copy(n),R.transitionData=!t&&R.selectedTarget?R.selectedTarget.data:null,R.nextLevel=e,R.transitionProgress=0,Ce.enabled=!1,Uo.style.display="block",(!R.isAutopilot||t)&&(yA.style.display="none"),t)Gl.innerText="LEAVING GRAVITY WELL",ir.innerText="ACCELERATING TO ESCAPE VELOCITY...";else{const A=Math.floor(Math.abs(n.x+n.y)).toString(16).toUpperCase();e===1?(Gl.innerText="APPROACHING GALAXY",ir.innerText=`SECTOR ${A} :: HYPERDRIVE ENGAGED`):(Gl.innerText="APPROACHING SYSTEM",ir.innerText=`STAR ${A} :: ORBITAL INSERTION`)}}function Am(){const n=R.nextLevel,e=R.viewLevel;R.viewLevel=n,R.isTransitioning=!1,Ce.enabled=!0,Uo.style.display="none";const t=new Q().copy(R.transitionTarget);if(As=[],Pn.uBHCount.value=0,n>e?R.transitionData?(n===1&&(R.activeGalaxyData=R.transitionData),n===2&&(R.activeSystemData=R.transitionData)):R.selectedTarget&&R.selectedTarget.data&&(n===1&&(R.activeGalaxyData=R.selectedTarget.data),n===2&&(R.activeSystemData=R.selectedTarget.data)):(n===1&&(R.activeSystemData=null),n===0&&(R.activeGalaxyData=null)),Wg.style.display="block",n>e&&(Te.position.sub(t),Ce.target.sub(t),_t&&_t.position.sub(t),n===2&&nt&&nt.position.sub(t),n===2&&ut&&ut.position.sub(t),n===2&&Ht&&Ht.position.sub(t)),n===2&&(R.planetTourIndex=0),n===0)nt&&(nt.visible=!1),rt&&(rt.visible=!1),ut&&(ut.visible=!1),Ht&&(Ht.visible=!1),rr(0),ir.innerText="INTERGALACTIC SPACE";else if(n===1){if(rt&&(rt.visible=!1),!nt||e===0){const A=R.universeSimTime;R.currentGalaxyType=A<3?2:A>10?1:0,am(R.currentGalaxyType)}if(nt&&(nt.visible=!0,n>e&&nt.position.set(0,0,0)),ut&&(ut.visible=!0,n>e&&ut.position.set(0,0,0)),ut.children.length>0&&As.push(ut.children[0]),Ht&&(Ht.visible=!0,n>e&&Ht.position.set(0,0,0)),e===0&&zg(),n>e){if(R.isAutopilot){const A=bt.GALAXY*1.5,i=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.5+.1;Te.position.set(A*Math.sin(r)*Math.cos(i),A*Math.cos(r),A*Math.sin(r)*Math.sin(i)),R.autopilotZooming=!0}else Te.position.set(0,bt.GALAXY*.8,bt.GALAXY*.4);Ce.target.set(0,0,0)}rr(1),ir.innerText="ARRIVED AT LOCAL GALAXY"}else if(n===2){if(ut&&(ut.visible=!1),Ht&&(Ht.visible=!1),IT(t),rt&&(rt.visible=!0,rt.position.set(0,0,0)),R.isAutopilot){const A=bt.SYSTEM*1.5,i=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.5+.1;Te.position.set(A*Math.sin(r)*Math.cos(i),A*Math.cos(r),A*Math.sin(r)*Math.sin(i)),R.autopilotZooming=!0,R.planetTourIndex=0}else Te.position.set(0,bt.SYSTEM*.4,bt.SYSTEM*.8);Ce.target.set(0,0,0),rr(2),ir.innerText="SYSTEM ORBIT STABLE"}R.isAutopilot&&n>0&&!R.autopilotPanelHidden&&(yA.style.display="flex",n===1&&R.activeGalaxyData&&SA(R.activeGalaxyData,!0),n===2&&R.activeSystemData&&SA(R.activeSystemData,!0)),n>e&&R.worldOffset.add(t)}function FT(n,e,t){const A=t-e;if(A<.05)return{state:"PROTO",age:A,classObj:n};if(A<n.lifespan)return{state:"MAIN",age:A,classObj:n};if(A<n.lifespan*1.1)return{state:"GIANT",age:A,classObj:n};let i;if(n.id==="O"||n.id==="B")i=Math.random()>.5?"BH":"N";else if(n.id==="A"||n.id==="F"||n.id==="G")i="WD";else return{state:"MAIN",age:A,classObj:n};return{state:"REMNANT",age:A,classObj:Wi.find(r=>r.id===i)}}function nm(n,e){let t=n;const A=()=>{const o=Math.sin(t++)*1e4;return o-Math.floor(o)};let i,r,s;e?(i=70+A()*10,r=24+A()*4,s=100-(i+r)):(i=74+A()*5,r=23+A()*2,s=100-(i+r)),s<0&&(s=0);const a=["O","C","Ne","Fe","N","Si","Mg","S"][Math.floor(A()*8)];return`COMPOSITION:
H: ${i.toFixed(2)}% | He: ${r.toFixed(2)}% | Met: ${s.toFixed(2)}%
Trace: ${a}`}function im(n){let e=n;const t=()=>{const o=Math.sin(e++)*1e4;return o-Math.floor(o)};let A=Wi[Wi.length-2],i=0;const r=t();for(let o=0;o<Wi.length-3;o++)if(i+=Wi[o].prob,r<i){A=Wi[o];break}const s=FT(A,t()*R.universeSimTime,R.universeSimTime),a=[];for(let o=0;o<10;o++)a.push({pos:t()*100,intensity:t()});return{designation:`HIP-${Math.floor(t()*1e5)}`,typeObj:s.classObj,state:s.state,age:s.age.toFixed(3),mass:s.classObj.mass,radius:s.classObj.rad,lum:s.classObj.lum,spectrum:a,composition:nm(n,!0)}}function rm(n,e){let t=n;const A=()=>{const r=Math.sin(t++)*1e4;return r-Math.floor(r)};let i="SPIRAL GALAXY";return e<3?A()>.3?i="IRREGULAR GALAXY":A()>.5?i="QUASAR (AGN)":i="PROTO-GALAXY":e>10&&(A()>.4?i="ELLIPTICAL GALAXY":i="LENTICULAR GALAXY"),{designation:`NGC-${Math.floor(A()*5e3)}`,type:i,age:e.toFixed(2),mass:(A()*50+10).toFixed(1)+" Billion",radius:(A()*50+20).toFixed(1)+" kly",lum:"HIGH",spectrum:[],composition:nm(n,!1)}}function SA(n,e=!1){if(window.innerWidth<=768&&[so,ao,su].forEach(s=>s.style.display="none"),CT.innerText=e?"CURRENT LOCATION":"TARGET ANALYSIS",_T.innerText=n.designation,xT.innerText=n.age+" Bn YR",n.typeObj){let s=`CLASS ${n.typeObj.id}`;n.state==="PROTO"?s+=" (PROTO-STAR)":n.state==="GIANT"?s+=" (RED GIANT)":n.state==="REMNANT"&&(s+=" (REMNANT)"),Ba.innerText=s,Ba.style.color=n.typeObj.id==="BH"?"#0f0":"#"+n.typeObj.color.toString(16).padStart(6,"0"),Fd.innerText=n.mass+" M☉",Td.innerText=n.radius+" R☉",Id.innerText=n.lum+" L☉"}else Ba.innerText=n.type,Ba.style.color="#0f0",Fd.innerText=n.mass+" M☉",Td.innerText=n.radius,Id.innerText="VAR";Qd.innerHTML="";let t=0;for(let s=0;s<n.designation.length;s++)t+=n.designation.charCodeAt(s);const A=()=>{const s=Math.sin(t++)*1e4;return s-Math.floor(s)},i=["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0088ff","#ff00ff"],r=5+Math.floor(A()*8);for(let s=0;s<r;s++){const a=document.createElement("div");a.className="spec-line";const o=Math.floor(A()*95/5)*5;a.style.left=o+"%",a.style.backgroundColor=i[Math.floor(o/100*i.length)],Qd.appendChild(a)}ET.innerText=n.composition||"ANALYZING...",e?document.getElementById("warp-btn").style.display="none":(document.getElementById("warp-btn").style.display="block",document.getElementById("warp-btn").innerText=R.viewLevel===2?"INSPECT ORBIT":"INITIATE HYPERDRIVE"),R.isAutopilot&&R.autopilotPanelHidden?yA.style.display="none":yA.style.display="flex"}function sm(n,e,t,A){const i=new Mn(n,64,64),r=new er({color:0}),s=new Ft(i,r);s.position.set(e,t,A),s.userData.isBlackHole=!0;const a=new fo(n*1.5,n*8,128),o=new zt({uniforms:{uTime:{value:0},uEHRadius:{value:n},uInnerRadius:{value:n*1.5},uOuterRadius:{value:n*8}},side:BA,transparent:!0,blending:cn,depthWrite:!1,vertexShader:`
            varying vec3 vWorldPos;
            varying vec3 vBhPos;
            void main() {
                vec4 world = modelMatrix * vec4(position, 1.0);
                vWorldPos = world.xyz;
                vBhPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
                gl_Position = projectionMatrix * viewMatrix * world;
            }
        `,fragmentShader:`
            uniform float uTime;
            uniform float uEHRadius;
            uniform float uInnerRadius;
            uniform float uOuterRadius;
            varying vec3 vWorldPos;
            varying vec3 vBhPos;
            ${ri}
            void main() {
                vec3 rel = vWorldPos - vBhPos;
                float r = length(rel.xz);
                float rNorm = max(r / uEHRadius, 1.001);
                float diskT = smoothstep(uInnerRadius, uOuterRadius, r);

                float angle = atan(rel.z, rel.x);
                float flow = uTime * (2.2 / sqrt(rNorm));

                float density = 0.6;
                density += 0.25 * snoise(vec3(rel.xz * (0.08 / uEHRadius), uTime * 0.35));
                density += 0.15 * snoise(vec3(rel.xz * (0.22 / uEHRadius), uTime * 1.1));
                density = clamp(density, 0.0, 1.2);

                float spiral = 0.5 + 0.5 * sin(angle * 3.0 + rNorm * 0.9 - flow * 2.0);
                float intensity = (0.25 + 0.75 * spiral) * density;

                vec3 viewDir = normalize(vWorldPos - cameraPosition);
                vec3 radial = normalize(vec3(rel.x, 0.0, rel.z));
                vec3 tangential = normalize(vec3(-radial.z, 0.0, radial.x));

                // Relativistic-ish Doppler shift (from referenced article): √[(1-v)/(1+v)]
                float speed = clamp(0.65 / sqrt(rNorm), 0.0, 0.92);
                float velocity_dot = dot(viewDir, tangential) * speed;
                float dopplerShift = sqrt(max((1.0 - velocity_dot) / (1.0 + velocity_dot), 0.0));

                // Gravitational redshift (Schwarzschild-ish): √[(1-Rs/r_emit)/(1-Rs/r_obs)]
                float rCam = max(length(cameraPosition - vBhPos) / uEHRadius, 1.001);
                float Rs = 1.0;
                float redshift = sqrt(max((1.0 - Rs / rNorm) / (1.0 - Rs / rCam), 0.0));

                vec3 hot = vec3(1.0, 0.95, 0.85);
                vec3 warm = vec3(1.0, 0.60, 0.25);
                vec3 diskColor = mix(hot, warm, diskT);
                diskColor *= dopplerShift * redshift;

                float ring = smoothstep(uInnerRadius, uInnerRadius + uEHRadius * 0.5, r)
                    * (1.0 - smoothstep(uOuterRadius - uEHRadius, uOuterRadius, r));

                float alpha = ring * intensity * 0.85;
                if (alpha < 0.02) discard;

                gl_FragColor = vec4(diskColor, alpha);
            }
        `}),c=new Ft(a,o);return c.rotation.x=Math.PI/2,s.add(c),s}function TT({positions:n,colors:e,sizes:t}){const A=new Nt;A.setAttribute("position",new Ut(n,3)),A.setAttribute("color",new Ut(e,3)),A.setAttribute("size",new Ut(t,1));const i=new zt({uniforms:{uTime:{value:0},uPixelRatio:{value:ne.getPixelRatio()},uScreenHeight:{value:window.innerHeight}},vertexShader:`
            uniform float uTime; uniform float uPixelRatio; uniform float uScreenHeight;
            attribute float size; varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_vertex>
            void main() {
                // Inflation Physics: Universe expands from singularity (0,0,0)
                // Curve: Rapid expansion that tapers off (Inflation theory style)
                float expansion = 1.0 - exp(-uTime * 2.0);
                
                vec3 finalPos = position * expansion;
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z);
                #include <logdepthbuf_vertex>
            }
        `,fragmentShader:`
            uniform float uTime;
            varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_fragment>
            void main() {
                #include <logdepthbuf_fragment>
                vec2 center = gl_PointCoord - vec2(0.5);
                if (length(center) > 0.5) discard;
                
                // Thermodynamics: Early universe stars are hotter (white/blue) and cool to their colors
                float heat = exp(-uTime * 0.5); 
                vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), heat);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,depthWrite:!1,blending:cn,vertexColors:!0});_t=new xc(A,i),_t.frustumCulled=!1,at.add(_t)}async function cu(n){const e=++Ld;for(_t&&(at.remove(_t),_t.geometry.dispose(),_t.material.dispose(),_t=null),nt&&(at.remove(nt),nt.geometry.dispose(),nt.material&&nt.material.dispose(),nt=null);rt.children.length>0;){const i=rt.children[0];i.geometry&&i.geometry.dispose(),i.material&&i.material.dispose(),rt.remove(i)}ne&&ne.renderLists.dispose(),bT(),St.seed=n,dT.textContent="0x"+St.seed.toString(16).toUpperCase(),hT.textContent=St.starCount.toLocaleString();const t={seed:n,starCount:St.starCount,clusterCount:St.clusterCount,scale:bt.UNIVERSE,filamentScatter:St.filamentScatter};let A=await Kg("generateUniverseData",t);e===Ld&&(A||(A=oT(t)),TT(A))}async function am(n=0){const e=++Rd;nt&&(at.remove(nt),nt.geometry.dispose()),Ht&&(at.remove(Ht),Ht=null),ut.clear();const t=St.starCount,A=bt.GALAXY,i={starCount:t,radius:A,type:n};let r=await Kg("generateGalaxyData",i);if(e!==Rd)return;r||(r=lT(i));const s=new Nt;s.setAttribute("position",new Ut(r.positions,3)),s.setAttribute("color",new Ut(r.colors,3)),s.setAttribute("size",new Ut(r.sizes,1)),s.setAttribute("aOrbit",new Ut(r.orbitParams,3));const a=new zt({uniforms:{uPixelRatio:{value:ne.getPixelRatio()},uTime:{value:0},uScreenHeight:{value:window.innerHeight}},vertexShader:`
            uniform float uPixelRatio; uniform float uTime; uniform float uScreenHeight;
            attribute float size; attribute vec3 aOrbit; varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_vertex>
            void main() {
                vColor = color;
                float radius = aOrbit.x; float speed = aOrbit.y; float initAngle = aOrbit.z;
                vec3 newPos = position;
                if (radius > 0.0) {
                     float finalAngle = initAngle + uTime * speed * 0.005;
                     newPos.x = cos(finalAngle) * radius; newPos.z = sin(finalAngle) * radius;
                }
                vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z);
                #include <logdepthbuf_vertex>
            }
        `,fragmentShader:`
            varying vec3 vColor;
            #include <common>
            #include <logdepthbuf_pars_fragment>
            void main() {
                #include <logdepthbuf_fragment>
                vec2 center = gl_PointCoord - vec2(0.5);
                float glow = 1.0 - smoothstep(0.0, 0.5, length(center));
                gl_FragColor = vec4(vColor, pow(glow, 2.0)); 
            }
        `,depthWrite:!1,blending:cn,vertexColors:!0,transparent:!0});if(nt=new xc(s,a),nt.frustumCulled=!1,nt.visible=!1,at.add(nt),n!==1){const c=n===2?60:30,l=new Nt,u=new Float32Array(c*3),f=new Float32Array(c*3),p=new Float32Array(c);for(let m=0;m<c;m++){const d=Math.random()*A*.8,h=Math.random()*Math.PI*2;u[m*3]=d*Math.cos(h),u[m*3+1]=(Math.random()-.5)*A*.2,u[m*3+2]=d*Math.sin(h),f[m*3]=.4,f[m*3+1]=.1,f[m*3+2]=.6,p[m]=Math.random()*8e5+4e5}l.setAttribute("position",new Ut(u,3)),l.setAttribute("color",new Ut(f,3)),l.setAttribute("size",new Ut(p,1));const g=new zt({uniforms:{uPixelRatio:{value:ne.getPixelRatio()},uScreenHeight:{value:window.innerHeight},uTime:{value:0}},vertexShader:`
                uniform float uPixelRatio; uniform float uScreenHeight; attribute float size; varying vec3 vColor;
                #include <common>
                #include <logdepthbuf_pars_vertex>
                void main() {
                    vColor = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * uPixelRatio * (uScreenHeight / -mvPosition.z) * 0.05;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                varying vec3 vColor; uniform float uTime; ${ri}
                #include <common>
                #include <logdepthbuf_pars_fragment>
                void main() {
                    #include <logdepthbuf_fragment>
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float n = snoise(vec3(center * 4.0, uTime * 0.2));
                    float alpha = (1.0 - smoothstep(0.0, 0.5, length(center))) * (0.5 + 0.5 * n);
                    if (alpha < 0.05) discard;
                    gl_FragColor = vec4(vColor, alpha * 0.3);
                }
            `,transparent:!0,blending:cn,depthWrite:!1,vertexColors:!0});Ht=new xc(l,g),Ht.visible=!1,at.add(Ht)}const o=sm(A*.005,0,0,0);ut.add(o),ut.visible=!1}function IT(n){for(kA=[],nr=[];rt.children.length>0;){const l=rt.children[0];l.geometry&&l.geometry.dispose(),l.material&&l.material.dispose(),rt.remove(l)}let e=Math.abs(n.x+n.y+n.z);const t=()=>{const l=Math.sin(e++)*1e4;return l-Math.floor(l)},A=bt.SYSTEM,i=bt.G;let r=16755200,s=A*.25,a=!1;if(R.selectedTarget&&R.selectedTarget.data){const l=R.selectedTarget.data;l.typeObj&&(r=l.typeObj.color),l.typeObj.id==="BH"&&(s=A*.1,a=!0)}const o=a?1:t()>.6?t()>.9?3:2:1;for(let l=0;l<o;l++){const u=l===0?1:.5+t()*.5,f=s*u,p=1e3*u;let g;if(a)g=sm(f,0,0,0),As.push(g),g.add(new jf(16755268,1e5,bt.SYSTEM*5)),g.add(new y_(2236979,.5));else{const m=new Mn(f,64,64),d=new Yf({color:r,emissive:r,emissiveIntensity:2});d.onBeforeCompile=w=>{w.uniforms.uTime={value:0},w.vertexShader=`
                    uniform float uTime; varying vec3 vCustomWorldPos; ${ri}
                `+w.vertexShader,w.vertexShader=w.vertexShader.replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
 vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),w.vertexShader=w.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>

                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.5)) + snoise(vec3(position * 0.5 - uTime * 0.2))) * 0.05 * ${f.toFixed(2)};
                    transformed += normal * disp;
                `),w.fragmentShader=`uniform float uTime; varying vec3 vCustomWorldPos; ${ri}`+w.fragmentShader,w.fragmentShader=w.fragmentShader.replace("#include <map_fragment>",`
                    float n = snoise(vec3(vCustomWorldPos * 0.1 + uTime * 0.2));
                    float bright = snoise(vec3(vCustomWorldPos * 0.3 + uTime * 0.5));
                    vec3 base = diffuseColor.rgb;
                    vec3 final = mix(base, base*0.3, smoothstep(0.4, 0.8, n));
                    final = mix(final, base*3.0, smoothstep(0.5, 0.9, bright));
                    diffuseColor.rgb = final;
                `),d.userData.shader=w},g=new Ft(m,d);const h=new Mn(f*1.4,32,32),_=new zt({uniforms:{uColor:{value:new We(r)}},transparent:!0,side:rA,blending:cn,vertexShader:"varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6); }"});g.add(new Ft(h,_)),g.add(new jf(r,3e5,bt.SYSTEM*10,2))}if(rt.add(g),o===1)kA.push({mesh:g,mass:p,velocity:new Q(0,0,0),isStar:!0});else{const m=A*.4;g.position.set((l===0?1:-1)*m,0,0);const d=Math.sqrt(i*p/(2*m));kA.push({mesh:g,mass:p,velocity:new Q(0,0,(l===0?1:-1)*d),isStar:!0})}}const c=Math.floor(t()*5)+3;for(let l=0;l<c;l++){const f=(o>1?A*.8:A*.3)+l*A*.2+t()*A*.1,p=A*.01+t()*A*.02,g=p*10,m=l>2&&t()>.3,d=!m,h=new Mn(p,64,64),_=new Yf({color:new We().setHSL(t(),m?.8:.2,.5),roughness:.7});_.onBeforeCompile=L=>{L.uniforms.uTime={value:0},L.vertexShader=`varying vec3 vPos; ${ri}`+L.vertexShader,L.vertexShader=L.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vPos = position; ${d?`float h = snoise(position*0.2)*0.5 + snoise(position*1.0)*0.2; transformed += normal*h*${p.toFixed(2)}*0.1;`:""}`),L.fragmentShader=`uniform float uTime; varying vec3 vPos; ${ri}`+L.fragmentShader,L.fragmentShader=L.fragmentShader.replace("#include <map_fragment>",`
                float n = snoise(vPos * ${m?"2.0":"5.0"} + vec3(0.0, ${m?"uTime*0.5":"0.0"}, 0.0));
                ${m?`
                    // Increase Gas Giant animation speed
                    float band = sin(vPos.y * 20.0 + n * 2.0 + uTime * 2.0);
                    vec3 c1 = diffuseColor.rgb; vec3 c2 = diffuseColor.rgb * 0.5;
                    diffuseColor.rgb = mix(c1, c2, band * 0.5 + 0.5) + n * 0.05;
                    // Lightning
                    float storm = snoise(vPos * 5.0 + uTime * 3.0);
                    if(storm > 0.8) diffuseColor.rgb += vec3(0.8, 0.9, 1.0) * (storm - 0.8) * 5.0;
                `:`
                    float h = snoise(vPos * 0.2);
                    if (h > 0.3) diffuseColor.rgb *= 1.2; else if (h < -0.2) diffuseColor.rgb *= 0.8;
                    diffuseColor.rgb *= (0.8 + 0.4 * n);
                `}
            `),_.userData.shader=L};const w=new Ft(h,_),U=t()*Math.PI*2;w.position.set(Math.cos(U)*f,0,Math.sin(U)*f);const T=new Mn(p*1.1,32,32),y=new zt({uniforms:{uTime:{value:0},uIntensity:{value:0}},transparent:!0,blending:cn,side:BA,depthWrite:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform float uIntensity; varying vec2 vUv;
            void main() {
                if (uIntensity <= 0.01) discard;
                float pole = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
                float wave = sin(vUv.x * 20.0 + uTime * 5.0) * 0.5 + 0.5;
                gl_FragColor = vec4(0.2, 0.8, 0.4, uIntensity * pole * wave * 0.5);
            }`}),S=new Ft(T,y);w.add(S),w.userData={designation:`PLANET ${String.fromCharCode(65+l)}`,type:m?"GAS GIANT":"ROCKY",aurora:y},rt.add(w),kA.push({mesh:w,mass:g,velocity:new Q(-Math.sin(U)*Math.sqrt(i*1e3/f),0,Math.cos(U)*Math.sqrt(i*1e3/f)),isStar:!1})}}function QT(){if(R.viewLevel!==2||!rt.visible)return;const n=kA.filter(o=>{var c,l;return o.isStar&&!((l=(c=o.mesh)==null?void 0:c.userData)!=null&&l.isBlackHole)});if(n.length===0)return;const e=n[Math.floor(Math.random()*n.length)].mesh,t=new Mn(5,32,32),A=new zt({uniforms:{uTime:{value:0},uColor:{value:new We(16729088)}},transparent:!0,blending:cn,depthWrite:!1,vertexShader:"varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform vec3 uColor; varying vec3 vPos; ${ri}
        void main() {
            float n = snoise(vec3(vPos * 0.5 + uTime * 2.0));
            float alpha = smoothstep(0.0, 0.5, n);
            gl_FragColor = vec4(uColor, alpha * 0.8);
        }`}),i=new Ft(t,A);i.position.copy(e.position);const r=Math.random()*Math.PI*2,s=Math.random()*Math.PI,a=new Q(Math.sin(s)*Math.cos(r),Math.cos(s),Math.sin(s)*Math.sin(r));i.userData={dir:a,age:0,life:10,speed:20,mat:A},rt.add(i),nr.push(i)}function LT(n){const t=n/2;for(let A=0;A<2;A++)for(let i=0;i<kA.length;i++){const r=kA[i];if(r.mesh.position.add(r.velocity.clone().multiplyScalar(t)),!r.isStar){const s=r.mesh.position.lengthSq(),a=r.mesh.position.clone().normalize().multiplyScalar(-50*1e3/s);r.velocity.add(a.multiplyScalar(t))}}}function om(){var s,a,o,c;const n=performance.now(),e=Ou.getDelta(),t=Math.min(e,.1)*R.timeScale;if(R.bigBangFlash>0&&(R.bigBangFlash-=e*.5,R.bigBangFlash<0&&(R.bigBangFlash=0),io&&(io.uniforms.uFlash.value=R.bigBangFlash)),!R.isPaused){if(R.viewLevel===0)R.universeSimTime+=t,_t&&(_t.material.uniforms.uTime.value=R.universeSimTime);else if(R.viewLevel===1)R.galaxySimTime+=t;else if(R.viewLevel===2){LT(t*5),Math.random()<.005&&QT();for(let l=nr.length-1;l>=0;l--){const u=nr[l];u.userData.age+=t,u.position.add(u.userData.dir.clone().multiplyScalar(u.userData.speed*t)),u.scale.setScalar(1+u.userData.age*2),u.userData.mat&&(u.userData.mat.uniforms.uTime.value+=e),kA.forEach(f=>{!f.isStar&&f.mesh.userData.aurora&&(u.position.distanceTo(f.mesh.position)<30?f.mesh.userData.aurora.uniforms.uIntensity.value=1:f.mesh.userData.aurora.uniforms.uIntensity.value*=.98)}),u.userData.age>u.userData.life&&(rt.remove(u),nr.splice(l,1))}kA.forEach(l=>{l.isStar||(l.mesh.rotation.y+=e*.1),l.mesh.userData.aurora&&(l.mesh.userData.aurora.uniforms.uTime.value+=e),l.mesh.material&&l.mesh.material.userData&&l.mesh.material.userData.shader&&(l.mesh.material.userData.shader.uniforms.uTime.value+=e)})}}R.inspectingTarget&&Ce&&Ce.target.copy(R.inspectingTarget.position);let A=0;if(As.forEach(l=>{var f;(f=l.children)==null||f.forEach(p=>{p&&p.material&&p.material.uniforms&&p.material.uniforms.uTime&&(p.material.uniforms.uTime.value+=e)});const u=l.getWorldPosition(new Q);u.project(Te),u.z<1&&Math.abs(u.x)<1.5&&Math.abs(u.y)<1.5&&(Pn.uBHPos.value[A].set(u.x*.5+.5,u.y*.5+.5),Pn.uBHMass.value[A]=2,A++)}),Pn.uBHCount.value=A,R.isAutopilot&&!R.isTransitioning){R.autopilotTimer+=e;let l=!0;if(R.viewLevel===0&&R.universeSimTime<1&&(l=!1),l&&R.autopilotTimer>R.autopilotNextAction){if(R.autopilotTimer=0,R.autopilotNextAction=5,R.viewLevel===0){const u=Math.floor(Math.random()*St.starCount);if(_t){const f=_t.geometry.attributes.position,p=new Q(f.getX(u),f.getY(u),f.getZ(u)),g=rm(St.seed+u,R.universeSimTime);R.selectedTarget={level:0,index:u,position:p,data:g},SA(g,!0),ci(p,1)}}else if(R.viewLevel===1)if(R.autopilotPriorityTargets.length>0){const u=R.autopilotPriorityTargets.shift();if(u&&u.object&&typeof u.object.getWorldPosition=="function"){u.object.getWorldPosition(Zi);const f=Zi.clone(),p=u.data||no();R.selectedTarget={level:1,object:u.object,position:f,data:p},SA(p,!0),ci(f,2)}}else{const u=Math.floor(Math.random()*St.starCount);if(nt){const f=nt.geometry.attributes.position,p=new Q(f.getX(u),f.getY(u),f.getZ(u)),g=im(u);R.selectedTarget={level:1,index:u,position:p,data:g},SA(g,!0),ci(p,2)}}else if(R.viewLevel===2){const u=rt.children.filter(f=>f.userData&&f.userData.type);if(R.planetTourIndex<u.length){const f=u[R.planetTourIndex],p={designation:f.userData.designation,type:f.userData.type,age:R.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:"SILICATES/ICE"};R.selectedTarget={level:2,object:f,position:f.position,data:p},SA(p,!0),Ce.target.copy(f.position),R.planetTourIndex++}else tm()}}}if(R.isTransitioning?(R.transitionProgress+=e,Te.position.lerp(R.transitionTarget,.05),Ce.target.lerp(R.transitionTarget,.05),R.transitionProgress>3&&Am()):Ce.update(),!!((s=ne==null?void 0:ne.xr)!=null&&s.isPresenting)?((!(M!=null&&M.anchor)||!(M!=null&&M.mesh))&&Vu(),M&&!M.visible&&(So(),oo(!0),ku())):M!=null&&M.visible&&oo(!1),Zg(n),ne&&!((a=ne==null?void 0:ne.xr)!=null&&a.isPresenting))try{ne.setRenderTarget(null),ne.setViewport(0,0,ne.domElement.width,ne.domElement.height),ne.setScissorTest(!1)}catch{}(o=ne==null?void 0:ne.xr)!=null&&o.isPresenting||Ia>0?(ne.render(at,Te),(c=ne==null?void 0:ne.xr)!=null&&c.isPresenting||(Ia=Math.max(0,Ia-1))):UA.render();const r=R.viewLevel===0?R.universeSimTime:R.galaxySimTime;Md&&(Md.innerText=r.toFixed(2)+" Bn YR"),ro&&(ro.innerText=`[ STATUS ${r.toFixed(2)}Bn ]`),Te&&(Hl||Nl||Ol)&&(ga.copy(Te.position).add(R.worldOffset),Hl&&(Hl.innerText=Pl(ga.x)),Nl&&(Nl.innerText=Pl(ga.y)),Ol&&(Ol.innerText=Pl(ga.z))),fT.innerText=Math.round(1/(e||.001))}function RT(n){if(EA.delete(n.pointerId),EA.size===0?(Qn=!1,gA=null):(Qn=!0,gA===n.pointerId&&(gA=EA.values().next().value)),li){EA.size===0&&(li=!1);return}if(Sn||n.target.closest("button")||n.target.closest(".hud-panel"))return;const e=ne.domElement.getBoundingClientRect();if(Ta.x=(n.clientX-e.left)/e.width*2-1,Ta.y=-((n.clientY-e.top)/e.height)*2+1,An.setFromCamera(Ta,Te),R.viewLevel===0&&_t){An.params.Points.threshold=5e5;const t=An.intersectObject(_t);if(t.length>0){Ir();const A=t[0].index,i=rm(St.seed+A,R.universeSimTime);R.selectedTarget={level:0,index:A,position:t[0].point,data:i},SA(i)}}else if(R.viewLevel===1&&nt){const t=ut&&ut.visible&&ut.children.length>0?ut.children[0]:null;if(t){if(An.intersectObject(t,!0).length>0){Ir();const r=no();t.getWorldPosition(Zi),R.selectedTarget={level:1,object:t,position:Zi.clone(),data:r},SA(r);return}if(ma.copy(t.getWorldPosition(Zi)).project(Te),ma.z<1){const r=e.left+(ma.x*.5+.5)*e.width,s=e.top+(-ma.y*.5+.5)*e.height,a=Math.max(24,Math.min(e.width,e.height)*.06);if(Math.hypot(n.clientX-r,n.clientY-s)<=a){Ir();const o=no();R.selectedTarget={level:1,object:t,position:Zi.clone(),data:o},SA(o);return}}}An.params.Points.threshold=5e4;const A=An.intersectObject(nt);if(A.length>0){Ir();const i=A[0].index,r=im(i);R.selectedTarget={level:1,index:i,position:A[0].point,data:r},SA(r)}}else if(R.viewLevel===2&&rt){An.params.Points.threshold=1;const t=An.intersectObjects(rt.children);if(t.length>0){let A=t[0].object;if(!A.userData.type&&A.parent&&A.parent.userData.type&&(A=A.parent),A.userData.type){Ir();const i={designation:A.userData.designation,type:A.userData.type,age:R.universeSimTime.toFixed(2),mass:"0.003 M☉",radius:"0.01 R☉",lum:"0",composition:"Atmosphere: N2, O2"};R.selectedTarget={level:2,object:A,position:A.position,data:i},SA(i)}}}}
