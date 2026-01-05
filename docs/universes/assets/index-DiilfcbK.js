var Xm=Object.defineProperty;var Ym=(n,e,t)=>e in n?Xm(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Ee=(n,e,t)=>Ym(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))A(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&A(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function A(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Gu="167",Ti={ROTATE:0,DOLLY:1,PAN:2},Ii={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Jm=0,Mf=1,Zm=2,wp=1,qm=2,mn=3,Zn=0,$t=1,UA=2,xn=0,fr=1,XA=2,bf=3,Ff=4,jm=5,ci=100,$m=101,e0=102,t0=103,A0=104,n0=200,i0=201,r0=202,s0=203,Bc=204,vc=205,a0=206,o0=207,l0=208,c0=209,u0=210,f0=211,h0=212,d0=213,p0=214,g0=0,m0=1,B0=2,to=3,v0=4,w0=5,C0=6,x0=7,Cp=0,_0=1,E0=2,Kn=0,y0=1,U0=2,S0=3,M0=4,b0=5,F0=6,T0=7,xp=300,_r=301,Er=302,wc=303,Cc=304,Do=306,xc=1e3,SA=1001,_c=1002,RA=1003,I0=1004,Qs=1005,Jt=1006,rl=1007,hi=1008,YA=1009,_p=1010,Ep=1011,ds=1012,Vu=1013,Ei=1014,wn=1015,Fr=1016,ku=1017,zu=1018,yr=1020,yp=35902,Up=1021,Sp=1022,WA=1023,Mp=1024,bp=1025,hr=1026,Ur=1027,Po=1028,Ku=1029,Fp=1030,Wu=1031,Xu=1033,Na=33776,Oa=33777,Ga=33778,Va=33779,Ec=35840,yc=35841,Uc=35842,Sc=35843,Mc=36196,bc=37492,Fc=37496,Tc=37808,Ic=37809,Qc=37810,Lc=37811,Rc=37812,Dc=37813,Pc=37814,Hc=37815,Nc=37816,Oc=37817,Gc=37818,Vc=37819,kc=37820,zc=37821,ka=36492,Kc=36494,Wc=36495,Tp=36283,Xc=36284,Yc=36285,Jc=36286,Q0=3200,L0=3201,Ip=0,R0=1,Hn="",zA="srgb",ei="srgb-linear",Yu="display-p3",Ho="display-p3-linear",Ao="linear",gt="srgb",no="rec709",io="p3",Qi=7680,Tf=519,D0=512,P0=513,H0=514,Qp=515,N0=516,O0=517,G0=518,V0=519,If=35044,ro="300 es",Cn=2e3,so=2001;class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const A=this._listeners;A[e]===void 0&&(A[e]=[]),A[e].indexOf(t)===-1&&A[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const A=this._listeners;return A[e]!==void 0&&A[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const A=this._listeners[e.type];if(A!==void 0){e.target=this;const i=A.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const tA=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],za=Math.PI/180,Zc=180/Math.PI;function _s(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,A=Math.random()*4294967295|0;return(tA[n&255]+tA[n>>8&255]+tA[n>>16&255]+tA[n>>24&255]+"-"+tA[e&255]+tA[e>>8&255]+"-"+tA[e>>16&15|64]+tA[e>>24&255]+"-"+tA[t&63|128]+tA[t>>8&255]+"-"+tA[t>>16&255]+tA[t>>24&255]+tA[A&255]+tA[A>>8&255]+tA[A>>16&255]+tA[A>>24&255]).toLowerCase()}function Yt(n,e,t){return Math.max(e,Math.min(t,n))}function k0(n,e){return(n%e+e)%e}function sl(n,e,t){return(1-t)*n+t*e}function Lr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function hA(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const z0={DEG2RAD:za};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,A=this.y,i=e.elements;return this.x=i[0]*t+i[3]*A+i[6],this.y=i[1]*t+i[4]*A+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(Yt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y;return t*t+A*A}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const A=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*A-s*i+e.x,this.y=r*i+s*A+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class We{constructor(e,t,A,i,r,s,a,o,l){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l)}set(e,t,A,i,r,s,a,o,l){const c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=r,c[5]=o,c[6]=A,c[7]=s,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],this}extractBasis(e,t,A){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),A.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[3],o=A[6],l=A[1],c=A[4],u=A[7],f=A[2],p=A[5],g=A[8],m=i[0],d=i[3],h=i[6],v=i[1],w=i[4],_=i[7],b=i[2],y=i[5],S=i[8];return r[0]=s*m+a*v+o*b,r[3]=s*d+a*w+o*y,r[6]=s*h+a*_+o*S,r[1]=l*m+c*v+u*b,r[4]=l*d+c*w+u*y,r[7]=l*h+c*_+u*S,r[2]=f*m+p*v+g*b,r[5]=f*d+p*w+g*y,r[8]=f*h+p*_+g*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*s*c-t*a*l-A*r*c+A*a*o+i*r*l-i*s*o}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=c*s-a*l,f=a*o-c*r,p=l*r-s*o,g=t*u+A*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/g;return e[0]=u*m,e[1]=(i*l-c*A)*m,e[2]=(a*A-i*s)*m,e[3]=f*m,e[4]=(c*t-i*o)*m,e[5]=(i*r-a*t)*m,e[6]=p*m,e[7]=(A*o-l*t)*m,e[8]=(s*t-A*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,A,i,r,s,a){const o=Math.cos(r),l=Math.sin(r);return this.set(A*o,A*l,-A*(o*s+l*a)+s+e,-i*l,i*o,-i*(-l*s+o*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(al.makeScale(e,t)),this}rotate(e){return this.premultiply(al.makeRotation(-e)),this}translate(e,t){return this.premultiply(al.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,A,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<9;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<9;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const al=new We;function Lp(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ao(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function K0(){const n=ao("canvas");return n.style.display="block",n}const Qf={};function rs(n){n in Qf||(Qf[n]=!0,console.warn(n))}function W0(n,e,t){return new Promise(function(A,i){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:i();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:A()}}setTimeout(r,t)})}const Lf=new We().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Rf=new We().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Rr={[ei]:{transfer:Ao,primaries:no,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[zA]:{transfer:gt,primaries:no,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Ho]:{transfer:Ao,primaries:io,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Rf),fromReference:n=>n.applyMatrix3(Lf)},[Yu]:{transfer:gt,primaries:io,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Rf),fromReference:n=>n.applyMatrix3(Lf).convertLinearToSRGB()}},X0=new Set([ei,Ho]),ot={enabled:!0,_workingColorSpace:ei,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!X0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const A=Rr[e].toReference,i=Rr[t].fromReference;return i(A(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Rr[n].primaries},getTransfer:function(n){return n===Hn?Ao:Rr[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Rr[e].luminanceCoefficients)}};function dr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ol(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Li;class Y0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Li===void 0&&(Li=ao("canvas")),Li.width=e.width,Li.height=e.height;const A=Li.getContext("2d");e instanceof ImageData?A.putImageData(e,0,0):A.drawImage(e,0,0,e.width,e.height),t=Li}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ao("canvas");t.width=e.width,t.height=e.height;const A=t.getContext("2d");A.drawImage(e,0,0,e.width,e.height);const i=A.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=dr(r[s]/255)*255;return A.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let A=0;A<t.length;A++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[A]=Math.floor(dr(t[A]/255)*255):t[A]=dr(t[A]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let J0=0;class Rp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=_s(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const A={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(ll(i[s].image)):r.push(ll(i[s]))}else r=ll(i);A.url=r}return t||(e.images[this.uuid]=A),A}}function ll(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Y0.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Z0=0;class fA extends Si{constructor(e=fA.DEFAULT_IMAGE,t=fA.DEFAULT_MAPPING,A=SA,i=SA,r=Jt,s=hi,a=WA,o=YA,l=fA.DEFAULT_ANISOTROPY,c=Hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Z0++}),this.uuid=_s(),this.name="",this.source=new Rp(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=A,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const A={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(A.userData=this.userData),t||(e.textures[this.uuid]=A),A}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xc:e.x=e.x-Math.floor(e.x);break;case SA:e.x=e.x<0?0:1;break;case _c:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xc:e.y=e.y-Math.floor(e.y);break;case SA:e.y=e.y<0?0:1;break;case _c:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fA.DEFAULT_IMAGE=null;fA.DEFAULT_MAPPING=xp;fA.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,t=0,A=0,i=1){ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=A,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,A,i){return this.x=e,this.y=t,this.z=A,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*A+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*A+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*A+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*A+s[11]*i+s[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,A,i,r;const o=e.elements,l=o[0],c=o[4],u=o[8],f=o[1],p=o[5],g=o[9],m=o[2],d=o[6],h=o[10];if(Math.abs(c-f)<.01&&Math.abs(u-m)<.01&&Math.abs(g-d)<.01){if(Math.abs(c+f)<.1&&Math.abs(u+m)<.1&&Math.abs(g+d)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,_=(p+1)/2,b=(h+1)/2,y=(c+f)/4,S=(u+m)/4,R=(g+d)/4;return w>_&&w>b?w<.01?(A=0,i=.707106781,r=.707106781):(A=Math.sqrt(w),i=y/A,r=S/A):_>b?_<.01?(A=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),A=y/i,r=R/i):b<.01?(A=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),A=S/r,i=R/r),this.set(A,i,r,t),this}let v=Math.sqrt((d-g)*(d-g)+(u-m)*(u-m)+(f-c)*(f-c));return Math.abs(v)<.001&&(v=1),this.x=(d-g)/v,this.y=(u-m)/v,this.z=(f-c)/v,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this.w=e.w+(t.w-e.w)*A,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class q0 extends Si{constructor(e=1,t=1,A={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);const i={width:e,height:t,depth:1};A=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},A);const r=new fA(i,A.mapping,A.wrapS,A.wrapT,A.magFilter,A.minFilter,A.format,A.type,A.anisotropy,A.colorSpace);r.flipY=!1,r.generateMipmaps=A.generateMipmaps,r.internalFormat=A.internalFormat,this.textures=[];const s=A.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=A.depthBuffer,this.stencilBuffer=A.stencilBuffer,this.resolveDepthBuffer=A.resolveDepthBuffer,this.resolveStencilBuffer=A.resolveStencilBuffer,this.depthTexture=A.depthTexture,this.samples=A.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,A=1){if(this.width!==e||this.height!==t||this.depth!==A){this.width=e,this.height=t,this.depth=A;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=A;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let A=0,i=e.textures.length;A<i;A++)this.textures[A]=e.textures[A].clone(),this.textures[A].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Rp(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class qn extends q0{constructor(e=1,t=1,A={}){super(e,t,A),this.isWebGLRenderTarget=!0}}class Dp extends fA{constructor(e=null,t=1,A=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=RA,this.minFilter=RA,this.wrapR=SA,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ju extends fA{constructor(e=null,t=1,A=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=RA,this.minFilter=RA,this.wrapR=SA,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class yi{constructor(e=0,t=0,A=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=A,this._w=i}static slerpFlat(e,t,A,i,r,s,a){let o=A[i+0],l=A[i+1],c=A[i+2],u=A[i+3];const f=r[s+0],p=r[s+1],g=r[s+2],m=r[s+3];if(a===0){e[t+0]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=m;return}if(u!==m||o!==f||l!==p||c!==g){let d=1-a;const h=o*f+l*p+c*g+u*m,v=h>=0?1:-1,w=1-h*h;if(w>Number.EPSILON){const b=Math.sqrt(w),y=Math.atan2(b,h*v);d=Math.sin(d*y)/b,a=Math.sin(a*y)/b}const _=a*v;if(o=o*d+f*_,l=l*d+p*_,c=c*d+g*_,u=u*d+m*_,d===1-a){const b=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=b,l*=b,c*=b,u*=b}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,A,i,r,s){const a=A[i],o=A[i+1],l=A[i+2],c=A[i+3],u=r[s],f=r[s+1],p=r[s+2],g=r[s+3];return e[t]=a*g+c*u+o*p-l*f,e[t+1]=o*g+c*f+l*u-a*p,e[t+2]=l*g+c*p+a*f-o*u,e[t+3]=c*g-a*u-o*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,A,i){return this._x=e,this._y=t,this._z=A,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const A=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,o=Math.sin,l=a(A/2),c=a(i/2),u=a(r/2),f=o(A/2),p=o(i/2),g=o(r/2);switch(s){case"XYZ":this._x=f*c*u+l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u-f*p*g;break;case"YXZ":this._x=f*c*u+l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u+f*p*g;break;case"ZXY":this._x=f*c*u-l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u-f*p*g;break;case"ZYX":this._x=f*c*u-l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u+f*p*g;break;case"YZX":this._x=f*c*u+l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u-f*p*g;break;case"XZY":this._x=f*c*u-l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const A=t/2,i=Math.sin(A);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(A),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,A=t[0],i=t[4],r=t[8],s=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10],f=A+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(c-o)*p,this._y=(r-l)*p,this._z=(s-i)*p}else if(A>a&&A>u){const p=2*Math.sqrt(1+A-a-u);this._w=(c-o)/p,this._x=.25*p,this._y=(i+s)/p,this._z=(r+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-A-u);this._w=(r-l)/p,this._x=(i+s)/p,this._y=.25*p,this._z=(o+c)/p}else{const p=2*Math.sqrt(1+u-A-a);this._w=(s-i)/p,this._x=(r+l)/p,this._y=(o+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let A=e.dot(t)+1;return A<Number.EPSILON?(A=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=A):(this._x=0,this._y=-e.z,this._z=e.y,this._w=A)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=A),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Yt(this.dot(e),-1,1)))}rotateTowards(e,t){const A=this.angleTo(e);if(A===0)return this;const i=Math.min(1,t/A);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const A=e._x,i=e._y,r=e._z,s=e._w,a=t._x,o=t._y,l=t._z,c=t._w;return this._x=A*c+s*a+i*l-r*o,this._y=i*c+s*o+r*a-A*l,this._z=r*c+s*l+A*o-i*a,this._w=s*c-A*a-i*o-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const A=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+A*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=A,this._y=i,this._z=r,this;const o=1-a*a;if(o<=Number.EPSILON){const p=1-t;return this._w=p*s+t*this._w,this._x=p*A+t*this._x,this._y=p*i+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const l=Math.sqrt(o),c=Math.atan2(l,a),u=Math.sin((1-t)*c)/l,f=Math.sin(t*c)/l;return this._w=s*u+this._w*f,this._x=A*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,A){return this.copy(e).slerp(t,A)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),A=Math.random(),i=Math.sqrt(1-A),r=Math.sqrt(A);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,A=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=A}set(e,t,A){return A===void 0&&(A=this.z),this.x=e,this.y=t,this.z=A,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Df.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Df.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*A+r[6]*i,this.y=r[1]*t+r[4]*A+r[7]*i,this.z=r[2]*t+r[5]*A+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*A+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*A+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*A+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*A+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,A=this.y,i=this.z,r=e.x,s=e.y,a=e.z,o=e.w,l=2*(s*i-a*A),c=2*(a*t-r*i),u=2*(r*A-s*t);return this.x=t+o*l+s*u-a*c,this.y=A+o*c+a*l-r*u,this.z=i+o*u+r*c-s*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*A+r[8]*i,this.y=r[1]*t+r[5]*A+r[9]*i,this.z=r[2]*t+r[6]*A+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const A=e.x,i=e.y,r=e.z,s=t.x,a=t.y,o=t.z;return this.x=i*o-r*a,this.y=r*s-A*o,this.z=A*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const A=e.dot(this)/t;return this.copy(e).multiplyScalar(A)}projectOnPlane(e){return cl.copy(this).projectOnVector(e),this.sub(cl)}reflect(e){return this.sub(cl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(Yt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y,i=this.z-e.z;return t*t+A*A+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,A){const i=Math.sin(t)*e;return this.x=i*Math.sin(A),this.y=Math.cos(t)*e,this.z=i*Math.cos(A),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,A){return this.x=e*Math.sin(t),this.y=A,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),A=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=A,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,A=Math.sqrt(1-t*t);return this.x=A*Math.cos(e),this.y=t,this.z=A*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const cl=new I,Df=new yi;class Es{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t+=3)this.expandByPoint(NA.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,A=e.count;t<A;t++)this.expandByPoint(NA.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const A=NA.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(A),this.max.copy(e).add(A),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const A=e.geometry;if(A!==void 0){const r=A.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,NA):NA.fromBufferAttribute(r,s),NA.applyMatrix4(e.matrixWorld),this.expandByPoint(NA);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ls.copy(e.boundingBox)):(A.boundingBox===null&&A.computeBoundingBox(),Ls.copy(A.boundingBox)),Ls.applyMatrix4(e.matrixWorld),this.union(Ls)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,NA),NA.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,A;return e.normal.x>0?(t=e.normal.x*this.min.x,A=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,A=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,A+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,A+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,A+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,A+=e.normal.z*this.min.z),t<=-e.constant&&A>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dr),Rs.subVectors(this.max,Dr),Ri.subVectors(e.a,Dr),Di.subVectors(e.b,Dr),Pi.subVectors(e.c,Dr),Sn.subVectors(Di,Ri),Mn.subVectors(Pi,Di),Ai.subVectors(Ri,Pi);let t=[0,-Sn.z,Sn.y,0,-Mn.z,Mn.y,0,-Ai.z,Ai.y,Sn.z,0,-Sn.x,Mn.z,0,-Mn.x,Ai.z,0,-Ai.x,-Sn.y,Sn.x,0,-Mn.y,Mn.x,0,-Ai.y,Ai.x,0];return!ul(t,Ri,Di,Pi,Rs)||(t=[1,0,0,0,1,0,0,0,1],!ul(t,Ri,Di,Pi,Rs))?!1:(Ds.crossVectors(Sn,Mn),t=[Ds.x,Ds.y,Ds.z],ul(t,Ri,Di,Pi,Rs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,NA).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(NA).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ln=[new I,new I,new I,new I,new I,new I,new I,new I],NA=new I,Ls=new Es,Ri=new I,Di=new I,Pi=new I,Sn=new I,Mn=new I,Ai=new I,Dr=new I,Rs=new I,Ds=new I,ni=new I;function ul(n,e,t,A,i){for(let r=0,s=n.length-3;r<=s;r+=3){ni.fromArray(n,r);const a=i.x*Math.abs(ni.x)+i.y*Math.abs(ni.y)+i.z*Math.abs(ni.z),o=e.dot(ni),l=t.dot(ni),c=A.dot(ni);if(Math.max(-Math.max(o,l,c),Math.min(o,l,c))>a)return!1}return!0}const j0=new Es,Pr=new I,fl=new I;class ys{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const A=this.center;t!==void 0?A.copy(t):j0.setFromPoints(e).getCenter(A);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,A.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const A=this.center.distanceToSquared(e);return t.copy(e),A>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Pr.subVectors(e,this.center);const t=Pr.lengthSq();if(t>this.radius*this.radius){const A=Math.sqrt(t),i=(A-this.radius)*.5;this.center.addScaledVector(Pr,i/A),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Pr.copy(e.center).add(fl)),this.expandByPoint(Pr.copy(e.center).sub(fl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const cn=new I,hl=new I,Ps=new I,bn=new I,dl=new I,Hs=new I,pl=new I;class Us{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const A=t.dot(this.direction);return A<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,A)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=cn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(cn.copy(this.origin).addScaledVector(this.direction,t),cn.distanceToSquared(e))}distanceSqToSegment(e,t,A,i){hl.copy(e).add(t).multiplyScalar(.5),Ps.copy(t).sub(e).normalize(),bn.copy(this.origin).sub(hl);const r=e.distanceTo(t)*.5,s=-this.direction.dot(Ps),a=bn.dot(this.direction),o=-bn.dot(Ps),l=bn.lengthSq(),c=Math.abs(1-s*s);let u,f,p,g;if(c>0)if(u=s*o-a,f=s*a-o,g=r*c,u>=0)if(f>=-g)if(f<=g){const m=1/c;u*=m,f*=m,p=u*(u+s*f+2*a)+f*(s*u+f+2*o)+l}else f=r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;else f=-r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;else f<=-g?(u=Math.max(0,-(-s*r+a)),f=u>0?-r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-o),r),p=f*(f+2*o)+l):(u=Math.max(0,-(s*r+a)),f=u>0?r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+l);else f=s>0?-r:r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;return A&&A.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(hl).addScaledVector(Ps,f),p}intersectSphere(e,t){cn.subVectors(e.center,this.origin);const A=cn.dot(this.direction),i=cn.dot(cn)-A*A,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=A-s,o=A+s;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const A=-(this.origin.dot(e.normal)+e.constant)/t;return A>=0?A:null}intersectPlane(e,t){const A=this.distanceToPlane(e);return A===null?null:this.at(A,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let A,i,r,s,a,o;const l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(A=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(A=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),c>=0?(r=(e.min.y-f.y)*c,s=(e.max.y-f.y)*c):(r=(e.max.y-f.y)*c,s=(e.min.y-f.y)*c),A>s||r>i||((r>A||isNaN(A))&&(A=r),(s<i||isNaN(i))&&(i=s),u>=0?(a=(e.min.z-f.z)*u,o=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,o=(e.min.z-f.z)*u),A>o||a>i)||((a>A||A!==A)&&(A=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(A>=0?A:i,t)}intersectsBox(e){return this.intersectBox(e,cn)!==null}intersectTriangle(e,t,A,i,r){dl.subVectors(t,e),Hs.subVectors(A,e),pl.crossVectors(dl,Hs);let s=this.direction.dot(pl),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;bn.subVectors(this.origin,e);const o=a*this.direction.dot(Hs.crossVectors(bn,Hs));if(o<0)return null;const l=a*this.direction.dot(dl.cross(bn));if(l<0||o+l>s)return null;const c=-a*bn.dot(pl);return c<0?null:this.at(c/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d)}set(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d){const h=this.elements;return h[0]=e,h[4]=t,h[8]=A,h[12]=i,h[1]=r,h[5]=s,h[9]=a,h[13]=o,h[2]=l,h[6]=c,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=m,h[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],t[9]=A[9],t[10]=A[10],t[11]=A[11],t[12]=A[12],t[13]=A[13],t[14]=A[14],t[15]=A[15],this}copyPosition(e){const t=this.elements,A=e.elements;return t[12]=A[12],t[13]=A[13],t[14]=A[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,A){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),A.setFromMatrixColumn(this,2),this}makeBasis(e,t,A){return this.set(e.x,t.x,A.x,0,e.y,t.y,A.y,0,e.z,t.z,A.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,A=e.elements,i=1/Hi.setFromMatrixColumn(e,0).length(),r=1/Hi.setFromMatrixColumn(e,1).length(),s=1/Hi.setFromMatrixColumn(e,2).length();return t[0]=A[0]*i,t[1]=A[1]*i,t[2]=A[2]*i,t[3]=0,t[4]=A[4]*r,t[5]=A[5]*r,t[6]=A[6]*r,t[7]=0,t[8]=A[8]*s,t[9]=A[9]*s,t[10]=A[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,A=e.x,i=e.y,r=e.z,s=Math.cos(A),a=Math.sin(A),o=Math.cos(i),l=Math.sin(i),c=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=s*c,p=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=-o*u,t[8]=l,t[1]=p+g*l,t[5]=f-m*l,t[9]=-a*o,t[2]=m-f*l,t[6]=g+p*l,t[10]=s*o}else if(e.order==="YXZ"){const f=o*c,p=o*u,g=l*c,m=l*u;t[0]=f+m*a,t[4]=g*a-p,t[8]=s*l,t[1]=s*u,t[5]=s*c,t[9]=-a,t[2]=p*a-g,t[6]=m+f*a,t[10]=s*o}else if(e.order==="ZXY"){const f=o*c,p=o*u,g=l*c,m=l*u;t[0]=f-m*a,t[4]=-s*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=s*c,t[9]=m-f*a,t[2]=-s*l,t[6]=a,t[10]=s*o}else if(e.order==="ZYX"){const f=s*c,p=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=g*l-p,t[8]=f*l+m,t[1]=o*u,t[5]=m*l+f,t[9]=p*l-g,t[2]=-l,t[6]=a*o,t[10]=s*o}else if(e.order==="YZX"){const f=s*o,p=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=m-f*u,t[8]=g*u+p,t[1]=u,t[5]=s*c,t[9]=-a*c,t[2]=-l*c,t[6]=p*u+g,t[10]=f-m*u}else if(e.order==="XZY"){const f=s*o,p=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=-u,t[8]=l*c,t[1]=f*u+m,t[5]=s*c,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*c,t[10]=m*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($0,e,eB)}lookAt(e,t,A){const i=this.elements;return BA.subVectors(e,t),BA.lengthSq()===0&&(BA.z=1),BA.normalize(),Fn.crossVectors(A,BA),Fn.lengthSq()===0&&(Math.abs(A.z)===1?BA.x+=1e-4:BA.z+=1e-4,BA.normalize(),Fn.crossVectors(A,BA)),Fn.normalize(),Ns.crossVectors(BA,Fn),i[0]=Fn.x,i[4]=Ns.x,i[8]=BA.x,i[1]=Fn.y,i[5]=Ns.y,i[9]=BA.y,i[2]=Fn.z,i[6]=Ns.z,i[10]=BA.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[4],o=A[8],l=A[12],c=A[1],u=A[5],f=A[9],p=A[13],g=A[2],m=A[6],d=A[10],h=A[14],v=A[3],w=A[7],_=A[11],b=A[15],y=i[0],S=i[4],R=i[8],E=i[12],C=i[1],L=i[5],W=i[9],P=i[13],K=i[2],Z=i[6],V=i[10],q=i[14],X=i[3],re=i[7],ae=i[11],he=i[15];return r[0]=s*y+a*C+o*K+l*X,r[4]=s*S+a*L+o*Z+l*re,r[8]=s*R+a*W+o*V+l*ae,r[12]=s*E+a*P+o*q+l*he,r[1]=c*y+u*C+f*K+p*X,r[5]=c*S+u*L+f*Z+p*re,r[9]=c*R+u*W+f*V+p*ae,r[13]=c*E+u*P+f*q+p*he,r[2]=g*y+m*C+d*K+h*X,r[6]=g*S+m*L+d*Z+h*re,r[10]=g*R+m*W+d*V+h*ae,r[14]=g*E+m*P+d*q+h*he,r[3]=v*y+w*C+_*K+b*X,r[7]=v*S+w*L+_*Z+b*re,r[11]=v*R+w*W+_*V+b*ae,r[15]=v*E+w*P+_*q+b*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[4],i=e[8],r=e[12],s=e[1],a=e[5],o=e[9],l=e[13],c=e[2],u=e[6],f=e[10],p=e[14],g=e[3],m=e[7],d=e[11],h=e[15];return g*(+r*o*u-i*l*u-r*a*f+A*l*f+i*a*p-A*o*p)+m*(+t*o*p-t*l*f+r*s*f-i*s*p+i*l*c-r*o*c)+d*(+t*l*u-t*a*p-r*s*u+A*s*p+r*a*c-A*l*c)+h*(-i*a*c-t*o*u+t*a*f+i*s*u-A*s*f+A*o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,A){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=A),this}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=e[9],f=e[10],p=e[11],g=e[12],m=e[13],d=e[14],h=e[15],v=u*d*l-m*f*l+m*o*p-a*d*p-u*o*h+a*f*h,w=g*f*l-c*d*l-g*o*p+s*d*p+c*o*h-s*f*h,_=c*m*l-g*u*l+g*a*p-s*m*p-c*a*h+s*u*h,b=g*u*o-c*m*o-g*a*f+s*m*f+c*a*d-s*u*d,y=t*v+A*w+i*_+r*b;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/y;return e[0]=v*S,e[1]=(m*f*r-u*d*r-m*i*p+A*d*p+u*i*h-A*f*h)*S,e[2]=(a*d*r-m*o*r+m*i*l-A*d*l-a*i*h+A*o*h)*S,e[3]=(u*o*r-a*f*r-u*i*l+A*f*l+a*i*p-A*o*p)*S,e[4]=w*S,e[5]=(c*d*r-g*f*r+g*i*p-t*d*p-c*i*h+t*f*h)*S,e[6]=(g*o*r-s*d*r-g*i*l+t*d*l+s*i*h-t*o*h)*S,e[7]=(s*f*r-c*o*r+c*i*l-t*f*l-s*i*p+t*o*p)*S,e[8]=_*S,e[9]=(g*u*r-c*m*r-g*A*p+t*m*p+c*A*h-t*u*h)*S,e[10]=(s*m*r-g*a*r+g*A*l-t*m*l-s*A*h+t*a*h)*S,e[11]=(c*a*r-s*u*r-c*A*l+t*u*l+s*A*p-t*a*p)*S,e[12]=b*S,e[13]=(c*m*i-g*u*i+g*A*f-t*m*f-c*A*d+t*u*d)*S,e[14]=(g*a*i-s*m*i-g*A*o+t*m*o+s*A*d-t*a*d)*S,e[15]=(s*u*i-c*a*i+c*A*o-t*u*o-s*A*f+t*a*f)*S,this}scale(e){const t=this.elements,A=e.x,i=e.y,r=e.z;return t[0]*=A,t[4]*=i,t[8]*=r,t[1]*=A,t[5]*=i,t[9]*=r,t[2]*=A,t[6]*=i,t[10]*=r,t[3]*=A,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],A=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,A,i))}makeTranslation(e,t,A){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,A,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),A=Math.sin(e);return this.set(1,0,0,0,0,t,-A,0,0,A,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,0,A,0,0,1,0,0,-A,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,0,A,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const A=Math.cos(t),i=Math.sin(t),r=1-A,s=e.x,a=e.y,o=e.z,l=r*s,c=r*a;return this.set(l*s+A,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+A,c*o-i*s,0,l*o-i*a,c*o+i*s,r*o*o+A,0,0,0,0,1),this}makeScale(e,t,A){return this.set(e,0,0,0,0,t,0,0,0,0,A,0,0,0,0,1),this}makeShear(e,t,A,i,r,s){return this.set(1,A,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,A){const i=this.elements,r=t._x,s=t._y,a=t._z,o=t._w,l=r+r,c=s+s,u=a+a,f=r*l,p=r*c,g=r*u,m=s*c,d=s*u,h=a*u,v=o*l,w=o*c,_=o*u,b=A.x,y=A.y,S=A.z;return i[0]=(1-(m+h))*b,i[1]=(p+_)*b,i[2]=(g-w)*b,i[3]=0,i[4]=(p-_)*y,i[5]=(1-(f+h))*y,i[6]=(d+v)*y,i[7]=0,i[8]=(g+w)*S,i[9]=(d-v)*S,i[10]=(1-(f+m))*S,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,A){const i=this.elements;let r=Hi.set(i[0],i[1],i[2]).length();const s=Hi.set(i[4],i[5],i[6]).length(),a=Hi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],OA.copy(this);const l=1/r,c=1/s,u=1/a;return OA.elements[0]*=l,OA.elements[1]*=l,OA.elements[2]*=l,OA.elements[4]*=c,OA.elements[5]*=c,OA.elements[6]*=c,OA.elements[8]*=u,OA.elements[9]*=u,OA.elements[10]*=u,t.setFromRotationMatrix(OA),A.x=r,A.y=s,A.z=a,this}makePerspective(e,t,A,i,r,s,a=Cn){const o=this.elements,l=2*r/(t-e),c=2*r/(A-i),u=(t+e)/(t-e),f=(A+i)/(A-i);let p,g;if(a===Cn)p=-(s+r)/(s-r),g=-2*s*r/(s-r);else if(a===so)p=-s/(s-r),g=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return o[0]=l,o[4]=0,o[8]=u,o[12]=0,o[1]=0,o[5]=c,o[9]=f,o[13]=0,o[2]=0,o[6]=0,o[10]=p,o[14]=g,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,A,i,r,s,a=Cn){const o=this.elements,l=1/(t-e),c=1/(A-i),u=1/(s-r),f=(t+e)*l,p=(A+i)*c;let g,m;if(a===Cn)g=(s+r)*u,m=-2*u;else if(a===so)g=r*u,m=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-f,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-p,o[2]=0,o[6]=0,o[10]=m,o[14]=-g,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<16;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<16;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e[t+9]=A[9],e[t+10]=A[10],e[t+11]=A[11],e[t+12]=A[12],e[t+13]=A[13],e[t+14]=A[14],e[t+15]=A[15],e}}const Hi=new I,OA=new ut,$0=new I(0,0,0),eB=new I(1,1,1),Fn=new I,Ns=new I,BA=new I,Pf=new ut,Hf=new yi;class rn{constructor(e=0,t=0,A=0,i=rn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=A,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,A,i=this._order){return this._x=e,this._y=t,this._z=A,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,A=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],o=i[1],l=i[5],c=i[9],u=i[2],f=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(o,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,l)):(this._y=0,this._z=Math.atan2(o,r));break;case"ZYX":this._y=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(o,r)):(this._x=0,this._z=Math.atan2(-s,l));break;case"YZX":this._z=Math.asin(Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Yt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-c,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,A===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,A){return Pf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pf,t,A)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hf.setFromEuler(this),this.setFromQuaternion(Hf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}rn.DEFAULT_ORDER="XYZ";class Zu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let tB=0;const Nf=new I,Ni=new yi,un=new ut,Os=new I,Hr=new I,AB=new I,nB=new yi,Of=new I(1,0,0),Gf=new I(0,1,0),Vf=new I(0,0,1),kf={type:"added"},iB={type:"removed"},Oi={type:"childadded",child:null},gl={type:"childremoved",child:null};class aA extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:tB++}),this.uuid=_s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=aA.DEFAULT_UP.clone();const e=new I,t=new rn,A=new yi,i=new I(1,1,1);function r(){A.setFromEuler(t,!1)}function s(){t.setFromQuaternion(A,void 0,!1)}t._onChange(r),A._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:A},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ut},normalMatrix:{value:new We}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=aA.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=aA.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(e,t){return Ni.setFromAxisAngle(e,t),this.quaternion.premultiply(Ni),this}rotateX(e){return this.rotateOnAxis(Of,e)}rotateY(e){return this.rotateOnAxis(Gf,e)}rotateZ(e){return this.rotateOnAxis(Vf,e)}translateOnAxis(e,t){return Nf.copy(e).applyQuaternion(this.quaternion),this.position.add(Nf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Of,e)}translateY(e){return this.translateOnAxis(Gf,e)}translateZ(e){return this.translateOnAxis(Vf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(un.copy(this.matrixWorld).invert())}lookAt(e,t,A){e.isVector3?Os.copy(e):Os.set(e,t,A);const i=this.parent;this.updateWorldMatrix(!0,!1),Hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?un.lookAt(Hr,Os,this.up):un.lookAt(Os,Hr,this.up),this.quaternion.setFromRotationMatrix(un),i&&(un.extractRotation(i.matrixWorld),Ni.setFromRotationMatrix(un),this.quaternion.premultiply(Ni.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(kf),Oi.child=e,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let A=0;A<arguments.length;A++)this.remove(arguments[A]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(iB),gl.child=e,this.dispatchEvent(gl),gl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),un.multiply(e.parent.matrixWorld)),e.applyMatrix4(un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(kf),Oi.child=e,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let A=0,i=this.children.length;A<i;A++){const s=this.children[A].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,A=[]){this[e]===t&&A.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,A);return A}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,e,AB),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hr,nB,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].updateMatrixWorld(e)}updateWorldMatrix(e,t){const A=this.parent;if(e===!0&&A!==null&&A.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",A={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},A.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){const u=o[l];r(e.shapes,u)}else r(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(r(e.materials,this.material[o]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const o=this.animations[a];i.animations.push(r(e.animations,o))}}if(t){const a=s(e.geometries),o=s(e.materials),l=s(e.textures),c=s(e.images),u=s(e.shapes),f=s(e.skeletons),p=s(e.animations),g=s(e.nodes);a.length>0&&(A.geometries=a),o.length>0&&(A.materials=o),l.length>0&&(A.textures=l),c.length>0&&(A.images=c),u.length>0&&(A.shapes=u),f.length>0&&(A.skeletons=f),p.length>0&&(A.animations=p),g.length>0&&(A.nodes=g)}return A.object=i,A;function s(a){const o=[];for(const l in a){const c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let A=0;A<e.children.length;A++){const i=e.children[A];this.add(i.clone())}return this}}aA.DEFAULT_UP=new I(0,1,0);aA.DEFAULT_MATRIX_AUTO_UPDATE=!0;aA.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const GA=new I,fn=new I,ml=new I,hn=new I,Gi=new I,Vi=new I,zf=new I,Bl=new I,vl=new I,wl=new I;class en{constructor(e=new I,t=new I,A=new I){this.a=e,this.b=t,this.c=A}static getNormal(e,t,A,i){i.subVectors(A,t),GA.subVectors(e,t),i.cross(GA);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,A,i,r){GA.subVectors(i,t),fn.subVectors(A,t),ml.subVectors(e,t);const s=GA.dot(GA),a=GA.dot(fn),o=GA.dot(ml),l=fn.dot(fn),c=fn.dot(ml),u=s*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*o-a*c)*f,g=(s*c-a*o)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,A,i){return this.getBarycoord(e,t,A,i,hn)===null?!1:hn.x>=0&&hn.y>=0&&hn.x+hn.y<=1}static getInterpolation(e,t,A,i,r,s,a,o){return this.getBarycoord(e,t,A,i,hn)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(r,hn.x),o.addScaledVector(s,hn.y),o.addScaledVector(a,hn.z),o)}static isFrontFacing(e,t,A,i){return GA.subVectors(A,t),fn.subVectors(e,t),GA.cross(fn).dot(i)<0}set(e,t,A){return this.a.copy(e),this.b.copy(t),this.c.copy(A),this}setFromPointsAndIndices(e,t,A,i){return this.a.copy(e[t]),this.b.copy(e[A]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,A,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,A),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return GA.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),GA.cross(fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return en.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return en.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,A,i,r){return en.getInterpolation(e,this.a,this.b,this.c,t,A,i,r)}containsPoint(e){return en.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return en.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const A=this.a,i=this.b,r=this.c;let s,a;Gi.subVectors(i,A),Vi.subVectors(r,A),Bl.subVectors(e,A);const o=Gi.dot(Bl),l=Vi.dot(Bl);if(o<=0&&l<=0)return t.copy(A);vl.subVectors(e,i);const c=Gi.dot(vl),u=Vi.dot(vl);if(c>=0&&u<=c)return t.copy(i);const f=o*u-c*l;if(f<=0&&o>=0&&c<=0)return s=o/(o-c),t.copy(A).addScaledVector(Gi,s);wl.subVectors(e,r);const p=Gi.dot(wl),g=Vi.dot(wl);if(g>=0&&p<=g)return t.copy(r);const m=p*l-o*g;if(m<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(A).addScaledVector(Vi,a);const d=c*g-p*u;if(d<=0&&u-c>=0&&p-g>=0)return zf.subVectors(r,i),a=(u-c)/(u-c+(p-g)),t.copy(i).addScaledVector(zf,a);const h=1/(d+m+f);return s=m*h,a=f*h,t.copy(A).addScaledVector(Gi,s).addScaledVector(Vi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Pp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Tn={h:0,s:0,l:0},Gs={h:0,s:0,l:0};function Cl(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ze{constructor(e,t,A){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,A)}set(e,t,A){if(t===void 0&&A===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,A);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zA){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.toWorkingColorSpace(this,t),this}setRGB(e,t,A,i=ot.workingColorSpace){return this.r=e,this.g=t,this.b=A,ot.toWorkingColorSpace(this,i),this}setHSL(e,t,A,i=ot.workingColorSpace){if(e=k0(e,1),t=Yt(t,0,1),A=Yt(A,0,1),t===0)this.r=this.g=this.b=A;else{const r=A<=.5?A*(1+t):A+t-A*t,s=2*A-r;this.r=Cl(s,r,e+1/3),this.g=Cl(s,r,e),this.b=Cl(s,r,e-1/3)}return ot.toWorkingColorSpace(this,i),this}setStyle(e,t=zA){function A(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zA){const A=Pp[e.toLowerCase()];return A!==void 0?this.setHex(A,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=dr(e.r),this.g=dr(e.g),this.b=dr(e.b),this}copyLinearToSRGB(e){return this.r=ol(e.r),this.g=ol(e.g),this.b=ol(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zA){return ot.fromWorkingColorSpace(AA.copy(this),e),Math.round(Yt(AA.r*255,0,255))*65536+Math.round(Yt(AA.g*255,0,255))*256+Math.round(Yt(AA.b*255,0,255))}getHexString(e=zA){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.fromWorkingColorSpace(AA.copy(this),t);const A=AA.r,i=AA.g,r=AA.b,s=Math.max(A,i,r),a=Math.min(A,i,r);let o,l;const c=(a+s)/2;if(a===s)o=0,l=0;else{const u=s-a;switch(l=c<=.5?u/(s+a):u/(2-s-a),s){case A:o=(i-r)/u+(i<r?6:0);break;case i:o=(r-A)/u+2;break;case r:o=(A-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=ot.workingColorSpace){return ot.fromWorkingColorSpace(AA.copy(this),t),e.r=AA.r,e.g=AA.g,e.b=AA.b,e}getStyle(e=zA){ot.fromWorkingColorSpace(AA.copy(this),e);const t=AA.r,A=AA.g,i=AA.b;return e!==zA?`color(${e} ${t.toFixed(3)} ${A.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(A*255)},${Math.round(i*255)})`}offsetHSL(e,t,A){return this.getHSL(Tn),this.setHSL(Tn.h+e,Tn.s+t,Tn.l+A)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,A){return this.r=e.r+(t.r-e.r)*A,this.g=e.g+(t.g-e.g)*A,this.b=e.b+(t.b-e.b)*A,this}lerpHSL(e,t){this.getHSL(Tn),e.getHSL(Gs);const A=sl(Tn.h,Gs.h,t),i=sl(Tn.s,Gs.s,t),r=sl(Tn.l,Gs.l,t);return this.setHSL(A,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,A=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*A+r[6]*i,this.g=r[1]*t+r[4]*A+r[7]*i,this.b=r[2]*t+r[5]*A+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const AA=new ze;ze.NAMES=Pp;let rB=0;class Mi extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rB++}),this.uuid=_s(),this.name="",this.type="Material",this.blending=fr,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Bc,this.blendDst=vc,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=to,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qi,this.stencilZFail=Qi,this.stencilZPass=Qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const A=e[t];if(A===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(A):i&&i.isVector3&&A&&A.isVector3?i.copy(A):this[t]=A}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const A={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};A.uuid=this.uuid,A.type=this.type,this.name!==""&&(A.name=this.name),this.color&&this.color.isColor&&(A.color=this.color.getHex()),this.roughness!==void 0&&(A.roughness=this.roughness),this.metalness!==void 0&&(A.metalness=this.metalness),this.sheen!==void 0&&(A.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(A.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(A.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(A.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(A.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(A.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(A.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(A.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(A.shininess=this.shininess),this.clearcoat!==void 0&&(A.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(A.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(A.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(A.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(A.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,A.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(A.dispersion=this.dispersion),this.iridescence!==void 0&&(A.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(A.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(A.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(A.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(A.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(A.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(A.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(A.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(A.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(A.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(A.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(A.lightMap=this.lightMap.toJSON(e).uuid,A.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(A.aoMap=this.aoMap.toJSON(e).uuid,A.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(A.bumpMap=this.bumpMap.toJSON(e).uuid,A.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(A.normalMap=this.normalMap.toJSON(e).uuid,A.normalMapType=this.normalMapType,A.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(A.displacementMap=this.displacementMap.toJSON(e).uuid,A.displacementScale=this.displacementScale,A.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(A.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(A.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(A.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(A.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(A.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(A.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(A.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(A.combine=this.combine)),this.envMapRotation!==void 0&&(A.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(A.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(A.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(A.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(A.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(A.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(A.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(A.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(A.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(A.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(A.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(A.size=this.size),this.shadowSide!==null&&(A.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(A.sizeAttenuation=this.sizeAttenuation),this.blending!==fr&&(A.blending=this.blending),this.side!==Zn&&(A.side=this.side),this.vertexColors===!0&&(A.vertexColors=!0),this.opacity<1&&(A.opacity=this.opacity),this.transparent===!0&&(A.transparent=!0),this.blendSrc!==Bc&&(A.blendSrc=this.blendSrc),this.blendDst!==vc&&(A.blendDst=this.blendDst),this.blendEquation!==ci&&(A.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(A.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(A.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(A.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(A.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(A.blendAlpha=this.blendAlpha),this.depthFunc!==to&&(A.depthFunc=this.depthFunc),this.depthTest===!1&&(A.depthTest=this.depthTest),this.depthWrite===!1&&(A.depthWrite=this.depthWrite),this.colorWrite===!1&&(A.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(A.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tf&&(A.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(A.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(A.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qi&&(A.stencilFail=this.stencilFail),this.stencilZFail!==Qi&&(A.stencilZFail=this.stencilZFail),this.stencilZPass!==Qi&&(A.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(A.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(A.rotation=this.rotation),this.polygonOffset===!0&&(A.polygonOffset=!0),this.polygonOffsetFactor!==0&&(A.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(A.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(A.linewidth=this.linewidth),this.dashSize!==void 0&&(A.dashSize=this.dashSize),this.gapSize!==void 0&&(A.gapSize=this.gapSize),this.scale!==void 0&&(A.scale=this.scale),this.dithering===!0&&(A.dithering=!0),this.alphaTest>0&&(A.alphaTest=this.alphaTest),this.alphaHash===!0&&(A.alphaHash=!0),this.alphaToCoverage===!0&&(A.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(A.premultipliedAlpha=!0),this.forceSinglePass===!0&&(A.forceSinglePass=!0),this.wireframe===!0&&(A.wireframe=!0),this.wireframeLinewidth>1&&(A.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(A.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(A.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(A.flatShading=!0),this.visible===!1&&(A.visible=!1),this.toneMapped===!1&&(A.toneMapped=!1),this.fog===!1&&(A.fog=!1),Object.keys(this.userData).length>0&&(A.userData=this.userData);function i(r){const s=[];for(const a in r){const o=r[a];delete o.metadata,s.push(o)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(A.textures=r),s.length>0&&(A.images=s)}return A}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let A=null;if(t!==null){const i=t.length;A=new Array(i);for(let r=0;r!==i;++r)A[r]=t[r].clone()}return this.clippingPlanes=A,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class mi extends Mi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=Cp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const It=new I,Vs=new Ue;class qt{constructor(e,t,A=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=A,this.usage=If,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return rs("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,A){e*=this.itemSize,A*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[A+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,A=this.count;t<A;t++)Vs.fromBufferAttribute(this,t),Vs.applyMatrix3(e),this.setXY(t,Vs.x,Vs.y);else if(this.itemSize===3)for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let A=this.array[e*this.itemSize+t];return this.normalized&&(A=Lr(A,this.array)),A}setComponent(e,t,A){return this.normalized&&(A=hA(A,this.array)),this.array[e*this.itemSize+t]=A,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Lr(t,this.array)),t}setX(e,t){return this.normalized&&(t=hA(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Lr(t,this.array)),t}setY(e,t){return this.normalized&&(t=hA(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Lr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=hA(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Lr(t,this.array)),t}setW(e,t){return this.normalized&&(t=hA(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,A){return e*=this.itemSize,this.normalized&&(t=hA(t,this.array),A=hA(A,this.array)),this.array[e+0]=t,this.array[e+1]=A,this}setXYZ(e,t,A,i){return e*=this.itemSize,this.normalized&&(t=hA(t,this.array),A=hA(A,this.array),i=hA(i,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this}setXYZW(e,t,A,i,r){return e*=this.itemSize,this.normalized&&(t=hA(t,this.array),A=hA(A,this.array),i=hA(i,this.array),r=hA(r,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==If&&(e.usage=this.usage),e}}class Hp extends qt{constructor(e,t,A){super(new Uint16Array(e),t,A)}}class Np extends qt{constructor(e,t,A){super(new Uint32Array(e),t,A)}}class oA extends qt{constructor(e,t,A){super(new Float32Array(e),t,A)}}let sB=0;const bA=new ut,xl=new aA,ki=new I,vA=new Es,Nr=new Es,Nt=new I;class kt extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sB++}),this.uuid=_s(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lp(e)?Np:Hp)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,A=0){this.groups.push({start:e,count:t,materialIndex:A})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const A=this.attributes.normal;if(A!==void 0){const r=new We().getNormalMatrix(e);A.applyNormalMatrix(r),A.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return bA.makeRotationFromQuaternion(e),this.applyMatrix4(bA),this}rotateX(e){return bA.makeRotationX(e),this.applyMatrix4(bA),this}rotateY(e){return bA.makeRotationY(e),this.applyMatrix4(bA),this}rotateZ(e){return bA.makeRotationZ(e),this.applyMatrix4(bA),this}translate(e,t,A){return bA.makeTranslation(e,t,A),this.applyMatrix4(bA),this}scale(e,t,A){return bA.makeScale(e,t,A),this.applyMatrix4(bA),this}lookAt(e){return xl.lookAt(e),xl.updateMatrix(),this.applyMatrix4(xl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(e){const t=[];for(let A=0,i=e.length;A<i;A++){const r=e[A];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new oA(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let A=0,i=t.length;A<i;A++){const r=t[A];vA.setFromBufferAttribute(r),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,vA.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,vA.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(vA.min),this.boundingBox.expandByPoint(vA.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const A=this.boundingSphere.center;if(vA.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];Nr.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(vA.min,Nr.min),vA.expandByPoint(Nt),Nt.addVectors(vA.max,Nr.max),vA.expandByPoint(Nt)):(vA.expandByPoint(Nr.min),vA.expandByPoint(Nr.max))}vA.getCenter(A);let i=0;for(let r=0,s=e.count;r<s;r++)Nt.fromBufferAttribute(e,r),i=Math.max(i,A.distanceToSquared(Nt));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++)Nt.fromBufferAttribute(a,l),o&&(ki.fromBufferAttribute(e,l),Nt.add(ki)),i=Math.max(i,A.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const A=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qt(new Float32Array(4*A.count),4));const s=this.getAttribute("tangent"),a=[],o=[];for(let R=0;R<A.count;R++)a[R]=new I,o[R]=new I;const l=new I,c=new I,u=new I,f=new Ue,p=new Ue,g=new Ue,m=new I,d=new I;function h(R,E,C){l.fromBufferAttribute(A,R),c.fromBufferAttribute(A,E),u.fromBufferAttribute(A,C),f.fromBufferAttribute(r,R),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,C),c.sub(l),u.sub(l),p.sub(f),g.sub(f);const L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(m.copy(c).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),d.copy(u).multiplyScalar(p.x).addScaledVector(c,-g.x).multiplyScalar(L),a[R].add(m),a[E].add(m),a[C].add(m),o[R].add(d),o[E].add(d),o[C].add(d))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,E=v.length;R<E;++R){const C=v[R],L=C.start,W=C.count;for(let P=L,K=L+W;P<K;P+=3)h(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const w=new I,_=new I,b=new I,y=new I;function S(R){b.fromBufferAttribute(i,R),y.copy(b);const E=a[R];w.copy(E),w.sub(b.multiplyScalar(b.dot(E))).normalize(),_.crossVectors(y,E);const L=_.dot(o[R])<0?-1:1;s.setXYZW(R,w.x,w.y,w.z,L)}for(let R=0,E=v.length;R<E;++R){const C=v[R],L=C.start,W=C.count;for(let P=L,K=L+W;P<K;P+=3)S(e.getX(P+0)),S(e.getX(P+1)),S(e.getX(P+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let A=this.getAttribute("normal");if(A===void 0)A=new qt(new Float32Array(t.count*3),3),this.setAttribute("normal",A);else for(let f=0,p=A.count;f<p;f++)A.setXYZ(f,0,0,0);const i=new I,r=new I,s=new I,a=new I,o=new I,l=new I,c=new I,u=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),m=e.getX(f+1),d=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,d),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),a.fromBufferAttribute(A,g),o.fromBufferAttribute(A,m),l.fromBufferAttribute(A,d),a.add(c),o.add(c),l.add(c),A.setXYZ(g,a.x,a.y,a.z),A.setXYZ(m,o.x,o.y,o.z),A.setXYZ(d,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),A.setXYZ(f+0,c.x,c.y,c.z),A.setXYZ(f+1,c.x,c.y,c.z),A.setXYZ(f+2,c.x,c.y,c.z);this.normalizeNormals(),A.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,A=e.count;t<A;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,o){const l=a.array,c=a.itemSize,u=a.normalized,f=new l.constructor(o.length*c);let p=0,g=0;for(let m=0,d=o.length;m<d;m++){a.isInterleavedBufferAttribute?p=o[m]*a.data.stride+a.offset:p=o[m]*c;for(let h=0;h<c;h++)f[g++]=l[p++]}return new qt(f,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kt,A=this.index.array,i=this.attributes;for(const a in i){const o=i[a],l=e(o,A);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const o=[],l=r[a];for(let c=0,u=l.length;c<u;c++){const f=l[c],p=e(f,A);o.push(p)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,o=s.length;a<o;a++){const l=s[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const o=this.parameters;for(const l in o)o[l]!==void 0&&(e[l]=o[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const A=this.attributes;for(const o in A){const l=A[o];e.data.attributes[o]=l.toJSON(e.data)}const i={};let r=!1;for(const o in this.morphAttributes){const l=this.morphAttributes[o],c=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];c.push(p.toJSON(e.data))}c.length>0&&(i[o]=c,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const A=e.index;A!==null&&this.setIndex(A.clone(t));const i=e.attributes;for(const l in i){const c=i[l];this.setAttribute(l,c.clone(t))}const r=e.morphAttributes;for(const l in r){const c=[],u=r[l];for(let f=0,p=u.length;f<p;f++)c.push(u[f].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let l=0,c=s.length;l<c;l++){const u=s[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Kf=new ut,ii=new Us,ks=new ys,Wf=new I,zi=new I,Ki=new I,Wi=new I,_l=new I,zs=new I,Ks=new Ue,Ws=new Ue,Xs=new Ue,Xf=new I,Yf=new I,Jf=new I,Ys=new I,Js=new I;class xt extends aA{constructor(e=new kt,t=new mi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const A=this.geometry,i=A.attributes.position,r=A.morphAttributes.position,s=A.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){zs.set(0,0,0);for(let o=0,l=r.length;o<l;o++){const c=a[o],u=r[o];c!==0&&(_l.fromBufferAttribute(u,e),s?zs.addScaledVector(_l,c):zs.addScaledVector(_l.sub(t),c))}t.add(zs)}return t}raycast(e,t){const A=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(A.boundingSphere===null&&A.computeBoundingSphere(),ks.copy(A.boundingSphere),ks.applyMatrix4(r),ii.copy(e.ray).recast(e.near),!(ks.containsPoint(ii.origin)===!1&&(ii.intersectSphere(ks,Wf)===null||ii.origin.distanceToSquared(Wf)>(e.far-e.near)**2))&&(Kf.copy(r).invert(),ii.copy(e.ray).applyMatrix4(Kf),!(A.boundingBox!==null&&ii.intersectsBox(A.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,A){let i;const r=this.geometry,s=this.material,a=r.index,o=r.attributes.position,l=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],v=Math.max(d.start,p.start),w=Math.min(a.count,Math.min(d.start+d.count,p.start+p.count));for(let _=v,b=w;_<b;_+=3){const y=a.getX(_),S=a.getX(_+1),R=a.getX(_+2);i=Zs(this,h,e,A,l,c,u,y,S,R),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(a.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const v=a.getX(d),w=a.getX(d+1),_=a.getX(d+2);i=Zs(this,s,e,A,l,c,u,v,w,_),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],v=Math.max(d.start,p.start),w=Math.min(o.count,Math.min(d.start+d.count,p.start+p.count));for(let _=v,b=w;_<b;_+=3){const y=_,S=_+1,R=_+2;i=Zs(this,h,e,A,l,c,u,y,S,R),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(o.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const v=d,w=d+1,_=d+2;i=Zs(this,s,e,A,l,c,u,v,w,_),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}}}function aB(n,e,t,A,i,r,s,a){let o;if(e.side===$t?o=A.intersectTriangle(s,r,i,!0,a):o=A.intersectTriangle(i,r,s,e.side===Zn,a),o===null)return null;Js.copy(a),Js.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Js);return l<t.near||l>t.far?null:{distance:l,point:Js.clone(),object:n}}function Zs(n,e,t,A,i,r,s,a,o,l){n.getVertexPosition(a,zi),n.getVertexPosition(o,Ki),n.getVertexPosition(l,Wi);const c=aB(n,e,t,A,zi,Ki,Wi,Ys);if(c){i&&(Ks.fromBufferAttribute(i,a),Ws.fromBufferAttribute(i,o),Xs.fromBufferAttribute(i,l),c.uv=en.getInterpolation(Ys,zi,Ki,Wi,Ks,Ws,Xs,new Ue)),r&&(Ks.fromBufferAttribute(r,a),Ws.fromBufferAttribute(r,o),Xs.fromBufferAttribute(r,l),c.uv1=en.getInterpolation(Ys,zi,Ki,Wi,Ks,Ws,Xs,new Ue)),s&&(Xf.fromBufferAttribute(s,a),Yf.fromBufferAttribute(s,o),Jf.fromBufferAttribute(s,l),c.normal=en.getInterpolation(Ys,zi,Ki,Wi,Xf,Yf,Jf,new I),c.normal.dot(A.direction)>0&&c.normal.multiplyScalar(-1));const u={a,b:o,c:l,normal:new I,materialIndex:0};en.getNormal(zi,Ki,Wi,u.normal),c.face=u}return c}class bi extends kt{constructor(e=1,t=1,A=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:A,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const o=[],l=[],c=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,A,t,e,s,r,0),g("z","y","x",1,-1,A,t,-e,s,r,1),g("x","z","y",1,1,e,A,t,i,s,2),g("x","z","y",1,-1,e,A,-t,i,s,3),g("x","y","z",1,-1,e,t,A,i,r,4),g("x","y","z",-1,-1,e,t,-A,i,r,5),this.setIndex(o),this.setAttribute("position",new oA(l,3)),this.setAttribute("normal",new oA(c,3)),this.setAttribute("uv",new oA(u,2));function g(m,d,h,v,w,_,b,y,S,R,E){const C=_/S,L=b/R,W=_/2,P=b/2,K=y/2,Z=S+1,V=R+1;let q=0,X=0;const re=new I;for(let ae=0;ae<V;ae++){const he=ae*L-P;for(let Ie=0;Ie<Z;Ie++){const Oe=Ie*C-W;re[m]=Oe*v,re[d]=he*w,re[h]=K,l.push(re.x,re.y,re.z),re[m]=0,re[d]=0,re[h]=y>0?1:-1,c.push(re.x,re.y,re.z),u.push(Ie/S),u.push(1-ae/R),q+=1}}for(let ae=0;ae<R;ae++)for(let he=0;he<S;he++){const Ie=f+he+Z*ae,Oe=f+he+Z*(ae+1),J=f+(he+1)+Z*(ae+1),$=f+(he+1)+Z*ae;o.push(Ie,Oe,$),o.push(Oe,J,$),X+=6}a.addGroup(p,X,E),p+=X,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Sr(n){const e={};for(const t in n){e[t]={};for(const A in n[t]){const i=n[t][A];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][A]=null):e[t][A]=i.clone():Array.isArray(i)?e[t][A]=i.slice():e[t][A]=i}}return e}function lA(n){const e={};for(let t=0;t<n.length;t++){const A=Sr(n[t]);for(const i in A)e[i]=A[i]}return e}function oB(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Op(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const Gp={clone:Sr,merge:lA};var lB=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cB=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends Mi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lB,this.fragmentShader=cB,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Sr(e.uniforms),this.uniformsGroups=oB(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const A={};for(const i in this.extensions)this.extensions[i]===!0&&(A[i]=!0);return Object.keys(A).length>0&&(t.extensions=A),t}}class Vp extends aA{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=Cn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new I,Zf=new Ue,qf=new Ue;class EA extends Vp{constructor(e=50,t=1,A=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=A,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Zc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(za*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zc*2*Math.atan(Math.tan(za*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,A){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),A.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,Zf,qf),t.subVectors(qf,Zf)}setViewOffset(e,t,A,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(za*.5*this.fov)/this.zoom,A=2*t,i=this.aspect*A,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const o=s.fullWidth,l=s.fullHeight;r+=s.offsetX*i/o,t-=s.offsetY*A/l,i*=s.width/o,A*=s.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-A,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Xi=-90,Yi=1;class uB extends aA{constructor(e,t,A){super(),this.type="CubeCamera",this.renderTarget=A,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new EA(Xi,Yi,e,t);i.layers=this.layers,this.add(i);const r=new EA(Xi,Yi,e,t);r.layers=this.layers,this.add(r);const s=new EA(Xi,Yi,e,t);s.layers=this.layers,this.add(s);const a=new EA(Xi,Yi,e,t);a.layers=this.layers,this.add(a);const o=new EA(Xi,Yi,e,t);o.layers=this.layers,this.add(o);const l=new EA(Xi,Yi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[A,i,r,s,a,o]=t;for(const l of t)this.remove(l);if(e===Cn)A.up.set(0,1,0),A.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===so)A.up.set(0,-1,0),A.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:A,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,o,l,c]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const m=A.texture.generateMipmaps;A.texture.generateMipmaps=!1,e.setRenderTarget(A,0,i),e.render(t,r),e.setRenderTarget(A,1,i),e.render(t,s),e.setRenderTarget(A,2,i),e.render(t,a),e.setRenderTarget(A,3,i),e.render(t,o),e.setRenderTarget(A,4,i),e.render(t,l),A.texture.generateMipmaps=m,e.setRenderTarget(A,5,i),e.render(t,c),e.setRenderTarget(u,f,p),e.xr.enabled=g,A.texture.needsPMREMUpdate=!0}}class kp extends fA{constructor(e,t,A,i,r,s,a,o,l,c){e=e!==void 0?e:[],t=t!==void 0?t:_r,super(e,t,A,i,r,s,a,o,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fB extends qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const A={width:e,height:e,depth:1},i=[A,A,A,A,A,A];this.texture=new kp(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Jt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const A={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new bi(5,5,5),r=new Vt({name:"CubemapFromEquirect",uniforms:Sr(A.uniforms),vertexShader:A.vertexShader,fragmentShader:A.fragmentShader,side:$t,blending:xn});r.uniforms.tEquirect.value=t;const s=new xt(i,r),a=t.minFilter;return t.minFilter===hi&&(t.minFilter=Jt),new uB(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,A,i){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,A,i);e.setRenderTarget(r)}}const El=new I,hB=new I,dB=new We;class Dn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,A,i){return this.normal.set(e,t,A),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,A){const i=El.subVectors(A,t).cross(hB.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const A=e.delta(El),i=this.normal.dot(A);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(A,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),A=this.distanceToPoint(e.end);return t<0&&A>0||A<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const A=t||dB.getNormalMatrix(e),i=this.coplanarPoint(El).applyMatrix4(e),r=this.normal.applyMatrix3(A).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new ys,qs=new I;class qu{constructor(e=new Dn,t=new Dn,A=new Dn,i=new Dn,r=new Dn,s=new Dn){this.planes=[e,t,A,i,r,s]}set(e,t,A,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(A),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let A=0;A<6;A++)t[A].copy(e.planes[A]);return this}setFromProjectionMatrix(e,t=Cn){const A=this.planes,i=e.elements,r=i[0],s=i[1],a=i[2],o=i[3],l=i[4],c=i[5],u=i[6],f=i[7],p=i[8],g=i[9],m=i[10],d=i[11],h=i[12],v=i[13],w=i[14],_=i[15];if(A[0].setComponents(o-r,f-l,d-p,_-h).normalize(),A[1].setComponents(o+r,f+l,d+p,_+h).normalize(),A[2].setComponents(o+s,f+c,d+g,_+v).normalize(),A[3].setComponents(o-s,f-c,d-g,_-v).normalize(),A[4].setComponents(o-a,f-u,d-m,_-w).normalize(),t===Cn)A[5].setComponents(o+a,f+u,d+m,_+w).normalize();else if(t===so)A[5].setComponents(a,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){return ri.center.set(0,0,0),ri.radius=.7071067811865476,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,A=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(A)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let A=0;A<6;A++){const i=t[A];if(qs.x=i.normal.x>0?e.max.x:e.min.x,qs.y=i.normal.y>0?e.max.y:e.min.y,qs.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(qs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let A=0;A<6;A++)if(t[A].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function zp(){let n=null,e=!1,t=null,A=null;function i(r,s){t(r,s),A=n.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(A=n.requestAnimationFrame(i),e=!0)},stop:function(){n.cancelAnimationFrame(A),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function pB(n){const e=new WeakMap;function t(a,o){const l=a.array,c=a.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(o,f),n.bufferData(o,l,c),a.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function A(a,o,l){const c=o.array,u=o._updateRange,f=o.updateRanges;if(n.bindBuffer(l,a),u.count===-1&&f.length===0&&n.bufferSubData(l,0,c),f.length!==0){for(let p=0,g=f.length;p<g;p++){const m=f[p];n.bufferSubData(l,m.start*c.BYTES_PER_ELEMENT,c,m.start,m.count)}o.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(l,u.offset*c.BYTES_PER_ELEMENT,c,u.offset,u.count),u.count=-1),o.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const o=e.get(a);o&&(n.deleteBuffer(o.buffer),e.delete(a))}function s(a,o){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const c=e.get(a);(!c||c.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,o));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");A(l.buffer,a,o),l.version=a.version}}return{get:i,remove:r,update:s}}class jn extends kt{constructor(e=1,t=1,A=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:A,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(A),o=Math.floor(i),l=a+1,c=o+1,u=e/a,f=t/o,p=[],g=[],m=[],d=[];for(let h=0;h<c;h++){const v=h*f-s;for(let w=0;w<l;w++){const _=w*u-r;g.push(_,-v,0),m.push(0,0,1),d.push(w/a),d.push(1-h/o)}}for(let h=0;h<o;h++)for(let v=0;v<a;v++){const w=v+l*h,_=v+l*(h+1),b=v+1+l*(h+1),y=v+1+l*h;p.push(w,_,y),p.push(_,b,y)}this.setIndex(p),this.setAttribute("position",new oA(g,3)),this.setAttribute("normal",new oA(m,3)),this.setAttribute("uv",new oA(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jn(e.width,e.height,e.widthSegments,e.heightSegments)}}var gB=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mB=`#ifdef USE_ALPHAHASH
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
#endif`,BB=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vB=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wB=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,CB=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xB=`#ifdef USE_AOMAP
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
#endif`,_B=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,EB=`#ifdef USE_BATCHING
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
#endif`,yB=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,UB=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,SB=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,MB=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bB=`#ifdef USE_IRIDESCENCE
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
#endif`,FB=`#ifdef USE_BUMPMAP
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
#endif`,TB=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,IB=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,QB=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,LB=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,RB=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,DB=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,PB=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,HB=`#if defined( USE_COLOR_ALPHA )
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
#endif`,NB=`#define PI 3.141592653589793
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
} // validated`,OB=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,GB=`vec3 transformedNormal = objectNormal;
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
#endif`,VB=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kB=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zB=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,KB=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,WB="gl_FragColor = linearToOutputTexel( gl_FragColor );",XB=`
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
}`,YB=`#ifdef USE_ENVMAP
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
#endif`,JB=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ZB=`#ifdef USE_ENVMAP
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
#endif`,qB=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jB=`#ifdef USE_ENVMAP
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
#endif`,$B=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ev=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Av=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nv=`#ifdef USE_GRADIENTMAP
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
}`,iv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,rv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,av=`uniform bool receiveShadow;
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
#endif`,ov=`#ifdef USE_ENVMAP
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
#endif`,lv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,uv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hv=`PhysicalMaterial material;
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
#endif`,dv=`struct PhysicalMaterial {
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
}`,pv=`
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
#endif`,gv=`#if defined( RE_IndirectDiffuse )
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
#endif`,mv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_v=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ev=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yv=`#if defined( USE_POINTS_UV )
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
#endif`,Uv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Fv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`#ifdef USE_MORPHTARGETS
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
#endif`,Iv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hv=`#ifdef USE_NORMALMAP
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
#endif`,Nv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ov=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Kv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$v=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ew=`float getShadowMask() {
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
}`,tw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Aw=`#ifdef USE_SKINNING
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
#endif`,nw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,iw=`#ifdef USE_SKINNING
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
#endif`,rw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,aw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ow=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,lw=`#ifdef USE_TRANSMISSION
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
#endif`,cw=`#ifdef USE_TRANSMISSION
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
#endif`,uw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gw=`uniform sampler2D t2D;
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
}`,mw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,vw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ww=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cw=`#include <common>
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
}`,xw=`#if DEPTH_PACKING == 3200
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
}`,_w=`#define DISTANCE
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
}`,Ew=`#define DISTANCE
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
}`,yw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Uw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sw=`uniform float scale;
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
}`,Mw=`uniform vec3 diffuse;
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
}`,bw=`#include <common>
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
}`,Fw=`uniform vec3 diffuse;
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
}`,Tw=`#define LAMBERT
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
}`,Iw=`#define LAMBERT
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
}`,Qw=`#define MATCAP
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
}`,Lw=`#define MATCAP
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
}`,Rw=`#define NORMAL
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
}`,Dw=`#define NORMAL
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
}`,Pw=`#define PHONG
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
}`,Hw=`#define PHONG
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
}`,Nw=`#define STANDARD
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
}`,Ow=`#define STANDARD
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
}`,Gw=`#define TOON
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
}`,Vw=`#define TOON
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
}`,kw=`uniform float size;
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
}`,zw=`uniform vec3 diffuse;
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
}`,Kw=`#include <common>
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
}`,Ww=`uniform vec3 color;
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
}`,Xw=`uniform float rotation;
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
}`,Yw=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:gB,alphahash_pars_fragment:mB,alphamap_fragment:BB,alphamap_pars_fragment:vB,alphatest_fragment:wB,alphatest_pars_fragment:CB,aomap_fragment:xB,aomap_pars_fragment:_B,batching_pars_vertex:EB,batching_vertex:yB,begin_vertex:UB,beginnormal_vertex:SB,bsdfs:MB,iridescence_fragment:bB,bumpmap_pars_fragment:FB,clipping_planes_fragment:TB,clipping_planes_pars_fragment:IB,clipping_planes_pars_vertex:QB,clipping_planes_vertex:LB,color_fragment:RB,color_pars_fragment:DB,color_pars_vertex:PB,color_vertex:HB,common:NB,cube_uv_reflection_fragment:OB,defaultnormal_vertex:GB,displacementmap_pars_vertex:VB,displacementmap_vertex:kB,emissivemap_fragment:zB,emissivemap_pars_fragment:KB,colorspace_fragment:WB,colorspace_pars_fragment:XB,envmap_fragment:YB,envmap_common_pars_fragment:JB,envmap_pars_fragment:ZB,envmap_pars_vertex:qB,envmap_physical_pars_fragment:ov,envmap_vertex:jB,fog_vertex:$B,fog_pars_vertex:ev,fog_fragment:tv,fog_pars_fragment:Av,gradientmap_pars_fragment:nv,lightmap_pars_fragment:iv,lights_lambert_fragment:rv,lights_lambert_pars_fragment:sv,lights_pars_begin:av,lights_toon_fragment:lv,lights_toon_pars_fragment:cv,lights_phong_fragment:uv,lights_phong_pars_fragment:fv,lights_physical_fragment:hv,lights_physical_pars_fragment:dv,lights_fragment_begin:pv,lights_fragment_maps:gv,lights_fragment_end:mv,logdepthbuf_fragment:Bv,logdepthbuf_pars_fragment:vv,logdepthbuf_pars_vertex:wv,logdepthbuf_vertex:Cv,map_fragment:xv,map_pars_fragment:_v,map_particle_fragment:Ev,map_particle_pars_fragment:yv,metalnessmap_fragment:Uv,metalnessmap_pars_fragment:Sv,morphinstance_vertex:Mv,morphcolor_vertex:bv,morphnormal_vertex:Fv,morphtarget_pars_vertex:Tv,morphtarget_vertex:Iv,normal_fragment_begin:Qv,normal_fragment_maps:Lv,normal_pars_fragment:Rv,normal_pars_vertex:Dv,normal_vertex:Pv,normalmap_pars_fragment:Hv,clearcoat_normal_fragment_begin:Nv,clearcoat_normal_fragment_maps:Ov,clearcoat_pars_fragment:Gv,iridescence_pars_fragment:Vv,opaque_fragment:kv,packing:zv,premultiplied_alpha_fragment:Kv,project_vertex:Wv,dithering_fragment:Xv,dithering_pars_fragment:Yv,roughnessmap_fragment:Jv,roughnessmap_pars_fragment:Zv,shadowmap_pars_fragment:qv,shadowmap_pars_vertex:jv,shadowmap_vertex:$v,shadowmask_pars_fragment:ew,skinbase_vertex:tw,skinning_pars_vertex:Aw,skinning_vertex:nw,skinnormal_vertex:iw,specularmap_fragment:rw,specularmap_pars_fragment:sw,tonemapping_fragment:aw,tonemapping_pars_fragment:ow,transmission_fragment:lw,transmission_pars_fragment:cw,uv_pars_fragment:uw,uv_pars_vertex:fw,uv_vertex:hw,worldpos_vertex:dw,background_vert:pw,background_frag:gw,backgroundCube_vert:mw,backgroundCube_frag:Bw,cube_vert:vw,cube_frag:ww,depth_vert:Cw,depth_frag:xw,distanceRGBA_vert:_w,distanceRGBA_frag:Ew,equirect_vert:yw,equirect_frag:Uw,linedashed_vert:Sw,linedashed_frag:Mw,meshbasic_vert:bw,meshbasic_frag:Fw,meshlambert_vert:Tw,meshlambert_frag:Iw,meshmatcap_vert:Qw,meshmatcap_frag:Lw,meshnormal_vert:Rw,meshnormal_frag:Dw,meshphong_vert:Pw,meshphong_frag:Hw,meshphysical_vert:Nw,meshphysical_frag:Ow,meshtoon_vert:Gw,meshtoon_frag:Vw,points_vert:kw,points_frag:zw,shadow_vert:Kw,shadow_frag:Ww,sprite_vert:Xw,sprite_frag:Yw},le={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},$A={basic:{uniforms:lA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:lA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:lA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:lA([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:lA([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:lA([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:lA([le.points,le.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:lA([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:lA([le.common,le.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:lA([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:lA([le.sprite,le.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distanceRGBA:{uniforms:lA([le.common,le.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distanceRGBA_vert,fragmentShader:Ke.distanceRGBA_frag},shadow:{uniforms:lA([le.lights,le.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};$A.physical={uniforms:lA([$A.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const js={r:0,b:0,g:0},si=new rn,Jw=new ut;function Zw(n,e,t,A,i,r,s){const a=new ze(0);let o=r===!0?0:1,l,c,u=null,f=0,p=null;function g(v){let w=v.isScene===!0?v.background:null;return w&&w.isTexture&&(w=(v.backgroundBlurriness>0?t:e).get(w)),w}function m(v){let w=!1;const _=g(v);_===null?h(a,o):_&&_.isColor&&(h(_,1),w=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?A.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&A.buffers.color.setClear(0,0,0,0,s),(n.autoClear||w)&&(A.buffers.depth.setTest(!0),A.buffers.depth.setMask(!0),A.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function d(v,w){const _=g(w);_&&(_.isCubeTexture||_.mapping===Do)?(c===void 0&&(c=new xt(new bi(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:Sr($A.backgroundCube.uniforms),vertexShader:$A.backgroundCube.vertexShader,fragmentShader:$A.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,y,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),si.copy(w.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),c.material.uniforms.envMap.value=_,c.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Jw.makeRotationFromEuler(si)),c.material.toneMapped=ot.getTransfer(_.colorSpace)!==gt,(u!==_||f!==_.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=_,f=_.version,p=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new xt(new jn(2,2),new Vt({name:"BackgroundMaterial",uniforms:Sr($A.background.uniforms),vertexShader:$A.background.vertexShader,fragmentShader:$A.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ot.getTransfer(_.colorSpace)!==gt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||f!==_.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=_,f=_.version,p=n.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function h(v,w){v.getRGB(js,Op(n)),A.buffers.color.setClear(js.r,js.g,js.b,w,s)}return{getClearColor:function(){return a},setClearColor:function(v,w=1){a.set(v),o=w,h(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,h(a,o)},render:m,addToRenderList:d}}function qw(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),A={},i=f(null);let r=i,s=!1;function a(C,L,W,P,K){let Z=!1;const V=u(P,W,L);r!==V&&(r=V,l(r.object)),Z=p(C,P,W,K),Z&&g(C,P,W,K),K!==null&&e.update(K,n.ELEMENT_ARRAY_BUFFER),(Z||s)&&(s=!1,_(C,L,W,P),K!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function o(){return n.createVertexArray()}function l(C){return n.bindVertexArray(C)}function c(C){return n.deleteVertexArray(C)}function u(C,L,W){const P=W.wireframe===!0;let K=A[C.id];K===void 0&&(K={},A[C.id]=K);let Z=K[L.id];Z===void 0&&(Z={},K[L.id]=Z);let V=Z[P];return V===void 0&&(V=f(o()),Z[P]=V),V}function f(C){const L=[],W=[],P=[];for(let K=0;K<t;K++)L[K]=0,W[K]=0,P[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:W,attributeDivisors:P,object:C,attributes:{},index:null}}function p(C,L,W,P){const K=r.attributes,Z=L.attributes;let V=0;const q=W.getAttributes();for(const X in q)if(q[X].location>=0){const ae=K[X];let he=Z[X];if(he===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(he=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(he=C.instanceColor)),ae===void 0||ae.attribute!==he||he&&ae.data!==he.data)return!0;V++}return r.attributesNum!==V||r.index!==P}function g(C,L,W,P){const K={},Z=L.attributes;let V=0;const q=W.getAttributes();for(const X in q)if(q[X].location>=0){let ae=Z[X];ae===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(ae=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(ae=C.instanceColor));const he={};he.attribute=ae,ae&&ae.data&&(he.data=ae.data),K[X]=he,V++}r.attributes=K,r.attributesNum=V,r.index=P}function m(){const C=r.newAttributes;for(let L=0,W=C.length;L<W;L++)C[L]=0}function d(C){h(C,0)}function h(C,L){const W=r.newAttributes,P=r.enabledAttributes,K=r.attributeDivisors;W[C]=1,P[C]===0&&(n.enableVertexAttribArray(C),P[C]=1),K[C]!==L&&(n.vertexAttribDivisor(C,L),K[C]=L)}function v(){const C=r.newAttributes,L=r.enabledAttributes;for(let W=0,P=L.length;W<P;W++)L[W]!==C[W]&&(n.disableVertexAttribArray(W),L[W]=0)}function w(C,L,W,P,K,Z,V){V===!0?n.vertexAttribIPointer(C,L,W,K,Z):n.vertexAttribPointer(C,L,W,P,K,Z)}function _(C,L,W,P){m();const K=P.attributes,Z=W.getAttributes(),V=L.defaultAttributeValues;for(const q in Z){const X=Z[q];if(X.location>=0){let re=K[q];if(re===void 0&&(q==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),q==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),re!==void 0){const ae=re.normalized,he=re.itemSize,Ie=e.get(re);if(Ie===void 0)continue;const Oe=Ie.buffer,J=Ie.type,$=Ie.bytesPerElement,ue=J===n.INT||J===n.UNSIGNED_INT||re.gpuType===Vu;if(re.isInterleavedBufferAttribute){const ce=re.data,Me=ce.stride,Fe=re.offset;if(ce.isInstancedInterleavedBuffer){for(let Ge=0;Ge<X.locationSize;Ge++)h(X.location+Ge,ce.meshPerAttribute);C.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ge=0;Ge<X.locationSize;Ge++)d(X.location+Ge);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let Ge=0;Ge<X.locationSize;Ge++)w(X.location+Ge,he/X.locationSize,J,ae,Me*$,(Fe+he/X.locationSize*Ge)*$,ue)}else{if(re.isInstancedBufferAttribute){for(let ce=0;ce<X.locationSize;ce++)h(X.location+ce,re.meshPerAttribute);C.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ce=0;ce<X.locationSize;ce++)d(X.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let ce=0;ce<X.locationSize;ce++)w(X.location+ce,he/X.locationSize,J,ae,he*$,he/X.locationSize*ce*$,ue)}}else if(V!==void 0){const ae=V[q];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(X.location,ae);break;case 3:n.vertexAttrib3fv(X.location,ae);break;case 4:n.vertexAttrib4fv(X.location,ae);break;default:n.vertexAttrib1fv(X.location,ae)}}}}v()}function b(){R();for(const C in A){const L=A[C];for(const W in L){const P=L[W];for(const K in P)c(P[K].object),delete P[K];delete L[W]}delete A[C]}}function y(C){if(A[C.id]===void 0)return;const L=A[C.id];for(const W in L){const P=L[W];for(const K in P)c(P[K].object),delete P[K];delete L[W]}delete A[C.id]}function S(C){for(const L in A){const W=A[L];if(W[C.id]===void 0)continue;const P=W[C.id];for(const K in P)c(P[K].object),delete P[K];delete W[C.id]}}function R(){E(),s=!0,r!==i&&(r=i,l(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:E,dispose:b,releaseStatesOfGeometry:y,releaseStatesOfProgram:S,initAttributes:m,enableAttribute:d,disableUnusedAttributes:v}}function jw(n,e,t){let A;function i(l){A=l}function r(l,c){n.drawArrays(A,l,c),t.update(c,A,1)}function s(l,c,u){u!==0&&(n.drawArraysInstanced(A,l,c,u),t.update(c,A,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(A,l,0,c,0,u);let p=0;for(let g=0;g<u;g++)p+=c[g];t.update(p,A,1)}function o(l,c,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)s(l[g],c[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(A,l,0,c,0,f,0,u);let g=0;for(let m=0;m<u;m++)g+=c[m];for(let m=0;m<f.length;m++)t.update(g,A,f[m])}}this.setMode=i,this.render=r,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=o}function $w(n,e,t,A){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(y){return!(y!==WA&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){const S=y===Fr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==YA&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==wn&&!S)}function o(y){if(y==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const c=o(l);c!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",c,"instead."),l=c);const u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),h=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),_=p>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:o,textureFormatReadable:s,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:h,maxVaryings:v,maxFragmentUniforms:w,vertexTextures:_,maxSamples:b}}function eC(n){const e=this;let t=null,A=0,i=!1,r=!1;const s=new Dn,a=new We,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||A!==0||i;return i=f,A=u.length,p},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=c(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,m=u.clipIntersection,d=u.clipShadows,h=n.get(u);if(!i||g===null||g.length===0||r&&!d)r?c(null):l();else{const v=r?0:A,w=v*4;let _=h.clippingState||null;o.value=_,_=c(g,f,w,p);for(let b=0;b!==w;++b)_[b]=t[b];h.clippingState=_,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=v}};function l(){o.value!==t&&(o.value=t,o.needsUpdate=A>0),e.numPlanes=A,e.numIntersection=0}function c(u,f,p,g){const m=u!==null?u.length:0;let d=null;if(m!==0){if(d=o.value,g!==!0||d===null){const h=p+m*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(d===null||d.length<h)&&(d=new Float32Array(h));for(let w=0,_=p;w!==m;++w,_+=4)s.copy(u[w]).applyMatrix4(v,a),s.normal.toArray(d,_),d[_+3]=s.constant}o.value=d,o.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,d}}function tC(n){let e=new WeakMap;function t(s,a){return a===wc?s.mapping=_r:a===Cc&&(s.mapping=Er),s}function A(s){if(s&&s.isTexture){const a=s.mapping;if(a===wc||a===Cc)if(e.has(s)){const o=e.get(s).texture;return t(o,s.mapping)}else{const o=s.image;if(o&&o.height>0){const l=new fB(o.height);return l.fromEquirectangularTexture(n,s),e.set(s,l),s.addEventListener("dispose",i),t(l.texture,s.mapping)}else return null}}return s}function i(s){const a=s.target;a.removeEventListener("dispose",i);const o=e.get(a);o!==void 0&&(e.delete(a),o.dispose())}function r(){e=new WeakMap}return{get:A,dispose:r}}class Kp extends Vp{constructor(e=-1,t=1,A=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=A,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,A,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),A=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=A-e,s=A+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,s=r+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const or=4,jf=[.125,.215,.35,.446,.526,.582],ui=20,yl=new Kp,$f=new ze;let Ul=null,Sl=0,Ml=0,bl=!1;const li=(1+Math.sqrt(5))/2,Ji=1/li,eh=[new I(-li,Ji,0),new I(li,Ji,0),new I(-Ji,0,li),new I(Ji,0,li),new I(0,li,-Ji),new I(0,li,Ji),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class th{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,A=.1,i=100){Ul=this._renderer.getRenderTarget(),Sl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel(),bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,A,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ul,Sl,Ml),this._renderer.xr.enabled=bl,e.scissorTest=!1,$s(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_r||e.mapping===Er?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ul=this._renderer.getRenderTarget(),Sl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel(),bl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const A=t||this._allocateTargets();return this._textureToCubeUV(e,A),this._applyPMREM(A),this._cleanup(A),A}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,A={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:Fr,format:WA,colorSpace:ei,depthBuffer:!1},i=Ah(e,t,A);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ah(e,t,A);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=AC(r)),this._blurMaterial=nC(r,e,t)}return i}_compileMaterial(e){const t=new xt(this._lodPlanes[0],e);this._renderer.compile(t,yl)}_sceneToCubeUV(e,t,A,i){const a=new EA(90,1,t,A),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,f=c.toneMapping;c.getClearColor($f),c.toneMapping=Kn,c.autoClear=!1;const p=new mi({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),g=new xt(new bi,p);let m=!1;const d=e.background;d?d.isColor&&(p.color.copy(d),e.background=null,m=!0):(p.color.copy($f),m=!0);for(let h=0;h<6;h++){const v=h%3;v===0?(a.up.set(0,o[h],0),a.lookAt(l[h],0,0)):v===1?(a.up.set(0,0,o[h]),a.lookAt(0,l[h],0)):(a.up.set(0,o[h],0),a.lookAt(0,0,l[h]));const w=this._cubeSize;$s(i,v*w,h>2?w:0,w,w),c.setRenderTarget(i),m&&c.render(g,a),c.render(e,a)}g.geometry.dispose(),g.material.dispose(),c.toneMapping=f,c.autoClear=u,e.background=d}_textureToCubeUV(e,t){const A=this._renderer,i=e.mapping===_r||e.mapping===Er;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nh());const r=i?this._cubemapMaterial:this._equirectMaterial,s=new xt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const o=this._cubeSize;$s(t,0,0,3*o,2*o),A.setRenderTarget(t),A.render(s,yl)}_applyPMREM(e){const t=this._renderer,A=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=eh[(i-r-1)%eh.length];this._blur(e,r-1,r,s,a)}t.autoClear=A}_blur(e,t,A,i,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,A,i,"latitudinal",r),this._halfBlur(s,e,A,A,i,"longitudinal",r)}_halfBlur(e,t,A,i,r,s,a){const o=this._renderer,l=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new xt(this._lodPlanes[i],l),f=l.uniforms,p=this._sizeLods[A]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ui-1),m=r/g,d=isFinite(r)?1+Math.floor(c*m):ui;d>ui&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${ui}`);const h=[];let v=0;for(let S=0;S<ui;++S){const R=S/m,E=Math.exp(-R*R/2);h.push(E),S===0?v+=E:S<d&&(v+=2*E)}for(let S=0;S<h.length;S++)h[S]=h[S]/v;f.envMap.value=e.texture,f.samples.value=d,f.weights.value=h,f.latitudinal.value=s==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-A;const _=this._sizeLods[i],b=3*_*(i>w-or?i-w+or:0),y=4*(this._cubeSize-_);$s(t,b,y,3*_,2*_),o.setRenderTarget(t),o.render(u,yl)}}function AC(n){const e=[],t=[],A=[];let i=n;const r=n-or+1+jf.length;for(let s=0;s<r;s++){const a=Math.pow(2,i);t.push(a);let o=1/a;s>n-or?o=jf[s-n+or-1]:s===0&&(o=0),A.push(o);const l=1/(a-2),c=-l,u=1+l,f=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,g=6,m=3,d=2,h=1,v=new Float32Array(m*g*p),w=new Float32Array(d*g*p),_=new Float32Array(h*g*p);for(let y=0;y<p;y++){const S=y%3*2/3-1,R=y>2?0:-1,E=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];v.set(E,m*g*y),w.set(f,d*g*y);const C=[y,y,y,y,y,y];_.set(C,h*g*y)}const b=new kt;b.setAttribute("position",new qt(v,m)),b.setAttribute("uv",new qt(w,d)),b.setAttribute("faceIndex",new qt(_,h)),e.push(b),i>or&&i--}return{lodPlanes:e,sizeLods:t,sigmas:A}}function Ah(n,e,t){const A=new qn(n,e,t);return A.texture.mapping=Do,A.texture.name="PMREM.cubeUv",A.scissorTest=!0,A}function $s(n,e,t,A,i){n.viewport.set(e,t,A,i),n.scissor.set(e,t,A,i)}function nC(n,e,t){const A=new Float32Array(ui),i=new I(0,1,0);return new Vt({name:"SphericalGaussianBlur",defines:{n:ui,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:A},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ju(),fragmentShader:`

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
		`,blending:xn,depthTest:!1,depthWrite:!1})}function nh(){return new Vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ju(),fragmentShader:`

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
		`,blending:xn,depthTest:!1,depthWrite:!1})}function ih(){return new Vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ju(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xn,depthTest:!1,depthWrite:!1})}function ju(){return`

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
	`}function iC(n){let e=new WeakMap,t=null;function A(a){if(a&&a.isTexture){const o=a.mapping,l=o===wc||o===Cc,c=o===_r||o===Er;if(l||c){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new th(n)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||c&&p&&i(p)?(t===null&&(t=new th(n)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let o=0;const l=6;for(let c=0;c<l;c++)a[c]!==void 0&&o++;return o===l}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:A,dispose:s}}function rC(n){const e={};function t(A){if(e[A]!==void 0)return e[A];let i;switch(A){case"WEBGL_depth_texture":i=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=n.getExtension(A)}return e[A]=i,i}return{has:function(A){return t(A)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(A){const i=t(A);return i===null&&rs("THREE.WebGLRenderer: "+A+" extension not supported."),i}}}function sC(n,e,t,A){const i={},r=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const m=f.morphAttributes[g];for(let d=0,h=m.length;d<h;d++)e.remove(m[d])}f.removeEventListener("dispose",s),delete i[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),A.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",s),i[f.id]=!0,t.memory.geometries++),f}function o(u){const f=u.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const m=p[g];for(let d=0,h=m.length;d<h;d++)e.update(m[d],n.ARRAY_BUFFER)}}function l(u){const f=[],p=u.index,g=u.attributes.position;let m=0;if(p!==null){const v=p.array;m=p.version;for(let w=0,_=v.length;w<_;w+=3){const b=v[w+0],y=v[w+1],S=v[w+2];f.push(b,y,y,S,S,b)}}else if(g!==void 0){const v=g.array;m=g.version;for(let w=0,_=v.length/3-1;w<_;w+=3){const b=w+0,y=w+1,S=w+2;f.push(b,y,y,S,S,b)}}else return;const d=new(Lp(f)?Np:Hp)(f,1);d.version=m;const h=r.get(u);h&&e.remove(h),r.set(u,d)}function c(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:o,getWireframeAttribute:c}}function aC(n,e,t){let A;function i(f){A=f}let r,s;function a(f){r=f.type,s=f.bytesPerElement}function o(f,p){n.drawElements(A,p,r,f*s),t.update(p,A,1)}function l(f,p,g){g!==0&&(n.drawElementsInstanced(A,p,r,f*s,g),t.update(p,A,g))}function c(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(A,p,0,r,f,0,g);let d=0;for(let h=0;h<g;h++)d+=p[h];t.update(d,A,1)}function u(f,p,g,m){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<f.length;h++)l(f[h]/s,p[h],m[h]);else{d.multiDrawElementsInstancedWEBGL(A,p,0,r,f,0,m,0,g);let h=0;for(let v=0;v<g;v++)h+=p[v];for(let v=0;v<m.length;v++)t.update(h,A,m[v])}}this.setMode=i,this.setIndex=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function oC(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function A(r,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:A}}function lC(n,e,t){const A=new WeakMap,i=new ct;function r(s,a,o){const l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=c!==void 0?c.length:0;let f=A.get(a);if(f===void 0||f.count!==u){let E=function(){S.dispose(),A.delete(a),a.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let w=0;p===!0&&(w=1),g===!0&&(w=2),m===!0&&(w=3);let _=a.attributes.position.count*w,b=1;_>e.maxTextureSize&&(b=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const y=new Float32Array(_*b*4*u),S=new Dp(y,_,b,u);S.type=wn,S.needsUpdate=!0;const R=w*4;for(let C=0;C<u;C++){const L=d[C],W=h[C],P=v[C],K=_*b*4*C;for(let Z=0;Z<L.count;Z++){const V=Z*R;p===!0&&(i.fromBufferAttribute(L,Z),y[K+V+0]=i.x,y[K+V+1]=i.y,y[K+V+2]=i.z,y[K+V+3]=0),g===!0&&(i.fromBufferAttribute(W,Z),y[K+V+4]=i.x,y[K+V+5]=i.y,y[K+V+6]=i.z,y[K+V+7]=0),m===!0&&(i.fromBufferAttribute(P,Z),y[K+V+8]=i.x,y[K+V+9]=i.y,y[K+V+10]=i.z,y[K+V+11]=P.itemSize===4?i.w:1)}}f={count:u,texture:S,size:new Ue(_,b)},A.set(a,f),a.addEventListener("dispose",E)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let p=0;for(let m=0;m<l.length;m++)p+=l[m];const g=a.morphTargetsRelative?1:1-p;o.getUniforms().setValue(n,"morphTargetBaseInfluence",g),o.getUniforms().setValue(n,"morphTargetInfluences",l)}o.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),o.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function cC(n,e,t,A){let i=new WeakMap;function r(o){const l=A.render.frame,c=o.geometry,u=e.get(o,c);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),o.isInstancedMesh&&(o.hasEventListener("dispose",a)===!1&&o.addEventListener("dispose",a),i.get(o)!==l&&(t.update(o.instanceMatrix,n.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,n.ARRAY_BUFFER),i.set(o,l))),o.isSkinnedMesh){const f=o.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function s(){i=new WeakMap}function a(o){const l=o.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:s}}class Wp extends fA{constructor(e,t,A,i,r,s,a,o,l,c=hr){if(c!==hr&&c!==Ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");A===void 0&&c===hr&&(A=Ei),A===void 0&&c===Ur&&(A=yr),super(null,i,r,s,a,o,c,A,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:RA,this.minFilter=o!==void 0?o:RA,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Xp=new fA,rh=new Wp(1,1),Yp=new Dp,Jp=new Ju,Zp=new kp,sh=[],ah=[],oh=new Float32Array(16),lh=new Float32Array(9),ch=new Float32Array(4);function Tr(n,e,t){const A=n[0];if(A<=0||A>0)return n;const i=e*t;let r=sh[i];if(r===void 0&&(r=new Float32Array(i),sh[i]=r),e!==0){A.toArray(r,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(r,a)}return r}function Pt(n,e){if(n.length!==e.length)return!1;for(let t=0,A=n.length;t<A;t++)if(n[t]!==e[t])return!1;return!0}function Ht(n,e){for(let t=0,A=e.length;t<A;t++)n[t]=e[t]}function No(n,e){let t=ah[e];t===void 0&&(t=new Int32Array(e),ah[e]=t);for(let A=0;A!==e;++A)t[A]=n.allocateTextureUnit();return t}function uC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function fC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2fv(this.addr,e),Ht(t,e)}}function hC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;n.uniform3fv(this.addr,e),Ht(t,e)}}function dC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4fv(this.addr,e),Ht(t,e)}}function pC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Pt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ht(t,e)}else{if(Pt(t,A))return;ch.set(A),n.uniformMatrix2fv(this.addr,!1,ch),Ht(t,A)}}function gC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Pt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ht(t,e)}else{if(Pt(t,A))return;lh.set(A),n.uniformMatrix3fv(this.addr,!1,lh),Ht(t,A)}}function mC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Pt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ht(t,e)}else{if(Pt(t,A))return;oh.set(A),n.uniformMatrix4fv(this.addr,!1,oh),Ht(t,A)}}function BC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function vC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2iv(this.addr,e),Ht(t,e)}}function wC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;n.uniform3iv(this.addr,e),Ht(t,e)}}function CC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4iv(this.addr,e),Ht(t,e)}}function xC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function _C(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;n.uniform2uiv(this.addr,e),Ht(t,e)}}function EC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;n.uniform3uiv(this.addr,e),Ht(t,e)}}function yC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;n.uniform4uiv(this.addr,e),Ht(t,e)}}function UC(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i);let r;this.type===n.SAMPLER_2D_SHADOW?(rh.compareFunction=Qp,r=rh):r=Xp,t.setTexture2D(e||r,i)}function SC(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture3D(e||Jp,i)}function MC(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTextureCube(e||Zp,i)}function bC(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture2DArray(e||Yp,i)}function FC(n){switch(n){case 5126:return uC;case 35664:return fC;case 35665:return hC;case 35666:return dC;case 35674:return pC;case 35675:return gC;case 35676:return mC;case 5124:case 35670:return BC;case 35667:case 35671:return vC;case 35668:case 35672:return wC;case 35669:case 35673:return CC;case 5125:return xC;case 36294:return _C;case 36295:return EC;case 36296:return yC;case 35678:case 36198:case 36298:case 36306:case 35682:return UC;case 35679:case 36299:case 36307:return SC;case 35680:case 36300:case 36308:case 36293:return MC;case 36289:case 36303:case 36311:case 36292:return bC}}function TC(n,e){n.uniform1fv(this.addr,e)}function IC(n,e){const t=Tr(e,this.size,2);n.uniform2fv(this.addr,t)}function QC(n,e){const t=Tr(e,this.size,3);n.uniform3fv(this.addr,t)}function LC(n,e){const t=Tr(e,this.size,4);n.uniform4fv(this.addr,t)}function RC(n,e){const t=Tr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function DC(n,e){const t=Tr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function PC(n,e){const t=Tr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function HC(n,e){n.uniform1iv(this.addr,e)}function NC(n,e){n.uniform2iv(this.addr,e)}function OC(n,e){n.uniform3iv(this.addr,e)}function GC(n,e){n.uniform4iv(this.addr,e)}function VC(n,e){n.uniform1uiv(this.addr,e)}function kC(n,e){n.uniform2uiv(this.addr,e)}function zC(n,e){n.uniform3uiv(this.addr,e)}function KC(n,e){n.uniform4uiv(this.addr,e)}function WC(n,e,t){const A=this.cache,i=e.length,r=No(t,i);Pt(A,r)||(n.uniform1iv(this.addr,r),Ht(A,r));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||Xp,r[s])}function XC(n,e,t){const A=this.cache,i=e.length,r=No(t,i);Pt(A,r)||(n.uniform1iv(this.addr,r),Ht(A,r));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Jp,r[s])}function YC(n,e,t){const A=this.cache,i=e.length,r=No(t,i);Pt(A,r)||(n.uniform1iv(this.addr,r),Ht(A,r));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||Zp,r[s])}function JC(n,e,t){const A=this.cache,i=e.length,r=No(t,i);Pt(A,r)||(n.uniform1iv(this.addr,r),Ht(A,r));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Yp,r[s])}function ZC(n){switch(n){case 5126:return TC;case 35664:return IC;case 35665:return QC;case 35666:return LC;case 35674:return RC;case 35675:return DC;case 35676:return PC;case 5124:case 35670:return HC;case 35667:case 35671:return NC;case 35668:case 35672:return OC;case 35669:case 35673:return GC;case 5125:return VC;case 36294:return kC;case 36295:return zC;case 36296:return KC;case 35678:case 36198:case 36298:case 36306:case 35682:return WC;case 35679:case 36299:case 36307:return XC;case 35680:case 36300:case 36308:case 36293:return YC;case 36289:case 36303:case 36311:case 36292:return JC}}class qC{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.setValue=FC(t.type)}}class jC{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ZC(t.type)}}class $C{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,A){const i=this.seq;for(let r=0,s=i.length;r!==s;++r){const a=i[r];a.setValue(e,t[a.id],A)}}}const Fl=/(\w+)(\])?(\[|\.)?/g;function uh(n,e){n.seq.push(e),n.map[e.id]=e}function ex(n,e,t){const A=n.name,i=A.length;for(Fl.lastIndex=0;;){const r=Fl.exec(A),s=Fl.lastIndex;let a=r[1];const o=r[2]==="]",l=r[3];if(o&&(a=a|0),l===void 0||l==="["&&s+2===i){uh(t,l===void 0?new qC(a,n,e):new jC(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new $C(a),uh(t,u)),t=u}}}class Ka{constructor(e,t){this.seq=[],this.map={};const A=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<A;++i){const r=e.getActiveUniform(t,i),s=e.getUniformLocation(t,r.name);ex(r,s,this)}}setValue(e,t,A,i){const r=this.map[t];r!==void 0&&r.setValue(e,A,i)}setOptional(e,t,A){const i=t[A];i!==void 0&&this.setValue(e,A,i)}static upload(e,t,A,i){for(let r=0,s=t.length;r!==s;++r){const a=t[r],o=A[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,i)}}static seqWithValue(e,t){const A=[];for(let i=0,r=e.length;i!==r;++i){const s=e[i];s.id in t&&A.push(s)}return A}}function fh(n,e,t){const A=n.createShader(e);return n.shaderSource(A,t),n.compileShader(A),A}const tx=37297;let Ax=0;function nx(n,e){const t=n.split(`
`),A=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=i;s<r;s++){const a=s+1;A.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return A.join(`
`)}function ix(n){const e=ot.getPrimaries(ot.workingColorSpace),t=ot.getPrimaries(n);let A;switch(e===t?A="":e===io&&t===no?A="LinearDisplayP3ToLinearSRGB":e===no&&t===io&&(A="LinearSRGBToLinearDisplayP3"),n){case ei:case Ho:return[A,"LinearTransferOETF"];case zA:case Yu:return[A,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[A,"LinearTransferOETF"]}}function hh(n,e,t){const A=n.getShaderParameter(e,n.COMPILE_STATUS),i=n.getShaderInfoLog(e).trim();if(A&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const s=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+nx(n.getShaderSource(e),s)}else return i}function rx(n,e){const t=ix(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function sx(n,e){let t;switch(e){case y0:t="Linear";break;case U0:t="Reinhard";break;case S0:t="OptimizedCineon";break;case M0:t="ACESFilmic";break;case F0:t="AgX";break;case T0:t="Neutral";break;case b0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ea=new I;function ax(){ot.getLuminanceCoefficients(ea);const n=ea.x.toFixed(4),e=ea.y.toFixed(4),t=ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ox(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jr).join(`
`)}function lx(n){const e=[];for(const t in n){const A=n[t];A!==!1&&e.push("#define "+t+" "+A)}return e.join(`
`)}function cx(n,e){const t={},A=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let i=0;i<A;i++){const r=n.getActiveAttrib(e,i),s=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[s]={type:r.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function Jr(n){return n!==""}function dh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ph(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ux=/^[ \t]*#include +<([\w\d./]+)>/gm;function qc(n){return n.replace(ux,hx)}const fx=new Map;function hx(n,e){let t=Ke[e];if(t===void 0){const A=fx.get(e);if(A!==void 0)t=Ke[A],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,A);else throw new Error("Can not resolve #include <"+e+">")}return qc(t)}const dx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gh(n){return n.replace(dx,px)}function px(n,e,t,A){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=A.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function mh(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function gx(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===wp?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===qm?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function mx(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case _r:case Er:e="ENVMAP_TYPE_CUBE";break;case Do:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Bx(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Er:e="ENVMAP_MODE_REFRACTION";break}return e}function vx(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Cp:e="ENVMAP_BLENDING_MULTIPLY";break;case _0:e="ENVMAP_BLENDING_MIX";break;case E0:e="ENVMAP_BLENDING_ADD";break}return e}function wx(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,A=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:A,maxMip:t}}function Cx(n,e,t,A){const i=n.getContext(),r=t.defines;let s=t.vertexShader,a=t.fragmentShader;const o=gx(t),l=mx(t),c=Bx(t),u=vx(t),f=wx(t),p=ox(t),g=lx(r),m=i.createProgram();let d,h,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jr).join(`
`),d.length>0&&(d+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jr).join(`
`),h.length>0&&(h+=`
`)):(d=[mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jr).join(`
`),h=[mh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Kn?"#define TONE_MAPPING":"",t.toneMapping!==Kn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Kn?sx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,rx("linearToOutputTexel",t.outputColorSpace),ax(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jr).join(`
`)),s=qc(s),s=dh(s,t),s=ph(s,t),a=qc(a),a=dh(a,t),a=ph(a,t),s=gh(s),a=gh(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,d=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,h=["#define varying in",t.glslVersion===ro?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ro?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const w=v+d+s,_=v+h+a,b=fh(i,i.VERTEX_SHADER,w),y=fh(i,i.FRAGMENT_SHADER,_);i.attachShader(m,b),i.attachShader(m,y),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function S(L){if(n.debug.checkShaderErrors){const W=i.getProgramInfoLog(m).trim(),P=i.getShaderInfoLog(b).trim(),K=i.getShaderInfoLog(y).trim();let Z=!0,V=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(i,m,b,y);else{const q=hh(i,b,"vertex"),X=hh(i,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+W+`
`+q+`
`+X)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(P===""||K==="")&&(V=!1);V&&(L.diagnostics={runnable:Z,programLog:W,vertexShader:{log:P,prefix:d},fragmentShader:{log:K,prefix:h}})}i.deleteShader(b),i.deleteShader(y),R=new Ka(i,m),E=cx(i,m)}let R;this.getUniforms=function(){return R===void 0&&S(this),R};let E;this.getAttributes=function(){return E===void 0&&S(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(m,tx)),C},this.destroy=function(){A.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ax++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=y,this}let xx=0;class _x{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,A=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(A),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const A of t)A.usedTimes--,A.usedTimes===0&&this.shaderCache.delete(A.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let A=t.get(e);return A===void 0&&(A=new Set,t.set(e,A)),A}_getShaderStage(e){const t=this.shaderCache;let A=t.get(e);return A===void 0&&(A=new Ex(e),t.set(e,A)),A}}class Ex{constructor(e){this.id=xx++,this.code=e,this.usedTimes=0}}function yx(n,e,t,A,i,r,s){const a=new Zu,o=new _x,l=new Set,c=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(E){return l.add(E),E===0?"uv":`uv${E}`}function d(E,C,L,W,P){const K=W.fog,Z=P.geometry,V=E.isMeshStandardMaterial?W.environment:null,q=(E.isMeshStandardMaterial?t:e).get(E.envMap||V),X=q&&q.mapping===Do?q.image.height:null,re=g[E.type];E.precision!==null&&(p=i.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const ae=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,he=ae!==void 0?ae.length:0;let Ie=0;Z.morphAttributes.position!==void 0&&(Ie=1),Z.morphAttributes.normal!==void 0&&(Ie=2),Z.morphAttributes.color!==void 0&&(Ie=3);let Oe,J,$,ue;if(re){const nt=$A[re];Oe=nt.vertexShader,J=nt.fragmentShader}else Oe=E.vertexShader,J=E.fragmentShader,o.update(E),$=o.getVertexShaderID(E),ue=o.getFragmentShaderID(E);const ce=n.getRenderTarget(),Me=P.isInstancedMesh===!0,Fe=P.isBatchedMesh===!0,Ge=!!E.map,tt=!!E.matcap,Q=!!q,ht=!!E.aoMap,Ye=!!E.lightMap,At=!!E.bumpMap,xe=!!E.normalMap,vt=!!E.displacementMap,He=!!E.emissiveMap,Ve=!!E.metalnessMap,T=!!E.roughnessMap,x=E.anisotropy>0,z=E.clearcoat>0,ee=E.dispersion>0,ne=E.iridescence>0,j=E.sheen>0,Se=E.transmission>0,oe=x&&!!E.anisotropyMap,ge=z&&!!E.clearcoatMap,ke=z&&!!E.clearcoatNormalMap,ie=z&&!!E.clearcoatRoughnessMap,me=ne&&!!E.iridescenceMap,Je=ne&&!!E.iridescenceThicknessMap,Qe=j&&!!E.sheenColorMap,Be=j&&!!E.sheenRoughnessMap,Re=!!E.specularMap,Ne=!!E.specularColorMap,wt=!!E.specularIntensityMap,B=Se&&!!E.transmissionMap,N=Se&&!!E.thicknessMap,O=!!E.gradientMap,Y=!!E.alphaMap,te=E.alphaTest>0,_e=!!E.alphaHash,De=!!E.extensions;let Ut=Kn;E.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(Ut=n.toneMapping);const Lt={shaderID:re,shaderType:E.type,shaderName:E.name,vertexShader:Oe,fragmentShader:J,defines:E.defines,customVertexShaderID:$,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Fe,batchingColor:Fe&&P._colorsTexture!==null,instancing:Me,instancingColor:Me&&P.instanceColor!==null,instancingMorph:Me&&P.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:ei,alphaToCoverage:!!E.alphaToCoverage,map:Ge,matcap:tt,envMap:Q,envMapMode:Q&&q.mapping,envMapCubeUVHeight:X,aoMap:ht,lightMap:Ye,bumpMap:At,normalMap:xe,displacementMap:f&&vt,emissiveMap:He,normalMapObjectSpace:xe&&E.normalMapType===R0,normalMapTangentSpace:xe&&E.normalMapType===Ip,metalnessMap:Ve,roughnessMap:T,anisotropy:x,anisotropyMap:oe,clearcoat:z,clearcoatMap:ge,clearcoatNormalMap:ke,clearcoatRoughnessMap:ie,dispersion:ee,iridescence:ne,iridescenceMap:me,iridescenceThicknessMap:Je,sheen:j,sheenColorMap:Qe,sheenRoughnessMap:Be,specularMap:Re,specularColorMap:Ne,specularIntensityMap:wt,transmission:Se,transmissionMap:B,thicknessMap:N,gradientMap:O,opaque:E.transparent===!1&&E.blending===fr&&E.alphaToCoverage===!1,alphaMap:Y,alphaTest:te,alphaHash:_e,combine:E.combine,mapUv:Ge&&m(E.map.channel),aoMapUv:ht&&m(E.aoMap.channel),lightMapUv:Ye&&m(E.lightMap.channel),bumpMapUv:At&&m(E.bumpMap.channel),normalMapUv:xe&&m(E.normalMap.channel),displacementMapUv:vt&&m(E.displacementMap.channel),emissiveMapUv:He&&m(E.emissiveMap.channel),metalnessMapUv:Ve&&m(E.metalnessMap.channel),roughnessMapUv:T&&m(E.roughnessMap.channel),anisotropyMapUv:oe&&m(E.anisotropyMap.channel),clearcoatMapUv:ge&&m(E.clearcoatMap.channel),clearcoatNormalMapUv:ke&&m(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&m(E.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&m(E.iridescenceMap.channel),iridescenceThicknessMapUv:Je&&m(E.iridescenceThicknessMap.channel),sheenColorMapUv:Qe&&m(E.sheenColorMap.channel),sheenRoughnessMapUv:Be&&m(E.sheenRoughnessMap.channel),specularMapUv:Re&&m(E.specularMap.channel),specularColorMapUv:Ne&&m(E.specularColorMap.channel),specularIntensityMapUv:wt&&m(E.specularIntensityMap.channel),transmissionMapUv:B&&m(E.transmissionMap.channel),thicknessMapUv:N&&m(E.thicknessMap.channel),alphaMapUv:Y&&m(E.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(xe||x),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!Z.attributes.uv&&(Ge||Y),fog:!!K,useFog:E.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:P.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ie,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ut,decodeVideoTexture:Ge&&E.map.isVideoTexture===!0&&ot.getTransfer(E.map.colorSpace)===gt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===UA,flipSided:E.side===$t,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:De&&E.extensions.clipCullDistance===!0&&A.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&E.extensions.multiDraw===!0||Fe)&&A.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:A.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Lt.vertexUv1s=l.has(1),Lt.vertexUv2s=l.has(2),Lt.vertexUv3s=l.has(3),l.clear(),Lt}function h(E){const C=[];if(E.shaderID?C.push(E.shaderID):(C.push(E.customVertexShaderID),C.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)C.push(L),C.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(v(C,E),w(C,E),C.push(n.outputColorSpace)),C.push(E.customProgramCacheKey),C.join()}function v(E,C){E.push(C.precision),E.push(C.outputColorSpace),E.push(C.envMapMode),E.push(C.envMapCubeUVHeight),E.push(C.mapUv),E.push(C.alphaMapUv),E.push(C.lightMapUv),E.push(C.aoMapUv),E.push(C.bumpMapUv),E.push(C.normalMapUv),E.push(C.displacementMapUv),E.push(C.emissiveMapUv),E.push(C.metalnessMapUv),E.push(C.roughnessMapUv),E.push(C.anisotropyMapUv),E.push(C.clearcoatMapUv),E.push(C.clearcoatNormalMapUv),E.push(C.clearcoatRoughnessMapUv),E.push(C.iridescenceMapUv),E.push(C.iridescenceThicknessMapUv),E.push(C.sheenColorMapUv),E.push(C.sheenRoughnessMapUv),E.push(C.specularMapUv),E.push(C.specularColorMapUv),E.push(C.specularIntensityMapUv),E.push(C.transmissionMapUv),E.push(C.thicknessMapUv),E.push(C.combine),E.push(C.fogExp2),E.push(C.sizeAttenuation),E.push(C.morphTargetsCount),E.push(C.morphAttributeCount),E.push(C.numDirLights),E.push(C.numPointLights),E.push(C.numSpotLights),E.push(C.numSpotLightMaps),E.push(C.numHemiLights),E.push(C.numRectAreaLights),E.push(C.numDirLightShadows),E.push(C.numPointLightShadows),E.push(C.numSpotLightShadows),E.push(C.numSpotLightShadowsWithMaps),E.push(C.numLightProbes),E.push(C.shadowMapType),E.push(C.toneMapping),E.push(C.numClippingPlanes),E.push(C.numClipIntersection),E.push(C.depthPacking)}function w(E,C){a.disableAll(),C.supportsVertexTextures&&a.enable(0),C.instancing&&a.enable(1),C.instancingColor&&a.enable(2),C.instancingMorph&&a.enable(3),C.matcap&&a.enable(4),C.envMap&&a.enable(5),C.normalMapObjectSpace&&a.enable(6),C.normalMapTangentSpace&&a.enable(7),C.clearcoat&&a.enable(8),C.iridescence&&a.enable(9),C.alphaTest&&a.enable(10),C.vertexColors&&a.enable(11),C.vertexAlphas&&a.enable(12),C.vertexUv1s&&a.enable(13),C.vertexUv2s&&a.enable(14),C.vertexUv3s&&a.enable(15),C.vertexTangents&&a.enable(16),C.anisotropy&&a.enable(17),C.alphaHash&&a.enable(18),C.batching&&a.enable(19),C.dispersion&&a.enable(20),C.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.skinning&&a.enable(4),C.morphTargets&&a.enable(5),C.morphNormals&&a.enable(6),C.morphColors&&a.enable(7),C.premultipliedAlpha&&a.enable(8),C.shadowMapEnabled&&a.enable(9),C.doubleSided&&a.enable(10),C.flipSided&&a.enable(11),C.useDepthPacking&&a.enable(12),C.dithering&&a.enable(13),C.transmission&&a.enable(14),C.sheen&&a.enable(15),C.opaque&&a.enable(16),C.pointsUvs&&a.enable(17),C.decodeVideoTexture&&a.enable(18),C.alphaToCoverage&&a.enable(19),E.push(a.mask)}function _(E){const C=g[E.type];let L;if(C){const W=$A[C];L=Gp.clone(W.uniforms)}else L=E.uniforms;return L}function b(E,C){let L;for(let W=0,P=c.length;W<P;W++){const K=c[W];if(K.cacheKey===C){L=K,++L.usedTimes;break}}return L===void 0&&(L=new Cx(n,C,E,r),c.push(L)),L}function y(E){if(--E.usedTimes===0){const C=c.indexOf(E);c[C]=c[c.length-1],c.pop(),E.destroy()}}function S(E){o.remove(E)}function R(){o.dispose()}return{getParameters:d,getProgramCacheKey:h,getUniforms:_,acquireProgram:b,releaseProgram:y,releaseShaderCache:S,programs:c,dispose:R}}function Ux(){let n=new WeakMap;function e(r){let s=n.get(r);return s===void 0&&(s={},n.set(r,s)),s}function t(r){n.delete(r)}function A(r,s,a){n.get(r)[s]=a}function i(){n=new WeakMap}return{get:e,remove:t,update:A,dispose:i}}function Sx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Bh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function vh(){const n=[];let e=0;const t=[],A=[],i=[];function r(){e=0,t.length=0,A.length=0,i.length=0}function s(u,f,p,g,m,d){let h=n[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:m,group:d},n[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=m,h.group=d),e++,h}function a(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.push(h):p.transparent===!0?i.push(h):t.push(h)}function o(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.unshift(h):p.transparent===!0?i.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||Sx),A.length>1&&A.sort(f||Bh),i.length>1&&i.sort(f||Bh)}function c(){for(let u=e,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:A,transparent:i,init:r,push:a,unshift:o,finish:c,sort:l}}function Mx(){let n=new WeakMap;function e(A,i){const r=n.get(A);let s;return r===void 0?(s=new vh,n.set(A,[s])):i>=r.length?(s=new vh,r.push(s)):s=r[i],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function bx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new ze};break;case"SpotLight":t={position:new I,direction:new I,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function Fx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Tx=0;function Ix(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Qx(n){const e=new bx,t=Fx(),A={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)A.probe.push(new I);const i=new I,r=new ut,s=new ut;function a(l){let c=0,u=0,f=0;for(let E=0;E<9;E++)A.probe[E].set(0,0,0);let p=0,g=0,m=0,d=0,h=0,v=0,w=0,_=0,b=0,y=0,S=0;l.sort(Ix);for(let E=0,C=l.length;E<C;E++){const L=l[E],W=L.color,P=L.intensity,K=L.distance,Z=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)c+=W.r*P,u+=W.g*P,f+=W.b*P;else if(L.isLightProbe){for(let V=0;V<9;V++)A.probe[V].addScaledVector(L.sh.coefficients[V],P);S++}else if(L.isDirectionalLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const q=L.shadow,X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.directionalShadow[p]=X,A.directionalShadowMap[p]=Z,A.directionalShadowMatrix[p]=L.shadow.matrix,v++}A.directional[p]=V,p++}else if(L.isSpotLight){const V=e.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(W).multiplyScalar(P),V.distance=K,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,A.spot[m]=V;const q=L.shadow;if(L.map&&(A.spotLightMap[b]=L.map,b++,q.updateMatrices(L),L.castShadow&&y++),A.spotLightMatrix[m]=q.matrix,L.castShadow){const X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.spotShadow[m]=X,A.spotShadowMap[m]=Z,_++}m++}else if(L.isRectAreaLight){const V=e.get(L);V.color.copy(W).multiplyScalar(P),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),A.rectArea[d]=V,d++}else if(L.isPointLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const q=L.shadow,X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,X.shadowCameraNear=q.camera.near,X.shadowCameraFar=q.camera.far,A.pointShadow[g]=X,A.pointShadowMap[g]=Z,A.pointShadowMatrix[g]=L.shadow.matrix,w++}A.point[g]=V,g++}else if(L.isHemisphereLight){const V=e.get(L);V.skyColor.copy(L.color).multiplyScalar(P),V.groundColor.copy(L.groundColor).multiplyScalar(P),A.hemi[h]=V,h++}}d>0&&(n.has("OES_texture_float_linear")===!0?(A.rectAreaLTC1=le.LTC_FLOAT_1,A.rectAreaLTC2=le.LTC_FLOAT_2):(A.rectAreaLTC1=le.LTC_HALF_1,A.rectAreaLTC2=le.LTC_HALF_2)),A.ambient[0]=c,A.ambient[1]=u,A.ambient[2]=f;const R=A.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==m||R.rectAreaLength!==d||R.hemiLength!==h||R.numDirectionalShadows!==v||R.numPointShadows!==w||R.numSpotShadows!==_||R.numSpotMaps!==b||R.numLightProbes!==S)&&(A.directional.length=p,A.spot.length=m,A.rectArea.length=d,A.point.length=g,A.hemi.length=h,A.directionalShadow.length=v,A.directionalShadowMap.length=v,A.pointShadow.length=w,A.pointShadowMap.length=w,A.spotShadow.length=_,A.spotShadowMap.length=_,A.directionalShadowMatrix.length=v,A.pointShadowMatrix.length=w,A.spotLightMatrix.length=_+b-y,A.spotLightMap.length=b,A.numSpotLightShadowsWithMaps=y,A.numLightProbes=S,R.directionalLength=p,R.pointLength=g,R.spotLength=m,R.rectAreaLength=d,R.hemiLength=h,R.numDirectionalShadows=v,R.numPointShadows=w,R.numSpotShadows=_,R.numSpotMaps=b,R.numLightProbes=S,A.version=Tx++)}function o(l,c){let u=0,f=0,p=0,g=0,m=0;const d=c.matrixWorldInverse;for(let h=0,v=l.length;h<v;h++){const w=l[h];if(w.isDirectionalLight){const _=A.directional[u];_.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(d),u++}else if(w.isSpotLight){const _=A.spot[p];_.position.setFromMatrixPosition(w.matrixWorld),_.position.applyMatrix4(d),_.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(d),p++}else if(w.isRectAreaLight){const _=A.rectArea[g];_.position.setFromMatrixPosition(w.matrixWorld),_.position.applyMatrix4(d),s.identity(),r.copy(w.matrixWorld),r.premultiply(d),s.extractRotation(r),_.halfWidth.set(w.width*.5,0,0),_.halfHeight.set(0,w.height*.5,0),_.halfWidth.applyMatrix4(s),_.halfHeight.applyMatrix4(s),g++}else if(w.isPointLight){const _=A.point[f];_.position.setFromMatrixPosition(w.matrixWorld),_.position.applyMatrix4(d),f++}else if(w.isHemisphereLight){const _=A.hemi[m];_.direction.setFromMatrixPosition(w.matrixWorld),_.direction.transformDirection(d),m++}}}return{setup:a,setupView:o,state:A}}function wh(n){const e=new Qx(n),t=[],A=[];function i(c){l.camera=c,t.length=0,A.length=0}function r(c){t.push(c)}function s(c){A.push(c)}function a(){e.setup(t)}function o(c){e.setupView(t,c)}const l={lightsArray:t,shadowsArray:A,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:o,pushLight:r,pushShadow:s}}function Lx(n){let e=new WeakMap;function t(i,r=0){const s=e.get(i);let a;return s===void 0?(a=new wh(n),e.set(i,[a])):r>=s.length?(a=new wh(n),s.push(a)):a=s[r],a}function A(){e=new WeakMap}return{get:t,dispose:A}}class Rx extends Mi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Q0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Dx extends Mi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Px=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hx=`uniform sampler2D shadow_pass;
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
}`;function Nx(n,e,t){let A=new qu;const i=new Ue,r=new Ue,s=new ct,a=new Rx({depthPacking:L0}),o=new Dx,l={},c=t.maxTextureSize,u={[Zn]:$t,[$t]:Zn,[UA]:UA},f=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:Px,fragmentShader:Hx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new kt;g.setAttribute("position",new qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new xt(g,f),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wp;let h=this.type;this.render=function(y,S,R){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||y.length===0)return;const E=n.getRenderTarget(),C=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),W=n.state;W.setBlending(xn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const P=h!==mn&&this.type===mn,K=h===mn&&this.type!==mn;for(let Z=0,V=y.length;Z<V;Z++){const q=y[Z],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const re=X.getFrameExtents();if(i.multiply(re),r.copy(X.mapSize),(i.x>c||i.y>c)&&(i.x>c&&(r.x=Math.floor(c/re.x),i.x=r.x*re.x,X.mapSize.x=r.x),i.y>c&&(r.y=Math.floor(c/re.y),i.y=r.y*re.y,X.mapSize.y=r.y)),X.map===null||P===!0||K===!0){const he=this.type!==mn?{minFilter:RA,magFilter:RA}:{};X.map!==null&&X.map.dispose(),X.map=new qn(i.x,i.y,he),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();const ae=X.getViewportCount();for(let he=0;he<ae;he++){const Ie=X.getViewport(he);s.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),W.viewport(s),X.updateMatrices(q,he),A=X.getFrustum(),_(S,R,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===mn&&v(X,R),X.needsUpdate=!1}h=this.type,d.needsUpdate=!1,n.setRenderTarget(E,C,L)};function v(y,S){const R=e.update(m);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,p.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new qn(i.x,i.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(S,null,R,f,m,null),p.uniforms.shadow_pass.value=y.mapPass.texture,p.uniforms.resolution.value=y.mapSize,p.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(S,null,R,p,m,null)}function w(y,S,R,E){let C=null;const L=R.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(L!==void 0)C=L;else if(C=R.isPointLight===!0?o:a,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const W=C.uuid,P=S.uuid;let K=l[W];K===void 0&&(K={},l[W]=K);let Z=K[P];Z===void 0&&(Z=C.clone(),K[P]=Z,S.addEventListener("dispose",b)),C=Z}if(C.visible=S.visible,C.wireframe=S.wireframe,E===mn?C.side=S.shadowSide!==null?S.shadowSide:S.side:C.side=S.shadowSide!==null?S.shadowSide:u[S.side],C.alphaMap=S.alphaMap,C.alphaTest=S.alphaTest,C.map=S.map,C.clipShadows=S.clipShadows,C.clippingPlanes=S.clippingPlanes,C.clipIntersection=S.clipIntersection,C.displacementMap=S.displacementMap,C.displacementScale=S.displacementScale,C.displacementBias=S.displacementBias,C.wireframeLinewidth=S.wireframeLinewidth,C.linewidth=S.linewidth,R.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const W=n.properties.get(C);W.light=R}return C}function _(y,S,R,E,C){if(y.visible===!1)return;if(y.layers.test(S.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&C===mn)&&(!y.frustumCulled||A.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,y.matrixWorld);const P=e.update(y),K=y.material;if(Array.isArray(K)){const Z=P.groups;for(let V=0,q=Z.length;V<q;V++){const X=Z[V],re=K[X.materialIndex];if(re&&re.visible){const ae=w(y,re,E,C);y.onBeforeShadow(n,y,S,R,P,ae,X),n.renderBufferDirect(R,null,P,ae,y,X),y.onAfterShadow(n,y,S,R,P,ae,X)}}}else if(K.visible){const Z=w(y,K,E,C);y.onBeforeShadow(n,y,S,R,P,Z,null),n.renderBufferDirect(R,null,P,Z,y,null),y.onAfterShadow(n,y,S,R,P,Z,null)}}const W=y.children;for(let P=0,K=W.length;P<K;P++)_(W[P],S,R,E,C)}function b(y){y.target.removeEventListener("dispose",b);for(const R in l){const E=l[R],C=y.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function Ox(n){function e(){let B=!1;const N=new ct;let O=null;const Y=new ct(0,0,0,0);return{setMask:function(te){O!==te&&!B&&(n.colorMask(te,te,te,te),O=te)},setLocked:function(te){B=te},setClear:function(te,_e,De,Ut,Lt){Lt===!0&&(te*=Ut,_e*=Ut,De*=Ut),N.set(te,_e,De,Ut),Y.equals(N)===!1&&(n.clearColor(te,_e,De,Ut),Y.copy(N))},reset:function(){B=!1,O=null,Y.set(-1,0,0,0)}}}function t(){let B=!1,N=null,O=null,Y=null;return{setTest:function(te){te?ue(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(te){N!==te&&!B&&(n.depthMask(te),N=te)},setFunc:function(te){if(O!==te){switch(te){case g0:n.depthFunc(n.NEVER);break;case m0:n.depthFunc(n.ALWAYS);break;case B0:n.depthFunc(n.LESS);break;case to:n.depthFunc(n.LEQUAL);break;case v0:n.depthFunc(n.EQUAL);break;case w0:n.depthFunc(n.GEQUAL);break;case C0:n.depthFunc(n.GREATER);break;case x0:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}O=te}},setLocked:function(te){B=te},setClear:function(te){Y!==te&&(n.clearDepth(te),Y=te)},reset:function(){B=!1,N=null,O=null,Y=null}}}function A(){let B=!1,N=null,O=null,Y=null,te=null,_e=null,De=null,Ut=null,Lt=null;return{setTest:function(nt){B||(nt?ue(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(nt){N!==nt&&!B&&(n.stencilMask(nt),N=nt)},setFunc:function(nt,Rt,Ft){(O!==nt||Y!==Rt||te!==Ft)&&(n.stencilFunc(nt,Rt,Ft),O=nt,Y=Rt,te=Ft)},setOp:function(nt,Rt,Ft){(_e!==nt||De!==Rt||Ut!==Ft)&&(n.stencilOp(nt,Rt,Ft),_e=nt,De=Rt,Ut=Ft)},setLocked:function(nt){B=nt},setClear:function(nt){Lt!==nt&&(n.clearStencil(nt),Lt=nt)},reset:function(){B=!1,N=null,O=null,Y=null,te=null,_e=null,De=null,Ut=null,Lt=null}}}const i=new e,r=new t,s=new A,a=new WeakMap,o=new WeakMap;let l={},c={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,v=null,w=null,_=null,b=null,y=new ze(0,0,0),S=0,R=!1,E=null,C=null,L=null,W=null,P=null;const K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,V=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(q)[1]),Z=V>=1):q.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Z=V>=2);let X=null,re={};const ae=n.getParameter(n.SCISSOR_BOX),he=n.getParameter(n.VIEWPORT),Ie=new ct().fromArray(ae),Oe=new ct().fromArray(he);function J(B,N,O,Y){const te=new Uint8Array(4),_e=n.createTexture();n.bindTexture(B,_e),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let De=0;De<O;De++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(N,0,n.RGBA,1,1,Y,0,n.RGBA,n.UNSIGNED_BYTE,te):n.texImage2D(N+De,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,te);return _e}const $={};$[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),s.setClear(0),ue(n.DEPTH_TEST),r.setFunc(to),At(!1),xe(Mf),ue(n.CULL_FACE),ht(xn);function ue(B){l[B]!==!0&&(n.enable(B),l[B]=!0)}function ce(B){l[B]!==!1&&(n.disable(B),l[B]=!1)}function Me(B,N){return c[B]!==N?(n.bindFramebuffer(B,N),c[B]=N,B===n.DRAW_FRAMEBUFFER&&(c[n.FRAMEBUFFER]=N),B===n.FRAMEBUFFER&&(c[n.DRAW_FRAMEBUFFER]=N),!0):!1}function Fe(B,N){let O=f,Y=!1;if(B){O=u.get(N),O===void 0&&(O=[],u.set(N,O));const te=B.textures;if(O.length!==te.length||O[0]!==n.COLOR_ATTACHMENT0){for(let _e=0,De=te.length;_e<De;_e++)O[_e]=n.COLOR_ATTACHMENT0+_e;O.length=te.length,Y=!0}}else O[0]!==n.BACK&&(O[0]=n.BACK,Y=!0);Y&&n.drawBuffers(O)}function Ge(B){return p!==B?(n.useProgram(B),p=B,!0):!1}const tt={[ci]:n.FUNC_ADD,[$m]:n.FUNC_SUBTRACT,[e0]:n.FUNC_REVERSE_SUBTRACT};tt[t0]=n.MIN,tt[A0]=n.MAX;const Q={[n0]:n.ZERO,[i0]:n.ONE,[r0]:n.SRC_COLOR,[Bc]:n.SRC_ALPHA,[u0]:n.SRC_ALPHA_SATURATE,[l0]:n.DST_COLOR,[a0]:n.DST_ALPHA,[s0]:n.ONE_MINUS_SRC_COLOR,[vc]:n.ONE_MINUS_SRC_ALPHA,[c0]:n.ONE_MINUS_DST_COLOR,[o0]:n.ONE_MINUS_DST_ALPHA,[f0]:n.CONSTANT_COLOR,[h0]:n.ONE_MINUS_CONSTANT_COLOR,[d0]:n.CONSTANT_ALPHA,[p0]:n.ONE_MINUS_CONSTANT_ALPHA};function ht(B,N,O,Y,te,_e,De,Ut,Lt,nt){if(B===xn){g===!0&&(ce(n.BLEND),g=!1);return}if(g===!1&&(ue(n.BLEND),g=!0),B!==jm){if(B!==m||nt!==R){if((d!==ci||w!==ci)&&(n.blendEquation(n.FUNC_ADD),d=ci,w=ci),nt)switch(B){case fr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case XA:n.blendFunc(n.ONE,n.ONE);break;case bf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ff:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case fr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case XA:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case bf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ff:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}h=null,v=null,_=null,b=null,y.set(0,0,0),S=0,m=B,R=nt}return}te=te||N,_e=_e||O,De=De||Y,(N!==d||te!==w)&&(n.blendEquationSeparate(tt[N],tt[te]),d=N,w=te),(O!==h||Y!==v||_e!==_||De!==b)&&(n.blendFuncSeparate(Q[O],Q[Y],Q[_e],Q[De]),h=O,v=Y,_=_e,b=De),(Ut.equals(y)===!1||Lt!==S)&&(n.blendColor(Ut.r,Ut.g,Ut.b,Lt),y.copy(Ut),S=Lt),m=B,R=!1}function Ye(B,N){B.side===UA?ce(n.CULL_FACE):ue(n.CULL_FACE);let O=B.side===$t;N&&(O=!O),At(O),B.blending===fr&&B.transparent===!1?ht(xn):ht(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),r.setFunc(B.depthFunc),r.setTest(B.depthTest),r.setMask(B.depthWrite),i.setMask(B.colorWrite);const Y=B.stencilWrite;s.setTest(Y),Y&&(s.setMask(B.stencilWriteMask),s.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),s.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),He(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ue(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function At(B){E!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),E=B)}function xe(B){B!==Jm?(ue(n.CULL_FACE),B!==C&&(B===Mf?n.cullFace(n.BACK):B===Zm?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),C=B}function vt(B){B!==L&&(Z&&n.lineWidth(B),L=B)}function He(B,N,O){B?(ue(n.POLYGON_OFFSET_FILL),(W!==N||P!==O)&&(n.polygonOffset(N,O),W=N,P=O)):ce(n.POLYGON_OFFSET_FILL)}function Ve(B){B?ue(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function T(B){B===void 0&&(B=n.TEXTURE0+K-1),X!==B&&(n.activeTexture(B),X=B)}function x(B,N,O){O===void 0&&(X===null?O=n.TEXTURE0+K-1:O=X);let Y=re[O];Y===void 0&&(Y={type:void 0,texture:void 0},re[O]=Y),(Y.type!==B||Y.texture!==N)&&(X!==O&&(n.activeTexture(O),X=O),n.bindTexture(B,N||$[B]),Y.type=B,Y.texture=N)}function z(){const B=re[X];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ee(){try{n.compressedTexImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function j(){try{n.texSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Se(){try{n.texSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function oe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ke(){try{n.texStorage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ie(){try{n.texStorage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function me(){try{n.texImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Je(){try{n.texImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Qe(B){Ie.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),Ie.copy(B))}function Be(B){Oe.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),Oe.copy(B))}function Re(B,N){let O=o.get(N);O===void 0&&(O=new WeakMap,o.set(N,O));let Y=O.get(B);Y===void 0&&(Y=n.getUniformBlockIndex(N,B.name),O.set(B,Y))}function Ne(B,N){const Y=o.get(N).get(B);a.get(N)!==Y&&(n.uniformBlockBinding(N,Y,B.__bindingPointIndex),a.set(N,Y))}function wt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},X=null,re={},c={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,v=null,w=null,_=null,b=null,y=new ze(0,0,0),S=0,R=!1,E=null,C=null,L=null,W=null,P=null,Ie.set(0,0,n.canvas.width,n.canvas.height),Oe.set(0,0,n.canvas.width,n.canvas.height),i.reset(),r.reset(),s.reset()}return{buffers:{color:i,depth:r,stencil:s},enable:ue,disable:ce,bindFramebuffer:Me,drawBuffers:Fe,useProgram:Ge,setBlending:ht,setMaterial:Ye,setFlipSided:At,setCullFace:xe,setLineWidth:vt,setPolygonOffset:He,setScissorTest:Ve,activeTexture:T,bindTexture:x,unbindTexture:z,compressedTexImage2D:ee,compressedTexImage3D:ne,texImage2D:me,texImage3D:Je,updateUBOMapping:Re,uniformBlockBinding:Ne,texStorage2D:ke,texStorage3D:ie,texSubImage2D:j,texSubImage3D:Se,compressedTexSubImage2D:oe,compressedTexSubImage3D:ge,scissor:Qe,viewport:Be,reset:wt}}function Ch(n,e,t,A){const i=Gx(A);switch(t){case Up:return n*e;case Mp:return n*e;case bp:return n*e*2;case Po:return n*e/i.components*i.byteLength;case Ku:return n*e/i.components*i.byteLength;case Fp:return n*e*2/i.components*i.byteLength;case Wu:return n*e*2/i.components*i.byteLength;case Sp:return n*e*3/i.components*i.byteLength;case WA:return n*e*4/i.components*i.byteLength;case Xu:return n*e*4/i.components*i.byteLength;case Na:case Oa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ga:case Va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yc:case Sc:return Math.max(n,16)*Math.max(e,8)/4;case Ec:case Uc:return Math.max(n,8)*Math.max(e,8)/2;case Mc:case bc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Fc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Tc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ic:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Qc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Lc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Rc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Dc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Hc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Nc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Oc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Gc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Vc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case kc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case zc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ka:case Kc:case Wc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Tp:case Xc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Yc:case Jc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Gx(n){switch(n){case YA:case _p:return{byteLength:1,components:1};case ds:case Ep:case Fr:return{byteLength:2,components:1};case ku:case zu:return{byteLength:2,components:4};case Ei:case Vu:case wn:return{byteLength:4,components:1};case yp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Vx(n,e,t,A,i,r,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ue,c=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,x){return p?new OffscreenCanvas(T,x):ao("canvas")}function m(T,x,z){let ee=1;const ne=Ve(T);if((ne.width>z||ne.height>z)&&(ee=z/Math.max(ne.width,ne.height)),ee<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const j=Math.floor(ee*ne.width),Se=Math.floor(ee*ne.height);u===void 0&&(u=g(j,Se));const oe=x?g(j,Se):u;return oe.width=j,oe.height=Se,oe.getContext("2d").drawImage(T,0,0,j,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+j+"x"+Se+")."),oe}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),T;return T}function d(T){return T.generateMipmaps&&T.minFilter!==RA&&T.minFilter!==Jt}function h(T){n.generateMipmap(T)}function v(T,x,z,ee,ne=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let j=x;if(x===n.RED&&(z===n.FLOAT&&(j=n.R32F),z===n.HALF_FLOAT&&(j=n.R16F),z===n.UNSIGNED_BYTE&&(j=n.R8)),x===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.R8UI),z===n.UNSIGNED_SHORT&&(j=n.R16UI),z===n.UNSIGNED_INT&&(j=n.R32UI),z===n.BYTE&&(j=n.R8I),z===n.SHORT&&(j=n.R16I),z===n.INT&&(j=n.R32I)),x===n.RG&&(z===n.FLOAT&&(j=n.RG32F),z===n.HALF_FLOAT&&(j=n.RG16F),z===n.UNSIGNED_BYTE&&(j=n.RG8)),x===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RG8UI),z===n.UNSIGNED_SHORT&&(j=n.RG16UI),z===n.UNSIGNED_INT&&(j=n.RG32UI),z===n.BYTE&&(j=n.RG8I),z===n.SHORT&&(j=n.RG16I),z===n.INT&&(j=n.RG32I)),x===n.RGB&&z===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),x===n.RGBA){const Se=ne?Ao:ot.getTransfer(ee);z===n.FLOAT&&(j=n.RGBA32F),z===n.HALF_FLOAT&&(j=n.RGBA16F),z===n.UNSIGNED_BYTE&&(j=Se===gt?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function w(T,x){let z;return T?x===null||x===Ei||x===yr?z=n.DEPTH24_STENCIL8:x===wn?z=n.DEPTH32F_STENCIL8:x===ds&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Ei||x===yr?z=n.DEPTH_COMPONENT24:x===wn?z=n.DEPTH_COMPONENT32F:x===ds&&(z=n.DEPTH_COMPONENT16),z}function _(T,x){return d(T)===!0||T.isFramebufferTexture&&T.minFilter!==RA&&T.minFilter!==Jt?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function b(T){const x=T.target;x.removeEventListener("dispose",b),S(x),x.isVideoTexture&&c.delete(x)}function y(T){const x=T.target;x.removeEventListener("dispose",y),E(x)}function S(T){const x=A.get(T);if(x.__webglInit===void 0)return;const z=T.source,ee=f.get(z);if(ee){const ne=ee[x.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&R(T),Object.keys(ee).length===0&&f.delete(z)}A.remove(T)}function R(T){const x=A.get(T);n.deleteTexture(x.__webglTexture);const z=T.source,ee=f.get(z);delete ee[x.__cacheKey],s.memory.textures--}function E(T){const x=A.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(x.__webglFramebuffer[ee]))for(let ne=0;ne<x.__webglFramebuffer[ee].length;ne++)n.deleteFramebuffer(x.__webglFramebuffer[ee][ne]);else n.deleteFramebuffer(x.__webglFramebuffer[ee]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[ee])}else{if(Array.isArray(x.__webglFramebuffer))for(let ee=0;ee<x.__webglFramebuffer.length;ee++)n.deleteFramebuffer(x.__webglFramebuffer[ee]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let ee=0;ee<x.__webglColorRenderbuffer.length;ee++)x.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[ee]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const z=T.textures;for(let ee=0,ne=z.length;ee<ne;ee++){const j=A.get(z[ee]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),s.memory.textures--),A.remove(z[ee])}A.remove(T)}let C=0;function L(){C=0}function W(){const T=C;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),C+=1,T}function P(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function K(T,x){const z=A.get(T);if(T.isVideoTexture&&vt(T),T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){const ee=T.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Oe(z,T,x);return}}t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+x)}function Z(T,x){const z=A.get(T);if(T.version>0&&z.__version!==T.version){Oe(z,T,x);return}t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+x)}function V(T,x){const z=A.get(T);if(T.version>0&&z.__version!==T.version){Oe(z,T,x);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+x)}function q(T,x){const z=A.get(T);if(T.version>0&&z.__version!==T.version){J(z,T,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+x)}const X={[xc]:n.REPEAT,[SA]:n.CLAMP_TO_EDGE,[_c]:n.MIRRORED_REPEAT},re={[RA]:n.NEAREST,[I0]:n.NEAREST_MIPMAP_NEAREST,[Qs]:n.NEAREST_MIPMAP_LINEAR,[Jt]:n.LINEAR,[rl]:n.LINEAR_MIPMAP_NEAREST,[hi]:n.LINEAR_MIPMAP_LINEAR},ae={[D0]:n.NEVER,[V0]:n.ALWAYS,[P0]:n.LESS,[Qp]:n.LEQUAL,[H0]:n.EQUAL,[G0]:n.GEQUAL,[N0]:n.GREATER,[O0]:n.NOTEQUAL};function he(T,x){if(x.type===wn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Jt||x.magFilter===rl||x.magFilter===Qs||x.magFilter===hi||x.minFilter===Jt||x.minFilter===rl||x.minFilter===Qs||x.minFilter===hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,X[x.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,X[x.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,X[x.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,re[x.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,re[x.minFilter]),x.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,ae[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===RA||x.minFilter!==Qs&&x.minFilter!==hi||x.type===wn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||A.get(x).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),A.get(x).__currentAnisotropy=x.anisotropy}}}function Ie(T,x){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",b));const ee=x.source;let ne=f.get(ee);ne===void 0&&(ne={},f.set(ee,ne));const j=P(x);if(j!==T.__cacheKey){ne[j]===void 0&&(ne[j]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,z=!0),ne[j].usedTimes++;const Se=ne[T.__cacheKey];Se!==void 0&&(ne[T.__cacheKey].usedTimes--,Se.usedTimes===0&&R(x)),T.__cacheKey=j,T.__webglTexture=ne[j].texture}return z}function Oe(T,x,z){let ee=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(ee=n.TEXTURE_3D);const ne=Ie(T,x),j=x.source;t.bindTexture(ee,T.__webglTexture,n.TEXTURE0+z);const Se=A.get(j);if(j.version!==Se.__version||ne===!0){t.activeTexture(n.TEXTURE0+z);const oe=ot.getPrimaries(ot.workingColorSpace),ge=x.colorSpace===Hn?null:ot.getPrimaries(x.colorSpace),ke=x.colorSpace===Hn||oe===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let ie=m(x.image,!1,i.maxTextureSize);ie=He(x,ie);const me=r.convert(x.format,x.colorSpace),Je=r.convert(x.type);let Qe=v(x.internalFormat,me,Je,x.colorSpace,x.isVideoTexture);he(ee,x);let Be;const Re=x.mipmaps,Ne=x.isVideoTexture!==!0,wt=Se.__version===void 0||ne===!0,B=j.dataReady,N=_(x,ie);if(x.isDepthTexture)Qe=w(x.format===Ur,x.type),wt&&(Ne?t.texStorage2D(n.TEXTURE_2D,1,Qe,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,Qe,ie.width,ie.height,0,me,Je,null));else if(x.isDataTexture)if(Re.length>0){Ne&&wt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,Re[0].width,Re[0].height);for(let O=0,Y=Re.length;O<Y;O++)Be=Re[O],Ne?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Je,Be.data):t.texImage2D(n.TEXTURE_2D,O,Qe,Be.width,Be.height,0,me,Je,Be.data);x.generateMipmaps=!1}else Ne?(wt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,ie.width,ie.height),B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ie.width,ie.height,me,Je,ie.data)):t.texImage2D(n.TEXTURE_2D,0,Qe,ie.width,ie.height,0,me,Je,ie.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ne&&wt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Qe,Re[0].width,Re[0].height,ie.depth);for(let O=0,Y=Re.length;O<Y;O++)if(Be=Re[O],x.format!==WA)if(me!==null)if(Ne){if(B)if(x.layerUpdates.size>0){const te=Ch(Be.width,Be.height,x.format,x.type);for(const _e of x.layerUpdates){const De=Be.data.subarray(_e*te/Be.data.BYTES_PER_ELEMENT,(_e+1)*te/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,_e,Be.width,Be.height,1,me,De,0,0)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ie.depth,me,Be.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,O,Qe,Be.width,Be.height,ie.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ie.depth,me,Je,Be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,O,Qe,Be.width,Be.height,ie.depth,0,me,Je,Be.data)}else{Ne&&wt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,Re[0].width,Re[0].height);for(let O=0,Y=Re.length;O<Y;O++)Be=Re[O],x.format!==WA?me!==null?Ne?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Be.data):t.compressedTexImage2D(n.TEXTURE_2D,O,Qe,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Je,Be.data):t.texImage2D(n.TEXTURE_2D,O,Qe,Be.width,Be.height,0,me,Je,Be.data)}else if(x.isDataArrayTexture)if(Ne){if(wt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Qe,ie.width,ie.height,ie.depth),B)if(x.layerUpdates.size>0){const O=Ch(ie.width,ie.height,x.format,x.type);for(const Y of x.layerUpdates){const te=ie.data.subarray(Y*O/ie.data.BYTES_PER_ELEMENT,(Y+1)*O/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,ie.width,ie.height,1,me,Je,te)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,me,Je,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Qe,ie.width,ie.height,ie.depth,0,me,Je,ie.data);else if(x.isData3DTexture)Ne?(wt&&t.texStorage3D(n.TEXTURE_3D,N,Qe,ie.width,ie.height,ie.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,me,Je,ie.data)):t.texImage3D(n.TEXTURE_3D,0,Qe,ie.width,ie.height,ie.depth,0,me,Je,ie.data);else if(x.isFramebufferTexture){if(wt)if(Ne)t.texStorage2D(n.TEXTURE_2D,N,Qe,ie.width,ie.height);else{let O=ie.width,Y=ie.height;for(let te=0;te<N;te++)t.texImage2D(n.TEXTURE_2D,te,Qe,O,Y,0,me,Je,null),O>>=1,Y>>=1}}else if(Re.length>0){if(Ne&&wt){const O=Ve(Re[0]);t.texStorage2D(n.TEXTURE_2D,N,Qe,O.width,O.height)}for(let O=0,Y=Re.length;O<Y;O++)Be=Re[O],Ne?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,me,Je,Be):t.texImage2D(n.TEXTURE_2D,O,Qe,me,Je,Be);x.generateMipmaps=!1}else if(Ne){if(wt){const O=Ve(ie);t.texStorage2D(n.TEXTURE_2D,N,Qe,O.width,O.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,Je,ie)}else t.texImage2D(n.TEXTURE_2D,0,Qe,me,Je,ie);d(x)&&h(ee),Se.__version=j.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function J(T,x,z){if(x.image.length!==6)return;const ee=Ie(T,x),ne=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+z);const j=A.get(ne);if(ne.version!==j.__version||ee===!0){t.activeTexture(n.TEXTURE0+z);const Se=ot.getPrimaries(ot.workingColorSpace),oe=x.colorSpace===Hn?null:ot.getPrimaries(x.colorSpace),ge=x.colorSpace===Hn||Se===oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const ke=x.isCompressedTexture||x.image[0].isCompressedTexture,ie=x.image[0]&&x.image[0].isDataTexture,me=[];for(let Y=0;Y<6;Y++)!ke&&!ie?me[Y]=m(x.image[Y],!0,i.maxCubemapSize):me[Y]=ie?x.image[Y].image:x.image[Y],me[Y]=He(x,me[Y]);const Je=me[0],Qe=r.convert(x.format,x.colorSpace),Be=r.convert(x.type),Re=v(x.internalFormat,Qe,Be,x.colorSpace),Ne=x.isVideoTexture!==!0,wt=j.__version===void 0||ee===!0,B=ne.dataReady;let N=_(x,Je);he(n.TEXTURE_CUBE_MAP,x);let O;if(ke){Ne&&wt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Re,Je.width,Je.height);for(let Y=0;Y<6;Y++){O=me[Y].mipmaps;for(let te=0;te<O.length;te++){const _e=O[te];x.format!==WA?Qe!==null?Ne?B&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te,0,0,_e.width,_e.height,Qe,_e.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te,Re,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te,0,0,_e.width,_e.height,Qe,Be,_e.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te,Re,_e.width,_e.height,0,Qe,Be,_e.data)}}}else{if(O=x.mipmaps,Ne&&wt){O.length>0&&N++;const Y=Ve(me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Re,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ie){Ne?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,me[Y].width,me[Y].height,Qe,Be,me[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Re,me[Y].width,me[Y].height,0,Qe,Be,me[Y].data);for(let te=0;te<O.length;te++){const De=O[te].image[Y].image;Ne?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te+1,0,0,De.width,De.height,Qe,Be,De.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te+1,Re,De.width,De.height,0,Qe,Be,De.data)}}else{Ne?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Qe,Be,me[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Re,Qe,Be,me[Y]);for(let te=0;te<O.length;te++){const _e=O[te];Ne?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te+1,0,0,Qe,Be,_e.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,te+1,Re,Qe,Be,_e.image[Y])}}}d(x)&&h(n.TEXTURE_CUBE_MAP),j.__version=ne.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function $(T,x,z,ee,ne,j){const Se=r.convert(z.format,z.colorSpace),oe=r.convert(z.type),ge=v(z.internalFormat,Se,oe,z.colorSpace);if(!A.get(x).__hasExternalTextures){const ie=Math.max(1,x.width>>j),me=Math.max(1,x.height>>j);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,j,ge,ie,me,x.depth,0,Se,oe,null):t.texImage2D(ne,j,ge,ie,me,0,Se,oe,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),xe(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,ne,A.get(z).__webglTexture,0,At(x)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,ne,A.get(z).__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ue(T,x,z){if(n.bindRenderbuffer(n.RENDERBUFFER,T),x.depthBuffer){const ee=x.depthTexture,ne=ee&&ee.isDepthTexture?ee.type:null,j=w(x.stencilBuffer,ne),Se=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=At(x);xe(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,oe,j,x.width,x.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,oe,j,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,j,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Se,n.RENDERBUFFER,T)}else{const ee=x.textures;for(let ne=0;ne<ee.length;ne++){const j=ee[ne],Se=r.convert(j.format,j.colorSpace),oe=r.convert(j.type),ge=v(j.internalFormat,Se,oe,j.colorSpace),ke=At(x);z&&xe(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ke,ge,x.width,x.height):xe(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ke,ge,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ge,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ce(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!A.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),K(x.depthTexture,0);const ee=A.get(x.depthTexture).__webglTexture,ne=At(x);if(x.depthTexture.format===hr)xe(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(x.depthTexture.format===Ur)xe(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Me(T){const x=A.get(T),z=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");ce(x.__webglFramebuffer,T)}else if(z){x.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[ee]),x.__webglDepthbuffer[ee]=n.createRenderbuffer(),ue(x.__webglDepthbuffer[ee],T,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer=n.createRenderbuffer(),ue(x.__webglDepthbuffer,T,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Fe(T,x,z){const ee=A.get(T);x!==void 0&&$(ee.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Me(T)}function Ge(T){const x=T.texture,z=A.get(T),ee=A.get(x);T.addEventListener("dispose",y);const ne=T.textures,j=T.isWebGLCubeRenderTarget===!0,Se=ne.length>1;if(Se||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=x.version,s.memory.textures++),j){z.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer[oe]=[];for(let ge=0;ge<x.mipmaps.length;ge++)z.__webglFramebuffer[oe][ge]=n.createFramebuffer()}else z.__webglFramebuffer[oe]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){z.__webglFramebuffer=[];for(let oe=0;oe<x.mipmaps.length;oe++)z.__webglFramebuffer[oe]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Se)for(let oe=0,ge=ne.length;oe<ge;oe++){const ke=A.get(ne[oe]);ke.__webglTexture===void 0&&(ke.__webglTexture=n.createTexture(),s.memory.textures++)}if(T.samples>0&&xe(T)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let oe=0;oe<ne.length;oe++){const ge=ne[oe];z.__webglColorRenderbuffer[oe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[oe]);const ke=r.convert(ge.format,ge.colorSpace),ie=r.convert(ge.type),me=v(ge.internalFormat,ke,ie,ge.colorSpace,T.isXRRenderTarget===!0),Je=At(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Je,me,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+oe,n.RENDERBUFFER,z.__webglColorRenderbuffer[oe])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),ue(z.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),he(n.TEXTURE_CUBE_MAP,x);for(let oe=0;oe<6;oe++)if(x.mipmaps&&x.mipmaps.length>0)for(let ge=0;ge<x.mipmaps.length;ge++)$(z.__webglFramebuffer[oe][ge],T,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ge);else $(z.__webglFramebuffer[oe],T,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);d(x)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let oe=0,ge=ne.length;oe<ge;oe++){const ke=ne[oe],ie=A.get(ke);t.bindTexture(n.TEXTURE_2D,ie.__webglTexture),he(n.TEXTURE_2D,ke),$(z.__webglFramebuffer,T,ke,n.COLOR_ATTACHMENT0+oe,n.TEXTURE_2D,0),d(ke)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let oe=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(oe=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,ee.__webglTexture),he(oe,x),x.mipmaps&&x.mipmaps.length>0)for(let ge=0;ge<x.mipmaps.length;ge++)$(z.__webglFramebuffer[ge],T,x,n.COLOR_ATTACHMENT0,oe,ge);else $(z.__webglFramebuffer,T,x,n.COLOR_ATTACHMENT0,oe,0);d(x)&&h(oe),t.unbindTexture()}T.depthBuffer&&Me(T)}function tt(T){const x=T.textures;for(let z=0,ee=x.length;z<ee;z++){const ne=x[z];if(d(ne)){const j=T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Se=A.get(ne).__webglTexture;t.bindTexture(j,Se),h(j),t.unbindTexture()}}}const Q=[],ht=[];function Ye(T){if(T.samples>0){if(xe(T)===!1){const x=T.textures,z=T.width,ee=T.height;let ne=n.COLOR_BUFFER_BIT;const j=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Se=A.get(T),oe=x.length>1;if(oe)for(let ge=0;ge<x.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let ge=0;ge<x.length;ge++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),oe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const ke=A.get(x[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ke,0)}n.blitFramebuffer(0,0,z,ee,0,0,z,ee,ne,n.NEAREST),o===!0&&(Q.length=0,ht.length=0,Q.push(n.COLOR_ATTACHMENT0+ge),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Q.push(j),ht.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ht)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),oe)for(let ge=0;ge<x.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Se.__webglColorRenderbuffer[ge]);const ke=A.get(x[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Se.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&o){const x=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function At(T){return Math.min(i.maxSamples,T.samples)}function xe(T){const x=A.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function vt(T){const x=s.render.frame;c.get(T)!==x&&(c.set(T,x),T.update())}function He(T,x){const z=T.colorSpace,ee=T.format,ne=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==ei&&z!==Hn&&(ot.getTransfer(z)===gt?(ee!==WA||ne!==YA)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),x}function Ve(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=L,this.setTexture2D=K,this.setTexture2DArray=Z,this.setTexture3D=V,this.setTextureCube=q,this.rebindTextures=Fe,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=tt,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Me,this.setupFrameBufferTexture=$,this.useMultisampledRTT=xe}function kx(n,e){function t(A,i=Hn){let r;const s=ot.getTransfer(i);if(A===YA)return n.UNSIGNED_BYTE;if(A===ku)return n.UNSIGNED_SHORT_4_4_4_4;if(A===zu)return n.UNSIGNED_SHORT_5_5_5_1;if(A===yp)return n.UNSIGNED_INT_5_9_9_9_REV;if(A===_p)return n.BYTE;if(A===Ep)return n.SHORT;if(A===ds)return n.UNSIGNED_SHORT;if(A===Vu)return n.INT;if(A===Ei)return n.UNSIGNED_INT;if(A===wn)return n.FLOAT;if(A===Fr)return n.HALF_FLOAT;if(A===Up)return n.ALPHA;if(A===Sp)return n.RGB;if(A===WA)return n.RGBA;if(A===Mp)return n.LUMINANCE;if(A===bp)return n.LUMINANCE_ALPHA;if(A===hr)return n.DEPTH_COMPONENT;if(A===Ur)return n.DEPTH_STENCIL;if(A===Po)return n.RED;if(A===Ku)return n.RED_INTEGER;if(A===Fp)return n.RG;if(A===Wu)return n.RG_INTEGER;if(A===Xu)return n.RGBA_INTEGER;if(A===Na||A===Oa||A===Ga||A===Va)if(s===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(A===Na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(A===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(A===Ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(A===Va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(A===Na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(A===Oa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(A===Ga)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(A===Va)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(A===Ec||A===yc||A===Uc||A===Sc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(A===Ec)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(A===yc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(A===Uc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(A===Sc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(A===Mc||A===bc||A===Fc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(A===Mc||A===bc)return s===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(A===Fc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(A===Tc||A===Ic||A===Qc||A===Lc||A===Rc||A===Dc||A===Pc||A===Hc||A===Nc||A===Oc||A===Gc||A===Vc||A===kc||A===zc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(A===Tc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(A===Ic)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(A===Qc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(A===Lc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(A===Rc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(A===Dc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(A===Pc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(A===Hc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(A===Nc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(A===Oc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(A===Gc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(A===Vc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(A===kc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(A===zc)return s===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(A===ka||A===Kc||A===Wc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(A===ka)return s===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(A===Kc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(A===Wc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(A===Tp||A===Xc||A===Yc||A===Jc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(A===ka)return r.COMPRESSED_RED_RGTC1_EXT;if(A===Xc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(A===Yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(A===Jc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return A===yr?n.UNSIGNED_INT_24_8:n[A]!==void 0?n[A]:null}return{convert:t}}class zx extends EA{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class tn extends aA{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Kx={type:"move"};class Tl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const A of e.hand.values())this._getHandJoint(t,A)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,A){let i=null,r=null,s=null;const a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){s=!0;for(const m of e.hand.values()){const d=t.getJointPose(m,A),h=this._getHandJoint(l,m);d!==null&&(h.matrix.fromArray(d.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=d.radius),h.visible=d!==null}const c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=c.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,A),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,A),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Kx)))}return a!==null&&(a.visible=i!==null),o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const A=new tn;A.matrixAutoUpdate=!1,A.visible=!1,e.joints[t.jointName]=A,e.add(A)}return e.joints[t.jointName]}}const Wx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xx=`
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

}`;class Yx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,A){if(this.texture===null){const i=new fA,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=A.depthNear||t.depthFar!=A.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,A=new Vt({vertexShader:Wx,fragmentShader:Xx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xt(new jn(20,20),A)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Jx extends Si{constructor(e,t){super();const A=this;let i=null,r=1,s=null,a="local-floor",o=1,l=null,c=null,u=null,f=null,p=null,g=null;const m=new Yx,d=t.getContextAttributes();let h=null,v=null;const w=[],_=[],b=new Ue;let y=null;const S=new EA;S.layers.enable(1),S.viewport=new ct;const R=new EA;R.layers.enable(2),R.viewport=new ct;const E=[S,R],C=new zx;C.layers.enable(1),C.layers.enable(2);let L=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let $=w[J];return $===void 0&&($=new Tl,w[J]=$),$.getTargetRaySpace()},this.getControllerGrip=function(J){let $=w[J];return $===void 0&&($=new Tl,w[J]=$),$.getGripSpace()},this.getHand=function(J){let $=w[J];return $===void 0&&($=new Tl,w[J]=$),$.getHandSpace()};function P(J){const $=_.indexOf(J.inputSource);if($===-1)return;const ue=w[$];ue!==void 0&&(ue.update(J.inputSource,J.frame,l||s),ue.dispatchEvent({type:J.type,data:J.inputSource}))}function K(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",K),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<w.length;J++){const $=_[J];$!==null&&(_[J]=null,w[J].disconnect($))}L=null,W=null,m.reset(),e.setRenderTarget(h),p=null,f=null,u=null,i=null,v=null,Oe.stop(),A.isPresenting=!1,e.setPixelRatio(y),e.setSize(b.width,b.height,!1),A.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||s},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(h=e.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",K),i.addEventListener("inputsourceschange",Z),d.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(b),i.renderState.layers===void 0){const $={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,t,$),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new qn(p.framebufferWidth,p.framebufferHeight,{format:WA,type:YA,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let $=null,ue=null,ce=null;d.depth&&(ce=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=d.stencil?Ur:hr,ue=d.stencil?yr:Ei);const Me={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(Me),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new qn(f.textureWidth,f.textureHeight,{format:WA,type:YA,depthTexture:new Wp(f.textureWidth,f.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(o),l=null,s=await i.requestReferenceSpace(a),Oe.setContext(i),Oe.start(),A.isPresenting=!0,A.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(J){for(let $=0;$<J.removed.length;$++){const ue=J.removed[$],ce=_.indexOf(ue);ce>=0&&(_[ce]=null,w[ce].disconnect(ue))}for(let $=0;$<J.added.length;$++){const ue=J.added[$];let ce=_.indexOf(ue);if(ce===-1){for(let Fe=0;Fe<w.length;Fe++)if(Fe>=_.length){_.push(ue),ce=Fe;break}else if(_[Fe]===null){_[Fe]=ue,ce=Fe;break}if(ce===-1)break}const Me=w[ce];Me&&Me.connect(ue)}}const V=new I,q=new I;function X(J,$,ue){V.setFromMatrixPosition($.matrixWorld),q.setFromMatrixPosition(ue.matrixWorld);const ce=V.distanceTo(q),Me=$.projectionMatrix.elements,Fe=ue.projectionMatrix.elements,Ge=Me[14]/(Me[10]-1),tt=Me[14]/(Me[10]+1),Q=(Me[9]+1)/Me[5],ht=(Me[9]-1)/Me[5],Ye=(Me[8]-1)/Me[0],At=(Fe[8]+1)/Fe[0],xe=Ge*Ye,vt=Ge*At,He=ce/(-Ye+At),Ve=He*-Ye;$.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ve),J.translateZ(He),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();const T=Ge+He,x=tt+He,z=xe-Ve,ee=vt+(ce-Ve),ne=Q*tt/x*T,j=ht*tt/x*T;J.projectionMatrix.makePerspective(z,ee,ne,j,T,x),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function re(J,$){$===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices($.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;m.texture!==null&&(J.near=m.depthNear,J.far=m.depthFar),C.near=R.near=S.near=J.near,C.far=R.far=S.far=J.far,(L!==C.near||W!==C.far)&&(i.updateRenderState({depthNear:C.near,depthFar:C.far}),L=C.near,W=C.far,S.near=L,S.far=W,R.near=L,R.far=W,S.updateProjectionMatrix(),R.updateProjectionMatrix(),J.updateProjectionMatrix());const $=J.parent,ue=C.cameras;re(C,$);for(let ce=0;ce<ue.length;ce++)re(ue[ce],$);ue.length===2?X(C,S,R):C.projectionMatrix.copy(S.projectionMatrix),ae(J,C,$)};function ae(J,$,ue){ue===null?J.matrix.copy($.matrixWorld):(J.matrix.copy(ue.matrixWorld),J.matrix.invert(),J.matrix.multiply($.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy($.projectionMatrix),J.projectionMatrixInverse.copy($.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Zc*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(f===null&&p===null))return o},this.setFoveation=function(J){o=J,f!==null&&(f.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(C)};let he=null;function Ie(J,$){if(c=$.getViewerPose(l||s),g=$,c!==null){const ue=c.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ce=!1;ue.length!==C.cameras.length&&(C.cameras.length=0,ce=!0);for(let Fe=0;Fe<ue.length;Fe++){const Ge=ue[Fe];let tt=null;if(p!==null)tt=p.getViewport(Ge);else{const ht=u.getViewSubImage(f,Ge);tt=ht.viewport,Fe===0&&(e.setRenderTargetTextures(v,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),e.setRenderTarget(v))}let Q=E[Fe];Q===void 0&&(Q=new EA,Q.layers.enable(Fe),Q.viewport=new ct,E[Fe]=Q),Q.matrix.fromArray(Ge.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(Ge.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(tt.x,tt.y,tt.width,tt.height),Fe===0&&(C.matrix.copy(Q.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),ce===!0&&C.cameras.push(Q)}const Me=i.enabledFeatures;if(Me&&Me.includes("depth-sensing")){const Fe=u.getDepthInformation(ue[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(e,Fe,i.renderState)}}for(let ue=0;ue<w.length;ue++){const ce=_[ue],Me=w[ue];ce!==null&&Me!==void 0&&Me.update(ce,$,l||s)}he&&he(J,$),$.detectedPlanes&&A.dispatchEvent({type:"planesdetected",data:$}),g=null}const Oe=new zp;Oe.setAnimationLoop(Ie),this.setAnimationLoop=function(J){he=J},this.dispose=function(){}}}const ai=new rn,Zx=new ut;function qx(n,e){function t(d,h){d.matrixAutoUpdate===!0&&d.updateMatrix(),h.value.copy(d.matrix)}function A(d,h){h.color.getRGB(d.fogColor.value,Op(n)),h.isFog?(d.fogNear.value=h.near,d.fogFar.value=h.far):h.isFogExp2&&(d.fogDensity.value=h.density)}function i(d,h,v,w,_){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(d,h):h.isMeshToonMaterial?(r(d,h),u(d,h)):h.isMeshPhongMaterial?(r(d,h),c(d,h)):h.isMeshStandardMaterial?(r(d,h),f(d,h),h.isMeshPhysicalMaterial&&p(d,h,_)):h.isMeshMatcapMaterial?(r(d,h),g(d,h)):h.isMeshDepthMaterial?r(d,h):h.isMeshDistanceMaterial?(r(d,h),m(d,h)):h.isMeshNormalMaterial?r(d,h):h.isLineBasicMaterial?(s(d,h),h.isLineDashedMaterial&&a(d,h)):h.isPointsMaterial?o(d,h,v,w):h.isSpriteMaterial?l(d,h):h.isShadowMaterial?(d.color.value.copy(h.color),d.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(d,h){d.opacity.value=h.opacity,h.color&&d.diffuse.value.copy(h.color),h.emissive&&d.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.bumpMap&&(d.bumpMap.value=h.bumpMap,t(h.bumpMap,d.bumpMapTransform),d.bumpScale.value=h.bumpScale,h.side===$t&&(d.bumpScale.value*=-1)),h.normalMap&&(d.normalMap.value=h.normalMap,t(h.normalMap,d.normalMapTransform),d.normalScale.value.copy(h.normalScale),h.side===$t&&d.normalScale.value.negate()),h.displacementMap&&(d.displacementMap.value=h.displacementMap,t(h.displacementMap,d.displacementMapTransform),d.displacementScale.value=h.displacementScale,d.displacementBias.value=h.displacementBias),h.emissiveMap&&(d.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,d.emissiveMapTransform)),h.specularMap&&(d.specularMap.value=h.specularMap,t(h.specularMap,d.specularMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest);const v=e.get(h),w=v.envMap,_=v.envMapRotation;w&&(d.envMap.value=w,ai.copy(_),ai.x*=-1,ai.y*=-1,ai.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),d.envMapRotation.value.setFromMatrix4(Zx.makeRotationFromEuler(ai)),d.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=h.reflectivity,d.ior.value=h.ior,d.refractionRatio.value=h.refractionRatio),h.lightMap&&(d.lightMap.value=h.lightMap,d.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,d.lightMapTransform)),h.aoMap&&(d.aoMap.value=h.aoMap,d.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,d.aoMapTransform))}function s(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform))}function a(d,h){d.dashSize.value=h.dashSize,d.totalSize.value=h.dashSize+h.gapSize,d.scale.value=h.scale}function o(d,h,v,w){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.size.value=h.size*v,d.scale.value=w*.5,h.map&&(d.map.value=h.map,t(h.map,d.uvTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function l(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.rotation.value=h.rotation,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function c(d,h){d.specular.value.copy(h.specular),d.shininess.value=Math.max(h.shininess,1e-4)}function u(d,h){h.gradientMap&&(d.gradientMap.value=h.gradientMap)}function f(d,h){d.metalness.value=h.metalness,h.metalnessMap&&(d.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,d.metalnessMapTransform)),d.roughness.value=h.roughness,h.roughnessMap&&(d.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,d.roughnessMapTransform)),h.envMap&&(d.envMapIntensity.value=h.envMapIntensity)}function p(d,h,v){d.ior.value=h.ior,h.sheen>0&&(d.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),d.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(d.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,d.sheenColorMapTransform)),h.sheenRoughnessMap&&(d.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,d.sheenRoughnessMapTransform))),h.clearcoat>0&&(d.clearcoat.value=h.clearcoat,d.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(d.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,d.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(d.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===$t&&d.clearcoatNormalScale.value.negate())),h.dispersion>0&&(d.dispersion.value=h.dispersion),h.iridescence>0&&(d.iridescence.value=h.iridescence,d.iridescenceIOR.value=h.iridescenceIOR,d.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(d.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,d.iridescenceMapTransform)),h.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),h.transmission>0&&(d.transmission.value=h.transmission,d.transmissionSamplerMap.value=v.texture,d.transmissionSamplerSize.value.set(v.width,v.height),h.transmissionMap&&(d.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,d.transmissionMapTransform)),d.thickness.value=h.thickness,h.thicknessMap&&(d.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=h.attenuationDistance,d.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(d.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(d.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=h.specularIntensity,d.specularColor.value.copy(h.specularColor),h.specularColorMap&&(d.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,d.specularColorMapTransform)),h.specularIntensityMap&&(d.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,d.specularIntensityMapTransform))}function g(d,h){h.matcap&&(d.matcap.value=h.matcap)}function m(d,h){const v=e.get(h).light;d.referencePosition.value.setFromMatrixPosition(v.matrixWorld),d.nearDistance.value=v.shadow.camera.near,d.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:A,refreshMaterialUniforms:i}}function jx(n,e,t,A){let i={},r={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function o(v,w){const _=w.program;A.uniformBlockBinding(v,_)}function l(v,w){let _=i[v.id];_===void 0&&(g(v),_=c(v),i[v.id]=_,v.addEventListener("dispose",d));const b=w.program;A.updateUBOMapping(v,b);const y=e.render.frame;r[v.id]!==y&&(f(v),r[v.id]=y)}function c(v){const w=u();v.__bindingPointIndex=w;const _=n.createBuffer(),b=v.__size,y=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,b,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,_),_}function u(){for(let v=0;v<a;v++)if(s.indexOf(v)===-1)return s.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const w=i[v.id],_=v.uniforms,b=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let y=0,S=_.length;y<S;y++){const R=Array.isArray(_[y])?_[y]:[_[y]];for(let E=0,C=R.length;E<C;E++){const L=R[E];if(p(L,y,E,b)===!0){const W=L.__offset,P=Array.isArray(L.value)?L.value:[L.value];let K=0;for(let Z=0;Z<P.length;Z++){const V=P[Z],q=m(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,W+K,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,K),K+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,W,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(v,w,_,b){const y=v.value,S=w+"_"+_;if(b[S]===void 0)return typeof y=="number"||typeof y=="boolean"?b[S]=y:b[S]=y.clone(),!0;{const R=b[S];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return b[S]=y,!0}else if(R.equals(y)===!1)return R.copy(y),!0}return!1}function g(v){const w=v.uniforms;let _=0;const b=16;for(let S=0,R=w.length;S<R;S++){const E=Array.isArray(w[S])?w[S]:[w[S]];for(let C=0,L=E.length;C<L;C++){const W=E[C],P=Array.isArray(W.value)?W.value:[W.value];for(let K=0,Z=P.length;K<Z;K++){const V=P[K],q=m(V),X=_%b,re=X%q.boundary,ae=X+re;_+=re,ae!==0&&b-ae<q.storage&&(_+=b-ae),W.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=_,_+=q.storage}}}const y=_%b;return y>0&&(_+=b-y),v.__size=_,v.__cache={},this}function m(v){const w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),w}function d(v){const w=v.target;w.removeEventListener("dispose",d);const _=s.indexOf(w.__bindingPointIndex);s.splice(_,1),n.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function h(){for(const v in i)n.deleteBuffer(i[v]);s=[],i={},r={}}return{bind:o,update:l,dispose:h}}class jc{constructor(e={}){const{canvas:t=K0(),context:A=null,depth:i=!0,stencil:r=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(A!==null){if(typeof WebGLRenderingContext<"u"&&A instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=A.getContextAttributes().alpha}else f=s;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,d=null;const h=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=zA,this.toneMapping=Kn,this.toneMappingExposure=1;const w=this;let _=!1,b=0,y=0,S=null,R=-1,E=null;const C=new ct,L=new ct;let W=null;const P=new ze(0);let K=0,Z=t.width,V=t.height,q=1,X=null,re=null;const ae=new ct(0,0,Z,V),he=new ct(0,0,Z,V);let Ie=!1;const Oe=new qu;let J=!1,$=!1;const ue=new ut,ce=new I,Me=new ct,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function tt(){return S===null?q:1}let Q=A;function ht(U,D){return t.getContext(U,D)}try{const U={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Gu}`),t.addEventListener("webglcontextlost",O,!1),t.addEventListener("webglcontextrestored",Y,!1),t.addEventListener("webglcontextcreationerror",te,!1),Q===null){const D="webgl2";if(Q=ht(D,U),Q===null)throw ht(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(U){throw console.error("THREE.WebGLRenderer: "+U.message),U}let Ye,At,xe,vt,He,Ve,T,x,z,ee,ne,j,Se,oe,ge,ke,ie,me,Je,Qe,Be,Re,Ne,wt;function B(){Ye=new rC(Q),Ye.init(),Re=new kx(Q,Ye),At=new $w(Q,Ye,e,Re),xe=new Ox(Q),vt=new oC(Q),He=new Ux,Ve=new Vx(Q,Ye,xe,He,At,Re,vt),T=new tC(w),x=new iC(w),z=new pB(Q),Ne=new qw(Q,z),ee=new sC(Q,z,vt,Ne),ne=new cC(Q,ee,z,vt),Je=new lC(Q,At,Ve),ke=new eC(He),j=new yx(w,T,x,Ye,At,Ne,ke),Se=new qx(w,He),oe=new Mx,ge=new Lx(Ye),me=new Zw(w,T,x,xe,ne,f,o),ie=new Nx(w,ne,At),wt=new jx(Q,vt,At,xe),Qe=new jw(Q,Ye,vt),Be=new aC(Q,Ye,vt),vt.programs=j.programs,w.capabilities=At,w.extensions=Ye,w.properties=He,w.renderLists=oe,w.shadowMap=ie,w.state=xe,w.info=vt}B();const N=new Jx(w,Q);this.xr=N,this.getContext=function(){return Q},this.getContextAttributes=function(){return Q.getContextAttributes()},this.forceContextLoss=function(){const U=Ye.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=Ye.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(U){U!==void 0&&(q=U,this.setSize(Z,V,!1))},this.getSize=function(U){return U.set(Z,V)},this.setSize=function(U,D,G=!0){if(N.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=U,V=D,t.width=Math.floor(U*q),t.height=Math.floor(D*q),G===!0&&(t.style.width=U+"px",t.style.height=D+"px"),this.setViewport(0,0,U,D)},this.getDrawingBufferSize=function(U){return U.set(Z*q,V*q).floor()},this.setDrawingBufferSize=function(U,D,G){Z=U,V=D,q=G,t.width=Math.floor(U*G),t.height=Math.floor(D*G),this.setViewport(0,0,U,D)},this.getCurrentViewport=function(U){return U.copy(C)},this.getViewport=function(U){return U.copy(ae)},this.setViewport=function(U,D,G,k){U.isVector4?ae.set(U.x,U.y,U.z,U.w):ae.set(U,D,G,k),xe.viewport(C.copy(ae).multiplyScalar(q).round())},this.getScissor=function(U){return U.copy(he)},this.setScissor=function(U,D,G,k){U.isVector4?he.set(U.x,U.y,U.z,U.w):he.set(U,D,G,k),xe.scissor(L.copy(he).multiplyScalar(q).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(U){xe.setScissorTest(Ie=U)},this.setOpaqueSort=function(U){X=U},this.setTransparentSort=function(U){re=U},this.getClearColor=function(U){return U.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor.apply(me,arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha.apply(me,arguments)},this.clear=function(U=!0,D=!0,G=!0){let k=0;if(U){let H=!1;if(S!==null){const se=S.texture.format;H=se===Xu||se===Wu||se===Ku}if(H){const se=S.texture.type,de=se===YA||se===Ei||se===ds||se===yr||se===ku||se===zu,ve=me.getClearColor(),we=me.getClearAlpha(),Le=ve.r,Pe=ve.g,be=ve.b;de?(p[0]=Le,p[1]=Pe,p[2]=be,p[3]=we,Q.clearBufferuiv(Q.COLOR,0,p)):(g[0]=Le,g[1]=Pe,g[2]=be,g[3]=we,Q.clearBufferiv(Q.COLOR,0,g))}else k|=Q.COLOR_BUFFER_BIT}D&&(k|=Q.DEPTH_BUFFER_BIT),G&&(k|=Q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Q.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",O,!1),t.removeEventListener("webglcontextrestored",Y,!1),t.removeEventListener("webglcontextcreationerror",te,!1),oe.dispose(),ge.dispose(),He.dispose(),T.dispose(),x.dispose(),ne.dispose(),Ne.dispose(),wt.dispose(),j.dispose(),N.dispose(),N.removeEventListener("sessionstart",Ft),N.removeEventListener("sessionend",yn),zt.stop()};function O(U){U.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function Y(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const U=vt.autoReset,D=ie.enabled,G=ie.autoUpdate,k=ie.needsUpdate,H=ie.type;B(),vt.autoReset=U,ie.enabled=D,ie.autoUpdate=G,ie.needsUpdate=k,ie.type=H}function te(U){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function _e(U){const D=U.target;D.removeEventListener("dispose",_e),De(D)}function De(U){Ut(U),He.remove(U)}function Ut(U){const D=He.get(U).programs;D!==void 0&&(D.forEach(function(G){j.releaseProgram(G)}),U.isShaderMaterial&&j.releaseShaderCache(U))}this.renderBufferDirect=function(U,D,G,k,H,se){D===null&&(D=Fe);const de=H.isMesh&&H.matrixWorld.determinant()<0,ve=km(U,D,G,k,H);xe.setMaterial(k,de);let we=G.index,Le=1;if(k.wireframe===!0){if(we=ee.getWireframeAttribute(G),we===void 0)return;Le=2}const Pe=G.drawRange,be=G.attributes.position;let it=Pe.start*Le,_t=(Pe.start+Pe.count)*Le;se!==null&&(it=Math.max(it,se.start*Le),_t=Math.min(_t,(se.start+se.count)*Le)),we!==null?(it=Math.max(it,0),_t=Math.min(_t,we.count)):be!=null&&(it=Math.max(it,0),_t=Math.min(_t,be.count));const Et=_t-it;if(Et<0||Et===1/0)return;Ne.setup(H,k,ve,G,we);let gA,rt=Qe;if(we!==null&&(gA=z.get(we),rt=Be,rt.setIndex(gA)),H.isMesh)k.wireframe===!0?(xe.setLineWidth(k.wireframeLinewidth*tt()),rt.setMode(Q.LINES)):rt.setMode(Q.TRIANGLES);else if(H.isLine){let ye=k.linewidth;ye===void 0&&(ye=1),xe.setLineWidth(ye*tt()),H.isLineSegments?rt.setMode(Q.LINES):H.isLineLoop?rt.setMode(Q.LINE_LOOP):rt.setMode(Q.LINE_STRIP)}else H.isPoints?rt.setMode(Q.POINTS):H.isSprite&&rt.setMode(Q.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)rt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))rt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const ye=H._multiDrawStarts,Kt=H._multiDrawCounts,st=H._multiDrawCount,HA=we?z.get(we).bytesPerElement:1,Fi=He.get(k).currentProgram.getUniforms();for(let mA=0;mA<st;mA++)Fi.setValue(Q,"_gl_DrawID",mA),rt.render(ye[mA]/HA,Kt[mA])}else if(H.isInstancedMesh)rt.renderInstances(it,Et,H.count);else if(G.isInstancedBufferGeometry){const ye=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Kt=Math.min(G.instanceCount,ye);rt.renderInstances(it,Et,Kt)}else rt.render(it,Et)};function Lt(U,D,G){U.transparent===!0&&U.side===UA&&U.forceSinglePass===!1?(U.side=$t,U.needsUpdate=!0,Is(U,D,G),U.side=Zn,U.needsUpdate=!0,Is(U,D,G),U.side=UA):Is(U,D,G)}this.compile=function(U,D,G=null){G===null&&(G=U),d=ge.get(G),d.init(D),v.push(d),G.traverseVisible(function(H){H.isLight&&H.layers.test(D.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),U!==G&&U.traverseVisible(function(H){H.isLight&&H.layers.test(D.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),d.setupLights();const k=new Set;return U.traverse(function(H){const se=H.material;if(se)if(Array.isArray(se))for(let de=0;de<se.length;de++){const ve=se[de];Lt(ve,G,H),k.add(ve)}else Lt(se,G,H),k.add(se)}),v.pop(),d=null,k},this.compileAsync=function(U,D,G=null){const k=this.compile(U,D,G);return new Promise(H=>{function se(){if(k.forEach(function(de){He.get(de).currentProgram.isReady()&&k.delete(de)}),k.size===0){H(U);return}setTimeout(se,10)}Ye.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let nt=null;function Rt(U){nt&&nt(U)}function Ft(){zt.stop()}function yn(){zt.start()}const zt=new zp;zt.setAnimationLoop(Rt),typeof self<"u"&&zt.setContext(self),this.setAnimationLoop=function(U){nt=U,N.setAnimationLoop(U),U===null?zt.stop():zt.start()},N.addEventListener("sessionstart",Ft),N.addEventListener("sessionend",yn),this.render=function(U,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;if(U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(N.cameraAutoUpdate===!0&&N.updateCamera(D),D=N.getCamera()),U.isScene===!0&&U.onBeforeRender(w,U,D,S),d=ge.get(U,v.length),d.init(D),v.push(d),ue.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Oe.setFromProjectionMatrix(ue),$=this.localClippingEnabled,J=ke.init(this.clippingPlanes,$),m=oe.get(U,h.length),m.init(),h.push(m),N.enabled===!0&&N.isPresenting===!0){const se=w.xr.getDepthSensingMesh();se!==null&&on(se,D,-1/0,w.sortObjects)}on(U,D,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(X,re),Ge=N.enabled===!1||N.isPresenting===!1||N.hasDepthSensing()===!1,Ge&&me.addToRenderList(m,U),this.info.render.frame++,J===!0&&ke.beginShadows();const G=d.state.shadowsArray;ie.render(G,U,D),J===!0&&ke.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=m.opaque,H=m.transmissive;if(d.setupLights(),D.isArrayCamera){const se=D.cameras;if(H.length>0)for(let de=0,ve=se.length;de<ve;de++){const we=se[de];Qr(k,H,U,we)}Ge&&me.render(U);for(let de=0,ve=se.length;de<ve;de++){const we=se[de];ti(m,U,we,we.viewport)}}else H.length>0&&Qr(k,H,U,D),Ge&&me.render(U),ti(m,U,D);S!==null&&(Ve.updateMultisampleRenderTarget(S),Ve.updateRenderTargetMipmap(S)),U.isScene===!0&&U.onAfterRender(w,U,D),Ne.resetDefaultState(),R=-1,E=null,v.pop(),v.length>0?(d=v[v.length-1],J===!0&&ke.setGlobalState(w.clippingPlanes,d.state.camera)):d=null,h.pop(),h.length>0?m=h[h.length-1]:m=null};function on(U,D,G,k){if(U.visible===!1)return;if(U.layers.test(D.layers)){if(U.isGroup)G=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update(D);else if(U.isLight)d.pushLight(U),U.castShadow&&d.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||Oe.intersectsSprite(U)){k&&Me.setFromMatrixPosition(U.matrixWorld).applyMatrix4(ue);const de=ne.update(U),ve=U.material;ve.visible&&m.push(U,de,ve,G,Me.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||Oe.intersectsObject(U))){const de=ne.update(U),ve=U.material;if(k&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),Me.copy(U.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Me.copy(de.boundingSphere.center)),Me.applyMatrix4(U.matrixWorld).applyMatrix4(ue)),Array.isArray(ve)){const we=de.groups;for(let Le=0,Pe=we.length;Le<Pe;Le++){const be=we[Le],it=ve[be.materialIndex];it&&it.visible&&m.push(U,de,it,G,Me.z,be)}}else ve.visible&&m.push(U,de,ve,G,Me.z,null)}}const se=U.children;for(let de=0,ve=se.length;de<ve;de++)on(se[de],D,G,k)}function ti(U,D,G,k){const H=U.opaque,se=U.transmissive,de=U.transparent;d.setupLightsView(G),J===!0&&ke.setGlobalState(w.clippingPlanes,G),k&&xe.viewport(C.copy(k)),H.length>0&&Ts(H,D,G),se.length>0&&Ts(se,D,G),de.length>0&&Ts(de,D,G),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function Qr(U,D,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[k.id]===void 0&&(d.state.transmissionRenderTarget[k.id]=new qn(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?Fr:YA,minFilter:hi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));const se=d.state.transmissionRenderTarget[k.id],de=k.viewport||C;se.setSize(de.z,de.w);const ve=w.getRenderTarget();w.setRenderTarget(se),w.getClearColor(P),K=w.getClearAlpha(),K<1&&w.setClearColor(16777215,.5),w.clear(),Ge&&me.render(G);const we=w.toneMapping;w.toneMapping=Kn;const Le=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),d.setupLightsView(k),J===!0&&ke.setGlobalState(w.clippingPlanes,k),Ts(U,G,k),Ve.updateMultisampleRenderTarget(se),Ve.updateRenderTargetMipmap(se),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let be=0,it=D.length;be<it;be++){const _t=D[be],Et=_t.object,gA=_t.geometry,rt=_t.material,ye=_t.group;if(rt.side===UA&&Et.layers.test(k.layers)){const Kt=rt.side;rt.side=$t,rt.needsUpdate=!0,Ef(Et,G,k,gA,rt,ye),rt.side=Kt,rt.needsUpdate=!0,Pe=!0}}Pe===!0&&(Ve.updateMultisampleRenderTarget(se),Ve.updateRenderTargetMipmap(se))}w.setRenderTarget(ve),w.setClearColor(P,K),Le!==void 0&&(k.viewport=Le),w.toneMapping=we}function Ts(U,D,G){const k=D.isScene===!0?D.overrideMaterial:null;for(let H=0,se=U.length;H<se;H++){const de=U[H],ve=de.object,we=de.geometry,Le=k===null?de.material:k,Pe=de.group;ve.layers.test(G.layers)&&Ef(ve,D,G,we,Le,Pe)}}function Ef(U,D,G,k,H,se){U.onBeforeRender(w,D,G,k,H,se),U.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),H.transparent===!0&&H.side===UA&&H.forceSinglePass===!1?(H.side=$t,H.needsUpdate=!0,w.renderBufferDirect(G,D,k,H,U,se),H.side=Zn,H.needsUpdate=!0,w.renderBufferDirect(G,D,k,H,U,se),H.side=UA):w.renderBufferDirect(G,D,k,H,U,se),U.onAfterRender(w,D,G,k,H,se)}function Is(U,D,G){D.isScene!==!0&&(D=Fe);const k=He.get(U),H=d.state.lights,se=d.state.shadowsArray,de=H.state.version,ve=j.getParameters(U,H.state,se,D,G),we=j.getProgramCacheKey(ve);let Le=k.programs;k.environment=U.isMeshStandardMaterial?D.environment:null,k.fog=D.fog,k.envMap=(U.isMeshStandardMaterial?x:T).get(U.envMap||k.environment),k.envMapRotation=k.environment!==null&&U.envMap===null?D.environmentRotation:U.envMapRotation,Le===void 0&&(U.addEventListener("dispose",_e),Le=new Map,k.programs=Le);let Pe=Le.get(we);if(Pe!==void 0){if(k.currentProgram===Pe&&k.lightsStateVersion===de)return Uf(U,ve),Pe}else ve.uniforms=j.getUniforms(U),U.onBeforeCompile(ve,w),Pe=j.acquireProgram(ve,we),Le.set(we,Pe),k.uniforms=ve.uniforms;const be=k.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&(be.clippingPlanes=ke.uniform),Uf(U,ve),k.needsLights=Km(U),k.lightsStateVersion=de,k.needsLights&&(be.ambientLightColor.value=H.state.ambient,be.lightProbe.value=H.state.probe,be.directionalLights.value=H.state.directional,be.directionalLightShadows.value=H.state.directionalShadow,be.spotLights.value=H.state.spot,be.spotLightShadows.value=H.state.spotShadow,be.rectAreaLights.value=H.state.rectArea,be.ltc_1.value=H.state.rectAreaLTC1,be.ltc_2.value=H.state.rectAreaLTC2,be.pointLights.value=H.state.point,be.pointLightShadows.value=H.state.pointShadow,be.hemisphereLights.value=H.state.hemi,be.directionalShadowMap.value=H.state.directionalShadowMap,be.directionalShadowMatrix.value=H.state.directionalShadowMatrix,be.spotShadowMap.value=H.state.spotShadowMap,be.spotLightMatrix.value=H.state.spotLightMatrix,be.spotLightMap.value=H.state.spotLightMap,be.pointShadowMap.value=H.state.pointShadowMap,be.pointShadowMatrix.value=H.state.pointShadowMatrix),k.currentProgram=Pe,k.uniformsList=null,Pe}function yf(U){if(U.uniformsList===null){const D=U.currentProgram.getUniforms();U.uniformsList=Ka.seqWithValue(D.seq,U.uniforms)}return U.uniformsList}function Uf(U,D){const G=He.get(U);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function km(U,D,G,k,H){D.isScene!==!0&&(D=Fe),Ve.resetTextureUnits();const se=D.fog,de=k.isMeshStandardMaterial?D.environment:null,ve=S===null?w.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:ei,we=(k.isMeshStandardMaterial?x:T).get(k.envMap||de),Le=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Pe=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),be=!!G.morphAttributes.position,it=!!G.morphAttributes.normal,_t=!!G.morphAttributes.color;let Et=Kn;k.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Et=w.toneMapping);const gA=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,rt=gA!==void 0?gA.length:0,ye=He.get(k),Kt=d.state.lights;if(J===!0&&($===!0||U!==E)){const MA=U===E&&k.id===R;ke.setState(k,U,MA)}let st=!1;k.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Kt.state.version||ye.outputColorSpace!==ve||H.isBatchedMesh&&ye.batching===!1||!H.isBatchedMesh&&ye.batching===!0||H.isBatchedMesh&&ye.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&ye.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&ye.instancing===!1||!H.isInstancedMesh&&ye.instancing===!0||H.isSkinnedMesh&&ye.skinning===!1||!H.isSkinnedMesh&&ye.skinning===!0||H.isInstancedMesh&&ye.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&ye.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&ye.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&ye.instancingMorph===!1&&H.morphTexture!==null||ye.envMap!==we||k.fog===!0&&ye.fog!==se||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==ke.numPlanes||ye.numIntersection!==ke.numIntersection)||ye.vertexAlphas!==Le||ye.vertexTangents!==Pe||ye.morphTargets!==be||ye.morphNormals!==it||ye.morphColors!==_t||ye.toneMapping!==Et||ye.morphTargetsCount!==rt)&&(st=!0):(st=!0,ye.__version=k.version);let HA=ye.currentProgram;st===!0&&(HA=Is(k,D,H));let Fi=!1,mA=!1,Al=!1;const Tt=HA.getUniforms(),Un=ye.uniforms;if(xe.useProgram(HA.program)&&(Fi=!0,mA=!0,Al=!0),k.id!==R&&(R=k.id,mA=!0),Fi||E!==U){Tt.setValue(Q,"projectionMatrix",U.projectionMatrix),Tt.setValue(Q,"viewMatrix",U.matrixWorldInverse);const MA=Tt.map.cameraPosition;MA!==void 0&&MA.setValue(Q,ce.setFromMatrixPosition(U.matrixWorld)),At.logarithmicDepthBuffer&&Tt.setValue(Q,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Tt.setValue(Q,"isOrthographic",U.isOrthographicCamera===!0),E!==U&&(E=U,mA=!0,Al=!0)}if(H.isSkinnedMesh){Tt.setOptional(Q,H,"bindMatrix"),Tt.setOptional(Q,H,"bindMatrixInverse");const MA=H.skeleton;MA&&(MA.boneTexture===null&&MA.computeBoneTexture(),Tt.setValue(Q,"boneTexture",MA.boneTexture,Ve))}H.isBatchedMesh&&(Tt.setOptional(Q,H,"batchingTexture"),Tt.setValue(Q,"batchingTexture",H._matricesTexture,Ve),Tt.setOptional(Q,H,"batchingIdTexture"),Tt.setValue(Q,"batchingIdTexture",H._indirectTexture,Ve),Tt.setOptional(Q,H,"batchingColorTexture"),H._colorsTexture!==null&&Tt.setValue(Q,"batchingColorTexture",H._colorsTexture,Ve));const nl=G.morphAttributes;if((nl.position!==void 0||nl.normal!==void 0||nl.color!==void 0)&&Je.update(H,G,HA),(mA||ye.receiveShadow!==H.receiveShadow)&&(ye.receiveShadow=H.receiveShadow,Tt.setValue(Q,"receiveShadow",H.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Un.envMap.value=we,Un.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&D.environment!==null&&(Un.envMapIntensity.value=D.environmentIntensity),mA&&(Tt.setValue(Q,"toneMappingExposure",w.toneMappingExposure),ye.needsLights&&zm(Un,Al),se&&k.fog===!0&&Se.refreshFogUniforms(Un,se),Se.refreshMaterialUniforms(Un,k,q,V,d.state.transmissionRenderTarget[U.id]),Ka.upload(Q,yf(ye),Un,Ve)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ka.upload(Q,yf(ye),Un,Ve),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Tt.setValue(Q,"center",H.center),Tt.setValue(Q,"modelViewMatrix",H.modelViewMatrix),Tt.setValue(Q,"normalMatrix",H.normalMatrix),Tt.setValue(Q,"modelMatrix",H.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const MA=k.uniformsGroups;for(let il=0,Wm=MA.length;il<Wm;il++){const Sf=MA[il];wt.update(Sf,HA),wt.bind(Sf,HA)}}return HA}function zm(U,D){U.ambientLightColor.needsUpdate=D,U.lightProbe.needsUpdate=D,U.directionalLights.needsUpdate=D,U.directionalLightShadows.needsUpdate=D,U.pointLights.needsUpdate=D,U.pointLightShadows.needsUpdate=D,U.spotLights.needsUpdate=D,U.spotLightShadows.needsUpdate=D,U.rectAreaLights.needsUpdate=D,U.hemisphereLights.needsUpdate=D}function Km(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(U,D,G){He.get(U.texture).__webglTexture=D,He.get(U.depthTexture).__webglTexture=G;const k=He.get(U);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=G===void 0,k.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(U,D){const G=He.get(U);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(U,D=0,G=0){S=U,b=D,y=G;let k=!0,H=null,se=!1,de=!1;if(U){const we=He.get(U);we.__useDefaultFramebuffer!==void 0?(xe.bindFramebuffer(Q.FRAMEBUFFER,null),k=!1):we.__webglFramebuffer===void 0?Ve.setupRenderTarget(U):we.__hasExternalTextures&&Ve.rebindTextures(U,He.get(U.texture).__webglTexture,He.get(U.depthTexture).__webglTexture);const Le=U.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(de=!0);const Pe=He.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(Pe[D])?H=Pe[D][G]:H=Pe[D],se=!0):U.samples>0&&Ve.useMultisampledRTT(U)===!1?H=He.get(U).__webglMultisampledFramebuffer:Array.isArray(Pe)?H=Pe[G]:H=Pe,C.copy(U.viewport),L.copy(U.scissor),W=U.scissorTest}else C.copy(ae).multiplyScalar(q).floor(),L.copy(he).multiplyScalar(q).floor(),W=Ie;if(xe.bindFramebuffer(Q.FRAMEBUFFER,H)&&k&&xe.drawBuffers(U,H),xe.viewport(C),xe.scissor(L),xe.setScissorTest(W),se){const we=He.get(U.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_CUBE_MAP_POSITIVE_X+D,we.__webglTexture,G)}else if(de){const we=He.get(U.texture),Le=D||0;Q.framebufferTextureLayer(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,we.__webglTexture,G||0,Le)}R=-1},this.readRenderTargetPixels=function(U,D,G,k,H,se,de){if(!(U&&U.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=He.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){xe.bindFramebuffer(Q.FRAMEBUFFER,ve);try{const we=U.texture,Le=we.format,Pe=we.type;if(!At.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!At.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=U.width-k&&G>=0&&G<=U.height-H&&Q.readPixels(D,G,k,H,Re.convert(Le),Re.convert(Pe),se)}finally{const we=S!==null?He.get(S).__webglFramebuffer:null;xe.bindFramebuffer(Q.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(U,D,G,k,H,se,de){if(!(U&&U.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=He.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){xe.bindFramebuffer(Q.FRAMEBUFFER,ve);try{const we=U.texture,Le=we.format,Pe=we.type;if(!At.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!At.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=U.width-k&&G>=0&&G<=U.height-H){const be=Q.createBuffer();Q.bindBuffer(Q.PIXEL_PACK_BUFFER,be),Q.bufferData(Q.PIXEL_PACK_BUFFER,se.byteLength,Q.STREAM_READ),Q.readPixels(D,G,k,H,Re.convert(Le),Re.convert(Pe),0),Q.flush();const it=Q.fenceSync(Q.SYNC_GPU_COMMANDS_COMPLETE,0);await W0(Q,it,4);try{Q.bindBuffer(Q.PIXEL_PACK_BUFFER,be),Q.getBufferSubData(Q.PIXEL_PACK_BUFFER,0,se)}finally{Q.deleteBuffer(be),Q.deleteSync(it)}return se}}finally{const we=S!==null?He.get(S).__webglFramebuffer:null;xe.bindFramebuffer(Q.FRAMEBUFFER,we)}}},this.copyFramebufferToTexture=function(U,D=null,G=0){U.isTexture!==!0&&(rs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,U=arguments[1]);const k=Math.pow(2,-G),H=Math.floor(U.image.width*k),se=Math.floor(U.image.height*k),de=D!==null?D.x:0,ve=D!==null?D.y:0;Ve.setTexture2D(U,0),Q.copyTexSubImage2D(Q.TEXTURE_2D,G,0,0,de,ve,H,se),xe.unbindTexture()},this.copyTextureToTexture=function(U,D,G=null,k=null,H=0){U.isTexture!==!0&&(rs("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,U=arguments[1],D=arguments[2],H=arguments[3]||0,G=null);let se,de,ve,we,Le,Pe;G!==null?(se=G.max.x-G.min.x,de=G.max.y-G.min.y,ve=G.min.x,we=G.min.y):(se=U.image.width,de=U.image.height,ve=0,we=0),k!==null?(Le=k.x,Pe=k.y):(Le=0,Pe=0);const be=Re.convert(D.format),it=Re.convert(D.type);Ve.setTexture2D(D,0),Q.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,D.flipY),Q.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),Q.pixelStorei(Q.UNPACK_ALIGNMENT,D.unpackAlignment);const _t=Q.getParameter(Q.UNPACK_ROW_LENGTH),Et=Q.getParameter(Q.UNPACK_IMAGE_HEIGHT),gA=Q.getParameter(Q.UNPACK_SKIP_PIXELS),rt=Q.getParameter(Q.UNPACK_SKIP_ROWS),ye=Q.getParameter(Q.UNPACK_SKIP_IMAGES),Kt=U.isCompressedTexture?U.mipmaps[H]:U.image;Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Kt.width),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Kt.height),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,ve),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,we),U.isDataTexture?Q.texSubImage2D(Q.TEXTURE_2D,H,Le,Pe,se,de,be,it,Kt.data):U.isCompressedTexture?Q.compressedTexSubImage2D(Q.TEXTURE_2D,H,Le,Pe,Kt.width,Kt.height,be,Kt.data):Q.texSubImage2D(Q.TEXTURE_2D,H,Le,Pe,se,de,be,it,Kt),Q.pixelStorei(Q.UNPACK_ROW_LENGTH,_t),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Et),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,gA),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,rt),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,ye),H===0&&D.generateMipmaps&&Q.generateMipmap(Q.TEXTURE_2D),xe.unbindTexture()},this.copyTextureToTexture3D=function(U,D,G=null,k=null,H=0){U.isTexture!==!0&&(rs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,k=arguments[1]||null,U=arguments[2],D=arguments[3],H=arguments[4]||0);let se,de,ve,we,Le,Pe,be,it,_t;const Et=U.isCompressedTexture?U.mipmaps[H]:U.image;G!==null?(se=G.max.x-G.min.x,de=G.max.y-G.min.y,ve=G.max.z-G.min.z,we=G.min.x,Le=G.min.y,Pe=G.min.z):(se=Et.width,de=Et.height,ve=Et.depth,we=0,Le=0,Pe=0),k!==null?(be=k.x,it=k.y,_t=k.z):(be=0,it=0,_t=0);const gA=Re.convert(D.format),rt=Re.convert(D.type);let ye;if(D.isData3DTexture)Ve.setTexture3D(D,0),ye=Q.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)Ve.setTexture2DArray(D,0),ye=Q.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Q.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,D.flipY),Q.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),Q.pixelStorei(Q.UNPACK_ALIGNMENT,D.unpackAlignment);const Kt=Q.getParameter(Q.UNPACK_ROW_LENGTH),st=Q.getParameter(Q.UNPACK_IMAGE_HEIGHT),HA=Q.getParameter(Q.UNPACK_SKIP_PIXELS),Fi=Q.getParameter(Q.UNPACK_SKIP_ROWS),mA=Q.getParameter(Q.UNPACK_SKIP_IMAGES);Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Et.width),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Et.height),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,we),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,Le),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,Pe),U.isDataTexture||U.isData3DTexture?Q.texSubImage3D(ye,H,be,it,_t,se,de,ve,gA,rt,Et.data):D.isCompressedArrayTexture?Q.compressedTexSubImage3D(ye,H,be,it,_t,se,de,ve,gA,Et.data):Q.texSubImage3D(ye,H,be,it,_t,se,de,ve,gA,rt,Et),Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Kt),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,st),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,HA),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,Fi),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,mA),H===0&&D.generateMipmaps&&Q.generateMipmap(ye),xe.unbindTexture()},this.initRenderTarget=function(U){He.get(U).__webglFramebuffer===void 0&&Ve.setupRenderTarget(U)},this.initTexture=function(U){U.isCubeTexture?Ve.setTextureCube(U,0):U.isData3DTexture?Ve.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?Ve.setTexture2DArray(U,0):Ve.setTexture2D(U,0),xe.unbindTexture()},this.resetState=function(){b=0,y=0,S=null,xe.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Yu?"display-p3":"srgb",t.unpackColorSpace=ot.workingColorSpace===Ho?"display-p3":"srgb"}}class $u{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=t}clone(){return new $u(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class $x extends aA{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Oo extends Mi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const oo=new I,lo=new I,xh=new ut,Or=new Us,ta=new ys,Il=new I,_h=new I;class ef extends aA{constructor(e=new kt,t=new Oo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,A=[0];for(let i=1,r=t.count;i<r;i++)oo.fromBufferAttribute(t,i-1),lo.fromBufferAttribute(t,i),A[i]=A[i-1],A[i]+=oo.distanceTo(lo);e.setAttribute("lineDistance",new oA(A,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),ta.copy(A.boundingSphere),ta.applyMatrix4(i),ta.radius+=r,e.ray.intersectsSphere(ta)===!1)return;xh.copy(i).invert(),Or.copy(e.ray).applyMatrix4(xh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=A.index,f=A.attributes.position;if(c!==null){const p=Math.max(0,s.start),g=Math.min(c.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=l){const h=c.getX(m),v=c.getX(m+1),w=Aa(this,e,Or,o,h,v);w&&t.push(w)}if(this.isLineLoop){const m=c.getX(g-1),d=c.getX(p),h=Aa(this,e,Or,o,m,d);h&&t.push(h)}}else{const p=Math.max(0,s.start),g=Math.min(f.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=l){const h=Aa(this,e,Or,o,m,m+1);h&&t.push(h)}if(this.isLineLoop){const m=Aa(this,e,Or,o,g-1,p);m&&t.push(m)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Aa(n,e,t,A,i,r){const s=n.geometry.attributes.position;if(oo.fromBufferAttribute(s,i),lo.fromBufferAttribute(s,r),t.distanceSqToSegment(oo,lo,Il,_h)>A)return;Il.applyMatrix4(n.matrixWorld);const o=e.ray.origin.distanceTo(Il);if(!(o<e.near||o>e.far))return{distance:o,point:_h.clone().applyMatrix4(n.matrixWorld),index:i,face:null,faceIndex:null,object:n}}class e_ extends Mi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Eh=new ut,$c=new Us,na=new ys,ia=new I;class qp extends aA{constructor(e=new kt,t=new e_){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),na.copy(A.boundingSphere),na.applyMatrix4(i),na.radius+=r,e.ray.intersectsSphere(na)===!1)return;Eh.copy(i).invert(),$c.copy(e.ray).applyMatrix4(Eh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=A.index,u=A.attributes.position;if(l!==null){const f=Math.max(0,s.start),p=Math.min(l.count,s.start+s.count);for(let g=f,m=p;g<m;g++){const d=l.getX(g);ia.fromBufferAttribute(u,d),yh(ia,d,o,i,e,t,this)}}else{const f=Math.max(0,s.start),p=Math.min(u.count,s.start+s.count);for(let g=f,m=p;g<m;g++)ia.fromBufferAttribute(u,g),yh(ia,g,o,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function yh(n,e,t,A,i,r,s){const a=$c.distanceSqToPoint(n);if(a<t){const o=new I;$c.closestPointToPoint(n,o),o.applyMatrix4(A);const l=i.ray.origin.distanceTo(o);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,object:s})}}class t_ extends fA{constructor(e,t,A,i,r,s,a,o,l){super(e,t,A,i,r,s,a,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class A_{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const A=this.getUtoTmapping(e);return this.getPoint(A,t)}getPoints(e=5){const t=[];for(let A=0;A<=e;A++)t.push(this.getPoint(A/e));return t}getSpacedPoints(e=5){const t=[];for(let A=0;A<=e;A++)t.push(this.getPointAt(A/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let A,i=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)A=this.getPoint(s/e),r+=A.distanceTo(i),t.push(r),i=A;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const A=this.getLengths();let i=0;const r=A.length;let s;t?s=t:s=e*A[r-1];let a=0,o=r-1,l;for(;a<=o;)if(i=Math.floor(a+(o-a)/2),l=A[i]-s,l<0)a=i+1;else if(l>0)o=i-1;else{o=i;break}if(i=o,A[i]===s)return i/(r-1);const c=A[i],f=A[i+1]-c,p=(s-c)/f;return(i+p)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const s=this.getPoint(i),a=this.getPoint(r),o=t||(s.isVector2?new Ue:new I);return o.copy(a).sub(s).normalize(),o}getTangentAt(e,t){const A=this.getUtoTmapping(e);return this.getTangent(A,t)}computeFrenetFrames(e,t){const A=new I,i=[],r=[],s=[],a=new I,o=new ut;for(let p=0;p<=e;p++){const g=p/e;i[p]=this.getTangentAt(g,new I)}r[0]=new I,s[0]=new I;let l=Number.MAX_VALUE;const c=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);c<=l&&(l=c,A.set(1,0,0)),u<=l&&(l=u,A.set(0,1,0)),f<=l&&A.set(0,0,1),a.crossVectors(i[0],A).normalize(),r[0].crossVectors(i[0],a),s[0].crossVectors(i[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),s[p]=s[p-1].clone(),a.crossVectors(i[p-1],i[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Yt(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(o.makeRotationAxis(a,g))}s[p].crossVectors(i[p],r[p])}if(t===!0){let p=Math.acos(Yt(r[0].dot(r[e]),-1,1));p/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(o.makeRotationAxis(i[g],p*g)),s[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Go extends kt{constructor(e=.5,t=1,A=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:A,phiSegments:i,thetaStart:r,thetaLength:s},A=Math.max(3,A),i=Math.max(1,i);const a=[],o=[],l=[],c=[];let u=e;const f=(t-e)/i,p=new I,g=new Ue;for(let m=0;m<=i;m++){for(let d=0;d<=A;d++){const h=r+d/A*s;p.x=u*Math.cos(h),p.y=u*Math.sin(h),o.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,c.push(g.x,g.y)}u+=f}for(let m=0;m<i;m++){const d=m*(A+1);for(let h=0;h<A;h++){const v=h+d,w=v,_=v+A+1,b=v+A+2,y=v+1;a.push(w,_,y),a.push(_,b,y)}}this.setIndex(a),this.setAttribute("position",new oA(o,3)),this.setAttribute("normal",new oA(l,3)),this.setAttribute("uv",new oA(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Go(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class An extends kt{constructor(e=1,t=32,A=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:A,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),A=Math.max(2,Math.floor(A));const o=Math.min(s+a,Math.PI);let l=0;const c=[],u=new I,f=new I,p=[],g=[],m=[],d=[];for(let h=0;h<=A;h++){const v=[],w=h/A;let _=0;h===0&&s===0?_=.5/t:h===A&&o===Math.PI&&(_=-.5/t);for(let b=0;b<=t;b++){const y=b/t;u.x=-e*Math.cos(i+y*r)*Math.sin(s+w*a),u.y=e*Math.cos(s+w*a),u.z=e*Math.sin(i+y*r)*Math.sin(s+w*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),m.push(f.x,f.y,f.z),d.push(y+_,1-w),v.push(l++)}c.push(v)}for(let h=0;h<A;h++)for(let v=0;v<t;v++){const w=c[h][v+1],_=c[h][v],b=c[h+1][v],y=c[h+1][v+1];(h!==0||s>0)&&p.push(w,_,y),(h!==A-1||o<Math.PI)&&p.push(_,b,y)}this.setIndex(p),this.setAttribute("position",new oA(g,3)),this.setAttribute("normal",new oA(m,3)),this.setAttribute("uv",new oA(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new An(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class eu extends Mi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ip,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class jp extends aA{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Ql=new ut,Uh=new I,Sh=new I;class n_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qu,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,A=this.matrix;Uh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uh),Sh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sh),t.updateMatrixWorld(),Ql.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ql),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(Ql)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Mh=new ut,Gr=new I,Ll=new I;class i_ extends n_{constructor(){super(new EA(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const A=this.camera,i=this.matrix,r=e.distance||A.far;r!==A.far&&(A.far=r,A.updateProjectionMatrix()),Gr.setFromMatrixPosition(e.matrixWorld),A.position.copy(Gr),Ll.copy(A.position),Ll.add(this._cubeDirections[t]),A.up.copy(this._cubeUps[t]),A.lookAt(Ll),A.updateMatrixWorld(),i.makeTranslation(-Gr.x,-Gr.y,-Gr.z),Mh.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mh)}}class bh extends jp{constructor(e,t,A=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=A,this.decay=i,this.shadow=new i_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class r_ extends jp{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class $p{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Fh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Fh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Fh(){return(typeof performance>"u"?Date:performance).now()}const Th=new ut;class eg{constructor(e,t,A=0,i=1/0){this.ray=new Us(e,t),this.near=A,this.far=i,this.camera=null,this.layers=new Zu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Th.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Th),this}intersectObject(e,t=!0,A=[]){return tu(e,this,A,t),A.sort(Ih),A}intersectObjects(e,t=!0,A=[]){for(let i=0,r=e.length;i<r;i++)tu(e[i],this,A,t);return A.sort(Ih),A}}function Ih(n,e){return n.distance-e.distance}function tu(n,e,t,A){let i=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(i=!1),i===!0&&A===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)tu(r[s],e,t,!0)}}class Qh{constructor(e=1,t=0,A=0){return this.radius=e,this.phi=t,this.theta=A,this}set(e,t,A){return this.radius=e,this.phi=t,this.theta=A,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,A){return this.radius=Math.sqrt(e*e+t*t+A*A),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,A),this.phi=Math.acos(Yt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gu);const Lh={type:"change"},Rl={type:"start"},Rh={type:"end"},ra=new Us,Dh=new Dn,s_=Math.cos(70*z0.DEG2RAD);class tg extends Si{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ti.ROTATE,MIDDLE:Ti.DOLLY,RIGHT:Ti.PAN},this.touches={ONE:Ii.ROTATE,TWO:Ii.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(B){B.addEventListener("keydown",ge),this._domElementKeyEvents=B},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ge),this._domElementKeyEvents=null},this.saveState=function(){A.target0.copy(A.target),A.position0.copy(A.object.position),A.zoom0=A.object.zoom},this.reset=function(){A.target.copy(A.target0),A.object.position.copy(A.position0),A.object.zoom=A.zoom0,A.object.updateProjectionMatrix(),A.dispatchEvent(Lh),A.update(),r=i.NONE},this.update=(function(){const B=new I,N=new yi().setFromUnitVectors(e.up,new I(0,1,0)),O=N.clone().invert(),Y=new I,te=new yi,_e=new I,De=2*Math.PI;return function(Lt=null){const nt=A.object.position;B.copy(nt).sub(A.target),B.applyQuaternion(N),a.setFromVector3(B),A.autoRotate&&r===i.NONE&&W(C(Lt)),A.enableDamping?(a.theta+=o.theta*A.dampingFactor,a.phi+=o.phi*A.dampingFactor):(a.theta+=o.theta,a.phi+=o.phi);let Rt=A.minAzimuthAngle,Ft=A.maxAzimuthAngle;isFinite(Rt)&&isFinite(Ft)&&(Rt<-Math.PI?Rt+=De:Rt>Math.PI&&(Rt-=De),Ft<-Math.PI?Ft+=De:Ft>Math.PI&&(Ft-=De),Rt<=Ft?a.theta=Math.max(Rt,Math.min(Ft,a.theta)):a.theta=a.theta>(Rt+Ft)/2?Math.max(Rt,a.theta):Math.min(Ft,a.theta)),a.phi=Math.max(A.minPolarAngle,Math.min(A.maxPolarAngle,a.phi)),a.makeSafe(),A.enableDamping===!0?A.target.addScaledVector(c,A.dampingFactor):A.target.add(c),A.target.sub(A.cursor),A.target.clampLength(A.minTargetRadius,A.maxTargetRadius),A.target.add(A.cursor);let yn=!1;if(A.zoomToCursor&&y||A.object.isOrthographicCamera)a.radius=ae(a.radius);else{const zt=a.radius;a.radius=ae(a.radius*l),yn=zt!=a.radius}if(B.setFromSpherical(a),B.applyQuaternion(O),nt.copy(A.target).add(B),A.object.lookAt(A.target),A.enableDamping===!0?(o.theta*=1-A.dampingFactor,o.phi*=1-A.dampingFactor,c.multiplyScalar(1-A.dampingFactor)):(o.set(0,0,0),c.set(0,0,0)),A.zoomToCursor&&y){let zt=null;if(A.object.isPerspectiveCamera){const on=B.length();zt=ae(on*l);const ti=on-zt;A.object.position.addScaledVector(_,ti),A.object.updateMatrixWorld(),yn=!!ti}else if(A.object.isOrthographicCamera){const on=new I(b.x,b.y,0);on.unproject(A.object);const ti=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),A.object.updateProjectionMatrix(),yn=ti!==A.object.zoom;const Qr=new I(b.x,b.y,0);Qr.unproject(A.object),A.object.position.sub(Qr).add(on),A.object.updateMatrixWorld(),zt=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),A.zoomToCursor=!1;zt!==null&&(this.screenSpacePanning?A.target.set(0,0,-1).transformDirection(A.object.matrix).multiplyScalar(zt).add(A.object.position):(ra.origin.copy(A.object.position),ra.direction.set(0,0,-1).transformDirection(A.object.matrix),Math.abs(A.object.up.dot(ra.direction))<s_?e.lookAt(A.target):(Dh.setFromNormalAndCoplanarPoint(A.object.up,A.target),ra.intersectPlane(Dh,A.target))))}else if(A.object.isOrthographicCamera){const zt=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),zt!==A.object.zoom&&(A.object.updateProjectionMatrix(),yn=!0)}return l=1,y=!1,yn||Y.distanceToSquared(A.object.position)>s||8*(1-te.dot(A.object.quaternion))>s||_e.distanceToSquared(A.target)>s?(A.dispatchEvent(Lh),Y.copy(A.object.position),te.copy(A.object.quaternion),_e.copy(A.target),!0):!1}})(),this.dispose=function(){A.domElement.removeEventListener("contextmenu",me),A.domElement.removeEventListener("pointerdown",Ve),A.domElement.removeEventListener("pointercancel",x),A.domElement.removeEventListener("wheel",ne),A.domElement.removeEventListener("pointermove",T),A.domElement.removeEventListener("pointerup",x),A.domElement.getRootNode().removeEventListener("keydown",Se,{capture:!0}),A._domElementKeyEvents!==null&&(A._domElementKeyEvents.removeEventListener("keydown",ge),A._domElementKeyEvents=null)};const A=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const s=1e-6,a=new Qh,o=new Qh;let l=1;const c=new I,u=new Ue,f=new Ue,p=new Ue,g=new Ue,m=new Ue,d=new Ue,h=new Ue,v=new Ue,w=new Ue,_=new I,b=new Ue;let y=!1;const S=[],R={};let E=!1;function C(B){return B!==null?2*Math.PI/60*A.autoRotateSpeed*B:2*Math.PI/60/60*A.autoRotateSpeed}function L(B){const N=Math.abs(B*.01);return Math.pow(.95,A.zoomSpeed*N)}function W(B){o.theta-=B}function P(B){o.phi-=B}const K=(function(){const B=new I;return function(O,Y){B.setFromMatrixColumn(Y,0),B.multiplyScalar(-O),c.add(B)}})(),Z=(function(){const B=new I;return function(O,Y){A.screenSpacePanning===!0?B.setFromMatrixColumn(Y,1):(B.setFromMatrixColumn(Y,0),B.crossVectors(A.object.up,B)),B.multiplyScalar(O),c.add(B)}})(),V=(function(){const B=new I;return function(O,Y){const te=A.domElement;if(A.object.isPerspectiveCamera){const _e=A.object.position;B.copy(_e).sub(A.target);let De=B.length();De*=Math.tan(A.object.fov/2*Math.PI/180),K(2*O*De/te.clientHeight,A.object.matrix),Z(2*Y*De/te.clientHeight,A.object.matrix)}else A.object.isOrthographicCamera?(K(O*(A.object.right-A.object.left)/A.object.zoom/te.clientWidth,A.object.matrix),Z(Y*(A.object.top-A.object.bottom)/A.object.zoom/te.clientHeight,A.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),A.enablePan=!1)}})();function q(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l/=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function X(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l*=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function re(B,N){if(!A.zoomToCursor)return;y=!0;const O=A.domElement.getBoundingClientRect(),Y=B-O.left,te=N-O.top,_e=O.width,De=O.height;b.x=Y/_e*2-1,b.y=-(te/De)*2+1,_.set(b.x,b.y,1).unproject(A.object).sub(A.object.position).normalize()}function ae(B){return Math.max(A.minDistance,Math.min(A.maxDistance,B))}function he(B){u.set(B.clientX,B.clientY)}function Ie(B){re(B.clientX,B.clientX),h.set(B.clientX,B.clientY)}function Oe(B){g.set(B.clientX,B.clientY)}function J(B){f.set(B.clientX,B.clientY),p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;W(2*Math.PI*p.x/N.clientHeight),P(2*Math.PI*p.y/N.clientHeight),u.copy(f),A.update()}function $(B){v.set(B.clientX,B.clientY),w.subVectors(v,h),w.y>0?q(L(w.y)):w.y<0&&X(L(w.y)),h.copy(v),A.update()}function ue(B){m.set(B.clientX,B.clientY),d.subVectors(m,g).multiplyScalar(A.panSpeed),V(d.x,d.y),g.copy(m),A.update()}function ce(B){re(B.clientX,B.clientY),B.deltaY<0?X(L(B.deltaY)):B.deltaY>0&&q(L(B.deltaY)),A.update()}function Me(B){let N=!1;switch(B.code){case A.keys.UP:B.ctrlKey||B.metaKey||B.shiftKey?P(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(0,A.keyPanSpeed),N=!0;break;case A.keys.BOTTOM:B.ctrlKey||B.metaKey||B.shiftKey?P(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(0,-A.keyPanSpeed),N=!0;break;case A.keys.LEFT:B.ctrlKey||B.metaKey||B.shiftKey?W(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(A.keyPanSpeed,0),N=!0;break;case A.keys.RIGHT:B.ctrlKey||B.metaKey||B.shiftKey?W(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(-A.keyPanSpeed,0),N=!0;break}N&&(B.preventDefault(),A.update())}function Fe(B){if(S.length===1)u.set(B.pageX,B.pageY);else{const N=Ne(B),O=.5*(B.pageX+N.x),Y=.5*(B.pageY+N.y);u.set(O,Y)}}function Ge(B){if(S.length===1)g.set(B.pageX,B.pageY);else{const N=Ne(B),O=.5*(B.pageX+N.x),Y=.5*(B.pageY+N.y);g.set(O,Y)}}function tt(B){const N=Ne(B),O=B.pageX-N.x,Y=B.pageY-N.y,te=Math.sqrt(O*O+Y*Y);h.set(0,te)}function Q(B){A.enableZoom&&tt(B),A.enablePan&&Ge(B)}function ht(B){A.enableZoom&&tt(B),A.enableRotate&&Fe(B)}function Ye(B){if(S.length==1)f.set(B.pageX,B.pageY);else{const O=Ne(B),Y=.5*(B.pageX+O.x),te=.5*(B.pageY+O.y);f.set(Y,te)}p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;W(2*Math.PI*p.x/N.clientHeight),P(2*Math.PI*p.y/N.clientHeight),u.copy(f)}function At(B){if(S.length===1)m.set(B.pageX,B.pageY);else{const N=Ne(B),O=.5*(B.pageX+N.x),Y=.5*(B.pageY+N.y);m.set(O,Y)}d.subVectors(m,g).multiplyScalar(A.panSpeed),V(d.x,d.y),g.copy(m)}function xe(B){const N=Ne(B),O=B.pageX-N.x,Y=B.pageY-N.y,te=Math.sqrt(O*O+Y*Y);v.set(0,te),w.set(0,Math.pow(v.y/h.y,A.zoomSpeed)),q(w.y),h.copy(v);const _e=(B.pageX+N.x)*.5,De=(B.pageY+N.y)*.5;re(_e,De)}function vt(B){A.enableZoom&&xe(B),A.enablePan&&At(B)}function He(B){A.enableZoom&&xe(B),A.enableRotate&&Ye(B)}function Ve(B){A.enabled!==!1&&(S.length===0&&(A.domElement.setPointerCapture(B.pointerId),A.domElement.addEventListener("pointermove",T),A.domElement.addEventListener("pointerup",x)),!Be(B)&&(Je(B),B.pointerType==="touch"?ke(B):z(B)))}function T(B){A.enabled!==!1&&(B.pointerType==="touch"?ie(B):ee(B))}function x(B){switch(Qe(B),S.length){case 0:A.domElement.releasePointerCapture(B.pointerId),A.domElement.removeEventListener("pointermove",T),A.domElement.removeEventListener("pointerup",x),A.dispatchEvent(Rh),r=i.NONE;break;case 1:const N=S[0],O=R[N];ke({pointerId:N,pageX:O.x,pageY:O.y});break}}function z(B){let N;switch(B.button){case 0:N=A.mouseButtons.LEFT;break;case 1:N=A.mouseButtons.MIDDLE;break;case 2:N=A.mouseButtons.RIGHT;break;default:N=-1}switch(N){case Ti.DOLLY:if(A.enableZoom===!1)return;Ie(B),r=i.DOLLY;break;case Ti.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enablePan===!1)return;Oe(B),r=i.PAN}else{if(A.enableRotate===!1)return;he(B),r=i.ROTATE}break;case Ti.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enableRotate===!1)return;he(B),r=i.ROTATE}else{if(A.enablePan===!1)return;Oe(B),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Rl)}function ee(B){switch(r){case i.ROTATE:if(A.enableRotate===!1)return;J(B);break;case i.DOLLY:if(A.enableZoom===!1)return;$(B);break;case i.PAN:if(A.enablePan===!1)return;ue(B);break}}function ne(B){A.enabled===!1||A.enableZoom===!1||r!==i.NONE||(B.preventDefault(),A.dispatchEvent(Rl),ce(j(B)),A.dispatchEvent(Rh))}function j(B){const N=B.deltaMode,O={clientX:B.clientX,clientY:B.clientY,deltaY:B.deltaY};switch(N){case 1:O.deltaY*=16;break;case 2:O.deltaY*=100;break}return B.ctrlKey&&!E&&(O.deltaY*=10),O}function Se(B){B.key==="Control"&&(E=!0,A.domElement.getRootNode().addEventListener("keyup",oe,{passive:!0,capture:!0}))}function oe(B){B.key==="Control"&&(E=!1,A.domElement.getRootNode().removeEventListener("keyup",oe,{passive:!0,capture:!0}))}function ge(B){A.enabled===!1||A.enablePan===!1||Me(B)}function ke(B){switch(Re(B),S.length){case 1:switch(A.touches.ONE){case Ii.ROTATE:if(A.enableRotate===!1)return;Fe(B),r=i.TOUCH_ROTATE;break;case Ii.PAN:if(A.enablePan===!1)return;Ge(B),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(A.touches.TWO){case Ii.DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;Q(B),r=i.TOUCH_DOLLY_PAN;break;case Ii.DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;ht(B),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Rl)}function ie(B){switch(Re(B),r){case i.TOUCH_ROTATE:if(A.enableRotate===!1)return;Ye(B),A.update();break;case i.TOUCH_PAN:if(A.enablePan===!1)return;At(B),A.update();break;case i.TOUCH_DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;vt(B),A.update();break;case i.TOUCH_DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;He(B),A.update();break;default:r=i.NONE}}function me(B){A.enabled!==!1&&B.preventDefault()}function Je(B){S.push(B.pointerId)}function Qe(B){delete R[B.pointerId];for(let N=0;N<S.length;N++)if(S[N]==B.pointerId){S.splice(N,1);return}}function Be(B){for(let N=0;N<S.length;N++)if(S[N]==B.pointerId)return!0;return!1}function Re(B){let N=R[B.pointerId];N===void 0&&(N=new Ue,R[B.pointerId]=N),N.set(B.pageX,B.pageY)}function Ne(B){const N=B.pointerId===S[0]?S[1]:S[0];return R[N]}A.domElement.addEventListener("contextmenu",me),A.domElement.addEventListener("pointerdown",Ve),A.domElement.addEventListener("pointercancel",x),A.domElement.addEventListener("wheel",ne,{passive:!1}),A.domElement.getRootNode().addEventListener("keydown",Se,{passive:!0,capture:!0}),this.update()}}const a_={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Vo{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const o_=new Kp(-1,1,1,-1,0,1);class l_ extends kt{constructor(){super(),this.setAttribute("position",new oA([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oA([0,2,0,0,2,0],2))}}const c_=new l_;class u_{constructor(e){this._mesh=new xt(c_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,o_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Au extends Vo{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Vt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Gp.clone(e.uniforms),this.material=new Vt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new u_(this.material)}render(e,t,A){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=A.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ph extends Vo{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,A){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,s,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(A),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class f_ extends Vo{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class h_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const A=e.getSize(new Ue);this._width=A.width,this._height=A.height,t=new qn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Fr}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Au(a_),this.copyPass.material.blending=xn,this.clock=new $p}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let A=!1;for(let i=0,r=this.passes.length;i<r;i++){const s=this.passes[i];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,A),s.needsSwap){if(A){const a=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Ph!==void 0&&(s instanceof Ph?A=!0:s instanceof f_&&(A=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const A=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(A,i),this.renderTarget2.setSize(A,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(A,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class d_ extends Vo{constructor(e,t,A=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=A,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ze}render(e,t,A){const i=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:A),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=i}}function Ag(n,e,t){const A=t.length-n-1;if(e>=t[A])return A-1;if(e<=t[n])return n;let i=n,r=A,s=Math.floor((i+r)/2);for(;e<t[s]||e>=t[s+1];)e<t[s]?r=s:i=s,s=Math.floor((i+r)/2);return s}function p_(n,e,t,A){const i=[],r=[],s=[];i[0]=1;for(let a=1;a<=t;++a){r[a]=e-A[n+1-a],s[a]=A[n+a]-e;let o=0;for(let l=0;l<a;++l){const c=s[l+1],u=r[a-l],f=i[l]/(c+u);i[l]=o+c*f,o=u*f}i[a]=o}return i}function g_(n,e,t,A){const i=Ag(n,A,e),r=p_(i,A,n,e),s=new ct(0,0,0,0);for(let a=0;a<=n;++a){const o=t[i-n+a],l=r[a],c=o.w*l;s.x+=o.x*c,s.y+=o.y*c,s.z+=o.z*c,s.w+=o.w*l}return s}function m_(n,e,t,A,i){const r=[];for(let u=0;u<=t;++u)r[u]=0;const s=[];for(let u=0;u<=A;++u)s[u]=r.slice(0);const a=[];for(let u=0;u<=t;++u)a[u]=r.slice(0);a[0][0]=1;const o=r.slice(0),l=r.slice(0);for(let u=1;u<=t;++u){o[u]=e-i[n+1-u],l[u]=i[n+u]-e;let f=0;for(let p=0;p<u;++p){const g=l[p+1],m=o[u-p];a[u][p]=g+m;const d=a[p][u-1]/a[u][p];a[p][u]=f+g*d,f=m*d}a[u][u]=f}for(let u=0;u<=t;++u)s[0][u]=a[u][t];for(let u=0;u<=t;++u){let f=0,p=1;const g=[];for(let m=0;m<=t;++m)g[m]=r.slice(0);g[0][0]=1;for(let m=1;m<=A;++m){let d=0;const h=u-m,v=t-m;u>=m&&(g[p][0]=g[f][0]/a[v+1][h],d=g[p][0]*a[h][v]);const w=h>=-1?1:-h,_=u-1<=v?m-1:t-u;for(let y=w;y<=_;++y)g[p][y]=(g[f][y]-g[f][y-1])/a[v+1][h+y],d+=g[p][y]*a[h+y][v];u<=v&&(g[p][m]=-g[f][m-1]/a[v+1][u],d+=g[p][m]*a[u][v]),s[m][u]=d;const b=f;f=p,p=b}}let c=t;for(let u=1;u<=A;++u){for(let f=0;f<=t;++f)s[u][f]*=c;c*=t-u}return s}function B_(n,e,t,A,i){const r=i<n?i:n,s=[],a=Ag(n,A,e),o=m_(a,A,n,r,e),l=[];for(let c=0;c<t.length;++c){const u=t[c].clone(),f=u.w;u.x*=f,u.y*=f,u.z*=f,l[c]=u}for(let c=0;c<=r;++c){const u=l[a-n].clone().multiplyScalar(o[c][0]);for(let f=1;f<=n;++f)u.add(l[a-n+f].clone().multiplyScalar(o[c][f]));s[c]=u}for(let c=r+1;c<=i+1;++c)s[c]=new ct(0,0,0);return s}function v_(n,e){let t=1;for(let i=2;i<=n;++i)t*=i;let A=1;for(let i=2;i<=e;++i)A*=i;for(let i=2;i<=n-e;++i)A*=i;return t/A}function w_(n){const e=n.length,t=[],A=[];for(let r=0;r<e;++r){const s=n[r];t[r]=new I(s.x,s.y,s.z),A[r]=s.w}const i=[];for(let r=0;r<e;++r){const s=t[r].clone();for(let a=1;a<=r;++a)s.sub(i[r-a].clone().multiplyScalar(v_(r,a)*A[a]));i[r]=s.divideScalar(A[0])}return i}function C_(n,e,t,A,i){const r=B_(n,e,t,A,i);return w_(r)}class x_ extends A_{constructor(e,t,A,i,r){super(),this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=r||this.knots.length-1;for(let s=0;s<A.length;++s){const a=A[s];this.controlPoints[s]=new ct(a.x,a.y,a.z,a.w)}}getPoint(e,t=new I){const A=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),r=g_(this.degree,this.knots,this.controlPoints,i);return r.w!==1&&r.divideScalar(r.w),A.set(r.x,r.y,r.z)}getTangent(e,t=new I){const A=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),r=C_(this.degree,this.knots,this.controlPoints,i,1);return A.copy(r[1]).normalize(),A}}/*!
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
***************************************************************************** */var nu=function(n,e){return nu=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,A){t.__proto__=A}||function(t,A){for(var i in A)Object.prototype.hasOwnProperty.call(A,i)&&(t[i]=A[i])},nu(n,e)};function JA(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");nu(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var iu=function(){return iu=Object.assign||function(e){for(var t,A=1,i=arguments.length;A<i;A++){t=arguments[A];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},iu.apply(this,arguments)};function cA(n,e,t,A){function i(r){return r instanceof t?r:new t(function(s){s(r)})}return new(t||(t=Promise))(function(r,s){function a(c){try{l(A.next(c))}catch(u){s(u)}}function o(c){try{l(A.throw(c))}catch(u){s(u)}}function l(c){c.done?r(c.value):i(c.value).then(a,o)}l((A=A.apply(n,[])).next())})}function nA(n,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},A,i,r,s;return s={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(l){return function(c){return o([l,c])}}function o(l){if(A)throw new TypeError("Generator is already executing.");for(;t;)try{if(A=1,i&&(r=l[0]&2?i.return:l[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,l[1])).done)return r;switch(i=0,r&&(l=[l[0]&2,r.value]),l[0]){case 0:case 1:r=l;break;case 4:return t.label++,{value:l[1],done:!1};case 5:t.label++,i=l[1],l=[0];continue;case 7:l=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(l[0]===6||l[0]===2)){t=0;continue}if(l[0]===3&&(!r||l[1]>r[0]&&l[1]<r[3])){t.label=l[1];break}if(l[0]===6&&t.label<r[1]){t.label=r[1],r=l;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(l);break}r[2]&&t.ops.pop(),t.trys.pop();continue}l=e.call(n,t)}catch(c){l=[6,c],i=0}finally{A=r=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}function sa(n,e,t){if(arguments.length===2)for(var A=0,i=e.length,r;A<i;A++)(r||!(A in e))&&(r||(r=Array.prototype.slice.call(e,0,A)),r[A]=e[A]);return n.concat(r||e)}var En=(function(){function n(e,t,A,i){this.left=e,this.top=t,this.width=A,this.height=i}return n.prototype.add=function(e,t,A,i){return new n(this.left+e,this.top+t,this.width+A,this.height+i)},n.fromClientRect=function(e,t){return new n(t.left+e.windowBounds.left,t.top+e.windowBounds.top,t.width,t.height)},n.fromDOMRectList=function(e,t){var A=Array.from(t).find(function(i){return i.width!==0});return A?new n(A.left+e.windowBounds.left,A.top+e.windowBounds.top,A.width,A.height):n.EMPTY},n.EMPTY=new n(0,0,0,0),n})(),ko=function(n,e){return En.fromClientRect(n,e.getBoundingClientRect())},__=function(n){var e=n.body,t=n.documentElement;if(!e||!t)throw new Error("Unable to get document size");var A=Math.max(Math.max(e.scrollWidth,t.scrollWidth),Math.max(e.offsetWidth,t.offsetWidth),Math.max(e.clientWidth,t.clientWidth)),i=Math.max(Math.max(e.scrollHeight,t.scrollHeight),Math.max(e.offsetHeight,t.offsetHeight),Math.max(e.clientHeight,t.clientHeight));return new En(0,0,A,i)},zo=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},bt=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},Hh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",E_=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var aa=0;aa<Hh.length;aa++)E_[Hh.charCodeAt(aa)]=aa;var Nh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Zr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var oa=0;oa<Nh.length;oa++)Zr[Nh.charCodeAt(oa)]=oa;var y_=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=Zr[n.charCodeAt(A)],s=Zr[n.charCodeAt(A+1)],a=Zr[n.charCodeAt(A+2)],o=Zr[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},U_=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},S_=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},Bi=5,tf=11,Dl=2,M_=tf-Bi,ng=65536>>Bi,b_=1<<Bi,Pl=b_-1,F_=1024>>Bi,T_=ng+F_,I_=T_,Q_=32,L_=I_+Q_,R_=65536>>tf,D_=1<<M_,P_=D_-1,Oh=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},H_=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},N_=function(n,e){var t=y_(n),A=Array.isArray(t)?S_(t):new Uint32Array(t),i=Array.isArray(t)?U_(t):new Uint16Array(t),r=24,s=Oh(i,r/2,A[4]/2),a=A[5]===2?Oh(i,(r+A[4])/2):H_(A,Math.ceil((r+A[4])/4));return new O_(A[0],A[1],A[2],A[3],s,a)},O_=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>Bi],t=(t<<Dl)+(e&Pl),this.data[t];if(e<=65535)return t=this.index[ng+(e-55296>>Bi)],t=(t<<Dl)+(e&Pl),this.data[t];if(e<this.highStart)return t=L_-R_+(e>>tf),t=this.index[t],t+=e>>Bi&P_,t=this.index[t],t=(t<<Dl)+(e&Pl),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),Gh="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",G_=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var la=0;la<Gh.length;la++)G_[Gh.charCodeAt(la)]=la;var V_="KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==",Vh=50,k_=1,ig=2,rg=3,z_=4,K_=5,kh=7,sg=8,zh=9,On=10,ru=11,Kh=12,su=13,W_=14,qr=15,au=16,ca=17,Vr=18,X_=19,Wh=20,ou=21,kr=22,Hl=23,Zi=24,xA=25,jr=26,$r=27,qi=28,Y_=29,fi=30,J_=31,ua=32,fa=33,lu=34,cu=35,uu=36,ps=37,fu=38,Wa=39,Xa=40,Nl=41,ag=42,Z_=43,q_=[9001,65288],og="!",Ze="×",ha="÷",hu=N_(V_),dn=[fi,uu],du=[k_,ig,rg,K_],lg=[On,sg],Xh=[$r,jr],j_=du.concat(lg),Yh=[fu,Wa,Xa,lu,cu],$_=[qr,su],eE=function(n,e){e===void 0&&(e="strict");var t=[],A=[],i=[];return n.forEach(function(r,s){var a=hu.get(r);if(a>Vh?(i.push(!0),a-=Vh):i.push(!1),["normal","auto","loose"].indexOf(e)!==-1&&[8208,8211,12316,12448].indexOf(r)!==-1)return A.push(s),t.push(au);if(a===z_||a===ru){if(s===0)return A.push(s),t.push(fi);var o=t[s-1];return j_.indexOf(o)===-1?(A.push(A[s-1]),t.push(o)):(A.push(s),t.push(fi))}if(A.push(s),a===J_)return t.push(e==="strict"?ou:ps);if(a===ag||a===Y_)return t.push(fi);if(a===Z_)return r>=131072&&r<=196605||r>=196608&&r<=262141?t.push(ps):t.push(fi);t.push(a)}),[A,t,i]},Ol=function(n,e,t,A){var i=A[t];if(Array.isArray(n)?n.indexOf(i)!==-1:n===i)for(var r=t;r<=A.length;){r++;var s=A[r];if(s===e)return!0;if(s!==On)break}if(i===On)for(var r=t;r>0;){r--;var a=A[r];if(Array.isArray(n)?n.indexOf(a)!==-1:n===a)for(var o=t;o<=A.length;){o++;var s=A[o];if(s===e)return!0;if(s!==On)break}if(a!==On)break}return!1},Jh=function(n,e){for(var t=n;t>=0;){var A=e[t];if(A===On)t--;else return A}return 0},tE=function(n,e,t,A,i){if(t[A]===0)return Ze;var r=A-1;if(Array.isArray(i)&&i[r]===!0)return Ze;var s=r-1,a=r+1,o=e[r],l=s>=0?e[s]:0,c=e[a];if(o===ig&&c===rg)return Ze;if(du.indexOf(o)!==-1)return og;if(du.indexOf(c)!==-1||lg.indexOf(c)!==-1)return Ze;if(Jh(r,e)===sg)return ha;if(hu.get(n[r])===ru||(o===ua||o===fa)&&hu.get(n[a])===ru||o===kh||c===kh||o===zh||[On,su,qr].indexOf(o)===-1&&c===zh||[ca,Vr,X_,Zi,qi].indexOf(c)!==-1||Jh(r,e)===kr||Ol(Hl,kr,r,e)||Ol([ca,Vr],ou,r,e)||Ol(Kh,Kh,r,e))return Ze;if(o===On)return ha;if(o===Hl||c===Hl)return Ze;if(c===au||o===au)return ha;if([su,qr,ou].indexOf(c)!==-1||o===W_||l===uu&&$_.indexOf(o)!==-1||o===qi&&c===uu||c===Wh||dn.indexOf(c)!==-1&&o===xA||dn.indexOf(o)!==-1&&c===xA||o===$r&&[ps,ua,fa].indexOf(c)!==-1||[ps,ua,fa].indexOf(o)!==-1&&c===jr||dn.indexOf(o)!==-1&&Xh.indexOf(c)!==-1||Xh.indexOf(o)!==-1&&dn.indexOf(c)!==-1||[$r,jr].indexOf(o)!==-1&&(c===xA||[kr,qr].indexOf(c)!==-1&&e[a+1]===xA)||[kr,qr].indexOf(o)!==-1&&c===xA||o===xA&&[xA,qi,Zi].indexOf(c)!==-1)return Ze;if([xA,qi,Zi,ca,Vr].indexOf(c)!==-1)for(var u=r;u>=0;){var f=e[u];if(f===xA)return Ze;if([qi,Zi].indexOf(f)!==-1)u--;else break}if([$r,jr].indexOf(c)!==-1)for(var u=[ca,Vr].indexOf(o)!==-1?s:r;u>=0;){var f=e[u];if(f===xA)return Ze;if([qi,Zi].indexOf(f)!==-1)u--;else break}if(fu===o&&[fu,Wa,lu,cu].indexOf(c)!==-1||[Wa,lu].indexOf(o)!==-1&&[Wa,Xa].indexOf(c)!==-1||[Xa,cu].indexOf(o)!==-1&&c===Xa||Yh.indexOf(o)!==-1&&[Wh,jr].indexOf(c)!==-1||Yh.indexOf(c)!==-1&&o===$r||dn.indexOf(o)!==-1&&dn.indexOf(c)!==-1||o===Zi&&dn.indexOf(c)!==-1||dn.concat(xA).indexOf(o)!==-1&&c===kr&&q_.indexOf(n[a])===-1||dn.concat(xA).indexOf(c)!==-1&&o===Vr)return Ze;if(o===Nl&&c===Nl){for(var p=t[r],g=1;p>0&&(p--,e[p]===Nl);)g++;if(g%2!==0)return Ze}return o===ua&&c===fa?Ze:ha},AE=function(n,e){e||(e={lineBreak:"normal",wordBreak:"normal"});var t=eE(n,e.lineBreak),A=t[0],i=t[1],r=t[2];(e.wordBreak==="break-all"||e.wordBreak==="break-word")&&(i=i.map(function(a){return[xA,fi,ag].indexOf(a)!==-1?ps:a}));var s=e.wordBreak==="keep-all"?r.map(function(a,o){return a&&n[o]>=19968&&n[o]<=40959}):void 0;return[A,i,s]},nE=(function(){function n(e,t,A,i){this.codePoints=e,this.required=t===og,this.start=A,this.end=i}return n.prototype.slice=function(){return bt.apply(void 0,this.codePoints.slice(this.start,this.end))},n})(),iE=function(n,e){var t=zo(n),A=AE(t,e),i=A[0],r=A[1],s=A[2],a=t.length,o=0,l=0;return{next:function(){if(l>=a)return{done:!0,value:null};for(var c=Ze;l<a&&(c=tE(t,r,i,++l,s))===Ze;);if(c!==Ze||l===a){var u=new nE(t,c,o,l);return o=l,{value:u,done:!1}}return{done:!0,value:null}}}},rE=1,sE=2,Ss=4,Zh=8,co=10,qh=47,ss=92,aE=9,oE=32,da=34,zr=61,lE=35,cE=36,uE=37,pa=39,ga=40,Kr=41,fE=95,pA=45,hE=33,dE=60,pE=62,gE=64,mE=91,BE=93,vE=61,wE=123,ma=63,CE=125,jh=124,xE=126,_E=128,$h=65533,Gl=42,di=43,EE=44,yE=58,UE=59,gs=46,SE=0,ME=8,bE=11,FE=14,TE=31,IE=127,ZA=-1,cg=48,ug=97,fg=101,QE=102,LE=117,RE=122,hg=65,dg=69,pg=70,DE=85,PE=90,rA=function(n){return n>=cg&&n<=57},HE=function(n){return n>=55296&&n<=57343},ji=function(n){return rA(n)||n>=hg&&n<=pg||n>=ug&&n<=QE},NE=function(n){return n>=ug&&n<=RE},OE=function(n){return n>=hg&&n<=PE},GE=function(n){return NE(n)||OE(n)},VE=function(n){return n>=_E},Ba=function(n){return n===co||n===aE||n===oE},uo=function(n){return GE(n)||VE(n)||n===fE},ed=function(n){return uo(n)||rA(n)||n===pA},kE=function(n){return n>=SE&&n<=ME||n===bE||n>=FE&&n<=TE||n===IE},Pn=function(n,e){return n!==ss?!1:e!==co},va=function(n,e,t){return n===pA?uo(e)||Pn(e,t):uo(n)?!0:!!(n===ss&&Pn(n,e))},Vl=function(n,e,t){return n===di||n===pA?rA(e)?!0:e===gs&&rA(t):rA(n===gs?e:n)},zE=function(n){var e=0,t=1;(n[e]===di||n[e]===pA)&&(n[e]===pA&&(t=-1),e++);for(var A=[];rA(n[e]);)A.push(n[e++]);var i=A.length?parseInt(bt.apply(void 0,A),10):0;n[e]===gs&&e++;for(var r=[];rA(n[e]);)r.push(n[e++]);var s=r.length,a=s?parseInt(bt.apply(void 0,r),10):0;(n[e]===dg||n[e]===fg)&&e++;var o=1;(n[e]===di||n[e]===pA)&&(n[e]===pA&&(o=-1),e++);for(var l=[];rA(n[e]);)l.push(n[e++]);var c=l.length?parseInt(bt.apply(void 0,l),10):0;return t*(i+a*Math.pow(10,-s))*Math.pow(10,o*c)},KE={type:2},WE={type:3},XE={type:4},YE={type:13},JE={type:8},ZE={type:21},qE={type:9},jE={type:10},$E={type:11},ey={type:12},ty={type:14},wa={type:23},Ay={type:1},ny={type:25},iy={type:24},ry={type:26},sy={type:27},ay={type:28},oy={type:29},ly={type:31},pu={type:32},gg=(function(){function n(){this._value=[]}return n.prototype.write=function(e){this._value=this._value.concat(zo(e))},n.prototype.read=function(){for(var e=[],t=this.consumeToken();t!==pu;)e.push(t),t=this.consumeToken();return e},n.prototype.consumeToken=function(){var e=this.consumeCodePoint();switch(e){case da:return this.consumeStringToken(da);case lE:var t=this.peekCodePoint(0),A=this.peekCodePoint(1),i=this.peekCodePoint(2);if(ed(t)||Pn(A,i)){var r=va(t,A,i)?sE:rE,s=this.consumeName();return{type:5,value:s,flags:r}}break;case cE:if(this.peekCodePoint(0)===zr)return this.consumeCodePoint(),YE;break;case pa:return this.consumeStringToken(pa);case ga:return KE;case Kr:return WE;case Gl:if(this.peekCodePoint(0)===zr)return this.consumeCodePoint(),ty;break;case di:if(Vl(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case EE:return XE;case pA:var a=e,o=this.peekCodePoint(0),l=this.peekCodePoint(1);if(Vl(a,o,l))return this.reconsumeCodePoint(e),this.consumeNumericToken();if(va(a,o,l))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();if(o===pA&&l===pE)return this.consumeCodePoint(),this.consumeCodePoint(),iy;break;case gs:if(Vl(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case qh:if(this.peekCodePoint(0)===Gl)for(this.consumeCodePoint();;){var c=this.consumeCodePoint();if(c===Gl&&(c=this.consumeCodePoint(),c===qh))return this.consumeToken();if(c===ZA)return this.consumeToken()}break;case yE:return ry;case UE:return sy;case dE:if(this.peekCodePoint(0)===hE&&this.peekCodePoint(1)===pA&&this.peekCodePoint(2)===pA)return this.consumeCodePoint(),this.consumeCodePoint(),ny;break;case gE:var u=this.peekCodePoint(0),f=this.peekCodePoint(1),p=this.peekCodePoint(2);if(va(u,f,p)){var s=this.consumeName();return{type:7,value:s}}break;case mE:return ay;case ss:if(Pn(e,this.peekCodePoint(0)))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();break;case BE:return oy;case vE:if(this.peekCodePoint(0)===zr)return this.consumeCodePoint(),JE;break;case wE:return $E;case CE:return ey;case LE:case DE:var g=this.peekCodePoint(0),m=this.peekCodePoint(1);return g===di&&(ji(m)||m===ma)&&(this.consumeCodePoint(),this.consumeUnicodeRangeToken()),this.reconsumeCodePoint(e),this.consumeIdentLikeToken();case jh:if(this.peekCodePoint(0)===zr)return this.consumeCodePoint(),qE;if(this.peekCodePoint(0)===jh)return this.consumeCodePoint(),ZE;break;case xE:if(this.peekCodePoint(0)===zr)return this.consumeCodePoint(),jE;break;case ZA:return pu}return Ba(e)?(this.consumeWhiteSpace(),ly):rA(e)?(this.reconsumeCodePoint(e),this.consumeNumericToken()):uo(e)?(this.reconsumeCodePoint(e),this.consumeIdentLikeToken()):{type:6,value:bt(e)}},n.prototype.consumeCodePoint=function(){var e=this._value.shift();return typeof e>"u"?-1:e},n.prototype.reconsumeCodePoint=function(e){this._value.unshift(e)},n.prototype.peekCodePoint=function(e){return e>=this._value.length?-1:this._value[e]},n.prototype.consumeUnicodeRangeToken=function(){for(var e=[],t=this.consumeCodePoint();ji(t)&&e.length<6;)e.push(t),t=this.consumeCodePoint();for(var A=!1;t===ma&&e.length<6;)e.push(t),t=this.consumeCodePoint(),A=!0;if(A){var i=parseInt(bt.apply(void 0,e.map(function(o){return o===ma?cg:o})),16),r=parseInt(bt.apply(void 0,e.map(function(o){return o===ma?pg:o})),16);return{type:30,start:i,end:r}}var s=parseInt(bt.apply(void 0,e),16);if(this.peekCodePoint(0)===pA&&ji(this.peekCodePoint(1))){this.consumeCodePoint(),t=this.consumeCodePoint();for(var a=[];ji(t)&&a.length<6;)a.push(t),t=this.consumeCodePoint();var r=parseInt(bt.apply(void 0,a),16);return{type:30,start:s,end:r}}else return{type:30,start:s,end:s}},n.prototype.consumeIdentLikeToken=function(){var e=this.consumeName();return e.toLowerCase()==="url"&&this.peekCodePoint(0)===ga?(this.consumeCodePoint(),this.consumeUrlToken()):this.peekCodePoint(0)===ga?(this.consumeCodePoint(),{type:19,value:e}):{type:20,value:e}},n.prototype.consumeUrlToken=function(){var e=[];if(this.consumeWhiteSpace(),this.peekCodePoint(0)===ZA)return{type:22,value:""};var t=this.peekCodePoint(0);if(t===pa||t===da){var A=this.consumeStringToken(this.consumeCodePoint());return A.type===0&&(this.consumeWhiteSpace(),this.peekCodePoint(0)===ZA||this.peekCodePoint(0)===Kr)?(this.consumeCodePoint(),{type:22,value:A.value}):(this.consumeBadUrlRemnants(),wa)}for(;;){var i=this.consumeCodePoint();if(i===ZA||i===Kr)return{type:22,value:bt.apply(void 0,e)};if(Ba(i))return this.consumeWhiteSpace(),this.peekCodePoint(0)===ZA||this.peekCodePoint(0)===Kr?(this.consumeCodePoint(),{type:22,value:bt.apply(void 0,e)}):(this.consumeBadUrlRemnants(),wa);if(i===da||i===pa||i===ga||kE(i))return this.consumeBadUrlRemnants(),wa;if(i===ss)if(Pn(i,this.peekCodePoint(0)))e.push(this.consumeEscapedCodePoint());else return this.consumeBadUrlRemnants(),wa;else e.push(i)}},n.prototype.consumeWhiteSpace=function(){for(;Ba(this.peekCodePoint(0));)this.consumeCodePoint()},n.prototype.consumeBadUrlRemnants=function(){for(;;){var e=this.consumeCodePoint();if(e===Kr||e===ZA)return;Pn(e,this.peekCodePoint(0))&&this.consumeEscapedCodePoint()}},n.prototype.consumeStringSlice=function(e){for(var t=5e4,A="";e>0;){var i=Math.min(t,e);A+=bt.apply(void 0,this._value.splice(0,i)),e-=i}return this._value.shift(),A},n.prototype.consumeStringToken=function(e){var t="",A=0;do{var i=this._value[A];if(i===ZA||i===void 0||i===e)return t+=this.consumeStringSlice(A),{type:0,value:t};if(i===co)return this._value.splice(0,A),Ay;if(i===ss){var r=this._value[A+1];r!==ZA&&r!==void 0&&(r===co?(t+=this.consumeStringSlice(A),A=-1,this._value.shift()):Pn(i,r)&&(t+=this.consumeStringSlice(A),t+=bt(this.consumeEscapedCodePoint()),A=-1))}A++}while(!0)},n.prototype.consumeNumber=function(){var e=[],t=Ss,A=this.peekCodePoint(0);for((A===di||A===pA)&&e.push(this.consumeCodePoint());rA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0);var i=this.peekCodePoint(1);if(A===gs&&rA(i))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=Zh;rA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0),i=this.peekCodePoint(1);var r=this.peekCodePoint(2);if((A===dg||A===fg)&&((i===di||i===pA)&&rA(r)||rA(i)))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=Zh;rA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());return[zE(e),t]},n.prototype.consumeNumericToken=function(){var e=this.consumeNumber(),t=e[0],A=e[1],i=this.peekCodePoint(0),r=this.peekCodePoint(1),s=this.peekCodePoint(2);if(va(i,r,s)){var a=this.consumeName();return{type:15,number:t,flags:A,unit:a}}return i===uE?(this.consumeCodePoint(),{type:16,number:t,flags:A}):{type:17,number:t,flags:A}},n.prototype.consumeEscapedCodePoint=function(){var e=this.consumeCodePoint();if(ji(e)){for(var t=bt(e);ji(this.peekCodePoint(0))&&t.length<6;)t+=bt(this.consumeCodePoint());Ba(this.peekCodePoint(0))&&this.consumeCodePoint();var A=parseInt(t,16);return A===0||HE(A)||A>1114111?$h:A}return e===ZA?$h:e},n.prototype.consumeName=function(){for(var e="";;){var t=this.consumeCodePoint();if(ed(t))e+=bt(t);else if(Pn(t,this.peekCodePoint(0)))e+=bt(this.consumeEscapedCodePoint());else return this.reconsumeCodePoint(t),e}},n})(),mg=(function(){function n(e){this._tokens=e}return n.create=function(e){var t=new gg;return t.write(e),new n(t.read())},n.parseValue=function(e){return n.create(e).parseComponentValue()},n.parseValues=function(e){return n.create(e).parseComponentValues()},n.prototype.parseComponentValue=function(){for(var e=this.consumeToken();e.type===31;)e=this.consumeToken();if(e.type===32)throw new SyntaxError("Error parsing CSS component value, unexpected EOF");this.reconsumeToken(e);var t=this.consumeComponentValue();do e=this.consumeToken();while(e.type===31);if(e.type===32)return t;throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")},n.prototype.parseComponentValues=function(){for(var e=[];;){var t=this.consumeComponentValue();if(t.type===32)return e;e.push(t),e.push()}},n.prototype.consumeComponentValue=function(){var e=this.consumeToken();switch(e.type){case 11:case 28:case 2:return this.consumeSimpleBlock(e.type);case 19:return this.consumeFunction(e)}return e},n.prototype.consumeSimpleBlock=function(e){for(var t={type:e,values:[]},A=this.consumeToken();;){if(A.type===32||uy(A,e))return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue()),A=this.consumeToken()}},n.prototype.consumeFunction=function(e){for(var t={name:e.value,values:[],type:18};;){var A=this.consumeToken();if(A.type===32||A.type===3)return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue())}},n.prototype.consumeToken=function(){var e=this._tokens.shift();return typeof e>"u"?pu:e},n.prototype.reconsumeToken=function(e){this._tokens.unshift(e)},n})(),Ms=function(n){return n.type===15},Ir=function(n){return n.type===17},ft=function(n){return n.type===20},cy=function(n){return n.type===0},gu=function(n,e){return ft(n)&&n.value===e},Bg=function(n){return n.type!==31},Mr=function(n){return n.type!==31&&n.type!==4},sn=function(n){var e=[],t=[];return n.forEach(function(A){if(A.type===4){if(t.length===0)throw new Error("Error parsing function args, zero tokens for arg");e.push(t),t=[];return}A.type!==31&&t.push(A)}),t.length&&e.push(t),e},uy=function(n,e){return e===11&&n.type===12||e===28&&n.type===29?!0:e===2&&n.type===3},$n=function(n){return n.type===17||n.type===15},Qt=function(n){return n.type===16||$n(n)},vg=function(n){return n.length>1?[n[0],n[1]]:[n[0]]},jt={type:17,number:0,flags:Ss},Af={type:16,number:50,flags:Ss},Gn={type:16,number:100,flags:Ss},es=function(n,e,t){var A=n[0],i=n[1];return[pt(A,e),pt(typeof i<"u"?i:A,t)]},pt=function(n,e){if(n.type===16)return n.number/100*e;if(Ms(n))switch(n.unit){case"rem":case"em":return 16*n.number;case"px":default:return n.number}return n.number},wg="deg",Cg="grad",xg="rad",_g="turn",Ko={name:"angle",parse:function(n,e){if(e.type===15)switch(e.unit){case wg:return Math.PI*e.number/180;case Cg:return Math.PI/200*e.number;case xg:return e.number;case _g:return Math.PI*2*e.number}throw new Error("Unsupported angle type")}},Eg=function(n){return n.type===15&&(n.unit===wg||n.unit===Cg||n.unit===xg||n.unit===_g)},yg=function(n){var e=n.filter(ft).map(function(t){return t.value}).join(" ");switch(e){case"to bottom right":case"to right bottom":case"left top":case"top left":return[jt,jt];case"to top":case"bottom":return DA(0);case"to bottom left":case"to left bottom":case"right top":case"top right":return[jt,Gn];case"to right":case"left":return DA(90);case"to top left":case"to left top":case"right bottom":case"bottom right":return[Gn,Gn];case"to bottom":case"top":return DA(180);case"to top right":case"to right top":case"left bottom":case"bottom left":return[Gn,jt];case"to left":case"right":return DA(270)}return 0},DA=function(n){return Math.PI*n/180},Wn={name:"color",parse:function(n,e){if(e.type===18){var t=fy[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported color function "'+e.name+'"');return t(n,e.values)}if(e.type===5){if(e.value.length===3){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3);return Vn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),1)}if(e.value.length===4){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3),s=e.value.substring(3,4);return Vn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),parseInt(s+s,16)/255)}if(e.value.length===6){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6);return Vn(parseInt(A,16),parseInt(i,16),parseInt(r,16),1)}if(e.value.length===8){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6),s=e.value.substring(6,8);return Vn(parseInt(A,16),parseInt(i,16),parseInt(r,16),parseInt(s,16)/255)}}if(e.type===20){var a=_n[e.value.toUpperCase()];if(typeof a<"u")return a}return _n.TRANSPARENT}},Xn=function(n){return(255&n)===0},Ot=function(n){var e=255&n,t=255&n>>8,A=255&n>>16,i=255&n>>24;return e<255?"rgba("+i+","+A+","+t+","+e/255+")":"rgb("+i+","+A+","+t+")"},Vn=function(n,e,t,A){return(n<<24|e<<16|t<<8|Math.round(A*255)<<0)>>>0},td=function(n,e){if(n.type===17)return n.number;if(n.type===16){var t=e===3?1:255;return e===3?n.number/100*t:Math.round(n.number/100*t)}return 0},Ad=function(n,e){var t=e.filter(Mr);if(t.length===3){var A=t.map(td),i=A[0],r=A[1],s=A[2];return Vn(i,r,s,1)}if(t.length===4){var a=t.map(td),i=a[0],r=a[1],s=a[2],o=a[3];return Vn(i,r,s,o)}return 0};function kl(n,e,t){return t<0&&(t+=1),t>=1&&(t-=1),t<1/6?(e-n)*t*6+n:t<1/2?e:t<2/3?(e-n)*6*(2/3-t)+n:n}var nd=function(n,e){var t=e.filter(Mr),A=t[0],i=t[1],r=t[2],s=t[3],a=(A.type===17?DA(A.number):Ko.parse(n,A))/(Math.PI*2),o=Qt(i)?i.number/100:0,l=Qt(r)?r.number/100:0,c=typeof s<"u"&&Qt(s)?pt(s,1):1;if(o===0)return Vn(l*255,l*255,l*255,1);var u=l<=.5?l*(o+1):l+o-l*o,f=l*2-u,p=kl(f,u,a+1/3),g=kl(f,u,a),m=kl(f,u,a-1/3);return Vn(p*255,g*255,m*255,c)},fy={hsl:nd,hsla:nd,rgb:Ad,rgba:Ad},as=function(n,e){return Wn.parse(n,mg.create(e).parseComponentValue())},_n={ALICEBLUE:4042850303,ANTIQUEWHITE:4209760255,AQUA:16777215,AQUAMARINE:2147472639,AZURE:4043309055,BEIGE:4126530815,BISQUE:4293182719,BLACK:255,BLANCHEDALMOND:4293643775,BLUE:65535,BLUEVIOLET:2318131967,BROWN:2771004159,BURLYWOOD:3736635391,CADETBLUE:1604231423,CHARTREUSE:2147418367,CHOCOLATE:3530104575,CORAL:4286533887,CORNFLOWERBLUE:1687547391,CORNSILK:4294499583,CRIMSON:3692313855,CYAN:16777215,DARKBLUE:35839,DARKCYAN:9145343,DARKGOLDENROD:3095837695,DARKGRAY:2846468607,DARKGREEN:6553855,DARKGREY:2846468607,DARKKHAKI:3182914559,DARKMAGENTA:2332068863,DARKOLIVEGREEN:1433087999,DARKORANGE:4287365375,DARKORCHID:2570243327,DARKRED:2332033279,DARKSALMON:3918953215,DARKSEAGREEN:2411499519,DARKSLATEBLUE:1211993087,DARKSLATEGRAY:793726975,DARKSLATEGREY:793726975,DARKTURQUOISE:13554175,DARKVIOLET:2483082239,DEEPPINK:4279538687,DEEPSKYBLUE:12582911,DIMGRAY:1768516095,DIMGREY:1768516095,DODGERBLUE:512819199,FIREBRICK:2988581631,FLORALWHITE:4294635775,FORESTGREEN:579543807,FUCHSIA:4278255615,GAINSBORO:3705462015,GHOSTWHITE:4177068031,GOLD:4292280575,GOLDENROD:3668254975,GRAY:2155905279,GREEN:8388863,GREENYELLOW:2919182335,GREY:2155905279,HONEYDEW:4043305215,HOTPINK:4285117695,INDIANRED:3445382399,INDIGO:1258324735,IVORY:4294963455,KHAKI:4041641215,LAVENDER:3873897215,LAVENDERBLUSH:4293981695,LAWNGREEN:2096890111,LEMONCHIFFON:4294626815,LIGHTBLUE:2916673279,LIGHTCORAL:4034953471,LIGHTCYAN:3774873599,LIGHTGOLDENRODYELLOW:4210742015,LIGHTGRAY:3553874943,LIGHTGREEN:2431553791,LIGHTGREY:3553874943,LIGHTPINK:4290167295,LIGHTSALMON:4288707327,LIGHTSEAGREEN:548580095,LIGHTSKYBLUE:2278488831,LIGHTSLATEGRAY:2005441023,LIGHTSLATEGREY:2005441023,LIGHTSTEELBLUE:2965692159,LIGHTYELLOW:4294959359,LIME:16711935,LIMEGREEN:852308735,LINEN:4210091775,MAGENTA:4278255615,MAROON:2147483903,MEDIUMAQUAMARINE:1724754687,MEDIUMBLUE:52735,MEDIUMORCHID:3126187007,MEDIUMPURPLE:2473647103,MEDIUMSEAGREEN:1018393087,MEDIUMSLATEBLUE:2070474495,MEDIUMSPRINGGREEN:16423679,MEDIUMTURQUOISE:1221709055,MEDIUMVIOLETRED:3340076543,MIDNIGHTBLUE:421097727,MINTCREAM:4127193855,MISTYROSE:4293190143,MOCCASIN:4293178879,NAVAJOWHITE:4292783615,NAVY:33023,OLDLACE:4260751103,OLIVE:2155872511,OLIVEDRAB:1804477439,ORANGE:4289003775,ORANGERED:4282712319,ORCHID:3664828159,PALEGOLDENROD:4008225535,PALEGREEN:2566625535,PALETURQUOISE:2951671551,PALEVIOLETRED:3681588223,PAPAYAWHIP:4293907967,PEACHPUFF:4292524543,PERU:3448061951,PINK:4290825215,PLUM:3718307327,POWDERBLUE:2967529215,PURPLE:2147516671,REBECCAPURPLE:1714657791,RED:4278190335,ROSYBROWN:3163525119,ROYALBLUE:1097458175,SADDLEBROWN:2336560127,SALMON:4202722047,SANDYBROWN:4104413439,SEAGREEN:780883967,SEASHELL:4294307583,SIENNA:2689740287,SILVER:3233857791,SKYBLUE:2278484991,SLATEBLUE:1784335871,SLATEGRAY:1887473919,SLATEGREY:1887473919,SNOW:4294638335,SPRINGGREEN:16744447,STEELBLUE:1182971135,TAN:3535047935,TEAL:8421631,THISTLE:3636451583,TOMATO:4284696575,TRANSPARENT:0,TURQUOISE:1088475391,VIOLET:4001558271,WHEAT:4125012991,WHITE:4294967295,WHITESMOKE:4126537215,YELLOW:4294902015,YELLOWGREEN:2597139199},hy={name:"background-clip",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(ft(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},dy={name:"background-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Wo=function(n,e){var t=Wn.parse(n,e[0]),A=e[1];return A&&Qt(A)?{color:t,stop:A}:{color:t,stop:null}},id=function(n,e){var t=n[0],A=n[n.length-1];t.stop===null&&(t.stop=jt),A.stop===null&&(A.stop=Gn);for(var i=[],r=0,s=0;s<n.length;s++){var a=n[s].stop;if(a!==null){var o=pt(a,e);o>r?i.push(o):i.push(r),r=o}else i.push(null)}for(var l=null,s=0;s<i.length;s++){var c=i[s];if(c===null)l===null&&(l=s);else if(l!==null){for(var u=s-l,f=i[l-1],p=(c-f)/(u+1),g=1;g<=u;g++)i[l+g-1]=p*g;l=null}}return n.map(function(m,d){var h=m.color;return{color:h,stop:Math.max(Math.min(1,i[d]/e),0)}})},py=function(n,e,t){var A=e/2,i=t/2,r=pt(n[0],e)-A,s=i-pt(n[1],t);return(Math.atan2(s,r)+Math.PI*2)%(Math.PI*2)},gy=function(n,e,t){var A=typeof n=="number"?n:py(n,e,t),i=Math.abs(e*Math.sin(A))+Math.abs(t*Math.cos(A)),r=e/2,s=t/2,a=i/2,o=Math.sin(A-Math.PI/2)*a,l=Math.cos(A-Math.PI/2)*a;return[i,r-l,r+l,s-o,s+o]},kA=function(n,e){return Math.sqrt(n*n+e*e)},rd=function(n,e,t,A,i){var r=[[0,0],[0,e],[n,0],[n,e]];return r.reduce(function(s,a){var o=a[0],l=a[1],c=kA(t-o,A-l);return(i?c<s.optimumDistance:c>s.optimumDistance)?{optimumCorner:a,optimumDistance:c}:s},{optimumDistance:i?1/0:-1/0,optimumCorner:null}).optimumCorner},my=function(n,e,t,A,i){var r=0,s=0;switch(n.size){case 0:n.shape===0?r=s=Math.min(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.min(Math.abs(e),Math.abs(e-A)),s=Math.min(Math.abs(t),Math.abs(t-i)));break;case 2:if(n.shape===0)r=s=Math.min(kA(e,t),kA(e,t-i),kA(e-A,t),kA(e-A,t-i));else if(n.shape===1){var a=Math.min(Math.abs(t),Math.abs(t-i))/Math.min(Math.abs(e),Math.abs(e-A)),o=rd(A,i,e,t,!0),l=o[0],c=o[1];r=kA(l-e,(c-t)/a),s=a*r}break;case 1:n.shape===0?r=s=Math.max(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.max(Math.abs(e),Math.abs(e-A)),s=Math.max(Math.abs(t),Math.abs(t-i)));break;case 3:if(n.shape===0)r=s=Math.max(kA(e,t),kA(e,t-i),kA(e-A,t),kA(e-A,t-i));else if(n.shape===1){var a=Math.max(Math.abs(t),Math.abs(t-i))/Math.max(Math.abs(e),Math.abs(e-A)),u=rd(A,i,e,t,!1),l=u[0],c=u[1];r=kA(l-e,(c-t)/a),s=a*r}break}return Array.isArray(n.size)&&(r=pt(n.size[0],A),s=n.size.length===2?pt(n.size[1],i):r),[r,s]},By=function(n,e){var t=DA(180),A=[];return sn(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&s.value==="to"){t=yg(i);return}else if(Eg(s)){t=Ko.parse(n,s);return}}var a=Wo(n,i);A.push(a)}),{angle:t,stops:A,type:1}},Ca=function(n,e){var t=DA(180),A=[];return sn(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&["top","left","right","bottom"].indexOf(s.value)!==-1){t=yg(i);return}else if(Eg(s)){t=(Ko.parse(n,s)+DA(270))%DA(360);return}}var a=Wo(n,i);A.push(a)}),{angle:t,stops:A,type:1}},vy=function(n,e){var t=DA(180),A=[],i=1,r=0,s=3,a=[];return sn(e).forEach(function(o,l){var c=o[0];if(l===0){if(ft(c)&&c.value==="linear"){i=1;return}else if(ft(c)&&c.value==="radial"){i=2;return}}if(c.type===18){if(c.name==="from"){var u=Wn.parse(n,c.values[0]);A.push({stop:jt,color:u})}else if(c.name==="to"){var u=Wn.parse(n,c.values[0]);A.push({stop:Gn,color:u})}else if(c.name==="color-stop"){var f=c.values.filter(Mr);if(f.length===2){var u=Wn.parse(n,f[1]),p=f[0];Ir(p)&&A.push({stop:{type:16,number:p.number*100,flags:p.flags},color:u})}}}}),i===1?{angle:(t+DA(180))%DA(360),stops:A,type:i}:{size:s,shape:r,stops:A,position:a,type:i}},Ug="closest-side",Sg="farthest-side",Mg="closest-corner",bg="farthest-corner",Fg="circle",Tg="ellipse",Ig="cover",Qg="contain",wy=function(n,e){var t=0,A=3,i=[],r=[];return sn(e).forEach(function(s,a){var o=!0;if(a===0){var l=!1;o=s.reduce(function(u,f){if(l)if(ft(f))switch(f.value){case"center":return r.push(Af),u;case"top":case"left":return r.push(jt),u;case"right":case"bottom":return r.push(Gn),u}else(Qt(f)||$n(f))&&r.push(f);else if(ft(f))switch(f.value){case Fg:return t=0,!1;case Tg:return t=1,!1;case"at":return l=!0,!1;case Ug:return A=0,!1;case Ig:case Sg:return A=1,!1;case Qg:case Mg:return A=2,!1;case bg:return A=3,!1}else if($n(f)||Qt(f))return Array.isArray(A)||(A=[]),A.push(f),!1;return u},o)}if(o){var c=Wo(n,s);i.push(c)}}),{size:A,shape:t,stops:i,position:r,type:2}},xa=function(n,e){var t=0,A=3,i=[],r=[];return sn(e).forEach(function(s,a){var o=!0;if(a===0?o=s.reduce(function(c,u){if(ft(u))switch(u.value){case"center":return r.push(Af),!1;case"top":case"left":return r.push(jt),!1;case"right":case"bottom":return r.push(Gn),!1}else if(Qt(u)||$n(u))return r.push(u),!1;return c},o):a===1&&(o=s.reduce(function(c,u){if(ft(u))switch(u.value){case Fg:return t=0,!1;case Tg:return t=1,!1;case Qg:case Ug:return A=0,!1;case Sg:return A=1,!1;case Mg:return A=2,!1;case Ig:case bg:return A=3,!1}else if($n(u)||Qt(u))return Array.isArray(A)||(A=[]),A.push(u),!1;return c},o)),o){var l=Wo(n,s);i.push(l)}}),{size:A,shape:t,stops:i,position:r,type:2}},Cy=function(n){return n.type===1},xy=function(n){return n.type===2},nf={name:"image",parse:function(n,e){if(e.type===22){var t={url:e.value,type:0};return n.cache.addImage(e.value),t}if(e.type===18){var A=Lg[e.name];if(typeof A>"u")throw new Error('Attempting to parse an unsupported image function "'+e.name+'"');return A(n,e.values)}throw new Error("Unsupported image type "+e.type)}};function _y(n){return!(n.type===20&&n.value==="none")&&(n.type!==18||!!Lg[n.name])}var Lg={"linear-gradient":By,"-moz-linear-gradient":Ca,"-ms-linear-gradient":Ca,"-o-linear-gradient":Ca,"-webkit-linear-gradient":Ca,"radial-gradient":wy,"-moz-radial-gradient":xa,"-ms-radial-gradient":xa,"-o-radial-gradient":xa,"-webkit-radial-gradient":xa,"-webkit-gradient":vy},Ey={name:"background-image",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e.filter(function(A){return Mr(A)&&_y(A)}).map(function(A){return nf.parse(n,A)})}},yy={name:"background-origin",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(ft(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},Uy={name:"background-position",initialValue:"0% 0%",type:1,prefix:!1,parse:function(n,e){return sn(e).map(function(t){return t.filter(Qt)}).map(vg)}},Sy={name:"background-repeat",initialValue:"repeat",prefix:!1,type:1,parse:function(n,e){return sn(e).map(function(t){return t.filter(ft).map(function(A){return A.value}).join(" ")}).map(My)}},My=function(n){switch(n){case"no-repeat":return 1;case"repeat-x":case"repeat no-repeat":return 2;case"repeat-y":case"no-repeat repeat":return 3;case"repeat":default:return 0}},pr;(function(n){n.AUTO="auto",n.CONTAIN="contain",n.COVER="cover"})(pr||(pr={}));var by={name:"background-size",initialValue:"0",prefix:!1,type:1,parse:function(n,e){return sn(e).map(function(t){return t.filter(Fy)})}},Fy=function(n){return ft(n)||Qt(n)},Xo=function(n){return{name:"border-"+n+"-color",initialValue:"transparent",prefix:!1,type:3,format:"color"}},Ty=Xo("top"),Iy=Xo("right"),Qy=Xo("bottom"),Ly=Xo("left"),Yo=function(n){return{name:"border-radius-"+n,initialValue:"0 0",prefix:!1,type:1,parse:function(e,t){return vg(t.filter(Qt))}}},Ry=Yo("top-left"),Dy=Yo("top-right"),Py=Yo("bottom-right"),Hy=Yo("bottom-left"),Jo=function(n){return{name:"border-"+n+"-style",initialValue:"solid",prefix:!1,type:2,parse:function(e,t){switch(t){case"none":return 0;case"dashed":return 2;case"dotted":return 3;case"double":return 4}return 1}}},Ny=Jo("top"),Oy=Jo("right"),Gy=Jo("bottom"),Vy=Jo("left"),Zo=function(n){return{name:"border-"+n+"-width",initialValue:"0",type:0,prefix:!1,parse:function(e,t){return Ms(t)?t.number:0}}},ky=Zo("top"),zy=Zo("right"),Ky=Zo("bottom"),Wy=Zo("left"),Xy={name:"color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Yy={name:"direction",initialValue:"ltr",prefix:!1,type:2,parse:function(n,e){switch(e){case"rtl":return 1;case"ltr":default:return 0}}},Jy={name:"display",initialValue:"inline-block",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).reduce(function(t,A){return t|Zy(A.value)},0)}},Zy=function(n){switch(n){case"block":case"-webkit-box":return 2;case"inline":return 4;case"run-in":return 8;case"flow":return 16;case"flow-root":return 32;case"table":return 64;case"flex":case"-webkit-flex":return 128;case"grid":case"-ms-grid":return 256;case"ruby":return 512;case"subgrid":return 1024;case"list-item":return 2048;case"table-row-group":return 4096;case"table-header-group":return 8192;case"table-footer-group":return 16384;case"table-row":return 32768;case"table-cell":return 65536;case"table-column-group":return 131072;case"table-column":return 262144;case"table-caption":return 524288;case"ruby-base":return 1048576;case"ruby-text":return 2097152;case"ruby-base-container":return 4194304;case"ruby-text-container":return 8388608;case"contents":return 16777216;case"inline-block":return 33554432;case"inline-list-item":return 67108864;case"inline-table":return 134217728;case"inline-flex":return 268435456;case"inline-grid":return 536870912}return 0},qy={name:"float",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"left":return 1;case"right":return 2;case"inline-start":return 3;case"inline-end":return 4}return 0}},jy={name:"letter-spacing",initialValue:"0",prefix:!1,type:0,parse:function(n,e){return e.type===20&&e.value==="normal"?0:e.type===17||e.type===15?e.number:0}},fo;(function(n){n.NORMAL="normal",n.STRICT="strict"})(fo||(fo={}));var $y={name:"line-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"strict":return fo.STRICT;case"normal":default:return fo.NORMAL}}},eU={name:"line-height",initialValue:"normal",prefix:!1,type:4},sd=function(n,e){return ft(n)&&n.value==="normal"?1.2*e:n.type===17?e*n.number:Qt(n)?pt(n,e):e},tU={name:"list-style-image",initialValue:"none",type:0,prefix:!1,parse:function(n,e){return e.type===20&&e.value==="none"?null:nf.parse(n,e)}},AU={name:"list-style-position",initialValue:"outside",prefix:!1,type:2,parse:function(n,e){switch(e){case"inside":return 0;case"outside":default:return 1}}},mu={name:"list-style-type",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"disc":return 0;case"circle":return 1;case"square":return 2;case"decimal":return 3;case"cjk-decimal":return 4;case"decimal-leading-zero":return 5;case"lower-roman":return 6;case"upper-roman":return 7;case"lower-greek":return 8;case"lower-alpha":return 9;case"upper-alpha":return 10;case"arabic-indic":return 11;case"armenian":return 12;case"bengali":return 13;case"cambodian":return 14;case"cjk-earthly-branch":return 15;case"cjk-heavenly-stem":return 16;case"cjk-ideographic":return 17;case"devanagari":return 18;case"ethiopic-numeric":return 19;case"georgian":return 20;case"gujarati":return 21;case"gurmukhi":return 22;case"hebrew":return 22;case"hiragana":return 23;case"hiragana-iroha":return 24;case"japanese-formal":return 25;case"japanese-informal":return 26;case"kannada":return 27;case"katakana":return 28;case"katakana-iroha":return 29;case"khmer":return 30;case"korean-hangul-formal":return 31;case"korean-hanja-formal":return 32;case"korean-hanja-informal":return 33;case"lao":return 34;case"lower-armenian":return 35;case"malayalam":return 36;case"mongolian":return 37;case"myanmar":return 38;case"oriya":return 39;case"persian":return 40;case"simp-chinese-formal":return 41;case"simp-chinese-informal":return 42;case"tamil":return 43;case"telugu":return 44;case"thai":return 45;case"tibetan":return 46;case"trad-chinese-formal":return 47;case"trad-chinese-informal":return 48;case"upper-armenian":return 49;case"disclosure-open":return 50;case"disclosure-closed":return 51;case"none":default:return-1}}},qo=function(n){return{name:"margin-"+n,initialValue:"0",prefix:!1,type:4}},nU=qo("top"),iU=qo("right"),rU=qo("bottom"),sU=qo("left"),aU={name:"overflow",initialValue:"visible",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).map(function(t){switch(t.value){case"hidden":return 1;case"scroll":return 2;case"clip":return 3;case"auto":return 4;case"visible":default:return 0}})}},oU={name:"overflow-wrap",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-word":return"break-word";case"normal":default:return"normal"}}},jo=function(n){return{name:"padding-"+n,initialValue:"0",prefix:!1,type:3,format:"length-percentage"}},lU=jo("top"),cU=jo("right"),uU=jo("bottom"),fU=jo("left"),hU={name:"text-align",initialValue:"left",prefix:!1,type:2,parse:function(n,e){switch(e){case"right":return 2;case"center":case"justify":return 1;case"left":default:return 0}}},dU={name:"position",initialValue:"static",prefix:!1,type:2,parse:function(n,e){switch(e){case"relative":return 1;case"absolute":return 2;case"fixed":return 3;case"sticky":return 4}return 0}},pU={name:"text-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&gu(e[0],"none")?[]:sn(e).map(function(t){for(var A={color:_n.TRANSPARENT,offsetX:jt,offsetY:jt,blur:jt},i=0,r=0;r<t.length;r++){var s=t[r];$n(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:A.blur=s,i++):A.color=Wn.parse(n,s)}return A})}},gU={name:"text-transform",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"uppercase":return 2;case"lowercase":return 1;case"capitalize":return 3}return 0}},mU={name:"transform",initialValue:"none",prefix:!0,type:0,parse:function(n,e){if(e.type===20&&e.value==="none")return null;if(e.type===18){var t=wU[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported transform function "'+e.name+'"');return t(e.values)}return null}},BU=function(n){var e=n.filter(function(t){return t.type===17}).map(function(t){return t.number});return e.length===6?e:null},vU=function(n){var e=n.filter(function(o){return o.type===17}).map(function(o){return o.number}),t=e[0],A=e[1];e[2],e[3];var i=e[4],r=e[5];e[6],e[7],e[8],e[9],e[10],e[11];var s=e[12],a=e[13];return e[14],e[15],e.length===16?[t,A,i,r,s,a]:null},wU={matrix:BU,matrix3d:vU},ad={type:16,number:50,flags:Ss},CU=[ad,ad],xU={name:"transform-origin",initialValue:"50% 50%",prefix:!0,type:1,parse:function(n,e){var t=e.filter(Qt);return t.length!==2?CU:[t[0],t[1]]}},_U={name:"visible",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"hidden":return 1;case"collapse":return 2;case"visible":default:return 0}}},os;(function(n){n.NORMAL="normal",n.BREAK_ALL="break-all",n.KEEP_ALL="keep-all"})(os||(os={}));var EU={name:"word-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-all":return os.BREAK_ALL;case"keep-all":return os.KEEP_ALL;case"normal":default:return os.NORMAL}}},yU={name:"z-index",initialValue:"auto",prefix:!1,type:0,parse:function(n,e){if(e.type===20)return{auto:!0,order:0};if(Ir(e))return{auto:!1,order:e.number};throw new Error("Invalid z-index number parsed")}},Rg={name:"time",parse:function(n,e){if(e.type===15)switch(e.unit.toLowerCase()){case"s":return 1e3*e.number;case"ms":return e.number}throw new Error("Unsupported time type")}},UU={name:"opacity",initialValue:"1",type:0,prefix:!1,parse:function(n,e){return Ir(e)?e.number:1}},SU={name:"text-decoration-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},MU={name:"text-decoration-line",initialValue:"none",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).map(function(t){switch(t.value){case"underline":return 1;case"overline":return 2;case"line-through":return 3;case"none":return 4}return 0}).filter(function(t){return t!==0})}},bU={name:"font-family",initialValue:"",prefix:!1,type:1,parse:function(n,e){var t=[],A=[];return e.forEach(function(i){switch(i.type){case 20:case 0:t.push(i.value);break;case 17:t.push(i.number.toString());break;case 4:A.push(t.join(" ")),t.length=0;break}}),t.length&&A.push(t.join(" ")),A.map(function(i){return i.indexOf(" ")===-1?i:"'"+i+"'"})}},FU={name:"font-size",initialValue:"0",prefix:!1,type:3,format:"length"},TU={name:"font-weight",initialValue:"normal",type:0,prefix:!1,parse:function(n,e){if(Ir(e))return e.number;if(ft(e))switch(e.value){case"bold":return 700;case"normal":default:return 400}return 400}},IU={name:"font-variant",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.filter(ft).map(function(t){return t.value})}},QU={name:"font-style",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"oblique":return"oblique";case"italic":return"italic";case"normal":default:return"normal"}}},Dt=function(n,e){return(n&e)!==0},LU={name:"content",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e}},RU={name:"counter-increment",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;for(var A=[],i=e.filter(Bg),r=0;r<i.length;r++){var s=i[r],a=i[r+1];if(s.type===20){var o=a&&Ir(a)?a.number:1;A.push({counter:s.value,increment:o})}}return A}},DU={name:"counter-reset",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return[];for(var t=[],A=e.filter(Bg),i=0;i<A.length;i++){var r=A[i],s=A[i+1];if(ft(r)&&r.value!=="none"){var a=s&&Ir(s)?s.number:0;t.push({counter:r.value,reset:a})}}return t}},PU={name:"duration",initialValue:"0s",prefix:!1,type:1,parse:function(n,e){return e.filter(Ms).map(function(t){return Rg.parse(n,t)})}},HU={name:"quotes",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;var A=[],i=e.filter(cy);if(i.length%2!==0)return null;for(var r=0;r<i.length;r+=2){var s=i[r].value,a=i[r+1].value;A.push({open:s,close:a})}return A}},od=function(n,e,t){if(!n)return"";var A=n[Math.min(e,n.length-1)];return A?t?A.open:A.close:""},NU={name:"box-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&gu(e[0],"none")?[]:sn(e).map(function(t){for(var A={color:255,offsetX:jt,offsetY:jt,blur:jt,spread:jt,inset:!1},i=0,r=0;r<t.length;r++){var s=t[r];gu(s,"inset")?A.inset=!0:$n(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:i===2?A.blur=s:A.spread=s,i++):A.color=Wn.parse(n,s)}return A})}},OU={name:"paint-order",initialValue:"normal",prefix:!1,type:1,parse:function(n,e){var t=[0,1,2],A=[];return e.filter(ft).forEach(function(i){switch(i.value){case"stroke":A.push(1);break;case"fill":A.push(0);break;case"markers":A.push(2);break}}),t.forEach(function(i){A.indexOf(i)===-1&&A.push(i)}),A}},GU={name:"-webkit-text-stroke-color",initialValue:"currentcolor",prefix:!1,type:3,format:"color"},VU={name:"-webkit-text-stroke-width",initialValue:"0",type:0,prefix:!1,parse:function(n,e){return Ms(e)?e.number:0}},kU=(function(){function n(e,t){var A,i;this.animationDuration=pe(e,PU,t.animationDuration),this.backgroundClip=pe(e,hy,t.backgroundClip),this.backgroundColor=pe(e,dy,t.backgroundColor),this.backgroundImage=pe(e,Ey,t.backgroundImage),this.backgroundOrigin=pe(e,yy,t.backgroundOrigin),this.backgroundPosition=pe(e,Uy,t.backgroundPosition),this.backgroundRepeat=pe(e,Sy,t.backgroundRepeat),this.backgroundSize=pe(e,by,t.backgroundSize),this.borderTopColor=pe(e,Ty,t.borderTopColor),this.borderRightColor=pe(e,Iy,t.borderRightColor),this.borderBottomColor=pe(e,Qy,t.borderBottomColor),this.borderLeftColor=pe(e,Ly,t.borderLeftColor),this.borderTopLeftRadius=pe(e,Ry,t.borderTopLeftRadius),this.borderTopRightRadius=pe(e,Dy,t.borderTopRightRadius),this.borderBottomRightRadius=pe(e,Py,t.borderBottomRightRadius),this.borderBottomLeftRadius=pe(e,Hy,t.borderBottomLeftRadius),this.borderTopStyle=pe(e,Ny,t.borderTopStyle),this.borderRightStyle=pe(e,Oy,t.borderRightStyle),this.borderBottomStyle=pe(e,Gy,t.borderBottomStyle),this.borderLeftStyle=pe(e,Vy,t.borderLeftStyle),this.borderTopWidth=pe(e,ky,t.borderTopWidth),this.borderRightWidth=pe(e,zy,t.borderRightWidth),this.borderBottomWidth=pe(e,Ky,t.borderBottomWidth),this.borderLeftWidth=pe(e,Wy,t.borderLeftWidth),this.boxShadow=pe(e,NU,t.boxShadow),this.color=pe(e,Xy,t.color),this.direction=pe(e,Yy,t.direction),this.display=pe(e,Jy,t.display),this.float=pe(e,qy,t.cssFloat),this.fontFamily=pe(e,bU,t.fontFamily),this.fontSize=pe(e,FU,t.fontSize),this.fontStyle=pe(e,QU,t.fontStyle),this.fontVariant=pe(e,IU,t.fontVariant),this.fontWeight=pe(e,TU,t.fontWeight),this.letterSpacing=pe(e,jy,t.letterSpacing),this.lineBreak=pe(e,$y,t.lineBreak),this.lineHeight=pe(e,eU,t.lineHeight),this.listStyleImage=pe(e,tU,t.listStyleImage),this.listStylePosition=pe(e,AU,t.listStylePosition),this.listStyleType=pe(e,mu,t.listStyleType),this.marginTop=pe(e,nU,t.marginTop),this.marginRight=pe(e,iU,t.marginRight),this.marginBottom=pe(e,rU,t.marginBottom),this.marginLeft=pe(e,sU,t.marginLeft),this.opacity=pe(e,UU,t.opacity);var r=pe(e,aU,t.overflow);this.overflowX=r[0],this.overflowY=r[r.length>1?1:0],this.overflowWrap=pe(e,oU,t.overflowWrap),this.paddingTop=pe(e,lU,t.paddingTop),this.paddingRight=pe(e,cU,t.paddingRight),this.paddingBottom=pe(e,uU,t.paddingBottom),this.paddingLeft=pe(e,fU,t.paddingLeft),this.paintOrder=pe(e,OU,t.paintOrder),this.position=pe(e,dU,t.position),this.textAlign=pe(e,hU,t.textAlign),this.textDecorationColor=pe(e,SU,(A=t.textDecorationColor)!==null&&A!==void 0?A:t.color),this.textDecorationLine=pe(e,MU,(i=t.textDecorationLine)!==null&&i!==void 0?i:t.textDecoration),this.textShadow=pe(e,pU,t.textShadow),this.textTransform=pe(e,gU,t.textTransform),this.transform=pe(e,mU,t.transform),this.transformOrigin=pe(e,xU,t.transformOrigin),this.visibility=pe(e,_U,t.visibility),this.webkitTextStrokeColor=pe(e,GU,t.webkitTextStrokeColor),this.webkitTextStrokeWidth=pe(e,VU,t.webkitTextStrokeWidth),this.wordBreak=pe(e,EU,t.wordBreak),this.zIndex=pe(e,yU,t.zIndex)}return n.prototype.isVisible=function(){return this.display>0&&this.opacity>0&&this.visibility===0},n.prototype.isTransparent=function(){return Xn(this.backgroundColor)},n.prototype.isTransformed=function(){return this.transform!==null},n.prototype.isPositioned=function(){return this.position!==0},n.prototype.isPositionedWithZIndex=function(){return this.isPositioned()&&!this.zIndex.auto},n.prototype.isFloating=function(){return this.float!==0},n.prototype.isInlineLevel=function(){return Dt(this.display,4)||Dt(this.display,33554432)||Dt(this.display,268435456)||Dt(this.display,536870912)||Dt(this.display,67108864)||Dt(this.display,134217728)},n})(),zU=(function(){function n(e,t){this.content=pe(e,LU,t.content),this.quotes=pe(e,HU,t.quotes)}return n})(),ld=(function(){function n(e,t){this.counterIncrement=pe(e,RU,t.counterIncrement),this.counterReset=pe(e,DU,t.counterReset)}return n})(),pe=function(n,e,t){var A=new gg,i=t!==null&&typeof t<"u"?t.toString():e.initialValue;A.write(i);var r=new mg(A.read());switch(e.type){case 2:var s=r.parseComponentValue();return e.parse(n,ft(s)?s.value:e.initialValue);case 0:return e.parse(n,r.parseComponentValue());case 1:return e.parse(n,r.parseComponentValues());case 4:return r.parseComponentValue();case 3:switch(e.format){case"angle":return Ko.parse(n,r.parseComponentValue());case"color":return Wn.parse(n,r.parseComponentValue());case"image":return nf.parse(n,r.parseComponentValue());case"length":var a=r.parseComponentValue();return $n(a)?a:jt;case"length-percentage":var o=r.parseComponentValue();return Qt(o)?o:jt;case"time":return Rg.parse(n,r.parseComponentValue())}break}},KU="data-html2canvas-debug",WU=function(n){var e=n.getAttribute(KU);switch(e){case"all":return 1;case"clone":return 2;case"parse":return 3;case"render":return 4;default:return 0}},Bu=function(n,e){var t=WU(n);return t===1||e===t},an=(function(){function n(e,t){if(this.context=e,this.textNodes=[],this.elements=[],this.flags=0,Bu(t,3))debugger;this.styles=new kU(e,window.getComputedStyle(t,null)),Cu(t)&&(this.styles.animationDuration.some(function(A){return A>0})&&(t.style.animationDuration="0s"),this.styles.transform!==null&&(t.style.transform="none")),this.bounds=ko(this.context,t),Bu(t,4)&&(this.flags|=16)}return n})(),XU="AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=",cd="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ts=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var _a=0;_a<cd.length;_a++)ts[cd.charCodeAt(_a)]=_a;var YU=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=ts[n.charCodeAt(A)],s=ts[n.charCodeAt(A+1)],a=ts[n.charCodeAt(A+2)],o=ts[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},JU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},ZU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},vi=5,rf=11,zl=2,qU=rf-vi,Dg=65536>>vi,jU=1<<vi,Kl=jU-1,$U=1024>>vi,eS=Dg+$U,tS=eS,AS=32,nS=tS+AS,iS=65536>>rf,rS=1<<qU,sS=rS-1,ud=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},aS=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},oS=function(n,e){var t=YU(n),A=Array.isArray(t)?ZU(t):new Uint32Array(t),i=Array.isArray(t)?JU(t):new Uint16Array(t),r=24,s=ud(i,r/2,A[4]/2),a=A[5]===2?ud(i,(r+A[4])/2):aS(A,Math.ceil((r+A[4])/4));return new lS(A[0],A[1],A[2],A[3],s,a)},lS=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>vi],t=(t<<zl)+(e&Kl),this.data[t];if(e<=65535)return t=this.index[Dg+(e-55296>>vi)],t=(t<<zl)+(e&Kl),this.data[t];if(e<this.highStart)return t=nS-iS+(e>>rf),t=this.index[t],t+=e>>vi&sS,t=this.index[t],t=(t<<zl)+(e&Kl),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),fd="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",cS=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Ea=0;Ea<fd.length;Ea++)cS[fd.charCodeAt(Ea)]=Ea;var uS=1,Wl=2,Xl=3,hd=4,dd=5,fS=7,pd=8,Yl=9,Jl=10,gd=11,md=12,Bd=13,vd=14,Zl=15,hS=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},dS=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},pS=oS(XU),FA="×",ql="÷",gS=function(n){return pS.get(n)},mS=function(n,e,t){var A=t-2,i=e[A],r=e[t-1],s=e[t];if(r===Wl&&s===Xl)return FA;if(r===Wl||r===Xl||r===hd||s===Wl||s===Xl||s===hd)return ql;if(r===pd&&[pd,Yl,gd,md].indexOf(s)!==-1||(r===gd||r===Yl)&&(s===Yl||s===Jl)||(r===md||r===Jl)&&s===Jl||s===Bd||s===dd||s===fS||r===uS)return FA;if(r===Bd&&s===vd){for(;i===dd;)i=e[--A];if(i===vd)return FA}if(r===Zl&&s===Zl){for(var a=0;i===Zl;)a++,i=e[--A];if(a%2===0)return FA}return ql},BS=function(n){var e=hS(n),t=e.length,A=0,i=0,r=e.map(gS);return{next:function(){if(A>=t)return{done:!0,value:null};for(var s=FA;A<t&&(s=mS(e,r,++A))===FA;);if(s!==FA||A===t){var a=dS.apply(null,e.slice(i,A));return i=A,{value:a,done:!1}}return{done:!0,value:null}}}},vS=function(n){for(var e=BS(n),t=[],A;!(A=e.next()).done;)A.value&&t.push(A.value.slice());return t},wS=function(n){var e=123;if(n.createRange){var t=n.createRange();if(t.getBoundingClientRect){var A=n.createElement("boundtest");A.style.height=e+"px",A.style.display="block",n.body.appendChild(A),t.selectNode(A);var i=t.getBoundingClientRect(),r=Math.round(i.height);if(n.body.removeChild(A),r===e)return!0}}return!1},CS=function(n){var e=n.createElement("boundtest");e.style.width="50px",e.style.display="block",e.style.fontSize="12px",e.style.letterSpacing="0px",e.style.wordSpacing="0px",n.body.appendChild(e);var t=n.createRange();e.innerHTML=typeof"".repeat=="function"?"&#128104;".repeat(10):"";var A=e.firstChild,i=zo(A.data).map(function(o){return bt(o)}),r=0,s={},a=i.every(function(o,l){t.setStart(A,r),t.setEnd(A,r+o.length);var c=t.getBoundingClientRect();r+=o.length;var u=c.x>s.x||c.y>s.y;return s=c,l===0?!0:u});return n.body.removeChild(e),a},xS=function(){return typeof new Image().crossOrigin<"u"},_S=function(){return typeof new XMLHttpRequest().responseType=="string"},ES=function(n){var e=new Image,t=n.createElement("canvas"),A=t.getContext("2d");if(!A)return!1;e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{A.drawImage(e,0,0),t.toDataURL()}catch{return!1}return!0},wd=function(n){return n[0]===0&&n[1]===255&&n[2]===0&&n[3]===255},yS=function(n){var e=n.createElement("canvas"),t=100;e.width=t,e.height=t;var A=e.getContext("2d");if(!A)return Promise.reject(!1);A.fillStyle="rgb(0, 255, 0)",A.fillRect(0,0,t,t);var i=new Image,r=e.toDataURL();i.src=r;var s=vu(t,t,0,0,i);return A.fillStyle="red",A.fillRect(0,0,t,t),Cd(s).then(function(a){A.drawImage(a,0,0);var o=A.getImageData(0,0,t,t).data;A.fillStyle="red",A.fillRect(0,0,t,t);var l=n.createElement("div");return l.style.backgroundImage="url("+r+")",l.style.height=t+"px",wd(o)?Cd(vu(t,t,0,0,l)):Promise.reject(!1)}).then(function(a){return A.drawImage(a,0,0),wd(A.getImageData(0,0,t,t).data)}).catch(function(){return!1})},vu=function(n,e,t,A,i){var r="http://www.w3.org/2000/svg",s=document.createElementNS(r,"svg"),a=document.createElementNS(r,"foreignObject");return s.setAttributeNS(null,"width",n.toString()),s.setAttributeNS(null,"height",e.toString()),a.setAttributeNS(null,"width","100%"),a.setAttributeNS(null,"height","100%"),a.setAttributeNS(null,"x",t.toString()),a.setAttributeNS(null,"y",A.toString()),a.setAttributeNS(null,"externalResourcesRequired","true"),s.appendChild(a),a.appendChild(i),s},Cd=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){return e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},Xt={get SUPPORT_RANGE_BOUNDS(){var n=wS(document);return Object.defineProperty(Xt,"SUPPORT_RANGE_BOUNDS",{value:n}),n},get SUPPORT_WORD_BREAKING(){var n=Xt.SUPPORT_RANGE_BOUNDS&&CS(document);return Object.defineProperty(Xt,"SUPPORT_WORD_BREAKING",{value:n}),n},get SUPPORT_SVG_DRAWING(){var n=ES(document);return Object.defineProperty(Xt,"SUPPORT_SVG_DRAWING",{value:n}),n},get SUPPORT_FOREIGNOBJECT_DRAWING(){var n=typeof Array.from=="function"&&typeof window.fetch=="function"?yS(document):Promise.resolve(!1);return Object.defineProperty(Xt,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:n}),n},get SUPPORT_CORS_IMAGES(){var n=xS();return Object.defineProperty(Xt,"SUPPORT_CORS_IMAGES",{value:n}),n},get SUPPORT_RESPONSE_TYPE(){var n=_S();return Object.defineProperty(Xt,"SUPPORT_RESPONSE_TYPE",{value:n}),n},get SUPPORT_CORS_XHR(){var n="withCredentials"in new XMLHttpRequest;return Object.defineProperty(Xt,"SUPPORT_CORS_XHR",{value:n}),n},get SUPPORT_NATIVE_TEXT_SEGMENTATION(){var n=!!(typeof Intl<"u"&&Intl.Segmenter);return Object.defineProperty(Xt,"SUPPORT_NATIVE_TEXT_SEGMENTATION",{value:n}),n}},ls=(function(){function n(e,t){this.text=e,this.bounds=t}return n})(),US=function(n,e,t,A){var i=bS(e,t),r=[],s=0;return i.forEach(function(a){if(t.textDecorationLine.length||a.trim().length>0)if(Xt.SUPPORT_RANGE_BOUNDS){var o=xd(A,s,a.length).getClientRects();if(o.length>1){var l=sf(a),c=0;l.forEach(function(f){r.push(new ls(f,En.fromDOMRectList(n,xd(A,c+s,f.length).getClientRects()))),c+=f.length})}else r.push(new ls(a,En.fromDOMRectList(n,o)))}else{var u=A.splitText(a.length);r.push(new ls(a,SS(n,A))),A=u}else Xt.SUPPORT_RANGE_BOUNDS||(A=A.splitText(a.length));s+=a.length}),r},SS=function(n,e){var t=e.ownerDocument;if(t){var A=t.createElement("html2canvaswrapper");A.appendChild(e.cloneNode(!0));var i=e.parentNode;if(i){i.replaceChild(A,e);var r=ko(n,A);return A.firstChild&&i.replaceChild(A.firstChild,A),r}}return En.EMPTY},xd=function(n,e,t){var A=n.ownerDocument;if(!A)throw new Error("Node has no owner document");var i=A.createRange();return i.setStart(n,e),i.setEnd(n,e+t),i},sf=function(n){if(Xt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var e=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(e.segment(n)).map(function(t){return t.segment})}return vS(n)},MS=function(n,e){if(Xt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var t=new Intl.Segmenter(void 0,{granularity:"word"});return Array.from(t.segment(n)).map(function(A){return A.segment})}return TS(n,e)},bS=function(n,e){return e.letterSpacing!==0?sf(n):MS(n,e)},FS=[32,160,4961,65792,65793,4153,4241],TS=function(n,e){for(var t=iE(n,{lineBreak:e.lineBreak,wordBreak:e.overflowWrap==="break-word"?"break-word":e.wordBreak}),A=[],i,r=function(){if(i.value){var s=i.value.slice(),a=zo(s),o="";a.forEach(function(l){FS.indexOf(l)===-1?o+=bt(l):(o.length&&A.push(o),A.push(bt(l)),o="")}),o.length&&A.push(o)}};!(i=t.next()).done;)r();return A},IS=(function(){function n(e,t,A){this.text=QS(t.data,A.textTransform),this.textBounds=US(e,this.text,A,t)}return n})(),QS=function(n,e){switch(e){case 1:return n.toLowerCase();case 3:return n.replace(LS,RS);case 2:return n.toUpperCase();default:return n}},LS=/(^|\s|:|-|\(|\))([a-z])/g,RS=function(n,e,t){return n.length>0?e+t.toUpperCase():n},Pg=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.src=A.currentSrc||A.src,i.intrinsicWidth=A.naturalWidth,i.intrinsicHeight=A.naturalHeight,i.context.cache.addImage(i.src),i}return e})(an),Hg=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A,i.intrinsicWidth=A.width,i.intrinsicHeight=A.height,i}return e})(an),Ng=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=new XMLSerializer,s=ko(t,A);return A.setAttribute("width",s.width+"px"),A.setAttribute("height",s.height+"px"),i.svg="data:image/svg+xml,"+encodeURIComponent(r.serializeToString(A)),i.intrinsicWidth=A.width.baseVal.value,i.intrinsicHeight=A.height.baseVal.value,i.context.cache.addImage(i.svg),i}return e})(an),Og=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(an),wu=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.start=A.start,i.reversed=typeof A.reversed=="boolean"&&A.reversed===!0,i}return e})(an),DS=[{type:15,flags:0,unit:"px",number:3}],PS=[{type:16,flags:0,number:50}],HS=function(n){return n.width>n.height?new En(n.left+(n.width-n.height)/2,n.top,n.height,n.height):n.width<n.height?new En(n.left,n.top+(n.height-n.width)/2,n.width,n.width):n},NS=function(n){var e=n.type===OS?new Array(n.value.length+1).join("•"):n.value;return e.length===0?n.placeholder||"":e},ho="checkbox",po="radio",OS="password",_d=707406591,af=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;switch(i.type=A.type.toLowerCase(),i.checked=A.checked,i.value=NS(A),(i.type===ho||i.type===po)&&(i.styles.backgroundColor=3739148031,i.styles.borderTopColor=i.styles.borderRightColor=i.styles.borderBottomColor=i.styles.borderLeftColor=2779096575,i.styles.borderTopWidth=i.styles.borderRightWidth=i.styles.borderBottomWidth=i.styles.borderLeftWidth=1,i.styles.borderTopStyle=i.styles.borderRightStyle=i.styles.borderBottomStyle=i.styles.borderLeftStyle=1,i.styles.backgroundClip=[0],i.styles.backgroundOrigin=[0],i.bounds=HS(i.bounds)),i.type){case ho:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=DS;break;case po:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=PS;break}return i}return e})(an),Gg=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=A.options[A.selectedIndex||0];return i.value=r&&r.text||"",i}return e})(an),Vg=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(an),kg=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;i.src=A.src,i.width=parseInt(A.width,10)||0,i.height=parseInt(A.height,10)||0,i.backgroundColor=i.styles.backgroundColor;try{if(A.contentWindow&&A.contentWindow.document&&A.contentWindow.document.documentElement){i.tree=Kg(t,A.contentWindow.document.documentElement);var r=A.contentWindow.document.documentElement?as(t,getComputedStyle(A.contentWindow.document.documentElement).backgroundColor):_n.TRANSPARENT,s=A.contentWindow.document.body?as(t,getComputedStyle(A.contentWindow.document.body).backgroundColor):_n.TRANSPARENT;i.backgroundColor=Xn(r)?Xn(s)?i.styles.backgroundColor:s:r}}catch{}return i}return e})(an),GS=["OL","UL","MENU"],Ya=function(n,e,t,A){for(var i=e.firstChild,r=void 0;i;i=r)if(r=i.nextSibling,Wg(i)&&i.data.trim().length>0)t.textNodes.push(new IS(n,i,t.styles));else if(lr(i))if(Zg(i)&&i.assignedNodes)i.assignedNodes().forEach(function(a){return Ya(n,a,t,A)});else{var s=zg(n,i);s.styles.isVisible()&&(VS(i,s,A)?s.flags|=4:kS(s.styles)&&(s.flags|=2),GS.indexOf(i.tagName)!==-1&&(s.flags|=8),t.elements.push(s),i.slot,i.shadowRoot?Ya(n,i.shadowRoot,s,A):!go(i)&&!Xg(i)&&!mo(i)&&Ya(n,i,s,A))}},zg=function(n,e){return xu(e)?new Pg(n,e):Yg(e)?new Hg(n,e):Xg(e)?new Ng(n,e):zS(e)?new Og(n,e):KS(e)?new wu(n,e):WS(e)?new af(n,e):mo(e)?new Gg(n,e):go(e)?new Vg(n,e):Jg(e)?new kg(n,e):new an(n,e)},Kg=function(n,e){var t=zg(n,e);return t.flags|=4,Ya(n,e,t,t),t},VS=function(n,e,t){return e.styles.isPositionedWithZIndex()||e.styles.opacity<1||e.styles.isTransformed()||of(n)&&t.styles.isTransparent()},kS=function(n){return n.isPositioned()||n.isFloating()},Wg=function(n){return n.nodeType===Node.TEXT_NODE},lr=function(n){return n.nodeType===Node.ELEMENT_NODE},Cu=function(n){return lr(n)&&typeof n.style<"u"&&!Ja(n)},Ja=function(n){return typeof n.className=="object"},zS=function(n){return n.tagName==="LI"},KS=function(n){return n.tagName==="OL"},WS=function(n){return n.tagName==="INPUT"},XS=function(n){return n.tagName==="HTML"},Xg=function(n){return n.tagName==="svg"},of=function(n){return n.tagName==="BODY"},Yg=function(n){return n.tagName==="CANVAS"},Ed=function(n){return n.tagName==="VIDEO"},xu=function(n){return n.tagName==="IMG"},Jg=function(n){return n.tagName==="IFRAME"},yd=function(n){return n.tagName==="STYLE"},YS=function(n){return n.tagName==="SCRIPT"},go=function(n){return n.tagName==="TEXTAREA"},mo=function(n){return n.tagName==="SELECT"},Zg=function(n){return n.tagName==="SLOT"},Ud=function(n){return n.tagName.indexOf("-")>0},JS=(function(){function n(){this.counters={}}return n.prototype.getCounterValue=function(e){var t=this.counters[e];return t&&t.length?t[t.length-1]:1},n.prototype.getCounterValues=function(e){var t=this.counters[e];return t||[]},n.prototype.pop=function(e){var t=this;e.forEach(function(A){return t.counters[A].pop()})},n.prototype.parse=function(e){var t=this,A=e.counterIncrement,i=e.counterReset,r=!0;A!==null&&A.forEach(function(a){var o=t.counters[a.counter];o&&a.increment!==0&&(r=!1,o.length||o.push(1),o[Math.max(0,o.length-1)]+=a.increment)});var s=[];return r&&i.forEach(function(a){var o=t.counters[a.counter];s.push(a.counter),o||(o=t.counters[a.counter]=[]),o.push(a.reset)}),s},n})(),Sd={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},Md={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},ZS={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},qS={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},$i=function(n,e,t,A,i,r){return n<e||n>t?ms(n,i,r.length>0):A.integers.reduce(function(s,a,o){for(;n>=a;)n-=a,s+=A.values[o];return s},"")+r},qg=function(n,e,t,A){var i="";do t||n--,i=A(n)+i,n/=e;while(n*e>=e);return i},St=function(n,e,t,A,i){var r=t-e+1;return(n<0?"-":"")+(qg(Math.abs(n),r,A,function(s){return bt(Math.floor(s%r)+e)})+i)},oi=function(n,e,t){t===void 0&&(t=". ");var A=e.length;return qg(Math.abs(n),A,!1,function(i){return e[Math.floor(i%A)]})+t},rr=1,Ln=2,Rn=4,As=8,pn=function(n,e,t,A,i,r){if(n<-9999||n>9999)return ms(n,4,i.length>0);var s=Math.abs(n),a=i;if(s===0)return e[0]+a;for(var o=0;s>0&&o<=4;o++){var l=s%10;l===0&&Dt(r,rr)&&a!==""?a=e[l]+a:l>1||l===1&&o===0||l===1&&o===1&&Dt(r,Ln)||l===1&&o===1&&Dt(r,Rn)&&n>100||l===1&&o>1&&Dt(r,As)?a=e[l]+(o>0?t[o-1]:"")+a:l===1&&o>0&&(a=t[o-1]+a),s=Math.floor(s/10)}return(n<0?A:"")+a},bd="十百千萬",Fd="拾佰仟萬",Td="マイナス",jl="마이너스",ms=function(n,e,t){var A=t?". ":"",i=t?"、":"",r=t?", ":"",s=t?" ":"";switch(e){case 0:return"•"+s;case 1:return"◦"+s;case 2:return"◾"+s;case 5:var a=St(n,48,57,!0,A);return a.length<4?"0"+a:a;case 4:return oi(n,"〇一二三四五六七八九",i);case 6:return $i(n,1,3999,Sd,3,A).toLowerCase();case 7:return $i(n,1,3999,Sd,3,A);case 8:return St(n,945,969,!1,A);case 9:return St(n,97,122,!1,A);case 10:return St(n,65,90,!1,A);case 11:return St(n,1632,1641,!0,A);case 12:case 49:return $i(n,1,9999,Md,3,A);case 35:return $i(n,1,9999,Md,3,A).toLowerCase();case 13:return St(n,2534,2543,!0,A);case 14:case 30:return St(n,6112,6121,!0,A);case 15:return oi(n,"子丑寅卯辰巳午未申酉戌亥",i);case 16:return oi(n,"甲乙丙丁戊己庚辛壬癸",i);case 17:case 48:return pn(n,"零一二三四五六七八九",bd,"負",i,Ln|Rn|As);case 47:return pn(n,"零壹貳參肆伍陸柒捌玖",Fd,"負",i,rr|Ln|Rn|As);case 42:return pn(n,"零一二三四五六七八九",bd,"负",i,Ln|Rn|As);case 41:return pn(n,"零壹贰叁肆伍陆柒捌玖",Fd,"负",i,rr|Ln|Rn|As);case 26:return pn(n,"〇一二三四五六七八九","十百千万",Td,i,0);case 25:return pn(n,"零壱弐参四伍六七八九","拾百千万",Td,i,rr|Ln|Rn);case 31:return pn(n,"영일이삼사오육칠팔구","십백천만",jl,r,rr|Ln|Rn);case 33:return pn(n,"零一二三四五六七八九","十百千萬",jl,r,0);case 32:return pn(n,"零壹貳參四五六七八九","拾百千",jl,r,rr|Ln|Rn);case 18:return St(n,2406,2415,!0,A);case 20:return $i(n,1,19999,qS,3,A);case 21:return St(n,2790,2799,!0,A);case 22:return St(n,2662,2671,!0,A);case 22:return $i(n,1,10999,ZS,3,A);case 23:return oi(n,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case 24:return oi(n,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case 27:return St(n,3302,3311,!0,A);case 28:return oi(n,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",i);case 29:return oi(n,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",i);case 34:return St(n,3792,3801,!0,A);case 37:return St(n,6160,6169,!0,A);case 38:return St(n,4160,4169,!0,A);case 39:return St(n,2918,2927,!0,A);case 40:return St(n,1776,1785,!0,A);case 43:return St(n,3046,3055,!0,A);case 44:return St(n,3174,3183,!0,A);case 45:return St(n,3664,3673,!0,A);case 46:return St(n,3872,3881,!0,A);case 3:default:return St(n,48,57,!0,A)}},jg="data-html2canvas-ignore",Id=(function(){function n(e,t,A){if(this.context=e,this.options=A,this.scrolledElements=[],this.referenceElement=t,this.counters=new JS,this.quoteDepth=0,!t.ownerDocument)throw new Error("Cloned element does not have an owner document");this.documentElement=this.cloneNode(t.ownerDocument.documentElement,!1)}return n.prototype.toIFrame=function(e,t){var A=this,i=jS(e,t);if(!i.contentWindow)return Promise.reject("Unable to find iframe window");var r=e.defaultView.pageXOffset,s=e.defaultView.pageYOffset,a=i.contentWindow,o=a.document,l=tM(i).then(function(){return cA(A,void 0,void 0,function(){var c,u;return nA(this,function(f){switch(f.label){case 0:return this.scrolledElements.forEach(rM),a&&(a.scrollTo(t.left,t.top),/(iPad|iPhone|iPod)/g.test(navigator.userAgent)&&(a.scrollY!==t.top||a.scrollX!==t.left)&&(this.context.logger.warn("Unable to restore scroll position for cloned document"),this.context.windowBounds=this.context.windowBounds.add(a.scrollX-t.left,a.scrollY-t.top,0,0))),c=this.options.onclone,u=this.clonedReferenceElement,typeof u>"u"?[2,Promise.reject("Error finding the "+this.referenceElement.nodeName+" in the cloned document")]:o.fonts&&o.fonts.ready?[4,o.fonts.ready]:[3,2];case 1:f.sent(),f.label=2;case 2:return/(AppleWebKit)/g.test(navigator.userAgent)?[4,eM(o)]:[3,4];case 3:f.sent(),f.label=4;case 4:return typeof c=="function"?[2,Promise.resolve().then(function(){return c(o,u)}).then(function(){return i})]:[2,i]}})})});return o.open(),o.write(nM(document.doctype)+"<html></html>"),iM(this.referenceElement.ownerDocument,r,s),o.replaceChild(o.adoptNode(this.documentElement),o.documentElement),o.close(),l},n.prototype.createElementClone=function(e){if(Bu(e,2))debugger;if(Yg(e))return this.createCanvasClone(e);if(Ed(e))return this.createVideoClone(e);if(yd(e))return this.createStyleClone(e);var t=e.cloneNode(!1);return xu(t)&&(xu(e)&&e.currentSrc&&e.currentSrc!==e.src&&(t.src=e.currentSrc,t.srcset=""),t.loading==="lazy"&&(t.loading="eager")),Ud(t)?this.createCustomElementClone(t):t},n.prototype.createCustomElementClone=function(e){var t=document.createElement("html2canvascustomelement");return $l(e.style,t),t},n.prototype.createStyleClone=function(e){try{var t=e.sheet;if(t&&t.cssRules){var A=[].slice.call(t.cssRules,0).reduce(function(r,s){return s&&typeof s.cssText=="string"?r+s.cssText:r},""),i=e.cloneNode(!1);return i.textContent=A,i}}catch(r){if(this.context.logger.error("Unable to access cssRules property",r),r.name!=="SecurityError")throw r}return e.cloneNode(!1)},n.prototype.createCanvasClone=function(e){var t;if(this.options.inlineImages&&e.ownerDocument){var A=e.ownerDocument.createElement("img");try{return A.src=e.toDataURL(),A}catch{this.context.logger.info("Unable to inline canvas contents, canvas is tainted",e)}}var i=e.cloneNode(!1);try{i.width=e.width,i.height=e.height;var r=e.getContext("2d"),s=i.getContext("2d");if(s)if(!this.options.allowTaint&&r)s.putImageData(r.getImageData(0,0,e.width,e.height),0,0);else{var a=(t=e.getContext("webgl2"))!==null&&t!==void 0?t:e.getContext("webgl");if(a){var o=a.getContextAttributes();(o==null?void 0:o.preserveDrawingBuffer)===!1&&this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false",e)}s.drawImage(e,0,0)}return i}catch{this.context.logger.info("Unable to clone canvas as it is tainted",e)}return i},n.prototype.createVideoClone=function(e){var t=e.ownerDocument.createElement("canvas");t.width=e.offsetWidth,t.height=e.offsetHeight;var A=t.getContext("2d");try{return A&&(A.drawImage(e,0,0,t.width,t.height),this.options.allowTaint||A.getImageData(0,0,t.width,t.height)),t}catch{this.context.logger.info("Unable to clone video as it is tainted",e)}var i=e.ownerDocument.createElement("canvas");return i.width=e.offsetWidth,i.height=e.offsetHeight,i},n.prototype.appendChildNode=function(e,t,A){(!lr(t)||!YS(t)&&!t.hasAttribute(jg)&&(typeof this.options.ignoreElements!="function"||!this.options.ignoreElements(t)))&&(!this.options.copyStyles||!lr(t)||!yd(t))&&e.appendChild(this.cloneNode(t,A))},n.prototype.cloneChildNodes=function(e,t,A){for(var i=this,r=e.shadowRoot?e.shadowRoot.firstChild:e.firstChild;r;r=r.nextSibling)if(lr(r)&&Zg(r)&&typeof r.assignedNodes=="function"){var s=r.assignedNodes();s.length&&s.forEach(function(a){return i.appendChildNode(t,a,A)})}else this.appendChildNode(t,r,A)},n.prototype.cloneNode=function(e,t){if(Wg(e))return document.createTextNode(e.data);if(!e.ownerDocument)return e.cloneNode(!1);var A=e.ownerDocument.defaultView;if(A&&lr(e)&&(Cu(e)||Ja(e))){var i=this.createElementClone(e);i.style.transitionProperty="none";var r=A.getComputedStyle(e),s=A.getComputedStyle(e,":before"),a=A.getComputedStyle(e,":after");this.referenceElement===e&&Cu(i)&&(this.clonedReferenceElement=i),of(i)&&oM(i);var o=this.counters.parse(new ld(this.context,r)),l=this.resolvePseudoContent(e,i,s,cs.BEFORE);Ud(e)&&(t=!0),Ed(e)||this.cloneChildNodes(e,i,t),l&&i.insertBefore(l,i.firstChild);var c=this.resolvePseudoContent(e,i,a,cs.AFTER);return c&&i.appendChild(c),this.counters.pop(o),(r&&(this.options.copyStyles||Ja(e))&&!Jg(e)||t)&&$l(r,i),(e.scrollTop!==0||e.scrollLeft!==0)&&this.scrolledElements.push([i,e.scrollLeft,e.scrollTop]),(go(e)||mo(e))&&(go(i)||mo(i))&&(i.value=e.value),i}return e.cloneNode(!1)},n.prototype.resolvePseudoContent=function(e,t,A,i){var r=this;if(A){var s=A.content,a=t.ownerDocument;if(!(!a||!s||s==="none"||s==="-moz-alt-content"||A.display==="none")){this.counters.parse(new ld(this.context,A));var o=new zU(this.context,A),l=a.createElement("html2canvaspseudoelement");$l(A,l),o.content.forEach(function(u){if(u.type===0)l.appendChild(a.createTextNode(u.value));else if(u.type===22){var f=a.createElement("img");f.src=u.value,f.style.opacity="1",l.appendChild(f)}else if(u.type===18){if(u.name==="attr"){var p=u.values.filter(ft);p.length&&l.appendChild(a.createTextNode(e.getAttribute(p[0].value)||""))}else if(u.name==="counter"){var g=u.values.filter(Mr),m=g[0],d=g[1];if(m&&ft(m)){var h=r.counters.getCounterValue(m.value),v=d&&ft(d)?mu.parse(r.context,d.value):3;l.appendChild(a.createTextNode(ms(h,v,!1)))}}else if(u.name==="counters"){var w=u.values.filter(Mr),m=w[0],_=w[1],d=w[2];if(m&&ft(m)){var b=r.counters.getCounterValues(m.value),y=d&&ft(d)?mu.parse(r.context,d.value):3,S=_&&_.type===0?_.value:"",R=b.map(function(L){return ms(L,y,!1)}).join(S);l.appendChild(a.createTextNode(R))}}}else if(u.type===20)switch(u.value){case"open-quote":l.appendChild(a.createTextNode(od(o.quotes,r.quoteDepth++,!0)));break;case"close-quote":l.appendChild(a.createTextNode(od(o.quotes,--r.quoteDepth,!1)));break;default:l.appendChild(a.createTextNode(u.value))}}),l.className=_u+" "+Eu;var c=i===cs.BEFORE?" "+_u:" "+Eu;return Ja(t)?t.className.baseValue+=c:t.className+=c,l}}},n.destroy=function(e){return e.parentNode?(e.parentNode.removeChild(e),!0):!1},n})(),cs;(function(n){n[n.BEFORE=0]="BEFORE",n[n.AFTER=1]="AFTER"})(cs||(cs={}));var jS=function(n,e){var t=n.createElement("iframe");return t.className="html2canvas-container",t.style.visibility="hidden",t.style.position="fixed",t.style.left="-10000px",t.style.top="0px",t.style.border="0",t.width=e.width.toString(),t.height=e.height.toString(),t.scrolling="no",t.setAttribute(jg,"true"),n.body.appendChild(t),t},$S=function(n){return new Promise(function(e){if(n.complete){e();return}if(!n.src){e();return}n.onload=e,n.onerror=e})},eM=function(n){return Promise.all([].slice.call(n.images,0).map($S))},tM=function(n){return new Promise(function(e,t){var A=n.contentWindow;if(!A)return t("No window assigned for iframe");var i=A.document;A.onload=n.onload=function(){A.onload=n.onload=null;var r=setInterval(function(){i.body.childNodes.length>0&&i.readyState==="complete"&&(clearInterval(r),e(n))},50)}})},AM=["all","d","content"],$l=function(n,e){for(var t=n.length-1;t>=0;t--){var A=n.item(t);AM.indexOf(A)===-1&&e.style.setProperty(A,n.getPropertyValue(A))}return e},nM=function(n){var e="";return n&&(e+="<!DOCTYPE ",n.name&&(e+=n.name),n.internalSubset&&(e+=n.internalSubset),n.publicId&&(e+='"'+n.publicId+'"'),n.systemId&&(e+='"'+n.systemId+'"'),e+=">"),e},iM=function(n,e,t){n&&n.defaultView&&(e!==n.defaultView.pageXOffset||t!==n.defaultView.pageYOffset)&&n.defaultView.scrollTo(e,t)},rM=function(n){var e=n[0],t=n[1],A=n[2];e.scrollLeft=t,e.scrollTop=A},sM=":before",aM=":after",_u="___html2canvas___pseudoelement_before",Eu="___html2canvas___pseudoelement_after",Qd=`{
    content: "" !important;
    display: none !important;
}`,oM=function(n){lM(n,"."+_u+sM+Qd+`
         .`+Eu+aM+Qd)},lM=function(n,e){var t=n.ownerDocument;if(t){var A=t.createElement("style");A.textContent=e,n.appendChild(A)}},$g=(function(){function n(){}return n.getOrigin=function(e){var t=n._link;return t?(t.href=e,t.href=t.href,t.protocol+t.hostname+t.port):"about:blank"},n.isSameOrigin=function(e){return n.getOrigin(e)===n._origin},n.setContext=function(e){n._link=e.document.createElement("a"),n._origin=n.getOrigin(e.location.href)},n._origin="about:blank",n})(),cM=(function(){function n(e,t){this.context=e,this._options=t,this._cache={}}return n.prototype.addImage=function(e){var t=Promise.resolve();return this.has(e)||(tc(e)||dM(e))&&(this._cache[e]=this.loadImage(e)).catch(function(){}),t},n.prototype.match=function(e){return this._cache[e]},n.prototype.loadImage=function(e){return cA(this,void 0,void 0,function(){var t,A,i,r,s=this;return nA(this,function(a){switch(a.label){case 0:return t=$g.isSameOrigin(e),A=!ec(e)&&this._options.useCORS===!0&&Xt.SUPPORT_CORS_IMAGES&&!t,i=!ec(e)&&!t&&!tc(e)&&typeof this._options.proxy=="string"&&Xt.SUPPORT_CORS_XHR&&!A,!t&&this._options.allowTaint===!1&&!ec(e)&&!tc(e)&&!i&&!A?[2]:(r=e,i?[4,this.proxy(r)]:[3,2]);case 1:r=a.sent(),a.label=2;case 2:return this.context.logger.debug("Added image "+e.substring(0,256)),[4,new Promise(function(o,l){var c=new Image;c.onload=function(){return o(c)},c.onerror=l,(pM(r)||A)&&(c.crossOrigin="anonymous"),c.src=r,c.complete===!0&&setTimeout(function(){return o(c)},500),s._options.imageTimeout>0&&setTimeout(function(){return l("Timed out ("+s._options.imageTimeout+"ms) loading image")},s._options.imageTimeout)})];case 3:return[2,a.sent()]}})})},n.prototype.has=function(e){return typeof this._cache[e]<"u"},n.prototype.keys=function(){return Promise.resolve(Object.keys(this._cache))},n.prototype.proxy=function(e){var t=this,A=this._options.proxy;if(!A)throw new Error("No proxy defined");var i=e.substring(0,256);return new Promise(function(r,s){var a=Xt.SUPPORT_RESPONSE_TYPE?"blob":"text",o=new XMLHttpRequest;o.onload=function(){if(o.status===200)if(a==="text")r(o.response);else{var u=new FileReader;u.addEventListener("load",function(){return r(u.result)},!1),u.addEventListener("error",function(f){return s(f)},!1),u.readAsDataURL(o.response)}else s("Failed to proxy resource "+i+" with status code "+o.status)},o.onerror=s;var l=A.indexOf("?")>-1?"&":"?";if(o.open("GET",""+A+l+"url="+encodeURIComponent(e)+"&responseType="+a),a!=="text"&&o instanceof XMLHttpRequest&&(o.responseType=a),t._options.imageTimeout){var c=t._options.imageTimeout;o.timeout=c,o.ontimeout=function(){return s("Timed out ("+c+"ms) proxying "+i)}}o.send()})},n})(),uM=/^data:image\/svg\+xml/i,fM=/^data:image\/.*;base64,/i,hM=/^data:image\/.*/i,dM=function(n){return Xt.SUPPORT_SVG_DRAWING||!gM(n)},ec=function(n){return hM.test(n)},pM=function(n){return fM.test(n)},tc=function(n){return n.substr(0,4)==="blob"},gM=function(n){return n.substr(-3).toLowerCase()==="svg"||uM.test(n)},fe=(function(){function n(e,t){this.type=0,this.x=e,this.y=t}return n.prototype.add=function(e,t){return new n(this.x+e,this.y+t)},n})(),er=function(n,e,t){return new fe(n.x+(e.x-n.x)*t,n.y+(e.y-n.y)*t)},ya=(function(){function n(e,t,A,i){this.type=1,this.start=e,this.startControl=t,this.endControl=A,this.end=i}return n.prototype.subdivide=function(e,t){var A=er(this.start,this.startControl,e),i=er(this.startControl,this.endControl,e),r=er(this.endControl,this.end,e),s=er(A,i,e),a=er(i,r,e),o=er(s,a,e);return t?new n(this.start,A,s,o):new n(o,a,r,this.end)},n.prototype.add=function(e,t){return new n(this.start.add(e,t),this.startControl.add(e,t),this.endControl.add(e,t),this.end.add(e,t))},n.prototype.reverse=function(){return new n(this.end,this.endControl,this.startControl,this.start)},n})(),TA=function(n){return n.type===1},mM=(function(){function n(e){var t=e.styles,A=e.bounds,i=es(t.borderTopLeftRadius,A.width,A.height),r=i[0],s=i[1],a=es(t.borderTopRightRadius,A.width,A.height),o=a[0],l=a[1],c=es(t.borderBottomRightRadius,A.width,A.height),u=c[0],f=c[1],p=es(t.borderBottomLeftRadius,A.width,A.height),g=p[0],m=p[1],d=[];d.push((r+o)/A.width),d.push((g+u)/A.width),d.push((s+m)/A.height),d.push((l+f)/A.height);var h=Math.max.apply(Math,d);h>1&&(r/=h,s/=h,o/=h,l/=h,u/=h,f/=h,g/=h,m/=h);var v=A.width-o,w=A.height-f,_=A.width-u,b=A.height-m,y=t.borderTopWidth,S=t.borderRightWidth,R=t.borderBottomWidth,E=t.borderLeftWidth,C=pt(t.paddingTop,e.bounds.width),L=pt(t.paddingRight,e.bounds.width),W=pt(t.paddingBottom,e.bounds.width),P=pt(t.paddingLeft,e.bounds.width);this.topLeftBorderDoubleOuterBox=r>0||s>0?Ct(A.left+E/3,A.top+y/3,r-E/3,s-y/3,at.TOP_LEFT):new fe(A.left+E/3,A.top+y/3),this.topRightBorderDoubleOuterBox=r>0||s>0?Ct(A.left+v,A.top+y/3,o-S/3,l-y/3,at.TOP_RIGHT):new fe(A.left+A.width-S/3,A.top+y/3),this.bottomRightBorderDoubleOuterBox=u>0||f>0?Ct(A.left+_,A.top+w,u-S/3,f-R/3,at.BOTTOM_RIGHT):new fe(A.left+A.width-S/3,A.top+A.height-R/3),this.bottomLeftBorderDoubleOuterBox=g>0||m>0?Ct(A.left+E/3,A.top+b,g-E/3,m-R/3,at.BOTTOM_LEFT):new fe(A.left+E/3,A.top+A.height-R/3),this.topLeftBorderDoubleInnerBox=r>0||s>0?Ct(A.left+E*2/3,A.top+y*2/3,r-E*2/3,s-y*2/3,at.TOP_LEFT):new fe(A.left+E*2/3,A.top+y*2/3),this.topRightBorderDoubleInnerBox=r>0||s>0?Ct(A.left+v,A.top+y*2/3,o-S*2/3,l-y*2/3,at.TOP_RIGHT):new fe(A.left+A.width-S*2/3,A.top+y*2/3),this.bottomRightBorderDoubleInnerBox=u>0||f>0?Ct(A.left+_,A.top+w,u-S*2/3,f-R*2/3,at.BOTTOM_RIGHT):new fe(A.left+A.width-S*2/3,A.top+A.height-R*2/3),this.bottomLeftBorderDoubleInnerBox=g>0||m>0?Ct(A.left+E*2/3,A.top+b,g-E*2/3,m-R*2/3,at.BOTTOM_LEFT):new fe(A.left+E*2/3,A.top+A.height-R*2/3),this.topLeftBorderStroke=r>0||s>0?Ct(A.left+E/2,A.top+y/2,r-E/2,s-y/2,at.TOP_LEFT):new fe(A.left+E/2,A.top+y/2),this.topRightBorderStroke=r>0||s>0?Ct(A.left+v,A.top+y/2,o-S/2,l-y/2,at.TOP_RIGHT):new fe(A.left+A.width-S/2,A.top+y/2),this.bottomRightBorderStroke=u>0||f>0?Ct(A.left+_,A.top+w,u-S/2,f-R/2,at.BOTTOM_RIGHT):new fe(A.left+A.width-S/2,A.top+A.height-R/2),this.bottomLeftBorderStroke=g>0||m>0?Ct(A.left+E/2,A.top+b,g-E/2,m-R/2,at.BOTTOM_LEFT):new fe(A.left+E/2,A.top+A.height-R/2),this.topLeftBorderBox=r>0||s>0?Ct(A.left,A.top,r,s,at.TOP_LEFT):new fe(A.left,A.top),this.topRightBorderBox=o>0||l>0?Ct(A.left+v,A.top,o,l,at.TOP_RIGHT):new fe(A.left+A.width,A.top),this.bottomRightBorderBox=u>0||f>0?Ct(A.left+_,A.top+w,u,f,at.BOTTOM_RIGHT):new fe(A.left+A.width,A.top+A.height),this.bottomLeftBorderBox=g>0||m>0?Ct(A.left,A.top+b,g,m,at.BOTTOM_LEFT):new fe(A.left,A.top+A.height),this.topLeftPaddingBox=r>0||s>0?Ct(A.left+E,A.top+y,Math.max(0,r-E),Math.max(0,s-y),at.TOP_LEFT):new fe(A.left+E,A.top+y),this.topRightPaddingBox=o>0||l>0?Ct(A.left+Math.min(v,A.width-S),A.top+y,v>A.width+S?0:Math.max(0,o-S),Math.max(0,l-y),at.TOP_RIGHT):new fe(A.left+A.width-S,A.top+y),this.bottomRightPaddingBox=u>0||f>0?Ct(A.left+Math.min(_,A.width-E),A.top+Math.min(w,A.height-R),Math.max(0,u-S),Math.max(0,f-R),at.BOTTOM_RIGHT):new fe(A.left+A.width-S,A.top+A.height-R),this.bottomLeftPaddingBox=g>0||m>0?Ct(A.left+E,A.top+Math.min(b,A.height-R),Math.max(0,g-E),Math.max(0,m-R),at.BOTTOM_LEFT):new fe(A.left+E,A.top+A.height-R),this.topLeftContentBox=r>0||s>0?Ct(A.left+E+P,A.top+y+C,Math.max(0,r-(E+P)),Math.max(0,s-(y+C)),at.TOP_LEFT):new fe(A.left+E+P,A.top+y+C),this.topRightContentBox=o>0||l>0?Ct(A.left+Math.min(v,A.width+E+P),A.top+y+C,v>A.width+E+P?0:o-E+P,l-(y+C),at.TOP_RIGHT):new fe(A.left+A.width-(S+L),A.top+y+C),this.bottomRightContentBox=u>0||f>0?Ct(A.left+Math.min(_,A.width-(E+P)),A.top+Math.min(w,A.height+y+C),Math.max(0,u-(S+L)),f-(R+W),at.BOTTOM_RIGHT):new fe(A.left+A.width-(S+L),A.top+A.height-(R+W)),this.bottomLeftContentBox=g>0||m>0?Ct(A.left+E+P,A.top+b,Math.max(0,g-(E+P)),m-(R+W),at.BOTTOM_LEFT):new fe(A.left+E+P,A.top+A.height-(R+W))}return n})(),at;(function(n){n[n.TOP_LEFT=0]="TOP_LEFT",n[n.TOP_RIGHT=1]="TOP_RIGHT",n[n.BOTTOM_RIGHT=2]="BOTTOM_RIGHT",n[n.BOTTOM_LEFT=3]="BOTTOM_LEFT"})(at||(at={}));var Ct=function(n,e,t,A,i){var r=4*((Math.sqrt(2)-1)/3),s=t*r,a=A*r,o=n+t,l=e+A;switch(i){case at.TOP_LEFT:return new ya(new fe(n,l),new fe(n,l-a),new fe(o-s,e),new fe(o,e));case at.TOP_RIGHT:return new ya(new fe(n,e),new fe(n+s,e),new fe(o,l-a),new fe(o,l));case at.BOTTOM_RIGHT:return new ya(new fe(o,e),new fe(o,e+a),new fe(n+s,l),new fe(n,l));case at.BOTTOM_LEFT:default:return new ya(new fe(o,l),new fe(o-s,l),new fe(n,e+a),new fe(n,e))}},Bo=function(n){return[n.topLeftBorderBox,n.topRightBorderBox,n.bottomRightBorderBox,n.bottomLeftBorderBox]},BM=function(n){return[n.topLeftContentBox,n.topRightContentBox,n.bottomRightContentBox,n.bottomLeftContentBox]},vo=function(n){return[n.topLeftPaddingBox,n.topRightPaddingBox,n.bottomRightPaddingBox,n.bottomLeftPaddingBox]},vM=(function(){function n(e,t,A){this.offsetX=e,this.offsetY=t,this.matrix=A,this.type=0,this.target=6}return n})(),Ua=(function(){function n(e,t){this.path=e,this.target=t,this.type=1}return n})(),wM=(function(){function n(e){this.opacity=e,this.type=2,this.target=6}return n})(),CM=function(n){return n.type===0},em=function(n){return n.type===1},xM=function(n){return n.type===2},Ld=function(n,e){return n.length===e.length?n.some(function(t,A){return t===e[A]}):!1},_M=function(n,e,t,A,i){return n.map(function(r,s){switch(s){case 0:return r.add(e,t);case 1:return r.add(e+A,t);case 2:return r.add(e+A,t+i);case 3:return r.add(e,t+i)}return r})},tm=(function(){function n(e){this.element=e,this.inlineLevel=[],this.nonInlineLevel=[],this.negativeZIndex=[],this.zeroOrAutoZIndexOrTransformedOrOpacity=[],this.positiveZIndex=[],this.nonPositionedFloats=[],this.nonPositionedInlineLevel=[]}return n})(),Am=(function(){function n(e,t){if(this.container=e,this.parent=t,this.effects=[],this.curves=new mM(this.container),this.container.styles.opacity<1&&this.effects.push(new wM(this.container.styles.opacity)),this.container.styles.transform!==null){var A=this.container.bounds.left+this.container.styles.transformOrigin[0].number,i=this.container.bounds.top+this.container.styles.transformOrigin[1].number,r=this.container.styles.transform;this.effects.push(new vM(A,i,r))}if(this.container.styles.overflowX!==0){var s=Bo(this.curves),a=vo(this.curves);Ld(s,a)?this.effects.push(new Ua(s,6)):(this.effects.push(new Ua(s,2)),this.effects.push(new Ua(a,4)))}}return n.prototype.getEffects=function(e){for(var t=[2,3].indexOf(this.container.styles.position)===-1,A=this.parent,i=this.effects.slice(0);A;){var r=A.effects.filter(function(o){return!em(o)});if(t||A.container.styles.position!==0||!A.parent){if(i.unshift.apply(i,r),t=[2,3].indexOf(A.container.styles.position)===-1,A.container.styles.overflowX!==0){var s=Bo(A.curves),a=vo(A.curves);Ld(s,a)||i.unshift(new Ua(a,6))}}else i.unshift.apply(i,r);A=A.parent}return i.filter(function(o){return Dt(o.target,e)})},n})(),yu=function(n,e,t,A){n.container.elements.forEach(function(i){var r=Dt(i.flags,4),s=Dt(i.flags,2),a=new Am(i,n);Dt(i.styles.display,2048)&&A.push(a);var o=Dt(i.flags,8)?[]:A;if(r||s){var l=r||i.styles.isPositioned()?t:e,c=new tm(a);if(i.styles.isPositioned()||i.styles.opacity<1||i.styles.isTransformed()){var u=i.styles.zIndex.order;if(u<0){var f=0;l.negativeZIndex.some(function(g,m){return u>g.element.container.styles.zIndex.order?(f=m,!1):f>0}),l.negativeZIndex.splice(f,0,c)}else if(u>0){var p=0;l.positiveZIndex.some(function(g,m){return u>=g.element.container.styles.zIndex.order?(p=m+1,!1):p>0}),l.positiveZIndex.splice(p,0,c)}else l.zeroOrAutoZIndexOrTransformedOrOpacity.push(c)}else i.styles.isFloating()?l.nonPositionedFloats.push(c):l.nonPositionedInlineLevel.push(c);yu(a,c,r?c:t,o)}else i.styles.isInlineLevel()?e.inlineLevel.push(a):e.nonInlineLevel.push(a),yu(a,e,t,o);Dt(i.flags,8)&&nm(i,o)})},nm=function(n,e){for(var t=n instanceof wu?n.start:1,A=n instanceof wu?n.reversed:!1,i=0;i<e.length;i++){var r=e[i];r.container instanceof Og&&typeof r.container.value=="number"&&r.container.value!==0&&(t=r.container.value),r.listValue=ms(t,r.container.styles.listStyleType,!0),t+=A?-1:1}},EM=function(n){var e=new Am(n,null),t=new tm(e),A=[];return yu(e,t,t,A),nm(e.container,A),t},Rd=function(n,e){switch(e){case 0:return PA(n.topLeftBorderBox,n.topLeftPaddingBox,n.topRightBorderBox,n.topRightPaddingBox);case 1:return PA(n.topRightBorderBox,n.topRightPaddingBox,n.bottomRightBorderBox,n.bottomRightPaddingBox);case 2:return PA(n.bottomRightBorderBox,n.bottomRightPaddingBox,n.bottomLeftBorderBox,n.bottomLeftPaddingBox);case 3:default:return PA(n.bottomLeftBorderBox,n.bottomLeftPaddingBox,n.topLeftBorderBox,n.topLeftPaddingBox)}},yM=function(n,e){switch(e){case 0:return PA(n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox,n.topRightBorderBox,n.topRightBorderDoubleOuterBox);case 1:return PA(n.topRightBorderBox,n.topRightBorderDoubleOuterBox,n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox);case 2:return PA(n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox,n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox);case 3:default:return PA(n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox,n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox)}},UM=function(n,e){switch(e){case 0:return PA(n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox,n.topRightBorderDoubleInnerBox,n.topRightPaddingBox);case 1:return PA(n.topRightBorderDoubleInnerBox,n.topRightPaddingBox,n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox);case 2:return PA(n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox,n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox);case 3:default:return PA(n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox,n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox)}},SM=function(n,e){switch(e){case 0:return Sa(n.topLeftBorderStroke,n.topRightBorderStroke);case 1:return Sa(n.topRightBorderStroke,n.bottomRightBorderStroke);case 2:return Sa(n.bottomRightBorderStroke,n.bottomLeftBorderStroke);case 3:default:return Sa(n.bottomLeftBorderStroke,n.topLeftBorderStroke)}},Sa=function(n,e){var t=[];return TA(n)?t.push(n.subdivide(.5,!1)):t.push(n),TA(e)?t.push(e.subdivide(.5,!0)):t.push(e),t},PA=function(n,e,t,A){var i=[];return TA(n)?i.push(n.subdivide(.5,!1)):i.push(n),TA(t)?i.push(t.subdivide(.5,!0)):i.push(t),TA(A)?i.push(A.subdivide(.5,!0).reverse()):i.push(A),TA(e)?i.push(e.subdivide(.5,!1).reverse()):i.push(e),i},im=function(n){var e=n.bounds,t=n.styles;return e.add(t.borderLeftWidth,t.borderTopWidth,-(t.borderRightWidth+t.borderLeftWidth),-(t.borderTopWidth+t.borderBottomWidth))},wo=function(n){var e=n.styles,t=n.bounds,A=pt(e.paddingLeft,t.width),i=pt(e.paddingRight,t.width),r=pt(e.paddingTop,t.width),s=pt(e.paddingBottom,t.width);return t.add(A+e.borderLeftWidth,r+e.borderTopWidth,-(e.borderRightWidth+e.borderLeftWidth+A+i),-(e.borderTopWidth+e.borderBottomWidth+r+s))},MM=function(n,e){return n===0?e.bounds:n===2?wo(e):im(e)},bM=function(n,e){return n===0?e.bounds:n===2?wo(e):im(e)},Ac=function(n,e,t){var A=MM(sr(n.styles.backgroundOrigin,e),n),i=bM(sr(n.styles.backgroundClip,e),n),r=FM(sr(n.styles.backgroundSize,e),t,A),s=r[0],a=r[1],o=es(sr(n.styles.backgroundPosition,e),A.width-s,A.height-a),l=TM(sr(n.styles.backgroundRepeat,e),o,r,A,i),c=Math.round(A.left+o[0]),u=Math.round(A.top+o[1]);return[l,c,u,s,a]},tr=function(n){return ft(n)&&n.value===pr.AUTO},Ma=function(n){return typeof n=="number"},FM=function(n,e,t){var A=e[0],i=e[1],r=e[2],s=n[0],a=n[1];if(!s)return[0,0];if(Qt(s)&&a&&Qt(a))return[pt(s,t.width),pt(a,t.height)];var o=Ma(r);if(ft(s)&&(s.value===pr.CONTAIN||s.value===pr.COVER)){if(Ma(r)){var l=t.width/t.height;return l<r!=(s.value===pr.COVER)?[t.width,t.width/r]:[t.height*r,t.height]}return[t.width,t.height]}var c=Ma(A),u=Ma(i),f=c||u;if(tr(s)&&(!a||tr(a))){if(c&&u)return[A,i];if(!o&&!f)return[t.width,t.height];if(f&&o){var p=c?A:i*r,g=u?i:A/r;return[p,g]}var m=c?A:t.width,d=u?i:t.height;return[m,d]}if(o){var h=0,v=0;return Qt(s)?h=pt(s,t.width):Qt(a)&&(v=pt(a,t.height)),tr(s)?h=v*r:(!a||tr(a))&&(v=h/r),[h,v]}var w=null,_=null;if(Qt(s)?w=pt(s,t.width):a&&Qt(a)&&(_=pt(a,t.height)),w!==null&&(!a||tr(a))&&(_=c&&u?w/A*i:t.height),_!==null&&tr(s)&&(w=c&&u?_/i*A:t.width),w!==null&&_!==null)return[w,_];throw new Error("Unable to calculate background-size for element")},sr=function(n,e){var t=n[e];return typeof t>"u"?n[0]:t},TM=function(n,e,t,A,i){var r=e[0],s=e[1],a=t[0],o=t[1];switch(n){case 2:return[new fe(Math.round(A.left),Math.round(A.top+s)),new fe(Math.round(A.left+A.width),Math.round(A.top+s)),new fe(Math.round(A.left+A.width),Math.round(o+A.top+s)),new fe(Math.round(A.left),Math.round(o+A.top+s))];case 3:return[new fe(Math.round(A.left+r),Math.round(A.top)),new fe(Math.round(A.left+r+a),Math.round(A.top)),new fe(Math.round(A.left+r+a),Math.round(A.height+A.top)),new fe(Math.round(A.left+r),Math.round(A.height+A.top))];case 1:return[new fe(Math.round(A.left+r),Math.round(A.top+s)),new fe(Math.round(A.left+r+a),Math.round(A.top+s)),new fe(Math.round(A.left+r+a),Math.round(A.top+s+o)),new fe(Math.round(A.left+r),Math.round(A.top+s+o))];default:return[new fe(Math.round(i.left),Math.round(i.top)),new fe(Math.round(i.left+i.width),Math.round(i.top)),new fe(Math.round(i.left+i.width),Math.round(i.height+i.top)),new fe(Math.round(i.left),Math.round(i.height+i.top))]}},IM="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",Dd="Hidden Text",QM=(function(){function n(e){this._data={},this._document=e}return n.prototype.parseMetrics=function(e,t){var A=this._document.createElement("div"),i=this._document.createElement("img"),r=this._document.createElement("span"),s=this._document.body;A.style.visibility="hidden",A.style.fontFamily=e,A.style.fontSize=t,A.style.margin="0",A.style.padding="0",A.style.whiteSpace="nowrap",s.appendChild(A),i.src=IM,i.width=1,i.height=1,i.style.margin="0",i.style.padding="0",i.style.verticalAlign="baseline",r.style.fontFamily=e,r.style.fontSize=t,r.style.margin="0",r.style.padding="0",r.appendChild(this._document.createTextNode(Dd)),A.appendChild(r),A.appendChild(i);var a=i.offsetTop-r.offsetTop+2;A.removeChild(r),A.appendChild(this._document.createTextNode(Dd)),A.style.lineHeight="normal",i.style.verticalAlign="super";var o=i.offsetTop-A.offsetTop+2;return s.removeChild(A),{baseline:a,middle:o}},n.prototype.getMetrics=function(e,t){var A=e+" "+t;return typeof this._data[A]>"u"&&(this._data[A]=this.parseMetrics(e,t)),this._data[A]},n})(),rm=(function(){function n(e,t){this.context=e,this.options=t}return n})(),LM=1e4,RM=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i._activeEffects=[],i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),A.canvas||(i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px"),i.fontMetrics=new QM(document),i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.ctx.textBaseline="bottom",i._activeEffects=[],i.context.logger.debug("Canvas renderer initialized ("+A.width+"x"+A.height+") with scale "+A.scale),i}return e.prototype.applyEffects=function(t){for(var A=this;this._activeEffects.length;)this.popEffect();t.forEach(function(i){return A.applyEffect(i)})},e.prototype.applyEffect=function(t){this.ctx.save(),xM(t)&&(this.ctx.globalAlpha=t.opacity),CM(t)&&(this.ctx.translate(t.offsetX,t.offsetY),this.ctx.transform(t.matrix[0],t.matrix[1],t.matrix[2],t.matrix[3],t.matrix[4],t.matrix[5]),this.ctx.translate(-t.offsetX,-t.offsetY)),em(t)&&(this.path(t.path),this.ctx.clip()),this._activeEffects.push(t)},e.prototype.popEffect=function(){this._activeEffects.pop(),this.ctx.restore()},e.prototype.renderStack=function(t){return cA(this,void 0,void 0,function(){var A;return nA(this,function(i){switch(i.label){case 0:return A=t.element.container.styles,A.isVisible()?[4,this.renderStackContent(t)]:[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}})})},e.prototype.renderNode=function(t){return cA(this,void 0,void 0,function(){return nA(this,function(A){switch(A.label){case 0:if(Dt(t.container.flags,16))debugger;return t.container.styles.isVisible()?[4,this.renderNodeBackgroundAndBorders(t)]:[3,3];case 1:return A.sent(),[4,this.renderNodeContent(t)];case 2:A.sent(),A.label=3;case 3:return[2]}})})},e.prototype.renderTextWithLetterSpacing=function(t,A,i){var r=this;if(A===0)this.ctx.fillText(t.text,t.bounds.left,t.bounds.top+i);else{var s=sf(t.text);s.reduce(function(a,o){return r.ctx.fillText(o,a,t.bounds.top+i),a+r.ctx.measureText(o).width},t.bounds.left)}},e.prototype.createFontStyle=function(t){var A=t.fontVariant.filter(function(s){return s==="normal"||s==="small-caps"}).join(""),i=OM(t.fontFamily).join(", "),r=Ms(t.fontSize)?""+t.fontSize.number+t.fontSize.unit:t.fontSize.number+"px";return[[t.fontStyle,A,t.fontWeight,r,i].join(" "),i,r]},e.prototype.renderTextNode=function(t,A){return cA(this,void 0,void 0,function(){var i,r,s,a,o,l,c,u,f=this;return nA(this,function(p){return i=this.createFontStyle(A),r=i[0],s=i[1],a=i[2],this.ctx.font=r,this.ctx.direction=A.direction===1?"rtl":"ltr",this.ctx.textAlign="left",this.ctx.textBaseline="alphabetic",o=this.fontMetrics.getMetrics(s,a),l=o.baseline,c=o.middle,u=A.paintOrder,t.textBounds.forEach(function(g){u.forEach(function(m){switch(m){case 0:f.ctx.fillStyle=Ot(A.color),f.renderTextWithLetterSpacing(g,A.letterSpacing,l);var d=A.textShadow;d.length&&g.text.trim().length&&(d.slice(0).reverse().forEach(function(h){f.ctx.shadowColor=Ot(h.color),f.ctx.shadowOffsetX=h.offsetX.number*f.options.scale,f.ctx.shadowOffsetY=h.offsetY.number*f.options.scale,f.ctx.shadowBlur=h.blur.number,f.renderTextWithLetterSpacing(g,A.letterSpacing,l)}),f.ctx.shadowColor="",f.ctx.shadowOffsetX=0,f.ctx.shadowOffsetY=0,f.ctx.shadowBlur=0),A.textDecorationLine.length&&(f.ctx.fillStyle=Ot(A.textDecorationColor||A.color),A.textDecorationLine.forEach(function(h){switch(h){case 1:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top+l),g.bounds.width,1);break;case 2:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top),g.bounds.width,1);break;case 3:f.ctx.fillRect(g.bounds.left,Math.ceil(g.bounds.top+c),g.bounds.width,1);break}}));break;case 1:A.webkitTextStrokeWidth&&g.text.trim().length&&(f.ctx.strokeStyle=Ot(A.webkitTextStrokeColor),f.ctx.lineWidth=A.webkitTextStrokeWidth,f.ctx.lineJoin=window.chrome?"miter":"round",f.ctx.strokeText(g.text,g.bounds.left,g.bounds.top+l)),f.ctx.strokeStyle="",f.ctx.lineWidth=0,f.ctx.lineJoin="miter";break}})}),[2]})})},e.prototype.renderReplacedElement=function(t,A,i){if(i&&t.intrinsicWidth>0&&t.intrinsicHeight>0){var r=wo(t),s=vo(A);this.path(s),this.ctx.save(),this.ctx.clip(),this.ctx.drawImage(i,0,0,t.intrinsicWidth,t.intrinsicHeight,r.left,r.top,r.width,r.height),this.ctx.restore()}},e.prototype.renderNodeContent=function(t){return cA(this,void 0,void 0,function(){var A,i,r,s,a,o,v,v,l,c,u,f,_,p,g,b,m,d,h,v,w,_,b;return nA(this,function(y){switch(y.label){case 0:this.applyEffects(t.getEffects(4)),A=t.container,i=t.curves,r=A.styles,s=0,a=A.textNodes,y.label=1;case 1:return s<a.length?(o=a[s],[4,this.renderTextNode(o,r)]):[3,4];case 2:y.sent(),y.label=3;case 3:return s++,[3,1];case 4:if(!(A instanceof Pg))return[3,8];y.label=5;case 5:return y.trys.push([5,7,,8]),[4,this.context.cache.match(A.src)];case 6:return v=y.sent(),this.renderReplacedElement(A,i,v),[3,8];case 7:return y.sent(),this.context.logger.error("Error loading image "+A.src),[3,8];case 8:if(A instanceof Hg&&this.renderReplacedElement(A,i,A.canvas),!(A instanceof Ng))return[3,12];y.label=9;case 9:return y.trys.push([9,11,,12]),[4,this.context.cache.match(A.svg)];case 10:return v=y.sent(),this.renderReplacedElement(A,i,v),[3,12];case 11:return y.sent(),this.context.logger.error("Error loading svg "+A.svg.substring(0,255)),[3,12];case 12:return A instanceof kg&&A.tree?(l=new e(this.context,{scale:this.options.scale,backgroundColor:A.backgroundColor,x:0,y:0,width:A.width,height:A.height}),[4,l.render(A.tree)]):[3,14];case 13:c=y.sent(),A.width&&A.height&&this.ctx.drawImage(c,0,0,A.width,A.height,A.bounds.left,A.bounds.top,A.bounds.width,A.bounds.height),y.label=14;case 14:if(A instanceof af&&(u=Math.min(A.bounds.width,A.bounds.height),A.type===ho?A.checked&&(this.ctx.save(),this.path([new fe(A.bounds.left+u*.39363,A.bounds.top+u*.79),new fe(A.bounds.left+u*.16,A.bounds.top+u*.5549),new fe(A.bounds.left+u*.27347,A.bounds.top+u*.44071),new fe(A.bounds.left+u*.39694,A.bounds.top+u*.5649),new fe(A.bounds.left+u*.72983,A.bounds.top+u*.23),new fe(A.bounds.left+u*.84,A.bounds.top+u*.34085),new fe(A.bounds.left+u*.39363,A.bounds.top+u*.79)]),this.ctx.fillStyle=Ot(_d),this.ctx.fill(),this.ctx.restore()):A.type===po&&A.checked&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(A.bounds.left+u/2,A.bounds.top+u/2,u/4,0,Math.PI*2,!0),this.ctx.fillStyle=Ot(_d),this.ctx.fill(),this.ctx.restore())),DM(A)&&A.value.length){switch(f=this.createFontStyle(r),_=f[0],p=f[1],g=this.fontMetrics.getMetrics(_,p).baseline,this.ctx.font=_,this.ctx.fillStyle=Ot(r.color),this.ctx.textBaseline="alphabetic",this.ctx.textAlign=HM(A.styles.textAlign),b=wo(A),m=0,A.styles.textAlign){case 1:m+=b.width/2;break;case 2:m+=b.width;break}d=b.add(m,0,0,-b.height/2+1),this.ctx.save(),this.path([new fe(b.left,b.top),new fe(b.left+b.width,b.top),new fe(b.left+b.width,b.top+b.height),new fe(b.left,b.top+b.height)]),this.ctx.clip(),this.renderTextWithLetterSpacing(new ls(A.value,d),r.letterSpacing,g),this.ctx.restore(),this.ctx.textBaseline="alphabetic",this.ctx.textAlign="left"}if(!Dt(A.styles.display,2048))return[3,20];if(A.styles.listStyleImage===null)return[3,19];if(h=A.styles.listStyleImage,h.type!==0)return[3,18];v=void 0,w=h.url,y.label=15;case 15:return y.trys.push([15,17,,18]),[4,this.context.cache.match(w)];case 16:return v=y.sent(),this.ctx.drawImage(v,A.bounds.left-(v.width+10),A.bounds.top),[3,18];case 17:return y.sent(),this.context.logger.error("Error loading list-style-image "+w),[3,18];case 18:return[3,20];case 19:t.listValue&&A.styles.listStyleType!==-1&&(_=this.createFontStyle(r)[0],this.ctx.font=_,this.ctx.fillStyle=Ot(r.color),this.ctx.textBaseline="middle",this.ctx.textAlign="right",b=new En(A.bounds.left,A.bounds.top+pt(A.styles.paddingTop,A.bounds.width),A.bounds.width,sd(r.lineHeight,r.fontSize.number)/2+1),this.renderTextWithLetterSpacing(new ls(t.listValue,b),r.letterSpacing,sd(r.lineHeight,r.fontSize.number)/2+2),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"),y.label=20;case 20:return[2]}})})},e.prototype.renderStackContent=function(t){return cA(this,void 0,void 0,function(){var A,i,h,r,s,h,a,o,h,l,c,h,u,f,h,p,g,h,m,d,h;return nA(this,function(v){switch(v.label){case 0:if(Dt(t.element.container.flags,16))debugger;return[4,this.renderNodeBackgroundAndBorders(t.element)];case 1:v.sent(),A=0,i=t.negativeZIndex,v.label=2;case 2:return A<i.length?(h=i[A],[4,this.renderStack(h)]):[3,5];case 3:v.sent(),v.label=4;case 4:return A++,[3,2];case 5:return[4,this.renderNodeContent(t.element)];case 6:v.sent(),r=0,s=t.nonInlineLevel,v.label=7;case 7:return r<s.length?(h=s[r],[4,this.renderNode(h)]):[3,10];case 8:v.sent(),v.label=9;case 9:return r++,[3,7];case 10:a=0,o=t.nonPositionedFloats,v.label=11;case 11:return a<o.length?(h=o[a],[4,this.renderStack(h)]):[3,14];case 12:v.sent(),v.label=13;case 13:return a++,[3,11];case 14:l=0,c=t.nonPositionedInlineLevel,v.label=15;case 15:return l<c.length?(h=c[l],[4,this.renderStack(h)]):[3,18];case 16:v.sent(),v.label=17;case 17:return l++,[3,15];case 18:u=0,f=t.inlineLevel,v.label=19;case 19:return u<f.length?(h=f[u],[4,this.renderNode(h)]):[3,22];case 20:v.sent(),v.label=21;case 21:return u++,[3,19];case 22:p=0,g=t.zeroOrAutoZIndexOrTransformedOrOpacity,v.label=23;case 23:return p<g.length?(h=g[p],[4,this.renderStack(h)]):[3,26];case 24:v.sent(),v.label=25;case 25:return p++,[3,23];case 26:m=0,d=t.positiveZIndex,v.label=27;case 27:return m<d.length?(h=d[m],[4,this.renderStack(h)]):[3,30];case 28:v.sent(),v.label=29;case 29:return m++,[3,27];case 30:return[2]}})})},e.prototype.mask=function(t){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.canvas.width,0),this.ctx.lineTo(this.canvas.width,this.canvas.height),this.ctx.lineTo(0,this.canvas.height),this.ctx.lineTo(0,0),this.formatPath(t.slice(0).reverse()),this.ctx.closePath()},e.prototype.path=function(t){this.ctx.beginPath(),this.formatPath(t),this.ctx.closePath()},e.prototype.formatPath=function(t){var A=this;t.forEach(function(i,r){var s=TA(i)?i.start:i;r===0?A.ctx.moveTo(s.x,s.y):A.ctx.lineTo(s.x,s.y),TA(i)&&A.ctx.bezierCurveTo(i.startControl.x,i.startControl.y,i.endControl.x,i.endControl.y,i.end.x,i.end.y)})},e.prototype.renderRepeat=function(t,A,i,r){this.path(t),this.ctx.fillStyle=A,this.ctx.translate(i,r),this.ctx.fill(),this.ctx.translate(-i,-r)},e.prototype.resizeImage=function(t,A,i){var r;if(t.width===A&&t.height===i)return t;var s=(r=this.canvas.ownerDocument)!==null&&r!==void 0?r:document,a=s.createElement("canvas");a.width=Math.max(1,A),a.height=Math.max(1,i);var o=a.getContext("2d");return o.drawImage(t,0,0,t.width,t.height,0,0,A,i),a},e.prototype.renderBackgroundImage=function(t){return cA(this,void 0,void 0,function(){var A,i,r,s,a,o;return nA(this,function(l){switch(l.label){case 0:A=t.styles.backgroundImage.length-1,i=function(c){var u,f,p,C,V,q,P,K,R,g,C,V,q,P,K,m,d,h,v,w,_,b,y,S,R,E,C,L,W,P,K,Z,V,q,X,re,ae,he,Ie,Oe,J,$;return nA(this,function(ue){switch(ue.label){case 0:if(c.type!==0)return[3,5];u=void 0,f=c.url,ue.label=1;case 1:return ue.trys.push([1,3,,4]),[4,r.context.cache.match(f)];case 2:return u=ue.sent(),[3,4];case 3:return ue.sent(),r.context.logger.error("Error loading background-image "+f),[3,4];case 4:return u&&(p=Ac(t,A,[u.width,u.height,u.width/u.height]),C=p[0],V=p[1],q=p[2],P=p[3],K=p[4],R=r.ctx.createPattern(r.resizeImage(u,P,K),"repeat"),r.renderRepeat(C,R,V,q)),[3,6];case 5:Cy(c)?(g=Ac(t,A,[null,null,null]),C=g[0],V=g[1],q=g[2],P=g[3],K=g[4],m=gy(c.angle,P,K),d=m[0],h=m[1],v=m[2],w=m[3],_=m[4],b=document.createElement("canvas"),b.width=P,b.height=K,y=b.getContext("2d"),S=y.createLinearGradient(h,w,v,_),id(c.stops,d).forEach(function(ce){return S.addColorStop(ce.stop,Ot(ce.color))}),y.fillStyle=S,y.fillRect(0,0,P,K),P>0&&K>0&&(R=r.ctx.createPattern(b,"repeat"),r.renderRepeat(C,R,V,q))):xy(c)&&(E=Ac(t,A,[null,null,null]),C=E[0],L=E[1],W=E[2],P=E[3],K=E[4],Z=c.position.length===0?[Af]:c.position,V=pt(Z[0],P),q=pt(Z[Z.length-1],K),X=my(c,V,q,P,K),re=X[0],ae=X[1],re>0&&ae>0&&(he=r.ctx.createRadialGradient(L+V,W+q,0,L+V,W+q,re),id(c.stops,re*2).forEach(function(ce){return he.addColorStop(ce.stop,Ot(ce.color))}),r.path(C),r.ctx.fillStyle=he,re!==ae?(Ie=t.bounds.left+.5*t.bounds.width,Oe=t.bounds.top+.5*t.bounds.height,J=ae/re,$=1/J,r.ctx.save(),r.ctx.translate(Ie,Oe),r.ctx.transform(1,0,0,J,0,0),r.ctx.translate(-Ie,-Oe),r.ctx.fillRect(L,$*(W-Oe)+Oe,P,K*$),r.ctx.restore()):r.ctx.fill())),ue.label=6;case 6:return A--,[2]}})},r=this,s=0,a=t.styles.backgroundImage.slice(0).reverse(),l.label=1;case 1:return s<a.length?(o=a[s],[5,i(o)]):[3,4];case 2:l.sent(),l.label=3;case 3:return s++,[3,1];case 4:return[2]}})})},e.prototype.renderSolidBorder=function(t,A,i){return cA(this,void 0,void 0,function(){return nA(this,function(r){return this.path(Rd(i,A)),this.ctx.fillStyle=Ot(t),this.ctx.fill(),[2]})})},e.prototype.renderDoubleBorder=function(t,A,i,r){return cA(this,void 0,void 0,function(){var s,a;return nA(this,function(o){switch(o.label){case 0:return A<3?[4,this.renderSolidBorder(t,i,r)]:[3,2];case 1:return o.sent(),[2];case 2:return s=yM(r,i),this.path(s),this.ctx.fillStyle=Ot(t),this.ctx.fill(),a=UM(r,i),this.path(a),this.ctx.fill(),[2]}})})},e.prototype.renderNodeBackgroundAndBorders=function(t){return cA(this,void 0,void 0,function(){var A,i,r,s,a,o,l,c,u=this;return nA(this,function(f){switch(f.label){case 0:return this.applyEffects(t.getEffects(2)),A=t.container.styles,i=!Xn(A.backgroundColor)||A.backgroundImage.length,r=[{style:A.borderTopStyle,color:A.borderTopColor,width:A.borderTopWidth},{style:A.borderRightStyle,color:A.borderRightColor,width:A.borderRightWidth},{style:A.borderBottomStyle,color:A.borderBottomColor,width:A.borderBottomWidth},{style:A.borderLeftStyle,color:A.borderLeftColor,width:A.borderLeftWidth}],s=PM(sr(A.backgroundClip,0),t.curves),i||A.boxShadow.length?(this.ctx.save(),this.path(s),this.ctx.clip(),Xn(A.backgroundColor)||(this.ctx.fillStyle=Ot(A.backgroundColor),this.ctx.fill()),[4,this.renderBackgroundImage(t.container)]):[3,2];case 1:f.sent(),this.ctx.restore(),A.boxShadow.slice(0).reverse().forEach(function(p){u.ctx.save();var g=Bo(t.curves),m=p.inset?0:LM,d=_M(g,-m+(p.inset?1:-1)*p.spread.number,(p.inset?1:-1)*p.spread.number,p.spread.number*(p.inset?-2:2),p.spread.number*(p.inset?-2:2));p.inset?(u.path(g),u.ctx.clip(),u.mask(d)):(u.mask(g),u.ctx.clip(),u.path(d)),u.ctx.shadowOffsetX=p.offsetX.number+m,u.ctx.shadowOffsetY=p.offsetY.number,u.ctx.shadowColor=Ot(p.color),u.ctx.shadowBlur=p.blur.number,u.ctx.fillStyle=p.inset?Ot(p.color):"rgba(0,0,0,1)",u.ctx.fill(),u.ctx.restore()}),f.label=2;case 2:a=0,o=0,l=r,f.label=3;case 3:return o<l.length?(c=l[o],c.style!==0&&!Xn(c.color)&&c.width>0?c.style!==2?[3,5]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,2)]:[3,11]):[3,13];case 4:return f.sent(),[3,11];case 5:return c.style!==3?[3,7]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,3)];case 6:return f.sent(),[3,11];case 7:return c.style!==4?[3,9]:[4,this.renderDoubleBorder(c.color,c.width,a,t.curves)];case 8:return f.sent(),[3,11];case 9:return[4,this.renderSolidBorder(c.color,a,t.curves)];case 10:f.sent(),f.label=11;case 11:a++,f.label=12;case 12:return o++,[3,3];case 13:return[2]}})})},e.prototype.renderDashedDottedBorder=function(t,A,i,r,s){return cA(this,void 0,void 0,function(){var a,o,l,c,u,f,p,g,m,d,h,v,w,_,b,y,b,y;return nA(this,function(S){return this.ctx.save(),a=SM(r,i),o=Rd(r,i),s===2&&(this.path(o),this.ctx.clip()),TA(o[0])?(l=o[0].start.x,c=o[0].start.y):(l=o[0].x,c=o[0].y),TA(o[1])?(u=o[1].end.x,f=o[1].end.y):(u=o[1].x,f=o[1].y),i===0||i===2?p=Math.abs(l-u):p=Math.abs(c-f),this.ctx.beginPath(),s===3?this.formatPath(a):this.formatPath(o.slice(0,2)),g=A<3?A*3:A*2,m=A<3?A*2:A,s===3&&(g=A,m=A),d=!0,p<=g*2?d=!1:p<=g*2+m?(h=p/(2*g+m),g*=h,m*=h):(v=Math.floor((p+m)/(g+m)),w=(p-v*g)/(v-1),_=(p-(v+1)*g)/v,m=_<=0||Math.abs(m-w)<Math.abs(m-_)?w:_),d&&(s===3?this.ctx.setLineDash([0,g+m]):this.ctx.setLineDash([g,m])),s===3?(this.ctx.lineCap="round",this.ctx.lineWidth=A):this.ctx.lineWidth=A*2+1.1,this.ctx.strokeStyle=Ot(t),this.ctx.stroke(),this.ctx.setLineDash([]),s===2&&(TA(o[0])&&(b=o[3],y=o[0],this.ctx.beginPath(),this.formatPath([new fe(b.end.x,b.end.y),new fe(y.start.x,y.start.y)]),this.ctx.stroke()),TA(o[1])&&(b=o[1],y=o[2],this.ctx.beginPath(),this.formatPath([new fe(b.end.x,b.end.y),new fe(y.start.x,y.start.y)]),this.ctx.stroke())),this.ctx.restore(),[2]})})},e.prototype.render=function(t){return cA(this,void 0,void 0,function(){var A;return nA(this,function(i){switch(i.label){case 0:return this.options.backgroundColor&&(this.ctx.fillStyle=Ot(this.options.backgroundColor),this.ctx.fillRect(this.options.x,this.options.y,this.options.width,this.options.height)),A=EM(t),[4,this.renderStack(A)];case 1:return i.sent(),this.applyEffects([]),[2,this.canvas]}})})},e})(rm),DM=function(n){return n instanceof Vg||n instanceof Gg?!0:n instanceof af&&n.type!==po&&n.type!==ho},PM=function(n,e){switch(n){case 0:return Bo(e);case 2:return BM(e);case 1:default:return vo(e)}},HM=function(n){switch(n){case 1:return"center";case 2:return"right";case 0:default:return"left"}},NM=["-apple-system","system-ui"],OM=function(n){return/iPhone OS 15_(0|1)/.test(window.navigator.userAgent)?n.filter(function(e){return NM.indexOf(e)===-1}):n},GM=(function(n){JA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),i.options=A,i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px",i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized ("+A.width+"x"+A.height+" at "+A.x+","+A.y+") with scale "+A.scale),i}return e.prototype.render=function(t){return cA(this,void 0,void 0,function(){var A,i;return nA(this,function(r){switch(r.label){case 0:return A=vu(this.options.width*this.options.scale,this.options.height*this.options.scale,this.options.scale,this.options.scale,t),[4,VM(A)];case 1:return i=r.sent(),this.options.backgroundColor&&(this.ctx.fillStyle=Ot(this.options.backgroundColor),this.ctx.fillRect(0,0,this.options.width*this.options.scale,this.options.height*this.options.scale)),this.ctx.drawImage(i,-this.options.x*this.options.scale,-this.options.y*this.options.scale),[2,this.canvas]}})})},e})(rm),VM=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},kM=(function(){function n(e){var t=e.id,A=e.enabled;this.id=t,this.enabled=A,this.start=Date.now()}return n.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.debug=="function"?console.debug.apply(console,sa([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.getTime=function(){return Date.now()-this.start},n.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&typeof window<"u"&&window.console&&typeof console.info=="function"&&console.info.apply(console,sa([this.id,this.getTime()+"ms"],e))},n.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.warn=="function"?console.warn.apply(console,sa([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.error=="function"?console.error.apply(console,sa([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.instances={},n})(),zM=(function(){function n(e,t){var A;this.windowBounds=t,this.instanceName="#"+n.instanceCount++,this.logger=new kM({id:this.instanceName,enabled:e.logging}),this.cache=(A=e.cache)!==null&&A!==void 0?A:new cM(this,e)}return n.instanceCount=1,n})(),KM=function(n,e){return e===void 0&&(e={}),WM(n,e)};typeof window<"u"&&$g.setContext(window);var WM=function(n,e){return cA(void 0,void 0,void 0,function(){var t,A,i,r,s,a,o,l,c,u,f,p,g,m,d,h,v,w,_,b,S,y,S,R,E,C,L,W,P,K,Z,V,q,X,re,ae,he,Ie,Oe,J;return nA(this,function($){switch($.label){case 0:if(!n||typeof n!="object")return[2,Promise.reject("Invalid element provided as first argument")];if(t=n.ownerDocument,!t)throw new Error("Element is not attached to a Document");if(A=t.defaultView,!A)throw new Error("Document is not attached to a Window");return i={allowTaint:(R=e.allowTaint)!==null&&R!==void 0?R:!1,imageTimeout:(E=e.imageTimeout)!==null&&E!==void 0?E:15e3,proxy:e.proxy,useCORS:(C=e.useCORS)!==null&&C!==void 0?C:!1},r=iu({logging:(L=e.logging)!==null&&L!==void 0?L:!0,cache:e.cache},i),s={windowWidth:(W=e.windowWidth)!==null&&W!==void 0?W:A.innerWidth,windowHeight:(P=e.windowHeight)!==null&&P!==void 0?P:A.innerHeight,scrollX:(K=e.scrollX)!==null&&K!==void 0?K:A.pageXOffset,scrollY:(Z=e.scrollY)!==null&&Z!==void 0?Z:A.pageYOffset},a=new En(s.scrollX,s.scrollY,s.windowWidth,s.windowHeight),o=new zM(r,a),l=(V=e.foreignObjectRendering)!==null&&V!==void 0?V:!1,c={allowTaint:(q=e.allowTaint)!==null&&q!==void 0?q:!1,onclone:e.onclone,ignoreElements:e.ignoreElements,inlineImages:l,copyStyles:l},o.logger.debug("Starting document clone with size "+a.width+"x"+a.height+" scrolled to "+-a.left+","+-a.top),u=new Id(o,n,c),f=u.clonedReferenceElement,f?[4,u.toIFrame(t,a)]:[2,Promise.reject("Unable to find element in cloned iframe")];case 1:return p=$.sent(),g=of(f)||XS(f)?__(f.ownerDocument):ko(o,f),m=g.width,d=g.height,h=g.left,v=g.top,w=XM(o,f,e.backgroundColor),_={canvas:e.canvas,backgroundColor:w,scale:(re=(X=e.scale)!==null&&X!==void 0?X:A.devicePixelRatio)!==null&&re!==void 0?re:1,x:((ae=e.x)!==null&&ae!==void 0?ae:0)+h,y:((he=e.y)!==null&&he!==void 0?he:0)+v,width:(Ie=e.width)!==null&&Ie!==void 0?Ie:Math.ceil(m),height:(Oe=e.height)!==null&&Oe!==void 0?Oe:Math.ceil(d)},l?(o.logger.debug("Document cloned, using foreign object rendering"),S=new GM(o,_),[4,S.render(f)]):[3,3];case 2:return b=$.sent(),[3,5];case 3:return o.logger.debug("Document cloned, element located at "+h+","+v+" with size "+m+"x"+d+" using computed rendering"),o.logger.debug("Starting DOM parsing"),y=Kg(o,f),w===y.styles.backgroundColor&&(y.styles.backgroundColor=_n.TRANSPARENT),o.logger.debug("Starting renderer for element at "+_.x+","+_.y+" with size "+_.width+"x"+_.height),S=new RM(o,_),[4,S.render(y)];case 4:b=$.sent(),$.label=5;case 5:return(!((J=e.removeContainer)!==null&&J!==void 0)||J)&&(Id.destroy(p)||o.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")),o.logger.debug("Finished rendering"),[2,b]}})})},XM=function(n,e,t){var A=e.ownerDocument,i=A.documentElement?as(n,getComputedStyle(A.documentElement).backgroundColor):_n.TRANSPARENT,r=A.body?as(n,getComputedStyle(A.body).backgroundColor):_n.TRANSPARENT,s=typeof t=="string"?as(n,t):t===null?_n.TRANSPARENT:4294967295;return e===A.documentElement?Xn(i)?Xn(r)?s:r:i:s};function YM(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function lf(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return n;if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return new Uint8Array(n.buffer,n.byteOffset,n.byteLength);throw new Error("Unknown type, must be binary type")}function JM(n){return new TextEncoder().encode(n)}function ZM(n){return new TextDecoder().decode(n)}function qM(n,e){if(n.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),A=0;A<t.length;A++)t[A]=255;for(var i=0;i<n.length;i++){var r=n.charAt(i),s=r.charCodeAt(0);if(t[s]!==255)throw new TypeError(r+" is ambiguous");t[s]=i}var a=n.length,o=n.charAt(0),l=Math.log(a)/Math.log(256),c=Math.log(256)/Math.log(a);function u(g){if(g instanceof Uint8Array||(ArrayBuffer.isView(g)?g=new Uint8Array(g.buffer,g.byteOffset,g.byteLength):Array.isArray(g)&&(g=Uint8Array.from(g))),!(g instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(g.length===0)return"";for(var m=0,d=0,h=0,v=g.length;h!==v&&g[h]===0;)h++,m++;for(var w=(v-h)*c+1>>>0,_=new Uint8Array(w);h!==v;){for(var b=g[h],y=0,S=w-1;(b!==0||y<d)&&S!==-1;S--,y++)b+=256*_[S]>>>0,_[S]=b%a>>>0,b=b/a>>>0;if(b!==0)throw new Error("Non-zero carry");d=y,h++}for(var R=w-d;R!==w&&_[R]===0;)R++;for(var E=o.repeat(m);R<w;++R)E+=n.charAt(_[R]);return E}function f(g){if(typeof g!="string")throw new TypeError("Expected String");if(g.length===0)return new Uint8Array;var m=0;if(g[m]!==" "){for(var d=0,h=0;g[m]===o;)d++,m++;for(var v=(g.length-m)*l+1>>>0,w=new Uint8Array(v);g[m];){var _=t[g.charCodeAt(m)];if(_===255)return;for(var b=0,y=v-1;(_!==0||b<h)&&y!==-1;y--,b++)_+=a*w[y]>>>0,w[y]=_%256>>>0,_=_/256>>>0;if(_!==0)throw new Error("Non-zero carry");h=b,m++}if(g[m]!==" "){for(var S=v-h;S!==v&&w[S]===0;)S++;for(var R=new Uint8Array(d+(v-S)),E=d;S!==v;)R[E++]=w[S++];return R}}}function p(g){var m=f(g);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:u,decodeUnsafe:f,decode:p}}var jM=qM,$M=jM;class eb{constructor(e,t,A){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=A}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class tb{constructor(e,t,A){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseDecode");Ee(this,"prefixCodePoint");this.name=e,this.prefix=t;const i=t.codePointAt(0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=A}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return sm(this,e)}}class Ab{constructor(e){Ee(this,"decoders");this.decoders=e}or(e){return sm(this,e)}decode(e){const t=e[0],A=this.decoders[t];if(A!=null)return A.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function sm(n,e){return new Ab({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class nb{constructor(e,t,A,i){Ee(this,"name");Ee(this,"prefix");Ee(this,"baseEncode");Ee(this,"baseDecode");Ee(this,"encoder");Ee(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=A,this.baseDecode=i,this.encoder=new eb(e,t,A),this.decoder=new tb(e,t,i)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function $o({name:n,prefix:e,encode:t,decode:A}){return new nb(n,e,t,A)}function bs({name:n,prefix:e,alphabet:t}){const{encode:A,decode:i}=$M(t,n);return $o({prefix:e,name:n,encode:A,decode:r=>lf(i(r))})}function ib(n,e,t,A){let i=n.length;for(;n[i-1]==="=";)--i;const r=new Uint8Array(i*t/8|0);let s=0,a=0,o=0;for(let l=0;l<i;++l){const c=e[n[l]];if(c===void 0)throw new SyntaxError(`Non-${A} character`);a=a<<t|c,s+=t,s>=8&&(s-=8,r[o++]=255&a>>s)}if(s>=t||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return r}function rb(n,e,t){const A=e[e.length-1]==="=",i=(1<<t)-1;let r="",s=0,a=0;for(let o=0;o<n.length;++o)for(a=a<<8|n[o],s+=8;s>t;)s-=t,r+=e[i&a>>s];if(s!==0&&(r+=e[i&a<<t-s]),A)for(;(r.length*t&7)!==0;)r+="=";return r}function sb(n){const e={};for(let t=0;t<n.length;++t)e[n[t]]=t;return e}function eA({name:n,prefix:e,bitsPerChar:t,alphabet:A}){const i=sb(A);return $o({prefix:e,name:n,encode(r){return rb(r,A,t)},decode(r){return ib(r,i,t,n)}})}const Bn=bs({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),ab=bs({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),ob=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Bn,base58flickr:ab},Symbol.toStringTag,{value:"Module"})),gr=eA({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),lb=eA({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),cb=eA({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),ub=eA({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),fb=eA({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),hb=eA({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),db=eA({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),pb=eA({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),gb=eA({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),mb=Object.freeze(Object.defineProperty({__proto__:null,base32:gr,base32hex:fb,base32hexpad:db,base32hexpadupper:pb,base32hexupper:hb,base32pad:cb,base32padupper:ub,base32upper:lb,base32z:gb},Symbol.toStringTag,{value:"Module"})),Za=bs({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Bb=bs({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),vb=Object.freeze(Object.defineProperty({__proto__:null,base36:Za,base36upper:Bb},Symbol.toStringTag,{value:"Module"}));var wb=am,Pd=128,Cb=-128,xb=Math.pow(2,31);function am(n,e,t){e=e||[],t=t||0;for(var A=t;n>=xb;)e[t++]=n&255|Pd,n/=128;for(;n&Cb;)e[t++]=n&255|Pd,n>>>=7;return e[t]=n|0,am.bytes=t-A+1,e}var _b=Uu,Eb=128,Hd=127;function Uu(n,A){var t=0,A=A||0,i=0,r=A,s,a=n.length;do{if(r>=a)throw Uu.bytes=0,new RangeError("Could not decode varint");s=n[r++],t+=i<28?(s&Hd)<<i:(s&Hd)*Math.pow(2,i),i+=7}while(s>=Eb);return Uu.bytes=r-A,t}var yb=Math.pow(2,7),Ub=Math.pow(2,14),Sb=Math.pow(2,21),Mb=Math.pow(2,28),bb=Math.pow(2,35),Fb=Math.pow(2,42),Tb=Math.pow(2,49),Ib=Math.pow(2,56),Qb=Math.pow(2,63),Lb=function(n){return n<yb?1:n<Ub?2:n<Sb?3:n<Mb?4:n<bb?5:n<Fb?6:n<Tb?7:n<Ib?8:n<Qb?9:10},Rb={encode:wb,decode:_b,encodingLength:Lb},Co=Rb;function Su(n,e=0){return[Co.decode(n,e),Co.decode.bytes]}function xo(n,e,t=0){return Co.encode(n,e,t),e}function _o(n){return Co.encodingLength(n)}function Db(n,e){const t=e.byteLength,A=_o(n),i=A+_o(t),r=new Uint8Array(i+t);return xo(n,r,0),xo(t,r,A),r.set(e,i),new cf(n,t,e,r)}function Pb(n){const e=lf(n),[t,A]=Su(e),[i,r]=Su(e.subarray(A)),s=e.subarray(A+r);if(s.byteLength!==i)throw new Error("Incorrect length");return new cf(t,i,s,e)}function Hb(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&YM(n.bytes,t.bytes)}}class cf{constructor(e,t,A,i){Ee(this,"code");Ee(this,"size");Ee(this,"digest");Ee(this,"bytes");this.code=e,this.size=t,this.digest=A,this.bytes=i}}function Nd(n,e){const{bytes:t,version:A}=n;switch(A){case 0:return Ob(t,Mu(n),e??Bn.encoder);default:return Gb(t,Mu(n),e??gr.encoder)}}const Od=new WeakMap;function Mu(n){const e=Od.get(n);if(e==null){const t=new Map;return Od.set(n,t),t}return e}var mp;class Wt{constructor(e,t,A,i){Ee(this,"code");Ee(this,"version");Ee(this,"multihash");Ee(this,"bytes");Ee(this,"/");Ee(this,mp,"CID");this.code=t,this.version=e,this.multihash=A,this.bytes=i,this["/"]=i}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Wr)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==Vb)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return Wt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,A=Db(e,t);return Wt.createV1(this.code,A)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return Wt.equals(this,e)}static equals(e,t){const A=t;return A!=null&&e.code===A.code&&e.version===A.version&&Hb(e.multihash,A.multihash)}toString(e){return Nd(this,e)}toJSON(){return{"/":Nd(this)}}link(){return this}[(mp=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Wt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:A,code:i,multihash:r,bytes:s}=t;return new Wt(A,i,r,s??Gd(A,i,r.bytes))}else if(t[kb]===!0){const{version:A,multihash:i,code:r}=t,s=Pb(i);return Wt.create(A,r,s)}else return null}static create(e,t,A){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(A.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Wr)throw new Error(`Version 0 CID must use dag-pb (code: ${Wr}) block encoding`);return new Wt(e,t,A,A.bytes)}case 1:{const i=Gd(e,t,A.bytes);return new Wt(e,t,A,i)}default:throw new Error("Invalid version")}}static createV0(e){return Wt.create(0,Wr,e)}static createV1(e,t){return Wt.create(1,e,t)}static decode(e){const[t,A]=Wt.decodeFirst(e);if(A.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Wt.inspectBytes(e),A=t.size-t.multihashSize,i=lf(e.subarray(A,A+t.multihashSize));if(i.byteLength!==t.multihashSize)throw new Error("Incorrect length");const r=i.subarray(t.multihashSize-t.digestSize),s=new cf(t.multihashCode,t.digestSize,r,i);return[t.version===0?Wt.createV0(s):Wt.createV1(t.codec,s),e.subarray(t.size)]}static inspectBytes(e){let t=0;const A=()=>{const[u,f]=Su(e.subarray(t));return t+=f,u};let i=A(),r=Wr;if(i===18?(i=0,t=0):r=A(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=t,a=A(),o=A(),l=t+o,c=l-s;return{version:i,codec:r,multihashCode:a,digestSize:o,multihashSize:c,size:l}}static parse(e,t){const[A,i]=Nb(e,t),r=Wt.decode(i);if(r.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Mu(r).set(A,e),r}}function Nb(n,e){switch(n[0]){case"Q":{const t=e??Bn;return[Bn.prefix,t.decode(`${Bn.prefix}${n}`)]}case Bn.prefix:{const t=e??Bn;return[Bn.prefix,t.decode(n)]}case gr.prefix:{const t=e??gr;return[gr.prefix,t.decode(n)]}case Za.prefix:{const t=e??Za;return[Za.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function Ob(n,e,t){const{prefix:A}=t;if(A!==Bn.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const i=e.get(A);if(i==null){const r=t.encode(n).slice(1);return e.set(A,r),r}else return i}function Gb(n,e,t){const{prefix:A}=t,i=e.get(A);if(i==null){const r=t.encode(n);return e.set(A,r),r}else return i}const Wr=112,Vb=18;function Gd(n,e,t){const A=_o(n),i=A+_o(e),r=new Uint8Array(i+t.byteLength);return xo(n,r,0),xo(e,r,A),r.set(t,i),r}const kb=Symbol.for("@ipld/js-cid/CID");function bu(n=0){return new Uint8Array(n)}function Bs(n=0){return new Uint8Array(n)}function om(n,e){e==null&&(e=n.reduce((i,r)=>i+r.length,0));const t=Bs(e);let A=0;for(const i of n)t.set(i,A),A+=i.length;return t}const zb=bs({prefix:"9",name:"base10",alphabet:"0123456789"}),Kb=Object.freeze(Object.defineProperty({__proto__:null,base10:zb},Symbol.toStringTag,{value:"Module"})),Wb=eA({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Xb=eA({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Yb=Object.freeze(Object.defineProperty({__proto__:null,base16:Wb,base16upper:Xb},Symbol.toStringTag,{value:"Module"})),Jb=eA({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),Zb=Object.freeze(Object.defineProperty({__proto__:null,base2:Jb},Symbol.toStringTag,{value:"Module"})),lm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),qb=lm.reduce((n,e,t)=>(n[t]=e,n),[]),jb=lm.reduce((n,e,t)=>{const A=e.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${e}`);return n[A]=t,n},[]);function $b(n){return n.reduce((e,t)=>(e+=qb[t],e),"")}function eF(n){const e=[];for(const t of n){const A=t.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${t}`);const i=jb[A];if(i==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(i)}return new Uint8Array(e)}const tF=$o({prefix:"🚀",name:"base256emoji",encode:$b,decode:eF}),AF=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:tF},Symbol.toStringTag,{value:"Module"})),nF=eA({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),iF=eA({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),cm=eA({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),rF=eA({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),sF=Object.freeze(Object.defineProperty({__proto__:null,base64:nF,base64pad:iF,base64url:cm,base64urlpad:rF},Symbol.toStringTag,{value:"Module"})),aF=eA({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),oF=Object.freeze(Object.defineProperty({__proto__:null,base8:aF},Symbol.toStringTag,{value:"Module"})),lF=$o({prefix:"\0",name:"identity",encode:n=>ZM(n),decode:n=>JM(n)}),cF=Object.freeze(Object.defineProperty({__proto__:null,identity:lF},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Fu={...cF,...Zb,...oF,...Kb,...Yb,...mb,...vb,...ob,...sF,...AF};function um(n,e,t,A){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:A}}}const Vd=um("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),nc=um("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Bs(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),fm={utf8:Vd,"utf-8":Vd,hex:Fu.base16,latin1:nc,ascii:nc,binary:nc,...Fu};function uf(n,e="utf8"){const t=fm[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function Eo(n,e="utf8"){const t=fm[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}const uF=Math.pow(2,7),fF=Math.pow(2,14),hF=Math.pow(2,21),hm=Math.pow(2,28),dm=Math.pow(2,35),pm=Math.pow(2,42),gm=Math.pow(2,49),uA=128,Qn=127;function ff(n){if(n<uF)return 1;if(n<fF)return 2;if(n<hF)return 3;if(n<hm)return 4;if(n<dm)return 5;if(n<pm)return 6;if(n<gm)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function dF(n,e,t=0){switch(ff(n)){case 8:e[t++]=n&255|uA,n/=128;case 7:e[t++]=n&255|uA,n/=128;case 6:e[t++]=n&255|uA,n/=128;case 5:e[t++]=n&255|uA,n/=128;case 4:e[t++]=n&255|uA,n>>>=7;case 3:e[t++]=n&255|uA,n>>>=7;case 2:e[t++]=n&255|uA,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function pF(n,e){let t=n[e],A=0;if(A+=t&Qn,t<uA||(t=n[e+1],A+=(t&Qn)<<7,t<uA)||(t=n[e+2],A+=(t&Qn)<<14,t<uA)||(t=n[e+3],A+=(t&Qn)<<21,t<uA)||(t=n[e+4],A+=(t&Qn)*hm,t<uA)||(t=n[e+5],A+=(t&Qn)*dm,t<uA)||(t=n[e+6],A+=(t&Qn)*pm,t<uA)||(t=n[e+7],A+=(t&Qn)*gm,t<uA))return A;throw new RangeError("Could not decode varint")}const hf=new Float32Array([-0]),kn=new Uint8Array(hf.buffer);function gF(n,e,t){hf[0]=n,e[t]=kn[0],e[t+1]=kn[1],e[t+2]=kn[2],e[t+3]=kn[3]}function mF(n,e){return kn[0]=n[e],kn[1]=n[e+1],kn[2]=n[e+2],kn[3]=n[e+3],hf[0]}const df=new Float64Array([-0]),iA=new Uint8Array(df.buffer);function BF(n,e,t){df[0]=n,e[t]=iA[0],e[t+1]=iA[1],e[t+2]=iA[2],e[t+3]=iA[3],e[t+4]=iA[4],e[t+5]=iA[5],e[t+6]=iA[6],e[t+7]=iA[7]}function vF(n,e){return iA[0]=n[e],iA[1]=n[e+1],iA[2]=n[e+2],iA[3]=n[e+3],iA[4]=n[e+4],iA[5]=n[e+5],iA[6]=n[e+6],iA[7]=n[e+7],df[0]}const wF=BigInt(Number.MAX_SAFE_INTEGER),CF=BigInt(Number.MIN_SAFE_INTEGER);class sA{constructor(e,t){Ee(this,"lo");Ee(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(t+A*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(BigInt(t)+(BigInt(A)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,A=this.hi>>>24;return A===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:A<128?9:10}static fromBigInt(e){if(e===0n)return wi;if(e<wF&&e>CF)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let A=e>>32n,i=e-(A<<32n);return t&&(A=~A|0n,i=~i|0n,++i>kd&&(i=0n,++A>kd&&(A=0n))),new sA(Number(i),Number(A))}static fromNumber(e){if(e===0)return wi;const t=e<0;t&&(e=-e);let A=e>>>0,i=(e-A)/4294967296>>>0;return t&&(i=~i>>>0,A=~A>>>0,++A>4294967295&&(A=0,++i>4294967295&&(i=0))),new sA(A,i)}static from(e){return typeof e=="number"?sA.fromNumber(e):typeof e=="bigint"?sA.fromBigInt(e):typeof e=="string"?sA.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new sA(e.low>>>0,e.high>>>0):wi}}const wi=new sA(0,0);wi.toBigInt=function(){return 0n};wi.zzEncode=wi.zzDecode=function(){return this};wi.length=function(){return 1};const kd=4294967296n;function xF(n){let e=0,t=0;for(let A=0;A<n.length;++A)t=n.charCodeAt(A),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(A+1)&64512)===56320?(++A,e+=4):e+=3;return e}function _F(n,e,t){if(t-e<1)return"";let i;const r=[];let s=0,a;for(;e<t;)a=n[e++],a<128?r[s++]=a:a>191&&a<224?r[s++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,r[s++]=55296+(a>>10),r[s++]=56320+(a&1023)):r[s++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,s>8191&&((i??(i=[])).push(String.fromCharCode.apply(String,r)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,r.slice(0,s))),i.join("")):String.fromCharCode.apply(String,r.slice(0,s))}function mm(n,e,t){const A=t;let i,r;for(let s=0;s<n.length;++s)i=n.charCodeAt(s),i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&((r=n.charCodeAt(s+1))&64512)===56320?(i=65536+((i&1023)<<10)+(r&1023),++s,e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128);return t-A}function VA(n,e){return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function ba(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class EF{constructor(e){Ee(this,"buf");Ee(this,"pos");Ee(this,"len");Ee(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,VA(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw VA(this,4);return ba(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw VA(this,4);return ba(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw VA(this,4);const e=mF(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw VA(this,4);const e=vF(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,A=this.pos+e;if(A>this.len)throw VA(this,e);return this.pos+=e,t===A?new Uint8Array(0):this.buf.subarray(t,A)}string(){const e=this.bytes();return _F(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw VA(this,e);this.pos+=e}else do if(this.pos>=this.len)throw VA(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new sA(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw VA(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw VA(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw VA(this,8);const e=ba(this.buf,this.pos+=4),t=ba(this.buf,this.pos+=4);return new sA(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=pF(this.buf,this.pos);return this.pos+=ff(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function yF(n){return new EF(n instanceof Uint8Array?n:n.subarray())}function pf(n,e,t){const A=yF(n);return e.decode(A,void 0,t)}function UF(n){let A,i=8192;return function(s){if(s<1||s>4096)return Bs(s);i+s>8192&&(A=Bs(8192),i=0);const a=A.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class ns{constructor(e,t,A){Ee(this,"fn");Ee(this,"len");Ee(this,"next");Ee(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=A}}function ic(){}class SF{constructor(e){Ee(this,"head");Ee(this,"tail");Ee(this,"len");Ee(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const MF=UF();function bF(n){return globalThis.Buffer!=null?Bs(n):MF(n)}class Tu{constructor(){Ee(this,"len");Ee(this,"head");Ee(this,"tail");Ee(this,"states");this.len=0,this.head=new ns(ic,0,0),this.tail=this.head,this.states=null}_push(e,t,A){return this.tail=this.tail.next=new ns(e,t,A),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new TF((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Fa,10,sA.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=sA.fromBigInt(e);return this._push(Fa,t.length(),t)}uint64Number(e){return this._push(dF,ff(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=sA.fromBigInt(e).zzEncode();return this._push(Fa,t.length(),t)}sint64Number(e){const t=sA.fromNumber(e).zzEncode();return this._push(Fa,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(rc,1,e?1:0)}fixed32(e){return this._push(Xr,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=sA.fromBigInt(e);return this._push(Xr,4,t.lo)._push(Xr,4,t.hi)}fixed64Number(e){const t=sA.fromNumber(e);return this._push(Xr,4,t.lo)._push(Xr,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(gF,4,e)}double(e){return this._push(BF,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(rc,1,0):this.uint32(t)._push(IF,t,e)}string(e){const t=xF(e);return t!==0?this.uint32(t)._push(mm,t,e):this._push(rc,1,0)}fork(){return this.states=new SF(this),this.head=this.tail=new ns(ic,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new ns(ic,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,A=this.len;return this.reset().uint32(A),A!==0&&(this.tail.next=e.next,this.tail=t,this.len+=A),this}finish(){let e=this.head.next;const t=bF(this.len);let A=0;for(;e!=null;)e.fn(e.val,t,A),A+=e.len,e=e.next;return t}}function rc(n,e,t){e[t]=n&255}function FF(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class TF extends ns{constructor(t,A){super(FF,t,A);Ee(this,"next");this.next=void 0}}function Fa(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Xr(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function IF(n,e,t){e.set(n,t)}globalThis.Buffer!=null&&(Tu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(QF,e,n),this},Tu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(LF,e,n),this});function QF(n,e,t){e.set(n,t)}function LF(n,e,t){n.length<40?mm(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(uf(n),t)}function RF(){return new Tu}function gf(n,e){const t=RF();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}var Iu;(function(n){n[n.VARINT=0]="VARINT",n[n.BIT64=1]="BIT64",n[n.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",n[n.START_GROUP=3]="START_GROUP",n[n.END_GROUP=4]="END_GROUP",n[n.BIT32=5]="BIT32"})(Iu||(Iu={}));function DF(n,e,t,A){return{name:n,type:e,encode:t,decode:A}}function mf(n,e){return DF("message",Iu.LENGTH_DELIMITED,n,e)}class Qu extends Error{constructor(){super(...arguments);Ee(this,"code","ERR_MAX_LENGTH");Ee(this,"name","MaxLengthError")}}class PF{constructor(){Ee(this,"index",0);Ee(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,A=e();return A===void 0&&(this.index=t),A}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,A){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return A()})}readNumber(e,t,A,i){return this.readAtomically(()=>{let r=0,s=0;const a=this.peekChar();if(a===void 0)return;const o=a==="0",l=2**(8*i)-1;for(;;){const c=this.readAtomically(()=>{const u=this.readChar();if(u===void 0)return;const f=Number.parseInt(u,e);if(!Number.isNaN(f))return f});if(c===void 0)break;if(r*=e,r+=c,r>l||(s+=1,t!==void 0&&s>t))return}if(s!==0)return!A&&o&&s>1?void 0:r})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const A=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(A===void 0)return;e[t]=A}return e})}readIPv6Addr(){const e=t=>{for(let A=0;A<t.length/2;A++){const i=A*2;if(A<t.length-3){const s=this.readSeparator(":",A,()=>this.readIPv4Addr());if(s!==void 0)return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],[i+4,!0]}const r=this.readSeparator(":",A,()=>this.readNumber(16,4,!0,2));if(r===void 0)return[i,!1];t[i]=r>>8,t[i+1]=r&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[A,i]=e(t);if(A===16)return t;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const r=new Uint8Array(14),s=16-(A+2),[a]=e(r.subarray(0,s));return t.set(r.subarray(0,a),16-a),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const HF=45,NF=15,yo=new PF;function OF(n){if(!(n.length>NF))return yo.new(n).parseWith(()=>yo.readIPv4Addr())}function GF(n){if(n.includes("%")&&(n=n.split("%")[0]),!(n.length>HF))return yo.new(n).parseWith(()=>yo.readIPv6Addr())}function Bm(n){return!!OF(n)}function VF(n){return!!GF(n)}class Ui extends Error{constructor(){super(...arguments);Ee(this,"name","InvalidMultiaddrError")}}Ee(Ui,"name","InvalidMultiaddrError");class br extends Error{constructor(){super(...arguments);Ee(this,"name","ValidationError")}}Ee(br,"name","ValidationError");class vm extends Error{constructor(){super(...arguments);Ee(this,"name","UnknownProtocolError")}}Ee(vm,"name","UnknownProtocolError");const kF=4,zF=6,KF=273,WF=33,XF=41,YF=42,JF=43,ZF=53,qF=54,jF=55,$F=56,eT=132,tT=301,AT=302,nT=400,iT=421,rT=444,sT=445,aT=446,oT=447,lT=448,cT=449,uT=454,fT=460,hT=461,dT=465,pT=466,gT=480,mT=481,BT=443,vT=477,wT=478,CT=479,xT=277,_T=275,ET=276,yT=280,UT=281,ST=290,MT=777;function zd(n){return e=>Eo(e,n)}function Kd(n){return e=>uf(e,n)}function is(n){return new DataView(n.buffer).getUint16(n.byteOffset).toString()}function cr(n){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof n=="string"?parseInt(n):n),new Uint8Array(e)}function bT(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=uf(e[0],"base32"),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=cr(A);return om([t,i],t.length+i.length)}function FT(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=gr.decode(`b${e[0]}`),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=cr(A);return om([t,i],t.length+i.length)}function Wd(n){const e=n.subarray(0,n.length-2),t=n.subarray(n.length-2),A=Eo(e,"base32"),i=is(t);return`${A}:${i}`}const wm=function(n){n=n.toString().trim();const e=new Uint8Array(4);return n.split(/\./g).forEach((t,A)=>{const i=parseInt(t,10);if(isNaN(i)||i<0||i>255)throw new Ui("Invalid byte value in IP address");e[A]=i}),e},TT=function(n){let e=0;n=n.toString().trim();const t=n.split(":",8);let A;for(A=0;A<t.length;A++){const r=Bm(t[A]);let s;r&&(s=wm(t[A]),t[A]=Eo(s.subarray(0,2),"base16")),s!=null&&++A<8&&t.splice(A,0,Eo(s.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(A=0;A<t.length&&t[A]!=="";A++);const r=[A,1];for(A=9-t.length;A>0;A--)r.push("0");t.splice.apply(t,r)}const i=new Uint8Array(e+16);for(A=0;A<t.length;A++){t[A]===""&&(t[A]="0");const r=parseInt(t[A],16);if(isNaN(r)||r<0||r>65535)throw new Ui("Invalid byte value in IP address");i[e++]=r>>8&255,i[e++]=r&255}return i},IT=function(n){if(n.byteLength!==4)throw new Ui("IPv4 address was incorrect length");const e=[];for(let t=0;t<n.byteLength;t++)e.push(n[t]);return e.join(".")},QT=function(n){if(n.byteLength!==16)throw new Ui("IPv6 address was incorrect length");const e=[];for(let A=0;A<n.byteLength;A+=2){const i=n[A],r=n[A+1],s=`${i.toString(16).padStart(2,"0")}${r.toString(16).padStart(2,"0")}`;e.push(s)}const t=e.join(":");try{const A=new URL(`http://[${t}]`);return A.hostname.substring(1,A.hostname.length-1)}catch{throw new Ui(`Invalid IPv6 address "${t}"`)}};function LT(n){try{const e=new URL(`http://[${n}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new Ui(`Invalid IPv6 address "${n}"`)}}const sc=Object.values(Fu).map(n=>n.decoder),RT=(function(){let n=sc[0].or(sc[1]);return sc.slice(2).forEach(e=>n=n.or(e)),n})();function DT(n){return RT.decode(n)}function PT(n){return e=>n.encoder.encode(e)}function HT(n){if(parseInt(n).toString()!==n)throw new br("Value must be an integer")}function NT(n){if(n<0)throw new br("Value must be a positive integer, or zero")}function OT(n){return e=>{if(e>n)throw new br(`Value must be smaller than or equal to ${n}`)}}function GT(...n){return e=>{for(const t of n)t(e)}}const Ta=GT(HT,NT,OT(65535)),wA=-1;class VT{constructor(){Ee(this,"protocolsByCode",new Map);Ee(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new vm(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(A=>{this.protocolsByName.set(A,e)})}removeProtocol(e){var A;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(A=t.aliases)==null||A.forEach(i=>{this.protocolsByName.delete(i)}))}}const kT=new VT,zT=[{code:kF,name:"ip4",size:32,valueToBytes:wm,bytesToValue:IT,validate:n=>{if(!Bm(n))throw new br(`Invalid IPv4 address "${n}"`)}},{code:zF,name:"tcp",size:16,valueToBytes:cr,bytesToValue:is,validate:Ta},{code:KF,name:"udp",size:16,valueToBytes:cr,bytesToValue:is,validate:Ta},{code:WF,name:"dccp",size:16,valueToBytes:cr,bytesToValue:is,validate:Ta},{code:XF,name:"ip6",size:128,valueToBytes:TT,bytesToValue:QT,stringToValue:LT,validate:n=>{if(!VF(n))throw new br(`Invalid IPv6 address "${n}"`)}},{code:YF,name:"ip6zone",size:wA},{code:JF,name:"ipcidr",size:8,bytesToValue:zd("base10"),valueToBytes:Kd("base10")},{code:ZF,name:"dns",size:wA},{code:qF,name:"dns4",size:wA},{code:jF,name:"dns6",size:wA},{code:$F,name:"dnsaddr",size:wA},{code:eT,name:"sctp",size:16,valueToBytes:cr,bytesToValue:is,validate:Ta},{code:tT,name:"udt"},{code:AT,name:"utp"},{code:nT,name:"unix",size:wA,stringToValue:n=>decodeURIComponent(n),valueToString:n=>encodeURIComponent(n)},{code:iT,name:"p2p",aliases:["ipfs"],size:wA,bytesToValue:zd("base58btc"),valueToBytes:n=>n.startsWith("Q")||n.startsWith("1")?Kd("base58btc")(n):Wt.parse(n).multihash.bytes},{code:rT,name:"onion",size:96,bytesToValue:Wd,valueToBytes:bT},{code:sT,name:"onion3",size:296,bytesToValue:Wd,valueToBytes:FT},{code:aT,name:"garlic64",size:wA},{code:oT,name:"garlic32",size:wA},{code:lT,name:"tls"},{code:cT,name:"sni",size:wA},{code:uT,name:"noise"},{code:fT,name:"quic"},{code:hT,name:"quic-v1"},{code:dT,name:"webtransport"},{code:pT,name:"certhash",size:wA,bytesToValue:PT(cm),valueToBytes:DT},{code:gT,name:"http"},{code:mT,name:"http-path",size:wA,stringToValue:n=>`/${decodeURIComponent(n)}`,valueToString:n=>encodeURIComponent(n.substring(1))},{code:BT,name:"https"},{code:vT,name:"ws"},{code:wT,name:"wss"},{code:CT,name:"p2p-websocket-star"},{code:xT,name:"p2p-stardust"},{code:_T,name:"p2p-webrtc-star"},{code:ET,name:"p2p-webrtc-direct"},{code:yT,name:"webrtc-direct"},{code:UT,name:"webrtc"},{code:ST,name:"p2p-circuit"},{code:MT,name:"memory",size:wA}];zT.forEach(n=>{kT.addProtocol(n)});var Bp,vp;(vp=(Bp=globalThis.process)==null?void 0:Bp.env)!=null&&vp.DUMP_SESSION_KEYS;var Uo;(function(n){let e;n.codec=()=>(e==null&&(e=mf((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.webtransportCerthashes!=null)for(const r of t.webtransportCerthashes)A.uint32(10),A.bytes(r);if(t.streamMuxers!=null)for(const r of t.streamMuxers)A.uint32(18),A.string(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a,o;const r={webtransportCerthashes:[],streamMuxers:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const l=t.uint32();switch(l>>>3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&r.webtransportCerthashes.length===i.limits.webtransportCerthashes)throw new Qu('Decode error - map field "webtransportCerthashes" had too many elements');r.webtransportCerthashes.push(t.bytes());break}case 2:{if(((o=i.limits)==null?void 0:o.streamMuxers)!=null&&r.streamMuxers.length===i.limits.streamMuxers)throw new Qu('Decode error - map field "streamMuxers" had too many elements');r.streamMuxers.push(t.string());break}default:{t.skipType(l&7);break}}}return r})),e),n.encode=t=>gf(t,n.codec()),n.decode=(t,A)=>pf(t,n.codec(),A)})(Uo||(Uo={}));var Xd;(function(n){let e;n.codec=()=>(e==null&&(e=mf((t,A,i={})=>{i.lengthDelimited!==!1&&A.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(A.uint32(10),A.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(A.uint32(18),A.bytes(t.identitySig)),t.extensions!=null&&(A.uint32(34),Uo.codec().encode(t.extensions,A)),i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={identityKey:bu(0),identitySig:bu(0)},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.identityKey=t.bytes();break}case 2:{r.identitySig=t.bytes();break}case 4:{r.extensions=Uo.codec().decode(t,t.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>gf(t,n.codec()),n.decode=(t,A)=>pf(t,n.codec(),A)})(Xd||(Xd={}));var Yd;(function(n){n[n.Data=0]="Data",n[n.WindowUpdate=1]="WindowUpdate",n[n.Ping=2]="Ping",n[n.GoAway=3]="GoAway"})(Yd||(Yd={}));var Lu;(function(n){n[n.SYN=1]="SYN",n[n.ACK=2]="ACK",n[n.FIN=4]="FIN",n[n.RST=8]="RST"})(Lu||(Lu={}));Object.values(Lu).filter(n=>typeof n!="string");var Jd;(function(n){n[n.NormalTermination=0]="NormalTermination",n[n.ProtocolError=1]="ProtocolError",n[n.InternalError=2]="InternalError"})(Jd||(Jd={}));var Zd;(function(n){n[n.Init=0]="Init",n[n.SYNSent=1]="SYNSent",n[n.SYNReceived=2]="SYNReceived",n[n.Established=3]="Established",n[n.Finished=4]="Finished",n[n.Paused=5]="Paused"})(Zd||(Zd={}));var qd;(function(n){let e;n.codec=()=>(e==null&&(e=mf((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(A.uint32(10),A.bytes(t.publicKey)),t.addrs!=null)for(const r of t.addrs)A.uint32(18),A.bytes(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={publicKey:bu(0),addrs:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.publicKey=t.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&r.addrs.length===i.limits.addrs)throw new Qu('Decode error - map field "addrs" had too many elements');r.addrs.push(t.bytes());break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>gf(t,n.codec()),n.decode=(t,A)=>pf(t,n.codec(),A)})(qd||(qd={}));new TextEncoder;new TextDecoder;const KT="modulepreload",WT=function(n,e){return new URL(n,e).href},jd={},XT=function(e,t,A){let i=Promise.resolve();if(t&&t.length>0){let s=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=s(t.map(c=>{if(c=WT(c,A),c in jd)return;jd[c]=!0;const u=c.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!A)for(let m=a.length-1;m>=0;m--){const d=a[m];if(d.href===c&&(!u||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${f}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":KT,u||(g.as="script"),g.crossOrigin="",g.href=c,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((m,d)=>{g.addEventListener("load",m),g.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};class YT{constructor(e={}){const t=typeof navigator<"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4;this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,maxWorkers:e.maxWorkers||t,...e},this.workers=[],this.taskQueue=[],this.activeTasks=new Map,this.commitDeltaHandler=null,this.capabilities={cpu:!0,webgpu:!1},this.initialized=!1}setCommitDeltaHandler(e){this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.initialized)return;if(this.initialized=!0,!(typeof Worker<"u"&&this.config.enableWorkers)){console.warn("[ComputeManager] Web Workers not available; falling back to inline execution");return}const t=new URL("data:text/javascript;base64,LyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovCgpzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChldmVudCkgPT4gewogIGNvbnN0IG1zZyA9IGV2ZW50LmRhdGE7CiAgaWYgKCFtc2cgfHwgbXNnLnR5cGUgIT09ICdydW4nKSByZXR1cm47CiAgY29uc3QgeyBpZCwgZGF0YSwgZm4sIG1vZHVsZSwgZXhwb3J0TmFtZSB9ID0gbXNnOwogIHRyeSB7CiAgICBsZXQgaGFuZGxlcjsKICAgIGlmIChmbikgewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMKICAgICAgaGFuZGxlciA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICgke2ZufSk7YCkoKTsKICAgIH0gZWxzZSBpZiAobW9kdWxlKSB7CiAgICAgIC8vIFNpbGVuY2Ugd2VicGFjaydzICJkZXBlbmRlbmN5IGlzIGFuIGV4cHJlc3Npb24iIHdhcm5pbmcgYnkgZXhwbGljaXRseSBpZ25vcmluZyBidW5kbGluZyBoZXJlLgogICAgICAvLyBUaGUgd29ya2VyIGV4cGVjdHMgYSByZWFsIFVSTCBzdHJpbmcgcGFzc2VkIGluIGZyb20gdGhlIG1haW4gdGhyZWFkLgogICAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoCiAgICAgICAgLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLwogICAgICAgIG1vZHVsZQogICAgICApOwogICAgICBoYW5kbGVyID0gbW9kW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTsKICAgIH0KICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhbmRsZXIgbm90IGZvdW5kIGZvciB0YXNrJyk7CiAgICB9CiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKGRhdGEpOwogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXN1bHQnLCBpZCwgcmVzdWx0IH0pOwogIH0gY2F0Y2ggKGVycikgewogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIGlkLCBlcnJvcjogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpIH0pOwogIH0KfTsK",import.meta.url),A=Math.max(1,Math.min(this.config.maxWorkers,128));for(let i=0;i<A;i++){const r=new Worker(t,{type:"module"});r.onmessage=s=>this._handleWorkerMessage(r,s.data),r.onerror=s=>console.error("[ComputeManager] Worker error",s),this.workers.push(r)}}async submitTask(e){if(!e)throw new Error("Task is required");if(!e.fn&&!e.module)throw new Error("Task must provide fn or module");const t=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,A=e.id||t,i={id:A,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,exportName:e.exportName||"default"};return this.initialized||await this.initialize(),new Promise((r,s)=>{const a={id:A,payload:i,resolve:r,reject:s};this._dispatchToWorker(a)||(this.taskQueue.push(a),this._scheduleNext())})}async distributeTask(e,t){}async cancelTask(e){}getCapabilities(){return{...this.capabilities,workers:this.workers.length,activeTaskCount:this.activeTasks.size,queuedTaskCount:this.taskQueue.length}}getStats(){return{totalTasksCompleted:0,averageTaskDuration:0,currentLoad:0}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_dispatchToWorker(e){const t=this.workers.find(A=>!Array.from(this.activeTasks.values()).some(i=>i.worker===A));return t?(this.activeTasks.set(e.id,{...e,worker:t}),t.postMessage({type:"run",...e.payload}),!0):!1}async _executeInline(e){try{let t;if(e.payload.fn)t=new Function(`return (${e.payload.fn});`)();else if(e.payload.module){if(typeof e.payload.module!="string")throw new Error("module path must be a string");t=(await XT(()=>import(`${e.payload.module}`),[],import.meta.url))[e.payload.exportName||"default"]}const A=await t(e.payload.data);if(A&&typeof A=="object"&&Object.prototype.hasOwnProperty.call(A,"commitDelta")){this.commitDelta(A.commitDelta);const i=Object.prototype.hasOwnProperty.call(A,"value")?A.value:A.result;e.resolve(i);return}e.resolve(A)}catch(t){e.reject(t)}}_handleWorkerMessage(e,t){const{id:A,type:i,result:r,error:s}=t||{},a=this.activeTasks.get(A);if(a){if(i==="result"){let o=r;r&&typeof r=="object"&&Object.prototype.hasOwnProperty.call(r,"commitDelta")&&(this.commitDelta(r.commitDelta),o=Object.prototype.hasOwnProperty.call(r,"value")?r.value:r.result),a.resolve(o)}else i==="error"&&a.reject(new Error(s||"Worker task failed"));this.activeTasks.delete(A),this._scheduleNext()}}_scheduleNext(){if(this.taskQueue.length===0)return;const e=this.taskQueue.shift();if(this.workers.length===0){this._executeInline(e);return}this._dispatchToWorker(e)||this.taskQueue.unshift(e)}}const $d=[68/255,136/255,255/255],ep=[255/255,170/255,238/255],tp=[255/255,221/255,170/255],JT=.125,ZT=320,ac=(n,e,t)=>n+(e-n)*t,oc=(n,e,t)=>[ac(n[0],e[0],t),ac(n[1],e[1],t),ac(n[2],e[2],t)],Cm=n=>{let e=n;return()=>{const t=Math.sin(e++)*1e4;return t-Math.floor(t)}},Ci=(n,e)=>{const t=n()*Math.PI*2,A=Math.acos(2*n()-1),i=Math.sin(A);return{x:e*i*Math.cos(t),y:e*i*Math.sin(t),z:e*Math.cos(A)}};function qT({seed:n=1337,starCount:e=25e4,clusterCount:t=300,scale:A=1e8,filamentScatter:i=.04}={}){const r=Cm(n),s=new Float32Array(e*3),a=new Float32Array(e*3),o=new Float32Array(e),l=[];for(let c=0;c<t;c++){const u=Math.pow(r(),.5)*A,f=Ci(r,u);l.push(f)}for(let c=0;c<e;c++){const u=c*3,f=Math.floor(r()*t);let p=f,g=1/0;for(let C=0;C<3;C++){const L=Math.floor(r()*t);if(L===f)continue;const W=l[f].x-l[L].x,P=l[f].y-l[L].y,K=l[f].z-l[L].z,Z=W*W+P*P+K*K;Z<g&&(g=Z,p=L)}let m=r();m=m<.5?2*m*m:-1+(4-2*m)*m;const d=l[f],h=l[p],v=d.x+(h.x-d.x)*m,w=d.y+(h.y-d.y)*m,_=d.z+(h.z-d.z)*m,b=A*i,y=r()*b,S=Ci(r,y);s[u]=v+S.x,s[u+1]=w+S.y,s[u+2]=_+S.z;const R=r();let E;R<.33?E=oc($d,ep,r()):R<.66?E=oc(ep,tp,r()):E=oc(tp,$d,r()),a[u]=E[0],a[u+1]=E[1],a[u+2]=E[2],o[c]=r()*4e4+1e4}return{positions:s,colors:a,sizes:o}}function jT({seed:n=1337,starCount:e=25e4,clusterCount:t=300,scale:A=1e8,filamentScatter:i=.04,resolution:r=96}={}){const s=Cm(n),a=Math.min(ZT,Math.max(24,Math.floor(r))),o=new Float32Array(a*a*a),l=[];for(let d=0;d<t;d++){const h=Math.pow(s(),.5)*A;l.push(Ci(s,h))}const c=Math.min(e,a*a*a),u=a-1,f=A*i;for(let d=0;d<c;d++){const h=Math.floor(s()*t);let v=h,w=1/0;for(let Me=0;Me<3;Me++){const Fe=Math.floor(s()*t);if(Fe===h)continue;const Ge=l[h].x-l[Fe].x,tt=l[h].y-l[Fe].y,Q=l[h].z-l[Fe].z,ht=Ge*Ge+tt*tt+Q*Q;ht<w&&(w=ht,v=Fe)}let _=s();_=_<.5?2*_*_:-1+(4-2*_)*_;const b=l[h],y=l[v],S=b.x+(y.x-b.x)*_,R=b.y+(y.y-b.y)*_,E=b.z+(y.z-b.z)*_,C=s()*f,L=Ci(s,C),W=S+L.x,P=R+L.y,K=E+L.z,Z=W/A*.5+.5,V=P/A*.5+.5,q=K/A*.5+.5;if(Z<0||Z>1||V<0||V>1||q<0||q>1)continue;const X=Z*u,re=V*u,ae=q*u,he=Math.floor(X),Ie=Math.floor(re),Oe=Math.floor(ae),J=X-he,$=re-Ie,ue=ae-Oe,ce=.6+s()*.6;for(let Me=0;Me<=1;Me++){const Fe=Me?J:1-J,Ge=Math.min(u,he+Me);for(let tt=0;tt<=1;tt++){const Q=tt?$:1-$,ht=Math.min(u,Ie+tt);for(let Ye=0;Ye<=1;Ye++){const At=Ye?ue:1-ue,xe=Math.min(u,Oe+Ye),vt=Ge+ht*a+xe*a*a;o[vt]+=ce*Fe*Q*At}}}}let p=0;for(let d=0;d<o.length;d++)o[d]>p&&(p=o[d]);const g=new Uint8Array(o.length),m=p>0?1/p:0;for(let d=0;d<o.length;d++){const h=o[d]*m,v=Math.pow(h,.9);g[d]=Math.max(0,Math.min(255,Math.round(v*255)))}return{density:g,resolution:a,scale:A}}function $T({starCount:n=25e4,radius:e=1e6,type:t=0}={}){const A=Math.random,i=new Float32Array(n*3),r=new Float32Array(n*3),s=new Float32Array(n),a=new Float32Array(n*3),o=[];if(t===2)for(let l=0;l<4;l++)o.push({x:(A()-.5)*e*1.2,y:(A()-.5)*e*.8,z:(A()-.5)*e*1.2});for(let l=0;l<n;l++){const c=l*3;let u=0,f=0,p=0,g=1;if(t===0)if(A()<.2){const _=A()*e*.25,b=Ci(A,_);u=b.x,f=b.y*.8,p=b.z,r[c]=1,r[c+1]=.8,r[c+2]=.4}else{const _=(A()*.1+Math.pow(A(),2)*.9)*e,b=2,S=Math.PI*2/b*(l%b)+7*Math.log(_/e*10+1);u=Math.cos(S)*_+(A()-.5)*e*.1,p=Math.sin(S)*_+(A()-.5)*e*.1,f=(A()-.5)*e*.02*(1+_/e),g=Math.sqrt(1/(_/e+.1)),A()>.3?(r[c]=.6,r[c+1]=.7,r[c+2]=1):(r[c]=1,r[c+1]=1,r[c+2]=1)}else if(t===1){const w=Math.pow(A(),2.5)*e*.6,_=Ci(A,w);u=_.x*.8,f=_.y*.6,p=_.z*.8,g=.1,r[c]=1,r[c+1]=.7,r[c+2]=.3}else{const w=o[l%o.length],_=A()*e*.3,b=Ci(A,_);u=w.x+b.x,f=w.y+b.y,p=w.z+b.z,g=.5,A()>.9?(r[c]=1,r[c+1]=.2,r[c+2]=.1,s[l]=A()*8e3+4e3):(r[c]=.6,r[c+1]=.8,r[c+2]=1)}const m=Math.sqrt(u*u+p*p)+1e-4,d=Math.min(1,m/(e*.9)),h=(A()-.5)*e*.03*d,v=A()*Math.PI*2;u+=Math.cos(v)*h,p+=Math.sin(v)*h,f+=(A()-.5)*e*.01*d,i[c]=u,i[c+1]=f,i[c+2]=p,s[l]===0&&(s[l]=A()*4e3+1e3),s[l]*=JT,a[c]=Math.sqrt(u*u+p*p),a[c+1]=g,a[c+2]=Math.atan2(p,u)}return{positions:i,colors:r,sizes:s,orbitParams:a}}const dt={UNIVERSE:1e8,GALAXY:1e6,SYSTEM:500,G:50},lc=Math.pow(10,1/3),Yn={LOW:{starCount:1e5,clusterCount:200,densityRes:64},MED:{starCount:25e4,clusterCount:300,densityRes:Math.round(80*lc)},HIGH:{starCount:5e5,clusterCount:400,densityRes:Math.round(96*lc)},ULTRA:{starCount:1e6,clusterCount:500,densityRes:Math.round(128*lc)}},e1=320,lt={starCount:Yn.HIGH.starCount,clusterCount:Yn.HIGH.clusterCount,filamentScatter:.04,seed:1337,densityRes:Yn.HIGH.densityRes},t1=new URL(""+new URL("universeTasks--P22t-7r.js",import.meta.url).href,import.meta.url).href,Ap=new YT({maxWorkers:1});let Ia=null;function A1(){return Ia||(Ia=Ap.initialize().then(()=>Ap).catch(n=>(console.warn("[Universes] ComputeManager unavailable:",n),null)),Ia)}async function Ru(n,e){const t=await A1();if(!t)return null;try{return await t.submitTask({module:t1,exportName:n,data:e})}catch(A){return console.warn(`[Universes] Compute task ${n} failed:`,A),null}}const ar=[{id:"O",prob:1e-4,color:10066431,temp:"30,000+",mass:60,rad:8,lum:"30,000+",lifespan:.01},{id:"B",prob:.0013,color:11184895,temp:"10,000-30,000",mass:10,rad:5,lum:"25-30,000",lifespan:.1},{id:"A",prob:.006,color:16777215,temp:"7,500-10,000",mass:3,rad:2.5,lum:"5-25",lifespan:1},{id:"F",prob:.03,color:16777198,temp:"6,000-7,500",mass:1.5,rad:1.3,lum:"1.5-5",lifespan:4},{id:"G",prob:.076,color:16768256,temp:"5,200-6,000",mass:1,rad:1,lum:"0.6-1.5",lifespan:10},{id:"K",prob:.121,color:16755234,temp:"3,700-5,200",mass:.7,rad:.8,lum:"0.08-0.6",lifespan:30},{id:"M",prob:.7645,color:16724736,temp:"2,400-3,700",mass:.3,rad:.4,lum:"< 0.08",lifespan:1e3},{id:"BH",prob:0,color:0,temp:"UNDEFINED",mass:20,rad:.05,lum:"0",lifespan:9999},{id:"N",prob:0,color:65535,temp:"600,000",mass:2.5,rad:.02,lum:"0.001",lifespan:9999},{id:"WD",prob:0,color:12320767,temp:"100,000",mass:.9,rad:.1,lum:"0.01",lifespan:9999}],pi=`
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
`;let Te,et,Ae,Ce,LA,mt,Xe,je,$e,qe,Gt;const vs=[];let Bt;const Jn=[],So=[];let us=0,Zt,qa,ja,np=!1,qA,$a,Bf=new $p,Nn=!1,cc=new Ue,zn=!1,_A=null;const IA=new Set;let xi=!1,eo=0,Qa=null,La=null,CA=null,F=null;const Ra=new eg,Yr=new ut,Ar=new I,ip=new I,Da=new I,ur=new I,Pa=new I,n1=new I,gn=new I,rp=new I,uc=new I,sp=new I,ap=new I;function fc(n){const e=Math.abs(n);return e>=1e7?n.toExponential(2):e>=1e4?Math.round(n).toLocaleString():n.toFixed(1)}function Mo(n){let e=n>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967295)}function mr(n,e){const t=n()*Math.PI*2,A=Math.acos(2*n()-1),i=Math.sin(A);return new I(e*i*Math.cos(t),e*i*Math.sin(t),e*Math.cos(A))}function bo(){var i,r,s;const n=(((i=M.activeGalaxyData)==null?void 0:i.designation)||`SEED-${lt.seed}`).split("").reduce((a,o)=>a*31+o.charCodeAt(0)>>>0,0),e=/QUASAR|AGN/i.test(((r=M.activeGalaxyData)==null?void 0:r.type)||""),t=1e6+n%9e6,A=(.02+n%400/1e4).toFixed(3);return{designation:(s=M.activeGalaxyData)!=null&&s.designation?`${M.activeGalaxyData.designation} ${e?"QUASAR":"CORE"}`:e?"QUASAR CORE":"GALACTIC CORE",typeObj:{id:"BH",color:65280},state:"REMNANT",age:M.universeSimTime.toFixed(3),mass:t.toLocaleString(),radius:A,lum:e?"ACTIVE":"0",spectrum:[],composition:e?`AGN: ACTIVE (QUASAR)
ACCRETION: EXTREME
MASS: ${t.toLocaleString()} M☉`:`EVENT HORIZON: STABLE
ACCRETION: ACTIVE
MASS: ${t.toLocaleString()} M☉`}}function xm(){if(M.autopilotPriorityTargets=[],!M.isAutopilot||M.viewLevel!==1||!$e||$e.children.length===0)return;const n=bo();$e.children.forEach(e=>{!e||typeof e.getWorldPosition!="function"||M.autopilotPriorityTargets.push({object:e,data:n})})}function nr(){M.isAutopilot&&(M.isAutopilot=!1,M.autopilotPriorityTargets=[],xs&&(xs.checked=!1))}function i1(n,e){const t=n+e+1,A=[];for(let r=0;r<=e;r++)A.push(0);const i=t-2*(e+1);for(let r=1;r<=i;r++)A.push(r/(i+1));for(let r=0;r<=e;r++)A.push(1);return A}function vf(){if(!M.showTravelPath){Mt&&(Mt.visible=!1);return}if(KA.length===0&&KA.push(M.worldOffset.clone()),KA.length<2){Mt&&(Mt.visible=!1);return}const n=Math.min(3,KA.length-1),e=KA.map(a=>new ct(a.x,a.y,a.z,1)),t=i1(e.length,n),A=new x_(n,t,e),i=Math.min(1024,64+KA.length*32),r=A.getPoints(i),s=new kt().setFromPoints(r);if(Mt)Mt.geometry.dispose(),Mt.geometry=s,Mt.visible=!0;else{const a=new Oo({color:65416,transparent:!0,opacity:.6,depthTest:!1});Mt=new ef(s,a),Mt.frustumCulled=!1,Mt.renderOrder=3,et.add(Mt)}Mt&&Mt.position.copy(M.worldOffset).multiplyScalar(-1)}function r1(n){KA.push(n.clone()),vf()}function s1(){KA.length=0,Mt&&(et.remove(Mt),Mt.geometry&&Mt.geometry.dispose(),Mt.material&&Mt.material.dispose(),Mt=null)}function a1(){return{qualityLevel:M.qualityLevel,pixelationFactor:M.pixelationFactor,timeScale:M.timeScale,crtEnabled:(Cr==null?void 0:Cr.checked)??!0,isAutopilot:M.isAutopilot,showTravelPath:M.showTravelPath,schwarzschildLensing:M.useSchwarzschildLensing}}function o1(n){if(n){if(n.qualityLevel&&Yn[n.qualityLevel]){M.qualityLevel=n.qualityLevel;const e=Yn[n.qualityLevel];lt.starCount=e.starCount,lt.clusterCount=e.clusterCount,lt.densityRes=e.densityRes||lt.densityRes,document.querySelectorAll(".q-btn").forEach(t=>{const A=t.getAttribute("data-q")===n.qualityLevel;t.classList.toggle("active",A)})}Number.isFinite(n.pixelationFactor)&&(M.pixelationFactor=n.pixelationFactor,ws&&(ws.value=M.pixelationFactor),Cs&&(Cs.innerText=M.pixelationFactor),Fs()),Number.isFinite(n.timeScale)&&(M.timeScale=n.timeScale,Pu&&(Pu.value=M.timeScale)),typeof n.crtEnabled=="boolean"&&Cr&&(Cr.checked=n.crtEnabled,n.crtEnabled?To.classList.add("crt-effects"):To.classList.remove("crt-effects")),typeof n.isAutopilot=="boolean"&&(M.isAutopilot=n.isAutopilot,xs&&(xs.checked=M.isAutopilot)),typeof n.showTravelPath=="boolean"&&(M.showTravelPath=n.showTravelPath,hs&&(hs.checked=M.showTravelPath),vf()),typeof n.schwarzschildLensing=="boolean"&&(M.useSchwarzschildLensing=n.schwarzschildLensing,fs&&(fs.checked=M.useSchwarzschildLensing),yt&&(yt.enabled=M.useSchwarzschildLensing))}}function l1(){switch(M.qualityLevel){case"ULTRA":return 4;case"HIGH":return 3;case"MED":return 2;case"LOW":default:return 1}}function c1(){Xe&&(Xe.visible=!0,Xe.userData.isCachedGalaxy=!0,Bt==null||Bt.add(Xe),vs.push(Xe),Xe=null,qe&&(et.remove(qe),qe.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),qe=null),$e==null||$e.clear(),_m())}function _m(n=l1()){for(;vs.length>n;){const e=vs.shift();e&&(Bt==null||Bt.remove(e),e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose())}}function u1(n){Bt&&Bt.position.sub(n)}function f1(){if($e)if(M.viewLevel===2){const n=Math.min(1,dt.SYSTEM/dt.GALAXY);$e.scale.setScalar(n)}else $e.scale.setScalar(1)}function h1(n){if(!qe||!n)return null;let e=null,t=1/0;return qe.children.forEach(A=>{var s;if(!((s=A==null?void 0:A.userData)!=null&&s.isNebula))return;const i=A.userData.radius||0,r=n.distanceTo(A.position);r<i*.8&&r<t&&(e=A,t=r)}),e}function d1(n){var t;let e=n;for(;e&&!((t=e.userData)!=null&&t.isNebula);)e=e.parent;return e}let yt,Fo;const gi=4,dA={uBHCount:{value:0},uBHPos:{value:Array.from({length:gi},()=>new Ue)},uBHMass:{value:new Array(gi).fill(0)},uBHRadius:{value:new Array(gi).fill(0)}};let Br=[];const KA=[];let Mt=null,nn=[],vr=[],M={universeSimTime:13.8,galaxySimTime:0,isPaused:!1,timeScale:.1,viewLevel:0,isTransitioning:!1,transitionTarget:new I,transitionData:null,transitionProgress:0,nextLevel:0,worldOffset:new I(0,0,0),currentGalaxyType:0,qualityLevel:"HIGH",pixelationFactor:1,selectedTarget:null,activeGalaxyData:null,activeSystemData:null,activeNebula:null,isAutopilot:!0,autopilotTimer:0,autopilotNextAction:2,visitedSystemsCount:0,lastGalaxyVisitTime:0,autopilotZooming:!1,autopilotPanelHidden:!1,autopilotPriorityTargets:[],planetTourIndex:0,trackingTarget:null,inspectingTarget:null,inspectingTargetPreviousPos:null,bigBangFlash:0,showTravelPath:!0,useSchwarzschildLensing:!0};const hc=document.getElementById("c-x"),dc=document.getElementById("c-y"),pc=document.getElementById("c-z"),op=document.getElementById("time"),p1=document.getElementById("fps"),g1=document.getElementById("objects"),m1=document.getElementById("seed-disp");let Du=document.getElementById("pause-btn"),vn=document.getElementById("back-btn");const Pu=document.getElementById("timestep-slider"),el=document.getElementById("alert-box"),gc=document.getElementById("alert-title"),wr=document.getElementById("alert-msg");document.getElementById("alert-dismiss");document.getElementById("config-btn");const Hu=document.getElementById("config-modal"),B1=document.getElementById("config-close"),ws=document.getElementById("retro-slider"),Cs=document.getElementById("retro-val"),Cr=document.getElementById("crt-toggle"),fs=document.getElementById("bh-lens-toggle"),xs=document.getElementById("autopilot-toggle"),hs=document.getElementById("path-toggle"),To=document.getElementById("crt-overlay");let Io=document.getElementById("status-toggle-btn");document.getElementById("sim-toggle-btn");const Qo=document.getElementById("stats-panel"),Lo=document.getElementById("controls-panel"),v1=document.getElementById("stats-close"),w1=document.getElementById("sim-close"),Em=document.getElementById("loc-btn"),QA=document.getElementById("target-panel"),C1=document.getElementById("target-close"),x1=document.getElementById("target-title"),_1=document.getElementById("t-name"),Ha=document.getElementById("t-type"),E1=document.getElementById("t-age"),lp=document.getElementById("t-mass"),cp=document.getElementById("t-rad"),up=document.getElementById("t-lum"),fp=document.getElementById("spectrograph"),y1=document.getElementById("t-composition"),U1=document.getElementById("warp-btn"),ir=document.getElementById("mouse-cursor");let mc=0,hp=0,jA=null;Tm();function ym(){const n=document.getElementById("VRButton");n&&n.remove();const e=document.getElementById("vr-button-container"),t=document.createElement("button");if(t.id="VRButton",t.style.width="100%",t.textContent="VR...",t.disabled=!0,(e||document.body).appendChild(t),!(Ae!=null&&Ae.xr)||!(navigator!=null&&navigator.xr)){t.style.display="none";return}const A={optionalFeatures:["local-floor","bounded-floor"]};let i=null;const r=()=>{t.textContent=i?"EXIT VR":"ENTER VR"},s=()=>{i&&(i.removeEventListener("end",s),i=null,r())};t.onclick=async()=>{if(i){try{await i.end()}catch{}return}try{Ae.xr.setReferenceSpaceType("local-floor")}catch{}try{i=await navigator.xr.requestSession("immersive-vr",A),i.addEventListener("end",s),await Ae.xr.setSession(i),r()}catch(a){console.warn("WebXR session start failed:",a),i=null,t.textContent="VR FAILED",setTimeout(r,1500)}},navigator.xr.isSessionSupported("immersive-vr").then(a=>{if(!a){t.style.display="none";return}t.disabled=!1,r()}).catch(()=>{t.style.display="none"})}function S1(n){let A=1.6/Math.max(.25,Math.min(4,n||1));return A=Math.max(.45,Math.min(1.55,A)),{width:1.6,height:A}}function Um(n){if(!(F!=null&&F.mesh)||F.planeAspect&&Math.abs(F.planeAspect-n)<.01)return;F.planeAspect=n;const{width:e,height:t}=S1(n);try{F.mesh.geometry.dispose()}catch{}if(F.mesh.geometry=new jn(e,t),F.bgMesh){try{F.bgMesh.geometry.dispose()}catch{}F.bgMesh.geometry=new jn(e*1.02,t*1.02)}if(F.border){const i=[new I(-e/2,-t/2,.002),new I(e/2,-t/2,.002),new I(e/2,t/2,.002),new I(-e/2,t/2,.002),new I(-e/2,-t/2,.002)];try{F.border.geometry.dispose()}catch{}F.border.geometry=new kt().setFromPoints(i)}}function Ro(n){F!=null&&F.anchor&&(F.visible=n,F.anchor.visible=n,n?(F.needsCapture=!0,F.lastCaptureMs=0,(F.controllers||[]).forEach(e=>{e!=null&&e.line&&(e.line.visible=!0)})):(F.reticle&&(F.reticle.visible=!1),(F.controllers||[]).forEach(e=>{var t,A;e!=null&&e.line&&(e.line.visible=!1),(A=(t=e==null?void 0:e.controller)==null?void 0:t.userData)!=null&&A.vrUi&&(e.controller.userData.vrUi.hoverEl=null,e.controller.userData.vrUi.activeEl=null,e.controller.userData.vrUi.clickTarget=null,e.controller.userData.vrUi.draggingRange=null,e.controller.userData.vrUi.pressed=!1)})))}function Sm(n="VR UI"){if(!(F!=null&&F.canvas))return;const e=F.canvas.getContext("2d");if(!e)return;const t=F.canvas.width||1,A=F.canvas.height||1;e.clearRect(0,0,t,A),e.fillStyle="rgba(0, 15, 0, 0.92)",e.fillRect(0,0,t,A),e.strokeStyle="rgba(0, 255, 0, 0.85)";const i=Math.max(2,Math.floor(Math.min(t,A)/220));e.lineWidth=i,e.strokeRect(i/2,i/2,t-i,A-i),e.fillStyle="rgba(0, 255, 0, 0.95)";const r=Math.max(18,Math.floor(Math.min(t,A)/14)),s=Math.max(12,Math.floor(r*.55));e.font=`${r}px monospace`,e.fillText(n,i*2,i*2+r),e.font=`${s}px monospace`,e.fillText("waiting for capture…",i*2,i*2+r+s+6),e.fillText(new Date().toLocaleTimeString(),i*2,i*2+r+(s+6)*2),F.texture&&(F.texture.needsUpdate=!0)}function M1(n){let e=n;for(let t=0;t<6&&e;t++){if(e instanceof HTMLInputElement){if(e.type==="range")return{kind:"range",el:e};if(e.type==="checkbox"||e.type==="button")return{kind:"click",el:e}}if(e instanceof HTMLButtonElement)return{kind:"click",el:e};if(e instanceof HTMLLabelElement)return{kind:"click",el:e};if(e.classList&&e.classList.contains("panel-close"))return{kind:"click",el:e};e=e.parentElement}return n?{kind:"click",el:n}:null}function wf(n,e,t=!1){if(!n)return;const A=n.getBoundingClientRect();if(!A||A.width<=0)return;const i=Number(n.min||0),r=Number(n.max||1),s=Number(n.step||0);let a=(e-A.left)/A.width;a=Math.max(0,Math.min(1,a));let o=i+a*(r-i);Number.isFinite(s)&&s>0&&(o=Math.round(o/s)*s);const l=n.value;n.value=String(o),l!==n.value&&n.dispatchEvent(new Event("input",{bubbles:!0})),t&&n.dispatchEvent(new Event("change",{bubbles:!0}))}function tl(){if(!(!F||!Ae||!et)){F.controllers&&F.controllers.length&&F.controllers.forEach(({controller:n})=>{if(n){try{n.removeEventListener("selectstart",dp)}catch{}try{n.removeEventListener("selectend",pp)}catch{}try{et.remove(n)}catch{}}}),F.controllers=[];for(let n=0;n<2;n++){const e=Ae.xr.getController(n);e.userData.vrUi={index:n,pointerId:9e3+n,pressed:!1,hoverEl:null,activeEl:null,clickTarget:null,draggingRange:null,clientX:0,clientY:0},e.addEventListener("selectstart",dp),e.addEventListener("selectend",pp);const t=new kt().setFromPoints([new I(0,0,0),new I(0,0,-1)]),A=new Oo({color:65280,transparent:!0,opacity:.8}),i=new ef(t,A);i.name="vr-ui-ray",i.visible=!1,i.renderOrder=998,i.scale.z=2,e.add(i),et.add(e),F.controllers.push({controller:e,line:i})}}}function Cf(){var A;const n=document.getElementById("ui-layer");if(!n||!et)return;if(F||(F={}),F.uiLayer=n,!F.captureHost){let i=document.getElementById("vr-ui-capture-host");i||(i=document.createElement("div"),i.id="vr-ui-capture-host",i.setAttribute("aria-hidden","true"),i.style.position="fixed",i.style.left="0",i.style.top="200vh",i.style.width="1px",i.style.height="1px",i.style.overflow="hidden",i.style.pointerEvents="none",i.style.opacity="0",i.style.zIndex="-1",document.body.appendChild(i)),F.captureHost=i,F.captureLayer=null}if(F.maxCaptureDim=2048,F.captureIntervalMs=500,F.captureInFlight=!1,F.needsCapture=!0,typeof F.dirtyCounter!="number"&&(F.dirtyCounter=0),typeof F.forceCapture!="boolean"&&(F.forceCapture=!1),F.lastCaptureMs=0,F.visible=!1,F.canvas||(F.canvas=document.createElement("canvas"),F.canvas.width=512,F.canvas.height=256),!F.texture){F.texture=new t_(F.canvas),F.texture.minFilter=Jt,F.texture.magFilter=Jt,F.texture.generateMipmaps=!1;try{(A=Ae==null?void 0:Ae.capabilities)!=null&&A.getMaxAnisotropy&&(F.texture.anisotropy=Math.max(1,Ae.capabilities.getMaxAnisotropy()))}catch{}F.texture.colorSpace=zA}if(Sm("VR UI"),F.material?F.material.map=F.texture:(F.material=new mi({map:F.texture,transparent:!0}),F.material.depthTest=!1,F.material.depthWrite=!1,F.material.side=UA),F.anchor)try{et.remove(F.anchor)}catch{}F.anchor=new tn,F.anchor.visible=!1,F.anchor.name="vr-ui-anchor",et.add(F.anchor),F.planeAspect=null;const e=window.innerWidth/window.innerHeight;F.mesh=new xt(new jn(1,1),F.material),F.mesh.name="vr-ui-plane",F.mesh.frustumCulled=!1,F.mesh.renderOrder=999,F.mesh.rotation.x=-.07,F.anchor.add(F.mesh),F.bgMaterial||(F.bgMaterial=new mi({color:6656,transparent:!0,opacity:.25}),F.bgMaterial.depthTest=!1,F.bgMaterial.depthWrite=!1,F.bgMaterial.side=UA),F.bgMesh=new xt(new jn(1,1),F.bgMaterial),F.bgMesh.name="vr-ui-backdrop",F.bgMesh.frustumCulled=!1,F.bgMesh.renderOrder=998,F.bgMesh.position.z=-.003,F.mesh.add(F.bgMesh),F.borderMaterial||(F.borderMaterial=new Oo({color:65280,transparent:!0,opacity:.6}),F.borderMaterial.depthTest=!1,F.borderMaterial.depthWrite=!1),F.border=new ef(new kt,F.borderMaterial),F.border.name="vr-ui-border",F.border.renderOrder=1e3,F.mesh.add(F.border),Um(e);const t=new mi({color:65280,transparent:!0,opacity:.9});t.depthTest=!1,t.depthWrite=!1,F.reticle=new xt(new Go(.008,.012,32),t),F.reticle.name="vr-ui-reticle",F.reticle.visible=!1,F.reticle.position.z=.001,F.reticle.renderOrder=1e3,F.mesh.add(F.reticle),F.mutationObserver&&F.mutationObserver.disconnect(),F.mutationObserver=new MutationObserver(()=>{F&&(F.needsCapture=!0,F.dirtyCounter=(F.dirtyCounter||0)+1)}),F.mutationObserver.observe(n,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),tl()}async function xf(){var o;if(!(F!=null&&F.uiLayer)||!(F!=null&&F.texture)||!F.visible||F.captureInFlight)return;const n=F.uiLayer.getBoundingClientRect();if(!n||n.width<2||n.height<2)return;F.captureInFlight=!0;const e=F.maxCaptureDim||1024,t=Math.min(2,e/Math.max(n.width,n.height)),A=Math.max(2,Math.round(n.width*t)),i=Math.max(2,Math.round(n.height*t));F.canvas&&(F.canvas.width!==A&&(F.canvas.width=A),F.canvas.height!==i&&(F.canvas.height=i));const r=F.dirtyCounter||0,s=!!F.forceCapture;F.forceCapture=!1;let a=F.uiLayer;try{const l=await KM(a,{backgroundColor:"rgba(0, 15, 0, 0.92)",logging:!1,scale:t,useCORS:!0,removeContainer:!0,width:n.width,height:n.height,x:n.left,y:n.top,windowWidth:document.documentElement.clientWidth,windowHeight:document.documentElement.clientHeight,ignoreElements:c=>{try{const u=c&&c.tagName?c.tagName.toLowerCase():"";if(u==="canvas"||u==="video"||u==="iframe"||c&&(c.id==="mouse-cursor"||c.id==="crt-overlay"||c.id==="canvas-container"))return!0}catch{}return!1},onclone:c=>{try{const u=c.getElementById("canvas-container");u&&(u.style.display="none");const f=c.getElementById("crt-overlay");f&&(f.style.display="none");const p=c.getElementById("mouse-cursor");p&&(p.style.display="none"),c.documentElement.style.background="transparent",c.body.style.background="transparent",c.querySelectorAll("canvas, video, iframe").forEach(g=>{try{g.style.display="none"}catch{}})}catch{}}});if(l&&F.canvas){const c=F.canvas.getContext("2d");c&&(c.clearRect(0,0,F.canvas.width,F.canvas.height),c.drawImage(l,0,0,F.canvas.width,F.canvas.height),c.fillStyle="rgba(0, 255, 0, 1)",c.font="20px monospace",c.fillText(`T: ${Date.now()%1e5}`,10,30))}if(console.log("VR UI capture:",{resultCanvas:l?`${l.width}x${l.height}`:"null",ourCanvas:F.canvas?`${F.canvas.width}x${F.canvas.height}`:"null",rect:`${n.width}x${n.height}`}),F.texture.image=F.canvas,F.texture.needsUpdate=!0,(o=Ae==null?void 0:Ae.xr)!=null&&o.isPresenting&&Ae.properties)try{const c=Ae.properties.get(F.texture);if(c&&c.__webglTexture){const u=Ae.getContext();u.bindTexture(u.TEXTURE_2D,c.__webglTexture),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,F.canvas),u.bindTexture(u.TEXTURE_2D,null)}}catch(c){console.warn("Direct texture upload failed:",c)}F.sourceRect=n,F.canvasWidth=F.canvas.width,F.canvasHeight=F.canvas.height,Um(F.canvasWidth/F.canvasHeight)}catch(l){console.warn("VR UI capture failed:",l),Sm("CAPTURE FAILED")}finally{F.captureInFlight=!1;const l=F.dirtyCounter||0;F.needsCapture=l!==r,s&&F.needsCapture&&(F.forceCapture=!0),F.lastCaptureMs=performance.now()}}function Mm(n){var r;if(!(F!=null&&F.visible)||!((r=Ae==null?void 0:Ae.xr)!=null&&r.isPresenting)||!et||!Te)return;n-(F.lastCaptureMs||0)>=200&&(F.needsCapture=!0);const t=Ae.xr.getCamera(Te);Ar.setFromMatrixPosition(t.matrixWorld),Yr.extractRotation(t.matrixWorld),ip.set(0,0,-1).applyMatrix4(Yr),F.anchor.position.copy(Ar).add(ip.multiplyScalar(1.15)),F.anchor.quaternion.setFromRotationMatrix(Yr),F.anchor.position.y-=.12;let A=!1;(F.controllers||[]).forEach(({controller:s,line:a})=>{if(!s||!a)return;const o=s.userData.vrUi;if(!o)return;Yr.identity().extractRotation(s.matrixWorld),Ra.ray.origin.setFromMatrixPosition(s.matrixWorld),Ra.ray.direction.set(0,0,-1).applyMatrix4(Yr).normalize(),Ra.far=10;const l=F.mesh?Ra.intersectObject(F.mesh,!1):[];if(l.length>0){const c=l[0];A=!0,a.scale.z=Math.max(.15,c.distance);const u=c.uv;if(u&&F.canvasWidth&&F.canvasHeight){const f=F.uiLayer.getBoundingClientRect(),p=u.x*F.canvasWidth,g=(1-u.y)*F.canvasHeight,m=f.left+p/F.canvasWidth*f.width,d=f.top+g/F.canvasHeight*f.height;o.clientX=m,o.clientY=d;let h=document.elementFromPoint(m,d);(!h||!F.uiLayer.contains(h))&&(h=null),o.hoverEl=h,o.pressed&&o.draggingRange&&(wf(o.draggingRange,m,!1),F.needsCapture=!0)}F.reticle&&(Ar.copy(c.point),F.mesh.worldToLocal(Ar),F.reticle.position.set(Ar.x,Ar.y,.001))}else a.scale.z=2,o.hoverEl=null}),F.reticle&&(F.reticle.visible=A);const i=n-(F.lastCaptureMs||0)>=(F.captureIntervalMs||250);!F.captureInFlight&&(F.forceCapture||F.needsCapture&&i)&&xf()}function dp(n){var i;if(!(F!=null&&F.visible))return;const e=n.target,t=(i=e==null?void 0:e.userData)==null?void 0:i.vrUi;if(!t)return;t.pressed=!0,t.activeEl=t.hoverEl;const A=M1(t.activeEl);A&&(A.kind==="range"?(t.draggingRange=A.el,wf(A.el,t.clientX,!1),F&&(F.needsCapture=!0,F.dirtyCounter=(F.dirtyCounter||0)+1)):t.clickTarget=A.el)}function pp(n){var A;const e=n.target,t=(A=e==null?void 0:e.userData)==null?void 0:A.vrUi;if(t){if(t.draggingRange)wf(t.draggingRange,t.clientX,!0),t.draggingRange=null,F&&(F.needsCapture=!0,F.forceCapture=!0,F.dirtyCounter=(F.dirtyCounter||0)+1);else if(t.clickTarget){try{t.clickTarget.click()}catch{}t.clickTarget=null,F&&(F.needsCapture=!0,F.forceCapture=!0,F.dirtyCounter=(F.dirtyCounter||0)+1)}t.pressed=!1,t.activeEl=null}}function bm(){var A;LA=new h_(Ae);const n=new d_(et,Te);LA.addPass(n);const e={uniforms:{tDiffuse:{value:null},uBHCount:dA.uBHCount,uBHPos:dA.uBHPos,uBHMass:dA.uBHMass,uBHRadius:dA.uBHRadius,uAspect:{value:window.innerWidth/Math.max(1,window.innerHeight)}},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform sampler2D tDiffuse;
            uniform int uBHCount;
            uniform vec2 uBHPos[${gi}];
            uniform float uBHMass[${gi}];
            uniform float uBHRadius[${gi}];
            uniform float uAspect;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float shadowMask = 0.0;
                for(int i = 0; i < ${gi}; i++) {
                    if (i >= uBHCount) break;
                    vec2 o = uBHPos[i] - uv;
                    o.x *= uAspect;
                    float dist = length(o);
                    float bhRad = max(uBHRadius[i], 0.00025);
                    float inner = max(bhRad * 0.6, 0.001);
                    float outer = max(bhRad * 14.0, 0.02);
                    float influence = smoothstep(outer, inner, dist);
                    float safeDist = max(dist, inner);
                    vec2 dir = o / safeDist;
                    dir.x /= uAspect;
                    float strength = (0.1 + uBHMass[i] * 0.02) * influence;
                    totalOffset += dir * (strength / (safeDist * safeDist + 0.0001));
                    float shadow = 1.0 - smoothstep(inner * 0.6, inner, dist);
                    shadowMask = max(shadowMask, shadow);
                }
                float offsetLen = length(totalOffset);
                if (offsetLen > 0.25) {
                    totalOffset *= 0.25 / offsetLen;
                }
                vec2 warped = clamp(uv + totalOffset, vec2(0.001), vec2(0.999));
                vec4 col = texture2D(tDiffuse, warped);
                col.rgb = mix(col.rgb, vec3(0.0), clamp(shadowMask, 0.0, 1.0));
                gl_FragColor = col;
            }
        `};yt=new Au(e),(A=yt==null?void 0:yt.material)!=null&&A.uniforms&&(yt.material.uniforms.uBHCount=dA.uBHCount,yt.material.uniforms.uBHPos=dA.uBHPos,yt.material.uniforms.uBHMass=dA.uBHMass,yt.material.uniforms.uBHRadius=dA.uBHRadius),yt.enabled=M.useSchwarzschildLensing,LA.addPass(yt);const t={uniforms:{tDiffuse:{value:null},curvature:{value:new Ue(3,3)},uFlash:{value:0}},vertexShader:`
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
        `};Fo=new Au(t),LA.addPass(Fo)}function b1(n="unknown"){var a,o,l,c;const e=document.getElementById("canvas-container");if(!e||!et||!Te)return;const t=Te.position.clone(),A=Te.quaternion.clone(),i=((o=(a=Ce==null?void 0:Ce.target)==null?void 0:a.clone)==null?void 0:o.call(a))||new I,r=(Ce==null?void 0:Ce.enabled)??!0;IA.clear(),xi=!1,zn=!1,_A=null,Nn=!1;try{(l=Ce==null?void 0:Ce.dispose)==null||l.call(Ce)}catch{}const s=Ae==null?void 0:Ae.domElement;if(s){try{const u=s.getContext("webgl2")||s.getContext("webgl"),f=u&&u.getExtension("WEBGL_lose_context");f&&f.loseContext()}catch{}try{e.removeChild(s)}catch{}}try{(c=Ae==null?void 0:Ae.dispose)==null||c.call(Ae)}catch{}try{Ae=new jc({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),Ae.xr.enabled=!0}catch(u){console.error("Graphics rebuild failed:",n,u);return}e.appendChild(Ae.domElement),ym(),Fm(),tl(),Ce=new tg(Te,Ae.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,Ce.enabled=r,Ce.target.copy(i),Te.position.copy(t),Te.quaternion.copy(A),xr(M.viewLevel),Ce.update(),bm(),Fs();try{Ae.compile(et,Te)}catch{}Ae.setAnimationLoop(Vm),Im()}function Fm(){Ae.xr.addEventListener("sessionstart",()=>{try{Ae.resetState()}catch{}Te&&Ce?(CA={pos:Te.position.clone(),quat:Te.quaternion.clone(),target:Ce.target.clone(),fov:Te.fov,near:Te.near,far:Te.far,zoom:Te.zoom,controlsEnabled:Ce.enabled,controlsAutoRotate:Ce.autoRotate},Ce.enabled=!1,Ce.autoRotate=!1):CA=null;try{!(F!=null&&F.anchor)||!(F!=null&&F.mesh)?Cf():tl(),Ro(!0),xf(),Mm(performance.now())}catch(n){console.warn("VR UI init failed:",n)}Bf.getDelta()}),Ae.xr.addEventListener("sessionend",()=>{var e;try{Ro(!1)}catch{}const n=Ae;try{Ae.setRenderTarget(null),Ae.resetState()}catch{}try{(e=LA==null?void 0:LA.reset)==null||e.call(LA)}catch{}CA&&Te&&Ce&&(Te.position.copy(CA.pos),Te.quaternion.copy(CA.quat),Te.fov=CA.fov,Te.near=CA.near,Te.far=CA.far,Te.zoom=CA.zoom,Te.updateProjectionMatrix(),Te.updateMatrixWorld(!0),Ce.target.copy(CA.target),Ce.enabled=CA.controlsEnabled,Ce.autoRotate=CA.controlsAutoRotate,Ce.update()),CA=null,eo=3;try{Ae.clear(!0,!0,!0),Ae.render(et,Te)}catch{}setTimeout(()=>{Ae===n&&b1("xr sessionend")},50)})}function Tm(){if(IA.clear(),xi=!1,zn=!1,_A=null,Nn=!1,M.pixelationFactor=Math.max(1,Math.floor(window.innerWidth/750)),ws&&(ws.value=M.pixelationFactor),Cs&&(Cs.innerText=M.pixelationFactor),jA!=null&&jA.qualityLevel&&Yn[jA.qualityLevel]){const e=Yn[jA.qualityLevel];M.qualityLevel=jA.qualityLevel,lt.starCount=e.starCount,lt.clusterCount=e.clusterCount,lt.densityRes=e.densityRes||lt.densityRes}const n=document.getElementById("canvas-container");for(;n.firstChild;){if(n.firstChild.tagName==="CANVAS")try{const e=n.firstChild.getContext("webgl2")||n.firstChild.getContext("webgl");e&&e.getExtension("WEBGL_lose_context")&&e.getExtension("WEBGL_lose_context").loseContext()}catch{}n.removeChild(n.firstChild)}Ae&&(Ae.dispose(),Ae=null);try{const e=document.createElement("canvas"),t=e.getContext("webgl2",{antialias:!1,powerPreference:"high-performance"}),A={antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0};t?(Ae=new jc({...A,canvas:e,context:t}),console.log("[Universes] WebGL2 active (volume renderer enabled).")):(Ae=new jc(A),console.warn("[Universes] WebGL2 unavailable, falling back to mote renderer.")),Ae.xr.enabled=!0}catch(e){console.error("Critical: WebGL Renderer could not be initialized.",e);return}n.appendChild(Ae.domElement),ym(),Fm(),et=new $x,et.background=new ze(0),et.fog=new $u(0,1e-9),Te=new EA(55,window.innerWidth/window.innerHeight,1,1e12),Ce=new tg(Te,Ae.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,bm(),Fs(),qA=new eg,$a=new Ue,je=new tn,je.visible=!1,et.add(je),$e=new tn,et.add($e),Bt=new tn,et.add(Bt),Cf(),Pu.value=M.timeScale,Ou(lt.seed),M.universeSimTime=0,M.bigBangFlash=1,xr(0),Qo.style.display="none",Lo.style.display="none";try{Ae.compile(et,Te)}catch{}Ae.setAnimationLoop(Vm),window.removeEventListener("resize",gp),window.addEventListener("resize",gp),Im(),jA&&(o1(jA),jA=null)}function Im(){Qa&&document.removeEventListener("mousemove",Qa),Qa=i=>{ir&&(ir.style.transform=`translate(${i.clientX}px, ${i.clientY}px)`),!Nn&&cc.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Nn=!0)},document.addEventListener("mousemove",Qa),La&&document.body.removeEventListener("mouseover",La),La=i=>{i.target.matches("button, input, .panel-close, label, a, .clickable")?(ir.classList.add("active"),ir.innerHTML="&#8629;"):(ir.classList.remove("active"),ir.innerHTML="")},document.body.addEventListener("mouseover",La),Ae.domElement.addEventListener("pointerdown",i=>{IA.add(i.pointerId),xi=xi||IA.size>1,zn=!0,_A=i.pointerId,Nn=IA.size>1,cc.set(i.clientX,i.clientY),M.inspectingTarget||(M.trackingTarget=null)}),Ae.domElement.addEventListener("pointermove",i=>{zn&&(_A!==null&&i.pointerId!==_A||!Nn&&cc.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Nn=!0))}),Ae.domElement.addEventListener("pointercancel",i=>{IA.delete(i.pointerId),_A===i.pointerId&&(_A=null),IA.size===0?(zn=!1,_A=null,xi=!1):(zn=!0,_A===null&&(_A=IA.values().next().value))}),Ae.domElement.addEventListener("pointerup",O1);const n=(i,r)=>{const s=document.getElementById(i);if(!s)return;const a=s.cloneNode(!0);return s.parentNode.replaceChild(a,s),a.addEventListener("click",r),a};n("reset-btn",()=>void Ou(Math.floor(Math.random()*1e4))),n("bang-btn",()=>{jA=a1(),Tm()}),Du=n("pause-btn",()=>{M.isPaused=!M.isPaused,Du.textContent=M.isPaused?"RESUME SIM":"PAUSE SIM",M.isPaused||Bf.getDelta()}),vn=n("back-btn",()=>{if(M.inspectingTarget){M.inspectingTarget=null,M.inspectingTargetPreviousPos=null,Ce.target.set(0,0,0),vn.textContent="BACK TO GALAXY";return}Qm()}),n("alert-dismiss",()=>{el.style.display="none",M.isTransitioning&&Lm()});const e=[Qo,Lo,Hu,QA],t=i=>{window.innerWidth<=768&&e.forEach(r=>{r!==i&&(r.style.display="none")})},A=(i,r)=>{const s=document.getElementById(i),a=document.getElementById(r);if(!s||!a)return;const o=s.cloneNode(!0);return s.parentNode.replaceChild(o,s),o.addEventListener("click",()=>{const l=a.style.display!=="flex";l&&t(a),a.style.display=l?"flex":"none"}),o};Io=A("status-toggle-btn","stats-panel")||Io,A("sim-toggle-btn","controls-panel"),A("config-btn","config-modal"),v1.onclick=()=>Qo.style.display="none",w1.onclick=()=>Lo.style.display="none",B1.onclick=()=>Hu.style.display="none",C1.onclick=()=>{QA.style.display="none",M.selectedTarget=null,M.isAutopilot&&(M.autopilotPanelHidden=!0)},n("loc-btn",()=>{if(M.autopilotPanelHidden=!1,QA.style.display==="flex"){QA.style.display="none";return}t(QA);let i=null;if(M.viewLevel===0)i={designation:`UNIVERSE 0x${lt.seed.toString(16).toUpperCase()}`,type:"COSMIC WEB",age:M.universeSimTime.toFixed(2),mass:`${lt.starCount.toLocaleString()} OBJECTS`,radius:`${(dt.UNIVERSE/1e6).toFixed(1)} MLY`,lum:"N/A",composition:`SEED: 0x${lt.seed.toString(16).toUpperCase()}
OBJECTS: ${lt.starCount.toLocaleString()}`};else if(M.viewLevel===1)i=M.activeGalaxyData;else if(M.viewLevel===2)if(M.inspectingTarget&&M.inspectingTarget.userData&&M.inspectingTarget.userData.type){const r=M.inspectingTarget;i={designation:r.userData.designation||"UNKNOWN",type:r.userData.type||"UNKNOWN",age:M.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:r.userData.composition||"ANALYZING..."}}else i=M.activeSystemData;i&&yA(i,!0)}),U1.onclick=()=>{M.selectedTarget&&(QA.style.display="none",M.selectedTarget.level===0?_i(M.selectedTarget.position,1):M.selectedTarget.level===1?_i(M.selectedTarget.position,2):M.selectedTarget.level===2&&(M.inspectingTarget=M.selectedTarget.object,M.trackingTarget=null,M.inspectingTargetPreviousPos=M.inspectingTarget.position.clone(),Ce.target.copy(M.inspectingTarget.position),vn.textContent="LEAVE ORBIT"))},document.querySelectorAll(".q-btn").forEach(i=>{const r=i.cloneNode(!0);i.parentNode.replaceChild(r,i),r.addEventListener("click",s=>{document.querySelectorAll(".q-btn").forEach(l=>l.classList.remove("active")),s.target.classList.add("active");const a=s.target.getAttribute("data-q"),o=Yn[a];o&&(M.qualityLevel=a,lt.starCount=o.starCount,lt.clusterCount=o.clusterCount,lt.densityRes=o.densityRes||lt.densityRes,_m(),M.viewLevel===0?Ou(lt.seed):M.viewLevel===1&&Gm(M.currentGalaxyType))})}),ws.oninput=i=>{M.pixelationFactor=parseInt(i.target.value),Cs.innerText=M.pixelationFactor,Fs()},Cr.onchange=i=>i.target.checked?To.classList.add("crt-effects"):To.classList.remove("crt-effects"),fs&&(fs.checked=M.useSchwarzschildLensing,fs.onchange=i=>{M.useSchwarzschildLensing=i.target.checked,yt&&(yt.enabled=M.useSchwarzschildLensing)}),xs.onchange=i=>{M.isAutopilot=i.target.checked,M.isAutopilot&&(M.autopilotNextAction=0,M.inspectingTarget=null,M.autopilotPanelHidden=!1),M.isAutopilot&&M.viewLevel===1&&M.autopilotPriorityTargets.length===0&&xm()},hs&&(M.showTravelPath=hs.checked,hs.onchange=i=>{M.showTravelPath=i.target.checked,vf()}),document.getElementById("timestep-slider").oninput=i=>M.timeScale=parseFloat(i.target.value)}function Fs(){var A,i,r;if(!Ae||!LA)return;Te&&(Te.aspect=window.innerWidth/window.innerHeight,Te.updateProjectionMatrix());const n=M.pixelationFactor===0?1:M.pixelationFactor*.8+1,e=Math.floor(window.innerWidth/n),t=Math.floor(window.innerHeight/n);Ae.setSize(e,t,!1),LA.setSize(e,t),Ae.domElement.style.width="100vw",Ae.domElement.style.height="100vh",mt&&(mt.material.uniforms.uPixelRatio.value=Ae.getPixelRatio(),mt.material.uniforms.uScreenHeight.value=t),Xe&&(Xe.material.uniforms.uPixelRatio.value=Ae.getPixelRatio(),Xe.material.uniforms.uScreenHeight.value=t),(A=Bt==null?void 0:Bt.children)!=null&&A.length&&Bt.children.forEach(s=>{var a,o;(o=(a=s==null?void 0:s.material)==null?void 0:a.uniforms)!=null&&o.uPixelRatio&&(s.material.uniforms.uPixelRatio.value=Ae.getPixelRatio(),s.material.uniforms.uScreenHeight.value=t)}),(r=(i=yt==null?void 0:yt.material)==null?void 0:i.uniforms)!=null&&r.uAspect&&(yt.material.uniforms.uAspect.value=e/Math.max(1,t))}function gp(){Fs()}function xr(n){n===0?(Ce.maxDistance=dt.UNIVERSE*2,Ce.minDistance=1e3,Ce.zoomSpeed=1,vn.disabled=!0,vn.textContent="RETURN TO ORBIT"):n===1?(Ce.maxDistance=dt.GALAXY*3,Ce.minDistance=100,Ce.zoomSpeed=2,vn.disabled=!1,vn.textContent="BACK TO UNIVERSE"):n===2&&(Ce.maxDistance=dt.SYSTEM*4,Ce.minDistance=10,Ce.zoomSpeed=3,vn.disabled=!1,vn.textContent="BACK TO GALAXY"),Te.updateProjectionMatrix()}function F1(){M.galaxySimTime=0,M.isPaused=!1,M.isTransitioning=!1,M.viewLevel=0,M.worldOffset.set(0,0,0),M.selectedTarget=null,M.activeGalaxyData=null,M.activeSystemData=null,M.autopilotPriorityTargets=[],M.lastGalaxyVisitTime=0,M.visitedSystemsCount=0,M.planetTourIndex=0,M.trackingTarget=null,M.inspectingTarget=null,M.inspectingTargetPreviousPos=null,M.bigBangFlash=0,nn=[],vr=[],Br=[],dA.uBHCount.value=0,Em.style.display="block",mt&&mt.position.set(0,0,0),Zt&&(Zt.visible=!0,Zt.scale.setScalar(Zt.userData.baseScale||1)),Xe&&(Xe.visible=!1),je&&(je.visible=!1),$e&&$e.clear(),s1(),M.showTravelPath&&KA.push(M.worldOffset.clone()),vs.forEach(n=>{n&&(Bt==null||Bt.remove(n),n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose())}),vs.length=0,Bt&&Bt.position.set(0,0,0),qe&&(et.remove(qe),qe.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),qe=null),Nu(),Jn.forEach(n=>{n&&(je==null||je.remove(n),n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose())}),Jn.length=0,us=0,Te.position.set(0,dt.UNIVERSE*.1,dt.UNIVERSE*.2),Ce.target.set(0,0,0),xr(0),Ce.autoRotate=!0,Ce.enabled=!0,Du.textContent="PAUSE SIM",el.style.display="none",QA.style.display="none"}function Qm(){M.isTransitioning||(QA.style.display="none",M.viewLevel===2?_i(new I(0,dt.GALAXY*.5,0),1,!0):M.viewLevel===1&&_i(new I(0,dt.UNIVERSE*.1,0),0,!0))}function _i(n,e,t=!1){if(!M.isTransitioning)if(M.isTransitioning=!0,M.transitionTarget.copy(n),M.transitionData=!t&&M.selectedTarget?M.selectedTarget.data:null,M.nextLevel=e,M.transitionProgress=0,Ce.enabled=!1,el.style.display="block",(!M.isAutopilot||t)&&(QA.style.display="none"),t)gc.innerText="LEAVING GRAVITY WELL",wr.innerText="ACCELERATING TO ESCAPE VELOCITY...";else{const A=Math.floor(Math.abs(n.x+n.y)).toString(16).toUpperCase();e===1?(gc.innerText="APPROACHING GALAXY",wr.innerText=`SECTOR ${A} :: HYPERDRIVE ENGAGED`):(gc.innerText="APPROACHING SYSTEM",wr.innerText=`STAR ${A} :: ORBITAL INSERTION`)}}function Lm(){var i,r,s;const n=M.nextLevel,e=M.viewLevel,t=M.worldOffset.clone();M.viewLevel=n,M.isTransitioning=!1,Ce.enabled=!0,el.style.display="none";const A=new I().copy(M.transitionTarget);if(Br=[],dA.uBHCount.value=0,n<e&&e===1&&n===0&&c1(),n<e&&(M.inspectingTarget=null,M.inspectingTargetPreviousPos=null,M.trackingTarget=null),Zt&&(Zt.visible=n<=2),n>e?M.transitionData?(n===1&&(M.activeGalaxyData=M.transitionData),n===2&&(M.activeSystemData=M.transitionData)):M.selectedTarget&&M.selectedTarget.data&&(n===1&&(M.activeGalaxyData=M.selectedTarget.data),n===2&&(M.activeSystemData=M.selectedTarget.data)):(n===1&&(M.activeSystemData=null),n===0&&(M.activeGalaxyData=null)),n===2&&n>e)if((r=(i=M.selectedTarget)==null?void 0:i.data)!=null&&r.isNebula)M.activeNebula=M.selectedTarget.data;else{const a=h1(A);M.activeNebula=((s=a==null?void 0:a.userData)==null?void 0:s.data)||null}else n!==2&&(M.activeNebula=null);if(Em.style.display="block",n>e&&(Te.position.sub(A),Ce.target.sub(A),mt&&mt.position.sub(A),Zt&&Zt.position.sub(A),n===2&&Xe&&Xe.position.sub(A),n===2&&$e&&$e.position.sub(A),n===2&&qe&&qe.position.sub(A),u1(A)),n===2&&(M.planetTourIndex=0),n===0)Xe&&(Xe.visible=!1),je&&(je.visible=!1),$e&&($e.visible=!1),qe&&(qe.visible=!1),Nu(),Jn.forEach(a=>{a&&(je==null||je.remove(a),a.geometry&&a.geometry.dispose(),a.material&&a.material.dispose())}),Jn.length=0,us=0,xr(0),wr.innerText="INTERGALACTIC SPACE";else if(n===1){if(je&&(je.visible=!1),!Xe||e===0){const a=M.universeSimTime;M.currentGalaxyType=a<3?2:a>10?1:0,Gm(M.currentGalaxyType)}if(Xe&&(Xe.visible=!0,n>e&&Xe.position.set(0,0,0)),$e&&($e.visible=!0,n>e&&$e.position.set(0,0,0)),$e.children.length>0&&Br.push($e.children[0]),qe&&(qe.visible=!0,n>e&&qe.position.set(0,0,0)),e===0&&xm(),n>e){if(M.isAutopilot){const a=dt.GALAXY*1.5,o=Math.random()*Math.PI*2,l=Math.random()*Math.PI*.5+.1;Te.position.set(a*Math.sin(l)*Math.cos(o),a*Math.cos(l),a*Math.sin(l)*Math.sin(o)),M.autopilotZooming=!0}else Te.position.set(0,dt.GALAXY*.8,dt.GALAXY*.4);Ce.target.set(0,0,0)}xr(1),wr.innerText="ARRIVED AT LOCAL GALAXY"}else if(n===2){if($e&&($e.visible=!0),qe&&(qe.visible=!1),P1(A),je&&(je.visible=!0,je.position.set(0,0,0)),$e&&$e.children.length>0&&Br.push($e.children[0]),Nu(),M.activeNebula){const a=dt.SYSTEM*4,o=Math.floor(Math.random()*1e5),l=new ze(.3,.75,.9),c=14+Math.floor(Math.random()*8);Gt=Om({seed:o,radius:a,tint:l,chunkCount:c}),Gt&&(Gt.userData.radius=a,Gt.userData.velocity=new I,Gt.position.set(0,0,0),Gt.visible=!0,et.add(Gt))}if(M.isAutopilot){const a=dt.SYSTEM*1.5,o=Math.random()*Math.PI*2,l=Math.random()*Math.PI*.5+.1;Te.position.set(a*Math.sin(l)*Math.cos(o),a*Math.cos(l),a*Math.sin(l)*Math.sin(o)),M.autopilotZooming=!0,M.planetTourIndex=0}else Te.position.set(0,dt.SYSTEM*.4,dt.SYSTEM*.8);Ce.target.set(0,0,0),xr(2),wr.innerText="SYSTEM ORBIT STABLE"}M.isAutopilot&&n>0&&!M.autopilotPanelHidden&&(QA.style.display="flex",n===1&&M.activeGalaxyData&&yA(M.activeGalaxyData,!0),n===2&&M.activeSystemData&&yA(M.activeSystemData,!0)),n>e&&M.worldOffset.add(A),n>e&&(n===1||n===2)&&(M.showTravelPath&&KA.length===0&&KA.push(t),r1(M.worldOffset.clone())),Bt&&(Bt.visible=n===0),f1()}function T1(n,e,t){const A=t-e;if(A<.05)return{state:"PROTO",age:A,classObj:n};if(A<n.lifespan)return{state:"MAIN",age:A,classObj:n};if(A<n.lifespan*1.1)return{state:"GIANT",age:A,classObj:n};let i;if(n.id==="O"||n.id==="B")i=Math.random()>.5?"BH":"N";else if(n.id==="A"||n.id==="F"||n.id==="G")i="WD";else return{state:"MAIN",age:A,classObj:n};return{state:"REMNANT",age:A,classObj:ar.find(r=>r.id===i)}}function Rm(n,e){let t=n;const A=()=>{const o=Math.sin(t++)*1e4;return o-Math.floor(o)};let i,r,s;e?(i=70+A()*10,r=24+A()*4,s=100-(i+r)):(i=74+A()*5,r=23+A()*2,s=100-(i+r)),s<0&&(s=0);const a=["O","C","Ne","Fe","N","Si","Mg","S"][Math.floor(A()*8)];return`COMPOSITION:
H: ${i.toFixed(2)}% | He: ${r.toFixed(2)}% | Met: ${s.toFixed(2)}%
Trace: ${a}`}function Dm(n){let e=n;const t=()=>{const o=Math.sin(e++)*1e4;return o-Math.floor(o)};let A=ar[ar.length-2],i=0;const r=t();for(let o=0;o<ar.length-3;o++)if(i+=ar[o].prob,r<i){A=ar[o];break}const s=T1(A,t()*M.universeSimTime,M.universeSimTime),a=[];for(let o=0;o<10;o++)a.push({pos:t()*100,intensity:t()});return{designation:`HIP-${Math.floor(t()*1e5)}`,typeObj:s.classObj,state:s.state,age:s.age.toFixed(3),mass:s.classObj.mass,radius:s.classObj.rad,lum:s.classObj.lum,spectrum:a,composition:Rm(n,!0)}}function Pm(n,e){let t=n;const A=()=>{const r=Math.sin(t++)*1e4;return r-Math.floor(r)};let i="SPIRAL GALAXY";return e<3?A()>.3?i="IRREGULAR GALAXY":A()>.5?i="QUASAR (AGN)":i="PROTO-GALAXY":e>10&&(A()>.4?i="ELLIPTICAL GALAXY":i="LENTICULAR GALAXY"),{designation:`NGC-${Math.floor(A()*5e3)}`,type:i,age:e.toFixed(2),mass:(A()*50+10).toFixed(1)+" Billion",radius:(A()*50+20).toFixed(1)+" kly",lum:"HIGH",spectrum:[],composition:Rm(n,!1)}}function yA(n,e=!1){if(window.innerWidth<=768&&[Qo,Lo,Hu].forEach(s=>s.style.display="none"),x1.innerText=e?"CURRENT LOCATION":"TARGET ANALYSIS",_1.innerText=n.designation,E1.innerText=n.age+" Bn YR",n.typeObj){let s=`CLASS ${n.typeObj.id}`;n.state==="PROTO"?s+=" (PROTO-STAR)":n.state==="GIANT"?s+=" (RED GIANT)":n.state==="REMNANT"&&(s+=" (REMNANT)"),Ha.innerText=s,Ha.style.color=n.typeObj.id==="BH"?"#0f0":"#"+n.typeObj.color.toString(16).padStart(6,"0"),lp.innerText=n.mass+" M☉",cp.innerText=n.radius+" R☉",up.innerText=n.lum+" L☉"}else Ha.innerText=n.type,Ha.style.color="#0f0",lp.innerText=n.mass+" M☉",cp.innerText=n.radius,up.innerText="VAR";fp.innerHTML="";let t=0;for(let s=0;s<n.designation.length;s++)t+=n.designation.charCodeAt(s);const A=()=>{const s=Math.sin(t++)*1e4;return s-Math.floor(s)},i=["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0088ff","#ff00ff"],r=5+Math.floor(A()*8);for(let s=0;s<r;s++){const a=document.createElement("div");a.className="spec-line";const o=Math.floor(A()*95/5)*5;a.style.left=o+"%",a.style.backgroundColor=i[Math.floor(o/100*i.length)],fp.appendChild(a)}y1.innerText=n.composition||"ANALYZING...",e?document.getElementById("warp-btn").style.display="none":(document.getElementById("warp-btn").style.display="block",document.getElementById("warp-btn").innerText=M.viewLevel===2?"INSPECT ORBIT":"INITIATE HYPERDRIVE"),M.isAutopilot&&M.autopilotPanelHidden?QA.style.display="none":QA.style.display="flex"}function Hm(n,e,t,A){const i=new An(n,64,64),r=new mi({color:0});r.colorWrite=!1,r.depthWrite=!1,r.depthTest=!1,r.transparent=!0,r.opacity=0;const s=new xt(i,r);s.position.set(e,t,A),s.userData.isBlackHole=!0,s.userData.ehRadius=n;const a=new Go(n*1.5,n*8,128),o=new Vt({uniforms:{uTime:{value:0},uEHRadius:{value:n},uInnerRadius:{value:n*1.5},uOuterRadius:{value:n*8}},side:UA,transparent:!0,blending:XA,depthWrite:!1,vertexShader:`
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
            ${pi}
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
        `}),l=new xt(a,o);return l.rotation.x=Math.PI/2,s.add(l),s}function Nm(){Zt&&(et.remove(Zt),Zt.geometry&&Zt.geometry.dispose(),ja&&ja.dispose(),qa&&qa.dispose(),Zt=null,qa=null,ja=null)}function _f(){var e,t;if(!Ae)return!1;const n=(e=Ae.getContext)==null?void 0:e.call(Ae);return!!((t=Ae.capabilities)!=null&&t.isWebGL2||n&&typeof n.texImage3D=="function")}function I1({density:n,resolution:e,scale:t}){if(!_f()||!n||!e)return!1;Nm();const A=new Ju(n,e,e,e);A.format=Po,A.type=YA,A.minFilter=Jt,A.magFilter=Jt,A.wrapS=SA,A.wrapT=SA,A.wrapR=SA,A.unpackAlignment=1,A.needsUpdate=!0,qa=A;const i=new Vt({glslVersion:ro,uniforms:{uDensity:{value:A},uInvModelMatrix:{value:new ut},uStepSize:{value:1/e*2.2},uDensityScale:{value:.75},uTime:{value:0}},vertexShader:`
            out vec3 vLocalPos;
            void main() {
                vLocalPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            precision highp float;
            precision highp sampler3D;
            uniform sampler3D uDensity;
            uniform mat4 uInvModelMatrix;
            uniform float uStepSize;
            uniform float uDensityScale;
            uniform float uTime;
            in vec3 vLocalPos;
            out vec4 fragColor;

            vec2 intersectBox(vec3 rayOrigin, vec3 rayDir) {
                vec3 boundsMin = vec3(-0.5);
                vec3 boundsMax = vec3(0.5);
                vec3 invDir = 1.0 / rayDir;
                vec3 t0 = (boundsMin - rayOrigin) * invDir;
                vec3 t1 = (boundsMax - rayOrigin) * invDir;
                vec3 tmin = min(t0, t1);
                vec3 tmax = max(t0, t1);
                float tNear = max(max(tmin.x, tmin.y), tmin.z);
                float tFar = min(min(tmax.x, tmax.y), tmax.z);
                return vec2(tNear, tFar);
            }

            void main() {
                vec3 rayOrigin = (uInvModelMatrix * vec4(cameraPosition, 1.0)).xyz;
                vec3 rayDir = normalize(vLocalPos - rayOrigin);
                vec2 hit = intersectBox(rayOrigin, rayDir);
                if (hit.y <= hit.x) discard;

                float t = max(hit.x, 0.0);
                float tEnd = hit.y;
                vec3 color = vec3(0.0);
                float alpha = 0.0;

                for (int i = 0; i < 192; i++) {
                    if (t > tEnd || alpha > 0.97) break;
                    vec3 p = rayOrigin + rayDir * t;
                    vec3 texPos = p + vec3(0.5);
                    float d = texture(uDensity, texPos).r;
                    d = pow(d, 0.9);
                    d = clamp(d * 1.15, 0.0, 1.0);
                    float a = d * uDensityScale;
                    vec3 tint = mix(vec3(0.45, 0.6, 1.0), vec3(1.0, 0.95, 0.8), d);
                    color += (1.0 - alpha) * a * tint;
                    alpha += (1.0 - alpha) * a;
                    t += uStepSize;
                }

                if (alpha <= 0.01) discard;
                fragColor = vec4(color, alpha);
            }
        `,transparent:!0,depthWrite:!1,blending:XA,side:$t});ja=i;const r=new bi(1,1,1),s=new xt(r,i);return s.frustumCulled=!1,s.userData.baseScale=t*2,s.scale.setScalar(s.userData.baseScale),s.onBeforeRender=()=>{s.updateMatrixWorld(),i.uniforms.uInvModelMatrix.value.copy(s.matrixWorld).invert(),i.uniforms.uTime.value=M.universeSimTime},Zt=s,et.add(s),!0}function Q1(n,e){const t=Mo(e),A=new Uint8Array(n*n*n),i=n*.5,r=t()*Math.PI*2,s=10+Math.floor(t()*8),a=[];for(let o=0;o<s;o++)a.push({x:(t()*2-1)*.55,y:(t()*2-1)*.55,z:(t()*2-1)*.55,radius:.18+t()*.35,strength:.5+t()*.9});for(let o=0;o<n;o++){const l=(o-i)/i;for(let c=0;c<n;c++){const u=(c-i)/i;for(let f=0;f<n;f++){const p=(f-i)/i;let g=0;for(let _=0;_<a.length;_++){const b=a[_],y=p-b.x,S=u-b.y,R=l-b.z,E=y*y+S*S+R*R;g+=b.strength*Math.exp(-E/(b.radius*b.radius))}const m=Math.abs(Math.sin((p*3.1+u*4.7+l*2.9+r)*4.2)),d=Math.abs(Math.sin((p*7.3+u*5.1+l*6.5+r*.7)*2.1));g=g*(.65+.35*m)+.15*d;const h=Math.max(0,1-Math.max(Math.abs(p),Math.abs(u),Math.abs(l))*1.2);g*=h;const v=Math.min(1,g),w=f+c*n+o*n*n;A[w]=Math.max(0,Math.min(255,Math.round(Math.pow(v,.85)*255)))}}}return{density:A,resolution:n}}function L1({density:n,resolution:e,radius:t,tint:A}){if(!_f())return null;const i=new Ju(n,e,e,e);i.format=Po,i.type=YA,i.minFilter=Jt,i.magFilter=Jt,i.wrapS=SA,i.wrapT=SA,i.wrapR=SA,i.unpackAlignment=1,i.needsUpdate=!0;const r=new ze(A),s=new Vt({glslVersion:ro,uniforms:{uDensity:{value:i},uInvModelMatrix:{value:new ut},uStepSize:{value:1/e*2.4},uDensityScale:{value:.85},uTime:{value:0},uTint:{value:r}},vertexShader:`
            out vec3 vLocalPos;
            void main() {
                vLocalPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            precision highp float;
            precision highp sampler3D;
            uniform sampler3D uDensity;
            uniform mat4 uInvModelMatrix;
            uniform float uStepSize;
            uniform float uDensityScale;
            uniform float uTime;
            uniform vec3 uTint;
            in vec3 vLocalPos;
            out vec4 fragColor;
            ${pi}

            vec2 intersectBox(vec3 rayOrigin, vec3 rayDir) {
                vec3 boundsMin = vec3(-0.5);
                vec3 boundsMax = vec3(0.5);
                vec3 invDir = 1.0 / rayDir;
                vec3 t0 = (boundsMin - rayOrigin) * invDir;
                vec3 t1 = (boundsMax - rayOrigin) * invDir;
                vec3 tmin = min(t0, t1);
                vec3 tmax = max(t0, t1);
                float tNear = max(max(tmin.x, tmin.y), tmin.z);
                float tFar = min(min(tmax.x, tmax.y), tmax.z);
                return vec2(tNear, tFar);
            }

            void main() {
                vec3 rayOrigin = (uInvModelMatrix * vec4(cameraPosition, 1.0)).xyz;
                vec3 rayDir = normalize(vLocalPos - rayOrigin);
                vec2 hit = intersectBox(rayOrigin, rayDir);
                if (hit.y <= hit.x) discard;

                float t = max(hit.x, 0.0);
                float tEnd = hit.y;
                vec3 color = vec3(0.0);
                float alpha = 0.0;

                for (int i = 0; i < 128; i++) {
                    if (t > tEnd || alpha > 0.97) break;
                    vec3 p = rayOrigin + rayDir * t;
                    vec3 texPos = p + vec3(0.5);
                    vec3 local = texPos - vec3(0.5);
                    float edge = smoothstep(0.55, 0.2, max(abs(local.x), max(abs(local.y), abs(local.z))));
                    float edgeNoise = 0.6 + 0.4 * snoise(local * 4.0 + vec3(uTime * 0.02));
                    edge *= clamp(edgeNoise, 0.0, 1.0);
                    vec3 drift = vec3(
                        snoise(vec3(texPos.yz * 3.0, uTime * 0.12)),
                        snoise(vec3(texPos.xz * 3.0, uTime * 0.09)),
                        snoise(vec3(texPos.xy * 3.0, uTime * 0.11))
                    ) * 0.035;
                    float filaments = abs(snoise(vec3(local * 6.0 + uTime * 0.05)));
                    float d = texture(uDensity, clamp(texPos + drift, 0.0, 1.0)).r;
                    d = pow(d, 0.7) * edge;
                    d *= (0.7 + 0.3 * filaments);
                    float a = d * uDensityScale;
                    vec3 tint = mix(uTint * 0.35, uTint, d);
                    color += (1.0 - alpha) * a * tint;
                    alpha += (1.0 - alpha) * a;
                    t += uStepSize;
                }

                if (alpha <= 0.01) discard;
                fragColor = vec4(color, alpha);
            }
        `,transparent:!0,depthWrite:!1,blending:XA,side:$t}),a=new bi(1,1,1),o=new xt(a,s);return o.frustumCulled=!1,o.scale.setScalar(t*2),o.onBeforeRender=()=>{o.updateMatrixWorld(),s.uniforms.uInvModelMatrix.value.copy(o.matrixWorld).invert(),s.uniforms.uTime.value=M.universeSimTime},o}function Om({seed:n,radius:e,tint:t,chunkCount:A}){const i=Mo(n),r=new tn;r.userData.isNebula=!0,r.userData.radius=e,r.userData.velocity=mr(i,e*15e-6),r.userData.data={designation:`NEBULA-${n.toString(16).toUpperCase().slice(-4)}`,type:"STELLAR NURSERY",age:M.universeSimTime.toFixed(2),mass:`${(50+i()*120).toFixed(1)} Billion`,radius:`${(e/1e3).toFixed(1)} kly`,lum:"DIFFUSE",composition:"H, He, dust, ionized gas",isNebula:!0};const s=A??10+Math.floor(i()*6),a=mr(i,1);a.lengthSq()<.001&&a.set(1,0,0),a.normalize();const o=e*(.35+i()*.15),l=e*(.22+i()*.08);for(let c=0;c<s;c++){const u=n+c*37,f=Mo(u),p=e*(.08+f()*.18),g=a.clone().multiplyScalar((f()*2-1)*o),m=mr(f,l*(.5+f()*.5)),d=g.add(m),h=Q1(32,u);let v=L1({density:h.density,resolution:h.resolution,radius:p,tint:t});if(!v){const w=new An(p,16,16),_=new mi({color:t,transparent:!0,opacity:.2,depthWrite:!1});v=new xt(w,_)}v.position.copy(d),v.userData.nebulaChunk=!0,r.add(v)}return r}function Nu(){Gt&&(et.remove(Gt),Gt.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),Gt=null)}function R1(){var r;if(!Gt||!je)return;const n=((r=Gt.userData)==null?void 0:r.radius)||dt.SYSTEM,e=mr(Math.random,n*.5),t=new An(dt.SYSTEM*.015,24,24),A=new eu({color:16766634,emissive:16766634,emissiveIntensity:2}),i=new xt(t,A);i.position.copy(e),i.userData.nebulaStar=!0,i.userData.age=0,i.userData.life=12+Math.random()*8,i.userData.velocity=mr(Math.random,dt.SYSTEM*.02),je.add(i),Jn.push(i)}function D1({positions:n,colors:e,sizes:t},A={}){const i=new kt;i.setAttribute("position",new qt(n,3)),i.setAttribute("color",new qt(e,3)),i.setAttribute("size",new qt(t,1));const r=new Vt({uniforms:{uTime:{value:0},uPixelRatio:{value:Ae.getPixelRatio()},uScreenHeight:{value:window.innerHeight},uOpacity:{value:1}},vertexShader:`
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
            uniform float uOpacity;
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
                
                gl_FragColor = vec4(finalColor, uOpacity);
            }
        `,depthWrite:!1,blending:XA,vertexColors:!0}),s=Number.isFinite(A.opacity)?Math.max(0,Math.min(1,A.opacity)):1,a=!!A.pickOnly;r.uniforms.uOpacity.value=s,r.opacity=s,r.transparent=s<1,r.colorWrite=!a,mt=new qp(i,r),mt.frustumCulled=!1,et.add(mt)}async function Ou(n){const e=++mc;for(mt&&(et.remove(mt),mt.geometry.dispose(),mt.material.dispose(),mt=null),Nm(),Xe&&(et.remove(Xe),Xe.geometry.dispose(),Xe.material&&Xe.material.dispose(),Xe=null);je.children.length>0;){const l=je.children[0];l.geometry&&l.geometry.dispose(),l.material&&l.material.dispose(),je.remove(l)}Ae&&Ae.renderLists.dispose(),F1(),lt.seed=n,m1.textContent="0x"+lt.seed.toString(16).toUpperCase(),g1.textContent=lt.starCount.toLocaleString();const t={seed:n,starCount:lt.starCount,clusterCount:lt.clusterCount,scale:dt.UNIVERSE,filamentScatter:lt.filamentScatter},A=Math.max(24,Math.floor(lt.densityRes||96)),i=Math.min(e1,A);i!==A&&console.warn(`[Universes] densityRes clamped to ${i} (requested ${A}).`);let r=!1;if(_f()){const l={...t,resolution:i};let c=await Ru("generateUniverseDensity",l);if(e!==mc)return;c||(c=jT(l)),c!=null&&c.density&&(r=I1({...c,scale:t.scale}))}else np||(np=!0,console.warn("[Universes] Volume rendering unavailable (WebGL2 required)."));const s=Math.min(t.starCount,Math.max(5e4,Math.floor(t.starCount*.25))),a={...t,starCount:s};let o=await Ru("generateUniverseData",a);e===mc&&(o||(o=qT(a)),D1(o,{opacity:r?0:1,pickOnly:r}),r||(mt.material.uniforms.uOpacity.value=1,mt.material.opacity=1,mt.material.transparent=!1,mt.material.blending=XA))}async function Gm(n=0){const e=++hp;Xe&&(et.remove(Xe),Xe.geometry.dispose()),qe&&(et.remove(qe),qe.traverse(l=>{l.geometry&&l.geometry.dispose(),l.material&&l.material.dispose()}),qe=null),$e.clear();const t=lt.starCount,A=dt.GALAXY,i={starCount:t,radius:A,type:n};let r=await Ru("generateGalaxyData",i);if(e!==hp)return;r||(r=$T(i));const s=new kt;s.setAttribute("position",new qt(r.positions,3)),s.setAttribute("color",new qt(r.colors,3)),s.setAttribute("size",new qt(r.sizes,1)),s.setAttribute("aOrbit",new qt(r.orbitParams,3));const a=new Vt({uniforms:{uPixelRatio:{value:Ae.getPixelRatio()},uTime:{value:0},uScreenHeight:{value:window.innerHeight}},vertexShader:`
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
        `,depthWrite:!1,blending:XA,vertexColors:!0,transparent:!0});if(Xe=new qp(s,a),Xe.frustumCulled=!1,Xe.visible=M.viewLevel!==0,et.add(Xe),n!==1){const l=n===2?4:3;qe=new tn,qe.userData.nebulae=[];const c=Math.floor(Math.random()*1e5);for(let u=0;u<l;u++){const f=c+u*97,p=Mo(f),g=A*(.1+p()*.18),m=mr(p,A*(.35+p()*.45)),d=new ze(.2+p()*.25,.5+p()*.3,.7+p()*.2),h=12+Math.floor(p()*8),v=Om({seed:f,radius:g,tint:d,chunkCount:h});v.position.copy(m),qe.add(v),qe.userData.nebulae.push(v)}qe.visible=M.viewLevel===1,et.add(qe)}const o=Hm(A*.005,0,0,0);$e.add(o),$e.visible=M.viewLevel!==0}function P1(n){var c,u;for(nn=[],vr=[];je.children.length>0;){const f=je.children[0];f.geometry&&f.geometry.dispose(),f.material&&f.material.dispose(),je.remove(f)}So.length=0;let e=Math.abs(n.x+n.y+n.z);const t=()=>{const f=Math.sin(e++)*1e4;return f-Math.floor(f)},A=dt.SYSTEM,i=dt.G;let r=16755200,s=A*.25,a=!1;if(M.selectedTarget&&M.selectedTarget.data){const f=M.selectedTarget.data;(c=f.typeObj)!=null&&c.color&&(r=f.typeObj.color),((u=f.typeObj)==null?void 0:u.id)==="BH"&&(s=A*.1,a=!0)}const o=a?1:t()>.6?t()>.9?3:2:1;for(let f=0;f<o;f++){const p=f===0?1:.5+t()*.5,g=s*p,m=1e3*p;let d;if(a)d=Hm(g,0,0,0),Br.push(d),d.add(new bh(16755268,1e5,dt.SYSTEM*5)),d.add(new r_(2236979,.5));else{const h=new An(g,64,64),v=new eu({color:r,emissive:r,emissiveIntensity:2});v.onBeforeCompile=y=>{y.uniforms.uTime={value:0},y.vertexShader=`
                    uniform float uTime; varying vec3 vCustomWorldPos; ${pi}
                `+y.vertexShader,y.vertexShader=y.vertexShader.replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
 vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),y.vertexShader=y.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>

                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.5)) + snoise(vec3(position * 0.5 - uTime * 0.2))) * 0.05 * ${g.toFixed(2)};
                    transformed += normal * disp;
                `),y.fragmentShader=`uniform float uTime; varying vec3 vCustomWorldPos; ${pi}`+y.fragmentShader,y.fragmentShader=y.fragmentShader.replace("#include <map_fragment>",`
                    float n = snoise(vec3(vCustomWorldPos * 0.1 + uTime * 0.2));
                    float bright = snoise(vec3(vCustomWorldPos * 0.3 + uTime * 0.5));
                    vec3 base = diffuseColor.rgb;
                    vec3 final = mix(base, base*0.3, smoothstep(0.4, 0.8, n));
                    final = mix(final, base*3.0, smoothstep(0.5, 0.9, bright));
                    diffuseColor.rgb = final;
                `),v.userData.shader=y},d=new xt(h,v);const w=new An(g*1.4,32,32),_=new Vt({uniforms:{uColor:{value:new ze(r)},uBlend:{value:1}},transparent:!0,side:$t,blending:XA,vertexShader:"varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; uniform float uBlend; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6*uBlend); }"}),b=new xt(w,_);b.userData.isCorona=!0,So.push(b),d.add(b),d.add(new bh(r,3e5,dt.SYSTEM*10,2))}if(je.add(d),o===1)nn.push({mesh:d,mass:m,velocity:new I(0,0,0),isStar:!0});else{const h=A*.4;d.position.set((f===0?1:-1)*h,0,0);const v=Math.sqrt(i*m/(2*h));nn.push({mesh:d,mass:m,velocity:new I(0,0,(f===0?1:-1)*v),isStar:!0})}}const l=Math.floor(t()*5)+3;for(let f=0;f<l;f++){const g=(o>1?A*.8:A*.3)+f*A*.2+t()*A*.1,m=A*.01+t()*A*.02,d=m*10,h=f>2&&t()>.3,v=!h,w=new An(m,64,64),_=new eu({color:new ze().setHSL(t(),h?.8:.2,.5),roughness:.7});_.onBeforeCompile=C=>{C.uniforms.uTime={value:0},C.vertexShader=`varying vec3 vPos; ${pi}`+C.vertexShader,C.vertexShader=C.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vPos = position; ${v?`float h = snoise(position*0.2)*0.5 + snoise(position*1.0)*0.2; transformed += normal*h*${m.toFixed(2)}*0.1;`:""}`),C.fragmentShader=`uniform float uTime; varying vec3 vPos; ${pi}`+C.fragmentShader,C.fragmentShader=C.fragmentShader.replace("#include <map_fragment>",`
                float n = snoise(vPos * ${h?"2.0":"5.0"} + vec3(0.0, ${h?"uTime*0.5":"0.0"}, 0.0));
                ${h?`
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
            `),_.userData.shader=C};const b=new xt(w,_),y=t()*Math.PI*2;b.position.set(Math.cos(y)*g,0,Math.sin(y)*g);const S=new An(m*1.1,32,32),R=new Vt({uniforms:{uTime:{value:0},uIntensity:{value:0}},transparent:!0,blending:XA,side:UA,depthWrite:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform float uIntensity; varying vec2 vUv;
            void main() {
                if (uIntensity <= 0.01) discard;
                float pole = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
                float wave = sin(vUv.x * 20.0 + uTime * 5.0) * 0.5 + 0.5;
                gl_FragColor = vec4(0.2, 0.8, 0.4, uIntensity * pole * wave * 0.5);
            }`}),E=new xt(S,R);b.add(E),b.userData={designation:`PLANET ${String.fromCharCode(65+f)}`,type:h?"GAS GIANT":"ROCKY",aurora:R},je.add(b),nn.push({mesh:b,mass:d,velocity:new I(-Math.sin(y)*Math.sqrt(i*1e3/g),0,Math.cos(y)*Math.sqrt(i*1e3/g)),isStar:!1})}}function H1(){if(M.viewLevel!==2||!je.visible)return;const n=nn.filter(o=>{var l,c;return o.isStar&&!((c=(l=o.mesh)==null?void 0:l.userData)!=null&&c.isBlackHole)});if(n.length===0)return;const e=n[Math.floor(Math.random()*n.length)].mesh,t=new An(5,32,32),A=new Vt({uniforms:{uTime:{value:0},uColor:{value:new ze(16729088)}},transparent:!0,blending:XA,depthWrite:!1,vertexShader:"varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform vec3 uColor; varying vec3 vPos; ${pi}
        void main() {
            float n = snoise(vec3(vPos * 0.5 + uTime * 2.0));
            float alpha = smoothstep(0.0, 0.5, n);
            gl_FragColor = vec4(uColor, alpha * 0.8);
        }`}),i=new xt(t,A);i.position.copy(e.position);const r=Math.random()*Math.PI*2,s=Math.random()*Math.PI,a=new I(Math.sin(s)*Math.cos(r),Math.cos(s),Math.sin(s)*Math.sin(r));i.userData={dir:a,age:0,life:10,speed:20,mat:A},je.add(i),vr.push(i)}function N1(n){const t=n/2;for(let A=0;A<2;A++)for(let i=0;i<nn.length;i++){const r=nn[i];if(r.mesh.position.add(r.velocity.clone().multiplyScalar(t)),!r.isStar){const s=r.mesh.position.lengthSq(),a=r.mesh.position.clone().normalize().multiplyScalar(-50*1e3/s);r.velocity.add(a.multiplyScalar(t))}}}function Vm(){var s,a,o,l,c,u,f,p;const n=performance.now(),e=Bf.getDelta(),t=Math.min(e,.1)*M.timeScale;if(M.bigBangFlash>0&&(M.bigBangFlash-=e*.5,M.bigBangFlash<0&&(M.bigBangFlash=0),Fo&&(Fo.uniforms.uFlash.value=M.bigBangFlash)),!M.isPaused){if(M.viewLevel===0){if(M.universeSimTime+=t,mt&&(mt.material.uniforms.uTime.value=M.universeSimTime),(s=Bt==null?void 0:Bt.children)!=null&&s.length&&Bt.children.forEach(g=>{var m,d;(d=(m=g==null?void 0:g.material)==null?void 0:m.uniforms)!=null&&d.uTime&&(g.material.uniforms.uTime.value=M.universeSimTime)}),Zt){const g=Math.max(.08,1-Math.exp(-M.universeSimTime*2)),m=Zt.userData.baseScale||1;Zt.scale.setScalar(m*g)}}else if(M.viewLevel===1)M.galaxySimTime+=t,(o=(a=Xe==null?void 0:Xe.material)==null?void 0:a.uniforms)!=null&&o.uTime&&(Xe.material.uniforms.uTime.value=M.galaxySimTime),qe!=null&&qe.visible&&qe.children.forEach(g=>{var d,h;const m=(d=g==null?void 0:g.userData)==null?void 0:d.velocity;if(m&&g.position){const v=g.position.clone().multiplyScalar(-1),w=Math.max(1,v.length());v.normalize(),m.add(v.multiplyScalar(dt.GALAXY/w*4e-7*t)),g.position.addScaledVector(m,t)}(h=g==null?void 0:g.traverse)==null||h.call(g,v=>{var w,_;(_=(w=v==null?void 0:v.material)==null?void 0:w.uniforms)!=null&&_.uTime&&(v.material.uniforms.uTime.value=M.galaxySimTime)})});else if(M.viewLevel===2){N1(t*5);const g=Gt?.35:1;So.length&&So.forEach(m=>{var d,h;(h=(d=m==null?void 0:m.material)==null?void 0:d.uniforms)!=null&&h.uBlend&&(m.material.uniforms.uBlend.value=g)}),Math.random()<.005&&H1();for(let m=vr.length-1;m>=0;m--){const d=vr[m];d.userData.age+=t,d.position.add(d.userData.dir.clone().multiplyScalar(d.userData.speed*t)),d.scale.setScalar(1+d.userData.age*2),d.userData.mat&&(d.userData.mat.uniforms.uTime.value+=e),nn.forEach(h=>{!h.isStar&&h.mesh.userData.aurora&&(d.position.distanceTo(h.mesh.position)<30?h.mesh.userData.aurora.uniforms.uIntensity.value=1:h.mesh.userData.aurora.uniforms.uIntensity.value*=.98)}),d.userData.age>d.userData.life&&(je.remove(d),vr.splice(m,1))}nn.forEach(m=>{m.isStar||(m.mesh.rotation.y+=e*.1),m.mesh.userData.aurora&&(m.mesh.userData.aurora.uniforms.uTime.value+=e),m.mesh.material&&m.mesh.material.userData&&m.mesh.material.userData.shader&&(m.mesh.material.userData.shader.uniforms.uTime.value+=e)}),Gt&&((l=Gt.traverse)==null||l.call(Gt,m=>{var d,h;(h=(d=m==null?void 0:m.material)==null?void 0:d.uniforms)!=null&&h.uTime&&(m.material.uniforms.uTime.value=M.universeSimTime)}),us+=t,us>4+Math.random()*3&&(us=0,Math.random()<.6&&R1()));for(let m=Jn.length-1;m>=0;m--){const d=Jn[m];d.userData.age+=t,d.position.addScaledVector(d.userData.velocity,t),d.userData.age>d.userData.life&&(je.remove(d),d.geometry&&d.geometry.dispose(),d.material&&d.material.dispose(),Jn.splice(m,1))}}}M.inspectingTarget&&Ce&&Ce.target.copy(M.inspectingTarget.position);let A=0;if(Br.forEach(g=>{var d,h;(d=g.children)==null||d.forEach(v=>{v&&v.material&&v.material.uniforms&&v.material.uniforms.uTime&&(v.material.uniforms.uTime.value+=e)});const m=g.getWorldPosition(n1);if(gn.copy(m).project(Te),gn.z>-1&&gn.z<1&&Math.abs(gn.x)<1.5&&Math.abs(gn.y)<1.5){dA.uBHPos.value[A].set(gn.x*.5+.5,gn.y*.5+.5);let v=.01,w=((h=g.userData)==null?void 0:h.ehRadius)??0;if(w>0){g.getWorldScale(ap),w*=ap.x,sp.set(1,0,0).applyQuaternion(Te.quaternion).normalize(),rp.copy(m).addScaledVector(sp,w),uc.copy(rp).project(Te);const _=uc.x-gn.x,b=uc.y-gn.y;v=Math.max(Math.sqrt(_*_+b*b)*.5,25e-5)}dA.uBHRadius.value[A]=v,dA.uBHMass.value[A]=Math.min(6,2.5+v*90),A++}}),dA.uBHCount.value=A,yt!=null&&yt.material&&(yt.material.uniformsNeedUpdate=!0),M.isAutopilot&&!M.isTransitioning){M.autopilotTimer+=e;let g=!0;if(M.viewLevel===0&&M.universeSimTime<1&&(g=!1),g&&M.autopilotTimer>M.autopilotNextAction){if(M.autopilotTimer=0,M.autopilotNextAction=5,M.viewLevel===0){if(mt){const m=mt.geometry.attributes.position,d=(m==null?void 0:m.count)||0;if(d>0){const h=Math.floor(Math.random()*d),v=new I(m.getX(h),m.getY(h),m.getZ(h)),w=Pm(lt.seed+h,M.universeSimTime);M.selectedTarget={level:0,index:h,position:v,data:w},yA(w,!0),_i(v,1)}}}else if(M.viewLevel===1){if(M.autopilotPriorityTargets.length>0){const m=M.autopilotPriorityTargets.shift();if(m&&m.object&&typeof m.object.getWorldPosition=="function"){m.object.getWorldPosition(ur);const d=ur.clone(),h=m.data||bo();M.selectedTarget={level:1,object:m.object,position:d,data:h},yA(h,!0),_i(d,2)}}else if(Xe){const m=Xe.geometry.attributes.position,d=(m==null?void 0:m.count)||0;if(d>0){const h=Math.floor(Math.random()*d),v=new I(m.getX(h),m.getY(h),m.getZ(h)),w=Dm(h);M.selectedTarget={level:1,index:h,position:v,data:w},yA(w,!0),_i(v,2)}}}else if(M.viewLevel===2){const m=je.children.filter(d=>d.userData&&d.userData.type);if(M.planetTourIndex<m.length){const d=m[M.planetTourIndex],h={designation:d.userData.designation,type:d.userData.type,age:M.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:"SILICATES/ICE"};M.selectedTarget={level:2,object:d,position:d.position,data:h},yA(h,!0),Ce.target.copy(d.position),M.planetTourIndex++}else Qm()}}}if(M.isTransitioning?(M.transitionProgress+=e,Te.position.lerp(M.transitionTarget,.05),Ce.target.lerp(M.transitionTarget,.05),M.transitionProgress>3&&Lm()):Ce.update(),!!((c=Ae==null?void 0:Ae.xr)!=null&&c.isPresenting)?((!(F!=null&&F.anchor)||!(F!=null&&F.mesh))&&Cf(),F&&!F.visible&&(tl(),Ro(!0),xf())):F!=null&&F.visible&&Ro(!1),Mm(n),Ae&&!((u=Ae==null?void 0:Ae.xr)!=null&&u.isPresenting))try{Ae.setRenderTarget(null),Ae.setViewport(0,0,Ae.domElement.width,Ae.domElement.height),Ae.setScissorTest(!1)}catch{}(f=Ae==null?void 0:Ae.xr)!=null&&f.isPresenting||eo>0?(Ae.render(et,Te),(p=Ae==null?void 0:Ae.xr)!=null&&p.isPresenting||(eo=Math.max(0,eo-1))):LA.render();const r=M.viewLevel===0?M.universeSimTime:M.galaxySimTime;op&&(op.innerText=r.toFixed(2)+" Bn YR"),Io&&(Io.innerText=`[ STATUS ${r.toFixed(2)}Bn ]`),Te&&(hc||dc||pc)&&(Da.copy(Te.position).add(M.worldOffset),hc&&(hc.innerText=fc(Da.x)),dc&&(dc.innerText=fc(Da.y)),pc&&(pc.innerText=fc(Da.z))),p1.innerText=Math.round(1/(e||.001))}function O1(n){var t;if(IA.delete(n.pointerId),IA.size===0?(zn=!1,_A=null):(zn=!0,_A===n.pointerId&&(_A=IA.values().next().value)),xi){IA.size===0&&(xi=!1);return}if(Nn||n.target.closest("button")||n.target.closest(".hud-panel"))return;const e=Ae.domElement.getBoundingClientRect();if($a.x=(n.clientX-e.left)/e.width*2-1,$a.y=-((n.clientY-e.top)/e.height)*2+1,qA.setFromCamera($a,Te),M.viewLevel===0&&mt){qA.params.Points.threshold=5e5;const A=qA.intersectObject(mt);if(A.length>0){nr();const i=A[0].index,r=Pm(lt.seed+i,M.universeSimTime);M.selectedTarget={level:0,index:i,position:A[0].point,data:r},yA(r)}}else if(M.viewLevel===1&&Xe){if(qe&&qe.visible){const r=qA.intersectObjects(qe.children,!0);if(r.length>0){const s=d1(r[0].object);if(s){nr();const a=((t=s.userData)==null?void 0:t.data)||{};M.selectedTarget={level:1,object:s,position:s.position.clone(),data:a},yA(a);return}}}const A=$e&&$e.visible&&$e.children.length>0?$e.children[0]:null;if(A){if(qA.intersectObject(A,!0).length>0){nr();const s=bo();A.getWorldPosition(ur),M.selectedTarget={level:1,object:A,position:ur.clone(),data:s},yA(s);return}if(Pa.copy(A.getWorldPosition(ur)).project(Te),Pa.z<1){const s=e.left+(Pa.x*.5+.5)*e.width,a=e.top+(-Pa.y*.5+.5)*e.height,o=Math.max(24,Math.min(e.width,e.height)*.06);if(Math.hypot(n.clientX-s,n.clientY-a)<=o){nr();const l=bo();M.selectedTarget={level:1,object:A,position:ur.clone(),data:l},yA(l);return}}}qA.params.Points.threshold=5e4;const i=qA.intersectObject(Xe);if(i.length>0){nr();const r=i[0].index,s=Dm(r);M.selectedTarget={level:1,index:r,position:i[0].point,data:s},yA(s)}}else if(M.viewLevel===2&&je){qA.params.Points.threshold=1;const A=qA.intersectObjects(je.children);if(A.length>0){let i=A[0].object;if(!i.userData.type&&i.parent&&i.parent.userData.type&&(i=i.parent),i.userData.type){nr();const r={designation:i.userData.designation,type:i.userData.type,age:M.universeSimTime.toFixed(2),mass:"0.003 M☉",radius:"0.01 R☉",lum:"0",composition:"Atmosphere: N2, O2"};M.selectedTarget={level:2,object:i,position:i.position,data:r},yA(r)}}}}
