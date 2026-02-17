var x0=Object.defineProperty;var _0=(n,e,t)=>e in n?x0(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var ye=(n,e,t)=>_0(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))A(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&A(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function A(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sf="167",Di={ROTATE:0,DOLLY:1,PAN:2},Pi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},E0=0,Jf=1,y0=2,Xp=1,S0=2,wn=3,qn=0,tA=1,MA=2,En=0,gr=1,GA=2,Zf=3,qf=4,U0=5,ui=100,M0=101,b0=102,F0=103,T0=104,I0=200,Q0=201,L0=202,R0=203,Lc=204,Rc=205,D0=206,P0=207,H0=208,N0=209,O0=210,G0=211,V0=212,k0=213,z0=214,K0=0,W0=1,X0=2,uo=3,Y0=4,J0=5,Z0=6,q0=7,Yp=0,j0=1,$0=2,Xn=0,eB=1,tB=2,AB=3,nB=4,iB=5,rB=6,sB=7,Jp=300,Er=301,yr=302,Dc=303,Pc=304,Wo=306,Hc=1e3,bA=1001,Nc=1002,HA=1003,aB=1004,Os=1005,jt=1006,ml=1007,di=1008,jA=1009,Zp=1010,qp=1011,ws=1012,af=1013,Mi=1014,xn=1015,Qr=1016,of=1017,lf=1018,Sr=1020,jp=35902,$p=1021,eg=1022,ZA=1023,tg=1024,Ag=1025,mr=1026,Ur=1027,Xo=1028,cf=1029,ng=1030,uf=1031,ff=1033,qa=33776,ja=33777,$a=33778,eo=33779,Oc=35840,Gc=35841,Vc=35842,kc=35843,zc=36196,Kc=37492,Wc=37496,Xc=37808,Yc=37809,Jc=37810,Zc=37811,qc=37812,jc=37813,$c=37814,eu=37815,tu=37816,Au=37817,nu=37818,iu=37819,ru=37820,su=37821,to=36492,au=36494,ou=36495,ig=36283,lu=36284,cu=36285,uu=36286,oB=3200,lB=3201,rg=0,cB=1,On="",YA="srgb",ti="srgb-linear",hf="display-p3",Yo="display-p3-linear",fo="linear",mt="srgb",ho="rec709",po="p3",Hi=7680,jf=519,uB=512,fB=513,hB=514,sg=515,dB=516,pB=517,gB=518,mB=519,$f=35044,go="300 es",_n=2e3,mo=2001;class Ii{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const A=this._listeners;A[e]===void 0&&(A[e]=[]),A[e].indexOf(t)===-1&&A[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const A=this._listeners;return A[e]!==void 0&&A[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const A=this._listeners[e.type];if(A!==void 0){e.target=this;const i=A.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const nA=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],cs=Math.PI/180,fu=180/Math.PI;function Fs(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,A=Math.random()*4294967295|0;return(nA[n&255]+nA[n>>8&255]+nA[n>>16&255]+nA[n>>24&255]+"-"+nA[e&255]+nA[e>>8&255]+"-"+nA[e>>16&15|64]+nA[e>>24&255]+"-"+nA[t&63|128]+nA[t>>8&255]+"-"+nA[t>>16&255]+nA[t>>24&255]+nA[A&255]+nA[A>>8&255]+nA[A>>16&255]+nA[A>>24&255]).toLowerCase()}function qt(n,e,t){return Math.max(e,Math.min(t,n))}function BB(n,e){return(n%e+e)%e}function Bl(n,e,t){return(1-t)*n+t*e}function Pr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function pA(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const vB={DEG2RAD:cs};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,A=this.y,i=e.elements;return this.x=i[0]*t+i[3]*A+i[6],this.y=i[1]*t+i[4]*A+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(qt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y;return t*t+A*A}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const A=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*A-s*i+e.x,this.y=r*i+s*A+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xe{constructor(e,t,A,i,r,s,a,o,l){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l)}set(e,t,A,i,r,s,a,o,l){const c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=r,c[5]=o,c[6]=A,c[7]=s,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],this}extractBasis(e,t,A){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),A.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[3],o=A[6],l=A[1],c=A[4],u=A[7],f=A[2],p=A[5],g=A[8],m=i[0],d=i[3],h=i[6],B=i[1],w=i[4],C=i[7],b=i[2],y=i[5],M=i[8];return r[0]=s*m+a*B+o*b,r[3]=s*d+a*w+o*y,r[6]=s*h+a*C+o*M,r[1]=l*m+c*B+u*b,r[4]=l*d+c*w+u*y,r[7]=l*h+c*C+u*M,r[2]=f*m+p*B+g*b,r[5]=f*d+p*w+g*y,r[8]=f*h+p*C+g*M,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*s*c-t*a*l-A*r*c+A*a*o+i*r*l-i*s*o}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=c*s-a*l,f=a*o-c*r,p=l*r-s*o,g=t*u+A*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/g;return e[0]=u*m,e[1]=(i*l-c*A)*m,e[2]=(a*A-i*s)*m,e[3]=f*m,e[4]=(c*t-i*o)*m,e[5]=(i*r-a*t)*m,e[6]=p*m,e[7]=(A*o-l*t)*m,e[8]=(s*t-A*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,A,i,r,s,a){const o=Math.cos(r),l=Math.sin(r);return this.set(A*o,A*l,-A*(o*s+l*a)+s+e,-i*l,i*o,-i*(-l*s+o*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(vl.makeScale(e,t)),this}rotate(e){return this.premultiply(vl.makeRotation(-e)),this}translate(e,t){return this.premultiply(vl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,A,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<9;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<9;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const vl=new Xe;function ag(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Bo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function wB(){const n=Bo("canvas");return n.style.display="block",n}const eh={};function us(n){n in eh||(eh[n]=!0,console.warn(n))}function CB(n,e,t){return new Promise(function(A,i){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:i();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:A()}}setTimeout(r,t)})}const th=new Xe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ah=new Xe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Hr={[ti]:{transfer:fo,primaries:ho,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[YA]:{transfer:mt,primaries:ho,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Yo]:{transfer:fo,primaries:po,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Ah),fromReference:n=>n.applyMatrix3(th)},[hf]:{transfer:mt,primaries:po,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Ah),fromReference:n=>n.applyMatrix3(th).convertLinearToSRGB()}},xB=new Set([ti,Yo]),ot={enabled:!0,_workingColorSpace:ti,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!xB.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const A=Hr[e].toReference,i=Hr[t].fromReference;return i(A(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Hr[n].primaries},getTransfer:function(n){return n===On?fo:Hr[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Hr[e].luminanceCoefficients)}};function Br(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function wl(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ni;class _B{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ni===void 0&&(Ni=Bo("canvas")),Ni.width=e.width,Ni.height=e.height;const A=Ni.getContext("2d");e instanceof ImageData?A.putImageData(e,0,0):A.drawImage(e,0,0,e.width,e.height),t=Ni}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Bo("canvas");t.width=e.width,t.height=e.height;const A=t.getContext("2d");A.drawImage(e,0,0,e.width,e.height);const i=A.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=Br(r[s]/255)*255;return A.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let A=0;A<t.length;A++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[A]=Math.floor(Br(t[A]/255)*255):t[A]=Br(t[A]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let EB=0;class og{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:EB++}),this.uuid=Fs(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const A={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(Cl(i[s].image)):r.push(Cl(i[s]))}else r=Cl(i);A.url=r}return t||(e.images[this.uuid]=A),A}}function Cl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?_B.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yB=0;class dA extends Ii{constructor(e=dA.DEFAULT_IMAGE,t=dA.DEFAULT_MAPPING,A=bA,i=bA,r=jt,s=di,a=ZA,o=jA,l=dA.DEFAULT_ANISOTROPY,c=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yB++}),this.uuid=Fs(),this.name="",this.source=new og(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=A,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const A={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(A.userData=this.userData),t||(e.textures[this.uuid]=A),A}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hc:e.x=e.x-Math.floor(e.x);break;case bA:e.x=e.x<0?0:1;break;case Nc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hc:e.y=e.y-Math.floor(e.y);break;case bA:e.y=e.y<0?0:1;break;case Nc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}dA.DEFAULT_IMAGE=null;dA.DEFAULT_MAPPING=Jp;dA.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,t=0,A=0,i=1){ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=A,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,A,i){return this.x=e,this.y=t,this.z=A,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*A+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*A+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*A+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*A+s[11]*i+s[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,A,i,r;const o=e.elements,l=o[0],c=o[4],u=o[8],f=o[1],p=o[5],g=o[9],m=o[2],d=o[6],h=o[10];if(Math.abs(c-f)<.01&&Math.abs(u-m)<.01&&Math.abs(g-d)<.01){if(Math.abs(c+f)<.1&&Math.abs(u+m)<.1&&Math.abs(g+d)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,C=(p+1)/2,b=(h+1)/2,y=(c+f)/4,M=(u+m)/4,R=(g+d)/4;return w>C&&w>b?w<.01?(A=0,i=.707106781,r=.707106781):(A=Math.sqrt(w),i=y/A,r=M/A):C>b?C<.01?(A=.707106781,i=0,r=.707106781):(i=Math.sqrt(C),A=y/i,r=R/i):b<.01?(A=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),A=M/r,i=R/r),this.set(A,i,r,t),this}let B=Math.sqrt((d-g)*(d-g)+(u-m)*(u-m)+(f-c)*(f-c));return Math.abs(B)<.001&&(B=1),this.x=(d-g)/B,this.y=(u-m)/B,this.z=(f-c)/B,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this.w=e.w+(t.w-e.w)*A,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class SB extends Ii{constructor(e=1,t=1,A={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);const i={width:e,height:t,depth:1};A=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},A);const r=new dA(i,A.mapping,A.wrapS,A.wrapT,A.magFilter,A.minFilter,A.format,A.type,A.anisotropy,A.colorSpace);r.flipY=!1,r.generateMipmaps=A.generateMipmaps,r.internalFormat=A.internalFormat,this.textures=[];const s=A.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=A.depthBuffer,this.stencilBuffer=A.stencilBuffer,this.resolveDepthBuffer=A.resolveDepthBuffer,this.resolveStencilBuffer=A.resolveStencilBuffer,this.depthTexture=A.depthTexture,this.samples=A.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,A=1){if(this.width!==e||this.height!==t||this.depth!==A){this.width=e,this.height=t,this.depth=A;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=A;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let A=0,i=e.textures.length;A<i;A++)this.textures[A]=e.textures[A].clone(),this.textures[A].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new og(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jn extends SB{constructor(e=1,t=1,A={}){super(e,t,A),this.isWebGLRenderTarget=!0}}class lg extends dA{constructor(e=null,t=1,A=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=HA,this.minFilter=HA,this.wrapR=bA,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class df extends dA{constructor(e=null,t=1,A=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=HA,this.minFilter=HA,this.wrapR=bA,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class bi{constructor(e=0,t=0,A=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=A,this._w=i}static slerpFlat(e,t,A,i,r,s,a){let o=A[i+0],l=A[i+1],c=A[i+2],u=A[i+3];const f=r[s+0],p=r[s+1],g=r[s+2],m=r[s+3];if(a===0){e[t+0]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=m;return}if(u!==m||o!==f||l!==p||c!==g){let d=1-a;const h=o*f+l*p+c*g+u*m,B=h>=0?1:-1,w=1-h*h;if(w>Number.EPSILON){const b=Math.sqrt(w),y=Math.atan2(b,h*B);d=Math.sin(d*y)/b,a=Math.sin(a*y)/b}const C=a*B;if(o=o*d+f*C,l=l*d+p*C,c=c*d+g*C,u=u*d+m*C,d===1-a){const b=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=b,l*=b,c*=b,u*=b}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,A,i,r,s){const a=A[i],o=A[i+1],l=A[i+2],c=A[i+3],u=r[s],f=r[s+1],p=r[s+2],g=r[s+3];return e[t]=a*g+c*u+o*p-l*f,e[t+1]=o*g+c*f+l*u-a*p,e[t+2]=l*g+c*p+a*f-o*u,e[t+3]=c*g-a*u-o*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,A,i){return this._x=e,this._y=t,this._z=A,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const A=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,o=Math.sin,l=a(A/2),c=a(i/2),u=a(r/2),f=o(A/2),p=o(i/2),g=o(r/2);switch(s){case"XYZ":this._x=f*c*u+l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u-f*p*g;break;case"YXZ":this._x=f*c*u+l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u+f*p*g;break;case"ZXY":this._x=f*c*u-l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u-f*p*g;break;case"ZYX":this._x=f*c*u-l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u+f*p*g;break;case"YZX":this._x=f*c*u+l*p*g,this._y=l*p*u+f*c*g,this._z=l*c*g-f*p*u,this._w=l*c*u-f*p*g;break;case"XZY":this._x=f*c*u-l*p*g,this._y=l*p*u-f*c*g,this._z=l*c*g+f*p*u,this._w=l*c*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const A=t/2,i=Math.sin(A);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(A),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,A=t[0],i=t[4],r=t[8],s=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10],f=A+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(c-o)*p,this._y=(r-l)*p,this._z=(s-i)*p}else if(A>a&&A>u){const p=2*Math.sqrt(1+A-a-u);this._w=(c-o)/p,this._x=.25*p,this._y=(i+s)/p,this._z=(r+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-A-u);this._w=(r-l)/p,this._x=(i+s)/p,this._y=.25*p,this._z=(o+c)/p}else{const p=2*Math.sqrt(1+u-A-a);this._w=(s-i)/p,this._x=(r+l)/p,this._y=(o+c)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let A=e.dot(t)+1;return A<Number.EPSILON?(A=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=A):(this._x=0,this._y=-e.z,this._z=e.y,this._w=A)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=A),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qt(this.dot(e),-1,1)))}rotateTowards(e,t){const A=this.angleTo(e);if(A===0)return this;const i=Math.min(1,t/A);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const A=e._x,i=e._y,r=e._z,s=e._w,a=t._x,o=t._y,l=t._z,c=t._w;return this._x=A*c+s*a+i*l-r*o,this._y=i*c+s*o+r*a-A*l,this._z=r*c+s*l+A*o-i*a,this._w=s*c-A*a-i*o-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const A=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+A*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=A,this._y=i,this._z=r,this;const o=1-a*a;if(o<=Number.EPSILON){const p=1-t;return this._w=p*s+t*this._w,this._x=p*A+t*this._x,this._y=p*i+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const l=Math.sqrt(o),c=Math.atan2(l,a),u=Math.sin((1-t)*c)/l,f=Math.sin(t*c)/l;return this._w=s*u+this._w*f,this._x=A*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,A){return this.copy(e).slerp(t,A)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),A=Math.random(),i=Math.sqrt(1-A),r=Math.sqrt(A);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,A=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=A}set(e,t,A){return A===void 0&&(A=this.z),this.x=e,this.y=t,this.z=A,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*A+r[6]*i,this.y=r[1]*t+r[4]*A+r[7]*i,this.z=r[2]*t+r[5]*A+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*A+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*A+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*A+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*A+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,A=this.y,i=this.z,r=e.x,s=e.y,a=e.z,o=e.w,l=2*(s*i-a*A),c=2*(a*t-r*i),u=2*(r*A-s*t);return this.x=t+o*l+s*u-a*c,this.y=A+o*c+a*l-r*u,this.z=i+o*u+r*c-s*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*A+r[8]*i,this.y=r[1]*t+r[5]*A+r[9]*i,this.z=r[2]*t+r[6]*A+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const A=e.x,i=e.y,r=e.z,s=t.x,a=t.y,o=t.z;return this.x=i*o-r*a,this.y=r*s-A*o,this.z=A*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const A=e.dot(this)/t;return this.copy(e).multiplyScalar(A)}projectOnPlane(e){return xl.copy(this).projectOnVector(e),this.sub(xl)}reflect(e){return this.sub(xl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(qt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y,i=this.z-e.z;return t*t+A*A+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,A){const i=Math.sin(t)*e;return this.x=i*Math.sin(A),this.y=Math.cos(t)*e,this.z=i*Math.cos(A),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,A){return this.x=e*Math.sin(t),this.y=A,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),A=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=A,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,A=Math.sqrt(1-t*t);return this.x=A*Math.cos(e),this.y=t,this.z=A*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xl=new F,nh=new bi;class Ts{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t+=3)this.expandByPoint(kA.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,A=e.count;t<A;t++)this.expandByPoint(kA.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const A=kA.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(A),this.max.copy(e).add(A),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const A=e.geometry;if(A!==void 0){const r=A.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,kA):kA.fromBufferAttribute(r,s),kA.applyMatrix4(e.matrixWorld),this.expandByPoint(kA);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(A.boundingBox===null&&A.computeBoundingBox(),Gs.copy(A.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kA),kA.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,A;return e.normal.x>0?(t=e.normal.x*this.min.x,A=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,A=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,A+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,A+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,A+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,A+=e.normal.z*this.min.z),t<=-e.constant&&A>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Nr),Vs.subVectors(this.max,Nr),Oi.subVectors(e.a,Nr),Gi.subVectors(e.b,Nr),Vi.subVectors(e.c,Nr),bn.subVectors(Gi,Oi),Fn.subVectors(Vi,Gi),ni.subVectors(Oi,Vi);let t=[0,-bn.z,bn.y,0,-Fn.z,Fn.y,0,-ni.z,ni.y,bn.z,0,-bn.x,Fn.z,0,-Fn.x,ni.z,0,-ni.x,-bn.y,bn.x,0,-Fn.y,Fn.x,0,-ni.y,ni.x,0];return!_l(t,Oi,Gi,Vi,Vs)||(t=[1,0,0,0,1,0,0,0,1],!_l(t,Oi,Gi,Vi,Vs))?!1:(ks.crossVectors(bn,Fn),t=[ks.x,ks.y,ks.z],_l(t,Oi,Gi,Vi,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kA).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kA).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const fn=[new F,new F,new F,new F,new F,new F,new F,new F],kA=new F,Gs=new Ts,Oi=new F,Gi=new F,Vi=new F,bn=new F,Fn=new F,ni=new F,Nr=new F,Vs=new F,ks=new F,ii=new F;function _l(n,e,t,A,i){for(let r=0,s=n.length-3;r<=s;r+=3){ii.fromArray(n,r);const a=i.x*Math.abs(ii.x)+i.y*Math.abs(ii.y)+i.z*Math.abs(ii.z),o=e.dot(ii),l=t.dot(ii),c=A.dot(ii);if(Math.max(-Math.max(o,l,c),Math.min(o,l,c))>a)return!1}return!0}const UB=new Ts,Or=new F,El=new F;class Is{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const A=this.center;t!==void 0?A.copy(t):UB.setFromPoints(e).getCenter(A);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,A.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const A=this.center.distanceToSquared(e);return t.copy(e),A>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Or.subVectors(e,this.center);const t=Or.lengthSq();if(t>this.radius*this.radius){const A=Math.sqrt(t),i=(A-this.radius)*.5;this.center.addScaledVector(Or,i/A),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(El.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Or.copy(e.center).add(El)),this.expandByPoint(Or.copy(e.center).sub(El))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new F,yl=new F,zs=new F,Tn=new F,Sl=new F,Ks=new F,Ul=new F;class Qs{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const A=t.dot(this.direction);return A<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,A)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,A,i){yl.copy(e).add(t).multiplyScalar(.5),zs.copy(t).sub(e).normalize(),Tn.copy(this.origin).sub(yl);const r=e.distanceTo(t)*.5,s=-this.direction.dot(zs),a=Tn.dot(this.direction),o=-Tn.dot(zs),l=Tn.lengthSq(),c=Math.abs(1-s*s);let u,f,p,g;if(c>0)if(u=s*o-a,f=s*a-o,g=r*c,u>=0)if(f>=-g)if(f<=g){const m=1/c;u*=m,f*=m,p=u*(u+s*f+2*a)+f*(s*u+f+2*o)+l}else f=r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;else f=-r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;else f<=-g?(u=Math.max(0,-(-s*r+a)),f=u>0?-r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-o),r),p=f*(f+2*o)+l):(u=Math.max(0,-(s*r+a)),f=u>0?r:Math.min(Math.max(-r,-o),r),p=-u*u+f*(f+2*o)+l);else f=s>0?-r:r,u=Math.max(0,-(s*f+a)),p=-u*u+f*(f+2*o)+l;return A&&A.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(yl).addScaledVector(zs,f),p}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const A=hn.dot(this.direction),i=hn.dot(hn)-A*A,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=A-s,o=A+s;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const A=-(this.origin.dot(e.normal)+e.constant)/t;return A>=0?A:null}intersectPlane(e,t){const A=this.distanceToPlane(e);return A===null?null:this.at(A,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let A,i,r,s,a,o;const l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(A=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(A=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),c>=0?(r=(e.min.y-f.y)*c,s=(e.max.y-f.y)*c):(r=(e.max.y-f.y)*c,s=(e.min.y-f.y)*c),A>s||r>i||((r>A||isNaN(A))&&(A=r),(s<i||isNaN(i))&&(i=s),u>=0?(a=(e.min.z-f.z)*u,o=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,o=(e.min.z-f.z)*u),A>o||a>i)||((a>A||A!==A)&&(A=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(A>=0?A:i,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,A,i,r){Sl.subVectors(t,e),Ks.subVectors(A,e),Ul.crossVectors(Sl,Ks);let s=this.direction.dot(Ul),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;Tn.subVectors(this.origin,e);const o=a*this.direction.dot(Ks.crossVectors(Tn,Ks));if(o<0)return null;const l=a*this.direction.dot(Sl.cross(Tn));if(l<0||o+l>s)return null;const c=-a*Tn.dot(Ul);return c<0?null:this.at(c/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ut{constructor(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d){ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d)}set(e,t,A,i,r,s,a,o,l,c,u,f,p,g,m,d){const h=this.elements;return h[0]=e,h[4]=t,h[8]=A,h[12]=i,h[1]=r,h[5]=s,h[9]=a,h[13]=o,h[2]=l,h[6]=c,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=m,h[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ut().fromArray(this.elements)}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],t[9]=A[9],t[10]=A[10],t[11]=A[11],t[12]=A[12],t[13]=A[13],t[14]=A[14],t[15]=A[15],this}copyPosition(e){const t=this.elements,A=e.elements;return t[12]=A[12],t[13]=A[13],t[14]=A[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,A){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),A.setFromMatrixColumn(this,2),this}makeBasis(e,t,A){return this.set(e.x,t.x,A.x,0,e.y,t.y,A.y,0,e.z,t.z,A.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,A=e.elements,i=1/ki.setFromMatrixColumn(e,0).length(),r=1/ki.setFromMatrixColumn(e,1).length(),s=1/ki.setFromMatrixColumn(e,2).length();return t[0]=A[0]*i,t[1]=A[1]*i,t[2]=A[2]*i,t[3]=0,t[4]=A[4]*r,t[5]=A[5]*r,t[6]=A[6]*r,t[7]=0,t[8]=A[8]*s,t[9]=A[9]*s,t[10]=A[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,A=e.x,i=e.y,r=e.z,s=Math.cos(A),a=Math.sin(A),o=Math.cos(i),l=Math.sin(i),c=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=s*c,p=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=-o*u,t[8]=l,t[1]=p+g*l,t[5]=f-m*l,t[9]=-a*o,t[2]=m-f*l,t[6]=g+p*l,t[10]=s*o}else if(e.order==="YXZ"){const f=o*c,p=o*u,g=l*c,m=l*u;t[0]=f+m*a,t[4]=g*a-p,t[8]=s*l,t[1]=s*u,t[5]=s*c,t[9]=-a,t[2]=p*a-g,t[6]=m+f*a,t[10]=s*o}else if(e.order==="ZXY"){const f=o*c,p=o*u,g=l*c,m=l*u;t[0]=f-m*a,t[4]=-s*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=s*c,t[9]=m-f*a,t[2]=-s*l,t[6]=a,t[10]=s*o}else if(e.order==="ZYX"){const f=s*c,p=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=g*l-p,t[8]=f*l+m,t[1]=o*u,t[5]=m*l+f,t[9]=p*l-g,t[2]=-l,t[6]=a*o,t[10]=s*o}else if(e.order==="YZX"){const f=s*o,p=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=m-f*u,t[8]=g*u+p,t[1]=u,t[5]=s*c,t[9]=-a*c,t[2]=-l*c,t[6]=p*u+g,t[10]=f-m*u}else if(e.order==="XZY"){const f=s*o,p=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=-u,t[8]=l*c,t[1]=f*u+m,t[5]=s*c,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*c,t[10]=m*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(MB,e,bB)}lookAt(e,t,A){const i=this.elements;return vA.subVectors(e,t),vA.lengthSq()===0&&(vA.z=1),vA.normalize(),In.crossVectors(A,vA),In.lengthSq()===0&&(Math.abs(A.z)===1?vA.x+=1e-4:vA.z+=1e-4,vA.normalize(),In.crossVectors(A,vA)),In.normalize(),Ws.crossVectors(vA,In),i[0]=In.x,i[4]=Ws.x,i[8]=vA.x,i[1]=In.y,i[5]=Ws.y,i[9]=vA.y,i[2]=In.z,i[6]=Ws.z,i[10]=vA.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[4],o=A[8],l=A[12],c=A[1],u=A[5],f=A[9],p=A[13],g=A[2],m=A[6],d=A[10],h=A[14],B=A[3],w=A[7],C=A[11],b=A[15],y=i[0],M=i[4],R=i[8],E=i[12],x=i[1],L=i[5],z=i[9],D=i[13],O=i[2],Z=i[6],V=i[10],q=i[14],X=i[3],re=i[7],ae=i[11],he=i[15];return r[0]=s*y+a*x+o*O+l*X,r[4]=s*M+a*L+o*Z+l*re,r[8]=s*R+a*z+o*V+l*ae,r[12]=s*E+a*D+o*q+l*he,r[1]=c*y+u*x+f*O+p*X,r[5]=c*M+u*L+f*Z+p*re,r[9]=c*R+u*z+f*V+p*ae,r[13]=c*E+u*D+f*q+p*he,r[2]=g*y+m*x+d*O+h*X,r[6]=g*M+m*L+d*Z+h*re,r[10]=g*R+m*z+d*V+h*ae,r[14]=g*E+m*D+d*q+h*he,r[3]=B*y+w*x+C*O+b*X,r[7]=B*M+w*L+C*Z+b*re,r[11]=B*R+w*z+C*V+b*ae,r[15]=B*E+w*D+C*q+b*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[4],i=e[8],r=e[12],s=e[1],a=e[5],o=e[9],l=e[13],c=e[2],u=e[6],f=e[10],p=e[14],g=e[3],m=e[7],d=e[11],h=e[15];return g*(+r*o*u-i*l*u-r*a*f+A*l*f+i*a*p-A*o*p)+m*(+t*o*p-t*l*f+r*s*f-i*s*p+i*l*c-r*o*c)+d*(+t*l*u-t*a*p-r*s*u+A*s*p+r*a*c-A*l*c)+h*(-i*a*c-t*o*u+t*a*f+i*s*u-A*s*f+A*o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,A){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=A),this}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=e[9],f=e[10],p=e[11],g=e[12],m=e[13],d=e[14],h=e[15],B=u*d*l-m*f*l+m*o*p-a*d*p-u*o*h+a*f*h,w=g*f*l-c*d*l-g*o*p+s*d*p+c*o*h-s*f*h,C=c*m*l-g*u*l+g*a*p-s*m*p-c*a*h+s*u*h,b=g*u*o-c*m*o-g*a*f+s*m*f+c*a*d-s*u*d,y=t*B+A*w+i*C+r*b;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/y;return e[0]=B*M,e[1]=(m*f*r-u*d*r-m*i*p+A*d*p+u*i*h-A*f*h)*M,e[2]=(a*d*r-m*o*r+m*i*l-A*d*l-a*i*h+A*o*h)*M,e[3]=(u*o*r-a*f*r-u*i*l+A*f*l+a*i*p-A*o*p)*M,e[4]=w*M,e[5]=(c*d*r-g*f*r+g*i*p-t*d*p-c*i*h+t*f*h)*M,e[6]=(g*o*r-s*d*r-g*i*l+t*d*l+s*i*h-t*o*h)*M,e[7]=(s*f*r-c*o*r+c*i*l-t*f*l-s*i*p+t*o*p)*M,e[8]=C*M,e[9]=(g*u*r-c*m*r-g*A*p+t*m*p+c*A*h-t*u*h)*M,e[10]=(s*m*r-g*a*r+g*A*l-t*m*l-s*A*h+t*a*h)*M,e[11]=(c*a*r-s*u*r-c*A*l+t*u*l+s*A*p-t*a*p)*M,e[12]=b*M,e[13]=(c*m*i-g*u*i+g*A*f-t*m*f-c*A*d+t*u*d)*M,e[14]=(g*a*i-s*m*i-g*A*o+t*m*o+s*A*d-t*a*d)*M,e[15]=(s*u*i-c*a*i+c*A*o-t*u*o-s*A*f+t*a*f)*M,this}scale(e){const t=this.elements,A=e.x,i=e.y,r=e.z;return t[0]*=A,t[4]*=i,t[8]*=r,t[1]*=A,t[5]*=i,t[9]*=r,t[2]*=A,t[6]*=i,t[10]*=r,t[3]*=A,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],A=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,A,i))}makeTranslation(e,t,A){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,A,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),A=Math.sin(e);return this.set(1,0,0,0,0,t,-A,0,0,A,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,0,A,0,0,1,0,0,-A,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,0,A,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const A=Math.cos(t),i=Math.sin(t),r=1-A,s=e.x,a=e.y,o=e.z,l=r*s,c=r*a;return this.set(l*s+A,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+A,c*o-i*s,0,l*o-i*a,c*o+i*s,r*o*o+A,0,0,0,0,1),this}makeScale(e,t,A){return this.set(e,0,0,0,0,t,0,0,0,0,A,0,0,0,0,1),this}makeShear(e,t,A,i,r,s){return this.set(1,A,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,A){const i=this.elements,r=t._x,s=t._y,a=t._z,o=t._w,l=r+r,c=s+s,u=a+a,f=r*l,p=r*c,g=r*u,m=s*c,d=s*u,h=a*u,B=o*l,w=o*c,C=o*u,b=A.x,y=A.y,M=A.z;return i[0]=(1-(m+h))*b,i[1]=(p+C)*b,i[2]=(g-w)*b,i[3]=0,i[4]=(p-C)*y,i[5]=(1-(f+h))*y,i[6]=(d+B)*y,i[7]=0,i[8]=(g+w)*M,i[9]=(d-B)*M,i[10]=(1-(f+m))*M,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,A){const i=this.elements;let r=ki.set(i[0],i[1],i[2]).length();const s=ki.set(i[4],i[5],i[6]).length(),a=ki.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],zA.copy(this);const l=1/r,c=1/s,u=1/a;return zA.elements[0]*=l,zA.elements[1]*=l,zA.elements[2]*=l,zA.elements[4]*=c,zA.elements[5]*=c,zA.elements[6]*=c,zA.elements[8]*=u,zA.elements[9]*=u,zA.elements[10]*=u,t.setFromRotationMatrix(zA),A.x=r,A.y=s,A.z=a,this}makePerspective(e,t,A,i,r,s,a=_n){const o=this.elements,l=2*r/(t-e),c=2*r/(A-i),u=(t+e)/(t-e),f=(A+i)/(A-i);let p,g;if(a===_n)p=-(s+r)/(s-r),g=-2*s*r/(s-r);else if(a===mo)p=-s/(s-r),g=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return o[0]=l,o[4]=0,o[8]=u,o[12]=0,o[1]=0,o[5]=c,o[9]=f,o[13]=0,o[2]=0,o[6]=0,o[10]=p,o[14]=g,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,A,i,r,s,a=_n){const o=this.elements,l=1/(t-e),c=1/(A-i),u=1/(s-r),f=(t+e)*l,p=(A+i)*c;let g,m;if(a===_n)g=(s+r)*u,m=-2*u;else if(a===mo)g=r*u,m=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-f,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-p,o[2]=0,o[6]=0,o[10]=m,o[14]=-g,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<16;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<16;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e[t+9]=A[9],e[t+10]=A[10],e[t+11]=A[11],e[t+12]=A[12],e[t+13]=A[13],e[t+14]=A[14],e[t+15]=A[15],e}}const ki=new F,zA=new ut,MB=new F(0,0,0),bB=new F(1,1,1),In=new F,Ws=new F,vA=new F,ih=new ut,rh=new bi;class on{constructor(e=0,t=0,A=0,i=on.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=A,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,A,i=this._order){return this._x=e,this._y=t,this._z=A,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,A=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],o=i[1],l=i[5],c=i[9],u=i[2],f=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,p),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(o,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(qt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,l)):(this._y=0,this._z=Math.atan2(o,r));break;case"ZYX":this._y=Math.asin(-qt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(o,r)):(this._x=0,this._z=Math.atan2(-s,l));break;case"YZX":this._z=Math.asin(qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-qt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-c,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,A===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,A){return ih.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ih,t,A)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rh.setFromEuler(this),this.setFromQuaternion(rh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class pf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let FB=0;const sh=new F,zi=new bi,dn=new ut,Xs=new F,Gr=new F,TB=new F,IB=new bi,ah=new F(1,0,0),oh=new F(0,1,0),lh=new F(0,0,1),ch={type:"added"},QB={type:"removed"},Ki={type:"childadded",child:null},Ml={type:"childremoved",child:null};class lA extends Ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:FB++}),this.uuid=Fs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=lA.DEFAULT_UP.clone();const e=new F,t=new on,A=new bi,i=new F(1,1,1);function r(){A.setFromEuler(t,!1)}function s(){t.setFromQuaternion(A,void 0,!1)}t._onChange(r),A._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:A},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ut},normalMatrix:{value:new Xe}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=lA.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=lA.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.multiply(zi),this}rotateOnWorldAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.premultiply(zi),this}rotateX(e){return this.rotateOnAxis(ah,e)}rotateY(e){return this.rotateOnAxis(oh,e)}rotateZ(e){return this.rotateOnAxis(lh,e)}translateOnAxis(e,t){return sh.copy(e).applyQuaternion(this.quaternion),this.position.add(sh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ah,e)}translateY(e){return this.translateOnAxis(oh,e)}translateZ(e){return this.translateOnAxis(lh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(e,t,A){e.isVector3?Xs.copy(e):Xs.set(e,t,A);const i=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(Gr,Xs,this.up):dn.lookAt(Xs,Gr,this.up),this.quaternion.setFromRotationMatrix(dn),i&&(dn.extractRotation(i.matrixWorld),zi.setFromRotationMatrix(dn),this.quaternion.premultiply(zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ch),Ki.child=e,this.dispatchEvent(Ki),Ki.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let A=0;A<arguments.length;A++)this.remove(arguments[A]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(QB),Ml.child=e,this.dispatchEvent(Ml),Ml.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ch),Ki.child=e,this.dispatchEvent(Ki),Ki.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let A=0,i=this.children.length;A<i;A++){const s=this.children[A].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,A=[]){this[e]===t&&A.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,A);return A}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,e,TB),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,IB,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].updateMatrixWorld(e)}updateWorldMatrix(e,t){const A=this.parent;if(e===!0&&A!==null&&A.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",A={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},A.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){const u=o[l];r(e.shapes,u)}else r(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(r(e.materials,this.material[o]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const o=this.animations[a];i.animations.push(r(e.animations,o))}}if(t){const a=s(e.geometries),o=s(e.materials),l=s(e.textures),c=s(e.images),u=s(e.shapes),f=s(e.skeletons),p=s(e.animations),g=s(e.nodes);a.length>0&&(A.geometries=a),o.length>0&&(A.materials=o),l.length>0&&(A.textures=l),c.length>0&&(A.images=c),u.length>0&&(A.shapes=u),f.length>0&&(A.skeletons=f),p.length>0&&(A.animations=p),g.length>0&&(A.nodes=g)}return A.object=i,A;function s(a){const o=[];for(const l in a){const c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let A=0;A<e.children.length;A++){const i=e.children[A];this.add(i.clone())}return this}}lA.DEFAULT_UP=new F(0,1,0);lA.DEFAULT_MATRIX_AUTO_UPDATE=!0;lA.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const KA=new F,pn=new F,bl=new F,gn=new F,Wi=new F,Xi=new F,uh=new F,Fl=new F,Tl=new F,Il=new F;class JA{constructor(e=new F,t=new F,A=new F){this.a=e,this.b=t,this.c=A}static getNormal(e,t,A,i){i.subVectors(A,t),KA.subVectors(e,t),i.cross(KA);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,A,i,r){KA.subVectors(i,t),pn.subVectors(A,t),bl.subVectors(e,t);const s=KA.dot(KA),a=KA.dot(pn),o=KA.dot(bl),l=pn.dot(pn),c=pn.dot(bl),u=s*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*o-a*c)*f,g=(s*c-a*o)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,A,i){return this.getBarycoord(e,t,A,i,gn)===null?!1:gn.x>=0&&gn.y>=0&&gn.x+gn.y<=1}static getInterpolation(e,t,A,i,r,s,a,o){return this.getBarycoord(e,t,A,i,gn)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(r,gn.x),o.addScaledVector(s,gn.y),o.addScaledVector(a,gn.z),o)}static isFrontFacing(e,t,A,i){return KA.subVectors(A,t),pn.subVectors(e,t),KA.cross(pn).dot(i)<0}set(e,t,A){return this.a.copy(e),this.b.copy(t),this.c.copy(A),this}setFromPointsAndIndices(e,t,A,i){return this.a.copy(e[t]),this.b.copy(e[A]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,A,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,A),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return KA.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),KA.cross(pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return JA.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return JA.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,A,i,r){return JA.getInterpolation(e,this.a,this.b,this.c,t,A,i,r)}containsPoint(e){return JA.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return JA.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const A=this.a,i=this.b,r=this.c;let s,a;Wi.subVectors(i,A),Xi.subVectors(r,A),Fl.subVectors(e,A);const o=Wi.dot(Fl),l=Xi.dot(Fl);if(o<=0&&l<=0)return t.copy(A);Tl.subVectors(e,i);const c=Wi.dot(Tl),u=Xi.dot(Tl);if(c>=0&&u<=c)return t.copy(i);const f=o*u-c*l;if(f<=0&&o>=0&&c<=0)return s=o/(o-c),t.copy(A).addScaledVector(Wi,s);Il.subVectors(e,r);const p=Wi.dot(Il),g=Xi.dot(Il);if(g>=0&&p<=g)return t.copy(r);const m=p*l-o*g;if(m<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(A).addScaledVector(Xi,a);const d=c*g-p*u;if(d<=0&&u-c>=0&&p-g>=0)return uh.subVectors(r,i),a=(u-c)/(u-c+(p-g)),t.copy(i).addScaledVector(uh,a);const h=1/(d+m+f);return s=m*h,a=f*h,t.copy(A).addScaledVector(Wi,s).addScaledVector(Xi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const cg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},Ys={h:0,s:0,l:0};function Ql(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ke{constructor(e,t,A){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,A)}set(e,t,A){if(t===void 0&&A===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,A);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=YA){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.toWorkingColorSpace(this,t),this}setRGB(e,t,A,i=ot.workingColorSpace){return this.r=e,this.g=t,this.b=A,ot.toWorkingColorSpace(this,i),this}setHSL(e,t,A,i=ot.workingColorSpace){if(e=BB(e,1),t=qt(t,0,1),A=qt(A,0,1),t===0)this.r=this.g=this.b=A;else{const r=A<=.5?A*(1+t):A+t-A*t,s=2*A-r;this.r=Ql(s,r,e+1/3),this.g=Ql(s,r,e),this.b=Ql(s,r,e-1/3)}return ot.toWorkingColorSpace(this,i),this}setStyle(e,t=YA){function A(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=YA){const A=cg[e.toLowerCase()];return A!==void 0?this.setHex(A,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Br(e.r),this.g=Br(e.g),this.b=Br(e.b),this}copyLinearToSRGB(e){return this.r=wl(e.r),this.g=wl(e.g),this.b=wl(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=YA){return ot.fromWorkingColorSpace(iA.copy(this),e),Math.round(qt(iA.r*255,0,255))*65536+Math.round(qt(iA.g*255,0,255))*256+Math.round(qt(iA.b*255,0,255))}getHexString(e=YA){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.fromWorkingColorSpace(iA.copy(this),t);const A=iA.r,i=iA.g,r=iA.b,s=Math.max(A,i,r),a=Math.min(A,i,r);let o,l;const c=(a+s)/2;if(a===s)o=0,l=0;else{const u=s-a;switch(l=c<=.5?u/(s+a):u/(2-s-a),s){case A:o=(i-r)/u+(i<r?6:0);break;case i:o=(r-A)/u+2;break;case r:o=(A-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=ot.workingColorSpace){return ot.fromWorkingColorSpace(iA.copy(this),t),e.r=iA.r,e.g=iA.g,e.b=iA.b,e}getStyle(e=YA){ot.fromWorkingColorSpace(iA.copy(this),e);const t=iA.r,A=iA.g,i=iA.b;return e!==YA?`color(${e} ${t.toFixed(3)} ${A.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(A*255)},${Math.round(i*255)})`}offsetHSL(e,t,A){return this.getHSL(Qn),this.setHSL(Qn.h+e,Qn.s+t,Qn.l+A)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,A){return this.r=e.r+(t.r-e.r)*A,this.g=e.g+(t.g-e.g)*A,this.b=e.b+(t.b-e.b)*A,this}lerpHSL(e,t){this.getHSL(Qn),e.getHSL(Ys);const A=Bl(Qn.h,Ys.h,t),i=Bl(Qn.s,Ys.s,t),r=Bl(Qn.l,Ys.l,t);return this.setHSL(A,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,A=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*A+r[6]*i,this.g=r[1]*t+r[4]*A+r[7]*i,this.b=r[2]*t+r[5]*A+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const iA=new Ke;Ke.NAMES=cg;let LB=0;class Qi extends Ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:LB++}),this.uuid=Fs(),this.name="",this.type="Material",this.blending=gr,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lc,this.blendDst=Rc,this.blendEquation=ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=uo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hi,this.stencilZFail=Hi,this.stencilZPass=Hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const A=e[t];if(A===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(A):i&&i.isVector3&&A&&A.isVector3?i.copy(A):this[t]=A}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const A={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};A.uuid=this.uuid,A.type=this.type,this.name!==""&&(A.name=this.name),this.color&&this.color.isColor&&(A.color=this.color.getHex()),this.roughness!==void 0&&(A.roughness=this.roughness),this.metalness!==void 0&&(A.metalness=this.metalness),this.sheen!==void 0&&(A.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(A.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(A.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(A.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(A.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(A.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(A.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(A.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(A.shininess=this.shininess),this.clearcoat!==void 0&&(A.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(A.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(A.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(A.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(A.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,A.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(A.dispersion=this.dispersion),this.iridescence!==void 0&&(A.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(A.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(A.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(A.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(A.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(A.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(A.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(A.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(A.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(A.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(A.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(A.lightMap=this.lightMap.toJSON(e).uuid,A.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(A.aoMap=this.aoMap.toJSON(e).uuid,A.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(A.bumpMap=this.bumpMap.toJSON(e).uuid,A.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(A.normalMap=this.normalMap.toJSON(e).uuid,A.normalMapType=this.normalMapType,A.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(A.displacementMap=this.displacementMap.toJSON(e).uuid,A.displacementScale=this.displacementScale,A.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(A.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(A.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(A.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(A.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(A.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(A.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(A.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(A.combine=this.combine)),this.envMapRotation!==void 0&&(A.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(A.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(A.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(A.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(A.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(A.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(A.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(A.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(A.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(A.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(A.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(A.size=this.size),this.shadowSide!==null&&(A.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(A.sizeAttenuation=this.sizeAttenuation),this.blending!==gr&&(A.blending=this.blending),this.side!==qn&&(A.side=this.side),this.vertexColors===!0&&(A.vertexColors=!0),this.opacity<1&&(A.opacity=this.opacity),this.transparent===!0&&(A.transparent=!0),this.blendSrc!==Lc&&(A.blendSrc=this.blendSrc),this.blendDst!==Rc&&(A.blendDst=this.blendDst),this.blendEquation!==ui&&(A.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(A.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(A.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(A.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(A.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(A.blendAlpha=this.blendAlpha),this.depthFunc!==uo&&(A.depthFunc=this.depthFunc),this.depthTest===!1&&(A.depthTest=this.depthTest),this.depthWrite===!1&&(A.depthWrite=this.depthWrite),this.colorWrite===!1&&(A.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(A.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jf&&(A.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(A.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(A.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hi&&(A.stencilFail=this.stencilFail),this.stencilZFail!==Hi&&(A.stencilZFail=this.stencilZFail),this.stencilZPass!==Hi&&(A.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(A.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(A.rotation=this.rotation),this.polygonOffset===!0&&(A.polygonOffset=!0),this.polygonOffsetFactor!==0&&(A.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(A.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(A.linewidth=this.linewidth),this.dashSize!==void 0&&(A.dashSize=this.dashSize),this.gapSize!==void 0&&(A.gapSize=this.gapSize),this.scale!==void 0&&(A.scale=this.scale),this.dithering===!0&&(A.dithering=!0),this.alphaTest>0&&(A.alphaTest=this.alphaTest),this.alphaHash===!0&&(A.alphaHash=!0),this.alphaToCoverage===!0&&(A.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(A.premultipliedAlpha=!0),this.forceSinglePass===!0&&(A.forceSinglePass=!0),this.wireframe===!0&&(A.wireframe=!0),this.wireframeLinewidth>1&&(A.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(A.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(A.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(A.flatShading=!0),this.visible===!1&&(A.visible=!1),this.toneMapped===!1&&(A.toneMapped=!1),this.fog===!1&&(A.fog=!1),Object.keys(this.userData).length>0&&(A.userData=this.userData);function i(r){const s=[];for(const a in r){const o=r[a];delete o.metadata,s.push(o)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(A.textures=r),s.length>0&&(A.images=s)}return A}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let A=null;if(t!==null){const i=t.length;A=new Array(i);for(let r=0;r!==i;++r)A[r]=t[r].clone()}return this.clippingPlanes=A,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class vi extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=Yp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const It=new F,Js=new Ue;class $t{constructor(e,t,A=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=A,this.usage=$f,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return us("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,A){e*=this.itemSize,A*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[A+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,A=this.count;t<A;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,A=this.count;t<A;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let A=this.array[e*this.itemSize+t];return this.normalized&&(A=Pr(A,this.array)),A}setComponent(e,t,A){return this.normalized&&(A=pA(A,this.array)),this.array[e*this.itemSize+t]=A,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pr(t,this.array)),t}setX(e,t){return this.normalized&&(t=pA(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pr(t,this.array)),t}setY(e,t){return this.normalized&&(t=pA(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pA(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pr(t,this.array)),t}setW(e,t){return this.normalized&&(t=pA(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,A){return e*=this.itemSize,this.normalized&&(t=pA(t,this.array),A=pA(A,this.array)),this.array[e+0]=t,this.array[e+1]=A,this}setXYZ(e,t,A,i){return e*=this.itemSize,this.normalized&&(t=pA(t,this.array),A=pA(A,this.array),i=pA(i,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this}setXYZW(e,t,A,i,r){return e*=this.itemSize,this.normalized&&(t=pA(t,this.array),A=pA(A,this.array),i=pA(i,this.array),r=pA(r,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==$f&&(e.usage=this.usage),e}}class ug extends $t{constructor(e,t,A){super(new Uint16Array(e),t,A)}}class fg extends $t{constructor(e,t,A){super(new Uint32Array(e),t,A)}}class zt extends $t{constructor(e,t,A){super(new Float32Array(e),t,A)}}let RB=0;const IA=new ut,Ll=new lA,Yi=new F,wA=new Ts,Vr=new Ts,Vt=new F;class Gt extends Ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:RB++}),this.uuid=Fs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ag(e)?fg:ug)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,A=0){this.groups.push({start:e,count:t,materialIndex:A})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const A=this.attributes.normal;if(A!==void 0){const r=new Xe().getNormalMatrix(e);A.applyNormalMatrix(r),A.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return IA.makeRotationFromQuaternion(e),this.applyMatrix4(IA),this}rotateX(e){return IA.makeRotationX(e),this.applyMatrix4(IA),this}rotateY(e){return IA.makeRotationY(e),this.applyMatrix4(IA),this}rotateZ(e){return IA.makeRotationZ(e),this.applyMatrix4(IA),this}translate(e,t,A){return IA.makeTranslation(e,t,A),this.applyMatrix4(IA),this}scale(e,t,A){return IA.makeScale(e,t,A),this.applyMatrix4(IA),this}lookAt(e){return Ll.lookAt(e),Ll.updateMatrix(),this.applyMatrix4(Ll.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(e){const t=[];for(let A=0,i=e.length;A<i;A++){const r=e[A];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new zt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ts);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let A=0,i=t.length;A<i;A++){const r=t[A];wA.setFromBufferAttribute(r),this.morphTargetsRelative?(Vt.addVectors(this.boundingBox.min,wA.min),this.boundingBox.expandByPoint(Vt),Vt.addVectors(this.boundingBox.max,wA.max),this.boundingBox.expandByPoint(Vt)):(this.boundingBox.expandByPoint(wA.min),this.boundingBox.expandByPoint(wA.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const A=this.boundingSphere.center;if(wA.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];Vr.setFromBufferAttribute(a),this.morphTargetsRelative?(Vt.addVectors(wA.min,Vr.min),wA.expandByPoint(Vt),Vt.addVectors(wA.max,Vr.max),wA.expandByPoint(Vt)):(wA.expandByPoint(Vr.min),wA.expandByPoint(Vr.max))}wA.getCenter(A);let i=0;for(let r=0,s=e.count;r<s;r++)Vt.fromBufferAttribute(e,r),i=Math.max(i,A.distanceToSquared(Vt));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++)Vt.fromBufferAttribute(a,l),o&&(Yi.fromBufferAttribute(e,l),Vt.add(Yi)),i=Math.max(i,A.distanceToSquared(Vt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const A=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*A.count),4));const s=this.getAttribute("tangent"),a=[],o=[];for(let R=0;R<A.count;R++)a[R]=new F,o[R]=new F;const l=new F,c=new F,u=new F,f=new Ue,p=new Ue,g=new Ue,m=new F,d=new F;function h(R,E,x){l.fromBufferAttribute(A,R),c.fromBufferAttribute(A,E),u.fromBufferAttribute(A,x),f.fromBufferAttribute(r,R),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,x),c.sub(l),u.sub(l),p.sub(f),g.sub(f);const L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(m.copy(c).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),d.copy(u).multiplyScalar(p.x).addScaledVector(c,-g.x).multiplyScalar(L),a[R].add(m),a[E].add(m),a[x].add(m),o[R].add(d),o[E].add(d),o[x].add(d))}let B=this.groups;B.length===0&&(B=[{start:0,count:e.count}]);for(let R=0,E=B.length;R<E;++R){const x=B[R],L=x.start,z=x.count;for(let D=L,O=L+z;D<O;D+=3)h(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const w=new F,C=new F,b=new F,y=new F;function M(R){b.fromBufferAttribute(i,R),y.copy(b);const E=a[R];w.copy(E),w.sub(b.multiplyScalar(b.dot(E))).normalize(),C.crossVectors(y,E);const L=C.dot(o[R])<0?-1:1;s.setXYZW(R,w.x,w.y,w.z,L)}for(let R=0,E=B.length;R<E;++R){const x=B[R],L=x.start,z=x.count;for(let D=L,O=L+z;D<O;D+=3)M(e.getX(D+0)),M(e.getX(D+1)),M(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let A=this.getAttribute("normal");if(A===void 0)A=new $t(new Float32Array(t.count*3),3),this.setAttribute("normal",A);else for(let f=0,p=A.count;f<p;f++)A.setXYZ(f,0,0,0);const i=new F,r=new F,s=new F,a=new F,o=new F,l=new F,c=new F,u=new F;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),m=e.getX(f+1),d=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,d),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),a.fromBufferAttribute(A,g),o.fromBufferAttribute(A,m),l.fromBufferAttribute(A,d),a.add(c),o.add(c),l.add(c),A.setXYZ(g,a.x,a.y,a.z),A.setXYZ(m,o.x,o.y,o.z),A.setXYZ(d,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),A.setXYZ(f+0,c.x,c.y,c.z),A.setXYZ(f+1,c.x,c.y,c.z),A.setXYZ(f+2,c.x,c.y,c.z);this.normalizeNormals(),A.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,A=e.count;t<A;t++)Vt.fromBufferAttribute(e,t),Vt.normalize(),e.setXYZ(t,Vt.x,Vt.y,Vt.z)}toNonIndexed(){function e(a,o){const l=a.array,c=a.itemSize,u=a.normalized,f=new l.constructor(o.length*c);let p=0,g=0;for(let m=0,d=o.length;m<d;m++){a.isInterleavedBufferAttribute?p=o[m]*a.data.stride+a.offset:p=o[m]*c;for(let h=0;h<c;h++)f[g++]=l[p++]}return new $t(f,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Gt,A=this.index.array,i=this.attributes;for(const a in i){const o=i[a],l=e(o,A);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const o=[],l=r[a];for(let c=0,u=l.length;c<u;c++){const f=l[c],p=e(f,A);o.push(p)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,o=s.length;a<o;a++){const l=s[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const o=this.parameters;for(const l in o)o[l]!==void 0&&(e[l]=o[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const A=this.attributes;for(const o in A){const l=A[o];e.data.attributes[o]=l.toJSON(e.data)}const i={};let r=!1;for(const o in this.morphAttributes){const l=this.morphAttributes[o],c=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];c.push(p.toJSON(e.data))}c.length>0&&(i[o]=c,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const A=e.index;A!==null&&this.setIndex(A.clone(t));const i=e.attributes;for(const l in i){const c=i[l];this.setAttribute(l,c.clone(t))}const r=e.morphAttributes;for(const l in r){const c=[],u=r[l];for(let f=0,p=u.length;f<p;f++)c.push(u[f].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let l=0,c=s.length;l<c;l++){const u=s[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fh=new ut,ri=new Qs,Zs=new Is,hh=new F,Ji=new F,Zi=new F,qi=new F,Rl=new F,qs=new F,js=new Ue,$s=new Ue,ea=new Ue,dh=new F,ph=new F,gh=new F,ta=new F,Aa=new F;class xt extends lA{constructor(e=new Gt,t=new vi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const A=this.geometry,i=A.attributes.position,r=A.morphAttributes.position,s=A.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){qs.set(0,0,0);for(let o=0,l=r.length;o<l;o++){const c=a[o],u=r[o];c!==0&&(Rl.fromBufferAttribute(u,e),s?qs.addScaledVector(Rl,c):qs.addScaledVector(Rl.sub(t),c))}t.add(qs)}return t}raycast(e,t){const A=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(A.boundingSphere===null&&A.computeBoundingSphere(),Zs.copy(A.boundingSphere),Zs.applyMatrix4(r),ri.copy(e.ray).recast(e.near),!(Zs.containsPoint(ri.origin)===!1&&(ri.intersectSphere(Zs,hh)===null||ri.origin.distanceToSquared(hh)>(e.far-e.near)**2))&&(fh.copy(r).invert(),ri.copy(e.ray).applyMatrix4(fh),!(A.boundingBox!==null&&ri.intersectsBox(A.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,A){let i;const r=this.geometry,s=this.material,a=r.index,o=r.attributes.position,l=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],B=Math.max(d.start,p.start),w=Math.min(a.count,Math.min(d.start+d.count,p.start+p.count));for(let C=B,b=w;C<b;C+=3){const y=a.getX(C),M=a.getX(C+1),R=a.getX(C+2);i=na(this,h,e,A,l,c,u,y,M,R),i&&(i.faceIndex=Math.floor(C/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(a.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const B=a.getX(d),w=a.getX(d+1),C=a.getX(d+2);i=na(this,s,e,A,l,c,u,B,w,C),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const d=f[g],h=s[d.materialIndex],B=Math.max(d.start,p.start),w=Math.min(o.count,Math.min(d.start+d.count,p.start+p.count));for(let C=B,b=w;C<b;C+=3){const y=C,M=C+1,R=C+2;i=na(this,h,e,A,l,c,u,y,M,R),i&&(i.faceIndex=Math.floor(C/3),i.face.materialIndex=d.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),m=Math.min(o.count,p.start+p.count);for(let d=g,h=m;d<h;d+=3){const B=d,w=d+1,C=d+2;i=na(this,s,e,A,l,c,u,B,w,C),i&&(i.faceIndex=Math.floor(d/3),t.push(i))}}}}function DB(n,e,t,A,i,r,s,a){let o;if(e.side===tA?o=A.intersectTriangle(s,r,i,!0,a):o=A.intersectTriangle(i,r,s,e.side===qn,a),o===null)return null;Aa.copy(a),Aa.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Aa);return l<t.near||l>t.far?null:{distance:l,point:Aa.clone(),object:n}}function na(n,e,t,A,i,r,s,a,o,l){n.getVertexPosition(a,Ji),n.getVertexPosition(o,Zi),n.getVertexPosition(l,qi);const c=DB(n,e,t,A,Ji,Zi,qi,ta);if(c){i&&(js.fromBufferAttribute(i,a),$s.fromBufferAttribute(i,o),ea.fromBufferAttribute(i,l),c.uv=JA.getInterpolation(ta,Ji,Zi,qi,js,$s,ea,new Ue)),r&&(js.fromBufferAttribute(r,a),$s.fromBufferAttribute(r,o),ea.fromBufferAttribute(r,l),c.uv1=JA.getInterpolation(ta,Ji,Zi,qi,js,$s,ea,new Ue)),s&&(dh.fromBufferAttribute(s,a),ph.fromBufferAttribute(s,o),gh.fromBufferAttribute(s,l),c.normal=JA.getInterpolation(ta,Ji,Zi,qi,dh,ph,gh,new F),c.normal.dot(A.direction)>0&&c.normal.multiplyScalar(-1));const u={a,b:o,c:l,normal:new F,materialIndex:0};JA.getNormal(Ji,Zi,qi,u.normal),c.face=u}return c}class Li extends Gt{constructor(e=1,t=1,A=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:A,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const o=[],l=[],c=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,A,t,e,s,r,0),g("z","y","x",1,-1,A,t,-e,s,r,1),g("x","z","y",1,1,e,A,t,i,s,2),g("x","z","y",1,-1,e,A,-t,i,s,3),g("x","y","z",1,-1,e,t,A,i,r,4),g("x","y","z",-1,-1,e,t,-A,i,r,5),this.setIndex(o),this.setAttribute("position",new zt(l,3)),this.setAttribute("normal",new zt(c,3)),this.setAttribute("uv",new zt(u,2));function g(m,d,h,B,w,C,b,y,M,R,E){const x=C/M,L=b/R,z=C/2,D=b/2,O=y/2,Z=M+1,V=R+1;let q=0,X=0;const re=new F;for(let ae=0;ae<V;ae++){const he=ae*L-D;for(let Ie=0;Ie<Z;Ie++){const Oe=Ie*x-z;re[m]=Oe*B,re[d]=he*w,re[h]=O,l.push(re.x,re.y,re.z),re[m]=0,re[d]=0,re[h]=y>0?1:-1,c.push(re.x,re.y,re.z),u.push(Ie/M),u.push(1-ae/R),q+=1}}for(let ae=0;ae<R;ae++)for(let he=0;he<M;he++){const Ie=f+he+Z*ae,Oe=f+he+Z*(ae+1),J=f+(he+1)+Z*(ae+1),ee=f+(he+1)+Z*ae;o.push(Ie,Oe,ee),o.push(Oe,J,ee),X+=6}a.addGroup(p,X,E),p+=X,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Li(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Mr(n){const e={};for(const t in n){e[t]={};for(const A in n[t]){const i=n[t][A];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][A]=null):e[t][A]=i.clone():Array.isArray(i)?e[t][A]=i.slice():e[t][A]=i}}return e}function cA(n){const e={};for(let t=0;t<n.length;t++){const A=Mr(n[t]);for(const i in A)e[i]=A[i]}return e}function PB(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function hg(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}const dg={clone:Mr,merge:cA};var HB=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,NB=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kt extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=HB,this.fragmentShader=NB,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Mr(e.uniforms),this.uniformsGroups=PB(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const A={};for(const i in this.extensions)this.extensions[i]===!0&&(A[i]=!0);return Object.keys(A).length>0&&(t.extensions=A),t}}class pg extends lA{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=_n}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ln=new F,mh=new Ue,Bh=new Ue;class yA extends pg{constructor(e=50,t=1,A=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=A,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fu*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(cs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fu*2*Math.atan(Math.tan(cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,A){Ln.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z),Ln.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),A.set(Ln.x,Ln.y).multiplyScalar(-e/Ln.z)}getViewSize(e,t){return this.getViewBounds(e,mh,Bh),t.subVectors(Bh,mh)}setViewOffset(e,t,A,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(cs*.5*this.fov)/this.zoom,A=2*t,i=this.aspect*A,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const o=s.fullWidth,l=s.fullHeight;r+=s.offsetX*i/o,t-=s.offsetY*A/l,i*=s.width/o,A*=s.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-A,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ji=-90,$i=1;class OB extends lA{constructor(e,t,A){super(),this.type="CubeCamera",this.renderTarget=A,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new yA(ji,$i,e,t);i.layers=this.layers,this.add(i);const r=new yA(ji,$i,e,t);r.layers=this.layers,this.add(r);const s=new yA(ji,$i,e,t);s.layers=this.layers,this.add(s);const a=new yA(ji,$i,e,t);a.layers=this.layers,this.add(a);const o=new yA(ji,$i,e,t);o.layers=this.layers,this.add(o);const l=new yA(ji,$i,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[A,i,r,s,a,o]=t;for(const l of t)this.remove(l);if(e===_n)A.up.set(0,1,0),A.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===mo)A.up.set(0,-1,0),A.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:A,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,o,l,c]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const m=A.texture.generateMipmaps;A.texture.generateMipmaps=!1,e.setRenderTarget(A,0,i),e.render(t,r),e.setRenderTarget(A,1,i),e.render(t,s),e.setRenderTarget(A,2,i),e.render(t,a),e.setRenderTarget(A,3,i),e.render(t,o),e.setRenderTarget(A,4,i),e.render(t,l),A.texture.generateMipmaps=m,e.setRenderTarget(A,5,i),e.render(t,c),e.setRenderTarget(u,f,p),e.xr.enabled=g,A.texture.needsPMREMUpdate=!0}}class gg extends dA{constructor(e,t,A,i,r,s,a,o,l,c){e=e!==void 0?e:[],t=t!==void 0?t:Er,super(e,t,A,i,r,s,a,o,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class GB extends jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const A={width:e,height:e,depth:1},i=[A,A,A,A,A,A];this.texture=new gg(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:jt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const A={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Li(5,5,5),r=new Kt({name:"CubemapFromEquirect",uniforms:Mr(A.uniforms),vertexShader:A.vertexShader,fragmentShader:A.fragmentShader,side:tA,blending:En});r.uniforms.tEquirect.value=t;const s=new xt(i,r),a=t.minFilter;return t.minFilter===di&&(t.minFilter=jt),new OB(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,A,i){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,A,i);e.setRenderTarget(r)}}const Dl=new F,VB=new F,kB=new Xe;class Hn{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,A,i){return this.normal.set(e,t,A),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,A){const i=Dl.subVectors(A,t).cross(VB.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const A=e.delta(Dl),i=this.normal.dot(A);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(A,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),A=this.distanceToPoint(e.end);return t<0&&A>0||A<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const A=t||kB.getNormalMatrix(e),i=this.coplanarPoint(Dl).applyMatrix4(e),r=this.normal.applyMatrix3(A).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new Is,ia=new F;class gf{constructor(e=new Hn,t=new Hn,A=new Hn,i=new Hn,r=new Hn,s=new Hn){this.planes=[e,t,A,i,r,s]}set(e,t,A,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(A),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let A=0;A<6;A++)t[A].copy(e.planes[A]);return this}setFromProjectionMatrix(e,t=_n){const A=this.planes,i=e.elements,r=i[0],s=i[1],a=i[2],o=i[3],l=i[4],c=i[5],u=i[6],f=i[7],p=i[8],g=i[9],m=i[10],d=i[11],h=i[12],B=i[13],w=i[14],C=i[15];if(A[0].setComponents(o-r,f-l,d-p,C-h).normalize(),A[1].setComponents(o+r,f+l,d+p,C+h).normalize(),A[2].setComponents(o+s,f+c,d+g,C+B).normalize(),A[3].setComponents(o-s,f-c,d-g,C-B).normalize(),A[4].setComponents(o-a,f-u,d-m,C-w).normalize(),t===_n)A[5].setComponents(o+a,f+u,d+m,C+w).normalize();else if(t===mo)A[5].setComponents(a,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(e){return si.center.set(0,0,0),si.radius=.7071067811865476,si.applyMatrix4(e.matrixWorld),this.intersectsSphere(si)}intersectsSphere(e){const t=this.planes,A=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(A)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let A=0;A<6;A++){const i=t[A];if(ia.x=i.normal.x>0?e.max.x:e.min.x,ia.y=i.normal.y>0?e.max.y:e.min.y,ia.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ia)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let A=0;A<6;A++)if(t[A].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function mg(){let n=null,e=!1,t=null,A=null;function i(r,s){t(r,s),A=n.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(A=n.requestAnimationFrame(i),e=!0)},stop:function(){n.cancelAnimationFrame(A),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function zB(n){const e=new WeakMap;function t(a,o){const l=a.array,c=a.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(o,f),n.bufferData(o,l,c),a.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function A(a,o,l){const c=o.array,u=o._updateRange,f=o.updateRanges;if(n.bindBuffer(l,a),u.count===-1&&f.length===0&&n.bufferSubData(l,0,c),f.length!==0){for(let p=0,g=f.length;p<g;p++){const m=f[p];n.bufferSubData(l,m.start*c.BYTES_PER_ELEMENT,c,m.start,m.count)}o.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(l,u.offset*c.BYTES_PER_ELEMENT,c,u.offset,u.count),u.count=-1),o.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const o=e.get(a);o&&(n.deleteBuffer(o.buffer),e.delete(a))}function s(a,o){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const c=e.get(a);(!c||c.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,o));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");A(l.buffer,a,o),l.version=a.version}}return{get:i,remove:r,update:s}}class $n extends Gt{constructor(e=1,t=1,A=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:A,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(A),o=Math.floor(i),l=a+1,c=o+1,u=e/a,f=t/o,p=[],g=[],m=[],d=[];for(let h=0;h<c;h++){const B=h*f-s;for(let w=0;w<l;w++){const C=w*u-r;g.push(C,-B,0),m.push(0,0,1),d.push(w/a),d.push(1-h/o)}}for(let h=0;h<o;h++)for(let B=0;B<a;B++){const w=B+l*h,C=B+l*(h+1),b=B+1+l*(h+1),y=B+1+l*h;p.push(w,C,y),p.push(C,b,y)}this.setIndex(p),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(m,3)),this.setAttribute("uv",new zt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $n(e.width,e.height,e.widthSegments,e.heightSegments)}}var KB=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,WB=`#ifdef USE_ALPHAHASH
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
#endif`,XB=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,YB=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,JB=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ZB=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qB=`#ifdef USE_AOMAP
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
#endif`,jB=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,$B=`#ifdef USE_BATCHING
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
#endif`,ev=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Av=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,nv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iv=`#ifdef USE_IRIDESCENCE
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
#endif`,rv=`#ifdef USE_BUMPMAP
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
#endif`,sv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,av=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ov=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,dv=`#define PI 3.141592653589793
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
} // validated`,pv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,gv=`vec3 transformedNormal = objectNormal;
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
#endif`,mv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Cv="gl_FragColor = linearToOutputTexel( gl_FragColor );",xv=`
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
}`,_v=`#ifdef USE_ENVMAP
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
#endif`,Ev=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yv=`#ifdef USE_ENVMAP
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
#endif`,Sv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Uv=`#ifdef USE_ENVMAP
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
#endif`,Mv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Tv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Iv=`#ifdef USE_GRADIENTMAP
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
}`,Qv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dv=`uniform bool receiveShadow;
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
#endif`,Pv=`#ifdef USE_ENVMAP
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
#endif`,Hv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Nv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ov=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vv=`PhysicalMaterial material;
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
#endif`,kv=`struct PhysicalMaterial {
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
}`,zv=`
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
#endif`,Kv=`#if defined( RE_IndirectDiffuse )
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
#endif`,Wv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$v=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ew=`#if defined( USE_POINTS_UV )
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
#endif`,tw=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Aw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,nw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,iw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,rw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sw=`#ifdef USE_MORPHTARGETS
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
#endif`,aw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ow=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,lw=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fw=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hw=`#ifdef USE_NORMALMAP
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
#endif`,dw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bw=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vw=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ww=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_w=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ew=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Uw=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Mw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,bw=`float getShadowMask() {
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
}`,Fw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tw=`#ifdef USE_SKINNING
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
#endif`,Iw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qw=`#ifdef USE_SKINNING
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
#endif`,Lw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Rw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hw=`#ifdef USE_TRANSMISSION
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
#endif`,Nw=`#ifdef USE_TRANSMISSION
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
#endif`,Ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kw=`uniform sampler2D t2D;
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
}`,Ww=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Yw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zw=`#include <common>
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
}`,qw=`#if DEPTH_PACKING == 3200
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
}`,jw=`#define DISTANCE
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
}`,$w=`#define DISTANCE
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
}`,eC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AC=`uniform float scale;
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
}`,nC=`uniform vec3 diffuse;
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
}`,iC=`#include <common>
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
}`,rC=`uniform vec3 diffuse;
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
}`,sC=`#define LAMBERT
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
}`,aC=`#define LAMBERT
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
}`,oC=`#define MATCAP
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
}`,lC=`#define MATCAP
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
}`,cC=`#define NORMAL
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
}`,uC=`#define NORMAL
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
}`,fC=`#define PHONG
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
}`,hC=`#define PHONG
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
}`,dC=`#define STANDARD
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
}`,pC=`#define STANDARD
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
}`,gC=`#define TOON
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
}`,mC=`#define TOON
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
}`,BC=`uniform float size;
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
}`,vC=`uniform vec3 diffuse;
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
}`,wC=`#include <common>
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
}`,CC=`uniform vec3 color;
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
}`,xC=`uniform float rotation;
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
}`,_C=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:KB,alphahash_pars_fragment:WB,alphamap_fragment:XB,alphamap_pars_fragment:YB,alphatest_fragment:JB,alphatest_pars_fragment:ZB,aomap_fragment:qB,aomap_pars_fragment:jB,batching_pars_vertex:$B,batching_vertex:ev,begin_vertex:tv,beginnormal_vertex:Av,bsdfs:nv,iridescence_fragment:iv,bumpmap_pars_fragment:rv,clipping_planes_fragment:sv,clipping_planes_pars_fragment:av,clipping_planes_pars_vertex:ov,clipping_planes_vertex:lv,color_fragment:cv,color_pars_fragment:uv,color_pars_vertex:fv,color_vertex:hv,common:dv,cube_uv_reflection_fragment:pv,defaultnormal_vertex:gv,displacementmap_pars_vertex:mv,displacementmap_vertex:Bv,emissivemap_fragment:vv,emissivemap_pars_fragment:wv,colorspace_fragment:Cv,colorspace_pars_fragment:xv,envmap_fragment:_v,envmap_common_pars_fragment:Ev,envmap_pars_fragment:yv,envmap_pars_vertex:Sv,envmap_physical_pars_fragment:Pv,envmap_vertex:Uv,fog_vertex:Mv,fog_pars_vertex:bv,fog_fragment:Fv,fog_pars_fragment:Tv,gradientmap_pars_fragment:Iv,lightmap_pars_fragment:Qv,lights_lambert_fragment:Lv,lights_lambert_pars_fragment:Rv,lights_pars_begin:Dv,lights_toon_fragment:Hv,lights_toon_pars_fragment:Nv,lights_phong_fragment:Ov,lights_phong_pars_fragment:Gv,lights_physical_fragment:Vv,lights_physical_pars_fragment:kv,lights_fragment_begin:zv,lights_fragment_maps:Kv,lights_fragment_end:Wv,logdepthbuf_fragment:Xv,logdepthbuf_pars_fragment:Yv,logdepthbuf_pars_vertex:Jv,logdepthbuf_vertex:Zv,map_fragment:qv,map_pars_fragment:jv,map_particle_fragment:$v,map_particle_pars_fragment:ew,metalnessmap_fragment:tw,metalnessmap_pars_fragment:Aw,morphinstance_vertex:nw,morphcolor_vertex:iw,morphnormal_vertex:rw,morphtarget_pars_vertex:sw,morphtarget_vertex:aw,normal_fragment_begin:ow,normal_fragment_maps:lw,normal_pars_fragment:cw,normal_pars_vertex:uw,normal_vertex:fw,normalmap_pars_fragment:hw,clearcoat_normal_fragment_begin:dw,clearcoat_normal_fragment_maps:pw,clearcoat_pars_fragment:gw,iridescence_pars_fragment:mw,opaque_fragment:Bw,packing:vw,premultiplied_alpha_fragment:ww,project_vertex:Cw,dithering_fragment:xw,dithering_pars_fragment:_w,roughnessmap_fragment:Ew,roughnessmap_pars_fragment:yw,shadowmap_pars_fragment:Sw,shadowmap_pars_vertex:Uw,shadowmap_vertex:Mw,shadowmask_pars_fragment:bw,skinbase_vertex:Fw,skinning_pars_vertex:Tw,skinning_vertex:Iw,skinnormal_vertex:Qw,specularmap_fragment:Lw,specularmap_pars_fragment:Rw,tonemapping_fragment:Dw,tonemapping_pars_fragment:Pw,transmission_fragment:Hw,transmission_pars_fragment:Nw,uv_pars_fragment:Ow,uv_pars_vertex:Gw,uv_vertex:Vw,worldpos_vertex:kw,background_vert:zw,background_frag:Kw,backgroundCube_vert:Ww,backgroundCube_frag:Xw,cube_vert:Yw,cube_frag:Jw,depth_vert:Zw,depth_frag:qw,distanceRGBA_vert:jw,distanceRGBA_frag:$w,equirect_vert:eC,equirect_frag:tC,linedashed_vert:AC,linedashed_frag:nC,meshbasic_vert:iC,meshbasic_frag:rC,meshlambert_vert:sC,meshlambert_frag:aC,meshmatcap_vert:oC,meshmatcap_frag:lC,meshnormal_vert:cC,meshnormal_frag:uC,meshphong_vert:fC,meshphong_frag:hC,meshphysical_vert:dC,meshphysical_frag:pC,meshtoon_vert:gC,meshtoon_frag:mC,points_vert:BC,points_frag:vC,shadow_vert:wC,shadow_frag:CC,sprite_vert:xC,sprite_frag:_C},le={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},nn={basic:{uniforms:cA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:cA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Ke(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:cA([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:cA([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:cA([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Ke(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:cA([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:cA([le.points,le.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:cA([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:cA([le.common,le.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:cA([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:cA([le.sprite,le.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:cA([le.common,le.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:cA([le.lights,le.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};nn.physical={uniforms:cA([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const ra={r:0,b:0,g:0},ai=new on,EC=new ut;function yC(n,e,t,A,i,r,s){const a=new Ke(0);let o=r===!0?0:1,l,c,u=null,f=0,p=null;function g(B){let w=B.isScene===!0?B.background:null;return w&&w.isTexture&&(w=(B.backgroundBlurriness>0?t:e).get(w)),w}function m(B){let w=!1;const C=g(B);C===null?h(a,o):C&&C.isColor&&(h(C,1),w=!0);const b=n.xr.getEnvironmentBlendMode();b==="additive"?A.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&A.buffers.color.setClear(0,0,0,0,s),(n.autoClear||w)&&(A.buffers.depth.setTest(!0),A.buffers.depth.setMask(!0),A.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function d(B,w){const C=g(w);C&&(C.isCubeTexture||C.mapping===Wo)?(c===void 0&&(c=new xt(new Li(1,1,1),new Kt({name:"BackgroundCubeMaterial",uniforms:Mr(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:tA,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,y,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),ai.copy(w.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),c.material.uniforms.envMap.value=C,c.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(EC.makeRotationFromEuler(ai)),c.material.toneMapped=ot.getTransfer(C.colorSpace)!==mt,(u!==C||f!==C.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=C,f=C.version,p=n.toneMapping),c.layers.enableAll(),B.unshift(c,c.geometry,c.material,0,0,null)):C&&C.isTexture&&(l===void 0&&(l=new xt(new $n(2,2),new Kt({name:"BackgroundMaterial",uniforms:Mr(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=C,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ot.getTransfer(C.colorSpace)!==mt,C.matrixAutoUpdate===!0&&C.updateMatrix(),l.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||f!==C.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=C,f=C.version,p=n.toneMapping),l.layers.enableAll(),B.unshift(l,l.geometry,l.material,0,0,null))}function h(B,w){B.getRGB(ra,hg(n)),A.buffers.color.setClear(ra.r,ra.g,ra.b,w,s)}return{getClearColor:function(){return a},setClearColor:function(B,w=1){a.set(B),o=w,h(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(B){o=B,h(a,o)},render:m,addToRenderList:d}}function SC(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),A={},i=f(null);let r=i,s=!1;function a(x,L,z,D,O){let Z=!1;const V=u(D,z,L);r!==V&&(r=V,l(r.object)),Z=p(x,D,z,O),Z&&g(x,D,z,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(Z||s)&&(s=!1,C(x,L,z,D),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function o(){return n.createVertexArray()}function l(x){return n.bindVertexArray(x)}function c(x){return n.deleteVertexArray(x)}function u(x,L,z){const D=z.wireframe===!0;let O=A[x.id];O===void 0&&(O={},A[x.id]=O);let Z=O[L.id];Z===void 0&&(Z={},O[L.id]=Z);let V=Z[D];return V===void 0&&(V=f(o()),Z[D]=V),V}function f(x){const L=[],z=[],D=[];for(let O=0;O<t;O++)L[O]=0,z[O]=0,D[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:D,object:x,attributes:{},index:null}}function p(x,L,z,D){const O=r.attributes,Z=L.attributes;let V=0;const q=z.getAttributes();for(const X in q)if(q[X].location>=0){const ae=O[X];let he=Z[X];if(he===void 0&&(X==="instanceMatrix"&&x.instanceMatrix&&(he=x.instanceMatrix),X==="instanceColor"&&x.instanceColor&&(he=x.instanceColor)),ae===void 0||ae.attribute!==he||he&&ae.data!==he.data)return!0;V++}return r.attributesNum!==V||r.index!==D}function g(x,L,z,D){const O={},Z=L.attributes;let V=0;const q=z.getAttributes();for(const X in q)if(q[X].location>=0){let ae=Z[X];ae===void 0&&(X==="instanceMatrix"&&x.instanceMatrix&&(ae=x.instanceMatrix),X==="instanceColor"&&x.instanceColor&&(ae=x.instanceColor));const he={};he.attribute=ae,ae&&ae.data&&(he.data=ae.data),O[X]=he,V++}r.attributes=O,r.attributesNum=V,r.index=D}function m(){const x=r.newAttributes;for(let L=0,z=x.length;L<z;L++)x[L]=0}function d(x){h(x,0)}function h(x,L){const z=r.newAttributes,D=r.enabledAttributes,O=r.attributeDivisors;z[x]=1,D[x]===0&&(n.enableVertexAttribArray(x),D[x]=1),O[x]!==L&&(n.vertexAttribDivisor(x,L),O[x]=L)}function B(){const x=r.newAttributes,L=r.enabledAttributes;for(let z=0,D=L.length;z<D;z++)L[z]!==x[z]&&(n.disableVertexAttribArray(z),L[z]=0)}function w(x,L,z,D,O,Z,V){V===!0?n.vertexAttribIPointer(x,L,z,O,Z):n.vertexAttribPointer(x,L,z,D,O,Z)}function C(x,L,z,D){m();const O=D.attributes,Z=z.getAttributes(),V=L.defaultAttributeValues;for(const q in Z){const X=Z[q];if(X.location>=0){let re=O[q];if(re===void 0&&(q==="instanceMatrix"&&x.instanceMatrix&&(re=x.instanceMatrix),q==="instanceColor"&&x.instanceColor&&(re=x.instanceColor)),re!==void 0){const ae=re.normalized,he=re.itemSize,Ie=e.get(re);if(Ie===void 0)continue;const Oe=Ie.buffer,J=Ie.type,ee=Ie.bytesPerElement,ue=J===n.INT||J===n.UNSIGNED_INT||re.gpuType===af;if(re.isInterleavedBufferAttribute){const ce=re.data,be=ce.stride,Te=re.offset;if(ce.isInstancedInterleavedBuffer){for(let Ge=0;Ge<X.locationSize;Ge++)h(X.location+Ge,ce.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ge=0;Ge<X.locationSize;Ge++)d(X.location+Ge);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let Ge=0;Ge<X.locationSize;Ge++)w(X.location+Ge,he/X.locationSize,J,ae,be*ee,(Te+he/X.locationSize*Ge)*ee,ue)}else{if(re.isInstancedBufferAttribute){for(let ce=0;ce<X.locationSize;ce++)h(X.location+ce,re.meshPerAttribute);x.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ce=0;ce<X.locationSize;ce++)d(X.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Oe);for(let ce=0;ce<X.locationSize;ce++)w(X.location+ce,he/X.locationSize,J,ae,he*ee,he/X.locationSize*ce*ee,ue)}}else if(V!==void 0){const ae=V[q];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(X.location,ae);break;case 3:n.vertexAttrib3fv(X.location,ae);break;case 4:n.vertexAttrib4fv(X.location,ae);break;default:n.vertexAttrib1fv(X.location,ae)}}}}B()}function b(){R();for(const x in A){const L=A[x];for(const z in L){const D=L[z];for(const O in D)c(D[O].object),delete D[O];delete L[z]}delete A[x]}}function y(x){if(A[x.id]===void 0)return;const L=A[x.id];for(const z in L){const D=L[z];for(const O in D)c(D[O].object),delete D[O];delete L[z]}delete A[x.id]}function M(x){for(const L in A){const z=A[L];if(z[x.id]===void 0)continue;const D=z[x.id];for(const O in D)c(D[O].object),delete D[O];delete z[x.id]}}function R(){E(),s=!0,r!==i&&(r=i,l(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:E,dispose:b,releaseStatesOfGeometry:y,releaseStatesOfProgram:M,initAttributes:m,enableAttribute:d,disableUnusedAttributes:B}}function UC(n,e,t){let A;function i(l){A=l}function r(l,c){n.drawArrays(A,l,c),t.update(c,A,1)}function s(l,c,u){u!==0&&(n.drawArraysInstanced(A,l,c,u),t.update(c,A,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(A,l,0,c,0,u);let p=0;for(let g=0;g<u;g++)p+=c[g];t.update(p,A,1)}function o(l,c,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)s(l[g],c[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(A,l,0,c,0,f,0,u);let g=0;for(let m=0;m<u;m++)g+=c[m];for(let m=0;m<f.length;m++)t.update(g,A,f[m])}}this.setMode=i,this.render=r,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=o}function MC(n,e,t,A){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(y){return!(y!==ZA&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){const M=y===Qr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==jA&&A.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==xn&&!M)}function o(y){if(y==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const c=o(l);c!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",c,"instead."),l=c);const u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),h=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),B=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:o,textureFormatReadable:s,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:h,maxVaryings:B,maxFragmentUniforms:w,vertexTextures:C,maxSamples:b}}function bC(n){const e=this;let t=null,A=0,i=!1,r=!1;const s=new Hn,a=new Xe,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||A!==0||i;return i=f,A=u.length,p},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=c(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,m=u.clipIntersection,d=u.clipShadows,h=n.get(u);if(!i||g===null||g.length===0||r&&!d)r?c(null):l();else{const B=r?0:A,w=B*4;let C=h.clippingState||null;o.value=C,C=c(g,f,w,p);for(let b=0;b!==w;++b)C[b]=t[b];h.clippingState=C,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=B}};function l(){o.value!==t&&(o.value=t,o.needsUpdate=A>0),e.numPlanes=A,e.numIntersection=0}function c(u,f,p,g){const m=u!==null?u.length:0;let d=null;if(m!==0){if(d=o.value,g!==!0||d===null){const h=p+m*4,B=f.matrixWorldInverse;a.getNormalMatrix(B),(d===null||d.length<h)&&(d=new Float32Array(h));for(let w=0,C=p;w!==m;++w,C+=4)s.copy(u[w]).applyMatrix4(B,a),s.normal.toArray(d,C),d[C+3]=s.constant}o.value=d,o.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,d}}function FC(n){let e=new WeakMap;function t(s,a){return a===Dc?s.mapping=Er:a===Pc&&(s.mapping=yr),s}function A(s){if(s&&s.isTexture){const a=s.mapping;if(a===Dc||a===Pc)if(e.has(s)){const o=e.get(s).texture;return t(o,s.mapping)}else{const o=s.image;if(o&&o.height>0){const l=new GB(o.height);return l.fromEquirectangularTexture(n,s),e.set(s,l),s.addEventListener("dispose",i),t(l.texture,s.mapping)}else return null}}return s}function i(s){const a=s.target;a.removeEventListener("dispose",i);const o=e.get(a);o!==void 0&&(e.delete(a),o.dispose())}function r(){e=new WeakMap}return{get:A,dispose:r}}class Bg extends pg{constructor(e=-1,t=1,A=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=A,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,A,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),A=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=A-e,s=A+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,s=r+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const fr=4,vh=[.125,.215,.35,.446,.526,.582],fi=20,Pl=new Bg,wh=new Ke;let Hl=null,Nl=0,Ol=0,Gl=!1;const ci=(1+Math.sqrt(5))/2,er=1/ci,Ch=[new F(-ci,er,0),new F(ci,er,0),new F(-er,0,ci),new F(er,0,ci),new F(0,ci,-er),new F(0,ci,er),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class xh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,A=.1,i=100){Hl=this._renderer.getRenderTarget(),Nl=this._renderer.getActiveCubeFace(),Ol=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,A,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Hl,Nl,Ol),this._renderer.xr.enabled=Gl,e.scissorTest=!1,sa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Er||e.mapping===yr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hl=this._renderer.getRenderTarget(),Nl=this._renderer.getActiveCubeFace(),Ol=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const A=t||this._allocateTargets();return this._textureToCubeUV(e,A),this._applyPMREM(A),this._cleanup(A),A}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,A={magFilter:jt,minFilter:jt,generateMipmaps:!1,type:Qr,format:ZA,colorSpace:ti,depthBuffer:!1},i=_h(e,t,A);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_h(e,t,A);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=TC(r)),this._blurMaterial=IC(r,e,t)}return i}_compileMaterial(e){const t=new xt(this._lodPlanes[0],e);this._renderer.compile(t,Pl)}_sceneToCubeUV(e,t,A,i){const a=new yA(90,1,t,A),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,f=c.toneMapping;c.getClearColor(wh),c.toneMapping=Xn,c.autoClear=!1;const p=new vi({name:"PMREM.Background",side:tA,depthWrite:!1,depthTest:!1}),g=new xt(new Li,p);let m=!1;const d=e.background;d?d.isColor&&(p.color.copy(d),e.background=null,m=!0):(p.color.copy(wh),m=!0);for(let h=0;h<6;h++){const B=h%3;B===0?(a.up.set(0,o[h],0),a.lookAt(l[h],0,0)):B===1?(a.up.set(0,0,o[h]),a.lookAt(0,l[h],0)):(a.up.set(0,o[h],0),a.lookAt(0,0,l[h]));const w=this._cubeSize;sa(i,B*w,h>2?w:0,w,w),c.setRenderTarget(i),m&&c.render(g,a),c.render(e,a)}g.geometry.dispose(),g.material.dispose(),c.toneMapping=f,c.autoClear=u,e.background=d}_textureToCubeUV(e,t){const A=this._renderer,i=e.mapping===Er||e.mapping===yr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=yh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eh());const r=i?this._cubemapMaterial:this._equirectMaterial,s=new xt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const o=this._cubeSize;sa(t,0,0,3*o,2*o),A.setRenderTarget(t),A.render(s,Pl)}_applyPMREM(e){const t=this._renderer,A=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ch[(i-r-1)%Ch.length];this._blur(e,r-1,r,s,a)}t.autoClear=A}_blur(e,t,A,i,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,A,i,"latitudinal",r),this._halfBlur(s,e,A,A,i,"longitudinal",r)}_halfBlur(e,t,A,i,r,s,a){const o=this._renderer,l=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new xt(this._lodPlanes[i],l),f=l.uniforms,p=this._sizeLods[A]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*fi-1),m=r/g,d=isFinite(r)?1+Math.floor(c*m):fi;d>fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${fi}`);const h=[];let B=0;for(let M=0;M<fi;++M){const R=M/m,E=Math.exp(-R*R/2);h.push(E),M===0?B+=E:M<d&&(B+=2*E)}for(let M=0;M<h.length;M++)h[M]=h[M]/B;f.envMap.value=e.texture,f.samples.value=d,f.weights.value=h,f.latitudinal.value=s==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:w}=this;f.dTheta.value=g,f.mipInt.value=w-A;const C=this._sizeLods[i],b=3*C*(i>w-fr?i-w+fr:0),y=4*(this._cubeSize-C);sa(t,b,y,3*C,2*C),o.setRenderTarget(t),o.render(u,Pl)}}function TC(n){const e=[],t=[],A=[];let i=n;const r=n-fr+1+vh.length;for(let s=0;s<r;s++){const a=Math.pow(2,i);t.push(a);let o=1/a;s>n-fr?o=vh[s-n+fr-1]:s===0&&(o=0),A.push(o);const l=1/(a-2),c=-l,u=1+l,f=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,g=6,m=3,d=2,h=1,B=new Float32Array(m*g*p),w=new Float32Array(d*g*p),C=new Float32Array(h*g*p);for(let y=0;y<p;y++){const M=y%3*2/3-1,R=y>2?0:-1,E=[M,R,0,M+2/3,R,0,M+2/3,R+1,0,M,R,0,M+2/3,R+1,0,M,R+1,0];B.set(E,m*g*y),w.set(f,d*g*y);const x=[y,y,y,y,y,y];C.set(x,h*g*y)}const b=new Gt;b.setAttribute("position",new $t(B,m)),b.setAttribute("uv",new $t(w,d)),b.setAttribute("faceIndex",new $t(C,h)),e.push(b),i>fr&&i--}return{lodPlanes:e,sizeLods:t,sigmas:A}}function _h(n,e,t){const A=new jn(n,e,t);return A.texture.mapping=Wo,A.texture.name="PMREM.cubeUv",A.scissorTest=!0,A}function sa(n,e,t,A,i){n.viewport.set(e,t,A,i),n.scissor.set(e,t,A,i)}function IC(n,e,t){const A=new Float32Array(fi),i=new F(0,1,0);return new Kt({name:"SphericalGaussianBlur",defines:{n:fi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:A},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:mf(),fragmentShader:`

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
		`,blending:En,depthTest:!1,depthWrite:!1})}function Eh(){return new Kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mf(),fragmentShader:`

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
		`,blending:En,depthTest:!1,depthWrite:!1})}function yh(){return new Kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function mf(){return`

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
	`}function QC(n){let e=new WeakMap,t=null;function A(a){if(a&&a.isTexture){const o=a.mapping,l=o===Dc||o===Pc,c=o===Er||o===yr;if(l||c){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new xh(n)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||c&&p&&i(p)?(t===null&&(t=new xh(n)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let o=0;const l=6;for(let c=0;c<l;c++)a[c]!==void 0&&o++;return o===l}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:A,dispose:s}}function LC(n){const e={};function t(A){if(e[A]!==void 0)return e[A];let i;switch(A){case"WEBGL_depth_texture":i=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=n.getExtension(A)}return e[A]=i,i}return{has:function(A){return t(A)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(A){const i=t(A);return i===null&&us("THREE.WebGLRenderer: "+A+" extension not supported."),i}}}function RC(n,e,t,A){const i={},r=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const m=f.morphAttributes[g];for(let d=0,h=m.length;d<h;d++)e.remove(m[d])}f.removeEventListener("dispose",s),delete i[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),A.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",s),i[f.id]=!0,t.memory.geometries++),f}function o(u){const f=u.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const m=p[g];for(let d=0,h=m.length;d<h;d++)e.update(m[d],n.ARRAY_BUFFER)}}function l(u){const f=[],p=u.index,g=u.attributes.position;let m=0;if(p!==null){const B=p.array;m=p.version;for(let w=0,C=B.length;w<C;w+=3){const b=B[w+0],y=B[w+1],M=B[w+2];f.push(b,y,y,M,M,b)}}else if(g!==void 0){const B=g.array;m=g.version;for(let w=0,C=B.length/3-1;w<C;w+=3){const b=w+0,y=w+1,M=w+2;f.push(b,y,y,M,M,b)}}else return;const d=new(ag(f)?fg:ug)(f,1);d.version=m;const h=r.get(u);h&&e.remove(h),r.set(u,d)}function c(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:o,getWireframeAttribute:c}}function DC(n,e,t){let A;function i(f){A=f}let r,s;function a(f){r=f.type,s=f.bytesPerElement}function o(f,p){n.drawElements(A,p,r,f*s),t.update(p,A,1)}function l(f,p,g){g!==0&&(n.drawElementsInstanced(A,p,r,f*s,g),t.update(p,A,g))}function c(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(A,p,0,r,f,0,g);let d=0;for(let h=0;h<g;h++)d+=p[h];t.update(d,A,1)}function u(f,p,g,m){if(g===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<f.length;h++)l(f[h]/s,p[h],m[h]);else{d.multiDrawElementsInstancedWEBGL(A,p,0,r,f,0,m,0,g);let h=0;for(let B=0;B<g;B++)h+=p[B];for(let B=0;B<m.length;B++)t.update(h,A,m[B])}}this.setMode=i,this.setIndex=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function PC(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function A(r,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:A}}function HC(n,e,t){const A=new WeakMap,i=new ct;function r(s,a,o){const l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=c!==void 0?c.length:0;let f=A.get(a);if(f===void 0||f.count!==u){let E=function(){M.dispose(),A.delete(a),a.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],h=a.morphAttributes.normal||[],B=a.morphAttributes.color||[];let w=0;p===!0&&(w=1),g===!0&&(w=2),m===!0&&(w=3);let C=a.attributes.position.count*w,b=1;C>e.maxTextureSize&&(b=Math.ceil(C/e.maxTextureSize),C=e.maxTextureSize);const y=new Float32Array(C*b*4*u),M=new lg(y,C,b,u);M.type=xn,M.needsUpdate=!0;const R=w*4;for(let x=0;x<u;x++){const L=d[x],z=h[x],D=B[x],O=C*b*4*x;for(let Z=0;Z<L.count;Z++){const V=Z*R;p===!0&&(i.fromBufferAttribute(L,Z),y[O+V+0]=i.x,y[O+V+1]=i.y,y[O+V+2]=i.z,y[O+V+3]=0),g===!0&&(i.fromBufferAttribute(z,Z),y[O+V+4]=i.x,y[O+V+5]=i.y,y[O+V+6]=i.z,y[O+V+7]=0),m===!0&&(i.fromBufferAttribute(D,Z),y[O+V+8]=i.x,y[O+V+9]=i.y,y[O+V+10]=i.z,y[O+V+11]=D.itemSize===4?i.w:1)}}f={count:u,texture:M,size:new Ue(C,b)},A.set(a,f),a.addEventListener("dispose",E)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let p=0;for(let m=0;m<l.length;m++)p+=l[m];const g=a.morphTargetsRelative?1:1-p;o.getUniforms().setValue(n,"morphTargetBaseInfluence",g),o.getUniforms().setValue(n,"morphTargetInfluences",l)}o.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),o.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function NC(n,e,t,A){let i=new WeakMap;function r(o){const l=A.render.frame,c=o.geometry,u=e.get(o,c);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),o.isInstancedMesh&&(o.hasEventListener("dispose",a)===!1&&o.addEventListener("dispose",a),i.get(o)!==l&&(t.update(o.instanceMatrix,n.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,n.ARRAY_BUFFER),i.set(o,l))),o.isSkinnedMesh){const f=o.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function s(){i=new WeakMap}function a(o){const l=o.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:s}}class vg extends dA{constructor(e,t,A,i,r,s,a,o,l,c=mr){if(c!==mr&&c!==Ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");A===void 0&&c===mr&&(A=Mi),A===void 0&&c===Ur&&(A=Sr),super(null,i,r,s,a,o,c,A,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:HA,this.minFilter=o!==void 0?o:HA,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const wg=new dA,Sh=new vg(1,1),Cg=new lg,xg=new df,_g=new gg,Uh=[],Mh=[],bh=new Float32Array(16),Fh=new Float32Array(9),Th=new Float32Array(4);function Lr(n,e,t){const A=n[0];if(A<=0||A>0)return n;const i=e*t;let r=Uh[i];if(r===void 0&&(r=new Float32Array(i),Uh[i]=r),e!==0){A.toArray(r,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(r,a)}return r}function Nt(n,e){if(n.length!==e.length)return!1;for(let t=0,A=n.length;t<A;t++)if(n[t]!==e[t])return!1;return!0}function Ot(n,e){for(let t=0,A=e.length;t<A;t++)n[t]=e[t]}function Jo(n,e){let t=Mh[e];t===void 0&&(t=new Int32Array(e),Mh[e]=t);for(let A=0;A!==e;++A)t[A]=n.allocateTextureUnit();return t}function OC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function GC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2fv(this.addr,e),Ot(t,e)}}function VC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;n.uniform3fv(this.addr,e),Ot(t,e)}}function kC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4fv(this.addr,e),Ot(t,e)}}function zC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Nt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,A))return;Th.set(A),n.uniformMatrix2fv(this.addr,!1,Th),Ot(t,A)}}function KC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Nt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,A))return;Fh.set(A),n.uniformMatrix3fv(this.addr,!1,Fh),Ot(t,A)}}function WC(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(Nt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,A))return;bh.set(A),n.uniformMatrix4fv(this.addr,!1,bh),Ot(t,A)}}function XC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function YC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2iv(this.addr,e),Ot(t,e)}}function JC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3iv(this.addr,e),Ot(t,e)}}function ZC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4iv(this.addr,e),Ot(t,e)}}function qC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function jC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2uiv(this.addr,e),Ot(t,e)}}function $C(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3uiv(this.addr,e),Ot(t,e)}}function ex(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4uiv(this.addr,e),Ot(t,e)}}function tx(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i);let r;this.type===n.SAMPLER_2D_SHADOW?(Sh.compareFunction=sg,r=Sh):r=wg,t.setTexture2D(e||r,i)}function Ax(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture3D(e||xg,i)}function nx(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTextureCube(e||_g,i)}function ix(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture2DArray(e||Cg,i)}function rx(n){switch(n){case 5126:return OC;case 35664:return GC;case 35665:return VC;case 35666:return kC;case 35674:return zC;case 35675:return KC;case 35676:return WC;case 5124:case 35670:return XC;case 35667:case 35671:return YC;case 35668:case 35672:return JC;case 35669:case 35673:return ZC;case 5125:return qC;case 36294:return jC;case 36295:return $C;case 36296:return ex;case 35678:case 36198:case 36298:case 36306:case 35682:return tx;case 35679:case 36299:case 36307:return Ax;case 35680:case 36300:case 36308:case 36293:return nx;case 36289:case 36303:case 36311:case 36292:return ix}}function sx(n,e){n.uniform1fv(this.addr,e)}function ax(n,e){const t=Lr(e,this.size,2);n.uniform2fv(this.addr,t)}function ox(n,e){const t=Lr(e,this.size,3);n.uniform3fv(this.addr,t)}function lx(n,e){const t=Lr(e,this.size,4);n.uniform4fv(this.addr,t)}function cx(n,e){const t=Lr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function ux(n,e){const t=Lr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function fx(n,e){const t=Lr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function hx(n,e){n.uniform1iv(this.addr,e)}function dx(n,e){n.uniform2iv(this.addr,e)}function px(n,e){n.uniform3iv(this.addr,e)}function gx(n,e){n.uniform4iv(this.addr,e)}function mx(n,e){n.uniform1uiv(this.addr,e)}function Bx(n,e){n.uniform2uiv(this.addr,e)}function vx(n,e){n.uniform3uiv(this.addr,e)}function wx(n,e){n.uniform4uiv(this.addr,e)}function Cx(n,e,t){const A=this.cache,i=e.length,r=Jo(t,i);Nt(A,r)||(n.uniform1iv(this.addr,r),Ot(A,r));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||wg,r[s])}function xx(n,e,t){const A=this.cache,i=e.length,r=Jo(t,i);Nt(A,r)||(n.uniform1iv(this.addr,r),Ot(A,r));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||xg,r[s])}function _x(n,e,t){const A=this.cache,i=e.length,r=Jo(t,i);Nt(A,r)||(n.uniform1iv(this.addr,r),Ot(A,r));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||_g,r[s])}function Ex(n,e,t){const A=this.cache,i=e.length,r=Jo(t,i);Nt(A,r)||(n.uniform1iv(this.addr,r),Ot(A,r));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Cg,r[s])}function yx(n){switch(n){case 5126:return sx;case 35664:return ax;case 35665:return ox;case 35666:return lx;case 35674:return cx;case 35675:return ux;case 35676:return fx;case 5124:case 35670:return hx;case 35667:case 35671:return dx;case 35668:case 35672:return px;case 35669:case 35673:return gx;case 5125:return mx;case 36294:return Bx;case 36295:return vx;case 36296:return wx;case 35678:case 36198:case 36298:case 36306:case 35682:return Cx;case 35679:case 36299:case 36307:return xx;case 35680:case 36300:case 36308:case 36293:return _x;case 36289:case 36303:case 36311:case 36292:return Ex}}class Sx{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.setValue=rx(t.type)}}class Ux{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=yx(t.type)}}class Mx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,A){const i=this.seq;for(let r=0,s=i.length;r!==s;++r){const a=i[r];a.setValue(e,t[a.id],A)}}}const Vl=/(\w+)(\])?(\[|\.)?/g;function Ih(n,e){n.seq.push(e),n.map[e.id]=e}function bx(n,e,t){const A=n.name,i=A.length;for(Vl.lastIndex=0;;){const r=Vl.exec(A),s=Vl.lastIndex;let a=r[1];const o=r[2]==="]",l=r[3];if(o&&(a=a|0),l===void 0||l==="["&&s+2===i){Ih(t,l===void 0?new Sx(a,n,e):new Ux(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new Mx(a),Ih(t,u)),t=u}}}class Ao{constructor(e,t){this.seq=[],this.map={};const A=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<A;++i){const r=e.getActiveUniform(t,i),s=e.getUniformLocation(t,r.name);bx(r,s,this)}}setValue(e,t,A,i){const r=this.map[t];r!==void 0&&r.setValue(e,A,i)}setOptional(e,t,A){const i=t[A];i!==void 0&&this.setValue(e,A,i)}static upload(e,t,A,i){for(let r=0,s=t.length;r!==s;++r){const a=t[r],o=A[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,i)}}static seqWithValue(e,t){const A=[];for(let i=0,r=e.length;i!==r;++i){const s=e[i];s.id in t&&A.push(s)}return A}}function Qh(n,e,t){const A=n.createShader(e);return n.shaderSource(A,t),n.compileShader(A),A}const Fx=37297;let Tx=0;function Ix(n,e){const t=n.split(`
`),A=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=i;s<r;s++){const a=s+1;A.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return A.join(`
`)}function Qx(n){const e=ot.getPrimaries(ot.workingColorSpace),t=ot.getPrimaries(n);let A;switch(e===t?A="":e===po&&t===ho?A="LinearDisplayP3ToLinearSRGB":e===ho&&t===po&&(A="LinearSRGBToLinearDisplayP3"),n){case ti:case Yo:return[A,"LinearTransferOETF"];case YA:case hf:return[A,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[A,"LinearTransferOETF"]}}function Lh(n,e,t){const A=n.getShaderParameter(e,n.COMPILE_STATUS),i=n.getShaderInfoLog(e).trim();if(A&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const s=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Ix(n.getShaderSource(e),s)}else return i}function Lx(n,e){const t=Qx(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Rx(n,e){let t;switch(e){case eB:t="Linear";break;case tB:t="Reinhard";break;case AB:t="OptimizedCineon";break;case nB:t="ACESFilmic";break;case rB:t="AgX";break;case sB:t="Neutral";break;case iB:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const aa=new F;function Dx(){ot.getLuminanceCoefficients(aa);const n=aa.x.toFixed(4),e=aa.y.toFixed(4),t=aa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Px(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(es).join(`
`)}function Hx(n){const e=[];for(const t in n){const A=n[t];A!==!1&&e.push("#define "+t+" "+A)}return e.join(`
`)}function Nx(n,e){const t={},A=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let i=0;i<A;i++){const r=n.getActiveAttrib(e,i),s=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[s]={type:r.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function es(n){return n!==""}function Rh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Dh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ox=/^[ \t]*#include +<([\w\d./]+)>/gm;function hu(n){return n.replace(Ox,Vx)}const Gx=new Map;function Vx(n,e){let t=We[e];if(t===void 0){const A=Gx.get(e);if(A!==void 0)t=We[A],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,A);else throw new Error("Can not resolve #include <"+e+">")}return hu(t)}const kx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ph(n){return n.replace(kx,zx)}function zx(n,e,t,A){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=A.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Hh(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Kx(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Xp?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===S0?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===wn&&(e="SHADOWMAP_TYPE_VSM"),e}function Wx(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Er:case yr:e="ENVMAP_TYPE_CUBE";break;case Wo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Xx(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case yr:e="ENVMAP_MODE_REFRACTION";break}return e}function Yx(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Yp:e="ENVMAP_BLENDING_MULTIPLY";break;case j0:e="ENVMAP_BLENDING_MIX";break;case $0:e="ENVMAP_BLENDING_ADD";break}return e}function Jx(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,A=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:A,maxMip:t}}function Zx(n,e,t,A){const i=n.getContext(),r=t.defines;let s=t.vertexShader,a=t.fragmentShader;const o=Kx(t),l=Wx(t),c=Xx(t),u=Yx(t),f=Jx(t),p=Px(t),g=Hx(r),m=i.createProgram();let d,h,B=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(es).join(`
`),d.length>0&&(d+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(es).join(`
`),h.length>0&&(h+=`
`)):(d=[Hh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(es).join(`
`),h=[Hh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xn?"#define TONE_MAPPING":"",t.toneMapping!==Xn?We.tonemapping_pars_fragment:"",t.toneMapping!==Xn?Rx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Lx("linearToOutputTexel",t.outputColorSpace),Dx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(es).join(`
`)),s=hu(s),s=Rh(s,t),s=Dh(s,t),a=hu(a),a=Rh(a,t),a=Dh(a,t),s=Ph(s),a=Ph(a),t.isRawShaderMaterial!==!0&&(B=`#version 300 es
`,d=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,h=["#define varying in",t.glslVersion===go?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===go?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const w=B+d+s,C=B+h+a,b=Qh(i,i.VERTEX_SHADER,w),y=Qh(i,i.FRAGMENT_SHADER,C);i.attachShader(m,b),i.attachShader(m,y),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function M(L){if(n.debug.checkShaderErrors){const z=i.getProgramInfoLog(m).trim(),D=i.getShaderInfoLog(b).trim(),O=i.getShaderInfoLog(y).trim();let Z=!0,V=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(i,m,b,y);else{const q=Lh(i,b,"vertex"),X=Lh(i,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+q+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(D===""||O==="")&&(V=!1);V&&(L.diagnostics={runnable:Z,programLog:z,vertexShader:{log:D,prefix:d},fragmentShader:{log:O,prefix:h}})}i.deleteShader(b),i.deleteShader(y),R=new Ao(i,m),E=Nx(i,m)}let R;this.getUniforms=function(){return R===void 0&&M(this),R};let E;this.getAttributes=function(){return E===void 0&&M(this),E};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=i.getProgramParameter(m,Fx)),x},this.destroy=function(){A.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Tx++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=y,this}let qx=0;class jx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,A=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(A),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const A of t)A.usedTimes--,A.usedTimes===0&&this.shaderCache.delete(A.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let A=t.get(e);return A===void 0&&(A=new Set,t.set(e,A)),A}_getShaderStage(e){const t=this.shaderCache;let A=t.get(e);return A===void 0&&(A=new $x(e),t.set(e,A)),A}}class $x{constructor(e){this.id=qx++,this.code=e,this.usedTimes=0}}function e_(n,e,t,A,i,r,s){const a=new pf,o=new jx,l=new Set,c=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(E){return l.add(E),E===0?"uv":`uv${E}`}function d(E,x,L,z,D){const O=z.fog,Z=D.geometry,V=E.isMeshStandardMaterial?z.environment:null,q=(E.isMeshStandardMaterial?t:e).get(E.envMap||V),X=q&&q.mapping===Wo?q.image.height:null,re=g[E.type];E.precision!==null&&(p=i.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const ae=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,he=ae!==void 0?ae.length:0;let Ie=0;Z.morphAttributes.position!==void 0&&(Ie=1),Z.morphAttributes.normal!==void 0&&(Ie=2),Z.morphAttributes.color!==void 0&&(Ie=3);let Oe,J,ee,ue;if(re){const At=nn[re];Oe=At.vertexShader,J=At.fragmentShader}else Oe=E.vertexShader,J=E.fragmentShader,o.update(E),ee=o.getVertexShaderID(E),ue=o.getFragmentShaderID(E);const ce=n.getRenderTarget(),be=D.isInstancedMesh===!0,Te=D.isBatchedMesh===!0,Ge=!!E.map,et=!!E.matcap,Q=!!q,ht=!!E.aoMap,Je=!!E.lightMap,tt=!!E.bumpMap,_e=!!E.normalMap,Bt=!!E.displacementMap,He=!!E.emissiveMap,Ve=!!E.metalnessMap,I=!!E.roughnessMap,_=E.anisotropy>0,W=E.clearcoat>0,te=E.dispersion>0,ne=E.iridescence>0,$=E.sheen>0,Me=E.transmission>0,oe=_&&!!E.anisotropyMap,me=W&&!!E.clearcoatMap,ke=W&&!!E.clearcoatNormalMap,ie=W&&!!E.clearcoatRoughnessMap,Be=ne&&!!E.iridescenceMap,qe=ne&&!!E.iridescenceThicknessMap,Qe=$&&!!E.sheenColorMap,we=$&&!!E.sheenRoughnessMap,Re=!!E.specularMap,Ne=!!E.specularColorMap,vt=!!E.specularIntensityMap,v=Me&&!!E.transmissionMap,N=Me&&!!E.thicknessMap,G=!!E.gradientMap,Y=!!E.alphaMap,Ae=E.alphaTest>0,Ee=!!E.alphaHash,De=!!E.extensions;let Ut=Xn;E.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(Ut=n.toneMapping);const Lt={shaderID:re,shaderType:E.type,shaderName:E.name,vertexShader:Oe,fragmentShader:J,defines:E.defines,customVertexShaderID:ee,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Te,batchingColor:Te&&D._colorsTexture!==null,instancing:be,instancingColor:be&&D.instanceColor!==null,instancingMorph:be&&D.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:ti,alphaToCoverage:!!E.alphaToCoverage,map:Ge,matcap:et,envMap:Q,envMapMode:Q&&q.mapping,envMapCubeUVHeight:X,aoMap:ht,lightMap:Je,bumpMap:tt,normalMap:_e,displacementMap:f&&Bt,emissiveMap:He,normalMapObjectSpace:_e&&E.normalMapType===cB,normalMapTangentSpace:_e&&E.normalMapType===rg,metalnessMap:Ve,roughnessMap:I,anisotropy:_,anisotropyMap:oe,clearcoat:W,clearcoatMap:me,clearcoatNormalMap:ke,clearcoatRoughnessMap:ie,dispersion:te,iridescence:ne,iridescenceMap:Be,iridescenceThicknessMap:qe,sheen:$,sheenColorMap:Qe,sheenRoughnessMap:we,specularMap:Re,specularColorMap:Ne,specularIntensityMap:vt,transmission:Me,transmissionMap:v,thicknessMap:N,gradientMap:G,opaque:E.transparent===!1&&E.blending===gr&&E.alphaToCoverage===!1,alphaMap:Y,alphaTest:Ae,alphaHash:Ee,combine:E.combine,mapUv:Ge&&m(E.map.channel),aoMapUv:ht&&m(E.aoMap.channel),lightMapUv:Je&&m(E.lightMap.channel),bumpMapUv:tt&&m(E.bumpMap.channel),normalMapUv:_e&&m(E.normalMap.channel),displacementMapUv:Bt&&m(E.displacementMap.channel),emissiveMapUv:He&&m(E.emissiveMap.channel),metalnessMapUv:Ve&&m(E.metalnessMap.channel),roughnessMapUv:I&&m(E.roughnessMap.channel),anisotropyMapUv:oe&&m(E.anisotropyMap.channel),clearcoatMapUv:me&&m(E.clearcoatMap.channel),clearcoatNormalMapUv:ke&&m(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&m(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&m(E.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&m(E.iridescenceThicknessMap.channel),sheenColorMapUv:Qe&&m(E.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(E.sheenRoughnessMap.channel),specularMapUv:Re&&m(E.specularMap.channel),specularColorMapUv:Ne&&m(E.specularColorMap.channel),specularIntensityMapUv:vt&&m(E.specularIntensityMap.channel),transmissionMapUv:v&&m(E.transmissionMap.channel),thicknessMapUv:N&&m(E.thicknessMap.channel),alphaMapUv:Y&&m(E.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(_e||_),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!Z.attributes.uv&&(Ge||Y),fog:!!O,useFog:E.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:D.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ie,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ut,decodeVideoTexture:Ge&&E.map.isVideoTexture===!0&&ot.getTransfer(E.map.colorSpace)===mt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===MA,flipSided:E.side===tA,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:De&&E.extensions.clipCullDistance===!0&&A.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&E.extensions.multiDraw===!0||Te)&&A.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:A.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Lt.vertexUv1s=l.has(1),Lt.vertexUv2s=l.has(2),Lt.vertexUv3s=l.has(3),l.clear(),Lt}function h(E){const x=[];if(E.shaderID?x.push(E.shaderID):(x.push(E.customVertexShaderID),x.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)x.push(L),x.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(B(x,E),w(x,E),x.push(n.outputColorSpace)),x.push(E.customProgramCacheKey),x.join()}function B(E,x){E.push(x.precision),E.push(x.outputColorSpace),E.push(x.envMapMode),E.push(x.envMapCubeUVHeight),E.push(x.mapUv),E.push(x.alphaMapUv),E.push(x.lightMapUv),E.push(x.aoMapUv),E.push(x.bumpMapUv),E.push(x.normalMapUv),E.push(x.displacementMapUv),E.push(x.emissiveMapUv),E.push(x.metalnessMapUv),E.push(x.roughnessMapUv),E.push(x.anisotropyMapUv),E.push(x.clearcoatMapUv),E.push(x.clearcoatNormalMapUv),E.push(x.clearcoatRoughnessMapUv),E.push(x.iridescenceMapUv),E.push(x.iridescenceThicknessMapUv),E.push(x.sheenColorMapUv),E.push(x.sheenRoughnessMapUv),E.push(x.specularMapUv),E.push(x.specularColorMapUv),E.push(x.specularIntensityMapUv),E.push(x.transmissionMapUv),E.push(x.thicknessMapUv),E.push(x.combine),E.push(x.fogExp2),E.push(x.sizeAttenuation),E.push(x.morphTargetsCount),E.push(x.morphAttributeCount),E.push(x.numDirLights),E.push(x.numPointLights),E.push(x.numSpotLights),E.push(x.numSpotLightMaps),E.push(x.numHemiLights),E.push(x.numRectAreaLights),E.push(x.numDirLightShadows),E.push(x.numPointLightShadows),E.push(x.numSpotLightShadows),E.push(x.numSpotLightShadowsWithMaps),E.push(x.numLightProbes),E.push(x.shadowMapType),E.push(x.toneMapping),E.push(x.numClippingPlanes),E.push(x.numClipIntersection),E.push(x.depthPacking)}function w(E,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.skinning&&a.enable(4),x.morphTargets&&a.enable(5),x.morphNormals&&a.enable(6),x.morphColors&&a.enable(7),x.premultipliedAlpha&&a.enable(8),x.shadowMapEnabled&&a.enable(9),x.doubleSided&&a.enable(10),x.flipSided&&a.enable(11),x.useDepthPacking&&a.enable(12),x.dithering&&a.enable(13),x.transmission&&a.enable(14),x.sheen&&a.enable(15),x.opaque&&a.enable(16),x.pointsUvs&&a.enable(17),x.decodeVideoTexture&&a.enable(18),x.alphaToCoverage&&a.enable(19),E.push(a.mask)}function C(E){const x=g[E.type];let L;if(x){const z=nn[x];L=dg.clone(z.uniforms)}else L=E.uniforms;return L}function b(E,x){let L;for(let z=0,D=c.length;z<D;z++){const O=c[z];if(O.cacheKey===x){L=O,++L.usedTimes;break}}return L===void 0&&(L=new Zx(n,x,E,r),c.push(L)),L}function y(E){if(--E.usedTimes===0){const x=c.indexOf(E);c[x]=c[c.length-1],c.pop(),E.destroy()}}function M(E){o.remove(E)}function R(){o.dispose()}return{getParameters:d,getProgramCacheKey:h,getUniforms:C,acquireProgram:b,releaseProgram:y,releaseShaderCache:M,programs:c,dispose:R}}function t_(){let n=new WeakMap;function e(r){let s=n.get(r);return s===void 0&&(s={},n.set(r,s)),s}function t(r){n.delete(r)}function A(r,s,a){n.get(r)[s]=a}function i(){n=new WeakMap}return{get:e,remove:t,update:A,dispose:i}}function A_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Nh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Oh(){const n=[];let e=0;const t=[],A=[],i=[];function r(){e=0,t.length=0,A.length=0,i.length=0}function s(u,f,p,g,m,d){let h=n[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:m,group:d},n[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=m,h.group=d),e++,h}function a(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.push(h):p.transparent===!0?i.push(h):t.push(h)}function o(u,f,p,g,m,d){const h=s(u,f,p,g,m,d);p.transmission>0?A.unshift(h):p.transparent===!0?i.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||A_),A.length>1&&A.sort(f||Nh),i.length>1&&i.sort(f||Nh)}function c(){for(let u=e,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:A,transparent:i,init:r,push:a,unshift:o,finish:c,sort:l}}function n_(){let n=new WeakMap;function e(A,i){const r=n.get(A);let s;return r===void 0?(s=new Oh,n.set(A,[s])):i>=r.length?(s=new Oh,r.push(s)):s=r[i],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function i_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Ke};break;case"SpotLight":t={position:new F,direction:new F,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function r_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let s_=0;function a_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function o_(n){const e=new i_,t=r_(),A={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)A.probe.push(new F);const i=new F,r=new ut,s=new ut;function a(l){let c=0,u=0,f=0;for(let E=0;E<9;E++)A.probe[E].set(0,0,0);let p=0,g=0,m=0,d=0,h=0,B=0,w=0,C=0,b=0,y=0,M=0;l.sort(a_);for(let E=0,x=l.length;E<x;E++){const L=l[E],z=L.color,D=L.intensity,O=L.distance,Z=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)c+=z.r*D,u+=z.g*D,f+=z.b*D;else if(L.isLightProbe){for(let V=0;V<9;V++)A.probe[V].addScaledVector(L.sh.coefficients[V],D);M++}else if(L.isDirectionalLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const q=L.shadow,X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.directionalShadow[p]=X,A.directionalShadowMap[p]=Z,A.directionalShadowMatrix[p]=L.shadow.matrix,B++}A.directional[p]=V,p++}else if(L.isSpotLight){const V=e.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(z).multiplyScalar(D),V.distance=O,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,A.spot[m]=V;const q=L.shadow;if(L.map&&(A.spotLightMap[b]=L.map,b++,q.updateMatrices(L),L.castShadow&&y++),A.spotLightMatrix[m]=q.matrix,L.castShadow){const X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.spotShadow[m]=X,A.spotShadowMap[m]=Z,C++}m++}else if(L.isRectAreaLight){const V=e.get(L);V.color.copy(z).multiplyScalar(D),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),A.rectArea[d]=V,d++}else if(L.isPointLight){const V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const q=L.shadow,X=t.get(L);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,X.shadowCameraNear=q.camera.near,X.shadowCameraFar=q.camera.far,A.pointShadow[g]=X,A.pointShadowMap[g]=Z,A.pointShadowMatrix[g]=L.shadow.matrix,w++}A.point[g]=V,g++}else if(L.isHemisphereLight){const V=e.get(L);V.skyColor.copy(L.color).multiplyScalar(D),V.groundColor.copy(L.groundColor).multiplyScalar(D),A.hemi[h]=V,h++}}d>0&&(n.has("OES_texture_float_linear")===!0?(A.rectAreaLTC1=le.LTC_FLOAT_1,A.rectAreaLTC2=le.LTC_FLOAT_2):(A.rectAreaLTC1=le.LTC_HALF_1,A.rectAreaLTC2=le.LTC_HALF_2)),A.ambient[0]=c,A.ambient[1]=u,A.ambient[2]=f;const R=A.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==m||R.rectAreaLength!==d||R.hemiLength!==h||R.numDirectionalShadows!==B||R.numPointShadows!==w||R.numSpotShadows!==C||R.numSpotMaps!==b||R.numLightProbes!==M)&&(A.directional.length=p,A.spot.length=m,A.rectArea.length=d,A.point.length=g,A.hemi.length=h,A.directionalShadow.length=B,A.directionalShadowMap.length=B,A.pointShadow.length=w,A.pointShadowMap.length=w,A.spotShadow.length=C,A.spotShadowMap.length=C,A.directionalShadowMatrix.length=B,A.pointShadowMatrix.length=w,A.spotLightMatrix.length=C+b-y,A.spotLightMap.length=b,A.numSpotLightShadowsWithMaps=y,A.numLightProbes=M,R.directionalLength=p,R.pointLength=g,R.spotLength=m,R.rectAreaLength=d,R.hemiLength=h,R.numDirectionalShadows=B,R.numPointShadows=w,R.numSpotShadows=C,R.numSpotMaps=b,R.numLightProbes=M,A.version=s_++)}function o(l,c){let u=0,f=0,p=0,g=0,m=0;const d=c.matrixWorldInverse;for(let h=0,B=l.length;h<B;h++){const w=l[h];if(w.isDirectionalLight){const C=A.directional[u];C.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),C.direction.sub(i),C.direction.transformDirection(d),u++}else if(w.isSpotLight){const C=A.spot[p];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(d),C.direction.setFromMatrixPosition(w.matrixWorld),i.setFromMatrixPosition(w.target.matrixWorld),C.direction.sub(i),C.direction.transformDirection(d),p++}else if(w.isRectAreaLight){const C=A.rectArea[g];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(d),s.identity(),r.copy(w.matrixWorld),r.premultiply(d),s.extractRotation(r),C.halfWidth.set(w.width*.5,0,0),C.halfHeight.set(0,w.height*.5,0),C.halfWidth.applyMatrix4(s),C.halfHeight.applyMatrix4(s),g++}else if(w.isPointLight){const C=A.point[f];C.position.setFromMatrixPosition(w.matrixWorld),C.position.applyMatrix4(d),f++}else if(w.isHemisphereLight){const C=A.hemi[m];C.direction.setFromMatrixPosition(w.matrixWorld),C.direction.transformDirection(d),m++}}}return{setup:a,setupView:o,state:A}}function Gh(n){const e=new o_(n),t=[],A=[];function i(c){l.camera=c,t.length=0,A.length=0}function r(c){t.push(c)}function s(c){A.push(c)}function a(){e.setup(t)}function o(c){e.setupView(t,c)}const l={lightsArray:t,shadowsArray:A,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:o,pushLight:r,pushShadow:s}}function l_(n){let e=new WeakMap;function t(i,r=0){const s=e.get(i);let a;return s===void 0?(a=new Gh(n),e.set(i,[a])):r>=s.length?(a=new Gh(n),s.push(a)):a=s[r],a}function A(){e=new WeakMap}return{get:t,dispose:A}}class c_ extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=oB,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class u_ extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const f_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h_=`uniform sampler2D shadow_pass;
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
}`;function d_(n,e,t){let A=new gf;const i=new Ue,r=new Ue,s=new ct,a=new c_({depthPacking:lB}),o=new u_,l={},c=t.maxTextureSize,u={[qn]:tA,[tA]:qn,[MA]:MA},f=new Kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:f_,fragmentShader:h_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Gt;g.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new xt(g,f),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xp;let h=this.type;this.render=function(y,M,R){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||y.length===0)return;const E=n.getRenderTarget(),x=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),z=n.state;z.setBlending(En),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const D=h!==wn&&this.type===wn,O=h===wn&&this.type!==wn;for(let Z=0,V=y.length;Z<V;Z++){const q=y[Z],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const re=X.getFrameExtents();if(i.multiply(re),r.copy(X.mapSize),(i.x>c||i.y>c)&&(i.x>c&&(r.x=Math.floor(c/re.x),i.x=r.x*re.x,X.mapSize.x=r.x),i.y>c&&(r.y=Math.floor(c/re.y),i.y=r.y*re.y,X.mapSize.y=r.y)),X.map===null||D===!0||O===!0){const he=this.type!==wn?{minFilter:HA,magFilter:HA}:{};X.map!==null&&X.map.dispose(),X.map=new jn(i.x,i.y,he),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();const ae=X.getViewportCount();for(let he=0;he<ae;he++){const Ie=X.getViewport(he);s.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),z.viewport(s),X.updateMatrices(q,he),A=X.getFrustum(),C(M,R,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===wn&&B(X,R),X.needsUpdate=!1}h=this.type,d.needsUpdate=!1,n.setRenderTarget(E,x,L)};function B(y,M){const R=e.update(m);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,p.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new jn(i.x,i.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,n.setRenderTarget(y.mapPass),n.clear(),n.renderBufferDirect(M,null,R,f,m,null),p.uniforms.shadow_pass.value=y.mapPass.texture,p.uniforms.resolution.value=y.mapSize,p.uniforms.radius.value=y.radius,n.setRenderTarget(y.map),n.clear(),n.renderBufferDirect(M,null,R,p,m,null)}function w(y,M,R,E){let x=null;const L=R.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(L!==void 0)x=L;else if(x=R.isPointLight===!0?o:a,n.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){const z=x.uuid,D=M.uuid;let O=l[z];O===void 0&&(O={},l[z]=O);let Z=O[D];Z===void 0&&(Z=x.clone(),O[D]=Z,M.addEventListener("dispose",b)),x=Z}if(x.visible=M.visible,x.wireframe=M.wireframe,E===wn?x.side=M.shadowSide!==null?M.shadowSide:M.side:x.side=M.shadowSide!==null?M.shadowSide:u[M.side],x.alphaMap=M.alphaMap,x.alphaTest=M.alphaTest,x.map=M.map,x.clipShadows=M.clipShadows,x.clippingPlanes=M.clippingPlanes,x.clipIntersection=M.clipIntersection,x.displacementMap=M.displacementMap,x.displacementScale=M.displacementScale,x.displacementBias=M.displacementBias,x.wireframeLinewidth=M.wireframeLinewidth,x.linewidth=M.linewidth,R.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const z=n.properties.get(x);z.light=R}return x}function C(y,M,R,E,x){if(y.visible===!1)return;if(y.layers.test(M.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&x===wn)&&(!y.frustumCulled||A.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,y.matrixWorld);const D=e.update(y),O=y.material;if(Array.isArray(O)){const Z=D.groups;for(let V=0,q=Z.length;V<q;V++){const X=Z[V],re=O[X.materialIndex];if(re&&re.visible){const ae=w(y,re,E,x);y.onBeforeShadow(n,y,M,R,D,ae,X),n.renderBufferDirect(R,null,D,ae,y,X),y.onAfterShadow(n,y,M,R,D,ae,X)}}}else if(O.visible){const Z=w(y,O,E,x);y.onBeforeShadow(n,y,M,R,D,Z,null),n.renderBufferDirect(R,null,D,Z,y,null),y.onAfterShadow(n,y,M,R,D,Z,null)}}const z=y.children;for(let D=0,O=z.length;D<O;D++)C(z[D],M,R,E,x)}function b(y){y.target.removeEventListener("dispose",b);for(const R in l){const E=l[R],x=y.target.uuid;x in E&&(E[x].dispose(),delete E[x])}}}function p_(n){function e(){let v=!1;const N=new ct;let G=null;const Y=new ct(0,0,0,0);return{setMask:function(Ae){G!==Ae&&!v&&(n.colorMask(Ae,Ae,Ae,Ae),G=Ae)},setLocked:function(Ae){v=Ae},setClear:function(Ae,Ee,De,Ut,Lt){Lt===!0&&(Ae*=Ut,Ee*=Ut,De*=Ut),N.set(Ae,Ee,De,Ut),Y.equals(N)===!1&&(n.clearColor(Ae,Ee,De,Ut),Y.copy(N))},reset:function(){v=!1,G=null,Y.set(-1,0,0,0)}}}function t(){let v=!1,N=null,G=null,Y=null;return{setTest:function(Ae){Ae?ue(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(Ae){N!==Ae&&!v&&(n.depthMask(Ae),N=Ae)},setFunc:function(Ae){if(G!==Ae){switch(Ae){case K0:n.depthFunc(n.NEVER);break;case W0:n.depthFunc(n.ALWAYS);break;case X0:n.depthFunc(n.LESS);break;case uo:n.depthFunc(n.LEQUAL);break;case Y0:n.depthFunc(n.EQUAL);break;case J0:n.depthFunc(n.GEQUAL);break;case Z0:n.depthFunc(n.GREATER);break;case q0:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}G=Ae}},setLocked:function(Ae){v=Ae},setClear:function(Ae){Y!==Ae&&(n.clearDepth(Ae),Y=Ae)},reset:function(){v=!1,N=null,G=null,Y=null}}}function A(){let v=!1,N=null,G=null,Y=null,Ae=null,Ee=null,De=null,Ut=null,Lt=null;return{setTest:function(At){v||(At?ue(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(At){N!==At&&!v&&(n.stencilMask(At),N=At)},setFunc:function(At,Rt,Ft){(G!==At||Y!==Rt||Ae!==Ft)&&(n.stencilFunc(At,Rt,Ft),G=At,Y=Rt,Ae=Ft)},setOp:function(At,Rt,Ft){(Ee!==At||De!==Rt||Ut!==Ft)&&(n.stencilOp(At,Rt,Ft),Ee=At,De=Rt,Ut=Ft)},setLocked:function(At){v=At},setClear:function(At){Lt!==At&&(n.clearStencil(At),Lt=At)},reset:function(){v=!1,N=null,G=null,Y=null,Ae=null,Ee=null,De=null,Ut=null,Lt=null}}}const i=new e,r=new t,s=new A,a=new WeakMap,o=new WeakMap;let l={},c={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,B=null,w=null,C=null,b=null,y=new Ke(0,0,0),M=0,R=!1,E=null,x=null,L=null,z=null,D=null;const O=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,V=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(q)[1]),Z=V>=1):q.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Z=V>=2);let X=null,re={};const ae=n.getParameter(n.SCISSOR_BOX),he=n.getParameter(n.VIEWPORT),Ie=new ct().fromArray(ae),Oe=new ct().fromArray(he);function J(v,N,G,Y){const Ae=new Uint8Array(4),Ee=n.createTexture();n.bindTexture(v,Ee),n.texParameteri(v,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(v,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let De=0;De<G;De++)v===n.TEXTURE_3D||v===n.TEXTURE_2D_ARRAY?n.texImage3D(N,0,n.RGBA,1,1,Y,0,n.RGBA,n.UNSIGNED_BYTE,Ae):n.texImage2D(N+De,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ae);return Ee}const ee={};ee[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),ee[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ee[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),s.setClear(0),ue(n.DEPTH_TEST),r.setFunc(uo),tt(!1),_e(Jf),ue(n.CULL_FACE),ht(En);function ue(v){l[v]!==!0&&(n.enable(v),l[v]=!0)}function ce(v){l[v]!==!1&&(n.disable(v),l[v]=!1)}function be(v,N){return c[v]!==N?(n.bindFramebuffer(v,N),c[v]=N,v===n.DRAW_FRAMEBUFFER&&(c[n.FRAMEBUFFER]=N),v===n.FRAMEBUFFER&&(c[n.DRAW_FRAMEBUFFER]=N),!0):!1}function Te(v,N){let G=f,Y=!1;if(v){G=u.get(N),G===void 0&&(G=[],u.set(N,G));const Ae=v.textures;if(G.length!==Ae.length||G[0]!==n.COLOR_ATTACHMENT0){for(let Ee=0,De=Ae.length;Ee<De;Ee++)G[Ee]=n.COLOR_ATTACHMENT0+Ee;G.length=Ae.length,Y=!0}}else G[0]!==n.BACK&&(G[0]=n.BACK,Y=!0);Y&&n.drawBuffers(G)}function Ge(v){return p!==v?(n.useProgram(v),p=v,!0):!1}const et={[ui]:n.FUNC_ADD,[M0]:n.FUNC_SUBTRACT,[b0]:n.FUNC_REVERSE_SUBTRACT};et[F0]=n.MIN,et[T0]=n.MAX;const Q={[I0]:n.ZERO,[Q0]:n.ONE,[L0]:n.SRC_COLOR,[Lc]:n.SRC_ALPHA,[O0]:n.SRC_ALPHA_SATURATE,[H0]:n.DST_COLOR,[D0]:n.DST_ALPHA,[R0]:n.ONE_MINUS_SRC_COLOR,[Rc]:n.ONE_MINUS_SRC_ALPHA,[N0]:n.ONE_MINUS_DST_COLOR,[P0]:n.ONE_MINUS_DST_ALPHA,[G0]:n.CONSTANT_COLOR,[V0]:n.ONE_MINUS_CONSTANT_COLOR,[k0]:n.CONSTANT_ALPHA,[z0]:n.ONE_MINUS_CONSTANT_ALPHA};function ht(v,N,G,Y,Ae,Ee,De,Ut,Lt,At){if(v===En){g===!0&&(ce(n.BLEND),g=!1);return}if(g===!1&&(ue(n.BLEND),g=!0),v!==U0){if(v!==m||At!==R){if((d!==ui||w!==ui)&&(n.blendEquation(n.FUNC_ADD),d=ui,w=ui),At)switch(v){case gr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case GA:n.blendFunc(n.ONE,n.ONE);break;case Zf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}else switch(v){case gr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case GA:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Zf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case qf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",v);break}h=null,B=null,C=null,b=null,y.set(0,0,0),M=0,m=v,R=At}return}Ae=Ae||N,Ee=Ee||G,De=De||Y,(N!==d||Ae!==w)&&(n.blendEquationSeparate(et[N],et[Ae]),d=N,w=Ae),(G!==h||Y!==B||Ee!==C||De!==b)&&(n.blendFuncSeparate(Q[G],Q[Y],Q[Ee],Q[De]),h=G,B=Y,C=Ee,b=De),(Ut.equals(y)===!1||Lt!==M)&&(n.blendColor(Ut.r,Ut.g,Ut.b,Lt),y.copy(Ut),M=Lt),m=v,R=!1}function Je(v,N){v.side===MA?ce(n.CULL_FACE):ue(n.CULL_FACE);let G=v.side===tA;N&&(G=!G),tt(G),v.blending===gr&&v.transparent===!1?ht(En):ht(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),r.setFunc(v.depthFunc),r.setTest(v.depthTest),r.setMask(v.depthWrite),i.setMask(v.colorWrite);const Y=v.stencilWrite;s.setTest(Y),Y&&(s.setMask(v.stencilWriteMask),s.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),s.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),He(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?ue(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function tt(v){E!==v&&(v?n.frontFace(n.CW):n.frontFace(n.CCW),E=v)}function _e(v){v!==E0?(ue(n.CULL_FACE),v!==x&&(v===Jf?n.cullFace(n.BACK):v===y0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),x=v}function Bt(v){v!==L&&(Z&&n.lineWidth(v),L=v)}function He(v,N,G){v?(ue(n.POLYGON_OFFSET_FILL),(z!==N||D!==G)&&(n.polygonOffset(N,G),z=N,D=G)):ce(n.POLYGON_OFFSET_FILL)}function Ve(v){v?ue(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function I(v){v===void 0&&(v=n.TEXTURE0+O-1),X!==v&&(n.activeTexture(v),X=v)}function _(v,N,G){G===void 0&&(X===null?G=n.TEXTURE0+O-1:G=X);let Y=re[G];Y===void 0&&(Y={type:void 0,texture:void 0},re[G]=Y),(Y.type!==v||Y.texture!==N)&&(X!==G&&(n.activeTexture(G),X=G),n.bindTexture(v,N||ee[v]),Y.type=v,Y.texture=N)}function W(){const v=re[X];v!==void 0&&v.type!==void 0&&(n.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function te(){try{n.compressedTexImage2D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function $(){try{n.texSubImage2D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Me(){try{n.texSubImage3D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function oe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function ke(){try{n.texStorage2D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function ie(){try{n.texStorage3D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Be(){try{n.texImage2D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function qe(){try{n.texImage3D.apply(n,arguments)}catch(v){console.error("THREE.WebGLState:",v)}}function Qe(v){Ie.equals(v)===!1&&(n.scissor(v.x,v.y,v.z,v.w),Ie.copy(v))}function we(v){Oe.equals(v)===!1&&(n.viewport(v.x,v.y,v.z,v.w),Oe.copy(v))}function Re(v,N){let G=o.get(N);G===void 0&&(G=new WeakMap,o.set(N,G));let Y=G.get(v);Y===void 0&&(Y=n.getUniformBlockIndex(N,v.name),G.set(v,Y))}function Ne(v,N){const Y=o.get(N).get(v);a.get(N)!==Y&&(n.uniformBlockBinding(N,Y,v.__bindingPointIndex),a.set(N,Y))}function vt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},X=null,re={},c={},u=new WeakMap,f=[],p=null,g=!1,m=null,d=null,h=null,B=null,w=null,C=null,b=null,y=new Ke(0,0,0),M=0,R=!1,E=null,x=null,L=null,z=null,D=null,Ie.set(0,0,n.canvas.width,n.canvas.height),Oe.set(0,0,n.canvas.width,n.canvas.height),i.reset(),r.reset(),s.reset()}return{buffers:{color:i,depth:r,stencil:s},enable:ue,disable:ce,bindFramebuffer:be,drawBuffers:Te,useProgram:Ge,setBlending:ht,setMaterial:Je,setFlipSided:tt,setCullFace:_e,setLineWidth:Bt,setPolygonOffset:He,setScissorTest:Ve,activeTexture:I,bindTexture:_,unbindTexture:W,compressedTexImage2D:te,compressedTexImage3D:ne,texImage2D:Be,texImage3D:qe,updateUBOMapping:Re,uniformBlockBinding:Ne,texStorage2D:ke,texStorage3D:ie,texSubImage2D:$,texSubImage3D:Me,compressedTexSubImage2D:oe,compressedTexSubImage3D:me,scissor:Qe,viewport:we,reset:vt}}function Vh(n,e,t,A){const i=g_(A);switch(t){case $p:return n*e;case tg:return n*e;case Ag:return n*e*2;case Xo:return n*e/i.components*i.byteLength;case cf:return n*e/i.components*i.byteLength;case ng:return n*e*2/i.components*i.byteLength;case uf:return n*e*2/i.components*i.byteLength;case eg:return n*e*3/i.components*i.byteLength;case ZA:return n*e*4/i.components*i.byteLength;case ff:return n*e*4/i.components*i.byteLength;case qa:case ja:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $a:case eo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gc:case kc:return Math.max(n,16)*Math.max(e,8)/4;case Oc:case Vc:return Math.max(n,8)*Math.max(e,8)/2;case zc:case Kc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Zc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case jc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case $c:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case eu:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case tu:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Au:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case nu:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case iu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ru:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case su:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case to:case au:case ou:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ig:case lu:return Math.ceil(n/4)*Math.ceil(e/4)*8;case cu:case uu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function g_(n){switch(n){case jA:case Zp:return{byteLength:1,components:1};case ws:case qp:case Qr:return{byteLength:2,components:1};case of:case lf:return{byteLength:2,components:4};case Mi:case af:case xn:return{byteLength:4,components:1};case jp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function m_(n,e,t,A,i,r,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ue,c=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,_){return p?new OffscreenCanvas(I,_):Bo("canvas")}function m(I,_,W){let te=1;const ne=Ve(I);if((ne.width>W||ne.height>W)&&(te=W/Math.max(ne.width,ne.height)),te<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const $=Math.floor(te*ne.width),Me=Math.floor(te*ne.height);u===void 0&&(u=g($,Me));const oe=_?g($,Me):u;return oe.width=$,oe.height=Me,oe.getContext("2d").drawImage(I,0,0,$,Me),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+$+"x"+Me+")."),oe}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),I;return I}function d(I){return I.generateMipmaps&&I.minFilter!==HA&&I.minFilter!==jt}function h(I){n.generateMipmap(I)}function B(I,_,W,te,ne=!1){if(I!==null){if(n[I]!==void 0)return n[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let $=_;if(_===n.RED&&(W===n.FLOAT&&($=n.R32F),W===n.HALF_FLOAT&&($=n.R16F),W===n.UNSIGNED_BYTE&&($=n.R8)),_===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&($=n.R8UI),W===n.UNSIGNED_SHORT&&($=n.R16UI),W===n.UNSIGNED_INT&&($=n.R32UI),W===n.BYTE&&($=n.R8I),W===n.SHORT&&($=n.R16I),W===n.INT&&($=n.R32I)),_===n.RG&&(W===n.FLOAT&&($=n.RG32F),W===n.HALF_FLOAT&&($=n.RG16F),W===n.UNSIGNED_BYTE&&($=n.RG8)),_===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&($=n.RG8UI),W===n.UNSIGNED_SHORT&&($=n.RG16UI),W===n.UNSIGNED_INT&&($=n.RG32UI),W===n.BYTE&&($=n.RG8I),W===n.SHORT&&($=n.RG16I),W===n.INT&&($=n.RG32I)),_===n.RGB&&W===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),_===n.RGBA){const Me=ne?fo:ot.getTransfer(te);W===n.FLOAT&&($=n.RGBA32F),W===n.HALF_FLOAT&&($=n.RGBA16F),W===n.UNSIGNED_BYTE&&($=Me===mt?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function w(I,_){let W;return I?_===null||_===Mi||_===Sr?W=n.DEPTH24_STENCIL8:_===xn?W=n.DEPTH32F_STENCIL8:_===ws&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Mi||_===Sr?W=n.DEPTH_COMPONENT24:_===xn?W=n.DEPTH_COMPONENT32F:_===ws&&(W=n.DEPTH_COMPONENT16),W}function C(I,_){return d(I)===!0||I.isFramebufferTexture&&I.minFilter!==HA&&I.minFilter!==jt?Math.log2(Math.max(_.width,_.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?_.mipmaps.length:1}function b(I){const _=I.target;_.removeEventListener("dispose",b),M(_),_.isVideoTexture&&c.delete(_)}function y(I){const _=I.target;_.removeEventListener("dispose",y),E(_)}function M(I){const _=A.get(I);if(_.__webglInit===void 0)return;const W=I.source,te=f.get(W);if(te){const ne=te[_.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&R(I),Object.keys(te).length===0&&f.delete(W)}A.remove(I)}function R(I){const _=A.get(I);n.deleteTexture(_.__webglTexture);const W=I.source,te=f.get(W);delete te[_.__cacheKey],s.memory.textures--}function E(I){const _=A.get(I);if(I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(_.__webglFramebuffer[te]))for(let ne=0;ne<_.__webglFramebuffer[te].length;ne++)n.deleteFramebuffer(_.__webglFramebuffer[te][ne]);else n.deleteFramebuffer(_.__webglFramebuffer[te]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[te])}else{if(Array.isArray(_.__webglFramebuffer))for(let te=0;te<_.__webglFramebuffer.length;te++)n.deleteFramebuffer(_.__webglFramebuffer[te]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let te=0;te<_.__webglColorRenderbuffer.length;te++)_.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[te]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const W=I.textures;for(let te=0,ne=W.length;te<ne;te++){const $=A.get(W[te]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),s.memory.textures--),A.remove(W[te])}A.remove(I)}let x=0;function L(){x=0}function z(){const I=x;return I>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+i.maxTextures),x+=1,I}function D(I){const _=[];return _.push(I.wrapS),_.push(I.wrapT),_.push(I.wrapR||0),_.push(I.magFilter),_.push(I.minFilter),_.push(I.anisotropy),_.push(I.internalFormat),_.push(I.format),_.push(I.type),_.push(I.generateMipmaps),_.push(I.premultiplyAlpha),_.push(I.flipY),_.push(I.unpackAlignment),_.push(I.colorSpace),_.join()}function O(I,_){const W=A.get(I);if(I.isVideoTexture&&Bt(I),I.isRenderTargetTexture===!1&&I.version>0&&W.__version!==I.version){const te=I.image;if(te===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(te.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Oe(W,I,_);return}}t.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+_)}function Z(I,_){const W=A.get(I);if(I.version>0&&W.__version!==I.version){Oe(W,I,_);return}t.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+_)}function V(I,_){const W=A.get(I);if(I.version>0&&W.__version!==I.version){Oe(W,I,_);return}t.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+_)}function q(I,_){const W=A.get(I);if(I.version>0&&W.__version!==I.version){J(W,I,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+_)}const X={[Hc]:n.REPEAT,[bA]:n.CLAMP_TO_EDGE,[Nc]:n.MIRRORED_REPEAT},re={[HA]:n.NEAREST,[aB]:n.NEAREST_MIPMAP_NEAREST,[Os]:n.NEAREST_MIPMAP_LINEAR,[jt]:n.LINEAR,[ml]:n.LINEAR_MIPMAP_NEAREST,[di]:n.LINEAR_MIPMAP_LINEAR},ae={[uB]:n.NEVER,[mB]:n.ALWAYS,[fB]:n.LESS,[sg]:n.LEQUAL,[hB]:n.EQUAL,[gB]:n.GEQUAL,[dB]:n.GREATER,[pB]:n.NOTEQUAL};function he(I,_){if(_.type===xn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===jt||_.magFilter===ml||_.magFilter===Os||_.magFilter===di||_.minFilter===jt||_.minFilter===ml||_.minFilter===Os||_.minFilter===di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(I,n.TEXTURE_WRAP_S,X[_.wrapS]),n.texParameteri(I,n.TEXTURE_WRAP_T,X[_.wrapT]),(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)&&n.texParameteri(I,n.TEXTURE_WRAP_R,X[_.wrapR]),n.texParameteri(I,n.TEXTURE_MAG_FILTER,re[_.magFilter]),n.texParameteri(I,n.TEXTURE_MIN_FILTER,re[_.minFilter]),_.compareFunction&&(n.texParameteri(I,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(I,n.TEXTURE_COMPARE_FUNC,ae[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===HA||_.minFilter!==Os&&_.minFilter!==di||_.type===xn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||A.get(_).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");n.texParameterf(I,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),A.get(_).__currentAnisotropy=_.anisotropy}}}function Ie(I,_){let W=!1;I.__webglInit===void 0&&(I.__webglInit=!0,_.addEventListener("dispose",b));const te=_.source;let ne=f.get(te);ne===void 0&&(ne={},f.set(te,ne));const $=D(_);if($!==I.__cacheKey){ne[$]===void 0&&(ne[$]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,W=!0),ne[$].usedTimes++;const Me=ne[I.__cacheKey];Me!==void 0&&(ne[I.__cacheKey].usedTimes--,Me.usedTimes===0&&R(_)),I.__cacheKey=$,I.__webglTexture=ne[$].texture}return W}function Oe(I,_,W){let te=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(te=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(te=n.TEXTURE_3D);const ne=Ie(I,_),$=_.source;t.bindTexture(te,I.__webglTexture,n.TEXTURE0+W);const Me=A.get($);if($.version!==Me.__version||ne===!0){t.activeTexture(n.TEXTURE0+W);const oe=ot.getPrimaries(ot.workingColorSpace),me=_.colorSpace===On?null:ot.getPrimaries(_.colorSpace),ke=_.colorSpace===On||oe===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let ie=m(_.image,!1,i.maxTextureSize);ie=He(_,ie);const Be=r.convert(_.format,_.colorSpace),qe=r.convert(_.type);let Qe=B(_.internalFormat,Be,qe,_.colorSpace,_.isVideoTexture);he(te,_);let we;const Re=_.mipmaps,Ne=_.isVideoTexture!==!0,vt=Me.__version===void 0||ne===!0,v=$.dataReady,N=C(_,ie);if(_.isDepthTexture)Qe=w(_.format===Ur,_.type),vt&&(Ne?t.texStorage2D(n.TEXTURE_2D,1,Qe,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,Qe,ie.width,ie.height,0,Be,qe,null));else if(_.isDataTexture)if(Re.length>0){Ne&&vt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,Re[0].width,Re[0].height);for(let G=0,Y=Re.length;G<Y;G++)we=Re[G],Ne?v&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,we.width,we.height,Be,qe,we.data):t.texImage2D(n.TEXTURE_2D,G,Qe,we.width,we.height,0,Be,qe,we.data);_.generateMipmaps=!1}else Ne?(vt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,ie.width,ie.height),v&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ie.width,ie.height,Be,qe,ie.data)):t.texImage2D(n.TEXTURE_2D,0,Qe,ie.width,ie.height,0,Be,qe,ie.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ne&&vt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Qe,Re[0].width,Re[0].height,ie.depth);for(let G=0,Y=Re.length;G<Y;G++)if(we=Re[G],_.format!==ZA)if(Be!==null)if(Ne){if(v)if(_.layerUpdates.size>0){const Ae=Vh(we.width,we.height,_.format,_.type);for(const Ee of _.layerUpdates){const De=we.data.subarray(Ee*Ae/we.data.BYTES_PER_ELEMENT,(Ee+1)*Ae/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,Ee,we.width,we.height,1,Be,De,0,0)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,we.width,we.height,ie.depth,Be,we.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,G,Qe,we.width,we.height,ie.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?v&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,G,0,0,0,we.width,we.height,ie.depth,Be,qe,we.data):t.texImage3D(n.TEXTURE_2D_ARRAY,G,Qe,we.width,we.height,ie.depth,0,Be,qe,we.data)}else{Ne&&vt&&t.texStorage2D(n.TEXTURE_2D,N,Qe,Re[0].width,Re[0].height);for(let G=0,Y=Re.length;G<Y;G++)we=Re[G],_.format!==ZA?Be!==null?Ne?v&&t.compressedTexSubImage2D(n.TEXTURE_2D,G,0,0,we.width,we.height,Be,we.data):t.compressedTexImage2D(n.TEXTURE_2D,G,Qe,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?v&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,we.width,we.height,Be,qe,we.data):t.texImage2D(n.TEXTURE_2D,G,Qe,we.width,we.height,0,Be,qe,we.data)}else if(_.isDataArrayTexture)if(Ne){if(vt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Qe,ie.width,ie.height,ie.depth),v)if(_.layerUpdates.size>0){const G=Vh(ie.width,ie.height,_.format,_.type);for(const Y of _.layerUpdates){const Ae=ie.data.subarray(Y*G/ie.data.BYTES_PER_ELEMENT,(Y+1)*G/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Y,ie.width,ie.height,1,Be,qe,Ae)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,Be,qe,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Qe,ie.width,ie.height,ie.depth,0,Be,qe,ie.data);else if(_.isData3DTexture)Ne?(vt&&t.texStorage3D(n.TEXTURE_3D,N,Qe,ie.width,ie.height,ie.depth),v&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,Be,qe,ie.data)):t.texImage3D(n.TEXTURE_3D,0,Qe,ie.width,ie.height,ie.depth,0,Be,qe,ie.data);else if(_.isFramebufferTexture){if(vt)if(Ne)t.texStorage2D(n.TEXTURE_2D,N,Qe,ie.width,ie.height);else{let G=ie.width,Y=ie.height;for(let Ae=0;Ae<N;Ae++)t.texImage2D(n.TEXTURE_2D,Ae,Qe,G,Y,0,Be,qe,null),G>>=1,Y>>=1}}else if(Re.length>0){if(Ne&&vt){const G=Ve(Re[0]);t.texStorage2D(n.TEXTURE_2D,N,Qe,G.width,G.height)}for(let G=0,Y=Re.length;G<Y;G++)we=Re[G],Ne?v&&t.texSubImage2D(n.TEXTURE_2D,G,0,0,Be,qe,we):t.texImage2D(n.TEXTURE_2D,G,Qe,Be,qe,we);_.generateMipmaps=!1}else if(Ne){if(vt){const G=Ve(ie);t.texStorage2D(n.TEXTURE_2D,N,Qe,G.width,G.height)}v&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Be,qe,ie)}else t.texImage2D(n.TEXTURE_2D,0,Qe,Be,qe,ie);d(_)&&h(te),Me.__version=$.version,_.onUpdate&&_.onUpdate(_)}I.__version=_.version}function J(I,_,W){if(_.image.length!==6)return;const te=Ie(I,_),ne=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,I.__webglTexture,n.TEXTURE0+W);const $=A.get(ne);if(ne.version!==$.__version||te===!0){t.activeTexture(n.TEXTURE0+W);const Me=ot.getPrimaries(ot.workingColorSpace),oe=_.colorSpace===On?null:ot.getPrimaries(_.colorSpace),me=_.colorSpace===On||Me===oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const ke=_.isCompressedTexture||_.image[0].isCompressedTexture,ie=_.image[0]&&_.image[0].isDataTexture,Be=[];for(let Y=0;Y<6;Y++)!ke&&!ie?Be[Y]=m(_.image[Y],!0,i.maxCubemapSize):Be[Y]=ie?_.image[Y].image:_.image[Y],Be[Y]=He(_,Be[Y]);const qe=Be[0],Qe=r.convert(_.format,_.colorSpace),we=r.convert(_.type),Re=B(_.internalFormat,Qe,we,_.colorSpace),Ne=_.isVideoTexture!==!0,vt=$.__version===void 0||te===!0,v=ne.dataReady;let N=C(_,qe);he(n.TEXTURE_CUBE_MAP,_);let G;if(ke){Ne&&vt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Re,qe.width,qe.height);for(let Y=0;Y<6;Y++){G=Be[Y].mipmaps;for(let Ae=0;Ae<G.length;Ae++){const Ee=G[Ae];_.format!==ZA?Qe!==null?Ne?v&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,0,0,Ee.width,Ee.height,Qe,Ee.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,Re,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?v&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,0,0,Ee.width,Ee.height,Qe,we,Ee.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae,Re,Ee.width,Ee.height,0,Qe,we,Ee.data)}}}else{if(G=_.mipmaps,Ne&&vt){G.length>0&&N++;const Y=Ve(Be[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,N,Re,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(ie){Ne?v&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Be[Y].width,Be[Y].height,Qe,we,Be[Y].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Re,Be[Y].width,Be[Y].height,0,Qe,we,Be[Y].data);for(let Ae=0;Ae<G.length;Ae++){const De=G[Ae].image[Y].image;Ne?v&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,0,0,De.width,De.height,Qe,we,De.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,Re,De.width,De.height,0,Qe,we,De.data)}}else{Ne?v&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Qe,we,Be[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Re,Qe,we,Be[Y]);for(let Ae=0;Ae<G.length;Ae++){const Ee=G[Ae];Ne?v&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,0,0,Qe,we,Ee.image[Y]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ae+1,Re,Qe,we,Ee.image[Y])}}}d(_)&&h(n.TEXTURE_CUBE_MAP),$.__version=ne.version,_.onUpdate&&_.onUpdate(_)}I.__version=_.version}function ee(I,_,W,te,ne,$){const Me=r.convert(W.format,W.colorSpace),oe=r.convert(W.type),me=B(W.internalFormat,Me,oe,W.colorSpace);if(!A.get(_).__hasExternalTextures){const ie=Math.max(1,_.width>>$),Be=Math.max(1,_.height>>$);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,$,me,ie,Be,_.depth,0,Me,oe,null):t.texImage2D(ne,$,me,ie,Be,0,Me,oe,null)}t.bindFramebuffer(n.FRAMEBUFFER,I),_e(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,te,ne,A.get(W).__webglTexture,0,tt(_)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,te,ne,A.get(W).__webglTexture,$),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ue(I,_,W){if(n.bindRenderbuffer(n.RENDERBUFFER,I),_.depthBuffer){const te=_.depthTexture,ne=te&&te.isDepthTexture?te.type:null,$=w(_.stencilBuffer,ne),Me=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=tt(_);_e(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,oe,$,_.width,_.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,oe,$,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,$,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,I)}else{const te=_.textures;for(let ne=0;ne<te.length;ne++){const $=te[ne],Me=r.convert($.format,$.colorSpace),oe=r.convert($.type),me=B($.internalFormat,Me,oe,$.colorSpace),ke=tt(_);W&&_e(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ke,me,_.width,_.height):_e(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ke,me,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,me,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ce(I,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,I),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!A.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),O(_.depthTexture,0);const te=A.get(_.depthTexture).__webglTexture,ne=tt(_);if(_.depthTexture.format===mr)_e(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(_.depthTexture.format===Ur)_e(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function be(I){const _=A.get(I),W=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!_.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ce(_.__webglFramebuffer,I)}else if(W){_.__webglDepthbuffer=[];for(let te=0;te<6;te++)t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[te]),_.__webglDepthbuffer[te]=n.createRenderbuffer(),ue(_.__webglDepthbuffer[te],I,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer=n.createRenderbuffer(),ue(_.__webglDepthbuffer,I,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Te(I,_,W){const te=A.get(I);_!==void 0&&ee(te.__webglFramebuffer,I,I.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&be(I)}function Ge(I){const _=I.texture,W=A.get(I),te=A.get(_);I.addEventListener("dispose",y);const ne=I.textures,$=I.isWebGLCubeRenderTarget===!0,Me=ne.length>1;if(Me||(te.__webglTexture===void 0&&(te.__webglTexture=n.createTexture()),te.__version=_.version,s.memory.textures++),$){W.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(_.mipmaps&&_.mipmaps.length>0){W.__webglFramebuffer[oe]=[];for(let me=0;me<_.mipmaps.length;me++)W.__webglFramebuffer[oe][me]=n.createFramebuffer()}else W.__webglFramebuffer[oe]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){W.__webglFramebuffer=[];for(let oe=0;oe<_.mipmaps.length;oe++)W.__webglFramebuffer[oe]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(Me)for(let oe=0,me=ne.length;oe<me;oe++){const ke=A.get(ne[oe]);ke.__webglTexture===void 0&&(ke.__webglTexture=n.createTexture(),s.memory.textures++)}if(I.samples>0&&_e(I)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let oe=0;oe<ne.length;oe++){const me=ne[oe];W.__webglColorRenderbuffer[oe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[oe]);const ke=r.convert(me.format,me.colorSpace),ie=r.convert(me.type),Be=B(me.internalFormat,ke,ie,me.colorSpace,I.isXRRenderTarget===!0),qe=tt(I);n.renderbufferStorageMultisample(n.RENDERBUFFER,qe,Be,I.width,I.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+oe,n.RENDERBUFFER,W.__webglColorRenderbuffer[oe])}n.bindRenderbuffer(n.RENDERBUFFER,null),I.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),ue(W.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){t.bindTexture(n.TEXTURE_CUBE_MAP,te.__webglTexture),he(n.TEXTURE_CUBE_MAP,_);for(let oe=0;oe<6;oe++)if(_.mipmaps&&_.mipmaps.length>0)for(let me=0;me<_.mipmaps.length;me++)ee(W.__webglFramebuffer[oe][me],I,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,me);else ee(W.__webglFramebuffer[oe],I,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);d(_)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let oe=0,me=ne.length;oe<me;oe++){const ke=ne[oe],ie=A.get(ke);t.bindTexture(n.TEXTURE_2D,ie.__webglTexture),he(n.TEXTURE_2D,ke),ee(W.__webglFramebuffer,I,ke,n.COLOR_ATTACHMENT0+oe,n.TEXTURE_2D,0),d(ke)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let oe=n.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(oe=I.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,te.__webglTexture),he(oe,_),_.mipmaps&&_.mipmaps.length>0)for(let me=0;me<_.mipmaps.length;me++)ee(W.__webglFramebuffer[me],I,_,n.COLOR_ATTACHMENT0,oe,me);else ee(W.__webglFramebuffer,I,_,n.COLOR_ATTACHMENT0,oe,0);d(_)&&h(oe),t.unbindTexture()}I.depthBuffer&&be(I)}function et(I){const _=I.textures;for(let W=0,te=_.length;W<te;W++){const ne=_[W];if(d(ne)){const $=I.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Me=A.get(ne).__webglTexture;t.bindTexture($,Me),h($),t.unbindTexture()}}}const Q=[],ht=[];function Je(I){if(I.samples>0){if(_e(I)===!1){const _=I.textures,W=I.width,te=I.height;let ne=n.COLOR_BUFFER_BIT;const $=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Me=A.get(I),oe=_.length>1;if(oe)for(let me=0;me<_.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let me=0;me<_.length;me++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),oe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Me.__webglColorRenderbuffer[me]);const ke=A.get(_[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ke,0)}n.blitFramebuffer(0,0,W,te,0,0,W,te,ne,n.NEAREST),o===!0&&(Q.length=0,ht.length=0,Q.push(n.COLOR_ATTACHMENT0+me),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Q.push($),ht.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ht)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),oe)for(let me=0;me<_.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,Me.__webglColorRenderbuffer[me]);const ke=A.get(_[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Me.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&o){const _=I.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function tt(I){return Math.min(i.maxSamples,I.samples)}function _e(I){const _=A.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Bt(I){const _=s.render.frame;c.get(I)!==_&&(c.set(I,_),I.update())}function He(I,_){const W=I.colorSpace,te=I.format,ne=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||W!==ti&&W!==On&&(ot.getTransfer(W)===mt?(te!==ZA||ne!==jA)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),_}function Ve(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=L,this.setTexture2D=O,this.setTexture2DArray=Z,this.setTexture3D=V,this.setTextureCube=q,this.rebindTextures=Te,this.setupRenderTarget=Ge,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=Je,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=_e}function B_(n,e){function t(A,i=On){let r;const s=ot.getTransfer(i);if(A===jA)return n.UNSIGNED_BYTE;if(A===of)return n.UNSIGNED_SHORT_4_4_4_4;if(A===lf)return n.UNSIGNED_SHORT_5_5_5_1;if(A===jp)return n.UNSIGNED_INT_5_9_9_9_REV;if(A===Zp)return n.BYTE;if(A===qp)return n.SHORT;if(A===ws)return n.UNSIGNED_SHORT;if(A===af)return n.INT;if(A===Mi)return n.UNSIGNED_INT;if(A===xn)return n.FLOAT;if(A===Qr)return n.HALF_FLOAT;if(A===$p)return n.ALPHA;if(A===eg)return n.RGB;if(A===ZA)return n.RGBA;if(A===tg)return n.LUMINANCE;if(A===Ag)return n.LUMINANCE_ALPHA;if(A===mr)return n.DEPTH_COMPONENT;if(A===Ur)return n.DEPTH_STENCIL;if(A===Xo)return n.RED;if(A===cf)return n.RED_INTEGER;if(A===ng)return n.RG;if(A===uf)return n.RG_INTEGER;if(A===ff)return n.RGBA_INTEGER;if(A===qa||A===ja||A===$a||A===eo)if(s===mt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(A===qa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(A===ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(A===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(A===eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(A===qa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(A===ja)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(A===$a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(A===eo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(A===Oc||A===Gc||A===Vc||A===kc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(A===Oc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(A===Gc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(A===Vc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(A===kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(A===zc||A===Kc||A===Wc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(A===zc||A===Kc)return s===mt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(A===Wc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(A===Xc||A===Yc||A===Jc||A===Zc||A===qc||A===jc||A===$c||A===eu||A===tu||A===Au||A===nu||A===iu||A===ru||A===su)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(A===Xc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(A===Yc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(A===Jc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(A===Zc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(A===qc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(A===jc)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(A===$c)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(A===eu)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(A===tu)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(A===Au)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(A===nu)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(A===iu)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(A===ru)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(A===su)return s===mt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(A===to||A===au||A===ou)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(A===to)return s===mt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(A===au)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(A===ou)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(A===ig||A===lu||A===cu||A===uu)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(A===to)return r.COMPRESSED_RED_RGTC1_EXT;if(A===lu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(A===cu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(A===uu)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return A===Sr?n.UNSIGNED_INT_24_8:n[A]!==void 0?n[A]:null}return{convert:t}}class v_ extends yA{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class qA extends lA{constructor(){super(),this.isGroup=!0,this.type="Group"}}const w_={type:"move"};class kl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qA,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qA,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qA,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const A of e.hand.values())this._getHandJoint(t,A)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,A){let i=null,r=null,s=null;const a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){s=!0;for(const m of e.hand.values()){const d=t.getJointPose(m,A),h=this._getHandJoint(l,m);d!==null&&(h.matrix.fromArray(d.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=d.radius),h.visible=d!==null}const c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=c.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,A),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,A),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(w_)))}return a!==null&&(a.visible=i!==null),o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const A=new qA;A.matrixAutoUpdate=!1,A.visible=!1,e.joints[t.jointName]=A,e.add(A)}return e.joints[t.jointName]}}const C_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x_=`
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

}`;class __{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,A){if(this.texture===null){const i=new dA,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=A.depthNear||t.depthFar!=A.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,A=new Kt({vertexShader:C_,fragmentShader:x_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xt(new $n(20,20),A)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class E_ extends Ii{constructor(e,t){super();const A=this;let i=null,r=1,s=null,a="local-floor",o=1,l=null,c=null,u=null,f=null,p=null,g=null;const m=new __,d=t.getContextAttributes();let h=null,B=null;const w=[],C=[],b=new Ue;let y=null;const M=new yA;M.layers.enable(1),M.viewport=new ct;const R=new yA;R.layers.enable(2),R.viewport=new ct;const E=[M,R],x=new v_;x.layers.enable(1),x.layers.enable(2);let L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ee=w[J];return ee===void 0&&(ee=new kl,w[J]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(J){let ee=w[J];return ee===void 0&&(ee=new kl,w[J]=ee),ee.getGripSpace()},this.getHand=function(J){let ee=w[J];return ee===void 0&&(ee=new kl,w[J]=ee),ee.getHandSpace()};function D(J){const ee=C.indexOf(J.inputSource);if(ee===-1)return;const ue=w[ee];ue!==void 0&&(ue.update(J.inputSource,J.frame,l||s),ue.dispatchEvent({type:J.type,data:J.inputSource}))}function O(){i.removeEventListener("select",D),i.removeEventListener("selectstart",D),i.removeEventListener("selectend",D),i.removeEventListener("squeeze",D),i.removeEventListener("squeezestart",D),i.removeEventListener("squeezeend",D),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<w.length;J++){const ee=C[J];ee!==null&&(C[J]=null,w[J].disconnect(ee))}L=null,z=null,m.reset(),e.setRenderTarget(h),p=null,f=null,u=null,i=null,B=null,Oe.stop(),A.isPresenting=!1,e.setPixelRatio(y),e.setSize(b.width,b.height,!1),A.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||s},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(h=e.getRenderTarget(),i.addEventListener("select",D),i.addEventListener("selectstart",D),i.addEventListener("selectend",D),i.addEventListener("squeeze",D),i.addEventListener("squeezestart",D),i.addEventListener("squeezeend",D),i.addEventListener("end",O),i.addEventListener("inputsourceschange",Z),d.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(b),i.renderState.layers===void 0){const ee={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,t,ee),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),B=new jn(p.framebufferWidth,p.framebufferHeight,{format:ZA,type:jA,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let ee=null,ue=null,ce=null;d.depth&&(ce=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=d.stencil?Ur:mr,ue=d.stencil?Sr:Mi);const be={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(be),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),B=new jn(f.textureWidth,f.textureHeight,{format:ZA,type:jA,depthTexture:new vg(f.textureWidth,f.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}B.isXRRenderTarget=!0,this.setFoveation(o),l=null,s=await i.requestReferenceSpace(a),Oe.setContext(i),Oe.start(),A.isPresenting=!0,A.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(J){for(let ee=0;ee<J.removed.length;ee++){const ue=J.removed[ee],ce=C.indexOf(ue);ce>=0&&(C[ce]=null,w[ce].disconnect(ue))}for(let ee=0;ee<J.added.length;ee++){const ue=J.added[ee];let ce=C.indexOf(ue);if(ce===-1){for(let Te=0;Te<w.length;Te++)if(Te>=C.length){C.push(ue),ce=Te;break}else if(C[Te]===null){C[Te]=ue,ce=Te;break}if(ce===-1)break}const be=w[ce];be&&be.connect(ue)}}const V=new F,q=new F;function X(J,ee,ue){V.setFromMatrixPosition(ee.matrixWorld),q.setFromMatrixPosition(ue.matrixWorld);const ce=V.distanceTo(q),be=ee.projectionMatrix.elements,Te=ue.projectionMatrix.elements,Ge=be[14]/(be[10]-1),et=be[14]/(be[10]+1),Q=(be[9]+1)/be[5],ht=(be[9]-1)/be[5],Je=(be[8]-1)/be[0],tt=(Te[8]+1)/Te[0],_e=Ge*Je,Bt=Ge*tt,He=ce/(-Je+tt),Ve=He*-Je;ee.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ve),J.translateZ(He),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();const I=Ge+He,_=et+He,W=_e-Ve,te=Bt+(ce-Ve),ne=Q*et/_*I,$=ht*et/_*I;J.projectionMatrix.makePerspective(W,te,ne,$,I,_),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function re(J,ee){ee===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ee.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;m.texture!==null&&(J.near=m.depthNear,J.far=m.depthFar),x.near=R.near=M.near=J.near,x.far=R.far=M.far=J.far,(L!==x.near||z!==x.far)&&(i.updateRenderState({depthNear:x.near,depthFar:x.far}),L=x.near,z=x.far,M.near=L,M.far=z,R.near=L,R.far=z,M.updateProjectionMatrix(),R.updateProjectionMatrix(),J.updateProjectionMatrix());const ee=J.parent,ue=x.cameras;re(x,ee);for(let ce=0;ce<ue.length;ce++)re(ue[ce],ee);ue.length===2?X(x,M,R):x.projectionMatrix.copy(M.projectionMatrix),ae(J,x,ee)};function ae(J,ee,ue){ue===null?J.matrix.copy(ee.matrixWorld):(J.matrix.copy(ue.matrixWorld),J.matrix.invert(),J.matrix.multiply(ee.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=fu*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&p===null))return o},this.setFoveation=function(J){o=J,f!==null&&(f.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(x)};let he=null;function Ie(J,ee){if(c=ee.getViewerPose(l||s),g=ee,c!==null){const ue=c.views;p!==null&&(e.setRenderTargetFramebuffer(B,p.framebuffer),e.setRenderTarget(B));let ce=!1;ue.length!==x.cameras.length&&(x.cameras.length=0,ce=!0);for(let Te=0;Te<ue.length;Te++){const Ge=ue[Te];let et=null;if(p!==null)et=p.getViewport(Ge);else{const ht=u.getViewSubImage(f,Ge);et=ht.viewport,Te===0&&(e.setRenderTargetTextures(B,ht.colorTexture,f.ignoreDepthValues?void 0:ht.depthStencilTexture),e.setRenderTarget(B))}let Q=E[Te];Q===void 0&&(Q=new yA,Q.layers.enable(Te),Q.viewport=new ct,E[Te]=Q),Q.matrix.fromArray(Ge.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(Ge.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(et.x,et.y,et.width,et.height),Te===0&&(x.matrix.copy(Q.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ce===!0&&x.cameras.push(Q)}const be=i.enabledFeatures;if(be&&be.includes("depth-sensing")){const Te=u.getDepthInformation(ue[0]);Te&&Te.isValid&&Te.texture&&m.init(e,Te,i.renderState)}}for(let ue=0;ue<w.length;ue++){const ce=C[ue],be=w[ue];ce!==null&&be!==void 0&&be.update(ce,ee,l||s)}he&&he(J,ee),ee.detectedPlanes&&A.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Oe=new mg;Oe.setAnimationLoop(Ie),this.setAnimationLoop=function(J){he=J},this.dispose=function(){}}}const oi=new on,y_=new ut;function S_(n,e){function t(d,h){d.matrixAutoUpdate===!0&&d.updateMatrix(),h.value.copy(d.matrix)}function A(d,h){h.color.getRGB(d.fogColor.value,hg(n)),h.isFog?(d.fogNear.value=h.near,d.fogFar.value=h.far):h.isFogExp2&&(d.fogDensity.value=h.density)}function i(d,h,B,w,C){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(d,h):h.isMeshToonMaterial?(r(d,h),u(d,h)):h.isMeshPhongMaterial?(r(d,h),c(d,h)):h.isMeshStandardMaterial?(r(d,h),f(d,h),h.isMeshPhysicalMaterial&&p(d,h,C)):h.isMeshMatcapMaterial?(r(d,h),g(d,h)):h.isMeshDepthMaterial?r(d,h):h.isMeshDistanceMaterial?(r(d,h),m(d,h)):h.isMeshNormalMaterial?r(d,h):h.isLineBasicMaterial?(s(d,h),h.isLineDashedMaterial&&a(d,h)):h.isPointsMaterial?o(d,h,B,w):h.isSpriteMaterial?l(d,h):h.isShadowMaterial?(d.color.value.copy(h.color),d.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(d,h){d.opacity.value=h.opacity,h.color&&d.diffuse.value.copy(h.color),h.emissive&&d.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.bumpMap&&(d.bumpMap.value=h.bumpMap,t(h.bumpMap,d.bumpMapTransform),d.bumpScale.value=h.bumpScale,h.side===tA&&(d.bumpScale.value*=-1)),h.normalMap&&(d.normalMap.value=h.normalMap,t(h.normalMap,d.normalMapTransform),d.normalScale.value.copy(h.normalScale),h.side===tA&&d.normalScale.value.negate()),h.displacementMap&&(d.displacementMap.value=h.displacementMap,t(h.displacementMap,d.displacementMapTransform),d.displacementScale.value=h.displacementScale,d.displacementBias.value=h.displacementBias),h.emissiveMap&&(d.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,d.emissiveMapTransform)),h.specularMap&&(d.specularMap.value=h.specularMap,t(h.specularMap,d.specularMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest);const B=e.get(h),w=B.envMap,C=B.envMapRotation;w&&(d.envMap.value=w,oi.copy(C),oi.x*=-1,oi.y*=-1,oi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),d.envMapRotation.value.setFromMatrix4(y_.makeRotationFromEuler(oi)),d.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=h.reflectivity,d.ior.value=h.ior,d.refractionRatio.value=h.refractionRatio),h.lightMap&&(d.lightMap.value=h.lightMap,d.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,d.lightMapTransform)),h.aoMap&&(d.aoMap.value=h.aoMap,d.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,d.aoMapTransform))}function s(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform))}function a(d,h){d.dashSize.value=h.dashSize,d.totalSize.value=h.dashSize+h.gapSize,d.scale.value=h.scale}function o(d,h,B,w){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.size.value=h.size*B,d.scale.value=w*.5,h.map&&(d.map.value=h.map,t(h.map,d.uvTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function l(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.rotation.value=h.rotation,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function c(d,h){d.specular.value.copy(h.specular),d.shininess.value=Math.max(h.shininess,1e-4)}function u(d,h){h.gradientMap&&(d.gradientMap.value=h.gradientMap)}function f(d,h){d.metalness.value=h.metalness,h.metalnessMap&&(d.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,d.metalnessMapTransform)),d.roughness.value=h.roughness,h.roughnessMap&&(d.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,d.roughnessMapTransform)),h.envMap&&(d.envMapIntensity.value=h.envMapIntensity)}function p(d,h,B){d.ior.value=h.ior,h.sheen>0&&(d.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),d.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(d.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,d.sheenColorMapTransform)),h.sheenRoughnessMap&&(d.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,d.sheenRoughnessMapTransform))),h.clearcoat>0&&(d.clearcoat.value=h.clearcoat,d.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(d.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,d.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(d.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===tA&&d.clearcoatNormalScale.value.negate())),h.dispersion>0&&(d.dispersion.value=h.dispersion),h.iridescence>0&&(d.iridescence.value=h.iridescence,d.iridescenceIOR.value=h.iridescenceIOR,d.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(d.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,d.iridescenceMapTransform)),h.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),h.transmission>0&&(d.transmission.value=h.transmission,d.transmissionSamplerMap.value=B.texture,d.transmissionSamplerSize.value.set(B.width,B.height),h.transmissionMap&&(d.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,d.transmissionMapTransform)),d.thickness.value=h.thickness,h.thicknessMap&&(d.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=h.attenuationDistance,d.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(d.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(d.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=h.specularIntensity,d.specularColor.value.copy(h.specularColor),h.specularColorMap&&(d.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,d.specularColorMapTransform)),h.specularIntensityMap&&(d.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,d.specularIntensityMapTransform))}function g(d,h){h.matcap&&(d.matcap.value=h.matcap)}function m(d,h){const B=e.get(h).light;d.referencePosition.value.setFromMatrixPosition(B.matrixWorld),d.nearDistance.value=B.shadow.camera.near,d.farDistance.value=B.shadow.camera.far}return{refreshFogUniforms:A,refreshMaterialUniforms:i}}function U_(n,e,t,A){let i={},r={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function o(B,w){const C=w.program;A.uniformBlockBinding(B,C)}function l(B,w){let C=i[B.id];C===void 0&&(g(B),C=c(B),i[B.id]=C,B.addEventListener("dispose",d));const b=w.program;A.updateUBOMapping(B,b);const y=e.render.frame;r[B.id]!==y&&(f(B),r[B.id]=y)}function c(B){const w=u();B.__bindingPointIndex=w;const C=n.createBuffer(),b=B.__size,y=B.usage;return n.bindBuffer(n.UNIFORM_BUFFER,C),n.bufferData(n.UNIFORM_BUFFER,b,y),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,w,C),C}function u(){for(let B=0;B<a;B++)if(s.indexOf(B)===-1)return s.push(B),B;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(B){const w=i[B.id],C=B.uniforms,b=B.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let y=0,M=C.length;y<M;y++){const R=Array.isArray(C[y])?C[y]:[C[y]];for(let E=0,x=R.length;E<x;E++){const L=R[E];if(p(L,y,E,b)===!0){const z=L.__offset,D=Array.isArray(L.value)?L.value:[L.value];let O=0;for(let Z=0;Z<D.length;Z++){const V=D[Z],q=m(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,z+O,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,O),O+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(B,w,C,b){const y=B.value,M=w+"_"+C;if(b[M]===void 0)return typeof y=="number"||typeof y=="boolean"?b[M]=y:b[M]=y.clone(),!0;{const R=b[M];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return b[M]=y,!0}else if(R.equals(y)===!1)return R.copy(y),!0}return!1}function g(B){const w=B.uniforms;let C=0;const b=16;for(let M=0,R=w.length;M<R;M++){const E=Array.isArray(w[M])?w[M]:[w[M]];for(let x=0,L=E.length;x<L;x++){const z=E[x],D=Array.isArray(z.value)?z.value:[z.value];for(let O=0,Z=D.length;O<Z;O++){const V=D[O],q=m(V),X=C%b,re=X%q.boundary,ae=X+re;C+=re,ae!==0&&b-ae<q.storage&&(C+=b-ae),z.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=C,C+=q.storage}}}const y=C%b;return y>0&&(C+=b-y),B.__size=C,B.__cache={},this}function m(B){const w={boundary:0,storage:0};return typeof B=="number"||typeof B=="boolean"?(w.boundary=4,w.storage=4):B.isVector2?(w.boundary=8,w.storage=8):B.isVector3||B.isColor?(w.boundary=16,w.storage=12):B.isVector4?(w.boundary=16,w.storage=16):B.isMatrix3?(w.boundary=48,w.storage=48):B.isMatrix4?(w.boundary=64,w.storage=64):B.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",B),w}function d(B){const w=B.target;w.removeEventListener("dispose",d);const C=s.indexOf(w.__bindingPointIndex);s.splice(C,1),n.deleteBuffer(i[w.id]),delete i[w.id],delete r[w.id]}function h(){for(const B in i)n.deleteBuffer(i[B]);s=[],i={},r={}}return{bind:o,update:l,dispose:h}}class du{constructor(e={}){const{canvas:t=wB(),context:A=null,depth:i=!0,stencil:r=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(A!==null){if(typeof WebGLRenderingContext<"u"&&A instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=A.getContextAttributes().alpha}else f=s;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,d=null;const h=[],B=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=YA,this.toneMapping=Xn,this.toneMappingExposure=1;const w=this;let C=!1,b=0,y=0,M=null,R=-1,E=null;const x=new ct,L=new ct;let z=null;const D=new Ke(0);let O=0,Z=t.width,V=t.height,q=1,X=null,re=null;const ae=new ct(0,0,Z,V),he=new ct(0,0,Z,V);let Ie=!1;const Oe=new gf;let J=!1,ee=!1;const ue=new ut,ce=new F,be=new ct,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function et(){return M===null?q:1}let Q=A;function ht(S,P){return t.getContext(S,P)}try{const S={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sf}`),t.addEventListener("webglcontextlost",G,!1),t.addEventListener("webglcontextrestored",Y,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),Q===null){const P="webgl2";if(Q=ht(P,S),Q===null)throw ht(P)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Je,tt,_e,Bt,He,Ve,I,_,W,te,ne,$,Me,oe,me,ke,ie,Be,qe,Qe,we,Re,Ne,vt;function v(){Je=new LC(Q),Je.init(),Re=new B_(Q,Je),tt=new MC(Q,Je,e,Re),_e=new p_(Q),Bt=new PC(Q),He=new t_,Ve=new m_(Q,Je,_e,He,tt,Re,Bt),I=new FC(w),_=new QC(w),W=new zB(Q),Ne=new SC(Q,W),te=new RC(Q,W,Bt,Ne),ne=new NC(Q,te,W,Bt),qe=new HC(Q,tt,Ve),ke=new bC(He),$=new e_(w,I,_,Je,tt,Ne,ke),Me=new S_(w,He),oe=new n_,me=new l_(Je),Be=new yC(w,I,_,_e,ne,f,o),ie=new d_(w,ne,tt),vt=new U_(Q,Bt,tt,_e),Qe=new UC(Q,Je,Bt),we=new DC(Q,Je,Bt),Bt.programs=$.programs,w.capabilities=tt,w.extensions=Je,w.properties=He,w.renderLists=oe,w.shadowMap=ie,w.state=_e,w.info=Bt}v();const N=new E_(w,Q);this.xr=N,this.getContext=function(){return Q},this.getContextAttributes=function(){return Q.getContextAttributes()},this.forceContextLoss=function(){const S=Je.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Je.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(S){S!==void 0&&(q=S,this.setSize(Z,V,!1))},this.getSize=function(S){return S.set(Z,V)},this.setSize=function(S,P,k=!0){if(N.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=S,V=P,t.width=Math.floor(S*q),t.height=Math.floor(P*q),k===!0&&(t.style.width=S+"px",t.style.height=P+"px"),this.setViewport(0,0,S,P)},this.getDrawingBufferSize=function(S){return S.set(Z*q,V*q).floor()},this.setDrawingBufferSize=function(S,P,k){Z=S,V=P,q=k,t.width=Math.floor(S*k),t.height=Math.floor(P*k),this.setViewport(0,0,S,P)},this.getCurrentViewport=function(S){return S.copy(x)},this.getViewport=function(S){return S.copy(ae)},this.setViewport=function(S,P,k,K){S.isVector4?ae.set(S.x,S.y,S.z,S.w):ae.set(S,P,k,K),_e.viewport(x.copy(ae).multiplyScalar(q).round())},this.getScissor=function(S){return S.copy(he)},this.setScissor=function(S,P,k,K){S.isVector4?he.set(S.x,S.y,S.z,S.w):he.set(S,P,k,K),_e.scissor(L.copy(he).multiplyScalar(q).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(S){_e.setScissorTest(Ie=S)},this.setOpaqueSort=function(S){X=S},this.setTransparentSort=function(S){re=S},this.getClearColor=function(S){return S.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(S=!0,P=!0,k=!0){let K=0;if(S){let H=!1;if(M!==null){const se=M.texture.format;H=se===ff||se===uf||se===cf}if(H){const se=M.texture.type,pe=se===jA||se===Mi||se===ws||se===Sr||se===of||se===lf,Ce=Be.getClearColor(),xe=Be.getClearAlpha(),Le=Ce.r,Pe=Ce.g,Fe=Ce.b;pe?(p[0]=Le,p[1]=Pe,p[2]=Fe,p[3]=xe,Q.clearBufferuiv(Q.COLOR,0,p)):(g[0]=Le,g[1]=Pe,g[2]=Fe,g[3]=xe,Q.clearBufferiv(Q.COLOR,0,g))}else K|=Q.COLOR_BUFFER_BIT}P&&(K|=Q.DEPTH_BUFFER_BIT),k&&(K|=Q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Q.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",G,!1),t.removeEventListener("webglcontextrestored",Y,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),oe.dispose(),me.dispose(),He.dispose(),I.dispose(),_.dispose(),ne.dispose(),Ne.dispose(),vt.dispose(),$.dispose(),N.dispose(),N.removeEventListener("sessionstart",Ft),N.removeEventListener("sessionend",Un),Wt.stop()};function G(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function Y(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const S=Bt.autoReset,P=ie.enabled,k=ie.autoUpdate,K=ie.needsUpdate,H=ie.type;v(),Bt.autoReset=S,ie.enabled=P,ie.autoUpdate=k,ie.needsUpdate=K,ie.type=H}function Ae(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Ee(S){const P=S.target;P.removeEventListener("dispose",Ee),De(P)}function De(S){Ut(S),He.remove(S)}function Ut(S){const P=He.get(S).programs;P!==void 0&&(P.forEach(function(k){$.releaseProgram(k)}),S.isShaderMaterial&&$.releaseShaderCache(S))}this.renderBufferDirect=function(S,P,k,K,H,se){P===null&&(P=Te);const pe=H.isMesh&&H.matrixWorld.determinant()<0,Ce=B0(S,P,k,K,H);_e.setMaterial(K,pe);let xe=k.index,Le=1;if(K.wireframe===!0){if(xe=te.getWireframeAttribute(k),xe===void 0)return;Le=2}const Pe=k.drawRange,Fe=k.attributes.position;let it=Pe.start*Le,_t=(Pe.start+Pe.count)*Le;se!==null&&(it=Math.max(it,se.start*Le),_t=Math.min(_t,(se.start+se.count)*Le)),xe!==null?(it=Math.max(it,0),_t=Math.min(_t,xe.count)):Fe!=null&&(it=Math.max(it,0),_t=Math.min(_t,Fe.count));const Et=_t-it;if(Et<0||Et===1/0)return;Ne.setup(H,K,Ce,k,xe);let mA,rt=Qe;if(xe!==null&&(mA=W.get(xe),rt=we,rt.setIndex(mA)),H.isMesh)K.wireframe===!0?(_e.setLineWidth(K.wireframeLinewidth*et()),rt.setMode(Q.LINES)):rt.setMode(Q.TRIANGLES);else if(H.isLine){let Se=K.linewidth;Se===void 0&&(Se=1),_e.setLineWidth(Se*et()),H.isLineSegments?rt.setMode(Q.LINES):H.isLineLoop?rt.setMode(Q.LINE_LOOP):rt.setMode(Q.LINE_STRIP)}else H.isPoints?rt.setMode(Q.POINTS):H.isSprite&&rt.setMode(Q.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)rt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Je.get("WEBGL_multi_draw"))rt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Se=H._multiDrawStarts,Xt=H._multiDrawCounts,st=H._multiDrawCount,VA=xe?W.get(xe).bytesPerElement:1,Ri=He.get(K).currentProgram.getUniforms();for(let BA=0;BA<st;BA++)Ri.setValue(Q,"_gl_DrawID",BA),rt.render(Se[BA]/VA,Xt[BA])}else if(H.isInstancedMesh)rt.renderInstances(it,Et,H.count);else if(k.isInstancedBufferGeometry){const Se=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Xt=Math.min(k.instanceCount,Se);rt.renderInstances(it,Et,Xt)}else rt.render(it,Et)};function Lt(S,P,k){S.transparent===!0&&S.side===MA&&S.forceSinglePass===!1?(S.side=tA,S.needsUpdate=!0,Ns(S,P,k),S.side=qn,S.needsUpdate=!0,Ns(S,P,k),S.side=MA):Ns(S,P,k)}this.compile=function(S,P,k=null){k===null&&(k=S),d=me.get(k),d.init(P),B.push(d),k.traverseVisible(function(H){H.isLight&&H.layers.test(P.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),S!==k&&S.traverseVisible(function(H){H.isLight&&H.layers.test(P.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),d.setupLights();const K=new Set;return S.traverse(function(H){const se=H.material;if(se)if(Array.isArray(se))for(let pe=0;pe<se.length;pe++){const Ce=se[pe];Lt(Ce,k,H),K.add(Ce)}else Lt(se,k,H),K.add(se)}),B.pop(),d=null,K},this.compileAsync=function(S,P,k=null){const K=this.compile(S,P,k);return new Promise(H=>{function se(){if(K.forEach(function(pe){He.get(pe).currentProgram.isReady()&&K.delete(pe)}),K.size===0){H(S);return}setTimeout(se,10)}Je.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let At=null;function Rt(S){At&&At(S)}function Ft(){Wt.stop()}function Un(){Wt.start()}const Wt=new mg;Wt.setAnimationLoop(Rt),typeof self<"u"&&Wt.setContext(self),this.setAnimationLoop=function(S){At=S,N.setAnimationLoop(S),S===null?Wt.stop():Wt.start()},N.addEventListener("sessionstart",Ft),N.addEventListener("sessionend",Un),this.render=function(S,P){if(P!==void 0&&P.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(N.cameraAutoUpdate===!0&&N.updateCamera(P),P=N.getCamera()),S.isScene===!0&&S.onBeforeRender(w,S,P,M),d=me.get(S,B.length),d.init(P),B.push(d),ue.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),Oe.setFromProjectionMatrix(ue),ee=this.localClippingEnabled,J=ke.init(this.clippingPlanes,ee),m=oe.get(S,h.length),m.init(),h.push(m),N.enabled===!0&&N.isPresenting===!0){const se=w.xr.getDepthSensingMesh();se!==null&&un(se,P,-1/0,w.sortObjects)}un(S,P,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(X,re),Ge=N.enabled===!1||N.isPresenting===!1||N.hasDepthSensing()===!1,Ge&&Be.addToRenderList(m,S),this.info.render.frame++,J===!0&&ke.beginShadows();const k=d.state.shadowsArray;ie.render(k,S,P),J===!0&&ke.endShadows(),this.info.autoReset===!0&&this.info.reset();const K=m.opaque,H=m.transmissive;if(d.setupLights(),P.isArrayCamera){const se=P.cameras;if(H.length>0)for(let pe=0,Ce=se.length;pe<Ce;pe++){const xe=se[pe];Dr(K,H,S,xe)}Ge&&Be.render(S);for(let pe=0,Ce=se.length;pe<Ce;pe++){const xe=se[pe];Ai(m,S,xe,xe.viewport)}}else H.length>0&&Dr(K,H,S,P),Ge&&Be.render(S),Ai(m,S,P);M!==null&&(Ve.updateMultisampleRenderTarget(M),Ve.updateRenderTargetMipmap(M)),S.isScene===!0&&S.onAfterRender(w,S,P),Ne.resetDefaultState(),R=-1,E=null,B.pop(),B.length>0?(d=B[B.length-1],J===!0&&ke.setGlobalState(w.clippingPlanes,d.state.camera)):d=null,h.pop(),h.length>0?m=h[h.length-1]:m=null};function un(S,P,k,K){if(S.visible===!1)return;if(S.layers.test(P.layers)){if(S.isGroup)k=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(P);else if(S.isLight)d.pushLight(S),S.castShadow&&d.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Oe.intersectsSprite(S)){K&&be.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ue);const pe=ne.update(S),Ce=S.material;Ce.visible&&m.push(S,pe,Ce,k,be.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Oe.intersectsObject(S))){const pe=ne.update(S),Ce=S.material;if(K&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),be.copy(S.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),be.copy(pe.boundingSphere.center)),be.applyMatrix4(S.matrixWorld).applyMatrix4(ue)),Array.isArray(Ce)){const xe=pe.groups;for(let Le=0,Pe=xe.length;Le<Pe;Le++){const Fe=xe[Le],it=Ce[Fe.materialIndex];it&&it.visible&&m.push(S,pe,it,k,be.z,Fe)}}else Ce.visible&&m.push(S,pe,Ce,k,be.z,null)}}const se=S.children;for(let pe=0,Ce=se.length;pe<Ce;pe++)un(se[pe],P,k,K)}function Ai(S,P,k,K){const H=S.opaque,se=S.transmissive,pe=S.transparent;d.setupLightsView(k),J===!0&&ke.setGlobalState(w.clippingPlanes,k),K&&_e.viewport(x.copy(K)),H.length>0&&Hs(H,P,k),se.length>0&&Hs(se,P,k),pe.length>0&&Hs(pe,P,k),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function Dr(S,P,k,K){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[K.id]===void 0&&(d.state.transmissionRenderTarget[K.id]=new jn(1,1,{generateMipmaps:!0,type:Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float")?Qr:jA,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));const se=d.state.transmissionRenderTarget[K.id],pe=K.viewport||x;se.setSize(pe.z,pe.w);const Ce=w.getRenderTarget();w.setRenderTarget(se),w.getClearColor(D),O=w.getClearAlpha(),O<1&&w.setClearColor(16777215,.5),w.clear(),Ge&&Be.render(k);const xe=w.toneMapping;w.toneMapping=Xn;const Le=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),d.setupLightsView(K),J===!0&&ke.setGlobalState(w.clippingPlanes,K),Hs(S,k,K),Ve.updateMultisampleRenderTarget(se),Ve.updateRenderTargetMipmap(se),Je.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let Fe=0,it=P.length;Fe<it;Fe++){const _t=P[Fe],Et=_t.object,mA=_t.geometry,rt=_t.material,Se=_t.group;if(rt.side===MA&&Et.layers.test(K.layers)){const Xt=rt.side;rt.side=tA,rt.needsUpdate=!0,Kf(Et,k,K,mA,rt,Se),rt.side=Xt,rt.needsUpdate=!0,Pe=!0}}Pe===!0&&(Ve.updateMultisampleRenderTarget(se),Ve.updateRenderTargetMipmap(se))}w.setRenderTarget(Ce),w.setClearColor(D,O),Le!==void 0&&(K.viewport=Le),w.toneMapping=xe}function Hs(S,P,k){const K=P.isScene===!0?P.overrideMaterial:null;for(let H=0,se=S.length;H<se;H++){const pe=S[H],Ce=pe.object,xe=pe.geometry,Le=K===null?pe.material:K,Pe=pe.group;Ce.layers.test(k.layers)&&Kf(Ce,P,k,xe,Le,Pe)}}function Kf(S,P,k,K,H,se){S.onBeforeRender(w,P,k,K,H,se),S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.transparent===!0&&H.side===MA&&H.forceSinglePass===!1?(H.side=tA,H.needsUpdate=!0,w.renderBufferDirect(k,P,K,H,S,se),H.side=qn,H.needsUpdate=!0,w.renderBufferDirect(k,P,K,H,S,se),H.side=MA):w.renderBufferDirect(k,P,K,H,S,se),S.onAfterRender(w,P,k,K,H,se)}function Ns(S,P,k){P.isScene!==!0&&(P=Te);const K=He.get(S),H=d.state.lights,se=d.state.shadowsArray,pe=H.state.version,Ce=$.getParameters(S,H.state,se,P,k),xe=$.getProgramCacheKey(Ce);let Le=K.programs;K.environment=S.isMeshStandardMaterial?P.environment:null,K.fog=P.fog,K.envMap=(S.isMeshStandardMaterial?_:I).get(S.envMap||K.environment),K.envMapRotation=K.environment!==null&&S.envMap===null?P.environmentRotation:S.envMapRotation,Le===void 0&&(S.addEventListener("dispose",Ee),Le=new Map,K.programs=Le);let Pe=Le.get(xe);if(Pe!==void 0){if(K.currentProgram===Pe&&K.lightsStateVersion===pe)return Xf(S,Ce),Pe}else Ce.uniforms=$.getUniforms(S),S.onBeforeCompile(Ce,w),Pe=$.acquireProgram(Ce,xe),Le.set(xe,Pe),K.uniforms=Ce.uniforms;const Fe=K.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Fe.clippingPlanes=ke.uniform),Xf(S,Ce),K.needsLights=w0(S),K.lightsStateVersion=pe,K.needsLights&&(Fe.ambientLightColor.value=H.state.ambient,Fe.lightProbe.value=H.state.probe,Fe.directionalLights.value=H.state.directional,Fe.directionalLightShadows.value=H.state.directionalShadow,Fe.spotLights.value=H.state.spot,Fe.spotLightShadows.value=H.state.spotShadow,Fe.rectAreaLights.value=H.state.rectArea,Fe.ltc_1.value=H.state.rectAreaLTC1,Fe.ltc_2.value=H.state.rectAreaLTC2,Fe.pointLights.value=H.state.point,Fe.pointLightShadows.value=H.state.pointShadow,Fe.hemisphereLights.value=H.state.hemi,Fe.directionalShadowMap.value=H.state.directionalShadowMap,Fe.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Fe.spotShadowMap.value=H.state.spotShadowMap,Fe.spotLightMatrix.value=H.state.spotLightMatrix,Fe.spotLightMap.value=H.state.spotLightMap,Fe.pointShadowMap.value=H.state.pointShadowMap,Fe.pointShadowMatrix.value=H.state.pointShadowMatrix),K.currentProgram=Pe,K.uniformsList=null,Pe}function Wf(S){if(S.uniformsList===null){const P=S.currentProgram.getUniforms();S.uniformsList=Ao.seqWithValue(P.seq,S.uniforms)}return S.uniformsList}function Xf(S,P){const k=He.get(S);k.outputColorSpace=P.outputColorSpace,k.batching=P.batching,k.batchingColor=P.batchingColor,k.instancing=P.instancing,k.instancingColor=P.instancingColor,k.instancingMorph=P.instancingMorph,k.skinning=P.skinning,k.morphTargets=P.morphTargets,k.morphNormals=P.morphNormals,k.morphColors=P.morphColors,k.morphTargetsCount=P.morphTargetsCount,k.numClippingPlanes=P.numClippingPlanes,k.numIntersection=P.numClipIntersection,k.vertexAlphas=P.vertexAlphas,k.vertexTangents=P.vertexTangents,k.toneMapping=P.toneMapping}function B0(S,P,k,K,H){P.isScene!==!0&&(P=Te),Ve.resetTextureUnits();const se=P.fog,pe=K.isMeshStandardMaterial?P.environment:null,Ce=M===null?w.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:ti,xe=(K.isMeshStandardMaterial?_:I).get(K.envMap||pe),Le=K.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Pe=!!k.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Fe=!!k.morphAttributes.position,it=!!k.morphAttributes.normal,_t=!!k.morphAttributes.color;let Et=Xn;K.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Et=w.toneMapping);const mA=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,rt=mA!==void 0?mA.length:0,Se=He.get(K),Xt=d.state.lights;if(J===!0&&(ee===!0||S!==E)){const TA=S===E&&K.id===R;ke.setState(K,S,TA)}let st=!1;K.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Xt.state.version||Se.outputColorSpace!==Ce||H.isBatchedMesh&&Se.batching===!1||!H.isBatchedMesh&&Se.batching===!0||H.isBatchedMesh&&Se.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Se.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Se.instancing===!1||!H.isInstancedMesh&&Se.instancing===!0||H.isSkinnedMesh&&Se.skinning===!1||!H.isSkinnedMesh&&Se.skinning===!0||H.isInstancedMesh&&Se.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Se.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Se.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Se.instancingMorph===!1&&H.morphTexture!==null||Se.envMap!==xe||K.fog===!0&&Se.fog!==se||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==ke.numPlanes||Se.numIntersection!==ke.numIntersection)||Se.vertexAlphas!==Le||Se.vertexTangents!==Pe||Se.morphTargets!==Fe||Se.morphNormals!==it||Se.morphColors!==_t||Se.toneMapping!==Et||Se.morphTargetsCount!==rt)&&(st=!0):(st=!0,Se.__version=K.version);let VA=Se.currentProgram;st===!0&&(VA=Ns(K,P,H));let Ri=!1,BA=!1,dl=!1;const Tt=VA.getUniforms(),Mn=Se.uniforms;if(_e.useProgram(VA.program)&&(Ri=!0,BA=!0,dl=!0),K.id!==R&&(R=K.id,BA=!0),Ri||E!==S){Tt.setValue(Q,"projectionMatrix",S.projectionMatrix),Tt.setValue(Q,"viewMatrix",S.matrixWorldInverse);const TA=Tt.map.cameraPosition;TA!==void 0&&TA.setValue(Q,ce.setFromMatrixPosition(S.matrixWorld)),tt.logarithmicDepthBuffer&&Tt.setValue(Q,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Tt.setValue(Q,"isOrthographic",S.isOrthographicCamera===!0),E!==S&&(E=S,BA=!0,dl=!0)}if(H.isSkinnedMesh){Tt.setOptional(Q,H,"bindMatrix"),Tt.setOptional(Q,H,"bindMatrixInverse");const TA=H.skeleton;TA&&(TA.boneTexture===null&&TA.computeBoneTexture(),Tt.setValue(Q,"boneTexture",TA.boneTexture,Ve))}H.isBatchedMesh&&(Tt.setOptional(Q,H,"batchingTexture"),Tt.setValue(Q,"batchingTexture",H._matricesTexture,Ve),Tt.setOptional(Q,H,"batchingIdTexture"),Tt.setValue(Q,"batchingIdTexture",H._indirectTexture,Ve),Tt.setOptional(Q,H,"batchingColorTexture"),H._colorsTexture!==null&&Tt.setValue(Q,"batchingColorTexture",H._colorsTexture,Ve));const pl=k.morphAttributes;if((pl.position!==void 0||pl.normal!==void 0||pl.color!==void 0)&&qe.update(H,k,VA),(BA||Se.receiveShadow!==H.receiveShadow)&&(Se.receiveShadow=H.receiveShadow,Tt.setValue(Q,"receiveShadow",H.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(Mn.envMap.value=xe,Mn.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&P.environment!==null&&(Mn.envMapIntensity.value=P.environmentIntensity),BA&&(Tt.setValue(Q,"toneMappingExposure",w.toneMappingExposure),Se.needsLights&&v0(Mn,dl),se&&K.fog===!0&&Me.refreshFogUniforms(Mn,se),Me.refreshMaterialUniforms(Mn,K,q,V,d.state.transmissionRenderTarget[S.id]),Ao.upload(Q,Wf(Se),Mn,Ve)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Ao.upload(Q,Wf(Se),Mn,Ve),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Tt.setValue(Q,"center",H.center),Tt.setValue(Q,"modelViewMatrix",H.modelViewMatrix),Tt.setValue(Q,"normalMatrix",H.normalMatrix),Tt.setValue(Q,"modelMatrix",H.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){const TA=K.uniformsGroups;for(let gl=0,C0=TA.length;gl<C0;gl++){const Yf=TA[gl];vt.update(Yf,VA),vt.bind(Yf,VA)}}return VA}function v0(S,P){S.ambientLightColor.needsUpdate=P,S.lightProbe.needsUpdate=P,S.directionalLights.needsUpdate=P,S.directionalLightShadows.needsUpdate=P,S.pointLights.needsUpdate=P,S.pointLightShadows.needsUpdate=P,S.spotLights.needsUpdate=P,S.spotLightShadows.needsUpdate=P,S.rectAreaLights.needsUpdate=P,S.hemisphereLights.needsUpdate=P}function w0(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(S,P,k){He.get(S.texture).__webglTexture=P,He.get(S.depthTexture).__webglTexture=k;const K=He.get(S);K.__hasExternalTextures=!0,K.__autoAllocateDepthBuffer=k===void 0,K.__autoAllocateDepthBuffer||Je.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,P){const k=He.get(S);k.__webglFramebuffer=P,k.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(S,P=0,k=0){M=S,b=P,y=k;let K=!0,H=null,se=!1,pe=!1;if(S){const xe=He.get(S);xe.__useDefaultFramebuffer!==void 0?(_e.bindFramebuffer(Q.FRAMEBUFFER,null),K=!1):xe.__webglFramebuffer===void 0?Ve.setupRenderTarget(S):xe.__hasExternalTextures&&Ve.rebindTextures(S,He.get(S.texture).__webglTexture,He.get(S.depthTexture).__webglTexture);const Le=S.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(pe=!0);const Pe=He.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Pe[P])?H=Pe[P][k]:H=Pe[P],se=!0):S.samples>0&&Ve.useMultisampledRTT(S)===!1?H=He.get(S).__webglMultisampledFramebuffer:Array.isArray(Pe)?H=Pe[k]:H=Pe,x.copy(S.viewport),L.copy(S.scissor),z=S.scissorTest}else x.copy(ae).multiplyScalar(q).floor(),L.copy(he).multiplyScalar(q).floor(),z=Ie;if(_e.bindFramebuffer(Q.FRAMEBUFFER,H)&&K&&_e.drawBuffers(S,H),_e.viewport(x),_e.scissor(L),_e.setScissorTest(z),se){const xe=He.get(S.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_CUBE_MAP_POSITIVE_X+P,xe.__webglTexture,k)}else if(pe){const xe=He.get(S.texture),Le=P||0;Q.framebufferTextureLayer(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,xe.__webglTexture,k||0,Le)}R=-1},this.readRenderTargetPixels=function(S,P,k,K,H,se,pe){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=He.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&pe!==void 0&&(Ce=Ce[pe]),Ce){_e.bindFramebuffer(Q.FRAMEBUFFER,Ce);try{const xe=S.texture,Le=xe.format,Pe=xe.type;if(!tt.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=S.width-K&&k>=0&&k<=S.height-H&&Q.readPixels(P,k,K,H,Re.convert(Le),Re.convert(Pe),se)}finally{const xe=M!==null?He.get(M).__webglFramebuffer:null;_e.bindFramebuffer(Q.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(S,P,k,K,H,se,pe){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=He.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&pe!==void 0&&(Ce=Ce[pe]),Ce){_e.bindFramebuffer(Q.FRAMEBUFFER,Ce);try{const xe=S.texture,Le=xe.format,Pe=xe.type;if(!tt.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(P>=0&&P<=S.width-K&&k>=0&&k<=S.height-H){const Fe=Q.createBuffer();Q.bindBuffer(Q.PIXEL_PACK_BUFFER,Fe),Q.bufferData(Q.PIXEL_PACK_BUFFER,se.byteLength,Q.STREAM_READ),Q.readPixels(P,k,K,H,Re.convert(Le),Re.convert(Pe),0),Q.flush();const it=Q.fenceSync(Q.SYNC_GPU_COMMANDS_COMPLETE,0);await CB(Q,it,4);try{Q.bindBuffer(Q.PIXEL_PACK_BUFFER,Fe),Q.getBufferSubData(Q.PIXEL_PACK_BUFFER,0,se)}finally{Q.deleteBuffer(Fe),Q.deleteSync(it)}return se}}finally{const xe=M!==null?He.get(M).__webglFramebuffer:null;_e.bindFramebuffer(Q.FRAMEBUFFER,xe)}}},this.copyFramebufferToTexture=function(S,P=null,k=0){S.isTexture!==!0&&(us("WebGLRenderer: copyFramebufferToTexture function signature has changed."),P=arguments[0]||null,S=arguments[1]);const K=Math.pow(2,-k),H=Math.floor(S.image.width*K),se=Math.floor(S.image.height*K),pe=P!==null?P.x:0,Ce=P!==null?P.y:0;Ve.setTexture2D(S,0),Q.copyTexSubImage2D(Q.TEXTURE_2D,k,0,0,pe,Ce,H,se),_e.unbindTexture()},this.copyTextureToTexture=function(S,P,k=null,K=null,H=0){S.isTexture!==!0&&(us("WebGLRenderer: copyTextureToTexture function signature has changed."),K=arguments[0]||null,S=arguments[1],P=arguments[2],H=arguments[3]||0,k=null);let se,pe,Ce,xe,Le,Pe;k!==null?(se=k.max.x-k.min.x,pe=k.max.y-k.min.y,Ce=k.min.x,xe=k.min.y):(se=S.image.width,pe=S.image.height,Ce=0,xe=0),K!==null?(Le=K.x,Pe=K.y):(Le=0,Pe=0);const Fe=Re.convert(P.format),it=Re.convert(P.type);Ve.setTexture2D(P,0),Q.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,P.flipY),Q.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),Q.pixelStorei(Q.UNPACK_ALIGNMENT,P.unpackAlignment);const _t=Q.getParameter(Q.UNPACK_ROW_LENGTH),Et=Q.getParameter(Q.UNPACK_IMAGE_HEIGHT),mA=Q.getParameter(Q.UNPACK_SKIP_PIXELS),rt=Q.getParameter(Q.UNPACK_SKIP_ROWS),Se=Q.getParameter(Q.UNPACK_SKIP_IMAGES),Xt=S.isCompressedTexture?S.mipmaps[H]:S.image;Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Xt.width),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Xt.height),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,Ce),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,xe),S.isDataTexture?Q.texSubImage2D(Q.TEXTURE_2D,H,Le,Pe,se,pe,Fe,it,Xt.data):S.isCompressedTexture?Q.compressedTexSubImage2D(Q.TEXTURE_2D,H,Le,Pe,Xt.width,Xt.height,Fe,Xt.data):Q.texSubImage2D(Q.TEXTURE_2D,H,Le,Pe,se,pe,Fe,it,Xt),Q.pixelStorei(Q.UNPACK_ROW_LENGTH,_t),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Et),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,mA),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,rt),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,Se),H===0&&P.generateMipmaps&&Q.generateMipmap(Q.TEXTURE_2D),_e.unbindTexture()},this.copyTextureToTexture3D=function(S,P,k=null,K=null,H=0){S.isTexture!==!0&&(us("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,K=arguments[1]||null,S=arguments[2],P=arguments[3],H=arguments[4]||0);let se,pe,Ce,xe,Le,Pe,Fe,it,_t;const Et=S.isCompressedTexture?S.mipmaps[H]:S.image;k!==null?(se=k.max.x-k.min.x,pe=k.max.y-k.min.y,Ce=k.max.z-k.min.z,xe=k.min.x,Le=k.min.y,Pe=k.min.z):(se=Et.width,pe=Et.height,Ce=Et.depth,xe=0,Le=0,Pe=0),K!==null?(Fe=K.x,it=K.y,_t=K.z):(Fe=0,it=0,_t=0);const mA=Re.convert(P.format),rt=Re.convert(P.type);let Se;if(P.isData3DTexture)Ve.setTexture3D(P,0),Se=Q.TEXTURE_3D;else if(P.isDataArrayTexture||P.isCompressedArrayTexture)Ve.setTexture2DArray(P,0),Se=Q.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}Q.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,P.flipY),Q.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),Q.pixelStorei(Q.UNPACK_ALIGNMENT,P.unpackAlignment);const Xt=Q.getParameter(Q.UNPACK_ROW_LENGTH),st=Q.getParameter(Q.UNPACK_IMAGE_HEIGHT),VA=Q.getParameter(Q.UNPACK_SKIP_PIXELS),Ri=Q.getParameter(Q.UNPACK_SKIP_ROWS),BA=Q.getParameter(Q.UNPACK_SKIP_IMAGES);Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Et.width),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Et.height),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,xe),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,Le),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,Pe),S.isDataTexture||S.isData3DTexture?Q.texSubImage3D(Se,H,Fe,it,_t,se,pe,Ce,mA,rt,Et.data):P.isCompressedArrayTexture?Q.compressedTexSubImage3D(Se,H,Fe,it,_t,se,pe,Ce,mA,Et.data):Q.texSubImage3D(Se,H,Fe,it,_t,se,pe,Ce,mA,rt,Et),Q.pixelStorei(Q.UNPACK_ROW_LENGTH,Xt),Q.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,st),Q.pixelStorei(Q.UNPACK_SKIP_PIXELS,VA),Q.pixelStorei(Q.UNPACK_SKIP_ROWS,Ri),Q.pixelStorei(Q.UNPACK_SKIP_IMAGES,BA),H===0&&P.generateMipmaps&&Q.generateMipmap(Se),_e.unbindTexture()},this.initRenderTarget=function(S){He.get(S).__webglFramebuffer===void 0&&Ve.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Ve.setTextureCube(S,0):S.isData3DTexture?Ve.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Ve.setTexture2DArray(S,0):Ve.setTexture2D(S,0),_e.unbindTexture()},this.resetState=function(){b=0,y=0,M=null,_e.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===hf?"display-p3":"srgb",t.unpackColorSpace=ot.workingColorSpace===Yo?"display-p3":"srgb"}}class Bf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ke(e),this.density=t}clone(){return new Bf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class M_ extends lA{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Zo extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const vo=new F,wo=new F,kh=new ut,kr=new Qs,oa=new Is,zl=new F,zh=new F;class qo extends lA{constructor(e=new Gt,t=new Zo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,A=[0];for(let i=1,r=t.count;i<r;i++)vo.fromBufferAttribute(t,i-1),wo.fromBufferAttribute(t,i),A[i]=A[i-1],A[i]+=vo.distanceTo(wo);e.setAttribute("lineDistance",new zt(A,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),oa.copy(A.boundingSphere),oa.applyMatrix4(i),oa.radius+=r,e.ray.intersectsSphere(oa)===!1)return;kh.copy(i).invert(),kr.copy(e.ray).applyMatrix4(kh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=A.index,f=A.attributes.position;if(c!==null){const p=Math.max(0,s.start),g=Math.min(c.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=l){const h=c.getX(m),B=c.getX(m+1),w=la(this,e,kr,o,h,B);w&&t.push(w)}if(this.isLineLoop){const m=c.getX(g-1),d=c.getX(p),h=la(this,e,kr,o,m,d);h&&t.push(h)}}else{const p=Math.max(0,s.start),g=Math.min(f.count,s.start+s.count);for(let m=p,d=g-1;m<d;m+=l){const h=la(this,e,kr,o,m,m+1);h&&t.push(h)}if(this.isLineLoop){const m=la(this,e,kr,o,g-1,p);m&&t.push(m)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function la(n,e,t,A,i,r){const s=n.geometry.attributes.position;if(vo.fromBufferAttribute(s,i),wo.fromBufferAttribute(s,r),t.distanceSqToSegment(vo,wo,zl,zh)>A)return;zl.applyMatrix4(n.matrixWorld);const o=e.ray.origin.distanceTo(zl);if(!(o<e.near||o>e.far))return{distance:o,point:zh.clone().applyMatrix4(n.matrixWorld),index:i,face:null,faceIndex:null,object:n}}const Kh=new F,Wh=new F;class b_ extends qo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,A=[];for(let i=0,r=t.count;i<r;i+=2)Kh.fromBufferAttribute(t,i),Wh.fromBufferAttribute(t,i+1),A[i]=i===0?0:A[i-1],A[i+1]=A[i]+Kh.distanceTo(Wh);e.setAttribute("lineDistance",new zt(A,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class F_ extends Qi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xh=new ut,pu=new Qs,ca=new Is,ua=new F;class Eg extends lA{constructor(e=new Gt,t=new F_){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),ca.copy(A.boundingSphere),ca.applyMatrix4(i),ca.radius+=r,e.ray.intersectsSphere(ca)===!1)return;Xh.copy(i).invert(),pu.copy(e.ray).applyMatrix4(Xh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=A.index,u=A.attributes.position;if(l!==null){const f=Math.max(0,s.start),p=Math.min(l.count,s.start+s.count);for(let g=f,m=p;g<m;g++){const d=l.getX(g);ua.fromBufferAttribute(u,d),Yh(ua,d,o,i,e,t,this)}}else{const f=Math.max(0,s.start),p=Math.min(u.count,s.start+s.count);for(let g=f,m=p;g<m;g++)ua.fromBufferAttribute(u,g),Yh(ua,g,o,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Yh(n,e,t,A,i,r,s){const a=pu.distanceSqToPoint(n);if(a<t){const o=new F;pu.closestPointToPoint(n,o),o.applyMatrix4(A);const l=i.ray.origin.distanceTo(o);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,object:s})}}class T_ extends dA{constructor(e,t,A,i,r,s,a,o,l){super(e,t,A,i,r,s,a,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class I_{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const A=this.getUtoTmapping(e);return this.getPoint(A,t)}getPoints(e=5){const t=[];for(let A=0;A<=e;A++)t.push(this.getPoint(A/e));return t}getSpacedPoints(e=5){const t=[];for(let A=0;A<=e;A++)t.push(this.getPointAt(A/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let A,i=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)A=this.getPoint(s/e),r+=A.distanceTo(i),t.push(r),i=A;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const A=this.getLengths();let i=0;const r=A.length;let s;t?s=t:s=e*A[r-1];let a=0,o=r-1,l;for(;a<=o;)if(i=Math.floor(a+(o-a)/2),l=A[i]-s,l<0)a=i+1;else if(l>0)o=i-1;else{o=i;break}if(i=o,A[i]===s)return i/(r-1);const c=A[i],f=A[i+1]-c,p=(s-c)/f;return(i+p)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const s=this.getPoint(i),a=this.getPoint(r),o=t||(s.isVector2?new Ue:new F);return o.copy(a).sub(s).normalize(),o}getTangentAt(e,t){const A=this.getUtoTmapping(e);return this.getTangent(A,t)}computeFrenetFrames(e,t){const A=new F,i=[],r=[],s=[],a=new F,o=new ut;for(let p=0;p<=e;p++){const g=p/e;i[p]=this.getTangentAt(g,new F)}r[0]=new F,s[0]=new F;let l=Number.MAX_VALUE;const c=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);c<=l&&(l=c,A.set(1,0,0)),u<=l&&(l=u,A.set(0,1,0)),f<=l&&A.set(0,0,1),a.crossVectors(i[0],A).normalize(),r[0].crossVectors(i[0],a),s[0].crossVectors(i[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),s[p]=s[p-1].clone(),a.crossVectors(i[p-1],i[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(qt(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(o.makeRotationAxis(a,g))}s[p].crossVectors(i[p],r[p])}if(t===!0){let p=Math.acos(qt(r[0].dot(r[e]),-1,1));p/=e,i[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(o.makeRotationAxis(i[g],p*g)),s[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}const fa=new F,ha=new F,Kl=new F,da=new JA;class Q_ extends Gt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(cs*t),s=e.getIndex(),a=e.getAttribute("position"),o=s?s.count:a.count,l=[0,0,0],c=["a","b","c"],u=new Array(3),f={},p=[];for(let g=0;g<o;g+=3){s?(l[0]=s.getX(g),l[1]=s.getX(g+1),l[2]=s.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:m,b:d,c:h}=da;if(m.fromBufferAttribute(a,l[0]),d.fromBufferAttribute(a,l[1]),h.fromBufferAttribute(a,l[2]),da.getNormal(Kl),u[0]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,u[1]=`${Math.round(d.x*i)},${Math.round(d.y*i)},${Math.round(d.z*i)}`,u[2]=`${Math.round(h.x*i)},${Math.round(h.y*i)},${Math.round(h.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let B=0;B<3;B++){const w=(B+1)%3,C=u[B],b=u[w],y=da[c[B]],M=da[c[w]],R=`${C}_${b}`,E=`${b}_${C}`;E in f&&f[E]?(Kl.dot(f[E].normal)<=r&&(p.push(y.x,y.y,y.z),p.push(M.x,M.y,M.z)),f[E]=null):R in f||(f[R]={index0:l[B],index1:l[w],normal:Kl.clone()})}}for(const g in f)if(f[g]){const{index0:m,index1:d}=f[g];fa.fromBufferAttribute(a,m),ha.fromBufferAttribute(a,d),p.push(fa.x,fa.y,fa.z),p.push(ha.x,ha.y,ha.z)}this.setAttribute("position",new zt(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class jo extends Gt{constructor(e=.5,t=1,A=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:A,phiSegments:i,thetaStart:r,thetaLength:s},A=Math.max(3,A),i=Math.max(1,i);const a=[],o=[],l=[],c=[];let u=e;const f=(t-e)/i,p=new F,g=new Ue;for(let m=0;m<=i;m++){for(let d=0;d<=A;d++){const h=r+d/A*s;p.x=u*Math.cos(h),p.y=u*Math.sin(h),o.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,c.push(g.x,g.y)}u+=f}for(let m=0;m<i;m++){const d=m*(A+1);for(let h=0;h<A;h++){const B=h+d,w=B,C=B+A+1,b=B+A+2,y=B+1;a.push(w,C,y),a.push(C,b,y)}}this.setIndex(a),this.setAttribute("position",new zt(o,3)),this.setAttribute("normal",new zt(l,3)),this.setAttribute("uv",new zt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class an extends Gt{constructor(e=1,t=32,A=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:A,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),A=Math.max(2,Math.floor(A));const o=Math.min(s+a,Math.PI);let l=0;const c=[],u=new F,f=new F,p=[],g=[],m=[],d=[];for(let h=0;h<=A;h++){const B=[],w=h/A;let C=0;h===0&&s===0?C=.5/t:h===A&&o===Math.PI&&(C=-.5/t);for(let b=0;b<=t;b++){const y=b/t;u.x=-e*Math.cos(i+y*r)*Math.sin(s+w*a),u.y=e*Math.cos(s+w*a),u.z=e*Math.sin(i+y*r)*Math.sin(s+w*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),m.push(f.x,f.y,f.z),d.push(y+C,1-w),B.push(l++)}c.push(B)}for(let h=0;h<A;h++)for(let B=0;B<t;B++){const w=c[h][B+1],C=c[h][B],b=c[h+1][B],y=c[h+1][B+1];(h!==0||s>0)&&p.push(w,C,y),(h!==A-1||o<Math.PI)&&p.push(C,b,y)}this.setIndex(p),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(m,3)),this.setAttribute("uv",new zt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gu extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rg,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class yg extends lA{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Wl=new ut,Jh=new F,Zh=new F;class L_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new gf,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,A=this.matrix;Jh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jh),Zh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zh),t.updateMatrixWorld(),Wl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wl),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(Wl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const qh=new ut,zr=new F,Xl=new F;class R_ extends L_{constructor(){super(new yA(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ue(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){const A=this.camera,i=this.matrix,r=e.distance||A.far;r!==A.far&&(A.far=r,A.updateProjectionMatrix()),zr.setFromMatrixPosition(e.matrixWorld),A.position.copy(zr),Xl.copy(A.position),Xl.add(this._cubeDirections[t]),A.up.copy(this._cubeUps[t]),A.lookAt(Xl),A.updateMatrixWorld(),i.makeTranslation(-zr.x,-zr.y,-zr.z),qh.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qh)}}class jh extends yg{constructor(e,t,A=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=A,this.decay=i,this.shadow=new R_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class D_ extends yg{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Sg{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=$h(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=$h();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function $h(){return(typeof performance>"u"?Date:performance).now()}const ed=new ut;class Ug{constructor(e,t,A=0,i=1/0){this.ray=new Qs(e,t),this.near=A,this.far=i,this.camera=null,this.layers=new pf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ed.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ed),this}intersectObject(e,t=!0,A=[]){return mu(e,this,A,t),A.sort(td),A}intersectObjects(e,t=!0,A=[]){for(let i=0,r=e.length;i<r;i++)mu(e[i],this,A,t);return A.sort(td),A}}function td(n,e){return n.distance-e.distance}function mu(n,e,t,A){let i=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(i=!1),i===!0&&A===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)mu(r[s],e,t,!0)}}class Ad{constructor(e=1,t=0,A=0){return this.radius=e,this.phi=t,this.theta=A,this}set(e,t,A){return this.radius=e,this.phi=t,this.theta=A,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,A){return this.radius=Math.sqrt(e*e+t*t+A*A),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,A),this.phi=Math.acos(qt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sf);const nd={type:"change"},Yl={type:"start"},id={type:"end"},pa=new Qs,rd=new Hn,P_=Math.cos(70*vB.DEG2RAD);class Mg extends Ii{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Di.ROTATE,MIDDLE:Di.DOLLY,RIGHT:Di.PAN},this.touches={ONE:Pi.ROTATE,TWO:Pi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(v){v.addEventListener("keydown",me),this._domElementKeyEvents=v},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",me),this._domElementKeyEvents=null},this.saveState=function(){A.target0.copy(A.target),A.position0.copy(A.object.position),A.zoom0=A.object.zoom},this.reset=function(){A.target.copy(A.target0),A.object.position.copy(A.position0),A.object.zoom=A.zoom0,A.object.updateProjectionMatrix(),A.dispatchEvent(nd),A.update(),r=i.NONE},this.update=(function(){const v=new F,N=new bi().setFromUnitVectors(e.up,new F(0,1,0)),G=N.clone().invert(),Y=new F,Ae=new bi,Ee=new F,De=2*Math.PI;return function(Lt=null){const At=A.object.position;v.copy(At).sub(A.target),v.applyQuaternion(N),a.setFromVector3(v),A.autoRotate&&r===i.NONE&&z(x(Lt)),A.enableDamping?(a.theta+=o.theta*A.dampingFactor,a.phi+=o.phi*A.dampingFactor):(a.theta+=o.theta,a.phi+=o.phi);let Rt=A.minAzimuthAngle,Ft=A.maxAzimuthAngle;isFinite(Rt)&&isFinite(Ft)&&(Rt<-Math.PI?Rt+=De:Rt>Math.PI&&(Rt-=De),Ft<-Math.PI?Ft+=De:Ft>Math.PI&&(Ft-=De),Rt<=Ft?a.theta=Math.max(Rt,Math.min(Ft,a.theta)):a.theta=a.theta>(Rt+Ft)/2?Math.max(Rt,a.theta):Math.min(Ft,a.theta)),a.phi=Math.max(A.minPolarAngle,Math.min(A.maxPolarAngle,a.phi)),a.makeSafe(),A.enableDamping===!0?A.target.addScaledVector(c,A.dampingFactor):A.target.add(c),A.target.sub(A.cursor),A.target.clampLength(A.minTargetRadius,A.maxTargetRadius),A.target.add(A.cursor);let Un=!1;if(A.zoomToCursor&&y||A.object.isOrthographicCamera)a.radius=ae(a.radius);else{const Wt=a.radius;a.radius=ae(a.radius*l),Un=Wt!=a.radius}if(v.setFromSpherical(a),v.applyQuaternion(G),At.copy(A.target).add(v),A.object.lookAt(A.target),A.enableDamping===!0?(o.theta*=1-A.dampingFactor,o.phi*=1-A.dampingFactor,c.multiplyScalar(1-A.dampingFactor)):(o.set(0,0,0),c.set(0,0,0)),A.zoomToCursor&&y){let Wt=null;if(A.object.isPerspectiveCamera){const un=v.length();Wt=ae(un*l);const Ai=un-Wt;A.object.position.addScaledVector(C,Ai),A.object.updateMatrixWorld(),Un=!!Ai}else if(A.object.isOrthographicCamera){const un=new F(b.x,b.y,0);un.unproject(A.object);const Ai=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),A.object.updateProjectionMatrix(),Un=Ai!==A.object.zoom;const Dr=new F(b.x,b.y,0);Dr.unproject(A.object),A.object.position.sub(Dr).add(un),A.object.updateMatrixWorld(),Wt=v.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),A.zoomToCursor=!1;Wt!==null&&(this.screenSpacePanning?A.target.set(0,0,-1).transformDirection(A.object.matrix).multiplyScalar(Wt).add(A.object.position):(pa.origin.copy(A.object.position),pa.direction.set(0,0,-1).transformDirection(A.object.matrix),Math.abs(A.object.up.dot(pa.direction))<P_?e.lookAt(A.target):(rd.setFromNormalAndCoplanarPoint(A.object.up,A.target),pa.intersectPlane(rd,A.target))))}else if(A.object.isOrthographicCamera){const Wt=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),Wt!==A.object.zoom&&(A.object.updateProjectionMatrix(),Un=!0)}return l=1,y=!1,Un||Y.distanceToSquared(A.object.position)>s||8*(1-Ae.dot(A.object.quaternion))>s||Ee.distanceToSquared(A.target)>s?(A.dispatchEvent(nd),Y.copy(A.object.position),Ae.copy(A.object.quaternion),Ee.copy(A.target),!0):!1}})(),this.dispose=function(){A.domElement.removeEventListener("contextmenu",Be),A.domElement.removeEventListener("pointerdown",Ve),A.domElement.removeEventListener("pointercancel",_),A.domElement.removeEventListener("wheel",ne),A.domElement.removeEventListener("pointermove",I),A.domElement.removeEventListener("pointerup",_),A.domElement.getRootNode().removeEventListener("keydown",Me,{capture:!0}),A._domElementKeyEvents!==null&&(A._domElementKeyEvents.removeEventListener("keydown",me),A._domElementKeyEvents=null)};const A=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const s=1e-6,a=new Ad,o=new Ad;let l=1;const c=new F,u=new Ue,f=new Ue,p=new Ue,g=new Ue,m=new Ue,d=new Ue,h=new Ue,B=new Ue,w=new Ue,C=new F,b=new Ue;let y=!1;const M=[],R={};let E=!1;function x(v){return v!==null?2*Math.PI/60*A.autoRotateSpeed*v:2*Math.PI/60/60*A.autoRotateSpeed}function L(v){const N=Math.abs(v*.01);return Math.pow(.95,A.zoomSpeed*N)}function z(v){o.theta-=v}function D(v){o.phi-=v}const O=(function(){const v=new F;return function(G,Y){v.setFromMatrixColumn(Y,0),v.multiplyScalar(-G),c.add(v)}})(),Z=(function(){const v=new F;return function(G,Y){A.screenSpacePanning===!0?v.setFromMatrixColumn(Y,1):(v.setFromMatrixColumn(Y,0),v.crossVectors(A.object.up,v)),v.multiplyScalar(G),c.add(v)}})(),V=(function(){const v=new F;return function(G,Y){const Ae=A.domElement;if(A.object.isPerspectiveCamera){const Ee=A.object.position;v.copy(Ee).sub(A.target);let De=v.length();De*=Math.tan(A.object.fov/2*Math.PI/180),O(2*G*De/Ae.clientHeight,A.object.matrix),Z(2*Y*De/Ae.clientHeight,A.object.matrix)}else A.object.isOrthographicCamera?(O(G*(A.object.right-A.object.left)/A.object.zoom/Ae.clientWidth,A.object.matrix),Z(Y*(A.object.top-A.object.bottom)/A.object.zoom/Ae.clientHeight,A.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),A.enablePan=!1)}})();function q(v){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l/=v:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function X(v){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l*=v:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function re(v,N){if(!A.zoomToCursor)return;y=!0;const G=A.domElement.getBoundingClientRect(),Y=v-G.left,Ae=N-G.top,Ee=G.width,De=G.height;b.x=Y/Ee*2-1,b.y=-(Ae/De)*2+1,C.set(b.x,b.y,1).unproject(A.object).sub(A.object.position).normalize()}function ae(v){return Math.max(A.minDistance,Math.min(A.maxDistance,v))}function he(v){u.set(v.clientX,v.clientY)}function Ie(v){re(v.clientX,v.clientX),h.set(v.clientX,v.clientY)}function Oe(v){g.set(v.clientX,v.clientY)}function J(v){f.set(v.clientX,v.clientY),p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;z(2*Math.PI*p.x/N.clientHeight),D(2*Math.PI*p.y/N.clientHeight),u.copy(f),A.update()}function ee(v){B.set(v.clientX,v.clientY),w.subVectors(B,h),w.y>0?q(L(w.y)):w.y<0&&X(L(w.y)),h.copy(B),A.update()}function ue(v){m.set(v.clientX,v.clientY),d.subVectors(m,g).multiplyScalar(A.panSpeed),V(d.x,d.y),g.copy(m),A.update()}function ce(v){re(v.clientX,v.clientY),v.deltaY<0?X(L(v.deltaY)):v.deltaY>0&&q(L(v.deltaY)),A.update()}function be(v){let N=!1;switch(v.code){case A.keys.UP:v.ctrlKey||v.metaKey||v.shiftKey?D(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(0,A.keyPanSpeed),N=!0;break;case A.keys.BOTTOM:v.ctrlKey||v.metaKey||v.shiftKey?D(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(0,-A.keyPanSpeed),N=!0;break;case A.keys.LEFT:v.ctrlKey||v.metaKey||v.shiftKey?z(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(A.keyPanSpeed,0),N=!0;break;case A.keys.RIGHT:v.ctrlKey||v.metaKey||v.shiftKey?z(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):V(-A.keyPanSpeed,0),N=!0;break}N&&(v.preventDefault(),A.update())}function Te(v){if(M.length===1)u.set(v.pageX,v.pageY);else{const N=Ne(v),G=.5*(v.pageX+N.x),Y=.5*(v.pageY+N.y);u.set(G,Y)}}function Ge(v){if(M.length===1)g.set(v.pageX,v.pageY);else{const N=Ne(v),G=.5*(v.pageX+N.x),Y=.5*(v.pageY+N.y);g.set(G,Y)}}function et(v){const N=Ne(v),G=v.pageX-N.x,Y=v.pageY-N.y,Ae=Math.sqrt(G*G+Y*Y);h.set(0,Ae)}function Q(v){A.enableZoom&&et(v),A.enablePan&&Ge(v)}function ht(v){A.enableZoom&&et(v),A.enableRotate&&Te(v)}function Je(v){if(M.length==1)f.set(v.pageX,v.pageY);else{const G=Ne(v),Y=.5*(v.pageX+G.x),Ae=.5*(v.pageY+G.y);f.set(Y,Ae)}p.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;z(2*Math.PI*p.x/N.clientHeight),D(2*Math.PI*p.y/N.clientHeight),u.copy(f)}function tt(v){if(M.length===1)m.set(v.pageX,v.pageY);else{const N=Ne(v),G=.5*(v.pageX+N.x),Y=.5*(v.pageY+N.y);m.set(G,Y)}d.subVectors(m,g).multiplyScalar(A.panSpeed),V(d.x,d.y),g.copy(m)}function _e(v){const N=Ne(v),G=v.pageX-N.x,Y=v.pageY-N.y,Ae=Math.sqrt(G*G+Y*Y);B.set(0,Ae),w.set(0,Math.pow(B.y/h.y,A.zoomSpeed)),q(w.y),h.copy(B);const Ee=(v.pageX+N.x)*.5,De=(v.pageY+N.y)*.5;re(Ee,De)}function Bt(v){A.enableZoom&&_e(v),A.enablePan&&tt(v)}function He(v){A.enableZoom&&_e(v),A.enableRotate&&Je(v)}function Ve(v){A.enabled!==!1&&(M.length===0&&(A.domElement.setPointerCapture(v.pointerId),A.domElement.addEventListener("pointermove",I),A.domElement.addEventListener("pointerup",_)),!we(v)&&(qe(v),v.pointerType==="touch"?ke(v):W(v)))}function I(v){A.enabled!==!1&&(v.pointerType==="touch"?ie(v):te(v))}function _(v){switch(Qe(v),M.length){case 0:A.domElement.releasePointerCapture(v.pointerId),A.domElement.removeEventListener("pointermove",I),A.domElement.removeEventListener("pointerup",_),A.dispatchEvent(id),r=i.NONE;break;case 1:const N=M[0],G=R[N];ke({pointerId:N,pageX:G.x,pageY:G.y});break}}function W(v){let N;switch(v.button){case 0:N=A.mouseButtons.LEFT;break;case 1:N=A.mouseButtons.MIDDLE;break;case 2:N=A.mouseButtons.RIGHT;break;default:N=-1}switch(N){case Di.DOLLY:if(A.enableZoom===!1)return;Ie(v),r=i.DOLLY;break;case Di.ROTATE:if(v.ctrlKey||v.metaKey||v.shiftKey){if(A.enablePan===!1)return;Oe(v),r=i.PAN}else{if(A.enableRotate===!1)return;he(v),r=i.ROTATE}break;case Di.PAN:if(v.ctrlKey||v.metaKey||v.shiftKey){if(A.enableRotate===!1)return;he(v),r=i.ROTATE}else{if(A.enablePan===!1)return;Oe(v),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Yl)}function te(v){switch(r){case i.ROTATE:if(A.enableRotate===!1)return;J(v);break;case i.DOLLY:if(A.enableZoom===!1)return;ee(v);break;case i.PAN:if(A.enablePan===!1)return;ue(v);break}}function ne(v){A.enabled===!1||A.enableZoom===!1||r!==i.NONE||(v.preventDefault(),A.dispatchEvent(Yl),ce($(v)),A.dispatchEvent(id))}function $(v){const N=v.deltaMode,G={clientX:v.clientX,clientY:v.clientY,deltaY:v.deltaY};switch(N){case 1:G.deltaY*=16;break;case 2:G.deltaY*=100;break}return v.ctrlKey&&!E&&(G.deltaY*=10),G}function Me(v){v.key==="Control"&&(E=!0,A.domElement.getRootNode().addEventListener("keyup",oe,{passive:!0,capture:!0}))}function oe(v){v.key==="Control"&&(E=!1,A.domElement.getRootNode().removeEventListener("keyup",oe,{passive:!0,capture:!0}))}function me(v){A.enabled===!1||A.enablePan===!1||be(v)}function ke(v){switch(Re(v),M.length){case 1:switch(A.touches.ONE){case Pi.ROTATE:if(A.enableRotate===!1)return;Te(v),r=i.TOUCH_ROTATE;break;case Pi.PAN:if(A.enablePan===!1)return;Ge(v),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(A.touches.TWO){case Pi.DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;Q(v),r=i.TOUCH_DOLLY_PAN;break;case Pi.DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;ht(v),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Yl)}function ie(v){switch(Re(v),r){case i.TOUCH_ROTATE:if(A.enableRotate===!1)return;Je(v),A.update();break;case i.TOUCH_PAN:if(A.enablePan===!1)return;tt(v),A.update();break;case i.TOUCH_DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;Bt(v),A.update();break;case i.TOUCH_DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;He(v),A.update();break;default:r=i.NONE}}function Be(v){A.enabled!==!1&&v.preventDefault()}function qe(v){M.push(v.pointerId)}function Qe(v){delete R[v.pointerId];for(let N=0;N<M.length;N++)if(M[N]==v.pointerId){M.splice(N,1);return}}function we(v){for(let N=0;N<M.length;N++)if(M[N]==v.pointerId)return!0;return!1}function Re(v){let N=R[v.pointerId];N===void 0&&(N=new Ue,R[v.pointerId]=N),N.set(v.pageX,v.pageY)}function Ne(v){const N=v.pointerId===M[0]?M[1]:M[0];return R[N]}A.domElement.addEventListener("contextmenu",Be),A.domElement.addEventListener("pointerdown",Ve),A.domElement.addEventListener("pointercancel",_),A.domElement.addEventListener("wheel",ne,{passive:!1}),A.domElement.getRootNode().addEventListener("keydown",Me,{passive:!0,capture:!0}),this.update()}}const H_={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class $o{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const N_=new Bg(-1,1,1,-1,0,1);class O_ extends Gt{constructor(){super(),this.setAttribute("position",new zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new zt([0,2,0,0,2,0],2))}}const G_=new O_;class V_{constructor(e){this._mesh=new xt(G_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,N_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Bu extends $o{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Kt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=dg.clone(e.uniforms),this.material=new Kt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new V_(this.material)}render(e,t,A){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=A.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class sd extends $o{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,A){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,s,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(A),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class k_ extends $o{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class z_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const A=e.getSize(new Ue);this._width=A.width,this._height=A.height,t=new jn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qr}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Bu(H_),this.copyPass.material.blending=En,this.clock=new Sg}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let A=!1;for(let i=0,r=this.passes.length;i<r;i++){const s=this.passes[i];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,A),s.needsSwap){if(A){const a=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}sd!==void 0&&(s instanceof sd?A=!0:s instanceof k_&&(A=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const A=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(A,i),this.renderTarget2.setSize(A,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(A,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class K_ extends $o{constructor(e,t,A=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=A,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Ke}render(e,t,A){const i=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:A),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=i}}function bg(n,e,t){const A=t.length-n-1;if(e>=t[A])return A-1;if(e<=t[n])return n;let i=n,r=A,s=Math.floor((i+r)/2);for(;e<t[s]||e>=t[s+1];)e<t[s]?r=s:i=s,s=Math.floor((i+r)/2);return s}function W_(n,e,t,A){const i=[],r=[],s=[];i[0]=1;for(let a=1;a<=t;++a){r[a]=e-A[n+1-a],s[a]=A[n+a]-e;let o=0;for(let l=0;l<a;++l){const c=s[l+1],u=r[a-l],f=i[l]/(c+u);i[l]=o+c*f,o=u*f}i[a]=o}return i}function X_(n,e,t,A){const i=bg(n,A,e),r=W_(i,A,n,e),s=new ct(0,0,0,0);for(let a=0;a<=n;++a){const o=t[i-n+a],l=r[a],c=o.w*l;s.x+=o.x*c,s.y+=o.y*c,s.z+=o.z*c,s.w+=o.w*l}return s}function Y_(n,e,t,A,i){const r=[];for(let u=0;u<=t;++u)r[u]=0;const s=[];for(let u=0;u<=A;++u)s[u]=r.slice(0);const a=[];for(let u=0;u<=t;++u)a[u]=r.slice(0);a[0][0]=1;const o=r.slice(0),l=r.slice(0);for(let u=1;u<=t;++u){o[u]=e-i[n+1-u],l[u]=i[n+u]-e;let f=0;for(let p=0;p<u;++p){const g=l[p+1],m=o[u-p];a[u][p]=g+m;const d=a[p][u-1]/a[u][p];a[p][u]=f+g*d,f=m*d}a[u][u]=f}for(let u=0;u<=t;++u)s[0][u]=a[u][t];for(let u=0;u<=t;++u){let f=0,p=1;const g=[];for(let m=0;m<=t;++m)g[m]=r.slice(0);g[0][0]=1;for(let m=1;m<=A;++m){let d=0;const h=u-m,B=t-m;u>=m&&(g[p][0]=g[f][0]/a[B+1][h],d=g[p][0]*a[h][B]);const w=h>=-1?1:-h,C=u-1<=B?m-1:t-u;for(let y=w;y<=C;++y)g[p][y]=(g[f][y]-g[f][y-1])/a[B+1][h+y],d+=g[p][y]*a[h+y][B];u<=B&&(g[p][m]=-g[f][m-1]/a[B+1][u],d+=g[p][m]*a[u][B]),s[m][u]=d;const b=f;f=p,p=b}}let c=t;for(let u=1;u<=A;++u){for(let f=0;f<=t;++f)s[u][f]*=c;c*=t-u}return s}function J_(n,e,t,A,i){const r=i<n?i:n,s=[],a=bg(n,A,e),o=Y_(a,A,n,r,e),l=[];for(let c=0;c<t.length;++c){const u=t[c].clone(),f=u.w;u.x*=f,u.y*=f,u.z*=f,l[c]=u}for(let c=0;c<=r;++c){const u=l[a-n].clone().multiplyScalar(o[c][0]);for(let f=1;f<=n;++f)u.add(l[a-n+f].clone().multiplyScalar(o[c][f]));s[c]=u}for(let c=r+1;c<=i+1;++c)s[c]=new ct(0,0,0);return s}function Z_(n,e){let t=1;for(let i=2;i<=n;++i)t*=i;let A=1;for(let i=2;i<=e;++i)A*=i;for(let i=2;i<=n-e;++i)A*=i;return t/A}function q_(n){const e=n.length,t=[],A=[];for(let r=0;r<e;++r){const s=n[r];t[r]=new F(s.x,s.y,s.z),A[r]=s.w}const i=[];for(let r=0;r<e;++r){const s=t[r].clone();for(let a=1;a<=r;++a)s.sub(i[r-a].clone().multiplyScalar(Z_(r,a)*A[a]));i[r]=s.divideScalar(A[0])}return i}function j_(n,e,t,A,i){const r=J_(n,e,t,A,i);return q_(r)}class $_ extends I_{constructor(e,t,A,i,r){super(),this.degree=e,this.knots=t,this.controlPoints=[],this.startKnot=i||0,this.endKnot=r||this.knots.length-1;for(let s=0;s<A.length;++s){const a=A[s];this.controlPoints[s]=new ct(a.x,a.y,a.z,a.w)}}getPoint(e,t=new F){const A=t,i=this.knots[this.startKnot]+e*(this.knots[this.endKnot]-this.knots[this.startKnot]),r=X_(this.degree,this.knots,this.controlPoints,i);return r.w!==1&&r.divideScalar(r.w),A.set(r.x,r.y,r.z)}getTangent(e,t=new F){const A=t,i=this.knots[0]+e*(this.knots[this.knots.length-1]-this.knots[0]),r=j_(this.degree,this.knots,this.controlPoints,i,1);return A.copy(r[1]).normalize(),A}}/*!
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
***************************************************************************** */var vu=function(n,e){return vu=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,A){t.__proto__=A}||function(t,A){for(var i in A)Object.prototype.hasOwnProperty.call(A,i)&&(t[i]=A[i])},vu(n,e)};function $A(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");vu(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var wu=function(){return wu=Object.assign||function(e){for(var t,A=1,i=arguments.length;A<i;A++){t=arguments[A];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},wu.apply(this,arguments)};function uA(n,e,t,A){function i(r){return r instanceof t?r:new t(function(s){s(r)})}return new(t||(t=Promise))(function(r,s){function a(c){try{l(A.next(c))}catch(u){s(u)}}function o(c){try{l(A.throw(c))}catch(u){s(u)}}function l(c){c.done?r(c.value):i(c.value).then(a,o)}l((A=A.apply(n,[])).next())})}function rA(n,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},A,i,r,s;return s={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(l){return function(c){return o([l,c])}}function o(l){if(A)throw new TypeError("Generator is already executing.");for(;t;)try{if(A=1,i&&(r=l[0]&2?i.return:l[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,l[1])).done)return r;switch(i=0,r&&(l=[l[0]&2,r.value]),l[0]){case 0:case 1:r=l;break;case 4:return t.label++,{value:l[1],done:!1};case 5:t.label++,i=l[1],l=[0];continue;case 7:l=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(l[0]===6||l[0]===2)){t=0;continue}if(l[0]===3&&(!r||l[1]>r[0]&&l[1]<r[3])){t.label=l[1];break}if(l[0]===6&&t.label<r[1]){t.label=r[1],r=l;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(l);break}r[2]&&t.ops.pop(),t.trys.pop();continue}l=e.call(n,t)}catch(c){l=[6,c],i=0}finally{A=r=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}function ga(n,e,t){if(arguments.length===2)for(var A=0,i=e.length,r;A<i;A++)(r||!(A in e))&&(r||(r=Array.prototype.slice.call(e,0,A)),r[A]=e[A]);return n.concat(r||e)}var Sn=(function(){function n(e,t,A,i){this.left=e,this.top=t,this.width=A,this.height=i}return n.prototype.add=function(e,t,A,i){return new n(this.left+e,this.top+t,this.width+A,this.height+i)},n.fromClientRect=function(e,t){return new n(t.left+e.windowBounds.left,t.top+e.windowBounds.top,t.width,t.height)},n.fromDOMRectList=function(e,t){var A=Array.from(t).find(function(i){return i.width!==0});return A?new n(A.left+e.windowBounds.left,A.top+e.windowBounds.top,A.width,A.height):n.EMPTY},n.EMPTY=new n(0,0,0,0),n})(),el=function(n,e){return Sn.fromClientRect(n,e.getBoundingClientRect())},eE=function(n){var e=n.body,t=n.documentElement;if(!e||!t)throw new Error("Unable to get document size");var A=Math.max(Math.max(e.scrollWidth,t.scrollWidth),Math.max(e.offsetWidth,t.offsetWidth),Math.max(e.clientWidth,t.clientWidth)),i=Math.max(Math.max(e.scrollHeight,t.scrollHeight),Math.max(e.offsetHeight,t.offsetHeight),Math.max(e.clientHeight,t.clientHeight));return new Sn(0,0,A,i)},tl=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},bt=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},ad="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",tE=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var ma=0;ma<ad.length;ma++)tE[ad.charCodeAt(ma)]=ma;var od="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ts=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Ba=0;Ba<od.length;Ba++)ts[od.charCodeAt(Ba)]=Ba;var AE=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=ts[n.charCodeAt(A)],s=ts[n.charCodeAt(A+1)],a=ts[n.charCodeAt(A+2)],o=ts[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},nE=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},iE=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},wi=5,vf=11,Jl=2,rE=vf-wi,Fg=65536>>wi,sE=1<<wi,Zl=sE-1,aE=1024>>wi,oE=Fg+aE,lE=oE,cE=32,uE=lE+cE,fE=65536>>vf,hE=1<<rE,dE=hE-1,ld=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},pE=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},gE=function(n,e){var t=AE(n),A=Array.isArray(t)?iE(t):new Uint32Array(t),i=Array.isArray(t)?nE(t):new Uint16Array(t),r=24,s=ld(i,r/2,A[4]/2),a=A[5]===2?ld(i,(r+A[4])/2):pE(A,Math.ceil((r+A[4])/4));return new mE(A[0],A[1],A[2],A[3],s,a)},mE=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>wi],t=(t<<Jl)+(e&Zl),this.data[t];if(e<=65535)return t=this.index[Fg+(e-55296>>wi)],t=(t<<Jl)+(e&Zl),this.data[t];if(e<this.highStart)return t=uE-fE+(e>>vf),t=this.index[t],t+=e>>wi&dE,t=this.index[t],t=(t<<Jl)+(e&Zl),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),cd="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",BE=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var va=0;va<cd.length;va++)BE[cd.charCodeAt(va)]=va;var vE="KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==",ud=50,wE=1,Tg=2,Ig=3,CE=4,xE=5,fd=7,Qg=8,hd=9,Vn=10,Cu=11,dd=12,xu=13,_E=14,As=15,_u=16,wa=17,Kr=18,EE=19,pd=20,Eu=21,Wr=22,ql=23,tr=24,_A=25,ns=26,is=27,Ar=28,yE=29,hi=30,SE=31,Ca=32,xa=33,yu=34,Su=35,Uu=36,Cs=37,Mu=38,no=39,io=40,jl=41,Lg=42,UE=43,ME=[9001,65288],Rg="!",je="×",_a="÷",bu=gE(vE),mn=[hi,Uu],Fu=[wE,Tg,Ig,xE],Dg=[Vn,Qg],gd=[is,ns],bE=Fu.concat(Dg),md=[Mu,no,io,yu,Su],FE=[As,xu],TE=function(n,e){e===void 0&&(e="strict");var t=[],A=[],i=[];return n.forEach(function(r,s){var a=bu.get(r);if(a>ud?(i.push(!0),a-=ud):i.push(!1),["normal","auto","loose"].indexOf(e)!==-1&&[8208,8211,12316,12448].indexOf(r)!==-1)return A.push(s),t.push(_u);if(a===CE||a===Cu){if(s===0)return A.push(s),t.push(hi);var o=t[s-1];return bE.indexOf(o)===-1?(A.push(A[s-1]),t.push(o)):(A.push(s),t.push(hi))}if(A.push(s),a===SE)return t.push(e==="strict"?Eu:Cs);if(a===Lg||a===yE)return t.push(hi);if(a===UE)return r>=131072&&r<=196605||r>=196608&&r<=262141?t.push(Cs):t.push(hi);t.push(a)}),[A,t,i]},$l=function(n,e,t,A){var i=A[t];if(Array.isArray(n)?n.indexOf(i)!==-1:n===i)for(var r=t;r<=A.length;){r++;var s=A[r];if(s===e)return!0;if(s!==Vn)break}if(i===Vn)for(var r=t;r>0;){r--;var a=A[r];if(Array.isArray(n)?n.indexOf(a)!==-1:n===a)for(var o=t;o<=A.length;){o++;var s=A[o];if(s===e)return!0;if(s!==Vn)break}if(a!==Vn)break}return!1},Bd=function(n,e){for(var t=n;t>=0;){var A=e[t];if(A===Vn)t--;else return A}return 0},IE=function(n,e,t,A,i){if(t[A]===0)return je;var r=A-1;if(Array.isArray(i)&&i[r]===!0)return je;var s=r-1,a=r+1,o=e[r],l=s>=0?e[s]:0,c=e[a];if(o===Tg&&c===Ig)return je;if(Fu.indexOf(o)!==-1)return Rg;if(Fu.indexOf(c)!==-1||Dg.indexOf(c)!==-1)return je;if(Bd(r,e)===Qg)return _a;if(bu.get(n[r])===Cu||(o===Ca||o===xa)&&bu.get(n[a])===Cu||o===fd||c===fd||o===hd||[Vn,xu,As].indexOf(o)===-1&&c===hd||[wa,Kr,EE,tr,Ar].indexOf(c)!==-1||Bd(r,e)===Wr||$l(ql,Wr,r,e)||$l([wa,Kr],Eu,r,e)||$l(dd,dd,r,e))return je;if(o===Vn)return _a;if(o===ql||c===ql)return je;if(c===_u||o===_u)return _a;if([xu,As,Eu].indexOf(c)!==-1||o===_E||l===Uu&&FE.indexOf(o)!==-1||o===Ar&&c===Uu||c===pd||mn.indexOf(c)!==-1&&o===_A||mn.indexOf(o)!==-1&&c===_A||o===is&&[Cs,Ca,xa].indexOf(c)!==-1||[Cs,Ca,xa].indexOf(o)!==-1&&c===ns||mn.indexOf(o)!==-1&&gd.indexOf(c)!==-1||gd.indexOf(o)!==-1&&mn.indexOf(c)!==-1||[is,ns].indexOf(o)!==-1&&(c===_A||[Wr,As].indexOf(c)!==-1&&e[a+1]===_A)||[Wr,As].indexOf(o)!==-1&&c===_A||o===_A&&[_A,Ar,tr].indexOf(c)!==-1)return je;if([_A,Ar,tr,wa,Kr].indexOf(c)!==-1)for(var u=r;u>=0;){var f=e[u];if(f===_A)return je;if([Ar,tr].indexOf(f)!==-1)u--;else break}if([is,ns].indexOf(c)!==-1)for(var u=[wa,Kr].indexOf(o)!==-1?s:r;u>=0;){var f=e[u];if(f===_A)return je;if([Ar,tr].indexOf(f)!==-1)u--;else break}if(Mu===o&&[Mu,no,yu,Su].indexOf(c)!==-1||[no,yu].indexOf(o)!==-1&&[no,io].indexOf(c)!==-1||[io,Su].indexOf(o)!==-1&&c===io||md.indexOf(o)!==-1&&[pd,ns].indexOf(c)!==-1||md.indexOf(c)!==-1&&o===is||mn.indexOf(o)!==-1&&mn.indexOf(c)!==-1||o===tr&&mn.indexOf(c)!==-1||mn.concat(_A).indexOf(o)!==-1&&c===Wr&&ME.indexOf(n[a])===-1||mn.concat(_A).indexOf(c)!==-1&&o===Kr)return je;if(o===jl&&c===jl){for(var p=t[r],g=1;p>0&&(p--,e[p]===jl);)g++;if(g%2!==0)return je}return o===Ca&&c===xa?je:_a},QE=function(n,e){e||(e={lineBreak:"normal",wordBreak:"normal"});var t=TE(n,e.lineBreak),A=t[0],i=t[1],r=t[2];(e.wordBreak==="break-all"||e.wordBreak==="break-word")&&(i=i.map(function(a){return[_A,hi,Lg].indexOf(a)!==-1?Cs:a}));var s=e.wordBreak==="keep-all"?r.map(function(a,o){return a&&n[o]>=19968&&n[o]<=40959}):void 0;return[A,i,s]},LE=(function(){function n(e,t,A,i){this.codePoints=e,this.required=t===Rg,this.start=A,this.end=i}return n.prototype.slice=function(){return bt.apply(void 0,this.codePoints.slice(this.start,this.end))},n})(),RE=function(n,e){var t=tl(n),A=QE(t,e),i=A[0],r=A[1],s=A[2],a=t.length,o=0,l=0;return{next:function(){if(l>=a)return{done:!0,value:null};for(var c=je;l<a&&(c=IE(t,r,i,++l,s))===je;);if(c!==je||l===a){var u=new LE(t,c,o,l);return o=l,{value:u,done:!1}}return{done:!0,value:null}}}},DE=1,PE=2,Ls=4,vd=8,Co=10,wd=47,fs=92,HE=9,NE=32,Ea=34,Xr=61,OE=35,GE=36,VE=37,ya=39,Sa=40,Yr=41,kE=95,gA=45,zE=33,KE=60,WE=62,XE=64,YE=91,JE=93,ZE=61,qE=123,Ua=63,jE=125,Cd=124,$E=126,ey=128,xd=65533,ec=42,pi=43,ty=44,Ay=58,ny=59,xs=46,iy=0,ry=8,sy=11,ay=14,oy=31,ly=127,en=-1,Pg=48,Hg=97,Ng=101,cy=102,uy=117,fy=122,Og=65,Gg=69,Vg=70,hy=85,dy=90,aA=function(n){return n>=Pg&&n<=57},py=function(n){return n>=55296&&n<=57343},nr=function(n){return aA(n)||n>=Og&&n<=Vg||n>=Hg&&n<=cy},gy=function(n){return n>=Hg&&n<=fy},my=function(n){return n>=Og&&n<=dy},By=function(n){return gy(n)||my(n)},vy=function(n){return n>=ey},Ma=function(n){return n===Co||n===HE||n===NE},xo=function(n){return By(n)||vy(n)||n===kE},_d=function(n){return xo(n)||aA(n)||n===gA},wy=function(n){return n>=iy&&n<=ry||n===sy||n>=ay&&n<=oy||n===ly},Nn=function(n,e){return n!==fs?!1:e!==Co},ba=function(n,e,t){return n===gA?xo(e)||Nn(e,t):xo(n)?!0:!!(n===fs&&Nn(n,e))},tc=function(n,e,t){return n===pi||n===gA?aA(e)?!0:e===xs&&aA(t):aA(n===xs?e:n)},Cy=function(n){var e=0,t=1;(n[e]===pi||n[e]===gA)&&(n[e]===gA&&(t=-1),e++);for(var A=[];aA(n[e]);)A.push(n[e++]);var i=A.length?parseInt(bt.apply(void 0,A),10):0;n[e]===xs&&e++;for(var r=[];aA(n[e]);)r.push(n[e++]);var s=r.length,a=s?parseInt(bt.apply(void 0,r),10):0;(n[e]===Gg||n[e]===Ng)&&e++;var o=1;(n[e]===pi||n[e]===gA)&&(n[e]===gA&&(o=-1),e++);for(var l=[];aA(n[e]);)l.push(n[e++]);var c=l.length?parseInt(bt.apply(void 0,l),10):0;return t*(i+a*Math.pow(10,-s))*Math.pow(10,o*c)},xy={type:2},_y={type:3},Ey={type:4},yy={type:13},Sy={type:8},Uy={type:21},My={type:9},by={type:10},Fy={type:11},Ty={type:12},Iy={type:14},Fa={type:23},Qy={type:1},Ly={type:25},Ry={type:24},Dy={type:26},Py={type:27},Hy={type:28},Ny={type:29},Oy={type:31},Tu={type:32},kg=(function(){function n(){this._value=[]}return n.prototype.write=function(e){this._value=this._value.concat(tl(e))},n.prototype.read=function(){for(var e=[],t=this.consumeToken();t!==Tu;)e.push(t),t=this.consumeToken();return e},n.prototype.consumeToken=function(){var e=this.consumeCodePoint();switch(e){case Ea:return this.consumeStringToken(Ea);case OE:var t=this.peekCodePoint(0),A=this.peekCodePoint(1),i=this.peekCodePoint(2);if(_d(t)||Nn(A,i)){var r=ba(t,A,i)?PE:DE,s=this.consumeName();return{type:5,value:s,flags:r}}break;case GE:if(this.peekCodePoint(0)===Xr)return this.consumeCodePoint(),yy;break;case ya:return this.consumeStringToken(ya);case Sa:return xy;case Yr:return _y;case ec:if(this.peekCodePoint(0)===Xr)return this.consumeCodePoint(),Iy;break;case pi:if(tc(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case ty:return Ey;case gA:var a=e,o=this.peekCodePoint(0),l=this.peekCodePoint(1);if(tc(a,o,l))return this.reconsumeCodePoint(e),this.consumeNumericToken();if(ba(a,o,l))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();if(o===gA&&l===WE)return this.consumeCodePoint(),this.consumeCodePoint(),Ry;break;case xs:if(tc(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case wd:if(this.peekCodePoint(0)===ec)for(this.consumeCodePoint();;){var c=this.consumeCodePoint();if(c===ec&&(c=this.consumeCodePoint(),c===wd))return this.consumeToken();if(c===en)return this.consumeToken()}break;case Ay:return Dy;case ny:return Py;case KE:if(this.peekCodePoint(0)===zE&&this.peekCodePoint(1)===gA&&this.peekCodePoint(2)===gA)return this.consumeCodePoint(),this.consumeCodePoint(),Ly;break;case XE:var u=this.peekCodePoint(0),f=this.peekCodePoint(1),p=this.peekCodePoint(2);if(ba(u,f,p)){var s=this.consumeName();return{type:7,value:s}}break;case YE:return Hy;case fs:if(Nn(e,this.peekCodePoint(0)))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();break;case JE:return Ny;case ZE:if(this.peekCodePoint(0)===Xr)return this.consumeCodePoint(),Sy;break;case qE:return Fy;case jE:return Ty;case uy:case hy:var g=this.peekCodePoint(0),m=this.peekCodePoint(1);return g===pi&&(nr(m)||m===Ua)&&(this.consumeCodePoint(),this.consumeUnicodeRangeToken()),this.reconsumeCodePoint(e),this.consumeIdentLikeToken();case Cd:if(this.peekCodePoint(0)===Xr)return this.consumeCodePoint(),My;if(this.peekCodePoint(0)===Cd)return this.consumeCodePoint(),Uy;break;case $E:if(this.peekCodePoint(0)===Xr)return this.consumeCodePoint(),by;break;case en:return Tu}return Ma(e)?(this.consumeWhiteSpace(),Oy):aA(e)?(this.reconsumeCodePoint(e),this.consumeNumericToken()):xo(e)?(this.reconsumeCodePoint(e),this.consumeIdentLikeToken()):{type:6,value:bt(e)}},n.prototype.consumeCodePoint=function(){var e=this._value.shift();return typeof e>"u"?-1:e},n.prototype.reconsumeCodePoint=function(e){this._value.unshift(e)},n.prototype.peekCodePoint=function(e){return e>=this._value.length?-1:this._value[e]},n.prototype.consumeUnicodeRangeToken=function(){for(var e=[],t=this.consumeCodePoint();nr(t)&&e.length<6;)e.push(t),t=this.consumeCodePoint();for(var A=!1;t===Ua&&e.length<6;)e.push(t),t=this.consumeCodePoint(),A=!0;if(A){var i=parseInt(bt.apply(void 0,e.map(function(o){return o===Ua?Pg:o})),16),r=parseInt(bt.apply(void 0,e.map(function(o){return o===Ua?Vg:o})),16);return{type:30,start:i,end:r}}var s=parseInt(bt.apply(void 0,e),16);if(this.peekCodePoint(0)===gA&&nr(this.peekCodePoint(1))){this.consumeCodePoint(),t=this.consumeCodePoint();for(var a=[];nr(t)&&a.length<6;)a.push(t),t=this.consumeCodePoint();var r=parseInt(bt.apply(void 0,a),16);return{type:30,start:s,end:r}}else return{type:30,start:s,end:s}},n.prototype.consumeIdentLikeToken=function(){var e=this.consumeName();return e.toLowerCase()==="url"&&this.peekCodePoint(0)===Sa?(this.consumeCodePoint(),this.consumeUrlToken()):this.peekCodePoint(0)===Sa?(this.consumeCodePoint(),{type:19,value:e}):{type:20,value:e}},n.prototype.consumeUrlToken=function(){var e=[];if(this.consumeWhiteSpace(),this.peekCodePoint(0)===en)return{type:22,value:""};var t=this.peekCodePoint(0);if(t===ya||t===Ea){var A=this.consumeStringToken(this.consumeCodePoint());return A.type===0&&(this.consumeWhiteSpace(),this.peekCodePoint(0)===en||this.peekCodePoint(0)===Yr)?(this.consumeCodePoint(),{type:22,value:A.value}):(this.consumeBadUrlRemnants(),Fa)}for(;;){var i=this.consumeCodePoint();if(i===en||i===Yr)return{type:22,value:bt.apply(void 0,e)};if(Ma(i))return this.consumeWhiteSpace(),this.peekCodePoint(0)===en||this.peekCodePoint(0)===Yr?(this.consumeCodePoint(),{type:22,value:bt.apply(void 0,e)}):(this.consumeBadUrlRemnants(),Fa);if(i===Ea||i===ya||i===Sa||wy(i))return this.consumeBadUrlRemnants(),Fa;if(i===fs)if(Nn(i,this.peekCodePoint(0)))e.push(this.consumeEscapedCodePoint());else return this.consumeBadUrlRemnants(),Fa;else e.push(i)}},n.prototype.consumeWhiteSpace=function(){for(;Ma(this.peekCodePoint(0));)this.consumeCodePoint()},n.prototype.consumeBadUrlRemnants=function(){for(;;){var e=this.consumeCodePoint();if(e===Yr||e===en)return;Nn(e,this.peekCodePoint(0))&&this.consumeEscapedCodePoint()}},n.prototype.consumeStringSlice=function(e){for(var t=5e4,A="";e>0;){var i=Math.min(t,e);A+=bt.apply(void 0,this._value.splice(0,i)),e-=i}return this._value.shift(),A},n.prototype.consumeStringToken=function(e){var t="",A=0;do{var i=this._value[A];if(i===en||i===void 0||i===e)return t+=this.consumeStringSlice(A),{type:0,value:t};if(i===Co)return this._value.splice(0,A),Qy;if(i===fs){var r=this._value[A+1];r!==en&&r!==void 0&&(r===Co?(t+=this.consumeStringSlice(A),A=-1,this._value.shift()):Nn(i,r)&&(t+=this.consumeStringSlice(A),t+=bt(this.consumeEscapedCodePoint()),A=-1))}A++}while(!0)},n.prototype.consumeNumber=function(){var e=[],t=Ls,A=this.peekCodePoint(0);for((A===pi||A===gA)&&e.push(this.consumeCodePoint());aA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0);var i=this.peekCodePoint(1);if(A===xs&&aA(i))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=vd;aA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0),i=this.peekCodePoint(1);var r=this.peekCodePoint(2);if((A===Gg||A===Ng)&&((i===pi||i===gA)&&aA(r)||aA(i)))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=vd;aA(this.peekCodePoint(0));)e.push(this.consumeCodePoint());return[Cy(e),t]},n.prototype.consumeNumericToken=function(){var e=this.consumeNumber(),t=e[0],A=e[1],i=this.peekCodePoint(0),r=this.peekCodePoint(1),s=this.peekCodePoint(2);if(ba(i,r,s)){var a=this.consumeName();return{type:15,number:t,flags:A,unit:a}}return i===VE?(this.consumeCodePoint(),{type:16,number:t,flags:A}):{type:17,number:t,flags:A}},n.prototype.consumeEscapedCodePoint=function(){var e=this.consumeCodePoint();if(nr(e)){for(var t=bt(e);nr(this.peekCodePoint(0))&&t.length<6;)t+=bt(this.consumeCodePoint());Ma(this.peekCodePoint(0))&&this.consumeCodePoint();var A=parseInt(t,16);return A===0||py(A)||A>1114111?xd:A}return e===en?xd:e},n.prototype.consumeName=function(){for(var e="";;){var t=this.consumeCodePoint();if(_d(t))e+=bt(t);else if(Nn(t,this.peekCodePoint(0)))e+=bt(this.consumeEscapedCodePoint());else return this.reconsumeCodePoint(t),e}},n})(),zg=(function(){function n(e){this._tokens=e}return n.create=function(e){var t=new kg;return t.write(e),new n(t.read())},n.parseValue=function(e){return n.create(e).parseComponentValue()},n.parseValues=function(e){return n.create(e).parseComponentValues()},n.prototype.parseComponentValue=function(){for(var e=this.consumeToken();e.type===31;)e=this.consumeToken();if(e.type===32)throw new SyntaxError("Error parsing CSS component value, unexpected EOF");this.reconsumeToken(e);var t=this.consumeComponentValue();do e=this.consumeToken();while(e.type===31);if(e.type===32)return t;throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")},n.prototype.parseComponentValues=function(){for(var e=[];;){var t=this.consumeComponentValue();if(t.type===32)return e;e.push(t),e.push()}},n.prototype.consumeComponentValue=function(){var e=this.consumeToken();switch(e.type){case 11:case 28:case 2:return this.consumeSimpleBlock(e.type);case 19:return this.consumeFunction(e)}return e},n.prototype.consumeSimpleBlock=function(e){for(var t={type:e,values:[]},A=this.consumeToken();;){if(A.type===32||Vy(A,e))return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue()),A=this.consumeToken()}},n.prototype.consumeFunction=function(e){for(var t={name:e.value,values:[],type:18};;){var A=this.consumeToken();if(A.type===32||A.type===3)return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue())}},n.prototype.consumeToken=function(){var e=this._tokens.shift();return typeof e>"u"?Tu:e},n.prototype.reconsumeToken=function(e){this._tokens.unshift(e)},n})(),Rs=function(n){return n.type===15},Rr=function(n){return n.type===17},ft=function(n){return n.type===20},Gy=function(n){return n.type===0},Iu=function(n,e){return ft(n)&&n.value===e},Kg=function(n){return n.type!==31},br=function(n){return n.type!==31&&n.type!==4},ln=function(n){var e=[],t=[];return n.forEach(function(A){if(A.type===4){if(t.length===0)throw new Error("Error parsing function args, zero tokens for arg");e.push(t),t=[];return}A.type!==31&&t.push(A)}),t.length&&e.push(t),e},Vy=function(n,e){return e===11&&n.type===12||e===28&&n.type===29?!0:e===2&&n.type===3},ei=function(n){return n.type===17||n.type===15},Qt=function(n){return n.type===16||ei(n)},Wg=function(n){return n.length>1?[n[0],n[1]]:[n[0]]},eA={type:17,number:0,flags:Ls},wf={type:16,number:50,flags:Ls},kn={type:16,number:100,flags:Ls},rs=function(n,e,t){var A=n[0],i=n[1];return[pt(A,e),pt(typeof i<"u"?i:A,t)]},pt=function(n,e){if(n.type===16)return n.number/100*e;if(Rs(n))switch(n.unit){case"rem":case"em":return 16*n.number;case"px":default:return n.number}return n.number},Xg="deg",Yg="grad",Jg="rad",Zg="turn",Al={name:"angle",parse:function(n,e){if(e.type===15)switch(e.unit){case Xg:return Math.PI*e.number/180;case Yg:return Math.PI/200*e.number;case Jg:return e.number;case Zg:return Math.PI*2*e.number}throw new Error("Unsupported angle type")}},qg=function(n){return n.type===15&&(n.unit===Xg||n.unit===Yg||n.unit===Jg||n.unit===Zg)},jg=function(n){var e=n.filter(ft).map(function(t){return t.value}).join(" ");switch(e){case"to bottom right":case"to right bottom":case"left top":case"top left":return[eA,eA];case"to top":case"bottom":return NA(0);case"to bottom left":case"to left bottom":case"right top":case"top right":return[eA,kn];case"to right":case"left":return NA(90);case"to top left":case"to left top":case"right bottom":case"bottom right":return[kn,kn];case"to bottom":case"top":return NA(180);case"to top right":case"to right top":case"left bottom":case"bottom left":return[kn,eA];case"to left":case"right":return NA(270)}return 0},NA=function(n){return Math.PI*n/180},Yn={name:"color",parse:function(n,e){if(e.type===18){var t=ky[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported color function "'+e.name+'"');return t(n,e.values)}if(e.type===5){if(e.value.length===3){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3);return zn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),1)}if(e.value.length===4){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3),s=e.value.substring(3,4);return zn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),parseInt(s+s,16)/255)}if(e.value.length===6){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6);return zn(parseInt(A,16),parseInt(i,16),parseInt(r,16),1)}if(e.value.length===8){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6),s=e.value.substring(6,8);return zn(parseInt(A,16),parseInt(i,16),parseInt(r,16),parseInt(s,16)/255)}}if(e.type===20){var a=yn[e.value.toUpperCase()];if(typeof a<"u")return a}return yn.TRANSPARENT}},Jn=function(n){return(255&n)===0},kt=function(n){var e=255&n,t=255&n>>8,A=255&n>>16,i=255&n>>24;return e<255?"rgba("+i+","+A+","+t+","+e/255+")":"rgb("+i+","+A+","+t+")"},zn=function(n,e,t,A){return(n<<24|e<<16|t<<8|Math.round(A*255)<<0)>>>0},Ed=function(n,e){if(n.type===17)return n.number;if(n.type===16){var t=e===3?1:255;return e===3?n.number/100*t:Math.round(n.number/100*t)}return 0},yd=function(n,e){var t=e.filter(br);if(t.length===3){var A=t.map(Ed),i=A[0],r=A[1],s=A[2];return zn(i,r,s,1)}if(t.length===4){var a=t.map(Ed),i=a[0],r=a[1],s=a[2],o=a[3];return zn(i,r,s,o)}return 0};function Ac(n,e,t){return t<0&&(t+=1),t>=1&&(t-=1),t<1/6?(e-n)*t*6+n:t<1/2?e:t<2/3?(e-n)*6*(2/3-t)+n:n}var Sd=function(n,e){var t=e.filter(br),A=t[0],i=t[1],r=t[2],s=t[3],a=(A.type===17?NA(A.number):Al.parse(n,A))/(Math.PI*2),o=Qt(i)?i.number/100:0,l=Qt(r)?r.number/100:0,c=typeof s<"u"&&Qt(s)?pt(s,1):1;if(o===0)return zn(l*255,l*255,l*255,1);var u=l<=.5?l*(o+1):l+o-l*o,f=l*2-u,p=Ac(f,u,a+1/3),g=Ac(f,u,a),m=Ac(f,u,a-1/3);return zn(p*255,g*255,m*255,c)},ky={hsl:Sd,hsla:Sd,rgb:yd,rgba:yd},hs=function(n,e){return Yn.parse(n,zg.create(e).parseComponentValue())},yn={ALICEBLUE:4042850303,ANTIQUEWHITE:4209760255,AQUA:16777215,AQUAMARINE:2147472639,AZURE:4043309055,BEIGE:4126530815,BISQUE:4293182719,BLACK:255,BLANCHEDALMOND:4293643775,BLUE:65535,BLUEVIOLET:2318131967,BROWN:2771004159,BURLYWOOD:3736635391,CADETBLUE:1604231423,CHARTREUSE:2147418367,CHOCOLATE:3530104575,CORAL:4286533887,CORNFLOWERBLUE:1687547391,CORNSILK:4294499583,CRIMSON:3692313855,CYAN:16777215,DARKBLUE:35839,DARKCYAN:9145343,DARKGOLDENROD:3095837695,DARKGRAY:2846468607,DARKGREEN:6553855,DARKGREY:2846468607,DARKKHAKI:3182914559,DARKMAGENTA:2332068863,DARKOLIVEGREEN:1433087999,DARKORANGE:4287365375,DARKORCHID:2570243327,DARKRED:2332033279,DARKSALMON:3918953215,DARKSEAGREEN:2411499519,DARKSLATEBLUE:1211993087,DARKSLATEGRAY:793726975,DARKSLATEGREY:793726975,DARKTURQUOISE:13554175,DARKVIOLET:2483082239,DEEPPINK:4279538687,DEEPSKYBLUE:12582911,DIMGRAY:1768516095,DIMGREY:1768516095,DODGERBLUE:512819199,FIREBRICK:2988581631,FLORALWHITE:4294635775,FORESTGREEN:579543807,FUCHSIA:4278255615,GAINSBORO:3705462015,GHOSTWHITE:4177068031,GOLD:4292280575,GOLDENROD:3668254975,GRAY:2155905279,GREEN:8388863,GREENYELLOW:2919182335,GREY:2155905279,HONEYDEW:4043305215,HOTPINK:4285117695,INDIANRED:3445382399,INDIGO:1258324735,IVORY:4294963455,KHAKI:4041641215,LAVENDER:3873897215,LAVENDERBLUSH:4293981695,LAWNGREEN:2096890111,LEMONCHIFFON:4294626815,LIGHTBLUE:2916673279,LIGHTCORAL:4034953471,LIGHTCYAN:3774873599,LIGHTGOLDENRODYELLOW:4210742015,LIGHTGRAY:3553874943,LIGHTGREEN:2431553791,LIGHTGREY:3553874943,LIGHTPINK:4290167295,LIGHTSALMON:4288707327,LIGHTSEAGREEN:548580095,LIGHTSKYBLUE:2278488831,LIGHTSLATEGRAY:2005441023,LIGHTSLATEGREY:2005441023,LIGHTSTEELBLUE:2965692159,LIGHTYELLOW:4294959359,LIME:16711935,LIMEGREEN:852308735,LINEN:4210091775,MAGENTA:4278255615,MAROON:2147483903,MEDIUMAQUAMARINE:1724754687,MEDIUMBLUE:52735,MEDIUMORCHID:3126187007,MEDIUMPURPLE:2473647103,MEDIUMSEAGREEN:1018393087,MEDIUMSLATEBLUE:2070474495,MEDIUMSPRINGGREEN:16423679,MEDIUMTURQUOISE:1221709055,MEDIUMVIOLETRED:3340076543,MIDNIGHTBLUE:421097727,MINTCREAM:4127193855,MISTYROSE:4293190143,MOCCASIN:4293178879,NAVAJOWHITE:4292783615,NAVY:33023,OLDLACE:4260751103,OLIVE:2155872511,OLIVEDRAB:1804477439,ORANGE:4289003775,ORANGERED:4282712319,ORCHID:3664828159,PALEGOLDENROD:4008225535,PALEGREEN:2566625535,PALETURQUOISE:2951671551,PALEVIOLETRED:3681588223,PAPAYAWHIP:4293907967,PEACHPUFF:4292524543,PERU:3448061951,PINK:4290825215,PLUM:3718307327,POWDERBLUE:2967529215,PURPLE:2147516671,REBECCAPURPLE:1714657791,RED:4278190335,ROSYBROWN:3163525119,ROYALBLUE:1097458175,SADDLEBROWN:2336560127,SALMON:4202722047,SANDYBROWN:4104413439,SEAGREEN:780883967,SEASHELL:4294307583,SIENNA:2689740287,SILVER:3233857791,SKYBLUE:2278484991,SLATEBLUE:1784335871,SLATEGRAY:1887473919,SLATEGREY:1887473919,SNOW:4294638335,SPRINGGREEN:16744447,STEELBLUE:1182971135,TAN:3535047935,TEAL:8421631,THISTLE:3636451583,TOMATO:4284696575,TRANSPARENT:0,TURQUOISE:1088475391,VIOLET:4001558271,WHEAT:4125012991,WHITE:4294967295,WHITESMOKE:4126537215,YELLOW:4294902015,YELLOWGREEN:2597139199},zy={name:"background-clip",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(ft(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},Ky={name:"background-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},nl=function(n,e){var t=Yn.parse(n,e[0]),A=e[1];return A&&Qt(A)?{color:t,stop:A}:{color:t,stop:null}},Ud=function(n,e){var t=n[0],A=n[n.length-1];t.stop===null&&(t.stop=eA),A.stop===null&&(A.stop=kn);for(var i=[],r=0,s=0;s<n.length;s++){var a=n[s].stop;if(a!==null){var o=pt(a,e);o>r?i.push(o):i.push(r),r=o}else i.push(null)}for(var l=null,s=0;s<i.length;s++){var c=i[s];if(c===null)l===null&&(l=s);else if(l!==null){for(var u=s-l,f=i[l-1],p=(c-f)/(u+1),g=1;g<=u;g++)i[l+g-1]=p*g;l=null}}return n.map(function(m,d){var h=m.color;return{color:h,stop:Math.max(Math.min(1,i[d]/e),0)}})},Wy=function(n,e,t){var A=e/2,i=t/2,r=pt(n[0],e)-A,s=i-pt(n[1],t);return(Math.atan2(s,r)+Math.PI*2)%(Math.PI*2)},Xy=function(n,e,t){var A=typeof n=="number"?n:Wy(n,e,t),i=Math.abs(e*Math.sin(A))+Math.abs(t*Math.cos(A)),r=e/2,s=t/2,a=i/2,o=Math.sin(A-Math.PI/2)*a,l=Math.cos(A-Math.PI/2)*a;return[i,r-l,r+l,s-o,s+o]},XA=function(n,e){return Math.sqrt(n*n+e*e)},Md=function(n,e,t,A,i){var r=[[0,0],[0,e],[n,0],[n,e]];return r.reduce(function(s,a){var o=a[0],l=a[1],c=XA(t-o,A-l);return(i?c<s.optimumDistance:c>s.optimumDistance)?{optimumCorner:a,optimumDistance:c}:s},{optimumDistance:i?1/0:-1/0,optimumCorner:null}).optimumCorner},Yy=function(n,e,t,A,i){var r=0,s=0;switch(n.size){case 0:n.shape===0?r=s=Math.min(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.min(Math.abs(e),Math.abs(e-A)),s=Math.min(Math.abs(t),Math.abs(t-i)));break;case 2:if(n.shape===0)r=s=Math.min(XA(e,t),XA(e,t-i),XA(e-A,t),XA(e-A,t-i));else if(n.shape===1){var a=Math.min(Math.abs(t),Math.abs(t-i))/Math.min(Math.abs(e),Math.abs(e-A)),o=Md(A,i,e,t,!0),l=o[0],c=o[1];r=XA(l-e,(c-t)/a),s=a*r}break;case 1:n.shape===0?r=s=Math.max(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.max(Math.abs(e),Math.abs(e-A)),s=Math.max(Math.abs(t),Math.abs(t-i)));break;case 3:if(n.shape===0)r=s=Math.max(XA(e,t),XA(e,t-i),XA(e-A,t),XA(e-A,t-i));else if(n.shape===1){var a=Math.max(Math.abs(t),Math.abs(t-i))/Math.max(Math.abs(e),Math.abs(e-A)),u=Md(A,i,e,t,!1),l=u[0],c=u[1];r=XA(l-e,(c-t)/a),s=a*r}break}return Array.isArray(n.size)&&(r=pt(n.size[0],A),s=n.size.length===2?pt(n.size[1],i):r),[r,s]},Jy=function(n,e){var t=NA(180),A=[];return ln(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&s.value==="to"){t=jg(i);return}else if(qg(s)){t=Al.parse(n,s);return}}var a=nl(n,i);A.push(a)}),{angle:t,stops:A,type:1}},Ta=function(n,e){var t=NA(180),A=[];return ln(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&["top","left","right","bottom"].indexOf(s.value)!==-1){t=jg(i);return}else if(qg(s)){t=(Al.parse(n,s)+NA(270))%NA(360);return}}var a=nl(n,i);A.push(a)}),{angle:t,stops:A,type:1}},Zy=function(n,e){var t=NA(180),A=[],i=1,r=0,s=3,a=[];return ln(e).forEach(function(o,l){var c=o[0];if(l===0){if(ft(c)&&c.value==="linear"){i=1;return}else if(ft(c)&&c.value==="radial"){i=2;return}}if(c.type===18){if(c.name==="from"){var u=Yn.parse(n,c.values[0]);A.push({stop:eA,color:u})}else if(c.name==="to"){var u=Yn.parse(n,c.values[0]);A.push({stop:kn,color:u})}else if(c.name==="color-stop"){var f=c.values.filter(br);if(f.length===2){var u=Yn.parse(n,f[1]),p=f[0];Rr(p)&&A.push({stop:{type:16,number:p.number*100,flags:p.flags},color:u})}}}}),i===1?{angle:(t+NA(180))%NA(360),stops:A,type:i}:{size:s,shape:r,stops:A,position:a,type:i}},$g="closest-side",em="farthest-side",tm="closest-corner",Am="farthest-corner",nm="circle",im="ellipse",rm="cover",sm="contain",qy=function(n,e){var t=0,A=3,i=[],r=[];return ln(e).forEach(function(s,a){var o=!0;if(a===0){var l=!1;o=s.reduce(function(u,f){if(l)if(ft(f))switch(f.value){case"center":return r.push(wf),u;case"top":case"left":return r.push(eA),u;case"right":case"bottom":return r.push(kn),u}else(Qt(f)||ei(f))&&r.push(f);else if(ft(f))switch(f.value){case nm:return t=0,!1;case im:return t=1,!1;case"at":return l=!0,!1;case $g:return A=0,!1;case rm:case em:return A=1,!1;case sm:case tm:return A=2,!1;case Am:return A=3,!1}else if(ei(f)||Qt(f))return Array.isArray(A)||(A=[]),A.push(f),!1;return u},o)}if(o){var c=nl(n,s);i.push(c)}}),{size:A,shape:t,stops:i,position:r,type:2}},Ia=function(n,e){var t=0,A=3,i=[],r=[];return ln(e).forEach(function(s,a){var o=!0;if(a===0?o=s.reduce(function(c,u){if(ft(u))switch(u.value){case"center":return r.push(wf),!1;case"top":case"left":return r.push(eA),!1;case"right":case"bottom":return r.push(kn),!1}else if(Qt(u)||ei(u))return r.push(u),!1;return c},o):a===1&&(o=s.reduce(function(c,u){if(ft(u))switch(u.value){case nm:return t=0,!1;case im:return t=1,!1;case sm:case $g:return A=0,!1;case em:return A=1,!1;case tm:return A=2,!1;case rm:case Am:return A=3,!1}else if(ei(u)||Qt(u))return Array.isArray(A)||(A=[]),A.push(u),!1;return c},o)),o){var l=nl(n,s);i.push(l)}}),{size:A,shape:t,stops:i,position:r,type:2}},jy=function(n){return n.type===1},$y=function(n){return n.type===2},Cf={name:"image",parse:function(n,e){if(e.type===22){var t={url:e.value,type:0};return n.cache.addImage(e.value),t}if(e.type===18){var A=am[e.name];if(typeof A>"u")throw new Error('Attempting to parse an unsupported image function "'+e.name+'"');return A(n,e.values)}throw new Error("Unsupported image type "+e.type)}};function eS(n){return!(n.type===20&&n.value==="none")&&(n.type!==18||!!am[n.name])}var am={"linear-gradient":Jy,"-moz-linear-gradient":Ta,"-ms-linear-gradient":Ta,"-o-linear-gradient":Ta,"-webkit-linear-gradient":Ta,"radial-gradient":qy,"-moz-radial-gradient":Ia,"-ms-radial-gradient":Ia,"-o-radial-gradient":Ia,"-webkit-radial-gradient":Ia,"-webkit-gradient":Zy},tS={name:"background-image",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e.filter(function(A){return br(A)&&eS(A)}).map(function(A){return Cf.parse(n,A)})}},AS={name:"background-origin",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(ft(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},nS={name:"background-position",initialValue:"0% 0%",type:1,prefix:!1,parse:function(n,e){return ln(e).map(function(t){return t.filter(Qt)}).map(Wg)}},iS={name:"background-repeat",initialValue:"repeat",prefix:!1,type:1,parse:function(n,e){return ln(e).map(function(t){return t.filter(ft).map(function(A){return A.value}).join(" ")}).map(rS)}},rS=function(n){switch(n){case"no-repeat":return 1;case"repeat-x":case"repeat no-repeat":return 2;case"repeat-y":case"no-repeat repeat":return 3;case"repeat":default:return 0}},vr;(function(n){n.AUTO="auto",n.CONTAIN="contain",n.COVER="cover"})(vr||(vr={}));var sS={name:"background-size",initialValue:"0",prefix:!1,type:1,parse:function(n,e){return ln(e).map(function(t){return t.filter(aS)})}},aS=function(n){return ft(n)||Qt(n)},il=function(n){return{name:"border-"+n+"-color",initialValue:"transparent",prefix:!1,type:3,format:"color"}},oS=il("top"),lS=il("right"),cS=il("bottom"),uS=il("left"),rl=function(n){return{name:"border-radius-"+n,initialValue:"0 0",prefix:!1,type:1,parse:function(e,t){return Wg(t.filter(Qt))}}},fS=rl("top-left"),hS=rl("top-right"),dS=rl("bottom-right"),pS=rl("bottom-left"),sl=function(n){return{name:"border-"+n+"-style",initialValue:"solid",prefix:!1,type:2,parse:function(e,t){switch(t){case"none":return 0;case"dashed":return 2;case"dotted":return 3;case"double":return 4}return 1}}},gS=sl("top"),mS=sl("right"),BS=sl("bottom"),vS=sl("left"),al=function(n){return{name:"border-"+n+"-width",initialValue:"0",type:0,prefix:!1,parse:function(e,t){return Rs(t)?t.number:0}}},wS=al("top"),CS=al("right"),xS=al("bottom"),_S=al("left"),ES={name:"color",initialValue:"transparent",prefix:!1,type:3,format:"color"},yS={name:"direction",initialValue:"ltr",prefix:!1,type:2,parse:function(n,e){switch(e){case"rtl":return 1;case"ltr":default:return 0}}},SS={name:"display",initialValue:"inline-block",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).reduce(function(t,A){return t|US(A.value)},0)}},US=function(n){switch(n){case"block":case"-webkit-box":return 2;case"inline":return 4;case"run-in":return 8;case"flow":return 16;case"flow-root":return 32;case"table":return 64;case"flex":case"-webkit-flex":return 128;case"grid":case"-ms-grid":return 256;case"ruby":return 512;case"subgrid":return 1024;case"list-item":return 2048;case"table-row-group":return 4096;case"table-header-group":return 8192;case"table-footer-group":return 16384;case"table-row":return 32768;case"table-cell":return 65536;case"table-column-group":return 131072;case"table-column":return 262144;case"table-caption":return 524288;case"ruby-base":return 1048576;case"ruby-text":return 2097152;case"ruby-base-container":return 4194304;case"ruby-text-container":return 8388608;case"contents":return 16777216;case"inline-block":return 33554432;case"inline-list-item":return 67108864;case"inline-table":return 134217728;case"inline-flex":return 268435456;case"inline-grid":return 536870912}return 0},MS={name:"float",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"left":return 1;case"right":return 2;case"inline-start":return 3;case"inline-end":return 4}return 0}},bS={name:"letter-spacing",initialValue:"0",prefix:!1,type:0,parse:function(n,e){return e.type===20&&e.value==="normal"?0:e.type===17||e.type===15?e.number:0}},_o;(function(n){n.NORMAL="normal",n.STRICT="strict"})(_o||(_o={}));var FS={name:"line-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"strict":return _o.STRICT;case"normal":default:return _o.NORMAL}}},TS={name:"line-height",initialValue:"normal",prefix:!1,type:4},bd=function(n,e){return ft(n)&&n.value==="normal"?1.2*e:n.type===17?e*n.number:Qt(n)?pt(n,e):e},IS={name:"list-style-image",initialValue:"none",type:0,prefix:!1,parse:function(n,e){return e.type===20&&e.value==="none"?null:Cf.parse(n,e)}},QS={name:"list-style-position",initialValue:"outside",prefix:!1,type:2,parse:function(n,e){switch(e){case"inside":return 0;case"outside":default:return 1}}},Qu={name:"list-style-type",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"disc":return 0;case"circle":return 1;case"square":return 2;case"decimal":return 3;case"cjk-decimal":return 4;case"decimal-leading-zero":return 5;case"lower-roman":return 6;case"upper-roman":return 7;case"lower-greek":return 8;case"lower-alpha":return 9;case"upper-alpha":return 10;case"arabic-indic":return 11;case"armenian":return 12;case"bengali":return 13;case"cambodian":return 14;case"cjk-earthly-branch":return 15;case"cjk-heavenly-stem":return 16;case"cjk-ideographic":return 17;case"devanagari":return 18;case"ethiopic-numeric":return 19;case"georgian":return 20;case"gujarati":return 21;case"gurmukhi":return 22;case"hebrew":return 22;case"hiragana":return 23;case"hiragana-iroha":return 24;case"japanese-formal":return 25;case"japanese-informal":return 26;case"kannada":return 27;case"katakana":return 28;case"katakana-iroha":return 29;case"khmer":return 30;case"korean-hangul-formal":return 31;case"korean-hanja-formal":return 32;case"korean-hanja-informal":return 33;case"lao":return 34;case"lower-armenian":return 35;case"malayalam":return 36;case"mongolian":return 37;case"myanmar":return 38;case"oriya":return 39;case"persian":return 40;case"simp-chinese-formal":return 41;case"simp-chinese-informal":return 42;case"tamil":return 43;case"telugu":return 44;case"thai":return 45;case"tibetan":return 46;case"trad-chinese-formal":return 47;case"trad-chinese-informal":return 48;case"upper-armenian":return 49;case"disclosure-open":return 50;case"disclosure-closed":return 51;case"none":default:return-1}}},ol=function(n){return{name:"margin-"+n,initialValue:"0",prefix:!1,type:4}},LS=ol("top"),RS=ol("right"),DS=ol("bottom"),PS=ol("left"),HS={name:"overflow",initialValue:"visible",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).map(function(t){switch(t.value){case"hidden":return 1;case"scroll":return 2;case"clip":return 3;case"auto":return 4;case"visible":default:return 0}})}},NS={name:"overflow-wrap",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-word":return"break-word";case"normal":default:return"normal"}}},ll=function(n){return{name:"padding-"+n,initialValue:"0",prefix:!1,type:3,format:"length-percentage"}},OS=ll("top"),GS=ll("right"),VS=ll("bottom"),kS=ll("left"),zS={name:"text-align",initialValue:"left",prefix:!1,type:2,parse:function(n,e){switch(e){case"right":return 2;case"center":case"justify":return 1;case"left":default:return 0}}},KS={name:"position",initialValue:"static",prefix:!1,type:2,parse:function(n,e){switch(e){case"relative":return 1;case"absolute":return 2;case"fixed":return 3;case"sticky":return 4}return 0}},WS={name:"text-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&Iu(e[0],"none")?[]:ln(e).map(function(t){for(var A={color:yn.TRANSPARENT,offsetX:eA,offsetY:eA,blur:eA},i=0,r=0;r<t.length;r++){var s=t[r];ei(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:A.blur=s,i++):A.color=Yn.parse(n,s)}return A})}},XS={name:"text-transform",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"uppercase":return 2;case"lowercase":return 1;case"capitalize":return 3}return 0}},YS={name:"transform",initialValue:"none",prefix:!0,type:0,parse:function(n,e){if(e.type===20&&e.value==="none")return null;if(e.type===18){var t=qS[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported transform function "'+e.name+'"');return t(e.values)}return null}},JS=function(n){var e=n.filter(function(t){return t.type===17}).map(function(t){return t.number});return e.length===6?e:null},ZS=function(n){var e=n.filter(function(o){return o.type===17}).map(function(o){return o.number}),t=e[0],A=e[1];e[2],e[3];var i=e[4],r=e[5];e[6],e[7],e[8],e[9],e[10],e[11];var s=e[12],a=e[13];return e[14],e[15],e.length===16?[t,A,i,r,s,a]:null},qS={matrix:JS,matrix3d:ZS},Fd={type:16,number:50,flags:Ls},jS=[Fd,Fd],$S={name:"transform-origin",initialValue:"50% 50%",prefix:!0,type:1,parse:function(n,e){var t=e.filter(Qt);return t.length!==2?jS:[t[0],t[1]]}},eU={name:"visible",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"hidden":return 1;case"collapse":return 2;case"visible":default:return 0}}},ds;(function(n){n.NORMAL="normal",n.BREAK_ALL="break-all",n.KEEP_ALL="keep-all"})(ds||(ds={}));var tU={name:"word-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-all":return ds.BREAK_ALL;case"keep-all":return ds.KEEP_ALL;case"normal":default:return ds.NORMAL}}},AU={name:"z-index",initialValue:"auto",prefix:!1,type:0,parse:function(n,e){if(e.type===20)return{auto:!0,order:0};if(Rr(e))return{auto:!1,order:e.number};throw new Error("Invalid z-index number parsed")}},om={name:"time",parse:function(n,e){if(e.type===15)switch(e.unit.toLowerCase()){case"s":return 1e3*e.number;case"ms":return e.number}throw new Error("Unsupported time type")}},nU={name:"opacity",initialValue:"1",type:0,prefix:!1,parse:function(n,e){return Rr(e)?e.number:1}},iU={name:"text-decoration-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},rU={name:"text-decoration-line",initialValue:"none",prefix:!1,type:1,parse:function(n,e){return e.filter(ft).map(function(t){switch(t.value){case"underline":return 1;case"overline":return 2;case"line-through":return 3;case"none":return 4}return 0}).filter(function(t){return t!==0})}},sU={name:"font-family",initialValue:"",prefix:!1,type:1,parse:function(n,e){var t=[],A=[];return e.forEach(function(i){switch(i.type){case 20:case 0:t.push(i.value);break;case 17:t.push(i.number.toString());break;case 4:A.push(t.join(" ")),t.length=0;break}}),t.length&&A.push(t.join(" ")),A.map(function(i){return i.indexOf(" ")===-1?i:"'"+i+"'"})}},aU={name:"font-size",initialValue:"0",prefix:!1,type:3,format:"length"},oU={name:"font-weight",initialValue:"normal",type:0,prefix:!1,parse:function(n,e){if(Rr(e))return e.number;if(ft(e))switch(e.value){case"bold":return 700;case"normal":default:return 400}return 400}},lU={name:"font-variant",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.filter(ft).map(function(t){return t.value})}},cU={name:"font-style",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"oblique":return"oblique";case"italic":return"italic";case"normal":default:return"normal"}}},Pt=function(n,e){return(n&e)!==0},uU={name:"content",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e}},fU={name:"counter-increment",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;for(var A=[],i=e.filter(Kg),r=0;r<i.length;r++){var s=i[r],a=i[r+1];if(s.type===20){var o=a&&Rr(a)?a.number:1;A.push({counter:s.value,increment:o})}}return A}},hU={name:"counter-reset",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return[];for(var t=[],A=e.filter(Kg),i=0;i<A.length;i++){var r=A[i],s=A[i+1];if(ft(r)&&r.value!=="none"){var a=s&&Rr(s)?s.number:0;t.push({counter:r.value,reset:a})}}return t}},dU={name:"duration",initialValue:"0s",prefix:!1,type:1,parse:function(n,e){return e.filter(Rs).map(function(t){return om.parse(n,t)})}},pU={name:"quotes",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;var A=[],i=e.filter(Gy);if(i.length%2!==0)return null;for(var r=0;r<i.length;r+=2){var s=i[r].value,a=i[r+1].value;A.push({open:s,close:a})}return A}},Td=function(n,e,t){if(!n)return"";var A=n[Math.min(e,n.length-1)];return A?t?A.open:A.close:""},gU={name:"box-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&Iu(e[0],"none")?[]:ln(e).map(function(t){for(var A={color:255,offsetX:eA,offsetY:eA,blur:eA,spread:eA,inset:!1},i=0,r=0;r<t.length;r++){var s=t[r];Iu(s,"inset")?A.inset=!0:ei(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:i===2?A.blur=s:A.spread=s,i++):A.color=Yn.parse(n,s)}return A})}},mU={name:"paint-order",initialValue:"normal",prefix:!1,type:1,parse:function(n,e){var t=[0,1,2],A=[];return e.filter(ft).forEach(function(i){switch(i.value){case"stroke":A.push(1);break;case"fill":A.push(0);break;case"markers":A.push(2);break}}),t.forEach(function(i){A.indexOf(i)===-1&&A.push(i)}),A}},BU={name:"-webkit-text-stroke-color",initialValue:"currentcolor",prefix:!1,type:3,format:"color"},vU={name:"-webkit-text-stroke-width",initialValue:"0",type:0,prefix:!1,parse:function(n,e){return Rs(e)?e.number:0}},wU=(function(){function n(e,t){var A,i;this.animationDuration=ge(e,dU,t.animationDuration),this.backgroundClip=ge(e,zy,t.backgroundClip),this.backgroundColor=ge(e,Ky,t.backgroundColor),this.backgroundImage=ge(e,tS,t.backgroundImage),this.backgroundOrigin=ge(e,AS,t.backgroundOrigin),this.backgroundPosition=ge(e,nS,t.backgroundPosition),this.backgroundRepeat=ge(e,iS,t.backgroundRepeat),this.backgroundSize=ge(e,sS,t.backgroundSize),this.borderTopColor=ge(e,oS,t.borderTopColor),this.borderRightColor=ge(e,lS,t.borderRightColor),this.borderBottomColor=ge(e,cS,t.borderBottomColor),this.borderLeftColor=ge(e,uS,t.borderLeftColor),this.borderTopLeftRadius=ge(e,fS,t.borderTopLeftRadius),this.borderTopRightRadius=ge(e,hS,t.borderTopRightRadius),this.borderBottomRightRadius=ge(e,dS,t.borderBottomRightRadius),this.borderBottomLeftRadius=ge(e,pS,t.borderBottomLeftRadius),this.borderTopStyle=ge(e,gS,t.borderTopStyle),this.borderRightStyle=ge(e,mS,t.borderRightStyle),this.borderBottomStyle=ge(e,BS,t.borderBottomStyle),this.borderLeftStyle=ge(e,vS,t.borderLeftStyle),this.borderTopWidth=ge(e,wS,t.borderTopWidth),this.borderRightWidth=ge(e,CS,t.borderRightWidth),this.borderBottomWidth=ge(e,xS,t.borderBottomWidth),this.borderLeftWidth=ge(e,_S,t.borderLeftWidth),this.boxShadow=ge(e,gU,t.boxShadow),this.color=ge(e,ES,t.color),this.direction=ge(e,yS,t.direction),this.display=ge(e,SS,t.display),this.float=ge(e,MS,t.cssFloat),this.fontFamily=ge(e,sU,t.fontFamily),this.fontSize=ge(e,aU,t.fontSize),this.fontStyle=ge(e,cU,t.fontStyle),this.fontVariant=ge(e,lU,t.fontVariant),this.fontWeight=ge(e,oU,t.fontWeight),this.letterSpacing=ge(e,bS,t.letterSpacing),this.lineBreak=ge(e,FS,t.lineBreak),this.lineHeight=ge(e,TS,t.lineHeight),this.listStyleImage=ge(e,IS,t.listStyleImage),this.listStylePosition=ge(e,QS,t.listStylePosition),this.listStyleType=ge(e,Qu,t.listStyleType),this.marginTop=ge(e,LS,t.marginTop),this.marginRight=ge(e,RS,t.marginRight),this.marginBottom=ge(e,DS,t.marginBottom),this.marginLeft=ge(e,PS,t.marginLeft),this.opacity=ge(e,nU,t.opacity);var r=ge(e,HS,t.overflow);this.overflowX=r[0],this.overflowY=r[r.length>1?1:0],this.overflowWrap=ge(e,NS,t.overflowWrap),this.paddingTop=ge(e,OS,t.paddingTop),this.paddingRight=ge(e,GS,t.paddingRight),this.paddingBottom=ge(e,VS,t.paddingBottom),this.paddingLeft=ge(e,kS,t.paddingLeft),this.paintOrder=ge(e,mU,t.paintOrder),this.position=ge(e,KS,t.position),this.textAlign=ge(e,zS,t.textAlign),this.textDecorationColor=ge(e,iU,(A=t.textDecorationColor)!==null&&A!==void 0?A:t.color),this.textDecorationLine=ge(e,rU,(i=t.textDecorationLine)!==null&&i!==void 0?i:t.textDecoration),this.textShadow=ge(e,WS,t.textShadow),this.textTransform=ge(e,XS,t.textTransform),this.transform=ge(e,YS,t.transform),this.transformOrigin=ge(e,$S,t.transformOrigin),this.visibility=ge(e,eU,t.visibility),this.webkitTextStrokeColor=ge(e,BU,t.webkitTextStrokeColor),this.webkitTextStrokeWidth=ge(e,vU,t.webkitTextStrokeWidth),this.wordBreak=ge(e,tU,t.wordBreak),this.zIndex=ge(e,AU,t.zIndex)}return n.prototype.isVisible=function(){return this.display>0&&this.opacity>0&&this.visibility===0},n.prototype.isTransparent=function(){return Jn(this.backgroundColor)},n.prototype.isTransformed=function(){return this.transform!==null},n.prototype.isPositioned=function(){return this.position!==0},n.prototype.isPositionedWithZIndex=function(){return this.isPositioned()&&!this.zIndex.auto},n.prototype.isFloating=function(){return this.float!==0},n.prototype.isInlineLevel=function(){return Pt(this.display,4)||Pt(this.display,33554432)||Pt(this.display,268435456)||Pt(this.display,536870912)||Pt(this.display,67108864)||Pt(this.display,134217728)},n})(),CU=(function(){function n(e,t){this.content=ge(e,uU,t.content),this.quotes=ge(e,pU,t.quotes)}return n})(),Id=(function(){function n(e,t){this.counterIncrement=ge(e,fU,t.counterIncrement),this.counterReset=ge(e,hU,t.counterReset)}return n})(),ge=function(n,e,t){var A=new kg,i=t!==null&&typeof t<"u"?t.toString():e.initialValue;A.write(i);var r=new zg(A.read());switch(e.type){case 2:var s=r.parseComponentValue();return e.parse(n,ft(s)?s.value:e.initialValue);case 0:return e.parse(n,r.parseComponentValue());case 1:return e.parse(n,r.parseComponentValues());case 4:return r.parseComponentValue();case 3:switch(e.format){case"angle":return Al.parse(n,r.parseComponentValue());case"color":return Yn.parse(n,r.parseComponentValue());case"image":return Cf.parse(n,r.parseComponentValue());case"length":var a=r.parseComponentValue();return ei(a)?a:eA;case"length-percentage":var o=r.parseComponentValue();return Qt(o)?o:eA;case"time":return om.parse(n,r.parseComponentValue())}break}},xU="data-html2canvas-debug",_U=function(n){var e=n.getAttribute(xU);switch(e){case"all":return 1;case"clone":return 2;case"parse":return 3;case"render":return 4;default:return 0}},Lu=function(n,e){var t=_U(n);return t===1||e===t},cn=(function(){function n(e,t){if(this.context=e,this.textNodes=[],this.elements=[],this.flags=0,Lu(t,3))debugger;this.styles=new wU(e,window.getComputedStyle(t,null)),Pu(t)&&(this.styles.animationDuration.some(function(A){return A>0})&&(t.style.animationDuration="0s"),this.styles.transform!==null&&(t.style.transform="none")),this.bounds=el(this.context,t),Lu(t,4)&&(this.flags|=16)}return n})(),EU="AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=",Qd="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ss=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Qa=0;Qa<Qd.length;Qa++)ss[Qd.charCodeAt(Qa)]=Qa;var yU=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=ss[n.charCodeAt(A)],s=ss[n.charCodeAt(A+1)],a=ss[n.charCodeAt(A+2)],o=ss[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},SU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},UU=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},Ci=5,xf=11,nc=2,MU=xf-Ci,lm=65536>>Ci,bU=1<<Ci,ic=bU-1,FU=1024>>Ci,TU=lm+FU,IU=TU,QU=32,LU=IU+QU,RU=65536>>xf,DU=1<<MU,PU=DU-1,Ld=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},HU=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},NU=function(n,e){var t=yU(n),A=Array.isArray(t)?UU(t):new Uint32Array(t),i=Array.isArray(t)?SU(t):new Uint16Array(t),r=24,s=Ld(i,r/2,A[4]/2),a=A[5]===2?Ld(i,(r+A[4])/2):HU(A,Math.ceil((r+A[4])/4));return new OU(A[0],A[1],A[2],A[3],s,a)},OU=(function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>Ci],t=(t<<nc)+(e&ic),this.data[t];if(e<=65535)return t=this.index[lm+(e-55296>>Ci)],t=(t<<nc)+(e&ic),this.data[t];if(e<this.highStart)return t=LU-RU+(e>>xf),t=this.index[t],t+=e>>Ci&PU,t=this.index[t],t=(t<<nc)+(e&ic),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n})(),Rd="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",GU=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var La=0;La<Rd.length;La++)GU[Rd.charCodeAt(La)]=La;var VU=1,rc=2,sc=3,Dd=4,Pd=5,kU=7,Hd=8,ac=9,oc=10,Nd=11,Od=12,Gd=13,Vd=14,lc=15,zU=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},KU=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},WU=NU(EU),QA="×",cc="÷",XU=function(n){return WU.get(n)},YU=function(n,e,t){var A=t-2,i=e[A],r=e[t-1],s=e[t];if(r===rc&&s===sc)return QA;if(r===rc||r===sc||r===Dd||s===rc||s===sc||s===Dd)return cc;if(r===Hd&&[Hd,ac,Nd,Od].indexOf(s)!==-1||(r===Nd||r===ac)&&(s===ac||s===oc)||(r===Od||r===oc)&&s===oc||s===Gd||s===Pd||s===kU||r===VU)return QA;if(r===Gd&&s===Vd){for(;i===Pd;)i=e[--A];if(i===Vd)return QA}if(r===lc&&s===lc){for(var a=0;i===lc;)a++,i=e[--A];if(a%2===0)return QA}return cc},JU=function(n){var e=zU(n),t=e.length,A=0,i=0,r=e.map(XU);return{next:function(){if(A>=t)return{done:!0,value:null};for(var s=QA;A<t&&(s=YU(e,r,++A))===QA;);if(s!==QA||A===t){var a=KU.apply(null,e.slice(i,A));return i=A,{value:a,done:!1}}return{done:!0,value:null}}}},ZU=function(n){for(var e=JU(n),t=[],A;!(A=e.next()).done;)A.value&&t.push(A.value.slice());return t},qU=function(n){var e=123;if(n.createRange){var t=n.createRange();if(t.getBoundingClientRect){var A=n.createElement("boundtest");A.style.height=e+"px",A.style.display="block",n.body.appendChild(A),t.selectNode(A);var i=t.getBoundingClientRect(),r=Math.round(i.height);if(n.body.removeChild(A),r===e)return!0}}return!1},jU=function(n){var e=n.createElement("boundtest");e.style.width="50px",e.style.display="block",e.style.fontSize="12px",e.style.letterSpacing="0px",e.style.wordSpacing="0px",n.body.appendChild(e);var t=n.createRange();e.innerHTML=typeof"".repeat=="function"?"&#128104;".repeat(10):"";var A=e.firstChild,i=tl(A.data).map(function(o){return bt(o)}),r=0,s={},a=i.every(function(o,l){t.setStart(A,r),t.setEnd(A,r+o.length);var c=t.getBoundingClientRect();r+=o.length;var u=c.x>s.x||c.y>s.y;return s=c,l===0?!0:u});return n.body.removeChild(e),a},$U=function(){return typeof new Image().crossOrigin<"u"},eM=function(){return typeof new XMLHttpRequest().responseType=="string"},tM=function(n){var e=new Image,t=n.createElement("canvas"),A=t.getContext("2d");if(!A)return!1;e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{A.drawImage(e,0,0),t.toDataURL()}catch{return!1}return!0},kd=function(n){return n[0]===0&&n[1]===255&&n[2]===0&&n[3]===255},AM=function(n){var e=n.createElement("canvas"),t=100;e.width=t,e.height=t;var A=e.getContext("2d");if(!A)return Promise.reject(!1);A.fillStyle="rgb(0, 255, 0)",A.fillRect(0,0,t,t);var i=new Image,r=e.toDataURL();i.src=r;var s=Ru(t,t,0,0,i);return A.fillStyle="red",A.fillRect(0,0,t,t),zd(s).then(function(a){A.drawImage(a,0,0);var o=A.getImageData(0,0,t,t).data;A.fillStyle="red",A.fillRect(0,0,t,t);var l=n.createElement("div");return l.style.backgroundImage="url("+r+")",l.style.height=t+"px",kd(o)?zd(Ru(t,t,0,0,l)):Promise.reject(!1)}).then(function(a){return A.drawImage(a,0,0),kd(A.getImageData(0,0,t,t).data)}).catch(function(){return!1})},Ru=function(n,e,t,A,i){var r="http://www.w3.org/2000/svg",s=document.createElementNS(r,"svg"),a=document.createElementNS(r,"foreignObject");return s.setAttributeNS(null,"width",n.toString()),s.setAttributeNS(null,"height",e.toString()),a.setAttributeNS(null,"width","100%"),a.setAttributeNS(null,"height","100%"),a.setAttributeNS(null,"x",t.toString()),a.setAttributeNS(null,"y",A.toString()),a.setAttributeNS(null,"externalResourcesRequired","true"),s.appendChild(a),a.appendChild(i),s},zd=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){return e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},Jt={get SUPPORT_RANGE_BOUNDS(){var n=qU(document);return Object.defineProperty(Jt,"SUPPORT_RANGE_BOUNDS",{value:n}),n},get SUPPORT_WORD_BREAKING(){var n=Jt.SUPPORT_RANGE_BOUNDS&&jU(document);return Object.defineProperty(Jt,"SUPPORT_WORD_BREAKING",{value:n}),n},get SUPPORT_SVG_DRAWING(){var n=tM(document);return Object.defineProperty(Jt,"SUPPORT_SVG_DRAWING",{value:n}),n},get SUPPORT_FOREIGNOBJECT_DRAWING(){var n=typeof Array.from=="function"&&typeof window.fetch=="function"?AM(document):Promise.resolve(!1);return Object.defineProperty(Jt,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:n}),n},get SUPPORT_CORS_IMAGES(){var n=$U();return Object.defineProperty(Jt,"SUPPORT_CORS_IMAGES",{value:n}),n},get SUPPORT_RESPONSE_TYPE(){var n=eM();return Object.defineProperty(Jt,"SUPPORT_RESPONSE_TYPE",{value:n}),n},get SUPPORT_CORS_XHR(){var n="withCredentials"in new XMLHttpRequest;return Object.defineProperty(Jt,"SUPPORT_CORS_XHR",{value:n}),n},get SUPPORT_NATIVE_TEXT_SEGMENTATION(){var n=!!(typeof Intl<"u"&&Intl.Segmenter);return Object.defineProperty(Jt,"SUPPORT_NATIVE_TEXT_SEGMENTATION",{value:n}),n}},ps=(function(){function n(e,t){this.text=e,this.bounds=t}return n})(),nM=function(n,e,t,A){var i=sM(e,t),r=[],s=0;return i.forEach(function(a){if(t.textDecorationLine.length||a.trim().length>0)if(Jt.SUPPORT_RANGE_BOUNDS){var o=Kd(A,s,a.length).getClientRects();if(o.length>1){var l=_f(a),c=0;l.forEach(function(f){r.push(new ps(f,Sn.fromDOMRectList(n,Kd(A,c+s,f.length).getClientRects()))),c+=f.length})}else r.push(new ps(a,Sn.fromDOMRectList(n,o)))}else{var u=A.splitText(a.length);r.push(new ps(a,iM(n,A))),A=u}else Jt.SUPPORT_RANGE_BOUNDS||(A=A.splitText(a.length));s+=a.length}),r},iM=function(n,e){var t=e.ownerDocument;if(t){var A=t.createElement("html2canvaswrapper");A.appendChild(e.cloneNode(!0));var i=e.parentNode;if(i){i.replaceChild(A,e);var r=el(n,A);return A.firstChild&&i.replaceChild(A.firstChild,A),r}}return Sn.EMPTY},Kd=function(n,e,t){var A=n.ownerDocument;if(!A)throw new Error("Node has no owner document");var i=A.createRange();return i.setStart(n,e),i.setEnd(n,e+t),i},_f=function(n){if(Jt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var e=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(e.segment(n)).map(function(t){return t.segment})}return ZU(n)},rM=function(n,e){if(Jt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var t=new Intl.Segmenter(void 0,{granularity:"word"});return Array.from(t.segment(n)).map(function(A){return A.segment})}return oM(n,e)},sM=function(n,e){return e.letterSpacing!==0?_f(n):rM(n,e)},aM=[32,160,4961,65792,65793,4153,4241],oM=function(n,e){for(var t=RE(n,{lineBreak:e.lineBreak,wordBreak:e.overflowWrap==="break-word"?"break-word":e.wordBreak}),A=[],i,r=function(){if(i.value){var s=i.value.slice(),a=tl(s),o="";a.forEach(function(l){aM.indexOf(l)===-1?o+=bt(l):(o.length&&A.push(o),A.push(bt(l)),o="")}),o.length&&A.push(o)}};!(i=t.next()).done;)r();return A},lM=(function(){function n(e,t,A){this.text=cM(t.data,A.textTransform),this.textBounds=nM(e,this.text,A,t)}return n})(),cM=function(n,e){switch(e){case 1:return n.toLowerCase();case 3:return n.replace(uM,fM);case 2:return n.toUpperCase();default:return n}},uM=/(^|\s|:|-|\(|\))([a-z])/g,fM=function(n,e,t){return n.length>0?e+t.toUpperCase():n},cm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.src=A.currentSrc||A.src,i.intrinsicWidth=A.naturalWidth,i.intrinsicHeight=A.naturalHeight,i.context.cache.addImage(i.src),i}return e})(cn),um=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A,i.intrinsicWidth=A.width,i.intrinsicHeight=A.height,i}return e})(cn),fm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=new XMLSerializer,s=el(t,A);return A.setAttribute("width",s.width+"px"),A.setAttribute("height",s.height+"px"),i.svg="data:image/svg+xml,"+encodeURIComponent(r.serializeToString(A)),i.intrinsicWidth=A.width.baseVal.value,i.intrinsicHeight=A.height.baseVal.value,i.context.cache.addImage(i.svg),i}return e})(cn),hm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(cn),Du=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.start=A.start,i.reversed=typeof A.reversed=="boolean"&&A.reversed===!0,i}return e})(cn),hM=[{type:15,flags:0,unit:"px",number:3}],dM=[{type:16,flags:0,number:50}],pM=function(n){return n.width>n.height?new Sn(n.left+(n.width-n.height)/2,n.top,n.height,n.height):n.width<n.height?new Sn(n.left,n.top+(n.height-n.width)/2,n.width,n.width):n},gM=function(n){var e=n.type===mM?new Array(n.value.length+1).join("•"):n.value;return e.length===0?n.placeholder||"":e},Eo="checkbox",yo="radio",mM="password",Wd=707406591,Ef=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;switch(i.type=A.type.toLowerCase(),i.checked=A.checked,i.value=gM(A),(i.type===Eo||i.type===yo)&&(i.styles.backgroundColor=3739148031,i.styles.borderTopColor=i.styles.borderRightColor=i.styles.borderBottomColor=i.styles.borderLeftColor=2779096575,i.styles.borderTopWidth=i.styles.borderRightWidth=i.styles.borderBottomWidth=i.styles.borderLeftWidth=1,i.styles.borderTopStyle=i.styles.borderRightStyle=i.styles.borderBottomStyle=i.styles.borderLeftStyle=1,i.styles.backgroundClip=[0],i.styles.backgroundOrigin=[0],i.bounds=pM(i.bounds)),i.type){case Eo:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=hM;break;case yo:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=dM;break}return i}return e})(cn),dm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=A.options[A.selectedIndex||0];return i.value=r&&r.text||"",i}return e})(cn),pm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e})(cn),gm=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;i.src=A.src,i.width=parseInt(A.width,10)||0,i.height=parseInt(A.height,10)||0,i.backgroundColor=i.styles.backgroundColor;try{if(A.contentWindow&&A.contentWindow.document&&A.contentWindow.document.documentElement){i.tree=Bm(t,A.contentWindow.document.documentElement);var r=A.contentWindow.document.documentElement?hs(t,getComputedStyle(A.contentWindow.document.documentElement).backgroundColor):yn.TRANSPARENT,s=A.contentWindow.document.body?hs(t,getComputedStyle(A.contentWindow.document.body).backgroundColor):yn.TRANSPARENT;i.backgroundColor=Jn(r)?Jn(s)?i.styles.backgroundColor:s:r}}catch{}return i}return e})(cn),BM=["OL","UL","MENU"],ro=function(n,e,t,A){for(var i=e.firstChild,r=void 0;i;i=r)if(r=i.nextSibling,vm(i)&&i.data.trim().length>0)t.textNodes.push(new lM(n,i,t.styles));else if(hr(i))if(_m(i)&&i.assignedNodes)i.assignedNodes().forEach(function(a){return ro(n,a,t,A)});else{var s=mm(n,i);s.styles.isVisible()&&(vM(i,s,A)?s.flags|=4:wM(s.styles)&&(s.flags|=2),BM.indexOf(i.tagName)!==-1&&(s.flags|=8),t.elements.push(s),i.slot,i.shadowRoot?ro(n,i.shadowRoot,s,A):!So(i)&&!wm(i)&&!Uo(i)&&ro(n,i,s,A))}},mm=function(n,e){return Hu(e)?new cm(n,e):Cm(e)?new um(n,e):wm(e)?new fm(n,e):CM(e)?new hm(n,e):xM(e)?new Du(n,e):_M(e)?new Ef(n,e):Uo(e)?new dm(n,e):So(e)?new pm(n,e):xm(e)?new gm(n,e):new cn(n,e)},Bm=function(n,e){var t=mm(n,e);return t.flags|=4,ro(n,e,t,t),t},vM=function(n,e,t){return e.styles.isPositionedWithZIndex()||e.styles.opacity<1||e.styles.isTransformed()||yf(n)&&t.styles.isTransparent()},wM=function(n){return n.isPositioned()||n.isFloating()},vm=function(n){return n.nodeType===Node.TEXT_NODE},hr=function(n){return n.nodeType===Node.ELEMENT_NODE},Pu=function(n){return hr(n)&&typeof n.style<"u"&&!so(n)},so=function(n){return typeof n.className=="object"},CM=function(n){return n.tagName==="LI"},xM=function(n){return n.tagName==="OL"},_M=function(n){return n.tagName==="INPUT"},EM=function(n){return n.tagName==="HTML"},wm=function(n){return n.tagName==="svg"},yf=function(n){return n.tagName==="BODY"},Cm=function(n){return n.tagName==="CANVAS"},Xd=function(n){return n.tagName==="VIDEO"},Hu=function(n){return n.tagName==="IMG"},xm=function(n){return n.tagName==="IFRAME"},Yd=function(n){return n.tagName==="STYLE"},yM=function(n){return n.tagName==="SCRIPT"},So=function(n){return n.tagName==="TEXTAREA"},Uo=function(n){return n.tagName==="SELECT"},_m=function(n){return n.tagName==="SLOT"},Jd=function(n){return n.tagName.indexOf("-")>0},SM=(function(){function n(){this.counters={}}return n.prototype.getCounterValue=function(e){var t=this.counters[e];return t&&t.length?t[t.length-1]:1},n.prototype.getCounterValues=function(e){var t=this.counters[e];return t||[]},n.prototype.pop=function(e){var t=this;e.forEach(function(A){return t.counters[A].pop()})},n.prototype.parse=function(e){var t=this,A=e.counterIncrement,i=e.counterReset,r=!0;A!==null&&A.forEach(function(a){var o=t.counters[a.counter];o&&a.increment!==0&&(r=!1,o.length||o.push(1),o[Math.max(0,o.length-1)]+=a.increment)});var s=[];return r&&i.forEach(function(a){var o=t.counters[a.counter];s.push(a.counter),o||(o=t.counters[a.counter]=[]),o.push(a.reset)}),s},n})(),Zd={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},qd={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},UM={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},MM={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},ir=function(n,e,t,A,i,r){return n<e||n>t?_s(n,i,r.length>0):A.integers.reduce(function(s,a,o){for(;n>=a;)n-=a,s+=A.values[o];return s},"")+r},Em=function(n,e,t,A){var i="";do t||n--,i=A(n)+i,n/=e;while(n*e>=e);return i},Mt=function(n,e,t,A,i){var r=t-e+1;return(n<0?"-":"")+(Em(Math.abs(n),r,A,function(s){return bt(Math.floor(s%r)+e)})+i)},li=function(n,e,t){t===void 0&&(t=". ");var A=e.length;return Em(Math.abs(n),A,!1,function(i){return e[Math.floor(i%A)]})+t},cr=1,Dn=2,Pn=4,as=8,Bn=function(n,e,t,A,i,r){if(n<-9999||n>9999)return _s(n,4,i.length>0);var s=Math.abs(n),a=i;if(s===0)return e[0]+a;for(var o=0;s>0&&o<=4;o++){var l=s%10;l===0&&Pt(r,cr)&&a!==""?a=e[l]+a:l>1||l===1&&o===0||l===1&&o===1&&Pt(r,Dn)||l===1&&o===1&&Pt(r,Pn)&&n>100||l===1&&o>1&&Pt(r,as)?a=e[l]+(o>0?t[o-1]:"")+a:l===1&&o>0&&(a=t[o-1]+a),s=Math.floor(s/10)}return(n<0?A:"")+a},jd="十百千萬",$d="拾佰仟萬",ep="マイナス",uc="마이너스",_s=function(n,e,t){var A=t?". ":"",i=t?"、":"",r=t?", ":"",s=t?" ":"";switch(e){case 0:return"•"+s;case 1:return"◦"+s;case 2:return"◾"+s;case 5:var a=Mt(n,48,57,!0,A);return a.length<4?"0"+a:a;case 4:return li(n,"〇一二三四五六七八九",i);case 6:return ir(n,1,3999,Zd,3,A).toLowerCase();case 7:return ir(n,1,3999,Zd,3,A);case 8:return Mt(n,945,969,!1,A);case 9:return Mt(n,97,122,!1,A);case 10:return Mt(n,65,90,!1,A);case 11:return Mt(n,1632,1641,!0,A);case 12:case 49:return ir(n,1,9999,qd,3,A);case 35:return ir(n,1,9999,qd,3,A).toLowerCase();case 13:return Mt(n,2534,2543,!0,A);case 14:case 30:return Mt(n,6112,6121,!0,A);case 15:return li(n,"子丑寅卯辰巳午未申酉戌亥",i);case 16:return li(n,"甲乙丙丁戊己庚辛壬癸",i);case 17:case 48:return Bn(n,"零一二三四五六七八九",jd,"負",i,Dn|Pn|as);case 47:return Bn(n,"零壹貳參肆伍陸柒捌玖",$d,"負",i,cr|Dn|Pn|as);case 42:return Bn(n,"零一二三四五六七八九",jd,"负",i,Dn|Pn|as);case 41:return Bn(n,"零壹贰叁肆伍陆柒捌玖",$d,"负",i,cr|Dn|Pn|as);case 26:return Bn(n,"〇一二三四五六七八九","十百千万",ep,i,0);case 25:return Bn(n,"零壱弐参四伍六七八九","拾百千万",ep,i,cr|Dn|Pn);case 31:return Bn(n,"영일이삼사오육칠팔구","십백천만",uc,r,cr|Dn|Pn);case 33:return Bn(n,"零一二三四五六七八九","十百千萬",uc,r,0);case 32:return Bn(n,"零壹貳參四五六七八九","拾百千",uc,r,cr|Dn|Pn);case 18:return Mt(n,2406,2415,!0,A);case 20:return ir(n,1,19999,MM,3,A);case 21:return Mt(n,2790,2799,!0,A);case 22:return Mt(n,2662,2671,!0,A);case 22:return ir(n,1,10999,UM,3,A);case 23:return li(n,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case 24:return li(n,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case 27:return Mt(n,3302,3311,!0,A);case 28:return li(n,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",i);case 29:return li(n,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",i);case 34:return Mt(n,3792,3801,!0,A);case 37:return Mt(n,6160,6169,!0,A);case 38:return Mt(n,4160,4169,!0,A);case 39:return Mt(n,2918,2927,!0,A);case 40:return Mt(n,1776,1785,!0,A);case 43:return Mt(n,3046,3055,!0,A);case 44:return Mt(n,3174,3183,!0,A);case 45:return Mt(n,3664,3673,!0,A);case 46:return Mt(n,3872,3881,!0,A);case 3:default:return Mt(n,48,57,!0,A)}},ym="data-html2canvas-ignore",tp=(function(){function n(e,t,A){if(this.context=e,this.options=A,this.scrolledElements=[],this.referenceElement=t,this.counters=new SM,this.quoteDepth=0,!t.ownerDocument)throw new Error("Cloned element does not have an owner document");this.documentElement=this.cloneNode(t.ownerDocument.documentElement,!1)}return n.prototype.toIFrame=function(e,t){var A=this,i=bM(e,t);if(!i.contentWindow)return Promise.reject("Unable to find iframe window");var r=e.defaultView.pageXOffset,s=e.defaultView.pageYOffset,a=i.contentWindow,o=a.document,l=IM(i).then(function(){return uA(A,void 0,void 0,function(){var c,u;return rA(this,function(f){switch(f.label){case 0:return this.scrolledElements.forEach(DM),a&&(a.scrollTo(t.left,t.top),/(iPad|iPhone|iPod)/g.test(navigator.userAgent)&&(a.scrollY!==t.top||a.scrollX!==t.left)&&(this.context.logger.warn("Unable to restore scroll position for cloned document"),this.context.windowBounds=this.context.windowBounds.add(a.scrollX-t.left,a.scrollY-t.top,0,0))),c=this.options.onclone,u=this.clonedReferenceElement,typeof u>"u"?[2,Promise.reject("Error finding the "+this.referenceElement.nodeName+" in the cloned document")]:o.fonts&&o.fonts.ready?[4,o.fonts.ready]:[3,2];case 1:f.sent(),f.label=2;case 2:return/(AppleWebKit)/g.test(navigator.userAgent)?[4,TM(o)]:[3,4];case 3:f.sent(),f.label=4;case 4:return typeof c=="function"?[2,Promise.resolve().then(function(){return c(o,u)}).then(function(){return i})]:[2,i]}})})});return o.open(),o.write(LM(document.doctype)+"<html></html>"),RM(this.referenceElement.ownerDocument,r,s),o.replaceChild(o.adoptNode(this.documentElement),o.documentElement),o.close(),l},n.prototype.createElementClone=function(e){if(Lu(e,2))debugger;if(Cm(e))return this.createCanvasClone(e);if(Xd(e))return this.createVideoClone(e);if(Yd(e))return this.createStyleClone(e);var t=e.cloneNode(!1);return Hu(t)&&(Hu(e)&&e.currentSrc&&e.currentSrc!==e.src&&(t.src=e.currentSrc,t.srcset=""),t.loading==="lazy"&&(t.loading="eager")),Jd(t)?this.createCustomElementClone(t):t},n.prototype.createCustomElementClone=function(e){var t=document.createElement("html2canvascustomelement");return fc(e.style,t),t},n.prototype.createStyleClone=function(e){try{var t=e.sheet;if(t&&t.cssRules){var A=[].slice.call(t.cssRules,0).reduce(function(r,s){return s&&typeof s.cssText=="string"?r+s.cssText:r},""),i=e.cloneNode(!1);return i.textContent=A,i}}catch(r){if(this.context.logger.error("Unable to access cssRules property",r),r.name!=="SecurityError")throw r}return e.cloneNode(!1)},n.prototype.createCanvasClone=function(e){var t;if(this.options.inlineImages&&e.ownerDocument){var A=e.ownerDocument.createElement("img");try{return A.src=e.toDataURL(),A}catch{this.context.logger.info("Unable to inline canvas contents, canvas is tainted",e)}}var i=e.cloneNode(!1);try{i.width=e.width,i.height=e.height;var r=e.getContext("2d"),s=i.getContext("2d");if(s)if(!this.options.allowTaint&&r)s.putImageData(r.getImageData(0,0,e.width,e.height),0,0);else{var a=(t=e.getContext("webgl2"))!==null&&t!==void 0?t:e.getContext("webgl");if(a){var o=a.getContextAttributes();(o==null?void 0:o.preserveDrawingBuffer)===!1&&this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false",e)}s.drawImage(e,0,0)}return i}catch{this.context.logger.info("Unable to clone canvas as it is tainted",e)}return i},n.prototype.createVideoClone=function(e){var t=e.ownerDocument.createElement("canvas");t.width=e.offsetWidth,t.height=e.offsetHeight;var A=t.getContext("2d");try{return A&&(A.drawImage(e,0,0,t.width,t.height),this.options.allowTaint||A.getImageData(0,0,t.width,t.height)),t}catch{this.context.logger.info("Unable to clone video as it is tainted",e)}var i=e.ownerDocument.createElement("canvas");return i.width=e.offsetWidth,i.height=e.offsetHeight,i},n.prototype.appendChildNode=function(e,t,A){(!hr(t)||!yM(t)&&!t.hasAttribute(ym)&&(typeof this.options.ignoreElements!="function"||!this.options.ignoreElements(t)))&&(!this.options.copyStyles||!hr(t)||!Yd(t))&&e.appendChild(this.cloneNode(t,A))},n.prototype.cloneChildNodes=function(e,t,A){for(var i=this,r=e.shadowRoot?e.shadowRoot.firstChild:e.firstChild;r;r=r.nextSibling)if(hr(r)&&_m(r)&&typeof r.assignedNodes=="function"){var s=r.assignedNodes();s.length&&s.forEach(function(a){return i.appendChildNode(t,a,A)})}else this.appendChildNode(t,r,A)},n.prototype.cloneNode=function(e,t){if(vm(e))return document.createTextNode(e.data);if(!e.ownerDocument)return e.cloneNode(!1);var A=e.ownerDocument.defaultView;if(A&&hr(e)&&(Pu(e)||so(e))){var i=this.createElementClone(e);i.style.transitionProperty="none";var r=A.getComputedStyle(e),s=A.getComputedStyle(e,":before"),a=A.getComputedStyle(e,":after");this.referenceElement===e&&Pu(i)&&(this.clonedReferenceElement=i),yf(i)&&NM(i);var o=this.counters.parse(new Id(this.context,r)),l=this.resolvePseudoContent(e,i,s,gs.BEFORE);Jd(e)&&(t=!0),Xd(e)||this.cloneChildNodes(e,i,t),l&&i.insertBefore(l,i.firstChild);var c=this.resolvePseudoContent(e,i,a,gs.AFTER);return c&&i.appendChild(c),this.counters.pop(o),(r&&(this.options.copyStyles||so(e))&&!xm(e)||t)&&fc(r,i),(e.scrollTop!==0||e.scrollLeft!==0)&&this.scrolledElements.push([i,e.scrollLeft,e.scrollTop]),(So(e)||Uo(e))&&(So(i)||Uo(i))&&(i.value=e.value),i}return e.cloneNode(!1)},n.prototype.resolvePseudoContent=function(e,t,A,i){var r=this;if(A){var s=A.content,a=t.ownerDocument;if(!(!a||!s||s==="none"||s==="-moz-alt-content"||A.display==="none")){this.counters.parse(new Id(this.context,A));var o=new CU(this.context,A),l=a.createElement("html2canvaspseudoelement");fc(A,l),o.content.forEach(function(u){if(u.type===0)l.appendChild(a.createTextNode(u.value));else if(u.type===22){var f=a.createElement("img");f.src=u.value,f.style.opacity="1",l.appendChild(f)}else if(u.type===18){if(u.name==="attr"){var p=u.values.filter(ft);p.length&&l.appendChild(a.createTextNode(e.getAttribute(p[0].value)||""))}else if(u.name==="counter"){var g=u.values.filter(br),m=g[0],d=g[1];if(m&&ft(m)){var h=r.counters.getCounterValue(m.value),B=d&&ft(d)?Qu.parse(r.context,d.value):3;l.appendChild(a.createTextNode(_s(h,B,!1)))}}else if(u.name==="counters"){var w=u.values.filter(br),m=w[0],C=w[1],d=w[2];if(m&&ft(m)){var b=r.counters.getCounterValues(m.value),y=d&&ft(d)?Qu.parse(r.context,d.value):3,M=C&&C.type===0?C.value:"",R=b.map(function(L){return _s(L,y,!1)}).join(M);l.appendChild(a.createTextNode(R))}}}else if(u.type===20)switch(u.value){case"open-quote":l.appendChild(a.createTextNode(Td(o.quotes,r.quoteDepth++,!0)));break;case"close-quote":l.appendChild(a.createTextNode(Td(o.quotes,--r.quoteDepth,!1)));break;default:l.appendChild(a.createTextNode(u.value))}}),l.className=Nu+" "+Ou;var c=i===gs.BEFORE?" "+Nu:" "+Ou;return so(t)?t.className.baseValue+=c:t.className+=c,l}}},n.destroy=function(e){return e.parentNode?(e.parentNode.removeChild(e),!0):!1},n})(),gs;(function(n){n[n.BEFORE=0]="BEFORE",n[n.AFTER=1]="AFTER"})(gs||(gs={}));var bM=function(n,e){var t=n.createElement("iframe");return t.className="html2canvas-container",t.style.visibility="hidden",t.style.position="fixed",t.style.left="-10000px",t.style.top="0px",t.style.border="0",t.width=e.width.toString(),t.height=e.height.toString(),t.scrolling="no",t.setAttribute(ym,"true"),n.body.appendChild(t),t},FM=function(n){return new Promise(function(e){if(n.complete){e();return}if(!n.src){e();return}n.onload=e,n.onerror=e})},TM=function(n){return Promise.all([].slice.call(n.images,0).map(FM))},IM=function(n){return new Promise(function(e,t){var A=n.contentWindow;if(!A)return t("No window assigned for iframe");var i=A.document;A.onload=n.onload=function(){A.onload=n.onload=null;var r=setInterval(function(){i.body.childNodes.length>0&&i.readyState==="complete"&&(clearInterval(r),e(n))},50)}})},QM=["all","d","content"],fc=function(n,e){for(var t=n.length-1;t>=0;t--){var A=n.item(t);QM.indexOf(A)===-1&&e.style.setProperty(A,n.getPropertyValue(A))}return e},LM=function(n){var e="";return n&&(e+="<!DOCTYPE ",n.name&&(e+=n.name),n.internalSubset&&(e+=n.internalSubset),n.publicId&&(e+='"'+n.publicId+'"'),n.systemId&&(e+='"'+n.systemId+'"'),e+=">"),e},RM=function(n,e,t){n&&n.defaultView&&(e!==n.defaultView.pageXOffset||t!==n.defaultView.pageYOffset)&&n.defaultView.scrollTo(e,t)},DM=function(n){var e=n[0],t=n[1],A=n[2];e.scrollLeft=t,e.scrollTop=A},PM=":before",HM=":after",Nu="___html2canvas___pseudoelement_before",Ou="___html2canvas___pseudoelement_after",Ap=`{
    content: "" !important;
    display: none !important;
}`,NM=function(n){OM(n,"."+Nu+PM+Ap+`
         .`+Ou+HM+Ap)},OM=function(n,e){var t=n.ownerDocument;if(t){var A=t.createElement("style");A.textContent=e,n.appendChild(A)}},Sm=(function(){function n(){}return n.getOrigin=function(e){var t=n._link;return t?(t.href=e,t.href=t.href,t.protocol+t.hostname+t.port):"about:blank"},n.isSameOrigin=function(e){return n.getOrigin(e)===n._origin},n.setContext=function(e){n._link=e.document.createElement("a"),n._origin=n.getOrigin(e.location.href)},n._origin="about:blank",n})(),GM=(function(){function n(e,t){this.context=e,this._options=t,this._cache={}}return n.prototype.addImage=function(e){var t=Promise.resolve();return this.has(e)||(dc(e)||KM(e))&&(this._cache[e]=this.loadImage(e)).catch(function(){}),t},n.prototype.match=function(e){return this._cache[e]},n.prototype.loadImage=function(e){return uA(this,void 0,void 0,function(){var t,A,i,r,s=this;return rA(this,function(a){switch(a.label){case 0:return t=Sm.isSameOrigin(e),A=!hc(e)&&this._options.useCORS===!0&&Jt.SUPPORT_CORS_IMAGES&&!t,i=!hc(e)&&!t&&!dc(e)&&typeof this._options.proxy=="string"&&Jt.SUPPORT_CORS_XHR&&!A,!t&&this._options.allowTaint===!1&&!hc(e)&&!dc(e)&&!i&&!A?[2]:(r=e,i?[4,this.proxy(r)]:[3,2]);case 1:r=a.sent(),a.label=2;case 2:return this.context.logger.debug("Added image "+e.substring(0,256)),[4,new Promise(function(o,l){var c=new Image;c.onload=function(){return o(c)},c.onerror=l,(WM(r)||A)&&(c.crossOrigin="anonymous"),c.src=r,c.complete===!0&&setTimeout(function(){return o(c)},500),s._options.imageTimeout>0&&setTimeout(function(){return l("Timed out ("+s._options.imageTimeout+"ms) loading image")},s._options.imageTimeout)})];case 3:return[2,a.sent()]}})})},n.prototype.has=function(e){return typeof this._cache[e]<"u"},n.prototype.keys=function(){return Promise.resolve(Object.keys(this._cache))},n.prototype.proxy=function(e){var t=this,A=this._options.proxy;if(!A)throw new Error("No proxy defined");var i=e.substring(0,256);return new Promise(function(r,s){var a=Jt.SUPPORT_RESPONSE_TYPE?"blob":"text",o=new XMLHttpRequest;o.onload=function(){if(o.status===200)if(a==="text")r(o.response);else{var u=new FileReader;u.addEventListener("load",function(){return r(u.result)},!1),u.addEventListener("error",function(f){return s(f)},!1),u.readAsDataURL(o.response)}else s("Failed to proxy resource "+i+" with status code "+o.status)},o.onerror=s;var l=A.indexOf("?")>-1?"&":"?";if(o.open("GET",""+A+l+"url="+encodeURIComponent(e)+"&responseType="+a),a!=="text"&&o instanceof XMLHttpRequest&&(o.responseType=a),t._options.imageTimeout){var c=t._options.imageTimeout;o.timeout=c,o.ontimeout=function(){return s("Timed out ("+c+"ms) proxying "+i)}}o.send()})},n})(),VM=/^data:image\/svg\+xml/i,kM=/^data:image\/.*;base64,/i,zM=/^data:image\/.*/i,KM=function(n){return Jt.SUPPORT_SVG_DRAWING||!XM(n)},hc=function(n){return zM.test(n)},WM=function(n){return kM.test(n)},dc=function(n){return n.substr(0,4)==="blob"},XM=function(n){return n.substr(-3).toLowerCase()==="svg"||VM.test(n)},fe=(function(){function n(e,t){this.type=0,this.x=e,this.y=t}return n.prototype.add=function(e,t){return new n(this.x+e,this.y+t)},n})(),rr=function(n,e,t){return new fe(n.x+(e.x-n.x)*t,n.y+(e.y-n.y)*t)},Ra=(function(){function n(e,t,A,i){this.type=1,this.start=e,this.startControl=t,this.endControl=A,this.end=i}return n.prototype.subdivide=function(e,t){var A=rr(this.start,this.startControl,e),i=rr(this.startControl,this.endControl,e),r=rr(this.endControl,this.end,e),s=rr(A,i,e),a=rr(i,r,e),o=rr(s,a,e);return t?new n(this.start,A,s,o):new n(o,a,r,this.end)},n.prototype.add=function(e,t){return new n(this.start.add(e,t),this.startControl.add(e,t),this.endControl.add(e,t),this.end.add(e,t))},n.prototype.reverse=function(){return new n(this.end,this.endControl,this.startControl,this.start)},n})(),LA=function(n){return n.type===1},YM=(function(){function n(e){var t=e.styles,A=e.bounds,i=rs(t.borderTopLeftRadius,A.width,A.height),r=i[0],s=i[1],a=rs(t.borderTopRightRadius,A.width,A.height),o=a[0],l=a[1],c=rs(t.borderBottomRightRadius,A.width,A.height),u=c[0],f=c[1],p=rs(t.borderBottomLeftRadius,A.width,A.height),g=p[0],m=p[1],d=[];d.push((r+o)/A.width),d.push((g+u)/A.width),d.push((s+m)/A.height),d.push((l+f)/A.height);var h=Math.max.apply(Math,d);h>1&&(r/=h,s/=h,o/=h,l/=h,u/=h,f/=h,g/=h,m/=h);var B=A.width-o,w=A.height-f,C=A.width-u,b=A.height-m,y=t.borderTopWidth,M=t.borderRightWidth,R=t.borderBottomWidth,E=t.borderLeftWidth,x=pt(t.paddingTop,e.bounds.width),L=pt(t.paddingRight,e.bounds.width),z=pt(t.paddingBottom,e.bounds.width),D=pt(t.paddingLeft,e.bounds.width);this.topLeftBorderDoubleOuterBox=r>0||s>0?wt(A.left+E/3,A.top+y/3,r-E/3,s-y/3,at.TOP_LEFT):new fe(A.left+E/3,A.top+y/3),this.topRightBorderDoubleOuterBox=r>0||s>0?wt(A.left+B,A.top+y/3,o-M/3,l-y/3,at.TOP_RIGHT):new fe(A.left+A.width-M/3,A.top+y/3),this.bottomRightBorderDoubleOuterBox=u>0||f>0?wt(A.left+C,A.top+w,u-M/3,f-R/3,at.BOTTOM_RIGHT):new fe(A.left+A.width-M/3,A.top+A.height-R/3),this.bottomLeftBorderDoubleOuterBox=g>0||m>0?wt(A.left+E/3,A.top+b,g-E/3,m-R/3,at.BOTTOM_LEFT):new fe(A.left+E/3,A.top+A.height-R/3),this.topLeftBorderDoubleInnerBox=r>0||s>0?wt(A.left+E*2/3,A.top+y*2/3,r-E*2/3,s-y*2/3,at.TOP_LEFT):new fe(A.left+E*2/3,A.top+y*2/3),this.topRightBorderDoubleInnerBox=r>0||s>0?wt(A.left+B,A.top+y*2/3,o-M*2/3,l-y*2/3,at.TOP_RIGHT):new fe(A.left+A.width-M*2/3,A.top+y*2/3),this.bottomRightBorderDoubleInnerBox=u>0||f>0?wt(A.left+C,A.top+w,u-M*2/3,f-R*2/3,at.BOTTOM_RIGHT):new fe(A.left+A.width-M*2/3,A.top+A.height-R*2/3),this.bottomLeftBorderDoubleInnerBox=g>0||m>0?wt(A.left+E*2/3,A.top+b,g-E*2/3,m-R*2/3,at.BOTTOM_LEFT):new fe(A.left+E*2/3,A.top+A.height-R*2/3),this.topLeftBorderStroke=r>0||s>0?wt(A.left+E/2,A.top+y/2,r-E/2,s-y/2,at.TOP_LEFT):new fe(A.left+E/2,A.top+y/2),this.topRightBorderStroke=r>0||s>0?wt(A.left+B,A.top+y/2,o-M/2,l-y/2,at.TOP_RIGHT):new fe(A.left+A.width-M/2,A.top+y/2),this.bottomRightBorderStroke=u>0||f>0?wt(A.left+C,A.top+w,u-M/2,f-R/2,at.BOTTOM_RIGHT):new fe(A.left+A.width-M/2,A.top+A.height-R/2),this.bottomLeftBorderStroke=g>0||m>0?wt(A.left+E/2,A.top+b,g-E/2,m-R/2,at.BOTTOM_LEFT):new fe(A.left+E/2,A.top+A.height-R/2),this.topLeftBorderBox=r>0||s>0?wt(A.left,A.top,r,s,at.TOP_LEFT):new fe(A.left,A.top),this.topRightBorderBox=o>0||l>0?wt(A.left+B,A.top,o,l,at.TOP_RIGHT):new fe(A.left+A.width,A.top),this.bottomRightBorderBox=u>0||f>0?wt(A.left+C,A.top+w,u,f,at.BOTTOM_RIGHT):new fe(A.left+A.width,A.top+A.height),this.bottomLeftBorderBox=g>0||m>0?wt(A.left,A.top+b,g,m,at.BOTTOM_LEFT):new fe(A.left,A.top+A.height),this.topLeftPaddingBox=r>0||s>0?wt(A.left+E,A.top+y,Math.max(0,r-E),Math.max(0,s-y),at.TOP_LEFT):new fe(A.left+E,A.top+y),this.topRightPaddingBox=o>0||l>0?wt(A.left+Math.min(B,A.width-M),A.top+y,B>A.width+M?0:Math.max(0,o-M),Math.max(0,l-y),at.TOP_RIGHT):new fe(A.left+A.width-M,A.top+y),this.bottomRightPaddingBox=u>0||f>0?wt(A.left+Math.min(C,A.width-E),A.top+Math.min(w,A.height-R),Math.max(0,u-M),Math.max(0,f-R),at.BOTTOM_RIGHT):new fe(A.left+A.width-M,A.top+A.height-R),this.bottomLeftPaddingBox=g>0||m>0?wt(A.left+E,A.top+Math.min(b,A.height-R),Math.max(0,g-E),Math.max(0,m-R),at.BOTTOM_LEFT):new fe(A.left+E,A.top+A.height-R),this.topLeftContentBox=r>0||s>0?wt(A.left+E+D,A.top+y+x,Math.max(0,r-(E+D)),Math.max(0,s-(y+x)),at.TOP_LEFT):new fe(A.left+E+D,A.top+y+x),this.topRightContentBox=o>0||l>0?wt(A.left+Math.min(B,A.width+E+D),A.top+y+x,B>A.width+E+D?0:o-E+D,l-(y+x),at.TOP_RIGHT):new fe(A.left+A.width-(M+L),A.top+y+x),this.bottomRightContentBox=u>0||f>0?wt(A.left+Math.min(C,A.width-(E+D)),A.top+Math.min(w,A.height+y+x),Math.max(0,u-(M+L)),f-(R+z),at.BOTTOM_RIGHT):new fe(A.left+A.width-(M+L),A.top+A.height-(R+z)),this.bottomLeftContentBox=g>0||m>0?wt(A.left+E+D,A.top+b,Math.max(0,g-(E+D)),m-(R+z),at.BOTTOM_LEFT):new fe(A.left+E+D,A.top+A.height-(R+z))}return n})(),at;(function(n){n[n.TOP_LEFT=0]="TOP_LEFT",n[n.TOP_RIGHT=1]="TOP_RIGHT",n[n.BOTTOM_RIGHT=2]="BOTTOM_RIGHT",n[n.BOTTOM_LEFT=3]="BOTTOM_LEFT"})(at||(at={}));var wt=function(n,e,t,A,i){var r=4*((Math.sqrt(2)-1)/3),s=t*r,a=A*r,o=n+t,l=e+A;switch(i){case at.TOP_LEFT:return new Ra(new fe(n,l),new fe(n,l-a),new fe(o-s,e),new fe(o,e));case at.TOP_RIGHT:return new Ra(new fe(n,e),new fe(n+s,e),new fe(o,l-a),new fe(o,l));case at.BOTTOM_RIGHT:return new Ra(new fe(o,e),new fe(o,e+a),new fe(n+s,l),new fe(n,l));case at.BOTTOM_LEFT:default:return new Ra(new fe(o,l),new fe(o-s,l),new fe(n,e+a),new fe(n,e))}},Mo=function(n){return[n.topLeftBorderBox,n.topRightBorderBox,n.bottomRightBorderBox,n.bottomLeftBorderBox]},JM=function(n){return[n.topLeftContentBox,n.topRightContentBox,n.bottomRightContentBox,n.bottomLeftContentBox]},bo=function(n){return[n.topLeftPaddingBox,n.topRightPaddingBox,n.bottomRightPaddingBox,n.bottomLeftPaddingBox]},ZM=(function(){function n(e,t,A){this.offsetX=e,this.offsetY=t,this.matrix=A,this.type=0,this.target=6}return n})(),Da=(function(){function n(e,t){this.path=e,this.target=t,this.type=1}return n})(),qM=(function(){function n(e){this.opacity=e,this.type=2,this.target=6}return n})(),jM=function(n){return n.type===0},Um=function(n){return n.type===1},$M=function(n){return n.type===2},np=function(n,e){return n.length===e.length?n.some(function(t,A){return t===e[A]}):!1},eb=function(n,e,t,A,i){return n.map(function(r,s){switch(s){case 0:return r.add(e,t);case 1:return r.add(e+A,t);case 2:return r.add(e+A,t+i);case 3:return r.add(e,t+i)}return r})},Mm=(function(){function n(e){this.element=e,this.inlineLevel=[],this.nonInlineLevel=[],this.negativeZIndex=[],this.zeroOrAutoZIndexOrTransformedOrOpacity=[],this.positiveZIndex=[],this.nonPositionedFloats=[],this.nonPositionedInlineLevel=[]}return n})(),bm=(function(){function n(e,t){if(this.container=e,this.parent=t,this.effects=[],this.curves=new YM(this.container),this.container.styles.opacity<1&&this.effects.push(new qM(this.container.styles.opacity)),this.container.styles.transform!==null){var A=this.container.bounds.left+this.container.styles.transformOrigin[0].number,i=this.container.bounds.top+this.container.styles.transformOrigin[1].number,r=this.container.styles.transform;this.effects.push(new ZM(A,i,r))}if(this.container.styles.overflowX!==0){var s=Mo(this.curves),a=bo(this.curves);np(s,a)?this.effects.push(new Da(s,6)):(this.effects.push(new Da(s,2)),this.effects.push(new Da(a,4)))}}return n.prototype.getEffects=function(e){for(var t=[2,3].indexOf(this.container.styles.position)===-1,A=this.parent,i=this.effects.slice(0);A;){var r=A.effects.filter(function(o){return!Um(o)});if(t||A.container.styles.position!==0||!A.parent){if(i.unshift.apply(i,r),t=[2,3].indexOf(A.container.styles.position)===-1,A.container.styles.overflowX!==0){var s=Mo(A.curves),a=bo(A.curves);np(s,a)||i.unshift(new Da(a,6))}}else i.unshift.apply(i,r);A=A.parent}return i.filter(function(o){return Pt(o.target,e)})},n})(),Gu=function(n,e,t,A){n.container.elements.forEach(function(i){var r=Pt(i.flags,4),s=Pt(i.flags,2),a=new bm(i,n);Pt(i.styles.display,2048)&&A.push(a);var o=Pt(i.flags,8)?[]:A;if(r||s){var l=r||i.styles.isPositioned()?t:e,c=new Mm(a);if(i.styles.isPositioned()||i.styles.opacity<1||i.styles.isTransformed()){var u=i.styles.zIndex.order;if(u<0){var f=0;l.negativeZIndex.some(function(g,m){return u>g.element.container.styles.zIndex.order?(f=m,!1):f>0}),l.negativeZIndex.splice(f,0,c)}else if(u>0){var p=0;l.positiveZIndex.some(function(g,m){return u>=g.element.container.styles.zIndex.order?(p=m+1,!1):p>0}),l.positiveZIndex.splice(p,0,c)}else l.zeroOrAutoZIndexOrTransformedOrOpacity.push(c)}else i.styles.isFloating()?l.nonPositionedFloats.push(c):l.nonPositionedInlineLevel.push(c);Gu(a,c,r?c:t,o)}else i.styles.isInlineLevel()?e.inlineLevel.push(a):e.nonInlineLevel.push(a),Gu(a,e,t,o);Pt(i.flags,8)&&Fm(i,o)})},Fm=function(n,e){for(var t=n instanceof Du?n.start:1,A=n instanceof Du?n.reversed:!1,i=0;i<e.length;i++){var r=e[i];r.container instanceof hm&&typeof r.container.value=="number"&&r.container.value!==0&&(t=r.container.value),r.listValue=_s(t,r.container.styles.listStyleType,!0),t+=A?-1:1}},tb=function(n){var e=new bm(n,null),t=new Mm(e),A=[];return Gu(e,t,t,A),Fm(e.container,A),t},ip=function(n,e){switch(e){case 0:return OA(n.topLeftBorderBox,n.topLeftPaddingBox,n.topRightBorderBox,n.topRightPaddingBox);case 1:return OA(n.topRightBorderBox,n.topRightPaddingBox,n.bottomRightBorderBox,n.bottomRightPaddingBox);case 2:return OA(n.bottomRightBorderBox,n.bottomRightPaddingBox,n.bottomLeftBorderBox,n.bottomLeftPaddingBox);case 3:default:return OA(n.bottomLeftBorderBox,n.bottomLeftPaddingBox,n.topLeftBorderBox,n.topLeftPaddingBox)}},Ab=function(n,e){switch(e){case 0:return OA(n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox,n.topRightBorderBox,n.topRightBorderDoubleOuterBox);case 1:return OA(n.topRightBorderBox,n.topRightBorderDoubleOuterBox,n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox);case 2:return OA(n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox,n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox);case 3:default:return OA(n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox,n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox)}},nb=function(n,e){switch(e){case 0:return OA(n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox,n.topRightBorderDoubleInnerBox,n.topRightPaddingBox);case 1:return OA(n.topRightBorderDoubleInnerBox,n.topRightPaddingBox,n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox);case 2:return OA(n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox,n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox);case 3:default:return OA(n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox,n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox)}},ib=function(n,e){switch(e){case 0:return Pa(n.topLeftBorderStroke,n.topRightBorderStroke);case 1:return Pa(n.topRightBorderStroke,n.bottomRightBorderStroke);case 2:return Pa(n.bottomRightBorderStroke,n.bottomLeftBorderStroke);case 3:default:return Pa(n.bottomLeftBorderStroke,n.topLeftBorderStroke)}},Pa=function(n,e){var t=[];return LA(n)?t.push(n.subdivide(.5,!1)):t.push(n),LA(e)?t.push(e.subdivide(.5,!0)):t.push(e),t},OA=function(n,e,t,A){var i=[];return LA(n)?i.push(n.subdivide(.5,!1)):i.push(n),LA(t)?i.push(t.subdivide(.5,!0)):i.push(t),LA(A)?i.push(A.subdivide(.5,!0).reverse()):i.push(A),LA(e)?i.push(e.subdivide(.5,!1).reverse()):i.push(e),i},Tm=function(n){var e=n.bounds,t=n.styles;return e.add(t.borderLeftWidth,t.borderTopWidth,-(t.borderRightWidth+t.borderLeftWidth),-(t.borderTopWidth+t.borderBottomWidth))},Fo=function(n){var e=n.styles,t=n.bounds,A=pt(e.paddingLeft,t.width),i=pt(e.paddingRight,t.width),r=pt(e.paddingTop,t.width),s=pt(e.paddingBottom,t.width);return t.add(A+e.borderLeftWidth,r+e.borderTopWidth,-(e.borderRightWidth+e.borderLeftWidth+A+i),-(e.borderTopWidth+e.borderBottomWidth+r+s))},rb=function(n,e){return n===0?e.bounds:n===2?Fo(e):Tm(e)},sb=function(n,e){return n===0?e.bounds:n===2?Fo(e):Tm(e)},pc=function(n,e,t){var A=rb(ur(n.styles.backgroundOrigin,e),n),i=sb(ur(n.styles.backgroundClip,e),n),r=ab(ur(n.styles.backgroundSize,e),t,A),s=r[0],a=r[1],o=rs(ur(n.styles.backgroundPosition,e),A.width-s,A.height-a),l=ob(ur(n.styles.backgroundRepeat,e),o,r,A,i),c=Math.round(A.left+o[0]),u=Math.round(A.top+o[1]);return[l,c,u,s,a]},sr=function(n){return ft(n)&&n.value===vr.AUTO},Ha=function(n){return typeof n=="number"},ab=function(n,e,t){var A=e[0],i=e[1],r=e[2],s=n[0],a=n[1];if(!s)return[0,0];if(Qt(s)&&a&&Qt(a))return[pt(s,t.width),pt(a,t.height)];var o=Ha(r);if(ft(s)&&(s.value===vr.CONTAIN||s.value===vr.COVER)){if(Ha(r)){var l=t.width/t.height;return l<r!=(s.value===vr.COVER)?[t.width,t.width/r]:[t.height*r,t.height]}return[t.width,t.height]}var c=Ha(A),u=Ha(i),f=c||u;if(sr(s)&&(!a||sr(a))){if(c&&u)return[A,i];if(!o&&!f)return[t.width,t.height];if(f&&o){var p=c?A:i*r,g=u?i:A/r;return[p,g]}var m=c?A:t.width,d=u?i:t.height;return[m,d]}if(o){var h=0,B=0;return Qt(s)?h=pt(s,t.width):Qt(a)&&(B=pt(a,t.height)),sr(s)?h=B*r:(!a||sr(a))&&(B=h/r),[h,B]}var w=null,C=null;if(Qt(s)?w=pt(s,t.width):a&&Qt(a)&&(C=pt(a,t.height)),w!==null&&(!a||sr(a))&&(C=c&&u?w/A*i:t.height),C!==null&&sr(s)&&(w=c&&u?C/i*A:t.width),w!==null&&C!==null)return[w,C];throw new Error("Unable to calculate background-size for element")},ur=function(n,e){var t=n[e];return typeof t>"u"?n[0]:t},ob=function(n,e,t,A,i){var r=e[0],s=e[1],a=t[0],o=t[1];switch(n){case 2:return[new fe(Math.round(A.left),Math.round(A.top+s)),new fe(Math.round(A.left+A.width),Math.round(A.top+s)),new fe(Math.round(A.left+A.width),Math.round(o+A.top+s)),new fe(Math.round(A.left),Math.round(o+A.top+s))];case 3:return[new fe(Math.round(A.left+r),Math.round(A.top)),new fe(Math.round(A.left+r+a),Math.round(A.top)),new fe(Math.round(A.left+r+a),Math.round(A.height+A.top)),new fe(Math.round(A.left+r),Math.round(A.height+A.top))];case 1:return[new fe(Math.round(A.left+r),Math.round(A.top+s)),new fe(Math.round(A.left+r+a),Math.round(A.top+s)),new fe(Math.round(A.left+r+a),Math.round(A.top+s+o)),new fe(Math.round(A.left+r),Math.round(A.top+s+o))];default:return[new fe(Math.round(i.left),Math.round(i.top)),new fe(Math.round(i.left+i.width),Math.round(i.top)),new fe(Math.round(i.left+i.width),Math.round(i.height+i.top)),new fe(Math.round(i.left),Math.round(i.height+i.top))]}},lb="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",rp="Hidden Text",cb=(function(){function n(e){this._data={},this._document=e}return n.prototype.parseMetrics=function(e,t){var A=this._document.createElement("div"),i=this._document.createElement("img"),r=this._document.createElement("span"),s=this._document.body;A.style.visibility="hidden",A.style.fontFamily=e,A.style.fontSize=t,A.style.margin="0",A.style.padding="0",A.style.whiteSpace="nowrap",s.appendChild(A),i.src=lb,i.width=1,i.height=1,i.style.margin="0",i.style.padding="0",i.style.verticalAlign="baseline",r.style.fontFamily=e,r.style.fontSize=t,r.style.margin="0",r.style.padding="0",r.appendChild(this._document.createTextNode(rp)),A.appendChild(r),A.appendChild(i);var a=i.offsetTop-r.offsetTop+2;A.removeChild(r),A.appendChild(this._document.createTextNode(rp)),A.style.lineHeight="normal",i.style.verticalAlign="super";var o=i.offsetTop-A.offsetTop+2;return s.removeChild(A),{baseline:a,middle:o}},n.prototype.getMetrics=function(e,t){var A=e+" "+t;return typeof this._data[A]>"u"&&(this._data[A]=this.parseMetrics(e,t)),this._data[A]},n})(),Im=(function(){function n(e,t){this.context=e,this.options=t}return n})(),ub=1e4,fb=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i._activeEffects=[],i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),A.canvas||(i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px"),i.fontMetrics=new cb(document),i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.ctx.textBaseline="bottom",i._activeEffects=[],i.context.logger.debug("Canvas renderer initialized ("+A.width+"x"+A.height+") with scale "+A.scale),i}return e.prototype.applyEffects=function(t){for(var A=this;this._activeEffects.length;)this.popEffect();t.forEach(function(i){return A.applyEffect(i)})},e.prototype.applyEffect=function(t){this.ctx.save(),$M(t)&&(this.ctx.globalAlpha=t.opacity),jM(t)&&(this.ctx.translate(t.offsetX,t.offsetY),this.ctx.transform(t.matrix[0],t.matrix[1],t.matrix[2],t.matrix[3],t.matrix[4],t.matrix[5]),this.ctx.translate(-t.offsetX,-t.offsetY)),Um(t)&&(this.path(t.path),this.ctx.clip()),this._activeEffects.push(t)},e.prototype.popEffect=function(){this._activeEffects.pop(),this.ctx.restore()},e.prototype.renderStack=function(t){return uA(this,void 0,void 0,function(){var A;return rA(this,function(i){switch(i.label){case 0:return A=t.element.container.styles,A.isVisible()?[4,this.renderStackContent(t)]:[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}})})},e.prototype.renderNode=function(t){return uA(this,void 0,void 0,function(){return rA(this,function(A){switch(A.label){case 0:if(Pt(t.container.flags,16))debugger;return t.container.styles.isVisible()?[4,this.renderNodeBackgroundAndBorders(t)]:[3,3];case 1:return A.sent(),[4,this.renderNodeContent(t)];case 2:A.sent(),A.label=3;case 3:return[2]}})})},e.prototype.renderTextWithLetterSpacing=function(t,A,i){var r=this;if(A===0)this.ctx.fillText(t.text,t.bounds.left,t.bounds.top+i);else{var s=_f(t.text);s.reduce(function(a,o){return r.ctx.fillText(o,a,t.bounds.top+i),a+r.ctx.measureText(o).width},t.bounds.left)}},e.prototype.createFontStyle=function(t){var A=t.fontVariant.filter(function(s){return s==="normal"||s==="small-caps"}).join(""),i=mb(t.fontFamily).join(", "),r=Rs(t.fontSize)?""+t.fontSize.number+t.fontSize.unit:t.fontSize.number+"px";return[[t.fontStyle,A,t.fontWeight,r,i].join(" "),i,r]},e.prototype.renderTextNode=function(t,A){return uA(this,void 0,void 0,function(){var i,r,s,a,o,l,c,u,f=this;return rA(this,function(p){return i=this.createFontStyle(A),r=i[0],s=i[1],a=i[2],this.ctx.font=r,this.ctx.direction=A.direction===1?"rtl":"ltr",this.ctx.textAlign="left",this.ctx.textBaseline="alphabetic",o=this.fontMetrics.getMetrics(s,a),l=o.baseline,c=o.middle,u=A.paintOrder,t.textBounds.forEach(function(g){u.forEach(function(m){switch(m){case 0:f.ctx.fillStyle=kt(A.color),f.renderTextWithLetterSpacing(g,A.letterSpacing,l);var d=A.textShadow;d.length&&g.text.trim().length&&(d.slice(0).reverse().forEach(function(h){f.ctx.shadowColor=kt(h.color),f.ctx.shadowOffsetX=h.offsetX.number*f.options.scale,f.ctx.shadowOffsetY=h.offsetY.number*f.options.scale,f.ctx.shadowBlur=h.blur.number,f.renderTextWithLetterSpacing(g,A.letterSpacing,l)}),f.ctx.shadowColor="",f.ctx.shadowOffsetX=0,f.ctx.shadowOffsetY=0,f.ctx.shadowBlur=0),A.textDecorationLine.length&&(f.ctx.fillStyle=kt(A.textDecorationColor||A.color),A.textDecorationLine.forEach(function(h){switch(h){case 1:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top+l),g.bounds.width,1);break;case 2:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top),g.bounds.width,1);break;case 3:f.ctx.fillRect(g.bounds.left,Math.ceil(g.bounds.top+c),g.bounds.width,1);break}}));break;case 1:A.webkitTextStrokeWidth&&g.text.trim().length&&(f.ctx.strokeStyle=kt(A.webkitTextStrokeColor),f.ctx.lineWidth=A.webkitTextStrokeWidth,f.ctx.lineJoin=window.chrome?"miter":"round",f.ctx.strokeText(g.text,g.bounds.left,g.bounds.top+l)),f.ctx.strokeStyle="",f.ctx.lineWidth=0,f.ctx.lineJoin="miter";break}})}),[2]})})},e.prototype.renderReplacedElement=function(t,A,i){if(i&&t.intrinsicWidth>0&&t.intrinsicHeight>0){var r=Fo(t),s=bo(A);this.path(s),this.ctx.save(),this.ctx.clip(),this.ctx.drawImage(i,0,0,t.intrinsicWidth,t.intrinsicHeight,r.left,r.top,r.width,r.height),this.ctx.restore()}},e.prototype.renderNodeContent=function(t){return uA(this,void 0,void 0,function(){var A,i,r,s,a,o,B,B,l,c,u,f,C,p,g,b,m,d,h,B,w,C,b;return rA(this,function(y){switch(y.label){case 0:this.applyEffects(t.getEffects(4)),A=t.container,i=t.curves,r=A.styles,s=0,a=A.textNodes,y.label=1;case 1:return s<a.length?(o=a[s],[4,this.renderTextNode(o,r)]):[3,4];case 2:y.sent(),y.label=3;case 3:return s++,[3,1];case 4:if(!(A instanceof cm))return[3,8];y.label=5;case 5:return y.trys.push([5,7,,8]),[4,this.context.cache.match(A.src)];case 6:return B=y.sent(),this.renderReplacedElement(A,i,B),[3,8];case 7:return y.sent(),this.context.logger.error("Error loading image "+A.src),[3,8];case 8:if(A instanceof um&&this.renderReplacedElement(A,i,A.canvas),!(A instanceof fm))return[3,12];y.label=9;case 9:return y.trys.push([9,11,,12]),[4,this.context.cache.match(A.svg)];case 10:return B=y.sent(),this.renderReplacedElement(A,i,B),[3,12];case 11:return y.sent(),this.context.logger.error("Error loading svg "+A.svg.substring(0,255)),[3,12];case 12:return A instanceof gm&&A.tree?(l=new e(this.context,{scale:this.options.scale,backgroundColor:A.backgroundColor,x:0,y:0,width:A.width,height:A.height}),[4,l.render(A.tree)]):[3,14];case 13:c=y.sent(),A.width&&A.height&&this.ctx.drawImage(c,0,0,A.width,A.height,A.bounds.left,A.bounds.top,A.bounds.width,A.bounds.height),y.label=14;case 14:if(A instanceof Ef&&(u=Math.min(A.bounds.width,A.bounds.height),A.type===Eo?A.checked&&(this.ctx.save(),this.path([new fe(A.bounds.left+u*.39363,A.bounds.top+u*.79),new fe(A.bounds.left+u*.16,A.bounds.top+u*.5549),new fe(A.bounds.left+u*.27347,A.bounds.top+u*.44071),new fe(A.bounds.left+u*.39694,A.bounds.top+u*.5649),new fe(A.bounds.left+u*.72983,A.bounds.top+u*.23),new fe(A.bounds.left+u*.84,A.bounds.top+u*.34085),new fe(A.bounds.left+u*.39363,A.bounds.top+u*.79)]),this.ctx.fillStyle=kt(Wd),this.ctx.fill(),this.ctx.restore()):A.type===yo&&A.checked&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(A.bounds.left+u/2,A.bounds.top+u/2,u/4,0,Math.PI*2,!0),this.ctx.fillStyle=kt(Wd),this.ctx.fill(),this.ctx.restore())),hb(A)&&A.value.length){switch(f=this.createFontStyle(r),C=f[0],p=f[1],g=this.fontMetrics.getMetrics(C,p).baseline,this.ctx.font=C,this.ctx.fillStyle=kt(r.color),this.ctx.textBaseline="alphabetic",this.ctx.textAlign=pb(A.styles.textAlign),b=Fo(A),m=0,A.styles.textAlign){case 1:m+=b.width/2;break;case 2:m+=b.width;break}d=b.add(m,0,0,-b.height/2+1),this.ctx.save(),this.path([new fe(b.left,b.top),new fe(b.left+b.width,b.top),new fe(b.left+b.width,b.top+b.height),new fe(b.left,b.top+b.height)]),this.ctx.clip(),this.renderTextWithLetterSpacing(new ps(A.value,d),r.letterSpacing,g),this.ctx.restore(),this.ctx.textBaseline="alphabetic",this.ctx.textAlign="left"}if(!Pt(A.styles.display,2048))return[3,20];if(A.styles.listStyleImage===null)return[3,19];if(h=A.styles.listStyleImage,h.type!==0)return[3,18];B=void 0,w=h.url,y.label=15;case 15:return y.trys.push([15,17,,18]),[4,this.context.cache.match(w)];case 16:return B=y.sent(),this.ctx.drawImage(B,A.bounds.left-(B.width+10),A.bounds.top),[3,18];case 17:return y.sent(),this.context.logger.error("Error loading list-style-image "+w),[3,18];case 18:return[3,20];case 19:t.listValue&&A.styles.listStyleType!==-1&&(C=this.createFontStyle(r)[0],this.ctx.font=C,this.ctx.fillStyle=kt(r.color),this.ctx.textBaseline="middle",this.ctx.textAlign="right",b=new Sn(A.bounds.left,A.bounds.top+pt(A.styles.paddingTop,A.bounds.width),A.bounds.width,bd(r.lineHeight,r.fontSize.number)/2+1),this.renderTextWithLetterSpacing(new ps(t.listValue,b),r.letterSpacing,bd(r.lineHeight,r.fontSize.number)/2+2),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"),y.label=20;case 20:return[2]}})})},e.prototype.renderStackContent=function(t){return uA(this,void 0,void 0,function(){var A,i,h,r,s,h,a,o,h,l,c,h,u,f,h,p,g,h,m,d,h;return rA(this,function(B){switch(B.label){case 0:if(Pt(t.element.container.flags,16))debugger;return[4,this.renderNodeBackgroundAndBorders(t.element)];case 1:B.sent(),A=0,i=t.negativeZIndex,B.label=2;case 2:return A<i.length?(h=i[A],[4,this.renderStack(h)]):[3,5];case 3:B.sent(),B.label=4;case 4:return A++,[3,2];case 5:return[4,this.renderNodeContent(t.element)];case 6:B.sent(),r=0,s=t.nonInlineLevel,B.label=7;case 7:return r<s.length?(h=s[r],[4,this.renderNode(h)]):[3,10];case 8:B.sent(),B.label=9;case 9:return r++,[3,7];case 10:a=0,o=t.nonPositionedFloats,B.label=11;case 11:return a<o.length?(h=o[a],[4,this.renderStack(h)]):[3,14];case 12:B.sent(),B.label=13;case 13:return a++,[3,11];case 14:l=0,c=t.nonPositionedInlineLevel,B.label=15;case 15:return l<c.length?(h=c[l],[4,this.renderStack(h)]):[3,18];case 16:B.sent(),B.label=17;case 17:return l++,[3,15];case 18:u=0,f=t.inlineLevel,B.label=19;case 19:return u<f.length?(h=f[u],[4,this.renderNode(h)]):[3,22];case 20:B.sent(),B.label=21;case 21:return u++,[3,19];case 22:p=0,g=t.zeroOrAutoZIndexOrTransformedOrOpacity,B.label=23;case 23:return p<g.length?(h=g[p],[4,this.renderStack(h)]):[3,26];case 24:B.sent(),B.label=25;case 25:return p++,[3,23];case 26:m=0,d=t.positiveZIndex,B.label=27;case 27:return m<d.length?(h=d[m],[4,this.renderStack(h)]):[3,30];case 28:B.sent(),B.label=29;case 29:return m++,[3,27];case 30:return[2]}})})},e.prototype.mask=function(t){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.canvas.width,0),this.ctx.lineTo(this.canvas.width,this.canvas.height),this.ctx.lineTo(0,this.canvas.height),this.ctx.lineTo(0,0),this.formatPath(t.slice(0).reverse()),this.ctx.closePath()},e.prototype.path=function(t){this.ctx.beginPath(),this.formatPath(t),this.ctx.closePath()},e.prototype.formatPath=function(t){var A=this;t.forEach(function(i,r){var s=LA(i)?i.start:i;r===0?A.ctx.moveTo(s.x,s.y):A.ctx.lineTo(s.x,s.y),LA(i)&&A.ctx.bezierCurveTo(i.startControl.x,i.startControl.y,i.endControl.x,i.endControl.y,i.end.x,i.end.y)})},e.prototype.renderRepeat=function(t,A,i,r){this.path(t),this.ctx.fillStyle=A,this.ctx.translate(i,r),this.ctx.fill(),this.ctx.translate(-i,-r)},e.prototype.resizeImage=function(t,A,i){var r;if(t.width===A&&t.height===i)return t;var s=(r=this.canvas.ownerDocument)!==null&&r!==void 0?r:document,a=s.createElement("canvas");a.width=Math.max(1,A),a.height=Math.max(1,i);var o=a.getContext("2d");return o.drawImage(t,0,0,t.width,t.height,0,0,A,i),a},e.prototype.renderBackgroundImage=function(t){return uA(this,void 0,void 0,function(){var A,i,r,s,a,o;return rA(this,function(l){switch(l.label){case 0:A=t.styles.backgroundImage.length-1,i=function(c){var u,f,p,x,V,q,D,O,R,g,x,V,q,D,O,m,d,h,B,w,C,b,y,M,R,E,x,L,z,D,O,Z,V,q,X,re,ae,he,Ie,Oe,J,ee;return rA(this,function(ue){switch(ue.label){case 0:if(c.type!==0)return[3,5];u=void 0,f=c.url,ue.label=1;case 1:return ue.trys.push([1,3,,4]),[4,r.context.cache.match(f)];case 2:return u=ue.sent(),[3,4];case 3:return ue.sent(),r.context.logger.error("Error loading background-image "+f),[3,4];case 4:return u&&(p=pc(t,A,[u.width,u.height,u.width/u.height]),x=p[0],V=p[1],q=p[2],D=p[3],O=p[4],R=r.ctx.createPattern(r.resizeImage(u,D,O),"repeat"),r.renderRepeat(x,R,V,q)),[3,6];case 5:jy(c)?(g=pc(t,A,[null,null,null]),x=g[0],V=g[1],q=g[2],D=g[3],O=g[4],m=Xy(c.angle,D,O),d=m[0],h=m[1],B=m[2],w=m[3],C=m[4],b=document.createElement("canvas"),b.width=D,b.height=O,y=b.getContext("2d"),M=y.createLinearGradient(h,w,B,C),Ud(c.stops,d).forEach(function(ce){return M.addColorStop(ce.stop,kt(ce.color))}),y.fillStyle=M,y.fillRect(0,0,D,O),D>0&&O>0&&(R=r.ctx.createPattern(b,"repeat"),r.renderRepeat(x,R,V,q))):$y(c)&&(E=pc(t,A,[null,null,null]),x=E[0],L=E[1],z=E[2],D=E[3],O=E[4],Z=c.position.length===0?[wf]:c.position,V=pt(Z[0],D),q=pt(Z[Z.length-1],O),X=Yy(c,V,q,D,O),re=X[0],ae=X[1],re>0&&ae>0&&(he=r.ctx.createRadialGradient(L+V,z+q,0,L+V,z+q,re),Ud(c.stops,re*2).forEach(function(ce){return he.addColorStop(ce.stop,kt(ce.color))}),r.path(x),r.ctx.fillStyle=he,re!==ae?(Ie=t.bounds.left+.5*t.bounds.width,Oe=t.bounds.top+.5*t.bounds.height,J=ae/re,ee=1/J,r.ctx.save(),r.ctx.translate(Ie,Oe),r.ctx.transform(1,0,0,J,0,0),r.ctx.translate(-Ie,-Oe),r.ctx.fillRect(L,ee*(z-Oe)+Oe,D,O*ee),r.ctx.restore()):r.ctx.fill())),ue.label=6;case 6:return A--,[2]}})},r=this,s=0,a=t.styles.backgroundImage.slice(0).reverse(),l.label=1;case 1:return s<a.length?(o=a[s],[5,i(o)]):[3,4];case 2:l.sent(),l.label=3;case 3:return s++,[3,1];case 4:return[2]}})})},e.prototype.renderSolidBorder=function(t,A,i){return uA(this,void 0,void 0,function(){return rA(this,function(r){return this.path(ip(i,A)),this.ctx.fillStyle=kt(t),this.ctx.fill(),[2]})})},e.prototype.renderDoubleBorder=function(t,A,i,r){return uA(this,void 0,void 0,function(){var s,a;return rA(this,function(o){switch(o.label){case 0:return A<3?[4,this.renderSolidBorder(t,i,r)]:[3,2];case 1:return o.sent(),[2];case 2:return s=Ab(r,i),this.path(s),this.ctx.fillStyle=kt(t),this.ctx.fill(),a=nb(r,i),this.path(a),this.ctx.fill(),[2]}})})},e.prototype.renderNodeBackgroundAndBorders=function(t){return uA(this,void 0,void 0,function(){var A,i,r,s,a,o,l,c,u=this;return rA(this,function(f){switch(f.label){case 0:return this.applyEffects(t.getEffects(2)),A=t.container.styles,i=!Jn(A.backgroundColor)||A.backgroundImage.length,r=[{style:A.borderTopStyle,color:A.borderTopColor,width:A.borderTopWidth},{style:A.borderRightStyle,color:A.borderRightColor,width:A.borderRightWidth},{style:A.borderBottomStyle,color:A.borderBottomColor,width:A.borderBottomWidth},{style:A.borderLeftStyle,color:A.borderLeftColor,width:A.borderLeftWidth}],s=db(ur(A.backgroundClip,0),t.curves),i||A.boxShadow.length?(this.ctx.save(),this.path(s),this.ctx.clip(),Jn(A.backgroundColor)||(this.ctx.fillStyle=kt(A.backgroundColor),this.ctx.fill()),[4,this.renderBackgroundImage(t.container)]):[3,2];case 1:f.sent(),this.ctx.restore(),A.boxShadow.slice(0).reverse().forEach(function(p){u.ctx.save();var g=Mo(t.curves),m=p.inset?0:ub,d=eb(g,-m+(p.inset?1:-1)*p.spread.number,(p.inset?1:-1)*p.spread.number,p.spread.number*(p.inset?-2:2),p.spread.number*(p.inset?-2:2));p.inset?(u.path(g),u.ctx.clip(),u.mask(d)):(u.mask(g),u.ctx.clip(),u.path(d)),u.ctx.shadowOffsetX=p.offsetX.number+m,u.ctx.shadowOffsetY=p.offsetY.number,u.ctx.shadowColor=kt(p.color),u.ctx.shadowBlur=p.blur.number,u.ctx.fillStyle=p.inset?kt(p.color):"rgba(0,0,0,1)",u.ctx.fill(),u.ctx.restore()}),f.label=2;case 2:a=0,o=0,l=r,f.label=3;case 3:return o<l.length?(c=l[o],c.style!==0&&!Jn(c.color)&&c.width>0?c.style!==2?[3,5]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,2)]:[3,11]):[3,13];case 4:return f.sent(),[3,11];case 5:return c.style!==3?[3,7]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,3)];case 6:return f.sent(),[3,11];case 7:return c.style!==4?[3,9]:[4,this.renderDoubleBorder(c.color,c.width,a,t.curves)];case 8:return f.sent(),[3,11];case 9:return[4,this.renderSolidBorder(c.color,a,t.curves)];case 10:f.sent(),f.label=11;case 11:a++,f.label=12;case 12:return o++,[3,3];case 13:return[2]}})})},e.prototype.renderDashedDottedBorder=function(t,A,i,r,s){return uA(this,void 0,void 0,function(){var a,o,l,c,u,f,p,g,m,d,h,B,w,C,b,y,b,y;return rA(this,function(M){return this.ctx.save(),a=ib(r,i),o=ip(r,i),s===2&&(this.path(o),this.ctx.clip()),LA(o[0])?(l=o[0].start.x,c=o[0].start.y):(l=o[0].x,c=o[0].y),LA(o[1])?(u=o[1].end.x,f=o[1].end.y):(u=o[1].x,f=o[1].y),i===0||i===2?p=Math.abs(l-u):p=Math.abs(c-f),this.ctx.beginPath(),s===3?this.formatPath(a):this.formatPath(o.slice(0,2)),g=A<3?A*3:A*2,m=A<3?A*2:A,s===3&&(g=A,m=A),d=!0,p<=g*2?d=!1:p<=g*2+m?(h=p/(2*g+m),g*=h,m*=h):(B=Math.floor((p+m)/(g+m)),w=(p-B*g)/(B-1),C=(p-(B+1)*g)/B,m=C<=0||Math.abs(m-w)<Math.abs(m-C)?w:C),d&&(s===3?this.ctx.setLineDash([0,g+m]):this.ctx.setLineDash([g,m])),s===3?(this.ctx.lineCap="round",this.ctx.lineWidth=A):this.ctx.lineWidth=A*2+1.1,this.ctx.strokeStyle=kt(t),this.ctx.stroke(),this.ctx.setLineDash([]),s===2&&(LA(o[0])&&(b=o[3],y=o[0],this.ctx.beginPath(),this.formatPath([new fe(b.end.x,b.end.y),new fe(y.start.x,y.start.y)]),this.ctx.stroke()),LA(o[1])&&(b=o[1],y=o[2],this.ctx.beginPath(),this.formatPath([new fe(b.end.x,b.end.y),new fe(y.start.x,y.start.y)]),this.ctx.stroke())),this.ctx.restore(),[2]})})},e.prototype.render=function(t){return uA(this,void 0,void 0,function(){var A;return rA(this,function(i){switch(i.label){case 0:return this.options.backgroundColor&&(this.ctx.fillStyle=kt(this.options.backgroundColor),this.ctx.fillRect(this.options.x,this.options.y,this.options.width,this.options.height)),A=tb(t),[4,this.renderStack(A)];case 1:return i.sent(),this.applyEffects([]),[2,this.canvas]}})})},e})(Im),hb=function(n){return n instanceof pm||n instanceof dm?!0:n instanceof Ef&&n.type!==yo&&n.type!==Eo},db=function(n,e){switch(n){case 0:return Mo(e);case 2:return JM(e);case 1:default:return bo(e)}},pb=function(n){switch(n){case 1:return"center";case 2:return"right";case 0:default:return"left"}},gb=["-apple-system","system-ui"],mb=function(n){return/iPhone OS 15_(0|1)/.test(window.navigator.userAgent)?n.filter(function(e){return gb.indexOf(e)===-1}):n},Bb=(function(n){$A(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),i.options=A,i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px",i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized ("+A.width+"x"+A.height+" at "+A.x+","+A.y+") with scale "+A.scale),i}return e.prototype.render=function(t){return uA(this,void 0,void 0,function(){var A,i;return rA(this,function(r){switch(r.label){case 0:return A=Ru(this.options.width*this.options.scale,this.options.height*this.options.scale,this.options.scale,this.options.scale,t),[4,vb(A)];case 1:return i=r.sent(),this.options.backgroundColor&&(this.ctx.fillStyle=kt(this.options.backgroundColor),this.ctx.fillRect(0,0,this.options.width*this.options.scale,this.options.height*this.options.scale)),this.ctx.drawImage(i,-this.options.x*this.options.scale,-this.options.y*this.options.scale),[2,this.canvas]}})})},e})(Im),vb=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},wb=(function(){function n(e){var t=e.id,A=e.enabled;this.id=t,this.enabled=A,this.start=Date.now()}return n.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.debug=="function"?console.debug.apply(console,ga([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.getTime=function(){return Date.now()-this.start},n.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&typeof window<"u"&&window.console&&typeof console.info=="function"&&console.info.apply(console,ga([this.id,this.getTime()+"ms"],e))},n.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.warn=="function"?console.warn.apply(console,ga([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.error=="function"?console.error.apply(console,ga([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.instances={},n})(),Cb=(function(){function n(e,t){var A;this.windowBounds=t,this.instanceName="#"+n.instanceCount++,this.logger=new wb({id:this.instanceName,enabled:e.logging}),this.cache=(A=e.cache)!==null&&A!==void 0?A:new GM(this,e)}return n.instanceCount=1,n})(),xb=function(n,e){return e===void 0&&(e={}),_b(n,e)};typeof window<"u"&&Sm.setContext(window);var _b=function(n,e){return uA(void 0,void 0,void 0,function(){var t,A,i,r,s,a,o,l,c,u,f,p,g,m,d,h,B,w,C,b,M,y,M,R,E,x,L,z,D,O,Z,V,q,X,re,ae,he,Ie,Oe,J;return rA(this,function(ee){switch(ee.label){case 0:if(!n||typeof n!="object")return[2,Promise.reject("Invalid element provided as first argument")];if(t=n.ownerDocument,!t)throw new Error("Element is not attached to a Document");if(A=t.defaultView,!A)throw new Error("Document is not attached to a Window");return i={allowTaint:(R=e.allowTaint)!==null&&R!==void 0?R:!1,imageTimeout:(E=e.imageTimeout)!==null&&E!==void 0?E:15e3,proxy:e.proxy,useCORS:(x=e.useCORS)!==null&&x!==void 0?x:!1},r=wu({logging:(L=e.logging)!==null&&L!==void 0?L:!0,cache:e.cache},i),s={windowWidth:(z=e.windowWidth)!==null&&z!==void 0?z:A.innerWidth,windowHeight:(D=e.windowHeight)!==null&&D!==void 0?D:A.innerHeight,scrollX:(O=e.scrollX)!==null&&O!==void 0?O:A.pageXOffset,scrollY:(Z=e.scrollY)!==null&&Z!==void 0?Z:A.pageYOffset},a=new Sn(s.scrollX,s.scrollY,s.windowWidth,s.windowHeight),o=new Cb(r,a),l=(V=e.foreignObjectRendering)!==null&&V!==void 0?V:!1,c={allowTaint:(q=e.allowTaint)!==null&&q!==void 0?q:!1,onclone:e.onclone,ignoreElements:e.ignoreElements,inlineImages:l,copyStyles:l},o.logger.debug("Starting document clone with size "+a.width+"x"+a.height+" scrolled to "+-a.left+","+-a.top),u=new tp(o,n,c),f=u.clonedReferenceElement,f?[4,u.toIFrame(t,a)]:[2,Promise.reject("Unable to find element in cloned iframe")];case 1:return p=ee.sent(),g=yf(f)||EM(f)?eE(f.ownerDocument):el(o,f),m=g.width,d=g.height,h=g.left,B=g.top,w=Eb(o,f,e.backgroundColor),C={canvas:e.canvas,backgroundColor:w,scale:(re=(X=e.scale)!==null&&X!==void 0?X:A.devicePixelRatio)!==null&&re!==void 0?re:1,x:((ae=e.x)!==null&&ae!==void 0?ae:0)+h,y:((he=e.y)!==null&&he!==void 0?he:0)+B,width:(Ie=e.width)!==null&&Ie!==void 0?Ie:Math.ceil(m),height:(Oe=e.height)!==null&&Oe!==void 0?Oe:Math.ceil(d)},l?(o.logger.debug("Document cloned, using foreign object rendering"),M=new Bb(o,C),[4,M.render(f)]):[3,3];case 2:return b=ee.sent(),[3,5];case 3:return o.logger.debug("Document cloned, element located at "+h+","+B+" with size "+m+"x"+d+" using computed rendering"),o.logger.debug("Starting DOM parsing"),y=Bm(o,f),w===y.styles.backgroundColor&&(y.styles.backgroundColor=yn.TRANSPARENT),o.logger.debug("Starting renderer for element at "+C.x+","+C.y+" with size "+C.width+"x"+C.height),M=new fb(o,C),[4,M.render(y)];case 4:b=ee.sent(),ee.label=5;case 5:return(!((J=e.removeContainer)!==null&&J!==void 0)||J)&&(tp.destroy(p)||o.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")),o.logger.debug("Finished rendering"),[2,b]}})})},Eb=function(n,e,t){var A=e.ownerDocument,i=A.documentElement?hs(n,getComputedStyle(A.documentElement).backgroundColor):yn.TRANSPARENT,r=A.body?hs(n,getComputedStyle(A.body).backgroundColor):yn.TRANSPARENT,s=typeof t=="string"?hs(n,t):t===null?yn.TRANSPARENT:4294967295;return e===A.documentElement?Jn(i)?Jn(r)?s:r:i:s};function yb(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Sf(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return n;if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return new Uint8Array(n.buffer,n.byteOffset,n.byteLength);throw new Error("Unknown type, must be binary type")}function Sb(n){return new TextEncoder().encode(n)}function Ub(n){return new TextDecoder().decode(n)}function Mb(n,e){if(n.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),A=0;A<t.length;A++)t[A]=255;for(var i=0;i<n.length;i++){var r=n.charAt(i),s=r.charCodeAt(0);if(t[s]!==255)throw new TypeError(r+" is ambiguous");t[s]=i}var a=n.length,o=n.charAt(0),l=Math.log(a)/Math.log(256),c=Math.log(256)/Math.log(a);function u(g){if(g instanceof Uint8Array||(ArrayBuffer.isView(g)?g=new Uint8Array(g.buffer,g.byteOffset,g.byteLength):Array.isArray(g)&&(g=Uint8Array.from(g))),!(g instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(g.length===0)return"";for(var m=0,d=0,h=0,B=g.length;h!==B&&g[h]===0;)h++,m++;for(var w=(B-h)*c+1>>>0,C=new Uint8Array(w);h!==B;){for(var b=g[h],y=0,M=w-1;(b!==0||y<d)&&M!==-1;M--,y++)b+=256*C[M]>>>0,C[M]=b%a>>>0,b=b/a>>>0;if(b!==0)throw new Error("Non-zero carry");d=y,h++}for(var R=w-d;R!==w&&C[R]===0;)R++;for(var E=o.repeat(m);R<w;++R)E+=n.charAt(C[R]);return E}function f(g){if(typeof g!="string")throw new TypeError("Expected String");if(g.length===0)return new Uint8Array;var m=0;if(g[m]!==" "){for(var d=0,h=0;g[m]===o;)d++,m++;for(var B=(g.length-m)*l+1>>>0,w=new Uint8Array(B);g[m];){var C=t[g.charCodeAt(m)];if(C===255)return;for(var b=0,y=B-1;(C!==0||b<h)&&y!==-1;y--,b++)C+=a*w[y]>>>0,w[y]=C%256>>>0,C=C/256>>>0;if(C!==0)throw new Error("Non-zero carry");h=b,m++}if(g[m]!==" "){for(var M=B-h;M!==B&&w[M]===0;)M++;for(var R=new Uint8Array(d+(B-M)),E=d;M!==B;)R[E++]=w[M++];return R}}}function p(g){var m=f(g);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:u,decodeUnsafe:f,decode:p}}var bb=Mb,Fb=bb;class Tb{constructor(e,t,A){ye(this,"name");ye(this,"prefix");ye(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=A}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class Ib{constructor(e,t,A){ye(this,"name");ye(this,"prefix");ye(this,"baseDecode");ye(this,"prefixCodePoint");this.name=e,this.prefix=t;const i=t.codePointAt(0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=A}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Qm(this,e)}}class Qb{constructor(e){ye(this,"decoders");this.decoders=e}or(e){return Qm(this,e)}decode(e){const t=e[0],A=this.decoders[t];if(A!=null)return A.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Qm(n,e){return new Qb({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class Lb{constructor(e,t,A,i){ye(this,"name");ye(this,"prefix");ye(this,"baseEncode");ye(this,"baseDecode");ye(this,"encoder");ye(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=A,this.baseDecode=i,this.encoder=new Tb(e,t,A),this.decoder=new Ib(e,t,i)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function cl({name:n,prefix:e,encode:t,decode:A}){return new Lb(n,e,t,A)}function Ds({name:n,prefix:e,alphabet:t}){const{encode:A,decode:i}=Fb(t,n);return cl({prefix:e,name:n,encode:A,decode:r=>Sf(i(r))})}function Rb(n,e,t,A){let i=n.length;for(;n[i-1]==="=";)--i;const r=new Uint8Array(i*t/8|0);let s=0,a=0,o=0;for(let l=0;l<i;++l){const c=e[n[l]];if(c===void 0)throw new SyntaxError(`Non-${A} character`);a=a<<t|c,s+=t,s>=8&&(s-=8,r[o++]=255&a>>s)}if(s>=t||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return r}function Db(n,e,t){const A=e[e.length-1]==="=",i=(1<<t)-1;let r="",s=0,a=0;for(let o=0;o<n.length;++o)for(a=a<<8|n[o],s+=8;s>t;)s-=t,r+=e[i&a>>s];if(s!==0&&(r+=e[i&a<<t-s]),A)for(;(r.length*t&7)!==0;)r+="=";return r}function Pb(n){const e={};for(let t=0;t<n.length;++t)e[n[t]]=t;return e}function AA({name:n,prefix:e,bitsPerChar:t,alphabet:A}){const i=Pb(A);return cl({prefix:e,name:n,encode(r){return Db(r,A,t)},decode(r){return Rb(r,i,t,n)}})}const Cn=Ds({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Hb=Ds({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Nb=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Cn,base58flickr:Hb},Symbol.toStringTag,{value:"Module"})),wr=AA({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Ob=AA({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Gb=AA({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),Vb=AA({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),kb=AA({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),zb=AA({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Kb=AA({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Wb=AA({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),Xb=AA({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Yb=Object.freeze(Object.defineProperty({__proto__:null,base32:wr,base32hex:kb,base32hexpad:Kb,base32hexpadupper:Wb,base32hexupper:zb,base32pad:Gb,base32padupper:Vb,base32upper:Ob,base32z:Xb},Symbol.toStringTag,{value:"Module"})),ao=Ds({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Jb=Ds({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Zb=Object.freeze(Object.defineProperty({__proto__:null,base36:ao,base36upper:Jb},Symbol.toStringTag,{value:"Module"}));var qb=Lm,sp=128,jb=-128,$b=Math.pow(2,31);function Lm(n,e,t){e=e||[],t=t||0;for(var A=t;n>=$b;)e[t++]=n&255|sp,n/=128;for(;n&jb;)e[t++]=n&255|sp,n>>>=7;return e[t]=n|0,Lm.bytes=t-A+1,e}var eF=Vu,tF=128,ap=127;function Vu(n,A){var t=0,A=A||0,i=0,r=A,s,a=n.length;do{if(r>=a)throw Vu.bytes=0,new RangeError("Could not decode varint");s=n[r++],t+=i<28?(s&ap)<<i:(s&ap)*Math.pow(2,i),i+=7}while(s>=tF);return Vu.bytes=r-A,t}var AF=Math.pow(2,7),nF=Math.pow(2,14),iF=Math.pow(2,21),rF=Math.pow(2,28),sF=Math.pow(2,35),aF=Math.pow(2,42),oF=Math.pow(2,49),lF=Math.pow(2,56),cF=Math.pow(2,63),uF=function(n){return n<AF?1:n<nF?2:n<iF?3:n<rF?4:n<sF?5:n<aF?6:n<oF?7:n<lF?8:n<cF?9:10},fF={encode:qb,decode:eF,encodingLength:uF},To=fF;function ku(n,e=0){return[To.decode(n,e),To.decode.bytes]}function Io(n,e,t=0){return To.encode(n,e,t),e}function Qo(n){return To.encodingLength(n)}function hF(n,e){const t=e.byteLength,A=Qo(n),i=A+Qo(t),r=new Uint8Array(i+t);return Io(n,r,0),Io(t,r,A),r.set(e,i),new Uf(n,t,e,r)}function dF(n){const e=Sf(n),[t,A]=ku(e),[i,r]=ku(e.subarray(A)),s=e.subarray(A+r);if(s.byteLength!==i)throw new Error("Incorrect length");return new Uf(t,i,s,e)}function pF(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&yb(n.bytes,t.bytes)}}class Uf{constructor(e,t,A,i){ye(this,"code");ye(this,"size");ye(this,"digest");ye(this,"bytes");this.code=e,this.size=t,this.digest=A,this.bytes=i}}function op(n,e){const{bytes:t,version:A}=n;switch(A){case 0:return mF(t,zu(n),e??Cn.encoder);default:return BF(t,zu(n),e??wr.encoder)}}const lp=new WeakMap;function zu(n){const e=lp.get(n);if(e==null){const t=new Map;return lp.set(n,t),t}return e}var kp;class Yt{constructor(e,t,A,i){ye(this,"code");ye(this,"version");ye(this,"multihash");ye(this,"bytes");ye(this,"/");ye(this,kp,"CID");this.code=t,this.version=e,this.multihash=A,this.bytes=i,this["/"]=i}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Jr)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==vF)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return Yt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,A=hF(e,t);return Yt.createV1(this.code,A)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return Yt.equals(this,e)}static equals(e,t){const A=t;return A!=null&&e.code===A.code&&e.version===A.version&&pF(e.multihash,A.multihash)}toString(e){return op(this,e)}toJSON(){return{"/":op(this)}}link(){return this}[(kp=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Yt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:A,code:i,multihash:r,bytes:s}=t;return new Yt(A,i,r,s??cp(A,i,r.bytes))}else if(t[wF]===!0){const{version:A,multihash:i,code:r}=t,s=dF(i);return Yt.create(A,r,s)}else return null}static create(e,t,A){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(A.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Jr)throw new Error(`Version 0 CID must use dag-pb (code: ${Jr}) block encoding`);return new Yt(e,t,A,A.bytes)}case 1:{const i=cp(e,t,A.bytes);return new Yt(e,t,A,i)}default:throw new Error("Invalid version")}}static createV0(e){return Yt.create(0,Jr,e)}static createV1(e,t){return Yt.create(1,e,t)}static decode(e){const[t,A]=Yt.decodeFirst(e);if(A.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Yt.inspectBytes(e),A=t.size-t.multihashSize,i=Sf(e.subarray(A,A+t.multihashSize));if(i.byteLength!==t.multihashSize)throw new Error("Incorrect length");const r=i.subarray(t.multihashSize-t.digestSize),s=new Uf(t.multihashCode,t.digestSize,r,i);return[t.version===0?Yt.createV0(s):Yt.createV1(t.codec,s),e.subarray(t.size)]}static inspectBytes(e){let t=0;const A=()=>{const[u,f]=ku(e.subarray(t));return t+=f,u};let i=A(),r=Jr;if(i===18?(i=0,t=0):r=A(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=t,a=A(),o=A(),l=t+o,c=l-s;return{version:i,codec:r,multihashCode:a,digestSize:o,multihashSize:c,size:l}}static parse(e,t){const[A,i]=gF(e,t),r=Yt.decode(i);if(r.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return zu(r).set(A,e),r}}function gF(n,e){switch(n[0]){case"Q":{const t=e??Cn;return[Cn.prefix,t.decode(`${Cn.prefix}${n}`)]}case Cn.prefix:{const t=e??Cn;return[Cn.prefix,t.decode(n)]}case wr.prefix:{const t=e??wr;return[wr.prefix,t.decode(n)]}case ao.prefix:{const t=e??ao;return[ao.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function mF(n,e,t){const{prefix:A}=t;if(A!==Cn.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const i=e.get(A);if(i==null){const r=t.encode(n).slice(1);return e.set(A,r),r}else return i}function BF(n,e,t){const{prefix:A}=t,i=e.get(A);if(i==null){const r=t.encode(n);return e.set(A,r),r}else return i}const Jr=112,vF=18;function cp(n,e,t){const A=Qo(n),i=A+Qo(e),r=new Uint8Array(i+t.byteLength);return Io(n,r,0),Io(e,r,A),r.set(t,i),r}const wF=Symbol.for("@ipld/js-cid/CID");function Ku(n=0){return new Uint8Array(n)}function Es(n=0){return new Uint8Array(n)}function Rm(n,e){e==null&&(e=n.reduce((i,r)=>i+r.length,0));const t=Es(e);let A=0;for(const i of n)t.set(i,A),A+=i.length;return t}const CF=Ds({prefix:"9",name:"base10",alphabet:"0123456789"}),xF=Object.freeze(Object.defineProperty({__proto__:null,base10:CF},Symbol.toStringTag,{value:"Module"})),_F=AA({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),EF=AA({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),yF=Object.freeze(Object.defineProperty({__proto__:null,base16:_F,base16upper:EF},Symbol.toStringTag,{value:"Module"})),SF=AA({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),UF=Object.freeze(Object.defineProperty({__proto__:null,base2:SF},Symbol.toStringTag,{value:"Module"})),Dm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),MF=Dm.reduce((n,e,t)=>(n[t]=e,n),[]),bF=Dm.reduce((n,e,t)=>{const A=e.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${e}`);return n[A]=t,n},[]);function FF(n){return n.reduce((e,t)=>(e+=MF[t],e),"")}function TF(n){const e=[];for(const t of n){const A=t.codePointAt(0);if(A==null)throw new Error(`Invalid character: ${t}`);const i=bF[A];if(i==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(i)}return new Uint8Array(e)}const IF=cl({prefix:"🚀",name:"base256emoji",encode:FF,decode:TF}),QF=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:IF},Symbol.toStringTag,{value:"Module"})),LF=AA({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),RF=AA({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Pm=AA({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),DF=AA({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),PF=Object.freeze(Object.defineProperty({__proto__:null,base64:LF,base64pad:RF,base64url:Pm,base64urlpad:DF},Symbol.toStringTag,{value:"Module"})),HF=AA({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),NF=Object.freeze(Object.defineProperty({__proto__:null,base8:HF},Symbol.toStringTag,{value:"Module"})),OF=cl({prefix:"\0",name:"identity",encode:n=>Ub(n),decode:n=>Sb(n)}),GF=Object.freeze(Object.defineProperty({__proto__:null,identity:OF},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Wu={...GF,...UF,...NF,...xF,...yF,...Yb,...Zb,...Nb,...PF,...QF};function Hm(n,e,t,A){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:A}}}const up=Hm("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),gc=Hm("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Es(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Nm={utf8:up,"utf-8":up,hex:Wu.base16,latin1:gc,ascii:gc,binary:gc,...Wu};function Mf(n,e="utf8"){const t=Nm[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function Lo(n,e="utf8"){const t=Nm[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}const VF=Math.pow(2,7),kF=Math.pow(2,14),zF=Math.pow(2,21),Om=Math.pow(2,28),Gm=Math.pow(2,35),Vm=Math.pow(2,42),km=Math.pow(2,49),fA=128,Rn=127;function bf(n){if(n<VF)return 1;if(n<kF)return 2;if(n<zF)return 3;if(n<Om)return 4;if(n<Gm)return 5;if(n<Vm)return 6;if(n<km)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function KF(n,e,t=0){switch(bf(n)){case 8:e[t++]=n&255|fA,n/=128;case 7:e[t++]=n&255|fA,n/=128;case 6:e[t++]=n&255|fA,n/=128;case 5:e[t++]=n&255|fA,n/=128;case 4:e[t++]=n&255|fA,n>>>=7;case 3:e[t++]=n&255|fA,n>>>=7;case 2:e[t++]=n&255|fA,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function WF(n,e){let t=n[e],A=0;if(A+=t&Rn,t<fA||(t=n[e+1],A+=(t&Rn)<<7,t<fA)||(t=n[e+2],A+=(t&Rn)<<14,t<fA)||(t=n[e+3],A+=(t&Rn)<<21,t<fA)||(t=n[e+4],A+=(t&Rn)*Om,t<fA)||(t=n[e+5],A+=(t&Rn)*Gm,t<fA)||(t=n[e+6],A+=(t&Rn)*Vm,t<fA)||(t=n[e+7],A+=(t&Rn)*km,t<fA))return A;throw new RangeError("Could not decode varint")}const Ff=new Float32Array([-0]),Kn=new Uint8Array(Ff.buffer);function XF(n,e,t){Ff[0]=n,e[t]=Kn[0],e[t+1]=Kn[1],e[t+2]=Kn[2],e[t+3]=Kn[3]}function YF(n,e){return Kn[0]=n[e],Kn[1]=n[e+1],Kn[2]=n[e+2],Kn[3]=n[e+3],Ff[0]}const Tf=new Float64Array([-0]),sA=new Uint8Array(Tf.buffer);function JF(n,e,t){Tf[0]=n,e[t]=sA[0],e[t+1]=sA[1],e[t+2]=sA[2],e[t+3]=sA[3],e[t+4]=sA[4],e[t+5]=sA[5],e[t+6]=sA[6],e[t+7]=sA[7]}function ZF(n,e){return sA[0]=n[e],sA[1]=n[e+1],sA[2]=n[e+2],sA[3]=n[e+3],sA[4]=n[e+4],sA[5]=n[e+5],sA[6]=n[e+6],sA[7]=n[e+7],Tf[0]}const qF=BigInt(Number.MAX_SAFE_INTEGER),jF=BigInt(Number.MIN_SAFE_INTEGER);class oA{constructor(e,t){ye(this,"lo");ye(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(t+A*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let A=~this.hi>>>0;return t===0&&(A=A+1>>>0),-(BigInt(t)+(BigInt(A)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,A=this.hi>>>24;return A===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:A<128?9:10}static fromBigInt(e){if(e===0n)return xi;if(e<qF&&e>jF)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let A=e>>32n,i=e-(A<<32n);return t&&(A=~A|0n,i=~i|0n,++i>fp&&(i=0n,++A>fp&&(A=0n))),new oA(Number(i),Number(A))}static fromNumber(e){if(e===0)return xi;const t=e<0;t&&(e=-e);let A=e>>>0,i=(e-A)/4294967296>>>0;return t&&(i=~i>>>0,A=~A>>>0,++A>4294967295&&(A=0,++i>4294967295&&(i=0))),new oA(A,i)}static from(e){return typeof e=="number"?oA.fromNumber(e):typeof e=="bigint"?oA.fromBigInt(e):typeof e=="string"?oA.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new oA(e.low>>>0,e.high>>>0):xi}}const xi=new oA(0,0);xi.toBigInt=function(){return 0n};xi.zzEncode=xi.zzDecode=function(){return this};xi.length=function(){return 1};const fp=4294967296n;function $F(n){let e=0,t=0;for(let A=0;A<n.length;++A)t=n.charCodeAt(A),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(A+1)&64512)===56320?(++A,e+=4):e+=3;return e}function eT(n,e,t){if(t-e<1)return"";let i;const r=[];let s=0,a;for(;e<t;)a=n[e++],a<128?r[s++]=a:a>191&&a<224?r[s++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,r[s++]=55296+(a>>10),r[s++]=56320+(a&1023)):r[s++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,s>8191&&((i??(i=[])).push(String.fromCharCode.apply(String,r)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,r.slice(0,s))),i.join("")):String.fromCharCode.apply(String,r.slice(0,s))}function zm(n,e,t){const A=t;let i,r;for(let s=0;s<n.length;++s)i=n.charCodeAt(s),i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&((r=n.charCodeAt(s+1))&64512)===56320?(i=65536+((i&1023)<<10)+(r&1023),++s,e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128);return t-A}function WA(n,e){return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function Na(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class tT{constructor(e){ye(this,"buf");ye(this,"pos");ye(this,"len");ye(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,WA(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw WA(this,4);return Na(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw WA(this,4);return Na(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw WA(this,4);const e=YF(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw WA(this,4);const e=ZF(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,A=this.pos+e;if(A>this.len)throw WA(this,e);return this.pos+=e,t===A?new Uint8Array(0):this.buf.subarray(t,A)}string(){const e=this.bytes();return eT(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw WA(this,e);this.pos+=e}else do if(this.pos>=this.len)throw WA(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new oA(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw WA(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw WA(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw WA(this,8);const e=Na(this.buf,this.pos+=4),t=Na(this.buf,this.pos+=4);return new oA(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=WF(this.buf,this.pos);return this.pos+=bf(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function AT(n){return new tT(n instanceof Uint8Array?n:n.subarray())}function If(n,e,t){const A=AT(n);return e.decode(A,void 0,t)}function nT(n){let A,i=8192;return function(s){if(s<1||s>4096)return Es(s);i+s>8192&&(A=Es(8192),i=0);const a=A.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class os{constructor(e,t,A){ye(this,"fn");ye(this,"len");ye(this,"next");ye(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=A}}function mc(){}class iT{constructor(e){ye(this,"head");ye(this,"tail");ye(this,"len");ye(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const rT=nT();function sT(n){return globalThis.Buffer!=null?Es(n):rT(n)}class Xu{constructor(){ye(this,"len");ye(this,"head");ye(this,"tail");ye(this,"states");this.len=0,this.head=new os(mc,0,0),this.tail=this.head,this.states=null}_push(e,t,A){return this.tail=this.tail.next=new os(e,t,A),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new oT((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Oa,10,oA.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=oA.fromBigInt(e);return this._push(Oa,t.length(),t)}uint64Number(e){return this._push(KF,bf(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=oA.fromBigInt(e).zzEncode();return this._push(Oa,t.length(),t)}sint64Number(e){const t=oA.fromNumber(e).zzEncode();return this._push(Oa,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Bc,1,e?1:0)}fixed32(e){return this._push(Zr,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=oA.fromBigInt(e);return this._push(Zr,4,t.lo)._push(Zr,4,t.hi)}fixed64Number(e){const t=oA.fromNumber(e);return this._push(Zr,4,t.lo)._push(Zr,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(XF,4,e)}double(e){return this._push(JF,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(Bc,1,0):this.uint32(t)._push(lT,t,e)}string(e){const t=$F(e);return t!==0?this.uint32(t)._push(zm,t,e):this._push(Bc,1,0)}fork(){return this.states=new iT(this),this.head=this.tail=new os(mc,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new os(mc,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,A=this.len;return this.reset().uint32(A),A!==0&&(this.tail.next=e.next,this.tail=t,this.len+=A),this}finish(){let e=this.head.next;const t=sT(this.len);let A=0;for(;e!=null;)e.fn(e.val,t,A),A+=e.len,e=e.next;return t}}function Bc(n,e,t){e[t]=n&255}function aT(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class oT extends os{constructor(t,A){super(aT,t,A);ye(this,"next");this.next=void 0}}function Oa(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Zr(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function lT(n,e,t){e.set(n,t)}globalThis.Buffer!=null&&(Xu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(cT,e,n),this},Xu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(uT,e,n),this});function cT(n,e,t){e.set(n,t)}function uT(n,e,t){n.length<40?zm(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(Mf(n),t)}function fT(){return new Xu}function Qf(n,e){const t=fT();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}var Yu;(function(n){n[n.VARINT=0]="VARINT",n[n.BIT64=1]="BIT64",n[n.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",n[n.START_GROUP=3]="START_GROUP",n[n.END_GROUP=4]="END_GROUP",n[n.BIT32=5]="BIT32"})(Yu||(Yu={}));function hT(n,e,t,A){return{name:n,type:e,encode:t,decode:A}}function Lf(n,e){return hT("message",Yu.LENGTH_DELIMITED,n,e)}class Ju extends Error{constructor(){super(...arguments);ye(this,"code","ERR_MAX_LENGTH");ye(this,"name","MaxLengthError")}}class dT{constructor(){ye(this,"index",0);ye(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,A=e();return A===void 0&&(this.index=t),A}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,A){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return A()})}readNumber(e,t,A,i){return this.readAtomically(()=>{let r=0,s=0;const a=this.peekChar();if(a===void 0)return;const o=a==="0",l=2**(8*i)-1;for(;;){const c=this.readAtomically(()=>{const u=this.readChar();if(u===void 0)return;const f=Number.parseInt(u,e);if(!Number.isNaN(f))return f});if(c===void 0)break;if(r*=e,r+=c,r>l||(s+=1,t!==void 0&&s>t))return}if(s!==0)return!A&&o&&s>1?void 0:r})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const A=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(A===void 0)return;e[t]=A}return e})}readIPv6Addr(){const e=t=>{for(let A=0;A<t.length/2;A++){const i=A*2;if(A<t.length-3){const s=this.readSeparator(":",A,()=>this.readIPv4Addr());if(s!==void 0)return t[i]=s[0],t[i+1]=s[1],t[i+2]=s[2],t[i+3]=s[3],[i+4,!0]}const r=this.readSeparator(":",A,()=>this.readNumber(16,4,!0,2));if(r===void 0)return[i,!1];t[i]=r>>8,t[i+1]=r&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[A,i]=e(t);if(A===16)return t;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const r=new Uint8Array(14),s=16-(A+2),[a]=e(r.subarray(0,s));return t.set(r.subarray(0,a),16-a),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const pT=45,gT=15,Ro=new dT;function mT(n){if(!(n.length>gT))return Ro.new(n).parseWith(()=>Ro.readIPv4Addr())}function BT(n){if(n.includes("%")&&(n=n.split("%")[0]),!(n.length>pT))return Ro.new(n).parseWith(()=>Ro.readIPv6Addr())}function Km(n){return!!mT(n)}function vT(n){return!!BT(n)}class Fi extends Error{constructor(){super(...arguments);ye(this,"name","InvalidMultiaddrError")}}ye(Fi,"name","InvalidMultiaddrError");class Fr extends Error{constructor(){super(...arguments);ye(this,"name","ValidationError")}}ye(Fr,"name","ValidationError");class Wm extends Error{constructor(){super(...arguments);ye(this,"name","UnknownProtocolError")}}ye(Wm,"name","UnknownProtocolError");const wT=4,CT=6,xT=273,_T=33,ET=41,yT=42,ST=43,UT=53,MT=54,bT=55,FT=56,TT=132,IT=301,QT=302,LT=400,RT=421,DT=444,PT=445,HT=446,NT=447,OT=448,GT=449,VT=454,kT=460,zT=461,KT=465,WT=466,XT=480,YT=481,JT=443,ZT=477,qT=478,jT=479,$T=277,e1=275,t1=276,A1=280,n1=281,i1=290,r1=777;function hp(n){return e=>Lo(e,n)}function dp(n){return e=>Mf(e,n)}function ls(n){return new DataView(n.buffer).getUint16(n.byteOffset).toString()}function dr(n){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof n=="string"?parseInt(n):n),new Uint8Array(e)}function s1(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=Mf(e[0],"base32"),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=dr(A);return Rm([t,i],t.length+i.length)}function a1(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=wr.decode(`b${e[0]}`),A=parseInt(e[1],10);if(A<1||A>65536)throw new Error("Port number is not in range(1, 65536)");const i=dr(A);return Rm([t,i],t.length+i.length)}function pp(n){const e=n.subarray(0,n.length-2),t=n.subarray(n.length-2),A=Lo(e,"base32"),i=ls(t);return`${A}:${i}`}const Xm=function(n){n=n.toString().trim();const e=new Uint8Array(4);return n.split(/\./g).forEach((t,A)=>{const i=parseInt(t,10);if(isNaN(i)||i<0||i>255)throw new Fi("Invalid byte value in IP address");e[A]=i}),e},o1=function(n){let e=0;n=n.toString().trim();const t=n.split(":",8);let A;for(A=0;A<t.length;A++){const r=Km(t[A]);let s;r&&(s=Xm(t[A]),t[A]=Lo(s.subarray(0,2),"base16")),s!=null&&++A<8&&t.splice(A,0,Lo(s.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(A=0;A<t.length&&t[A]!=="";A++);const r=[A,1];for(A=9-t.length;A>0;A--)r.push("0");t.splice.apply(t,r)}const i=new Uint8Array(e+16);for(A=0;A<t.length;A++){t[A]===""&&(t[A]="0");const r=parseInt(t[A],16);if(isNaN(r)||r<0||r>65535)throw new Fi("Invalid byte value in IP address");i[e++]=r>>8&255,i[e++]=r&255}return i},l1=function(n){if(n.byteLength!==4)throw new Fi("IPv4 address was incorrect length");const e=[];for(let t=0;t<n.byteLength;t++)e.push(n[t]);return e.join(".")},c1=function(n){if(n.byteLength!==16)throw new Fi("IPv6 address was incorrect length");const e=[];for(let A=0;A<n.byteLength;A+=2){const i=n[A],r=n[A+1],s=`${i.toString(16).padStart(2,"0")}${r.toString(16).padStart(2,"0")}`;e.push(s)}const t=e.join(":");try{const A=new URL(`http://[${t}]`);return A.hostname.substring(1,A.hostname.length-1)}catch{throw new Fi(`Invalid IPv6 address "${t}"`)}};function u1(n){try{const e=new URL(`http://[${n}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new Fi(`Invalid IPv6 address "${n}"`)}}const vc=Object.values(Wu).map(n=>n.decoder),f1=(function(){let n=vc[0].or(vc[1]);return vc.slice(2).forEach(e=>n=n.or(e)),n})();function h1(n){return f1.decode(n)}function d1(n){return e=>n.encoder.encode(e)}function p1(n){if(parseInt(n).toString()!==n)throw new Fr("Value must be an integer")}function g1(n){if(n<0)throw new Fr("Value must be a positive integer, or zero")}function m1(n){return e=>{if(e>n)throw new Fr(`Value must be smaller than or equal to ${n}`)}}function B1(...n){return e=>{for(const t of n)t(e)}}const Ga=B1(p1,g1,m1(65535)),CA=-1;class v1{constructor(){ye(this,"protocolsByCode",new Map);ye(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new Wm(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(A=>{this.protocolsByName.set(A,e)})}removeProtocol(e){var A;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(A=t.aliases)==null||A.forEach(i=>{this.protocolsByName.delete(i)}))}}const w1=new v1,C1=[{code:wT,name:"ip4",size:32,valueToBytes:Xm,bytesToValue:l1,validate:n=>{if(!Km(n))throw new Fr(`Invalid IPv4 address "${n}"`)}},{code:CT,name:"tcp",size:16,valueToBytes:dr,bytesToValue:ls,validate:Ga},{code:xT,name:"udp",size:16,valueToBytes:dr,bytesToValue:ls,validate:Ga},{code:_T,name:"dccp",size:16,valueToBytes:dr,bytesToValue:ls,validate:Ga},{code:ET,name:"ip6",size:128,valueToBytes:o1,bytesToValue:c1,stringToValue:u1,validate:n=>{if(!vT(n))throw new Fr(`Invalid IPv6 address "${n}"`)}},{code:yT,name:"ip6zone",size:CA},{code:ST,name:"ipcidr",size:8,bytesToValue:hp("base10"),valueToBytes:dp("base10")},{code:UT,name:"dns",size:CA},{code:MT,name:"dns4",size:CA},{code:bT,name:"dns6",size:CA},{code:FT,name:"dnsaddr",size:CA},{code:TT,name:"sctp",size:16,valueToBytes:dr,bytesToValue:ls,validate:Ga},{code:IT,name:"udt"},{code:QT,name:"utp"},{code:LT,name:"unix",size:CA,stringToValue:n=>decodeURIComponent(n),valueToString:n=>encodeURIComponent(n)},{code:RT,name:"p2p",aliases:["ipfs"],size:CA,bytesToValue:hp("base58btc"),valueToBytes:n=>n.startsWith("Q")||n.startsWith("1")?dp("base58btc")(n):Yt.parse(n).multihash.bytes},{code:DT,name:"onion",size:96,bytesToValue:pp,valueToBytes:s1},{code:PT,name:"onion3",size:296,bytesToValue:pp,valueToBytes:a1},{code:HT,name:"garlic64",size:CA},{code:NT,name:"garlic32",size:CA},{code:OT,name:"tls"},{code:GT,name:"sni",size:CA},{code:VT,name:"noise"},{code:kT,name:"quic"},{code:zT,name:"quic-v1"},{code:KT,name:"webtransport"},{code:WT,name:"certhash",size:CA,bytesToValue:d1(Pm),valueToBytes:h1},{code:XT,name:"http"},{code:YT,name:"http-path",size:CA,stringToValue:n=>`/${decodeURIComponent(n)}`,valueToString:n=>encodeURIComponent(n.substring(1))},{code:JT,name:"https"},{code:ZT,name:"ws"},{code:qT,name:"wss"},{code:jT,name:"p2p-websocket-star"},{code:$T,name:"p2p-stardust"},{code:e1,name:"p2p-webrtc-star"},{code:t1,name:"p2p-webrtc-direct"},{code:A1,name:"webrtc-direct"},{code:n1,name:"webrtc"},{code:i1,name:"p2p-circuit"},{code:r1,name:"memory",size:CA}];C1.forEach(n=>{w1.addProtocol(n)});var zp,Kp;(Kp=(zp=globalThis.process)==null?void 0:zp.env)!=null&&Kp.DUMP_SESSION_KEYS;var Do;(function(n){let e;n.codec=()=>(e==null&&(e=Lf((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.webtransportCerthashes!=null)for(const r of t.webtransportCerthashes)A.uint32(10),A.bytes(r);if(t.streamMuxers!=null)for(const r of t.streamMuxers)A.uint32(18),A.string(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a,o;const r={webtransportCerthashes:[],streamMuxers:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const l=t.uint32();switch(l>>>3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&r.webtransportCerthashes.length===i.limits.webtransportCerthashes)throw new Ju('Decode error - map field "webtransportCerthashes" had too many elements');r.webtransportCerthashes.push(t.bytes());break}case 2:{if(((o=i.limits)==null?void 0:o.streamMuxers)!=null&&r.streamMuxers.length===i.limits.streamMuxers)throw new Ju('Decode error - map field "streamMuxers" had too many elements');r.streamMuxers.push(t.string());break}default:{t.skipType(l&7);break}}}return r})),e),n.encode=t=>Qf(t,n.codec()),n.decode=(t,A)=>If(t,n.codec(),A)})(Do||(Do={}));var gp;(function(n){let e;n.codec=()=>(e==null&&(e=Lf((t,A,i={})=>{i.lengthDelimited!==!1&&A.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(A.uint32(10),A.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(A.uint32(18),A.bytes(t.identitySig)),t.extensions!=null&&(A.uint32(34),Do.codec().encode(t.extensions,A)),i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={identityKey:Ku(0),identitySig:Ku(0)},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.identityKey=t.bytes();break}case 2:{r.identitySig=t.bytes();break}case 4:{r.extensions=Do.codec().decode(t,t.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>Qf(t,n.codec()),n.decode=(t,A)=>If(t,n.codec(),A)})(gp||(gp={}));var mp;(function(n){n[n.Data=0]="Data",n[n.WindowUpdate=1]="WindowUpdate",n[n.Ping=2]="Ping",n[n.GoAway=3]="GoAway"})(mp||(mp={}));var Zu;(function(n){n[n.SYN=1]="SYN",n[n.ACK=2]="ACK",n[n.FIN=4]="FIN",n[n.RST=8]="RST"})(Zu||(Zu={}));Object.values(Zu).filter(n=>typeof n!="string");var Bp;(function(n){n[n.NormalTermination=0]="NormalTermination",n[n.ProtocolError=1]="ProtocolError",n[n.InternalError=2]="InternalError"})(Bp||(Bp={}));var vp;(function(n){n[n.Init=0]="Init",n[n.SYNSent=1]="SYNSent",n[n.SYNReceived=2]="SYNReceived",n[n.Established=3]="Established",n[n.Finished=4]="Finished",n[n.Paused=5]="Paused"})(vp||(vp={}));var wp;(function(n){let e;n.codec=()=>(e==null&&(e=Lf((t,A,i={})=>{if(i.lengthDelimited!==!1&&A.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(A.uint32(10),A.bytes(t.publicKey)),t.addrs!=null)for(const r of t.addrs)A.uint32(18),A.bytes(r);i.lengthDelimited!==!1&&A.ldelim()},(t,A,i={})=>{var a;const r={publicKey:Ku(0),addrs:[]},s=A==null?t.len:t.pos+A;for(;t.pos<s;){const o=t.uint32();switch(o>>>3){case 1:{r.publicKey=t.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&r.addrs.length===i.limits.addrs)throw new Ju('Decode error - map field "addrs" had too many elements');r.addrs.push(t.bytes());break}default:{t.skipType(o&7);break}}}return r})),e),n.encode=t=>Qf(t,n.codec()),n.decode=(t,A)=>If(t,n.codec(),A)})(wp||(wp={}));new TextEncoder;new TextDecoder;const x1="modulepreload",_1=function(n,e){return new URL(n,e).href},Cp={},E1=function(e,t,A){let i=Promise.resolve();if(t&&t.length>0){let s=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=s(t.map(c=>{if(c=_1(c,A),c in Cp)return;Cp[c]=!0;const u=c.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!A)for(let m=a.length-1;m>=0;m--){const d=a[m];if(d.href===c&&(!u||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${f}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":x1,u||(g.as="script"),g.crossOrigin="",g.href=c,l&&g.setAttribute("nonce",l),document.head.appendChild(g),u)return new Promise((m,d)=>{g.addEventListener("load",m),g.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};class y1{constructor(e={}){const t=typeof navigator<"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4;this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,maxWorkers:e.maxWorkers||t,...e},this.workers=[],this.taskQueue=[],this.activeTasks=new Map,this.commitDeltaHandler=null,this.capabilities={cpu:!0,webgpu:!1},this.initialized=!1}setCommitDeltaHandler(e){this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.initialized)return;if(this.initialized=!0,!(typeof Worker<"u"&&this.config.enableWorkers)){console.warn("[ComputeManager] Web Workers not available; falling back to inline execution");return}const t=new URL("data:text/javascript;base64,LyogZXNsaW50LWRpc2FibGUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzICovCgpzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIChldmVudCkgPT4gewogIGNvbnN0IG1zZyA9IGV2ZW50LmRhdGE7CiAgaWYgKCFtc2cgfHwgbXNnLnR5cGUgIT09ICdydW4nKSByZXR1cm47CiAgY29uc3QgeyBpZCwgZGF0YSwgZm4sIG1vZHVsZSwgZXhwb3J0TmFtZSB9ID0gbXNnOwogIHRyeSB7CiAgICBsZXQgaGFuZGxlcjsKICAgIGlmIChmbikgewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMKICAgICAgaGFuZGxlciA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICgke2ZufSk7YCkoKTsKICAgIH0gZWxzZSBpZiAobW9kdWxlKSB7CiAgICAgIC8vIFNpbGVuY2Ugd2VicGFjaydzICJkZXBlbmRlbmN5IGlzIGFuIGV4cHJlc3Npb24iIHdhcm5pbmcgYnkgZXhwbGljaXRseSBpZ25vcmluZyBidW5kbGluZyBoZXJlLgogICAgICAvLyBUaGUgd29ya2VyIGV4cGVjdHMgYSByZWFsIFVSTCBzdHJpbmcgcGFzc2VkIGluIGZyb20gdGhlIG1haW4gdGhyZWFkLgogICAgICBjb25zdCBtb2QgPSBhd2FpdCBpbXBvcnQoCiAgICAgICAgLyogd2VicGFja0lnbm9yZTogdHJ1ZSAqLwogICAgICAgIG1vZHVsZQogICAgICApOwogICAgICBoYW5kbGVyID0gbW9kW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTsKICAgIH0KICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0hhbmRsZXIgbm90IGZvdW5kIGZvciB0YXNrJyk7CiAgICB9CiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKGRhdGEpOwogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXN1bHQnLCBpZCwgcmVzdWx0IH0pOwogIH0gY2F0Y2ggKGVycikgewogICAgc2VsZi5wb3N0TWVzc2FnZSh7IHR5cGU6ICdlcnJvcicsIGlkLCBlcnJvcjogZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpIH0pOwogIH0KfTsK",import.meta.url),A=Math.max(1,Math.min(this.config.maxWorkers,128));for(let i=0;i<A;i++){const r=new Worker(t,{type:"module"});r.onmessage=s=>this._handleWorkerMessage(r,s.data),r.onerror=s=>console.error("[ComputeManager] Worker error",s),this.workers.push(r)}}async submitTask(e){if(!e)throw new Error("Task is required");if(!e.fn&&!e.module)throw new Error("Task must provide fn or module");const t=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,A=e.id||t,i={id:A,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,exportName:e.exportName||"default"};return this.initialized||await this.initialize(),new Promise((r,s)=>{const a={id:A,payload:i,resolve:r,reject:s};this._dispatchToWorker(a)||(this.taskQueue.push(a),this._scheduleNext())})}async distributeTask(e,t){}async cancelTask(e){}getCapabilities(){return{...this.capabilities,workers:this.workers.length,activeTaskCount:this.activeTasks.size,queuedTaskCount:this.taskQueue.length}}getStats(){return{totalTasksCompleted:0,averageTaskDuration:0,currentLoad:0}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_dispatchToWorker(e){const t=this.workers.find(A=>!Array.from(this.activeTasks.values()).some(i=>i.worker===A));return t?(this.activeTasks.set(e.id,{...e,worker:t}),t.postMessage({type:"run",...e.payload}),!0):!1}async _executeInline(e){try{let t;if(e.payload.fn)t=new Function(`return (${e.payload.fn});`)();else if(e.payload.module){if(typeof e.payload.module!="string")throw new Error("module path must be a string");t=(await E1(()=>import(`${e.payload.module}`),[],import.meta.url))[e.payload.exportName||"default"]}const A=await t(e.payload.data);if(A&&typeof A=="object"&&Object.prototype.hasOwnProperty.call(A,"commitDelta")){this.commitDelta(A.commitDelta);const i=Object.prototype.hasOwnProperty.call(A,"value")?A.value:A.result;e.resolve(i);return}e.resolve(A)}catch(t){e.reject(t)}}_handleWorkerMessage(e,t){const{id:A,type:i,result:r,error:s}=t||{},a=this.activeTasks.get(A);if(a){if(i==="result"){let o=r;r&&typeof r=="object"&&Object.prototype.hasOwnProperty.call(r,"commitDelta")&&(this.commitDelta(r.commitDelta),o=Object.prototype.hasOwnProperty.call(r,"value")?r.value:r.result),a.resolve(o)}else i==="error"&&a.reject(new Error(s||"Worker task failed"));this.activeTasks.delete(A),this._scheduleNext()}}_scheduleNext(){if(this.taskQueue.length===0)return;const e=this.taskQueue.shift();if(this.workers.length===0){this._executeInline(e);return}this._dispatchToWorker(e)||this.taskQueue.unshift(e)}}const xp=[68/255,136/255,255/255],_p=[255/255,170/255,238/255],Ep=[255/255,221/255,170/255],S1=1,U1=94607e11,Va=6957e5,M1=320,wc=(n,e,t)=>n+(e-n)*t,Cc=(n,e,t)=>[wc(n[0],e[0],t),wc(n[1],e[1],t),wc(n[2],e[2],t)],Ym=n=>{let e=n;return()=>{const t=Math.sin(e++)*1e4;return t-Math.floor(t)}},_i=(n,e)=>{const t=n()*Math.PI*2,A=Math.acos(2*n()-1),i=Math.sin(A);return{x:e*i*Math.cos(t),y:e*i*Math.sin(t),z:e*Math.cos(A)}};function b1({seed:n=1337,starCount:e=25e4,clusterCount:t=300,scale:A=46.5*94607e20,filamentScatter:i=.04}={}){const r=Ym(n),s=new Float32Array(e*3),a=new Float32Array(e*3),o=new Float32Array(e),l=[];for(let u=0;u<t;u++){const f=Math.pow(r(),.5)*A,p=_i(r,f);l.push(p)}const c=A*1e-6;for(let u=0;u<e;u++){const f=u*3,p=Math.floor(r()*t);let g=p,m=1/0;for(let L=0;L<3;L++){const z=Math.floor(r()*t);if(z===p)continue;const D=l[p].x-l[z].x,O=l[p].y-l[z].y,Z=l[p].z-l[z].z,V=D*D+O*O+Z*Z;V<m&&(m=V,g=z)}let d=r();d=d<.5?2*d*d:-1+(4-2*d)*d;const h=l[p],B=l[g],w=h.x+(B.x-h.x)*d,C=h.y+(B.y-h.y)*d,b=h.z+(B.z-h.z)*d,y=A*i,M=r()*y,R=_i(r,M);s[f]=w+R.x,s[f+1]=C+R.y,s[f+2]=b+R.z;const E=r();let x;E<.33?x=Cc(xp,_p,r()):E<.66?x=Cc(_p,Ep,r()):x=Cc(Ep,xp,r()),a[f]=x[0],a[f+1]=x[1],a[f+2]=x[2],o[u]=c*(.6+r()*.8)}return{positions:s,colors:a,sizes:o}}function F1({seed:n=1337,starCount:e=25e4,clusterCount:t=300,scale:A=46.5*94607e20,filamentScatter:i=.04,resolution:r=96}={}){const s=Ym(n),a=Math.min(M1,Math.max(24,Math.floor(r))),o=new Float32Array(a*a*a),l=[];for(let d=0;d<t;d++){const h=Math.pow(s(),.5)*A;l.push(_i(s,h))}const c=Math.min(e,a*a*a),u=a-1,f=A*i;for(let d=0;d<c;d++){const h=Math.floor(s()*t);let B=h,w=1/0;for(let be=0;be<3;be++){const Te=Math.floor(s()*t);if(Te===h)continue;const Ge=l[h].x-l[Te].x,et=l[h].y-l[Te].y,Q=l[h].z-l[Te].z,ht=Ge*Ge+et*et+Q*Q;ht<w&&(w=ht,B=Te)}let C=s();C=C<.5?2*C*C:-1+(4-2*C)*C;const b=l[h],y=l[B],M=b.x+(y.x-b.x)*C,R=b.y+(y.y-b.y)*C,E=b.z+(y.z-b.z)*C,x=s()*f,L=_i(s,x),z=M+L.x,D=R+L.y,O=E+L.z,Z=z/A*.5+.5,V=D/A*.5+.5,q=O/A*.5+.5;if(Z<0||Z>1||V<0||V>1||q<0||q>1)continue;const X=Z*u,re=V*u,ae=q*u,he=Math.floor(X),Ie=Math.floor(re),Oe=Math.floor(ae),J=X-he,ee=re-Ie,ue=ae-Oe,ce=.6+s()*.6;for(let be=0;be<=1;be++){const Te=be?J:1-J,Ge=Math.min(u,he+be);for(let et=0;et<=1;et++){const Q=et?ee:1-ee,ht=Math.min(u,Ie+et);for(let Je=0;Je<=1;Je++){const tt=Je?ue:1-ue,_e=Math.min(u,Oe+Je),Bt=Ge+ht*a+_e*a*a;o[Bt]+=ce*Te*Q*tt}}}}let p=0;for(let d=0;d<o.length;d++)o[d]>p&&(p=o[d]);const g=new Uint8Array(o.length),m=p>0?1/p:0;for(let d=0;d<o.length;d++){const h=o[d]*m,B=Math.pow(h,.9);g[d]=Math.max(0,Math.min(255,Math.round(B*255)))}return{density:g,resolution:a,scale:A}}function T1({starCount:n=25e4,radius:e=52e3*U1,type:t=0}={}){const A=Math.random,i=new Float32Array(n*3),r=new Float32Array(n*3),s=new Float32Array(n),a=new Float32Array(n*3),o=[];if(t===2)for(let l=0;l<4;l++)o.push({x:(A()-.5)*e*1.2,y:(A()-.5)*e*.8,z:(A()-.5)*e*1.2});for(let l=0;l<n;l++){const c=l*3;let u=0,f=0,p=0,g=1;if(t===0)if(A()<.2){const C=A()*e*.25,b=_i(A,C);u=b.x,f=b.y*.8,p=b.z,r[c]=1,r[c+1]=.8,r[c+2]=.4}else{const C=(A()*.1+Math.pow(A(),2)*.9)*e,b=2,M=Math.PI*2/b*(l%b)+7*Math.log(C/e*10+1);u=Math.cos(M)*C+(A()-.5)*e*.1,p=Math.sin(M)*C+(A()-.5)*e*.1,f=(A()-.5)*e*.02*(1+C/e),g=Math.sqrt(1/(C/e+.1)),A()>.3?(r[c]=.6,r[c+1]=.7,r[c+2]=1):(r[c]=1,r[c+1]=1,r[c+2]=1)}else if(t===1){const w=Math.pow(A(),2.5)*e*.6,C=_i(A,w);u=C.x*.8,f=C.y*.6,p=C.z*.8,g=.1,r[c]=1,r[c+1]=.7,r[c+2]=.3}else{const w=o[l%o.length],C=A()*e*.3,b=_i(A,C);u=w.x+b.x,f=w.y+b.y,p=w.z+b.z,g=.5,A()>.9?(r[c]=1,r[c+1]=.2,r[c+2]=.1,s[l]=Va*(8+A()*20)):(r[c]=.6,r[c+1]=.8,r[c+2]=1)}const m=Math.sqrt(u*u+p*p)+1e-4,d=Math.min(1,m/(e*.9)),h=(A()-.5)*e*.03*d,B=A()*Math.PI*2;if(u+=Math.cos(B)*h,p+=Math.sin(B)*h,f+=(A()-.5)*e*.01*d,i[c]=u,i[c+1]=f,i[c+2]=p,s[l]===0){const w=A();let C=Va*(.2+A()*.8);w>.95?C=Va*(5+A()*15):w>.7&&(C=Va*(1+A()*2)),s[l]=C}s[l]*=S1,a[c]=Math.sqrt(u*u+p*p),a[c+1]=g,a[c+2]=Math.atan2(p,u)}return{positions:i,colors:r,sizes:s,orbitParams:a}}const FA={AU:149597870700,LY:94607e11,KLY:94607e14,MLY:94607e17,GLY:94607e20},Tr=6957e5,Rf=198847e25,I1=FA.AU*FA.AU,Q1=3,L1=.18,R1=6371e3,D1=69911e3,Po=66743e-15,yp=299792458,Df=86400,St={UNIVERSE:46.5*FA.GLY,GALAXY:52e3*FA.LY,SYSTEM:100*FA.AU},xc=Math.pow(10,1/3),Ti={LOW:{starCount:1e5,clusterCount:200,densityRes:64},MED:{starCount:25e4,clusterCount:300,densityRes:Math.round(80*xc)},HIGH:{starCount:5e5,clusterCount:400,densityRes:Math.round(96*xc)},ULTRA:{starCount:1e6,clusterCount:500,densityRes:Math.round(128*xc)}},P1=320,Pf=new URLSearchParams(window.location.search),H1=Pf.get("debugweb")==="true";var Wp;const Jm=(Wp=Pf.get("quality"))==null?void 0:Wp.toUpperCase(),Sp=Pf.get("pixelation"),_c=Ti[Jm]||Ti.HIGH,lt={starCount:_c.starCount,clusterCount:_c.clusterCount,filamentScatter:.04,seed:1337,densityRes:_c.densityRes},Ec=Sp?parseInt(Sp,10):null,N1=new URL(""+new URL("universeTasks-BnubIbru.js",import.meta.url).href,import.meta.url).href,Up=new y1({maxWorkers:1});let ka=null;function O1(){return ka||(ka=Up.initialize().then(()=>Up).catch(n=>(console.warn("[Universes] ComputeManager unavailable:",n),null)),ka)}async function qu(n,e){const t=await O1();if(!t)return null;try{return await t.submitTask({module:N1,exportName:n,data:e})}catch(A){return console.warn(`[Universes] Compute task ${n} failed:`,A),null}}const sn=[{id:"O",prob:1e-4,color:10066431,temp:"30,000+",mass:60,rad:8,lum:"30,000+",lifespan:.01},{id:"B",prob:.0013,color:11184895,temp:"10,000-30,000",mass:10,rad:5,lum:"25-30,000",lifespan:.1},{id:"A",prob:.006,color:16777215,temp:"7,500-10,000",mass:3,rad:2.5,lum:"5-25",lifespan:1},{id:"F",prob:.03,color:16777198,temp:"6,000-7,500",mass:1.5,rad:1.3,lum:"1.5-5",lifespan:4},{id:"G",prob:.076,color:16768256,temp:"5,200-6,000",mass:1,rad:1,lum:"0.6-1.5",lifespan:10},{id:"K",prob:.121,color:16755234,temp:"3,700-5,200",mass:.7,rad:.8,lum:"0.08-0.6",lifespan:30},{id:"M",prob:.7645,color:16724736,temp:"2,400-3,700",mass:.3,rad:.4,lum:"< 0.08",lifespan:1e3},{id:"BH",prob:0,color:0,temp:"UNDEFINED",mass:20,rad:.05,lum:"0",lifespan:9999},{id:"N",prob:0,color:65535,temp:"600,000",mass:2.5,rad:.02,lum:"0.001",lifespan:9999},{id:"WD",prob:0,color:12320767,temp:"100,000",mass:.9,rad:.1,lum:"0.01",lifespan:9999}],gi=`
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
`;let ve,$e,j,de,PA,dt,ze,Ye,nt,G1,Ze,Dt;const ys=[];let gt;const Zn=[],Ho=[];let ms=0,Ei=[],oo,ju=[],Ht,Mp=!1,tn,lo,Hf=new Sg,Gn=!1,yc=new Ue,Wn=!1,EA=null;const RA=new Set;let yi=!1,co=0,za=null,Ka=null,Wa=null,xA=null,T=null;const Xa=new Ug,qr=new ut,ar=new F,bp=new F,Ya=new F,pr=new F,Ja=new F,V1=new F,vn=new F,Fp=new F,Sc=new F,Tp=new F,Ip=new F,Uc=new F,jr=new F,$r=new F,Qp=new F;function $u(){return new Zo({color:65280,transparent:!1,opacity:1,depthTest:!1,depthWrite:!1,blending:GA,toneMapped:!1})}function Mc(n){const e=Math.abs(n);return e>=1e7?n.toExponential(2):e>=1e4?Math.round(n).toLocaleString():n.toFixed(1)}function No(n){let e=n>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967295)}function Cr(n,e){const t=n()*Math.PI*2,A=Math.acos(2*n()-1),i=Math.sin(A);return new F(e*i*Math.cos(t),e*i*Math.sin(t),e*Math.cos(A))}function k1(n){if(!Number.isFinite(n)||n<=0)return .05;const e=Math.pow(n,3.2)*Q1;return Math.max(L1,Math.min(e,700))}function z1(n){const e=sn[4];if(!n||typeof n!="object")return e;const t=n.id?sn.find(i=>i.id===n.id):null,A=t||n;return!Number.isFinite(A.mass)||!Number.isFinite(A.rad)?t||e:A}function Nf(n){return 2*Po*n/(yp*yp)}function Ss(){var r,s,a;const n=(((r=U.activeGalaxyData)==null?void 0:r.designation)||`SEED-${lt.seed}`).split("").reduce((o,l)=>o*31+l.charCodeAt(0)>>>0,0),e=/QUASAR|AGN/i.test(((s=U.activeGalaxyData)==null?void 0:s.type)||""),t=1e6+n%9e8,A=Nf(t*Rf),i=(A/Tr).toFixed(3);return{designation:(a=U.activeGalaxyData)!=null&&a.designation?`${U.activeGalaxyData.designation} ${e?"QUASAR":"CORE"}`:e?"QUASAR CORE":"GALACTIC CORE",typeObj:{id:"BH",color:65280},state:"REMNANT",age:U.universeSimTime.toFixed(3),mass:t.toLocaleString(),radius:i,lum:e?"ACTIVE":"0",spectrum:[],massSolar:t,radiusM:A,composition:e?`AGN: ACTIVE (QUASAR)
ACCRETION: EXTREME
MASS: ${t.toLocaleString()} M☉`:`EVENT HORIZON: STABLE
ACCRETION: ACTIVE
MASS: ${t.toLocaleString()} M☉`}}function Zm(){if(U.autopilotPriorityTargets=[],!U.isAutopilot||U.viewLevel!==1||!nt||nt.children.length===0)return;const n=Ss();nt.children.forEach(e=>{!e||typeof e.getWorldPosition!="function"||U.autopilotPriorityTargets.push({object:e,data:n})})}function or(){U.isAutopilot&&(U.isAutopilot=!1,U.autopilotPriorityTargets=[],bs&&(bs.checked=!1))}function K1(n,e){const t=n+e+1,A=[];for(let r=0;r<=e;r++)A.push(0);const i=t-2*(e+1);for(let r=1;r<=i;r++)A.push(r/(i+1));for(let r=0;r<=e;r++)A.push(1);return A}function ul(){var a,o;if(!U.showTravelPath){Ct&&(Ct.visible=!1);return}if(SA.length===0&&SA.push(U.worldOffset.clone()),SA.length<2){Ct&&(Ct.visible=!1);return}const n=Math.min(3,SA.length-1),e=SA.map(l=>new ct(l.x,l.y,l.z,1)),t=K1(e.length,n),A=new $_(n,t,e),i=Math.min(1024,64+SA.length*32),r=A.getPoints(i),s=new Gt().setFromPoints(r);if(Ct)Ct.geometry.dispose(),Ct.geometry=s,Ct.visible=!0,Ct.material&&((o=(a=Ct.material).dispose)==null||o.call(a),Ct.material=$u());else{const l=$u();Ct=new qo(s,l),Ct.frustumCulled=!1,Ct.renderOrder=1e3,$e.add(Ct)}Ct&&Ct.position.copy(U.worldOffset).multiplyScalar(-1)}function W1(n){SA.push(n.clone()),ul()}function X1(n){for(let e=0;e<SA.length;e++)SA[e].sub(n);ul()}function Y1(){SA.length=0,Ct&&($e.remove(Ct),Ct.geometry&&Ct.geometry.dispose(),Ct.material&&Ct.material.dispose(),Ct=null)}function J1(){return{qualityLevel:U.qualityLevel,pixelationFactor:U.pixelationFactor,timeScale:U.timeScale,crtEnabled:(_r==null?void 0:_r.checked)??!0,isAutopilot:U.isAutopilot,showTravelPath:U.showTravelPath,schwarzschildLensing:U.useSchwarzschildLensing}}function Z1(n){if(n){if(n.qualityLevel&&Ti[n.qualityLevel]){U.qualityLevel=n.qualityLevel;const e=Ti[n.qualityLevel];lt.starCount=e.starCount,lt.clusterCount=e.clusterCount,lt.densityRes=e.densityRes||lt.densityRes,document.querySelectorAll(".q-btn").forEach(t=>{const A=t.getAttribute("data-q")===n.qualityLevel;t.classList.toggle("active",A)})}Number.isFinite(n.pixelationFactor)&&(U.pixelationFactor=n.pixelationFactor,Us&&(Us.value=U.pixelationFactor),Ms&&(Ms.innerText=U.pixelationFactor),Ps()),Number.isFinite(n.timeScale)&&(U.timeScale=n.timeScale,tf&&(tf.value=U.timeScale)),typeof n.crtEnabled=="boolean"&&_r&&(_r.checked=n.crtEnabled,n.crtEnabled?Go.classList.add("crt-effects"):Go.classList.remove("crt-effects")),typeof n.isAutopilot=="boolean"&&(U.isAutopilot=n.isAutopilot,bs&&(bs.checked=U.isAutopilot)),typeof n.showTravelPath=="boolean"&&(U.showTravelPath=n.showTravelPath,vs&&(vs.checked=U.showTravelPath),ul()),typeof n.schwarzschildLensing=="boolean"&&(U.useSchwarzschildLensing=n.schwarzschildLensing,Bs&&(Bs.checked=U.useSchwarzschildLensing),yt&&(yt.enabled=U.useSchwarzschildLensing))}}function q1(){switch(U.qualityLevel){case"ULTRA":return 4;case"HIGH":return 3;case"MED":return 2;case"LOW":default:return 1}}function j1(){ze&&(ze.visible=!0,ze.userData.isCachedGalaxy=!0,gt==null||gt.add(ze),ys.push(ze),ze=null,Ze&&($e.remove(Ze),Ze.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),Ze=null),nt==null||nt.clear(),qm())}function qm(n=q1()){for(;ys.length>n;){const e=ys.shift();e&&(gt==null||gt.remove(e),e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose())}}function $1(n){gt&&gt.position.sub(n)}function eI(){nt&&nt.scale.setScalar(1)}function tI(n){if(!Ze||!n)return null;let e=null,t=1/0;return Ze.children.forEach(A=>{var s;if(!((s=A==null?void 0:A.userData)!=null&&s.isNebula))return;const i=A.userData.radius||0,r=n.distanceTo(A.position);r<i*.8&&r<t&&(e=A,t=r)}),e}function AI(n){var t;let e=n;for(;e&&!((t=e.userData)!=null&&t.isNebula);)e=e.parent;return e}let yt,Oo;const mi=4,hA={uBHCount:{value:0},uBHPos:{value:Array.from({length:mi},()=>new Ue)},uBHMass:{value:new Array(mi).fill(0)},uBHRadius:{value:new Array(mi).fill(0)}};let Ir=[];const SA=[];let Ct=null,Zt=[],Bi=[],U={universeSimTime:13.8,galaxySimTime:0,isPaused:!1,timeScale:.25,viewLevel:0,isTransitioning:!1,transitionTarget:new F,transitionData:null,transitionProgress:0,nextLevel:0,worldOffset:new F(0,0,0),currentGalaxyType:0,qualityLevel:Jm||"HIGH",pixelationFactor:1,selectedTarget:null,activeGalaxyData:null,activeSystemData:null,activeNebula:null,isAutopilot:!0,autopilotTimer:0,autopilotNextAction:2,visitedSystemsCount:0,lastGalaxyVisitTime:0,autopilotZooming:!1,autopilotPanelHidden:!1,autopilotPriorityTargets:[],planetTourIndex:0,trackingTarget:null,inspectingTarget:null,inspectingTargetPreviousPos:null,bigBangFlash:0,showTravelPath:!1,useSchwarzschildLensing:!0};const bc=document.getElementById("c-x"),Fc=document.getElementById("c-y"),Tc=document.getElementById("c-z"),Lp=document.getElementById("time"),nI=document.getElementById("fps"),iI=document.getElementById("objects"),rI=document.getElementById("seed-disp");let ef=document.getElementById("pause-btn"),rn=document.getElementById("back-btn");const tf=document.getElementById("timestep-slider"),fl=document.getElementById("alert-box"),Ic=document.getElementById("alert-title"),xr=document.getElementById("alert-msg");document.getElementById("alert-dismiss");document.getElementById("config-btn");const Af=document.getElementById("config-modal"),sI=document.getElementById("config-close"),Us=document.getElementById("retro-slider"),Ms=document.getElementById("retro-val"),_r=document.getElementById("crt-toggle"),Bs=document.getElementById("bh-lens-toggle"),bs=document.getElementById("autopilot-toggle"),vs=document.getElementById("path-toggle"),Go=document.getElementById("crt-overlay");let Vo=document.getElementById("status-toggle-btn");document.getElementById("sim-toggle-btn");const ko=document.getElementById("stats-panel"),zo=document.getElementById("controls-panel"),aI=document.getElementById("stats-close"),oI=document.getElementById("sim-close"),jm=document.getElementById("loc-btn"),DA=document.getElementById("target-panel"),lI=document.getElementById("target-close"),cI=document.getElementById("target-title"),uI=document.getElementById("t-name"),Za=document.getElementById("t-type"),fI=document.getElementById("t-age"),Rp=document.getElementById("t-mass"),Dp=document.getElementById("t-rad"),Pp=document.getElementById("t-lum"),Hp=document.getElementById("spectrograph"),hI=document.getElementById("t-composition"),dI=document.getElementById("warp-btn"),lr=document.getElementById("mouse-cursor");let Qc=0,Np=0,An=null;r0();function $m(){const n=document.getElementById("VRButton");n&&n.remove();const e=document.getElementById("vr-button-container"),t=document.createElement("button");if(t.id="VRButton",t.style.width="100%",t.textContent="VR...",t.disabled=!0,(e||document.body).appendChild(t),!(j!=null&&j.xr)||!(navigator!=null&&navigator.xr)){t.style.display="none";return}const A={optionalFeatures:["local-floor","bounded-floor"]};let i=null;const r=()=>{t.textContent=i?"EXIT VR":"ENTER VR"},s=()=>{i&&(i.removeEventListener("end",s),i=null,r())};t.onclick=async()=>{if(i){try{await i.end()}catch{}return}try{j.xr.setReferenceSpaceType("local-floor")}catch{}try{i=await navigator.xr.requestSession("immersive-vr",A),i.addEventListener("end",s),await j.xr.setSession(i),r()}catch(a){console.warn("WebXR session start failed:",a),i=null,t.textContent="VR FAILED",setTimeout(r,1500)}},navigator.xr.isSessionSupported("immersive-vr").then(a=>{if(!a){t.style.display="none";return}t.disabled=!1,r()}).catch(()=>{t.style.display="none"})}function pI(n){let A=1.6/Math.max(.25,Math.min(4,n||1));return A=Math.max(.45,Math.min(1.55,A)),{width:1.6,height:A}}function e0(n){if(!(T!=null&&T.mesh)||T.planeAspect&&Math.abs(T.planeAspect-n)<.01)return;T.planeAspect=n;const{width:e,height:t}=pI(n);try{T.mesh.geometry.dispose()}catch{}if(T.mesh.geometry=new $n(e,t),T.bgMesh){try{T.bgMesh.geometry.dispose()}catch{}T.bgMesh.geometry=new $n(e*1.02,t*1.02)}if(T.border){const i=[new F(-e/2,-t/2,.002),new F(e/2,-t/2,.002),new F(e/2,t/2,.002),new F(-e/2,t/2,.002),new F(-e/2,-t/2,.002)];try{T.border.geometry.dispose()}catch{}T.border.geometry=new Gt().setFromPoints(i)}}function Ko(n){T!=null&&T.anchor&&(T.visible=n,T.anchor.visible=n,n?(T.needsCapture=!0,T.lastCaptureMs=0,(T.controllers||[]).forEach(e=>{e!=null&&e.line&&(e.line.visible=!0)})):(T.reticle&&(T.reticle.visible=!1),(T.controllers||[]).forEach(e=>{var t,A;e!=null&&e.line&&(e.line.visible=!1),(A=(t=e==null?void 0:e.controller)==null?void 0:t.userData)!=null&&A.vrUi&&(e.controller.userData.vrUi.hoverEl=null,e.controller.userData.vrUi.activeEl=null,e.controller.userData.vrUi.clickTarget=null,e.controller.userData.vrUi.draggingRange=null,e.controller.userData.vrUi.pressed=!1)})))}function t0(n="VR UI"){if(!(T!=null&&T.canvas))return;const e=T.canvas.getContext("2d");if(!e)return;const t=T.canvas.width||1,A=T.canvas.height||1;e.clearRect(0,0,t,A),e.fillStyle="rgba(0, 15, 0, 0.92)",e.fillRect(0,0,t,A),e.strokeStyle="rgba(0, 255, 0, 0.85)";const i=Math.max(2,Math.floor(Math.min(t,A)/220));e.lineWidth=i,e.strokeRect(i/2,i/2,t-i,A-i),e.fillStyle="rgba(0, 255, 0, 0.95)";const r=Math.max(18,Math.floor(Math.min(t,A)/14)),s=Math.max(12,Math.floor(r*.55));e.font=`${r}px monospace`,e.fillText(n,i*2,i*2+r),e.font=`${s}px monospace`,e.fillText("waiting for capture…",i*2,i*2+r+s+6),e.fillText(new Date().toLocaleTimeString(),i*2,i*2+r+(s+6)*2),T.texture&&(T.texture.needsUpdate=!0)}function gI(n){let e=n;for(let t=0;t<6&&e;t++){if(e instanceof HTMLInputElement){if(e.type==="range")return{kind:"range",el:e};if(e.type==="checkbox"||e.type==="button")return{kind:"click",el:e}}if(e instanceof HTMLButtonElement)return{kind:"click",el:e};if(e instanceof HTMLLabelElement)return{kind:"click",el:e};if(e.classList&&e.classList.contains("panel-close"))return{kind:"click",el:e};e=e.parentElement}return n?{kind:"click",el:n}:null}function Of(n,e,t=!1){if(!n)return;const A=n.getBoundingClientRect();if(!A||A.width<=0)return;const i=Number(n.min||0),r=Number(n.max||1),s=Number(n.step||0);let a=(e-A.left)/A.width;a=Math.max(0,Math.min(1,a));let o=i+a*(r-i);Number.isFinite(s)&&s>0&&(o=Math.round(o/s)*s);const l=n.value;n.value=String(o),l!==n.value&&n.dispatchEvent(new Event("input",{bubbles:!0})),t&&n.dispatchEvent(new Event("change",{bubbles:!0}))}function hl(){if(!(!T||!j||!$e)){T.controllers&&T.controllers.length&&T.controllers.forEach(({controller:n})=>{if(n){try{n.removeEventListener("selectstart",Op)}catch{}try{n.removeEventListener("selectend",Gp)}catch{}try{$e.remove(n)}catch{}}}),T.controllers=[];for(let n=0;n<2;n++){const e=j.xr.getController(n);e.userData.vrUi={index:n,pointerId:9e3+n,pressed:!1,hoverEl:null,activeEl:null,clickTarget:null,draggingRange:null,clientX:0,clientY:0},e.addEventListener("selectstart",Op),e.addEventListener("selectend",Gp);const t=new Gt().setFromPoints([new F(0,0,0),new F(0,0,-1)]),A=new Zo({color:65280,transparent:!0,opacity:.8}),i=new qo(t,A);i.name="vr-ui-ray",i.visible=!1,i.renderOrder=998,i.scale.z=2,e.add(i),$e.add(e),T.controllers.push({controller:e,line:i})}}}function Gf(){var A;const n=document.getElementById("ui-layer");if(!n||!$e)return;if(T||(T={}),T.uiLayer=n,!T.captureHost){let i=document.getElementById("vr-ui-capture-host");i||(i=document.createElement("div"),i.id="vr-ui-capture-host",i.setAttribute("aria-hidden","true"),i.style.position="fixed",i.style.left="0",i.style.top="200vh",i.style.width="1px",i.style.height="1px",i.style.overflow="hidden",i.style.pointerEvents="none",i.style.opacity="0",i.style.zIndex="-1",document.body.appendChild(i)),T.captureHost=i,T.captureLayer=null}if(T.maxCaptureDim=2048,T.captureIntervalMs=500,T.captureInFlight=!1,T.needsCapture=!0,typeof T.dirtyCounter!="number"&&(T.dirtyCounter=0),typeof T.forceCapture!="boolean"&&(T.forceCapture=!1),T.lastCaptureMs=0,T.visible=!1,T.canvas||(T.canvas=document.createElement("canvas"),T.canvas.width=512,T.canvas.height=256),!T.texture){T.texture=new T_(T.canvas),T.texture.minFilter=jt,T.texture.magFilter=jt,T.texture.generateMipmaps=!1;try{(A=j==null?void 0:j.capabilities)!=null&&A.getMaxAnisotropy&&(T.texture.anisotropy=Math.max(1,j.capabilities.getMaxAnisotropy()))}catch{}T.texture.colorSpace=YA}if(t0("VR UI"),T.material?T.material.map=T.texture:(T.material=new vi({map:T.texture,transparent:!0}),T.material.depthTest=!1,T.material.depthWrite=!1,T.material.side=MA),T.anchor)try{$e.remove(T.anchor)}catch{}T.anchor=new qA,T.anchor.visible=!1,T.anchor.name="vr-ui-anchor",$e.add(T.anchor),T.planeAspect=null;const e=window.innerWidth/window.innerHeight;T.mesh=new xt(new $n(1,1),T.material),T.mesh.name="vr-ui-plane",T.mesh.frustumCulled=!1,T.mesh.renderOrder=999,T.mesh.rotation.x=-.07,T.anchor.add(T.mesh),T.bgMaterial||(T.bgMaterial=new vi({color:6656,transparent:!0,opacity:.25}),T.bgMaterial.depthTest=!1,T.bgMaterial.depthWrite=!1,T.bgMaterial.side=MA),T.bgMesh=new xt(new $n(1,1),T.bgMaterial),T.bgMesh.name="vr-ui-backdrop",T.bgMesh.frustumCulled=!1,T.bgMesh.renderOrder=998,T.bgMesh.position.z=-.003,T.mesh.add(T.bgMesh),T.borderMaterial||(T.borderMaterial=new Zo({color:65280,transparent:!0,opacity:.6}),T.borderMaterial.depthTest=!1,T.borderMaterial.depthWrite=!1),T.border=new qo(new Gt,T.borderMaterial),T.border.name="vr-ui-border",T.border.renderOrder=1e3,T.mesh.add(T.border),e0(e);const t=new vi({color:65280,transparent:!0,opacity:.9});t.depthTest=!1,t.depthWrite=!1,T.reticle=new xt(new jo(.008,.012,32),t),T.reticle.name="vr-ui-reticle",T.reticle.visible=!1,T.reticle.position.z=.001,T.reticle.renderOrder=1e3,T.mesh.add(T.reticle),T.mutationObserver&&T.mutationObserver.disconnect(),T.mutationObserver=new MutationObserver(()=>{T&&(T.needsCapture=!0,T.dirtyCounter=(T.dirtyCounter||0)+1)}),T.mutationObserver.observe(n,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),hl()}async function Vf(){var o;if(!(T!=null&&T.uiLayer)||!(T!=null&&T.texture)||!T.visible||T.captureInFlight)return;const n=T.uiLayer.getBoundingClientRect();if(!n||n.width<2||n.height<2)return;T.captureInFlight=!0;const e=T.maxCaptureDim||1024,t=Math.min(2,e/Math.max(n.width,n.height)),A=Math.max(2,Math.round(n.width*t)),i=Math.max(2,Math.round(n.height*t));T.canvas&&(T.canvas.width!==A&&(T.canvas.width=A),T.canvas.height!==i&&(T.canvas.height=i));const r=T.dirtyCounter||0,s=!!T.forceCapture;T.forceCapture=!1;let a=T.uiLayer;try{const l=await xb(a,{backgroundColor:"rgba(0, 15, 0, 0.92)",logging:!1,scale:t,useCORS:!0,removeContainer:!0,width:n.width,height:n.height,x:n.left,y:n.top,windowWidth:document.documentElement.clientWidth,windowHeight:document.documentElement.clientHeight,ignoreElements:c=>{try{const u=c&&c.tagName?c.tagName.toLowerCase():"";if(u==="canvas"||u==="video"||u==="iframe"||c&&(c.id==="mouse-cursor"||c.id==="crt-overlay"||c.id==="canvas-container"))return!0}catch{}return!1},onclone:c=>{try{const u=c.getElementById("canvas-container");u&&(u.style.display="none");const f=c.getElementById("crt-overlay");f&&(f.style.display="none");const p=c.getElementById("mouse-cursor");p&&(p.style.display="none"),c.documentElement.style.background="transparent",c.body.style.background="transparent",c.querySelectorAll("canvas, video, iframe").forEach(g=>{try{g.style.display="none"}catch{}})}catch{}}});if(l&&T.canvas){const c=T.canvas.getContext("2d");c&&(c.clearRect(0,0,T.canvas.width,T.canvas.height),c.drawImage(l,0,0,T.canvas.width,T.canvas.height),c.fillStyle="rgba(0, 255, 0, 1)",c.font="20px monospace",c.fillText(`T: ${Date.now()%1e5}`,10,30))}if(console.log("VR UI capture:",{resultCanvas:l?`${l.width}x${l.height}`:"null",ourCanvas:T.canvas?`${T.canvas.width}x${T.canvas.height}`:"null",rect:`${n.width}x${n.height}`}),T.texture.image=T.canvas,T.texture.needsUpdate=!0,(o=j==null?void 0:j.xr)!=null&&o.isPresenting&&j.properties)try{const c=j.properties.get(T.texture);if(c&&c.__webglTexture){const u=j.getContext();u.bindTexture(u.TEXTURE_2D,c.__webglTexture),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,T.canvas),u.bindTexture(u.TEXTURE_2D,null)}}catch(c){console.warn("Direct texture upload failed:",c)}T.sourceRect=n,T.canvasWidth=T.canvas.width,T.canvasHeight=T.canvas.height,e0(T.canvasWidth/T.canvasHeight)}catch(l){console.warn("VR UI capture failed:",l),t0("CAPTURE FAILED")}finally{T.captureInFlight=!1;const l=T.dirtyCounter||0;T.needsCapture=l!==r,s&&T.needsCapture&&(T.forceCapture=!0),T.lastCaptureMs=performance.now()}}function A0(n){var r;if(!(T!=null&&T.visible)||!((r=j==null?void 0:j.xr)!=null&&r.isPresenting)||!$e||!ve)return;n-(T.lastCaptureMs||0)>=200&&(T.needsCapture=!0);const t=j.xr.getCamera(ve);ar.setFromMatrixPosition(t.matrixWorld),qr.extractRotation(t.matrixWorld),bp.set(0,0,-1).applyMatrix4(qr),T.anchor.position.copy(ar).add(bp.multiplyScalar(1.15)),T.anchor.quaternion.setFromRotationMatrix(qr),T.anchor.position.y-=.12;let A=!1;(T.controllers||[]).forEach(({controller:s,line:a})=>{if(!s||!a)return;const o=s.userData.vrUi;if(!o)return;qr.identity().extractRotation(s.matrixWorld),Xa.ray.origin.setFromMatrixPosition(s.matrixWorld),Xa.ray.direction.set(0,0,-1).applyMatrix4(qr).normalize(),Xa.far=10;const l=T.mesh?Xa.intersectObject(T.mesh,!1):[];if(l.length>0){const c=l[0];A=!0,a.scale.z=Math.max(.15,c.distance);const u=c.uv;if(u&&T.canvasWidth&&T.canvasHeight){const f=T.uiLayer.getBoundingClientRect(),p=u.x*T.canvasWidth,g=(1-u.y)*T.canvasHeight,m=f.left+p/T.canvasWidth*f.width,d=f.top+g/T.canvasHeight*f.height;o.clientX=m,o.clientY=d;let h=document.elementFromPoint(m,d);(!h||!T.uiLayer.contains(h))&&(h=null),o.hoverEl=h,o.pressed&&o.draggingRange&&(Of(o.draggingRange,m,!1),T.needsCapture=!0)}T.reticle&&(ar.copy(c.point),T.mesh.worldToLocal(ar),T.reticle.position.set(ar.x,ar.y,.001))}else a.scale.z=2,o.hoverEl=null}),T.reticle&&(T.reticle.visible=A);const i=n-(T.lastCaptureMs||0)>=(T.captureIntervalMs||250);!T.captureInFlight&&(T.forceCapture||T.needsCapture&&i)&&Vf()}function Op(n){var i;if(!(T!=null&&T.visible))return;const e=n.target,t=(i=e==null?void 0:e.userData)==null?void 0:i.vrUi;if(!t)return;t.pressed=!0,t.activeEl=t.hoverEl;const A=gI(t.activeEl);A&&(A.kind==="range"?(t.draggingRange=A.el,Of(A.el,t.clientX,!1),T&&(T.needsCapture=!0,T.dirtyCounter=(T.dirtyCounter||0)+1)):t.clickTarget=A.el)}function Gp(n){var A;const e=n.target,t=(A=e==null?void 0:e.userData)==null?void 0:A.vrUi;if(t){if(t.draggingRange)Of(t.draggingRange,t.clientX,!0),t.draggingRange=null,T&&(T.needsCapture=!0,T.forceCapture=!0,T.dirtyCounter=(T.dirtyCounter||0)+1);else if(t.clickTarget){try{t.clickTarget.click()}catch{}t.clickTarget=null,T&&(T.needsCapture=!0,T.forceCapture=!0,T.dirtyCounter=(T.dirtyCounter||0)+1)}t.pressed=!1,t.activeEl=null}}function n0(){var A;PA=new z_(j);const n=new K_($e,ve);PA.addPass(n);const e={uniforms:{tDiffuse:{value:null},uBHCount:hA.uBHCount,uBHPos:hA.uBHPos,uBHMass:hA.uBHMass,uBHRadius:hA.uBHRadius,uAspect:{value:window.innerWidth/Math.max(1,window.innerHeight)}},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform sampler2D tDiffuse;
            uniform int uBHCount;
            uniform vec2 uBHPos[${mi}];
            uniform float uBHMass[${mi}];
            uniform float uBHRadius[${mi}];
            uniform float uAspect;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float shadowMask = 0.0;
                for(int i = 0; i < ${mi}; i++) {
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
        `};yt=new Bu(e),(A=yt==null?void 0:yt.material)!=null&&A.uniforms&&(yt.material.uniforms.uBHCount=hA.uBHCount,yt.material.uniforms.uBHPos=hA.uBHPos,yt.material.uniforms.uBHMass=hA.uBHMass,yt.material.uniforms.uBHRadius=hA.uBHRadius),yt.enabled=U.useSchwarzschildLensing,PA.addPass(yt);const t={uniforms:{tDiffuse:{value:null},curvature:{value:new Ue(3,3)},uFlash:{value:0}},vertexShader:`
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
        `};Oo=new Bu(t),PA.addPass(Oo)}function mI(n="unknown"){var a,o,l,c;const e=document.getElementById("canvas-container");if(!e||!$e||!ve)return;const t=ve.position.clone(),A=ve.quaternion.clone(),i=((o=(a=de==null?void 0:de.target)==null?void 0:a.clone)==null?void 0:o.call(a))||new F,r=(de==null?void 0:de.enabled)??!0;RA.clear(),yi=!1,Wn=!1,EA=null,Gn=!1;try{(l=de==null?void 0:de.dispose)==null||l.call(de)}catch{}const s=j==null?void 0:j.domElement;if(s){try{const u=s.getContext("webgl2")||s.getContext("webgl"),f=u&&u.getExtension("WEBGL_lose_context");f&&f.loseContext()}catch{}try{e.removeChild(s)}catch{}}try{(c=j==null?void 0:j.dispose)==null||c.call(j)}catch{}try{j=new du({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),j.xr.enabled=!0}catch(u){console.error("Graphics rebuild failed:",n,u);return}e.appendChild(j.domElement),$m(),i0(),hl(),de=new Mg(ve,j.domElement),de.enableDamping=!0,de.dampingFactor=.05,de.autoRotate=!0,de.autoRotateSpeed=.2,de.enableZoom=!1,de.enableZoom=!1,de.enabled=r,de.target.copy(i),ve.position.copy(t),ve.quaternion.copy(A),Si(U.viewLevel),de.update(),n0(),Ps();try{j.compile($e,ve)}catch{}j.setAnimationLoop(m0),s0()}function i0(){j.xr.addEventListener("sessionstart",()=>{try{j.resetState()}catch{}ve&&de?(xA={pos:ve.position.clone(),quat:ve.quaternion.clone(),target:de.target.clone(),fov:ve.fov,near:ve.near,far:ve.far,zoom:ve.zoom,controlsEnabled:de.enabled,controlsAutoRotate:de.autoRotate},de.enabled=!1,de.autoRotate=!1):xA=null;try{!(T!=null&&T.anchor)||!(T!=null&&T.mesh)?Gf():hl(),Ko(!0),Vf(),A0(performance.now())}catch(n){console.warn("VR UI init failed:",n)}Hf.getDelta()}),j.xr.addEventListener("sessionend",()=>{var e;try{Ko(!1)}catch{}const n=j;try{j.setRenderTarget(null),j.resetState()}catch{}try{(e=PA==null?void 0:PA.reset)==null||e.call(PA)}catch{}xA&&ve&&de&&(ve.position.copy(xA.pos),ve.quaternion.copy(xA.quat),ve.fov=xA.fov,ve.near=xA.near,ve.far=xA.far,ve.zoom=xA.zoom,ve.updateProjectionMatrix(),ve.updateMatrixWorld(!0),de.target.copy(xA.target),de.enabled=xA.controlsEnabled,de.autoRotate=xA.controlsAutoRotate,de.update()),xA=null,co=3;try{j.clear(!0,!0,!0),j.render($e,ve)}catch{}setTimeout(()=>{j===n&&mI("xr sessionend")},50)})}function r0(){if(RA.clear(),yi=!1,Wn=!1,EA=null,Gn=!1,Ec!==null&&Ec>=0?U.pixelationFactor=Ec:U.pixelationFactor=Math.max(1,Math.floor(window.innerWidth/750)),Us&&(Us.value=U.pixelationFactor),Ms&&(Ms.innerText=U.pixelationFactor),An!=null&&An.qualityLevel&&Ti[An.qualityLevel]){const e=Ti[An.qualityLevel];U.qualityLevel=An.qualityLevel,lt.starCount=e.starCount,lt.clusterCount=e.clusterCount,lt.densityRes=e.densityRes||lt.densityRes}const n=document.getElementById("canvas-container");for(;n.firstChild;){if(n.firstChild.tagName==="CANVAS")try{const e=n.firstChild.getContext("webgl2")||n.firstChild.getContext("webgl");e&&e.getExtension("WEBGL_lose_context")&&e.getExtension("WEBGL_lose_context").loseContext()}catch{}n.removeChild(n.firstChild)}j&&(j.dispose(),j=null);try{const e=document.createElement("canvas"),t=e.getContext("webgl2",{antialias:!1,powerPreference:"high-performance"}),A={antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0};t?(j=new du({...A,canvas:e,context:t}),console.log("[Universes] WebGL2 active (volume renderer enabled).")):(j=new du(A),console.warn("[Universes] WebGL2 unavailable, falling back to mote renderer.")),j.xr.enabled=!0}catch(e){console.error("Critical: WebGL Renderer could not be initialized.",e);return}n.appendChild(j.domElement),$m(),i0(),$e=new M_,$e.background=new Ke(0),$e.fog=new Bf(0,1e-9),ve=new yA(55,window.innerWidth/window.innerHeight,.1,1e30),de=new Mg(ve,j.domElement),de.enableDamping=!0,de.dampingFactor=.05,de.autoRotate=!0,de.autoRotateSpeed=.2,n0(),Ps(),tn=new Ug,lo=new Ue,Ye=new qA,Ye.visible=!1,$e.add(Ye),nt=new qA,$e.add(nt),gt=new qA,$e.add(gt),Gf(),tf.value=U.timeScale,rf(lt.seed),U.universeSimTime=0,U.bigBangFlash=1,Si(0),ko.style.display="none",zo.style.display="none";try{j.compile($e,ve)}catch{}j.setAnimationLoop(m0),window.removeEventListener("resize",Vp),window.addEventListener("resize",Vp),s0(),An&&(Z1(An),An=null)}function s0(){za&&document.removeEventListener("mousemove",za),za=i=>{lr&&(lr.style.transform=`translate(${i.clientX}px, ${i.clientY}px)`),!Gn&&yc.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Gn=!0)},document.addEventListener("mousemove",za),Ka&&document.body.removeEventListener("mouseover",Ka),Ka=i=>{i.target.matches("button, input, .panel-close, label, a, .clickable")?(lr.classList.add("active"),lr.innerHTML="&#8629;"):(lr.classList.remove("active"),lr.innerHTML="")},document.body.addEventListener("mouseover",Ka),j.domElement.addEventListener("pointerdown",i=>{RA.add(i.pointerId),yi=yi||RA.size>1,Wn=!0,EA=i.pointerId,Gn=RA.size>1,yc.set(i.clientX,i.clientY),U.inspectingTarget||(U.trackingTarget=null)}),j.domElement.addEventListener("pointermove",i=>{Wn&&(EA!==null&&i.pointerId!==EA||!Gn&&yc.distanceTo(new Ue(i.clientX,i.clientY))>5&&(Gn=!0))}),j.domElement.addEventListener("pointercancel",i=>{RA.delete(i.pointerId),EA===i.pointerId&&(EA=null),RA.size===0?(Wn=!1,EA=null,yi=!1):(Wn=!0,EA===null&&(EA=RA.values().next().value))}),j.domElement.addEventListener("pointerup",FI),Wa&&j.domElement.removeEventListener("wheel",Wa),Wa=i=>{var s;if(!ve||!de||(s=j==null?void 0:j.xr)!=null&&s.isPresenting||i.deltaY===0)return;i.preventDefault();const r=i.deltaY>0?1.1:.9;$r.copy(ve.position).sub(de.target),$r.lengthSq()<1e-12&&$r.set(0,0,1),$r.multiplyScalar(r),ve.position.copy(de.target).add($r),de.update(),a0()},j.domElement.addEventListener("wheel",Wa,{passive:!1});const n=(i,r)=>{const s=document.getElementById(i);if(!s)return;const a=s.cloneNode(!0);return s.parentNode.replaceChild(a,s),a.addEventListener("click",r),a};n("reset-btn",()=>void rf(Math.floor(Math.random()*1e4))),n("bang-btn",()=>{An=J1(),r0()}),ef=n("pause-btn",()=>{U.isPaused=!U.isPaused,ef.textContent=U.isPaused?"RESUME SIM":"PAUSE SIM",U.isPaused||Hf.getDelta()}),rn=n("back-btn",()=>{if(U.inspectingTarget){U.inspectingTarget=null,U.inspectingTargetPreviousPos=null,de.target.set(0,0,0),Si(U.viewLevel),rn.textContent=U.viewLevel===2?"BACK TO GALAXY":"BACK TO UNIVERSE";return}o0()}),n("alert-dismiss",()=>{fl.style.display="none",U.isTransitioning&&l0()});const e=[ko,zo,Af,DA],t=i=>{window.innerWidth<=768&&e.forEach(r=>{r!==i&&(r.style.display="none")})},A=(i,r)=>{const s=document.getElementById(i),a=document.getElementById(r);if(!s||!a)return;const o=s.cloneNode(!0);return s.parentNode.replaceChild(o,s),o.addEventListener("click",()=>{const l=a.style.display!=="flex";l&&t(a),a.style.display=l?"flex":"none"}),o};Vo=A("status-toggle-btn","stats-panel")||Vo,A("sim-toggle-btn","controls-panel"),A("config-btn","config-modal"),aI.onclick=()=>ko.style.display="none",oI.onclick=()=>zo.style.display="none",sI.onclick=()=>Af.style.display="none",lI.onclick=()=>{DA.style.display="none",U.selectedTarget=null,U.isAutopilot&&(U.autopilotPanelHidden=!0)},n("loc-btn",()=>{if(U.autopilotPanelHidden=!1,DA.style.display==="flex"){DA.style.display="none";return}t(DA);let i=null;if(U.viewLevel===0)i={designation:`UNIVERSE 0x${lt.seed.toString(16).toUpperCase()}`,type:"COSMIC WEB",age:U.universeSimTime.toFixed(2),mass:`${lt.starCount.toLocaleString()} OBJECTS`,radius:`${(St.UNIVERSE/FA.MLY).toFixed(1)} MLY`,lum:"N/A",composition:`SEED: 0x${lt.seed.toString(16).toUpperCase()}
OBJECTS: ${lt.starCount.toLocaleString()}`};else if(U.viewLevel===1)i=U.activeGalaxyData;else if(U.viewLevel===2)if(U.inspectingTarget&&U.inspectingTarget.userData&&U.inspectingTarget.userData.type){const r=U.inspectingTarget;i={designation:r.userData.designation||"UNKNOWN",type:r.userData.type||"UNKNOWN",age:U.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:r.userData.composition||"ANALYZING..."}}else i=U.activeSystemData;i&&UA(i,!0)}),dI.onclick=()=>{var i;if(U.selectedTarget)if(DA.style.display="none",U.selectedTarget.level===0)Ui(U.selectedTarget.position,1);else if(U.selectedTarget.level===1){const r=U.selectedTarget.data||{};if(r.isNebula&&!r.isNursery){U.inspectingTarget=U.selectedTarget.object,U.trackingTarget=null,U.inspectingTargetPreviousPos=U.inspectingTarget.position.clone(),de.target.copy(U.inspectingTarget.position);const a=(((i=U.inspectingTarget.userData)==null?void 0:i.radius)||10*FA.LY)*1.6,o=Math.random()*Math.PI*2,l=Math.random()*Math.PI*.35+.2;ve.position.set(U.inspectingTarget.position.x+a*Math.sin(l)*Math.cos(o),U.inspectingTarget.position.y+a*Math.cos(l),U.inspectingTarget.position.z+a*Math.sin(l)*Math.sin(o)),rn.textContent="LEAVE ORBIT"}else Ui(U.selectedTarget.position,2)}else U.selectedTarget.level===2&&(U.inspectingTarget=U.selectedTarget.object,U.trackingTarget=null,U.inspectingTargetPreviousPos=U.inspectingTarget.position.clone(),kf(U.inspectingTarget),rn.textContent="LEAVE ORBIT")},document.querySelectorAll(".q-btn").forEach(i=>{const r=i.cloneNode(!0);i.parentNode.replaceChild(r,i),r.addEventListener("click",s=>{document.querySelectorAll(".q-btn").forEach(l=>l.classList.remove("active")),s.target.classList.add("active");const a=s.target.getAttribute("data-q"),o=Ti[a];o&&(U.qualityLevel=a,lt.starCount=o.starCount,lt.clusterCount=o.clusterCount,lt.densityRes=o.densityRes||lt.densityRes,qm(),U.viewLevel===0?rf(lt.seed):U.viewLevel===1&&g0(U.currentGalaxyType))})}),Us.oninput=i=>{U.pixelationFactor=parseInt(i.target.value),Ms.innerText=U.pixelationFactor,Ps()},_r.onchange=i=>i.target.checked?Go.classList.add("crt-effects"):Go.classList.remove("crt-effects"),Bs&&(Bs.checked=U.useSchwarzschildLensing,Bs.onchange=i=>{U.useSchwarzschildLensing=i.target.checked,yt&&(yt.enabled=U.useSchwarzschildLensing)}),bs.onchange=i=>{U.isAutopilot=i.target.checked,U.isAutopilot&&(U.autopilotNextAction=0,U.inspectingTarget=null,U.autopilotPanelHidden=!1),U.isAutopilot&&U.viewLevel===1&&U.autopilotPriorityTargets.length===0&&Zm()},vs&&(U.showTravelPath=vs.checked,vs.onchange=i=>{U.showTravelPath=i.target.checked,ul()}),document.getElementById("timestep-slider").oninput=i=>U.timeScale=parseFloat(i.target.value)}function Ps(){var A,i,r;if(!j||!PA)return;ve&&(ve.aspect=window.innerWidth/window.innerHeight,ve.updateProjectionMatrix());const n=U.pixelationFactor===0?1:U.pixelationFactor*.8+1,e=Math.floor(window.innerWidth/n),t=Math.floor(window.innerHeight/n);j.setSize(e,t,!1),PA.setSize(e,t),j.domElement.style.width="100vw",j.domElement.style.height="100vh",dt&&(dt.material.uniforms.uPixelRatio.value=j.getPixelRatio(),dt.material.uniforms.uScreenHeight.value=t),ze&&(ze.material.uniforms.uPixelRatio.value=j.getPixelRatio(),ze.material.uniforms.uScreenHeight.value=t),(A=gt==null?void 0:gt.children)!=null&&A.length&&gt.children.forEach(s=>{var a,o;(o=(a=s==null?void 0:s.material)==null?void 0:a.uniforms)!=null&&o.uPixelRatio&&(s.material.uniforms.uPixelRatio.value=j.getPixelRatio(),s.material.uniforms.uScreenHeight.value=t)}),(r=(i=yt==null?void 0:yt.material)==null?void 0:i.uniforms)!=null&&r.uAspect&&(yt.material.uniforms.uAspect.value=e/Math.max(1,t))}function Vp(){Ps()}function Si(n){n===0?(de.maxDistance=1/0,de.minDistance=0,de.zoomSpeed=1,rn.disabled=!0,rn.textContent="RETURN TO ORBIT"):n===1?(de.maxDistance=1/0,de.minDistance=0,de.zoomSpeed=2,rn.disabled=!1,rn.textContent="BACK TO UNIVERSE"):n===2&&(de.maxDistance=1/0,de.minDistance=0,de.zoomSpeed=3,rn.disabled=!1,rn.textContent="BACK TO GALAXY"),ve.updateProjectionMatrix()}function BI(n){var A,i;if(!n)return 1;const e=(A=n.userData)==null?void 0:A.radiusM;if(Number.isFinite(e)&&e>0)return e;const t=n.geometry;if(t){t.boundingSphere||t.computeBoundingSphere();const r=(i=t.boundingSphere)==null?void 0:i.radius;if(Number.isFinite(r)&&r>0)return r}return 1}function kf(n){var s,a;if(!ve||!de||!n)return;const e=BI(n),t=!!((s=n.userData)!=null&&s.type),A=!!((a=n.userData)!=null&&a.isStar),r=Math.max(e*(t?10:A?200:6),e*2);jr.copy(ve.position).sub(n.position),jr.lengthSq()<1e-6&&jr.set(0,1,1),jr.normalize(),ve.position.copy(n.position).addScaledVector(jr,r),de.target.copy(n.position),de.update()}function a0(){var t;if(!ve||!de||(t=j==null?void 0:j.xr)!=null&&t.isPresenting)return;const n=.1,e=St.UNIVERSE*10;(ve.near!==n||ve.far!==e)&&(ve.near=n,ve.far=e,ve.updateProjectionMatrix())}function vI(){var A,i;if(!ve||!de||(A=j==null?void 0:j.xr)!=null&&A.isPresenting||U.isTransitioning)return;const n=U.viewLevel===2?St.SYSTEM*.25:U.viewLevel===1?St.GALAXY*.1:St.GALAXY*1.5;if(ve.position.length()<n)return;const e=ve.position.clone();ve.position.sub(e),de.target.sub(e),U.transitionTarget&&U.transitionTarget.sub(e),(i=U.selectedTarget)!=null&&i.position&&U.selectedTarget.position.sub(e),U.inspectingTargetPreviousPos&&U.inspectingTargetPreviousPos.sub(e),U.worldOffset.add(e);const t=r=>{r!=null&&r.position&&r.position.sub(e)};t(dt),t(Ht),t(ze),t(Ye),t(nt),t(Ze),t(Dt),t(G1),t(gt),X1(e),de.update()}function wI(){if(U.galaxySimTime=0,U.isPaused=!1,U.isTransitioning=!1,U.viewLevel=0,U.worldOffset.set(0,0,0),U.selectedTarget=null,U.activeGalaxyData=null,U.activeSystemData=null,U.autopilotPriorityTargets=[],U.lastGalaxyVisitTime=0,U.visitedSystemsCount=0,U.planetTourIndex=0,U.trackingTarget=null,U.inspectingTarget=null,U.inspectingTargetPreviousPos=null,U.bigBangFlash=0,Zt=[],Bi=[],Ir=[],hA.uBHCount.value=0,jm.style.display="block",dt&&dt.position.set(0,0,0),Ht){Ht.visible=!0;const e=(Ht.userData.baseScale||1)/3;Ei.forEach(t=>t.scale.setScalar(e))}ze&&(ze.visible=!1),Ye&&(Ye.visible=!1),nt&&nt.clear(),Y1(),U.showTravelPath&&SA.push(U.worldOffset.clone()),ys.forEach(n=>{n&&(gt==null||gt.remove(n),n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose())}),ys.length=0,gt&&gt.position.set(0,0,0),Ze&&($e.remove(Ze),Ze.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),Ze=null),nf(),Zn.forEach(n=>{n&&(Ye==null||Ye.remove(n),n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose())}),Zn.length=0,ms=0,ve.position.set(0,St.UNIVERSE*.1,St.UNIVERSE*.2),de.target.set(0,0,0),Si(0),de.autoRotate=!0,de.enabled=!0,ef.textContent="PAUSE SIM",fl.style.display="none",DA.style.display="none"}function o0(){U.isTransitioning||(DA.style.display="none",U.viewLevel===2?Ui(new F(0,St.GALAXY*.5,0),1,!0):U.viewLevel===1&&Ui(new F(0,St.UNIVERSE*.1,0),0,!0))}function Ui(n,e,t=!1){if(!U.isTransitioning)if(U.isTransitioning=!0,U.transitionTarget.copy(n),U.transitionData=!t&&U.selectedTarget?U.selectedTarget.data:null,U.nextLevel=e,U.transitionProgress=0,de.enabled=!1,fl.style.display="block",(!U.isAutopilot||t)&&(DA.style.display="none"),t)Ic.innerText="LEAVING GRAVITY WELL",xr.innerText="ACCELERATING TO ESCAPE VELOCITY...";else{const A=Math.floor(Math.abs(n.x+n.y)).toString(16).toUpperCase();e===1?(Ic.innerText="APPROACHING GALAXY",xr.innerText=`SECTOR ${A} :: HYPERDRIVE ENGAGED`):(Ic.innerText="APPROACHING SYSTEM",xr.innerText=`STAR ${A} :: ORBITAL INSERTION`)}}function l0(){var i,r,s,a;const n=U.nextLevel,e=U.viewLevel,t=U.worldOffset.clone();U.viewLevel=n,U.isTransitioning=!1,de.enabled=!0,fl.style.display="none";const A=new F().copy(U.transitionTarget);if(Ir=[],hA.uBHCount.value=0,n<e&&e===1&&n===0&&j1(),n<e&&(U.inspectingTarget=null,U.inspectingTargetPreviousPos=null,U.trackingTarget=null),Ht&&(Ht.visible=!0),n>e?U.transitionData?(n===1&&(U.activeGalaxyData=U.transitionData),n===2&&(U.activeSystemData=U.transitionData)):U.selectedTarget&&U.selectedTarget.data&&(n===1&&(U.activeGalaxyData=U.selectedTarget.data),n===2&&(U.activeSystemData=U.selectedTarget.data)):(n===1&&(U.activeSystemData=null),n===0&&(U.activeGalaxyData=null)),n===2&&n>e)if((r=(i=U.selectedTarget)==null?void 0:i.data)!=null&&r.isNebula)U.activeNebula=U.selectedTarget.data;else{const o=tI(A);U.activeNebula=((s=o==null?void 0:o.userData)==null?void 0:s.data)||null}else n!==2&&(U.activeNebula=null);if(jm.style.display="block",n>e&&(ve.position.sub(A),de.target.sub(A),dt&&dt.position.sub(A),Ht&&Ht.position.sub(A),n===2&&ze&&ze.position.sub(A),n===2&&nt&&nt.position.sub(A),n===2&&Ze&&Ze.position.sub(A),$1(A)),n===2&&(U.planetTourIndex=0),n===0)ze&&(ze.visible=!1),Ye&&(Ye.visible=!1),nt&&(nt.visible=!1),Ze&&(Ze.visible=!1),nf(),Zn.forEach(o=>{o&&(Ye==null||Ye.remove(o),o.geometry&&o.geometry.dispose(),o.material&&o.material.dispose())}),Zn.length=0,ms=0,Si(0),xr.innerText="INTERGALACTIC SPACE";else if(n===1){if(Ye&&(Ye.visible=!1),!ze||e===0){const o=U.universeSimTime;U.currentGalaxyType=o<3?2:o>10?1:0,g0(U.currentGalaxyType)}if(ze&&(ze.visible=!0,n>e&&ze.position.set(0,0,0)),nt&&(nt.visible=!0,n>e&&nt.position.set(0,0,0)),nt.children.length>0&&Ir.push(nt.children[0]),Ze&&(Ze.visible=!0,n>e&&Ze.position.set(0,0,0)),e===0&&Zm(),n>e){if(U.isAutopilot){const o=St.GALAXY*1.5,l=Math.random()*Math.PI*2,c=Math.random()*Math.PI*.5+.1;ve.position.set(o*Math.sin(c)*Math.cos(l),o*Math.cos(c),o*Math.sin(c)*Math.sin(l)),U.autopilotZooming=!0}else ve.position.set(0,St.GALAXY*.8,St.GALAXY*.4);de.target.set(0,0,0)}Si(1),xr.innerText="ARRIVED AT LOCAL GALAXY"}else if(n===2){if(nt&&(nt.visible=!1),Ze&&(Ze.visible=!1),UI(A),Ye&&(Ye.visible=!0,Ye.position.set(0,0,0)),nf(),(a=U.activeNebula)!=null&&a.isNursery){const l=(.5+Math.random()*2)*FA.LY,c=Math.floor(Math.random()*1e5),u=new Ke(.3,.75,.9),f=14+Math.floor(Math.random()*8);Dt=p0({seed:c,radius:l,tint:u,chunkCount:f}),Dt&&(Dt.userData.radius=l,Dt.userData.velocity=new F,Dt.position.set(0,0,0),Dt.visible=!0,$e.add(Dt))}if(U.isAutopilot){const l=St.SYSTEM*1.5,c=Math.random()*Math.PI*2,u=Math.random()*Math.PI*.5+.1;ve.position.set(l*Math.sin(u)*Math.cos(c),l*Math.cos(u),l*Math.sin(u)*Math.sin(c)),U.autopilotZooming=!0,U.planetTourIndex=0}else ve.position.set(0,St.SYSTEM*.4,St.SYSTEM*.8);de.target.set(0,0,0),Si(2),xr.innerText="SYSTEM ORBIT STABLE";const o=Ye.children.find(l=>{var c,u;return((c=l.userData)==null?void 0:c.isStar)&&!((u=l.userData)!=null&&u.isBlackHole)})||Ye.children.find(l=>{var c;return(c=l.userData)==null?void 0:c.isStar});o&&kf(o)}U.isAutopilot&&n>0&&!U.autopilotPanelHidden&&(DA.style.display="flex",n===1&&U.activeGalaxyData&&UA(U.activeGalaxyData,!0),n===2&&U.activeSystemData&&UA(U.activeSystemData,!0)),n>e&&U.worldOffset.add(A),n>e&&(n===1||n===2)&&(U.showTravelPath&&SA.length===0&&SA.push(t),W1(U.worldOffset.clone())),gt&&(gt.visible=n===0),eI()}function CI(n,e,t){const A=t-e;if(A<.05)return{state:"PROTO",age:A,classObj:n};if(A<n.lifespan)return{state:"MAIN",age:A,classObj:n};if(A<n.lifespan*1.1)return{state:"GIANT",age:A,classObj:n};let i;if(n.id==="O"||n.id==="B")i=Math.random()>.5?"BH":"N";else if(n.id==="A"||n.id==="F"||n.id==="G")i="WD";else return{state:"MAIN",age:A,classObj:n};return{state:"REMNANT",age:A,classObj:sn.find(r=>r.id===i)}}function c0(n,e){let t=n;const A=()=>{const o=Math.sin(t++)*1e4;return o-Math.floor(o)};let i,r,s;e?(i=70+A()*10,r=24+A()*4,s=100-(i+r)):(i=74+A()*5,r=23+A()*2,s=100-(i+r)),s<0&&(s=0);const a=["O","C","Ne","Fe","N","Si","Mg","S"][Math.floor(A()*8)];return`COMPOSITION:
H: ${i.toFixed(2)}% | He: ${r.toFixed(2)}% | Met: ${s.toFixed(2)}%
Trace: ${a}`}function u0(n){let e=n;const t=()=>{const o=Math.sin(e++)*1e4;return o-Math.floor(o)};let A=sn[sn.length-2],i=0;const r=t();for(let o=0;o<sn.length-3;o++)if(i+=sn[o].prob,r<i){A=sn[o];break}const s=CI(A,t()*U.universeSimTime,U.universeSimTime),a=[];for(let o=0;o<10;o++)a.push({pos:t()*100,intensity:t()});return{designation:`HIP-${Math.floor(t()*1e5)}`,typeObj:s.classObj,state:s.state,age:s.age.toFixed(3),mass:s.classObj.mass,radius:s.classObj.rad,lum:s.classObj.lum,spectrum:a,composition:c0(n,!0)}}function f0(n,e){let t=n;const A=()=>{const a=Math.sin(t++)*1e4;return a-Math.floor(a)};let i="SPIRAL GALAXY";e<3?A()>.3?i="IRREGULAR GALAXY":A()>.5?i="QUASAR (AGN)":i="PROTO-GALAXY":e>10&&(A()>.4?i="ELLIPTICAL GALAXY":i="LENTICULAR GALAXY");const s=St.GALAXY/FA.KLY*(.6+A()*.8);return{designation:`NGC-${Math.floor(A()*5e3)}`,type:i,age:e.toFixed(2),mass:(A()*50+10).toFixed(1)+" Billion",radius:s.toFixed(1)+" kly",lum:"HIGH",spectrum:[],composition:c0(n,!1)}}function UA(n,e=!1){if(window.innerWidth<=768&&[ko,zo,Af].forEach(s=>s.style.display="none"),cI.innerText=e?"CURRENT LOCATION":"TARGET ANALYSIS",uI.innerText=n.designation,fI.innerText=n.age+" Bn YR",n.typeObj){let s=`CLASS ${n.typeObj.id}`;n.state==="PROTO"?s+=" (PROTO-STAR)":n.state==="GIANT"?s+=" (RED GIANT)":n.state==="REMNANT"&&(s+=" (REMNANT)"),Za.innerText=s,Za.style.color=n.typeObj.id==="BH"?"#0f0":"#"+n.typeObj.color.toString(16).padStart(6,"0"),Rp.innerText=n.mass+" M☉",Dp.innerText=n.radius+" R☉",Pp.innerText=n.lum+" L☉"}else Za.innerText=n.type,Za.style.color="#0f0",Rp.innerText=n.mass+" M☉",Dp.innerText=n.radius,Pp.innerText="VAR";Hp.innerHTML="";let t=0;for(let s=0;s<n.designation.length;s++)t+=n.designation.charCodeAt(s);const A=()=>{const s=Math.sin(t++)*1e4;return s-Math.floor(s)},i=["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0088ff","#ff00ff"],r=5+Math.floor(A()*8);for(let s=0;s<r;s++){const a=document.createElement("div");a.className="spec-line";const o=Math.floor(A()*95/5)*5;a.style.left=o+"%",a.style.backgroundColor=i[Math.floor(o/100*i.length)],Hp.appendChild(a)}hI.innerText=n.composition||"ANALYZING...",e?document.getElementById("warp-btn").style.display="none":(document.getElementById("warp-btn").style.display="block",n.isNebula&&U.viewLevel===1?document.getElementById("warp-btn").innerText=n.isNursery?"ENTER NURSERY":"INSPECT NEBULA":document.getElementById("warp-btn").innerText=U.viewLevel===2?"INSPECT ORBIT":"INITIATE HYPERDRIVE"),U.isAutopilot&&U.autopilotPanelHidden?DA.style.display="none":DA.style.display="flex"}function h0(n,e,t,A){const i=new an(n,64,64),r=new vi({color:0});r.colorWrite=!1,r.depthWrite=!1,r.depthTest=!1,r.transparent=!0,r.opacity=0;const s=new xt(i,r);s.position.set(e,t,A),s.userData.isBlackHole=!0,s.userData.ehRadius=n;const a=new jo(n*1.5,n*8,128),o=new Kt({uniforms:{uTime:{value:0},uEHRadius:{value:n},uInnerRadius:{value:n*1.5},uOuterRadius:{value:n*8}},side:MA,transparent:!0,blending:GA,depthWrite:!1,vertexShader:`
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
            ${gi}
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
        `}),l=new xt(a,o);return l.rotation.x=Math.PI/2,s.add(l),s}function d0(){Ht&&($e.remove(Ht),Ht=null);for(const n of Ei)n.geometry&&n.geometry.dispose();for(const n of ju)n&&n.dispose();oo&&oo.dispose(),Ei=[],ju=[],oo=null}function zf(){var e,t;if(!j)return!1;const n=(e=j.getContext)==null?void 0:e.call(j);return!!((t=j.capabilities)!=null&&t.isWebGL2||n&&typeof n.texImage3D=="function")}function xI({density:n,resolution:e,scale:t}){if(!zf()||!n||!e)return!1;d0();const A=new df(n,e,e,e);A.format=Xo,A.type=jA,A.minFilter=jt,A.magFilter=jt,A.wrapS=bA,A.wrapT=bA,A.wrapR=bA,A.unpackAlignment=1,A.needsUpdate=!0,oo=A,Ht=new qA,Ht.userData.baseScale=t*2,$e.add(Ht);const i=new Li(1,1,1),r=Ht.userData.baseScale/3,s=1/3;for(let a=0;a<3;a++)for(let o=0;o<3;o++)for(let l=0;l<3;l++){const c=new F(l/3,o/3,a/3),u=new Kt({glslVersion:go,uniforms:{uDensity:{value:A},uCameraLocal:{value:new F},uTexOffset:{value:c},uTexScale:{value:s},uStepSize:{value:1/e*2.2*3},uDensityScale:{value:.75},uTime:{value:0}},vertexShader:`
                        out vec3 vLocalPos;
                        void main() {
                            vLocalPos = position;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,fragmentShader:`
                        precision highp float;
                        precision highp sampler3D;
                        uniform sampler3D uDensity;
                        uniform vec3 uCameraLocal;
                        uniform vec3 uTexOffset;
                        uniform float uTexScale;
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
                            vec3 rayOrigin = uCameraLocal;
                            // vLocalPos is on back face (exit point), compute proper ray direction
                            vec3 rayDir = normalize(vLocalPos - rayOrigin);

                            // Compute entry point - either front face intersection or camera if inside
                            vec2 hit = intersectBox(rayOrigin, rayDir);

                            // Skip invalid rays
                            if (hit.y < 0.0 || hit.y <= hit.x) discard;

                            float t = max(hit.x, 0.0);
                            float tEnd = hit.y;
                            vec3 color = vec3(0.0);
                            float alpha = 0.0;

                            for (int i = 0; i < 64; i++) {
                                if (t > tEnd || alpha > 0.97) break;
                                vec3 p = rayOrigin + rayDir * t;
                                // Map local [-0.5, 0.5] to this sub-volume's texture region
                                vec3 texPos = uTexOffset + (p + vec3(0.5)) * uTexScale;

                                if (any(lessThan(texPos, vec3(0.0))) || any(greaterThan(texPos, vec3(1.0)))) {
                                    t += uStepSize;
                                    continue;
                                }

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
                    `,transparent:!0,depthWrite:!1,depthTest:!0,blending:GA,side:tA});ju.push(u);const f=new xt(i,u);f.frustumCulled=!1,f.renderOrder=-100,f.scale.setScalar(r),f.position.set((l-1)*r,(o-1)*r,(a-1)*r);const p=new ut,g=new F;if(f.onBeforeRender=(m,d,h)=>{f.updateMatrixWorld(),p.copy(f.matrixWorld).invert(),g.copy(h.position).applyMatrix4(p),u.uniforms.uCameraLocal.value.copy(g),u.uniforms.uTime.value=U.universeSimTime},Ei.push(f),Ht.add(f),H1){const m=new Q_(i),d=$u(),h=new b_(m,d);h.scale.copy(f.scale),h.position.copy(f.position),h.renderOrder=1e3,Ht.add(h)}}return!0}function _I(n,e){const t=No(e),A=new Uint8Array(n*n*n),i=n*.5,r=t()*Math.PI*2,s=10+Math.floor(t()*8),a=[];for(let o=0;o<s;o++)a.push({x:(t()*2-1)*.55,y:(t()*2-1)*.55,z:(t()*2-1)*.55,radius:.18+t()*.35,strength:.5+t()*.9});for(let o=0;o<n;o++){const l=(o-i)/i;for(let c=0;c<n;c++){const u=(c-i)/i;for(let f=0;f<n;f++){const p=(f-i)/i;let g=0;for(let C=0;C<a.length;C++){const b=a[C],y=p-b.x,M=u-b.y,R=l-b.z,E=y*y+M*M+R*R;g+=b.strength*Math.exp(-E/(b.radius*b.radius))}const m=Math.abs(Math.sin((p*3.1+u*4.7+l*2.9+r)*4.2)),d=Math.abs(Math.sin((p*7.3+u*5.1+l*6.5+r*.7)*2.1));g=g*(.65+.35*m)+.15*d;const h=Math.max(0,1-Math.max(Math.abs(p),Math.abs(u),Math.abs(l))*1.2);g*=h;const B=Math.min(1,g),w=f+c*n+o*n*n;A[w]=Math.max(0,Math.min(255,Math.round(Math.pow(B,.85)*255)))}}}return{density:A,resolution:n}}function EI({density:n,resolution:e,radius:t,tint:A}){if(!zf())return null;const i=new df(n,e,e,e);i.format=Xo,i.type=jA,i.minFilter=jt,i.magFilter=jt,i.wrapS=bA,i.wrapT=bA,i.wrapR=bA,i.unpackAlignment=1,i.needsUpdate=!0;const r=new Ke(A),s=new Kt({glslVersion:go,uniforms:{uDensity:{value:i},uCameraLocal:{value:new F},uStepSize:{value:1/e*2.4},uDensityScale:{value:.85},uTime:{value:0},uTint:{value:r}},vertexShader:`
            out vec3 vLocalPos;
            void main() {
                vLocalPos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            precision highp float;
            precision highp sampler3D;
            uniform sampler3D uDensity;
            uniform vec3 uCameraLocal;
            uniform float uStepSize;
            uniform float uDensityScale;
            uniform float uTime;
            uniform vec3 uTint;
            in vec3 vLocalPos;
            out vec4 fragColor;
            ${gi}

            vec2 intersectBox(vec3 rayOrigin, vec3 rayDir) {
                vec3 boundsMin = vec3(-0.5);
                vec3 boundsMax = vec3(0.5);
                vec3 invDir = 1.0 / (rayDir + vec3(1e-10));
                vec3 t0 = (boundsMin - rayOrigin) * invDir;
                vec3 t1 = (boundsMax - rayOrigin) * invDir;
                vec3 tmin = min(t0, t1);
                vec3 tmax = max(t0, t1);
                float tNear = max(max(tmin.x, tmin.y), tmin.z);
                float tFar = min(min(tmax.x, tmax.y), tmax.z);
                return vec2(tNear, tFar);
            }

            void main() {
                // Camera position in local space computed on CPU with full precision
                vec3 rayOrigin = uCameraLocal;
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
        `,transparent:!0,depthWrite:!1,depthTest:!0,blending:GA,side:tA}),a=new Li(1,1,1),o=new xt(a,s);o.frustumCulled=!1,o.renderOrder=-100,o.scale.setScalar(t*2);const l=new ut,c=new F;return o.onBeforeRender=(u,f,p)=>{o.updateMatrixWorld(),l.copy(o.matrixWorld).invert(),c.copy(p.position).applyMatrix4(l),s.uniforms.uCameraLocal.value.copy(c),s.uniforms.uTime.value=U.universeSimTime},o}function p0({seed:n,radius:e,tint:t,chunkCount:A}){const i=No(n),r=new qA;r.userData.isNebula=!0,r.userData.radius=e;const s=2e3+i()*6e3;r.userData.velocity=Cr(i,s*Df);const a=[{type:"STELLAR NURSERY",isNursery:!0,composition:"H, He, dust, ionized gas"},{type:"MOLECULAR CLOUD",isNursery:!0,composition:"H2, CO, dust, cold gas"}],o=[{type:"EMISSION NEBULA",isNursery:!1,composition:"Ionized gas, dust"},{type:"REFLECTION NEBULA",isNursery:!1,composition:"Dust, neutral gas"},{type:"PLANETARY NEBULA",isNursery:!1,composition:"Ionized shells, dust"},{type:"SUPERNOVA REMNANT",isNursery:!1,composition:"Shock-heated gas, metals"},{type:"DARK NEBULA",isNursery:!1,composition:"Dense dust, cold gas"}],c=i()<.35?a[Math.floor(i()*a.length)]:o[Math.floor(i()*o.length)];r.userData.data={designation:`NEBULA-${n.toString(16).toUpperCase().slice(-4)}`,type:c.type,age:U.universeSimTime.toFixed(2),mass:`${(50+i()*120).toFixed(1)} Billion`,radius:`${(e/1e3).toFixed(1)} kly`,lum:"DIFFUSE",composition:c.composition,isNebula:!0,isNursery:c.isNursery};const u=A??10+Math.floor(i()*6),f=Cr(i,1);f.lengthSq()<.001&&f.set(1,0,0),f.normalize();const p=e*(.35+i()*.15),g=e*(.22+i()*.08);for(let m=0;m<u;m++){const d=n+m*37,h=No(d),B=e*(.08+h()*.18),w=f.clone().multiplyScalar((h()*2-1)*p),C=Cr(h,g*(.5+h()*.5)),b=w.add(C),y=_I(32,d);let M=EI({density:y.density,resolution:y.resolution,radius:B,tint:t});if(!M){const R=new an(B,16,16),E=new vi({color:t,transparent:!0,opacity:.2,depthWrite:!1});M=new xt(R,E)}M.position.copy(b),M.userData.nebulaChunk=!0,r.add(M)}return r}function nf(){Dt&&($e.remove(Dt),Dt.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}),Dt=null)}function yI(){var a;if(!Dt||!Ye)return;const n=((a=Dt.userData)==null?void 0:a.radius)||St.SYSTEM,e=Cr(Math.random,n*.5),t=Tr*(.2+Math.random()*.6),A=new an(t,24,24),i=new gu({color:16766634,emissive:16766634,emissiveIntensity:2}),r=new xt(A,i);r.position.copy(e),r.userData.nebulaStar=!0,r.userData.age=0,r.userData.life=12+Math.random()*8;const s=5e3+Math.random()*15e3;r.userData.velocity=Cr(Math.random,s*Df),Ye.add(r),Zn.push(r)}function SI({positions:n,colors:e,sizes:t},A={}){const i=new Gt;i.setAttribute("position",new $t(n,3)),i.setAttribute("color",new $t(e,3)),i.setAttribute("size",new $t(t,1));const r=new Kt({uniforms:{uTime:{value:0},uPixelRatio:{value:j.getPixelRatio()},uScreenHeight:{value:window.innerHeight},uOpacity:{value:1}},vertexShader:`
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
        `,depthWrite:!1,blending:GA,vertexColors:!0}),s=Number.isFinite(A.opacity)?Math.max(0,Math.min(1,A.opacity)):1,a=!!A.pickOnly;r.uniforms.uOpacity.value=s,r.opacity=s,r.transparent=s<1,r.colorWrite=!a,dt=new Eg(i,r),dt.frustumCulled=!1,dt.renderOrder=0,$e.add(dt)}async function rf(n){const e=++Qc;for(dt&&($e.remove(dt),dt.geometry.dispose(),dt.material.dispose(),dt=null),d0(),ze&&($e.remove(ze),ze.geometry.dispose(),ze.material&&ze.material.dispose(),ze=null);Ye.children.length>0;){const l=Ye.children[0];l.geometry&&l.geometry.dispose(),l.material&&l.material.dispose(),Ye.remove(l)}j&&j.renderLists.dispose(),wI(),lt.seed=n,rI.textContent="0x"+lt.seed.toString(16).toUpperCase(),iI.textContent=lt.starCount.toLocaleString();const t={seed:n,starCount:lt.starCount,clusterCount:lt.clusterCount,scale:St.UNIVERSE,filamentScatter:lt.filamentScatter},A=Math.max(24,Math.floor(lt.densityRes||96)),i=Math.min(P1,A);i!==A&&console.warn(`[Universes] densityRes clamped to ${i} (requested ${A}).`);let r=!1;if(zf()){const l={...t,resolution:i};let c=await qu("generateUniverseDensity",l);if(e!==Qc)return;c||(c=F1(l)),c!=null&&c.density&&(r=xI({...c,scale:t.scale}))}else Mp||(Mp=!0,console.warn("[Universes] Volume rendering unavailable (WebGL2 required)."));const s=Math.min(t.starCount,Math.max(5e4,Math.floor(t.starCount*.25))),a={...t,starCount:s};let o=await qu("generateUniverseData",a);e===Qc&&(o||(o=b1(a)),SI(o,{opacity:r?0:1,pickOnly:r}),r||(dt.material.uniforms.uOpacity.value=1,dt.material.opacity=1,dt.material.transparent=!1,dt.material.blending=GA))}async function g0(n=0){const e=++Np;ze&&($e.remove(ze),ze.geometry.dispose()),Ze&&($e.remove(Ze),Ze.traverse(u=>{u.geometry&&u.geometry.dispose(),u.material&&u.material.dispose()}),Ze=null),nt.clear();const t=lt.starCount,A=St.GALAXY,i={starCount:t,radius:A,type:n};let r=await qu("generateGalaxyData",i);if(e!==Np)return;r||(r=T1(i));const s=new Gt;s.setAttribute("position",new $t(r.positions,3)),s.setAttribute("color",new $t(r.colors,3)),s.setAttribute("size",new $t(r.sizes,1)),s.setAttribute("aOrbit",new $t(r.orbitParams,3));const a=new Kt({uniforms:{uPixelRatio:{value:j.getPixelRatio()},uTime:{value:0},uScreenHeight:{value:window.innerHeight}},vertexShader:`
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
        `,depthWrite:!1,blending:GA,vertexColors:!0,transparent:!0});if(ze=new Eg(s,a),ze.frustumCulled=!1,ze.renderOrder=0,ze.visible=U.viewLevel!==0,$e.add(ze),n!==1){const u=n===2?4:3;Ze=new qA,Ze.userData.nebulae=[];const f=Math.floor(Math.random()*1e5);for(let p=0;p<u;p++){const g=f+p*97,m=No(g),d=(5+m()*80)*FA.LY,h=Cr(m,A*(.35+m()*.45)),B=new Ke(.2+m()*.25,.5+m()*.3,.7+m()*.2),w=12+Math.floor(m()*8),C=p0({seed:g,radius:d,tint:B,chunkCount:w});C.position.copy(h),Ze.add(C),Ze.userData.nebulae.push(C)}Ze.visible=U.viewLevel===1,$e.add(Ze)}const o=Ss(),l=o.radiusM||Nf((o.massSolar||1e6)*Rf),c=h0(l,0,0,0);c.userData.massSolar=o.massSolar,nt.add(c),nt.visible=U.viewLevel!==0}function UI(n){var l,c,u;for(Zt=[],Bi=[],Ir=[],hA.uBHCount.value=0;Ye.children.length>0;){const f=Ye.children[0];f.geometry&&f.geometry.dispose(),f.material&&f.material.dispose(),Ye.remove(f)}Ho.length=0;let e=Math.abs(n.x+n.y+n.z);const t=()=>{const f=Math.sin(e++)*1e4;return f-Math.floor(f)},A=St.SYSTEM,i=z1(((l=U.activeSystemData)==null?void 0:l.typeObj)||((u=(c=U.selectedTarget)==null?void 0:c.data)==null?void 0:u.typeObj)),s=i.id==="BH"?1:t()>.6?t()>.9?3:2:1,a=[];for(let f=0;f<s;f++){const p=f===0?1:.5+t()*.5,g=f===0?i:sn[Math.max(0,Math.floor(t()*(sn.length-3)))],m=g.mass*p,d=g.rad*p,h=m*Rf;let B=d*Tr;const w=g.id==="BH";w&&(B=Math.max(Nf(h),Tr*.001));let C;if(w)C=h0(B,0,0,0),Ir.push(C),C.add(new jh(16755268,1e5,A*5)),C.add(new D_(2236979,.5));else{const b=k1(m),y=new an(B,64,64),M=new gu({color:g.color,emissive:g.color,emissiveIntensity:3.5+Math.log2(1+b)*1.2});M.toneMapped=!1,M.onBeforeCompile=D=>{D.uniforms.uTime={value:0},D.vertexShader=`
                    uniform float uTime; varying vec3 vCustomWorldPos; ${gi}
                `+D.vertexShader,D.vertexShader=D.vertexShader.replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
 vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),D.vertexShader=D.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>

                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.5)) + snoise(vec3(position * 0.5 - uTime * 0.2))) * 0.05 * ${B.toFixed(2)};
                    transformed += normal * disp;
                `),D.fragmentShader=`uniform float uTime; varying vec3 vCustomWorldPos; ${gi}`+D.fragmentShader,D.fragmentShader=D.fragmentShader.replace("#include <map_fragment>",`
                    float n = snoise(vec3(vCustomWorldPos * 0.1 + uTime * 0.2));
                    float bright = snoise(vec3(vCustomWorldPos * 0.3 + uTime * 0.5));
                    vec3 base = diffuseColor.rgb;
                    vec3 final = mix(base, base*0.3, smoothstep(0.4, 0.8, n));
                    final = mix(final, base*3.0, smoothstep(0.5, 0.9, bright));
                    diffuseColor.rgb = final;
                `),M.userData.shader=D},C=new xt(y,M);const R=new an(B*1.4,32,32),E=new Kt({uniforms:{uColor:{value:new Ke(g.color)},uBlend:{value:1}},transparent:!0,side:tA,blending:GA,vertexShader:"varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; uniform float uBlend; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6*uBlend); }"}),x=new xt(R,E);x.userData.isCorona=!0,Ho.push(x),C.add(x);const L=I1*b,z=new jh(g.color,L,0,2);z.userData.isStellarLight=!0,C.add(z)}C.userData.massKg=h,C.userData.radiusM=B,C.userData.isStar=!0,C.renderOrder=0,Ye.add(C),a.push({mesh:C,massKg:h})}if(a.length===1)Zt.push({mesh:a[0].mesh,massKg:a[0].massKg,velocity:new F(0,0,0),isStar:!0});else if(a.length>=2){const f=a[0].massKg,p=a[1].massKg,g=f+p,m=FA.AU*(.2+t()*4),d=m*(p/g),h=m*(f/g),B=Math.sqrt(Po*g/Math.pow(m,3)),w=B*d,C=B*h;a[0].mesh.position.set(-d,0,0),a[1].mesh.position.set(h,0,0),Zt.push({mesh:a[0].mesh,massKg:f,velocity:new F(0,0,w),isStar:!0}),Zt.push({mesh:a[1].mesh,massKg:p,velocity:new F(0,0,-C),isStar:!0});for(let b=2;b<a.length;b++)Zt.push({mesh:a[b].mesh,massKg:a[b].massKg,velocity:new F(0,0,0),isStar:!0})}const o=Math.floor(t()*5)+3;for(let f=0;f<o;f++){const m=((s>1?.6:.3)+f*.4+t()*.2)*FA.AU,d=f>2&&t()>.3,h=d?D1*(.4+t()*1.2):R1*(.4+t()*2.5),B=d?1300:5500,w=4/3*Math.PI*Math.pow(h,3)*B,C=!d,b=new an(h,64,64),y=new gu({color:new Ke().setHSL(t(),d?.8:.2,.5),roughness:.7});y.onBeforeCompile=O=>{O.uniforms.uTime={value:0},O.vertexShader=`varying vec3 vPos; ${gi}`+O.vertexShader,O.vertexShader=O.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vPos = position; ${C?`float h = snoise(position*0.2)*0.5 + snoise(position*1.0)*0.2; transformed += normal*h*${h.toFixed(2)}*0.1;`:""}`),O.fragmentShader=`uniform float uTime; varying vec3 vPos; ${gi}`+O.fragmentShader,O.fragmentShader=O.fragmentShader.replace("#include <map_fragment>",`
                float n = snoise(vPos * ${d?"2.0":"5.0"} + vec3(0.0, ${d?"uTime*0.5":"0.0"}, 0.0));
                ${d?`
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
            `),y.userData.shader=O};const M=new xt(b,y),R=t()*Math.PI*2;M.position.set(Math.cos(R)*m,0,Math.sin(R)*m);const E=new an(h*1.1,32,32),x=new Kt({uniforms:{uTime:{value:0},uIntensity:{value:0}},transparent:!0,blending:GA,side:MA,depthWrite:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform float uIntensity; varying vec2 vUv;
            void main() {
                if (uIntensity <= 0.01) discard;
                float pole = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
                float wave = sin(vUv.x * 20.0 + uTime * 5.0) * 0.5 + 0.5;
                gl_FragColor = vec4(0.2, 0.8, 0.4, uIntensity * pole * wave * 0.5);
            }`}),L=new xt(E,x);M.add(L),M.userData={designation:`PLANET ${String.fromCharCode(65+f)}`,type:d?"GAS GIANT":"ROCKY",aurora:x,radiusM:h,orbitRadiusM:m},M.renderOrder=0,Ye.add(M);const z=Zt.reduce((O,Z)=>O+(Z.isStar?Z.massKg:0),0),D=Math.sqrt(Po*z/m);Zt.push({mesh:M,massKg:w,velocity:new F(-Math.sin(R)*D,0,Math.cos(R)*D),isStar:!1})}}function MI(){var m,d;if(U.viewLevel!==2||!Ye.visible)return;const n=Zt.filter(h=>{var B,w;return h.isStar&&!((w=(B=h.mesh)==null?void 0:B.userData)!=null&&w.isBlackHole)});if(n.length===0)return;const e=n[Math.floor(Math.random()*n.length)].mesh,t=((m=e.userData)==null?void 0:m.radiusM)||Tr,A=(d=e.material)!=null&&d.color?e.material.color.clone():new Ke(16755268),i=new an(t*.2,32,32),r=new Kt({uniforms:{uTime:{value:0},uColor:{value:A}},transparent:!0,blending:GA,depthWrite:!1,vertexShader:"varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform vec3 uColor; varying vec3 vPos; ${gi}
        void main() {
            float n = snoise(vec3(vPos * 0.5 + uTime * 2.0));
            float alpha = smoothstep(0.0, 0.5, n);
            gl_FragColor = vec4(uColor, alpha * 0.8);
        }`}),s=new xt(i,r),a=new F(Math.random()-.5,Math.random()-.5,Math.random()-.5);a.lengthSq()<1e-4&&a.set(0,1,0),a.normalize();const o=Math.abs(a.y)>.8?new F(1,0,0):new F(0,1,0),l=new F().crossVectors(a,o).normalize(),c=new F().crossVectors(a,l).normalize(),u=t*(1.08+Math.random()*.25),f=t*(.03+Math.random()*.06),p=Math.random()*Math.PI*2,g=(.6+Math.random()*.9)/Math.max(.6,t/Tr);s.userData={star:e,orbitU:l,orbitV:c,angle:p,angularSpeed:g,radiusBase:u,radiusJitter:f,phase:Math.random()*Math.PI*2,age:0,life:6+Math.random()*4,mat:r},s.position.copy(e.position).addScaledVector(l,u),Ye.add(s),Bi.push(s)}function bI(n){const t=n/4,A=1e9;for(let i=0;i<4;i++){for(let r=0;r<Zt.length;r++){const s=Zt[r],a=new F;for(let o=0;o<Zt.length;o++){if(r===o)continue;const l=Zt[o],c=new F().subVectors(l.mesh.position,s.mesh.position),u=c.lengthSq()+A*A,f=1/Math.sqrt(u),p=f*f*f;a.addScaledVector(c,Po*(l.massKg||0)*p)}s.velocity.addScaledVector(a,t)}for(let r=0;r<Zt.length;r++){const s=Zt[r];s.mesh.position.addScaledVector(s.velocity,t)}}}function m0(){var s,a,o,l,c,u,f,p;const n=performance.now(),e=Hf.getDelta(),t=Math.min(e,.1)*U.timeScale;if(U.bigBangFlash>0&&(U.bigBangFlash-=e*.5,U.bigBangFlash<0&&(U.bigBangFlash=0),Oo&&(Oo.uniforms.uFlash.value=U.bigBangFlash)),!U.isPaused){if(U.viewLevel===0){if(U.universeSimTime+=t,dt&&(dt.material.uniforms.uTime.value=U.universeSimTime),(s=gt==null?void 0:gt.children)!=null&&s.length&&gt.children.forEach(g=>{var m,d;(d=(m=g==null?void 0:g.material)==null?void 0:m.uniforms)!=null&&d.uTime&&(g.material.uniforms.uTime.value=U.universeSimTime)}),Ht&&Ei.length>0){const g=Math.max(.08,1-Math.exp(-U.universeSimTime*2)),d=(Ht.userData.baseScale||1)/3*g;for(let h=0;h<Ei.length;h++){const B=Ei[h];B.scale.setScalar(d);const w=Math.floor(h/9),C=Math.floor(h%9/3),b=h%3;B.position.set((b-1)*d,(C-1)*d,(w-1)*d)}}}else if(U.viewLevel===1)U.galaxySimTime+=t,(o=(a=ze==null?void 0:ze.material)==null?void 0:a.uniforms)!=null&&o.uTime&&(ze.material.uniforms.uTime.value=U.galaxySimTime),Ze!=null&&Ze.visible&&Ze.children.forEach(g=>{var d,h;const m=(d=g==null?void 0:g.userData)==null?void 0:d.velocity;if(m&&g.position){const B=g.position.clone().multiplyScalar(-1),w=Math.max(1,B.length());B.normalize(),m.add(B.multiplyScalar(St.GALAXY/w*4e-7*t)),g.position.addScaledVector(m,t)}(h=g==null?void 0:g.traverse)==null||h.call(g,B=>{var w,C;(C=(w=B==null?void 0:B.material)==null?void 0:w.uniforms)!=null&&C.uTime&&(B.material.uniforms.uTime.value=U.galaxySimTime)})});else if(U.viewLevel===2){bI(t*Df);const g=Dt?.35:1;Ho.length&&Ho.forEach(m=>{var d,h;(h=(d=m==null?void 0:m.material)==null?void 0:d.uniforms)!=null&&h.uBlend&&(m.material.uniforms.uBlend.value=g)}),Math.random()<.005&&MI();for(let m=Bi.length-1;m>=0;m--){const d=Bi[m];d.userData.age+=t;const h=d.userData.star;if(!h||!h.parent){Ye.remove(d),Bi.splice(m,1);continue}d.userData.angle+=d.userData.angularSpeed*t;const B=d.userData.radiusBase+Math.sin(d.userData.age*2+d.userData.phase)*d.userData.radiusJitter;Uc.copy(d.userData.orbitU).multiplyScalar(Math.cos(d.userData.angle)),Uc.addScaledVector(d.userData.orbitV,Math.sin(d.userData.angle)),d.position.copy(h.position).addScaledVector(Uc,B),d.scale.setScalar(.9+d.userData.age*.35),d.userData.mat&&(d.userData.mat.uniforms.uTime.value+=e),Zt.forEach(w=>{!w.isStar&&w.mesh.userData.aurora&&(d.position.distanceTo(w.mesh.position)<30?w.mesh.userData.aurora.uniforms.uIntensity.value=1:w.mesh.userData.aurora.uniforms.uIntensity.value*=.98)}),d.userData.age>d.userData.life&&(Ye.remove(d),Bi.splice(m,1))}Zt.forEach(m=>{m.isStar||(m.mesh.rotation.y+=e*.1),m.mesh.userData.aurora&&(m.mesh.userData.aurora.uniforms.uTime.value+=e),m.mesh.material&&m.mesh.material.userData&&m.mesh.material.userData.shader&&(m.mesh.material.userData.shader.uniforms.uTime.value+=e)}),Dt&&((l=Dt.traverse)==null||l.call(Dt,m=>{var d,h;(h=(d=m==null?void 0:m.material)==null?void 0:d.uniforms)!=null&&h.uTime&&(m.material.uniforms.uTime.value=U.universeSimTime)}),ms+=t,ms>4+Math.random()*3&&(ms=0,Math.random()<.6&&yI()));for(let m=Zn.length-1;m>=0;m--){const d=Zn[m];d.userData.age+=t,d.position.addScaledVector(d.userData.velocity,t),d.userData.age>d.userData.life&&(Ye.remove(d),d.geometry&&d.geometry.dispose(),d.material&&d.material.dispose(),Zn.splice(m,1))}}}U.inspectingTarget&&de&&(U.inspectingTargetPreviousPos&&(Qp.copy(U.inspectingTarget.position).sub(U.inspectingTargetPreviousPos),ve.position.add(Qp)),de.target.copy(U.inspectingTarget.position),U.inspectingTargetPreviousPos&&U.inspectingTargetPreviousPos.copy(U.inspectingTarget.position));let A=0;if(Ir.forEach(g=>{var d,h;(d=g.children)==null||d.forEach(B=>{B&&B.material&&B.material.uniforms&&B.material.uniforms.uTime&&(B.material.uniforms.uTime.value+=e)});const m=g.getWorldPosition(V1);if(vn.copy(m).project(ve),vn.z>-1&&vn.z<1&&Math.abs(vn.x)<1.5&&Math.abs(vn.y)<1.5){hA.uBHPos.value[A].set(vn.x*.5+.5,vn.y*.5+.5);let B=.01,w=((h=g.userData)==null?void 0:h.ehRadius)??0;if(w>0){g.getWorldScale(Ip),w*=Ip.x,Tp.set(1,0,0).applyQuaternion(ve.quaternion).normalize(),Fp.copy(m).addScaledVector(Tp,w),Sc.copy(Fp).project(ve);const C=Sc.x-vn.x,b=Sc.y-vn.y;B=Math.max(Math.sqrt(C*C+b*b)*.5,25e-5)}hA.uBHRadius.value[A]=B,hA.uBHMass.value[A]=Math.min(6,2.5+B*90),A++}}),hA.uBHCount.value=A,yt&&(yt.enabled=U.useSchwarzschildLensing&&A>0,yt.material&&(yt.material.uniformsNeedUpdate=!0)),U.isAutopilot&&!U.isTransitioning){U.autopilotTimer+=e;let g=!0;if(U.viewLevel===0&&U.universeSimTime<1&&(g=!1),g&&U.autopilotTimer>U.autopilotNextAction){if(U.autopilotTimer=0,U.autopilotNextAction=5,U.viewLevel===0){if(dt){const m=dt.geometry.attributes.position,d=(m==null?void 0:m.count)||0;if(d>0){const h=Math.floor(Math.random()*d),B=new F(m.getX(h),m.getY(h),m.getZ(h)),w=f0(lt.seed+h,U.universeSimTime);U.selectedTarget={level:0,index:h,position:B,data:w},UA(w,!0),Ui(B,1)}}}else if(U.viewLevel===1){if(U.autopilotPriorityTargets.length>0){const m=U.autopilotPriorityTargets.shift();if(m&&m.object&&typeof m.object.getWorldPosition=="function"){m.object.getWorldPosition(pr);const d=pr.clone(),h=m.data||Ss();U.selectedTarget={level:1,object:m.object,position:d,data:h},UA(h,!0),Ui(d,2)}}else if(ze){const m=ze.geometry.attributes.position,d=(m==null?void 0:m.count)||0;if(d>0){const h=Math.floor(Math.random()*d),B=new F(m.getX(h),m.getY(h),m.getZ(h)),w=u0(h);U.selectedTarget={level:1,index:h,position:B,data:w},UA(w,!0),Ui(B,2)}}}else if(U.viewLevel===2){const m=Ye.children.filter(d=>d.userData&&d.userData.type);if(U.planetTourIndex<m.length){const d=m[U.planetTourIndex],h={designation:d.userData.designation,type:d.userData.type,age:U.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:"SILICATES/ICE"};U.selectedTarget={level:2,object:d,position:d.position,data:h},UA(h,!0),U.inspectingTarget=d,U.trackingTarget=null,U.inspectingTargetPreviousPos=d.position.clone(),kf(d),U.planetTourIndex++}else o0()}}}if(U.isTransitioning?(U.transitionProgress+=e,ve.position.lerp(U.transitionTarget,.05),de.target.lerp(U.transitionTarget,.05),U.transitionProgress>3&&l0()):de.update(),vI(),a0(),!!((c=j==null?void 0:j.xr)!=null&&c.isPresenting)?((!(T!=null&&T.anchor)||!(T!=null&&T.mesh))&&Gf(),T&&!T.visible&&(hl(),Ko(!0),Vf())):T!=null&&T.visible&&Ko(!1),A0(n),j&&!((u=j==null?void 0:j.xr)!=null&&u.isPresenting))try{j.setRenderTarget(null),j.setViewport(0,0,j.domElement.width,j.domElement.height),j.setScissorTest(!1)}catch{}(f=j==null?void 0:j.xr)!=null&&f.isPresenting||co>0?(j.render($e,ve),(p=j==null?void 0:j.xr)!=null&&p.isPresenting||(co=Math.max(0,co-1))):PA.render();const r=U.viewLevel===0?U.universeSimTime:U.galaxySimTime;Lp&&(Lp.innerText=r.toFixed(2)+" Bn YR"),Vo&&(Vo.innerText=`[ STATUS ${r.toFixed(2)}Bn ]`),ve&&(bc||Fc||Tc)&&(Ya.copy(ve.position).add(U.worldOffset),bc&&(bc.innerText=Mc(Ya.x)),Fc&&(Fc.innerText=Mc(Ya.y)),Tc&&(Tc.innerText=Mc(Ya.z))),nI.innerText=Math.round(1/(e||.001))}function FI(n){var t;if(RA.delete(n.pointerId),RA.size===0?(Wn=!1,EA=null):(Wn=!0,EA===n.pointerId&&(EA=RA.values().next().value)),yi){RA.size===0&&(yi=!1);return}if(Gn||n.target.closest("button")||n.target.closest(".hud-panel"))return;const e=j.domElement.getBoundingClientRect();if(lo.x=(n.clientX-e.left)/e.width*2-1,lo.y=-((n.clientY-e.top)/e.height)*2+1,tn.setFromCamera(lo,ve),U.viewLevel===0&&dt){tn.params.Points.threshold=St.GALAXY;const A=tn.intersectObject(dt);if(A.length>0){or();const i=A[0].index,r=f0(lt.seed+i,U.universeSimTime);U.selectedTarget={level:0,index:i,position:A[0].point,data:r},UA(r)}}else if(U.viewLevel===1&&ze){if(Ze&&Ze.visible){const r=tn.intersectObjects(Ze.children,!0);if(r.length>0){const s=AI(r[0].object);if(s){or();const a=((t=s.userData)==null?void 0:t.data)||{};U.selectedTarget={level:1,object:s,position:s.position.clone(),data:a},UA(a);return}}}const A=nt&&nt.visible&&nt.children.length>0?nt.children[0]:null;if(A){if(tn.intersectObject(A,!0).length>0){or();const s=Ss();A.getWorldPosition(pr),U.selectedTarget={level:1,object:A,position:pr.clone(),data:s},UA(s);return}if(Ja.copy(A.getWorldPosition(pr)).project(ve),Ja.z<1){const s=e.left+(Ja.x*.5+.5)*e.width,a=e.top+(-Ja.y*.5+.5)*e.height,o=Math.max(24,Math.min(e.width,e.height)*.06);if(Math.hypot(n.clientX-s,n.clientY-a)<=o){or();const l=Ss();U.selectedTarget={level:1,object:A,position:pr.clone(),data:l},UA(l);return}}}tn.params.Points.threshold=FA.AU;const i=tn.intersectObject(ze);if(i.length>0){or();const r=i[0].index,s=u0(r);U.selectedTarget={level:1,index:r,position:i[0].point,data:s},UA(s)}}else if(U.viewLevel===2&&Ye){tn.params.Points.threshold=1;const A=tn.intersectObjects(Ye.children);if(A.length>0){let i=A[0].object;if(!i.userData.type&&i.parent&&i.parent.userData.type&&(i=i.parent),i.userData.type){or();const r={designation:i.userData.designation,type:i.userData.type,age:U.universeSimTime.toFixed(2),mass:"0.003 M☉",radius:"0.01 R☉",lum:"0",composition:"Atmosphere: N2, O2"};U.selectedTarget={level:2,object:i,position:i.position,data:r},UA(r)}}}}
