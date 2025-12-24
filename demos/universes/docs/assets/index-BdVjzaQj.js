(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))A(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&A(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function A(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pc="167",ii={ROTATE:0,DOLLY:1,PAN:2},ri={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Cp=0,Kc=1,_p=2,fh=1,xp=2,XA=3,Mn=0,$t=1,uA=2,jA=0,Hi=1,en=2,kc=3,zc=4,Ep=5,Gn=100,yp=101,Up=102,Mp=103,Sp=104,Fp=200,Tp=201,bp=202,Qp=203,tl=204,Al=205,Ip=206,Lp=207,Rp=208,Dp=209,Hp=210,Pp=211,Np=212,Op=213,Gp=214,Vp=0,Kp=1,kp=2,ra=3,zp=4,Wp=5,Xp=6,Yp=7,hh=0,Jp=1,qp=2,xn=0,Zp=1,jp=2,$p=3,eg=4,tg=5,Ag=6,ng=7,dh=300,zi=301,Wi=302,nl=303,il=304,Fa=306,rl=1e3,kn=1001,sl=1002,CA=1003,ig=1004,kr=1005,fA=1006,qa=1007,zn=1008,tn=1009,ph=1010,gh=1011,Tr=1012,gc=1013,$n=1014,qA=1015,Zi=1016,mc=1017,Bc=1018,Xi=1020,mh=35902,Bh=1021,vh=1022,TA=1023,wh=1024,Ch=1025,Pi=1026,Yi=1027,_h=1028,vc=1029,xh=1030,wc=1031,Cc=1033,Ws=33776,Xs=33777,Ys=33778,Js=33779,al=35840,ol=35841,ll=35842,cl=35843,ul=36196,fl=37492,hl=37496,dl=37808,pl=37809,gl=37810,ml=37811,Bl=37812,vl=37813,wl=37814,Cl=37815,_l=37816,xl=37817,El=37818,yl=37819,Ul=37820,Ml=37821,qs=36492,Sl=36494,Fl=36495,Eh=36283,Tl=36284,bl=36285,Ql=36286,rg=3200,sg=3201,yh=0,ag=1,gn="",FA="srgb",bn="srgb-linear",_c="display-p3",Ta="display-p3-linear",sa="linear",lt="srgb",aa="rec709",oa="p3",si=7680,Wc=519,og=512,lg=513,cg=514,Uh=515,ug=516,fg=517,hg=518,dg=519,Xc=35044,Yc="300 es",ZA=2e3,la=2001;class ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const A=this._listeners;A[e]===void 0&&(A[e]=[]),A[e].indexOf(t)===-1&&A[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const A=this._listeners;return A[e]!==void 0&&A[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const A=this._listeners[e.type];if(A!==void 0){e.target=this;const i=A.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zs=Math.PI/180,Il=180/Math.PI;function Rr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,A=Math.random()*4294967295|0;return(kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[A&255]+kt[A>>8&255]+kt[A>>16&255]+kt[A>>24&255]).toLowerCase()}function jt(n,e,t){return Math.max(e,Math.min(t,n))}function pg(n,e){return(n%e+e)%e}function Za(n,e,t){return(1-t)*n+t*e}function tr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function tA(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const gg={DEG2RAD:Zs};class ye{constructor(e=0,t=0){ye.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,A=this.y,i=e.elements;return this.x=i[0]*t+i[3]*A+i[6],this.y=i[1]*t+i[4]*A+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(jt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y;return t*t+A*A}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const A=Math.cos(t),i=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*A-s*i+e.x,this.y=r*i+s*A+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,t,A,i,r,s,a,o,l){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l)}set(e,t,A,i,r,s,a,o,l){const c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=r,c[5]=o,c[6]=A,c[7]=s,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],this}extractBasis(e,t,A){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),A.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[3],o=A[6],l=A[1],c=A[4],u=A[7],f=A[2],d=A[5],g=A[8],m=i[0],p=i[3],h=i[6],C=i[1],v=i[4],y=i[7],I=i[2],U=i[5],M=i[8];return r[0]=s*m+a*C+o*I,r[3]=s*p+a*v+o*U,r[6]=s*h+a*y+o*M,r[1]=l*m+c*C+u*I,r[4]=l*p+c*v+u*U,r[7]=l*h+c*y+u*M,r[2]=f*m+d*C+g*I,r[5]=f*p+d*v+g*U,r[8]=f*h+d*y+g*M,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*s*c-t*a*l-A*r*c+A*a*o+i*r*l-i*s*o}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=c*s-a*l,f=a*o-c*r,d=l*r-s*o,g=t*u+A*f+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/g;return e[0]=u*m,e[1]=(i*l-c*A)*m,e[2]=(a*A-i*s)*m,e[3]=f*m,e[4]=(c*t-i*o)*m,e[5]=(i*r-a*t)*m,e[6]=d*m,e[7]=(A*o-l*t)*m,e[8]=(s*t-A*r)*m,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,A,i,r,s,a){const o=Math.cos(r),l=Math.sin(r);return this.set(A*o,A*l,-A*(o*s+l*a)+s+e,-i*l,i*o,-i*(-l*s+o*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ja.makeScale(e,t)),this}rotate(e){return this.premultiply(ja.makeRotation(-e)),this}translate(e,t){return this.premultiply(ja.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,A,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<9;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<9;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ja=new ke;function Mh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ca(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function mg(){const n=ca("canvas");return n.style.display="block",n}const Jc={};function xr(n){n in Jc||(Jc[n]=!0,console.warn(n))}function Bg(n,e,t){return new Promise(function(A,i){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:i();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:A()}}setTimeout(r,t)})}const qc=new ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Zc=new ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ar={[bn]:{transfer:sa,primaries:aa,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[FA]:{transfer:lt,primaries:aa,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Ta]:{transfer:sa,primaries:oa,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(Zc),fromReference:n=>n.applyMatrix3(qc)},[_c]:{transfer:lt,primaries:oa,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(Zc),fromReference:n=>n.applyMatrix3(qc).convertLinearToSRGB()}},vg=new Set([bn,Ta]),tt={enabled:!0,_workingColorSpace:bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!vg.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const A=Ar[e].toReference,i=Ar[t].fromReference;return i(A(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Ar[n].primaries},getTransfer:function(n){return n===gn?sa:Ar[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(Ar[e].luminanceCoefficients)}};function Ni(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function $a(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ai;class wg{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ai===void 0&&(ai=ca("canvas")),ai.width=e.width,ai.height=e.height;const A=ai.getContext("2d");e instanceof ImageData?A.putImageData(e,0,0):A.drawImage(e,0,0,e.width,e.height),t=ai}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ca("canvas");t.width=e.width,t.height=e.height;const A=t.getContext("2d");A.drawImage(e,0,0,e.width,e.height);const i=A.getImageData(0,0,e.width,e.height),r=i.data;for(let s=0;s<r.length;s++)r[s]=Ni(r[s]/255)*255;return A.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let A=0;A<t.length;A++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[A]=Math.floor(Ni(t[A]/255)*255):t[A]=Ni(t[A]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cg=0;class Sh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cg++}),this.uuid=Rr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const A={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let s=0,a=i.length;s<a;s++)i[s].isDataTexture?r.push(eo(i[s].image)):r.push(eo(i[s]))}else r=eo(i);A.url=r}return t||(e.images[this.uuid]=A),A}}function eo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?wg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _g=0;class eA extends ti{constructor(e=eA.DEFAULT_IMAGE,t=eA.DEFAULT_MAPPING,A=kn,i=kn,r=fA,s=zn,a=TA,o=tn,l=eA.DEFAULT_ANISOTROPY,c=gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_g++}),this.uuid=Rr(),this.name="",this.source=new Sh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=A,this.wrapT=i,this.magFilter=r,this.minFilter=s,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const A={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(A.userData=this.userData),t||(e.textures[this.uuid]=A),A}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==dh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rl:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case sl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rl:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case sl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}eA.DEFAULT_IMAGE=null;eA.DEFAULT_MAPPING=dh;eA.DEFAULT_ANISOTROPY=1;class ft{constructor(e=0,t=0,A=0,i=1){ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=A,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,A,i){return this.x=e,this.y=t,this.z=A,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*A+s[8]*i+s[12]*r,this.y=s[1]*t+s[5]*A+s[9]*i+s[13]*r,this.z=s[2]*t+s[6]*A+s[10]*i+s[14]*r,this.w=s[3]*t+s[7]*A+s[11]*i+s[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,A,i,r;const o=e.elements,l=o[0],c=o[4],u=o[8],f=o[1],d=o[5],g=o[9],m=o[2],p=o[6],h=o[10];if(Math.abs(c-f)<.01&&Math.abs(u-m)<.01&&Math.abs(g-p)<.01){if(Math.abs(c+f)<.1&&Math.abs(u+m)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,y=(d+1)/2,I=(h+1)/2,U=(c+f)/4,M=(u+m)/4,R=(g+p)/4;return v>y&&v>I?v<.01?(A=0,i=.707106781,r=.707106781):(A=Math.sqrt(v),i=U/A,r=M/A):y>I?y<.01?(A=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),A=U/i,r=R/i):I<.01?(A=.707106781,i=.707106781,r=0):(r=Math.sqrt(I),A=M/r,i=R/r),this.set(A,i,r,t),this}let C=Math.sqrt((p-g)*(p-g)+(u-m)*(u-m)+(f-c)*(f-c));return Math.abs(C)<.001&&(C=1),this.x=(p-g)/C,this.y=(u-m)/C,this.z=(f-c)/C,this.w=Math.acos((l+d+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this.w=e.w+(t.w-e.w)*A,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class xg extends ti{constructor(e=1,t=1,A={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t);const i={width:e,height:t,depth:1};A=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fA,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},A);const r=new eA(i,A.mapping,A.wrapS,A.wrapT,A.magFilter,A.minFilter,A.format,A.type,A.anisotropy,A.colorSpace);r.flipY=!1,r.generateMipmaps=A.generateMipmaps,r.internalFormat=A.internalFormat,this.textures=[];const s=A.count;for(let a=0;a<s;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=A.depthBuffer,this.stencilBuffer=A.stencilBuffer,this.resolveDepthBuffer=A.resolveDepthBuffer,this.resolveStencilBuffer=A.resolveStencilBuffer,this.depthTexture=A.depthTexture,this.samples=A.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,A=1){if(this.width!==e||this.height!==t||this.depth!==A){this.width=e,this.height=t,this.depth=A;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=A;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let A=0,i=e.textures.length;A<i;A++)this.textures[A]=e.textures[A].clone(),this.textures[A].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Sh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends xg{constructor(e=1,t=1,A={}){super(e,t,A),this.isWebGLRenderTarget=!0}}class Fh extends eA{constructor(e=null,t=1,A=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=CA,this.minFilter=CA,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Eg extends eA{constructor(e=null,t=1,A=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:A,depth:i},this.magFilter=CA,this.minFilter=CA,this.wrapR=kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ei{constructor(e=0,t=0,A=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=A,this._w=i}static slerpFlat(e,t,A,i,r,s,a){let o=A[i+0],l=A[i+1],c=A[i+2],u=A[i+3];const f=r[s+0],d=r[s+1],g=r[s+2],m=r[s+3];if(a===0){e[t+0]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=m;return}if(u!==m||o!==f||l!==d||c!==g){let p=1-a;const h=o*f+l*d+c*g+u*m,C=h>=0?1:-1,v=1-h*h;if(v>Number.EPSILON){const I=Math.sqrt(v),U=Math.atan2(I,h*C);p=Math.sin(p*U)/I,a=Math.sin(a*U)/I}const y=a*C;if(o=o*p+f*y,l=l*p+d*y,c=c*p+g*y,u=u*p+m*y,p===1-a){const I=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=I,l*=I,c*=I,u*=I}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,A,i,r,s){const a=A[i],o=A[i+1],l=A[i+2],c=A[i+3],u=r[s],f=r[s+1],d=r[s+2],g=r[s+3];return e[t]=a*g+c*u+o*d-l*f,e[t+1]=o*g+c*f+l*u-a*d,e[t+2]=l*g+c*d+a*f-o*u,e[t+3]=c*g-a*u-o*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,A,i){return this._x=e,this._y=t,this._z=A,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const A=e._x,i=e._y,r=e._z,s=e._order,a=Math.cos,o=Math.sin,l=a(A/2),c=a(i/2),u=a(r/2),f=o(A/2),d=o(i/2),g=o(r/2);switch(s){case"XYZ":this._x=f*c*u+l*d*g,this._y=l*d*u-f*c*g,this._z=l*c*g+f*d*u,this._w=l*c*u-f*d*g;break;case"YXZ":this._x=f*c*u+l*d*g,this._y=l*d*u-f*c*g,this._z=l*c*g-f*d*u,this._w=l*c*u+f*d*g;break;case"ZXY":this._x=f*c*u-l*d*g,this._y=l*d*u+f*c*g,this._z=l*c*g+f*d*u,this._w=l*c*u-f*d*g;break;case"ZYX":this._x=f*c*u-l*d*g,this._y=l*d*u+f*c*g,this._z=l*c*g-f*d*u,this._w=l*c*u+f*d*g;break;case"YZX":this._x=f*c*u+l*d*g,this._y=l*d*u+f*c*g,this._z=l*c*g-f*d*u,this._w=l*c*u-f*d*g;break;case"XZY":this._x=f*c*u-l*d*g,this._y=l*d*u-f*c*g,this._z=l*c*g+f*d*u,this._w=l*c*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const A=t/2,i=Math.sin(A);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(A),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,A=t[0],i=t[4],r=t[8],s=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10],f=A+a+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(c-o)*d,this._y=(r-l)*d,this._z=(s-i)*d}else if(A>a&&A>u){const d=2*Math.sqrt(1+A-a-u);this._w=(c-o)/d,this._x=.25*d,this._y=(i+s)/d,this._z=(r+l)/d}else if(a>u){const d=2*Math.sqrt(1+a-A-u);this._w=(r-l)/d,this._x=(i+s)/d,this._y=.25*d,this._z=(o+c)/d}else{const d=2*Math.sqrt(1+u-A-a);this._w=(s-i)/d,this._x=(r+l)/d,this._y=(o+c)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let A=e.dot(t)+1;return A<Number.EPSILON?(A=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=A):(this._x=0,this._y=-e.z,this._z=e.y,this._w=A)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=A),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(jt(this.dot(e),-1,1)))}rotateTowards(e,t){const A=this.angleTo(e);if(A===0)return this;const i=Math.min(1,t/A);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const A=e._x,i=e._y,r=e._z,s=e._w,a=t._x,o=t._y,l=t._z,c=t._w;return this._x=A*c+s*a+i*l-r*o,this._y=i*c+s*o+r*a-A*l,this._z=r*c+s*l+A*o-i*a,this._w=s*c-A*a-i*o-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const A=this._x,i=this._y,r=this._z,s=this._w;let a=s*e._w+A*e._x+i*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=s,this._x=A,this._y=i,this._z=r,this;const o=1-a*a;if(o<=Number.EPSILON){const d=1-t;return this._w=d*s+t*this._w,this._x=d*A+t*this._x,this._y=d*i+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const l=Math.sqrt(o),c=Math.atan2(l,a),u=Math.sin((1-t)*c)/l,f=Math.sin(t*c)/l;return this._w=s*u+this._w*f,this._x=A*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,A){return this.copy(e).slerp(t,A)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),A=Math.random(),i=Math.sqrt(1-A),r=Math.sqrt(A);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Q{constructor(e=0,t=0,A=0){Q.prototype.isVector3=!0,this.x=e,this.y=t,this.z=A}set(e,t,A){return A===void 0&&(A=this.z),this.x=e,this.y=t,this.z=A,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*A+r[6]*i,this.y=r[1]*t+r[4]*A+r[7]*i,this.z=r[2]*t+r[5]*A+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,A=this.y,i=this.z,r=e.elements,s=1/(r[3]*t+r[7]*A+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*A+r[8]*i+r[12])*s,this.y=(r[1]*t+r[5]*A+r[9]*i+r[13])*s,this.z=(r[2]*t+r[6]*A+r[10]*i+r[14])*s,this}applyQuaternion(e){const t=this.x,A=this.y,i=this.z,r=e.x,s=e.y,a=e.z,o=e.w,l=2*(s*i-a*A),c=2*(a*t-r*i),u=2*(r*A-s*t);return this.x=t+o*l+s*u-a*c,this.y=A+o*c+a*l-r*u,this.z=i+o*u+r*c-s*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,A=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*A+r[8]*i,this.y=r[1]*t+r[5]*A+r[9]*i,this.z=r[2]*t+r[6]*A+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const A=this.length();return this.divideScalar(A||1).multiplyScalar(Math.max(e,Math.min(t,A)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,A){return this.x=e.x+(t.x-e.x)*A,this.y=e.y+(t.y-e.y)*A,this.z=e.z+(t.z-e.z)*A,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const A=e.x,i=e.y,r=e.z,s=t.x,a=t.y,o=t.z;return this.x=i*o-r*a,this.y=r*s-A*o,this.z=A*a-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const A=e.dot(this)/t;return this.copy(e).multiplyScalar(A)}projectOnPlane(e){return to.copy(this).projectOnVector(e),this.sub(to)}reflect(e){return this.sub(to.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const A=this.dot(e)/t;return Math.acos(jt(A,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,A=this.y-e.y,i=this.z-e.z;return t*t+A*A+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,A){const i=Math.sin(t)*e;return this.x=i*Math.sin(A),this.y=Math.cos(t)*e,this.z=i*Math.cos(A),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,A){return this.x=e*Math.sin(t),this.y=A,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),A=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=A,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,A=Math.sqrt(1-t*t);return this.x=A*Math.cos(e),this.y=t,this.z=A*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const to=new Q,jc=new ei;class Dr{constructor(e=new Q(1/0,1/0,1/0),t=new Q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t+=3)this.expandByPoint(yA.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,A=e.count;t<A;t++)this.expandByPoint(yA.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,A=e.length;t<A;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const A=yA.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(A),this.max.copy(e).add(A),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const A=e.geometry;if(A!==void 0){const r=A.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,a=r.count;s<a;s++)e.isMesh===!0?e.getVertexPosition(s,yA):yA.fromBufferAttribute(r,s),yA.applyMatrix4(e.matrixWorld),this.expandByPoint(yA);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zr.copy(e.boundingBox)):(A.boundingBox===null&&A.computeBoundingBox(),zr.copy(A.boundingBox)),zr.applyMatrix4(e.matrixWorld),this.union(zr)}const i=e.children;for(let r=0,s=i.length;r<s;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,yA),yA.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,A;return e.normal.x>0?(t=e.normal.x*this.min.x,A=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,A=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,A+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,A+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,A+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,A+=e.normal.z*this.min.z),t<=-e.constant&&A>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(nr),Wr.subVectors(this.max,nr),oi.subVectors(e.a,nr),li.subVectors(e.b,nr),ci.subVectors(e.c,nr),sn.subVectors(li,oi),an.subVectors(ci,li),In.subVectors(oi,ci);let t=[0,-sn.z,sn.y,0,-an.z,an.y,0,-In.z,In.y,sn.z,0,-sn.x,an.z,0,-an.x,In.z,0,-In.x,-sn.y,sn.x,0,-an.y,an.x,0,-In.y,In.x,0];return!Ao(t,oi,li,ci,Wr)||(t=[1,0,0,0,1,0,0,0,1],!Ao(t,oi,li,ci,Wr))?!1:(Xr.crossVectors(sn,an),t=[Xr.x,Xr.y,Xr.z],Ao(t,oi,li,ci,Wr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,yA).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(yA).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(OA[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),OA[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),OA[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),OA[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),OA[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),OA[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),OA[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),OA[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(OA),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const OA=[new Q,new Q,new Q,new Q,new Q,new Q,new Q,new Q],yA=new Q,zr=new Dr,oi=new Q,li=new Q,ci=new Q,sn=new Q,an=new Q,In=new Q,nr=new Q,Wr=new Q,Xr=new Q,Ln=new Q;function Ao(n,e,t,A,i){for(let r=0,s=n.length-3;r<=s;r+=3){Ln.fromArray(n,r);const a=i.x*Math.abs(Ln.x)+i.y*Math.abs(Ln.y)+i.z*Math.abs(Ln.z),o=e.dot(Ln),l=t.dot(Ln),c=A.dot(Ln);if(Math.max(-Math.max(o,l,c),Math.min(o,l,c))>a)return!1}return!0}const yg=new Dr,ir=new Q,no=new Q;class Hr{constructor(e=new Q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const A=this.center;t!==void 0?A.copy(t):yg.setFromPoints(e).getCenter(A);let i=0;for(let r=0,s=e.length;r<s;r++)i=Math.max(i,A.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const A=this.center.distanceToSquared(e);return t.copy(e),A>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ir.subVectors(e,this.center);const t=ir.lengthSq();if(t>this.radius*this.radius){const A=Math.sqrt(t),i=(A-this.radius)*.5;this.center.addScaledVector(ir,i/A),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(no.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ir.copy(e.center).add(no)),this.expandByPoint(ir.copy(e.center).sub(no))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const GA=new Q,io=new Q,Yr=new Q,on=new Q,ro=new Q,Jr=new Q,so=new Q;class Pr{constructor(e=new Q,t=new Q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,GA)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const A=t.dot(this.direction);return A<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,A)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=GA.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(GA.copy(this.origin).addScaledVector(this.direction,t),GA.distanceToSquared(e))}distanceSqToSegment(e,t,A,i){io.copy(e).add(t).multiplyScalar(.5),Yr.copy(t).sub(e).normalize(),on.copy(this.origin).sub(io);const r=e.distanceTo(t)*.5,s=-this.direction.dot(Yr),a=on.dot(this.direction),o=-on.dot(Yr),l=on.lengthSq(),c=Math.abs(1-s*s);let u,f,d,g;if(c>0)if(u=s*o-a,f=s*a-o,g=r*c,u>=0)if(f>=-g)if(f<=g){const m=1/c;u*=m,f*=m,d=u*(u+s*f+2*a)+f*(s*u+f+2*o)+l}else f=r,u=Math.max(0,-(s*f+a)),d=-u*u+f*(f+2*o)+l;else f=-r,u=Math.max(0,-(s*f+a)),d=-u*u+f*(f+2*o)+l;else f<=-g?(u=Math.max(0,-(-s*r+a)),f=u>0?-r:Math.min(Math.max(-r,-o),r),d=-u*u+f*(f+2*o)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-o),r),d=f*(f+2*o)+l):(u=Math.max(0,-(s*r+a)),f=u>0?r:Math.min(Math.max(-r,-o),r),d=-u*u+f*(f+2*o)+l);else f=s>0?-r:r,u=Math.max(0,-(s*f+a)),d=-u*u+f*(f+2*o)+l;return A&&A.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(io).addScaledVector(Yr,f),d}intersectSphere(e,t){GA.subVectors(e.center,this.origin);const A=GA.dot(this.direction),i=GA.dot(GA)-A*A,r=e.radius*e.radius;if(i>r)return null;const s=Math.sqrt(r-i),a=A-s,o=A+s;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const A=-(this.origin.dot(e.normal)+e.constant)/t;return A>=0?A:null}intersectPlane(e,t){const A=this.distanceToPlane(e);return A===null?null:this.at(A,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let A,i,r,s,a,o;const l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(A=(e.min.x-f.x)*l,i=(e.max.x-f.x)*l):(A=(e.max.x-f.x)*l,i=(e.min.x-f.x)*l),c>=0?(r=(e.min.y-f.y)*c,s=(e.max.y-f.y)*c):(r=(e.max.y-f.y)*c,s=(e.min.y-f.y)*c),A>s||r>i||((r>A||isNaN(A))&&(A=r),(s<i||isNaN(i))&&(i=s),u>=0?(a=(e.min.z-f.z)*u,o=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,o=(e.min.z-f.z)*u),A>o||a>i)||((a>A||A!==A)&&(A=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(A>=0?A:i,t)}intersectsBox(e){return this.intersectBox(e,GA)!==null}intersectTriangle(e,t,A,i,r){ro.subVectors(t,e),Jr.subVectors(A,e),so.crossVectors(ro,Jr);let s=this.direction.dot(so),a;if(s>0){if(i)return null;a=1}else if(s<0)a=-1,s=-s;else return null;on.subVectors(this.origin,e);const o=a*this.direction.dot(Jr.crossVectors(on,Jr));if(o<0)return null;const l=a*this.direction.dot(ro.cross(on));if(l<0||o+l>s)return null;const c=-a*on.dot(so);return c<0?null:this.at(c/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class at{constructor(e,t,A,i,r,s,a,o,l,c,u,f,d,g,m,p){at.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,A,i,r,s,a,o,l,c,u,f,d,g,m,p)}set(e,t,A,i,r,s,a,o,l,c,u,f,d,g,m,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=A,h[12]=i,h[1]=r,h[5]=s,h[9]=a,h[13]=o,h[2]=l,h[6]=c,h[10]=u,h[14]=f,h[3]=d,h[7]=g,h[11]=m,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new at().fromArray(this.elements)}copy(e){const t=this.elements,A=e.elements;return t[0]=A[0],t[1]=A[1],t[2]=A[2],t[3]=A[3],t[4]=A[4],t[5]=A[5],t[6]=A[6],t[7]=A[7],t[8]=A[8],t[9]=A[9],t[10]=A[10],t[11]=A[11],t[12]=A[12],t[13]=A[13],t[14]=A[14],t[15]=A[15],this}copyPosition(e){const t=this.elements,A=e.elements;return t[12]=A[12],t[13]=A[13],t[14]=A[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,A){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),A.setFromMatrixColumn(this,2),this}makeBasis(e,t,A){return this.set(e.x,t.x,A.x,0,e.y,t.y,A.y,0,e.z,t.z,A.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,A=e.elements,i=1/ui.setFromMatrixColumn(e,0).length(),r=1/ui.setFromMatrixColumn(e,1).length(),s=1/ui.setFromMatrixColumn(e,2).length();return t[0]=A[0]*i,t[1]=A[1]*i,t[2]=A[2]*i,t[3]=0,t[4]=A[4]*r,t[5]=A[5]*r,t[6]=A[6]*r,t[7]=0,t[8]=A[8]*s,t[9]=A[9]*s,t[10]=A[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,A=e.x,i=e.y,r=e.z,s=Math.cos(A),a=Math.sin(A),o=Math.cos(i),l=Math.sin(i),c=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=s*c,d=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=-o*u,t[8]=l,t[1]=d+g*l,t[5]=f-m*l,t[9]=-a*o,t[2]=m-f*l,t[6]=g+d*l,t[10]=s*o}else if(e.order==="YXZ"){const f=o*c,d=o*u,g=l*c,m=l*u;t[0]=f+m*a,t[4]=g*a-d,t[8]=s*l,t[1]=s*u,t[5]=s*c,t[9]=-a,t[2]=d*a-g,t[6]=m+f*a,t[10]=s*o}else if(e.order==="ZXY"){const f=o*c,d=o*u,g=l*c,m=l*u;t[0]=f-m*a,t[4]=-s*u,t[8]=g+d*a,t[1]=d+g*a,t[5]=s*c,t[9]=m-f*a,t[2]=-s*l,t[6]=a,t[10]=s*o}else if(e.order==="ZYX"){const f=s*c,d=s*u,g=a*c,m=a*u;t[0]=o*c,t[4]=g*l-d,t[8]=f*l+m,t[1]=o*u,t[5]=m*l+f,t[9]=d*l-g,t[2]=-l,t[6]=a*o,t[10]=s*o}else if(e.order==="YZX"){const f=s*o,d=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=m-f*u,t[8]=g*u+d,t[1]=u,t[5]=s*c,t[9]=-a*c,t[2]=-l*c,t[6]=d*u+g,t[10]=f-m*u}else if(e.order==="XZY"){const f=s*o,d=s*l,g=a*o,m=a*l;t[0]=o*c,t[4]=-u,t[8]=l*c,t[1]=f*u+m,t[5]=s*c,t[9]=d*u-g,t[2]=g*u-d,t[6]=a*c,t[10]=m*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ug,e,Mg)}lookAt(e,t,A){const i=this.elements;return rA.subVectors(e,t),rA.lengthSq()===0&&(rA.z=1),rA.normalize(),ln.crossVectors(A,rA),ln.lengthSq()===0&&(Math.abs(A.z)===1?rA.x+=1e-4:rA.z+=1e-4,rA.normalize(),ln.crossVectors(A,rA)),ln.normalize(),qr.crossVectors(rA,ln),i[0]=ln.x,i[4]=qr.x,i[8]=rA.x,i[1]=ln.y,i[5]=qr.y,i[9]=rA.y,i[2]=ln.z,i[6]=qr.z,i[10]=rA.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const A=e.elements,i=t.elements,r=this.elements,s=A[0],a=A[4],o=A[8],l=A[12],c=A[1],u=A[5],f=A[9],d=A[13],g=A[2],m=A[6],p=A[10],h=A[14],C=A[3],v=A[7],y=A[11],I=A[15],U=i[0],M=i[4],R=i[8],x=i[12],_=i[1],b=i[5],k=i[9],P=i[13],Y=i[2],Z=i[6],W=i[10],q=i[14],X=i[3],se=i[7],ae=i[11],pe=i[15];return r[0]=s*U+a*_+o*Y+l*X,r[4]=s*M+a*b+o*Z+l*se,r[8]=s*R+a*k+o*W+l*ae,r[12]=s*x+a*P+o*q+l*pe,r[1]=c*U+u*_+f*Y+d*X,r[5]=c*M+u*b+f*Z+d*se,r[9]=c*R+u*k+f*W+d*ae,r[13]=c*x+u*P+f*q+d*pe,r[2]=g*U+m*_+p*Y+h*X,r[6]=g*M+m*b+p*Z+h*se,r[10]=g*R+m*k+p*W+h*ae,r[14]=g*x+m*P+p*q+h*pe,r[3]=C*U+v*_+y*Y+I*X,r[7]=C*M+v*b+y*Z+I*se,r[11]=C*R+v*k+y*W+I*ae,r[15]=C*x+v*P+y*q+I*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],A=e[4],i=e[8],r=e[12],s=e[1],a=e[5],o=e[9],l=e[13],c=e[2],u=e[6],f=e[10],d=e[14],g=e[3],m=e[7],p=e[11],h=e[15];return g*(+r*o*u-i*l*u-r*a*f+A*l*f+i*a*d-A*o*d)+m*(+t*o*d-t*l*f+r*s*f-i*s*d+i*l*c-r*o*c)+p*(+t*l*u-t*a*d-r*s*u+A*s*d+r*a*c-A*l*c)+h*(-i*a*c-t*o*u+t*a*f+i*s*u-A*s*f+A*o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,A){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=A),this}invert(){const e=this.elements,t=e[0],A=e[1],i=e[2],r=e[3],s=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=e[9],f=e[10],d=e[11],g=e[12],m=e[13],p=e[14],h=e[15],C=u*p*l-m*f*l+m*o*d-a*p*d-u*o*h+a*f*h,v=g*f*l-c*p*l-g*o*d+s*p*d+c*o*h-s*f*h,y=c*m*l-g*u*l+g*a*d-s*m*d-c*a*h+s*u*h,I=g*u*o-c*m*o-g*a*f+s*m*f+c*a*p-s*u*p,U=t*C+A*v+i*y+r*I;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const M=1/U;return e[0]=C*M,e[1]=(m*f*r-u*p*r-m*i*d+A*p*d+u*i*h-A*f*h)*M,e[2]=(a*p*r-m*o*r+m*i*l-A*p*l-a*i*h+A*o*h)*M,e[3]=(u*o*r-a*f*r-u*i*l+A*f*l+a*i*d-A*o*d)*M,e[4]=v*M,e[5]=(c*p*r-g*f*r+g*i*d-t*p*d-c*i*h+t*f*h)*M,e[6]=(g*o*r-s*p*r-g*i*l+t*p*l+s*i*h-t*o*h)*M,e[7]=(s*f*r-c*o*r+c*i*l-t*f*l-s*i*d+t*o*d)*M,e[8]=y*M,e[9]=(g*u*r-c*m*r-g*A*d+t*m*d+c*A*h-t*u*h)*M,e[10]=(s*m*r-g*a*r+g*A*l-t*m*l-s*A*h+t*a*h)*M,e[11]=(c*a*r-s*u*r-c*A*l+t*u*l+s*A*d-t*a*d)*M,e[12]=I*M,e[13]=(c*m*i-g*u*i+g*A*f-t*m*f-c*A*p+t*u*p)*M,e[14]=(g*a*i-s*m*i-g*A*o+t*m*o+s*A*p-t*a*p)*M,e[15]=(s*u*i-c*a*i+c*A*o-t*u*o-s*A*f+t*a*f)*M,this}scale(e){const t=this.elements,A=e.x,i=e.y,r=e.z;return t[0]*=A,t[4]*=i,t[8]*=r,t[1]*=A,t[5]*=i,t[9]*=r,t[2]*=A,t[6]*=i,t[10]*=r,t[3]*=A,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],A=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,A,i))}makeTranslation(e,t,A){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,A,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),A=Math.sin(e);return this.set(1,0,0,0,0,t,-A,0,0,A,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,0,A,0,0,1,0,0,-A,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),A=Math.sin(e);return this.set(t,-A,0,0,A,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const A=Math.cos(t),i=Math.sin(t),r=1-A,s=e.x,a=e.y,o=e.z,l=r*s,c=r*a;return this.set(l*s+A,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+A,c*o-i*s,0,l*o-i*a,c*o+i*s,r*o*o+A,0,0,0,0,1),this}makeScale(e,t,A){return this.set(e,0,0,0,0,t,0,0,0,0,A,0,0,0,0,1),this}makeShear(e,t,A,i,r,s){return this.set(1,A,r,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,A){const i=this.elements,r=t._x,s=t._y,a=t._z,o=t._w,l=r+r,c=s+s,u=a+a,f=r*l,d=r*c,g=r*u,m=s*c,p=s*u,h=a*u,C=o*l,v=o*c,y=o*u,I=A.x,U=A.y,M=A.z;return i[0]=(1-(m+h))*I,i[1]=(d+y)*I,i[2]=(g-v)*I,i[3]=0,i[4]=(d-y)*U,i[5]=(1-(f+h))*U,i[6]=(p+C)*U,i[7]=0,i[8]=(g+v)*M,i[9]=(p-C)*M,i[10]=(1-(f+m))*M,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,A){const i=this.elements;let r=ui.set(i[0],i[1],i[2]).length();const s=ui.set(i[4],i[5],i[6]).length(),a=ui.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],UA.copy(this);const l=1/r,c=1/s,u=1/a;return UA.elements[0]*=l,UA.elements[1]*=l,UA.elements[2]*=l,UA.elements[4]*=c,UA.elements[5]*=c,UA.elements[6]*=c,UA.elements[8]*=u,UA.elements[9]*=u,UA.elements[10]*=u,t.setFromRotationMatrix(UA),A.x=r,A.y=s,A.z=a,this}makePerspective(e,t,A,i,r,s,a=ZA){const o=this.elements,l=2*r/(t-e),c=2*r/(A-i),u=(t+e)/(t-e),f=(A+i)/(A-i);let d,g;if(a===ZA)d=-(s+r)/(s-r),g=-2*s*r/(s-r);else if(a===la)d=-s/(s-r),g=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return o[0]=l,o[4]=0,o[8]=u,o[12]=0,o[1]=0,o[5]=c,o[9]=f,o[13]=0,o[2]=0,o[6]=0,o[10]=d,o[14]=g,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(e,t,A,i,r,s,a=ZA){const o=this.elements,l=1/(t-e),c=1/(A-i),u=1/(s-r),f=(t+e)*l,d=(A+i)*c;let g,m;if(a===ZA)g=(s+r)*u,m=-2*u;else if(a===la)g=r*u,m=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return o[0]=2*l,o[4]=0,o[8]=0,o[12]=-f,o[1]=0,o[5]=2*c,o[9]=0,o[13]=-d,o[2]=0,o[6]=0,o[10]=m,o[14]=-g,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(e){const t=this.elements,A=e.elements;for(let i=0;i<16;i++)if(t[i]!==A[i])return!1;return!0}fromArray(e,t=0){for(let A=0;A<16;A++)this.elements[A]=e[A+t];return this}toArray(e=[],t=0){const A=this.elements;return e[t]=A[0],e[t+1]=A[1],e[t+2]=A[2],e[t+3]=A[3],e[t+4]=A[4],e[t+5]=A[5],e[t+6]=A[6],e[t+7]=A[7],e[t+8]=A[8],e[t+9]=A[9],e[t+10]=A[10],e[t+11]=A[11],e[t+12]=A[12],e[t+13]=A[13],e[t+14]=A[14],e[t+15]=A[15],e}}const ui=new Q,UA=new at,Ug=new Q(0,0,0),Mg=new Q(1,1,1),ln=new Q,qr=new Q,rA=new Q,$c=new at,eu=new ei;class DA{constructor(e=0,t=0,A=0,i=DA.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=A,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,A,i=this._order){return this._x=e,this._y=t,this._z=A,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,A=!0){const i=e.elements,r=i[0],s=i[4],a=i[8],o=i[1],l=i[5],c=i[9],u=i[2],f=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,d),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(o,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-s,l)):(this._y=0,this._z=Math.atan2(o,r));break;case"ZYX":this._y=Math.asin(-jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(o,r)):(this._x=0,this._z=Math.atan2(-s,l));break;case"YZX":this._z=Math.asin(jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-jt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-c,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,A===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,A){return $c.makeRotationFromQuaternion(e),this.setFromRotationMatrix($c,t,A)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return eu.setFromEuler(this),this.setFromQuaternion(eu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}DA.DEFAULT_ORDER="XYZ";class xc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Sg=0;const tu=new Q,fi=new ei,VA=new at,Zr=new Q,rr=new Q,Fg=new Q,Tg=new ei,Au=new Q(1,0,0),nu=new Q(0,1,0),iu=new Q(0,0,1),ru={type:"added"},bg={type:"removed"},hi={type:"childadded",child:null},ao={type:"childremoved",child:null};class Yt extends ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sg++}),this.uuid=Rr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new Q,t=new DA,A=new ei,i=new Q(1,1,1);function r(){A.setFromEuler(t,!1)}function s(){t.setFromQuaternion(A,void 0,!1)}t._onChange(r),A._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:A},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new at},normalMatrix:{value:new ke}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.multiply(fi),this}rotateOnWorldAxis(e,t){return fi.setFromAxisAngle(e,t),this.quaternion.premultiply(fi),this}rotateX(e){return this.rotateOnAxis(Au,e)}rotateY(e){return this.rotateOnAxis(nu,e)}rotateZ(e){return this.rotateOnAxis(iu,e)}translateOnAxis(e,t){return tu.copy(e).applyQuaternion(this.quaternion),this.position.add(tu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Au,e)}translateY(e){return this.translateOnAxis(nu,e)}translateZ(e){return this.translateOnAxis(iu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(VA.copy(this.matrixWorld).invert())}lookAt(e,t,A){e.isVector3?Zr.copy(e):Zr.set(e,t,A);const i=this.parent;this.updateWorldMatrix(!0,!1),rr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?VA.lookAt(rr,Zr,this.up):VA.lookAt(Zr,rr,this.up),this.quaternion.setFromRotationMatrix(VA),i&&(VA.extractRotation(i.matrixWorld),fi.setFromRotationMatrix(VA),this.quaternion.premultiply(fi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ru),hi.child=e,this.dispatchEvent(hi),hi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let A=0;A<arguments.length;A++)this.remove(arguments[A]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bg),ao.child=e,this.dispatchEvent(ao),ao.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),VA.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),VA.multiply(e.parent.matrixWorld)),e.applyMatrix4(VA),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ru),hi.child=e,this.dispatchEvent(hi),hi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let A=0,i=this.children.length;A<i;A++){const s=this.children[A].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,A=[]){this[e]===t&&A.push(this);const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].getObjectsByProperty(e,t,A);return A}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rr,e,Fg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rr,Tg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let A=0,i=t.length;A<i;A++)t[A].updateMatrixWorld(e)}updateWorldMatrix(e,t){const A=this.parent;if(e===!0&&A!==null&&A.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,s=i.length;r<s;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",A={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},A.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){const u=o[l];r(e.shapes,u)}else r(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(r(e.materials,this.material[o]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const o=this.animations[a];i.animations.push(r(e.animations,o))}}if(t){const a=s(e.geometries),o=s(e.materials),l=s(e.textures),c=s(e.images),u=s(e.shapes),f=s(e.skeletons),d=s(e.animations),g=s(e.nodes);a.length>0&&(A.geometries=a),o.length>0&&(A.materials=o),l.length>0&&(A.textures=l),c.length>0&&(A.images=c),u.length>0&&(A.shapes=u),f.length>0&&(A.skeletons=f),d.length>0&&(A.animations=d),g.length>0&&(A.nodes=g)}return A.object=i,A;function s(a){const o=[];for(const l in a){const c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let A=0;A<e.children.length;A++){const i=e.children[A];this.add(i.clone())}return this}}Yt.DEFAULT_UP=new Q(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const MA=new Q,KA=new Q,oo=new Q,kA=new Q,di=new Q,pi=new Q,su=new Q,lo=new Q,co=new Q,uo=new Q;class LA{constructor(e=new Q,t=new Q,A=new Q){this.a=e,this.b=t,this.c=A}static getNormal(e,t,A,i){i.subVectors(A,t),MA.subVectors(e,t),i.cross(MA);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,A,i,r){MA.subVectors(i,t),KA.subVectors(A,t),oo.subVectors(e,t);const s=MA.dot(MA),a=MA.dot(KA),o=MA.dot(oo),l=KA.dot(KA),c=KA.dot(oo),u=s*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(l*o-a*c)*f,g=(s*c-a*o)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,A,i){return this.getBarycoord(e,t,A,i,kA)===null?!1:kA.x>=0&&kA.y>=0&&kA.x+kA.y<=1}static getInterpolation(e,t,A,i,r,s,a,o){return this.getBarycoord(e,t,A,i,kA)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(r,kA.x),o.addScaledVector(s,kA.y),o.addScaledVector(a,kA.z),o)}static isFrontFacing(e,t,A,i){return MA.subVectors(A,t),KA.subVectors(e,t),MA.cross(KA).dot(i)<0}set(e,t,A){return this.a.copy(e),this.b.copy(t),this.c.copy(A),this}setFromPointsAndIndices(e,t,A,i){return this.a.copy(e[t]),this.b.copy(e[A]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,A,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,A),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return MA.subVectors(this.c,this.b),KA.subVectors(this.a,this.b),MA.cross(KA).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return LA.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return LA.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,A,i,r){return LA.getInterpolation(e,this.a,this.b,this.c,t,A,i,r)}containsPoint(e){return LA.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return LA.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const A=this.a,i=this.b,r=this.c;let s,a;di.subVectors(i,A),pi.subVectors(r,A),lo.subVectors(e,A);const o=di.dot(lo),l=pi.dot(lo);if(o<=0&&l<=0)return t.copy(A);co.subVectors(e,i);const c=di.dot(co),u=pi.dot(co);if(c>=0&&u<=c)return t.copy(i);const f=o*u-c*l;if(f<=0&&o>=0&&c<=0)return s=o/(o-c),t.copy(A).addScaledVector(di,s);uo.subVectors(e,r);const d=di.dot(uo),g=pi.dot(uo);if(g>=0&&d<=g)return t.copy(r);const m=d*l-o*g;if(m<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(A).addScaledVector(pi,a);const p=c*g-d*u;if(p<=0&&u-c>=0&&d-g>=0)return su.subVectors(r,i),a=(u-c)/(u-c+(d-g)),t.copy(i).addScaledVector(su,a);const h=1/(p+m+f);return s=m*h,a=f*h,t.copy(A).addScaledVector(di,s).addScaledVector(pi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Th={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cn={h:0,s:0,l:0},jr={h:0,s:0,l:0};function fo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Oe{constructor(e,t,A){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,A)}set(e,t,A){if(t===void 0&&A===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,A);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=FA){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.toWorkingColorSpace(this,t),this}setRGB(e,t,A,i=tt.workingColorSpace){return this.r=e,this.g=t,this.b=A,tt.toWorkingColorSpace(this,i),this}setHSL(e,t,A,i=tt.workingColorSpace){if(e=pg(e,1),t=jt(t,0,1),A=jt(A,0,1),t===0)this.r=this.g=this.b=A;else{const r=A<=.5?A*(1+t):A+t-A*t,s=2*A-r;this.r=fo(s,r,e+1/3),this.g=fo(s,r,e),this.b=fo(s,r,e-1/3)}return tt.toWorkingColorSpace(this,i),this}setStyle(e,t=FA){function A(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=i[1],a=i[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return A(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=FA){const A=Th[e.toLowerCase()];return A!==void 0?this.setHex(A,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ni(e.r),this.g=Ni(e.g),this.b=Ni(e.b),this}copyLinearToSRGB(e){return this.r=$a(e.r),this.g=$a(e.g),this.b=$a(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=FA){return tt.fromWorkingColorSpace(zt.copy(this),e),Math.round(jt(zt.r*255,0,255))*65536+Math.round(jt(zt.g*255,0,255))*256+Math.round(jt(zt.b*255,0,255))}getHexString(e=FA){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.fromWorkingColorSpace(zt.copy(this),t);const A=zt.r,i=zt.g,r=zt.b,s=Math.max(A,i,r),a=Math.min(A,i,r);let o,l;const c=(a+s)/2;if(a===s)o=0,l=0;else{const u=s-a;switch(l=c<=.5?u/(s+a):u/(2-s-a),s){case A:o=(i-r)/u+(i<r?6:0);break;case i:o=(r-A)/u+2;break;case r:o=(A-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=tt.workingColorSpace){return tt.fromWorkingColorSpace(zt.copy(this),t),e.r=zt.r,e.g=zt.g,e.b=zt.b,e}getStyle(e=FA){tt.fromWorkingColorSpace(zt.copy(this),e);const t=zt.r,A=zt.g,i=zt.b;return e!==FA?`color(${e} ${t.toFixed(3)} ${A.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(A*255)},${Math.round(i*255)})`}offsetHSL(e,t,A){return this.getHSL(cn),this.setHSL(cn.h+e,cn.s+t,cn.l+A)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,A){return this.r=e.r+(t.r-e.r)*A,this.g=e.g+(t.g-e.g)*A,this.b=e.b+(t.b-e.b)*A,this}lerpHSL(e,t){this.getHSL(cn),e.getHSL(jr);const A=Za(cn.h,jr.h,t),i=Za(cn.s,jr.s,t),r=Za(cn.l,jr.l,t);return this.setHSL(A,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,A=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*A+r[6]*i,this.g=r[1]*t+r[4]*A+r[7]*i,this.b=r[2]*t+r[5]*A+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const zt=new Oe;Oe.NAMES=Th;let Qg=0;class Ai extends ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qg++}),this.uuid=Rr(),this.name="",this.type="Material",this.blending=Hi,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tl,this.blendDst=Al,this.blendEquation=Gn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=ra,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=si,this.stencilZFail=si,this.stencilZPass=si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const A=e[t];if(A===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(A):i&&i.isVector3&&A&&A.isVector3?i.copy(A):this[t]=A}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const A={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};A.uuid=this.uuid,A.type=this.type,this.name!==""&&(A.name=this.name),this.color&&this.color.isColor&&(A.color=this.color.getHex()),this.roughness!==void 0&&(A.roughness=this.roughness),this.metalness!==void 0&&(A.metalness=this.metalness),this.sheen!==void 0&&(A.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(A.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(A.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(A.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(A.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(A.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(A.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(A.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(A.shininess=this.shininess),this.clearcoat!==void 0&&(A.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(A.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(A.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(A.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(A.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,A.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(A.dispersion=this.dispersion),this.iridescence!==void 0&&(A.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(A.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(A.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(A.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(A.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(A.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(A.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(A.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(A.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(A.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(A.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(A.lightMap=this.lightMap.toJSON(e).uuid,A.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(A.aoMap=this.aoMap.toJSON(e).uuid,A.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(A.bumpMap=this.bumpMap.toJSON(e).uuid,A.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(A.normalMap=this.normalMap.toJSON(e).uuid,A.normalMapType=this.normalMapType,A.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(A.displacementMap=this.displacementMap.toJSON(e).uuid,A.displacementScale=this.displacementScale,A.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(A.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(A.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(A.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(A.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(A.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(A.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(A.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(A.combine=this.combine)),this.envMapRotation!==void 0&&(A.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(A.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(A.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(A.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(A.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(A.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(A.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(A.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(A.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(A.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(A.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(A.size=this.size),this.shadowSide!==null&&(A.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(A.sizeAttenuation=this.sizeAttenuation),this.blending!==Hi&&(A.blending=this.blending),this.side!==Mn&&(A.side=this.side),this.vertexColors===!0&&(A.vertexColors=!0),this.opacity<1&&(A.opacity=this.opacity),this.transparent===!0&&(A.transparent=!0),this.blendSrc!==tl&&(A.blendSrc=this.blendSrc),this.blendDst!==Al&&(A.blendDst=this.blendDst),this.blendEquation!==Gn&&(A.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(A.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(A.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(A.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(A.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(A.blendAlpha=this.blendAlpha),this.depthFunc!==ra&&(A.depthFunc=this.depthFunc),this.depthTest===!1&&(A.depthTest=this.depthTest),this.depthWrite===!1&&(A.depthWrite=this.depthWrite),this.colorWrite===!1&&(A.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(A.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wc&&(A.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(A.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(A.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==si&&(A.stencilFail=this.stencilFail),this.stencilZFail!==si&&(A.stencilZFail=this.stencilZFail),this.stencilZPass!==si&&(A.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(A.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(A.rotation=this.rotation),this.polygonOffset===!0&&(A.polygonOffset=!0),this.polygonOffsetFactor!==0&&(A.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(A.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(A.linewidth=this.linewidth),this.dashSize!==void 0&&(A.dashSize=this.dashSize),this.gapSize!==void 0&&(A.gapSize=this.gapSize),this.scale!==void 0&&(A.scale=this.scale),this.dithering===!0&&(A.dithering=!0),this.alphaTest>0&&(A.alphaTest=this.alphaTest),this.alphaHash===!0&&(A.alphaHash=!0),this.alphaToCoverage===!0&&(A.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(A.premultipliedAlpha=!0),this.forceSinglePass===!0&&(A.forceSinglePass=!0),this.wireframe===!0&&(A.wireframe=!0),this.wireframeLinewidth>1&&(A.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(A.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(A.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(A.flatShading=!0),this.visible===!1&&(A.visible=!1),this.toneMapped===!1&&(A.toneMapped=!1),this.fog===!1&&(A.fog=!1),Object.keys(this.userData).length>0&&(A.userData=this.userData);function i(r){const s=[];for(const a in r){const o=r[a];delete o.metadata,s.push(o)}return s}if(t){const r=i(e.textures),s=i(e.images);r.length>0&&(A.textures=r),s.length>0&&(A.images=s)}return A}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let A=null;if(t!==null){const i=t.length;A=new Array(i);for(let r=0;r!==i;++r)A[r]=t[r].clone()}return this.clippingPlanes=A,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class Oi extends Ai{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new DA,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ut=new Q,$r=new ye;class Mt{constructor(e,t,A=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=A,this.usage=Xc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=qA,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return xr("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,A){e*=this.itemSize,A*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[A+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,A=this.count;t<A;t++)$r.fromBufferAttribute(this,t),$r.applyMatrix3(e),this.setXY(t,$r.x,$r.y);else if(this.itemSize===3)for(let t=0,A=this.count;t<A;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix3(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyMatrix4(e){for(let t=0,A=this.count;t<A;t++)Ut.fromBufferAttribute(this,t),Ut.applyMatrix4(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}applyNormalMatrix(e){for(let t=0,A=this.count;t<A;t++)Ut.fromBufferAttribute(this,t),Ut.applyNormalMatrix(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}transformDirection(e){for(let t=0,A=this.count;t<A;t++)Ut.fromBufferAttribute(this,t),Ut.transformDirection(e),this.setXYZ(t,Ut.x,Ut.y,Ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let A=this.array[e*this.itemSize+t];return this.normalized&&(A=tr(A,this.array)),A}setComponent(e,t,A){return this.normalized&&(A=tA(A,this.array)),this.array[e*this.itemSize+t]=A,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=tr(t,this.array)),t}setX(e,t){return this.normalized&&(t=tA(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=tr(t,this.array)),t}setY(e,t){return this.normalized&&(t=tA(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=tr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tA(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=tr(t,this.array)),t}setW(e,t){return this.normalized&&(t=tA(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,A){return e*=this.itemSize,this.normalized&&(t=tA(t,this.array),A=tA(A,this.array)),this.array[e+0]=t,this.array[e+1]=A,this}setXYZ(e,t,A,i){return e*=this.itemSize,this.normalized&&(t=tA(t,this.array),A=tA(A,this.array),i=tA(i,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this}setXYZW(e,t,A,i,r){return e*=this.itemSize,this.normalized&&(t=tA(t,this.array),A=tA(A,this.array),i=tA(i,this.array),r=tA(r,this.array)),this.array[e+0]=t,this.array[e+1]=A,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xc&&(e.usage=this.usage),e}}class bh extends Mt{constructor(e,t,A){super(new Uint16Array(e),t,A)}}class Qh extends Mt{constructor(e,t,A){super(new Uint32Array(e),t,A)}}class Jt extends Mt{constructor(e,t,A){super(new Float32Array(e),t,A)}}let Ig=0;const dA=new at,ho=new Yt,gi=new Q,sA=new Dr,sr=new Dr,Rt=new Q;class Pt extends ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ig++}),this.uuid=Rr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Mh(e)?Qh:bh)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,A=0){this.groups.push({start:e,count:t,materialIndex:A})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const A=this.attributes.normal;if(A!==void 0){const r=new ke().getNormalMatrix(e);A.applyNormalMatrix(r),A.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return dA.makeRotationFromQuaternion(e),this.applyMatrix4(dA),this}rotateX(e){return dA.makeRotationX(e),this.applyMatrix4(dA),this}rotateY(e){return dA.makeRotationY(e),this.applyMatrix4(dA),this}rotateZ(e){return dA.makeRotationZ(e),this.applyMatrix4(dA),this}translate(e,t,A){return dA.makeTranslation(e,t,A),this.applyMatrix4(dA),this}scale(e,t,A){return dA.makeScale(e,t,A),this.applyMatrix4(dA),this}lookAt(e){return ho.lookAt(e),ho.updateMatrix(),this.applyMatrix4(ho.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(e){const t=[];for(let A=0,i=e.length;A<i;A++){const r=e[A];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Jt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Q(-1/0,-1/0,-1/0),new Q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let A=0,i=t.length;A<i;A++){const r=t[A];sA.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,sA.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,sA.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(sA.min),this.boundingBox.expandByPoint(sA.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Q,1/0);return}if(e){const A=this.boundingSphere.center;if(sA.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const a=t[r];sr.setFromBufferAttribute(a),this.morphTargetsRelative?(Rt.addVectors(sA.min,sr.min),sA.expandByPoint(Rt),Rt.addVectors(sA.max,sr.max),sA.expandByPoint(Rt)):(sA.expandByPoint(sr.min),sA.expandByPoint(sr.max))}sA.getCenter(A);let i=0;for(let r=0,s=e.count;r<s;r++)Rt.fromBufferAttribute(e,r),i=Math.max(i,A.distanceToSquared(Rt));if(t)for(let r=0,s=t.length;r<s;r++){const a=t[r],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++)Rt.fromBufferAttribute(a,l),o&&(gi.fromBufferAttribute(e,l),Rt.add(gi)),i=Math.max(i,A.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const A=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mt(new Float32Array(4*A.count),4));const s=this.getAttribute("tangent"),a=[],o=[];for(let R=0;R<A.count;R++)a[R]=new Q,o[R]=new Q;const l=new Q,c=new Q,u=new Q,f=new ye,d=new ye,g=new ye,m=new Q,p=new Q;function h(R,x,_){l.fromBufferAttribute(A,R),c.fromBufferAttribute(A,x),u.fromBufferAttribute(A,_),f.fromBufferAttribute(r,R),d.fromBufferAttribute(r,x),g.fromBufferAttribute(r,_),c.sub(l),u.sub(l),d.sub(f),g.sub(f);const b=1/(d.x*g.y-g.x*d.y);isFinite(b)&&(m.copy(c).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(b),p.copy(u).multiplyScalar(d.x).addScaledVector(c,-g.x).multiplyScalar(b),a[R].add(m),a[x].add(m),a[_].add(m),o[R].add(p),o[x].add(p),o[_].add(p))}let C=this.groups;C.length===0&&(C=[{start:0,count:e.count}]);for(let R=0,x=C.length;R<x;++R){const _=C[R],b=_.start,k=_.count;for(let P=b,Y=b+k;P<Y;P+=3)h(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const v=new Q,y=new Q,I=new Q,U=new Q;function M(R){I.fromBufferAttribute(i,R),U.copy(I);const x=a[R];v.copy(x),v.sub(I.multiplyScalar(I.dot(x))).normalize(),y.crossVectors(U,x);const b=y.dot(o[R])<0?-1:1;s.setXYZW(R,v.x,v.y,v.z,b)}for(let R=0,x=C.length;R<x;++R){const _=C[R],b=_.start,k=_.count;for(let P=b,Y=b+k;P<Y;P+=3)M(e.getX(P+0)),M(e.getX(P+1)),M(e.getX(P+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let A=this.getAttribute("normal");if(A===void 0)A=new Mt(new Float32Array(t.count*3),3),this.setAttribute("normal",A);else for(let f=0,d=A.count;f<d;f++)A.setXYZ(f,0,0,0);const i=new Q,r=new Q,s=new Q,a=new Q,o=new Q,l=new Q,c=new Q,u=new Q;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),m=e.getX(f+1),p=e.getX(f+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,p),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),a.fromBufferAttribute(A,g),o.fromBufferAttribute(A,m),l.fromBufferAttribute(A,p),a.add(c),o.add(c),l.add(c),A.setXYZ(g,a.x,a.y,a.z),A.setXYZ(m,o.x,o.y,o.z),A.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)i.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),c.subVectors(s,r),u.subVectors(i,r),c.cross(u),A.setXYZ(f+0,c.x,c.y,c.z),A.setXYZ(f+1,c.x,c.y,c.z),A.setXYZ(f+2,c.x,c.y,c.z);this.normalizeNormals(),A.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,A=e.count;t<A;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(a,o){const l=a.array,c=a.itemSize,u=a.normalized,f=new l.constructor(o.length*c);let d=0,g=0;for(let m=0,p=o.length;m<p;m++){a.isInterleavedBufferAttribute?d=o[m]*a.data.stride+a.offset:d=o[m]*c;for(let h=0;h<c;h++)f[g++]=l[d++]}return new Mt(f,c,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Pt,A=this.index.array,i=this.attributes;for(const a in i){const o=i[a],l=e(o,A);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const o=[],l=r[a];for(let c=0,u=l.length;c<u;c++){const f=l[c],d=e(f,A);o.push(d)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let a=0,o=s.length;a<o;a++){const l=s[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const o=this.parameters;for(const l in o)o[l]!==void 0&&(e[l]=o[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const A=this.attributes;for(const o in A){const l=A[o];e.data.attributes[o]=l.toJSON(e.data)}const i={};let r=!1;for(const o in this.morphAttributes){const l=this.morphAttributes[o],c=[];for(let u=0,f=l.length;u<f;u++){const d=l[u];c.push(d.toJSON(e.data))}c.length>0&&(i[o]=c,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const A=e.index;A!==null&&this.setIndex(A.clone(t));const i=e.attributes;for(const l in i){const c=i[l];this.setAttribute(l,c.clone(t))}const r=e.morphAttributes;for(const l in r){const c=[],u=r[l];for(let f=0,d=u.length;f<d;f++)c.push(u[f].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let l=0,c=s.length;l<c;l++){const u=s[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const au=new at,Rn=new Pr,es=new Hr,ou=new Q,mi=new Q,Bi=new Q,vi=new Q,po=new Q,ts=new Q,As=new ye,ns=new ye,is=new ye,lu=new Q,cu=new Q,uu=new Q,rs=new Q,ss=new Q;class Ft extends Yt{constructor(e=new Pt,t=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const A=this.geometry,i=A.attributes.position,r=A.morphAttributes.position,s=A.morphTargetsRelative;t.fromBufferAttribute(i,e);const a=this.morphTargetInfluences;if(r&&a){ts.set(0,0,0);for(let o=0,l=r.length;o<l;o++){const c=a[o],u=r[o];c!==0&&(po.fromBufferAttribute(u,e),s?ts.addScaledVector(po,c):ts.addScaledVector(po.sub(t),c))}t.add(ts)}return t}raycast(e,t){const A=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(A.boundingSphere===null&&A.computeBoundingSphere(),es.copy(A.boundingSphere),es.applyMatrix4(r),Rn.copy(e.ray).recast(e.near),!(es.containsPoint(Rn.origin)===!1&&(Rn.intersectSphere(es,ou)===null||Rn.origin.distanceToSquared(ou)>(e.far-e.near)**2))&&(au.copy(r).invert(),Rn.copy(e.ray).applyMatrix4(au),!(A.boundingBox!==null&&Rn.intersectsBox(A.boundingBox)===!1)&&this._computeIntersections(e,t,Rn)))}_computeIntersections(e,t,A){let i;const r=this.geometry,s=this.material,a=r.index,o=r.attributes.position,l=r.attributes.uv,c=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const p=f[g],h=s[p.materialIndex],C=Math.max(p.start,d.start),v=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let y=C,I=v;y<I;y+=3){const U=a.getX(y),M=a.getX(y+1),R=a.getX(y+2);i=as(this,h,e,A,l,c,u,U,M,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),m=Math.min(a.count,d.start+d.count);for(let p=g,h=m;p<h;p+=3){const C=a.getX(p),v=a.getX(p+1),y=a.getX(p+2);i=as(this,s,e,A,l,c,u,C,v,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(s))for(let g=0,m=f.length;g<m;g++){const p=f[g],h=s[p.materialIndex],C=Math.max(p.start,d.start),v=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let y=C,I=v;y<I;y+=3){const U=y,M=y+1,R=y+2;i=as(this,h,e,A,l,c,u,U,M,R),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,d.start),m=Math.min(o.count,d.start+d.count);for(let p=g,h=m;p<h;p+=3){const C=p,v=p+1,y=p+2;i=as(this,s,e,A,l,c,u,C,v,y),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Lg(n,e,t,A,i,r,s,a){let o;if(e.side===$t?o=A.intersectTriangle(s,r,i,!0,a):o=A.intersectTriangle(i,r,s,e.side===Mn,a),o===null)return null;ss.copy(a),ss.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(ss);return l<t.near||l>t.far?null:{distance:l,point:ss.clone(),object:n}}function as(n,e,t,A,i,r,s,a,o,l){n.getVertexPosition(a,mi),n.getVertexPosition(o,Bi),n.getVertexPosition(l,vi);const c=Lg(n,e,t,A,mi,Bi,vi,rs);if(c){i&&(As.fromBufferAttribute(i,a),ns.fromBufferAttribute(i,o),is.fromBufferAttribute(i,l),c.uv=LA.getInterpolation(rs,mi,Bi,vi,As,ns,is,new ye)),r&&(As.fromBufferAttribute(r,a),ns.fromBufferAttribute(r,o),is.fromBufferAttribute(r,l),c.uv1=LA.getInterpolation(rs,mi,Bi,vi,As,ns,is,new ye)),s&&(lu.fromBufferAttribute(s,a),cu.fromBufferAttribute(s,o),uu.fromBufferAttribute(s,l),c.normal=LA.getInterpolation(rs,mi,Bi,vi,lu,cu,uu,new Q),c.normal.dot(A.direction)>0&&c.normal.multiplyScalar(-1));const u={a,b:o,c:l,normal:new Q,materialIndex:0};LA.getNormal(mi,Bi,vi,u.normal),c.face=u}return c}class Nr extends Pt{constructor(e=1,t=1,A=1,i=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:A,widthSegments:i,heightSegments:r,depthSegments:s};const a=this;i=Math.floor(i),r=Math.floor(r),s=Math.floor(s);const o=[],l=[],c=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,A,t,e,s,r,0),g("z","y","x",1,-1,A,t,-e,s,r,1),g("x","z","y",1,1,e,A,t,i,s,2),g("x","z","y",1,-1,e,A,-t,i,s,3),g("x","y","z",1,-1,e,t,A,i,r,4),g("x","y","z",-1,-1,e,t,-A,i,r,5),this.setIndex(o),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(c,3)),this.setAttribute("uv",new Jt(u,2));function g(m,p,h,C,v,y,I,U,M,R,x){const _=y/M,b=I/R,k=y/2,P=I/2,Y=U/2,Z=M+1,W=R+1;let q=0,X=0;const se=new Q;for(let ae=0;ae<W;ae++){const pe=ae*b-P;for(let De=0;De<Z;De++){const Ge=De*_-k;se[m]=Ge*C,se[p]=pe*v,se[h]=Y,l.push(se.x,se.y,se.z),se[m]=0,se[p]=0,se[h]=U>0?1:-1,c.push(se.x,se.y,se.z),u.push(De/M),u.push(1-ae/R),q+=1}}for(let ae=0;ae<R;ae++)for(let pe=0;pe<M;pe++){const De=f+pe+Z*ae,Ge=f+pe+Z*(ae+1),J=f+(pe+1)+Z*(ae+1),$=f+(pe+1)+Z*ae;o.push(De,Ge,$),o.push(Ge,J,$),X+=6}a.addGroup(d,X,x),d+=X,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(n){const e={};for(const t in n){e[t]={};for(const A in n[t]){const i=n[t][A];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][A]=null):e[t][A]=i.clone():Array.isArray(i)?e[t][A]=i.slice():e[t][A]=i}}return e}function qt(n){const e={};for(let t=0;t<n.length;t++){const A=Ji(n[t]);for(const i in A)e[i]=A[i]}return e}function Rg(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ih(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const Lh={clone:Ji,merge:qt};var Dg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kt extends Ai{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dg,this.fragmentShader=Hg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=Rg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const A={};for(const i in this.extensions)this.extensions[i]===!0&&(A[i]=!0);return Object.keys(A).length>0&&(t.extensions=A),t}}class Rh extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=ZA}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const un=new Q,fu=new ye,hu=new ye;class cA extends Rh{constructor(e=50,t=1,A=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=A,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Il*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Il*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,A){un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(un.x,un.y).multiplyScalar(-e/un.z),un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),A.set(un.x,un.y).multiplyScalar(-e/un.z)}getViewSize(e,t){return this.getViewBounds(e,fu,hu),t.subVectors(hu,fu)}setViewOffset(e,t,A,i,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zs*.5*this.fov)/this.zoom,A=2*t,i=this.aspect*A,r=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const o=s.fullWidth,l=s.fullHeight;r+=s.offsetX*i/o,t-=s.offsetY*A/l,i*=s.width/o,A*=s.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-A,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wi=-90,Ci=1;class Pg extends Yt{constructor(e,t,A){super(),this.type="CubeCamera",this.renderTarget=A,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new cA(wi,Ci,e,t);i.layers=this.layers,this.add(i);const r=new cA(wi,Ci,e,t);r.layers=this.layers,this.add(r);const s=new cA(wi,Ci,e,t);s.layers=this.layers,this.add(s);const a=new cA(wi,Ci,e,t);a.layers=this.layers,this.add(a);const o=new cA(wi,Ci,e,t);o.layers=this.layers,this.add(o);const l=new cA(wi,Ci,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[A,i,r,s,a,o]=t;for(const l of t)this.remove(l);if(e===ZA)A.up.set(0,1,0),A.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===la)A.up.set(0,-1,0),A.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:A,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,a,o,l,c]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const m=A.texture.generateMipmaps;A.texture.generateMipmaps=!1,e.setRenderTarget(A,0,i),e.render(t,r),e.setRenderTarget(A,1,i),e.render(t,s),e.setRenderTarget(A,2,i),e.render(t,a),e.setRenderTarget(A,3,i),e.render(t,o),e.setRenderTarget(A,4,i),e.render(t,l),A.texture.generateMipmaps=m,e.setRenderTarget(A,5,i),e.render(t,c),e.setRenderTarget(u,f,d),e.xr.enabled=g,A.texture.needsPMREMUpdate=!0}}class Dh extends eA{constructor(e,t,A,i,r,s,a,o,l,c){e=e!==void 0?e:[],t=t!==void 0?t:zi,super(e,t,A,i,r,s,a,o,l,c),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ng extends Sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const A={width:e,height:e,depth:1},i=[A,A,A,A,A,A];this.texture=new Dh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:fA}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const A={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Nr(5,5,5),r=new Kt({name:"CubemapFromEquirect",uniforms:Ji(A.uniforms),vertexShader:A.vertexShader,fragmentShader:A.fragmentShader,side:$t,blending:jA});r.uniforms.tEquirect.value=t;const s=new Ft(i,r),a=t.minFilter;return t.minFilter===zn&&(t.minFilter=fA),new Pg(1,10,this).update(e,s),t.minFilter=a,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,A,i){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,A,i);e.setRenderTarget(r)}}const go=new Q,Og=new Q,Gg=new ke;class dn{constructor(e=new Q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,A,i){return this.normal.set(e,t,A),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,A){const i=go.subVectors(A,t).cross(Og.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const A=e.delta(go),i=this.normal.dot(A);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(A,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),A=this.distanceToPoint(e.end);return t<0&&A>0||A<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const A=t||Gg.getNormalMatrix(e),i=this.coplanarPoint(go).applyMatrix4(e),r=this.normal.applyMatrix3(A).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Dn=new Hr,os=new Q;class Ec{constructor(e=new dn,t=new dn,A=new dn,i=new dn,r=new dn,s=new dn){this.planes=[e,t,A,i,r,s]}set(e,t,A,i,r,s){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(A),a[3].copy(i),a[4].copy(r),a[5].copy(s),this}copy(e){const t=this.planes;for(let A=0;A<6;A++)t[A].copy(e.planes[A]);return this}setFromProjectionMatrix(e,t=ZA){const A=this.planes,i=e.elements,r=i[0],s=i[1],a=i[2],o=i[3],l=i[4],c=i[5],u=i[6],f=i[7],d=i[8],g=i[9],m=i[10],p=i[11],h=i[12],C=i[13],v=i[14],y=i[15];if(A[0].setComponents(o-r,f-l,p-d,y-h).normalize(),A[1].setComponents(o+r,f+l,p+d,y+h).normalize(),A[2].setComponents(o+s,f+c,p+g,y+C).normalize(),A[3].setComponents(o-s,f-c,p-g,y-C).normalize(),A[4].setComponents(o-a,f-u,p-m,y-v).normalize(),t===ZA)A[5].setComponents(o+a,f+u,p+m,y+v).normalize();else if(t===la)A[5].setComponents(a,u,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Dn)}intersectsSprite(e){return Dn.center.set(0,0,0),Dn.radius=.7071067811865476,Dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Dn)}intersectsSphere(e){const t=this.planes,A=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(A)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let A=0;A<6;A++){const i=t[A];if(os.x=i.normal.x>0?e.max.x:e.min.x,os.y=i.normal.y>0?e.max.y:e.min.y,os.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(os)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let A=0;A<6;A++)if(t[A].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Hh(){let n=null,e=!1,t=null,A=null;function i(r,s){t(r,s),A=n.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(A=n.requestAnimationFrame(i),e=!0)},stop:function(){n.cancelAnimationFrame(A),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Vg(n){const e=new WeakMap;function t(a,o){const l=a.array,c=a.usage,u=l.byteLength,f=n.createBuffer();n.bindBuffer(o,f),n.bufferData(o,l,c),a.onUploadCallback();let d;if(l instanceof Float32Array)d=n.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=n.SHORT;else if(l instanceof Uint32Array)d=n.UNSIGNED_INT;else if(l instanceof Int32Array)d=n.INT;else if(l instanceof Int8Array)d=n.BYTE;else if(l instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function A(a,o,l){const c=o.array,u=o._updateRange,f=o.updateRanges;if(n.bindBuffer(l,a),u.count===-1&&f.length===0&&n.bufferSubData(l,0,c),f.length!==0){for(let d=0,g=f.length;d<g;d++){const m=f[d];n.bufferSubData(l,m.start*c.BYTES_PER_ELEMENT,c,m.start,m.count)}o.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(l,u.offset*c.BYTES_PER_ELEMENT,c,u.offset,u.count),u.count=-1),o.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const o=e.get(a);o&&(n.deleteBuffer(o.buffer),e.delete(a))}function s(a,o){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const c=e.get(a);(!c||c.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,o));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");A(l.buffer,a,o),l.version=a.version}}return{get:i,remove:r,update:s}}class Fn extends Pt{constructor(e=1,t=1,A=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:A,heightSegments:i};const r=e/2,s=t/2,a=Math.floor(A),o=Math.floor(i),l=a+1,c=o+1,u=e/a,f=t/o,d=[],g=[],m=[],p=[];for(let h=0;h<c;h++){const C=h*f-s;for(let v=0;v<l;v++){const y=v*u-r;g.push(y,-C,0),m.push(0,0,1),p.push(v/a),p.push(1-h/o)}}for(let h=0;h<o;h++)for(let C=0;C<a;C++){const v=C+l*h,y=C+l*(h+1),I=C+1+l*(h+1),U=C+1+l*h;d.push(v,y,U),d.push(y,I,U)}this.setIndex(d),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(m,3)),this.setAttribute("uv",new Jt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fn(e.width,e.height,e.widthSegments,e.heightSegments)}}var Kg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kg=`#ifdef USE_ALPHAHASH
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
#endif`,zg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jg=`#ifdef USE_AOMAP
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
#endif`,qg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zg=`#ifdef USE_BATCHING
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
#endif`,jg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$g=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Am=`#ifdef USE_IRIDESCENCE
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
#endif`,nm=`#ifdef USE_BUMPMAP
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
#endif`,im=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,om=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
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
#endif`,fm=`#define PI 3.141592653589793
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
} // validated`,hm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,dm=`vec3 transformedNormal = objectNormal;
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
#endif`,pm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vm="gl_FragColor = linearToOutputTexel( gl_FragColor );",wm=`
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
}`,Cm=`#ifdef USE_ENVMAP
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
#endif`,_m=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xm=`#ifdef USE_ENVMAP
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
#endif`,Em=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ym=`#ifdef USE_ENVMAP
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
#endif`,Um=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Sm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tm=`#ifdef USE_GRADIENTMAP
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
}`,bm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lm=`uniform bool receiveShadow;
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
#endif`,Rm=`#ifdef USE_ENVMAP
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
#endif`,Dm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Pm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Om=`PhysicalMaterial material;
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
#endif`,Gm=`struct PhysicalMaterial {
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
}`,Vm=`
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
#endif`,Km=`#if defined( RE_IndirectDiffuse )
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
#endif`,km=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,zm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ym=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,jm=`#if defined( USE_POINTS_UV )
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
#endif`,$m=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eB=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tB=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,AB=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nB=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iB=`#ifdef USE_MORPHTARGETS
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
#endif`,rB=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sB=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,aB=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,oB=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lB=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cB=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uB=`#ifdef USE_NORMALMAP
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
#endif`,fB=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hB=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,dB=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pB=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gB=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,mB=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,BB=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vB=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,wB=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,CB=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_B=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xB=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,EB=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,yB=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,UB=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,MB=`float getShadowMask() {
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
}`,SB=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,FB=`#ifdef USE_SKINNING
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
#endif`,TB=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bB=`#ifdef USE_SKINNING
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
#endif`,QB=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,IB=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,LB=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,RB=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,DB=`#ifdef USE_TRANSMISSION
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
#endif`,HB=`#ifdef USE_TRANSMISSION
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
#endif`,PB=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,NB=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,OB=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,GB=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const VB=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,KB=`uniform sampler2D t2D;
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
}`,kB=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zB=`#ifdef ENVMAP_TYPE_CUBE
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
}`,WB=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,XB=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,YB=`#include <common>
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
}`,JB=`#if DEPTH_PACKING == 3200
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
}`,qB=`#define DISTANCE
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
}`,ZB=`#define DISTANCE
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
}`,jB=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$B=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e0=`uniform float scale;
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
}`,t0=`uniform vec3 diffuse;
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
}`,A0=`#include <common>
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
}`,n0=`uniform vec3 diffuse;
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
}`,i0=`#define LAMBERT
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
}`,r0=`#define LAMBERT
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
}`,s0=`#define MATCAP
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
}`,a0=`#define MATCAP
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
}`,o0=`#define NORMAL
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
}`,l0=`#define NORMAL
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
}`,c0=`#define PHONG
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
}`,u0=`#define PHONG
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
}`,f0=`#define STANDARD
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
}`,h0=`#define STANDARD
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
}`,d0=`#define TOON
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
}`,p0=`#define TOON
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
}`,g0=`uniform float size;
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
}`,m0=`uniform vec3 diffuse;
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
}`,B0=`#include <common>
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
}`,v0=`uniform vec3 color;
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
}`,w0=`uniform float rotation;
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
}`,C0=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:Kg,alphahash_pars_fragment:kg,alphamap_fragment:zg,alphamap_pars_fragment:Wg,alphatest_fragment:Xg,alphatest_pars_fragment:Yg,aomap_fragment:Jg,aomap_pars_fragment:qg,batching_pars_vertex:Zg,batching_vertex:jg,begin_vertex:$g,beginnormal_vertex:em,bsdfs:tm,iridescence_fragment:Am,bumpmap_pars_fragment:nm,clipping_planes_fragment:im,clipping_planes_pars_fragment:rm,clipping_planes_pars_vertex:sm,clipping_planes_vertex:am,color_fragment:om,color_pars_fragment:lm,color_pars_vertex:cm,color_vertex:um,common:fm,cube_uv_reflection_fragment:hm,defaultnormal_vertex:dm,displacementmap_pars_vertex:pm,displacementmap_vertex:gm,emissivemap_fragment:mm,emissivemap_pars_fragment:Bm,colorspace_fragment:vm,colorspace_pars_fragment:wm,envmap_fragment:Cm,envmap_common_pars_fragment:_m,envmap_pars_fragment:xm,envmap_pars_vertex:Em,envmap_physical_pars_fragment:Rm,envmap_vertex:ym,fog_vertex:Um,fog_pars_vertex:Mm,fog_fragment:Sm,fog_pars_fragment:Fm,gradientmap_pars_fragment:Tm,lightmap_pars_fragment:bm,lights_lambert_fragment:Qm,lights_lambert_pars_fragment:Im,lights_pars_begin:Lm,lights_toon_fragment:Dm,lights_toon_pars_fragment:Hm,lights_phong_fragment:Pm,lights_phong_pars_fragment:Nm,lights_physical_fragment:Om,lights_physical_pars_fragment:Gm,lights_fragment_begin:Vm,lights_fragment_maps:Km,lights_fragment_end:km,logdepthbuf_fragment:zm,logdepthbuf_pars_fragment:Wm,logdepthbuf_pars_vertex:Xm,logdepthbuf_vertex:Ym,map_fragment:Jm,map_pars_fragment:qm,map_particle_fragment:Zm,map_particle_pars_fragment:jm,metalnessmap_fragment:$m,metalnessmap_pars_fragment:eB,morphinstance_vertex:tB,morphcolor_vertex:AB,morphnormal_vertex:nB,morphtarget_pars_vertex:iB,morphtarget_vertex:rB,normal_fragment_begin:sB,normal_fragment_maps:aB,normal_pars_fragment:oB,normal_pars_vertex:lB,normal_vertex:cB,normalmap_pars_fragment:uB,clearcoat_normal_fragment_begin:fB,clearcoat_normal_fragment_maps:hB,clearcoat_pars_fragment:dB,iridescence_pars_fragment:pB,opaque_fragment:gB,packing:mB,premultiplied_alpha_fragment:BB,project_vertex:vB,dithering_fragment:wB,dithering_pars_fragment:CB,roughnessmap_fragment:_B,roughnessmap_pars_fragment:xB,shadowmap_pars_fragment:EB,shadowmap_pars_vertex:yB,shadowmap_vertex:UB,shadowmask_pars_fragment:MB,skinbase_vertex:SB,skinning_pars_vertex:FB,skinning_vertex:TB,skinnormal_vertex:bB,specularmap_fragment:QB,specularmap_pars_fragment:IB,tonemapping_fragment:LB,tonemapping_pars_fragment:RB,transmission_fragment:DB,transmission_pars_fragment:HB,uv_pars_fragment:PB,uv_pars_vertex:NB,uv_vertex:OB,worldpos_vertex:GB,background_vert:VB,background_frag:KB,backgroundCube_vert:kB,backgroundCube_frag:zB,cube_vert:WB,cube_frag:XB,depth_vert:YB,depth_frag:JB,distanceRGBA_vert:qB,distanceRGBA_frag:ZB,equirect_vert:jB,equirect_frag:$B,linedashed_vert:e0,linedashed_frag:t0,meshbasic_vert:A0,meshbasic_frag:n0,meshlambert_vert:i0,meshlambert_frag:r0,meshmatcap_vert:s0,meshmatcap_frag:a0,meshnormal_vert:o0,meshnormal_frag:l0,meshphong_vert:c0,meshphong_frag:u0,meshphysical_vert:f0,meshphysical_frag:h0,meshtoon_vert:d0,meshtoon_frag:p0,points_vert:g0,points_frag:m0,shadow_vert:B0,shadow_frag:v0,sprite_vert:w0,sprite_frag:C0},le={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},IA={basic:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:qt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:qt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:qt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:qt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:qt([le.points,le.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:qt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:qt([le.common,le.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:qt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:qt([le.sprite,le.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distanceRGBA:{uniforms:qt([le.common,le.displacementmap,{referencePosition:{value:new Q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distanceRGBA_vert,fragmentShader:Ke.distanceRGBA_frag},shadow:{uniforms:qt([le.lights,le.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};IA.physical={uniforms:qt([IA.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const ls={r:0,b:0,g:0},Hn=new DA,_0=new at;function x0(n,e,t,A,i,r,s){const a=new Oe(0);let o=r===!0?0:1,l,c,u=null,f=0,d=null;function g(C){let v=C.isScene===!0?C.background:null;return v&&v.isTexture&&(v=(C.backgroundBlurriness>0?t:e).get(v)),v}function m(C){let v=!1;const y=g(C);y===null?h(a,o):y&&y.isColor&&(h(y,1),v=!0);const I=n.xr.getEnvironmentBlendMode();I==="additive"?A.buffers.color.setClear(0,0,0,1,s):I==="alpha-blend"&&A.buffers.color.setClear(0,0,0,0,s),(n.autoClear||v)&&(A.buffers.depth.setTest(!0),A.buffers.depth.setMask(!0),A.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(C,v){const y=g(v);y&&(y.isCubeTexture||y.mapping===Fa)?(c===void 0&&(c=new Ft(new Nr(1,1,1),new Kt({name:"BackgroundCubeMaterial",uniforms:Ji(IA.backgroundCube.uniforms),vertexShader:IA.backgroundCube.vertexShader,fragmentShader:IA.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(I,U,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),Hn.copy(v.backgroundRotation),Hn.x*=-1,Hn.y*=-1,Hn.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Hn.y*=-1,Hn.z*=-1),c.material.uniforms.envMap.value=y,c.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_0.makeRotationFromEuler(Hn)),c.material.toneMapped=tt.getTransfer(y.colorSpace)!==lt,(u!==y||f!==y.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=y,f=y.version,d=n.toneMapping),c.layers.enableAll(),C.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Ft(new Fn(2,2),new Kt({name:"BackgroundMaterial",uniforms:Ji(IA.background.uniforms),vertexShader:IA.background.vertexShader,fragmentShader:IA.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=tt.getTransfer(y.colorSpace)!==lt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||f!==y.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,f=y.version,d=n.toneMapping),l.layers.enableAll(),C.unshift(l,l.geometry,l.material,0,0,null))}function h(C,v){C.getRGB(ls,Ih(n)),A.buffers.color.setClear(ls.r,ls.g,ls.b,v,s)}return{getClearColor:function(){return a},setClearColor:function(C,v=1){a.set(C),o=v,h(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(C){o=C,h(a,o)},render:m,addToRenderList:p}}function E0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),A={},i=f(null);let r=i,s=!1;function a(_,b,k,P,Y){let Z=!1;const W=u(P,k,b);r!==W&&(r=W,l(r.object)),Z=d(_,P,k,Y),Z&&g(_,P,k,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(Z||s)&&(s=!1,y(_,b,k,P),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function o(){return n.createVertexArray()}function l(_){return n.bindVertexArray(_)}function c(_){return n.deleteVertexArray(_)}function u(_,b,k){const P=k.wireframe===!0;let Y=A[_.id];Y===void 0&&(Y={},A[_.id]=Y);let Z=Y[b.id];Z===void 0&&(Z={},Y[b.id]=Z);let W=Z[P];return W===void 0&&(W=f(o()),Z[P]=W),W}function f(_){const b=[],k=[],P=[];for(let Y=0;Y<t;Y++)b[Y]=0,k[Y]=0,P[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:k,attributeDivisors:P,object:_,attributes:{},index:null}}function d(_,b,k,P){const Y=r.attributes,Z=b.attributes;let W=0;const q=k.getAttributes();for(const X in q)if(q[X].location>=0){const ae=Y[X];let pe=Z[X];if(pe===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(pe=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(pe=_.instanceColor)),ae===void 0||ae.attribute!==pe||pe&&ae.data!==pe.data)return!0;W++}return r.attributesNum!==W||r.index!==P}function g(_,b,k,P){const Y={},Z=b.attributes;let W=0;const q=k.getAttributes();for(const X in q)if(q[X].location>=0){let ae=Z[X];ae===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(ae=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(ae=_.instanceColor));const pe={};pe.attribute=ae,ae&&ae.data&&(pe.data=ae.data),Y[X]=pe,W++}r.attributes=Y,r.attributesNum=W,r.index=P}function m(){const _=r.newAttributes;for(let b=0,k=_.length;b<k;b++)_[b]=0}function p(_){h(_,0)}function h(_,b){const k=r.newAttributes,P=r.enabledAttributes,Y=r.attributeDivisors;k[_]=1,P[_]===0&&(n.enableVertexAttribArray(_),P[_]=1),Y[_]!==b&&(n.vertexAttribDivisor(_,b),Y[_]=b)}function C(){const _=r.newAttributes,b=r.enabledAttributes;for(let k=0,P=b.length;k<P;k++)b[k]!==_[k]&&(n.disableVertexAttribArray(k),b[k]=0)}function v(_,b,k,P,Y,Z,W){W===!0?n.vertexAttribIPointer(_,b,k,Y,Z):n.vertexAttribPointer(_,b,k,P,Y,Z)}function y(_,b,k,P){m();const Y=P.attributes,Z=k.getAttributes(),W=b.defaultAttributeValues;for(const q in Z){const X=Z[q];if(X.location>=0){let se=Y[q];if(se===void 0&&(q==="instanceMatrix"&&_.instanceMatrix&&(se=_.instanceMatrix),q==="instanceColor"&&_.instanceColor&&(se=_.instanceColor)),se!==void 0){const ae=se.normalized,pe=se.itemSize,De=e.get(se);if(De===void 0)continue;const Ge=De.buffer,J=De.type,$=De.bytesPerElement,fe=J===n.INT||J===n.UNSIGNED_INT||se.gpuType===gc;if(se.isInterleavedBufferAttribute){const ce=se.data,Pe=ce.stride,Ve=se.offset;if(ce.isInstancedInterleavedBuffer){for(let ze=0;ze<X.locationSize;ze++)h(X.location+ze,ce.meshPerAttribute);_.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ze=0;ze<X.locationSize;ze++)p(X.location+ze);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ze=0;ze<X.locationSize;ze++)v(X.location+ze,pe/X.locationSize,J,ae,Pe*$,(Ve+pe/X.locationSize*ze)*$,fe)}else{if(se.isInstancedBufferAttribute){for(let ce=0;ce<X.locationSize;ce++)h(X.location+ce,se.meshPerAttribute);_.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let ce=0;ce<X.locationSize;ce++)p(X.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ce=0;ce<X.locationSize;ce++)v(X.location+ce,pe/X.locationSize,J,ae,pe*$,pe/X.locationSize*ce*$,fe)}}else if(W!==void 0){const ae=W[q];if(ae!==void 0)switch(ae.length){case 2:n.vertexAttrib2fv(X.location,ae);break;case 3:n.vertexAttrib3fv(X.location,ae);break;case 4:n.vertexAttrib4fv(X.location,ae);break;default:n.vertexAttrib1fv(X.location,ae)}}}}C()}function I(){R();for(const _ in A){const b=A[_];for(const k in b){const P=b[k];for(const Y in P)c(P[Y].object),delete P[Y];delete b[k]}delete A[_]}}function U(_){if(A[_.id]===void 0)return;const b=A[_.id];for(const k in b){const P=b[k];for(const Y in P)c(P[Y].object),delete P[Y];delete b[k]}delete A[_.id]}function M(_){for(const b in A){const k=A[b];if(k[_.id]===void 0)continue;const P=k[_.id];for(const Y in P)c(P[Y].object),delete P[Y];delete k[_.id]}}function R(){x(),s=!0,r!==i&&(r=i,l(r.object))}function x(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:x,dispose:I,releaseStatesOfGeometry:U,releaseStatesOfProgram:M,initAttributes:m,enableAttribute:p,disableUnusedAttributes:C}}function y0(n,e,t){let A;function i(l){A=l}function r(l,c){n.drawArrays(A,l,c),t.update(c,A,1)}function s(l,c,u){u!==0&&(n.drawArraysInstanced(A,l,c,u),t.update(c,A,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(A,l,0,c,0,u);let d=0;for(let g=0;g<u;g++)d+=c[g];t.update(d,A,1)}function o(l,c,u,f){if(u===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)s(l[g],c[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(A,l,0,c,0,f,0,u);let g=0;for(let m=0;m<u;m++)g+=c[m];for(let m=0;m<f.length;m++)t.update(g,A,f[m])}}this.setMode=i,this.render=r,this.renderInstances=s,this.renderMultiDraw=a,this.renderMultiDrawInstances=o}function U0(n,e,t,A){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const U=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(U.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(U){return!(U!==TA&&A.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(U){const M=U===Zi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(U!==tn&&A.convert(U)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&U!==qA&&!M)}function o(U){if(U==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";U="mediump"}return U==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const c=o(l);c!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",c,"instead."),l=c);const u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),h=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),C=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,I=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:o,textureFormatReadable:s,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:d,maxTextureSize:g,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:h,maxVaryings:C,maxFragmentUniforms:v,vertexTextures:y,maxSamples:I}}function M0(n){const e=this;let t=null,A=0,i=!1,r=!1;const s=new dn,a=new ke,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||A!==0||i;return i=f,A=u.length,d},this.beginShadows=function(){r=!0,c(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=c(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,m=u.clipIntersection,p=u.clipShadows,h=n.get(u);if(!i||g===null||g.length===0||r&&!p)r?c(null):l();else{const C=r?0:A,v=C*4;let y=h.clippingState||null;o.value=y,y=c(g,f,v,d);for(let I=0;I!==v;++I)y[I]=t[I];h.clippingState=y,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=C}};function l(){o.value!==t&&(o.value=t,o.needsUpdate=A>0),e.numPlanes=A,e.numIntersection=0}function c(u,f,d,g){const m=u!==null?u.length:0;let p=null;if(m!==0){if(p=o.value,g!==!0||p===null){const h=d+m*4,C=f.matrixWorldInverse;a.getNormalMatrix(C),(p===null||p.length<h)&&(p=new Float32Array(h));for(let v=0,y=d;v!==m;++v,y+=4)s.copy(u[v]).applyMatrix4(C,a),s.normal.toArray(p,y),p[y+3]=s.constant}o.value=p,o.needsUpdate=!0}return e.numPlanes=m,e.numIntersection=0,p}}function S0(n){let e=new WeakMap;function t(s,a){return a===nl?s.mapping=zi:a===il&&(s.mapping=Wi),s}function A(s){if(s&&s.isTexture){const a=s.mapping;if(a===nl||a===il)if(e.has(s)){const o=e.get(s).texture;return t(o,s.mapping)}else{const o=s.image;if(o&&o.height>0){const l=new Ng(o.height);return l.fromEquirectangularTexture(n,s),e.set(s,l),s.addEventListener("dispose",i),t(l.texture,s.mapping)}else return null}}return s}function i(s){const a=s.target;a.removeEventListener("dispose",i);const o=e.get(a);o!==void 0&&(e.delete(a),o.dispose())}function r(){e=new WeakMap}return{get:A,dispose:r}}class Ph extends Rh{constructor(e=-1,t=1,A=1,i=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=A,this.bottom=i,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,A,i,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=A,this.view.offsetY=i,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),A=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=A-e,s=A+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,s=r+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(r,s,a,o,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Li=4,du=[.125,.215,.35,.446,.526,.582],Vn=20,mo=new Ph,pu=new Oe;let Bo=null,vo=0,wo=0,Co=!1;const On=(1+Math.sqrt(5))/2,_i=1/On,gu=[new Q(-On,_i,0),new Q(On,_i,0),new Q(-_i,0,On),new Q(_i,0,On),new Q(0,On,-_i),new Q(0,On,_i),new Q(-1,1,-1),new Q(1,1,-1),new Q(-1,1,1),new Q(1,1,1)];class mu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,A=.1,i=100){Bo=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,A,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Bo,vo,wo),this._renderer.xr.enabled=Co,e.scissorTest=!1,cs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zi||e.mapping===Wi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bo=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const A=t||this._allocateTargets();return this._textureToCubeUV(e,A),this._applyPMREM(A),this._cleanup(A),A}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,A={magFilter:fA,minFilter:fA,generateMipmaps:!1,type:Zi,format:TA,colorSpace:bn,depthBuffer:!1},i=Bu(e,t,A);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bu(e,t,A);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=F0(r)),this._blurMaterial=T0(r,e,t)}return i}_compileMaterial(e){const t=new Ft(this._lodPlanes[0],e);this._renderer.compile(t,mo)}_sceneToCubeUV(e,t,A,i){const a=new cA(90,1,t,A),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,u=c.autoClear,f=c.toneMapping;c.getClearColor(pu),c.toneMapping=xn,c.autoClear=!1;const d=new Oi({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),g=new Ft(new Nr,d);let m=!1;const p=e.background;p?p.isColor&&(d.color.copy(p),e.background=null,m=!0):(d.color.copy(pu),m=!0);for(let h=0;h<6;h++){const C=h%3;C===0?(a.up.set(0,o[h],0),a.lookAt(l[h],0,0)):C===1?(a.up.set(0,0,o[h]),a.lookAt(0,l[h],0)):(a.up.set(0,o[h],0),a.lookAt(0,0,l[h]));const v=this._cubeSize;cs(i,C*v,h>2?v:0,v,v),c.setRenderTarget(i),m&&c.render(g,a),c.render(e,a)}g.geometry.dispose(),g.material.dispose(),c.toneMapping=f,c.autoClear=u,e.background=p}_textureToCubeUV(e,t){const A=this._renderer,i=e.mapping===zi||e.mapping===Wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=wu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vu());const r=i?this._cubemapMaterial:this._equirectMaterial,s=new Ft(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const o=this._cubeSize;cs(t,0,0,3*o,2*o),A.setRenderTarget(t),A.render(s,mo)}_applyPMREM(e){const t=this._renderer,A=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=gu[(i-r-1)%gu.length];this._blur(e,r-1,r,s,a)}t.autoClear=A}_blur(e,t,A,i,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,A,i,"latitudinal",r),this._halfBlur(s,e,A,A,i,"longitudinal",r)}_halfBlur(e,t,A,i,r,s,a){const o=this._renderer,l=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const c=3,u=new Ft(this._lodPlanes[i],l),f=l.uniforms,d=this._sizeLods[A]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Vn-1),m=r/g,p=isFinite(r)?1+Math.floor(c*m):Vn;p>Vn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Vn}`);const h=[];let C=0;for(let M=0;M<Vn;++M){const R=M/m,x=Math.exp(-R*R/2);h.push(x),M===0?C+=x:M<p&&(C+=2*x)}for(let M=0;M<h.length;M++)h[M]=h[M]/C;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=s==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-A;const y=this._sizeLods[i],I=3*y*(i>v-Li?i-v+Li:0),U=4*(this._cubeSize-y);cs(t,I,U,3*y,2*y),o.setRenderTarget(t),o.render(u,mo)}}function F0(n){const e=[],t=[],A=[];let i=n;const r=n-Li+1+du.length;for(let s=0;s<r;s++){const a=Math.pow(2,i);t.push(a);let o=1/a;s>n-Li?o=du[s-n+Li-1]:s===0&&(o=0),A.push(o);const l=1/(a-2),c=-l,u=1+l,f=[c,c,u,c,u,u,c,c,u,u,c,u],d=6,g=6,m=3,p=2,h=1,C=new Float32Array(m*g*d),v=new Float32Array(p*g*d),y=new Float32Array(h*g*d);for(let U=0;U<d;U++){const M=U%3*2/3-1,R=U>2?0:-1,x=[M,R,0,M+2/3,R,0,M+2/3,R+1,0,M,R,0,M+2/3,R+1,0,M,R+1,0];C.set(x,m*g*U),v.set(f,p*g*U);const _=[U,U,U,U,U,U];y.set(_,h*g*U)}const I=new Pt;I.setAttribute("position",new Mt(C,m)),I.setAttribute("uv",new Mt(v,p)),I.setAttribute("faceIndex",new Mt(y,h)),e.push(I),i>Li&&i--}return{lodPlanes:e,sizeLods:t,sigmas:A}}function Bu(n,e,t){const A=new Sn(n,e,t);return A.texture.mapping=Fa,A.texture.name="PMREM.cubeUv",A.scissorTest=!0,A}function cs(n,e,t,A,i){n.viewport.set(e,t,A,i),n.scissor.set(e,t,A,i)}function T0(n,e,t){const A=new Float32Array(Vn),i=new Q(0,1,0);return new Kt({name:"SphericalGaussianBlur",defines:{n:Vn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:A},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:yc(),fragmentShader:`

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
		`,blending:jA,depthTest:!1,depthWrite:!1})}function vu(){return new Kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yc(),fragmentShader:`

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
		`,blending:jA,depthTest:!1,depthWrite:!1})}function wu(){return new Kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:jA,depthTest:!1,depthWrite:!1})}function yc(){return`

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
	`}function b0(n){let e=new WeakMap,t=null;function A(a){if(a&&a.isTexture){const o=a.mapping,l=o===nl||o===il,c=o===zi||o===Wi;if(l||c){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new mu(n)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const d=a.image;return l&&d&&d.height>0||c&&d&&i(d)?(t===null&&(t=new mu(n)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let o=0;const l=6;for(let c=0;c<l;c++)a[c]!==void 0&&o++;return o===l}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:A,dispose:s}}function Q0(n){const e={};function t(A){if(e[A]!==void 0)return e[A];let i;switch(A){case"WEBGL_depth_texture":i=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=n.getExtension(A)}return e[A]=i,i}return{has:function(A){return t(A)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(A){const i=t(A);return i===null&&xr("THREE.WebGLRenderer: "+A+" extension not supported."),i}}}function I0(n,e,t,A){const i={},r=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const m=f.morphAttributes[g];for(let p=0,h=m.length;p<h;p++)e.remove(m[p])}f.removeEventListener("dispose",s),delete i[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),A.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",s),i[f.id]=!0,t.memory.geometries++),f}function o(u){const f=u.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const d=u.morphAttributes;for(const g in d){const m=d[g];for(let p=0,h=m.length;p<h;p++)e.update(m[p],n.ARRAY_BUFFER)}}function l(u){const f=[],d=u.index,g=u.attributes.position;let m=0;if(d!==null){const C=d.array;m=d.version;for(let v=0,y=C.length;v<y;v+=3){const I=C[v+0],U=C[v+1],M=C[v+2];f.push(I,U,U,M,M,I)}}else if(g!==void 0){const C=g.array;m=g.version;for(let v=0,y=C.length/3-1;v<y;v+=3){const I=v+0,U=v+1,M=v+2;f.push(I,U,U,M,M,I)}}else return;const p=new(Mh(f)?Qh:bh)(f,1);p.version=m;const h=r.get(u);h&&e.remove(h),r.set(u,p)}function c(u){const f=r.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:o,getWireframeAttribute:c}}function L0(n,e,t){let A;function i(f){A=f}let r,s;function a(f){r=f.type,s=f.bytesPerElement}function o(f,d){n.drawElements(A,d,r,f*s),t.update(d,A,1)}function l(f,d,g){g!==0&&(n.drawElementsInstanced(A,d,r,f*s,g),t.update(d,A,g))}function c(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(A,d,0,r,f,0,g);let p=0;for(let h=0;h<g;h++)p+=d[h];t.update(p,A,1)}function u(f,d,g,m){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<f.length;h++)l(f[h]/s,d[h],m[h]);else{p.multiDrawElementsInstancedWEBGL(A,d,0,r,f,0,m,0,g);let h=0;for(let C=0;C<g;C++)h+=d[C];for(let C=0;C<m.length;C++)t.update(h,A,m[C])}}this.setMode=i,this.setIndex=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function R0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function A(r,s,a){switch(t.calls++,s){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:A}}function D0(n,e,t){const A=new WeakMap,i=new ft;function r(s,a,o){const l=s.morphTargetInfluences,c=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=c!==void 0?c.length:0;let f=A.get(a);if(f===void 0||f.count!==u){let _=function(){R.dispose(),A.delete(a),a.removeEventListener("dispose",_)};var d=_;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,h=a.morphAttributes.position||[],C=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),m===!0&&(y=2),p===!0&&(y=3);let I=a.attributes.position.count*y,U=1;I>e.maxTextureSize&&(U=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const M=new Float32Array(I*U*4*u),R=new Fh(M,I,U,u);R.type=qA,R.needsUpdate=!0;const x=y*4;for(let b=0;b<u;b++){const k=h[b],P=C[b],Y=v[b],Z=I*U*4*b;for(let W=0;W<k.count;W++){const q=W*x;g===!0&&(i.fromBufferAttribute(k,W),M[Z+q+0]=i.x,M[Z+q+1]=i.y,M[Z+q+2]=i.z,M[Z+q+3]=0),m===!0&&(i.fromBufferAttribute(P,W),M[Z+q+4]=i.x,M[Z+q+5]=i.y,M[Z+q+6]=i.z,M[Z+q+7]=0),p===!0&&(i.fromBufferAttribute(Y,W),M[Z+q+8]=i.x,M[Z+q+9]=i.y,M[Z+q+10]=i.z,M[Z+q+11]=Y.itemSize===4?i.w:1)}}f={count:u,texture:R,size:new ye(I,U)},A.set(a,f),a.addEventListener("dispose",_)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)o.getUniforms().setValue(n,"morphTexture",s.morphTexture,t);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const m=a.morphTargetsRelative?1:1-g;o.getUniforms().setValue(n,"morphTargetBaseInfluence",m),o.getUniforms().setValue(n,"morphTargetInfluences",l)}o.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),o.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function H0(n,e,t,A){let i=new WeakMap;function r(o){const l=A.render.frame,c=o.geometry,u=e.get(o,c);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),o.isInstancedMesh&&(o.hasEventListener("dispose",a)===!1&&o.addEventListener("dispose",a),i.get(o)!==l&&(t.update(o.instanceMatrix,n.ARRAY_BUFFER),o.instanceColor!==null&&t.update(o.instanceColor,n.ARRAY_BUFFER),i.set(o,l))),o.isSkinnedMesh){const f=o.skeleton;i.get(f)!==l&&(f.update(),i.set(f,l))}return u}function s(){i=new WeakMap}function a(o){const l=o.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:s}}class Nh extends eA{constructor(e,t,A,i,r,s,a,o,l,c=Pi){if(c!==Pi&&c!==Yi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");A===void 0&&c===Pi&&(A=$n),A===void 0&&c===Yi&&(A=Xi),super(null,i,r,s,a,o,c,A,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:CA,this.minFilter=o!==void 0?o:CA,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Oh=new eA,Cu=new Nh(1,1),Gh=new Fh,Vh=new Eg,Kh=new Dh,_u=[],xu=[],Eu=new Float32Array(16),yu=new Float32Array(9),Uu=new Float32Array(4);function ji(n,e,t){const A=n[0];if(A<=0||A>0)return n;const i=e*t;let r=_u[i];if(r===void 0&&(r=new Float32Array(i),_u[i]=r),e!==0){A.toArray(r,0);for(let s=1,a=0;s!==e;++s)a+=t,n[s].toArray(r,a)}return r}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,A=n.length;t<A;t++)if(n[t]!==e[t])return!1;return!0}function Lt(n,e){for(let t=0,A=e.length;t<A;t++)n[t]=e[t]}function ba(n,e){let t=xu[e];t===void 0&&(t=new Int32Array(e),xu[e]=t);for(let A=0;A!==e;++A)t[A]=n.allocateTextureUnit();return t}function P0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function N0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Lt(t,e)}}function O0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Lt(t,e)}}function G0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Lt(t,e)}}function V0(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,A))return;Uu.set(A),n.uniformMatrix2fv(this.addr,!1,Uu),Lt(t,A)}}function K0(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,A))return;yu.set(A),n.uniformMatrix3fv(this.addr,!1,yu),Lt(t,A)}}function k0(n,e){const t=this.cache,A=e.elements;if(A===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(It(t,A))return;Eu.set(A),n.uniformMatrix4fv(this.addr,!1,Eu),Lt(t,A)}}function z0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function W0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Lt(t,e)}}function X0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Lt(t,e)}}function Y0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Lt(t,e)}}function J0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function q0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Lt(t,e)}}function Z0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Lt(t,e)}}function j0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Lt(t,e)}}function $0(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i);let r;this.type===n.SAMPLER_2D_SHADOW?(Cu.compareFunction=Uh,r=Cu):r=Oh,t.setTexture2D(e||r,i)}function ev(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture3D(e||Vh,i)}function tv(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTextureCube(e||Kh,i)}function Av(n,e,t){const A=this.cache,i=t.allocateTextureUnit();A[0]!==i&&(n.uniform1i(this.addr,i),A[0]=i),t.setTexture2DArray(e||Gh,i)}function nv(n){switch(n){case 5126:return P0;case 35664:return N0;case 35665:return O0;case 35666:return G0;case 35674:return V0;case 35675:return K0;case 35676:return k0;case 5124:case 35670:return z0;case 35667:case 35671:return W0;case 35668:case 35672:return X0;case 35669:case 35673:return Y0;case 5125:return J0;case 36294:return q0;case 36295:return Z0;case 36296:return j0;case 35678:case 36198:case 36298:case 36306:case 35682:return $0;case 35679:case 36299:case 36307:return ev;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return Av}}function iv(n,e){n.uniform1fv(this.addr,e)}function rv(n,e){const t=ji(e,this.size,2);n.uniform2fv(this.addr,t)}function sv(n,e){const t=ji(e,this.size,3);n.uniform3fv(this.addr,t)}function av(n,e){const t=ji(e,this.size,4);n.uniform4fv(this.addr,t)}function ov(n,e){const t=ji(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function lv(n,e){const t=ji(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function cv(n,e){const t=ji(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function uv(n,e){n.uniform1iv(this.addr,e)}function fv(n,e){n.uniform2iv(this.addr,e)}function hv(n,e){n.uniform3iv(this.addr,e)}function dv(n,e){n.uniform4iv(this.addr,e)}function pv(n,e){n.uniform1uiv(this.addr,e)}function gv(n,e){n.uniform2uiv(this.addr,e)}function mv(n,e){n.uniform3uiv(this.addr,e)}function Bv(n,e){n.uniform4uiv(this.addr,e)}function vv(n,e,t){const A=this.cache,i=e.length,r=ba(t,i);It(A,r)||(n.uniform1iv(this.addr,r),Lt(A,r));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||Oh,r[s])}function wv(n,e,t){const A=this.cache,i=e.length,r=ba(t,i);It(A,r)||(n.uniform1iv(this.addr,r),Lt(A,r));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Vh,r[s])}function Cv(n,e,t){const A=this.cache,i=e.length,r=ba(t,i);It(A,r)||(n.uniform1iv(this.addr,r),Lt(A,r));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||Kh,r[s])}function _v(n,e,t){const A=this.cache,i=e.length,r=ba(t,i);It(A,r)||(n.uniform1iv(this.addr,r),Lt(A,r));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Gh,r[s])}function xv(n){switch(n){case 5126:return iv;case 35664:return rv;case 35665:return sv;case 35666:return av;case 35674:return ov;case 35675:return lv;case 35676:return cv;case 5124:case 35670:return uv;case 35667:case 35671:return fv;case 35668:case 35672:return hv;case 35669:case 35673:return dv;case 5125:return pv;case 36294:return gv;case 36295:return mv;case 36296:return Bv;case 35678:case 36198:case 36298:case 36306:case 35682:return vv;case 35679:case 36299:case 36307:return wv;case 35680:case 36300:case 36308:case 36293:return Cv;case 36289:case 36303:case 36311:case 36292:return _v}}class Ev{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.setValue=nv(t.type)}}class yv{constructor(e,t,A){this.id=e,this.addr=A,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=xv(t.type)}}class Uv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,A){const i=this.seq;for(let r=0,s=i.length;r!==s;++r){const a=i[r];a.setValue(e,t[a.id],A)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function Mu(n,e){n.seq.push(e),n.map[e.id]=e}function Mv(n,e,t){const A=n.name,i=A.length;for(_o.lastIndex=0;;){const r=_o.exec(A),s=_o.lastIndex;let a=r[1];const o=r[2]==="]",l=r[3];if(o&&(a=a|0),l===void 0||l==="["&&s+2===i){Mu(t,l===void 0?new Ev(a,n,e):new yv(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new Uv(a),Mu(t,u)),t=u}}}class js{constructor(e,t){this.seq=[],this.map={};const A=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<A;++i){const r=e.getActiveUniform(t,i),s=e.getUniformLocation(t,r.name);Mv(r,s,this)}}setValue(e,t,A,i){const r=this.map[t];r!==void 0&&r.setValue(e,A,i)}setOptional(e,t,A){const i=t[A];i!==void 0&&this.setValue(e,A,i)}static upload(e,t,A,i){for(let r=0,s=t.length;r!==s;++r){const a=t[r],o=A[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,i)}}static seqWithValue(e,t){const A=[];for(let i=0,r=e.length;i!==r;++i){const s=e[i];s.id in t&&A.push(s)}return A}}function Su(n,e,t){const A=n.createShader(e);return n.shaderSource(A,t),n.compileShader(A),A}const Sv=37297;let Fv=0;function Tv(n,e){const t=n.split(`
`),A=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=i;s<r;s++){const a=s+1;A.push(`${a===e?">":" "} ${a}: ${t[s]}`)}return A.join(`
`)}function bv(n){const e=tt.getPrimaries(tt.workingColorSpace),t=tt.getPrimaries(n);let A;switch(e===t?A="":e===oa&&t===aa?A="LinearDisplayP3ToLinearSRGB":e===aa&&t===oa&&(A="LinearSRGBToLinearDisplayP3"),n){case bn:case Ta:return[A,"LinearTransferOETF"];case FA:case _c:return[A,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[A,"LinearTransferOETF"]}}function Fu(n,e,t){const A=n.getShaderParameter(e,n.COMPILE_STATUS),i=n.getShaderInfoLog(e).trim();if(A&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const s=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Tv(n.getShaderSource(e),s)}else return i}function Qv(n,e){const t=bv(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Iv(n,e){let t;switch(e){case Zp:t="Linear";break;case jp:t="Reinhard";break;case $p:t="OptimizedCineon";break;case eg:t="ACESFilmic";break;case Ag:t="AgX";break;case ng:t="Neutral";break;case tg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const us=new Q;function Lv(){tt.getLuminanceCoefficients(us);const n=us.x.toFixed(4),e=us.y.toFixed(4),t=us.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(pr).join(`
`)}function Dv(n){const e=[];for(const t in n){const A=n[t];A!==!1&&e.push("#define "+t+" "+A)}return e.join(`
`)}function Hv(n,e){const t={},A=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let i=0;i<A;i++){const r=n.getActiveAttrib(e,i),s=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[s]={type:r.type,location:n.getAttribLocation(e,s),locationSize:a}}return t}function pr(n){return n!==""}function Tu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Pv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ll(n){return n.replace(Pv,Ov)}const Nv=new Map;function Ov(n,e){let t=Ke[e];if(t===void 0){const A=Nv.get(e);if(A!==void 0)t=Ke[A],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,A);else throw new Error("Can not resolve #include <"+e+">")}return Ll(t)}const Gv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qu(n){return n.replace(Gv,Vv)}function Vv(n,e,t,A){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=A.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Iu(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function Kv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===fh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===xp?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===XA&&(e="SHADOWMAP_TYPE_VSM"),e}function kv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case zi:case Wi:e="ENVMAP_TYPE_CUBE";break;case Fa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function zv(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Wi:e="ENVMAP_MODE_REFRACTION";break}return e}function Wv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hh:e="ENVMAP_BLENDING_MULTIPLY";break;case Jp:e="ENVMAP_BLENDING_MIX";break;case qp:e="ENVMAP_BLENDING_ADD";break}return e}function Xv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,A=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:A,maxMip:t}}function Yv(n,e,t,A){const i=n.getContext(),r=t.defines;let s=t.vertexShader,a=t.fragmentShader;const o=Kv(t),l=kv(t),c=zv(t),u=Wv(t),f=Xv(t),d=Rv(t),g=Dv(r),m=i.createProgram();let p,h,C=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pr).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(pr).join(`
`),h.length>0&&(h+=`
`)):(p=[Iu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(pr).join(`
`),h=[Iu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+o:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==xn?"#define TONE_MAPPING":"",t.toneMapping!==xn?Ke.tonemapping_pars_fragment:"",t.toneMapping!==xn?Iv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,Qv("linearToOutputTexel",t.outputColorSpace),Lv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(pr).join(`
`)),s=Ll(s),s=Tu(s,t),s=bu(s,t),a=Ll(a),a=Tu(a,t),a=bu(a,t),s=Qu(s),a=Qu(a),t.isRawShaderMaterial!==!0&&(C=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===Yc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const v=C+p+s,y=C+h+a,I=Su(i,i.VERTEX_SHADER,v),U=Su(i,i.FRAGMENT_SHADER,y);i.attachShader(m,I),i.attachShader(m,U),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function M(b){if(n.debug.checkShaderErrors){const k=i.getProgramInfoLog(m).trim(),P=i.getShaderInfoLog(I).trim(),Y=i.getShaderInfoLog(U).trim();let Z=!0,W=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(i,m,I,U);else{const q=Fu(i,I,"vertex"),X=Fu(i,U,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+k+`
`+q+`
`+X)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(P===""||Y==="")&&(W=!1);W&&(b.diagnostics={runnable:Z,programLog:k,vertexShader:{log:P,prefix:p},fragmentShader:{log:Y,prefix:h}})}i.deleteShader(I),i.deleteShader(U),R=new js(i,m),x=Hv(i,m)}let R;this.getUniforms=function(){return R===void 0&&M(this),R};let x;this.getAttributes=function(){return x===void 0&&M(this),x};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=i.getProgramParameter(m,Sv)),_},this.destroy=function(){A.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Fv++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=I,this.fragmentShader=U,this}let Jv=0;class qv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,A=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(A),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const A of t)A.usedTimes--,A.usedTimes===0&&this.shaderCache.delete(A.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let A=t.get(e);return A===void 0&&(A=new Set,t.set(e,A)),A}_getShaderStage(e){const t=this.shaderCache;let A=t.get(e);return A===void 0&&(A=new Zv(e),t.set(e,A)),A}}class Zv{constructor(e){this.id=Jv++,this.code=e,this.usedTimes=0}}function jv(n,e,t,A,i,r,s){const a=new xc,o=new qv,l=new Set,c=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function p(x,_,b,k,P){const Y=k.fog,Z=P.geometry,W=x.isMeshStandardMaterial?k.environment:null,q=(x.isMeshStandardMaterial?t:e).get(x.envMap||W),X=q&&q.mapping===Fa?q.image.height:null,se=g[x.type];x.precision!==null&&(d=i.getMaxPrecision(x.precision),d!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const ae=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,pe=ae!==void 0?ae.length:0;let De=0;Z.morphAttributes.position!==void 0&&(De=1),Z.morphAttributes.normal!==void 0&&(De=2),Z.morphAttributes.color!==void 0&&(De=3);let Ge,J,$,fe;if(se){const Ye=IA[se];Ge=Ye.vertexShader,J=Ye.fragmentShader}else Ge=x.vertexShader,J=x.fragmentShader,o.update(x),$=o.getVertexShaderID(x),fe=o.getFragmentShaderID(x);const ce=n.getRenderTarget(),Pe=P.isInstancedMesh===!0,Ve=P.isBatchedMesh===!0,ze=!!x.map,ot=!!x.matcap,T=!!q,pt=!!x.aoMap,Je=!!x.lightMap,qe=!!x.bumpMap,_e=!!x.normalMap,gt=!!x.displacementMap,Le=!!x.emissiveMap,He=!!x.metalnessMap,F=!!x.roughnessMap,w=x.anisotropy>0,K=x.clearcoat>0,ee=x.dispersion>0,Ae=x.iridescence>0,j=x.sheen>0,Ue=x.transmission>0,oe=w&&!!x.anisotropyMap,ge=K&&!!x.clearcoatMap,Ne=K&&!!x.clearcoatNormalMap,ne=K&&!!x.clearcoatRoughnessMap,me=Ae&&!!x.iridescenceMap,We=Ae&&!!x.iridescenceThicknessMap,Se=j&&!!x.sheenColorMap,Be=j&&!!x.sheenRoughnessMap,be=!!x.specularMap,Re=!!x.specularColorMap,ht=!!x.specularIntensityMap,B=Ue&&!!x.transmissionMap,N=Ue&&!!x.thicknessMap,O=!!x.gradientMap,z=!!x.alphaMap,te=x.alphaTest>0,xe=!!x.alphaHash,Qe=!!x.extensions;let vt=xn;x.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(vt=n.toneMapping);const Tt={shaderID:se,shaderType:x.type,shaderName:x.name,vertexShader:Ge,fragmentShader:J,defines:x.defines,customVertexShaderID:$,customFragmentShaderID:fe,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:Ve,batchingColor:Ve&&P._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&P.instanceColor!==null,instancingMorph:Pe&&P.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:bn,alphaToCoverage:!!x.alphaToCoverage,map:ze,matcap:ot,envMap:T,envMapMode:T&&q.mapping,envMapCubeUVHeight:X,aoMap:pt,lightMap:Je,bumpMap:qe,normalMap:_e,displacementMap:f&&gt,emissiveMap:Le,normalMapObjectSpace:_e&&x.normalMapType===ag,normalMapTangentSpace:_e&&x.normalMapType===yh,metalnessMap:He,roughnessMap:F,anisotropy:w,anisotropyMap:oe,clearcoat:K,clearcoatMap:ge,clearcoatNormalMap:Ne,clearcoatRoughnessMap:ne,dispersion:ee,iridescence:Ae,iridescenceMap:me,iridescenceThicknessMap:We,sheen:j,sheenColorMap:Se,sheenRoughnessMap:Be,specularMap:be,specularColorMap:Re,specularIntensityMap:ht,transmission:Ue,transmissionMap:B,thicknessMap:N,gradientMap:O,opaque:x.transparent===!1&&x.blending===Hi&&x.alphaToCoverage===!1,alphaMap:z,alphaTest:te,alphaHash:xe,combine:x.combine,mapUv:ze&&m(x.map.channel),aoMapUv:pt&&m(x.aoMap.channel),lightMapUv:Je&&m(x.lightMap.channel),bumpMapUv:qe&&m(x.bumpMap.channel),normalMapUv:_e&&m(x.normalMap.channel),displacementMapUv:gt&&m(x.displacementMap.channel),emissiveMapUv:Le&&m(x.emissiveMap.channel),metalnessMapUv:He&&m(x.metalnessMap.channel),roughnessMapUv:F&&m(x.roughnessMap.channel),anisotropyMapUv:oe&&m(x.anisotropyMap.channel),clearcoatMapUv:ge&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:We&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Be&&m(x.sheenRoughnessMap.channel),specularMapUv:be&&m(x.specularMap.channel),specularColorMapUv:Re&&m(x.specularColorMap.channel),specularIntensityMapUv:ht&&m(x.specularIntensityMap.channel),transmissionMapUv:B&&m(x.transmissionMap.channel),thicknessMapUv:N&&m(x.thicknessMap.channel),alphaMapUv:z&&m(x.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(_e||w),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!Z.attributes.uv&&(ze||z),fog:!!Y,useFog:x.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:P.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:De,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&b.length>0,shadowMapType:n.shadowMap.type,toneMapping:vt,decodeVideoTexture:ze&&x.map.isVideoTexture===!0&&tt.getTransfer(x.map.colorSpace)===lt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===uA,flipSided:x.side===$t,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Qe&&x.extensions.clipCullDistance===!0&&A.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qe&&x.extensions.multiDraw===!0||Ve)&&A.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:A.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function h(x){const _=[];if(x.shaderID?_.push(x.shaderID):(_.push(x.customVertexShaderID),_.push(x.customFragmentShaderID)),x.defines!==void 0)for(const b in x.defines)_.push(b),_.push(x.defines[b]);return x.isRawShaderMaterial===!1&&(C(_,x),v(_,x),_.push(n.outputColorSpace)),_.push(x.customProgramCacheKey),_.join()}function C(x,_){x.push(_.precision),x.push(_.outputColorSpace),x.push(_.envMapMode),x.push(_.envMapCubeUVHeight),x.push(_.mapUv),x.push(_.alphaMapUv),x.push(_.lightMapUv),x.push(_.aoMapUv),x.push(_.bumpMapUv),x.push(_.normalMapUv),x.push(_.displacementMapUv),x.push(_.emissiveMapUv),x.push(_.metalnessMapUv),x.push(_.roughnessMapUv),x.push(_.anisotropyMapUv),x.push(_.clearcoatMapUv),x.push(_.clearcoatNormalMapUv),x.push(_.clearcoatRoughnessMapUv),x.push(_.iridescenceMapUv),x.push(_.iridescenceThicknessMapUv),x.push(_.sheenColorMapUv),x.push(_.sheenRoughnessMapUv),x.push(_.specularMapUv),x.push(_.specularColorMapUv),x.push(_.specularIntensityMapUv),x.push(_.transmissionMapUv),x.push(_.thicknessMapUv),x.push(_.combine),x.push(_.fogExp2),x.push(_.sizeAttenuation),x.push(_.morphTargetsCount),x.push(_.morphAttributeCount),x.push(_.numDirLights),x.push(_.numPointLights),x.push(_.numSpotLights),x.push(_.numSpotLightMaps),x.push(_.numHemiLights),x.push(_.numRectAreaLights),x.push(_.numDirLightShadows),x.push(_.numPointLightShadows),x.push(_.numSpotLightShadows),x.push(_.numSpotLightShadowsWithMaps),x.push(_.numLightProbes),x.push(_.shadowMapType),x.push(_.toneMapping),x.push(_.numClippingPlanes),x.push(_.numClipIntersection),x.push(_.depthPacking)}function v(x,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.skinning&&a.enable(4),_.morphTargets&&a.enable(5),_.morphNormals&&a.enable(6),_.morphColors&&a.enable(7),_.premultipliedAlpha&&a.enable(8),_.shadowMapEnabled&&a.enable(9),_.doubleSided&&a.enable(10),_.flipSided&&a.enable(11),_.useDepthPacking&&a.enable(12),_.dithering&&a.enable(13),_.transmission&&a.enable(14),_.sheen&&a.enable(15),_.opaque&&a.enable(16),_.pointsUvs&&a.enable(17),_.decodeVideoTexture&&a.enable(18),_.alphaToCoverage&&a.enable(19),x.push(a.mask)}function y(x){const _=g[x.type];let b;if(_){const k=IA[_];b=Lh.clone(k.uniforms)}else b=x.uniforms;return b}function I(x,_){let b;for(let k=0,P=c.length;k<P;k++){const Y=c[k];if(Y.cacheKey===_){b=Y,++b.usedTimes;break}}return b===void 0&&(b=new Yv(n,_,x,r),c.push(b)),b}function U(x){if(--x.usedTimes===0){const _=c.indexOf(x);c[_]=c[c.length-1],c.pop(),x.destroy()}}function M(x){o.remove(x)}function R(){o.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:y,acquireProgram:I,releaseProgram:U,releaseShaderCache:M,programs:c,dispose:R}}function $v(){let n=new WeakMap;function e(r){let s=n.get(r);return s===void 0&&(s={},n.set(r,s)),s}function t(r){n.delete(r)}function A(r,s,a){n.get(r)[s]=a}function i(){n=new WeakMap}return{get:e,remove:t,update:A,dispose:i}}function ew(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Lu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Ru(){const n=[];let e=0;const t=[],A=[],i=[];function r(){e=0,t.length=0,A.length=0,i.length=0}function s(u,f,d,g,m,p){let h=n[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:m,group:p},n[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=d,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=m,h.group=p),e++,h}function a(u,f,d,g,m,p){const h=s(u,f,d,g,m,p);d.transmission>0?A.push(h):d.transparent===!0?i.push(h):t.push(h)}function o(u,f,d,g,m,p){const h=s(u,f,d,g,m,p);d.transmission>0?A.unshift(h):d.transparent===!0?i.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||ew),A.length>1&&A.sort(f||Lu),i.length>1&&i.sort(f||Lu)}function c(){for(let u=e,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:A,transparent:i,init:r,push:a,unshift:o,finish:c,sort:l}}function tw(){let n=new WeakMap;function e(A,i){const r=n.get(A);let s;return r===void 0?(s=new Ru,n.set(A,[s])):i>=r.length?(s=new Ru,r.push(s)):s=r[i],s}function t(){n=new WeakMap}return{get:e,dispose:t}}function Aw(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Q,color:new Oe};break;case"SpotLight":t={position:new Q,direction:new Q,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Q,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Q,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new Q,halfWidth:new Q,halfHeight:new Q};break}return n[e.id]=t,t}}}function nw(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let iw=0;function rw(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function sw(n){const e=new Aw,t=nw(),A={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)A.probe.push(new Q);const i=new Q,r=new at,s=new at;function a(l){let c=0,u=0,f=0;for(let x=0;x<9;x++)A.probe[x].set(0,0,0);let d=0,g=0,m=0,p=0,h=0,C=0,v=0,y=0,I=0,U=0,M=0;l.sort(rw);for(let x=0,_=l.length;x<_;x++){const b=l[x],k=b.color,P=b.intensity,Y=b.distance,Z=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)c+=k.r*P,u+=k.g*P,f+=k.b*P;else if(b.isLightProbe){for(let W=0;W<9;W++)A.probe[W].addScaledVector(b.sh.coefficients[W],P);M++}else if(b.isDirectionalLight){const W=e.get(b);if(W.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const q=b.shadow,X=t.get(b);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.directionalShadow[d]=X,A.directionalShadowMap[d]=Z,A.directionalShadowMatrix[d]=b.shadow.matrix,C++}A.directional[d]=W,d++}else if(b.isSpotLight){const W=e.get(b);W.position.setFromMatrixPosition(b.matrixWorld),W.color.copy(k).multiplyScalar(P),W.distance=Y,W.coneCos=Math.cos(b.angle),W.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),W.decay=b.decay,A.spot[m]=W;const q=b.shadow;if(b.map&&(A.spotLightMap[I]=b.map,I++,q.updateMatrices(b),b.castShadow&&U++),A.spotLightMatrix[m]=q.matrix,b.castShadow){const X=t.get(b);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,A.spotShadow[m]=X,A.spotShadowMap[m]=Z,y++}m++}else if(b.isRectAreaLight){const W=e.get(b);W.color.copy(k).multiplyScalar(P),W.halfWidth.set(b.width*.5,0,0),W.halfHeight.set(0,b.height*.5,0),A.rectArea[p]=W,p++}else if(b.isPointLight){const W=e.get(b);if(W.color.copy(b.color).multiplyScalar(b.intensity),W.distance=b.distance,W.decay=b.decay,b.castShadow){const q=b.shadow,X=t.get(b);X.shadowIntensity=q.intensity,X.shadowBias=q.bias,X.shadowNormalBias=q.normalBias,X.shadowRadius=q.radius,X.shadowMapSize=q.mapSize,X.shadowCameraNear=q.camera.near,X.shadowCameraFar=q.camera.far,A.pointShadow[g]=X,A.pointShadowMap[g]=Z,A.pointShadowMatrix[g]=b.shadow.matrix,v++}A.point[g]=W,g++}else if(b.isHemisphereLight){const W=e.get(b);W.skyColor.copy(b.color).multiplyScalar(P),W.groundColor.copy(b.groundColor).multiplyScalar(P),A.hemi[h]=W,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(A.rectAreaLTC1=le.LTC_FLOAT_1,A.rectAreaLTC2=le.LTC_FLOAT_2):(A.rectAreaLTC1=le.LTC_HALF_1,A.rectAreaLTC2=le.LTC_HALF_2)),A.ambient[0]=c,A.ambient[1]=u,A.ambient[2]=f;const R=A.hash;(R.directionalLength!==d||R.pointLength!==g||R.spotLength!==m||R.rectAreaLength!==p||R.hemiLength!==h||R.numDirectionalShadows!==C||R.numPointShadows!==v||R.numSpotShadows!==y||R.numSpotMaps!==I||R.numLightProbes!==M)&&(A.directional.length=d,A.spot.length=m,A.rectArea.length=p,A.point.length=g,A.hemi.length=h,A.directionalShadow.length=C,A.directionalShadowMap.length=C,A.pointShadow.length=v,A.pointShadowMap.length=v,A.spotShadow.length=y,A.spotShadowMap.length=y,A.directionalShadowMatrix.length=C,A.pointShadowMatrix.length=v,A.spotLightMatrix.length=y+I-U,A.spotLightMap.length=I,A.numSpotLightShadowsWithMaps=U,A.numLightProbes=M,R.directionalLength=d,R.pointLength=g,R.spotLength=m,R.rectAreaLength=p,R.hemiLength=h,R.numDirectionalShadows=C,R.numPointShadows=v,R.numSpotShadows=y,R.numSpotMaps=I,R.numLightProbes=M,A.version=iw++)}function o(l,c){let u=0,f=0,d=0,g=0,m=0;const p=c.matrixWorldInverse;for(let h=0,C=l.length;h<C;h++){const v=l[h];if(v.isDirectionalLight){const y=A.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),u++}else if(v.isSpotLight){const y=A.spot[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),d++}else if(v.isRectAreaLight){const y=A.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),s.identity(),r.copy(v.matrixWorld),r.premultiply(p),s.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(s),y.halfHeight.applyMatrix4(s),g++}else if(v.isPointLight){const y=A.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){const y=A.hemi[m];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(p),m++}}}return{setup:a,setupView:o,state:A}}function Du(n){const e=new sw(n),t=[],A=[];function i(c){l.camera=c,t.length=0,A.length=0}function r(c){t.push(c)}function s(c){A.push(c)}function a(){e.setup(t)}function o(c){e.setupView(t,c)}const l={lightsArray:t,shadowsArray:A,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:o,pushLight:r,pushShadow:s}}function aw(n){let e=new WeakMap;function t(i,r=0){const s=e.get(i);let a;return s===void 0?(a=new Du(n),e.set(i,[a])):r>=s.length?(a=new Du(n),s.push(a)):a=s[r],a}function A(){e=new WeakMap}return{get:t,dispose:A}}class ow extends Ai{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lw extends Ai{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const cw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,uw=`uniform sampler2D shadow_pass;
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
}`;function fw(n,e,t){let A=new Ec;const i=new ye,r=new ye,s=new ft,a=new ow({depthPacking:sg}),o=new lw,l={},c=t.maxTextureSize,u={[Mn]:$t,[$t]:Mn,[uA]:uA},f=new Kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:cw,fragmentShader:uw}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Pt;g.setAttribute("position",new Mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new Ft(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fh;let h=this.type;this.render=function(U,M,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||U.length===0)return;const x=n.getRenderTarget(),_=n.getActiveCubeFace(),b=n.getActiveMipmapLevel(),k=n.state;k.setBlending(jA),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const P=h!==XA&&this.type===XA,Y=h===XA&&this.type!==XA;for(let Z=0,W=U.length;Z<W;Z++){const q=U[Z],X=q.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const se=X.getFrameExtents();if(i.multiply(se),r.copy(X.mapSize),(i.x>c||i.y>c)&&(i.x>c&&(r.x=Math.floor(c/se.x),i.x=r.x*se.x,X.mapSize.x=r.x),i.y>c&&(r.y=Math.floor(c/se.y),i.y=r.y*se.y,X.mapSize.y=r.y)),X.map===null||P===!0||Y===!0){const pe=this.type!==XA?{minFilter:CA,magFilter:CA}:{};X.map!==null&&X.map.dispose(),X.map=new Sn(i.x,i.y,pe),X.map.texture.name=q.name+".shadowMap",X.camera.updateProjectionMatrix()}n.setRenderTarget(X.map),n.clear();const ae=X.getViewportCount();for(let pe=0;pe<ae;pe++){const De=X.getViewport(pe);s.set(r.x*De.x,r.y*De.y,r.x*De.z,r.y*De.w),k.viewport(s),X.updateMatrices(q,pe),A=X.getFrustum(),y(M,R,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===XA&&C(X,R),X.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(x,_,b)};function C(U,M){const R=e.update(m);f.defines.VSM_SAMPLES!==U.blurSamples&&(f.defines.VSM_SAMPLES=U.blurSamples,d.defines.VSM_SAMPLES=U.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),U.mapPass===null&&(U.mapPass=new Sn(i.x,i.y)),f.uniforms.shadow_pass.value=U.map.texture,f.uniforms.resolution.value=U.mapSize,f.uniforms.radius.value=U.radius,n.setRenderTarget(U.mapPass),n.clear(),n.renderBufferDirect(M,null,R,f,m,null),d.uniforms.shadow_pass.value=U.mapPass.texture,d.uniforms.resolution.value=U.mapSize,d.uniforms.radius.value=U.radius,n.setRenderTarget(U.map),n.clear(),n.renderBufferDirect(M,null,R,d,m,null)}function v(U,M,R,x){let _=null;const b=R.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(b!==void 0)_=b;else if(_=R.isPointLight===!0?o:a,n.localClippingEnabled&&M.clipShadows===!0&&Array.isArray(M.clippingPlanes)&&M.clippingPlanes.length!==0||M.displacementMap&&M.displacementScale!==0||M.alphaMap&&M.alphaTest>0||M.map&&M.alphaTest>0){const k=_.uuid,P=M.uuid;let Y=l[k];Y===void 0&&(Y={},l[k]=Y);let Z=Y[P];Z===void 0&&(Z=_.clone(),Y[P]=Z,M.addEventListener("dispose",I)),_=Z}if(_.visible=M.visible,_.wireframe=M.wireframe,x===XA?_.side=M.shadowSide!==null?M.shadowSide:M.side:_.side=M.shadowSide!==null?M.shadowSide:u[M.side],_.alphaMap=M.alphaMap,_.alphaTest=M.alphaTest,_.map=M.map,_.clipShadows=M.clipShadows,_.clippingPlanes=M.clippingPlanes,_.clipIntersection=M.clipIntersection,_.displacementMap=M.displacementMap,_.displacementScale=M.displacementScale,_.displacementBias=M.displacementBias,_.wireframeLinewidth=M.wireframeLinewidth,_.linewidth=M.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const k=n.properties.get(_);k.light=R}return _}function y(U,M,R,x,_){if(U.visible===!1)return;if(U.layers.test(M.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&_===XA)&&(!U.frustumCulled||A.intersectsObject(U))){U.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,U.matrixWorld);const P=e.update(U),Y=U.material;if(Array.isArray(Y)){const Z=P.groups;for(let W=0,q=Z.length;W<q;W++){const X=Z[W],se=Y[X.materialIndex];if(se&&se.visible){const ae=v(U,se,x,_);U.onBeforeShadow(n,U,M,R,P,ae,X),n.renderBufferDirect(R,null,P,ae,U,X),U.onAfterShadow(n,U,M,R,P,ae,X)}}}else if(Y.visible){const Z=v(U,Y,x,_);U.onBeforeShadow(n,U,M,R,P,Z,null),n.renderBufferDirect(R,null,P,Z,U,null),U.onAfterShadow(n,U,M,R,P,Z,null)}}const k=U.children;for(let P=0,Y=k.length;P<Y;P++)y(k[P],M,R,x,_)}function I(U){U.target.removeEventListener("dispose",I);for(const R in l){const x=l[R],_=U.target.uuid;_ in x&&(x[_].dispose(),delete x[_])}}}function hw(n){function e(){let B=!1;const N=new ft;let O=null;const z=new ft(0,0,0,0);return{setMask:function(te){O!==te&&!B&&(n.colorMask(te,te,te,te),O=te)},setLocked:function(te){B=te},setClear:function(te,xe,Qe,vt,Tt){Tt===!0&&(te*=vt,xe*=vt,Qe*=vt),N.set(te,xe,Qe,vt),z.equals(N)===!1&&(n.clearColor(te,xe,Qe,vt),z.copy(N))},reset:function(){B=!1,O=null,z.set(-1,0,0,0)}}}function t(){let B=!1,N=null,O=null,z=null;return{setTest:function(te){te?fe(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(te){N!==te&&!B&&(n.depthMask(te),N=te)},setFunc:function(te){if(O!==te){switch(te){case Vp:n.depthFunc(n.NEVER);break;case Kp:n.depthFunc(n.ALWAYS);break;case kp:n.depthFunc(n.LESS);break;case ra:n.depthFunc(n.LEQUAL);break;case zp:n.depthFunc(n.EQUAL);break;case Wp:n.depthFunc(n.GEQUAL);break;case Xp:n.depthFunc(n.GREATER);break;case Yp:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}O=te}},setLocked:function(te){B=te},setClear:function(te){z!==te&&(n.clearDepth(te),z=te)},reset:function(){B=!1,N=null,O=null,z=null}}}function A(){let B=!1,N=null,O=null,z=null,te=null,xe=null,Qe=null,vt=null,Tt=null;return{setTest:function(Ye){B||(Ye?fe(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(Ye){N!==Ye&&!B&&(n.stencilMask(Ye),N=Ye)},setFunc:function(Ye,bt,Et){(O!==Ye||z!==bt||te!==Et)&&(n.stencilFunc(Ye,bt,Et),O=Ye,z=bt,te=Et)},setOp:function(Ye,bt,Et){(xe!==Ye||Qe!==bt||vt!==Et)&&(n.stencilOp(Ye,bt,Et),xe=Ye,Qe=bt,vt=Et)},setLocked:function(Ye){B=Ye},setClear:function(Ye){Tt!==Ye&&(n.clearStencil(Ye),Tt=Ye)},reset:function(){B=!1,N=null,O=null,z=null,te=null,xe=null,Qe=null,vt=null,Tt=null}}}const i=new e,r=new t,s=new A,a=new WeakMap,o=new WeakMap;let l={},c={},u=new WeakMap,f=[],d=null,g=!1,m=null,p=null,h=null,C=null,v=null,y=null,I=null,U=new Oe(0,0,0),M=0,R=!1,x=null,_=null,b=null,k=null,P=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,W=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(q)[1]),Z=W>=1):q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),Z=W>=2);let X=null,se={};const ae=n.getParameter(n.SCISSOR_BOX),pe=n.getParameter(n.VIEWPORT),De=new ft().fromArray(ae),Ge=new ft().fromArray(pe);function J(B,N,O,z){const te=new Uint8Array(4),xe=n.createTexture();n.bindTexture(B,xe),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Qe=0;Qe<O;Qe++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(N,0,n.RGBA,1,1,z,0,n.RGBA,n.UNSIGNED_BYTE,te):n.texImage2D(N+Qe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,te);return xe}const $={};$[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),$[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),$[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),s.setClear(0),fe(n.DEPTH_TEST),r.setFunc(ra),qe(!1),_e(Kc),fe(n.CULL_FACE),pt(jA);function fe(B){l[B]!==!0&&(n.enable(B),l[B]=!0)}function ce(B){l[B]!==!1&&(n.disable(B),l[B]=!1)}function Pe(B,N){return c[B]!==N?(n.bindFramebuffer(B,N),c[B]=N,B===n.DRAW_FRAMEBUFFER&&(c[n.FRAMEBUFFER]=N),B===n.FRAMEBUFFER&&(c[n.DRAW_FRAMEBUFFER]=N),!0):!1}function Ve(B,N){let O=f,z=!1;if(B){O=u.get(N),O===void 0&&(O=[],u.set(N,O));const te=B.textures;if(O.length!==te.length||O[0]!==n.COLOR_ATTACHMENT0){for(let xe=0,Qe=te.length;xe<Qe;xe++)O[xe]=n.COLOR_ATTACHMENT0+xe;O.length=te.length,z=!0}}else O[0]!==n.BACK&&(O[0]=n.BACK,z=!0);z&&n.drawBuffers(O)}function ze(B){return d!==B?(n.useProgram(B),d=B,!0):!1}const ot={[Gn]:n.FUNC_ADD,[yp]:n.FUNC_SUBTRACT,[Up]:n.FUNC_REVERSE_SUBTRACT};ot[Mp]=n.MIN,ot[Sp]=n.MAX;const T={[Fp]:n.ZERO,[Tp]:n.ONE,[bp]:n.SRC_COLOR,[tl]:n.SRC_ALPHA,[Hp]:n.SRC_ALPHA_SATURATE,[Rp]:n.DST_COLOR,[Ip]:n.DST_ALPHA,[Qp]:n.ONE_MINUS_SRC_COLOR,[Al]:n.ONE_MINUS_SRC_ALPHA,[Dp]:n.ONE_MINUS_DST_COLOR,[Lp]:n.ONE_MINUS_DST_ALPHA,[Pp]:n.CONSTANT_COLOR,[Np]:n.ONE_MINUS_CONSTANT_COLOR,[Op]:n.CONSTANT_ALPHA,[Gp]:n.ONE_MINUS_CONSTANT_ALPHA};function pt(B,N,O,z,te,xe,Qe,vt,Tt,Ye){if(B===jA){g===!0&&(ce(n.BLEND),g=!1);return}if(g===!1&&(fe(n.BLEND),g=!0),B!==Ep){if(B!==m||Ye!==R){if((p!==Gn||v!==Gn)&&(n.blendEquation(n.FUNC_ADD),p=Gn,v=Gn),Ye)switch(B){case Hi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case en:n.blendFunc(n.ONE,n.ONE);break;case kc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Hi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case en:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case kc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}h=null,C=null,y=null,I=null,U.set(0,0,0),M=0,m=B,R=Ye}return}te=te||N,xe=xe||O,Qe=Qe||z,(N!==p||te!==v)&&(n.blendEquationSeparate(ot[N],ot[te]),p=N,v=te),(O!==h||z!==C||xe!==y||Qe!==I)&&(n.blendFuncSeparate(T[O],T[z],T[xe],T[Qe]),h=O,C=z,y=xe,I=Qe),(vt.equals(U)===!1||Tt!==M)&&(n.blendColor(vt.r,vt.g,vt.b,Tt),U.copy(vt),M=Tt),m=B,R=!1}function Je(B,N){B.side===uA?ce(n.CULL_FACE):fe(n.CULL_FACE);let O=B.side===$t;N&&(O=!O),qe(O),B.blending===Hi&&B.transparent===!1?pt(jA):pt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),r.setFunc(B.depthFunc),r.setTest(B.depthTest),r.setMask(B.depthWrite),i.setMask(B.colorWrite);const z=B.stencilWrite;s.setTest(z),z&&(s.setMask(B.stencilWriteMask),s.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),s.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Le(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?fe(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function qe(B){x!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),x=B)}function _e(B){B!==Cp?(fe(n.CULL_FACE),B!==_&&(B===Kc?n.cullFace(n.BACK):B===_p?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),_=B}function gt(B){B!==b&&(Z&&n.lineWidth(B),b=B)}function Le(B,N,O){B?(fe(n.POLYGON_OFFSET_FILL),(k!==N||P!==O)&&(n.polygonOffset(N,O),k=N,P=O)):ce(n.POLYGON_OFFSET_FILL)}function He(B){B?fe(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function F(B){B===void 0&&(B=n.TEXTURE0+Y-1),X!==B&&(n.activeTexture(B),X=B)}function w(B,N,O){O===void 0&&(X===null?O=n.TEXTURE0+Y-1:O=X);let z=se[O];z===void 0&&(z={type:void 0,texture:void 0},se[O]=z),(z.type!==B||z.texture!==N)&&(X!==O&&(n.activeTexture(O),X=O),n.bindTexture(B,N||$[B]),z.type=B,z.texture=N)}function K(){const B=se[X];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ee(){try{n.compressedTexImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ae(){try{n.compressedTexImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function j(){try{n.texSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ue(){try{n.texSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function oe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ne(){try{n.texStorage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ne(){try{n.texStorage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function me(){try{n.texImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function We(){try{n.texImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Se(B){De.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),De.copy(B))}function Be(B){Ge.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),Ge.copy(B))}function be(B,N){let O=o.get(N);O===void 0&&(O=new WeakMap,o.set(N,O));let z=O.get(B);z===void 0&&(z=n.getUniformBlockIndex(N,B.name),O.set(B,z))}function Re(B,N){const z=o.get(N).get(B);a.get(N)!==z&&(n.uniformBlockBinding(N,z,B.__bindingPointIndex),a.set(N,z))}function ht(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),l={},X=null,se={},c={},u=new WeakMap,f=[],d=null,g=!1,m=null,p=null,h=null,C=null,v=null,y=null,I=null,U=new Oe(0,0,0),M=0,R=!1,x=null,_=null,b=null,k=null,P=null,De.set(0,0,n.canvas.width,n.canvas.height),Ge.set(0,0,n.canvas.width,n.canvas.height),i.reset(),r.reset(),s.reset()}return{buffers:{color:i,depth:r,stencil:s},enable:fe,disable:ce,bindFramebuffer:Pe,drawBuffers:Ve,useProgram:ze,setBlending:pt,setMaterial:Je,setFlipSided:qe,setCullFace:_e,setLineWidth:gt,setPolygonOffset:Le,setScissorTest:He,activeTexture:F,bindTexture:w,unbindTexture:K,compressedTexImage2D:ee,compressedTexImage3D:Ae,texImage2D:me,texImage3D:We,updateUBOMapping:be,uniformBlockBinding:Re,texStorage2D:Ne,texStorage3D:ne,texSubImage2D:j,texSubImage3D:Ue,compressedTexSubImage2D:oe,compressedTexSubImage3D:ge,scissor:Se,viewport:Be,reset:ht}}function Hu(n,e,t,A){const i=dw(A);switch(t){case Bh:return n*e;case wh:return n*e;case Ch:return n*e*2;case _h:return n*e/i.components*i.byteLength;case vc:return n*e/i.components*i.byteLength;case xh:return n*e*2/i.components*i.byteLength;case wc:return n*e*2/i.components*i.byteLength;case vh:return n*e*3/i.components*i.byteLength;case TA:return n*e*4/i.components*i.byteLength;case Cc:return n*e*4/i.components*i.byteLength;case Ws:case Xs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ys:case Js:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ol:case cl:return Math.max(n,16)*Math.max(e,8)/4;case al:case ll:return Math.max(n,8)*Math.max(e,8)/2;case ul:case fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case dl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case gl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ml:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case vl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case wl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Cl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case _l:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case xl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case El:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case yl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ul:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ml:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case qs:case Sl:case Fl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Eh:case Tl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case bl:case Ql:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function dw(n){switch(n){case tn:case ph:return{byteLength:1,components:1};case Tr:case gh:case Zi:return{byteLength:2,components:1};case mc:case Bc:return{byteLength:2,components:4};case $n:case gc:case qA:return{byteLength:4,components:1};case mh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function pw(n,e,t,A,i,r,s){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ye,c=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(F,w){return d?new OffscreenCanvas(F,w):ca("canvas")}function m(F,w,K){let ee=1;const Ae=He(F);if((Ae.width>K||Ae.height>K)&&(ee=K/Math.max(Ae.width,Ae.height)),ee<1)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap||typeof VideoFrame<"u"&&F instanceof VideoFrame){const j=Math.floor(ee*Ae.width),Ue=Math.floor(ee*Ae.height);u===void 0&&(u=g(j,Ue));const oe=w?g(j,Ue):u;return oe.width=j,oe.height=Ue,oe.getContext("2d").drawImage(F,0,0,j,Ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Ae.width+"x"+Ae.height+") to ("+j+"x"+Ue+")."),oe}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Ae.width+"x"+Ae.height+")."),F;return F}function p(F){return F.generateMipmaps&&F.minFilter!==CA&&F.minFilter!==fA}function h(F){n.generateMipmap(F)}function C(F,w,K,ee,Ae=!1){if(F!==null){if(n[F]!==void 0)return n[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let j=w;if(w===n.RED&&(K===n.FLOAT&&(j=n.R32F),K===n.HALF_FLOAT&&(j=n.R16F),K===n.UNSIGNED_BYTE&&(j=n.R8)),w===n.RED_INTEGER&&(K===n.UNSIGNED_BYTE&&(j=n.R8UI),K===n.UNSIGNED_SHORT&&(j=n.R16UI),K===n.UNSIGNED_INT&&(j=n.R32UI),K===n.BYTE&&(j=n.R8I),K===n.SHORT&&(j=n.R16I),K===n.INT&&(j=n.R32I)),w===n.RG&&(K===n.FLOAT&&(j=n.RG32F),K===n.HALF_FLOAT&&(j=n.RG16F),K===n.UNSIGNED_BYTE&&(j=n.RG8)),w===n.RG_INTEGER&&(K===n.UNSIGNED_BYTE&&(j=n.RG8UI),K===n.UNSIGNED_SHORT&&(j=n.RG16UI),K===n.UNSIGNED_INT&&(j=n.RG32UI),K===n.BYTE&&(j=n.RG8I),K===n.SHORT&&(j=n.RG16I),K===n.INT&&(j=n.RG32I)),w===n.RGB&&K===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),w===n.RGBA){const Ue=Ae?sa:tt.getTransfer(ee);K===n.FLOAT&&(j=n.RGBA32F),K===n.HALF_FLOAT&&(j=n.RGBA16F),K===n.UNSIGNED_BYTE&&(j=Ue===lt?n.SRGB8_ALPHA8:n.RGBA8),K===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),K===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function v(F,w){let K;return F?w===null||w===$n||w===Xi?K=n.DEPTH24_STENCIL8:w===qA?K=n.DEPTH32F_STENCIL8:w===Tr&&(K=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===$n||w===Xi?K=n.DEPTH_COMPONENT24:w===qA?K=n.DEPTH_COMPONENT32F:w===Tr&&(K=n.DEPTH_COMPONENT16),K}function y(F,w){return p(F)===!0||F.isFramebufferTexture&&F.minFilter!==CA&&F.minFilter!==fA?Math.log2(Math.max(w.width,w.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?w.mipmaps.length:1}function I(F){const w=F.target;w.removeEventListener("dispose",I),M(w),w.isVideoTexture&&c.delete(w)}function U(F){const w=F.target;w.removeEventListener("dispose",U),x(w)}function M(F){const w=A.get(F);if(w.__webglInit===void 0)return;const K=F.source,ee=f.get(K);if(ee){const Ae=ee[w.__cacheKey];Ae.usedTimes--,Ae.usedTimes===0&&R(F),Object.keys(ee).length===0&&f.delete(K)}A.remove(F)}function R(F){const w=A.get(F);n.deleteTexture(w.__webglTexture);const K=F.source,ee=f.get(K);delete ee[w.__cacheKey],s.memory.textures--}function x(F){const w=A.get(F);if(F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(w.__webglFramebuffer[ee]))for(let Ae=0;Ae<w.__webglFramebuffer[ee].length;Ae++)n.deleteFramebuffer(w.__webglFramebuffer[ee][Ae]);else n.deleteFramebuffer(w.__webglFramebuffer[ee]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[ee])}else{if(Array.isArray(w.__webglFramebuffer))for(let ee=0;ee<w.__webglFramebuffer.length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[ee]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ee=0;ee<w.__webglColorRenderbuffer.length;ee++)w.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[ee]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const K=F.textures;for(let ee=0,Ae=K.length;ee<Ae;ee++){const j=A.get(K[ee]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),s.memory.textures--),A.remove(K[ee])}A.remove(F)}let _=0;function b(){_=0}function k(){const F=_;return F>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+i.maxTextures),_+=1,F}function P(F){const w=[];return w.push(F.wrapS),w.push(F.wrapT),w.push(F.wrapR||0),w.push(F.magFilter),w.push(F.minFilter),w.push(F.anisotropy),w.push(F.internalFormat),w.push(F.format),w.push(F.type),w.push(F.generateMipmaps),w.push(F.premultiplyAlpha),w.push(F.flipY),w.push(F.unpackAlignment),w.push(F.colorSpace),w.join()}function Y(F,w){const K=A.get(F);if(F.isVideoTexture&&gt(F),F.isRenderTargetTexture===!1&&F.version>0&&K.__version!==F.version){const ee=F.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ge(K,F,w);return}}t.bindTexture(n.TEXTURE_2D,K.__webglTexture,n.TEXTURE0+w)}function Z(F,w){const K=A.get(F);if(F.version>0&&K.__version!==F.version){Ge(K,F,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,K.__webglTexture,n.TEXTURE0+w)}function W(F,w){const K=A.get(F);if(F.version>0&&K.__version!==F.version){Ge(K,F,w);return}t.bindTexture(n.TEXTURE_3D,K.__webglTexture,n.TEXTURE0+w)}function q(F,w){const K=A.get(F);if(F.version>0&&K.__version!==F.version){J(K,F,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture,n.TEXTURE0+w)}const X={[rl]:n.REPEAT,[kn]:n.CLAMP_TO_EDGE,[sl]:n.MIRRORED_REPEAT},se={[CA]:n.NEAREST,[ig]:n.NEAREST_MIPMAP_NEAREST,[kr]:n.NEAREST_MIPMAP_LINEAR,[fA]:n.LINEAR,[qa]:n.LINEAR_MIPMAP_NEAREST,[zn]:n.LINEAR_MIPMAP_LINEAR},ae={[og]:n.NEVER,[dg]:n.ALWAYS,[lg]:n.LESS,[Uh]:n.LEQUAL,[cg]:n.EQUAL,[hg]:n.GEQUAL,[ug]:n.GREATER,[fg]:n.NOTEQUAL};function pe(F,w){if(w.type===qA&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===fA||w.magFilter===qa||w.magFilter===kr||w.magFilter===zn||w.minFilter===fA||w.minFilter===qa||w.minFilter===kr||w.minFilter===zn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(F,n.TEXTURE_WRAP_S,X[w.wrapS]),n.texParameteri(F,n.TEXTURE_WRAP_T,X[w.wrapT]),(F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY)&&n.texParameteri(F,n.TEXTURE_WRAP_R,X[w.wrapR]),n.texParameteri(F,n.TEXTURE_MAG_FILTER,se[w.magFilter]),n.texParameteri(F,n.TEXTURE_MIN_FILTER,se[w.minFilter]),w.compareFunction&&(n.texParameteri(F,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(F,n.TEXTURE_COMPARE_FUNC,ae[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===CA||w.minFilter!==kr&&w.minFilter!==zn||w.type===qA&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||A.get(w).__currentAnisotropy){const K=e.get("EXT_texture_filter_anisotropic");n.texParameterf(F,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),A.get(w).__currentAnisotropy=w.anisotropy}}}function De(F,w){let K=!1;F.__webglInit===void 0&&(F.__webglInit=!0,w.addEventListener("dispose",I));const ee=w.source;let Ae=f.get(ee);Ae===void 0&&(Ae={},f.set(ee,Ae));const j=P(w);if(j!==F.__cacheKey){Ae[j]===void 0&&(Ae[j]={texture:n.createTexture(),usedTimes:0},s.memory.textures++,K=!0),Ae[j].usedTimes++;const Ue=Ae[F.__cacheKey];Ue!==void 0&&(Ae[F.__cacheKey].usedTimes--,Ue.usedTimes===0&&R(w)),F.__cacheKey=j,F.__webglTexture=Ae[j].texture}return K}function Ge(F,w,K){let ee=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ee=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ee=n.TEXTURE_3D);const Ae=De(F,w),j=w.source;t.bindTexture(ee,F.__webglTexture,n.TEXTURE0+K);const Ue=A.get(j);if(j.version!==Ue.__version||Ae===!0){t.activeTexture(n.TEXTURE0+K);const oe=tt.getPrimaries(tt.workingColorSpace),ge=w.colorSpace===gn?null:tt.getPrimaries(w.colorSpace),Ne=w.colorSpace===gn||oe===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let ne=m(w.image,!1,i.maxTextureSize);ne=Le(w,ne);const me=r.convert(w.format,w.colorSpace),We=r.convert(w.type);let Se=C(w.internalFormat,me,We,w.colorSpace,w.isVideoTexture);pe(ee,w);let Be;const be=w.mipmaps,Re=w.isVideoTexture!==!0,ht=Ue.__version===void 0||Ae===!0,B=j.dataReady,N=y(w,ne);if(w.isDepthTexture)Se=v(w.format===Yi,w.type),ht&&(Re?t.texStorage2D(n.TEXTURE_2D,1,Se,ne.width,ne.height):t.texImage2D(n.TEXTURE_2D,0,Se,ne.width,ne.height,0,me,We,null));else if(w.isDataTexture)if(be.length>0){Re&&ht&&t.texStorage2D(n.TEXTURE_2D,N,Se,be[0].width,be[0].height);for(let O=0,z=be.length;O<z;O++)Be=be[O],Re?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,We,Be.data):t.texImage2D(n.TEXTURE_2D,O,Se,Be.width,Be.height,0,me,We,Be.data);w.generateMipmaps=!1}else Re?(ht&&t.texStorage2D(n.TEXTURE_2D,N,Se,ne.width,ne.height),B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ne.width,ne.height,me,We,ne.data)):t.texImage2D(n.TEXTURE_2D,0,Se,ne.width,ne.height,0,me,We,ne.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Re&&ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Se,be[0].width,be[0].height,ne.depth);for(let O=0,z=be.length;O<z;O++)if(Be=be[O],w.format!==TA)if(me!==null)if(Re){if(B)if(w.layerUpdates.size>0){const te=Hu(Be.width,Be.height,w.format,w.type);for(const xe of w.layerUpdates){const Qe=Be.data.subarray(xe*te/Be.data.BYTES_PER_ELEMENT,(xe+1)*te/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,xe,Be.width,Be.height,1,me,Qe,0,0)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ne.depth,me,Be.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,O,Se,Be.width,Be.height,ne.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Re?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,O,0,0,0,Be.width,Be.height,ne.depth,me,We,Be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,O,Se,Be.width,Be.height,ne.depth,0,me,We,Be.data)}else{Re&&ht&&t.texStorage2D(n.TEXTURE_2D,N,Se,be[0].width,be[0].height);for(let O=0,z=be.length;O<z;O++)Be=be[O],w.format!==TA?me!==null?Re?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,Be.data):t.compressedTexImage2D(n.TEXTURE_2D,O,Se,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Re?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,Be.width,Be.height,me,We,Be.data):t.texImage2D(n.TEXTURE_2D,O,Se,Be.width,Be.height,0,me,We,Be.data)}else if(w.isDataArrayTexture)if(Re){if(ht&&t.texStorage3D(n.TEXTURE_2D_ARRAY,N,Se,ne.width,ne.height,ne.depth),B)if(w.layerUpdates.size>0){const O=Hu(ne.width,ne.height,w.format,w.type);for(const z of w.layerUpdates){const te=ne.data.subarray(z*O/ne.data.BYTES_PER_ELEMENT,(z+1)*O/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,z,ne.width,ne.height,1,me,We,te)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,me,We,ne.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Se,ne.width,ne.height,ne.depth,0,me,We,ne.data);else if(w.isData3DTexture)Re?(ht&&t.texStorage3D(n.TEXTURE_3D,N,Se,ne.width,ne.height,ne.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,me,We,ne.data)):t.texImage3D(n.TEXTURE_3D,0,Se,ne.width,ne.height,ne.depth,0,me,We,ne.data);else if(w.isFramebufferTexture){if(ht)if(Re)t.texStorage2D(n.TEXTURE_2D,N,Se,ne.width,ne.height);else{let O=ne.width,z=ne.height;for(let te=0;te<N;te++)t.texImage2D(n.TEXTURE_2D,te,Se,O,z,0,me,We,null),O>>=1,z>>=1}}else if(be.length>0){if(Re&&ht){const O=He(be[0]);t.texStorage2D(n.TEXTURE_2D,N,Se,O.width,O.height)}for(let O=0,z=be.length;O<z;O++)Be=be[O],Re?B&&t.texSubImage2D(n.TEXTURE_2D,O,0,0,me,We,Be):t.texImage2D(n.TEXTURE_2D,O,Se,me,We,Be);w.generateMipmaps=!1}else if(Re){if(ht){const O=He(ne);t.texStorage2D(n.TEXTURE_2D,N,Se,O.width,O.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,me,We,ne)}else t.texImage2D(n.TEXTURE_2D,0,Se,me,We,ne);p(w)&&h(ee),Ue.__version=j.version,w.onUpdate&&w.onUpdate(w)}F.__version=w.version}function J(F,w,K){if(w.image.length!==6)return;const ee=De(F,w),Ae=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+K);const j=A.get(Ae);if(Ae.version!==j.__version||ee===!0){t.activeTexture(n.TEXTURE0+K);const Ue=tt.getPrimaries(tt.workingColorSpace),oe=w.colorSpace===gn?null:tt.getPrimaries(w.colorSpace),ge=w.colorSpace===gn||Ue===oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Ne=w.isCompressedTexture||w.image[0].isCompressedTexture,ne=w.image[0]&&w.image[0].isDataTexture,me=[];for(let z=0;z<6;z++)!Ne&&!ne?me[z]=m(w.image[z],!0,i.maxCubemapSize):me[z]=ne?w.image[z].image:w.image[z],me[z]=Le(w,me[z]);const We=me[0],Se=r.convert(w.format,w.colorSpace),Be=r.convert(w.type),be=C(w.internalFormat,Se,Be,w.colorSpace),Re=w.isVideoTexture!==!0,ht=j.__version===void 0||ee===!0,B=Ae.dataReady;let N=y(w,We);pe(n.TEXTURE_CUBE_MAP,w);let O;if(Ne){Re&&ht&&t.texStorage2D(n.TEXTURE_CUBE_MAP,N,be,We.width,We.height);for(let z=0;z<6;z++){O=me[z].mipmaps;for(let te=0;te<O.length;te++){const xe=O[te];w.format!==TA?Se!==null?Re?B&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te,0,0,xe.width,xe.height,Se,xe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te,be,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Re?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te,0,0,xe.width,xe.height,Se,Be,xe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te,be,xe.width,xe.height,0,Se,Be,xe.data)}}}else{if(O=w.mipmaps,Re&&ht){O.length>0&&N++;const z=He(me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,N,be,z.width,z.height)}for(let z=0;z<6;z++)if(ne){Re?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,me[z].width,me[z].height,Se,Be,me[z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,be,me[z].width,me[z].height,0,Se,Be,me[z].data);for(let te=0;te<O.length;te++){const Qe=O[te].image[z].image;Re?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te+1,0,0,Qe.width,Qe.height,Se,Be,Qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te+1,be,Qe.width,Qe.height,0,Se,Be,Qe.data)}}else{Re?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,0,0,Se,Be,me[z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,0,be,Se,Be,me[z]);for(let te=0;te<O.length;te++){const xe=O[te];Re?B&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te+1,0,0,Se,Be,xe.image[z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+z,te+1,be,Se,Be,xe.image[z])}}}p(w)&&h(n.TEXTURE_CUBE_MAP),j.__version=Ae.version,w.onUpdate&&w.onUpdate(w)}F.__version=w.version}function $(F,w,K,ee,Ae,j){const Ue=r.convert(K.format,K.colorSpace),oe=r.convert(K.type),ge=C(K.internalFormat,Ue,oe,K.colorSpace);if(!A.get(w).__hasExternalTextures){const ne=Math.max(1,w.width>>j),me=Math.max(1,w.height>>j);Ae===n.TEXTURE_3D||Ae===n.TEXTURE_2D_ARRAY?t.texImage3D(Ae,j,ge,ne,me,w.depth,0,Ue,oe,null):t.texImage2D(Ae,j,ge,ne,me,0,Ue,oe,null)}t.bindFramebuffer(n.FRAMEBUFFER,F),_e(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ee,Ae,A.get(K).__webglTexture,0,qe(w)):(Ae===n.TEXTURE_2D||Ae>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Ae<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ee,Ae,A.get(K).__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function fe(F,w,K){if(n.bindRenderbuffer(n.RENDERBUFFER,F),w.depthBuffer){const ee=w.depthTexture,Ae=ee&&ee.isDepthTexture?ee.type:null,j=v(w.stencilBuffer,Ae),Ue=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=qe(w);_e(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,oe,j,w.width,w.height):K?n.renderbufferStorageMultisample(n.RENDERBUFFER,oe,j,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,j,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ue,n.RENDERBUFFER,F)}else{const ee=w.textures;for(let Ae=0;Ae<ee.length;Ae++){const j=ee[Ae],Ue=r.convert(j.format,j.colorSpace),oe=r.convert(j.type),ge=C(j.internalFormat,Ue,oe,j.colorSpace),Ne=qe(w);K&&_e(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ne,ge,w.width,w.height):_e(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ne,ge,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,ge,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ce(F,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,F),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!A.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Y(w.depthTexture,0);const ee=A.get(w.depthTexture).__webglTexture,Ae=qe(w);if(w.depthTexture.format===Pi)_e(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(w.depthTexture.format===Yi)_e(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,Ae):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Pe(F){const w=A.get(F),K=F.isWebGLCubeRenderTarget===!0;if(F.depthTexture&&!w.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");ce(w.__webglFramebuffer,F)}else if(K){w.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[ee]),w.__webglDepthbuffer[ee]=n.createRenderbuffer(),fe(w.__webglDepthbuffer[ee],F,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=n.createRenderbuffer(),fe(w.__webglDepthbuffer,F,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ve(F,w,K){const ee=A.get(F);w!==void 0&&$(ee.__webglFramebuffer,F,F.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),K!==void 0&&Pe(F)}function ze(F){const w=F.texture,K=A.get(F),ee=A.get(w);F.addEventListener("dispose",U);const Ae=F.textures,j=F.isWebGLCubeRenderTarget===!0,Ue=Ae.length>1;if(Ue||(ee.__webglTexture===void 0&&(ee.__webglTexture=n.createTexture()),ee.__version=w.version,s.memory.textures++),j){K.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(w.mipmaps&&w.mipmaps.length>0){K.__webglFramebuffer[oe]=[];for(let ge=0;ge<w.mipmaps.length;ge++)K.__webglFramebuffer[oe][ge]=n.createFramebuffer()}else K.__webglFramebuffer[oe]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){K.__webglFramebuffer=[];for(let oe=0;oe<w.mipmaps.length;oe++)K.__webglFramebuffer[oe]=n.createFramebuffer()}else K.__webglFramebuffer=n.createFramebuffer();if(Ue)for(let oe=0,ge=Ae.length;oe<ge;oe++){const Ne=A.get(Ae[oe]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=n.createTexture(),s.memory.textures++)}if(F.samples>0&&_e(F)===!1){K.__webglMultisampledFramebuffer=n.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let oe=0;oe<Ae.length;oe++){const ge=Ae[oe];K.__webglColorRenderbuffer[oe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,K.__webglColorRenderbuffer[oe]);const Ne=r.convert(ge.format,ge.colorSpace),ne=r.convert(ge.type),me=C(ge.internalFormat,Ne,ne,ge.colorSpace,F.isXRRenderTarget===!0),We=qe(F);n.renderbufferStorageMultisample(n.RENDERBUFFER,We,me,F.width,F.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+oe,n.RENDERBUFFER,K.__webglColorRenderbuffer[oe])}n.bindRenderbuffer(n.RENDERBUFFER,null),F.depthBuffer&&(K.__webglDepthRenderbuffer=n.createRenderbuffer(),fe(K.__webglDepthRenderbuffer,F,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),pe(n.TEXTURE_CUBE_MAP,w);for(let oe=0;oe<6;oe++)if(w.mipmaps&&w.mipmaps.length>0)for(let ge=0;ge<w.mipmaps.length;ge++)$(K.__webglFramebuffer[oe][ge],F,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ge);else $(K.__webglFramebuffer[oe],F,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);p(w)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ue){for(let oe=0,ge=Ae.length;oe<ge;oe++){const Ne=Ae[oe],ne=A.get(Ne);t.bindTexture(n.TEXTURE_2D,ne.__webglTexture),pe(n.TEXTURE_2D,Ne),$(K.__webglFramebuffer,F,Ne,n.COLOR_ATTACHMENT0+oe,n.TEXTURE_2D,0),p(Ne)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let oe=n.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(oe=F.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,ee.__webglTexture),pe(oe,w),w.mipmaps&&w.mipmaps.length>0)for(let ge=0;ge<w.mipmaps.length;ge++)$(K.__webglFramebuffer[ge],F,w,n.COLOR_ATTACHMENT0,oe,ge);else $(K.__webglFramebuffer,F,w,n.COLOR_ATTACHMENT0,oe,0);p(w)&&h(oe),t.unbindTexture()}F.depthBuffer&&Pe(F)}function ot(F){const w=F.textures;for(let K=0,ee=w.length;K<ee;K++){const Ae=w[K];if(p(Ae)){const j=F.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Ue=A.get(Ae).__webglTexture;t.bindTexture(j,Ue),h(j),t.unbindTexture()}}}const T=[],pt=[];function Je(F){if(F.samples>0){if(_e(F)===!1){const w=F.textures,K=F.width,ee=F.height;let Ae=n.COLOR_BUFFER_BIT;const j=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ue=A.get(F),oe=w.length>1;if(oe)for(let ge=0;ge<w.length;ge++)t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ue.__webglFramebuffer);for(let ge=0;ge<w.length;ge++){if(F.resolveDepthBuffer&&(F.depthBuffer&&(Ae|=n.DEPTH_BUFFER_BIT),F.stencilBuffer&&F.resolveStencilBuffer&&(Ae|=n.STENCIL_BUFFER_BIT)),oe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ue.__webglColorRenderbuffer[ge]);const Ne=A.get(w[ge]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ne,0)}n.blitFramebuffer(0,0,K,ee,0,0,K,ee,Ae,n.NEAREST),o===!0&&(T.length=0,pt.length=0,T.push(n.COLOR_ATTACHMENT0+ge),F.depthBuffer&&F.resolveDepthBuffer===!1&&(T.push(j),pt.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,pt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,T))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),oe)for(let ge=0;ge<w.length;ge++){t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,Ue.__webglColorRenderbuffer[ge]);const Ne=A.get(w[ge]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ue.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,Ne,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ue.__webglMultisampledFramebuffer)}else if(F.depthBuffer&&F.resolveDepthBuffer===!1&&o){const w=F.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function qe(F){return Math.min(i.maxSamples,F.samples)}function _e(F){const w=A.get(F);return F.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function gt(F){const w=s.render.frame;c.get(F)!==w&&(c.set(F,w),F.update())}function Le(F,w){const K=F.colorSpace,ee=F.format,Ae=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||K!==bn&&K!==gn&&(tt.getTransfer(K)===lt?(ee!==TA||Ae!==tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),w}function He(F){return typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement?(l.width=F.naturalWidth||F.width,l.height=F.naturalHeight||F.height):typeof VideoFrame<"u"&&F instanceof VideoFrame?(l.width=F.displayWidth,l.height=F.displayHeight):(l.width=F.width,l.height=F.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=b,this.setTexture2D=Y,this.setTexture2DArray=Z,this.setTexture3D=W,this.setTextureCube=q,this.rebindTextures=Ve,this.setupRenderTarget=ze,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=Je,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=$,this.useMultisampledRTT=_e}function gw(n,e){function t(A,i=gn){let r;const s=tt.getTransfer(i);if(A===tn)return n.UNSIGNED_BYTE;if(A===mc)return n.UNSIGNED_SHORT_4_4_4_4;if(A===Bc)return n.UNSIGNED_SHORT_5_5_5_1;if(A===mh)return n.UNSIGNED_INT_5_9_9_9_REV;if(A===ph)return n.BYTE;if(A===gh)return n.SHORT;if(A===Tr)return n.UNSIGNED_SHORT;if(A===gc)return n.INT;if(A===$n)return n.UNSIGNED_INT;if(A===qA)return n.FLOAT;if(A===Zi)return n.HALF_FLOAT;if(A===Bh)return n.ALPHA;if(A===vh)return n.RGB;if(A===TA)return n.RGBA;if(A===wh)return n.LUMINANCE;if(A===Ch)return n.LUMINANCE_ALPHA;if(A===Pi)return n.DEPTH_COMPONENT;if(A===Yi)return n.DEPTH_STENCIL;if(A===_h)return n.RED;if(A===vc)return n.RED_INTEGER;if(A===xh)return n.RG;if(A===wc)return n.RG_INTEGER;if(A===Cc)return n.RGBA_INTEGER;if(A===Ws||A===Xs||A===Ys||A===Js)if(s===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(A===Ws)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(A===Xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(A===Ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(A===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(A===Ws)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(A===Xs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(A===Ys)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(A===Js)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(A===al||A===ol||A===ll||A===cl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(A===al)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(A===ol)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(A===ll)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(A===cl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(A===ul||A===fl||A===hl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(A===ul||A===fl)return s===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(A===hl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(A===dl||A===pl||A===gl||A===ml||A===Bl||A===vl||A===wl||A===Cl||A===_l||A===xl||A===El||A===yl||A===Ul||A===Ml)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(A===dl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(A===pl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(A===gl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(A===ml)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(A===Bl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(A===vl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(A===wl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(A===Cl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(A===_l)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(A===xl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(A===El)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(A===yl)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(A===Ul)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(A===Ml)return s===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(A===qs||A===Sl||A===Fl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(A===qs)return s===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(A===Sl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(A===Fl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(A===Eh||A===Tl||A===bl||A===Ql)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(A===qs)return r.COMPRESSED_RED_RGTC1_EXT;if(A===Tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(A===bl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(A===Ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return A===Xi?n.UNSIGNED_INT_24_8:n[A]!==void 0?n[A]:null}return{convert:t}}class mw extends cA{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Wn extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Bw={type:"move"};class xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Q),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const A of e.hand.values())this._getHandJoint(t,A)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,A){let i=null,r=null,s=null;const a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){s=!0;for(const m of e.hand.values()){const p=t.getJointPose(m,A),h=this._getHandJoint(l,m);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const c=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=c.position.distanceTo(u.position),d=.02,g=.005;l.inputState.pinching&&f>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else o!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,A),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1));a!==null&&(i=t.getPose(e.targetRaySpace,A),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Bw)))}return a!==null&&(a.visible=i!==null),o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const A=new Wn;A.matrixAutoUpdate=!1,A.visible=!1,e.joints[t.jointName]=A,e.add(A)}return e.joints[t.jointName]}}const vw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ww=`
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

}`;class Cw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,A){if(this.texture===null){const i=new eA,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=A.depthNear||t.depthFar!=A.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,A=new Kt({vertexShader:vw,fragmentShader:ww,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ft(new Fn(20,20),A)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class _w extends ti{constructor(e,t){super();const A=this;let i=null,r=1,s=null,a="local-floor",o=1,l=null,c=null,u=null,f=null,d=null,g=null;const m=new Cw,p=t.getContextAttributes();let h=null,C=null;const v=[],y=[],I=new ye;let U=null;const M=new cA;M.layers.enable(1),M.viewport=new ft;const R=new cA;R.layers.enable(2),R.viewport=new ft;const x=[M,R],_=new mw;_.layers.enable(1),_.layers.enable(2);let b=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let $=v[J];return $===void 0&&($=new xo,v[J]=$),$.getTargetRaySpace()},this.getControllerGrip=function(J){let $=v[J];return $===void 0&&($=new xo,v[J]=$),$.getGripSpace()},this.getHand=function(J){let $=v[J];return $===void 0&&($=new xo,v[J]=$),$.getHandSpace()};function P(J){const $=y.indexOf(J.inputSource);if($===-1)return;const fe=v[$];fe!==void 0&&(fe.update(J.inputSource,J.frame,l||s),fe.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",Y),i.removeEventListener("inputsourceschange",Z);for(let J=0;J<v.length;J++){const $=y[J];$!==null&&(y[J]=null,v[J].disconnect($))}b=null,k=null,m.reset(),e.setRenderTarget(h),d=null,f=null,u=null,i=null,C=null,Ge.stop(),A.isPresenting=!1,e.setPixelRatio(U),e.setSize(I.width,I.height,!1),A.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,A.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||s},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(h=e.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",Y),i.addEventListener("inputsourceschange",Z),p.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(I),i.renderState.layers===void 0){const $={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,$),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),C=new Sn(d.framebufferWidth,d.framebufferHeight,{format:TA,type:tn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let $=null,fe=null,ce=null;p.depth&&(ce=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,$=p.stencil?Yi:Pi,fe=p.stencil?Xi:$n);const Pe={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(Pe),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),C=new Sn(f.textureWidth,f.textureHeight,{format:TA,type:tn,depthTexture:new Nh(f.textureWidth,f.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}C.isXRRenderTarget=!0,this.setFoveation(o),l=null,s=await i.requestReferenceSpace(a),Ge.setContext(i),Ge.start(),A.isPresenting=!0,A.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(J){for(let $=0;$<J.removed.length;$++){const fe=J.removed[$],ce=y.indexOf(fe);ce>=0&&(y[ce]=null,v[ce].disconnect(fe))}for(let $=0;$<J.added.length;$++){const fe=J.added[$];let ce=y.indexOf(fe);if(ce===-1){for(let Ve=0;Ve<v.length;Ve++)if(Ve>=y.length){y.push(fe),ce=Ve;break}else if(y[Ve]===null){y[Ve]=fe,ce=Ve;break}if(ce===-1)break}const Pe=v[ce];Pe&&Pe.connect(fe)}}const W=new Q,q=new Q;function X(J,$,fe){W.setFromMatrixPosition($.matrixWorld),q.setFromMatrixPosition(fe.matrixWorld);const ce=W.distanceTo(q),Pe=$.projectionMatrix.elements,Ve=fe.projectionMatrix.elements,ze=Pe[14]/(Pe[10]-1),ot=Pe[14]/(Pe[10]+1),T=(Pe[9]+1)/Pe[5],pt=(Pe[9]-1)/Pe[5],Je=(Pe[8]-1)/Pe[0],qe=(Ve[8]+1)/Ve[0],_e=ze*Je,gt=ze*qe,Le=ce/(-Je+qe),He=Le*-Je;$.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(He),J.translateZ(Le),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert();const F=ze+Le,w=ot+Le,K=_e-He,ee=gt+(ce-He),Ae=T*ot/w*F,j=pt*ot/w*F;J.projectionMatrix.makePerspective(K,ee,Ae,j,F,w),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}function se(J,$){$===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices($.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;m.texture!==null&&(J.near=m.depthNear,J.far=m.depthFar),_.near=R.near=M.near=J.near,_.far=R.far=M.far=J.far,(b!==_.near||k!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),b=_.near,k=_.far,M.near=b,M.far=k,R.near=b,R.far=k,M.updateProjectionMatrix(),R.updateProjectionMatrix(),J.updateProjectionMatrix());const $=J.parent,fe=_.cameras;se(_,$);for(let ce=0;ce<fe.length;ce++)se(fe[ce],$);fe.length===2?X(_,M,R):_.projectionMatrix.copy(M.projectionMatrix),ae(J,_,$)};function ae(J,$,fe){fe===null?J.matrix.copy($.matrixWorld):(J.matrix.copy(fe.matrixWorld),J.matrix.invert(),J.matrix.multiply($.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy($.projectionMatrix),J.projectionMatrixInverse.copy($.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Il*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return o},this.setFoveation=function(J){o=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(_)};let pe=null;function De(J,$){if(c=$.getViewerPose(l||s),g=$,c!==null){const fe=c.views;d!==null&&(e.setRenderTargetFramebuffer(C,d.framebuffer),e.setRenderTarget(C));let ce=!1;fe.length!==_.cameras.length&&(_.cameras.length=0,ce=!0);for(let Ve=0;Ve<fe.length;Ve++){const ze=fe[Ve];let ot=null;if(d!==null)ot=d.getViewport(ze);else{const pt=u.getViewSubImage(f,ze);ot=pt.viewport,Ve===0&&(e.setRenderTargetTextures(C,pt.colorTexture,f.ignoreDepthValues?void 0:pt.depthStencilTexture),e.setRenderTarget(C))}let T=x[Ve];T===void 0&&(T=new cA,T.layers.enable(Ve),T.viewport=new ft,x[Ve]=T),T.matrix.fromArray(ze.transform.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale),T.projectionMatrix.fromArray(ze.projectionMatrix),T.projectionMatrixInverse.copy(T.projectionMatrix).invert(),T.viewport.set(ot.x,ot.y,ot.width,ot.height),Ve===0&&(_.matrix.copy(T.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ce===!0&&_.cameras.push(T)}const Pe=i.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")){const Ve=u.getDepthInformation(fe[0]);Ve&&Ve.isValid&&Ve.texture&&m.init(e,Ve,i.renderState)}}for(let fe=0;fe<v.length;fe++){const ce=y[fe],Pe=v[fe];ce!==null&&Pe!==void 0&&Pe.update(ce,$,l||s)}pe&&pe(J,$),$.detectedPlanes&&A.dispatchEvent({type:"planesdetected",data:$}),g=null}const Ge=new Hh;Ge.setAnimationLoop(De),this.setAnimationLoop=function(J){pe=J},this.dispose=function(){}}}const Pn=new DA,xw=new at;function Ew(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function A(p,h){h.color.getRGB(p.fogColor.value,Ih(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function i(p,h,C,v,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),u(p,h)):h.isMeshPhongMaterial?(r(p,h),c(p,h)):h.isMeshStandardMaterial?(r(p,h),f(p,h),h.isMeshPhysicalMaterial&&d(p,h,y)):h.isMeshMatcapMaterial?(r(p,h),g(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),m(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(s(p,h),h.isLineDashedMaterial&&a(p,h)):h.isPointsMaterial?o(p,h,C,v):h.isSpriteMaterial?l(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===$t&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===$t&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const C=e.get(h),v=C.envMap,y=C.envMapRotation;v&&(p.envMap.value=v,Pn.copy(y),Pn.x*=-1,Pn.y*=-1,Pn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Pn.y*=-1,Pn.z*=-1),p.envMapRotation.value.setFromMatrix4(xw.makeRotationFromEuler(Pn)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function s(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function a(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function o(p,h,C,v){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*C,p.scale.value=v*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function l(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function c(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function u(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function d(p,h,C){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===$t&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=C.texture,p.transmissionSamplerSize.value.set(C.width,C.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function m(p,h){const C=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(C.matrixWorld),p.nearDistance.value=C.shadow.camera.near,p.farDistance.value=C.shadow.camera.far}return{refreshFogUniforms:A,refreshMaterialUniforms:i}}function yw(n,e,t,A){let i={},r={},s=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function o(C,v){const y=v.program;A.uniformBlockBinding(C,y)}function l(C,v){let y=i[C.id];y===void 0&&(g(C),y=c(C),i[C.id]=y,C.addEventListener("dispose",p));const I=v.program;A.updateUBOMapping(C,I);const U=e.render.frame;r[C.id]!==U&&(f(C),r[C.id]=U)}function c(C){const v=u();C.__bindingPointIndex=v;const y=n.createBuffer(),I=C.__size,U=C.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,I,U),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function u(){for(let C=0;C<a;C++)if(s.indexOf(C)===-1)return s.push(C),C;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(C){const v=i[C.id],y=C.uniforms,I=C.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let U=0,M=y.length;U<M;U++){const R=Array.isArray(y[U])?y[U]:[y[U]];for(let x=0,_=R.length;x<_;x++){const b=R[x];if(d(b,U,x,I)===!0){const k=b.__offset,P=Array.isArray(b.value)?b.value:[b.value];let Y=0;for(let Z=0;Z<P.length;Z++){const W=P[Z],q=m(W);typeof W=="number"||typeof W=="boolean"?(b.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,k+Y,b.__data)):W.isMatrix3?(b.__data[0]=W.elements[0],b.__data[1]=W.elements[1],b.__data[2]=W.elements[2],b.__data[3]=0,b.__data[4]=W.elements[3],b.__data[5]=W.elements[4],b.__data[6]=W.elements[5],b.__data[7]=0,b.__data[8]=W.elements[6],b.__data[9]=W.elements[7],b.__data[10]=W.elements[8],b.__data[11]=0):(W.toArray(b.__data,Y),Y+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,b.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(C,v,y,I){const U=C.value,M=v+"_"+y;if(I[M]===void 0)return typeof U=="number"||typeof U=="boolean"?I[M]=U:I[M]=U.clone(),!0;{const R=I[M];if(typeof U=="number"||typeof U=="boolean"){if(R!==U)return I[M]=U,!0}else if(R.equals(U)===!1)return R.copy(U),!0}return!1}function g(C){const v=C.uniforms;let y=0;const I=16;for(let M=0,R=v.length;M<R;M++){const x=Array.isArray(v[M])?v[M]:[v[M]];for(let _=0,b=x.length;_<b;_++){const k=x[_],P=Array.isArray(k.value)?k.value:[k.value];for(let Y=0,Z=P.length;Y<Z;Y++){const W=P[Y],q=m(W),X=y%I,se=X%q.boundary,ae=X+se;y+=se,ae!==0&&I-ae<q.storage&&(y+=I-ae),k.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=q.storage}}}const U=y%I;return U>0&&(y+=I-U),C.__size=y,C.__cache={},this}function m(C){const v={boundary:0,storage:0};return typeof C=="number"||typeof C=="boolean"?(v.boundary=4,v.storage=4):C.isVector2?(v.boundary=8,v.storage=8):C.isVector3||C.isColor?(v.boundary=16,v.storage=12):C.isVector4?(v.boundary=16,v.storage=16):C.isMatrix3?(v.boundary=48,v.storage=48):C.isMatrix4?(v.boundary=64,v.storage=64):C.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",C),v}function p(C){const v=C.target;v.removeEventListener("dispose",p);const y=s.indexOf(v.__bindingPointIndex);s.splice(y,1),n.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function h(){for(const C in i)n.deleteBuffer(i[C]);s=[],i={},r={}}return{bind:o,update:l,dispose:h}}class kh{constructor(e={}){const{canvas:t=mg(),context:A=null,depth:i=!0,stencil:r=!1,alpha:s=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:c="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(A!==null){if(typeof WebGLRenderingContext<"u"&&A instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=A.getContextAttributes().alpha}else f=s;const d=new Uint32Array(4),g=new Int32Array(4);let m=null,p=null;const h=[],C=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=FA,this.toneMapping=xn,this.toneMappingExposure=1;const v=this;let y=!1,I=0,U=0,M=null,R=-1,x=null;const _=new ft,b=new ft;let k=null;const P=new Oe(0);let Y=0,Z=t.width,W=t.height,q=1,X=null,se=null;const ae=new ft(0,0,Z,W),pe=new ft(0,0,Z,W);let De=!1;const Ge=new Ec;let J=!1,$=!1;const fe=new at,ce=new Q,Pe=new ft,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ze=!1;function ot(){return M===null?q:1}let T=A;function pt(E,D){return t.getContext(E,D)}try{const E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:c,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${pc}`),t.addEventListener("webglcontextlost",O,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",te,!1),T===null){const D="webgl2";if(T=pt(D,E),T===null)throw pt(D)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Je,qe,_e,gt,Le,He,F,w,K,ee,Ae,j,Ue,oe,ge,Ne,ne,me,We,Se,Be,be,Re,ht;function B(){Je=new Q0(T),Je.init(),be=new gw(T,Je),qe=new U0(T,Je,e,be),_e=new hw(T),gt=new R0(T),Le=new $v,He=new pw(T,Je,_e,Le,qe,be,gt),F=new S0(v),w=new b0(v),K=new Vg(T),Re=new E0(T,K),ee=new I0(T,K,gt,Re),Ae=new H0(T,ee,K,gt),We=new D0(T,qe,He),Ne=new M0(Le),j=new jv(v,F,w,Je,qe,Re,Ne),Ue=new Ew(v,Le),oe=new tw,ge=new aw(Je),me=new x0(v,F,w,_e,Ae,f,o),ne=new fw(v,Ae,qe),ht=new yw(T,gt,qe,_e),Se=new y0(T,Je,gt),Be=new L0(T,Je,gt),gt.programs=j.programs,v.capabilities=qe,v.extensions=Je,v.properties=Le,v.renderLists=oe,v.shadowMap=ne,v.state=_e,v.info=gt}B();const N=new _w(v,T);this.xr=N,this.getContext=function(){return T},this.getContextAttributes=function(){return T.getContextAttributes()},this.forceContextLoss=function(){const E=Je.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Je.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(E){E!==void 0&&(q=E,this.setSize(Z,W,!1))},this.getSize=function(E){return E.set(Z,W)},this.setSize=function(E,D,G=!0){if(N.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,W=D,t.width=Math.floor(E*q),t.height=Math.floor(D*q),G===!0&&(t.style.width=E+"px",t.style.height=D+"px"),this.setViewport(0,0,E,D)},this.getDrawingBufferSize=function(E){return E.set(Z*q,W*q).floor()},this.setDrawingBufferSize=function(E,D,G){Z=E,W=D,q=G,t.width=Math.floor(E*G),t.height=Math.floor(D*G),this.setViewport(0,0,E,D)},this.getCurrentViewport=function(E){return E.copy(_)},this.getViewport=function(E){return E.copy(ae)},this.setViewport=function(E,D,G,V){E.isVector4?ae.set(E.x,E.y,E.z,E.w):ae.set(E,D,G,V),_e.viewport(_.copy(ae).multiplyScalar(q).round())},this.getScissor=function(E){return E.copy(pe)},this.setScissor=function(E,D,G,V){E.isVector4?pe.set(E.x,E.y,E.z,E.w):pe.set(E,D,G,V),_e.scissor(b.copy(pe).multiplyScalar(q).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(E){_e.setScissorTest(De=E)},this.setOpaqueSort=function(E){X=E},this.setTransparentSort=function(E){se=E},this.getClearColor=function(E){return E.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor.apply(me,arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha.apply(me,arguments)},this.clear=function(E=!0,D=!0,G=!0){let V=0;if(E){let H=!1;if(M!==null){const ie=M.texture.format;H=ie===Cc||ie===wc||ie===vc}if(H){const ie=M.texture.type,he=ie===tn||ie===$n||ie===Tr||ie===Xi||ie===mc||ie===Bc,ve=me.getClearColor(),we=me.getClearAlpha(),Fe=ve.r,Ie=ve.g,Me=ve.b;he?(d[0]=Fe,d[1]=Ie,d[2]=Me,d[3]=we,T.clearBufferuiv(T.COLOR,0,d)):(g[0]=Fe,g[1]=Ie,g[2]=Me,g[3]=we,T.clearBufferiv(T.COLOR,0,g))}else V|=T.COLOR_BUFFER_BIT}D&&(V|=T.DEPTH_BUFFER_BIT),G&&(V|=T.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),T.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",O,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",te,!1),oe.dispose(),ge.dispose(),Le.dispose(),F.dispose(),w.dispose(),Ae.dispose(),Re.dispose(),ht.dispose(),j.dispose(),N.dispose(),N.removeEventListener("sessionstart",Et),N.removeEventListener("sessionend",nn),Nt.stop()};function O(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const E=gt.autoReset,D=ne.enabled,G=ne.autoUpdate,V=ne.needsUpdate,H=ne.type;B(),gt.autoReset=E,ne.enabled=D,ne.autoUpdate=G,ne.needsUpdate=V,ne.type=H}function te(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function xe(E){const D=E.target;D.removeEventListener("dispose",xe),Qe(D)}function Qe(E){vt(E),Le.remove(E)}function vt(E){const D=Le.get(E).programs;D!==void 0&&(D.forEach(function(G){j.releaseProgram(G)}),E.isShaderMaterial&&j.releaseShaderCache(E))}this.renderBufferDirect=function(E,D,G,V,H,ie){D===null&&(D=Ve);const he=H.isMesh&&H.matrixWorld.determinant()<0,ve=mp(E,D,G,V,H);_e.setMaterial(V,he);let we=G.index,Fe=1;if(V.wireframe===!0){if(we=ee.getWireframeAttribute(G),we===void 0)return;Fe=2}const Ie=G.drawRange,Me=G.attributes.position;let Ze=Ie.start*Fe,mt=(Ie.start+Ie.count)*Fe;ie!==null&&(Ze=Math.max(Ze,ie.start*Fe),mt=Math.min(mt,(ie.start+ie.count)*Fe)),we!==null?(Ze=Math.max(Ze,0),mt=Math.min(mt,we.count)):Me!=null&&(Ze=Math.max(Ze,0),mt=Math.min(mt,Me.count));const Bt=mt-Ze;if(Bt<0||Bt===1/0)return;Re.setup(H,V,ve,G,we);let nA,je=Se;if(we!==null&&(nA=K.get(we),je=Be,je.setIndex(nA)),H.isMesh)V.wireframe===!0?(_e.setLineWidth(V.wireframeLinewidth*ot()),je.setMode(T.LINES)):je.setMode(T.TRIANGLES);else if(H.isLine){let Ee=V.linewidth;Ee===void 0&&(Ee=1),_e.setLineWidth(Ee*ot()),H.isLineSegments?je.setMode(T.LINES):H.isLineLoop?je.setMode(T.LINE_LOOP):je.setMode(T.LINE_STRIP)}else H.isPoints?je.setMode(T.POINTS):H.isSprite&&je.setMode(T.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)je.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Je.get("WEBGL_multi_draw"))je.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ee=H._multiDrawStarts,Ot=H._multiDrawCounts,$e=H._multiDrawCount,EA=we?K.get(we).bytesPerElement:1,ni=Le.get(V).currentProgram.getUniforms();for(let iA=0;iA<$e;iA++)ni.setValue(T,"_gl_DrawID",iA),je.render(Ee[iA]/EA,Ot[iA])}else if(H.isInstancedMesh)je.renderInstances(Ze,Bt,H.count);else if(G.isInstancedBufferGeometry){const Ee=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ot=Math.min(G.instanceCount,Ee);je.renderInstances(Ze,Bt,Ot)}else je.render(Ze,Bt)};function Tt(E,D,G){E.transparent===!0&&E.side===uA&&E.forceSinglePass===!1?(E.side=$t,E.needsUpdate=!0,Kr(E,D,G),E.side=Mn,E.needsUpdate=!0,Kr(E,D,G),E.side=uA):Kr(E,D,G)}this.compile=function(E,D,G=null){G===null&&(G=E),p=ge.get(G),p.init(D),C.push(p),G.traverseVisible(function(H){H.isLight&&H.layers.test(D.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),E!==G&&E.traverseVisible(function(H){H.isLight&&H.layers.test(D.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const V=new Set;return E.traverse(function(H){const ie=H.material;if(ie)if(Array.isArray(ie))for(let he=0;he<ie.length;he++){const ve=ie[he];Tt(ve,G,H),V.add(ve)}else Tt(ie,G,H),V.add(ie)}),C.pop(),p=null,V},this.compileAsync=function(E,D,G=null){const V=this.compile(E,D,G);return new Promise(H=>{function ie(){if(V.forEach(function(he){Le.get(he).currentProgram.isReady()&&V.delete(he)}),V.size===0){H(E);return}setTimeout(ie,10)}Je.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Ye=null;function bt(E){Ye&&Ye(E)}function Et(){Nt.stop()}function nn(){Nt.start()}const Nt=new Hh;Nt.setAnimationLoop(bt),typeof self<"u"&&Nt.setContext(self),this.setAnimationLoop=function(E){Ye=E,N.setAnimationLoop(E),E===null?Nt.stop():Nt.start()},N.addEventListener("sessionstart",Et),N.addEventListener("sessionend",nn),this.render=function(E,D){if(D!==void 0&&D.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(N.cameraAutoUpdate===!0&&N.updateCamera(D),D=N.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,D,M),p=ge.get(E,C.length),p.init(D),C.push(p),fe.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),Ge.setFromProjectionMatrix(fe),$=this.localClippingEnabled,J=Ne.init(this.clippingPlanes,$),m=oe.get(E,h.length),m.init(),h.push(m),N.enabled===!0&&N.isPresenting===!0){const ie=v.xr.getDepthSensingMesh();ie!==null&&NA(ie,D,-1/0,v.sortObjects)}NA(E,D,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(X,se),ze=N.enabled===!1||N.isPresenting===!1||N.hasDepthSensing()===!1,ze&&me.addToRenderList(m,E),this.info.render.frame++,J===!0&&Ne.beginShadows();const G=p.state.shadowsArray;ne.render(G,E,D),J===!0&&Ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=m.opaque,H=m.transmissive;if(p.setupLights(),D.isArrayCamera){const ie=D.cameras;if(H.length>0)for(let he=0,ve=ie.length;he<ve;he++){const we=ie[he];er(V,H,E,we)}ze&&me.render(E);for(let he=0,ve=ie.length;he<ve;he++){const we=ie[he];Qn(m,E,we,we.viewport)}}else H.length>0&&er(V,H,E,D),ze&&me.render(E),Qn(m,E,D);M!==null&&(He.updateMultisampleRenderTarget(M),He.updateRenderTargetMipmap(M)),E.isScene===!0&&E.onAfterRender(v,E,D),Re.resetDefaultState(),R=-1,x=null,C.pop(),C.length>0?(p=C[C.length-1],J===!0&&Ne.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,h.pop(),h.length>0?m=h[h.length-1]:m=null};function NA(E,D,G,V){if(E.visible===!1)return;if(E.layers.test(D.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(D);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ge.intersectsSprite(E)){V&&Pe.setFromMatrixPosition(E.matrixWorld).applyMatrix4(fe);const he=Ae.update(E),ve=E.material;ve.visible&&m.push(E,he,ve,G,Pe.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ge.intersectsObject(E))){const he=Ae.update(E),ve=E.material;if(V&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pe.copy(E.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Pe.copy(he.boundingSphere.center)),Pe.applyMatrix4(E.matrixWorld).applyMatrix4(fe)),Array.isArray(ve)){const we=he.groups;for(let Fe=0,Ie=we.length;Fe<Ie;Fe++){const Me=we[Fe],Ze=ve[Me.materialIndex];Ze&&Ze.visible&&m.push(E,he,Ze,G,Pe.z,Me)}}else ve.visible&&m.push(E,he,ve,G,Pe.z,null)}}const ie=E.children;for(let he=0,ve=ie.length;he<ve;he++)NA(ie[he],D,G,V)}function Qn(E,D,G,V){const H=E.opaque,ie=E.transmissive,he=E.transparent;p.setupLightsView(G),J===!0&&Ne.setGlobalState(v.clippingPlanes,G),V&&_e.viewport(_.copy(V)),H.length>0&&Vr(H,D,G),ie.length>0&&Vr(ie,D,G),he.length>0&&Vr(he,D,G),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function er(E,D,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[V.id]===void 0&&(p.state.transmissionRenderTarget[V.id]=new Sn(1,1,{generateMipmaps:!0,type:Je.has("EXT_color_buffer_half_float")||Je.has("EXT_color_buffer_float")?Zi:tn,minFilter:zn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const ie=p.state.transmissionRenderTarget[V.id],he=V.viewport||_;ie.setSize(he.z,he.w);const ve=v.getRenderTarget();v.setRenderTarget(ie),v.getClearColor(P),Y=v.getClearAlpha(),Y<1&&v.setClearColor(16777215,.5),v.clear(),ze&&me.render(G);const we=v.toneMapping;v.toneMapping=xn;const Fe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),p.setupLightsView(V),J===!0&&Ne.setGlobalState(v.clippingPlanes,V),Vr(E,G,V),He.updateMultisampleRenderTarget(ie),He.updateRenderTargetMipmap(ie),Je.has("WEBGL_multisampled_render_to_texture")===!1){let Ie=!1;for(let Me=0,Ze=D.length;Me<Ze;Me++){const mt=D[Me],Bt=mt.object,nA=mt.geometry,je=mt.material,Ee=mt.group;if(je.side===uA&&Bt.layers.test(V.layers)){const Ot=je.side;je.side=$t,je.needsUpdate=!0,Nc(Bt,G,V,nA,je,Ee),je.side=Ot,je.needsUpdate=!0,Ie=!0}}Ie===!0&&(He.updateMultisampleRenderTarget(ie),He.updateRenderTargetMipmap(ie))}v.setRenderTarget(ve),v.setClearColor(P,Y),Fe!==void 0&&(V.viewport=Fe),v.toneMapping=we}function Vr(E,D,G){const V=D.isScene===!0?D.overrideMaterial:null;for(let H=0,ie=E.length;H<ie;H++){const he=E[H],ve=he.object,we=he.geometry,Fe=V===null?he.material:V,Ie=he.group;ve.layers.test(G.layers)&&Nc(ve,D,G,we,Fe,Ie)}}function Nc(E,D,G,V,H,ie){E.onBeforeRender(v,D,G,V,H,ie),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.transparent===!0&&H.side===uA&&H.forceSinglePass===!1?(H.side=$t,H.needsUpdate=!0,v.renderBufferDirect(G,D,V,H,E,ie),H.side=Mn,H.needsUpdate=!0,v.renderBufferDirect(G,D,V,H,E,ie),H.side=uA):v.renderBufferDirect(G,D,V,H,E,ie),E.onAfterRender(v,D,G,V,H,ie)}function Kr(E,D,G){D.isScene!==!0&&(D=Ve);const V=Le.get(E),H=p.state.lights,ie=p.state.shadowsArray,he=H.state.version,ve=j.getParameters(E,H.state,ie,D,G),we=j.getProgramCacheKey(ve);let Fe=V.programs;V.environment=E.isMeshStandardMaterial?D.environment:null,V.fog=D.fog,V.envMap=(E.isMeshStandardMaterial?w:F).get(E.envMap||V.environment),V.envMapRotation=V.environment!==null&&E.envMap===null?D.environmentRotation:E.envMapRotation,Fe===void 0&&(E.addEventListener("dispose",xe),Fe=new Map,V.programs=Fe);let Ie=Fe.get(we);if(Ie!==void 0){if(V.currentProgram===Ie&&V.lightsStateVersion===he)return Gc(E,ve),Ie}else ve.uniforms=j.getUniforms(E),E.onBeforeCompile(ve,v),Ie=j.acquireProgram(ve,we),Fe.set(we,Ie),V.uniforms=ve.uniforms;const Me=V.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Me.clippingPlanes=Ne.uniform),Gc(E,ve),V.needsLights=vp(E),V.lightsStateVersion=he,V.needsLights&&(Me.ambientLightColor.value=H.state.ambient,Me.lightProbe.value=H.state.probe,Me.directionalLights.value=H.state.directional,Me.directionalLightShadows.value=H.state.directionalShadow,Me.spotLights.value=H.state.spot,Me.spotLightShadows.value=H.state.spotShadow,Me.rectAreaLights.value=H.state.rectArea,Me.ltc_1.value=H.state.rectAreaLTC1,Me.ltc_2.value=H.state.rectAreaLTC2,Me.pointLights.value=H.state.point,Me.pointLightShadows.value=H.state.pointShadow,Me.hemisphereLights.value=H.state.hemi,Me.directionalShadowMap.value=H.state.directionalShadowMap,Me.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Me.spotShadowMap.value=H.state.spotShadowMap,Me.spotLightMatrix.value=H.state.spotLightMatrix,Me.spotLightMap.value=H.state.spotLightMap,Me.pointShadowMap.value=H.state.pointShadowMap,Me.pointShadowMatrix.value=H.state.pointShadowMatrix),V.currentProgram=Ie,V.uniformsList=null,Ie}function Oc(E){if(E.uniformsList===null){const D=E.currentProgram.getUniforms();E.uniformsList=js.seqWithValue(D.seq,E.uniforms)}return E.uniformsList}function Gc(E,D){const G=Le.get(E);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function mp(E,D,G,V,H){D.isScene!==!0&&(D=Ve),He.resetTextureUnits();const ie=D.fog,he=V.isMeshStandardMaterial?D.environment:null,ve=M===null?v.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:bn,we=(V.isMeshStandardMaterial?w:F).get(V.envMap||he),Fe=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ie=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Me=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,mt=!!G.morphAttributes.color;let Bt=xn;V.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Bt=v.toneMapping);const nA=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,je=nA!==void 0?nA.length:0,Ee=Le.get(V),Ot=p.state.lights;if(J===!0&&($===!0||E!==x)){const hA=E===x&&V.id===R;Ne.setState(V,E,hA)}let $e=!1;V.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==Ot.state.version||Ee.outputColorSpace!==ve||H.isBatchedMesh&&Ee.batching===!1||!H.isBatchedMesh&&Ee.batching===!0||H.isBatchedMesh&&Ee.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ee.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ee.instancing===!1||!H.isInstancedMesh&&Ee.instancing===!0||H.isSkinnedMesh&&Ee.skinning===!1||!H.isSkinnedMesh&&Ee.skinning===!0||H.isInstancedMesh&&Ee.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ee.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ee.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ee.instancingMorph===!1&&H.morphTexture!==null||Ee.envMap!==we||V.fog===!0&&Ee.fog!==ie||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==Ne.numPlanes||Ee.numIntersection!==Ne.numIntersection)||Ee.vertexAlphas!==Fe||Ee.vertexTangents!==Ie||Ee.morphTargets!==Me||Ee.morphNormals!==Ze||Ee.morphColors!==mt||Ee.toneMapping!==Bt||Ee.morphTargetsCount!==je)&&($e=!0):($e=!0,Ee.__version=V.version);let EA=Ee.currentProgram;$e===!0&&(EA=Kr(V,D,H));let ni=!1,iA=!1,Xa=!1;const yt=EA.getUniforms(),rn=Ee.uniforms;if(_e.useProgram(EA.program)&&(ni=!0,iA=!0,Xa=!0),V.id!==R&&(R=V.id,iA=!0),ni||x!==E){yt.setValue(T,"projectionMatrix",E.projectionMatrix),yt.setValue(T,"viewMatrix",E.matrixWorldInverse);const hA=yt.map.cameraPosition;hA!==void 0&&hA.setValue(T,ce.setFromMatrixPosition(E.matrixWorld)),qe.logarithmicDepthBuffer&&yt.setValue(T,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&yt.setValue(T,"isOrthographic",E.isOrthographicCamera===!0),x!==E&&(x=E,iA=!0,Xa=!0)}if(H.isSkinnedMesh){yt.setOptional(T,H,"bindMatrix"),yt.setOptional(T,H,"bindMatrixInverse");const hA=H.skeleton;hA&&(hA.boneTexture===null&&hA.computeBoneTexture(),yt.setValue(T,"boneTexture",hA.boneTexture,He))}H.isBatchedMesh&&(yt.setOptional(T,H,"batchingTexture"),yt.setValue(T,"batchingTexture",H._matricesTexture,He),yt.setOptional(T,H,"batchingIdTexture"),yt.setValue(T,"batchingIdTexture",H._indirectTexture,He),yt.setOptional(T,H,"batchingColorTexture"),H._colorsTexture!==null&&yt.setValue(T,"batchingColorTexture",H._colorsTexture,He));const Ya=G.morphAttributes;if((Ya.position!==void 0||Ya.normal!==void 0||Ya.color!==void 0)&&We.update(H,G,EA),(iA||Ee.receiveShadow!==H.receiveShadow)&&(Ee.receiveShadow=H.receiveShadow,yt.setValue(T,"receiveShadow",H.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(rn.envMap.value=we,rn.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&D.environment!==null&&(rn.envMapIntensity.value=D.environmentIntensity),iA&&(yt.setValue(T,"toneMappingExposure",v.toneMappingExposure),Ee.needsLights&&Bp(rn,Xa),ie&&V.fog===!0&&Ue.refreshFogUniforms(rn,ie),Ue.refreshMaterialUniforms(rn,V,q,W,p.state.transmissionRenderTarget[E.id]),js.upload(T,Oc(Ee),rn,He)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(js.upload(T,Oc(Ee),rn,He),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&yt.setValue(T,"center",H.center),yt.setValue(T,"modelViewMatrix",H.modelViewMatrix),yt.setValue(T,"normalMatrix",H.normalMatrix),yt.setValue(T,"modelMatrix",H.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const hA=V.uniformsGroups;for(let Ja=0,wp=hA.length;Ja<wp;Ja++){const Vc=hA[Ja];ht.update(Vc,EA),ht.bind(Vc,EA)}}return EA}function Bp(E,D){E.ambientLightColor.needsUpdate=D,E.lightProbe.needsUpdate=D,E.directionalLights.needsUpdate=D,E.directionalLightShadows.needsUpdate=D,E.pointLights.needsUpdate=D,E.pointLightShadows.needsUpdate=D,E.spotLights.needsUpdate=D,E.spotLightShadows.needsUpdate=D,E.rectAreaLights.needsUpdate=D,E.hemisphereLights.needsUpdate=D}function vp(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return I},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(E,D,G){Le.get(E.texture).__webglTexture=D,Le.get(E.depthTexture).__webglTexture=G;const V=Le.get(E);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=G===void 0,V.__autoAllocateDepthBuffer||Je.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,D){const G=Le.get(E);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(E,D=0,G=0){M=E,I=D,U=G;let V=!0,H=null,ie=!1,he=!1;if(E){const we=Le.get(E);we.__useDefaultFramebuffer!==void 0?(_e.bindFramebuffer(T.FRAMEBUFFER,null),V=!1):we.__webglFramebuffer===void 0?He.setupRenderTarget(E):we.__hasExternalTextures&&He.rebindTextures(E,Le.get(E.texture).__webglTexture,Le.get(E.depthTexture).__webglTexture);const Fe=E.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(he=!0);const Ie=Le.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ie[D])?H=Ie[D][G]:H=Ie[D],ie=!0):E.samples>0&&He.useMultisampledRTT(E)===!1?H=Le.get(E).__webglMultisampledFramebuffer:Array.isArray(Ie)?H=Ie[G]:H=Ie,_.copy(E.viewport),b.copy(E.scissor),k=E.scissorTest}else _.copy(ae).multiplyScalar(q).floor(),b.copy(pe).multiplyScalar(q).floor(),k=De;if(_e.bindFramebuffer(T.FRAMEBUFFER,H)&&V&&_e.drawBuffers(E,H),_e.viewport(_),_e.scissor(b),_e.setScissorTest(k),ie){const we=Le.get(E.texture);T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_CUBE_MAP_POSITIVE_X+D,we.__webglTexture,G)}else if(he){const we=Le.get(E.texture),Fe=D||0;T.framebufferTextureLayer(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,we.__webglTexture,G||0,Fe)}R=-1},this.readRenderTargetPixels=function(E,D,G,V,H,ie,he){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Le.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(ve=ve[he]),ve){_e.bindFramebuffer(T.FRAMEBUFFER,ve);try{const we=E.texture,Fe=we.format,Ie=we.type;if(!qe.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=E.width-V&&G>=0&&G<=E.height-H&&T.readPixels(D,G,V,H,be.convert(Fe),be.convert(Ie),ie)}finally{const we=M!==null?Le.get(M).__webglFramebuffer:null;_e.bindFramebuffer(T.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,D,G,V,H,ie,he){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Le.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(ve=ve[he]),ve){_e.bindFramebuffer(T.FRAMEBUFFER,ve);try{const we=E.texture,Fe=we.format,Ie=we.type;if(!qe.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(D>=0&&D<=E.width-V&&G>=0&&G<=E.height-H){const Me=T.createBuffer();T.bindBuffer(T.PIXEL_PACK_BUFFER,Me),T.bufferData(T.PIXEL_PACK_BUFFER,ie.byteLength,T.STREAM_READ),T.readPixels(D,G,V,H,be.convert(Fe),be.convert(Ie),0),T.flush();const Ze=T.fenceSync(T.SYNC_GPU_COMMANDS_COMPLETE,0);await Bg(T,Ze,4);try{T.bindBuffer(T.PIXEL_PACK_BUFFER,Me),T.getBufferSubData(T.PIXEL_PACK_BUFFER,0,ie)}finally{T.deleteBuffer(Me),T.deleteSync(Ze)}return ie}}finally{const we=M!==null?Le.get(M).__webglFramebuffer:null;_e.bindFramebuffer(T.FRAMEBUFFER,we)}}},this.copyFramebufferToTexture=function(E,D=null,G=0){E.isTexture!==!0&&(xr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),D=arguments[0]||null,E=arguments[1]);const V=Math.pow(2,-G),H=Math.floor(E.image.width*V),ie=Math.floor(E.image.height*V),he=D!==null?D.x:0,ve=D!==null?D.y:0;He.setTexture2D(E,0),T.copyTexSubImage2D(T.TEXTURE_2D,G,0,0,he,ve,H,ie),_e.unbindTexture()},this.copyTextureToTexture=function(E,D,G=null,V=null,H=0){E.isTexture!==!0&&(xr("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,E=arguments[1],D=arguments[2],H=arguments[3]||0,G=null);let ie,he,ve,we,Fe,Ie;G!==null?(ie=G.max.x-G.min.x,he=G.max.y-G.min.y,ve=G.min.x,we=G.min.y):(ie=E.image.width,he=E.image.height,ve=0,we=0),V!==null?(Fe=V.x,Ie=V.y):(Fe=0,Ie=0);const Me=be.convert(D.format),Ze=be.convert(D.type);He.setTexture2D(D,0),T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,D.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,D.unpackAlignment);const mt=T.getParameter(T.UNPACK_ROW_LENGTH),Bt=T.getParameter(T.UNPACK_IMAGE_HEIGHT),nA=T.getParameter(T.UNPACK_SKIP_PIXELS),je=T.getParameter(T.UNPACK_SKIP_ROWS),Ee=T.getParameter(T.UNPACK_SKIP_IMAGES),Ot=E.isCompressedTexture?E.mipmaps[H]:E.image;T.pixelStorei(T.UNPACK_ROW_LENGTH,Ot.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Ot.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,ve),T.pixelStorei(T.UNPACK_SKIP_ROWS,we),E.isDataTexture?T.texSubImage2D(T.TEXTURE_2D,H,Fe,Ie,ie,he,Me,Ze,Ot.data):E.isCompressedTexture?T.compressedTexSubImage2D(T.TEXTURE_2D,H,Fe,Ie,Ot.width,Ot.height,Me,Ot.data):T.texSubImage2D(T.TEXTURE_2D,H,Fe,Ie,ie,he,Me,Ze,Ot),T.pixelStorei(T.UNPACK_ROW_LENGTH,mt),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Bt),T.pixelStorei(T.UNPACK_SKIP_PIXELS,nA),T.pixelStorei(T.UNPACK_SKIP_ROWS,je),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ee),H===0&&D.generateMipmaps&&T.generateMipmap(T.TEXTURE_2D),_e.unbindTexture()},this.copyTextureToTexture3D=function(E,D,G=null,V=null,H=0){E.isTexture!==!0&&(xr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,V=arguments[1]||null,E=arguments[2],D=arguments[3],H=arguments[4]||0);let ie,he,ve,we,Fe,Ie,Me,Ze,mt;const Bt=E.isCompressedTexture?E.mipmaps[H]:E.image;G!==null?(ie=G.max.x-G.min.x,he=G.max.y-G.min.y,ve=G.max.z-G.min.z,we=G.min.x,Fe=G.min.y,Ie=G.min.z):(ie=Bt.width,he=Bt.height,ve=Bt.depth,we=0,Fe=0,Ie=0),V!==null?(Me=V.x,Ze=V.y,mt=V.z):(Me=0,Ze=0,mt=0);const nA=be.convert(D.format),je=be.convert(D.type);let Ee;if(D.isData3DTexture)He.setTexture3D(D,0),Ee=T.TEXTURE_3D;else if(D.isDataArrayTexture||D.isCompressedArrayTexture)He.setTexture2DArray(D,0),Ee=T.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}T.pixelStorei(T.UNPACK_FLIP_Y_WEBGL,D.flipY),T.pixelStorei(T.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),T.pixelStorei(T.UNPACK_ALIGNMENT,D.unpackAlignment);const Ot=T.getParameter(T.UNPACK_ROW_LENGTH),$e=T.getParameter(T.UNPACK_IMAGE_HEIGHT),EA=T.getParameter(T.UNPACK_SKIP_PIXELS),ni=T.getParameter(T.UNPACK_SKIP_ROWS),iA=T.getParameter(T.UNPACK_SKIP_IMAGES);T.pixelStorei(T.UNPACK_ROW_LENGTH,Bt.width),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,Bt.height),T.pixelStorei(T.UNPACK_SKIP_PIXELS,we),T.pixelStorei(T.UNPACK_SKIP_ROWS,Fe),T.pixelStorei(T.UNPACK_SKIP_IMAGES,Ie),E.isDataTexture||E.isData3DTexture?T.texSubImage3D(Ee,H,Me,Ze,mt,ie,he,ve,nA,je,Bt.data):D.isCompressedArrayTexture?T.compressedTexSubImage3D(Ee,H,Me,Ze,mt,ie,he,ve,nA,Bt.data):T.texSubImage3D(Ee,H,Me,Ze,mt,ie,he,ve,nA,je,Bt),T.pixelStorei(T.UNPACK_ROW_LENGTH,Ot),T.pixelStorei(T.UNPACK_IMAGE_HEIGHT,$e),T.pixelStorei(T.UNPACK_SKIP_PIXELS,EA),T.pixelStorei(T.UNPACK_SKIP_ROWS,ni),T.pixelStorei(T.UNPACK_SKIP_IMAGES,iA),H===0&&D.generateMipmaps&&T.generateMipmap(Ee),_e.unbindTexture()},this.initRenderTarget=function(E){Le.get(E).__webglFramebuffer===void 0&&He.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?He.setTextureCube(E,0):E.isData3DTexture?He.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?He.setTexture2DArray(E,0):He.setTexture2D(E,0),_e.unbindTexture()},this.resetState=function(){I=0,U=0,M=null,_e.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ZA}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===_c?"display-p3":"srgb",t.unpackColorSpace=tt.workingColorSpace===Ta?"display-p3":"srgb"}}class Uc{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Oe(e),this.density=t}clone(){return new Uc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Uw extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new DA,this.environmentIntensity=1,this.environmentRotation=new DA,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Mc extends Ai{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ua=new Q,fa=new Q,Pu=new at,ar=new Pr,fs=new Hr,Eo=new Q,Nu=new Q;class zh extends Yt{constructor(e=new Pt,t=new Mc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,A=[0];for(let i=1,r=t.count;i<r;i++)ua.fromBufferAttribute(t,i-1),fa.fromBufferAttribute(t,i),A[i]=A[i-1],A[i]+=ua.distanceTo(fa);e.setAttribute("lineDistance",new Jt(A,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),fs.copy(A.boundingSphere),fs.applyMatrix4(i),fs.radius+=r,e.ray.intersectsSphere(fs)===!1)return;Pu.copy(i).invert(),ar.copy(e.ray).applyMatrix4(Pu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=A.index,f=A.attributes.position;if(c!==null){const d=Math.max(0,s.start),g=Math.min(c.count,s.start+s.count);for(let m=d,p=g-1;m<p;m+=l){const h=c.getX(m),C=c.getX(m+1),v=hs(this,e,ar,o,h,C);v&&t.push(v)}if(this.isLineLoop){const m=c.getX(g-1),p=c.getX(d),h=hs(this,e,ar,o,m,p);h&&t.push(h)}}else{const d=Math.max(0,s.start),g=Math.min(f.count,s.start+s.count);for(let m=d,p=g-1;m<p;m+=l){const h=hs(this,e,ar,o,m,m+1);h&&t.push(h)}if(this.isLineLoop){const m=hs(this,e,ar,o,g-1,d);m&&t.push(m)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function hs(n,e,t,A,i,r){const s=n.geometry.attributes.position;if(ua.fromBufferAttribute(s,i),fa.fromBufferAttribute(s,r),t.distanceSqToSegment(ua,fa,Eo,Nu)>A)return;Eo.applyMatrix4(n.matrixWorld);const o=e.ray.origin.distanceTo(Eo);if(!(o<e.near||o>e.far))return{distance:o,point:Nu.clone().applyMatrix4(n.matrixWorld),index:i,face:null,faceIndex:null,object:n}}class Mw extends Ai{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ou=new at,Rl=new Pr,ds=new Hr,ps=new Q;class Dl extends Yt{constructor(e=new Pt,t=new Mw){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const A=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,s=A.drawRange;if(A.boundingSphere===null&&A.computeBoundingSphere(),ds.copy(A.boundingSphere),ds.applyMatrix4(i),ds.radius+=r,e.ray.intersectsSphere(ds)===!1)return;Ou.copy(i).invert(),Rl.copy(e.ray).applyMatrix4(Ou);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=A.index,u=A.attributes.position;if(l!==null){const f=Math.max(0,s.start),d=Math.min(l.count,s.start+s.count);for(let g=f,m=d;g<m;g++){const p=l.getX(g);ps.fromBufferAttribute(u,p),Gu(ps,p,o,i,e,t,this)}}else{const f=Math.max(0,s.start),d=Math.min(u.count,s.start+s.count);for(let g=f,m=d;g<m;g++)ps.fromBufferAttribute(u,g),Gu(ps,g,o,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,A=Object.keys(t);if(A.length>0){const i=t[A[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Gu(n,e,t,A,i,r,s){const a=Rl.distanceSqToPoint(n);if(a<t){const o=new Q;Rl.closestPointToPoint(n,o),o.applyMatrix4(A);const l=i.ray.origin.distanceTo(o);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,object:s})}}class Sw extends eA{constructor(e,t,A,i,r,s,a,o,l){super(e,t,A,i,r,s,a,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qa extends Pt{constructor(e=.5,t=1,A=32,i=1,r=0,s=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:A,phiSegments:i,thetaStart:r,thetaLength:s},A=Math.max(3,A),i=Math.max(1,i);const a=[],o=[],l=[],c=[];let u=e;const f=(t-e)/i,d=new Q,g=new ye;for(let m=0;m<=i;m++){for(let p=0;p<=A;p++){const h=r+p/A*s;d.x=u*Math.cos(h),d.y=u*Math.sin(h),o.push(d.x,d.y,d.z),l.push(0,0,1),g.x=(d.x/t+1)/2,g.y=(d.y/t+1)/2,c.push(g.x,g.y)}u+=f}for(let m=0;m<i;m++){const p=m*(A+1);for(let h=0;h<A;h++){const C=h+p,v=C,y=C+A+1,I=C+A+2,U=C+1;a.push(v,y,U),a.push(y,I,U)}}this.setIndex(a),this.setAttribute("position",new Jt(o,3)),this.setAttribute("normal",new Jt(l,3)),this.setAttribute("uv",new Jt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qa(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Bn extends Pt{constructor(e=1,t=32,A=16,i=0,r=Math.PI*2,s=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:A,phiStart:i,phiLength:r,thetaStart:s,thetaLength:a},t=Math.max(3,Math.floor(t)),A=Math.max(2,Math.floor(A));const o=Math.min(s+a,Math.PI);let l=0;const c=[],u=new Q,f=new Q,d=[],g=[],m=[],p=[];for(let h=0;h<=A;h++){const C=[],v=h/A;let y=0;h===0&&s===0?y=.5/t:h===A&&o===Math.PI&&(y=-.5/t);for(let I=0;I<=t;I++){const U=I/t;u.x=-e*Math.cos(i+U*r)*Math.sin(s+v*a),u.y=e*Math.cos(s+v*a),u.z=e*Math.sin(i+U*r)*Math.sin(s+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),m.push(f.x,f.y,f.z),p.push(U+y,1-v),C.push(l++)}c.push(C)}for(let h=0;h<A;h++)for(let C=0;C<t;C++){const v=c[h][C+1],y=c[h][C],I=c[h+1][C],U=c[h+1][C+1];(h!==0||s>0)&&d.push(v,y,U),(h!==A-1||o<Math.PI)&&d.push(y,I,U)}this.setIndex(d),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(m,3)),this.setAttribute("uv",new Jt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Vu extends Ai{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yh,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new DA,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wh extends Yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const yo=new at,Ku=new Q,ku=new Q;class Fw{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ec,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,A=this.matrix;Ku.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ku),ku.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ku),t.updateMatrixWorld(),yo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yo),A.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),A.multiply(yo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const zu=new at,or=new Q,Uo=new Q;class Tw extends Fw{constructor(){super(new cA(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ye(4,2),this._viewportCount=6,this._viewports=[new ft(2,1,1,1),new ft(0,1,1,1),new ft(3,1,1,1),new ft(1,1,1,1),new ft(3,0,1,1),new ft(1,0,1,1)],this._cubeDirections=[new Q(1,0,0),new Q(-1,0,0),new Q(0,0,1),new Q(0,0,-1),new Q(0,1,0),new Q(0,-1,0)],this._cubeUps=[new Q(0,1,0),new Q(0,1,0),new Q(0,1,0),new Q(0,1,0),new Q(0,0,1),new Q(0,0,-1)]}updateMatrices(e,t=0){const A=this.camera,i=this.matrix,r=e.distance||A.far;r!==A.far&&(A.far=r,A.updateProjectionMatrix()),or.setFromMatrixPosition(e.matrixWorld),A.position.copy(or),Uo.copy(A.position),Uo.add(this._cubeDirections[t]),A.up.copy(this._cubeUps[t]),A.lookAt(Uo),A.updateMatrixWorld(),i.makeTranslation(-or.x,-or.y,-or.z),zu.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zu)}}class Wu extends Wh{constructor(e,t,A=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=A,this.decay=i,this.shadow=new Tw}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class bw extends Wh{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Xh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Xu(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Xu();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Xu(){return(typeof performance>"u"?Date:performance).now()}const Yu=new at;class Yh{constructor(e,t,A=0,i=1/0){this.ray=new Pr(e,t),this.near=A,this.far=i,this.camera=null,this.layers=new xc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yu),this}intersectObject(e,t=!0,A=[]){return Hl(e,this,A,t),A.sort(Ju),A}intersectObjects(e,t=!0,A=[]){for(let i=0,r=e.length;i<r;i++)Hl(e[i],this,A,t);return A.sort(Ju),A}}function Ju(n,e){return n.distance-e.distance}function Hl(n,e,t,A){let i=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(i=!1),i===!0&&A===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)Hl(r[s],e,t,!0)}}class qu{constructor(e=1,t=0,A=0){return this.radius=e,this.phi=t,this.theta=A,this}set(e,t,A){return this.radius=e,this.phi=t,this.theta=A,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,A){return this.radius=Math.sqrt(e*e+t*t+A*A),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,A),this.phi=Math.acos(jt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pc);const Zu={type:"change"},Mo={type:"start"},ju={type:"end"},gs=new Pr,$u=new dn,Qw=Math.cos(70*gg.DEG2RAD);class Jh extends ti{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new Q,this.cursor=new Q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ii.ROTATE,MIDDLE:ii.DOLLY,RIGHT:ii.PAN},this.touches={ONE:ri.ROTATE,TWO:ri.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(B){B.addEventListener("keydown",ge),this._domElementKeyEvents=B},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ge),this._domElementKeyEvents=null},this.saveState=function(){A.target0.copy(A.target),A.position0.copy(A.object.position),A.zoom0=A.object.zoom},this.reset=function(){A.target.copy(A.target0),A.object.position.copy(A.position0),A.object.zoom=A.zoom0,A.object.updateProjectionMatrix(),A.dispatchEvent(Zu),A.update(),r=i.NONE},this.update=function(){const B=new Q,N=new ei().setFromUnitVectors(e.up,new Q(0,1,0)),O=N.clone().invert(),z=new Q,te=new ei,xe=new Q,Qe=2*Math.PI;return function(Tt=null){const Ye=A.object.position;B.copy(Ye).sub(A.target),B.applyQuaternion(N),a.setFromVector3(B),A.autoRotate&&r===i.NONE&&k(_(Tt)),A.enableDamping?(a.theta+=o.theta*A.dampingFactor,a.phi+=o.phi*A.dampingFactor):(a.theta+=o.theta,a.phi+=o.phi);let bt=A.minAzimuthAngle,Et=A.maxAzimuthAngle;isFinite(bt)&&isFinite(Et)&&(bt<-Math.PI?bt+=Qe:bt>Math.PI&&(bt-=Qe),Et<-Math.PI?Et+=Qe:Et>Math.PI&&(Et-=Qe),bt<=Et?a.theta=Math.max(bt,Math.min(Et,a.theta)):a.theta=a.theta>(bt+Et)/2?Math.max(bt,a.theta):Math.min(Et,a.theta)),a.phi=Math.max(A.minPolarAngle,Math.min(A.maxPolarAngle,a.phi)),a.makeSafe(),A.enableDamping===!0?A.target.addScaledVector(c,A.dampingFactor):A.target.add(c),A.target.sub(A.cursor),A.target.clampLength(A.minTargetRadius,A.maxTargetRadius),A.target.add(A.cursor);let nn=!1;if(A.zoomToCursor&&U||A.object.isOrthographicCamera)a.radius=ae(a.radius);else{const Nt=a.radius;a.radius=ae(a.radius*l),nn=Nt!=a.radius}if(B.setFromSpherical(a),B.applyQuaternion(O),Ye.copy(A.target).add(B),A.object.lookAt(A.target),A.enableDamping===!0?(o.theta*=1-A.dampingFactor,o.phi*=1-A.dampingFactor,c.multiplyScalar(1-A.dampingFactor)):(o.set(0,0,0),c.set(0,0,0)),A.zoomToCursor&&U){let Nt=null;if(A.object.isPerspectiveCamera){const NA=B.length();Nt=ae(NA*l);const Qn=NA-Nt;A.object.position.addScaledVector(y,Qn),A.object.updateMatrixWorld(),nn=!!Qn}else if(A.object.isOrthographicCamera){const NA=new Q(I.x,I.y,0);NA.unproject(A.object);const Qn=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),A.object.updateProjectionMatrix(),nn=Qn!==A.object.zoom;const er=new Q(I.x,I.y,0);er.unproject(A.object),A.object.position.sub(er).add(NA),A.object.updateMatrixWorld(),Nt=B.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),A.zoomToCursor=!1;Nt!==null&&(this.screenSpacePanning?A.target.set(0,0,-1).transformDirection(A.object.matrix).multiplyScalar(Nt).add(A.object.position):(gs.origin.copy(A.object.position),gs.direction.set(0,0,-1).transformDirection(A.object.matrix),Math.abs(A.object.up.dot(gs.direction))<Qw?e.lookAt(A.target):($u.setFromNormalAndCoplanarPoint(A.object.up,A.target),gs.intersectPlane($u,A.target))))}else if(A.object.isOrthographicCamera){const Nt=A.object.zoom;A.object.zoom=Math.max(A.minZoom,Math.min(A.maxZoom,A.object.zoom/l)),Nt!==A.object.zoom&&(A.object.updateProjectionMatrix(),nn=!0)}return l=1,U=!1,nn||z.distanceToSquared(A.object.position)>s||8*(1-te.dot(A.object.quaternion))>s||xe.distanceToSquared(A.target)>s?(A.dispatchEvent(Zu),z.copy(A.object.position),te.copy(A.object.quaternion),xe.copy(A.target),!0):!1}}(),this.dispose=function(){A.domElement.removeEventListener("contextmenu",me),A.domElement.removeEventListener("pointerdown",He),A.domElement.removeEventListener("pointercancel",w),A.domElement.removeEventListener("wheel",Ae),A.domElement.removeEventListener("pointermove",F),A.domElement.removeEventListener("pointerup",w),A.domElement.getRootNode().removeEventListener("keydown",Ue,{capture:!0}),A._domElementKeyEvents!==null&&(A._domElementKeyEvents.removeEventListener("keydown",ge),A._domElementKeyEvents=null)};const A=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const s=1e-6,a=new qu,o=new qu;let l=1;const c=new Q,u=new ye,f=new ye,d=new ye,g=new ye,m=new ye,p=new ye,h=new ye,C=new ye,v=new ye,y=new Q,I=new ye;let U=!1;const M=[],R={};let x=!1;function _(B){return B!==null?2*Math.PI/60*A.autoRotateSpeed*B:2*Math.PI/60/60*A.autoRotateSpeed}function b(B){const N=Math.abs(B*.01);return Math.pow(.95,A.zoomSpeed*N)}function k(B){o.theta-=B}function P(B){o.phi-=B}const Y=function(){const B=new Q;return function(O,z){B.setFromMatrixColumn(z,0),B.multiplyScalar(-O),c.add(B)}}(),Z=function(){const B=new Q;return function(O,z){A.screenSpacePanning===!0?B.setFromMatrixColumn(z,1):(B.setFromMatrixColumn(z,0),B.crossVectors(A.object.up,B)),B.multiplyScalar(O),c.add(B)}}(),W=function(){const B=new Q;return function(O,z){const te=A.domElement;if(A.object.isPerspectiveCamera){const xe=A.object.position;B.copy(xe).sub(A.target);let Qe=B.length();Qe*=Math.tan(A.object.fov/2*Math.PI/180),Y(2*O*Qe/te.clientHeight,A.object.matrix),Z(2*z*Qe/te.clientHeight,A.object.matrix)}else A.object.isOrthographicCamera?(Y(O*(A.object.right-A.object.left)/A.object.zoom/te.clientWidth,A.object.matrix),Z(z*(A.object.top-A.object.bottom)/A.object.zoom/te.clientHeight,A.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),A.enablePan=!1)}}();function q(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l/=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function X(B){A.object.isPerspectiveCamera||A.object.isOrthographicCamera?l*=B:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),A.enableZoom=!1)}function se(B,N){if(!A.zoomToCursor)return;U=!0;const O=A.domElement.getBoundingClientRect(),z=B-O.left,te=N-O.top,xe=O.width,Qe=O.height;I.x=z/xe*2-1,I.y=-(te/Qe)*2+1,y.set(I.x,I.y,1).unproject(A.object).sub(A.object.position).normalize()}function ae(B){return Math.max(A.minDistance,Math.min(A.maxDistance,B))}function pe(B){u.set(B.clientX,B.clientY)}function De(B){se(B.clientX,B.clientX),h.set(B.clientX,B.clientY)}function Ge(B){g.set(B.clientX,B.clientY)}function J(B){f.set(B.clientX,B.clientY),d.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;k(2*Math.PI*d.x/N.clientHeight),P(2*Math.PI*d.y/N.clientHeight),u.copy(f),A.update()}function $(B){C.set(B.clientX,B.clientY),v.subVectors(C,h),v.y>0?q(b(v.y)):v.y<0&&X(b(v.y)),h.copy(C),A.update()}function fe(B){m.set(B.clientX,B.clientY),p.subVectors(m,g).multiplyScalar(A.panSpeed),W(p.x,p.y),g.copy(m),A.update()}function ce(B){se(B.clientX,B.clientY),B.deltaY<0?X(b(B.deltaY)):B.deltaY>0&&q(b(B.deltaY)),A.update()}function Pe(B){let N=!1;switch(B.code){case A.keys.UP:B.ctrlKey||B.metaKey||B.shiftKey?P(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):W(0,A.keyPanSpeed),N=!0;break;case A.keys.BOTTOM:B.ctrlKey||B.metaKey||B.shiftKey?P(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):W(0,-A.keyPanSpeed),N=!0;break;case A.keys.LEFT:B.ctrlKey||B.metaKey||B.shiftKey?k(2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):W(A.keyPanSpeed,0),N=!0;break;case A.keys.RIGHT:B.ctrlKey||B.metaKey||B.shiftKey?k(-2*Math.PI*A.rotateSpeed/A.domElement.clientHeight):W(-A.keyPanSpeed,0),N=!0;break}N&&(B.preventDefault(),A.update())}function Ve(B){if(M.length===1)u.set(B.pageX,B.pageY);else{const N=Re(B),O=.5*(B.pageX+N.x),z=.5*(B.pageY+N.y);u.set(O,z)}}function ze(B){if(M.length===1)g.set(B.pageX,B.pageY);else{const N=Re(B),O=.5*(B.pageX+N.x),z=.5*(B.pageY+N.y);g.set(O,z)}}function ot(B){const N=Re(B),O=B.pageX-N.x,z=B.pageY-N.y,te=Math.sqrt(O*O+z*z);h.set(0,te)}function T(B){A.enableZoom&&ot(B),A.enablePan&&ze(B)}function pt(B){A.enableZoom&&ot(B),A.enableRotate&&Ve(B)}function Je(B){if(M.length==1)f.set(B.pageX,B.pageY);else{const O=Re(B),z=.5*(B.pageX+O.x),te=.5*(B.pageY+O.y);f.set(z,te)}d.subVectors(f,u).multiplyScalar(A.rotateSpeed);const N=A.domElement;k(2*Math.PI*d.x/N.clientHeight),P(2*Math.PI*d.y/N.clientHeight),u.copy(f)}function qe(B){if(M.length===1)m.set(B.pageX,B.pageY);else{const N=Re(B),O=.5*(B.pageX+N.x),z=.5*(B.pageY+N.y);m.set(O,z)}p.subVectors(m,g).multiplyScalar(A.panSpeed),W(p.x,p.y),g.copy(m)}function _e(B){const N=Re(B),O=B.pageX-N.x,z=B.pageY-N.y,te=Math.sqrt(O*O+z*z);C.set(0,te),v.set(0,Math.pow(C.y/h.y,A.zoomSpeed)),q(v.y),h.copy(C);const xe=(B.pageX+N.x)*.5,Qe=(B.pageY+N.y)*.5;se(xe,Qe)}function gt(B){A.enableZoom&&_e(B),A.enablePan&&qe(B)}function Le(B){A.enableZoom&&_e(B),A.enableRotate&&Je(B)}function He(B){A.enabled!==!1&&(M.length===0&&(A.domElement.setPointerCapture(B.pointerId),A.domElement.addEventListener("pointermove",F),A.domElement.addEventListener("pointerup",w)),!Be(B)&&(We(B),B.pointerType==="touch"?Ne(B):K(B)))}function F(B){A.enabled!==!1&&(B.pointerType==="touch"?ne(B):ee(B))}function w(B){switch(Se(B),M.length){case 0:A.domElement.releasePointerCapture(B.pointerId),A.domElement.removeEventListener("pointermove",F),A.domElement.removeEventListener("pointerup",w),A.dispatchEvent(ju),r=i.NONE;break;case 1:const N=M[0],O=R[N];Ne({pointerId:N,pageX:O.x,pageY:O.y});break}}function K(B){let N;switch(B.button){case 0:N=A.mouseButtons.LEFT;break;case 1:N=A.mouseButtons.MIDDLE;break;case 2:N=A.mouseButtons.RIGHT;break;default:N=-1}switch(N){case ii.DOLLY:if(A.enableZoom===!1)return;De(B),r=i.DOLLY;break;case ii.ROTATE:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enablePan===!1)return;Ge(B),r=i.PAN}else{if(A.enableRotate===!1)return;pe(B),r=i.ROTATE}break;case ii.PAN:if(B.ctrlKey||B.metaKey||B.shiftKey){if(A.enableRotate===!1)return;pe(B),r=i.ROTATE}else{if(A.enablePan===!1)return;Ge(B),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Mo)}function ee(B){switch(r){case i.ROTATE:if(A.enableRotate===!1)return;J(B);break;case i.DOLLY:if(A.enableZoom===!1)return;$(B);break;case i.PAN:if(A.enablePan===!1)return;fe(B);break}}function Ae(B){A.enabled===!1||A.enableZoom===!1||r!==i.NONE||(B.preventDefault(),A.dispatchEvent(Mo),ce(j(B)),A.dispatchEvent(ju))}function j(B){const N=B.deltaMode,O={clientX:B.clientX,clientY:B.clientY,deltaY:B.deltaY};switch(N){case 1:O.deltaY*=16;break;case 2:O.deltaY*=100;break}return B.ctrlKey&&!x&&(O.deltaY*=10),O}function Ue(B){B.key==="Control"&&(x=!0,A.domElement.getRootNode().addEventListener("keyup",oe,{passive:!0,capture:!0}))}function oe(B){B.key==="Control"&&(x=!1,A.domElement.getRootNode().removeEventListener("keyup",oe,{passive:!0,capture:!0}))}function ge(B){A.enabled===!1||A.enablePan===!1||Pe(B)}function Ne(B){switch(be(B),M.length){case 1:switch(A.touches.ONE){case ri.ROTATE:if(A.enableRotate===!1)return;Ve(B),r=i.TOUCH_ROTATE;break;case ri.PAN:if(A.enablePan===!1)return;ze(B),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(A.touches.TWO){case ri.DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;T(B),r=i.TOUCH_DOLLY_PAN;break;case ri.DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;pt(B),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&A.dispatchEvent(Mo)}function ne(B){switch(be(B),r){case i.TOUCH_ROTATE:if(A.enableRotate===!1)return;Je(B),A.update();break;case i.TOUCH_PAN:if(A.enablePan===!1)return;qe(B),A.update();break;case i.TOUCH_DOLLY_PAN:if(A.enableZoom===!1&&A.enablePan===!1)return;gt(B),A.update();break;case i.TOUCH_DOLLY_ROTATE:if(A.enableZoom===!1&&A.enableRotate===!1)return;Le(B),A.update();break;default:r=i.NONE}}function me(B){A.enabled!==!1&&B.preventDefault()}function We(B){M.push(B.pointerId)}function Se(B){delete R[B.pointerId];for(let N=0;N<M.length;N++)if(M[N]==B.pointerId){M.splice(N,1);return}}function Be(B){for(let N=0;N<M.length;N++)if(M[N]==B.pointerId)return!0;return!1}function be(B){let N=R[B.pointerId];N===void 0&&(N=new ye,R[B.pointerId]=N),N.set(B.pageX,B.pageY)}function Re(B){const N=B.pointerId===M[0]?M[1]:M[0];return R[N]}A.domElement.addEventListener("contextmenu",me),A.domElement.addEventListener("pointerdown",He),A.domElement.addEventListener("pointercancel",w),A.domElement.addEventListener("wheel",Ae,{passive:!1}),A.domElement.getRootNode().addEventListener("keydown",Ue,{passive:!0,capture:!0}),this.update()}}const Iw={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ia{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Lw=new Ph(-1,1,1,-1,0,1);class Rw extends Pt{constructor(){super(),this.setAttribute("position",new Jt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Jt([0,2,0,0,2,0],2))}}const Dw=new Rw;class Hw{constructor(e){this._mesh=new Ft(Dw,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Lw)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Pl extends Ia{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Kt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Lh.clone(e.uniforms),this.material=new Kt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Hw(this.material)}render(e,t,A){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=A.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ef extends Ia{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,A){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let s,a;this.inverse?(s=0,a=1):(s=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,s,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(A),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class Pw extends Ia{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Nw{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const A=e.getSize(new ye);this._width=A.width,this._height=A.height,t=new Sn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Zi}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Pl(Iw),this.copyPass.material.blending=jA,this.clock=new Xh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let A=!1;for(let i=0,r=this.passes.length;i<r;i++){const s=this.passes[i];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,A),s.needsSwap){if(A){const a=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ef!==void 0&&(s instanceof ef?A=!0:s instanceof Pw&&(A=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ye);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const A=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(A,i),this.renderTarget2.setSize(A,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(A,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ow extends Ia{constructor(e,t,A=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=A,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Oe}render(e,t,A){const i=e.autoClear;e.autoClear=!1;let r,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:A),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=i}}/*!
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
***************************************************************************** */var Nl=function(n,e){return Nl=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,A){t.__proto__=A}||function(t,A){for(var i in A)Object.prototype.hasOwnProperty.call(A,i)&&(t[i]=A[i])},Nl(n,e)};function bA(n,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Nl(n,e);function t(){this.constructor=n}n.prototype=e===null?Object.create(e):(t.prototype=e.prototype,new t)}var Ol=function(){return Ol=Object.assign||function(e){for(var t,A=1,i=arguments.length;A<i;A++){t=arguments[A];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},Ol.apply(this,arguments)};function Zt(n,e,t,A){function i(r){return r instanceof t?r:new t(function(s){s(r)})}return new(t||(t=Promise))(function(r,s){function a(c){try{l(A.next(c))}catch(u){s(u)}}function o(c){try{l(A.throw(c))}catch(u){s(u)}}function l(c){c.done?r(c.value):i(c.value).then(a,o)}l((A=A.apply(n,[])).next())})}function Wt(n,e){var t={label:0,sent:function(){if(r[0]&1)throw r[1];return r[1]},trys:[],ops:[]},A,i,r,s;return s={next:a(0),throw:a(1),return:a(2)},typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(l){return function(c){return o([l,c])}}function o(l){if(A)throw new TypeError("Generator is already executing.");for(;t;)try{if(A=1,i&&(r=l[0]&2?i.return:l[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,l[1])).done)return r;switch(i=0,r&&(l=[l[0]&2,r.value]),l[0]){case 0:case 1:r=l;break;case 4:return t.label++,{value:l[1],done:!1};case 5:t.label++,i=l[1],l=[0];continue;case 7:l=t.ops.pop(),t.trys.pop();continue;default:if(r=t.trys,!(r=r.length>0&&r[r.length-1])&&(l[0]===6||l[0]===2)){t=0;continue}if(l[0]===3&&(!r||l[1]>r[0]&&l[1]<r[3])){t.label=l[1];break}if(l[0]===6&&t.label<r[1]){t.label=r[1],r=l;break}if(r&&t.label<r[2]){t.label=r[2],t.ops.push(l);break}r[2]&&t.ops.pop(),t.trys.pop();continue}l=e.call(n,t)}catch(c){l=[6,c],i=0}finally{A=r=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}function ms(n,e,t){if(arguments.length===2)for(var A=0,i=e.length,r;A<i;A++)(r||!(A in e))&&(r||(r=Array.prototype.slice.call(e,0,A)),r[A]=e[A]);return n.concat(r||e)}var An=function(){function n(e,t,A,i){this.left=e,this.top=t,this.width=A,this.height=i}return n.prototype.add=function(e,t,A,i){return new n(this.left+e,this.top+t,this.width+A,this.height+i)},n.fromClientRect=function(e,t){return new n(t.left+e.windowBounds.left,t.top+e.windowBounds.top,t.width,t.height)},n.fromDOMRectList=function(e,t){var A=Array.from(t).find(function(i){return i.width!==0});return A?new n(A.left+e.windowBounds.left,A.top+e.windowBounds.top,A.width,A.height):n.EMPTY},n.EMPTY=new n(0,0,0,0),n}(),La=function(n,e){return An.fromClientRect(n,e.getBoundingClientRect())},Gw=function(n){var e=n.body,t=n.documentElement;if(!e||!t)throw new Error("Unable to get document size");var A=Math.max(Math.max(e.scrollWidth,t.scrollWidth),Math.max(e.offsetWidth,t.offsetWidth),Math.max(e.clientWidth,t.clientWidth)),i=Math.max(Math.max(e.scrollHeight,t.scrollHeight),Math.max(e.offsetHeight,t.offsetHeight),Math.max(e.clientHeight,t.clientHeight));return new An(0,0,A,i)},Ra=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},Ct=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},tf="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Vw=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Bs=0;Bs<tf.length;Bs++)Vw[tf.charCodeAt(Bs)]=Bs;var Af="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",gr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var vs=0;vs<Af.length;vs++)gr[Af.charCodeAt(vs)]=vs;var Kw=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=gr[n.charCodeAt(A)],s=gr[n.charCodeAt(A+1)],a=gr[n.charCodeAt(A+2)],o=gr[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},kw=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},zw=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},Jn=5,Sc=11,So=2,Ww=Sc-Jn,qh=65536>>Jn,Xw=1<<Jn,Fo=Xw-1,Yw=1024>>Jn,Jw=qh+Yw,qw=Jw,Zw=32,jw=qw+Zw,$w=65536>>Sc,eC=1<<Ww,tC=eC-1,nf=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},AC=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},nC=function(n,e){var t=Kw(n),A=Array.isArray(t)?zw(t):new Uint32Array(t),i=Array.isArray(t)?kw(t):new Uint16Array(t),r=24,s=nf(i,r/2,A[4]/2),a=A[5]===2?nf(i,(r+A[4])/2):AC(A,Math.ceil((r+A[4])/4));return new iC(A[0],A[1],A[2],A[3],s,a)},iC=function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>Jn],t=(t<<So)+(e&Fo),this.data[t];if(e<=65535)return t=this.index[qh+(e-55296>>Jn)],t=(t<<So)+(e&Fo),this.data[t];if(e<this.highStart)return t=jw-$w+(e>>Sc),t=this.index[t],t+=e>>Jn&tC,t=this.index[t],t=(t<<So)+(e&Fo),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n}(),rf="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",rC=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var ws=0;ws<rf.length;ws++)rC[rf.charCodeAt(ws)]=ws;var sC="KwAAAAAAAAAACA4AUD0AADAgAAACAAAAAAAIABAAGABAAEgAUABYAGAAaABgAGgAYgBqAF8AZwBgAGgAcQB5AHUAfQCFAI0AlQCdAKIAqgCyALoAYABoAGAAaABgAGgAwgDKAGAAaADGAM4A0wDbAOEA6QDxAPkAAQEJAQ8BFwF1AH0AHAEkASwBNAE6AUIBQQFJAVEBWQFhAWgBcAF4ATAAgAGGAY4BlQGXAZ8BpwGvAbUBvQHFAc0B0wHbAeMB6wHxAfkBAQIJAvEBEQIZAiECKQIxAjgCQAJGAk4CVgJeAmQCbAJ0AnwCgQKJApECmQKgAqgCsAK4ArwCxAIwAMwC0wLbAjAA4wLrAvMC+AIAAwcDDwMwABcDHQMlAy0DNQN1AD0DQQNJA0kDSQNRA1EDVwNZA1kDdQB1AGEDdQBpA20DdQN1AHsDdQCBA4kDkQN1AHUAmQOhA3UAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AKYDrgN1AHUAtgO+A8YDzgPWAxcD3gPjA+sD8wN1AHUA+wMDBAkEdQANBBUEHQQlBCoEFwMyBDgEYABABBcDSARQBFgEYARoBDAAcAQzAXgEgASIBJAEdQCXBHUAnwSnBK4EtgS6BMIEyAR1AHUAdQB1AHUAdQCVANAEYABgAGAAYABgAGAAYABgANgEYADcBOQEYADsBPQE/AQEBQwFFAUcBSQFLAU0BWQEPAVEBUsFUwVbBWAAYgVgAGoFcgV6BYIFigWRBWAAmQWfBaYFYABgAGAAYABgAKoFYACxBbAFuQW6BcEFwQXHBcEFwQXPBdMF2wXjBeoF8gX6BQIGCgYSBhoGIgYqBjIGOgZgAD4GRgZMBmAAUwZaBmAAYABgAGAAYABgAGAAYABgAGAAYABgAGIGYABpBnAGYABgAGAAYABgAGAAYABgAGAAYAB4Bn8GhQZgAGAAYAB1AHcDFQSLBmAAYABgAJMGdQA9A3UAmwajBqsGqwaVALMGuwbDBjAAywbSBtIG1QbSBtIG0gbSBtIG0gbdBuMG6wbzBvsGAwcLBxMHAwcbByMHJwcsBywHMQcsB9IGOAdAB0gHTgfSBkgHVgfSBtIG0gbSBtIG0gbSBtIG0gbSBiwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdgAGAALAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAdbB2MHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB2kH0gZwB64EdQB1AHUAdQB1AHUAdQB1AHUHfQdgAIUHjQd1AHUAlQedB2AAYAClB6sHYACzB7YHvgfGB3UAzgfWBzMB3gfmB1EB7gf1B/0HlQENAQUIDQh1ABUIHQglCBcDLQg1CD0IRQhNCEEDUwh1AHUAdQBbCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIaQhjCGQIZQhmCGcIaAhpCGMIZAhlCGYIZwhoCGkIYwhkCGUIZghnCGgIcAh3CHoIMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIgggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAALAcsBywHLAcsBywHLAcsBywHLAcsB4oILAcsB44I0gaWCJ4Ipgh1AHUAqgiyCHUAdQB1AHUAdQB1AHUAdQB1AHUAtwh8AXUAvwh1AMUIyQjRCNkI4AjoCHUAdQB1AO4I9gj+CAYJDgkTCS0HGwkjCYIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiCCIIIggiAAIAAAAFAAYABgAGIAXwBgAHEAdQBFAJUAogCyAKAAYABgAEIA4ABGANMA4QDxAMEBDwE1AFwBLAE6AQEBUQF4QkhCmEKoQrhCgAHIQsAB0MLAAcABwAHAAeDC6ABoAHDCwMMAAcABwAHAAdDDGMMAAcAB6MM4wwjDWMNow3jDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEjDqABWw6bDqABpg6gAaABoAHcDvwOPA+gAaABfA/8DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DvwO/A78DpcPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB9cPKwkyCToJMAB1AHUAdQBCCUoJTQl1AFUJXAljCWcJawkwADAAMAAwAHMJdQB2CX4JdQCECYoJjgmWCXUAngkwAGAAYABxAHUApgn3A64JtAl1ALkJdQDACTAAMAAwADAAdQB1AHUAdQB1AHUAdQB1AHUAowYNBMUIMAAwADAAMADICcsJ0wnZCRUE4QkwAOkJ8An4CTAAMAB1AAAKvwh1AAgKDwoXCh8KdQAwACcKLgp1ADYKqAmICT4KRgowADAAdQB1AE4KMAB1AFYKdQBeCnUAZQowADAAMAAwADAAMAAwADAAMAAVBHUAbQowADAAdQC5CXUKMAAwAHwBxAijBogEMgF9CoQKiASMCpQKmgqIBKIKqgquCogEDQG2Cr4KxgrLCjAAMADTCtsKCgHjCusK8Qr5CgELMAAwADAAMAB1AIsECQsRC3UANAEZCzAAMAAwADAAMAB1ACELKQswAHUANAExCzkLdQBBC0kLMABRC1kLMAAwADAAMAAwADAAdQBhCzAAMAAwAGAAYABpC3ELdwt/CzAAMACHC4sLkwubC58Lpwt1AK4Ltgt1APsDMAAwADAAMAAwADAAMAAwAL4LwwvLC9IL1wvdCzAAMADlC+kL8Qv5C/8LSQswADAAMAAwADAAMAAwADAAMAAHDDAAMAAwADAAMAAODBYMHgx1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1ACYMMAAwADAAdQB1AHUALgx1AHUAdQB1AHUAdQA2DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AD4MdQBGDHUAdQB1AHUAdQB1AEkMdQB1AHUAdQB1AFAMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQBYDHUAdQB1AF8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUA+wMVBGcMMAAwAHwBbwx1AHcMfwyHDI8MMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAYABgAJcMMAAwADAAdQB1AJ8MlQClDDAAMACtDCwHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsB7UMLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AA0EMAC9DDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAsBywHLAcsBywHLAcsBywHLQcwAMEMyAwsBywHLAcsBywHLAcsBywHLAcsBywHzAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAHUAdQB1ANQM2QzhDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMABgAGAAYABgAGAAYABgAOkMYADxDGAA+AwADQYNYABhCWAAYAAODTAAMAAwADAAFg1gAGAAHg37AzAAMAAwADAAYABgACYNYAAsDTQNPA1gAEMNPg1LDWAAYABgAGAAYABgAGAAYABgAGAAUg1aDYsGVglhDV0NcQBnDW0NdQ15DWAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAlQCBDZUAiA2PDZcNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAnw2nDTAAMAAwADAAMAAwAHUArw23DTAAMAAwADAAMAAwADAAMAAwADAAMAB1AL8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAB1AHUAdQB1AHUAdQDHDTAAYABgAM8NMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA1w11ANwNMAAwAD0B5A0wADAAMAAwADAAMADsDfQN/A0EDgwOFA4wABsOMAAwADAAMAAwADAAMAAwANIG0gbSBtIG0gbSBtIG0gYjDigOwQUuDsEFMw7SBjoO0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGQg5KDlIOVg7SBtIGXg5lDm0OdQ7SBtIGfQ6EDooOjQ6UDtIGmg6hDtIG0gaoDqwO0ga0DrwO0gZgAGAAYADEDmAAYAAkBtIGzA5gANIOYADaDokO0gbSBt8O5w7SBu8O0gb1DvwO0gZgAGAAxA7SBtIG0gbSBtIGYABgAGAAYAAED2AAsAUMD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHJA8sBywHLAcsBywHLAccDywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywPLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAc0D9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAccD9IG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIGFA8sBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHLAcsBywHPA/SBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gbSBtIG0gYUD0QPlQCVAJUAMAAwADAAMACVAJUAlQCVAJUAlQCVAEwPMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAA//8EAAQABAAEAAQABAAEAAQABAANAAMAAQABAAIABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACgATABcAHgAbABoAHgAXABYAEgAeABsAGAAPABgAHABLAEsASwBLAEsASwBLAEsASwBLABgAGAAeAB4AHgATAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAGwASAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWAA0AEQAeAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAFAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJABYAGgAbABsAGwAeAB0AHQAeAE8AFwAeAA0AHgAeABoAGwBPAE8ADgBQAB0AHQAdAE8ATwAXAE8ATwBPABYAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwBWAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsABAAbABsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUAAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEAA0ADQBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABABQACsAKwArACsAKwArACsAKwAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUAAaABoAUABQAFAAUABQAEwAHgAbAFAAHgAEACsAKwAEAAQABAArAFAAUABQAFAAUABQACsAKwArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQACsAUABQACsAKwAEACsABAAEAAQABAAEACsAKwArACsABAAEACsAKwAEAAQABAArACsAKwAEACsAKwArACsAKwArACsAUABQAFAAUAArAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAAQABABQAFAAUAAEAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAArACsAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AGwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAKwArACsAKwArAAQABAAEACsAKwArACsAUABQACsAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAAQAUAArAFAAUABQAFAAUABQACsAKwArAFAAUABQACsAUABQAFAAUAArACsAKwBQAFAAKwBQACsAUABQACsAKwArAFAAUAArACsAKwBQAFAAUAArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAArACsAKwAEAAQABAArAAQABAAEAAQAKwArAFAAKwArACsAKwArACsABAArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAHgAeAB4AHgAeAB4AGwAeACsAKwArACsAKwAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAUABQAFAAKwArACsAKwArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwAOAFAAUABQAFAAUABQAFAAHgBQAAQABAAEAA4AUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAKwArAAQAUAAEAAQABAAEAAQABAAEACsABAAEAAQAKwAEAAQABAAEACsAKwArACsAKwArACsABAAEACsAKwArACsAKwArACsAUAArAFAAUAAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwAEAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAXABcAFwAXABcACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAXAArAFwAXABcAFwAXABcAFwAXABcAFwAKgBcAFwAKgAqACoAKgAqACoAKgAqACoAXAArACsAXABcAFwAXABcACsAXAArACoAKgAqACoAKgAqACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwBcAFwAXABcAFAADgAOAA4ADgAeAA4ADgAJAA4ADgANAAkAEwATABMAEwATAAkAHgATAB4AHgAeAAQABAAeAB4AHgAeAB4AHgBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAADQAEAB4ABAAeAAQAFgARABYAEQAEAAQAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAAQABAAEAAQADQAEAAQAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAA0ADQAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeACsAHgAeAA4ADgANAA4AHgAeAB4AHgAeAAkACQArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgBcAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4AHgAeAB4AXABcAFwAXABcAFwAKgAqACoAKgBcAFwAXABcACoAKgAqAFwAKgAqACoAXABcACoAKgAqACoAKgAqACoAXABcAFwAKgAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwAKgBLAEsASwBLAEsASwBLAEsASwBLACoAKgAqACoAKgAqAFAAUABQAFAAUABQACsAUAArACsAKwArACsAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAKwBQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsABAAEAAQAHgANAB4AHgAeAB4AHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUAArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAWABEAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAANAA0AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUAArAAQABAArACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAA0ADQAVAFwADQAeAA0AGwBcACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwAeAB4AEwATAA0ADQAOAB4AEwATAB4ABAAEAAQACQArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAHgArACsAKwATABMASwBLAEsASwBLAEsASwBLAEsASwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAXABcAFwAXABcACsAKwArACsAKwArACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXAArACsAKwAqACoAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsAHgAeAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAqACoAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKwArAAQASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACoAKgAqACoAKgAqACoAXAAqACoAKgAqACoAKgArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABABQAFAAUABQAFAAUABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgANAA0ADQANAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwAeAB4AHgAeAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArAA0ADQANAA0ADQBLAEsASwBLAEsASwBLAEsASwBLACsAKwArAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0ADQBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUAAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArAAQABAAEAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAAQAUABQAFAAUABQAFAABABQAFAABAAEAAQAUAArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQACsAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQACsAKwAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQACsAHgAeAB4AHgAeAB4AHgAOAB4AKwANAA0ADQANAA0ADQANAAkADQANAA0ACAAEAAsABAAEAA0ACQANAA0ADAAdAB0AHgAXABcAFgAXABcAFwAWABcAHQAdAB4AHgAUABQAFAANAAEAAQAEAAQABAAEAAQACQAaABoAGgAaABoAGgAaABoAHgAXABcAHQAVABUAHgAeAB4AHgAeAB4AGAAWABEAFQAVABUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ADQAeAA0ADQANAA0AHgANAA0ADQAHAB4AHgAeAB4AKwAEAAQABAAEAAQABAAEAAQABAAEAFAAUAArACsATwBQAFAAUABQAFAAHgAeAB4AFgARAE8AUABPAE8ATwBPAFAAUABQAFAAUAAeAB4AHgAWABEAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArABsAGwAbABsAGwAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGgAbABsAGwAbABoAGwAbABoAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAFAAGgAeAB0AHgBQAB4AGgAeAB4AHgAeAB4AHgAeAB4AHgBPAB4AUAAbAB4AHgBQAFAAUABQAFAAHgAeAB4AHQAdAB4AUAAeAFAAHgBQAB4AUABPAFAAUAAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAHgBQAFAAUABQAE8ATwBQAFAAUABQAFAATwBQAFAATwBQAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAUABQAFAATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABPAB4AHgArACsAKwArAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAdAB4AHgAeAB0AHQAeAB4AHQAeAB4AHgAdAB4AHQAbABsAHgAdAB4AHgAeAB4AHQAeAB4AHQAdAB0AHQAeAB4AHQAeAB0AHgAdAB0AHQAdAB0AHQAeAB0AHgAeAB4AHgAeAB0AHQAdAB0AHgAeAB4AHgAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB0AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAdAB0AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAHgAeAB4AHgAeAB4AHQAeAB4AHgAeAB4AHgAeACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAFAAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHQAdAB0AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHQAdAB4AHgAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AJQAlAB0AHQAlAB4AJQAlACUAIAAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAeAB4AHgAeAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAeAB0AJQAdAB0AHgAdAB0AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAdAB0AHQAdACUAHgAlACUAJQAdACUAJQAdAB0AHQAlACUAHQAdACUAHQAdACUAJQAlAB4AHQAeAB4AHgAeAB0AHQAlAB0AHQAdAB0AHQAdACUAJQAlACUAJQAdACUAJQAgACUAHQAdACUAJQAlACUAJQAlACUAJQAeAB4AHgAlACUAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AFwAXABcAFwAXABcAHgATABMAJQAeAB4AHgAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARABYAEQAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANAA0AHgANAB4ADQANAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwAlACUAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACsAKwArACsAKwArACsAKwArACsAKwArAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBPAE8ATwBPAE8ATwBPAE8AJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeAAQAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUABQAAQAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUAANAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAUABQAFAAUABQAAQABAAEACsABAAEACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAKwBQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAA0ADQANAA0ADQANAA0ADQAeACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAArACsAKwArAFAAUABQAFAAUAANAA0ADQANAA0ADQAUACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQANAA0ADQANAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAANACsAKwBQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAB4AHgAeAB4AHgArACsAKwArACsAKwAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwAeACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANAFAABAAEAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAEAAQABAAEAB4ABAAEAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQACsABAAEAFAABAAEAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLAA0ADQArAB4ABABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAFAAUAAeAFAAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAAEAAQADgANAA0AEwATAB4AHgAeAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAFAAUABQAFAABAAEACsAKwAEAA0ADQAeAFAAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcAFwADQANAA0AKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQAKwAEAAQAKwArAAQABAAEAAQAUAAEAFAABAAEAA0ADQANACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABABQAA4AUAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANAFAADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAUAArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAaABoAGgAaAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAJAAkACQAJAAkACQAJABYAEQArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AHgAeACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwAEAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAARwBHABUARwAJACsAKwArACsAKwArACsAKwArACsAKwAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAKwArACsAKwArACsAKwArACsAKwArACsAKwBRAFEAUQBRACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUAArACsAHgAEAAQADQAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAeAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQAHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAKwArAFAAKwArAFAAUAArACsAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAHgAeAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeACsAKwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4ABAAeAB4AHgAeAB4AHgAeAB4AHgAeAAQAHgAeAA0ADQANAA0AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArAAQABAAEAAQABAAEAAQAKwAEAAQAKwAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAEAAQABAAEAAQABAAEAFAAUABQAFAAUABQAFAAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwBQAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArABsAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAB4AHgAeAB4ABAAEAAQABAAEAAQABABQACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArABYAFgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAGgBQAFAAUAAaAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUAArACsAKwArACsAKwBQACsAKwArACsAUAArAFAAKwBQACsAUABQAFAAKwBQAFAAKwBQACsAKwBQACsAUAArAFAAKwBQACsAUAArAFAAUAArAFAAKwArAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAUABQAFAAKwBQACsAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAKwBQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeACUAJQAlAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAHgAlACUAJQAlACUAIAAgACAAJQAlACAAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACEAIQAhACEAIQAlACUAIAAgACUAJQAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAlACUAJQAlACAAIAAgACUAIAAgACAAJQAlACUAJQAlACUAJQAgACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAlAB4AJQAeACUAJQAlACUAJQAgACUAJQAlACUAHgAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACAAIAAgACAAIAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABcAFwAXABUAFQAVAB4AHgAeAB4AJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAgACUAJQAgACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAgACAAIAAgACAAIAAgACAAIAAgACUAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAlACAAIAAlACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAgACAAIAAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAA==",sf=50,aC=1,Zh=2,jh=3,oC=4,lC=5,af=7,$h=8,of=9,vn=10,Gl=11,lf=12,Vl=13,cC=14,mr=15,Kl=16,Cs=17,lr=18,uC=19,cf=20,kl=21,cr=22,To=23,xi=24,oA=25,Br=26,vr=27,Ei=28,fC=29,Kn=30,hC=31,_s=32,xs=33,zl=34,Wl=35,Xl=36,br=37,Yl=38,$s=39,ea=40,bo=41,ed=42,dC=43,pC=[9001,65288],td="!",Xe="×",Es="÷",Jl=nC(sC),zA=[Kn,Xl],ql=[aC,Zh,jh,lC],Ad=[vn,$h],uf=[vr,Br],gC=ql.concat(Ad),ff=[Yl,$s,ea,zl,Wl],mC=[mr,Vl],BC=function(n,e){e===void 0&&(e="strict");var t=[],A=[],i=[];return n.forEach(function(r,s){var a=Jl.get(r);if(a>sf?(i.push(!0),a-=sf):i.push(!1),["normal","auto","loose"].indexOf(e)!==-1&&[8208,8211,12316,12448].indexOf(r)!==-1)return A.push(s),t.push(Kl);if(a===oC||a===Gl){if(s===0)return A.push(s),t.push(Kn);var o=t[s-1];return gC.indexOf(o)===-1?(A.push(A[s-1]),t.push(o)):(A.push(s),t.push(Kn))}if(A.push(s),a===hC)return t.push(e==="strict"?kl:br);if(a===ed||a===fC)return t.push(Kn);if(a===dC)return r>=131072&&r<=196605||r>=196608&&r<=262141?t.push(br):t.push(Kn);t.push(a)}),[A,t,i]},Qo=function(n,e,t,A){var i=A[t];if(Array.isArray(n)?n.indexOf(i)!==-1:n===i)for(var r=t;r<=A.length;){r++;var s=A[r];if(s===e)return!0;if(s!==vn)break}if(i===vn)for(var r=t;r>0;){r--;var a=A[r];if(Array.isArray(n)?n.indexOf(a)!==-1:n===a)for(var o=t;o<=A.length;){o++;var s=A[o];if(s===e)return!0;if(s!==vn)break}if(a!==vn)break}return!1},hf=function(n,e){for(var t=n;t>=0;){var A=e[t];if(A===vn)t--;else return A}return 0},vC=function(n,e,t,A,i){if(t[A]===0)return Xe;var r=A-1;if(Array.isArray(i)&&i[r]===!0)return Xe;var s=r-1,a=r+1,o=e[r],l=s>=0?e[s]:0,c=e[a];if(o===Zh&&c===jh)return Xe;if(ql.indexOf(o)!==-1)return td;if(ql.indexOf(c)!==-1||Ad.indexOf(c)!==-1)return Xe;if(hf(r,e)===$h)return Es;if(Jl.get(n[r])===Gl||(o===_s||o===xs)&&Jl.get(n[a])===Gl||o===af||c===af||o===of||[vn,Vl,mr].indexOf(o)===-1&&c===of||[Cs,lr,uC,xi,Ei].indexOf(c)!==-1||hf(r,e)===cr||Qo(To,cr,r,e)||Qo([Cs,lr],kl,r,e)||Qo(lf,lf,r,e))return Xe;if(o===vn)return Es;if(o===To||c===To)return Xe;if(c===Kl||o===Kl)return Es;if([Vl,mr,kl].indexOf(c)!==-1||o===cC||l===Xl&&mC.indexOf(o)!==-1||o===Ei&&c===Xl||c===cf||zA.indexOf(c)!==-1&&o===oA||zA.indexOf(o)!==-1&&c===oA||o===vr&&[br,_s,xs].indexOf(c)!==-1||[br,_s,xs].indexOf(o)!==-1&&c===Br||zA.indexOf(o)!==-1&&uf.indexOf(c)!==-1||uf.indexOf(o)!==-1&&zA.indexOf(c)!==-1||[vr,Br].indexOf(o)!==-1&&(c===oA||[cr,mr].indexOf(c)!==-1&&e[a+1]===oA)||[cr,mr].indexOf(o)!==-1&&c===oA||o===oA&&[oA,Ei,xi].indexOf(c)!==-1)return Xe;if([oA,Ei,xi,Cs,lr].indexOf(c)!==-1)for(var u=r;u>=0;){var f=e[u];if(f===oA)return Xe;if([Ei,xi].indexOf(f)!==-1)u--;else break}if([vr,Br].indexOf(c)!==-1)for(var u=[Cs,lr].indexOf(o)!==-1?s:r;u>=0;){var f=e[u];if(f===oA)return Xe;if([Ei,xi].indexOf(f)!==-1)u--;else break}if(Yl===o&&[Yl,$s,zl,Wl].indexOf(c)!==-1||[$s,zl].indexOf(o)!==-1&&[$s,ea].indexOf(c)!==-1||[ea,Wl].indexOf(o)!==-1&&c===ea||ff.indexOf(o)!==-1&&[cf,Br].indexOf(c)!==-1||ff.indexOf(c)!==-1&&o===vr||zA.indexOf(o)!==-1&&zA.indexOf(c)!==-1||o===xi&&zA.indexOf(c)!==-1||zA.concat(oA).indexOf(o)!==-1&&c===cr&&pC.indexOf(n[a])===-1||zA.concat(oA).indexOf(c)!==-1&&o===lr)return Xe;if(o===bo&&c===bo){for(var d=t[r],g=1;d>0&&(d--,e[d]===bo);)g++;if(g%2!==0)return Xe}return o===_s&&c===xs?Xe:Es},wC=function(n,e){e||(e={lineBreak:"normal",wordBreak:"normal"});var t=BC(n,e.lineBreak),A=t[0],i=t[1],r=t[2];(e.wordBreak==="break-all"||e.wordBreak==="break-word")&&(i=i.map(function(a){return[oA,Kn,ed].indexOf(a)!==-1?br:a}));var s=e.wordBreak==="keep-all"?r.map(function(a,o){return a&&n[o]>=19968&&n[o]<=40959}):void 0;return[A,i,s]},CC=function(){function n(e,t,A,i){this.codePoints=e,this.required=t===td,this.start=A,this.end=i}return n.prototype.slice=function(){return Ct.apply(void 0,this.codePoints.slice(this.start,this.end))},n}(),_C=function(n,e){var t=Ra(n),A=wC(t,e),i=A[0],r=A[1],s=A[2],a=t.length,o=0,l=0;return{next:function(){if(l>=a)return{done:!0,value:null};for(var c=Xe;l<a&&(c=vC(t,r,i,++l,s))===Xe;);if(c!==Xe||l===a){var u=new CC(t,c,o,l);return o=l,{value:u,done:!1}}return{done:!0,value:null}}}},xC=1,EC=2,Or=4,df=8,ha=10,pf=47,Er=92,yC=9,UC=32,ys=34,ur=61,MC=35,SC=36,FC=37,Us=39,Ms=40,fr=41,TC=95,AA=45,bC=33,QC=60,IC=62,LC=64,RC=91,DC=93,HC=61,PC=123,Ss=63,NC=125,gf=124,OC=126,GC=128,mf=65533,Io=42,Xn=43,VC=44,KC=58,kC=59,Qr=46,zC=0,WC=8,XC=11,YC=14,JC=31,qC=127,QA=-1,nd=48,id=97,rd=101,ZC=102,jC=117,$C=122,sd=65,ad=69,od=70,e_=85,t_=90,Xt=function(n){return n>=nd&&n<=57},A_=function(n){return n>=55296&&n<=57343},yi=function(n){return Xt(n)||n>=sd&&n<=od||n>=id&&n<=ZC},n_=function(n){return n>=id&&n<=$C},i_=function(n){return n>=sd&&n<=t_},r_=function(n){return n_(n)||i_(n)},s_=function(n){return n>=GC},Fs=function(n){return n===ha||n===yC||n===UC},da=function(n){return r_(n)||s_(n)||n===TC},Bf=function(n){return da(n)||Xt(n)||n===AA},a_=function(n){return n>=zC&&n<=WC||n===XC||n>=YC&&n<=JC||n===qC},pn=function(n,e){return n!==Er?!1:e!==ha},Ts=function(n,e,t){return n===AA?da(e)||pn(e,t):da(n)?!0:!!(n===Er&&pn(n,e))},Lo=function(n,e,t){return n===Xn||n===AA?Xt(e)?!0:e===Qr&&Xt(t):Xt(n===Qr?e:n)},o_=function(n){var e=0,t=1;(n[e]===Xn||n[e]===AA)&&(n[e]===AA&&(t=-1),e++);for(var A=[];Xt(n[e]);)A.push(n[e++]);var i=A.length?parseInt(Ct.apply(void 0,A),10):0;n[e]===Qr&&e++;for(var r=[];Xt(n[e]);)r.push(n[e++]);var s=r.length,a=s?parseInt(Ct.apply(void 0,r),10):0;(n[e]===ad||n[e]===rd)&&e++;var o=1;(n[e]===Xn||n[e]===AA)&&(n[e]===AA&&(o=-1),e++);for(var l=[];Xt(n[e]);)l.push(n[e++]);var c=l.length?parseInt(Ct.apply(void 0,l),10):0;return t*(i+a*Math.pow(10,-s))*Math.pow(10,o*c)},l_={type:2},c_={type:3},u_={type:4},f_={type:13},h_={type:8},d_={type:21},p_={type:9},g_={type:10},m_={type:11},B_={type:12},v_={type:14},bs={type:23},w_={type:1},C_={type:25},__={type:24},x_={type:26},E_={type:27},y_={type:28},U_={type:29},M_={type:31},Zl={type:32},ld=function(){function n(){this._value=[]}return n.prototype.write=function(e){this._value=this._value.concat(Ra(e))},n.prototype.read=function(){for(var e=[],t=this.consumeToken();t!==Zl;)e.push(t),t=this.consumeToken();return e},n.prototype.consumeToken=function(){var e=this.consumeCodePoint();switch(e){case ys:return this.consumeStringToken(ys);case MC:var t=this.peekCodePoint(0),A=this.peekCodePoint(1),i=this.peekCodePoint(2);if(Bf(t)||pn(A,i)){var r=Ts(t,A,i)?EC:xC,s=this.consumeName();return{type:5,value:s,flags:r}}break;case SC:if(this.peekCodePoint(0)===ur)return this.consumeCodePoint(),f_;break;case Us:return this.consumeStringToken(Us);case Ms:return l_;case fr:return c_;case Io:if(this.peekCodePoint(0)===ur)return this.consumeCodePoint(),v_;break;case Xn:if(Lo(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case VC:return u_;case AA:var a=e,o=this.peekCodePoint(0),l=this.peekCodePoint(1);if(Lo(a,o,l))return this.reconsumeCodePoint(e),this.consumeNumericToken();if(Ts(a,o,l))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();if(o===AA&&l===IC)return this.consumeCodePoint(),this.consumeCodePoint(),__;break;case Qr:if(Lo(e,this.peekCodePoint(0),this.peekCodePoint(1)))return this.reconsumeCodePoint(e),this.consumeNumericToken();break;case pf:if(this.peekCodePoint(0)===Io)for(this.consumeCodePoint();;){var c=this.consumeCodePoint();if(c===Io&&(c=this.consumeCodePoint(),c===pf))return this.consumeToken();if(c===QA)return this.consumeToken()}break;case KC:return x_;case kC:return E_;case QC:if(this.peekCodePoint(0)===bC&&this.peekCodePoint(1)===AA&&this.peekCodePoint(2)===AA)return this.consumeCodePoint(),this.consumeCodePoint(),C_;break;case LC:var u=this.peekCodePoint(0),f=this.peekCodePoint(1),d=this.peekCodePoint(2);if(Ts(u,f,d)){var s=this.consumeName();return{type:7,value:s}}break;case RC:return y_;case Er:if(pn(e,this.peekCodePoint(0)))return this.reconsumeCodePoint(e),this.consumeIdentLikeToken();break;case DC:return U_;case HC:if(this.peekCodePoint(0)===ur)return this.consumeCodePoint(),h_;break;case PC:return m_;case NC:return B_;case jC:case e_:var g=this.peekCodePoint(0),m=this.peekCodePoint(1);return g===Xn&&(yi(m)||m===Ss)&&(this.consumeCodePoint(),this.consumeUnicodeRangeToken()),this.reconsumeCodePoint(e),this.consumeIdentLikeToken();case gf:if(this.peekCodePoint(0)===ur)return this.consumeCodePoint(),p_;if(this.peekCodePoint(0)===gf)return this.consumeCodePoint(),d_;break;case OC:if(this.peekCodePoint(0)===ur)return this.consumeCodePoint(),g_;break;case QA:return Zl}return Fs(e)?(this.consumeWhiteSpace(),M_):Xt(e)?(this.reconsumeCodePoint(e),this.consumeNumericToken()):da(e)?(this.reconsumeCodePoint(e),this.consumeIdentLikeToken()):{type:6,value:Ct(e)}},n.prototype.consumeCodePoint=function(){var e=this._value.shift();return typeof e>"u"?-1:e},n.prototype.reconsumeCodePoint=function(e){this._value.unshift(e)},n.prototype.peekCodePoint=function(e){return e>=this._value.length?-1:this._value[e]},n.prototype.consumeUnicodeRangeToken=function(){for(var e=[],t=this.consumeCodePoint();yi(t)&&e.length<6;)e.push(t),t=this.consumeCodePoint();for(var A=!1;t===Ss&&e.length<6;)e.push(t),t=this.consumeCodePoint(),A=!0;if(A){var i=parseInt(Ct.apply(void 0,e.map(function(o){return o===Ss?nd:o})),16),r=parseInt(Ct.apply(void 0,e.map(function(o){return o===Ss?od:o})),16);return{type:30,start:i,end:r}}var s=parseInt(Ct.apply(void 0,e),16);if(this.peekCodePoint(0)===AA&&yi(this.peekCodePoint(1))){this.consumeCodePoint(),t=this.consumeCodePoint();for(var a=[];yi(t)&&a.length<6;)a.push(t),t=this.consumeCodePoint();var r=parseInt(Ct.apply(void 0,a),16);return{type:30,start:s,end:r}}else return{type:30,start:s,end:s}},n.prototype.consumeIdentLikeToken=function(){var e=this.consumeName();return e.toLowerCase()==="url"&&this.peekCodePoint(0)===Ms?(this.consumeCodePoint(),this.consumeUrlToken()):this.peekCodePoint(0)===Ms?(this.consumeCodePoint(),{type:19,value:e}):{type:20,value:e}},n.prototype.consumeUrlToken=function(){var e=[];if(this.consumeWhiteSpace(),this.peekCodePoint(0)===QA)return{type:22,value:""};var t=this.peekCodePoint(0);if(t===Us||t===ys){var A=this.consumeStringToken(this.consumeCodePoint());return A.type===0&&(this.consumeWhiteSpace(),this.peekCodePoint(0)===QA||this.peekCodePoint(0)===fr)?(this.consumeCodePoint(),{type:22,value:A.value}):(this.consumeBadUrlRemnants(),bs)}for(;;){var i=this.consumeCodePoint();if(i===QA||i===fr)return{type:22,value:Ct.apply(void 0,e)};if(Fs(i))return this.consumeWhiteSpace(),this.peekCodePoint(0)===QA||this.peekCodePoint(0)===fr?(this.consumeCodePoint(),{type:22,value:Ct.apply(void 0,e)}):(this.consumeBadUrlRemnants(),bs);if(i===ys||i===Us||i===Ms||a_(i))return this.consumeBadUrlRemnants(),bs;if(i===Er)if(pn(i,this.peekCodePoint(0)))e.push(this.consumeEscapedCodePoint());else return this.consumeBadUrlRemnants(),bs;else e.push(i)}},n.prototype.consumeWhiteSpace=function(){for(;Fs(this.peekCodePoint(0));)this.consumeCodePoint()},n.prototype.consumeBadUrlRemnants=function(){for(;;){var e=this.consumeCodePoint();if(e===fr||e===QA)return;pn(e,this.peekCodePoint(0))&&this.consumeEscapedCodePoint()}},n.prototype.consumeStringSlice=function(e){for(var t=5e4,A="";e>0;){var i=Math.min(t,e);A+=Ct.apply(void 0,this._value.splice(0,i)),e-=i}return this._value.shift(),A},n.prototype.consumeStringToken=function(e){var t="",A=0;do{var i=this._value[A];if(i===QA||i===void 0||i===e)return t+=this.consumeStringSlice(A),{type:0,value:t};if(i===ha)return this._value.splice(0,A),w_;if(i===Er){var r=this._value[A+1];r!==QA&&r!==void 0&&(r===ha?(t+=this.consumeStringSlice(A),A=-1,this._value.shift()):pn(i,r)&&(t+=this.consumeStringSlice(A),t+=Ct(this.consumeEscapedCodePoint()),A=-1))}A++}while(!0)},n.prototype.consumeNumber=function(){var e=[],t=Or,A=this.peekCodePoint(0);for((A===Xn||A===AA)&&e.push(this.consumeCodePoint());Xt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0);var i=this.peekCodePoint(1);if(A===Qr&&Xt(i))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=df;Xt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());A=this.peekCodePoint(0),i=this.peekCodePoint(1);var r=this.peekCodePoint(2);if((A===ad||A===rd)&&((i===Xn||i===AA)&&Xt(r)||Xt(i)))for(e.push(this.consumeCodePoint(),this.consumeCodePoint()),t=df;Xt(this.peekCodePoint(0));)e.push(this.consumeCodePoint());return[o_(e),t]},n.prototype.consumeNumericToken=function(){var e=this.consumeNumber(),t=e[0],A=e[1],i=this.peekCodePoint(0),r=this.peekCodePoint(1),s=this.peekCodePoint(2);if(Ts(i,r,s)){var a=this.consumeName();return{type:15,number:t,flags:A,unit:a}}return i===FC?(this.consumeCodePoint(),{type:16,number:t,flags:A}):{type:17,number:t,flags:A}},n.prototype.consumeEscapedCodePoint=function(){var e=this.consumeCodePoint();if(yi(e)){for(var t=Ct(e);yi(this.peekCodePoint(0))&&t.length<6;)t+=Ct(this.consumeCodePoint());Fs(this.peekCodePoint(0))&&this.consumeCodePoint();var A=parseInt(t,16);return A===0||A_(A)||A>1114111?mf:A}return e===QA?mf:e},n.prototype.consumeName=function(){for(var e="";;){var t=this.consumeCodePoint();if(Bf(t))e+=Ct(t);else if(pn(t,this.peekCodePoint(0)))e+=Ct(this.consumeEscapedCodePoint());else return this.reconsumeCodePoint(t),e}},n}(),cd=function(){function n(e){this._tokens=e}return n.create=function(e){var t=new ld;return t.write(e),new n(t.read())},n.parseValue=function(e){return n.create(e).parseComponentValue()},n.parseValues=function(e){return n.create(e).parseComponentValues()},n.prototype.parseComponentValue=function(){for(var e=this.consumeToken();e.type===31;)e=this.consumeToken();if(e.type===32)throw new SyntaxError("Error parsing CSS component value, unexpected EOF");this.reconsumeToken(e);var t=this.consumeComponentValue();do e=this.consumeToken();while(e.type===31);if(e.type===32)return t;throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one")},n.prototype.parseComponentValues=function(){for(var e=[];;){var t=this.consumeComponentValue();if(t.type===32)return e;e.push(t),e.push()}},n.prototype.consumeComponentValue=function(){var e=this.consumeToken();switch(e.type){case 11:case 28:case 2:return this.consumeSimpleBlock(e.type);case 19:return this.consumeFunction(e)}return e},n.prototype.consumeSimpleBlock=function(e){for(var t={type:e,values:[]},A=this.consumeToken();;){if(A.type===32||F_(A,e))return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue()),A=this.consumeToken()}},n.prototype.consumeFunction=function(e){for(var t={name:e.value,values:[],type:18};;){var A=this.consumeToken();if(A.type===32||A.type===3)return t;this.reconsumeToken(A),t.values.push(this.consumeComponentValue())}},n.prototype.consumeToken=function(){var e=this._tokens.shift();return typeof e>"u"?Zl:e},n.prototype.reconsumeToken=function(e){this._tokens.unshift(e)},n}(),Gr=function(n){return n.type===15},$i=function(n){return n.type===17},nt=function(n){return n.type===20},S_=function(n){return n.type===0},jl=function(n,e){return nt(n)&&n.value===e},ud=function(n){return n.type!==31},qi=function(n){return n.type!==31&&n.type!==4},HA=function(n){var e=[],t=[];return n.forEach(function(A){if(A.type===4){if(t.length===0)throw new Error("Error parsing function args, zero tokens for arg");e.push(t),t=[];return}A.type!==31&&t.push(A)}),t.length&&e.push(t),e},F_=function(n,e){return e===11&&n.type===12||e===28&&n.type===29?!0:e===2&&n.type===3},Tn=function(n){return n.type===17||n.type===15},St=function(n){return n.type===16||Tn(n)},fd=function(n){return n.length>1?[n[0],n[1]]:[n[0]]},Vt={type:17,number:0,flags:Or},Fc={type:16,number:50,flags:Or},wn={type:16,number:100,flags:Or},wr=function(n,e,t){var A=n[0],i=n[1];return[rt(A,e),rt(typeof i<"u"?i:A,t)]},rt=function(n,e){if(n.type===16)return n.number/100*e;if(Gr(n))switch(n.unit){case"rem":case"em":return 16*n.number;case"px":default:return n.number}return n.number},hd="deg",dd="grad",pd="rad",gd="turn",Da={name:"angle",parse:function(n,e){if(e.type===15)switch(e.unit){case hd:return Math.PI*e.number/180;case dd:return Math.PI/200*e.number;case pd:return e.number;case gd:return Math.PI*2*e.number}throw new Error("Unsupported angle type")}},md=function(n){return n.type===15&&(n.unit===hd||n.unit===dd||n.unit===pd||n.unit===gd)},Bd=function(n){var e=n.filter(nt).map(function(t){return t.value}).join(" ");switch(e){case"to bottom right":case"to right bottom":case"left top":case"top left":return[Vt,Vt];case"to top":case"bottom":return _A(0);case"to bottom left":case"to left bottom":case"right top":case"top right":return[Vt,wn];case"to right":case"left":return _A(90);case"to top left":case"to left top":case"right bottom":case"bottom right":return[wn,wn];case"to bottom":case"top":return _A(180);case"to top right":case"to right top":case"left bottom":case"bottom left":return[wn,Vt];case"to left":case"right":return _A(270)}return 0},_A=function(n){return Math.PI*n/180},En={name:"color",parse:function(n,e){if(e.type===18){var t=T_[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported color function "'+e.name+'"');return t(n,e.values)}if(e.type===5){if(e.value.length===3){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3);return Cn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),1)}if(e.value.length===4){var A=e.value.substring(0,1),i=e.value.substring(1,2),r=e.value.substring(2,3),s=e.value.substring(3,4);return Cn(parseInt(A+A,16),parseInt(i+i,16),parseInt(r+r,16),parseInt(s+s,16)/255)}if(e.value.length===6){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6);return Cn(parseInt(A,16),parseInt(i,16),parseInt(r,16),1)}if(e.value.length===8){var A=e.value.substring(0,2),i=e.value.substring(2,4),r=e.value.substring(4,6),s=e.value.substring(6,8);return Cn(parseInt(A,16),parseInt(i,16),parseInt(r,16),parseInt(s,16)/255)}}if(e.type===20){var a=$A[e.value.toUpperCase()];if(typeof a<"u")return a}return $A.TRANSPARENT}},yn=function(n){return(255&n)===0},Dt=function(n){var e=255&n,t=255&n>>8,A=255&n>>16,i=255&n>>24;return e<255?"rgba("+i+","+A+","+t+","+e/255+")":"rgb("+i+","+A+","+t+")"},Cn=function(n,e,t,A){return(n<<24|e<<16|t<<8|Math.round(A*255)<<0)>>>0},vf=function(n,e){if(n.type===17)return n.number;if(n.type===16){var t=e===3?1:255;return e===3?n.number/100*t:Math.round(n.number/100*t)}return 0},wf=function(n,e){var t=e.filter(qi);if(t.length===3){var A=t.map(vf),i=A[0],r=A[1],s=A[2];return Cn(i,r,s,1)}if(t.length===4){var a=t.map(vf),i=a[0],r=a[1],s=a[2],o=a[3];return Cn(i,r,s,o)}return 0};function Ro(n,e,t){return t<0&&(t+=1),t>=1&&(t-=1),t<1/6?(e-n)*t*6+n:t<1/2?e:t<2/3?(e-n)*6*(2/3-t)+n:n}var Cf=function(n,e){var t=e.filter(qi),A=t[0],i=t[1],r=t[2],s=t[3],a=(A.type===17?_A(A.number):Da.parse(n,A))/(Math.PI*2),o=St(i)?i.number/100:0,l=St(r)?r.number/100:0,c=typeof s<"u"&&St(s)?rt(s,1):1;if(o===0)return Cn(l*255,l*255,l*255,1);var u=l<=.5?l*(o+1):l+o-l*o,f=l*2-u,d=Ro(f,u,a+1/3),g=Ro(f,u,a),m=Ro(f,u,a-1/3);return Cn(d*255,g*255,m*255,c)},T_={hsl:Cf,hsla:Cf,rgb:wf,rgba:wf},yr=function(n,e){return En.parse(n,cd.create(e).parseComponentValue())},$A={ALICEBLUE:4042850303,ANTIQUEWHITE:4209760255,AQUA:16777215,AQUAMARINE:2147472639,AZURE:4043309055,BEIGE:4126530815,BISQUE:4293182719,BLACK:255,BLANCHEDALMOND:4293643775,BLUE:65535,BLUEVIOLET:2318131967,BROWN:2771004159,BURLYWOOD:3736635391,CADETBLUE:1604231423,CHARTREUSE:2147418367,CHOCOLATE:3530104575,CORAL:4286533887,CORNFLOWERBLUE:1687547391,CORNSILK:4294499583,CRIMSON:3692313855,CYAN:16777215,DARKBLUE:35839,DARKCYAN:9145343,DARKGOLDENROD:3095837695,DARKGRAY:2846468607,DARKGREEN:6553855,DARKGREY:2846468607,DARKKHAKI:3182914559,DARKMAGENTA:2332068863,DARKOLIVEGREEN:1433087999,DARKORANGE:4287365375,DARKORCHID:2570243327,DARKRED:2332033279,DARKSALMON:3918953215,DARKSEAGREEN:2411499519,DARKSLATEBLUE:1211993087,DARKSLATEGRAY:793726975,DARKSLATEGREY:793726975,DARKTURQUOISE:13554175,DARKVIOLET:2483082239,DEEPPINK:4279538687,DEEPSKYBLUE:12582911,DIMGRAY:1768516095,DIMGREY:1768516095,DODGERBLUE:512819199,FIREBRICK:2988581631,FLORALWHITE:4294635775,FORESTGREEN:579543807,FUCHSIA:4278255615,GAINSBORO:3705462015,GHOSTWHITE:4177068031,GOLD:4292280575,GOLDENROD:3668254975,GRAY:2155905279,GREEN:8388863,GREENYELLOW:2919182335,GREY:2155905279,HONEYDEW:4043305215,HOTPINK:4285117695,INDIANRED:3445382399,INDIGO:1258324735,IVORY:4294963455,KHAKI:4041641215,LAVENDER:3873897215,LAVENDERBLUSH:4293981695,LAWNGREEN:2096890111,LEMONCHIFFON:4294626815,LIGHTBLUE:2916673279,LIGHTCORAL:4034953471,LIGHTCYAN:3774873599,LIGHTGOLDENRODYELLOW:4210742015,LIGHTGRAY:3553874943,LIGHTGREEN:2431553791,LIGHTGREY:3553874943,LIGHTPINK:4290167295,LIGHTSALMON:4288707327,LIGHTSEAGREEN:548580095,LIGHTSKYBLUE:2278488831,LIGHTSLATEGRAY:2005441023,LIGHTSLATEGREY:2005441023,LIGHTSTEELBLUE:2965692159,LIGHTYELLOW:4294959359,LIME:16711935,LIMEGREEN:852308735,LINEN:4210091775,MAGENTA:4278255615,MAROON:2147483903,MEDIUMAQUAMARINE:1724754687,MEDIUMBLUE:52735,MEDIUMORCHID:3126187007,MEDIUMPURPLE:2473647103,MEDIUMSEAGREEN:1018393087,MEDIUMSLATEBLUE:2070474495,MEDIUMSPRINGGREEN:16423679,MEDIUMTURQUOISE:1221709055,MEDIUMVIOLETRED:3340076543,MIDNIGHTBLUE:421097727,MINTCREAM:4127193855,MISTYROSE:4293190143,MOCCASIN:4293178879,NAVAJOWHITE:4292783615,NAVY:33023,OLDLACE:4260751103,OLIVE:2155872511,OLIVEDRAB:1804477439,ORANGE:4289003775,ORANGERED:4282712319,ORCHID:3664828159,PALEGOLDENROD:4008225535,PALEGREEN:2566625535,PALETURQUOISE:2951671551,PALEVIOLETRED:3681588223,PAPAYAWHIP:4293907967,PEACHPUFF:4292524543,PERU:3448061951,PINK:4290825215,PLUM:3718307327,POWDERBLUE:2967529215,PURPLE:2147516671,REBECCAPURPLE:1714657791,RED:4278190335,ROSYBROWN:3163525119,ROYALBLUE:1097458175,SADDLEBROWN:2336560127,SALMON:4202722047,SANDYBROWN:4104413439,SEAGREEN:780883967,SEASHELL:4294307583,SIENNA:2689740287,SILVER:3233857791,SKYBLUE:2278484991,SLATEBLUE:1784335871,SLATEGRAY:1887473919,SLATEGREY:1887473919,SNOW:4294638335,SPRINGGREEN:16744447,STEELBLUE:1182971135,TAN:3535047935,TEAL:8421631,THISTLE:3636451583,TOMATO:4284696575,TRANSPARENT:0,TURQUOISE:1088475391,VIOLET:4001558271,WHEAT:4125012991,WHITE:4294967295,WHITESMOKE:4126537215,YELLOW:4294902015,YELLOWGREEN:2597139199},b_={name:"background-clip",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(nt(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},Q_={name:"background-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Ha=function(n,e){var t=En.parse(n,e[0]),A=e[1];return A&&St(A)?{color:t,stop:A}:{color:t,stop:null}},_f=function(n,e){var t=n[0],A=n[n.length-1];t.stop===null&&(t.stop=Vt),A.stop===null&&(A.stop=wn);for(var i=[],r=0,s=0;s<n.length;s++){var a=n[s].stop;if(a!==null){var o=rt(a,e);o>r?i.push(o):i.push(r),r=o}else i.push(null)}for(var l=null,s=0;s<i.length;s++){var c=i[s];if(c===null)l===null&&(l=s);else if(l!==null){for(var u=s-l,f=i[l-1],d=(c-f)/(u+1),g=1;g<=u;g++)i[l+g-1]=d*g;l=null}}return n.map(function(m,p){var h=m.color;return{color:h,stop:Math.max(Math.min(1,i[p]/e),0)}})},I_=function(n,e,t){var A=e/2,i=t/2,r=rt(n[0],e)-A,s=i-rt(n[1],t);return(Math.atan2(s,r)+Math.PI*2)%(Math.PI*2)},L_=function(n,e,t){var A=typeof n=="number"?n:I_(n,e,t),i=Math.abs(e*Math.sin(A))+Math.abs(t*Math.cos(A)),r=e/2,s=t/2,a=i/2,o=Math.sin(A-Math.PI/2)*a,l=Math.cos(A-Math.PI/2)*a;return[i,r-l,r+l,s-o,s+o]},SA=function(n,e){return Math.sqrt(n*n+e*e)},xf=function(n,e,t,A,i){var r=[[0,0],[0,e],[n,0],[n,e]];return r.reduce(function(s,a){var o=a[0],l=a[1],c=SA(t-o,A-l);return(i?c<s.optimumDistance:c>s.optimumDistance)?{optimumCorner:a,optimumDistance:c}:s},{optimumDistance:i?1/0:-1/0,optimumCorner:null}).optimumCorner},R_=function(n,e,t,A,i){var r=0,s=0;switch(n.size){case 0:n.shape===0?r=s=Math.min(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.min(Math.abs(e),Math.abs(e-A)),s=Math.min(Math.abs(t),Math.abs(t-i)));break;case 2:if(n.shape===0)r=s=Math.min(SA(e,t),SA(e,t-i),SA(e-A,t),SA(e-A,t-i));else if(n.shape===1){var a=Math.min(Math.abs(t),Math.abs(t-i))/Math.min(Math.abs(e),Math.abs(e-A)),o=xf(A,i,e,t,!0),l=o[0],c=o[1];r=SA(l-e,(c-t)/a),s=a*r}break;case 1:n.shape===0?r=s=Math.max(Math.abs(e),Math.abs(e-A),Math.abs(t),Math.abs(t-i)):n.shape===1&&(r=Math.max(Math.abs(e),Math.abs(e-A)),s=Math.max(Math.abs(t),Math.abs(t-i)));break;case 3:if(n.shape===0)r=s=Math.max(SA(e,t),SA(e,t-i),SA(e-A,t),SA(e-A,t-i));else if(n.shape===1){var a=Math.max(Math.abs(t),Math.abs(t-i))/Math.max(Math.abs(e),Math.abs(e-A)),u=xf(A,i,e,t,!1),l=u[0],c=u[1];r=SA(l-e,(c-t)/a),s=a*r}break}return Array.isArray(n.size)&&(r=rt(n.size[0],A),s=n.size.length===2?rt(n.size[1],i):r),[r,s]},D_=function(n,e){var t=_A(180),A=[];return HA(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&s.value==="to"){t=Bd(i);return}else if(md(s)){t=Da.parse(n,s);return}}var a=Ha(n,i);A.push(a)}),{angle:t,stops:A,type:1}},Qs=function(n,e){var t=_A(180),A=[];return HA(e).forEach(function(i,r){if(r===0){var s=i[0];if(s.type===20&&["top","left","right","bottom"].indexOf(s.value)!==-1){t=Bd(i);return}else if(md(s)){t=(Da.parse(n,s)+_A(270))%_A(360);return}}var a=Ha(n,i);A.push(a)}),{angle:t,stops:A,type:1}},H_=function(n,e){var t=_A(180),A=[],i=1,r=0,s=3,a=[];return HA(e).forEach(function(o,l){var c=o[0];if(l===0){if(nt(c)&&c.value==="linear"){i=1;return}else if(nt(c)&&c.value==="radial"){i=2;return}}if(c.type===18){if(c.name==="from"){var u=En.parse(n,c.values[0]);A.push({stop:Vt,color:u})}else if(c.name==="to"){var u=En.parse(n,c.values[0]);A.push({stop:wn,color:u})}else if(c.name==="color-stop"){var f=c.values.filter(qi);if(f.length===2){var u=En.parse(n,f[1]),d=f[0];$i(d)&&A.push({stop:{type:16,number:d.number*100,flags:d.flags},color:u})}}}}),i===1?{angle:(t+_A(180))%_A(360),stops:A,type:i}:{size:s,shape:r,stops:A,position:a,type:i}},vd="closest-side",wd="farthest-side",Cd="closest-corner",_d="farthest-corner",xd="circle",Ed="ellipse",yd="cover",Ud="contain",P_=function(n,e){var t=0,A=3,i=[],r=[];return HA(e).forEach(function(s,a){var o=!0;if(a===0){var l=!1;o=s.reduce(function(u,f){if(l)if(nt(f))switch(f.value){case"center":return r.push(Fc),u;case"top":case"left":return r.push(Vt),u;case"right":case"bottom":return r.push(wn),u}else(St(f)||Tn(f))&&r.push(f);else if(nt(f))switch(f.value){case xd:return t=0,!1;case Ed:return t=1,!1;case"at":return l=!0,!1;case vd:return A=0,!1;case yd:case wd:return A=1,!1;case Ud:case Cd:return A=2,!1;case _d:return A=3,!1}else if(Tn(f)||St(f))return Array.isArray(A)||(A=[]),A.push(f),!1;return u},o)}if(o){var c=Ha(n,s);i.push(c)}}),{size:A,shape:t,stops:i,position:r,type:2}},Is=function(n,e){var t=0,A=3,i=[],r=[];return HA(e).forEach(function(s,a){var o=!0;if(a===0?o=s.reduce(function(c,u){if(nt(u))switch(u.value){case"center":return r.push(Fc),!1;case"top":case"left":return r.push(Vt),!1;case"right":case"bottom":return r.push(wn),!1}else if(St(u)||Tn(u))return r.push(u),!1;return c},o):a===1&&(o=s.reduce(function(c,u){if(nt(u))switch(u.value){case xd:return t=0,!1;case Ed:return t=1,!1;case Ud:case vd:return A=0,!1;case wd:return A=1,!1;case Cd:return A=2,!1;case yd:case _d:return A=3,!1}else if(Tn(u)||St(u))return Array.isArray(A)||(A=[]),A.push(u),!1;return c},o)),o){var l=Ha(n,s);i.push(l)}}),{size:A,shape:t,stops:i,position:r,type:2}},N_=function(n){return n.type===1},O_=function(n){return n.type===2},Tc={name:"image",parse:function(n,e){if(e.type===22){var t={url:e.value,type:0};return n.cache.addImage(e.value),t}if(e.type===18){var A=Md[e.name];if(typeof A>"u")throw new Error('Attempting to parse an unsupported image function "'+e.name+'"');return A(n,e.values)}throw new Error("Unsupported image type "+e.type)}};function G_(n){return!(n.type===20&&n.value==="none")&&(n.type!==18||!!Md[n.name])}var Md={"linear-gradient":D_,"-moz-linear-gradient":Qs,"-ms-linear-gradient":Qs,"-o-linear-gradient":Qs,"-webkit-linear-gradient":Qs,"radial-gradient":P_,"-moz-radial-gradient":Is,"-ms-radial-gradient":Is,"-o-radial-gradient":Is,"-webkit-radial-gradient":Is,"-webkit-gradient":H_},V_={name:"background-image",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e.filter(function(A){return qi(A)&&G_(A)}).map(function(A){return Tc.parse(n,A)})}},K_={name:"background-origin",initialValue:"border-box",prefix:!1,type:1,parse:function(n,e){return e.map(function(t){if(nt(t))switch(t.value){case"padding-box":return 1;case"content-box":return 2}return 0})}},k_={name:"background-position",initialValue:"0% 0%",type:1,prefix:!1,parse:function(n,e){return HA(e).map(function(t){return t.filter(St)}).map(fd)}},z_={name:"background-repeat",initialValue:"repeat",prefix:!1,type:1,parse:function(n,e){return HA(e).map(function(t){return t.filter(nt).map(function(A){return A.value}).join(" ")}).map(W_)}},W_=function(n){switch(n){case"no-repeat":return 1;case"repeat-x":case"repeat no-repeat":return 2;case"repeat-y":case"no-repeat repeat":return 3;case"repeat":default:return 0}},Gi;(function(n){n.AUTO="auto",n.CONTAIN="contain",n.COVER="cover"})(Gi||(Gi={}));var X_={name:"background-size",initialValue:"0",prefix:!1,type:1,parse:function(n,e){return HA(e).map(function(t){return t.filter(Y_)})}},Y_=function(n){return nt(n)||St(n)},Pa=function(n){return{name:"border-"+n+"-color",initialValue:"transparent",prefix:!1,type:3,format:"color"}},J_=Pa("top"),q_=Pa("right"),Z_=Pa("bottom"),j_=Pa("left"),Na=function(n){return{name:"border-radius-"+n,initialValue:"0 0",prefix:!1,type:1,parse:function(e,t){return fd(t.filter(St))}}},$_=Na("top-left"),ex=Na("top-right"),tx=Na("bottom-right"),Ax=Na("bottom-left"),Oa=function(n){return{name:"border-"+n+"-style",initialValue:"solid",prefix:!1,type:2,parse:function(e,t){switch(t){case"none":return 0;case"dashed":return 2;case"dotted":return 3;case"double":return 4}return 1}}},nx=Oa("top"),ix=Oa("right"),rx=Oa("bottom"),sx=Oa("left"),Ga=function(n){return{name:"border-"+n+"-width",initialValue:"0",type:0,prefix:!1,parse:function(e,t){return Gr(t)?t.number:0}}},ax=Ga("top"),ox=Ga("right"),lx=Ga("bottom"),cx=Ga("left"),ux={name:"color",initialValue:"transparent",prefix:!1,type:3,format:"color"},fx={name:"direction",initialValue:"ltr",prefix:!1,type:2,parse:function(n,e){switch(e){case"rtl":return 1;case"ltr":default:return 0}}},hx={name:"display",initialValue:"inline-block",prefix:!1,type:1,parse:function(n,e){return e.filter(nt).reduce(function(t,A){return t|dx(A.value)},0)}},dx=function(n){switch(n){case"block":case"-webkit-box":return 2;case"inline":return 4;case"run-in":return 8;case"flow":return 16;case"flow-root":return 32;case"table":return 64;case"flex":case"-webkit-flex":return 128;case"grid":case"-ms-grid":return 256;case"ruby":return 512;case"subgrid":return 1024;case"list-item":return 2048;case"table-row-group":return 4096;case"table-header-group":return 8192;case"table-footer-group":return 16384;case"table-row":return 32768;case"table-cell":return 65536;case"table-column-group":return 131072;case"table-column":return 262144;case"table-caption":return 524288;case"ruby-base":return 1048576;case"ruby-text":return 2097152;case"ruby-base-container":return 4194304;case"ruby-text-container":return 8388608;case"contents":return 16777216;case"inline-block":return 33554432;case"inline-list-item":return 67108864;case"inline-table":return 134217728;case"inline-flex":return 268435456;case"inline-grid":return 536870912}return 0},px={name:"float",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"left":return 1;case"right":return 2;case"inline-start":return 3;case"inline-end":return 4}return 0}},gx={name:"letter-spacing",initialValue:"0",prefix:!1,type:0,parse:function(n,e){return e.type===20&&e.value==="normal"?0:e.type===17||e.type===15?e.number:0}},pa;(function(n){n.NORMAL="normal",n.STRICT="strict"})(pa||(pa={}));var mx={name:"line-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"strict":return pa.STRICT;case"normal":default:return pa.NORMAL}}},Bx={name:"line-height",initialValue:"normal",prefix:!1,type:4},Ef=function(n,e){return nt(n)&&n.value==="normal"?1.2*e:n.type===17?e*n.number:St(n)?rt(n,e):e},vx={name:"list-style-image",initialValue:"none",type:0,prefix:!1,parse:function(n,e){return e.type===20&&e.value==="none"?null:Tc.parse(n,e)}},wx={name:"list-style-position",initialValue:"outside",prefix:!1,type:2,parse:function(n,e){switch(e){case"inside":return 0;case"outside":default:return 1}}},$l={name:"list-style-type",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"disc":return 0;case"circle":return 1;case"square":return 2;case"decimal":return 3;case"cjk-decimal":return 4;case"decimal-leading-zero":return 5;case"lower-roman":return 6;case"upper-roman":return 7;case"lower-greek":return 8;case"lower-alpha":return 9;case"upper-alpha":return 10;case"arabic-indic":return 11;case"armenian":return 12;case"bengali":return 13;case"cambodian":return 14;case"cjk-earthly-branch":return 15;case"cjk-heavenly-stem":return 16;case"cjk-ideographic":return 17;case"devanagari":return 18;case"ethiopic-numeric":return 19;case"georgian":return 20;case"gujarati":return 21;case"gurmukhi":return 22;case"hebrew":return 22;case"hiragana":return 23;case"hiragana-iroha":return 24;case"japanese-formal":return 25;case"japanese-informal":return 26;case"kannada":return 27;case"katakana":return 28;case"katakana-iroha":return 29;case"khmer":return 30;case"korean-hangul-formal":return 31;case"korean-hanja-formal":return 32;case"korean-hanja-informal":return 33;case"lao":return 34;case"lower-armenian":return 35;case"malayalam":return 36;case"mongolian":return 37;case"myanmar":return 38;case"oriya":return 39;case"persian":return 40;case"simp-chinese-formal":return 41;case"simp-chinese-informal":return 42;case"tamil":return 43;case"telugu":return 44;case"thai":return 45;case"tibetan":return 46;case"trad-chinese-formal":return 47;case"trad-chinese-informal":return 48;case"upper-armenian":return 49;case"disclosure-open":return 50;case"disclosure-closed":return 51;case"none":default:return-1}}},Va=function(n){return{name:"margin-"+n,initialValue:"0",prefix:!1,type:4}},Cx=Va("top"),_x=Va("right"),xx=Va("bottom"),Ex=Va("left"),yx={name:"overflow",initialValue:"visible",prefix:!1,type:1,parse:function(n,e){return e.filter(nt).map(function(t){switch(t.value){case"hidden":return 1;case"scroll":return 2;case"clip":return 3;case"auto":return 4;case"visible":default:return 0}})}},Ux={name:"overflow-wrap",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-word":return"break-word";case"normal":default:return"normal"}}},Ka=function(n){return{name:"padding-"+n,initialValue:"0",prefix:!1,type:3,format:"length-percentage"}},Mx=Ka("top"),Sx=Ka("right"),Fx=Ka("bottom"),Tx=Ka("left"),bx={name:"text-align",initialValue:"left",prefix:!1,type:2,parse:function(n,e){switch(e){case"right":return 2;case"center":case"justify":return 1;case"left":default:return 0}}},Qx={name:"position",initialValue:"static",prefix:!1,type:2,parse:function(n,e){switch(e){case"relative":return 1;case"absolute":return 2;case"fixed":return 3;case"sticky":return 4}return 0}},Ix={name:"text-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&jl(e[0],"none")?[]:HA(e).map(function(t){for(var A={color:$A.TRANSPARENT,offsetX:Vt,offsetY:Vt,blur:Vt},i=0,r=0;r<t.length;r++){var s=t[r];Tn(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:A.blur=s,i++):A.color=En.parse(n,s)}return A})}},Lx={name:"text-transform",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"uppercase":return 2;case"lowercase":return 1;case"capitalize":return 3}return 0}},Rx={name:"transform",initialValue:"none",prefix:!0,type:0,parse:function(n,e){if(e.type===20&&e.value==="none")return null;if(e.type===18){var t=Px[e.name];if(typeof t>"u")throw new Error('Attempting to parse an unsupported transform function "'+e.name+'"');return t(e.values)}return null}},Dx=function(n){var e=n.filter(function(t){return t.type===17}).map(function(t){return t.number});return e.length===6?e:null},Hx=function(n){var e=n.filter(function(o){return o.type===17}).map(function(o){return o.number}),t=e[0],A=e[1];e[2],e[3];var i=e[4],r=e[5];e[6],e[7],e[8],e[9],e[10],e[11];var s=e[12],a=e[13];return e[14],e[15],e.length===16?[t,A,i,r,s,a]:null},Px={matrix:Dx,matrix3d:Hx},yf={type:16,number:50,flags:Or},Nx=[yf,yf],Ox={name:"transform-origin",initialValue:"50% 50%",prefix:!0,type:1,parse:function(n,e){var t=e.filter(St);return t.length!==2?Nx:[t[0],t[1]]}},Gx={name:"visible",initialValue:"none",prefix:!1,type:2,parse:function(n,e){switch(e){case"hidden":return 1;case"collapse":return 2;case"visible":default:return 0}}},Ur;(function(n){n.NORMAL="normal",n.BREAK_ALL="break-all",n.KEEP_ALL="keep-all"})(Ur||(Ur={}));var Vx={name:"word-break",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"break-all":return Ur.BREAK_ALL;case"keep-all":return Ur.KEEP_ALL;case"normal":default:return Ur.NORMAL}}},Kx={name:"z-index",initialValue:"auto",prefix:!1,type:0,parse:function(n,e){if(e.type===20)return{auto:!0,order:0};if($i(e))return{auto:!1,order:e.number};throw new Error("Invalid z-index number parsed")}},Sd={name:"time",parse:function(n,e){if(e.type===15)switch(e.unit.toLowerCase()){case"s":return 1e3*e.number;case"ms":return e.number}throw new Error("Unsupported time type")}},kx={name:"opacity",initialValue:"1",type:0,prefix:!1,parse:function(n,e){return $i(e)?e.number:1}},zx={name:"text-decoration-color",initialValue:"transparent",prefix:!1,type:3,format:"color"},Wx={name:"text-decoration-line",initialValue:"none",prefix:!1,type:1,parse:function(n,e){return e.filter(nt).map(function(t){switch(t.value){case"underline":return 1;case"overline":return 2;case"line-through":return 3;case"none":return 4}return 0}).filter(function(t){return t!==0})}},Xx={name:"font-family",initialValue:"",prefix:!1,type:1,parse:function(n,e){var t=[],A=[];return e.forEach(function(i){switch(i.type){case 20:case 0:t.push(i.value);break;case 17:t.push(i.number.toString());break;case 4:A.push(t.join(" ")),t.length=0;break}}),t.length&&A.push(t.join(" ")),A.map(function(i){return i.indexOf(" ")===-1?i:"'"+i+"'"})}},Yx={name:"font-size",initialValue:"0",prefix:!1,type:3,format:"length"},Jx={name:"font-weight",initialValue:"normal",type:0,prefix:!1,parse:function(n,e){if($i(e))return e.number;if(nt(e))switch(e.value){case"bold":return 700;case"normal":default:return 400}return 400}},qx={name:"font-variant",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.filter(nt).map(function(t){return t.value})}},Zx={name:"font-style",initialValue:"normal",prefix:!1,type:2,parse:function(n,e){switch(e){case"oblique":return"oblique";case"italic":return"italic";case"normal":default:return"normal"}}},Qt=function(n,e){return(n&e)!==0},jx={name:"content",initialValue:"none",type:1,prefix:!1,parse:function(n,e){if(e.length===0)return[];var t=e[0];return t.type===20&&t.value==="none"?[]:e}},$x={name:"counter-increment",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;for(var A=[],i=e.filter(ud),r=0;r<i.length;r++){var s=i[r],a=i[r+1];if(s.type===20){var o=a&&$i(a)?a.number:1;A.push({counter:s.value,increment:o})}}return A}},eE={name:"counter-reset",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return[];for(var t=[],A=e.filter(ud),i=0;i<A.length;i++){var r=A[i],s=A[i+1];if(nt(r)&&r.value!=="none"){var a=s&&$i(s)?s.number:0;t.push({counter:r.value,reset:a})}}return t}},tE={name:"duration",initialValue:"0s",prefix:!1,type:1,parse:function(n,e){return e.filter(Gr).map(function(t){return Sd.parse(n,t)})}},AE={name:"quotes",initialValue:"none",prefix:!0,type:1,parse:function(n,e){if(e.length===0)return null;var t=e[0];if(t.type===20&&t.value==="none")return null;var A=[],i=e.filter(S_);if(i.length%2!==0)return null;for(var r=0;r<i.length;r+=2){var s=i[r].value,a=i[r+1].value;A.push({open:s,close:a})}return A}},Uf=function(n,e,t){if(!n)return"";var A=n[Math.min(e,n.length-1)];return A?t?A.open:A.close:""},nE={name:"box-shadow",initialValue:"none",type:1,prefix:!1,parse:function(n,e){return e.length===1&&jl(e[0],"none")?[]:HA(e).map(function(t){for(var A={color:255,offsetX:Vt,offsetY:Vt,blur:Vt,spread:Vt,inset:!1},i=0,r=0;r<t.length;r++){var s=t[r];jl(s,"inset")?A.inset=!0:Tn(s)?(i===0?A.offsetX=s:i===1?A.offsetY=s:i===2?A.blur=s:A.spread=s,i++):A.color=En.parse(n,s)}return A})}},iE={name:"paint-order",initialValue:"normal",prefix:!1,type:1,parse:function(n,e){var t=[0,1,2],A=[];return e.filter(nt).forEach(function(i){switch(i.value){case"stroke":A.push(1);break;case"fill":A.push(0);break;case"markers":A.push(2);break}}),t.forEach(function(i){A.indexOf(i)===-1&&A.push(i)}),A}},rE={name:"-webkit-text-stroke-color",initialValue:"currentcolor",prefix:!1,type:3,format:"color"},sE={name:"-webkit-text-stroke-width",initialValue:"0",type:0,prefix:!1,parse:function(n,e){return Gr(e)?e.number:0}},aE=function(){function n(e,t){var A,i;this.animationDuration=de(e,tE,t.animationDuration),this.backgroundClip=de(e,b_,t.backgroundClip),this.backgroundColor=de(e,Q_,t.backgroundColor),this.backgroundImage=de(e,V_,t.backgroundImage),this.backgroundOrigin=de(e,K_,t.backgroundOrigin),this.backgroundPosition=de(e,k_,t.backgroundPosition),this.backgroundRepeat=de(e,z_,t.backgroundRepeat),this.backgroundSize=de(e,X_,t.backgroundSize),this.borderTopColor=de(e,J_,t.borderTopColor),this.borderRightColor=de(e,q_,t.borderRightColor),this.borderBottomColor=de(e,Z_,t.borderBottomColor),this.borderLeftColor=de(e,j_,t.borderLeftColor),this.borderTopLeftRadius=de(e,$_,t.borderTopLeftRadius),this.borderTopRightRadius=de(e,ex,t.borderTopRightRadius),this.borderBottomRightRadius=de(e,tx,t.borderBottomRightRadius),this.borderBottomLeftRadius=de(e,Ax,t.borderBottomLeftRadius),this.borderTopStyle=de(e,nx,t.borderTopStyle),this.borderRightStyle=de(e,ix,t.borderRightStyle),this.borderBottomStyle=de(e,rx,t.borderBottomStyle),this.borderLeftStyle=de(e,sx,t.borderLeftStyle),this.borderTopWidth=de(e,ax,t.borderTopWidth),this.borderRightWidth=de(e,ox,t.borderRightWidth),this.borderBottomWidth=de(e,lx,t.borderBottomWidth),this.borderLeftWidth=de(e,cx,t.borderLeftWidth),this.boxShadow=de(e,nE,t.boxShadow),this.color=de(e,ux,t.color),this.direction=de(e,fx,t.direction),this.display=de(e,hx,t.display),this.float=de(e,px,t.cssFloat),this.fontFamily=de(e,Xx,t.fontFamily),this.fontSize=de(e,Yx,t.fontSize),this.fontStyle=de(e,Zx,t.fontStyle),this.fontVariant=de(e,qx,t.fontVariant),this.fontWeight=de(e,Jx,t.fontWeight),this.letterSpacing=de(e,gx,t.letterSpacing),this.lineBreak=de(e,mx,t.lineBreak),this.lineHeight=de(e,Bx,t.lineHeight),this.listStyleImage=de(e,vx,t.listStyleImage),this.listStylePosition=de(e,wx,t.listStylePosition),this.listStyleType=de(e,$l,t.listStyleType),this.marginTop=de(e,Cx,t.marginTop),this.marginRight=de(e,_x,t.marginRight),this.marginBottom=de(e,xx,t.marginBottom),this.marginLeft=de(e,Ex,t.marginLeft),this.opacity=de(e,kx,t.opacity);var r=de(e,yx,t.overflow);this.overflowX=r[0],this.overflowY=r[r.length>1?1:0],this.overflowWrap=de(e,Ux,t.overflowWrap),this.paddingTop=de(e,Mx,t.paddingTop),this.paddingRight=de(e,Sx,t.paddingRight),this.paddingBottom=de(e,Fx,t.paddingBottom),this.paddingLeft=de(e,Tx,t.paddingLeft),this.paintOrder=de(e,iE,t.paintOrder),this.position=de(e,Qx,t.position),this.textAlign=de(e,bx,t.textAlign),this.textDecorationColor=de(e,zx,(A=t.textDecorationColor)!==null&&A!==void 0?A:t.color),this.textDecorationLine=de(e,Wx,(i=t.textDecorationLine)!==null&&i!==void 0?i:t.textDecoration),this.textShadow=de(e,Ix,t.textShadow),this.textTransform=de(e,Lx,t.textTransform),this.transform=de(e,Rx,t.transform),this.transformOrigin=de(e,Ox,t.transformOrigin),this.visibility=de(e,Gx,t.visibility),this.webkitTextStrokeColor=de(e,rE,t.webkitTextStrokeColor),this.webkitTextStrokeWidth=de(e,sE,t.webkitTextStrokeWidth),this.wordBreak=de(e,Vx,t.wordBreak),this.zIndex=de(e,Kx,t.zIndex)}return n.prototype.isVisible=function(){return this.display>0&&this.opacity>0&&this.visibility===0},n.prototype.isTransparent=function(){return yn(this.backgroundColor)},n.prototype.isTransformed=function(){return this.transform!==null},n.prototype.isPositioned=function(){return this.position!==0},n.prototype.isPositionedWithZIndex=function(){return this.isPositioned()&&!this.zIndex.auto},n.prototype.isFloating=function(){return this.float!==0},n.prototype.isInlineLevel=function(){return Qt(this.display,4)||Qt(this.display,33554432)||Qt(this.display,268435456)||Qt(this.display,536870912)||Qt(this.display,67108864)||Qt(this.display,134217728)},n}(),oE=function(){function n(e,t){this.content=de(e,jx,t.content),this.quotes=de(e,AE,t.quotes)}return n}(),Mf=function(){function n(e,t){this.counterIncrement=de(e,$x,t.counterIncrement),this.counterReset=de(e,eE,t.counterReset)}return n}(),de=function(n,e,t){var A=new ld,i=t!==null&&typeof t<"u"?t.toString():e.initialValue;A.write(i);var r=new cd(A.read());switch(e.type){case 2:var s=r.parseComponentValue();return e.parse(n,nt(s)?s.value:e.initialValue);case 0:return e.parse(n,r.parseComponentValue());case 1:return e.parse(n,r.parseComponentValues());case 4:return r.parseComponentValue();case 3:switch(e.format){case"angle":return Da.parse(n,r.parseComponentValue());case"color":return En.parse(n,r.parseComponentValue());case"image":return Tc.parse(n,r.parseComponentValue());case"length":var a=r.parseComponentValue();return Tn(a)?a:Vt;case"length-percentage":var o=r.parseComponentValue();return St(o)?o:Vt;case"time":return Sd.parse(n,r.parseComponentValue())}break}},lE="data-html2canvas-debug",cE=function(n){var e=n.getAttribute(lE);switch(e){case"all":return 1;case"clone":return 2;case"parse":return 3;case"render":return 4;default:return 0}},ec=function(n,e){var t=cE(n);return t===1||e===t},PA=function(){function n(e,t){if(this.context=e,this.textNodes=[],this.elements=[],this.flags=0,ec(t,3))debugger;this.styles=new aE(e,window.getComputedStyle(t,null)),nc(t)&&(this.styles.animationDuration.some(function(A){return A>0})&&(t.style.animationDuration="0s"),this.styles.transform!==null&&(t.style.transform="none")),this.bounds=La(this.context,t),ec(t,4)&&(this.flags|=16)}return n}(),uE="AAAAAAAAAAAAEA4AGBkAAFAaAAACAAAAAAAIABAAGAAwADgACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAAQABIAEQATAAIABAACAAQAAgAEAAIABAAVABcAAgAEAAIABAACAAQAGAAaABwAHgAgACIAI4AlgAIABAAmwCjAKgAsAC2AL4AvQDFAMoA0gBPAVYBWgEIAAgACACMANoAYgFkAWwBdAF8AX0BhQGNAZUBlgGeAaMBlQGWAasBswF8AbsBwwF0AcsBYwHTAQgA2wG/AOMBdAF8AekB8QF0AfkB+wHiAHQBfAEIAAMC5gQIAAsCEgIIAAgAFgIeAggAIgIpAggAMQI5AkACygEIAAgASAJQAlgCYAIIAAgACAAKBQoFCgUTBRMFGQUrBSsFCAAIAAgACAAIAAgACAAIAAgACABdAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABoAmgCrwGvAQgAbgJ2AggAHgEIAAgACADnAXsCCAAIAAgAgwIIAAgACAAIAAgACACKAggAkQKZAggAPADJAAgAoQKkAqwCsgK6AsICCADJAggA0AIIAAgACAAIANYC3gIIAAgACAAIAAgACABAAOYCCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAkASoB+QIEAAgACAA8AEMCCABCBQgACABJBVAFCAAIAAgACAAIAAgACAAIAAgACABTBVoFCAAIAFoFCABfBWUFCAAIAAgACAAIAAgAbQUIAAgACAAIAAgACABzBXsFfQWFBYoFigWKBZEFigWKBYoFmAWfBaYFrgWxBbkFCAAIAAgACAAIAAgACAAIAAgACAAIAMEFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAMgFCADQBQgACAAIAAgACAAIAAgACAAIAAgACAAIAO4CCAAIAAgAiQAIAAgACABAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAD0AggACAD8AggACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIANYFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAMDvwAIAAgAJAIIAAgACAAIAAgACAAIAAgACwMTAwgACAB9BOsEGwMjAwgAKwMyAwsFYgE3A/MEPwMIAEUDTQNRAwgAWQOsAGEDCAAIAAgACAAIAAgACABpAzQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFOgU0BTUFNgU3BTgFOQU6BTQFNQU2BTcFOAU5BToFNAU1BTYFNwU4BTkFIQUoBSwFCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABtAwgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABMAEwACAAIAAgACAAIABgACAAIAAgACAC/AAgACAAyAQgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACAAIAAwAAgACAAIAAgACAAIAAgACAAIAAAARABIAAgACAAIABQASAAIAAgAIABwAEAAjgCIABsAqAC2AL0AigDQAtwC+IJIQqVAZUBWQqVAZUBlQGVAZUBlQGrC5UBlQGVAZUBlQGVAZUBlQGVAXsKlQGVAbAK6wsrDGUMpQzlDJUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAZUBlQGVAfAKAAuZA64AtwCJALoC6ADwAAgAuACgA/oEpgO6AqsD+AAIAAgAswMIAAgACAAIAIkAuwP5AfsBwwPLAwgACAAIAAgACADRA9kDCAAIAOED6QMIAAgACAAIAAgACADuA/YDCAAIAP4DyQAIAAgABgQIAAgAXQAOBAgACAAIAAgACAAIABMECAAIAAgACAAIAAgACAD8AAQBCAAIAAgAGgQiBCoECAExBAgAEAEIAAgACAAIAAgACAAIAAgACAAIAAgACAA4BAgACABABEYECAAIAAgATAQYAQgAVAQIAAgACAAIAAgACAAIAAgACAAIAFoECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAOQEIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAB+BAcACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAEABhgSMBAgACAAIAAgAlAQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAwAEAAQABAADAAMAAwADAAQABAAEAAQABAAEAAQABHATAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAdQMIAAgACAAIAAgACAAIAMkACAAIAAgAfQMIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACACFA4kDCAAIAAgACAAIAOcBCAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAIcDCAAIAAgACAAIAAgACAAIAAgACAAIAJEDCAAIAAgACADFAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABgBAgAZgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAbAQCBXIECAAIAHkECAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACABAAJwEQACjBKoEsgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAC6BMIECAAIAAgACAAIAAgACABmBAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAxwQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAGYECAAIAAgAzgQIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBd0FXwUIAOIF6gXxBYoF3gT5BQAGCAaKBYoFigWKBYoFigWKBYoFigWKBYoFigXWBIoFigWKBYoFigWKBYoFigWKBYsFEAaKBYoFigWKBYoFigWKBRQGCACKBYoFigWKBQgACAAIANEECAAIABgGigUgBggAJgYIAC4GMwaKBYoF0wQ3Bj4GigWKBYoFigWKBYoFigWKBYoFigWKBYoFigUIAAgACAAIAAgACAAIAAgAigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWKBYoFigWLBf///////wQABAAEAAQABAAEAAQABAAEAAQAAwAEAAQAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAQADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUAAAAFAAUAAAAFAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUAAQAAAAUABQAFAAUABQAFAAAAAAAFAAUAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAFAAUAAQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAAABwAHAAcAAAAHAAcABwAFAAEAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAcABwAFAAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAQABAAAAAAAAAAAAAAAFAAUABQAFAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAHAAcAAAAHAAcAAAAAAAUABQAHAAUAAQAHAAEABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwABAAUABQAFAAUAAAAAAAAAAAAAAAEAAQABAAEAAQABAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABQANAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAQABAAEAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAABQAHAAUABQAFAAAAAAAAAAcABQAFAAUABQAFAAQABAAEAAQABAAEAAQABAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUAAAAFAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAUAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAcABwAFAAcABwAAAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUABwAHAAUABQAFAAUAAAAAAAcABwAAAAAABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAABQAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAAAAAAAAAAABQAFAAAAAAAFAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAFAAUABQAFAAUAAAAFAAUABwAAAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABwAFAAUABQAFAAAAAAAHAAcAAAAAAAcABwAFAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAAAAAAAAAHAAcABwAAAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAABQAHAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAUABQAFAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAHAAcABQAHAAcAAAAFAAcABwAAAAcABwAFAAUAAAAAAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAFAAcABwAFAAUABQAAAAUAAAAHAAcABwAHAAcABwAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAHAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAABwAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAUAAAAFAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABwAFAAUABQAFAAUAAAAFAAUAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABwAFAAUABQAFAAUABQAAAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABQAFAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABQAFAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAHAAUABQAFAAUABQAFAAUABwAHAAcABwAHAAcABwAHAAUABwAHAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABwAHAAcABwAFAAUABwAHAAcAAAAAAAAAAAAHAAcABQAHAAcABwAHAAcABwAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAcABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAUABQAFAAUABQAFAAUAAAAFAAAABQAAAAAABQAFAAUABQAFAAUABQAFAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAFAAUAAAAAAAUABQAFAAUABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABwAFAAcABwAHAAcABwAFAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAUABQAFAAUABwAHAAUABQAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABQAFAAcABwAHAAUABwAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAcABQAFAAUABQAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAAAAAABwAFAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAAAAAAAAAFAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAUABQAHAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAUABQAFAAUABQAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAcABwAFAAUABQAFAAcABwAFAAUABwAHAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAFAAcABwAFAAUABwAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAFAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAFAAUABQAAAAAABQAFAAAAAAAAAAAAAAAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAcABwAAAAAAAAAAAAAABwAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAcABwAFAAcABwAAAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAFAAUABQAAAAUABQAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABwAFAAUABQAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAUABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAHAAcABQAHAAUABQAAAAAAAAAAAAAAAAAFAAAABwAHAAcABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAHAAcABwAAAAAABwAHAAAAAAAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABwAHAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAFAAUABwAFAAcABwAFAAcABQAFAAcABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAHAAcABQAFAAUABQAAAAAABwAHAAcABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAHAAUABQAFAAUABQAFAAUABQAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABwAFAAcABwAFAAUABQAFAAUABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAcABwAFAAUABQAFAAcABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAUABQAFAAUABQAHAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAFAAUABQAFAAAAAAAFAAUABwAHAAcABwAFAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABwAHAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAcABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAAAHAAUABQAFAAUABQAFAAUABwAFAAUABwAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUAAAAAAAAABQAAAAUABQAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAcABwAHAAcAAAAFAAUAAAAHAAcABQAHAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAAAAUABQAFAAAAAAAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAAAAABQAFAAUABQAFAAUABQAAAAUABQAAAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAUABQAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAFAAUABQAFAAUABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAFAAUABQAFAAUADgAOAA4ADgAOAA4ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAA8ADwAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAMAAwADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAAAAAAAAAAAAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAKAAoACgAAAAAAAAAAAAsADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwACwAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAADgAOAA4AAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAAAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4AAAAOAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAAAAAAAAAAAA4AAAAOAAAAAAAAAAAADgAOAA4AAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAA4ADgAOAA4ADgAOAA4ADgAOAAAADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4ADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAOAA4ADgAOAA4AAAAAAAAAAAAAAAAAAAAAAA4ADgAOAA4ADgAOAA4ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAOAA4ADgAOAA4ADgAAAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA4AAAAAAAAAAAA=",Sf="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Cr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Ls=0;Ls<Sf.length;Ls++)Cr[Sf.charCodeAt(Ls)]=Ls;var fE=function(n){var e=n.length*.75,t=n.length,A,i=0,r,s,a,o;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);var l=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u"&&typeof Uint8Array.prototype.slice<"u"?new ArrayBuffer(e):new Array(e),c=Array.isArray(l)?l:new Uint8Array(l);for(A=0;A<t;A+=4)r=Cr[n.charCodeAt(A)],s=Cr[n.charCodeAt(A+1)],a=Cr[n.charCodeAt(A+2)],o=Cr[n.charCodeAt(A+3)],c[i++]=r<<2|s>>4,c[i++]=(s&15)<<4|a>>2,c[i++]=(a&3)<<6|o&63;return l},hE=function(n){for(var e=n.length,t=[],A=0;A<e;A+=2)t.push(n[A+1]<<8|n[A]);return t},dE=function(n){for(var e=n.length,t=[],A=0;A<e;A+=4)t.push(n[A+3]<<24|n[A+2]<<16|n[A+1]<<8|n[A]);return t},qn=5,bc=11,Do=2,pE=bc-qn,Fd=65536>>qn,gE=1<<qn,Ho=gE-1,mE=1024>>qn,BE=Fd+mE,vE=BE,wE=32,CE=vE+wE,_E=65536>>bc,xE=1<<pE,EE=xE-1,Ff=function(n,e,t){return n.slice?n.slice(e,t):new Uint16Array(Array.prototype.slice.call(n,e,t))},yE=function(n,e,t){return n.slice?n.slice(e,t):new Uint32Array(Array.prototype.slice.call(n,e,t))},UE=function(n,e){var t=fE(n),A=Array.isArray(t)?dE(t):new Uint32Array(t),i=Array.isArray(t)?hE(t):new Uint16Array(t),r=24,s=Ff(i,r/2,A[4]/2),a=A[5]===2?Ff(i,(r+A[4])/2):yE(A,Math.ceil((r+A[4])/4));return new ME(A[0],A[1],A[2],A[3],s,a)},ME=function(){function n(e,t,A,i,r,s){this.initialValue=e,this.errorValue=t,this.highStart=A,this.highValueIndex=i,this.index=r,this.data=s}return n.prototype.get=function(e){var t;if(e>=0){if(e<55296||e>56319&&e<=65535)return t=this.index[e>>qn],t=(t<<Do)+(e&Ho),this.data[t];if(e<=65535)return t=this.index[Fd+(e-55296>>qn)],t=(t<<Do)+(e&Ho),this.data[t];if(e<this.highStart)return t=CE-_E+(e>>bc),t=this.index[t],t+=e>>qn&EE,t=this.index[t],t=(t<<Do)+(e&Ho),this.data[t];if(e<=1114111)return this.data[this.highValueIndex]}return this.errorValue},n}(),Tf="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",SE=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(var Rs=0;Rs<Tf.length;Rs++)SE[Tf.charCodeAt(Rs)]=Rs;var FE=1,Po=2,No=3,bf=4,Qf=5,TE=7,If=8,Oo=9,Go=10,Lf=11,Rf=12,Df=13,Hf=14,Vo=15,bE=function(n){for(var e=[],t=0,A=n.length;t<A;){var i=n.charCodeAt(t++);if(i>=55296&&i<=56319&&t<A){var r=n.charCodeAt(t++);(r&64512)===56320?e.push(((i&1023)<<10)+(r&1023)+65536):(e.push(i),t--)}else e.push(i)}return e},QE=function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];if(String.fromCodePoint)return String.fromCodePoint.apply(String,n);var t=n.length;if(!t)return"";for(var A=[],i=-1,r="";++i<t;){var s=n[i];s<=65535?A.push(s):(s-=65536,A.push((s>>10)+55296,s%1024+56320)),(i+1===t||A.length>16384)&&(r+=String.fromCharCode.apply(String,A),A.length=0)}return r},IE=UE(uE),pA="×",Ko="÷",LE=function(n){return IE.get(n)},RE=function(n,e,t){var A=t-2,i=e[A],r=e[t-1],s=e[t];if(r===Po&&s===No)return pA;if(r===Po||r===No||r===bf||s===Po||s===No||s===bf)return Ko;if(r===If&&[If,Oo,Lf,Rf].indexOf(s)!==-1||(r===Lf||r===Oo)&&(s===Oo||s===Go)||(r===Rf||r===Go)&&s===Go||s===Df||s===Qf||s===TE||r===FE)return pA;if(r===Df&&s===Hf){for(;i===Qf;)i=e[--A];if(i===Hf)return pA}if(r===Vo&&s===Vo){for(var a=0;i===Vo;)a++,i=e[--A];if(a%2===0)return pA}return Ko},DE=function(n){var e=bE(n),t=e.length,A=0,i=0,r=e.map(LE);return{next:function(){if(A>=t)return{done:!0,value:null};for(var s=pA;A<t&&(s=RE(e,r,++A))===pA;);if(s!==pA||A===t){var a=QE.apply(null,e.slice(i,A));return i=A,{value:a,done:!1}}return{done:!0,value:null}}}},HE=function(n){for(var e=DE(n),t=[],A;!(A=e.next()).done;)A.value&&t.push(A.value.slice());return t},PE=function(n){var e=123;if(n.createRange){var t=n.createRange();if(t.getBoundingClientRect){var A=n.createElement("boundtest");A.style.height=e+"px",A.style.display="block",n.body.appendChild(A),t.selectNode(A);var i=t.getBoundingClientRect(),r=Math.round(i.height);if(n.body.removeChild(A),r===e)return!0}}return!1},NE=function(n){var e=n.createElement("boundtest");e.style.width="50px",e.style.display="block",e.style.fontSize="12px",e.style.letterSpacing="0px",e.style.wordSpacing="0px",n.body.appendChild(e);var t=n.createRange();e.innerHTML=typeof"".repeat=="function"?"&#128104;".repeat(10):"";var A=e.firstChild,i=Ra(A.data).map(function(o){return Ct(o)}),r=0,s={},a=i.every(function(o,l){t.setStart(A,r),t.setEnd(A,r+o.length);var c=t.getBoundingClientRect();r+=o.length;var u=c.x>s.x||c.y>s.y;return s=c,l===0?!0:u});return n.body.removeChild(e),a},OE=function(){return typeof new Image().crossOrigin<"u"},GE=function(){return typeof new XMLHttpRequest().responseType=="string"},VE=function(n){var e=new Image,t=n.createElement("canvas"),A=t.getContext("2d");if(!A)return!1;e.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{A.drawImage(e,0,0),t.toDataURL()}catch{return!1}return!0},Pf=function(n){return n[0]===0&&n[1]===255&&n[2]===0&&n[3]===255},KE=function(n){var e=n.createElement("canvas"),t=100;e.width=t,e.height=t;var A=e.getContext("2d");if(!A)return Promise.reject(!1);A.fillStyle="rgb(0, 255, 0)",A.fillRect(0,0,t,t);var i=new Image,r=e.toDataURL();i.src=r;var s=tc(t,t,0,0,i);return A.fillStyle="red",A.fillRect(0,0,t,t),Nf(s).then(function(a){A.drawImage(a,0,0);var o=A.getImageData(0,0,t,t).data;A.fillStyle="red",A.fillRect(0,0,t,t);var l=n.createElement("div");return l.style.backgroundImage="url("+r+")",l.style.height=t+"px",Pf(o)?Nf(tc(t,t,0,0,l)):Promise.reject(!1)}).then(function(a){return A.drawImage(a,0,0),Pf(A.getImageData(0,0,t,t).data)}).catch(function(){return!1})},tc=function(n,e,t,A,i){var r="http://www.w3.org/2000/svg",s=document.createElementNS(r,"svg"),a=document.createElementNS(r,"foreignObject");return s.setAttributeNS(null,"width",n.toString()),s.setAttributeNS(null,"height",e.toString()),a.setAttributeNS(null,"width","100%"),a.setAttributeNS(null,"height","100%"),a.setAttributeNS(null,"x",t.toString()),a.setAttributeNS(null,"y",A.toString()),a.setAttributeNS(null,"externalResourcesRequired","true"),s.appendChild(a),a.appendChild(i),s},Nf=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){return e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},Gt={get SUPPORT_RANGE_BOUNDS(){var n=PE(document);return Object.defineProperty(Gt,"SUPPORT_RANGE_BOUNDS",{value:n}),n},get SUPPORT_WORD_BREAKING(){var n=Gt.SUPPORT_RANGE_BOUNDS&&NE(document);return Object.defineProperty(Gt,"SUPPORT_WORD_BREAKING",{value:n}),n},get SUPPORT_SVG_DRAWING(){var n=VE(document);return Object.defineProperty(Gt,"SUPPORT_SVG_DRAWING",{value:n}),n},get SUPPORT_FOREIGNOBJECT_DRAWING(){var n=typeof Array.from=="function"&&typeof window.fetch=="function"?KE(document):Promise.resolve(!1);return Object.defineProperty(Gt,"SUPPORT_FOREIGNOBJECT_DRAWING",{value:n}),n},get SUPPORT_CORS_IMAGES(){var n=OE();return Object.defineProperty(Gt,"SUPPORT_CORS_IMAGES",{value:n}),n},get SUPPORT_RESPONSE_TYPE(){var n=GE();return Object.defineProperty(Gt,"SUPPORT_RESPONSE_TYPE",{value:n}),n},get SUPPORT_CORS_XHR(){var n="withCredentials"in new XMLHttpRequest;return Object.defineProperty(Gt,"SUPPORT_CORS_XHR",{value:n}),n},get SUPPORT_NATIVE_TEXT_SEGMENTATION(){var n=!!(typeof Intl<"u"&&Intl.Segmenter);return Object.defineProperty(Gt,"SUPPORT_NATIVE_TEXT_SEGMENTATION",{value:n}),n}},Mr=function(){function n(e,t){this.text=e,this.bounds=t}return n}(),kE=function(n,e,t,A){var i=XE(e,t),r=[],s=0;return i.forEach(function(a){if(t.textDecorationLine.length||a.trim().length>0)if(Gt.SUPPORT_RANGE_BOUNDS){var o=Of(A,s,a.length).getClientRects();if(o.length>1){var l=Qc(a),c=0;l.forEach(function(f){r.push(new Mr(f,An.fromDOMRectList(n,Of(A,c+s,f.length).getClientRects()))),c+=f.length})}else r.push(new Mr(a,An.fromDOMRectList(n,o)))}else{var u=A.splitText(a.length);r.push(new Mr(a,zE(n,A))),A=u}else Gt.SUPPORT_RANGE_BOUNDS||(A=A.splitText(a.length));s+=a.length}),r},zE=function(n,e){var t=e.ownerDocument;if(t){var A=t.createElement("html2canvaswrapper");A.appendChild(e.cloneNode(!0));var i=e.parentNode;if(i){i.replaceChild(A,e);var r=La(n,A);return A.firstChild&&i.replaceChild(A.firstChild,A),r}}return An.EMPTY},Of=function(n,e,t){var A=n.ownerDocument;if(!A)throw new Error("Node has no owner document");var i=A.createRange();return i.setStart(n,e),i.setEnd(n,e+t),i},Qc=function(n){if(Gt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var e=new Intl.Segmenter(void 0,{granularity:"grapheme"});return Array.from(e.segment(n)).map(function(t){return t.segment})}return HE(n)},WE=function(n,e){if(Gt.SUPPORT_NATIVE_TEXT_SEGMENTATION){var t=new Intl.Segmenter(void 0,{granularity:"word"});return Array.from(t.segment(n)).map(function(A){return A.segment})}return JE(n,e)},XE=function(n,e){return e.letterSpacing!==0?Qc(n):WE(n,e)},YE=[32,160,4961,65792,65793,4153,4241],JE=function(n,e){for(var t=_C(n,{lineBreak:e.lineBreak,wordBreak:e.overflowWrap==="break-word"?"break-word":e.wordBreak}),A=[],i,r=function(){if(i.value){var s=i.value.slice(),a=Ra(s),o="";a.forEach(function(l){YE.indexOf(l)===-1?o+=Ct(l):(o.length&&A.push(o),A.push(Ct(l)),o="")}),o.length&&A.push(o)}};!(i=t.next()).done;)r();return A},qE=function(){function n(e,t,A){this.text=ZE(t.data,A.textTransform),this.textBounds=kE(e,this.text,A,t)}return n}(),ZE=function(n,e){switch(e){case 1:return n.toLowerCase();case 3:return n.replace(jE,$E);case 2:return n.toUpperCase();default:return n}},jE=/(^|\s|:|-|\(|\))([a-z])/g,$E=function(n,e,t){return n.length>0?e+t.toUpperCase():n},Td=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.src=A.currentSrc||A.src,i.intrinsicWidth=A.naturalWidth,i.intrinsicHeight=A.naturalHeight,i.context.cache.addImage(i.src),i}return e}(PA),bd=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A,i.intrinsicWidth=A.width,i.intrinsicHeight=A.height,i}return e}(PA),Qd=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=new XMLSerializer,s=La(t,A);return A.setAttribute("width",s.width+"px"),A.setAttribute("height",s.height+"px"),i.svg="data:image/svg+xml,"+encodeURIComponent(r.serializeToString(A)),i.intrinsicWidth=A.width.baseVal.value,i.intrinsicHeight=A.height.baseVal.value,i.context.cache.addImage(i.svg),i}return e}(PA),Id=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e}(PA),Ac=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.start=A.start,i.reversed=typeof A.reversed=="boolean"&&A.reversed===!0,i}return e}(PA),ey=[{type:15,flags:0,unit:"px",number:3}],ty=[{type:16,flags:0,number:50}],Ay=function(n){return n.width>n.height?new An(n.left+(n.width-n.height)/2,n.top,n.height,n.height):n.width<n.height?new An(n.left,n.top+(n.height-n.width)/2,n.width,n.width):n},ny=function(n){var e=n.type===iy?new Array(n.value.length+1).join("•"):n.value;return e.length===0?n.placeholder||"":e},ga="checkbox",ma="radio",iy="password",Gf=707406591,Ic=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;switch(i.type=A.type.toLowerCase(),i.checked=A.checked,i.value=ny(A),(i.type===ga||i.type===ma)&&(i.styles.backgroundColor=3739148031,i.styles.borderTopColor=i.styles.borderRightColor=i.styles.borderBottomColor=i.styles.borderLeftColor=2779096575,i.styles.borderTopWidth=i.styles.borderRightWidth=i.styles.borderBottomWidth=i.styles.borderLeftWidth=1,i.styles.borderTopStyle=i.styles.borderRightStyle=i.styles.borderBottomStyle=i.styles.borderLeftStyle=1,i.styles.backgroundClip=[0],i.styles.backgroundOrigin=[0],i.bounds=Ay(i.bounds)),i.type){case ga:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=ey;break;case ma:i.styles.borderTopRightRadius=i.styles.borderTopLeftRadius=i.styles.borderBottomRightRadius=i.styles.borderBottomLeftRadius=ty;break}return i}return e}(PA),Ld=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this,r=A.options[A.selectedIndex||0];return i.value=r&&r.text||"",i}return e}(PA),Rd=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.value=A.value,i}return e}(PA),Dd=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;i.src=A.src,i.width=parseInt(A.width,10)||0,i.height=parseInt(A.height,10)||0,i.backgroundColor=i.styles.backgroundColor;try{if(A.contentWindow&&A.contentWindow.document&&A.contentWindow.document.documentElement){i.tree=Pd(t,A.contentWindow.document.documentElement);var r=A.contentWindow.document.documentElement?yr(t,getComputedStyle(A.contentWindow.document.documentElement).backgroundColor):$A.TRANSPARENT,s=A.contentWindow.document.body?yr(t,getComputedStyle(A.contentWindow.document.body).backgroundColor):$A.TRANSPARENT;i.backgroundColor=yn(r)?yn(s)?i.styles.backgroundColor:s:r}}catch{}return i}return e}(PA),ry=["OL","UL","MENU"],ta=function(n,e,t,A){for(var i=e.firstChild,r=void 0;i;i=r)if(r=i.nextSibling,Nd(i)&&i.data.trim().length>0)t.textNodes.push(new qE(n,i,t.styles));else if(Ri(i))if(Kd(i)&&i.assignedNodes)i.assignedNodes().forEach(function(a){return ta(n,a,t,A)});else{var s=Hd(n,i);s.styles.isVisible()&&(sy(i,s,A)?s.flags|=4:ay(s.styles)&&(s.flags|=2),ry.indexOf(i.tagName)!==-1&&(s.flags|=8),t.elements.push(s),i.slot,i.shadowRoot?ta(n,i.shadowRoot,s,A):!Ba(i)&&!Od(i)&&!va(i)&&ta(n,i,s,A))}},Hd=function(n,e){return ic(e)?new Td(n,e):Gd(e)?new bd(n,e):Od(e)?new Qd(n,e):oy(e)?new Id(n,e):ly(e)?new Ac(n,e):cy(e)?new Ic(n,e):va(e)?new Ld(n,e):Ba(e)?new Rd(n,e):Vd(e)?new Dd(n,e):new PA(n,e)},Pd=function(n,e){var t=Hd(n,e);return t.flags|=4,ta(n,e,t,t),t},sy=function(n,e,t){return e.styles.isPositionedWithZIndex()||e.styles.opacity<1||e.styles.isTransformed()||Lc(n)&&t.styles.isTransparent()},ay=function(n){return n.isPositioned()||n.isFloating()},Nd=function(n){return n.nodeType===Node.TEXT_NODE},Ri=function(n){return n.nodeType===Node.ELEMENT_NODE},nc=function(n){return Ri(n)&&typeof n.style<"u"&&!Aa(n)},Aa=function(n){return typeof n.className=="object"},oy=function(n){return n.tagName==="LI"},ly=function(n){return n.tagName==="OL"},cy=function(n){return n.tagName==="INPUT"},uy=function(n){return n.tagName==="HTML"},Od=function(n){return n.tagName==="svg"},Lc=function(n){return n.tagName==="BODY"},Gd=function(n){return n.tagName==="CANVAS"},Vf=function(n){return n.tagName==="VIDEO"},ic=function(n){return n.tagName==="IMG"},Vd=function(n){return n.tagName==="IFRAME"},Kf=function(n){return n.tagName==="STYLE"},fy=function(n){return n.tagName==="SCRIPT"},Ba=function(n){return n.tagName==="TEXTAREA"},va=function(n){return n.tagName==="SELECT"},Kd=function(n){return n.tagName==="SLOT"},kf=function(n){return n.tagName.indexOf("-")>0},hy=function(){function n(){this.counters={}}return n.prototype.getCounterValue=function(e){var t=this.counters[e];return t&&t.length?t[t.length-1]:1},n.prototype.getCounterValues=function(e){var t=this.counters[e];return t||[]},n.prototype.pop=function(e){var t=this;e.forEach(function(A){return t.counters[A].pop()})},n.prototype.parse=function(e){var t=this,A=e.counterIncrement,i=e.counterReset,r=!0;A!==null&&A.forEach(function(a){var o=t.counters[a.counter];o&&a.increment!==0&&(r=!1,o.length||o.push(1),o[Math.max(0,o.length-1)]+=a.increment)});var s=[];return r&&i.forEach(function(a){var o=t.counters[a.counter];s.push(a.counter),o||(o=t.counters[a.counter]=[]),o.push(a.reset)}),s},n}(),zf={integers:[1e3,900,500,400,100,90,50,40,10,9,5,4,1],values:["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]},Wf={integers:[9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["Ք","Փ","Ւ","Ց","Ր","Տ","Վ","Ս","Ռ","Ջ","Պ","Չ","Ո","Շ","Ն","Յ","Մ","Ճ","Ղ","Ձ","Հ","Կ","Ծ","Խ","Լ","Ի","Ժ","Թ","Ը","Է","Զ","Ե","Դ","Գ","Բ","Ա"]},dy={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,400,300,200,100,90,80,70,60,50,40,30,20,19,18,17,16,15,10,9,8,7,6,5,4,3,2,1],values:["י׳","ט׳","ח׳","ז׳","ו׳","ה׳","ד׳","ג׳","ב׳","א׳","ת","ש","ר","ק","צ","פ","ע","ס","נ","מ","ל","כ","יט","יח","יז","טז","טו","י","ט","ח","ז","ו","ה","ד","ג","ב","א"]},py={integers:[1e4,9e3,8e3,7e3,6e3,5e3,4e3,3e3,2e3,1e3,900,800,700,600,500,400,300,200,100,90,80,70,60,50,40,30,20,10,9,8,7,6,5,4,3,2,1],values:["ჵ","ჰ","ჯ","ჴ","ხ","ჭ","წ","ძ","ც","ჩ","შ","ყ","ღ","ქ","ფ","ჳ","ტ","ს","რ","ჟ","პ","ო","ჲ","ნ","მ","ლ","კ","ი","თ","ჱ","ზ","ვ","ე","დ","გ","ბ","ა"]},Ui=function(n,e,t,A,i,r){return n<e||n>t?Ir(n,i,r.length>0):A.integers.reduce(function(s,a,o){for(;n>=a;)n-=a,s+=A.values[o];return s},"")+r},kd=function(n,e,t,A){var i="";do t||n--,i=A(n)+i,n/=e;while(n*e>=e);return i},wt=function(n,e,t,A,i){var r=t-e+1;return(n<0?"-":"")+(kd(Math.abs(n),r,A,function(s){return Ct(Math.floor(s%r)+e)})+i)},Nn=function(n,e,t){t===void 0&&(t=". ");var A=e.length;return kd(Math.abs(n),A,!1,function(i){return e[Math.floor(i%A)]})+t},bi=1,fn=2,hn=4,_r=8,WA=function(n,e,t,A,i,r){if(n<-9999||n>9999)return Ir(n,4,i.length>0);var s=Math.abs(n),a=i;if(s===0)return e[0]+a;for(var o=0;s>0&&o<=4;o++){var l=s%10;l===0&&Qt(r,bi)&&a!==""?a=e[l]+a:l>1||l===1&&o===0||l===1&&o===1&&Qt(r,fn)||l===1&&o===1&&Qt(r,hn)&&n>100||l===1&&o>1&&Qt(r,_r)?a=e[l]+(o>0?t[o-1]:"")+a:l===1&&o>0&&(a=t[o-1]+a),s=Math.floor(s/10)}return(n<0?A:"")+a},Xf="十百千萬",Yf="拾佰仟萬",Jf="マイナス",ko="마이너스",Ir=function(n,e,t){var A=t?". ":"",i=t?"、":"",r=t?", ":"",s=t?" ":"";switch(e){case 0:return"•"+s;case 1:return"◦"+s;case 2:return"◾"+s;case 5:var a=wt(n,48,57,!0,A);return a.length<4?"0"+a:a;case 4:return Nn(n,"〇一二三四五六七八九",i);case 6:return Ui(n,1,3999,zf,3,A).toLowerCase();case 7:return Ui(n,1,3999,zf,3,A);case 8:return wt(n,945,969,!1,A);case 9:return wt(n,97,122,!1,A);case 10:return wt(n,65,90,!1,A);case 11:return wt(n,1632,1641,!0,A);case 12:case 49:return Ui(n,1,9999,Wf,3,A);case 35:return Ui(n,1,9999,Wf,3,A).toLowerCase();case 13:return wt(n,2534,2543,!0,A);case 14:case 30:return wt(n,6112,6121,!0,A);case 15:return Nn(n,"子丑寅卯辰巳午未申酉戌亥",i);case 16:return Nn(n,"甲乙丙丁戊己庚辛壬癸",i);case 17:case 48:return WA(n,"零一二三四五六七八九",Xf,"負",i,fn|hn|_r);case 47:return WA(n,"零壹貳參肆伍陸柒捌玖",Yf,"負",i,bi|fn|hn|_r);case 42:return WA(n,"零一二三四五六七八九",Xf,"负",i,fn|hn|_r);case 41:return WA(n,"零壹贰叁肆伍陆柒捌玖",Yf,"负",i,bi|fn|hn|_r);case 26:return WA(n,"〇一二三四五六七八九","十百千万",Jf,i,0);case 25:return WA(n,"零壱弐参四伍六七八九","拾百千万",Jf,i,bi|fn|hn);case 31:return WA(n,"영일이삼사오육칠팔구","십백천만",ko,r,bi|fn|hn);case 33:return WA(n,"零一二三四五六七八九","十百千萬",ko,r,0);case 32:return WA(n,"零壹貳參四五六七八九","拾百千",ko,r,bi|fn|hn);case 18:return wt(n,2406,2415,!0,A);case 20:return Ui(n,1,19999,py,3,A);case 21:return wt(n,2790,2799,!0,A);case 22:return wt(n,2662,2671,!0,A);case 22:return Ui(n,1,10999,dy,3,A);case 23:return Nn(n,"あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん");case 24:return Nn(n,"いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす");case 27:return wt(n,3302,3311,!0,A);case 28:return Nn(n,"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン",i);case 29:return Nn(n,"イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス",i);case 34:return wt(n,3792,3801,!0,A);case 37:return wt(n,6160,6169,!0,A);case 38:return wt(n,4160,4169,!0,A);case 39:return wt(n,2918,2927,!0,A);case 40:return wt(n,1776,1785,!0,A);case 43:return wt(n,3046,3055,!0,A);case 44:return wt(n,3174,3183,!0,A);case 45:return wt(n,3664,3673,!0,A);case 46:return wt(n,3872,3881,!0,A);case 3:default:return wt(n,48,57,!0,A)}},zd="data-html2canvas-ignore",qf=function(){function n(e,t,A){if(this.context=e,this.options=A,this.scrolledElements=[],this.referenceElement=t,this.counters=new hy,this.quoteDepth=0,!t.ownerDocument)throw new Error("Cloned element does not have an owner document");this.documentElement=this.cloneNode(t.ownerDocument.documentElement,!1)}return n.prototype.toIFrame=function(e,t){var A=this,i=gy(e,t);if(!i.contentWindow)return Promise.reject("Unable to find iframe window");var r=e.defaultView.pageXOffset,s=e.defaultView.pageYOffset,a=i.contentWindow,o=a.document,l=vy(i).then(function(){return Zt(A,void 0,void 0,function(){var c,u;return Wt(this,function(f){switch(f.label){case 0:return this.scrolledElements.forEach(xy),a&&(a.scrollTo(t.left,t.top),/(iPad|iPhone|iPod)/g.test(navigator.userAgent)&&(a.scrollY!==t.top||a.scrollX!==t.left)&&(this.context.logger.warn("Unable to restore scroll position for cloned document"),this.context.windowBounds=this.context.windowBounds.add(a.scrollX-t.left,a.scrollY-t.top,0,0))),c=this.options.onclone,u=this.clonedReferenceElement,typeof u>"u"?[2,Promise.reject("Error finding the "+this.referenceElement.nodeName+" in the cloned document")]:o.fonts&&o.fonts.ready?[4,o.fonts.ready]:[3,2];case 1:f.sent(),f.label=2;case 2:return/(AppleWebKit)/g.test(navigator.userAgent)?[4,By(o)]:[3,4];case 3:f.sent(),f.label=4;case 4:return typeof c=="function"?[2,Promise.resolve().then(function(){return c(o,u)}).then(function(){return i})]:[2,i]}})})});return o.open(),o.write(Cy(document.doctype)+"<html></html>"),_y(this.referenceElement.ownerDocument,r,s),o.replaceChild(o.adoptNode(this.documentElement),o.documentElement),o.close(),l},n.prototype.createElementClone=function(e){if(ec(e,2))debugger;if(Gd(e))return this.createCanvasClone(e);if(Vf(e))return this.createVideoClone(e);if(Kf(e))return this.createStyleClone(e);var t=e.cloneNode(!1);return ic(t)&&(ic(e)&&e.currentSrc&&e.currentSrc!==e.src&&(t.src=e.currentSrc,t.srcset=""),t.loading==="lazy"&&(t.loading="eager")),kf(t)?this.createCustomElementClone(t):t},n.prototype.createCustomElementClone=function(e){var t=document.createElement("html2canvascustomelement");return zo(e.style,t),t},n.prototype.createStyleClone=function(e){try{var t=e.sheet;if(t&&t.cssRules){var A=[].slice.call(t.cssRules,0).reduce(function(r,s){return s&&typeof s.cssText=="string"?r+s.cssText:r},""),i=e.cloneNode(!1);return i.textContent=A,i}}catch(r){if(this.context.logger.error("Unable to access cssRules property",r),r.name!=="SecurityError")throw r}return e.cloneNode(!1)},n.prototype.createCanvasClone=function(e){var t;if(this.options.inlineImages&&e.ownerDocument){var A=e.ownerDocument.createElement("img");try{return A.src=e.toDataURL(),A}catch{this.context.logger.info("Unable to inline canvas contents, canvas is tainted",e)}}var i=e.cloneNode(!1);try{i.width=e.width,i.height=e.height;var r=e.getContext("2d"),s=i.getContext("2d");if(s)if(!this.options.allowTaint&&r)s.putImageData(r.getImageData(0,0,e.width,e.height),0,0);else{var a=(t=e.getContext("webgl2"))!==null&&t!==void 0?t:e.getContext("webgl");if(a){var o=a.getContextAttributes();(o==null?void 0:o.preserveDrawingBuffer)===!1&&this.context.logger.warn("Unable to clone WebGL context as it has preserveDrawingBuffer=false",e)}s.drawImage(e,0,0)}return i}catch{this.context.logger.info("Unable to clone canvas as it is tainted",e)}return i},n.prototype.createVideoClone=function(e){var t=e.ownerDocument.createElement("canvas");t.width=e.offsetWidth,t.height=e.offsetHeight;var A=t.getContext("2d");try{return A&&(A.drawImage(e,0,0,t.width,t.height),this.options.allowTaint||A.getImageData(0,0,t.width,t.height)),t}catch{this.context.logger.info("Unable to clone video as it is tainted",e)}var i=e.ownerDocument.createElement("canvas");return i.width=e.offsetWidth,i.height=e.offsetHeight,i},n.prototype.appendChildNode=function(e,t,A){(!Ri(t)||!fy(t)&&!t.hasAttribute(zd)&&(typeof this.options.ignoreElements!="function"||!this.options.ignoreElements(t)))&&(!this.options.copyStyles||!Ri(t)||!Kf(t))&&e.appendChild(this.cloneNode(t,A))},n.prototype.cloneChildNodes=function(e,t,A){for(var i=this,r=e.shadowRoot?e.shadowRoot.firstChild:e.firstChild;r;r=r.nextSibling)if(Ri(r)&&Kd(r)&&typeof r.assignedNodes=="function"){var s=r.assignedNodes();s.length&&s.forEach(function(a){return i.appendChildNode(t,a,A)})}else this.appendChildNode(t,r,A)},n.prototype.cloneNode=function(e,t){if(Nd(e))return document.createTextNode(e.data);if(!e.ownerDocument)return e.cloneNode(!1);var A=e.ownerDocument.defaultView;if(A&&Ri(e)&&(nc(e)||Aa(e))){var i=this.createElementClone(e);i.style.transitionProperty="none";var r=A.getComputedStyle(e),s=A.getComputedStyle(e,":before"),a=A.getComputedStyle(e,":after");this.referenceElement===e&&nc(i)&&(this.clonedReferenceElement=i),Lc(i)&&Uy(i);var o=this.counters.parse(new Mf(this.context,r)),l=this.resolvePseudoContent(e,i,s,Sr.BEFORE);kf(e)&&(t=!0),Vf(e)||this.cloneChildNodes(e,i,t),l&&i.insertBefore(l,i.firstChild);var c=this.resolvePseudoContent(e,i,a,Sr.AFTER);return c&&i.appendChild(c),this.counters.pop(o),(r&&(this.options.copyStyles||Aa(e))&&!Vd(e)||t)&&zo(r,i),(e.scrollTop!==0||e.scrollLeft!==0)&&this.scrolledElements.push([i,e.scrollLeft,e.scrollTop]),(Ba(e)||va(e))&&(Ba(i)||va(i))&&(i.value=e.value),i}return e.cloneNode(!1)},n.prototype.resolvePseudoContent=function(e,t,A,i){var r=this;if(A){var s=A.content,a=t.ownerDocument;if(!(!a||!s||s==="none"||s==="-moz-alt-content"||A.display==="none")){this.counters.parse(new Mf(this.context,A));var o=new oE(this.context,A),l=a.createElement("html2canvaspseudoelement");zo(A,l),o.content.forEach(function(u){if(u.type===0)l.appendChild(a.createTextNode(u.value));else if(u.type===22){var f=a.createElement("img");f.src=u.value,f.style.opacity="1",l.appendChild(f)}else if(u.type===18){if(u.name==="attr"){var d=u.values.filter(nt);d.length&&l.appendChild(a.createTextNode(e.getAttribute(d[0].value)||""))}else if(u.name==="counter"){var g=u.values.filter(qi),m=g[0],p=g[1];if(m&&nt(m)){var h=r.counters.getCounterValue(m.value),C=p&&nt(p)?$l.parse(r.context,p.value):3;l.appendChild(a.createTextNode(Ir(h,C,!1)))}}else if(u.name==="counters"){var v=u.values.filter(qi),m=v[0],y=v[1],p=v[2];if(m&&nt(m)){var I=r.counters.getCounterValues(m.value),U=p&&nt(p)?$l.parse(r.context,p.value):3,M=y&&y.type===0?y.value:"",R=I.map(function(b){return Ir(b,U,!1)}).join(M);l.appendChild(a.createTextNode(R))}}}else if(u.type===20)switch(u.value){case"open-quote":l.appendChild(a.createTextNode(Uf(o.quotes,r.quoteDepth++,!0)));break;case"close-quote":l.appendChild(a.createTextNode(Uf(o.quotes,--r.quoteDepth,!1)));break;default:l.appendChild(a.createTextNode(u.value))}}),l.className=rc+" "+sc;var c=i===Sr.BEFORE?" "+rc:" "+sc;return Aa(t)?t.className.baseValue+=c:t.className+=c,l}}},n.destroy=function(e){return e.parentNode?(e.parentNode.removeChild(e),!0):!1},n}(),Sr;(function(n){n[n.BEFORE=0]="BEFORE",n[n.AFTER=1]="AFTER"})(Sr||(Sr={}));var gy=function(n,e){var t=n.createElement("iframe");return t.className="html2canvas-container",t.style.visibility="hidden",t.style.position="fixed",t.style.left="-10000px",t.style.top="0px",t.style.border="0",t.width=e.width.toString(),t.height=e.height.toString(),t.scrolling="no",t.setAttribute(zd,"true"),n.body.appendChild(t),t},my=function(n){return new Promise(function(e){if(n.complete){e();return}if(!n.src){e();return}n.onload=e,n.onerror=e})},By=function(n){return Promise.all([].slice.call(n.images,0).map(my))},vy=function(n){return new Promise(function(e,t){var A=n.contentWindow;if(!A)return t("No window assigned for iframe");var i=A.document;A.onload=n.onload=function(){A.onload=n.onload=null;var r=setInterval(function(){i.body.childNodes.length>0&&i.readyState==="complete"&&(clearInterval(r),e(n))},50)}})},wy=["all","d","content"],zo=function(n,e){for(var t=n.length-1;t>=0;t--){var A=n.item(t);wy.indexOf(A)===-1&&e.style.setProperty(A,n.getPropertyValue(A))}return e},Cy=function(n){var e="";return n&&(e+="<!DOCTYPE ",n.name&&(e+=n.name),n.internalSubset&&(e+=n.internalSubset),n.publicId&&(e+='"'+n.publicId+'"'),n.systemId&&(e+='"'+n.systemId+'"'),e+=">"),e},_y=function(n,e,t){n&&n.defaultView&&(e!==n.defaultView.pageXOffset||t!==n.defaultView.pageYOffset)&&n.defaultView.scrollTo(e,t)},xy=function(n){var e=n[0],t=n[1],A=n[2];e.scrollLeft=t,e.scrollTop=A},Ey=":before",yy=":after",rc="___html2canvas___pseudoelement_before",sc="___html2canvas___pseudoelement_after",Zf=`{
    content: "" !important;
    display: none !important;
}`,Uy=function(n){My(n,"."+rc+Ey+Zf+`
         .`+sc+yy+Zf)},My=function(n,e){var t=n.ownerDocument;if(t){var A=t.createElement("style");A.textContent=e,n.appendChild(A)}},Wd=function(){function n(){}return n.getOrigin=function(e){var t=n._link;return t?(t.href=e,t.href=t.href,t.protocol+t.hostname+t.port):"about:blank"},n.isSameOrigin=function(e){return n.getOrigin(e)===n._origin},n.setContext=function(e){n._link=e.document.createElement("a"),n._origin=n.getOrigin(e.location.href)},n._origin="about:blank",n}(),Sy=function(){function n(e,t){this.context=e,this._options=t,this._cache={}}return n.prototype.addImage=function(e){var t=Promise.resolve();return this.has(e)||(Xo(e)||Qy(e))&&(this._cache[e]=this.loadImage(e)).catch(function(){}),t},n.prototype.match=function(e){return this._cache[e]},n.prototype.loadImage=function(e){return Zt(this,void 0,void 0,function(){var t,A,i,r,s=this;return Wt(this,function(a){switch(a.label){case 0:return t=Wd.isSameOrigin(e),A=!Wo(e)&&this._options.useCORS===!0&&Gt.SUPPORT_CORS_IMAGES&&!t,i=!Wo(e)&&!t&&!Xo(e)&&typeof this._options.proxy=="string"&&Gt.SUPPORT_CORS_XHR&&!A,!t&&this._options.allowTaint===!1&&!Wo(e)&&!Xo(e)&&!i&&!A?[2]:(r=e,i?[4,this.proxy(r)]:[3,2]);case 1:r=a.sent(),a.label=2;case 2:return this.context.logger.debug("Added image "+e.substring(0,256)),[4,new Promise(function(o,l){var c=new Image;c.onload=function(){return o(c)},c.onerror=l,(Iy(r)||A)&&(c.crossOrigin="anonymous"),c.src=r,c.complete===!0&&setTimeout(function(){return o(c)},500),s._options.imageTimeout>0&&setTimeout(function(){return l("Timed out ("+s._options.imageTimeout+"ms) loading image")},s._options.imageTimeout)})];case 3:return[2,a.sent()]}})})},n.prototype.has=function(e){return typeof this._cache[e]<"u"},n.prototype.keys=function(){return Promise.resolve(Object.keys(this._cache))},n.prototype.proxy=function(e){var t=this,A=this._options.proxy;if(!A)throw new Error("No proxy defined");var i=e.substring(0,256);return new Promise(function(r,s){var a=Gt.SUPPORT_RESPONSE_TYPE?"blob":"text",o=new XMLHttpRequest;o.onload=function(){if(o.status===200)if(a==="text")r(o.response);else{var u=new FileReader;u.addEventListener("load",function(){return r(u.result)},!1),u.addEventListener("error",function(f){return s(f)},!1),u.readAsDataURL(o.response)}else s("Failed to proxy resource "+i+" with status code "+o.status)},o.onerror=s;var l=A.indexOf("?")>-1?"&":"?";if(o.open("GET",""+A+l+"url="+encodeURIComponent(e)+"&responseType="+a),a!=="text"&&o instanceof XMLHttpRequest&&(o.responseType=a),t._options.imageTimeout){var c=t._options.imageTimeout;o.timeout=c,o.ontimeout=function(){return s("Timed out ("+c+"ms) proxying "+i)}}o.send()})},n}(),Fy=/^data:image\/svg\+xml/i,Ty=/^data:image\/.*;base64,/i,by=/^data:image\/.*/i,Qy=function(n){return Gt.SUPPORT_SVG_DRAWING||!Ly(n)},Wo=function(n){return by.test(n)},Iy=function(n){return Ty.test(n)},Xo=function(n){return n.substr(0,4)==="blob"},Ly=function(n){return n.substr(-3).toLowerCase()==="svg"||Fy.test(n)},ue=function(){function n(e,t){this.type=0,this.x=e,this.y=t}return n.prototype.add=function(e,t){return new n(this.x+e,this.y+t)},n}(),Mi=function(n,e,t){return new ue(n.x+(e.x-n.x)*t,n.y+(e.y-n.y)*t)},Ds=function(){function n(e,t,A,i){this.type=1,this.start=e,this.startControl=t,this.endControl=A,this.end=i}return n.prototype.subdivide=function(e,t){var A=Mi(this.start,this.startControl,e),i=Mi(this.startControl,this.endControl,e),r=Mi(this.endControl,this.end,e),s=Mi(A,i,e),a=Mi(i,r,e),o=Mi(s,a,e);return t?new n(this.start,A,s,o):new n(o,a,r,this.end)},n.prototype.add=function(e,t){return new n(this.start.add(e,t),this.startControl.add(e,t),this.endControl.add(e,t),this.end.add(e,t))},n.prototype.reverse=function(){return new n(this.end,this.endControl,this.startControl,this.start)},n}(),gA=function(n){return n.type===1},Ry=function(){function n(e){var t=e.styles,A=e.bounds,i=wr(t.borderTopLeftRadius,A.width,A.height),r=i[0],s=i[1],a=wr(t.borderTopRightRadius,A.width,A.height),o=a[0],l=a[1],c=wr(t.borderBottomRightRadius,A.width,A.height),u=c[0],f=c[1],d=wr(t.borderBottomLeftRadius,A.width,A.height),g=d[0],m=d[1],p=[];p.push((r+o)/A.width),p.push((g+u)/A.width),p.push((s+m)/A.height),p.push((l+f)/A.height);var h=Math.max.apply(Math,p);h>1&&(r/=h,s/=h,o/=h,l/=h,u/=h,f/=h,g/=h,m/=h);var C=A.width-o,v=A.height-f,y=A.width-u,I=A.height-m,U=t.borderTopWidth,M=t.borderRightWidth,R=t.borderBottomWidth,x=t.borderLeftWidth,_=rt(t.paddingTop,e.bounds.width),b=rt(t.paddingRight,e.bounds.width),k=rt(t.paddingBottom,e.bounds.width),P=rt(t.paddingLeft,e.bounds.width);this.topLeftBorderDoubleOuterBox=r>0||s>0?dt(A.left+x/3,A.top+U/3,r-x/3,s-U/3,et.TOP_LEFT):new ue(A.left+x/3,A.top+U/3),this.topRightBorderDoubleOuterBox=r>0||s>0?dt(A.left+C,A.top+U/3,o-M/3,l-U/3,et.TOP_RIGHT):new ue(A.left+A.width-M/3,A.top+U/3),this.bottomRightBorderDoubleOuterBox=u>0||f>0?dt(A.left+y,A.top+v,u-M/3,f-R/3,et.BOTTOM_RIGHT):new ue(A.left+A.width-M/3,A.top+A.height-R/3),this.bottomLeftBorderDoubleOuterBox=g>0||m>0?dt(A.left+x/3,A.top+I,g-x/3,m-R/3,et.BOTTOM_LEFT):new ue(A.left+x/3,A.top+A.height-R/3),this.topLeftBorderDoubleInnerBox=r>0||s>0?dt(A.left+x*2/3,A.top+U*2/3,r-x*2/3,s-U*2/3,et.TOP_LEFT):new ue(A.left+x*2/3,A.top+U*2/3),this.topRightBorderDoubleInnerBox=r>0||s>0?dt(A.left+C,A.top+U*2/3,o-M*2/3,l-U*2/3,et.TOP_RIGHT):new ue(A.left+A.width-M*2/3,A.top+U*2/3),this.bottomRightBorderDoubleInnerBox=u>0||f>0?dt(A.left+y,A.top+v,u-M*2/3,f-R*2/3,et.BOTTOM_RIGHT):new ue(A.left+A.width-M*2/3,A.top+A.height-R*2/3),this.bottomLeftBorderDoubleInnerBox=g>0||m>0?dt(A.left+x*2/3,A.top+I,g-x*2/3,m-R*2/3,et.BOTTOM_LEFT):new ue(A.left+x*2/3,A.top+A.height-R*2/3),this.topLeftBorderStroke=r>0||s>0?dt(A.left+x/2,A.top+U/2,r-x/2,s-U/2,et.TOP_LEFT):new ue(A.left+x/2,A.top+U/2),this.topRightBorderStroke=r>0||s>0?dt(A.left+C,A.top+U/2,o-M/2,l-U/2,et.TOP_RIGHT):new ue(A.left+A.width-M/2,A.top+U/2),this.bottomRightBorderStroke=u>0||f>0?dt(A.left+y,A.top+v,u-M/2,f-R/2,et.BOTTOM_RIGHT):new ue(A.left+A.width-M/2,A.top+A.height-R/2),this.bottomLeftBorderStroke=g>0||m>0?dt(A.left+x/2,A.top+I,g-x/2,m-R/2,et.BOTTOM_LEFT):new ue(A.left+x/2,A.top+A.height-R/2),this.topLeftBorderBox=r>0||s>0?dt(A.left,A.top,r,s,et.TOP_LEFT):new ue(A.left,A.top),this.topRightBorderBox=o>0||l>0?dt(A.left+C,A.top,o,l,et.TOP_RIGHT):new ue(A.left+A.width,A.top),this.bottomRightBorderBox=u>0||f>0?dt(A.left+y,A.top+v,u,f,et.BOTTOM_RIGHT):new ue(A.left+A.width,A.top+A.height),this.bottomLeftBorderBox=g>0||m>0?dt(A.left,A.top+I,g,m,et.BOTTOM_LEFT):new ue(A.left,A.top+A.height),this.topLeftPaddingBox=r>0||s>0?dt(A.left+x,A.top+U,Math.max(0,r-x),Math.max(0,s-U),et.TOP_LEFT):new ue(A.left+x,A.top+U),this.topRightPaddingBox=o>0||l>0?dt(A.left+Math.min(C,A.width-M),A.top+U,C>A.width+M?0:Math.max(0,o-M),Math.max(0,l-U),et.TOP_RIGHT):new ue(A.left+A.width-M,A.top+U),this.bottomRightPaddingBox=u>0||f>0?dt(A.left+Math.min(y,A.width-x),A.top+Math.min(v,A.height-R),Math.max(0,u-M),Math.max(0,f-R),et.BOTTOM_RIGHT):new ue(A.left+A.width-M,A.top+A.height-R),this.bottomLeftPaddingBox=g>0||m>0?dt(A.left+x,A.top+Math.min(I,A.height-R),Math.max(0,g-x),Math.max(0,m-R),et.BOTTOM_LEFT):new ue(A.left+x,A.top+A.height-R),this.topLeftContentBox=r>0||s>0?dt(A.left+x+P,A.top+U+_,Math.max(0,r-(x+P)),Math.max(0,s-(U+_)),et.TOP_LEFT):new ue(A.left+x+P,A.top+U+_),this.topRightContentBox=o>0||l>0?dt(A.left+Math.min(C,A.width+x+P),A.top+U+_,C>A.width+x+P?0:o-x+P,l-(U+_),et.TOP_RIGHT):new ue(A.left+A.width-(M+b),A.top+U+_),this.bottomRightContentBox=u>0||f>0?dt(A.left+Math.min(y,A.width-(x+P)),A.top+Math.min(v,A.height+U+_),Math.max(0,u-(M+b)),f-(R+k),et.BOTTOM_RIGHT):new ue(A.left+A.width-(M+b),A.top+A.height-(R+k)),this.bottomLeftContentBox=g>0||m>0?dt(A.left+x+P,A.top+I,Math.max(0,g-(x+P)),m-(R+k),et.BOTTOM_LEFT):new ue(A.left+x+P,A.top+A.height-(R+k))}return n}(),et;(function(n){n[n.TOP_LEFT=0]="TOP_LEFT",n[n.TOP_RIGHT=1]="TOP_RIGHT",n[n.BOTTOM_RIGHT=2]="BOTTOM_RIGHT",n[n.BOTTOM_LEFT=3]="BOTTOM_LEFT"})(et||(et={}));var dt=function(n,e,t,A,i){var r=4*((Math.sqrt(2)-1)/3),s=t*r,a=A*r,o=n+t,l=e+A;switch(i){case et.TOP_LEFT:return new Ds(new ue(n,l),new ue(n,l-a),new ue(o-s,e),new ue(o,e));case et.TOP_RIGHT:return new Ds(new ue(n,e),new ue(n+s,e),new ue(o,l-a),new ue(o,l));case et.BOTTOM_RIGHT:return new Ds(new ue(o,e),new ue(o,e+a),new ue(n+s,l),new ue(n,l));case et.BOTTOM_LEFT:default:return new Ds(new ue(o,l),new ue(o-s,l),new ue(n,e+a),new ue(n,e))}},wa=function(n){return[n.topLeftBorderBox,n.topRightBorderBox,n.bottomRightBorderBox,n.bottomLeftBorderBox]},Dy=function(n){return[n.topLeftContentBox,n.topRightContentBox,n.bottomRightContentBox,n.bottomLeftContentBox]},Ca=function(n){return[n.topLeftPaddingBox,n.topRightPaddingBox,n.bottomRightPaddingBox,n.bottomLeftPaddingBox]},Hy=function(){function n(e,t,A){this.offsetX=e,this.offsetY=t,this.matrix=A,this.type=0,this.target=6}return n}(),Hs=function(){function n(e,t){this.path=e,this.target=t,this.type=1}return n}(),Py=function(){function n(e){this.opacity=e,this.type=2,this.target=6}return n}(),Ny=function(n){return n.type===0},Xd=function(n){return n.type===1},Oy=function(n){return n.type===2},jf=function(n,e){return n.length===e.length?n.some(function(t,A){return t===e[A]}):!1},Gy=function(n,e,t,A,i){return n.map(function(r,s){switch(s){case 0:return r.add(e,t);case 1:return r.add(e+A,t);case 2:return r.add(e+A,t+i);case 3:return r.add(e,t+i)}return r})},Yd=function(){function n(e){this.element=e,this.inlineLevel=[],this.nonInlineLevel=[],this.negativeZIndex=[],this.zeroOrAutoZIndexOrTransformedOrOpacity=[],this.positiveZIndex=[],this.nonPositionedFloats=[],this.nonPositionedInlineLevel=[]}return n}(),Jd=function(){function n(e,t){if(this.container=e,this.parent=t,this.effects=[],this.curves=new Ry(this.container),this.container.styles.opacity<1&&this.effects.push(new Py(this.container.styles.opacity)),this.container.styles.transform!==null){var A=this.container.bounds.left+this.container.styles.transformOrigin[0].number,i=this.container.bounds.top+this.container.styles.transformOrigin[1].number,r=this.container.styles.transform;this.effects.push(new Hy(A,i,r))}if(this.container.styles.overflowX!==0){var s=wa(this.curves),a=Ca(this.curves);jf(s,a)?this.effects.push(new Hs(s,6)):(this.effects.push(new Hs(s,2)),this.effects.push(new Hs(a,4)))}}return n.prototype.getEffects=function(e){for(var t=[2,3].indexOf(this.container.styles.position)===-1,A=this.parent,i=this.effects.slice(0);A;){var r=A.effects.filter(function(o){return!Xd(o)});if(t||A.container.styles.position!==0||!A.parent){if(i.unshift.apply(i,r),t=[2,3].indexOf(A.container.styles.position)===-1,A.container.styles.overflowX!==0){var s=wa(A.curves),a=Ca(A.curves);jf(s,a)||i.unshift(new Hs(a,6))}}else i.unshift.apply(i,r);A=A.parent}return i.filter(function(o){return Qt(o.target,e)})},n}(),ac=function(n,e,t,A){n.container.elements.forEach(function(i){var r=Qt(i.flags,4),s=Qt(i.flags,2),a=new Jd(i,n);Qt(i.styles.display,2048)&&A.push(a);var o=Qt(i.flags,8)?[]:A;if(r||s){var l=r||i.styles.isPositioned()?t:e,c=new Yd(a);if(i.styles.isPositioned()||i.styles.opacity<1||i.styles.isTransformed()){var u=i.styles.zIndex.order;if(u<0){var f=0;l.negativeZIndex.some(function(g,m){return u>g.element.container.styles.zIndex.order?(f=m,!1):f>0}),l.negativeZIndex.splice(f,0,c)}else if(u>0){var d=0;l.positiveZIndex.some(function(g,m){return u>=g.element.container.styles.zIndex.order?(d=m+1,!1):d>0}),l.positiveZIndex.splice(d,0,c)}else l.zeroOrAutoZIndexOrTransformedOrOpacity.push(c)}else i.styles.isFloating()?l.nonPositionedFloats.push(c):l.nonPositionedInlineLevel.push(c);ac(a,c,r?c:t,o)}else i.styles.isInlineLevel()?e.inlineLevel.push(a):e.nonInlineLevel.push(a),ac(a,e,t,o);Qt(i.flags,8)&&qd(i,o)})},qd=function(n,e){for(var t=n instanceof Ac?n.start:1,A=n instanceof Ac?n.reversed:!1,i=0;i<e.length;i++){var r=e[i];r.container instanceof Id&&typeof r.container.value=="number"&&r.container.value!==0&&(t=r.container.value),r.listValue=Ir(t,r.container.styles.listStyleType,!0),t+=A?-1:1}},Vy=function(n){var e=new Jd(n,null),t=new Yd(e),A=[];return ac(e,t,t,A),qd(e.container,A),t},$f=function(n,e){switch(e){case 0:return xA(n.topLeftBorderBox,n.topLeftPaddingBox,n.topRightBorderBox,n.topRightPaddingBox);case 1:return xA(n.topRightBorderBox,n.topRightPaddingBox,n.bottomRightBorderBox,n.bottomRightPaddingBox);case 2:return xA(n.bottomRightBorderBox,n.bottomRightPaddingBox,n.bottomLeftBorderBox,n.bottomLeftPaddingBox);case 3:default:return xA(n.bottomLeftBorderBox,n.bottomLeftPaddingBox,n.topLeftBorderBox,n.topLeftPaddingBox)}},Ky=function(n,e){switch(e){case 0:return xA(n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox,n.topRightBorderBox,n.topRightBorderDoubleOuterBox);case 1:return xA(n.topRightBorderBox,n.topRightBorderDoubleOuterBox,n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox);case 2:return xA(n.bottomRightBorderBox,n.bottomRightBorderDoubleOuterBox,n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox);case 3:default:return xA(n.bottomLeftBorderBox,n.bottomLeftBorderDoubleOuterBox,n.topLeftBorderBox,n.topLeftBorderDoubleOuterBox)}},ky=function(n,e){switch(e){case 0:return xA(n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox,n.topRightBorderDoubleInnerBox,n.topRightPaddingBox);case 1:return xA(n.topRightBorderDoubleInnerBox,n.topRightPaddingBox,n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox);case 2:return xA(n.bottomRightBorderDoubleInnerBox,n.bottomRightPaddingBox,n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox);case 3:default:return xA(n.bottomLeftBorderDoubleInnerBox,n.bottomLeftPaddingBox,n.topLeftBorderDoubleInnerBox,n.topLeftPaddingBox)}},zy=function(n,e){switch(e){case 0:return Ps(n.topLeftBorderStroke,n.topRightBorderStroke);case 1:return Ps(n.topRightBorderStroke,n.bottomRightBorderStroke);case 2:return Ps(n.bottomRightBorderStroke,n.bottomLeftBorderStroke);case 3:default:return Ps(n.bottomLeftBorderStroke,n.topLeftBorderStroke)}},Ps=function(n,e){var t=[];return gA(n)?t.push(n.subdivide(.5,!1)):t.push(n),gA(e)?t.push(e.subdivide(.5,!0)):t.push(e),t},xA=function(n,e,t,A){var i=[];return gA(n)?i.push(n.subdivide(.5,!1)):i.push(n),gA(t)?i.push(t.subdivide(.5,!0)):i.push(t),gA(A)?i.push(A.subdivide(.5,!0).reverse()):i.push(A),gA(e)?i.push(e.subdivide(.5,!1).reverse()):i.push(e),i},Zd=function(n){var e=n.bounds,t=n.styles;return e.add(t.borderLeftWidth,t.borderTopWidth,-(t.borderRightWidth+t.borderLeftWidth),-(t.borderTopWidth+t.borderBottomWidth))},_a=function(n){var e=n.styles,t=n.bounds,A=rt(e.paddingLeft,t.width),i=rt(e.paddingRight,t.width),r=rt(e.paddingTop,t.width),s=rt(e.paddingBottom,t.width);return t.add(A+e.borderLeftWidth,r+e.borderTopWidth,-(e.borderRightWidth+e.borderLeftWidth+A+i),-(e.borderTopWidth+e.borderBottomWidth+r+s))},Wy=function(n,e){return n===0?e.bounds:n===2?_a(e):Zd(e)},Xy=function(n,e){return n===0?e.bounds:n===2?_a(e):Zd(e)},Yo=function(n,e,t){var A=Wy(Qi(n.styles.backgroundOrigin,e),n),i=Xy(Qi(n.styles.backgroundClip,e),n),r=Yy(Qi(n.styles.backgroundSize,e),t,A),s=r[0],a=r[1],o=wr(Qi(n.styles.backgroundPosition,e),A.width-s,A.height-a),l=Jy(Qi(n.styles.backgroundRepeat,e),o,r,A,i),c=Math.round(A.left+o[0]),u=Math.round(A.top+o[1]);return[l,c,u,s,a]},Si=function(n){return nt(n)&&n.value===Gi.AUTO},Ns=function(n){return typeof n=="number"},Yy=function(n,e,t){var A=e[0],i=e[1],r=e[2],s=n[0],a=n[1];if(!s)return[0,0];if(St(s)&&a&&St(a))return[rt(s,t.width),rt(a,t.height)];var o=Ns(r);if(nt(s)&&(s.value===Gi.CONTAIN||s.value===Gi.COVER)){if(Ns(r)){var l=t.width/t.height;return l<r!=(s.value===Gi.COVER)?[t.width,t.width/r]:[t.height*r,t.height]}return[t.width,t.height]}var c=Ns(A),u=Ns(i),f=c||u;if(Si(s)&&(!a||Si(a))){if(c&&u)return[A,i];if(!o&&!f)return[t.width,t.height];if(f&&o){var d=c?A:i*r,g=u?i:A/r;return[d,g]}var m=c?A:t.width,p=u?i:t.height;return[m,p]}if(o){var h=0,C=0;return St(s)?h=rt(s,t.width):St(a)&&(C=rt(a,t.height)),Si(s)?h=C*r:(!a||Si(a))&&(C=h/r),[h,C]}var v=null,y=null;if(St(s)?v=rt(s,t.width):a&&St(a)&&(y=rt(a,t.height)),v!==null&&(!a||Si(a))&&(y=c&&u?v/A*i:t.height),y!==null&&Si(s)&&(v=c&&u?y/i*A:t.width),v!==null&&y!==null)return[v,y];throw new Error("Unable to calculate background-size for element")},Qi=function(n,e){var t=n[e];return typeof t>"u"?n[0]:t},Jy=function(n,e,t,A,i){var r=e[0],s=e[1],a=t[0],o=t[1];switch(n){case 2:return[new ue(Math.round(A.left),Math.round(A.top+s)),new ue(Math.round(A.left+A.width),Math.round(A.top+s)),new ue(Math.round(A.left+A.width),Math.round(o+A.top+s)),new ue(Math.round(A.left),Math.round(o+A.top+s))];case 3:return[new ue(Math.round(A.left+r),Math.round(A.top)),new ue(Math.round(A.left+r+a),Math.round(A.top)),new ue(Math.round(A.left+r+a),Math.round(A.height+A.top)),new ue(Math.round(A.left+r),Math.round(A.height+A.top))];case 1:return[new ue(Math.round(A.left+r),Math.round(A.top+s)),new ue(Math.round(A.left+r+a),Math.round(A.top+s)),new ue(Math.round(A.left+r+a),Math.round(A.top+s+o)),new ue(Math.round(A.left+r),Math.round(A.top+s+o))];default:return[new ue(Math.round(i.left),Math.round(i.top)),new ue(Math.round(i.left+i.width),Math.round(i.top)),new ue(Math.round(i.left+i.width),Math.round(i.height+i.top)),new ue(Math.round(i.left),Math.round(i.height+i.top))]}},qy="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",eh="Hidden Text",Zy=function(){function n(e){this._data={},this._document=e}return n.prototype.parseMetrics=function(e,t){var A=this._document.createElement("div"),i=this._document.createElement("img"),r=this._document.createElement("span"),s=this._document.body;A.style.visibility="hidden",A.style.fontFamily=e,A.style.fontSize=t,A.style.margin="0",A.style.padding="0",A.style.whiteSpace="nowrap",s.appendChild(A),i.src=qy,i.width=1,i.height=1,i.style.margin="0",i.style.padding="0",i.style.verticalAlign="baseline",r.style.fontFamily=e,r.style.fontSize=t,r.style.margin="0",r.style.padding="0",r.appendChild(this._document.createTextNode(eh)),A.appendChild(r),A.appendChild(i);var a=i.offsetTop-r.offsetTop+2;A.removeChild(r),A.appendChild(this._document.createTextNode(eh)),A.style.lineHeight="normal",i.style.verticalAlign="super";var o=i.offsetTop-A.offsetTop+2;return s.removeChild(A),{baseline:a,middle:o}},n.prototype.getMetrics=function(e,t){var A=e+" "+t;return typeof this._data[A]>"u"&&(this._data[A]=this.parseMetrics(e,t)),this._data[A]},n}(),jd=function(){function n(e,t){this.context=e,this.options=t}return n}(),jy=1e4,$y=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i._activeEffects=[],i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),A.canvas||(i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px"),i.fontMetrics=new Zy(document),i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.ctx.textBaseline="bottom",i._activeEffects=[],i.context.logger.debug("Canvas renderer initialized ("+A.width+"x"+A.height+") with scale "+A.scale),i}return e.prototype.applyEffects=function(t){for(var A=this;this._activeEffects.length;)this.popEffect();t.forEach(function(i){return A.applyEffect(i)})},e.prototype.applyEffect=function(t){this.ctx.save(),Oy(t)&&(this.ctx.globalAlpha=t.opacity),Ny(t)&&(this.ctx.translate(t.offsetX,t.offsetY),this.ctx.transform(t.matrix[0],t.matrix[1],t.matrix[2],t.matrix[3],t.matrix[4],t.matrix[5]),this.ctx.translate(-t.offsetX,-t.offsetY)),Xd(t)&&(this.path(t.path),this.ctx.clip()),this._activeEffects.push(t)},e.prototype.popEffect=function(){this._activeEffects.pop(),this.ctx.restore()},e.prototype.renderStack=function(t){return Zt(this,void 0,void 0,function(){var A;return Wt(this,function(i){switch(i.label){case 0:return A=t.element.container.styles,A.isVisible()?[4,this.renderStackContent(t)]:[3,2];case 1:i.sent(),i.label=2;case 2:return[2]}})})},e.prototype.renderNode=function(t){return Zt(this,void 0,void 0,function(){return Wt(this,function(A){switch(A.label){case 0:if(Qt(t.container.flags,16))debugger;return t.container.styles.isVisible()?[4,this.renderNodeBackgroundAndBorders(t)]:[3,3];case 1:return A.sent(),[4,this.renderNodeContent(t)];case 2:A.sent(),A.label=3;case 3:return[2]}})})},e.prototype.renderTextWithLetterSpacing=function(t,A,i){var r=this;if(A===0)this.ctx.fillText(t.text,t.bounds.left,t.bounds.top+i);else{var s=Qc(t.text);s.reduce(function(a,o){return r.ctx.fillText(o,a,t.bounds.top+i),a+r.ctx.measureText(o).width},t.bounds.left)}},e.prototype.createFontStyle=function(t){var A=t.fontVariant.filter(function(s){return s==="normal"||s==="small-caps"}).join(""),i=iU(t.fontFamily).join(", "),r=Gr(t.fontSize)?""+t.fontSize.number+t.fontSize.unit:t.fontSize.number+"px";return[[t.fontStyle,A,t.fontWeight,r,i].join(" "),i,r]},e.prototype.renderTextNode=function(t,A){return Zt(this,void 0,void 0,function(){var i,r,s,a,o,l,c,u,f=this;return Wt(this,function(d){return i=this.createFontStyle(A),r=i[0],s=i[1],a=i[2],this.ctx.font=r,this.ctx.direction=A.direction===1?"rtl":"ltr",this.ctx.textAlign="left",this.ctx.textBaseline="alphabetic",o=this.fontMetrics.getMetrics(s,a),l=o.baseline,c=o.middle,u=A.paintOrder,t.textBounds.forEach(function(g){u.forEach(function(m){switch(m){case 0:f.ctx.fillStyle=Dt(A.color),f.renderTextWithLetterSpacing(g,A.letterSpacing,l);var p=A.textShadow;p.length&&g.text.trim().length&&(p.slice(0).reverse().forEach(function(h){f.ctx.shadowColor=Dt(h.color),f.ctx.shadowOffsetX=h.offsetX.number*f.options.scale,f.ctx.shadowOffsetY=h.offsetY.number*f.options.scale,f.ctx.shadowBlur=h.blur.number,f.renderTextWithLetterSpacing(g,A.letterSpacing,l)}),f.ctx.shadowColor="",f.ctx.shadowOffsetX=0,f.ctx.shadowOffsetY=0,f.ctx.shadowBlur=0),A.textDecorationLine.length&&(f.ctx.fillStyle=Dt(A.textDecorationColor||A.color),A.textDecorationLine.forEach(function(h){switch(h){case 1:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top+l),g.bounds.width,1);break;case 2:f.ctx.fillRect(g.bounds.left,Math.round(g.bounds.top),g.bounds.width,1);break;case 3:f.ctx.fillRect(g.bounds.left,Math.ceil(g.bounds.top+c),g.bounds.width,1);break}}));break;case 1:A.webkitTextStrokeWidth&&g.text.trim().length&&(f.ctx.strokeStyle=Dt(A.webkitTextStrokeColor),f.ctx.lineWidth=A.webkitTextStrokeWidth,f.ctx.lineJoin=window.chrome?"miter":"round",f.ctx.strokeText(g.text,g.bounds.left,g.bounds.top+l)),f.ctx.strokeStyle="",f.ctx.lineWidth=0,f.ctx.lineJoin="miter";break}})}),[2]})})},e.prototype.renderReplacedElement=function(t,A,i){if(i&&t.intrinsicWidth>0&&t.intrinsicHeight>0){var r=_a(t),s=Ca(A);this.path(s),this.ctx.save(),this.ctx.clip(),this.ctx.drawImage(i,0,0,t.intrinsicWidth,t.intrinsicHeight,r.left,r.top,r.width,r.height),this.ctx.restore()}},e.prototype.renderNodeContent=function(t){return Zt(this,void 0,void 0,function(){var A,i,r,s,a,o,C,C,l,c,u,f,y,d,g,I,m,p,h,C,v,y,I;return Wt(this,function(U){switch(U.label){case 0:this.applyEffects(t.getEffects(4)),A=t.container,i=t.curves,r=A.styles,s=0,a=A.textNodes,U.label=1;case 1:return s<a.length?(o=a[s],[4,this.renderTextNode(o,r)]):[3,4];case 2:U.sent(),U.label=3;case 3:return s++,[3,1];case 4:if(!(A instanceof Td))return[3,8];U.label=5;case 5:return U.trys.push([5,7,,8]),[4,this.context.cache.match(A.src)];case 6:return C=U.sent(),this.renderReplacedElement(A,i,C),[3,8];case 7:return U.sent(),this.context.logger.error("Error loading image "+A.src),[3,8];case 8:if(A instanceof bd&&this.renderReplacedElement(A,i,A.canvas),!(A instanceof Qd))return[3,12];U.label=9;case 9:return U.trys.push([9,11,,12]),[4,this.context.cache.match(A.svg)];case 10:return C=U.sent(),this.renderReplacedElement(A,i,C),[3,12];case 11:return U.sent(),this.context.logger.error("Error loading svg "+A.svg.substring(0,255)),[3,12];case 12:return A instanceof Dd&&A.tree?(l=new e(this.context,{scale:this.options.scale,backgroundColor:A.backgroundColor,x:0,y:0,width:A.width,height:A.height}),[4,l.render(A.tree)]):[3,14];case 13:c=U.sent(),A.width&&A.height&&this.ctx.drawImage(c,0,0,A.width,A.height,A.bounds.left,A.bounds.top,A.bounds.width,A.bounds.height),U.label=14;case 14:if(A instanceof Ic&&(u=Math.min(A.bounds.width,A.bounds.height),A.type===ga?A.checked&&(this.ctx.save(),this.path([new ue(A.bounds.left+u*.39363,A.bounds.top+u*.79),new ue(A.bounds.left+u*.16,A.bounds.top+u*.5549),new ue(A.bounds.left+u*.27347,A.bounds.top+u*.44071),new ue(A.bounds.left+u*.39694,A.bounds.top+u*.5649),new ue(A.bounds.left+u*.72983,A.bounds.top+u*.23),new ue(A.bounds.left+u*.84,A.bounds.top+u*.34085),new ue(A.bounds.left+u*.39363,A.bounds.top+u*.79)]),this.ctx.fillStyle=Dt(Gf),this.ctx.fill(),this.ctx.restore()):A.type===ma&&A.checked&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(A.bounds.left+u/2,A.bounds.top+u/2,u/4,0,Math.PI*2,!0),this.ctx.fillStyle=Dt(Gf),this.ctx.fill(),this.ctx.restore())),eU(A)&&A.value.length){switch(f=this.createFontStyle(r),y=f[0],d=f[1],g=this.fontMetrics.getMetrics(y,d).baseline,this.ctx.font=y,this.ctx.fillStyle=Dt(r.color),this.ctx.textBaseline="alphabetic",this.ctx.textAlign=AU(A.styles.textAlign),I=_a(A),m=0,A.styles.textAlign){case 1:m+=I.width/2;break;case 2:m+=I.width;break}p=I.add(m,0,0,-I.height/2+1),this.ctx.save(),this.path([new ue(I.left,I.top),new ue(I.left+I.width,I.top),new ue(I.left+I.width,I.top+I.height),new ue(I.left,I.top+I.height)]),this.ctx.clip(),this.renderTextWithLetterSpacing(new Mr(A.value,p),r.letterSpacing,g),this.ctx.restore(),this.ctx.textBaseline="alphabetic",this.ctx.textAlign="left"}if(!Qt(A.styles.display,2048))return[3,20];if(A.styles.listStyleImage===null)return[3,19];if(h=A.styles.listStyleImage,h.type!==0)return[3,18];C=void 0,v=h.url,U.label=15;case 15:return U.trys.push([15,17,,18]),[4,this.context.cache.match(v)];case 16:return C=U.sent(),this.ctx.drawImage(C,A.bounds.left-(C.width+10),A.bounds.top),[3,18];case 17:return U.sent(),this.context.logger.error("Error loading list-style-image "+v),[3,18];case 18:return[3,20];case 19:t.listValue&&A.styles.listStyleType!==-1&&(y=this.createFontStyle(r)[0],this.ctx.font=y,this.ctx.fillStyle=Dt(r.color),this.ctx.textBaseline="middle",this.ctx.textAlign="right",I=new An(A.bounds.left,A.bounds.top+rt(A.styles.paddingTop,A.bounds.width),A.bounds.width,Ef(r.lineHeight,r.fontSize.number)/2+1),this.renderTextWithLetterSpacing(new Mr(t.listValue,I),r.letterSpacing,Ef(r.lineHeight,r.fontSize.number)/2+2),this.ctx.textBaseline="bottom",this.ctx.textAlign="left"),U.label=20;case 20:return[2]}})})},e.prototype.renderStackContent=function(t){return Zt(this,void 0,void 0,function(){var A,i,h,r,s,h,a,o,h,l,c,h,u,f,h,d,g,h,m,p,h;return Wt(this,function(C){switch(C.label){case 0:if(Qt(t.element.container.flags,16))debugger;return[4,this.renderNodeBackgroundAndBorders(t.element)];case 1:C.sent(),A=0,i=t.negativeZIndex,C.label=2;case 2:return A<i.length?(h=i[A],[4,this.renderStack(h)]):[3,5];case 3:C.sent(),C.label=4;case 4:return A++,[3,2];case 5:return[4,this.renderNodeContent(t.element)];case 6:C.sent(),r=0,s=t.nonInlineLevel,C.label=7;case 7:return r<s.length?(h=s[r],[4,this.renderNode(h)]):[3,10];case 8:C.sent(),C.label=9;case 9:return r++,[3,7];case 10:a=0,o=t.nonPositionedFloats,C.label=11;case 11:return a<o.length?(h=o[a],[4,this.renderStack(h)]):[3,14];case 12:C.sent(),C.label=13;case 13:return a++,[3,11];case 14:l=0,c=t.nonPositionedInlineLevel,C.label=15;case 15:return l<c.length?(h=c[l],[4,this.renderStack(h)]):[3,18];case 16:C.sent(),C.label=17;case 17:return l++,[3,15];case 18:u=0,f=t.inlineLevel,C.label=19;case 19:return u<f.length?(h=f[u],[4,this.renderNode(h)]):[3,22];case 20:C.sent(),C.label=21;case 21:return u++,[3,19];case 22:d=0,g=t.zeroOrAutoZIndexOrTransformedOrOpacity,C.label=23;case 23:return d<g.length?(h=g[d],[4,this.renderStack(h)]):[3,26];case 24:C.sent(),C.label=25;case 25:return d++,[3,23];case 26:m=0,p=t.positiveZIndex,C.label=27;case 27:return m<p.length?(h=p[m],[4,this.renderStack(h)]):[3,30];case 28:C.sent(),C.label=29;case 29:return m++,[3,27];case 30:return[2]}})})},e.prototype.mask=function(t){this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineTo(this.canvas.width,0),this.ctx.lineTo(this.canvas.width,this.canvas.height),this.ctx.lineTo(0,this.canvas.height),this.ctx.lineTo(0,0),this.formatPath(t.slice(0).reverse()),this.ctx.closePath()},e.prototype.path=function(t){this.ctx.beginPath(),this.formatPath(t),this.ctx.closePath()},e.prototype.formatPath=function(t){var A=this;t.forEach(function(i,r){var s=gA(i)?i.start:i;r===0?A.ctx.moveTo(s.x,s.y):A.ctx.lineTo(s.x,s.y),gA(i)&&A.ctx.bezierCurveTo(i.startControl.x,i.startControl.y,i.endControl.x,i.endControl.y,i.end.x,i.end.y)})},e.prototype.renderRepeat=function(t,A,i,r){this.path(t),this.ctx.fillStyle=A,this.ctx.translate(i,r),this.ctx.fill(),this.ctx.translate(-i,-r)},e.prototype.resizeImage=function(t,A,i){var r;if(t.width===A&&t.height===i)return t;var s=(r=this.canvas.ownerDocument)!==null&&r!==void 0?r:document,a=s.createElement("canvas");a.width=Math.max(1,A),a.height=Math.max(1,i);var o=a.getContext("2d");return o.drawImage(t,0,0,t.width,t.height,0,0,A,i),a},e.prototype.renderBackgroundImage=function(t){return Zt(this,void 0,void 0,function(){var A,i,r,s,a,o;return Wt(this,function(l){switch(l.label){case 0:A=t.styles.backgroundImage.length-1,i=function(c){var u,f,d,_,W,q,P,Y,R,g,_,W,q,P,Y,m,p,h,C,v,y,I,U,M,R,x,_,b,k,P,Y,Z,W,q,X,se,ae,pe,De,Ge,J,$;return Wt(this,function(fe){switch(fe.label){case 0:if(c.type!==0)return[3,5];u=void 0,f=c.url,fe.label=1;case 1:return fe.trys.push([1,3,,4]),[4,r.context.cache.match(f)];case 2:return u=fe.sent(),[3,4];case 3:return fe.sent(),r.context.logger.error("Error loading background-image "+f),[3,4];case 4:return u&&(d=Yo(t,A,[u.width,u.height,u.width/u.height]),_=d[0],W=d[1],q=d[2],P=d[3],Y=d[4],R=r.ctx.createPattern(r.resizeImage(u,P,Y),"repeat"),r.renderRepeat(_,R,W,q)),[3,6];case 5:N_(c)?(g=Yo(t,A,[null,null,null]),_=g[0],W=g[1],q=g[2],P=g[3],Y=g[4],m=L_(c.angle,P,Y),p=m[0],h=m[1],C=m[2],v=m[3],y=m[4],I=document.createElement("canvas"),I.width=P,I.height=Y,U=I.getContext("2d"),M=U.createLinearGradient(h,v,C,y),_f(c.stops,p).forEach(function(ce){return M.addColorStop(ce.stop,Dt(ce.color))}),U.fillStyle=M,U.fillRect(0,0,P,Y),P>0&&Y>0&&(R=r.ctx.createPattern(I,"repeat"),r.renderRepeat(_,R,W,q))):O_(c)&&(x=Yo(t,A,[null,null,null]),_=x[0],b=x[1],k=x[2],P=x[3],Y=x[4],Z=c.position.length===0?[Fc]:c.position,W=rt(Z[0],P),q=rt(Z[Z.length-1],Y),X=R_(c,W,q,P,Y),se=X[0],ae=X[1],se>0&&ae>0&&(pe=r.ctx.createRadialGradient(b+W,k+q,0,b+W,k+q,se),_f(c.stops,se*2).forEach(function(ce){return pe.addColorStop(ce.stop,Dt(ce.color))}),r.path(_),r.ctx.fillStyle=pe,se!==ae?(De=t.bounds.left+.5*t.bounds.width,Ge=t.bounds.top+.5*t.bounds.height,J=ae/se,$=1/J,r.ctx.save(),r.ctx.translate(De,Ge),r.ctx.transform(1,0,0,J,0,0),r.ctx.translate(-De,-Ge),r.ctx.fillRect(b,$*(k-Ge)+Ge,P,Y*$),r.ctx.restore()):r.ctx.fill())),fe.label=6;case 6:return A--,[2]}})},r=this,s=0,a=t.styles.backgroundImage.slice(0).reverse(),l.label=1;case 1:return s<a.length?(o=a[s],[5,i(o)]):[3,4];case 2:l.sent(),l.label=3;case 3:return s++,[3,1];case 4:return[2]}})})},e.prototype.renderSolidBorder=function(t,A,i){return Zt(this,void 0,void 0,function(){return Wt(this,function(r){return this.path($f(i,A)),this.ctx.fillStyle=Dt(t),this.ctx.fill(),[2]})})},e.prototype.renderDoubleBorder=function(t,A,i,r){return Zt(this,void 0,void 0,function(){var s,a;return Wt(this,function(o){switch(o.label){case 0:return A<3?[4,this.renderSolidBorder(t,i,r)]:[3,2];case 1:return o.sent(),[2];case 2:return s=Ky(r,i),this.path(s),this.ctx.fillStyle=Dt(t),this.ctx.fill(),a=ky(r,i),this.path(a),this.ctx.fill(),[2]}})})},e.prototype.renderNodeBackgroundAndBorders=function(t){return Zt(this,void 0,void 0,function(){var A,i,r,s,a,o,l,c,u=this;return Wt(this,function(f){switch(f.label){case 0:return this.applyEffects(t.getEffects(2)),A=t.container.styles,i=!yn(A.backgroundColor)||A.backgroundImage.length,r=[{style:A.borderTopStyle,color:A.borderTopColor,width:A.borderTopWidth},{style:A.borderRightStyle,color:A.borderRightColor,width:A.borderRightWidth},{style:A.borderBottomStyle,color:A.borderBottomColor,width:A.borderBottomWidth},{style:A.borderLeftStyle,color:A.borderLeftColor,width:A.borderLeftWidth}],s=tU(Qi(A.backgroundClip,0),t.curves),i||A.boxShadow.length?(this.ctx.save(),this.path(s),this.ctx.clip(),yn(A.backgroundColor)||(this.ctx.fillStyle=Dt(A.backgroundColor),this.ctx.fill()),[4,this.renderBackgroundImage(t.container)]):[3,2];case 1:f.sent(),this.ctx.restore(),A.boxShadow.slice(0).reverse().forEach(function(d){u.ctx.save();var g=wa(t.curves),m=d.inset?0:jy,p=Gy(g,-m+(d.inset?1:-1)*d.spread.number,(d.inset?1:-1)*d.spread.number,d.spread.number*(d.inset?-2:2),d.spread.number*(d.inset?-2:2));d.inset?(u.path(g),u.ctx.clip(),u.mask(p)):(u.mask(g),u.ctx.clip(),u.path(p)),u.ctx.shadowOffsetX=d.offsetX.number+m,u.ctx.shadowOffsetY=d.offsetY.number,u.ctx.shadowColor=Dt(d.color),u.ctx.shadowBlur=d.blur.number,u.ctx.fillStyle=d.inset?Dt(d.color):"rgba(0,0,0,1)",u.ctx.fill(),u.ctx.restore()}),f.label=2;case 2:a=0,o=0,l=r,f.label=3;case 3:return o<l.length?(c=l[o],c.style!==0&&!yn(c.color)&&c.width>0?c.style!==2?[3,5]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,2)]:[3,11]):[3,13];case 4:return f.sent(),[3,11];case 5:return c.style!==3?[3,7]:[4,this.renderDashedDottedBorder(c.color,c.width,a,t.curves,3)];case 6:return f.sent(),[3,11];case 7:return c.style!==4?[3,9]:[4,this.renderDoubleBorder(c.color,c.width,a,t.curves)];case 8:return f.sent(),[3,11];case 9:return[4,this.renderSolidBorder(c.color,a,t.curves)];case 10:f.sent(),f.label=11;case 11:a++,f.label=12;case 12:return o++,[3,3];case 13:return[2]}})})},e.prototype.renderDashedDottedBorder=function(t,A,i,r,s){return Zt(this,void 0,void 0,function(){var a,o,l,c,u,f,d,g,m,p,h,C,v,y,I,U,I,U;return Wt(this,function(M){return this.ctx.save(),a=zy(r,i),o=$f(r,i),s===2&&(this.path(o),this.ctx.clip()),gA(o[0])?(l=o[0].start.x,c=o[0].start.y):(l=o[0].x,c=o[0].y),gA(o[1])?(u=o[1].end.x,f=o[1].end.y):(u=o[1].x,f=o[1].y),i===0||i===2?d=Math.abs(l-u):d=Math.abs(c-f),this.ctx.beginPath(),s===3?this.formatPath(a):this.formatPath(o.slice(0,2)),g=A<3?A*3:A*2,m=A<3?A*2:A,s===3&&(g=A,m=A),p=!0,d<=g*2?p=!1:d<=g*2+m?(h=d/(2*g+m),g*=h,m*=h):(C=Math.floor((d+m)/(g+m)),v=(d-C*g)/(C-1),y=(d-(C+1)*g)/C,m=y<=0||Math.abs(m-v)<Math.abs(m-y)?v:y),p&&(s===3?this.ctx.setLineDash([0,g+m]):this.ctx.setLineDash([g,m])),s===3?(this.ctx.lineCap="round",this.ctx.lineWidth=A):this.ctx.lineWidth=A*2+1.1,this.ctx.strokeStyle=Dt(t),this.ctx.stroke(),this.ctx.setLineDash([]),s===2&&(gA(o[0])&&(I=o[3],U=o[0],this.ctx.beginPath(),this.formatPath([new ue(I.end.x,I.end.y),new ue(U.start.x,U.start.y)]),this.ctx.stroke()),gA(o[1])&&(I=o[1],U=o[2],this.ctx.beginPath(),this.formatPath([new ue(I.end.x,I.end.y),new ue(U.start.x,U.start.y)]),this.ctx.stroke())),this.ctx.restore(),[2]})})},e.prototype.render=function(t){return Zt(this,void 0,void 0,function(){var A;return Wt(this,function(i){switch(i.label){case 0:return this.options.backgroundColor&&(this.ctx.fillStyle=Dt(this.options.backgroundColor),this.ctx.fillRect(this.options.x,this.options.y,this.options.width,this.options.height)),A=Vy(t),[4,this.renderStack(A)];case 1:return i.sent(),this.applyEffects([]),[2,this.canvas]}})})},e}(jd),eU=function(n){return n instanceof Rd||n instanceof Ld?!0:n instanceof Ic&&n.type!==ma&&n.type!==ga},tU=function(n,e){switch(n){case 0:return wa(e);case 2:return Dy(e);case 1:default:return Ca(e)}},AU=function(n){switch(n){case 1:return"center";case 2:return"right";case 0:default:return"left"}},nU=["-apple-system","system-ui"],iU=function(n){return/iPhone OS 15_(0|1)/.test(window.navigator.userAgent)?n.filter(function(e){return nU.indexOf(e)===-1}):n},rU=function(n){bA(e,n);function e(t,A){var i=n.call(this,t,A)||this;return i.canvas=A.canvas?A.canvas:document.createElement("canvas"),i.ctx=i.canvas.getContext("2d"),i.options=A,i.canvas.width=Math.floor(A.width*A.scale),i.canvas.height=Math.floor(A.height*A.scale),i.canvas.style.width=A.width+"px",i.canvas.style.height=A.height+"px",i.ctx.scale(i.options.scale,i.options.scale),i.ctx.translate(-A.x,-A.y),i.context.logger.debug("EXPERIMENTAL ForeignObject renderer initialized ("+A.width+"x"+A.height+" at "+A.x+","+A.y+") with scale "+A.scale),i}return e.prototype.render=function(t){return Zt(this,void 0,void 0,function(){var A,i;return Wt(this,function(r){switch(r.label){case 0:return A=tc(this.options.width*this.options.scale,this.options.height*this.options.scale,this.options.scale,this.options.scale,t),[4,sU(A)];case 1:return i=r.sent(),this.options.backgroundColor&&(this.ctx.fillStyle=Dt(this.options.backgroundColor),this.ctx.fillRect(0,0,this.options.width*this.options.scale,this.options.height*this.options.scale)),this.ctx.drawImage(i,-this.options.x*this.options.scale,-this.options.y*this.options.scale),[2,this.canvas]}})})},e}(jd),sU=function(n){return new Promise(function(e,t){var A=new Image;A.onload=function(){e(A)},A.onerror=t,A.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(new XMLSerializer().serializeToString(n))})},aU=function(){function n(e){var t=e.id,A=e.enabled;this.id=t,this.enabled=A,this.start=Date.now()}return n.prototype.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.debug=="function"?console.debug.apply(console,ms([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.getTime=function(){return Date.now()-this.start},n.prototype.info=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&typeof window<"u"&&window.console&&typeof console.info=="function"&&console.info.apply(console,ms([this.id,this.getTime()+"ms"],e))},n.prototype.warn=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.warn=="function"?console.warn.apply(console,ms([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.prototype.error=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this.enabled&&(typeof window<"u"&&window.console&&typeof console.error=="function"?console.error.apply(console,ms([this.id,this.getTime()+"ms"],e)):this.info.apply(this,e))},n.instances={},n}(),oU=function(){function n(e,t){var A;this.windowBounds=t,this.instanceName="#"+n.instanceCount++,this.logger=new aU({id:this.instanceName,enabled:e.logging}),this.cache=(A=e.cache)!==null&&A!==void 0?A:new Sy(this,e)}return n.instanceCount=1,n}(),lU=function(n,e){return e===void 0&&(e={}),cU(n,e)};typeof window<"u"&&Wd.setContext(window);var cU=function(n,e){return Zt(void 0,void 0,void 0,function(){var t,A,i,r,s,a,o,l,c,u,f,d,g,m,p,h,C,v,y,I,M,U,M,R,x,_,b,k,P,Y,Z,W,q,X,se,ae,pe,De,Ge,J;return Wt(this,function($){switch($.label){case 0:if(!n||typeof n!="object")return[2,Promise.reject("Invalid element provided as first argument")];if(t=n.ownerDocument,!t)throw new Error("Element is not attached to a Document");if(A=t.defaultView,!A)throw new Error("Document is not attached to a Window");return i={allowTaint:(R=e.allowTaint)!==null&&R!==void 0?R:!1,imageTimeout:(x=e.imageTimeout)!==null&&x!==void 0?x:15e3,proxy:e.proxy,useCORS:(_=e.useCORS)!==null&&_!==void 0?_:!1},r=Ol({logging:(b=e.logging)!==null&&b!==void 0?b:!0,cache:e.cache},i),s={windowWidth:(k=e.windowWidth)!==null&&k!==void 0?k:A.innerWidth,windowHeight:(P=e.windowHeight)!==null&&P!==void 0?P:A.innerHeight,scrollX:(Y=e.scrollX)!==null&&Y!==void 0?Y:A.pageXOffset,scrollY:(Z=e.scrollY)!==null&&Z!==void 0?Z:A.pageYOffset},a=new An(s.scrollX,s.scrollY,s.windowWidth,s.windowHeight),o=new oU(r,a),l=(W=e.foreignObjectRendering)!==null&&W!==void 0?W:!1,c={allowTaint:(q=e.allowTaint)!==null&&q!==void 0?q:!1,onclone:e.onclone,ignoreElements:e.ignoreElements,inlineImages:l,copyStyles:l},o.logger.debug("Starting document clone with size "+a.width+"x"+a.height+" scrolled to "+-a.left+","+-a.top),u=new qf(o,n,c),f=u.clonedReferenceElement,f?[4,u.toIFrame(t,a)]:[2,Promise.reject("Unable to find element in cloned iframe")];case 1:return d=$.sent(),g=Lc(f)||uy(f)?Gw(f.ownerDocument):La(o,f),m=g.width,p=g.height,h=g.left,C=g.top,v=uU(o,f,e.backgroundColor),y={canvas:e.canvas,backgroundColor:v,scale:(se=(X=e.scale)!==null&&X!==void 0?X:A.devicePixelRatio)!==null&&se!==void 0?se:1,x:((ae=e.x)!==null&&ae!==void 0?ae:0)+h,y:((pe=e.y)!==null&&pe!==void 0?pe:0)+C,width:(De=e.width)!==null&&De!==void 0?De:Math.ceil(m),height:(Ge=e.height)!==null&&Ge!==void 0?Ge:Math.ceil(p)},l?(o.logger.debug("Document cloned, using foreign object rendering"),M=new rU(o,y),[4,M.render(f)]):[3,3];case 2:return I=$.sent(),[3,5];case 3:return o.logger.debug("Document cloned, element located at "+h+","+C+" with size "+m+"x"+p+" using computed rendering"),o.logger.debug("Starting DOM parsing"),U=Pd(o,f),v===U.styles.backgroundColor&&(U.styles.backgroundColor=$A.TRANSPARENT),o.logger.debug("Starting renderer for element at "+y.x+","+y.y+" with size "+y.width+"x"+y.height),M=new $y(o,y),[4,M.render(U)];case 4:I=$.sent(),$.label=5;case 5:return(!((J=e.removeContainer)!==null&&J!==void 0)||J)&&(qf.destroy(d)||o.logger.error("Cannot detach cloned iframe as it is not in the DOM anymore")),o.logger.debug("Finished rendering"),[2,I]}})})},uU=function(n,e,t){var A=e.ownerDocument,i=A.documentElement?yr(n,getComputedStyle(A.documentElement).backgroundColor):$A.TRANSPARENT,r=A.body?yr(n,getComputedStyle(A.body).backgroundColor):$A.TRANSPARENT,s=typeof t=="string"?yr(n,t):t===null?$A.TRANSPARENT:4294967295;return e===A.documentElement?yn(i)?yn(r)?s:r:i:s};const xt={UNIVERSE:1e8,GALAXY:1e6,SYSTEM:500,G:50},oc={LOW:{starCount:1e5,clusterCount:200},MED:{starCount:25e4,clusterCount:300},HIGH:{starCount:5e5,clusterCount:400},ULTRA:{starCount:1e6,clusterCount:500}},ct={starCount:oc.HIGH.starCount,clusterCount:oc.HIGH.clusterCount,filamentScatter:.04,seed:1337},Ii=[{id:"O",prob:1e-4,color:10066431,temp:"30,000+",mass:60,rad:8,lum:"30,000+",lifespan:.01},{id:"B",prob:.0013,color:11184895,temp:"10,000-30,000",mass:10,rad:5,lum:"25-30,000",lifespan:.1},{id:"A",prob:.006,color:16777215,temp:"7,500-10,000",mass:3,rad:2.5,lum:"5-25",lifespan:1},{id:"F",prob:.03,color:16777198,temp:"6,000-7,500",mass:1.5,rad:1.3,lum:"1.5-5",lifespan:4},{id:"G",prob:.076,color:16768256,temp:"5,200-6,000",mass:1,rad:1,lum:"0.6-1.5",lifespan:10},{id:"K",prob:.121,color:16755234,temp:"3,700-5,200",mass:.7,rad:.8,lum:"0.08-0.6",lifespan:30},{id:"M",prob:.7645,color:16724736,temp:"2,400-3,700",mass:.3,rad:.4,lum:"< 0.08",lifespan:1e3},{id:"BH",prob:0,color:0,temp:"UNDEFINED",mass:20,rad:.05,lum:"0",lifespan:9999},{id:"N",prob:0,color:65535,temp:"600,000",mass:2.5,rad:.02,lum:"0.001",lifespan:9999},{id:"WD",prob:0,color:12320767,temp:"100,000",mass:.9,rad:.1,lum:"0.01",lifespan:9999}],Yn=`
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
`;let Te,st,re,Ce,vA,_t,At,it,ut,Ht,YA,na,Rc=new Xh,mn=!1,Jo=new ye,_n=!1,lA=null;const mA=new Set;let Zn=!1,ia=0,Os=null,Gs=null,aA=null,S=null;const Vs=new Yh,hr=new at,Fi=new Q,th=new Q,Ks=new Q,Di=new Q,ks=new Q;function qo(n){const e=Math.abs(n);return e>=1e7?n.toExponential(2):e>=1e4?Math.round(n).toLocaleString():n.toFixed(1)}function xa(){var i,r,s;const n=(((i=L.activeGalaxyData)==null?void 0:i.designation)||`SEED-${ct.seed}`).split("").reduce((a,o)=>a*31+o.charCodeAt(0)>>>0,0),e=/QUASAR|AGN/i.test(((r=L.activeGalaxyData)==null?void 0:r.type)||""),t=1e6+n%9e6,A=(.02+n%400/1e4).toFixed(3);return{designation:(s=L.activeGalaxyData)!=null&&s.designation?`${L.activeGalaxyData.designation} ${e?"QUASAR":"CORE"}`:e?"QUASAR CORE":"GALACTIC CORE",typeObj:{id:"BH",color:65280},state:"REMNANT",age:L.universeSimTime.toFixed(3),mass:t.toLocaleString(),radius:A,lum:e?"ACTIVE":"0",spectrum:[],composition:e?`AGN: ACTIVE (QUASAR)
ACCRETION: EXTREME
MASS: ${t.toLocaleString()} M☉`:`EVENT HORIZON: STABLE
ACCRETION: ACTIVE
MASS: ${t.toLocaleString()} M☉`}}function $d(){if(L.autopilotPriorityTargets=[],!L.isAutopilot||L.viewLevel!==1||!ut||ut.children.length===0)return;const n=xa();ut.children.forEach(e=>{!e||typeof e.getWorldPosition!="function"||L.autopilotPriorityTargets.push({object:e,data:n})})}function dr(){L.isAutopilot&&(L.isAutopilot=!1,L.autopilotPriorityTargets=[],hc&&(hc.checked=!1))}let Ah,Ea;const Fr=4,Un={uBHCount:{value:0},uBHPos:{value:new Array(Fr).fill(new ye(0,0))},uBHMass:{value:new Array(Fr).fill(0)}};let Lr=[],RA=[],Vi=[],L={universeSimTime:13.8,galaxySimTime:0,isPaused:!1,timeScale:.1,viewLevel:0,isTransitioning:!1,transitionTarget:new Q,transitionData:null,transitionProgress:0,nextLevel:0,worldOffset:new Q(0,0,0),currentGalaxyType:0,pixelationFactor:1,selectedTarget:null,activeGalaxyData:null,activeSystemData:null,isAutopilot:!0,autopilotTimer:0,autopilotNextAction:2,visitedSystemsCount:0,lastGalaxyVisitTime:0,autopilotZooming:!1,autopilotPanelHidden:!1,autopilotPriorityTargets:[],planetTourIndex:0,trackingTarget:null,inspectingTarget:null,inspectingTargetPreviousPos:null,bigBangFlash:0};const Zo=document.getElementById("c-x"),jo=document.getElementById("c-y"),$o=document.getElementById("c-z"),nh=document.getElementById("time"),fU=document.getElementById("fps"),hU=document.getElementById("objects"),dU=document.getElementById("seed-disp");let lc=document.getElementById("pause-btn"),JA=document.getElementById("back-btn");const pU=document.getElementById("timestep-slider"),ka=document.getElementById("alert-box"),el=document.getElementById("alert-title"),Ki=document.getElementById("alert-msg");document.getElementById("alert-dismiss");document.getElementById("config-btn");const cc=document.getElementById("config-modal"),gU=document.getElementById("config-close"),uc=document.getElementById("retro-slider"),fc=document.getElementById("retro-val"),mU=document.getElementById("crt-toggle"),hc=document.getElementById("autopilot-toggle"),ih=document.getElementById("crt-overlay");let ya=document.getElementById("status-toggle-btn");document.getElementById("sim-toggle-btn");const Ua=document.getElementById("stats-panel"),Ma=document.getElementById("controls-panel"),BU=document.getElementById("stats-close"),vU=document.getElementById("sim-close"),ep=document.getElementById("loc-btn"),BA=document.getElementById("target-panel"),wU=document.getElementById("target-close"),CU=document.getElementById("target-title"),_U=document.getElementById("t-name"),zs=document.getElementById("t-type"),xU=document.getElementById("t-age"),rh=document.getElementById("t-mass"),sh=document.getElementById("t-rad"),ah=document.getElementById("t-lum"),oh=document.getElementById("spectrograph"),EU=document.getElementById("t-composition"),yU=document.getElementById("warp-btn"),Ti=document.getElementById("mouse-cursor");ap();function tp(){const n=document.getElementById("VRButton");n&&n.remove();const e=document.getElementById("vr-button-container"),t=document.createElement("button");if(t.id="VRButton",t.style.width="100%",t.textContent="VR...",t.disabled=!0,(e||document.body).appendChild(t),!(re!=null&&re.xr)||!(navigator!=null&&navigator.xr)){t.style.display="none";return}const A={optionalFeatures:["local-floor","bounded-floor"]};let i=null;const r=()=>{t.textContent=i?"EXIT VR":"ENTER VR"},s=()=>{i&&(i.removeEventListener("end",s),i=null,r())};t.onclick=async()=>{if(i){try{await i.end()}catch{}return}try{re.xr.setReferenceSpaceType("local-floor")}catch{}try{i=await navigator.xr.requestSession("immersive-vr",A),i.addEventListener("end",s),await re.xr.setSession(i),r()}catch(a){console.warn("WebXR session start failed:",a),i=null,t.textContent="VR FAILED",setTimeout(r,1500)}},navigator.xr.isSessionSupported("immersive-vr").then(a=>{if(!a){t.style.display="none";return}t.disabled=!1,r()}).catch(()=>{t.style.display="none"})}function UU(n){let A=1.6/Math.max(.25,Math.min(4,n||1));return A=Math.max(.45,Math.min(1.55,A)),{width:1.6,height:A}}function Ap(n){if(!(S!=null&&S.mesh)||S.planeAspect&&Math.abs(S.planeAspect-n)<.01)return;S.planeAspect=n;const{width:e,height:t}=UU(n);try{S.mesh.geometry.dispose()}catch{}if(S.mesh.geometry=new Fn(e,t),S.bgMesh){try{S.bgMesh.geometry.dispose()}catch{}S.bgMesh.geometry=new Fn(e*1.02,t*1.02)}if(S.border){const i=[new Q(-e/2,-t/2,.002),new Q(e/2,-t/2,.002),new Q(e/2,t/2,.002),new Q(-e/2,t/2,.002),new Q(-e/2,-t/2,.002)];try{S.border.geometry.dispose()}catch{}S.border.geometry=new Pt().setFromPoints(i)}}function Sa(n){S!=null&&S.anchor&&(S.visible=n,S.anchor.visible=n,n?(S.needsCapture=!0,S.lastCaptureMs=0,(S.controllers||[]).forEach(e=>{e!=null&&e.line&&(e.line.visible=!0)})):(S.reticle&&(S.reticle.visible=!1),(S.controllers||[]).forEach(e=>{var t,A;e!=null&&e.line&&(e.line.visible=!1),(A=(t=e==null?void 0:e.controller)==null?void 0:t.userData)!=null&&A.vrUi&&(e.controller.userData.vrUi.hoverEl=null,e.controller.userData.vrUi.activeEl=null,e.controller.userData.vrUi.clickTarget=null,e.controller.userData.vrUi.draggingRange=null,e.controller.userData.vrUi.pressed=!1)})))}function np(n="VR UI"){if(!(S!=null&&S.canvas))return;const e=S.canvas.getContext("2d");if(!e)return;const t=S.canvas.width||1,A=S.canvas.height||1;e.clearRect(0,0,t,A),e.fillStyle="rgba(0, 15, 0, 0.92)",e.fillRect(0,0,t,A),e.strokeStyle="rgba(0, 255, 0, 0.85)";const i=Math.max(2,Math.floor(Math.min(t,A)/220));e.lineWidth=i,e.strokeRect(i/2,i/2,t-i,A-i),e.fillStyle="rgba(0, 255, 0, 0.95)";const r=Math.max(18,Math.floor(Math.min(t,A)/14)),s=Math.max(12,Math.floor(r*.55));e.font=`${r}px monospace`,e.fillText(n,i*2,i*2+r),e.font=`${s}px monospace`,e.fillText("waiting for capture…",i*2,i*2+r+s+6),e.fillText(new Date().toLocaleTimeString(),i*2,i*2+r+(s+6)*2),S.texture&&(S.texture.needsUpdate=!0)}function MU(n){let e=n;for(let t=0;t<6&&e;t++){if(e instanceof HTMLInputElement){if(e.type==="range")return{kind:"range",el:e};if(e.type==="checkbox"||e.type==="button")return{kind:"click",el:e}}if(e instanceof HTMLButtonElement)return{kind:"click",el:e};if(e instanceof HTMLLabelElement)return{kind:"click",el:e};if(e.classList&&e.classList.contains("panel-close"))return{kind:"click",el:e};e=e.parentElement}return n?{kind:"click",el:n}:null}function SU(n,e){if(!n||!e)return;const t=n.querySelectorAll("input, textarea, select"),A=e.querySelectorAll("input, textarea, select"),i=Math.min(t.length,A.length);for(let r=0;r<i;r++){const s=t[r],a=A[r];if(!s||!a)continue;const o=(s.tagName||"").toLowerCase(),l=(a.tagName||"").toLowerCase();if(o===l){if(o==="input"){const c=(s.type||"").toLowerCase();c==="checkbox"||c==="radio"?(a.checked=s.checked,s.checked?a.setAttribute("checked",""):a.removeAttribute("checked")):(a.value=s.value,a.setAttribute("value",s.value??""))}else if(o==="textarea")a.value=s.value,a.textContent=s.value??"";else if(o==="select"){a.selectedIndex=s.selectedIndex;const c=a.options||[],u=s.options||[],f=Math.min(c.length,u.length);for(let d=0;d<f;d++)c[d].selected=!!u[d].selected}}}}function Dc(n,e,t=!1){if(!n)return;const A=n.getBoundingClientRect();if(!A||A.width<=0)return;const i=Number(n.min||0),r=Number(n.max||1),s=Number(n.step||0);let a=(e-A.left)/A.width;a=Math.max(0,Math.min(1,a));let o=i+a*(r-i);Number.isFinite(s)&&s>0&&(o=Math.round(o/s)*s);const l=n.value;n.value=String(o),l!==n.value&&n.dispatchEvent(new Event("input",{bubbles:!0})),t&&n.dispatchEvent(new Event("change",{bubbles:!0}))}function za(){if(!(!S||!re||!st)){S.controllers&&S.controllers.length&&S.controllers.forEach(({controller:n})=>{if(n){try{n.removeEventListener("selectstart",lh)}catch{}try{n.removeEventListener("selectend",ch)}catch{}try{st.remove(n)}catch{}}}),S.controllers=[];for(let n=0;n<2;n++){const e=re.xr.getController(n);e.userData.vrUi={index:n,pointerId:9e3+n,pressed:!1,hoverEl:null,activeEl:null,clickTarget:null,draggingRange:null,clientX:0,clientY:0},e.addEventListener("selectstart",lh),e.addEventListener("selectend",ch);const t=new Pt().setFromPoints([new Q(0,0,0),new Q(0,0,-1)]),A=new Mc({color:65280,transparent:!0,opacity:.8}),i=new zh(t,A);i.name="vr-ui-ray",i.visible=!1,i.renderOrder=998,i.scale.z=2,e.add(i),st.add(e),S.controllers.push({controller:e,line:i})}}}function Hc(){var A;const n=document.getElementById("ui-layer");if(!n||!st)return;if(S||(S={}),S.uiLayer=n,!S.captureHost){let i=document.getElementById("vr-ui-capture-host");i||(i=document.createElement("div"),i.id="vr-ui-capture-host",i.setAttribute("aria-hidden","true"),i.style.position="fixed",i.style.left="0",i.style.top="200vh",i.style.width="1px",i.style.height="1px",i.style.overflow="hidden",i.style.pointerEvents="none",i.style.opacity="0",i.style.zIndex="-1",document.body.appendChild(i)),S.captureHost=i,S.captureLayer=null}if(S.maxCaptureDim=2048,S.captureIntervalMs=500,S.captureInFlight=!1,S.needsCapture=!0,typeof S.dirtyCounter!="number"&&(S.dirtyCounter=0),typeof S.forceCapture!="boolean"&&(S.forceCapture=!1),S.lastCaptureMs=0,S.visible=!1,S.canvas||(S.canvas=document.createElement("canvas"),S.canvas.width=512,S.canvas.height=256),!S.texture){S.texture=new Sw(S.canvas),S.texture.minFilter=fA,S.texture.magFilter=fA,S.texture.generateMipmaps=!1;try{(A=re==null?void 0:re.capabilities)!=null&&A.getMaxAnisotropy&&(S.texture.anisotropy=Math.max(1,re.capabilities.getMaxAnisotropy()))}catch{}S.texture.colorSpace=FA}if(np("VR UI"),S.material?S.material.map=S.texture:(S.material=new Oi({map:S.texture,transparent:!0}),S.material.depthTest=!1,S.material.depthWrite=!1,S.material.side=uA),S.anchor)try{st.remove(S.anchor)}catch{}S.anchor=new Wn,S.anchor.visible=!1,S.anchor.name="vr-ui-anchor",st.add(S.anchor),S.planeAspect=null;const e=window.innerWidth/window.innerHeight;S.mesh=new Ft(new Fn(1,1),S.material),S.mesh.name="vr-ui-plane",S.mesh.frustumCulled=!1,S.mesh.renderOrder=999,S.mesh.rotation.x=-.07,S.anchor.add(S.mesh),S.bgMaterial||(S.bgMaterial=new Oi({color:6656,transparent:!0,opacity:.25}),S.bgMaterial.depthTest=!1,S.bgMaterial.depthWrite=!1,S.bgMaterial.side=uA),S.bgMesh=new Ft(new Fn(1,1),S.bgMaterial),S.bgMesh.name="vr-ui-backdrop",S.bgMesh.frustumCulled=!1,S.bgMesh.renderOrder=998,S.bgMesh.position.z=-.003,S.mesh.add(S.bgMesh),S.borderMaterial||(S.borderMaterial=new Mc({color:65280,transparent:!0,opacity:.6}),S.borderMaterial.depthTest=!1,S.borderMaterial.depthWrite=!1),S.border=new zh(new Pt,S.borderMaterial),S.border.name="vr-ui-border",S.border.renderOrder=1e3,S.mesh.add(S.border),Ap(e);const t=new Oi({color:65280,transparent:!0,opacity:.9});t.depthTest=!1,t.depthWrite=!1,S.reticle=new Ft(new Qa(.008,.012,32),t),S.reticle.name="vr-ui-reticle",S.reticle.visible=!1,S.reticle.position.z=.001,S.reticle.renderOrder=1e3,S.mesh.add(S.reticle),S.mutationObserver&&S.mutationObserver.disconnect(),S.mutationObserver=new MutationObserver(()=>{S&&(S.needsCapture=!0,S.dirtyCounter=(S.dirtyCounter||0)+1)}),S.mutationObserver.observe(n,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),za()}async function Pc(){if(!(S!=null&&S.uiLayer)||!(S!=null&&S.texture)||!S.visible||S.captureInFlight)return;const n=S.uiLayer.getBoundingClientRect();if(!n||n.width<2||n.height<2)return;S.captureInFlight=!0;const e=S.maxCaptureDim||1024,t=Math.min(2,e/Math.max(n.width,n.height)),A=Math.max(2,Math.round(n.width*t)),i=Math.max(2,Math.round(n.height*t));S.canvas&&(S.canvas.width!==A&&(S.canvas.width=A),S.canvas.height!==i&&(S.canvas.height=i));const r=S.dirtyCounter||0,s=!!S.forceCapture;S.forceCapture=!1;let a=S.uiLayer;if(S.captureHost)try{S.captureHost.style.width=`${Math.round(n.width)}px`,S.captureHost.style.height=`${Math.round(n.height)}px`,S.captureHost.innerHTML="";const o=S.uiLayer.cloneNode(!0);S.captureHost.appendChild(o),S.captureLayer=o;try{SU(S.uiLayer,o)}catch{}a=o}catch{a=S.uiLayer}try{await lU(a,{backgroundColor:null,logging:!1,scale:t,useCORS:!0,removeContainer:!0,canvas:S.canvas,ignoreElements:o=>{try{const l=o&&o.tagName?o.tagName.toLowerCase():"";if(l==="canvas"||l==="video"||l==="iframe"||o&&(o.id==="mouse-cursor"||o.id==="crt-overlay"||o.id==="canvas-container"))return!0}catch{}return!1},onclone:o=>{try{const l=o.getElementById("canvas-container");l&&(l.style.display="none");const c=o.getElementById("crt-overlay");c&&(c.style.display="none");const u=o.getElementById("mouse-cursor");u&&(u.style.display="none"),o.documentElement.style.background="transparent",o.body.style.background="transparent",o.querySelectorAll("canvas, video, iframe").forEach(f=>{try{f.style.display="none"}catch{}})}catch{}}}),S.texture.needsUpdate=!0,S.sourceRect=n,S.canvasWidth=S.canvas.width,S.canvasHeight=S.canvas.height,Ap(S.canvasWidth/S.canvasHeight)}catch(o){console.warn("VR UI capture failed:",o),np("CAPTURE FAILED")}finally{S.captureInFlight=!1;const o=S.dirtyCounter||0;S.needsCapture=o!==r,s&&S.needsCapture&&(S.forceCapture=!0),S.lastCaptureMs=performance.now()}}function ip(n){var i;if(!(S!=null&&S.visible)||!((i=re==null?void 0:re.xr)!=null&&i.isPresenting)||!st||!Te)return;const e=re.xr.getCamera(Te);Fi.setFromMatrixPosition(e.matrixWorld),hr.extractRotation(e.matrixWorld),th.set(0,0,-1).applyMatrix4(hr),S.anchor.position.copy(Fi).add(th.multiplyScalar(1.15)),S.anchor.quaternion.setFromRotationMatrix(hr),S.anchor.position.y-=.12;let t=!1;(S.controllers||[]).forEach(({controller:r,line:s})=>{if(!r||!s)return;const a=r.userData.vrUi;if(!a)return;hr.identity().extractRotation(r.matrixWorld),Vs.ray.origin.setFromMatrixPosition(r.matrixWorld),Vs.ray.direction.set(0,0,-1).applyMatrix4(hr).normalize(),Vs.far=10;const o=S.mesh?Vs.intersectObject(S.mesh,!1):[];if(o.length>0){const l=o[0];t=!0,s.scale.z=Math.max(.15,l.distance);const c=l.uv;if(c&&S.canvasWidth&&S.canvasHeight){const u=S.uiLayer.getBoundingClientRect(),f=c.x*S.canvasWidth,d=(1-c.y)*S.canvasHeight,g=u.left+f/S.canvasWidth*u.width,m=u.top+d/S.canvasHeight*u.height;a.clientX=g,a.clientY=m;let p=document.elementFromPoint(g,m);(!p||!S.uiLayer.contains(p))&&(p=null),a.hoverEl=p,a.pressed&&a.draggingRange&&(Dc(a.draggingRange,g,!1),S.needsCapture=!0)}S.reticle&&(Fi.copy(l.point),S.mesh.worldToLocal(Fi),S.reticle.position.set(Fi.x,Fi.y,.001))}else s.scale.z=2,a.hoverEl=null}),S.reticle&&(S.reticle.visible=t);const A=n-(S.lastCaptureMs||0)>=(S.captureIntervalMs||250);!S.captureInFlight&&(S.forceCapture||S.needsCapture&&A)&&Pc()}function lh(n){var i;if(!(S!=null&&S.visible))return;const e=n.target,t=(i=e==null?void 0:e.userData)==null?void 0:i.vrUi;if(!t)return;t.pressed=!0,t.activeEl=t.hoverEl;const A=MU(t.activeEl);A&&(A.kind==="range"?(t.draggingRange=A.el,Dc(A.el,t.clientX,!1),S&&(S.needsCapture=!0,S.dirtyCounter=(S.dirtyCounter||0)+1)):t.clickTarget=A.el)}function ch(n){var A;const e=n.target,t=(A=e==null?void 0:e.userData)==null?void 0:A.vrUi;if(t){if(t.draggingRange)Dc(t.draggingRange,t.clientX,!0),t.draggingRange=null,S&&(S.needsCapture=!0,S.forceCapture=!0,S.dirtyCounter=(S.dirtyCounter||0)+1);else if(t.clickTarget){try{t.clickTarget.click()}catch{}t.clickTarget=null,S&&(S.needsCapture=!0,S.forceCapture=!0,S.dirtyCounter=(S.dirtyCounter||0)+1)}t.pressed=!1,t.activeEl=null}}function rp(){vA=new Nw(re);const n=new Ow(st,Te);vA.addPass(n);const e={uniforms:{tDiffuse:{value:null},uBHCount:Un.uBHCount,uBHPos:Un.uBHPos,uBHMass:Un.uBHMass},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,fragmentShader:`
            uniform sampler2D tDiffuse;
            uniform int uBHCount;
            uniform vec2 uBHPos[${Fr}];
            uniform float uBHMass[${Fr}];
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                vec2 totalOffset = vec2(0.0);
                float halo = 0.0;
                for(int i = 0; i < ${Fr}; i++) {
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
        `};Ah=new Pl(e),vA.addPass(Ah);const t={uniforms:{tDiffuse:{value:null},curvature:{value:new ye(3,3)},uFlash:{value:0}},vertexShader:`
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
        `};Ea=new Pl(t),vA.addPass(Ea)}function FU(n="unknown"){var a,o,l,c;const e=document.getElementById("canvas-container");if(!e||!st||!Te)return;const t=Te.position.clone(),A=Te.quaternion.clone(),i=((o=(a=Ce==null?void 0:Ce.target)==null?void 0:a.clone)==null?void 0:o.call(a))||new Q,r=(Ce==null?void 0:Ce.enabled)??!0;mA.clear(),Zn=!1,_n=!1,lA=null,mn=!1;try{(l=Ce==null?void 0:Ce.dispose)==null||l.call(Ce)}catch{}const s=re==null?void 0:re.domElement;if(s){try{const u=s.getContext("webgl2")||s.getContext("webgl"),f=u&&u.getExtension("WEBGL_lose_context");f&&f.loseContext()}catch{}try{e.removeChild(s)}catch{}}try{(c=re==null?void 0:re.dispose)==null||c.call(re)}catch{}try{re=new kh({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),re.xr.enabled=!0}catch(u){console.error("Graphics rebuild failed:",n,u);return}e.appendChild(re.domElement),tp(),sp(),za(),Ce=new Jh(Te,re.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,Ce.enabled=r,Ce.target.copy(i),Te.position.copy(t),Te.quaternion.copy(A),ki(L.viewLevel),Ce.update(),rp(),Wa();try{re.compile(st,Te)}catch{}re.setAnimationLoop(gp),op()}function sp(){re.xr.addEventListener("sessionstart",()=>{try{re.resetState()}catch{}Te&&Ce?(aA={pos:Te.position.clone(),quat:Te.quaternion.clone(),target:Ce.target.clone(),fov:Te.fov,near:Te.near,far:Te.far,zoom:Te.zoom,controlsEnabled:Ce.enabled,controlsAutoRotate:Ce.autoRotate},Ce.enabled=!1,Ce.autoRotate=!1):aA=null;try{!(S!=null&&S.anchor)||!(S!=null&&S.mesh)?Hc():za(),Sa(!0),Pc(),ip(performance.now())}catch(n){console.warn("VR UI init failed:",n)}Rc.getDelta()}),re.xr.addEventListener("sessionend",()=>{var e;try{Sa(!1)}catch{}const n=re;try{re.setRenderTarget(null),re.resetState()}catch{}try{(e=vA==null?void 0:vA.reset)==null||e.call(vA)}catch{}aA&&Te&&Ce&&(Te.position.copy(aA.pos),Te.quaternion.copy(aA.quat),Te.fov=aA.fov,Te.near=aA.near,Te.far=aA.far,Te.zoom=aA.zoom,Te.updateProjectionMatrix(),Te.updateMatrixWorld(!0),Ce.target.copy(aA.target),Ce.enabled=aA.controlsEnabled,Ce.autoRotate=aA.controlsAutoRotate,Ce.update()),aA=null,ia=3;try{re.clear(!0,!0,!0),re.render(st,Te)}catch{}setTimeout(()=>{re===n&&FU("xr sessionend")},50)})}function ap(){mA.clear(),Zn=!1,_n=!1,lA=null,mn=!1,L.pixelationFactor=Math.max(1,Math.floor(window.innerWidth/750)),uc&&(uc.value=L.pixelationFactor),fc&&(fc.innerText=L.pixelationFactor);const n=document.getElementById("canvas-container");for(;n.firstChild;){if(n.firstChild.tagName==="CANVAS")try{const e=n.firstChild.getContext("webgl2")||n.firstChild.getContext("webgl");e&&e.getExtension("WEBGL_lose_context")&&e.getExtension("WEBGL_lose_context").loseContext()}catch{}n.removeChild(n.firstChild)}re&&(re.dispose(),re=null);try{re=new kh({antialias:!1,powerPreference:"high-performance",logarithmicDepthBuffer:!0}),re.xr.enabled=!0}catch(e){console.error("Critical: WebGL Renderer could not be initialized.",e);return}n.appendChild(re.domElement),tp(),sp(),st=new Uw,st.background=new Oe(0),st.fog=new Uc(0,1e-9),Te=new cA(55,window.innerWidth/window.innerHeight,1,1e12),Ce=new Jh(Te,re.domElement),Ce.enableDamping=!0,Ce.dampingFactor=.05,Ce.autoRotate=!0,Ce.autoRotateSpeed=.2,rp(),Wa(),YA=new Yh,na=new ye,it=new Wn,it.visible=!1,st.add(it),ut=new Wn,st.add(ut),Hc(),pU.value=L.timeScale,dc(ct.seed),L.universeSimTime=0,L.bigBangFlash=1,ki(0),Ua.style.display="none",Ma.style.display="none";try{re.compile(st,Te)}catch{}re.setAnimationLoop(gp),window.removeEventListener("resize",uh),window.addEventListener("resize",uh),op()}function op(){Os&&document.removeEventListener("mousemove",Os),Os=i=>{Ti&&(Ti.style.transform=`translate(${i.clientX}px, ${i.clientY}px)`),!mn&&Jo.distanceTo(new ye(i.clientX,i.clientY))>5&&(mn=!0)},document.addEventListener("mousemove",Os),Gs&&document.body.removeEventListener("mouseover",Gs),Gs=i=>{i.target.matches("button, input, .panel-close, label, a, .clickable")?(Ti.classList.add("active"),Ti.innerHTML="&#8629;"):(Ti.classList.remove("active"),Ti.innerHTML="")},document.body.addEventListener("mouseover",Gs),re.domElement.addEventListener("pointerdown",i=>{mA.add(i.pointerId),Zn=Zn||mA.size>1,_n=!0,lA=i.pointerId,mn=mA.size>1,Jo.set(i.clientX,i.clientY),L.inspectingTarget||(L.trackingTarget=null)}),re.domElement.addEventListener("pointermove",i=>{_n&&(lA!==null&&i.pointerId!==lA||!mn&&Jo.distanceTo(new ye(i.clientX,i.clientY))>5&&(mn=!0))}),re.domElement.addEventListener("pointercancel",i=>{mA.delete(i.pointerId),lA===i.pointerId&&(lA=null),mA.size===0?(_n=!1,lA=null,Zn=!1):(_n=!0,lA===null&&(lA=mA.values().next().value))}),re.domElement.addEventListener("pointerup",RU);const n=(i,r)=>{const s=document.getElementById(i);if(!s)return;const a=s.cloneNode(!0);return s.parentNode.replaceChild(a,s),a.addEventListener("click",r),a};n("reset-btn",()=>dc(Math.floor(Math.random()*1e4))),n("bang-btn",()=>{ap()}),lc=n("pause-btn",()=>{L.isPaused=!L.isPaused,lc.textContent=L.isPaused?"RESUME SIM":"PAUSE SIM",L.isPaused||Rc.getDelta()}),JA=n("back-btn",()=>{if(L.inspectingTarget){L.inspectingTarget=null,L.inspectingTargetPreviousPos=null,Ce.target.set(0,0,0),JA.textContent="BACK TO GALAXY";return}lp()}),n("alert-dismiss",()=>{ka.style.display="none",L.isTransitioning&&cp()});const e=[Ua,Ma,cc,BA],t=i=>{window.innerWidth<=768&&e.forEach(r=>{r!==i&&(r.style.display="none")})},A=(i,r)=>{const s=document.getElementById(i),a=document.getElementById(r);if(!s||!a)return;const o=s.cloneNode(!0);return s.parentNode.replaceChild(o,s),o.addEventListener("click",()=>{const l=a.style.display!=="flex";l&&t(a),a.style.display=l?"flex":"none"}),o};ya=A("status-toggle-btn","stats-panel")||ya,A("sim-toggle-btn","controls-panel"),A("config-btn","config-modal"),BU.onclick=()=>Ua.style.display="none",vU.onclick=()=>Ma.style.display="none",gU.onclick=()=>cc.style.display="none",wU.onclick=()=>{BA.style.display="none",L.selectedTarget=null,L.isAutopilot&&(L.autopilotPanelHidden=!0)},n("loc-btn",()=>{if(L.autopilotPanelHidden=!1,BA.style.display==="flex"){BA.style.display="none";return}t(BA);let i=null;if(L.viewLevel===0)i={designation:`UNIVERSE 0x${ct.seed.toString(16).toUpperCase()}`,type:"COSMIC WEB",age:L.universeSimTime.toFixed(2),mass:`${ct.starCount.toLocaleString()} OBJECTS`,radius:`${(xt.UNIVERSE/1e6).toFixed(1)} MLY`,lum:"N/A",composition:`SEED: 0x${ct.seed.toString(16).toUpperCase()}
OBJECTS: ${ct.starCount.toLocaleString()}`};else if(L.viewLevel===1)i=L.activeGalaxyData;else if(L.viewLevel===2)if(L.inspectingTarget&&L.inspectingTarget.userData&&L.inspectingTarget.userData.type){const r=L.inspectingTarget;i={designation:r.userData.designation||"UNKNOWN",type:r.userData.type||"UNKNOWN",age:L.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:r.userData.composition||"ANALYZING..."}}else i=L.activeSystemData;i&&wA(i,!0)}),yU.onclick=()=>{L.selectedTarget&&(BA.style.display="none",L.selectedTarget.level===0?jn(L.selectedTarget.position,1):L.selectedTarget.level===1?jn(L.selectedTarget.position,2):L.selectedTarget.level===2&&(L.inspectingTarget=L.selectedTarget.object,L.trackingTarget=null,L.inspectingTargetPreviousPos=L.inspectingTarget.position.clone(),Ce.target.copy(L.inspectingTarget.position),JA.textContent="LEAVE ORBIT"))},document.querySelectorAll(".q-btn").forEach(i=>{const r=i.cloneNode(!0);i.parentNode.replaceChild(r,i),r.addEventListener("click",s=>{document.querySelectorAll(".q-btn").forEach(o=>o.classList.remove("active")),s.target.classList.add("active");const a=oc[s.target.getAttribute("data-q")];a&&(ct.starCount=a.starCount,ct.clusterCount=a.clusterCount,L.viewLevel===0?dc(ct.seed):L.viewLevel===1&&pp(L.currentGalaxyType))})}),uc.oninput=i=>{L.pixelationFactor=parseInt(i.target.value),fc.innerText=L.pixelationFactor,Wa()},mU.onchange=i=>i.target.checked?ih.classList.add("crt-effects"):ih.classList.remove("crt-effects"),hc.onchange=i=>{L.isAutopilot=i.target.checked,L.isAutopilot&&(L.autopilotNextAction=0,L.inspectingTarget=null,L.autopilotPanelHidden=!1),L.isAutopilot&&L.viewLevel===1&&L.autopilotPriorityTargets.length===0&&$d()},document.getElementById("timestep-slider").oninput=i=>L.timeScale=parseFloat(i.target.value)}function Wa(){if(!re||!vA)return;Te&&(Te.aspect=window.innerWidth/window.innerHeight,Te.updateProjectionMatrix());const n=L.pixelationFactor===0?1:L.pixelationFactor*.8+1,e=Math.floor(window.innerWidth/n),t=Math.floor(window.innerHeight/n);re.setSize(e,t,!1),vA.setSize(e,t),re.domElement.style.width="100vw",re.domElement.style.height="100vh",_t&&(_t.material.uniforms.uPixelRatio.value=re.getPixelRatio(),_t.material.uniforms.uScreenHeight.value=t),At&&(At.material.uniforms.uPixelRatio.value=re.getPixelRatio(),At.material.uniforms.uScreenHeight.value=t)}function uh(){Wa()}function ki(n){n===0?(Ce.maxDistance=xt.UNIVERSE*2,Ce.minDistance=1e3,Ce.zoomSpeed=1,JA.disabled=!0,JA.textContent="RETURN TO ORBIT"):n===1?(Ce.maxDistance=xt.GALAXY*3,Ce.minDistance=100,Ce.zoomSpeed=2,JA.disabled=!1,JA.textContent="BACK TO UNIVERSE"):n===2&&(Ce.maxDistance=xt.SYSTEM*4,Ce.minDistance=10,Ce.zoomSpeed=3,JA.disabled=!1,JA.textContent="BACK TO GALAXY"),Te.updateProjectionMatrix()}function TU(){L.galaxySimTime=0,L.isPaused=!1,L.isTransitioning=!1,L.viewLevel=0,L.worldOffset.set(0,0,0),L.selectedTarget=null,L.activeGalaxyData=null,L.activeSystemData=null,L.autopilotPriorityTargets=[],L.lastGalaxyVisitTime=0,L.visitedSystemsCount=0,L.planetTourIndex=0,L.trackingTarget=null,L.inspectingTarget=null,L.inspectingTargetPreviousPos=null,L.bigBangFlash=0,RA=[],Vi=[],Lr=[],Un.uBHCount.value=0,ep.style.display="block",_t&&_t.position.set(0,0,0),At&&(At.visible=!1),it&&(it.visible=!1),ut&&ut.clear(),Ht&&(st.remove(Ht),Ht=null),Te.position.set(0,xt.UNIVERSE*.1,xt.UNIVERSE*.2),Ce.target.set(0,0,0),ki(0),Ce.autoRotate=!0,Ce.enabled=!0,lc.textContent="PAUSE SIM",ka.style.display="none",BA.style.display="none"}function lp(){L.isTransitioning||(BA.style.display="none",L.viewLevel===2?jn(new Q(0,xt.GALAXY*.5,0),1,!0):L.viewLevel===1&&jn(new Q(0,xt.UNIVERSE*.1,0),0,!0))}function jn(n,e,t=!1){if(!L.isTransitioning)if(L.isTransitioning=!0,L.transitionTarget.copy(n),L.transitionData=!t&&L.selectedTarget?L.selectedTarget.data:null,L.nextLevel=e,L.transitionProgress=0,Ce.enabled=!1,ka.style.display="block",(!L.isAutopilot||t)&&(BA.style.display="none"),t)el.innerText="LEAVING GRAVITY WELL",Ki.innerText="ACCELERATING TO ESCAPE VELOCITY...";else{const A=Math.floor(Math.abs(n.x+n.y)).toString(16).toUpperCase();e===1?(el.innerText="APPROACHING GALAXY",Ki.innerText=`SECTOR ${A} :: HYPERDRIVE ENGAGED`):(el.innerText="APPROACHING SYSTEM",Ki.innerText=`STAR ${A} :: ORBITAL INSERTION`)}}function cp(){const n=L.nextLevel,e=L.viewLevel;L.viewLevel=n,L.isTransitioning=!1,Ce.enabled=!0,ka.style.display="none";const t=new Q().copy(L.transitionTarget);if(Lr=[],Un.uBHCount.value=0,n>e?L.transitionData?(n===1&&(L.activeGalaxyData=L.transitionData),n===2&&(L.activeSystemData=L.transitionData)):L.selectedTarget&&L.selectedTarget.data&&(n===1&&(L.activeGalaxyData=L.selectedTarget.data),n===2&&(L.activeSystemData=L.selectedTarget.data)):(n===1&&(L.activeSystemData=null),n===0&&(L.activeGalaxyData=null)),ep.style.display="block",n>e&&(Te.position.sub(t),Ce.target.sub(t),_t&&_t.position.sub(t),n===2&&At&&At.position.sub(t),n===2&&ut&&ut.position.sub(t),n===2&&Ht&&Ht.position.sub(t)),n===2&&(L.planetTourIndex=0),n===0)At&&(At.visible=!1),it&&(it.visible=!1),ut&&(ut.visible=!1),Ht&&(Ht.visible=!1),ki(0),Ki.innerText="INTERGALACTIC SPACE";else if(n===1){if(it&&(it.visible=!1),!At||e===0){const A=L.universeSimTime;L.currentGalaxyType=A<3?2:A>10?1:0,pp(L.currentGalaxyType)}if(At&&(At.visible=!0,n>e&&At.position.set(0,0,0)),ut&&(ut.visible=!0,n>e&&ut.position.set(0,0,0)),ut.children.length>0&&Lr.push(ut.children[0]),Ht&&(Ht.visible=!0,n>e&&Ht.position.set(0,0,0)),e===0&&$d(),n>e){if(L.isAutopilot){const A=xt.GALAXY*1.5,i=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.5+.1;Te.position.set(A*Math.sin(r)*Math.cos(i),A*Math.cos(r),A*Math.sin(r)*Math.sin(i)),L.autopilotZooming=!0}else Te.position.set(0,xt.GALAXY*.8,xt.GALAXY*.4);Ce.target.set(0,0,0)}ki(1),Ki.innerText="ARRIVED AT LOCAL GALAXY"}else if(n===2){if(ut&&(ut.visible=!1),Ht&&(Ht.visible=!1),QU(t),it&&(it.visible=!0,it.position.set(0,0,0)),L.isAutopilot){const A=xt.SYSTEM*1.5,i=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.5+.1;Te.position.set(A*Math.sin(r)*Math.cos(i),A*Math.cos(r),A*Math.sin(r)*Math.sin(i)),L.autopilotZooming=!0,L.planetTourIndex=0}else Te.position.set(0,xt.SYSTEM*.4,xt.SYSTEM*.8);Ce.target.set(0,0,0),ki(2),Ki.innerText="SYSTEM ORBIT STABLE"}L.isAutopilot&&n>0&&!L.autopilotPanelHidden&&(BA.style.display="flex",n===1&&L.activeGalaxyData&&wA(L.activeGalaxyData,!0),n===2&&L.activeSystemData&&wA(L.activeSystemData,!0)),n>e&&L.worldOffset.add(t)}function bU(n,e,t){const A=t-e;if(A<.05)return{state:"PROTO",age:A,classObj:n};if(A<n.lifespan)return{state:"MAIN",age:A,classObj:n};if(A<n.lifespan*1.1)return{state:"GIANT",age:A,classObj:n};let i;if(n.id==="O"||n.id==="B")i=Math.random()>.5?"BH":"N";else if(n.id==="A"||n.id==="F"||n.id==="G")i="WD";else return{state:"MAIN",age:A,classObj:n};return{state:"REMNANT",age:A,classObj:Ii.find(r=>r.id===i)}}function up(n,e){let t=n;const A=()=>{const o=Math.sin(t++)*1e4;return o-Math.floor(o)};let i,r,s;e?(i=70+A()*10,r=24+A()*4,s=100-(i+r)):(i=74+A()*5,r=23+A()*2,s=100-(i+r)),s<0&&(s=0);const a=["O","C","Ne","Fe","N","Si","Mg","S"][Math.floor(A()*8)];return`COMPOSITION:
H: ${i.toFixed(2)}% | He: ${r.toFixed(2)}% | Met: ${s.toFixed(2)}%
Trace: ${a}`}function fp(n){let e=n;const t=()=>{const o=Math.sin(e++)*1e4;return o-Math.floor(o)};let A=Ii[Ii.length-2],i=0;const r=t();for(let o=0;o<Ii.length-3;o++)if(i+=Ii[o].prob,r<i){A=Ii[o];break}const s=bU(A,t()*L.universeSimTime,L.universeSimTime),a=[];for(let o=0;o<10;o++)a.push({pos:t()*100,intensity:t()});return{designation:`HIP-${Math.floor(t()*1e5)}`,typeObj:s.classObj,state:s.state,age:s.age.toFixed(3),mass:s.classObj.mass,radius:s.classObj.rad,lum:s.classObj.lum,spectrum:a,composition:up(n,!0)}}function hp(n,e){let t=n;const A=()=>{const r=Math.sin(t++)*1e4;return r-Math.floor(r)};let i="SPIRAL GALAXY";return e<3?A()>.3?i="IRREGULAR GALAXY":A()>.5?i="QUASAR (AGN)":i="PROTO-GALAXY":e>10&&(A()>.4?i="ELLIPTICAL GALAXY":i="LENTICULAR GALAXY"),{designation:`NGC-${Math.floor(A()*5e3)}`,type:i,age:e.toFixed(2),mass:(A()*50+10).toFixed(1)+" Billion",radius:(A()*50+20).toFixed(1)+" kly",lum:"HIGH",spectrum:[],composition:up(n,!1)}}function wA(n,e=!1){if(window.innerWidth<=768&&[Ua,Ma,cc].forEach(s=>s.style.display="none"),CU.innerText=e?"CURRENT LOCATION":"TARGET ANALYSIS",_U.innerText=n.designation,xU.innerText=n.age+" Bn YR",n.typeObj){let s=`CLASS ${n.typeObj.id}`;n.state==="PROTO"?s+=" (PROTO-STAR)":n.state==="GIANT"?s+=" (RED GIANT)":n.state==="REMNANT"&&(s+=" (REMNANT)"),zs.innerText=s,zs.style.color=n.typeObj.id==="BH"?"#0f0":"#"+n.typeObj.color.toString(16).padStart(6,"0"),rh.innerText=n.mass+" M☉",sh.innerText=n.radius+" R☉",ah.innerText=n.lum+" L☉"}else zs.innerText=n.type,zs.style.color="#0f0",rh.innerText=n.mass+" M☉",sh.innerText=n.radius,ah.innerText="VAR";oh.innerHTML="";let t=0;for(let s=0;s<n.designation.length;s++)t+=n.designation.charCodeAt(s);const A=()=>{const s=Math.sin(t++)*1e4;return s-Math.floor(s)},i=["#ff0000","#ff8800","#ffff00","#00ff00","#00ffff","#0088ff","#ff00ff"],r=5+Math.floor(A()*8);for(let s=0;s<r;s++){const a=document.createElement("div");a.className="spec-line";const o=Math.floor(A()*95/5)*5;a.style.left=o+"%",a.style.backgroundColor=i[Math.floor(o/100*i.length)],oh.appendChild(a)}EU.innerText=n.composition||"ANALYZING...",e?document.getElementById("warp-btn").style.display="none":(document.getElementById("warp-btn").style.display="block",document.getElementById("warp-btn").innerText=L.viewLevel===2?"INSPECT ORBIT":"INITIATE HYPERDRIVE"),L.isAutopilot&&L.autopilotPanelHidden?BA.style.display="none":BA.style.display="flex"}function dp(n,e,t,A){const i=new Bn(n,64,64),r=new Oi({color:0}),s=new Ft(i,r);s.position.set(e,t,A),s.userData.isBlackHole=!0;const a=new Qa(n*1.5,n*8,128),o=new Kt({uniforms:{uTime:{value:0},uEHRadius:{value:n},uInnerRadius:{value:n*1.5},uOuterRadius:{value:n*8}},side:uA,transparent:!0,blending:en,depthWrite:!1,vertexShader:`
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
            ${Yn}
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
        `}),l=new Ft(a,o);return l.rotation.x=Math.PI/2,s.add(l),s}function dc(n){for(_t&&(st.remove(_t),_t.geometry.dispose(),_t.material.dispose(),_t=null),At&&(st.remove(At),At.geometry.dispose(),At.material&&At.material.dispose(),At=null);it.children.length>0;){const f=it.children[0];f.geometry&&f.geometry.dispose(),f.material&&f.material.dispose(),it.remove(f)}re&&re.renderLists.dispose(),TU(),ct.seed=n,dU.textContent="0x"+ct.seed.toString(16).toUpperCase(),hU.textContent=ct.starCount.toLocaleString();const e=new Pt,t=new Float32Array(ct.starCount*3),A=new Float32Array(ct.starCount*3),i=new Float32Array(ct.starCount),r=[];let s=n;function a(){const f=Math.sin(s++)*1e4;return f-Math.floor(f)}for(let f=0;f<ct.clusterCount;f++){const d=Math.pow(a(),.5)*xt.UNIVERSE,g=a()*Math.PI*2,m=Math.acos(2*a()-1);r.push(new Q(d*Math.sin(m)*Math.cos(g),d*Math.sin(m)*Math.sin(g),d*Math.cos(m)))}const o=new Oe(4491519),l=new Oe(16755438),c=new Oe(16768426);for(let f=0;f<ct.starCount;f++){const d=f*3,g=Math.floor(a()*ct.clusterCount);let m=g,p=1/0;for(let P=0;P<3;P++){const Y=Math.floor(a()*ct.clusterCount);if(Y===g)continue;const Z=r[g].distanceToSquared(r[Y]);Z<p&&(p=Z,m=Y)}const h=r[g],C=r[m];let v=a();v=v<.5?2*v*v:-1+(4-2*v)*v;const y=h.x+(C.x-h.x)*v,I=h.y+(C.y-h.y)*v,U=h.z+(C.z-h.z)*v,M=xt.UNIVERSE*ct.filamentScatter,R=a()*M,x=a()*Math.PI*2,_=Math.acos(2*a()-1);t[d]=y+R*Math.sin(_)*Math.cos(x),t[d+1]=I+R*Math.sin(_)*Math.sin(x),t[d+2]=U+R*Math.cos(_);const b=a();let k;b<.33?k=o.clone().lerp(l,a()):b<.66?k=l.clone().lerp(c,a()):k=c.clone().lerp(o,a()),A[d]=k.r,A[d+1]=k.g,A[d+2]=k.b,i[f]=a()*4e4+1e4}e.setAttribute("position",new Mt(t,3)),e.setAttribute("color",new Mt(A,3)),e.setAttribute("size",new Mt(i,1));const u=new Kt({uniforms:{uTime:{value:0},uPixelRatio:{value:re.getPixelRatio()},uScreenHeight:{value:window.innerHeight}},vertexShader:`
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
        `,depthWrite:!1,blending:en,vertexColors:!0});_t=new Dl(e,u),_t.frustumCulled=!1,st.add(_t)}function pp(n=0){At&&(st.remove(At),At.geometry.dispose()),Ht&&(st.remove(Ht),Ht=null),ut.clear();const e=ct.starCount,t=new Pt,A=new Float32Array(e*3),i=new Float32Array(e*3),r=new Float32Array(e),s=new Float32Array(e*3),a=xt.GALAXY,o=[];if(n===2)for(let u=0;u<4;u++)o.push(new Q((Math.random()-.5)*a*1.2,(Math.random()-.5)*a*.8,(Math.random()-.5)*a*1.2));for(let u=0;u<e;u++){const f=u*3;let d,g,m,p=1;if(n===0)if(Math.random()<.2){const C=Math.random()*a*.25,v=Math.random()*Math.PI*2,y=Math.acos(2*Math.random()-1);d=C*Math.sin(y)*Math.cos(v),g=C*Math.sin(y)*Math.sin(v)*.8,m=C*Math.cos(y),i[f]=1,i[f+1]=.8,i[f+2]=.4}else{const C=(Math.random()*.1+Math.pow(Math.random(),2)*.9)*a,v=2,I=Math.PI*2/v*(u%v)+7*Math.log(C/a*10+1);d=Math.cos(I)*C+(Math.random()-.5)*a*.1,m=Math.sin(I)*C+(Math.random()-.5)*a*.1,g=(Math.random()-.5)*a*.02*(1+C/a),p=Math.sqrt(1/(C/a+.1)),Math.random()>.3?(i[f]=.6,i[f+1]=.7,i[f+2]=1):(i[f]=1,i[f+1]=1,i[f+2]=1)}else if(n===1){const h=Math.pow(Math.random(),2.5)*a*.6,C=Math.random()*Math.PI*2,v=Math.acos(2*Math.random()-1);d=h*Math.sin(v)*Math.cos(C)*.8,g=h*Math.sin(v)*Math.sin(C)*.6,m=h*Math.cos(v)*.8,p=.1,i[f]=1,i[f+1]=.7,i[f+2]=.3}else{const h=o[u%o.length],C=Math.random()*a*.3,v=Math.random()*Math.PI*2,y=Math.acos(2*Math.random()-1);d=h.x+C*Math.sin(y)*Math.cos(v),g=h.y+C*Math.sin(y)*Math.sin(v),m=h.z+C*Math.cos(y),p=.5,Math.random()>.9?(i[f]=1,i[f+1]=.2,i[f+2]=.1,r[u]=Math.random()*8e3+4e3):(i[f]=.6,i[f+1]=.8,i[f+2]=1)}A[f]=d,A[f+1]=g,A[f+2]=m,r[u]===0&&(r[u]=Math.random()*4e3+1e3),s[f]=Math.sqrt(d*d+m*m),s[f+1]=p,s[f+2]=Math.atan2(m,d)}t.setAttribute("position",new Mt(A,3)),t.setAttribute("color",new Mt(i,3)),t.setAttribute("size",new Mt(r,1)),t.setAttribute("aOrbit",new Mt(s,3));const l=new Kt({uniforms:{uPixelRatio:{value:re.getPixelRatio()},uTime:{value:0},uScreenHeight:{value:window.innerHeight}},vertexShader:`
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
        `,depthWrite:!1,blending:en,vertexColors:!0,transparent:!0});if(At=new Dl(t,l),At.frustumCulled=!1,At.visible=!1,st.add(At),n!==1){const u=n===2?60:30,f=new Pt,d=new Float32Array(u*3),g=new Float32Array(u*3),m=new Float32Array(u);for(let h=0;h<u;h++){const C=Math.random()*a*.8,v=Math.random()*Math.PI*2;d[h*3]=C*Math.cos(v),d[h*3+1]=(Math.random()-.5)*a*.2,d[h*3+2]=C*Math.sin(v),g[h*3]=.4,g[h*3+1]=.1,g[h*3+2]=.6,m[h]=Math.random()*8e5+4e5}f.setAttribute("position",new Mt(d,3)),f.setAttribute("color",new Mt(g,3)),f.setAttribute("size",new Mt(m,1));const p=new Kt({uniforms:{uPixelRatio:{value:re.getPixelRatio()},uScreenHeight:{value:window.innerHeight},uTime:{value:0}},vertexShader:`
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
                varying vec3 vColor; uniform float uTime; ${Yn}
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
            `,transparent:!0,blending:en,depthWrite:!1,vertexColors:!0});Ht=new Dl(f,p),Ht.visible=!1,st.add(Ht)}const c=dp(a*.005,0,0,0);ut.add(c),ut.visible=!1}function QU(n){for(RA=[],Vi=[];it.children.length>0;){const c=it.children[0];c.geometry&&c.geometry.dispose(),c.material&&c.material.dispose(),it.remove(c)}let e=Math.abs(n.x+n.y+n.z);const t=()=>{const c=Math.sin(e++)*1e4;return c-Math.floor(c)},A=xt.SYSTEM,i=xt.G;let r=16755200,s=A*.25,a=!1;if(L.selectedTarget&&L.selectedTarget.data){const c=L.selectedTarget.data;c.typeObj&&(r=c.typeObj.color),c.typeObj.id==="BH"&&(s=A*.1,a=!0)}const o=a?1:t()>.6?t()>.9?3:2:1;for(let c=0;c<o;c++){const u=c===0?1:.5+t()*.5,f=s*u,d=1e3*u;let g;if(a)g=dp(f,0,0,0),Lr.push(g),g.add(new Wu(16755268,1e5,xt.SYSTEM*5)),g.add(new bw(2236979,.5));else{const m=new Bn(f,64,64),p=new Vu({color:r,emissive:r,emissiveIntensity:2});p.onBeforeCompile=v=>{v.uniforms.uTime={value:0},v.vertexShader=`
                    uniform float uTime; varying vec3 vCustomWorldPos; ${Yn}
                `+v.vertexShader,v.vertexShader=v.vertexShader.replace("#include <worldpos_vertex>",`#include <worldpos_vertex>
 vCustomWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),v.vertexShader=v.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>

                    float disp = (snoise(vec3(position * 0.2 + uTime * 0.5)) + snoise(vec3(position * 0.5 - uTime * 0.2))) * 0.05 * ${f.toFixed(2)};
                    transformed += normal * disp;
                `),v.fragmentShader=`uniform float uTime; varying vec3 vCustomWorldPos; ${Yn}`+v.fragmentShader,v.fragmentShader=v.fragmentShader.replace("#include <map_fragment>",`
                    float n = snoise(vec3(vCustomWorldPos * 0.1 + uTime * 0.2));
                    float bright = snoise(vec3(vCustomWorldPos * 0.3 + uTime * 0.5));
                    vec3 base = diffuseColor.rgb;
                    vec3 final = mix(base, base*0.3, smoothstep(0.4, 0.8, n));
                    final = mix(final, base*3.0, smoothstep(0.5, 0.9, bright));
                    diffuseColor.rgb = final;
                `),p.userData.shader=v},g=new Ft(m,p);const h=new Bn(f*1.4,32,32),C=new Kt({uniforms:{uColor:{value:new Oe(r)}},transparent:!0,side:$t,blending:en,vertexShader:"varying vec3 vNorm; void main() { vNorm = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; varying vec3 vNorm; void main() { float i = pow(0.6 - dot(vNorm, vec3(0,0,1)), 4.0); gl_FragColor = vec4(uColor, i*0.6); }"});g.add(new Ft(h,C)),g.add(new Wu(r,3e5,xt.SYSTEM*10,2))}if(it.add(g),o===1)RA.push({mesh:g,mass:d,velocity:new Q(0,0,0),isStar:!0});else{const m=A*.4;g.position.set((c===0?1:-1)*m,0,0);const p=Math.sqrt(i*d/(2*m));RA.push({mesh:g,mass:d,velocity:new Q(0,0,(c===0?1:-1)*p),isStar:!0})}}const l=Math.floor(t()*5)+3;for(let c=0;c<l;c++){const f=(o>1?A*.8:A*.3)+c*A*.2+t()*A*.1,d=A*.01+t()*A*.02,g=d*10,m=c>2&&t()>.3,p=!m,h=new Bn(d,64,64),C=new Vu({color:new Oe().setHSL(t(),m?.8:.2,.5),roughness:.7});C.onBeforeCompile=R=>{R.uniforms.uTime={value:0},R.vertexShader=`varying vec3 vPos; ${Yn}`+R.vertexShader,R.vertexShader=R.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 vPos = position; ${p?`float h = snoise(position*0.2)*0.5 + snoise(position*1.0)*0.2; transformed += normal*h*${d.toFixed(2)}*0.1;`:""}`),R.fragmentShader=`uniform float uTime; varying vec3 vPos; ${Yn}`+R.fragmentShader,R.fragmentShader=R.fragmentShader.replace("#include <map_fragment>",`
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
            `),C.userData.shader=R};const v=new Ft(h,C),y=t()*Math.PI*2;v.position.set(Math.cos(y)*f,0,Math.sin(y)*f);const I=new Bn(d*1.1,32,32),U=new Kt({uniforms:{uTime:{value:0},uIntensity:{value:0}},transparent:!0,blending:en,side:uA,depthWrite:!1,vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform float uIntensity; varying vec2 vUv;
            void main() {
                if (uIntensity <= 0.01) discard;
                float pole = smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
                float wave = sin(vUv.x * 20.0 + uTime * 5.0) * 0.5 + 0.5;
                gl_FragColor = vec4(0.2, 0.8, 0.4, uIntensity * pole * wave * 0.5);
            }`}),M=new Ft(I,U);v.add(M),v.userData={designation:`PLANET ${String.fromCharCode(65+c)}`,type:m?"GAS GIANT":"ROCKY",aurora:U},it.add(v),RA.push({mesh:v,mass:g,velocity:new Q(-Math.sin(y)*Math.sqrt(i*1e3/f),0,Math.cos(y)*Math.sqrt(i*1e3/f)),isStar:!1})}}function IU(){if(L.viewLevel!==2||!it.visible)return;const n=RA.filter(o=>{var l,c;return o.isStar&&!((c=(l=o.mesh)==null?void 0:l.userData)!=null&&c.isBlackHole)});if(n.length===0)return;const e=n[Math.floor(Math.random()*n.length)].mesh,t=new Bn(5,32,32),A=new Kt({uniforms:{uTime:{value:0},uColor:{value:new Oe(16729088)}},transparent:!0,blending:en,depthWrite:!1,vertexShader:"varying vec3 vPos; void main() { vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime; uniform vec3 uColor; varying vec3 vPos; ${Yn}
        void main() {
            float n = snoise(vec3(vPos * 0.5 + uTime * 2.0));
            float alpha = smoothstep(0.0, 0.5, n);
            gl_FragColor = vec4(uColor, alpha * 0.8);
        }`}),i=new Ft(t,A);i.position.copy(e.position);const r=Math.random()*Math.PI*2,s=Math.random()*Math.PI,a=new Q(Math.sin(s)*Math.cos(r),Math.cos(s),Math.sin(s)*Math.sin(r));i.userData={dir:a,age:0,life:10,speed:20,mat:A},it.add(i),Vi.push(i)}function LU(n){const t=n/2;for(let A=0;A<2;A++)for(let i=0;i<RA.length;i++){const r=RA[i];if(r.mesh.position.add(r.velocity.clone().multiplyScalar(t)),!r.isStar){const s=r.mesh.position.lengthSq(),a=r.mesh.position.clone().normalize().multiplyScalar(-50*1e3/s);r.velocity.add(a.multiplyScalar(t))}}}function gp(){var s,a,o,l;const n=performance.now(),e=Rc.getDelta(),t=Math.min(e,.1)*L.timeScale;if(L.bigBangFlash>0&&(L.bigBangFlash-=e*.5,L.bigBangFlash<0&&(L.bigBangFlash=0),Ea&&(Ea.uniforms.uFlash.value=L.bigBangFlash)),!L.isPaused){if(L.viewLevel===0)L.universeSimTime+=t,_t&&(_t.material.uniforms.uTime.value=L.universeSimTime);else if(L.viewLevel===1)L.galaxySimTime+=t;else if(L.viewLevel===2){LU(t*5),Math.random()<.005&&IU();for(let c=Vi.length-1;c>=0;c--){const u=Vi[c];u.userData.age+=t,u.position.add(u.userData.dir.clone().multiplyScalar(u.userData.speed*t)),u.scale.setScalar(1+u.userData.age*2),u.userData.mat&&(u.userData.mat.uniforms.uTime.value+=e),RA.forEach(f=>{!f.isStar&&f.mesh.userData.aurora&&(u.position.distanceTo(f.mesh.position)<30?f.mesh.userData.aurora.uniforms.uIntensity.value=1:f.mesh.userData.aurora.uniforms.uIntensity.value*=.98)}),u.userData.age>u.userData.life&&(it.remove(u),Vi.splice(c,1))}RA.forEach(c=>{c.isStar||(c.mesh.rotation.y+=e*.1),c.mesh.userData.aurora&&(c.mesh.userData.aurora.uniforms.uTime.value+=e),c.mesh.material&&c.mesh.material.userData&&c.mesh.material.userData.shader&&(c.mesh.material.userData.shader.uniforms.uTime.value+=e)})}}L.inspectingTarget&&Ce&&Ce.target.copy(L.inspectingTarget.position);let A=0;if(Lr.forEach(c=>{var f;(f=c.children)==null||f.forEach(d=>{d&&d.material&&d.material.uniforms&&d.material.uniforms.uTime&&(d.material.uniforms.uTime.value+=e)});const u=c.getWorldPosition(new Q);u.project(Te),u.z<1&&Math.abs(u.x)<1.5&&Math.abs(u.y)<1.5&&(Un.uBHPos.value[A].set(u.x*.5+.5,u.y*.5+.5),Un.uBHMass.value[A]=2,A++)}),Un.uBHCount.value=A,L.isAutopilot&&!L.isTransitioning){L.autopilotTimer+=e;let c=!0;if(L.viewLevel===0&&L.universeSimTime<1&&(c=!1),c&&L.autopilotTimer>L.autopilotNextAction){if(L.autopilotTimer=0,L.autopilotNextAction=5,L.viewLevel===0){const u=Math.floor(Math.random()*ct.starCount);if(_t){const f=_t.geometry.attributes.position,d=new Q(f.getX(u),f.getY(u),f.getZ(u)),g=hp(ct.seed+u,L.universeSimTime);L.selectedTarget={level:0,index:u,position:d,data:g},wA(g,!0),jn(d,1)}}else if(L.viewLevel===1)if(L.autopilotPriorityTargets.length>0){const u=L.autopilotPriorityTargets.shift();if(u&&u.object&&typeof u.object.getWorldPosition=="function"){u.object.getWorldPosition(Di);const f=Di.clone(),d=u.data||xa();L.selectedTarget={level:1,object:u.object,position:f,data:d},wA(d,!0),jn(f,2)}}else{const u=Math.floor(Math.random()*ct.starCount);if(At){const f=At.geometry.attributes.position,d=new Q(f.getX(u),f.getY(u),f.getZ(u)),g=fp(u);L.selectedTarget={level:1,index:u,position:d,data:g},wA(g,!0),jn(d,2)}}else if(L.viewLevel===2){const u=it.children.filter(f=>f.userData&&f.userData.type);if(L.planetTourIndex<u.length){const f=u[L.planetTourIndex],d={designation:f.userData.designation,type:f.userData.type,age:L.universeSimTime.toFixed(2),mass:"VAR",radius:"VAR",lum:"REFLECTIVE",composition:"SILICATES/ICE"};L.selectedTarget={level:2,object:f,position:f.position,data:d},wA(d,!0),Ce.target.copy(f.position),L.planetTourIndex++}else lp()}}}if(L.isTransitioning?(L.transitionProgress+=e,Te.position.lerp(L.transitionTarget,.05),Ce.target.lerp(L.transitionTarget,.05),L.transitionProgress>3&&cp()):Ce.update(),!!((s=re==null?void 0:re.xr)!=null&&s.isPresenting)?((!(S!=null&&S.anchor)||!(S!=null&&S.mesh))&&Hc(),S&&!S.visible&&(za(),Sa(!0),Pc())):S!=null&&S.visible&&Sa(!1),ip(n),re&&!((a=re==null?void 0:re.xr)!=null&&a.isPresenting))try{re.setRenderTarget(null),re.setViewport(0,0,re.domElement.width,re.domElement.height),re.setScissorTest(!1)}catch{}(o=re==null?void 0:re.xr)!=null&&o.isPresenting||ia>0?(re.render(st,Te),(l=re==null?void 0:re.xr)!=null&&l.isPresenting||(ia=Math.max(0,ia-1))):vA.render();const r=L.viewLevel===0?L.universeSimTime:L.galaxySimTime;nh&&(nh.innerText=r.toFixed(2)+" Bn YR"),ya&&(ya.innerText=`[ STATUS ${r.toFixed(2)}Bn ]`),Te&&(Zo||jo||$o)&&(Ks.copy(Te.position).add(L.worldOffset),Zo&&(Zo.innerText=qo(Ks.x)),jo&&(jo.innerText=qo(Ks.y)),$o&&($o.innerText=qo(Ks.z))),fU.innerText=Math.round(1/(e||.001))}function RU(n){if(mA.delete(n.pointerId),mA.size===0?(_n=!1,lA=null):(_n=!0,lA===n.pointerId&&(lA=mA.values().next().value)),Zn){mA.size===0&&(Zn=!1);return}if(mn||n.target.closest("button")||n.target.closest(".hud-panel"))return;const e=re.domElement.getBoundingClientRect();if(na.x=(n.clientX-e.left)/e.width*2-1,na.y=-((n.clientY-e.top)/e.height)*2+1,YA.setFromCamera(na,Te),L.viewLevel===0&&_t){YA.params.Points.threshold=5e5;const t=YA.intersectObject(_t);if(t.length>0){dr();const A=t[0].index,i=hp(ct.seed+A,L.universeSimTime);L.selectedTarget={level:0,index:A,position:t[0].point,data:i},wA(i)}}else if(L.viewLevel===1&&At){const t=ut&&ut.visible&&ut.children.length>0?ut.children[0]:null;if(t){if(YA.intersectObject(t,!0).length>0){dr();const r=xa();t.getWorldPosition(Di),L.selectedTarget={level:1,object:t,position:Di.clone(),data:r},wA(r);return}if(ks.copy(t.getWorldPosition(Di)).project(Te),ks.z<1){const r=e.left+(ks.x*.5+.5)*e.width,s=e.top+(-ks.y*.5+.5)*e.height,a=Math.max(24,Math.min(e.width,e.height)*.06);if(Math.hypot(n.clientX-r,n.clientY-s)<=a){dr();const o=xa();L.selectedTarget={level:1,object:t,position:Di.clone(),data:o},wA(o);return}}}YA.params.Points.threshold=5e4;const A=YA.intersectObject(At);if(A.length>0){dr();const i=A[0].index,r=fp(i);L.selectedTarget={level:1,index:i,position:A[0].point,data:r},wA(r)}}else if(L.viewLevel===2&&it){YA.params.Points.threshold=1;const t=YA.intersectObjects(it.children);if(t.length>0){let A=t[0].object;if(!A.userData.type&&A.parent&&A.parent.userData.type&&(A=A.parent),A.userData.type){dr();const i={designation:A.userData.designation,type:A.userData.type,age:L.universeSimTime.toFixed(2),mass:"0.003 M☉",radius:"0.01 R☉",lum:"0",composition:"Atmosphere: N2, O2"};L.selectedTarget={level:2,object:A,position:A.position,data:i},wA(i)}}}}
