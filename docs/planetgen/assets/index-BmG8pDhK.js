var xp=Object.defineProperty;var _p=(i,e,t)=>e in i?xp(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Me=(i,e,t)=>_p(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ac="171",Fs={ROTATE:0,DOLLY:1,PAN:2},yp=0,Mu=1,Sp=2,qd=1,Yd=2,Jn=3,_n=0,en=1,An=2,Mi=0,Wn=1,qa=2,bu=3,wu=4,Mp=5,qi=100,bp=101,wp=102,Ep=103,Tp=104,Ap=200,Cp=201,Rp=202,Pp=203,Sl=204,Ml=205,Dp=206,Lp=207,Ip=208,Up=209,Fp=210,Np=211,Bp=212,Op=213,zp=214,bl=0,wl=1,El=2,Xs=3,Tl=4,Al=5,Cl=6,Rl=7,Cc=0,kp=1,Vp=2,bi=0,Hp=1,Gp=2,Wp=3,Xp=4,qp=5,Yp=6,jp=7,jd=300,qs=301,Ys=302,Pl=303,Dl=304,vo=306,yn=1e3,pt=1001,Ll=1002,Pt=1003,Kp=1004,Yr=1005,it=1006,Co=1007,ji=1008,Dt=1009,Kd=1010,$d=1011,Ir=1012,Rc=1013,Ji=1014,ti=1015,zr=1016,Pc=1017,Dc=1018,js=1020,Zd=35902,Qd=1021,Jd=1022,bt=1023,ef=1024,tf=1025,Ns=1026,Ks=1027,nf=1028,Lc=1029,sf=1030,Ic=1031,Uc=1033,La=33776,Ia=33777,Ua=33778,Fa=33779,Il=35840,Ul=35841,Fl=35842,Nl=35843,Bl=36196,Ol=37492,zl=37496,kl=37808,Vl=37809,Hl=37810,Gl=37811,Wl=37812,Xl=37813,ql=37814,Yl=37815,jl=37816,Kl=37817,$l=37818,Zl=37819,Ql=37820,Jl=37821,Na=36492,ec=36494,tc=36495,rf=36283,nc=36284,ic=36285,sc=36286,$p=3200,Zp=3201,Fc=0,Qp=1,Ft="",gn="srgb",$s="srgb-linear",Ya="linear",at="srgb",as=7680,Eu=519,Jp=512,em=513,tm=514,af=515,nm=516,im=517,sm=518,rm=519,rc=35044,Tu="300 es",ni=2e3,ja=2001;class is{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Au=1234567;const Sr=Math.PI/180,Ur=180/Math.PI;function ii(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function Nc(i,e){return(i%e+e)%e}function am(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function om(i,e,t){return i!==e?(t-i)/(e-i):0}function Mr(i,e,t){return(1-t)*i+t*e}function lm(i,e,t,n){return Mr(i,e,1-Math.exp(-t*n))}function cm(i,e=1){return e-Math.abs(Nc(i,e*2)-e)}function um(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function hm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function dm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function fm(i,e){return i+Math.random()*(e-i)}function pm(i){return i*(.5-Math.random())}function mm(i){i!==void 0&&(Au=i);let e=Au+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function gm(i){return i*Sr}function vm(i){return i*Ur}function xm(i){return(i&i-1)===0&&i!==0}function _m(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function ym(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Sm(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),f=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*h,l*f,o*c);break;case"YZY":i.set(l*f,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*f,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function rt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ka={DEG2RAD:Sr,RAD2DEG:Ur,generateUUID:ii,clamp:We,euclideanModulo:Nc,mapLinear:am,inverseLerp:om,lerp:Mr,damp:lm,pingpong:cm,smoothstep:um,smootherstep:hm,randInt:dm,randFloat:fm,randFloatSpread:pm,seededRandom:mm,degToRad:gm,radToDeg:vm,isPowerOfTwo:xm,ceilPowerOfTwo:_m,floorPowerOfTwo:ym,setQuaternionFromProperEuler:Sm,normalize:rt,denormalize:Nn};class _e{constructor(e=0,t=0){_e.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Le{constructor(e,t,n,s,r,a,o,l,c){Le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],g=n[8],v=s[0],p=s[3],d=s[6],_=s[1],y=s[4],x=s[7],E=s[2],T=s[5],A=s[8];return r[0]=a*v+o*_+l*E,r[3]=a*p+o*y+l*T,r[6]=a*d+o*x+l*A,r[1]=c*v+u*_+h*E,r[4]=c*p+u*y+h*T,r[7]=c*d+u*x+h*A,r[2]=f*v+m*_+g*E,r[5]=f*p+m*y+g*T,r[8]=f*d+m*x+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*r,m=c*r-a*l,g=t*h+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(s*c-u*n)*v,e[2]=(o*n-s*a)*v,e[3]=f*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=m*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ro.makeScale(e,t)),this}rotate(e){return this.premultiply(Ro.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ro.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ro=new Le;function of(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $a(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mm(){const i=$a("canvas");return i.style.display="block",i}const Cu={};function Cs(i){i in Cu||(Cu[i]=!0,console.warn(i))}function bm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function wm(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Em(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ru=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pu=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tm(){const i={enabled:!0,workingColorSpace:$s,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===at&&(s.r=si(s.r),s.g=si(s.g),s.b=si(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(s.r=Bs(s.r),s.g=Bs(s.g),s.b=Bs(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ft?Ya:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[$s]:{primaries:e,whitePoint:n,transfer:Ya,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:e,whitePoint:n,transfer:at,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),i}const Je=Tm();function si(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let os;class Am{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{os===void 0&&(os=$a("canvas")),os.width=e.width,os.height=e.height;const n=os.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=os}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$a("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=si(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(si(t[n]/255)*255):t[n]=si(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cm=0;class lf{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=ii(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Po(s[a].image)):r.push(Po(s[a]))}else r=Po(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Po(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Am.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Rm=0;class tn extends is{constructor(e=tn.DEFAULT_IMAGE,t=tn.DEFAULT_MAPPING,n=pt,s=pt,r=it,a=ji,o=bt,l=Dt,c=tn.DEFAULT_ANISOTROPY,u=Ft){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=ii(),this.name="",this.source=new lf(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new _e(0,0),this.repeat=new _e(1,1),this.center=new _e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case yn:e.x=e.x-Math.floor(e.x);break;case pt:e.x=e.x<0?0:1;break;case Ll:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case yn:e.y=e.y-Math.floor(e.y);break;case pt:e.y=e.y<0?0:1;break;case Ll:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=jd;tn.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,s=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],g=l[9],v=l[2],p=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,x=(m+1)/2,E=(d+1)/2,T=(u+f)/4,A=(h+v)/4,R=(g+p)/4;return y>x&&y>E?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=T/n,r=A/n):x>E?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=T/s,r=R/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=A/r,s=R/r),this.set(n,s,r,t),this}let _=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(_)<.001&&(_=1),this.x=(p-g)/_,this.y=(h-v)/_,this.z=(f-u)/_,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Pm extends is{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:it,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new tn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new lf(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class es extends Pm{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class cf extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Dm extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class On{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[a+0],m=r[a+1],g=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==f||c!==m||u!==g){let p=1-o;const d=l*f+c*m+u*g+h*v,_=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const E=Math.sqrt(y),T=Math.atan2(E,d*_);p=Math.sin(p*T)/E,o=Math.sin(o*T)/E}const x=o*_;if(l=l*p+f*x,c=c*p+m*x,u=u*p+g*x,h=h*p+v*x,p===1-o){const E=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=E,c*=E,u*=E,h*=E}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+u*h+l*m-c*f,e[t+1]=l*g+u*f+c*h-o*m,e[t+2]=c*g+u*m+o*f-l*h,e[t+3]=u*g-o*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),h=o(r/2),f=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"YXZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"ZXY":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"ZYX":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"YZX":this._x=f*u*h+c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h-f*m*g;break;case"XZY":this._x=f*u*h-c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Du.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Du.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Do.copy(this).projectOnVector(e),this.sub(Do)}reflect(e){return this.sub(Do.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Do=new P,Du=new On;class kr{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ln):Ln.fromBufferAttribute(r,a),Ln.applyMatrix4(e.matrixWorld),this.expandByPoint(Ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),jr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),jr.copy(n.boundingBox)),jr.applyMatrix4(e.matrixWorld),this.union(jr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ln),Ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rr),Kr.subVectors(this.max,rr),ls.subVectors(e.a,rr),cs.subVectors(e.b,rr),us.subVectors(e.c,rr),ui.subVectors(cs,ls),hi.subVectors(us,cs),Bi.subVectors(ls,us);let t=[0,-ui.z,ui.y,0,-hi.z,hi.y,0,-Bi.z,Bi.y,ui.z,0,-ui.x,hi.z,0,-hi.x,Bi.z,0,-Bi.x,-ui.y,ui.x,0,-hi.y,hi.x,0,-Bi.y,Bi.x,0];return!Lo(t,ls,cs,us,Kr)||(t=[1,0,0,0,1,0,0,0,1],!Lo(t,ls,cs,us,Kr))?!1:($r.crossVectors(ui,hi),t=[$r.x,$r.y,$r.z],Lo(t,ls,cs,us,Kr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const jn=[new P,new P,new P,new P,new P,new P,new P,new P],Ln=new P,jr=new kr,ls=new P,cs=new P,us=new P,ui=new P,hi=new P,Bi=new P,rr=new P,Kr=new P,$r=new P,Oi=new P;function Lo(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Oi.fromArray(i,r);const o=s.x*Math.abs(Oi.x)+s.y*Math.abs(Oi.y)+s.z*Math.abs(Oi.z),l=e.dot(Oi),c=t.dot(Oi),u=n.dot(Oi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Lm=new kr,ar=new P,Io=new P;class Vr{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Lm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ar.subVectors(e,this.center);const t=ar.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ar,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ar.copy(e.center).add(Io)),this.expandByPoint(ar.copy(e.center).sub(Io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Kn=new P,Uo=new P,Zr=new P,di=new P,Fo=new P,Qr=new P,No=new P;class xo{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kn.copy(this.origin).addScaledVector(this.direction,t),Kn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Uo.copy(e).add(t).multiplyScalar(.5),Zr.copy(t).sub(e).normalize(),di.copy(this.origin).sub(Uo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Zr),o=di.dot(this.direction),l=-di.dot(Zr),c=di.lengthSq(),u=Math.abs(1-a*a);let h,f,m,g;if(u>0)if(h=a*l-o,f=a*o-l,g=r*u,h>=0)if(f>=-g)if(f<=g){const v=1/u;h*=v,f*=v,m=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-a*r+o)),f=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(h=Math.max(0,-(a*r+o)),f=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c);else f=a>0?-r:r,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Uo).addScaledVector(Zr,f),m}intersectSphere(e,t){Kn.subVectors(e.center,this.origin);const n=Kn.dot(this.direction),s=Kn.dot(Kn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Kn)!==null}intersectTriangle(e,t,n,s,r){Fo.subVectors(t,e),Qr.subVectors(n,e),No.crossVectors(Fo,Qr);let a=this.direction.dot(No),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;di.subVectors(this.origin,e);const l=o*this.direction.dot(Qr.crossVectors(di,Qr));if(l<0)return null;const c=o*this.direction.dot(Fo.cross(di));if(c<0||l+c>a)return null;const u=-o*di.dot(No);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,n,s,r,a,o,l,c,u,h,f,m,g,v,p){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,h,f,m,g,v,p)}set(e,t,n,s,r,a,o,l,c,u,h,f,m,g,v,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=g,d[11]=v,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),a=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=a*u,m=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f+v*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f-v*o,t[4]=-a*h,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,m=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=g*c-m,t[8]=f*c+v,t[1]=l*h,t[5]=v*c+f,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=v-f*h,t[8]=g*h+m,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*h+g,t[10]=f-v*h}else if(e.order==="XZY"){const f=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+v,t[5]=a*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=o*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Im,e,Um)}lookAt(e,t,n){const s=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),fi.crossVectors(n,fn),fi.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),fi.crossVectors(n,fn)),fi.normalize(),Jr.crossVectors(fn,fi),s[0]=fi.x,s[4]=Jr.x,s[8]=fn.x,s[1]=fi.y,s[5]=Jr.y,s[9]=fn.y,s[2]=fi.z,s[6]=Jr.z,s[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],g=n[2],v=n[6],p=n[10],d=n[14],_=n[3],y=n[7],x=n[11],E=n[15],T=s[0],A=s[4],R=s[8],M=s[12],S=s[1],D=s[5],B=s[9],N=s[13],W=s[2],X=s[6],H=s[10],Y=s[14],V=s[3],Q=s[7],re=s[11],ge=s[15];return r[0]=a*T+o*S+l*W+c*V,r[4]=a*A+o*D+l*X+c*Q,r[8]=a*R+o*B+l*H+c*re,r[12]=a*M+o*N+l*Y+c*ge,r[1]=u*T+h*S+f*W+m*V,r[5]=u*A+h*D+f*X+m*Q,r[9]=u*R+h*B+f*H+m*re,r[13]=u*M+h*N+f*Y+m*ge,r[2]=g*T+v*S+p*W+d*V,r[6]=g*A+v*D+p*X+d*Q,r[10]=g*R+v*B+p*H+d*re,r[14]=g*M+v*N+p*Y+d*ge,r[3]=_*T+y*S+x*W+E*V,r[7]=_*A+y*D+x*X+E*Q,r[11]=_*R+y*B+x*H+E*re,r[15]=_*M+y*N+x*Y+E*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],g=e[3],v=e[7],p=e[11],d=e[15];return g*(+r*l*h-s*c*h-r*o*f+n*c*f+s*o*m-n*l*m)+v*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*u-r*l*u)+p*(+t*c*h-t*o*m-r*a*h+n*a*m+r*o*u-n*c*u)+d*(-s*o*u-t*l*h+t*o*f+s*a*h-n*a*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],g=e[12],v=e[13],p=e[14],d=e[15],_=h*p*c-v*f*c+v*l*m-o*p*m-h*l*d+o*f*d,y=g*f*c-u*p*c-g*l*m+a*p*m+u*l*d-a*f*d,x=u*v*c-g*h*c+g*o*m-a*v*m-u*o*d+a*h*d,E=g*h*l-u*v*l-g*o*f+a*v*f+u*o*p-a*h*p,T=t*_+n*y+s*x+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=_*A,e[1]=(v*f*r-h*p*r-v*s*m+n*p*m+h*s*d-n*f*d)*A,e[2]=(o*p*r-v*l*r+v*s*c-n*p*c-o*s*d+n*l*d)*A,e[3]=(h*l*r-o*f*r-h*s*c+n*f*c+o*s*m-n*l*m)*A,e[4]=y*A,e[5]=(u*p*r-g*f*r+g*s*m-t*p*m-u*s*d+t*f*d)*A,e[6]=(g*l*r-a*p*r-g*s*c+t*p*c+a*s*d-t*l*d)*A,e[7]=(a*f*r-u*l*r+u*s*c-t*f*c-a*s*m+t*l*m)*A,e[8]=x*A,e[9]=(g*h*r-u*v*r-g*n*m+t*v*m+u*n*d-t*h*d)*A,e[10]=(a*v*r-g*o*r+g*n*c-t*v*c-a*n*d+t*o*d)*A,e[11]=(u*o*r-a*h*r-u*n*c+t*h*c+a*n*m-t*o*m)*A,e[12]=E*A,e[13]=(u*v*s-g*h*s+g*n*f-t*v*f-u*n*p+t*h*p)*A,e[14]=(g*o*s-a*v*s-g*n*l+t*v*l+a*n*p-t*o*p)*A,e[15]=(a*h*s-u*o*s+u*n*l-t*h*l-a*n*f+t*o*f)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,f=r*c,m=r*u,g=r*h,v=a*u,p=a*h,d=o*h,_=l*c,y=l*u,x=l*h,E=n.x,T=n.y,A=n.z;return s[0]=(1-(v+d))*E,s[1]=(m+x)*E,s[2]=(g-y)*E,s[3]=0,s[4]=(m-x)*T,s[5]=(1-(f+d))*T,s[6]=(p+_)*T,s[7]=0,s[8]=(g+y)*A,s[9]=(p-_)*A,s[10]=(1-(f+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=hs.set(s[0],s[1],s[2]).length();const a=hs.set(s[4],s[5],s[6]).length(),o=hs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],In.copy(this);const c=1/r,u=1/a,h=1/o;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=u,In.elements[5]*=u,In.elements[6]*=u,In.elements[8]*=h,In.elements[9]*=h,In.elements[10]*=h,t.setFromRotationMatrix(In),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=ni){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let m,g;if(o===ni)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ja)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=ni){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(a-r),f=(t+e)*c,m=(n+s)*u;let g,v;if(o===ni)g=(a+r)*h,v=-2*h;else if(o===ja)g=r*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const hs=new P,In=new ot,Im=new P(0,0,0),Um=new P(1,1,1),fi=new P,Jr=new P,fn=new P,Lu=new ot,Iu=new On;class zn{constructor(e=0,t=0,n=0,s=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Lu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Lu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Iu.setFromEuler(this),this.setFromQuaternion(Iu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class Bc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Fm=0;const Uu=new P,ds=new On,$n=new ot,ea=new P,or=new P,Nm=new P,Bm=new On,Fu=new P(1,0,0),Nu=new P(0,1,0),Bu=new P(0,0,1),Ou={type:"added"},Om={type:"removed"},fs={type:"childadded",child:null},Bo={type:"childremoved",child:null};class wt extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Fm++}),this.uuid=ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new P,t=new zn,n=new On,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ot},normalMatrix:{value:new Le}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.multiply(ds),this}rotateOnWorldAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.premultiply(ds),this}rotateX(e){return this.rotateOnAxis(Fu,e)}rotateY(e){return this.rotateOnAxis(Nu,e)}rotateZ(e){return this.rotateOnAxis(Bu,e)}translateOnAxis(e,t){return Uu.copy(e).applyQuaternion(this.quaternion),this.position.add(Uu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fu,e)}translateY(e){return this.translateOnAxis(Nu,e)}translateZ(e){return this.translateOnAxis(Bu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ea.copy(e):ea.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$n.lookAt(or,ea,this.up):$n.lookAt(ea,or,this.up),this.quaternion.setFromRotationMatrix($n),s&&($n.extractRotation(s.matrixWorld),ds.setFromRotationMatrix($n),this.quaternion.premultiply(ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ou),fs.child=e,this.dispatchEvent(fs),fs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Om),Bo.child=e,this.dispatchEvent(Bo),Bo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$n.multiply(e.parent.matrixWorld)),e.applyMatrix4($n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ou),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,Nm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,Bm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}wt.DEFAULT_UP=new P(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Un=new P,Zn=new P,Oo=new P,Qn=new P,ps=new P,ms=new P,zu=new P,zo=new P,ko=new P,Vo=new P,Ho=new xt,Go=new xt,Wo=new xt;class Cn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Un.subVectors(e,t),s.cross(Un);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Un.subVectors(s,t),Zn.subVectors(n,t),Oo.subVectors(e,t);const a=Un.dot(Un),o=Un.dot(Zn),l=Un.dot(Oo),c=Zn.dot(Zn),u=Zn.dot(Oo),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const f=1/h,m=(c*l-o*u)*f,g=(a*u-o*l)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Qn)===null?!1:Qn.x>=0&&Qn.y>=0&&Qn.x+Qn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Qn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Qn.x),l.addScaledVector(a,Qn.y),l.addScaledVector(o,Qn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Ho.setScalar(0),Go.setScalar(0),Wo.setScalar(0),Ho.fromBufferAttribute(e,t),Go.fromBufferAttribute(e,n),Wo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ho,r.x),a.addScaledVector(Go,r.y),a.addScaledVector(Wo,r.z),a}static isFrontFacing(e,t,n,s){return Un.subVectors(n,t),Zn.subVectors(e,t),Un.cross(Zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),Un.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Cn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;ps.subVectors(s,n),ms.subVectors(r,n),zo.subVectors(e,n);const l=ps.dot(zo),c=ms.dot(zo);if(l<=0&&c<=0)return t.copy(n);ko.subVectors(e,s);const u=ps.dot(ko),h=ms.dot(ko);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(ps,a);Vo.subVectors(e,r);const m=ps.dot(Vo),g=ms.dot(Vo);if(g>=0&&m<=g)return t.copy(r);const v=m*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ms,o);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return zu.subVectors(r,s),o=(h-u)/(h-u+(m-g)),t.copy(s).addScaledVector(zu,o);const d=1/(p+v+f);return a=v*d,o=f*d,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const uf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pi={h:0,s:0,l:0},ta={h:0,s:0,l:0};function Xo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=Je.workingColorSpace){if(e=Nc(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Xo(a,r,e+1/3),this.g=Xo(a,r,e),this.b=Xo(a,r,e-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(e,t=gn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gn){const n=uf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=si(e.r),this.g=si(e.g),this.b=si(e.b),this}copyLinearToSRGB(e){return this.r=Bs(e.r),this.g=Bs(e.g),this.b=Bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gn){return Je.fromWorkingColorSpace(Xt.copy(this),e),Math.round(We(Xt.r*255,0,255))*65536+Math.round(We(Xt.g*255,0,255))*256+Math.round(We(Xt.b*255,0,255))}getHexString(e=gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Xt.copy(this),t);const n=Xt.r,s=Xt.g,r=Xt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=gn){Je.fromWorkingColorSpace(Xt.copy(this),e);const t=Xt.r,n=Xt.g,s=Xt.b;return e!==gn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(pi),this.setHSL(pi.h+e,pi.s+t,pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(pi),e.getHSL(ta);const n=Mr(pi.h,ta.h,t),s=Mr(pi.s,ta.s,t),r=Mr(pi.l,ta.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new xe;xe.NAMES=uf;let zm=0;class ci extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zm++}),this.uuid=ii(),this.name="",this.type="Material",this.blending=Wn,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sl,this.blendDst=Ml,this.blendEquation=qi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new xe(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Eu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=as,this.stencilZFail=as,this.stencilZPass=as,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(n.blending=this.blending),this.side!==_n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sl&&(n.blendSrc=this.blendSrc),this.blendDst!==Ml&&(n.blendDst=this.blendDst),this.blendEquation!==qi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Eu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==as&&(n.stencilFail=this.stencilFail),this.stencilZFail!==as&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==as&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class hf extends ci{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Cc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new P,na=new _e;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=rc,this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)na.fromBufferAttribute(this,t),na.applyMatrix3(e),this.setXY(t,na.x,na.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==rc&&(e.usage=this.usage),e}}class df extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ff extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nn extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let km=0;const wn=new ot,qo=new wt,gs=new P,pn=new kr,lr=new kr,Ut=new P;class on extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(of(e)?ff:df)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Le().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,t,n){return wn.makeTranslation(e,t,n),this.applyMatrix4(wn),this}scale(e,t,n){return wn.makeScale(e,t,n),this.applyMatrix4(wn),this}lookAt(e){return qo.lookAt(e),qo.updateMatrix(),this.applyMatrix4(qo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new nn(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];pn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(pn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];lr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(pn.min,lr.min),pn.expandByPoint(Ut),Ut.addVectors(pn.max,lr.max),pn.expandByPoint(Ut)):(pn.expandByPoint(lr.min),pn.expandByPoint(lr.max))}pn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ut.fromBufferAttribute(o,c),l&&(gs.fromBufferAttribute(e,c),Ut.add(gs)),s=Math.max(s,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<n.count;R++)o[R]=new P,l[R]=new P;const c=new P,u=new P,h=new P,f=new _e,m=new _e,g=new _e,v=new P,p=new P;function d(R,M,S){c.fromBufferAttribute(n,R),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,S),f.fromBufferAttribute(r,R),m.fromBufferAttribute(r,M),g.fromBufferAttribute(r,S),u.sub(c),h.sub(c),m.sub(f),g.sub(f);const D=1/(m.x*g.y-g.x*m.y);isFinite(D)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(D),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(D),o[R].add(v),o[M].add(v),o[S].add(v),l[R].add(p),l[M].add(p),l[S].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let R=0,M=_.length;R<M;++R){const S=_[R],D=S.start,B=S.count;for(let N=D,W=D+B;N<W;N+=3)d(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const y=new P,x=new P,E=new P,T=new P;function A(R){E.fromBufferAttribute(s,R),T.copy(E);const M=o[R];y.copy(M),y.sub(E.multiplyScalar(E.dot(M))).normalize(),x.crossVectors(T,M);const D=x.dot(l[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,D)}for(let R=0,M=_.length;R<M;++R){const S=_[R],D=S.start,B=S.count;for(let N=D,W=D+B;N<W;N+=3)A(e.getX(N+0)),A(e.getX(N+1)),A(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?m=l[v]*o.data.stride+o.offset:m=l[v]*u;for(let d=0;d<u;d++)f[g++]=c[m++]}return new kt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new on,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ku=new ot,zi=new xo,ia=new Vr,Vu=new P,sa=new P,ra=new P,aa=new P,Yo=new P,oa=new P,Hu=new P,la=new P;class zt extends wt{constructor(e=new on,t=new hf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){oa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(Yo.fromBufferAttribute(h,e),a?oa.addScaledVector(Yo,u):oa.addScaledVector(Yo.sub(t),u))}t.add(oa)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ia.copy(n.boundingSphere),ia.applyMatrix4(r),zi.copy(e.ray).recast(e.near),!(ia.containsPoint(zi.origin)===!1&&(zi.intersectSphere(ia,Vu)===null||zi.origin.distanceToSquared(Vu)>(e.far-e.near)**2))&&(ku.copy(r).invert(),zi.copy(e.ray).applyMatrix4(ku),!(n.boundingBox!==null&&zi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,zi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=a[p.materialIndex],_=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let x=_,E=y;x<E;x+=3){const T=o.getX(x),A=o.getX(x+1),R=o.getX(x+2);s=ca(this,d,e,n,c,u,h,T,A,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const _=o.getX(p),y=o.getX(p+1),x=o.getX(p+2);s=ca(this,a,e,n,c,u,h,_,y,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=a[p.materialIndex],_=Math.max(p.start,m.start),y=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let x=_,E=y;x<E;x+=3){const T=x,A=x+1,R=x+2;s=ca(this,d,e,n,c,u,h,T,A,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const _=p,y=p+1,x=p+2;s=ca(this,a,e,n,c,u,h,_,y,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Vm(i,e,t,n,s,r,a,o){let l;if(e.side===en?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===_n,o),l===null)return null;la.copy(o),la.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(la);return c<t.near||c>t.far?null:{distance:c,point:la.clone(),object:i}}function ca(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,sa),i.getVertexPosition(l,ra),i.getVertexPosition(c,aa);const u=Vm(i,e,t,n,sa,ra,aa,Hu);if(u){const h=new P;Cn.getBarycoord(Hu,sa,ra,aa,h),s&&(u.uv=Cn.getInterpolatedAttribute(s,o,l,c,h,new _e)),r&&(u.uv1=Cn.getInterpolatedAttribute(r,o,l,c,h,new _e)),a&&(u.normal=Cn.getInterpolatedAttribute(a,o,l,c,h,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};Cn.getNormal(sa,ra,aa,f.normal),u.face=f,u.barycoord=h}return u}class Hr extends on{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new nn(c,3)),this.setAttribute("normal",new nn(u,3)),this.setAttribute("uv",new nn(h,2));function g(v,p,d,_,y,x,E,T,A,R,M){const S=x/A,D=E/R,B=x/2,N=E/2,W=T/2,X=A+1,H=R+1;let Y=0,V=0;const Q=new P;for(let re=0;re<H;re++){const ge=re*D-N;for(let ye=0;ye<X;ye++){const be=ye*S-B;Q[v]=be*_,Q[p]=ge*y,Q[d]=W,c.push(Q.x,Q.y,Q.z),Q[v]=0,Q[p]=0,Q[d]=T>0?1:-1,u.push(Q.x,Q.y,Q.z),h.push(ye/A),h.push(1-re/R),Y+=1}}for(let re=0;re<R;re++)for(let ge=0;ge<A;ge++){const ye=f+ge+X*re,be=f+ge+X*(re+1),q=f+(ge+1)+X*(re+1),J=f+(ge+1)+X*re;l.push(ye,be,J),l.push(be,q,J),V+=6}o.addGroup(m,V,M),m+=V,f+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Zt(i){const e={};for(let t=0;t<i.length;t++){const n=Zs(i[t]);for(const s in n)e[s]=n[s]}return e}function Hm(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function pf(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Gm={clone:Zs,merge:Zt};var Wm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends ci{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wm,this.fragmentShader=Xm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zs(e.uniforms),this.uniformsGroups=Hm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class mf extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=ni}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const mi=new P,Gu=new _e,Wu=new _e;class Tn extends mf{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ur*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Sr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ur*2*Math.atan(Math.tan(Sr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mi.x,mi.y).multiplyScalar(-e/mi.z),mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mi.x,mi.y).multiplyScalar(-e/mi.z)}getViewSize(e,t){return this.getViewBounds(e,Gu,Wu),t.subVectors(Wu,Gu)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Sr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const vs=-90,xs=1;class qm extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Tn(vs,xs,e,t);s.layers=this.layers,this.add(s);const r=new Tn(vs,xs,e,t);r.layers=this.layers,this.add(r);const a=new Tn(vs,xs,e,t);a.layers=this.layers,this.add(a);const o=new Tn(vs,xs,e,t);o.layers=this.layers,this.add(o);const l=new Tn(vs,xs,e,t);l.layers=this.layers,this.add(l);const c=new Tn(vs,xs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ja)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class gf extends tn{constructor(e,t,n,s,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:qs,super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ym extends es{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new gf(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:it}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Hr(5,5,5),r=new Vt({name:"CubemapFromEquirect",uniforms:Zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:Mi});r.uniforms.tEquirect.value=t;const a=new zt(s,r),o=t.minFilter;return t.minFilter===ji&&(t.minFilter=it),new qm(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Oc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new xe(e),this.near=t,this.far=n}clone(){return new Oc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class jm extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Km{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=rc,this.updateRanges=[],this.version=0,this.uuid=ii()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const $t=new P;class Za{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Za(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class vf extends ci{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let _s;const cr=new P,ys=new P,Ss=new P,Ms=new _e,ur=new _e,xf=new ot,ua=new P,hr=new P,ha=new P,Xu=new _e,jo=new _e,qu=new _e;class $m extends wt{constructor(e=new vf){if(super(),this.isSprite=!0,this.type="Sprite",_s===void 0){_s=new on;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Km(t,5);_s.setIndex([0,1,2,0,2,3]),_s.setAttribute("position",new Za(n,3,0,!1)),_s.setAttribute("uv",new Za(n,2,3,!1))}this.geometry=_s,this.material=e,this.center=new _e(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ys.setFromMatrixScale(this.matrixWorld),xf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ss.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ys.multiplyScalar(-Ss.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;da(ua.set(-.5,-.5,0),Ss,a,ys,s,r),da(hr.set(.5,-.5,0),Ss,a,ys,s,r),da(ha.set(.5,.5,0),Ss,a,ys,s,r),Xu.set(0,0),jo.set(1,0),qu.set(1,1);let o=e.ray.intersectTriangle(ua,hr,ha,!1,cr);if(o===null&&(da(hr.set(-.5,.5,0),Ss,a,ys,s,r),jo.set(0,1),o=e.ray.intersectTriangle(ua,ha,hr,!1,cr),o===null))return;const l=e.ray.origin.distanceTo(cr);l<e.near||l>e.far||t.push({distance:l,point:cr.clone(),uv:Cn.getInterpolation(cr,ua,hr,ha,Xu,jo,qu,new _e),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function da(i,e,t,n,s,r){Ms.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ur.x=r*Ms.x-s*Ms.y,ur.y=s*Ms.x+r*Ms.y):ur.copy(Ms),i.copy(e),i.x+=ur.x,i.y+=ur.y,i.applyMatrix4(xf)}class Xn extends tn{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Pt,u=Pt,h,f){super(null,a,o,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qa extends kt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ko=new P,Zm=new P,Qm=new Le;class Gi{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ko.subVectors(n,t).cross(Zm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ko),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Qm.getNormalMatrix(e),s=this.coplanarPoint(Ko).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ki=new Vr,fa=new P;class zc{constructor(e=new Gi,t=new Gi,n=new Gi,s=new Gi,r=new Gi,a=new Gi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ni){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],h=s[6],f=s[7],m=s[8],g=s[9],v=s[10],p=s[11],d=s[12],_=s[13],y=s[14],x=s[15];if(n[0].setComponents(l-r,f-c,p-m,x-d).normalize(),n[1].setComponents(l+r,f+c,p+m,x+d).normalize(),n[2].setComponents(l+a,f+u,p+g,x+_).normalize(),n[3].setComponents(l-a,f-u,p-g,x-_).normalize(),n[4].setComponents(l-o,f-h,p-v,x-y).normalize(),t===ni)n[5].setComponents(l+o,f+h,p+v,x+y).normalize();else if(t===ja)n[5].setComponents(o,h,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ki.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ki.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ki)}intersectsSprite(e){return ki.center.set(0,0,0),ki.radius=.7071067811865476,ki.applyMatrix4(e.matrixWorld),this.intersectsSphere(ki)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(fa.x=s.normal.x>0?e.max.x:e.min.x,fa.y=s.normal.y>0?e.max.y:e.min.y,fa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(fa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _f extends ci{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ja=new P,eo=new P,Yu=new ot,dr=new xo,pa=new Vr,$o=new P,ju=new P;class Jm extends wt{constructor(e=new on,t=new _f){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ja.fromBufferAttribute(t,s-1),eo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ja.distanceTo(eo);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(s),pa.radius+=r,e.ray.intersectsSphere(pa)===!1)return;Yu.copy(s).invert(),dr.copy(e.ray).applyMatrix4(Yu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const m=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=c){const d=u.getX(v),_=u.getX(v+1),y=ma(this,e,dr,l,d,_);y&&t.push(y)}if(this.isLineLoop){const v=u.getX(g-1),p=u.getX(m),d=ma(this,e,dr,l,v,p);d&&t.push(d)}}else{const m=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=c){const d=ma(this,e,dr,l,v,v+1);d&&t.push(d)}if(this.isLineLoop){const v=ma(this,e,dr,l,g-1,m);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ma(i,e,t,n,s,r){const a=i.geometry.attributes.position;if(Ja.fromBufferAttribute(a,s),eo.fromBufferAttribute(a,r),t.distanceSqToSegment(Ja,eo,$o,ju)>n)return;$o.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo($o);if(!(l<e.near||l>e.far))return{distance:l,point:ju.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Ku=new P,$u=new P;class e0 extends Jm{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ku.fromBufferAttribute(t,s),$u.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ku.distanceTo($u);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class yf extends ci{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Zu=new ot,ac=new xo,ga=new Vr,va=new P;class t0 extends wt{constructor(e=new on,t=new yf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(s),ga.radius+=r,e.ray.intersectsSphere(ga)===!1)return;Zu.copy(s).invert(),ac.copy(e.ray).applyMatrix4(Zu);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=f,v=m;g<v;g++){const p=c.getX(g);va.fromBufferAttribute(h,p),Qu(va,p,l,s,e,t,this)}}else{const f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let g=f,v=m;g<v;g++)va.fromBufferAttribute(h,g),Qu(va,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Qu(i,e,t,n,s,r,a){const o=ac.distanceSqToPoint(i);if(o<t){const l=new P;ac.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Ps extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Sf extends tn{constructor(e,t,n,s,r,a,o,l,c,u=Ns){if(u!==Ns&&u!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ns&&(n=Ji),n===void 0&&u===Ks&&(n=js),super(null,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Pt,this.minFilter=l!==void 0?l:Pt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class kc extends on{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new nn(r,3)),this.setAttribute("normal",new nn(r.slice(),3)),this.setAttribute("uv",new nn(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const y=new P,x=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],y),m(t[T+1],x),m(t[T+2],E),l(y,x,E,_)}function l(_,y,x,E){const T=E+1,A=[];for(let R=0;R<=T;R++){A[R]=[];const M=_.clone().lerp(x,R/T),S=y.clone().lerp(x,R/T),D=T-R;for(let B=0;B<=D;B++)B===0&&R===T?A[R][B]=M:A[R][B]=M.clone().lerp(S,B/D)}for(let R=0;R<T;R++)for(let M=0;M<2*(T-R)-1;M++){const S=Math.floor(M/2);M%2===0?(f(A[R][S+1]),f(A[R+1][S]),f(A[R][S])):(f(A[R][S+1]),f(A[R+1][S+1]),f(A[R+1][S]))}}function c(_){const y=new P;for(let x=0;x<r.length;x+=3)y.x=r[x+0],y.y=r[x+1],y.z=r[x+2],y.normalize().multiplyScalar(_),r[x+0]=y.x,r[x+1]=y.y,r[x+2]=y.z}function u(){const _=new P;for(let y=0;y<r.length;y+=3){_.x=r[y+0],_.y=r[y+1],_.z=r[y+2];const x=p(_)/2/Math.PI+.5,E=d(_)/Math.PI+.5;a.push(x,1-E)}g(),h()}function h(){for(let _=0;_<a.length;_+=6){const y=a[_+0],x=a[_+2],E=a[_+4],T=Math.max(y,x,E),A=Math.min(y,x,E);T>.9&&A<.1&&(y<.2&&(a[_+0]+=1),x<.2&&(a[_+2]+=1),E<.2&&(a[_+4]+=1))}}function f(_){r.push(_.x,_.y,_.z)}function m(_,y){const x=_*3;y.x=e[x+0],y.y=e[x+1],y.z=e[x+2]}function g(){const _=new P,y=new P,x=new P,E=new P,T=new _e,A=new _e,R=new _e;for(let M=0,S=0;M<r.length;M+=9,S+=6){_.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),T.set(a[S+0],a[S+1]),A.set(a[S+2],a[S+3]),R.set(a[S+4],a[S+5]),E.copy(_).add(y).add(x).divideScalar(3);const D=p(E);v(T,S+0,_,D),v(A,S+2,y,D),v(R,S+4,x,D)}}function v(_,y,x,E){E<0&&_.x===1&&(a[y]=_.x-1),x.x===0&&x.z===0&&(a[y]=E/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function d(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kc(e.vertices,e.indices,e.radius,e.details)}}class Ii extends kc{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ii(e.radius,e.detail)}}class tr extends on{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,h=e/o,f=t/l,m=[],g=[],v=[],p=[];for(let d=0;d<u;d++){const _=d*f-a;for(let y=0;y<c;y++){const x=y*h-r;g.push(x,-_,0),v.push(0,0,1),p.push(y/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<o;_++){const y=_+c*d,x=_+c*(d+1),E=_+1+c*(d+1),T=_+1+c*d;m.push(y,x,T),m.push(x,E,T)}this.setIndex(m),this.setAttribute("position",new nn(g,3)),this.setAttribute("normal",new nn(v,3)),this.setAttribute("uv",new nn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tr(e.width,e.height,e.widthSegments,e.heightSegments)}}class Vc extends on{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new P,f=new P,m=[],g=[],v=[],p=[];for(let d=0;d<=n;d++){const _=[],y=d/n;let x=0;d===0&&a===0?x=.5/t:d===n&&l===Math.PI&&(x=-.5/t);for(let E=0;E<=t;E++){const T=E/t;h.x=-e*Math.cos(s+T*r)*Math.sin(a+y*o),h.y=e*Math.cos(a+y*o),h.z=e*Math.sin(s+T*r)*Math.sin(a+y*o),g.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),p.push(T+x,1-y),_.push(c++)}u.push(_)}for(let d=0;d<n;d++)for(let _=0;_<t;_++){const y=u[d][_+1],x=u[d][_],E=u[d+1][_],T=u[d+1][_+1];(d!==0||a>0)&&m.push(y,x,T),(d!==n-1||l<Math.PI)&&m.push(x,E,T)}this.setIndex(m),this.setAttribute("position",new nn(g,3)),this.setAttribute("normal",new nn(v,3)),this.setAttribute("uv",new nn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vc(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class n0 extends ci{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fc,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class i0 extends ci{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new xe(16777215),this.specular=new xe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fc,this.normalScale=new _e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Cc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class s0 extends ci{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$p,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class r0 extends ci{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Mf extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class a0 extends Mf{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Zo=new ot,Ju=new P,eh=new P;class o0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _e(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zc,this._frameExtents=new _e(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Ju.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ju),eh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(eh),t.updateMatrixWorld(),Zo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Zo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Zo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class bf extends mf{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class l0 extends o0{constructor(){super(new bf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class c0 extends Mf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new l0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wf extends on{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class u0 extends Tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class h0{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=th(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=th();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function th(){return performance.now()}const nh=new ot;class oc{constructor(e,t,n=0,s=1/0){this.ray=new xo(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Bc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return nh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nh),this}intersectObject(e,t=!0,n=[]){return lc(e,this,n,t),n.sort(ih),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)lc(e[s],this,n,t);return n.sort(ih),n}}function ih(i,e){return i.distance-e.distance}function lc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)lc(r[a],e,t,!0)}}class d0 extends is{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function sh(i,e,t,n){const s=f0(n);switch(t){case Qd:return i*e;case ef:return i*e;case tf:return i*e*2;case nf:return i*e/s.components*s.byteLength;case Lc:return i*e/s.components*s.byteLength;case sf:return i*e*2/s.components*s.byteLength;case Ic:return i*e*2/s.components*s.byteLength;case Jd:return i*e*3/s.components*s.byteLength;case bt:return i*e*4/s.components*s.byteLength;case Uc:return i*e*4/s.components*s.byteLength;case La:case Ia:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ua:case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ul:case Nl:return Math.max(i,16)*Math.max(e,8)/4;case Il:case Fl:return Math.max(i,8)*Math.max(e,8)/2;case Bl:case Ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ql:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Yl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case jl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case $l:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ql:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Jl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Na:case ec:case tc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case rf:case nc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ic:case sc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function f0(i){switch(i){case Dt:case Kd:return{byteLength:1,components:1};case Ir:case $d:case zr:return{byteLength:2,components:1};case Pc:case Dc:return{byteLength:2,components:4};case Ji:case Rc:case ti:return{byteLength:4,components:1};case Zd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ac}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ac);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ef(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function p0(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<h.length;m++){const g=h[f],v=h[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,h[f]=v)}h.length=f+1;for(let m=0,g=h.length;m<g;m++){const v=h[m];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var m0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,g0=`#ifdef USE_ALPHAHASH
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
#endif`,v0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,x0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,y0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,S0=`#ifdef USE_AOMAP
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
#endif`,M0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,b0=`#ifdef USE_BATCHING
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
#endif`,w0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,E0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,T0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,A0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,C0=`#ifdef USE_IRIDESCENCE
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
#endif`,R0=`#ifdef USE_BUMPMAP
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
#endif`,P0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,L0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,I0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,U0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,F0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,N0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,B0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,O0=`#define PI 3.141592653589793
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
} // validated`,z0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,k0=`vec3 transformedNormal = objectNormal;
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
#endif`,V0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,H0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,G0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,W0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,X0="gl_FragColor = linearToOutputTexel( gl_FragColor );",q0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Y0=`#ifdef USE_ENVMAP
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
#endif`,j0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,K0=`#ifdef USE_ENVMAP
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
#endif`,$0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Z0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,J0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,eg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,tg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ng=`#ifdef USE_GRADIENTMAP
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
}`,ig=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ag=`uniform bool receiveShadow;
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
#endif`,og=`#ifdef USE_ENVMAP
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
#endif`,lg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ug=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dg=`PhysicalMaterial material;
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
#endif`,fg=`struct PhysicalMaterial {
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
}`,pg=`
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
#endif`,mg=`#if defined( RE_IndirectDiffuse )
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
#endif`,gg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,xg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_g=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Mg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,bg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,wg=`#if defined( USE_POINTS_UV )
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
#endif`,Eg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Tg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ag=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pg=`#ifdef USE_MORPHTARGETS
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
#endif`,Dg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Lg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ig=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ug=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ng=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Bg=`#ifdef USE_NORMALMAP
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
#endif`,Og=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Jg=`float getShadowMask() {
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
}`,ev=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tv=`#ifdef USE_SKINNING
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
#endif`,nv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,iv=`#ifdef USE_SKINNING
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
#endif`,sv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,rv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,av=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ov=`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,lv=`#ifdef USE_TRANSMISSION
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
#endif`,cv=`#ifdef USE_TRANSMISSION
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
#endif`,uv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mv=`uniform sampler2D t2D;
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
}`,gv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_v=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yv=`#include <common>
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
}`,Sv=`#if DEPTH_PACKING == 3200
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
}`,Mv=`#define DISTANCE
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
}`,bv=`#define DISTANCE
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
}`,wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ev=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tv=`uniform float scale;
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
}`,Av=`uniform vec3 diffuse;
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
}`,Cv=`#include <common>
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
}`,Rv=`uniform vec3 diffuse;
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
}`,Pv=`#define LAMBERT
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
}`,Dv=`#define LAMBERT
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
}`,Lv=`#define MATCAP
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
}`,Iv=`#define MATCAP
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
}`,Uv=`#define NORMAL
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
}`,Fv=`#define NORMAL
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
}`,Nv=`#define PHONG
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
}`,Bv=`#define PHONG
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
}`,Ov=`#define STANDARD
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
}`,zv=`#define STANDARD
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
}`,kv=`#define TOON
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
}`,Vv=`#define TOON
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
}`,Hv=`uniform float size;
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
}`,Gv=`uniform vec3 diffuse;
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
}`,Wv=`#include <common>
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
}`,Xv=`uniform vec3 color;
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
}`,qv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,Yv=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:m0,alphahash_pars_fragment:g0,alphamap_fragment:v0,alphamap_pars_fragment:x0,alphatest_fragment:_0,alphatest_pars_fragment:y0,aomap_fragment:S0,aomap_pars_fragment:M0,batching_pars_vertex:b0,batching_vertex:w0,begin_vertex:E0,beginnormal_vertex:T0,bsdfs:A0,iridescence_fragment:C0,bumpmap_pars_fragment:R0,clipping_planes_fragment:P0,clipping_planes_pars_fragment:D0,clipping_planes_pars_vertex:L0,clipping_planes_vertex:I0,color_fragment:U0,color_pars_fragment:F0,color_pars_vertex:N0,color_vertex:B0,common:O0,cube_uv_reflection_fragment:z0,defaultnormal_vertex:k0,displacementmap_pars_vertex:V0,displacementmap_vertex:H0,emissivemap_fragment:G0,emissivemap_pars_fragment:W0,colorspace_fragment:X0,colorspace_pars_fragment:q0,envmap_fragment:Y0,envmap_common_pars_fragment:j0,envmap_pars_fragment:K0,envmap_pars_vertex:$0,envmap_physical_pars_fragment:og,envmap_vertex:Z0,fog_vertex:Q0,fog_pars_vertex:J0,fog_fragment:eg,fog_pars_fragment:tg,gradientmap_pars_fragment:ng,lightmap_pars_fragment:ig,lights_lambert_fragment:sg,lights_lambert_pars_fragment:rg,lights_pars_begin:ag,lights_toon_fragment:lg,lights_toon_pars_fragment:cg,lights_phong_fragment:ug,lights_phong_pars_fragment:hg,lights_physical_fragment:dg,lights_physical_pars_fragment:fg,lights_fragment_begin:pg,lights_fragment_maps:mg,lights_fragment_end:gg,logdepthbuf_fragment:vg,logdepthbuf_pars_fragment:xg,logdepthbuf_pars_vertex:_g,logdepthbuf_vertex:yg,map_fragment:Sg,map_pars_fragment:Mg,map_particle_fragment:bg,map_particle_pars_fragment:wg,metalnessmap_fragment:Eg,metalnessmap_pars_fragment:Tg,morphinstance_vertex:Ag,morphcolor_vertex:Cg,morphnormal_vertex:Rg,morphtarget_pars_vertex:Pg,morphtarget_vertex:Dg,normal_fragment_begin:Lg,normal_fragment_maps:Ig,normal_pars_fragment:Ug,normal_pars_vertex:Fg,normal_vertex:Ng,normalmap_pars_fragment:Bg,clearcoat_normal_fragment_begin:Og,clearcoat_normal_fragment_maps:zg,clearcoat_pars_fragment:kg,iridescence_pars_fragment:Vg,opaque_fragment:Hg,packing:Gg,premultiplied_alpha_fragment:Wg,project_vertex:Xg,dithering_fragment:qg,dithering_pars_fragment:Yg,roughnessmap_fragment:jg,roughnessmap_pars_fragment:Kg,shadowmap_pars_fragment:$g,shadowmap_pars_vertex:Zg,shadowmap_vertex:Qg,shadowmask_pars_fragment:Jg,skinbase_vertex:ev,skinning_pars_vertex:tv,skinning_vertex:nv,skinnormal_vertex:iv,specularmap_fragment:sv,specularmap_pars_fragment:rv,tonemapping_fragment:av,tonemapping_pars_fragment:ov,transmission_fragment:lv,transmission_pars_fragment:cv,uv_pars_fragment:uv,uv_pars_vertex:hv,uv_vertex:dv,worldpos_vertex:fv,background_vert:pv,background_frag:mv,backgroundCube_vert:gv,backgroundCube_frag:vv,cube_vert:xv,cube_frag:_v,depth_vert:yv,depth_frag:Sv,distanceRGBA_vert:Mv,distanceRGBA_frag:bv,equirect_vert:wv,equirect_frag:Ev,linedashed_vert:Tv,linedashed_frag:Av,meshbasic_vert:Cv,meshbasic_frag:Rv,meshlambert_vert:Pv,meshlambert_frag:Dv,meshmatcap_vert:Lv,meshmatcap_frag:Iv,meshnormal_vert:Uv,meshnormal_frag:Fv,meshphong_vert:Nv,meshphong_frag:Bv,meshphysical_vert:Ov,meshphysical_frag:zv,meshtoon_vert:kv,meshtoon_frag:Vv,points_vert:Hv,points_frag:Gv,shadow_vert:Wv,shadow_frag:Xv,sprite_vert:qv,sprite_frag:Yv},se={common:{diffuse:{value:new xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new _e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new xe(16777215)},opacity:{value:1},center:{value:new _e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},kn={basic:{uniforms:Zt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Zt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new xe(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Zt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new xe(0)},specular:{value:new xe(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Zt([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Zt([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new xe(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Zt([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Zt([se.points,se.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Zt([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Zt([se.common,se.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Zt([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Zt([se.sprite,se.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Zt([se.common,se.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Zt([se.lights,se.fog,{color:{value:new xe(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};kn.physical={uniforms:Zt([kn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new _e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new _e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new xe(0)},specularColor:{value:new xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new _e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const xa={r:0,b:0,g:0},Vi=new zn,jv=new ot;function Kv(i,e,t,n,s,r,a){const o=new xe(0);let l=r===!0?0:1,c,u,h=null,f=0,m=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function v(y){let x=!1;const E=g(y);E===null?d(o,l):E&&E.isColor&&(d(E,1),x=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(y,x){const E=g(x);E&&(E.isCubeTexture||E.mapping===vo)?(u===void 0&&(u=new zt(new Hr(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:Zs(kn.backgroundCube.uniforms),vertexShader:kn.backgroundCube.vertexShader,fragmentShader:kn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Vi.copy(x.backgroundRotation),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(jv.makeRotationFromEuler(Vi)),u.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,(h!==E||f!==E.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=E,f=E.version,m=i.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new zt(new tr(2,2),new Vt({name:"BackgroundMaterial",uniforms:Zs(kn.background.uniforms),vertexShader:kn.background.vertexShader,fragmentShader:kn.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||f!==E.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=E,f=E.version,m=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function d(y,x){y.getRGB(xa,pf(i)),n.buffers.color.setClear(xa.r,xa.g,xa.b,x,a)}function _(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(y,x=1){o.set(y),l=x,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(o,l)},render:v,addToRenderList:p,dispose:_}}function $v(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(S,D,B,N,W){let X=!1;const H=h(N,B,D);r!==H&&(r=H,c(r.object)),X=m(S,N,B,W),X&&g(S,N,B,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,x(S,D,B,N),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function h(S,D,B){const N=B.wireframe===!0;let W=n[S.id];W===void 0&&(W={},n[S.id]=W);let X=W[D.id];X===void 0&&(X={},W[D.id]=X);let H=X[N];return H===void 0&&(H=f(l()),X[N]=H),H}function f(S){const D=[],B=[],N=[];for(let W=0;W<t;W++)D[W]=0,B[W]=0,N[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:B,attributeDivisors:N,object:S,attributes:{},index:null}}function m(S,D,B,N){const W=r.attributes,X=D.attributes;let H=0;const Y=B.getAttributes();for(const V in Y)if(Y[V].location>=0){const re=W[V];let ge=X[V];if(ge===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(ge=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(ge=S.instanceColor)),re===void 0||re.attribute!==ge||ge&&re.data!==ge.data)return!0;H++}return r.attributesNum!==H||r.index!==N}function g(S,D,B,N){const W={},X=D.attributes;let H=0;const Y=B.getAttributes();for(const V in Y)if(Y[V].location>=0){let re=X[V];re===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(re=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(re=S.instanceColor));const ge={};ge.attribute=re,re&&re.data&&(ge.data=re.data),W[V]=ge,H++}r.attributes=W,r.attributesNum=H,r.index=N}function v(){const S=r.newAttributes;for(let D=0,B=S.length;D<B;D++)S[D]=0}function p(S){d(S,0)}function d(S,D){const B=r.newAttributes,N=r.enabledAttributes,W=r.attributeDivisors;B[S]=1,N[S]===0&&(i.enableVertexAttribArray(S),N[S]=1),W[S]!==D&&(i.vertexAttribDivisor(S,D),W[S]=D)}function _(){const S=r.newAttributes,D=r.enabledAttributes;for(let B=0,N=D.length;B<N;B++)D[B]!==S[B]&&(i.disableVertexAttribArray(B),D[B]=0)}function y(S,D,B,N,W,X,H){H===!0?i.vertexAttribIPointer(S,D,B,W,X):i.vertexAttribPointer(S,D,B,N,W,X)}function x(S,D,B,N){v();const W=N.attributes,X=B.getAttributes(),H=D.defaultAttributeValues;for(const Y in X){const V=X[Y];if(V.location>=0){let Q=W[Y];if(Q===void 0&&(Y==="instanceMatrix"&&S.instanceMatrix&&(Q=S.instanceMatrix),Y==="instanceColor"&&S.instanceColor&&(Q=S.instanceColor)),Q!==void 0){const re=Q.normalized,ge=Q.itemSize,ye=e.get(Q);if(ye===void 0)continue;const be=ye.buffer,q=ye.type,J=ye.bytesPerElement,he=q===i.INT||q===i.UNSIGNED_INT||Q.gpuType===Rc;if(Q.isInterleavedBufferAttribute){const ie=Q.data,we=ie.stride,De=Q.offset;if(ie.isInstancedInterleavedBuffer){for(let He=0;He<V.locationSize;He++)d(V.location+He,ie.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let He=0;He<V.locationSize;He++)p(V.location+He);i.bindBuffer(i.ARRAY_BUFFER,be);for(let He=0;He<V.locationSize;He++)y(V.location+He,ge/V.locationSize,q,re,we*J,(De+ge/V.locationSize*He)*J,he)}else{if(Q.isInstancedBufferAttribute){for(let ie=0;ie<V.locationSize;ie++)d(V.location+ie,Q.meshPerAttribute);S.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ie=0;ie<V.locationSize;ie++)p(V.location+ie);i.bindBuffer(i.ARRAY_BUFFER,be);for(let ie=0;ie<V.locationSize;ie++)y(V.location+ie,ge/V.locationSize,q,re,ge*J,ge/V.locationSize*ie*J,he)}}else if(H!==void 0){const re=H[Y];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(V.location,re);break;case 3:i.vertexAttrib3fv(V.location,re);break;case 4:i.vertexAttrib4fv(V.location,re);break;default:i.vertexAttrib1fv(V.location,re)}}}}_()}function E(){R();for(const S in n){const D=n[S];for(const B in D){const N=D[B];for(const W in N)u(N[W].object),delete N[W];delete D[B]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const D=n[S.id];for(const B in D){const N=D[B];for(const W in N)u(N[W].object),delete N[W];delete D[B]}delete n[S.id]}function A(S){for(const D in n){const B=n[D];if(B[S.id]===void 0)continue;const N=B[S.id];for(const W in N)u(N[W].object),delete N[W];delete B[S.id]}}function R(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:M,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:p,disableUnusedAttributes:_}}function Zv(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];t.update(m,n,1)}function l(c,u,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*f[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Qv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==bt&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===zr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Dt&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ti&&!R)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:E,maxSamples:T}}function Jv(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Gi,o=new Le,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||s;return s=f,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,d=i.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{const _=r?0:n,y=_*4;let x=d.clippingState||null;l.value=x,x=u(g,f,y,m);for(let E=0;E!==y;++E)x[E]=t[E];d.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,m,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const d=m+v*4,_=f.matrixWorldInverse;o.getNormalMatrix(_),(p===null||p.length<d)&&(p=new Float32Array(d));for(let y=0,x=m;y!==v;++y,x+=4)a.copy(h[y]).applyMatrix4(_,o),a.normal.toArray(p,x),p[x+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function ex(i){let e=new WeakMap;function t(a,o){return o===Pl?a.mapping=qs:o===Dl&&(a.mapping=Ys),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Pl||o===Dl)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Ym(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ds=4,rh=[.125,.215,.35,.446,.526,.582],Yi=20,Qo=new bf,ah=new xe;let Jo=null,el=0,tl=0,nl=!1;const Wi=(1+Math.sqrt(5))/2,bs=1/Wi,oh=[new P(-Wi,bs,0),new P(Wi,bs,0),new P(-bs,0,Wi),new P(bs,0,Wi),new P(0,Wi,-bs),new P(0,Wi,bs),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class lh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Jo=this._renderer.getRenderTarget(),el=this._renderer.getActiveCubeFace(),tl=this._renderer.getActiveMipmapLevel(),nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Jo,el,tl),this._renderer.xr.enabled=nl,e.scissorTest=!1,_a(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qs||e.mapping===Ys?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jo=this._renderer.getRenderTarget(),el=this._renderer.getActiveCubeFace(),tl=this._renderer.getActiveMipmapLevel(),nl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:it,minFilter:it,generateMipmaps:!1,type:zr,format:bt,colorSpace:$s,depthBuffer:!1},s=ch(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ch(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tx(r)),this._blurMaterial=nx(r,e,t)}return s}_compileMaterial(e){const t=new zt(this._lodPlanes[0],e);this._renderer.compile(t,Qo)}_sceneToCubeUV(e,t,n,s){const o=new Tn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(ah),u.toneMapping=bi,u.autoClear=!1;const m=new hf({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new zt(new Hr,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(ah),v=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):_===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const y=this._cubeSize;_a(s,_*y,d>2?y:0,y,y),u.setRenderTarget(s),v&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===qs||e.mapping===Ys;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=hh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=uh());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new zt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;_a(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Qo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=oh[(s-r-1)%oh.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new zt(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Yi-1),v=r/g,p=isFinite(r)?1+Math.floor(u*v):Yi;p>Yi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Yi}`);const d=[];let _=0;for(let A=0;A<Yi;++A){const R=A/v,M=Math.exp(-R*R/2);d.push(M),A===0?_+=M:A<p&&(_+=2*M)}for(let A=0;A<d.length;A++)d[A]=d[A]/_;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=g,f.mipInt.value=y-n;const x=this._sizeLods[s],E=3*x*(s>y-Ds?s-y+Ds:0),T=4*(this._cubeSize-x);_a(t,E,T,3*x,2*x),l.setRenderTarget(t),l.render(h,Qo)}}function tx(i){const e=[],t=[],n=[];let s=i;const r=i-Ds+1+rh.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-Ds?l=rh[a-i+Ds-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,v=3,p=2,d=1,_=new Float32Array(v*g*m),y=new Float32Array(p*g*m),x=new Float32Array(d*g*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,R=T>2?0:-1,M=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];_.set(M,v*g*T),y.set(f,p*g*T);const S=[T,T,T,T,T,T];x.set(S,d*g*T)}const E=new on;E.setAttribute("position",new kt(_,v)),E.setAttribute("uv",new kt(y,p)),E.setAttribute("faceIndex",new kt(x,d)),e.push(E),s>Ds&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ch(i,e,t){const n=new es(i,e,t);return n.texture.mapping=vo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _a(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function nx(i,e,t){const n=new Float32Array(Yi),s=new P(0,1,0);return new Vt({name:"SphericalGaussianBlur",defines:{n:Yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hc(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function uh(){return new Vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hc(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function hh(){return new Vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Hc(){return`

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
	`}function ix(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Pl||l===Dl,u=l===qs||l===Ys;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new lh(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new lh(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function sx(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Cs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function rx(i,e,t,n){const s={},r=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function c(h){const f=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const _=m.array;v=m.version;for(let y=0,x=_.length;y<x;y+=3){const E=_[y+0],T=_[y+1],A=_[y+2];f.push(E,T,T,A,A,E)}}else if(g!==void 0){const _=g.array;v=g.version;for(let y=0,x=_.length/3-1;y<x;y+=3){const E=y+0,T=y+1,A=y+2;f.push(E,T,T,A,A,E)}}else return;const p=new(of(f)?ff:df)(f,1);p.version=v;const d=r.get(h);d&&e.remove(d),r.set(h,p)}function u(h){const f=r.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function ax(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*a),t.update(m,n,1)}function c(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,f*a,g),t.update(m,n,g))}function u(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,g);let p=0;for(let d=0;d<g;d++)p+=m[d];t.update(p,n,1)}function h(f,m,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/a,m[d],v[d]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,v,0,g);let d=0;for(let _=0;_<g;_++)d+=m[_]*v[_];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function ox(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function lx(i,e,t){const n=new WeakMap,s=new xt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let S=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var m=S;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),v===!0&&(x=2),p===!0&&(x=3);let E=o.attributes.position.count*x,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const A=new Float32Array(E*T*4*h),R=new cf(A,E,T,h);R.type=ti,R.needsUpdate=!0;const M=x*4;for(let D=0;D<h;D++){const B=d[D],N=_[D],W=y[D],X=E*T*4*D;for(let H=0;H<B.count;H++){const Y=H*M;g===!0&&(s.fromBufferAttribute(B,H),A[X+Y+0]=s.x,A[X+Y+1]=s.y,A[X+Y+2]=s.z,A[X+Y+3]=0),v===!0&&(s.fromBufferAttribute(N,H),A[X+Y+4]=s.x,A[X+Y+5]=s.y,A[X+Y+6]=s.z,A[X+Y+7]=0),p===!0&&(s.fromBufferAttribute(W,H),A[X+Y+8]=s.x,A[X+Y+9]=s.y,A[X+Y+10]=s.z,A[X+Y+11]=W.itemSize===4?s.w:1)}}f={count:h,texture:R,size:new _e(E,T)},n.set(o,f),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function cx(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Tf=new tn,dh=new Sf(1,1),Af=new cf,Cf=new Dm,Rf=new gf,fh=[],ph=[],mh=new Float32Array(16),gh=new Float32Array(9),vh=new Float32Array(4);function nr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=fh[s];if(r===void 0&&(r=new Float32Array(s),fh[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function It(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function _o(i,e){let t=ph[e];t===void 0&&(t=new Int32Array(e),ph[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ux(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function hx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2fv(this.addr,e),It(t,e)}}function dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;i.uniform3fv(this.addr,e),It(t,e)}}function fx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4fv(this.addr,e),It(t,e)}}function px(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;vh.set(n),i.uniformMatrix2fv(this.addr,!1,vh),It(t,n)}}function mx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;gh.set(n),i.uniformMatrix3fv(this.addr,!1,gh),It(t,n)}}function gx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;mh.set(n),i.uniformMatrix4fv(this.addr,!1,mh),It(t,n)}}function vx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function xx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2iv(this.addr,e),It(t,e)}}function _x(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3iv(this.addr,e),It(t,e)}}function yx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4iv(this.addr,e),It(t,e)}}function Sx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Mx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2uiv(this.addr,e),It(t,e)}}function bx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3uiv(this.addr,e),It(t,e)}}function wx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4uiv(this.addr,e),It(t,e)}}function Ex(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(dh.compareFunction=af,r=dh):r=Tf,t.setTexture2D(e||r,s)}function Tx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Cf,s)}function Ax(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Rf,s)}function Cx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Af,s)}function Rx(i){switch(i){case 5126:return ux;case 35664:return hx;case 35665:return dx;case 35666:return fx;case 35674:return px;case 35675:return mx;case 35676:return gx;case 5124:case 35670:return vx;case 35667:case 35671:return xx;case 35668:case 35672:return _x;case 35669:case 35673:return yx;case 5125:return Sx;case 36294:return Mx;case 36295:return bx;case 36296:return wx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ex;case 35679:case 36299:case 36307:return Tx;case 35680:case 36300:case 36308:case 36293:return Ax;case 36289:case 36303:case 36311:case 36292:return Cx}}function Px(i,e){i.uniform1fv(this.addr,e)}function Dx(i,e){const t=nr(e,this.size,2);i.uniform2fv(this.addr,t)}function Lx(i,e){const t=nr(e,this.size,3);i.uniform3fv(this.addr,t)}function Ix(i,e){const t=nr(e,this.size,4);i.uniform4fv(this.addr,t)}function Ux(i,e){const t=nr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Fx(i,e){const t=nr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Nx(i,e){const t=nr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Bx(i,e){i.uniform1iv(this.addr,e)}function Ox(i,e){i.uniform2iv(this.addr,e)}function zx(i,e){i.uniform3iv(this.addr,e)}function kx(i,e){i.uniform4iv(this.addr,e)}function Vx(i,e){i.uniform1uiv(this.addr,e)}function Hx(i,e){i.uniform2uiv(this.addr,e)}function Gx(i,e){i.uniform3uiv(this.addr,e)}function Wx(i,e){i.uniform4uiv(this.addr,e)}function Xx(i,e,t){const n=this.cache,s=e.length,r=_o(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Tf,r[a])}function qx(i,e,t){const n=this.cache,s=e.length,r=_o(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Cf,r[a])}function Yx(i,e,t){const n=this.cache,s=e.length,r=_o(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Rf,r[a])}function jx(i,e,t){const n=this.cache,s=e.length,r=_o(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Af,r[a])}function Kx(i){switch(i){case 5126:return Px;case 35664:return Dx;case 35665:return Lx;case 35666:return Ix;case 35674:return Ux;case 35675:return Fx;case 35676:return Nx;case 5124:case 35670:return Bx;case 35667:case 35671:return Ox;case 35668:case 35672:return zx;case 35669:case 35673:return kx;case 5125:return Vx;case 36294:return Hx;case 36295:return Gx;case 36296:return Wx;case 35678:case 36198:case 36298:case 36306:case 35682:return Xx;case 35679:case 36299:case 36307:return qx;case 35680:case 36300:case 36308:case 36293:return Yx;case 36289:case 36303:case 36311:case 36292:return jx}}class $x{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Rx(t.type)}}class Zx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Kx(t.type)}}class Qx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const il=/(\w+)(\])?(\[|\.)?/g;function xh(i,e){i.seq.push(e),i.map[e.id]=e}function Jx(i,e,t){const n=i.name,s=n.length;for(il.lastIndex=0;;){const r=il.exec(n),a=il.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xh(t,c===void 0?new $x(o,i,e):new Zx(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new Qx(o),xh(t,h)),t=h}}}class Ba{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Jx(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function _h(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const e_=37297;let t_=0;function n_(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const yh=new Le;function i_(i){Je._getMatrix(yh,Je.workingColorSpace,i);const e=`mat3( ${yh.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case Ya:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Sh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+n_(i.getShaderSource(e),a)}else return s}function s_(i,e){const t=i_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function r_(i,e){let t;switch(e){case Hp:t="Linear";break;case Gp:t="Reinhard";break;case Wp:t="Cineon";break;case Xp:t="ACESFilmic";break;case Yp:t="AgX";break;case jp:t="Neutral";break;case qp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ya=new P;function a_(){Je.getLuminanceCoefficients(ya);const i=ya.x.toFixed(4),e=ya.y.toFixed(4),t=ya.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function o_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function l_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function c_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function vr(i){return i!==""}function Mh(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const u_=/^[ \t]*#include +<([\w\d./]+)>/gm;function cc(i){return i.replace(u_,d_)}const h_=new Map;function d_(i,e){let t=ze[e];if(t===void 0){const n=h_.get(e);if(n!==void 0)t=ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return cc(t)}const f_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wh(i){return i.replace(f_,p_)}function p_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Eh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function m_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===qd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yd?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function g_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case qs:case Ys:e="ENVMAP_TYPE_CUBE";break;case vo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function v_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ys:e="ENVMAP_MODE_REFRACTION";break}return e}function x_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Cc:e="ENVMAP_BLENDING_MULTIPLY";break;case kp:e="ENVMAP_BLENDING_MIX";break;case Vp:e="ENVMAP_BLENDING_ADD";break}return e}function __(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function y_(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=m_(t),c=g_(t),u=v_(t),h=x_(t),f=__(t),m=o_(t),g=l_(r),v=s.createProgram();let p,d,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vr).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vr).join(`
`),d.length>0&&(d+=`
`)):(p=[Eh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),d=[Eh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bi?"#define TONE_MAPPING":"",t.toneMapping!==bi?ze.tonemapping_pars_fragment:"",t.toneMapping!==bi?r_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,s_("linearToOutputTexel",t.outputColorSpace),a_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vr).join(`
`)),a=cc(a),a=Mh(a,t),a=bh(a,t),o=cc(o),o=Mh(o,t),o=bh(o,t),a=wh(a),o=wh(o),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===Tu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Tu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=_+p+a,x=_+d+o,E=_h(s,s.VERTEX_SHADER,y),T=_h(s,s.FRAGMENT_SHADER,x);s.attachShader(v,E),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(D){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(v).trim(),N=s.getShaderInfoLog(E).trim(),W=s.getShaderInfoLog(T).trim();let X=!0,H=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,T);else{const Y=Sh(s,E,"vertex"),V=Sh(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+B+`
`+Y+`
`+V)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(N===""||W==="")&&(H=!1);H&&(D.diagnostics={runnable:X,programLog:B,vertexShader:{log:N,prefix:p},fragmentShader:{log:W,prefix:d}})}s.deleteShader(E),s.deleteShader(T),R=new Ba(s,v),M=c_(s,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,e_)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=t_++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let S_=0;class M_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new b_(e),t.set(e,n)),n}}class b_{constructor(e){this.id=S_++,this.code=e,this.usedTimes=0}}function w_(i,e,t,n,s,r,a){const o=new Bc,l=new M_,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,S,D,B,N){const W=B.fog,X=N.geometry,H=M.isMeshStandardMaterial?B.environment:null,Y=(M.isMeshStandardMaterial?t:e).get(M.envMap||H),V=Y&&Y.mapping===vo?Y.image.height:null,Q=g[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const re=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ge=re!==void 0?re.length:0;let ye=0;X.morphAttributes.position!==void 0&&(ye=1),X.morphAttributes.normal!==void 0&&(ye=2),X.morphAttributes.color!==void 0&&(ye=3);let be,q,J,he;if(Q){const st=kn[Q];be=st.vertexShader,q=st.fragmentShader}else be=M.vertexShader,q=M.fragmentShader,l.update(M),J=l.getVertexShaderID(M),he=l.getFragmentShaderID(M);const ie=i.getRenderTarget(),we=i.state.buffers.depth.getReversed(),De=N.isInstancedMesh===!0,He=N.isBatchedMesh===!0,ft=!!M.map,je=!!M.matcap,_t=!!Y,L=!!M.aoMap,Sn=!!M.lightMap,Xe=!!M.bumpMap,qe=!!M.normalMap,Ee=!!M.displacementMap,ut=!!M.emissiveMap,Te=!!M.metalnessMap,C=!!M.roughnessMap,b=M.anisotropy>0,O=M.clearcoat>0,K=M.dispersion>0,Z=M.iridescence>0,j=M.sheen>0,Se=M.transmission>0,le=b&&!!M.anisotropyMap,fe=O&&!!M.clearcoatMap,Ke=O&&!!M.clearcoatNormalMap,te=O&&!!M.clearcoatRoughnessMap,pe=Z&&!!M.iridescenceMap,Pe=Z&&!!M.iridescenceThicknessMap,Ie=j&&!!M.sheenColorMap,me=j&&!!M.sheenRoughnessMap,Ye=!!M.specularMap,Oe=!!M.specularColorMap,ct=!!M.specularIntensityMap,I=Se&&!!M.transmissionMap,ae=Se&&!!M.thicknessMap,G=!!M.gradientMap,$=!!M.alphaMap,ue=M.alphaTest>0,ce=!!M.alphaHash,Be=!!M.extensions;let mt=bi;M.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(mt=i.toneMapping);const Gt={shaderID:Q,shaderType:M.type,shaderName:M.name,vertexShader:be,fragmentShader:q,defines:M.defines,customVertexShaderID:J,customFragmentShaderID:he,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:He,batchingColor:He&&N._colorsTexture!==null,instancing:De,instancingColor:De&&N.instanceColor!==null,instancingMorph:De&&N.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:$s,alphaToCoverage:!!M.alphaToCoverage,map:ft,matcap:je,envMap:_t,envMapMode:_t&&Y.mapping,envMapCubeUVHeight:V,aoMap:L,lightMap:Sn,bumpMap:Xe,normalMap:qe,displacementMap:f&&Ee,emissiveMap:ut,normalMapObjectSpace:qe&&M.normalMapType===Qp,normalMapTangentSpace:qe&&M.normalMapType===Fc,metalnessMap:Te,roughnessMap:C,anisotropy:b,anisotropyMap:le,clearcoat:O,clearcoatMap:fe,clearcoatNormalMap:Ke,clearcoatRoughnessMap:te,dispersion:K,iridescence:Z,iridescenceMap:pe,iridescenceThicknessMap:Pe,sheen:j,sheenColorMap:Ie,sheenRoughnessMap:me,specularMap:Ye,specularColorMap:Oe,specularIntensityMap:ct,transmission:Se,transmissionMap:I,thicknessMap:ae,gradientMap:G,opaque:M.transparent===!1&&M.blending===Wn&&M.alphaToCoverage===!1,alphaMap:$,alphaTest:ue,alphaHash:ce,combine:M.combine,mapUv:ft&&v(M.map.channel),aoMapUv:L&&v(M.aoMap.channel),lightMapUv:Sn&&v(M.lightMap.channel),bumpMapUv:Xe&&v(M.bumpMap.channel),normalMapUv:qe&&v(M.normalMap.channel),displacementMapUv:Ee&&v(M.displacementMap.channel),emissiveMapUv:ut&&v(M.emissiveMap.channel),metalnessMapUv:Te&&v(M.metalnessMap.channel),roughnessMapUv:C&&v(M.roughnessMap.channel),anisotropyMapUv:le&&v(M.anisotropyMap.channel),clearcoatMapUv:fe&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(M.sheenRoughnessMap.channel),specularMapUv:Ye&&v(M.specularMap.channel),specularColorMapUv:Oe&&v(M.specularColorMap.channel),specularIntensityMapUv:ct&&v(M.specularIntensityMap.channel),transmissionMapUv:I&&v(M.transmissionMap.channel),thicknessMapUv:ae&&v(M.thicknessMap.channel),alphaMapUv:$&&v(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(qe||b),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!X.attributes.uv&&(ft||$),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:we,skinning:N.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:ye,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:mt,decodeVideoTexture:ft&&M.map.isVideoTexture===!0&&Je.getTransfer(M.map.colorSpace)===at,decodeVideoTextureEmissive:ut&&M.emissiveMap.isVideoTexture===!0&&Je.getTransfer(M.emissiveMap.colorSpace)===at,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===An,flipSided:M.side===en,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Be&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&M.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Gt.vertexUv1s=c.has(1),Gt.vertexUv2s=c.has(2),Gt.vertexUv3s=c.has(3),c.clear(),Gt}function d(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)S.push(D),S.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(_(S,M),y(S,M),S.push(i.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function _(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function y(M,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),M.push(o.mask)}function x(M){const S=g[M.type];let D;if(S){const B=kn[S];D=Gm.clone(B.uniforms)}else D=M.uniforms;return D}function E(M,S){let D;for(let B=0,N=u.length;B<N;B++){const W=u[B];if(W.cacheKey===S){D=W,++D.usedTimes;break}}return D===void 0&&(D=new y_(i,S,M,r),u.push(D)),D}function T(M){if(--M.usedTimes===0){const S=u.indexOf(M);u[S]=u[u.length-1],u.pop(),M.destroy()}}function A(M){l.remove(M)}function R(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:x,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:R}}function E_(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function T_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Th(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ah(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,f,m,g,v,p){let d=i[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},i[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=v,d.group=p),e++,d}function o(h,f,m,g,v,p){const d=a(h,f,m,g,v,p);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(h,f,m,g,v,p){const d=a(h,f,m,g,v,p);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||T_),n.length>1&&n.sort(f||Th),s.length>1&&s.sort(f||Th)}function u(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function A_(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Ah,i.set(n,[a])):s>=r.length?(a=new Ah,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function C_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new xe};break;case"SpotLight":t={position:new P,direction:new P,color:new xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new xe,groundColor:new xe};break;case"RectAreaLight":t={color:new xe,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function R_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _e,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let P_=0;function D_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function L_(i){const e=new C_,t=R_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new ot,a=new ot;function o(c){let u=0,h=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let m=0,g=0,v=0,p=0,d=0,_=0,y=0,x=0,E=0,T=0,A=0;c.sort(D_);for(let M=0,S=c.length;M<S;M++){const D=c[M],B=D.color,N=D.intensity,W=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=B.r*N,h+=B.g*N,f+=B.b*N;else if(D.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(D.sh.coefficients[H],N);A++}else if(D.isDirectionalLight){const H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Y=D.shadow,V=t.get(D);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.directionalShadow[m]=V,n.directionalShadowMap[m]=X,n.directionalShadowMatrix[m]=D.shadow.matrix,_++}n.directional[m]=H,m++}else if(D.isSpotLight){const H=e.get(D);H.position.setFromMatrixPosition(D.matrixWorld),H.color.copy(B).multiplyScalar(N),H.distance=W,H.coneCos=Math.cos(D.angle),H.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),H.decay=D.decay,n.spot[v]=H;const Y=D.shadow;if(D.map&&(n.spotLightMap[E]=D.map,E++,Y.updateMatrices(D),D.castShadow&&T++),n.spotLightMatrix[v]=Y.matrix,D.castShadow){const V=t.get(D);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=X,x++}v++}else if(D.isRectAreaLight){const H=e.get(D);H.color.copy(B).multiplyScalar(N),H.halfWidth.set(D.width*.5,0,0),H.halfHeight.set(0,D.height*.5,0),n.rectArea[p]=H,p++}else if(D.isPointLight){const H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),H.distance=D.distance,H.decay=D.decay,D.castShadow){const Y=D.shadow,V=t.get(D);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,V.shadowCameraNear=Y.camera.near,V.shadowCameraFar=Y.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=D.shadow.matrix,y++}n.point[g]=H,g++}else if(D.isHemisphereLight){const H=e.get(D);H.skyColor.copy(D.color).multiplyScalar(N),H.groundColor.copy(D.groundColor).multiplyScalar(N),n.hemi[d]=H,d++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=se.LTC_FLOAT_1,n.rectAreaLTC2=se.LTC_FLOAT_2):(n.rectAreaLTC1=se.LTC_HALF_1,n.rectAreaLTC2=se.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const R=n.hash;(R.directionalLength!==m||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==p||R.hemiLength!==d||R.numDirectionalShadows!==_||R.numPointShadows!==y||R.numSpotShadows!==x||R.numSpotMaps!==E||R.numLightProbes!==A)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,R.directionalLength=m,R.pointLength=g,R.spotLength=v,R.rectAreaLength=p,R.hemiLength=d,R.numDirectionalShadows=_,R.numPointShadows=y,R.numSpotShadows=x,R.numSpotMaps=E,R.numLightProbes=A,n.version=P_++)}function l(c,u){let h=0,f=0,m=0,g=0,v=0;const p=u.matrixWorldInverse;for(let d=0,_=c.length;d<_;d++){const y=c[d];if(y.isDirectionalLight){const x=n.directional[h];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),h++}else if(y.isSpotLight){const x=n.spot[m];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:n}}function Ch(i){const e=new L_(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function I_(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ch(i),e.set(s,[o])):r>=a.length?(o=new Ch(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const U_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,F_=`uniform sampler2D shadow_pass;
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
}`;function N_(i,e,t){let n=new zc;const s=new _e,r=new _e,a=new xt,o=new s0({depthPacking:Zp}),l=new r0,c={},u=t.maxTextureSize,h={[_n]:en,[en]:_n,[An]:An},f=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _e},radius:{value:4}},vertexShader:U_,fragmentShader:F_}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new on;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new zt(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qd;let d=this.type;this.render=function(T,A,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const M=i.getRenderTarget(),S=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Mi),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const N=d!==Jn&&this.type===Jn,W=d===Jn&&this.type!==Jn;for(let X=0,H=T.length;X<H;X++){const Y=T[X],V=Y.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const Q=V.getFrameExtents();if(s.multiply(Q),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Q.x),s.x=r.x*Q.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Q.y),s.y=r.y*Q.y,V.mapSize.y=r.y)),V.map===null||N===!0||W===!0){const ge=this.type!==Jn?{minFilter:Pt,magFilter:Pt}:{};V.map!==null&&V.map.dispose(),V.map=new es(s.x,s.y,ge),V.map.texture.name=Y.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const re=V.getViewportCount();for(let ge=0;ge<re;ge++){const ye=V.getViewport(ge);a.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),B.viewport(a),V.updateMatrices(Y,ge),n=V.getFrustum(),x(A,R,V.camera,Y,this.type)}V.isPointLightShadow!==!0&&this.type===Jn&&_(V,R),V.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(M,S,D)};function _(T,A){const R=e.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new es(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,R,f,v,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,R,m,v,null)}function y(T,A,R,M){let S=null;const D=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)S=D;else if(S=R.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const B=S.uuid,N=A.uuid;let W=c[B];W===void 0&&(W={},c[B]=W);let X=W[N];X===void 0&&(X=S.clone(),W[N]=X,A.addEventListener("dispose",E)),S=X}if(S.visible=A.visible,S.wireframe=A.wireframe,M===Jn?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const B=i.properties.get(S);B.light=R}return S}function x(T,A,R,M,S){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===Jn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const N=e.update(T),W=T.material;if(Array.isArray(W)){const X=N.groups;for(let H=0,Y=X.length;H<Y;H++){const V=X[H],Q=W[V.materialIndex];if(Q&&Q.visible){const re=y(T,Q,M,S);T.onBeforeShadow(i,T,A,R,N,re,V),i.renderBufferDirect(R,null,N,re,T,V),T.onAfterShadow(i,T,A,R,N,re,V)}}}else if(W.visible){const X=y(T,W,M,S);T.onBeforeShadow(i,T,A,R,N,X,null),i.renderBufferDirect(R,null,N,X,T,null),T.onAfterShadow(i,T,A,R,N,X,null)}}const B=T.children;for(let N=0,W=B.length;N<W;N++)x(B[N],A,R,M,S)}function E(T){T.target.removeEventListener("dispose",E);for(const R in c){const M=c[R],S=T.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const B_={[bl]:wl,[El]:Cl,[Tl]:Rl,[Xs]:Al,[wl]:bl,[Cl]:El,[Rl]:Tl,[Al]:Xs};function O_(i,e){function t(){let I=!1;const ae=new xt;let G=null;const $=new xt(0,0,0,0);return{setMask:function(ue){G!==ue&&!I&&(i.colorMask(ue,ue,ue,ue),G=ue)},setLocked:function(ue){I=ue},setClear:function(ue,ce,Be,mt,Gt){Gt===!0&&(ue*=mt,ce*=mt,Be*=mt),ae.set(ue,ce,Be,mt),$.equals(ae)===!1&&(i.clearColor(ue,ce,Be,mt),$.copy(ae))},reset:function(){I=!1,G=null,$.set(-1,0,0,0)}}}function n(){let I=!1,ae=!1,G=null,$=null,ue=null;return{setReversed:function(ce){if(ae!==ce){const Be=e.get("EXT_clip_control");ae?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT);const mt=ue;ue=null,this.setClear(mt)}ae=ce},getReversed:function(){return ae},setTest:function(ce){ce?ie(i.DEPTH_TEST):we(i.DEPTH_TEST)},setMask:function(ce){G!==ce&&!I&&(i.depthMask(ce),G=ce)},setFunc:function(ce){if(ae&&(ce=B_[ce]),$!==ce){switch(ce){case bl:i.depthFunc(i.NEVER);break;case wl:i.depthFunc(i.ALWAYS);break;case El:i.depthFunc(i.LESS);break;case Xs:i.depthFunc(i.LEQUAL);break;case Tl:i.depthFunc(i.EQUAL);break;case Al:i.depthFunc(i.GEQUAL);break;case Cl:i.depthFunc(i.GREATER);break;case Rl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=ce}},setLocked:function(ce){I=ce},setClear:function(ce){ue!==ce&&(ae&&(ce=1-ce),i.clearDepth(ce),ue=ce)},reset:function(){I=!1,G=null,$=null,ue=null,ae=!1}}}function s(){let I=!1,ae=null,G=null,$=null,ue=null,ce=null,Be=null,mt=null,Gt=null;return{setTest:function(st){I||(st?ie(i.STENCIL_TEST):we(i.STENCIL_TEST))},setMask:function(st){ae!==st&&!I&&(i.stencilMask(st),ae=st)},setFunc:function(st,Pn,Yn){(G!==st||$!==Pn||ue!==Yn)&&(i.stencilFunc(st,Pn,Yn),G=st,$=Pn,ue=Yn)},setOp:function(st,Pn,Yn){(ce!==st||Be!==Pn||mt!==Yn)&&(i.stencilOp(st,Pn,Yn),ce=st,Be=Pn,mt=Yn)},setLocked:function(st){I=st},setClear:function(st){Gt!==st&&(i.clearStencil(st),Gt=st)},reset:function(){I=!1,ae=null,G=null,$=null,ue=null,ce=null,Be=null,mt=null,Gt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,m=[],g=null,v=!1,p=null,d=null,_=null,y=null,x=null,E=null,T=null,A=new xe(0,0,0),R=0,M=!1,S=null,D=null,B=null,N=null,W=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Y=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=Y>=1):V.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=Y>=2);let Q=null,re={};const ge=i.getParameter(i.SCISSOR_BOX),ye=i.getParameter(i.VIEWPORT),be=new xt().fromArray(ge),q=new xt().fromArray(ye);function J(I,ae,G,$){const ue=new Uint8Array(4),ce=i.createTexture();i.bindTexture(I,ce),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Be=0;Be<G;Be++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,$,0,i.RGBA,i.UNSIGNED_BYTE,ue):i.texImage2D(ae+Be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ue);return ce}const he={};he[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),he[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),he[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(i.DEPTH_TEST),a.setFunc(Xs),Xe(!1),qe(Mu),ie(i.CULL_FACE),L(Mi);function ie(I){u[I]!==!0&&(i.enable(I),u[I]=!0)}function we(I){u[I]!==!1&&(i.disable(I),u[I]=!1)}function De(I,ae){return h[I]!==ae?(i.bindFramebuffer(I,ae),h[I]=ae,I===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ae),I===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function He(I,ae){let G=m,$=!1;if(I){G=f.get(ae),G===void 0&&(G=[],f.set(ae,G));const ue=I.textures;if(G.length!==ue.length||G[0]!==i.COLOR_ATTACHMENT0){for(let ce=0,Be=ue.length;ce<Be;ce++)G[ce]=i.COLOR_ATTACHMENT0+ce;G.length=ue.length,$=!0}}else G[0]!==i.BACK&&(G[0]=i.BACK,$=!0);$&&i.drawBuffers(G)}function ft(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const je={[qi]:i.FUNC_ADD,[bp]:i.FUNC_SUBTRACT,[wp]:i.FUNC_REVERSE_SUBTRACT};je[Ep]=i.MIN,je[Tp]=i.MAX;const _t={[Ap]:i.ZERO,[Cp]:i.ONE,[Rp]:i.SRC_COLOR,[Sl]:i.SRC_ALPHA,[Fp]:i.SRC_ALPHA_SATURATE,[Ip]:i.DST_COLOR,[Dp]:i.DST_ALPHA,[Pp]:i.ONE_MINUS_SRC_COLOR,[Ml]:i.ONE_MINUS_SRC_ALPHA,[Up]:i.ONE_MINUS_DST_COLOR,[Lp]:i.ONE_MINUS_DST_ALPHA,[Np]:i.CONSTANT_COLOR,[Bp]:i.ONE_MINUS_CONSTANT_COLOR,[Op]:i.CONSTANT_ALPHA,[zp]:i.ONE_MINUS_CONSTANT_ALPHA};function L(I,ae,G,$,ue,ce,Be,mt,Gt,st){if(I===Mi){v===!0&&(we(i.BLEND),v=!1);return}if(v===!1&&(ie(i.BLEND),v=!0),I!==Mp){if(I!==p||st!==M){if((d!==qi||x!==qi)&&(i.blendEquation(i.FUNC_ADD),d=qi,x=qi),st)switch(I){case Wn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qa:i.blendFunc(i.ONE,i.ONE);break;case bu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Wn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case qa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case bu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}_=null,y=null,E=null,T=null,A.set(0,0,0),R=0,p=I,M=st}return}ue=ue||ae,ce=ce||G,Be=Be||$,(ae!==d||ue!==x)&&(i.blendEquationSeparate(je[ae],je[ue]),d=ae,x=ue),(G!==_||$!==y||ce!==E||Be!==T)&&(i.blendFuncSeparate(_t[G],_t[$],_t[ce],_t[Be]),_=G,y=$,E=ce,T=Be),(mt.equals(A)===!1||Gt!==R)&&(i.blendColor(mt.r,mt.g,mt.b,Gt),A.copy(mt),R=Gt),p=I,M=!1}function Sn(I,ae){I.side===An?we(i.CULL_FACE):ie(i.CULL_FACE);let G=I.side===en;ae&&(G=!G),Xe(G),I.blending===Wn&&I.transparent===!1?L(Mi):L(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const $=I.stencilWrite;o.setTest($),$&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ut(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ie(i.SAMPLE_ALPHA_TO_COVERAGE):we(i.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(I){S!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),S=I)}function qe(I){I!==yp?(ie(i.CULL_FACE),I!==D&&(I===Mu?i.cullFace(i.BACK):I===Sp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):we(i.CULL_FACE),D=I}function Ee(I){I!==B&&(H&&i.lineWidth(I),B=I)}function ut(I,ae,G){I?(ie(i.POLYGON_OFFSET_FILL),(N!==ae||W!==G)&&(i.polygonOffset(ae,G),N=ae,W=G)):we(i.POLYGON_OFFSET_FILL)}function Te(I){I?ie(i.SCISSOR_TEST):we(i.SCISSOR_TEST)}function C(I){I===void 0&&(I=i.TEXTURE0+X-1),Q!==I&&(i.activeTexture(I),Q=I)}function b(I,ae,G){G===void 0&&(Q===null?G=i.TEXTURE0+X-1:G=Q);let $=re[G];$===void 0&&($={type:void 0,texture:void 0},re[G]=$),($.type!==I||$.texture!==ae)&&(Q!==G&&(i.activeTexture(G),Q=G),i.bindTexture(I,ae||he[I]),$.type=I,$.texture=ae)}function O(){const I=re[Q];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function K(){try{i.compressedTexImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Se(){try{i.texSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function le(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ke(){try{i.texStorage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function te(){try{i.texStorage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pe(){try{i.texImage2D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pe(){try{i.texImage3D.apply(i,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ie(I){be.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),be.copy(I))}function me(I){q.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),q.copy(I))}function Ye(I,ae){let G=c.get(ae);G===void 0&&(G=new WeakMap,c.set(ae,G));let $=G.get(I);$===void 0&&($=i.getUniformBlockIndex(ae,I.name),G.set(I,$))}function Oe(I,ae){const $=c.get(ae).get(I);l.get(ae)!==$&&(i.uniformBlockBinding(ae,$,I.__bindingPointIndex),l.set(ae,$))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},Q=null,re={},h={},f=new WeakMap,m=[],g=null,v=!1,p=null,d=null,_=null,y=null,x=null,E=null,T=null,A=new xe(0,0,0),R=0,M=!1,S=null,D=null,B=null,N=null,W=null,be.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:we,bindFramebuffer:De,drawBuffers:He,useProgram:ft,setBlending:L,setMaterial:Sn,setFlipSided:Xe,setCullFace:qe,setLineWidth:Ee,setPolygonOffset:ut,setScissorTest:Te,activeTexture:C,bindTexture:b,unbindTexture:O,compressedTexImage2D:K,compressedTexImage3D:Z,texImage2D:pe,texImage3D:Pe,updateUBOMapping:Ye,uniformBlockBinding:Oe,texStorage2D:Ke,texStorage3D:te,texSubImage2D:j,texSubImage3D:Se,compressedTexSubImage2D:le,compressedTexSubImage3D:fe,scissor:Ie,viewport:me,reset:ct}}function z_(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new _e,u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return m?new OffscreenCanvas(C,b):$a("canvas")}function v(C,b,O){let K=1;const Z=Te(C);if((Z.width>O||Z.height>O)&&(K=O/Math.max(Z.width,Z.height)),K<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const j=Math.floor(K*Z.width),Se=Math.floor(K*Z.height);h===void 0&&(h=g(j,Se));const le=b?g(j,Se):h;return le.width=j,le.height=Se,le.getContext("2d").drawImage(C,0,0,j,Se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+j+"x"+Se+")."),le}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),C;return C}function p(C){return C.generateMipmaps}function d(C){i.generateMipmap(C)}function _(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(C,b,O,K,Z=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let j=b;if(b===i.RED&&(O===i.FLOAT&&(j=i.R32F),O===i.HALF_FLOAT&&(j=i.R16F),O===i.UNSIGNED_BYTE&&(j=i.R8)),b===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.R8UI),O===i.UNSIGNED_SHORT&&(j=i.R16UI),O===i.UNSIGNED_INT&&(j=i.R32UI),O===i.BYTE&&(j=i.R8I),O===i.SHORT&&(j=i.R16I),O===i.INT&&(j=i.R32I)),b===i.RG&&(O===i.FLOAT&&(j=i.RG32F),O===i.HALF_FLOAT&&(j=i.RG16F),O===i.UNSIGNED_BYTE&&(j=i.RG8)),b===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RG8UI),O===i.UNSIGNED_SHORT&&(j=i.RG16UI),O===i.UNSIGNED_INT&&(j=i.RG32UI),O===i.BYTE&&(j=i.RG8I),O===i.SHORT&&(j=i.RG16I),O===i.INT&&(j=i.RG32I)),b===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RGB8UI),O===i.UNSIGNED_SHORT&&(j=i.RGB16UI),O===i.UNSIGNED_INT&&(j=i.RGB32UI),O===i.BYTE&&(j=i.RGB8I),O===i.SHORT&&(j=i.RGB16I),O===i.INT&&(j=i.RGB32I)),b===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),O===i.UNSIGNED_INT&&(j=i.RGBA32UI),O===i.BYTE&&(j=i.RGBA8I),O===i.SHORT&&(j=i.RGBA16I),O===i.INT&&(j=i.RGBA32I)),b===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),b===i.RGBA){const Se=Z?Ya:Je.getTransfer(K);O===i.FLOAT&&(j=i.RGBA32F),O===i.HALF_FLOAT&&(j=i.RGBA16F),O===i.UNSIGNED_BYTE&&(j=Se===at?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function x(C,b){let O;return C?b===null||b===Ji||b===js?O=i.DEPTH24_STENCIL8:b===ti?O=i.DEPTH32F_STENCIL8:b===Ir&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Ji||b===js?O=i.DEPTH_COMPONENT24:b===ti?O=i.DEPTH_COMPONENT32F:b===Ir&&(O=i.DEPTH_COMPONENT16),O}function E(C,b){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Pt&&C.minFilter!==it?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function T(C){const b=C.target;b.removeEventListener("dispose",T),R(b),b.isVideoTexture&&u.delete(b)}function A(C){const b=C.target;b.removeEventListener("dispose",A),S(b)}function R(C){const b=n.get(C);if(b.__webglInit===void 0)return;const O=C.source,K=f.get(O);if(K){const Z=K[b.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&M(C),Object.keys(K).length===0&&f.delete(O)}n.remove(C)}function M(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const O=C.source,K=f.get(O);delete K[b.__cacheKey],a.memory.textures--}function S(C){const b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(b.__webglFramebuffer[K]))for(let Z=0;Z<b.__webglFramebuffer[K].length;Z++)i.deleteFramebuffer(b.__webglFramebuffer[K][Z]);else i.deleteFramebuffer(b.__webglFramebuffer[K]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[K])}else{if(Array.isArray(b.__webglFramebuffer))for(let K=0;K<b.__webglFramebuffer.length;K++)i.deleteFramebuffer(b.__webglFramebuffer[K]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let K=0;K<b.__webglColorRenderbuffer.length;K++)b.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[K]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const O=C.textures;for(let K=0,Z=O.length;K<Z;K++){const j=n.get(O[K]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),a.memory.textures--),n.remove(O[K])}n.remove(C)}let D=0;function B(){D=0}function N(){const C=D;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function W(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function X(C,b){const O=n.get(C);if(C.isVideoTexture&&Ee(C),C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){const K=C.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(O,C,b);return}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+b)}function H(C,b){const O=n.get(C);if(C.version>0&&O.__version!==C.version){q(O,C,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+b)}function Y(C,b){const O=n.get(C);if(C.version>0&&O.__version!==C.version){q(O,C,b);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+b)}function V(C,b){const O=n.get(C);if(C.version>0&&O.__version!==C.version){J(O,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+b)}const Q={[yn]:i.REPEAT,[pt]:i.CLAMP_TO_EDGE,[Ll]:i.MIRRORED_REPEAT},re={[Pt]:i.NEAREST,[Kp]:i.NEAREST_MIPMAP_NEAREST,[Yr]:i.NEAREST_MIPMAP_LINEAR,[it]:i.LINEAR,[Co]:i.LINEAR_MIPMAP_NEAREST,[ji]:i.LINEAR_MIPMAP_LINEAR},ge={[Jp]:i.NEVER,[rm]:i.ALWAYS,[em]:i.LESS,[af]:i.LEQUAL,[tm]:i.EQUAL,[sm]:i.GEQUAL,[nm]:i.GREATER,[im]:i.NOTEQUAL};function ye(C,b){if(b.type===ti&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===it||b.magFilter===Co||b.magFilter===Yr||b.magFilter===ji||b.minFilter===it||b.minFilter===Co||b.minFilter===Yr||b.minFilter===ji)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Q[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Q[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Q[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,re[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,re[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ge[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Pt||b.minFilter!==Yr&&b.minFilter!==ji||b.type===ti&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function be(C,b){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",T));const K=b.source;let Z=f.get(K);Z===void 0&&(Z={},f.set(K,Z));const j=W(b);if(j!==C.__cacheKey){Z[j]===void 0&&(Z[j]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Z[j].usedTimes++;const Se=Z[C.__cacheKey];Se!==void 0&&(Z[C.__cacheKey].usedTimes--,Se.usedTimes===0&&M(b)),C.__cacheKey=j,C.__webglTexture=Z[j].texture}return O}function q(C,b,O){let K=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(K=i.TEXTURE_3D);const Z=be(C,b),j=b.source;t.bindTexture(K,C.__webglTexture,i.TEXTURE0+O);const Se=n.get(j);if(j.version!==Se.__version||Z===!0){t.activeTexture(i.TEXTURE0+O);const le=Je.getPrimaries(Je.workingColorSpace),fe=b.colorSpace===Ft?null:Je.getPrimaries(b.colorSpace),Ke=b.colorSpace===Ft||le===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let te=v(b.image,!1,s.maxTextureSize);te=ut(b,te);const pe=r.convert(b.format,b.colorSpace),Pe=r.convert(b.type);let Ie=y(b.internalFormat,pe,Pe,b.colorSpace,b.isVideoTexture);ye(K,b);let me;const Ye=b.mipmaps,Oe=b.isVideoTexture!==!0,ct=Se.__version===void 0||Z===!0,I=j.dataReady,ae=E(b,te);if(b.isDepthTexture)Ie=x(b.format===Ks,b.type),ct&&(Oe?t.texStorage2D(i.TEXTURE_2D,1,Ie,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Ie,te.width,te.height,0,pe,Pe,null));else if(b.isDataTexture)if(Ye.length>0){Oe&&ct&&t.texStorage2D(i.TEXTURE_2D,ae,Ie,Ye[0].width,Ye[0].height);for(let G=0,$=Ye.length;G<$;G++)me=Ye[G],Oe?I&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,Pe,me.data):t.texImage2D(i.TEXTURE_2D,G,Ie,me.width,me.height,0,pe,Pe,me.data);b.generateMipmaps=!1}else Oe?(ct&&t.texStorage2D(i.TEXTURE_2D,ae,Ie,te.width,te.height),I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,pe,Pe,te.data)):t.texImage2D(i.TEXTURE_2D,0,Ie,te.width,te.height,0,pe,Pe,te.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Oe&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Ie,Ye[0].width,Ye[0].height,te.depth);for(let G=0,$=Ye.length;G<$;G++)if(me=Ye[G],b.format!==bt)if(pe!==null)if(Oe){if(I)if(b.layerUpdates.size>0){const ue=sh(me.width,me.height,b.format,b.type);for(const ce of b.layerUpdates){const Be=me.data.subarray(ce*ue/me.data.BYTES_PER_ELEMENT,(ce+1)*ue/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,ce,me.width,me.height,1,pe,Be)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,te.depth,pe,me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,G,Ie,me.width,me.height,te.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?I&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,me.width,me.height,te.depth,pe,Pe,me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,G,Ie,me.width,me.height,te.depth,0,pe,Pe,me.data)}else{Oe&&ct&&t.texStorage2D(i.TEXTURE_2D,ae,Ie,Ye[0].width,Ye[0].height);for(let G=0,$=Ye.length;G<$;G++)me=Ye[G],b.format!==bt?pe!==null?Oe?I&&t.compressedTexSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(i.TEXTURE_2D,G,Ie,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?I&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,me.width,me.height,pe,Pe,me.data):t.texImage2D(i.TEXTURE_2D,G,Ie,me.width,me.height,0,pe,Pe,me.data)}else if(b.isDataArrayTexture)if(Oe){if(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ae,Ie,te.width,te.height,te.depth),I)if(b.layerUpdates.size>0){const G=sh(te.width,te.height,b.format,b.type);for(const $ of b.layerUpdates){const ue=te.data.subarray($*G/te.data.BYTES_PER_ELEMENT,($+1)*G/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,te.width,te.height,1,pe,Pe,ue)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,Pe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ie,te.width,te.height,te.depth,0,pe,Pe,te.data);else if(b.isData3DTexture)Oe?(ct&&t.texStorage3D(i.TEXTURE_3D,ae,Ie,te.width,te.height,te.depth),I&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,Pe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Ie,te.width,te.height,te.depth,0,pe,Pe,te.data);else if(b.isFramebufferTexture){if(ct)if(Oe)t.texStorage2D(i.TEXTURE_2D,ae,Ie,te.width,te.height);else{let G=te.width,$=te.height;for(let ue=0;ue<ae;ue++)t.texImage2D(i.TEXTURE_2D,ue,Ie,G,$,0,pe,Pe,null),G>>=1,$>>=1}}else if(Ye.length>0){if(Oe&&ct){const G=Te(Ye[0]);t.texStorage2D(i.TEXTURE_2D,ae,Ie,G.width,G.height)}for(let G=0,$=Ye.length;G<$;G++)me=Ye[G],Oe?I&&t.texSubImage2D(i.TEXTURE_2D,G,0,0,pe,Pe,me):t.texImage2D(i.TEXTURE_2D,G,Ie,pe,Pe,me);b.generateMipmaps=!1}else if(Oe){if(ct){const G=Te(te);t.texStorage2D(i.TEXTURE_2D,ae,Ie,G.width,G.height)}I&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,pe,Pe,te)}else t.texImage2D(i.TEXTURE_2D,0,Ie,pe,Pe,te);p(b)&&d(K),Se.__version=j.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function J(C,b,O){if(b.image.length!==6)return;const K=be(C,b),Z=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+O);const j=n.get(Z);if(Z.version!==j.__version||K===!0){t.activeTexture(i.TEXTURE0+O);const Se=Je.getPrimaries(Je.workingColorSpace),le=b.colorSpace===Ft?null:Je.getPrimaries(b.colorSpace),fe=b.colorSpace===Ft||Se===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,fe);const Ke=b.isCompressedTexture||b.image[0].isCompressedTexture,te=b.image[0]&&b.image[0].isDataTexture,pe=[];for(let $=0;$<6;$++)!Ke&&!te?pe[$]=v(b.image[$],!0,s.maxCubemapSize):pe[$]=te?b.image[$].image:b.image[$],pe[$]=ut(b,pe[$]);const Pe=pe[0],Ie=r.convert(b.format,b.colorSpace),me=r.convert(b.type),Ye=y(b.internalFormat,Ie,me,b.colorSpace),Oe=b.isVideoTexture!==!0,ct=j.__version===void 0||K===!0,I=Z.dataReady;let ae=E(b,Pe);ye(i.TEXTURE_CUBE_MAP,b);let G;if(Ke){Oe&&ct&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ye,Pe.width,Pe.height);for(let $=0;$<6;$++){G=pe[$].mipmaps;for(let ue=0;ue<G.length;ue++){const ce=G[ue];b.format!==bt?Ie!==null?Oe?I&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,0,0,ce.width,ce.height,Ie,ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,Ye,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Oe?I&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,0,0,ce.width,ce.height,Ie,me,ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue,Ye,ce.width,ce.height,0,Ie,me,ce.data)}}}else{if(G=b.mipmaps,Oe&&ct){G.length>0&&ae++;const $=Te(pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ae,Ye,$.width,$.height)}for(let $=0;$<6;$++)if(te){Oe?I&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,pe[$].width,pe[$].height,Ie,me,pe[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ye,pe[$].width,pe[$].height,0,Ie,me,pe[$].data);for(let ue=0;ue<G.length;ue++){const Be=G[ue].image[$].image;Oe?I&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,0,0,Be.width,Be.height,Ie,me,Be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,Ye,Be.width,Be.height,0,Ie,me,Be.data)}}else{Oe?I&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Ie,me,pe[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ye,Ie,me,pe[$]);for(let ue=0;ue<G.length;ue++){const ce=G[ue];Oe?I&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,0,0,Ie,me,ce.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,ue+1,Ye,Ie,me,ce.image[$])}}}p(b)&&d(i.TEXTURE_CUBE_MAP),j.__version=Z.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function he(C,b,O,K,Z,j){const Se=r.convert(O.format,O.colorSpace),le=r.convert(O.type),fe=y(O.internalFormat,Se,le,O.colorSpace),Ke=n.get(b),te=n.get(O);if(te.__renderTarget=b,!Ke.__hasExternalTextures){const pe=Math.max(1,b.width>>j),Pe=Math.max(1,b.height>>j);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,j,fe,pe,Pe,b.depth,0,Se,le,null):t.texImage2D(Z,j,fe,pe,Pe,0,Se,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),qe(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,Z,te.__webglTexture,0,Xe(b)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,Z,te.__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ie(C,b,O){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const K=b.depthTexture,Z=K&&K.isDepthTexture?K.type:null,j=x(b.stencilBuffer,Z),Se=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=Xe(b);qe(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,j,b.width,b.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,j,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,j,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Se,i.RENDERBUFFER,C)}else{const K=b.textures;for(let Z=0;Z<K.length;Z++){const j=K[Z],Se=r.convert(j.format,j.colorSpace),le=r.convert(j.type),fe=y(j.internalFormat,Se,le,j.colorSpace),Ke=Xe(b);O&&qe(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ke,fe,b.width,b.height):qe(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ke,fe,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,fe,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function we(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(b.depthTexture);K.__renderTarget=b,(!K.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),X(b.depthTexture,0);const Z=K.__webglTexture,j=Xe(b);if(b.depthTexture.format===Ns)qe(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(b.depthTexture.format===Ks)qe(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function De(C){const b=n.get(C),O=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const K=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),K){const Z=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,K.removeEventListener("dispose",Z)};K.addEventListener("dispose",Z),b.__depthDisposeCallback=Z}b.__boundDepthTexture=K}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");we(b.__webglFramebuffer,C)}else if(O){b.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[K]),b.__webglDepthbuffer[K]===void 0)b.__webglDepthbuffer[K]=i.createRenderbuffer(),ie(b.__webglDepthbuffer[K],C,!1);else{const Z=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=b.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,j)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),ie(b.__webglDepthbuffer,C,!1);else{const K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,Z)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(C,b,O){const K=n.get(C);b!==void 0&&he(K.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&De(C)}function ft(C){const b=C.texture,O=n.get(C),K=n.get(b);C.addEventListener("dispose",A);const Z=C.textures,j=C.isWebGLCubeRenderTarget===!0,Se=Z.length>1;if(Se||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=b.version,a.memory.textures++),j){O.__webglFramebuffer=[];for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[le]=[];for(let fe=0;fe<b.mipmaps.length;fe++)O.__webglFramebuffer[le][fe]=i.createFramebuffer()}else O.__webglFramebuffer[le]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let le=0;le<b.mipmaps.length;le++)O.__webglFramebuffer[le]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Se)for(let le=0,fe=Z.length;le<fe;le++){const Ke=n.get(Z[le]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&qe(C)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let le=0;le<Z.length;le++){const fe=Z[le];O.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[le]);const Ke=r.convert(fe.format,fe.colorSpace),te=r.convert(fe.type),pe=y(fe.internalFormat,Ke,te,fe.colorSpace,C.isXRRenderTarget===!0),Pe=Xe(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,pe,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,O.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),ie(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),ye(i.TEXTURE_CUBE_MAP,b);for(let le=0;le<6;le++)if(b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)he(O.__webglFramebuffer[le][fe],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,fe);else he(O.__webglFramebuffer[le],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);p(b)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let le=0,fe=Z.length;le<fe;le++){const Ke=Z[le],te=n.get(Ke);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),ye(i.TEXTURE_2D,Ke),he(O.__webglFramebuffer,C,Ke,i.COLOR_ATTACHMENT0+le,i.TEXTURE_2D,0),p(Ke)&&d(i.TEXTURE_2D)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(le=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,K.__webglTexture),ye(le,b),b.mipmaps&&b.mipmaps.length>0)for(let fe=0;fe<b.mipmaps.length;fe++)he(O.__webglFramebuffer[fe],C,b,i.COLOR_ATTACHMENT0,le,fe);else he(O.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,le,0);p(b)&&d(le),t.unbindTexture()}C.depthBuffer&&De(C)}function je(C){const b=C.textures;for(let O=0,K=b.length;O<K;O++){const Z=b[O];if(p(Z)){const j=_(C),Se=n.get(Z).__webglTexture;t.bindTexture(j,Se),d(j),t.unbindTexture()}}}const _t=[],L=[];function Sn(C){if(C.samples>0){if(qe(C)===!1){const b=C.textures,O=C.width,K=C.height;let Z=i.COLOR_BUFFER_BIT;const j=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Se=n.get(C),le=b.length>1;if(le)for(let fe=0;fe<b.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let fe=0;fe<b.length;fe++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Se.__webglColorRenderbuffer[fe]);const Ke=n.get(b[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ke,0)}i.blitFramebuffer(0,0,O,K,0,0,O,K,Z,i.NEAREST),l===!0&&(_t.length=0,L.length=0,_t.push(i.COLOR_ATTACHMENT0+fe),C.depthBuffer&&C.resolveDepthBuffer===!1&&(_t.push(j),L.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,_t))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let fe=0;fe<b.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,Se.__webglColorRenderbuffer[fe]);const Ke=n.get(b[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,Ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function Xe(C){return Math.min(s.maxSamples,C.samples)}function qe(C){const b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Ee(C){const b=a.render.frame;u.get(C)!==b&&(u.set(C,b),C.update())}function ut(C,b){const O=C.colorSpace,K=C.format,Z=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==$s&&O!==Ft&&(Je.getTransfer(O)===at?(K!==bt||Z!==Dt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}function Te(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=B,this.setTexture2D=X,this.setTexture2DArray=H,this.setTexture3D=Y,this.setTextureCube=V,this.rebindTextures=He,this.setupRenderTarget=ft,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Sn,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=he,this.useMultisampledRTT=qe}function k_(i,e){function t(n,s=Ft){let r;const a=Je.getTransfer(s);if(n===Dt)return i.UNSIGNED_BYTE;if(n===Pc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Dc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Zd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kd)return i.BYTE;if(n===$d)return i.SHORT;if(n===Ir)return i.UNSIGNED_SHORT;if(n===Rc)return i.INT;if(n===Ji)return i.UNSIGNED_INT;if(n===ti)return i.FLOAT;if(n===zr)return i.HALF_FLOAT;if(n===Qd)return i.ALPHA;if(n===Jd)return i.RGB;if(n===bt)return i.RGBA;if(n===ef)return i.LUMINANCE;if(n===tf)return i.LUMINANCE_ALPHA;if(n===Ns)return i.DEPTH_COMPONENT;if(n===Ks)return i.DEPTH_STENCIL;if(n===nf)return i.RED;if(n===Lc)return i.RED_INTEGER;if(n===sf)return i.RG;if(n===Ic)return i.RG_INTEGER;if(n===Uc)return i.RGBA_INTEGER;if(n===La||n===Ia||n===Ua||n===Fa)if(a===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===La)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===La)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Il||n===Ul||n===Fl||n===Nl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Il)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ul)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Bl||n===Ol||n===zl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Bl||n===Ol)return a===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===zl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kl||n===Vl||n===Hl||n===Gl||n===Wl||n===Xl||n===ql||n===Yl||n===jl||n===Kl||n===$l||n===Zl||n===Ql||n===Jl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===kl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Gl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ql)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Kl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$l)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ql)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Jl)return a===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Na||n===ec||n===tc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Na)return a===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===rf||n===nc||n===ic||n===sc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Na)return r.COMPRESSED_RED_RGTC1_EXT;if(n===nc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===js?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const V_={type:"move"};class sl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ps,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ps,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ps,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),d=this._getHandJoint(c,v);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(V_)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ps;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const H_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,G_=`
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

}`;class W_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new tn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Vt({vertexShader:H_,fragmentShader:G_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new tr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class X_ extends is{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,g=null;const v=new W_,p=t.getContextAttributes();let d=null,_=null;const y=[],x=[],E=new _e;let T=null;const A=new Tn;A.viewport=new xt;const R=new Tn;R.viewport=new xt;const M=[A,R],S=new u0;let D=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=y[q];return J===void 0&&(J=new sl,y[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=y[q];return J===void 0&&(J=new sl,y[q]=J),J.getGripSpace()},this.getHand=function(q){let J=y[q];return J===void 0&&(J=new sl,y[q]=J),J.getHandSpace()};function N(q){const J=x.indexOf(q.inputSource);if(J===-1)return;const he=y[J];he!==void 0&&(he.update(q.inputSource,q.frame,c||a),he.dispatchEvent({type:q.type,data:q.inputSource}))}function W(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",X);for(let q=0;q<y.length;q++){const J=x[q];J!==null&&(x[q]=null,y[q].disconnect(J))}D=null,B=null,v.reset(),e.setRenderTarget(d),m=null,f=null,h=null,s=null,_=null,be.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",W),s.addEventListener("inputsourceschange",X),p.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(E),s.renderState.layers===void 0){const J={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,J),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new es(m.framebufferWidth,m.framebufferHeight,{format:bt,type:Dt,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let J=null,he=null,ie=null;p.depth&&(ie=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=p.stencil?Ks:Ns,he=p.stencil?js:Ji);const we={colorFormat:t.RGBA8,depthFormat:ie,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(we),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new es(f.textureWidth,f.textureHeight,{format:bt,type:Dt,depthTexture:new Sf(f.textureWidth,f.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),be.setContext(s),be.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function X(q){for(let J=0;J<q.removed.length;J++){const he=q.removed[J],ie=x.indexOf(he);ie>=0&&(x[ie]=null,y[ie].disconnect(he))}for(let J=0;J<q.added.length;J++){const he=q.added[J];let ie=x.indexOf(he);if(ie===-1){for(let De=0;De<y.length;De++)if(De>=x.length){x.push(he),ie=De;break}else if(x[De]===null){x[De]=he,ie=De;break}if(ie===-1)break}const we=y[ie];we&&we.connect(he)}}const H=new P,Y=new P;function V(q,J,he){H.setFromMatrixPosition(J.matrixWorld),Y.setFromMatrixPosition(he.matrixWorld);const ie=H.distanceTo(Y),we=J.projectionMatrix.elements,De=he.projectionMatrix.elements,He=we[14]/(we[10]-1),ft=we[14]/(we[10]+1),je=(we[9]+1)/we[5],_t=(we[9]-1)/we[5],L=(we[8]-1)/we[0],Sn=(De[8]+1)/De[0],Xe=He*L,qe=He*Sn,Ee=ie/(-L+Sn),ut=Ee*-L;if(J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(ut),q.translateZ(Ee),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),we[10]===-1)q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const Te=He+Ee,C=ft+Ee,b=Xe-ut,O=qe+(ie-ut),K=je*ft/C*Te,Z=_t*ft/C*Te;q.projectionMatrix.makePerspective(b,O,K,Z,Te,C),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Q(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let J=q.near,he=q.far;v.texture!==null&&(v.depthNear>0&&(J=v.depthNear),v.depthFar>0&&(he=v.depthFar)),S.near=R.near=A.near=J,S.far=R.far=A.far=he,(D!==S.near||B!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),D=S.near,B=S.far),A.layers.mask=q.layers.mask|2,R.layers.mask=q.layers.mask|4,S.layers.mask=A.layers.mask|R.layers.mask;const ie=q.parent,we=S.cameras;Q(S,ie);for(let De=0;De<we.length;De++)Q(we[De],ie);we.length===2?V(S,A,R):S.projectionMatrix.copy(A.projectionMatrix),re(q,S,ie)};function re(q,J,he){he===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(he.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ur*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let ge=null;function ye(q,J){if(u=J.getViewerPose(c||a),g=J,u!==null){const he=u.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let ie=!1;he.length!==S.cameras.length&&(S.cameras.length=0,ie=!0);for(let De=0;De<he.length;De++){const He=he[De];let ft=null;if(m!==null)ft=m.getViewport(He);else{const _t=h.getViewSubImage(f,He);ft=_t.viewport,De===0&&(e.setRenderTargetTextures(_,_t.colorTexture,f.ignoreDepthValues?void 0:_t.depthStencilTexture),e.setRenderTarget(_))}let je=M[De];je===void 0&&(je=new Tn,je.layers.enable(De),je.viewport=new xt,M[De]=je),je.matrix.fromArray(He.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(He.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(ft.x,ft.y,ft.width,ft.height),De===0&&(S.matrix.copy(je.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ie===!0&&S.cameras.push(je)}const we=s.enabledFeatures;if(we&&we.includes("depth-sensing")){const De=h.getDepthInformation(he[0]);De&&De.isValid&&De.texture&&v.init(e,De,s.renderState)}}for(let he=0;he<y.length;he++){const ie=x[he],we=y[he];ie!==null&&we!==void 0&&we.update(ie,J,c||a)}ge&&ge(q,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const be=new Ef;be.setAnimationLoop(ye),this.setAnimationLoop=function(q){ge=q},this.dispose=function(){}}}const Hi=new zn,q_=new ot;function Y_(i,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,pf(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,_,y,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),h(p,d)):d.isMeshPhongMaterial?(r(p,d),u(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,x)):d.isMeshMatcapMaterial?(r(p,d),g(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),v(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,_,y):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===en&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===en&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const _=e.get(d),y=_.envMap,x=_.envMapRotation;y&&(p.envMap.value=y,Hi.copy(x),Hi.x*=-1,Hi.y*=-1,Hi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Hi.y*=-1,Hi.z*=-1),p.envMapRotation.value.setFromMatrix4(q_.makeRotationFromEuler(Hi)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,_,y){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*_,p.scale.value=y*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,_){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===en&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function v(p,d){const _=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function j_(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,y){const x=y.program;n.uniformBlockBinding(_,x)}function c(_,y){let x=s[_.id];x===void 0&&(g(_),x=u(_),s[_.id]=x,_.addEventListener("dispose",p));const E=y.program;n.updateUBOMapping(_,E);const T=e.render.frame;r[_.id]!==T&&(f(_),r[_.id]=T)}function u(_){const y=h();_.__bindingPointIndex=y;const x=i.createBuffer(),E=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function h(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const y=s[_.id],x=_.uniforms,E=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let T=0,A=x.length;T<A;T++){const R=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,S=R.length;M<S;M++){const D=R[M];if(m(D,T,M,E)===!0){const B=D.__offset,N=Array.isArray(D.value)?D.value:[D.value];let W=0;for(let X=0;X<N.length;X++){const H=N[X],Y=v(H);typeof H=="number"||typeof H=="boolean"?(D.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,B+W,D.__data)):H.isMatrix3?(D.__data[0]=H.elements[0],D.__data[1]=H.elements[1],D.__data[2]=H.elements[2],D.__data[3]=0,D.__data[4]=H.elements[3],D.__data[5]=H.elements[4],D.__data[6]=H.elements[5],D.__data[7]=0,D.__data[8]=H.elements[6],D.__data[9]=H.elements[7],D.__data[10]=H.elements[8],D.__data[11]=0):(H.toArray(D.__data,W),W+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(_,y,x,E){const T=_.value,A=y+"_"+x;if(E[A]===void 0)return typeof T=="number"||typeof T=="boolean"?E[A]=T:E[A]=T.clone(),!0;{const R=E[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(_){const y=_.uniforms;let x=0;const E=16;for(let A=0,R=y.length;A<R;A++){const M=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,D=M.length;S<D;S++){const B=M[S],N=Array.isArray(B.value)?B.value:[B.value];for(let W=0,X=N.length;W<X;W++){const H=N[W],Y=v(H),V=x%E,Q=V%Y.boundary,re=V+Q;x+=Q,re!==0&&E-re<Y.storage&&(x+=E-re),B.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=x,x+=Y.storage}}}const T=x%E;return T>0&&(x+=E-T),_.__size=x,_.__cache={},this}function v(_){const y={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),y}function p(_){const y=_.target;y.removeEventListener("dispose",p);const x=a.indexOf(y.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class rl{constructor(e={}){const{canvas:t=Mm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),v=new Int32Array(4);let p=null,d=null;const _=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=gn,this.toneMapping=bi,this.toneMappingExposure=1;const x=this;let E=!1,T=0,A=0,R=null,M=-1,S=null;const D=new xt,B=new xt;let N=null;const W=new xe(0);let X=0,H=t.width,Y=t.height,V=1,Q=null,re=null;const ge=new xt(0,0,H,Y),ye=new xt(0,0,H,Y);let be=!1;const q=new zc;let J=!1,he=!1;const ie=new ot,we=new ot,De=new P,He=new xt,ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function _t(){return R===null?V:1}let L=n;function Sn(w,U){return t.getContext(w,U)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ac}`),t.addEventListener("webglcontextlost",$,!1),t.addEventListener("webglcontextrestored",ue,!1),t.addEventListener("webglcontextcreationerror",ce,!1),L===null){const U="webgl2";if(L=Sn(U,w),L===null)throw Sn(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Xe,qe,Ee,ut,Te,C,b,O,K,Z,j,Se,le,fe,Ke,te,pe,Pe,Ie,me,Ye,Oe,ct,I;function ae(){Xe=new sx(L),Xe.init(),Oe=new k_(L,Xe),qe=new Qv(L,Xe,e,Oe),Ee=new O_(L,Xe),qe.reverseDepthBuffer&&f&&Ee.buffers.depth.setReversed(!0),ut=new ox(L),Te=new E_,C=new z_(L,Xe,Ee,Te,qe,Oe,ut),b=new ex(x),O=new ix(x),K=new p0(L),ct=new $v(L,K),Z=new rx(L,K,ut,ct),j=new cx(L,Z,K,ut),Ie=new lx(L,qe,C),te=new Jv(Te),Se=new w_(x,b,O,Xe,qe,ct,te),le=new Y_(x,Te),fe=new A_,Ke=new I_(Xe),Pe=new Kv(x,b,O,Ee,j,m,l),pe=new N_(x,j,qe),I=new j_(L,ut,qe,Ee),me=new Zv(L,Xe,ut),Ye=new ax(L,Xe,ut),ut.programs=Se.programs,x.capabilities=qe,x.extensions=Xe,x.properties=Te,x.renderLists=fe,x.shadowMap=pe,x.state=Ee,x.info=ut}ae();const G=new X_(x,L);this.xr=G,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=Xe.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Xe.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(w){w!==void 0&&(V=w,this.setSize(H,Y,!1))},this.getSize=function(w){return w.set(H,Y)},this.setSize=function(w,U,z=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=w,Y=U,t.width=Math.floor(w*V),t.height=Math.floor(U*V),z===!0&&(t.style.width=w+"px",t.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(H*V,Y*V).floor()},this.setDrawingBufferSize=function(w,U,z){H=w,Y=U,V=z,t.width=Math.floor(w*z),t.height=Math.floor(U*z),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(D)},this.getViewport=function(w){return w.copy(ge)},this.setViewport=function(w,U,z,k){w.isVector4?ge.set(w.x,w.y,w.z,w.w):ge.set(w,U,z,k),Ee.viewport(D.copy(ge).multiplyScalar(V).round())},this.getScissor=function(w){return w.copy(ye)},this.setScissor=function(w,U,z,k){w.isVector4?ye.set(w.x,w.y,w.z,w.w):ye.set(w,U,z,k),Ee.scissor(B.copy(ye).multiplyScalar(V).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(w){Ee.setScissorTest(be=w)},this.setOpaqueSort=function(w){Q=w},this.setTransparentSort=function(w){re=w},this.getClearColor=function(w){return w.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(w=!0,U=!0,z=!0){let k=0;if(w){let F=!1;if(R!==null){const ee=R.texture.format;F=ee===Uc||ee===Ic||ee===Lc}if(F){const ee=R.texture.type,oe=ee===Dt||ee===Ji||ee===Ir||ee===js||ee===Pc||ee===Dc,de=Pe.getClearColor(),ve=Pe.getClearAlpha(),Ue=de.r,Ne=de.g,Ae=de.b;oe?(g[0]=Ue,g[1]=Ne,g[2]=Ae,g[3]=ve,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Ue,v[1]=Ne,v[2]=Ae,v[3]=ve,L.clearBufferiv(L.COLOR,0,v))}else k|=L.COLOR_BUFFER_BIT}U&&(k|=L.DEPTH_BUFFER_BIT),z&&(k|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",$,!1),t.removeEventListener("webglcontextrestored",ue,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),Pe.dispose(),fe.dispose(),Ke.dispose(),Te.dispose(),b.dispose(),O.dispose(),j.dispose(),ct.dispose(),I.dispose(),Se.dispose(),G.dispose(),G.removeEventListener("sessionstart",mu),G.removeEventListener("sessionend",gu),Fi.stop()};function $(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function ue(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const w=ut.autoReset,U=pe.enabled,z=pe.autoUpdate,k=pe.needsUpdate,F=pe.type;ae(),ut.autoReset=w,pe.enabled=U,pe.autoUpdate=z,pe.needsUpdate=k,pe.type=F}function ce(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Be(w){const U=w.target;U.removeEventListener("dispose",Be),mt(U)}function mt(w){Gt(w),Te.remove(w)}function Gt(w){const U=Te.get(w).programs;U!==void 0&&(U.forEach(function(z){Se.releaseProgram(z)}),w.isShaderMaterial&&Se.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,z,k,F,ee){U===null&&(U=ft);const oe=F.isMesh&&F.matrixWorld.determinant()<0,de=fp(w,U,z,k,F);Ee.setMaterial(k,oe);let ve=z.index,Ue=1;if(k.wireframe===!0){if(ve=Z.getWireframeAttribute(z),ve===void 0)return;Ue=2}const Ne=z.drawRange,Ae=z.attributes.position;let $e=Ne.start*Ue,tt=(Ne.start+Ne.count)*Ue;ee!==null&&($e=Math.max($e,ee.start*Ue),tt=Math.min(tt,(ee.start+ee.count)*Ue)),ve!==null?($e=Math.max($e,0),tt=Math.min(tt,ve.count)):Ae!=null&&($e=Math.max($e,0),tt=Math.min(tt,Ae.count));const At=tt-$e;if(At<0||At===1/0)return;ct.setup(F,k,de,z,ve);let gt,Qe=me;if(ve!==null&&(gt=K.get(ve),Qe=Ye,Qe.setIndex(gt)),F.isMesh)k.wireframe===!0?(Ee.setLineWidth(k.wireframeLinewidth*_t()),Qe.setMode(L.LINES)):Qe.setMode(L.TRIANGLES);else if(F.isLine){let Ce=k.linewidth;Ce===void 0&&(Ce=1),Ee.setLineWidth(Ce*_t()),F.isLineSegments?Qe.setMode(L.LINES):F.isLineLoop?Qe.setMode(L.LINE_LOOP):Qe.setMode(L.LINE_STRIP)}else F.isPoints?Qe.setMode(L.POINTS):F.isSprite&&Qe.setMode(L.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Qe.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))Qe.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Ce=F._multiDrawStarts,Bt=F._multiDrawCounts,nt=F._multiDrawCount,Dn=ve?K.get(ve).bytesPerElement:1,rs=Te.get(k).currentProgram.getUniforms();for(let dn=0;dn<nt;dn++)rs.setValue(L,"_gl_DrawID",dn),Qe.render(Ce[dn]/Dn,Bt[dn])}else if(F.isInstancedMesh)Qe.renderInstances($e,At,F.count);else if(z.isInstancedBufferGeometry){const Ce=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Bt=Math.min(z.instanceCount,Ce);Qe.renderInstances($e,At,Bt)}else Qe.render($e,At)};function st(w,U,z){w.transparent===!0&&w.side===An&&w.forceSinglePass===!1?(w.side=en,w.needsUpdate=!0,qr(w,U,z),w.side=_n,w.needsUpdate=!0,qr(w,U,z),w.side=An):qr(w,U,z)}this.compile=function(w,U,z=null){z===null&&(z=w),d=Ke.get(z),d.init(U),y.push(d),z.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),w!==z&&w.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),d.setupLights();const k=new Set;return w.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const ee=F.material;if(ee)if(Array.isArray(ee))for(let oe=0;oe<ee.length;oe++){const de=ee[oe];st(de,z,F),k.add(de)}else st(ee,z,F),k.add(ee)}),y.pop(),d=null,k},this.compileAsync=function(w,U,z=null){const k=this.compile(w,U,z);return new Promise(F=>{function ee(){if(k.forEach(function(oe){Te.get(oe).currentProgram.isReady()&&k.delete(oe)}),k.size===0){F(w);return}setTimeout(ee,10)}Xe.get("KHR_parallel_shader_compile")!==null?ee():setTimeout(ee,10)})};let Pn=null;function Yn(w){Pn&&Pn(w)}function mu(){Fi.stop()}function gu(){Fi.start()}const Fi=new Ef;Fi.setAnimationLoop(Yn),typeof self<"u"&&Fi.setContext(self),this.setAnimationLoop=function(w){Pn=w,G.setAnimationLoop(w),w===null?Fi.stop():Fi.start()},G.addEventListener("sessionstart",mu),G.addEventListener("sessionend",gu),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(U),U=G.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,U,R),d=Ke.get(w,y.length),d.init(U),y.push(d),we.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),q.setFromProjectionMatrix(we),he=this.localClippingEnabled,J=te.init(this.clippingPlanes,he),p=fe.get(w,_.length),p.init(),_.push(p),G.enabled===!0&&G.isPresenting===!0){const ee=x.xr.getDepthSensingMesh();ee!==null&&To(ee,U,-1/0,x.sortObjects)}To(w,U,0,x.sortObjects),p.finish(),x.sortObjects===!0&&p.sort(Q,re),je=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,je&&Pe.addToRenderList(p,w),this.info.render.frame++,J===!0&&te.beginShadows();const z=d.state.shadowsArray;pe.render(z,w,U),J===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=p.opaque,F=p.transmissive;if(d.setupLights(),U.isArrayCamera){const ee=U.cameras;if(F.length>0)for(let oe=0,de=ee.length;oe<de;oe++){const ve=ee[oe];xu(k,F,w,ve)}je&&Pe.render(w);for(let oe=0,de=ee.length;oe<de;oe++){const ve=ee[oe];vu(p,w,ve,ve.viewport)}}else F.length>0&&xu(k,F,w,U),je&&Pe.render(w),vu(p,w,U);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(x,w,U),ct.resetDefaultState(),M=-1,S=null,y.pop(),y.length>0?(d=y[y.length-1],J===!0&&te.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,_.pop(),_.length>0?p=_[_.length-1]:p=null};function To(w,U,z,k){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)z=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||q.intersectsSprite(w)){k&&He.setFromMatrixPosition(w.matrixWorld).applyMatrix4(we);const oe=j.update(w),de=w.material;de.visible&&p.push(w,oe,de,z,He.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||q.intersectsObject(w))){const oe=j.update(w),de=w.material;if(k&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),He.copy(w.boundingSphere.center)):(oe.boundingSphere===null&&oe.computeBoundingSphere(),He.copy(oe.boundingSphere.center)),He.applyMatrix4(w.matrixWorld).applyMatrix4(we)),Array.isArray(de)){const ve=oe.groups;for(let Ue=0,Ne=ve.length;Ue<Ne;Ue++){const Ae=ve[Ue],$e=de[Ae.materialIndex];$e&&$e.visible&&p.push(w,oe,$e,z,He.z,Ae)}}else de.visible&&p.push(w,oe,de,z,He.z,null)}}const ee=w.children;for(let oe=0,de=ee.length;oe<de;oe++)To(ee[oe],U,z,k)}function vu(w,U,z,k){const F=w.opaque,ee=w.transmissive,oe=w.transparent;d.setupLightsView(z),J===!0&&te.setGlobalState(x.clippingPlanes,z),k&&Ee.viewport(D.copy(k)),F.length>0&&Xr(F,U,z),ee.length>0&&Xr(ee,U,z),oe.length>0&&Xr(oe,U,z),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function xu(w,U,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[k.id]===void 0&&(d.state.transmissionRenderTarget[k.id]=new es(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?zr:Dt,minFilter:ji,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const ee=d.state.transmissionRenderTarget[k.id],oe=k.viewport||D;ee.setSize(oe.z,oe.w);const de=x.getRenderTarget();x.setRenderTarget(ee),x.getClearColor(W),X=x.getClearAlpha(),X<1&&x.setClearColor(16777215,.5),x.clear(),je&&Pe.render(z);const ve=x.toneMapping;x.toneMapping=bi;const Ue=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),d.setupLightsView(k),J===!0&&te.setGlobalState(x.clippingPlanes,k),Xr(w,z,k),C.updateMultisampleRenderTarget(ee),C.updateRenderTargetMipmap(ee),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let Ae=0,$e=U.length;Ae<$e;Ae++){const tt=U[Ae],At=tt.object,gt=tt.geometry,Qe=tt.material,Ce=tt.group;if(Qe.side===An&&At.layers.test(k.layers)){const Bt=Qe.side;Qe.side=en,Qe.needsUpdate=!0,_u(At,z,k,gt,Qe,Ce),Qe.side=Bt,Qe.needsUpdate=!0,Ne=!0}}Ne===!0&&(C.updateMultisampleRenderTarget(ee),C.updateRenderTargetMipmap(ee))}x.setRenderTarget(de),x.setClearColor(W,X),Ue!==void 0&&(k.viewport=Ue),x.toneMapping=ve}function Xr(w,U,z){const k=U.isScene===!0?U.overrideMaterial:null;for(let F=0,ee=w.length;F<ee;F++){const oe=w[F],de=oe.object,ve=oe.geometry,Ue=k===null?oe.material:k,Ne=oe.group;de.layers.test(z.layers)&&_u(de,U,z,ve,Ue,Ne)}}function _u(w,U,z,k,F,ee){w.onBeforeRender(x,U,z,k,F,ee),w.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),F.onBeforeRender(x,U,z,k,w,ee),F.transparent===!0&&F.side===An&&F.forceSinglePass===!1?(F.side=en,F.needsUpdate=!0,x.renderBufferDirect(z,U,k,F,w,ee),F.side=_n,F.needsUpdate=!0,x.renderBufferDirect(z,U,k,F,w,ee),F.side=An):x.renderBufferDirect(z,U,k,F,w,ee),w.onAfterRender(x,U,z,k,F,ee)}function qr(w,U,z){U.isScene!==!0&&(U=ft);const k=Te.get(w),F=d.state.lights,ee=d.state.shadowsArray,oe=F.state.version,de=Se.getParameters(w,F.state,ee,U,z),ve=Se.getProgramCacheKey(de);let Ue=k.programs;k.environment=w.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(w.isMeshStandardMaterial?O:b).get(w.envMap||k.environment),k.envMapRotation=k.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Ue===void 0&&(w.addEventListener("dispose",Be),Ue=new Map,k.programs=Ue);let Ne=Ue.get(ve);if(Ne!==void 0){if(k.currentProgram===Ne&&k.lightsStateVersion===oe)return Su(w,de),Ne}else de.uniforms=Se.getUniforms(w),w.onBeforeCompile(de,x),Ne=Se.acquireProgram(de,ve),Ue.set(ve,Ne),k.uniforms=de.uniforms;const Ae=k.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ae.clippingPlanes=te.uniform),Su(w,de),k.needsLights=mp(w),k.lightsStateVersion=oe,k.needsLights&&(Ae.ambientLightColor.value=F.state.ambient,Ae.lightProbe.value=F.state.probe,Ae.directionalLights.value=F.state.directional,Ae.directionalLightShadows.value=F.state.directionalShadow,Ae.spotLights.value=F.state.spot,Ae.spotLightShadows.value=F.state.spotShadow,Ae.rectAreaLights.value=F.state.rectArea,Ae.ltc_1.value=F.state.rectAreaLTC1,Ae.ltc_2.value=F.state.rectAreaLTC2,Ae.pointLights.value=F.state.point,Ae.pointLightShadows.value=F.state.pointShadow,Ae.hemisphereLights.value=F.state.hemi,Ae.directionalShadowMap.value=F.state.directionalShadowMap,Ae.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ae.spotShadowMap.value=F.state.spotShadowMap,Ae.spotLightMatrix.value=F.state.spotLightMatrix,Ae.spotLightMap.value=F.state.spotLightMap,Ae.pointShadowMap.value=F.state.pointShadowMap,Ae.pointShadowMatrix.value=F.state.pointShadowMatrix),k.currentProgram=Ne,k.uniformsList=null,Ne}function yu(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=Ba.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function Su(w,U){const z=Te.get(w);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function fp(w,U,z,k,F){U.isScene!==!0&&(U=ft),C.resetTextureUnits();const ee=U.fog,oe=k.isMeshStandardMaterial?U.environment:null,de=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:$s,ve=(k.isMeshStandardMaterial?O:b).get(k.envMap||oe),Ue=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ne=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ae=!!z.morphAttributes.position,$e=!!z.morphAttributes.normal,tt=!!z.morphAttributes.color;let At=bi;k.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(At=x.toneMapping);const gt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Qe=gt!==void 0?gt.length:0,Ce=Te.get(k),Bt=d.state.lights;if(J===!0&&(he===!0||w!==S)){const Kt=w===S&&k.id===M;te.setState(k,w,Kt)}let nt=!1;k.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==Bt.state.version||Ce.outputColorSpace!==de||F.isBatchedMesh&&Ce.batching===!1||!F.isBatchedMesh&&Ce.batching===!0||F.isBatchedMesh&&Ce.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Ce.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Ce.instancing===!1||!F.isInstancedMesh&&Ce.instancing===!0||F.isSkinnedMesh&&Ce.skinning===!1||!F.isSkinnedMesh&&Ce.skinning===!0||F.isInstancedMesh&&Ce.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ce.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Ce.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Ce.instancingMorph===!1&&F.morphTexture!==null||Ce.envMap!==ve||k.fog===!0&&Ce.fog!==ee||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==te.numPlanes||Ce.numIntersection!==te.numIntersection)||Ce.vertexAlphas!==Ue||Ce.vertexTangents!==Ne||Ce.morphTargets!==Ae||Ce.morphNormals!==$e||Ce.morphColors!==tt||Ce.toneMapping!==At||Ce.morphTargetsCount!==Qe)&&(nt=!0):(nt=!0,Ce.__version=k.version);let Dn=Ce.currentProgram;nt===!0&&(Dn=qr(k,U,F));let rs=!1,dn=!1,sr=!1;const ht=Dn.getUniforms(),Mn=Ce.uniforms;if(Ee.useProgram(Dn.program)&&(rs=!0,dn=!0,sr=!0),k.id!==M&&(M=k.id,dn=!0),rs||S!==w){Ee.buffers.depth.getReversed()?(ie.copy(w.projectionMatrix),wm(ie),Em(ie),ht.setValue(L,"projectionMatrix",ie)):ht.setValue(L,"projectionMatrix",w.projectionMatrix),ht.setValue(L,"viewMatrix",w.matrixWorldInverse);const ln=ht.map.cameraPosition;ln!==void 0&&ln.setValue(L,De.setFromMatrixPosition(w.matrixWorld)),qe.logarithmicDepthBuffer&&ht.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ht.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,dn=!0,sr=!0)}if(F.isSkinnedMesh){ht.setOptional(L,F,"bindMatrix"),ht.setOptional(L,F,"bindMatrixInverse");const Kt=F.skeleton;Kt&&(Kt.boneTexture===null&&Kt.computeBoneTexture(),ht.setValue(L,"boneTexture",Kt.boneTexture,C))}F.isBatchedMesh&&(ht.setOptional(L,F,"batchingTexture"),ht.setValue(L,"batchingTexture",F._matricesTexture,C),ht.setOptional(L,F,"batchingIdTexture"),ht.setValue(L,"batchingIdTexture",F._indirectTexture,C),ht.setOptional(L,F,"batchingColorTexture"),F._colorsTexture!==null&&ht.setValue(L,"batchingColorTexture",F._colorsTexture,C));const bn=z.morphAttributes;if((bn.position!==void 0||bn.normal!==void 0||bn.color!==void 0)&&Ie.update(F,z,Dn),(dn||Ce.receiveShadow!==F.receiveShadow)&&(Ce.receiveShadow=F.receiveShadow,ht.setValue(L,"receiveShadow",F.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(Mn.envMap.value=ve,Mn.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(Mn.envMapIntensity.value=U.environmentIntensity),dn&&(ht.setValue(L,"toneMappingExposure",x.toneMappingExposure),Ce.needsLights&&pp(Mn,sr),ee&&k.fog===!0&&le.refreshFogUniforms(Mn,ee),le.refreshMaterialUniforms(Mn,k,V,Y,d.state.transmissionRenderTarget[w.id]),Ba.upload(L,yu(Ce),Mn,C)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ba.upload(L,yu(Ce),Mn,C),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ht.setValue(L,"center",F.center),ht.setValue(L,"modelViewMatrix",F.modelViewMatrix),ht.setValue(L,"normalMatrix",F.normalMatrix),ht.setValue(L,"modelMatrix",F.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Kt=k.uniformsGroups;for(let ln=0,Ao=Kt.length;ln<Ao;ln++){const Ni=Kt[ln];I.update(Ni,Dn),I.bind(Ni,Dn)}}return Dn}function pp(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function mp(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,U,z){Te.get(w.texture).__webglTexture=U,Te.get(w.depthTexture).__webglTexture=z;const k=Te.get(w);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,U){const z=Te.get(w);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,z=0){R=w,T=U,A=z;let k=!0,F=null,ee=!1,oe=!1;if(w){const ve=Te.get(w);if(ve.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(L.FRAMEBUFFER,null),k=!1;else if(ve.__webglFramebuffer===void 0)C.setupRenderTarget(w);else if(ve.__hasExternalTextures)C.rebindTextures(w,Te.get(w.texture).__webglTexture,Te.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ae=w.depthTexture;if(ve.__boundDepthTexture!==Ae){if(Ae!==null&&Te.has(Ae)&&(w.width!==Ae.image.width||w.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(w)}}const Ue=w.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(oe=!0);const Ne=Te.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ne[U])?F=Ne[U][z]:F=Ne[U],ee=!0):w.samples>0&&C.useMultisampledRTT(w)===!1?F=Te.get(w).__webglMultisampledFramebuffer:Array.isArray(Ne)?F=Ne[z]:F=Ne,D.copy(w.viewport),B.copy(w.scissor),N=w.scissorTest}else D.copy(ge).multiplyScalar(V).floor(),B.copy(ye).multiplyScalar(V).floor(),N=be;if(Ee.bindFramebuffer(L.FRAMEBUFFER,F)&&k&&Ee.drawBuffers(w,F),Ee.viewport(D),Ee.scissor(B),Ee.setScissorTest(N),ee){const ve=Te.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+U,ve.__webglTexture,z)}else if(oe){const ve=Te.get(w.texture),Ue=U||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,ve.__webglTexture,z||0,Ue)}M=-1},this.readRenderTargetPixels=function(w,U,z,k,F,ee,oe){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=Te.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&oe!==void 0&&(de=de[oe]),de){Ee.bindFramebuffer(L.FRAMEBUFFER,de);try{const ve=w.texture,Ue=ve.format,Ne=ve.type;if(!qe.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-k&&z>=0&&z<=w.height-F&&L.readPixels(U,z,k,F,Oe.convert(Ue),Oe.convert(Ne),ee)}finally{const ve=R!==null?Te.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(L.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(w,U,z,k,F,ee,oe){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=Te.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&oe!==void 0&&(de=de[oe]),de){const ve=w.texture,Ue=ve.format,Ne=ve.type;if(!qe.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=w.width-k&&z>=0&&z<=w.height-F){Ee.bindFramebuffer(L.FRAMEBUFFER,de);const Ae=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ae),L.bufferData(L.PIXEL_PACK_BUFFER,ee.byteLength,L.STREAM_READ),L.readPixels(U,z,k,F,Oe.convert(Ue),Oe.convert(Ne),0);const $e=R!==null?Te.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(L.FRAMEBUFFER,$e);const tt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await bm(L,tt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ae),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ee),L.deleteBuffer(Ae),L.deleteSync(tt),ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,U=null,z=0){w.isTexture!==!0&&(Cs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,w=arguments[1]);const k=Math.pow(2,-z),F=Math.floor(w.image.width*k),ee=Math.floor(w.image.height*k),oe=U!==null?U.x:0,de=U!==null?U.y:0;C.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,z,0,0,oe,de,F,ee),Ee.unbindTexture()};const gp=L.createFramebuffer(),vp=L.createFramebuffer();this.copyTextureToTexture=function(w,U,z=null,k=null,F=0,ee=null){w.isTexture!==!0&&(Cs("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,w=arguments[1],U=arguments[2],ee=arguments[3]||0,z=null),ee===null&&(F!==0?(Cs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ee=F,F=0):ee=0);let oe,de,ve,Ue,Ne,Ae,$e,tt,At;const gt=w.isCompressedTexture?w.mipmaps[ee]:w.image;if(z!==null)oe=z.max.x-z.min.x,de=z.max.y-z.min.y,ve=z.isBox3?z.max.z-z.min.z:1,Ue=z.min.x,Ne=z.min.y,Ae=z.isBox3?z.min.z:0;else{const bn=Math.pow(2,-F);oe=Math.floor(gt.width*bn),de=Math.floor(gt.height*bn),w.isDataArrayTexture?ve=gt.depth:w.isData3DTexture?ve=Math.floor(gt.depth*bn):ve=1,Ue=0,Ne=0,Ae=0}k!==null?($e=k.x,tt=k.y,At=k.z):($e=0,tt=0,At=0);const Qe=Oe.convert(U.format),Ce=Oe.convert(U.type);let Bt;U.isData3DTexture?(C.setTexture3D(U,0),Bt=L.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(C.setTexture2DArray(U,0),Bt=L.TEXTURE_2D_ARRAY):(C.setTexture2D(U,0),Bt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,U.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,U.unpackAlignment);const nt=L.getParameter(L.UNPACK_ROW_LENGTH),Dn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),rs=L.getParameter(L.UNPACK_SKIP_PIXELS),dn=L.getParameter(L.UNPACK_SKIP_ROWS),sr=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ue),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ne),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ae);const ht=w.isDataArrayTexture||w.isData3DTexture,Mn=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){const bn=Te.get(w),Kt=Te.get(U),ln=Te.get(bn.__renderTarget),Ao=Te.get(Kt.__renderTarget);Ee.bindFramebuffer(L.READ_FRAMEBUFFER,ln.__webglFramebuffer),Ee.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ao.__webglFramebuffer);for(let Ni=0;Ni<ve;Ni++)ht&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Te.get(w).__webglTexture,F,Ae+Ni),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Te.get(U).__webglTexture,ee,At+Ni)),L.blitFramebuffer(Ue,Ne,oe,de,$e,tt,oe,de,L.DEPTH_BUFFER_BIT,L.NEAREST);Ee.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(F!==0||w.isRenderTargetTexture||Te.has(w)){const bn=Te.get(w),Kt=Te.get(U);Ee.bindFramebuffer(L.READ_FRAMEBUFFER,gp),Ee.bindFramebuffer(L.DRAW_FRAMEBUFFER,vp);for(let ln=0;ln<ve;ln++)ht?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,bn.__webglTexture,F,Ae+ln):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,bn.__webglTexture,F),Mn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Kt.__webglTexture,ee,At+ln):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Kt.__webglTexture,ee),F!==0?L.blitFramebuffer(Ue,Ne,oe,de,$e,tt,oe,de,L.COLOR_BUFFER_BIT,L.NEAREST):Mn?L.copyTexSubImage3D(Bt,ee,$e,tt,At+ln,Ue,Ne,oe,de):L.copyTexSubImage2D(Bt,ee,$e,tt,Ue,Ne,oe,de);Ee.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Mn?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Bt,ee,$e,tt,At,oe,de,ve,Qe,Ce,gt.data):U.isCompressedArrayTexture?L.compressedTexSubImage3D(Bt,ee,$e,tt,At,oe,de,ve,Qe,gt.data):L.texSubImage3D(Bt,ee,$e,tt,At,oe,de,ve,Qe,Ce,gt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ee,$e,tt,oe,de,Qe,Ce,gt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ee,$e,tt,gt.width,gt.height,Qe,gt.data):L.texSubImage2D(L.TEXTURE_2D,ee,$e,tt,oe,de,Qe,Ce,gt);L.pixelStorei(L.UNPACK_ROW_LENGTH,nt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Dn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,rs),L.pixelStorei(L.UNPACK_SKIP_ROWS,dn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,sr),ee===0&&U.generateMipmaps&&L.generateMipmap(Bt),Ee.unbindTexture()},this.copyTextureToTexture3D=function(w,U,z=null,k=null,F=0){return w.isTexture!==!0&&(Cs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,w=arguments[2],U=arguments[3],F=arguments[4]||0),Cs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,U,z,k,F)},this.initRenderTarget=function(w){Te.get(w).__webglFramebuffer===void 0&&C.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?C.setTextureCube(w,0):w.isData3DTexture?C.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?C.setTexture2DArray(w,0):C.setTexture2D(w,0),Ee.unbindTexture()},this.resetState=function(){T=0,A=0,R=null,Ee.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}const sn=10,wi=1e3,Pf=wi*1e3*.5,K_=2,$_=.74,Z_=.9,Q_=.76,J_=-2.4,ey="#ffffff",ty=256,ny=1,iy=2,sy=1,ry=1,ay=1,oy=.75,ly=.25,cy=.9,uy=23.4,hy=0,to={fast:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:sn,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:16,iceCap:.15,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",atmosphereEnabled:!0,cloudEnabled:!1,cloudAlpha:$_,cloudSpeed:Z_,cloudQuantity:Q_,cloudHeight:J_,cloudColor:ey,cloudResolution:ty,cloudShader:"billow",waterCycleEnabled:!0,waterCycleCloudEnabled:!0,waterCycleRun:!0,weatherAutoScale:!1,weatherSimMode:"3d",weatherVolumeRes:8,weatherRayStepsMin:4,weatherRayStepsMax:6,weatherRayBundle:8,weatherAtmoThickness:60,axialTilt:uy,seasonProgress:hy,weatherDebug:"off",weatherSpeed:ny,weatherUpdateHz:1,weatherMoistureLayers:iy,weatherEvap:sy,weatherPrecip:ry,weatherWind:ay,weatherWetness:oy,weatherOceanInertia:ly,weatherRainFxEnabled:!0,weatherRainFx:1,weatherRainHaze:cy},balanced:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:sn,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.12,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"mixed",weatherAutoScale:!0},high:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:sn,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.15,plateDelta:1.25,plateSizeVariance:.45,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",weatherAutoScale:!0}};class dy{constructor(e,t,n,s,r=null){this.camera=e,this.domElement=t,this.scene=n,this.onExitCallback=s,this.externalInput=r,this.planetMesh=null,this.planetGroup=null,this.surfaceRay=new oc,this.planetRadius=sn,this.walkSpeed=.5,this.runSpeed=1,this.flySpeed=4,this.swimSpeed=.25,this.jumpForce=3,this.gravity=30,this.playerHeight=.02,this.accelGround=32,this.accelAir=10,this.accelFly=14,this.accelSwim=10,this.frictionGround=9,this.stopSpeed=1.2,this.enabled=!1,this.isLocked=!1,this.isFlying=!1,this.isSwimming=!1,this.moveForward=!1,this.moveBackward=!1,this.moveLeft=!1,this.moveRight=!1,this.moveUp=!1,this.moveDown=!1,this.rollLeft=!1,this.rollRight=!1,this.lookUp=!1,this.lookDown=!1,this.lookLeft=!1,this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.jumpRequested=!1,this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0,this.velocity=new P,this.direction=new P,this.verticalVelocity=0,this.horizontalVelocity=new P,this.keyLookSpeed=1.8,this.keyRollSpeed=2.4,this.player=new wt,this.player.name="TinyPlanetPlayer",this.raycaster=new oc,this.worldUp=new P,this.dummyVec=new P,this.dummyQuat=new On,this.camLocalUp=new P,this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onPointerLockChange=this.onPointerLockChange.bind(this)}setPlanet(e){this.planetMesh=e}enter(e,t,n=null){if(this.enabled)return;this.enabled=!0,this.planetMesh=t,this.planetGroup=t.parent;const s=e.clone();this.planetMesh.worldToLocal(s);const r=s.normalize(),o=(n?n.getWorldDirection(new P):new P(0,0,-1)).clone().projectOnPlane(r).normalize(),l=o.lengthSq()>1e-6?o:this.basisEast(r);this.planetMesh.add(this.player);const c=s.length()+2;this.player.position.copy(r).multiplyScalar(c),this.alignToFrame(r,l),this.player.add(this.camera),this.camera.position.set(0,0,0),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0,this.isFlying=!1,this.horizontalVelocity.set(0,0,0),this.externalInput&&this.externalInput.setLookMode&&this.externalInput.setLookMode("surface"),!/Mobi|Android|iP(ad|hone|od)/i.test(navigator.userAgent||"")&&this.domElement.requestPointerLock&&this.domElement.requestPointerLock(),this.addListeners()}exit(){this.enabled&&(this.enabled=!1,this.removeListeners(),document.exitPointerLock(),this.player.remove(this.camera),this.scene.add(this.camera),this.player.parent&&this.player.parent.remove(this.player),this.onExitCallback&&this.onExitCallback(),this.externalInput&&(this.externalInput.clear(),this.externalInput.setLookMode&&this.externalInput.setLookMode("orbit")),this.moveForward=this.moveBackward=this.moveLeft=this.moveRight=!1,this.moveUp=this.moveDown=!1,this.rollLeft=this.rollRight=!1,this.lookUp=this.lookDown=this.lookLeft=this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.horizontalVelocity.set(0,0,0),this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0)}addListeners(){document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("pointerlockchange",this.onPointerLockChange)}removeListeners(){document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("pointerlockchange",this.onPointerLockChange)}onPointerLockChange(){this.isLocked=document.pointerLockElement===this.domElement,!this.isLocked&&this.enabled}onKeyDown(e){switch(e.code){case"ArrowUp":this.lookUp=!0,e.preventDefault();break;case"ArrowDown":this.lookDown=!0,e.preventDefault();break;case"ArrowLeft":this.lookLeft=!0,e.preventDefault();break;case"ArrowRight":this.lookRight=!0,e.preventDefault();break;case"KeyW":this.moveForward=!0;break;case"KeyA":this.moveLeft=!0;break;case"KeyS":this.moveBackward=!0;break;case"KeyD":this.moveRight=!0;break;case"Space":case"Numpad0":e.preventDefault(),this.isFlying?this.moveUp=!0:this.jumpRequested=!0;break;case"ControlLeft":case"ControlRight":case"KeyC":e.preventDefault(),this.moveDown=!0;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!0;break;case"KeyF":this.toggleFlight();break;case"KeyQ":this.rollLeft=!0;break;case"KeyE":this.rollRight=!0;break;case"Escape":this.exit();break}}onKeyUp(e){switch(e.code){case"ArrowUp":this.lookUp=!1;break;case"ArrowDown":this.lookDown=!1;break;case"ArrowLeft":this.lookLeft=!1;break;case"ArrowRight":this.lookRight=!1;break;case"KeyW":this.moveForward=!1;break;case"KeyA":this.moveLeft=!1;break;case"KeyS":this.moveBackward=!1;break;case"KeyD":this.moveRight=!1;break;case"Space":case"Numpad0":this.moveUp=!1;break;case"ControlLeft":case"ControlRight":case"KeyC":this.moveDown=!1;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!1;break;case"KeyQ":this.rollLeft=!1;break;case"KeyE":this.rollRight=!1;break}}onMouseMove(e){if(!this.isLocked)return;const t=e.movementX||0,n=e.movementY||0;if(this.isFlying){const s=new P(0,1,0).applyQuaternion(this.camera.quaternion);this.player.rotateOnAxis(s,-t*.002),this.camera.rotateX(-n*.002)}else this.player.rotateY(-t*.002),this.camera.rotateX(-n*.002),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}basisEast(e){const t=Math.abs(e.y)<.9?new P(0,1,0):new P(1,0,0),n=new P().crossVectors(t,e).normalize();return n.lengthSq()>1e-6?n:new P(1,0,0)}alignToFrame(e,t){const n=e.clone().normalize();let s=t.clone().projectOnPlane(n);s.lengthSq()<1e-6&&(s=this.basisEast(n)),s.normalize();const r=new P().crossVectors(s,n).normalize();s.crossVectors(n,r).normalize();const a=new ot().makeBasis(r,n,s.negate());this.player.quaternion.setFromRotationMatrix(a),this.player.up.copy(n)}toggleFlight(){if(this.isFlying=!this.isFlying,this.verticalVelocity=0,!this.isFlying){const e=this.player.position.clone().normalize(),t=new P(0,1,0),n=new On().setFromUnitVectors(t,e);this.player.quaternion.copy(n),this.player.up.copy(e),this.camera.rotation.x=0,this.velocity.set(0,0,0)}}snapToSurface(){var h,f;if(!this.planetMesh||!((h=this.planetMesh.userData)!=null&&h.forge)||!((f=this.planetMesh.userData)!=null&&f.settings))return;const e=this.planetMesh.userData.forge,t=this.planetMesh.userData.settings;this.surfaceRay.setFromCamera(new _e(0,0),this.camera);const n=this.surfaceRay.intersectObject(this.planetMesh,!1);if(!n.length)return;const r=n[0].point.clone().clone();this.planetMesh.worldToLocal(r);const a=r.normalize(),o=e.getHeightAt(a),l=t.radius+(o-t.seaLevel)*t.heightScale+this.playerHeight,c=a.clone().multiplyScalar(l+.2);this.player.position.copy(c);const u=new On().setFromUnitVectors(new P(0,1,0),a);this.player.quaternion.copy(u),this.player.up.copy(a),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0}update(e){var y,x;if(!this.enabled)return;const t=Math.min(Math.max(e??0,0),.05),n=(x=(y=this.externalInput)==null?void 0:y.getState)==null?void 0:x.call(y),s=this.moveForward||!!(n!=null&&n.forward),r=this.moveBackward||!!(n!=null&&n.backward),a=this.moveLeft||!!(n!=null&&n.left),o=this.moveRight||!!(n!=null&&n.right);this.moveUp||n!=null&&n.up,this.moveDown||n!=null&&n.down;const l=this.isRunning||!!(n!=null&&n.run),c=this.rollLeft||!!(n!=null&&n.rollLeft),u=this.rollRight||!!(n!=null&&n.rollRight);if(this.externalInput){if(this.externalInput.consume("flyToggle")&&this.toggleFlight(),this.externalInput.consume("exit")){this.exit();return}this.externalInput.consume("surface")&&this.snapToSurface(),!this.isFlying&&this.externalInput.consume("jump")&&(this.jumpRequested=!0);const E=this.externalInput.consumeLookDelta();if(Math.abs(E.x)>1e-4||Math.abs(E.y)>1e-4){const T=-E.x*.01,A=-E.y*.01;this.player.rotateY(T),this.camera.rotateX(A),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}const h=(this.lookUp?1:0)-(this.lookDown?1:0),f=(this.lookLeft?1:0)-(this.lookRight?1:0),m=(c?1:0)-(u?1:0),g=f*this.keyLookSpeed,v=h*this.keyLookSpeed,p=m*this.keyRollSpeed;this.keyLookYawVelocity=g,this.keyLookPitchVelocity=v,this.keyLookRollVelocity=p,Math.abs(this.keyLookYawVelocity)>1e-4&&(this.isFlying?(this.camLocalUp.set(0,1,0).applyQuaternion(this.camera.quaternion),this.player.rotateOnAxis(this.camLocalUp,this.keyLookYawVelocity*t)):this.player.rotateY(this.keyLookYawVelocity*t)),Math.abs(this.keyLookPitchVelocity)>1e-4&&(this.camera.rotateX(this.keyLookPitchVelocity*t),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))),Math.abs(this.keyLookRollVelocity)>1e-4&&this.camera.rotateZ(this.keyLookRollVelocity*t);let d=this.walkSpeed;this.isFlying?d=this.flySpeed:l&&(d=this.runSpeed);const _=new P;if(s&&(_.z+=1),r&&(_.z-=1),a&&(_.x-=1),o&&(_.x+=1),this.isFlying&&(_.z*=-1),_.normalize(),this.isFlying){this.horizontalVelocity.multiplyScalar(.5);const E=_.clone().multiplyScalar(d*e);E.applyQuaternion(this.camera.quaternion),E.applyQuaternion(this.player.quaternion),this.player.position.add(E)}else{const E=this.player.position.clone().normalize(),T=new P(0,0,-1).applyQuaternion(this.camera.quaternion).applyQuaternion(this.player.quaternion).projectOnPlane(E).normalize(),A=new P().crossVectors(T,E).normalize(),R=new P;R.addScaledVector(T,_.z),R.addScaledVector(A,_.x);const M=R.lengthSq()>1e-6?R.normalize():R;let S=this.planetRadius;const D=this.planetMesh.userData.forge,B=this.planetMesh.userData.settings;if(D&&B){const ye=this.player.position.clone().normalize(),be=D.getHeightAt(ye);S=B.radius+(be-B.seaLevel)*B.heightScale}const N=this.player.position.length(),W=S+this.playerHeight,X=N<=W+.05,H=()=>{const ye=this.horizontalVelocity,be=ye.length();if(be<1e-5)return;const J=Math.max(this.stopSpeed,be)*this.frictionGround*t,he=Math.max(be-J,0);ye.multiplyScalar(he/be)},Y=(ye,be,q)=>{if(be<=0||ye.lengthSq()<1e-6)return;const J=this.horizontalVelocity.dot(ye),he=be-J;if(he<=0)return;const ie=q*be*t,we=Math.min(ie,he);this.horizontalVelocity.addScaledVector(ye,we)};X?M.lengthSq()<1e-6?H():(H(),Y(M,d,this.accelGround)):M.lengthSq()>1e-6&&Y(M,d,this.accelAir);const V=this.horizontalVelocity.clone().multiplyScalar(t);if(this.player.position.add(V),X?(this.canJump=!0,this.jumpRequested&&this.canJump?(this.verticalVelocity=this.jumpForce,this.canJump=!1):this.verticalVelocity=0):this.verticalVelocity-=this.gravity*t,Math.abs(this.verticalVelocity)>1e-6&&this.player.translateY(this.verticalVelocity*t),this.player.position.length()<W){const ye=this.player.position.clone().normalize();this.player.position.copy(ye.multiplyScalar(W)),this.verticalVelocity<0&&(this.verticalVelocity=0),this.canJump=!0}this.jumpRequested=!1;const Q=this.player.position.clone().normalize(),re=new P(0,1,0).applyQuaternion(this.player.quaternion),ge=new On().setFromUnitVectors(re,Q);this.player.quaternion.premultiply(ge),this.player.up.copy(Q),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}}function Rh(i,e=1e-4){e=Math.max(e,Number.EPSILON);const t={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count;let a=0;const o=Object.keys(i.attributes),l={},c={},u=[],h=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let _=0,y=o.length;_<y;_++){const x=o[_],E=i.attributes[x];l[x]=new E.constructor(new E.array.constructor(E.count*E.itemSize),E.itemSize,E.normalized);const T=i.morphAttributes[x];T&&(c[x]||(c[x]=[]),T.forEach((A,R)=>{const M=new A.array.constructor(A.count*A.itemSize);c[x][R]=new A.constructor(M,A.itemSize,A.normalized)}))}const m=e*.5,g=Math.log10(1/e),v=Math.pow(10,g),p=m*v;for(let _=0;_<r;_++){const y=n?n.getX(_):_;let x="";for(let E=0,T=o.length;E<T;E++){const A=o[E],R=i.getAttribute(A),M=R.itemSize;for(let S=0;S<M;S++)x+=`${~~(R[h[S]](y)*v+p)},`}if(x in t)u.push(t[x]);else{for(let E=0,T=o.length;E<T;E++){const A=o[E],R=i.getAttribute(A),M=i.morphAttributes[A],S=R.itemSize,D=l[A],B=c[A];for(let N=0;N<S;N++){const W=h[N],X=f[N];if(D[X](a,R[W](y)),M)for(let H=0,Y=M.length;H<Y;H++)B[H][X](a,M[H][W](y))}}t[x]=a,u.push(a),a++}}const d=i.clone();for(const _ in i.attributes){const y=l[_];if(d.setAttribute(_,new y.constructor(y.array.slice(0,a*y.itemSize),y.itemSize,y.normalized)),_ in c)for(let x=0;x<c[_].length;x++){const E=c[_][x];d.morphAttributes[_][x]=new E.constructor(E.array.slice(0,a*E.itemSize),E.itemSize,E.normalized)}}return d.setIndex(u),d}const Ph=(()=>{const i=new Uint8Array([0,0,128,0]),e=new Xn(i,1,1,bt,Dt);return e.needsUpdate=!0,e.wrapS=yn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Ft,e})(),Dh=(()=>{const i=new Uint8Array([160,0,128,128]),e=new Xn(i,1,1,bt,Dt);return e.needsUpdate=!0,e.wrapS=yn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Ft,e})();class fy{constructor(e=512){this.size=e,this.data=new Float32Array(e*e),this.waterMask=new Float32Array(e*e),this.rng=Math.random}generateTectonics({numPlates:e=15,jitter:t=.5,oceanFloor:n=.2,plateDelta:s=1,faultType:r="ridge",plateSizeVariance:a=0,desymmetrizeTiling:o=!1}){console.time("Tectonics Generation");const l=Math.max(0,a),c=[];for(let u=0;u<e;u++)c.push({x:Math.floor(this.rng()*this.size),y:Math.floor(this.rng()*this.size),z:this.rng()*.5+.5,type:this.rng()>.6?1:-1,sizeBias:Math.max(.25,1+(this.rng()*2-1)*l),skew:o?(this.rng()*2-1)*l*.5*this.size:0});for(let u=0;u<this.size;u++)for(let h=0;h<this.size;h++){let f=1/0,m=1/0,g=null;for(const y of c){const E=((o?y.x+y.skew*(u/this.size):y.x)%this.size+this.size)%this.size,T=Math.min(Math.abs(h-E),this.size-Math.abs(h-E)),A=u-y.y,M=Math.sqrt(T*T+A*A)/y.sizeBias;M<f?(m=f,f=M,g=y):M<m&&(m=M)}const v=f/(m+.001);let p=0;g.type>0?p=g.z*s-v*t:p=n-.08+v*.05;const d=Math.pow(v,5)*g.z;let _=r;if(r==="mixed"){const y=Math.abs(Math.sin((g.x+g.y+g.z)*12.9898));_=y<.33?"ridge":y<.66?"trench":"shear"}_==="ridge"?p+=d:_==="trench"?p-=d*.7:_==="shear"?p+=d*.2*Math.sign(g.type):p+=d,this.data[u*this.size+h]=Math.max(0,Math.min(1,p))}console.timeEnd("Tectonics Generation")}applyErosion({iterations:e=5e4,inertia:t=.05,gravity:n=4,evaporation:s=.01,erosionRate:r=.3,depositionRate:a=.1}){console.time("Hydraulic Erosion");const o=this.size;for(let l=0;l<e;l++){let c=this.rng()*(o-1),u=this.rng()*(o-1),h=0,f=0,m=1,g=1,v=0;for(let p=0;p<30;p++){let d=Math.floor(c),_=Math.floor(u),y=(d+o)%o,x=(d+1+o)%o,E=Math.max(0,Math.min(o-1,_));const T=this.data[E*o+y],A=this.data[E*o+(d-1+o)%o],R=this.data[E*o+x],M=this.data[Math.max(0,_-1)*o+y],S=this.data[Math.min(o-1,_+1)*o+y],D=R-A,B=S-M;h=h*t-D*(1-t),f=f*t-B*(1-t);const N=Math.sqrt(h*h+f*f);if(N!==0&&(h/=N,f/=N),c+=h,u+=f,u<0||u>=o-1||!Number.isFinite(u)||!Number.isFinite(c))break;const W=Math.max(0,Math.min(o-1,Math.floor(u))),X=(Math.floor(c)+o)%o;let H=this.data[W*o+X],Y=T-H;const V=Math.max(-Y,.01)*m*g*4;if(v>V||Y<0){const Q=(v-V)*a;v-=Q,this.data[E*o+y]+=Q}else{const Q=Math.min((V-v)*r,-Y);v+=Q,this.data[E*o+y]-=Q}if(m=Math.sqrt(m*m+Math.max(0,Y)*n),g*=1-s,g<.01)break}}console.timeEnd("Hydraulic Erosion"),this._sanitize()}createMesh(e=10,t=2,n=.5,s=6,r=.12,a=null,o=null){this._sanitize();let l=new Ii(e,Math.max(0,Math.floor(s)));l.deleteAttribute("uv"),l=Rh(l);const c=_=>Math.min(Math.max(_,0),1),u=(_,y,x)=>{const E=c(_)*(this.size-1),T=c(1-y)*(this.size-1),A=Math.floor(E),R=Math.floor(T),M=Math.min(this.size-1,A+1),S=Math.min(this.size-1,R+1),D=E-A,B=T-R,N=x[R*this.size+A],W=x[R*this.size+M],X=x[S*this.size+A],H=x[S*this.size+M],Y=N*(1-D)+W*D,V=X*(1-D)+H*D,Q=Y*(1-B)+V*B;return Number.isFinite(Q)?Q:0},h=(_,y)=>u(_,y,this.data),f=(_,y)=>u(_,y,this.waterMask),m=_=>{const y=new P(Math.abs(_.x),Math.abs(_.y),Math.abs(_.z)),x=y.x+y.y+y.z+1e-6,E=y.x/x,T=y.y/x,A=y.z/x,R={u:_.z*.5+.5,v:_.y*.5+.5},M={u:_.x*.5+.5,v:_.z*.5+.5},S={u:_.x*.5+.5,v:_.y*.5+.5},D=h(R.u,R.v),B=h(M.u,M.v),N=h(S.u,S.v);return D*E+B*T+N*A},g=l.attributes.position,v=new P,p=new Float32Array(g.count);for(let _=0;_<g.count;_++){v.fromBufferAttribute(g,_);const y=v.length();if(y===0||!Number.isFinite(y)){v.set(e,0,0),g.setXYZ(_,v.x,v.y,v.z);continue}const x=v.clone().normalize(),E=m(x),T=f(x.x*.5+.5,x.y*.5+.5),A=(E-n)*t;x.multiplyScalar(e+A),g.setXYZ(_,x.x,x.y,x.z),p[_]=T}l.computeVertexNormals(),this._ensureFinitePositions(l,e),l.normalizeNormals(),l.setAttribute("waterMask",new kt(p,1));const d=new i0({shininess:50,specular:new xe(6710886),color:8947848,flatShading:!1,onBeforeCompile:function(_){var y,x,E,T;_.vertexShader=`
                    varying float vHeight;
                    varying vec3 vDir;
                    attribute float waterMask;
                    varying float vWater;
                    varying float vSlope;
                    uniform float uIceCap;
                    ${_.vertexShader}
                `.replace("#include <begin_vertex>",`
                    #include <begin_vertex>
                    vHeight = length(transformed) - ${e.toFixed(1)};
                    vDir = normalize(transformed);
                    vWater = waterMask;
                    vSlope = 1.0 - dot(normalize(normal), normalize(position));
                    float rough = smoothstep(0.2, 0.7, vSlope);
                    float rockNoise = sin(dot(position.xyz, vec3(12.9898,78.233,37.719))) * 0.5 + 0.5;
                    transformed += normalize(normal) * rockNoise * rough * 0.08;
                    `),_.fragmentShader=`
                    varying float vHeight;
                    varying vec3 vDir;
                    varying float vWater;
                    varying float vSlope;
                    uniform float uIceCap;
                    uniform sampler2D uWeatherMap;
                    uniform sampler2D uWeatherAuxMap;
                    uniform float uWeatherStrength;
                    uniform float uWeatherDebug;
                    
	                    float hash(vec3 p) {
	                        p = fract(p * 0.3183099 + .1);
	                        p *= 17.0;
	                        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
	                    }

	                    vec3 hsv2rgb(vec3 c) {
	                        vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
	                        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	                        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	                    }
	                    
	                    ${_.fragmentShader}
	                `.replace("#include <color_fragment>",`
                    // Recover normalized height value used for displacement
                    float heightVal = (vHeight / ${t.toFixed(3)}) + ${n.toFixed(3)};
                    // Thresholds relative to sea level
                    float sea = ${n.toFixed(3)};
                    float shore = sea + 0.015;
                    float lowland = sea + 0.08;
                    float midland = sea + 0.25;
                    float highland = sea + 0.45;
                    vec3 deep = vec3(0.01, 0.04, 0.12);
                    vec3 shallow = vec3(0.04, 0.20, 0.40);
                    vec3 grass = vec3(0.12, 0.44, 0.18);
                    vec3 rock = vec3(0.45, 0.45, 0.45);
                    vec3 snow = vec3(1.0, 1.0, 1.0);
                    vec3 col;
                    float waterFactor = vWater;

                    // Weather wetness (RGBA: cloud, rain, pressure, soil)
                    vec3 d = normalize(vDir);
                    float wu = atan(d.z, d.x) / (2.0 * 3.14159265) + 0.5;
                    float wv = asin(clamp(d.y, -1.0, 1.0)) / 3.14159265 + 0.5;
                    vec4 wData = texture2D(uWeatherMap, vec2(wu, wv));
                    vec4 wAux = texture2D(uWeatherAuxMap, vec2(wu, wv));
                    float rainNow = wData.g;
                    float soilWet = wData.a;
                    float wetness = clamp(max(rainNow, soilWet) * uWeatherStrength, 0.0, 1.0);

	                    // Weather debug visualization:
	                    // 0=off, 1=cloud, 2=rain, 3=pressure, 4=soil, 5=temp, 6=snow, 7=wind
	                    if (uWeatherDebug > 0.5) {
	                        if (uWeatherDebug < 1.5) {
	                            float v = wData.r;
	                            col = mix(vec3(0.02, 0.08, 0.02), vec3(0.65, 1.0, 0.65), v);
	                        } else if (uWeatherDebug < 2.5) {
	                            float v = wData.g;
	                            col = mix(vec3(0.02, 0.05, 0.10), vec3(0.20, 0.55, 1.0), v);
	                        } else if (uWeatherDebug < 3.5) {
	                            float p = (wData.b - 0.5) * 2.0;
	                            col = (p >= 0.0)
	                                ? mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.15, 0.15), clamp(p, 0.0, 1.0))
	                                : mix(vec3(0.0, 0.0, 0.0), vec3(0.15, 0.55, 1.0), clamp(-p, 0.0, 1.0));
	                        } else if (uWeatherDebug < 4.5) {
	                            float v = wData.a;
	                            col = mix(vec3(0.03, 0.03, 0.03), vec3(0.10, 1.0, 0.20), v);
	                        } else if (uWeatherDebug < 5.5) {
	                            float t = wAux.r;
	                            col = mix(vec3(0.08, 0.12, 0.35), vec3(1.0, 0.35, 0.15), t);
	                        } else if (uWeatherDebug < 6.5) {
	                            float s = wAux.g;
	                            col = mix(vec3(0.02, 0.02, 0.02), vec3(1.0, 1.0, 1.0), s);
	                        } else {
	                            vec2 wv2 = (wAux.ba - 0.5) * 2.0;
	                            float sp = clamp(length(wv2), 0.0, 1.0);
	                            float ang = atan(wv2.y, wv2.x);
	                            float hue = ang / (2.0 * 3.14159265) + 0.5;
	                            vec3 windCol = hsv2rgb(vec3(hue, 0.85, pow(sp, 0.65)));
	                            col = mix(vec3(0.02, 0.02, 0.02), windCol, smoothstep(0.05, 0.15, sp));
	                        }
	                    } else {
                        if(heightVal < sea) {
                            float t = smoothstep(sea - 0.05, sea, heightVal);
                            col = mix(deep, shallow, t);
                            waterFactor = 1.0;
                        } else if(heightVal < lowland) {
                            float t = smoothstep(sea, lowland, heightVal);
                            col = mix(shallow, grass, t);
                        } else if(heightVal < midland) {
                            float t = smoothstep(lowland, midland, heightVal);
                            col = mix(grass, rock, t);
                        } else if(heightVal < highland) {
                            float t = smoothstep(midland, highland, heightVal);
                            col = mix(rock, snow, t * 0.7);
                        } else {
                            col = snow;
                        }
                        
                        // ROCKY AREAS: modulated by slope and noise
                        float noise = hash(vDir * 80.0);
                        // Steepness threshold (0 = flat, 1 = vertical)
                        // We start mixing rock on slopes > ~10-15%
                        float steepness = smoothstep(0.1, 0.35, vSlope + (noise * 0.1 - 0.05));
                        
                        if (heightVal >= sea) {
                            col = mix(col, rock, steepness);
                        }
                        
                        // Add roughness/noise to rock areas
                        if (steepness > 0.1 || (heightVal >= midland && heightVal < highland)) {
                            col *= (0.9 + 0.2 * noise);
                        }

                        float snowBlend = smoothstep(highland - 0.02, highland + 0.1, heightVal);
	                        float pole = smoothstep(1.0 - uIceCap, 1.0, abs(vDir.y));
	                        
	                        // Reduce snow on very steep cliffs (optional realism)
	                        float snowStick = 1.0 - smoothstep(0.4, 0.6, vSlope); 
	                        float landMask = step(sea, heightVal); // avoid snow coloring underwater; ocean ice is handled by water mesh
	                        float dynSnow = wAux.g * landMask;
	                        float snowAmt = landMask * max(max(snowBlend, pole * 0.8), dynSnow) * snowStick;
	                        
	                        col = mix(col, snow, snowAmt);

                        // Wet land darkening (avoid snow/ice).
                        if (heightVal >= sea) {
                            float landWet = wetness * (1.0 - snowAmt);
                            vec3 damp = col * vec3(0.70, 0.82, 0.74);
                            col = mix(col, damp, landWet);
                        }
                        
                        if(waterFactor > 0.0) {
                            float wf = clamp(waterFactor, 0.0, 1.0);
                            vec3 wet = mix(shallow, deep, 0.6);
                            col = mix(col, wet, wf);
                        }
                    }
                    diffuseColor = vec4(col, 1.0);
                    `),_.uniforms.uIceCap={value:r},_.uniforms.uWeatherMap={value:((y=this.userData.weather)==null?void 0:y.texture)??Ph},_.uniforms.uWeatherAuxMap={value:((x=this.userData.weather)==null?void 0:x.auxTexture)??Dh},_.uniforms.uWeatherStrength={value:((E=this.userData.weather)==null?void 0:E.strength)??.75},_.uniforms.uWeatherDebug={value:((T=this.userData.weather)==null?void 0:T.debug)??0},this.userData.shader=_}});return d.userData.weather={texture:a??Ph,auxTexture:o??Dh,strength:.75,debug:0},new zt(l,d)}createFreshwaterMesh(e=10,t=2,n=.5,s=6){let r=new Ii(e,Math.max(0,Math.floor(s)));r.deleteAttribute("uv"),r=Rh(r);const a=r.attributes.position,o=new P,l=new Float32Array(a.count),c=(g,v)=>this._sampleBilinear(g,v,this.data),u=(g,v)=>this._sampleBilinear(g,v,this.waterMask),h=g=>{const v=new P(Math.abs(g.x),Math.abs(g.y),Math.abs(g.z)),p=v.x+v.y+v.z+1e-6,d=v.x/p,_=v.y/p,y=v.z/p,x={u:g.z*.5+.5,v:g.y*.5+.5},E={u:g.x*.5+.5,v:g.z*.5+.5},T={u:g.x*.5+.5,v:g.y*.5+.5},A=c(x.u,x.v),R=c(E.u,E.v),M=c(T.u,T.v),S=u(x.u,x.v),D=u(E.u,E.v),B=u(T.u,T.v);return{height:A*d+R*_+M*y,mask:S*d+D*_+B*y}},f=this.riverDepth||.015;for(let g=0;g<a.count;g++){o.fromBufferAttribute(a,g);const v=o.clone().normalize(),p=h(v),d=p.height,_=p.mask,x=(d+_*f*.5-n)*t;v.multiplyScalar(e+x+.001),a.setXYZ(g,v.x,v.y,v.z),l[g]=_}r.computeVertexNormals(),this._ensureFinitePositions(r,e),r.normalizeNormals(),r.setAttribute("waterMask",new kt(l,1));const m=new Vt({uniforms:{time:{value:0},deepColor:{value:new xe(532543)},shallowColor:{value:new xe(1396618)},opacity:{value:.8},fresnelPower:{value:3.4}},transparent:!0,depthWrite:!1,side:_n,blending:Wn,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying float vWater;
                attribute float waterMask;
                
                void main() {
                    vWater = waterMask;
                    vec3 pos = position;
                    // Only apply waves if we have water
                    if (vWater > 0.01) {
                        float wave = sin((pos.x + pos.z) * 0.35 + time * 0.6) * 0.02;
                        pos += normalize(normal) * wave * vWater; // Scale wave by depth mask
                    }
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    vec4 mvPosition = viewMatrix * worldPos;
                    gl_Position = projectionMatrix * mvPosition;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 deepColor;
                uniform vec3 shallowColor;
                uniform float opacity;
                uniform float fresnelPower;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying float vWater;
                
                void main() {
                    #include <logdepthbuf_fragment>
                    
                    // Discard if not water
                    if (vWater < 0.05) discard;
                    
                    vec3 viewDir = normalize(cameraPosition - vWorldPos);
                    float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), fresnelPower);
                    
                    // Use brighter debug colors or original
                    // vec3 base = vec3(1.0, 0.0, 0.0); // Debug RED
                    vec3 base = mix(shallowColor, deepColor, fresnel);
                    
                    float sparkle = pow(fresnel, 4.0) * 0.5;
                    
                    // Fade out at edges of river
                    float alpha = opacity * smoothstep(0.05, 0.2, vWater);
                    
                    gl_FragColor = vec4(base + sparkle, alpha);
                }
            `});return new zt(r,m)}_sanitize(e=-5,t=5){const n=this.data;for(let s=0;s<n.length;s++){let r=n[s];Number.isFinite(r)?r<e?r=e:r>t&&(r=t):r=0,n[s]=r}}_clamp01(e){return Math.min(Math.max(e,0),1)}_sampleBilinear(e,t,n){const s=this._clamp01(e)*(this.size-1),r=this._clamp01(1-t)*(this.size-1),a=Math.floor(s),o=Math.floor(r),l=Math.min(this.size-1,a+1),c=Math.min(this.size-1,o+1),u=s-a,h=r-o,f=n[o*this.size+a],m=n[o*this.size+l],g=n[c*this.size+a],v=n[c*this.size+l],p=f*(1-u)+m*u,d=g*(1-u)+v*u;return p*(1-h)+d*h}getHeightAt(e){const t=(v,p)=>this._sampleBilinear(v,p,this.data),n=new P(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),s=n.x+n.y+n.z+1e-6,r=n.x/s,a=n.y/s,o=n.z/s,l={u:e.z*.5+.5,v:e.y*.5+.5},c={u:e.x*.5+.5,v:e.z*.5+.5},u={u:e.x*.5+.5,v:e.y*.5+.5},h=t(l.u,l.v),f=t(c.u,c.v),m=t(u.u,u.v);let g=h*r+f*a+m*o;return Number.isFinite(g)?g:0}getWaterDataAt(e){const t=(T,A)=>this._sampleBilinear(T,A,this.data),n=(T,A)=>this._sampleBilinear(T,A,this.waterMask),s=new P(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),r=s.x+s.y+s.z+1e-6,a=s.x/r,o=s.y/r,l=s.z/r,c={u:e.z*.5+.5,v:e.y*.5+.5},u={u:e.x*.5+.5,v:e.z*.5+.5},h={u:e.x*.5+.5,v:e.y*.5+.5},f=t(c.u,c.v),m=t(u.u,u.v),g=t(h.u,h.v),v=f*a+m*o+g*l,p=n(c.u,c.v),d=n(u.u,u.v),_=n(h.u,h.v),y=p*a+d*o+_*l,x=this.riverDepth||.015,E=v+y*x*.5;return{height:Number.isFinite(v)?v:0,waterHeight:Number.isFinite(E)?E:0,waterMask:Number.isFinite(y)?y:0,hasWater:y>.05}}applyHydrology({seaLevel:e=.5,riverDepth:t=.015,lakeThreshold:n=.003}={}){this.riverDepth=t;const s=this.size,r=s*s;this.waterMask.fill(0);const a=new Float32Array(this.data),o=new Uint8Array(r),l=new Int32Array(r+s*4),c=new Float32Array(r+s*4);let u=0;const h=(x,E)=>{let T=u++;for(l[T]=x,c[T]=E;T>0;){const A=T-1>>1;if(c[A]<=E)break;l[T]=l[A],c[T]=c[A],l[A]=x,c[A]=E,T=A}},f=()=>{const x=l[0],E=c[0];if(u--,u>0){l[0]=l[u],c[0]=c[u];let T=0;for(;;){const A=(T<<1)+1,R=A+1;if(A>=u)break;let M=A;if(R<u&&c[R]<c[A]&&(M=R),c[T]<=c[M])break;[l[T],l[M]]=[l[M],l[T]],[c[T],c[M]]=[c[M],c[T]],T=M}}return[x,E]},m=(x,E)=>{const T=E*s+x;o[T]||(o[T]=1,h(T,a[T]))};for(let x=0;x<s;x++)m(x,0),m(x,s-1);for(let x=1;x<s-1;x++)m(0,x),m(s-1,x);const g=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];for(;u>0;){const[x,E]=f(),T=x%s,A=Math.floor(x/s);for(const[R,M]of g){const S=(T+R+s)%s,D=A+M;if(D<0||D>=s)continue;const B=D*s+S;if(o[B])continue;o[B]=1,a[B]<E&&(a[B]=E),h(B,a[B])}}const v=new Int32Array(r);for(let x=0;x<s;x++)for(let E=0;E<s;E++){const T=x*s+E,A=a[T];let R=-1,M=A;for(const[S,D]of g){const B=(E+S+s)%s,N=x+D;if(N<0||N>=s)continue;const W=N*s+B,X=a[W];X<M&&(M=X,R=W)}v[T]=R}const p=new Array(r);for(let x=0;x<r;x++)p[x]=x;p.sort((x,E)=>a[E]-a[x]);const d=new Float32Array(r);d.fill(1);for(const x of p){const E=v[x];E>=0&&(d[E]+=d[x])}let _=0;for(let x=0;x<r;x++)d[x]>_&&(_=d[x]);const y=_>0?1/_:0;for(let x=0;x<r;x++){const E=Math.max(0,a[x]-this.data[x]);let T=0;E>n&&(T=Math.min(1,E*12));const A=Math.pow(d[x]*y,.5);A>.1&&a[x]>e&&(T=Math.max(T,A)),this.waterMask[x]=T,T>0&&(this.data[x]=Math.max(0,this.data[x]-T*t))}}_ensureFinitePositions(e,t=10){const n=e.attributes.position,s=n.array;let r=!1;for(let a=0;a<s.length;a++)Number.isFinite(s[a])||(r=!0,s[a]=0);r&&(s[0]=t,s[1]=0,s[2]=0,n.needsUpdate=!0)}}class py{constructor(e){this.sceneGroup=e,this.mesh=null;const t=new Xn(new Uint8Array([110,0,128,0]),1,1,bt,Dt);t.needsUpdate=!0,t.wrapS=yn,t.wrapT=pt,t.minFilter=it,t.magFilter=it,t.generateMipmaps=!1,t.colorSpace=Ft,this.defaultWeatherTexture=t,this.uniforms={sunDir:{value:new P(0,1,0)},glowColor:{value:new xe(5089535)},alpha:{value:1},density:{value:6},weatherMap:{value:t},rainHaze:{value:.9},planetInvRot:{value:new Le},planetInvScale:{value:1},innerRadius:{value:10},outerRadius:{value:11},rayleighScaleHeight:{value:.25},mieScaleHeight:{value:.08},mieG:{value:.76},exposure:{value:1.15}},this.uniforms.planetInvRot.value.identity()}update(e){var n,s;const t=((s=(n=this.sceneGroup)==null?void 0:n.scale)==null?void 0:s.x)||1;this.uniforms.planetInvScale.value=1/t}setWeather(e,t=.9){this.uniforms.weatherMap||(this.uniforms.weatherMap={value:this.defaultWeatherTexture}),this.uniforms.rainHaze||(this.uniforms.rainHaze={value:.9}),this.uniforms.weatherMap.value=e||this.defaultWeatherTexture,this.uniforms.rainHaze.value=t}updateVisuals(e,t,n,s,r){var g,v;if(!e.atmosphereEnabled){this.mesh&&(this.mesh.visible=!1);return}const a=Math.max(.05,e.atmosphere),o=e.atmosphereHeight,l=e.atmosphereAlpha,c=e.atmosphereColor,u=t+o+Math.max(.05,a)*s;this.uniforms.alpha.value=l,this.uniforms.glowColor.value=new xe(c),this.uniforms.sunDir.value.copy(r).normalize(),this.uniforms.innerRadius.value=t,this.uniforms.outerRadius.value=u;const h=Math.max(2,Math.min(6,Math.floor(n/24))),f=new Ii(u,h),m=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:en,blending:qa,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                varying vec3 vWorld;
                void main() {
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorld = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
            uniform float alpha;
            uniform float density;
            uniform vec3 glowColor;
            uniform vec3 sunDir;
            uniform sampler2D weatherMap;
            uniform float rainHaze;
            uniform mat3 planetInvRot;
            uniform float planetInvScale;
            uniform float innerRadius;
            uniform float outerRadius;
            uniform float rayleighScaleHeight;
                uniform float mieScaleHeight;
                uniform float mieG;
                uniform float exposure;
                varying vec3 vWorld;

                vec2 raySphere(vec3 ro, vec3 rd, float r) {
                    float b = dot(ro, rd);
                    float c = dot(ro, ro) - r * r;
                    float h = b * b - c;
                    if (h < 0.0) return vec2(1e9, -1e9);
                    h = sqrt(h);
                    return vec2(-b - h, -b + h);
                }

                float phaseRayleigh(float mu) {
                    return 3.0 / (16.0 * PI) * (1.0 + mu * mu);
                }

                float phaseMie(float mu, float g) {
                    float g2 = g * g;
                    float denom = pow(max(1.0 + g2 - 2.0 * g * mu, 1e-4), 1.5);
                    return (1.0 - g2) / (4.0 * PI * denom);
                }

                vec3 exp3(vec3 v) {
                    return vec3(exp(-v.x), exp(-v.y), exp(-v.z));
                }

                void main() {
                    #include <logdepthbuf_fragment>

                vec3 ro = planetInvRot * (cameraPosition * planetInvScale);
                vec3 p1 = planetInvRot * (vWorld * planetInvScale);
                vec3 rd = normalize(p1 - ro);
                float tFrag = length(p1 - ro);

                vec3 sunLocal = normalize(planetInvRot * sunDir);
                vec3 viewDirLocal = normalize(p1);
                float wu = atan(viewDirLocal.z, viewDirLocal.x) / (2.0 * PI) + 0.5;
                float wv = asin(clamp(viewDirLocal.y, -1.0, 1.0)) / PI + 0.5;
                float rainDir = texture2D(weatherMap, vec2(wu, wv)).g;

                vec2 tOuter = raySphere(ro, rd, outerRadius);
                float tStart = max(tOuter.x, 0.0);
                float tEnd = min(tOuter.y, tFrag);
                if (tEnd <= tStart) discard;

                    vec2 tInner = raySphere(ro, rd, innerRadius);
                    if (tInner.x > 0.0) {
                        tEnd = min(tEnd, tInner.x);
                    }
                    if (tEnd <= tStart) discard;

                float atmoH = max(outerRadius - innerRadius, 1e-3);
                float HR = max(atmoH * rayleighScaleHeight, 1e-4);
                float HM = max(atmoH * mieScaleHeight, 1e-4);
                float rainM = clamp(rainDir * rainHaze, 0.0, 2.0);
                HM = max(HM / (1.0 + rainM * 0.9), 1e-4); // concentrate haze near ground

                vec3 betaR = vec3(5.8e-3, 13.5e-3, 33.1e-3);
                betaR *= mix(vec3(0.75), glowColor, 0.85);

                betaR *= density;
                float betaM = 21e-3 * density;
                betaM *= (1.0 + rainM * 1.35);

                    const int PRIMARY_STEPS = 8;
                    const int LIGHT_STEPS = 4;

                    float segLen = (tEnd - tStart) / float(PRIMARY_STEPS);
                    float optR = 0.0;
                    float optM = 0.0;
                    vec3 sumR = vec3(0.0);
                    vec3 sumM = vec3(0.0);

                    for (int i = 0; i < PRIMARY_STEPS; i++) {
                        float t = tStart + (float(i) + 0.5) * segLen;
                        vec3 pos = ro + rd * t;
                        float height = max(length(pos) - innerRadius, 0.0);
                        float dR = exp(-height / HR);
                        float dM = exp(-height / HM);

                        optR += dR * segLen;
                        optM += dM * segLen;

                        vec2 tSunOuter = raySphere(pos, sunLocal, outerRadius);
                        float tSunEnd = tSunOuter.y;
                        if (tSunEnd <= 0.0) continue;

                        vec2 tSunInner = raySphere(pos, sunLocal, innerRadius);
                        float shadow = 1.0;
                        if (tSunInner.x > 0.0 && tSunInner.x < tSunEnd) {
                            shadow = 0.0;
                        }

                        float segL = tSunEnd / float(LIGHT_STEPS);
                        float optSunR = 0.0;
                        float optSunM = 0.0;
                        for (int j = 0; j < LIGHT_STEPS; j++) {
                            float tl = (float(j) + 0.5) * segL;
                            vec3 pl = pos + sunLocal * tl;
                            float hL = max(length(pl) - innerRadius, 0.0);
                            optSunR += exp(-hL / HR) * segL;
                            optSunM += exp(-hL / HM) * segL;
                        }

                        vec3 tau = betaR * (optR + optSunR) + vec3(betaM * (optM + optSunM));
                        vec3 trans = exp3(tau);
                        trans *= shadow;

                        sumR += trans * dR * segLen;
                        sumM += trans * dM * segLen;
                    }

                    float mu = dot(rd, sunLocal);
                    float pR = phaseRayleigh(mu);
                    float pM = phaseMie(mu, mieG);

                    vec3 radiance = (betaR * sumR * pR + vec3(betaM) * sumM * pM) * 18.0;
                    radiance = vec3(1.0) - exp(-radiance * exposure);
                    radiance *= alpha;

                    float lum = max(radiance.r, max(radiance.g, radiance.b));
                    if (lum < 0.002) discard;

                    gl_FragColor = vec4(radiance, 1.0);
                }
            `});this.mesh&&(this.mesh.geometry.dispose(),(v=(g=this.mesh.material).dispose)==null||v.call(g),this.sceneGroup.remove(this.mesh)),this.mesh=new zt(f,m),this.mesh.renderOrder=1,this.sceneGroup.add(this.mesh)}}class my{constructor(e){this.sceneGroup=e,this.clouds=[]}update(e){const t=Math.min(e,.25);for(const n of this.clouds){const s=n.userData.uniforms,a=n.userData.settings.speed||1;s.windOffset.value+=t*a*.3}}clear(){var e,t;for(const n of this.clouds)this.sceneGroup.remove(n),n.geometry.dispose(),(t=(e=n.material).dispose)==null||t.call(e);this.clouds=[]}rebuild(e,t,n,s,r,a){this.clear();for(const o of a){if(!o.enabled)continue;const l=this.buildCloudMesh(t+s*.2,r,e,t,n,s,o);this.clouds.push(l),this.sceneGroup.add(l)}}buildVolumeCloudMesh(e,t,n,s,r,a,o,l,c){const u=o.mode==="billow"?1:o.mode==="cellular"?2:0,h=s+(r-.5)*a+.05,f=((c==null?void 0:c.planetRadiusM)??Pf)/sn,m=((c==null?void 0:c.atmoThicknessM)??2e4)/Math.max(f,1e-6),g=h,v=Math.max(.25,m*.5),p=Math.max(.1,g-.05),d=p+2*v,_={windOffset:{value:0},color:{value:new xe(o.color)},opacity:{value:o.alpha},sunDir:{value:n.clone().normalize()},windDir:{value:new P(0,0,1)},quantity:{value:o.quantity},noiseScale:{value:Math.max(1,o.resolution)},mode:{value:u},bundleSize:{value:1},rayStepsMin:{value:28},rayStepsMax:{value:48},debugGrid:{value:0},volumeAtlas:{value:l},volumeN:{value:(c==null?void 0:c.n)??64},tilesX:{value:(c==null?void 0:c.tilesX)??8},atlasW:{value:(c==null?void 0:c.atlasW)??512},atlasH:{value:(c==null?void 0:c.atlasH)??512},volumeExtentM:{value:(c==null?void 0:c.extentM)??52e4},metersPerUnit:{value:f},planetInvRot:{value:new Le},planetInvScale:{value:1},innerRadius:{value:p},outerRadius:{value:d}},y=Math.max(2,Math.min(6,Math.floor(t/24))),x=new Ii(d,y),E=new Vt({uniforms:_,transparent:!0,depthWrite:!1,side:An,blending:Wn,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                varying vec3 vWorld;
                void main() {
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorld = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 color;
                uniform float opacity;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
                uniform float bundleSize;
                uniform float rayStepsMin;
                uniform float rayStepsMax;
                uniform float debugGrid;
                uniform sampler2D volumeAtlas;
                uniform float volumeN;
                uniform float tilesX;
                uniform float atlasW;
                uniform float atlasH;
                uniform float volumeExtentM;
                uniform float metersPerUnit;
                uniform mat3 planetInvRot;
                uniform float planetInvScale;
                uniform float innerRadius;
                uniform float outerRadius;
                varying vec3 vWorld;

                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.55;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }

                vec2 sampleVolumeAtlas(vec3 idx) {
                    float tx = mod(idx.z, tilesX);
                    float ty = floor(idx.z / tilesX);
                    float ax = (tx * volumeN + idx.x + 0.5) / atlasW;
                    float ay = (ty * volumeN + idx.y + 0.5) / atlasH;
                    return texture2D(volumeAtlas, vec2(ax, ay)).rg; // cloud, rain
                }

                vec4 sampleVolumeTrilinear(vec3 posLocal) {
                    vec3 posM = posLocal * metersPerUnit;
                    vec3 uvw = clamp(posM / max(volumeExtentM, 1e-3) * 0.5 + vec3(0.5), 0.0, 0.999999);
                    vec3 posGrid = uvw * (volumeN - 1.0);
                    vec3 i0 = floor(posGrid);
                    vec3 f = clamp(posGrid - i0, 0.0, 1.0);
                    vec3 i1 = min(i0 + 1.0, vec3(volumeN - 1.0));
                    vec2 c000 = sampleVolumeAtlas(i0);
                    vec2 c100 = sampleVolumeAtlas(vec3(i1.x, i0.y, i0.z));
                    vec2 c010 = sampleVolumeAtlas(vec3(i0.x, i1.y, i0.z));
                    vec2 c110 = sampleVolumeAtlas(vec3(i1.x, i1.y, i0.z));
                    vec2 c001 = sampleVolumeAtlas(vec3(i0.x, i0.y, i1.z));
                    vec2 c101 = sampleVolumeAtlas(vec3(i1.x, i0.y, i1.z));
                    vec2 c011 = sampleVolumeAtlas(vec3(i0.x, i1.y, i1.z));
                    vec2 c111 = sampleVolumeAtlas(i1);

                    float wx = f.x, wy = f.y, wz = f.z;
                    vec2 cx0 = mix(c000, c100, wx);
                    vec2 cx1 = mix(c010, c110, wx);
                    vec2 cx2 = mix(c001, c101, wx);
                    vec2 cx3 = mix(c011, c111, wx);
                    vec2 cy0 = mix(cx0, cx1, wy);
                    vec2 cy1 = mix(cx2, cx3, wy);
                    vec2 c = mix(cy0, cy1, wz);

                    return vec4(c, 0.0, 0.0);
                }

                float gridEdge(vec3 posLocal) {
                    vec3 posM = posLocal * metersPerUnit;
                    vec3 uvw = clamp(posM / max(volumeExtentM, 1e-3) * 0.5 + vec3(0.5), 0.0, 0.999999);
                    vec3 gridPos = uvw * (volumeN - 1.0);
                    vec3 f = fract(gridPos);
                    vec3 dist = min(f, 1.0 - f);
                    float lineWidth = 0.08;
                    vec3 lines = smoothstep(lineWidth, 0.0, dist);
                    float edge = max(lines.x * lines.y, max(lines.x * lines.z, lines.y * lines.z));
                    return edge;
                }

                vec3 bundledWorld(vec3 world) {
                    float b = max(bundleSize, 1.0);
                    if (b <= 1.0) return world;
                    vec2 offset = mod(gl_FragCoord.xy, b);
                    return world - dFdx(world) * offset.x - dFdy(world) * offset.y;
                }

                float densityAt(vec3 pos, out float rainOut) {
                    float r = length(pos);
                    if (r < innerRadius || r > outerRadius) { rainOut = 0.0; return 0.0; }
                    float h = (r - innerRadius) / max(outerRadius - innerRadius, 1e-3);
                    float profile = smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.55, 1.0, h));

                    vec4 v = sampleVolumeTrilinear(pos);
                    vec4 v2 = sampleVolumeTrilinear(pos + vec3(0.3, -0.2, 0.15) * metersPerUnit * 0.25);
                    vec4 v3 = sampleVolumeTrilinear(pos + vec3(-0.25, 0.18, -0.22) * metersPerUnit * 0.35);
                    vec4 v4 = sampleVolumeTrilinear(pos + vec3(0.12, 0.24, -0.3) * metersPerUnit * 0.2);
                    vec4 vMix = (v + v2 + v3 + v4) * 0.25;

                    float cloud = vMix.r;
                    float rain = vMix.g;
                    rainOut = rain;

                    float cover = cloud * (0.45 + quantity * 1.1);

                    float freq = max(1.0, noiseScale) * 0.003;
                    vec3 advDir = normalize(windDir);
                    vec3 np = pos * freq + advDir * (windOffset * 0.35);
                    float n = fbm(np);
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(n) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(np * 0.9);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(n, c * 2.0 - 1.0, 0.55);
                    }
                    float detail = smoothstep(0.15, 0.75, n + 0.2);
                    float d = cover * profile * detail;
                    d *= mix(1.0, 1.25, rain);
                    return d;
                }

                vec2 raySphere(vec3 ro, vec3 rd, float r) {
                    float b = dot(ro, rd);
                    float c = dot(ro, ro) - r * r;
                    float h = b*b - c;
                    if (h < 0.0) return vec2(1e9, -1e9);
                    h = sqrt(h);
                    return vec2(-b - h, -b + h);
                }

                void main() {
                    #include <logdepthbuf_fragment>

                    vec3 ro = planetInvRot * (cameraPosition * planetInvScale);
                    vec3 world = bundledWorld(vWorld);
                    vec3 p1 = planetInvRot * (world * planetInvScale);
                    vec3 rd = normalize(p1 - ro);

                    vec2 tOuter = raySphere(ro, rd, outerRadius);
                    float tStart = max(tOuter.x, 0.0);
                    float tEnd = tOuter.y;
                    if (tEnd <= tStart) discard;

                    vec2 tInner = raySphere(ro, rd, innerRadius);
                    if (tInner.x <= tInner.y) {
                        if (tInner.x > 0.0) tEnd = min(tEnd, tInner.x);
                        else if (tInner.y > 0.0) tStart = max(tStart, tInner.y);
                    }
                    if (tEnd <= tStart) discard;

                    float minSteps = max(1.0, rayStepsMin);
                    float maxSteps = max(minSteps, rayStepsMax);
                    float tSteps = clamp((volumeN - 32.0) / 96.0, 0.0, 1.0);
                    int steps = int(clamp(mix(minSteps, maxSteps, tSteps), minSteps, maxSteps));
                    float stepSize = (tEnd - tStart) / float(steps);
                    vec3 sum = vec3(0.0);
                    float alpha = 0.0;

                    vec3 sunLocal = normalize(planetInvRot * sunDir);

                    for (int i = 0; i < 256; i++) {
                        if (i >= steps) break;
                        float t = tStart + (float(i) + 0.5) * stepSize;
                        vec3 pos = ro + rd * t;

                        float grid = 0.0;
                        if (debugGrid > 0.5) {
                            grid = gridEdge(pos);
                        }
                        float rainNow = 0.0;
                        float d = densityAt(pos, rainNow);
                        if (d <= 1e-4 && grid <= 1e-4) continue;

                        float day = clamp(dot(normalize(pos), sunLocal), 0.0, 1.0);
                        float light = mix(0.55, 1.15, day);
                        vec3 ccol = mix(color, color * 0.85, rainNow) * light;

                        float a = 1.0 - exp(-d * stepSize * 4.5);
                        float gridA = grid * 0.2;
                        vec3 gridCol = vec3(0.2, 0.9, 1.0);
                        float stepA = max(a, gridA);
                        vec3 stepCol = mix(ccol, gridCol, gridA / max(stepA, 1e-4));
                        sum += (1.0 - alpha) * stepCol * stepA;
                        alpha += (1.0 - alpha) * stepA;
                        if (alpha > 0.985) break;
                    }

                    alpha *= opacity;
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(sum, alpha);
                }
            `}),T=new zt(x,E);return T.userData.uniforms=_,T.userData.settings=o,T.renderOrder=2,T}buildCloudMesh(e,t,n,s,r,a,o){const l=Math.max(.1,e+o.height),c=o.mode==="billow"?1:o.mode==="cellular"?2:0,u={time:{value:0},windOffset:{value:0},color:{value:new xe(o.color)},opacity:{value:o.alpha},sunDir:{value:n.clone().normalize()},windDir:{value:new P(0,0,1)},planetRadius:{value:s},seaLevel:{value:r},heightScale:{value:a},speed:{value:o.speed},quantity:{value:o.quantity},noiseScale:{value:Math.max(.1,o.resolution)},mode:{value:c}};return new Ii(l,Math.max(1,Math.floor(t*.5))),new Vt({uniforms:u,transparent:!0,depthWrite:!1,side:_n,blending:Wn,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float planetRadius;
                uniform float seaLevel;
                uniform float heightScale;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
                varying vec3 vWorld;
                varying vec3 vNormal;
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.5;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }
                void main() {
                    vec3 pos = position;
                    vec3 dir = normalize(pos);
                    float base = fbm(dir * (noiseScale * 0.05) + windDir * windOffset);
                    float n = base;
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(base) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(dir * noiseScale);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(base, c * 2.0 - 1.0, 0.5);
                    }
                    pos += normal * n * 0.35;
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorld = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 color;
                uniform float opacity;
                uniform float time;
                uniform float windOffset;
                uniform vec3 sunDir;
                uniform vec3 windDir;
                uniform float planetRadius;
                uniform float seaLevel;
                uniform float heightScale;
                uniform float quantity;
                uniform float noiseScale;
                uniform float mode;
                varying vec3 vWorld;
                varying vec3 vNormal;
                float hash(vec3 p) {
                    p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
                    p *= 17.0;
                    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
                }
                float noise(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float n000 = hash(i + vec3(0,0,0));
                    float n100 = hash(i + vec3(1,0,0));
                    float n010 = hash(i + vec3(0,1,0));
                    float n110 = hash(i + vec3(1,1,0));
                    float n001 = hash(i + vec3(0,0,1));
                    float n101 = hash(i + vec3(1,0,1));
                    float n011 = hash(i + vec3(0,1,1));
                    float n111 = hash(i + vec3(1,1,1));
                    float nx00 = mix(n000, n100, f.x);
                    float nx10 = mix(n010, n110, f.x);
                    float nx01 = mix(n001, n101, f.x);
                    float nx11 = mix(n011, n111, f.x);
                    float nxy0 = mix(nx00, nx10, f.y);
                    float nxy1 = mix(nx01, nx11, f.y);
                    return mix(nxy0, nxy1, f.z);
                }
                float fbm(vec3 p) {
                    float sum = 0.0;
                    float amp = 0.5;
                    for(int i=0;i<4;i++){
                        sum += noise(p) * amp;
                        p *= 2.1;
                        amp *= 0.5;
                    }
                    return sum;
                }
                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 dir = normalize(vWorld);
                    float day = clamp(dot(dir, normalize(sunDir)), 0.0, 1.0);
                    float lat = 1.0 - abs(dir.y);
                    float base = fbm(dir * (noiseScale * 0.02 + 0.6) + windDir * windOffset + vec3(0.0, windOffset * 0.07, 0.0));
                    float n = base;
                    if (mode > 0.5 && mode < 1.5) {
                        n = abs(base) * 2.0 - 1.0;
                    } else if (mode > 1.5) {
                        vec3 q = floor(dir * noiseScale);
                        float c = fract(sin(dot(q, vec3(12.9898,78.233,45.164))) * 43758.5453);
                        n = mix(base, c * 2.0 - 1.0, 0.5);
                    }
                    float coverage = n + lat * 0.2 + day * 0.25;
                    coverage += (quantity - 0.5) * 0.8;
                    float alpha = smoothstep(0.48, 0.68, coverage) * opacity;
                    if(alpha < 0.01) discard;
                    vec3 viewDir = normalize(cameraPosition - vWorld);
                    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
                    gl_FragColor = vec4(color * (0.8 + fresnel * 0.4), alpha);
                }
            `}),mesh}}const gy=256,vy=128;function xy(i,e,t,n={}){const s=new Xn(i,e,t,bt,Dt);return s.needsUpdate=!0,s.wrapS=n.wrapS??yn,s.wrapT=n.wrapT??pt,s.minFilter=n.minFilter??it,s.magFilter=n.magFilter??it,s.generateMipmaps=!1,s.colorSpace=Ft,s}class Gc{constructor({gridWidth:e=gy,gridHeight:t=vy}={}){this.gridW=Math.max(32,Math.min(512,Math.round(e))),this.gridH=Math.max(16,Math.min(256,Math.round(t))),this.cellCount=this.gridW*this.gridH,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.bindGroupLayout=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(16),this.heightBuffers=null,this.prevHeightBuffer=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.ping=0,this.viscosity=.985,this.waveSpeed=2,this.mousePos=new _e(-999,-999),this.mouseSpeed=new _e(0,0),this.mouseSize=.08,this.mouseDeep=.3,this.windStrength=.5,this.windDirection=new _e(.7,.3).normalize(),this.timeS=0,this.readbackIntervalS=.033,this.readbackTimerS=0,this.textureData=new Uint8Array(this.cellCount*4),this.oceanTexture=xy(this.textureData,this.gridW,this.gridH)}static async create(e={}){const{device:t,...n}=e,s=new Gc(n);return await s.init({device:t}),s}setConfig({viscosity:e,waveSpeed:t,mouseSize:n,mouseDeep:s,windStrength:r,windDirectionX:a,windDirectionY:o,readbackIntervalS:l}={}){Number.isFinite(e)&&(this.viscosity=Math.max(.9,Math.min(.999,e))),Number.isFinite(t)&&(this.waveSpeed=Math.max(.1,Math.min(10,t))),Number.isFinite(n)&&(this.mouseSize=Math.max(.01,Math.min(.5,n))),Number.isFinite(s)&&(this.mouseDeep=Math.max(0,Math.min(2,s))),Number.isFinite(r)&&(this.windStrength=Math.max(0,Math.min(2,r))),Number.isFinite(a)&&Number.isFinite(o)&&this.windDirection.set(a,o).normalize(),Number.isFinite(l)&&(this.readbackIntervalS=Math.max(.01,l))}getTexture(){return this.oceanTexture}setMouseInteraction(e,t,n,s){this.mousePos.set(e,t),this.mouseSpeed.set(n,s)}clearMouseInteraction(){this.mousePos.set(-999,-999),this.mouseSpeed.set(0,0)}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[OceanComputeSystem] WebGPU not available; compute ocean disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[OceanComputeSystem] No GPU adapter found; compute ocean disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,n=this.cellCount*4,s=this.cellCount*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.heightBuffers=[t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.prevHeightBuffer=t.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]});const r=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),a=t.createShaderModule({code:this._wgslOcean()});this.pipelineSim=t.createComputePipeline({layout:r,compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[0]}},{binding:2,resource:{buffer:this.heightBuffers[1]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]}),t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[1]}},{binding:2,resource:{buffer:this.heightBuffers[0]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]})],this._resetState(),this.ready=!0}_resetState(){const e=new Float32Array(this.cellCount);for(let t=0;t<this.cellCount;t++)e[t]=(Math.random()-.5)*.001;this.device.queue.writeBuffer(this.heightBuffers[0],0,e),this.device.queue.writeBuffer(this.heightBuffers[1],0,e),this.device.queue.writeBuffer(this.prevHeightBuffer,0,e),this.ping=0,this.timeS=0}update(e,t={}){if(!this.enabled||!this.ready)return;const n=Math.min(Math.max(e??0,0),.1);this.timeS+=n,this.readbackTimerS+=n,this._writeUniforms(n);const s=this.device,r=s.createCommandEncoder(),a=r.beginComputePass();a.setPipeline(this.pipelineSim),a.setBindGroup(0,this.bindGroups[this.ping]),a.dispatchWorkgroups(Math.ceil(this.gridW/8),Math.ceil(this.gridH/8)),a.end(),this.ping=1-this.ping;let o=null;if(!!t.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const c=this.readbackWriteIndex&1;this.readbackInFlight[c]||(r.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[c],0,this.cellCount*4),o=c,this.readbackWriteIndex++,this.readbackTimerS=0)}s.queue.submit([r.finish()]),o!==null&&this._scheduleReadback(o)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const n=t.getMappedRange(),s=new Uint8Array(n);this.textureData.set(s),t.unmap(),this.oceanTexture.needsUpdate=!0}).catch(n=>{console.warn("[OceanComputeSystem] Readback failed",n)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e){const t=this.uniformData;t[0]=this.gridW,t[1]=this.gridH,t[2]=e,t[3]=this.timeS,t[4]=this.viscosity,t[5]=this.waveSpeed,t[6]=this.mouseSize,t[7]=this.mouseDeep,t[8]=this.mousePos.x,t[9]=this.mousePos.y,t[10]=this.mouseSpeed.x,t[11]=this.mouseSpeed.y,t[12]=this.windStrength,t[13]=this.windDirection.x,t[14]=this.windDirection.y,t[15]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,t)}_wgslOcean(){return`
@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 4>;
@group(0) @binding(1) var<storage, read> heightSrc: array<f32>;
@group(0) @binding(2) var<storage, read_write> heightDst: array<f32>;
@group(0) @binding(3) var<storage, read_write> prevHeight: array<f32>;
@group(0) @binding(4) var<storage, read_write> outPixels: array<u32>;

fn gridW() -> u32 { return u32(params[0].x + 0.5); }
fn gridH() -> u32 { return u32(params[0].y + 0.5); }
fn dt() -> f32 { return params[0].z; }
fn time() -> f32 { return params[0].w; }

fn viscosity() -> f32 { return params[1].x; }
fn waveSpeed() -> f32 { return params[1].y; }
fn mouseSize() -> f32 { return params[1].z; }
fn mouseDeep() -> f32 { return params[1].w; }

fn mousePos() -> vec2<f32> { return params[2].xy; }
fn mouseSpd() -> vec2<f32> { return params[2].zw; }

fn windStrength() -> f32 { return params[3].x; }
fn windDir() -> vec2<f32> { return params[3].yz; }

fn idx(x: u32, y: u32) -> u32 {
    return y * gridW() + x;
}

fn wrapX(x: i32) -> u32 {
    let w = i32(gridW());
    return u32((x % w + w) % w);
}

fn clampY(y: i32) -> u32 {
    return u32(clamp(y, 0, i32(gridH()) - 1));
}

fn hash(p: vec2<f32>) -> f32 {
    return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    let a = hash(i);
    let b = hash(i + vec2<f32>(1.0, 0.0));
    let c = hash(i + vec2<f32>(0.0, 1.0));
    let d = hash(i + vec2<f32>(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2<f32>) -> f32 {
    var s = 0.0;
    var amp = 0.5;
    var freq = 1.0;
    for (var i = 0; i < 4; i++) {
        s += noise(p * freq) * amp;
        freq *= 2.1;
        amp *= 0.5;
    }
    return s;
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
    let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
    let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
    let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
    let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
    return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
    let w = gridW();
    let h = gridH();
    if (gid.x >= w || gid.y >= h) { return; }

    let i = idx(gid.x, gid.y);
    let x = i32(gid.x);
    let y = i32(gid.y);

    // Get neighbor heights (wrap X for longitude, clamp Y for latitude)
    let xL = wrapX(x - 1);
    let xR = wrapX(x + 1);
    let yD = clampY(y - 1);
    let yU = clampY(y + 1);

    let hC = heightSrc[i];
    let hL = heightSrc[idx(xL, gid.y)];
    let hR = heightSrc[idx(xR, gid.y)];
    let hD = heightSrc[idx(gid.x, yD)];
    let hU = heightSrc[idx(gid.x, yU)];

    let hPrev = prevHeight[i];

    // Wave equation: new height based on neighbors and velocity
    // h_new = viscosity * (avg_neighbors * 2 - prev_height)
    let neighborAvg = (hL + hR + hD + hU) * 0.5;
    var hNew = viscosity() * (neighborAvg - hPrev);

    // Mouse interaction
    let uv = vec2<f32>(f32(gid.x) / f32(w), f32(gid.y) / f32(h));
    let mPos = mousePos();
    if (mPos.x >= 0.0 && mPos.x <= 1.0 && mPos.y >= 0.0 && mPos.y <= 1.0) {
        let dist = length(uv - mPos);
        let mousePhase = clamp(dist * 3.14159265 / mouseSize(), 0.0, 3.14159265);
        let mouseInfluence = (cos(mousePhase) + 1.0) * 0.5 * mouseDeep() * length(mouseSpd());
        hNew -= mouseInfluence * 0.05;
    }

    // Wind-driven ambient waves using FBM noise + Ekman deflection by latitude
    let lat = (uv.y - 0.5) * 3.14159265;
    let hemisphere = select(-1.0, 1.0, lat >= 0.0);
    let angle = 0.785398 * hemisphere;
    let dir = normalize(windDir());
    let c = cos(angle);
    let s = sin(angle);
    let ekmanDir = vec2(dir.x * c - dir.y * s, dir.x * s + dir.y * c);
    let windUV = uv * 8.0 + ekmanDir * time() * 0.5;
    let windWave = (fbm(windUV) - 0.5) * windStrength() * 0.012;
    hNew += windWave;

    // Small random perturbation to keep water "alive"
    let jitter = (hash(uv * 1000.0 + time() * 0.1) - 0.5) * 0.0002;
    hNew += jitter;

    // Clamp height
    hNew = clamp(hNew, -0.2, 0.2);

    // Store previous height and new height
    prevHeight[i] = hC;
    heightDst[i] = hNew;

    // Calculate normals from height gradient
    let dhdx = (hR - hL) * f32(w) * 0.5;
    let dhdy = (hU - hD) * f32(h) * 0.5;

    // Pack output: height01, normalX01, normalY01, foam
    let height01 = clamp(hNew * 2.5 + 0.5, 0.0, 1.0);
    let normalX01 = clamp(dhdx * 5.0 + 0.5, 0.0, 1.0);
    let normalY01 = clamp(dhdy * 5.0 + 0.5, 0.0, 1.0);
    
    // Foam based on wave steepness
    let steepness = sqrt(dhdx * dhdx + dhdy * dhdy);
    let foam = clamp(steepness * 8.0, 0.0, 1.0);

    outPixels[i] = packRGBA8(height01, normalX01, normalY01, foam);
}
        `}dispose(){var e,t,n,s;this.heightBuffers&&this.heightBuffers.forEach(r=>r==null?void 0:r.destroy()),(e=this.prevHeightBuffer)==null||e.destroy(),(t=this.outputBuffer)==null||t.destroy(),(n=this.readbackBuffers)==null||n.forEach(r=>r==null?void 0:r.destroy()),(s=this.uniformBuffer)==null||s.destroy(),this.device=null,this.enabled=!1,this.ready=!1}}function _y(i,e){if(i===e)return!0;if(i.byteLength!==e.byteLength)return!1;for(let t=0;t<i.byteLength;t++)if(i[t]!==e[t])return!1;return!0}function Wc(i){if(i instanceof Uint8Array&&i.constructor.name==="Uint8Array")return i;if(i instanceof ArrayBuffer)return new Uint8Array(i);if(ArrayBuffer.isView(i))return new Uint8Array(i.buffer,i.byteOffset,i.byteLength);throw new Error("Unknown type, must be binary type")}function yy(i){return new TextEncoder().encode(i)}function Sy(i){return new TextDecoder().decode(i)}function My(i,e){if(i.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),n=0;n<t.length;n++)t[n]=255;for(var s=0;s<i.length;s++){var r=i.charAt(s),a=r.charCodeAt(0);if(t[a]!==255)throw new TypeError(r+" is ambiguous");t[a]=s}var o=i.length,l=i.charAt(0),c=Math.log(o)/Math.log(256),u=Math.log(256)/Math.log(o);function h(g){if(g instanceof Uint8Array||(ArrayBuffer.isView(g)?g=new Uint8Array(g.buffer,g.byteOffset,g.byteLength):Array.isArray(g)&&(g=Uint8Array.from(g))),!(g instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(g.length===0)return"";for(var v=0,p=0,d=0,_=g.length;d!==_&&g[d]===0;)d++,v++;for(var y=(_-d)*u+1>>>0,x=new Uint8Array(y);d!==_;){for(var E=g[d],T=0,A=y-1;(E!==0||T<p)&&A!==-1;A--,T++)E+=256*x[A]>>>0,x[A]=E%o>>>0,E=E/o>>>0;if(E!==0)throw new Error("Non-zero carry");p=T,d++}for(var R=y-p;R!==y&&x[R]===0;)R++;for(var M=l.repeat(v);R<y;++R)M+=i.charAt(x[R]);return M}function f(g){if(typeof g!="string")throw new TypeError("Expected String");if(g.length===0)return new Uint8Array;var v=0;if(g[v]!==" "){for(var p=0,d=0;g[v]===l;)p++,v++;for(var _=(g.length-v)*c+1>>>0,y=new Uint8Array(_);g[v];){var x=t[g.charCodeAt(v)];if(x===255)return;for(var E=0,T=_-1;(x!==0||E<d)&&T!==-1;T--,E++)x+=o*y[T]>>>0,y[T]=x%256>>>0,x=x/256>>>0;if(x!==0)throw new Error("Non-zero carry");d=E,v++}if(g[v]!==" "){for(var A=_-d;A!==_&&y[A]===0;)A++;for(var R=new Uint8Array(p+(_-A)),M=p;A!==_;)R[M++]=y[A++];return R}}}function m(g){var v=f(g);if(v)return v;throw new Error(`Non-${e} character`)}return{encode:h,decodeUnsafe:f,decode:m}}var by=My,wy=by;class Ey{constructor(e,t,n){Me(this,"name");Me(this,"prefix");Me(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class Ty{constructor(e,t,n){Me(this,"name");Me(this,"prefix");Me(this,"baseDecode");Me(this,"prefixCodePoint");this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Df(this,e)}}class Ay{constructor(e){Me(this,"decoders");this.decoders=e}or(e){return Df(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Df(i,e){return new Ay({...i.decoders??{[i.prefix]:i},...e.decoders??{[e.prefix]:e}})}class Cy{constructor(e,t,n,s){Me(this,"name");Me(this,"prefix");Me(this,"baseEncode");Me(this,"baseDecode");Me(this,"encoder");Me(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new Ey(e,t,n),this.decoder=new Ty(e,t,s)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function yo({name:i,prefix:e,encode:t,decode:n}){return new Cy(i,e,t,n)}function Gr({name:i,prefix:e,alphabet:t}){const{encode:n,decode:s}=wy(t,i);return yo({prefix:e,name:i,encode:n,decode:r=>Wc(s(r))})}function Ry(i,e,t,n){let s=i.length;for(;i[s-1]==="=";)--s;const r=new Uint8Array(s*t/8|0);let a=0,o=0,l=0;for(let c=0;c<s;++c){const u=e[i[c]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);o=o<<t|u,a+=t,a>=8&&(a-=8,r[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return r}function Py(i,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let r="",a=0,o=0;for(let l=0;l<i.length;++l)for(o=o<<8|i[l],a+=8;a>t;)a-=t,r+=e[s&o>>a];if(a!==0&&(r+=e[s&o<<t-a]),n)for(;(r.length*t&7)!==0;)r+="=";return r}function Dy(i){const e={};for(let t=0;t<i.length;++t)e[i[t]]=t;return e}function Ht({name:i,prefix:e,bitsPerChar:t,alphabet:n}){const s=Dy(n);return yo({prefix:e,name:i,encode(r){return Py(r,n,t)},decode(r){return Ry(r,s,t,i)}})}const ei=Gr({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Ly=Gr({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Iy=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ei,base58flickr:Ly},Symbol.toStringTag,{value:"Module"})),Os=Ht({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Uy=Ht({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Fy=Ht({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),Ny=Ht({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),By=Ht({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Oy=Ht({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),zy=Ht({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ky=Ht({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),Vy=Ht({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Hy=Object.freeze(Object.defineProperty({__proto__:null,base32:Os,base32hex:By,base32hexpad:zy,base32hexpadupper:ky,base32hexupper:Oy,base32pad:Fy,base32padupper:Ny,base32upper:Uy,base32z:Vy},Symbol.toStringTag,{value:"Module"})),Oa=Gr({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Gy=Gr({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),Wy=Object.freeze(Object.defineProperty({__proto__:null,base36:Oa,base36upper:Gy},Symbol.toStringTag,{value:"Module"}));var Xy=Lf,Lh=128,qy=-128,Yy=Math.pow(2,31);function Lf(i,e,t){e=e||[],t=t||0;for(var n=t;i>=Yy;)e[t++]=i&255|Lh,i/=128;for(;i&qy;)e[t++]=i&255|Lh,i>>>=7;return e[t]=i|0,Lf.bytes=t-n+1,e}var jy=uc,Ky=128,Ih=127;function uc(i,n){var t=0,n=n||0,s=0,r=n,a,o=i.length;do{if(r>=o)throw uc.bytes=0,new RangeError("Could not decode varint");a=i[r++],t+=s<28?(a&Ih)<<s:(a&Ih)*Math.pow(2,s),s+=7}while(a>=Ky);return uc.bytes=r-n,t}var $y=Math.pow(2,7),Zy=Math.pow(2,14),Qy=Math.pow(2,21),Jy=Math.pow(2,28),eS=Math.pow(2,35),tS=Math.pow(2,42),nS=Math.pow(2,49),iS=Math.pow(2,56),sS=Math.pow(2,63),rS=function(i){return i<$y?1:i<Zy?2:i<Qy?3:i<Jy?4:i<eS?5:i<tS?6:i<nS?7:i<iS?8:i<sS?9:10},aS={encode:Xy,decode:jy,encodingLength:rS},no=aS;function hc(i,e=0){return[no.decode(i,e),no.decode.bytes]}function io(i,e,t=0){return no.encode(i,e,t),e}function so(i){return no.encodingLength(i)}function oS(i,e){const t=e.byteLength,n=so(i),s=n+so(t),r=new Uint8Array(s+t);return io(i,r,0),io(t,r,n),r.set(e,s),new Xc(i,t,e,r)}function lS(i){const e=Wc(i),[t,n]=hc(e),[s,r]=hc(e.subarray(n)),a=e.subarray(n+r);if(a.byteLength!==s)throw new Error("Incorrect length");return new Xc(t,s,a,e)}function cS(i,e){if(i===e)return!0;{const t=e;return i.code===t.code&&i.size===t.size&&t.bytes instanceof Uint8Array&&_y(i.bytes,t.bytes)}}class Xc{constructor(e,t,n,s){Me(this,"code");Me(this,"size");Me(this,"digest");Me(this,"bytes");this.code=e,this.size=t,this.digest=n,this.bytes=s}}function Uh(i,e){const{bytes:t,version:n}=i;switch(n){case 0:return hS(t,dc(i),e??ei.encoder);default:return dS(t,dc(i),e??Os.encoder)}}const Fh=new WeakMap;function dc(i){const e=Fh.get(i);if(e==null){const t=new Map;return Fh.set(i,t),t}return e}var Gd;class Ot{constructor(e,t,n,s){Me(this,"code");Me(this,"version");Me(this,"multihash");Me(this,"bytes");Me(this,"/");Me(this,Gd,"CID");this.code=t,this.version=e,this.multihash=n,this.bytes=s,this["/"]=s}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==fr)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==fS)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return Ot.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=oS(e,t);return Ot.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return Ot.equals(this,e)}static equals(e,t){const n=t;return n!=null&&e.code===n.code&&e.version===n.version&&cS(e.multihash,n.multihash)}toString(e){return Uh(this,e)}toJSON(){return{"/":Uh(this)}}link(){return this}[(Gd=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ot)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:n,code:s,multihash:r,bytes:a}=t;return new Ot(n,s,r,a??Nh(n,s,r.bytes))}else if(t[pS]===!0){const{version:n,multihash:s,code:r}=t,a=lS(s);return Ot.create(n,r,a)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==fr)throw new Error(`Version 0 CID must use dag-pb (code: ${fr}) block encoding`);return new Ot(e,t,n,n.bytes)}case 1:{const s=Nh(e,t,n.bytes);return new Ot(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ot.create(0,fr,e)}static createV1(e,t){return Ot.create(1,e,t)}static decode(e){const[t,n]=Ot.decodeFirst(e);if(n.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ot.inspectBytes(e),n=t.size-t.multihashSize,s=Wc(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const r=s.subarray(t.multihashSize-t.digestSize),a=new Xc(t.multihashCode,t.digestSize,r,s);return[t.version===0?Ot.createV0(a):Ot.createV1(t.codec,a),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,f]=hc(e.subarray(t));return t+=f,h};let s=n(),r=fr;if(s===18?(s=0,t=0):r=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const a=t,o=n(),l=n(),c=t+l,u=c-a;return{version:s,codec:r,multihashCode:o,digestSize:l,multihashSize:u,size:c}}static parse(e,t){const[n,s]=uS(e,t),r=Ot.decode(s);if(r.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return dc(r).set(n,e),r}}function uS(i,e){switch(i[0]){case"Q":{const t=e??ei;return[ei.prefix,t.decode(`${ei.prefix}${i}`)]}case ei.prefix:{const t=e??ei;return[ei.prefix,t.decode(i)]}case Os.prefix:{const t=e??Os;return[Os.prefix,t.decode(i)]}case Oa.prefix:{const t=e??Oa;return[Oa.prefix,t.decode(i)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[i[0],e.decode(i)]}}}function hS(i,e,t){const{prefix:n}=t;if(n!==ei.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const r=t.encode(i).slice(1);return e.set(n,r),r}else return s}function dS(i,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const r=t.encode(i);return e.set(n,r),r}else return s}const fr=112,fS=18;function Nh(i,e,t){const n=so(i),s=n+so(e),r=new Uint8Array(s+t.byteLength);return io(i,r,0),io(e,r,n),r.set(t,s),r}const pS=Symbol.for("@ipld/js-cid/CID");function fc(i=0){return new Uint8Array(i)}function Fr(i=0){return new Uint8Array(i)}function If(i,e){e==null&&(e=i.reduce((s,r)=>s+r.length,0));const t=Fr(e);let n=0;for(const s of i)t.set(s,n),n+=s.length;return t}const mS=Gr({prefix:"9",name:"base10",alphabet:"0123456789"}),gS=Object.freeze(Object.defineProperty({__proto__:null,base10:mS},Symbol.toStringTag,{value:"Module"})),vS=Ht({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),xS=Ht({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),_S=Object.freeze(Object.defineProperty({__proto__:null,base16:vS,base16upper:xS},Symbol.toStringTag,{value:"Module"})),yS=Ht({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),SS=Object.freeze(Object.defineProperty({__proto__:null,base2:yS},Symbol.toStringTag,{value:"Module"})),Uf=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),MS=Uf.reduce((i,e,t)=>(i[t]=e,i),[]),bS=Uf.reduce((i,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return i[n]=t,i},[]);function wS(i){return i.reduce((e,t)=>(e+=MS[t],e),"")}function ES(i){const e=[];for(const t of i){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=bS[n];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const TS=yo({prefix:"🚀",name:"base256emoji",encode:wS,decode:ES}),AS=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:TS},Symbol.toStringTag,{value:"Module"})),CS=Ht({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),RS=Ht({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Ff=Ht({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),PS=Ht({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),DS=Object.freeze(Object.defineProperty({__proto__:null,base64:CS,base64pad:RS,base64url:Ff,base64urlpad:PS},Symbol.toStringTag,{value:"Module"})),LS=Ht({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),IS=Object.freeze(Object.defineProperty({__proto__:null,base8:LS},Symbol.toStringTag,{value:"Module"})),US=yo({prefix:"\0",name:"identity",encode:i=>Sy(i),decode:i=>yy(i)}),FS=Object.freeze(Object.defineProperty({__proto__:null,identity:US},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const pc={...FS,...SS,...IS,...gS,..._S,...Hy,...Wy,...Iy,...DS,...AS};function Nf(i,e,t,n){return{name:i,prefix:e,encoder:{name:i,prefix:e,encode:t},decoder:{decode:n}}}const Bh=Nf("utf8","u",i=>"u"+new TextDecoder("utf8").decode(i),i=>new TextEncoder().encode(i.substring(1))),al=Nf("ascii","a",i=>{let e="a";for(let t=0;t<i.length;t++)e+=String.fromCharCode(i[t]);return e},i=>{i=i.substring(1);const e=Fr(i.length);for(let t=0;t<i.length;t++)e[t]=i.charCodeAt(t);return e}),Bf={utf8:Bh,"utf-8":Bh,hex:pc.base16,latin1:al,ascii:al,binary:al,...pc};function qc(i,e="utf8"){const t=Bf[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${i}`)}function ro(i,e="utf8"){const t=Bf[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(i).substring(1)}const NS=Math.pow(2,7),BS=Math.pow(2,14),OS=Math.pow(2,21),Of=Math.pow(2,28),zf=Math.pow(2,35),kf=Math.pow(2,42),Vf=Math.pow(2,49),Qt=128,gi=127;function Yc(i){if(i<NS)return 1;if(i<BS)return 2;if(i<OS)return 3;if(i<Of)return 4;if(i<zf)return 5;if(i<kf)return 6;if(i<Vf)return 7;if(Number.MAX_SAFE_INTEGER!=null&&i>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function zS(i,e,t=0){switch(Yc(i)){case 8:e[t++]=i&255|Qt,i/=128;case 7:e[t++]=i&255|Qt,i/=128;case 6:e[t++]=i&255|Qt,i/=128;case 5:e[t++]=i&255|Qt,i/=128;case 4:e[t++]=i&255|Qt,i>>>=7;case 3:e[t++]=i&255|Qt,i>>>=7;case 2:e[t++]=i&255|Qt,i>>>=7;case 1:{e[t++]=i&255,i>>>=7;break}default:throw new Error("unreachable")}return e}function kS(i,e){let t=i[e],n=0;if(n+=t&gi,t<Qt||(t=i[e+1],n+=(t&gi)<<7,t<Qt)||(t=i[e+2],n+=(t&gi)<<14,t<Qt)||(t=i[e+3],n+=(t&gi)<<21,t<Qt)||(t=i[e+4],n+=(t&gi)*Of,t<Qt)||(t=i[e+5],n+=(t&gi)*zf,t<Qt)||(t=i[e+6],n+=(t&gi)*kf,t<Qt)||(t=i[e+7],n+=(t&gi)*Vf,t<Qt))return n;throw new RangeError("Could not decode varint")}const jc=new Float32Array([-0]),yi=new Uint8Array(jc.buffer);function VS(i,e,t){jc[0]=i,e[t]=yi[0],e[t+1]=yi[1],e[t+2]=yi[2],e[t+3]=yi[3]}function HS(i,e){return yi[0]=i[e],yi[1]=i[e+1],yi[2]=i[e+2],yi[3]=i[e+3],jc[0]}const Kc=new Float64Array([-0]),qt=new Uint8Array(Kc.buffer);function GS(i,e,t){Kc[0]=i,e[t]=qt[0],e[t+1]=qt[1],e[t+2]=qt[2],e[t+3]=qt[3],e[t+4]=qt[4],e[t+5]=qt[5],e[t+6]=qt[6],e[t+7]=qt[7]}function WS(i,e){return qt[0]=i[e],qt[1]=i[e+1],qt[2]=i[e+2],qt[3]=i[e+3],qt[4]=i[e+4],qt[5]=i[e+5],qt[6]=i[e+6],qt[7]=i[e+7],Kc[0]}const XS=BigInt(Number.MAX_SAFE_INTEGER),qS=BigInt(Number.MIN_SAFE_INTEGER);class Yt{constructor(e,t){Me(this,"lo");Me(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===0n)return Ki;if(e<XS&&e>qS)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>Oh&&(s=0n,++n>Oh&&(n=0n))),new Yt(Number(s),Number(n))}static fromNumber(e){if(e===0)return Ki;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&(n=0,++s>4294967295&&(s=0))),new Yt(n,s)}static from(e){return typeof e=="number"?Yt.fromNumber(e):typeof e=="bigint"?Yt.fromBigInt(e):typeof e=="string"?Yt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Yt(e.low>>>0,e.high>>>0):Ki}}const Ki=new Yt(0,0);Ki.toBigInt=function(){return 0n};Ki.zzEncode=Ki.zzDecode=function(){return this};Ki.length=function(){return 1};const Oh=4294967296n;function YS(i){let e=0,t=0;for(let n=0;n<i.length;++n)t=i.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(i.charCodeAt(n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function jS(i,e,t){if(t-e<1)return"";let s;const r=[];let a=0,o;for(;e<t;)o=i[e++],o<128?r[a++]=o:o>191&&o<224?r[a++]=(o&31)<<6|i[e++]&63:o>239&&o<365?(o=((o&7)<<18|(i[e++]&63)<<12|(i[e++]&63)<<6|i[e++]&63)-65536,r[a++]=55296+(o>>10),r[a++]=56320+(o&1023)):r[a++]=(o&15)<<12|(i[e++]&63)<<6|i[e++]&63,a>8191&&((s??(s=[])).push(String.fromCharCode.apply(String,r)),a=0);return s!=null?(a>0&&s.push(String.fromCharCode.apply(String,r.slice(0,a))),s.join("")):String.fromCharCode.apply(String,r.slice(0,a))}function Hf(i,e,t){const n=t;let s,r;for(let a=0;a<i.length;++a)s=i.charCodeAt(a),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((r=i.charCodeAt(a+1))&64512)===56320?(s=65536+((s&1023)<<10)+(r&1023),++a,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Fn(i,e){return RangeError(`index out of range: ${i.pos} + ${e??1} > ${i.len}`)}function Sa(i,e){return(i[e-4]|i[e-3]<<8|i[e-2]<<16|i[e-1]<<24)>>>0}class KS{constructor(e){Me(this,"buf");Me(this,"pos");Me(this,"len");Me(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Fn(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw Fn(this,4);return Sa(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Fn(this,4);return Sa(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Fn(this,4);const e=HS(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Fn(this,4);const e=WS(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Fn(this,e);return this.pos+=e,t===n?new Uint8Array(0):this.buf.subarray(t,n)}string(){const e=this.bytes();return jS(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw Fn(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Fn(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Yt(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw Fn(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Fn(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw Fn(this,8);const e=Sa(this.buf,this.pos+=4),t=Sa(this.buf,this.pos+=4);return new Yt(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=kS(this.buf,this.pos);return this.pos+=Yc(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function $S(i){return new KS(i instanceof Uint8Array?i:i.subarray())}function $c(i,e,t){const n=$S(i);return e.decode(n,void 0,t)}function ZS(i){let n,s=8192;return function(a){if(a<1||a>4096)return Fr(a);s+a>8192&&(n=Fr(8192),s=0);const o=n.subarray(s,s+=a);return(s&7)!==0&&(s=(s|7)+1),o}}class xr{constructor(e,t,n){Me(this,"fn");Me(this,"len");Me(this,"next");Me(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=n}}function ol(){}class QS{constructor(e){Me(this,"head");Me(this,"tail");Me(this,"len");Me(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const JS=ZS();function eM(i){return globalThis.Buffer!=null?Fr(i):JS(i)}class mc{constructor(){Me(this,"len");Me(this,"head");Me(this,"tail");Me(this,"states");this.len=0,this.head=new xr(ol,0,0),this.tail=this.head,this.states=null}_push(e,t,n){return this.tail=this.tail.next=new xr(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new nM((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Ma,10,Yt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Yt.fromBigInt(e);return this._push(Ma,t.length(),t)}uint64Number(e){return this._push(zS,Yc(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Yt.fromBigInt(e).zzEncode();return this._push(Ma,t.length(),t)}sint64Number(e){const t=Yt.fromNumber(e).zzEncode();return this._push(Ma,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(ll,1,e?1:0)}fixed32(e){return this._push(pr,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Yt.fromBigInt(e);return this._push(pr,4,t.lo)._push(pr,4,t.hi)}fixed64Number(e){const t=Yt.fromNumber(e);return this._push(pr,4,t.lo)._push(pr,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(VS,4,e)}double(e){return this._push(GS,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(ll,1,0):this.uint32(t)._push(iM,t,e)}string(e){const t=YS(e);return t!==0?this.uint32(t)._push(Hf,t,e):this._push(ll,1,0)}fork(){return this.states=new QS(this),this.head=this.tail=new xr(ol,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new xr(ol,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=eM(this.len);let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}}function ll(i,e,t){e[t]=i&255}function tM(i,e,t){for(;i>127;)e[t++]=i&127|128,i>>>=7;e[t]=i}class nM extends xr{constructor(t,n){super(tM,t,n);Me(this,"next");this.next=void 0}}function Ma(i,e,t){for(;i.hi!==0;)e[t++]=i.lo&127|128,i.lo=(i.lo>>>7|i.hi<<25)>>>0,i.hi>>>=7;for(;i.lo>127;)e[t++]=i.lo&127|128,i.lo=i.lo>>>7;e[t++]=i.lo}function pr(i,e,t){e[t]=i&255,e[t+1]=i>>>8&255,e[t+2]=i>>>16&255,e[t+3]=i>>>24}function iM(i,e,t){e.set(i,t)}globalThis.Buffer!=null&&(mc.prototype.bytes=function(i){const e=i.length>>>0;return this.uint32(e),e>0&&this._push(sM,e,i),this},mc.prototype.string=function(i){const e=globalThis.Buffer.byteLength(i);return this.uint32(e),e>0&&this._push(rM,e,i),this});function sM(i,e,t){e.set(i,t)}function rM(i,e,t){i.length<40?Hf(i,e,t):e.utf8Write!=null?e.utf8Write(i,t):e.set(qc(i),t)}function aM(){return new mc}function Zc(i,e){const t=aM();return e.encode(i,t,{lengthDelimited:!1}),t.finish()}var gc;(function(i){i[i.VARINT=0]="VARINT",i[i.BIT64=1]="BIT64",i[i.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",i[i.START_GROUP=3]="START_GROUP",i[i.END_GROUP=4]="END_GROUP",i[i.BIT32=5]="BIT32"})(gc||(gc={}));function oM(i,e,t,n){return{name:i,type:e,encode:t,decode:n}}function Qc(i,e){return oM("message",gc.LENGTH_DELIMITED,i,e)}class vc extends Error{constructor(){super(...arguments);Me(this,"code","ERR_MAX_LENGTH");Me(this,"name","MaxLengthError")}}class lM{constructor(){Me(this,"index",0);Me(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,n=e();return n===void 0&&(this.index=t),n}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,n){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return n()})}readNumber(e,t,n,s){return this.readAtomically(()=>{let r=0,a=0;const o=this.peekChar();if(o===void 0)return;const l=o==="0",c=2**(8*s)-1;for(;;){const u=this.readAtomically(()=>{const h=this.readChar();if(h===void 0)return;const f=Number.parseInt(h,e);if(!Number.isNaN(f))return f});if(u===void 0)break;if(r*=e,r+=u,r>c||(a+=1,t!==void 0&&a>t))return}if(a!==0)return!n&&l&&a>1?void 0:r})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const n=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;e[t]=n}return e})}readIPv6Addr(){const e=t=>{for(let n=0;n<t.length/2;n++){const s=n*2;if(n<t.length-3){const a=this.readSeparator(":",n,()=>this.readIPv4Addr());if(a!==void 0)return t[s]=a[0],t[s+1]=a[1],t[s+2]=a[2],t[s+3]=a[3],[s+4,!0]}const r=this.readSeparator(":",n,()=>this.readNumber(16,4,!0,2));if(r===void 0)return[s,!1];t[s]=r>>8,t[s+1]=r&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[n,s]=e(t);if(n===16)return t;if(s||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const r=new Uint8Array(14),a=16-(n+2),[o]=e(r.subarray(0,a));return t.set(r.subarray(0,o),16-o),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const cM=45,uM=15,ao=new lM;function hM(i){if(!(i.length>uM))return ao.new(i).parseWith(()=>ao.readIPv4Addr())}function dM(i){if(i.includes("%")&&(i=i.split("%")[0]),!(i.length>cM))return ao.new(i).parseWith(()=>ao.readIPv6Addr())}function Gf(i){return!!hM(i)}function fM(i){return!!dM(i)}class ts extends Error{constructor(){super(...arguments);Me(this,"name","InvalidMultiaddrError")}}Me(ts,"name","InvalidMultiaddrError");class Qs extends Error{constructor(){super(...arguments);Me(this,"name","ValidationError")}}Me(Qs,"name","ValidationError");class Wf extends Error{constructor(){super(...arguments);Me(this,"name","UnknownProtocolError")}}Me(Wf,"name","UnknownProtocolError");const pM=4,mM=6,gM=273,vM=33,xM=41,_M=42,yM=43,SM=53,MM=54,bM=55,wM=56,EM=132,TM=301,AM=302,CM=400,RM=421,PM=444,DM=445,LM=446,IM=447,UM=448,FM=449,NM=454,BM=460,OM=461,zM=465,kM=466,VM=480,HM=481,GM=443,WM=477,XM=478,qM=479,YM=277,jM=275,KM=276,$M=280,ZM=281,QM=290,JM=777;function zh(i){return e=>ro(e,i)}function kh(i){return e=>qc(e,i)}function _r(i){return new DataView(i.buffer).getUint16(i.byteOffset).toString()}function Ls(i){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof i=="string"?parseInt(i):i),new Uint8Array(e)}function eb(i){const e=i.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=qc(e[0],"base32"),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const s=Ls(n);return If([t,s],t.length+s.length)}function tb(i){const e=i.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=Os.decode(`b${e[0]}`),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const s=Ls(n);return If([t,s],t.length+s.length)}function Vh(i){const e=i.subarray(0,i.length-2),t=i.subarray(i.length-2),n=ro(e,"base32"),s=_r(t);return`${n}:${s}`}const Xf=function(i){i=i.toString().trim();const e=new Uint8Array(4);return i.split(/\./g).forEach((t,n)=>{const s=parseInt(t,10);if(isNaN(s)||s<0||s>255)throw new ts("Invalid byte value in IP address");e[n]=s}),e},nb=function(i){let e=0;i=i.toString().trim();const t=i.split(":",8);let n;for(n=0;n<t.length;n++){const r=Gf(t[n]);let a;r&&(a=Xf(t[n]),t[n]=ro(a.subarray(0,2),"base16")),a!=null&&++n<8&&t.splice(n,0,ro(a.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(n=0;n<t.length&&t[n]!=="";n++);const r=[n,1];for(n=9-t.length;n>0;n--)r.push("0");t.splice.apply(t,r)}const s=new Uint8Array(e+16);for(n=0;n<t.length;n++){t[n]===""&&(t[n]="0");const r=parseInt(t[n],16);if(isNaN(r)||r<0||r>65535)throw new ts("Invalid byte value in IP address");s[e++]=r>>8&255,s[e++]=r&255}return s},ib=function(i){if(i.byteLength!==4)throw new ts("IPv4 address was incorrect length");const e=[];for(let t=0;t<i.byteLength;t++)e.push(i[t]);return e.join(".")},sb=function(i){if(i.byteLength!==16)throw new ts("IPv6 address was incorrect length");const e=[];for(let n=0;n<i.byteLength;n+=2){const s=i[n],r=i[n+1],a=`${s.toString(16).padStart(2,"0")}${r.toString(16).padStart(2,"0")}`;e.push(a)}const t=e.join(":");try{const n=new URL(`http://[${t}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new ts(`Invalid IPv6 address "${t}"`)}};function rb(i){try{const e=new URL(`http://[${i}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new ts(`Invalid IPv6 address "${i}"`)}}const cl=Object.values(pc).map(i=>i.decoder),ab=(function(){let i=cl[0].or(cl[1]);return cl.slice(2).forEach(e=>i=i.or(e)),i})();function ob(i){return ab.decode(i)}function lb(i){return e=>i.encoder.encode(e)}function cb(i){if(parseInt(i).toString()!==i)throw new Qs("Value must be an integer")}function ub(i){if(i<0)throw new Qs("Value must be a positive integer, or zero")}function hb(i){return e=>{if(e>i)throw new Qs(`Value must be smaller than or equal to ${i}`)}}function db(...i){return e=>{for(const t of i)t(e)}}const ba=db(cb,ub,hb(65535)),mn=-1;class fb{constructor(){Me(this,"protocolsByCode",new Map);Me(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new Wf(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(n=>{this.protocolsByName.set(n,e)})}removeProtocol(e){var n;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(n=t.aliases)==null||n.forEach(s=>{this.protocolsByName.delete(s)}))}}const pb=new fb,mb=[{code:pM,name:"ip4",size:32,valueToBytes:Xf,bytesToValue:ib,validate:i=>{if(!Gf(i))throw new Qs(`Invalid IPv4 address "${i}"`)}},{code:mM,name:"tcp",size:16,valueToBytes:Ls,bytesToValue:_r,validate:ba},{code:gM,name:"udp",size:16,valueToBytes:Ls,bytesToValue:_r,validate:ba},{code:vM,name:"dccp",size:16,valueToBytes:Ls,bytesToValue:_r,validate:ba},{code:xM,name:"ip6",size:128,valueToBytes:nb,bytesToValue:sb,stringToValue:rb,validate:i=>{if(!fM(i))throw new Qs(`Invalid IPv6 address "${i}"`)}},{code:_M,name:"ip6zone",size:mn},{code:yM,name:"ipcidr",size:8,bytesToValue:zh("base10"),valueToBytes:kh("base10")},{code:SM,name:"dns",size:mn},{code:MM,name:"dns4",size:mn},{code:bM,name:"dns6",size:mn},{code:wM,name:"dnsaddr",size:mn},{code:EM,name:"sctp",size:16,valueToBytes:Ls,bytesToValue:_r,validate:ba},{code:TM,name:"udt"},{code:AM,name:"utp"},{code:CM,name:"unix",size:mn,stringToValue:i=>decodeURIComponent(i),valueToString:i=>encodeURIComponent(i)},{code:RM,name:"p2p",aliases:["ipfs"],size:mn,bytesToValue:zh("base58btc"),valueToBytes:i=>i.startsWith("Q")||i.startsWith("1")?kh("base58btc")(i):Ot.parse(i).multihash.bytes},{code:PM,name:"onion",size:96,bytesToValue:Vh,valueToBytes:eb},{code:DM,name:"onion3",size:296,bytesToValue:Vh,valueToBytes:tb},{code:LM,name:"garlic64",size:mn},{code:IM,name:"garlic32",size:mn},{code:UM,name:"tls"},{code:FM,name:"sni",size:mn},{code:NM,name:"noise"},{code:BM,name:"quic"},{code:OM,name:"quic-v1"},{code:zM,name:"webtransport"},{code:kM,name:"certhash",size:mn,bytesToValue:lb(Ff),valueToBytes:ob},{code:VM,name:"http"},{code:HM,name:"http-path",size:mn,stringToValue:i=>`/${decodeURIComponent(i)}`,valueToString:i=>encodeURIComponent(i.substring(1))},{code:GM,name:"https"},{code:WM,name:"ws"},{code:XM,name:"wss"},{code:qM,name:"p2p-websocket-star"},{code:YM,name:"p2p-stardust"},{code:jM,name:"p2p-webrtc-star"},{code:KM,name:"p2p-webrtc-direct"},{code:$M,name:"webrtc-direct"},{code:ZM,name:"webrtc"},{code:QM,name:"p2p-circuit"},{code:JM,name:"memory",size:mn}];mb.forEach(i=>{pb.addProtocol(i)});var Wd,Xd;(Xd=(Wd=globalThis.process)==null?void 0:Wd.env)!=null&&Xd.DUMP_SESSION_KEYS;var oo;(function(i){let e;i.codec=()=>(e==null&&(e=Qc((t,n,s={})=>{if(s.lengthDelimited!==!1&&n.fork(),t.webtransportCerthashes!=null)for(const r of t.webtransportCerthashes)n.uint32(10),n.bytes(r);if(t.streamMuxers!=null)for(const r of t.streamMuxers)n.uint32(18),n.string(r);s.lengthDelimited!==!1&&n.ldelim()},(t,n,s={})=>{var o,l;const r={webtransportCerthashes:[],streamMuxers:[]},a=n==null?t.len:t.pos+n;for(;t.pos<a;){const c=t.uint32();switch(c>>>3){case 1:{if(((o=s.limits)==null?void 0:o.webtransportCerthashes)!=null&&r.webtransportCerthashes.length===s.limits.webtransportCerthashes)throw new vc('Decode error - map field "webtransportCerthashes" had too many elements');r.webtransportCerthashes.push(t.bytes());break}case 2:{if(((l=s.limits)==null?void 0:l.streamMuxers)!=null&&r.streamMuxers.length===s.limits.streamMuxers)throw new vc('Decode error - map field "streamMuxers" had too many elements');r.streamMuxers.push(t.string());break}default:{t.skipType(c&7);break}}}return r})),e),i.encode=t=>Zc(t,i.codec()),i.decode=(t,n)=>$c(t,i.codec(),n)})(oo||(oo={}));var Hh;(function(i){let e;i.codec=()=>(e==null&&(e=Qc((t,n,s={})=>{s.lengthDelimited!==!1&&n.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(n.uint32(10),n.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(n.uint32(18),n.bytes(t.identitySig)),t.extensions!=null&&(n.uint32(34),oo.codec().encode(t.extensions,n)),s.lengthDelimited!==!1&&n.ldelim()},(t,n,s={})=>{var o;const r={identityKey:fc(0),identitySig:fc(0)},a=n==null?t.len:t.pos+n;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{r.identityKey=t.bytes();break}case 2:{r.identitySig=t.bytes();break}case 4:{r.extensions=oo.codec().decode(t,t.uint32(),{limits:(o=s.limits)==null?void 0:o.extensions});break}default:{t.skipType(l&7);break}}}return r})),e),i.encode=t=>Zc(t,i.codec()),i.decode=(t,n)=>$c(t,i.codec(),n)})(Hh||(Hh={}));var Gh;(function(i){i[i.Data=0]="Data",i[i.WindowUpdate=1]="WindowUpdate",i[i.Ping=2]="Ping",i[i.GoAway=3]="GoAway"})(Gh||(Gh={}));var xc;(function(i){i[i.SYN=1]="SYN",i[i.ACK=2]="ACK",i[i.FIN=4]="FIN",i[i.RST=8]="RST"})(xc||(xc={}));Object.values(xc).filter(i=>typeof i!="string");var Wh;(function(i){i[i.NormalTermination=0]="NormalTermination",i[i.ProtocolError=1]="ProtocolError",i[i.InternalError=2]="InternalError"})(Wh||(Wh={}));var Xh;(function(i){i[i.Init=0]="Init",i[i.SYNSent=1]="SYNSent",i[i.SYNReceived=2]="SYNReceived",i[i.Established=3]="Established",i[i.Finished=4]="Finished",i[i.Paused=5]="Paused"})(Xh||(Xh={}));var qh;(function(i){let e;i.codec=()=>(e==null&&(e=Qc((t,n,s={})=>{if(s.lengthDelimited!==!1&&n.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(n.uint32(10),n.bytes(t.publicKey)),t.addrs!=null)for(const r of t.addrs)n.uint32(18),n.bytes(r);s.lengthDelimited!==!1&&n.ldelim()},(t,n,s={})=>{var o;const r={publicKey:fc(0),addrs:[]},a=n==null?t.len:t.pos+n;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{r.publicKey=t.bytes();break}case 2:{if(((o=s.limits)==null?void 0:o.addrs)!=null&&r.addrs.length===s.limits.addrs)throw new vc('Decode error - map field "addrs" had too many elements');r.addrs.push(t.bytes());break}default:{t.skipType(l&7);break}}}return r})),e),i.encode=t=>Zc(t,i.codec()),i.decode=(t,n)=>$c(t,i.codec(),n)})(qh||(qh={}));new TextEncoder;new TextDecoder;class gb{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const t=await navigator.gpu.requestAdapter(e.adapterOptions);if(!t)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await t.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,n,s){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const r=this.device.createBuffer({size:t,usage:n,label:s});return this.hotStore.set(e,r),r}removeHotBuffer(e){this.hotStore.delete(e)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}let ws=null,Yh=null;async function _c(){if(ws)return ws;try{return Yh=new gb({frameBudgetMs:6}),ws=await Yh.initialize(),ws}catch(i){if(console.warn("[planetgen] GPU hub unavailable, falling back to local WebGPU init",i),typeof navigator>"u"||!navigator.gpu)return null;const e=await navigator.gpu.requestAdapter();return e?(ws=await e.requestDevice(),ws):null}}function ne(i,e,t){return Math.min(Math.max(i,e),t)}function En(i){return ne(i,0,1)}function vb(i){let e=1/0,t=-1/0;for(let s=0;s<i.length;s++){const r=i[s];r<e&&(e=r),r>t&&(t=r)}const n=Math.max(t-e,1e-5);for(let s=0;s<i.length;s++)i[s]=(i[s]-e)/n}function xb(i,e,t=1){if(t<=0)return;const n=new Float32Array(i.length);for(let s=0;s<t;s++){for(let r=0;r<e;r++){const a=Math.max(0,r-1),o=Math.min(e-1,r+1);for(let l=0;l<e;l++){const c=(l-1+e)%e,u=(l+1)%e,h=r*e+l,f=i[h]*2+i[r*e+c]+i[r*e+u]+i[a*e+l]+i[o*e+l];n[h]=f/6}}i.set(n)}}function ir(){return window.matchMedia("(max-width: 768px)").matches||/Mobi|Android|iP(ad|hone|od)|IEMobile|BlackBerry|Kindle|Silk|Opera Mini/i.test(navigator.userAgent||"")}function _b(i,e,t){const n=i==null?void 0:i.image,s=n==null?void 0:n.data,r=(n==null?void 0:n.width)??0,a=(n==null?void 0:n.height)??0;if(!s||!r||!a)return{r:0,g:0,b:0,a:0};const o=(e%1+1)%1,l=ne(t,0,1),c=Math.min(r-1,Math.floor(o*r)),h=(Math.min(a-1,Math.floor(l*a))*r+c)*4;return{r:s[h]??0,g:s[h+1]??0,b:s[h+2]??0,a:s[h+3]??0}}class yb{constructor(e){this.sceneManager=e,this.forge=null,this.planet=null,this.water=null,this.freshwater=null,this.cloudLayerSettings=[],this.lastSettings=null,this.atmosphereSystem=new py(e.planetGroup),this.cloudSystem=new my(e.planetGroup),this.oceanComputeSystem=null,this.useComputeOcean=!0,this.waterUniforms={time:{value:0},deepColor:{value:new xe(532543)},shallowColor:{value:new xe(1396618)},opacity:{value:.9},fresnelPower:{value:3.4},iceCap:{value:0},iceColor:{value:new xe(14283263)},windStrength:{value:.5}}}async initOceanCompute(){if(!this.oceanComputeSystem)try{const e=await _c();this.oceanComputeSystem=await Gc.create({gridWidth:256,gridHeight:128,device:e||void 0}),console.log("[PlanetManager] Ocean compute system initialized")}catch(e){console.warn("[PlanetManager] Failed to init ocean compute:",e),this.oceanComputeSystem=null}}async generate(e,t){const n=s=>{t&&t(s)};try{n(`Tectonics: ${e.numPlates} plates`),await new Promise(a=>requestAnimationFrame(a)),this.forge=new fy(e.resolution),this.forge.generateTectonics({numPlates:e.numPlates,jitter:e.jitter,oceanFloor:.2,plateDelta:e.plateDelta,faultType:e.faultType,plateSizeVariance:e.plateSizeVariance,desymmetrizeTiling:e.desymmetrizeTiling}),n(`Erosion: ${e.iterations.toLocaleString()} droplets`),await new Promise(a=>requestAnimationFrame(a)),this.forge.applyErosion({iterations:e.iterations,erosionRate:e.erosionRate,evaporation:e.evaporation}),vb(this.forge.data),xb(this.forge.data,this.forge.size,e.smoothPasses),this.forge.applyHydrology({seaLevel:e.seaLevel,riverDepth:.015,lakeThreshold:.003}),n("Meshing planet…"),await new Promise(a=>requestAnimationFrame(a)),this.lastSettings={...e};const s=this.forge.createMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions,e.iceCap);s.userData.forge=this.forge,s.userData.settings=e,s.rotation.x=.25,s.castShadow=!0,s.receiveShadow=!0,this.replacePlanet(s),this.replaceWater(this.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,e.waterShader||"balanced")),this.replaceFreshwater(this.forge.createFreshwaterMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions));const r=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,e.radius,e.subdivisions,e.heightScale,r),this.cloudSystem.rebuild(r,e.radius,e.seaLevel,e.heightScale,e.subdivisions,this.cloudLayerSettings),this.applyPlanetScale(e.planetDiameterKm),n(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(s){console.error(s),n("Generation failed – check console")}}update(e,t=!0){var n,s,r,a,o,l,c,u,h;if(this.planet&&t&&(this.planet.rotation.y+=9e-4),this.water&&(this.waterUniforms.time.value+=.016,(s=(n=this.water.material)==null?void 0:n.uniforms)!=null&&s.time&&(this.water.material.uniforms.time.value+=e),(a=(r=this.water.material)==null?void 0:r.uniforms)!=null&&a.eye&&((o=this.sceneManager)!=null&&o.camera)&&this.water.material.uniforms.eye.value.copy(this.sceneManager.camera.position),(c=(l=this.water.material)==null?void 0:l.uniforms)!=null&&c.sunDirection)){const f=(u=this.sceneManager)==null?void 0:u.getSunDir();f&&this.water.material.uniforms.sunDirection.value.copy(f)}this.freshwater&&(this.freshwater.material.uniforms.time.value+=.016),(h=this.oceanComputeSystem)!=null&&h.enabled&&this.oceanComputeSystem.update(e),this.atmosphereSystem.update(e),this.cloudSystem.update(e)}updateOceanMouse(e,t,n,s){var r;(r=this.oceanComputeSystem)!=null&&r.enabled&&this.oceanComputeSystem.setMouseInteraction(e,t,n,s)}clearOceanMouse(){var e;(e=this.oceanComputeSystem)!=null&&e.enabled&&this.oceanComputeSystem.clearMouseInteraction()}setAtmosphereWeather(e,t){var n;(n=this.atmosphereSystem)==null||n.setWeather(e,t)}setOceanWindTexture(e){var n,s;if(!((s=(n=this.water)==null?void 0:n.material)!=null&&s.uniforms))return;const t=this.water.material.uniforms;t.windAuxMap&&(t.windAuxMap.value=e),t.useLocalWind&&(t.useLocalWind.value=e?1:0)}setOceanWindVector(e){var r;if(!((r=this.oceanComputeSystem)!=null&&r.enabled)||!e)return;const t=new _e(e.x,e.z),n=t.length();n>1e-6&&t.normalize();const s=Math.min(Math.max(n/40,0),2);this.oceanComputeSystem.setConfig({windStrength:s,windDirectionX:t.x,windDirectionY:t.y})}replacePlanet(e){var t,n;this.planet&&(this.planet.geometry.dispose(),Array.isArray(this.planet.material)?this.planet.material.forEach(s=>{var r;return(r=s.dispose)==null?void 0:r.call(s)}):(n=(t=this.planet.material).dispose)==null||n.call(t),this.sceneManager.planetGroup.remove(this.planet)),this.planet=e,this.planet.castShadow=!0,this.planet.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceWater(e){var t,n;this.water&&(this.water.geometry.dispose(),Array.isArray(this.water.material)?this.water.material.forEach(s=>{var r;return(r=s.dispose)==null?void 0:r.call(s)}):(n=(t=this.water.material).dispose)==null||n.call(t),this.sceneManager.planetGroup.remove(this.water)),this.water=e,this.water.castShadow=!0,this.water.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceFreshwater(e){var t,n;this.freshwater&&(this.freshwater.geometry.dispose(),(n=(t=this.freshwater.material).dispose)==null||n.call(t),this.freshwater.parent&&this.freshwater.parent.remove(this.freshwater)),this.freshwater=e,this.freshwater.renderOrder=1,this.freshwater.castShadow=!0,this.freshwater.receiveShadow=!0,this.planet?this.planet.add(e):this.sceneManager.planetGroup.add(e)}buildWaterMesh(e,t,n,s,r,a="balanced"){var u;const o=e+(n-.5)*s+.01,l=new Ii(o,Math.max(0,Math.floor(t)));this.waterUniforms.iceCap.value=r??0;let c;return a==="compute"&&((u=this.oceanComputeSystem)!=null&&u.enabled)?c=this.buildComputeOceanMaterial(o):a==="fast"?c=this.buildFastOceanMaterial():c=this.buildBalancedOceanMaterial(),new zt(l,c)}buildComputeOceanMaterial(e,t=null){const n={time:{value:0},deepColor:{value:new xe(673904)},midColor:{value:new xe(1732752)},shallowColor:{value:new xe(2461872)},sunDirection:{value:new P(.3,.8,.45).normalize()},windAuxMap:{value:t},useLocalWind:{value:t?1:0},globalWindDir:{value:new P(1,0,.5).normalize()},eye:{value:new P},waveHeight:{value:1},waveScale:{value:.6},windStrength:{value:.8},maxWind:{value:60},fetchLength:{value:1.5},waterRadius:{value:e}},s=new Vt({uniforms:n,transparent:!0,depthWrite:!0,side:_n,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                uniform float waveHeight;
                uniform float waveScale;
                uniform float windStrength;
                uniform float fetchLength;
                uniform sampler2D windAuxMap;
                uniform float useLocalWind;
                uniform vec3 globalWindDir;
                uniform float maxWind;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying vec3 vLocalPos;
                varying float vWaveHeight;
                varying float vLocalWindStrength;
                
                // Convert 3D direction to lat/lon UV for sampling weather texture
                vec2 dirToUV(vec3 dir) {
                    float u = atan(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
                    float v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
                    return vec2(u, v);
                }
                
                // Get local wind from weather aux texture
                vec3 getLocalWind(vec3 dir) {
                    if (useLocalWind < 0.5) {
                        return globalWindDir * maxWind * windStrength;
                    }
                    vec2 uv = dirToUV(dir);
                    vec4 aux = texture2D(windAuxMap, uv);
                    // B = windU (east), A = windV (north), encoded as 0-1 where 0.5 = zero
                    float windU = (aux.b - 0.5) * 2.0 * maxWind;
                    float windV = (aux.a - 0.5) * 2.0 * maxWind;
                    
                    // Convert east/north wind to 3D world direction
                    vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                    vec3 east = normalize(cross(up, dir));
                    vec3 north = normalize(cross(dir, east));
                    
                    return east * windU + north * windV;
                }

                vec3 rotateAroundAxis(vec3 v, vec3 axis, float angle) {
                    float s = sin(angle);
                    float c = cos(angle);
                    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
                }

                vec3 ekmanCurrent(vec3 windDir, vec3 dir) {
                    float hemisphere = dir.y >= 0.0 ? 1.0 : -1.0;
                    float angle = radians(35.0) * hemisphere;
                    return normalize(rotateAroundAxis(windDir, dir, angle));
                }
                
                // Wind-driven swell wave using spherical coordinates
                float swellWave(vec3 dir, vec3 windDir, float windSpeed, float t, 
                                float frequency, float amplitude) {
                    // Project direction onto wind direction for phase calculation
                    // Use spherical angle approach - works on sphere surface
                    float alongWind = dot(dir, windDir);
                    
                    // Use latitude/longitude perturbation for cross-wind variation
                    vec3 perpDir = dir - windDir * alongWind;
                    float crossWind = length(perpDir);
                    
                    // Primary wave phase - travels in wind direction
                    float phase = alongWind * frequency - t * 0.3;
                    
                    // Add cross-wind modulation for more natural pattern
                    float crossPhase = crossWind * frequency * 0.5;
                    
                    // Swell shape - asymmetric like real ocean swells
                    float wave = sin(phase + crossPhase * 0.2) * 0.55;
                    wave += sin(phase * 2.0 + 0.3) * 0.25;
                    wave += sin(phase * 0.5 - crossPhase * 0.1) * 0.2;
                    
                    // Amplitude scales with wind speed (linear is more visually pleasing at this scale)
                    float amp = amplitude * windSpeed * 0.008 * fetchLength;
                    
                    return wave * amp;
                }
                
                // Sum multiple wind-driven swells at different scales
                float oceanWaves(vec3 dir, vec3 windDir, float windSpeed, float t) {
                    if (windSpeed < 1.0) return 0.0;
                    
                    float totalDisp = 0.0;
                    
                    // Large primary swell - big rolling waves from sustained wind
                    totalDisp += swellWave(dir, windDir, windSpeed, t, 6.0, 1.0);
                    
                    // Secondary swell - medium period waves
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 1.2, 12.0, 0.6);
                    
                    // Tertiary waves - shorter wavelength
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 0.85, 24.0, 0.35);
                    
                    // Cross-swell (perpendicular to main wind) - creates diamond pattern
                    vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                    vec3 crossDir = normalize(cross(windDir, up));
                    totalDisp += swellWave(dir, crossDir, windSpeed * 0.5, t * 0.7, 10.0, 0.4);
                    
                    // Wind chop - higher frequency local ripples
                    totalDisp += swellWave(dir, windDir, windSpeed, t * 1.4, 48.0, 0.2);
                    
                    return totalDisp;
                }
                
                void main() {
                    vec3 dir = normalize(position);
                    vLocalPos = dir;
                    
                    // Get local wind from weather texture
                    vec3 localWind = getLocalWind(dir);
                    float localWindSpeed = length(localWind);
                    vec3 windDir = localWindSpeed > 0.1 ? normalize(localWind) : globalWindDir;
                    vec3 currentDir = ekmanCurrent(windDir, dir);
                    float currentSpeed = localWindSpeed * 0.025;
                    float swellSpeed = localWindSpeed + currentSpeed * 12.0;
                    vLocalWindStrength = clamp((localWindSpeed + currentSpeed * 40.0) / maxWind, 0.0, 1.0);
                    
                    // Calculate wind-driven wave displacement using direction vector
                    float waveDisp = oceanWaves(dir, windDir, swellSpeed, time) * waveHeight;
                    waveDisp += oceanWaves(dir, currentDir, max(currentSpeed * 40.0, 0.4), time * 0.9) * waveHeight * 0.5;
                    vWaveHeight = waveDisp;
                    
                    // Displace vertex along surface normal
                    vec3 pos = position + dir * waveDisp;
                    
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * dir);
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 deepColor;
                uniform vec3 midColor;
                uniform vec3 shallowColor;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                uniform float maxWind;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying vec3 vLocalPos;
                varying float vWaveHeight;
                varying float vLocalWindStrength;

                void main() {
                    #include <logdepthbuf_fragment>
                    
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    
                    // Use the interpolated normal from vertex shader
                    // The wave shape already provides surface variation
                    vec3 n = normalize(vNormal);
                    
                    // Fresnel effect for water surface
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 4.0);
                    
                    // Diffuse lighting
                    float diffuse = max(dot(n, L), 0.0) * 0.5 + 0.5;
                    
                    // Blend between deep and shallow colors based on view angle
                    vec3 baseColor = mix(deepColor, midColor, fresnel * 0.4);
                    baseColor = mix(baseColor, shallowColor, fresnel * fresnel * 0.3);
                    baseColor *= diffuse;
                    
                    // Specular highlight (sun glint)
                    vec3 H = normalize(L + V);
                    float spec = pow(max(dot(n, H), 0.0), 128.0) * 0.8;
                    float specBroad = pow(max(dot(n, H), 0.0), 32.0) * 0.15;
                    
                    // Whitecaps/foam - based on wave height and wind strength only
                    // Foam appears on wave crests when wind is strong
                    float waveSlope = abs(vWaveHeight) * 50.0;
                    float windFactor = vLocalWindStrength;
                    // Foam only appears with significant wind (> 40% of max)
                    float foamThreshold = 0.6;
                    float foam = smoothstep(foamThreshold, 1.0, waveSlope * windFactor);
                    foam = clamp(foam * 0.3, 0.0, 0.4) * smoothstep(0.4, 0.8, windFactor);
                    
                    // Foam color (bright white)
                    vec3 foamColor = vec3(0.95, 0.97, 1.0);
                    
                    // Combine all
                    vec3 finalColor = baseColor;
                    finalColor += vec3(spec + specBroad);
                    finalColor += fresnel * shallowColor * 0.12;
                    finalColor = mix(finalColor, foamColor, foam);
                    
                    gl_FragColor = vec4(finalColor, 0.92);
                }
            `});return s.uniforms=n,s}buildBalancedOceanMaterial(){const e={time:{value:0},color:{value:new xe(5086166)},sunDirection:{value:new P(.3,.8,.45).normalize()},eye:{value:new P}},t=new Vt({uniforms:e,transparent:!0,depthWrite:!0,side:_n,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    vec3 pos = position;
                    float wave = sin((pos.x + pos.z) * 0.25 + time * 0.7) * 0.02;
                    float wave2 = sin((pos.y * 0.4 - pos.x * 0.3) + time * 0.9) * 0.015;
                    pos += normalize(normal) * (wave + wave2);
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 color;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                varying vec3 vWorldPos;
                varying vec3 vNormal;

                float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
                float noise(vec2 p){
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f*f*(3.0-2.0*f);
                    float a = hash(i);
                    float b = hash(i + vec2(1.0,0.0));
                    float c = hash(i + vec2(0.0,1.0));
                    float d = hash(i + vec2(1.0,1.0));
                    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
                }
                float fbm(vec2 p){
                    float s = 0.0;
                    float a = 0.6;
                    for(int i=0;i<4;i++){
                        s += noise(p) * a;
                        p *= 2.1;
                        a *= 0.5;
                    }
                    return s;
                }

                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 n = normalize(vNormal);
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 3.0);
                    vec2 uv = vWorldPos.xz * 0.3 + vec2(time * 0.2, time * 0.15);
                    float bump = fbm(uv * 2.5) * 0.4 + fbm(uv * 5.0) * 0.2;
                    vec3 N = normalize(n + vec3(bump * 0.4, 0.0, bump * 0.4));
                    float diffuse = max(dot(N, L), 0.0);
                    vec3 base = mix(color * 0.6, color, diffuse);
                    float spec = pow(max(dot(reflect(-L, N), V), 0.0), 28.0) * 0.2;
                    vec3 col = base + vec3(spec) + fresnel * 0.25;
                    gl_FragColor = vec4(col, 0.9);
                }
            `});return t.uniforms=e,t}buildFastOceanMaterial(){const e={time:{value:0},sunDirection:{value:new P(.3,.8,.45).normalize()},eye:{value:new P},uColor:{value:new xe(871286)}},t=new Vt({uniforms:e,transparent:!0,depthWrite:!0,side:_n,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                uniform float time;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    vec3 pos = position;
                    float w = sin(pos.x * 0.3 + time * 0.6) * 0.015;
                    w += sin(pos.z * 0.2 + time * 0.5) * 0.012;
                    pos += normalize(normal) * w;
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * normalize(pos));
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform float time;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                uniform vec3 uColor;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                void main() {
                    #include <logdepthbuf_fragment>
                    vec3 n = normalize(vNormal);
                    vec3 V = normalize(eye - vWorldPos);
                    vec3 L = normalize(sunDirection);
                    float fresnel = pow(1.0 - max(dot(V, n), 0.0), 2.5);
                    float diff = max(dot(n, L), 0.0);
                    float spec = pow(max(dot(reflect(-L, n), V), 0.0), 16.0) * 0.1;
                    vec3 col = uColor * (0.5 + diff * 0.5) + spec + fresnel * 0.15;
                    gl_FragColor = vec4(col, 0.85);
                }
            `});return t.uniforms=e,t}applyPlanetScale(e){const t=(e||wi)/wi;this.sceneManager.planetGroup.scale.setScalar(t),this.sceneManager.controls.minDistance=Math.max(.2,10*t*.1)}updateAtmosphere(e,t){if(!this.lastSettings)return;const n=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,this.lastSettings.radius,this.lastSettings.subdivisions,this.lastSettings.heightScale,n),t&&this.atmosphereSystem.setWeather(t.map,t.rainHaze)}rebuildClouds(e){this.lastSettings&&this.cloudSystem.rebuild(e,this.lastSettings.radius,this.lastSettings.seaLevel,this.lastSettings.heightScale,this.lastSettings.subdivisions,this.cloudLayerSettings)}}const ul={type:"change"},Jc={type:"start"},eu={type:"end"},jh=1e-6,et={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},wa=new _e,vi=new _e,Sb=new P,Ea=new P,hl=new P,Es=new On,Kh=new P,Ta=new P,dl=new P,Aa=new P;class Mb extends d0{constructor(e,t=null){super(e,t),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:Fs.ROTATE,MIDDLE:Fs.DOLLY,RIGHT:Fs.PAN},this.state=et.NONE,this.keyState=et.NONE,this.target=new P,this._lastPosition=new P,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new P,this._movePrev=new _e,this._moveCurr=new _e,this._lastAxis=new P,this._zoomStart=new _e,this._zoomEnd=new _e,this._panStart=new _e,this._panEnd=new _e,this._pointers=[],this._pointerPositions={},this._onPointerMove=wb.bind(this),this._onPointerDown=bb.bind(this),this._onPointerUp=Eb.bind(this),this._onPointerCancel=Tb.bind(this),this._onContextMenu=Ib.bind(this),this._onMouseWheel=Lb.bind(this),this._onKeyDown=Cb.bind(this),this._onKeyUp=Ab.bind(this),this._onTouchStart=Ub.bind(this),this._onTouchMove=Fb.bind(this),this._onTouchEnd=Nb.bind(this),this._onMouseDown=Rb.bind(this),this._onMouseMove=Pb.bind(this),this._onMouseUp=Db.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,t!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>jh&&(this.dispatchEvent(ul),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>jh||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(ul),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=et.NONE,this.keyState=et.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(ul),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(vi.copy(this._panEnd).sub(this._panStart),vi.lengthSq()){if(this.object.isOrthographicCamera){const e=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,t=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;vi.x*=e,vi.y*=t}vi.multiplyScalar(this._eye.length()*this.panSpeed),Ea.copy(this._eye).cross(this.object.up).setLength(vi.x),Ea.add(Sb.copy(this.object.up).setLength(vi.y)),this.object.position.add(Ea),this.target.add(Ea),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(vi.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){Aa.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let e=Aa.length();e?(this._eye.copy(this.object.position).sub(this.target),Kh.copy(this._eye).normalize(),Ta.copy(this.object.up).normalize(),dl.crossVectors(Ta,Kh).normalize(),Ta.setLength(this._moveCurr.y-this._movePrev.y),dl.setLength(this._moveCurr.x-this._movePrev.x),Aa.copy(Ta.add(dl)),hl.crossVectors(Aa,this._eye).normalize(),e*=this.rotateSpeed,Es.setFromAxisAngle(hl,e),this._eye.applyQuaternion(Es),this.object.up.applyQuaternion(Es),this._lastAxis.copy(hl),this._lastAngle=e):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Es.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Es),this.object.up.applyQuaternion(Es)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let e;this.state===et.TOUCH_ZOOM_PAN?(e=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Ka.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(e=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,e!==1&&e>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Ka.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(e,t){return wa.set((e-this.screen.left)/this.screen.width,(t-this.screen.top)/this.screen.height),wa}_getMouseOnCircle(e,t){return wa.set((e-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-t))/this.screen.width),wa}_addPointer(e){this._pointers.push(e)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId==e.pointerId){this._pointers.splice(t,1);return}}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new _e,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[t.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function bb(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function wb(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Eb(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function Tb(i){this._removePointer(i)}function Ab(){this.enabled!==!1&&(this.keyState=et.NONE,window.addEventListener("keydown",this._onKeyDown))}function Cb(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===et.NONE&&(i.code===this.keys[et.ROTATE]&&!this.noRotate?this.keyState=et.ROTATE:i.code===this.keys[et.ZOOM]&&!this.noZoom?this.keyState=et.ZOOM:i.code===this.keys[et.PAN]&&!this.noPan&&(this.keyState=et.PAN)))}function Rb(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Fs.DOLLY:this.state=et.ZOOM;break;case Fs.ROTATE:this.state=et.ROTATE;break;case Fs.PAN:this.state=et.PAN;break;default:this.state=et.NONE}const t=this.keyState!==et.NONE?this.keyState:this.state;t===et.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):t===et.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):t===et.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(Jc)}function Pb(i){const e=this.keyState!==et.NONE?this.keyState:this.state;e===et.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):e===et.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):e===et.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function Db(){this.state=et.NONE,this.dispatchEvent(eu)}function Lb(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(Jc),this.dispatchEvent(eu)}}function Ib(i){this.enabled!==!1&&i.preventDefault()}function Ub(i){switch(this._trackPointer(i),this._pointers.length){case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=et.TOUCH_ZOOM_PAN;const e=this._pointers[0].pageX-this._pointers[1].pageX,t=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(e*e+t*t);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(Jc)}function Fb(i){switch(this._trackPointer(i),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));break;default:const e=this._getSecondPointerPosition(i),t=i.pageX-e.x,n=i.pageY-e.y;this._touchZoomDistanceEnd=Math.sqrt(t*t+n*n);const s=(i.pageX+e.x)/2,r=(i.pageY+e.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r));break}}function Nb(i){switch(this._pointers.length){case 0:this.state=et.NONE;break;case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=et.TOUCH_ZOOM_PAN;for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId!==i.pointerId){const t=this._pointerPositions[this._pointers[e].pointerId];this._moveCurr.copy(this._getMouseOnCircle(t.x,t.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(eu)}class Bb{constructor(e){if(this.canvas=e,this.canvas&&this.canvas.setAttribute&&this.canvas.setAttribute("tabindex","0"),this.renderer=this.createRenderer(e),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(329487),this.renderer.outputColorSpace=gn,this.renderer.xr.enabled=!0,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Yd,this.scene=new jm,this.scene.background=new xe(329487),this.scene.fog=new Oc(329487,30,120),this.planetGroup=new Ps,this.scene.add(this.planetGroup),this.userGroup=new Ps,this.scene.add(this.userGroup),this.camera=new Tn(60,window.innerWidth/window.innerHeight,1e-16,2e3),this.userGroup.add(this.camera),this.camera.position.set(0,10,28),this.controls=new Mb(this.camera,this.renderer.domElement),this.controls.rotateSpeed=2.2,this.controls.zoomSpeed=2,this.controls.panSpeed=1,this.controls.dynamicDampingFactor=.1,this.controls.noPan=!0,this.controls.minDistance=12,this.controls.maxDistance=60,typeof this.controls.onTouchMove=="function"){const n=this.controls.onTouchMove.bind(this.controls);this.controls.onTouchMove=s=>{if(!(!s.touches||s.touches.length===0))return n(s)}}if(typeof this.controls.onTouchEnd=="function"){const n=this.controls.onTouchEnd.bind(this.controls);this.controls.onTouchEnd=s=>{if(s.touches)return n(s)}}this.scene.add(new a0(14215167,658450,9e-4)),this.dirLight=new c0(16777215,1.35),this.dirLight.position.set(12,16,10),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.set(2048,2048),this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=300;const t=80;this.dirLight.shadow.camera.left=-t,this.dirLight.shadow.camera.right=t,this.dirLight.shadow.camera.top=t,this.dirLight.shadow.camera.bottom=-t,this.scene.add(this.dirLight.target),this.scene.add(this.dirLight),this.sunMesh=null,this.scene.add(this.buildStarfield()),this.onResize=this.onResize.bind(this),window.addEventListener("resize",this.onResize)}createRenderer(e){const t=[{ctor:rl,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!0}},{ctor:rl,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}},{ctor:rl,opts:{antialias:!1,canvas:e,logarithmicDepthBuffer:!1}},{ctor:void 0,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}}];for(let n=0;n<t.length;n++){const{ctor:s,opts:r}=t[n];try{return new s(r)}catch(a){console.warn(`WebGL init failed (attempt ${n+1})`,a)}}throw new Error("WebGL context could not be created. Enable WebGL/hardware acceleration or try a different browser/XR emulator configuration.")}buildStarfield(){const t=new Float32Array(3600);for(let r=0;r<1200;r++){const a=90+Math.random()*60,o=Math.random()*Math.PI*2,l=Math.random()*2-1,c=Math.acos(l),u=Math.sin(c);t[r*3]=a*u*Math.cos(o),t[r*3+1]=a*Math.cos(c),t[r*3+2]=a*u*Math.sin(o)}const n=new on;n.setAttribute("position",new kt(t,3));const s=new yf({color:8246268,size:.5,sizeAttenuation:!0,transparent:!0,opacity:.7});return new t0(n,s)}onResize(){const{innerWidth:e,innerHeight:t}=window;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.controls.handleResize()}update(e=!0){e&&this.controls&&this.controls.update(),this.renderer.render(this.scene,this.camera)}getSunDir(){return this.dirLight.position.clone().normalize()}}const $h=()=>({forward:!1,backward:!1,left:!1,right:!1,up:!1,down:!1,run:!1,rollLeft:!1,rollRight:!1}),fl=new Set(["flyToggle","jump","exit","surface"]);class Ob{constructor(e=document){this.target=e,this.state=$h(),this.once=new Set,this.lookDelta={x:0,y:0},this.mode="desktop",this.lookMode="orbit"}setMode(e){this.mode=e}setLookMode(e){this.lookMode=e}consume(e){if(!fl.has(e))return!1;const t=this.once.has(e);return t&&this.once.delete(e),t}setAction(e,t){e in this.state?this.state[e]=!!t:fl.has(e)&&t&&this.once.add(e)}trigger(e){fl.has(e)&&this.once.add(e)}addLookDelta(e,t){this.lookDelta.x+=e,this.lookDelta.y+=t}consumeLookDelta(){const{x:e,y:t}=this.lookDelta;return this.lookDelta.x=0,this.lookDelta.y=0,{x:e,y:t}}getState(){return this.state}clear(){this.state=$h(),this.once.clear(),this.lookDelta={x:0,y:0}}dispose(){}}function zb(i,e){const t=Math.cos(i);return{x:t*Math.cos(e),y:Math.sin(i),z:t*Math.sin(e)}}function pl(i,e,t,n){const s=En(i)*(n-1),r=En(1-e)*(n-1),a=Math.floor(s),o=Math.floor(r),l=Math.min(n-1,a+1),c=Math.min(n-1,o+1),u=s-a,h=r-o,f=t[o*n+a],m=t[o*n+l],g=t[c*n+a],v=t[c*n+l],p=f*(1-u)+m*u,d=g*(1-u)+v*u,_=p*(1-h)+d*h;return Number.isFinite(_)?_:0}function kb(i,e,t){const n=Math.abs(i.x),s=Math.abs(i.y),r=Math.abs(i.z),a=n+s+r+1e-6,o=n/a,l=s/a,c=r/a,u={u:i.z*.5+.5,v:i.y*.5+.5},h={u:i.x*.5+.5,v:i.z*.5+.5},f={u:i.x*.5+.5,v:i.y*.5+.5},m=pl(u.u,u.v,e,t),g=pl(h.u,h.v,e,t),v=pl(f.u,f.v,e,t);return m*o+g*l+v*c}function qf({heightmap:i,size:e,seaLevel:t,gridWidth:n,gridHeight:s}){const r=n*s,a=new Float32Array(r*4);for(let o=0;o<s;o++){const c=((o+.5)/s-.5)*Math.PI;for(let u=0;u<n;u++){const f=((u+.5)/n-.5)*Math.PI*2,m=zb(c,f),g=kb(m,i,e),v=g<t?1:0,p=v?0:En((g-t)/Math.max(1e-6,1-t)),d=(o*n+u)*4;a[d+0]=v,a[d+1]=p,a[d+2]=g,a[d+3]=0}}return a}const Vb=256,Hb=128;function Zh(i,e,t){const n=new Xn(i,e,t,bt,Dt);return n.needsUpdate=!0,n.wrapS=yn,n.wrapT=pt,n.minFilter=it,n.magFilter=it,n.generateMipmaps=!1,n.colorSpace=Ft,n}class tu{constructor({gridWidth:e=Vb,gridHeight:t=Hb}={}){this.gridWidth=e,this.gridHeight=t,this.cellCount=e*t,this.enabled=!1,this.ready=!1,this.device=null,this.pipeline=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(32),this.stateBuffers=null,this.surfaceBuffer=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.oceanInertia=.25,this.moistureLayers=2,this.planetRadiusM=5e5,this.textureData=new Uint8Array(this.cellCount*4),this.weatherTexture=Zh(this.textureData,e,t),this.auxTextureData=new Uint8Array(this.cellCount*4),this.weatherAuxTexture=Zh(this.auxTextureData,e,t)}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:n,precipStrength:s,windStrength:r,oceanInertia:a,moistureLayers:o}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(n)&&(this.evapStrength=Math.max(0,n)),Number.isFinite(s)&&(this.precipStrength=Math.max(0,s)),Number.isFinite(r)&&(this.windStrength=Math.max(0,r)),Number.isFinite(a)&&(this.oceanInertia=En(a)),Number.isFinite(o)&&(this.moistureLayers=Math.max(1,Math.min(4,Math.round(o))))}static async create(e={}){const{device:t,...n}=e,s=new tu(n);return await s.init({device:t}),s}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleSystem] WebGPU not available; weather simulation disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[WaterCycleSystem] No GPU adapter found; weather simulation disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,n=48,s=16,r=8;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.cellCount*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.cellCount*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:this.cellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:this.cellCount*r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:this.cellCount*r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})];const a=t.createShaderModule({code:this._wgsl()});this.pipeline=t.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[0]}},{binding:2,resource:{buffer:this.stateBuffers[1]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]}),t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[1]}},{binding:2,resource:{buffer:this.stateBuffers[0]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]})],this.ready=!0}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}setPlanetSurface({heightmap:e,size:t,seaLevel:n,planetRadiusM:s}){if(!this.enabled||!this.ready||!e||!t)return;this.planetRadiusM=s??this.planetRadiusM;const r=qf({heightmap:e,size:t,seaLevel:n,gridWidth:this.gridWidth,gridHeight:this.gridHeight}),a=new Float32Array(this.cellCount*12),o=288,l=8e3,c=(h,f)=>{const m=Math.sin(h*127.1+f*311.7)*43758.5453123;return m-Math.floor(m)};for(let h=0;h<this.gridHeight;h++){const m=((h+.5)/this.gridHeight-.5)*Math.PI,g=Math.abs(Math.sin(m));for(let v=0;v<this.gridWidth;v++){const p=h*this.gridWidth+v,d=r[p*4+0],_=r[p*4+1],y=_*l,x=(c(v,h)-.5)*2,E=o-55*g-y*.0065+x*1.2,T=this._qsApprox(E),A=(d?.94:.65)*T,R=A*.85,M=R*.72,S=M*.55,D=d?25e-5*(1-g):5e-5*(1-g)*(1-_),B=x*700+Math.sin(m*3)*250,N=10*Math.sin(m*2);a[p*12+0]=E,a[p*12+1]=A,a[p*12+2]=D,a[p*12+3]=0,a[p*12+4]=B,a[p*12+5]=N,a[p*12+6]=0,a[p*12+7]=d?1:.25,a[p*12+8]=R,a[p*12+9]=M,a[p*12+10]=S,a[p*12+11]=0}}const u=this.device;u.queue.writeBuffer(this.surfaceBuffer,0,r),u.queue.writeBuffer(this.stateBuffers[0],0,a),u.queue.writeBuffer(this.stateBuffers[1],0,a);for(let h=0;h<this.cellCount;h++){const f=a[h*12+0],m=a[h*12+2],g=a[h*12+4],v=a[h*12+5],p=a[h*12+6],d=a[h*12+7],_=En(m*600),y=En(.5+g*(1/6e3)),x=En(d);this.textureData[h*4+0]=Math.round(_*255),this.textureData[h*4+1]=0,this.textureData[h*4+2]=Math.round(y*255),this.textureData[h*4+3]=Math.round(x*255);const E=En((f-240)/70),T=En(.5+v*(1/120)),A=En(.5+p*(1/120));this.auxTextureData[h*4+0]=Math.round(E*255),this.auxTextureData[h*4+1]=0,this.auxTextureData[h*4+2]=Math.round(T*255),this.auxTextureData[h*4+3]=Math.round(A*255)}this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.simTimeS=0,this.ping=0,this.hasSurface=!0}update(e,t,n={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const s=Math.min(Math.max(e??0,0),.25),r=Number.isFinite(n.dtSimOverride)?n.dtSimOverride:s*this.timeScale,a=Math.min(Math.max(r,0),900);if(a<=0)return;this.simTimeS+=a,this.readbackTimerS+=s,this._writeUniforms(a,this.simTimeS,t);const o=this.device,l=o.createCommandEncoder(),c=l.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,this.bindGroups[this.ping]),c.dispatchWorkgroups(Math.ceil(this.gridWidth/8),Math.ceil(this.gridHeight/8)),c.end();let u=null;if(!!n.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const f=this.readbackWriteIndex&1;this.readbackInFlight[f]||(l.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[f],0,this.cellCount*8),u=f,this.readbackWriteIndex++,this.readbackTimerS=0)}o.queue.submit([l.finish()]),u!==null&&this._scheduleReadback(u),this.ping=1-this.ping}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const n=t.getMappedRange(),s=new Uint8Array(n),r=this.cellCount*4;this.textureData.set(s.subarray(0,r)),this.auxTextureData.set(s.subarray(r,r*2)),t.unmap(),this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0}).catch(n=>{console.warn("[WaterCycleSystem] Readback failed",n)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,n){const s=this.uniformData;s[0]=this.gridWidth,s[1]=this.gridHeight,s[2]=e,s[3]=t,s[4]=this.planetRadiusM,s[5]=2*Math.PI/86400,s[6]=288,s[7]=.0065,s[8]=8e3,s[9]=8e3,s[10]=.0098,s[11]=this.moistureLayers,s[12]=(n==null?void 0:n.x)??0,s[13]=(n==null?void 0:n.y)??1,s[14]=(n==null?void 0:n.z)??0,s[15]=0,s[16]=18,s[17]=1/21600,s[18]=3e-5*this.evapStrength,s[19]=12e-6*this.evapStrength,s[20]=1/1800,s[21]=1/1200*this.precipStrength,s[22]=1/1800,s[23]=1/3600,s[24]=1/7200*this.windStrength,s[25]=1/14400,s[26]=2e-5,s[27]=60*this.windStrength,s[28]=120,s[29]=45e3,s[30]=1/7200,s[31]=this.oceanInertia,this.device.queue.writeBuffer(this.uniformBuffer,0,s)}_qsApprox(e){const t=e-273.15,s=6.112*Math.exp(17.67*t/(t+243.5))*100;return .622*s/Math.max(101325-s,1)}_wgsl(){return`
struct Cell {
  a: vec4<f32>, // T, q0, qc, rain
  b: vec4<f32>, // p, u, v, soil
  c: vec4<f32>, // q1, q2, q3, snow
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 8>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Cell>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Cell>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>; // ocean, elev01, rawHeight, _
@group(0) @binding(4) var<storage, read_write> outPixels: array<u32>;

const MAX_MOISTURE_LAYERS: u32 = 4u;

fn getW() -> u32 { return u32(params[0].x); }
fn getH() -> u32 { return u32(params[0].y); }
fn getDt() -> f32 { return params[0].z; }
fn getTime() -> f32 { return params[0].w; }

fn radiusM() -> f32 { return params[1].x; }
fn omega() -> f32 { return params[1].y; }
fn baseTemp() -> f32 { return params[1].z; }
fn lapseRate() -> f32 { return params[1].w; }

fn scaleHeight() -> f32 { return params[2].x; }
fn mountainHeight() -> f32 { return params[2].y; }
fn gammaKPerM() -> f32 { return params[2].z; }

fn moistureLayers() -> u32 {
  let m = u32(clamp(params[2].w, 1.0, f32(MAX_MOISTURE_LAYERS)) + 0.5);
  return clamp(m, 1u, MAX_MOISTURE_LAYERS);
}

fn sunDir() -> vec3<f32> { return params[3].xyz; }

fn solarHeatingK() -> f32 { return params[4].x; }
fn tempRelax() -> f32 { return params[4].y; }
fn evapOcean() -> f32 { return params[4].z; }
fn evapLand() -> f32 { return params[4].w; }

fn condenseRate() -> f32 { return params[5].x; }
fn precipRate() -> f32 { return params[5].y; }
fn rainDecay() -> f32 { return params[5].z; }
fn cloudEvapRate() -> f32 { return params[5].w; }

fn windRelax() -> f32 { return params[6].x; }
fn windDrag() -> f32 { return params[6].y; }
fn coriolisMin() -> f32 { return params[6].z; }
fn maxWind() -> f32 { return params[6].w; }

fn pTempCoeff() -> f32 { return params[7].x; }
fn pVaporCoeff() -> f32 { return params[7].y; }
fn pSmooth() -> f32 { return params[7].z; }
fn oceanTempRelaxMul() -> f32 { return params[7].w; }

fn wrapX(x: i32, w: i32) -> u32 {
  var r = x % w;
  if (r < 0) { r = r + w; }
  return u32(r);
}

fn clampY(y: i32, h: i32) -> u32 {
  return u32(clamp(y, 0, h - 1));
}

fn idx(x: u32, y: u32) -> u32 {
  return y * getW() + x;
}

fn metersPerCellX(cosLat: f32) -> f32 {
  let w = f32(getW());
  let cl = max(cosLat, 0.08);
  return 2.0 * 3.14159265 * radiusM() * cl / w;
}

fn metersPerCellY() -> f32 {
  let h = f32(getH());
  return 3.14159265 * radiusM() / h;
}

fn satVaporPressurePa(T: f32) -> f32 {
  let Tc = T - 273.15;
  let es_hPa = 6.112 * exp((17.67 * Tc) / (Tc + 243.5));
  return es_hPa * 100.0;
}

fn satMixingRatio(T: f32) -> f32 {
  let e = satVaporPressurePa(T);
  let p = 101325.0;
  let eps = 0.622;
  return (eps * e) / max(p - e, 1.0);
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
  let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
  let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
  let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
  let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
  return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

	fn wrapCoord(x: f32, w: f32) -> f32 {
	  return x - floor(x / w) * w;
	}

fn sampleTQc(xf: f32, yf: f32) -> vec2<f32> {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let c00 = vec2<f32>(stateSrc[idx(x0, y0)].a.x, stateSrc[idx(x0, y0)].a.z);
  let c10 = vec2<f32>(stateSrc[idx(x1, y0)].a.x, stateSrc[idx(x1, y0)].a.z);
  let c01 = vec2<f32>(stateSrc[idx(x0, y1)].a.x, stateSrc[idx(x0, y1)].a.z);
  let c11 = vec2<f32>(stateSrc[idx(x1, y1)].a.x, stateSrc[idx(x1, y1)].a.z);

  let c0 = mix(c00, c10, tx);
  let c1 = mix(c01, c11, tx);
  return mix(c0, c1, ty);
}

fn sampleQ(xf: f32, yf: f32) -> vec4<f32> {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let q00 = vec4<f32>(stateSrc[idx(x0, y0)].a.y, stateSrc[idx(x0, y0)].c.x, stateSrc[idx(x0, y0)].c.y, stateSrc[idx(x0, y0)].c.z);
  let q10 = vec4<f32>(stateSrc[idx(x1, y0)].a.y, stateSrc[idx(x1, y0)].c.x, stateSrc[idx(x1, y0)].c.y, stateSrc[idx(x1, y0)].c.z);
  let q01 = vec4<f32>(stateSrc[idx(x0, y1)].a.y, stateSrc[idx(x0, y1)].c.x, stateSrc[idx(x0, y1)].c.y, stateSrc[idx(x0, y1)].c.z);
  let q11 = vec4<f32>(stateSrc[idx(x1, y1)].a.y, stateSrc[idx(x1, y1)].c.x, stateSrc[idx(x1, y1)].c.y, stateSrc[idx(x1, y1)].c.z);

  let q0 = mix(q00, q10, tx);
  let q1 = mix(q01, q11, tx);
  return mix(q0, q1, ty);
}

fn sampleP(xf: f32, yf: f32) -> f32 {
  let w = f32(getW());
  let h = f32(getH());
  let xw = wrapCoord(xf, w);
  let yc = clamp(yf, 0.0, h - 1.001);

  let x0i = i32(floor(xw));
  let y0i = i32(floor(yc));
  let x1i = x0i + 1;
  let y1i = y0i + 1;
  let tx = fract(xw);
  let ty = fract(yc);

  let x0 = wrapX(x0i, i32(getW()));
  let x1 = wrapX(x1i, i32(getW()));
  let y0 = clampY(y0i, i32(getH()));
  let y1 = clampY(y1i, i32(getH()));

  let p00 = stateSrc[idx(x0, y0)].b.x;
  let p10 = stateSrc[idx(x1, y0)].b.x;
  let p01 = stateSrc[idx(x0, y1)].b.x;
  let p11 = stateSrc[idx(x1, y1)].b.x;

  let p0 = mix(p00, p10, tx);
  let p1 = mix(p01, p11, tx);
  return mix(p0, p1, ty);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let w = getW();
  let h = getH();
  if (gid.x >= w || gid.y >= h) { return; }
  let i = idx(gid.x, gid.y);

  let dt = getDt();

  let src = stateSrc[i];
  var T0 = src.a.x;
  var q0 = src.a.y;
  var qc0 = src.a.z;
  var rain0 = src.a.w;
  var p0 = src.b.x;
  var u0 = src.b.y;
  var v0 = src.b.z;
  var soil0 = src.b.w;
  var snow0 = src.c.w;

  let surf = surface[i];
  let ocean = surf.x;
  let elev01 = surf.y;
  let altM = elev01 * mountainHeight();

  let u = (f32(gid.x) + 0.5) / f32(w);
  let v = (f32(gid.y) + 0.5) / f32(h);
  let lon = (u - 0.5) * 6.28318531;
  let lat = (v - 0.5) * 3.14159265;
  let sinLat = sin(lat);
  let cosLat = cos(lat);
  let n = vec3<f32>(cosLat * cos(lon), sinLat, cosLat * sin(lon));
  let insolation = max(dot(normalize(n), normalize(sunDir())), 0.0);

  // Pressure gradient (Pa/m) from stored anomaly field.
  let xL = wrapX(i32(gid.x) - 1, i32(w));
  let xR = wrapX(i32(gid.x) + 1, i32(w));
  let yD = clampY(i32(gid.y) - 1, i32(h));
  let yU = clampY(i32(gid.y) + 1, i32(h));

  let mpcX = metersPerCellX(abs(cosLat));
  let mpcY = metersPerCellY();
  let inv2dx = 0.5 / mpcX;
  let inv2dy = 0.5 / mpcY;

  let pL = stateSrc[idx(xL, gid.y)].b.x;
  let pR = stateSrc[idx(xR, gid.y)].b.x;
  let pD = stateSrc[idx(gid.x, yD)].b.x;
  let pU = stateSrc[idx(gid.x, yU)].b.x;
  let dpdx = (pR - pL) * inv2dx;
  let dpdy = (pU - pD) * inv2dy;

  // Geostrophic wind estimate + relaxation.
  let rho = 1.2;
  var f = 2.0 * omega() * sinLat;
  if (abs(f) < coriolisMin()) {
    f = coriolisMin() * select(1.0, -1.0, f < 0.0);
  }
  let uGeo = -(1.0 / (rho * f)) * dpdy;
  let vGeo =  (1.0 / (rho * f)) * dpdx;
  let wMix = clamp(dt * windRelax(), 0.0, 1.0);
  var u1 = mix(u0, uGeo, wMix);
  var v1 = mix(v0, vGeo, wMix);
  let drag = exp(-windDrag() * dt);
  u1 *= drag;
  v1 *= drag;
  let spd = length(vec2<f32>(u1, v1));
  if (spd > maxWind()) {
    let s = maxWind() / max(spd, 1e-6);
    u1 *= s;
    v1 *= s;
  }

  // Semi-Lagrangian advection of T/q/qc using updated wind.
  let xB = f32(gid.x) - (u1 * dt) / mpcX;
  let yB = f32(gid.y) - (v1 * dt) / mpcY;
  let tqc = sampleTQc(xB, yB);
  let qAdv = sampleQ(xB, yB);
  let pAdv = sampleP(xB, yB);
  var T = tqc.x;
  var qc = tqc.y;
  var q: array<f32, MAX_MOISTURE_LAYERS>;
  q[0] = qAdv.x;
  q[1] = qAdv.y;
  q[2] = qAdv.z;
  q[3] = qAdv.w;
  var snow = snow0;
  let layers = moistureLayers();

  // Radiative equilibrium temperature + simple relaxation.
  let latFactor = abs(sinLat);
  let snowCover = clamp(snow, 0.0, 1.0) * (1.0 - ocean);
  let albedoBase = mix(0.22, 0.06, ocean);
  // Wet land darkens and gains thermal inertia.
  let wet = soil0 * (1.0 - ocean);
  albedoBase = mix(albedoBase, 0.12, wet);
  let cloudShade = clamp(qc * 3.0 + rain0 * 4.0, 0.0, 0.7);
  let albedo = mix(albedoBase, 0.75, snowCover);
  let Teq = baseTemp() - 55.0 * latFactor + solarHeatingK() * insolation * (1.0 - cloudShade) * (1.0 - albedo) - (lapseRate() * altM);
  let relaxRate = tempRelax() * mix(1.0, mix(0.6, oceanTempRelaxMul(), ocean), wet);
  T = mix(T, Teq, clamp(dt * relaxRate, 0.0, 1.0));

  // Lift cooling (convergence + orographic).
  let uL = stateSrc[idx(xL, gid.y)].b.y;
  let uR = stateSrc[idx(xR, gid.y)].b.y;
  let vD2 = stateSrc[idx(gid.x, yD)].b.z;
  let vU2 = stateSrc[idx(gid.x, yU)].b.z;
  let div = (uR - uL) * inv2dx + (vU2 - vD2) * inv2dy;
  let wConv = (-div) * scaleHeight();

  let altL = surface[idx(xL, gid.y)].y * mountainHeight();
  let altR = surface[idx(xR, gid.y)].y * mountainHeight();
  let altD = surface[idx(gid.x, yD)].y * mountainHeight();
  let altU = surface[idx(gid.x, yU)].y * mountainHeight();
  let dhdx = (altR - altL) * inv2dx;
  let dhdy = (altU - altD) * inv2dy;
  let wOrog = u1 * dhdx + v1 * dhdy;
  let wLift = clamp(wConv + wOrog, -20.0, 20.0);
  T -= gammaKPerM() * wLift * dt;

  // Evaporation (ocean deficit-based, land soil-based).
  let qs = satMixingRatio(T);
  let deficit = max(0.0, qs - q[0]);
  q[0] += ocean * evapOcean() * insolation * deficit * dt;
  q[0] += (1.0 - ocean) * evapLand() * insolation * soil0 * (1.0 - 0.85 * snowCover) * dt;

  // Configurable moisture layering: diffuse mixing between adjacent layers, enhanced by lift.
  let mixRate = (1.0 / 7200.0) * (0.35 + 0.65 * insolation);
  let liftMix = clamp(abs(wLift) * dt / scaleHeight(), 0.0, 0.25);
  for (var k: u32 = 0u; k < (MAX_MOISTURE_LAYERS - 1u); k = k + 1u) {
    if (k + 1u >= layers) { break; }
    let altFactor = exp(-f32(k) * 0.75);
    let mixAmt = clamp(dt * mixRate * altFactor + liftMix * altFactor, 0.0, 0.35);
    let dq = (q[k] - q[k + 1u]) * mixAmt;
    q[k] -= dq;
    q[k + 1u] += dq;
  }

  // Condensation / evaporation of cloud water.
  let latentK = 2000.0;
  let cloudIdx = select(0u, 1u, layers > 1u);
  if (q[cloudIdx] > qs) {
    let cond = (q[cloudIdx] - qs) * clamp(dt * condenseRate(), 0.0, 1.0);
    q[cloudIdx] -= cond;
    qc += cond;
    T += latentK * cond;
  } else if (qc > 0.0) {
    let evap = min(qs - q[cloudIdx], qc) * clamp(dt * cloudEvapRate(), 0.0, 1.0);
    q[cloudIdx] += evap;
    qc -= evap;
    T -= latentK * evap;
  }

  // Precipitation + soil moisture deposition.
  let qcThresh = 0.001;
  let pr = max(0.0, qc - qcThresh) * clamp(dt * precipRate(), 0.0, 1.0);
  qc -= pr;
  // Snow/rain phase: below freezing, precipitation does not count as "rain" and does not wet soil.
  let liquid = smoothstep(271.15, 275.15, T);
  let prLiquid = pr * liquid;
  let prSnow = pr * (1.0 - liquid);
  var rain = rain0 * exp(-rainDecay() * dt) + prLiquid;
  var soil = clamp(soil0 + prLiquid * (1.0 - ocean) * 400.0, 0.0, 1.0);
  soil *= exp(-dt * (1.0 / 86400.0)); // ~1 day drydown baseline
  snow = clamp(snow + prSnow * (1.0 - ocean) * 650.0, 0.0, 1.0);

  // Snowmelt adds surface wetness.
  let meltFactor = clamp((T - 272.15) / 6.0 + insolation * 0.15, 0.0, 1.0);
  let melt = min(snow, snow * meltFactor * dt * (1.0 / 21600.0)); // ~6h warm-season timescale
  snow -= melt;
  soil = clamp(soil + melt * (1.0 - ocean) * 0.65, 0.0, 1.0);

  // Pressure anomaly relax toward T/q-driven target.
  var qCol = q[0];
  if (layers > 1u) {
    qCol = q[1] + 0.6 * q[0];
    if (layers > 2u) { qCol += 0.35 * q[2]; }
    if (layers > 3u) { qCol += 0.25 * q[3]; }
  }
  let pEq = -(T - baseTemp()) * pTempCoeff() - (qCol * pVaporCoeff()) - (altM * 0.08);
  var p = mix(pAdv, pEq, clamp(dt * pSmooth(), 0.0, 1.0));

  // Clamp.
  T = clamp(T, 180.0, 330.0);
  for (var k: u32 = 0u; k < MAX_MOISTURE_LAYERS; k = k + 1u) {
    q[k] = clamp(q[k], 0.0, 0.05);
  }
  qc = clamp(qc, 0.0, 0.02);
  rain = clamp(rain, 0.0, 0.02);

  // Output packed weather (cloud, rain, pressure, soil).
  let cloud01 = clamp(qc * 600.0, 0.0, 1.0);
  let rain01 = clamp(rain * 800.0, 0.0, 1.0);
  let p01 = clamp(0.5 + p * (1.0 / 6000.0), 0.0, 1.0);
  let soil01 = clamp(soil, 0.0, 1.0);
  outPixels[i] = packRGBA8(cloud01, rain01, p01, soil01);

  // Aux packed weather (temp, snow, windU, windV).
  let cellCount = w * h;
  let temp01 = clamp((T - 240.0) / 70.0, 0.0, 1.0);
  let snow01 = clamp(snow, 0.0, 1.0);
  let u01 = clamp(0.5 + 0.5 * clamp(u1 / maxWind(), -1.0, 1.0), 0.0, 1.0);
  let v01 = clamp(0.5 + 0.5 * clamp(v1 / maxWind(), -1.0, 1.0), 0.0, 1.0);
  outPixels[i + cellCount] = packRGBA8(temp01, snow01, u01, v01);

  stateDst[i] = Cell(vec4<f32>(T, q[0], qc, rain), vec4<f32>(p, u1, v1, soil), vec4<f32>(q[1], q[2], q[3], snow));
}
        `}}const Gb=256,Wb=128,Xb=8;function ml(i,e,t,{wrapS:n=pt,wrapT:s=pt,minFilter:r=Pt,magFilter:a=Pt}={}){const o=new Xn(i,e,t,bt,Dt);return o.needsUpdate=!0,o.wrapS=n,o.wrapT=s,o.minFilter=r,o.magFilter=a,o.generateMipmaps=!1,o.colorSpace=Ft,o}function qb(i){const e=Math.max(1,Math.ceil(Math.sqrt(i))),t=Math.max(1,Math.ceil(i/e));return{tilesX:e,tilesY:t,atlasW:e*i,atlasH:t*i}}class nu{constructor({volumeN:e=Xb,surfaceW:t=Gb,surfaceH:n=Wb}={}){this.volumeN=Math.max(1,Math.min(192,Math.round(e))),this.surfaceW=Math.max(8,Math.min(1024,Math.round(t))),this.surfaceH=Math.max(8,Math.min(1024,Math.round(n))),this.voxelCount=this.volumeN*this.volumeN*this.volumeN,this.surfaceCellCount=this.surfaceW*this.surfaceH;const s=qb(this.volumeN);this.tilesX=s.tilesX,this.tilesY=s.tilesY,this.atlasW=s.atlasW,this.atlasH=s.atlasH,this.atlasPixelCount=this.atlasW*this.atlasH,this.weatherW=this.surfaceW,this.weatherH=this.surfaceH,this.weatherCellCount=this.weatherW*this.weatherH,this.weatherOffset=this.atlasPixelCount,this.auxOffset=this.atlasPixelCount+this.weatherCellCount,this.totalOutPixels=this.atlasPixelCount+this.weatherCellCount*2,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.pipelineCollapse=null,this.bindGroupLayout=null,this.bindGroupsSim=null,this.bindGroupsCollapse=null,this.uniformBuffer=null,this.uniformData=new Float32Array(48),this.stateBuffers=null,this.surfaceBuffer=null,this.surfaceStateBuffers=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.windShear=.6,this.surfaceDrag=.4,this.oceanInertia=.25,this.planetRadiusM=5e5,this.atmoThicknessM=2e4,this.mountainHeightM=8e3,this.volumeTextureData=new Uint8Array(this.atlasPixelCount*4),this.volumeAtlasTexture=ml(this.volumeTextureData,this.atlasW,this.atlasH,{wrapS:pt,wrapT:pt,minFilter:Pt,magFilter:Pt}),this.weatherTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherTexture=ml(this.weatherTextureData,this.weatherW,this.weatherH,{wrapS:yn,wrapT:pt,minFilter:it,magFilter:it}),this.auxTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherAuxTexture=ml(this.auxTextureData,this.weatherW,this.weatherH,{wrapS:yn,wrapT:pt,minFilter:it,magFilter:it})}static async create(e={}){const{device:t,...n}=e,s=new nu(n);return await s.init({device:t}),s}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:n,precipStrength:s,windStrength:r,oceanInertia:a,atmoThicknessM:o,windShear:l,surfaceDrag:c}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(n)&&(this.evapStrength=Math.max(0,n)),Number.isFinite(s)&&(this.precipStrength=Math.max(0,s)),Number.isFinite(r)&&(this.windStrength=Math.max(0,r)),Number.isFinite(a)&&(this.oceanInertia=En(a)),Number.isFinite(o)&&(this.atmoThicknessM=Math.max(1e3,o)),Number.isFinite(l)&&(this.windShear=Math.max(0,l)),Number.isFinite(c)&&(this.surfaceDrag=Math.max(0,c))}getVolumeTexture(){return this.volumeAtlasTexture}getVolumeMeta(){return{n:this.volumeN,tilesX:this.tilesX,tilesY:this.tilesY,atlasW:this.atlasW,atlasH:this.atlasH,extentM:this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,planetRadiusM:this.planetRadiusM,atmoThicknessM:this.atmoThicknessM}}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleVolumeSystem] WebGPU not available; volume weather disabled."),this.enabled=!1;return}const h=await navigator.gpu.requestAdapter();if(!h){console.warn("[WaterCycleVolumeSystem] No GPU adapter found; volume weather disabled."),this.enabled=!1;return}this.device=await h.requestDevice(),this.enabled=!0}const t=this.device,n=32,s=16,r=16,a=this.totalOutPixels*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.voxelCount*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.voxelCount*n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.surfaceCellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.surfaceStateBuffers=[t.createBuffer({size:this.weatherCellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.weatherCellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.outputBuffer=t.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]});const o=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),l=t.createShaderModule({code:this._wgslSim()}),c=t.createShaderModule({code:this._wgslCollapse()});this.pipelineSim=t.createComputePipeline({layout:o,compute:{module:l,entryPoint:"main"}}),this.pipelineCollapse=t.createComputePipeline({layout:o,compute:{module:c,entryPoint:"main"}});const u=({volumeSrc:h,volumeDst:f,surfaceStateSrc:m,surfaceStateDst:g})=>t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:h}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:m}},{binding:5,resource:{buffer:g}},{binding:6,resource:{buffer:this.outputBuffer}}]});this.bindGroupsSim=[u({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),u({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.bindGroupsCollapse=[u({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),u({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.ready=!0}setPlanetSurface({heightmap:e,size:t,seaLevel:n,planetRadiusM:s}={}){if(!this.enabled||!this.ready||!(e&&t&&Number.isFinite(n)))return;Number.isFinite(s)&&(this.planetRadiusM=Math.max(1,s)),this.seaLevel=En(n);const r=qf({heightmap:e,size:t,seaLevel:this.seaLevel,gridWidth:this.surfaceW,gridHeight:this.surfaceH});this.device.queue.writeBuffer(this.surfaceBuffer,0,r),this._resetState(),this.hasSurface=!0}_resetState(){const e=this.volumeN,t=this.voxelCount,n=8,s=new Float32Array(t*n),r=(this.seaLevel-.5)*this.mountainHeightM,a=this.planetRadiusM+r,o=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,c=2*o/Math.max(e,1)*.5,u=288,h=.0065,f=8e3,m=p=>{const d=p-273.15,y=6.112*Math.exp(17.67*d/(d+243.5))*100;return .622*y/Math.max(101325-y,1)};let g=0;for(let p=0;p<e;p++){const _=((p+.5)/e*2-1)*o;for(let y=0;y<e;y++){const E=((y+.5)/e*2-1)*o;for(let T=0;T<e;T++){const R=((T+.5)/e*2-1)*o,M=Math.hypot(R,E,_),S=M-a;let D=0,B=0;if(M>.001){const N=R/M,W=E/M,X=_/M,H=c*(Math.abs(N)+Math.abs(W)+Math.abs(X)),Y=S-H;if(S+H>0&&Y<this.atmoThicknessM){const Q=Math.min(Math.max(Y,0),this.atmoThicknessM),re=Math.abs(W);D=u-55*re-h*Q;const ye=m(D),be=Q<2e3?.85:.55;B=ye*be*Math.exp(-Q/(f*1.25)),Q<2e3&&(s[g+2]=ye*.02)}}s[g+0]=D,s[g+1]=B,s[g+2]=0,s[g+3]=0,s[g+4]=0,s[g+5]=0,s[g+6]=0,s[g+7]=0,g+=n}}}const v=new Float32Array(this.weatherCellCount*4);for(let p=0;p<this.weatherCellCount;p++)v[p*4+0]=.15,v[p*4+1]=0,v[p*4+2]=0,v[p*4+3]=0;this.device.queue.writeBuffer(this.stateBuffers[0],0,s),this.device.queue.writeBuffer(this.stateBuffers[1],0,s),this.device.queue.writeBuffer(this.surfaceStateBuffers[0],0,v),this.device.queue.writeBuffer(this.surfaceStateBuffers[1],0,v),this.simTimeS=0,this.readbackTimerS=0,this.ping=0,this.lastDiag={maxCloud:0,maxRain:0}}update(e,t,n={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const s=Math.min(Math.max(e??0,0),.25),r=Number.isFinite(n.dtSimOverride)?n.dtSimOverride:s*this.timeScale;let a=Math.max(r,0);if(a<=0)return;const l=2*(this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM)/Math.max(this.volumeN,1),c=Math.max(5,60*this.windStrength),u=.25*l/c,f=Math.max(.5,Math.min(10,u)),m=64;this.readbackTimerS+=s;const g=this.device,v=g.createCommandEncoder();let p=0;for(;a>0&&p<m;){const y=Math.min(a,f);if(y<=0)break;a-=y,this.simTimeS+=y,this._writeUniforms(y,this.simTimeS,t);{const x=v.beginComputePass();x.setPipeline(this.pipelineSim),x.setBindGroup(0,this.bindGroupsSim[this.ping]);const E=4;x.dispatchWorkgroups(Math.ceil(this.volumeN/E),Math.ceil(this.volumeN/E),Math.ceil(this.volumeN/E)),x.end()}{const x=v.beginComputePass();x.setPipeline(this.pipelineCollapse),x.setBindGroup(0,this.bindGroupsCollapse[this.ping]),x.dispatchWorkgroups(Math.ceil(this.weatherW/8),Math.ceil(this.weatherH/8)),x.end()}this.ping=1-this.ping,p++}let d=null;if(!!n.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const y=this.readbackWriteIndex&1;this.readbackInFlight[y]||(v.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[y],0,this.totalOutPixels*4),d=y,this.readbackWriteIndex++,this.readbackTimerS=0)}g.queue.submit([v.finish()]),d!==null&&this._scheduleReadback(d)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const n=t.getMappedRange(),s=new Uint8Array(n),r=this.atlasPixelCount*4,a=this.weatherCellCount*4;this.volumeTextureData.set(s.subarray(0,r)),this.weatherTextureData.set(s.subarray(r,r+a)),this.auxTextureData.set(s.subarray(r+a,r+a*2));let o=0,l=0;for(let c=0;c<r;c+=4)this.volumeTextureData[c]>o&&(o=this.volumeTextureData[c]),this.volumeTextureData[c+1]>l&&(l=this.volumeTextureData[c+1]);this.lastDiag.maxCloud=o/255,this.lastDiag.maxRain=l/255,t.unmap(),this.volumeAtlasTexture.needsUpdate=!0,this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0}).catch(n=>{console.warn("[WaterCycleVolumeSystem] Readback failed",n)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,n){const s=this.uniformData,r=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,a=this.volumeN/Math.max(2*r,1e-6),o=Math.max(1,this.volumeN/32);s[0]=this.volumeN,s[1]=this.volumeN,s[2]=this.volumeN,s[3]=e,s[4]=t,s[5]=r,s[6]=a,s[7]=this.planetRadiusM,s[8]=this.atmoThicknessM,s[9]=288,s[10]=.0065,s[11]=8e3,s[12]=(n==null?void 0:n.x)??0,s[13]=(n==null?void 0:n.y)??1,s[14]=(n==null?void 0:n.z)??0,s[15]=2*Math.PI/86400,s[16]=18,s[17]=1/21600;const l=Math.pow(o,3);s[18]=45e-5*this.evapStrength*l,s[19]=16e-5*this.evapStrength*l,s[20]=1/200*l;const c=1/24e4,u=Math.pow(o,3);s[21]=c*this.precipStrength/u,s[22]=1/259200,s[23]=1/259200,s[24]=1/7200*this.windStrength,s[25]=1/14400,s[26]=2e-5,s[27]=60*this.windStrength,s[28]=120,s[29]=45e3,s[30]=1/7200,s[31]=.05/l,s[32]=this.surfaceW,s[33]=this.surfaceH,s[34]=this.weatherW,s[35]=this.weatherH,s[36]=this.atlasW,s[37]=this.atlasH,s[38]=this.tilesX,s[39]=this.tilesY,s[40]=this.weatherOffset,s[41]=this.auxOffset,s[42]=this.oceanInertia,s[43]=0,s[44]=this.mountainHeightM,s[45]=(this.seaLevel-.5)*this.mountainHeightM,s[46]=this.windShear,s[47]=this.surfaceDrag,this.device.queue.writeBuffer(this.uniformBuffer,0,s)}_wgslSim(){return`
struct Voxel {
  a: vec4<f32>, // T, qv, qc, qr
  b: vec4<f32>, // p, vx, vy, vz
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 12>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Voxel>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Voxel>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>; // ocean, elev01, rawHeight, _
@group(0) @binding(4) var<storage, read> surfaceStateSrc: array<vec4<f32>>; // soil, snow, rain, _
@group(0) @binding(5) var<storage, read_write> surfaceStateDst: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> outPixels: array<u32>;

fn N() -> u32 { return u32(params[0].x + 0.5); }
fn dt() -> f32 { return params[0].w; }
fn timeS() -> f32 { return params[1].x; }
fn extentM() -> f32 { return params[1].y; }
fn invVoxelSize() -> f32 { return params[1].z; }
fn planetRadiusM() -> f32 { return params[1].w; }
fn seaOffsetM() -> f32 { return params[11].y; }

fn atmoThicknessM() -> f32 { return params[2].x; }
fn baseTempK() -> f32 { return params[2].y; }
fn lapseRate() -> f32 { return params[2].z; }
fn scaleHeightM() -> f32 { return params[2].w; }

fn sunDir() -> vec3<f32> { return params[3].xyz; }
fn omega() -> f32 { return params[3].w; }

fn solarHeatingK() -> f32 { return params[4].x; }
fn tempRelax() -> f32 { return params[4].y; }
fn evapOcean() -> f32 { return params[4].z; }
fn evapLand() -> f32 { return params[4].w; }

fn condenseRate() -> f32 { return params[5].x; }
fn precipRate() -> f32 { return params[5].y; }
fn rainDecay() -> f32 { return params[5].z; }
fn cloudEvapRate() -> f32 { return params[5].w; }

fn windRelax() -> f32 { return params[6].x; }
fn windDrag() -> f32 { return params[6].y; }
fn coriolisMin() -> f32 { return params[6].z; }
fn maxWind() -> f32 { return params[6].w; }

fn pTempCoeff() -> f32 { return params[7].x; }
fn pVaporCoeff() -> f32 { return params[7].y; }
fn pSmooth() -> f32 { return params[7].z; }
fn fallSpeed() -> f32 { return params[7].w; }

fn surfaceW() -> u32 { return u32(params[8].x + 0.5); }
fn surfaceH() -> u32 { return u32(params[8].y + 0.5); }

fn atlasW() -> u32 { return u32(params[9].x + 0.5); }
fn tilesX() -> u32 { return u32(params[9].z + 0.5); }

fn oceanInertia() -> f32 { return clamp(params[10].z, 0.05, 1.0); }
fn mountainHeightM() -> f32 { return max(params[11].x, 0.0); }
fn windShear() -> f32 { return max(params[11].z, 0.0); }
fn surfaceDrag() -> f32 { return clamp(params[11].w, 0.05, 2.5); }

fn idx3(x: u32, y: u32, z: u32) -> u32 {
  let n = N();
  return (z * n + y) * n + x;
}

fn clampU(v: i32, lo: i32, hi: i32) -> u32 {
  return u32(clamp(v, lo, hi));
}

fn posFromIndex(x: u32, y: u32, z: u32) -> vec3<f32> {
  let n = f32(N());
  let fx = ((f32(x) + 0.5) / n) * 2.0 - 1.0;
  let fy = ((f32(y) + 0.5) / n) * 2.0 - 1.0;
  let fz = ((f32(z) + 0.5) / n) * 2.0 - 1.0;
  return vec3<f32>(fx, fy, fz) * extentM();
}

fn uvwFromPos(pos: vec3<f32>) -> vec3<f32> {
  return clamp(pos / extentM() * 0.5 + vec3<f32>(0.5), vec3<f32>(0.0), vec3<f32>(0.999999));
}

fn sampleNearest(pos: vec3<f32>) -> Voxel {
  let n = f32(N());
  let uvw = uvwFromPos(pos);
  let x = clampU(i32(floor(uvw.x * n)), 0, i32(N()) - 1);
  let y = clampU(i32(floor(uvw.y * n)), 0, i32(N()) - 1);
  let z = clampU(i32(floor(uvw.z * n)), 0, i32(N()) - 1);
  return stateSrc[idx3(x, y, z)];
}

fn surfaceIndexFromDir(dir: vec3<f32>) -> u32 {
  let u = atan2(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
  let v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
  let uu = fract(u);
  let vv = clamp(v, 0.0, 0.999999);
  let x = u32(uu * f32(surfaceW()));
  let y = u32(vv * f32(surfaceH()));
  return y * surfaceW() + x;
}

fn groundAltFromSurface(s: vec4<f32>) -> f32 {
  let ocean = clamp(s.x, 0.0, 1.0);
  let elev01 = clamp(s.y, 0.0, 1.0);
  // Oceans sit at sea level offset; land uses elevation meters.
  return mix(seaOffsetM(), elev01 * mountainHeightM(), 1.0 - ocean);
}

fn satVaporPressurePa(T: f32) -> f32 {
  let Tc = T - 273.15;
  let es_hPa = 6.112 * exp((17.67 * Tc) / (Tc + 243.5));
  return es_hPa * 100.0;
}

fn satMixingRatio(T: f32) -> f32 {
  let e = satVaporPressurePa(T);
  let p = 101325.0;
  let eps = 0.622;
  return (eps * e) / max(p - e, 1.0);
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
  let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
  let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
  let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
  let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
  return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

// Simplex noise for turbulent pressure forcing
fn mod289_3(x: vec3<f32>) -> vec3<f32> { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn mod289_4(x: vec4<f32>) -> vec4<f32> { return x - floor(x * (1.0 / 289.0)) * 289.0; }
fn permute(x: vec4<f32>) -> vec4<f32> { return mod289_4(((x * 34.0) + 1.0) * x); }
fn taylorInvSqrt(r: vec4<f32>) -> vec4<f32> { return 1.79284291400159 - 0.85373472095314 * r; }

fn snoise(v: vec3<f32>) -> f32 {
  let C = vec2<f32>(1.0/6.0, 1.0/3.0);
  let D = vec4<f32>(0.0, 0.5, 1.0, 2.0);
  
  var i = floor(v + dot(v, vec3<f32>(C.y, C.y, C.y)));
  let x0 = v - i + dot(i, vec3<f32>(C.x, C.x, C.x));
  
  let g = step(x0.yzx, x0.xyz);
  let l = 1.0 - g;
  let i1 = min(g.xyz, l.zxy);
  let i2 = max(g.xyz, l.zxy);
  
  let x1 = x0 - i1 + vec3<f32>(C.x, C.x, C.x);
  let x2 = x0 - i2 + vec3<f32>(C.y, C.y, C.y);
  let x3 = x0 - D.yyy;
  
  i = mod289_3(i);
  let p = permute(permute(permute(
    i.z + vec4<f32>(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4<f32>(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4<f32>(0.0, i1.x, i2.x, 1.0));
  
  let n_ = 0.142857142857;
  let ns = n_ * D.wyz - D.xzx;
  
  let j = p - 49.0 * floor(p * ns.z * ns.z);
  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_);
  
  let x = x_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
  let y = y_ * ns.x + vec4<f32>(ns.y, ns.y, ns.y, ns.y);
  let h = 1.0 - abs(x) - abs(y);
  
  let b0 = vec4<f32>(x.xy, y.xy);
  let b1 = vec4<f32>(x.zw, y.zw);
  
  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4<f32>(0.0, 0.0, 0.0, 0.0));
  
  let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw * sh.zzww;
  
  var p0 = vec3<f32>(a0.xy, h.x);
  var p1 = vec3<f32>(a0.zw, h.y);
  var p2 = vec3<f32>(a1.xy, h.z);
  var p3 = vec3<f32>(a1.zw, h.w);
  
  let norm = taylorInvSqrt(vec4<f32>(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  
  var m = max(vec4<f32>(0.6, 0.6, 0.6, 0.6) - vec4<f32>(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4<f32>(0.0, 0.0, 0.0, 0.0));
  m = m * m;
  return 42.0 * dot(m * m, vec4<f32>(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Multi-octave turbulent noise
fn turbulentNoise(p: vec3<f32>, t: f32) -> f32 {
  var n = 0.0;
  // Large-scale pressure systems
  n += snoise(p * 2.0 + vec3<f32>(t * 0.003, 0.0, t * 0.002)) * 1.0;
  // Medium-scale disturbances  
  n += snoise(p * 4.0 + vec3<f32>(t * 0.007, t * 0.005, 0.0)) * 0.5;
  // Smaller turbulent eddies
  n += snoise(p * 8.0 + vec3<f32>(0.0, t * 0.01, t * 0.008)) * 0.25;
  return n;
}

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let n = N();
  if (gid.x >= n || gid.y >= n || gid.z >= n) { return; }

  let i = idx3(gid.x, gid.y, gid.z);
  let pos = posFromIndex(gid.x, gid.y, gid.z);
  let r = length(pos);
  if (r < 1e-3) {
    stateDst[i] = Voxel(vec4<f32>(0.0), vec4<f32>(0.0));
    return;
  }
  let dir = pos / r;

  // Surface coupling (ocean mask + soil/snow from 2D surface state).
  let surfIdx = surfaceIndexFromDir(dir);
  let surf = surface[surfIdx];
  let ocean = clamp(surf.x, 0.0, 1.0);
  let ss = surfaceStateSrc[surfIdx];
  let soil = clamp(ss.x, 0.0, 1.0);
  let snow = clamp(ss.y, 0.0, 1.0);

  // Terrain-aware ground radius so we don't simulate atmosphere under sea level or inside mountains.
  let groundR = planetRadiusM() + groundAltFromSurface(surf);
  let altCenter = r - groundR;
  // Approx radial reach of this voxel along the radial direction (reduces near-surface altitude bias at low N).
  let halfVoxelM = 0.5 / max(invVoxelSize(), 1e-9);
  let halfRadialM = halfVoxelM * (abs(dir.x) + abs(dir.y) + abs(dir.z));
  let altMin = altCenter - halfRadialM;
  let altMax = altCenter + halfRadialM;
  let inAtmo = (altMax > 0.0) && (altMin < atmoThicknessM());
  let altEff = clamp(altMin, 0.0, atmoThicknessM());

  // Outside atmosphere shell: damp to zero quickly to avoid garbage.
  if (!inAtmo) {
    stateDst[i] = Voxel(vec4<f32>(0.0), vec4<f32>(0.0));
    // Still write atlas pixel so we don't leave stale data in used voxels.
    let tx = gid.z % tilesX();
    let ty = gid.z / tilesX();
    let ax = tx * n + gid.x;
    let ay = ty * n + gid.y;
    outPixels[ay * atlasW() + ax] = packRGBA8(0.0, 0.0, 0.5, 0.0);
    return;
  }

  let s0 = stateSrc[i];
  let vel0 = s0.b.yzw;

  // Semi-Lagrangian advection (nearest for now; stable + fast).
  let posBack = pos - vel0 * dt();
  let sAdv = sampleNearest(posBack);

  // Rain sedimentation: advect with additional radial fall speed.
  let posBackRain = pos - (vel0 - dir * fallSpeed()) * dt();
  let sRain = sampleNearest(posBackRain);

  var T = sAdv.a.x;
  var qv = sAdv.a.y;
  var qc = sAdv.a.z;
  var qr = sRain.a.w * exp(-rainDecay() * dt());
  var p = sAdv.b.x;
  var vel = sAdv.b.yzw;

  // Radiative equilibrium temperature proxy.
  let insolation = max(dot(dir, normalize(sunDir())), 0.0);
  // Simple cloud shading: attenuate insolation by in-column cloud/rain.
  let cloudShade = clamp(qc * 3.0 + qr * 6.0, 0.0, 0.7);
  // Keep a floor so the sun-facing half still evaporates when the sun is low.
  let insFloor = max(insolation, 0.2) * (1.0 - cloudShade);
  let latFactor = abs(dir.y);
  let snowCover = snow * (1.0 - ocean);
  var albedoBase = mix(0.22, 0.06, ocean);
  // Wet land darkens and gains thermal mass.
  let wetFactor = soil * (1.0 - ocean);
  albedoBase = mix(albedoBase, 0.12, wetFactor);
  let albedo = mix(albedoBase, 0.75, snowCover);
  let Teq = baseTempK() - 55.0 * latFactor + solarHeatingK() * insFloor * (1.0 - albedo) - (lapseRate() * altEff);
  let relaxRate = tempRelax() * mix(1.0, mix(0.65, oceanInertia(), ocean), wetFactor);
  T = mix(T, Teq, clamp(dt() * relaxRate, 0.0, 1.0));

  // Convergence lift proxy (uses full divergence as a cheap stand-in).
  let inv2dx = 0.5 * invVoxelSize();
  let xL = clampU(i32(gid.x) - 1, 0, i32(n) - 1);
  let xR = clampU(i32(gid.x) + 1, 0, i32(n) - 1);
  let yD = clampU(i32(gid.y) - 1, 0, i32(n) - 1);
  let yU = clampU(i32(gid.y) + 1, 0, i32(n) - 1);
  let zB = clampU(i32(gid.z) - 1, 0, i32(n) - 1);
  let zF = clampU(i32(gid.z) + 1, 0, i32(n) - 1);

  let vL = stateSrc[idx3(xL, gid.y, gid.z)].b.yzw;
  let vR = stateSrc[idx3(xR, gid.y, gid.z)].b.yzw;
  let vD = stateSrc[idx3(gid.x, yD, gid.z)].b.yzw;
  let vU = stateSrc[idx3(gid.x, yU, gid.z)].b.yzw;
  let vB = stateSrc[idx3(gid.x, gid.y, zB)].b.yzw;
  let vF = stateSrc[idx3(gid.x, gid.y, zF)].b.yzw;

  let div = (vR.x - vL.x) * inv2dx + (vU.y - vD.y) * inv2dx + (vF.z - vB.z) * inv2dx;
  let wConv = (-div) * scaleHeightM();
  
  // Orographic lift from terrain slope projected into local east/north wind.
  let sw = surfaceW();
  let sh = surfaceH();
  let sx = surfIdx % sw;
  let sy = surfIdx / sw;
  let xLs = (sx + sw - 1u) % sw;
  let xRs = (sx + 1u) % sw;
  let yDs = u32(max(i32(sy) - 1, 0));
  let yUs = u32(min(i32(sy) + 1, i32(sh) - 1));

  let altL = groundAltFromSurface(surface[sy * sw + xLs]);
  let altR = groundAltFromSurface(surface[sy * sw + xRs]);
  let altD = groundAltFromSurface(surface[yDs * sw + sx]);
  let altU = groundAltFromSurface(surface[yUs * sw + sx]);

  let cosLat = max(sqrt(max(1.0 - dir.y * dir.y, 0.0)), 0.08);
  let dxM = 2.0 * 3.14159265 * planetRadiusM() * cosLat / f32(sw);
  let dyM = 3.14159265 * planetRadiusM() / f32(sh);
  let dhdx = (altR - altL) * (0.5 / max(dxM, 1.0));
  let dhdy = (altU - altD) * (0.5 / max(dyM, 1.0));

  let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(dir.y) > 0.99);
  let east = normalize(cross(up, dir));
  let north = normalize(cross(dir, east));
  let velHoriz = vel - dir * dot(vel, dir);
  let uEast = dot(velHoriz, east);
  let vNorth = dot(velHoriz, north);
  let orogMask = exp(-altEff / 4500.0);
  let wOrog = (uEast * dhdx + vNorth * dhdy) * orogMask;

  let wLift = clamp(wConv + wOrog, -20.0, 20.0);
  T -= 0.0098 * wLift * dt();

  // Evaporation near surface.
  let qs = satMixingRatio(T);
  let deficit = max(0.0, qs - qv);
  let nearSurface = select(0.0, 1.0, altEff < 2000.0);
  qv += nearSurface * ocean * evapOcean() * insFloor * deficit * dt();
  qv += nearSurface * (1.0 - ocean) * evapLand() * insFloor * soil * (1.0 - 0.85 * snowCover) * dt();
  // Keep a minimum humidity reservoir near the surface so it can't dry out completely.
  let qMin = qs * 0.35;
  qv = max(qv, nearSurface * qMin + (1.0 - nearSurface) * qv);
  // Seed a tiny cloud amount near the surface to kickstart visuals/stability.
  let seedQc = nearSurface * insFloor * (0.0015 + 0.0015 * ocean);
  let take = min(seedQc, qv * 0.7);
  qv -= take;
  qc += take;

  // Condensation / evaporation of cloud water.
  let latentK = 2000.0;
  if (qv > qs) {
    let cond = (qv - qs) * clamp(dt() * condenseRate(), 0.0, 1.0);
    qv -= cond;
    qc += cond;
    T += latentK * cond;
  } else if (qc > 0.0) {
    let evap = min(qs - qv, qc) * clamp(dt() * cloudEvapRate(), 0.0, 1.0);
    qv += evap;
    qc -= evap;
    T -= latentK * evap;
  }

  // Precipitation generation.
  // Threshold tuned so small clouds survive; autoconversion is slow.
  let qcThresh = 0.0015;
  let pr = max(0.0, qc - qcThresh) * clamp(dt() * precipRate(), 0.0, 1.0);
  qc -= pr;
  qr += pr;

  // Pressure relax toward a T/q-driven target.
  // Base pressure centered at 0 - warm/moist = low (negative), cold/dry = high (positive)
  // REDUCED coefficients to keep pressure in a sensible range [-3000, +3000]
  let tempAnomaly = (T - baseTempK());  // + = warm, - = cold
  let moistAnomaly = qv * 500.0;         // Reduced: More vapor = lower pressure
  let altPenalty = altEff * 0.01;        // Reduced: Higher = lower pressure
  let pPhysics = -tempAnomaly * 10.0 - moistAnomaly - altPenalty;
  
  // Turbulent noise for weather systems - REDUCED strength to stay in range
  let turbStrength = 2500.0;  // Reduced from 5000
  let noisePos = dir * 4.0;   // Higher spatial frequency for more distinct cells
  let noiseTime = timeS() * 0.001;  // Faster evolution  
  let pTurb = turbulentNoise(noisePos, noiseTime) * turbStrength;
  
  // Hadley cell structure - latitude-dependent pressure bands
  // Subtropical highs at ~30°, polar highs at poles, ITCZ low at equator
  let latAbs = abs(dir.y);
  // Subtropical high pressure belt (stronger)
  let subtropicalHigh = exp(-pow((latAbs - 0.5) / 0.2, 2.0)) * 1500.0;
  // Equatorial low (ITCZ)
  let itczLow = exp(-pow(latAbs / 0.15, 2.0)) * -1200.0;
  // Polar high (weaker)
  let polarHigh = smoothstep(0.7, 0.95, latAbs) * 800.0;
  let hadleyP = subtropicalHigh + itczLow + polarHigh;
  
  let pEq = pPhysics + pTurb + hadleyP;
  
  // Faster relaxation so pressure systems develop quickly
  p = mix(p, pEq, clamp(dt() * pSmooth() * 3.0, 0.0, 1.0));

  // Wind from geostrophic balance in the local tangent plane + weak ageostrophic convergence.
  let pL = stateSrc[idx3(xL, gid.y, gid.z)].b.x;
  let pR = stateSrc[idx3(xR, gid.y, gid.z)].b.x;
  let pD = stateSrc[idx3(gid.x, yD, gid.z)].b.x;
  let pU = stateSrc[idx3(gid.x, yU, gid.z)].b.x;
  let pB = stateSrc[idx3(gid.x, gid.y, zB)].b.x;
  let pF = stateSrc[idx3(gid.x, gid.y, zF)].b.x;
  let dpdx = (pR - pL) * inv2dx;
  let dpdy = (pU - pD) * inv2dx;
  let dpdz = (pF - pB) * inv2dx;
  let gradP = vec3<f32>(dpdx, dpdy, dpdz);
  let gradH = gradP - dir * dot(gradP, dir);

  var f = 2.0 * omega() * dir.y;
  if (abs(f) < coriolisMin()) {
    f = select(-coriolisMin(), coriolisMin(), f >= 0.0);
  }
  let rho = 1.2;
  let vGeo = cross(dir, gradH) * (1.0 / (rho * f));
  let vAgeo = -gradH * 0.012;
  let vTarget = vGeo + vAgeo;

  vel = mix(vel, vTarget, clamp(dt() * windRelax(), 0.0, 1.0));
  vel *= exp(-windDrag() * dt());
  let altFrac = clamp(altEff / max(atmoThicknessM(), 1e-3), 0.0, 1.0);
  // Boundary-layer drag slows near-surface winds; upper levels can accelerate into jets.
  let blDrag = mix(surfaceDrag(), 1.0, smoothstep(0.05, 0.4, altFrac));
  let jetGain = mix(0.85, 1.25, smoothstep(0.15, 0.9, altFrac));
  vel *= blDrag * jetGain;
  // Turn winds with height to create vertical shear/veering.
  let veer = (altFrac - 0.35) * windShear();
  let vHoriz = vel - dir * dot(vel, dir);
  let vEast0 = dot(vHoriz, east);
  let vNorth0 = dot(vHoriz, north);
  let ca = cos(veer);
  let sa = sin(veer);
  let vEast = vEast0 * ca - vNorth0 * sa;
  let vNorthShear = vEast0 * sa + vNorth0 * ca;
  let vSheared = east * vEast + north * vNorthShear;
  let vVert = dir * dot(vel, dir);
  vel = vSheared + vVert;
  // Add a gentle vertical component from vertical pressure gradients to build stacked systems.
  let wP = clamp(-dpdz * 0.0015, -8.0, 8.0);
  vel += dir * wP;
  // Add a small vertical component for convection/uplift so moisture can become volumetric.
  let topFrac = clamp(altEff / max(atmoThicknessM(), 1e-3), 0.0, 1.0);
  let wDamp = 1.0 - smoothstep(0.70, 1.0, topFrac);
  vel += dir * clamp(wLift, -8.0, 8.0) * 0.25 * wDamp;
  let maxAltWind = mix(maxWind() * 0.65, maxWind() * 1.35, smoothstep(0.08, 0.95, altFrac));
  let sp = length(vel);
  if (sp > maxAltWind) {
    vel *= maxAltWind / max(sp, 1e-3);
  }

  // Clamp.
  T = clamp(T, 180.0, 330.0);
  qv = clamp(qv, 0.0, 0.05);
  qc = clamp(qc, 0.0, 0.02);
  qr = clamp(qr, 0.0, 0.02);

  stateDst[i] = Voxel(vec4<f32>(T, qv, qc, qr), vec4<f32>(p, vel));

  // Pack volume atlas with wind tell-tail visualization
  let scaleN = max(1.0, 64.0 / f32(N())); // higher res → scale up visibility
  let cloud01 = clamp(qc * 8000.0 * scaleN, 0.0, 1.0);
  let rain01 = clamp(qr * 800.0, 0.0, 1.0);
  let p01 = clamp(0.5 + p * (1.0 / 6000.0), 0.0, 1.0);
  let rh01 = clamp(select(0.0, qv / max(qs, 1e-6), qs > 0.0), 0.0, 1.0);

  let tx = gid.z % tilesX();
  let ty = gid.z / tilesX();
  let ax = tx * n + gid.x;
  let ay = ty * n + gid.y;
  
  // Wind tell-tail: draw lines showing wind direction, colored by pressure
  let windMag = length(vel);
  let windSpeed01 = clamp(windMag / maxWind(), 0.0, 1.0);
  
  // Pressure coloring: RED = low pressure (cyclone), BLUE = high pressure (anticyclone)
  let lowP = clamp((0.5 - p01) * 4.0, 0.0, 1.0);   // Red intensity for low pressure
  let highP = clamp((p01 - 0.5) * 4.0, 0.0, 1.0);  // Blue intensity for high pressure
  
  // Base color shows pressure system type vividly
  var baseR = lowP * 0.9 + highP * 0.1;     // Red for low pressure
  var baseG = 0.15 + windSpeed01 * 0.3;      // Green shows wind strength
  var baseB = highP * 0.9 + lowP * 0.1;     // Blue for high pressure
  
  // Brighten based on wind magnitude
  let brightness = 0.3 + windSpeed01 * 0.7;
  baseR = baseR * brightness;
  baseG = baseG * brightness;
  baseB = baseB * brightness;
  
  // Add cloud overlay (white)
  baseR = baseR + cloud01 * 0.5;
  baseG = baseG + cloud01 * 0.5;
  baseB = baseB + cloud01 * 0.5;
  
  // Draw the base cell
  outPixels[ay * atlasW() + ax] = packRGBA8(baseR, baseG, baseB, 1.0);
  
  // Draw wind tell-tail as bright line extending from this cell in wind direction
  // Only draw if this is a "leader" cell (every other cell draws the tail)
  if (windMag > 1.0 && (gid.x % 2u == 0u) && (gid.y % 2u == 0u)) {
    // Normalize wind direction in 3D space, project to XY of voxel grid
    let windDir = vel / max(windMag, 1e-6);
    
    // Length of tail based on wind speed (1-3 cells)
    let tailLen = 1u + u32(windSpeed01 * 2.0);
    
    // Draw the tail line - bright white/yellow
    let tailR = 1.0;
    let tailG = 0.9;
    let tailB = 0.2;
    
    for (var step: u32 = 1u; step <= tailLen; step = step + 1u) {
      // Calculate tail position based on wind direction
      let offsetX = i32(round(windDir.x * f32(step) * 1.5));
      let offsetY = i32(round(windDir.y * f32(step) * 1.5));
      
      let tailX = i32(gid.x) + offsetX;
      let tailY = i32(gid.y) + offsetY;
      
      // Bounds check within this tile
      if (tailX >= 0 && tailX < i32(n) && tailY >= 0 && tailY < i32(n)) {
        let tailAx = tx * n + u32(tailX);
        let tailAy = ty * n + u32(tailY);
        
        // Fade tail brightness with distance
        let fade = 1.0 - f32(step) / f32(tailLen + 1u);
        outPixels[tailAy * atlasW() + tailAx] = packRGBA8(
          tailR * fade + baseR * (1.0 - fade),
          tailG * fade + baseG * (1.0 - fade),
          tailB * fade + baseB * (1.0 - fade),
          1.0
        );
      }
    }
  }

}
        `}_wgslCollapse(){return`
struct Voxel {
  a: vec4<f32>, // T, qv, qc, qr
  b: vec4<f32>, // p, vx, vy, vz
};

@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 12>;
@group(0) @binding(1) var<storage, read> stateSrc: array<Voxel>;
@group(0) @binding(2) var<storage, read_write> stateDst: array<Voxel>;
@group(0) @binding(3) var<storage, read> surface: array<vec4<f32>>;
@group(0) @binding(4) var<storage, read> surfaceStateSrc: array<vec4<f32>>; // soil, snow, rain, _
@group(0) @binding(5) var<storage, read_write> surfaceStateDst: array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> outPixels: array<u32>;

fn N() -> u32 { return u32(params[0].x + 0.5); }
fn dt() -> f32 { return params[0].w; }
fn extentM() -> f32 { return params[1].y; }
fn invVoxelSize() -> f32 { return params[1].z; }
fn planetRadiusM() -> f32 { return params[1].w; }

fn atmoThicknessM() -> f32 { return params[2].x; }
fn sunDir() -> vec3<f32> { return params[3].xyz; }

fn maxWind() -> f32 { return params[6].w; }

fn surfaceW() -> u32 { return u32(params[8].x + 0.5); }
fn surfaceH() -> u32 { return u32(params[8].y + 0.5); }
fn weatherW() -> u32 { return u32(params[8].z + 0.5); }
fn weatherH() -> u32 { return u32(params[8].w + 0.5); }

fn weatherOffset() -> u32 { return u32(params[10].x + 0.5); }
fn auxOffset() -> u32 { return u32(params[10].y + 0.5); }
fn mountainHeightM() -> f32 { return max(params[11].x, 0.0); }
fn seaOffsetM() -> f32 { return params[11].y; }

fn idx3(x: u32, y: u32, z: u32) -> u32 {
  let n = N();
  return (z * n + y) * n + x;
}

fn clampU(v: i32, lo: i32, hi: i32) -> u32 {
  return u32(clamp(v, lo, hi));
}

fn uvwFromPos(pos: vec3<f32>) -> vec3<f32> {
  return clamp(pos / extentM() * 0.5 + vec3<f32>(0.5), vec3<f32>(0.0), vec3<f32>(0.999999));
}

fn sampleNearest(pos: vec3<f32>) -> Voxel {
  let n = f32(N());
  let uvw = uvwFromPos(pos);
  let x = clampU(i32(floor(uvw.x * n)), 0, i32(N()) - 1);
  let y = clampU(i32(floor(uvw.y * n)), 0, i32(N()) - 1);
  let z = clampU(i32(floor(uvw.z * n)), 0, i32(N()) - 1);
  return stateSrc[idx3(x, y, z)];
}

fn surfaceIndexFromDir(dir: vec3<f32>) -> u32 {
  let u = atan2(dir.z, dir.x) / (2.0 * 3.14159265) + 0.5;
  let v = asin(clamp(dir.y, -1.0, 1.0)) / 3.14159265 + 0.5;
  let uu = fract(u);
  let vv = clamp(v, 0.0, 0.999999);
  let x = u32(uu * f32(surfaceW()));
  let y = u32(vv * f32(surfaceH()));
  return y * surfaceW() + x;
}

fn groundAltFromSurface(s: vec4<f32>) -> f32 {
  let ocean = clamp(s.x, 0.0, 1.0);
  let elev01 = clamp(s.y, 0.0, 1.0);
  // Must match sim shader: oceans at sea level offset, land at elevation
  return mix(seaOffsetM(), elev01 * mountainHeightM(), 1.0 - ocean);
}

fn packRGBA8(r: f32, g: f32, b: f32, a: f32) -> u32 {
  let R = u32(clamp(r, 0.0, 1.0) * 255.0 + 0.5);
  let G = u32(clamp(g, 0.0, 1.0) * 255.0 + 0.5);
  let B = u32(clamp(b, 0.0, 1.0) * 255.0 + 0.5);
  let A = u32(clamp(a, 0.0, 1.0) * 255.0 + 0.5);
  return (A << 24u) | (B << 16u) | (G << 8u) | R;
}

fn directionFromLatLon(lat: f32, lon: f32) -> vec3<f32> {
  let cl = cos(lat);
  return vec3<f32>(cl * cos(lon), sin(lat), cl * sin(lon));
}

fn makeBasis(dir: vec3<f32>) -> mat3x3<f32> {
  let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(dir.y) > 0.99);
  let east = normalize(cross(up, dir));
  let north = normalize(cross(dir, east));
  return mat3x3<f32>(east, north, dir);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= weatherW() || gid.y >= weatherH()) { return; }
  let w = weatherW();
  let h = weatherH();
  let i2 = gid.y * w + gid.x;

  let u = (f32(gid.x) + 0.5) / f32(w);
  let v = (f32(gid.y) + 0.5) / f32(h);
  let lat = (v - 0.5) * 3.14159265;
  let lon = (u - 0.5) * 2.0 * 3.14159265;
  let dir = directionFromLatLon(lat, lon);

  let surfIdx = surfaceIndexFromDir(dir);
  let surf = surface[surfIdx];
  let ocean = clamp(surf.x, 0.0, 1.0);
  var groundR = planetRadiusM() + groundAltFromSurface(surf);
  // Ensure ocean columns start at sea surface, not base planet radius.
  groundR = max(groundR, planetRadiusM() + seaOffsetM());

  let ss0 = surfaceStateSrc[i2];
  var soil = clamp(ss0.x, 0.0, 1.0);
  var snow = clamp(ss0.y, 0.0, 1.0);
  var rain = clamp(ss0.z, 0.0, 0.02);
  var runoff = clamp(ss0.w, 0.0, 1.0);

  // Integrate along the column to form 2D maps.
  var maxQc = 0.0;
  var maxQr = 0.0;
  var pSum = 0.0;
  var pCount = 0.0;
  var Tsurf = 280.0;
  var velSample = vec3<f32>(0.0);

  // Sample more layers so thin clouds are captured in the 2D maps.
  // Also average pressure across the lower atmosphere for a stable signal.
  let steps: u32 = 32u;
  for (var k: u32 = 0u; k < steps; k = k + 1u) {
    let t = (f32(k) + 0.5) / f32(steps);
    let r = groundR + t * atmoThicknessM();
    let pos = dir * r;
    let s = sampleNearest(pos);
    maxQc = max(maxQc, s.a.z);
    maxQr = max(maxQr, s.a.w);
    if (k == 0u) { Tsurf = s.a.x; }
    // Average pressure across lower half of atmosphere for more stable signal
    if (k < steps / 2u) { 
      pSum += s.b.x; 
      pCount += 1.0;
    }
    if (k == 3u) { velSample = s.b.yzw; }
  }
  let pMid = select(0.0, pSum / pCount, pCount > 0.0);

  // If 3D sampling didn't get good pressure data, use latitude-based Hadley pattern directly
  // This ensures the 2D texture shows proper pressure variation even with coarse voxels
  let latAbs = abs(dir.y);
  // Subtropical high pressure belt at ~30° latitude
  let subtropicalHigh = exp(-pow((latAbs - 0.5) / 0.2, 2.0)) * 1500.0;
  // Equatorial low (ITCZ)
  let itczLow = exp(-pow(latAbs / 0.15, 2.0)) * -1200.0;
  // Polar high
  let polarHigh = smoothstep(0.7, 0.95, latAbs) * 800.0;
  let hadleyP = subtropicalHigh + itczLow + polarHigh;
  
  // Blend sampled pressure with analytical Hadley pattern
  // If pMid is near zero (no valid voxel data), use pure Hadley
  let pMidValid = select(0.0, 1.0, abs(pMid) > 10.0);
  let pFinal = mix(hadleyP, pMid, pMidValid * 0.7);

  // Update surface rain/soil/snow (simple persistence).
  let liquid = smoothstep(271.15, 275.15, Tsurf);
  let prLiquid = maxQr * liquid;
  let prSnow = maxQr * (1.0 - liquid);
  rain = rain * exp(-params[5].z * dt()) + prLiquid; // rainDecay in params[5].z
  soil = clamp(soil + prLiquid * (1.0 - ocean) * 400.0, 0.0, 1.0);
  soil *= exp(-dt() * (1.0 / 86400.0));
  snow = clamp(snow + prSnow * (1.0 - ocean) * 650.0, 0.0, 1.0);

  let insolation = max(dot(dir, normalize(sunDir())), 0.0);
  let meltFactor = clamp((Tsurf - 272.15) / 6.0 + insolation * 0.15, 0.0, 1.0);
  let melt = min(snow, snow * meltFactor * dt() * (1.0 / 21600.0));
  snow -= melt;
  soil = clamp(soil + melt * (1.0 - ocean) * 0.65, 0.0, 1.0);
  runoff = clamp(runoff + prLiquid * 120.0 + prSnow * 80.0 + melt * 60.0, 0.0, 5.0);
  runoff *= exp(-dt() * (1.0 / 172800.0)); // 2-day decay
  // Glacier formation proxy: excess snow turns into slow-decay runoff/glacier store.
  let glacier = max(0.0, snow - 1.0);
  snow = min(snow, 1.0);
  runoff = min(runoff + glacier * 0.2, 5.0);

  surfaceStateDst[i2] = vec4<f32>(soil, snow, rain, runoff);

  // Main weather map (cloud, rain, pressure, soil).
  // If column is very humid but maxQc is tiny, boost cloud to make it visible.
  var cloud01 = clamp(maxQc * 600.0, 0.0, 1.0);
  let rain01 = clamp(rain * 800.0, 0.0, 1.0);
  // Use pFinal (blended with analytical Hadley pattern) for stable pressure visualization
  let p01 = clamp(0.5 + pFinal * (1.0 / 6000.0), 0.0, 1.0);
  outPixels[weatherOffset() + i2] = packRGBA8(cloud01, rain01, p01, clamp(soil, 0.0, 1.0));

  // Aux map (temp, snow, windU, windV) where wind is (east,north).
  let temp01 = clamp((Tsurf - 240.0) / 70.0, 0.0, 1.0);
  let snow01 = clamp(snow, 0.0, 1.0);

  // If column is very humid/warm (temp01 high) but cloud is tiny, nudge visibility.
  if (cloud01 < 0.02 && maxQr < 1e-4) {
    cloud01 = max(cloud01, temp01 * 0.25);
  }

  let basis = makeBasis(dir);
  let windEast = dot(velSample, basis[0]);
  let windNorth = dot(velSample, basis[1]);
  let u01 = clamp(0.5 + 0.5 * clamp(windEast / maxWind(), -1.0, 1.0), 0.0, 1.0);
  let v01 = clamp(0.5 + 0.5 * clamp(windNorth / maxWind(), -1.0, 1.0), 0.0, 1.0);
  outPixels[auxOffset() + i2] = packRGBA8(temp01, snow01, u01, v01);

}
        `}}const Qh=(()=>{const i=new Uint8Array([0,0,0,0]),e=new Xn(i,1,1,bt,Dt);return e.needsUpdate=!0,e.wrapS=yn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Ft,e})();class Yb{constructor(e,{maxDrops:t=12e3}={}){this.scene=e,this.maxDrops=Math.max(0,Math.floor(t)),this.enabled=!0,this.uniforms={time:{value:0},color:{value:new xe("#bfe8ff")},opacity:{value:.55},strength:{value:1},density:{value:.65},rainThreshold:{value:.03},volumeRadius:{value:.012},volumeHeight:{value:.012},fallDistance:{value:.016},fallSpeed:{value:.35},dropLength:{value:25e-5},dropWidth:{value:5e-5},planetNearRadius:{value:12},nearMargin:{value:.35},weatherMap:{value:Qh},planetInvRot:{value:new Le},planetInvScale:{value:1},windWorld:{value:new P(0,0,0)},windTilt:{value:.65}},this.mesh=this._buildMesh(),this.mesh.visible=this.enabled,this.mesh.frustumCulled=!1,this.mesh.renderOrder=1.2,e.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWeatherMap(e){this.uniforms.weatherMap.value=e??Qh}setWeatherFrame({planetInvRot:e,planetInvScale:t}){e&&this.uniforms.planetInvRot.value.copy(e),Number.isFinite(t)&&(this.uniforms.planetInvScale.value=t)}setWindWorld(e){e&&this.uniforms.windWorld.value.copy(e)}setPlanetNearRadius(e){Number.isFinite(e)&&(this.uniforms.planetNearRadius.value=Math.max(.1,e))}setStrength(e){Number.isFinite(e)&&(this.uniforms.strength.value=Math.max(0,e))}setDensity(e){Number.isFinite(e)&&(this.uniforms.density.value=Math.min(Math.max(e,0),1))}setSizes({volumeRadius:e,volumeHeight:t,fallDistance:n,dropLength:s,dropWidth:r}={}){Number.isFinite(e)&&(this.uniforms.volumeRadius.value=Math.max(0,e)),Number.isFinite(t)&&(this.uniforms.volumeHeight.value=Math.max(0,t)),Number.isFinite(n)&&(this.uniforms.fallDistance.value=Math.max(0,n)),Number.isFinite(s)&&(this.uniforms.dropLength.value=Math.max(0,s)),Number.isFinite(r)&&(this.uniforms.dropWidth.value=Math.max(0,r))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new tr(1,1,1,1),t=new wf;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const n=new Float32Array(this.maxDrops*3),s=new Float32Array(this.maxDrops);for(let a=0;a<this.maxDrops;a++){const o=a*3;n[o+0]=Math.random()*2-1,n[o+1]=Math.random(),n[o+2]=Math.random()*2-1,s[a]=Math.random()}t.setAttribute("aOffset",new Qa(n,3)),t.setAttribute("aSeed",new Qa(s,1)),t.instanceCount=this.maxDrops;const r=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!0,side:An,blending:Wn,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>

                attribute vec3 aOffset;
                attribute float aSeed;

                uniform float time;
                uniform float density;

                uniform float volumeRadius;
                uniform float volumeHeight;
                uniform float fallDistance;
                uniform float fallSpeed;
                uniform float dropLength;
                uniform float dropWidth;

                uniform float planetNearRadius;
                uniform float nearMargin;

                uniform mat3 planetInvRot;
                uniform float planetInvScale;
                uniform vec3 windWorld;
                uniform float windTilt;

                varying vec2 vWeatherUV;
                varying float vSeed;
                varying float vVisible;
                varying vec2 vUV;

                vec3 safeNormalize(vec3 v) {
                    float l = length(v);
                    if (l < 1e-6) return vec3(0.0, 1.0, 0.0);
                    return v / l;
                }

                vec3 basisEast(vec3 up) {
                    vec3 axis = vec3(0.0, 1.0, 0.0);
                    vec3 e = cross(axis, up);
                    if (length(e) < 1e-5) {
                        axis = vec3(1.0, 0.0, 0.0);
                        e = cross(axis, up);
                    }
                    return safeNormalize(e);
                }

                void main() {
                    vUV = uv;
                    vSeed = aSeed;
                    if (aSeed > density) {
                        vVisible = 0.0;
                        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
                        return;
                    }

                    // Disable rain when the camera is far from the surface (orbit view).
                    vec3 camLocal = planetInvRot * (cameraPosition * planetInvScale);
                    float camR = length(camLocal);
                    float camNear = 1.0 - smoothstep(planetNearRadius + nearMargin, planetNearRadius + nearMargin * 3.0, camR);
                    if (camNear <= 0.001) {
                        vVisible = 0.0;
                        gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
                        return;
                    }

                    vec3 upWorld = safeNormalize(cameraPosition);
                    vec3 eastWorld = basisEast(upWorld);
                    vec3 northWorld = safeNormalize(cross(upWorld, eastWorld));

                    float t = fract(time * fallSpeed + aSeed * 31.7);
                    vec3 offsetWorld = eastWorld * (aOffset.x * volumeRadius)
                        + northWorld * (aOffset.z * volumeRadius)
                        + upWorld * (aOffset.y * volumeHeight)
                        - upWorld * (t * fallDistance);

                    vec3 basePosWorld = cameraPosition + offsetWorld;
                    vec3 basePosLocal = planetInvRot * (basePosWorld * planetInvScale);
                    vec3 dirLocal = safeNormalize(basePosLocal);
                    float wu = atan(dirLocal.z, dirLocal.x) / (2.0 * 3.14159265) + 0.5;
                    float wv = asin(clamp(dirLocal.y, -1.0, 1.0)) / 3.14159265 + 0.5;
                    vWeatherUV = vec2(wu, wv);

                    vec3 downWorld = -upWorld;
                    vec3 fallDirWorld = safeNormalize(downWorld + windWorld * windTilt);
                    vec3 viewDirWorld = safeNormalize(cameraPosition - basePosWorld);
                    vec3 rightWorld = cross(viewDirWorld, fallDirWorld);
                    float rl = length(rightWorld);
                    if (rl < 1e-5) rightWorld = eastWorld;
                    else rightWorld /= rl;

                    float widthCoord = (uv.x - 0.5) * dropWidth;
                    float along = uv.y * dropLength;
                    vec3 worldPos = basePosWorld + rightWorld * widthCoord + fallDirWorld * along;

                    vVisible = camNear;
                    vec4 mv = viewMatrix * vec4(worldPos, 1.0);
                    gl_Position = projectionMatrix * mv;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>

                uniform sampler2D weatherMap;
                uniform vec3 color;
                uniform float opacity;
                uniform float strength;
                uniform float rainThreshold;

                varying vec2 vWeatherUV;
                varying float vSeed;
                varying float vVisible;
                varying vec2 vUV;

                void main() {
                    #include <logdepthbuf_fragment>

                    if (vVisible <= 0.001) discard;

                    vec4 w = texture2D(weatherMap, vWeatherUV);
                    float rainNow = w.g;
                    float rainFactor = smoothstep(rainThreshold, rainThreshold + 0.18, rainNow);

                    float across = abs(vUV.x - 0.5) * 2.0;
                    float core = 1.0 - smoothstep(0.65, 1.0, across);
                    float taper = smoothstep(0.0, 0.08, vUV.y) * (1.0 - smoothstep(0.85, 1.0, vUV.y));

                    float a = opacity * strength * rainFactor * core * taper * vVisible;
                    if (a < 0.01) discard;

                    gl_FragColor = vec4(color, a);
                }
            `});return e.dispose(),new zt(t,r)}}class jb{constructor(e){this.planetGroup=e,this.mesh=null,this.enabled=!0,this.visible=!0,this.gridLat=32,this.gridLon=64,this.totalVectors=this.gridLat*this.gridLon,this.tailLength=.08,this.tailWidth=2,this.heightOffset=.02,this.maxWind=60,this.weatherTexture=null,this.weatherAuxTexture=null,this.planetRadius=1,this._initGeometry()}_initGeometry(){const e=new Float32Array(this.totalVectors*2*3),t=new Float32Array(this.totalVectors*2*3);let n=0;for(let a=0;a<this.gridLat;a++){const o=((a+.5)/this.gridLat-.5)*Math.PI,l=Math.cos(o),c=Math.sin(o);for(let u=0;u<this.gridLon;u++){const h=((u+.5)/this.gridLon-.5)*Math.PI*2,f=Math.cos(h),m=Math.sin(h),g=l*f,v=c,p=l*m,d=n*6;e[d+0]=g,e[d+1]=v,e[d+2]=p,e[d+3]=g,e[d+4]=v,e[d+5]=p,t[d+0]=.5,t[d+1]=.5,t[d+2]=.5,t[d+3]=.5,t[d+4]=.5,t[d+5]=.5,n++}}const s=new on;s.setAttribute("position",new kt(e,3)),s.setAttribute("color",new kt(t,3));const r=new _f({vertexColors:!0,linewidth:this.tailWidth,transparent:!0,opacity:.9,depthTest:!0,depthWrite:!1});this.mesh=new e0(s,r),this.mesh.renderOrder=100,this.mesh.frustumCulled=!1,this.planetGroup.add(this.mesh)}setWeatherTextures(e,t){this.weatherTexture=e,this.weatherAuxTexture=t}setPlanetRadius(e){this.planetRadius=e}setConfig({tailLength:e,gridLat:t,gridLon:n,heightOffset:s,enabled:r,visible:a}={}){typeof e=="number"&&(this.tailLength=e),typeof s=="number"&&(this.heightOffset=s),typeof r=="boolean"&&(this.enabled=r),typeof a=="boolean"&&(this.visible=a,this.mesh&&(this.mesh.visible=a)),(t&&t!==this.gridLat||n&&n!==this.gridLon)&&(this.gridLat=t||this.gridLat,this.gridLon=n||this.gridLon,this.totalVectors=this.gridLat*this.gridLon,this._rebuildGeometry())}_rebuildGeometry(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()),this._initGeometry()}_sampleTexture(e,t,n){var f;if(!((f=e==null?void 0:e.image)!=null&&f.data))return{r:128,g:128,b:128,a:128};const s=e.image.data,r=e.image.width,a=e.image.height,o=Math.max(0,Math.min(1,t)),l=Math.max(0,Math.min(1,n)),c=Math.floor(o*(r-1)),h=(Math.floor(l*(a-1))*r+c)*4;return{r:s[h]||0,g:s[h+1]||0,b:s[h+2]||0,a:s[h+3]||0}}update(){var a,o,l,c;if(!this.enabled||!this.mesh||!this.visible||!((o=(a=this.weatherTexture)==null?void 0:a.image)!=null&&o.data)||!((c=(l=this.weatherAuxTexture)==null?void 0:l.image)!=null&&c.data))return;const e=this.mesh.geometry.attributes.position.array,t=this.mesh.geometry.attributes.color.array,n=this.planetRadius*(1+this.heightOffset),s=this.planetRadius*this.tailLength;let r=0;for(let u=0;u<this.gridLat;u++){const h=((u+.5)/this.gridLat-.5)*Math.PI,f=Math.cos(h),m=Math.sin(h),g=(u+.5)/this.gridLat;for(let v=0;v<this.gridLon;v++){const p=((v+.5)/this.gridLon-.5)*Math.PI*2,d=Math.cos(p),_=Math.sin(p),y=(v+.5)/this.gridLon,x=f*d,E=m,T=f*_,R=this._sampleTexture(this.weatherTexture,y,g).b/255,M=this._sampleTexture(this.weatherAuxTexture,y,g),S=(M.b/255-.5)*2,D=(M.a/255-.5)*2,B=-_,N=0,W=d,X=-m*d,H=f,Y=-m*_,V=Math.sqrt(S*S+D*D);let Q=B*S+X*D,re=N*S+H*D,ge=W*S+Y*D;const ye=Math.sqrt(Q*Q+re*re+ge*ge);ye>.001&&(Q/=ye,re/=ye,ge/=ye);const be=r*6;e[be+0]=x*n,e[be+1]=E*n,e[be+2]=T*n;const q=s*Math.max(.3,V);e[be+3]=x*n+Q*q,e[be+4]=E*n+re*q,e[be+5]=T*n+ge*q;let J,he,ie;if(R<.5){const De=R*2;J=1,he=De,ie=De}else{const De=(R-.5)*2;J=1-De,he=1-De,ie=1}const we=.4+V*.6;J*=we,he*=we,ie*=we,t[be+0]=J,t[be+1]=he,t[be+2]=ie,t[be+3]=J,t[be+4]=he,t[be+5]=ie,r++}}this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.attributes.color.needsUpdate=!0}setVisible(e){this.visible=e,this.mesh&&(this.mesh.visible=e)}dispose(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh=null)}}class Kb{constructor(e){this.callbacks=e||{},this.els={hud:document.getElementById("hud"),hudToggle:document.getElementById("hudToggle"),hudContent:document.getElementById("hudContent"),status:document.getElementById("status"),preset:document.getElementById("preset"),regenBtn:document.getElementById("regen"),resolution:document.getElementById("resolution"),plates:document.getElementById("plates"),plateSizeVariance:document.getElementById("plateSizeVariance"),jitter:document.getElementById("jitter"),heightScale:document.getElementById("heightScale"),iterations:document.getElementById("iterations"),erosionRate:document.getElementById("erosionRate"),evaporation:document.getElementById("evaporation"),seaLevel:document.getElementById("seaLevel"),smoothPasses:document.getElementById("smoothPasses"),subdivisions:document.getElementById("subdivisions"),iceCap:document.getElementById("iceCap"),plateDelta:document.getElementById("plateDelta"),faultType:document.getElementById("faultType"),desymmetrizeTiling:document.getElementById("desymmetrizeTiling"),atmosphere:document.getElementById("atmosphere"),waterShader:document.getElementById("waterShader"),waterShader:document.getElementById("waterShader"),jitterValue:document.getElementById("jitterValue"),heightScaleValue:document.getElementById("heightScaleValue"),erosionRateValue:document.getElementById("erosionRateValue"),evaporationValue:document.getElementById("evaporationValue"),seaLevelValue:document.getElementById("seaLevelValue"),smoothPassesValue:document.getElementById("smoothPassesValue"),subdivisionsValue:document.getElementById("subdivisionsValue"),iceCapValue:document.getElementById("iceCapValue"),plateDeltaValue:document.getElementById("plateDeltaValue"),plateSizeVarianceValue:document.getElementById("plateSizeVarianceValue"),atmosphereValue:document.getElementById("atmosphereValue"),atmosphereHeight:document.getElementById("atmosphereHeight"),atmosphereHeightValue:document.getElementById("atmosphereHeightValue"),atmosphereToggle:document.getElementById("atmosphereToggle"),atmosphereAlpha:document.getElementById("atmosphereAlpha"),atmosphereAlphaValue:document.getElementById("atmosphereAlphaValue"),atmosphereColor:document.getElementById("atmosphereColor"),cloudToggle:document.getElementById("cloudToggle"),cloudAlpha:document.getElementById("cloudAlpha"),cloudAlphaValue:document.getElementById("cloudAlphaValue"),cloudSpeed:document.getElementById("cloudSpeed"),cloudSpeedValue:document.getElementById("cloudSpeedValue"),cloudQuantity:document.getElementById("cloudQuantity"),cloudQuantityValue:document.getElementById("cloudQuantityValue"),cloudHeight:document.getElementById("cloudHeight"),cloudHeightValue:document.getElementById("cloudHeightValue"),cloudColor:document.getElementById("cloudColor"),cloudResolution:document.getElementById("cloudResolution"),cloudResolutionValue:document.getElementById("cloudResolutionValue"),cloudShader:document.getElementById("cloudShader"),cloudLayers:document.getElementById("cloudLayers"),addCloudLayerBtn:document.getElementById("addCloudLayer"),movePad:document.getElementById("movePad"),lookPad:document.getElementById("lookPad"),mobileControls:document.getElementById("mobileControls"),surfaceOnlyBtn:document.getElementById("surfaceOnly"),configToggle:document.getElementById("configToggle"),configPanel:document.getElementById("configPanel"),vrToggle:document.getElementById("vrToggle"),reticle:document.getElementById("reticle"),leftStickSensitivity:document.getElementById("leftStickSensitivity"),leftStickSensitivityValue:document.getElementById("leftStickSensitivityValue"),lookSensitivityX:document.getElementById("lookSensitivityX"),lookSensitivityXValue:document.getElementById("lookSensitivityXValue"),lookSensitivityY:document.getElementById("lookSensitivityY"),lookSensitivityYValue:document.getElementById("lookSensitivityYValue"),invertLook:document.getElementById("invertLook"),planetDiameter:document.getElementById("planetDiameter"),planetDiameterValue:document.getElementById("planetDiameterValue")},this.cloudLayerSettings=[],this.setStatus=this.setStatus.bind(this),this.bindEvents(),this.updateRangeLabels(),this.renderCloudLayerControls()}getPlanetDiameterKm(){var t;const e=parseFloat((t=this.els.planetDiameter)==null?void 0:t.value);return ne(Number.isFinite(e)?e:wi,1,1e3)}applyPreset(e){const t=to[e]||to.balanced;if(this.els.preset&&(this.els.preset.value=e),this.els.atmosphereToggle&&t.atmosphereEnabled!==void 0&&(this.els.atmosphereToggle.checked=!!t.atmosphereEnabled),this.els.cloudToggle){const n=t.cloudEnabled!==void 0?!!t.cloudEnabled:!1;this.els.cloudToggle.checked=n}this.els.resolution&&(this.els.resolution.value=t.resolution),this.els.plates&&(this.els.plates.value=t.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=t.plateSizeVariance??.35),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=t.desymmetrizeTiling??!0),this.els.jitter&&(this.els.jitter.value=t.jitter),this.els.heightScale&&(this.els.heightScale.value=t.heightScale),this.els.iterations&&(this.els.iterations.value=t.iterations),this.els.erosionRate&&(this.els.erosionRate.value=t.erosionRate),this.els.evaporation&&(this.els.evaporation.value=t.evaporation),this.els.seaLevel&&(this.els.seaLevel.value=t.seaLevel??.53),this.els.atmosphere&&(this.els.atmosphere.value=t.atmosphere??.35),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=t.atmosphereHeight??.5),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=t.atmosphereAlpha??1),this.els.atmosphereColor&&(this.els.atmosphereColor.value=t.atmosphereColor||"#4da8ff"),this.els.smoothPasses&&(this.els.smoothPasses.value=t.smoothPasses??20),this.els.subdivisions&&(this.els.subdivisions.value=t.subdivisions??60),this.els.iceCap&&(this.els.iceCap.value=t.iceCap??.15),this.els.plateDelta&&(this.els.plateDelta.value=t.plateDelta??1.25),this.els.faultType&&(this.els.faultType.value=t.faultType||"ridge"),this.els.cloudAlpha&&t.cloudAlpha!==void 0&&(this.els.cloudAlpha.value=t.cloudAlpha),this.els.cloudSpeed&&t.cloudSpeed!==void 0&&(this.els.cloudSpeed.value=t.cloudSpeed),this.els.cloudQuantity&&t.cloudQuantity!==void 0&&(this.els.cloudQuantity.value=t.cloudQuantity),this.els.cloudHeight&&t.cloudHeight!==void 0&&(this.els.cloudHeight.value=t.cloudHeight),this.els.cloudColor&&t.cloudColor!==void 0&&(this.els.cloudColor.value=t.cloudColor),this.els.cloudResolution&&t.cloudResolution!==void 0&&(this.els.cloudResolution.value=t.cloudResolution),this.els.cloudShader&&t.cloudShader!==void 0&&(this.els.cloudShader.value=t.cloudShader),this.els.waterShader&&(this.els.waterShader.value=t.waterShader||(e==="fast"?"fast":"balanced")),this.updateRangeLabels()}readSettings(){var e,t,n,s,r,a,o,l,c,u,h,f,m,g,v,p,d,_,y,x;return{resolution:ne(parseInt((e=this.els.resolution)==null?void 0:e.value,10)||256,64,4096),numPlates:ne(parseInt((t=this.els.plates)==null?void 0:t.value,10)||7,1,30),plateSizeVariance:ne(parseFloat((n=this.els.plateSizeVariance)==null?void 0:n.value)||0,0,2),desymmetrizeTiling:!!((s=this.els.desymmetrizeTiling)!=null&&s.checked),jitter:ne(parseFloat((r=this.els.jitter)==null?void 0:r.value)||.5,0,1),iterations:ne(parseInt((a=this.els.iterations)==null?void 0:a.value,10)||5e4,1e3,2e6),erosionRate:ne(parseFloat((o=this.els.erosionRate)==null?void 0:o.value)||.1,.001,2),evaporation:ne(parseFloat((l=this.els.evaporation)==null?void 0:l.value)||.02,0,2),heightScale:ne(parseFloat((c=this.els.heightScale)==null?void 0:c.value)||2,0,80),seaLevel:ne(parseFloat((u=this.els.seaLevel)==null?void 0:u.value)||.5,0,1),atmosphere:ne(parseFloat((h=this.els.atmosphere)==null?void 0:h.value)||.35,.05,1.5),atmosphereHeight:ne(parseFloat((f=this.els.atmosphereHeight)==null?void 0:f.value)||.5,0,5),atmosphereAlpha:ne(parseFloat((m=this.els.atmosphereAlpha)==null?void 0:m.value)||1,0,1),atmosphereColor:((g=this.els.atmosphereColor)==null?void 0:g.value)||"#4da8ff",smoothPasses:Math.round(ne(parseFloat((v=this.els.smoothPasses)==null?void 0:v.value)||0,0,40)),subdivisions:Math.round(ne(parseFloat((p=this.els.subdivisions)==null?void 0:p.value)||128,0,512)),iceCap:ne(parseFloat((d=this.els.iceCap)==null?void 0:d.value)||.1,0,1),plateDelta:ne(parseFloat((_=this.els.plateDelta)==null?void 0:_.value)||1.25,0,2),faultType:((y=this.els.faultType)==null?void 0:y.value)||"ridge",radius:sn,waterShader:((x=this.els.waterShader)==null?void 0:x.value)||"balanced"}}writeSettings(e){e&&(this.els.resolution&&(this.els.resolution.value=e.resolution),this.els.plates&&(this.els.plates.value=e.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=e.plateSizeVariance),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),this.els.jitter&&(this.els.jitter.value=e.jitter),this.els.iterations&&(this.els.iterations.value=e.iterations),this.els.erosionRate&&(this.els.erosionRate.value=e.erosionRate),this.els.evaporation&&(this.els.evaporation.value=e.evaporation),this.els.heightScale&&(this.els.heightScale.value=e.heightScale),this.els.seaLevel&&(this.els.seaLevel.value=e.seaLevel),this.els.atmosphere&&(this.els.atmosphere.value=e.atmosphere),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=e.atmosphereHeight),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=e.atmosphereAlpha),this.els.atmosphereColor&&(this.els.atmosphereColor.value=e.atmosphereColor),this.els.smoothPasses&&(this.els.smoothPasses.value=e.smoothPasses),this.els.subdivisions&&(this.els.subdivisions.value=e.subdivisions),this.els.iceCap&&(this.els.iceCap.value=e.iceCap),this.els.plateDelta&&(this.els.plateDelta.value=e.plateDelta),this.els.faultType&&(this.els.faultType.value=e.faultType),this.els.waterShader&&(this.els.waterShader.value=e.waterShader||"balanced"),this.updateRangeLabels())}bindEvents(){if([this.els.resolution,this.els.plates,this.els.plateSizeVariance,this.els.desymmetrizeTiling,this.els.jitter,this.els.heightScale,this.els.iterations,this.els.erosionRate,this.els.evaporation,this.els.seaLevel,this.els.atmosphere,this.els.smoothPasses,this.els.subdivisions,this.els.iceCap,this.els.plateDelta,this.els.faultType,this.els.waterShader].forEach(s=>{if(!s)return;const r=()=>{this.updateRangeLabels(),this.callbacks.onRegen&&this.callbacks.onRegen()};s.addEventListener("input",r),s.addEventListener("change",r)}),this.els.regenBtn&&this.els.regenBtn.addEventListener("click",()=>{this.callbacks.onRegen&&this.callbacks.onRegen()}),this.els.preset&&this.els.preset.addEventListener("change",()=>{this.callbacks.onPreset&&this.callbacks.onPreset(this.els.preset.value)}),this.els.planetDiameter){const s=()=>{this.updateRangeLabels(),this.callbacks.onDiameterChange&&this.callbacks.onDiameterChange(this.getPlanetDiameterKm())};this.els.planetDiameter.addEventListener("input",s),this.els.planetDiameter.addEventListener("change",s)}[this.els.atmosphere,this.els.atmosphereAlpha,this.els.atmosphereColor,this.els.atmosphereToggle].forEach(s=>{s&&(s.addEventListener(s.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}),s.type==="range"&&s.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}))}),[this.els.cloudToggle,this.els.cloudAlpha,this.els.cloudSpeed,this.els.cloudQuantity,this.els.cloudHeight,this.els.cloudColor,this.els.cloudResolution,this.els.cloudShader].forEach(s=>{s&&(s.addEventListener(s.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),s.type==="range"&&s.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}))}),this.els.addCloudLayerBtn&&this.els.addCloudLayerBtn.addEventListener("click",()=>{const s=this.getBaseCloudSettings(),r=this.cloudLayerSettings.length?this.cloudLayerSettings[this.cloudLayerSettings.length-1].height:s.height,a={...s,id:`extra-${Date.now()}`,height:r+.3};this.cloudLayerSettings.push(a),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),this.els.hudToggle&&this.els.hudToggle.addEventListener("click",()=>{this.setHudCollapsed(!this.els.hud.classList.contains("collapsed"))}),this.els.configToggle&&this.els.configToggle.addEventListener("click",()=>this.toggleConfigPanel()),this.els.vrToggle&&this.els.vrToggle.addEventListener("click",()=>{this.callbacks.onVRToggle&&this.callbacks.onVRToggle()}),[this.els.leftStickSensitivity,this.els.lookSensitivityX,this.els.lookSensitivityY].forEach(s=>{s&&s.addEventListener("input",()=>this.updateRangeLabels())}),this.els.invertLook&&this.els.invertLook.addEventListener("change",()=>this.updateRangeLabels())}setStatus(e){var t;(t=this.els)!=null&&t.status&&(this.els.status.textContent=e)}setHudCollapsed(e){!this.els.hud||!this.els.hudToggle||!this.els.hudContent||(this.els.hud.classList.toggle("collapsed",e),this.els.hudToggle.setAttribute("aria-expanded",(!e).toString()),this.els.hudContent.setAttribute("aria-hidden",e.toString()),this.els.hudToggle.textContent=e?"Show controls":"Hide controls")}toggleConfigPanel(e){if(!this.els.configPanel||!this.els.configToggle)return;const t=e??this.els.configPanel.style.display!=="block";this.els.configPanel.style.display=t?"block":"none",this.els.configToggle.setAttribute("aria-expanded",t.toString()),this.els.reticle&&t&&(this.els.reticle.style.display="none")}syncMobileVisibility(e,t){if(!this.els.mobileControls)return;if(!e){this.els.mobileControls.style.display="none",this.els.reticle&&(this.els.reticle.style.display="none");return}this.els.mobileControls.style.display="block",this.els.movePad&&(this.els.movePad.style.display=t?"grid":"none"),this.els.lookPad&&(this.els.lookPad.style.display=t?"grid":"none");const n=this.els.mobileControls.querySelector(".action-column");n&&(n.style.display=t?"grid":"none"),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.style.display=t?"none":"inline-flex"),this.els.reticle&&(this.els.reticle.style.display="block")}updateRangeLabels(){const e=this.els;e.jitterValue&&(e.jitterValue.textContent=Number(e.jitter.value).toFixed(2)),e.heightScaleValue&&(e.heightScaleValue.textContent=Number(e.heightScale.value).toFixed(2)),e.erosionRateValue&&(e.erosionRateValue.textContent=Number(e.erosionRate.value).toFixed(2)),e.evaporationValue&&(e.evaporationValue.textContent=Number(e.evaporation.value).toFixed(3)),e.seaLevelValue&&(e.seaLevelValue.textContent=Number(e.seaLevel.value).toFixed(2)),e.atmosphereValue&&(e.atmosphereValue.textContent=Number(e.atmosphere.value).toFixed(2)),e.atmosphereHeightValue&&(e.atmosphereHeightValue.textContent=Number(e.atmosphereHeight.value).toFixed(2)),e.smoothPassesValue&&(e.smoothPassesValue.textContent=Number(e.smoothPasses.value).toFixed(0)),e.subdivisionsValue&&(e.subdivisionsValue.textContent=Number(e.subdivisions.value).toFixed(0)),e.iceCapValue&&(e.iceCapValue.textContent=Number(e.iceCap.value).toFixed(2)),e.plateDeltaValue&&(e.plateDeltaValue.textContent=Number(e.plateDelta.value).toFixed(2)),e.plateSizeVarianceValue&&(e.plateSizeVarianceValue.textContent=Number(e.plateSizeVariance.value).toFixed(2)),e.atmosphereAlphaValue&&(e.atmosphereAlphaValue.textContent=Number(e.atmosphereAlpha.value).toFixed(2)),e.cloudAlphaValue&&(e.cloudAlphaValue.textContent=Number(e.cloudAlpha.value).toFixed(2)),e.cloudSpeedValue&&(e.cloudSpeedValue.textContent=Number(e.cloudSpeed.value).toFixed(2)),e.cloudQuantityValue&&(e.cloudQuantityValue.textContent=Number(e.cloudQuantity.value).toFixed(2)),e.cloudHeightValue&&(e.cloudHeightValue.textContent=Number(e.cloudHeight.value).toFixed(2)),e.cloudResolutionValue&&(e.cloudResolutionValue.textContent=Number(e.cloudResolution.value).toFixed(0)),e.planetDiameter&&e.planetDiameterValue&&(e.planetDiameterValue.textContent=Number(e.planetDiameter.value).toFixed(0)),e.leftStickSensitivity&&e.leftStickSensitivityValue&&(e.leftStickSensitivityValue.textContent=Number(e.leftStickSensitivity.value).toFixed(1)),e.lookSensitivityX&&e.lookSensitivityXValue&&(e.lookSensitivityXValue.textContent=Number(e.lookSensitivityX.value).toFixed(1)),e.lookSensitivityY&&e.lookSensitivityYValue&&(e.lookSensitivityYValue.textContent=Number(e.lookSensitivityY.value).toFixed(1))}readSettings(){var t;const e=this.els;return{resolution:ne(parseInt(e.resolution.value,10)||256,64,4096),numPlates:ne(parseInt(e.plates.value,10)||9,4,400),plateSizeVariance:ne(parseFloat(e.plateSizeVariance.value)||0,0,2),desymmetrizeTiling:!!((t=e.desymmetrizeTiling)!=null&&t.checked),jitter:ne(parseFloat(e.jitter.value)||.5,0,1),iterations:ne(parseInt(e.iterations.value,10)||5e4,1e3,2e6),erosionRate:ne(parseFloat(e.erosionRate.value)||.1,.001,2),evaporation:ne(parseFloat(e.evaporation.value)||.02,0,2),heightScale:ne(parseFloat(e.heightScale.value)||2,0,80),seaLevel:ne(parseFloat(e.seaLevel.value)||.5,0,1),atmosphere:ne(parseFloat(e.atmosphere.value)||.35,.05,1.5),atmosphereHeight:ne(parseFloat(e.atmosphereHeight.value)||.5,0,5),atmosphereAlpha:ne(parseFloat(e.atmosphereAlpha.value)||1,0,1),atmosphereColor:e.atmosphereColor.value||"#4da8ff",atmosphereEnabled:e.atmosphereToggle.checked,smoothPasses:Math.round(ne(parseFloat(e.smoothPasses.value)||0,0,40)),subdivisions:Math.round(ne(parseFloat(e.subdivisions.value)||128,0,512)),iceCap:ne(parseFloat(e.iceCap.value)||.1,0,1),plateDelta:ne(parseFloat(e.plateDelta.value)||1.25,0,2),faultType:e.faultType.value||"ridge",radius:sn,planetDiameterKm:this.getPlanetDiameterKm()}}writeSettings(e){const t=this.els;t.resolution.value=e.resolution,t.plates.value=e.numPlates,t.plateSizeVariance.value=e.plateSizeVariance,t.desymmetrizeTiling&&(t.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),t.jitter.value=e.jitter,t.iterations.value=e.iterations,t.erosionRate.value=e.erosionRate,t.evaporation.value=e.evaporation,t.heightScale.value=e.heightScale,t.seaLevel.value=e.seaLevel,t.atmosphere.value=e.atmosphere,t.atmosphereHeight.value=e.atmosphereHeight,t.atmosphereAlpha.value=e.atmosphereAlpha,t.atmosphereColor.value=e.atmosphereColor,t.smoothPasses.value=e.smoothPasses,t.subdivisions.value=e.subdivisions,t.iceCap.value=e.iceCap,t.plateDelta.value=e.plateDelta,t.faultType.value=e.faultType,this.updateRangeLabels()}getPlanetDiameterKm(){if(!this.els.planetDiameter)return wi;const e=parseFloat(this.els.planetDiameter.value);return ne(Number.isFinite(e)?e:wi,1,1e3)}getBaseCloudSettings(){return{id:"base",enabled:this.els.cloudToggle.checked,alpha:ne(parseFloat(this.els.cloudAlpha.value)||.74,0,1),speed:ne(parseFloat(this.els.cloudSpeed.value)||.9,0,2),quantity:ne(parseFloat(this.els.cloudQuantity.value)||.76,0,1),height:ne(parseFloat(this.els.cloudHeight.value)||-2.4,-5,5),color:this.els.cloudColor.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(this.els.cloudResolution.value)||256)),mode:this.els.cloudShader.value||"billow"}}createCloudLayerControls(e){const t=document.createElement("div");t.className="layer",t.style.border="1px solid var(--border)",t.style.padding="8px",t.style.marginBottom="8px";const n={alpha:"Opacity of this cloud layer.",speed:"Animation speed for this cloud layer.",quantity:"Coverage and density for this cloud layer.",height:"Altitude offset for this cloud layer.",resolution:"Texture resolution for this cloud layer."},s=document.createElement("div");s.textContent=`Layer ${e.label||this.cloudLayerSettings.length+1}`,s.style.fontSize="12px",s.style.color="var(--muted)",t.appendChild(s);const r=(v,p,d,_,y)=>{const x=document.createElement("div");x.className="field";const E=document.createElement("label");E.textContent=v,n[p]&&(E.title=n[p]);const T=document.createElement("div");T.className="range-row";const A=document.createElement("input");A.type="range",A.min=d,A.max=_,A.step=y,A.value=e[p],n[p]&&(A.title=n[p]);const R=document.createElement("span");return R.className="value",R.textContent=Number(e[p]).toFixed(y<1?2:0),T.appendChild(A),T.appendChild(R),x.appendChild(E),x.appendChild(T),A.addEventListener("input",()=>{e[p]=parseFloat(A.value),R.textContent=Number(e[p]).toFixed(y<1?2:0),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),x},a=document.createElement("label"),o=document.createElement("input");o.type="checkbox",o.checked=e.enabled,o.title="Enable this cloud layer.",o.addEventListener("change",()=>{e.enabled=o.checked,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),a.appendChild(o),a.append(" Layer enabled"),t.appendChild(a),t.appendChild(r("Alpha","alpha",0,1,.01)),t.appendChild(r("Speed","speed",0,2,.05)),t.appendChild(r("Quantity","quantity",0,1,.01)),t.appendChild(r("Height","height",-5,5,.05)),t.appendChild(r("Resolution","resolution",1,256,1));const l=document.createElement("div");l.className="field";const c=document.createElement("label");c.textContent="Shader";const u=document.createElement("select");u.title="Noise type used to generate this layer.",["fbm","billow","cellular"].forEach(v=>{const p=document.createElement("option");p.value=v,p.textContent=v.charAt(0).toUpperCase()+v.slice(1),e.mode===v&&(p.selected=!0),u.appendChild(p)}),u.addEventListener("change",()=>{e.mode=u.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),l.appendChild(c),l.appendChild(u),t.appendChild(l);const h=document.createElement("div");h.className="field";const f=document.createElement("label");f.textContent="Color";const m=document.createElement("input");m.type="color",m.value=e.color,m.title="Tint for this cloud layer.",m.addEventListener("input",()=>{e.color=m.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),h.appendChild(f),h.appendChild(m),t.appendChild(h);const g=document.createElement("button");return g.type="button",g.textContent="Remove layer",g.addEventListener("click",()=>{this.cloudLayerSettings=this.cloudLayerSettings.filter(v=>v!==e),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),t.appendChild(g),t}renderCloudLayerControls(){if(this.els.cloudLayers){this.els.cloudLayers.innerHTML="";for(const e of this.cloudLayerSettings)this.els.cloudLayers.appendChild(this.createCloudLayerControls(e))}}getLeftStickSensitivity(){var t;const e=parseFloat((t=this.els.leftStickSensitivity)==null?void 0:t.value);return Number.isFinite(e)?e:1}getLookSensitivityX(){var t;const e=parseFloat((t=this.els.lookSensitivityX)==null?void 0:t.value);return Number.isFinite(e)?e:.4}getLookSensitivityY(){var t;const e=parseFloat((t=this.els.lookSensitivityY)==null?void 0:t.value);return Number.isFinite(e)?e:.4}isInvertLook(){var e;return!!((e=this.els.invertLook)!=null&&e.checked)}bindMobileControls(e,t){if(!this.els.mobileControls||!this.els.movePad||!this.els.lookPad)return;const n=(a,o)=>e==null?void 0:e.setAction(a,o),s=a=>e==null?void 0:e.trigger(a),r=(a,o,l)=>{let c=!1,u=null;const h=()=>{u=a.getBoundingClientRect()},f=g=>{u||h();const v=g.touches?g.touches[0]:g,p=v.clientX-u.left-u.width/2,d=v.clientY-u.top-u.height/2,_=Math.min(u.width,u.height)/2,y=Math.max(-_,Math.min(_,p)),x=Math.max(-_,Math.min(_,d)),E=y/_,T=x/_;o(E,T)},m=()=>{c=!1,l()};a.addEventListener("pointerdown",g=>{g.preventDefault(),c=!0,h(),f(g)}),window.addEventListener("pointermove",g=>{c&&(g.preventDefault(),f(g))}),window.addEventListener("pointerup",g=>{c&&(g.preventDefault(),m())}),a.addEventListener("touchstart",g=>{c=!0,h(),f(g)},{passive:!1}),a.addEventListener("touchmove",g=>{c&&f(g)},{passive:!1}),a.addEventListener("touchend",g=>{c&&m()},{passive:!1}),a.addEventListener("touchcancel",g=>{c&&m()},{passive:!1})};r(this.els.movePad,(a,o)=>{const l=Math.max(.1,this.getLeftStickSensitivity()),c=Math.max(.1,.25/l);n("forward",o<-c),n("backward",o>c),n("left",a<-c),n("right",a>c)},()=>{n("forward",!1),n("backward",!1),n("left",!1),n("right",!1)}),r(this.els.lookPad,(a,o)=>{const l=Math.max(.1,this.getLookSensitivityX()),c=Math.max(.1,this.getLookSensitivityY()),u=this.isInvertLook()?-1:1;e==null||e.addLookDelta(a*6*l,o*6*c*u)},()=>{}),this.els.mobileControls.querySelectorAll("[data-trigger]").forEach(a=>{const o=a.getAttribute("data-trigger"),l=()=>{s(o),o==="surface"&&t&&t()};a.addEventListener("pointerdown",c=>{c.preventDefault(),l()}),a.addEventListener("touchstart",c=>{c.preventDefault(),l()},{passive:!1})}),this.els.mobileControls.querySelectorAll(".action-btn[data-action]").forEach(a=>{const o=a.getAttribute("data-action"),l=()=>n(o,!0),c=()=>n(o,!1);a.addEventListener("pointerdown",u=>{u.preventDefault(),l()}),a.addEventListener("pointerup",u=>{u.preventDefault(),c()}),a.addEventListener("pointerleave",c),a.addEventListener("pointercancel",c),a.addEventListener("touchstart",u=>{u.preventDefault(),l()},{passive:!1}),a.addEventListener("touchend",u=>{u.preventDefault(),c()},{passive:!1}),a.addEventListener("touchcancel",u=>{u.preventDefault(),c()},{passive:!1})}),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.addEventListener("pointerdown",a=>{a.preventDefault(),s("surface"),t&&t()}),this.els.surfaceOnlyBtn.addEventListener("touchstart",a=>{a.preventDefault(),s("surface"),t&&t()},{passive:!1}))}}class $b{constructor(e,{maxSprites:t=1200}={}){this.scene=e,this.maxSprites=Math.max(16,Math.floor(t)),this.enabled=!0,this.center=new P,this.uniforms={time:{value:0},windWorld:{value:new P(0,0,0)},color:{value:new xe("#d3ecff")},opacity:{value:.85},radius:{value:12},height:{value:6},speed:{value:1.4}},this.mesh=this._buildMesh(),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWind(e){e&&this.uniforms.windWorld.value.copy(e)}setCenter(e){!e||!this.mesh||(this.center.copy(e),this.mesh.position.copy(e))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new tr(.35,.08),t=new wf;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const n=new Float32Array(this.maxSprites*3),s=new Float32Array(this.maxSprites);for(let o=0;o<this.maxSprites;o++){const l=o*3;n[l+0]=Math.random()*2-1,n[l+1]=Math.random(),n[l+2]=Math.random()*2-1,s[o]=Math.random()}t.setAttribute("aOffset",new Qa(n,3)),t.setAttribute("aSeed",new Qa(s,1)),t.instanceCount=this.maxSprites;const r=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!1,blending:qa,side:An,vertexShader:`
                #include <common>
                #include <logdepthbuf_pars_vertex>
                attribute vec3 aOffset;
                attribute float aSeed;
                uniform float time;
                uniform vec3 windWorld;
                uniform float radius;
                uniform float height;
                uniform float speed;
                varying float vAlpha;
                varying vec2 vUV;
                void main() {
                    vUV = uv;
                    vec3 basePos = vec3(aOffset.x * radius, aOffset.y * height, aOffset.z * radius);
                    float jitter = sin(dot(basePos, vec3(12.9898,78.233,45.164)) + aSeed * 19.19);
                    vec3 wind = windWorld;
                    float windLen = length(wind);
                    vec3 dir = windLen > 1e-4 ? wind / windLen : vec3(0.0, 0.0, 1.0);
                    float drift = time * speed * max(windLen, 0.4) + aSeed * 6.2831;
                    basePos += dir * drift * 1.35;
                    basePos.y += sin(drift + jitter) * 0.55;
                    basePos += vec3(jitter * 0.55, 0.0, jitter * 0.55);

                    vec3 centerWorld = (modelMatrix * vec4(basePos, 1.0)).xyz;
                    // Camera-facing billboard quad.
                    vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
                    vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
                    vec3 billboardPos = centerWorld + right * position.x * 0.35 + up * position.y * 0.35;
                    vec4 worldPos = vec4(billboardPos, 1.0);
                    vAlpha = 0.3 + smoothstep(0.0, 0.2, windLen * 0.6);
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                    #include <logdepthbuf_vertex>
                }
            `,fragmentShader:`
                #include <common>
                #include <logdepthbuf_pars_fragment>
                uniform vec3 color;
                uniform float opacity;
                varying float vAlpha;
                varying vec2 vUV;
                void main() {
                    #include <logdepthbuf_fragment>
                    float d = length(vUV - 0.5);
                    float m = smoothstep(0.65, 0.05, d);
                    float a = opacity * vAlpha * m;
                    if (a < 0.01) discard;
                    gl_FragColor = vec4(color, a);
                }
            `}),a=new zt(t,r);return a.renderOrder=1.25,a}}const Zb=document.getElementById("viewport"),Jh=document.getElementById("hud");document.getElementById("hudToggle");document.getElementById("hudContent");document.getElementById("status");const Ui=document.getElementById("preset"),yc=document.getElementById("regen"),lo=document.getElementById("helpToggle"),gl=document.getElementById("helpPanel"),ed=document.getElementById("helpContent"),td=document.getElementById("resolution"),nd=document.getElementById("plates"),id=document.getElementById("plateSizeVariance"),sd=document.getElementById("jitter"),rd=document.getElementById("heightScale"),ad=document.getElementById("iterations"),od=document.getElementById("erosionRate"),ld=document.getElementById("evaporation"),cd=document.getElementById("seaLevel"),ud=document.getElementById("smoothPasses"),hd=document.getElementById("subdivisions"),dd=document.getElementById("iceCap");document.getElementById("plateDelta");document.getElementById("faultType");const fd=document.getElementById("desymmetrizeTiling"),co=document.getElementById("atmosphere");document.getElementById("jitterValue");document.getElementById("heightScaleValue");document.getElementById("erosionRateValue");document.getElementById("evaporationValue");document.getElementById("seaLevelValue");document.getElementById("smoothPassesValue");document.getElementById("subdivisionsValue");document.getElementById("iceCapValue");document.getElementById("plateDeltaValue");document.getElementById("plateSizeVarianceValue");document.getElementById("atmosphereValue");const za=document.getElementById("atmosphereHeight");document.getElementById("atmosphereHeightValue");const $i=document.getElementById("atmosphereToggle"),Yf=document.getElementById("atmosphereAlpha");document.getElementById("atmosphereAlphaValue");const jf=document.getElementById("atmosphereColor"),uo=document.getElementById("cloudToggle"),br=document.getElementById("cloudAlpha");document.getElementById("cloudAlphaValue");const wr=document.getElementById("cloudSpeed");document.getElementById("cloudSpeedValue");const Er=document.getElementById("cloudQuantity");document.getElementById("cloudQuantityValue");const Tr=document.getElementById("cloudHeight");document.getElementById("cloudHeightValue");const Ar=document.getElementById("cloudColor"),Cr=document.getElementById("cloudResolution");document.getElementById("cloudResolutionValue");const Rr=document.getElementById("cloudShader"),pd=document.getElementById("cloudLayers");uo&&(uo.checked=!1);const Qb=document.getElementById("addCloudLayer"),Ze=document.getElementById("waterCycleToggle"),Rn=document.getElementById("waterCycleCloudToggle"),ri=document.getElementById("waterCycleRun"),Nr=document.getElementById("waterCycleStep"),rn=document.getElementById("weatherAutoScale"),zs=document.getElementById("weatherSimMode"),Et=document.getElementById("weatherVolumeRes"),md=document.getElementById("weatherVolumeResValue"),yt=document.getElementById("weatherRayStepsMin"),gd=document.getElementById("weatherRayStepsMinValue"),St=document.getElementById("weatherRayStepsMax"),vd=document.getElementById("weatherRayStepsMaxValue"),vt=document.getElementById("weatherRayBundle"),xd=document.getElementById("weatherRayBundleValue"),Zi=document.getElementById("weatherAtmoThickness"),_d=document.getElementById("weatherAtmoThicknessValue"),ai=document.getElementById("axialTilt"),yd=document.getElementById("axialTiltValue"),oi=document.getElementById("seasonProgress"),Sd=document.getElementById("seasonProgressValue"),ks=document.getElementById("weatherDebug"),Hn=document.getElementById("volumeSlice"),Js=document.getElementById("volumeSliceValue");let Bn=null;const Ei=document.getElementById("weatherSpeed"),Md=document.getElementById("weatherSpeedValue"),dt=document.getElementById("weatherUpdateHz"),bd=document.getElementById("weatherUpdateHzValue"),Tt=document.getElementById("weatherMoistureLayers"),wd=document.getElementById("weatherMoistureLayersValue"),Ti=document.getElementById("weatherEvap"),Ed=document.getElementById("weatherEvapValue"),Ai=document.getElementById("weatherPrecip"),Td=document.getElementById("weatherPrecipValue"),Ci=document.getElementById("weatherWind"),Ad=document.getElementById("weatherWindValue"),Ri=document.getElementById("weatherWetness"),Cd=document.getElementById("weatherWetnessValue"),Pi=document.getElementById("weatherOceanInertia"),Rd=document.getElementById("weatherOceanInertiaValue"),Vs=document.getElementById("weatherRainFxToggle"),Di=document.getElementById("weatherRainFx"),Pd=document.getElementById("weatherRainFxValue"),hn=document.getElementById("weatherRainHaze"),Dd=document.getElementById("weatherRainHazeValue"),Qi=document.getElementById("waterShader"),ho=document.getElementById("movePad"),fo=document.getElementById("lookPad"),Hs=document.getElementById("mobileControls"),Pr=document.getElementById("surfaceOnly");document.getElementById("configToggle");document.getElementById("configPanel");const Si=document.getElementById("vrToggle"),Ld=document.getElementById("reticle"),ka=document.getElementById("leftStickSensitivity");document.getElementById("leftStickSensitivityValue");const Va=document.getElementById("lookSensitivityX");document.getElementById("lookSensitivityXValue");const Ha=document.getElementById("lookSensitivityY");document.getElementById("lookSensitivityYValue");const Dr=document.getElementById("invertLook");document.getElementById("planetDiameter");document.getElementById("planetDiameterValue");const Kf=(()=>{const i=new Uint8Array([110,0,128,0]),e=new Xn(i,1,1,bt,Dt);return e.needsUpdate=!0,e.wrapS=yn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Ft,e})(),Jb=(()=>{const i=new Uint8Array([160,0,128,128]),e=new Xn(i,1,1,bt,Dt);return e.needsUpdate=!0,e.wrapS=yn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Ft,e})();function ew(){if(Bn)return Bn;const i=new vf({map:Kf,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1,toneMapped:!1}),e=new $m(i);return e.renderOrder=999,e.scale.set(5,5,1),e.position.set(7.2,7.5,-12),Mt.add(e),Bn=e,e}function tw(i){iu=i,!i&&Bn&&(Bn.visible=!1),i&&(ew(),Bn.visible=!0)}function nw(i){const e=document.getElementById("volumeSliceField");e&&(e.style.display=i?"block":"none")}function Id(i){if(!Hn)return;const e=Math.max(0,Number(Hn.max)||0),t=Math.min(Math.max(Math.floor(i),0),e);go=t,Hn.value!==String(t)&&(Hn.value=t),Js&&(Js.textContent=t),$f()}function Sc(){if(!Hn)return;const i=So(),e=(i==null?void 0:i.n)??0,t=Math.max(0,e-1);Hn.max=String(t),go>t&&(go=t,Js&&(Js.textContent=t))}function iw(){var f;const i=lu(),e=So();if(!i||!e)return null;const t=e.n||0,n=Lr?4:1,s=Math.max(1,t*n);if(!cn||cn.image.width!==s||cn.image.height!==s){const m=new Uint8Array(Math.max(1,s*s*4));cn=new Xn(m,s,s,bt,Dt),cn.needsUpdate=!0,cn.wrapS=pt,cn.wrapT=pt,cn.minFilter=Pt,cn.magFilter=Pt,cn.generateMipmaps=!1,cn.colorSpace=Ft}const r=Math.min(Math.max(go|0,0),Math.max(0,t-1)),a=e.tilesX||1,o=r%a,l=Math.floor(r/a),c=(f=i.image)==null?void 0:f.data;if(!(c&&c.length>=e.atlasW*e.atlasH*4))return i;const u=cn.image.data,h=0;for(let m=0;m<t;m++){const g=((l*t+m)*e.atlasW+o*t)*4;for(let v=0;v<t;v++){const p=g+v*4,d=c[p]??0,_=c[p+1]??0,y=c[p+2]??128,x=c[p+3]??0,E=Math.min(255,d*2),T=E,A=Math.min(255,_+E*.3),R=Math.min(255,y),M=Math.max(160,x);if(!Lr){const N=m*s*4+v*4;u[N+0]=T,u[N+1]=A,u[N+2]=R,u[N+3]=M;continue}const S=v*n,D=m*n;for(let B=0;B<n;B++){const N=(D+B)*s*4;for(let W=0;W<n;W++){const X=N+(S+W)*4,H=W===0||B===0;u[X+0]=H?h:T,u[X+1]=H?h:A,u[X+2]=H?h:R,u[X+3]=H?255:M}}}}if(Lr&&s>1){const m=s-1;for(let v=0;v<s;v++){const p=(v*s+m)*4;u[p+0]=h,u[p+1]=h,u[p+2]=h,u[p+3]=255}const g=m*s*4;for(let v=0;v<s;v++){const p=g+v*4;u[p+0]=h,u[p+1]=h,u[p+2]=h,u[p+3]=255}}return cn.needsUpdate=!0,cn}function $f(){if(!iu||!Bn)return;const i=iw();if(!i){Bn.visible=!1;return}Bn.visible=!0,Bn.material.map=i,Bn.material.needsUpdate=!0}const Rt=new Kb({onRegen:()=>zd(),onPreset:i=>{ap(i),ww(i),Rt.setStatus("Preset applied. Regenerating…"),zd()},onDiameterChange:i=>Uw(i),onAtmosphereUpdate:()=>Ec(),onCloudUpdate:()=>Tc(),onVRToggle:()=>{li?cp():lp()}});let qn;try{qn=new Bb(Zb)}catch(i){throw console.error("WebGL init failed",i),Rt.setStatus("WebGL context could not be created. Enable WebGL/hardware acceleration or disable XR emulation."),i}const Li=qn.renderer,Br=qn.scene,er=qn.planetGroup,mr=qn.userGroup,Mt=qn.camera,Ge=qn.controls,Jt=qn.dirLight,ke=new yb(qn);let un=null,vl=0;const sw={sunDir:{value:new P(0,1,0)}};function rw(){var o,l;un&&(Br.remove(un),un.geometry.dispose(),(l=(o=un.material).dispose)==null||l.call(o));const i=Math.max(.05,((Fe==null?void 0:Fe.radius)??sn)*.2),e=new Vc(i,96,48),t=42,n=[];for(let c=0;c<t;c++){const u=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1),f=Math.sin(h);n.push(new P(Math.cos(u)*f,Math.cos(h),Math.sin(u)*f))}const s=e.attributes.position,r=new P;for(let c=0;c<s.count;c++){r.fromBufferAttribute(s,c).normalize();let u=0;for(const h of n){const f=r.angleTo(h);if(f<.25){const m=1-f/.25;u-=m*m*.08}}r.multiplyScalar(1+u),s.setXYZ(c,r.x*i,r.y*i,r.z*i)}s.needsUpdate=!0,e.computeVertexNormals();const a=new n0({color:14739181,roughness:.7,metalness:0,emissive:new xe(16777215),emissiveIntensity:.15});un=new zt(e,a),un.castShadow=!0,un.receiveShadow=!0,Br.add(un)}const lt=new Ob;lt.setMode(ir()?"mobile":"desktop");lt.setLookMode("orbit");function aw(){const i=t=>{if(!t)return!1;const n=t.tagName;return n?n==="INPUT"||n==="TEXTAREA"||t.isContentEditable:!1},e=t=>{if(i(t.target))return;const n=t.type==="keydown";switch(t.code){case"ControlLeft":case"ControlRight":case"KeyC":lt.setAction("down",n);break;case"Space":case"Numpad0":n&&lt.trigger("jump");break;default:return}};window.addEventListener("keydown",e,{passive:!1}),window.addEventListener("keyup",e,{passive:!1})}aw();const jt=new dy(Mt,Li.domElement,Br,()=>{Ge.enabled=!0,Rt.setStatus(""),Is&&(Ge.target.copy(Is.target),Mt.position.copy(Is.position),Is=null),np(),_w(),lt.setLookMode("orbit")},lt),ow=new h0;let Nt=null,Gs=!1,Mc=null,Zf=null,lw=null,Qf=null,Jf=[],xn=null,Gn=ke.cloudLayerSettings,Fe=null,Re=null,Ga=null,Xi=null,bc=null,Is=null,li=null,wc=new Map;const po=new oc,xl=new _e;let _l=!1;const Ca=new On,Ud=new ot,Us=new Le,Ws=new P,mo=new P,Fd=new Le,Ra=new P,Ts=new P,Nd=new P,Bd=new P,Rs=new P;let iu=!1,Lr=!1,go=0,cn=null,ep=28,tp=48,Wa=1,an=null,yl=60;const su=[{n:16,updateHz:4,rayMin:10,rayMax:20,bundle:4},{n:24,updateHz:5,rayMin:14,rayMax:26,bundle:3},{n:32,updateHz:6,rayMin:18,rayMax:32,bundle:2},{n:48,updateHz:7,rayMin:22,rayMax:38,bundle:2},{n:64,updateHz:8,rayMin:28,rayMax:48,bundle:1}],ru=[{updateHz:4,moistureLayers:1},{updateHz:6,moistureLayers:2},{updateHz:8,moistureLayers:3},{updateHz:10,moistureLayers:4}],As={lowMs:20,highMs:33,downDelayS:1.5,upDelayS:6,cooldownDownS:2,cooldownUpS:4},Ve={manual:null,tier3d:0,tier2d:0,emaMs:16.7,overBudgetS:0,underBudgetS:0,cooldownS:0},vn=new Yb(Br,{maxDrops:12e3}),Pa=new $b(Br,{maxSprites:950}),gr=new jb(er);an=document.createElement("div");an.style.position="fixed";an.style.top="8px";an.style.right="60px";an.style.padding="4px 8px";an.style.background="rgba(0,0,0,0.35)";an.style.color="#fff";an.style.fontSize="12px";an.style.fontFamily="monospace";an.style.borderRadius="6px";an.style.pointerEvents="none";an.textContent="fps: --";document.body.appendChild(an);window.addEventListener("mousedown",i=>{if(i.button===1){if(i.preventDefault(),jt.enabled){jt.exit(),Ge.enabled=!0;return}if(xl.x=i.clientX/window.innerWidth*2-1,xl.y=-(i.clientY/window.innerHeight)*2+1,po.setFromCamera(xl,Mt),Nt){Is={position:Mt.position.clone(),target:Ge.target.clone()};const e=po.intersectObject(Nt,!1);if(e.length>0){const t=e[0].point;jt.enter(t,Nt,Mt),Ge.enabled=!1,Rt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)")}}}});Li.domElement.addEventListener("mousedown",i=>{var e,t;i.button===0&&jt.enabled&&(ir()||Jh&&Jh.contains(i.target)||document.pointerLockElement!==Li.domElement&&((t=(e=Li.domElement).requestPointerLock)==null||t.call(e)))});function au(){if(jt.enabled){jt.snapToSurface();return}if(!Nt)return;lt.setLookMode("surface"),po.setFromCamera(new _e(0,0),Mt);const i=po.intersectObject(Nt,!1);i.length&&(Is={position:Mt.position.clone(),target:Ge.target.clone()},jt.enter(i[0].point,Nt,Mt),Ge.enabled=!1,Rt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)"))}Rt.setHudCollapsed(ir());function cw(){if(!Hs||!ho||!fo)return;const i=(n,s)=>lt==null?void 0:lt.setAction(n,s),e=n=>lt==null?void 0:lt.trigger(n),t=(n,s,r)=>{let a=!1,o=null;const l=()=>{o=n.getBoundingClientRect()},c=h=>{o||l();const f=h.touches?h.touches[0]:h,m=f.clientX-o.left-o.width/2,g=f.clientY-o.top-o.height/2,v=Math.min(o.width,o.height)/2,p=Math.max(-v,Math.min(v,m)),d=Math.max(-v,Math.min(v,g)),_=p/v,y=d/v;s(_,y)},u=()=>{a=!1,r()};n.addEventListener("pointerdown",h=>{h.preventDefault(),a=!0,l(),c(h)}),window.addEventListener("pointermove",h=>{a&&(h.preventDefault(),c(h))}),window.addEventListener("pointerup",h=>{a&&(h.preventDefault(),u())}),n.addEventListener("touchstart",h=>{a=!0,l(),c(h)},{passive:!1}),n.addEventListener("touchmove",h=>{a&&c(h)},{passive:!1}),n.addEventListener("touchend",h=>{a&&u()},{passive:!1}),n.addEventListener("touchcancel",h=>{a&&u()},{passive:!1})};t(ho,(n,s)=>{const r=Math.max(.1,mw()),a=Math.max(.1,.25/r);i("forward",s<-a),i("backward",s>a),i("left",n<-a),i("right",n>a)},()=>{i("forward",!1),i("backward",!1),i("left",!1),i("right",!1)}),t(fo,(n,s)=>{const r=Math.max(.1,gw()),a=Math.max(.1,vw()),o=xw()?-1:1;lt==null||lt.addLookDelta(n*6*r,s*6*a*o)},()=>{}),Hs.querySelectorAll("[data-trigger]").forEach(n=>{const s=n.getAttribute("data-trigger"),r=()=>{e(s),s==="surface"&&au()};n.addEventListener("pointerdown",a=>{a.preventDefault(),r()}),n.addEventListener("touchstart",a=>{a.preventDefault(),r()},{passive:!1})}),Hs.querySelectorAll(".action-btn[data-action]").forEach(n=>{const s=n.getAttribute("data-action"),r=()=>i(s,!0),a=()=>i(s,!1);n.addEventListener("pointerdown",o=>{o.preventDefault(),r()}),n.addEventListener("pointerup",o=>{o.preventDefault(),a()}),n.addEventListener("pointerleave",a),n.addEventListener("pointercancel",a),n.addEventListener("touchstart",o=>{o.preventDefault(),r()},{passive:!1}),n.addEventListener("touchend",o=>{o.preventDefault(),a()},{passive:!1}),n.addEventListener("touchcancel",o=>{o.preventDefault(),a()},{passive:!1})}),Pr&&(Pr.addEventListener("pointerdown",n=>{n.preventDefault(),e("surface")}),Pr.addEventListener("touchstart",n=>{n.preventDefault(),e("surface")},{passive:!1}))}function Wr(){return Rt.getPlanetDiameterKm()}function ou(){return Wr()/wi}function Vn(){return Ze!=null&&Ze.checked&&(Re!=null&&Re.enabled)&&Re.ready&&Re.hasSurface?Re.getTexture():Kf}function xi(){return Ze!=null&&Ze.checked&&(Re!=null&&Re.enabled)&&Re.ready&&Re.hasSurface?Re.getAuxTexture():Jb}function lu(){return!((Ze==null?void 0:Ze.checked)??!1)||!((Rn==null?void 0:Rn.checked)??!1)||!(Re!=null&&Re.enabled)||!Re.ready||!Re.hasSurface||typeof Re.getVolumeTexture!="function"?null:Re.getVolumeTexture()}function So(){return!(Re!=null&&Re.enabled)||!Re.ready||!Re.hasSurface||typeof Re.getVolumeMeta!="function"?null:Re.getVolumeMeta()}function uw(i,e,t,n){var g;if(!((g=i==null?void 0:i.image)!=null&&g.data)||!t||(Ra.copy(Mt.position).multiplyScalar(e).applyMatrix3(t),Ra.lengthSq()<1e-12))return(n??Rs).set(0,0,0),n??Rs;const s=Ra.normalize(),r=Math.atan2(s.z,s.x)/(2*Math.PI)+.5,a=Math.asin(ne(s.y,-1,1))/Math.PI+.5,o=_b(i,r,a),l=((o.b??128)/255-.5)*2,c=((o.a??128)/255-.5)*2,u=40;Ts.set(-s.z,0,s.x),Ts.lengthSq()<1e-8&&Ts.set(1,0,0),Ts.normalize(),Nd.crossVectors(s,Ts).normalize(),Bd.copy(Ts).multiplyScalar(l).addScaledVector(Nd,c).multiplyScalar(u),Fd.copy(t).transpose();const h=(n??Rs).copy(Bd).applyMatrix3(Fd),f=Ra.copy(Mt.position).normalize();return h.addScaledVector(f,-h.dot(f)),h.length()>1e-6||h.set(0,0,0),h}function Mo(i){var t,n;if(!Nt)return;const e=Nt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.texture=i),(n=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&n.uWeatherMap&&(e.userData.shader.uniforms.uWeatherMap.value=i))}function bo(i){var t,n;if(!Nt)return;const e=Nt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.auxTexture=i),(n=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&n.uWeatherAuxMap&&(e.userData.shader.uniforms.uWeatherAuxMap.value=i))}function hw(i){var t,n;if(!Nt)return;const e=Nt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.strength=i),(n=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&n.uWeatherStrength&&(e.userData.shader.uniforms.uWeatherStrength.value=i))}function dw(i){var t,n;if(!Nt)return;const e=Nt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.debug=i),(n=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&n.uWeatherDebug&&(e.userData.shader.uniforms.uWeatherDebug.value=i))}function fw(i,e){if(!i||!e)return;const t=(e.planetDiameterKm??Wr())*1e3*.5,n={heightmap:i.data,size:i.size,seaLevel:e.seaLevel,planetRadiusM:t};bc=n;const s=[Re,Ga,Xi].filter(Boolean);for(const r of s)r!=null&&r.enabled&&r.ready&&r.setPlanetSurface(n);Mo(Vn()),bo(xi())}function pw(){const e=wi*1e3*.5/sn;return K_/e*ou()}function mw(){const i=parseFloat(ka==null?void 0:ka.value);return Number.isFinite(i)?i:1}function gw(){const i=parseFloat(Va==null?void 0:Va.value);return Number.isFinite(i)?i:.4}function vw(){const i=parseFloat(Ha==null?void 0:Ha.value);return Number.isFinite(i)?i:.4}function xw(){return!!(Dr!=null&&Dr.checked)}function np(){if(!Fe)return;const i=(Fe.radius??sn)+(Fe.heightScale??0),e=ou(),t=Math.max(.5,i*e);Ge.minDistance=Math.max(.2,t*.1),Ge.maxDistance=Math.max(t*16,Ge.minDistance+1);const n=Mt.position.clone().sub(Ge.target),s=n.length(),r=ne(s,Ge.minDistance,Ge.maxDistance);Math.abs(r-s)>1e-4&&(n.setLength(r),Mt.position.copy(Ge.target).add(n)),Mt.near=Math.max(.002,t*5e-4),Mt.far=Math.max(150,t*14),Mt.updateProjectionMatrix()}function _w(){Ge&&(Ge.state!==void 0&&(Ge.state=-1),Ge.keyState!==void 0&&(Ge.keyState=-1),Ge._movePrev&&Ge._moveCurr&&Ge._movePrev.copy(Ge._moveCurr),Ge._zoomStart&&Ge._zoomEnd&&Ge._zoomStart.copy(Ge._zoomEnd),Ge._panStart&&Ge._panEnd&&Ge._panStart.copy(Ge._panEnd))}function ip(){ke.applyPlanetScale(Wr()),np()}function sp(){if(!Hs)return;const i=ir(),e=jt.enabled;Hs.style.display="block",ho&&(ho.style.display=i&&e?"grid":"none"),fo&&(fo.style.display=i&&e?"grid":"none");const t=Hs.querySelector(".action-column");if(t&&(t.style.display=e?"grid":"none"),Pr&&(Pr.style.display=e?"none":"inline-flex"),Ld){const n=!i||e;Ld.style.display=n?"block":"none"}rp()}function rp(){if(!ed)return;const i=ir(),e=jt.enabled;let t="";e?(t+="<h4>First Person</h4><ul>",i||(t+="<li>Mouse move to look (click to capture)</li>"),t+="<li>WASD to move, Shift to run, Space to jump</li>",t+="<li>Arrow keys to look, Q/E to roll</li>",t+="<li>F to toggle fly, Ctrl to descend, Esc to exit</li>",t+="<li>On-screen buttons: Jump, Fly, Surface, Exit, Run</li>",t+="</ul>",i&&(t+="<h4>Touch</h4><ul>",t+="<li>Left stick moves, right stick looks</li>",t+="</ul>")):(t+="<h4>Orbit</h4><ul>",t+="<li>Drag to orbit, scroll to zoom</li>",t+="<li>Middle click or Surface button to enter first person</li>",t+="</ul>"),ed.innerHTML=t}function yw(){if(!gl||!lo)return;const i=gl.style.display!=="block";gl.style.display=i?"block":"none",lo.setAttribute("aria-expanded",i.toString()),i&&rp()}function ss(){Rt.updateRangeLabels(),Ei&&Md&&(Md.textContent=Number(Ei.value).toFixed(0)),dt&&bd&&(bd.textContent=Number(dt.value).toFixed(0)),Et&&md&&(md.textContent=Number(Et.value).toFixed(0)),yt&&gd&&(gd.textContent=Number(yt.value).toFixed(0)),St&&vd&&(vd.textContent=Number(St.value).toFixed(0)),vt&&xd&&(xd.textContent=Number(vt.value).toFixed(0)),Zi&&_d&&(_d.textContent=Number(Zi.value).toFixed(0)),ai&&yd&&(yd.textContent=Number(ai.value).toFixed(1)),oi&&Sd&&(Sd.textContent=Number(oi.value).toFixed(2)),Tt&&wd&&(wd.textContent=Number(Tt.value).toFixed(0)),Ti&&Ed&&(Ed.textContent=Number(Ti.value).toFixed(2)),Ai&&Td&&(Td.textContent=Number(Ai.value).toFixed(2)),Ci&&Ad&&(Ad.textContent=Number(Ci.value).toFixed(2)),Ri&&Cd&&(Cd.textContent=Number(Ri.value).toFixed(2)),Pi&&Rd&&(Rd.textContent=Number(Pi.value).toFixed(2)),Di&&Pd&&(Pd.textContent=Number(Di.value).toFixed(2)),hn&&Dd&&(Dd.textContent=Number(hn.value).toFixed(2))}function ap(i){Rt.applyPreset(i);const e=to[i]||to.balanced;Ew(e),Qi&&(Qi.value=i==="fast"?"fast":"balanced")}function Sw(){const i=Rt.readSettings();return i.waterShader=cu(),i}function Mw(i){Rt.writeSettings(i)}function bw(){if(typeof window>"u")return null;const e=(new URLSearchParams(window.location.search||"").get("quality")||"").toLowerCase();return e==="fast"||e==="balanced"||e==="high"?e:null}function cu(){return(Qi==null?void 0:Qi.value)||"balanced"}function ww(i){if(typeof window>"u")return;const e=(i||"").toLowerCase();if(e!=="fast"&&e!=="balanced"&&e!=="high")return;const t=new URL(window.location.href);t.searchParams.set("quality",e),window.history.replaceState({},"",t)}function Ew(i){const e=(r,a)=>!r||a===void 0||a===null?!1:(r.value=String(a),!0),t=(r,a)=>!r||a===void 0||a===null?!1:(r.checked=!!a,!0);let n=!1;n=t(Ze,i.waterCycleEnabled)||n,n=t(Rn,i.waterCycleCloudEnabled)||n,n=t(ri,i.waterCycleRun)||n,n=e(zs,i.weatherSimMode)||n,n=e(Et,i.weatherVolumeRes)||n,n=e(yt,i.weatherRayStepsMin)||n,n=e(St,i.weatherRayStepsMax)||n,n=e(vt,i.weatherRayBundle)||n,n=e(Zi,i.weatherAtmoThickness)||n,n=e(ai,i.axialTilt)||n,n=e(oi,i.seasonProgress)||n,n=e(ks,i.weatherDebug)||n,n=e(Ei,i.weatherSpeed)||n,n=e(dt,i.weatherUpdateHz)||n,n=e(Tt,i.weatherMoistureLayers)||n,n=e(Ti,i.weatherEvap)||n,n=e(Ai,i.weatherPrecip)||n,n=e(Ci,i.weatherWind)||n,n=e(Ri,i.weatherWetness)||n,n=e(Pi,i.weatherOceanInertia)||n,n=t(Vs,i.weatherRainFxEnabled)||n,n=e(Di,i.weatherRainFx)||n,n=e(hn,i.weatherRainHaze)||n;let s=!1;rn&&i.weatherAutoScale!==void 0&&i.weatherAutoScale!==null&&(rn.checked=!!i.weatherAutoScale,rn.checked?(fu(),s=!0):hp({keepCurrent:!0})),n&&!s&&Or()}async function uu(i){var s,r;if(Gs)return;jt.enabled&&(jt.exit(),Ge.enabled=!0),Gs=!0,clearTimeout(Mc),yc.disabled=!0,Ui.disabled=!0,td.disabled=!0,nd.disabled=!0,id.disabled=!0,fd.disabled=!0,sd.disabled=!0,rd.disabled=!0,ad.disabled=!0,od.disabled=!0,ld.disabled=!0,cd.disabled=!0,co.disabled=!0,za.disabled=!0,ud.disabled=!0,hd.disabled=!0,dd.disabled=!0,za.disabled=!0;const e={...Sw(),planetDiameterKm:Wr(),atmosphereEnabled:($i==null?void 0:$i.checked)??!0,waterShader:cu()};Mw(e);const t=[],n=hu();n.enabled&&t.push(n);for(const a of Gn)a.enabled&&t.push(a);ke.cloudLayerSettings=t;try{await ke.generate(e,o=>Rt.setStatus(o)),Fe={...ke.lastSettings||e},Nt=ke.planet,Zf=ke.water,lw=ke.freshwater,Qf=((s=ke.atmosphereSystem)==null?void 0:s.mesh)||null,Jf=((r=ke.cloudSystem)==null?void 0:r.clouds)||[],ke.forge&&fw(ke.forge,e),Mo(Vn()),bo(xi()),pu();const a=new P().copy(Jt.position).normalize();_i(a),wo(a,{force:!0}),rw(),ip(),Rt.setStatus(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(a){console.error(a),Rt.setStatus("Generation failed – check console")}finally{Gs=!1,yc.disabled=!1,Ui.disabled=!1,td.disabled=!1,nd.disabled=!1,id.disabled=!1,fd.disabled=!1,sd.disabled=!1,rd.disabled=!1,ad.disabled=!1,od.disabled=!1,ld.disabled=!1,cd.disabled=!1,co.disabled=!1,za.disabled=!1,ud.disabled=!1,hd.disabled=!1,dd.disabled=!1}}function wo(i,e={}){var u,h,f;if(!Fe)return;const t=e.force===!0;if(!(((Ze==null?void 0:Ze.checked)??!1)&&((Rn==null?void 0:Rn.checked)??!1))){Od();return}const s=Tw(),r=lu(),a=So();if(!r||!a)return;const o=[Fe.radius,Fe.seaLevel,Fe.heightScale,Fe.subdivisions,a.atmoThicknessM??0].join("|");if(!t&&xn&&((u=xn.userData)==null?void 0:u.signature)===o){const m=((h=xn.userData)==null?void 0:h.uniforms)||{};(f=m.color)!=null&&f.value&&m.color.value.set(s.color),m.opacity&&(m.opacity.value=s.alpha),m.quantity&&(m.quantity.value=s.quantity),m.noiseScale&&(m.noiseScale.value=Math.max(1,s.resolution)),m.mode&&(m.mode.value=s.mode==="billow"?1:s.mode==="cellular"?2:0),xn.userData.settings=s;return}Od();const l=Fe.radius+Fe.heightScale*.2,c=ke.cloudSystem.buildVolumeCloudMesh(l,Fe.subdivisions,i,Fe.radius,Fe.seaLevel,Fe.heightScale,s,r,a);c.userData.signature=o,xn=c,er.add(c)}function Od(){var i,e;xn&&(er.remove(xn),xn.geometry.dispose(),(e=(i=xn.material).dispose)==null||e.call(i),xn=null)}function hu(){return{id:"base",enabled:uo.checked,alpha:ne(parseFloat(br.value)||.74,0,1),speed:ne(parseFloat(wr.value)||.9,0,2),quantity:ne(parseFloat(Er.value)||.76,0,1),height:ne(parseFloat(Tr.value)||-2.4,-5,5),color:Ar.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(Cr.value)||256)),mode:Rr.value||"billow"}}function Tw(){return{id:"water-cycle",enabled:(Rn==null?void 0:Rn.checked)??!1,alpha:ne(parseFloat(br==null?void 0:br.value)||.74,0,1),speed:ne(parseFloat(wr==null?void 0:wr.value)||.9,0,2),quantity:ne(parseFloat(Er==null?void 0:Er.value)||.76,0,2),height:ne(parseFloat(Tr==null?void 0:Tr.value)||-2.4,-5,5),color:(Ar==null?void 0:Ar.value)||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(Cr==null?void 0:Cr.value)||256)),mode:(Rr==null?void 0:Rr.value)||"billow"}}function _i(i){var n;if(!Fe)return;const e=[],t=hu();t.enabled&&e.push(t);for(const s of Gn)s.enabled&&e.push(s);ke.cloudLayerSettings=e,ke.rebuildClouds(i),Jf=((n=ke.cloudSystem)==null?void 0:n.clouds)||[]}function Aw(i){var o;if(!Fe)return;const e=ne(parseFloat(co.value)||.35,.05,1.5),t=ne(parseFloat(za.value)||.5,0,5),n=ne(parseFloat(Yf.value)||1,0,1),s=jf.value||"#4da8ff",r=ne(parseFloat(hn==null?void 0:hn.value)||.9,0,2),a={...Fe,atmosphereEnabled:($i==null?void 0:$i.checked)??!0,atmosphere:e,atmosphereHeight:t,atmosphereAlpha:n,atmosphereColor:s};ke.updateAtmosphere(a,{map:Vn(),rainHaze:r}),Qf=((o=ke.atmosphereSystem)==null?void 0:o.mesh)||null,ke.lastSettings={...ke.lastSettings||{},...a},Fe={...Fe,...a}}function Cw(i){const e=document.createElement("div");e.className="layer",e.style.border="1px solid var(--border)",e.style.padding="8px",e.style.marginBottom="8px";const t=document.createElement("div");t.textContent=`Layer ${i.label||Gn.length+1}`,t.style.fontSize="12px",t.style.color="var(--muted)",e.appendChild(t);const n=(m,g,v,p,d)=>{const _=document.createElement("div");_.className="field";const y=document.createElement("label");y.textContent=m;const x=document.createElement("div");x.className="range-row";const E=document.createElement("input");E.type="range",E.min=v,E.max=p,E.step=d,E.value=i[g];const T=document.createElement("span");return T.className="value",T.textContent=Number(i[g]).toFixed(d<1?2:0),x.appendChild(E),x.appendChild(T),_.appendChild(y),_.appendChild(x),E.addEventListener("input",()=>{i[g]=parseFloat(E.value),T.textContent=Number(i[g]).toFixed(d<1?2:0),_i(new P().copy(Jt.position).normalize())}),_},s=document.createElement("label"),r=document.createElement("input");r.type="checkbox",r.checked=i.enabled,r.addEventListener("change",()=>{i.enabled=r.checked,_i(new P().copy(Jt.position).normalize())}),s.appendChild(r),s.append(" Layer enabled"),e.appendChild(s),e.appendChild(n("Alpha","alpha",0,1,.01)),e.appendChild(n("Speed","speed",0,2,.05)),e.appendChild(n("Quantity","quantity",0,1,.01)),e.appendChild(n("Height","height",-5,5,.05)),e.appendChild(n("Resolution","resolution",1,256,1));const a=document.createElement("div");a.className="field";const o=document.createElement("label");o.textContent="Shader";const l=document.createElement("select");["fbm","billow","cellular"].forEach(m=>{const g=document.createElement("option");g.value=m,g.textContent=m.charAt(0).toUpperCase()+m.slice(1),i.mode===m&&(g.selected=!0),l.appendChild(g)}),l.addEventListener("change",()=>{i.mode=l.value,_i(new P().copy(Jt.position).normalize())}),a.appendChild(o),a.appendChild(l),e.appendChild(a);const c=document.createElement("div");c.className="field";const u=document.createElement("label");u.textContent="Color";const h=document.createElement("input");h.type="color",h.value=i.color,h.addEventListener("input",()=>{i.color=h.value,_i(new P().copy(Jt.position).normalize())}),c.appendChild(u),c.appendChild(h),e.appendChild(c);const f=document.createElement("button");return f.type="button",f.textContent="Remove layer",f.addEventListener("click",()=>{Gn=Gn.filter(m=>m!==i),du(),_i(new P().copy(Jt.position).normalize())}),e.appendChild(f),e}function du(){pd.innerHTML="";for(const i of Gn)pd.appendChild(Cw(i))}function Rw(){lt&&lt.setMode(ir()?"mobile":"desktop"),sp()}function op(){const i=er.scale.x?1/er.scale.x:1,e=ne(parseFloat(ai==null?void 0:ai.value)||23.4,0,45),t=ne(parseFloat(oi==null?void 0:oi.value)||0,0,1),n=Ka.degToRad(e),s=t*Math.PI*2,r=n*Math.sin(s),a=new P(Math.cos(r),Math.sin(r),.6).normalize().multiplyScalar(16);return Jt.position.copy(a),Ws.copy(Jt.position).normalize(),Us.identity(),mo.copy(Ws),Nt&&(Nt.getWorldQuaternion(Ca),Ca.invert(),Ud.makeRotationFromQuaternion(Ca),Us.setFromMatrix4(Ud),mo.copy(Ws).applyQuaternion(Ca).normalize()),i}function Pw(i){if(!un)return;Math.max(.05,((Fe==null?void 0:Fe.radius)??sn)*.2);const e=Math.max(3,((Fe==null?void 0:Fe.radius)??sn)*4),t=Ka.degToRad(8);vl+=i*.02;const n=Math.cos(vl),s=Math.sin(vl),r=e*n,a=e*Math.sin(t)*s,o=e*Math.cos(t)*s;un.position.set(r,a,o),un.lookAt(er.position),sw.sunDir.value.copy(Ws),Hw(),Jt.target.position.set(0,0,0),Jt.target.updateMatrixWorld()}function Dw(){var r,a,o,l,c,u,h;const i=ow.getDelta(),e=i>1e-6?1/i:0;yl=yl*.9+e*.1,an&&(an.textContent=`fps: ${yl.toFixed(1)}`),ss(),kw(i),li&&Iw(),jt.enabled?jt.update(i):lt.consume("surface")&&au(),ke.update(i,!jt.enabled&&!Gs),sp();const t=op();if(Pw(i),((Ze==null?void 0:Ze.checked)??!1)&&((ri==null?void 0:ri.checked)??!0)&&(Re!=null&&Re.enabled)&&Re.update(i,mo),(r=ke.atmosphereSystem)!=null&&r.uniforms){const f=ke.atmosphereSystem.uniforms;(a=f.sunDir)!=null&&a.value&&f.sunDir.value.copy(Ws),(o=f.planetInvRot)!=null&&o.value&&f.planetInvRot.value.copy(Us),"planetInvScale"in f&&(f.planetInvScale.value=t);const m=Vn()||ke.atmosphereSystem.defaultWeatherTexture;f.weatherMap?f.weatherMap.value=m:f.weatherMap={value:m};const g=ne(parseFloat(hn==null?void 0:hn.value)||.9,0,2);f.rainHaze&&(f.rainHaze.value=g)}if(xn){const f=Math.min(i,.25),m=((l=xn.userData)==null?void 0:l.uniforms)||{},g=((c=xn.userData)==null?void 0:c.settings)||{},v=(g==null?void 0:g.speed)||1;((u=m.windOffset)==null?void 0:u.value)!==void 0&&(m.windOffset.value+=f*v*.3),m.planetInvRot&&m.planetInvRot.value.copy(Us),m.planetInvScale&&(m.planetInvScale.value=t),m.weatherMap&&(m.weatherMap.value=Vn()),m.weatherAuxMap&&(m.weatherAuxMap.value=xi()),m.volumeAtlas&&(m.volumeAtlas.value=lu()??m.volumeAtlas.value);const p=So();p&&(m.volumeN&&(m.volumeN.value=p.n),m.tilesX&&(m.tilesX.value=p.tilesX),m.atlasW&&(m.atlasW.value=p.atlasW),m.atlasH&&(m.atlasH.value=p.atlasH),m.volumeExtentM&&(m.volumeExtentM.value=p.extentM),m.metersPerUnit&&(m.metersPerUnit.value=(p.planetRadiusM??Pf)/sn)),m.debugGrid&&(m.debugGrid.value=Lr?1:0),m.rayStepsMin&&(m.rayStepsMin.value=ep),m.rayStepsMax&&(m.rayStepsMax.value=tp),m.bundleSize&&(m.bundleSize.value=Wa)}$f(),vn&&(vn.setWeatherFrame({planetInvRot:Us,planetInvScale:t}),vn.setWeatherMap(Vn()));const s=uw(xi(),t,Us,Rs);if(vn&&vn.setWindWorld(s),Pa&&(Pa.setCenter(Mt.position),Pa.setWind(s),Pa.update(i)),(h=ke==null?void 0:ke.waterUniforms)!=null&&h.windStrength&&(ke.waterUniforms.windStrength.value=Math.min(Math.max(s.length()*1.5,.05),3)),ke!=null&&ke.setOceanWindVector&&ke.setOceanWindVector(s),vn&&vn.update(i),gr&&Fe){const f=iu;gr.setVisible(f),f&&(gr.setWeatherTextures(Vn(),xi()),gr.setPlanetRadius(Fe.radius+Fe.heightScale*.1),gr.update())}Mo(Vn()),bo(xi()),ke.setOceanWindTexture(xi()),qn.update(!jt.enabled)}async function Lw(){if(!(!navigator.xr||!Si))try{_l=await navigator.xr.isSessionSupported("immersive-vr"),Si.style.display=_l?"block":"none",Si&&(Si.disabled=!_l)}catch(i){console.warn("XR support check failed",i)}}async function lp(){if(!navigator.xr){Rt.setStatus("WebXR not available");return}try{const i=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]});if(li=i,Li.xr.enabled=!0,await Li.xr.setSession(i),Ge&&(Ge.enabled=!1),Nt&&!jt.enabled){const e=((Fe==null?void 0:Fe.radius)??sn)*ou()+((Fe==null?void 0:Fe.heightScale)??0),t=Math.max(e*2,30),n=Mt.position.clone().sub(Ge.target);n.lengthSq()<1e-6&&n.set(0,0,1),n.normalize();const s=new P(0,0,0),r=s.clone().sub(n.multiplyScalar(t));mr.position.copy(r),mr.lookAt(s),Mt.position.set(0,0,0),Mt.rotation.set(0,0,0)}Si.textContent="Exit VR",Rt.setStatus("VR session started"),i.addEventListener("end",()=>{li=null,wc.clear(),Li.xr.enabled=!1,mr.position.set(0,0,0),mr.rotation.set(0,0,0),mr.quaternion.identity(),Ge&&(Ge.enabled=!0),Si.textContent="Enter VR",Rt.setStatus("")})}catch(i){console.error(i),Rt.setStatus("VR start failed")}}function cp(){li&&li.end()}function Iw(){if(!li||!lt)return;let i=0,e=0;const t=.15;for(const n of li.inputSources){const s=n.gamepad;if(!s)continue;const r=wc.get(n)||[],a=s.buttons||[],o=s.axes||[];o.length>=4&&(i=o[2],e=o[3]);const l=a.map(c=>!!c&&c.pressed);l[0]&&!r[0]&&lt.trigger("jump"),l[1]&&!r[1]&&lt.trigger("flyToggle"),l[3]&&!r[3]&&lt.trigger("exit"),wc.set(n,l)}lt.setAction("forward",e>t),lt.setAction("backward",e<-t),lt.setAction("left",i>t),lt.setAction("right",i<-t)}Si&&Si.addEventListener("click",()=>{li?cp():lp()});yc.addEventListener("click",()=>uu(Ui.value));function Uw(i){const e=Number.isFinite(i)?i:Wr();ss(),Fe&&(Fe.planetDiameterKm=e),ip(),Gs||Rt.setStatus(`Planet diameter set to ${e.toLocaleString()} km`)}function zd(){Gs||(clearTimeout(Mc),Mc=setTimeout(()=>uu(Ui.value),400))}function Ec(){ss(),Aw(new P().copy(Jt.position).normalize())}function Tc(){ss();const i=new P().copy(Jt.position).normalize();_i(i),wo(i)}const Fw=[Ze,Rn,ri,Nr,rn,zs,Et,yt,St,vt,ks,Ei,dt,Tt,Ti,Ai,Ci,Ri,Pi,Vs,Di,hn].filter(Boolean);function Xa(i){for(const e of Fw)e.disabled=i}const Nw=[dt,Et,yt,St,vt,Tt].filter(Boolean);function up(i){for(const e of Nw)e.disabled=i}function Bw(){return{updateHz:dt==null?void 0:dt.value,volumeRes:Et==null?void 0:Et.value,rayMin:yt==null?void 0:yt.value,rayMax:St==null?void 0:St.value,rayBundle:vt==null?void 0:vt.value,moistureLayers:Tt==null?void 0:Tt.value}}function Ow(i){i&&(dt&&i.updateHz!=null&&(dt.value=i.updateHz),Et&&i.volumeRes!=null&&(Et.value=i.volumeRes),yt&&i.rayMin!=null&&(yt.value=i.rayMin),St&&i.rayMax!=null&&(St.value=i.rayMax),vt&&i.rayBundle!=null&&(vt.value=i.rayBundle),Tt&&i.moistureLayers!=null&&(Tt.value=i.moistureLayers),Or())}function kd(i){if(ns(i)){const r=ne(parseFloat(Et==null?void 0:Et.value)||8,1,128),a=ne(parseFloat(dt==null?void 0:dt.value)||1,1,20),o=ne(parseFloat(yt==null?void 0:yt.value)||28,1,128),l=ne(parseFloat(St==null?void 0:St.value)||48,1,128),c=ne(parseFloat(vt==null?void 0:vt.value)||1,1,100);let u=0,h=1/0;return su.forEach((f,m)=>{const g=Math.abs(f.n-r)+Math.abs(f.updateHz-a)*2+Math.abs(f.rayMin-o)*.5+Math.abs(f.rayMax-l)*.5+Math.abs(f.bundle-c)*2;g<h&&(h=g,u=m)}),u}const e=ne(parseFloat(dt==null?void 0:dt.value)||1,1,20),t=ne(parseFloat(Tt==null?void 0:Tt.value)||2,1,4);let n=0,s=1/0;return ru.forEach((r,a)=>{const o=Math.abs(r.updateHz-e)*2+Math.abs(r.moistureLayers-t);o<s&&(s=o,n=a)}),n}function yr(i){if(ns(i)){const e=su[Ve.tier3d];if(!e)return;Et&&(Et.value=String(e.n)),dt&&(dt.value=String(e.updateHz)),yt&&(yt.value=String(e.rayMin)),St&&(St.value=String(e.rayMax)),vt&&(vt.value=String(e.bundle))}else{const e=ru[Ve.tier2d];if(!e)return;dt&&(dt.value=String(e.updateHz)),Tt&&(Tt.value=String(e.moistureLayers))}Or()}function fu(){Ve.manual=Bw(),Ve.emaMs=16.7,Ve.overBudgetS=0,Ve.underBudgetS=0,Ve.cooldownS=0;const i=Eo();ns(i)?Ve.tier3d=kd(i):Ve.tier2d=kd(i),up(!0),yr(i)}function hp(i={}){const e=!!i.keepCurrent;up(!1),e||Ow(Ve.manual),Ve.manual=null}function Eo(){const i=((zs==null?void 0:zs.value)||"3d").toLowerCase();return i==="2d"?"2d":i==="holistic"?"holistic":"3d"}function ns(i){return i!=="2d"}function zw(){const i=parseFloat(Et==null?void 0:Et.value),e=Number.isFinite(i)?i:8;return ne(Math.round(e),1,128)}function Vd(i){const e=ns(i);Tt&&(Tt.disabled=e),Et&&(Et.disabled=!e)}let Da=0;async function dp(){const i=Eo();Vd(i);const e=++Da;try{if(ns(i)){const t=zw();if(Xi&&Xi.volumeN!==t&&(Xi=null),!Xi){const n=await _c();Xi=await nu.create({volumeN:t,surfaceW:256,surfaceH:128,device:n||void 0})}if(e!==Da)return;Re=Xi}else{if(!Ga){const t=await _c();Ga=await tu.create({gridWidth:256,gridHeight:128,device:t||void 0})}if(e!==Da)return;Re=Ga}}catch(t){if(console.warn("[WaterCycle] init failed",t),e!==Da)return;Xa(!0),Ze&&(Ze.checked=!1,Ze.disabled=!0);return}if(!(Re!=null&&Re.enabled)){Xa(!0),Ze&&(Ze.checked=!1,Ze.disabled=!0),ri&&(ri.checked=!1,ri.disabled=!0),Nr&&(Nr.disabled=!0);return}Xa(!1),Vd(i),bc&&Re.enabled&&Re.ready&&Re.setPlanetSurface(bc),pu(),Mo(Vn()),bo(xi()),wo(new P().copy(Jt.position).normalize())}function pu(){const i=Eo(),e=ne(parseFloat(Ei==null?void 0:Ei.value)||1,0,60),t=ne(parseFloat(dt==null?void 0:dt.value)||1,1,20),n=ne(parseFloat(Tt==null?void 0:Tt.value)||2,1,4),s=ne(parseFloat(Ti==null?void 0:Ti.value)||1,0,3),r=ne(parseFloat(Ai==null?void 0:Ai.value)||1,0,3),a=ne(parseFloat(Ci==null?void 0:Ci.value)||1,0,3),o=ne(parseFloat(Ri==null?void 0:Ri.value)||.75,0,2),l=ne(parseFloat(Pi==null?void 0:Pi.value)||.25,.05,1),c=(Vs==null?void 0:Vs.checked)??!0,u=ne(parseFloat(Di==null?void 0:Di.value)||1,0,2),h=ne(parseFloat(hn==null?void 0:hn.value)||.9,0,2),f=((ks==null?void 0:ks.value)||"off").toLowerCase(),m=f==="cloud"?1:f==="rain"?2:f==="pressure"?3:f==="soil"?4:f==="temp"?5:f==="snow"?6:f==="wind"?7:0,g=f==="volume"||f==="volume-grid";Lr=f==="volume-grid";let v=ne(parseFloat(yt==null?void 0:yt.value)||28,1,128),p=ne(parseFloat(St==null?void 0:St.value)||48,1,128);if(v>p){const x=v;v=p,p=x,yt&&(yt.value=String(v)),St&&(St.value=String(p))}ep=v,tp=p,Wa=ne(parseFloat(vt==null?void 0:vt.value)||1,1,100),vt&&vt.value!==String(Wa)&&(vt.value=String(Wa));const d=ne(parseFloat(Zi==null?void 0:Zi.value)||20,5,60),_=ne(parseFloat(ai==null?void 0:ai.value)||23.4,0,45),y=ne(parseFloat(oi==null?void 0:oi.value)||0,0,1);if(Re!=null&&Re.enabled&&Re.ready){const x={timeScale:e*60,readbackIntervalS:1/t,evapStrength:s,precipStrength:r,windStrength:a,oceanInertia:l,atmoThicknessM:d*1e3,axialTiltDeg:_,seasonPhase:y};i==="2d"&&(x.moistureLayers=n),Re.setConfig(x)}if(hw(o),dw(m),tw(g),nw(g),ke.setAtmosphereWeather(Vn(),h),Sc(),Sc(),vn){const x=((Ze==null?void 0:Ze.checked)??!1)&&c;if(vn.setEnabled(x),vn.setStrength(u),vn.setDensity(ne(.15+u*.35,0,1)),Fe){const A=(Fe.radius??sn)+(Fe.heightScale??0);vn.setPlanetNearRadius(A)}const E=pw(),T=.7+u*.65;vn.setSizes({dropLength:E*(6*T),dropWidth:E*(.08*T),volumeRadius:E*(340*T),volumeHeight:E*(260*T),fallDistance:E*(420*T)})}}function kw(i){if(!(rn!=null&&rn.checked)||!((Ze==null?void 0:Ze.checked)??!1))return;const e=Math.min(Math.max(i??0,0),.25);if(e<=0)return;const t=e*1e3;Ve.emaMs=Ve.emaMs*.9+t*.1;const n=Ve.emaMs>As.highMs,s=Ve.emaMs<As.lowMs;if(n?(Ve.overBudgetS+=e,Ve.underBudgetS=0):s?(Ve.underBudgetS+=e,Ve.overBudgetS=0):(Ve.overBudgetS=0,Ve.underBudgetS=0),Ve.cooldownS>0){Ve.cooldownS=Math.max(0,Ve.cooldownS-e);return}const r=Eo();Ve.overBudgetS>=As.downDelayS?(ns(r)&&Ve.tier3d>0?(Ve.tier3d-=1,yr(r)):r==="2d"&&Ve.tier2d>0&&(Ve.tier2d-=1,yr(r)),Ve.cooldownS=As.cooldownDownS,Ve.overBudgetS=0):Ve.underBudgetS>=As.upDelayS&&(ns(r)&&Ve.tier3d<su.length-1?(Ve.tier3d+=1,yr(r)):r==="2d"&&Ve.tier2d<ru.length-1&&(Ve.tier2d+=1,yr(r)),Ve.cooldownS=As.cooldownUpS,Ve.underBudgetS=0)}function Or(){ss(),dp(),Sc(),pu(),wo(new P().copy(Jt.position).normalize())}function Vw(){rn!=null&&rn.checked?fu():hp()}[co,Yf,jf,$i].forEach(i=>{i.addEventListener(i.type==="color"?"input":"change",Ec),i.type==="range"&&i.addEventListener("input",Ec)});[uo,br,wr,Er,Tr,Ar,Cr,Rr].forEach(i=>{i.addEventListener(i.type==="color"?"input":"change",Tc),i.type==="range"&&i.addEventListener("input",Tc)});[Ze,Rn,ri,zs,Et,yt,St,vt,Zi,ks,Ei,dt,Tt,Ti,Ai,Ci,Ri,Pi,Vs,Di,hn].forEach(i=>{i&&(i.addEventListener(i.type==="checkbox"?"change":i.type==="color"?"input":"change",Or),i.type==="range"&&i.addEventListener("input",Or))});rn&&rn.addEventListener("change",Vw);lo&&lo.addEventListener("click",yw);Hn&&(Hn.addEventListener("input",i=>Id(Number(i.target.value))),Hn.addEventListener("change",i=>Id(Number(i.target.value))),Js&&(Js.textContent=Hn.value));Nr&&Nr.addEventListener("click",()=>{Ze!=null&&Ze.checked&&Re!=null&&Re.enabled&&Re.ready&&Re.hasSurface&&(op(),Re.update(0,mo,{dtSimOverride:600,forceReadback:!0}))});rn!=null&&rn.checked&&fu();document.addEventListener("surface",au);Qb.addEventListener("click",()=>{const i=hu(),e=Gn.length?Gn[Gn.length-1].height:i.height,t={...i,id:`extra-${Date.now()}`,height:e+.3};Gn.push(t),du(),_i(new P().copy(Jt.position).normalize())});window.addEventListener("resize",Rw);[ka,Va,Ha].forEach(i=>{i&&i.addEventListener("input",ss)});Dr&&Dr.addEventListener("change",ss);Xa(!0);dp();(async()=>{var i;try{await ke.initOceanCompute(),(i=ke.oceanComputeSystem)!=null&&i.enabled&&console.log("[Ocean] WebGPU compute ocean initialized")}catch(e){console.warn("[Ocean] Failed to init compute ocean:",e)}})();Qi&&Qi.addEventListener("change",()=>{if(!Fe||!ke.planet)return;const i=cu(),e=Fe,t=ke.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,i);ke.replaceWater(t),Zf=ke.water,Rt.setStatus(`Water shader: ${i}`)});const Hd=bw();Hd&&Ui&&(Ui.value=Hd);ap(Ui.value);uu(Ui.value);du();cw();Li.setAnimationLoop(Dw);Lw();function Hw(){if(!un)return;const i=new P().copy(Ws).normalize().multiplyScalar(-1),e=new P().copy(Mt.position).sub(un.position).normalize(),t=Math.max(0,i.dot(e)),n=un.material;n.emissiveIntensity=0,n.color.setScalar(.75+.25*t),n.needsUpdate=!0}
