var l0=Object.defineProperty;var c0=(n,e,t)=>e in n?l0(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var j=(n,e,t)=>c0(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ru="171",Jr={ROTATE:0,DOLLY:1,PAN:2},u0=0,Ch=1,h0=2,pp=1,mp=2,oi=3,Mn=0,on=1,Ln=2,Fi=0,Kn=1,Ao=2,Rh=3,Ph=4,d0=5,or=100,f0=101,p0=102,m0=103,g0=104,v0=200,x0=201,y0=202,_0=203,mc=204,gc=205,b0=206,w0=207,S0=208,M0=209,E0=210,T0=211,A0=212,C0=213,R0=214,vc=0,xc=1,yc=2,cs=3,_c=4,bc=5,wc=6,Sc=7,Pu=0,P0=1,D0=2,Ni=0,L0=1,I0=2,U0=3,F0=4,N0=5,B0=6,O0=7,gp=300,us=301,hs=302,Mc=303,Ec=304,nl=306,En=1e3,pt=1001,Tc=1002,Pt=1003,z0=1004,wa=1005,it=1006,gl=1007,cr=1008,Lt=1009,vp=1010,xp=1011,ia=1012,Du=1013,pr=1014,hi=1015,ha=1016,Lu=1017,Iu=1018,ds=1020,yp=35902,_p=1021,bp=1022,St=1023,wp=1024,Sp=1025,es=1026,fs=1027,Mp=1028,Uu=1029,Ep=1030,Fu=1031,Nu=1033,co=33776,uo=33777,ho=33778,fo=33779,Ac=35840,Cc=35841,Rc=35842,Pc=35843,Dc=36196,Lc=37492,Ic=37496,Uc=37808,Fc=37809,Nc=37810,Bc=37811,Oc=37812,zc=37813,kc=37814,Vc=37815,Gc=37816,Hc=37817,Wc=37818,qc=37819,Xc=37820,$c=37821,po=36492,Yc=36494,jc=36495,Tp=36283,Kc=36284,Zc=36285,Qc=36286,k0=3200,V0=3201,Bu=0,G0=1,Nt="",bn="srgb",ps="srgb-linear",Co="linear",at="srgb",wr=7680,Dh=519,H0=512,W0=513,q0=514,Ap=515,X0=516,$0=517,Y0=518,j0=519,Jc=35044,Lh="300 es",di=2e3,Ro=2001;class yr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const $t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ih=1234567;const Ws=Math.PI/180,ra=180/Math.PI;function fi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]).toLowerCase()}function We(n,e,t){return Math.max(e,Math.min(t,n))}function Ou(n,e){return(n%e+e)%e}function K0(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Z0(n,e,t){return n!==e?(t-n)/(e-n):0}function qs(n,e,t){return(1-t)*n+t*e}function Q0(n,e,t,i){return qs(n,e,1-Math.exp(-t*i))}function J0(n,e=1){return e-Math.abs(Ou(n,e*2)-e)}function eg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function tg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function ng(n,e){return n+Math.floor(Math.random()*(e-n+1))}function ig(n,e){return n+Math.random()*(e-n)}function rg(n){return n*(.5-Math.random())}function sg(n){n!==void 0&&(Ih=n);let e=Ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ag(n){return n*Ws}function og(n){return n*ra}function lg(n){return(n&n-1)===0&&n!==0}function cg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ug(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function hg(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),d=s((e-i)/2),f=a((e-i)/2),g=s((i-e)/2),p=a((i-e)/2);switch(r){case"XYX":n.set(o*h,l*d,l*f,o*c);break;case"YZY":n.set(l*f,o*h,l*d,o*c);break;case"ZXZ":n.set(l*d,l*f,o*h,o*c);break;case"XZX":n.set(o*h,l*p,l*g,o*c);break;case"YXY":n.set(l*g,o*h,l*p,o*c);break;case"ZYZ":n.set(l*p,l*g,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Hn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function st(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Po={DEG2RAD:Ws,RAD2DEG:ra,generateUUID:fi,clamp:We,euclideanModulo:Ou,mapLinear:K0,inverseLerp:Z0,lerp:qs,damp:Q0,pingpong:J0,smoothstep:eg,smootherstep:tg,randInt:ng,randFloat:ig,randFloatSpread:rg,seededRandom:sg,degToRad:ag,radToDeg:og,isPowerOfTwo:lg,ceilPowerOfTwo:cg,floorPowerOfTwo:ug,setQuaternionFromProperEuler:hg,normalize:st,denormalize:Hn};class Ee{constructor(e=0,t=0){Ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fe{constructor(e,t,i,r,s,a,o,l,c){Fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],f=i[2],g=i[5],p=i[8],y=r[0],m=r[3],u=r[6],v=r[1],_=r[4],x=r[7],M=r[2],S=r[5],E=r[8];return s[0]=a*y+o*v+l*M,s[3]=a*m+o*_+l*S,s[6]=a*u+o*x+l*E,s[1]=c*y+h*v+d*M,s[4]=c*m+h*_+d*S,s[7]=c*u+h*x+d*E,s[2]=f*y+g*v+p*M,s[5]=f*m+g*_+p*S,s[8]=f*u+g*x+p*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,f=o*l-h*s,g=c*s-a*l,p=t*d+i*f+r*g;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/p;return e[0]=d*y,e[1]=(r*c-h*i)*y,e[2]=(o*i-r*a)*y,e[3]=f*y,e[4]=(h*t-r*l)*y,e[5]=(r*s-o*t)*y,e[6]=g*y,e[7]=(i*l-c*t)*y,e[8]=(a*t-i*s)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(vl.makeScale(e,t)),this}rotate(e){return this.premultiply(vl.makeRotation(-e)),this}translate(e,t){return this.premultiply(vl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const vl=new Fe;function Cp(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Do(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function dg(){const n=Do("canvas");return n.style.display="block",n}const Uh={};function Wr(n){n in Uh||(Uh[n]=!0,console.warn(n))}function fg(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function pg(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function mg(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Fh=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Nh=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gg(){const n={enabled:!0,workingColorSpace:ps,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===at&&(r.r=pi(r.r),r.g=pi(r.g),r.b=pi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(r.r=ts(r.r),r.g=ts(r.g),r.b=ts(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Nt?Co:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ps]:{primaries:e,whitePoint:i,transfer:Co,toXYZ:Fh,fromXYZ:Nh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:e,whitePoint:i,transfer:at,toXYZ:Fh,fromXYZ:Nh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}}),n}const Je=gg();function pi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ts(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Sr;class vg{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Sr===void 0&&(Sr=Do("canvas")),Sr.width=e.width,Sr.height=e.height;const i=Sr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Sr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Do("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=pi(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(pi(t[i]/255)*255):t[i]=pi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xg=0;class Rp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xg++}),this.uuid=fi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(xl(r[a].image)):s.push(xl(r[a]))}else s=xl(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function xl(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?vg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yg=0;class ln extends yr{constructor(e=ln.DEFAULT_IMAGE,t=ln.DEFAULT_MAPPING,i=pt,r=pt,s=it,a=cr,o=St,l=Lt,c=ln.DEFAULT_ANISOTROPY,h=Nt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yg++}),this.uuid=fi(),this.name="",this.source=new Rp(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case En:e.x=e.x-Math.floor(e.x);break;case pt:e.x=e.x<0?0:1;break;case Tc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case En:e.y=e.y-Math.floor(e.y);break;case pt:e.y=e.y<0?0:1;break;case Tc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=gp;ln.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,i=0,r=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],h=l[4],d=l[8],f=l[1],g=l[5],p=l[9],y=l[2],m=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-y)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+y)<.1&&Math.abs(p+m)<.1&&Math.abs(c+g+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(g+1)/2,M=(u+1)/2,S=(h+f)/4,E=(d+y)/4,C=(p+m)/4;return _>x&&_>M?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=S/i,s=E/i):x>M?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=S/r,s=C/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=E/s,r=C/s),this.set(i,r,s,t),this}let v=Math.sqrt((m-p)*(m-p)+(d-y)*(d-y)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(d-y)/v,this.z=(f-h)/v,this.w=Math.acos((c+g+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _g extends yr{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:it,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new ln(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Rp(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mr extends _g{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Pp extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class bg extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qn{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],d=i[r+3];const f=s[a+0],g=s[a+1],p=s[a+2],y=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=g,e[t+2]=p,e[t+3]=y;return}if(d!==y||l!==f||c!==g||h!==p){let m=1-o;const u=l*f+c*g+h*p+d*y,v=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){const M=Math.sqrt(_),S=Math.atan2(M,u*v);m=Math.sin(m*S)/M,o=Math.sin(o*S)/M}const x=o*v;if(l=l*m+f*x,c=c*m+g*x,h=h*m+p*x,d=d*m+y*x,m===1-o){const M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],d=s[a],f=s[a+1],g=s[a+2],p=s[a+3];return e[t]=o*p+h*d+l*g-c*f,e[t+1]=l*p+h*f+c*d-o*g,e[t+2]=c*p+h*g+o*f-l*d,e[t+3]=h*p-o*d-l*f-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),d=o(s/2),f=l(i/2),g=l(r/2),p=l(s/2);switch(a){case"XYZ":this._x=f*h*d+c*g*p,this._y=c*g*d-f*h*p,this._z=c*h*p+f*g*d,this._w=c*h*d-f*g*p;break;case"YXZ":this._x=f*h*d+c*g*p,this._y=c*g*d-f*h*p,this._z=c*h*p-f*g*d,this._w=c*h*d+f*g*p;break;case"ZXY":this._x=f*h*d-c*g*p,this._y=c*g*d+f*h*p,this._z=c*h*p+f*g*d,this._w=c*h*d-f*g*p;break;case"ZYX":this._x=f*h*d-c*g*p,this._y=c*g*d+f*h*p,this._z=c*h*p-f*g*d,this._w=c*h*d+f*g*p;break;case"YZX":this._x=f*h*d+c*g*p,this._y=c*g*d+f*h*p,this._z=c*h*p-f*g*d,this._w=c*h*d-f*g*p;break;case"XZY":this._x=f*h*d-c*g*p,this._y=c*g*d-f*h*p,this._z=c*h*p+f*g*d,this._w=c*h*d+f*g*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],f=i+o+d;if(f>0){const g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-l)*g,this._y=(s-c)*g,this._z=(a-r)*g}else if(i>o&&i>d){const g=2*Math.sqrt(1+i-o-d);this._w=(h-l)/g,this._x=.25*g,this._y=(r+a)/g,this._z=(s+c)/g}else if(o>d){const g=2*Math.sqrt(1+o-i-d);this._w=(s-c)/g,this._x=(r+a)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+d-i-o);this._w=(a-r)/g,this._x=(s+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const g=1-t;return this._w=g*a+t*this._w,this._x=g*i+t*this._x,this._y=g*r+t*this._y,this._z=g*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*d+this._w*f,this._x=i*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*t-s*r),d=2*(s*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=r+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return yl.copy(this).projectOnVector(e),this.sub(yl)}reflect(e){return this.sub(yl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const yl=new D,Bh=new qn;class da{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Bn):Bn.fromBufferAttribute(s,a),Bn.applyMatrix4(e.matrixWorld),this.expandByPoint(Bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Sa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Sa.copy(i.boundingBox)),Sa.applyMatrix4(e.matrixWorld),this.union(Sa)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bn),Bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ws),Ma.subVectors(this.max,ws),Mr.subVectors(e.a,ws),Er.subVectors(e.b,ws),Tr.subVectors(e.c,ws),wi.subVectors(Er,Mr),Si.subVectors(Tr,Er),Qi.subVectors(Mr,Tr);let t=[0,-wi.z,wi.y,0,-Si.z,Si.y,0,-Qi.z,Qi.y,wi.z,0,-wi.x,Si.z,0,-Si.x,Qi.z,0,-Qi.x,-wi.y,wi.x,0,-Si.y,Si.x,0,-Qi.y,Qi.x,0];return!_l(t,Mr,Er,Tr,Ma)||(t=[1,0,0,0,1,0,0,0,1],!_l(t,Mr,Er,Tr,Ma))?!1:(Ea.crossVectors(wi,Si),t=[Ea.x,Ea.y,Ea.z],_l(t,Mr,Er,Tr,Ma))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ni=[new D,new D,new D,new D,new D,new D,new D,new D],Bn=new D,Sa=new da,Mr=new D,Er=new D,Tr=new D,wi=new D,Si=new D,Qi=new D,ws=new D,Ma=new D,Ea=new D,Ji=new D;function _l(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Ji.fromArray(n,s);const o=r.x*Math.abs(Ji.x)+r.y*Math.abs(Ji.y)+r.z*Math.abs(Ji.z),l=e.dot(Ji),c=t.dot(Ji),h=i.dot(Ji);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const wg=new da,Ss=new D,bl=new D;class fa{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):wg.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ss.subVectors(e,this.center);const t=Ss.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ss,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ss.copy(e.center).add(bl)),this.expandByPoint(Ss.copy(e.center).sub(bl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ii=new D,wl=new D,Ta=new D,Mi=new D,Sl=new D,Aa=new D,Ml=new D;class il{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ii)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ii.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ii.copy(this.origin).addScaledVector(this.direction,t),ii.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){wl.copy(e).add(t).multiplyScalar(.5),Ta.copy(t).sub(e).normalize(),Mi.copy(this.origin).sub(wl);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Ta),o=Mi.dot(this.direction),l=-Mi.dot(Ta),c=Mi.lengthSq(),h=Math.abs(1-a*a);let d,f,g,p;if(h>0)if(d=a*l-o,f=a*o-l,p=s*h,d>=0)if(f>=-p)if(f<=p){const y=1/h;d*=y,f*=y,g=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=s,d=Math.max(0,-(a*f+o)),g=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(a*f+o)),g=-d*d+f*(f+2*l)+c;else f<=-p?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-l),s),g=-d*d+f*(f+2*l)+c):f<=p?(d=0,f=Math.min(Math.max(-s,-l),s),g=f*(f+2*l)+c):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-l),s),g=-d*d+f*(f+2*l)+c);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),g=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(wl).addScaledVector(Ta,f),g}intersectSphere(e,t){ii.subVectors(e.center,this.origin);const i=ii.dot(this.direction),r=ii.dot(ii)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,ii)!==null}intersectTriangle(e,t,i,r,s){Sl.subVectors(t,e),Aa.subVectors(i,e),Ml.crossVectors(Sl,Aa);let a=this.direction.dot(Ml),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Mi.subVectors(this.origin,e);const l=o*this.direction.dot(Aa.crossVectors(Mi,Aa));if(l<0)return null;const c=o*this.direction.dot(Sl.cross(Mi));if(c<0||l+c>a)return null;const h=-o*Mi.dot(Ml);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,i,r,s,a,o,l,c,h,d,f,g,p,y,m){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,h,d,f,g,p,y,m)}set(e,t,i,r,s,a,o,l,c,h,d,f,g,p,y,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=g,u[7]=p,u[11]=y,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ar.setFromMatrixColumn(e,0).length(),s=1/Ar.setFromMatrixColumn(e,1).length(),a=1/Ar.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*h,g=a*d,p=o*h,y=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=g+p*c,t[5]=f-y*c,t[9]=-o*l,t[2]=y-f*c,t[6]=p+g*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,g=l*d,p=c*h,y=c*d;t[0]=f+y*o,t[4]=p*o-g,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=g*o-p,t[6]=y+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,g=l*d,p=c*h,y=c*d;t[0]=f-y*o,t[4]=-a*d,t[8]=p+g*o,t[1]=g+p*o,t[5]=a*h,t[9]=y-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,g=a*d,p=o*h,y=o*d;t[0]=l*h,t[4]=p*c-g,t[8]=f*c+y,t[1]=l*d,t[5]=y*c+f,t[9]=g*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,g=a*c,p=o*l,y=o*c;t[0]=l*h,t[4]=y-f*d,t[8]=p*d+g,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=g*d+p,t[10]=f-y*d}else if(e.order==="XZY"){const f=a*l,g=a*c,p=o*l,y=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=f*d+y,t[5]=a*h,t[9]=g*d-p,t[2]=p*d-g,t[6]=o*h,t[10]=y*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sg,e,Mg)}lookAt(e,t,i){const r=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Ei.crossVectors(i,xn),Ei.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Ei.crossVectors(i,xn)),Ei.normalize(),Ca.crossVectors(xn,Ei),r[0]=Ei.x,r[4]=Ca.x,r[8]=xn.x,r[1]=Ei.y,r[5]=Ca.y,r[9]=xn.y,r[2]=Ei.z,r[6]=Ca.z,r[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],f=i[9],g=i[13],p=i[2],y=i[6],m=i[10],u=i[14],v=i[3],_=i[7],x=i[11],M=i[15],S=r[0],E=r[4],C=r[8],w=r[12],b=r[1],R=r[5],I=r[9],N=r[13],O=r[2],H=r[6],k=r[10],q=r[14],z=r[3],$=r[7],ne=r[11],re=r[15];return s[0]=a*S+o*b+l*O+c*z,s[4]=a*E+o*R+l*H+c*$,s[8]=a*C+o*I+l*k+c*ne,s[12]=a*w+o*N+l*q+c*re,s[1]=h*S+d*b+f*O+g*z,s[5]=h*E+d*R+f*H+g*$,s[9]=h*C+d*I+f*k+g*ne,s[13]=h*w+d*N+f*q+g*re,s[2]=p*S+y*b+m*O+u*z,s[6]=p*E+y*R+m*H+u*$,s[10]=p*C+y*I+m*k+u*ne,s[14]=p*w+y*N+m*q+u*re,s[3]=v*S+_*b+x*O+M*z,s[7]=v*E+_*R+x*H+M*$,s[11]=v*C+_*I+x*k+M*ne,s[15]=v*w+_*N+x*q+M*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],f=e[10],g=e[14],p=e[3],y=e[7],m=e[11],u=e[15];return p*(+s*l*d-r*c*d-s*o*f+i*c*f+r*o*g-i*l*g)+y*(+t*l*g-t*c*f+s*a*f-r*a*g+r*c*h-s*l*h)+m*(+t*c*d-t*o*g-s*a*d+i*a*g+s*o*h-i*c*h)+u*(-r*o*h-t*l*d+t*o*f+r*a*d-i*a*f+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],f=e[10],g=e[11],p=e[12],y=e[13],m=e[14],u=e[15],v=d*m*c-y*f*c+y*l*g-o*m*g-d*l*u+o*f*u,_=p*f*c-h*m*c-p*l*g+a*m*g+h*l*u-a*f*u,x=h*y*c-p*d*c+p*o*g-a*y*g-h*o*u+a*d*u,M=p*d*l-h*y*l-p*o*f+a*y*f+h*o*m-a*d*m,S=t*v+i*_+r*x+s*M;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return e[0]=v*E,e[1]=(y*f*s-d*m*s-y*r*g+i*m*g+d*r*u-i*f*u)*E,e[2]=(o*m*s-y*l*s+y*r*c-i*m*c-o*r*u+i*l*u)*E,e[3]=(d*l*s-o*f*s-d*r*c+i*f*c+o*r*g-i*l*g)*E,e[4]=_*E,e[5]=(h*m*s-p*f*s+p*r*g-t*m*g-h*r*u+t*f*u)*E,e[6]=(p*l*s-a*m*s-p*r*c+t*m*c+a*r*u-t*l*u)*E,e[7]=(a*f*s-h*l*s+h*r*c-t*f*c-a*r*g+t*l*g)*E,e[8]=x*E,e[9]=(p*d*s-h*y*s-p*i*g+t*y*g+h*i*u-t*d*u)*E,e[10]=(a*y*s-p*o*s+p*i*c-t*y*c-a*i*u+t*o*u)*E,e[11]=(h*o*s-a*d*s-h*i*c+t*d*c+a*i*g-t*o*g)*E,e[12]=M*E,e[13]=(h*y*r-p*d*r+p*i*f-t*y*f-h*i*m+t*d*m)*E,e[14]=(p*o*r-a*y*r-p*i*l+t*y*l+a*i*m-t*o*m)*E,e[15]=(a*d*r-h*o*r+h*i*l-t*d*l-a*i*f+t*o*f)*E,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,f=s*c,g=s*h,p=s*d,y=a*h,m=a*d,u=o*d,v=l*c,_=l*h,x=l*d,M=i.x,S=i.y,E=i.z;return r[0]=(1-(y+u))*M,r[1]=(g+x)*M,r[2]=(p-_)*M,r[3]=0,r[4]=(g-x)*S,r[5]=(1-(f+u))*S,r[6]=(m+v)*S,r[7]=0,r[8]=(p+_)*E,r[9]=(m-v)*E,r[10]=(1-(f+y))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Ar.set(r[0],r[1],r[2]).length();const a=Ar.set(r[4],r[5],r[6]).length(),o=Ar.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],On.copy(this);const c=1/s,h=1/a,d=1/o;return On.elements[0]*=c,On.elements[1]*=c,On.elements[2]*=c,On.elements[4]*=h,On.elements[5]*=h,On.elements[6]*=h,On.elements[8]*=d,On.elements[9]*=d,On.elements[10]*=d,t.setFromRotationMatrix(On),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=di){const l=this.elements,c=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,p;if(o===di)g=-(a+s)/(a-s),p=-2*a*s/(a-s);else if(o===Ro)g=-a/(a-s),p=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=di){const l=this.elements,c=1/(t-e),h=1/(i-r),d=1/(a-s),f=(t+e)*c,g=(i+r)*h;let p,y;if(o===di)p=(a+s)*d,y=-2*d;else if(o===Ro)p=s*d,y=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-g,l[2]=0,l[6]=0,l[10]=y,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ar=new D,On=new ot,Sg=new D(0,0,0),Mg=new D(1,1,1),Ei=new D,Ca=new D,xn=new D,Oh=new ot,zh=new qn;class Xn{constructor(e=0,t=0,i=0,r=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],d=r[2],f=r[6],g=r[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Oh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Oh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zh.setFromEuler(this),this.setFromQuaternion(zh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class zu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Eg=0;const kh=new D,Cr=new qn,ri=new ot,Ra=new D,Ms=new D,Tg=new D,Ag=new qn,Vh=new D(1,0,0),Gh=new D(0,1,0),Hh=new D(0,0,1),Wh={type:"added"},Cg={type:"removed"},Rr={type:"childadded",child:null},El={type:"childremoved",child:null};class Mt extends yr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Eg++}),this.uuid=fi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new D,t=new Xn,i=new qn,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new Fe}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Cr.setFromAxisAngle(e,t),this.quaternion.multiply(Cr),this}rotateOnWorldAxis(e,t){return Cr.setFromAxisAngle(e,t),this.quaternion.premultiply(Cr),this}rotateX(e){return this.rotateOnAxis(Vh,e)}rotateY(e){return this.rotateOnAxis(Gh,e)}rotateZ(e){return this.rotateOnAxis(Hh,e)}translateOnAxis(e,t){return kh.copy(e).applyQuaternion(this.quaternion),this.position.add(kh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vh,e)}translateY(e){return this.translateOnAxis(Gh,e)}translateZ(e){return this.translateOnAxis(Hh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ra.copy(e):Ra.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(Ms,Ra,this.up):ri.lookAt(Ra,Ms,this.up),this.quaternion.setFromRotationMatrix(ri),r&&(ri.extractRotation(r.matrixWorld),Cr.setFromRotationMatrix(ri),this.quaternion.premultiply(Cr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wh),Rr.child=e,this.dispatchEvent(Rr),Rr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Cg),El.child=e,this.dispatchEvent(El),El.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wh),Rr.child=e,this.dispatchEvent(Rr),Rr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,e,Tg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ms,Ag,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),f=a(e.skeletons),g=a(e.animations),p=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),g.length>0&&(i.animations=g),p.length>0&&(i.nodes=p)}return i.object=r,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Mt.DEFAULT_UP=new D(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zn=new D,si=new D,Tl=new D,ai=new D,Pr=new D,Dr=new D,qh=new D,Al=new D,Cl=new D,Rl=new D,Pl=new xt,Dl=new xt,Ll=new xt;class In{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),zn.subVectors(e,t),r.cross(zn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){zn.subVectors(r,t),si.subVectors(i,t),Tl.subVectors(e,t);const a=zn.dot(zn),o=zn.dot(si),l=zn.dot(Tl),c=si.dot(si),h=si.dot(Tl),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,g=(c*l-o*h)*f,p=(a*h-o*l)*f;return s.set(1-g-p,p,g)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ai.x),l.addScaledVector(a,ai.y),l.addScaledVector(o,ai.z),l)}static getInterpolatedAttribute(e,t,i,r,s,a){return Pl.setScalar(0),Dl.setScalar(0),Ll.setScalar(0),Pl.fromBufferAttribute(e,t),Dl.fromBufferAttribute(e,i),Ll.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Pl,s.x),a.addScaledVector(Dl,s.y),a.addScaledVector(Ll,s.z),a}static isFrontFacing(e,t,i,r){return zn.subVectors(i,t),si.subVectors(e,t),zn.cross(si).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),si.subVectors(this.a,this.b),zn.cross(si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return In.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return In.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return In.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return In.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return In.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Pr.subVectors(r,i),Dr.subVectors(s,i),Al.subVectors(e,i);const l=Pr.dot(Al),c=Dr.dot(Al);if(l<=0&&c<=0)return t.copy(i);Cl.subVectors(e,r);const h=Pr.dot(Cl),d=Dr.dot(Cl);if(h>=0&&d<=h)return t.copy(r);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Pr,a);Rl.subVectors(e,s);const g=Pr.dot(Rl),p=Dr.dot(Rl);if(p>=0&&g<=p)return t.copy(s);const y=g*c-l*p;if(y<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(i).addScaledVector(Dr,o);const m=h*p-g*d;if(m<=0&&d-h>=0&&g-p>=0)return qh.subVectors(s,r),o=(d-h)/(d-h+(g-p)),t.copy(r).addScaledVector(qh,o);const u=1/(m+y+f);return a=y*u,o=f*u,t.copy(i).addScaledVector(Pr,a).addScaledVector(Dr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ti={h:0,s:0,l:0},Pa={h:0,s:0,l:0};function Il(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Se{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Je.workingColorSpace){if(e=Ou(e,1),t=We(t,0,1),i=We(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Il(a,s,e+1/3),this.g=Il(a,s,e),this.b=Il(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,t=bn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bn){const i=Dp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pi(e.r),this.g=pi(e.g),this.b=pi(e.b),this}copyLinearToSRGB(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bn){return Je.fromWorkingColorSpace(Yt.copy(this),e),Math.round(We(Yt.r*255,0,255))*65536+Math.round(We(Yt.g*255,0,255))*256+Math.round(We(Yt.b*255,0,255))}getHexString(e=bn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Yt.copy(this),t);const i=Yt.r,r=Yt.g,s=Yt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=bn){Je.fromWorkingColorSpace(Yt.copy(this),e);const t=Yt.r,i=Yt.g,r=Yt.b;return e!==bn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Ti),this.setHSL(Ti.h+e,Ti.s+t,Ti.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ti),e.getHSL(Pa);const i=qs(Ti.h,Pa.h,t),r=qs(Ti.s,Pa.s,t),s=qs(Ti.l,Pa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Se;Se.NAMES=Dp;let Rg=0;class yi extends yr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rg++}),this.uuid=fi(),this.name="",this.type="Material",this.blending=Kn,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mc,this.blendDst=gc,this.blendEquation=or,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wr,this.stencilZFail=wr,this.stencilZPass=wr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Kn&&(i.blending=this.blending),this.side!==Mn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==mc&&(i.blendSrc=this.blendSrc),this.blendDst!==gc&&(i.blendDst=this.blendDst),this.blendEquation!==or&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Lp extends yi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Pu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new D,Da=new Ee;class Dt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Jc,this.updateRanges=[],this.gpuType=hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Da.fromBufferAttribute(this,t),Da.applyMatrix3(e),this.setXY(t,Da.x,Da.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Hn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=st(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jc&&(e.usage=this.usage),e}}class Ip extends Dt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Up extends Dt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class cn extends Dt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Pg=0;const Rn=new ot,Ul=new Mt,Lr=new D,yn=new da,Es=new da,Ft=new D;class Jt extends yr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pg++}),this.uuid=fi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cp(e)?Up:Ip)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Fe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,i){return Rn.makeTranslation(e,t,i),this.applyMatrix4(Rn),this}scale(e,t,i){return Rn.makeScale(e,t,i),this.applyMatrix4(Rn),this}lookAt(e){return Ul.lookAt(e),Ul.updateMatrix(),this.applyMatrix4(Ul.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Lr).negate(),this.translate(Lr.x,Lr.y,Lr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new cn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new da);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];yn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Es.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(yn.min,Es.min),yn.expandByPoint(Ft),Ft.addVectors(yn.max,Es.max),yn.expandByPoint(Ft)):(yn.expandByPoint(Es.min),yn.expandByPoint(Es.max))}yn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ft.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ft));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ft.fromBufferAttribute(o,c),l&&(Lr.fromBufferAttribute(e,c),Ft.add(Lr)),r=Math.max(r,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new D,l[C]=new D;const c=new D,h=new D,d=new D,f=new Ee,g=new Ee,p=new Ee,y=new D,m=new D;function u(C,w,b){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,w),d.fromBufferAttribute(i,b),f.fromBufferAttribute(s,C),g.fromBufferAttribute(s,w),p.fromBufferAttribute(s,b),h.sub(c),d.sub(c),g.sub(f),p.sub(f);const R=1/(g.x*p.y-p.x*g.y);isFinite(R)&&(y.copy(h).multiplyScalar(p.y).addScaledVector(d,-g.y).multiplyScalar(R),m.copy(d).multiplyScalar(g.x).addScaledVector(h,-p.x).multiplyScalar(R),o[C].add(y),o[w].add(y),o[b].add(y),l[C].add(m),l[w].add(m),l[b].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let C=0,w=v.length;C<w;++C){const b=v[C],R=b.start,I=b.count;for(let N=R,O=R+I;N<O;N+=3)u(e.getX(N+0),e.getX(N+1),e.getX(N+2))}const _=new D,x=new D,M=new D,S=new D;function E(C){M.fromBufferAttribute(r,C),S.copy(M);const w=o[C];_.copy(w),_.sub(M.multiplyScalar(M.dot(w))).normalize(),x.crossVectors(S,w);const R=x.dot(l[C])<0?-1:1;a.setXYZW(C,_.x,_.y,_.z,R)}for(let C=0,w=v.length;C<w;++C){const b=v[C],R=b.start,I=b.count;for(let N=R,O=R+I;N<O;N+=3)E(e.getX(N+0)),E(e.getX(N+1)),E(e.getX(N+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,g=i.count;f<g;f++)i.setXYZ(f,0,0,0);const r=new D,s=new D,a=new D,o=new D,l=new D,c=new D,h=new D,d=new D;if(e)for(let f=0,g=e.count;f<g;f+=3){const p=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,p),s.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,g=t.count;f<g;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,f=new c.constructor(l.length*h);let g=0,p=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?g=l[y]*o.data.stride+o.offset:g=l[y]*h;for(let u=0;u<h;u++)f[p++]=c[g++]}return new Dt(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Jt,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){const f=c[h],g=e(f,i);l.push(g)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const g=c[d];h.push(g.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let f=0,g=d.length;f<g;f++)h.push(d[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Xh=new ot,er=new il,La=new fa,$h=new D,Ia=new D,Ua=new D,Fa=new D,Fl=new D,Na=new D,Yh=new D,Ba=new D;class Vt extends Mt{constructor(e=new Jt,t=new Lp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Na.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],d=s[l];h!==0&&(Fl.fromBufferAttribute(d,e),a?Na.addScaledVector(Fl,h):Na.addScaledVector(Fl.sub(t),h))}t.add(Na)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),La.copy(i.boundingSphere),La.applyMatrix4(s),er.copy(e.ray).recast(e.near),!(La.containsPoint(er.origin)===!1&&(er.intersectSphere(La,$h)===null||er.origin.distanceToSquared($h)>(e.far-e.near)**2))&&(Xh.copy(s).invert(),er.copy(e.ray).applyMatrix4(Xh),!(i.boundingBox!==null&&er.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,er)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,f=s.groups,g=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,y=f.length;p<y;p++){const m=f[p],u=a[m.materialIndex],v=Math.max(m.start,g.start),_=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let x=v,M=_;x<M;x+=3){const S=o.getX(x),E=o.getX(x+1),C=o.getX(x+2);r=Oa(this,u,e,i,c,h,d,S,E,C),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const p=Math.max(0,g.start),y=Math.min(o.count,g.start+g.count);for(let m=p,u=y;m<u;m+=3){const v=o.getX(m),_=o.getX(m+1),x=o.getX(m+2);r=Oa(this,a,e,i,c,h,d,v,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,y=f.length;p<y;p++){const m=f[p],u=a[m.materialIndex],v=Math.max(m.start,g.start),_=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let x=v,M=_;x<M;x+=3){const S=x,E=x+1,C=x+2;r=Oa(this,u,e,i,c,h,d,S,E,C),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const p=Math.max(0,g.start),y=Math.min(l.count,g.start+g.count);for(let m=p,u=y;m<u;m+=3){const v=m,_=m+1,x=m+2;r=Oa(this,a,e,i,c,h,d,v,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Dg(n,e,t,i,r,s,a,o){let l;if(e.side===on?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===Mn,o),l===null)return null;Ba.copy(o),Ba.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ba);return c<t.near||c>t.far?null:{distance:c,point:Ba.clone(),object:n}}function Oa(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Ia),n.getVertexPosition(l,Ua),n.getVertexPosition(c,Fa);const h=Dg(n,e,t,i,Ia,Ua,Fa,Yh);if(h){const d=new D;In.getBarycoord(Yh,Ia,Ua,Fa,d),r&&(h.uv=In.getInterpolatedAttribute(r,o,l,c,d,new Ee)),s&&(h.uv1=In.getInterpolatedAttribute(s,o,l,c,d,new Ee)),a&&(h.normal=In.getInterpolatedAttribute(a,o,l,c,d,new D),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new D,materialIndex:0};In.getNormal(Ia,Ua,Fa,f.normal),h.face=f,h.barycoord=d}return h}class pa extends Jt{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],d=[];let f=0,g=0;p("z","y","x",-1,-1,i,t,e,a,s,0),p("z","y","x",1,-1,i,t,-e,a,s,1),p("x","z","y",1,1,e,i,t,r,a,2),p("x","z","y",1,-1,e,i,-t,r,a,3),p("x","y","z",1,-1,e,t,i,r,s,4),p("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new cn(c,3)),this.setAttribute("normal",new cn(h,3)),this.setAttribute("uv",new cn(d,2));function p(y,m,u,v,_,x,M,S,E,C,w){const b=x/E,R=M/C,I=x/2,N=M/2,O=S/2,H=E+1,k=C+1;let q=0,z=0;const $=new D;for(let ne=0;ne<k;ne++){const re=ne*R-N;for(let he=0;he<H;he++){const ge=he*b-I;$[y]=ge*v,$[m]=re*_,$[u]=O,c.push($.x,$.y,$.z),$[y]=0,$[m]=0,$[u]=S>0?1:-1,h.push($.x,$.y,$.z),d.push(he/E),d.push(1-ne/C),q+=1}}for(let ne=0;ne<C;ne++)for(let re=0;re<E;re++){const he=f+re+H*ne,ge=f+re+H*(ne+1),X=f+(re+1)+H*(ne+1),Z=f+(re+1)+H*ne;l.push(he,ge,Z),l.push(ge,X,Z),z+=6}o.addGroup(g,z,w),g+=z,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ms(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function nn(n){const e={};for(let t=0;t<n.length;t++){const i=ms(n[t]);for(const r in i)e[r]=i[r]}return e}function Lg(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Fp(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Ig={clone:ms,merge:nn};var Ug=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gt extends yi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ug,this.fragmentShader=Fg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ms(e.uniforms),this.uniformsGroups=Lg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Np extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=di}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ai=new D,jh=new Ee,Kh=new Ee;class Dn extends Np{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ra*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ws*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ra*2*Math.atan(Math.tan(Ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ai.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z),Ai.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ai.x,Ai.y).multiplyScalar(-e/Ai.z)}getViewSize(e,t){return this.getViewBounds(e,jh,Kh),t.subVectors(Kh,jh)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ws*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ir=-90,Ur=1;class Ng extends Mt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Dn(Ir,Ur,e,t);r.layers=this.layers,this.add(r);const s=new Dn(Ir,Ur,e,t);s.layers=this.layers,this.add(s);const a=new Dn(Ir,Ur,e,t);a.layers=this.layers,this.add(a);const o=new Dn(Ir,Ur,e,t);o.layers=this.layers,this.add(o);const l=new Dn(Ir,Ur,e,t);l.layers=this.layers,this.add(l);const c=new Dn(Ir,Ur,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===di)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ro)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(d,f,g),e.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Bp extends ln{constructor(e,t,i,r,s,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:us,super(e,t,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Bg extends mr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Bp(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:it}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new pa(5,5,5),s=new Gt({name:"CubemapFromEquirect",uniforms:ms(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:on,blending:Fi});s.uniforms.tEquirect.value=t;const a=new Vt(r,s),o=t.minFilter;return t.minFilter===cr&&(t.minFilter=it),new Ng(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}class ku{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Se(e),this.near=t,this.far=i}clone(){return new ku(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Og extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class zg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Jc,this.updateRanges=[],this.version=0,this.uuid=fi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=fi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const tn=new D;class Lo{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Hn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=st(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Hn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Hn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Hn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Hn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Dt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Lo(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Op extends yi{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Fr;const Ts=new D,Nr=new D,Br=new D,Or=new Ee,As=new Ee,zp=new ot,za=new D,Cs=new D,ka=new D,Zh=new Ee,Nl=new Ee,Qh=new Ee;class kg extends Mt{constructor(e=new Op){if(super(),this.isSprite=!0,this.type="Sprite",Fr===void 0){Fr=new Jt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new zg(t,5);Fr.setIndex([0,1,2,0,2,3]),Fr.setAttribute("position",new Lo(i,3,0,!1)),Fr.setAttribute("uv",new Lo(i,2,3,!1))}this.geometry=Fr,this.material=e,this.center=new Ee(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Nr.setFromMatrixScale(this.matrixWorld),zp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Br.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Nr.multiplyScalar(-Br.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;Va(za.set(-.5,-.5,0),Br,a,Nr,r,s),Va(Cs.set(.5,-.5,0),Br,a,Nr,r,s),Va(ka.set(.5,.5,0),Br,a,Nr,r,s),Zh.set(0,0),Nl.set(1,0),Qh.set(1,1);let o=e.ray.intersectTriangle(za,Cs,ka,!1,Ts);if(o===null&&(Va(Cs.set(-.5,.5,0),Br,a,Nr,r,s),Nl.set(0,1),o=e.ray.intersectTriangle(za,ka,Cs,!1,Ts),o===null))return;const l=e.ray.origin.distanceTo(Ts);l<e.near||l>e.far||t.push({distance:l,point:Ts.clone(),uv:In.getInterpolation(Ts,za,Cs,ka,Zh,Nl,Qh,new Ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Va(n,e,t,i,r,s){Or.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(As.x=s*Or.x-r*Or.y,As.y=r*Or.x+s*Or.y):As.copy(Or),n.copy(e),n.x+=As.x,n.y+=As.y,n.applyMatrix4(zp)}class Jn extends ln{constructor(e=null,t=1,i=1,r,s,a,o,l,c=Pt,h=Pt,d,f){super(null,a,o,l,c,h,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Io extends Dt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Bl=new D,Vg=new D,Gg=new Fe;class rr{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Bl.subVectors(i,t).cross(Vg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Bl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Gg.getNormalMatrix(e),r=this.coplanarPoint(Bl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const tr=new fa,Ga=new D;class Vu{constructor(e=new rr,t=new rr,i=new rr,r=new rr,s=new rr,a=new rr){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=di){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],d=r[6],f=r[7],g=r[8],p=r[9],y=r[10],m=r[11],u=r[12],v=r[13],_=r[14],x=r[15];if(i[0].setComponents(l-s,f-c,m-g,x-u).normalize(),i[1].setComponents(l+s,f+c,m+g,x+u).normalize(),i[2].setComponents(l+a,f+h,m+p,x+v).normalize(),i[3].setComponents(l-a,f-h,m-p,x-v).normalize(),i[4].setComponents(l-o,f-d,m-y,x-_).normalize(),t===di)i[5].setComponents(l+o,f+d,m+y,x+_).normalize();else if(t===Ro)i[5].setComponents(o,d,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),tr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),tr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(tr)}intersectsSprite(e){return tr.center.set(0,0,0),tr.radius=.7071067811865476,tr.applyMatrix4(e.matrixWorld),this.intersectsSphere(tr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ga.x=r.normal.x>0?e.max.x:e.min.x,Ga.y=r.normal.y>0?e.max.y:e.min.y,Ga.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ga)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Gu extends yi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Uo=new D,Fo=new D,Jh=new ot,Rs=new il,Ha=new fa,Ol=new D,ed=new D;class Hg extends Mt{constructor(e=new Jt,t=new Gu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Uo.fromBufferAttribute(t,r-1),Fo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Uo.distanceTo(Fo);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(r),Ha.radius+=s,e.ray.intersectsSphere(Ha)===!1)return;Jh.copy(r).invert(),Rs.copy(e.ray).applyMatrix4(Jh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const g=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let y=g,m=p-1;y<m;y+=c){const u=h.getX(y),v=h.getX(y+1),_=Wa(this,e,Rs,l,u,v);_&&t.push(_)}if(this.isLineLoop){const y=h.getX(p-1),m=h.getX(g),u=Wa(this,e,Rs,l,y,m);u&&t.push(u)}}else{const g=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let y=g,m=p-1;y<m;y+=c){const u=Wa(this,e,Rs,l,y,y+1);u&&t.push(u)}if(this.isLineLoop){const y=Wa(this,e,Rs,l,p-1,g);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Wa(n,e,t,i,r,s){const a=n.geometry.attributes.position;if(Uo.fromBufferAttribute(a,r),Fo.fromBufferAttribute(a,s),t.distanceSqToSegment(Uo,Fo,Ol,ed)>i)return;Ol.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Ol);if(!(l<e.near||l>e.far))return{distance:l,point:ed.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const td=new D,nd=new D;class kp extends Hg{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)td.fromBufferAttribute(t,r),nd.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+td.distanceTo(nd);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Vp extends yi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const id=new ot,eu=new il,qa=new fa,Xa=new D;class Wg extends Mt{constructor(e=new Jt,t=new Vp){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qa.copy(i.boundingSphere),qa.applyMatrix4(r),qa.radius+=s,e.ray.intersectsSphere(qa)===!1)return;id.copy(r).invert(),eu.copy(e.ray).applyMatrix4(id);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),g=Math.min(c.count,a.start+a.count);for(let p=f,y=g;p<y;p++){const m=c.getX(p);Xa.fromBufferAttribute(d,m),rd(Xa,m,l,r,e,t,this)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let p=f,y=g;p<y;p++)Xa.fromBufferAttribute(d,p),rd(Xa,p,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function rd(n,e,t,i,r,s,a){const o=eu.distanceSqToPoint(n);if(o<t){const l=new D;eu.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Xr extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Gp extends ln{constructor(e,t,i,r,s,a,o,l,c,h=es){if(h!==es&&h!==fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===es&&(i=pr),i===void 0&&h===fs&&(i=ds),super(null,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Pt,this.minFilter=l!==void 0?l:Pt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Hu extends Jt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],a=[];o(r),c(i),h(),this.setAttribute("position",new cn(s,3)),this.setAttribute("normal",new cn(s.slice(),3)),this.setAttribute("uv",new cn(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const _=new D,x=new D,M=new D;for(let S=0;S<t.length;S+=3)g(t[S+0],_),g(t[S+1],x),g(t[S+2],M),l(_,x,M,v)}function l(v,_,x,M){const S=M+1,E=[];for(let C=0;C<=S;C++){E[C]=[];const w=v.clone().lerp(x,C/S),b=_.clone().lerp(x,C/S),R=S-C;for(let I=0;I<=R;I++)I===0&&C===S?E[C][I]=w:E[C][I]=w.clone().lerp(b,I/R)}for(let C=0;C<S;C++)for(let w=0;w<2*(S-C)-1;w++){const b=Math.floor(w/2);w%2===0?(f(E[C][b+1]),f(E[C+1][b]),f(E[C][b])):(f(E[C][b+1]),f(E[C+1][b+1]),f(E[C+1][b]))}}function c(v){const _=new D;for(let x=0;x<s.length;x+=3)_.x=s[x+0],_.y=s[x+1],_.z=s[x+2],_.normalize().multiplyScalar(v),s[x+0]=_.x,s[x+1]=_.y,s[x+2]=_.z}function h(){const v=new D;for(let _=0;_<s.length;_+=3){v.x=s[_+0],v.y=s[_+1],v.z=s[_+2];const x=m(v)/2/Math.PI+.5,M=u(v)/Math.PI+.5;a.push(x,1-M)}p(),d()}function d(){for(let v=0;v<a.length;v+=6){const _=a[v+0],x=a[v+2],M=a[v+4],S=Math.max(_,x,M),E=Math.min(_,x,M);S>.9&&E<.1&&(_<.2&&(a[v+0]+=1),x<.2&&(a[v+2]+=1),M<.2&&(a[v+4]+=1))}}function f(v){s.push(v.x,v.y,v.z)}function g(v,_){const x=v*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function p(){const v=new D,_=new D,x=new D,M=new D,S=new Ee,E=new Ee,C=new Ee;for(let w=0,b=0;w<s.length;w+=9,b+=6){v.set(s[w+0],s[w+1],s[w+2]),_.set(s[w+3],s[w+4],s[w+5]),x.set(s[w+6],s[w+7],s[w+8]),S.set(a[b+0],a[b+1]),E.set(a[b+2],a[b+3]),C.set(a[b+4],a[b+5]),M.copy(v).add(_).add(x).divideScalar(3);const R=m(M);y(S,b+0,v,R),y(E,b+2,_,R),y(C,b+4,x,R)}}function y(v,_,x,M){M<0&&v.x===1&&(a[_]=v.x-1),x.x===0&&x.z===0&&(a[_]=M/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function u(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hu(e.vertices,e.indices,e.radius,e.details)}}class Yi extends Hu{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Yi(e.radius,e.detail)}}class xs extends Jt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,d=e/o,f=t/l,g=[],p=[],y=[],m=[];for(let u=0;u<h;u++){const v=u*f-a;for(let _=0;_<c;_++){const x=_*d-s;p.push(x,-v,0),y.push(0,0,1),m.push(_/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let v=0;v<o;v++){const _=v+c*u,x=v+c*(u+1),M=v+1+c*(u+1),S=v+1+c*u;g.push(_,x,S),g.push(x,M,S)}this.setIndex(g),this.setAttribute("position",new cn(p,3)),this.setAttribute("normal",new cn(y,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xs(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wu extends Jt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new D,f=new D,g=[],p=[],y=[],m=[];for(let u=0;u<=i;u++){const v=[],_=u/i;let x=0;u===0&&a===0?x=.5/t:u===i&&l===Math.PI&&(x=-.5/t);for(let M=0;M<=t;M++){const S=M/t;d.x=-e*Math.cos(r+S*s)*Math.sin(a+_*o),d.y=e*Math.cos(a+_*o),d.z=e*Math.sin(r+S*s)*Math.sin(a+_*o),p.push(d.x,d.y,d.z),f.copy(d).normalize(),y.push(f.x,f.y,f.z),m.push(S+x,1-_),v.push(c++)}h.push(v)}for(let u=0;u<i;u++)for(let v=0;v<t;v++){const _=h[u][v+1],x=h[u][v],M=h[u+1][v],S=h[u+1][v+1];(u!==0||a>0)&&g.push(_,x,S),(u!==i-1||l<Math.PI)&&g.push(x,M,S)}this.setIndex(g),this.setAttribute("position",new cn(p,3)),this.setAttribute("normal",new cn(y,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wu(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class qg extends yi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bu,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xg extends yi{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Se(16777215),this.specular=new Se(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bu,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=Pu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $g extends yi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=k0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Yg extends yi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Hp extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class jg extends Hp{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Se(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const zl=new ot,sd=new D,ad=new D;class Kg{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vu,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;sd.setFromMatrixPosition(e.matrixWorld),t.position.copy(sd),ad.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ad),t.updateMatrixWorld(),zl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Wp extends Np{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Zg extends Kg{constructor(){super(new Wp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qg extends Hp{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new Zg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class qp extends Jt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class Jg extends Dn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ev{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=od(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=od();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function od(){return performance.now()}const ld=new ot;class tu{constructor(e,t,i=0,r=1/0){this.ray=new il(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new zu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return ld.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ld),this}intersectObject(e,t=!0,i=[]){return nu(e,this,i,t),i.sort(cd),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)nu(e[r],this,i,t);return i.sort(cd),i}}function cd(n,e){return n.distance-e.distance}function nu(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let a=0,o=s.length;a<o;a++)nu(s[a],e,t,!0)}}class tv extends yr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function ud(n,e,t,i){const r=nv(i);switch(t){case _p:return n*e;case wp:return n*e;case Sp:return n*e*2;case Mp:return n*e/r.components*r.byteLength;case Uu:return n*e/r.components*r.byteLength;case Ep:return n*e*2/r.components*r.byteLength;case Fu:return n*e*2/r.components*r.byteLength;case bp:return n*e*3/r.components*r.byteLength;case St:return n*e*4/r.components*r.byteLength;case Nu:return n*e*4/r.components*r.byteLength;case co:case uo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ho:case fo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Cc:case Pc:return Math.max(n,16)*Math.max(e,8)/4;case Ac:case Rc:return Math.max(n,8)*Math.max(e,8)/2;case Dc:case Lc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ic:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Uc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Nc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Bc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Oc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case zc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case kc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Vc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Gc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Hc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Wc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case qc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Xc:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case $c:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case po:case Yc:case jc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Tp:case Kc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Zc:case Qc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function nv(n){switch(n){case Lt:case vp:return{byteLength:1,components:1};case ia:case xp:case ha:return{byteLength:2,components:1};case Lu:case Iu:return{byteLength:2,components:4};case pr:case Du:case hi:return{byteLength:4,components:1};case yp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ru}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ru);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Xp(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function iv(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let g;if(c instanceof Float32Array)g=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=n.HALF_FLOAT:g=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=n.SHORT;else if(c instanceof Uint32Array)g=n.UNSIGNED_INT;else if(c instanceof Int32Array)g=n.INT;else if(c instanceof Int8Array)g=n.BYTE;else if(c instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const h=l.array,d=l.updateRanges;if(n.bindBuffer(c,o),d.length===0)n.bufferSubData(c,0,h);else{d.sort((g,p)=>g.start-p.start);let f=0;for(let g=1;g<d.length;g++){const p=d[f],y=d[g];y.start<=p.start+p.count+1?p.count=Math.max(p.count,y.start+y.count-p.start):(++f,d[f]=y)}d.length=f+1;for(let g=0,p=d.length;g<p;g++){const y=d[g];n.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var rv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sv=`#ifdef USE_ALPHAHASH
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
#endif`,av=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ov=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,uv=`#ifdef USE_AOMAP
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
#endif`,hv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dv=`#ifdef USE_BATCHING
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
#endif`,fv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,pv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gv=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vv=`#ifdef USE_IRIDESCENCE
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
#endif`,xv=`#ifdef USE_BUMPMAP
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
#endif`,yv=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_v=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sv=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mv=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ev=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tv=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Av=`#define PI 3.141592653589793
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
} // validated`,Cv=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Rv=`vec3 transformedNormal = objectNormal;
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
#endif`,Pv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Iv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Uv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Nv=`#ifdef USE_ENVMAP
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
#endif`,Bv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ov=`#ifdef USE_ENVMAP
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
#endif`,zv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kv=`#ifdef USE_ENVMAP
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
#endif`,Vv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qv=`#ifdef USE_GRADIENTMAP
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
}`,Xv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$v=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jv=`uniform bool receiveShadow;
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
#endif`,Kv=`#ifdef USE_ENVMAP
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
#endif`,Zv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Jv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ex=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tx=`PhysicalMaterial material;
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
#endif`,nx=`struct PhysicalMaterial {
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
}`,ix=`
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
#endif`,rx=`#if defined( RE_IndirectDiffuse )
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
#endif`,sx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ax=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ox=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ux=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fx=`#if defined( USE_POINTS_UV )
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
#endif`,px=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yx=`#ifdef USE_MORPHTARGETS
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
#endif`,_x=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ex=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tx=`#ifdef USE_NORMALMAP
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
#endif`,Ax=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Rx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Px=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ix=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ux=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Nx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ox=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gx=`float getShadowMask() {
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
}`,Hx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wx=`#ifdef USE_SKINNING
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
#endif`,qx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xx=`#ifdef USE_SKINNING
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
#endif`,$x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zx=`#ifdef USE_TRANSMISSION
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
#endif`,Qx=`#ifdef USE_TRANSMISSION
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
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ey=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ty=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ny=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const iy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ry=`uniform sampler2D t2D;
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
}`,sy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ay=`#ifdef ENVMAP_TYPE_CUBE
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
}`,oy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ly=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cy=`#include <common>
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
}`,uy=`#if DEPTH_PACKING == 3200
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
}`,hy=`#define DISTANCE
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
}`,dy=`#define DISTANCE
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
}`,fy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,py=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,my=`uniform float scale;
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
}`,gy=`uniform vec3 diffuse;
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
}`,vy=`#include <common>
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
}`,xy=`uniform vec3 diffuse;
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
}`,yy=`#define LAMBERT
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
}`,_y=`#define LAMBERT
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
}`,by=`#define MATCAP
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
}`,wy=`#define MATCAP
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
}`,Sy=`#define NORMAL
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
}`,My=`#define NORMAL
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
}`,Ey=`#define PHONG
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
}`,Ty=`#define PHONG
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
}`,Ay=`#define STANDARD
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
}`,Cy=`#define STANDARD
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
}`,Ry=`#define TOON
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
}`,Py=`#define TOON
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
}`,Dy=`uniform float size;
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
}`,Ly=`uniform vec3 diffuse;
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
}`,Iy=`#include <common>
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
}`,Uy=`uniform vec3 color;
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
}`,Fy=`uniform float rotation;
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
}`,Ny=`uniform vec3 diffuse;
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
}`,Ve={alphahash_fragment:rv,alphahash_pars_fragment:sv,alphamap_fragment:av,alphamap_pars_fragment:ov,alphatest_fragment:lv,alphatest_pars_fragment:cv,aomap_fragment:uv,aomap_pars_fragment:hv,batching_pars_vertex:dv,batching_vertex:fv,begin_vertex:pv,beginnormal_vertex:mv,bsdfs:gv,iridescence_fragment:vv,bumpmap_pars_fragment:xv,clipping_planes_fragment:yv,clipping_planes_pars_fragment:_v,clipping_planes_pars_vertex:bv,clipping_planes_vertex:wv,color_fragment:Sv,color_pars_fragment:Mv,color_pars_vertex:Ev,color_vertex:Tv,common:Av,cube_uv_reflection_fragment:Cv,defaultnormal_vertex:Rv,displacementmap_pars_vertex:Pv,displacementmap_vertex:Dv,emissivemap_fragment:Lv,emissivemap_pars_fragment:Iv,colorspace_fragment:Uv,colorspace_pars_fragment:Fv,envmap_fragment:Nv,envmap_common_pars_fragment:Bv,envmap_pars_fragment:Ov,envmap_pars_vertex:zv,envmap_physical_pars_fragment:Kv,envmap_vertex:kv,fog_vertex:Vv,fog_pars_vertex:Gv,fog_fragment:Hv,fog_pars_fragment:Wv,gradientmap_pars_fragment:qv,lightmap_pars_fragment:Xv,lights_lambert_fragment:$v,lights_lambert_pars_fragment:Yv,lights_pars_begin:jv,lights_toon_fragment:Zv,lights_toon_pars_fragment:Qv,lights_phong_fragment:Jv,lights_phong_pars_fragment:ex,lights_physical_fragment:tx,lights_physical_pars_fragment:nx,lights_fragment_begin:ix,lights_fragment_maps:rx,lights_fragment_end:sx,logdepthbuf_fragment:ax,logdepthbuf_pars_fragment:ox,logdepthbuf_pars_vertex:lx,logdepthbuf_vertex:cx,map_fragment:ux,map_pars_fragment:hx,map_particle_fragment:dx,map_particle_pars_fragment:fx,metalnessmap_fragment:px,metalnessmap_pars_fragment:mx,morphinstance_vertex:gx,morphcolor_vertex:vx,morphnormal_vertex:xx,morphtarget_pars_vertex:yx,morphtarget_vertex:_x,normal_fragment_begin:bx,normal_fragment_maps:wx,normal_pars_fragment:Sx,normal_pars_vertex:Mx,normal_vertex:Ex,normalmap_pars_fragment:Tx,clearcoat_normal_fragment_begin:Ax,clearcoat_normal_fragment_maps:Cx,clearcoat_pars_fragment:Rx,iridescence_pars_fragment:Px,opaque_fragment:Dx,packing:Lx,premultiplied_alpha_fragment:Ix,project_vertex:Ux,dithering_fragment:Fx,dithering_pars_fragment:Nx,roughnessmap_fragment:Bx,roughnessmap_pars_fragment:Ox,shadowmap_pars_fragment:zx,shadowmap_pars_vertex:kx,shadowmap_vertex:Vx,shadowmask_pars_fragment:Gx,skinbase_vertex:Hx,skinning_pars_vertex:Wx,skinning_vertex:qx,skinnormal_vertex:Xx,specularmap_fragment:$x,specularmap_pars_fragment:Yx,tonemapping_fragment:jx,tonemapping_pars_fragment:Kx,transmission_fragment:Zx,transmission_pars_fragment:Qx,uv_pars_fragment:Jx,uv_pars_vertex:ey,uv_vertex:ty,worldpos_vertex:ny,background_vert:iy,background_frag:ry,backgroundCube_vert:sy,backgroundCube_frag:ay,cube_vert:oy,cube_frag:ly,depth_vert:cy,depth_frag:uy,distanceRGBA_vert:hy,distanceRGBA_frag:dy,equirect_vert:fy,equirect_frag:py,linedashed_vert:my,linedashed_frag:gy,meshbasic_vert:vy,meshbasic_frag:xy,meshlambert_vert:yy,meshlambert_frag:_y,meshmatcap_vert:by,meshmatcap_frag:wy,meshnormal_vert:Sy,meshnormal_frag:My,meshphong_vert:Ey,meshphong_frag:Ty,meshphysical_vert:Ay,meshphysical_frag:Cy,meshtoon_vert:Ry,meshtoon_frag:Py,points_vert:Dy,points_frag:Ly,shadow_vert:Iy,shadow_frag:Uy,sprite_vert:Fy,sprite_frag:Ny},le={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},$n={basic:{uniforms:nn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:nn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:nn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:nn([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:nn([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Se(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:nn([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:nn([le.points,le.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:nn([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:nn([le.common,le.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:nn([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:nn([le.sprite,le.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:nn([le.common,le.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:nn([le.lights,le.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};$n.physical={uniforms:nn([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const $a={r:0,b:0,g:0},nr=new Xn,By=new ot;function Oy(n,e,t,i,r,s,a){const o=new Se(0);let l=s===!0?0:1,c,h,d=null,f=0,g=null;function p(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?t:e).get(x)),x}function y(_){let x=!1;const M=p(_);M===null?u(o,l):M&&M.isColor&&(u(M,1),x=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(_,x){const M=p(x);M&&(M.isCubeTexture||M.mapping===nl)?(h===void 0&&(h=new Vt(new pa(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:ms($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),nr.copy(x.backgroundRotation),nr.x*=-1,nr.y*=-1,nr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(nr.y*=-1,nr.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(By.makeRotationFromEuler(nr)),h.material.toneMapped=Je.getTransfer(M.colorSpace)!==at,(d!==M||f!==M.version||g!==n.toneMapping)&&(h.material.needsUpdate=!0,d=M,f=M.version,g=n.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Vt(new xs(2,2),new Gt({name:"BackgroundMaterial",uniforms:ms($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Je.getTransfer(M.colorSpace)!==at,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||f!==M.version||g!==n.toneMapping)&&(c.material.needsUpdate=!0,d=M,f=M.version,g=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function u(_,x){_.getRGB($a,Fp(n)),i.buffers.color.setClear($a.r,$a.g,$a.b,x,a)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(_,x=1){o.set(_),l=x,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,u(o,l)},render:y,addToRenderList:m,dispose:v}}function zy(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(b,R,I,N,O){let H=!1;const k=d(N,I,R);s!==k&&(s=k,c(s.object)),H=g(b,N,I,O),H&&p(b,N,I,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,x(b,R,I,N),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function d(b,R,I){const N=I.wireframe===!0;let O=i[b.id];O===void 0&&(O={},i[b.id]=O);let H=O[R.id];H===void 0&&(H={},O[R.id]=H);let k=H[N];return k===void 0&&(k=f(l()),H[N]=k),k}function f(b){const R=[],I=[],N=[];for(let O=0;O<t;O++)R[O]=0,I[O]=0,N[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:N,object:b,attributes:{},index:null}}function g(b,R,I,N){const O=s.attributes,H=R.attributes;let k=0;const q=I.getAttributes();for(const z in q)if(q[z].location>=0){const ne=O[z];let re=H[z];if(re===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(re=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(re=b.instanceColor)),ne===void 0||ne.attribute!==re||re&&ne.data!==re.data)return!0;k++}return s.attributesNum!==k||s.index!==N}function p(b,R,I,N){const O={},H=R.attributes;let k=0;const q=I.getAttributes();for(const z in q)if(q[z].location>=0){let ne=H[z];ne===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(ne=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(ne=b.instanceColor));const re={};re.attribute=ne,ne&&ne.data&&(re.data=ne.data),O[z]=re,k++}s.attributes=O,s.attributesNum=k,s.index=N}function y(){const b=s.newAttributes;for(let R=0,I=b.length;R<I;R++)b[R]=0}function m(b){u(b,0)}function u(b,R){const I=s.newAttributes,N=s.enabledAttributes,O=s.attributeDivisors;I[b]=1,N[b]===0&&(n.enableVertexAttribArray(b),N[b]=1),O[b]!==R&&(n.vertexAttribDivisor(b,R),O[b]=R)}function v(){const b=s.newAttributes,R=s.enabledAttributes;for(let I=0,N=R.length;I<N;I++)R[I]!==b[I]&&(n.disableVertexAttribArray(I),R[I]=0)}function _(b,R,I,N,O,H,k){k===!0?n.vertexAttribIPointer(b,R,I,O,H):n.vertexAttribPointer(b,R,I,N,O,H)}function x(b,R,I,N){y();const O=N.attributes,H=I.getAttributes(),k=R.defaultAttributeValues;for(const q in H){const z=H[q];if(z.location>=0){let $=O[q];if($===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&($=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&($=b.instanceColor)),$!==void 0){const ne=$.normalized,re=$.itemSize,he=e.get($);if(he===void 0)continue;const ge=he.buffer,X=he.type,Z=he.bytesPerElement,se=X===n.INT||X===n.UNSIGNED_INT||$.gpuType===Du;if($.isInterleavedBufferAttribute){const ee=$.data,de=ee.stride,xe=$.offset;if(ee.isInstancedInterleavedBuffer){for(let Ue=0;Ue<z.locationSize;Ue++)u(z.location+Ue,ee.meshPerAttribute);b.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ue=0;Ue<z.locationSize;Ue++)m(z.location+Ue);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let Ue=0;Ue<z.locationSize;Ue++)_(z.location+Ue,re/z.locationSize,X,ne,de*Z,(xe+re/z.locationSize*Ue)*Z,se)}else{if($.isInstancedBufferAttribute){for(let ee=0;ee<z.locationSize;ee++)u(z.location+ee,$.meshPerAttribute);b.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ee=0;ee<z.locationSize;ee++)m(z.location+ee);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let ee=0;ee<z.locationSize;ee++)_(z.location+ee,re/z.locationSize,X,ne,re*Z,re/z.locationSize*ee*Z,se)}}else if(k!==void 0){const ne=k[q];if(ne!==void 0)switch(ne.length){case 2:n.vertexAttrib2fv(z.location,ne);break;case 3:n.vertexAttrib3fv(z.location,ne);break;case 4:n.vertexAttrib4fv(z.location,ne);break;default:n.vertexAttrib1fv(z.location,ne)}}}}v()}function M(){C();for(const b in i){const R=i[b];for(const I in R){const N=R[I];for(const O in N)h(N[O].object),delete N[O];delete R[I]}delete i[b]}}function S(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const I in R){const N=R[I];for(const O in N)h(N[O].object),delete N[O];delete R[I]}delete i[b.id]}function E(b){for(const R in i){const I=i[R];if(I[b.id]===void 0)continue;const N=I[b.id];for(const O in N)h(N[O].object),delete N[O];delete I[b.id]}}function C(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:y,enableAttribute:m,disableUnusedAttributes:v}}function ky(n,e,t){let i;function r(c){i=c}function s(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,d){d!==0&&(n.drawArraysInstanced(i,c,h,d),t.update(h,i,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let g=0;for(let p=0;p<d;p++)g+=h[p];t.update(g,i,1)}function l(c,h,d,f){if(d===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<c.length;p++)a(c[p],h[p],f[p]);else{g.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,d);let p=0;for(let y=0;y<d;y++)p+=h[y]*f[y];t.update(p,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Vy(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(E){return!(E!==St&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const C=E===ha&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Lt&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==hi&&!C)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),g=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=p>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:g,maxVertexTextures:p,maxTextureSize:y,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:M,maxSamples:S}}function Gy(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new rr,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const g=d.length!==0||f||i!==0||r;return r=f,i=d.length,g},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,g){const p=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,u=n.get(d);if(!r||p===null||p.length===0||s&&!m)s?h(null):c();else{const v=s?0:i,_=v*4;let x=u.clippingState||null;l.value=x,x=h(p,f,_,g);for(let M=0;M!==_;++M)x[M]=t[M];u.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,f,g,p){const y=d!==null?d.length:0;let m=null;if(y!==0){if(m=l.value,p!==!0||m===null){const u=g+y*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<u)&&(m=new Float32Array(u));for(let _=0,x=g;_!==y;++_,x+=4)a.copy(d[_]).applyMatrix4(v,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function Hy(n){let e=new WeakMap;function t(a,o){return o===Mc?a.mapping=us:o===Ec&&(a.mapping=hs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Mc||o===Ec)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Bg(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const $r=4,hd=[.125,.215,.35,.446,.526,.582],lr=20,kl=new Wp,dd=new Se;let Vl=null,Gl=0,Hl=0,Wl=!1;const sr=(1+Math.sqrt(5))/2,zr=1/sr,fd=[new D(-sr,zr,0),new D(sr,zr,0),new D(-zr,0,sr),new D(zr,0,sr),new D(0,sr,-zr),new D(0,sr,zr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class pd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Vl=this._renderer.getRenderTarget(),Gl=this._renderer.getActiveCubeFace(),Hl=this._renderer.getActiveMipmapLevel(),Wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vl,Gl,Hl),this._renderer.xr.enabled=Wl,e.scissorTest=!1,Ya(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===us||e.mapping===hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vl=this._renderer.getRenderTarget(),Gl=this._renderer.getActiveCubeFace(),Hl=this._renderer.getActiveMipmapLevel(),Wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:it,minFilter:it,generateMipmaps:!1,type:ha,format:St,colorSpace:ps,depthBuffer:!1},r=md(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=md(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Wy(s)),this._blurMaterial=qy(s,e,t)}return r}_compileMaterial(e){const t=new Vt(this._lodPlanes[0],e);this._renderer.compile(t,kl)}_sceneToCubeUV(e,t,i,r){const o=new Dn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(dd),h.toneMapping=Ni,h.autoClear=!1;const g=new Lp({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),p=new Vt(new pa,g);let y=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,y=!0):(g.color.copy(dd),y=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):v===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const _=this._cubeSize;Ya(r,v*_,u>2?_:0,_,_),h.setRenderTarget(r),y&&h.render(p,o),h.render(e,o)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===us||e.mapping===hs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=vd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gd());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Vt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Ya(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,kl)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=fd[(r-s-1)%fd.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Vt(this._lodPlanes[r],c),f=c.uniforms,g=this._sizeLods[i]-1,p=isFinite(s)?Math.PI/(2*g):2*Math.PI/(2*lr-1),y=s/p,m=isFinite(s)?1+Math.floor(h*y):lr;m>lr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${lr}`);const u=[];let v=0;for(let E=0;E<lr;++E){const C=E/y,w=Math.exp(-C*C/2);u.push(w),E===0?v+=w:E<m&&(v+=2*w)}for(let E=0;E<u.length;E++)u[E]=u[E]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:_}=this;f.dTheta.value=p,f.mipInt.value=_-i;const x=this._sizeLods[r],M=3*x*(r>_-$r?r-_+$r:0),S=4*(this._cubeSize-x);Ya(t,M,S,3*x,2*x),l.setRenderTarget(t),l.render(d,kl)}}function Wy(n){const e=[],t=[],i=[];let r=n;const s=n-$r+1+hd.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-$r?l=hd[a-n+$r-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,p=6,y=3,m=2,u=1,v=new Float32Array(y*p*g),_=new Float32Array(m*p*g),x=new Float32Array(u*p*g);for(let S=0;S<g;S++){const E=S%3*2/3-1,C=S>2?0:-1,w=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];v.set(w,y*p*S),_.set(f,m*p*S);const b=[S,S,S,S,S,S];x.set(b,u*p*S)}const M=new Jt;M.setAttribute("position",new Dt(v,y)),M.setAttribute("uv",new Dt(_,m)),M.setAttribute("faceIndex",new Dt(x,u)),e.push(M),r>$r&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function md(n,e,t){const i=new mr(n,e,t);return i.texture.mapping=nl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ya(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function qy(n,e,t){const i=new Float32Array(lr),r=new D(0,1,0);return new Gt({name:"SphericalGaussianBlur",defines:{n:lr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:qu(),fragmentShader:`

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
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function gd(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qu(),fragmentShader:`

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
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function vd(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function qu(){return`

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
	`}function Xy(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Mc||l===Ec,h=l===us||l===hs;if(c||h){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new pd(n)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const g=o.image;return c&&g&&g.height>0||h&&g&&r(g)?(t===null&&(t=new pd(n)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function $y(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Wr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Yy(n,e,t,i){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",a),delete r[f.id];const g=s.get(f);g&&(e.remove(g),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER)}function c(d){const f=[],g=d.index,p=d.attributes.position;let y=0;if(g!==null){const v=g.array;y=g.version;for(let _=0,x=v.length;_<x;_+=3){const M=v[_+0],S=v[_+1],E=v[_+2];f.push(M,S,S,E,E,M)}}else if(p!==void 0){const v=p.array;y=p.version;for(let _=0,x=v.length/3-1;_<x;_+=3){const M=_+0,S=_+1,E=_+2;f.push(M,S,S,E,E,M)}}else return;const m=new(Cp(f)?Up:Ip)(f,1);m.version=y;const u=s.get(d);u&&e.remove(u),s.set(d,m)}function h(d){const f=s.get(d);if(f){const g=d.index;g!==null&&f.version<g.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function jy(n,e,t){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,g){n.drawElements(i,g,s,f*a),t.update(g,i,1)}function c(f,g,p){p!==0&&(n.drawElementsInstanced(i,g,s,f*a,p),t.update(g,i,p))}function h(f,g,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,s,f,0,p);let m=0;for(let u=0;u<p;u++)m+=g[u];t.update(m,i,1)}function d(f,g,p,y){if(p===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/a,g[u],y[u]);else{m.multiDrawElementsInstancedWEBGL(i,g,0,s,f,0,y,0,p);let u=0;for(let v=0;v<p;v++)u+=g[v]*y[v];t.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Ky(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Zy(n,e,t){const i=new WeakMap,r=new xt;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let w=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let _=0;g===!0&&(_=1),p===!0&&(_=2),y===!0&&(_=3);let x=o.attributes.position.count*_,M=1;x>e.maxTextureSize&&(M=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const S=new Float32Array(x*M*4*d),E=new Pp(S,x,M,d);E.type=hi,E.needsUpdate=!0;const C=_*4;for(let b=0;b<d;b++){const R=m[b],I=u[b],N=v[b],O=x*M*4*b;for(let H=0;H<R.count;H++){const k=H*C;g===!0&&(r.fromBufferAttribute(R,H),S[O+k+0]=r.x,S[O+k+1]=r.y,S[O+k+2]=r.z,S[O+k+3]=0),p===!0&&(r.fromBufferAttribute(I,H),S[O+k+4]=r.x,S[O+k+5]=r.y,S[O+k+6]=r.z,S[O+k+7]=0),y===!0&&(r.fromBufferAttribute(N,H),S[O+k+8]=r.x,S[O+k+9]=r.y,S[O+k+10]=r.z,S[O+k+11]=N.itemSize===4?r.w:1)}}f={count:d,texture:E,size:new Ee(x,M)},i.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let g=0;for(let y=0;y<c.length;y++)g+=c[y];const p=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",p),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function Qy(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,d=e.get(l,h);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return d}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const $p=new ln,xd=new Gp(1,1),Yp=new Pp,jp=new bg,Kp=new Bp,yd=[],_d=[],bd=new Float32Array(16),wd=new Float32Array(9),Sd=new Float32Array(4);function ys(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=yd[r];if(s===void 0&&(s=new Float32Array(r),yd[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function It(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function rl(n,e){let t=_d[e];t===void 0&&(t=new Int32Array(e),_d[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Jy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function e_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function t_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(It(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function n_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function i_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,i))return;Sd.set(i),n.uniformMatrix2fv(this.addr,!1,Sd),Ut(t,i)}}function r_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,i))return;wd.set(i),n.uniformMatrix3fv(this.addr,!1,wd),Ut(t,i)}}function s_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(It(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(It(t,i))return;bd.set(i),n.uniformMatrix4fv(this.addr,!1,bd),Ut(t,i)}}function a_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function o_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function l_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function c_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function u_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function h_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(It(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function d_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(It(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function f_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(It(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function p_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(xd.compareFunction=Ap,s=xd):s=$p,t.setTexture2D(e||s,r)}function m_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||jp,r)}function g_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Kp,r)}function v_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Yp,r)}function x_(n){switch(n){case 5126:return Jy;case 35664:return e_;case 35665:return t_;case 35666:return n_;case 35674:return i_;case 35675:return r_;case 35676:return s_;case 5124:case 35670:return a_;case 35667:case 35671:return o_;case 35668:case 35672:return l_;case 35669:case 35673:return c_;case 5125:return u_;case 36294:return h_;case 36295:return d_;case 36296:return f_;case 35678:case 36198:case 36298:case 36306:case 35682:return p_;case 35679:case 36299:case 36307:return m_;case 35680:case 36300:case 36308:case 36293:return g_;case 36289:case 36303:case 36311:case 36292:return v_}}function y_(n,e){n.uniform1fv(this.addr,e)}function __(n,e){const t=ys(e,this.size,2);n.uniform2fv(this.addr,t)}function b_(n,e){const t=ys(e,this.size,3);n.uniform3fv(this.addr,t)}function w_(n,e){const t=ys(e,this.size,4);n.uniform4fv(this.addr,t)}function S_(n,e){const t=ys(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function M_(n,e){const t=ys(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function E_(n,e){const t=ys(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function T_(n,e){n.uniform1iv(this.addr,e)}function A_(n,e){n.uniform2iv(this.addr,e)}function C_(n,e){n.uniform3iv(this.addr,e)}function R_(n,e){n.uniform4iv(this.addr,e)}function P_(n,e){n.uniform1uiv(this.addr,e)}function D_(n,e){n.uniform2uiv(this.addr,e)}function L_(n,e){n.uniform3uiv(this.addr,e)}function I_(n,e){n.uniform4uiv(this.addr,e)}function U_(n,e,t){const i=this.cache,r=e.length,s=rl(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||$p,s[a])}function F_(n,e,t){const i=this.cache,r=e.length,s=rl(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||jp,s[a])}function N_(n,e,t){const i=this.cache,r=e.length,s=rl(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Kp,s[a])}function B_(n,e,t){const i=this.cache,r=e.length,s=rl(t,r);It(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Yp,s[a])}function O_(n){switch(n){case 5126:return y_;case 35664:return __;case 35665:return b_;case 35666:return w_;case 35674:return S_;case 35675:return M_;case 35676:return E_;case 5124:case 35670:return T_;case 35667:case 35671:return A_;case 35668:case 35672:return C_;case 35669:case 35673:return R_;case 5125:return P_;case 36294:return D_;case 36295:return L_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return U_;case 35679:case 36299:case 36307:return F_;case 35680:case 36300:case 36308:case 36293:return N_;case 36289:case 36303:case 36311:case 36292:return B_}}class z_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=x_(t.type)}}class k_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=O_(t.type)}}class V_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const ql=/(\w+)(\])?(\[|\.)?/g;function Md(n,e){n.seq.push(e),n.map[e.id]=e}function G_(n,e,t){const i=n.name,r=i.length;for(ql.lastIndex=0;;){const s=ql.exec(i),a=ql.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Md(t,c===void 0?new z_(o,n,e):new k_(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new V_(o),Md(t,d)),t=d}}}class mo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);G_(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Ed(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const H_=37297;let W_=0;function q_(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Td=new Fe;function X_(n){Je._getMatrix(Td,Je.workingColorSpace,n);const e=`mat3( ${Td.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case Co:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ad(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+q_(n.getShaderSource(e),a)}else return r}function $_(n,e){const t=X_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Y_(n,e){let t;switch(e){case L0:t="Linear";break;case I0:t="Reinhard";break;case U0:t="Cineon";break;case F0:t="ACESFilmic";break;case B0:t="AgX";break;case O0:t="Neutral";break;case N0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ja=new D;function j_(){Je.getLuminanceCoefficients(ja);const n=ja.x.toFixed(4),e=ja.y.toFixed(4),t=ja.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function K_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ks).join(`
`)}function Z_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Q_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function ks(n){return n!==""}function Cd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Rd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const J_=/^[ \t]*#include +<([\w\d./]+)>/gm;function iu(n){return n.replace(J_,tb)}const eb=new Map;function tb(n,e){let t=Ve[e];if(t===void 0){const i=eb.get(e);if(i!==void 0)t=Ve[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return iu(t)}const nb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pd(n){return n.replace(nb,ib)}function ib(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Dd(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function rb(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===pp?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===mp?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===oi&&(e="SHADOWMAP_TYPE_VSM"),e}function sb(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case us:case hs:e="ENVMAP_TYPE_CUBE";break;case nl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ab(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case hs:e="ENVMAP_MODE_REFRACTION";break}return e}function ob(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Pu:e="ENVMAP_BLENDING_MULTIPLY";break;case P0:e="ENVMAP_BLENDING_MIX";break;case D0:e="ENVMAP_BLENDING_ADD";break}return e}function lb(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function cb(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=rb(t),c=sb(t),h=ab(t),d=ob(t),f=lb(t),g=K_(t),p=Z_(s),y=r.createProgram();let m,u,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ks).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(ks).join(`
`),u.length>0&&(u+=`
`)):(m=[Dd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ks).join(`
`),u=[Dd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ni?"#define TONE_MAPPING":"",t.toneMapping!==Ni?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Ni?Y_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,$_("linearToOutputTexel",t.outputColorSpace),j_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ks).join(`
`)),a=iu(a),a=Cd(a,t),a=Rd(a,t),o=iu(o),o=Cd(o,t),o=Rd(o,t),a=Pd(a),o=Pd(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",t.glslVersion===Lh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const _=v+m+a,x=v+u+o,M=Ed(r,r.VERTEX_SHADER,_),S=Ed(r,r.FRAGMENT_SHADER,x);r.attachShader(y,M),r.attachShader(y,S),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function E(R){if(n.debug.checkShaderErrors){const I=r.getProgramInfoLog(y).trim(),N=r.getShaderInfoLog(M).trim(),O=r.getShaderInfoLog(S).trim();let H=!0,k=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(H=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,y,M,S);else{const q=Ad(r,M,"vertex"),z=Ad(r,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+q+`
`+z)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(N===""||O==="")&&(k=!1);k&&(R.diagnostics={runnable:H,programLog:I,vertexShader:{log:N,prefix:m},fragmentShader:{log:O,prefix:u}})}r.deleteShader(M),r.deleteShader(S),C=new mo(r,y),w=Q_(r,y)}let C;this.getUniforms=function(){return C===void 0&&E(this),C};let w;this.getAttributes=function(){return w===void 0&&E(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(y,H_)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=W_++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=M,this.fragmentShader=S,this}let ub=0;class hb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new db(e),t.set(e,i)),i}}class db{constructor(e){this.id=ub++,this.code=e,this.usedTimes=0}}function fb(n,e,t,i,r,s,a){const o=new zu,l=new hb,c=new Set,h=[],d=r.logarithmicDepthBuffer,f=r.vertexTextures;let g=r.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,b,R,I,N){const O=I.fog,H=N.geometry,k=w.isMeshStandardMaterial?I.environment:null,q=(w.isMeshStandardMaterial?t:e).get(w.envMap||k),z=q&&q.mapping===nl?q.image.height:null,$=p[w.type];w.precision!==null&&(g=r.getMaxPrecision(w.precision),g!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",g,"instead."));const ne=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,re=ne!==void 0?ne.length:0;let he=0;H.morphAttributes.position!==void 0&&(he=1),H.morphAttributes.normal!==void 0&&(he=2),H.morphAttributes.color!==void 0&&(he=3);let ge,X,Z,se;if($){const rt=$n[$];ge=rt.vertexShader,X=rt.fragmentShader}else ge=w.vertexShader,X=w.fragmentShader,l.update(w),Z=l.getVertexShaderID(w),se=l.getFragmentShaderID(w);const ee=n.getRenderTarget(),de=n.state.buffers.depth.getReversed(),xe=N.isInstancedMesh===!0,Ue=N.isBatchedMesh===!0,lt=!!w.map,je=!!w.matcap,yt=!!q,L=!!w.aoMap,Tn=!!w.lightMap,Xe=!!w.bumpMap,$e=!!w.normalMap,Ce=!!w.displacementMap,ht=!!w.emissiveMap,Re=!!w.metalnessMap,P=!!w.roughnessMap,T=w.anisotropy>0,V=w.clearcoat>0,Q=w.dispersion>0,te=w.iridescence>0,K=w.sheen>0,Te=w.transmission>0,fe=T&&!!w.anisotropyMap,ye=V&&!!w.clearcoatMap,Ke=V&&!!w.clearcoatNormalMap,ae=V&&!!w.clearcoatRoughnessMap,_e=te&&!!w.iridescenceMap,Le=te&&!!w.iridescenceThicknessMap,Ne=K&&!!w.sheenColorMap,be=K&&!!w.sheenRoughnessMap,Ye=!!w.specularMap,ke=!!w.specularColorMap,ut=!!w.specularIntensityMap,U=Te&&!!w.transmissionMap,ce=Te&&!!w.thicknessMap,Y=!!w.gradientMap,J=!!w.alphaMap,me=w.alphaTest>0,pe=!!w.alphaHash,ze=!!w.extensions;let mt=Ni;w.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(mt=n.toneMapping);const Xt={shaderID:$,shaderType:w.type,shaderName:w.name,vertexShader:ge,fragmentShader:X,defines:w.defines,customVertexShaderID:Z,customFragmentShaderID:se,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:g,batching:Ue,batchingColor:Ue&&N._colorsTexture!==null,instancing:xe,instancingColor:xe&&N.instanceColor!==null,instancingMorph:xe&&N.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?n.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:ps,alphaToCoverage:!!w.alphaToCoverage,map:lt,matcap:je,envMap:yt,envMapMode:yt&&q.mapping,envMapCubeUVHeight:z,aoMap:L,lightMap:Tn,bumpMap:Xe,normalMap:$e,displacementMap:f&&Ce,emissiveMap:ht,normalMapObjectSpace:$e&&w.normalMapType===G0,normalMapTangentSpace:$e&&w.normalMapType===Bu,metalnessMap:Re,roughnessMap:P,anisotropy:T,anisotropyMap:fe,clearcoat:V,clearcoatMap:ye,clearcoatNormalMap:Ke,clearcoatRoughnessMap:ae,dispersion:Q,iridescence:te,iridescenceMap:_e,iridescenceThicknessMap:Le,sheen:K,sheenColorMap:Ne,sheenRoughnessMap:be,specularMap:Ye,specularColorMap:ke,specularIntensityMap:ut,transmission:Te,transmissionMap:U,thicknessMap:ce,gradientMap:Y,opaque:w.transparent===!1&&w.blending===Kn&&w.alphaToCoverage===!1,alphaMap:J,alphaTest:me,alphaHash:pe,combine:w.combine,mapUv:lt&&y(w.map.channel),aoMapUv:L&&y(w.aoMap.channel),lightMapUv:Tn&&y(w.lightMap.channel),bumpMapUv:Xe&&y(w.bumpMap.channel),normalMapUv:$e&&y(w.normalMap.channel),displacementMapUv:Ce&&y(w.displacementMap.channel),emissiveMapUv:ht&&y(w.emissiveMap.channel),metalnessMapUv:Re&&y(w.metalnessMap.channel),roughnessMapUv:P&&y(w.roughnessMap.channel),anisotropyMapUv:fe&&y(w.anisotropyMap.channel),clearcoatMapUv:ye&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:be&&y(w.sheenRoughnessMap.channel),specularMapUv:Ye&&y(w.specularMap.channel),specularColorMapUv:ke&&y(w.specularColorMap.channel),specularIntensityMapUv:ut&&y(w.specularIntensityMap.channel),transmissionMapUv:U&&y(w.transmissionMap.channel),thicknessMapUv:ce&&y(w.thicknessMap.channel),alphaMapUv:J&&y(w.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&($e||T),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!H.attributes.uv&&(lt||J),fog:!!O,useFog:w.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:de,skinning:N.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:he,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:mt,decodeVideoTexture:lt&&w.map.isVideoTexture===!0&&Je.getTransfer(w.map.colorSpace)===at,decodeVideoTextureEmissive:ht&&w.emissiveMap.isVideoTexture===!0&&Je.getTransfer(w.emissiveMap.colorSpace)===at,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Ln,flipSided:w.side===on,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:ze&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&w.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Xt.vertexUv1s=c.has(1),Xt.vertexUv2s=c.has(2),Xt.vertexUv3s=c.has(3),c.clear(),Xt}function u(w){const b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(const R in w.defines)b.push(R),b.push(w.defines[R]);return w.isRawShaderMaterial===!1&&(v(b,w),_(b,w),b.push(n.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function v(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function _(w,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reverseDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),w.push(o.mask)}function x(w){const b=p[w.type];let R;if(b){const I=$n[b];R=Ig.clone(I.uniforms)}else R=w.uniforms;return R}function M(w,b){let R;for(let I=0,N=h.length;I<N;I++){const O=h[I];if(O.cacheKey===b){R=O,++R.usedTimes;break}}return R===void 0&&(R=new cb(n,b,w,s),h.push(R)),R}function S(w){if(--w.usedTimes===0){const b=h.indexOf(w);h[b]=h[h.length-1],h.pop(),w.destroy()}}function E(w){l.remove(w)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:x,acquireProgram:M,releaseProgram:S,releaseShaderCache:E,programs:h,dispose:C}}function pb(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function mb(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Ld(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Id(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(d,f,g,p,y,m){let u=n[e];return u===void 0?(u={id:d.id,object:d,geometry:f,material:g,groupOrder:p,renderOrder:d.renderOrder,z:y,group:m},n[e]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=g,u.groupOrder=p,u.renderOrder=d.renderOrder,u.z=y,u.group=m),e++,u}function o(d,f,g,p,y,m){const u=a(d,f,g,p,y,m);g.transmission>0?i.push(u):g.transparent===!0?r.push(u):t.push(u)}function l(d,f,g,p,y,m){const u=a(d,f,g,p,y,m);g.transmission>0?i.unshift(u):g.transparent===!0?r.unshift(u):t.unshift(u)}function c(d,f){t.length>1&&t.sort(d||mb),i.length>1&&i.sort(f||Ld),r.length>1&&r.sort(f||Ld)}function h(){for(let d=e,f=n.length;d<f;d++){const g=n[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:h,sort:c}}function gb(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new Id,n.set(i,[a])):r>=s.length?(a=new Id,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function vb(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Se};break;case"SpotLight":t={position:new D,direction:new D,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Se,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":t={color:new Se,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function xb(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let yb=0;function _b(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function bb(n){const e=new vb,t=xb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new ot,a=new ot;function o(c){let h=0,d=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let g=0,p=0,y=0,m=0,u=0,v=0,_=0,x=0,M=0,S=0,E=0;c.sort(_b);for(let w=0,b=c.length;w<b;w++){const R=c[w],I=R.color,N=R.intensity,O=R.distance,H=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)h+=I.r*N,d+=I.g*N,f+=I.b*N;else if(R.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(R.sh.coefficients[k],N);E++}else if(R.isDirectionalLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,z=t.get(R);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.directionalShadow[g]=z,i.directionalShadowMap[g]=H,i.directionalShadowMatrix[g]=R.shadow.matrix,v++}i.directional[g]=k,g++}else if(R.isSpotLight){const k=e.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(I).multiplyScalar(N),k.distance=O,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,i.spot[y]=k;const q=R.shadow;if(R.map&&(i.spotLightMap[M]=R.map,M++,q.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[y]=q.matrix,R.castShadow){const z=t.get(R);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,i.spotShadow[y]=z,i.spotShadowMap[y]=H,x++}y++}else if(R.isRectAreaLight){const k=e.get(R);k.color.copy(I).multiplyScalar(N),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=k,m++}else if(R.isPointLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){const q=R.shadow,z=t.get(R);z.shadowIntensity=q.intensity,z.shadowBias=q.bias,z.shadowNormalBias=q.normalBias,z.shadowRadius=q.radius,z.shadowMapSize=q.mapSize,z.shadowCameraNear=q.camera.near,z.shadowCameraFar=q.camera.far,i.pointShadow[p]=z,i.pointShadowMap[p]=H,i.pointShadowMatrix[p]=R.shadow.matrix,_++}i.point[p]=k,p++}else if(R.isHemisphereLight){const k=e.get(R);k.skyColor.copy(R.color).multiplyScalar(N),k.groundColor.copy(R.groundColor).multiplyScalar(N),i.hemi[u]=k,u++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=f;const C=i.hash;(C.directionalLength!==g||C.pointLength!==p||C.spotLength!==y||C.rectAreaLength!==m||C.hemiLength!==u||C.numDirectionalShadows!==v||C.numPointShadows!==_||C.numSpotShadows!==x||C.numSpotMaps!==M||C.numLightProbes!==E)&&(i.directional.length=g,i.spot.length=y,i.rectArea.length=m,i.point.length=p,i.hemi.length=u,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+M-S,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,C.directionalLength=g,C.pointLength=p,C.spotLength=y,C.rectAreaLength=m,C.hemiLength=u,C.numDirectionalShadows=v,C.numPointShadows=_,C.numSpotShadows=x,C.numSpotMaps=M,C.numLightProbes=E,i.version=yb++)}function l(c,h){let d=0,f=0,g=0,p=0,y=0;const m=h.matrixWorldInverse;for(let u=0,v=c.length;u<v;u++){const _=c[u];if(_.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),d++}else if(_.isSpotLight){const x=i.spot[g];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),g++}else if(_.isRectAreaLight){const x=i.rectArea[p];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(_.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),p++}else if(_.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const x=i.hemi[y];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:i}}function Ud(n){const e=new bb(n),t=[],i=[];function r(h){c.camera=h,t.length=0,i.length=0}function s(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function wb(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Ud(n),e.set(r,[o])):s>=a.length?(o=new Ud(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Sb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Mb=`uniform sampler2D shadow_pass;
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
}`;function Eb(n,e,t){let i=new Vu;const r=new Ee,s=new Ee,a=new xt,o=new $g({depthPacking:V0}),l=new Yg,c={},h=t.maxTextureSize,d={[Mn]:on,[on]:Mn,[Ln]:Ln},f=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:Sb,fragmentShader:Mb}),g=f.clone();g.defines.HORIZONTAL_PASS=1;const p=new Jt;p.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Vt(p,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pp;let u=this.type;this.render=function(S,E,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),b=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Fi),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const N=u!==oi&&this.type===oi,O=u===oi&&this.type!==oi;for(let H=0,k=S.length;H<k;H++){const q=S[H],z=q.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const $=z.getFrameExtents();if(r.multiply($),s.copy(z.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/$.x),r.x=s.x*$.x,z.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/$.y),r.y=s.y*$.y,z.mapSize.y=s.y)),z.map===null||N===!0||O===!0){const re=this.type!==oi?{minFilter:Pt,magFilter:Pt}:{};z.map!==null&&z.map.dispose(),z.map=new mr(r.x,r.y,re),z.map.texture.name=q.name+".shadowMap",z.camera.updateProjectionMatrix()}n.setRenderTarget(z.map),n.clear();const ne=z.getViewportCount();for(let re=0;re<ne;re++){const he=z.getViewport(re);a.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),I.viewport(a),z.updateMatrices(q,re),i=z.getFrustum(),x(E,C,z.camera,q,this.type)}z.isPointLightShadow!==!0&&this.type===oi&&v(z,C),z.needsUpdate=!1}u=this.type,m.needsUpdate=!1,n.setRenderTarget(w,b,R)};function v(S,E){const C=e.update(y);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,g.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new mr(r.x,r.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,C,f,y,null),g.uniforms.shadow_pass.value=S.mapPass.texture,g.uniforms.resolution.value=S.mapSize,g.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,C,g,y,null)}function _(S,E,C,w){let b=null;const R=C.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)b=R;else if(b=C.isPointLight===!0?l:o,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=b.uuid,N=E.uuid;let O=c[I];O===void 0&&(O={},c[I]=O);let H=O[N];H===void 0&&(H=b.clone(),O[N]=H,E.addEventListener("dispose",M)),b=H}if(b.visible=E.visible,b.wireframe=E.wireframe,w===oi?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:d[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=C}return b}function x(S,E,C,w,b){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===oi)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,S.matrixWorld);const N=e.update(S),O=S.material;if(Array.isArray(O)){const H=N.groups;for(let k=0,q=H.length;k<q;k++){const z=H[k],$=O[z.materialIndex];if($&&$.visible){const ne=_(S,$,w,b);S.onBeforeShadow(n,S,E,C,N,ne,z),n.renderBufferDirect(C,null,N,ne,S,z),S.onAfterShadow(n,S,E,C,N,ne,z)}}}else if(O.visible){const H=_(S,O,w,b);S.onBeforeShadow(n,S,E,C,N,H,null),n.renderBufferDirect(C,null,N,H,S,null),S.onAfterShadow(n,S,E,C,N,H,null)}}const I=S.children;for(let N=0,O=I.length;N<O;N++)x(I[N],E,C,w,b)}function M(S){S.target.removeEventListener("dispose",M);for(const C in c){const w=c[C],b=S.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}const Tb={[vc]:xc,[yc]:wc,[_c]:Sc,[cs]:bc,[xc]:vc,[wc]:yc,[Sc]:_c,[bc]:cs};function Ab(n,e){function t(){let U=!1;const ce=new xt;let Y=null;const J=new xt(0,0,0,0);return{setMask:function(me){Y!==me&&!U&&(n.colorMask(me,me,me,me),Y=me)},setLocked:function(me){U=me},setClear:function(me,pe,ze,mt,Xt){Xt===!0&&(me*=mt,pe*=mt,ze*=mt),ce.set(me,pe,ze,mt),J.equals(ce)===!1&&(n.clearColor(me,pe,ze,mt),J.copy(ce))},reset:function(){U=!1,Y=null,J.set(-1,0,0,0)}}}function i(){let U=!1,ce=!1,Y=null,J=null,me=null;return{setReversed:function(pe){if(ce!==pe){const ze=e.get("EXT_clip_control");ce?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT);const mt=me;me=null,this.setClear(mt)}ce=pe},getReversed:function(){return ce},setTest:function(pe){pe?ee(n.DEPTH_TEST):de(n.DEPTH_TEST)},setMask:function(pe){Y!==pe&&!U&&(n.depthMask(pe),Y=pe)},setFunc:function(pe){if(ce&&(pe=Tb[pe]),J!==pe){switch(pe){case vc:n.depthFunc(n.NEVER);break;case xc:n.depthFunc(n.ALWAYS);break;case yc:n.depthFunc(n.LESS);break;case cs:n.depthFunc(n.LEQUAL);break;case _c:n.depthFunc(n.EQUAL);break;case bc:n.depthFunc(n.GEQUAL);break;case wc:n.depthFunc(n.GREATER);break;case Sc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=pe}},setLocked:function(pe){U=pe},setClear:function(pe){me!==pe&&(ce&&(pe=1-pe),n.clearDepth(pe),me=pe)},reset:function(){U=!1,Y=null,J=null,me=null,ce=!1}}}function r(){let U=!1,ce=null,Y=null,J=null,me=null,pe=null,ze=null,mt=null,Xt=null;return{setTest:function(rt){U||(rt?ee(n.STENCIL_TEST):de(n.STENCIL_TEST))},setMask:function(rt){ce!==rt&&!U&&(n.stencilMask(rt),ce=rt)},setFunc:function(rt,Fn,ti){(Y!==rt||J!==Fn||me!==ti)&&(n.stencilFunc(rt,Fn,ti),Y=rt,J=Fn,me=ti)},setOp:function(rt,Fn,ti){(pe!==rt||ze!==Fn||mt!==ti)&&(n.stencilOp(rt,Fn,ti),pe=rt,ze=Fn,mt=ti)},setLocked:function(rt){U=rt},setClear:function(rt){Xt!==rt&&(n.clearStencil(rt),Xt=rt)},reset:function(){U=!1,ce=null,Y=null,J=null,me=null,pe=null,ze=null,mt=null,Xt=null}}}const s=new t,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let h={},d={},f=new WeakMap,g=[],p=null,y=!1,m=null,u=null,v=null,_=null,x=null,M=null,S=null,E=new Se(0,0,0),C=0,w=!1,b=null,R=null,I=null,N=null,O=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,q=0;const z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(z)[1]),k=q>=1):z.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),k=q>=2);let $=null,ne={};const re=n.getParameter(n.SCISSOR_BOX),he=n.getParameter(n.VIEWPORT),ge=new xt().fromArray(re),X=new xt().fromArray(he);function Z(U,ce,Y,J){const me=new Uint8Array(4),pe=n.createTexture();n.bindTexture(U,pe),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let ze=0;ze<Y;ze++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,me):n.texImage2D(ce+ze,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,me);return pe}const se={};se[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),se[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),se[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(n.DEPTH_TEST),a.setFunc(cs),Xe(!1),$e(Ch),ee(n.CULL_FACE),L(Fi);function ee(U){h[U]!==!0&&(n.enable(U),h[U]=!0)}function de(U){h[U]!==!1&&(n.disable(U),h[U]=!1)}function xe(U,ce){return d[U]!==ce?(n.bindFramebuffer(U,ce),d[U]=ce,U===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=ce),U===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Ue(U,ce){let Y=g,J=!1;if(U){Y=f.get(ce),Y===void 0&&(Y=[],f.set(ce,Y));const me=U.textures;if(Y.length!==me.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,ze=me.length;pe<ze;pe++)Y[pe]=n.COLOR_ATTACHMENT0+pe;Y.length=me.length,J=!0}}else Y[0]!==n.BACK&&(Y[0]=n.BACK,J=!0);J&&n.drawBuffers(Y)}function lt(U){return p!==U?(n.useProgram(U),p=U,!0):!1}const je={[or]:n.FUNC_ADD,[f0]:n.FUNC_SUBTRACT,[p0]:n.FUNC_REVERSE_SUBTRACT};je[m0]=n.MIN,je[g0]=n.MAX;const yt={[v0]:n.ZERO,[x0]:n.ONE,[y0]:n.SRC_COLOR,[mc]:n.SRC_ALPHA,[E0]:n.SRC_ALPHA_SATURATE,[S0]:n.DST_COLOR,[b0]:n.DST_ALPHA,[_0]:n.ONE_MINUS_SRC_COLOR,[gc]:n.ONE_MINUS_SRC_ALPHA,[M0]:n.ONE_MINUS_DST_COLOR,[w0]:n.ONE_MINUS_DST_ALPHA,[T0]:n.CONSTANT_COLOR,[A0]:n.ONE_MINUS_CONSTANT_COLOR,[C0]:n.CONSTANT_ALPHA,[R0]:n.ONE_MINUS_CONSTANT_ALPHA};function L(U,ce,Y,J,me,pe,ze,mt,Xt,rt){if(U===Fi){y===!0&&(de(n.BLEND),y=!1);return}if(y===!1&&(ee(n.BLEND),y=!0),U!==d0){if(U!==m||rt!==w){if((u!==or||x!==or)&&(n.blendEquation(n.FUNC_ADD),u=or,x=or),rt)switch(U){case Kn:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ao:n.blendFunc(n.ONE,n.ONE);break;case Rh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ph:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Kn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ao:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Rh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ph:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}v=null,_=null,M=null,S=null,E.set(0,0,0),C=0,m=U,w=rt}return}me=me||ce,pe=pe||Y,ze=ze||J,(ce!==u||me!==x)&&(n.blendEquationSeparate(je[ce],je[me]),u=ce,x=me),(Y!==v||J!==_||pe!==M||ze!==S)&&(n.blendFuncSeparate(yt[Y],yt[J],yt[pe],yt[ze]),v=Y,_=J,M=pe,S=ze),(mt.equals(E)===!1||Xt!==C)&&(n.blendColor(mt.r,mt.g,mt.b,Xt),E.copy(mt),C=Xt),m=U,w=!1}function Tn(U,ce){U.side===Ln?de(n.CULL_FACE):ee(n.CULL_FACE);let Y=U.side===on;ce&&(Y=!Y),Xe(Y),U.blending===Kn&&U.transparent===!1?L(Fi):L(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),s.setMask(U.colorWrite);const J=U.stencilWrite;o.setTest(J),J&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ht(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):de(n.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(U){b!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),b=U)}function $e(U){U!==u0?(ee(n.CULL_FACE),U!==R&&(U===Ch?n.cullFace(n.BACK):U===h0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):de(n.CULL_FACE),R=U}function Ce(U){U!==I&&(k&&n.lineWidth(U),I=U)}function ht(U,ce,Y){U?(ee(n.POLYGON_OFFSET_FILL),(N!==ce||O!==Y)&&(n.polygonOffset(ce,Y),N=ce,O=Y)):de(n.POLYGON_OFFSET_FILL)}function Re(U){U?ee(n.SCISSOR_TEST):de(n.SCISSOR_TEST)}function P(U){U===void 0&&(U=n.TEXTURE0+H-1),$!==U&&(n.activeTexture(U),$=U)}function T(U,ce,Y){Y===void 0&&($===null?Y=n.TEXTURE0+H-1:Y=$);let J=ne[Y];J===void 0&&(J={type:void 0,texture:void 0},ne[Y]=J),(J.type!==U||J.texture!==ce)&&($!==Y&&(n.activeTexture(Y),$=Y),n.bindTexture(U,ce||se[U]),J.type=U,J.texture=ce)}function V(){const U=ne[$];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function te(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ke(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _e(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(U){ge.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),ge.copy(U))}function be(U){X.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),X.copy(U))}function Ye(U,ce){let Y=c.get(ce);Y===void 0&&(Y=new WeakMap,c.set(ce,Y));let J=Y.get(U);J===void 0&&(J=n.getUniformBlockIndex(ce,U.name),Y.set(U,J))}function ke(U,ce){const J=c.get(ce).get(U);l.get(ce)!==J&&(n.uniformBlockBinding(ce,J,U.__bindingPointIndex),l.set(ce,J))}function ut(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},$=null,ne={},d={},f=new WeakMap,g=[],p=null,y=!1,m=null,u=null,v=null,_=null,x=null,M=null,S=null,E=new Se(0,0,0),C=0,w=!1,b=null,R=null,I=null,N=null,O=null,ge.set(0,0,n.canvas.width,n.canvas.height),X.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ee,disable:de,bindFramebuffer:xe,drawBuffers:Ue,useProgram:lt,setBlending:L,setMaterial:Tn,setFlipSided:Xe,setCullFace:$e,setLineWidth:Ce,setPolygonOffset:ht,setScissorTest:Re,activeTexture:P,bindTexture:T,unbindTexture:V,compressedTexImage2D:Q,compressedTexImage3D:te,texImage2D:_e,texImage3D:Le,updateUBOMapping:Ye,uniformBlockBinding:ke,texStorage2D:Ke,texStorage3D:ae,texSubImage2D:K,texSubImage3D:Te,compressedTexSubImage2D:fe,compressedTexSubImage3D:ye,scissor:Ne,viewport:be,reset:ut}}function Cb(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ee,h=new WeakMap;let d;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(P,T){return g?new OffscreenCanvas(P,T):Do("canvas")}function y(P,T,V){let Q=1;const te=Re(P);if((te.width>V||te.height>V)&&(Q=V/Math.max(te.width,te.height)),Q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const K=Math.floor(Q*te.width),Te=Math.floor(Q*te.height);d===void 0&&(d=p(K,Te));const fe=T?p(K,Te):d;return fe.width=K,fe.height=Te,fe.getContext("2d").drawImage(P,0,0,K,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+K+"x"+Te+")."),fe}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function m(P){return P.generateMipmaps}function u(P){n.generateMipmap(P)}function v(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(P,T,V,Q,te=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let K=T;if(T===n.RED&&(V===n.FLOAT&&(K=n.R32F),V===n.HALF_FLOAT&&(K=n.R16F),V===n.UNSIGNED_BYTE&&(K=n.R8)),T===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.R8UI),V===n.UNSIGNED_SHORT&&(K=n.R16UI),V===n.UNSIGNED_INT&&(K=n.R32UI),V===n.BYTE&&(K=n.R8I),V===n.SHORT&&(K=n.R16I),V===n.INT&&(K=n.R32I)),T===n.RG&&(V===n.FLOAT&&(K=n.RG32F),V===n.HALF_FLOAT&&(K=n.RG16F),V===n.UNSIGNED_BYTE&&(K=n.RG8)),T===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RG8UI),V===n.UNSIGNED_SHORT&&(K=n.RG16UI),V===n.UNSIGNED_INT&&(K=n.RG32UI),V===n.BYTE&&(K=n.RG8I),V===n.SHORT&&(K=n.RG16I),V===n.INT&&(K=n.RG32I)),T===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGB8UI),V===n.UNSIGNED_SHORT&&(K=n.RGB16UI),V===n.UNSIGNED_INT&&(K=n.RGB32UI),V===n.BYTE&&(K=n.RGB8I),V===n.SHORT&&(K=n.RGB16I),V===n.INT&&(K=n.RGB32I)),T===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),V===n.UNSIGNED_INT&&(K=n.RGBA32UI),V===n.BYTE&&(K=n.RGBA8I),V===n.SHORT&&(K=n.RGBA16I),V===n.INT&&(K=n.RGBA32I)),T===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),T===n.RGBA){const Te=te?Co:Je.getTransfer(Q);V===n.FLOAT&&(K=n.RGBA32F),V===n.HALF_FLOAT&&(K=n.RGBA16F),V===n.UNSIGNED_BYTE&&(K=Te===at?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function x(P,T){let V;return P?T===null||T===pr||T===ds?V=n.DEPTH24_STENCIL8:T===hi?V=n.DEPTH32F_STENCIL8:T===ia&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===pr||T===ds?V=n.DEPTH_COMPONENT24:T===hi?V=n.DEPTH_COMPONENT32F:T===ia&&(V=n.DEPTH_COMPONENT16),V}function M(P,T){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Pt&&P.minFilter!==it?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function S(P){const T=P.target;T.removeEventListener("dispose",S),C(T),T.isVideoTexture&&h.delete(T)}function E(P){const T=P.target;T.removeEventListener("dispose",E),b(T)}function C(P){const T=i.get(P);if(T.__webglInit===void 0)return;const V=P.source,Q=f.get(V);if(Q){const te=Q[T.__cacheKey];te.usedTimes--,te.usedTimes===0&&w(P),Object.keys(Q).length===0&&f.delete(V)}i.remove(P)}function w(P){const T=i.get(P);n.deleteTexture(T.__webglTexture);const V=P.source,Q=f.get(V);delete Q[T.__cacheKey],a.memory.textures--}function b(P){const T=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(T.__webglFramebuffer[Q]))for(let te=0;te<T.__webglFramebuffer[Q].length;te++)n.deleteFramebuffer(T.__webglFramebuffer[Q][te]);else n.deleteFramebuffer(T.__webglFramebuffer[Q]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[Q])}else{if(Array.isArray(T.__webglFramebuffer))for(let Q=0;Q<T.__webglFramebuffer.length;Q++)n.deleteFramebuffer(T.__webglFramebuffer[Q]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Q=0;Q<T.__webglColorRenderbuffer.length;Q++)T.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[Q]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const V=P.textures;for(let Q=0,te=V.length;Q<te;Q++){const K=i.get(V[Q]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),a.memory.textures--),i.remove(V[Q])}i.remove(P)}let R=0;function I(){R=0}function N(){const P=R;return P>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+r.maxTextures),R+=1,P}function O(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function H(P,T){const V=i.get(P);if(P.isVideoTexture&&Ce(P),P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){const Q=P.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(V,P,T);return}}t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+T)}function k(P,T){const V=i.get(P);if(P.version>0&&V.__version!==P.version){X(V,P,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+T)}function q(P,T){const V=i.get(P);if(P.version>0&&V.__version!==P.version){X(V,P,T);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+T)}function z(P,T){const V=i.get(P);if(P.version>0&&V.__version!==P.version){Z(V,P,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+T)}const $={[En]:n.REPEAT,[pt]:n.CLAMP_TO_EDGE,[Tc]:n.MIRRORED_REPEAT},ne={[Pt]:n.NEAREST,[z0]:n.NEAREST_MIPMAP_NEAREST,[wa]:n.NEAREST_MIPMAP_LINEAR,[it]:n.LINEAR,[gl]:n.LINEAR_MIPMAP_NEAREST,[cr]:n.LINEAR_MIPMAP_LINEAR},re={[H0]:n.NEVER,[j0]:n.ALWAYS,[W0]:n.LESS,[Ap]:n.LEQUAL,[q0]:n.EQUAL,[Y0]:n.GEQUAL,[X0]:n.GREATER,[$0]:n.NOTEQUAL};function he(P,T){if(T.type===hi&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===it||T.magFilter===gl||T.magFilter===wa||T.magFilter===cr||T.minFilter===it||T.minFilter===gl||T.minFilter===wa||T.minFilter===cr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,$[T.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,$[T.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,$[T.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,ne[T.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,ne[T.minFilter]),T.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,re[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Pt||T.minFilter!==wa&&T.minFilter!==cr||T.type===hi&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function ge(P,T){let V=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",S));const Q=T.source;let te=f.get(Q);te===void 0&&(te={},f.set(Q,te));const K=O(T);if(K!==P.__cacheKey){te[K]===void 0&&(te[K]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,V=!0),te[K].usedTimes++;const Te=te[P.__cacheKey];Te!==void 0&&(te[P.__cacheKey].usedTimes--,Te.usedTimes===0&&w(T)),P.__cacheKey=K,P.__webglTexture=te[K].texture}return V}function X(P,T,V){let Q=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Q=n.TEXTURE_3D);const te=ge(P,T),K=T.source;t.bindTexture(Q,P.__webglTexture,n.TEXTURE0+V);const Te=i.get(K);if(K.version!==Te.__version||te===!0){t.activeTexture(n.TEXTURE0+V);const fe=Je.getPrimaries(Je.workingColorSpace),ye=T.colorSpace===Nt?null:Je.getPrimaries(T.colorSpace),Ke=T.colorSpace===Nt||fe===ye?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let ae=y(T.image,!1,r.maxTextureSize);ae=ht(T,ae);const _e=s.convert(T.format,T.colorSpace),Le=s.convert(T.type);let Ne=_(T.internalFormat,_e,Le,T.colorSpace,T.isVideoTexture);he(Q,T);let be;const Ye=T.mipmaps,ke=T.isVideoTexture!==!0,ut=Te.__version===void 0||te===!0,U=K.dataReady,ce=M(T,ae);if(T.isDepthTexture)Ne=x(T.format===fs,T.type),ut&&(ke?t.texStorage2D(n.TEXTURE_2D,1,Ne,ae.width,ae.height):t.texImage2D(n.TEXTURE_2D,0,Ne,ae.width,ae.height,0,_e,Le,null));else if(T.isDataTexture)if(Ye.length>0){ke&&ut&&t.texStorage2D(n.TEXTURE_2D,ce,Ne,Ye[0].width,Ye[0].height);for(let Y=0,J=Ye.length;Y<J;Y++)be=Ye[Y],ke?U&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,be.width,be.height,_e,Le,be.data):t.texImage2D(n.TEXTURE_2D,Y,Ne,be.width,be.height,0,_e,Le,be.data);T.generateMipmaps=!1}else ke?(ut&&t.texStorage2D(n.TEXTURE_2D,ce,Ne,ae.width,ae.height),U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ae.width,ae.height,_e,Le,ae.data)):t.texImage2D(n.TEXTURE_2D,0,Ne,ae.width,ae.height,0,_e,Le,ae.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){ke&&ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Ne,Ye[0].width,Ye[0].height,ae.depth);for(let Y=0,J=Ye.length;Y<J;Y++)if(be=Ye[Y],T.format!==St)if(_e!==null)if(ke){if(U)if(T.layerUpdates.size>0){const me=ud(be.width,be.height,T.format,T.type);for(const pe of T.layerUpdates){const ze=be.data.subarray(pe*me/be.data.BYTES_PER_ELEMENT,(pe+1)*me/be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,pe,be.width,be.height,1,_e,ze)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,be.width,be.height,ae.depth,_e,be.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Y,Ne,be.width,be.height,ae.depth,0,be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,be.width,be.height,ae.depth,_e,Le,be.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Y,Ne,be.width,be.height,ae.depth,0,_e,Le,be.data)}else{ke&&ut&&t.texStorage2D(n.TEXTURE_2D,ce,Ne,Ye[0].width,Ye[0].height);for(let Y=0,J=Ye.length;Y<J;Y++)be=Ye[Y],T.format!==St?_e!==null?ke?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,Y,0,0,be.width,be.height,_e,be.data):t.compressedTexImage2D(n.TEXTURE_2D,Y,Ne,be.width,be.height,0,be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?U&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,be.width,be.height,_e,Le,be.data):t.texImage2D(n.TEXTURE_2D,Y,Ne,be.width,be.height,0,_e,Le,be.data)}else if(T.isDataArrayTexture)if(ke){if(ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Ne,ae.width,ae.height,ae.depth),U)if(T.layerUpdates.size>0){const Y=ud(ae.width,ae.height,T.format,T.type);for(const J of T.layerUpdates){const me=ae.data.subarray(J*Y/ae.data.BYTES_PER_ELEMENT,(J+1)*Y/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,ae.width,ae.height,1,_e,Le,me)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,_e,Le,ae.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ne,ae.width,ae.height,ae.depth,0,_e,Le,ae.data);else if(T.isData3DTexture)ke?(ut&&t.texStorage3D(n.TEXTURE_3D,ce,Ne,ae.width,ae.height,ae.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,_e,Le,ae.data)):t.texImage3D(n.TEXTURE_3D,0,Ne,ae.width,ae.height,ae.depth,0,_e,Le,ae.data);else if(T.isFramebufferTexture){if(ut)if(ke)t.texStorage2D(n.TEXTURE_2D,ce,Ne,ae.width,ae.height);else{let Y=ae.width,J=ae.height;for(let me=0;me<ce;me++)t.texImage2D(n.TEXTURE_2D,me,Ne,Y,J,0,_e,Le,null),Y>>=1,J>>=1}}else if(Ye.length>0){if(ke&&ut){const Y=Re(Ye[0]);t.texStorage2D(n.TEXTURE_2D,ce,Ne,Y.width,Y.height)}for(let Y=0,J=Ye.length;Y<J;Y++)be=Ye[Y],ke?U&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,_e,Le,be):t.texImage2D(n.TEXTURE_2D,Y,Ne,_e,Le,be);T.generateMipmaps=!1}else if(ke){if(ut){const Y=Re(ae);t.texStorage2D(n.TEXTURE_2D,ce,Ne,Y.width,Y.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,_e,Le,ae)}else t.texImage2D(n.TEXTURE_2D,0,Ne,_e,Le,ae);m(T)&&u(Q),Te.__version=K.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Z(P,T,V){if(T.image.length!==6)return;const Q=ge(P,T),te=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+V);const K=i.get(te);if(te.version!==K.__version||Q===!0){t.activeTexture(n.TEXTURE0+V);const Te=Je.getPrimaries(Je.workingColorSpace),fe=T.colorSpace===Nt?null:Je.getPrimaries(T.colorSpace),ye=T.colorSpace===Nt||Te===fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Ke=T.isCompressedTexture||T.image[0].isCompressedTexture,ae=T.image[0]&&T.image[0].isDataTexture,_e=[];for(let J=0;J<6;J++)!Ke&&!ae?_e[J]=y(T.image[J],!0,r.maxCubemapSize):_e[J]=ae?T.image[J].image:T.image[J],_e[J]=ht(T,_e[J]);const Le=_e[0],Ne=s.convert(T.format,T.colorSpace),be=s.convert(T.type),Ye=_(T.internalFormat,Ne,be,T.colorSpace),ke=T.isVideoTexture!==!0,ut=K.__version===void 0||Q===!0,U=te.dataReady;let ce=M(T,Le);he(n.TEXTURE_CUBE_MAP,T);let Y;if(Ke){ke&&ut&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,Ye,Le.width,Le.height);for(let J=0;J<6;J++){Y=_e[J].mipmaps;for(let me=0;me<Y.length;me++){const pe=Y[me];T.format!==St?Ne!==null?ke?U&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,pe.width,pe.height,Ne,pe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Ye,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,pe.width,pe.height,Ne,be,pe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Ye,pe.width,pe.height,0,Ne,be,pe.data)}}}else{if(Y=T.mipmaps,ke&&ut){Y.length>0&&ce++;const J=Re(_e[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,Ye,J.width,J.height)}for(let J=0;J<6;J++)if(ae){ke?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,_e[J].width,_e[J].height,Ne,be,_e[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ye,_e[J].width,_e[J].height,0,Ne,be,_e[J].data);for(let me=0;me<Y.length;me++){const ze=Y[me].image[J].image;ke?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,ze.width,ze.height,Ne,be,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Ye,ze.width,ze.height,0,Ne,be,ze.data)}}else{ke?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ne,be,_e[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ye,Ne,be,_e[J]);for(let me=0;me<Y.length;me++){const pe=Y[me];ke?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,Ne,be,pe.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Ye,Ne,be,pe.image[J])}}}m(T)&&u(n.TEXTURE_CUBE_MAP),K.__version=te.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function se(P,T,V,Q,te,K){const Te=s.convert(V.format,V.colorSpace),fe=s.convert(V.type),ye=_(V.internalFormat,Te,fe,V.colorSpace),Ke=i.get(T),ae=i.get(V);if(ae.__renderTarget=T,!Ke.__hasExternalTextures){const _e=Math.max(1,T.width>>K),Le=Math.max(1,T.height>>K);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,K,ye,_e,Le,T.depth,0,Te,fe,null):t.texImage2D(te,K,ye,_e,Le,0,Te,fe,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,te,ae.__webglTexture,0,Xe(T)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,te,ae.__webglTexture,K),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(P,T,V){if(n.bindRenderbuffer(n.RENDERBUFFER,P),T.depthBuffer){const Q=T.depthTexture,te=Q&&Q.isDepthTexture?Q.type:null,K=x(T.stencilBuffer,te),Te=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=Xe(T);$e(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,fe,K,T.width,T.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,fe,K,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,K,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,P)}else{const Q=T.textures;for(let te=0;te<Q.length;te++){const K=Q[te],Te=s.convert(K.format,K.colorSpace),fe=s.convert(K.type),ye=_(K.internalFormat,Te,fe,K.colorSpace),Ke=Xe(T);V&&$e(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ke,ye,T.width,T.height):$e(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ke,ye,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,ye,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function de(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(T.depthTexture);Q.__renderTarget=T,(!Q.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),H(T.depthTexture,0);const te=Q.__webglTexture,K=Xe(T);if(T.depthTexture.format===es)$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(T.depthTexture.format===fs)$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function xe(P){const T=i.get(P),V=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const Q=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),Q){const te=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,Q.removeEventListener("dispose",te)};Q.addEventListener("dispose",te),T.__depthDisposeCallback=te}T.__boundDepthTexture=Q}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");de(T.__webglFramebuffer,P)}else if(V){T.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[Q]),T.__webglDepthbuffer[Q]===void 0)T.__webglDepthbuffer[Q]=n.createRenderbuffer(),ee(T.__webglDepthbuffer[Q],P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=T.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,K)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),ee(T.__webglDepthbuffer,P,!1);else{const Q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,te),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,te)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ue(P,T,V){const Q=i.get(P);T!==void 0&&se(Q.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&xe(P)}function lt(P){const T=P.texture,V=i.get(P),Q=i.get(T);P.addEventListener("dispose",E);const te=P.textures,K=P.isWebGLCubeRenderTarget===!0,Te=te.length>1;if(Te||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=T.version,a.memory.textures++),K){V.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer[fe]=[];for(let ye=0;ye<T.mipmaps.length;ye++)V.__webglFramebuffer[fe][ye]=n.createFramebuffer()}else V.__webglFramebuffer[fe]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer=[];for(let fe=0;fe<T.mipmaps.length;fe++)V.__webglFramebuffer[fe]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Te)for(let fe=0,ye=te.length;fe<ye;fe++){const Ke=i.get(te[fe]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&$e(P)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let fe=0;fe<te.length;fe++){const ye=te[fe];V.__webglColorRenderbuffer[fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[fe]);const Ke=s.convert(ye.format,ye.colorSpace),ae=s.convert(ye.type),_e=_(ye.internalFormat,Ke,ae,ye.colorSpace,P.isXRRenderTarget===!0),Le=Xe(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,_e,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,V.__webglColorRenderbuffer[fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),ee(V.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),he(n.TEXTURE_CUBE_MAP,T);for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0)for(let ye=0;ye<T.mipmaps.length;ye++)se(V.__webglFramebuffer[fe][ye],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ye);else se(V.__webglFramebuffer[fe],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(T)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let fe=0,ye=te.length;fe<ye;fe++){const Ke=te[fe],ae=i.get(Ke);t.bindTexture(n.TEXTURE_2D,ae.__webglTexture),he(n.TEXTURE_2D,Ke),se(V.__webglFramebuffer,P,Ke,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,0),m(Ke)&&u(n.TEXTURE_2D)}t.unbindTexture()}else{let fe=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(fe=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(fe,Q.__webglTexture),he(fe,T),T.mipmaps&&T.mipmaps.length>0)for(let ye=0;ye<T.mipmaps.length;ye++)se(V.__webglFramebuffer[ye],P,T,n.COLOR_ATTACHMENT0,fe,ye);else se(V.__webglFramebuffer,P,T,n.COLOR_ATTACHMENT0,fe,0);m(T)&&u(fe),t.unbindTexture()}P.depthBuffer&&xe(P)}function je(P){const T=P.textures;for(let V=0,Q=T.length;V<Q;V++){const te=T[V];if(m(te)){const K=v(P),Te=i.get(te).__webglTexture;t.bindTexture(K,Te),u(K),t.unbindTexture()}}}const yt=[],L=[];function Tn(P){if(P.samples>0){if($e(P)===!1){const T=P.textures,V=P.width,Q=P.height;let te=n.COLOR_BUFFER_BIT;const K=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(P),fe=T.length>1;if(fe)for(let ye=0;ye<T.length;ye++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let ye=0;ye<T.length;ye++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),fe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);const Ke=i.get(T[ye]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ke,0)}n.blitFramebuffer(0,0,V,Q,0,0,V,Q,te,n.NEAREST),l===!0&&(yt.length=0,L.length=0,yt.push(n.COLOR_ATTACHMENT0+ye),P.depthBuffer&&P.resolveDepthBuffer===!1&&(yt.push(K),L.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,L)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,yt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),fe)for(let ye=0;ye<T.length;ye++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.RENDERBUFFER,Te.__webglColorRenderbuffer[ye]);const Ke=i.get(T[ye]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ye,n.TEXTURE_2D,Ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Xe(P){return Math.min(r.maxSamples,P.samples)}function $e(P){const T=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ce(P){const T=a.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function ht(P,T){const V=P.colorSpace,Q=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||V!==ps&&V!==Nt&&(Je.getTransfer(V)===at?(Q!==St||te!==Lt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),T}function Re(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=I,this.setTexture2D=H,this.setTexture2DArray=k,this.setTexture3D=q,this.setTextureCube=z,this.rebindTextures=Ue,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Tn,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=se,this.useMultisampledRTT=$e}function Rb(n,e){function t(i,r=Nt){let s;const a=Je.getTransfer(r);if(i===Lt)return n.UNSIGNED_BYTE;if(i===Lu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Iu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===yp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===vp)return n.BYTE;if(i===xp)return n.SHORT;if(i===ia)return n.UNSIGNED_SHORT;if(i===Du)return n.INT;if(i===pr)return n.UNSIGNED_INT;if(i===hi)return n.FLOAT;if(i===ha)return n.HALF_FLOAT;if(i===_p)return n.ALPHA;if(i===bp)return n.RGB;if(i===St)return n.RGBA;if(i===wp)return n.LUMINANCE;if(i===Sp)return n.LUMINANCE_ALPHA;if(i===es)return n.DEPTH_COMPONENT;if(i===fs)return n.DEPTH_STENCIL;if(i===Mp)return n.RED;if(i===Uu)return n.RED_INTEGER;if(i===Ep)return n.RG;if(i===Fu)return n.RG_INTEGER;if(i===Nu)return n.RGBA_INTEGER;if(i===co||i===uo||i===ho||i===fo)if(a===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===co)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===uo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ho)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===fo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===co)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===uo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ho)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===fo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ac||i===Cc||i===Rc||i===Pc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ac)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Cc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Rc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Pc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Dc||i===Lc||i===Ic)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Dc||i===Lc)return a===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ic)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Uc||i===Fc||i===Nc||i===Bc||i===Oc||i===zc||i===kc||i===Vc||i===Gc||i===Hc||i===Wc||i===qc||i===Xc||i===$c)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Uc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Fc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Nc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Oc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===zc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===kc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Vc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Gc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Hc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Wc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Xc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===$c)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===po||i===Yc||i===jc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===po)return a===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Yc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===jc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Tp||i===Kc||i===Zc||i===Qc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===po)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Kc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Zc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Qc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ds?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Pb={type:"move"};class Xl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,i),u=this._getHandJoint(c,y);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),g=.02,p=.005;c.inputState.pinching&&f>g+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=g-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Pb)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Xr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Db=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Lb=`
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

}`;class Ib{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new ln,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Gt({vertexShader:Db,fragmentShader:Lb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Vt(new xs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ub extends yr{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,f=null,g=null,p=null;const y=new Ib,m=t.getContextAttributes();let u=null,v=null;const _=[],x=[],M=new Ee;let S=null;const E=new Dn;E.viewport=new xt;const C=new Dn;C.viewport=new xt;const w=[E,C],b=new Jg;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=_[X];return Z===void 0&&(Z=new Xl,_[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=_[X];return Z===void 0&&(Z=new Xl,_[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=_[X];return Z===void 0&&(Z=new Xl,_[X]=Z),Z.getHandSpace()};function N(X){const Z=x.indexOf(X.inputSource);if(Z===-1)return;const se=_[Z];se!==void 0&&(se.update(X.inputSource,X.frame,c||a),se.dispatchEvent({type:X.type,data:X.inputSource}))}function O(){r.removeEventListener("select",N),r.removeEventListener("selectstart",N),r.removeEventListener("selectend",N),r.removeEventListener("squeeze",N),r.removeEventListener("squeezestart",N),r.removeEventListener("squeezeend",N),r.removeEventListener("end",O),r.removeEventListener("inputsourceschange",H);for(let X=0;X<_.length;X++){const Z=x[X];Z!==null&&(x[X]=null,_[X].disconnect(Z))}R=null,I=null,y.reset(),e.setRenderTarget(u),g=null,f=null,d=null,r=null,v=null,ge.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return d},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",N),r.addEventListener("selectstart",N),r.addEventListener("selectend",N),r.addEventListener("squeeze",N),r.addEventListener("squeezestart",N),r.addEventListener("squeezeend",N),r.addEventListener("end",O),r.addEventListener("inputsourceschange",H),m.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(M),r.renderState.layers===void 0){const Z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(r,t,Z),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),v=new mr(g.framebufferWidth,g.framebufferHeight,{format:St,type:Lt,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Z=null,se=null,ee=null;m.depth&&(ee=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=m.stencil?fs:es,se=m.stencil?ds:pr);const de={colorFormat:t.RGBA8,depthFormat:ee,scaleFactor:s};d=new XRWebGLBinding(r,t),f=d.createProjectionLayer(de),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new mr(f.textureWidth,f.textureHeight,{format:St,type:Lt,depthTexture:new Gp(f.textureWidth,f.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ge.setContext(r),ge.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function H(X){for(let Z=0;Z<X.removed.length;Z++){const se=X.removed[Z],ee=x.indexOf(se);ee>=0&&(x[ee]=null,_[ee].disconnect(se))}for(let Z=0;Z<X.added.length;Z++){const se=X.added[Z];let ee=x.indexOf(se);if(ee===-1){for(let xe=0;xe<_.length;xe++)if(xe>=x.length){x.push(se),ee=xe;break}else if(x[xe]===null){x[xe]=se,ee=xe;break}if(ee===-1)break}const de=_[ee];de&&de.connect(se)}}const k=new D,q=new D;function z(X,Z,se){k.setFromMatrixPosition(Z.matrixWorld),q.setFromMatrixPosition(se.matrixWorld);const ee=k.distanceTo(q),de=Z.projectionMatrix.elements,xe=se.projectionMatrix.elements,Ue=de[14]/(de[10]-1),lt=de[14]/(de[10]+1),je=(de[9]+1)/de[5],yt=(de[9]-1)/de[5],L=(de[8]-1)/de[0],Tn=(xe[8]+1)/xe[0],Xe=Ue*L,$e=Ue*Tn,Ce=ee/(-L+Tn),ht=Ce*-L;if(Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(ht),X.translateZ(Ce),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),de[10]===-1)X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Re=Ue+Ce,P=lt+Ce,T=Xe-ht,V=$e+(ee-ht),Q=je*lt/P*Re,te=yt*lt/P*Re;X.projectionMatrix.makePerspective(T,V,Q,te,Re,P),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function $(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let Z=X.near,se=X.far;y.texture!==null&&(y.depthNear>0&&(Z=y.depthNear),y.depthFar>0&&(se=y.depthFar)),b.near=C.near=E.near=Z,b.far=C.far=E.far=se,(R!==b.near||I!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),R=b.near,I=b.far),E.layers.mask=X.layers.mask|2,C.layers.mask=X.layers.mask|4,b.layers.mask=E.layers.mask|C.layers.mask;const ee=X.parent,de=b.cameras;$(b,ee);for(let xe=0;xe<de.length;xe++)$(de[xe],ee);de.length===2?z(b,E,C):b.projectionMatrix.copy(E.projectionMatrix),ne(X,b,ee)};function ne(X,Z,se){se===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(se.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ra*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&g===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=X)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(b)};let re=null;function he(X,Z){if(h=Z.getViewerPose(c||a),p=Z,h!==null){const se=h.views;g!==null&&(e.setRenderTargetFramebuffer(v,g.framebuffer),e.setRenderTarget(v));let ee=!1;se.length!==b.cameras.length&&(b.cameras.length=0,ee=!0);for(let xe=0;xe<se.length;xe++){const Ue=se[xe];let lt=null;if(g!==null)lt=g.getViewport(Ue);else{const yt=d.getViewSubImage(f,Ue);lt=yt.viewport,xe===0&&(e.setRenderTargetTextures(v,yt.colorTexture,f.ignoreDepthValues?void 0:yt.depthStencilTexture),e.setRenderTarget(v))}let je=w[xe];je===void 0&&(je=new Dn,je.layers.enable(xe),je.viewport=new xt,w[xe]=je),je.matrix.fromArray(Ue.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(Ue.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(lt.x,lt.y,lt.width,lt.height),xe===0&&(b.matrix.copy(je.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ee===!0&&b.cameras.push(je)}const de=r.enabledFeatures;if(de&&de.includes("depth-sensing")){const xe=d.getDepthInformation(se[0]);xe&&xe.isValid&&xe.texture&&y.init(e,xe,r.renderState)}}for(let se=0;se<_.length;se++){const ee=x[se],de=_[se];ee!==null&&de!==void 0&&de.update(ee,Z,c||a)}re&&re(X,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),p=null}const ge=new Xp;ge.setAnimationLoop(he),this.setAnimationLoop=function(X){re=X},this.dispose=function(){}}}const ir=new Xn,Fb=new ot;function Nb(n,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,Fp(n)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,v,_,x){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),d(m,u)):u.isMeshPhongMaterial?(s(m,u),h(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&g(m,u,x)):u.isMeshMatcapMaterial?(s(m,u),p(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),y(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,v,_):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===on&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===on&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const v=e.get(u),_=v.envMap,x=v.envMapRotation;_&&(m.envMap.value=_,ir.copy(x),ir.x*=-1,ir.y*=-1,ir.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(ir.y*=-1,ir.z*=-1),m.envMapRotation.value.setFromMatrix4(Fb.makeRotationFromEuler(ir)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,v,_){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*v,m.scale.value=_*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function d(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function g(m,u,v){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===on&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,u){u.matcap&&(m.matcap.value=u.matcap)}function y(m,u){const v=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Bb(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,_){const x=_.program;i.uniformBlockBinding(v,x)}function c(v,_){let x=r[v.id];x===void 0&&(p(v),x=h(v),r[v.id]=x,v.addEventListener("dispose",m));const M=_.program;i.updateUBOMapping(v,M);const S=e.render.frame;s[v.id]!==S&&(f(v),s[v.id]=S)}function h(v){const _=d();v.__bindingPointIndex=_;const x=n.createBuffer(),M=v.__size,S=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,M,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const _=r[v.id],x=v.uniforms,M=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let S=0,E=x.length;S<E;S++){const C=Array.isArray(x[S])?x[S]:[x[S]];for(let w=0,b=C.length;w<b;w++){const R=C[w];if(g(R,S,w,M)===!0){const I=R.__offset,N=Array.isArray(R.value)?R.value:[R.value];let O=0;for(let H=0;H<N.length;H++){const k=N[H],q=y(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,I+O,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,O),O+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function g(v,_,x,M){const S=v.value,E=_+"_"+x;if(M[E]===void 0)return typeof S=="number"||typeof S=="boolean"?M[E]=S:M[E]=S.clone(),!0;{const C=M[E];if(typeof S=="number"||typeof S=="boolean"){if(C!==S)return M[E]=S,!0}else if(C.equals(S)===!1)return C.copy(S),!0}return!1}function p(v){const _=v.uniforms;let x=0;const M=16;for(let E=0,C=_.length;E<C;E++){const w=Array.isArray(_[E])?_[E]:[_[E]];for(let b=0,R=w.length;b<R;b++){const I=w[b],N=Array.isArray(I.value)?I.value:[I.value];for(let O=0,H=N.length;O<H;O++){const k=N[O],q=y(k),z=x%M,$=z%q.boundary,ne=z+$;x+=$,ne!==0&&M-ne<q.storage&&(x+=M-ne),I.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=x,x+=q.storage}}}const S=x%M;return S>0&&(x+=M-S),v.__size=x,v.__cache={},this}function y(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),_}function m(v){const _=v.target;_.removeEventListener("dispose",m);const x=a.indexOf(_.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function u(){for(const v in r)n.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class $l{constructor(e={}){const{canvas:t=dg(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const p=new Uint32Array(4),y=new Int32Array(4);let m=null,u=null;const v=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bn,this.toneMapping=Ni,this.toneMappingExposure=1;const x=this;let M=!1,S=0,E=0,C=null,w=-1,b=null;const R=new xt,I=new xt;let N=null;const O=new Se(0);let H=0,k=t.width,q=t.height,z=1,$=null,ne=null;const re=new xt(0,0,k,q),he=new xt(0,0,k,q);let ge=!1;const X=new Vu;let Z=!1,se=!1;const ee=new ot,de=new ot,xe=new D,Ue=new xt,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function yt(){return C===null?z:1}let L=i;function Tn(A,F){return t.getContext(A,F)}try{const A={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ru}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",pe,!1),L===null){const F="webgl2";if(L=Tn(F,A),L===null)throw Tn(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Xe,$e,Ce,ht,Re,P,T,V,Q,te,K,Te,fe,ye,Ke,ae,_e,Le,Ne,be,Ye,ke,ut,U;function ce(){Xe=new $y(L),Xe.init(),ke=new Rb(L,Xe),$e=new Vy(L,Xe,e,ke),Ce=new Ab(L,Xe),$e.reverseDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),ht=new Ky(L),Re=new pb,P=new Cb(L,Xe,Ce,Re,$e,ke,ht),T=new Hy(x),V=new Xy(x),Q=new iv(L),ut=new zy(L,Q),te=new Yy(L,Q,ht,ut),K=new Qy(L,te,Q,ht),Ne=new Zy(L,$e,P),ae=new Gy(Re),Te=new fb(x,T,V,Xe,$e,ut,ae),fe=new Nb(x,Re),ye=new gb,Ke=new wb(Xe),Le=new Oy(x,T,V,Ce,K,g,l),_e=new Eb(x,K,$e),U=new Bb(L,ht,$e,Ce),be=new ky(L,Xe,ht),Ye=new jy(L,Xe,ht),ht.programs=Te.programs,x.capabilities=$e,x.extensions=Xe,x.properties=Re,x.renderLists=ye,x.shadowMap=_e,x.state=Ce,x.info=ht}ce();const Y=new Ub(x,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const A=Xe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Xe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(A){A!==void 0&&(z=A,this.setSize(k,q,!1))},this.getSize=function(A){return A.set(k,q)},this.setSize=function(A,F,G=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=A,q=F,t.width=Math.floor(A*z),t.height=Math.floor(F*z),G===!0&&(t.style.width=A+"px",t.style.height=F+"px"),this.setViewport(0,0,A,F)},this.getDrawingBufferSize=function(A){return A.set(k*z,q*z).floor()},this.setDrawingBufferSize=function(A,F,G){k=A,q=F,z=G,t.width=Math.floor(A*G),t.height=Math.floor(F*G),this.setViewport(0,0,A,F)},this.getCurrentViewport=function(A){return A.copy(R)},this.getViewport=function(A){return A.copy(re)},this.setViewport=function(A,F,G,W){A.isVector4?re.set(A.x,A.y,A.z,A.w):re.set(A,F,G,W),Ce.viewport(R.copy(re).multiplyScalar(z).round())},this.getScissor=function(A){return A.copy(he)},this.setScissor=function(A,F,G,W){A.isVector4?he.set(A.x,A.y,A.z,A.w):he.set(A,F,G,W),Ce.scissor(I.copy(he).multiplyScalar(z).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(A){Ce.setScissorTest(ge=A)},this.setOpaqueSort=function(A){$=A},this.setTransparentSort=function(A){ne=A},this.getClearColor=function(A){return A.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(A=!0,F=!0,G=!0){let W=0;if(A){let B=!1;if(C!==null){const ie=C.texture.format;B=ie===Nu||ie===Fu||ie===Uu}if(B){const ie=C.texture.type,ue=ie===Lt||ie===pr||ie===ia||ie===ds||ie===Lu||ie===Iu,ve=Le.getClearColor(),we=Le.getClearAlpha(),Be=ve.r,Oe=ve.g,Pe=ve.b;ue?(p[0]=Be,p[1]=Oe,p[2]=Pe,p[3]=we,L.clearBufferuiv(L.COLOR,0,p)):(y[0]=Be,y[1]=Oe,y[2]=Pe,y[3]=we,L.clearBufferiv(L.COLOR,0,y))}else W|=L.COLOR_BUFFER_BIT}F&&(W|=L.DEPTH_BUFFER_BIT),G&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),Le.dispose(),ye.dispose(),Ke.dispose(),Re.dispose(),T.dispose(),V.dispose(),K.dispose(),ut.dispose(),U.dispose(),Te.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",bh),Y.removeEventListener("sessionend",wh),Ki.stop()};function J(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const A=ht.autoReset,F=_e.enabled,G=_e.autoUpdate,W=_e.needsUpdate,B=_e.type;ce(),ht.autoReset=A,_e.enabled=F,_e.autoUpdate=G,_e.needsUpdate=W,_e.type=B}function pe(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ze(A){const F=A.target;F.removeEventListener("dispose",ze),mt(F)}function mt(A){Xt(A),Re.remove(A)}function Xt(A){const F=Re.get(A).programs;F!==void 0&&(F.forEach(function(G){Te.releaseProgram(G)}),A.isShaderMaterial&&Te.releaseShaderCache(A))}this.renderBufferDirect=function(A,F,G,W,B,ie){F===null&&(F=lt);const ue=B.isMesh&&B.matrixWorld.determinant()<0,ve=i0(A,F,G,W,B);Ce.setMaterial(W,ue);let we=G.index,Be=1;if(W.wireframe===!0){if(we=te.getWireframeAttribute(G),we===void 0)return;Be=2}const Oe=G.drawRange,Pe=G.attributes.position;let Ze=Oe.start*Be,tt=(Oe.start+Oe.count)*Be;ie!==null&&(Ze=Math.max(Ze,ie.start*Be),tt=Math.min(tt,(ie.start+ie.count)*Be)),we!==null?(Ze=Math.max(Ze,0),tt=Math.min(tt,we.count)):Pe!=null&&(Ze=Math.max(Ze,0),tt=Math.min(tt,Pe.count));const At=tt-Ze;if(At<0||At===1/0)return;ut.setup(B,W,ve,G,we);let gt,Qe=be;if(we!==null&&(gt=Q.get(we),Qe=Ye,Qe.setIndex(gt)),B.isMesh)W.wireframe===!0?(Ce.setLineWidth(W.wireframeLinewidth*yt()),Qe.setMode(L.LINES)):Qe.setMode(L.TRIANGLES);else if(B.isLine){let De=W.linewidth;De===void 0&&(De=1),Ce.setLineWidth(De*yt()),B.isLineSegments?Qe.setMode(L.LINES):B.isLineLoop?Qe.setMode(L.LINE_LOOP):Qe.setMode(L.LINE_STRIP)}else B.isPoints?Qe.setMode(L.POINTS):B.isSprite&&Qe.setMode(L.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Qe.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))Qe.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const De=B._multiDrawStarts,Ot=B._multiDrawCounts,nt=B._multiDrawCount,Nn=we?Q.get(we).bytesPerElement:1,br=Re.get(W).currentProgram.getUniforms();for(let vn=0;vn<nt;vn++)br.setValue(L,"_gl_DrawID",vn),Qe.render(De[vn]/Nn,Ot[vn])}else if(B.isInstancedMesh)Qe.renderInstances(Ze,At,B.count);else if(G.isInstancedBufferGeometry){const De=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ot=Math.min(G.instanceCount,De);Qe.renderInstances(Ze,At,Ot)}else Qe.render(Ze,At)};function rt(A,F,G){A.transparent===!0&&A.side===Ln&&A.forceSinglePass===!1?(A.side=on,A.needsUpdate=!0,ba(A,F,G),A.side=Mn,A.needsUpdate=!0,ba(A,F,G),A.side=Ln):ba(A,F,G)}this.compile=function(A,F,G=null){G===null&&(G=A),u=Ke.get(G),u.init(F),_.push(u),G.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),A!==G&&A.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),u.setupLights();const W=new Set;return A.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ie=B.material;if(ie)if(Array.isArray(ie))for(let ue=0;ue<ie.length;ue++){const ve=ie[ue];rt(ve,G,B),W.add(ve)}else rt(ie,G,B),W.add(ie)}),_.pop(),u=null,W},this.compileAsync=function(A,F,G=null){const W=this.compile(A,F,G);return new Promise(B=>{function ie(){if(W.forEach(function(ue){Re.get(ue).currentProgram.isReady()&&W.delete(ue)}),W.size===0){B(A);return}setTimeout(ie,10)}Xe.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Fn=null;function ti(A){Fn&&Fn(A)}function bh(){Ki.stop()}function wh(){Ki.start()}const Ki=new Xp;Ki.setAnimationLoop(ti),typeof self<"u"&&Ki.setContext(self),this.setAnimationLoop=function(A){Fn=A,Y.setAnimationLoop(A),A===null?Ki.stop():Ki.start()},Y.addEventListener("sessionstart",bh),Y.addEventListener("sessionend",wh),this.render=function(A,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(F),F=Y.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,F,C),u=Ke.get(A,_.length),u.init(F),_.push(u),de.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),X.setFromProjectionMatrix(de),se=this.localClippingEnabled,Z=ae.init(this.clippingPlanes,se),m=ye.get(A,v.length),m.init(),v.push(m),Y.enabled===!0&&Y.isPresenting===!0){const ie=x.xr.getDepthSensingMesh();ie!==null&&pl(ie,F,-1/0,x.sortObjects)}pl(A,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort($,ne),je=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,je&&Le.addToRenderList(m,A),this.info.render.frame++,Z===!0&&ae.beginShadows();const G=u.state.shadowsArray;_e.render(G,A,F),Z===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,B=m.transmissive;if(u.setupLights(),F.isArrayCamera){const ie=F.cameras;if(B.length>0)for(let ue=0,ve=ie.length;ue<ve;ue++){const we=ie[ue];Mh(W,B,A,we)}je&&Le.render(A);for(let ue=0,ve=ie.length;ue<ve;ue++){const we=ie[ue];Sh(m,A,we,we.viewport)}}else B.length>0&&Mh(W,B,A,F),je&&Le.render(A),Sh(m,A,F);C!==null&&(P.updateMultisampleRenderTarget(C),P.updateRenderTargetMipmap(C)),A.isScene===!0&&A.onAfterRender(x,A,F),ut.resetDefaultState(),w=-1,b=null,_.pop(),_.length>0?(u=_[_.length-1],Z===!0&&ae.setGlobalState(x.clippingPlanes,u.state.camera)):u=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function pl(A,F,G,W){if(A.visible===!1)return;if(A.layers.test(F.layers)){if(A.isGroup)G=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(F);else if(A.isLight)u.pushLight(A),A.castShadow&&u.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||X.intersectsSprite(A)){W&&Ue.setFromMatrixPosition(A.matrixWorld).applyMatrix4(de);const ue=K.update(A),ve=A.material;ve.visible&&m.push(A,ue,ve,G,Ue.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||X.intersectsObject(A))){const ue=K.update(A),ve=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ue.copy(A.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Ue.copy(ue.boundingSphere.center)),Ue.applyMatrix4(A.matrixWorld).applyMatrix4(de)),Array.isArray(ve)){const we=ue.groups;for(let Be=0,Oe=we.length;Be<Oe;Be++){const Pe=we[Be],Ze=ve[Pe.materialIndex];Ze&&Ze.visible&&m.push(A,ue,Ze,G,Ue.z,Pe)}}else ve.visible&&m.push(A,ue,ve,G,Ue.z,null)}}const ie=A.children;for(let ue=0,ve=ie.length;ue<ve;ue++)pl(ie[ue],F,G,W)}function Sh(A,F,G,W){const B=A.opaque,ie=A.transmissive,ue=A.transparent;u.setupLightsView(G),Z===!0&&ae.setGlobalState(x.clippingPlanes,G),W&&Ce.viewport(R.copy(W)),B.length>0&&_a(B,F,G),ie.length>0&&_a(ie,F,G),ue.length>0&&_a(ue,F,G),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Mh(A,F,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[W.id]===void 0&&(u.state.transmissionRenderTarget[W.id]=new mr(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?ha:Lt,minFilter:cr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const ie=u.state.transmissionRenderTarget[W.id],ue=W.viewport||R;ie.setSize(ue.z,ue.w);const ve=x.getRenderTarget();x.setRenderTarget(ie),x.getClearColor(O),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),je&&Le.render(G);const we=x.toneMapping;x.toneMapping=Ni;const Be=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),u.setupLightsView(W),Z===!0&&ae.setGlobalState(x.clippingPlanes,W),_a(A,G,W),P.updateMultisampleRenderTarget(ie),P.updateRenderTargetMipmap(ie),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Pe=0,Ze=F.length;Pe<Ze;Pe++){const tt=F[Pe],At=tt.object,gt=tt.geometry,Qe=tt.material,De=tt.group;if(Qe.side===Ln&&At.layers.test(W.layers)){const Ot=Qe.side;Qe.side=on,Qe.needsUpdate=!0,Eh(At,G,W,gt,Qe,De),Qe.side=Ot,Qe.needsUpdate=!0,Oe=!0}}Oe===!0&&(P.updateMultisampleRenderTarget(ie),P.updateRenderTargetMipmap(ie))}x.setRenderTarget(ve),x.setClearColor(O,H),Be!==void 0&&(W.viewport=Be),x.toneMapping=we}function _a(A,F,G){const W=F.isScene===!0?F.overrideMaterial:null;for(let B=0,ie=A.length;B<ie;B++){const ue=A[B],ve=ue.object,we=ue.geometry,Be=W===null?ue.material:W,Oe=ue.group;ve.layers.test(G.layers)&&Eh(ve,F,G,we,Be,Oe)}}function Eh(A,F,G,W,B,ie){A.onBeforeRender(x,F,G,W,B,ie),A.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),B.onBeforeRender(x,F,G,W,A,ie),B.transparent===!0&&B.side===Ln&&B.forceSinglePass===!1?(B.side=on,B.needsUpdate=!0,x.renderBufferDirect(G,F,W,B,A,ie),B.side=Mn,B.needsUpdate=!0,x.renderBufferDirect(G,F,W,B,A,ie),B.side=Ln):x.renderBufferDirect(G,F,W,B,A,ie),A.onAfterRender(x,F,G,W,B,ie)}function ba(A,F,G){F.isScene!==!0&&(F=lt);const W=Re.get(A),B=u.state.lights,ie=u.state.shadowsArray,ue=B.state.version,ve=Te.getParameters(A,B.state,ie,F,G),we=Te.getProgramCacheKey(ve);let Be=W.programs;W.environment=A.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(A.isMeshStandardMaterial?V:T).get(A.envMap||W.environment),W.envMapRotation=W.environment!==null&&A.envMap===null?F.environmentRotation:A.envMapRotation,Be===void 0&&(A.addEventListener("dispose",ze),Be=new Map,W.programs=Be);let Oe=Be.get(we);if(Oe!==void 0){if(W.currentProgram===Oe&&W.lightsStateVersion===ue)return Ah(A,ve),Oe}else ve.uniforms=Te.getUniforms(A),A.onBeforeCompile(ve,x),Oe=Te.acquireProgram(ve,we),Be.set(we,Oe),W.uniforms=ve.uniforms;const Pe=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Pe.clippingPlanes=ae.uniform),Ah(A,ve),W.needsLights=s0(A),W.lightsStateVersion=ue,W.needsLights&&(Pe.ambientLightColor.value=B.state.ambient,Pe.lightProbe.value=B.state.probe,Pe.directionalLights.value=B.state.directional,Pe.directionalLightShadows.value=B.state.directionalShadow,Pe.spotLights.value=B.state.spot,Pe.spotLightShadows.value=B.state.spotShadow,Pe.rectAreaLights.value=B.state.rectArea,Pe.ltc_1.value=B.state.rectAreaLTC1,Pe.ltc_2.value=B.state.rectAreaLTC2,Pe.pointLights.value=B.state.point,Pe.pointLightShadows.value=B.state.pointShadow,Pe.hemisphereLights.value=B.state.hemi,Pe.directionalShadowMap.value=B.state.directionalShadowMap,Pe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Pe.spotShadowMap.value=B.state.spotShadowMap,Pe.spotLightMatrix.value=B.state.spotLightMatrix,Pe.spotLightMap.value=B.state.spotLightMap,Pe.pointShadowMap.value=B.state.pointShadowMap,Pe.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=Oe,W.uniformsList=null,Oe}function Th(A){if(A.uniformsList===null){const F=A.currentProgram.getUniforms();A.uniformsList=mo.seqWithValue(F.seq,A.uniforms)}return A.uniformsList}function Ah(A,F){const G=Re.get(A);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function i0(A,F,G,W,B){F.isScene!==!0&&(F=lt),P.resetTextureUnits();const ie=F.fog,ue=W.isMeshStandardMaterial?F.environment:null,ve=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ps,we=(W.isMeshStandardMaterial?V:T).get(W.envMap||ue),Be=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Oe=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pe=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,tt=!!G.morphAttributes.color;let At=Ni;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(At=x.toneMapping);const gt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Qe=gt!==void 0?gt.length:0,De=Re.get(W),Ot=u.state.lights;if(Z===!0&&(se===!0||A!==b)){const en=A===b&&W.id===w;ae.setState(W,A,en)}let nt=!1;W.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Ot.state.version||De.outputColorSpace!==ve||B.isBatchedMesh&&De.batching===!1||!B.isBatchedMesh&&De.batching===!0||B.isBatchedMesh&&De.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&De.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&De.instancing===!1||!B.isInstancedMesh&&De.instancing===!0||B.isSkinnedMesh&&De.skinning===!1||!B.isSkinnedMesh&&De.skinning===!0||B.isInstancedMesh&&De.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&De.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&De.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&De.instancingMorph===!1&&B.morphTexture!==null||De.envMap!==we||W.fog===!0&&De.fog!==ie||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ae.numPlanes||De.numIntersection!==ae.numIntersection)||De.vertexAlphas!==Be||De.vertexTangents!==Oe||De.morphTargets!==Pe||De.morphNormals!==Ze||De.morphColors!==tt||De.toneMapping!==At||De.morphTargetsCount!==Qe)&&(nt=!0):(nt=!0,De.__version=W.version);let Nn=De.currentProgram;nt===!0&&(Nn=ba(W,F,B));let br=!1,vn=!1,bs=!1;const dt=Nn.getUniforms(),An=De.uniforms;if(Ce.useProgram(Nn.program)&&(br=!0,vn=!0,bs=!0),W.id!==w&&(w=W.id,vn=!0),br||b!==A){Ce.buffers.depth.getReversed()?(ee.copy(A.projectionMatrix),pg(ee),mg(ee),dt.setValue(L,"projectionMatrix",ee)):dt.setValue(L,"projectionMatrix",A.projectionMatrix),dt.setValue(L,"viewMatrix",A.matrixWorldInverse);const fn=dt.map.cameraPosition;fn!==void 0&&fn.setValue(L,xe.setFromMatrixPosition(A.matrixWorld)),$e.logarithmicDepthBuffer&&dt.setValue(L,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&dt.setValue(L,"isOrthographic",A.isOrthographicCamera===!0),b!==A&&(b=A,vn=!0,bs=!0)}if(B.isSkinnedMesh){dt.setOptional(L,B,"bindMatrix"),dt.setOptional(L,B,"bindMatrixInverse");const en=B.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),dt.setValue(L,"boneTexture",en.boneTexture,P))}B.isBatchedMesh&&(dt.setOptional(L,B,"batchingTexture"),dt.setValue(L,"batchingTexture",B._matricesTexture,P),dt.setOptional(L,B,"batchingIdTexture"),dt.setValue(L,"batchingIdTexture",B._indirectTexture,P),dt.setOptional(L,B,"batchingColorTexture"),B._colorsTexture!==null&&dt.setValue(L,"batchingColorTexture",B._colorsTexture,P));const Cn=G.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&Ne.update(B,G,Nn),(vn||De.receiveShadow!==B.receiveShadow)&&(De.receiveShadow=B.receiveShadow,dt.setValue(L,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(An.envMap.value=we,An.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(An.envMapIntensity.value=F.environmentIntensity),vn&&(dt.setValue(L,"toneMappingExposure",x.toneMappingExposure),De.needsLights&&r0(An,bs),ie&&W.fog===!0&&fe.refreshFogUniforms(An,ie),fe.refreshMaterialUniforms(An,W,z,q,u.state.transmissionRenderTarget[A.id]),mo.upload(L,Th(De),An,P)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(mo.upload(L,Th(De),An,P),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&dt.setValue(L,"center",B.center),dt.setValue(L,"modelViewMatrix",B.modelViewMatrix),dt.setValue(L,"normalMatrix",B.normalMatrix),dt.setValue(L,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const en=W.uniformsGroups;for(let fn=0,ml=en.length;fn<ml;fn++){const Zi=en[fn];U.update(Zi,Nn),U.bind(Zi,Nn)}}return Nn}function r0(A,F){A.ambientLightColor.needsUpdate=F,A.lightProbe.needsUpdate=F,A.directionalLights.needsUpdate=F,A.directionalLightShadows.needsUpdate=F,A.pointLights.needsUpdate=F,A.pointLightShadows.needsUpdate=F,A.spotLights.needsUpdate=F,A.spotLightShadows.needsUpdate=F,A.rectAreaLights.needsUpdate=F,A.hemisphereLights.needsUpdate=F}function s0(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(A,F,G){Re.get(A.texture).__webglTexture=F,Re.get(A.depthTexture).__webglTexture=G;const W=Re.get(A);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,F){const G=Re.get(A);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(A,F=0,G=0){C=A,S=F,E=G;let W=!0,B=null,ie=!1,ue=!1;if(A){const we=Re.get(A);if(we.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(L.FRAMEBUFFER,null),W=!1;else if(we.__webglFramebuffer===void 0)P.setupRenderTarget(A);else if(we.__hasExternalTextures)P.rebindTextures(A,Re.get(A.texture).__webglTexture,Re.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Pe=A.depthTexture;if(we.__boundDepthTexture!==Pe){if(Pe!==null&&Re.has(Pe)&&(A.width!==Pe.image.width||A.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(A)}}const Be=A.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(ue=!0);const Oe=Re.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Oe[F])?B=Oe[F][G]:B=Oe[F],ie=!0):A.samples>0&&P.useMultisampledRTT(A)===!1?B=Re.get(A).__webglMultisampledFramebuffer:Array.isArray(Oe)?B=Oe[G]:B=Oe,R.copy(A.viewport),I.copy(A.scissor),N=A.scissorTest}else R.copy(re).multiplyScalar(z).floor(),I.copy(he).multiplyScalar(z).floor(),N=ge;if(Ce.bindFramebuffer(L.FRAMEBUFFER,B)&&W&&Ce.drawBuffers(A,B),Ce.viewport(R),Ce.scissor(I),Ce.setScissorTest(N),ie){const we=Re.get(A.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,we.__webglTexture,G)}else if(ue){const we=Re.get(A.texture),Be=F||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,we.__webglTexture,G||0,Be)}w=-1},this.readRenderTargetPixels=function(A,F,G,W,B,ie,ue){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=Re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ue!==void 0&&(ve=ve[ue]),ve){Ce.bindFramebuffer(L.FRAMEBUFFER,ve);try{const we=A.texture,Be=we.format,Oe=we.type;if(!$e.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=A.width-W&&G>=0&&G<=A.height-B&&L.readPixels(F,G,W,B,ke.convert(Be),ke.convert(Oe),ie)}finally{const we=C!==null?Re.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(L.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(A,F,G,W,B,ie,ue){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=Re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ue!==void 0&&(ve=ve[ue]),ve){const we=A.texture,Be=we.format,Oe=we.type;if(!$e.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=A.width-W&&G>=0&&G<=A.height-B){Ce.bindFramebuffer(L.FRAMEBUFFER,ve);const Pe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Pe),L.bufferData(L.PIXEL_PACK_BUFFER,ie.byteLength,L.STREAM_READ),L.readPixels(F,G,W,B,ke.convert(Be),ke.convert(Oe),0);const Ze=C!==null?Re.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(L.FRAMEBUFFER,Ze);const tt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await fg(L,tt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Pe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ie),L.deleteBuffer(Pe),L.deleteSync(tt),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(A,F=null,G=0){A.isTexture!==!0&&(Wr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,A=arguments[1]);const W=Math.pow(2,-G),B=Math.floor(A.image.width*W),ie=Math.floor(A.image.height*W),ue=F!==null?F.x:0,ve=F!==null?F.y:0;P.setTexture2D(A,0),L.copyTexSubImage2D(L.TEXTURE_2D,G,0,0,ue,ve,B,ie),Ce.unbindTexture()};const a0=L.createFramebuffer(),o0=L.createFramebuffer();this.copyTextureToTexture=function(A,F,G=null,W=null,B=0,ie=null){A.isTexture!==!0&&(Wr("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,A=arguments[1],F=arguments[2],ie=arguments[3]||0,G=null),ie===null&&(B!==0?(Wr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=B,B=0):ie=0);let ue,ve,we,Be,Oe,Pe,Ze,tt,At;const gt=A.isCompressedTexture?A.mipmaps[ie]:A.image;if(G!==null)ue=G.max.x-G.min.x,ve=G.max.y-G.min.y,we=G.isBox3?G.max.z-G.min.z:1,Be=G.min.x,Oe=G.min.y,Pe=G.isBox3?G.min.z:0;else{const Cn=Math.pow(2,-B);ue=Math.floor(gt.width*Cn),ve=Math.floor(gt.height*Cn),A.isDataArrayTexture?we=gt.depth:A.isData3DTexture?we=Math.floor(gt.depth*Cn):we=1,Be=0,Oe=0,Pe=0}W!==null?(Ze=W.x,tt=W.y,At=W.z):(Ze=0,tt=0,At=0);const Qe=ke.convert(F.format),De=ke.convert(F.type);let Ot;F.isData3DTexture?(P.setTexture3D(F,0),Ot=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(P.setTexture2DArray(F,0),Ot=L.TEXTURE_2D_ARRAY):(P.setTexture2D(F,0),Ot=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const nt=L.getParameter(L.UNPACK_ROW_LENGTH),Nn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),br=L.getParameter(L.UNPACK_SKIP_PIXELS),vn=L.getParameter(L.UNPACK_SKIP_ROWS),bs=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Be),L.pixelStorei(L.UNPACK_SKIP_ROWS,Oe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Pe);const dt=A.isDataArrayTexture||A.isData3DTexture,An=F.isDataArrayTexture||F.isData3DTexture;if(A.isDepthTexture){const Cn=Re.get(A),en=Re.get(F),fn=Re.get(Cn.__renderTarget),ml=Re.get(en.__renderTarget);Ce.bindFramebuffer(L.READ_FRAMEBUFFER,fn.__webglFramebuffer),Ce.bindFramebuffer(L.DRAW_FRAMEBUFFER,ml.__webglFramebuffer);for(let Zi=0;Zi<we;Zi++)dt&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Re.get(A).__webglTexture,B,Pe+Zi),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Re.get(F).__webglTexture,ie,At+Zi)),L.blitFramebuffer(Be,Oe,ue,ve,Ze,tt,ue,ve,L.DEPTH_BUFFER_BIT,L.NEAREST);Ce.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(B!==0||A.isRenderTargetTexture||Re.has(A)){const Cn=Re.get(A),en=Re.get(F);Ce.bindFramebuffer(L.READ_FRAMEBUFFER,a0),Ce.bindFramebuffer(L.DRAW_FRAMEBUFFER,o0);for(let fn=0;fn<we;fn++)dt?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Cn.__webglTexture,B,Pe+fn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Cn.__webglTexture,B),An?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,en.__webglTexture,ie,At+fn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,en.__webglTexture,ie),B!==0?L.blitFramebuffer(Be,Oe,ue,ve,Ze,tt,ue,ve,L.COLOR_BUFFER_BIT,L.NEAREST):An?L.copyTexSubImage3D(Ot,ie,Ze,tt,At+fn,Be,Oe,ue,ve):L.copyTexSubImage2D(Ot,ie,Ze,tt,Be,Oe,ue,ve);Ce.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else An?A.isDataTexture||A.isData3DTexture?L.texSubImage3D(Ot,ie,Ze,tt,At,ue,ve,we,Qe,De,gt.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(Ot,ie,Ze,tt,At,ue,ve,we,Qe,gt.data):L.texSubImage3D(Ot,ie,Ze,tt,At,ue,ve,we,Qe,De,gt):A.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ie,Ze,tt,ue,ve,Qe,De,gt.data):A.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ie,Ze,tt,gt.width,gt.height,Qe,gt.data):L.texSubImage2D(L.TEXTURE_2D,ie,Ze,tt,ue,ve,Qe,De,gt);L.pixelStorei(L.UNPACK_ROW_LENGTH,nt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Nn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,br),L.pixelStorei(L.UNPACK_SKIP_ROWS,vn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,bs),ie===0&&F.generateMipmaps&&L.generateMipmap(Ot),Ce.unbindTexture()},this.copyTextureToTexture3D=function(A,F,G=null,W=null,B=0){return A.isTexture!==!0&&(Wr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,A=arguments[2],F=arguments[3],B=arguments[4]||0),Wr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(A,F,G,W,B)},this.initRenderTarget=function(A){Re.get(A).__webglFramebuffer===void 0&&P.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),Ce.unbindTexture()},this.resetState=function(){S=0,E=0,C=null,Ce.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}const un=10,Bi=1e3,Zp=Bi*1e3*.5,Ob=2,zb=.74,kb=.9,Vb=.76,Gb=-2.4,Hb="#ffffff",Wb=256,qb=1,Xb=2,$b=1,Yb=1,jb=1,Kb=.75,Zb=.25,Qb=.9,Xu=1,$u=6,Jb=23.4,ew=0,tw=.25,No={fast:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:16,iceCap:.15,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",atmosphereEnabled:!0,cloudEnabled:!1,cloudAlpha:zb,cloudSpeed:kb,cloudQuantity:Vb,cloudHeight:Gb,cloudColor:Hb,cloudResolution:Wb,cloudShader:"billow",waterCycleEnabled:!0,waterCycleCloudEnabled:!0,waterCycleRun:!0,weatherAutoScale:!1,weatherSimMode:"3d",weatherVolumeRes:8,weatherRayStepsMin:4,weatherRayStepsMax:6,weatherRayBundle:8,weatherAtmoThickness:60,axialTilt:Jb,seasonProgress:ew,weatherDebug:"off",weatherSpeed:qb,weatherUpdateHz:1,weatherMoistureLayers:Xb,weatherEvap:$b,weatherPrecip:Yb,weatherWind:jb,weatherWetness:Kb,weatherOceanInertia:Zb,weatherOceanWindCoupling:Xu,weatherOceanWindUpdateHz:$u,weatherRainFxEnabled:!0,weatherRainFx:1,weatherRainHaze:Qb},balanced:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.12,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"mixed",weatherAutoScale:!0},high:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.15,plateDelta:1.25,plateSizeVariance:.45,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",weatherAutoScale:!0}};class nw{constructor(e,t,i,r,s=null){this.camera=e,this.domElement=t,this.scene=i,this.onExitCallback=r,this.externalInput=s,this.planetMesh=null,this.planetGroup=null,this.surfaceRay=new tu,this.planetRadius=un,this.walkSpeed=.5,this.runSpeed=1,this.flySpeed=4,this.swimSpeed=.25,this.jumpForce=3,this.gravity=30,this.playerHeight=.02,this.accelGround=32,this.accelAir=10,this.accelFly=14,this.accelSwim=10,this.frictionGround=9,this.stopSpeed=1.2,this.enabled=!1,this.isLocked=!1,this.isFlying=!1,this.isSwimming=!1,this.moveForward=!1,this.moveBackward=!1,this.moveLeft=!1,this.moveRight=!1,this.moveUp=!1,this.moveDown=!1,this.rollLeft=!1,this.rollRight=!1,this.lookUp=!1,this.lookDown=!1,this.lookLeft=!1,this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.jumpRequested=!1,this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0,this.velocity=new D,this.direction=new D,this.verticalVelocity=0,this.horizontalVelocity=new D,this.keyLookSpeed=1.8,this.keyRollSpeed=2.4,this.player=new Mt,this.player.name="TinyPlanetPlayer",this.raycaster=new tu,this.worldUp=new D,this.dummyVec=new D,this.dummyQuat=new qn,this.camLocalUp=new D,this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onPointerLockChange=this.onPointerLockChange.bind(this)}setPlanet(e){this.planetMesh=e}enter(e,t,i=null){if(this.enabled)return;this.enabled=!0,this.planetMesh=t,this.planetGroup=t.parent;const r=e.clone();this.planetMesh.worldToLocal(r);const s=r.normalize(),o=(i?i.getWorldDirection(new D):new D(0,0,-1)).clone().projectOnPlane(s).normalize(),l=o.lengthSq()>1e-6?o:this.basisEast(s);this.planetMesh.add(this.player);const c=r.length()+2;this.player.position.copy(s).multiplyScalar(c),this.alignToFrame(s,l),this.player.add(this.camera),this.camera.position.set(0,0,0),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0,this.isFlying=!1,this.horizontalVelocity.set(0,0,0),this.externalInput&&this.externalInput.setLookMode&&this.externalInput.setLookMode("surface"),!/Mobi|Android|iP(ad|hone|od)/i.test(navigator.userAgent||"")&&this.domElement.requestPointerLock&&this.domElement.requestPointerLock(),this.addListeners()}exit(){this.enabled&&(this.enabled=!1,this.removeListeners(),document.exitPointerLock(),this.player.remove(this.camera),this.scene.add(this.camera),this.player.parent&&this.player.parent.remove(this.player),this.onExitCallback&&this.onExitCallback(),this.externalInput&&(this.externalInput.clear(),this.externalInput.setLookMode&&this.externalInput.setLookMode("orbit")),this.moveForward=this.moveBackward=this.moveLeft=this.moveRight=!1,this.moveUp=this.moveDown=!1,this.rollLeft=this.rollRight=!1,this.lookUp=this.lookDown=this.lookLeft=this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.horizontalVelocity.set(0,0,0),this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0)}addListeners(){document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("pointerlockchange",this.onPointerLockChange)}removeListeners(){document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("pointerlockchange",this.onPointerLockChange)}onPointerLockChange(){this.isLocked=document.pointerLockElement===this.domElement,!this.isLocked&&this.enabled}onKeyDown(e){switch(e.code){case"ArrowUp":this.lookUp=!0,e.preventDefault();break;case"ArrowDown":this.lookDown=!0,e.preventDefault();break;case"ArrowLeft":this.lookLeft=!0,e.preventDefault();break;case"ArrowRight":this.lookRight=!0,e.preventDefault();break;case"KeyW":this.moveForward=!0;break;case"KeyA":this.moveLeft=!0;break;case"KeyS":this.moveBackward=!0;break;case"KeyD":this.moveRight=!0;break;case"Space":case"Numpad0":e.preventDefault(),this.isFlying?this.moveUp=!0:this.jumpRequested=!0;break;case"ControlLeft":case"ControlRight":case"KeyC":e.preventDefault(),this.moveDown=!0;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!0;break;case"KeyF":this.toggleFlight();break;case"KeyQ":this.rollLeft=!0;break;case"KeyE":this.rollRight=!0;break;case"Escape":this.exit();break}}onKeyUp(e){switch(e.code){case"ArrowUp":this.lookUp=!1;break;case"ArrowDown":this.lookDown=!1;break;case"ArrowLeft":this.lookLeft=!1;break;case"ArrowRight":this.lookRight=!1;break;case"KeyW":this.moveForward=!1;break;case"KeyA":this.moveLeft=!1;break;case"KeyS":this.moveBackward=!1;break;case"KeyD":this.moveRight=!1;break;case"Space":case"Numpad0":this.moveUp=!1;break;case"ControlLeft":case"ControlRight":case"KeyC":this.moveDown=!1;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!1;break;case"KeyQ":this.rollLeft=!1;break;case"KeyE":this.rollRight=!1;break}}onMouseMove(e){if(!this.isLocked)return;const t=e.movementX||0,i=e.movementY||0;if(this.isFlying){const r=new D(0,1,0).applyQuaternion(this.camera.quaternion);this.player.rotateOnAxis(r,-t*.002),this.camera.rotateX(-i*.002)}else this.player.rotateY(-t*.002),this.camera.rotateX(-i*.002),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}basisEast(e){const t=Math.abs(e.y)<.9?new D(0,1,0):new D(1,0,0),i=new D().crossVectors(t,e).normalize();return i.lengthSq()>1e-6?i:new D(1,0,0)}alignToFrame(e,t){const i=e.clone().normalize();let r=t.clone().projectOnPlane(i);r.lengthSq()<1e-6&&(r=this.basisEast(i)),r.normalize();const s=new D().crossVectors(r,i).normalize();r.crossVectors(i,s).normalize();const a=new ot().makeBasis(s,i,r.negate());this.player.quaternion.setFromRotationMatrix(a),this.player.up.copy(i)}toggleFlight(){if(this.isFlying=!this.isFlying,this.verticalVelocity=0,!this.isFlying){const e=this.player.position.clone().normalize(),t=new D(0,1,0),i=new qn().setFromUnitVectors(t,e);this.player.quaternion.copy(i),this.player.up.copy(e),this.camera.rotation.x=0,this.velocity.set(0,0,0)}}snapToSurface(){var d,f;if(!this.planetMesh||!((d=this.planetMesh.userData)!=null&&d.forge)||!((f=this.planetMesh.userData)!=null&&f.settings))return;const e=this.planetMesh.userData.forge,t=this.planetMesh.userData.settings;this.surfaceRay.setFromCamera(new Ee(0,0),this.camera);const i=this.surfaceRay.intersectObject(this.planetMesh,!1);if(!i.length)return;const s=i[0].point.clone().clone();this.planetMesh.worldToLocal(s);const a=s.normalize(),o=e.getHeightAt(a),l=t.radius+(o-t.seaLevel)*t.heightScale+this.playerHeight,c=a.clone().multiplyScalar(l+.2);this.player.position.copy(c);const h=new qn().setFromUnitVectors(new D(0,1,0),a);this.player.quaternion.copy(h),this.player.up.copy(a),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0}update(e){var _,x;if(!this.enabled)return;const t=Math.min(Math.max(e??0,0),.05),i=(x=(_=this.externalInput)==null?void 0:_.getState)==null?void 0:x.call(_),r=this.moveForward||!!(i!=null&&i.forward),s=this.moveBackward||!!(i!=null&&i.backward),a=this.moveLeft||!!(i!=null&&i.left),o=this.moveRight||!!(i!=null&&i.right);this.moveUp||i!=null&&i.up,this.moveDown||i!=null&&i.down;const l=this.isRunning||!!(i!=null&&i.run),c=this.rollLeft||!!(i!=null&&i.rollLeft),h=this.rollRight||!!(i!=null&&i.rollRight);if(this.externalInput){if(this.externalInput.consume("flyToggle")&&this.toggleFlight(),this.externalInput.consume("exit")){this.exit();return}this.externalInput.consume("surface")&&this.snapToSurface(),!this.isFlying&&this.externalInput.consume("jump")&&(this.jumpRequested=!0);const M=this.externalInput.consumeLookDelta();if(Math.abs(M.x)>1e-4||Math.abs(M.y)>1e-4){const S=-M.x*.01,E=-M.y*.01;this.player.rotateY(S),this.camera.rotateX(E),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}const d=(this.lookUp?1:0)-(this.lookDown?1:0),f=(this.lookLeft?1:0)-(this.lookRight?1:0),g=(c?1:0)-(h?1:0),p=f*this.keyLookSpeed,y=d*this.keyLookSpeed,m=g*this.keyRollSpeed;this.keyLookYawVelocity=p,this.keyLookPitchVelocity=y,this.keyLookRollVelocity=m,Math.abs(this.keyLookYawVelocity)>1e-4&&(this.isFlying?(this.camLocalUp.set(0,1,0).applyQuaternion(this.camera.quaternion),this.player.rotateOnAxis(this.camLocalUp,this.keyLookYawVelocity*t)):this.player.rotateY(this.keyLookYawVelocity*t)),Math.abs(this.keyLookPitchVelocity)>1e-4&&(this.camera.rotateX(this.keyLookPitchVelocity*t),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))),Math.abs(this.keyLookRollVelocity)>1e-4&&this.camera.rotateZ(this.keyLookRollVelocity*t);let u=this.walkSpeed;this.isFlying?u=this.flySpeed:l&&(u=this.runSpeed);const v=new D;if(r&&(v.z+=1),s&&(v.z-=1),a&&(v.x-=1),o&&(v.x+=1),this.isFlying&&(v.z*=-1),v.normalize(),this.isFlying){this.horizontalVelocity.multiplyScalar(.5);const M=v.clone().multiplyScalar(u*e);M.applyQuaternion(this.camera.quaternion),M.applyQuaternion(this.player.quaternion),this.player.position.add(M)}else{const M=this.player.position.clone().normalize(),S=new D(0,0,-1).applyQuaternion(this.camera.quaternion).applyQuaternion(this.player.quaternion).projectOnPlane(M).normalize(),E=new D().crossVectors(S,M).normalize(),C=new D;C.addScaledVector(S,v.z),C.addScaledVector(E,v.x);const w=C.lengthSq()>1e-6?C.normalize():C;let b=this.planetRadius;const R=this.planetMesh.userData.forge,I=this.planetMesh.userData.settings;if(R&&I){const he=this.player.position.clone().normalize(),ge=R.getHeightAt(he);b=I.radius+(ge-I.seaLevel)*I.heightScale}const N=this.player.position.length(),O=b+this.playerHeight,H=N<=O+.05,k=()=>{const he=this.horizontalVelocity,ge=he.length();if(ge<1e-5)return;const Z=Math.max(this.stopSpeed,ge)*this.frictionGround*t,se=Math.max(ge-Z,0);he.multiplyScalar(se/ge)},q=(he,ge,X)=>{if(ge<=0||he.lengthSq()<1e-6)return;const Z=this.horizontalVelocity.dot(he),se=ge-Z;if(se<=0)return;const ee=X*ge*t,de=Math.min(ee,se);this.horizontalVelocity.addScaledVector(he,de)};H?w.lengthSq()<1e-6?k():(k(),q(w,u,this.accelGround)):w.lengthSq()>1e-6&&q(w,u,this.accelAir);const z=this.horizontalVelocity.clone().multiplyScalar(t);if(this.player.position.add(z),H?(this.canJump=!0,this.jumpRequested&&this.canJump?(this.verticalVelocity=this.jumpForce,this.canJump=!1):this.verticalVelocity=0):this.verticalVelocity-=this.gravity*t,Math.abs(this.verticalVelocity)>1e-6&&this.player.translateY(this.verticalVelocity*t),this.player.position.length()<O){const he=this.player.position.clone().normalize();this.player.position.copy(he.multiplyScalar(O)),this.verticalVelocity<0&&(this.verticalVelocity=0),this.canJump=!0}this.jumpRequested=!1;const $=this.player.position.clone().normalize(),ne=new D(0,1,0).applyQuaternion(this.player.quaternion),re=new qn().setFromUnitVectors(ne,$);this.player.quaternion.premultiply(re),this.player.up.copy($),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}}function Fd(n,e=1e-4){e=Math.max(e,Number.EPSILON);const t={},i=n.getIndex(),r=n.getAttribute("position"),s=i?i.count:r.count;let a=0;const o=Object.keys(n.attributes),l={},c={},h=[],d=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let v=0,_=o.length;v<_;v++){const x=o[v],M=n.attributes[x];l[x]=new M.constructor(new M.array.constructor(M.count*M.itemSize),M.itemSize,M.normalized);const S=n.morphAttributes[x];S&&(c[x]||(c[x]=[]),S.forEach((E,C)=>{const w=new E.array.constructor(E.count*E.itemSize);c[x][C]=new E.constructor(w,E.itemSize,E.normalized)}))}const g=e*.5,p=Math.log10(1/e),y=Math.pow(10,p),m=g*y;for(let v=0;v<s;v++){const _=i?i.getX(v):v;let x="";for(let M=0,S=o.length;M<S;M++){const E=o[M],C=n.getAttribute(E),w=C.itemSize;for(let b=0;b<w;b++)x+=`${~~(C[d[b]](_)*y+m)},`}if(x in t)h.push(t[x]);else{for(let M=0,S=o.length;M<S;M++){const E=o[M],C=n.getAttribute(E),w=n.morphAttributes[E],b=C.itemSize,R=l[E],I=c[E];for(let N=0;N<b;N++){const O=d[N],H=f[N];if(R[H](a,C[O](_)),w)for(let k=0,q=w.length;k<q;k++)I[k][H](a,w[k][O](_))}}t[x]=a,h.push(a),a++}}const u=n.clone();for(const v in n.attributes){const _=l[v];if(u.setAttribute(v,new _.constructor(_.array.slice(0,a*_.itemSize),_.itemSize,_.normalized)),v in c)for(let x=0;x<c[v].length;x++){const M=c[v][x];u.morphAttributes[v][x]=new M.constructor(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)}}return u.setIndex(h),u}const Nd=(()=>{const n=new Uint8Array([0,0,128,0]),e=new Jn(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=En,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Nt,e})(),Bd=(()=>{const n=new Uint8Array([160,0,128,128]),e=new Jn(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=En,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Nt,e})();class iw{constructor(e=512){this.size=e,this.data=new Float32Array(e*e),this.waterMask=new Float32Array(e*e),this.rng=Math.random}generateTectonics({numPlates:e=15,jitter:t=.5,oceanFloor:i=.2,plateDelta:r=1,faultType:s="ridge",plateSizeVariance:a=0,desymmetrizeTiling:o=!1}){console.time("Tectonics Generation");const l=Math.max(0,a),c=[];for(let h=0;h<e;h++)c.push({x:Math.floor(this.rng()*this.size),y:Math.floor(this.rng()*this.size),z:this.rng()*.5+.5,type:this.rng()>.6?1:-1,sizeBias:Math.max(.25,1+(this.rng()*2-1)*l),skew:o?(this.rng()*2-1)*l*.5*this.size:0});for(let h=0;h<this.size;h++)for(let d=0;d<this.size;d++){let f=1/0,g=1/0,p=null;for(const _ of c){const M=((o?_.x+_.skew*(h/this.size):_.x)%this.size+this.size)%this.size,S=Math.min(Math.abs(d-M),this.size-Math.abs(d-M)),E=h-_.y,w=Math.sqrt(S*S+E*E)/_.sizeBias;w<f?(g=f,f=w,p=_):w<g&&(g=w)}const y=f/(g+.001);let m=0;p.type>0?m=p.z*r-y*t:m=i-.08+y*.05;const u=Math.pow(y,5)*p.z;let v=s;if(s==="mixed"){const _=Math.abs(Math.sin((p.x+p.y+p.z)*12.9898));v=_<.33?"ridge":_<.66?"trench":"shear"}v==="ridge"?m+=u:v==="trench"?m-=u*.7:v==="shear"?m+=u*.2*Math.sign(p.type):m+=u,this.data[h*this.size+d]=Math.max(0,Math.min(1,m))}console.timeEnd("Tectonics Generation")}applyErosion({iterations:e=5e4,inertia:t=.05,gravity:i=4,evaporation:r=.01,erosionRate:s=.3,depositionRate:a=.1}){console.time("Hydraulic Erosion");const o=this.size;for(let l=0;l<e;l++){let c=this.rng()*(o-1),h=this.rng()*(o-1),d=0,f=0,g=1,p=1,y=0;for(let m=0;m<30;m++){let u=Math.floor(c),v=Math.floor(h),_=(u+o)%o,x=(u+1+o)%o,M=Math.max(0,Math.min(o-1,v));const S=this.data[M*o+_],E=this.data[M*o+(u-1+o)%o],C=this.data[M*o+x],w=this.data[Math.max(0,v-1)*o+_],b=this.data[Math.min(o-1,v+1)*o+_],R=C-E,I=b-w;d=d*t-R*(1-t),f=f*t-I*(1-t);const N=Math.sqrt(d*d+f*f);if(N!==0&&(d/=N,f/=N),c+=d,h+=f,h<0||h>=o-1||!Number.isFinite(h)||!Number.isFinite(c))break;const O=Math.max(0,Math.min(o-1,Math.floor(h))),H=(Math.floor(c)+o)%o;let k=this.data[O*o+H],q=S-k;const z=Math.max(-q,.01)*g*p*4;if(y>z||q<0){const $=(y-z)*a;y-=$,this.data[M*o+_]+=$}else{const $=Math.min((z-y)*s,-q);y+=$,this.data[M*o+_]-=$}if(g=Math.sqrt(g*g+Math.max(0,q)*i),p*=1-r,p<.01)break}}console.timeEnd("Hydraulic Erosion"),this._sanitize()}createMesh(e=10,t=2,i=.5,r=6,s=.12,a=null,o=null){this._sanitize();let l=new Yi(e,Math.max(0,Math.floor(r)));l.deleteAttribute("uv"),l=Fd(l);const c=v=>Math.min(Math.max(v,0),1),h=(v,_,x)=>{const M=c(v)*(this.size-1),S=c(1-_)*(this.size-1),E=Math.floor(M),C=Math.floor(S),w=Math.min(this.size-1,E+1),b=Math.min(this.size-1,C+1),R=M-E,I=S-C,N=x[C*this.size+E],O=x[C*this.size+w],H=x[b*this.size+E],k=x[b*this.size+w],q=N*(1-R)+O*R,z=H*(1-R)+k*R,$=q*(1-I)+z*I;return Number.isFinite($)?$:0},d=(v,_)=>h(v,_,this.data),f=(v,_)=>h(v,_,this.waterMask),g=v=>{const _=new D(Math.abs(v.x),Math.abs(v.y),Math.abs(v.z)),x=_.x+_.y+_.z+1e-6,M=_.x/x,S=_.y/x,E=_.z/x,C={u:v.z*.5+.5,v:v.y*.5+.5},w={u:v.x*.5+.5,v:v.z*.5+.5},b={u:v.x*.5+.5,v:v.y*.5+.5},R=d(C.u,C.v),I=d(w.u,w.v),N=d(b.u,b.v);return R*M+I*S+N*E},p=l.attributes.position,y=new D,m=new Float32Array(p.count);for(let v=0;v<p.count;v++){y.fromBufferAttribute(p,v);const _=y.length();if(_===0||!Number.isFinite(_)){y.set(e,0,0),p.setXYZ(v,y.x,y.y,y.z);continue}const x=y.clone().normalize(),M=g(x),S=f(x.x*.5+.5,x.y*.5+.5),E=(M-i)*t;x.multiplyScalar(e+E),p.setXYZ(v,x.x,x.y,x.z),m[v]=S}l.computeVertexNormals(),this._ensureFinitePositions(l,e),l.normalizeNormals(),l.setAttribute("waterMask",new Dt(m,1));const u=new Xg({shininess:50,specular:new Se(6710886),color:8947848,flatShading:!1,onBeforeCompile:function(v){var _,x,M,S;v.vertexShader=`
                    varying float vHeight;
                    varying vec3 vDir;
                    attribute float waterMask;
                    varying float vWater;
                    varying float vSlope;
                    uniform float uIceCap;
                    ${v.vertexShader}
                `.replace("#include <begin_vertex>",`
                    #include <begin_vertex>
                    vHeight = length(transformed) - ${e.toFixed(1)};
                    vDir = normalize(transformed);
                    vWater = waterMask;
                    vSlope = 1.0 - dot(normalize(normal), normalize(position));
                    float rough = smoothstep(0.2, 0.7, vSlope);
                    float rockNoise = sin(dot(position.xyz, vec3(12.9898,78.233,37.719))) * 0.5 + 0.5;
                    transformed += normalize(normal) * rockNoise * rough * 0.08;
                    `),v.fragmentShader=`
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
	                    
	                    ${v.fragmentShader}
	                `.replace("#include <color_fragment>",`
                    // Recover normalized height value used for displacement
                    float heightVal = (vHeight / ${t.toFixed(3)}) + ${i.toFixed(3)};
                    // Thresholds relative to sea level
                    float sea = ${i.toFixed(3)};
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
                    `),v.uniforms.uIceCap={value:s},v.uniforms.uWeatherMap={value:((_=this.userData.weather)==null?void 0:_.texture)??Nd},v.uniforms.uWeatherAuxMap={value:((x=this.userData.weather)==null?void 0:x.auxTexture)??Bd},v.uniforms.uWeatherStrength={value:((M=this.userData.weather)==null?void 0:M.strength)??.75},v.uniforms.uWeatherDebug={value:((S=this.userData.weather)==null?void 0:S.debug)??0},this.userData.shader=v}});return u.userData.weather={texture:a??Nd,auxTexture:o??Bd,strength:.75,debug:0},new Vt(l,u)}createFreshwaterMesh(e=10,t=2,i=.5,r=6){let s=new Yi(e,Math.max(0,Math.floor(r)));s.deleteAttribute("uv"),s=Fd(s);const a=s.attributes.position,o=new D,l=new Float32Array(a.count),c=(p,y)=>this._sampleBilinear(p,y,this.data),h=(p,y)=>this._sampleBilinear(p,y,this.waterMask),d=p=>{const y=new D(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z)),m=y.x+y.y+y.z+1e-6,u=y.x/m,v=y.y/m,_=y.z/m,x={u:p.z*.5+.5,v:p.y*.5+.5},M={u:p.x*.5+.5,v:p.z*.5+.5},S={u:p.x*.5+.5,v:p.y*.5+.5},E=c(x.u,x.v),C=c(M.u,M.v),w=c(S.u,S.v),b=h(x.u,x.v),R=h(M.u,M.v),I=h(S.u,S.v);return{height:E*u+C*v+w*_,mask:b*u+R*v+I*_}},f=this.riverDepth||.015;for(let p=0;p<a.count;p++){o.fromBufferAttribute(a,p);const y=o.clone().normalize(),m=d(y),u=m.height,v=m.mask,x=(u+v*f*.5-i)*t;y.multiplyScalar(e+x+.001),a.setXYZ(p,y.x,y.y,y.z),l[p]=v}s.computeVertexNormals(),this._ensureFinitePositions(s,e),s.normalizeNormals(),s.setAttribute("waterMask",new Dt(l,1));const g=new Gt({uniforms:{time:{value:0},deepColor:{value:new Se(532543)},shallowColor:{value:new Se(1396618)},opacity:{value:.8},fresnelPower:{value:3.4}},transparent:!0,depthWrite:!1,side:Mn,blending:Kn,vertexShader:`
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
            `});return new Vt(s,g)}_sanitize(e=-5,t=5){const i=this.data;for(let r=0;r<i.length;r++){let s=i[r];Number.isFinite(s)?s<e?s=e:s>t&&(s=t):s=0,i[r]=s}}_clamp01(e){return Math.min(Math.max(e,0),1)}_sampleBilinear(e,t,i){const r=this._clamp01(e)*(this.size-1),s=this._clamp01(1-t)*(this.size-1),a=Math.floor(r),o=Math.floor(s),l=Math.min(this.size-1,a+1),c=Math.min(this.size-1,o+1),h=r-a,d=s-o,f=i[o*this.size+a],g=i[o*this.size+l],p=i[c*this.size+a],y=i[c*this.size+l],m=f*(1-h)+g*h,u=p*(1-h)+y*h;return m*(1-d)+u*d}getHeightAt(e){const t=(y,m)=>this._sampleBilinear(y,m,this.data),i=new D(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),r=i.x+i.y+i.z+1e-6,s=i.x/r,a=i.y/r,o=i.z/r,l={u:e.z*.5+.5,v:e.y*.5+.5},c={u:e.x*.5+.5,v:e.z*.5+.5},h={u:e.x*.5+.5,v:e.y*.5+.5},d=t(l.u,l.v),f=t(c.u,c.v),g=t(h.u,h.v);let p=d*s+f*a+g*o;return Number.isFinite(p)?p:0}getWaterDataAt(e){const t=(S,E)=>this._sampleBilinear(S,E,this.data),i=(S,E)=>this._sampleBilinear(S,E,this.waterMask),r=new D(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),s=r.x+r.y+r.z+1e-6,a=r.x/s,o=r.y/s,l=r.z/s,c={u:e.z*.5+.5,v:e.y*.5+.5},h={u:e.x*.5+.5,v:e.z*.5+.5},d={u:e.x*.5+.5,v:e.y*.5+.5},f=t(c.u,c.v),g=t(h.u,h.v),p=t(d.u,d.v),y=f*a+g*o+p*l,m=i(c.u,c.v),u=i(h.u,h.v),v=i(d.u,d.v),_=m*a+u*o+v*l,x=this.riverDepth||.015,M=y+_*x*.5;return{height:Number.isFinite(y)?y:0,waterHeight:Number.isFinite(M)?M:0,waterMask:Number.isFinite(_)?_:0,hasWater:_>.05}}applyHydrology({seaLevel:e=.5,riverDepth:t=.015,lakeThreshold:i=.003}={}){this.riverDepth=t;const r=this.size,s=r*r;this.waterMask.fill(0);const a=new Float32Array(this.data),o=new Uint8Array(s),l=new Int32Array(s+r*4),c=new Float32Array(s+r*4);let h=0;const d=(x,M)=>{let S=h++;for(l[S]=x,c[S]=M;S>0;){const E=S-1>>1;if(c[E]<=M)break;l[S]=l[E],c[S]=c[E],l[E]=x,c[E]=M,S=E}},f=()=>{const x=l[0],M=c[0];if(h--,h>0){l[0]=l[h],c[0]=c[h];let S=0;for(;;){const E=(S<<1)+1,C=E+1;if(E>=h)break;let w=E;if(C<h&&c[C]<c[E]&&(w=C),c[S]<=c[w])break;[l[S],l[w]]=[l[w],l[S]],[c[S],c[w]]=[c[w],c[S]],S=w}}return[x,M]},g=(x,M)=>{const S=M*r+x;o[S]||(o[S]=1,d(S,a[S]))};for(let x=0;x<r;x++)g(x,0),g(x,r-1);for(let x=1;x<r-1;x++)g(0,x),g(r-1,x);const p=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];for(;h>0;){const[x,M]=f(),S=x%r,E=Math.floor(x/r);for(const[C,w]of p){const b=(S+C+r)%r,R=E+w;if(R<0||R>=r)continue;const I=R*r+b;if(o[I])continue;o[I]=1,a[I]<M&&(a[I]=M),d(I,a[I])}}const y=new Int32Array(s);for(let x=0;x<r;x++)for(let M=0;M<r;M++){const S=x*r+M,E=a[S];let C=-1,w=E;for(const[b,R]of p){const I=(M+b+r)%r,N=x+R;if(N<0||N>=r)continue;const O=N*r+I,H=a[O];H<w&&(w=H,C=O)}y[S]=C}const m=new Array(s);for(let x=0;x<s;x++)m[x]=x;m.sort((x,M)=>a[M]-a[x]);const u=new Float32Array(s);u.fill(1);for(const x of m){const M=y[x];M>=0&&(u[M]+=u[x])}let v=0;for(let x=0;x<s;x++)u[x]>v&&(v=u[x]);const _=v>0?1/v:0;for(let x=0;x<s;x++){const M=Math.max(0,a[x]-this.data[x]);let S=0;M>i&&(S=Math.min(1,M*12));const E=Math.pow(u[x]*_,.5);E>.1&&a[x]>e&&(S=Math.max(S,E)),this.waterMask[x]=S,S>0&&(this.data[x]=Math.max(0,this.data[x]-S*t))}}_ensureFinitePositions(e,t=10){const i=e.attributes.position,r=i.array;let s=!1;for(let a=0;a<r.length;a++)Number.isFinite(r[a])||(s=!0,r[a]=0);s&&(r[0]=t,r[1]=0,r[2]=0,i.needsUpdate=!0)}}class rw{constructor(e){this.sceneGroup=e,this.mesh=null;const t=new Jn(new Uint8Array([110,0,128,0]),1,1,St,Lt);t.needsUpdate=!0,t.wrapS=En,t.wrapT=pt,t.minFilter=it,t.magFilter=it,t.generateMipmaps=!1,t.colorSpace=Nt,this.defaultWeatherTexture=t,this.uniforms={sunDir:{value:new D(0,1,0)},glowColor:{value:new Se(5089535)},alpha:{value:1},density:{value:6},weatherMap:{value:t},rainHaze:{value:.9},planetInvRot:{value:new Fe},planetInvScale:{value:1},innerRadius:{value:10},outerRadius:{value:11},rayleighScaleHeight:{value:.25},mieScaleHeight:{value:.08},mieG:{value:.76},exposure:{value:1.15}},this.uniforms.planetInvRot.value.identity()}update(e){var i,r;const t=((r=(i=this.sceneGroup)==null?void 0:i.scale)==null?void 0:r.x)||1;this.uniforms.planetInvScale.value=1/t}setWeather(e,t=.9){this.uniforms.weatherMap||(this.uniforms.weatherMap={value:this.defaultWeatherTexture}),this.uniforms.rainHaze||(this.uniforms.rainHaze={value:.9}),this.uniforms.weatherMap.value=e||this.defaultWeatherTexture,this.uniforms.rainHaze.value=t}updateVisuals(e,t,i,r,s){var p,y;if(!e.atmosphereEnabled){this.mesh&&(this.mesh.visible=!1);return}const a=Math.max(.05,e.atmosphere),o=e.atmosphereHeight,l=e.atmosphereAlpha,c=e.atmosphereColor,h=t+o+Math.max(.05,a)*r;this.uniforms.alpha.value=l,this.uniforms.glowColor.value=new Se(c),this.uniforms.sunDir.value.copy(s).normalize(),this.uniforms.innerRadius.value=t,this.uniforms.outerRadius.value=h;const d=Math.max(2,Math.min(6,Math.floor(i/24))),f=new Yi(h,d),g=new Gt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:on,blending:Ao,vertexShader:`
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
            `});this.mesh&&(this.mesh.geometry.dispose(),(y=(p=this.mesh.material).dispose)==null||y.call(p),this.sceneGroup.remove(this.mesh)),this.mesh=new Vt(f,g),this.mesh.renderOrder=1,this.sceneGroup.add(this.mesh)}}class sw{constructor(e){this.sceneGroup=e,this.clouds=[]}update(e){const t=Math.min(e,.25);for(const i of this.clouds){const r=i.userData.uniforms,a=i.userData.settings.speed||1;r.windOffset.value+=t*a*.3}}clear(){var e,t;for(const i of this.clouds)this.sceneGroup.remove(i),i.geometry.dispose(),(t=(e=i.material).dispose)==null||t.call(e);this.clouds=[]}rebuild(e,t,i,r,s,a){this.clear();for(const o of a){if(!o.enabled)continue;const l=this.buildCloudMesh(t+r*.2,s,e,t,i,r,o);this.clouds.push(l),this.sceneGroup.add(l)}}buildVolumeCloudMesh(e,t,i,r,s,a,o,l,c){const h=o.mode==="billow"?1:o.mode==="cellular"?2:0,d=r+(s-.5)*a+.05,f=((c==null?void 0:c.planetRadiusM)??Zp)/un,g=((c==null?void 0:c.atmoThicknessM)??2e4)/Math.max(f,1e-6),p=d,y=Math.max(.25,g*.5),m=Math.max(.1,p-.05),u=m+2*y,v={windOffset:{value:0},color:{value:new Se(o.color)},opacity:{value:o.alpha},sunDir:{value:i.clone().normalize()},windDir:{value:new D(0,0,1)},quantity:{value:o.quantity},noiseScale:{value:Math.max(1,o.resolution)},mode:{value:h},bundleSize:{value:1},rayStepsMin:{value:28},rayStepsMax:{value:48},debugGrid:{value:0},volumeAtlas:{value:l},volumeN:{value:(c==null?void 0:c.n)??64},tilesX:{value:(c==null?void 0:c.tilesX)??8},atlasW:{value:(c==null?void 0:c.atlasW)??512},atlasH:{value:(c==null?void 0:c.atlasH)??512},volumeExtentM:{value:(c==null?void 0:c.extentM)??52e4},metersPerUnit:{value:f},planetInvRot:{value:new Fe},planetInvScale:{value:1},innerRadius:{value:m},outerRadius:{value:u}},_=Math.max(2,Math.min(6,Math.floor(t/24))),x=new Yi(u,_),M=new Gt({uniforms:v,transparent:!0,depthWrite:!1,side:Ln,blending:Kn,vertexShader:`
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
            `}),S=new Vt(x,M);return S.userData.uniforms=v,S.userData.settings=o,S.renderOrder=2,S}buildCloudMesh(e,t,i,r,s,a,o){const l=Math.max(.1,e+o.height),c=o.mode==="billow"?1:o.mode==="cellular"?2:0,h={time:{value:0},windOffset:{value:0},color:{value:new Se(o.color)},opacity:{value:o.alpha},sunDir:{value:i.clone().normalize()},windDir:{value:new D(0,0,1)},planetRadius:{value:r},seaLevel:{value:s},heightScale:{value:a},speed:{value:o.speed},quantity:{value:o.quantity},noiseScale:{value:Math.max(.1,o.resolution)},mode:{value:c}};return new Yi(l,Math.max(1,Math.floor(t*.5))),new Gt({uniforms:h,transparent:!0,depthWrite:!1,side:Mn,blending:Kn,vertexShader:`
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
            `}),mesh}}const aw=256,ow=128;function lw(n,e,t,i={}){const r=new Jn(n,e,t,St,Lt);return r.needsUpdate=!0,r.wrapS=i.wrapS??En,r.wrapT=i.wrapT??pt,r.minFilter=i.minFilter??it,r.magFilter=i.magFilter??it,r.generateMipmaps=!1,r.colorSpace=Nt,r}class Yu{constructor({gridWidth:e=aw,gridHeight:t=ow}={}){this.gridW=Math.max(32,Math.min(512,Math.round(e))),this.gridH=Math.max(16,Math.min(256,Math.round(t))),this.cellCount=this.gridW*this.gridH,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.bindGroupLayout=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(16),this.heightBuffers=null,this.prevHeightBuffer=null,this.outputBuffer=null,this.windFieldBuffer=null,this.useWindField=!1,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.ping=0,this.viscosity=.985,this.waveSpeed=2,this.mousePos=new Ee(-999,-999),this.mouseSpeed=new Ee(0,0),this.mouseSize=.08,this.mouseDeep=.3,this.windStrength=.5,this.windDirection=new Ee(.7,.3).normalize(),this.timeS=0,this.readbackIntervalS=.033,this.readbackTimerS=0,this.textureData=new Uint8Array(this.cellCount*4),this.oceanTexture=lw(this.textureData,this.gridW,this.gridH)}static async create(e={}){const{device:t,...i}=e,r=new Yu(i);return await r.init({device:t}),r}setConfig({viscosity:e,waveSpeed:t,mouseSize:i,mouseDeep:r,windStrength:s,windDirectionX:a,windDirectionY:o,readbackIntervalS:l}={}){Number.isFinite(e)&&(this.viscosity=Math.max(.9,Math.min(.999,e))),Number.isFinite(t)&&(this.waveSpeed=Math.max(.1,Math.min(10,t))),Number.isFinite(i)&&(this.mouseSize=Math.max(.01,Math.min(.5,i))),Number.isFinite(r)&&(this.mouseDeep=Math.max(0,Math.min(2,r))),Number.isFinite(s)&&(this.windStrength=Math.max(0,Math.min(2,s))),Number.isFinite(a)&&Number.isFinite(o)&&this.windDirection.set(a,o).normalize(),Number.isFinite(l)&&(this.readbackIntervalS=Math.max(.01,l))}setWindField(e){if(!this.windFieldBuffer||!this.device)return;if(!e){this.useWindField=!1;return}const t=this.cellCount*2;if(e.length<t){console.warn("[OceanComputeSystem] wind field size mismatch",e.length,t),this.useWindField=!1;return}this.device.queue.writeBuffer(this.windFieldBuffer,0,e),this.useWindField=!0}getTexture(){return this.oceanTexture}setMouseInteraction(e,t,i,r){this.mousePos.set(e,t),this.mouseSpeed.set(i,r)}clearMouseInteraction(){this.mousePos.set(-999,-999),this.mouseSpeed.set(0,0)}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[OceanComputeSystem] WebGPU not available; compute ocean disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[OceanComputeSystem] No GPU adapter found; compute ocean disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,i=this.cellCount*4,r=this.cellCount*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.heightBuffers=[t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.prevHeightBuffer=t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.windFieldBuffer=t.createBuffer({size:this.cellCount*8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.readbackBuffers=[t.createBuffer({size:r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]});const s=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),a=t.createShaderModule({code:this._wgslOcean()});this.pipelineSim=t.createComputePipeline({layout:s,compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[0]}},{binding:2,resource:{buffer:this.heightBuffers[1]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}},{binding:5,resource:{buffer:this.windFieldBuffer}}]}),t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[1]}},{binding:2,resource:{buffer:this.heightBuffers[0]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}},{binding:5,resource:{buffer:this.windFieldBuffer}}]})],this._resetState(),this.ready=!0}_resetState(){const e=new Float32Array(this.cellCount);for(let t=0;t<this.cellCount;t++)e[t]=(Math.random()-.5)*.001;this.device.queue.writeBuffer(this.heightBuffers[0],0,e),this.device.queue.writeBuffer(this.heightBuffers[1],0,e),this.device.queue.writeBuffer(this.prevHeightBuffer,0,e),this.windFieldBuffer&&this.device.queue.writeBuffer(this.windFieldBuffer,0,new Float32Array(this.cellCount*2)),this.useWindField=!1,this.ping=0,this.timeS=0}update(e,t={}){if(!this.enabled||!this.ready)return;const i=Math.min(Math.max(e??0,0),.1);this.timeS+=i,this.readbackTimerS+=i,this._writeUniforms(i);const r=this.device,s=r.createCommandEncoder(),a=s.beginComputePass();a.setPipeline(this.pipelineSim),a.setBindGroup(0,this.bindGroups[this.ping]),a.dispatchWorkgroups(Math.ceil(this.gridW/8),Math.ceil(this.gridH/8)),a.end(),this.ping=1-this.ping;let o=null;if(!!t.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const c=this.readbackWriteIndex&1;this.readbackInFlight[c]||(s.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[c],0,this.cellCount*4),o=c,this.readbackWriteIndex++,this.readbackTimerS=0)}r.queue.submit([s.finish()]),o!==null&&this._scheduleReadback(o)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i);this.textureData.set(r),t.unmap(),this.oceanTexture.needsUpdate=!0}).catch(i=>{console.warn("[OceanComputeSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e){const t=this.uniformData;t[0]=this.gridW,t[1]=this.gridH,t[2]=e,t[3]=this.timeS,t[4]=this.viscosity,t[5]=this.waveSpeed,t[6]=this.mouseSize,t[7]=this.mouseDeep,t[8]=this.mousePos.x,t[9]=this.mousePos.y,t[10]=this.mouseSpeed.x,t[11]=this.mouseSpeed.y,t[12]=this.windStrength,t[13]=this.windDirection.x,t[14]=this.windDirection.y,t[15]=this.useWindField?1:0,this.device.queue.writeBuffer(this.uniformBuffer,0,t)}_wgslOcean(){return`
@group(0) @binding(0) var<uniform> params: array<vec4<f32>, 4>;
@group(0) @binding(1) var<storage, read> heightSrc: array<f32>;
@group(0) @binding(2) var<storage, read_write> heightDst: array<f32>;
@group(0) @binding(3) var<storage, read_write> prevHeight: array<f32>;
@group(0) @binding(4) var<storage, read_write> outPixels: array<u32>;
@group(0) @binding(5) var<storage, read> windField: array<vec2<f32>>;

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
fn useWindField() -> f32 { return params[3].w; }

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
    var windVec = windDir();
    var windAmp = windStrength();
    if (useWindField() > 0.5) {
        let localWind = windField[i];
        let speed = length(localWind);
        if (speed > 1e-5) {
            windVec = localWind / speed;
            windAmp = clamp(speed / 60.0, 0.0, 2.0);
        } else {
            windVec = normalize(windDir());
            windAmp = 0.0;
        }
    } else {
        windVec = normalize(windVec);
    }
    let c = cos(angle);
    let s = sin(angle);
    let ekmanDir = vec2(windVec.x * c - windVec.y * s, windVec.x * s + windVec.y * c);
    let windUV = uv * 8.0 + ekmanDir * time() * 0.5;
    let windWave = (fbm(windUV) - 0.5) * windAmp * 0.012;
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
        `}dispose(){var e,t,i,r,s;this.heightBuffers&&this.heightBuffers.forEach(a=>a==null?void 0:a.destroy()),(e=this.prevHeightBuffer)==null||e.destroy(),(t=this.outputBuffer)==null||t.destroy(),(i=this.readbackBuffers)==null||i.forEach(a=>a==null?void 0:a.destroy()),(r=this.windFieldBuffer)==null||r.destroy(),(s=this.uniformBuffer)==null||s.destroy(),this.device=null,this.enabled=!1,this.ready=!1}}const cw="modulepreload",uw=function(n,e){return new URL(n,e).href},Od={},hw=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let a=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=a(t.map(h=>{if(h=uw(h,i),h in Od)return;Od[h]=!0;const d=h.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(!!i)for(let y=o.length-1;y>=0;y--){const m=o[y];if(m.href===h&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${f}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":cw,d||(p.as="script"),p.crossOrigin="",p.href=h,c&&p.setAttribute("nonce",c),document.head.appendChild(p),d)return new Promise((y,m)=>{p.addEventListener("load",y),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return e().catch(s)})};class dw{constructor(){j(this,"index",0);j(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,i=e();return i===void 0&&(this.index=t),i}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,i){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return i()})}readNumber(e,t,i,r){return this.readAtomically(()=>{let s=0,a=0;const o=this.peekChar();if(o===void 0)return;const l=o==="0",c=2**(8*r)-1;for(;;){const h=this.readAtomically(()=>{const d=this.readChar();if(d===void 0)return;const f=Number.parseInt(d,e);if(!Number.isNaN(f))return f});if(h===void 0)break;if(s*=e,s+=h,s>c||(a+=1,t!==void 0&&a>t))return}if(a!==0)return!i&&l&&a>1?void 0:s})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const i=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(i===void 0)return;e[t]=i}return e})}readIPv6Addr(){const e=t=>{for(let i=0;i<t.length/2;i++){const r=i*2;if(i<t.length-3){const a=this.readSeparator(":",i,()=>this.readIPv4Addr());if(a!==void 0)return t[r]=a[0],t[r+1]=a[1],t[r+2]=a[2],t[r+3]=a[3],[r+4,!0]}const s=this.readSeparator(":",i,()=>this.readNumber(16,4,!0,2));if(s===void 0)return[r,!1];t[r]=s>>8,t[r+1]=s&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[i,r]=e(t);if(i===16)return t;if(r||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const s=new Uint8Array(14),a=16-(i+2),[o]=e(s.subarray(0,a));return t.set(s.subarray(0,o),16-o),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const fw=45,pw=15,Bo=new dw;function mw(n){if(!(n.length>pw))return Bo.new(n).parseWith(()=>Bo.readIPv4Addr())}function gw(n){if(n.includes("%")&&(n=n.split("%")[0]),!(n.length>fw))return Bo.new(n).parseWith(()=>Bo.readIPv6Addr())}function Qp(n){return!!mw(n)}function vw(n){return!!gw(n)}function Jp(n=0){return new Uint8Array(n)}function xw(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function yw(n){if(xw(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function em(n,e){e==null&&(e=n.reduce((r,s)=>r+s.length,0));const t=Jp(e);let i=0;for(const r of n)t.set(r,i),i+=r.length;return yw(t)}function _w(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function sa(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return aa(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return aa(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function bw(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const zd=4096;function ww(n){const e=n.length;if(e<=zd)return String.fromCharCode.apply(String,n);let t="",i=0;for(;i<e;)t+=String.fromCharCode.apply(String,n.subarray(i,i+=zd));return t}function Sw(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function aa(n){return Sw(n)?n:n.slice()}function Mw(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var h=n.length,d=n.charAt(0),f=Math.log(h)/Math.log(256),g=Math.log(256)/Math.log(h);function p(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var v=0,_=0,x=0,M=u.length;x!==M&&u[x]===0;)x++,v++;for(var S=(M-x)*g+1>>>0,E=new Uint8Array(S);x!==M;){for(var C=u[x],w=0,b=S-1;(C!==0||w<_)&&b!==-1;b--,w++)C+=256*E[b]>>>0,E[b]=C%h>>>0,C=C/h>>>0;if(C!==0)throw new Error("Non-zero carry");_=w,x++}for(var R=S-_;R!==S&&E[R]===0;)R++;for(var I=d.repeat(v);R<S;++R)I+=n.charAt(E[R]);return I}function y(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var v=0;if(u[v]!==" "){for(var _=0,x=0;u[v]===d;)_++,v++;for(var M=(u.length-v)*f+1>>>0,S=new Uint8Array(M);u[v];){var E=i[u.charCodeAt(v)];if(E===255)return;for(var C=0,w=M-1;(E!==0||C<x)&&w!==-1;w--,C++)E+=h*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");x=C,v++}if(u[v]!==" "){for(var b=M-x;b!==M&&S[b]===0;)b++;for(var R=new Uint8Array(_+(M-b)),I=_;b!==M;)R[I++]=S[b++];return R}}}function m(u){var v=y(u);if(v)return v;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:y,decode:m}}var Ew=Mw,Tw=Ew;let Aw=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Cw=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return tm(this,e)}},Rw=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return tm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function tm(n,e){return new Rw({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let Pw=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new Aw(e,t,i),this.decoder=new Cw(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function sl({name:n,prefix:e,encode:t,decode:i}){return new Pw(n,e,t,i)}function ma({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=Tw(t,n,i);return sl({prefix:e,name:n,encode:r,decode:a=>sa(s(a))})}function Dw(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const h=e[n[c]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|h,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function Lw(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function Iw(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Ht({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=Iw(i,r);return sl({prefix:e,name:n,encode(a){return Lw(a,i,t)},decode(a){return Dw(a,s,t,n)}})}const Uw=ma({prefix:"9",name:"base10",alphabet:"0123456789"}),Fw=Object.freeze(Object.defineProperty({__proto__:null,base10:Uw},Symbol.toStringTag,{value:"Module"})),Nw=Ht({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Bw=Ht({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Ow=Object.freeze(Object.defineProperty({__proto__:null,base16:Nw,base16upper:Bw},Symbol.toStringTag,{value:"Module"})),zw=Ht({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),kw=Object.freeze(Object.defineProperty({__proto__:null,base2:zw},Symbol.toStringTag,{value:"Module"})),nm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Vw=nm.reduce((n,e,t)=>(n[t]=e,n),[]),Gw=nm.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function Hw(n){return n.reduce((e,t)=>(e+=Vw[t],e),"")}function Ww(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=Gw[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}const qw=sl({prefix:"🚀",name:"base256emoji",encode:Hw,decode:Ww}),Xw=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:qw},Symbol.toStringTag,{value:"Module"})),ns=Ht({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),$w=Ht({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Yw=Ht({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),jw=Ht({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Kw=Ht({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Zw=Ht({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Qw=Ht({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Jw=Ht({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),eS=Ht({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),tS=Object.freeze(Object.defineProperty({__proto__:null,base32:ns,base32hex:Kw,base32hexpad:Qw,base32hexpadupper:Jw,base32hexupper:Zw,base32pad:Yw,base32padupper:jw,base32upper:$w,base32z:eS},Symbol.toStringTag,{value:"Module"})),go=ma({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),nS=ma({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),iS=Object.freeze(Object.defineProperty({__proto__:null,base36:go,base36upper:nS},Symbol.toStringTag,{value:"Module"})),ci=ma({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),rS=ma({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),sS=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ci,base58flickr:rS},Symbol.toStringTag,{value:"Module"})),aS=Ht({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),oS=Ht({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),im=Ht({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),lS=Ht({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),cS=Object.freeze(Object.defineProperty({__proto__:null,base64:aS,base64pad:oS,base64url:im,base64urlpad:lS},Symbol.toStringTag,{value:"Module"})),uS=Ht({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),hS=Object.freeze(Object.defineProperty({__proto__:null,base8:uS},Symbol.toStringTag,{value:"Module"})),dS=sl({prefix:"\0",name:"identity",encode:n=>ww(sa(n)),decode:n=>sa(bw(n))}),fS=Object.freeze(Object.defineProperty({__proto__:null,identity:dS},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;var pS=rm,kd=128,mS=-128,gS=Math.pow(2,31);function rm(n,e,t){e=e||[],t=t||0;for(var i=t;n>=gS;)e[t++]=n&255|kd,n/=128;for(;n&mS;)e[t++]=n&255|kd,n>>>=7;return e[t]=n|0,rm.bytes=t-i+1,e}var vS=ru,xS=128,Vd=127;function ru(n,i){var t=0,i=i||0,r=0,s=i,a,o=n.length;do{if(s>=o)throw ru.bytes=0,new RangeError("Could not decode varint");a=n[s++],t+=r<28?(a&Vd)<<r:(a&Vd)*Math.pow(2,r),r+=7}while(a>=xS);return ru.bytes=s-i,t}var yS=Math.pow(2,7),_S=Math.pow(2,14),bS=Math.pow(2,21),wS=Math.pow(2,28),SS=Math.pow(2,35),MS=Math.pow(2,42),ES=Math.pow(2,49),TS=Math.pow(2,56),AS=Math.pow(2,63),CS=function(n){return n<yS?1:n<_S?2:n<bS?3:n<wS?4:n<SS?5:n<MS?6:n<ES?7:n<TS?8:n<AS?9:10},RS={encode:pS,decode:vS,encodingLength:CS},Oo=RS;function su(n,e=0){const t=Oo.decode(n,e),i=Oo.decode.bytes;if(i>9)throw new RangeError("Invalid varint: too long");if(i>1&&n[e+i-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,i]}function zo(n,e,t=0){return Oo.encode(n,e,t),e}function ko(n){return Oo.encodingLength(n)}function PS(n,e){const t=e.byteLength,i=ko(n),r=i+ko(t),s=new Uint8Array(r+t);return zo(n,s,0),zo(t,s,i),s.set(e,r),new ju(n,t,e,s)}function DS(n){const e=sa(n),[t,i]=su(e),[r,s]=su(e.subarray(i)),a=e.subarray(i+s);if(a.byteLength!==r)throw new Error("Incorrect length");return new ju(t,r,a,e)}function LS(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&_w(n.bytes,t.bytes)}}let ju=class{constructor(e,t,i,r){j(this,"code");j(this,"size");j(this,"digest");j(this,"bytes");this.code=e,this.size=t,this.digest=aa(i),this.bytes=aa(r)}};function Gd(n,e){const{bytes:t,version:i}=n;switch(i){case 0:return FS(t,au(n),e??ci.encoder);default:return NS(t,au(n),e??ns.encoder)}}const Hd=new WeakMap;function au(n){const e=Hd.get(n);if(e==null){const t=new Map;return Hd.set(n,t),t}return e}var up;let IS=class jt{constructor(e,t,i,r){j(this,"code");j(this,"version");j(this,"multihash");j(this,"bytes");j(this,"/");j(this,up,"CID");this.code=t,this.version=e,this.multihash=i,this.bytes=aa(r),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Ps)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==BS)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return jt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,i=PS(e,t);return jt.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return jt.equals(this,e)}static equals(e,t){const i=t;return i!=null&&e.code===i.code&&e.version===i.version&&LS(e.multihash,i.multihash)}toString(e){return Gd(this,e)}toJSON(){return{"/":Gd(this)}}link(){return this}[(up=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof jt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:i,code:r,multihash:s,bytes:a}=t;return new jt(i,r,s,a??Wd(i,r,s.bytes))}else if(t[OS]===!0){const{version:i,multihash:r,code:s}=t,a=DS(r);return jt.create(i,s,a)}else return null}static create(e,t,i){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Ps)throw new Error(`Version 0 CID must use dag-pb (code: ${Ps}) block encoding`);return new jt(e,t,i,i.bytes)}case 1:{const r=Wd(e,t,i.bytes);return new jt(e,t,i,r)}default:throw new Error("Invalid version")}}static createV0(e){return jt.create(0,Ps,e)}static createV1(e,t){return jt.create(1,e,t)}static decode(e){const[t,i]=jt.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=jt.inspectBytes(e),i=t.size-t.multihashSize,r=sa(e.subarray(i,i+t.multihashSize));if(r.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=r.subarray(t.multihashSize-t.digestSize),a=new ju(t.multihashCode,t.digestSize,s,r);return[t.version===0?jt.createV0(a):jt.createV1(t.codec,a),e.subarray(t.size)]}static inspectBytes(e){let t=0;const i=()=>{const[d,f]=su(e.subarray(t));return t+=f,d};let r=i(),s=Ps;if(r===18?(r=0,t=0):s=i(),r!==0&&r!==1)throw new RangeError(`Invalid CID version ${r}`);const a=t,o=i(),l=i(),c=t+l,h=c-a;return{version:r,codec:s,multihashCode:o,digestSize:l,multihashSize:h,size:c}}static parse(e,t){const[i,r]=US(e,t),s=jt.decode(r);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return au(s).set(i,e),s}};function US(n,e){switch(n[0]){case"Q":{const t=e??ci;return[ci.prefix,t.decode(`${ci.prefix}${n}`)]}case ci.prefix:{const t=e??ci;return[ci.prefix,t.decode(n)]}case ns.prefix:{const t=e??ns;return[ns.prefix,t.decode(n)]}case go.prefix:{const t=e??go;return[go.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function FS(n,e,t){const{prefix:i}=t;if(i!==ci.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const r=e.get(i);if(r==null){const s=t.encode(n).slice(1);return e.set(i,s),s}else return r}function NS(n,e,t){const{prefix:i}=t,r=e.get(i);if(r==null){const s=t.encode(n);return e.set(i,s),s}else return r}const Ps=112,BS=18;function Wd(n,e,t){const i=ko(n),r=i+ko(e),s=new Uint8Array(r+t.byteLength);return zo(n,s,0),zo(e,s,i),s.set(t,r),s}const OS=Symbol.for("@ipld/js-cid/CID"),ou={...fS,...kw,...hS,...Fw,...Ow,...tS,...iS,...sS,...cS,...Xw};function sm(n,e,t,i){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:i}}}const qd=sm("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Yl=sm("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Jp(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),am={utf8:qd,"utf-8":qd,hex:ou.base16,latin1:Yl,ascii:Yl,binary:Yl,...ou};function om(n,e="utf8"){const t=am[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function Vo(n,e="utf8"){const t=am[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}class gr extends Error{constructor(){super(...arguments);j(this,"name","InvalidMultiaddrError")}}j(gr,"name","InvalidMultiaddrError");class gs extends Error{constructor(){super(...arguments);j(this,"name","ValidationError")}}j(gs,"name","ValidationError");class lm extends Error{constructor(){super(...arguments);j(this,"name","UnknownProtocolError")}}j(lm,"name","UnknownProtocolError");const zS=4,kS=6,VS=273,GS=33,HS=41,WS=42,qS=43,XS=53,$S=54,YS=55,jS=56,KS=132,ZS=301,QS=302,JS=400,e1=421,t1=444,n1=445,i1=446,r1=447,s1=448,a1=449,o1=454,l1=460,c1=461,u1=465,h1=466,d1=480,f1=481,p1=443,m1=477,g1=478,v1=479,x1=277,y1=275,_1=276,b1=280,w1=281,S1=290,M1=777;function Xd(n){return e=>Vo(e,n)}function $d(n){return e=>om(e,n)}function Vs(n){return new DataView(n.buffer).getUint16(n.byteOffset).toString()}function Yr(n){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof n=="string"?parseInt(n):n),new Uint8Array(e)}function E1(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=om(e[0],"base32"),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const r=Yr(i);return em([t,r],t.length+r.length)}function T1(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=ns.decode(`b${e[0]}`),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const r=Yr(i);return em([t,r],t.length+r.length)}function Yd(n){const e=n.subarray(0,n.length-2),t=n.subarray(n.length-2),i=Vo(e,"base32"),r=Vs(t);return`${i}:${r}`}const cm=function(n){n=n.toString().trim();const e=new Uint8Array(4);return n.split(/\./g).forEach((t,i)=>{const r=parseInt(t,10);if(isNaN(r)||r<0||r>255)throw new gr("Invalid byte value in IP address");e[i]=r}),e},A1=function(n){let e=0;n=n.toString().trim();const t=n.split(":",8);let i;for(i=0;i<t.length;i++){const s=Qp(t[i]);let a;s&&(a=cm(t[i]),t[i]=Vo(a.subarray(0,2),"base16")),a!=null&&++i<8&&t.splice(i,0,Vo(a.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(i=0;i<t.length&&t[i]!=="";i++);const s=[i,1];for(i=9-t.length;i>0;i--)s.push("0");t.splice.apply(t,s)}const r=new Uint8Array(e+16);for(i=0;i<t.length;i++){t[i]===""&&(t[i]="0");const s=parseInt(t[i],16);if(isNaN(s)||s<0||s>65535)throw new gr("Invalid byte value in IP address");r[e++]=s>>8&255,r[e++]=s&255}return r},C1=function(n){if(n.byteLength!==4)throw new gr("IPv4 address was incorrect length");const e=[];for(let t=0;t<n.byteLength;t++)e.push(n[t]);return e.join(".")},R1=function(n){if(n.byteLength!==16)throw new gr("IPv6 address was incorrect length");const e=[];for(let i=0;i<n.byteLength;i+=2){const r=n[i],s=n[i+1],a=`${r.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(a)}const t=e.join(":");try{const i=new URL(`http://[${t}]`);return i.hostname.substring(1,i.hostname.length-1)}catch{throw new gr(`Invalid IPv6 address "${t}"`)}};function P1(n){try{const e=new URL(`http://[${n}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new gr(`Invalid IPv6 address "${n}"`)}}const jl=Object.values(ou).map(n=>n.decoder),D1=(function(){let n=jl[0].or(jl[1]);return jl.slice(2).forEach(e=>n=n.or(e)),n})();function L1(n){return D1.decode(n)}function I1(n){return e=>n.encoder.encode(e)}function U1(n){if(parseInt(n).toString()!==n)throw new gs("Value must be an integer")}function F1(n){if(n<0)throw new gs("Value must be a positive integer, or zero")}function N1(n){return e=>{if(e>n)throw new gs(`Value must be smaller than or equal to ${n}`)}}function B1(...n){return e=>{for(const t of n)t(e)}}const Ka=B1(U1,F1,N1(65535)),_n=-1;class O1{constructor(){j(this,"protocolsByCode",new Map);j(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new lm(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(i=>{this.protocolsByName.set(i,e)})}removeProtocol(e){var i;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(i=t.aliases)==null||i.forEach(r=>{this.protocolsByName.delete(r)}))}}const z1=new O1,k1=[{code:zS,name:"ip4",size:32,valueToBytes:cm,bytesToValue:C1,validate:n=>{if(!Qp(n))throw new gs(`Invalid IPv4 address "${n}"`)}},{code:kS,name:"tcp",size:16,valueToBytes:Yr,bytesToValue:Vs,validate:Ka},{code:VS,name:"udp",size:16,valueToBytes:Yr,bytesToValue:Vs,validate:Ka},{code:GS,name:"dccp",size:16,valueToBytes:Yr,bytesToValue:Vs,validate:Ka},{code:HS,name:"ip6",size:128,valueToBytes:A1,bytesToValue:R1,stringToValue:P1,validate:n=>{if(!vw(n))throw new gs(`Invalid IPv6 address "${n}"`)}},{code:WS,name:"ip6zone",size:_n},{code:qS,name:"ipcidr",size:8,bytesToValue:Xd("base10"),valueToBytes:$d("base10")},{code:XS,name:"dns",size:_n},{code:$S,name:"dns4",size:_n},{code:YS,name:"dns6",size:_n},{code:jS,name:"dnsaddr",size:_n},{code:KS,name:"sctp",size:16,valueToBytes:Yr,bytesToValue:Vs,validate:Ka},{code:ZS,name:"udt"},{code:QS,name:"utp"},{code:JS,name:"unix",size:_n,stringToValue:n=>decodeURIComponent(n),valueToString:n=>encodeURIComponent(n)},{code:e1,name:"p2p",aliases:["ipfs"],size:_n,bytesToValue:Xd("base58btc"),valueToBytes:n=>n.startsWith("Q")||n.startsWith("1")?$d("base58btc")(n):IS.parse(n).multihash.bytes},{code:t1,name:"onion",size:96,bytesToValue:Yd,valueToBytes:E1},{code:n1,name:"onion3",size:296,bytesToValue:Yd,valueToBytes:T1},{code:i1,name:"garlic64",size:_n},{code:r1,name:"garlic32",size:_n},{code:s1,name:"tls"},{code:a1,name:"sni",size:_n},{code:o1,name:"noise"},{code:l1,name:"quic"},{code:c1,name:"quic-v1"},{code:u1,name:"webtransport"},{code:h1,name:"certhash",size:_n,bytesToValue:I1(im),valueToBytes:L1},{code:d1,name:"http"},{code:f1,name:"http-path",size:_n,stringToValue:n=>`/${decodeURIComponent(n)}`,valueToString:n=>encodeURIComponent(n.substring(1))},{code:p1,name:"https"},{code:m1,name:"ws"},{code:g1,name:"wss"},{code:v1,name:"p2p-websocket-star"},{code:x1,name:"p2p-stardust"},{code:y1,name:"p2p-webrtc-star"},{code:_1,name:"p2p-webrtc-direct"},{code:b1,name:"webrtc-direct"},{code:w1,name:"webrtc"},{code:S1,name:"p2p-circuit"},{code:M1,name:"memory",size:_n}];k1.forEach(n=>{z1.addProtocol(n)});function lu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return Kd(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Kd(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function V1(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const jd=4096;function G1(n){const e=n.length;if(e<=jd)return String.fromCharCode.apply(String,n);let t="",i=0;for(;i<e;)t+=String.fromCharCode.apply(String,n.subarray(i,i+=jd));return t}function H1(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function Kd(n){return H1(n)?n:n.slice()}function W1(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var h=n.length,d=n.charAt(0),f=Math.log(h)/Math.log(256),g=Math.log(256)/Math.log(h);function p(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var v=0,_=0,x=0,M=u.length;x!==M&&u[x]===0;)x++,v++;for(var S=(M-x)*g+1>>>0,E=new Uint8Array(S);x!==M;){for(var C=u[x],w=0,b=S-1;(C!==0||w<_)&&b!==-1;b--,w++)C+=256*E[b]>>>0,E[b]=C%h>>>0,C=C/h>>>0;if(C!==0)throw new Error("Non-zero carry");_=w,x++}for(var R=S-_;R!==S&&E[R]===0;)R++;for(var I=d.repeat(v);R<S;++R)I+=n.charAt(E[R]);return I}function y(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var v=0;if(u[v]!==" "){for(var _=0,x=0;u[v]===d;)_++,v++;for(var M=(u.length-v)*f+1>>>0,S=new Uint8Array(M);u[v];){var E=i[u.charCodeAt(v)];if(E===255)return;for(var C=0,w=M-1;(E!==0||C<x)&&w!==-1;w--,C++)E+=h*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");x=C,v++}if(u[v]!==" "){for(var b=M-x;b!==M&&S[b]===0;)b++;for(var R=new Uint8Array(_+(M-b)),I=_;b!==M;)R[I++]=S[b++];return R}}}function m(u){var v=y(u);if(v)return v;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:y,decode:m}}var q1=W1,X1=q1;let $1=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Y1=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return um(this,e)}},j1=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return um(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function um(n,e){return new j1({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let K1=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new $1(e,t,i),this.decoder=new Y1(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function al({name:n,prefix:e,encode:t,decode:i}){return new K1(n,e,t,i)}function ga({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=X1(t,n,i);return al({prefix:e,name:n,encode:r,decode:a=>lu(s(a))})}function Z1(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const h=e[n[c]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|h,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function Q1(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function J1(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Wt({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=J1(i,r);return al({prefix:e,name:n,encode(a){return Q1(a,i,t)},decode(a){return Z1(a,s,t,n)}})}ga({prefix:"9",name:"base10",alphabet:"0123456789"});Wt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});Wt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});Wt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});const hm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),eM=hm.reduce((n,e,t)=>(n[t]=e,n),[]),tM=hm.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function nM(n){return n.reduce((e,t)=>(e+=eM[t],e),"")}function iM(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=tM[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}al({prefix:"🚀",name:"base256emoji",encode:nM,decode:iM});Wt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});ga({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});ga({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});ga({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ga({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});Wt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});Wt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});Wt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});Wt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});Wt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});al({prefix:"\0",name:"identity",encode:n=>G1(lu(n)),decode:n=>lu(V1(n))});new TextEncoder;new TextDecoder;const rM="/",sM=new TextEncoder().encode(rM);sM[0];function aM(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return n;if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return new Uint8Array(n.buffer,n.byteOffset,n.byteLength);throw new Error("Unknown type, must be binary type")}function oM(n){return new TextEncoder().encode(n)}function lM(n){return new TextDecoder().decode(n)}function cM(n,e){if(n.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),i=0;i<t.length;i++)t[i]=255;for(var r=0;r<n.length;r++){var s=n.charAt(r),a=s.charCodeAt(0);if(t[a]!==255)throw new TypeError(s+" is ambiguous");t[a]=r}var o=n.length,l=n.charAt(0),c=Math.log(o)/Math.log(256),h=Math.log(256)/Math.log(o);function d(p){if(p instanceof Uint8Array||(ArrayBuffer.isView(p)?p=new Uint8Array(p.buffer,p.byteOffset,p.byteLength):Array.isArray(p)&&(p=Uint8Array.from(p))),!(p instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(p.length===0)return"";for(var y=0,m=0,u=0,v=p.length;u!==v&&p[u]===0;)u++,y++;for(var _=(v-u)*h+1>>>0,x=new Uint8Array(_);u!==v;){for(var M=p[u],S=0,E=_-1;(M!==0||S<m)&&E!==-1;E--,S++)M+=256*x[E]>>>0,x[E]=M%o>>>0,M=M/o>>>0;if(M!==0)throw new Error("Non-zero carry");m=S,u++}for(var C=_-m;C!==_&&x[C]===0;)C++;for(var w=l.repeat(y);C<_;++C)w+=n.charAt(x[C]);return w}function f(p){if(typeof p!="string")throw new TypeError("Expected String");if(p.length===0)return new Uint8Array;var y=0;if(p[y]!==" "){for(var m=0,u=0;p[y]===l;)m++,y++;for(var v=(p.length-y)*c+1>>>0,_=new Uint8Array(v);p[y];){var x=t[p.charCodeAt(y)];if(x===255)return;for(var M=0,S=v-1;(x!==0||M<u)&&S!==-1;S--,M++)x+=o*_[S]>>>0,_[S]=x%256>>>0,x=x/256>>>0;if(x!==0)throw new Error("Non-zero carry");u=M,y++}if(p[y]!==" "){for(var E=v-u;E!==v&&_[E]===0;)E++;for(var C=new Uint8Array(m+(v-E)),w=m;E!==v;)C[w++]=_[E++];return C}}}function g(p){var y=f(p);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:d,decodeUnsafe:f,decode:g}}var uM=cM,hM=uM;let dM=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},fM=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return dm(this,e)}},pM=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return dm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function dm(n,e){return new pM({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let mM=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new dM(e,t,i),this.decoder=new fM(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function ol({name:n,prefix:e,encode:t,decode:i}){return new mM(n,e,t,i)}function va({name:n,prefix:e,alphabet:t}){const{encode:i,decode:r}=hM(t,n);return ol({prefix:e,name:n,encode:i,decode:s=>aM(r(s))})}function gM(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const h=e[n[c]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|h,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function vM(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function xM(n){const e={};for(let t=0;t<n.length;++t)e[n[t]]=t;return e}function qt({name:n,prefix:e,bitsPerChar:t,alphabet:i}){const r=xM(i);return ol({prefix:e,name:n,encode(s){return vM(s,i,t)},decode(s){return gM(s,r,t,n)}})}const yM=va({prefix:"9",name:"base10",alphabet:"0123456789"}),_M=Object.freeze(Object.defineProperty({__proto__:null,base10:yM},Symbol.toStringTag,{value:"Module"})),bM=qt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),wM=qt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),SM=Object.freeze(Object.defineProperty({__proto__:null,base16:bM,base16upper:wM},Symbol.toStringTag,{value:"Module"})),MM=qt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),EM=Object.freeze(Object.defineProperty({__proto__:null,base2:MM},Symbol.toStringTag,{value:"Module"})),fm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),TM=fm.reduce((n,e,t)=>(n[t]=e,n),[]),AM=fm.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function CM(n){return n.reduce((e,t)=>(e+=TM[t],e),"")}function RM(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=AM[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}const PM=ol({prefix:"🚀",name:"base256emoji",encode:CM,decode:RM}),DM=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:PM},Symbol.toStringTag,{value:"Module"})),LM=qt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),IM=qt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),UM=qt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),FM=qt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),NM=qt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),BM=qt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),OM=qt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),zM=qt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),kM=qt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),VM=Object.freeze(Object.defineProperty({__proto__:null,base32:LM,base32hex:NM,base32hexpad:OM,base32hexpadupper:zM,base32hexupper:BM,base32pad:UM,base32padupper:FM,base32upper:IM,base32z:kM},Symbol.toStringTag,{value:"Module"})),GM=va({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),HM=va({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),WM=Object.freeze(Object.defineProperty({__proto__:null,base36:GM,base36upper:HM},Symbol.toStringTag,{value:"Module"})),qM=va({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),XM=va({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),$M=Object.freeze(Object.defineProperty({__proto__:null,base58btc:qM,base58flickr:XM},Symbol.toStringTag,{value:"Module"})),YM=qt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),jM=qt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),KM=qt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),ZM=qt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),QM=Object.freeze(Object.defineProperty({__proto__:null,base64:YM,base64pad:jM,base64url:KM,base64urlpad:ZM},Symbol.toStringTag,{value:"Module"})),JM=qt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),eE=Object.freeze(Object.defineProperty({__proto__:null,base8:JM},Symbol.toStringTag,{value:"Module"})),tE=ol({prefix:"\0",name:"identity",encode:n=>lM(n),decode:n=>oM(n)}),nE=Object.freeze(Object.defineProperty({__proto__:null,identity:tE},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Zd={...nE,...EM,...eE,..._M,...SM,...VM,...WM,...$M,...QM,...DM};function cu(n=0){return new Uint8Array(n)}function Go(n=0){return new Uint8Array(n)}function pm(n,e,t,i){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:i}}}const Qd=pm("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Kl=pm("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Go(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),iE={utf8:Qd,"utf-8":Qd,hex:Zd.base16,latin1:Kl,ascii:Kl,binary:Kl,...Zd};function rE(n,e="utf8"){const t=iE[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}const sE=Math.pow(2,7),aE=Math.pow(2,14),oE=Math.pow(2,21),mm=Math.pow(2,28),gm=Math.pow(2,35),vm=Math.pow(2,42),xm=Math.pow(2,49),sn=128,Ci=127;function Ku(n){if(n<sE)return 1;if(n<aE)return 2;if(n<oE)return 3;if(n<mm)return 4;if(n<gm)return 5;if(n<vm)return 6;if(n<xm)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function lE(n,e,t=0){switch(Ku(n)){case 8:e[t++]=n&255|sn,n/=128;case 7:e[t++]=n&255|sn,n/=128;case 6:e[t++]=n&255|sn,n/=128;case 5:e[t++]=n&255|sn,n/=128;case 4:e[t++]=n&255|sn,n>>>=7;case 3:e[t++]=n&255|sn,n>>>=7;case 2:e[t++]=n&255|sn,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function cE(n,e){let t=n[e],i=0;if(i+=t&Ci,t<sn||(t=n[e+1],i+=(t&Ci)<<7,t<sn)||(t=n[e+2],i+=(t&Ci)<<14,t<sn)||(t=n[e+3],i+=(t&Ci)<<21,t<sn)||(t=n[e+4],i+=(t&Ci)*mm,t<sn)||(t=n[e+5],i+=(t&Ci)*gm,t<sn)||(t=n[e+6],i+=(t&Ci)*vm,t<sn)||(t=n[e+7],i+=(t&Ci)*xm,t<sn))return i;throw new RangeError("Could not decode varint")}const Zu=new Float32Array([-0]),Ii=new Uint8Array(Zu.buffer);function uE(n,e,t){Zu[0]=n,e[t]=Ii[0],e[t+1]=Ii[1],e[t+2]=Ii[2],e[t+3]=Ii[3]}function hE(n,e){return Ii[0]=n[e],Ii[1]=n[e+1],Ii[2]=n[e+2],Ii[3]=n[e+3],Zu[0]}const Qu=new Float64Array([-0]),Kt=new Uint8Array(Qu.buffer);function dE(n,e,t){Qu[0]=n,e[t]=Kt[0],e[t+1]=Kt[1],e[t+2]=Kt[2],e[t+3]=Kt[3],e[t+4]=Kt[4],e[t+5]=Kt[5],e[t+6]=Kt[6],e[t+7]=Kt[7]}function fE(n,e){return Kt[0]=n[e],Kt[1]=n[e+1],Kt[2]=n[e+2],Kt[3]=n[e+3],Kt[4]=n[e+4],Kt[5]=n[e+5],Kt[6]=n[e+6],Kt[7]=n[e+7],Qu[0]}const pE=BigInt(Number.MAX_SAFE_INTEGER),mE=BigInt(Number.MIN_SAFE_INTEGER);class Zt{constructor(e,t){j(this,"lo");j(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(t+i*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(BigInt(t)+(BigInt(i)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,i=this.hi>>>24;return i===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:i<128?9:10}static fromBigInt(e){if(e===0n)return ur;if(e<pE&&e>mE)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let i=e>>32n,r=e-(i<<32n);return t&&(i=~i|0n,r=~r|0n,++r>Jd&&(r=0n,++i>Jd&&(i=0n))),new Zt(Number(r),Number(i))}static fromNumber(e){if(e===0)return ur;const t=e<0;t&&(e=-e);let i=e>>>0,r=(e-i)/4294967296>>>0;return t&&(r=~r>>>0,i=~i>>>0,++i>4294967295&&(i=0,++r>4294967295&&(r=0))),new Zt(i,r)}static from(e){return typeof e=="number"?Zt.fromNumber(e):typeof e=="bigint"?Zt.fromBigInt(e):typeof e=="string"?Zt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Zt(e.low>>>0,e.high>>>0):ur}}const ur=new Zt(0,0);ur.toBigInt=function(){return 0n};ur.zzEncode=ur.zzDecode=function(){return this};ur.length=function(){return 1};const Jd=4294967296n;function gE(n){let e=0,t=0;for(let i=0;i<n.length;++i)t=n.charCodeAt(i),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(i+1)&64512)===56320?(++i,e+=4):e+=3;return e}function vE(n,e,t){if(t-e<1)return"";let r;const s=[];let a=0,o;for(;e<t;)o=n[e++],o<128?s[a++]=o:o>191&&o<224?s[a++]=(o&31)<<6|n[e++]&63:o>239&&o<365?(o=((o&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,s[a++]=55296+(o>>10),s[a++]=56320+(o&1023)):s[a++]=(o&15)<<12|(n[e++]&63)<<6|n[e++]&63,a>8191&&((r??(r=[])).push(String.fromCharCode.apply(String,s)),a=0);return r!=null?(a>0&&r.push(String.fromCharCode.apply(String,s.slice(0,a))),r.join("")):String.fromCharCode.apply(String,s.slice(0,a))}function ym(n,e,t){const i=t;let r,s;for(let a=0;a<n.length;++a)r=n.charCodeAt(a),r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&((s=n.charCodeAt(a+1))&64512)===56320?(r=65536+((r&1023)<<10)+(s&1023),++a,e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128);return t-i}function kn(n,e){return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function Za(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class xE{constructor(e){j(this,"buf");j(this,"pos");j(this,"len");j(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,kn(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw kn(this,4);return Za(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw kn(this,4);return Za(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw kn(this,4);const e=hE(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw kn(this,4);const e=fE(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,i=this.pos+e;if(i>this.len)throw kn(this,e);return this.pos+=e,t===i?new Uint8Array(0):this.buf.subarray(t,i)}string(){const e=this.bytes();return vE(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw kn(this,e);this.pos+=e}else do if(this.pos>=this.len)throw kn(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Zt(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw kn(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw kn(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw kn(this,8);const e=Za(this.buf,this.pos+=4),t=Za(this.buf,this.pos+=4);return new Zt(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=cE(this.buf,this.pos);return this.pos+=Ku(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function yE(n){return new xE(n instanceof Uint8Array?n:n.subarray())}function Ju(n,e,t){const i=yE(n);return e.decode(i,void 0,t)}function _E(n){let i,r=8192;return function(a){if(a<1||a>4096)return Go(a);r+a>8192&&(i=Go(8192),r=0);const o=i.subarray(r,r+=a);return(r&7)!==0&&(r=(r|7)+1),o}}class Gs{constructor(e,t,i){j(this,"fn");j(this,"len");j(this,"next");j(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=i}}function Zl(){}class bE{constructor(e){j(this,"head");j(this,"tail");j(this,"len");j(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const wE=_E();function SE(n){return globalThis.Buffer!=null?Go(n):wE(n)}class uu{constructor(){j(this,"len");j(this,"head");j(this,"tail");j(this,"states");this.len=0,this.head=new Gs(Zl,0,0),this.tail=this.head,this.states=null}_push(e,t,i){return this.tail=this.tail.next=new Gs(e,t,i),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new EE((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Qa,10,Zt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Zt.fromBigInt(e);return this._push(Qa,t.length(),t)}uint64Number(e){return this._push(lE,Ku(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Zt.fromBigInt(e).zzEncode();return this._push(Qa,t.length(),t)}sint64Number(e){const t=Zt.fromNumber(e).zzEncode();return this._push(Qa,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Ql,1,e?1:0)}fixed32(e){return this._push(Ds,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Zt.fromBigInt(e);return this._push(Ds,4,t.lo)._push(Ds,4,t.hi)}fixed64Number(e){const t=Zt.fromNumber(e);return this._push(Ds,4,t.lo)._push(Ds,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(uE,4,e)}double(e){return this._push(dE,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(Ql,1,0):this.uint32(t)._push(TE,t,e)}string(e){const t=gE(e);return t!==0?this.uint32(t)._push(ym,t,e):this._push(Ql,1,0)}fork(){return this.states=new bE(this),this.head=this.tail=new Gs(Zl,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Gs(Zl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,i=this.len;return this.reset().uint32(i),i!==0&&(this.tail.next=e.next,this.tail=t,this.len+=i),this}finish(){let e=this.head.next;const t=SE(this.len);let i=0;for(;e!=null;)e.fn(e.val,t,i),i+=e.len,e=e.next;return t}}function Ql(n,e,t){e[t]=n&255}function ME(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class EE extends Gs{constructor(t,i){super(ME,t,i);j(this,"next");this.next=void 0}}function Qa(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Ds(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function TE(n,e,t){e.set(n,t)}globalThis.Buffer!=null&&(uu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(AE,e,n),this},uu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(CE,e,n),this});function AE(n,e,t){e.set(n,t)}function CE(n,e,t){n.length<40?ym(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(rE(n),t)}function RE(){return new uu}function eh(n,e){const t=RE();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}var hu;(function(n){n[n.VARINT=0]="VARINT",n[n.BIT64=1]="BIT64",n[n.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",n[n.START_GROUP=3]="START_GROUP",n[n.END_GROUP=4]="END_GROUP",n[n.BIT32=5]="BIT32"})(hu||(hu={}));function PE(n,e,t,i){return{name:n,type:e,encode:t,decode:i}}function th(n,e){return PE("message",hu.LENGTH_DELIMITED,n,e)}class du extends Error{constructor(){super(...arguments);j(this,"code","ERR_MAX_LENGTH");j(this,"name","MaxLengthError")}}var hp,dp;(dp=(hp=globalThis.process)==null?void 0:hp.env)!=null&&dp.DUMP_SESSION_KEYS;var Ho;(function(n){let e;n.codec=()=>(e==null&&(e=th((t,i,r={})=>{if(r.lengthDelimited!==!1&&i.fork(),t.webtransportCerthashes!=null)for(const s of t.webtransportCerthashes)i.uint32(10),i.bytes(s);if(t.streamMuxers!=null)for(const s of t.streamMuxers)i.uint32(18),i.string(s);r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o,l;const s={webtransportCerthashes:[],streamMuxers:[]},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const c=t.uint32();switch(c>>>3){case 1:{if(((o=r.limits)==null?void 0:o.webtransportCerthashes)!=null&&s.webtransportCerthashes.length===r.limits.webtransportCerthashes)throw new du('Decode error - map field "webtransportCerthashes" had too many elements');s.webtransportCerthashes.push(t.bytes());break}case 2:{if(((l=r.limits)==null?void 0:l.streamMuxers)!=null&&s.streamMuxers.length===r.limits.streamMuxers)throw new du('Decode error - map field "streamMuxers" had too many elements');s.streamMuxers.push(t.string());break}default:{t.skipType(c&7);break}}}return s})),e),n.encode=t=>eh(t,n.codec()),n.decode=(t,i)=>Ju(t,n.codec(),i)})(Ho||(Ho={}));var ef;(function(n){let e;n.codec=()=>(e==null&&(e=th((t,i,r={})=>{r.lengthDelimited!==!1&&i.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(i.uint32(10),i.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(i.uint32(18),i.bytes(t.identitySig)),t.extensions!=null&&(i.uint32(34),Ho.codec().encode(t.extensions,i)),r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o;const s={identityKey:cu(0),identitySig:cu(0)},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{s.identityKey=t.bytes();break}case 2:{s.identitySig=t.bytes();break}case 4:{s.extensions=Ho.codec().decode(t,t.uint32(),{limits:(o=r.limits)==null?void 0:o.extensions});break}default:{t.skipType(l&7);break}}}return s})),e),n.encode=t=>eh(t,n.codec()),n.decode=(t,i)=>Ju(t,n.codec(),i)})(ef||(ef={}));var tf;(function(n){let e;n.codec=()=>(e==null&&(e=th((t,i,r={})=>{if(r.lengthDelimited!==!1&&i.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(i.uint32(10),i.bytes(t.publicKey)),t.addrs!=null)for(const s of t.addrs)i.uint32(18),i.bytes(s);r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o;const s={publicKey:cu(0),addrs:[]},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{s.publicKey=t.bytes();break}case 2:{if(((o=r.limits)==null?void 0:o.addrs)!=null&&s.addrs.length===r.limits.addrs)throw new du('Decode error - map field "addrs" had too many elements');s.addrs.push(t.bytes());break}default:{t.skipType(l&7);break}}}return s})),e),n.encode=t=>eh(t,n.codec()),n.decode=(t,i)=>Ju(t,n.codec(),i)})(tf||(tf={}));new TextEncoder;new TextDecoder;function DE(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function nh(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return oa(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return oa(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function LE(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function oa(n){return LE(n)?n:n.slice()}function IE(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var h=n.length,d=n.charAt(0),f=Math.log(h)/Math.log(256),g=Math.log(256)/Math.log(h);function p(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var v=0,_=0,x=0,M=u.length;x!==M&&u[x]===0;)x++,v++;for(var S=(M-x)*g+1>>>0,E=new Uint8Array(S);x!==M;){for(var C=u[x],w=0,b=S-1;(C!==0||w<_)&&b!==-1;b--,w++)C+=256*E[b]>>>0,E[b]=C%h>>>0,C=C/h>>>0;if(C!==0)throw new Error("Non-zero carry");_=w,x++}for(var R=S-_;R!==S&&E[R]===0;)R++;for(var I=d.repeat(v);R<S;++R)I+=n.charAt(E[R]);return I}function y(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var v=0;if(u[v]!==" "){for(var _=0,x=0;u[v]===d;)_++,v++;for(var M=(u.length-v)*f+1>>>0,S=new Uint8Array(M);u[v];){var E=i[u.charCodeAt(v)];if(E===255)return;for(var C=0,w=M-1;(E!==0||C<x)&&w!==-1;w--,C++)E+=h*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");x=C,v++}if(u[v]!==" "){for(var b=M-x;b!==M&&S[b]===0;)b++;for(var R=new Uint8Array(_+(M-b)),I=_;b!==M;)R[I++]=S[b++];return R}}}function m(u){var v=y(u);if(v)return v;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:y,decode:m}}var UE=IE,FE=UE;let NE=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},BE=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return _m(this,e)}},OE=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return _m(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function _m(n,e){return new OE({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let zE=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new NE(e,t,i),this.decoder=new BE(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function bm({name:n,prefix:e,encode:t,decode:i}){return new zE(n,e,t,i)}function ll({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=FE(t,n,i);return bm({prefix:e,name:n,encode:r,decode:a=>nh(s(a))})}function kE(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const h=e[n[c]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|h,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function VE(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function GE(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function _i({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=GE(i,r);return bm({prefix:e,name:n,encode(a){return VE(a,i,t)},decode(a){return kE(a,s,t,n)}})}const vo=_i({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});_i({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Jl=ll({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});ll({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Di=ll({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ll({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var HE=wm,nf=128,WE=-128,qE=Math.pow(2,31);function wm(n,e,t){e=e||[],t=t||0;for(var i=t;n>=qE;)e[t++]=n&255|nf,n/=128;for(;n&WE;)e[t++]=n&255|nf,n>>>=7;return e[t]=n|0,wm.bytes=t-i+1,e}var XE=fu,$E=128,rf=127;function fu(n,i){var t=0,i=i||0,r=0,s=i,a,o=n.length;do{if(s>=o)throw fu.bytes=0,new RangeError("Could not decode varint");a=n[s++],t+=r<28?(a&rf)<<r:(a&rf)*Math.pow(2,r),r+=7}while(a>=$E);return fu.bytes=s-i,t}var YE=Math.pow(2,7),jE=Math.pow(2,14),KE=Math.pow(2,21),ZE=Math.pow(2,28),QE=Math.pow(2,35),JE=Math.pow(2,42),e2=Math.pow(2,49),t2=Math.pow(2,56),n2=Math.pow(2,63),i2=function(n){return n<YE?1:n<jE?2:n<KE?3:n<ZE?4:n<QE?5:n<JE?6:n<e2?7:n<t2?8:n<n2?9:10},r2={encode:HE,decode:XE,encodingLength:i2},Wo=r2;function pu(n,e=0){const t=Wo.decode(n,e),i=Wo.decode.bytes;if(i>9)throw new RangeError("Invalid varint: too long");if(i>1&&n[e+i-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,i]}function qo(n,e,t=0){return Wo.encode(n,e,t),e}function Xo(n){return Wo.encodingLength(n)}function s2(n,e){const t=e.byteLength,i=Xo(n),r=i+Xo(t),s=new Uint8Array(r+t);return qo(n,s,0),qo(t,s,i),s.set(e,r),new ih(n,t,e,s)}function a2(n){const e=nh(n),[t,i]=pu(e),[r,s]=pu(e.subarray(i)),a=e.subarray(i+s);if(a.byteLength!==r)throw new Error("Incorrect length");return new ih(t,r,a,e)}function o2(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&DE(n.bytes,t.bytes)}}class ih{constructor(e,t,i,r){j(this,"code");j(this,"size");j(this,"digest");j(this,"bytes");this.code=e,this.size=t,this.digest=oa(i),this.bytes=oa(r)}}function sf(n,e){const{bytes:t,version:i}=n;switch(i){case 0:return c2(t,mu(n),e??Di.encoder);default:return u2(t,mu(n),e??vo.encoder)}}const af=new WeakMap;function mu(n){const e=af.get(n);if(e==null){const t=new Map;return af.set(n,t),t}return e}var fp;class zt{constructor(e,t,i,r){j(this,"code");j(this,"version");j(this,"multihash");j(this,"bytes");j(this,"/");j(this,fp,"CID");this.code=t,this.version=e,this.multihash=i,this.bytes=oa(r),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Ls)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==h2)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return zt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,i=s2(e,t);return zt.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return zt.equals(this,e)}static equals(e,t){const i=t;return i!=null&&e.code===i.code&&e.version===i.version&&o2(e.multihash,i.multihash)}toString(e){return sf(this,e)}toJSON(){return{"/":sf(this)}}link(){return this}[(fp=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof zt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:i,code:r,multihash:s,bytes:a}=t;return new zt(i,r,s,a??of(i,r,s.bytes))}else if(t[d2]===!0){const{version:i,multihash:r,code:s}=t,a=a2(r);return zt.create(i,s,a)}else return null}static create(e,t,i){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Ls)throw new Error(`Version 0 CID must use dag-pb (code: ${Ls}) block encoding`);return new zt(e,t,i,i.bytes)}case 1:{const r=of(e,t,i.bytes);return new zt(e,t,i,r)}default:throw new Error("Invalid version")}}static createV0(e){return zt.create(0,Ls,e)}static createV1(e,t){return zt.create(1,e,t)}static decode(e){const[t,i]=zt.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=zt.inspectBytes(e),i=t.size-t.multihashSize,r=nh(e.subarray(i,i+t.multihashSize));if(r.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=r.subarray(t.multihashSize-t.digestSize),a=new ih(t.multihashCode,t.digestSize,s,r);return[t.version===0?zt.createV0(a):zt.createV1(t.codec,a),e.subarray(t.size)]}static inspectBytes(e){let t=0;const i=()=>{const[d,f]=pu(e.subarray(t));return t+=f,d};let r=i(),s=Ls;if(r===18?(r=0,t=0):s=i(),r!==0&&r!==1)throw new RangeError(`Invalid CID version ${r}`);const a=t,o=i(),l=i(),c=t+l,h=c-a;return{version:r,codec:s,multihashCode:o,digestSize:l,multihashSize:h,size:c}}static parse(e,t){const[i,r]=l2(e,t),s=zt.decode(r);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return mu(s).set(i,e),s}}function l2(n,e){switch(n[0]){case"Q":{const t=e??Di;return[Di.prefix,t.decode(`${Di.prefix}${n}`)]}case Di.prefix:{const t=e??Di;return[Di.prefix,t.decode(n)]}case vo.prefix:{const t=e??vo;return[vo.prefix,t.decode(n)]}case Jl.prefix:{const t=e??Jl;return[Jl.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function c2(n,e,t){const{prefix:i}=t;if(i!==Di.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const r=e.get(i);if(r==null){const s=t.encode(n).slice(1);return e.set(i,s),s}else return r}function u2(n,e,t){const{prefix:i}=t,r=e.get(i);if(r==null){const s=t.encode(n);return e.set(i,s),s}else return r}const Ls=112,h2=18;function of(n,e,t){const i=Xo(n),r=i+Xo(e),s=new Uint8Array(r+t.byteLength);return qo(n,s,0),qo(e,s,i),s.set(t,r),s}const d2=Symbol.for("@ipld/js-cid/CID");function f2(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return lf(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return lf(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function p2(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function lf(n){return p2(n)?n:n.slice()}function m2(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var h=n.length,d=n.charAt(0),f=Math.log(h)/Math.log(256),g=Math.log(256)/Math.log(h);function p(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var v=0,_=0,x=0,M=u.length;x!==M&&u[x]===0;)x++,v++;for(var S=(M-x)*g+1>>>0,E=new Uint8Array(S);x!==M;){for(var C=u[x],w=0,b=S-1;(C!==0||w<_)&&b!==-1;b--,w++)C+=256*E[b]>>>0,E[b]=C%h>>>0,C=C/h>>>0;if(C!==0)throw new Error("Non-zero carry");_=w,x++}for(var R=S-_;R!==S&&E[R]===0;)R++;for(var I=d.repeat(v);R<S;++R)I+=n.charAt(E[R]);return I}function y(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var v=0;if(u[v]!==" "){for(var _=0,x=0;u[v]===d;)_++,v++;for(var M=(u.length-v)*f+1>>>0,S=new Uint8Array(M);u[v];){var E=i[u.charCodeAt(v)];if(E===255)return;for(var C=0,w=M-1;(E!==0||C<x)&&w!==-1;w--,C++)E+=h*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");x=C,v++}if(u[v]!==" "){for(var b=M-x;b!==M&&S[b]===0;)b++;for(var R=new Uint8Array(_+(M-b)),I=_;b!==M;)R[I++]=S[b++];return R}}}function m(u){var v=y(u);if(v)return v;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:y,decode:m}}var g2=m2,v2=g2;class x2{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class y2{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Sm(this,e)}}class _2{constructor(e){j(this,"decoders");this.decoders=e}or(e){return Sm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Sm(n,e){return new _2({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class b2{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new x2(e,t,i),this.decoder=new y2(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Mm({name:n,prefix:e,encode:t,decode:i}){return new b2(n,e,t,i)}function cl({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=v2(t,n,i);return Mm({prefix:e,name:n,encode:r,decode:a=>f2(s(a))})}function w2(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const h=e[n[c]];if(h===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|h,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function S2(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function M2(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function bi({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=M2(i,r);return Mm({prefix:e,name:n,encode(a){return S2(a,i,t)},decode(a){return w2(a,s,t,n)}})}bi({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});bi({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});cl({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});cl({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});cl({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});cl({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;new TextEncoder;const E2="peercompute.gpu.resident-stage-executor.v0",T2="peercompute.gpu.resident-stage-worker-policy.v0";function Vn(n,e=null){return String(n??"").trim()||e}function ec(n){return n==null?null:JSON.parse(JSON.stringify(n))}function cf(n,e=!1){return typeof n=="boolean"?n:e}function A2(n,e=null){const t=Math.floor(Number(n));return Number.isFinite(t)&&t>=0?t:e}function C2(n={},e=null){const t=n&&typeof n=="object"?n:{},i=Vn(t.mode??t.residencyMode,null),r=!!(t.worker||t.workerReady||t.workerModuleUrl||t.workerType),s=i||(r?"dedicated-worker":"inline"),a=cf(t.workerReady,!1)||!!t.worker,o=s==="dedicated-worker"||s==="webgpu-worker"||s==="gpu-compute-worker",l=o?"dedicated-worker":"inline",c=o?a?"worker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:T2,stageId:e,mode:l,status:c,workerType:Vn(t.workerType,o?"webgpu-compute-worker":null),workerModuleUrl:Vn(t.workerModuleUrl??t.moduleUrl,null),startupMode:Vn(t.startupMode,o?"warm-on-first-use":"inline"),idleTtlMs:A2(t.idleTtlMs,o?6e4:null),sameDeviceRequired:cf(t.sameDeviceRequired,o),bufferTransferPolicy:Vn(t.bufferTransferPolicy,o?"worker-owns-device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:c==="blocked-worker-backend-missing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function R2(n,e){if(typeof n=="function")return n(e);if(n&&typeof n.runStage=="function")return n.runStage(e);throw new Error("[GPUHubManager] Resident stage worker backend must be a function or expose runStage()")}class P2{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,this.residentStageExecutorAliases=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const t=await navigator.gpu.requestAdapter(e.adapterOptions);if(!t)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await t.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,i,r){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const s=this.device.createBuffer({size:t,usage:i,label:r});return this.hotStore.set(e,s),s}removeHotBuffer(e){this.hotStore.delete(e)}registerResidentStageExecutor(e,t=null){var l;const i=typeof e=="string"?{stageId:e,executor:t}:{...e||{}},r=Vn(i.stageId??i.id,null);if(!r)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const s=i.executor||t,a=i.workerRunner||i.workerBackend||((l=i.workerPolicy)==null?void 0:l.workerRunner)||null;if(typeof s!="function"&&!a)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${r}`);const o={schema:E2,stageId:r,lawNodeId:Vn(i.lawNodeId,null),runtimeTarget:Vn(i.runtimeTarget,a?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-executor"),executor:typeof s=="function"?s:null,workerRunner:a,workerPolicy:C2({...i.workerPolicy||i.workerResidency||{},workerReady:(i.workerPolicy||i.workerResidency||{}).workerReady||!!a},r),metadata:ec(i.metadata||{}),registeredAt:Date.now()};return this.residentStageExecutors.set(r,o),o.lawNodeId&&this.residentStageExecutorAliases.set(o.lawNodeId,r),this.describeResidentStageExecutor(r)}describeResidentStageExecutor(e){const t=this.getResidentStageExecutorRecord(e);return t?{schema:t.schema,stageId:t.stageId,lawNodeId:t.lawNodeId,runtimeTarget:t.runtimeTarget,workerPolicy:ec(t.workerPolicy),metadata:ec(t.metadata||{}),registeredAt:t.registeredAt}:null}getResidentStageExecutorRecord(e){const t=Vn(typeof e=="string"?e:(e==null?void 0:e.id)??(e==null?void 0:e.stageId),null),i=Vn(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);if(t&&this.residentStageExecutors.has(t))return this.residentStageExecutors.get(t);const r=i?this.residentStageExecutorAliases.get(i):null;return r?this.residentStageExecutors.get(r):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(e)}listResidentStageExecutors(){return[...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(e))}async executeResidentStage(e={}){var r,s;const t=this.getResidentStageExecutorRecord(e.stage);if(!t){const a=Vn(((r=e.stage)==null?void 0:r.id)??((s=e.stage)==null?void 0:s.stageId),"unknown"),o=new Error(`[GPUHubManager] Missing resident stage executor: ${a}`);throw o.code="ERR_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",o.stage=e.stage||null,o}const i={...e,gpuHub:this,device:this.device,executor:this.describeResidentStageExecutor(t.stageId)};return t.workerRunner?R2(t.workerRunner,i):t.executor(i)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const Is="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Us="5ce3fd841676adf2c1a10d7193637d46007e88f7",uf=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],D2="This catalog supports verified storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function Em(n){for(const e of Object.values(n))e&&typeof e=="object"&&Em(e);return Object.freeze(n)}const L2=Em({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Is,revision:Us,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:D2},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Is}/blob/${Us}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Is,revision:Us,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Is}/blob/${Us}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Is,revision:Us},weightBytes:14199740480,totalBytes:uf.reduce((n,e)=>n+e.size,0),files:uf}});function Tm(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Tm),Object.freeze(n)),n}const I2=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",dtype:"q5_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-Q5_K_M.gguf",size:6467969824,sha256:"bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README.md",size:4013,sha256:"825f21663874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7274149e70cfd0dc7940d87",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwen3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; not a guarantee of refusal-free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidAU source. The browser adapter currently runs text only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",size:5627045888,sha256:"b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"README.md",size:5730,sha256:"eea5e514740c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e17cf35bea52a3a2d74e42b14a24a",source:{repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q8_0, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],U2=Tm(Object.fromEntries(I2.map(n=>{const{dtype:e,sourceModel:t,blockCount:i,nextnPredictLayers:r,...s}=n,o=s.files.find(l=>l.path==="LICENSE").source;return[s.id,{...s,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/"+o.repository+"/blob/"+o.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and available modification notices are included."},provenance:{repository:s.repository,revision:s.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/"+s.repository+"/blob/"+s.revision+"/README.md",sourceModel:{...t,revisionPurpose:"Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:i,nextnPredictLayers:r,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter rejects images.",behavior:s.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:e,modalities:["text"],requiredFeatures:["shader-f16"],repository:s.repository,revision:s.revision},weightBytes:s.files[0].size,totalBytes:s.files.reduce((l,c)=>l+c.size,0)}]}))),Fs="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ns="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",tc=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],gu=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function Am(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Am),Object.freeze(n)),n}const F2=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",path:"README.md"}},{path:"LICENSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"c1899de289a04d12100db370d81485cdf75e47ca",path:"LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.8B Abliterated (GGUF Q4_K_M, text)",repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",architecture:"qwen3_5",files:[{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:n,...e})=>[e.id,Am({...e,status:"execution-candidate",format:"GGUF",capabilities:gu,behavior:{kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:n,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((t,i)=>t+i.size,0)})]));Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Fs,revision:Ns,status:"execution-candidate",format:"GGUF",capabilities:gu,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Fs}/blob/${Ns}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Fs,revision:Ns,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Fs}/blob/${Ns}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Fs,revision:Ns},weightBytes:tc[0].size,totalBytes:tc.reduce((n,e)=>n+e.size,0),files:tc},...F2,...U2,...Object.fromEntries(Object.entries(L2).map(([n,e])=>[n,{...e,status:"execution-candidate",capabilities:gu}]))});const N2="transformers.js",Cm="4.3.2",kt=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),B2=Object.freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),O2=Object.freeze({maxModelBytes:kt.maxModelBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:kt.maxImagePixels}),nc=new Set(["qwen3","qwen2","llama"]);function Rm(n){return(n==null?void 0:n.architecture)==="qwen3_5"?B2:O2}function vu(n="Operation cancelled"){return(n==null?void 0:n.name)==="AbortError"?n:new DOMException(typeof n=="string"?n:"Operation cancelled","AbortError")}function rn(n){if(n!=null&&n.aborted)throw vu(n.reason)}function Ja(n){if(typeof n!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(n))throw new Error("Invalid model session ID");return n}function xu(n){if(typeof n!="string"||!n||new TextEncoder().encode(n).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(n)||n.startsWith("/")||n.split("/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return n}function z2(n){let e;try{e=JSON.stringify(n)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>kt.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const t=JSON.parse(e);if(t.schema!=="peercompute.artifact.manifest.v1"||!Array.isArray(t.files)||!t.files.length||t.files.length>kt.maxFiles)throw new Error("Invalid model manifest files");const i=new Set,r=Rm(t.model);let s=0;for(const h of t.files){if(xu(h.path),i.has(h.path))throw new Error("Duplicate model artifact path");i.add(h.path);const d=zt.parse(h.cid);if(![85,112].includes(d.code)||d.multihash.code!==18||d.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(h.size)||h.size<0||!/^[a-f0-9]{64}$/i.test(h.sha256??""))throw new Error("Invalid model file size/digest");if(h.sha256=h.sha256.toLowerCase(),s+=h.size,!Number.isSafeInteger(s)||s>r.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const a=t.model;if((a==null?void 0:a.runtime)!==N2||a.runtimeVersion!==Cm||![...nc,"idefics3","smolvlm","qwen3_5"].includes(a.architecture))throw new Error("Model runtime, architecture or dtype is not approved");if(a.task??(a.task=nc.has(a.architecture)?"text-generation":"image-text-to-text"),!["text-generation","image-text-to-text"].includes(a.task)||nc.has(a.architecture)!==(a.task==="text-generation"))throw new Error("Model task does not match its admitted architecture");const o=typeof a.dtype=="string"?[["model",a.dtype]]:a.dtype&&typeof a.dtype=="object"&&!Array.isArray(a.dtype)?Object.entries(a.dtype):[];if(!o.length||o.length>16||o.some(([h,d])=>!/^[A-Za-z0-9_-]{1,100}$/.test(h)||!["fp32","fp16","q4","q4f16","q8"].includes(d)))throw new Error("Invalid model dtype configuration");if(a.architecture==="qwen3_5"&&o.some(([,h])=>h!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=h=>h==="fp32"?"":h==="q8"?"_quantized":`_${h}`,c=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof a.dtype!="string"||a.task==="text-generation")&&c.push(...o.map(([h,d])=>`onnx/${h}${l(d)}.onnx`)),a.task==="image-text-to-text")for(const h of["embed_tokens","vision_encoder","decoder_model_merged"]){const d=typeof a.dtype=="string"?a.dtype:a.dtype[h];if(!d)throw new Error("Multimodal dtype configuration is missing a module");c.push(`onnx/${h}${l(d)}.onnx`),a.architecture==="qwen3_5"&&c.push(`onnx/${h}${l(d)}.onnx_data`)}if(c.some(h=>!i.has(h)))throw new Error("Incomplete model package");if(a.task==="image-text-to-text"&&!i.has("preprocessor_config.json")&&!i.has("processor_config.json"))throw new Error("Multimodal processor configuration is missing");if(a.requiredFeatures!==void 0&&(!Array.isArray(a.requiredFeatures)||a.requiredFeatures.length>32||a.requiredFeatures.some(h=>typeof h!="string"||h.length>80)))throw new Error("Invalid model GPU features");return{manifest:t,totalBytes:s,resourcePolicy:r}}function k2(n,e){const t=new URL(e),i={};for(const r of["mjs","wasm"]){if(typeof(n==null?void 0:n[r])!="string")throw new Error("Trusted ORT runtime assets are required");const s=new URL(n[r],t);if(s.origin!==t.origin||s.username||s.password||s.hash||!["http:","https:"].includes(s.protocol)||!s.pathname.endsWith(`.${r}`))throw new Error("ORT assets must be approved same-origin runtime files");i[r]=s.href}return i}const V2="peercompute.model-artifact-read.v1",Pm=V2;function G2(n,e){var i;const t=r=>e(r.data);return n.addEventListener("message",t),(i=n.start)==null||i.call(n),()=>n.removeEventListener("message",t)}function Ri(n,e,t=[]){n.postMessage({protocol:Pm,...e},t)}function H2(n,{manifest:e,baseUrl:t,signal:i,chunkBytes:r=kt.chunkBytes,maxReads:s=kt.maxReads,maxQueuedReads:a=32}={}){if(!Number.isInteger(s)||s<1||s>kt.maxReads||!Number.isInteger(a)||a<0||a>32)throw new RangeError("Invalid artifact reader limits");const o=new URL(t),l=new Map(e.files.map(u=>[xu(u.path),u])),c=new Map,h=[];let d=0,f=!1;function g(){for(;!f&&c.size<s&&h.length;){const u=h.shift();c.set(u.id,u),u.active=!0,Ri(n,{type:"open",id:u.id,path:u.path})}}function p(u,v){var x,M,S,E;c.delete(u.id);const _=h.indexOf(u);if(_>=0&&h.splice(_,1),i==null||i.removeEventListener("abort",u.abort),(x=u.requestSignal)==null||x.removeEventListener("abort",u.abort),v){(M=u.reject)==null||M.call(u,v);try{(S=u.streamController)==null||S.error(v)}catch{}}(E=u.resolvePull)==null||E.call(u),g()}const y=G2(n,u=>{if((u==null?void 0:u.protocol)!==Pm)return;const v=c.get(u.id);if(v){if(u.type==="error"){p(v,new Error(u.message));return}if(u.type==="ready"){if(v.ready||u.size!==v.file.size){p(v,new Error("Invalid artifact response size")),Ri(n,{type:"cancel",id:v.id});return}v.ready=!0,Ri(n,{type:"pull",id:v.id})}else if(u.type==="chunk"){if(!v.ready||!v.resolvePull||!(u.bytes instanceof Uint8Array)||!u.bytes.byteLength||u.bytes.byteLength>r||v.received+u.bytes.byteLength>v.file.size){Ri(n,{type:"cancel",id:v.id}),p(v,new Error("Invalid artifact chunk"));return}v.received+=u.bytes.byteLength,v.streamController.enqueue(u.bytes);const _=v.resolvePull;v.resolvePull=null,_()}else u.type==="end"&&(!v.ready||v.received!==v.file.size?p(v,new Error("Truncated artifact response")):(v.streamController.close(),p(v)))}});async function m(u,v={}){if(f)throw new Error("Artifact bridge is closed");if(rn(i),rn(v.signal),v.method&&v.method!=="GET")throw new Error("Model adapter supports GET only");const _=String(u);if(/[\\]/.test(_)||/%(?:2e|2f|5c|00)/i.test(_)||/\/(?:\.|\.\.)(?:\/|$)/.test(_))throw new Error("Invalid artifact URL");const x=new URL(_,o);if(x.origin!==o.origin||x.username||x.password||x.search||x.hash||!x.pathname.startsWith(o.pathname))throw new Error("Model path is outside its manifest");const M=xu(decodeURIComponent(x.pathname.slice(o.pathname.length))),S=l.get(M);if(!S)return new Response("Artifact path is not in the manifest",{status:404});const E=`read-${++d}`,C={id:E,path:M,file:S,requestSignal:v.signal,received:0,ready:!1,active:!1,queued:!1};C.abort=()=>{var b;C.active&&Ri(n,{type:"cancel",id:E}),p(C,vu((i==null?void 0:i.reason)??((b=v.signal)==null?void 0:b.reason)))};const w=new ReadableStream({start(b){C.streamController=b},pull(){if(f)throw new Error("Artifact bridge is closed");if(rn(i),rn(v.signal),!C.active&&!C.queued&&c.size>=s&&h.length>=a)throw new Error("Artifact reader limit reached");return new Promise(b=>{var R;C.resolvePull=b,C.ready?Ri(n,{type:"pull",id:E}):C.queued||(C.queued=!0,i==null||i.addEventListener("abort",C.abort,{once:!0}),(R=v.signal)==null||R.addEventListener("abort",C.abort,{once:!0}),h.push(C),g())})},cancel(){C.active&&Ri(n,{type:"cancel",id:E}),p(C)}},{highWaterMark:0});return new Response(w,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"application/octet-stream"}})}return{fetch:m,close(u="Artifact bridge closed"){if(!f){f=!0;for(const v of[...c.values(),...h])v.active&&Ri(n,{type:"cancel",id:v.id}),p(v,vu(u));y(),n.close()}}}}const xo=n=>new TextEncoder().encode(n).byteLength;function W2(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function q2(n){if(n==null)return null;if(!Number.isSafeInteger(n.width)||!Number.isSafeInteger(n.height)||n.width<1||n.height<1||n.width*n.height>kt.maxImagePixels||n.channels!==4||!(n.data instanceof Uint8Array||n.data instanceof Uint8ClampedArray)||n.data.byteLength!==n.width*n.height*4||n.data.byteLength>kt.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");return n}function X2(n){const e=n.messages??(typeof n.prompt=="string"?[{role:"user",content:n.prompt}]:null);if(!Array.isArray(e)||!e.length||e.length>kt.maxMessages)throw new Error("Invalid inference messages");let t=0;return e.map(i=>{if(!i||!["system","user","assistant"].includes(i.role)||typeof i.content!="string")throw new Error("Only text message content is accepted");if(t+=xo(i.content),t>kt.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:i.role,content:i.content}})}async function yu(n){var i;if(!n)return;let e;const t=new Set;for(const r of[n.model,n.processor,n.tokenizer])if(!(!r||t.has(r))){t.add(r);try{await((i=r.dispose)==null?void 0:i.call(r))}catch(s){e??(e=s)}}if(e)throw e}function yo(n,e=new Set){if(!(!n||typeof n!="object"||e.has(n))){if(e.add(n),typeof n.dispose=="function"){n.dispose();return}for(const t of Object.values(n))yo(t,e)}}function $2(n){const e=n.findIndex(i=>i.role==="user");if(e<0)return null;const t=n.findIndex((i,r)=>r>e&&i.role==="user");return t<0?null:n.filter((i,r)=>r<e||r>=t||i.role==="system")}function Y2(n,e,t){const i={...n.config};for(const o of["decoder","generator","text_config"])Object.assign(i,i[o]);Object.assign(i,n.generation_config);const r=Array.isArray(i.eos_token_id)?i.eos_token_id:[i.eos_token_id],s=e.at(-1),a=o=>typeof o=="bigint"||Number.isSafeInteger(o)&&o>=0;return a(s)&&r.some(o=>a(o)&&BigInt(o)===BigInt(s))?"stop":e.length>=t?"length":"unknown"}async function j2({library:n,modelPath:e,options:t,manifest:i}){const r={};try{const s=await n.AutoConfig.from_pretrained(e,t);if(s.model_type!==i.model.architecture)throw new Error("Model config architecture does not match its admitted manifest");const a={...t,config:s};if(i.model.architecture==="qwen3_5"&&(a.use_external_data_format=1),i.model.task==="image-text-to-text"){if(r.processor=await n.AutoProcessor.from_pretrained(e,t),i.model.architecture==="qwen3_5"){const o=r.processor.image_processor;if(!o)throw new Error("Qwen3.5 image processor is unavailable");o.min_pixels=256*256,o.max_pixels=Rm(i.model).maxProcessedImagePixels,o.do_normalize??(o.do_normalize=!0)}r.tokenizer=r.processor.tokenizer,r.model=await n.AutoModelForImageTextToText.from_pretrained(e,a)}else r.tokenizer=await n.AutoTokenizer.from_pretrained(e,t),r.model=await n.AutoModelForCausalLM.from_pretrained(e,a);return r}catch(s){throw await yu(r),s}}function hf(n){return{sessionId:n.sessionId,manifestCid:n.manifestCid,status:n.lost?"lost":n.status,task:n.manifest.model.task,dtype:n.manifest.model.dtype,workerId:n.workerId,adapter:n.adapter,runtimeAdapter:n.runtimeAdapter??null,gpuDispatches:n.gpuDispatches??0,gpuSubmissions:n.gpuSubmissions??0,gpuProfileSamples:n.gpuProfileSamples??0,collectGpuEvidence:n.collectGpuEvidence===!0,runtimeFeatures:n.runtimeFeatures??[],generatedRequests:n.generatedRequests}}function K2({loadLibrary:n=()=>hw(()=>import("./transformers.web-B_0RCN0l.js"),[],import.meta.url),loadModel:e=j2,gpu:t=(s=>(s=globalThis.navigator)==null?void 0:s.gpu)(),baseUrl:i=(a=>(a=globalThis.location)==null?void 0:a.href)(),assertWorker:r=W2}={}){const o=new Map;let l;async function c(d,f){var v,_,x,M,S,E,C,w;if(o.size)throw new Error("This inference worker already has a resident/loading model");const g=Ja(d.sessionId),{manifest:p}=z2(d.manifest),y=k2(d.runtimeAssets,i);if(!((v=d.artifactPort)!=null&&v.postMessage))throw new Error("An artifact reader port is required");rn(f.signal);const m={sessionId:g,manifest:p,manifestCid:d.manifestCid,status:"loading",workerId:f.workerId??null,generatedRequests:0,components:null};o.set(g,m);let u;try{const b=await(t==null?void 0:t.requestAdapter({powerPreference:"high-performance"}));if(rn(f.signal),!b||(_=b.info)!=null&&_.isFallbackAdapter||b.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fallback is disabled");const R=typeof p.model.dtype=="string"?[p.model.dtype]:Object.values(p.model.dtype),I=new Set(p.model.requiredFeatures??[]);R.some($=>["fp16","q4f16"].includes($))&&I.add("shader-f16");for(const $ of I)if(!b.features.has($))throw new Error(`Model requires unsupported GPU feature: ${$}`);m.adapter={vendor:((x=b.info)==null?void 0:x.vendor)??"",architecture:((M=b.info)==null?void 0:M.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...I]};const N=await(l??(l=n()));if(rn(f.signal),N.env.version!==Cm)throw new Error("Unexpected Transformers runtime version");const O=new URL("/__peercompute_models/",i);u=H2(d.artifactPort,{manifest:p,baseUrl:new URL(`${g}/`,O).href,signal:f.signal});const{env:H}=N;H.logLevel=50,H.allowLocalModels=!0,H.allowRemoteModels=!1,H.localModelPath=O.pathname,H.useBrowserCache=!1,H.useFSCache=!1,H.useWasmCache=!1,H.fetch=async(...$)=>{var ne;try{return await u.fetch(...$)}catch(re){throw(ne=f.emitProgress)==null||ne.call(f,{type:"artifact-read-error",sessionId:g,message:re.message}),re}},H.backends.onnx.wasm.proxy=!1,H.backends.onnx.wasm.numThreads=1,H.backends.onnx.wasm.wasmPaths=y,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=d.collectGpuEvidence===!0,H.backends.onnx.webgpu&&(H.backends.onnx.webgpu.profiling={mode:d.collectGpuEvidence===!0?"default":"off",ondata:()=>{m.gpuProfileSamples+=1}});const k={local_files_only:!0,device:"webgpu",dtype:p.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:$=>{var ne,re;(ne=f.signal)!=null&&ne.aborted||(re=f.emitProgress)==null||re.call(f,{type:"model-load",sessionId:g,status:String($.status??"").slice(0,40),file:typeof $.file=="string"?$.file.slice(0,512):void 0,loaded:Number.isFinite($.loaded)?$.loaded:void 0,total:Number.isFinite($.total)?$.total:void 0})}};m.library=N,m.components=await e({library:N,modelPath:g,options:k,manifest:p}),rn(f.signal);const q=await((S=H.backends.onnx.webgpu)==null?void 0:S.device);if(m.runtimeDevice=q,m.runtimeFeatures=[...(q==null?void 0:q.features)??[]],m.collectGpuEvidence&&q){const $=q.createCommandEncoder.bind(q),ne=q.queue.submit.bind(q.queue),re=Object.getOwnPropertyDescriptor(q,"createCommandEncoder"),he=Object.getOwnPropertyDescriptor(q.queue,"submit");m.restoreGpuEvidence=()=>{re?Object.defineProperty(q,"createCommandEncoder",re):delete q.createCommandEncoder,he?Object.defineProperty(q.queue,"submit",he):delete q.queue.submit,m.restoreGpuEvidence=null},q.createCommandEncoder=(...ge)=>{const X=$(...ge),Z=X.beginComputePass.bind(X);return X.beginComputePass=(...se)=>{const ee=Z(...se);for(const de of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const xe=ee[de].bind(ee);ee[de]=(...Ue)=>{const lt=xe(...Ue);return m.gpuDispatches+=1,lt}}return ee},X},q.queue.submit=(...ge)=>{const X=ne(...ge);return m.gpuSubmissions+=1,X}}const z=(q==null?void 0:q.adapterInfo)??((C=(E=H.backends.onnx.webgpu)==null?void 0:E.adapter)==null?void 0:C.info);if(z){if(z.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");m.runtimeAdapter={vendor:z.vendor,architecture:z.architecture,isFallbackAdapter:z.isFallbackAdapter??!1}}return q!=null&&q.lost&&q.lost.then(()=>{var $;o.get(g)===m&&(m.lost=!0,($=m.active)==null||$.abort("GPU device lost"))}),rn(f.signal),m.status="ready",hf(m)}catch(b){try{await yu(m.components),(w=m.restoreGpuEvidence)==null||w.call(m),o.delete(g)}catch(R){m.status="ready",m.lost=!0;const I=new Error(`MODEL_DISPOSE_FAILED: ${R.message}`);throw I.code="MODEL_DISPOSE_FAILED",I}throw b}finally{u==null||u.close(),u||d.artifactPort.close()}}async function h(d,f){var N,O,H,k,q;const g=o.get(Ja(d.sessionId));if(!g||g.lost)throw new Error("Model session lost or not loaded");if(g.status!=="ready")throw new Error("Model session is busy");const p=Ja(d.requestId),y=d.maxNewTokens??kt.maxNewTokens;if(!Number.isInteger(y)||y<1||y>kt.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let m=X2(d);const u=q2(d.image);if(u&&g.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image inputs");rn(f.signal);const v=new AbortController,_=new g.library.InterruptableStoppingCriteria,x=()=>{var z;v.abort((z=f.signal)==null?void 0:z.reason),_.interrupt()};(N=f.signal)==null||N.addEventListener("abort",x,{once:!0}),v.signal.addEventListener("abort",()=>_.interrupt(),{once:!0}),g.active=v,g.requestId=p,g.status="generating";let M,S,E=0,C=0,w,b=!1;const R=g.gpuDispatches??0,I=g.gpuSubmissions??0;try{rn(f.signal);const{tokenizer:z,processor:$,model:ne}=g.components;let re;for(;;){rn(v.signal);let se=m;if($&&(se=m.map(Ue=>({role:Ue.role,content:[{type:"text",text:Ue.content}]})),u)){const Ue=se.findLast(lt=>lt.role==="user");if(!Ue)throw new Error("An image requires a user message");Ue.content.unshift({type:"image"})}const ee=($??z).apply_chat_template(se,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof ee!="string"||xo(ee)>kt.maxPromptBytes)throw new Error("Templated prompt exceeds its byte budget");if(u){const Ue=new g.library.RawImage(u.data,u.width,u.height,u.channels);M=await $(ee,Ue,{do_image_splitting:!1})}else M=await z(ee,{truncation:!1,padding:!1});if(rn(v.signal),re=(H=(O=M.input_ids)==null?void 0:O.dims)==null?void 0:H.at(-1),!Number.isSafeInteger(re)||re<1)throw new Error("Invalid model input token count");if(re+y<=kt.maxContextTokens)break;const de=$2(m);if(!de)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const xe=M;M=void 0,yo(xe),m=de,b=!0}rn(v.signal);const he=new g.library.TextStreamer(z,{skip_prompt:!0,skip_special_tokens:!0,callback_function:se=>{var ee;if(!(v.signal.aborted||w)){if(C+=xo(se),C>kt.maxOutputBytes){w=new Error("Generated text exceeded its byte budget"),v.abort(w);return}try{if(((ee=f.emitProgress)==null?void 0:ee.call(f,{type:"token",sessionId:g.sessionId,requestId:p,sequence:E++,text:se}))===!1)throw new Error("Token consumer rejected output")}catch(de){w=de,v.abort(de)}}}});if(S=await ne.generate({...M,max_new_tokens:y,do_sample:!1,streamer:he,stopping_criteria:[_]}),await((k=g.runtimeDevice)==null?void 0:k.queue.onSubmittedWorkDone()),w)throw w;if(g.lost)throw new Error("GPU device lost; model session is unavailable");rn(v.signal);const ge=S.tolist();if(ge.length!==1||ge[0].length<re||ge[0].length>re+y)throw new Error("Model returned an over-budget token sequence");const X=ge[0].slice(re),Z=z.decode(X,{skip_special_tokens:!0});if(xo(Z)>kt.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");return g.generatedRequests+=1,{sessionId:g.sessionId,requestId:p,text:Z,inputTokens:re,outputTokens:X.length,finishReason:Y2(ne,X,y),contextTruncated:b,workerId:g.workerId,gpuDispatches:(g.gpuDispatches??0)-R,gpuSubmissions:(g.gpuSubmissions??0)-I,gpuProfileSamples:g.gpuProfileSamples??0}}finally{(q=f.signal)==null||q.removeEventListener("abort",x);try{const z=new Set;yo(M,z),yo(S,z)}finally{g.active=null,g.requestId=null,g.status="ready"}}}return async function(f={},g={}){var y,m;if(r(),f.command==="load")return c(f,g);if(f.command==="generate")return h(f,g);const p=o.get(Ja(f.sessionId));if(f.command==="status")return p?hf(p):{sessionId:f.sessionId,status:"absent"};if(f.command==="cancel")return(p==null?void 0:p.requestId)===f.requestId&&((y=p.active)==null||y.abort("Generation cancelled")),{sessionId:f.sessionId,cancellationRequested:!0};if(f.command==="unload"){if(!p)return{sessionId:f.sessionId,status:"absent"};if(p.status!=="ready")throw new Error("Cancel and await active model work before unloading");p.status="unloading";try{await yu(p.components),(m=p.restoreGpuEvidence)==null||m.call(p)}catch(u){p.status="ready",p.lost=!0;const v=new Error(`MODEL_DISPOSE_FAILED: ${u.message}`);throw v.code="MODEL_DISPOSE_FAILED",v}return o.delete(f.sessionId),{sessionId:f.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}K2();const Z2=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...Z2,"compute_probabilities"]);let kr=null,df=null;async function _u(){if(kr)return kr;try{return df=new P2({frameBudgetMs:6}),kr=await df.initialize(),kr}catch(n){if(console.warn("[planetgen] GPU hub unavailable, falling back to local WebGPU init",n),typeof navigator>"u"||!navigator.gpu)return null;const e=await navigator.gpu.requestAdapter();return e?(kr=await e.requestDevice(),kr):null}}function oe(n,e,t){return Math.min(Math.max(n,e),t)}function Pn(n){return oe(n,0,1)}function Q2(n){let e=1/0,t=-1/0;for(let r=0;r<n.length;r++){const s=n[r];s<e&&(e=s),s>t&&(t=s)}const i=Math.max(t-e,1e-5);for(let r=0;r<n.length;r++)n[r]=(n[r]-e)/i}function J2(n,e,t=1){if(t<=0)return;const i=new Float32Array(n.length);for(let r=0;r<t;r++){for(let s=0;s<e;s++){const a=Math.max(0,s-1),o=Math.min(e-1,s+1);for(let l=0;l<e;l++){const c=(l-1+e)%e,h=(l+1)%e,d=s*e+l,f=n[d]*2+n[s*e+c]+n[s*e+h]+n[a*e+l]+n[o*e+l];i[d]=f/6}}n.set(i)}}function _s(){return window.matchMedia("(max-width: 768px)").matches||/Mobi|Android|iP(ad|hone|od)|IEMobile|BlackBerry|Kindle|Silk|Opera Mini/i.test(navigator.userAgent||"")}function Dm(n,e,t){const i=n==null?void 0:n.image,r=i==null?void 0:i.data,s=(i==null?void 0:i.width)??0,a=(i==null?void 0:i.height)??0;if(!r||!s||!a)return{r:0,g:0,b:0,a:0};const o=(e%1+1)%1,l=oe(t,0,1),c=Math.min(s-1,Math.floor(o*s)),d=(Math.min(a-1,Math.floor(l*a))*s+c)*4;return{r:r[d]??0,g:r[d+1]??0,b:r[d+2]??0,a:r[d+3]??0}}class eT{constructor(e){this.sceneManager=e,this.forge=null,this.planet=null,this.water=null,this.freshwater=null,this.cloudLayerSettings=[],this.lastSettings=null,this.atmosphereSystem=new rw(e.planetGroup),this.cloudSystem=new sw(e.planetGroup),this.oceanComputeSystem=null,this.useComputeOcean=!0,this.waterUniforms={time:{value:0},deepColor:{value:new Se(532543)},shallowColor:{value:new Se(1396618)},opacity:{value:.9},fresnelPower:{value:3.4},iceCap:{value:0},iceColor:{value:new Se(14283263)},windStrength:{value:.5}}}async initOceanCompute(){if(!this.oceanComputeSystem)try{const e=await _u();this.oceanComputeSystem=await Yu.create({gridWidth:256,gridHeight:128,device:e||void 0}),console.log("[PlanetManager] Ocean compute system initialized")}catch(e){console.warn("[PlanetManager] Failed to init ocean compute:",e),this.oceanComputeSystem=null}}async generate(e,t){const i=r=>{t&&t(r)};try{i(`Tectonics: ${e.numPlates} plates`),await new Promise(a=>requestAnimationFrame(a)),this.forge=new iw(e.resolution),this.forge.generateTectonics({numPlates:e.numPlates,jitter:e.jitter,oceanFloor:.2,plateDelta:e.plateDelta,faultType:e.faultType,plateSizeVariance:e.plateSizeVariance,desymmetrizeTiling:e.desymmetrizeTiling}),i(`Erosion: ${e.iterations.toLocaleString()} droplets`),await new Promise(a=>requestAnimationFrame(a)),this.forge.applyErosion({iterations:e.iterations,erosionRate:e.erosionRate,evaporation:e.evaporation}),Q2(this.forge.data),J2(this.forge.data,this.forge.size,e.smoothPasses),this.forge.applyHydrology({seaLevel:e.seaLevel,riverDepth:.015,lakeThreshold:.003}),i("Meshing planet…"),await new Promise(a=>requestAnimationFrame(a)),this.lastSettings={...e};const r=this.forge.createMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions,e.iceCap);r.userData.forge=this.forge,r.userData.settings=e,r.rotation.x=.25,r.castShadow=!0,r.receiveShadow=!0,this.replacePlanet(r),this.replaceWater(this.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,e.waterShader||"balanced")),this.replaceFreshwater(this.forge.createFreshwaterMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions));const s=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,e.radius,e.subdivisions,e.heightScale,s),this.cloudSystem.rebuild(s,e.radius,e.seaLevel,e.heightScale,e.subdivisions,this.cloudLayerSettings),this.applyPlanetScale(e.planetDiameterKm),i(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(r){console.error(r),i("Generation failed – check console")}}update(e,t=!0){var i,r,s,a,o,l,c,h,d,f,g,p;if(this.planet&&t&&(this.planet.rotation.y+=9e-4),this.water){if(this.waterUniforms.time.value+=.016,(r=(i=this.water.material)==null?void 0:i.uniforms)!=null&&r.time&&(this.water.material.uniforms.time.value+=e),(a=(s=this.water.material)==null?void 0:s.uniforms)!=null&&a.eye&&((o=this.sceneManager)!=null&&o.camera)&&this.water.material.uniforms.eye.value.copy(this.sceneManager.camera.position),(c=(l=this.water.material)==null?void 0:l.uniforms)!=null&&c.sunDirection){const y=(h=this.sceneManager)==null?void 0:h.getSunDir();y&&this.water.material.uniforms.sunDirection.value.copy(y)}(f=(d=this.water.material)==null?void 0:d.uniforms)!=null&&f.oceanMap&&((g=this.oceanComputeSystem)!=null&&g.enabled)&&(this.water.material.uniforms.oceanMap.value=this.oceanComputeSystem.getTexture(),this.water.material.uniforms.useOceanMap.value=1)}this.freshwater&&(this.freshwater.material.uniforms.time.value+=.016),(p=this.oceanComputeSystem)!=null&&p.enabled&&this.oceanComputeSystem.update(e),this.atmosphereSystem.update(e),this.cloudSystem.update(e)}updateOceanMouse(e,t,i,r){var s;(s=this.oceanComputeSystem)!=null&&s.enabled&&this.oceanComputeSystem.setMouseInteraction(e,t,i,r)}clearOceanMouse(){var e;(e=this.oceanComputeSystem)!=null&&e.enabled&&this.oceanComputeSystem.clearMouseInteraction()}setAtmosphereWeather(e,t){var i;(i=this.atmosphereSystem)==null||i.setWeather(e,t)}setOceanWindTexture(e){var i,r;if(!((r=(i=this.water)==null?void 0:i.material)!=null&&r.uniforms))return;const t=this.water.material.uniforms;t.windAuxMap&&(t.windAuxMap.value=e),t.useLocalWind&&(t.useLocalWind.value=e?1:0)}setOceanWindField(e){var t;(t=this.oceanComputeSystem)!=null&&t.enabled&&this.oceanComputeSystem.setWindField(e)}setOceanWindVector(e){var s;if(!((s=this.oceanComputeSystem)!=null&&s.enabled)||!e)return;const t=new Ee(e.x,e.z),i=t.length();i>1e-6&&t.normalize();const r=Math.min(Math.max(i/40,0),2);this.oceanComputeSystem.setConfig({windStrength:r,windDirectionX:t.x,windDirectionY:t.y})}replacePlanet(e){var t,i;this.planet&&(this.planet.geometry.dispose(),Array.isArray(this.planet.material)?this.planet.material.forEach(r=>{var s;return(s=r.dispose)==null?void 0:s.call(r)}):(i=(t=this.planet.material).dispose)==null||i.call(t),this.sceneManager.planetGroup.remove(this.planet)),this.planet=e,this.planet.castShadow=!0,this.planet.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceWater(e){var t,i;this.water&&(this.water.geometry.dispose(),Array.isArray(this.water.material)?this.water.material.forEach(r=>{var s;return(s=r.dispose)==null?void 0:s.call(r)}):(i=(t=this.water.material).dispose)==null||i.call(t),this.sceneManager.planetGroup.remove(this.water)),this.water=e,this.water.castShadow=!0,this.water.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceFreshwater(e){var t,i;this.freshwater&&(this.freshwater.geometry.dispose(),(i=(t=this.freshwater.material).dispose)==null||i.call(t),this.freshwater.parent&&this.freshwater.parent.remove(this.freshwater)),this.freshwater=e,this.freshwater.renderOrder=1,this.freshwater.castShadow=!0,this.freshwater.receiveShadow=!0,this.planet?this.planet.add(e):this.sceneManager.planetGroup.add(e)}buildWaterMesh(e,t,i,r,s,a="balanced"){var h;const o=e+(i-.5)*r+.01,l=new Yi(o,Math.max(0,Math.floor(t)));this.waterUniforms.iceCap.value=s??0;let c;return a==="compute"&&((h=this.oceanComputeSystem)!=null&&h.enabled)?c=this.buildComputeOceanMaterial(o):a==="fast"?c=this.buildFastOceanMaterial():c=this.buildBalancedOceanMaterial(),new Vt(l,c)}buildComputeOceanMaterial(e,t=null){var s,a,o;const i={time:{value:0},deepColor:{value:new Se(673904)},midColor:{value:new Se(1732752)},shallowColor:{value:new Se(2461872)},sunDirection:{value:new D(.3,.8,.45).normalize()},windAuxMap:{value:t},useLocalWind:{value:t?1:0},globalWindDir:{value:new D(1,0,.5).normalize()},eye:{value:new D},waveHeight:{value:1},waveScale:{value:.6},windStrength:{value:.8},maxWind:{value:60},fetchLength:{value:1.5},waterRadius:{value:e},oceanMap:{value:((a=(s=this.oceanComputeSystem)==null?void 0:s.getTexture)==null?void 0:a.call(s))??null},useOceanMap:{value:(o=this.oceanComputeSystem)!=null&&o.enabled?1:0},oceanHeightScale:{value:.35},oceanNormalScale:{value:.6},oceanFoamScale:{value:.7}},r=new Gt({uniforms:i,transparent:!0,depthWrite:!0,side:Mn,vertexShader:`
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
                uniform sampler2D oceanMap;
                uniform float useOceanMap;
                uniform float oceanHeightScale;
                uniform float oceanNormalScale;
                uniform float oceanFoamScale;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying vec3 vLocalPos;
                varying float vWaveHeight;
                varying float vLocalWindStrength;
                varying float vOceanFoam;
                
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
                    vOceanFoam = 0.0;
                    
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
                    vec3 baseNormal = dir;
                    if (useOceanMap > 0.5) {
                        vec2 uv = dirToUV(dir);
                        vec4 oceanSample = texture2D(oceanMap, uv);
                        float height01 = oceanSample.r;
                        float oceanHeight = (height01 - 0.5) / 2.5;
                        waveDisp += oceanHeight * oceanHeightScale;
                        float nX = (oceanSample.g - 0.5) * 2.0;
                        float nY = (oceanSample.b - 0.5) * 2.0;
                        vec3 up = abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
                        vec3 east = normalize(cross(up, dir));
                        vec3 north = normalize(cross(dir, east));
                        baseNormal = normalize(dir - east * nX * oceanNormalScale - north * nY * oceanNormalScale);
                        vOceanFoam = oceanSample.a * oceanFoamScale;
                    }
                    vWaveHeight = waveDisp;
                    
                    // Displace vertex along surface normal
                    vec3 pos = position + dir * waveDisp;
                    
                    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                    vWorldPos = worldPos.xyz;
                    vNormal = normalize(normalMatrix * baseNormal);
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
                varying float vOceanFoam;

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
                    foam = clamp(foam + vOceanFoam * 0.35, 0.0, 0.6);
                    
                    // Foam color (bright white)
                    vec3 foamColor = vec3(0.95, 0.97, 1.0);
                    
                    // Combine all
                    vec3 finalColor = baseColor;
                    finalColor += vec3(spec + specBroad);
                    finalColor += fresnel * shallowColor * 0.12;
                    finalColor = mix(finalColor, foamColor, foam);
                    
                    gl_FragColor = vec4(finalColor, 0.92);
                }
            `});return r.uniforms=i,r}buildBalancedOceanMaterial(){const e={time:{value:0},color:{value:new Se(5086166)},sunDirection:{value:new D(.3,.8,.45).normalize()},eye:{value:new D}},t=new Gt({uniforms:e,transparent:!0,depthWrite:!0,side:Mn,vertexShader:`
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
            `});return t.uniforms=e,t}buildFastOceanMaterial(){const e={time:{value:0},sunDirection:{value:new D(.3,.8,.45).normalize()},eye:{value:new D},uColor:{value:new Se(871286)}},t=new Gt({uniforms:e,transparent:!0,depthWrite:!0,side:Mn,vertexShader:`
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
            `});return t.uniforms=e,t}applyPlanetScale(e){const t=(e||Bi)/Bi;this.sceneManager.planetGroup.scale.setScalar(t),this.sceneManager.controls.minDistance=Math.max(.2,10*t*.1)}updateAtmosphere(e,t){if(!this.lastSettings)return;const i=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,this.lastSettings.radius,this.lastSettings.subdivisions,this.lastSettings.heightScale,i),t&&this.atmosphereSystem.setWeather(t.map,t.rainHaze)}rebuildClouds(e){this.lastSettings&&this.cloudSystem.rebuild(e,this.lastSettings.radius,this.lastSettings.seaLevel,this.lastSettings.heightScale,this.lastSettings.subdivisions,this.cloudLayerSettings)}}const ic={type:"change"},rh={type:"start"},sh={type:"end"},ff=1e-6,et={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},eo=new Ee,Pi=new Ee,tT=new D,to=new D,rc=new D,Vr=new qn,pf=new D,no=new D,sc=new D,io=new D;class nT extends tv{constructor(e,t=null){super(e,t),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:Jr.ROTATE,MIDDLE:Jr.DOLLY,RIGHT:Jr.PAN},this.state=et.NONE,this.keyState=et.NONE,this.target=new D,this._lastPosition=new D,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new D,this._movePrev=new Ee,this._moveCurr=new Ee,this._lastAxis=new D,this._zoomStart=new Ee,this._zoomEnd=new Ee,this._panStart=new Ee,this._panEnd=new Ee,this._pointers=[],this._pointerPositions={},this._onPointerMove=rT.bind(this),this._onPointerDown=iT.bind(this),this._onPointerUp=sT.bind(this),this._onPointerCancel=aT.bind(this),this._onContextMenu=fT.bind(this),this._onMouseWheel=dT.bind(this),this._onKeyDown=lT.bind(this),this._onKeyUp=oT.bind(this),this._onTouchStart=pT.bind(this),this._onTouchMove=mT.bind(this),this._onTouchEnd=gT.bind(this),this._onMouseDown=cT.bind(this),this._onMouseMove=uT.bind(this),this._onMouseUp=hT.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,t!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>ff&&(this.dispatchEvent(ic),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>ff||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(ic),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=et.NONE,this.keyState=et.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(ic),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(Pi.copy(this._panEnd).sub(this._panStart),Pi.lengthSq()){if(this.object.isOrthographicCamera){const e=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,t=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;Pi.x*=e,Pi.y*=t}Pi.multiplyScalar(this._eye.length()*this.panSpeed),to.copy(this._eye).cross(this.object.up).setLength(Pi.x),to.add(tT.copy(this.object.up).setLength(Pi.y)),this.object.position.add(to),this.target.add(to),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(Pi.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){io.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let e=io.length();e?(this._eye.copy(this.object.position).sub(this.target),pf.copy(this._eye).normalize(),no.copy(this.object.up).normalize(),sc.crossVectors(no,pf).normalize(),no.setLength(this._moveCurr.y-this._movePrev.y),sc.setLength(this._moveCurr.x-this._movePrev.x),io.copy(no.add(sc)),rc.crossVectors(io,this._eye).normalize(),e*=this.rotateSpeed,Vr.setFromAxisAngle(rc,e),this._eye.applyQuaternion(Vr),this.object.up.applyQuaternion(Vr),this._lastAxis.copy(rc),this._lastAngle=e):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Vr.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Vr),this.object.up.applyQuaternion(Vr)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let e;this.state===et.TOUCH_ZOOM_PAN?(e=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Po.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(e=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,e!==1&&e>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Po.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(e,t){return eo.set((e-this.screen.left)/this.screen.width,(t-this.screen.top)/this.screen.height),eo}_getMouseOnCircle(e,t){return eo.set((e-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-t))/this.screen.width),eo}_addPointer(e){this._pointers.push(e)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId==e.pointerId){this._pointers.splice(t,1);return}}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ee,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[t.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function iT(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n))}function rT(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function sT(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchEnd(n):this._onMouseUp(),this._removePointer(n),this._pointers.length===0&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function aT(n){this._removePointer(n)}function oT(){this.enabled!==!1&&(this.keyState=et.NONE,window.addEventListener("keydown",this._onKeyDown))}function lT(n){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===et.NONE&&(n.code===this.keys[et.ROTATE]&&!this.noRotate?this.keyState=et.ROTATE:n.code===this.keys[et.ZOOM]&&!this.noZoom?this.keyState=et.ZOOM:n.code===this.keys[et.PAN]&&!this.noPan&&(this.keyState=et.PAN)))}function cT(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Jr.DOLLY:this.state=et.ZOOM;break;case Jr.ROTATE:this.state=et.ROTATE;break;case Jr.PAN:this.state=et.PAN;break;default:this.state=et.NONE}const t=this.keyState!==et.NONE?this.keyState:this.state;t===et.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY)),this._movePrev.copy(this._moveCurr)):t===et.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(n.pageX,n.pageY)),this._zoomEnd.copy(this._zoomStart)):t===et.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(n.pageX,n.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(rh)}function uT(n){const e=this.keyState!==et.NONE?this.keyState:this.state;e===et.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY))):e===et.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(n.pageX,n.pageY)):e===et.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(n.pageX,n.pageY))}function hT(){this.state=et.NONE,this.dispatchEvent(sh)}function dT(n){if(this.enabled!==!1&&this.noZoom!==!0){switch(n.preventDefault(),n.deltaMode){case 2:this._zoomStart.y-=n.deltaY*.025;break;case 1:this._zoomStart.y-=n.deltaY*.01;break;default:this._zoomStart.y-=n.deltaY*25e-5;break}this.dispatchEvent(rh),this.dispatchEvent(sh)}}function fT(n){this.enabled!==!1&&n.preventDefault()}function pT(n){switch(this._trackPointer(n),this._pointers.length){case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=et.TOUCH_ZOOM_PAN;const e=this._pointers[0].pageX-this._pointers[1].pageX,t=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(e*e+t*t);const i=(this._pointers[0].pageX+this._pointers[1].pageX)/2,r=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(i,r)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(rh)}function mT(n){switch(this._trackPointer(n),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY));break;default:const e=this._getSecondPointerPosition(n),t=n.pageX-e.x,i=n.pageY-e.y;this._touchZoomDistanceEnd=Math.sqrt(t*t+i*i);const r=(n.pageX+e.x)/2,s=(n.pageY+e.y)/2;this._panEnd.copy(this._getMouseOnScreen(r,s));break}}function gT(n){switch(this._pointers.length){case 0:this.state=et.NONE;break;case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=et.TOUCH_ZOOM_PAN;for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId!==n.pointerId){const t=this._pointerPositions[this._pointers[e].pointerId];this._moveCurr.copy(this._getMouseOnCircle(t.x,t.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(sh)}class vT{constructor(e){if(this.canvas=e,this.canvas&&this.canvas.setAttribute&&this.canvas.setAttribute("tabindex","0"),this.renderer=this.createRenderer(e),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(329487),this.renderer.outputColorSpace=bn,this.renderer.xr.enabled=!0,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=mp,this.scene=new Og,this.scene.background=new Se(329487),this.scene.fog=new ku(329487,30,120),this.planetGroup=new Xr,this.scene.add(this.planetGroup),this.userGroup=new Xr,this.scene.add(this.userGroup),this.camera=new Dn(60,window.innerWidth/window.innerHeight,1e-16,2e3),this.userGroup.add(this.camera),this.camera.position.set(0,10,28),this.controls=new nT(this.camera,this.renderer.domElement),this.controls.rotateSpeed=2.2,this.controls.zoomSpeed=2,this.controls.panSpeed=1,this.controls.dynamicDampingFactor=.1,this.controls.noPan=!0,this.controls.minDistance=12,this.controls.maxDistance=60,typeof this.controls.onTouchMove=="function"){const i=this.controls.onTouchMove.bind(this.controls);this.controls.onTouchMove=r=>{if(!(!r.touches||r.touches.length===0))return i(r)}}if(typeof this.controls.onTouchEnd=="function"){const i=this.controls.onTouchEnd.bind(this.controls);this.controls.onTouchEnd=r=>{if(r.touches)return i(r)}}this.scene.add(new jg(14215167,658450,9e-4)),this.dirLight=new Qg(16777215,1.35),this.dirLight.position.set(12,16,10),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.set(2048,2048),this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=300;const t=80;this.dirLight.shadow.camera.left=-t,this.dirLight.shadow.camera.right=t,this.dirLight.shadow.camera.top=t,this.dirLight.shadow.camera.bottom=-t,this.scene.add(this.dirLight.target),this.scene.add(this.dirLight),this.sunMesh=null,this.scene.add(this.buildStarfield()),this.onResize=this.onResize.bind(this),window.addEventListener("resize",this.onResize)}createRenderer(e){const t=[{ctor:$l,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!0}},{ctor:$l,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}},{ctor:$l,opts:{antialias:!1,canvas:e,logarithmicDepthBuffer:!1}},{ctor:void 0,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}}];for(let i=0;i<t.length;i++){const{ctor:r,opts:s}=t[i];try{return new r(s)}catch(a){console.warn(`WebGL init failed (attempt ${i+1})`,a)}}throw new Error("WebGL context could not be created. Enable WebGL/hardware acceleration or try a different browser/XR emulator configuration.")}buildStarfield(){const t=new Float32Array(3600);for(let s=0;s<1200;s++){const a=90+Math.random()*60,o=Math.random()*Math.PI*2,l=Math.random()*2-1,c=Math.acos(l),h=Math.sin(c);t[s*3]=a*h*Math.cos(o),t[s*3+1]=a*Math.cos(c),t[s*3+2]=a*h*Math.sin(o)}const i=new Jt;i.setAttribute("position",new Dt(t,3));const r=new Vp({color:8246268,size:.5,sizeAttenuation:!0,transparent:!0,opacity:.7});return new Wg(i,r)}onResize(){const{innerWidth:e,innerHeight:t}=window;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.controls.handleResize()}update(e=!0){e&&this.controls&&this.controls.update(),this.renderer.render(this.scene,this.camera)}getSunDir(){return this.dirLight.position.clone().normalize()}}const mf=()=>({forward:!1,backward:!1,left:!1,right:!1,up:!1,down:!1,run:!1,rollLeft:!1,rollRight:!1}),ac=new Set(["flyToggle","jump","exit","surface"]);class xT{constructor(e=document){this.target=e,this.state=mf(),this.once=new Set,this.lookDelta={x:0,y:0},this.mode="desktop",this.lookMode="orbit"}setMode(e){this.mode=e}setLookMode(e){this.lookMode=e}consume(e){if(!ac.has(e))return!1;const t=this.once.has(e);return t&&this.once.delete(e),t}setAction(e,t){e in this.state?this.state[e]=!!t:ac.has(e)&&t&&this.once.add(e)}trigger(e){ac.has(e)&&this.once.add(e)}addLookDelta(e,t){this.lookDelta.x+=e,this.lookDelta.y+=t}consumeLookDelta(){const{x:e,y:t}=this.lookDelta;return this.lookDelta.x=0,this.lookDelta.y=0,{x:e,y:t}}getState(){return this.state}clear(){this.state=mf(),this.once.clear(),this.lookDelta={x:0,y:0}}dispose(){}}function yT(n,e){const t=Math.cos(n);return{x:t*Math.cos(e),y:Math.sin(n),z:t*Math.sin(e)}}function oc(n,e,t,i){const r=Pn(n)*(i-1),s=Pn(1-e)*(i-1),a=Math.floor(r),o=Math.floor(s),l=Math.min(i-1,a+1),c=Math.min(i-1,o+1),h=r-a,d=s-o,f=t[o*i+a],g=t[o*i+l],p=t[c*i+a],y=t[c*i+l],m=f*(1-h)+g*h,u=p*(1-h)+y*h,v=m*(1-d)+u*d;return Number.isFinite(v)?v:0}function _T(n,e,t){const i=Math.abs(n.x),r=Math.abs(n.y),s=Math.abs(n.z),a=i+r+s+1e-6,o=i/a,l=r/a,c=s/a,h={u:n.z*.5+.5,v:n.y*.5+.5},d={u:n.x*.5+.5,v:n.z*.5+.5},f={u:n.x*.5+.5,v:n.y*.5+.5},g=oc(h.u,h.v,e,t),p=oc(d.u,d.v,e,t),y=oc(f.u,f.v,e,t);return g*o+p*l+y*c}function Lm({heightmap:n,size:e,seaLevel:t,gridWidth:i,gridHeight:r}){const s=i*r,a=new Float32Array(s*4);for(let o=0;o<r;o++){const c=((o+.5)/r-.5)*Math.PI;for(let h=0;h<i;h++){const f=((h+.5)/i-.5)*Math.PI*2,g=yT(c,f),p=_T(g,n,e),y=p<t?1:0,m=y?0:Pn((p-t)/Math.max(1e-6,1-t)),u=(o*i+h)*4;a[u+0]=y,a[u+1]=m,a[u+2]=p,a[u+3]=0}}return a}const bT=256,wT=128;function gf(n,e,t){const i=new Jn(n,e,t,St,Lt);return i.needsUpdate=!0,i.wrapS=En,i.wrapT=pt,i.minFilter=it,i.magFilter=it,i.generateMipmaps=!1,i.colorSpace=Nt,i}class ah{constructor({gridWidth:e=bT,gridHeight:t=wT}={}){this.gridWidth=e,this.gridHeight=t,this.cellCount=e*t,this.enabled=!1,this.ready=!1,this.device=null,this.pipeline=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(32),this.stateBuffers=null,this.surfaceBuffer=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.readbackVersion=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.oceanInertia=.25,this.moistureLayers=2,this.planetRadiusM=5e5,this.textureData=new Uint8Array(this.cellCount*4),this.weatherTexture=gf(this.textureData,e,t),this.auxTextureData=new Uint8Array(this.cellCount*4),this.weatherAuxTexture=gf(this.auxTextureData,e,t)}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:i,precipStrength:r,windStrength:s,oceanInertia:a,moistureLayers:o}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(i)&&(this.evapStrength=Math.max(0,i)),Number.isFinite(r)&&(this.precipStrength=Math.max(0,r)),Number.isFinite(s)&&(this.windStrength=Math.max(0,s)),Number.isFinite(a)&&(this.oceanInertia=Pn(a)),Number.isFinite(o)&&(this.moistureLayers=Math.max(1,Math.min(4,Math.round(o))))}static async create(e={}){const{device:t,...i}=e,r=new ah(i);return await r.init({device:t}),r}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleSystem] WebGPU not available; weather simulation disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[WaterCycleSystem] No GPU adapter found; weather simulation disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,i=48,r=16,s=8;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.cellCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.cellCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.cellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})];const a=t.createShaderModule({code:this._wgsl()});this.pipeline=t.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[0]}},{binding:2,resource:{buffer:this.stateBuffers[1]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]}),t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[1]}},{binding:2,resource:{buffer:this.stateBuffers[0]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]})],this.ready=!0}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}setPlanetSurface({heightmap:e,size:t,seaLevel:i,planetRadiusM:r}){if(!this.enabled||!this.ready||!e||!t)return;this.planetRadiusM=r??this.planetRadiusM;const s=Lm({heightmap:e,size:t,seaLevel:i,gridWidth:this.gridWidth,gridHeight:this.gridHeight}),a=new Float32Array(this.cellCount*12),o=288,l=8e3,c=(d,f)=>{const g=Math.sin(d*127.1+f*311.7)*43758.5453123;return g-Math.floor(g)};for(let d=0;d<this.gridHeight;d++){const g=((d+.5)/this.gridHeight-.5)*Math.PI,p=Math.abs(Math.sin(g));for(let y=0;y<this.gridWidth;y++){const m=d*this.gridWidth+y,u=s[m*4+0],v=s[m*4+1],_=v*l,x=(c(y,d)-.5)*2,M=o-55*p-_*.0065+x*1.2,S=this._qsApprox(M),E=(u?.94:.65)*S,C=E*.85,w=C*.72,b=w*.55,R=u?25e-5*(1-p):5e-5*(1-p)*(1-v),I=x*700+Math.sin(g*3)*250,N=10*Math.sin(g*2);a[m*12+0]=M,a[m*12+1]=E,a[m*12+2]=R,a[m*12+3]=0,a[m*12+4]=I,a[m*12+5]=N,a[m*12+6]=0,a[m*12+7]=u?1:.25,a[m*12+8]=C,a[m*12+9]=w,a[m*12+10]=b,a[m*12+11]=0}}const h=this.device;h.queue.writeBuffer(this.surfaceBuffer,0,s),h.queue.writeBuffer(this.stateBuffers[0],0,a),h.queue.writeBuffer(this.stateBuffers[1],0,a);for(let d=0;d<this.cellCount;d++){const f=a[d*12+0],g=a[d*12+2],p=a[d*12+4],y=a[d*12+5],m=a[d*12+6],u=a[d*12+7],v=Pn(g*600),_=Pn(.5+p*(1/6e3)),x=Pn(u);this.textureData[d*4+0]=Math.round(v*255),this.textureData[d*4+1]=0,this.textureData[d*4+2]=Math.round(_*255),this.textureData[d*4+3]=Math.round(x*255);const M=Pn((f-240)/70),S=Pn(.5+y*(1/120)),E=Pn(.5+m*(1/120));this.auxTextureData[d*4+0]=Math.round(M*255),this.auxTextureData[d*4+1]=0,this.auxTextureData[d*4+2]=Math.round(S*255),this.auxTextureData[d*4+3]=Math.round(E*255)}this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.simTimeS=0,this.ping=0,this.hasSurface=!0}update(e,t,i={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const r=Math.min(Math.max(e??0,0),.25),s=Number.isFinite(i.dtSimOverride)?i.dtSimOverride:r*this.timeScale,a=Math.min(Math.max(s,0),900);if(a<=0)return;this.simTimeS+=a,this.readbackTimerS+=r,this._writeUniforms(a,this.simTimeS,t);const o=this.device,l=o.createCommandEncoder(),c=l.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,this.bindGroups[this.ping]),c.dispatchWorkgroups(Math.ceil(this.gridWidth/8),Math.ceil(this.gridHeight/8)),c.end();let h=null;if(!!i.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const f=this.readbackWriteIndex&1;this.readbackInFlight[f]||(l.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[f],0,this.cellCount*8),h=f,this.readbackWriteIndex++,this.readbackTimerS=0)}o.queue.submit([l.finish()]),h!==null&&this._scheduleReadback(h),this.ping=1-this.ping}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i),s=this.cellCount*4;this.textureData.set(r.subarray(0,s)),this.auxTextureData.set(r.subarray(s,s*2)),t.unmap(),this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.readbackVersion++}).catch(i=>{console.warn("[WaterCycleSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,i){const r=this.uniformData;r[0]=this.gridWidth,r[1]=this.gridHeight,r[2]=e,r[3]=t,r[4]=this.planetRadiusM,r[5]=2*Math.PI/86400,r[6]=288,r[7]=.0065,r[8]=8e3,r[9]=8e3,r[10]=.0098,r[11]=this.moistureLayers,r[12]=(i==null?void 0:i.x)??0,r[13]=(i==null?void 0:i.y)??1,r[14]=(i==null?void 0:i.z)??0,r[15]=0,r[16]=18,r[17]=1/21600,r[18]=3e-5*this.evapStrength,r[19]=12e-6*this.evapStrength,r[20]=1/1800,r[21]=1/1200*this.precipStrength,r[22]=1/1800,r[23]=1/3600,r[24]=1/7200*this.windStrength,r[25]=1/14400,r[26]=2e-5,r[27]=60*this.windStrength,r[28]=120,r[29]=45e3,r[30]=1/7200,r[31]=this.oceanInertia,this.device.queue.writeBuffer(this.uniformBuffer,0,r)}_qsApprox(e){const t=e-273.15,r=6.112*Math.exp(17.67*t/(t+243.5))*100;return .622*r/Math.max(101325-r,1)}_wgsl(){return`
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
        `}}const ST=256,MT=128,ET=8;function lc(n,e,t,{wrapS:i=pt,wrapT:r=pt,minFilter:s=Pt,magFilter:a=Pt}={}){const o=new Jn(n,e,t,St,Lt);return o.needsUpdate=!0,o.wrapS=i,o.wrapT=r,o.minFilter=s,o.magFilter=a,o.generateMipmaps=!1,o.colorSpace=Nt,o}function TT(n){const e=Math.max(1,Math.ceil(Math.sqrt(n))),t=Math.max(1,Math.ceil(n/e));return{tilesX:e,tilesY:t,atlasW:e*n,atlasH:t*n}}class oh{constructor({volumeN:e=ET,surfaceW:t=ST,surfaceH:i=MT}={}){this.volumeN=Math.max(1,Math.min(192,Math.round(e))),this.surfaceW=Math.max(8,Math.min(1024,Math.round(t))),this.surfaceH=Math.max(8,Math.min(1024,Math.round(i))),this.voxelCount=this.volumeN*this.volumeN*this.volumeN,this.surfaceCellCount=this.surfaceW*this.surfaceH;const r=TT(this.volumeN);this.tilesX=r.tilesX,this.tilesY=r.tilesY,this.atlasW=r.atlasW,this.atlasH=r.atlasH,this.atlasPixelCount=this.atlasW*this.atlasH,this.weatherW=this.surfaceW,this.weatherH=this.surfaceH,this.weatherCellCount=this.weatherW*this.weatherH,this.weatherOffset=this.atlasPixelCount,this.auxOffset=this.atlasPixelCount+this.weatherCellCount,this.totalOutPixels=this.atlasPixelCount+this.weatherCellCount*2,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.pipelineCollapse=null,this.bindGroupLayout=null,this.bindGroupsSim=null,this.bindGroupsCollapse=null,this.uniformBuffer=null,this.uniformData=new Float32Array(48),this.stateBuffers=null,this.surfaceBuffer=null,this.surfaceStateBuffers=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.readbackVersion=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.windShear=.6,this.surfaceDrag=.4,this.oceanInertia=.25,this.planetRadiusM=5e5,this.atmoThicknessM=2e4,this.mountainHeightM=8e3,this.volumeTextureData=new Uint8Array(this.atlasPixelCount*4),this.volumeAtlasTexture=lc(this.volumeTextureData,this.atlasW,this.atlasH,{wrapS:pt,wrapT:pt,minFilter:Pt,magFilter:Pt}),this.weatherTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherTexture=lc(this.weatherTextureData,this.weatherW,this.weatherH,{wrapS:En,wrapT:pt,minFilter:it,magFilter:it}),this.auxTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherAuxTexture=lc(this.auxTextureData,this.weatherW,this.weatherH,{wrapS:En,wrapT:pt,minFilter:it,magFilter:it})}static async create(e={}){const{device:t,...i}=e,r=new oh(i);return await r.init({device:t}),r}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:i,precipStrength:r,windStrength:s,oceanInertia:a,atmoThicknessM:o,windShear:l,surfaceDrag:c}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(i)&&(this.evapStrength=Math.max(0,i)),Number.isFinite(r)&&(this.precipStrength=Math.max(0,r)),Number.isFinite(s)&&(this.windStrength=Math.max(0,s)),Number.isFinite(a)&&(this.oceanInertia=Pn(a)),Number.isFinite(o)&&(this.atmoThicknessM=Math.max(1e3,o)),Number.isFinite(l)&&(this.windShear=Math.max(0,l)),Number.isFinite(c)&&(this.surfaceDrag=Math.max(0,c))}getVolumeTexture(){return this.volumeAtlasTexture}getVolumeMeta(){return{n:this.volumeN,tilesX:this.tilesX,tilesY:this.tilesY,atlasW:this.atlasW,atlasH:this.atlasH,extentM:this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,planetRadiusM:this.planetRadiusM,atmoThicknessM:this.atmoThicknessM}}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleVolumeSystem] WebGPU not available; volume weather disabled."),this.enabled=!1;return}const d=await navigator.gpu.requestAdapter();if(!d){console.warn("[WaterCycleVolumeSystem] No GPU adapter found; volume weather disabled."),this.enabled=!1;return}this.device=await d.requestDevice(),this.enabled=!0}const t=this.device,i=32,r=16,s=16,a=this.totalOutPixels*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.voxelCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.voxelCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.surfaceCellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.surfaceStateBuffers=[t.createBuffer({size:this.weatherCellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.weatherCellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.outputBuffer=t.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]});const o=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),l=t.createShaderModule({code:this._wgslSim()}),c=t.createShaderModule({code:this._wgslCollapse()});this.pipelineSim=t.createComputePipeline({layout:o,compute:{module:l,entryPoint:"main"}}),this.pipelineCollapse=t.createComputePipeline({layout:o,compute:{module:c,entryPoint:"main"}});const h=({volumeSrc:d,volumeDst:f,surfaceStateSrc:g,surfaceStateDst:p})=>t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:d}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:g}},{binding:5,resource:{buffer:p}},{binding:6,resource:{buffer:this.outputBuffer}}]});this.bindGroupsSim=[h({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),h({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.bindGroupsCollapse=[h({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),h({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.ready=!0}setPlanetSurface({heightmap:e,size:t,seaLevel:i,planetRadiusM:r}={}){if(!this.enabled||!this.ready||!(e&&t&&Number.isFinite(i)))return;Number.isFinite(r)&&(this.planetRadiusM=Math.max(1,r)),this.seaLevel=Pn(i);const s=Lm({heightmap:e,size:t,seaLevel:this.seaLevel,gridWidth:this.surfaceW,gridHeight:this.surfaceH});this.device.queue.writeBuffer(this.surfaceBuffer,0,s),this._resetState(),this.hasSurface=!0}_resetState(){const e=this.volumeN,t=this.voxelCount,i=8,r=new Float32Array(t*i),s=(this.seaLevel-.5)*this.mountainHeightM,a=this.planetRadiusM+s,o=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,c=2*o/Math.max(e,1)*.5,h=288,d=.0065,f=8e3,g=m=>{const u=m-273.15,_=6.112*Math.exp(17.67*u/(u+243.5))*100;return .622*_/Math.max(101325-_,1)};let p=0;for(let m=0;m<e;m++){const v=((m+.5)/e*2-1)*o;for(let _=0;_<e;_++){const M=((_+.5)/e*2-1)*o;for(let S=0;S<e;S++){const C=((S+.5)/e*2-1)*o,w=Math.hypot(C,M,v),b=w-a;let R=0,I=0;if(w>.001){const N=C/w,O=M/w,H=v/w,k=c*(Math.abs(N)+Math.abs(O)+Math.abs(H)),q=b-k;if(b+k>0&&q<this.atmoThicknessM){const $=Math.min(Math.max(q,0),this.atmoThicknessM),ne=Math.abs(O);R=h-55*ne-d*$;const he=g(R),ge=$<2e3?.85:.55;I=he*ge*Math.exp(-$/(f*1.25)),$<2e3&&(r[p+2]=he*.02)}}r[p+0]=R,r[p+1]=I,r[p+2]=0,r[p+3]=0,r[p+4]=0,r[p+5]=0,r[p+6]=0,r[p+7]=0,p+=i}}}const y=new Float32Array(this.weatherCellCount*4);for(let m=0;m<this.weatherCellCount;m++)y[m*4+0]=.15,y[m*4+1]=0,y[m*4+2]=0,y[m*4+3]=0;this.device.queue.writeBuffer(this.stateBuffers[0],0,r),this.device.queue.writeBuffer(this.stateBuffers[1],0,r),this.device.queue.writeBuffer(this.surfaceStateBuffers[0],0,y),this.device.queue.writeBuffer(this.surfaceStateBuffers[1],0,y),this.simTimeS=0,this.readbackTimerS=0,this.ping=0,this.lastDiag={maxCloud:0,maxRain:0}}update(e,t,i={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const r=Math.min(Math.max(e??0,0),.25),s=Number.isFinite(i.dtSimOverride)?i.dtSimOverride:r*this.timeScale;let a=Math.max(s,0);if(a<=0)return;const l=2*(this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM)/Math.max(this.volumeN,1),c=Math.max(5,60*this.windStrength),h=.25*l/c,f=Math.max(.5,Math.min(10,h)),g=64;this.readbackTimerS+=r;const p=this.device,y=p.createCommandEncoder();let m=0;for(;a>0&&m<g;){const _=Math.min(a,f);if(_<=0)break;a-=_,this.simTimeS+=_,this._writeUniforms(_,this.simTimeS,t);{const x=y.beginComputePass();x.setPipeline(this.pipelineSim),x.setBindGroup(0,this.bindGroupsSim[this.ping]);const M=4;x.dispatchWorkgroups(Math.ceil(this.volumeN/M),Math.ceil(this.volumeN/M),Math.ceil(this.volumeN/M)),x.end()}{const x=y.beginComputePass();x.setPipeline(this.pipelineCollapse),x.setBindGroup(0,this.bindGroupsCollapse[this.ping]),x.dispatchWorkgroups(Math.ceil(this.weatherW/8),Math.ceil(this.weatherH/8)),x.end()}this.ping=1-this.ping,m++}let u=null;if(!!i.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const _=this.readbackWriteIndex&1;this.readbackInFlight[_]||(y.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[_],0,this.totalOutPixels*4),u=_,this.readbackWriteIndex++,this.readbackTimerS=0)}p.queue.submit([y.finish()]),u!==null&&this._scheduleReadback(u)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i),s=this.atlasPixelCount*4,a=this.weatherCellCount*4;this.volumeTextureData.set(r.subarray(0,s)),this.weatherTextureData.set(r.subarray(s,s+a)),this.auxTextureData.set(r.subarray(s+a,s+a*2));let o=0,l=0;for(let c=0;c<s;c+=4)this.volumeTextureData[c]>o&&(o=this.volumeTextureData[c]),this.volumeTextureData[c+1]>l&&(l=this.volumeTextureData[c+1]);this.lastDiag.maxCloud=o/255,this.lastDiag.maxRain=l/255,t.unmap(),this.volumeAtlasTexture.needsUpdate=!0,this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.readbackVersion++}).catch(i=>{console.warn("[WaterCycleVolumeSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,i){const r=this.uniformData,s=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,a=this.volumeN/Math.max(2*s,1e-6),o=Math.max(1,this.volumeN/32);r[0]=this.volumeN,r[1]=this.volumeN,r[2]=this.volumeN,r[3]=e,r[4]=t,r[5]=s,r[6]=a,r[7]=this.planetRadiusM,r[8]=this.atmoThicknessM,r[9]=288,r[10]=.0065,r[11]=8e3,r[12]=(i==null?void 0:i.x)??0,r[13]=(i==null?void 0:i.y)??1,r[14]=(i==null?void 0:i.z)??0,r[15]=2*Math.PI/86400,r[16]=18,r[17]=1/21600;const l=Math.pow(o,3);r[18]=45e-5*this.evapStrength*l,r[19]=16e-5*this.evapStrength*l,r[20]=1/200*l;const c=1/24e4,h=Math.pow(o,3);r[21]=c*this.precipStrength/h,r[22]=1/259200,r[23]=1/259200,r[24]=1/2400*this.windStrength,r[25]=1/7200,r[26]=2e-5,r[27]=60*this.windStrength,r[28]=120,r[29]=45e3,r[30]=1/1800,r[31]=.05/l,r[32]=this.surfaceW,r[33]=this.surfaceH,r[34]=this.weatherW,r[35]=this.weatherH,r[36]=this.atlasW,r[37]=this.atlasH,r[38]=this.tilesX,r[39]=this.tilesY,r[40]=this.weatherOffset,r[41]=this.auxOffset,r[42]=this.oceanInertia,r[43]=0,r[44]=this.mountainHeightM,r[45]=(this.seaLevel-.5)*this.mountainHeightM,r[46]=this.windShear,r[47]=this.surfaceDrag,this.device.queue.writeBuffer(this.uniformBuffer,0,r)}_wgslSim(){return`
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
  
  // Turbulent noise for weather systems - keep it lively but bounded.
  let turbStrength = 3600.0;
  let noiseDrift = vec3<f32>(sin(timeS() * 0.002), cos(timeS() * 0.0015), sin(timeS() * 0.001)) * 0.6;
  let noisePos = dir * 4.5 + noiseDrift;
  let noiseTime = timeS() * 0.01;
  let pTurb = turbulentNoise(noisePos, noiseTime) * turbStrength;

  // Planetary wave pattern to avoid static bands.
  let lonWave = atan2(dir.z, dir.x);
  let latWave = asin(clamp(dir.y, -1.0, 1.0));
  let wave = sin(lonWave * 2.0 + timeS() * 0.004) * cos(latWave * 1.4 - timeS() * 0.003);
  let pWave = wave * 600.0;
  
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
  
  let pEq = pPhysics + pTurb + hadleyP + pWave;
  
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
  let pMidWeight = smoothstep(1.0, 80.0, abs(pMid));
  let pFinal = mix(hadleyP, pMid + hadleyP * 0.3, pMidWeight);

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
  let p01 = clamp(0.5 + pFinal * (1.0 / 4500.0), 0.0, 1.0);
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
        `}}const vf=(()=>{const n=new Uint8Array([0,0,0,0]),e=new Jn(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=En,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Nt,e})();class AT{constructor(e,{maxDrops:t=12e3}={}){this.scene=e,this.maxDrops=Math.max(0,Math.floor(t)),this.enabled=!0,this.uniforms={time:{value:0},color:{value:new Se("#bfe8ff")},opacity:{value:.55},strength:{value:1},density:{value:.65},rainThreshold:{value:.03},volumeRadius:{value:.012},volumeHeight:{value:.012},fallDistance:{value:.016},fallSpeed:{value:.35},dropLength:{value:25e-5},dropWidth:{value:5e-5},planetNearRadius:{value:12},nearMargin:{value:.35},weatherMap:{value:vf},planetInvRot:{value:new Fe},planetInvScale:{value:1},windWorld:{value:new D(0,0,0)},windTilt:{value:.65}},this.mesh=this._buildMesh(),this.mesh.visible=this.enabled,this.mesh.frustumCulled=!1,this.mesh.renderOrder=1.2,e.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWeatherMap(e){this.uniforms.weatherMap.value=e??vf}setWeatherFrame({planetInvRot:e,planetInvScale:t}){e&&this.uniforms.planetInvRot.value.copy(e),Number.isFinite(t)&&(this.uniforms.planetInvScale.value=t)}setWindWorld(e){e&&this.uniforms.windWorld.value.copy(e)}setPlanetNearRadius(e){Number.isFinite(e)&&(this.uniforms.planetNearRadius.value=Math.max(.1,e))}setStrength(e){Number.isFinite(e)&&(this.uniforms.strength.value=Math.max(0,e))}setDensity(e){Number.isFinite(e)&&(this.uniforms.density.value=Math.min(Math.max(e,0),1))}setSizes({volumeRadius:e,volumeHeight:t,fallDistance:i,dropLength:r,dropWidth:s}={}){Number.isFinite(e)&&(this.uniforms.volumeRadius.value=Math.max(0,e)),Number.isFinite(t)&&(this.uniforms.volumeHeight.value=Math.max(0,t)),Number.isFinite(i)&&(this.uniforms.fallDistance.value=Math.max(0,i)),Number.isFinite(r)&&(this.uniforms.dropLength.value=Math.max(0,r)),Number.isFinite(s)&&(this.uniforms.dropWidth.value=Math.max(0,s))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new xs(1,1,1,1),t=new qp;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const i=new Float32Array(this.maxDrops*3),r=new Float32Array(this.maxDrops);for(let a=0;a<this.maxDrops;a++){const o=a*3;i[o+0]=Math.random()*2-1,i[o+1]=Math.random(),i[o+2]=Math.random()*2-1,r[a]=Math.random()}t.setAttribute("aOffset",new Io(i,3)),t.setAttribute("aSeed",new Io(r,1)),t.instanceCount=this.maxDrops;const s=new Gt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!0,side:Ln,blending:Kn,vertexShader:`
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
            `});return e.dispose(),new Vt(t,s)}}class CT{constructor(e){this.planetGroup=e,this.mesh=null,this.enabled=!0,this.visible=!0,this.gridLat=32,this.gridLon=64,this.totalVectors=this.gridLat*this.gridLon,this.tailLength=.08,this.tailWidth=2,this.heightOffset=.02,this.maxWind=60,this.weatherTexture=null,this.weatherAuxTexture=null,this.planetRadius=1,this._initGeometry()}_initGeometry(){const e=new Float32Array(this.totalVectors*2*3),t=new Float32Array(this.totalVectors*2*3);let i=0;for(let a=0;a<this.gridLat;a++){const o=((a+.5)/this.gridLat-.5)*Math.PI,l=Math.cos(o),c=Math.sin(o);for(let h=0;h<this.gridLon;h++){const d=((h+.5)/this.gridLon-.5)*Math.PI*2,f=Math.cos(d),g=Math.sin(d),p=l*f,y=c,m=l*g,u=i*6;e[u+0]=p,e[u+1]=y,e[u+2]=m,e[u+3]=p,e[u+4]=y,e[u+5]=m,t[u+0]=.5,t[u+1]=.5,t[u+2]=.5,t[u+3]=.5,t[u+4]=.5,t[u+5]=.5,i++}}const r=new Jt;r.setAttribute("position",new Dt(e,3)),r.setAttribute("color",new Dt(t,3));const s=new Gu({vertexColors:!0,linewidth:this.tailWidth,transparent:!0,opacity:.9,depthTest:!0,depthWrite:!1});this.mesh=new kp(r,s),this.mesh.renderOrder=100,this.mesh.frustumCulled=!1,this.planetGroup.add(this.mesh)}setWeatherTextures(e,t){this.weatherTexture=e,this.weatherAuxTexture=t}setPlanetRadius(e){this.planetRadius=e}setConfig({tailLength:e,gridLat:t,gridLon:i,heightOffset:r,enabled:s,visible:a}={}){typeof e=="number"&&(this.tailLength=e),typeof r=="number"&&(this.heightOffset=r),typeof s=="boolean"&&(this.enabled=s),typeof a=="boolean"&&(this.visible=a,this.mesh&&(this.mesh.visible=a)),(t&&t!==this.gridLat||i&&i!==this.gridLon)&&(this.gridLat=t||this.gridLat,this.gridLon=i||this.gridLon,this.totalVectors=this.gridLat*this.gridLon,this._rebuildGeometry())}_rebuildGeometry(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()),this._initGeometry()}_sampleTexture(e,t,i){var f;if(!((f=e==null?void 0:e.image)!=null&&f.data))return{r:128,g:128,b:128,a:128};const r=e.image.data,s=e.image.width,a=e.image.height,o=Math.max(0,Math.min(1,t)),l=Math.max(0,Math.min(1,i)),c=Math.floor(o*(s-1)),d=(Math.floor(l*(a-1))*s+c)*4;return{r:r[d]||0,g:r[d+1]||0,b:r[d+2]||0,a:r[d+3]||0}}update(){var a,o,l,c;if(!this.enabled||!this.mesh||!this.visible||!((o=(a=this.weatherTexture)==null?void 0:a.image)!=null&&o.data)||!((c=(l=this.weatherAuxTexture)==null?void 0:l.image)!=null&&c.data))return;const e=this.mesh.geometry.attributes.position.array,t=this.mesh.geometry.attributes.color.array,i=this.planetRadius*(1+this.heightOffset),r=this.planetRadius*this.tailLength;let s=0;for(let h=0;h<this.gridLat;h++){const d=((h+.5)/this.gridLat-.5)*Math.PI,f=Math.cos(d),g=Math.sin(d),p=(h+.5)/this.gridLat;for(let y=0;y<this.gridLon;y++){const m=((y+.5)/this.gridLon-.5)*Math.PI*2,u=Math.cos(m),v=Math.sin(m),_=(y+.5)/this.gridLon,x=f*u,M=g,S=f*v,C=this._sampleTexture(this.weatherTexture,_,p).b/255,w=this._sampleTexture(this.weatherAuxTexture,_,p),b=(w.b/255-.5)*2,R=(w.a/255-.5)*2,I=-v,N=0,O=u,H=-g*u,k=f,q=-g*v,z=Math.sqrt(b*b+R*R);let $=I*b+H*R,ne=N*b+k*R,re=O*b+q*R;const he=Math.sqrt($*$+ne*ne+re*re);he>.001&&($/=he,ne/=he,re/=he);const ge=s*6;e[ge+0]=x*i,e[ge+1]=M*i,e[ge+2]=S*i;const X=r*Math.max(.3,z);e[ge+3]=x*i+$*X,e[ge+4]=M*i+ne*X,e[ge+5]=S*i+re*X;let Z,se,ee;if(C<.5){const xe=C*2;Z=1,se=xe,ee=xe}else{const xe=(C-.5)*2;Z=1-xe,se=1-xe,ee=1}const de=.4+z*.6;Z*=de,se*=de,ee*=de,t[ge+0]=Z,t[ge+1]=se,t[ge+2]=ee,t[ge+3]=Z,t[ge+4]=se,t[ge+5]=ee,s++}}this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.attributes.color.needsUpdate=!0}setVisible(e){this.visible=e,this.mesh&&(this.mesh.visible=e)}dispose(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh=null)}}class RT{constructor(e,t={}){this.planetGroup=e,this.currentMesh=null,this.waveMesh=null,this.enabled=!0,this.visible=!0,this.gridLat=t.gridLat??24,this.gridLon=t.gridLon??48,this.totalVectors=this.gridLat*this.gridLon,this.currentTailLength=.06,this.waveTailLength=.045,this.heightOffset=.015,this.maxCurrent=60,this.maxWave=1,this.showCurrents=!0,this.showWaves=!0,this.oceanTexture=null,this.weatherTexture=null,this.windField=null,this.windFieldW=0,this.windFieldH=0,this.planetRadius=1,this._initGeometry()}_initGeometry(){this._disposeGeometry(),this.currentMesh=this._createLineMesh(.85),this.waveMesh=this._createLineMesh(.9),this.currentMesh.visible=!1,this.waveMesh.visible=!1,this.planetGroup.add(this.currentMesh),this.planetGroup.add(this.waveMesh)}_disposeGeometry(){this.currentMesh&&(this.planetGroup.remove(this.currentMesh),this.currentMesh.geometry.dispose(),this.currentMesh.material.dispose()),this.waveMesh&&(this.planetGroup.remove(this.waveMesh),this.waveMesh.geometry.dispose(),this.waveMesh.material.dispose()),this.currentMesh=null,this.waveMesh=null}_createLineMesh(e){const t=new Float32Array(this.totalVectors*2*3),i=new Float32Array(this.totalVectors*2*3),r=new Jt;r.setAttribute("position",new Dt(t,3)),r.setAttribute("color",new Dt(i,3));const s=new Gu({vertexColors:!0,transparent:!0,opacity:e,depthTest:!0,depthWrite:!1}),a=new kp(r,s);return a.frustumCulled=!1,a.renderOrder=100,a}setOceanTexture(e){this.oceanTexture=e}setWeatherTexture(e){this.weatherTexture=e}setWindField(e,t,i){this.windField=e,this.windFieldW=t||0,this.windFieldH=i||0}setPlanetRadius(e){Number.isFinite(e)&&e>0&&(this.planetRadius=e)}setConfig({showCurrents:e,showWaves:t,currentTailLength:i,waveTailLength:r,heightOffset:s,maxCurrent:a,maxWave:o,gridLat:l,gridLon:c,visible:h}={}){typeof e=="boolean"&&(this.showCurrents=e),typeof t=="boolean"&&(this.showWaves=t),Number.isFinite(i)&&(this.currentTailLength=Math.max(.01,i)),Number.isFinite(r)&&(this.waveTailLength=Math.max(.01,r)),Number.isFinite(s)&&(this.heightOffset=Math.max(0,s)),Number.isFinite(a)&&(this.maxCurrent=Math.max(.1,a)),Number.isFinite(o)&&(this.maxWave=Math.max(.1,o)),typeof h=="boolean"&&(this.visible=h);const d=Number.isFinite(l)?Math.max(4,Math.floor(l)):this.gridLat,f=Number.isFinite(c)?Math.max(4,Math.floor(c)):this.gridLon;(d!==this.gridLat||f!==this.gridLon)&&(this.gridLat=d,this.gridLon=f,this.totalVectors=this.gridLat*this.gridLon,this._initGeometry()),this.currentMesh&&(this.currentMesh.visible=this.visible&&this.showCurrents),this.waveMesh&&(this.waveMesh.visible=this.visible&&this.showWaves)}_sampleWindField(e,t){if(!this.windField||!this.windFieldW||!this.windFieldH)return[0,0];const i=Math.min(this.windFieldW-1,Math.max(0,Math.floor(e*this.windFieldW))),s=(Math.min(this.windFieldH-1,Math.max(0,Math.floor(t*this.windFieldH)))*this.windFieldW+i)*2;return[this.windField[s]||0,this.windField[s+1]||0]}_sampleOceanNormal(e,t){var d,f,g,p,y,m;const i=(f=(d=this.oceanTexture)==null?void 0:d.image)==null?void 0:f.data,r=((p=(g=this.oceanTexture)==null?void 0:g.image)==null?void 0:p.width)??0,s=((m=(y=this.oceanTexture)==null?void 0:y.image)==null?void 0:m.height)??0;if(!i||!r||!s)return[0,0];const a=Math.min(r-1,Math.max(0,Math.floor(e*r))),l=(Math.min(s-1,Math.max(0,Math.floor(t*s)))*r+a)*4,c=((i[l+1]??128)/255-.5)*2,h=((i[l+2]??128)/255-.5)*2;return[c,h]}_samplePressure(e,t){var c,h,d,f,g,p;const i=(h=(c=this.weatherTexture)==null?void 0:c.image)==null?void 0:h.data,r=((f=(d=this.weatherTexture)==null?void 0:d.image)==null?void 0:f.width)??0,s=((p=(g=this.weatherTexture)==null?void 0:g.image)==null?void 0:p.height)??0;if(!i||!r||!s)return .5;const a=Math.min(r-1,Math.max(0,Math.floor(e*r))),l=(Math.min(s-1,Math.max(0,Math.floor(t*s)))*r+a)*4;return(i[l+2]??128)/255}update(){if(!this.enabled||!this.visible)return;const e=this.showCurrents&&this.currentMesh,t=this.showWaves&&this.waveMesh;if(!e&&!t)return;const i=e?this.currentMesh.geometry.attributes.position.array:null,r=e?this.currentMesh.geometry.attributes.color.array:null,s=t?this.waveMesh.geometry.attributes.position.array:null,a=t?this.waveMesh.geometry.attributes.color.array:null,o=this.planetRadius*(1+this.heightOffset),l=this.planetRadius*this.currentTailLength,c=this.planetRadius*this.waveTailLength;let h=0;for(let d=0;d<this.gridLat;d++){const f=((d+.5)/this.gridLat-.5)*Math.PI,g=Math.cos(f),p=Math.sin(f),y=(d+.5)/this.gridLat;for(let m=0;m<this.gridLon;m++){const u=((m+.5)/this.gridLon-.5)*Math.PI*2,v=Math.cos(u),_=Math.sin(u),x=(m+.5)/this.gridLon,M=g*v,S=p,E=g*_,C=-_,w=0,b=v,R=-p*v,I=g,N=-p*_,O=h*6,H=this._samplePressure(x,y);if(e&&i&&r){const[k,q]=this._sampleWindField(x,y),z=Math.hypot(k,q);let $=C*k+R*q,ne=w*k+I*q,re=b*k+N*q;const he=Math.hypot($,ne,re);he>1e-6?($/=he,ne/=he,re/=he):($=0,ne=0,re=0);const ge=Math.min(z/this.maxCurrent,1),X=l*Math.max(.15,ge);i[O+0]=M*o,i[O+1]=S*o,i[O+2]=E*o,i[O+3]=M*o+$*X,i[O+4]=S*o+ne*X,i[O+5]=E*o+re*X;let Z,se,ee;if(H<.5){const xe=H*2;Z=1,se=xe,ee=xe}else{const xe=(H-.5)*2;Z=1-xe,se=1-xe,ee=1}const de=.35+ge*.65;Z*=de,se*=de,ee*=de,r[O+0]=Z,r[O+1]=se,r[O+2]=ee,r[O+3]=Z,r[O+4]=se,r[O+5]=ee}if(t&&s&&a){const[k,q]=this._sampleOceanNormal(x,y),z=Math.hypot(k,q);let $=C*k+R*q,ne=w*k+I*q,re=b*k+N*q;const he=Math.hypot($,ne,re);he>1e-6?($/=he,ne/=he,re/=he):($=0,ne=0,re=0);const ge=Math.min(z/this.maxWave,1),X=c*Math.max(.1,ge);s[O+0]=M*o,s[O+1]=S*o,s[O+2]=E*o,s[O+3]=M*o+$*X,s[O+4]=S*o+ne*X,s[O+5]=E*o+re*X;let Z,se,ee;if(H<.5){const xe=H*2;Z=1,se=xe,ee=xe}else{const xe=(H-.5)*2;Z=1-xe,se=1-xe,ee=1}const de=.25+ge*.75;Z*=de,se*=de,ee*=de,a[O+0]=Z,a[O+1]=se,a[O+2]=ee,a[O+3]=Z,a[O+4]=se,a[O+5]=ee}h++}}e&&(this.currentMesh.geometry.attributes.position.needsUpdate=!0,this.currentMesh.geometry.attributes.color.needsUpdate=!0),t&&(this.waveMesh.geometry.attributes.position.needsUpdate=!0,this.waveMesh.geometry.attributes.color.needsUpdate=!0)}setVisible(e){this.visible=e,this.currentMesh&&(this.currentMesh.visible=e&&this.showCurrents),this.waveMesh&&(this.waveMesh.visible=e&&this.showWaves)}dispose(){this._disposeGeometry()}}const PT=60;function ro(n,e){return(n/255-.5)*2*e}function DT(n,e,t,i={}){const r=n==null?void 0:n.image,s=r==null?void 0:r.data,a=(r==null?void 0:r.width)??0,o=(r==null?void 0:r.height)??0,l=Number.isFinite(i.maxWind)?i.maxWind:PT,c=Number.isFinite(i.scale)?i.scale:1;if(!s||!a||!o||!e||!t)return null;const h=e*t,d=i.out&&i.out.length>=h*2?i.out:new Float32Array(h*2);if(a===e&&o===t){for(let f=0;f<h;f++){const g=f*4;d[f*2]=ro(s[g+2]??0,l)*c,d[f*2+1]=ro(s[g+3]??0,l)*c}return d}for(let f=0;f<t;f++){const g=(f+.5)/t;for(let p=0;p<e;p++){const y=(p+.5)/e,m=Dm(n,y,g),u=(f*e+p)*2;d[u]=ro(m.b??0,l)*c,d[u+1]=ro(m.a??0,l)*c}}return d}const LT=["px","nx","py","ny","pz","nz"],Im=6,IT=Im;function UT(n,e={}){const t=Math.max(2,Math.floor(Number(n)||2)),i=Math.max(1,Math.floor(Number(e.channels)||1)),r=Array.from({length:Im},(s,a)=>({index:a,name:LT[a],resolution:t,channels:i,data:new Float32Array(t*t*i)}));return{resolution:t,channels:i,faces:r}}function FT(n){const e=Math.floor(Number(n)||0);return Math.min(Math.max(e,4),256)}function Bs(n,e){const t=n*n;return Array.from({length:IT},()=>new Float32Array(t*e))}function NT(n={}){const e=FT(n.resolution??32),t=UT(e,{channels:1});return{resolution:e,cellCount:e*e,grid:t,velocity:Bs(e,2),temperature:Bs(e,1),salinity:Bs(e,1),pressure:Bs(e,1),surfaceFlux:Bs(e,2)}}class BT{constructor(e){this.callbacks=e||{},this.els={hud:document.getElementById("hud"),hudToggle:document.getElementById("hudToggle"),hudContent:document.getElementById("hudContent"),status:document.getElementById("status"),preset:document.getElementById("preset"),regenBtn:document.getElementById("regen"),resolution:document.getElementById("resolution"),plates:document.getElementById("plates"),plateSizeVariance:document.getElementById("plateSizeVariance"),jitter:document.getElementById("jitter"),heightScale:document.getElementById("heightScale"),iterations:document.getElementById("iterations"),erosionRate:document.getElementById("erosionRate"),evaporation:document.getElementById("evaporation"),seaLevel:document.getElementById("seaLevel"),smoothPasses:document.getElementById("smoothPasses"),subdivisions:document.getElementById("subdivisions"),iceCap:document.getElementById("iceCap"),plateDelta:document.getElementById("plateDelta"),faultType:document.getElementById("faultType"),desymmetrizeTiling:document.getElementById("desymmetrizeTiling"),atmosphere:document.getElementById("atmosphere"),waterShader:document.getElementById("waterShader"),waterShader:document.getElementById("waterShader"),jitterValue:document.getElementById("jitterValue"),heightScaleValue:document.getElementById("heightScaleValue"),erosionRateValue:document.getElementById("erosionRateValue"),evaporationValue:document.getElementById("evaporationValue"),seaLevelValue:document.getElementById("seaLevelValue"),smoothPassesValue:document.getElementById("smoothPassesValue"),subdivisionsValue:document.getElementById("subdivisionsValue"),iceCapValue:document.getElementById("iceCapValue"),plateDeltaValue:document.getElementById("plateDeltaValue"),plateSizeVarianceValue:document.getElementById("plateSizeVarianceValue"),atmosphereValue:document.getElementById("atmosphereValue"),atmosphereHeight:document.getElementById("atmosphereHeight"),atmosphereHeightValue:document.getElementById("atmosphereHeightValue"),atmosphereToggle:document.getElementById("atmosphereToggle"),atmosphereAlpha:document.getElementById("atmosphereAlpha"),atmosphereAlphaValue:document.getElementById("atmosphereAlphaValue"),atmosphereColor:document.getElementById("atmosphereColor"),cloudToggle:document.getElementById("cloudToggle"),cloudAlpha:document.getElementById("cloudAlpha"),cloudAlphaValue:document.getElementById("cloudAlphaValue"),cloudSpeed:document.getElementById("cloudSpeed"),cloudSpeedValue:document.getElementById("cloudSpeedValue"),cloudQuantity:document.getElementById("cloudQuantity"),cloudQuantityValue:document.getElementById("cloudQuantityValue"),cloudHeight:document.getElementById("cloudHeight"),cloudHeightValue:document.getElementById("cloudHeightValue"),cloudColor:document.getElementById("cloudColor"),cloudResolution:document.getElementById("cloudResolution"),cloudResolutionValue:document.getElementById("cloudResolutionValue"),cloudShader:document.getElementById("cloudShader"),cloudLayers:document.getElementById("cloudLayers"),addCloudLayerBtn:document.getElementById("addCloudLayer"),movePad:document.getElementById("movePad"),lookPad:document.getElementById("lookPad"),mobileControls:document.getElementById("mobileControls"),surfaceOnlyBtn:document.getElementById("surfaceOnly"),configToggle:document.getElementById("configToggle"),configPanel:document.getElementById("configPanel"),vrToggle:document.getElementById("vrToggle"),reticle:document.getElementById("reticle"),leftStickSensitivity:document.getElementById("leftStickSensitivity"),leftStickSensitivityValue:document.getElementById("leftStickSensitivityValue"),lookSensitivityX:document.getElementById("lookSensitivityX"),lookSensitivityXValue:document.getElementById("lookSensitivityXValue"),lookSensitivityY:document.getElementById("lookSensitivityY"),lookSensitivityYValue:document.getElementById("lookSensitivityYValue"),invertLook:document.getElementById("invertLook"),planetDiameter:document.getElementById("planetDiameter"),planetDiameterValue:document.getElementById("planetDiameterValue")},this.cloudLayerSettings=[],this.setStatus=this.setStatus.bind(this),this.bindEvents(),this.updateRangeLabels(),this.renderCloudLayerControls()}getPlanetDiameterKm(){var t;const e=parseFloat((t=this.els.planetDiameter)==null?void 0:t.value);return oe(Number.isFinite(e)?e:Bi,1,1e3)}applyPreset(e){const t=No[e]||No.balanced;if(this.els.preset&&(this.els.preset.value=e),this.els.atmosphereToggle&&t.atmosphereEnabled!==void 0&&(this.els.atmosphereToggle.checked=!!t.atmosphereEnabled),this.els.cloudToggle){const i=t.cloudEnabled!==void 0?!!t.cloudEnabled:!1;this.els.cloudToggle.checked=i}this.els.resolution&&(this.els.resolution.value=t.resolution),this.els.plates&&(this.els.plates.value=t.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=t.plateSizeVariance??.35),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=t.desymmetrizeTiling??!0),this.els.jitter&&(this.els.jitter.value=t.jitter),this.els.heightScale&&(this.els.heightScale.value=t.heightScale),this.els.iterations&&(this.els.iterations.value=t.iterations),this.els.erosionRate&&(this.els.erosionRate.value=t.erosionRate),this.els.evaporation&&(this.els.evaporation.value=t.evaporation),this.els.seaLevel&&(this.els.seaLevel.value=t.seaLevel??.53),this.els.atmosphere&&(this.els.atmosphere.value=t.atmosphere??.35),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=t.atmosphereHeight??.5),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=t.atmosphereAlpha??1),this.els.atmosphereColor&&(this.els.atmosphereColor.value=t.atmosphereColor||"#4da8ff"),this.els.smoothPasses&&(this.els.smoothPasses.value=t.smoothPasses??20),this.els.subdivisions&&(this.els.subdivisions.value=t.subdivisions??60),this.els.iceCap&&(this.els.iceCap.value=t.iceCap??.15),this.els.plateDelta&&(this.els.plateDelta.value=t.plateDelta??1.25),this.els.faultType&&(this.els.faultType.value=t.faultType||"ridge"),this.els.cloudAlpha&&t.cloudAlpha!==void 0&&(this.els.cloudAlpha.value=t.cloudAlpha),this.els.cloudSpeed&&t.cloudSpeed!==void 0&&(this.els.cloudSpeed.value=t.cloudSpeed),this.els.cloudQuantity&&t.cloudQuantity!==void 0&&(this.els.cloudQuantity.value=t.cloudQuantity),this.els.cloudHeight&&t.cloudHeight!==void 0&&(this.els.cloudHeight.value=t.cloudHeight),this.els.cloudColor&&t.cloudColor!==void 0&&(this.els.cloudColor.value=t.cloudColor),this.els.cloudResolution&&t.cloudResolution!==void 0&&(this.els.cloudResolution.value=t.cloudResolution),this.els.cloudShader&&t.cloudShader!==void 0&&(this.els.cloudShader.value=t.cloudShader),this.els.waterShader&&(this.els.waterShader.value=t.waterShader||(e==="fast"?"fast":"balanced")),this.updateRangeLabels()}readSettings(){var e,t,i,r,s,a,o,l,c,h,d,f,g,p,y,m,u,v,_,x;return{resolution:oe(parseInt((e=this.els.resolution)==null?void 0:e.value,10)||256,64,4096),numPlates:oe(parseInt((t=this.els.plates)==null?void 0:t.value,10)||7,1,30),plateSizeVariance:oe(parseFloat((i=this.els.plateSizeVariance)==null?void 0:i.value)||0,0,2),desymmetrizeTiling:!!((r=this.els.desymmetrizeTiling)!=null&&r.checked),jitter:oe(parseFloat((s=this.els.jitter)==null?void 0:s.value)||.5,0,1),iterations:oe(parseInt((a=this.els.iterations)==null?void 0:a.value,10)||5e4,1e3,2e6),erosionRate:oe(parseFloat((o=this.els.erosionRate)==null?void 0:o.value)||.1,.001,2),evaporation:oe(parseFloat((l=this.els.evaporation)==null?void 0:l.value)||.02,0,2),heightScale:oe(parseFloat((c=this.els.heightScale)==null?void 0:c.value)||2,0,80),seaLevel:oe(parseFloat((h=this.els.seaLevel)==null?void 0:h.value)||.5,0,1),atmosphere:oe(parseFloat((d=this.els.atmosphere)==null?void 0:d.value)||.35,.05,1.5),atmosphereHeight:oe(parseFloat((f=this.els.atmosphereHeight)==null?void 0:f.value)||.5,0,5),atmosphereAlpha:oe(parseFloat((g=this.els.atmosphereAlpha)==null?void 0:g.value)||1,0,1),atmosphereColor:((p=this.els.atmosphereColor)==null?void 0:p.value)||"#4da8ff",smoothPasses:Math.round(oe(parseFloat((y=this.els.smoothPasses)==null?void 0:y.value)||0,0,40)),subdivisions:Math.round(oe(parseFloat((m=this.els.subdivisions)==null?void 0:m.value)||128,0,512)),iceCap:oe(parseFloat((u=this.els.iceCap)==null?void 0:u.value)||.1,0,1),plateDelta:oe(parseFloat((v=this.els.plateDelta)==null?void 0:v.value)||1.25,0,2),faultType:((_=this.els.faultType)==null?void 0:_.value)||"ridge",radius:un,waterShader:((x=this.els.waterShader)==null?void 0:x.value)||"balanced"}}writeSettings(e){e&&(this.els.resolution&&(this.els.resolution.value=e.resolution),this.els.plates&&(this.els.plates.value=e.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=e.plateSizeVariance),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),this.els.jitter&&(this.els.jitter.value=e.jitter),this.els.iterations&&(this.els.iterations.value=e.iterations),this.els.erosionRate&&(this.els.erosionRate.value=e.erosionRate),this.els.evaporation&&(this.els.evaporation.value=e.evaporation),this.els.heightScale&&(this.els.heightScale.value=e.heightScale),this.els.seaLevel&&(this.els.seaLevel.value=e.seaLevel),this.els.atmosphere&&(this.els.atmosphere.value=e.atmosphere),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=e.atmosphereHeight),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=e.atmosphereAlpha),this.els.atmosphereColor&&(this.els.atmosphereColor.value=e.atmosphereColor),this.els.smoothPasses&&(this.els.smoothPasses.value=e.smoothPasses),this.els.subdivisions&&(this.els.subdivisions.value=e.subdivisions),this.els.iceCap&&(this.els.iceCap.value=e.iceCap),this.els.plateDelta&&(this.els.plateDelta.value=e.plateDelta),this.els.faultType&&(this.els.faultType.value=e.faultType),this.els.waterShader&&(this.els.waterShader.value=e.waterShader||"balanced"),this.updateRangeLabels())}bindEvents(){if([this.els.resolution,this.els.plates,this.els.plateSizeVariance,this.els.desymmetrizeTiling,this.els.jitter,this.els.heightScale,this.els.iterations,this.els.erosionRate,this.els.evaporation,this.els.seaLevel,this.els.atmosphere,this.els.smoothPasses,this.els.subdivisions,this.els.iceCap,this.els.plateDelta,this.els.faultType,this.els.waterShader].forEach(r=>{if(!r)return;const s=()=>{this.updateRangeLabels(),this.callbacks.onRegen&&this.callbacks.onRegen()};r.addEventListener("input",s),r.addEventListener("change",s)}),this.els.regenBtn&&this.els.regenBtn.addEventListener("click",()=>{this.callbacks.onRegen&&this.callbacks.onRegen()}),this.els.preset&&this.els.preset.addEventListener("change",()=>{this.callbacks.onPreset&&this.callbacks.onPreset(this.els.preset.value)}),this.els.planetDiameter){const r=()=>{this.updateRangeLabels(),this.callbacks.onDiameterChange&&this.callbacks.onDiameterChange(this.getPlanetDiameterKm())};this.els.planetDiameter.addEventListener("input",r),this.els.planetDiameter.addEventListener("change",r)}[this.els.atmosphere,this.els.atmosphereAlpha,this.els.atmosphereColor,this.els.atmosphereToggle].forEach(r=>{r&&(r.addEventListener(r.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}),r.type==="range"&&r.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}))}),[this.els.cloudToggle,this.els.cloudAlpha,this.els.cloudSpeed,this.els.cloudQuantity,this.els.cloudHeight,this.els.cloudColor,this.els.cloudResolution,this.els.cloudShader].forEach(r=>{r&&(r.addEventListener(r.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),r.type==="range"&&r.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}))}),this.els.addCloudLayerBtn&&this.els.addCloudLayerBtn.addEventListener("click",()=>{const r=this.getBaseCloudSettings(),s=this.cloudLayerSettings.length?this.cloudLayerSettings[this.cloudLayerSettings.length-1].height:r.height,a={...r,id:`extra-${Date.now()}`,height:s+.3};this.cloudLayerSettings.push(a),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),this.els.hudToggle&&this.els.hudToggle.addEventListener("click",()=>{this.setHudCollapsed(!this.els.hud.classList.contains("collapsed"))}),this.els.configToggle&&this.els.configToggle.addEventListener("click",()=>this.toggleConfigPanel()),this.els.vrToggle&&this.els.vrToggle.addEventListener("click",()=>{this.callbacks.onVRToggle&&this.callbacks.onVRToggle()}),[this.els.leftStickSensitivity,this.els.lookSensitivityX,this.els.lookSensitivityY].forEach(r=>{r&&r.addEventListener("input",()=>this.updateRangeLabels())}),this.els.invertLook&&this.els.invertLook.addEventListener("change",()=>this.updateRangeLabels())}setStatus(e){var t;(t=this.els)!=null&&t.status&&(this.els.status.textContent=e)}setHudCollapsed(e){!this.els.hud||!this.els.hudToggle||!this.els.hudContent||(this.els.hud.classList.toggle("collapsed",e),this.els.hudToggle.setAttribute("aria-expanded",(!e).toString()),this.els.hudContent.setAttribute("aria-hidden",e.toString()),this.els.hudToggle.textContent=e?"Show controls":"Hide controls")}toggleConfigPanel(e){if(!this.els.configPanel||!this.els.configToggle)return;const t=e??this.els.configPanel.style.display!=="block";this.els.configPanel.style.display=t?"block":"none",this.els.configToggle.setAttribute("aria-expanded",t.toString()),this.els.reticle&&t&&(this.els.reticle.style.display="none")}syncMobileVisibility(e,t){if(!this.els.mobileControls)return;if(!e){this.els.mobileControls.style.display="none",this.els.reticle&&(this.els.reticle.style.display="none");return}this.els.mobileControls.style.display="block",this.els.movePad&&(this.els.movePad.style.display=t?"grid":"none"),this.els.lookPad&&(this.els.lookPad.style.display=t?"grid":"none");const i=this.els.mobileControls.querySelector(".action-column");i&&(i.style.display=t?"grid":"none"),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.style.display=t?"none":"inline-flex"),this.els.reticle&&(this.els.reticle.style.display="block")}updateRangeLabels(){const e=this.els;e.jitterValue&&(e.jitterValue.textContent=Number(e.jitter.value).toFixed(2)),e.heightScaleValue&&(e.heightScaleValue.textContent=Number(e.heightScale.value).toFixed(2)),e.erosionRateValue&&(e.erosionRateValue.textContent=Number(e.erosionRate.value).toFixed(2)),e.evaporationValue&&(e.evaporationValue.textContent=Number(e.evaporation.value).toFixed(3)),e.seaLevelValue&&(e.seaLevelValue.textContent=Number(e.seaLevel.value).toFixed(2)),e.atmosphereValue&&(e.atmosphereValue.textContent=Number(e.atmosphere.value).toFixed(2)),e.atmosphereHeightValue&&(e.atmosphereHeightValue.textContent=Number(e.atmosphereHeight.value).toFixed(2)),e.smoothPassesValue&&(e.smoothPassesValue.textContent=Number(e.smoothPasses.value).toFixed(0)),e.subdivisionsValue&&(e.subdivisionsValue.textContent=Number(e.subdivisions.value).toFixed(0)),e.iceCapValue&&(e.iceCapValue.textContent=Number(e.iceCap.value).toFixed(2)),e.plateDeltaValue&&(e.plateDeltaValue.textContent=Number(e.plateDelta.value).toFixed(2)),e.plateSizeVarianceValue&&(e.plateSizeVarianceValue.textContent=Number(e.plateSizeVariance.value).toFixed(2)),e.atmosphereAlphaValue&&(e.atmosphereAlphaValue.textContent=Number(e.atmosphereAlpha.value).toFixed(2)),e.cloudAlphaValue&&(e.cloudAlphaValue.textContent=Number(e.cloudAlpha.value).toFixed(2)),e.cloudSpeedValue&&(e.cloudSpeedValue.textContent=Number(e.cloudSpeed.value).toFixed(2)),e.cloudQuantityValue&&(e.cloudQuantityValue.textContent=Number(e.cloudQuantity.value).toFixed(2)),e.cloudHeightValue&&(e.cloudHeightValue.textContent=Number(e.cloudHeight.value).toFixed(2)),e.cloudResolutionValue&&(e.cloudResolutionValue.textContent=Number(e.cloudResolution.value).toFixed(0)),e.planetDiameter&&e.planetDiameterValue&&(e.planetDiameterValue.textContent=Number(e.planetDiameter.value).toFixed(0)),e.leftStickSensitivity&&e.leftStickSensitivityValue&&(e.leftStickSensitivityValue.textContent=Number(e.leftStickSensitivity.value).toFixed(1)),e.lookSensitivityX&&e.lookSensitivityXValue&&(e.lookSensitivityXValue.textContent=Number(e.lookSensitivityX.value).toFixed(1)),e.lookSensitivityY&&e.lookSensitivityYValue&&(e.lookSensitivityYValue.textContent=Number(e.lookSensitivityY.value).toFixed(1))}readSettings(){var t;const e=this.els;return{resolution:oe(parseInt(e.resolution.value,10)||256,64,4096),numPlates:oe(parseInt(e.plates.value,10)||9,4,400),plateSizeVariance:oe(parseFloat(e.plateSizeVariance.value)||0,0,2),desymmetrizeTiling:!!((t=e.desymmetrizeTiling)!=null&&t.checked),jitter:oe(parseFloat(e.jitter.value)||.5,0,1),iterations:oe(parseInt(e.iterations.value,10)||5e4,1e3,2e6),erosionRate:oe(parseFloat(e.erosionRate.value)||.1,.001,2),evaporation:oe(parseFloat(e.evaporation.value)||.02,0,2),heightScale:oe(parseFloat(e.heightScale.value)||2,0,80),seaLevel:oe(parseFloat(e.seaLevel.value)||.5,0,1),atmosphere:oe(parseFloat(e.atmosphere.value)||.35,.05,1.5),atmosphereHeight:oe(parseFloat(e.atmosphereHeight.value)||.5,0,5),atmosphereAlpha:oe(parseFloat(e.atmosphereAlpha.value)||1,0,1),atmosphereColor:e.atmosphereColor.value||"#4da8ff",atmosphereEnabled:e.atmosphereToggle.checked,smoothPasses:Math.round(oe(parseFloat(e.smoothPasses.value)||0,0,40)),subdivisions:Math.round(oe(parseFloat(e.subdivisions.value)||128,0,512)),iceCap:oe(parseFloat(e.iceCap.value)||.1,0,1),plateDelta:oe(parseFloat(e.plateDelta.value)||1.25,0,2),faultType:e.faultType.value||"ridge",radius:un,planetDiameterKm:this.getPlanetDiameterKm()}}writeSettings(e){const t=this.els;t.resolution.value=e.resolution,t.plates.value=e.numPlates,t.plateSizeVariance.value=e.plateSizeVariance,t.desymmetrizeTiling&&(t.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),t.jitter.value=e.jitter,t.iterations.value=e.iterations,t.erosionRate.value=e.erosionRate,t.evaporation.value=e.evaporation,t.heightScale.value=e.heightScale,t.seaLevel.value=e.seaLevel,t.atmosphere.value=e.atmosphere,t.atmosphereHeight.value=e.atmosphereHeight,t.atmosphereAlpha.value=e.atmosphereAlpha,t.atmosphereColor.value=e.atmosphereColor,t.smoothPasses.value=e.smoothPasses,t.subdivisions.value=e.subdivisions,t.iceCap.value=e.iceCap,t.plateDelta.value=e.plateDelta,t.faultType.value=e.faultType,this.updateRangeLabels()}getPlanetDiameterKm(){if(!this.els.planetDiameter)return Bi;const e=parseFloat(this.els.planetDiameter.value);return oe(Number.isFinite(e)?e:Bi,1,1e3)}getBaseCloudSettings(){return{id:"base",enabled:this.els.cloudToggle.checked,alpha:oe(parseFloat(this.els.cloudAlpha.value)||.74,0,1),speed:oe(parseFloat(this.els.cloudSpeed.value)||.9,0,2),quantity:oe(parseFloat(this.els.cloudQuantity.value)||.76,0,1),height:oe(parseFloat(this.els.cloudHeight.value)||-2.4,-5,5),color:this.els.cloudColor.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(this.els.cloudResolution.value)||256)),mode:this.els.cloudShader.value||"billow"}}createCloudLayerControls(e){const t=document.createElement("div");t.className="layer",t.style.border="1px solid var(--border)",t.style.padding="8px",t.style.marginBottom="8px";const i={alpha:"Opacity of this cloud layer.",speed:"Animation speed for this cloud layer.",quantity:"Coverage and density for this cloud layer.",height:"Altitude offset for this cloud layer.",resolution:"Texture resolution for this cloud layer."},r=document.createElement("div");r.textContent=`Layer ${e.label||this.cloudLayerSettings.length+1}`,r.style.fontSize="12px",r.style.color="var(--muted)",t.appendChild(r);const s=(y,m,u,v,_)=>{const x=document.createElement("div");x.className="field";const M=document.createElement("label");M.textContent=y,i[m]&&(M.title=i[m]);const S=document.createElement("div");S.className="range-row";const E=document.createElement("input");E.type="range",E.min=u,E.max=v,E.step=_,E.value=e[m],i[m]&&(E.title=i[m]);const C=document.createElement("span");return C.className="value",C.textContent=Number(e[m]).toFixed(_<1?2:0),S.appendChild(E),S.appendChild(C),x.appendChild(M),x.appendChild(S),E.addEventListener("input",()=>{e[m]=parseFloat(E.value),C.textContent=Number(e[m]).toFixed(_<1?2:0),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),x},a=document.createElement("label"),o=document.createElement("input");o.type="checkbox",o.checked=e.enabled,o.title="Enable this cloud layer.",o.addEventListener("change",()=>{e.enabled=o.checked,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),a.appendChild(o),a.append(" Layer enabled"),t.appendChild(a),t.appendChild(s("Alpha","alpha",0,1,.01)),t.appendChild(s("Speed","speed",0,2,.05)),t.appendChild(s("Quantity","quantity",0,1,.01)),t.appendChild(s("Height","height",-5,5,.05)),t.appendChild(s("Resolution","resolution",1,256,1));const l=document.createElement("div");l.className="field";const c=document.createElement("label");c.textContent="Shader";const h=document.createElement("select");h.title="Noise type used to generate this layer.",["fbm","billow","cellular"].forEach(y=>{const m=document.createElement("option");m.value=y,m.textContent=y.charAt(0).toUpperCase()+y.slice(1),e.mode===y&&(m.selected=!0),h.appendChild(m)}),h.addEventListener("change",()=>{e.mode=h.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),l.appendChild(c),l.appendChild(h),t.appendChild(l);const d=document.createElement("div");d.className="field";const f=document.createElement("label");f.textContent="Color";const g=document.createElement("input");g.type="color",g.value=e.color,g.title="Tint for this cloud layer.",g.addEventListener("input",()=>{e.color=g.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),d.appendChild(f),d.appendChild(g),t.appendChild(d);const p=document.createElement("button");return p.type="button",p.textContent="Remove layer",p.addEventListener("click",()=>{this.cloudLayerSettings=this.cloudLayerSettings.filter(y=>y!==e),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),t.appendChild(p),t}renderCloudLayerControls(){if(this.els.cloudLayers){this.els.cloudLayers.innerHTML="";for(const e of this.cloudLayerSettings)this.els.cloudLayers.appendChild(this.createCloudLayerControls(e))}}getLeftStickSensitivity(){var t;const e=parseFloat((t=this.els.leftStickSensitivity)==null?void 0:t.value);return Number.isFinite(e)?e:1}getLookSensitivityX(){var t;const e=parseFloat((t=this.els.lookSensitivityX)==null?void 0:t.value);return Number.isFinite(e)?e:.4}getLookSensitivityY(){var t;const e=parseFloat((t=this.els.lookSensitivityY)==null?void 0:t.value);return Number.isFinite(e)?e:.4}isInvertLook(){var e;return!!((e=this.els.invertLook)!=null&&e.checked)}bindMobileControls(e,t){if(!this.els.mobileControls||!this.els.movePad||!this.els.lookPad)return;const i=(a,o)=>e==null?void 0:e.setAction(a,o),r=a=>e==null?void 0:e.trigger(a),s=(a,o,l)=>{let c=!1,h=null;const d=()=>{h=a.getBoundingClientRect()},f=p=>{h||d();const y=p.touches?p.touches[0]:p,m=y.clientX-h.left-h.width/2,u=y.clientY-h.top-h.height/2,v=Math.min(h.width,h.height)/2,_=Math.max(-v,Math.min(v,m)),x=Math.max(-v,Math.min(v,u)),M=_/v,S=x/v;o(M,S)},g=()=>{c=!1,l()};a.addEventListener("pointerdown",p=>{p.preventDefault(),c=!0,d(),f(p)}),window.addEventListener("pointermove",p=>{c&&(p.preventDefault(),f(p))}),window.addEventListener("pointerup",p=>{c&&(p.preventDefault(),g())}),a.addEventListener("touchstart",p=>{c=!0,d(),f(p)},{passive:!1}),a.addEventListener("touchmove",p=>{c&&f(p)},{passive:!1}),a.addEventListener("touchend",p=>{c&&g()},{passive:!1}),a.addEventListener("touchcancel",p=>{c&&g()},{passive:!1})};s(this.els.movePad,(a,o)=>{const l=Math.max(.1,this.getLeftStickSensitivity()),c=Math.max(.1,.25/l);i("forward",o<-c),i("backward",o>c),i("left",a<-c),i("right",a>c)},()=>{i("forward",!1),i("backward",!1),i("left",!1),i("right",!1)}),s(this.els.lookPad,(a,o)=>{const l=Math.max(.1,this.getLookSensitivityX()),c=Math.max(.1,this.getLookSensitivityY()),h=this.isInvertLook()?-1:1;e==null||e.addLookDelta(a*6*l,o*6*c*h)},()=>{}),this.els.mobileControls.querySelectorAll("[data-trigger]").forEach(a=>{const o=a.getAttribute("data-trigger"),l=()=>{r(o),o==="surface"&&t&&t()};a.addEventListener("pointerdown",c=>{c.preventDefault(),l()}),a.addEventListener("touchstart",c=>{c.preventDefault(),l()},{passive:!1})}),this.els.mobileControls.querySelectorAll(".action-btn[data-action]").forEach(a=>{const o=a.getAttribute("data-action"),l=()=>i(o,!0),c=()=>i(o,!1);a.addEventListener("pointerdown",h=>{h.preventDefault(),l()}),a.addEventListener("pointerup",h=>{h.preventDefault(),c()}),a.addEventListener("pointerleave",c),a.addEventListener("pointercancel",c),a.addEventListener("touchstart",h=>{h.preventDefault(),l()},{passive:!1}),a.addEventListener("touchend",h=>{h.preventDefault(),c()},{passive:!1}),a.addEventListener("touchcancel",h=>{h.preventDefault(),c()},{passive:!1})}),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.addEventListener("pointerdown",a=>{a.preventDefault(),r("surface"),t&&t()}),this.els.surfaceOnlyBtn.addEventListener("touchstart",a=>{a.preventDefault(),r("surface"),t&&t()},{passive:!1}))}}class OT{constructor(e,{maxSprites:t=1200}={}){this.scene=e,this.maxSprites=Math.max(16,Math.floor(t)),this.enabled=!0,this.center=new D,this.uniforms={time:{value:0},windWorld:{value:new D(0,0,0)},color:{value:new Se("#d3ecff")},opacity:{value:.85},radius:{value:12},height:{value:6},speed:{value:1.4}},this.mesh=this._buildMesh(),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWind(e){e&&this.uniforms.windWorld.value.copy(e)}setCenter(e){!e||!this.mesh||(this.center.copy(e),this.mesh.position.copy(e))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new xs(.35,.08),t=new qp;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const i=new Float32Array(this.maxSprites*3),r=new Float32Array(this.maxSprites);for(let o=0;o<this.maxSprites;o++){const l=o*3;i[l+0]=Math.random()*2-1,i[l+1]=Math.random(),i[l+2]=Math.random()*2-1,r[o]=Math.random()}t.setAttribute("aOffset",new Io(i,3)),t.setAttribute("aSeed",new Io(r,1)),t.instanceCount=this.maxSprites;const s=new Gt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!1,blending:Ao,side:Ln,vertexShader:`
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
            `}),a=new Vt(t,s);return a.renderOrder=1.25,a}}const zT=document.getElementById("viewport"),xf=document.getElementById("hud");document.getElementById("hudToggle");document.getElementById("hudContent");document.getElementById("status");const ji=document.getElementById("preset"),bu=document.getElementById("regen"),$o=document.getElementById("helpToggle"),cc=document.getElementById("helpPanel"),yf=document.getElementById("helpContent"),_f=document.getElementById("resolution"),bf=document.getElementById("plates"),wf=document.getElementById("plateSizeVariance"),Sf=document.getElementById("jitter"),Mf=document.getElementById("heightScale"),Ef=document.getElementById("iterations"),Tf=document.getElementById("erosionRate"),Af=document.getElementById("evaporation"),Cf=document.getElementById("seaLevel"),Rf=document.getElementById("smoothPasses"),Pf=document.getElementById("subdivisions"),Df=document.getElementById("iceCap");document.getElementById("plateDelta");document.getElementById("faultType");const Lf=document.getElementById("desymmetrizeTiling"),Yo=document.getElementById("atmosphere");document.getElementById("jitterValue");document.getElementById("heightScaleValue");document.getElementById("erosionRateValue");document.getElementById("evaporationValue");document.getElementById("seaLevelValue");document.getElementById("smoothPassesValue");document.getElementById("subdivisionsValue");document.getElementById("iceCapValue");document.getElementById("plateDeltaValue");document.getElementById("plateSizeVarianceValue");document.getElementById("atmosphereValue");const _o=document.getElementById("atmosphereHeight");document.getElementById("atmosphereHeightValue");const hr=document.getElementById("atmosphereToggle"),Um=document.getElementById("atmosphereAlpha");document.getElementById("atmosphereAlphaValue");const Fm=document.getElementById("atmosphereColor"),jo=document.getElementById("cloudToggle"),Xs=document.getElementById("cloudAlpha");document.getElementById("cloudAlphaValue");const $s=document.getElementById("cloudSpeed");document.getElementById("cloudSpeedValue");const Ys=document.getElementById("cloudQuantity");document.getElementById("cloudQuantityValue");const js=document.getElementById("cloudHeight");document.getElementById("cloudHeightValue");const Ks=document.getElementById("cloudColor"),Zs=document.getElementById("cloudResolution");document.getElementById("cloudResolutionValue");const Qs=document.getElementById("cloudShader"),If=document.getElementById("cloudLayers");jo&&(jo.checked=!1);const kT=document.getElementById("addCloudLayer"),qe=document.getElementById("waterCycleToggle"),Un=document.getElementById("waterCycleCloudToggle"),mi=document.getElementById("waterCycleRun"),la=document.getElementById("waterCycleStep"),hn=document.getElementById("weatherAutoScale"),is=document.getElementById("weatherSimMode"),Et=document.getElementById("weatherVolumeRes"),Uf=document.getElementById("weatherVolumeResValue"),_t=document.getElementById("weatherRayStepsMin"),Ff=document.getElementById("weatherRayStepsMinValue"),bt=document.getElementById("weatherRayStepsMax"),Nf=document.getElementById("weatherRayStepsMaxValue"),vt=document.getElementById("weatherRayBundle"),Bf=document.getElementById("weatherRayBundleValue"),dr=document.getElementById("weatherAtmoThickness"),Of=document.getElementById("weatherAtmoThicknessValue"),gi=document.getElementById("axialTilt"),zf=document.getElementById("axialTiltValue"),vi=document.getElementById("seasonProgress"),kf=document.getElementById("seasonProgressValue"),rs=document.getElementById("weatherDebug"),Yn=document.getElementById("volumeSlice"),vs=document.getElementById("volumeSliceValue");let Wn=null;const Oi=document.getElementById("weatherSpeed"),Vf=document.getElementById("weatherSpeedValue"),ft=document.getElementById("weatherUpdateHz"),Gf=document.getElementById("weatherUpdateHzValue"),Tt=document.getElementById("weatherMoistureLayers"),Hf=document.getElementById("weatherMoistureLayersValue"),zi=document.getElementById("weatherEvap"),Wf=document.getElementById("weatherEvapValue"),ki=document.getElementById("weatherPrecip"),qf=document.getElementById("weatherPrecipValue"),Vi=document.getElementById("weatherWind"),Xf=document.getElementById("weatherWindValue"),Gi=document.getElementById("weatherWetness"),$f=document.getElementById("weatherWetnessValue"),Hi=document.getElementById("weatherOceanInertia"),Yf=document.getElementById("weatherOceanInertiaValue"),Zn=document.getElementById("weatherOceanWindCoupling"),jf=document.getElementById("weatherOceanWindCouplingValue"),Qn=document.getElementById("weatherOceanWindUpdateHz"),Kf=document.getElementById("weatherOceanWindUpdateHzValue"),Wi=document.getElementById("oceanCurrentVizToggle"),qi=document.getElementById("oceanWaveVizToggle"),ss=document.getElementById("weatherRainFxToggle"),Xi=document.getElementById("weatherRainFx"),Zf=document.getElementById("weatherRainFxValue"),gn=document.getElementById("weatherRainHaze"),Qf=document.getElementById("weatherRainHazeValue"),fr=document.getElementById("waterShader"),Ko=document.getElementById("movePad"),Zo=document.getElementById("lookPad"),as=document.getElementById("mobileControls"),Js=document.getElementById("surfaceOnly");document.getElementById("configToggle");document.getElementById("configPanel");const Ui=document.getElementById("vrToggle"),Jf=document.getElementById("reticle"),bo=document.getElementById("leftStickSensitivity");document.getElementById("leftStickSensitivityValue");const wo=document.getElementById("lookSensitivityX");document.getElementById("lookSensitivityXValue");const So=document.getElementById("lookSensitivityY");document.getElementById("lookSensitivityYValue");const ea=document.getElementById("invertLook");document.getElementById("planetDiameter");document.getElementById("planetDiameterValue");const Nm=(()=>{const n=new Uint8Array([110,0,128,0]),e=new Jn(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=En,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Nt,e})(),VT=(()=>{const n=new Uint8Array([160,0,128,128]),e=new Jn(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=En,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Nt,e})();function GT(){if(Wn)return Wn;const n=new Op({map:Nm,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1,toneMapped:!1}),e=new kg(n);return e.renderOrder=999,e.scale.set(5,5,1),e.position.set(7.2,7.5,-12),wt.add(e),Wn=e,e}function HT(n){ch=n,!n&&Wn&&(Wn.visible=!1),n&&(GT(),Wn.visible=!0)}function WT(n){const e=document.getElementById("volumeSliceField");e&&(e.style.display=n?"block":"none")}function ep(n){if(!Yn)return;const e=Math.max(0,Number(Yn.max)||0),t=Math.min(Math.max(Math.floor(n),0),e);tl=t,Yn.value!==String(t)&&(Yn.value=t),vs&&(vs.textContent=t),Bm()}function wu(){if(!Yn)return;const n=ul(),e=(n==null?void 0:n.n)??0,t=Math.max(0,e-1);Yn.max=String(t),tl>t&&(tl=t,vs&&(vs.textContent=t))}function qT(){var f;const n=ph(),e=ul();if(!n||!e)return null;const t=e.n||0,i=na?4:1,r=Math.max(1,t*i);if(!pn||pn.image.width!==r||pn.image.height!==r){const g=new Uint8Array(Math.max(1,r*r*4));pn=new Jn(g,r,r,St,Lt),pn.needsUpdate=!0,pn.wrapS=pt,pn.wrapT=pt,pn.minFilter=Pt,pn.magFilter=Pt,pn.generateMipmaps=!1,pn.colorSpace=Nt}const s=Math.min(Math.max(tl|0,0),Math.max(0,t-1)),a=e.tilesX||1,o=s%a,l=Math.floor(s/a),c=(f=n.image)==null?void 0:f.data;if(!(c&&c.length>=e.atlasW*e.atlasH*4))return n;const h=pn.image.data,d=0;for(let g=0;g<t;g++){const p=((l*t+g)*e.atlasW+o*t)*4;for(let y=0;y<t;y++){const m=p+y*4,u=c[m]??0,v=c[m+1]??0,_=c[m+2]??128,x=c[m+3]??0,M=Math.min(255,u*2),S=M,E=Math.min(255,v+M*.3),C=Math.min(255,_),w=Math.max(160,x);if(!na){const N=g*r*4+y*4;h[N+0]=S,h[N+1]=E,h[N+2]=C,h[N+3]=w;continue}const b=y*i,R=g*i;for(let I=0;I<i;I++){const N=(R+I)*r*4;for(let O=0;O<i;O++){const H=N+(b+O)*4,k=O===0||I===0;h[H+0]=k?d:S,h[H+1]=k?d:E,h[H+2]=k?d:C,h[H+3]=k?255:w}}}}if(na&&r>1){const g=r-1;for(let y=0;y<r;y++){const m=(y*r+g)*4;h[m+0]=d,h[m+1]=d,h[m+2]=d,h[m+3]=255}const p=g*r*4;for(let y=0;y<r;y++){const m=p+y*4;h[m+0]=d,h[m+1]=d,h[m+2]=d,h[m+3]=255}}return pn.needsUpdate=!0,pn}function Bm(){if(!ch||!Wn)return;const n=qT();if(!n){Wn.visible=!1;return}Wn.visible=!0,Wn.material.map=n,Wn.material.needsUpdate=!0}const Rt=new BT({onRegen:()=>ap(),onPreset:n=>{Km(n),gA(n),Rt.setStatus("Preset applied. Regenerating…"),ap()},onDiameterChange:n=>TA(n),onAtmosphereUpdate:()=>Au(),onCloudUpdate:()=>Cu(),onVRToggle:()=>{xi?Jm():Qm()}});let ei;try{ei=new vT(zT)}catch(n){throw console.error("WebGL init failed",n),Rt.setStatus("WebGL context could not be created. Enable WebGL/hardware acceleration or disable XR emulation."),n}const $i=ei.renderer,ca=ei.scene,vr=ei.planetGroup,Os=ei.userGroup,wt=ei.camera,He=ei.controls,an=ei.dirLight,Ae=new eT(ei);let mn=null,uc=0;const XT={sunDir:{value:new D(0,1,0)}};function $T(){var o,l;mn&&(ca.remove(mn),mn.geometry.dispose(),(l=(o=mn.material).dispose)==null||l.call(o));const n=Math.max(.05,((Ie==null?void 0:Ie.radius)??un)*.2),e=new Wu(n,96,48),t=42,i=[];for(let c=0;c<t;c++){const h=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1),f=Math.sin(d);i.push(new D(Math.cos(h)*f,Math.cos(d),Math.sin(h)*f))}const r=e.attributes.position,s=new D;for(let c=0;c<r.count;c++){s.fromBufferAttribute(r,c).normalize();let h=0;for(const d of i){const f=s.angleTo(d);if(f<.25){const g=1-f/.25;h-=g*g*.08}}s.multiplyScalar(1+h),r.setXYZ(c,s.x*n,s.y*n,s.z*n)}r.needsUpdate=!0,e.computeVertexNormals();const a=new qg({color:14739181,roughness:.7,metalness:0,emissive:new Se(16777215),emissiveIntensity:.15});mn=new Vt(e,a),mn.castShadow=!0,mn.receiveShadow=!0,ca.add(mn)}const ct=new xT;ct.setMode(_s()?"mobile":"desktop");ct.setLookMode("orbit");function YT(){const n=t=>{if(!t)return!1;const i=t.tagName;return i?i==="INPUT"||i==="TEXTAREA"||t.isContentEditable:!1},e=t=>{if(n(t.target))return;const i=t.type==="keydown";switch(t.code){case"ControlLeft":case"ControlRight":case"KeyC":ct.setAction("down",i);break;case"Space":case"Numpad0":i&&ct.trigger("jump");break;default:return}};window.addEventListener("keydown",e,{passive:!1}),window.addEventListener("keyup",e,{passive:!1})}YT();const Qt=new nw(wt,$i.domElement,ca,()=>{He.enabled=!0,Rt.setStatus(""),jr&&(He.target.copy(jr.target),wt.position.copy(jr.position),jr=null),Xm(),hA(),ct.setLookMode("orbit")},ct),jT=new ev;let Bt=null,os=!1,Su=null,Om=null,KT=null,zm=null,km=[],Sn=null,jn=Ae.cloudLayerSettings,Ie=null,Me=null,Mo=null,ar=null,Mu=null,jr=null,xi=null,Eu=new Map;const Qo=new tu,hc=new Ee;let dc=!1;const so=new qn,tp=new ot,Kr=new Fe,ls=new D,Jo=new D,np=new Fe,ao=new D,Gr=new D,ip=new D,rp=new D,qr=new D,ZT=60;let Tu=null,el=-1,Zr=!1,Vm=Xu,lh=1/$u,ta=0,Qr=null,fc=null,ch=!1,na=!1,tl=0,pn=null,Gm=28,Hm=48,Eo=1,dn=null,pc=60;const uh=[{n:16,updateHz:4,rayMin:10,rayMax:20,bundle:4},{n:24,updateHz:5,rayMin:14,rayMax:26,bundle:3},{n:32,updateHz:6,rayMin:18,rayMax:32,bundle:2},{n:48,updateHz:7,rayMin:22,rayMax:38,bundle:2},{n:64,updateHz:8,rayMin:28,rayMax:48,bundle:1}],hh=[{updateHz:4,moistureLayers:1},{updateHz:6,moistureLayers:2},{updateHz:8,moistureLayers:3},{updateHz:10,moistureLayers:4}],Hr={lowMs:20,highMs:33,downDelayS:1.5,upDelayS:6,cooldownDownS:2,cooldownUpS:4},Ge={manual:null,tier3d:0,tier2d:0,emaMs:16.7,overBudgetS:0,underBudgetS:0,cooldownS:0},wn=new AT(ca,{maxDrops:12e3}),oo=new OT(ca,{maxSprites:950}),zs=new CT(vr),li=new RT(vr);dn=document.createElement("div");dn.style.position="fixed";dn.style.top="8px";dn.style.right="60px";dn.style.padding="4px 8px";dn.style.background="rgba(0,0,0,0.35)";dn.style.color="#fff";dn.style.fontSize="12px";dn.style.fontFamily="monospace";dn.style.borderRadius="6px";dn.style.pointerEvents="none";dn.textContent="fps: --";document.body.appendChild(dn);window.addEventListener("mousedown",n=>{if(n.button===1){if(n.preventDefault(),Qt.enabled){Qt.exit(),He.enabled=!0;return}if(hc.x=n.clientX/window.innerWidth*2-1,hc.y=-(n.clientY/window.innerHeight)*2+1,Qo.setFromCamera(hc,wt),Bt){jr={position:wt.position.clone(),target:He.target.clone()};const e=Qo.intersectObject(Bt,!1);if(e.length>0){const t=e[0].point;Qt.enter(t,Bt,wt),He.enabled=!1,Rt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)")}}}});$i.domElement.addEventListener("mousedown",n=>{var e,t;n.button===0&&Qt.enabled&&(_s()||xf&&xf.contains(n.target)||document.pointerLockElement!==$i.domElement&&((t=(e=$i.domElement).requestPointerLock)==null||t.call(e)))});function dh(){if(Qt.enabled){Qt.snapToSurface();return}if(!Bt)return;ct.setLookMode("surface"),Qo.setFromCamera(new Ee(0,0),wt);const n=Qo.intersectObject(Bt,!1);n.length&&(jr={position:wt.position.clone(),target:He.target.clone()},Qt.enter(n[0].point,Bt,wt),He.enabled=!1,Rt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)"))}Rt.setHudCollapsed(_s());function QT(){if(!as||!Ko||!Zo)return;const n=(i,r)=>ct==null?void 0:ct.setAction(i,r),e=i=>ct==null?void 0:ct.trigger(i),t=(i,r,s)=>{let a=!1,o=null;const l=()=>{o=i.getBoundingClientRect()},c=d=>{o||l();const f=d.touches?d.touches[0]:d,g=f.clientX-o.left-o.width/2,p=f.clientY-o.top-o.height/2,y=Math.min(o.width,o.height)/2,m=Math.max(-y,Math.min(y,g)),u=Math.max(-y,Math.min(y,p)),v=m/y,_=u/y;r(v,_)},h=()=>{a=!1,s()};i.addEventListener("pointerdown",d=>{d.preventDefault(),a=!0,l(),c(d)}),window.addEventListener("pointermove",d=>{a&&(d.preventDefault(),c(d))}),window.addEventListener("pointerup",d=>{a&&(d.preventDefault(),h())}),i.addEventListener("touchstart",d=>{a=!0,l(),c(d)},{passive:!1}),i.addEventListener("touchmove",d=>{a&&c(d)},{passive:!1}),i.addEventListener("touchend",d=>{a&&h()},{passive:!1}),i.addEventListener("touchcancel",d=>{a&&h()},{passive:!1})};t(Ko,(i,r)=>{const s=Math.max(.1,oA()),a=Math.max(.1,.25/s);n("forward",r<-a),n("backward",r>a),n("left",i<-a),n("right",i>a)},()=>{n("forward",!1),n("backward",!1),n("left",!1),n("right",!1)}),t(Zo,(i,r)=>{const s=Math.max(.1,lA()),a=Math.max(.1,cA()),o=uA()?-1:1;ct==null||ct.addLookDelta(i*6*s,r*6*a*o)},()=>{}),as.querySelectorAll("[data-trigger]").forEach(i=>{const r=i.getAttribute("data-trigger"),s=()=>{e(r),r==="surface"&&dh()};i.addEventListener("pointerdown",a=>{a.preventDefault(),s()}),i.addEventListener("touchstart",a=>{a.preventDefault(),s()},{passive:!1})}),as.querySelectorAll(".action-btn[data-action]").forEach(i=>{const r=i.getAttribute("data-action"),s=()=>n(r,!0),a=()=>n(r,!1);i.addEventListener("pointerdown",o=>{o.preventDefault(),s()}),i.addEventListener("pointerup",o=>{o.preventDefault(),a()}),i.addEventListener("pointerleave",a),i.addEventListener("pointercancel",a),i.addEventListener("touchstart",o=>{o.preventDefault(),s()},{passive:!1}),i.addEventListener("touchend",o=>{o.preventDefault(),a()},{passive:!1}),i.addEventListener("touchcancel",o=>{o.preventDefault(),a()},{passive:!1})}),Js&&(Js.addEventListener("pointerdown",i=>{i.preventDefault(),e("surface")}),Js.addEventListener("touchstart",i=>{i.preventDefault(),e("surface")},{passive:!1}))}function xa(){return Rt.getPlanetDiameterKm()}function fh(){return xa()/Bi}function Gn(){return qe!=null&&qe.checked&&(Me!=null&&Me.enabled)&&Me.ready&&Me.hasSurface?Me.getTexture():Nm}function ui(){return qe!=null&&qe.checked&&(Me!=null&&Me.enabled)&&Me.ready&&Me.hasSurface?Me.getAuxTexture():VT}function ph(){return!((qe==null?void 0:qe.checked)??!1)||!((Un==null?void 0:Un.checked)??!1)||!(Me!=null&&Me.enabled)||!Me.ready||!Me.hasSurface||typeof Me.getVolumeTexture!="function"?null:Me.getVolumeTexture()}function ul(){return!(Me!=null&&Me.enabled)||!Me.ready||!Me.hasSurface||typeof Me.getVolumeMeta!="function"?null:Me.getVolumeMeta()}function JT(n,e,t,i){var p;if(!((p=n==null?void 0:n.image)!=null&&p.data)||!t||(ao.copy(wt.position).multiplyScalar(e).applyMatrix3(t),ao.lengthSq()<1e-12))return(i??qr).set(0,0,0),i??qr;const r=ao.normalize(),s=Math.atan2(r.z,r.x)/(2*Math.PI)+.5,a=Math.asin(oe(r.y,-1,1))/Math.PI+.5,o=Dm(n,s,a),l=((o.b??128)/255-.5)*2,c=((o.a??128)/255-.5)*2,h=40;Gr.set(-r.z,0,r.x),Gr.lengthSq()<1e-8&&Gr.set(1,0,0),Gr.normalize(),ip.crossVectors(r,Gr).normalize(),rp.copy(Gr).multiplyScalar(l).addScaledVector(ip,c).multiplyScalar(h),np.copy(t).transpose();const d=(i??qr).copy(rp).applyMatrix3(np),f=ao.copy(wt.position).normalize();return d.addScaledVector(f,-d.dot(f)),d.length()>1e-6||d.set(0,0,0),d}function eA(){return ya()==="holistic"}function tA(){return fc||(fc=NT({resolution:32})),fc}function nA(){var e;const n=eA()&&((qe==null?void 0:qe.checked)??!1);if(!n&&Zr){(e=Ae==null?void 0:Ae.setOceanWindField)==null||e.call(Ae,null),Zr=!1,el=-1,Qr=null,ta=0;return}n&&!Zr&&(Zr=!0,el=-1,Qr=null,ta=lh)}function Wm(){if(!li)return;const n=(Wi==null?void 0:Wi.checked)??!1,e=(qi==null?void 0:qi.checked)??!1;li.setConfig({showCurrents:n,showWaves:e,visible:n||e})}function qm(){var r;if(!((r=Ae==null?void 0:Ae.oceanComputeSystem)!=null&&r.enabled))return;const n=ui(),e=Ae.oceanComputeSystem.gridW,t=Ae.oceanComputeSystem.gridH,i=DT(n,e,t,{maxWind:ZT,scale:Vm,out:Tu});i&&(Tu=i,Ae.setOceanWindField(i))}function hl(n){var t,i;if(!Bt)return;const e=Bt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.texture=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherMap&&(e.userData.shader.uniforms.uWeatherMap.value=n))}function dl(n){var t,i;if(!Bt)return;const e=Bt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.auxTexture=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherAuxMap&&(e.userData.shader.uniforms.uWeatherAuxMap.value=n))}function iA(n){var t,i;if(!Bt)return;const e=Bt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.strength=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherStrength&&(e.userData.shader.uniforms.uWeatherStrength.value=n))}function rA(n){var t,i;if(!Bt)return;const e=Bt.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.debug=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherDebug&&(e.userData.shader.uniforms.uWeatherDebug.value=n))}function sA(n,e){if(!n||!e)return;const t=(e.planetDiameterKm??xa())*1e3*.5,i={heightmap:n.data,size:n.size,seaLevel:e.seaLevel,planetRadiusM:t};Mu=i;const r=[Me,Mo,ar].filter(Boolean);for(const s of r)s!=null&&s.enabled&&s.ready&&s.setPlanetSurface(i);hl(Gn()),dl(ui())}function aA(){const e=Bi*1e3*.5/un;return Ob/e*fh()}function oA(){const n=parseFloat(bo==null?void 0:bo.value);return Number.isFinite(n)?n:1}function lA(){const n=parseFloat(wo==null?void 0:wo.value);return Number.isFinite(n)?n:.4}function cA(){const n=parseFloat(So==null?void 0:So.value);return Number.isFinite(n)?n:.4}function uA(){return!!(ea!=null&&ea.checked)}function Xm(){if(!Ie)return;const n=(Ie.radius??un)+(Ie.heightScale??0),e=fh(),t=Math.max(.5,n*e);He.minDistance=Math.max(.2,t*.1),He.maxDistance=Math.max(t*16,He.minDistance+1);const i=wt.position.clone().sub(He.target),r=i.length(),s=oe(r,He.minDistance,He.maxDistance);Math.abs(s-r)>1e-4&&(i.setLength(s),wt.position.copy(He.target).add(i)),wt.near=Math.max(.002,t*5e-4),wt.far=Math.max(150,t*14),wt.updateProjectionMatrix()}function hA(){He&&(He.state!==void 0&&(He.state=-1),He.keyState!==void 0&&(He.keyState=-1),He._movePrev&&He._moveCurr&&He._movePrev.copy(He._moveCurr),He._zoomStart&&He._zoomEnd&&He._zoomStart.copy(He._zoomEnd),He._panStart&&He._panEnd&&He._panStart.copy(He._panEnd))}function $m(){Ae.applyPlanetScale(xa()),Xm()}function Ym(){if(!as)return;const n=_s(),e=Qt.enabled;as.style.display="block",Ko&&(Ko.style.display=n&&e?"grid":"none"),Zo&&(Zo.style.display=n&&e?"grid":"none");const t=as.querySelector(".action-column");if(t&&(t.style.display=e?"grid":"none"),Js&&(Js.style.display=e?"none":"inline-flex"),Jf){const i=!n||e;Jf.style.display=i?"block":"none"}jm()}function jm(){if(!yf)return;const n=_s(),e=Qt.enabled;let t="";e?(t+="<h4>First Person</h4><ul>",n||(t+="<li>Mouse move to look (click to capture)</li>"),t+="<li>WASD to move, Shift to run, Space to jump</li>",t+="<li>Arrow keys to look, Q/E to roll</li>",t+="<li>F to toggle fly, Ctrl to descend, Esc to exit</li>",t+="<li>On-screen buttons: Jump, Fly, Surface, Exit, Run</li>",t+="</ul>",n&&(t+="<h4>Touch</h4><ul>",t+="<li>Left stick moves, right stick looks</li>",t+="</ul>")):(t+="<h4>Orbit</h4><ul>",t+="<li>Drag to orbit, scroll to zoom</li>",t+="<li>Middle click or Surface button to enter first person</li>",t+="</ul>"),yf.innerHTML=t}function dA(){if(!cc||!$o)return;const n=cc.style.display!=="block";cc.style.display=n?"block":"none",$o.setAttribute("aria-expanded",n.toString()),n&&jm()}function _r(){Rt.updateRangeLabels(),Oi&&Vf&&(Vf.textContent=Number(Oi.value).toFixed(0)),ft&&Gf&&(Gf.textContent=Number(ft.value).toFixed(0)),Et&&Uf&&(Uf.textContent=Number(Et.value).toFixed(0)),_t&&Ff&&(Ff.textContent=Number(_t.value).toFixed(0)),bt&&Nf&&(Nf.textContent=Number(bt.value).toFixed(0)),vt&&Bf&&(Bf.textContent=Number(vt.value).toFixed(0)),dr&&Of&&(Of.textContent=Number(dr.value).toFixed(0)),gi&&zf&&(zf.textContent=Number(gi.value).toFixed(1)),vi&&kf&&(kf.textContent=Number(vi.value).toFixed(2)),Tt&&Hf&&(Hf.textContent=Number(Tt.value).toFixed(0)),zi&&Wf&&(Wf.textContent=Number(zi.value).toFixed(2)),ki&&qf&&(qf.textContent=Number(ki.value).toFixed(2)),Vi&&Xf&&(Xf.textContent=Number(Vi.value).toFixed(2)),Gi&&$f&&($f.textContent=Number(Gi.value).toFixed(2)),Hi&&Yf&&(Yf.textContent=Number(Hi.value).toFixed(2)),Zn&&jf&&(jf.textContent=Number(Zn.value).toFixed(2)),Qn&&Kf&&(Kf.textContent=Number(Qn.value).toFixed(0)),Xi&&Zf&&(Zf.textContent=Number(Xi.value).toFixed(2)),gn&&Qf&&(Qf.textContent=Number(gn.value).toFixed(2))}function Km(n){Rt.applyPreset(n);const e=No[n]||No.balanced;vA(e),fr&&(fr.value=n==="fast"?"fast":"balanced")}function fA(){const n=Rt.readSettings();return n.waterShader=mh(),n}function pA(n){Rt.writeSettings(n)}function mA(){if(typeof window>"u")return null;const e=(new URLSearchParams(window.location.search||"").get("quality")||"").toLowerCase();return e==="fast"||e==="balanced"||e==="high"?e:null}function mh(){return(fr==null?void 0:fr.value)||"balanced"}function gA(n){if(typeof window>"u")return;const e=(n||"").toLowerCase();if(e!=="fast"&&e!=="balanced"&&e!=="high")return;const t=new URL(window.location.href);t.searchParams.set("quality",e),window.history.replaceState({},"",t)}function vA(n){const e=(s,a)=>!s||a===void 0||a===null?!1:(s.value=String(a),!0),t=(s,a)=>!s||a===void 0||a===null?!1:(s.checked=!!a,!0);let i=!1;i=t(qe,n.waterCycleEnabled)||i,i=t(Un,n.waterCycleCloudEnabled)||i,i=t(mi,n.waterCycleRun)||i,i=e(is,n.weatherSimMode)||i,i=e(Et,n.weatherVolumeRes)||i,i=e(_t,n.weatherRayStepsMin)||i,i=e(bt,n.weatherRayStepsMax)||i,i=e(vt,n.weatherRayBundle)||i,i=e(dr,n.weatherAtmoThickness)||i,i=e(gi,n.axialTilt)||i,i=e(vi,n.seasonProgress)||i,i=e(rs,n.weatherDebug)||i,i=e(Oi,n.weatherSpeed)||i,i=e(ft,n.weatherUpdateHz)||i,i=e(Tt,n.weatherMoistureLayers)||i,i=e(zi,n.weatherEvap)||i,i=e(ki,n.weatherPrecip)||i,i=e(Vi,n.weatherWind)||i,i=e(Gi,n.weatherWetness)||i,i=e(Hi,n.weatherOceanInertia)||i,i=e(Zn,n.weatherOceanWindCoupling)||i,i=e(Qn,n.weatherOceanWindUpdateHz)||i,i=t(ss,n.weatherRainFxEnabled)||i,i=e(Xi,n.weatherRainFx)||i,i=e(gn,n.weatherRainHaze)||i;let r=!1;hn&&n.weatherAutoScale!==void 0&&n.weatherAutoScale!==null&&(hn.checked=!!n.weatherAutoScale,hn.checked?(yh(),r=!0):t0({keepCurrent:!0})),i&&!r&&ua()}async function gh(n){var r,s;if(os)return;Qt.enabled&&(Qt.exit(),He.enabled=!0),os=!0,clearTimeout(Su),bu.disabled=!0,ji.disabled=!0,_f.disabled=!0,bf.disabled=!0,wf.disabled=!0,Lf.disabled=!0,Sf.disabled=!0,Mf.disabled=!0,Ef.disabled=!0,Tf.disabled=!0,Af.disabled=!0,Cf.disabled=!0,Yo.disabled=!0,_o.disabled=!0,Rf.disabled=!0,Pf.disabled=!0,Df.disabled=!0,_o.disabled=!0;const e={...fA(),planetDiameterKm:xa(),atmosphereEnabled:(hr==null?void 0:hr.checked)??!0,waterShader:mh()};pA(e);const t=[],i=vh();i.enabled&&t.push(i);for(const a of jn)a.enabled&&t.push(a);Ae.cloudLayerSettings=t;try{await Ae.generate(e,o=>Rt.setStatus(o)),Ie={...Ae.lastSettings||e},Bt=Ae.planet,Om=Ae.water,KT=Ae.freshwater,zm=((r=Ae.atmosphereSystem)==null?void 0:r.mesh)||null,km=((s=Ae.cloudSystem)==null?void 0:s.clouds)||[],Ae.forge&&sA(Ae.forge,e),hl(Gn()),dl(ui()),_h();const a=new D().copy(an.position).normalize();Li(a),fl(a,{force:!0}),$T(),$m(),Rt.setStatus(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(a){console.error(a),Rt.setStatus("Generation failed – check console")}finally{os=!1,bu.disabled=!1,ji.disabled=!1,_f.disabled=!1,bf.disabled=!1,wf.disabled=!1,Lf.disabled=!1,Sf.disabled=!1,Mf.disabled=!1,Ef.disabled=!1,Tf.disabled=!1,Af.disabled=!1,Cf.disabled=!1,Yo.disabled=!1,_o.disabled=!1,Rf.disabled=!1,Pf.disabled=!1,Df.disabled=!1}}function fl(n,e={}){var h,d,f;if(!Ie)return;const t=e.force===!0;if(!(((qe==null?void 0:qe.checked)??!1)&&((Un==null?void 0:Un.checked)??!1))){sp();return}const r=xA(),s=ph(),a=ul();if(!s||!a)return;const o=[Ie.radius,Ie.seaLevel,Ie.heightScale,Ie.subdivisions,a.atmoThicknessM??0].join("|");if(!t&&Sn&&((h=Sn.userData)==null?void 0:h.signature)===o){const g=((d=Sn.userData)==null?void 0:d.uniforms)||{};(f=g.color)!=null&&f.value&&g.color.value.set(r.color),g.opacity&&(g.opacity.value=r.alpha),g.quantity&&(g.quantity.value=r.quantity),g.noiseScale&&(g.noiseScale.value=Math.max(1,r.resolution)),g.mode&&(g.mode.value=r.mode==="billow"?1:r.mode==="cellular"?2:0),Sn.userData.settings=r;return}sp();const l=Ie.radius+Ie.heightScale*.2,c=Ae.cloudSystem.buildVolumeCloudMesh(l,Ie.subdivisions,n,Ie.radius,Ie.seaLevel,Ie.heightScale,r,s,a);c.userData.signature=o,Sn=c,vr.add(c)}function sp(){var n,e;Sn&&(vr.remove(Sn),Sn.geometry.dispose(),(e=(n=Sn.material).dispose)==null||e.call(n),Sn=null)}function vh(){return{id:"base",enabled:jo.checked,alpha:oe(parseFloat(Xs.value)||.74,0,1),speed:oe(parseFloat($s.value)||.9,0,2),quantity:oe(parseFloat(Ys.value)||.76,0,1),height:oe(parseFloat(js.value)||-2.4,-5,5),color:Ks.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(Zs.value)||256)),mode:Qs.value||"billow"}}function xA(){return{id:"water-cycle",enabled:(Un==null?void 0:Un.checked)??!1,alpha:oe(parseFloat(Xs==null?void 0:Xs.value)||.74,0,1),speed:oe(parseFloat($s==null?void 0:$s.value)||.9,0,2),quantity:oe(parseFloat(Ys==null?void 0:Ys.value)||.76,0,2),height:oe(parseFloat(js==null?void 0:js.value)||-2.4,-5,5),color:(Ks==null?void 0:Ks.value)||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(Zs==null?void 0:Zs.value)||256)),mode:(Qs==null?void 0:Qs.value)||"billow"}}function Li(n){var i;if(!Ie)return;const e=[],t=vh();t.enabled&&e.push(t);for(const r of jn)r.enabled&&e.push(r);Ae.cloudLayerSettings=e,Ae.rebuildClouds(n),km=((i=Ae.cloudSystem)==null?void 0:i.clouds)||[]}function yA(n){var o;if(!Ie)return;const e=oe(parseFloat(Yo.value)||.35,.05,1.5),t=oe(parseFloat(_o.value)||.5,0,5),i=oe(parseFloat(Um.value)||1,0,1),r=Fm.value||"#4da8ff",s=oe(parseFloat(gn==null?void 0:gn.value)||.9,0,2),a={...Ie,atmosphereEnabled:(hr==null?void 0:hr.checked)??!0,atmosphere:e,atmosphereHeight:t,atmosphereAlpha:i,atmosphereColor:r};Ae.updateAtmosphere(a,{map:Gn(),rainHaze:s}),zm=((o=Ae.atmosphereSystem)==null?void 0:o.mesh)||null,Ae.lastSettings={...Ae.lastSettings||{},...a},Ie={...Ie,...a}}function _A(n){const e=document.createElement("div");e.className="layer",e.style.border="1px solid var(--border)",e.style.padding="8px",e.style.marginBottom="8px";const t=document.createElement("div");t.textContent=`Layer ${n.label||jn.length+1}`,t.style.fontSize="12px",t.style.color="var(--muted)",e.appendChild(t);const i=(g,p,y,m,u)=>{const v=document.createElement("div");v.className="field";const _=document.createElement("label");_.textContent=g;const x=document.createElement("div");x.className="range-row";const M=document.createElement("input");M.type="range",M.min=y,M.max=m,M.step=u,M.value=n[p];const S=document.createElement("span");return S.className="value",S.textContent=Number(n[p]).toFixed(u<1?2:0),x.appendChild(M),x.appendChild(S),v.appendChild(_),v.appendChild(x),M.addEventListener("input",()=>{n[p]=parseFloat(M.value),S.textContent=Number(n[p]).toFixed(u<1?2:0),Li(new D().copy(an.position).normalize())}),v},r=document.createElement("label"),s=document.createElement("input");s.type="checkbox",s.checked=n.enabled,s.addEventListener("change",()=>{n.enabled=s.checked,Li(new D().copy(an.position).normalize())}),r.appendChild(s),r.append(" Layer enabled"),e.appendChild(r),e.appendChild(i("Alpha","alpha",0,1,.01)),e.appendChild(i("Speed","speed",0,2,.05)),e.appendChild(i("Quantity","quantity",0,1,.01)),e.appendChild(i("Height","height",-5,5,.05)),e.appendChild(i("Resolution","resolution",1,256,1));const a=document.createElement("div");a.className="field";const o=document.createElement("label");o.textContent="Shader";const l=document.createElement("select");["fbm","billow","cellular"].forEach(g=>{const p=document.createElement("option");p.value=g,p.textContent=g.charAt(0).toUpperCase()+g.slice(1),n.mode===g&&(p.selected=!0),l.appendChild(p)}),l.addEventListener("change",()=>{n.mode=l.value,Li(new D().copy(an.position).normalize())}),a.appendChild(o),a.appendChild(l),e.appendChild(a);const c=document.createElement("div");c.className="field";const h=document.createElement("label");h.textContent="Color";const d=document.createElement("input");d.type="color",d.value=n.color,d.addEventListener("input",()=>{n.color=d.value,Li(new D().copy(an.position).normalize())}),c.appendChild(h),c.appendChild(d),e.appendChild(c);const f=document.createElement("button");return f.type="button",f.textContent="Remove layer",f.addEventListener("click",()=>{jn=jn.filter(g=>g!==n),xh(),Li(new D().copy(an.position).normalize())}),e.appendChild(f),e}function xh(){If.innerHTML="";for(const n of jn)If.appendChild(_A(n))}function bA(){ct&&ct.setMode(_s()?"mobile":"desktop"),Ym()}function Zm(){const n=vr.scale.x?1/vr.scale.x:1,e=oe(parseFloat(gi==null?void 0:gi.value)||23.4,0,45),t=oe(parseFloat(vi==null?void 0:vi.value)||0,0,1),i=Po.degToRad(e),r=t*Math.PI*2,s=i*Math.sin(r),a=new D(Math.cos(s),Math.sin(s),.6).normalize().multiplyScalar(16);return an.position.copy(a),ls.copy(an.position).normalize(),Kr.identity(),Jo.copy(ls),Bt&&(Bt.getWorldQuaternion(so),so.invert(),tp.makeRotationFromQuaternion(so),Kr.setFromMatrix4(tp),Jo.copy(ls).applyQuaternion(so).normalize()),n}function wA(n){if(!mn)return;Math.max(.05,((Ie==null?void 0:Ie.radius)??un)*.2);const e=Math.max(3,((Ie==null?void 0:Ie.radius)??un)*4),t=Po.degToRad(8);uc+=n*.02;const i=Math.cos(uc),r=Math.sin(uc),s=e*i,a=e*Math.sin(t)*r,o=e*Math.cos(t)*r;mn.position.set(s,a,o),mn.lookAt(vr.position),XT.sunDir.value.copy(ls),UA(),an.target.position.set(0,0,0),an.target.updateMatrixWorld()}function SA(){var a,o,l,c,h,d,f;const n=jT.getDelta(),e=n>1e-6?1/n:0;pc=pc*.9+e*.1,dn&&(dn.textContent=`fps: ${pc.toFixed(1)}`),_r(),LA(n),xi&&EA(),Qt.enabled?Qt.update(n):ct.consume("surface")&&dh(),Ae.update(n,!Qt.enabled&&!os),Ym();const t=Zm();if(wA(n),((qe==null?void 0:qe.checked)??!1)&&((mi==null?void 0:mi.checked)??!0)&&(Me!=null&&Me.enabled)&&Me.update(n,Jo),Zr&&(Me==null?void 0:Me.readbackVersion)!=null){ta+=Math.min(Math.max(n,0),tw);const g=Me.readbackVersion;Number.isFinite(g)&&g!==el&&(Qr=g),Qr!==null&&ta>=lh&&(el=Qr,Qr=null,ta=0,qm())}if((a=Ae.atmosphereSystem)!=null&&a.uniforms){const g=Ae.atmosphereSystem.uniforms;(o=g.sunDir)!=null&&o.value&&g.sunDir.value.copy(ls),(l=g.planetInvRot)!=null&&l.value&&g.planetInvRot.value.copy(Kr),"planetInvScale"in g&&(g.planetInvScale.value=t);const p=Gn()||Ae.atmosphereSystem.defaultWeatherTexture;g.weatherMap?g.weatherMap.value=p:g.weatherMap={value:p};const y=oe(parseFloat(gn==null?void 0:gn.value)||.9,0,2);g.rainHaze&&(g.rainHaze.value=y)}if(Sn){const g=Math.min(n,.25),p=((c=Sn.userData)==null?void 0:c.uniforms)||{},y=((h=Sn.userData)==null?void 0:h.settings)||{},m=(y==null?void 0:y.speed)||1;((d=p.windOffset)==null?void 0:d.value)!==void 0&&(p.windOffset.value+=g*m*.3),p.planetInvRot&&p.planetInvRot.value.copy(Kr),p.planetInvScale&&(p.planetInvScale.value=t),p.weatherMap&&(p.weatherMap.value=Gn()),p.weatherAuxMap&&(p.weatherAuxMap.value=ui()),p.volumeAtlas&&(p.volumeAtlas.value=ph()??p.volumeAtlas.value);const u=ul();u&&(p.volumeN&&(p.volumeN.value=u.n),p.tilesX&&(p.tilesX.value=u.tilesX),p.atlasW&&(p.atlasW.value=u.atlasW),p.atlasH&&(p.atlasH.value=u.atlasH),p.volumeExtentM&&(p.volumeExtentM.value=u.extentM),p.metersPerUnit&&(p.metersPerUnit.value=(u.planetRadiusM??Zp)/un)),p.debugGrid&&(p.debugGrid.value=na?1:0),p.rayStepsMin&&(p.rayStepsMin.value=Gm),p.rayStepsMax&&(p.rayStepsMax.value=Hm),p.bundleSize&&(p.bundleSize.value=Eo)}Bm(),wn&&(wn.setWeatherFrame({planetInvRot:Kr,planetInvScale:t}),wn.setWeatherMap(Gn()));const r=JT(ui(),t,Kr,qr);if(wn&&wn.setWindWorld(r),oo&&(oo.setCenter(wt.position),oo.setWind(r),oo.update(n)),(f=Ae==null?void 0:Ae.waterUniforms)!=null&&f.windStrength&&(Ae.waterUniforms.windStrength.value=Math.min(Math.max(r.length()*1.5,.05),3)),Ae!=null&&Ae.setOceanWindVector&&Ae.setOceanWindVector(r),wn&&wn.update(n),zs&&Ie){const g=ch;zs.setVisible(g),g&&(zs.setWeatherTextures(Gn(),ui()),zs.setPlanetRadius(Ie.radius+Ie.heightScale*.1),zs.update())}const s=Ae==null?void 0:Ae.oceanComputeSystem;if(li&&(s!=null&&s.enabled)&&s.ready&&Ie){const g=(Wi==null?void 0:Wi.checked)??!1,p=(qi==null?void 0:qi.checked)??!1,y=g||p;li.setVisible(y),y&&(li.setPlanetRadius(Ie.radius+Ie.heightScale*.12),li.setOceanTexture(s.getTexture()),li.setWeatherTexture(Gn()),li.setWindField(Tu,s.gridW,s.gridH),li.update())}hl(Gn()),dl(ui()),Ae.setOceanWindTexture(ui()),ei.update(!Qt.enabled)}async function MA(){if(!(!navigator.xr||!Ui))try{dc=await navigator.xr.isSessionSupported("immersive-vr"),Ui.style.display=dc?"block":"none",Ui&&(Ui.disabled=!dc)}catch(n){console.warn("XR support check failed",n)}}async function Qm(){if(!navigator.xr){Rt.setStatus("WebXR not available");return}try{const n=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]});if(xi=n,$i.xr.enabled=!0,await $i.xr.setSession(n),He&&(He.enabled=!1),Bt&&!Qt.enabled){const e=((Ie==null?void 0:Ie.radius)??un)*fh()+((Ie==null?void 0:Ie.heightScale)??0),t=Math.max(e*2,30),i=wt.position.clone().sub(He.target);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const r=new D(0,0,0),s=r.clone().sub(i.multiplyScalar(t));Os.position.copy(s),Os.lookAt(r),wt.position.set(0,0,0),wt.rotation.set(0,0,0)}Ui.textContent="Exit VR",Rt.setStatus("VR session started"),n.addEventListener("end",()=>{xi=null,Eu.clear(),$i.xr.enabled=!1,Os.position.set(0,0,0),Os.rotation.set(0,0,0),Os.quaternion.identity(),He&&(He.enabled=!0),Ui.textContent="Enter VR",Rt.setStatus("")})}catch(n){console.error(n),Rt.setStatus("VR start failed")}}function Jm(){xi&&xi.end()}function EA(){if(!xi||!ct)return;let n=0,e=0;const t=.15;for(const i of xi.inputSources){const r=i.gamepad;if(!r)continue;const s=Eu.get(i)||[],a=r.buttons||[],o=r.axes||[];o.length>=4&&(n=o[2],e=o[3]);const l=a.map(c=>!!c&&c.pressed);l[0]&&!s[0]&&ct.trigger("jump"),l[1]&&!s[1]&&ct.trigger("flyToggle"),l[3]&&!s[3]&&ct.trigger("exit"),Eu.set(i,l)}ct.setAction("forward",e>t),ct.setAction("backward",e<-t),ct.setAction("left",n>t),ct.setAction("right",n<-t)}Ui&&Ui.addEventListener("click",()=>{xi?Jm():Qm()});bu.addEventListener("click",()=>gh(ji.value));function TA(n){const e=Number.isFinite(n)?n:xa();_r(),Ie&&(Ie.planetDiameterKm=e),$m(),os||Rt.setStatus(`Planet diameter set to ${e.toLocaleString()} km`)}function ap(){os||(clearTimeout(Su),Su=setTimeout(()=>gh(ji.value),400))}function Au(){_r(),yA(new D().copy(an.position).normalize())}function Cu(){_r();const n=new D().copy(an.position).normalize();Li(n),fl(n)}const AA=[qe,Un,mi,la,hn,is,Et,_t,bt,vt,rs,Oi,ft,Tt,zi,ki,Vi,Gi,Hi,Zn,Qn,Wi,qi,ss,Xi,gn].filter(Boolean);function To(n){for(const e of AA)e.disabled=n}const CA=[ft,Et,_t,bt,vt,Tt].filter(Boolean);function e0(n){for(const e of CA)e.disabled=n}function RA(){return{updateHz:ft==null?void 0:ft.value,volumeRes:Et==null?void 0:Et.value,rayMin:_t==null?void 0:_t.value,rayMax:bt==null?void 0:bt.value,rayBundle:vt==null?void 0:vt.value,moistureLayers:Tt==null?void 0:Tt.value}}function PA(n){n&&(ft&&n.updateHz!=null&&(ft.value=n.updateHz),Et&&n.volumeRes!=null&&(Et.value=n.volumeRes),_t&&n.rayMin!=null&&(_t.value=n.rayMin),bt&&n.rayMax!=null&&(bt.value=n.rayMax),vt&&n.rayBundle!=null&&(vt.value=n.rayBundle),Tt&&n.moistureLayers!=null&&(Tt.value=n.moistureLayers),ua())}function op(n){if(xr(n)){const s=oe(parseFloat(Et==null?void 0:Et.value)||8,1,128),a=oe(parseFloat(ft==null?void 0:ft.value)||1,1,20),o=oe(parseFloat(_t==null?void 0:_t.value)||28,1,128),l=oe(parseFloat(bt==null?void 0:bt.value)||48,1,128),c=oe(parseFloat(vt==null?void 0:vt.value)||1,1,100);let h=0,d=1/0;return uh.forEach((f,g)=>{const p=Math.abs(f.n-s)+Math.abs(f.updateHz-a)*2+Math.abs(f.rayMin-o)*.5+Math.abs(f.rayMax-l)*.5+Math.abs(f.bundle-c)*2;p<d&&(d=p,h=g)}),h}const e=oe(parseFloat(ft==null?void 0:ft.value)||1,1,20),t=oe(parseFloat(Tt==null?void 0:Tt.value)||2,1,4);let i=0,r=1/0;return hh.forEach((s,a)=>{const o=Math.abs(s.updateHz-e)*2+Math.abs(s.moistureLayers-t);o<r&&(r=o,i=a)}),i}function Hs(n){if(xr(n)){const e=uh[Ge.tier3d];if(!e)return;Et&&(Et.value=String(e.n)),ft&&(ft.value=String(e.updateHz)),_t&&(_t.value=String(e.rayMin)),bt&&(bt.value=String(e.rayMax)),vt&&(vt.value=String(e.bundle))}else{const e=hh[Ge.tier2d];if(!e)return;ft&&(ft.value=String(e.updateHz)),Tt&&(Tt.value=String(e.moistureLayers))}ua()}function yh(){Ge.manual=RA(),Ge.emaMs=16.7,Ge.overBudgetS=0,Ge.underBudgetS=0,Ge.cooldownS=0;const n=ya();xr(n)?Ge.tier3d=op(n):Ge.tier2d=op(n),e0(!0),Hs(n)}function t0(n={}){const e=!!n.keepCurrent;e0(!1),e||PA(Ge.manual),Ge.manual=null}function ya(){const n=((is==null?void 0:is.value)||"3d").toLowerCase();return n==="2d"?"2d":n==="holistic"?"holistic":"3d"}function xr(n){return n!=="2d"}function DA(){const n=parseFloat(Et==null?void 0:Et.value),e=Number.isFinite(n)?n:8;return oe(Math.round(e),1,128)}function lp(n){const e=xr(n),t=n==="holistic";Tt&&(Tt.disabled=e),Et&&(Et.disabled=!e),Zn&&(Zn.disabled=!t),Qn&&(Qn.disabled=!t)}let lo=0;async function n0(){const n=ya();lp(n),n==="holistic"&&tA();const e=++lo;try{if(xr(n)){const t=DA();if(ar&&ar.volumeN!==t&&(ar=null),!ar){const i=await _u();ar=await oh.create({volumeN:t,surfaceW:256,surfaceH:128,device:i||void 0})}if(e!==lo)return;Me=ar}else{if(!Mo){const t=await _u();Mo=await ah.create({gridWidth:256,gridHeight:128,device:t||void 0})}if(e!==lo)return;Me=Mo}}catch(t){if(console.warn("[WaterCycle] init failed",t),e!==lo)return;To(!0),qe&&(qe.checked=!1,qe.disabled=!0);return}if(!(Me!=null&&Me.enabled)){To(!0),qe&&(qe.checked=!1,qe.disabled=!0),mi&&(mi.checked=!1,mi.disabled=!0),la&&(la.disabled=!0);return}To(!1),lp(n),Mu&&Me.enabled&&Me.ready&&Me.setPlanetSurface(Mu),_h(),hl(Gn()),dl(ui()),fl(new D().copy(an.position).normalize())}function _h(){const n=ya(),e=oe(parseFloat(Oi==null?void 0:Oi.value)||1,0,60),t=oe(parseFloat(ft==null?void 0:ft.value)||1,1,20),i=oe(parseFloat(Tt==null?void 0:Tt.value)||2,1,4),r=oe(parseFloat(zi==null?void 0:zi.value)||1,0,3),s=oe(parseFloat(ki==null?void 0:ki.value)||1,0,3),a=oe(parseFloat(Vi==null?void 0:Vi.value)||1,0,3),o=oe(parseFloat(Gi==null?void 0:Gi.value)||.75,0,2),l=oe(parseFloat(Hi==null?void 0:Hi.value)||.25,.05,1),c=oe(parseFloat(Zn==null?void 0:Zn.value)||Xu,0,2),h=oe(parseFloat(Qn==null?void 0:Qn.value)||$u,1,20),d=(ss==null?void 0:ss.checked)??!0,f=oe(parseFloat(Xi==null?void 0:Xi.value)||1,0,2),g=oe(parseFloat(gn==null?void 0:gn.value)||.9,0,2),p=((rs==null?void 0:rs.value)||"off").toLowerCase(),y=p==="cloud"?1:p==="rain"?2:p==="pressure"?3:p==="soil"?4:p==="temp"?5:p==="snow"?6:p==="wind"?7:0,m=p==="volume"||p==="volume-grid";na=p==="volume-grid";let u=oe(parseFloat(_t==null?void 0:_t.value)||28,1,128),v=oe(parseFloat(bt==null?void 0:bt.value)||48,1,128);if(u>v){const S=u;u=v,v=S,_t&&(_t.value=String(u)),bt&&(bt.value=String(v))}Gm=u,Hm=v,Eo=oe(parseFloat(vt==null?void 0:vt.value)||1,1,100),vt&&vt.value!==String(Eo)&&(vt.value=String(Eo));const _=oe(parseFloat(dr==null?void 0:dr.value)||20,5,60),x=oe(parseFloat(gi==null?void 0:gi.value)||23.4,0,45),M=oe(parseFloat(vi==null?void 0:vi.value)||0,0,1);if(Me!=null&&Me.enabled&&Me.ready){const S={timeScale:e*60,readbackIntervalS:1/t,evapStrength:r,precipStrength:s,windStrength:a,oceanInertia:l,atmoThicknessM:_*1e3,axialTiltDeg:x,seasonPhase:M};n==="2d"&&(S.moistureLayers=i),Me.setConfig(S)}if(Vm=c,lh=1/h,Zr&&(Me!=null&&Me.enabled)&&qm(),iA(o),rA(y),HT(m),WT(m),Ae.setAtmosphereWeather(Gn(),g),wu(),wu(),Wm(),wn){const S=((qe==null?void 0:qe.checked)??!1)&&d;if(wn.setEnabled(S),wn.setStrength(f),wn.setDensity(oe(.15+f*.35,0,1)),Ie){const w=(Ie.radius??un)+(Ie.heightScale??0);wn.setPlanetNearRadius(w)}const E=aA(),C=.7+f*.65;wn.setSizes({dropLength:E*(6*C),dropWidth:E*(.08*C),volumeRadius:E*(340*C),volumeHeight:E*(260*C),fallDistance:E*(420*C)})}}function LA(n){if(!(hn!=null&&hn.checked)||!((qe==null?void 0:qe.checked)??!1))return;const e=Math.min(Math.max(n??0,0),.25);if(e<=0)return;const t=e*1e3;Ge.emaMs=Ge.emaMs*.9+t*.1;const i=Ge.emaMs>Hr.highMs,r=Ge.emaMs<Hr.lowMs;if(i?(Ge.overBudgetS+=e,Ge.underBudgetS=0):r?(Ge.underBudgetS+=e,Ge.overBudgetS=0):(Ge.overBudgetS=0,Ge.underBudgetS=0),Ge.cooldownS>0){Ge.cooldownS=Math.max(0,Ge.cooldownS-e);return}const s=ya();Ge.overBudgetS>=Hr.downDelayS?(xr(s)&&Ge.tier3d>0?(Ge.tier3d-=1,Hs(s)):s==="2d"&&Ge.tier2d>0&&(Ge.tier2d-=1,Hs(s)),Ge.cooldownS=Hr.cooldownDownS,Ge.overBudgetS=0):Ge.underBudgetS>=Hr.upDelayS&&(xr(s)&&Ge.tier3d<uh.length-1?(Ge.tier3d+=1,Hs(s)):s==="2d"&&Ge.tier2d<hh.length-1&&(Ge.tier2d+=1,Hs(s)),Ge.cooldownS=Hr.cooldownUpS,Ge.underBudgetS=0)}function ua(){_r(),n0(),wu(),_h(),nA(),Wm(),fl(new D().copy(an.position).normalize())}function IA(){hn!=null&&hn.checked?yh():t0()}[Yo,Um,Fm,hr].forEach(n=>{n.addEventListener(n.type==="color"?"input":"change",Au),n.type==="range"&&n.addEventListener("input",Au)});[jo,Xs,$s,Ys,js,Ks,Zs,Qs].forEach(n=>{n.addEventListener(n.type==="color"?"input":"change",Cu),n.type==="range"&&n.addEventListener("input",Cu)});[qe,Un,mi,is,Et,_t,bt,vt,dr,rs,Oi,ft,Tt,zi,ki,Vi,Gi,Hi,Zn,Qn,Wi,qi,ss,Xi,gn].forEach(n=>{n&&(n.addEventListener(n.type==="checkbox"?"change":n.type==="color"?"input":"change",ua),n.type==="range"&&n.addEventListener("input",ua))});hn&&hn.addEventListener("change",IA);$o&&$o.addEventListener("click",dA);Yn&&(Yn.addEventListener("input",n=>ep(Number(n.target.value))),Yn.addEventListener("change",n=>ep(Number(n.target.value))),vs&&(vs.textContent=Yn.value));la&&la.addEventListener("click",()=>{qe!=null&&qe.checked&&Me!=null&&Me.enabled&&Me.ready&&Me.hasSurface&&(Zm(),Me.update(0,Jo,{dtSimOverride:600,forceReadback:!0}))});hn!=null&&hn.checked&&yh();document.addEventListener("surface",dh);kT.addEventListener("click",()=>{const n=vh(),e=jn.length?jn[jn.length-1].height:n.height,t={...n,id:`extra-${Date.now()}`,height:e+.3};jn.push(t),xh(),Li(new D().copy(an.position).normalize())});window.addEventListener("resize",bA);[bo,wo,So].forEach(n=>{n&&n.addEventListener("input",_r)});ea&&ea.addEventListener("change",_r);To(!0);n0();(async()=>{var n;try{await Ae.initOceanCompute(),(n=Ae.oceanComputeSystem)!=null&&n.enabled&&console.log("[Ocean] WebGPU compute ocean initialized")}catch(e){console.warn("[Ocean] Failed to init compute ocean:",e)}})();fr&&fr.addEventListener("change",()=>{if(!Ie||!Ae.planet)return;const n=mh(),e=Ie,t=Ae.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,n);Ae.replaceWater(t),Om=Ae.water,Rt.setStatus(`Water shader: ${n}`)});const cp=mA();cp&&ji&&(ji.value=cp);Km(ji.value);gh(ji.value);xh();QT();$i.setAnimationLoop(SA);MA();function UA(){if(!mn)return;const n=new D().copy(ls).normalize().multiplyScalar(-1),e=new D().copy(wt.position).sub(mn.position).normalize(),t=Math.max(0,n.dot(e)),i=mn.material;i.emissiveIntensity=0,i.color.setScalar(.75+.25*t),i.needsUpdate=!0}
